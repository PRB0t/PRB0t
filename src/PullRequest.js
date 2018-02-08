const GitHub = require('github-api');
const gh_token = process.env.GH_TOKEN || false;

export default class PullRequest {

    constructor(
        user,
        repo,
        branch,
        token = null
    ) {

        this.gh = new GitHub({
            token: token || gh_token
        });
        this.botUser = this.gh.getUser();

        this.filesToCommit = [];

        this.isBotRepo = this.botUser.login === user;
        this.currentCommitSHA = null;
        this.currentTreeSHA = null;
        this.user = user;
        this.masterRepo = repo;
        this.branch = branch || 'master';
        this.forkBranch = `pr-${this._getCurrentTimestamp()}`;

    }

    configure(
        files,
        commitMessage = null,
        titlePullRequest = null,
        descriptionPullRequest = null
    ) {

        this.commitMessage = `🤖 ${commitMessage || 'Anonymous Commit'}`;
        this.titlePullRequest = titlePullRequest;
        this.descriptionPullRequest = descriptionPullRequest;
        this.files = files;

    }

    send() {

        console.log('Create fork...');
        return this._fork()
            .then(() => {
                console.log('Create branch...');
                return this._createBranch()
            })
            .then(() => {
                console.log('Set commit SHA...');
                return this._setCurrentCommitSHA()
            })
            .then(() => {
                console.log('Set Tree SHA');
                return this._setCurrentTreeSHA()
            })
            .then(() => {
                console.log('Push files');
                return this._pushFiles(this.files)
            })
            .then(() => {
                console.log('Set commit SHA...');
                return this._setCurrentCommitSHA(`heads/${this.forkBranch}`)
            })
            .then(() => {
                console.log('Create Tree SHA...');
                return this._createTree()
            })
            .then(() => {
                console.log('Commit SHA...');
                return this._commitChanges()
            })
            .then(() => {
                console.log('Update HEAD SHA...');
                return this._updateHead()
            })
            .then(() => {
                console.log('Creating PR...');
                return this._createPullRequest();
            });

    }

    get fullRepoName () {

        return `${this.user}/${this.masterRepo}`;

    }

    get repo() {

        if (!this._repo) {
            this._repo = this.gh.getRepo(this.fullRepoName);
        }

        return this._repo;

    }

    _fork() {

        return new Promise((resolve, reject) => {

            if (this.isBotRepo) {
                this.fork = this.repo;
                return resolve();
            }

            return this.repo.fork().then(res => {
                resolve(res);
                this.fork = this.gh.getRepo(res.data.full_name);
            }).catch(reject);

        });

    }

    _createBranch() {

        return this.fork.createBranch('master', this.forkBranch);

    }

    _setCurrentCommitSHA(reference = 'heads/master') {

        return this.fork.getRef(reference)
            .then((ref) => {
                this.currentCommitSHA = ref.data.object.sha;
            });

    }

    _setCurrentTreeSHA() {

        return this.repo.getCommit(this.currentCommitSHA)
            .then((commit) => {
                this.currentTreeSHA = commit.data.tree.sha;
            });

    }

    _getCurrentTimestamp() {

        const date = new Date(),
              yyyy = date.getFullYear().toString(),
              mm = (date.getMonth()+1).toString(),
              dd  = date.getDate().toString(),
              M  = date.getMinutes().toString(),
              S  = date.getSeconds().toString();

        return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0] ) + M + S;

    }

    _createFile(file) {

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

    _createTree() {
        return this.fork.createTree(this.filesToCommit, this.currentTreeSHA)
            .then((tree) => {
                this.currentTreeSHA = tree.data.sha;
            });
    }

    _pushFiles(files) {

        return Promise.all(files.map(file => this._createFile(file)));

    }

    _commitChanges() {

        return this.fork.commit(this.currentCommitSHA, this.currentTreeSHA, this.commitMessage)
            .then((commit) => {
                this.currentCommitSHA = commit.data.sha;
            });

    }

    _updateHead() {

        return this.fork.updateHead(
            `heads/${this.forkBranch}`,
            this.currentCommitSHA
        );

    }

    _createPullRequest() {

        return this.repo.createPullRequest({
            title: this.titlePullRequest || `🤖 PRB0t ${this.forkBranch}`,
            body: `${this.descriptionPullRequest || this.commitMessage}
--
Automated submit by PRB0t`,
            base: 'master',
            head: `PRB0t:${this.forkBranch}`
        });

    }


}
