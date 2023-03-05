import { Octokit } from 'octokit';

export const DEFAULT_BRANCH_FROM = Symbol('default-branch');

type MaybeString = string | undefined;
type MaybeBranch = string | typeof DEFAULT_BRANCH_FROM;

type GithubUserRepo = {
  owner: string;
  repo: string;
};

type SendState = {
  original: GithubUserRepo;
  fork: GithubUserRepo;
  isBotBranch: boolean;
  currentUser: string;
  branch: string;
  forkBranch: string;
  treeSha: string;
  commitSha: string;
  pr: Awaited<ReturnType<Octokit['rest']['pulls']['create']>>['data'];
};

export function PullRequest(
  branchFromUser: MaybeString = process.env.PR_BRANCH_FROM_USER,
  branchFromRepo: MaybeString = process.env.PR_BRANCH_FROM_REPO,
  branchFromBranch: MaybeBranch = process.env.PR_BRANCH_FROM_BRANCH ??
    DEFAULT_BRANCH_FROM,
  token: MaybeString,
) {
  if (!branchFromUser || !branchFromRepo) {
    throw new Error("Can't create a Pull Request without `user` and `repo`");
  }

  if (branchFromBranch === DEFAULT_BRANCH_FROM) {
    console.warn('Using default fork branch');
  }

  token = token || process.env.GH_TOKEN;

  if (!token) {
    throw new Error("Can't create a Pull Request without the token");
  }

  const gh = new Octokit({ auth: token }).rest;

  const configuration = {
    files: [] as { path: string; content: string }[],
    commitMessage: '',
    titlePullRequest: '',
    descriptionPullRequest: '',
    commitAuthor: {
      name: 'PRB0t',
      email: '34620110+PRB0t@users.noreply.github.com',
    },
  };

  const getCoAuthors = (coAuthors?: { email: string; name: string }[]) => {
    if (!Array.isArray(coAuthors)) {
      return '';
    }

    const strAuthors = coAuthors.reduce((str, { email, name }) => {
      if (!email || !name) {
        return str;
      }

      if (/^\S+@\S+\.\S+$/.test(email) === false) {
        return str;
      }

      return `\nCo-authored-by: ${name} <${email}>`;
    }, '');

    return strAuthors.length > 0 ? `\n${strAuthors}` : '';
  };

  const configure = (
    files: { path: string; content: string }[],
    commitMessage?: string,
    titlePullRequest?: string,
    descriptionPullRequest?: string,
    coAuthors?: { email: string; name: string }[],
    commitAuthor?: { email: string; name: string },
  ) => {
    configuration.files = files;
    configuration.commitMessage = `🤖 ${
      commitMessage || 'Anonymous Commit'
    }${getCoAuthors(coAuthors)}`;
    configuration.titlePullRequest = titlePullRequest ?? '🤖 PRB0t';
    configuration.descriptionPullRequest =
      descriptionPullRequest ?? configuration.commitMessage;
    configuration.commitAuthor = commitAuthor ?? configuration.commitAuthor;

    return exports;
  };

  const setOriginalAndFork = async (state: SendState) => {
    return {
      original: {
        owner: branchFromUser,
        repo: branchFromRepo,
      },
      fork: {
        owner: state.currentUser,
        repo: branchFromRepo,
      },
    };
  };

  const setUser = async () => {
    const { data } = await gh.users.getAuthenticated();
    return {
      isBotBranch: data.login === branchFromUser,
      currentUser: data.login,
    };
  };

  const setBranch = async (state: SendState) => {
    if (branchFromBranch !== DEFAULT_BRANCH_FROM) {
      return { branch: branchFromBranch };
    }

    const { data } = await gh.repos.get({
      ...state.original,
    });

    // if allow_forking is false should throw

    return {
      branch: data.source?.default_branch ?? data.default_branch,
    };
  };

  // Interesting that github does something like this:
  // https://github.com/<User>/<branch>/branches/fetch_and_merge/master?discard_changes=true
  const updateForkDefaultBranch = async (state: SendState) => {
    if (state.isBotBranch) {
      return;
    }

    try {
      await gh.repos.mergeUpstream({
        ...state.fork,
        branch: state.branch,
      });
    } catch (err) {
      console.error(`Failed to update the fork with message: ${err?.message}`);
    }
  };

  const createBranch = async (state: SendState) => {
    const branch = `pr-${Date.now()}`;
    const { data } = await gh.git.getRef({
      ...state.fork,
      ref: `heads/${state.branch}`,
    });

    await gh.git.createRef({
      ...state.fork,
      ref: `refs/heads/${branch}`,
      sha: data.object.sha,
    });

    return {
      forkBranch: branch,
    };
  };

  const createTree = async (state: SendState) => {
    const { data: commitSha } = await gh.git.getCommit({
      ...state.fork,
      commit_sha: state.commitSha,
    });

    console.error(commitSha, state.commitSha);

    const { data } = await gh.git.createTree({
      ...state.fork,
      base_tree: commitSha.tree.sha,
      tree: configuration.files.map((file) => ({
        path: file.path,
        content: file.content,
        mode: '100644',
        type: 'blob',
      })),
    });
    return { treeSha: data.sha };
  };

  const commitChanges = async (state: SendState) => {
    const { data } = await gh.git.createCommit({
      ...state.fork,
      tree: state.treeSha,
      author: configuration.commitAuthor,
      message: configuration.commitMessage,
      parents: [state.commitSha],
    });

    return { commitSha: data.sha };
  };

  const updateBranchHead = async (state: SendState) => {
    await gh.git.updateRef({
      ...state.fork,
      ref: `heads/${state.forkBranch}`,
      sha: state.commitSha,
    });
  };

  const createPullRequest = async (state: SendState) => {
    const { data } = await gh.pulls.create({
      ...state.original,
      base: state.branch,
      head: `${state.currentUser}:${state.forkBranch}`,
      maintainer_can_modify: true,
      title: configuration.titlePullRequest || `🤖 PRB0t ${state.forkBranch}`,
      body: `${
        configuration.descriptionPullRequest || configuration.commitMessage
      }
--
Automated submit by PRB0t`,
    });

    return { pr: data };
  };

  const createFork = async (state: SendState) => {
    if (state.isBotBranch) {
      return;
    }

    await gh.repos.createFork({
      ...state.original,
    });
    const check = async (retry = 0) => {
      if (retry >= 60) {
        return;
      }

      try {
        await gh.repos.get({
          owner: state.currentUser,
          repo: branchFromRepo,
        });
      } catch (e) {
        console.log(`Waiting for console to be created, retry: ${retry}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await check(retry + 1);
      }
    };

    await check();
  };

  const pipeline: [
    string,
    (arg0: SendState) => Promise<Partial<SendState> | void>,
  ][] = [
    ['Set user...', setUser],
    ['Set repositories', setOriginalAndFork],
    ['Set branch...', setBranch],
    ['Create a fork', createFork],
    [
      'Sert current sha...',
      (state) =>
        setCurrentCommitSha({ ...state, ref: `heads/${state.branch}` }),
    ],
    ['Update default fork...', updateForkDefaultBranch],
    ['Create branch...', createBranch],
    ['Create Tree...', createTree],
    ['Commit changes...', commitChanges],
    ['Update branch...', updateBranchHead],
    ['Create pull request...', createPullRequest],
  ];

  const setCurrentCommitSha = async (state: SendState & { ref: string }) => {
    const { data } = await gh.git.getRef({
      owner: state.currentUser,
      repo: branchFromRepo,
      ref: state.ref,
    });

    return { commitSha: data.object.sha };
  };

  const send = async () => {
    const state = await pipeline.reduce<Promise<SendState>>(
      async <T>(state: Promise<T>, [msg, fn]: [string, (arg0: T) => any]) => {
        const currentState = await state;
        console.log(msg);
        return Object.assign({}, currentState, await fn(currentState));
      },
      Promise.resolve({} as SendState),
    );

    return state.pr;
  };

  const exports = {
    configure,
    send,
  };

  return exports;
}
