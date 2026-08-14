const readline = require("readline");
const fs = require("fs");
const path = require("path");

// Lee las carpetas dentro de templates/ para saber qué idiomas hay
// disponibles de verdad, en vez de tener la lista hardcodeada aquí.
// "es" siempre va primero
function availableLanguages() {
  const templatesDir = path.join(__dirname, "..", "templates");
  const langs = fs
    .readdirSync(templatesDir)
    .filter((f) => fs.statSync(path.join(templatesDir, f)).isDirectory());
  return langs.sort((a, b) => {
    if (a === "es") return -1;
    if (b === "es") return 1;
    return a.localeCompare(b);
  });
}

const LABELS = {
  es: "Español",
  en: "English",
  pt: "Português",
};

function askLanguage() {
  const langs = availableLanguages();

  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    console.log("Selecciona el idioma de las plantillas / Choose template language:");
    langs.forEach((lang, i) => {
      console.log(`  ${i + 1}) ${LABELS[lang] || lang} (${lang})`);
    });
    rl.question(`> (default: ${langs[0]}) `, (answer) => {
      rl.close();
      const trimmed = (answer || "").trim();
      const byNumber = langs[parseInt(trimmed, 10) - 1];
      const byCode = langs.includes(trimmed.toLowerCase()) ? trimmed.toLowerCase() : null;
      resolve(byNumber || byCode || langs[0]);
    });
  });
}

module.exports = { availableLanguages, askLanguage };