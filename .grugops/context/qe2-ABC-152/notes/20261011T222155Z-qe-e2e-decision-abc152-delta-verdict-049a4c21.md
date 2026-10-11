---
id: 20261011T222155Z-qe-e2e-decision-abc152-delta-verdict-049a4c21
kind: decision
by: qe-e2e
at: 2026-10-11T22:21:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-084
  - ABC-143
  - ABC-149
  - ADR-0042
  - QE-152-a
  - QE-152-c
  - QE-152-d
  - QE-152-h
  - QE-152-i
  - QE-152-j
  - QE-152-k
  - RISK-ABC143-01
  - RISK-ABC152-PUZZLE-SPY
  - RISK-ABC152-SPY-QUERY
  - src/puzzle-suite.test.ts
  - src/cli.test.ts
  - tools/grugops/result-file-reporter.js
  - 20261011T214847Z-architect-design-decision-abc152-qe-rulings-e50fbbe3
  - 20261011T220201Z-software-engineer-artifact-ref-abc152-repair-commits-ee7b87b9
  - 20261011T220201Z-software-engineer-observation-abc152-weakened-rearmed-census-130fe00c
  - 20261011T220201Z-software-engineer-observation-abc152-reporter-vitest-node-v2-894fcbdf
  - 20261011T220201Z-software-engineer-observation-abc152-comments-and-gates-at-tip-bc57d56f
  - 20261011T220201Z-software-engineer-decision-abc152-repair-choices-handoff-d04191a4
  - 20261011T212237Z-qe-e2e-decision-abc152-verdict-ee5be445
  - 20261011T222155Z-qe-e2e-observation-abc152-delta-group4-census-9dc4714f
  - 20261011T222155Z-qe-e2e-observation-abc152-delta-v2-m9b-a5-29f4d3e9
  - 20261011T222155Z-qe-e2e-observation-abc152-delta-comments-gates-merge-5cf58584
  - 20261011T222155Z-qe-e2e-observation-abc152-delta-gap-register-e0c0d051
  - 20261011T222155Z-qe-e2e-artifact-ref-abc152-delta-commands-and-probe-12e6722b
supersedes:
---

# QE `ABC-152` delta re-check (`88009d0b..49997a87`): PASS WITH GAPS. `QE-152-h` is closed: weakened is red on the gate row at 15/58, row for row equal to base. `QE-152-a` and `QE-152-d` are closed. One new LOW comment gap (`src/cli.test.ts` line 6, stale) goes to the Architect, and it blocks nothing

This note is hand-authored and unsealed. `AGENTS.md` says no `finding` is admissible on this install.

| item | value |
|---|---|
| subtask | `qe2-ABC-152` |
| graded against | `ADR-0042` addendum 2, rulings 8–11 (`…e50fbbe3`) |
| delta | `476fdde0` (ruling 8), `502df2b6` (ruling 9), `49997a87` (ruling 10), over `88009d0b`; base `91024242` |
| worktree | `../wt-qe2-ABC-152`, on the branch (the SE's worktree is gone), with its own `npm ci` (vitest 4.1.11) |
| scratch | a `git archive 49997a87` with an APFS clone of `node_modules`, and a `git archive 91024242` with its own `npm ci` (vitest 3.2.7). All sit outside the repository; none is a symlink |
| `main` for the dry-run merge | `9ad2c5f5` |
| timing | **none read**. Every `wall`, `Duration` and `ms` was cut from the records |

## Per item the task names

- **Commit 1, `V4` group 4 (ruling 8): MET** (`…9dc4714f`).
  - `PUZZLE_DEEP=weakened` at the tip exits 1, with **1 failed and 13 passed**.
    - The failed row is **the gate row**: `expected 15 to be greater than or equal to 54`.
    - `PUZZLES … solved 15/58`. **A3 is ✓** (verbose reporter).
  - **The reach proof is stronger than the count.** All 97 per-row lines of the weakened run are byte-identical to
    base 3.2.7's. Each row carries its chosen move, depth and node count.
  - **Plant (a)**, the `mockImplementation` line deleted: 54/58, the gate row green, A3 red (`expected 54 to be less
    than 54`).
  - **Plant (b): "no leak reader", confirmed by reading.** Every default row is defined above line 364. Under
    `weakened`, the only rows after `gatingRun()` are the gate row and A3, and both read the memoized run.
  - **QE extra x1**, the `finally` reset that ruling 8 forbids: blind (54/58, gate green, A3 red). Ruling 8's "no
    reset" is load-bearing.
  - `PUZZLE_DEEP=1`: 18 passed, 54/58, 0 `NEWLY-` lines. All 58 rows are byte-identical to base, so the file-top
    spy changes no result. Default: 12 passed. The baseline file is unchanged.
- **The census, re-derived: MET.** The same 56 paths. Steps 1 and 2 at `476fdde0` are byte-identical to the SE's
  raw output when sorted (27 and 103 lines). **One (iv)**, `puzzle-suite.test.ts:368-374`.
  - QE's widened census (other env-read spellings; `mockImplementation`, `vi.fn`, `vi.stub*`, `vi.hoisted` and
    `vi.mocked` inside gate regions) adds no member.
  - The C4 files' file-top mocks are class (i) wherever they are read: QE's first-hop `V4` plants were red in
    `levels`, `search.ordering`, `search.pvs-lmr` and `transposition`.
