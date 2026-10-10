const wt = process.argv[2];
const { parseCoordinateMove } = await import(`${wt}/src/coordinate-move.ts`);
const { parseFen } = await import(`${wt}/src/fen.ts`);
const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
const cases = [["null position", () => parseCoordinateMove(null, "e2e4")], ["legal=42", () => parseCoordinateMove(p, "e2e4", 42)], ["control", () => parseCoordinateMove(p, "e2e4")], ["text=null", () => parseCoordinateMove(p, null)]];
for (const [n, f] of cases) { try { const r = f(); console.log(n, "->", r.outcome); } catch (e) { console.log(n, "-> THROWS", e.constructor.name, e.message.slice(0, 60)); } }
console.log(`node ${process.version}`);
