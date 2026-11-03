# qe-ABC-274 A5 (`G2`) read once under PREREG `…4b732a08`: **MET**. R = (0.9797 + 0.9997) / 2 = **0.9897** ≤ 1.0500 (unrounded 0.9896932361). Both sessions valid on the control (c = 0.9982, 1.0001). Spread |r₁ − r₂| = 0.0201, under the 0.037 reference; |R − 1.0500| = 0.0603, so no "within one session spread" label. H / `58fa3eb4` (E1 + E2-pre together, report) 0.9980 / 1.0130. S2 nps (report): H / B per node 0.977–1.002

QE/E2E, task `qe-ABC-274`, after the PREREG was sealed and committed (`25dc5b1e`) and before any other timing. ALONE window: the Orchestrator dispatched nothing else; no foreign vitest or cutechess-cli before either session; each session one `node` process under `flock …/host-test.lock`. Raw: `raw/out/g2-s1.out`, `raw/out/g2-s2.out`, `raw/out/check.out`; scripts `raw/scripts/g2.ts`, `nps.ts`, `check.ts`, `session.sh` (host paths redacted).

## Arms (scratch copies from `git archive`, deleted afterwards)
- **B:** `main` `54dee3f2`, `src/` `4d6b117b` (`main` `af214979` has the same `src/`). **C:** the same tree, dir 2. Entry `evaluateAtPhase`.
- **H:** `grugops/ABC-274` `2baeb905` (code `7daae342`, `src/` `4cb84035`), `evaluateAtPhase`, the function `search.ts` (leaf, futility) and `quiescence.ts` (stand pat) call. Read on the repair head, so A5 does not lean on the carry-over condition.
- **P (report):** `src/` tree `58fa3eb4` (pre-E1 `main`), `evaluate`.
- Pre-check (`check.ts`, untimed): B, C and H `Object.is` on the six roots; phases 24, 24, 4, 24, 24, 24.

## Readings (ns per call; each arm's mean over rounds 2–6 of its six-root mean)
| session | order | window (`date -u`) | load1 start → end | B | C | P | H | c_s | H / P | **r_s** |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | B, C, P, H | 14:05:34Z–14:05:43Z (nps to 14:06:00Z) | 0.83 → 0.92 (1.16 after nps) | 310.95 | 310.40 | 305.23 | 304.62 | 0.9982 | 0.9980 | **0.9797** |
| 2 | H, P, C, B | 14:06:13Z–14:06:22Z (nps to 14:06:39Z) | 0.90 → 0.91 (1.07 after nps) | 308.98 | 309.00 | 304.94 | 308.90 | 1.0001 | 1.0130 | **0.9997** |

- `node` v26.12.1 both sessions; sink `% 7` = 0 both.
- **R = 0.9897 (0.9896932361). MET iff ≤ 1.0500: MET.** No void, no re-run, no extra session, nothing dropped.
- **Spread, as pre-stated (report):** |r₁ − r₂| = 0.0201 against the reference 0.037. Per-round min–max over rounds 2–6: session 1 B 309.3–314.8, C 309.2–312.3, P 303.9–306.2, H 303.5–306.8; session 2 H 303.5–319.1 (round 3, H first in a forward round), P 303.3–308.5, C 306.6–312.0, B 307.5–309.8. |R − 1.0500| = 0.0603 > 0.037: the label does not apply. None of this grades.
- Reading: the packed build is no slower per call than the pre-ticket head (about 1–2 % faster on these roots), and about level with pre-E1 `main` (H / P mean 1.0055). The ADR's forecast ("near 1.00 ×") is borne out; the seam's ~9 typed-array reads per call cost nothing visible here.

## S2 nps report (not graded; `…690d3b30`)
`chooseMove` to depth 8 on a frozen clock, 3 rounds alternating, round 1 dropped, right after each session in the same lock hold. Nodes exact every round: H and B 1 296 788 / 404 930 (B0's), P 1 306 981 / 391 451 (pre-E1, the door's counts).

| window | board | H ns/node | B | P | H / B | H / P | B / P |
|---|---|---|---|---|---|---|---|
| 1 | kiwipete | 1081.2 | 1079.4 | 1069.9 | 1.0016 | 1.0105 | 1.0089 |
| 1 | position-6 | 1169.0 | 1172.4 | 1143.3 | 0.9971 | 1.0225 | 1.0255 |
| 2 | kiwipete | 1081.5 | 1105.6 | 1061.8 | 0.9782 | 1.0186 | 1.0412 |
| 2 | position-6 | 1161.3 | 1188.7 | 1139.7 | 0.9770 | 1.0190 | 1.0430 |

- At 4 000 ms, nodes / ms from A6's own runs are in the A6 note. The ≈ 1 h formal S2 protocol was not taken (the ticket asks only that "the nps figure is reported").

## Outcome (as written in the PREREG)
MET: QE read A6, then the independent re-checks, then the verdict.
