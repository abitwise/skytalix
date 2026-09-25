const W = process.argv[2];
const { legalMoves } = await import(W + "/src/legal.ts");
const { makeMove, unmakeMove } = await import(W + "/src/apply.ts");
const { parseFen, toFen } = await import(W + "/src/fen.ts");
const { zobristKey } = await import(W + "/src/zobrist.ts");
const { squareName } = await import(W + "/src/position.ts");
const p = parseFen("n3k3/1P6/8/3q4/8/8/8/3RK3 w - - 0 1");
const seen = new Map();
const lab = (m) => squareName(m.from) + squareName(m.to) + (m.promotion || "");
for (const a of legalMoves(p)) { const u = makeMove(p, a); for (const b of legalMoves(p)) { const v = makeMove(p, b); const k = zobristKey(p); const path = lab(a) + " " + lab(b); if (seen.has(k)) console.log("transposition:", seen.get(k), "==", path, toFen(p)); else seen.set(k, path); unmakeMove(p, b, v); } unmakeMove(p, a, u); }
