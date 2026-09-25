const W = process.argv[2];
const { searchWithoutTable, search } = await import(W + "/src/search.ts");
const { parseFen } = await import(W + "/src/fen.ts");
const f = "k7/8/8/K7/8/8/8/1R6 b - - 1 1";
let t = performance.now(); const a = searchWithoutTable(parseFen(f), 10); console.log("off d10", a.score, a.nodes, Math.round(performance.now() - t), "ms");
t = performance.now(); const b = search(parseFen(f), 10); console.log("on d10", b.score, b.nodes, Math.round(performance.now() - t), "ms");
