// ABC-083: the ABC-079 cap rig exactly as shipped (16 queens, white king a1, white to move) with the BLACK
// king moved over every legal square of ranks 1-4; deepest quiescence ply and nodes on each tree given.
// Usage: node rigblackking.mjs label=root ...
const trees = [];
for (const a of process.argv.slice(2)) { const [l, r] = a.split("="); trees.push([l, await import(`${r}/src/quiescence.ts`), await import(`${r}/src/fen.ts`)]); }
const rank = (sq, k) => { let s = "", e = 0; for (let f = 0; f < 8; f++) { if (f === sq) { if (e) s += e; e = 0; s += k; } else e++; } if (e) s += e; return s; };
for (let r = 3; r >= 0; r--) for (let f = 0; f < 8; f++) {
  if (r <= 1 && f <= 1) continue; // next to or on the white king
  const ranks = [3, 2, 1, 0].map((x) => (x === r ? rank(f, "k") : "8"));
  ranks[3] = r === 0 ? (f === 0 ? null : `K${f - 1 ? f - 1 : ""}k${7 - f ? 7 - f : ""}`) : "K7";
  if (!ranks[3]) continue;
  const fen = `q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/${ranks.join("/")} w - - 0 1`.replace(/K0k/, "Kk");
  const row = { fen };
  for (const [l, Q, F] of trees) {
    try { const p = F.parseFen(fen); let nodes = 0, deepest = 0; Q.quiesce(p, -Infinity, Infinity, 0, (q) => { nodes++; if (q > deepest) deepest = q; }); row[l] = [deepest, nodes]; }
    catch (e) { row[l] = e.message.slice(0, 50); }
  }
  console.log(JSON.stringify(row));
}
