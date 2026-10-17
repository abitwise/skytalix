---
id: 20261017T102023Z-qe-e2e-observation-abc155-readings-efd7fd02
kind: observation
by: qe-e2e
at: 2026-10-17T10:20:23Z
verified_by:
confidence: high
refs:
  - ABC-155
  - ABC-153
  - ABC-145
  - QE-153-a
  - NFR-008
  - plans/tickets/ABC-155-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-last-character.md
  - tools/opening-book/book.test.ts
supersedes:
---

# QE `ABC-155`: per-criterion readings (RUN 2026-10-17, QE's own)

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **No timing reading
was taken.** Reviewed: `grugops/ABC-155-last-char-refusal` tip `dcc04871`, code `819e6933`, base `main`
`c9746851`. QE worked in the SE's worktree `../wt-ABC-155` (no second checkout of the branch). Every plant
was in a `git archive 819e6933` copy in the session scratchpad, OUTSIDE the repo. The SE's readings
(`ticket-to-pr-ABC-155/…0441078b`) were not copied. They were compared only after QE's own runs.

## `A1`: the whole digest is compared. MET

- The case sits at head 316–335, after the per-file loop and before the `it`'s close (head 336).
- QE's own byte reading: `e.tsv` = `HEADER` + `GOOD_ROWS[4]`, sha256 `ea39227d…172f5a60`, last char `0`.
  Moved to the next hex digit it becomes `1`, giving `ea39227d…172f5a61`. The two share 63 of 64 chars and
  differ in 1 position, so their 8-char prefixes are equal (this is what makes `Q-PREFIX` red).
- `nearMiss` is `{ ...expected, [last]: … }`, so every other file keeps its own hash by construction.
- The 3-of-3 reads `[last, nearMiss[last], own]`. `own` cannot match inside `nearMiss[last]` (same length,
  different last char), so the refusal must carry the actual hash. `nearMiss[last]` cannot match inside `own`
  either.
- The output path `abc145-last-char.json` is unique in the file and sits under the per-run `mkdtemp`
  scratch. `existsSync` is asserted false afterwards.
- Unmutated head lane: exit 0, 19 passed.
- Not asserted: that `nextHex` differs from the old char. It always does (+1 mod 16), and a no-op would
  turn the case red anyway (plant `T-NOOPNEAR`).

## `A2`: the gap is closed (mutants). MET

See `…0877aec3` for the table. `Q-PREFIX` is green on the base test (19 passed) and red on the head test
(1 failed, `[ 'e.tsv', …(2) ]`). `Q-CASE` is green on both. `M05`, `M-SWAP` and `M06` are red on both. The
unmutated head is green. These are QE's own 10 readings plus 2 unmutated ones.

## `A3`: fences. MET

- **Code range `c9746851..819e6933`:** `M tools/opening-book/book.test.ts` only, 0 added files. The tip
  commit `dcc04871` adds only record paths: 4 SE notes, the ticket's § Delivery and one trace row.
- **`cmp` windows:** base 1–315 = head 1–315 (imports, `fixture()`, every earlier block, the describe header,
  the `it` up to the loop's close): `cmp` 0. Base 316–EOF = head 336–EOF (the `it`'s close, the `A3` `it`,
  the describe's close; both end `0a`): `cmp` 0. `fixture()` 68–75 alone: `cmp` 0. The `A3` `it`, base
  318–326 = head 338–346: `cmp` 0. `/usr/bin/diff` gives a single hunk, `315a316,335`, inside the `A1/A2` `it`.
- `tools/opening-book/compile.ts` and `data/opening-book/book.json`: `cmp` 0 against `c9746851` in the tip
  worktree. `git diff --quiet c9746851 819e6933 -- tools/opening-book/compile.ts data/` gives 0.
- `spawn|execFile|child_process` in `book.test.ts`: **0** at head and 0 at base. `it(` lines go 11 → 11 and
  `describe(` lines 5 → 5.
- `npm test`, base (a `git archive c9746851` copy): exit 0, **58 files, 1792 tests**, 0 failed, 0 pending,
  0 todo, `success: true`. Head (tip worktree): exit 0, **58 files, 1792 tests**, 0 failed, 0 pending,
  0 todo, `success: true`. Equal. Skips 0. `NFR-008` count pin held: 0 files, 0 tests and 0 spawns added.

## Gates (tip worktree `dcc04871`)

- `npm run -s lint` 0, `typecheck` 0, `build` 0, `npm test` 0 (above).
- `.test-results/last-run.json`: `success: true`, `runState: exited`, `exitCode: 0`.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.
- `git status --porcelain` was empty after every run. 0 `abc093-*` leftovers in `os.tmpdir()`.

## Concurrency note

`main` moved to `e7d9d657` during this hop: width 3 on the owner's word, with `ticket-to-pr-ABC-056` and
`ticket-to-pr-ABC-039` running beside this hop. The brief says "ONLY hop running (width 1)". That was true
at enqueue time and is not true now. No timing was read, so nothing here depends on how loaded the host
was. Every lane was green under that load.
