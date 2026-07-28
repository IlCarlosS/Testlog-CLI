#!/usr/bin/env node

const { Command } = require("commander");
const { init } = require("../lib/init");
const { newEntry } = require("../lib/new-entry");
const { validate } = require("../lib/validate");

const program = new Command();

program
  .name("testlog")
  .description(
    "Log ligero de pruebas y decisiones de desarrollo para cualquier proyecto."
  )
  .version("0.1.0");

program
  .command("init")
  .description('Crea la carpeta "testlog/" en el proyecto actual')
  .option("-l, --lang <idioma>", "idioma de las plantillas (es, en, pt)", "es")
  .action((options) => init(options));

program
  .command("new <tipo>")
  .description('Crea una nueva entrada. tipo: "test" o "devlog"')
  .option("-m, --modulo <modulo>", "módulo o feature relacionado", "general")
  .option("-t, --titulo <titulo>", "título breve para el nombre del archivo", "sin-titulo")
  .action((tipo, options) => newEntry(tipo, options));

program
  .command("validate")
  .description("Revisa que todas las entradas tengan campos válidos (frontmatter)")
  .action(() => validate());

program.parse();
