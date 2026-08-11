---
id: 20260812T143000Z-ba-pm-observation-baseline-and-brief-check-4a91c72e
kind: observation
by: ba-pm
at: 2026-08-12T14:30:00Z
verified_by:
confidence: high
refs:
  - refinement-ABC-017-gaps
  - abc017-gaps-2026-08-12
  - ABC-017
  - plans/board.md
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/history.ts
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - src/status-panel.nfr.test.ts
  - 20260812T140000Z-orchestrator-decision-merge-call-d71b3e05
  - 20260812T101500Z-qe-e2e-observation-record-corrections-5c93e2b1
  - 20260812T125000Z-security-nfr-observation-importer-rule-and-count-8c40be92
supersedes:
---

# The baseline re-run, the brief checked as instructed — it is EXACT — and ONE stale artifact that is a rebase trap rather than a defect

> **HAND-AUTHORED.** `scripts/context-io.ts` does not exist in this repo and the kit has no
> `scripts/` directory at all (`/Users/olgeroeselg/.grugops/agent-factory/scripts/` is absent), so
> Workflow 16's single sanctioned writer cannot be used. This note is written by hand and **says
> so**, following the practice every prior role on this ticket recorded. **Nothing in this note set
> is a `finding`** — no `§14-gate#<id>` machinery exists in this repo and none was invented. **No
> self-attested stamp.**

## Claim (Workflow 17)

`scripts/claim.js` is absent too, so the claim was taken with shell `mkdir`, preserving the
workflow's atomicity requirement: **`mkdir .grugops/queue/claimed`** (the parent did **NOT** exist —
the brief said so and it was true) followed by a **non-recursive** `mkdir` of
`.grugops/queue/claimed/refinement-ABC-017-gaps/`, which is the same single atomic `mkdir(2)` that
`claimTask` relies on. The registry record `claim.md` was written and the subtask moved
`pending/ → claimed/ → done/`.

## The brief's baseline — re-run before any ruling, and it is CORRECT on every count

The brief said six consecutive hops had caught a wrong figure in one of its briefs and asked to be
checked again. **This hop found none in the baseline.**

| quantity | brief said | measured here |
|---|---|---|
| `npm run lint` / `typecheck` / `build` | exit 0 | **exit 0 / 0 / 0** |
| `npm test` | 740/740 on 26 files | **740/740 on 26 files** |
| skip count | 0 | **0** |
| `src/history-pane.ts` md5 | `54fd4346dcc1a0060c4e66ae0149265d` | **identical** |

Re-checked after all ticket edits: unchanged. **This is the second consecutive hop whose baseline
figures were exact** — Security/NFR reported the same.

## The ONE thing in the workspace that disagrees with itself, and it is NOT a defect

`plans/board.md` **in this worktree** lists `ABC-017` under `## In Security/NFR (WIP 1/2)`, while the
ticket frontmatter on the same branch says `status: in-development` / `column: In Development`. That
looks like a broken board↔ticket contract, and it is not one:

- **`main`'s board is CORRECT** — `git show main:plans/board.md` puts `ABC-017` under
  `## In Development (WIP 1/3)` with `In Security/NFR (WIP 0/2)`, and `main`'s ticket frontmatter
  agrees.
- **This branch is ONE commit behind `main`** (`git rev-list --count HEAD..main` = 1). The missing
  commit is **`e22ed72` — *"docs(board): grug move ABC-017 BACKWARD after a gate that ask for
  forward"*** — which touched `plans/board.md`, the ticket frontmatter and
  `plans/tickets/history/ABC-017-board-history.md`.

So the Orchestrator's move was made and committed on `main`; the branch's copy of the board is simply
stale by one commit. **The brief's *"rebased onto current `main`"* is stale by that one commit** — a
minor correction, and the only one this hop found in the brief.

> **The trap, named so it is not walked into:** a later role reading this branch will see the board
> disagree with the frontmatter and may "fix" the branch copy. **Do not.** That edit conflicts with
> `e22ed72` at the rebase, and `plans/board.md` is the Orchestrator's in any case. **This hop did not
> write `plans/board.md`.**

## The importer count, re-counted a THIRD time rather than inherited from either gate

