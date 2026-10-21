/**
 * `ABC-119` (`G-06`, with the hyphen) — the one lane that spawns the DELIVERED CLI and lets the REAL
 * `src/engine.ts` search choose a move. Every engine turn in `src/cli.test.ts` runs on a double
 * (`DEFAULT_BUDGET_MS = 0`), and its wiring row reads the entry point's SOURCE; `ENGINE_DEEP` runs
 * the search in-process. Neither runs the composition. This lane does.
 *
 * OPT-IN: `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`. One real ply costs ~3.1 s of wall
 * and ~3 s of CPU per child, so it is priced OUT of the default lane (the page's arithmetic).
 *
 * TWO MEASURED TRAPS, both binding (the page's construction constraints):
 *   1. `describe.runIf` / `it.skipIf` REPORT A SKIP and move the gate's skip count off 0. The deep
 *      cases are therefore NOT DEFINED when the variable is unset — `if (RUN_DEEP) { describe }`,
 *      the `src/engine.test.ts` form.
 *   2. A file that registers nothing fails the default lane (`No test suite found`). So this file
 *      always defines one default-lane test. It spawns nothing, and it can fail.
 *
 * WHY IT IS NOT IN `src/cli.test.ts`: that file pins its child count (`N8_SPAWN`) and holds exactly
 * one `spawnSync` call site; no real-engine child fits inside either pin (BA/PM's placement ruling).
 * This file brings its own spawn and follows that file's discipline by reading it, not importing it:
 * argument-array form, no shell, a fixed argv, a fixed stdin script, a `timeout`, and a loud throw on
 * `child.error`. The child gets an EMPTY environment, so nothing outside this file — no secret, and
 * no `NODE_OPTIONS=--import=…` that would slip a double in — reaches it. ONE TOKEN CROSSES, and it
 * goes in argv, not the environment (`ABC-173`, `ADR-0008` § ADDENDUM 2026-10-19 Ruling 3): the
 * last `--max-old-space-size=<digits>` in this worker's own `NODE_OPTIONS`, the lane's heap ceiling,
 * put BEFORE the entry point (after it, the product would read it as its own argument). Only that
 * token; `NODE_OPTIONS` itself never reaches the child, and with no token in it this file throws.
 *
 * `A3`: NO ASSERTION NAMES A MOVE, A SCORE, A DEPTH OR A NODE COUNT. The opponent is
 * non-deterministic; every assertion is on a property the real search cannot legally violate. The
 * reply is checked against the project's own move generator, never against a literal.
 *
 * `ABC-095` PUT THE OPENING BOOK IN FRONT OF THE ENGINE, and the start position is always in book, so
 * a child run from the repository only ever meets the book (`A1`'s floor caught it: ~200 ms). This
 * lane's children therefore run from a BOOK-ABSENT COPY OF THE TREE (`ADR-0037` § Addendum R2,
 * `ABC-119` § Amendment — 2026-10-12, `ABC-095` test note 4, S3 item 7):
 *   - made under `mkdtemp(os.tmpdir() …)`, and removed by a recursive `rmSync` of EXACTLY the path
 *     `mkdtemp` returned — never a joined or computed path, never the repository;
 *   - A REAL COPY: no entry under its `src/` is a symbolic link (`lstat`). Node resolves
 *     `import.meta.url` to the real path, so a linked `src/` would read the REPOSITORY's book, and a
 *     byte comparison reads through a link and cannot see it;
 *   - its `src/` (and the `package.json` that makes `src/` ESM) byte-identical to the repository's,
 *     asserted before any spawn;
 *   - `data/opening-book/book.json` absent. The product handles that itself: one warning, then the
 *     search. The warning on stderr is the LEAK DETECTOR (`A3`(iv)): if it is missing, the child read
 *     a book.
 * No hook, no `--import` and no double: the bytes are the delivered ones. The book-PRESENT real
 * session is `ABC-095` `A7`'s row, which runs the repository's own entry point FROM A NEUTRAL
 * WORKING DIRECTORY (`ABC-162`, closing `AR-095-CWD`): a fresh `mkdtemp` directory, removed by its
 * exact path, that holds a DECOY at `data/opening-book/book.json` — bytes that are not UTF-8 JSON and
 * not the delivered book (`ABC-180`, closing `AR-162-FALLBACK`). Only a read resolved from the
 * module's own URL finds the book. A build that read the book relative to the working directory —
 * first, only, or as a fallback — would read the decoy, warn, and red `A7` on stderr. Every other
 * child keeps its tree root as cwd.
 */

