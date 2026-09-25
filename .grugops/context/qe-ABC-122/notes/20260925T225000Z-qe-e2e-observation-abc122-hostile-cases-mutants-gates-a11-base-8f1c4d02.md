---
id: 20260925T225000Z-qe-e2e-observation-abc122-hostile-cases-mutants-gates-a11-base-8f1c4d02
kind: observation
by: qe-e2e
at: 2026-09-25T22:50:00Z
verified_by:
confidence: high
refs:
  - ABC-122
  - qe-ABC-122
  - ticket-to-pr-ABC-122
  - amend-abc122-a4-pin
  - plans/tickets/ABC-122-gate-hardening-bounded-timeout-and-capacity-guard-test.md
  - tools/grugops/run-bounded.js
  - tools/grugops/run-bounded.hang-fixture.js
  - tools/grugops/run-bounded.proof.js
  - src/search.capacity.test.ts
  - src/engine.capacity.test.ts
  - src/search.ts
  - src/engine.ts
  - package.json
  - src/cli.test.ts
supersedes:
---

# ABC-122 QE readings: A1–A12 reproduced independently, 6 hostile wrapper cases pass, 2 own-applied mutants confirm the build's exact readings, A11 base ruled, lane-inventory confirmed pre-existing

Hand-authored and unsealed (`scripts/context-io.ts` / `mcp__grugops__propose_note` absent from
this install; `context.human_admission` is `off`, per `AGENTS.md`'s no-`finding` note). Branch
`grugops/qe-ABC-122`, worktree `.claude/worktrees/qe-ABC-122`, base `grugops/ABC-122-gate-hardening`
@ `1fee8ff`. Machine: macOS (Darwin 25.5.0), Node v24.12.0.

## Acceptance criteria, reproduced from the tree, not re-read from the ticket page

| # | reading |
|---|---|
| `A1` | `node tools/grugops/run-bounded.proof.js` (which runs `run-bounded.js` against a 500 ms bound on the hang fixture): exit 124 at 546.4 ms, one stderr line naming `500 ms` and the fixture path. MET. |
| `A2` | Proof's byte-for-byte pass-through rows: exit 0 and exit 3, stdout/stderr identical direct vs wrapped. MET. |
| `A3` | Proof's armed-orphan rows: fixture, grandchild and group all seen alive before the kill; all three ESRCH 250 ms after exit. MET. |
| `A4` | `package.json`'s `test` script and `src/cli.test.ts:1661`'s `SCRIPTS_AT_HEAD.test` both read `"node tools/grugops/run-bounded.js 60000 vitest run"`, byte-identical. `npm test` echoes the wrapped command and passes. Constant not re-derived by this hop (build hop's 8.1× reading stands). MET. |
| `A5` | `run-bounded.js` imports only `node:child_process`, `node:os`, `node:timers`. Confirmed by reading the file. Windows fallback unexercised (unchanged from build hop's own disclosure). MET, with the same stated limit. |
| `A6` / `A8` | `npx vitest run src/search.capacity.test.ts src/engine.capacity.test.ts`: 2/2 passed. Read `src/search.capacity.test.ts` in full: mocks `legalMoves` (first move only) and `zobristKeyAfterMove` (fresh key, write-count spy) in-file only; asserts return score against an independent oracle (`leafAtCapacity`, built without `search()`), key-write count and node count. No test-door export added to `src/search.ts` or `src/engine.ts` (confirmed: `git diff` on both files is empty against base). MET. |
| `A7` / `A9` | Own mutants applied (below), matching the build's reported readings exactly. MET. |
| `A10` | `git diff` on `src/search.ts` and `src/engine.ts` against `grugops/wave-2026-09-25` (`0bc31e1`) is empty. Full lane at the restored tree: 47/47 files, 1446/1446 tests. MET. |
| `A11` | See "A11 base" below — ruled MET against the wave merge-base. |
| `A12` | `npm run lint` exit 0 (83 files, no fixes). `npm run typecheck` exit 0. `npm run build` exit 0. `npm test` (through the wrapper) exit 0, 47/47 files, 1446/1446 tests, 0 skipped. Skip-count capture (`vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`): 0. `test-skip-integrity.js … --skip-count 0`: `No findings.`. Exactly 2 new test files under `src/`, 1 row each, confirmed by the lane summary and by `git diff --numstat` against `0bc31e1`. `N8-LANE` not re-measured this hop (Security/NFR's to re-read per the queue task; the build's own reading — +475 ms gross / ≈+155 ms net of 650 — stands, sign 5/8 at n=8, medium confidence, named as a gap below). MET. |

**Verdict: 12 of 12 criteria MET, independently reproduced.**

## 6 hostile wrapper cases (own probe, run outside `tools/` per the QE fence — scratch-only,
never committed), each under its own outer hard bound so a wrapper regression cannot hang the
probe itself

| case | result | reading |
|---|---|---|
| 1. child ignores SIGTERM | PASS | still killed via SIGKILL, exit 124, 584 ms |
| 2. hang lives in a grandchild (same process group) | PASS | wrapper exit 124; the grandchild pid was checked and was NOT alive 250 ms after exit — the whole group was killed, not just the direct child |
| 3. child exits non-zero fast (bound far above) | PASS | exit 7 at 107 ms, well under the 5000 ms bound — pass-through is immediate, the wrapper does not wait out the bound on a fast exit |
| 4. large output (3 MiB), no trailing newline | PASS | exit 0, stdout byte count matched exactly (3,145,728 B); no truncation, no deadlock on the inherited pipe |
| 5. args with spaces and embedded quotes, forwarded | PASS | `hello "world" it's a test` round-tripped byte-for-byte through `process.argv` — confirms the argv-array spawn (no shell) actually preserves arguments under hostile content, not just that no shell is used |
| 6. SIGINT to the wrapper itself (Ctrl-C) | PASS | the wrapper's spawned child (the real process-group leader, not the wrapper's own pid) was alive before the signal; after `SIGINT` to the wrapper, it exited (code 130) in 13 ms and the child's group was gone 250 ms later — no orphan |

**All 6 hostile cases passed.** No process from any hostile-case run, the proof run, or either
applied mutant's own `npm test`/lane runs survived: `pgrep -fl "run-bounded\|hang-fixture\|vitest"`
returned nothing at the end of this hop.

## 2 mutants re-applied by hand (one per file), full lane run, reverted byte-for-byte after each

| mutant | file, change | result |
|---|---|---|
| S1 (own) | `src/search.ts:287`: `if (depth <= 0 \|\| ply >= KEY_ARRAY_CAPACITY)` → `if (depth <= 0)` | `src/search.capacity.test.ts`'s row turned RED: `TypeError: Cannot mix BigInt and other types, use explicit conversions` at `src/transposition.ts:95` via `negamax`. **Matches the build's `S1` reading exactly** (same error class, same origin). Only that 1 test failed; 1445 others stayed green. |
| E2 (own) | `src/engine.ts:235`: `ply >= KEY_ARRAY_CAPACITY` → `ply > KEY_ARRAY_CAPACITY` | `src/engine.capacity.test.ts`'s row turned RED: `AssertionError: expected 129 to be 128` on `spy.deepestPly`. **Matches the build's `E2` reading exactly** (identical numbers, identical assertion). Only that 1 test failed; 1445 others stayed green. |

Both mutants reverted; `git diff` on `src/search.ts` and `src/engine.ts` is empty after revert.
This reproduces 2 of the claimed 6/6, independently, with the same failure signatures the build
hop reported — no re-derivation of the other 4 (S2, S3, E1, E3) was performed this hop.

## `A11` base ruled: the wave merge-base (`0bc31e1`), not the ticket's original cut-time base (`66a45d1`)

The re-hop observation (`5d2b7e91`) flagged a caveat: against the ticket's own original base
(`66a45d1`), `AGENTS.md` (+15), `plans/board.md` (+10/−2) and `ADR-0026` (+187, new file) show
non-empty diffs, which would read as `A11` fence violations if that base were used. Checked
independently:

- `git diff --numstat 66a45d1...1fee8ff -- AGENTS.md plans/board.md plans/nfr-catalog.md
  memory-bank/50-decisions/` — non-empty (the three files above).
- `git diff --numstat 0bc31e1...1fee8ff -- AGENTS.md plans/board.md plans/nfr-catalog.md
  memory-bank/50-decisions/` — **empty**.
- `git log --oneline 66a45d1..0bc31e1`: every commit in that range (`cf5d71a`, `9efe2e7`,
  `00f02a4`, `721e38c`, `02c3379`, `03fa645`, `7eae06b`, `b920613`, `aa0e381`) is a Scribe /
  Architect / Orchestrator commit on the wave branch, none authored under `ABC-122`'s own
  Engineer hops.

**Ruling: the wave merge-base (`0bc31e1`) is the correct base for reading `A11`.** `A11` polices
what *this ticket's own delivered diff* touches, not whether the wave as a whole touched fenced
files through unrelated, concurrently-landed work. Reading the fence against the ticket's
original cut-time base would misattribute six other agents' commits to `ABC-122`. This confirms
the re-hop's own reading; it is not a new interpretation.

## `lane-inventory.js` confirmed pre-existing, not `ABC-122`'s

`node tools/grugops/lane-inventory.js` at the QE tree: exit 1, same finding as the build hop —
`.grugops/context/ruling-abc079-oracle/probe/vt/oracle.test.ts` is tracked but excluded from the
lane by `vitest.config.ts`'s `test.exclude` glob. `git log --oneline --all -- <that path>` shows
exactly one commit, `b324cb6`, which predates `ABC-122`'s own branch entirely. Confirmed
pre-existing; not attributable to this ticket.

## Gaps and unresolved items (named, not smoothed)

1. **Stale header comment in `tools/grugops/run-bounded.js`.** The file's own top-of-file comment
   still reads "NOT YET WIRED IN. `A4` puts `package.json`'s `test` script on this file... The
   line is held until the ruling," which was true at the file's first commit but is now stale:
   `A4` landed in `ca9f42d`. Behaviorally inert (the wiring is real and verified above), but a
   reader of the file alone would be misled about its own status. QE is fenced from `tools/`
   (zero lines) and cannot fix this; naming it for the next licensed touch.
2. **`N8-LANE` and the process-kill security surface are explicitly Security/NFR's to rule**, per
   this hop's own queue task. Reported here only: the build's reading (+475 ms gross / ≈+155 ms
   net of the 650 ms bar) was not re-measured; its own sign was 5/8 at n=8 under a medium-load
   machine (median load 17), which the build hop itself flagged as needing a quieter re-read.
3. **Test-first was not observed for `A6`/`A8`.** The build hop's own claim (`7883fd4a`) discloses
   this: the capacity tests were written against guards that were already correct and already
   green, so their own red was demonstrated only via the mutants (`A7`/`A9`), not via a red-first
   TDD cycle. This hop's own mutant re-application (above) independently confirms the tests DO
   catch the regression class; the process gap (not test-first) is named, not re-litigated.
4. **Windows and Linux are unverified**, same as the build's own disclosure — this project runs
   on macOS and neither platform was exercised by any hop to date.
5. **`AGENTS.md`'s `### Test` line is still owed to the Scribe.** Confirmed still absent
   (`AGENTS.md`'s `Test (all)` slot still documents plain `npm test` / `vitest run` without the
   wrapper, the bound, exit 124, or the `*_DEEP`-lanes-must-not-run-through-`npm test` note).
   Not this hop's to write (fenced from `AGENTS.md`); named so it is not lost.
