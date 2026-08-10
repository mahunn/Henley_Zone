const { createServer } = require("http");
const http = require("http");
const { parse } = require("url");
const next = require("next");

process.env.NODE_ENV = process.env.NODE_ENV || "production";
const dev = process.env.NODE_ENV === "development";
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

// cPanel/Passenger sets PORT automatically
const port = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
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
          http
            .get(pingUrl, (res) => {
              res.resume();
            })
            .on("error", () => {
              /* silent */
            });
        }, 180000);
      }
    });
  })
  .catch((err) => {
    console.error("Error starting server:", err);
    process.exit(1);
  });


