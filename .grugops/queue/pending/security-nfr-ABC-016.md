---
task: abc016-secnfr-2026-08-12
subtask: security-nfr-ABC-016
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/security-nfr-ABC-016/
parent_ref: .grugops/context/abc016-secnfr-2026-08-12/
enqueued_by: orchestrator
enqueued_at: 2026-08-12T01:15:00Z
branch: grugops/ABC-016-status-panel
worktree: ../cli-chess-ABC-016
---

# Subtask: Security/NFR gate on `ABC-016` — the last gate before the first merge of four

**`ABC-016` merges FIRST of four.** `ABC-027`, `ABC-017` and `ABC-019` are all behind it. This is the
last gate it takes.

Read `parent_ref:` first, then `plans/tickets/ABC-016-status-panel.md` (`A13` and `A14` especially),
then — in this order, because each hop found what the previous missed —
`.grugops/context/quality-gate-ABC-016-qe/notes/`,
`.grugops/context/refinement-ABC-016-qe-gaps/notes/`,
`.grugops/context/ticket-to-pr-ABC-016-qegaps/notes/`,
`.grugops/context/refinement-ABC-016-a13-ply0/notes/`.

## Ticket history you should weigh, because it bears on how much to trust the criteria

This ticket has been through **three dev hops, two QE-driven repairs and six size derivations.** Its
criteria have been corrected **twice inside a repair**, and BA/PM named the pattern: *a repair arrives
with the authority of having just fixed something and gets read as a solution rather than as a new
claim.* **The most recent `A13` wording is itself a repair. Treat it as an untested claim.**

QE's verdict was PASS_WITH_RISKS with **zero code defects** and seven criterion gaps, all since
closed. 63,894 renders over 400 games showed 0 row-count, 0 non-ASCII, 0 purity and 0 throw
violations.

## The NFR half — this is the live trigger

- **`A14` / `NFR-002`**: the panel's cost bar — **≤ 25 µs at 40/120/300 plies, within 3x, plus a
  spied call count.** Re-derive on **your own instruments**; do not inherit the Engineer's
  (5.68/8.07/9.94 µs) or QE's (5.66/8.21/10.06 µs). Two prior hops measured it and both are on record
  — **reproducing them is a check, not a shortcut.**
- **`A13`'s call counts are named by `## Security / NFR triggers` part 3 as the part that actually
  binds.** The scan clause was just rewritten to a two-term sum (`64` empty, `64 + occupied`
  otherwise). Verify the wording is now true at every regime, including ply 0.
- **`N8-LANE`**: this ticket added test files. Verify the lane budget against
  `plans/nfr-catalog.md`'s `NFR-008` (≤ 3 s wall, ≤ 13 s CPU) — the owner ratified that level
  directly on 2026-08-11.
- Confirm whether `plans/nfr-catalog.md` needs any row seeded. It has not been edited by this ticket.

## The security half

Judge whether it is triggered and **say so either way rather than running it silently.** The panel
renders strings derived from game state to a terminal. Two things worth a look, and I am naming them
as questions, not findings: whether any code point reaching the panel could carry a terminal escape,
and whether `A12`'s ASCII clause is asserted on the panel's own returned rows rather than through
`assembleFrame` (which strips those code points in ASCII mode and would pass a panel that emits
them — the ticket's own `A12` note says so).

## Scope limits

- Do NOT edit `src/`. If code must change, say which module and why; the Engineer changes it.
- Do NOT write `plans/board.md` — the Orchestrator's. Request your move in your notes.
- Do NOT re-open `ADR-0009` or `ADR-0010`; do NOT propose a constant-frame-width criterion.
- Do NOT touch `src/turn-loop.*` or `src/frame.*`. An Engineer is live on `ABC-017` and a
  Security/NFR hop on `ABC-027`, both in other worktrees. You never communicate with them.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Working rules

Work in `../cli-chess-ABC-016` on branch `grugops/ABC-016-status-panel`, rebased onto current `main`
and re-gated green by the Orchestrator (**711/711 on 24 files**, skip 0) — verify yourself. Gates
blocking. `security.asvs_level` is `L1`, `block_on` is `high`.

## One carried item, unowned and non-blocking

`D27`'s comment repair, with a named dissent that it should be fixed now — in BA/PM's `claim` note at
`.grugops/context/refinement-ABC-016-a13-ply0/notes/`. Rule on it or leave it; do not silently drop it.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`**: no stamp is
issuable to you and the §14 gate machinery does not exist in this repo — do **not** self-attest one.
Claim per Workflow 17 (atomic `mkdir`; **the `claimed/` parent has been absent three times — create
it first**).

Report: PASS / PASS_WITH_RISKS / FAIL, every accepted risk with a **named owner and trigger**, any
required fix, `NFR-002` re-measured on your own instruments, your security-half judgment, and your
board move.
