/**
 * `ABC-203` — the finished game as a PGN file (`ADR-0047`).
 *
 * `A1`, `A2` and `A4`-`A7` are about the TEXT, so they run in memory against `src/pgn.ts` with a
 * constructed `GameHistory` and `LoopOutcome`, the way `src/result-screen.test.ts` does.
 *
 * `A8`-`A10` are about the FILE, and they cannot run in this worker: the holder writes relative to
 * the working directory and the lane's `pool: "threads"` forbids `process.chdir`
 * (`ERR_WORKER_UNSUPPORTED_OPERATION`, `ADR-0047` § Consequences). So this file holds ONE spawned
 * child (`## Design ruling` item 2): `node --input-type=module -e <script>` from a fresh `mkdtemp`
 * directory, removed by the exact path `mkdtemp` returned. The script imports the holder by absolute
 * URL, runs every case in its own subdirectory (the child's main thread may `chdir`) and prints one
 * JSON line. The child follows `src/cli.test.ts`'s discipline: argument array, no shell, an empty
 * environment, a `timeout` and a loud throw on `child.error`.
 *
 * `A12` is a source-order row over `src/cli.ts` (`## Design ruling` item 3), the form
 * `src/startup-questions.test.ts` uses. The spawned-entry-point halves of `A1`, `A3` and `A11` live in
 * `src/cli.test.ts`, on its existing children.
 *
 * THE CLOCK is the local-time `Date` constructor, never `TZ`: its local getters read back the same
 * fields in any time zone (measured at the ruling under `TZ` +14 and -10), and 14:05:09 is in no
 * daylight-saving gap.
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { makeMove } from "./apply.ts";
import { parseFen, toFen } from "./fen.ts";
import { type GameHistory, newGame, playMove } from "./history.ts";
import { legalMoves } from "./legal.ts";
import type { Move } from "./moves.ts";
import { formatPgn, pgnStamp } from "./pgn.ts";
import { resultHeadline } from "./result-screen.ts";
import { parseSan } from "./san.ts";
import type { FinalResult, LoopOutcome, TerminalReason } from "./turn-loop.ts";

/** Every test file in this suite declares its own. */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

const SOURCE_DIRECTORY = new URL(".", import.meta.url).pathname;
const REPOSITORY = new URL("..", import.meta.url).pathname;

/** 2026-10-23 14:05:09 local time. */
const STARTED_AT = new Date(2026, 9, 23, 14, 5, 9);

const outcomeOf = (result: FinalResult | null, reason: TerminalReason): LoopOutcome => ({
  result,
  reason,
  exitCode: 0,
});

/** A game from SAN words, each resolved by the merged parser (move numbers and a result dropped). */
function gameOf(movetext: string): GameHistory {
  const history = newGame(START_FEN);
  for (const word of sanWordsOf(movetext)) {
    const parsed = parseSan(history.position, word);
    if (parsed.outcome !== "move") throw new Error(`fixture word ${word}: ${parsed.outcome}`);
    playMove(history, parsed.move);
  }
  return history;
}

/** The SAN words of a movetext: move numbers, comments and the result token removed. */
const sanWordsOf = (movetext: string): string[] =>
  movetext
    .replace(/\{[^}]*\}/g, " ")
    .split(/\s+/)
    .filter(
      (word) => word !== "" && !/^\d+\.$/.test(word) && !/^(1-0|0-1|1\/2-1\/2|\*)$/.test(word),
    );

/**
 * `A6`'s Given, checked by hand and by the replay below: 47 plies with both castlings (`O-O` for
 * Black, `O-O-O` for White), an en passant capture (`hxg6` after `g5`), a promotion (`bxa8=Q`),
 * checks, and a mate whose SAN needs a file disambiguator (`Qaxf7#`).
 */
const ROUND_TRIP_GAME =
  "1. e4 d5 2. exd5 c6 3. dxc6 Nf6 4. cxb7 Nc6 5. bxa8=Q Bf5 6. Qxa7 e6 7. d4 Be7 8. Nc3 O-O " +
  "9. Be3 Nb4 10. Qd2 Nbd5 11. O-O-O Nxe3 12. Qxe3 Nd5 13. Nxd5 exd5 14. Nf3 Bg4 15. Be2 Re8 " +
  "16. Kb1 Bf8 17. h4 Bd6 18. h5 g5 19. hxg6 hxg6 20. Rh8+ Kxh8 21. Qh6+ Kg8 22. Ng5 Bxe2 " +
  "23. Qh7+ Kf8 24. Qaxf7#";

