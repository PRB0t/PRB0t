// Self Publishing with PRB0t
const { PullRequest } = require('./index');
const fs = require('fs');

const files = [
  `${__dirname}/README.md`,
  `${__dirname}/index.js`,
  `${__dirname}/publish.js`,
  `${__dirname}/package-lock.json`,
  `${__dirname}/package.json`,
  `${__dirname}/src/PullRequest.ts`,
  `${__dirname}/.gitignore`,
].map((file) => {
  return {
    path: file.replace(`${__dirname}/`, ''),
    content: fs.readFileSync(file).toString(),
  };
});

new PullRequest('PRB0t', 'PRB0t').configure(files, '🤖').send();
