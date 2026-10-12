---
id: 20261012T151900Z-security-nfr-observation-s3-readings-clause-b-items-2-8-cwd-children-c24fec8e
kind: observation
by: security-nfr
task: secnfr-ABC-095-s3
at: 2026-10-12T15:19:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-042
  - ABC-041
  - ABC-094
  - ABC-119
  - ADR-0036
  - ADR-0037
  - AR-095-L1UNIT
  - AR-095-READ
  - QE-095-a
  - QE-095-e
  - V12.3.1
  - 20261012T133500Z-security-nfr-decision-s1-s2-ruled-r1-stands-s3-checklist-a096cf43
  - 20261012T151200Z-qe-e2e-decision-abc095-verdict-pass-with-gaps-ee8775a2
  - 20261012T140000Z-software-engineer-observation-gates-cli-deep-plants-clause-b-s3-adc2b5bb
supersedes:
---

# S3 readings on `0974102f..2307fc11` (QE tip `e1444f23`): clause (b) as predicted, items 2–8 as built, and the cwd children behind `QE-095-a`

This note is hand-authored and unsealed. No `finding` is admissible on this install. The checklist is
`.grugops/context/secnfr-ABC-095-placement/notes/…a096cf43` § S3; the rule is `ADR-0036` § S1. Neither is
restated here. Everything was read on `grugops/secnfr-ABC-095-s3` (worktree `../wt-secnfr-ABC-095-s3`,
off `e1444f23`, `node_modules` symlinked at the worktree root only). **No timing was read.** Raw output
is in `../probe/`.

## Item 1: clause (b), canonical instrument, limbs 1–3 (`probe/clause-b.out.txt`)

`node .grugops/context/design-F-072-1/probe/clause-b.mjs 0974102f 2307fc11 <limb>`. Production files
changed: 3 (`src/book-engine.ts`, `src/book-file.ts`, `src/cli.ts`).

| limb | (b1) | (b2) edges that fire | edges that must not fire | holders at head | verdict |
|---|---|---|---|---|---|
| 1 | 1: `src/book-file.ts:13` `import { readFileSync } from "node:fs";` | `cli.ts -> book-file.ts` | `cli.ts -> book.ts`, `cli.ts -> book-engine.ts`: reach no holder | 1: `book-file.ts` | **FIRES** |
| 2 | 1: `src/cli.ts:177` `warn: (line) => process.stderr.write(…)` | none | all 3 new edges reach no holder | 3: `cli.ts`, `glyph-mode.ts`, `perft-bench.ts` | **FIRES** |
| 3 | 0 | none | all 3 reach no holder | 0 | does not fire |

- **Word hits on added lines:** 0 on every limb. **Unresolved:** none.
- **Holder set at the tip: exactly 4** (`book-file.ts`; `cli.ts`, `glyph-mode.ts`, `perft-bench.ts`).
  At the base it is 3 (37 production files; limb 1: 0 holders). Production files 37 → 39.
- **The QE tip adds no production line.** `clause-b.mjs 2307fc11 e1444f23`: 0 production files on all
  three limbs. `git diff --name-only 2307fc11 e1444f23 -- src/ data/ package.json package-lock.json`: 0.
- **No other line, edge or holder** appeared. Nothing to dispute.

## Item 1: `ADR-0036` § S1 Ruling 2 by hand (`probe/ruling2-by-hand.out.txt`)

- Limb-1 holders: base `0974102f` **none**; head `2307fc11` `src/book-file.ts`. Union: `src/book-file.ts`.
- `git diff --name-only --no-renames 0974102f 2307fc11 -- src/book-file.ts` prints `src/book-file.ts`
  (15 `+` lines). **Ruling 2 FIRES.** The file is new, so (b1) fires either way.
- **The empty-holder trap.** The brief says "take the limb-1 holders from the base". At this pair the
  base holds **none**. Run literally, `git diff --name-only … --` with an empty pathspec is not "no
  paths": git reads it as every path and prints all **21** changed files. That would read as "fires"
  for the wrong reason. § S1's own method takes the holders at `<base>` **or** `<head>`, which gives
  `src/book-file.ts` here. When both ends hold none, Ruling 2 does not fire, and the `git diff` must not
  run.