/** The hand-made shape reference (`A7`). The oracle; never rewritten to match the output. */
const SAMPLE = readFileSync(`${REPOSITORY}plans/uat/EPIC-006-game-1.pgn`, "utf8");
const sampleMovetext = (SAMPLE.split("\n\n")[1] ?? "").trim();
const GAME_1 = gameOf(sampleMovetext);

/** `ABC-012`'s deterministic LCG game, for a long history with many lines of movetext. */
function deterministicGame(plies: number): GameHistory {
  const history = newGame(START_FEN);
  let seed = 0x2f6e2b1;
  for (let ply = 0; ply < plies; ply++) {
    const moves = legalMoves(history.position);
    if (moves.length === 0) return history;
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    playMove(history, moves[seed % moves.length] as Move);
  }
  return history;
}

const WHITE_GAME = { startedAt: STARTED_AT, difficulty: 3, humanColour: "white" } as const;

/** The file text split where the ruling says it splits: tags, one empty line, movetext. */
const partsOf = (text: string) => {
  const lines = text.split("\n");
  const blank = lines.indexOf("");
  return {
    lines,
    tags: lines.slice(0, blank),
    movetextLines: lines.slice(blank + 1, -1),
    movetext: lines.slice(blank + 1, -1).join(" "),
  };
};

const tagOf = (text: string, name: string): string | undefined =>
  new RegExp(`^\\[${name} "([^"]*)"\\]$`, "m").exec(text)?.[1];

/** The eight chess outcomes, each with the `result` the loop gives it. */
const EIGHT: readonly (readonly [FinalResult, TerminalReason])[] = [
  ["white-wins", "checkmate"],
  ["draw", "stalemate"],
  ["draw", "insufficient-material"],
  ["draw", "fivefold-repetition"],
  ["draw", "seventy-five-move"],
  ["draw", "threefold-repetition"],
  ["draw", "fifty-move"],
  ["black-wins", "resignation"],
];

const TOKEN: Readonly<Record<FinalResult, string>> = {
  "white-wins": "1-0",
  "black-wins": "0-1",
  draw: "1/2-1/2",
};

describe("ABC-203 — pgnStamp", () => {
  it("the stem and the Date tag come from the local getters, zero-padded and ASCII", () => {
    expect(pgnStamp(STARTED_AT)).toEqual({ stem: "skytalix-20261023-140509", date: "2026.10.23" });
    expect(pgnStamp(new Date(2027, 0, 2, 3, 4, 5))).toEqual({
      stem: "skytalix-20270102-030405",
      date: "2027.01.02",
    });
  });
});

