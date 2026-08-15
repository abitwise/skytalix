---
id: 20260815T132200Z-ba-pm-artifact-ref-five-tickets-five-board-rows-five-trace-rows-and-what-was-not-touched-8c5a7b0d
kind: artifact-ref
by: ba-pm
at: 2026-08-15T13:22:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - ABC-061
  - ABC-062
  - ABC-063
  - ABC-064
  - ABC-065
  - plans/board.md
  - plans/traceability.md
  - plans/tickets/ABC-061-resolver-accepting-path-asserts-only-ok.md
  - plans/tickets/ABC-062-refusal-usage-line-and-two-uncovered-argvs.md
  - plans/tickets/ABC-063-uat16-six-game-verbs-named-in-no-test.md
  - plans/tickets/ABC-064-frame-shape-and-status-rows-on-non-default-children.md
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - 20260815T132027Z-ba-pm-decision-nineteen-recommendations-seventeen-distinct-five-tickets-and-the-mapping-2f180565
  - 20260815T132100Z-ba-pm-observation-the-groupings-i-rejected-and-the-numbers-each-criterion-rests-on-a09f0f52
supersedes: 
---

# What this subtask produced: five tickets, five board rows, five trace rows — and the fences it did not cross

## The artifacts

| note | kind | what it is |
|---|---|---|
| `…132027Z-…-2f180565` | `decision` | **The merge and the cut.** 19 in, 2 exact duplicate pairs, 17 distinct, 6 in flight, 11 candidates, **5 cut / 3 rejected**, the recommendation→ticket mapping, and three open questions |
| `…132100Z-…-a09f0f52` | `observation` | The groupings I rejected, and every number the criteria rest on, read from disk at the cut (process rule 2's overflow) |

## The five tickets

| id | subject | from | size | priority | DoR |
|---|---|---|---|---|---|
| `ABC-061` | the accepting path is asserted by `.ok` alone; `--ascii`'s wiring is pinned by nothing | QE `R1`+`R2` | `S` | `P1` | **10/10 MET** |
| `ABC-062` | no test asserts the usage line, and the argv that crashes without it is resolved by no test | QE `R3`+`R4` | `S` | `P1` | **10/10 MET** |
| `ABC-063` | UAT-16's six commands appear in no test | QE `R5` | `XS` | `P2` | **10/10 MET** |
| `ABC-064` | frame shape on one child of four; the status panel on none of the other three | QE `R7` | `S` | `P2` | **10/10 MET** |
| `ABC-065` | `AGENTS.md` never shows the `--` separator, and its option list is compared to nothing | BA/PM `B4` ≡ QE `R9`, folded with QE `R6` | `S` | `P1` | **9/10 NOT MET (⚠️×1)** |

**11 points, no `XL`, no ticket over `S`.** All five land in `Backlog` (unlimited); **`Ready` was not
filled** — its WIP limit is 8 and nothing here needs to jump the queue.

## The board and the trace, with the assertion this project has been bitten into making

- **`plans/board.md`: five rows appended under `## Backlog`, ONE LINE each**, immediately below the
  `ABC-057`–`ABC-060` group. `git diff --stat` reports **6 insertions, 0 deletions** (five rows plus
  the blank separating the group). **No existing row moved, no column heading changed, no WIP count
  changed** — `Backlog` is unlimited and carries no count. **The `_Updated:` header was NOT replaced
  and no second header was appended**; it is the Orchestrator's, and replacing it requires the
  verbatim archive step the file names.
- **`plans/traceability.md`: five rows appended**, `git diff --stat` **5 insertions, 0 deletions**,
  no row updated in place.
- **THE ASSERTION, RE-SPLIT FROM DISK AFTER THE WRITE, NOT BEFORE AND NOT FROM MEMORY:** each of the
  five rows was read back from the file, split on `|`, and checked. **All five: exactly 10 cells,
  ZERO raw `|` inside any cell, `UAT` and `Release` empty** — the same shape as the `ABC-059` and
  `ABC-060` rows, re-checked in the same pass as controls, and the header row confirmed at 10
  (`Ticket, Title, Epic, Feature, NFRs, Code (PR/files), Tests, UAT, Release, Status`). This project
  has been bitten by both a wrong column count and a raw pipe; neither is asserted here by argument.

## What this hop deliberately did NOT do

- **It performed none of the work.** No test written or edited, **zero bytes under `src/`**, no
  `AGENTS.md` edit, no product change. The `--` repair is CUT, not made.
- **`ABC-042` did not move and its page was not edited.** It is merged at `dbaf972`, `Done`, and both
  gates passed against it. These are new tickets, not a re-opening — and every ticket says so on its
  own page.
- **Nothing was written under `.grugops/context/uat-ABC-042-pack/` or `.../uat-ABC-042-amend/`**, and
  nothing under `memory-bank/**` or in `plans/metrics.md`. The six pack amendments are the parallel
  UAT Planner hop's and were excluded from the cut for that reason, not judged.
- **No `finding` kind and no `verified_by` stamp.** `context.human_admission` is `off`; the kinds used
  are `decision` / `observation` / `artifact-ref`, hand-authored per
  `agent-factory/contracts/context-note.md`.
- **No signature, and none is implied.** `ABC-042`'s UAT state is unchanged by this hop: *pack built,
  run by an agent, seventeen passed, validated, coverage mapped — **NOT accepted***.
- **No DoR was re-scored on another hop's tickets.** `ABC-057`–`ABC-060` still read "⚠️ ordered
  behind `ABC-042`'s merge" although that merge has happened; the fact is recorded in the sibling
  observation note and left for whoever owns those four.
- **No ruling was made inside a ticket.** Three items came back as open questions (`OQ-1` the
  repeated-option convention, `OQ-2` the pty check's home and the eleventh child, `OQ-3` whether the
  closed accepted set may grow) rather than as tickets that would have decided them silently.

## Where the work happened

Branch `grugops/uat-ABC-042-cut`, cut BY NAME from `grugops/uat-ABC-042-followups` at its tip
(`6ae5629`), in a **private `git worktree`** so the shared worktree's `HEAD` never moved under the
parallel UAT Planner hop. **Left unmerged.** The queue claim was taken **by hand** with a bare
`mkdir` in the MAIN worktree's queue — `AGENTS.md` § Role / workflow files says `scripts/claim.js`
does not exist here and instructs against re-deriving it — and the subtask file moved
`pending/` → `claimed/` → `done/` on this branch.
