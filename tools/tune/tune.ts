/**
 * `ABC-239` — the evaluation tuner (`ADR-0067`, accepted 2026-11-03, with its § Addendum, the
 * Lichess data pin). Runs on demand only, never in the test lane, and is not in `dist/`. It imports
 * `src/` read-only, as `tools/rating/openings.ts` does, and reads local files only: no network.
 *
 *   node --max-old-space-size=3000 tools/tune/tune.ts extract <out dir> [--lichess <file>]
 *   node --max-old-space-size=3000 tools/tune/tune.ts fit <out dir>
 *   node tools/tune/tune.ts emit <out dir>
 *
 * - **extract**: own self-play games (every tracked PGN whose two players are `skytalix` / `base`)
 *   plus, given `--lichess`, the pinned 2017-03 export, refused unless its sha256 is the pin. Game
 *   filters, position rules, dedupe, the opening split, leakage, the cap, the trace and the identity
 *   gate (d5), at the base values (the `src/evaluate-params.ts` present when it runs). Writes
 *   `rows.jsonl` and `extract.json` (counts, manifest, base table).
 * - **fit**: K per source, then Newton on cross-entropy with material frozen and the free set
 *   sign-bounded (d2–d6), C-S or C-F by the inner rule, rounded half away from zero (d7). Writes
 *   `fit.json`.
 * - **emit**: writes `src/evaluate-params.ts` in its present shape with the provenance header (d7).
 *
 * No random number generator; full batch, fixed order. The same inputs on the same Node major give
 * a byte-identical file (B-T3).
 */
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  closeSync,
  createReadStream,
  mkdirSync,
  openSync,
  readFileSync,
  writeFileSync,
  writeSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import { makeMove } from "../../src/apply.ts";
import { evaluate, phaseOf } from "../../src/evaluate.ts";
import { parseFen, toFen } from "../../src/fen.ts";
import { hasLegalMove, isInCheck, legalMoves } from "../../src/legal.ts";
import type { Move } from "../../src/moves.ts";
import type { Position } from "../../src/position.ts";
import { type QuiescenceRules, quiesce } from "../../src/quiescence.ts";
import { parseSan } from "../../src/san.ts";
import { type Game, gamesOf, lexMovetext, streamZstGames } from "./pgn.ts";
import {
  gateMiss,
  N_TERMS,
  PST_NAMES,
  SHIPPED,
  T_DBL,
  T_HALF,
  T_ISO,
  T_OPEN,
  T_PASS,
  T_PST,
  T_SHEL,
  type Table,
  trace,
} from "./tracer.ts";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

/** `ADR-0067` § Addendum: the one export, by URL, byte length and sha256. Never a local path. */
export const LICHESS_PIN = {
  name: "lichess_db_standard_rated_2017-03.pgn.zst",
  url: "https://database.lichess.org/standard/lichess_db_standard_rated_2017-03.pgn.zst",
  bytes: 2_169_142_067,
  sha256: "b319297e9270285635d615cbcd19a9b0d44747be3ff91d5b3eac41175b794320",
  licence: "Lichess database export, CC0 (database.lichess.org)",
} as const;

export const SPLIT = "ABC-239/split/v1";
export const INNER = "ABC-239/inner/v1";
export const LICHESS_SAMPLE = "ABC-239/lichess/v1";
export const LICHESS_SAMPLE_MOD = 8;
export const LICHESS_CAP = 1_000_000;
export const LICHESS_MIN = 250_000;
export const LICHESS_FIRST_PLY = 16;
export const OWN_WEIGHT = 0.5;
export const OWN_PLAYERS = ["skytalix", "base"];

/**
 * The quiet filter's rules record (d9: quiescence equals the static score). It is `src/search.ts`'s
 * shipped `RULES_TAPERED` as it stands at `main` `441c547e`, written out here so that a later rule
 * added to the shipped record (`ADR-0069`'s Q1, PROPOSED) does not move this filter: an absent
 * switch is off.
 */
export const QUIET_RULES: QuiescenceRules = { evasions: true, quietPromotions: true, taper: true };
export const QUIET_RULES_NAME =
  "quiesce(full window) with { evasions: true, quietPromotions: true, taper: true } (src/search.ts RULES_TAPERED at main 441c547e)";

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export function fnv1a32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}

export const isOuterVal = (opening: string): boolean => fnv1a32(`${SPLIT}\n${opening}`) % 5 === 0;
export const isInnerVal = (opening: string): boolean => fnv1a32(`${INNER}\n${opening}`) % 4 === 0;
const sampleHash = (key: string): number => fnv1a32(`${LICHESS_SAMPLE}\n${key}`);

const keyOf = (p: Position): string => toFen(p).split(" ").slice(0, 4).join(" ");
const sha256 = (data: string | Buffer): string => createHash("sha256").update(data).digest("hex");
const noop = (): void => {};

/** Quiet: not in check is the caller's; the full-window quiescence equals `evaluate`. */
const isQuiet = (p: Position, ev: number): boolean =>
  quiesce(p, -Infinity, Infinity, 0, 0, QUIET_RULES, noop, phaseOf(p)) === ev;

async function sha256File(path: string): Promise<{ sha256: string; bytes: number }> {
  const h = createHash("sha256");
  let bytes = 0;
  for await (const chunk of createReadStream(path) as AsyncIterable<Buffer>) {
    h.update(chunk);
    bytes += chunk.length;
  }
  return { sha256: h.digest("hex"), bytes };
}

/** A position row. `s`: 0 own training, 1 own outer validation, 2 Lichess (training only). */
export interface Row {
  s: 0 | 1 | 2;
  k: string;
  y: number;
  inner: boolean;
  w: number;
  m: number;
  f: number[];
}

interface Acc {
  ysum: number;
  n: number;
  inner: boolean;
  w: number;
  m: number;
  f: Int16Array;
}

export interface ExtractOptions {
  /** Own PGN files, repository-relative to `root`. */
  readonly ownPgns: readonly string[];
  readonly root: string;
  readonly lichess?: {
    readonly path: string;
    readonly pin: { sha256: string; bytes: number };
    /** The data-stage stop's floor; `LICHESS_MIN` for the pinned export. */
    readonly min: number;
  };
  readonly outDir: string;
}

type Counts = Record<string, number>;

/** One kept position: traced, gated against `evaluate`, its key. */
function keep(p: Position, counts: Counts, worst: { d: number }): Acc {
  const ev = evaluate(p);
  const t = trace(p);
  const g = gateMiss(t, p.blackToMove ? 0 - ev : ev, SHIPPED);
  if (g.d > worst.d) worst.d = g.d;
  if (g.miss) {
    throw new Error(`identity gate miss (d5): ${toFen(p)} model differs by ${g.d}`);
  }
  counts["gate.checked"] = (counts["gate.checked"] ?? 0) + 1;
  return { ysum: 0, n: 0, inner: true, w: t.w, m: t.m, f: Int16Array.from(t.f) };
}

const resultOf = (r: string | undefined): number | null =>
  r === "1-0" ? 1 : r === "0-1" ? 0 : r === "1/2-1/2" ? 0.5 : null;

