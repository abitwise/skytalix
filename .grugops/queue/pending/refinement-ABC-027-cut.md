---
task: adr0010-routing-2026-08-11
subtask: refinement-ABC-027-cut
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-027-cut/
parent_ref: .grugops/context/adr0010-routing-2026-08-11/
enqueued_by: orchestrator
enqueued_at: 2026-08-11T15:30:00Z
branch: grugops/refinement-width-tickets
worktree: ../cli-chess-width-tickets
---

# Subtask: cut `ABC-027` for `ADR-0010`'s frame-clearing change, and make `ABC-017`'s one free text edit

`ADR-0010` is **accepted and merged to `main`**. Read it first —
`memory-bank/50-decisions/ADR-0010-frame-width-stability-ownership.md` — then the Architect's notes
in `.grugops/context/design-frame-width-clearing/notes/`, then `parent_ref:`.

**Do not re-open `ADR-0010` or `ADR-0009`.** Both are accepted. You are turning a ruling into tickets.

## 1. Cut `ABC-027` — the production change has no home and needs one

`ADR-0010` rules that the **consumer** owns frame-width stability: `src/frame.ts`'s in-place writer
must clear each row as it writes it. The module belongs to `ABC-018`, which **merged 2026-08-09 and
is closed** — reopening a closed ticket to carry new work is not something this board does, so the
Orchestrator routed it to a new ticket. **`ABC-027` is free; the id is yours to use.**

The Architect measured the change and called it minimal and sufficient. Take the details from
`ADR-0010` itself, not from this brief; the shape is:

- `src/frame.ts:216` — rows joined by `\x1b[K`, then the single existing `\x1b[0J`.
- `src/frame.ts:27-29` — the header sentence about not emitting a per-row erase becomes false.
- `src/frame.test.ts` — **three changes, one of which is NOT optional**: the screen model throws on
  unmodelled escapes (`:187-188`, `:232-236`), so it must learn `\x1b[K` or the suite goes red.

**Merge position, decided by the Orchestrator, and the two edges differ in strength — do not
flatten them:**

- **`ABC-027` BEFORE `ABC-019` is FORCED.** `ABC-019` gains a criterion the correct build cannot pass
  until the writer clears per row.
- **`ABC-027` AFTER `ABC-017` is a PREFERENCE.** Both touch `src/frame.test.ts`; `ABC-017` is already
  sized and in `Ready for Dev` while `ABC-027` is uncut, so ordering by readiness costs nothing. A
  rebase would settle it either way. **If your sizing makes the other order better, say so** — this
  is a preference and it is yours to argue with.

Size it, prioritise it, and write acceptance criteria that can be RUN. This board's record is
unforgiving here: criteria that read fine have hidden 16, 18 and 25 defects, and two tickets this
same round shipped criteria that no correct build could satisfy. **`ADR-0010` measured that the
merged suite structurally cannot see this defect** — its fixtures yield `W` ∈ {18} because the real
board pins it — so a criterion that does not force a *narrowing* will pass on a broken build.

Do **not** put it in `Ready for Dev` yourself; state whether DoR is met and the Orchestrator gates it.

## 2. `ABC-017` — one text edit, free exactly now because it is still unbuilt

Its constant-width assertion is **KEPT**. What is **struck as measured false** is its claim that the
pane *"is expected to be the widest panel and therefore to SET `W`"* — measured at 21–24 columns
against the status panel's 45/50/67.

`ABC-017` sits in `Ready for Dev` and no agent is on it. Re-derive size (`S`) and priority (`P2`) and
say if either moves. **If this edit breaks its DoR, say so** — it would move back to `Ready`, which is
legitimate.

## 3. Two flags to record, not to fix

- **`ABC-019` is owed** one new criterion (after a narrowing, the screen equals the frame) **and one
  PROHIBITION: no constant-frame-width criterion**, because `W` varies by design and such a criterion
  would fail the *correct* build. **Do NOT edit `ABC-019`** — an Engineer is live in its worktree.
  Record it so the Orchestrator can route it when that branch is free.
- **`ABC-016` is owed nothing that changes a criterion and zero production lines** — one stale
  rationale sentence only (`A7` and `src/status-panel.ts:95-101` justify the reserved cell by "makes
  the whole frame breathe"). Non-blocking. **Do NOT edit `ABC-016`** — QE is live in its worktree.

## Working rules

- Work in `../cli-chess-width-tickets` on branch `grugops/refinement-width-tickets`, created from
  current `main`. Absolute paths. `node_modules` symlinked. Baseline **676/676 on 22 files**.
- Do NOT write `plans/board.md` — the Orchestrator's. Request board rows in your notes.
- Do NOT edit `src/`, `ABC-016`, `ABC-019`, or `memory-bank/50-decisions/`.
- Two agents are live in other worktrees (QE on `ABC-016`, an Engineer on `ABC-019`). You never
  communicate with them; the on-disk shared context is the only channel.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist in this repo and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir` of `.grugops/queue/claimed/refinement-ABC-027-cut/`, by hand).
