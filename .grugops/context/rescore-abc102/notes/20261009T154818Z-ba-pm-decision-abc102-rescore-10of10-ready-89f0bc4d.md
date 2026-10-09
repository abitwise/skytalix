---
id: 20261009T154818Z-ba-pm-decision-abc102-rescore-10of10-ready-89f0bc4d
kind: decision
by: ba-pm
at: 2026-10-09T15:48:18Z
verified_by:
confidence: high
refs:
  - ABC-102
  - ABC-120
  - ABC-046
  - ABC-045
  - ABC-035
  - ABC-078
  - ABC-081
  - ABC-038
  - ADR-0021
  - N8-LANE
  - NFR-008
  - plans/tickets/ABC-102-undo.md
  - memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md
  - .grugops/context/ruling-abc046-quit-arm/notes/20260919T110500Z-architect-design-decision-shape-b-is-ruled-two-arms-eight-states-eighteen-transitions-and-the-pull-order-a4f83d02.md
  - .grugops/context/qe-ABC-120/notes/20260919T222000Z-qe-e2e-decision-abc120-pass-15-of-15-mutants-red-a7-a8-byte-identical-by-hash-a9-18-a10-met-one-imprecision-named-6b1e4d2f.md
  - .grugops/context/ticket-to-pr-ABC-046/notes/20260920T043500Z-software-engineer-claim-four-gates-green-at-6cdde15-42-files-1361-tests-0-skips-32-production-lines-one-self-fix-8d4f2a19.md
  - .grugops/context/qe-ABC-046/notes/20260924T201600Z-qe-e2e-decision-abc046-delta-pass-d1-d2-true-disarm-exactly-as-licensed-a8-holds-42-1364-0-66ca031f.md
supersedes:
---

# `ABC-102` re-score: 10/10, 0 ⚠️ — MET, page set `Ready`. Two product rulings added (6: drop the `help` heading; 7: `messages: []`), refusal worded

Hand-authored, no `seal` (degraded posture per `AGENTS.md`: no `scripts/context-io.ts` /
`scripts/claim.js` / `mcp__grugops__propose_note` on this install, `context.human_admission` `off`,
so no `finding` is admissible). Recorded as a `decision` per `agent-factory/contracts/context-note.md`.
Base: `grugops/wave-2026-09-25` @ `f952983`, worktree `.claude/worktrees/rescore-abc102`.

## Blockers on the cut page, each verified at source today

| blocker (as cut 2026-08-16) | state on `f952983` | evidence read |
|---|---|---|
| contract-shape ruling (same as `ABC-046`) | **closed** — `ADR-0021` `accepted` | ADR status line; clauses 4, 7 |
| the arm ticket | **closed** — `ABC-120` `Done` | `src/turn-loop.ts:143` (arm), `:377-384` (transition 18), `:436` (the one derive) |
| `ABC-046` on the shared table | **closed** — `Done` | `src/command-input.ts:98-105` (6 rows, no `undo`), `:241-254` (wrapper) |
| `EPIC-004` engine reply | **closed** — `ABC-078`…`ABC-081` `Done` | `src/cli.ts:175`; TT cleared per call `src/engine.ts:469`, seam reads only `history.position` `:515` |
| `ABC-035`/`ABC-037`/`ABC-043` | **closed** — `Done` | board `## Done` |

Board columns read only (fenced, not edited). No in-flight lane touches `src/command-input.*`
(`ABC-086`, `ABC-082` are engine code).

## What `ADR-0021` clause 4 (and 7) leaves to this ticket — named and now ruled

1. **The 0-/1-ply boundary is the seam's.** The loop guards nothing on `plies`; `takeBack` clamps
   (`src/history.ts:95-97`), so an unguarded `takeBack(history, 2)` at ply 1 silently resets.
   Ruling 3 stands; `A2` pins both 0 and 1.
