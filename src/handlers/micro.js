const PR = require('./../PullRequest').default;
const {json} = require('micro');
const cors = require('../cors')()

const handler = async (req, res) => {
    try {
        const body = await json(req)
        const pr = new PR(body.user, body.repo, body.branch, body.token);
        pr.configure(body.files, body.commit, body.title, body.description);
        const { data } = await pr.send();
        return data;
    } catch(err) {
        console.log(err);
        const error = new Error(`Pull request can't be created!`)
        error.statusCode = 500
        throw error
    }
}

module.exports = cors(handler);
