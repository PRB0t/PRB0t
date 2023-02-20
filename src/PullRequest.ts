export class PullRequest {
  constructor(
    private user: string,
    private repo: string,
    private branch?: string = undefined,
    private token?: string = undefined,
  ) {
    if (!user || !repo) {
      throw new Error('Properites `user` and `repo` are required');
    }
  }

  public configure(
    files: { [key: string]: string },
    commitMessage: string,
    titlePullRequest: string,
  ) {}
}
