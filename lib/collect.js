const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function parseEntry(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: null, body: "", error: "no se encontró frontmatter (bloque --- ... ---)" };
  }
  try {
    const data = yaml.load(match[1]) || {};
    const body = match[2] || "";
    return { data, body, error: null };
  } catch (e) {
    return { data: null, body: "", error: `YAML inválido: ${e.message}` };
  }
}

function collectDir(dir, tipo) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const filePath = path.join(dir, f);
      const content = fs.readFileSync(filePath, "utf8");
      const { data, body, error } = parseEntry(content);
      return { file: f, filePath, tipo, data, body, error };
    });
}

function collectAll(configDir) {
  return [
    ...collectDir(path.join(configDir, "tests"), "test"),
    ...collectDir(path.join(configDir, "devlog"), "devlog"),
  ];
}

module.exports = { parseEntry, collectDir, collectAll };