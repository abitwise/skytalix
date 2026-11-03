# qe-ABC-269 G2 (B6) read once under PREREG `arch-ABC-269-F3` `…e36ee7ca`: **MET**. R = (1.0186 + 1.0560) / 2 = **1.0373** ≤ 1.0500 (unrounded 1.0373360328). Both sessions valid on the control (c = 1.0200, 0.9974). u = 1.0836 / 1.0915 ties the window to the recorded miss. ns per node: H's `chooseMove` is below U's on both boards in both windows, so the "cost moved, not cut" finding does not fire

QE/E2E, task `qe-ABC-269`, the first act of the verdict hop, before B5, B7 and B8. ALONE window (the Orchestrator dispatched nothing else). Each session ran under `flock host-test.lock`, one process, nothing else of QE's running. Raw: `raw/out/g2-s1.out`, `raw/out/g2-s2.out`; scripts `raw/scripts/g2q.ts`, `npsq.ts`, `check.ts`, `session.sh`.

## Arms (scratch copies under the scratchpad, from `git archive`; deleted afterwards)
- **B:** `main`'s `src/` tree `58fa3eb4` (dir 1). **C:** the same tree (dir 2). `git rev-parse main:src` = `58fa3eb4` at the reading.
- **H:** `grugops/ABC-269` at **`561fc028`** (src tree `4d6b117b`), the commit where P1–P7 are green; the branch head `be87a2f1` (main merged in) has the same src tree. Arm = `evaluateAtPhase`, the function the three tapered call sites call (`search.ts` futility and leaf, `quiescence.ts` stand pat; read in the copy).
- **U:** `110292d4` (src tree `b8b44ff3`), `evaluate`.
- A non-timing pre-check (`check.ts`) before session 1: all four arms import; `H(p, phaseOf(p))` is `Object.is` to `U(p)` on the six roots; B equals C. Phases of the six roots: 24, 24, 4, 24, 24, 24.

## Instrument (`g2b.ts`'s shape)
- The six perft roots, N = 200 000 calls per root per round, 6 rounds, round 1 dropped; each arm's statistic is the mean over rounds 2–6 of its mean over the six roots, ns per call.
- Every arm called `ev(position, phase)` with `phase = phaseOf(root)` computed once per root before timing (H's `phaseOf`); no wrapper closure; a running sink (`sink % 7` printed, 0 both sessions).
- Reversal: `g2b.ts`'s loop, `r % 2` on the 0-based round index (rounds 2, 4, 6 counted from 1 run reversed). Recorded as the reading of "odd rounds" that matches the instrument named.
- Session 1 listed **[B, C, U, H]**; session 2 **[H, U, C, B]**.

## Readings
| session | window (`date -u`) | load1 start → end | B | C | U | H | c_s | u_s | **r_s** |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 11:32:16Z–11:32:25Z (nps to 11:32:48Z) | 0.58 → 0.72 (0.97 after nps) | 301.93 | 307.96 | 327.17 | 307.56 | 1.0200 | 1.0836 | **1.0186** |
| 2 | 11:32:52Z–11:33:02Z (nps to 11:33:24Z) | 0.97 → 1.13 (1.22 after nps) | 305.30 | 304.50 | 333.25 | 322.41 | 0.9974 | 1.0915 | **1.0560** |

- `node` v26.12.1 both sessions.
- **R = 1.0373 (1.0373360328). MET iff ≤ 1.0500: MET.** No void (both c_s inside [0.970, 1.030]); no re-run; no extra session; nothing dropped.
- Spread, reported plainly: session 2's H rounds 2–6 read 352.5, 310.3, 310.6, 319.2, 319.5 (round 2 is H run last in a reversed round). Session 1's H rounds were 306.9–308.4. Nothing in the PREREG drops a round or an outlier, and none was dropped; the verdict stands on the means as read.

## ns per node (report, not graded; `nps.ts`'s shape, right after each session)
`chooseMove` to depth 8 on a frozen clock, 3 rounds alternating, round 1 dropped. Nodes are exact B0 every round: H 1 296 788 / 404 930; H door and `main` 1 306 981 / 391 451; U 1 296 788 / 404 930.

| window | board | H | H door | U | main | H/U | H/main | H door/main |
|---|---|---|---|---|---|---|---|---|
| 1 | kiwipete | 1092.5 | 1069.1 | 1118.5 | 1067.3 | 0.9768 | 1.0236 | 1.0016 |
| 1 | position-6 | 1174.7 | 1162.7 | 1253.5 | 1146.4 | 0.9371 | 1.0246 | 1.0142 |
| 2 | kiwipete | 1105.3 | 1088.7 | 1121.0 | 1057.5 | 0.9860 | 1.0452 | 1.0295 |
| 2 | position-6 | 1193.6 | 1175.3 | 1196.0 | 1154.7 | 0.9980 | 1.0337 | 1.0178 |

- **H's `chooseMove` ns per node < U's on both boards in both windows**, so the PREREG's finding ("the cut moved the cost and did not cut it") does not fire.
- The door against `main` reads +0.2 % to +3.0 % (forecast "about `main`"); H against `main` +2.4 % to +4.5 % per node. A report.

## Outcome (as written in the PREREG)
MET: QE continues the verdict on the cut build with B5, B7 and B8.
