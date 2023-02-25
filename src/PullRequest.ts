import { Octokit } from 'octokit';

export const DEFAULT_BRANCH_FROM = Symbol('default-branch');

type MaybeString = string | undefined;
type MaybeBranch = string | typeof DEFAULT_BRANCH_FROM;

type SendState = {
  isBotBranch: boolean;
  currentUser: MaybeString;
  branch: MaybeString;
  forkBranch: MaybeString;
  currentDefaultBranchSha: MaybeString;
  treeSha: MaybeString;
  commitSha: MaybeString;
};

export function PullRequestFn(
  branchFromUser: MaybeString = process.env.PR_BRANCH_FROM_USER,
  branchFromRepo: MaybeString = process.env.PR_BRANCH_FROM_REPO,
  branchFromBranch: MaybeBranch = process.env.PR_BRANCH_FROM_BRANCH ??
    DEFAULT_BRANCH_FROM,
  token: MaybeString = process.env.GH_TOKEN,
) {
  if (!branchFromUser || !branchFromRepo) {
    throw new Error("Can't create a Pull Request without `user` and `repo`");
  }

  if (branchFromBranch === DEFAULT_BRANCH_FROM) {
    console.warn('Using default fork branch');
  }

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

  const configure = (
    files: { path: string; content: string }[],
    commitMessage?: string,
    titlePullRequest?: string,
    descriptionPullRequest?: string,
    commitAuthor?: { email: string; name: string },
  ) => {
    configuration.files = files;
    configuration.commitMessage = `🤖 ${commitMessage || 'Anonymous Commit'}`;
    configuration.titlePullRequest = titlePullRequest ?? '🤖 PRB0t';
    configuration.descriptionPullRequest =
      descriptionPullRequest ?? configuration.commitMessage;
    configuration.commitAuthor = commitAuthor ?? configuration.commitAuthor;

    return exports;
  };

  const setUser = async () => {
    const { data } = await gh.users.getAuthenticated();
    return {
      isBotBranch: data.login === branchFromUser,
      currentUser: data.login,
    };
  };

  const setBranch = async () => {
    if (branchFromBranch !== DEFAULT_BRANCH_FROM) {
      return { branch: branchFromBranch };
    }

    const { data } = await gh.repos.get({
      owner: branchFromUser,
      repo: branchFromRepo,
    });

    return {
      branch: data.source?.default_branch ?? data.default_branch,
    };
  };

  // Interesting that github does something like this:
  // https://github.com/M3kH/PRB0t/branches/fetch_and_merge/master?discard_changes=true
  const updateForkDefaultBranch = async (state: SendState) => {
    if (state.isBotBranch) {
      return;
    }

    try {
      await gh.repos.mergeUpstream({
        owner: state.currentUser,
        repo: branchFromRepo,
        branch: state.branch,
      });
    } catch (err: Error) {
      console.error(`Failed to update the fork ${err.message}`);
    }
  };

  const createBranch = async (state: SendState) => {
    const branch = `pr-${Date.now()}`;
    const { data } = await gh.git.getRef({
      owner: state.currentUser,
      repo: branchFromRepo,
      ref: `heads/${state.branch}`,
    });

    const { data: newRefData } = await gh.git.createRef({
      owner: state.currentUser,
      repo: branchFromRepo,
      ref: `refs/heads/${branch}`,
      sha: data.object.sha,
    });

    return {
      forkBranch: branch,
      currentDefaultBranchSha: newRefData.object.sha,
    };
  };

  const createTree = async (state: SendState) => {
    const { data: commitSha } = await gh.git.getCommit({
      owner: state.currentUser,
      repo: branchFromRepo,
      commit_sha: state.commitSha,
    });

    const { data } = await gh.git.createTree({
      owner: state.currentUser,
      repo: branchFromRepo,
      base_tree: commitSha.tree.sha,
      tree: configuration.files.map((file) => ({
        path: file.path,
        content: file.content,
        mode: '100644',
        type: 'blob',
      })),
    });
    // console.log(data); // ;
    return { treeSha: data.sha };
  };

  const commitChanges = async (state: SendState) => {
    console.log(state);
    const { data } = await gh.git.createCommit({
      owner: state.currentUser,
      repo: branchFromRepo,
      tree: state.treeSha,
      author: configuration.commitAuthor,
      message: configuration.commitMessage,
      parents: [state.commitSha],
    });

    console.log(data);

    return { commitSha: data.sha };
  };

  const updateBranchHead = async (state: SendState) => {
    await gh.git.updateRef({
      owner: state.currentUser,
      repo: branchFromRepo,
      ref: `heads/${state.forkBranch}`,
      sha: state.commitSha,
      // force: true,
    });
  };

  const createPullRequest = async (state: SendState) => {
    await gh.pulls.create({
      base: state.branch,
      owner: branchFromUser,
      repo: branchFromRepo,
      head: `${state.currentUser}:${state.forkBranch}`,
      maintainer_can_modify: true,
      title: configuration.titlePullRequest || `🤖 PRB0t ${state.forkBranch}`,
      body: `${
        configuration.descriptionPullRequest || configuration.commitMessage
      }
--
Automated submit by PRB0t`,
    });
  };

  const createFork = async (state: SendState) => {
    await gh.repos.createFork({
      owner: branchFromUser,
      repo: branchFromRepo,
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
        await new Promise((resolve) => setTimeout(() => resolve(), 1000));
        await check(retry + 1);
      }
    };

    await check();
  };

  const pipeline: [
    string,
    (arg0: SendState) => Promise<void | Partial<SendState>>,
  ][] = [
    ['Set user...', setUser],
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
    [
      'Set current sha...',
      (state) =>
        setCurrentCommitSha({ ...state, ref: `heads/${state.forkBranch}` }),
    ],
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

  const send = () => {
    pipeline.reduce<Promise<SendState>>(
      async <T>(state: Promise<T>, [msg, fn]: [string, (arg0: T) => any]) => {
        const currentState = await state;
        console.log(msg);
        return Object.assign({}, currentState, await fn(currentState));
      },
      Promise.resolve({
        isBotBranch: false,
        currentUser: undefined,
        branch: undefined,
      }),
    );

    return exports;
  };

  const exports = {
    configure,
    send,
  };

  return exports;
}

const unless =
  <T, S>(predicate: (arg0: T) => S) =>
  (value: T) => {
    const res = predicate(value);
    if (res) {
      return res;
    }

    return value;
  };

const fromPromise = <T, S>(a: Promise<T>, fn1: (arg0: T) => S): Promise<S> =>
  Promise.resolve(a).then(fn1);
