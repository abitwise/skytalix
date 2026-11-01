---
id: 20261101T172747Z-qe-e2e-observation-8ebcead9
kind: observation
by: qe-e2e
at: 2026-11-01T17:27:47Z
verified_by: 
confidence: high: qe-ABC-249's harness (raw/qe-scripts/g8.mjs verbatim + host.mjs with the QE-259 edits) run under flock host-test.lock 17:18:48–17:26:19Z; head = worktree (src == e1c10e19), base = git archive 8f2fc9b5
refs:
  - qe-ABC-259
  - ABC-259
  - EPIC-010
  - ADR-0056
  - R-TC
  - G-1
  - grugops/ABC-259
  - grugops/qe-ABC-259
  - 8f2fc9b5
  - f40665b1
  - e1c10e19
  - 4dbfde26
  - src/levels.test.ts
  - NFR-008
  - G8
  - A9
  - QE-249-c
supersedes: 
seal: sha256:363b8aef3c2ac129cfbdff7bd4282d8583ae034988eb02e30c7377f9d4b457cf
---

# qe-ABC-259 G8 (informal, interleaved b h h b b h): H 9.15 s, B 9.10 s, admissible, ALONE all 6 runs

- **Walls:** base 9.10 / 9.06 / 9.56 s, median **9.10 s**. Head 9.10 / 9.15 / 9.52 s, median **9.15 s**. H − B is +0.04 s, inside run-to-run noise (the base spread alone is 0.50 s).
- **CPU:** base median 29.92 s, head median 29.67 s.
- **Host:** load1 1.67–2.26 across all runs. Tctl median 59.1 °C, max 79.1 °C, no thermal stop. Every run rc 0.
- **Counts:** base 2 362, head 2 365 on every run.
- **Admissibility:** NFR-008's line (load1 ≤ 8, rc 0) held, and the ALONE precondition held before all 6 runs. The only wait was 290 s before run 1, for a foreign vitest from /home/olger/projects/public/grugops, inside the 15-minute cap. No SHARED flag. NFR-008 (≤ 10 s) is **MET**, with 0.85 s of headroom.
- **Per file:** src/levels.test.ts read 151 → 165 ms (+14 ms, per-file noise). The rows themselves cost under 1 ms.
- **Harness edits (QE-249-c closed for this hop):** `vitestPids` now drops processes whose comm is flock, bash, sh, npm or timeout, so another hop's flock waiter line no longer counts as a vitest. The wait budget is 15 minutes, per the brief.
- **Raw:** raw/g8/g8.log, g8-wait.log, g8-perfile.txt, a8-rows.txt, window.out.
