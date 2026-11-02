---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T15:32:27Z
subtask: bapm-phase2-records
role: ba-pm
ref: .grugops/context/bapm-phase2-records/
branch: new grugops/bapm-phase2-records from main (f53b5bda) — worktree .claude/worktrees/bapm-phase2-records
width: records only; no test, build or engine run.
---
# Phase 2 records after ABC-264 drop and the ADR-0060 re-open
## Read
arch-phase2-rebase notes (…f9f440c9, …e4680ed2), arch-ADR-0060-reopen notes (…79be958e, …e17a23f4), ADR-0059/0060 status blocks.
## Do (plans/ only)
- ABC-264: close as Done (dropped, F5; retry DROP — re-cut needs a new ticket and a named new premise); keep QE-264-p2-b open for tools; S′ unpooled. Drop P2 from EPIC-011 Phase 2; order P1 → P4 → P3 → P5 → P6 per ADR-0056 D2, with P1 PARKED on main (no pre-registered form meets every bar; re-measure decision 1 unchanged after P3 merges, or after O1h).
- Stub the P1 page as Backlog/parked (title without "history-adjusted", intent GAIN, bars carried from ADR-0060, dependencies: re-measure trigger, then owner acceptance). Do not give it an ABC number if the epic convention keeps parked stubs title-only — your call, stated.
- Record the optional owner question (A3 cap re-derived to 94 cp; default keep) in EPIC-011's owner-question list.
## Fences
plans/ and your records only; no src/tests/memory-bank/board. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-phase2-records, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

_by: ba-pm (claude-opus-5-5, bapm-phase2-records) at 2026-11-02T15:38:13Z_ — records only, nothing run.

- **ABC-264: closed as dropped, not merged.**
  - Front matter is `status: dropped`, `column: Done`, with a `closed:` line (the old `blocked:` text is quoted).
    The `adr:` line reads "NOT IN FORCE on main".
  - The top block records:
    - retry **DROP** (`…f9f440c9`);
    - `ADR-0059` accepted, not in force;
    - a re-cut is a new ticket with a named new premise (by reference to `ADR-0059` § Status);
    - gap dispositions: `QE-264-p2-b` open for tools, `QE-264-e` carried by any re-cut;
    - the S′ 7.0 / 10 unpooled.
  - A dated closing line is added under the DoR.
- **EPIC-011:**
  - a top block;
  - Phase 2 rows: P2 dropped; P1 parked with "history-adjusted" struck; P4 waits with P1; P3's and P6's "after P2"
    struck;
  - § Tickets row 16 set to dropped;
  - a new subsection **"P1, parked (stub)"**;
  - the owner-question row **"P1's 27 cp cap"** (optional, 94 cp, **default keep**);
  - `RISK-EPIC011-08` (Phase 2 lost P2 and P1 for now).
- **The stub decision: title-only, no ABC id** (the call the brief left to BA/PM). Reasons:
  - § Phases gives an id and a full page at refinement. Phase 2 has done that only for the item about to be pulled.
  - P1 has no rule written into `ADR-0060`, so it cannot be refined.
  - A page would copy bars whose single home is `ADR-0060` d8/d9.
  - No ticket here was ever parked before refinement.

  The Architect's `…e4680ed2` suggested an id. That divergence is stated on the page. BA/PM cuts the page with the
  next free id when the re-measure passes.
- **Commits:** claim `286b2660`; records `bff76da1`; notes `48f24e91`. This Result, the trace row and the move to
  done/ are in the closing commit. Not pushed, not merged.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at`
  2026-11-02T15:37:42Z; 2 of 2 read back, index rendered):
  - decision `20261102T153742Z-ba-pm-decision-8d02a468`;
  - observation `20261102T153742Z-ba-pm-observation-aaa39809`.
- **Open:**
  - Orchestrator: the board cards (`ABC-264` → Done/dropped; P1 has no card).
  - Owner (optional): the 27 cp cap question.
  - BA/PM, later: whether `ABC-233` carries a history term in LMR (`ADR-0060` d11).

### Trace row (10 cells, header order)

| bapm-phase2-records | ABC-264 closed as dropped, not merged (retry DROP, arch-phase2-rebase f9f440c9; ADR-0059 accepted, not in force; re-cut = new ticket + named new premise per ADR-0059 § Status; QE-264-p2-a closed by disposition, QE-264-p2-b open for tools, QE-264-e carried by any re-cut; S′ 7.0/10 unpooled; status dropped / column Done); EPIC-011 Phase 2: P2 dropped, order P1 → P4 → P3 → P5 → P6 (ADR-0056 D2), P3/P6 "after P2" void, P4 waits on P1; P1 PARKED on main (ADR-0060 re-open e17a23f4: no pre-registered form meets every bar) as a title-only stub, no id (BA/PM call: ids at refinement; no rule to build; bars single-homed in ADR-0060 d8/d9), title without "history-adjusted", intent GAIN, S–M, P2, deps: re-measure decision 1 after P3 merges or O1h, then owner acceptance; optional owner question: A3 27 cp cap re-derived to 94 cp, default keep; RISK-EPIC011-08 | EPIC-011 | ADR-0059 (accepted, not in force); ADR-0060 (proposed, re-opened; no rule written in); ADR-0056 D2 | NFR-005, NFR-008 (bars carried unchanged by reference) | `grugops/bapm-phase2-records` (claim `286b2660`, records `bff76da1`, notes `48f24e91`) | records only; nothing run | — (records) | — | Records done (BA/PM); board moves the Orchestrator's (ABC-264 → Done/dropped); owner: optional 27 cp cap question (default keep) |