import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  cpSync,
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { makeMove } from "./apply.ts";
import { createBookProbe } from "./book.ts";
import { HARD_CEILING_MS } from "./engine.ts";
import { parseFen, toFen } from "./fen.ts";
import { legalMoves } from "./legal.ts";
import { PROMPT } from "./line-input.ts";
import { squareName } from "./position.ts";
import { rejectionMessage } from "./rejection.ts";
import { toSan } from "./san.ts";
import { INPUT_ENDED_NOTICE, QUIT_NOTICE } from "./turn-loop.ts";
import { zobristKey } from "./zobrist.ts";

const RUN_DEEP = process.env.CLI_DEEP === "1";

const REPOSITORY = new URL("..", import.meta.url).pathname;
const ENTRY_POINT = new URL("cli.ts", import.meta.url).pathname;

/** The position `src/cli.ts` starts every game from — the same literal it holds. */
const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/** The artifact, relative to a tree root: present in the repository, absent from the copy. */
const BOOK_PATH = "data/opening-book/book.json";
/** What the copy carries, each byte-identical: the delivered `src/`, and what makes it ESM. */
const COPIED_DIRECTORY = "src";
const COPIED_FILE = "package.json";

/**
 * The deep child's arguments after the entry point, fixed. `--colour black` hands the first move to
 * the engine; `--ascii` fixes the glyph mode so no environment is consulted. No `--import`, no hook,
 * no double. The entry point is the BOOK-ABSENT COPY's `src/cli.ts` (see the header).
 */
const CHILD_ARGS: readonly string[] = ["--colour", "black", "--ascii"];
const CHILD_ENV: Readonly<Record<string, string>> = {};

/** `ABC-173`: the row `tools/grugops/heap-guard.js` provides to every worker (`project.provide`). */
declare module "vitest" {
  interface ProvidedContext {
    heapRowMiB: number;
  }
}

/**
 * `ABC-173` — the lane's heap ceiling as ONE node option for a child whose environment is empty:
 * the LAST `--max-old-space-size=<digits>` token in this worker's own `NODE_OPTIONS`, which is the
 * lane's value as vitest copies it into the worker. The parent's value and not a literal, so the
 * child carries exactly its parent's row in either shape. Absent, it throws: a child of this lane
 * never runs at Node's default heap.
 */
const heapToken = (): string => {
  const tokens = (process.env.NODE_OPTIONS ?? "").match(
    /(?:^|\s)(--max-old-space-size=\d+)(?=\s|$)/g,
  );
  const last = tokens?.at(-1)?.trim();
  if (last === undefined)
    throw new Error(
      "no --max-old-space-size=<digits> in NODE_OPTIONS: run this lane as AGENTS.md spells it (ABC-173)",
    );
  return last;
};

/** Every child of this file starts `node <heapToken> …`: the one argv construction, both callers. */
const nodeArgv = (rest: readonly string[]): string[] => [heapToken(), ...rest];

/**
 * A new temporary directory holding the book-absent copy. The caller removes EXACTLY the returned
 * path with `removeCopy`, and nothing else.
 */
