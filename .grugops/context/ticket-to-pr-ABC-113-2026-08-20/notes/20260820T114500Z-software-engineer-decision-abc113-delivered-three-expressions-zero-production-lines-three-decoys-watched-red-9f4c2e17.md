---
id: 20260820T114500Z-software-engineer-decision-abc113-delivered-three-expressions-zero-production-lines-three-decoys-watched-red-9f4c2e17
kind: decision
by: software-engineer
role: software-engineer
task: ticket-to-pr-ABC-113-2026-08-20
at: 2026-08-20T11:45:00Z
verified_by:
confidence: high
refs:
  - ABC-113
  - ABC-043
  - ABC-044
  - ABC-108
  - EPIC-006
  - agent-factory/workflows/04-ticket-to-pr.md
  - agent-factory/workflows/05-pr-quality-gate.md
  - agent-factory/workflows/16-context-read-write.md
  - agent-factory/workflows/17-task-claim.md
supersedes:
---

# `ABC-113` is delivered on `grugops/abc113-two-instrument-residuals`. Three expressions, zero production lines, and all three decoys WATCHED going red

## Why this is a hand-authored `decision` and not a stamped `finding`

This install has **no `scripts/context-io.ts`, no `mcp__grugops__propose_note` and no stamp issuer**.
Workflow 05 says a green `§14-gate#<id>` verdict is minted by `emitVerdict` and never hand-written, and
Workflow 16 says a `finding` is admissible only against a live green verdict. Neither exists here, so
**no `finding` is written and no `§14-gate` stamp is quoted.** The gate ran and it was green; that
result is recorded here as a `decision` at `confidence: high` because I ran the commands, and NOT as a
stamped verified finding. A green stamp no issuer minted would be the most expensive lie in the trace.

## What changed — two files, three expressions, and nothing else

- **`src/cli.test.ts` (`A1`, `A6`).** One row added inside `ABC-043` `A1`'s existing `it`:
  `expect(entry.match(/\bhistory\s*[:=]/g), "…").toHaveLength(1)`. It is asserted over
  `executableCodeOf("cli.ts")` and never raw source (`## Test notes` 1), and it is a **COUNT**, not a
  `not.toContain` on a literal (`## Test notes` 2). **The existing three rows are untouched — this
  ADDS.** It is placed **before** the window-anchored shorthand row, deliberately: on a decoy build the
  count is then the row that speaks first, which is what makes `A5`'s watched-red unambiguous rather
  than shadowed by a neighbouring row's failure. The comment beside it names **`M10`** and **`D3`**,
  states the pre- and post-repair instruments are **INCOMPARABLE, not ordered**, and says this row is
  what makes the current instrument stronger than both (`A6`).
- **`src/result-screen.test.ts` (`A2`).** The two `not.toContain` rows in the `NEITHER STRING IS A
  SUBSTRING` block retargeted from the joined screen to `screen.split("\n")[1]`. **BOTH directions and
  BOTH pairs kept** (`## Test notes` 3). **`ABC-044` `A2`'s four word rows are NOT deleted and NOT
  edited** (`## Test notes` 4).
- **Nothing else.** No production file, no `vitest.config.ts`, no lane configuration, no new file, no
  new `it`, no dependency, no worktree.

## `A3` — the fence held, and it is the reason the routing was right

```
git diff --name-only main...HEAD -- src/
  src/cli.test.ts
  src/result-screen.test.ts
```

Exactly two, nothing else. `git diff main -- src/cli.ts src/result-screen.ts src/frame.ts` is **empty**
— every non-test file under `src/` is byte-identical. **Security/NFR's own falsifiable firing threshold
("it fires if the diff touches any file under `src/` other than the two test files") did NOT fire**, so
the pull's width-1 routing stands on measurement rather than on convenience. Nothing wanted a production
file at any point; there was no moment where handing back was on the table.

## `A4` — the lane did not move

`npx vitest run --dir src` → **40 files / 1207 tests / 0 skipped**, green. Skip count re-derived
independently via `--reporter=json` → **0**. The CONTAINED lane, never the repo root (`## Test notes`
5) — the one time a bare `npx vitest run src/cli.test.ts` was used by mistake it swept 15 leftover agent
worktrees, which is exactly what that note warns about; it was discarded and re-run contained.

## `A5` — every close was WATCHED RED, with the failing test named

Each decoy was planted at the branch tip, run, then reverted with `git checkout --`; `src/` was clean
after each.

- **`D3` — shadowing-parameter rebind** (`src/cli.ts`: the call wrapped in
  `await (async (history: GameHistory) => runTurnLoop({ history, … }))({ ...history })`). `tsc --noEmit`
  **clean** — it is a build the typecheck accepts. Failing test:
  **`src/cli.test.ts > ABC-043 — the live session > A1 — \`runTurnLoop\` is called ONCE, with all six
  options, and with no cast and no adapter`**, on
  `expected [ 'history =', 'history:' ] to have a length of 1 but got 2`. **1 failed / 1206 passed.**
  **The same decoy was ALSO run against `main`'s instrument (`git show main:src/cli.test.ts`) and the
  lane was 40 files / 1207 tests GREEN** — the blind spot was reproduced before it was closed, which is
  the whole claim of the ticket's half (1).
- **`M9` — flat copy** (`const decoy = { ...history };` with `history: decoy,` at the call). `tsc`
  **clean**. Same failing test, same count row: `to have a length of 1 but got 2`. **1 failed / 1206
  passed.**
