---
task: abc016-devhop-2026-08-11
subtask: ticket-to-pr-ABC-016-qegaps
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-016-qegaps/
parent_ref: .grugops/context/abc016-devhop-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T19:15:00Z
branch: grugops/ABC-016-status-panel
worktree: ../cli-chess-ABC-016
---

# Subtask: write `ABC-016`'s seven QE-gap closes — test-only, zero production lines

Third dev hop on this ticket. QE returned **PASS_WITH_RISKS with zero code defects**; BA/PM ruled all
seven gaps and **replaced two of QE's own proposed closes** because they do not kill what they claim.

Read `parent_ref:` first, then BA/PM's five notes in
`.grugops/context/refinement-ABC-016-qe-gaps/notes/` — **including its `failed-attempt`** — then QE's
five in `.grugops/context/quality-gate-ABC-016-qe/notes/`, then the amended
`plans/tickets/ABC-016-status-panel.md`. **BA/PM's `artifact-ref` note carries a 6-item dev work
list; that list is your scope.** Take exact wording from the ticket, never from this brief.

## The two replacements, because they change what you would otherwise write

1. **`G1` — do NOT add a `thinking: true` in-check `CASES` entry.** QE proposed it; BA/PM measured
   that it kills **1 of 5**, not 3, because the three criteria that iterate `CASES` assert **purity,
   row count and ASCII — none asserts CONTENT**. The replacement clause is: *given every `CASES`
   entry rendered in both thinking states, replacing `thinking...` in the busy panel with spaces of
   the same length yields a panel byte-identical to the idle one.* It kills **5 of 5**, needs **no new
   `CASES` entry**, and subsumes `G2`'s width fix.
   **It deliberately names no row index and no frame-level term** — that is how it satisfies
   `ADR-0010` cl. 5 without pinning a layout the ticket leaves to you. **Do not add a row index to
   it.**
2. **`G3` — three single-removal rows (`+3 / +3 / +5`), not one joint FEN.** A single `+11` joint FEN
   **survives a compensating `KNIGHT=4, BISHOP=2`** (`4 + 2 + 5 = +11`).

## Also ruled

- **`G4`** — both counting clauses now state ply depth **≥ 2**, and the scan clause is
  **ply-independent**: `64 + occupied squares of initialFen`, because `parseFen` places one piece per
  occupied square and **`makeMove` never calls `squareAt`**.
- **`G6`** — one `A9` case, with its constructed-ness stated *inside* the criterion.
- **`G7`** — one `A5` case. BA/PM constructed the position QE did not supply:
  `4k3/8/8/8/3p4/8/2N1N3/4K3 w - - 0 1` + `e2d4`.
- **The `1 - 0` line goes in the TEST, not the criterion**, and both its reasons matter: provenance,
  and that it is an **executable guard on a comment** that this ticket has now proved goes stale.

## The comment repairs — the only things you touch under `src/` besides tests

The stale `A13`-is-unsatisfiable claim is at **four** sites, not one. QE proved empirically that it
*misled a reader*: it suppressed the very probes that found `G4`. The fourth site was **named by
nobody** and is the worst, because it sits on the criterion this amendment rewrites:

- `src/status-panel.nfr.test.ts:134-139` — also cites `src/san.ts:101`; the call is at **`:104`**.
- `src/status-panel.ts:95-101`
- `src/status-panel.test.ts:263-265` — asserts the panel's widest row *is* the frame's `W` and
  "makes the whole frame breathe". **`ADR-0010` refuted that**; `W` is a `max` over panels and the
  board is 18 columns.
- The ticket's `A7` rationale — already fixed by BA/PM.

**Zero production lines are expected.** BA/PM verified every added fixture renders green on the
delivered panel. If you find yourself changing `src/status-panel.ts` behaviour, stop and flag it.

## Working rules

- Work in `../cli-chess-ABC-016` on branch `grugops/ABC-016-status-panel`, rebased onto current `main`
  and re-gated by the Orchestrator. Baseline **708/708 on 24 files** — verify yourself.
- Do NOT write `plans/board.md` — the Orchestrator's. Request your move in your notes.
- Do NOT touch `src/turn-loop.*` or `src/frame.*`. An Engineer is live on `ABC-027` (which owns
  `src/frame.ts` and `src/frame.test.ts`) and a BA/PM on `ABC-019`. You never communicate with them.
- **Do NOT add a constant-frame-width criterion or assertion** — `ADR-0010` cl. 5 refuses it.
- Gates blocking: lint/typecheck/build 0, skip 0.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir` of `.grugops/queue/claimed/ticket-to-pr-ABC-016-qegaps/`, by hand —
**create the `claimed/` parent first if it is missing**; BA/PM hit `ENOENT` there, which WF17 calls a
genuine failure and not a lost claim).

State plainly whether every criterion is now met, and request your board move.
