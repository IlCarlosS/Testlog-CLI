const path = require("path");
const { findConfigDir } = require("./utils");
const { collectAll } = require("./collect");
const { validateFrontmatter } = require("./schema");

function validate() {
  const configDir = findConfigDir(process.cwd());
  if (!configDir) {
    console.error('No se encontró una carpeta "testlog/" en este proyecto.');
    console.error("Ejecuta primero: npx testlog init");
    process.exitCode = 1;
    return;
  }

  const entries = collectAll(configDir);

  if (entries.length === 0) {
    console.log("No hay entradas todavía. Nada que validar.");
    return;
  }

  let totalErrores = 0;
  const idsVistos = new Map(); // id -> archivo donde apareció

  for (const entry of entries) {
    const relPath = path.relative(process.cwd(), entry.filePath);

    if (entry.error) {
      console.log(`✗ ${relPath}`);
      console.log(`    ${entry.error}`);
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