/** Lichess game filters 1–6 (`ADR-0067` § Addendum), by tags only. The drop reason, or null. */
export function lichessTagFilter(tags: ReadonlyMap<string, string>): string | null {
  const event = tags.get("Event") ?? "";
  const variant = tags.get("Variant");
  if (
    !event.startsWith("Rated ") ||
    (variant !== undefined && variant !== "Standard") ||
    tags.has("FEN") ||
    tags.has("SetUp")
  ) {
    return "g1.event";
  }
  const tc = /^(\d+)\+(\d+)$/.exec(tags.get("TimeControl") ?? "");
  if (tc === null || Number(tc[1]) < 180) return "g2.timecontrol";
  const we = Number(tags.get("WhiteElo"));
  const be = Number(tags.get("BlackElo"));
  if (!(we >= 2000 && be >= 2000 && Math.abs(we - be) <= 200)) return "g3.elo";
  if (tags.get("Termination") !== "Normal") return "g4.termination";
  if (resultOf(tags.get("Result")) === null) return "g5.result";
  if (tags.get("WhiteTitle") === "BOT" || tags.get("BlackTitle") === "BOT") return "g6.bot";
  return null;
}

/** SAN replay through the engine's own generator; null on any unmatched or ambiguous move. */
function replay(fen: string, sans: readonly string[]): Move[] | null {
  const p = parseFen(fen);
  const moves: Move[] = [];
  for (const san of sans) {
    const r = parseSan(p, san, legalMoves(p));
    if (r.outcome !== "move") return null;
    moves.push(r.move);
    makeMove(p, r.move);
  }
  return moves;
}

const gameKey = (fen: string, sans: readonly string[]): string =>
  createHash("sha256")
    .update(`${fen}\n${sans.join(" ")}`)
    .digest("base64");

