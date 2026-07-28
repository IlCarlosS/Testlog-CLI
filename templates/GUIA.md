# Guía rápida de testlog

Esto no es Jira ni un bloc de notas. Es un log ligero de dos cosas:

1. **Qué se probó** y qué pasó (`testlog/tests/`)
2. **Qué se decidió** y por qué (`testlog/devlog/`)

La regla de oro: si en 3 meses alguien (probablemente tú) abre este archivo y no entiende *por qué* se hizo algo, la entrada está incompleta.

---

## Crear una entrada (ejemplo)

```bash
testlog new test --modulo auth --titulo "login case sensitive"
testlog new devlog --modulo auth --titulo "decision email case"
```

- `--modulo`: usa el mismo nombre que la carpeta/feature real del código (ej: si tu código tiene `src/auth/`, el módulo es `auth`). Así puedes buscar `grep -r "modulo: auth"` y encontrar todo lo relacionado.
- `--titulo`: unas palabras cortas, se usan para nombrar el archivo.

Después de crear el archivo, ábrelo y llena las secciones. — el CLI solo genera el esqueleto.

---

## Campos del frontmatter (test)

| Campo | Qué va aquí | Valores válidos |
| --- | --- | --- |
| `estado` | resultado de la prueba | `pass`, `fail`, `blocked`, `skipped`, `pending` |
| `tipo` | ¿la corriste a mano o es un script? | `manual`, `automatizado` |
| `severidad` | qué tan grave es si `estado: fail` | `baja`, `media`, `alta` |
| `commit` | hash o branch relacionado (opcional) | texto libre |
| `tags` | palabras clave para buscar después | lista, ej: `[regresión, edge-case]` |
| `relacionado` | ids de otras entradas conectadas | lista de ids |

No cambies `id` ni `fecha` a mano — se generan solos al crear el archivo.

## Campos del frontmatter (devlog)

| Campo | Qué va aquí | Valores válidos |
| --- | --- | --- |
| `tipo` | qué clase de entrada de decisión es | `decision`, `fix`, `refactor`, `conocido-limitacion` |
| `relacionado` | id del test que originó esta decisión (si aplica) | lista de ids |

---

## Llenando la prosa (lo que de verdad importa)

**En un test:**

- *Qué se probó* → el escenario concreto y detallado, ejemplo: "login con email en mayúsculas cuando en la DB está en minúsculas"
- *Cómo* → pasos que otra persona podría repetir
- *Esperado vs obtenido* → compara ambos, no solo digas "falló"
- *Notas* → el contexto que no cabe arriba: ¿por qué importa?, ¿es bloqueante?, ¿hay algo raro del entorno?

**En un devlog:**

- *Qué cambió / qué se decidió* → el hecho, en una o dos líneas
- *Por qué* → esta es la sección que salva vidas en el futuro. Explica el razonamiento, no solo el resultado
- *Impacto / riesgo* → qué tan seguro estás, qué deberías vigilar

Ejemplo de un "por qué" útil vs inútil:

- ❌ "Se decidió no arreglarlo ahora."
- ✅ "No se arregla ahora porque requiere migrar emails existentes en producción; el riesgo de tocar esa tabla no vale la pena para un bug menor. Revisar si aumentan quejas de login."

---

## Validar antes de un commit

```bash
testlog validate
```

Revisa que:

- no falten campos obligatorios
- los campos con valores fijos (`estado`, `tipo`, `severidad`) tengan un valor permitido y no un texto inventado
- no haya `id` duplicados
- las fechas tengan formato correcto

Tip: puedes añadir esto como git hook (`.git/hooks/pre-commit`) si quieres que se revise automáticamente antes de cada commit.\
Tip 2: Para mayor comodidad y edición de archivos `.md` te invito a que pruebes [markdown-editor](https://ilcarloss.github.io/Markdown-Editor/)