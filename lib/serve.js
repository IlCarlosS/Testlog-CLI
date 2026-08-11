const http = require("http");
const path = require("path");
const { findConfigDir } = require("./utils");
const { collectAll } = require("./collect");
const { renderPage } = require("./report-html");

function buildSummary(entries) {
  const tests = entries.filter((e) => e.tipo === "test" && e.data);
  const porEstado = {};
  for (const e of tests) {
    const estado = e.data.estado || "desconocido";
    porEstado[estado] = (porEstado[estado] || 0) + 1;
  }
  return {
    totalTests: tests.length,
    totalDevlog: entries.filter((e) => e.tipo === "devlog").length,
    porEstado,
  };
}

function toApiEntry(configDir, e) {
  return {
    file: path.relative(configDir, e.filePath),
    tipo: e.tipo,
    error: e.error,
    data: e.data,
    body: e.body,
  };
}

function serve(options) {
  const configDir = findConfigDir(process.cwd());
  if (!configDir) {
    console.error('No se encontró una carpeta "testlog/" en este proyecto.');
    console.error("Ejecuta primero: npx testlog init");
    process.exitCode = 1;
    return;
  }

  const port = parseInt(options.port, 10) || 3000;

  const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/index.html") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(renderPage());
      return;
    }

    if (req.url === "/api/entries") {
      // Se relee todo del disco en cada request: así "vista en vivo"
      // significa simplemente que siempre refleja el estado actual de los .md.
      const entries = collectAll(configDir).map((e) => toApiEntry(configDir, e));
      const summary = buildSummary(entries);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ entries, summary }));
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("No encontrado");
  });

  server.listen(port, () => {
    console.log(`testlog serve corriendo en http://localhost:${port}`);
    console.log("El dashboard se actualiza solo cada 5 segundos.");
    console.log("Ctrl+C para detener.");
  });
}

module.exports = { serve };