- **`M11b` — the named wrong build** (`fivefold-repetition` → `"by repetition"`,
  `threefold-repetition` → `"by repetition. it was claimed by the player to move under FIDE 9.2"` in
  `src/result-screen.ts`). Failing test:
  **`src/result-screen.test.ts > ABC-044 A2 — a CLAIMED draw and an AUTOMATIC one are distinguishable >
  NEITHER STRING IS A SUBSTRING OF THE OTHER, which inequality alone does not buy`**, on
  `threefold-repetition's headline contains fivefold-repetition's: expected 'Draw by repetition. it was
  claimed by…' not to contain 'Draw by repetition.'`. **Against `main`'s
  `src/result-screen.test.ts` the same mutant produced 2 lane failures and that test was GREEN; with the
  retarget it is 3 lane failures and that test is RED.** The dead-row claim is therefore measured on
  both sides of the change, not asserted.

`git status --porcelain` carries **no decoy residue** afterwards — the only entries are this ticket's own
two test files, the claimed subtask move, and the docs written this hop.

## `A2` IS RECORDED AT ITS OWN SIZE AND IS NOT UPGRADED

This half buys **non-vacuity and the criterion's own words. It does NOT buy new coverage.** `M11b` also
reddens the sibling `automatic` word row, and **a mutant that the headline rows kill ALONE is
unconstructible while those word rows stand** — a substring relation forces the forbidden word into the
other screen. That is the ticket's own sentence and it is repeated here rather than improved on.

## THE ONE THING THE TICKET DID NOT ANTICIPATE, disclosed rather than smoothed

**The literal `M9` decoy is ALREADY killed on `main`.** Run against `main`'s `src/cli.test.ts`, `M9`
fails on `ABC-043`'s window-anchored shorthand row — `expected 'runTurnLoop({\n      history: decoy,…'
to match /\bhistory,/` — 1 failed / 1206 passed. So `A1`'s claim that the new row "kills `D3` and `M9`"
is **true as written** (`M9` → 2, RED) but the count row is **not the only instrument that sees `M9`**;
the ticket's own `A1` comment already records that the anchored shorthand row was built for exactly that
build. **`A1`'s incremental value is `D3` alone.** Nothing is broken by this and nothing was changed to
accommodate it — it is recorded so the next reader does not credit the count row with more than it added.

## What I chose NOT to fix, and why

- **`npm run lint` (`biome check .`) still exits 1 on the 32 gitignored agent worktrees.** NOT fixed and
  NOT worked around: it was retired as environmental at `ABC-044` and the worktrees are an open defect
  that is not this ticket's. **`npx biome check src/` was the command run** — exit 0 over 68 files —
  and that substitution is stated plainly rather than reported as `npm run lint` passing.
- **No worktree was created for this work.** The 32 stale in-repo agent worktrees are an open defect,
  not a pattern to copy.
- **`vitest.config.ts` and every lane configuration untouched.** The owner's ask to exclude directories
  from the lane is queued as its own ticket at `.grugops/context/cut-lane-scope-exclude-2026-08-20/`.
  Folding it in here would have destroyed `A4`'s pin — the pin is only meaningful against the same lane
  the Orchestrator measured on `main`.
- **`ABC-043` and `ABC-044` are NOT re-opened, re-scored or amended.** Two of their assertions are
  edited; neither of their pages was opened for editing.
- **Nine other rows in `plans/traceability.md` are not 10 columns.** They are pre-existing, they are not
  this ticket's, and repairing them silently would hide nine separate decisions. **NOT touched.**
- **`.grugops/test-skips.md` does not exist**, so `tools/grugops/test-skip-integrity.js` cannot run
  against it. The measured skip count is **0** and no registry was authored — Workflow 05 makes that
  registry human-only, and an agent writing its own justification to clear its own gate is the failure
  mode that rule exists for.

## ONE ROW REPAIRED IN `plans/traceability.md`, AND IT IS DECLARED

The `ABC-113` row arrived carrying **eleven columns and no closing pipe** — the pull's `→ In
Development` text had been written as a raw twelfth `|`-field rather than appended inside `Status`. It
is folded back into `Status` and the closing pipe restored, so the row is 10 columns like the header.
**10 columns re-asserted by re-splitting the row from disk after the write.** No other row touched.

## Gate result — Workflow 05, `gate_enforcement: blocking`

- **lint** — `npx biome check src/` → exit **0**, 68 files. (`npm run lint` NOT run; see above.)
- **typecheck** — `npm run typecheck` (`tsc --noEmit`) → clean.
- **unit** — `npx vitest run --dir src` → **40 files / 1207 tests / 0 skipped**, green.
- **build** — `npm run build` (`tsc --noEmit`) → clean.
- **test-integrity** — skip count **0**; no `.grugops/test-skips.md` exists → recorded
  `UNKNOWN - verify`, human-owned, never read as a pass.
- **self-fix attempts used: 0 of 2.**

Terminal result in Workflow 05's vocabulary: **`READY_FOR_HUMAN_REVIEW`** — recorded as this role's
honest report of what it ran, **with no `§14-gate` verdict note, because no issuer exists to mint one.**

## What this hop does NOT do

**It does not merge and it does not deploy.** `autonomy` is `pr`; `main` is the Orchestrator's and
humans hold merge. The `In Review` exit, the QE break, and the UAT-waiver call (which the pull
pre-registered as measured over `main...HEAD`, never `<tip>~1`) all remain other roles' and the human's.