export async function extract(opts: ExtractOptions): Promise<Record<string, unknown>> {
  const t0 = Date.now();
  // The pin first: a wrong file writes nothing (§ Addendum, provenance).
  let lichessEntry: string | null = null;
  if (opts.lichess) {
    const got = await sha256File(opts.lichess.path);
    if (got.sha256 !== opts.lichess.pin.sha256 || got.bytes !== opts.lichess.pin.bytes) {
      throw new Error(
        `Lichess file refused: sha256 ${got.sha256} (${got.bytes} bytes) is not the pin ${opts.lichess.pin.sha256} (${opts.lichess.pin.bytes} bytes)`,
      );
    }
    lichessEntry = `${LICHESS_PIN.name} ${LICHESS_PIN.url} ${got.bytes} ${got.sha256}`;
  }
  const counts: Counts = {};
  const inc = (k: string, n = 1): void => {
    counts[k] = (counts[k] ?? 0) + n;
  };
  const zero = (keys: string[]): void => {
    for (const k of keys) counts[k] = 0;
  };
  zero([
    "own.games.read",
    "own.games.drop.player",
    "own.games.drop.result",
    "own.games.drop.duplicate",
    "own.games.kept",
  ]);
  zero([
    "own.pos.seen",
    "own.pos.drop.book",
    "own.pos.drop.mate",
    "own.pos.drop.check",
    "own.pos.drop.noisy",
    "own.pos.kept",
  ]);
  if (opts.lichess) {
    zero([
      "li.games.read",
      "li.g1.event",
      "li.g2.timecontrol",
      "li.g3.elo",
      "li.g4.termination",
      "li.g5.result",
      "li.g6.bot",
    ]);
    zero([
      "li.g7.reachReplay",
      "li.g7.replay",
      "li.g8.duplicate",
      "li.games.kept",
      "li.pos.seen",
      "li.p1.ply",
    ]);
    zero(["li.p2.sample", "li.p3.check", "li.p4.noisy", "li.p6.occurrences"]);
  }
  const worst = { d: 0 };
  const seenGames = new Set<string>();
  const ownTrain = new Map<string, Acc>();
  const ownVal = new Map<string, Acc>();
  const fileLines: string[] = [];
  const openings = new Set<string>();

  // ---- own games (d9's default source) ----
  for (const rel of [...opts.ownPgns].sort()) {
    const bytes = readFileSync(join(opts.root, rel));
    let contributes = false;
    for (const game of gamesOf(bytes.toString("utf8"))) {
      const R = game.tags.get("Result");
      if (R === undefined) continue;
      inc("own.games.read");
      const W = game.tags.get("White") ?? "";
      const B = game.tags.get("Black") ?? "";
      if (!OWN_PLAYERS.includes(W) || !OWN_PLAYERS.includes(B)) {
        inc("own.games.drop.player");
        continue;
      }
      const y = resultOf(R);
      if (y === null) {
        inc("own.games.drop.result");
        continue;
      }
      const fen = game.tags.get("FEN") ?? START_FEN;
      const { sans, comments } = lexMovetext(game.movetext, true);
      const gk = gameKey(fen, sans);
      if (seenGames.has(gk)) {
        inc("own.games.drop.duplicate");
        continue;
      }
      seenGames.add(gk);
      inc("own.games.kept");
      contributes = true;
      openings.add(fen);
      const val = isOuterVal(fen);
      const inner = isInnerVal(fen);
      const target = val ? ownVal : ownTrain;
      const p = parseFen(fen);
      sans.forEach((san, i) => {
        inc("own.pos.seen");
        const comment = (comments as Array<string | null>)[i] ?? null;
        let drop: string | null = null;
        if (comment === null) drop = "own.pos.drop.book";
        else if (/M/.test(comment)) drop = "own.pos.drop.mate";
        else if (isInCheck(p)) drop = "own.pos.drop.check";
        else if (!isQuiet(p, evaluate(p))) drop = "own.pos.drop.noisy";
        if (drop !== null) inc(drop);
        else {
          inc("own.pos.kept");
          const k = keyOf(p);
          let a = target.get(k);
          if (a === undefined) {
            a = keep(p, counts, worst);
            target.set(k, a);
          }
          a.ysum += y;
          a.n++;
          a.inner = a.inner && inner;
        }
        const r = parseSan(p, san);
        if (r.outcome !== "move") throw new Error(`${rel}: own game move ${san}: ${r.outcome}`);
        makeMove(p, r.move);
      });
    }
    if (contributes) fileLines.push(`${rel} ${sha256(bytes)}`);
  }
  let leak = 0;
  for (const k of [...ownVal.keys()]) {
    if (ownTrain.has(k)) {
      ownVal.delete(k);
      leak++;
    }
  }
  counts["own.val.removed.seenInTraining"] = leak;
  counts["own.openings"] = openings.size;
  counts["own.openings.val"] = [...openings].filter(isOuterVal).length;

  // ---- Lichess (training only; § Addendum) ----
  const lichess = new Map<string, Acc & { h: number }>();
  const rejected = new Map<string, string>();
  if (opts.lichess) {
    await streamZstGames(opts.lichess.path, (game: Game) => {
      inc("li.games.read");
      if ((counts["li.games.read"] as number) % 1_000_000 === 0) {
        console.error(
          `lichess games read ${counts["li.games.read"]} kept ${counts["li.games.kept"] ?? 0} keys ${lichess.size} t=${(Date.now() - t0) / 1000}s`,
        );
      }
      const drop = lichessTagFilter(game.tags);
      if (drop !== null) {
        inc(`li.${drop}`);
        return;
      }
      inc("li.g7.reachReplay");
      const { sans } = lexMovetext(game.movetext, false);
      const moves = replay(START_FEN, sans);
      if (moves === null) {
        inc("li.g7.replay");
        return;
      }
      const gk = gameKey(START_FEN, sans);
      if (seenGames.has(gk)) {
        inc("li.g8.duplicate");
        return;
      }
      seenGames.add(gk);
      inc("li.games.kept");
      const y = resultOf(game.tags.get("Result")) as number;
      const p = parseFen(START_FEN);
      for (let i = 0; i < moves.length; i++) {
        inc("li.pos.seen");
        if (i < LICHESS_FIRST_PLY) inc("li.p1.ply");
        else {
          const k = keyOf(p);
          const h = sampleHash(k);
          if (h % LICHESS_SAMPLE_MOD !== 0) inc("li.p2.sample");
          else {
            const a = lichess.get(k);
            const known = a === undefined ? rejected.get(k) : undefined;
            if (a !== undefined) {
              a.ysum += y;
              a.n++;
              inc("li.p6.occurrences");
            } else if (known !== undefined) inc(known);
            else if (isInCheck(p) || !hasLegalMove(p)) {
              rejected.set(k, "li.p3.check");
              inc("li.p3.check");
            } else if (!isQuiet(p, evaluate(p))) {
              rejected.set(k, "li.p4.noisy");
              inc("li.p4.noisy");
            } else {
              const fresh = { ...keep(p, counts, worst), h, ysum: y, n: 1 };
              lichess.set(k, fresh);
              inc("li.p6.occurrences");
            }
          }
        }
        makeMove(p, moves[i] as Move);
      }
    });
    counts["li.p6.keys"] = lichess.size;
    // Rule 7: a Lichess key equal to any own-validation key (outer or inner) leaves the Lichess rows.
    let li7 = 0;
    for (const k of [...lichess.keys()]) {
      const t = ownTrain.get(k);
      if (ownVal.has(k) || t?.inner === true) {
        lichess.delete(k);
        li7++;
      }
    }
    counts["li.p7.leakage"] = li7;
    // Rule 8: the cap, smallest rule-2 hash first, ties by key string order.
    const ordered = [...lichess.entries()].sort((a, b) =>
      a[1].h !== b[1].h ? a[1].h - b[1].h : a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0,
    );
    counts["li.p8.cap"] = Math.max(0, ordered.length - LICHESS_CAP);
    for (const [k] of ordered.slice(LICHESS_CAP)) lichess.delete(k);
    counts["li.rows"] = lichess.size;
    const reach = counts["li.g7.reachReplay"] ?? 0;
    const stops: string[] = [];
    if (lichess.size < opts.lichess.min) {
      stops.push(`fewer than ${opts.lichess.min} Lichess rows (${lichess.size})`);
    }
    if (reach > 0 && (counts["li.g7.replay"] as number) / reach > 0.001) {
      stops.push(
        `the reader dropped ${counts["li.g7.replay"]} of ${reach} games reaching replay (> 0.1 %)`,
      );
    }
    if (stops.length > 0) {
      mkdirSync(opts.outDir, { recursive: true });
      writeFileSync(
        join(opts.outDir, "extract.stop.json"),
        JSON.stringify({ stops, counts }, null, 1),
      );
      throw new Error(`DATA-STAGE STOP to Architect/Design: ${stops.join("; ")}`);
    }
  }

  // ---- rows, sorted: source, then key ----
  mkdirSync(opts.outDir, { recursive: true });
  const fd = openSync(join(opts.outDir, "rows.jsonl"), "w");
  const push = (s: 0 | 1 | 2, map: Map<string, Acc>): void => {
    let batch: string[] = [];
    for (const k of [...map.keys()].sort()) {
      const a = map.get(k) as Acc;
      const row: Row = {
        s,
        k,
        y: a.ysum / a.n,
        inner: s === 0 && a.inner,
        w: a.w,
        m: a.m,
        f: Array.from(a.f),
      };
      batch.push(JSON.stringify(row));
      if (batch.length === 10_000) {
        writeSync(fd, `${batch.join("\n")}\n`);
        batch = [];
      }
    }
    if (batch.length > 0) writeSync(fd, `${batch.join("\n")}\n`);
  };
  push(0, ownTrain);
  push(1, ownVal);
  push(2, lichess);
  closeSync(fd);
  counts["rows.ownTrain"] = ownTrain.size;
  counts["rows.ownTrain.innerVal"] = [...ownTrain.values()].filter((a) => a.inner).length;
  counts["rows.ownVal"] = ownVal.size;
  counts["rows.lichess"] = lichess.size;

  fileLines.sort();
  const manifestLines = [...fileLines, ...(lichessEntry === null ? [] : [lichessEntry])];
  const manifest = `${manifestLines.join("\n")}\n`;
  const baseSource = readFileSync(join(REPO, "src/evaluate-params.ts"));
  const info = {
    counts,
    gateWorst: worst.d,
    manifest: manifestLines,
    manifestSha256: sha256(manifest),
    baseTableSha256: sha256(baseSource),
    base: {
      mg: Array.from(SHIPPED.mg),
      eg: Array.from(SHIPPED.eg),
      wmg: SHIPPED.wmg,
      weg: SHIPPED.weg,
      cap: SHIPPED.cap,
    },
    quietRules: QUIET_RULES_NAME,
    lichess: lichessEntry !== null,
    run: { seconds: (Date.now() - t0) / 1000, maxRssMiB: process.resourceUsage().maxRSS / 1024 },
  };
  writeFileSync(join(opts.outDir, "manifest.txt"), manifest);
  writeFileSync(join(opts.outDir, "extract.json"), `${JSON.stringify(info, null, 1)}\n`);
  return info;
}

// ===================================================================================== fit

/** Rows held in typed arrays (the row storage the heap bound reads). */
interface Data {
  n: number;
  s: Uint8Array;
  inner: Uint8Array;
  y: Float64Array;
  w: Uint8Array;
  m: Int16Array;
  start: Uint32Array;
  feat: Int16Array;
}

async function readRows(path: string): Promise<Data> {
  const s: number[] = [];
  const inner: number[] = [];
  const y: number[] = [];
  const w: number[] = [];
  const m: number[] = [];
  const start: number[] = [0];
  let feat = new Int16Array(1 << 20);
  let used = 0;
  const rl = createInterface({ input: createReadStream(path), crlfDelay: Infinity });
  for await (const line of rl) {
    if (line === "") continue;
    const r = JSON.parse(line) as Row;
    s.push(r.s);
    inner.push(r.inner ? 1 : 0);
    y.push(r.y);
    w.push(r.w);
    m.push(r.m);
    if (used + r.f.length > feat.length) {
      const grown = new Int16Array(feat.length * 2);
      grown.set(feat);
      feat = grown;
    }
    feat.set(r.f, used);
    used += r.f.length;
    start.push(used);
  }
  return {
    n: s.length,
    s: Uint8Array.from(s),
    inner: Uint8Array.from(inner),
    y: Float64Array.from(y),
    w: Uint8Array.from(w),
    m: Int16Array.from(m),
    start: Uint32Array.from(start),
    feat: feat.slice(0, used),
  };
}

