---
id: 20260919T111000Z-architect-design-artifact-ref-what-this-hop-wrote-and-what-it-refused-e19c5b77
kind: artifact-ref
by: architect-design
at: 2026-09-19T11:10:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-102
  - ABC-112
  - ADR-0021
  - memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md
  - memory-bank/00-index.md
  - plans/traceability.md
  - plans/nfr-catalog.md
  - plans/tickets/ABC-046-quit-and-new.md
  - plans/tickets/ABC-102-undo.md
  - plans/tickets/ABC-112-help-advertises-a-command-the-build-does-not-honour.md
supersedes:
---

# WHAT THIS HOP WROTE, AND WHAT IT REFUSED

Branch `grugops/ruling-abc046-quit-arm`, worktree off `grugops/owner-rulings-2026-09-19` @ `2c96dbd`.
Not a UAT spec, so no `sha` / `gate_run` / `content_hash` keys (same shape as the `ABC-115` design
hop's artifact-ref).

## Written

| file | change |
|---|---|
| `memory-bank/50-decisions/ADR-0021-the-turn-loop-gains-quit-and-take-back-arms.md` | **new**, `accepted` — owner quoted verbatim; the arm shape; transitions 17/18 numbered against 8/16; confirmation seam-side; `new`/`undo` hang-off; eight rejected alternatives; what reds and what must not; four falsification triggers |
| `memory-bank/00-index.md` | one sentence appended to the ADR census paragraph: `ADR-0021` exists; `ADR-0018`–`0020`, `0022`, `0023` are reserved by sibling hops of the same task, so the count line is stale until the task merges — re-measure by listing |
| `plans/tickets/ABC-046-quit-and-new.md` | `## Design ruling 2026-09-19` appended: ruling landed, `A3` stands, **`A8` amended** (one call-site line in `src/line-input.ts` licensed), DoR re-check **8/10 ⚠️×2**. Frontmatter untouched — the column is the Orchestrator's |
| `plans/tickets/ABC-102-undo.md` | `## Design ruling 2026-09-19` appended: ruling landed, `EPIC-004` blocker closed by `ABC-078`, `undo`'s refusal is a `command` message, DoR re-check **8/10 ⚠️×2** |
| `plans/tickets/ABC-112-…md` | `## Design ruling 2026-09-19` appended: its own trigger fired; a one-line dependency on `ABC-046`; recommend cancel. DoR unchanged 9/10 and moot |
| `plans/traceability.md` | one `_Updated:` header; `Status` cell appended on `ABC-046`, `ABC-102`, `ABC-112` rows (append-only, last cell); one `ADR-0021` row appended at the end |
| `plans/nfr-catalog.md` | one `_Updated:` header line: no bar moved, no row seeded, why |
| `.grugops/context/ruling-abc046-quit-arm/notes/` | this note, the `observation` (measurements) and the `decision` (ruling + pull order + DoR) |
| `.grugops/queue/` | `pending/ruling-abc046-quit-arm.md` → `claimed/ruling-abc046-quit-arm/` (+ `claim.md`) → `done/ruling-abc046-quit-arm/` |

## Refused

1. **Any file under `src/`** — the fence. The prototype lived in the session scratchpad and is not
   delivered.
2. **`plans/board.md` and `AGENTS.md`** — the fence. `ABC-046`/`ABC-102` stay in `Backlog` on their
   frontmatter; the Orchestrator moves them when the arm ticket is cut.
3. **Cutting the arm ticket** — BA/PM's pen. Its scope is stated in `ADR-0021` clause 8; its id is
   not guessed.
4. **Editing `ABC-045`'s page** — not in this subtask's deliverables. Its 10/10 re-score by the record
   is in the `decision` note for whoever holds the pen.
5. **Editing `ABC-035`'s page or its two assertions** — a `Done` ticket; the red `ABC-046` will cause
   in `src/command-input.test.ts:486-495` is authorised on `ABC-046`'s page, not by re-opening
   `ABC-035`.
6. **Changing the ADR census count in `00-index.md`** — five sibling ADR ids are reserved in parallel
   on sibling branches; a count written here would be wrong at merge. One sentence names the fact
   instead.
7. **A `finding`** — inadmissible on this install; everything here is `observation` / `decision` /
   `artifact-ref`.
