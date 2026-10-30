/**
 * `ABC-167` (`ADR-0044` D2-D4, D12): the UCI protocol as a pure module. Lines in, lines out.
 *
 * CAPABILITY-FREE (`ADR-0044` D2, `ABC-167` `A11`). It writes through the injected `write` and
 * reads time only through the injected `now` (`ADR-0027`), so the whole protocol is testable on a
 * virtual clock. The entry point that binds the real streams and the real clock is `ABC-168`'s.
 *
 * `ABC-171` (`ADR-0044` D3, D10, D11) adds the two options. `OwnBook` (default on) probes the
 * injected `book` before any search. `Skill Level` (`EASIEST_LEVEL`-`HARDEST_LEVEL`, 1-7, default
 * `DEFAULT_LEVEL`) caps the budget at its level's, and a level with a blunder rate plays through
 * `createLevel`, seeded per `go` from the injected `random`. Levels 5-7 have rate 0 and take
 * `chooseMove` with D12's limits (`ADR-0045` § AMENDMENT A4).
 *
 * `ABC-220` (`ADR-0052` D1-D3, D8) adds a third option, the `combo` `TimeMode` (`TIME_MODES`,
 * default `level`). `level` is everything above, unchanged. `simple-tournament` searches a fixed
 * `SIMPLE_TOURNAMENT_BUDGET_MS` (22 000) a move at rate 0, never past the clock it is given: a
 * `movetime x` gets `min(x, T)`, a clock for the side to move `min(T, C)` (`safeClockShare`), and no
 * time token T. T is also the setting's hard ceiling, `SIMPLE_TOURNAMENT_CEILING_MS`. While
 * `TimeMode` is not `level`, `Skill Level` is not read: no level cap, no blunder draw.
 *
 * ONE THREAD (`ADR-0044` D5). `go` searches to its budget inside `handleLine`, so a `stop` that
 * arrives later finds the search already finished; `infinite` and `ponder` only HOLD the answer.
 * So `isready` and `stop` sent during a search are answered at most one budget late: about 5 s at
 * levels 1-5, 7 s at 6 and 32 s at 7 (`ABC-212`). That latency is accepted, with no worker
 * (`ADR-0045` § AMENDMENT A4): a GUI that times out on `isready` or `stop` mid-search should be
 * used at level 5 or below. In `TimeMode` `simple-tournament` they are answered at most one budget
 * plus the abort overshoot (`AR-NFR004-A`) late, so 22 s read to the whole second (22 000 ms plus
 * the overshoot), and that is accepted with no worker too (`ADR-0052` D7, `ABC-220`): one
 * `readyok` per `isready`, written in order, after the `bestmove`.
 */

import { makeMove } from "./apply.ts";
import type { BookProbe } from "./book.ts";
import { parseCoordinateMove } from "./coordinate-move.ts";
import {
  type Clock,
  chooseMove,
  type EngineChoice,
  HARD_CEILING_MS,
  trimPriorKeys,
} from "./engine.ts";
import { parseFen } from "./fen.ts";
import { createLevel, DEFAULT_LEVEL, EASIEST_LEVEL, HARDEST_LEVEL, LEVELS } from "./levels.ts";
import { BISHOP, KNIGHT, type Position, QUEEN, ROOK, squareName } from "./position.ts";
import { MATE_SCORE } from "./search.ts";
import { MATE_FLOOR } from "./transposition.ts";
import { zobristKey } from "./zobrist.ts";

export interface UciSessionOptions {
  /** Takes one output line, without its line terminator. */
  readonly write: (line: string) => void;
  /** The `Clock` handed to the engine; a test injects a virtual one. */
  readonly now: Clock;
  /** Values in [0, 1). Draws one blunder seed per `go` at a level with a blunder rate (D11). */
  readonly random: () => number;
  /** The opening book (D10). Never called while `OwnBook` is off. */
  readonly book: BookProbe;
}

export interface UciSession {
  /** Handles one input line. `"quit"` after `quit`, `"continue"` after anything else. */
  handleLine(line: string): "continue" | "quit";
}

const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** The `go` keywords; `searchmoves` consumes tokens up to the next one of these. */
const GO_KEYWORDS = new Set([
  "searchmoves",
  "ponder",
  "wtime",
  "btime",
  "winc",
  "binc",
  "movestogo",
  "depth",
  "nodes",
  "mate",
  "movetime",
  "infinite",
]);

