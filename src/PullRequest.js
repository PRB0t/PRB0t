const GitHub = require('github-api');
const gh_token = process.env.GH_TOKEN || false;

export default class PullRequest {

    get fullRepoName () {

        return `${this.user}/${this.masterRepo}`;

    }

    get repo() {

        if (!this._repo) {
            this._repo = this.gh.getRepo(this.fullRepoName);
        }

        return this._repo;

    }

    fork() {

        return new Promise((resolve, reject) => {
            if (this.isForked) {
                this.fork = this.repo;
                return resolve();
            }
            this.repo.fork().then(res => {
                resolve(res);
                this.fork = this.gh.getRepo(res.data.full_name);
            }).catch(reject);
        });

    }

    createBranch() {

        return this.fork.createBranch('master', this.forkBranch);

    }

    setCurrentCommitSHA(reference = 'heads/master') {

        return this.fork.getRef(reference)
            .then((ref) => {
                this.currentCommitSHA = ref.data.object.sha;
            });

    }

    setCurrentTreeSHA() {

        return this.repo.getCommit(this.currentCommitSHA)
            .then((commit) => {
                this.currentTreeSHA = commit.data.tree.sha;
            });

    }

    getCurrentTimestamp() {

        const date = new Date(),
              yyyy = date.getFullYear().toString(),
              mm = (date.getMonth()+1).toString(),
              dd  = date.getDate().toString(),
              M  = date.getMinutes().toString(),
              S  = date.getSeconds().toString();

        return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0] ) + M + S;

    }

    createFile(file) {

        return this.fork.createBlob(file.content)
            .then((blob) => {
                this.filesToCommit.push({
                    sha: blob.data.sha,
                    path: file.path,
                    mode: '100644',
                    type: 'blob'
                });
            });

    }

    createTree() {
        return this.fork.createTree(this.filesToCommit, this.currentTreeSHA)
            .then((tree) => {
                this.currentTreeSHA = tree.data.sha;
            });
    }

    pushFiles() {

        return Promise.all(this.files.map(file => this.createFile(file)));

    }

    commitChanges() {

        return this.fork.commit(this.currentCommitSHA, this.currentTreeSHA, this.commitMessage)
            .then((commit) => {
                this.currentCommitSHA = commit.data.sha;
            });

    }

    updateHead() {

        return this.fork.updateHead(
            `heads/${this.forkBranch}`,
            this.currentCommitSHA
        );

    }

    createPullRequest() {

        return this.repo.createPullRequest({
            title: `ð¤  PRB0t ${this.forkBranch}`,
            body: `Automated submit by PRB0t`,
            base: 'master',
            head: `PRB0t:${this.forkBranch}`
        })

    }

    constructor(user, repo, files, commitMessage, isForked = false) {

        this.gh = new GitHub({
            token: gh_token
        });

        this.filesToCommit = [];
        this.files = files;

        this.isForked = isForked;
        this.currentCommitSHA = null;
        this.currentTreeSHA = null;
        this.user = user;
        this.masterRepo = repo;
        this.commitMessage = `ð¤ PRB0t - ${commitMessage}`;
        this.branch = 'master';
        this.forkBranch = `pr-${this.getCurrentTimestamp()}`;

        console.log('Create fork...');
        return this.fork()
            .then(() => {
                console.log('Create branch...');
                return this.createBranch()
            })
            .then(() => {
                console.log('Set commit SHA...');
                return this.setCurrentCommitSHA()
            })
            .then(() => {
                console.log('Set Tree SHA');
                return this.setCurrentTreeSHA()
            })
            .then(() => {
                console.log('Push files');
                return this.pushFiles()
            })
            .then(() => {
                console.log('Set commit SHA...');
                return this.setCurrentCommitSHA(`heads/${this.forkBranch}`)
            })
            .then(() => {
                console.log('Create Tree SHA...');
                return this.createTree()
            })
            .then(() => {
                console.log('Commit SHA...');
                return this.commitChanges()
            })
            .then(() => {
                console.log('Update HEAD SHA...');
                return this.updateHead()
            })
            .then(() => {
                console.log('Creating PR...');
                return this.createPullRequest();
            });

    }

}
