const fs = require("fs");
const path = require("path");
const { availableLanguages, askLanguage } = require("./prompt");

async function init(options) {
  const cwd = process.cwd();
  const root = path.join(cwd, "testlog");

  if (fs.existsSync(root)) {
    console.log(`Ya existe una carpeta "testlog" en este proyecto. No se modificó nada.`);
    return;
  }

  const langs = availableLanguages();
  let lang = options.lang;

  if (lang) {
    if (!langs.includes(lang)) {
      console.error(`Idioma "${lang}" no soportado. Disponibles: ${langs.join(", ")}`);
      process.exitCode = 1;
      return;
    }
  } else {
    // Sin --lang: se pregunta interactivamente. Si no hay TTY (ej: corriendo
    // en un script o CI), se usa el primer idioma disponible sin preguntar.
    lang = process.stdin.isTTY ? await askLanguage() : langs[0];
  }

  fs.mkdirSync(path.join(root, "tests"), { recursive: true });
  fs.mkdirSync(path.join(root, "devlog"), { recursive: true });

  const config = {
    version: "0.1.0",
    lang,
    created: new Date().toISOString(),
  };
  fs.writeFileSync(path.join(root, "config.json"), JSON.stringify(config, null, 2) + "\n");

  const gitkeep = "# Esta carpeta guarda las entradas de test.\n";
  fs.writeFileSync(path.join(root, "tests", ".gitkeep"), gitkeep);
  fs.writeFileSync(path.join(root, "devlog", ".gitkeep"), gitkeep);

  const guiaSrc = path.join(__dirname, "..", "templates", lang, "GUIA.md");
  fs.copyFileSync(guiaSrc, path.join(root, "GUIA.md"));

  console.log(`Idioma seleccionado: ${lang}`);
  console.log("Carpeta 'testlog/' creada:");
  console.log("  testlog/config.json");
  console.log("  testlog/tests/");
  console.log("  testlog/devlog/");
  console.log("  testlog/GUIA.md");
  console.log("");
  console.log("Prueba ahora:");
  console.log('  testlog new test --modulo auth --titulo "login case sensitive"');
}

module.exports = { init };