/** D4's move overhead, in milliseconds. */
const MOVE_OVERHEAD_MS = 50;
/** D4's default number of moves the remaining clock is spread over. */
const DEFAULT_MOVES_TO_GO = 20;

/**
 * `ADR-0052` D1: the `TimeMode` values offered at this build, a closed set. `level` (the default)
 * is today's behaviour. `uci-clock-mode` is not offered until it works (`ABC-221`).
 */
const TIME_MODES = Object.freeze(["level", "simple-tournament"] as const);
type TimeMode = (typeof TIME_MODES)[number];

/** `ADR-0052` D3, as amended 2026-10-30: `simple-tournament`'s hard ceiling (`NFR-004`), whole seconds. */
const SIMPLE_TOURNAMENT_CEILING_MS = 22_000;
/** `ADR-0052` D3: T, what `simple-tournament` spends a move. Equal to its ceiling, no margin. */
const SIMPLE_TOURNAMENT_BUDGET_MS = SIMPLE_TOURNAMENT_CEILING_MS;
/** `ADR-0052` D2: kept back on the clock at the time control. */
const CLOCK_RESERVE_MS = 1_000;
/** `ADR-0052` D2: charged per move still to play before the control. */
const CLOCK_OVERHEAD_MS = 100;

const PROMOTION_LETTERS: Readonly<Record<number, string>> = {
  [QUEEN]: "q",
  [ROOK]: "r",
  [BISHOP]: "b",
  [KNIGHT]: "n",
};

type Move = EngineChoice["move"];

function coordinateOf(move: Move): string {
  return `${squareName(move.from)}${squareName(move.to)}${PROMOTION_LETTERS[move.promotion] ?? ""}`;
}

/** The `cli.ts` `printableOf` rule: drop C0 and `U+007F`, keep everything else. */
function printableOf(text: string): string {
  let kept = "";
  for (const character of text) {
    const code = character.codePointAt(0) as number;
    if (code < 0x20 || code === 0x7f) continue;
    kept += character;
  }
  return kept;
}

/** `a`, `a or b`, `a, b or c`: `ADR-0052` D1's spelling of the offered values. */
function spokenList(values: readonly string[]): string {
  return values.length <= 1
    ? values.join("")
    : `${values.slice(0, -1).join(", ")} or ${values.at(-1) as string}`;
}

/** D3: `score mate ±M` at or beyond `MATE_FLOOR`, in moves, negative when being mated. */
function scoreOf(score: number): string {
  if (Math.abs(score) < MATE_FLOOR) return `cp ${score}`;
  const moves = Math.ceil((MATE_SCORE - Math.abs(score)) / 2);
  return `mate ${score > 0 ? moves : -moves}`;
}

/** D12: "an integer >= 1", or `undefined` for anything else. */
function positiveInteger(text: string | undefined): number | undefined {
  if (text === undefined || !/^\d+$/.test(text)) return undefined;
  const value = Number(text);
  return Number.isSafeInteger(value) && value >= 1 ? value : undefined;
}

/** A clock figure in milliseconds: any finite decimal number, or `undefined`. */
function milliseconds(text: string | undefined): number | undefined {
  if (text === undefined || !/^-?\d+(\.\d+)?$/.test(text)) return undefined;
  return Number(text);
}

/** A parsed `position`: the position after the moves, and the game's keys before it. */
interface HeldPosition {
  readonly position: Position;
  /**
   * `ABC-230` (`ADR-0054` decision 2, the `ADR-0044` D2 amendment): the key of every position the
   * moves passed through, trimmed by `trimPriorKeys`. Empty after a bare `fen` or `startpos`.
   */
  readonly priorKeys: readonly bigint[];
}

/**
 * Parses `position startpos | fen <fields> [moves m1 m2 ...]`. Any fault refuses the whole
 * command (D3): the result is a message naming the fault, and no position is held.
 */
