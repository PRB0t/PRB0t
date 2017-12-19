import PR from './../PullRequest';

export function handler (event, context, done) {

    if (event.body) {
        event = JSON.parse(event.body);
    }

    new PR(event.user, event.repo, event.files, event.desc || '')
        .then((pr) => {
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
