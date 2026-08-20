import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");
  const configuredBasePath = process.env.BASE_PATH?.trim() || "/";
  const basePath =
    configuredBasePath === "/"
      ? "/"
      : `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}/`;

  app.use(basePath, express.static(staticPath));

  // Handle client-side routing under the configured publication prefix.
  app.use(basePath, (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}${basePath}`);
  });
}

startServer().catch(console.error);