const makeBookAbsentCopy = (): string => {
  const root = mkdtempSync(join(tmpdir(), "abc095-book-absent-"));
  cpSync(join(REPOSITORY, COPIED_DIRECTORY), join(root, COPIED_DIRECTORY), { recursive: true });
  copyFileSync(join(REPOSITORY, COPIED_FILE), join(root, COPIED_FILE));
  return root;
};

/**
 * The only removal in this file: the path `mkdtemp` returned, passed through untouched. It removes
 * the book-absent copies and `A7`'s neutral working directory (`ABC-162`).
 */
const removeCopy = (root: string): void => rmSync(root, { recursive: true, force: true });

const entryPointIn = (root: string): string => join(root, COPIED_DIRECTORY, "cli.ts");

/**
 * The copy's properties, asserted BEFORE any child runs from it. Every entry under the copy's `src/`
 * is checked with `lstat`: none is a symbolic link, and every one that is not a directory is a
 * regular file (`src/` holds one directory, `__snapshots__`). The entry lists match, and every file
 * is byte-identical to the repository's. The book is present in the repository and absent here.
 */
const expectBookAbsentCopy = (root: string): void => {
  const listing = (base: string): string[] =>
    (readdirSync(join(base, COPIED_DIRECTORY), { recursive: true }) as string[]).sort();
  const entries = listing(REPOSITORY);
  expect(entries, "the repository's src/ listing").toContain("cli.ts");
  expect(listing(root), "the copy's src/ listing").toEqual(entries);

  expect(lstatSync(join(root, COPIED_DIRECTORY)).isDirectory(), "the copy's src/ itself").toBe(
    true,
  );
  for (const entry of entries) {
    const copied = lstatSync(join(root, COPIED_DIRECTORY, entry));
    expect(copied.isSymbolicLink(), `src/${entry} is a symbolic link`).toBe(false);
    if (copied.isDirectory()) continue;
    expect(copied.isFile(), `src/${entry} is not a regular file`).toBe(true);
    const original = readFileSync(join(REPOSITORY, COPIED_DIRECTORY, entry));
    expect(
      readFileSync(join(root, COPIED_DIRECTORY, entry)).equals(original),
      `src/${entry} is not byte-identical`,
    ).toBe(true);
  }
  const manifest = lstatSync(join(root, COPIED_FILE));
  expect(
    manifest.isFile() && !manifest.isSymbolicLink(),
    `${COPIED_FILE} is not a regular file`,
  ).toBe(true);
  expect(
    readFileSync(join(root, COPIED_FILE)).equals(readFileSync(join(REPOSITORY, COPIED_FILE))),
  ).toBe(true);

  expect(existsSync(join(REPOSITORY, BOOK_PATH)), "the repository's book").toBe(true);
  expect(existsSync(join(root, BOOK_PATH)), "the copy's book").toBe(false);
};

/**
 * The probe's one warning for an unreadable artifact, DERIVED from the merged probe rather than
 * transcribed: a probe whose `read` throws, asked once, hands its `warn` exactly this line. The
 * delivered root writes it to stderr with one newline (`ABC-095` `A7`).
 */
const BOOK_ABSENT_WARNING = ((): string => {
  const seen: string[] = [];
  createBookProbe({
    read: () => {
      throw new Error("absent");
    },
    warn: (line) => seen.push(line),
    random: () => 0,
  }).bookMove(parseFen(START_FEN));
  if (seen.length !== 1) throw new Error(`the probe warned ${seen.length} times, not once`);
  return seen[0] as string;
})();

const occurrencesOf = (text: string, needle: string): number => text.split(needle).length - 1;

/**
 * A HANG GUARD, NOT A CRITERION. Four times `A3`(ii)'s ceiling, so a slow child is a red ROW on
 * `HARD_CEILING_MS` and only a child that never returns reaches this.
 */
const HANG_GUARD_MS = 4 * HARD_CEILING_MS;

/** `A1`'s floor: a reply faster than this means a double or a budget-less engine leaked in. */
const REAL_SEARCH_FLOOR_MS = 1_000;

