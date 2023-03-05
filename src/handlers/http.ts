import http from 'http';
import { PullRequest } from '../PullRequest';

const host = '0.0.0.0';
const port = 8000;

const parseBody = async (request: http.IncomingMessage) => {
  let body = '';

  for await (const chunk of request) {
    body += chunk.toString();
  }

  return body;
};

const server = http.createServer(async (req, res) => {
  if (req.method !== 'POST') {
    res.writeHead(404);
    res.end('Not found!');
    return;
  }

  try {
    const body = await parseBody(req);
    const event = JSON.parse(body || '{}');

    const pr = new PullRequest(
      event.user,
      event.repo,
      event.branch,
      event.token,
    );

    pr.configure(
      event.files,
      event.commit,
      event.title,
      event.description,
      event.coAuthors,
    );

    const result = await pr.send();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
  } catch (e) {
    console.log(e);
    res.writeHead(500);
    res.end("Pull request can't be created!");
  }
});

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