function parsePosition(tokens: readonly string[]): HeldPosition | string {
  const movesAt = tokens.indexOf("moves");
  const head = movesAt === -1 ? tokens.slice(1) : tokens.slice(1, movesAt);
  const moves = movesAt === -1 ? [] : tokens.slice(movesAt + 1);

  let fen: string;
  if (head[0] === "startpos" && head.length === 1) fen = START_FEN;
  else if (head[0] === "fen" && head.length > 1) fen = head.slice(1).join(" ");
  else return "expected startpos or fen <fields>";

  let position: Position;
  try {
    position = parseFen(fen);
  } catch (error) {
    return `bad fen: ${error instanceof Error ? error.message : String(error)}`;
  }
  const keys = [zobristKey(position)];
  for (const text of moves) {
    const parsed = parseCoordinateMove(position, text);
    if (parsed.outcome !== "move") return `illegal move ${text}`;
    makeMove(position, parsed.move);
    keys.push(zobristKey(position));
  }
  return { position, priorKeys: trimPriorKeys(keys, position.halfmoveClock) };
}

/**
 * `ADR-0052` D2, the safe clock share `C` for the side to move: the clock `time` less the reserve
 * and one overhead per move still to play, spread over `movesToGo`, plus the `increment`; never
 * more than leaves `RESERVE + OVERHEAD` on the clock; never below 1 (the engine's depth 1).
 */
function safeClockShare(time: number, increment: number, movesToGo: number): number {
  const spread = (time - CLOCK_RESERVE_MS - movesToGo * CLOCK_OVERHEAD_MS) / movesToGo + increment;
  return Math.max(1, Math.min(spread, time - CLOCK_RESERVE_MS - CLOCK_OVERHEAD_MS));
}

interface GoRequest {
  /** D4.1's `G` under `TimeMode` `level`, before the level caps it; `ADR-0052` D3's under a mode. */
  readonly budgetMs: number;
  readonly maxDepth: number | undefined;
  readonly maxNodes: number | undefined;
  /** The accepted `depth` / `nodes` / `mate` keywords, in input order. */
  readonly limits: readonly string[];
  readonly hold: boolean;
}

/** D4 and D12 over the `go` tokens. Each refused token is reported through `warn` and dropped. */
function parseGo(
  tokens: readonly string[],
  blackToMove: boolean,
  timeMode: TimeMode,
  warn: (message: string) => void,
): GoRequest {
  const clock: Record<string, number> = {};
  let depth: number | undefined;
  let nodes: number | undefined;
  let mate: number | undefined;
  const limits: string[] = [];
  let hold = false;

  /** QE-167-f: a keyword is never a value. A keyword with no value leaves the next token unread. */
  const valueAfter = (index: number): string | undefined => {
    const next = tokens[index + 1];
    return next === undefined || GO_KEYWORDS.has(next) ? undefined : next;
  };

  for (let index = 1; index < tokens.length; index++) {
    const keyword = tokens[index] as string;
    if (keyword === "infinite" || keyword === "ponder") {
      hold = true;
    } else if (keyword === "searchmoves") {
      while (index + 1 < tokens.length && !GO_KEYWORDS.has(tokens[index + 1] as string)) index++;
      warn("searchmoves is not supported; searching all moves");
    } else if (keyword === "depth" || keyword === "nodes" || keyword === "mate") {
      const text = valueAfter(index);
      if (text !== undefined) index++;
      const value = positiveInteger(text);
      if (value === undefined) {
        warn(`go ${keyword} needs an integer >= 1, got ${text ?? "nothing"}; ignored`);
      } else {
        if (!limits.includes(keyword)) limits.push(keyword);
        if (keyword === "depth") depth = value;
        else if (keyword === "nodes") nodes = value;
        else mate = value;
      }
    } else if (
      keyword === "movetime" ||
      keyword === "wtime" ||
      keyword === "btime" ||
      keyword === "winc" ||
      keyword === "binc"
    ) {
      const text = valueAfter(index);
      if (text !== undefined) index++;
      const value = milliseconds(text);
      if (value === undefined)
        warn(`go ${keyword} needs a number, got ${text ?? "nothing"}; ignored`);
      else clock[keyword] = value;
    } else if (keyword === "movestogo") {
      const text = valueAfter(index);
      if (text !== undefined) index++;
      const value = positiveInteger(text);
      if (value === undefined) {
        warn(`go movestogo needs an integer >= 1, got ${text ?? "nothing"}; ignored`);
      } else clock.movestogo = value;
    }
    // Anything else is an unknown token, and the spec says to ignore it.
  }

  // D4.1: the budget G. With no time token it is `HARD_CEILING_MS`, which D4.2's cap below turns
  // into the level's own budget at every level (`ABC-212`: every budget is under the clamp).
  let budget: number = HARD_CEILING_MS;
  const time = clock[blackToMove ? "btime" : "wtime"];
  if (timeMode === "simple-tournament") {
    // `ADR-0052` D3: T with no time token, `min(x, T)` for `movetime x`, `min(T, C)` on a clock.
    budget = SIMPLE_TOURNAMENT_BUDGET_MS;
    if (clock.movetime !== undefined) budget = Math.min(clock.movetime, budget);
    else if (time !== undefined) {
      const increment = clock[blackToMove ? "binc" : "winc"] ?? 0;
      const movesToGo = clock.movestogo ?? DEFAULT_MOVES_TO_GO;
      budget = Math.min(budget, safeClockShare(time, increment, movesToGo));
    }
  } else if (clock.movetime !== undefined) {
    budget = clock.movetime;
  } else if (time !== undefined) {
    const increment = clock[blackToMove ? "binc" : "winc"] ?? 0;
    const share = time / (clock.movestogo ?? DEFAULT_MOVES_TO_GO) + increment / 2;
    budget = Math.max(1, Math.min(share, time - MOVE_OVERHEAD_MS));
  }

  // D12: mate N searches 2N - 1 plies; with depth also given, the smaller one wins.
  const mateDepth = mate === undefined ? undefined : 2 * mate - 1;
  const maxDepth =
    depth === undefined ? mateDepth : mateDepth === undefined ? depth : Math.min(depth, mateDepth);

  return { budgetMs: budget, maxDepth, maxNodes: nodes, limits, hold };
}

