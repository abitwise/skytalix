---
subtask: bapm-close-EPIC-007
role: ba-pm
ticket: plans/epics/EPIC-007-the-engine-speaks-uci-so-a-chess-ui-can-play-it.md
ref: .grugops/context/bapm-close-EPIC-007/
width: 2 (records only; disjoint files from security-nfr-ABC-202)
---

# Write EPIC-007's close status, and fold QE-202-d (records only)

## Do
- QE read M1 and M8(a) MET on ABC-202 (`…632c11f1`). M2 is closed by acceptance (`…b5f65536`). Read every measure M1–M11 against its evidence and write one dated close-status box on the EPIC-007 page: each M, MET / closed-by-acceptance, with its note or ticket. If any M is NOT met, say so and do not recommend closing.
- **QE-202-d:** M1's row still says "Skill Level 3" and "ABC-168's context". Add a dated amendment that M1 is read at default options = Skill Level 5 (ADR-0045 D4) and its raw files live under `qe-read-ABC-202`. Keep the old text visible (superseded marker). This corrects the record to what the owner already accepted; it moves no bar. If you judge it does move a requirement, STOP and say so.
- Recommend whether the Orchestrator closes EPIC-007. Leave `status`/`column` unchanged; the card move is the Orchestrator's.

## Fences
- Work on `grugops/bapm-close-EPIC-007` (worktree `../wt-bapm-close-EPIC-007` from `main`). Only the EPIC-007 page and your notes. No `src/`, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, `memory-bank/50-decisions/`, ticket pages. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm007c/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-close-EPIC-007`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
