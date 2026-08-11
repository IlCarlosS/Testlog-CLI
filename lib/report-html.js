function renderPage() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>testlog · dashboard</title>
<style>
  :root { --bg:#0f1115; --panel:#171a21; --border:#2a2e38; --text:#e6e8ec; --muted:#8a90a0; }
  * { box-sizing: border-box; }
  body { margin:0; font-family: -apple-system, Segoe UI, Roboto, sans-serif; background:var(--bg); color:var(--text); }
  header { padding: 20px 28px; border-bottom: 1px solid var(--border); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
  header h1 { margin:0; font-size: 18px; }
  header .sub { color: var(--muted); font-size: 13px; }
  .summary { display:flex; gap:10px; flex-wrap:wrap; padding: 16px 28px; }
  .badge { border:1px solid var(--border); background:var(--panel); border-radius: 999px; padding: 6px 14px; font-size: 13px; }
  .filters { display:flex; gap:10px; padding: 0 28px 16px; flex-wrap:wrap; }
  select, input[type=text] { background:var(--panel); color:var(--text); border:1px solid var(--border); border-radius:6px; padding:6px 10px; font-size:13px; }
  main { padding: 0 28px 40px; display:grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 900px) { main { grid-template-columns: 1fr; } }
  .card { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:14px 16px; cursor:pointer; }
  .card:hover { border-color:#454b5c; }
  .card h3 { margin:0 0 6px; font-size:14px; }
  .card .meta { display:flex; gap:8px; flex-wrap:wrap; font-size:11px; color:var(--muted); margin-bottom:6px; }
  .pill { border-radius: 6px; padding: 2px 8px; font-size: 11px; }
  .pill.pass { background:#123a24; color:#5fd88f; }
  .pill.fail { background:#3a1414; color:#ff8080; }
  .pill.blocked { background:#3a2c14; color:#f0b34d; }
  .pill.skipped, .pill.pending { background:#232838; color:#9aa4c0; }
  .pill.error { background:#3a1414; color:#ff8080; }
  .card p { margin: 6px 0 0; font-size: 12px; color: var(--muted); white-space: pre-wrap; max-height: 60px; overflow:hidden; }
  .empty { color: var(--muted); padding: 40px; text-align:center; grid-column: 1 / -1; }
  #modalBg { display:none; position:fixed; inset:0; background:rgba(0,0,0,.6); align-items:center; justify-content:center; padding:20px; }
  #modal { background:var(--panel); border:1px solid var(--border); border-radius:10px; max-width:700px; width:100%; max-height:85vh; overflow:auto; padding:24px; }
  #modal pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; }
  #modal .close { float:right; cursor:pointer; color:var(--muted); }
</style>
</head>
<body>
<header>
  <div>
    <h1>testlog</h1>
    <div class="sub">dashboard local · se actualiza solo cada 5s</div>
  </div>
</header>
<div class="summary" id="summary"></div>
<div class="filters">
  <select id="fTipo"><option value="">Tipo: todos</option><option value="test">test</option><option value="devlog">devlog</option></select>
  <select id="fEstado"><option value="">Estado: todos</option><option value="pass">pass</option><option value="fail">fail</option><option value="blocked">blocked</option><option value="skipped">skipped</option><option value="pending">pending</option></select>
  <input type="text" id="fModulo" placeholder="Filtrar por módulo..." />
  <input type="text" id="fTexto" placeholder="Buscar texto..." />
</div>
<main id="grid"></main>

<div id="modalBg" onclick="if(event.target===this) this.style.display='none'">
  <div id="modal"></div>
</div>

<script>
let allEntries = [];

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

async function load() {
  const res = await fetch("/api/entries");
  const json = await res.json();
  allEntries = json.entries;
  renderSummary(json.summary);
  renderGrid();
}

function renderSummary(summary) {
  const el = document.getElementById("summary");
  const parts = [
    \`<span class="badge">\${summary.totalTests} tests</span>\`,
    \`<span class="badge">\${summary.totalDevlog} devlog</span>\`,
  ];
  for (const [estado, count] of Object.entries(summary.porEstado)) {
    parts.push(\`<span class="badge">\${esc(estado)}: \${count}</span>\`);
  }
  el.innerHTML = parts.join("");
}

function matchesFilters(e) {
  const fTipo = document.getElementById("fTipo").value;
  const fEstado = document.getElementById("fEstado").value;
  const fModulo = document.getElementById("fModulo").value.toLowerCase();
  const fTexto = document.getElementById("fTexto").value.toLowerCase();
  const d = e.data || {};

  if (fTipo && e.tipo !== fTipo) return false;
  if (fEstado && d.estado !== fEstado) return false;
  if (fModulo && !(d.modulo || "").toLowerCase().includes(fModulo)) return false;
  if (fTexto) {
    const haystack = (e.file + " " + JSON.stringify(d) + " " + (e.body || "")).toLowerCase();
    if (!haystack.includes(fTexto)) return false;
  }
  return true;
}

function renderGrid() {
  const grid = document.getElementById("grid");
  const filtered = allEntries.filter(matchesFilters);

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty">No hay entradas que coincidan con los filtros.</div>';
    return;
  }

  grid.innerHTML = filtered.map((e) => {
    const d = e.data || {};
    const idx = allEntries.indexOf(e);
    if (e.error) {
      return \`<div class="card" onclick="openModal(\${idx})">
        <h3>⚠ \${esc(e.file)}</h3>
        <div class="meta"><span class="pill error">error de formato</span></div>
        <p>\${esc(e.error)}</p>
      </div>\`;
    }
    const pillClass = d.estado || (e.tipo === "devlog" ? "" : "pending");
    const pill = d.estado ? \`<span class="pill \${esc(pillClass)}">\${esc(d.estado)}</span>\` : "";
    return \`<div class="card" onclick="openModal(\${idx})">
      <h3>\${esc(d.modulo || "sin módulo")} · \${esc(e.file)}</h3>
      <div class="meta">
        <span class="pill">\${esc(e.tipo)}</span>
        \${pill}
        <span>\${esc(d.fecha || "")}</span>
      </div>
      <p>\${esc((e.body || "").trim().slice(0, 160))}</p>
    </div>\`;
  }).join("");
}

function openModal(idx) {
  const e = allEntries[idx];
  const d = e.data || {};
  const bg = document.getElementById("modalBg");
  const modal = document.getElementById("modal");
  modal.innerHTML = \`
    <span class="close" onclick="document.getElementById('modalBg').style.display='none'">✕ cerrar</span>
    <h2>\${esc(e.file)}</h2>
    <p style="color:var(--muted); font-size:13px;">id: \${esc(d.id || "-")} · tipo: \${esc(e.tipo)}</p>
    <pre>\${esc(JSON.stringify(d, null, 2))}</pre>
    <hr style="border-color:var(--border)" />
    <pre>\${esc(e.body || "(sin contenido)")}</pre>
  \`;
  bg.style.display = "flex";
}

document.querySelectorAll("select, input").forEach(el => el.addEventListener("input", renderGrid));

load();
setInterval(load, 5000);
</script>
</body>
</html>`;
}

module.exports = { renderPage };