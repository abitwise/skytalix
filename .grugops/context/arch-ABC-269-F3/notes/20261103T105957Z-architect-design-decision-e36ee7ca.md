---
id: 20261103T105957Z-architect-design-decision-e36ee7ca
kind: decision
by: architect-design
at: 2026-11-03T10:59:57Z
verified_by: 
confidence: high: a protocol fixed before C1 exists in code (grugops/ABC-269 at 110292d4) and before any reading of it; bar text unchanged (ADR-0064 B6 1.05x); instrument identical to the one that recorded the miss
refs:
  - arch-ABC-269-F3
  - grugops/arch-ABC-269-F3
  - ABC-269
  - EPIC-011
  - E1
  - ADR-0064
  - ADR-0031
  - ADR-0020
  - ADR-0002
  - ADR-0055
  - ADR-0061
  - NFR-001
  - NFR-005
  - Q-3K-4
  - B0
  - B5
  - B6
  - B7
  - B8
  - F3
  - F6
  - G2
  - G6
  - O1-e
  - C1
  - 110292d4
  - b7a8fc3a
  - b8b44ff3
  - 58fa3eb4
  - 47084b6a
  - src/evaluate.ts
  - src/quiescence.ts
  - src/search.ts
  - src/engine.ts
  - src/evaluate.taper.test.ts
  - se-ABC-269/20261103T104753Z-software-engineer-decision-7445784f
  - se-ABC-269/20261103T104753Z-software-engineer-observation-669f366c
  - se-ABC-269/20261103T104753Z-software-engineer-observation-ce3d0c5f
  - arch-ABC-269-rule/20261103T093305Z-architect-design-decision-8ccb561f
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
supersedes: 
seal: sha256:f6fd3999fa886096169cda359fbde0c75e51d3877caca58eed79c2c94f93b02b
---

# arch-ABC-269-F3 PREREG, sealed before any reading of cut C1: the one `G2` (B6) re-read under `ADR-0064` F3. QE takes it once, in two sessions in one process each, by the instrument that recorded the miss (`g2b.ts`'s shape). It compares the cut build's shipped tapered entry, with the phase supplied, against `main`'s `evaluate`, with a `main`-copy noise control. The verdict is the mean of the two session ratios, MET iff ≤ 1.0500. A session is void only on its control, at most one re-run. Both outcomes are written below. The bar is unchanged

Architect/Design, task `arch-ABC-269-F3`. Sealed before cut C1 exists in code: `grugops/ABC-269` is at `110292d4`, and C1 is ordered in this task's first decision note. Nobody, including this hop, has taken a timing reading of C1. **The bar is `ADR-0064` B6 as written, ≤ 1.05 × base per call, unchanged.** This PREREG fixes only how its one post-cut reading is taken.

## Reader, builds and window
- **Reader:** QE/E2E, in the `ABC-269` verdict hop, before B5, B7 and B8. Not the Engineer: the builder of the cut does not read its own bar.
- **Arms**, all imported into **one** `node` process per session:
  - **B, the base:** `main`'s `src/` at tree `58fa3eb4`, from `git archive` into scratch dir 1.
  - **C, the control:** the same tree in scratch dir 2.
  - **H, the graded arm:** the cut build's shipped tapered entry, the exact function that C1's three tapered call sites call. The build is `grugops/ABC-269` at the commit where P1–P7 are green; that commit is named in the reading.
  - **U, a report:** the uncut build's `evaluate`, from `grugops/ABC-269` `110292d4` (src tree `b8b44ff3`).
- **Host:**
  - each session under `flock <scratchpad>/host-test.lock`, one core, with nothing else of QE's running;
  - recorded per session: the `date -u` start and end, load1 at start and end, `node --version`, and the hashes;
  - scratch checkouts under the scratchpad, deleted afterwards.

## Instrument (`se-ABC-269` `raw/scripts/g2b.ts`'s shape, the one that recorded the miss)
- **Positions and length:** the six perft roots (`ABC-076`), with N = **200 000** calls per root per round.
- **Rounds:**
  - **6 rounds.** Odd rounds run the arm list in reverse.
  - **Round 1 is dropped** as warm-up. Each arm's statistic is the mean over rounds 2–6 of its mean over the six roots, in ns per call.
- **How each arm is called:** `ev(position, phase)`.
  - `phase = phaseOf(root)` is computed once per root, before timing.
  - B, C and U ignore the second argument.
  - No wrapper closure around any arm, and no other argument.
  - A running sink defeats dead-code elimination, as in `g2b.ts`.
- **Arm order (`ADR-0031` d3, the second session in reverse):**
  - session 1 lists **[B, C, U, H]**;
  - session 2 lists **[H, U, C, B]**.

## Statistic and verdict
- **Per session s:** r_s = mean(H) / mean(B).
- **Verdict:** R = (r_1 + r_2) / 2.
  - **MET iff R ≤ 1.0500**, compared on the unrounded value and printed to 4 dp.
  - **NOT MET otherwise.**
- **Void rule, decided on C alone:** a session whose c_s = mean(C) / mean(B) lies outside **[0.970, 1.030]** is void.
  - A void session is re-run once, in its own recorded window, with the same order.
  - A second void in the same slot is a **STOP to Architect/Design** with every reading attached. There is no verdict and no further session.
- **Nothing else voids, adds, or drops anything:**
  - no load threshold;
  - no extra session or extra round;
  - no dropped root or outlier;
  - no re-read after a verdict.

## Reports (printed with the verdict; not graded)
- **u_s = mean(U) / mean(B)** per session. It is expected near 1.07, and it ties the session to the recorded miss. **c_s** per session.
- **ns per node** (`nps.ts`'s shape, read in the same window, right after each `G2` session):
  - `chooseMove` to depth 8 on a frozen clock, kiwipete and position-6;
  - arms: H's `chooseMove`, H's `chooseMoveWithoutTaper`, U's `chooseMove`, and `main`'s `chooseMove`;
  - 3 rounds alternating, round 1 dropped.
  - **If H's `chooseMove` ns per node ≥ U's in both windows,** QE records it as a finding: the cut moved the cost and did not cut it. It does not change the `G2` verdict. B7 still grades the whole engine.

## Outcomes, written before the reading
- **MET:**
  - QE continues the verdict on the cut build: B5 (`ADR-0061` d8 (d) audit), B7 and B8.
  - B7 is `G6` at `LEVELS[5]` 4 000 ms, by `ABC-205`'s rule. Under `Q-3K-4` = (b) it is graded on `NFR-005` alone: every run at depth ≥ 6 (FAIL below), depth 7 a WARN, and each board's median against base reported.
  - B8 is C2′ ≥ 50.0 of 100, S′ and the Levels lane, with the host alone.
  - Then UAT, signed by the QE verdict.
- **NOT MET:**
  - This is **F3's second miss: `ABC-269` is not merged.**
  - No further cut, and no value tuned to pass.
  - B5, B7 and B8 are not run.
  - Architect/Design writes `ADR-0064`'s dated "accepted, not in force on `main`" line.
  - Re-offering the structure with equal halves is F6's path and E2's call.
- **STOP (a double void):** to Architect/Design, with no verdict. Only a recorded host fault justifies a new window, and that window gets a new dated PREREG line before it runs.
