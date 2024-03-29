# 🤖 PRB0t

The Pull Request Bot for Anonymous contributions on GitHub!

---

With PRB0t you can make pull request on GitHub by using a `JSON` description of the changes.

## Install

```
npm install -S @prb0t/pr
```

## Usage

```javascript
const pr = new PR(body.user, body.repo, body.branch, body.token);

pr.configure(
  [{ path: '<file-path>', content: '<file-content>' }],
  '<commit-message>',
  '<title>',
  '<description>',
  body.author || {
    name: 'PRB0t',
    email: '34620110+PRB0t@users.noreply.github.com',
  },
);

const { data } = await pr.send(); // data holds the response of the PR creation.
```

with docker:

```shell
docker run --rm p 8000:8000 ideabile/prb0t
```

## What can you do with it?

- If you have a static website hosted in github... you could add a button **Edit this page**.
- You can contribute anonymously to the _Internet 🕸_
- You can upload files...
- You can use your github for storage...
- ... etc... ecc..

## Try it!

```
curl -X POST \
  https://xrbhog4g8g.execute-api.eu-west-2.amazonaws.com/prod/prb0t \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
  "user": "PRB0t",
  "repo": "PRB0t",
  "description": "🤖",
  "title": "Dare to try",
  "commit": "a try",
  "files": [
  	{"path": "README.md", "content": "Failure is when you stop trying to do something."}
  ]
}'
```

## Contribute

[We're looking for Team members](https://github.com/PRB0t/PRB0t/issues/5) to form a little community around this little tool which we believe has a lot of potentialities ✨
