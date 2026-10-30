/**
 * `ABC-225` — the pure parts of the interleaved R pair (`rating.ts rpair`): the block schedule, the
 * pooled Elo line, the pair difference, the opening-paired (pentanomial) difference, Stockfish's
 * nps from a `-debug all` log, the opening coverage check and the record redaction. No file, no
 * process and no environment is touched here, so `pair-check.ts` reads it without a tool path.
 * Runs on demand only, never in the test lane (`NFR-008`).
 */

/** A build of the pair: `base` is read first in odd blocks, `candidate` in even ones. */
export type Build = "base" | "candidate";

/** One block: openings `start` … `start + rounds − 1`, each played with both colours, per build. */
export interface Block {
  readonly index: number;
  readonly start: number;
  readonly rounds: number;
  readonly order: readonly [Build, Build];
}

/** The ticket's split: 10 openings per block, so 20 games per build per block. */
export const BLOCK_ROUNDS = 10;
/** The pinned file holds 100 openings; a pair covers each at most once. */
export const PAIR_ROUNDS = 100;
/** `ABC-225` NFR: a sha argument is checked as text before any `git` call. */
export const SHA_ARG = /^[0-9a-f]{7,40}$/;

/** `rounds` openings in blocks of `BLOCK_ROUNDS`; block 1 is base-first, then the order alternates. */
export function pairSchedule(rounds: number): Block[] {
  if (!Number.isInteger(rounds) || rounds < BLOCK_ROUNDS || rounds > PAIR_ROUNDS)
    throw new Error(`rounds ${rounds}: not ${BLOCK_ROUNDS}–${PAIR_ROUNDS}`);
  if (rounds % BLOCK_ROUNDS !== 0) throw new Error(`rounds ${rounds}: not a multiple of 10`);
  const blocks: Block[] = [];
  for (let i = 0; i < rounds / BLOCK_ROUNDS; i++) {
    blocks.push({
      index: i + 1,
      start: i * BLOCK_ROUNDS + 1,
      rounds: BLOCK_ROUNDS,
      order: i % 2 === 0 ? ["base", "candidate"] : ["candidate", "base"],
    });
  }
  return blocks;
}

/** `block 03 openings 21-30: candidate, then base` — the dry run's and `schedule.txt`'s line. */
export const blockLine = (b: Block): string =>
  `block ${String(b.index).padStart(2, "0")} openings ${b.start}-${b.start + b.rounds - 1}: ${b.order[0]}, then ${b.order[1]}`;

/** cutechess-cli 1.5.1's `erfInv` (Winitzki's approximation, `elo.cpp`), kept exact. */
function erfInv(x: number): number {
  // biome-ignore lint/suspicious/noApproximativeNumericConstant: cutechess-cli's own truncated pi, kept so the lines match to the digit
  const pi = 3.1415926535897;
  const a = (8 * (pi - 3)) / (3 * pi * (4 - pi));
  const y = Math.log(1 - x * x);
  const z = 2 / (pi * a) + y / 2;
  const r = Math.sqrt(Math.sqrt(z * z - y / a) - z);
  return x < 0 ? -r : r;
}
const phiInv = (p: number): number => Math.SQRT2 * erfInv(2 * p - 1);
const eloOf = (p: number): number => -400 * Math.log10(1 / p - 1);

/**
 * The `Elo difference: X +/- Y` of cutechess-cli 1.5.1 for a W/L/D score: the trinomial standard
 * error and its own `phiInv`. It reproduces the recorded lines exactly (`pair-check.ts`), so the 10
 * blocks of a build can be pooled into one line without re-playing them as one match.
 */
export function cutechessElo(w: number, l: number, d: number): { x: number; y: number } {
  const n = w + l + d;
  const mu = (w + d / 2) / n;
  const dev = (w / n) * (1 - mu) ** 2 + (l / n) * mu ** 2 + (d / n) * (0.5 - mu) ** 2;
  const stdev = Math.sqrt(dev) / Math.sqrt(n);
  const lo = mu + phiInv(0.025) * stdev;
  const hi = mu + phiInv(0.975) * stdev;
  return { x: eloOf(mu), y: (eloOf(hi) - eloOf(lo)) / 2 };
}