2. **The refusal wording is this ticket's.** Ruled: exactly `nothing to undo`, one item, 15
   columns (≤ 17, `ADR-0021` clause 6's bound), on the `command` arm. True at ply 0 and at ply 1
   (the human is always Black there and has not moved). The loop's own comment already uses the
   phrase (`src/turn-loop.ts:382`).
3. **`messages` on a successful `undo`** (clause 7 writes `messages` unspecified) — ruling 7:
   `[]`, as `new`. The redrawn board and history pane are the confirmation.

## The input this hop found open, and ruled — the help region

`ABC-046`'s Engineer recorded that `help`'s second row was already 21/21 columns. Measured here
(scratch script outside the repo, real `assembleFrame`, start position and claimable fixture,
unicode and ascii — identical):

| `help` items | start position (narrowest) | claimable position |
|---|---|---|
| today, 6 tokens + heading | `commands: help board` / `quit claim resign new` — hidden 0 | one row, hidden 0 |
| + `undo`, heading kept | `commands: help board` / `quit claim (+3 more)` — **hidden 3, `ABC-035` `A7` RED** | one row, hidden 0 |
| + `undo`, no heading | `help board quit claim` / `resign new undo` — hidden 0, 6 cols spare | hidden 0 |
| + `undo`, heading `cmds:` | `cmds: help board quit` / `claim resign new undo` — hidden 0, 0 spare | hidden 0 |

`MESSAGE_ROWS` is 2 (`src/frame.ts:45`) — there is no third row to spend. `ABC-035` `A7` says
*"shorten the help, never widen the frame"*; `ABC-035` `A4` requires every token named, not a
heading. **Ruling 6: drop the heading.** `cmds:` was priced (0 existing rows red vs 2) and
rejected: an abbreviation of a word the player did not need, at zero headroom on both rows.
Cost, named on the page: `src/command-input.test.ts:459` and `:1121` (`COMMAND_TABLE.length + 1`)
re-point to `COMMAND_TABLE.length`; the foreign-list row `:451-456` loses `undo` as `resign`/`new`
did. Both are this ticket's own test file, inside `A9`.

## Criteria — what changed and why

- **`A5` re-pointed in-process** (`runLines`, `src/command-input.test.ts:350`, which records the
  status handed to each frame). The cut's test note 6 put it in the entry-point spawn file; under
  `N8-SPAWN`'s test, a child that an in-process assertion can replace is a convenience the ticket
  pays for, and `src/cli.ts`'s wiring of the wrapper is unchanged and already spawn-guarded by
  `ABC-046`. So: **0 new children**, `src/cli.test.ts` byte-identical.
- **`A1`/`A2` gained exact outcome values**; `A2` gained "zero extra derives" on the refusal.
- **`A6` gained the tolerance/near-miss rows** (`UNDO`, `und`, `undoo`, `undo 2`).
- **`A8` is new** (help names `undo`, no heading, `ABC-035` `A7` green); the old `A8` is now `A9`,
  licensing exactly `src/command-input.ts` + `src/command-input.test.ts`.
- **A trap named in test note 5:** `ABC-035` `A1`'s sweep asserts the arm equals the row's
  `outcome` at `RICH_FEN` ply 0, where `undo` answers the refusal — the row must not be flipped
  to `command` to pass it.

## `N8-LANE`, priced on today's lane (not a conforming `ADR-0019` reading)

- In-file: `npx vitest run src/command-input.test.ts`, n = 5: 133 rows, vitest `tests` 22–24 ms
  (median 23 ms), process CPU 1.19–1.24 s. ~12–15 new rows → **expected ≲ 10 ms**. 0 files, 0
  children.
- Lane: `/usr/bin/time -p npx vitest run --dir src`, n = 3, all exit 0, 48 files / 1467 tests:
  CPU (user+sys) 22.70 / 23.38 / 23.80 s, median **23.38 s**, wall 6.40–6.49 s, 1-min load
  2.31 / 5.24 / 6.52 (two sibling BA/PM hops live). **Non-conforming** (no interleave, no null
  control, n < 7): REPORTED, NOT RULED. The last RULED state is 14.940 s / 15 s MET at `2c96dbd`
  (40 files). The breach question is Architect/Design's (`ADR-0019` trigger (a)); this ticket adds
  no file and does not change it. Written per `plans/nfr-catalog.md` § `A6` consequence 1: the
  milliseconds, then the clause state — never "MET" as a statement about the budget.

## DoR: 10/10, 0 ⚠️ — MET

Items 3 and 10 (the two ⚠️ of 2026-09-19) closed by merges, not argument. The two open inputs found
this hop (refusal wording; help-region collision) are BA/PM's product pen and are ruled on the page
(rulings 3, 6, 7) — not deferred. Size `S`, priority `P1`, unchanged. Page front-matter set
`status: ready` / `column: Ready`.

## What this note does NOT do

- It does not move `ABC-102` on `plans/board.md` — fenced; `Backlog → Ready` is the Orchestrator's.
- It does not touch `src/`, `AGENTS.md`, `plans/nfr-catalog.md` or any ADR.
- It does not rule `NFR-008`.
