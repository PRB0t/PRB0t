import { PullRequest } from './PullRequest';

jest.mock('octokit');

describe('PullRequest', () => {
  it('can be initialise', () => {
    expect(PullRequest.prototype.constructor).toBeDefined();
  });

  it('should allow to accept the valid arguments', () => {
    expect(() => new PullRequest()).toThrow();
    expect(() => new PullRequest('a', 'b')).not.toThrow();
  });

  it.todo('should use token from argument');
  it.todo('should use token from env variable');

  describe('Configure', () => {
    it('should throw without files configured', () => {
      expect(() => new PullRequest('a', 'b').configure()).toThrow();
    });
  });

  describe('Send', () => {
    it.todo('should allow to sen the pull request');
  });
});
