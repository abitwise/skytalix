// SCRATCH PROBE (arch-next-pull): the evaluation-lever probe, skytalix side. Runs on the patched scratch tree with
// PROBE at its defaults (= main, node for node). Usage:
//   node evalprobe.ts pos <pgn>            -> JSON lines {id, fen}: games 1, 9, 17, ... (every 8th), the position
//                                             before plies 21, 41 and 61 (after 20 / 40 / 60 plies), in-progress only
//   node evalprobe.ts play <positions> <N> -> JSON lines {id, move (uci), score, depth}: chooseMove, maxNodes N,
//                                             frozen clock, fresh process state per position as chooseMove has it
import { readFileSync } from "node:fs";
import { makeMove } from "./src/apply.ts";
import { chooseMove } from "./src/engine.ts";
import { parseFen, toFen } from "./src/fen.ts";
import { gameStatus } from "./src/gameend.ts";
import { squareName, pieceType } from "./src/position.ts";
import { parseSan } from "./src/san.ts";

const [mode, file, nArg] = process.argv.slice(2);
const PROMO = ["", "", "n", "b", "r", "q"];
const uci = (m: { from: number; to: number; promotion: number }) =>
  squareName(m.from) + squareName(m.to) + (m.promotion ? PROMO[pieceType(m.promotion)] : "");

if (mode === "pos") {
  const text = readFileSync(file as string, "utf8");
  const games = text.split(/\n(?=\[Event )/);
  for (let g = 0; g < games.length; g += 8) {
    const game = games[g] as string;
    const fenTag = /\[FEN "([^"]+)"\]/.exec(game);
    const body = game.replace(/^\[.*\]$/gm, "").replace(/\{[^}]*\}/g, " ").replace(/\$\d+/g, " ");
    const toks = body.split(/\s+/).filter((t) => t && !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t))
      .map((t) => t.replace(/^\d+\.+/, "")).filter((t) => t);
    const p = parseFen(fenTag ? fenTag[1] as string : "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
    for (let ply = 0; ply < toks.length && ply <= 60; ply++) {
      if ((ply === 20 || ply === 40 || ply === 60) && gameStatus(p).result === "in-progress") {
        console.log(JSON.stringify({ id: `g${g + 1}p${ply}`, fen: toFen(p) }));
      }
      const r = parseSan(p, toks[ply] as string);
      if (r.outcome !== "move") throw new Error(`game ${g + 1} ply ${ply}: ${toks[ply]} ${r.outcome}`);
      makeMove(p, r.move);
    }
  }
} else if (mode === "play") {
  const N = Number(nArg);
  for (const line of readFileSync(file as string, "utf8").trim().split("\n")) {
    const { id, fen } = JSON.parse(line);
    const c = chooseMove(parseFen(fen), { budgetMs: 1e9, now: () => 0, maxNodes: N }) as unknown as { move: any; score: number; depth: number; nodes: number };
    console.log(JSON.stringify({ id, move: uci(c.move), score: c.score, depth: c.depth, nodes: c.nodes }));
  }
}
