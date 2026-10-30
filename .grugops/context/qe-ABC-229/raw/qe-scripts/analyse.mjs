// qe-ABC-229 (from qe-ABC-228-ii, unchanged) smoke analysis from a PGN: per-game result, the candidate's W/L/D and score, the termination texts,
// and the repetition endings with the mover of the repeating move. usage: node analyse.mjs <pgn> [maxRound]
import { readFileSync } from "node:fs";

const [pgnPath, maxRoundArg] = process.argv.slice(2);
const maxRound = maxRoundArg ? Number(maxRoundArg) : Infinity;
const games = readFileSync(pgnPath, "utf8").split(/\n(?=\[Event )/).filter((g) => g.includes("[Result"));
const tag = (g, t) => new RegExp(`^\\[${t} "(.*)"\\]$`, "m").exec(g)?.[1];
let w = 0, l = 0, d = 0, rep = 0;
const ends = {};
const rows = [];
for (const g of games) {
  const round = Number(tag(g, "Round"));
  if (round > maxRound) continue;
  const white = tag(g, "White");
  const black = tag(g, "Black");
  const result = tag(g, "Result");
  const text = g.replace(/^\[.*\]$/gm, "");
  const comments = text.match(/\{[^}]*\}/g) ?? [];
  const last = comments.at(-1) ?? "";
  const term = /, ([^,}]*)\}$/.exec(last)?.[1] ?? /\{([^}]*)\}$/.exec(last)?.[1] ?? "?";
  const plies = text.replace(/\{[^}]*\}/g, " ").split(/\s+/).filter((t) => t && !/^\d+\.+$/.test(t) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(t)).length;
  const first = (/^\[FEN "\S+ ([wb]) /m.exec(g)?.[1] ?? "w") === "w" ? white : black;
  const second = first === white ? black : white;
  const lastMover = plies % 2 ? first : second;
  const candWhite = white === "skytalix";
  const pts = result === "1/2-1/2" ? 0.5 : (result === "1-0") === candWhite ? 1 : 0;
  if (pts === 1) w++; else if (pts === 0) l++; else d++;
  ends[term] = (ends[term] ?? 0) + 1;
  const isRep = /3-fold repetition/.test(term);
  if (isRep) rep++;
  rows.push(`round ${round} ${white} vs ${black} ${result} cand=${pts} plies=${plies} {${term}}${isRep ? ` repeating move by ${lastMover}` : ""}`);
}
for (const r of rows) console.log(r);
console.log(`games ${w + l + d}  candidate W/L/D ${w}/${l}/${d}  score ${w + d / 2}`);
console.log(`endings ${JSON.stringify(ends)}`);
console.log(`repetition endings ${rep}`);
