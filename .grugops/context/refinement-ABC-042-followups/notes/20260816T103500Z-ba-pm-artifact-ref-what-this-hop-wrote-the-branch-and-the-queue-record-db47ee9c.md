---
id: 20260816T103500Z-ba-pm-artifact-ref-what-this-hop-wrote-the-branch-and-the-queue-record-db47ee9c
kind: artifact-ref
by: ba-pm
at: 2026-08-16T10:35:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-057
  - ABC-058
  - ABC-059
  - ABC-060
  - plans/traceability.md
  - .grugops/queue/claimed/refinement-ABC-042-followups/
supersedes: 
---

# What this hop wrote, where, and what it deliberately did not write

## Branch

`grugops/refinement-ABC-042-followups`, **branched from `main` @ `75b3a25`** — the first hop on this
ticket to branch from `main`, and it is deliberate: new ticket files and new trace rows belong on
`main` and must not be trapped behind a ticket held at the merge.

**No evidence branch was merged and none was checked out.** All four were read with
`git show <branch>:<path>`:

- `grugops/security-nfr-ABC-042-recheck2` — `S1` ruling, the re-check result, the four bars
- `grugops/quality-gate-ABC-042-regate` — the full gap table with severity and owner
- `grugops/design-ABC-042-adr0011-clause3` — the `Q3` pricing, the clause-3 amendment, `ADR-0011` `R5`
- `grugops/agents-md-ABC-042-dev-run` — `S6`, and the repaired `AGENTS.md`

## Written

| path | what |
|---|---|
| `plans/tickets/ABC-057-licence-guard-comparator-and-stale-clause3-docblock.md` | **NEW.** `XS`, `P2`, DoR 9/10 |
| `plans/tickets/ABC-058-three-security-bar-instruments-cannot-observe-their-own-clauses.md` | **NEW.** `S`, `P2`, DoR 9/10 |
| `plans/tickets/ABC-059-agents-md-runnability-guard-pins-a-spelling-not-a-fact.md` | **NEW.** `XS`, `P3`, DoR 9/10 |
| `plans/tickets/ABC-060-diff-scoping-criteria-do-not-say-which-diff.md` | **NEW.** `XS`, `P2`, DoR 10/10 |
| `plans/traceability.md` | **APPEND ONLY — 4 rows + 1 `_Updated:` line. `git diff --numstat`: 5 insertions, 0 deletions.** No existing row touched. Every row re-split from disk after the write: **12 fields = 10 columns**, no raw `|` inside any cell |
| `.grugops/context/refinement-ABC-042-followups/notes/` | 5 hand-authored notes: 2 `decision`, 2 `observation`, this `artifact-ref` |
| `.grugops/queue/claimed/refinement-ABC-042-followups/claim.md` | the now-running registry record (Workflow 17 step 2) |

**Ticket lengths, against rule 2's 300-line budget — counted with `wc -l` after writing, not
estimated:** `ABC-057` **169**, `ABC-058` **199**, `ABC-059` **171**, `ABC-060` **162**. **All four
under budget; median 170**, against `ABC-042`'s 328. They pull rule 2's ten-ticket median control
down rather than up. *(`ABC-058` is the longest of the four and is the one to watch: it carries three
findings and a section explaining why a gated page was not edited.)*

## NOT written, each deliberately

- **`plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md` — ZERO lines changed.** The hard
  rule of this hop. See the `decision` note recording the three moments it argued for an edit.
- **`plans/board.md` — not opened.** The Orchestrator's. Four `Backlog` rows are owed for
  `ABC-057`–`ABC-060` and are its move, not mine.
- **Any file under `src/`, `memory-bank/`, `AGENTS.md`, `plans/nfr-catalog.md`, any ADR.** Zero code.
- **`.grugops/test-skips.md`** — human-owned; not read for writing and not written.
- **The four pre-existing malformed rows in `plans/traceability.md`** — flagged in the measurement
  note, not repaired (rule 12, and "touch no existing row").

## Not merged, not pushed, not deployed

Committed on the branch only. **This repository has no git remote**, so nothing could be pushed even
if it were sanctioned. The merge is a human's; `ABC-042` remains held on `G1`, which is the project
owner's and unanswered, and **nothing in this hop touches that hold in either direction**.

## Queue

Claimed by hand per Workflow 17 and `AGENTS.md` § Role / workflow files: `mkdir -p
.grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/refinement-ABC-042-followups/` (returned 0 — the claim is mine; a second
claimant would have taken `EEXIST`). Subtask moved `pending/` → `claimed/<task>/` → `done/<task>/` by
`git mv`. **No `§14-gate` stamp is emitted and no `kind: finding` is recorded — none is admissible on
this install.**