interface RealChild {
  readonly status: number | null;
  readonly signal: NodeJS.Signals | null;
  readonly stdout: string;
  readonly stderr: string;
  /** Spawn to exit, measured around the blocking call — an upper bound on the engine's reply. */
  readonly wallMs: number;
  /** The `cwd` argument handed to `spawnSync`, verbatim: not a `realpath`, not read from the child. */
  readonly cwd: string;
}

/** The entry point under `root`, run with `cwd` as its working directory (the tree root unless named). */
const spawnReal = (
  root: string,
  script: string,
  args: readonly string[] = CHILD_ARGS,
  cwd: string = root,
): RealChild => spawnNode(cwd, [entryPointIn(root), ...args], script);

/** The file's one spawn: `node` with `nodeArgv(rest)`, `CHILD_ENV`, a fixed stdin, a bound. */
const spawnNode = (cwd: string, rest: readonly string[], script: string): RealChild => {
  const argv = nodeArgv(rest);
  const started = performance.now();
  const child = spawnSync(process.execPath, argv, {
    cwd,
    encoding: "utf8",
    env: CHILD_ENV,
    input: script,
    stdio: ["pipe", "pipe", "pipe"],
    timeout: HANG_GUARD_MS,
  });
  const wallMs = performance.now() - started;
  if (child.error !== undefined)
    throw new Error(`child ${process.execPath} ${argv.join(" ")} failed: ${child.error}`);
  // `A1`'s record: the command verbatim and the measured wall, on every run of this lane.
  console.log(
    `[CLI_DEEP] (cwd ${cwd}) ${process.execPath} ${argv.join(" ")} <<< ${JSON.stringify(script)} — ` +
      `wall ${wallMs.toFixed(0)} ms, exit ${child.status}, signal ${child.signal}`,
  );
  return {
    status: child.status,
    signal: child.signal,
    stdout: child.stdout,
    stderr: child.stderr,
    wallMs,
    cwd,
  };
};

interface Frame {
  readonly side: "White" | "Black";
  /** Half-moves played before this frame, read off the status row's `N.` / `N...`. */
  readonly ply: number;
  /** The printed board as a FEN placement field, whatever the orientation. */
  readonly placement: string;
  /** The SAN on the `last:` row, when there is one. */
  readonly last: string | undefined;
  readonly text: string;
}

/**
 * Every frame on the child's stdout, located by its status row (`White to move  1.`). The eight rank
 * rows and the file-label row above it are read back into a placement, so the board is compared with
 * the generator's position rather than with a picture.
 */
const framesOf = (stdout: string): Frame[] => {
  const lines = stdout.split("\n").map((line) => line.replace(/^> /, ""));
  const starts: number[] = [];
  const found: Omit<Frame, "text">[] = [];
  lines.forEach((line, at) => {
    const status = /^(White|Black) to move\s+(\d+)\.(\.\.)?(?:\s|$)/.exec(line);
    if (status === null) return;
    const files = (lines[at - 1] ?? "").trim().split(/\s+/);
    const squares = new Map<string, string>();
    for (const row of lines.slice(at - 9, at - 1)) {
      const rank = /^([1-8]) (.{16})/.exec(row);
      if (rank === null) throw new Error(`not a rank row above a status row: ${row}`);
      for (let file = 0; file < 8; file++) {
        const piece = (rank[2] as string)[2 * file + 1] as string;
        if (/[pnbrqk]/i.test(piece)) squares.set(`${files[file]}${rank[1]}`, piece);
      }
    }
    let placement = "";
    for (let rank = 8; rank >= 1; rank--) {
      let empty = 0;
      for (const file of "abcdefgh") {
        const piece = squares.get(`${file}${rank}`);
        if (piece === undefined) empty++;
        else {
          placement += `${empty > 0 ? empty : ""}${piece}`;
          empty = 0;
        }
      }
      placement += `${empty > 0 ? empty : ""}${rank > 1 ? "/" : ""}`;
    }
    starts.push(at - 9);
    found.push({
      side: status[1] as "White" | "Black",
      ply: 2 * (Number(status[2]) - 1) + (status[3] === undefined ? 0 : 1),
      placement,
      last: /last: (\S+)/.exec(lines[at + 1] ?? "")?.[1],
    });
  });
  return found.map((frame, index) => ({
    ...frame,
    text: lines.slice(starts[index], starts[index + 1]).join("\n"),
  }));
};

