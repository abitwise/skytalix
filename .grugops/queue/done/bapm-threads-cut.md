---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T13:52:30Z
subtask: bapm-threads-cut
role: ba-pm
ref: .grugops/context/bapm-threads-cut/
branch: new grugops/bapm-threads-cut from main (9dc320b1) — worktree .claude/worktrees/bapm-threads-cut
width: records only; no test, build or engine run.
---
# Fold owner answers into EPIC-011 pages; cut the thread tickets
## Read
Owner decision …81ae2db4 (.grugops/context/orch-2026-10-30a/), ADR-0057 § "Inputs for the thread tickets", ADR-0056 C2′/C1/D6, ADR-0058/0025 status lines, arch-owner-answers-1102 notes (…1b50793b, …a0df22b8, …c0591ef8).
## Do (plans/ only)
- EPIC-011: lift the "Threads" half of § Out of scope (pondering stays out); record P (phase 1 paused, owner order), C2′ (NEUTRAL bar named on the page before the read), the 40/15 claim labelled 1 CPU / N CPU (OQ-3 c, Threads 1 first), NFR-009 reading (OQ-4 a), OQ-5 no, OQ-6 later. Place the thread strand per ADR-0057 (after Phase 2 + R1, before Phase 3; TH-1 may run beside Phase 2).
- Cut TH-1 (shared table), TH-2 (worker pool + UCI Threads option, default 1), TH-3 (tests/lanes; may fold into TH-2) as ABC tickets with acceptance rows from the ADR-0057 inputs, sizes, falsifiers, reads (TH-1: no game read, G4 identity + G6; TH-2: Threads N vs Threads 1 GAIN read, hardware gain). Mark DoR honestly — TH-1 needs its ADR-0025 amendment written before Ready.
- ABC-264 page: A2 wording per ADR-0059 QE-264-b fix (static bound ≤ 10 885 cp).
- ABC-237/257/258 pages: status lines for P/A/B (paused / accepted-not-in-force / parked).
## Fences
plans/ and your records only; no src/tests/memory-bank/board edits. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-threads-cut, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.

## Result

_by: ba-pm (claude-opus-5-5, bapm-threads-cut) at 2026-11-02T14:04:06Z_. Records only; nothing run, built or timed.
`plans/` and this task's notes only. No `src/`, tests, `memory-bank/` or board edit.

- **EPIC-011**, folding the owner's answers (`…81ae2db4`). There is a new top block, and each section below carries
  dated marks. Old text is struck, not deleted.
  - § Out of scope: the "Threads" half is **lifted** (OQ-1 yes). Pondering stays out. Accelerators (OQ-5 no) and
    several games at once (OQ-2 a) are named out. The neural line notes OQ-6 "later", on the V4 trigger.
  - **P** is recorded as his order. The Phase 1 header and the cheapest-slice item 3 say so.
  - **C** goes into § The per-change rule. NEUTRAL (≥ 43.0/100) may grade a change invisible at 100 ms. It never
    stands alone: its own pre-registered bar must also pass. **The ticket's page names it before the read**, written by
    BA/PM from the design note at or before Ready.
  - **OQ-2 a:** every 100 / 400 read stays `Threads 1` against `Threads 1`. `ABC-266`'s own read is the one
    exception.
  - **OQ-3 c:** G1 and R3 carry the claim labelled "1 CPU" / "N CPU", `Threads 1` first.
  - **OQ-4 a:** the `NFR-009` trigger reads retained growth summed over workers, with the table counted once. Q-3K-6
    stays open.
  - New risks: 06 (an unlabelled claim, or reads drifting to several threads) and 07 (a flaky multi-worker lane).
  - Dependencies and test notes are updated. Owner questions: Q-3K-3 is refined, OQ-1–6 are answered, and there is a
    new row for TH-1's `ADR-0025` ask.
