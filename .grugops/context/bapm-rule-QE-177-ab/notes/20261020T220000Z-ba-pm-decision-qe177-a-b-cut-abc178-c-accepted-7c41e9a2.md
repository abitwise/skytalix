---
id: 20261020T220000Z-ba-pm-decision-qe177-a-b-cut-abc178-c-accepted-7c41e9a2
kind: decision
by: ba-pm
task: bapm-rule-QE-177-ab
at: 2026-10-20T22:00:00Z
verified_by:
confidence: high (the rulings, and the gap facts as QE read them); estimate (every ms and every wall figure); UNKNOWN - verify (ABC-177's A10, so whether R2 fits under 9.2 s)
sealed: false
refs:
  - ABC-177
  - ABC-178
  - QE-177-a
  - QE-177-b
  - QE-177-c
  - QE-177-g
  - ADR-0046
  - NFR-008
  - N8-LANE
  - R-174-1
  - EPIC-007
  - ABC-167
  - ABC-171
  - 20261020T192200Z-qe-e2e-observation-abc177-open-points-u8-u1-u7-gap-probes-02deb2e2
  - 20261020T215500Z-qe-e2e-decision-abc177-verdict-amended-timing-still-owed-dbd4875c
  - 20261020T180000Z-ba-pm-decision-abc177-cut-step-1000-ruled-for-h-and-l-not-h-prime-e7b3c210
  - 20261020T185816Z-software-engineer-observation-abc177-coarse-step-search-shape-90221b3e
  - 20261020T150000Z-orchestrator-decision-bfdc97e5
  - plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md
supersedes:
---

# QE-177-a: **CUT** into `ABC-178` (R1). QE-177-b: **CUT** into `ABC-178` (R2, at step 100, finer than `ABC-177`'s). QE-177-c: **ACCEPTED as is**; U8 stays at step 100. `ABC-178` is XS / P2 / EPIC-007, DoR 9/10, Backlog

This note is hand-authored and unsealed. `scripts/context-io.js` is absent from the repo and the kit, and no
`propose_note` tool was available. No stamp is attached. The ticket page is authoritative and this note indexes it.
Records only: no lane, no timing, no probe run, no commit.

The authority for this ruling is the owner's word of 2026-10-21, as the brief transcribes it: *"yes, BA/PM can rule
on QE-177-a and -b"*. The INFO ruling on QE-177-c was asked for by the same brief.

## QE-177-a (LOW): cut. Test-only row R1 in `ABC-178`
- **What was lost.** The fold made A1 lossless within one session, but it dropped the old row's comparison across
  sessions. QP1 (module-scope `held`) survives the whole default lane at `f81bf03c`.
- **Why cut, not accept.**
  - Our own lane change removed this kill; it was not a wish for new coverage.
  - Restoring it costs **≈ 655 nodes, ≈ 4 ms in-thread** at U1's step 1 000. It needs no finer step.
  - "One session per process" is true today. It is a reason the severity is LOW, not a reason to stop the lane
    seeing it.
- **R1:** session 1 runs `["position startpos", "go infinite"]` and is left holding. A fresh session 2 then runs
  `["stop", "ponderhit"]`, and its `out` must be `[]`.

## QE-177-b (LOW): cut. Test-only row R2 in `ABC-178`, **at step 100, finer than `ABC-177`'s 1 000 for U7**
- **What was lost.** On a `go` with a dropped `depth`/`nodes`/`mate` token and no time token, a G cut up to about
  1 000 ms below 3 000 now passes the lane unseen. At base the band was about 100 ms. QP6 (G 2 500) survives the lane.
- **The options, costed:**
  - accept: 0 ms;
  - U7 back to step 100: **≈ 0.9 s in-thread** (6 × 146–153 ms, `uci-rows.out`). Rejected: it spends most of U7's
    saving, and it would reopen `ABC-177`'s scope;
  - **one new row: ≈ 25 621 nodes, ≈ 150 ms in-thread.** Chosen.
- **Why the new row.** One row gets the 100 ms band back at about 1/6 of U7's price. Its bound has the same shape as
  A5's "bare go" and A6-d1: `3 000 ≤ time ≤ 3 200` at step 100. That bound also pins the upper side, which U7's
  `≥ 3 000` never did.
- **The step is finer than `ABC-177`'s, and that is said here as the brief asks.** Step 100 for one new row is not a
  step change to U7. It sits inside the `{1, 10, 100, 1 000}` set under "a row that needs X picks its own step"
  (`ADR-0046` Consequences). For G on that path, the band is the step. Any step above 100 leaves a band wider than
  the one at base.

## The cost against `R-174-1` / `NFR-008`
- **R1 + R2 ≈ 155 ms in-thread, ≈ +0.08 s of wall** under `ADR-0046` D3's 2-slot model. That is about 10 % of the
  ADR's predicted ≈ 0.8 s of headroom, and about 2.5 × `ABC-174`'s +0.03 s. These are estimates, not readings.
- `ABC-177`'s own A10 is OWED, so the real headroom is **UNKNOWN - verify**. So `ABC-178` is gated twice:
  - **sequencing:** it is pulled only after `ABC-177` merges and its A10 reads. If A10 reads > 9.2 s, tranche 2
    (O3) opens, and BA/PM re-rules R2 against tranche 2's measured headroom before any pull. R1 can then go alone;
  - **its own gate:** `N8-LANE` ≤ 650 ms CPU (B7), and `NFR-008` ≤ 10 s on AC on its tip (B8). A reading above
    10 s goes to the owner. The recommended fallback is to drop R2 and accept QE-177-b. No cap moves.
- **`ABC-177`'s scope is not reopened.** The `ABC-178` diff only adds lines (B3: no `-` line), and every U1–U8 line
  and step stays as `f81bf03c` left it.

## QE-177-c (INFO): **fine as is. U8 stays at step 100, and the literal does not go back to 10**
- **It is in-ticket.** `ABC-177` admits {10, 100} for U8 under the owner's word on `ADR-0046`. Condition 2 of
  `…e7b3c210` names step 1 000 only, and it says "this word does not reach it". That was the reading intended
  then, and it is confirmed now.
- **What U8 is for is still pinned.** `ABC-171` A7 asks that two sessions on the same `seededRandom(k)` write the same
  `bestmove` sequence. They still do, over both paths, with the same moves (b1c3, b1c3, e2a6) and the same kill set
  (QE, `u8-shape.txt`). QP4b, the cross-search state probe, is killed by U8 at neither step, so step 10 bought
  nothing there.
- **What was lost is depth, not a kill.** The two level-1 engine searches are now depth 1 instead of depth 4 and
  depth 2. Determinism of search over several iterations is pinned at the engine layer: `engine.test` ABC-170 A3, and
  `levels.test` A7/A10.
- **Going back costs more than R2.** It adds 40 960 nodes, ≈ 0.2 s in-thread, ≈ +0.1 s of wall, against unread
  headroom, for no named kill.
- **If a future row needs a multi-iteration level-1 search under the session, it picks its own step** under the same
  rule (`ADR-0046` Consequences). U8 is not the place for it.

## `ABC-178` (cut, Backlog)
- `plans/tickets/ABC-178-two-additive-uci-rows-restore-the-kills-abc-177-dropped-qe-177-a-b.md`.
- XS, P2, EPIC-007. One file, two additive rows, criteria B1–B9.
- **DoR 9/10.** Item 10 fails: `ABC-177` is not merged, and its A10 is OWED. It becomes 10/10 with no re-cut once
  both land and A10 reads ≤ 9.2 s. Column moves are the Orchestrator's.

## Owner questions
None new. The quiet timing window (pausing `oeselg-labs/platform`) is already owed for `ABC-177`, and `ABC-178`
reuses it.
