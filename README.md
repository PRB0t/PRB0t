# 🤖 CanadaBot
The Pull Request Bot for Anonymous contributions on GitHub!

---

Url: `POST`:`https://canada-pr-bot.herokuapp.com/`

Request Sample:
```json
{
  "user": "<github-user>",
  "repo": "<github-repo>",
  "title": "<pull-request-title>",
  "description": "<pull-request-description>",
  "commit": "<commit-description>",
  "files": [
  	{"path": "<file-path>", "content": "<file-content>"}
  ]
}
```

Or [try it](https://www.getpostman.com/collections/e9b9deac7148e7dd0473) in Postman!

## What can you do with it?

- If you have a static website hosted in github... you could add a button **Edit this page**.
- You can contribute anonymously to the *Internet 🕸*.
- You can upload files.

## Try it!
```
curl -X POST \
  https://canada-pr-bot.herokuapp.com/ \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
  "user": "canada-bot",
  "repo": "arepo",
  "description": "🤖",
  "title": "Review this",
  "commit": "a commit",
  "files": [
  	{"path": "README.md", "content": "Bleep bloop."}
  ]
}'
```

Or [try it](https://codepen.io/j-rewerts/pen/NmbXPx) in your browser!