const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { today, slugify, findConfigDir } = require("./utils");

const VALID_TYPES = ["test", "devlog"];

function newEntry(tipo, options) {
  if (!VALID_TYPES.includes(tipo)) {
    console.error(`Tipo inválido: "${tipo}". Usa "test" o "devlog".`);
    process.exitCode = 1;
    return;
  }

  const configDir = findConfigDir(process.cwd());
  if (!configDir) {
    console.error(
      'No se encontró una carpeta "testlog/" en este proyecto (ni en carpetas superiores).'
    );
    console.error('Ejecuta primero: npx testlog init');
    process.exitCode = 1;
    return;
  }

  const config = JSON.parse(
    fs.readFileSync(path.join(configDir, "config.json"), "utf8")
  );
  const lang = config.lang || "es";

  const modulo = options.modulo || "general";
  const titulo = options.titulo || "sin-titulo";
  const fecha = today();
  const id = `${tipo}-${fecha}-${crypto.randomUUID().slice(0, 8)}`;
  const slug = slugify(titulo);

  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    lang,
    `${tipo}.md`
  );
  if (!fs.existsSync(templatePath)) {
    console.error(`No existe plantilla para el idioma "${lang}" (${templatePath}).`);
    process.exitCode = 1;
    return;
  }

  let content = fs.readFileSync(templatePath, "utf8");
  content = content
    .replace("{{id}}", id)
    .replace("{{fecha}}", fecha)
    .replace("{{modulo}}", modulo);

  const targetDir = path.join(configDir, tipo === "test" ? "tests" : "devlog");
  const fileName = `${fecha}_${slug}.md`;
  const targetPath = path.join(targetDir, fileName);

  if (fs.existsSync(targetPath)) {
    console.error(`Ya existe un archivo con ese nombre: ${fileName}`);
    process.exitCode = 1;
    return;
  }

  fs.writeFileSync(targetPath, content);
  console.log(`Creado: testlog/${tipo === "test" ? "tests" : "devlog"}/${fileName}`);
  console.log(`id: ${id}`);
}

module.exports = { newEntry };