const placementOf = (fen: string): string => fen.split(" ")[0] as string;

describe("ABC-119 — the real-engine lane's child is the delivered composition (default lane; spawns nothing)", () => {
  it("the deep child runs the delivered entry point with no --import, loader or hook, and an empty environment", () => {
    // AMENDED 2026-10-12, delivered by `ABC-095` (`ABC-119` § Amendment): the entry path moved to
    // the book-absent copy, and the copy's checks joined this row. It writes under `os.tmpdir()`
    // only, removes exactly what it made, and still spawns nothing.
    expect(lstatSync(ENTRY_POINT).isFile()).toBe(true);
    const root = makeBookAbsentCopy();
    try {
      expectBookAbsentCopy(root);
      expect(entryPointIn(root)).toBe(join(root, "src", "cli.ts"));
      expect(lstatSync(entryPointIn(root)).isFile()).toBe(true);
    } finally {
      removeCopy(root);
    }
    expect(existsSync(root), "the copy outlived its row").toBe(false);
    expect(CHILD_ARGS.filter((arg) => /import|loader|require|hook|conditions/.test(arg))).toEqual(
      [],
    );
    expect(Object.keys(CHILD_ENV)).toEqual([]);
  });
});

if (RUN_DEEP) {
  /** ONE book-absent copy for every deep child that needs one (`ABC-119`'s and `ABC-095` `A5`'s). */
  let copy: string;

  beforeAll(() => {
    copy = makeBookAbsentCopy();
    expectBookAbsentCopy(copy);
  });

  afterAll(() => {
    if (copy !== undefined) removeCopy(copy);
  });

  describe("ABC-119 — CLI_DEEP: the delivered CLI against the REAL engine", () => {
    /** Empty stdin: the engine plays its ply, the prompt reads end of input, the session ends. */
    let played: RealChild;
    /** One unreadable line after the engine's ply: the `ABC-019` rejection cadence, for real. */
    let rejected: RealChild;
    const UNREADABLE = "zz9";

    beforeAll(() => {
      played = spawnReal(copy, "");
      rejected = spawnReal(copy, `${UNREADABLE}\n`);
    }, 4 * HANG_GUARD_MS);

    it("A1 — the real search answered: the child took at least 1 s and exited 0", () => {
      for (const child of [played, rejected]) {
        expect(child.wallMs).toBeGreaterThanOrEqual(REAL_SEARCH_FLOOR_MS);
        expect(child.status).toBe(0);
        expect(child.signal).toBeNull();
      }
    });

    it("A3(i) — the reply is a legal move in the position it was played in, by the project's own generator", () => {
      const frames = framesOf(played.stdout);
      expect(frames).toHaveLength(2);
      const [before, after] = frames as [Frame, Frame];

      const position = parseFen(START_FEN);
      expect(before.placement).toBe(placementOf(START_FEN));
      const legal = legalMoves(position);
      const replies = legal.filter((move) => toSan(position, move, legal) === after.last);
      expect(replies).toHaveLength(1);

      makeMove(position, replies[0] as (typeof legal)[number]);
      expect(after.placement).toBe(placementOf(toFen(position)));
    });

    it("A3(ii) — the whole child, spawn to exit, stays inside NFR-004's 5 s hard ceiling (clause B)", () => {
      expect(played.wallMs).toBeLessThanOrEqual(HARD_CEILING_MS);
    });

    it("A3(iii) — the session advances: the side to move and the ply number both change", () => {
      const [before, after] = framesOf(played.stdout) as [Frame, Frame];
      expect(after.side).not.toBe(before.side);
      expect(after.ply).toBe(before.ply + 1);
    });

    it("A3(iv) — no stack trace on stderr, and the exit code is 0, never 70", () => {
      expect(played.stderr).not.toMatch(/^\s*at\s|Error\b/m);
      expect(played.status).toBe(0);
      // AMENDED 2026-10-12, delivered by `ABC-095`: THE LEAK DETECTOR. The book-absent warning is
      // asserted PRESENT, exactly once. Missing, it means the child read a book.
      expect(occurrencesOf(played.stderr, BOOK_ABSENT_WARNING), "book-absent warnings").toBe(1);
    });

    it("A4 — an unreadable line against the real engine does not advance, carries a message, and the session continues", () => {
      const frames = framesOf(rejected.stdout);
      expect(frames).toHaveLength(3);
      const [, replied, refused] = frames as [Frame, Frame, Frame];

      expect(refused.side).toBe(replied.side);
      expect(refused.ply).toBe(replied.ply);
      expect(refused.placement).toBe(replied.placement);

      const message = rejectionMessage({ reason: "unreadable" });
      expect(replied.text).not.toContain(message);
      expect(refused.text).toContain(message);

      // It continued: it went back to the prompt, and the session ended on END OF INPUT, not on
      // the rejection.
      expect(refused.text.trimEnd().endsWith(INPUT_ENDED_NOTICE)).toBe(true);
      expect(rejected.status).toBe(0);
      expect(rejected.stderr).not.toMatch(/^\s*at\s|Error\b/m);
    });
  });

  describe("ABC-095 — CLI_DEEP: the book in a real session", () => {
    /** `A5`'s stream half: the book-absent copy, the engine's ply, then `quit` twice. */
    let bookless: RealChild;
    /**
     * `A7`: the REPOSITORY's entry point, book present; the human plays `e2e4`, then input ends. It
     * runs from `neutral`, not from the tree root (`ABC-162`).
     */
    let booked: RealChild;
    /**
     * `A7`'s working directory: a fresh `mkdtemp` directory, removed by its exact path, holding a
     * decoy book file that is not the delivered book (`ABC-180`).
     */
    let neutral: string;
    /**
     * `ABC-183`: whether the decoy existed on the line before `booked` spawned. A7's own decoy checks
     * run after the child has ended, so only this capture sees the order (`AR-162-FALLBACK`).
     */
    let decoyBeforeBooked: boolean;
    const QUIT_TWICE = `${QUIT_NOTICE}\n${QUIT_NOTICE}\n`;
    const OPENING = "e2e4";

    beforeAll(() => {
      neutral = mkdtempSync(join(tmpdir(), "abc162-neutral-cwd-"));
      // `ABC-180`: the decoy. Not UTF-8 JSON, so any read of it is refused with one fixed warning.
      // `ABC-183`: this write MUST come before the `booked` spawn, or a cwd-first read finds nothing.
      mkdirSync(dirname(join(neutral, BOOK_PATH)), { recursive: true });
      writeFileSync(join(neutral, BOOK_PATH), "ABC-180 decoy: not an opening book\n");
      bookless = spawnReal(copy, QUIT_TWICE);
      decoyBeforeBooked = existsSync(join(neutral, BOOK_PATH));
      booked = spawnReal(REPOSITORY, `${OPENING}\n`, ["--colour", "white", "--ascii"], neutral);
    }, 4 * HANG_GUARD_MS);

    afterAll(() => {
      if (neutral !== undefined) removeCopy(neutral);
    });

    it("A5 (stream half) — the one warning goes to stderr exactly once, 0 bytes of it to stdout, and the child exits 0 on quit", () => {
      // NON-VACUITY: the engine reached its ply (the probe is asked only then), and the session
      // ended on `quit`, not on end of input.
      const frames = framesOf(bookless.stdout);
      expect(frames.length, "frames before quit").toBeGreaterThanOrEqual(2);
      expect(bookless.stdout.trimEnd().endsWith(QUIT_NOTICE)).toBe(true);
      expect(bookless.stdout.trimEnd().endsWith(INPUT_ENDED_NOTICE)).toBe(false);

      expect(occurrencesOf(bookless.stderr, BOOK_ABSENT_WARNING), "warnings on stderr").toBe(1);
      expect(bookless.stderr).toBe(`${BOOK_ABSENT_WARNING}\n`);
      expect(occurrencesOf(bookless.stdout, BOOK_ABSENT_WARNING), "warnings on stdout").toBe(0);
      expect(bookless.status).toBe(0);
      expect(bookless.signal).toBeNull();
    });

    it("A7 — a real session consults the book: the reply to 1. e4 is one of the book's entries for that position", () => {
      // NON-VACUITY: this child runs the repository's own tree, where the book IS present.
      expect(existsSync(join(REPOSITORY, BOOK_PATH))).toBe(true);
      // `ABC-162`, `ABC-180`: from a working directory that is not the tree root and holds a decoy
      // book file that is not the delivered book, so only a read resolved from the module's own URL
      // finds the book (`AR-095-CWD`, `AR-162-FALLBACK`).
      expect(join(neutral, "/"), "A7's working directory").not.toBe(join(REPOSITORY, "/"));
      expect(
        booked.cwd,
        "AR-183-CWDARG: the booked child must spawn from neutral, or the detector runs from the tree root and is disarmed",
      ).toBe(neutral);
      const decoy = join(neutral, BOOK_PATH);
      expect(existsSync(decoy), "the decoy in A7's working directory").toBe(true);
      expect(
        decoyBeforeBooked,
        "AR-162-FALLBACK: the decoy must exist before the booked child spawns, or the detector is disarmed",
      ).toBe(true);
      // Keeps the decoy from becoming a book: a valid book would read silently (`ABC-180`).
      expect(
        () => JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(readFileSync(decoy))),
        "the decoy parses as UTF-8 JSON",
      ).toThrow();
      expect(
        readFileSync(decoy).equals(readFileSync(join(REPOSITORY, BOOK_PATH))),
        "the decoy is the delivered book",
      ).toBe(false);
      const frames = framesOf(booked.stdout);
      expect(frames).toHaveLength(3);
      const [, afterHuman, afterEngine] = frames as [Frame, Frame, Frame];

      const position = parseFen(START_FEN);
      const opening = legalMoves(position).find(
        (move) => squareName(move.from) + squareName(move.to) === OPENING,
      );
      if (opening === undefined) throw new Error(`${OPENING} is not legal at the start`);
      makeMove(position, opening);
      expect(afterHuman.placement).toBe(placementOf(toFen(position)));

      // The book's entries for the position after 1. e4, read off the artifact by the probe's own
      // key (16 lowercase hex digits of `zobristKey`, `ADR-0037` D1), never transcribed.
      const artifact = JSON.parse(readFileSync(join(REPOSITORY, BOOK_PATH), "utf8")) as {
        positions: Record<string, { m: [string, number][] }>;
      };
      const key = zobristKey(position).toString(16).padStart(16, "0");
      const entries = (artifact.positions[key]?.m ?? []).map(([uci]) => uci);
      expect(entries.length, "book entries after 1. e4").toBeGreaterThan(0);

      const legal = legalMoves(position);
      const replies = legal.filter((move) => toSan(position, move, legal) === afterEngine.last);
      expect(replies).toHaveLength(1);
      const reply = replies[0] as (typeof legal)[number];
      expect(entries).toContain(`${squareName(reply.from)}${squareName(reply.to)}`);

      // The book was read: no warning, nothing on stderr, a normal end.
      // THE AR-095-CWD / AR-162-FALLBACK DETECTOR: a cwd read meets the decoy and warns here.
      expect(
        booked.stderr,
        "AR-095-CWD / AR-162-FALLBACK detector: stderr must be empty, or the book was read from the working directory",
      ).toBe("");
      expect(booked.status).toBe(0);
    });
  });

  describe("ABC-101 — CLI_DEEP: the chosen level plays a real session", () => {
    /**
     * `A10`: `EPIC-006` criterion 4's command line at level 1, from the BOOK-ABSENT copy, so the
     * engine's opening ply is the LEVEL's and not the book's. The human quits twice. No timing here.
     */
    let levelled: RealChild;
    const QUIT_TWICE = `${QUIT_NOTICE}\n${QUIT_NOTICE}\n`;

    beforeAll(() => {
      levelled = spawnReal(copy, QUIT_TWICE, ["--colour", "black", "--difficulty", "1", "--ascii"]);
    }, 4 * HANG_GUARD_MS);

    it("A10 — no prompt before the engine opens as white with a legal move, and the child exits 0 on quit", () => {
      const frames = framesOf(levelled.stdout);
      expect(frames.length, "frames before quit").toBeGreaterThanOrEqual(2);
      const [opening, replied] = frames as [Frame, Frame];

      // The engine opens: the first frame is the start position with White to move, the second
      // carries White's reply, and it is a move the project's own generator produces.
      expect(opening.placement).toBe(placementOf(START_FEN));
      expect(opening.side).toBe("White");
      expect(replied.side).toBe("Black");
      const position = parseFen(START_FEN);
      const legal = legalMoves(position);
      const replies = legal.filter((move) => toSan(position, move, legal) === replied.last);
      expect(replies).toHaveLength(1);
      makeMove(position, replies[0] as (typeof legal)[number]);
      expect(replied.placement).toBe(placementOf(toFen(position)));

      // No prompt appears before the engine's reply is on screen: the first prompt comes after the
      // reply's `last:` row (and it does come — the human quits through it).
      const replyAt = levelled.stdout.indexOf(`last: ${replied.last}`);
      expect(replyAt, "the reply's last: row").toBeGreaterThan(0);
      expect(levelled.stdout.indexOf(PROMPT), "the first prompt").toBeGreaterThan(replyAt);

      // The level answered, not the book: the book-absent warning is there exactly once.
      expect(occurrencesOf(levelled.stderr, BOOK_ABSENT_WARNING), "book-absent warnings").toBe(1);
      expect(levelled.stderr).toBe(`${BOOK_ABSENT_WARNING}\n`);
      expect(levelled.stdout.trimEnd().endsWith(QUIT_NOTICE)).toBe(true);
      expect(levelled.status).toBe(0);
      expect(levelled.signal).toBeNull();
    });
  });

  describe("ABC-173 — CLI_DEEP: the child's heap ceiling, read in the child", () => {
    it("A6 — a child built as this lane builds its children reports heap_size_limit at most the admitted row", () => {
      const row = inject("heapRowMiB");
      if (typeof row !== "number")
        throw new Error("no heapRowMiB: tools/grugops/heap-guard.js did not run as globalSetup");
      // The same construction as the real children: `nodeArgv`, `CHILD_ENV`, the copy as cwd. Only
      // the entry point differs, because the product does not print its own heap limit.
      const probe = spawnNode(
        copy,
        [
          "-e",
          "process.stdout.write(String(require('node:v8').getHeapStatistics().heap_size_limit))",
        ],
        "",
      );
      expect(probe.status, probe.stderr).toBe(0);
      expect(probe.stdout).toMatch(/^[1-9]\d*$/);
      expect(
        Number(probe.stdout),
        `CLI_DEEP child heap_size_limit vs row ${row} MiB`,
      ).toBeLessThanOrEqual(row * 1024 * 1024);
    });
  });
}
