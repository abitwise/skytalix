---
subtask: arch-ABC-228-adr
role: architect-design
tickets: ABC-228, ABC-229
ref: .grugops/context/arch-ABC-228-adr/
branch: new grugops/arch-ABC-228-adr from main, worktree ../wt-arch-ABC-228-adr
---

# The ADR that ABC-228 (in-check evasions, mate in quiescence) and ABC-229 (quiet queen promotions) wait on

## Read
- ABC-228 and ABC-229 pages; EPIC-010 (merge rule, smokes); SA `sa-ideas-verify/…306a4012` item 1 (the leaf mate test
  exists; ABC-210's horizon check extension measured −4.8 ± 16.2).
- ADR-0024 (d4 keeps checks and quiet promotions out of quiescence), ABC-079's recorded decision, ADR-0026 d10 (order
  changes under LMR), and whatever bounds quiescence cost (NFRs, G-gates).

## Do
- Write the ADR (an amendment of ADR-0024 d4, or a new ADR that supersedes that clause), status PROPOSED:
  - in check inside quiescence: no stand-pat; search all legal evasions; no evasion = mate score (ply-adjusted);
  - quiet queen promotions in quiescence (and under-promotions? rule it);
  - how the search stays bounded (check-evasion depth cap or similar) and the cost budget (node growth on the fixed
    boards; a measurable bar for the SE);
  - the ADR-0026 d10 off-door, and how this differs from ABC-210's rejected extension.
- Name the proof the SE owes: tactical positions (quiet evasions, capture-mates, promotions) as test rows; G-gates.
- Name the owner question, if any. With the owner's delegation, an ADR amending a design clause that the Architect
  owns may be accepted by the Orchestrator unless it is a big architecture call: say which this is.

## Fences
- Records only: the ADR folder plus your context. Probes are single-process, under 5 min of CPU, only when
  `pgrep -x cutechess-cli` is empty. Two SEs build in parallel (`se-ABC-225` in tools/rating, `se-ABC-235` in src): don't
  touch their files, and keep probes light. Never push, force, amend or rebase. Never merge into main. No board,
  ticket or epic edits.

## Publish
- Seal notes (task `arch-ABC-228-adr`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/.