/**
 * `setoption name <id> [value <x>]` (D3): the id is the text between `name` and `value`, lower
 * cased for the case-insensitive match. The value is the text after `value`, or `""` without one.
 */
function parseSetOption(tokens: readonly string[]): { name: string; value: string } {
  const nameAt = tokens.indexOf("name");
  if (nameAt === -1) return { name: "", value: "" };
  const valueAt = tokens.indexOf("value", nameAt + 1);
  const end = valueAt === -1 ? tokens.length : valueAt;
  return {
    name: tokens
      .slice(nameAt + 1, end)
      .join(" ")
      .toLowerCase(),
    value: valueAt === -1 ? "" : tokens.slice(valueAt + 1).join(" "),
  };
}

export function createUciSession(options: UciSessionOptions): UciSession {
  const { write, now, random, book } = options;
  const info = (message: string): void => write(`info string ${printableOf(message)}`);

  let ownBook = true;
  let skill: keyof typeof LEVELS = DEFAULT_LEVEL;
  /** `ADR-0052` D1: `ucinewgame` does not reset it. */
  let timeMode: TimeMode = TIME_MODES[0];
  /** D10: the book is read once per process, at the first `isready` with `OwnBook` on, or at `go`. */
  let warmed = false;
  const warm = (): void => {
    if (warmed || !ownBook) return;
    warmed = true;
    book.openingName(parseFen(START_FEN));
  };

  let position: Position | null = parseFen(START_FEN);
  /** `ABC-230`: the held position's prior keys. Empty on `ucinewgame` and on a refused `position`. */
  let priorKeys: readonly bigint[] = [];
  /**
   * The `bestmove` line `go infinite` / `go ponder` holds. It is never dropped (QE-167-e): `stop`,
   * `ponderhit`, `go`, `position`, `ucinewgame` and `quit` write it first; other lines leave it held.
   */
  let held: string | null = null;

  const release = (): void => {
    if (held === null) return;
    const line = held;
    held = null;
    write(line);
  };

  const go = (tokens: readonly string[]): void => {
    // One `bestmove` per `go`: an answer still held is released before the next search.
    release();
    const request = parseGo(tokens, position?.blackToMove ?? false, timeMode, info);
    // D4.2 / D11: the level caps G. The engine still clamps at `HARD_CEILING_MS` (D4.4).
    // `ADR-0052` D1: under a mode `Skill Level` is not read, so no cap and the rate-0 path.
    const level = LEVELS[skill];
    const leveled = timeMode === "level";
    const budgetMs = leveled ? Math.min(request.budgetMs, level.budgetMs) : request.budgetMs;
    let answer = "bestmove 0000";
    // D10: the book before any search, on the position after the moves.
    warm();
    const booked = ownBook && position !== null ? book.bookMove(position) : undefined;
    if (booked !== undefined) {
      info("book");
      answer = `bestmove ${coordinateOf(booked)}`;
    } else if (position !== null && leveled && level.blunderRate > 0) {
      // D11: a fresh level per `go`, seeded from the injected `random`; it takes no depth limit.
      if (request.limits.length > 0) {
        info(`skill level ${skill} ignores go ${request.limits.join(", ")}; searching on time`);
      }
      const seed = Math.floor(random() * 2 ** 32);
      const choice = createLevel({ budgetMs, blunderRate: level.blunderRate }, { seed, now })(
        position,
        priorKeys,
      );
      if (choice !== null) {
        const move = coordinateOf(choice.move);
        write(
          `info depth ${choice.depth} nodes ${choice.nodes} time ${choice.elapsedMs} pv ${move}`,
        );
        answer = `bestmove ${move}`;
      }
    } else if (position !== null) {
      const choice = chooseMove(position, {
        budgetMs,
        now,
        priorKeys,
        ...(request.maxDepth === undefined ? {} : { maxDepth: request.maxDepth }),
        ...(request.maxNodes === undefined ? {} : { maxNodes: request.maxNodes }),
      });
      if (choice !== null) {
        const move = coordinateOf(choice.move);
        const nps = Math.round((choice.nodes * 1000) / Math.max(1, choice.elapsedMs));
        write(
          `info depth ${choice.depth} score ${scoreOf(choice.score)} nodes ${choice.nodes} ` +
            `time ${choice.elapsedMs} nps ${nps} pv ${move}`,
        );
        answer = `bestmove ${move}`;
      }
    }
    if (request.hold) held = answer;
    else write(answer);
  };

  /** D3: an invalid value keeps the old one, with one `info string`; any other name is ignored. */
  const setOption = (tokens: readonly string[]): void => {
    const { name, value } = parseSetOption(tokens);
    const got = value === "" ? "nothing" : value;
    if (name === "ownbook") {
      if (value === "true" || value === "false") ownBook = value === "true";
      else info(`OwnBook takes true or false, got ${got}; kept ${ownBook}`);
    } else if (name === "skill level") {
      // An own key only (the `level-seam.ts` rule), so no inherited key ever selects a level.
      if (Object.hasOwn(LEVELS, value)) skill = Number(value) as keyof typeof LEVELS;
      else
        info(
          `Skill Level takes an integer ${EASIEST_LEVEL}-${HARDEST_LEVEL}, got ${got}; kept ${skill}`,
        );
    } else if (name === "timemode") {
      // `ADR-0052` D1: the value matches one offered value exactly, case and all.
      const offered = TIME_MODES.find((mode) => mode === value);
      if (offered !== undefined) timeMode = offered;
      else info(`TimeMode takes ${spokenList(TIME_MODES)}, got ${got}; kept ${timeMode}`);
    }
  };

  return {
    handleLine(line: string): "continue" | "quit" {
      const tokens = line.trim().split(/\s+/);
      switch (tokens[0]) {
        case "uci":
          write("id name skytalix");
          write("id author Olger Oeselg");
          write("option name OwnBook type check default true");
          write(
            `option name Skill Level type spin default ${DEFAULT_LEVEL} min ${EASIEST_LEVEL} max ${HARDEST_LEVEL}`,
          );
          write(
            `option name TimeMode type combo default ${TIME_MODES[0]} ${TIME_MODES.map((mode) => `var ${mode}`).join(" ")}`,
          );
          write("uciok");
          break;
        case "isready":
          warm();
          write("readyok");
          break;
        case "setoption":
          setOption(tokens);
          break;
        case "ucinewgame":
          release();
          position = parseFen(START_FEN);
          priorKeys = [];
          break;
        case "position": {
          release();
          const parsed = parsePosition(tokens);
          if (typeof parsed === "string") {
            position = null;
            priorKeys = [];
            info(`position refused: ${parsed}`);
          } else ({ position, priorKeys } = parsed);
          break;
        }
        case "go":
          go(tokens);
          break;
        case "stop":
        case "ponderhit":
          release();
          break;
        case "quit":
          release();
          return "quit";
        default:
        // `debug`, `register`, an empty line and anything unknown: ignored (D3).
      }
      return "continue";
    },
  };
}
