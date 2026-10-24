const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const REGISTRATIONS_FILE = path.join(ROOT, "registrations.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  // Handle POST /api/register to persist registrations locally
  if (req.method === "POST" && req.url === "/api/register") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const entry = JSON.parse(body);
        entry.registeredAt = new Date().toISOString();
        let list = [];
        if (fs.existsSync(REGISTRATIONS_FILE)) {
          list = JSON.parse(fs.readFileSync(REGISTRATIONS_FILE, "utf8") || "[]");
        }
        list.push(entry);
        fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(list, null, 2));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, count: list.length }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: "Invalid payload" }));
      }
    });
    return;
  }

  // Serve static files
  const safeUrl = req.url.split("?")[0];
  const relativePath = safeUrl === "/" ? "index.html" : safeUrl.replace(/^\/+/, "");
  const filePath = path.join(ROOT, relativePath);

  // Prevent directory traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`TECHNOVATION 2026 Server running at http://localhost:${PORT}`);
});
