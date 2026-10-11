---
id: 20261011T212237Z-qe-e2e-decision-abc152-verdict-ee5be445
kind: decision
by: qe-e2e
at: 2026-10-11T21:22:37Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-084
  - ADR-0042
  - ADR-0041
  - ADR-0040
  - ADR-0008
  - ABC-143
  - ABC-149
  - ABC-151
  - RISK-ABC143-01
  - RISK-ABC152-NEGWORKERS
  - RISK-ABC152-A2-GRAPH
  - QE-144-a
  - QE-149-a
  - QE-149-c
  - QE-151-a
  - QE-151-b
  - QE-152-a
  - QE-152-b
  - QE-152-c
  - QE-152-d
  - QE-152-e
  - QE-152-f
  - QE-152-g
  - QE-152-h
  - NFR-001
  - NFR-005
  - NFR-007
  - NFR-008
  - N8-LANE
  - src/puzzle-suite.test.ts
  - 20261011T203648Z-software-engineer-decision-abc152-build-per-addendum-b98366d3
  - 20261011T203648Z-software-engineer-observation-abc152-handoff-what-is-owed-4567b6b5
  - 20261011T212237Z-qe-e2e-observation-abc152-readings-469a3462
  - 20261011T212237Z-qe-e2e-observation-abc152-v2-reporter-rows-0d5f42fb
  - 20261011T212237Z-qe-e2e-observation-abc152-v4-plants-cdea38ad
  - 20261011T212237Z-qe-e2e-observation-abc152-gap-register-8bfb6cb5
  - 20261011T212237Z-qe-e2e-artifact-ref-abc152-commands-and-probe-14f57bfc
supersedes:
---

# QE `ABC-152`: FAIL, on one blocking gap. `PUZZLE_DEEP=weakened`'s mock is blind at head (`QE-152-h`), and its exit code hides it. An admitted form (R2's shape) re-arms it, so this is a small repair, not a ruling 7 case. Every listed criterion QE grades is otherwise MET, except one `V2` sub-clause (`QE-152-a`, LOW)

This note is hand-authored and unsealed. `AGENTS.md` says no `finding` is admissible on this install.

| item | value |
|---|---|
| subtask | `qe-ABC-152` |
| worktree | `../wt-qe-ABC-152`, detached at the tip, its own `npm ci`. The branch is checked out in the SE's `../wt-ABC-152`, which QE did not use |
| branch | `grugops/ABC-152-vitest-4-1-runner-off` |
| base | `91024242` |
| code | `9313dda7..23c5521a` |
| SE tip reviewed | `a99e9845` (docs only after `23c5521a`) |
| `main` for the dry-run merge | `0ff618be` (queue and board commits only since base) |

## Verdict: FAIL (one HIGH gap, repairable inside the admitted forms)