## Item 2: `src/book-file.ts` at `2307fc11`, line by line (`probe/s3-items-2-6.out.txt`)

- **Imports:** exactly one, line 13, `{ readFileSync } from "node:fs"`. No `require(` and no `import(`.
- **Exports:** one, `readBookFile(): Uint8Array`, with **0** parameters (the other `export` hit is the
  word in the header comment).
- **Calls:** one, `readFileSync(new URL("../data/opening-book/book.json", import.meta.url))`.
- **Absent:** any other `fs` API, any write, any other path, `process`, `env`, `argv`, `cwd`, `try`,
  `catch`. Comments included.
- **At import:** nothing runs. The module body is one function declaration (`N-LOAD`).

**MET.** **The behaviour, read in a child** (`probe/qe095a-cwd-children.out.txt`, below): the delivered
build reads the book from its own tree whatever the working directory, and ignores a `book.json` planted
in the working directory.

## Item 3: `src/cli.ts` (`git diff -U0 0974102f 2307fc11 -- src/cli.ts`, 14 changed lines)

- 3 imports: `createBookProbe` from `./book.ts`, `withBook` from `./book-engine.ts`, `readBookFile` from
  `./book-file.ts`.
- 4 comment lines, then the one `const book = createBookProbe({ read: readBookFile, warn: (line) =>
  process.stderr.write(\`${line}\n\`), random: Math.random })`.
- `-engine: createEngine(…)` / `+engine: withBook(book, createEngine({ budgetMs: DEFAULT_BUDGET_MS }))`.
- **`warn`** writes `${line}\n` to `process.stderr`. Nothing reaches `process.stdout`.

**MET.** The 4 comment lines accompany the `const`; item 5 reads them.

## Item 4: `ABC-042` `A9`

- **The census:** the sorted `process.\w+` list gains a third `"process.stderr"`, and
  `expect(entry.match(/\bprocess\b/g)).toHaveLength(10)` (was 9).
- **The reason paragraph** is present ("NINE UNTIL `ABC-095`…"). `expect(entry).not.toContain("globalThis")`
  is still in the row (`src/cli.test.ts:1653` at the tip).
- **Green** in `npm test` on this branch (artifact-ref note).
- Raw `\bprocess\b` in the whole of `cli.ts`, comments included: 21 → 22. `A9` reads executable code.

**MET.** The acquisition stays at the entry point.

## Item 5: `ABC-042` bars 1 and 4

- **Unedited.** No hunk of `git diff 0974102f 2307fc11 -- src/cli.test.ts` falls on the bar rows
  (`it("bar 1 — …")` at line 1752 of the tip).
- **Green** in `npm test` on this branch.
- **Substrings:** 0 hits for `eval`, `Function(`, `child_process`, `import(`, `fetch`, `WebSocket` and
  `XMLHttpRequest` in the added `cli.ts` lines, comments included, and 0 in the whole of `cli.ts` at the tip.
- **The specifier** `./book-file.ts` is relative.

**MET.**

## Item 6: the hostile-input surface

- `git diff 0974102f 2307fc11 -- src/book.ts`: **0 lines.**
- **The warning:** `opening book ${reason}; playing on without it`. `reason` is one of the six fixed
  `BookRefused` strings, or `"could not be read"` for any other error. **No byte of the file, no path and
  no `fs` error text** can reach it. The children below print it verbatim.
- `AR-095-READ` is accepted, not fixed (see the decision note).

**MET.**

## Item 7: R2's `ABC-119` tree copy (`src/cli.real-engine.test.ts` at the tip)

- **Real, not linked.** `expectBookAbsentCopy` checks every entry under the copy's `src/`, and `src/`
  itself, with `lstatSync`. No entry is a symbolic link. Every entry that is not a directory is a regular
  file. The listings are equal, and every file is byte-identical. `package.json` is a regular file, not a
  link, and byte-identical. The book is present in the repository and absent in the copy. All of this runs
  before any child.
- **The leak detector.** `A3`(iv) asserts the book-absent warning **present exactly once**
  (`occurrencesOf(played.stderr, BOOK_ABSENT_WARNING)` is 1).
