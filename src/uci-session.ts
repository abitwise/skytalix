/**
 * `ABC-167` (`ADR-0044` D2-D4, D12): the UCI protocol as a pure module. Lines in, lines out.
 *
 * CAPABILITY-FREE (`ADR-0044` D2, `ABC-167` `A11`). It writes through the injected `write` and
 * reads time only through the injected `now` (`ADR-0027`), so the whole protocol is testable on a
 * virtual clock. The entry point that binds the real streams and the real clock is `ABC-168`'s.
 *
 * In this ticket the strength is fixed at `DEFAULT_LEVEL` (rate 0, so `chooseMove` is called
 * directly) and there is no book and no option. `ABC-171` adds `random`, `book` and the options.
 *
 * ONE THREAD (`ADR-0044` D5). `go` searches to its budget inside `handleLine`, so a `stop` that
 * arrives later finds the search already finished; `infinite` and `ponder` only HOLD the answer.
 */

import { makeMove } from "./apply.ts";
import { parseCoordinateMove } from "./coordinate-move.ts";
import { type Clock, chooseMove, type EngineChoice, HARD_CEILING_MS } from "./engine.ts";
import { parseFen } from "./fen.ts";
import { DEFAULT_LEVEL, LEVELS } from "./levels.ts";
import { BISHOP, KNIGHT, type Position, QUEEN, ROOK, squareName } from "./position.ts";
import { MATE_SCORE } from "./search.ts";
import { MATE_FLOOR } from "./transposition.ts";

export interface UciSessionOptions {
  /** Takes one output line, without its line terminator. */
  readonly write: (line: string) => void;
  /** The `Clock` handed to the engine; a test injects a virtual one. */
  readonly now: Clock;
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

/**
 * Parses `position startpos | fen <fields> [moves m1 m2 ...]`. Any fault refuses the whole
 * command (D3): the result is a message naming the fault, and no position is held.
 */
function parsePosition(tokens: readonly string[]): Position | string {
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
  for (const text of moves) {
    const parsed = parseCoordinateMove(position, text);
    if (parsed.outcome !== "move") return `illegal move ${text}`;
    makeMove(position, parsed.move);
  }
  return position;
}

interface GoRequest {
  readonly budgetMs: number;
  readonly maxDepth: number | undefined;
  readonly maxNodes: number | undefined;
  readonly hold: boolean;
}

/** D4 and D12 over the `go` tokens. Each refused token is reported through `warn` and dropped. */
function parseGo(
  tokens: readonly string[],
  blackToMove: boolean,
  warn: (message: string) => void,
): GoRequest {
  const clock: Record<string, number> = {};
  let depth: number | undefined;
  let nodes: number | undefined;
  let mate: number | undefined;
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
      } else if (keyword === "depth") depth = value;
      else if (keyword === "nodes") nodes = value;
      else mate = value;
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

  // D4.1: the budget G.
  let budget: number = HARD_CEILING_MS;
  const time = clock[blackToMove ? "btime" : "wtime"];
  if (clock.movetime !== undefined) {
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

  // D4.2: the level caps it. The engine still clamps at `HARD_CEILING_MS` (D4.4).
  return {
    budgetMs: Math.min(budget, LEVELS[DEFAULT_LEVEL].budgetMs),
    maxDepth,
    maxNodes: nodes,
    hold,
  };
}

export function createUciSession(options: UciSessionOptions): UciSession {
  const { write, now } = options;
  const info = (message: string): void => write(`info string ${printableOf(message)}`);

  let position: Position | null = parseFen(START_FEN);
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
    const request = parseGo(tokens, position?.blackToMove ?? false, info);
    let answer = "bestmove 0000";
    if (position !== null) {
      const choice = chooseMove(position, {
        budgetMs: request.budgetMs,
        now,
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

  return {
    handleLine(line: string): "continue" | "quit" {
      const tokens = line.trim().split(/\s+/);
      switch (tokens[0]) {
        case "uci":
          write("id name skytalix");
          write("id author Olger Oeselg");
          write("uciok");
          break;
        case "isready":
          write("readyok");
          break;
        case "ucinewgame":
          release();
          position = parseFen(START_FEN);
          break;
        case "position": {
          release();
          const parsed = parsePosition(tokens);
          if (typeof parsed === "string") {
            position = null;
            info(`position refused: ${parsed}`);
          } else position = parsed;
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
        // `setoption`, `debug`, `register`, an empty line and anything unknown: ignored (D3).
      }
      return "continue";
    },
  };
}
