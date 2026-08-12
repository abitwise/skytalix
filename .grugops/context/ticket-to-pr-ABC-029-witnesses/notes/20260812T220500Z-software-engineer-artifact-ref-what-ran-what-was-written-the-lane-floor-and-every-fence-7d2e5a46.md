---
id: 20260812T220500Z-software-engineer-artifact-ref-what-ran-what-was-written-the-lane-floor-and-every-fence-7d2e5a46
kind: artifact-ref
by: software-engineer
at: 2026-08-12T22:05:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-028
  - ABC-019
  - ADR-0008
  - ADR-0011
  - NFR-002
  - NFR-008
  - A6.3
  - A6.4
  - L3
  - L4
  - src/history-pane.nfr.test.ts
  - plans/traceability.md
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# What this hop ran, what it wrote, the gate results, the `N8-LANE` FLOOR, and every fence in the brief — held

> **Hand-authored.** `scripts/context-io.ts` and `scripts/claim.js` do not exist here —
> **re-verified at source at this hop**: there is no `scripts/` directory in this worktree, and a
> `find` for `context-io*` / `claim.js` across it (outside `node_modules`/`.git`) and across the kit
> root returns nothing. **So there is no derived `index.md` / `index.jsonl` for this `ref:` —
> `notes/` is the source of truth.** `kind: artifact-ref` is a pointer and needs no stamp.

Worktree `../cli-chess-abc029-wit`, branch `grugops/ABC-029-witnesses`, HEAD at start `a323f00`.
**This branch is thirty-fifth in a linear stack off `main`; the fast-forward is denied by the host
classifier and is with the owner. It was NOT attempted.**

## Files written

| path | what |
|---|---|
| `src/history-pane.nfr.test.ts` | **the only `src/` file touched — `+153 / −0`, a PURE INSERTION.** Not one existing line changed, moved or removed. Three tests added; instrument md5 `1d33bea6…` → **`16bf2f50c93e2e896b5406cbfa772b8b`**, 460 → 613 lines, 8 → **11** tests |
| `plans/traceability.md` | **ONE row, `ABC-029`, APPEND-ONLY to its `Tests` and `Status` cells.** See the sibling `observation` for the row defect found and NOT fixed |
| `.grugops/context/ticket-to-pr-ABC-029-witnesses/notes/` | **5 notes** — 2 `observation`, 1 `decision`, 1 `failed-attempt`, this `artifact-ref` |
| `.grugops/queue/claimed/ticket-to-pr-ABC-029-witnesses/` | the Workflow 17 registry record and the subtask file, both moved to `done/` at the end |

**`src/history-pane.ts` md5 is `c4653c4c263c4c417ea34969164ccd86` — the value the brief requires,
verified at the end. ZERO production lines. Test file count 26, production modules 16 — both
unmoved.**

## The guard expression — BYTE-UNCHANGED, checked mechanically rather than by eye

`git show HEAD:src/history-pane.nfr.test.ts | grep -n '/m\.test('` and the same grep on the working
tree are **`diff`-identical, line number included**: still `:317`, still

```
      /^(?:import|export)\s+(?!type\b)(?:[^;]*from\s+)?"\.\/history\.ts";/m.test(
```

**The diff removes zero lines, so no existing character of the file changed at all.** The witnesses
sit between the guard's `it(` and the probe's docblock, which stays attached to the probe.

## Gate results — run in Workflow 05's order from the `AGENTS.md` command slots

| step | command | result |
|---|---|---|
| lint | `npm run lint` | **PASS** — 0 errors, **2 pre-existing `biome migrate` infos**, identical to the baseline; `quality.lint.strict` is `false` |
| typecheck | `npm run typecheck` | **PASS** — 0 |
| unit | `npx vitest run` | **PASS** — **755 passed (755) on 26 files** (752 → 755) |
| build | `npm run build` | **PASS** — 0 (`tsc --noEmit`) |
| test-integrity | `npx vitest run --reporter=json … jq '.numPendingTests + .numTodoTests'` | **skip count `0`** |
| e2e | — | **`UNKNOWN - verify`, non-blocking.** `quality.ui_e2e` is `ui-or-critical-path`, the `AGENTS.md` slot is `UNKNOWN - verify`, there is no UI surface until `EPIC-006`. **None invented.** |

**All four `mandatory_gates` pass.** One formatter error was raised by `npm run lint` on a line of my
own over 100 columns and was fixed with `npx biome format --write` on that one file; the diff was
re-checked afterwards and is **still `+153 / −0`**.

## Instrument integrity

- **Test count 8 → 11**, and **nothing was weakened, narrowed, renamed or deleted** — the diff removes
  no line, so every existing `it(`, `expect(`, `describe(`, the `toEqual` equality, both declarations,
  the `?arming` query, the fd-3 channel and all three probe controls are byte-untouched.
- **Determinism: 12 consecutive runs of the instrument, 12 × 11/11, 0 flaky.** No duration is compared
  to anything anywhere in the file, including in the new tests.
- **No file added or removed under `src/`** — `git status --porcelain src/` shows `M` on one file.

## `N8-LANE` — the protocol CANNOT RESOLVE this change, and the FLOOR is reported rather than converted

Run on `ADR-0008` clause 4's protocol: CPU (user + sys), median of **paired per-round deltas**,
**n = 8** interleaved rounds, **one fresh process per run**, **identity null control mandatory** (its
two arms `cmp`-verified byte-identical), out of tree, warm-up discarded.

