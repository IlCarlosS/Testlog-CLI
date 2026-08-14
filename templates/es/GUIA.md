# Guía rápida de testlog

Esto no es Jira ni un bloc de notas. Es un log ligero de dos cosas:

1. **Qué se probó** y qué pasó (`testlog/tests/`)
2. **Qué se decidió** y por qué (`testlog/devlog/`)

La regla de oro: si en 3 meses alguien (probablemente tú) abre este archivo
y no entiende *por qué* se hizo algo, la entrada está incompleta.

---

## Crear una entrada

```bash
testlog new test --modulo auth --titulo "login case sensitive"
testlog new devlog --modulo auth --titulo "decision email case"
```

- `--modulo`: usa el mismo nombre que la carpeta/feature real del código.
- `--titulo`: unas palabras cortas, se usan para nombrar el archivo.

---

## Campos del frontmatter (test)

| Campo        | Qué va aquí                          | Valores válidos |
|--------------|----------------------------------------|-----------------|
| `estado`     | resultado de la prueba                  | `pass`, `fail`, `blocked`, `skipped`, `pending` |
| `tipo`       | ¿la corriste a mano o es un script?     | `manual`, `automatizado` |
| `severidad`  | qué tan grave es si `estado: fail`      | `baja`, `media`, `alta` |
| `commit`     | hash o branch relacionado (opcional)    | texto libre |
| `tags`       | palabras clave para buscar después      | lista |
| `relacionado`| ids de otras entradas conectadas        | lista de ids |

## Campos del frontmatter (devlog)

| Campo | Qué va aquí | Valores válidos |
|-------|-------------|------------------|
| `tipo` | qué clase de decisión es | `decision`, `fix`, `refactor`, `conocido-limitacion` |
| `relacionado` | id del test que originó esta decisión | lista de ids |

Nota: los nombres de los campos (`fecha`, `modulo`, `estado`, etc.) se
mantienen siempre en español, incluso en la plantilla en inglés — así el
validador (`testlog validate`) funciona igual sin importar el idioma que
elijas para la prosa.

---

## Validar antes de un commit

```bash
testlog validate
```

## Ver el dashboard local

```bash
testlog serve
```

Levanta un servidor en `http://localhost:3000` con todas tus entradas en
tarjetas filtrables por tipo, estado, módulo y texto libre. Se actualiza
solo cada 5 segundos leyendo tus `.md` — pensado solo para uso local.

Tip: Para mayor comodidad y edición de archivos `.md` te invito a que pruebes [markdown-editor](https://ilcarloss.github.io/Markdown-Editor/)