const PR = require('./../PullRequest').default;
const {json} = require('micro');
const origin = process.env.HOST_NAME || null;
const microCors = require('micro-cors');

const handler = async (req, res) => {

    try {
        const body = await json(req);

        // Set the commit author if requested.
        let author = {
            name: 'canada-bot',
            email: 'canada.pr.bot@gmail.com',
        };
        if (body.author) {
            author = body.author
        }

        const pr = new PR(body.user, body.repo, body.branch, body.token);
        pr.configure(body.files, body.commit, body.title, body.description, author);
        const { data } = await pr.send();
        return data;

    } catch(err) {

        console.log(err);
        const error = new Error(`Pull request can't be created!`);
        error.statusCode = 500;
        throw error;

    }
}

module.exports = origin ? microCors({ origin })(handler) : handler;
