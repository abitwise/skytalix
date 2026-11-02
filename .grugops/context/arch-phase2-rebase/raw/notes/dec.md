# ABC-264 retry ruling: DROP (no re-play, no 150 cp re-cut on today's main); ADR-0059 accepted, not in force, QE-264-e named; ADR-0060 re-measured on main misses A3's 27 cp cap and A4 (a) on chooseMove position-6, so F1 re-opens it and the build does not start; bars unchanged

## Context
Brief arch-phase2-rebase. ABC-264 A6 NOT MET at 44.0 / 100 (qe-ABC-264-p2 …4a487d20, …3af11ebd); ADR-0059 F5 fired. ADR-0060 (PROPOSED) was measured on the ABC-264 head 4d1c0616. Probe: the observation in this task (same `at`).

## Decision
1. **ADR-0059: ACCEPTED, NOT IN FORCE ON main, 2026-11-02** (dated status block). Not a defect (A1-A4 MET, counts to the node).
2. **QE-264-e named** (INFO, design residual): a cut node with >= 3 non-pawn pieces, not in check and no legal move (stalemate) returns beta, not 0; null-move class; unmeasured, vanishingly rare; owed by nothing while not in force; any re-cut guards it or carries it.
3. **Retry ruling: DROP.** Reasons:
   - Noise: SD 4.2 points; P(score <= 44) is 0.010 at +30, 0.004 at +40, 0.023 at +20, 0.095 at 0. D2's +30-60 is contradicted at ~99 %; consistent range about -100 to +17 (cutechess 95 % interval). A re-play of the same rule is ~a coin flip at a true 0 and a pass would mostly be the winner's curse.
   - Bug class: none indicated (stalemate cannot cost 42 Elo over 100 games; eval bound 10 885 << MATE_FLOOR, mate-band plant red twice; 0 time losses, max 105 ms; A1 node-equal, 7/8 plants red; colour split noise-sized).
   - 100 ms depth: not the reason. Measured +0.70 ply at 47 000 nodes (2x P1's +0.305) and still -42 Elo: the loss is on the value side.
   - Margin: likeliest cost is the depth-1 guess under a minor piece's value skipping threats (judgement, UNKNOWN - verify); drift at d5 cannot see it.
   - F1's 150 cp: pre-chosen for a drift red, not a strength miss; still below a piece; buys less (+0.61 ply); repurposing it after a score is re-classing.
4. **Re-cut only as a new ticket under a new premise:** E1/E2 landed (margin re-read), O1h landed (improving/history gate), an owner-asked 500 ms read, or a probe showing the depth-1 guess is the cost with a changed form. Bars: every ABC-264 bar unchanged (A1 +3 names; A3 >= 95 %/25 cp, <= 160 cp, 0 sign, mate floor 0, zugzwang 7/7 at 9/11/12/8/8/8/8; A4 <= 0.75x both recursions + G6; A5 G1 >= 54/58; A6 GAIN >= 50.0, S′ >= 3.0/10, Levels) plus reach at 47 000 nodes >= door + 0.25 ply and QE-264-e guarded or carried; intent GAIN.
5. **ADR-0060 re-based on main and re-opened.** Door counts on main 1 116 785 / 1 602 457 / 1 575 537 / 476 244; head 849 358 / 1 183 439 / 1 155 460 / 414 286; reach 5.558 / 5.811. Missed: A3 27 cp cap (63 cp search()), A4 (a) chooseMove position-6 0.8699. Met: three other A4 (a) readings, A4 (b) by 0.0026, drift 95 %/25 cp both, 0 sign flips, mate +1 0/163, zugzwang 7/7, G1 54/58. **No bar moves.** F1: NOT MET, re-opened with a new probe; F4: would not merge. Deterministic readings: a faithful build would read these figures, so **the build does not start on this text**; the owner is not asked to accept it until the re-open. No measured variant meets both missed bars on main; PV -2 removes the 63 cp row but saves nothing on position-6.
6. **The re-open is a new hop:** choose the rule on its merits (reach, zugzwang, G1, mate floor), not fitted to the two bar boards; every bar number carries over. Text changes owed on re-open: decision 4 (no reverse futility in the doors), decision 5 (main's door list), decision 6 (no ABC-264 re-point).
7. **ADR-0056 D2:** dated line, row P2 dropped; row P1 re-opened; order P1 (re-opened) -> P4 -> P3 -> P5 -> P6, P3-ahead-of-P1 the Orchestrator's call.
8. **BA/PM inputs for the P1 page:** see the artifacts observation (same `at`).

## Alternatives
- Retry the same rule (coin flip; C2′ forbids re-play for luck). F1's 150 cp re-cut (wrong lever, buys less, re-classing). Keep ADR-0060 and start the build from main (deterministically fails A3/A4). Loosen the 27 cp cap or the 0.85 bar (owner's word, not taken). Tune a variant on the two bar boards until it passes (the bar would measure nothing).

## Scope
Records only: ADR-0059 and ADR-0060 dated status blocks (and dated bullets in ADR-0060 d9 and § Consequences), ADR-0056 D2 dated line. No src/, tests, plans or board. ADR-0025 untouched.

## Risks
- If the owner keeps the 27 cp cap, the re-open may find no form that meets every bar on main (every measured variant misses one); P1 then stalls and P3 is next.
- Dropping P2 forgoes a possible small gain the read cannot exclude (+10 at p 0.05).