const LN10 = Math.log(10);
const sig = (e: number, K: number): number => 1 / (1 + 10 ** ((-K * e) / 400));
const clampP = (s: number): number => Math.min(1 - 1e-12, Math.max(1e-12, s));

function modelRow(d: Data, i: number, th: Table): number {
  let a = 0;
  let e = 0;
  for (let j = d.start[i] as number; j < (d.start[i + 1] as number); j += 2) {
    const t = d.feat[j] as number;
    const c = d.feat[j + 1] as number;
    a += (th.mg[t] as number) * c;
    e += (th.eg[t] as number) * c;
  }
  const mm = d.m[i] as number;
  a += Math.max(-th.cap, Math.min(th.cap, th.wmg * mm));
  e += Math.max(-th.cap, Math.min(th.cap, th.weg * mm));
  const w = d.w[i] as number;
  return (w * a + (24 - w) * e) / 24;
}

/** Mean cross-entropy and squared error of `th` over the rows `idx`, at K. */
export function lossOf(
  d: Data,
  idx: Uint32Array,
  th: Table,
  K: number,
): { ce: number; mse: number } {
  let ce = 0;
  let mse = 0;
  for (const i of idx) {
    const yy = d.y[i] as number;
    const s = clampP(sig(modelRow(d, i, th), K));
    ce -= yy * Math.log(s) + (1 - yy) * Math.log(1 - s);
    mse += (s - yy) ** 2;
  }
  return { ce: ce / idx.length, mse: mse / idx.length };
}

/** d3: golden section on [0.1, 5], 60 steps, cross-entropy of the base values. */
function fitK(d: Data, idx: Uint32Array, th: Table): number {
  let a = 0.1;
  let b = 5;
  const g = (Math.sqrt(5) - 1) / 2;
  let c = b - g * (b - a);
  let e = a + g * (b - a);
  let fc = lossOf(d, idx, th, c).ce;
  let fe = lossOf(d, idx, th, e).ce;
  for (let i = 0; i < 60; i++) {
    if (fc < fe) {
      b = e;
      e = c;
      fe = fc;
      c = b - g * (b - a);
      fc = lossOf(d, idx, th, c).ce;
    } else {
      a = c;
      c = e;
      fc = fe;
      e = a + g * (b - a);
      fe = lossOf(d, idx, th, e).ce;
    }
  }
  return (a + b) / 2;
}

/** The scalar terms freed at the first pull (d6), each with an mg and an eg parameter. */
const SCALAR_TERMS = [
  T_PASS,
  T_PASS + 1,
  T_PASS + 2,
  T_PASS + 3,
  T_PASS + 4,
  T_PASS + 5,
  T_DBL,
  T_ISO,
  T_SHEL,
  T_HALF,
  T_OPEN,
];
const NS = SCALAR_TERMS.length; // 11
const WMG = 2 * NS; // 22
const WEG = WMG + 1; // 23
const NPRE = WEG + 1; // 24: every one of these is bounded ≥ 0 (d6's sign bounds)

const mirrorCell = (idx: number): number => {
  const r = idx >> 3;
  const f = idx & 7;
  return r * 4 + (f < 4 ? f : 7 - f);
};

/** A configuration: free vector z → table, and per term its parameter and scale in each half. */
interface Cfg {
  name: "C-S" | "C-F";
  n: number;
  z0: Float64Array;
  prior: Float64Array | null;
  bounded: Uint8Array;
  pm: Int32Array; // term → mg parameter (−1 frozen)
  pe: Int32Array;
  sm: Float64Array; // term → coefficient scale
  se: Float64Array;
  toTable: (z: Float64Array) => Table;
}

function makeCfg(kind: "C-S" | "C-F", base: Table): Cfg {
  const nP = kind === "C-S" ? 12 : 6 * 32 * 2;
  const n = NPRE + nP;
  const z0 = new Float64Array(n);
  const bounded = new Uint8Array(n);
  const pm = new Int32Array(N_TERMS).fill(-1);
  const pe = new Int32Array(N_TERMS).fill(-1);
  const sm = new Float64Array(N_TERMS);
  const se = new Float64Array(N_TERMS);
  SCALAR_TERMS.forEach((t, i) => {
    z0[i] = base.mg[t] as number;
    z0[NS + i] = base.eg[t] as number;
    pm[t] = i;
    pe[t] = NS + i;
    sm[t] = 1;
    se[t] = 1;
  });
  z0[WMG] = base.wmg;
  z0[WEG] = base.weg;
  for (let j = 0; j < NPRE; j++) bounded[j] = 1;
  let prior: Float64Array | null = null;
  if (kind === "C-S") {
    for (let j = NPRE; j < n; j++) {
      z0[j] = 1;
      bounded[j] = 1;
    }
    for (let tb = 0; tb < 6; tb++) {
      for (let s = 0; s < 64; s++) {
        const t = T_PST + tb * 64 + s;
        pm[t] = NPRE + tb * 2;
        pe[t] = NPRE + tb * 2 + 1;
        sm[t] = base.mg[t] as number;
        se[t] = base.eg[t] as number;
      }
    }
  } else {
    prior = new Float64Array(n);
    for (let tb = 0; tb < 6; tb++) {
      for (let s = 0; s < 64; s++) {
        const t = T_PST + tb * 64 + s;
        const r = s >> 3;
        if (tb === 0 && (r === 0 || r === 7)) continue; // a pawn never stands there: stays frozen
        const j = NPRE + (tb * 32 + mirrorCell(s)) * 2;
        pm[t] = j;
        pe[t] = j + 1;
        sm[t] = 1;
        se[t] = 1;
        if ((s & 7) < 4) {
          z0[j] = base.mg[t] as number;
          z0[j + 1] = base.eg[t] as number;
        }
      }
    }
    prior.set(z0);
  }
  const toTable = (z: Float64Array): Table => {
    const mg = Float64Array.from(base.mg);
    const eg = Float64Array.from(base.eg);
    for (let t = 0; t < N_TERMS; t++) {
      if ((pm[t] as number) >= 0) mg[t] = (sm[t] as number) * (z[pm[t] as number] as number);
      if ((pe[t] as number) >= 0) eg[t] = (se[t] as number) * (z[pe[t] as number] as number);
    }
    return { mg, eg, wmg: z[WMG] as number, weg: z[WEG] as number, cap: base.cap };
  };
  return { name: kind, n, z0, prior, bounded, pm, pe, sm, se, toTable };
}

/** One weighted group of rows with its own K (§ Addendum: K per source, own weight 0.5). */
interface Group {
  idx: Uint32Array;
  K: number;
  weight: number;
}

