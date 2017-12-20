const PR = require('./../PullRequest').default;
const {json} = require('micro');

const handler = async (req, res) => {
    const body = await json(req)

    try {
        const pr = await new PR(body.user, body.repo, body.files, body.desc || '')
        return pr.data
    } catch(err) {
        console.log(err);
        const error = new Error(`Pull request can't be created!`)
        error.statusCode = 500
        throw error
    }
}

module.exports = handler;
