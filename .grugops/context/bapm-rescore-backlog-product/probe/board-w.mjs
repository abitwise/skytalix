const root = process.argv[2];
const { parseFen } = await import(`${root}/src/fen.ts`);
const { renderBoard } = await import(`${root}/src/render.ts`);
const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
for (const m of ["ascii", "unicode"]) { const r = renderBoard(p, m, "white-bottom"); console.log(m, r.length, Math.max(...r.map((x) => x.length))); }
