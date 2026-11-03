/**
 * `ABC-239` (`ADR-0067` d9 and § Addendum): the tuner's PGN reader. Local files only.
 *
 * Two readings of a move text:
 * - **Lichess** (`readComments` false): every `{…}` comment is skipped to its closing brace and its
 *   text is never captured or looked at, `[%eval]` included (Q-3K-7 (b)). Move numbers are not
 *   needed, so a black move after a comment with no `1...` parses (the export's known issue).
 * - **Own games** (`readComments` true): the engine's own comment on a move marks it as searched
 *   (not book) and carries a mate score as `M`. These are this engine's own outputs.
 */
import { createReadStream } from "node:fs";
import { createZstdDecompress } from "node:zlib";

export interface Game {
  readonly tags: ReadonlyMap<string, string>;
  readonly movetext: string;
}

export interface MoveText {
  readonly sans: string[];
  /** Own games only: per move, the comment that follows it (null for none). */
  readonly comments: Array<string | null> | null;
}

const RESULT_TOKENS = new Set(["1-0", "0-1", "1/2-1/2", "*"]);

/** Lexes a move text into SAN moves. With `readComments` false a comment is skipped unread. */
export function lexMovetext(text: string, readComments: boolean): MoveText {
  const sans: string[] = [];
  const comments: Array<string | null> | null = readComments ? [] : null;
  const n = text.length;
  let i = 0;
  while (i < n) {
    const ch = text.charCodeAt(i);
    if (ch === 123 /* { */) {
      const end = text.indexOf("}", i + 1);
      const close = end < 0 ? n : end;
      if (comments !== null && sans.length > 0 && comments[sans.length - 1] === null) {
        comments[sans.length - 1] = text.slice(i + 1, close);
      }
      i = close + 1;
      continue;
    }
    if (ch === 32 || ch === 10 || ch === 13 || ch === 9) {
      i++;
      continue;
    }
    let j = i;
    while (j < n) {
      const c = text.charCodeAt(j);
      if (c === 32 || c === 10 || c === 13 || c === 9 || c === 123) break;
      j++;
    }
    let token = text.slice(i, j);
    i = j;
    if (RESULT_TOKENS.has(token) || token.charCodeAt(0) === 36 /* $ NAG */) continue;
    token = token.replace(/^\d+\.+/, "").replace(/[!?]+$/, "");
    if (token === "") continue;
    sans.push(token);
    if (comments !== null) comments.push(null);
  }
  return { sans, comments };
}

const TAG_LINE = /^\[(\w+) "(.*)"\]\s*$/;

/** Splits PGN text into games (tags plus move text), line by line; feed lines in order. */
export class GameSplitter {
  private tags = new Map<string, string>();
  private moves: string[] = [];
  private inMoves = false;

  private readonly onGame: (game: Game) => void;

  constructor(onGame: (game: Game) => void) {
    this.onGame = onGame;
  }

  line(line: string): void {
    if (line.startsWith("[")) {
      if (this.inMoves || (line.startsWith("[Event ") && this.tags.size > 0)) this.flush();
      const m = TAG_LINE.exec(line);
      if (m !== null) this.tags.set(m[1] as string, m[2] as string);
      return;
    }
    if (line.trim() === "") return;
    this.inMoves = true;
    this.moves.push(line);
  }

  flush(): void {
    if (this.tags.size > 0 || this.moves.length > 0) {
      this.onGame({ tags: this.tags, movetext: this.moves.join(" ") });
    }
    this.tags = new Map();
    this.moves = [];
    this.inMoves = false;
  }
}

/** Every game of a PGN text, in order. */
export function gamesOf(text: string): Game[] {
  const out: Game[] = [];
  const splitter = new GameSplitter((g) => out.push(g));
  for (const line of text.split(/\r?\n/)) splitter.line(line);
  splitter.flush();
  return out;
}

/** Streams a `.pgn.zst` file through `node:zlib`'s zstd, never to disk, game by game. */
export async function streamZstGames(path: string, onGame: (game: Game) => void): Promise<void> {
  const splitter = new GameSplitter(onGame);
  const stream = createReadStream(path).pipe(createZstdDecompress());
  stream.setEncoding("utf8");
  let rest = "";
  for await (const chunk of stream as AsyncIterable<string>) {
    const text = rest + chunk;
    let start = 0;
    for (let nl = text.indexOf("\n"); nl >= 0; nl = text.indexOf("\n", start)) {
      const end = nl > start && text.charCodeAt(nl - 1) === 13 ? nl - 1 : nl;
      splitter.line(text.slice(start, end));
      start = nl + 1;
    }
    rest = text.slice(start);
  }
  if (rest !== "") splitter.line(rest);
  splitter.flush();
}