/** A number as cutechess-cli prints it: one decimal, `inf`, `-inf` or `nan`. */
export function eloText(v: number): string {
  if (Number.isNaN(v)) return "nan";
  if (v === Infinity) return "inf";
  if (v === -Infinity) return "-inf";
  return v.toFixed(1);
}

/** The EPIC-008 states of a difference X ± Y (§ States of a D reading). */
export const stateOf = (x: number, y: number): "GAIN" | "LOSS" | "NEUTRAL" =>
  x - y > 0 ? "GAIN" : x + y < 0 ? "LOSS" : "NEUTRAL";

/** The pair from the two printed lines: X₂ − X₁ ± √(Y₁² + Y₂²), on the printed one-decimal values. */
export function pairDifference(
  base: { x: string; y: string },
  candidate: { x: string; y: string },
): { x: number; y: number } {
  const [x1, y1, x2, y2] = [base.x, base.y, candidate.x, candidate.y].map(Number) as [
    number,
    number,
    number,
    number,
  ];
  return { x: x2 - x1, y: Math.sqrt(y1 * y1 + y2 * y2) };
}

/** One game of a cutechess-cli PGN, by its tags. */
export interface PgnGame {
  readonly round: number;
  readonly white: string;
  readonly black: string;
  readonly result: string;
  readonly fen: string;
}