describe("ABC-203 — the PGN text (A1, A2, A4–A7)", () => {
  it("A1 — the eight outcomes: Result tag and token per the table, Termination normal", () => {
    // Resignation twice: it follows its own `result`, whichever side resigned.
    for (const [result, reason] of [...EIGHT, ["white-wins", "resignation"] as const]) {
      const text = formatPgn(outcomeOf(result, reason), GAME_1, WHITE_GAME);
      expect(tagOf(text, "Result"), reason).toBe(TOKEN[result]);
      expect(tagOf(text, "Termination"), reason).toBe("normal");
      expect(partsOf(text).movetext.endsWith(`} ${TOKEN[result]}`), reason).toBe(true);
    }
  });

  it('A2 — a fault gives Result "*", Termination "unterminated" and the token *', () => {
    for (const reason of ["engine-failure", "engine-threw"] as const) {
      const text = formatPgn(outcomeOf(null, reason), GAME_1, WHITE_GAME);
      expect(tagOf(text, "Result"), reason).toBe("*");
      expect(tagOf(text, "Termination"), reason).toBe("unterminated");
      expect(partsOf(text).movetext.endsWith("} *"), reason).toBe(true);
    }
  });

  it("A4 — exactly ten tags, in order, then exactly one empty line", () => {
    const text = formatPgn(outcomeOf("black-wins", "checkmate"), GAME_1, {
      startedAt: STARTED_AT,
      difficulty: 5,
      humanColour: "black",
    });
    const { lines, tags } = partsOf(text);
    expect(tags).toEqual([
      '[Event "skytalix CLI game"]',
      '[Site "?"]',
      '[Date "2026.10.23"]',
      '[Round "-"]',
      '[White "skytalix (difficulty 5)"]',
      '[Black "Human"]',
      '[Result "0-1"]',
      '[Termination "normal"]',
      '[Difficulty "5"]',
      '[HumanColour "black"]',
    ]);
    expect(lines[tags.length]).toBe("");
    expect(lines[tags.length + 1]).not.toBe("");
    expect(text).not.toMatch(/\[(SetUp|FEN) /);

    const human = formatPgn(outcomeOf("white-wins", "checkmate"), GAME_1, WHITE_GAME);
    expect(tagOf(human, "White")).toBe("Human");
    expect(tagOf(human, "Black")).toBe("skytalix (difficulty 3)");
    expect(tagOf(human, "Difficulty")).toBe("3");
    expect(tagOf(human, "HumanColour")).toBe("white");
  });

  it("A5 — move numbers before White moves only, from fullmoveNumber; the headline comment; the token", () => {
    const history = gameOf(ROUND_TRIP_GAME);
    const outcome = outcomeOf("white-wins", "checkmate");
    const words = partsOf(formatPgn(outcome, history, WHITE_GAME)).movetext.split(" ");

    // Walk the words against an independent replay: `N.` exactly before each White move.
    const position = parseFen(START_FEN);
    let at = 0;
    for (const move of history.moves) {
      if (!position.blackToMove) expect(words[at++]).toBe(`${position.fullmoveNumber}.`);
      const word = words[at++] as string;
      expect(word).not.toMatch(/^\d+\.$/);
      const parsed = parseSan(position, word);
      if (parsed.outcome !== "move") throw new Error(`${word}: ${parsed.outcome}`);
      expect(parsed.move).toEqual(move);
      makeMove(position, move as Move);
    }
    expect(words.slice(at).join(" ")).toBe(
      `{${resultHeadline(outcome, "checkmate").join(" ")}} 1-0`,
    );
    expect(words.slice(at).join(" ")).toBe("{White wins by checkmate.} 1-0");

    const fault = outcomeOf(null, "engine-threw");
    const faulted = partsOf(formatPgn(fault, history, WHITE_GAME)).movetext;
    expect(faulted.endsWith(`{${resultHeadline(fault, "engine-threw").join(" ")}} *`)).toBe(true);
    expect(resultHeadline(fault, "engine-threw")).toHaveLength(2);
  });

  it("A5 — lines wrap before a word that would pass 79 characters; single spaces; LF only; one final LF; printable ASCII", () => {
    const histories = [GAME_1, gameOf(ROUND_TRIP_GAME), deterministicGame(300)];
    const outcomes = [outcomeOf("black-wins", "checkmate"), outcomeOf(null, "engine-failure")];
    let lines = 0;
    for (const history of histories) {
      for (const outcome of outcomes) {
        const text = formatPgn(outcome, history, WHITE_GAME);
        expect(text.endsWith("\n")).toBe(true);
        expect(text.endsWith("\n\n")).toBe(false);
        expect(text).not.toContain("\r");
        expect([...text].every((c) => c === "\n" || (c >= " " && c <= "~"))).toBe(true);
        const { movetextLines } = partsOf(text);
        for (const [index, line] of movetextLines.entries()) {
          lines++;
          expect(line.length, line).toBeLessThanOrEqual(79);
          expect(line, "spacing").toMatch(/^\S+( \S+)*$/);
          // GREEDY: the next line's first word would not have fitted on this one.
          const next = movetextLines[index + 1];
          if (next !== undefined)
            expect(line.length + 1 + (next.split(" ")[0] as string).length).toBeGreaterThan(79);
        }
      }
    }
    expect(lines, "non-vacuity: many movetext lines were read").toBeGreaterThan(20);
  });

  it("A6 — round trip: every SAN word resolves to one legal move, the moves equal the history, the final FEN equals", () => {
    const history = gameOf(ROUND_TRIP_GAME);
    expect(history.moves.length).toBeGreaterThanOrEqual(40);
    const text = formatPgn(outcomeOf("white-wins", "checkmate"), history, WHITE_GAME);
    // The Given's features are in the movetext the formatter wrote, not only in the fixture.
    const { movetext } = partsOf(text);
    for (const feature of ["O-O ", "O-O-O", "hxg6", "=Q", "+", "#"])
      expect(movetext).toContain(feature);

    const replay = newGame(START_FEN);
    for (const word of sanWordsOf(movetext)) {
      const parsed = parseSan(replay.position, word);
      expect(parsed.outcome, word).toBe("move");
      if (parsed.outcome === "move") playMove(replay, parsed.move);
    }
    expect(replay.moves).toEqual(history.moves);
    expect(toFen(replay.position)).toBe(toFen(history.position));
  });

  it("A7 — game 1 matches the hand-made sample: movetext, comment and tags", () => {
    expect(GAME_1.moves).toHaveLength(70);
    const text = formatPgn(outcomeOf("black-wins", "checkmate"), GAME_1, {
      startedAt: STARTED_AT,
      difficulty: 5,
      humanColour: "black",
    });
    const { movetext } = partsOf(text);
    const normalised = (value: string) =>
      value
        .replace(/\{[^}]*\}/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .join(" ");
    expect(normalised(movetext)).toBe(normalised(sampleMovetext));
    expect(movetext.match(/\{[^}]*\}/g)).toEqual(["{Black wins by checkmate.}"]);
    for (const [name, value] of [
      ["White", "skytalix (difficulty 5)"],
      ["Black", "Human"],
      ["Result", "0-1"],
      ["Termination", "normal"],
      ["Difficulty", "5"],
      ["HumanColour", "black"],
      ["Date", "2026.10.23"],
    ] as const) {
      expect(tagOf(text, name), name).toBe(value);
    }
  });
});

