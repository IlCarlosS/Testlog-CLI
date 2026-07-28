const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { findConfigDir } = require("./utils");
const { validateFrontmatter } = require("./schema");

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  try {
    return yaml.load(match[1]) || {};
  } catch (e) {
    return { __parseError: e.message };
  }
}

function collectEntries(dir, tipo) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const filePath = path.join(dir, f);
      const content = fs.readFileSync(filePath, "utf8");
      const data = extractFrontmatter(content);
      return { file: f, filePath, tipo, data };
    });
}

function validate() {
  const configDir = findConfigDir(process.cwd());
  if (!configDir) {
    console.error('No se encontró una carpeta "testlog/" en este proyecto.');
    console.error("Ejecuta primero: npx testlog init");
    process.exitCode = 1;
    return;
  }

  const entries = [
    ...collectEntries(path.join(configDir, "tests"), "test"),
    ...collectEntries(path.join(configDir, "devlog"), "devlog"),
  ];

  if (entries.length === 0) {
    console.log("No hay entradas todavía. Nada que validar.");
    return;
  }

  let totalErrores = 0;
  const idsVistos = new Map(); // id -> archivo donde apareció

  for (const entry of entries) {
    const relPath = path.relative(process.cwd(), entry.filePath);

    if (!entry.data) {
      console.log(`✗ ${relPath}`);
      console.log("    no se encontró frontmatter (bloque --- ... ---)");
      totalErrores++;
      continue;
    }
    if (entry.data.__parseError) {
      console.log(`✗ ${relPath}`);
      console.log(`    el YAML del frontmatter no es válido: ${entry.data.__parseError}`);
      totalErrores++;
      continue;
    }

    const errores = validateFrontmatter(entry.tipo, entry.data);

    if (entry.data.id) {
      if (idsVistos.has(entry.data.id)) {
        errores.push(`id duplicado, ya usado en ${idsVistos.get(entry.data.id)}`);
      } else {
        idsVistos.set(entry.data.id, relPath);
      }
    }

    if (errores.length === 0) {
      console.log(`✓ ${relPath}`);
    } else {
      console.log(`✗ ${relPath}`);
      for (const err of errores) console.log(`    - ${err}`);
      totalErrores += errores.length;
    }
  }

  console.log("");
  if (totalErrores === 0) {
    console.log(`Todo en orden (${entries.length} entradas revisadas).`);
  } else {
    console.log(`${totalErrores} problema(s) encontrados en ${entries.length} entradas.`);
    process.exitCode = 1;
  }
}

module.exports = { validate };
