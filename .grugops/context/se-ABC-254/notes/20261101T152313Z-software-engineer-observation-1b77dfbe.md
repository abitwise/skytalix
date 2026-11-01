---
id: 20261101T152313Z-software-engineer-observation-1b77dfbe
kind: observation
by: software-engineer
at: 2026-11-01T15:23:13Z
verified_by: 
confidence: low: indicative only, not ALONE (foreign node at 100-216% CPU), Tctl median 82 with 7/40 above 85; QE grades A4
refs:
  - se-ABC-254
  - ABC-254
  - EPIC-010
  - ADR-0003
  - ADR-0055
  - ADR-0020
  - NFR-005
  - NFR-009
  - NFR-008
  - NFR-001
  - grugops/ABC-254
  - 600d8de3
  - 09d1f675
  - src/legal.ts
  - src/legal.test.ts
  - src/gameend.nfr.test.ts
supersedes: 
seal: sha256:f99d3346b68deb9a29a0d82e00a26bebffbb8ffac2ee035977d7253af49ba740
---

# ABC-254 indicative nps (SE, informal, NOT the A4 grade; QE owns the graded reading)

- **Method:** `chooseMove` at 4 000 ms. Base and head were run alternately, each in a fresh process, 5 runs per board. Base is `git archive 09d1f675 src`; head is 600d8de3. The whole read ran under `host-test.lock`, from 15:19:09Z to 15:21:54Z.
- **Medians (nodes per second):**

| board | base | head | head / base | depth | load1 |
|---|---:|---:|---:|---:|---|
| kiwipete | 734 980 | 814 523 | **1.108×** | 8 every run | 1.89–2.53 |
| position-6 | 763 847 | 859 847 | **1.126×** | 10 | 2.71–3.10 |
| start | 588 805 | 648 453 | **1.101×** | 11 | 2.58–2.78 |
| position-4 (in-check guard) | 877 963 | 980 363 | **1.117×** | 11 | 2.54–2.91 |

- **Move and score:** identical between base and head on every run of every board (20-80 −59, 34-67 73, 1-34 9, 50-66 −482).
- **Validity caveats:**
  - The read was NOT alone. Foreign `node` processes ran at 100–216 % CPU during parts of it; they were not ours, since one other project's vitest was seen just before the read.
  - Tctl ranged 78.2–93.6 °C, with a median of 82 °C (below the 85 °C stop) and 7 of 40 samples above 85.
  - So the margins over the 1.10 bar are thin and noisy. On this reading the bar shape would hold (≥ 1.10 on all three boards, ≥ 0.97 in check), but that is indicative only, not a pass.
- **Raw files:** `raw/nps.jsonl`, `raw/nps-medians.txt`, `raw/nps.mjs`, `raw/nps.sh`.