- **Place:** a "threads" block in § Phases after R1, before Phase 3 (`ADR-0057` D6's dated line, adopted).
  `ABC-265` may be pulled beside Phase 2 by width. All three land before W1 and any 40/15 reading.
- **Cut:**
  - **`ABC-265` TH-1, the shared table:** M (L if its fallback fires), P2, value-identical, no game read.
    - It reads `G4` node-equal with the `ABC-081` / `ABC-122` / `ABC-208` rows unedited, and `G6` ≥ base plus the
      profile.
    - F2 is the halves fallback. Scope 7 carries the false comment at `transposition.ts:58-60`.
    - **DoR 9/10:** its `ADR-0025` amendment is not written. It goes to the owner when written; reading (b) lets the
      build start.
  - **`ABC-266` TH-2, the worker pool and `Threads` (default 1):** L, P2, GAIN labelled a hardware gain.
    - A7 is one read, `Threads N` against `Threads 1`, at 100 ms, ≥ 50.0/100, in wall time and core-seconds. S′ and
      the Levels lane run beside it at `Threads 1`.
    - `Threads 1` must stay node-equal (A2). A5 is `NFR-009` summed over workers.
    - **DoR 9/10:** the ADR amending `ADR-0044` D3/D5 is not written (the D5 reversal is pre-accepted), and
      `ABC-265` is not merged.
  - **`ABC-267` TH-3, the tests and lanes:** S, P2, test-only.
    - The torn-entry stress needs ≥ 10 M probes, 0 undetected corrupt hits and torn slots > 0.
    - It adds a standing `NFR-009` row summed over workers, and at most one 2-worker default-lane row, with the
      default lane read at ≤ 10 s before and after.
    - It may fold into `ABC-266`.
    - **DoR 9/10:** `ABC-266`'s ADR is not written, and `ABC-266` is not merged.
  - Sizes split BA/PM's way: about 10–20 + 15–35 + 5–10 h, inside `ADR-0057`'s 32–65 h (an estimate).
- **ABC-264:** a top block records `ADR-0059` ACCEPTED, so A6 and the merge no longer wait on the owner. The `adr:`
  line is updated. **A2's static-score sentence is struck** and replaced by |`evaluate`| ≤ 10 885 cp, derived and not
  asserted (`QE-264-b`, `ADR-0059` d2). No row or bar moved, and intent stays GAIN.
- **ABC-237 / 257 / 258:** status blocks and row-10 marks.
  - `ABC-237`: B, parked with `ABC-258`.
  - `ABC-257`: P is now the only hold, because its C2′ trigger is spent. A: `ADR-0058` is accepted, not in force, until
    A8′ is met. Its title and `adr:` line are updated.
  - `ABC-258`: P, plus B. It is re-asked after `ABC-266` on the shared table.
  - Each page records that its C2′ intent line is owed at resume or re-ask, not now. DoR is unchanged (9 / 8 / 9).
- **Open, for the Orchestrator (none blocks `ABC-264`):**
  1. TH-1's `ADR-0025` amendment: ask the owner when it is written, or read OQ-1 as covering it.
  2. Fold `ABC-267` into `ABC-266`, or keep it separate.
  3. Does `ABC-265` owe the ≈ 1 h S2 nps reading on top of A4? `EPIC-011`'s rule keeps S2 for value-identical
     tickets, and `ADR-0057` names only `G6` plus the profile.
  4. Can `ABC-255`'s `d` set `Threads` per side? (`UNKNOWN - verify`, the `ABC-266` design hop's.)
  5. The board cards for `ABC-265`–`ABC-267` (Backlog).
  6. Lifting `ABC-257`'s pause, within P.
- **Commits:** claim `7be726cd`; records `927bb1a3`; notes `4d6cae33`. This Result, the trace row
  (`plans/traceability.md`, appended) and the move to done/ are in the closing commit. Not pushed, not merged.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` 2026-11-02T14:02:53Z
  from `date -u`; 3 of 3 read back, `sealVerdict` ok, index rendered):
  - decision `20261102T140253Z-ba-pm-decision-c52ea613`: the thread strand cut, and the EPIC-011 folds;
  - decision `20261102T140253Z-ba-pm-decision-747fd06d`: the ABC-264 A2 wording and the ABC-237/257/258 status lines;
  - observation `20261102T140253Z-ba-pm-observation-5366a99c`: the artifacts and open questions.

### Trace row (10 cells, header order)

Appended to `plans/traceability.md`, the row headed `bapm-threads-cut`.
