---
id: 20261012T135800Z-software-engineer-decision-wiring-built-to-r1-r3-s3-readings-taken-c2673608
kind: decision
by: software-engineer
task: wire-ABC-095
at: 2026-10-12T13:58:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-119
  - ABC-042
  - ABC-043
  - ADR-0037
  - ADR-0036
  - ADR-0015
  - src/book-file.ts
  - src/cli.ts
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
  - 20261012T133500Z-security-nfr-decision-s1-s2-ruled-r1-stands-s3-checklist-a096cf43
  - 20261012T134500Z-ba-pm-decision-abc095-amended-to-wiring-rulings-m-dor-10-of-10-b4ee59f2
supersedes:
---

# The wiring is built to R1–R3 and S3 as written. Five readings were mine to take, and they are listed here.

This note is hand-authored and unsealed. Code commit `09740ea4` on `grugops/ABC-095-book-before-engine`,
on top of the merge of `main` `0974102f` (`75606020`, a merge, not a rebase). No ruling was weakened, and none
turned out unbuildable.

**Built as ruled (no choice involved):**
- `src/book-file.ts` follows R1's contract line for line (S3 item 2).
- `src/cli.ts` changes three things: 3 imports, one `const book = createBookProbe({ read, warn, random })`
  between `const history` and `try`, and the `engine:` line. The comment above the `const` contains none of bar
  1/4's substrings (S3 items 3, 5).
- All 10 `substituting("engine.ts", …)` sites are now `substituting("book-engine.ts", …)`. Their 4 double sources
  export `withBook(_probe, _inner)` and return the same seam as before. `DEFAULT_BUDGET_MS` is no longer exported
  from a double, because the real `./engine.ts` now supplies it.
- Pins: `ABC-042` `A9`'s census gains a third `"process.stderr"`, and `\bprocess\b` goes 9 → 10, with a reason
  paragraph. `ABC-043` `A1`'s `engine:` row moves.

**The readings I took:**
1. **"Both halves pinned" on `ABC-043` `A1`.** I read it the way this test already uses the phrase for
   `history` (initializer plus use). The use half is the `engine: withBook(book, createEngine({ budgetMs:
   DEFAULT_BUDGET_MS }))` regex. The initializer half is two rows: `createBookProbe(` occurs exactly once, and
   `const book = createBookProbe({ read: readBookFile, warn: (line) => process.stderr.write(`${line}\n`),
   random: Math.random })` is matched whole. The inner `createEngine({ budgetMs: DEFAULT_BUDGET_MS })` keeps the old
   pin's whole text.
2. **"Every entry under the copy's `src/` is a regular file".** `src/` holds one directory, `__snapshots__`. So the
   check is: no entry anywhere under the copy's `src/` (the root included) is a symbolic link (`lstat`), and every
   entry that is not a directory is a regular file. The entry lists are equal, and every file is byte-identical.
   This keeps the ruling's purpose (no link can launder the repository's book). It does not pretend the directory
   is a file. **If BA/PM or Security/NFR reads "regular file" literally, the fix is to copy only the flat files.
   That would break "byte-identical `src/`", so it needs their word.**
3. **What the copy holds:** `src/` (recursive `cpSync`) and `package.json`, both byte-verified. `package.json`
   gives the copied `.ts` files `"type": "module"`, so the child takes the same module path it takes in the
   repository. No `data/` directory exists in the copy, so `book.json` is absent. No `node_modules`: no production
   module imports a package.
4. **The warning text is derived, not transcribed.** `BOOK_ABSENT_WARNING` is the line a merged `createBookProbe`
   hands its `warn` when `read` throws. `A3`(iv) and `A5`'s stream half count it on stderr (exactly 1) and on
   stdout (0). `A5` also asserts stderr equals the line plus `\n` exactly.
5. **`A7`'s book entries are read off the artifact by the probe's own key:** 16 lowercase hex digits of
   `zobristKey`, after `e2e4` is played by the generator. The child's reply (from the `last:` SAN) must be one of
   them. The child runs the REPOSITORY's entry point, so the book is present. `--colour white`, stdin `e2e4\n`,
   then end of input.

**One copy serves both deep blocks** (R2, test note 4). It is created in a file-level `beforeAll` inside
`if (RUN_DEEP)`, checked before any spawn, and removed in `afterAll` by `rmSync` of the exact `mkdtempSync` return.
The default-lane row builds its own copy, checks it, removes it in a `finally`, and asserts that it is gone.

**`ABC-064`'s `black`/`random` rows (BA/PM's note `…809044ec` § 2.2), checked.** `A3` reads `frames[0]` only.
`A1` (row count of every frame), `A2` (CSI count over stdout) and `A4` (the word `random` over stdout) read the
whole stream. They read properties that do not depend on the opponent's move, and the double behind both children
is unchanged (`FIRST_LEGAL_ENGINE`). The streams are the same bytes as before the re-target, and all 4 rows are green.