- **Where it is written.** `mkdtempSync(join(tmpdir(), "abc095-book-absent-"))`.
- **How it is removed.** `rmSync(root, { recursive: true, force: true })`, with `root` exactly as
  `mkdtempSync` returned it. It is called from the default row's `finally` and the deep `afterAll`.
- **QE's plants** P9a and P9b (linked `src/`, linked `src/book-file.ts`) are red.

**MET in behaviour.** The checklist's **text** is wrong for `src/__snapshots__`. That is `QE-095-e`,
ruled in the decision note.

- **A small leak path, the same class as `QE-095-d`.** Neither row can remove a copy if `cpSync` or
  `copyFileSync` throws inside `makeBookAbsentCopy`, because the path never reaches the caller. Such a
  copy stays under `os.tmpdir()`, owned by the same user. It writes nothing to the repository.

## Item 8: `ABC-041` clauses (a), (c) and (d) (`probe/s3-items-7-8.out.txt`)

- **(a) not reached.** `git diff --numstat … -- package.json package-lock.json`: 0. `node:fs` is a builtin.
- **(c) reached, does not fire.**
  - **Filesystem writes:** only under `os.tmpdir()`, through `mkdtempSync`, `cpSync` and `copyFileSync`.
    The only removal is the exact path. `src/book-engine.test.ts` writes nothing and spawns nothing; its
    one `readFileSync` of an absent path is a read.
  - **Spawn call sites:** 1 in `src/cli.real-engine.test.ts`, 1 in `src/cli.test.ts`, 0 in
    `src/book-engine.test.ts`. `N8_SPAWN` is `17 + 7 + 1 + 2` (27) at the base and at the tip.
  - **The default lane:** 0 new spawns. The `ABC-119` default row builds and removes a copy and spawns
    nothing.
  - **New `CLI_DEEP` children, named:** `bookless` (`A5` stream half: the copy, `quit\nquit\n`) and
    `booked` (`A7`: `REPOSITORY`, `e2e4\n`, `--colour white --ascii`). `ABC-119`'s two existing
    children (`played`, `rejected`) now run from the copy.
- **(d) does not fire.** The pair's `src/` files are exactly the six on § Scope's list.

## The cwd children behind `QE-095-a` (`probe/qe095a-cwd-children.out.txt`)

**Why every child misses P6b.** `spawnReal(root, …)` sets `cwd: root`, so every child's working directory
**is** its tree root:
- the book-absent copies run with cwd = the copy, which has no book at any path;
- `A7`'s `booked` child runs with cwd = `REPOSITORY`.

So a cwd-relative read resolves to the same file as the delivered `import.meta.url` read in every child.

**The probe.** Two `git archive 2307fc11` copies (`src`, `package.json`, `data`) in the session
scratchpad, outside the repository:
- `delivered`, unchanged;
- `p6b`, where `readBookFile` is `readFileSync("data/opening-book/book.json")` (1 exact match replaced).

Each child is `node <tree>/src/cli.ts --colour white --ascii`, with stdin `e2e4\n` and `env: {}`.

| build | cwd | exit | stderr |
|---|---|---|---|
| delivered | its tree root (as `A7` today) | 0 | 0 B |
| delivered | a neutral empty directory | 0 | **0 B** |
| P6b | its tree root (as `A7` today) | 0 | **0 B** (QE's reading reproduced) |
| P6b | a neutral empty directory | 0 | **`opening book could not be read; playing on without it`** |
| P6b | a directory holding a planted `data/opening-book/book.json` (`not a book`) | 0 | **`opening book is not valid UTF-8 JSON; playing on without it`** |
| delivered | the same planted directory | 0 | 0 B |

**What it shows.**
- **QE's named fix catches P6b.** The same child, with a neutral working directory, reds on the warning.
- **The delivered code is cwd-independent.** It ignores a planted file.
- **Under P6b, the book's source becomes whoever controls the launching directory.** The planted file was
  read and parsed. `ABC-094`'s parser refused it, but an oversized file or a FIFO there is
  `AR-095-READ`'s exposure, now reachable from the working directory rather than from the checkout.

**Clean-up.** The scratch tree `…/scratchpad/s3` held 0 entries before. It held 4 directories
(`delivered`, `p6b`, `neutral`, `hostile`) during the probe. It was removed by that exact path and holds 0
entries after. Nothing was written in the repository.
