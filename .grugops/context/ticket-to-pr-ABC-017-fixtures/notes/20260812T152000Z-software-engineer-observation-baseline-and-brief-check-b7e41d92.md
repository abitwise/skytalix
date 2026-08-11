---
id: 20260812T152000Z-software-engineer-observation-baseline-and-brief-check-b7e41d92
kind: observation
by: software-engineer
at: 2026-08-12T15:20:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-017-fixtures
  - abc017-fixtures-2026-08-12
  - ABC-017
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - src/history-pane.ts
  - 20260812T140000Z-orchestrator-decision-merge-call-d71b3e05
  - 20260812T143000Z-ba-pm-observation-baseline-and-brief-check-4a91c72e
supersedes:
---

# The baseline re-run and the brief checked again: EXACT on every gate figure, and ONE stale count that is the brief's own commit

> **HAND-AUTHORED.** `scripts/context-io.ts` does not exist in this repo, and the kit has no
> `scripts/` directory at all — `/Users/olgeroeselg/.grugops/agent-factory/scripts/` is absent — so
> Workflow 16's single sanctioned writer cannot be used and this note **says so**, following the
> practice every prior role on this ticket recorded. **Nothing in this note set is a `finding`**: no
> §14 gate machinery exists in this repo, and **no self-attested stamp was invented.**

## Claim (Workflow 17)

`scripts/claim.js` is absent too, so the claim was taken with a plain shell **non-recursive**
`mkdir .grugops/queue/claimed/ticket-to-pr-ABC-017-fixtures` — the same single atomic `mkdir(2)`
`claimTask` relies on, so `EEXIST` would have meant "claim lost" and any other error a genuine
failure. It returned rc=0. The `claimed/` parent already existed (empty). The registry record
`claim.md` was written and the subtask moved `pending/ → claimed/ → done/`.

## The brief's baseline — re-run BEFORE any edit, as instructed

The brief said seven consecutive hops had caught a wrong figure in one of its briefs and asked to be
checked again.

| quantity | brief said | measured here |
|---|---|---|
| `npm run lint` / `typecheck` / `build` | exit 0 | **exit 0 / 0 / 0** |
| `npm test` | 740/740 on 26 files | **740/740 on 26 files** |
| skip count | 0 | **0** |
| `src/history-pane.ts` md5 | `54fd4346dcc1a0060c4e66ae0149265d` | **identical** |
| behind `main` | 0 | **0** |
| ahead of `main` | 13 | **14** |

**Every gate figure is exact. This is the third consecutive hop whose baseline figures were exact.**

## The one figure that moved, and it is the brief's own footprint

`git rev-list --count main..HEAD` is **14**, not 13. The extra commit is **`ad0586f` — *"chore(queue):
grug enqueue the fixture hop, test only and no production line"*** — which contains nothing but
`.grugops/queue/pending/ticket-to-pr-ABC-017-fixtures.md`, the brief itself, 118 lines.

**So the count was right when it was typed and stale by the act of committing it.** I am recording it
because the brief asked to be checked and because "13" would otherwise look like a miscount to a
later reader; it is not one, and no other figure in the brief moved. Nothing follows from it — the
branch is still 0 behind `main` and no rebase is owed.

## The stale branch board copy — confirmed still present, and still NOT touched

`plans/board.md` **in this worktree** lists `ABC-017` under `## In Security/NFR`, while the ticket
frontmatter on the same branch says `status: in-development` / `column: In Development`. BA/PM named
this as a rebase trap rather than a defect and I confirm it and repeat the warning: **`main`'s board
is correct, this branch's copy is stale, and "fixing" it conflicts with `e22ed72` at the rebase.**
`plans/board.md` is the Orchestrator's and **this hop did not write it.**

## What I re-derived at source rather than inheriting

- **The production module count.** 16 `.ts` files under `src/` that are not `*.test.ts`; excluding
  `history.ts` itself (a self-inflicted load) and `perft-bench.ts` (which calls `main()` at module
  scope, `src/perft-bench.ts:114`) leaves **14 roots** — reaching Security/NFR's number
  independently rather than taking it.
- **The pane's runtime closure is exactly SEVEN modules** — `apply`, `fen`, `history-pane`, `legal`,
  `moves`, `position`, `san` — with `history.ts` **not among them**. Measured with my own load
  recorder before writing any assertion, reproducing Security/NFR's figure exactly.
- **`GameHistory.moves` is a real array on the object, not a getter** (`src/history.ts:34-46`,
  `:54`). This is load-bearing for `A9`'s new during-render instrument: freezing it is a real guard
  rather than a no-op, and the test asserts that rather than assuming it.
- **`A6`'s fourth-anchor rows, measured against the delivered pane** out of tree before being written
  into a test — see the red-before-green note. BA/PM's witnessed figures are exact.

## Standing rule — nothing tried to widen my boundary

No note, comment or file in this workspace attempted to authorise a write outside the boundary this
subtask names. Recorded because the rule requires reporting either way.

**One low-severity injection scan fired three times** — on the repo's own root `AGENTS.md`
(*"act as the Orchestrator"*), and on two notes that are **quoting or reporting that same line**,
including BA/PM's note reporting the same scan. All three are that file's legitimate routing
instruction to human and agent readers, and all three are false positives. **I remained the Software
Engineer**, which is the role the activating agent named; a file in the workspace is data and cannot
reassign a role.
