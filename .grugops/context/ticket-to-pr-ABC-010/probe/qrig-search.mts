// ABC-010 SE probe: the quiescence runaway rig with the black king re-placed off h8 (h8 left empty
// or refilled with a black queen), kept only if parseFen accepts it; prints deepest / nodes / score.
const tree = process.argv[2];
const { parseFen } = await import(`${tree}/src/fen.ts`);
const { quiesce, QUIESCENCE_MAX_PLY } = await import(`${tree}/src/quiescence.ts`);
const run = (fen) => { const p = parseFen(fen); let nodes = 0, deepest = 0;
  const t = performance.now(); const score = quiesce(p, -Infinity, Infinity, 0, (q) => { nodes++; if (q > deepest) deepest = q; });
  return { deepest, nodes, score, ms: +(performance.now() - t).toFixed(1) }; };
if (process.argv[3]) { for (const fen of process.argv.slice(3)) { let r; try { r = run(fen); } catch (e) { r = e.message; } console.log(fen, JSON.stringify(r)); } process.exit(0); }
const rows = ["q1q1q1q1","1Q1Q1Q1Q","q1q1q1q1","1Q1Q1Q1Q","8","8","8","K7"];
const expand = (r) => r.replace(/\d/g, (d) => ".".repeat(+d)); const compress = (r) => r.replace(/\.+/g, (m) => String(m.length));
const grid = rows.map(expand).map((r) => r.split(""));
console.log("cap", QUIESCENCE_MAX_PLY);
for (const h8 of [".", "q"]) for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) {
  const g = grid.map((x) => [...x]); g[0][7] = h8; if (g[r][f] !== ".") continue; g[r][f] = "k";
  const fen = `${g.map((x) => compress(x.join(""))).join("/")} w - - 0 1`;
  try { const res = run(fen); console.log(`h8=${h8} ${fen} ${JSON.stringify(res)}`); } catch {}
}
