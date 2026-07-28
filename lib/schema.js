// Aquí vive la "verdad" de qué es un frontmatter válido.
// Si mañana agregas un campo nuevo a las plantillas, se actualiza aquí también.

const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const SCHEMAS = {
  test: {
    requeridos: [
      "id",
      "fecha",
      "modulo",
      "tipo",
      "estado",
      "severidad",
      "tags",
      "relacionado",
    ],
    enums: {
      tipo: ["manual", "automatizado"],
      estado: ["pass", "fail", "blocked", "skipped", "pending"],
      severidad: ["baja", "media", "alta"],
    },
    arrays: ["tags", "relacionado"],
  },
  devlog: {
    requeridos: ["id", "fecha", "modulo", "tipo", "relacionado"],
    enums: {
      tipo: ["decision", "fix", "refactor", "conocido-limitacion"],
    },
    arrays: ["relacionado"],
  },
};

function validateFrontmatter(tipo, data) {
  const schema = SCHEMAS[tipo];
  const errores = [];

  for (const campo of schema.requeridos) {
    if (data[campo] === undefined || data[campo] === null || data[campo] === "") {
      errores.push(`falta el campo obligatorio "${campo}"`);
    }
  }

  for (const [campo, valores] of Object.entries(schema.enums)) {
    if (data[campo] !== undefined && !valores.includes(data[campo])) {
      errores.push(
        `"${campo}" tiene valor inválido "${data[campo]}" (válidos: ${valores.join(", ")})`
      );
    }
  }

  for (const campo of schema.arrays) {
    if (data[campo] !== undefined && !Array.isArray(data[campo])) {
      errores.push(`"${campo}" debería ser una lista (ej: []), no ${typeof data[campo]}`);
    }
  }

  if (data.fecha !== undefined && !FECHA_REGEX.test(String(data.fecha))) {
    errores.push(`"fecha" debe tener formato YYYY-MM-DD, tiene "${data.fecha}"`);
  }

  return errores;
}

module.exports = { SCHEMAS, validateFrontmatter };
