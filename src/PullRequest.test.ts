import { Octokit } from 'octokit';
import { PullRequest } from './PullRequest';

jest.mock('octokit', () => {
  const git = {
    getRef: jest.fn(() => ({ data: {} })),
    createRef: jest.fn(() => ({ data: {} })),
    updateRef: jest.fn(() => ({ data: {} })),
    getCommit: jest.fn(() => ({ data: {} })),
    createCommit: jest.fn(() => ({ data: {} })),
    createTree: jest.fn(() => ({ data: {} })),
  };

  const repos = {
    get: jest.fn(() => ({})),
    createFork: jest.fn(() => ({ data: {} })),
    mergeUpstream: jest.fn(() => ({ data: {} })),
  };

  const users = {
    getAuthenticated: jest.fn(() => ({ data: {} })),
  };

  const pulls = {
    create: jest.fn(() => ({ data: {} })),
  };

  return {
    Octokit: function () {
      return {
        rest: {
          git,
          repos,
          users,
          pulls,
        },
      };
    },
  };
});

type PartialData<T extends PromiseLike<{ data: any }>> = Partial<
  Awaited<T>['data']
>;

type MockedMethod<F extends (...args: any[]) => any> = jest.Mock<{
  data: PartialData<ReturnType<F>>;
}>;

const mock = <
  T extends (...args: any) => any,
  R extends (...args: Parameters<T>) => PartialData<ReturnType<T>>,
>(
  fn: T,
  dataFn: R,
) => {
  if (!jest.isMockFunction(fn)) {
    throw Error('Cannot mock a non mock');
  }

  (fn as unknown as jest.Mock<R>).mockImplementation((...args) => ({
    data: dataFn(...args),
  }));
};

describe('PullRequest', () => {
  const mockOctoKit = new Octokit();

  it('should work with basic example', async () => {
    // Step 1 - Fetch current user
    mock(mockOctoKit.rest.users.getAuthenticated, () => ({
      login: 'something',
    }));

    // Step 2 - Get and set default branch
    mock(mockOctoKit.rest.repos.get, () => ({ name: '', default_branch: '' }));

    // Step 3 - Create fork
    mock(mockOctoKit.rest.repos.createFork, () => ({}));
    // Ensure fork is created
    mock(mockOctoKit.rest.repos.get, () => ({}));

    // Step 4 - Set current commit sha of the current default branch
    mock(mockOctoKit.rest.git.getRef, () => ({
      object: { type: '', sha: '', url: '' },
    }));

    // Step 5 - Update fork
    mock(mockOctoKit.rest.repos.mergeUpstream, () => ({}));

    // Step 6 - Create branch
    // Get the reference of the default branch
    mock(mockOctoKit.rest.git.getRef, () => ({
      object: { type: '', sha: '', url: '' },
    }));
    // Create a reference of the new branch
    mock(mockOctoKit.rest.git.createRef, () => ({}));

    // Step 7 - Create a tree with new files
    // Get commit from fork
    mock(mockOctoKit.rest.git.getCommit, () => ({
      tree: { sha: 'asd', url: '' },
    }));
    // Create a tree
    mock(mockOctoKit.rest.git.createTree, () => ({ sha: '' }));
    // Commit changes
    mock(mockOctoKit.rest.git.createCommit, () => ({ sha: '' }));

    // Step 8 - Update the fork branch head
    mock(mockOctoKit.rest.git.updateRef, () => ({}));

    // Step 9 - Create pull request
    mock(mockOctoKit.rest.pulls.create, () => ({}));

    const pr = PullRequest('PRB0t', 'PRB0t', 'master', 'aToken');
    pr.configure([{ path: 'foo.txt', content: 'bar' }], '🤖');
    await pr.send();
  });
});
