const PR = require('./../PullRequest').default;
const {json} = require('micro');
const origin = process.env.HOST_NAME || null;
const microCors = require('micro-cors');

const handler = async (req, res) => {

    try {

        const body = await json(req);
        const pr = new PR(body.user, body.repo, body.branch, body.token);

        pr.configure(
            body.files,
            body.commit,
            body.title,
            body.description,
            body.author || {
                name: 'PRB0t',
                email: '34620110+PRB0t@users.noreply.github.com',
            }
        );

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
