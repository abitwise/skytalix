/**
 * `ABC-204` — the rating harness. It drives `cutechess-cli` 1.5.1 in two modes, with the pins of
 * the ABC-204 page's `## Design ruling`, and reads `EPIC-008` § The two readings:
 *
 *   node tools/rating/rating.ts r <sha> <out-dir> [--elo E] [--rounds N]
 *   node tools/rating/rating.ts d <candidate-sha> <base-sha> <out-dir> [--budget-ms B] [--rounds N]
 *
 * R plays `skytalix` against Stockfish 19 at `UCI_LimitStrength` and `UCI_Elo` E (default 1650,
 * 100 rounds). D plays a candidate against a base (default 3 000 ms a move, 200 rounds). A round is
 * one opening played with both colours. Each artifact is built in a clone under <out-dir>, which
 * must be empty and outside this checkout. The Elo figure is `cutechess-cli`'s own result line;
 * this file computes no Elo. Runs on demand only, never in the test lane.
 */
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
  appendFileSync,
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  readSync,
  realpathSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { loadavg, release } from "node:os";
import { basename, dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { OPENINGS_SHA256 } from "./openings.ts";

const CUTECHESS = "/Users/olgeroeselg/Projects/others/cutechess/cutechess/build/cutechess-cli";
const CUTECHESS_SHA256 = "fb4fc2aa8d3457ccce2368446a080517be42be69a8a446765b9693833e766e1c";
const STOCKFISH = "/opt/homebrew/bin/stockfish";
const STOCKFISH_SHA256 = "dc2f18c34ae962dff591b66147d220ec06e61d756b93d8a4f5e04fd8e55c251f";
/** Q4 budgets for D; Q1's rule gives each its `timemargin` = 5 000 − budget. */
const D_BUDGETS_MS = [3000, 2500, 2000, 1500, 1000];
const CEILING_MS = 5000;
/** The watchdog: no byte of `cutechess-cli` output for this long stops the run as a stall. */
const WATCHDOG_MS = 600_000;
const POLL_MS = 5_000;
const HOST_LOG_MS = 60_000;

const REPO = realpathSync(fileURLToPath(new URL("../..", import.meta.url)));
const OPENINGS = join(REPO, "tools/rating/openings.epd");

/** `ABC-202` § A3's allow-list of result texts (`result.cpp`, `westernboard.cpp` at `5e84232b`). */
const PASS_TEXT =
  /^(White mates|Black mates|Draw by stalemate|Draw by insufficient mating material|Draw by fifty moves rule|Draw by 3-fold repetition|Draw by adjudication.*|.* wins by adjudication.*)$/;
const FAULT_TEXT =
  /(loses on time|Draw by timeout|makes an illegal move|disconnects|Draw by disconnection|connection stalls|Draw by stalled connection|No result|Result error)/;

const sha256File = (path: string): string =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const run = (cmd: string, args: string[], cwd = REPO): string =>
  execFileSync(cmd, args, { cwd, encoding: "utf8" }).trim();
const quote = (arg: string): string => (/^[\w./=:+-]+$/.test(arg) ? arg : `'${arg}'`);
const stamp = (): string => new Date().toISOString().replace(/\.\d+Z$/, "Z");
/** `cutechess-cli` prints `inf`, `-inf` and `nan`, which `Number` does not read. */
const eloNumber = (text: string): number =>
  ({ inf: Infinity, "-inf": -Infinity, nan: Number.NaN })[text] ?? Number(text);

function usage(): never {
  console.error(
    "usage: node tools/rating/rating.ts r <sha> <out-dir> [--elo E] [--rounds N]\n" +
      "       node tools/rating/rating.ts d <candidate-sha> <base-sha> <out-dir> [--budget-ms B] [--rounds N]",
  );
  process.exit(1);
}

function hostLine(out: string, label: string): void {
  let thermal = "?";
  let power = "?";
  let vitest = 0;
  try {
    thermal =
      run("notifyutil", ["-g", "com.apple.system.thermalpressurelevel"]).split(/\s+/)[1] ?? "?";
    power = (/'(.*)'/.exec(run("pmset", ["-g", "batt"]))?.[1] ?? "?").replaceAll(" ", "_");
    vitest = run("pgrep", ["-f", "/vitest"]).split("\n").length;
  } catch {
    // pgrep exits 1 when nothing matches; that is 0 foreign vitest processes.
  }
  const load1 = (loadavg()[0] ?? 0).toFixed(2);
  appendFileSync(
    join(out, "host.log"),
    `${stamp()} ${label} load1=${load1} thermal=${thermal} power=${power} foreign_vitest_procs=${vitest}\n`,
  );
}

/** Sends `uci` and returns every line up to `uciok`: the `id` and `option` lines. */
async function uciLines(cmd: string, args: string[], cwd: string): Promise<string[]> {
  const child = spawn(cmd, args, { cwd, stdio: ["pipe", "pipe", "ignore"] });
  let text = "";
  const done = new Promise<void>((ok, fail) => {
    const timer = setTimeout(() => fail(new Error(`${cmd}: no uciok in 10 s`)), 10_000);
    child.stdout.on("data", (chunk: Buffer) => {
      text += chunk.toString();
      if (/^uciok$/m.test(text)) {
        clearTimeout(timer);
        ok();
      }
    });
  });
  child.stdin.write("uci\n");
  await done;
  child.stdin.end("quit\n");
  return text.split("\n").filter((line) => /^(id|option) /.test(line));
}

/** Clones this repository at `sha` into `<out>/clone-<name>`, then `npm ci && npm run build`. */
async function buildArtifact(out: string, name: string, sha: string): Promise<string> {
  const clone = join(out, `clone-${name}`);
  const log = openSync(join(out, `build-${name}.log`), "w");
  const step = (cmd: string, args: string[], cwd: string): void => {
    execFileSync(cmd, args, { cwd, stdio: ["ignore", log, log] });
  };
  step("git", ["clone", "--quiet", "--no-checkout", REPO, clone], out);
  step("git", ["checkout", "--quiet", sha], clone);
  step("npm", ["ci"], clone);
  step("npm", ["run", "build"], clone);
  closeSync(log);
  const uci = join(clone, "dist/uci.js");
  const lines = await uciLines(process.execPath, [uci], clone);
  appendFileSync(
    join(out, "artifacts.txt"),
    `${name} ${sha} dist/uci.js sha256 ${sha256File(uci)}\n${lines.map((l) => `  ${l}`).join("\n")}\n`,
  );
  return clone;
}

/** Runs `cutechess-cli` with stdout and stderr on `<file>`, logs the host, and keeps a watchdog. */
async function play(out: string, args: string[], file: string): Promise<string | undefined> {
  const fd = openSync(file, "w");
  const child = spawn(CUTECHESS, args, { cwd: out, stdio: ["ignore", fd, fd] });
  hostLine(out, "start");
  let offset = 0;
  let grewAt = Date.now();
  let loggedAt = Date.now();
  let finished = 0;
  let pending = "";
  let watchdog: string | undefined;
  const timer = setInterval(() => {
    const size = statSync(file).size;
    if (size > offset) {
      const buffer = Buffer.alloc(size - offset);
      const reader = openSync(file, "r");
      readSync(reader, buffer, 0, buffer.length, offset);
      closeSync(reader);
      offset = size;
      grewAt = Date.now();
      const lines = (pending + buffer.toString()).split("\n");
      pending = lines.pop() ?? "";
      for (const line of lines) {
        if (line.startsWith("Finished game ")) hostLine(out, `after-game-${++finished}`);
      }
    }
    if (Date.now() - loggedAt >= HOST_LOG_MS) {
      hostLine(out, "periodic");
      loggedAt = Date.now();
    }
    if (Date.now() - grewAt >= WATCHDOG_MS && watchdog === undefined) {
      watchdog = `watchdog stop: no output for ${WATCHDOG_MS / 1000} s`;
      child.kill("SIGTERM");
    }
  }, POLL_MS);
  const code = await new Promise<number | null>((ok) => child.on("exit", ok));
  clearInterval(timer);
  closeSync(fd);
  hostLine(out, "end");
  if (watchdog !== undefined) return watchdog;
  return code === 0 ? undefined : `cutechess-cli exited ${code}`;
}

/** 1 + int(level(E)), `search.h:261-268` at `sf_19`: the depth Stockfish picks its move at. */
function pickDepth(elo: number): number {
  const e = (elo - 1320) / (3190 - 1320);
  const level = Math.min(19, Math.max(0, ((37.2473 * e - 40.8525) * e + 22.2943) * e - 0.311438));
  return 1 + Math.trunc(level);
}

/** Q2's guard: every move Stockfish played carries a PGN depth ≥ its pick depth. */
function depthMisses(pgn: string, engine: string, minDepth: number): [number, number] {
  let moves = 0;
  let misses = 0;
  for (const game of pgn.split(/\n(?=\[Event )/)) {
    const white = /^\[White "(.*)"\]$/m.exec(game)?.[1];
    const black = /^\[Black "(.*)"\]$/m.exec(game)?.[1];
    let side = /^\[FEN "\S+ ([wb]) /m.exec(game)?.[1] ?? "w";
    const text = game.replace(/^\[.*\]$/gm, "");
    const tokens = text.match(/\{[^}]*\}|[^\s{}]+/g) ?? [];
    let mover = "";
    let checked = true;
    for (const token of tokens) {
      if (/^\d+\.+$/.test(token) || /^(1-0|0-1|1\/2-1\/2|\*)$/.test(token)) continue;
      if (token.startsWith("{")) {
        const depth = /^\{[+-]?M?[\d.]+\/(\d+)/.exec(token)?.[1];
        if (mover === engine && depth !== undefined && Number(depth) >= minDepth) checked = true;
        continue;
      }
      if (mover === engine && !checked) misses++;
      mover = side === "w" ? (white ?? "") : (black ?? "");
      side = side === "w" ? "b" : "w";
      if (mover === engine) moves++;
      checked = mover !== engine;
    }
    if (mover === engine && !checked) misses++;
  }
  return [moves, misses];
}

interface Reading {
  readonly mode: "r" | "d";
  readonly out: string;
  readonly games: number;
  readonly elo?: number;
}

/** Reads the raw files and prints the result block; returns the printed text. */
function summarise(reading: Reading, stop: string | undefined, stderrs: string[]): string {
  const { mode, out, games } = reading;
  const outText = readFileSync(join(out, `${mode}.out`), "utf8");
  const pgnPath = join(out, `${mode}.pgn`);
  const pgn = existsSync(pgnPath) ? readFileSync(pgnPath, "utf8") : "";
  const causes: string[] = stop === undefined ? [] : [stop];
  const lines: string[] = [];

  const finished = [
    ...outText.matchAll(/^Finished game (\d+) \((.+) vs (.+)\): (\S+) \{(.*)\}$/gm),
  ];
  const faults = finished.filter((m) => FAULT_TEXT.test(m[5] as string));
  const unknown = finished.filter(
    (m) => !PASS_TEXT.test(m[5] as string) && !FAULT_TEXT.test(m[5] as string),
  );
  const capped = finished.filter((m) => (m[5] as string).startsWith("Draw by adjudication"));
  for (const m of faults) causes.push(`fault in game ${m[1]}: {${m[5]}}`);
  for (const m of unknown) causes.push(`unclassified result text in game ${m[1]}: {${m[5]}}`);
  const pgnGames = (pgn.match(/^\[Result "(1-0|0-1|1\/2-1\/2)"\]$/gm) ?? []).length;
  if (finished.length < games || pgnGames < games) {
    causes.push(`games: ${finished.length} finished, ${pgnGames} in the PGN, ${games} pinned`);
  }
  for (const file of [`${mode}.pgn`, ...stderrs]) {
    if (!existsSync(join(out, file))) causes.push(`raw file missing: ${file}`);
  }

  const elo = [
    ...outText.matchAll(/^Elo difference: (\S+) \+\/- (\S+), .*DrawRatio: (\S+) %.*$/gm),
  ].at(-1);
  const score = [
    ...outText.matchAll(/^Score of .+ vs .+: (\d+) - (\d+) - (\d+)\s+\[(\S+)\] (\d+)$/gm),
  ].at(-1);
  lines.push(elo?.[0] ?? "Elo difference: (no line)");
  if (score !== undefined) {
    lines.push(
      `W/L/D: ${score[1]}/${score[2]}/${score[3]}  score: ${score[4]}  games: ${score[5]} of ${games}`,
    );
  }
  if (elo !== undefined) lines.push(`draw ratio: ${elo[3]} %`);
  lines.push(
    `faults: ${faults.length}  unclassified: ${unknown.length}  move-cap draws: ${capped.length}`,
  );
  for (const file of stderrs) {
    if (existsSync(join(out, file))) lines.push(`${file}: ${statSync(join(out, file)).size} bytes`);
  }
  if (elo === undefined || score === undefined) causes.push("no Elo or Score line in the .out");

  const x = eloNumber(elo?.[1] ?? "nan");
  const y = eloNumber(elo?.[2] ?? "nan");
  let state = x - y > 0 ? "GAIN" : x + y < 0 ? "LOSS" : "NEUTRAL";
  if (mode === "r") {
    const e = reading.elo as number;
    const minDepth = pickDepth(e);
    const [moves, misses] = depthMisses(pgn, "stockfish", minDepth);
    lines.push(`stockfish depth guard: ${misses} of ${moves} moves below depth ${minDepth}`);
    if (misses > 0) causes.push(`stockfish depth guard: ${misses} moves below depth ${minDepth}`);
    state = `rating E + X ± Y = ${e} + ${elo?.[1]} ± ${elo?.[2]} = ${e + x} ± ${elo?.[2]}`;
  }
  if (causes.length > 0) state = "UNRESOLVED";
  lines.push(`state: ${state}${causes.map((c) => `\n  - ${c}`).join("")}`);
  return `${lines.join("\n")}\n`;
}

async function main(argv: string[]): Promise<void> {
  const flags = new Map<string, string>();
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] as string;
    if (arg.startsWith("--")) flags.set(arg, argv[++i] ?? usage());
    else positional.push(arg);
  }
  const mode = positional[0];
  if ((mode !== "r" && mode !== "d") || positional.length !== (mode === "r" ? 3 : 4)) usage();
  const allowed = mode === "r" ? ["--elo", "--rounds"] : ["--budget-ms", "--rounds"];
  if ([...flags.keys()].some((flag) => !allowed.includes(flag))) usage();
  const shas = positional
    .slice(1, -1)
    .map((ref) => run("git", ["rev-parse", "--verify", `${ref}^{commit}`]));
  const elo = Number(flags.get("--elo") ?? 1650);
  const budget = Number(flags.get("--budget-ms") ?? 3000);
  const rounds = Number(flags.get("--rounds") ?? (mode === "r" ? 100 : 200));
  if (!Number.isInteger(elo) || elo < 1320 || elo > 3190)
    throw new Error(`--elo ${elo}: not 1320–3190`);
  if (!D_BUDGETS_MS.includes(budget))
    throw new Error(`--budget-ms ${budget}: not one of ${D_BUDGETS_MS}`);
  if (!Number.isInteger(rounds) || rounds < 1)
    throw new Error(`--rounds ${rounds}: not a positive integer`);

  const out = resolve(positional.at(-1) as string);
  const realOut = join(realpathSync(dirname(out)), basename(out));
  if (realOut === REPO || realOut.startsWith(REPO + sep))
    throw new Error(`${out} is inside ${REPO}`);
  mkdirSync(out, { recursive: true });
  if (readdirSync(out).length > 0) throw new Error(`${out} is not empty`);

  // Pins: tools (A1, a difference is recorded, not a stop) and the openings (Q5, a stop).
  hostLine(out, "before");
  const sfLines = await uciLines(STOCKFISH, [], out);
  const toolSha = [sha256File(CUTECHESS), sha256File(STOCKFISH)];
  const machine = [
    `chip: ${run("sysctl", ["-n", "machdep.cpu.brand_string"])}`,
    `darwin: ${release()}`,
    `node: ${process.execPath} ${process.version}`,
    `cutechess-cli: ${run(CUTECHESS, ["--version"]).split("\n")[0]} sha256 ${toolSha[0]} ${toolSha[0] === CUTECHESS_SHA256 ? "= pin" : `DIFFERS from pin ${CUTECHESS_SHA256}`}`,
    `stockfish: ${sfLines.find((l) => l.startsWith("id name"))} sha256 ${toolSha[1]} ${toolSha[1] === STOCKFISH_SHA256 ? "= pin" : `DIFFERS from pin ${STOCKFISH_SHA256}`}`,
    `openings: ${OPENINGS} sha256 ${sha256File(OPENINGS)}`,
    `harness: ${REPO} at ${run("git", ["rev-parse", "HEAD"])}`,
  ].join("\n");
  writeFileSync(join(out, "machine.txt"), `${machine}\n`);
  console.log(machine);
  if (sha256File(OPENINGS) !== OPENINGS_SHA256) {
    throw new Error(`openings sha256 ${sha256File(OPENINGS)} is not the pin ${OPENINGS_SHA256}`);
  }

  // Artifacts, then the pinned command (design ruling § The R command shape).
  const names = mode === "r" ? ["skytalix"] : ["skytalix", "base"];
  const clones: string[] = [];
  for (const [i, name] of names.entries())
    clones.push(await buildArtifact(out, name, shas[i] as string));
  const sky = (name: string, clone: string, ms: number): string[] => [
    "-engine",
    `name=${name}`,
    `cmd=${process.execPath}`,
    `arg=${join(clone, "dist/uci.js")}`,
    `dir=${clone}`,
    `st=${ms / 1000}`,
    `timemargin=${CEILING_MS - ms}`,
    "restart=on",
    `stderr=${join(out, `${name}.stderr`)}`,
  ];
  const opponent =
    mode === "r"
      ? [
          "-engine",
          "name=stockfish",
          `cmd=${STOCKFISH}`,
          "st=0.5",
          "timemargin=2000",
          "restart=on",
          "option.Threads=1",
          "option.Hash=16",
          "option.UCI_LimitStrength=true",
          `option.UCI_Elo=${elo}`,
          `stderr=${join(out, "stockfish.stderr")}`,
        ]
      : sky("base", clones[1] as string, budget);
  const args = [
    ...sky("skytalix", clones[0] as string, mode === "r" ? 3000 : budget),
    ...opponent,
    ...["-each", "proto=uci"],
    ...["-openings", `file=${OPENINGS}`, "format=epd", "order=sequential", "-repeat"],
    ...["-games", "2", "-rounds", String(rounds), "-concurrency", mode === "r" ? "2" : "3"],
    ...["-maxmoves", "200", "-pgnout", join(out, `${mode}.pgn`), "-debug", "all"],
  ];
  const outFile = join(out, `${mode}.out`);
  writeFileSync(
    join(out, "cmd.txt"),
    `${[CUTECHESS, ...args].map(quote).join(" ")} > ${quote(outFile)} 2>&1\n`,
  );

  const stop = await play(out, args, outFile);
  const stderrs =
    mode === "r" ? ["skytalix.stderr", "stockfish.stderr"] : ["skytalix.stderr", "base.stderr"];
  const summary = summarise({ mode, out, games: 2 * rounds, elo }, stop, stderrs);
  writeFileSync(join(out, "summary.txt"), summary);
  console.log(summary);

  const raw = readdirSync(out).filter((f) => f !== "SHA256SUMS" && statSync(join(out, f)).isFile());
  writeFileSync(
    join(out, "SHA256SUMS"),
    raw
      .sort()
      .map((f) => `${sha256File(join(out, f))}  ${f}\n`)
      .join(""),
  );
}

await main(process.argv.slice(2));
