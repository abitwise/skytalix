---
id: 20261012T143800Z-qe-e2e-observation-abc095-criteria-plants-children-e11e8176
kind: observation
by: qe-e2e
task: qe-ABC-095
at: 2026-10-12T14:38:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-119
  - ABC-042
  - ABC-043
  - ABC-044
  - ABC-045
  - ADR-0037
  - ADR-0036
  - src/book-engine.ts
  - src/book-file.ts
  - src/cli.ts
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
  - src/book-engine.test.ts
  - 20261012T135800Z-software-engineer-decision-wiring-built-to-r1-r3-s3-readings-taken-c2673608
  - 20261012T140000Z-software-engineer-observation-gates-cli-deep-plants-clause-b-s3-adc2b5bb
supersedes:
---

# `ABC-095` at `2307fc11`: QE's own readings of A1 and A3–A7, 18 plants, the 10 re-targeted children, and the two SE readings

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). Every reading
below was taken by QE on `grugops/qe-ABC-095` (off `2307fc11`, worktree `../wt-qe-ABC-095`, `node_modules`
symlinked at the root only). Host: Apple M3 Mac15,13, Darwin 25.5.0 arm64, Node v26.11.0, AC power. Foreign vitest
(the grugops kit's suite, PID 88316) was live during the gate run at 14:17Z and absent from about 14:36Z. That
matters for timing only, and no timing is quoted here. The raw outputs are in `probe/`.

## Gates on `2307fc11` (14:18Z, load1 4.20)

lint exit 0 (112 files) · typecheck exit 0 · build exit 0 · `npm test` exit 0, **58 files / 1780 passed**, 0 failed,
`numPendingTests` + `numTodoTests` = 0 · `test-skip-integrity.js … --skip-count 0`: `No findings.`, exit 0
(`probe/gates` in the artifact-ref note).

## `CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts` (14:18:32Z–14:18:42Z)

Exit 0, **9 passed**. The three book-absent children ran 3102, 3106 and 3105 ms; the `A7` child ran 110 ms.
**`$TMPDIR/abc095-book-absent-*`: 0 before and 0 after.** Across the 18 plant runs below, the census rose only on
the two plants built to leak (P10a +1, P10b +1). Every other run left it unchanged.

## The criteria, each read by QE independently

| criterion | QE's own reading | state |
|---|---|---|
| `A1` | `probe/a1-a3-own.ts`, out of suite, through the delivered `readBookFile` and `withBook`: **200 fresh probes** (`Math.random`), start position. Inner seam called **0** times. Every reply is a book entry for the start, with 0 warnings and 12 distinct replies (e4 92, d4 75, c4 12, …). The suite row is green (gates) | **MET** |
| `A2` | timing; see the timing note | see `…3283096f` |
| `A3` | the same script, **4 out-of-book positions** (1. e4 e5 2. Ke2; 1. c3; a 20-ply Fried Liver line; 1. a3 h6 2. h4), each with a fresh probe that has already read the book. Inner called **exactly 1** time each, the inner's own move is returned, it is legal (compared by UCI), and there are **0** warnings and **0** `process.stderr.write` calls. The warm miss bar is in the timing note | **MET** (call-count half) |
| `A4` | a **real child** from the repository (`--colour white --ascii`, stdin `e2e4\ne1e2\n`). 2. Ke2 is out of book after **every one of the 19** book replies to 1. e4 (checked by the probe's key), so ply 4 is the search's. Frames ply 0–4 all have **22 rows** (`probe/frames.py`; the parser's count). The ply-2 (book) and ply-4 (search) frames carry **0 extra message rows**. **0** lines anywhere name the book, and stderr is **0 bytes**. The suite's `A4` row is green | **MET** |
| `A5` game half | suite row green (10 inner calls, 1 warning) | **MET** |
| `A5` stream half | `CLI_DEEP` row green. **Plus a QE child with THREE engine plies:** a book-absent copy made by QE (`mktemp`, `cp -R src`, `package.json`; 0 links, `diff -r` exit 0, no book), `--colour black`, stdin `a7a6\nh7h6\nquit\nquit\n`. Engine plies Nf3, Nc3, d4, all searched. **stderr is exactly the warning line plus `\n`, once**, with **0** occurrences on stdout and exit 0 on quit. The copy was removed by its exact path | **MET** |
| `A6` | `git diff --numstat 0974102f 2307fc11` over `src/engine.ts`, `src/search*.ts`, `src/evaluat*.ts`, `src/quiescence.ts`, `src/transposition.ts`, `src/levels.ts`, `src/*order*.ts`, `src/virtual-clock.ts`, `src/turn-loop.ts`, `src/book.ts`, `data/` → **0 lines**. Clause (d): the pair's `src/` files are exactly the six on § Scope's list | **MET** |
| `A7` structural | `git diff -U0 0974102f 2307fc11 -- src/cli.ts`: 3 imports, the `const book = createBookProbe({ read: readBookFile, warn: (line) => process.stderr.write(\`${line}\n\`), random: Math.random })` above the call, and **one** changed line inside `runTurnLoop({…})`: `engine:` | **MET** |
| `A7` child | `CLI_DEEP` row green. **QE ran the same child 10 times:** every reply is a book entry after 1. e4 (e5 ×7, c5 ×2, e6 ×1), with stderr 0 bytes and exit 0. Replies vary between sessions | **MET** (see the caveat below) |

## Plants: 18, each in its own `git archive 2307fc11` copy outside the repository

`probe/plants.py` (exact-string edits, match count asserted) and `probe/plants.sh` (full default lane plus
`CLI_DEEP`, the failed rows by name, and a `$TMPDIR` census). Raw: `probe/plants/plants.out.txt`, the deep
consoles, and `probe/plants/plants-results.jsonl`. The `.jsonl` is an extract of every run's vitest JSON (counts and
failed rows). The 13 MB full files stayed in the session scratchpad.

| plant | default lane (58 / 1780) | `CLI_DEEP` (9) | caught by |
|---|---|---|---|
| P0 control | green | green | (none needed) |
| P1a `engine:` line unwired (`createEngine(…)` alone) | **7 red** | **2 red**; `A7` **green** | `ABC-043` `A1` pin; re-targeted children: `ABC-043` `A2`, `A5`, `A7`; `ABC-044` `A3`, `A6`; `ABC-045` `A4`; deep: `ABC-119` `A3`(iv), `ABC-095` `A5` |
| P2 decorator always searches (asks the probe, discards the hit) | 2 red | **green** | `book-engine.test.ts` `A1` (inner 1 ≠ 0) and `A4` only |
| P3 decorator searches AND returns the book move | 2 red | **green** | `book-engine.test.ts` `A1`, `A4` only |
| P4 warn to stdout | 3 red | 2 red | `ABC-042` `A9` (stdout census and process census), `ABC-043` `A1` const pin; deep `A3`(iv), `A5` |
| P5 warn writes the line twice | 1 red | 2 red | `ABC-043` `A1` const pin; deep `A3`(iv) and `A5` (2 ≠ 1) |
| P5b warn swallowed | 2 red | 2 red | `A9` process census (9 ≠ 10), const pin; deep `A3`(iv), `A5` |
| P6a `readBookFile` reads `book-missing.json` | **green** | 1 red | `A7` child only (stderr carries the warning; the reply took 3.1 s) |
| **P6b `readBookFile` reads `"data/opening-book/book.json"` (cwd-relative)** | **green** | **green** | **NOTHING (`QE-095-a`)** |
| P7 probe built per move (in `engine:`) | 6 red | **green** | `A9` census, `ABC-043` `A1` pin, and incidentally `ABC-043` `A2`, `A6`, `A7`, `ABC-044` `A6` (the scripted doubles reset each ply). No behavioural row sees a second warning (`QE-095-c`) |
| P8 the copy carries `data/` | 1 red | file red, 0 rows run | `ABC-119` default row and deep `beforeAll`: "the copy's book". **Census 0: the copy is removed on failure** |
| P9a the copy's `src/` is a link | 1 red | file red | "the copy's src/ itself" |
| P9b the copy's `src/book-file.ts` alone is a link | 1 red | file red | "src/book-file.ts is a symbolic link" |
| P10a deep `afterAll` does not remove the copy | green | green | **nothing; census +1** (`QE-095-d`) |
| P10b default row without `finally`, plus P8 | 1 red (P8's) | file red | **the leak itself: nothing; census +1** (`QE-095-d`) |
| P11 `ABC-119` `A6` M1 (composition reverted to a double) | **green 1780** | **`A1` red alone** (98 ms) | `ABC-119` `A6` holds on the amended lane |
| P11 `ABC-119` `A6` M2 (`DEFAULT_BUDGET_MS` shadowed, line 188 byte-identical) | **green 1780** | **`A1` red alone** (121 ms) | the same |
| P12 marker in `readBookFile` (every call logged) | green | green | **0 calls in the default lane**, 4 in `CLI_DEEP` (3 book-absent children, 1 `A7` child) |
| P13 naive wiring (the doubles left on `./engine.ts`, behind the book) | 10 / 10 runs red | n/a | the `mate` rows (`ABC-043` `A2`, `ABC-044` `A6`) red in **4 of 10** runs; `ABC-043` `A5`, `A7`, `ABC-044` `A3` red in 10 of 10 |

I removed the two leaked copies by their exact paths, and the census is back to 0. No plant touched the repository.
`git status` showed only `probe/` files, and the SE's worktree is clean at `2307fc11`.

**The A7 caveat, ruled.** The `A7` child row alone stays green on an unwired build (P1a), on a build that discards
the hit (P2), on one that searches and then returns the hit (P3), and on a per-move probe (P7). **An unwired build is
caught, abundantly:** 1 pin, 6 re-targeted-children rows and 2 `CLI_DEEP` rows (P1a). **A hit that is not used**
(P2, P3) is caught only by `book-engine.test.ts`. The real-session level holds by composition: the decorator's unit
`A1` plus the root's pin that `engine:` is that decorator around the real probe. **For the criterion as written, that
is enough**: `A7`'s child half reads "the reply is one of the book's entries", and it is. A row that proves *in a real
session* that the reply came from the book would need a sharper Given (a fixture book in a copy whose only entry
after 1. e4 is a move the search does not choose). That is BA/PM's call, and it is not owed for this verdict
(`QE-095-b`).

## The 10 re-targeted children

- **Each is read by at least one row** (a source walk of `CHILDREN.<name>` → enclosing `it`): `black` 2, `random` 3,
  `mate` 4, `engineThrows` 2, `engineForeign` 2, `colourBlack` 1, `colourWhite` 1, `resigns` 2, `quits` 1, `renews` 2.
- **Each still exercises its criterion with the double at `./book-engine.ts`.** P1a reds the six rows that depend on
  the double being reached. A double never asked would leave the real search answering, and those rows would red.
- **`mate` is not book-dependent.** `src/cli.test.ts` ×20 at the tip (14:29:35Z–14:31:12Z, load1 ~6): **20 / 20 green,
  69 / 69 each.** The `mate` rows were green in all 20. Contrast P13 (the naive wiring): red in 4 / 10. P12 shows
  the mechanism: the default lane never calls `readBookFile` (0 calls), so no child's opening move can come from
  the book.

## The SE's two readings, ruled

**(a) The copy rule against `src/__snapshots__`.** The SE's reading is the honest one, and it is sufficient. That
reading is: no entry under the copy's `src/` (the root included) is a symbolic link, every entry that is not a
directory is a regular file, the listings are equal, and every file is byte-identical.
- The literal words ("every entry … is a regular file") cannot hold while `src/` holds a directory. Flattening would
  break "byte-identical `src/`".
- Every link shape is red: the whole `src/` (P9a) and the one file that matters, `src/book-file.ts` (P9b). A linked
  `__snapshots__` would fail either the `lstat` or the listing equality.
- **Gap `QE-095-e` (LOW, wording):** BA/PM to align `ABC-095` test note 4 and `ABC-119` § Amendment with "no entry is
  a symbolic link, and every entry that is not a directory is a regular file". The behaviour does not change.

**(b) "Both halves pinned" on `ABC-043` `A1`.** The SE pins a superset of either plausible reading:
- the `engine:` regex pins the whole expression, `withBook(book, …)` around the old pin's full inner text;
- the initializer is pinned by `createBookProbe(` occurring exactly once and by the whole `const book = …` text.
- Every plant that touched either half went red on it (P1a, P4, P5, P5b, P7).
- It is stricter than necessary: reordering `read`/`warn`/`random` would red it. That is acceptable for a pin, and
  not a defect.
