---
id: 20260919T153000Z-ba-pm-artifact-ref-what-this-hop-wrote-and-the-seven-things-it-refused-2c8f6e14
kind: artifact-ref
by: ba-pm
at: 2026-09-19T15:30:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ABC-046
  - ABC-102
  - ADR-0021
  - plans/tickets/ABC-120-the-turn-loop-gains-quit-and-take-back-arms.md
  - plans/tickets/ABC-046-quit-and-new.md
  - plans/tickets/ABC-102-undo.md
  - plans/traceability.md
  - memory-bank/60-progress.md
  - .grugops/queue/done/cut-arm-ticket/
supersedes:
---

# WHAT THIS HOP WROTE, AND WHAT IT REFUSED

Branch `grugops/cut-arm-ticket`, worktree off `grugops/wave-2026-09-19` @ `4f0ef01`. Not a UAT spec,
so no `sha` / `gate_run` / `content_hash` keys (same shape as the `ruling-abc046-quit-arm`
artifact-ref).

## Written

| file | change |
|---|---|
| `plans/tickets/ABC-120-the-turn-loop-gains-quit-and-take-back-arms.md` | **new**, 266 lines (under the 300-line ticket budget, `AGENTS.md` process rule 2). `status: ready` / `column: Ready` / `S` / `P1`. Problem, Scope (two files, three docblocks, the `"quit"` literal), Out of scope (eight fences), `A1`–`A10`, Dependencies, Risks, Test notes, NFR (measured-then-clause-state form, 60 ms headroom named), DoR 10/10, size/priority with promotion/demotion triggers |
| `plans/tickets/ABC-046-quit-and-new.md` | `## Dependencies` +1 bullet: the arm ticket is `ABC-120`, this lands after it; the ⚠️ is now an ordering on a named id. Frontmatter untouched — the column is the Orchestrator's |
| `plans/tickets/ABC-102-undo.md` | `## Dependencies` +1 bullet, same shape, plus the `COMMAND_TABLE` ordering after `ABC-046`. Frontmatter untouched |
| `memory-bank/60-progress.md` | § Known UNCUT work row 5 RETIRED in place (struck through, id named, reason kept) — one table row, nothing else |
| `plans/traceability.md` | one `_Updated:` header line inserted at the top (append-only, above Architect/Design's); one `ABC-120` row appended at the end |
| `.grugops/context/cut-arm-ticket/notes/` | this note, the `observation` (id gap, source line numbers, headroom, overlap checks) and the `decision` (the cut, three product calls, THE BOARD ROW) |
| `.grugops/queue/` | `pending/cut-arm-ticket.md` → `claimed/cut-arm-ticket/` (+ `claim.md`, hand-written) → `done/cut-arm-ticket/` |

## Refused

1. **Any file under `src/`** — the fence. No scratch copy was built either; the behavioural evidence
   is Architect/Design's out-of-tree prototype, cited as unstamped.
2. **`plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`** — the fence. The board row is in the
   `decision` note for the Orchestrator to paste.
3. **The id `ABC-118`** — minted on an unmerged branch; taking it would collide at merge.
4. **Re-opening `ADR-0021`** — the arm shape is buildable as ruled (measured +16, 1213/1213 at the
   ruling); no clause was narrowed, widened or argued.
5. **Deciding `ABC-046`'s confirmation item or `ABC-102`'s refusal wording** — those pages' pens.
6. **Re-titling `src/turn-loop.nfr.test.ts`** — fenced byte-identical; reasoning in the `decision`.
7. **A `finding`** — inadmissible on this install; everything here is `observation` / `decision` /
   `artifact-ref`.

## Not merged, not deployed, not signed

Commit on `grugops/cut-arm-ticket` only. Merge is the Orchestrator's and the owner's.