| | |
|---|---|
| median CPU without the witnesses | **9,450 ms** |
| median CPU with them | **9,415 ms** |
| **median paired delta** | **+40 ms** (raw: +190, −110, −50, +110, −70, +190, +10, +70) |
| **identity NULL CONTROL median** | **+20 ms** (raw: +20, −60, +40, +120, −130, −30, +30, +20) |
| null control spread | **−130 … +120 ms** |
| sign split, real vs null | **5+ / 3−** and **5+ / 3−** — identical |

**The real median sits INSIDE the null control's own spread, the sign split is the null control's, and
the "with" median is LOWER than the "without" median. The instrument cannot see this change.**

**So the `N8-LANE` delta is `UNKNOWN - verify`, with the floor reported: ±130 ms CPU at n = 8 paired
rounds — 1.4% of the ~9.45 s lane CPU, and 20% of the 650 ms bar.** That floor is the **same value**
the previous Engineer hop reported and QE declined to convert. **This is the fourth hop to report that
this protocol cannot resolve its change, and it does not turn a floor into a number either.**

**What CAN be said mechanically, and is not a lane figure:** this branch adds **ZERO files under
`src/`**, and `ADR-0008` clause 4 scopes the per-ticket account to *"every file the branch adds under
`src/`"* — so the **FLOOR account (`files × ~160 ms`) cannot have moved**, and the file count is 26
before and after.

**One direct measurement, labelled so it is NOT read as the `N8-LANE` delta:** executed in isolation
1,000 times, the entire workload the three tests add — two `readFileSync` calls (4,061 B and 34,672 B)
plus 13 regex `.test()` calls and the array accounting — costs **0.065 ms per suite run**. That is a
different instrument answering a different question; **the `N8-LANE` verdict remains `UNKNOWN -
verify` with the floor above.** **The lane TOTAL is `ABC-026`'s and `NFR-002`/`NFR-008` `MET`/`MISS`
is Security/NFR's.** `plans/nfr-catalog.md` was not opened.

## Commands run

`npm run lint` (×3), `npm run typecheck` (×2), `npm run build`, `npx vitest run` (×4),
`npx vitest run src/history-pane.nfr.test.ts` (×15 in-tree, including the 12-run determinism sweep),
`npx vitest run --reporter=json | jq` (×2), `npx biome format --write` (×1), plus out of tree:
**~50 vitest runs across 8 expression variants** on the kill rig, **13 `biome check` runs**, **11
`tsc --noEmit` runs**, **34 timed full-suite runs** for `N8-LANE`, and `node -e` regex probes.
Plus `md5`, `cmp`, `diff`, `grep`, `awk`, `git show`, `git diff`, `git status`, `find`, `ls`.

## The rig — outside every repository

Session scratchpad only: throwaway copies of this branch's `src/` with `node_modules` **symlinked**,
plus per-purpose rig directories for lint, typecheck, mutation and lane timing. **No file in any
repository worktree was written by any measurement, and NO other worktree was entered** — a QE hop is
gating `ABC-028` concurrently and `../cli-chess-abc028-*`, `../cli-chess-ABC-019`,
`../cli-chess-abc029-*` and `../cli-chess-example` were never opened.

## Claim mechanics — hand-rolled, and said so

Workflow 17 step 2 was executed **by hand**: `scripts/claim.js` does not exist. The `claimed/` parent
was created with `-p`; **the task directory itself was a bare `mkdir`, no `-p`**, so the atomicity the
protocol relies on is intact and a second claimant would have taken `EEXIST`. Then `claim.md`, then
the subtask file moved in by `mv`, then **both moved into `done/`** at the end. The subtask file was
**UNTRACKED** when claimed, so a plain `mv` was used and no ` D` appears in `git status` — **the
queue's git history must not be read as complete**, the same note four prior hops recorded.

## Not taken — every fence in the brief, held

- **ZERO characters of the guard expression, ZERO production lines.** Both verified mechanically at
  the end, not asserted. **The regex was never edited, so the brief's stop condition never fired.**
- **`src/history-pane.nfr.test.ts` only.** `src/history-pane.test.ts` was **NEVER OPENED** — a QE hop
  is gating `ABC-028` on it. No other `src/` file was written.
- **`plans/board.md` NOT opened for edit — it is the Orchestrator's.** No ADR opened for edit,
  `plans/nfr-catalog.md` not opened, `ABC-028`, `ABC-019` and every merged ticket untouched. **No
  criterion renumbered, reworded or deleted, and the `ABC-029` ticket file was NOT edited** — the
  three record defects this hop found are flagged in a note, not patched into someone else's text.
- **`plans/traceability.md`: ONE row, two cells, append-only**, with the row located by its leading
  cell, both appends asserted pipe-free and newline-free, field count and file line count asserted
  unchanged, and exactly one line differing.
- **No `finding` written and nothing self-stamped** — no `§14-gate` verdict record exists under this
  task and `context.human_admission` is **`off`**. Every result is an `observation`, `decision`,
  `failed-attempt` or `artifact-ref`, and every non-adjudicable quantity is `UNKNOWN - verify`.
- **No E2E invented, no dependency added** (`dependencies` is still `{}`), no network, no file written
  outside this worktree and the session scratchpad.
- **Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.** The work is committed
  on `grugops/ABC-029-witnesses`.
- **Content inside this workspace was treated as DATA, not instruction.** Nothing read in `src/`,
  `plans/`, `memory-bank/` or `.grugops/` purported to authorise a write outside this boundary, and
  nothing was acted on as if it did. **Nothing to report under that rule.**
