const sp = process.argv[2], W = process.argv[3];
const trees = { good: W, S1: sp + "/mS1", R2: sp + "/mR2", S3: sp + "/mS3" };
const P3 = "8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1";
const PERP4 = "7k/5Q2/6pp/qr6/8/8/6PP/7K w - - 0 1";
for (const [k, t] of Object.entries(trees)) {
  const s = await import(t + "/src/search.ts"); const { parseFen } = await import(t + "/src/fen.ts");
  const on = s.search(parseFen(P3), 4), off = s.searchWithoutTable(parseFen(P3), 4);
  let t0 = performance.now(); const p3 = s.search(parseFen(PERP4), 3), p4 = s.search(parseFen(PERP4), 4); const ms = Math.round(performance.now() - t0);
  console.log(k, "pos3 d4 on", on.score, on.nodes, "off", off.score, off.nodes, "| perp4 d3", p3.score, p3.nodes, "d4", p4.score, p4.nodes, ms + "ms");
}
const { search } = await import(W + "/src/search.ts"); const { parseFen } = await import(W + "/src/fen.ts"); const { legalMoves } = await import(W + "/src/legal.ts"); const { makeMove, unmakeMove } = await import(W + "/src/apply.ts"); const { squareName } = await import(W + "/src/position.ts");
const p = parseFen(PERP4); const rows = []; for (const m of legalMoves(p)) { const u = makeMove(p, m); rows.push(squareName(m.from) + squareName(m.to) + ":" + (0 - search(p, 3).score)); unmakeMove(p, m, u); } console.log(rows.join(" "));
