# testlog

Un log ligero de pruebas y decisiones de desarrollo para cualquier proyecto. No es Jira. No es un bloc de notas. Es el punto medio: lo suficientemente estructurado para que sirva meses después, lo suficientemente simple para que nadie lo abandone.

## Por qué existe

La mayoría probamos rápido, arreglamos lo que falla, y seguimos. Cuando toca dar mantenimiento semanas o meses después, no queda nada de por qué se hicieron las cosas de cierta forma — y las notas sueltas casi nunca alcanzan. `testlog` guarda dos tipos de entrada como archivos Markdown versionados junto a tu código:

- **Tests**: qué se probó, cómo, y qué pasó
- **Devlog**: qué se decidió y *por qué* (lo que casi nadie documenta)

## Instalación

Por ahora el proyecto no está publicado en npm — se instala clonando el repositorio.

```bash
git clone https://github.com/IlCarlosS/Testlog-CLI.git
cd Testlog-CLI
npm install
npm link          # habilita el comando "testlog" globalmente, apuntando a este código local
```

Alternativa sin tocar nada global, usando `npx` con la ruta local:

```bash
npx /ruta/completa/a/Testlog-CLI init
```

## Uso

```bash
testlog init                                              # crea la carpeta testlog/
testlog new test --modulo auth --titulo "login case bug"  # nueva entrada de test
testlog new devlog --modulo auth --titulo "decision email" # nueva entrada de decisión
testlog validate                                          # revisa que todo esté bien formado
testlog serve                                             # levanta un dashboard local en http://localhost:3000
```

Ver `templates/GUIA.md` (se copia automáticamente a `testlog/GUIA.md` al hacer `init`) para una explicación campo por campo de qué va en cada plantilla.

### Dashboard local (`testlog serve`)

Levanta un servidor local (sin dependencias externas) en `http://localhost:3000` con:

- Tarjetas por entrada, filtrables por tipo, estado, módulo y texto libre
- Resumen rápido de cuántos tests hay por estado
- Un modal con el detalle completo (frontmatter + prosa) al hacer clic

Los datos se leen del disco en cada carga y el dashboard se refresca solo cada 5 segundos, así que siempre refleja el estado actual de tus `.md`. Pensado solo para uso local, no para exponerse fuera de tu máquina.

```bash
testlog serve --port 3000   # puerto configurable, 3000 por defecto
```

## Estructura generada

```
testlog/
├── config.json
├── GUIA.md
├── tests/
│   └── 2026-07-23_login-case-sensitive.md (ejemplo)
└── devlog/
    └── 2026-07-23_decision-email-case.md (ejemplo)
```

## Idiomas

Las plantillas se generan en Español e Ingles, según la opción que elija el usuario.

## Roadmap

- Plantillas en portugués
- Git hook opcional de `pre-commit` que corre `testlog validate`
- Publicar en npm (pendiente — esperando estabilizar el proyecto con más uso local primero)

## Créditos

Creado por **Carlos Solis** ([@IlCarlosS](https://github.com/IlCarlosS)).

Ideas, bugs o sugerencias: abre un [issue](https://github.com/IlCarlosS/Testlog-CLI) en el repositorio.

Para mayor comodidad y edición de archivos `.md` te invito a que pruebes [markdown-editor](https://ilcarloss.github.io/Markdown-Editor/)

## Licencia

MIT — ver `LICENSE`.
