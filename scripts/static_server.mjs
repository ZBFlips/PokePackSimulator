import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, relative, resolve } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

function getFilePath(urlPath) {
  const trimmed = urlPath === "/" ? "/index.html" : urlPath;
  const normalizedPath = normalize(decodeURIComponent(trimmed)).replace(/^(\.\.[/\\])+/, "");
  const candidate = resolve(root, `.${normalizedPath}`);
  const relativePath = relative(root, candidate);
  if (relativePath.startsWith("..")) {
    return null;
  }
  return candidate;
}

async function resolveRequestPath(urlPath) {
  const candidate = getFilePath(urlPath);
  if (!candidate) return null;

  try {
    const stats = await stat(candidate);
    if (stats.isDirectory()) {
      const indexPath = join(candidate, "index.html");
      if (existsSync(indexPath)) return indexPath;
      return null;
    }
    return candidate;
  } catch {
    return null;
  }
}

const server = createServer(async (req, res) => {
  const method = req.method || "GET";
  if (!["GET", "HEAD"].includes(method)) {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }

  const requestUrl = new URL(req.url || "/", `http://127.0.0.1:${port}`);
  const filePath = await resolveRequestPath(requestUrl.pathname);
  if (!filePath) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const type = contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": type,
  });

  if (method === "HEAD") {
    res.end();
    return;
  }

  createReadStream(filePath).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static server running at http://127.0.0.1:${port}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
