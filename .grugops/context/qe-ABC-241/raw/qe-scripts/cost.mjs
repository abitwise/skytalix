// qe-ABC-241 SE-241-b (PREREG § 5): the NFR-002 per-ply derive, `gameStatusOf(history)`, base vs head.
// Driver: node cost.mjs <baseTree> <headTree> <outDir>   -> per fixture, fresh processes in order b h h b b h, wait-clear
// before each (0 foreign vitest, 0 cutechess-cli, load1 <= 2.0, Tctl <= 60.0; poll 15 s, up to 60 min).
// Worker:  node cost.mjs --one <tree> <fixture>          -> 2 000 warm-up calls, 7 blocks of 2 000; JSON line.
import { execFileSync, spawnSync } from "node:child_process";
import { appendFileSync, readdirSync, readFileSync } from "node:fs";
import { loadavg } from "node:os";
import { join } from "node:path";

const START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const shuffle = (n, w, b) => Array.from({ length: n }, (_, i) => (i % 2 === 0 ? w : b)[Math.floor(i / 2) % 2]);
const FIX = {
  // F1: the ticket's 1.e4 knight shuffle to 120 plies (1 double push).
  F1: [START, ["e2e4", ...Array(30).fill(["g8f6", "g1f3", "f6g8", "f3g1"]).flat().slice(0, 119)]],
  // F2: 16 double pushes, none capturable, then knight shuffles to 120 plies.
  F2: [START, ["a2a4", "h7h5", "b2b4", "g7g5", "c2c4", "f7f5", "d2d4", "e7e5", "e2e4", "d7d5", "f2f4", "c7c5", "g2g4", "b7b5", "h2h4", "a7a5", ...shuffle(104, ["g1f3", "f3g1"], ["g8f6", "f6g8"])]],
  // F3: 4 Black double pushes with White capturers beside them (the probe path), then shuffles to 120 plies.
  F3: ["rnbqkbnr/pppppppp/8/1P1P1P1P/8/8/P1P1P1P1/RNBQKBNR b KQkq - 0 1", ["a7a5", "g1f3", "c7c5", "f3g1", "e7e5", "g1f3", "g7g5", "f3g1", ...shuffle(112, ["g8f6", "f6g8"], ["g1f3", "f3g1"])]],
};

if (process.argv[2] === "--one" || process.argv[2] === "--check") {
  const [tree, fx] = process.argv.slice(3);
  const { newGame, playMove, gameStatusOf } = await import(`${tree}/src/history.ts`);
  const { parseCoordinateMove } = await import(`${tree}/src/coordinate-move.ts`);
  const [fen, moves] = FIX[fx];
  const h = newGame(fen);
  let doubles = 0;
  for (const t of moves) {
    const r = parseCoordinateMove(h.position, t);
    if (r.outcome !== "move") throw new Error(`${fx}: ${t} illegal`);
    if ((r.move.piece & 7) === 1 && Math.abs(r.move.to - r.move.from) === 32) doubles++;
    playMove(h, r.move);
  }
  if (process.argv[2] === "--check") {
    console.log(JSON.stringify({ fx, plies: h.moves.length, doubles }));
    process.exit(0);
  }
  let sink = 0;
  for (let i = 0; i < 2000; i++) sink += gameStatusOf(h).result.length;
  const blocks = [];
  for (let b = 0; b < 7; b++) {
    const t0 = performance.now();
    for (let i = 0; i < 2000; i++) sink += gameStatusOf(h).result.length;
    blocks.push(((performance.now() - t0) * 1000) / 2000);
  }
  const med = [...blocks].sort((x, y) => x - y)[3];
  console.log(JSON.stringify({ fx, plies: h.moves.length, doubles, us_median: Math.round(med * 100) / 100, blocks: blocks.map((x) => Math.round(x * 100) / 100), sink: sink > 0 }));
  process.exit(0);
}

const [base, head, out] = process.argv.slice(2);
const count = (args) => {
  try {
    return execFileSync("pgrep", args, { encoding: "utf8" }).trim().split("\n").length;
  } catch {
    return 0;
  }
};
const tctl = () => {
  for (const h of readdirSync("/sys/class/hwmon")) {
    const p = join("/sys/class/hwmon", h);
    if (readFileSync(join(p, "name"), "utf8").trim() === "k10temp") return Number(readFileSync(join(p, "temp1_input"), "utf8")) / 1000;
  }
  return Number.NaN;
};
const sleepSync = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const log = (s) => appendFileSync(join(out, "cost.log"), `${new Date().toISOString()} ${s}\n`);
function waitClear(label) {
  for (let i = 1; i <= 240; i++) {
    const l = loadavg()[0], v = count(["-f", "[/]vitest"]), c = count(["-x", "cutechess-cli"]), t = tctl();
    if (v === 0 && c === 0 && l <= 2.0 && t <= 60.0) return { l, t };
    log(`${label} wait poll=${i} load1=${l.toFixed(2)} vitest=${v} cutechess=${c} tctl=${t.toFixed(1)}`);
    sleepSync(15_000);
  }
  log("PRECONDITION-NOT-MET");
  process.exit(3);
}
const ORDER = ["base", "head", "head", "base", "base", "head"];
const res = {};
for (const fx of Object.keys(FIX)) {
  res[fx] = { base: [], head: [] };
  for (const tree of ORDER) {
    const { l, t } = waitClear(`${fx} ${tree}`);
    const r = spawnSync(process.execPath, [process.argv[1], "--one", tree === "head" ? head : base, fx], { encoding: "utf8" });
    if (r.status !== 0) {
      log(`${fx} ${tree} ERROR ${r.stderr}`);
      process.exit(4);
    }
    const j = JSON.parse(r.stdout.trim());
    res[fx][tree].push(j.us_median);
    log(`${fx} ${tree} load1=${l.toFixed(2)} tctl=${t.toFixed(1)} ${r.stdout.trim()}`);
  }
}
for (const fx of Object.keys(res)) {
  const m = (a) => [...a].sort((x, y) => x - y)[1];
  const b = m(res[fx].base), h = m(res[fx].head);
  const line = `${fx}: base median ${b.toFixed(2)} us/derive, head ${h.toFixed(2)} us/derive, delta ${(h - b).toFixed(2)} us (${((h / b - 1) * 100).toFixed(1)} %), runs base ${res[fx].base.join("/")} head ${res[fx].head.join("/")}`;
  log(line);
  console.log(line);
}