- **Commit 2, `V2` + `M9b` + `ABC-143` A5 (ruling 9): MET** (`…29f4d3e9`).
  - **The six rows AGREE by content at `49997a87`, on plant files new to this ticket** (`render`, `frame`,
    `moves`, `evaluate`).
  - **`M9b` is killed by the exit-code-only row alone.** The other five rows agree under it.
  - **0 `deprecat` lines in all 12 consoles.** `npm test`'s console equals the plain default reporter's
    (normalised, 19 = 19 lines): **the reporter adds no line**. `QE-152-a` is closed.
- **Commit 3, comment-only (ruling 10): MET.**
  - The 8 `+`/`-` pairs are all comment lines, at exactly the named sites. `expect(` is unchanged per file.
  - Each new line states the mechanism the code now has (checked against the code).
  - `QE-152-d` is closed for its sites.
- **`src/cli.test.ts` line 6: STALE.** This is the new `QE-152-i` (LOW), and it is routed to the Architect. QE
  did not fix it. See below.
- **Gates at the tip: green.**
  - lint, typecheck and build exit 0; `npm test` exits 0 at 56 / 1741;
  - skip 0; integrity `No findings.`; inventory 56 = 56.
- **`V5`: MET.** Over `91024242..49997a87`, 15 test files changed. `expect(` is equal per file except
  `src/cli.test.ts` 321 → 324 (declared). No skip, only or todo was added. 56 / 1741 / 0.
- **`V7`: re-run on QE's call, MET.** **20 of 20 consecutive green `npm test` runs** in 20, each at 56 / 1741, with
  0 failed, 0 skipped, 7/7 `*.nfr` files and 0 unhandled.
  - The Architect read the screen as not re-owed. QE ran it because it is cheap and the delta adds a file-scope
    automock to a default-lane file.
- **UAT-waiver measurement:** empty. The delta's only non-test file is `tools/grugops/result-file-reporter.js`.
- **The dry-run merge against `main` `9ad2c5f5` CONFLICTS in `plans/traceability.md`** (`QE-152-k`, INFO).
  - Both sides only append rows at the tail of the same table. A `--union` resolution keeps all four `ABC-152`
    rows and leaves no markers.
  - **The merged tree is green:** 4 gates at 0, 56 / 1741, skip 0, integrity and inventory clean.
  - It was aborted, and nothing was committed. This hop's own trace row adds one more tail row, so the conflict
    stays and resolves the same way.

## `src/cli.test.ts` line 6: QE's ruling, as the task asked

- **The line:** "it is not an `*.nfr.test.ts`: nothing here re-routes the module graph."
- **It is stale, and it went stale at `88009d0b` (R1), not at `49997a87`.** QE's first hop missed it in `QE-152-d`.
- **Why it is stale:** under the project's own definition, `vi.mock` hoisting re-routes the module graph for every
  test in its file (`ABC-030`). The file's one `vi.mock`, `vi.mock("./glyph-mode.ts", { spy: true })` at `:53`, does
  exactly that.
  - **The A5 guard rests on that re-route.** "selectGlyphMode is not called" expects 0 calls. It sees
    `cli-options.ts`'s call only because every importer of `glyph-mode.ts` is routed through the automock. QE's
    first-hop `V4` plant there went red (`called +0 times, but got 1 times`).
  - So line 6 misstates the mechanism a guard rests on. That is the class ruling 10 calls a trap.
- **On the call-through reading it is defensible** ("no behaviour is re-routed"). This is the SE's reading
  (`…d04191a4` choice 3). `render-seam`'s admitted header avoids the claim rather than making it.
- **Route: the Architect** (a ruling 10 extension: one comment line, comment-only, its own commit, or a follow-up).
  - It is not blocking: every guard is armed, and no result is wrong.
  - QE wrote no fix.

## Gaps (`…e0c0d051`)

| id | severity | one line |
|---|---|---|
| `QE-152-i` | LOW | `src/cli.test.ts:6` is stale (above). Architect |
| `QE-152-j` | INFO | `RISK-ABC152-SPY-QUERY` at the weakened site. One `?` import of `evaluate` in `quiescence.ts` blinds weakened fully (54/58, A3 red). **The same happens on base 3.2.7**, so it is not a regression. The graded reading (gate row red at 15) catches it, and so does A3 |
| `QE-152-k` | INFO | The dry-run merge conflicts on `plans/traceability.md`. It is append against append; union-resolvable |
| `QE-152-c` | LOW, unchanged | The exit-code-only margin still reads 99.43% lines |

## Ruling 7

**0 cases.** Nothing needed a deletion, skip, move or weaker assertion.

## Exit

- **Route (the Orchestrator's):** the next stop is `In Security/NFR` (the `V12` review, then the width-1 window
  `V9`–`V11`, and the `RISK-ABC152-PUZZLE-SPY` wall reading). Send `QE-152-i` to the Architect in parallel. If the
  Architect wants the line in this ticket, it is one comment-only SE commit, and QE re-checks only that line.
- The Scribe still owes the post-merge `AGENTS.md` items (`…e50fbbe3` "Owed elsewhere"; first-hop register).
- QE has not merged, has not pushed, and did not touch `plans/board.md` or production code.