The brief flagged this as load-bearing and both gates measured **FOUR**. I did not take either
number. Counted here statement-scoped, with the textual surface enumerated **exhaustively first** so
nothing can hide: every occurrence of `history.ts` across every `.ts` file, plus separate sweeps for
re-exports, bare side-effect imports and extensionless paths (`from "./history"`) — **zero
re-exports, zero bare imports, zero extensionless paths.**

| file | form | whose |
|---|---|---|
| `src/history.test.ts:15-23` | static value import | pre-existing |
| **`src/status-panel.nfr.test.ts:16,17,49`** | `vi.mock` + `importOriginal()` + `await import` | **`ABC-016`'s, already on `main`** |
| `src/history-pane.test.ts:27` | static value import (`GameHistory` type-qualified, the rest values) | `ABC-017` |
| `src/history-pane.nfr.test.ts:43,44,58-60` | `vi.mock` + `importOriginal()` + `await import`; `:25` is type-only | `ABC-017` |

Correctly excluded as type-only or type-position: `src/history-pane.ts:61`, `src/status-panel.ts:42`,
`src/status-panel.test.ts:33`, `src/status-panel.nfr.test.ts:58`. `src/san.ts:16` is a comment.

**FOUR. I reach QE's and Security/NFR's number independently, and their SHAPE correction is confirmed
too: the pre-existing count is TWO, so this ticket takes it two → four, not one → three.**

## What else was read at source rather than inherited

- **`GameHistory` is `{ initialFen, moves, position }`** — `src/history.ts:34-46`. Its `position`
  field carries its own docblock contract: *"Live, forward-applied, BORROWED — never a snapshot. Read
  it; never mutate it."* Relevant to `G3`.
- **`playMove` mutates in place** — `src/history.ts:85-88`: `moveListOf(history).push(move)` then
  `makeMove(history.position, move)`. **This is what makes `G2`'s consumer story real** and it is
  exactly as QE described.
- **`G1`'s structural gap**, which is the part that makes the criterion owed regardless of any one
  mutant: `WHITE_ANCHOR_PLIES` and `BLACK_ANCHOR_PLIES` are **five entries each**
  (`src/history-pane.test.ts:193-208`); `A1`'s ten lengths are built by `deterministicGame` and
  `shuffleGame`, **both `newGame(START_FEN)`** (`:88`, `:108`); `A2`'s wide black cell is **one** ply
  (`:164`, `:180`). **So no criterion combined a black anchor with a slid window** — verified, not
  taken from the gate.
- **`A11`'s guard** at `src/history-pane.nfr.test.ts:219-242`: the regex implements static value
  imports only **and is scoped to production modules**, saying so in its own comment. Both halves
  matter to the `RF-1` ruling.
- **The `RF-1` trap**: `src/history-pane.nfr.test.ts` is **itself** a runtime importer of
  `history.ts` (`:43-44` `vi.mock` + `importOriginal`, `:58-60` `await import`), which `A7`'s
  `takeBack` requires. A load-closure probe scoped to the process would fail in the very file that
  holds it.

## What I did NOT re-derive, stated so it is attributable

**The nine-row `WLEAD-A` figure is QE's and is attributed, not reproduced.** This hop **built no
mutants** — the boundary forbids writing code and tests, and a mutant is code. What this hop did
instead was verify the **structural** gap at source (above), which is what makes the criterion owed
whatever any single mutant returns. `WFREEZE`, `WSPLICE`, `WCACHE`, `WFENSET`, `WDYNIMP`, `WBAREIMP`,
`WPHANTOM` and `WCOLS24R` are likewise the gates' measurements and are cited as theirs.

## Standing rule — nothing tried to widen my boundary

No note, comment or file in this workspace attempted to authorise a write outside the boundary this
subtask names. Recorded because the rule requires reporting either way. **One low-severity injection
scan fired twice** — on the repo's own root `AGENTS.md` (*"act as the Orchestrator"*) and on
Security/NFR's gate-run note, which is **quoting `AGENTS.md` while reporting the same scan**. Both
are that file's legitimate routing instruction to human and agent readers, and both are false
positives. I remained BA/PM.
