# testlog

Un log ligero de pruebas y decisiones de desarrollo para cualquier proyecto. No es Jira. No es un bloc de notas. Es el punto medio: lo suficientemente estructurado para que sirva meses después, lo suficientemente simple para que nadie lo abandone.

## Por qué existe

La mayoría probamos rápido, arreglamos lo que falla, y seguimos. Cuando toca dar mantenimiento semanas o meses después, no queda nada de por qué se hicieron las cosas de cierta forma — y las notas sueltas casi nunca alcanzan. `testlog` guarda dos tipos de entrada como archivos Markdown versionados junto a tu código:

- **Tests**: qué se probó, cómo, y qué pasó
- **Devlog**: qué se decidió y *por qué* (lo que casi nadie documenta)

## Instalación

```bash
npm install -g testlog
# o sin instalar globalmente:
npx testlog init
```

## Uso

```bash
testlog init                                              # crea la carpeta testlog/
testlog new test --modulo auth --titulo "login case bug"  # nueva entrada de test
testlog new devlog --modulo auth --titulo "decision email" # nueva entrada de decisión
testlog validate                                          # revisa que todo esté bien formado
```

Ver `templates/GUIA.md` (se copia automáticamente a `testlog/GUIA.md` al hacer `init`) para una explicación campo por campo de qué va en cada plantilla.

## Estructura generada

```
testlog/
├── config.json
├── GUIA.md
├── tests/
│   └── 2026-07-23_login-case-sensitive.md
└── devlog/
    └── 2026-07-23_decision-email-case.md
```

## Idiomas

Las plantillas viven en `templates/<idioma>/`. Por ahora solo existe `es`. Añadir un nuevo idioma es crear `templates/en/test.md` y `templates/en/devlog.md` con la misma estructura de campos — no requiere tocar código.

## Roadmap

- Dashboard/lector que parsea las entradas y muestra filtros por estado, módulo y fecha
- Plantillas en inglés y portugués
- Git hook opcional de `pre-commit` que corre `testlog validate`

## Créditos

Creado por **Carlos Solis** ([@IlCarlosS](https://github.com/IlCarlosS)).

Ideas, bugs o sugerencias: abre un [issue](https://github.com/IlCarlosS/Testlog-CLI) en el repositorio.

Para mayor comodidad y edición de archivos `.md` te invito a que pruebes [markdown-editor](https://ilcarloss.github.io/Markdown-Editor/)

## Licencia

MIT — ver `LICENSE`.