/** Per-row linear form under `cfg`: e = c0 + Σ coef · z (+ mobility, handled per z). */
class Linear {
  readonly acc: Float64Array;
  readonly mark: Int32Array;
  readonly touched: Int32Array;
  readonly coef: Float64Array;
  count = 0;
  c0 = 0;
  readonly cfg: Cfg;
  readonly base: Table;
  constructor(cfg: Cfg, base: Table) {
    this.cfg = cfg;
    this.base = base;
    this.acc = new Float64Array(cfg.n);
    this.mark = new Int32Array(cfg.n).fill(-1);
    this.touched = new Int32Array(cfg.n);
    this.coef = new Float64Array(cfg.n);
  }
  /** Fills touched/coef/count and returns e at z. */
  row(d: Data, i: number, z: Float64Array): number {
    const { cfg, acc, mark, touched } = this;
    const w = d.w[i] as number;
    const wm = w / 24;
    const we = 1 - wm;
    let count = 0;
    let c0 = 0;
    const add = (j: number, v: number): void => {
      if (mark[j] !== i) {
        mark[j] = i;
        acc[j] = 0;
        touched[count++] = j;
      }
      acc[j] = (acc[j] as number) + v;
    };
    for (let k = d.start[i] as number; k < (d.start[i + 1] as number); k += 2) {
      const t = d.feat[k] as number;
      const c = d.feat[k + 1] as number;
      const jm = cfg.pm[t] as number;
      const je = cfg.pe[t] as number;
      if (jm >= 0) add(jm, wm * c * (cfg.sm[t] as number));
      else c0 += wm * c * (this.base.mg[t] as number);
      if (je >= 0) add(je, we * c * (cfg.se[t] as number));
      else c0 += we * c * (this.base.eg[t] as number);
    }
    const mm = d.m[i] as number;
    const cap = this.base.cap;
    const am = (z[WMG] as number) * mm;
    const ae = (z[WEG] as number) * mm;
    if (Math.abs(am) < cap) add(WMG, wm * mm);
    else c0 += wm * Math.sign(am) * cap;
    if (Math.abs(ae) < cap) add(WEG, we * mm);
    else c0 += we * Math.sign(ae) * cap;
    let e = c0;
    for (let u = 0; u < count; u++) {
      const j = touched[u] as number;
      this.coef[u] = acc[j] as number;
      e += (acc[j] as number) * (z[j] as number);
    }
    this.count = count;
    this.c0 = c0;
    return e;
  }
}

function objective(
  cfg: Cfg,
  lin: Linear,
  d: Data,
  groups: Group[],
  z: Float64Array,
  lam: number,
): number {
  let f = 0;
  for (const g of groups) {
    let ce = 0;
    for (const i of g.idx) {
      const yy = d.y[i] as number;
      const s = clampP(sig(lin.row(d, i, z), g.K));
      ce -= yy * Math.log(s) + (1 - yy) * Math.log(1 - s);
    }
    f += (g.weight * ce) / g.idx.length;
  }
  if (cfg.prior !== null && lam > 0) {
    let r = 0;
    for (let j = NPRE; j < cfg.n; j++) r += ((z[j] as number) - (cfg.prior[j] as number)) ** 2;
    f += 0.5 * lam * r;
  }
  return f;
}

function cholSolve(H: Float64Array, g: Float64Array, n: number): Float64Array {
  const L = Float64Array.from(H);
  for (let j = 0; j < n; j++) {
    let s = L[j * n + j] as number;
    for (let k = 0; k < j; k++) s -= (L[j * n + k] as number) ** 2;
    if (s <= 0) throw new Error("Hessian not positive definite");
    const dd = Math.sqrt(s);
    L[j * n + j] = dd;
    for (let i = j + 1; i < n; i++) {
      let t = L[i * n + j] as number;
      for (let k = 0; k < j; k++) t -= (L[i * n + k] as number) * (L[j * n + k] as number);
      L[i * n + j] = t / dd;
    }
  }
  const y = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let t = g[i] as number;
    for (let k = 0; k < i; k++) t -= (L[i * n + k] as number) * (y[k] as number);
    y[i] = t / (L[i * n + i] as number);
  }
  const x = new Float64Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let t = y[i] as number;
    for (let k = i + 1; k < n; k++) t -= (L[k * n + i] as number) * (x[k] as number);
    x[i] = t / (L[i * n + i] as number);
  }
  return x;
}

/** d4: projected Newton with a backtracking line search; stops at relative change < 1e-9 or 50. */
function newton(cfg: Cfg, base: Table, d: Data, groups: Group[], lam: number) {
  const n = cfg.n;
  const lin = new Linear(cfg, base);
  let z = Float64Array.from(cfg.z0);
  let f = objective(cfg, lin, d, groups, z, lam);
  let steps = 0;
  for (; steps < 50; steps++) {
    const g = new Float64Array(n);
    const H = new Float64Array(n * n);
    for (const gr of groups) {
      const a = (gr.K * LN10) / 400;
      const scale = gr.weight / gr.idx.length;
      for (const i of gr.idx) {
        const e = lin.row(d, i, z);
        const s = sig(e, gr.K);
        const r = a * (s - (d.y[i] as number)) * scale;
        const h = a * a * s * (1 - s) * scale;
        const cnt = lin.count;
        for (let u = 0; u < cnt; u++) {
          const iu = lin.touched[u] as number;
          const vu = lin.coef[u] as number;
          g[iu] = (g[iu] as number) + r * vu;
          const hv = h * vu;
          const rowAt = iu * n;
          for (let v = 0; v < cnt; v++) {
            const at = rowAt + (lin.touched[v] as number);
            H[at] = (H[at] as number) + hv * (lin.coef[v] as number);
          }
        }
      }
    }
    if (cfg.prior !== null && lam > 0) {
      for (let j = NPRE; j < n; j++) {
        g[j] = (g[j] as number) + lam * ((z[j] as number) - (cfg.prior[j] as number));
        H[j * n + j] = (H[j * n + j] as number) + lam;
      }
    }
    // A tiny ridge keeps H positive definite on unvisited cells; it does not move a visited one.
    for (let j = 0; j < n; j++)
      H[j * n + j] = (H[j * n + j] as number) + 1e-12 + (H[j * n + j] === 0 ? 1 : 0);
    // The active set: a bounded parameter at its bound with the gradient pushing out stays put.
    for (let j = 0; j < n; j++) {
      if (cfg.bounded[j] === 1 && (z[j] as number) <= 0 && (g[j] as number) > 0) {
        for (let k = 0; k < n; k++) {
          H[j * n + k] = 0;
          H[k * n + j] = 0;
        }
        H[j * n + j] = 1;
        g[j] = 0;
      }
    }
    const dir = cholSolve(H, g, n);
    let t = 1;
    let fn = Number.POSITIVE_INFINITY;
    let zn = z;
    for (let ls = 0; ls < 30; ls++) {
      zn = z.map((v, j) => {
        const x = v - t * (dir[j] as number);
        return cfg.bounded[j] === 1 && x < 0 ? 0 : x;
      });
      fn = objective(cfg, lin, d, groups, zn, lam);
      if (fn <= f) break;
      t /= 2;
    }
    if (!(fn <= f)) break;
    const rel = (f - fn) / f;
    z = zn;
    f = fn;
    if (rel < 1e-9) {
      steps++;
      break;
    }
  }
  return { z, f, steps };
}

/** d7: half away from zero; `+ 0` so no −0 is ever written. */
const roundAway = (v: number): number => Math.sign(v) * Math.round(Math.abs(v)) + 0;
export function rounded(th: Table): Table {
  return {
    mg: th.mg.map(roundAway),
    eg: th.eg.map(roundAway),
    wmg: roundAway(th.wmg),
    weg: roundAway(th.weg),
    cap: th.cap,
  };
}

