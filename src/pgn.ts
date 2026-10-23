/**
 * `ABC-203` — a finished game as PGN text (`ADR-0047` D1). Pure: no I/O and no clock.
 *
 * `pgnStamp` turns the session's one clock reading into the file stem and the `Date` tag. It uses the
 * `Date`'s LOCAL getters only: `toISOString` is UTC, and `toLocale*` / `Intl` can print non-ASCII
 * digits. `src/pgn-file.ts` derives the file name from it, so only a `Date` reaches the path (D2).
 *
 * `formatPgn` is the whole file: ten tag pairs (the Seven Tag Roster, `Termination`, `Difficulty`,
 * `HumanColour`), one empty line, the movetext, one final LF. It does its own replay — `parseFen`,
 * then `toSan` before each `makeMove`, `N.` from the replayed position's `fullmoveNumber` — rather
 * than reuse the screen's move rows: PGN export format and the screen are two reasons to change.
 * The comment is the screen's headline, through `resultHeadline`, joined with one space.
 *
 * It is total over the ten non-null reasons; the caller gates on `outcome.reason !== null`, the same
 * guard as the screen's zero rows. The CLI only starts from the standard position, so there is no
 * `SetUp`/`FEN` tag and no black-to-move first ply.
 *
 * `history.ts` and `turn-loop.ts` are TYPE imports, as in `src/result-screen.ts` (`ADR-0002` clause
 * 4's licence equality does not move). Nothing here is sanitized: every byte is product-made.
 */

import { makeMove } from "./apply.ts";
import type { Colour, Difficulty } from "./cli-options.ts";
import { parseFen } from "./fen.ts";
import type { GameHistory } from "./history.ts";
import type { Move } from "./moves.ts";
import { resultHeadline } from "./result-screen.ts";
import { toSan } from "./san.ts";
import type { LoopOutcome, TerminalReason } from "./turn-loop.ts";

/** What the session knows about the game that the history does not. */
export interface PgnGame {
  readonly startedAt: Date;
  readonly difficulty: Difficulty;
  readonly humanColour: Colour;
}

/** A movetext line wraps before a word that would take it past this many characters (`A5`). */
const LINE_LIMIT = 79;

const RESULT_TOKEN: Readonly<Record<NonNullable<LoopOutcome["result"]>, string>> = {
  "white-wins": "1-0",
  "black-wins": "0-1",
  draw: "1/2-1/2",
};

const pad = (value: number): string => String(value).padStart(2, "0");

/** `skytalix-YYYYMMDD-HHMMSS` and `YYYY.MM.DD`, from the local-time fields of one reading. */
export function pgnStamp(startedAt: Date): { readonly stem: string; readonly date: string } {
  const year = String(startedAt.getFullYear());
  const month = pad(startedAt.getMonth() + 1);
  const day = pad(startedAt.getDate());
  const time = `${pad(startedAt.getHours())}${pad(startedAt.getMinutes())}${pad(startedAt.getSeconds())}`;
  return { stem: `skytalix-${year}${month}${day}-${time}`, date: `${year}.${month}.${day}` };
}

/** Words joined by single spaces, a new line before any word that would pass `LINE_LIMIT`. */
function wrapped(words: readonly string[]): string {
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if (line !== "" && line.length + 1 + word.length > LINE_LIMIT) {
      lines.push(line);
      line = word;
    } else line = line === "" ? word : `${line} ${word}`;
  }
  lines.push(line);
  return lines.join("\n");
}

/** The whole `.pgn` file for one finished game. `outcome.reason` must be non-null. */
export function formatPgn(outcome: LoopOutcome, history: GameHistory, game: PgnGame): string {
  const reason = outcome.reason as TerminalReason;
  const token = outcome.result === null ? "*" : RESULT_TOKEN[outcome.result];
  const engine = `skytalix (difficulty ${game.difficulty})`;
  const tags: readonly (readonly [string, string])[] = [
    ["Event", "skytalix CLI game"],
    ["Site", "?"],
    ["Date", pgnStamp(game.startedAt).date],
    ["Round", "-"],
    ["White", game.humanColour === "white" ? "Human" : engine],
    ["Black", game.humanColour === "black" ? "Human" : engine],
    ["Result", token],
    ["Termination", outcome.result === null ? "unterminated" : "normal"],
    ["Difficulty", String(game.difficulty)],
    ["HumanColour", game.humanColour],
  ];

  const words: string[] = [];
  const position = parseFen(history.initialFen);
  for (const move of history.moves) {
    if (!position.blackToMove) words.push(`${position.fullmoveNumber}.`);
    words.push(toSan(position, move as Move));
    makeMove(position, move as Move);
  }
  // The comment's words wrap like any other; a fault's two headline lines pass 79 characters.
  words.push(...`{${resultHeadline(outcome, reason).join(" ")}}`.split(" "), token);

  const tagSection = tags.map(([name, value]) => `[${name} "${value}"]`).join("\n");
  return `${tagSection}\n\n${wrapped(words)}\n`;
}
