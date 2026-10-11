// ABC-083: the original 16-queen rig with every legal placement of both kings on ranks 1-4, white and
// black to move; lists placements whose quiescence reaches the cap, cheapest first.
// Usage: node rigkings.mjs <tree-root> [base-root]
const [root, baseRoot] = process.argv.slice(2);
const load = async (r) => ({ Q: await import(`${r}/src/quiescence.ts`), F: await import(`${r}/src/fen.ts`) });
const T = await load(root), B = baseRoot ? await load(baseRoot) : null;
const run = (L, fen) => { const p = L.F.parseFen(fen); let nodes = 0, deepest = 0; L.Q.quiesce(p, -Infinity, Infinity, 0, (q) => { nodes++; if (q > deepest) deepest = q; }); return { nodes, deepest }; };
const out = [];
const rankStr = (w, b, r) => { let s = "", e = 0; for (let f = 0; f < 8; f++) { const c = w === r * 8 + f ? "K" : b === r * 8 + f ? "k" : null; if (c) { if (e) s += e; e = 0; s += c; } else e++; } if (e) s += e; return s; };
for (let w = 0; w < 32; w++) for (let b = 0; b < 32; b++) {
  if (w === b || (Math.abs((w >> 3) - (b >> 3)) <= 1 && Math.abs((w & 7) - (b & 7)) <= 1)) continue;
  for (const stm of ["w", "b"]) {
    const fen = `q1q1q1q1/1Q1Q1Q1Q/q1q1q1q1/1Q1Q1Q1Q/${[3, 2, 1, 0].map((r) => rankStr(w, b, r)).join("/")} ${stm} - - 0 1`;
    let r; try { r = run(T, fen); } catch { continue; }
    if (r.deepest < 8) continue;
    const rb = B ? run(B, fen) : null;
    out.push({ fen, nodes: r.nodes, base: rb });
  }
}
out.sort((a, b) => a.nodes - b.nodes);
console.log(JSON.stringify({ found: out.length }));
for (const o of out.slice(0, 8)) console.log(JSON.stringify(o));
