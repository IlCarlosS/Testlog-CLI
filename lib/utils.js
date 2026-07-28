const fs = require("fs");
const path = require("path");

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function slugify(text) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

function findConfigDir(startDir) {
  // Busca hacia arriba una carpeta "testlog" con config.json, similar a como
  // git busca ".git". Si no existe, retorna null.
  let dir = startDir;
  while (true) {
    const candidate = path.join(dir, "testlog", "config.json");
    if (fs.existsSync(candidate)) {
      return path.join(dir, "testlog");
    }
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

module.exports = { today, slugify, findConfigDir };