describe("ABC-203 — the writer, from one spawned child (A8–A10)", () => {
  const HOLDER = new URL("pgn-file.ts", import.meta.url).href;
  const directory = mkdtempSync(join(tmpdir(), "abc203-writer-"));
  afterAll(() => rmSync(directory, { recursive: true, force: true }));

  // The script: each case in its own subdirectory; every pre-existing file gets an old mtime so a
  // rewrite cannot hide inside the same second. `snapshot` reads names, bytes and mtimes.
  const SCRIPT = `
import { chmodSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, utimesSync, writeFileSync } from "node:fs";
const { writePgnFile } = await import(${JSON.stringify(HOLDER)});
const at = new Date(2026, 9, 23, 14, 5, 9);
const STEM = "skytalix-20261023-140509";
const TEXT = "[Event \\"x\\"]\\n\\n1. e4 *\\n";
const OLD = new Date(2001, 0, 1);
const snapshot = () =>
  existsSync("games") && statSync("games").isDirectory()
    ? Object.fromEntries(readdirSync("games").sort().map((f) => [f, { bytes: readFileSync("games/" + f, "utf8"), mtimeMs: statSync("games/" + f).mtimeMs }]))
    : null;
const seed = (names) => {
  mkdirSync("games");
  for (const name of names) { writeFileSync("games/" + name, "old " + name); utimesSync("games/" + name, OLD, OLD); }
};
const out = {};
const run = (name, setup, teardown) => {
  mkdirSync(name);
  process.chdir(name);
  setup();
  const before = snapshot();
  const result = writePgnFile(at, TEXT);
  out[name] = { before, result, after: snapshot(), gamesIsFile: existsSync("games") && statSync("games").isFile() };
  if (teardown) teardown();
  process.chdir("..");
};
run("fresh", () => {});
run("one", () => seed([STEM + ".pgn"]));
run("two", () => seed([STEM + ".pgn", STEM + "-2.pgn"]));
run("all", () => seed([STEM + ".pgn", ...Array.from({ length: 98 }, (_, i) => STEM + "-" + (i + 2) + ".pgn")]));
run("gamesFile", () => writeFileSync("games", "x"));
run("readOnly", () => { mkdirSync("games"); chmodSync("games", 0o555); }, () => chmodSync("games", 0o755));
process.stdout.write(JSON.stringify({ out, text: TEXT, uid: process.getuid() }) + "\\n");
`;

  const child = spawnSync(process.execPath, ["--input-type=module", "-e", SCRIPT], {
    cwd: directory,
    encoding: "utf8",
    env: {},
    timeout: 30_000,
  });
  if (child.error !== undefined)
    throw new Error(`the writer child failed to start: ${child.error}`);

  type Snapshot = Record<string, { bytes: string; mtimeMs: number }> | null;
  interface Case {
    before: Snapshot;
    result: { ok: true; path: string } | { ok: false; code: string };
    after: Snapshot;
    gamesIsFile: boolean;
  }
  const report = (): { out: Record<string, Case>; text: string; uid: number } => {
    expect(child.status, child.stderr).toBe(0);
    expect(child.stderr).toBe("");
    return JSON.parse(child.stdout);
  };
  const STEM = "skytalix-20261023-140509";

  it("A8 — no games/ before: games/ is created and holds exactly the one new file, named from the stamp, with the text's bytes", () => {
    const { out, text } = report();
    expect(out.fresh?.before).toBeNull();
    expect(out.fresh?.result).toEqual({ ok: true, path: `games/${STEM}.pgn` });
    expect(Object.keys(out.fresh?.after ?? {})).toEqual([`${STEM}.pgn`]);
    expect(out.fresh?.after?.[`${STEM}.pgn`]?.bytes).toBe(text);
  });

  it("A8 — the repository ignores games/", () => {
    expect(readFileSync(`${REPOSITORY}.gitignore`, "utf8").split("\n")).toContain("games/");
  });

  it("A9 — never overwrite: -2, then -3; every pre-existing file keeps its bytes and its mtime", () => {
    const { out } = report();
    for (const [name, written] of [
      ["one", `${STEM}-2.pgn`],
      ["two", `${STEM}-3.pgn`],
    ] as const) {
      const run = out[name] as Case;
      expect(run.result, name).toEqual({ ok: true, path: `games/${written}` });
      const before = run.before ?? {};
      const after = run.after ?? {};
      expect(Object.keys(after).sort(), name).toEqual([...Object.keys(before), written].sort());
      for (const [file, entry] of Object.entries(before))
        expect(after[file], `${name} ${file}`).toEqual(entry);
    }
  });

  it("A9 — all 99 names taken: EEXIST, no new file, nothing modified", () => {
    const { out } = report();
    const all = out.all as Case;
    expect(Object.keys(all.before ?? {})).toHaveLength(99);
    expect(all.result).toEqual({ ok: false, code: "EEXIST" });
    expect(all.after).toEqual(all.before);
  });

  it("A10 — games is a regular file, and separately a 0555 games/: an errno code, 0 new files", () => {
    const { out, uid } = report();
    const gamesFile = out.gamesFile as Case;
    expect(gamesFile.result.ok).toBe(false);
    expect(gamesFile.gamesIsFile).toBe(true);
    expect(gamesFile.after).toBeNull();
    // Non-root, as the criterion says: root writes through a 0555 directory.
    expect(uid).not.toBe(0);
    const readOnly = out.readOnly as Case;
    expect(readOnly.result).toEqual({ ok: false, code: "EACCES" });
    expect(readOnly.after).toEqual({});
    for (const run of [gamesFile, readOnly]) {
      if (run.result.ok) throw new Error("the write succeeded");
      expect(`PGN not saved: ${run.result.code}`).toMatch(/^PGN not saved: E[A-Z0-9]+$/);
    }
  });
});

