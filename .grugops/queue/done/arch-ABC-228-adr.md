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

## Result

**2026-10-29, Architect/Design. Done. Branch `grugops/arch-ABC-228-adr` @ `5915e5e6` (local, not pushed, not merged).**
Records plus probes, at `main` `95f7369e`, whose `src/` equals `38536a34`'s. The branch holds the ADR folder and
this task's context only. There is no `src`, `data`, `tools`, board, ticket, epic, NFR-catalog or traceability edit.

- **ADR:** `memory-bank/50-decisions/ADR-0053-in-check-quiescence-searches-every-evasion-and-scores-none-as-mate-and-quiet-queen-promotions-join-the-capture-list-each-behind-an-off-door-pair.md`,
  **PROPOSED**. It amends `ADR-0024` d4 for two items. `ADR-0024`'s own text is not edited; a dated line follows on
  acceptance.
- **Notes** (task `arch-ABC-228-adr`, sealed): `20261029T212006Z-architect-design-observation-0bb867fb` (the
  readings) and `20261029T212006Z-architect-design-decision-374a0ef4` (the rules, the proof, the owner call). The
  `propose_note` tool was not available in this session, so both were written with the plugin's `admitAndAppend`, the
  call `propose_note` makes.
- **Evidence** (`raw/`): eight single-process probes, 264 s of CPU in total, each under 5 min. They ran on scratch
  copies of `src/`, at a fixed depth or on a frozen clock. `pgrep -x cutechess-cli` was empty before each probe, and
  load1 was 4–10.
- **Rules:**
  - **In check, below the cap:** no stand pat. Every legal move is searched, sorted by `mvvLvaKey`, fail-soft. With no
    legal move, the score is `−(MATE_SCORE − (ply + qply))`.
  - **Bound:** the cap of 8 only. At the cap the node stands pat.
  - **Promotions:** quiet promotions to a queen, from the capture pass. Quiet under-promotions are out.
  - **Doors and oracle:** two `ADR-0026` d10 door pairs, with bars in d8.
  - **Node bars:** `A4` 1.368× / 1.405× (bar 1.5×); `ABC-229` 1.019× / 1.000× (bar 1.2×).
- **Proof owed:** `ADR-0053` decision 9.
- **Owner call:** yes, not the Orchestrator's. The standing ruling (`…5aaf7cec` item 3) keeps with the owner any ADR
  that changes an accepted one. `ADR-0024` is owner-accepted.
- **`OQ-228-1` (owner):** on today's `main`, position-6 needs 125 % of base's 3 s nodes, so `G6` "≥ base" is
  forecast NOT MET. The recommendation is (a): grade the floor and report "≥ base" for `ABC-228` and `ABC-229`. The
  forecast is re-read after `ABC-235`.
- **`ABC-081` `A5` re-pin:** −485 → −392. It is the SE's, under `ADR-0026` d7.
- **`UNKNOWN - verify`:** `G1`; the `chooseMove` drift; the other default-lane pins; strength.
- **STOP:** none for the build. The smokes and the merge wait on the owner's acceptance and on `OQ-228-1`.

### Trace row (10 cells, header order)

| ABC-228, ABC-229 (design) | ADR-0053 PROPOSED: in-check evasions with mate in quiescence, and quiet queen promotions, each behind an ADR-0026 d10 door pair; amends ADR-0024 d4 | EPIC-010 | — | NFR-005 (G6 forecast: position-6 125 % of base's 3 s nodes, OQ-228-1), NFR-004 (G5; evasion nodes clocked), NFR-008 (fixed-depth rows only), NFR-009 (no new state); ADR-0053 (new), ADR-0024 d4 (amended on acceptance), ADR-0026 d10, ADR-0050 rows re-pointed; notes …0bb867fb, …374a0ef4 | grugops/arch-ABC-228-adr @ 5915e5e6 (records only): ADR-0053 + .grugops/context/arch-ABC-228-adr/notes/ (2) + raw/ (8 probes, outputs, instrumentation diff) | probes only (no test run): door identity 10/10; d6 nodes 1.368× / 1.405×; d5 drift 89.30 %, max 118 cp; mate floor 189/189; zugzwang 7/7 | — (UAT owed at the build tickets) | — | PROPOSED; owner acceptance + OQ-228-1 pending |
