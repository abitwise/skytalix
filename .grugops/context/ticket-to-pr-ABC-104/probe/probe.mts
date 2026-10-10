import { parseCoordinateMove } from "../../../../src/coordinate-move.ts";
import { parseFen } from "../../../../src/fen.ts";
const p = parseFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
const run = (n: string, f: () => unknown) => { try { console.log(n, "RETURNED", JSON.stringify(f())); } catch (e) { console.log(n, "THREW", (e as Error).constructor.name + ": " + (e as Error).message); } };
run("null-position", () => parseCoordinateMove(null as never, "e2e4"));
run("legal=42", () => parseCoordinateMove(p, "e2e4", 42 as never));
run("control", () => parseCoordinateMove(p, "e2e4").outcome);
