// Self Publishing with PRB0t
const PR = require('./dist/PullRequest').default;
const fs = require('fs');

const files =  [
    `${__dirname}/README.md`,
    `${__dirname}/index.js`,
    `${__dirname}/publish.js`,
    `${__dirname}/package-lock.json`,
    `${__dirname}/package.json`,
    `${__dirname}/src/PullRequest.js`,
    `${__dirname}/webpack.config.js`,
    `${__dirname}/.gitignore`
].map(file => {
    return { path: file.replace(`${__dirname}/`, ''), content: fs.readFileSync(file).toString() };
})

new PR('PRB0t', 'PRB0t', files, '🤖').catch(e => console.log(e));


