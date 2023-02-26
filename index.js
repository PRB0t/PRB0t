"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/PullRequest.ts
var PullRequest_exports = {};
__export(PullRequest_exports, {
  DEFAULT_BRANCH_FROM: () => DEFAULT_BRANCH_FROM,
  PullRequest: () => PullRequest
});
module.exports = __toCommonJS(PullRequest_exports);
var import_octokit = require("./node_modules/octokit/dist-node/index.js");
var DEFAULT_BRANCH_FROM = Symbol("default-branch");
function PullRequest(branchFromUser = process.env.PR_BRANCH_FROM_USER, branchFromRepo = process.env.PR_BRANCH_FROM_REPO, branchFromBranch = process.env.PR_BRANCH_FROM_BRANCH ?? DEFAULT_BRANCH_FROM, token = process.env.GH_TOKEN) {
  if (!branchFromUser || !branchFromRepo) {
    throw new Error("Can't create a Pull Request without `user` and `repo`");
  }
  if (branchFromBranch === DEFAULT_BRANCH_FROM) {
    console.warn("Using default fork branch");
  }
  if (!token) {
    throw new Error("Can't create a Pull Request without the token");
  }
  const gh = new import_octokit.Octokit({ auth: token }).rest;
  const configuration = {
    files: [],
    commitMessage: "",
    titlePullRequest: "",
    descriptionPullRequest: "",
    commitAuthor: {
      name: "PRB0t",
      email: "34620110+PRB0t@users.noreply.github.com"
    }
  };
  const configure = (files, commitMessage, titlePullRequest, descriptionPullRequest, commitAuthor) => {
    configuration.files = files;
    configuration.commitMessage = `\u{1F916} ${commitMessage || "Anonymous Commit"}`;
    configuration.titlePullRequest = titlePullRequest ?? "\u{1F916} PRB0t";
    configuration.descriptionPullRequest = descriptionPullRequest ?? configuration.commitMessage;
    configuration.commitAuthor = commitAuthor ?? configuration.commitAuthor;
    return exports;
  };
  const setOriginalAndFork = async (state) => {
    return {
      original: {
        owner: branchFromUser,
        repo: branchFromRepo
      },
      fork: {
        owner: state.currentUser,
        repo: branchFromRepo
      }
    };
  };
  const setUser = async () => {
    const { data } = await gh.users.getAuthenticated();
    return {
      isBotBranch: data.login === branchFromUser,
      currentUser: data.login
    };
  };
  const setBranch = async () => {
    if (branchFromBranch !== DEFAULT_BRANCH_FROM) {
      return { branch: branchFromBranch };
    }
    const { data } = await gh.repos.get({
      owner: branchFromUser,
      repo: branchFromRepo
    });
    return {
      branch: data.source?.default_branch ?? data.default_branch
    };
  };
  const updateForkDefaultBranch = async (state) => {
    if (state.isBotBranch) {
      return;
    }
    try {
      await gh.repos.mergeUpstream({
        owner: state.currentUser,
        repo: branchFromRepo,
        branch: state.branch
      });
    } catch (err) {
      console.error(`Failed to update the fork with message: ${err?.message}`);
    }
  };
  const createBranch = async (state) => {
    const branch = `pr-${Date.now()}`;
    const { data } = await gh.git.getRef({
      owner: state.currentUser,
      repo: branchFromRepo,
      ref: `heads/${state.branch}`
    });
    await gh.git.createRef({
      owner: state.currentUser,
      repo: branchFromRepo,
      ref: `refs/heads/${branch}`,
      sha: data.object.sha
    });
    return {
      forkBranch: branch
    };
  };
  const createTree = async (state) => {
    const { data: commitSha } = await gh.git.getCommit({
      owner: state.currentUser,
      repo: branchFromRepo,
      commit_sha: state.commitSha
    });
    const { data } = await gh.git.createTree({
      owner: state.currentUser,
      repo: branchFromRepo,
      base_tree: commitSha.tree.sha,
      tree: configuration.files.map((file) => ({
        path: file.path,
        content: file.content,
        mode: "100644",
        type: "blob"
      }))
    });
    return { treeSha: data.sha };
  };
  const commitChanges = async (state) => {
    const { data } = await gh.git.createCommit({
      owner: state.currentUser,
      repo: branchFromRepo,
      tree: state.treeSha,
      author: configuration.commitAuthor,
      message: configuration.commitMessage,
      parents: [state.commitSha]
    });
    return { commitSha: data.sha };
  };
  const updateBranchHead = async (state) => {
    await gh.git.updateRef({
      owner: state.currentUser,
      repo: branchFromRepo,
      ref: `heads/${state.forkBranch}`,
      sha: state.commitSha
    });
  };
  const createPullRequest = async (state) => {
    await gh.pulls.create({
      base: state.branch,
      owner: branchFromUser,
      repo: branchFromRepo,
      head: `${state.currentUser}:${state.forkBranch}`,
      maintainer_can_modify: true,
      title: configuration.titlePullRequest || `\u{1F916} PRB0t ${state.forkBranch}`,
      body: `${configuration.descriptionPullRequest || configuration.commitMessage}
--
Automated submit by PRB0t`
    });
  };
  const createFork = async (state) => {
    await gh.repos.createFork({
      owner: branchFromUser,
      repo: branchFromRepo
    });
    const check = async (retry = 0) => {
      if (retry >= 60) {
        return;
      }
      try {
        await gh.repos.get({
          owner: state.currentUser,
          repo: branchFromRepo
        });
      } catch (e) {
        console.log(`Waiting for console to be created, retry: ${retry}`);
        await new Promise((resolve) => setTimeout(resolve, 1e3));
        await check(retry + 1);
      }
    };
    await check();
  };
  const pipeline = [
    ["Set user...", setUser],
    ["Set repositories", setOriginalAndFork],
    ["Set branch...", setBranch],
    ["Create a fork", createFork],
    [
      "Sert current sha...",
      (state) => setCurrentCommitSha({ ...state, ref: `heads/${state.branch}` })
    ],
    ["Update default fork...", updateForkDefaultBranch],
    ["Create branch...", createBranch],
    ["Create Tree...", createTree],
    ["Commit changes...", commitChanges],
    ["Update branch...", updateBranchHead],
    [
      "Set current sha...",
      (state) => setCurrentCommitSha({ ...state, ref: `heads/${state.forkBranch}` })
    ],
    ["Create pull request...", createPullRequest]
  ];
  const setCurrentCommitSha = async (state) => {
    const { data } = await gh.git.getRef({
      owner: state.currentUser,
      repo: branchFromRepo,
      ref: state.ref
    });
    return { commitSha: data.object.sha };
  };
  const send = () => {
    pipeline.reduce(
      async (state, [msg, fn]) => {
        console.log(msg);
        const currentState = await state;
        return Object.assign({}, currentState, await fn(currentState));
      },
      Promise.resolve({})
    );
    return exports;
  };
  const exports = {
    configure,
    send
  };
  return exports;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DEFAULT_BRANCH_FROM,
  PullRequest
});