const tableJson = (th: Table) => ({
  mg: Array.from(th.mg),
  eg: Array.from(th.eg),
  wmg: th.wmg,
  weg: th.weg,
  cap: th.cap,
});
const tableFrom = (j: {
  mg: number[];
  eg: number[];
  wmg: number;
  weg: number;
  cap: number;
}): Table => ({
  mg: Float64Array.from(j.mg),
  eg: Float64Array.from(j.eg),
  wmg: j.wmg,
  weg: j.weg,
  cap: j.cap,
});

const LAMBDAS = [1e-8, 1e-7, 1e-6];

/** The inner choice (d6) and the full fit, for one data mix. */
function fitMix(
  d: Data,
  base: Table,
  own: Uint32Array,
  li: Uint32Array,
  Kown: number,
  Kli: number,
  log: string[],
) {
  const ownInnerTrain = own.filter((i) => d.inner[i] === 0);
  const ownInnerVal = own.filter((i) => d.inner[i] === 1);
  const groupsFor = (ownRows: Uint32Array): Group[] =>
    li.length > 0
      ? [
          { idx: ownRows, K: Kown, weight: OWN_WEIGHT },
          { idx: li, K: Kli, weight: 1 - OWN_WEIGHT },
        ]
      : [{ idx: ownRows, K: Kown, weight: 1 }];
  const inner: Record<string, number> = {};
  const cS = makeCfg("C-S", base);
  const cF = makeCfg("C-F", base);
  const rS = newton(cS, base, d, groupsFor(ownInnerTrain), 0);
  inner["C-S"] = lossOf(d, ownInnerVal, rounded(cS.toTable(rS.z)), Kown).ce;
  log.push(`inner C-S steps ${rS.steps}`);
  let bestLam = LAMBDAS[0] as number;
  let bestF = Number.POSITIVE_INFINITY;
  for (const lam of LAMBDAS) {
    const r = newton(cF, base, d, groupsFor(ownInnerTrain), lam);
    const l = lossOf(d, ownInnerVal, rounded(cF.toTable(r.z)), Kown).ce;
    inner[`C-F λ=${lam}`] = l;
    log.push(`inner C-F λ=${lam} steps ${r.steps}`);
    if (l < bestF) {
      bestF = l;
      bestLam = lam;
    }
  }
  inner.base = lossOf(d, ownInnerVal, base, Kown).ce;
  const chosen = bestF < (inner["C-S"] as number) * (1 - 0.001) ? cF : cS;
  const lam = chosen === cF ? bestLam : 0;
  const r = newton(chosen, base, d, groupsFor(own), lam);
  log.push(`full ${chosen.name} steps ${r.steps}`);
  return {
    config: chosen.name,
    lambda: lam,
    inner,
    steps: r.steps,
    table: rounded(chosen.toTable(r.z)),
    z: Array.from(r.z),
  };
}

export async function fitData(outDir: string): Promise<Record<string, unknown>> {
  const t0 = Date.now();
  const info = JSON.parse(readFileSync(join(outDir, "extract.json"), "utf8"));
  const base = tableFrom(info.base);
  const d = await readRows(join(outDir, "rows.jsonl"));
  const pick = (s: number): Uint32Array => {
    const out: number[] = [];
    for (let i = 0; i < d.n; i++) if (d.s[i] === s) out.push(i);
    return Uint32Array.from(out);
  };
  const own = pick(0);
  const val = pick(1);
  const li = pick(2);
  const Kown = fitK(d, own, base);
  const Kli = li.length > 0 ? fitK(d, li, base) : null;
  const log: string[] = [];
  const mixed = fitMix(d, base, own, li, Kown, Kli ?? 0, log);
  const report: Record<string, unknown> = {
    rows: { ownTrain: own.length, ownVal: val.length, lichess: li.length },
    K_own: Kown,
    K_lichess: Kli,
    ownWeight: li.length > 0 ? OWN_WEIGHT : 1,
    config: mixed.config,
    lambda: mixed.lambda,
    inner: mixed.inner,
    steps: mixed.steps,
    val: { base: lossOf(d, val, base, Kown), fit: lossOf(d, val, mixed.table, Kown) },
    train: { base: lossOf(d, own, base, Kown), fit: lossOf(d, own, mixed.table, Kown) },
    table: tableJson(mixed.table),
  };
  const v = report.val as { base: { ce: number }; fit: { ce: number } };
  report.ratio = v.fit.ce / v.base.ce;
  if (li.length > 0) {
    report.lichessRows = {
      base: lossOf(d, li, base, Kli as number),
      fit: lossOf(d, li, mixed.table, Kli as number),
    };
    // Reported beside, grading and deciding nothing (§ Addendum): the own-only fit, same rules.
    const ownOnly = fitMix(d, base, own, new Uint32Array(0), Kown, 0, log);
    const ov = lossOf(d, val, ownOnly.table, Kown);
    report.ownOnly = {
      config: ownOnly.config,
      lambda: ownOnly.lambda,
      inner: ownOnly.inner,
      val: ov,
      ratio: ov.ce / v.base.ce,
    };
  }
  report.log = log;
  const run = {
    seconds: (Date.now() - t0) / 1000,
    maxRssMiB: process.resourceUsage().maxRSS / 1024,
  };
  writeFileSync(join(outDir, "fit.json"), `${JSON.stringify(report, null, 1)}\n`);
  writeFileSync(join(outDir, "fit.run.json"), `${JSON.stringify(run)}\n`);
  return report;
}

// ===================================================================================== emit

const pad = (v: number, width: number): string => String(v).padStart(width, " ");

function board(values: readonly number[]): string {
  const width = Math.max(3, ...values.map((v) => String(v).length));
  const lines: string[] = [];
  for (let r = 0; r < 8; r++) {
    lines.push(
      `  ${values
        .slice(r * 8, r * 8 + 8)
        .map((v) => `${pad(v, width)},`)
        .join("")}`,
    );
  }
  return lines.join("\n");
}

/**
 * The parameter values in `src/evaluate-params.ts`'s export shape, from a table. The provenance row
 * (`src/evaluate.test.ts`) rebuilds the same object from the module's exports and compares the
 * sha256 of `canonicalValues` with the header's "values sha256".
 */
function valuesOf(th: Table) {
  const at = (t: number, half: "mg" | "eg"): number => (th[half][t] as number) + 0;
  const arr = (from: number, n: number, half: "mg" | "eg"): number[] =>
    Array.from({ length: n }, (_, i) => at(from + i, half));
  const pair = (t: number) => ({ mg: at(t, "mg"), eg: at(t, "eg") });
  return {
    MATERIAL: { mg: [0, ...arr(0, 5, "mg"), 0], eg: [0, ...arr(0, 5, "eg"), 0] },
    PST: Object.fromEntries(
      PST_NAMES.map((n, i) => [
        n,
        { mg: arr(T_PST + i * 64, 64, "mg"), eg: arr(T_PST + i * 64, 64, "eg") },
      ]),
    ),
    PASSED: { mg: [0, ...arr(T_PASS, 6, "mg"), 0], eg: [0, ...arr(T_PASS, 6, "eg"), 0] },
    DOUBLED: pair(T_DBL),
    ISOLATED: pair(T_ISO),
    KING_SHELTER_MISSING: pair(T_SHEL),
    KING_FILE_HALF_OPEN: pair(T_HALF),
    KING_FILE_OPEN: pair(T_OPEN),
    MOBILITY_WEIGHT: { mg: th.wmg + 0, eg: th.weg + 0 },
    MOBILITY_CAP: { mg: th.cap, eg: th.cap },
  };
}

