// ABC-010 SE probe: legal re-placements of SIX_QUEENS_FEN's black king (and optionally one black
// blocker) whose Qxd4 candidate list is byte-identical to the shipped one. Reads only.
const tree = process.argv[2];
const { newGame } = await import(`${tree}/src/history.ts`);
const { resolveMoveInput } = await import(`${tree}/src/move-input.ts`);
const { parseFen, toFen } = await import(`${tree}/src/fen.ts`);
const WANT = JSON.stringify(["Q1xd4#","Q2xd4#","Qaxd4#","Qhxd4#","Q6xd4#","Q8xd4"]);
const rows = ["3Q4","8","1Q4Q1","8","Q2q3Q","8","1Q6","3Q1K2"];
const expand = (r) => r.replace(/\d/g, (d) => ".".repeat(+d));
const compress = (r) => r.replace(/\.+/g, (m) => String(m.length));
const grid = rows.map(expand).map((r) => r.split(""));
const hits = [];
const tryFen = (g, note) => {
  const fen = `${g.map((r) => compress(r.join(""))).join("/")} w - - 0 1`;
  try { parseFen(fen); } catch { return; }
  const o = resolveMoveInput(newGame(fen), "Qxd4");
  const got = o.kind === "ambiguous" ? JSON.stringify(o.messages) : o.kind;
  if (got === WANT) hits.push(`${fen}   (${note})`);
};
for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
  if (grid[r][f] !== ".") continue;
  const g = grid.map((x) => [...x]); g[r][f] = "k";
  tryFen(g, `king only`);
  for (let r2 = 0; r2 < 8; r2++) for (let f2 = 0; f2 < 8; f2++) {
    if (g[r2][f2] !== ".") continue;
    for (const p of "nbrp") { if (p === "p" && (r2 === 0 || r2 === 7)) continue; const h = g.map((x) => [...x]); h[r2][f2] = p; tryFen(h, `king + ${p}`); }
  }
}
console.log(`hits ${hits.length}`); for (const h of hits.filter((h) => h.includes("king only")).concat(hits.filter((h) => !h.includes("king only")).slice(0, 15))) console.log(h);
