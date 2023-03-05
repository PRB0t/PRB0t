import { PullRequest } from './../PullRequest';

export function handler(event: any, context: any, done: any) {
  if (event.body) {
    event = JSON.parse(event.body);
  }

  const pr = new PullRequest(event.user, event.repo, event.branch, event.token);

  pr.configure(
    event.files,
    event.commit,
    event.title,
    event.description,
    event.coAuthors,
  );

  pr.send()
    .then((pr) => {
      console.log(pr);
      done(null, {
        statusCode: 200,
        body: JSON.stringify(pr),
      });
    })
    .catch((e) => {
      console.log(e);
      done(null, {
        statusCode: 500,
        body: "Pull request can't be created!",
      });
    });
}
