import PR from './../PullRequest';

export function handler (event, context, done) {

    if (event.body) {
        event = JSON.parse(event.body);
    }

    const pr = new PR(event.user, event.repo, event.branch, event.token)

    pr.configure(event.files, event.commit, event.title, event.description);

    pr.send().then((pr) => {
        console.log(pr);
        done(null, {
            statusCode: 200,
            body: JSON.stringify(pr.data)
        });
    }).catch((e) => {
        console.log(e);
        done(null, {
            statusCode: 500,
            body: 'Pull request can\'t be created!'
        });
    });

}
