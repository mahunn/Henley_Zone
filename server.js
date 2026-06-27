const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";

if (dev) {
  console.warn("======================================================================");
  console.warn("⚠️  WARNING: NODE_ENV is not set to 'production'. Running in mode:", process.env.NODE_ENV || "development");
  console.warn("⚠️  On a cPanel server under memory limits (2 GB RAM), this will crash!");
  console.warn("⚠️  Ensure you configure NODE_ENV=production in the cPanel Node.js Manager.");
  console.warn("======================================================================");
}

const app = next({ dev });
const handle = app.getRequestHandler();

// Phusion Passenger dynamically provides the PORT via environment or pipe
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
