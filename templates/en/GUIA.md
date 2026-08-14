# testlog quick guide

This is not Jira, and it's not a loose notes file either. It's a lightweight
log of two things:

1. **What was tested** and what happened (`testlog/tests/`)
2. **What was decided** and why (`testlog/devlog/`)

Golden rule: if someone (probably you) opens this file in 3 months and can't
tell *why* something was done, the entry is incomplete.

---

## Creating an entry

```bash
testlog new test --modulo auth --titulo "login case sensitive"
testlog new devlog --modulo auth --titulo "decision email case"
```

- `--modulo`: use the same name as the actual code folder/feature.
- `--titulo`: a few short words, used to name the file.

---

## Frontmatter fields (test)

| Field        | What goes here                       | Valid values |
|--------------|----------------------------------------|--------------|
| `estado`     | test result                             | `pass`, `fail`, `blocked`, `skipped`, `pending` |
| `tipo`       | was it run by hand or is it a script?   | `manual`, `automatizado` |
| `severidad`  | how bad it is when `estado: fail`       | `baja`, `media`, `alta` |
| `commit`     | related hash or branch (optional)       | free text |
| `tags`       | keywords for later search               | list |
| `relacionado`| ids of other connected entries          | list of ids |

## Frontmatter fields (devlog)

| Field | What goes here | Valid values |
|-------|-----------------|--------------|
| `tipo` | what kind of decision entry this is | `decision`, `fix`, `refactor`, `conocido-limitacion` |
| `relacionado` | id of the test that led to this decision | list of ids |

Note: field names (`fecha`, `modulo`, `estado`, etc.) always stay the same
regardless of language — that's how `testlog validate` keeps working the
same no matter which language you pick for the prose sections.

---

## Validate before a commit

```bash
testlog validate
```

## View the local dashboard

```bash
testlog serve
```

Starts a server at `http://localhost:3000` showing all your entries as
filterable cards (type, status, module, free text). Refreshes every 5
seconds reading your `.md` files — local use only.

Tip: For greater convenience when editing `.md` files, I’d recommend you try [markdown-editor](https://ilcarloss.github.io/Markdown-Editor/)