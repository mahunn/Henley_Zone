const { createServer } = require("http");
const http = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// cPanel/Passenger sets PORT automatically
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);

    // Self-ping every 3 minutes to keep Node process alive against Passenger idle sleep
    if (!dev) {
      setInterval(() => {
        const pingUrl = `http://127.0.0.1:${port}/api/ping`;
        http.get(pingUrl, (res) => {
          res.resume();
        }).on("error", () => {
          /* silent */
        });
      }, 180000);
    }
  });
});

