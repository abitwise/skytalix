---
id: 20260811T174000Z-software-engineer-artifact-ref-a4d70f26
kind: artifact-ref
by: software-engineer
at: 2026-08-11T17:40:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-027-dev
  - ABC-027
  - ABC-016
  - ABC-017
  - ABC-018
  - ABC-019
  - ADR-0010
  - EPIC-002
  - src/frame.ts
  - src/frame.test.ts
  - plans/traceability.md
  - plans/board.md
supersedes:
---

# Artifacts written at `ticket-to-pr-ABC-027-dev`, the BOARD ROW REQUESTED, and what was deliberately not written

> **Hand-authored** — `scripts/context-io.ts` absent from this repository and from the kit,
> `mcp__grugops__propose_note` not in this session's tools. **No `finding` in this task's notes.**

## Branch and commit

**Worktree:** `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-ABC-027`
**Branch:** `grugops/ABC-027-frame-clearing`, from current `main`
**Commit:** `194a9bc` — `fix(frame): grug make in-place writer clear each row as grug write it`
(2 files, +247 / −21). Staged by path, committed from the INDEX with no pathspec — recorded defect
`2cd84cd`. **No remote, nothing pushed, nothing merged, nothing deployed; `main` never checked out.**

## Written

| path | what | scope |
|---|---|---|
| `src/frame.ts` | **ONE changed expression** (`beginFrameSession`'s in-place branch: the rows are joined by `ERASE_TO_END_OF_LINE` + newline, the single trailing `\x1b[0J` kept), **ONE new module constant** (`\x1b[K`, shaped like the two beside it), **ONE header sentence** at `:27-32` that the change makes false. `assembleFrame`, `sanitize`, both append strategies and every other `src/` file untouched | `ABC-027` `## Scope`, `ADR-0010` cl. 1 |
| `src/frame.test.ts` | the screen model learns `\x1b[K`; the **five** assertion sites across four tests repaired; **`A6`** — `:735-771`'s characterization DISCHARGED and replaced, never deleted; a new `ABC-027` section with the narrowing fixture, one shared comparison helper and **`A1`–`A5`**. **ZERO test files added** | same |
| `plans/traceability.md` | **ONE ROW UPDATED IN PLACE (`ABC-027`), THREE CELLS: `Code (PR/files)`, `Tests`, `Status`.** No row appended, none removed, no other row touched. **`UAT` and `Release` left EMPTY on purpose** — nothing is UAT-able and nothing is released; filling them would be a fabricated trace, and the UAT ruling is the Security/NFR gate's, as it was on `ABC-018` | the Software Engineer's own |
| `.grugops/context/ticket-to-pr-ABC-027-dev/notes/` | this note + one `decision` + one `observation` | Workflow 16 |

## BOARD ROW REQUESTED — `plans/board.md` is the Orchestrator's and was NOT written

**ONE row, ONE column move: `In Development` → `In Review`.** The Software Engineer owns this
transition; the write does not belong to this role in this project.

**WIP, stated because the receiving column reaches its limit:** `In Development` **1/3 → 0/3**;
`In Review` **2/3 → 3/3** (currently `ABC-016` and `ABC-019`). **That is AT the limit, not over it,
so no override is needed — but the column is full afterwards and the next `In Development → In
Review` move is blocked until one of the three leaves.** Flagged rather than assumed away.

Suggested row, to be moved under `## In Review` with this appended to its parenthetical:

```
; **IMPLEMENTED 2026-08-11 by the Software Engineer at ticket-to-pr-ABC-027-dev (Workflow 05) on branch grugops/ABC-027-frame-clearing, commit 194a9bc — GATES GREEN ON DELIVERED CODE: lint 0 errors (2 pre-existing biome.json deprecation infos), typecheck 0, build 0, 681/681 on 22 files, skip 0, ZERO test files added** — exactly BA/PM's out-of-tree projection, met on delivered code; **ALL SIX CRITERIA MET** and **every one witnessed FAILING on three mutants ON THIS BRANCH, not inherited from the cut**: merged writer → A1/A2/A6 red, partial fix clearing only the first 5 rows → A1/A2/A6 red, degenerate fixture whose W no longer moves → **A2 and A3 red rather than passing vacuously**; **src/frame.ts: one expression, one constant, one header sentence** — measured on delivered code, one write() per frame, one \x1b[0J, 22 \x1b[K = H−1, 24 \x1b = H+1, **425 → 491 characters = +66 exactly = (H−1)×3**, W over the fixture = **37, 18, 39, 18**; **ADR-0010's "three test changes" CONFIRMED to be FIVE sites across four tests and its "first narrowing fixture" clause CONFIRMED FALSE** — :735-771's characterization ASSERTED THE DEFECT WAS PRESENT and is **DISCHARGED and REPLACED, never deleted (A6)**, its 24/18 narrowing fixture surviving; **the screen model's \x1b[K case is NOT optional — witnessed: remove it and 5 merged tests THROW**; **NO constant-frame-width criterion or assertion was added, here or downstream (ADR-0010 cl. 5 PROHIBITION — W varies by design and that form fails the CORRECT build)**; assembleFrame untouched, both append paths byte-identical with 0 escape bytes, plans/nfr-catalog.md NOT edited and no bar created/moved/loosened/re-derived, no wall-clock assertion added; **ABC-018 is NOT reopened** — its merged module is edited under a ticket of its own; src/status-panel.* and src/turn-loop.* NOT touched and NOTHING relayed to the two live agents; **two flags carried, neither taken: ADR-0010's ## Consequences (owner Architect/Design) and epic 4b's row-worded clause (owner BA/PM)**; nothing merged, pushed or deployed, main never checked out, since: 2026-08-11
```

**No other board row is requested and no other column moves.** `ABC-016` stays `In Review`,
`ABC-019` stays `In Development`, `ABC-017` stays `Ready for Dev`, and none of those three ticket
files was touched.

**The merge-order dispute is NOT re-argued here.** BA/PM recommended `ABC-027` before `ABC-017`; the
Orchestrator has already gated and pulled `ABC-027`. **Merge order is the Orchestrator's** and this
hop changes nothing about it.

## NOT written, deliberately

- **`plans/board.md`** — the Orchestrator's. Row requested above, not made.
- **`memory-bank/50-decisions/`, including `ADR-0010`**, whose `## Consequences` this hop RE-CONFIRMED
  to under-count the test changes and to be wrong about the *"first narrowing fixture"*. **Flagged
  with an owner, not applied.** `ADR-0010` and `ADR-0009` are accepted and neither was re-opened.
- **`plans/tickets/ABC-027-*.md`** — the acceptance criteria are BA/PM's. **No criterion was amended,
  and none needed to be: no defect was found in `A1`–`A6`.** The ticket's `status` / `column`
  front-matter is the Orchestrator's board move, requested above rather than taken.
- **`plans/tickets/ABC-019-*.md` and `plans/tickets/ABC-016-*.md`** — agents are live in both
  worktrees. Nothing relayed, no channel opened.
- **`plans/nfr-catalog.md`** — no target, bar or measured figure moves; no NFR row seeded; **no lane
  bar re-derived** (`NFR-008` / `N8-LANE`: zero test files added, so the floor allowance stays 0 ms
  and Security/NFR owns the real content figure on delivered code).
- **`plans/epics/EPIC-002*.md`** — epic `4b`'s wording flag is BA/PM's and `ADR-0010` cl. 8 covers it
  at ticket level on purpose.
- **`AGENTS.md`, `.grugops/factory.config.json`, `biome.json`, `package.json`** — no command, dial,
  dependency or lint rule changed.
- **Nothing merged, pushed or deployed.**

## Commands run, verbatim

```sh
npm test                                                              # 676/676 baseline, then 681/681
npx vitest run src/frame.test.ts                                      # 32 tests
npm run lint                                                          # biome check .
npx biome check --write src/frame.test.ts src/frame.ts                # one autofix round, 1 of 2 in budget
npm run typecheck                                                     # tsc --noEmit
npm run build                                                         # tsc --noEmit
npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests' # 0
```

Mutants were applied in place, run, and reverted with `git checkout -- <path>` against commit
`194a9bc`; `git status --porcelain` was **clean** afterwards and before the traceability edit.