describe("ABC-203 — the wiring in src/cli.ts (A10, A11, A12)", () => {
  const entry = readFileSync(`${SOURCE_DIRECTORY}cli.ts`, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");
  const indexOf = (needle: string): number => {
    const at = entry.indexOf(needle);
    if (at < 0) throw new Error(`\`${needle}\` is not in src/cli.ts`);
    return at;
  };

  it("A12 — one clock reading before the loop; the PGN is built and written only after the result screen", () => {
    expect(entry.match(/new Date\(/g)).toHaveLength(1);
    expect(entry.match(/\bwritePgnFile\(/g)).toHaveLength(1);
    expect(entry.match(/\bformatPgn\(/g)).toHaveLength(1);
    expect(indexOf("new Date(")).toBeLessThan(indexOf("runTurnLoop("));
    expect(indexOf("renderResultScreen(")).toBeGreaterThan(indexOf("runTurnLoop("));
    expect(indexOf("formatPgn(")).toBeGreaterThan(indexOf("renderResultScreen("));
    expect(indexOf("writePgnFile(")).toBeGreaterThan(indexOf("renderResultScreen("));
    // Gated on a non-null reason: quit and end of input write nothing (`A3`).
    expect(entry.slice(indexOf("renderResultScreen("), indexOf("writePgnFile("))).toMatch(
      /if \(outcome\.reason !== null\)/,
    );
  });

  it("A10/A11 — the saved line goes to stdout, the failure line to stderr carrying only the code", () => {
    expect(entry).toMatch(/sink\.write\(`PGN saved: \$\{saved\.path\}\\n`\)/);
    expect(entry).toMatch(/process\.stderr\.write\(`PGN not saved: \$\{saved\.code\}\\n`\)/);
  });
});
