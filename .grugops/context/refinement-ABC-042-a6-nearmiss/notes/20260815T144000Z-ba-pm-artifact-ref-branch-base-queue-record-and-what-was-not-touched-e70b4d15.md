---
id: 20260815T144000Z-ba-pm-artifact-ref-branch-base-queue-record-and-what-was-not-touched-e70b4d15
kind: artifact-ref
by: ba-pm
at: 2026-08-15T14:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - E1
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - .grugops/queue/claimed/refinement-ABC-042-a6-nearmiss/claim.md
supersedes: 
---

# Branch, base, the queue record, and the list of everything I did not touch

## Branch and base

- **Branch:** `grugops/refinement-ABC-042-a6-nearmiss`
- **Base:** `grugops/ticket-to-pr-ABC-042-q1q2fix` @ **`73d3b36`** — the fix hop's tip, as instructed.
- **`main` is NOT an ancestor of this branch and was NOT merged in.** Verified with
  `git merge-base --is-ancestor main HEAD` before any work (it returns non-zero) and the branch was cut
  directly from the commit SHA, not from a local `main`.
- **The subtask file lives on `main`** (`.grugops/queue/pending/refinement-ABC-042-a6-nearmiss.md`) and so
  is absent from this tree. It was read before branching, as the subtask requires.
- **The Orchestrator's `E1` verification note** is also `main`-only
  (`…-orchestrator-observation-e1-is-an-instrument-gap-not-a-live-hole-5a7d3c92`, added in `0fe2696`). It
  was read via `git show 0fe2696:<path>` — a read, not a merge.

## Files written

| path | change |
|---|---|
| `plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md` | the six criterion repairs and the DoR re-score. **328 lines before, 328 after**, +39/−39 |
| `.grugops/context/refinement-ABC-042-a6-nearmiss/notes/` | five notes: this one plus the `E1` ruling, the measurements, the five wording items, the DoR/budget accounting, and the gaps |
| `.grugops/queue/claimed/refinement-ABC-042-a6-nearmiss/claim.md` | the ownership registry record |

## The queue claim, taken by hand

`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir .grugops/queue/claimed/refinement-ABC-042-a6-nearmiss`
— the bare `mkdir` succeeded, so the claim was **won**, and that succeeding `mkdir` is the atomic act.
`scripts/claim.js` is absent from this repository and from the kit (`AGENTS.md` § Role / workflow files),
so `claimTask` / `transition` were not called and were not faked. **The `pending → claimed → done` file
transitions are the Orchestrator's on this subtask**, by its own instruction.

## Notes recorded, and the stamp that does not exist

Five notes, all `decision` / `observation` / `artifact-ref`. **There is no `kind: finding` in the set and
no `§14-gate#<id>` stamp anywhere.** `scripts/context-io.ts` and `mcp__grugops__propose_note` are absent
on this install and `context.human_admission` is `off`, so no verdict is emittable; the notes are
hand-authored per `agent-factory/contracts/context-note.md`. **No stamp was invented and no gate was
claimed.** `index.md` / `index.jsonl` were not written — they are derived artifacts of the sanctioned
writer, and hand-forging them would be inventing a render.

## Not touched — checked, not assumed

- **`src/` — zero bytes.** This hop is criteria only. Mutants were applied to **copies in the scratchpad**;
  `git status --porcelain src/` was verified clean afterwards. `src/cli.test.ts` still asserts the old 18,
  which is exactly gap `B1`.
- **`plans/board.md`, `plans/traceability.md`** — the Orchestrator's, for the third time on this ticket.
- **`plans/nfr-catalog.md`, `ADR-0008`** — owner-ratified. `G1` untouched and unresolved.
- **`ADR-0011` (clause 3 or any other), `src/history-pane.nfr.test.ts`** — Architect/Design's; `Q3`/`G6`/`E2`
  not ruled on.
- **`AGENTS.md`, `.grugops/factory.config.json`, `.grugops/test-skips.md`** — read only.
- **The kit at `/Users/olgeroeselg/.grugops/agent-factory`** — read only, never written.
- **Not merged, not pushed, not deployed.** There is no remote. The merge stays held on `G1`, which is the
  project owner's to answer.