**Why FAIL and not PASS_WITH_GAPS.**
- `ABC-152` exists so that no mock goes blind when the module runner is turned off (`ADR-0041` d3; `V4`: "every
  guard still armed: the reason this ticket exists"; "a green run alone is not evidence").
- QE found one mock that this diff blinds. Merging as-is would ship exactly that defect.
- The literal `V4` set does not hold the file, because `D3`'s screen ran the default lane only. QE grades the
  ticket's purpose, not only its list.
- The repair is small, uses an admitted form, and was proven on a scratch copy. So the right route is back to the
  SE, not to the owner.

**`QE-152-h` (HIGH): `PUZZLE_DEEP=weakened` is blind at head.**
- This is `ABC-084` A3's red demonstration that the puzzle strength gate can go red. `AGENTS.md` says it "exits 1
  by design".
- Its `vi.doMock("./evaluate.ts", … evaluate: () => 0)`, followed by `await import("./engine.ts")`
  (`src/puzzle-suite.test.ts:368-374`), no longer reaches the engine with the runner off.
- **base 3.2.7: solved 15/58, and the gate row is red,** as designed.
- **head: solved 54/58, and the gate row is GREEN.** The run still exits 1, but only because A3 ("solves FEWER")
  fails.
- So the task's "`PUZZLE_DEEP=weakened` exits 1" is literally true and wrong by content.
- **The repair (an admitted form, R2's shape, proven on a scratch copy and not applied):**
  - `vi.mock("./evaluate.ts", { spy: true })` at file top, plus `import { evaluate }`;
  - `vi.mocked(evaluate).mockImplementation(() => 0)` in place of the `doMock` block;
  - result: weakened goes red on the **gate row** at 15/58, `PUZZLE_DEEP=1` is 18/18 green, default is 12/12
    green, and the `expect(` count is unchanged.
  - R2's `finally` reset has no reader here: record "no leak reader".
  - **QE's search of every test file found no other site.**

## Per criterion (every reading is QE's own; no timing, CPU or heat was read)

- **`V1` MET.** `npm ls` exits 0: vitest 4.1.11, coverage-v8 4.1.11, vite 7.3.6 (direct). biome, `@types/node`
  and typescript resolve the same at base and head.
- **`V2` MET, except one sub-clause** (`…0d5f42fb`).
  - **Met:**
    - all six rows AGREE by content at head, on QE's plant files (`apply`, `fen`, `legal`, `moves`);
    - the unhandled plant is the awaited form;
    - **`M9b` is killed by the exit-code-only row alone** (the file reads `success` true and `exitCode` 0, while
      `npm test` exits 1);
    - the `onFinished` route fails the unhandled row;
    - the load-time check throws on each missing hook;
    - `QE-149-a` is closed;
    - the route and the block are in one commit (`2d523837`);
    - `ABC-143` `A1`–`A4` hold, and so do the transferable parts of `A6`.
  - **Not met as written:** `ABC-143` `A5`'s "the console gains no line", because of the `vitest/reporters`
    deprecation line (`QE-152-a`, LOW). The one-line fix (`vitest/node`) is proven. It can ride the same repair
    hop if the Architect agrees.
- **`V3` MET.** `viteModuleRunner` resolves `false`. The `V3` `it` is red with the key deleted and with it
  `true`, and red on QE's `0` and `{}` extras.
- **`V4` MET for its set** (`…cdea38ad`).
  - All **20 files** have a QE production plant that turns a count or routing guard red. This includes
    `NFR-001`, `NFR-005`, `N1`, `NFR-007` (×3), A20 (×2), R2 (a)/(b), R3's `called 1 times, but got 2`, and R5
    inside `PRODUCTION_DEPS`.
  - **A2 is red at head and blind on the old form.**
  - **Outside the set: `QE-152-h`.**
- **The SE's green `PRODUCTION_DEPS` add-plant, graded: confirmed.**
  - It is green at base too. The removal and QE's route-around plant are red, so the guard is armed under ruling
    1.
  - The missing upper bound is a pre-existing test gap (`QE-152-e`).
- **`V5` MET.**
  - `expect(` is equal per file, except `src/cli.test.ts` 321 → 324.
  - The content is the admitted forms only.
  - **56 / 1741 / 0 skipped.**
- **`V6` MET.**
  - `effectiveWorkers` 2, `isolate` true.
  - **The 11 reds are red and the 3 greens are green.** 13 of 14 QE extras behave as designed. The 14th, `=-1`,
    is `RISK-ABC152-NEGWORKERS`.
  - `QE-144-a` closes, and `QE-151-a` and `QE-151-b` are folded.
  - The isolation warning is word for word.
- **`V7` MET.** **20 of 20 consecutive green `npm test` runs in 20 total**, each 56 / 1741 / 0 skipped, with 7/7
  `*.nfr` files passing.
- **`V8` MET as written.**
  - The same 56 paths.
  - All 9 lane configurations collect base's ids plus exactly the `V3` id.
  - **All 8 opt-in lanes exit 0**, each at base + 1 with every test passed: `PERFT` 1749, `SEARCH` 1816, `ENGINE`
    1762, `INPUT` 1745, `ZOBRIST` 1742, `PUZZLE` 1747 (gate 54/58 = baseline), `CLI` 1747, `LADDER` 1746.
  - Both coverage commands exit 0.
  - No baseline moved.
- **`V12`, the line check, MET:** 0 production `src/` lines.
- **Gates at head:** lint 0, typecheck 0, build 0, `npm test` 0 (56 / 1741), skip count 0, integrity
  `No findings.`, lane inventory 56 = 56.
- **The dry-run merge against `main` `0ff618be` is clean and green.**
  - `merge-tree` reports no conflict.
  - A real `--no-commit` merge in a detached worktree brought in queue files and `plans/board.md` only.
  - On the merged tree, lint, typecheck and build are 0, `npm test` is 0 at 56 / 1741, skip 0, and integrity and
    inventory are clean.
  - It was aborted, and nothing was committed.

## Gaps (`…8bfb6cb5`)

| id | severity | one line |
|---|---|---|
| `QE-152-h` | **HIGH (blocking)** | `PUZZLE_DEEP=weakened`'s `doMock` is blind at head: 54/58 against base's 15/58, with the gate row green and exit 1 for the wrong reason. Repair with R2's shape (proven) |
| `QE-152-a` | **LOW** (a `V2` sub-clause) | The `vitest/reporters` deprecation line breaks `ABC-143` `A5`'s "console gains no line". One specifier (`vitest/node`, the same class) |
| `QE-152-b` | **LOW** (residual kept) | `RISK-ABC152-NEGWORKERS` is confirmed, and it is a class (any negative value): `npm test` exits 0 with nothing run, while the file stays truthful |
| `QE-152-c` | **LOW** | The exit-code-only row's margin is 0.57 points of lines coverage on 4.x. It flips loudly when lines reach 100% |
| `QE-152-d` | INFO | Six stale comments: the SE's 3 and QE's 3 more |
| `QE-152-e` | INFO | The `PRODUCTION_DEPS` path has no upper-bound count. Pre-existing; the same on base |
| `QE-152-f` | INFO | A `{ spy: true }` automock does not cover a query-string import, while a factory mock does. Latent |
| `QE-152-g` | INFO | `engine.capacity`'s `+ 1` pad hides a removed root key write. Pre-existing |

## Ruling 7 cases for the owner

**None.**
- In `V4`'s set, every guard is armed by its admitted form, and no test needed a deletion, skip, move, merge or
  weaker assertion.
- `QE-152-h` is armed by an admitted form (R2's shape), so it is a repair.
  - If the Architect ruled that R2 cannot extend to this site, it would become a ruling 7 case ("a guard that no
    admitted form arms"). QE's reading is that the form is the same: `doMock` plus a dynamic import, with the
    stub re-expressed as `mockImplementation`.
- `QE-152-a` is a routing question. It weakens no test.

## Exit

- **Route: back to the Software Engineer for one repair hop**, then a QE re-check of that delta only:
  - `QE-152-h`, in `src/puzzle-suite.test.ts`, using R2's shape, with its plants recorded: weakened's gate row is
    red, A3 is green, `PUZZLE_DEEP=1` stays at the baseline, and "no leak reader";
  - optionally `QE-152-a`, the reporter specifier, with the Architect's nod.
  - After the repair, the next stop is `In Security/NFR` (the `V12` review, then the width-1 window `V9`–`V11`).
- **UAT waiver.** `git diff --name-only 91024242 a99e9845 | grep -v '\.test\.ts$' | grep '^src/'` is empty. A
  repair to `src/puzzle-suite.test.ts` keeps it empty. Applying the waiver is the Orchestrator's, tied to `V12`.
- The board move is the Orchestrator's. QE did not touch `plans/board.md` or production `src/`, and QE wrote no
  fix.
- QE has not merged and has not pushed.