/** JSON of the ten value exports, in this order, mg before eg. */
export function canonicalValues(v: ReturnType<typeof valuesOf>): string {
  const names = [
    "MATERIAL",
    "PST",
    "PASSED",
    "DOUBLED",
    "ISOLATED",
    "KING_SHELTER_MISSING",
    "KING_FILE_HALF_OPEN",
    "KING_FILE_OPEN",
    "MOBILITY_WEIGHT",
    "MOBILITY_CAP",
  ] as const;
  return JSON.stringify(names.map((n) => [n, v[n]]));
}

/** The rule each table was made by at E1 (`ADR-0064`), kept as the fit's start (d7). */
const PRIOR_RULES: Record<(typeof PST_NAMES)[number], string> = {
  pawn: "`2 × e × (R − 2)`, and 0 on ranks 1 and 8, both halves",
  knight: "`10 × n − 50`, n the knight moves from the square on an empty board, both halves",
  bishop: "`5 × (n − 9)`, n the squares on the square's diagonals on an empty board, both halves",
  rook: "20 on the seventh rank, else 0, both halves",
  queen: "`5 × ring − 5`, both halves",
  king: "mg `max(−50, −10 × d − 10 × (R − 1))`, d the file distance to the b- or g-file; eg `40 − 15 × m`, m the Manhattan distance to the centre",
};

/** What `emit` reads from `extract.json`. */
interface ExtractInfo {
  counts: Record<string, number>;
  manifest: string[];
  manifestSha256: string;
  baseTableSha256: string;
  lichess: boolean;
}

/** What `emit` reads from `fit.json`. */
interface FitReport {
  table: { mg: number[]; eg: number[]; wmg: number; weg: number; cap: number };
  rows: { ownTrain: number; ownVal: number; lichess: number };
  K_own: number;
  K_lichess: number | null;
  ownWeight: number;
  config: string;
  lambda: number;
  ratio: number;
  val: { base: { ce: number }; fit: { ce: number } };
  train: { base: { ce: number }; fit: { ce: number } };
}

