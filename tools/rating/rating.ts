/**
 * `ABC-204` — the rating harness. It drives `cutechess-cli` 1.5.1 in two modes, with the pins of
 * the ABC-204 page's `## Design ruling`, and reads `EPIC-008` § The two readings:
 *
 *   node tools/rating/rating.ts r <sha> <out-dir> [--elo E] [--budget-ms 500] [--rounds N] [--concurrency C]
 *   node tools/rating/rating.ts d <candidate-sha> <base-sha> <out-dir> [--budget-ms B] [--rounds N] [--concurrency C]
 *   node tools/rating/rating.ts rpair <base-sha> <candidate-sha> <out-dir> [--elo E] [--rounds N] [--concurrency C]
 *
 * Any mode takes `--dry-run`: it prints the `cutechess-cli` argument vector(s) (and, for `rpair`, the
 * block schedule) and stops. It builds nothing, starts no engine and writes no file.
 *
 * The environment gives both tool paths: `CUTECHESS_CLI` and `STOCKFISH`. There is no default; a
 * missing or unreadable one stops the run before any work and names the variable.
 *
 * R plays `skytalix` against Stockfish 19 at `UCI_LimitStrength` and `UCI_Elo` E (default 1650,
 * 100 rounds). D plays a candidate against a base (default 3 000 ms a move, 200 rounds). A round is
 * one opening played with both colours. `--concurrency` C (1–8) is `cutechess-cli`'s `-concurrency`;
 * without it the frozen Q4 values stand, R 2 and D 3 (ABC-204 § Dependencies, 2026-10-29). Each
 * artifact is built in a clone under <out-dir>, which must be empty and outside this checkout
 * (resolved through any symlink). `artifacts.txt` records each side's whole `dist/`: a per-file
 * sha256 manifest and its tree hash. The Elo figure is `cutechess-cli`'s own result line; this file
 * computes no Elo. Runs on demand only, never in the test lane.
 *
 * `ABC-225` — `rpair` reads two builds exactly as `r` reads one (default E 1 910, the frozen pin,
 * and R's width 2), interleaved: the openings go in blocks of 10 (20 games per build per block), and
 * the blocks alternate base-first and candidate-first. Each block of each build is one
 * `cutechess-cli` run whose argument vector is `r`'s but for `-openings … start=S`, `-rounds 10` and
 * its output paths. Per build it prints the `Elo difference` line pooled over its blocks by
 * cutechess-cli 1.5.1's own formula (`pair.ts`, checked against each block's own line), the pair
 * X₂ − X₁ ± √(Y₁² + Y₂²) with EPIC-008's states, and the opening-paired (pentanomial) difference,
 * labelled information. `nps.log` holds Stockfish's median nps per block per build and `thermal.log`
 * a Tctl, busy-core frequency and load sample every 10 s. Every record under <out-dir> but the
 * build clones is written with placeholders for host paths, user and host name (`ADR-0049` d4).
 *
 * `ABC-247` — `rpair` also gives skytalix `option.Skill Level=6` (`PAIR_SKILL_LEVEL`) on both builds.
 * `go()` caps `go movetime 4000` at `LEVELS[skill].budgetMs`, and the default level 5 is 3 000 ms on
 * a base before `ABC-228`. Level 6 is 5 000 ms and rate 0 at every SHA in `EPIC-010`, so both builds
 * search the 4 000 ms `ADR-0053` d10 names. `r` and `d` send no `Skill Level` (the shipped level 5).
 *
 * `ABC-255` — the owner's reads (`ADR-0056` C2′, C3″, S′). `d --budget-ms 100` plays both sides at
 * `st=0.1` with `timemargin` 50 ms: the change read is `--rounds 50` (100 games), the epic read
 * `--rounds 200` (400 games). `r --budget-ms 500` (the only value `r` takes) is the smoke: skytalix at
 * `st=0.5` with `timemargin` 50 ms, Stockfish's pins unchanged. Every other budget keeps Q1's
 * 5 000 − budget, so `r` without the flag, every `rpair` and today's `d` budgets print as before.
 * The control reaches skytalix only as `st=` and `timemargin=` (`ADR-0056` R-TC).
 */
import { execFileSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
  accessSync,
  appendFileSync,
  closeSync,
  constants,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  readSync,
  realpathSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { cpus, homedir, hostname, loadavg, platform, release, userInfo } from "node:os";
import { basename, dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { artifactRecord } from "./dist-manifest.ts";
import { OPENINGS_SHA256 } from "./openings.ts";
import {
  type Block,
  type Build,
  blockLine,
  coverageCauses,
  cutechessElo,
  eloText,
  openingScores,
  PAIR_ROUNDS,
  type PgnGame,
  pairDifference,
  pairSchedule,
  pentanomialPair,
  pgnGames,
  redact,
  SHA_ARG,
  stateOf,
  stockfishNps,
} from "./pair.ts";

/** A tool's path from the environment variable `name`; no default (ABC-204 § Dependencies, 2026-10-28). */
function toolPath(name: string): string {
  const path = process.env[name];
  if (path === undefined || path === "")
    throw new Error(`${name} is not set: give the tool's path`);
  try {
    accessSync(path, constants.R_OK);
  } catch {
    throw new Error(`${name} is not a readable file`);
  }
  return path;
}

const CUTECHESS = toolPath("CUTECHESS_CLI");
const CUTECHESS_SHA256 = "dc77690113d9ae130f5d1b4c76fefb28f42620ac45a2bd4abb7dd8eb2154f40a";
const STOCKFISH = toolPath("STOCKFISH");
const STOCKFISH_SHA256 = "c78c22a924e8d452e1089ec8d47826f7a276aba69373185e82cbac4593e352d2";
/** Q4 budgets for D, each with Q1's `timemargin` = 5 000 − budget; `ABC-255` adds C2′'s 100 (`SHORT_MARGIN_MS`). */
const D_BUDGETS_MS = [3000, 2500, 2000, 1500, 1000, 100];
/** R's skytalix budget (design ruling), and the one `--budget-ms` R takes (`ABC-255`, `ADR-0056` S′). */
const R_BUDGET_MS = 4000;
const R_SMOKE_BUDGET_MS = 500;
const CEILING_MS = 5000;
/** `ADR-0056` C2′ and S′: a short budget's fixed `timemargin`, not Q1's 5 000 − budget. */
const SHORT_MARGIN_MS = new Map([
  [100, 50],
  [R_SMOKE_BUDGET_MS, 50],
]);
/** skytalix's `timemargin` at a budget: the short budget's fixed margin, else 5 000 − budget. */
export const timemarginMs = (ms: number): number => SHORT_MARGIN_MS.get(ms) ?? CEILING_MS - ms;
/** The watchdog: no byte of `cutechess-cli` output for this long stops the run as a stall. */
const WATCHDOG_MS = 600_000;
const POLL_MS = 5_000;
const HOST_LOG_MS = 60_000;
/** `ABC-225` scope 4: the `qe-epic008-q4c` sampler's 10 s cadence. */
const SAMPLE_MS = 10_000;

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
    "usage: node tools/rating/rating.ts r <sha> <out-dir> [--elo E] [--budget-ms 500] [--rounds N] [--concurrency C]\n" +
      "       node tools/rating/rating.ts d <candidate-sha> <base-sha> <out-dir> [--budget-ms B] [--rounds N] [--concurrency C]\n" +
      "       node tools/rating/rating.ts rpair <base-sha> <candidate-sha> <out-dir> [--elo E] [--rounds N] [--concurrency C]\n" +
      "       --concurrency: 1–8; default R 2, D 3, rpair 2\n" +
      "       --budget-ms: R 500 only (default 4000); D 3000 (default), 2500, 2000, 1500, 1000 or 100\n" +
      "       rpair: --elo default 1910; --rounds 10–100 in tens, default 100 (10 = one block per build, 40 games)\n" +
      "       --dry-run (any mode): print the cutechess-cli arguments and stop",
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
  } catch {
    // macOS only: on Linux `notifyutil` and `pmset` are absent, and both stay "?".
  }
  try {
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
  const lines = await uciLines(process.execPath, [join(clone, "dist/uci.js")], clone);
  appendFileSync(
    join(out, "artifacts.txt"),
    `${artifactRecord(name, sha, join(clone, "dist"))}${lines.map((l) => `  ${l}\n`).join("")}`,
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

export interface Reading {
  readonly mode: "r" | "d";
  readonly out: string;
  readonly games: number;
  readonly elo?: number;
}

/** One reading's verdict: the printed text, and for `rpair` the facts it pools. */
export interface Judged {
  readonly text: string;
  readonly causes: readonly string[];
  /** The last `Score of` line's W/L/D, if any. */
  readonly wld: readonly [number, number, number] | undefined;
  /** The last `Elo difference` line's X and Y as printed, if any. */
  readonly elo: { readonly x: string; readonly y: string } | undefined;
}

/** Reads the raw files and builds the result block; `text` is the printed text. */
export function summarise(reading: Reading, stop: string | undefined, stderrs: string[]): Judged {
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
  return {
    text: `${lines.join("\n")}\n`,
    causes,
    wld: score === undefined ? undefined : [Number(score[1]), Number(score[2]), Number(score[3])],
    elo: elo === undefined ? undefined : { x: elo[1] as string, y: elo[2] as string },
  };
}

/** One `cutechess-cli` run's inputs; `files` holds its PGN and stderr files. */
export interface ArgSpec {
  readonly mode: "r" | "d";
  readonly files: string;
  readonly clones: readonly string[];
  readonly elo: number;
  readonly budget: number;
  readonly rounds: number;
  readonly concurrency: number;
  /** `rpair` only: the block's first opening, as `-openings … start=S`. */
  readonly start?: number;
  /** `rpair` only (`ABC-247`): skytalix's `Skill Level`, as `option.Skill Level=L`; absent, none. */
  readonly skill?: number;
}

/** `ABC-247`: the `Skill Level` `rpair` gives skytalix on both builds. */
export const PAIR_SKILL_LEVEL = 6;

/** The pinned command (design ruling § The R command shape). */
export function cutechessArgs(spec: ArgSpec): string[] {
  const { mode, files, clones, elo, budget, rounds, concurrency } = spec;
  const sky = (name: string, clone: string, ms: number): string[] => [
    "-engine",
    `name=${name}`,
    `cmd=${process.execPath}`,
    `arg=${join(clone, "dist/uci.js")}`,
    `dir=${clone}`,
    `st=${ms / 1000}`,
    `timemargin=${timemarginMs(ms)}`,
    "restart=on",
    ...(spec.skill === undefined ? [] : [`option.Skill Level=${spec.skill}`]),
    `stderr=${join(files, `${name}.stderr`)}`,
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
          `stderr=${join(files, "stockfish.stderr")}`,
        ]
      : sky("base", clones[1] as string, budget);
  const start = spec.start === undefined ? [] : [`start=${spec.start}`];
  return [
    ...sky("skytalix", clones[0] as string, budget),
    ...opponent,
    ...["-each", "proto=uci"],
    ...["-openings", `file=${OPENINGS}`, "format=epd", "order=sequential", ...start, "-repeat"],
    ...["-games", "2", "-rounds", String(rounds), "-concurrency", String(concurrency)],
    ...["-maxmoves", "200", "-pgnout", join(files, `${mode}.pgn`), "-debug", "all"],
  ];
}

/** Host paths → placeholders for every `rpair` record (`ADR-0049` d4); `out` only when given. */
function hostPaths(out?: string): [string, string][] {
  const pairs: [string, string][] = [
    [REPO, "<repo>"],
    [CUTECHESS, "<cutechess-cli>"],
    [STOCKFISH, "<stockfish>"],
    [process.execPath, "<node>"],
    [homedir(), "<home>"],
  ];
  for (const [path, label] of [
    [CUTECHESS, "<cutechess-cli>"],
    [STOCKFISH, "<stockfish>"],
    ...(out === undefined ? [] : [[out, "<out>"]]),
  ] as [string, string][]) {
    pairs.push([path, label]);
    try {
      pairs.push([realpathSync(path), label]);
    } catch {
      // Not there yet (a dry run's out-dir): the given path is enough.
    }
  }
  return pairs;
}
const hostWords = (): [string, string][] => [
  [userInfo().username, "<user>"],
  [hostname(), "<host>"],
];
const redacted = (text: string, out?: string): string => redact(text, hostPaths(out), hostWords());

/** The dry run's print: one argument per line, host paths as placeholders, out-dir as given. */
const argvText = (args: readonly string[]): string =>
  [CUTECHESS, ...args].map((a) => `  ${redacted(a)}`).join("\n");

/** `qe-epic008-q4c`'s sampler shape: load, Tctl (k10temp) and the busiest core's MHz, every 10 s. */
function sample(out: string): void {
  const read = (path: string): string | undefined => {
    try {
      return readFileSync(path, "utf8").trim();
    } catch {
      return undefined;
    }
  };
  let tctl = "?";
  try {
    for (const h of readdirSync("/sys/class/hwmon")) {
      if (read(`/sys/class/hwmon/${h}/name`) !== "k10temp") continue;
      const t = read(`/sys/class/hwmon/${h}/temp1_input`);
      if (t !== undefined) tctl = (Number(t) / 1000).toFixed(1);
      break;
    }
  } catch {
    // No hwmon (macOS): Tctl stays "?".
  }
  const busiest = (file: string): string => {
    let cpus: string[] = [];
    try {
      cpus = readdirSync("/sys/devices/system/cpu").filter((n) => /^cpu\d+$/.test(n));
    } catch {
      return "?";
    }
    const mhz = cpus
      .map((n) => Number(read(`/sys/devices/system/cpu/${n}/cpufreq/${file}`)) / 1000)
      .filter((v) => Number.isFinite(v) && v > 0);
    return mhz.length === 0 ? "?" : String(Math.round(Math.max(...mhz)));
  };
  appendFileSync(
    join(out, "thermal.log"),
    `${stamp()} load1=${(loadavg()[0] ?? 0).toFixed(2)} tctl=${tctl} busy_mhz=${busiest("cpuinfo_avg_freq")} req_mhz=${busiest("scaling_cur_freq")}\n`,
  );
}

/** Makes `out` (resolved), refusing a path inside this checkout or a non-empty directory. */
function freshOut(out: string): void {
  const inside = (real: string): void => {
    if (real === REPO || real.startsWith(REPO + sep)) throw new Error(`${out} is inside ${REPO}`);
  };
  inside(join(realpathSync(dirname(out)), basename(out)));
  mkdirSync(out, { recursive: true });
  // QE-204-a: the leaf itself may be a symlink into the checkout, so resolve it before any write.
  inside(realpathSync(out));
  if (readdirSync(out).length > 0) throw new Error(`${out} is not empty`);
}

/** The machine lines before any build: tools, their pins, the openings and this harness. */
async function machineLines(out: string): Promise<string[]> {
  const sfLines = await uciLines(STOCKFISH, [], out);
  const toolSha = [sha256File(CUTECHESS), sha256File(STOCKFISH)];
  return [
    `chip: ${cpus()[0]?.model ?? "?"}`,
    `${platform()}: ${release()}`,
    `node: ${process.execPath} ${process.version}`,
    `cutechess-cli: ${run(CUTECHESS, ["--version"]).split("\n")[0]} sha256 ${toolSha[0]} ${toolSha[0] === CUTECHESS_SHA256 ? "= pin" : `DIFFERS from pin ${CUTECHESS_SHA256}`}`,
    `stockfish: ${sfLines.find((l) => l.startsWith("id name"))} sha256 ${toolSha[1]} ${toolSha[1] === STOCKFISH_SHA256 ? "= pin" : `DIFFERS from pin ${STOCKFISH_SHA256}`}`,
    `openings: ${OPENINGS} sha256 ${sha256File(OPENINGS)}`,
    `harness: ${REPO} at ${run("git", ["rev-parse", "HEAD"])}`,
  ];
}

/** One played block of one build. */
export interface BlockResult {
  readonly block: Block;
  readonly judged: Judged;
  readonly games: readonly PgnGame[];
}

/** One build's pooled reading in the pair. */
export interface BuildReading {
  readonly lines: readonly string[];
  readonly causes: readonly string[];
  readonly elo: { readonly x: string; readonly y: string } | undefined;
  readonly scores: ReadonlyMap<number, readonly number[]>;
}

const pad2 = (n: number): string => String(n).padStart(2, "0");

/**
 * Pools one build's blocks: each block's causes (its `summarise` and its opening coverage), the
 * pooled `Elo difference` line, and a check that the formula gives each block's own printed line.
 */
export function readBuild(
  build: Build,
  schedule: readonly Block[],
  played: readonly BlockResult[],
  elo: number,
  epd: readonly string[],
): BuildReading {
  const causes: string[] = [];
  const scores = new Map<number, number[]>();
  let [w, l, d] = [0, 0, 0];
  for (const { block, judged, games } of played) {
    const tag = `block ${pad2(block.index)}`;
    for (const c of judged.causes) causes.push(`${tag}: ${c}`);
    for (const c of coverageCauses(games, block.start, block.rounds, epd, "skytalix"))
      causes.push(`${tag}: ${c}`);
    if (judged.wld !== undefined) {
      w += judged.wld[0];
      l += judged.wld[1];
      d += judged.wld[2];
      const own = cutechessElo(...judged.wld);
      const mine = { x: eloText(own.x), y: eloText(own.y) };
      if (judged.elo !== undefined && (mine.x !== judged.elo.x || mine.y !== judged.elo.y)) {
        causes.push(
          `${tag}: the pooling formula gives ${mine.x} +/- ${mine.y}, cutechess-cli printed ${judged.elo.x} +/- ${judged.elo.y}`,
        );
      }
    }
    for (const [k, v] of openingScores(games, block.start, "skytalix"))
      scores.set(k, [...(scores.get(k) ?? []), ...v]);
  }
  if (played.length < schedule.length)
    causes.push(`blocks: ${played.length} of ${schedule.length} played`);
  const n = w + l + d;
  const pinned = 2 * schedule.reduce((s, b) => s + b.rounds, 0);
  const pooled = n > 0 ? cutechessElo(w, l, d) : undefined;
  const line = pooled === undefined ? undefined : { x: eloText(pooled.x), y: eloText(pooled.y) };
  const lines = [
    line === undefined
      ? `${build}: Elo difference: (no score)`
      : `${build}: Elo difference: ${line.x} +/- ${line.y} (cutechess-cli 1.5.1's formula on ${played.length} blocks' pooled score)`,
    `  W/L/D: ${w}/${l}/${d}  score: ${n > 0 ? ((w + d / 2) / n).toFixed(3) : "?"}  games: ${n} of ${pinned}`,
    `  draw ratio: ${n > 0 ? ((100 * d) / n).toFixed(1) : "?"} %`,
  ];
  const state =
    causes.length > 0 || line === undefined
      ? "UNRESOLVED"
      : `rating E + X ± Y = ${elo} + ${line.x} ± ${line.y} = ${(elo + Number(line.x)).toFixed(1)} ± ${line.y}`;
  lines.push(`  state: ${state}${causes.map((c) => `\n    - ${c}`).join("")}`);
  return { lines, causes, elo: line, scores };
}

/** The pair block of `summary.txt`: both builds, the pair and its state, the pentanomial line. */
export function pairSummary(
  base: BuildReading,
  candidate: BuildReading,
  halted: string | undefined,
): string {
  const lines = [...base.lines, ...candidate.lines];
  const resolved = base.causes.length === 0 && candidate.causes.length === 0;
  if (base.elo !== undefined && candidate.elo !== undefined) {
    const p = pairDifference(base.elo, candidate.elo);
    lines.push(
      `pair: candidate − base = ${candidate.elo.x} − ${base.elo.x} ± √(${base.elo.y}² + ${candidate.elo.y}²) = ${p.x.toFixed(1)} ± ${p.y.toFixed(1)}`,
    );
    lines.push(
      `pair state: ${resolved && Number.isFinite(p.x + p.y) ? stateOf(Number(p.x.toFixed(1)), Number(p.y.toFixed(1))) : "UNRESOLVED (a build is UNRESOLVED)"}`,
    );
  } else {
    lines.push("pair: (no score)", "pair state: UNRESOLVED (a build has no score)");
  }
  const penta = pentanomialPair(base.scores, candidate.scores);
  lines.push(
    penta === undefined
      ? "opening-paired (pentanomial), information only: (fewer than 2 paired openings)"
      : `opening-paired (pentanomial), information only: ${penta.x.toFixed(1)} ± ${penta.half.toFixed(1)} (95 %, ${penta.openings} openings, r = ${penta.corr.toFixed(3)})`,
  );
  if (halted !== undefined) lines.push(`halted: ${halted}`);
  return `${lines.join("\n")}\n`;
}

/** Every regular file under `dir` but the build clones, as POSIX paths relative to `root`. */
function recordFiles(root: string, dir = root): string[] {
  const found: string[] = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = lstatSync(path);
    if (stat.isDirectory() && !name.startsWith("clone-")) found.push(...recordFiles(root, path));
    else if (stat.isFile()) found.push(relative(root, path).split(sep).join("/"));
  }
  return found;
}

/** `rating.ts rpair`: the interleaved R pair (`ABC-225`). */
async function rpair(positional: string[], flags: Map<string, string>, dryRun: boolean) {
  if (positional.length !== 4) usage();
  if ([...flags.keys()].some((flag) => !["--elo", "--rounds", "--concurrency"].includes(flag)))
    usage();
  const refs = positional.slice(1, 3) as [string, string];
  for (const ref of refs) {
    if (!SHA_ARG.test(ref)) throw new Error(`${ref}: not a sha (7–40 lowercase hex digits)`);
  }
  const elo = Number(flags.get("--elo") ?? 1910);
  if (!Number.isInteger(elo) || elo < 1320 || elo > 3190)
    throw new Error(`--elo ${elo}: not 1320–3190`);
  const roundsFlag = flags.get("--rounds") ?? String(PAIR_ROUNDS);
  if (!/^([1-9]0|100)$/.test(roundsFlag))
    throw new Error(`--rounds ${roundsFlag}: not 10–100 in tens`);
  const concurrencyFlag = flags.get("--concurrency");
  if (concurrencyFlag !== undefined && !/^[1-8]$/.test(concurrencyFlag))
    throw new Error(`--concurrency ${concurrencyFlag}: not an integer from 1 to 8`);
  const concurrency = Number(concurrencyFlag ?? 2);
  const schedule = pairSchedule(Number(roundsFlag));
  const shas = refs.map((ref) => run("git", ["rev-parse", "--verify", `${ref}^{commit}`]));
  const builds: Build[] = ["base", "candidate"];
  const out = resolve(positional[3] as string);
  const dirOf = (build: Build, block: Block): string => join(out, build, `b${pad2(block.index)}`);
  const argsOf = (build: Build, block: Block): string[] =>
    cutechessArgs({
      mode: "r",
      files: dirOf(build, block),
      clones: [join(out, build, "clone-skytalix")],
      elo,
      budget: R_BUDGET_MS,
      rounds: block.rounds,
      concurrency,
      start: block.start,
      skill: PAIR_SKILL_LEVEL,
    });
  const scheduleText = [
    `schedule: ${schedule.length} blocks of 10 openings per build, 2 games per opening (both colours)`,
    ...schedule.map(blockLine),
  ].join("\n");

  if (dryRun) {
    console.log(`rpair dry run: nothing is built, started or written\n${scheduleText}`);
    for (const block of schedule) {
      for (const build of block.order) {
        console.log(`block ${pad2(block.index)} ${build} cutechess-cli argv:`);
        console.log(argvText(argsOf(build, block)));
      }
    }
    return;
  }

  freshOut(out);
  const red = (text: string): string => redacted(text, out);
  hostLine(out, "before");
  const machine = [
    ...(await machineLines(out)),
    `mode: rpair  base ${shas[0]}  candidate ${shas[1]}  E ${elo}  ${schedule.length} blocks per build`,
    `concurrency: ${concurrency} ${concurrency === 2 ? "(default)" : "(default 2)"}`,
  ].join("\n");
  writeFileSync(join(out, "machine.txt"), `${red(machine)}\n`);
  console.log(red(machine));
  if (sha256File(OPENINGS) !== OPENINGS_SHA256) {
    throw new Error(`openings sha256 ${sha256File(OPENINGS)} is not the pin ${OPENINGS_SHA256}`);
  }
  const epd = readFileSync(OPENINGS, "utf8").split("\n");

  for (const [i, build] of builds.entries()) {
    mkdirSync(join(out, build));
    await buildArtifact(join(out, build), "skytalix", shas[i] as string);
  }
  writeFileSync(join(out, "schedule.txt"), `${scheduleText}\n`);
  const cmds = schedule.flatMap((block) =>
    block.order.map((build) => {
      const outFile = join(dirOf(build, block), "r.out");
      return `# block ${pad2(block.index)} ${build}\n${[CUTECHESS, ...argsOf(build, block)].map(quote).join(" ")} > ${quote(outFile)} 2>&1`;
    }),
  );
  writeFileSync(join(out, "cmd.txt"), `${red(cmds.join("\n"))}\n`);

  const played = new Map<Build, BlockResult[]>(builds.map((b) => [b, []]));
  let halted: string | undefined;
  sample(out);
  const sampler = setInterval(() => sample(out), SAMPLE_MS);
  try {
    blocks: for (const block of schedule) {
      for (const build of block.order) {
        const dir = dirOf(build, block);
        const tag = `block ${pad2(block.index)} ${build}`;
        mkdirSync(dir, { recursive: true });
        appendFileSync(join(out, "schedule.log"), `${stamp()} start ${tag}\n`);
        const stop = await play(dir, argsOf(build, block), join(dir, "r.out"));
        appendFileSync(join(out, "schedule.log"), `${stamp()} end ${tag}\n`);
        const stderrs = ["skytalix.stderr", "stockfish.stderr"];
        const judged = summarise(
          { mode: "r", out: dir, games: 2 * block.rounds, elo },
          stop,
          stderrs,
        );
        writeFileSync(join(dir, "summary.txt"), judged.text);
        const nps = stockfishNps(readFileSync(join(dir, "r.out"), "utf8"));
        appendFileSync(
          join(out, "nps.log"),
          `${tag} stockfish_nps_median=${nps?.median ?? "?"} moves_ge_400ms=${nps?.moves ?? 0}\n`,
        );
        const pgnPath = join(dir, "r.pgn");
        const games = pgnGames(existsSync(pgnPath) ? readFileSync(pgnPath, "utf8") : "");
        played.get(build)?.push({ block, judged, games });
        // A cause in any block makes the pair UNRESOLVED, so the remaining blocks are not played.
        if (judged.causes.length > 0) {
          halted = `after ${tag}: ${judged.causes.join("; ")}`;
          break blocks;
        }
      }
    }
  } finally {
    clearInterval(sampler);
    sample(out);
  }

  const [base, candidate] = builds.map((b) =>
    readBuild(b, schedule, played.get(b) ?? [], elo, epd),
  ) as [BuildReading, BuildReading];
  const summary = red(pairSummary(base, candidate, halted));
  writeFileSync(join(out, "summary.txt"), summary);
  console.log(summary);

  // ADR-0049 d4: every record but the clones, with host paths, user and host name as placeholders.
  for (const file of recordFiles(out)) {
    const text = readFileSync(join(out, file), "utf8");
    const clean = red(text);
    if (clean !== text) writeFileSync(join(out, file), clean);
  }
  const files = recordFiles(out)
    .filter((f) => f !== "SHA256SUMS")
    .sort();
  writeFileSync(
    join(out, "SHA256SUMS"),
    files.map((f) => `${sha256File(join(out, f))}  ${f}\n`).join(""),
  );
}

async function main(argv: string[]): Promise<void> {
  const flags = new Map<string, string>();
  const positional: string[] = [];
  let dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] as string;
    if (arg === "--dry-run") dryRun = true;
    else if (arg.startsWith("--")) flags.set(arg, argv[++i] ?? usage());
    else positional.push(arg);
  }
  const mode = positional[0];
  if (mode === "rpair") return rpair(positional, flags, dryRun);
  if ((mode !== "r" && mode !== "d") || positional.length !== (mode === "r" ? 3 : 4)) usage();
  const allowed = mode === "r" ? ["--elo", "--rounds"] : ["--rounds"];
  allowed.push("--budget-ms", "--concurrency");
  if ([...flags.keys()].some((flag) => !allowed.includes(flag))) usage();
  const shas = positional
    .slice(1, -1)
    .map((ref) => run("git", ["rev-parse", "--verify", `${ref}^{commit}`]));
  const elo = Number(flags.get("--elo") ?? 1650);
  const budgetFlag = flags.get("--budget-ms");
  const budget = Number(budgetFlag ?? (mode === "r" ? R_BUDGET_MS : 3000));
  const rounds = Number(flags.get("--rounds") ?? (mode === "r" ? 100 : 200));
  if (!Number.isInteger(elo) || elo < 1320 || elo > 3190)
    throw new Error(`--elo ${elo}: not 1320–3190`);
  if (mode === "r" && budgetFlag !== undefined && budget !== R_SMOKE_BUDGET_MS)
    throw new Error(`--budget-ms ${budgetFlag}: r takes only ${R_SMOKE_BUDGET_MS}`);
  if (mode === "d" && !D_BUDGETS_MS.includes(budget))
    throw new Error(`--budget-ms ${budget}: not one of ${D_BUDGETS_MS}`);
  if (!Number.isInteger(rounds) || rounds < 1)
    throw new Error(`--rounds ${rounds}: not a positive integer`);
  // Q4's frozen widths are the default; a flag value is checked as text, so `2.0` or `0x2` is refused.
  const defaultConcurrency = mode === "r" ? 2 : 3;
  const concurrencyFlag = flags.get("--concurrency");
  if (concurrencyFlag !== undefined && !/^[1-8]$/.test(concurrencyFlag))
    throw new Error(`--concurrency ${concurrencyFlag}: not an integer from 1 to 8`);
  const concurrency = Number(concurrencyFlag ?? defaultConcurrency);
  const names = mode === "r" ? ["skytalix"] : ["skytalix", "base"];

  const out = resolve(positional.at(-1) as string);
  if (dryRun) {
    const clones = names.map((name) => join(out, `clone-${name}`));
    const args = cutechessArgs({ mode, files: out, clones, elo, budget, rounds, concurrency });
    console.log(`${mode} dry run: nothing is built, started or written\ncutechess-cli argv:`);
    console.log(argvText(args));
    return;
  }
  freshOut(out);

  // Pins: tools (A1, a difference is recorded, not a stop) and the openings (Q5, a stop).
  hostLine(out, "before");
  const machine = [
    ...(await machineLines(out)),
    `concurrency: ${concurrency} ${concurrency === defaultConcurrency ? "(default)" : `(default ${defaultConcurrency})`}`,
    // ABC-255 scope 3: a short control is recorded; every other run's record is as before.
    ...(SHORT_MARGIN_MS.has(budget)
      ? [
          `control: skytalix${mode === "d" ? " and base" : ""} st=${budget / 1000} timemargin=${timemarginMs(budget)}`,
        ]
      : []),
  ].join("\n");
  writeFileSync(join(out, "machine.txt"), `${machine}\n`);
  console.log(machine);
  if (sha256File(OPENINGS) !== OPENINGS_SHA256) {
    throw new Error(`openings sha256 ${sha256File(OPENINGS)} is not the pin ${OPENINGS_SHA256}`);
  }

  // Artifacts, then the pinned command (design ruling § The R command shape).
  const clones: string[] = [];
  for (const [i, name] of names.entries())
    clones.push(await buildArtifact(out, name, shas[i] as string));
  const args = cutechessArgs({ mode, files: out, clones, elo, budget, rounds, concurrency });
  const outFile = join(out, `${mode}.out`);
  writeFileSync(
    join(out, "cmd.txt"),
    `${[CUTECHESS, ...args].map(quote).join(" ")} > ${quote(outFile)} 2>&1\n`,
  );

  const stop = await play(out, args, outFile);
  const stderrs =
    mode === "r" ? ["skytalix.stderr", "stockfish.stderr"] : ["skytalix.stderr", "base.stderr"];
  const summary = summarise({ mode, out, games: 2 * rounds, elo }, stop, stderrs).text;
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

// Run as a command; `pair-check.ts` imports the exports without starting one.
const entry = process.argv[1];
if (entry !== undefined && realpathSync(entry) === fileURLToPath(import.meta.url))
  await main(process.argv.slice(2));