/** Every game's tags, in file order. */
export function pgnGames(pgn: string): PgnGame[] {
  const games: PgnGame[] = [];
  for (const text of pgn.split(/\n(?=\[Event )/)) {
    const tag = (name: string): string =>
      new RegExp(`^\\[${name} "(.*)"\\]$`, "m").exec(text)?.[1] ?? "";
    if (!/^\[Event /m.test(text)) continue;
    games.push({
      round: Number(tag("Round")),
      white: tag("White"),
      black: tag("Black"),
      result: tag("Result"),
      fen: tag("FEN"),
    });
  }
  return games;
}

/** `me`'s score in a game: 1, ½ or 0; `undefined` for an unfinished game (`*`). */
export function scoreFor(game: PgnGame, me: string): number | undefined {
  if (game.result === "1/2-1/2") return 0.5;
  if (game.result === "1-0") return game.white === me ? 1 : 0;
  if (game.result === "0-1") return game.black === me ? 1 : 0;
  return undefined;
}

/** `me`'s game scores keyed by opening number: a block's round r is opening `start + r − 1`. */
export function openingScores(
  games: readonly PgnGame[],
  start: number,
  me: string,
): Map<number, number[]> {
  const byOpening = new Map<number, number[]>();
  for (const game of games) {
    const score = scoreFor(game, me);
    if (score === undefined) continue;
    const opening = start + game.round - 1;
    byOpening.set(opening, [...(byOpening.get(opening) ?? []), score]);
  }
  return byOpening;
}

/**
 * The checks behind A2 on a played block: every round r has exactly two games, from the position
 * of opening `start + r − 1`, with `me` once as White and once as Black. The position is the
 * placement and the side to move: cutechess-cli writes `-` for an en-passant square no pawn can
 * take (opening 4's `d6` in `qe-epic008-close` r1), so the EPD's later fields are not compared.
 */
export function coverageCauses(
  games: readonly PgnGame[],
  start: number,
  rounds: number,
  epd: readonly string[],
  me: string,
): string[] {
  const causes: string[] = [];
  for (let r = 1; r <= rounds; r++) {
    const opening = start + r - 1;
    const want = (epd[opening - 1] ?? "").trim().split(/\s+/).slice(0, 2).join(" ");
    const here = games.filter((g) => g.round === r);
    const fens = here.map((g) => g.fen.split(/\s+/).slice(0, 2).join(" "));
    const colours = here.map((g) => (g.white === me ? "w" : g.black === me ? "b" : "?")).sort();
    if (here.length !== 2 || fens.some((f) => f !== want) || colours.join("") !== "bw")
      causes.push(`opening ${opening}: ${here.length} games, not both colours from its position`);
  }
  return causes;
}

/**
 * The opening-paired (pentanomial) difference of `candidate` over `base`, as `arch-epic008-rd`
 * `…9d172446` § 4 computed it (`raw/scripts/an1.py`): per opening, the mean of its two games; the
 * Elo of each build's mean score; the delta-method variance with the two builds' covariance across
 * openings; 1.96 for 95 %. Only openings with both games in both builds count. Information only.
 */
export function pentanomialPair(
  base: ReadonlyMap<number, readonly number[]>,
  candidate: ReadonlyMap<number, readonly number[]>,
): { x: number; half: number; openings: number; corr: number } | undefined {
  const keys = [...base.keys()]
    .filter((k) => base.get(k)?.length === 2 && candidate.get(k)?.length === 2)
    .sort((a, b) => a - b);
  const n = keys.length;
  if (n < 2) return undefined;
  const pair = (m: ReadonlyMap<number, readonly number[]>): number[] =>
    keys.map((k) => ((m.get(k)?.[0] ?? 0) + (m.get(k)?.[1] ?? 0)) / 2);
  const p1 = pair(base);
  const p2 = pair(candidate);
  const m1 = p1.reduce((s, v) => s + v, 0) / n;
  const m2 = p2.reduce((s, v) => s + v, 0) / n;
  const v1 = p1.reduce((s, v) => s + (v - m1) ** 2, 0) / n / n;
  const v2 = p2.reduce((s, v) => s + (v - m2) ** 2, 0) / n / n;
  const cov = p1.reduce((s, v, i) => s + (v - m1) * ((p2[i] as number) - m2), 0) / n / n;
  const slope = (m: number): number => 400 / Math.LN10 / (m * (1 - m));
  const k1 = slope(m1);
  const k2 = slope(m2);
  const variance = k2 * k2 * v2 + k1 * k1 * v1 - 2 * k1 * k2 * cov;
  return {
    x: eloOf(m2) - eloOf(m1),
    half: 1.96 * Math.sqrt(variance),
    openings: n,
    corr: cov / Math.sqrt(v1 * v2),
  };
}

/**
 * Stockfish's speed from a cutechess-cli `-debug all` log, the host gauge `…0c5d62f4` names: per
 * move, the last `info … nps` line before its `bestmove`, kept if the move took ≥ 400 ms; the
 * median is the upper middle value, as `arch-epic008-rd` `an3.py` took it.
 */
export function stockfishNps(debugLog: string): { median: number; moves: number } | undefined {
  const last = new Map<string, { nps: number; time: number }>();
  const kept: number[] = [];
  for (const line of debugLog.split("\n")) {
    const m = /^\d+ <stockfish\((\d+)\): (.*)$/.exec(line);
    if (m === null) continue;
    const [, pid, rest] = m as unknown as [string, string, string];
    if (rest.startsWith("info ") && / nps \d+/.test(rest)) {
      const nps = Number(/ nps (\d+)/.exec(rest)?.[1]);
      const time = Number(/ time (\d+)/.exec(rest)?.[1] ?? 0);
      last.set(pid, { nps, time });
    } else if (rest.startsWith("bestmove")) {
      const info = last.get(pid);
      if (info !== undefined && info.time >= 400) kept.push(info.nps);
      last.delete(pid);
    }
  }
  if (kept.length === 0) return undefined;
  kept.sort((a, b) => a - b);
  return { median: kept[kept.length >> 1] as number, moves: kept.length };
}

/**
 * `ADR-0049` d4: the text with every host path in `pairs` replaced by its placeholder (longest path
 * first), then each word in `words` (user and host name, ≥ 3 characters) as a whole word.
 */
export function redact(
  text: string,
  pairs: readonly (readonly [string, string])[],
  words: readonly (readonly [string, string])[] = [],
): string {
  let out = text;
  for (const [from, to] of [...pairs].sort((a, b) => b[0].length - a[0].length)) {
    if (from.length > 1) out = out.split(from).join(to);
  }
  for (const [from, to] of words) {
    if (from.length < 3) continue;
    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`(?<![\\w.-])${escaped}(?![\\w-])`, "g"), to);
  }
  return out;
}