export function emitSource(info: ExtractInfo, fitted: FitReport, toolCommit: string): string {
  const th = tableFrom(fitted.table);
  const c = info.counts;
  const at = (t: number, half: "mg" | "eg"): number => (th[half][t] as number) + 0;
  const range = (from: number, n: number, half: "mg" | "eg"): number[] =>
    Array.from({ length: n }, (_, i) => at(from + i, half));
  const fmtLoss = (x: number): string => x.toFixed(6);
  const valuesForHash = canonicalValues(valuesOf(th));
  const lines: string[] = [];
  const counted = (prefix: string): string =>
    Object.keys(c)
      .filter((k) => k.startsWith(prefix))
      .sort()
      .map((k) => `${k} ${c[k]}`)
      .join(", ");
  lines.push(
    "/**",
    " * The evaluation's parameter table (`ABC-269`, `ADR-0064` decision 4): every term as a middlegame",
    " * and an endgame half. DATA ONLY: no logic and no imports. `src/evaluate.ts` imports it and derives",
    " * its packed lookup arrays from it once, at load.",
    " *",
    " * TUNED by `tools/tune` (`ADR-0067`, `ABC-239`). Written by `tools/tune/tune.ts emit`; do not edit",
    " * by hand. Re-run `extract`, `fit` and `emit` on the base table to reproduce it byte for byte.",
    ` * - tool: tools/tune at commit ${toolCommit}; values sha256 ${sha256(valuesForHash)}`,
    ` * - base table: src/evaluate-params.ts sha256 ${info.baseTableSha256} (E1's rule-made values)`,
    ` * - data manifest sha256 ${info.manifestSha256} (${info.manifest.length} files; own PGNs`,
    " *   repository-relative, the Lichess export by URL, bytes and sha256)",
  );
  if (info.lichess) {
    lines.push(
      ` * - Lichess: ${LICHESS_PIN.url}, ${LICHESS_PIN.bytes} bytes, sha256 ${LICHESS_PIN.sha256};`,
      ` *   licence "${LICHESS_PIN.licence}"; training only; comments never read`,
    );
  }
  lines.push(
    ` * - own games: players ${OWN_PLAYERS.join(" / ")}; ${counted("own.games")}`,
    ` * - own positions: ${counted("own.pos")}; ${c["own.val.removed.seenInTraining"]} validation keys seen in training removed`,
    ` * - openings ${c["own.openings"]} (validation ${c["own.openings.val"]}); quiet rule: ${QUIET_RULES_NAME}`,
  );
  if (info.lichess) {
    lines.push(
      ` * - Lichess game filters: ${counted("li.g")}; games read ${c["li.games.read"]}, kept ${c["li.games.kept"]}`,
      ` * - Lichess position rules: ${counted("li.p")}; rule 2 fnv1a32("${LICHESS_SAMPLE}\\n" + key) mod ${LICHESS_SAMPLE_MOD} = 0; cap ${LICHESS_CAP}`,
    );
  }
  lines.push(
    ` * - rows: own training ${fitted.rows.ownTrain} (inner validation ${c["rows.ownTrain.innerVal"]}), own validation ${fitted.rows.ownVal}, Lichess ${fitted.rows.lichess}`,
    ` * - split: fnv1a32("${SPLIT}\\n" + start FEN) mod 5 = 0 validation; inner fnv1a32("${INNER}\\n" + start FEN) mod 4 = 0`,
    ` * - K_own ${fitted.K_own}; K_lichess ${fitted.K_lichess}; own weight ${fitted.ownWeight}; configuration ${fitted.config}; λ ${fitted.lambda}`,
    ` * - outer validation cross-entropy base ${fmtLoss(fitted.val.base.ce)} → fit ${fmtLoss(fitted.val.fit.ce)} (${(fitted.ratio as number).toFixed(4)} ×);`,
    ` *   training ${fmtLoss(fitted.train.base.ce)} → ${fmtLoss(fitted.train.fit.ce)}`,
    " * - frozen (d6): material, PHASE_WEIGHT, PHASE_MG / PHASE_EG, MOBILITY_CAP",
    " *",
    " * Tables are written from WHITE's point of view and read RANK-8-FIRST (a8 top-left); black reads",
    " * the same table with the rank flipped. In the rules, `R` is the rank counted from the piece's own",
    " * side (1 … 8), `e` is the file's steps from the edge (a/h 0, b/g 1, c/f 2, d/e 3), and `ring` is",
    " * the square's steps from the board's edge, `min(e, R − 1, 8 − R)` (0 … 3).",
    " */",
    "",
    "/** A term's two halves: `mg` at phase 24 (every piece on), `eg` at phase 0 (kings and pawns). */",
    "export interface MgEg<T> {",
    "  readonly mg: T;",
    "  readonly eg: T;",
    "}",
    "",
    "/**",
    " * The phase weight per piece type, indexed by `pieceType` (EMPTY 0, PAWN 1 … KING 6): N 1, B 1,",
    " * R 2, Q 4, pawns and kings 0. Summed over both sides it is 24 at the start, clamped to 24.",
    " */",
    "export const PHASE_WEIGHT: readonly number[] = [0, 0, 1, 1, 2, 4, 0];",
    "",
    "/**",
    " * The blend's two ends (`ADR-0064` decision 1, form L): at phase ≥ `PHASE_MG` the score is the",
    " * middlegame half, at phase ≤ `PHASE_EG` the endgame half, linear between.",
    " */",
    "export const PHASE_MG = 24;",
    "export const PHASE_EG = 0;",
    "",
    "/**",
    " * Centipawn value per piece type, indexed by `pieceType`. The king is 0. Frozen at the first pull",
    " * (`ADR-0067` d6): the classical scale, P 1, N 3, B 3, R 5, Q 9 pawns, times 100, plus 25 on each",
    " * minor piece.",
    " */",
    "export const MATERIAL: MgEg<readonly number[]> = {",
    `  mg: [0, ${range(0, 5, "mg").join(", ")}, 0],`,
    `  eg: [0, ${range(0, 5, "eg").join(", ")}, 0],`,
    "};",
    "",
  );
  PST_NAMES.forEach((name, i) => {
    for (const half of ["mg", "eg"] as const) {
      lines.push(
        `// ${name} square table, ${half === "mg" ? "middlegame" : "endgame"} half: fitted (\`ADR-0067\`). start (prior): ${PRIOR_RULES[name]}.`,
        "// biome-ignore format: an 8x8 board is only readable as 8 rows of 8",
        `const ${name.toUpperCase()}_${half.toUpperCase()}: readonly number[] = [`,
        board(range(T_PST + i * 64, 64, half)),
        "];",
        "",
      );
    }
  });
  const pair = (t: number): string => `{ mg: ${at(t, "mg")}, eg: ${at(t, "eg")} }`;
  lines.push(
    "/** The six piece-square tables, by piece. */",
    "export const PST = {",
    ...PST_NAMES.map((n) => `  ${n}: { mg: ${n.toUpperCase()}_MG, eg: ${n.toUpperCase()}_EG },`),
    "} as const satisfies Record<string, MgEg<readonly number[]>>;",
    "",
    "/**",
    " * Passed pawns (ABC-082), by rank counted from the pawn's OWN side (index 1 = its starting rank,",
    " * 6 = one step from promotion; 0 and 7 are never read). Fitted, each ≥ 0 (`ADR-0067` d6). start",
    " * (prior): mg 5 10 20 35 60 100, eg `2 ×` the middlegame bonus.",
    " */",
    "export const PASSED: MgEg<readonly number[]> = {",
    `  mg: [0, ${range(T_PASS, 6, "mg").join(", ")}, 0],`,
    `  eg: [0, ${range(T_PASS, 6, "eg").join(", ")}, 0],`,
    "};",
    "",
    "/**",
    " * ABC-082's other two pawn terms. DOUBLED: per pawn beyond the first on a file. ISOLATED: per pawn",
    " * with no friendly pawn on either adjacent file. Fitted penalties, each ≥ 0. start (prior): 15, 10.",
    " */",
    `export const DOUBLED: MgEg<number> = ${pair(T_DBL)};`,
    `export const ISOLATED: MgEg<number> = ${pair(T_ISO)};`,
    "",
    "/**",
    " * ABC-083's king safety, per file of the king's own file and the files either side of it. SHELTER:",
    " * no own pawn one or two ranks ahead of the king on that file. FILE_HALF_OPEN: no own pawn on the",
    " * file, an enemy pawn on it. FILE_OPEN: no pawn of either colour on the file. Fitted penalties, each",
    " * ≥ 0. start (prior): 15, 10, 20.",
    " */",
    `export const KING_SHELTER_MISSING: MgEg<number> = ${pair(T_SHEL)};`,
    `export const KING_FILE_HALF_OPEN: MgEg<number> = ${pair(T_HALF)};`,
    `export const KING_FILE_OPEN: MgEg<number> = ${pair(T_OPEN)};`,
    "",
    "/**",
    " * ABC-083's mobility: centipawns per square a non-pawn piece reaches, the total clamped to",
    " * ±`MOBILITY_CAP` (frozen), so mobility can never outvote a minor piece. Fitted weight, ≥ 0. start",
    " * (prior): 4.",
    " */",
    `export const MOBILITY_WEIGHT: MgEg<number> = { mg: ${th.wmg + 0}, eg: ${th.weg + 0} };`,
    `export const MOBILITY_CAP: MgEg<number> = { mg: ${th.cap}, eg: ${th.cap} };`,
    "",
  );
  return lines.join("\n");
}

function toolCommit(): string {
  const dirty = execFileSync("git", ["status", "--porcelain", "--", "tools/tune"], {
    cwd: REPO,
    encoding: "utf8",
  });
  if (dirty.trim() !== "")
    throw new Error("tools/tune has uncommitted changes: commit the tool before emit");
  return execFileSync("git", ["log", "-1", "--format=%H", "--", "tools/tune"], {
    cwd: REPO,
    encoding: "utf8",
  }).trim();
}

export function emit(outDir: string, target: string, commit: string): string {
  const info = JSON.parse(readFileSync(join(outDir, "extract.json"), "utf8"));
  const fitted = JSON.parse(readFileSync(join(outDir, "fit.json"), "utf8"));
  const source = emitSource(info, fitted, commit);
  writeFileSync(target, source);
  return source;
}

// ===================================================================================== CLI

function ownPgnList(): string[] {
  const out = execFileSync("git", ["ls-files", "-z", "*.pgn"], { cwd: REPO, encoding: "utf8" });
  return out.split("\0").filter((p) => p !== "");
}

async function main(argv: string[]): Promise<void> {
  const [stage, outArg, ...rest] = argv;
  if (outArg === undefined)
    throw new Error("usage: tune.ts extract|fit|emit <out dir> [--lichess <file>]");
  const outDir = resolve(outArg);
  if (stage === "extract") {
    const li = rest[0] === "--lichess" ? rest[1] : undefined;
    const info = await extract({
      ownPgns: ownPgnList(),
      root: REPO,
      ...(li === undefined
        ? {}
        : { lichess: { path: resolve(li), pin: LICHESS_PIN, min: LICHESS_MIN } }),
      outDir,
    });
    console.log(
      JSON.stringify(
        {
          counts: info.counts,
          gateWorst: info.gateWorst,
          manifestSha256: info.manifestSha256,
          run: info.run,
        },
        null,
        1,
      ),
    );
  } else if (stage === "fit") {
    const r = await fitData(outDir);
    const { table: _table, ...shown } = r;
    console.log(JSON.stringify(shown, null, 1));
  } else if (stage === "emit") {
    const target = join(REPO, "src/evaluate-params.ts");
    emit(outDir, target, toolCommit());
    console.log(`wrote ${relative(REPO, target)}`);
  } else throw new Error(`unknown stage ${stage}`);
}

if (process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((e: unknown) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  });
}
