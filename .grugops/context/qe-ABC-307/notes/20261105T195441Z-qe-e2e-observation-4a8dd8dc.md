---
id: 20261105T195441Z-qe-e2e-observation-4a8dd8dc
kind: observation
by: qe-e2e
at: 2026-11-05T19:54:41Z
verified_by: 
confidence: high for the flags, as run; the read is void and carries no figure
refs:
  - qe-ABC-307
  - ABC-307
  - EPIC-011
  - ABC-154
  - AR-154-TWO-POINT-CONTROL
  - ADR-0046
  - ADR-0035
  - NFR-008
  - R-N8H-1
  - R-CEN-1
  - T-QEHOP-GROWTH
  - R-307-b
  - R-307-c
  - se-ABC-307/20261105T141420Z-software-engineer-decision-49e3755f
  - se-ABC-307/20261105T141420Z-software-engineer-observation-dba5335f
  - se-ABC-307/20261105T141420Z-software-engineer-observation-045800a8
  - arch-ABC-307-reads/20261105T134134Z-architect-design-decision-727e0d0c
  - arch-ABC-307-reads/20261105T134134Z-architect-design-observation-f8c13d49
  - arch-ABC-307-reads/20261105T130959Z-architect-design-decision-5c65a408
  - orch-2026-10-30a/20261105T134300Z-orchestrator-decision-db111535
  - orch-2026-10-30a/20261105T135350Z-orchestrator-decision-ad217a34
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/book.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - grugops/ABC-307
  - grugops/qe-ABC-307
  - e01d39b1
  - 797bb1a5
  - 47556083
  - qe-ABC-307-a9
  - qe-ABC-307/20261105T142445Z-qe-e2e-decision-e4ce81fb
  - qe-ABC-307/20261105T152140Z-qe-e2e-observation-46d3b23c
  - qe-ABC-307/20261105T152735Z-qe-e2e-observation-43927eb6
  - orch-2026-10-30a/20261105T152827Z-orchestrator-decision-b17275dd
  - orch-2026-10-30a/20261105T191803Z-orchestrator-decision-5571c5a1
supersedes: 
seal: sha256:b7db1d2de87215da60424aa177b44b93a0d25a3a4132c0defe7ccb0cbebbd4ed
---

# qe-ABC-307 A9, read 3: VOID on foreign load. Seven of the 8 scored rounds are flagged, so no figure from it stands. The one re-read follows on what is left of the clock

QE/E2E, task `qe-ABC-307`, under PREREG `…da060cef`, whose void rule is `…b9038a14`'s. Raw: `raw/n8-r3/`.

**The slot.** Clock from the PREREG's commit, 19:21:24Z. 28 tries released on foreign vitest, 19:21:28Z to 19:48:35Z. Five clear samples at 19:49:50Z, 28 minutes 26 seconds in.

**The hold.** 19:49:50Z to 19:54:10Z, 260 s. 9 rounds, 8 complete scored rounds, all 27 runs exit 0 at 71 files and 2 709 passed, no output file empty (81 of 81).

**What the flags show (`flags.py`):**
- 86 samples, 232 sample rows naming a foreign vitest, one project by working directory (`grugops`), first seen at 2026-11-05T19:51:15Z.
- **Flagged rounds 2 to 8: 7 of the 8.** Only round 1 is unflagged. Round 2 is H alone, its run ending as the foreign vitest began. Rounds 3 to 8 are all three arms.
- A new foreign run, not the one `…5571c5a1` named: that one ended before the slot, and this one started in the hold, under a 2 700 s timeout. It can run to about 20:36Z.

**Reading.** More than 2 of 8 is not ALONE, so the read is **VOID**. It is a void, not a miss. `n8-grade.py` was not run, so there is no state line, H − B or twin to cite, and the walls in `a8.tsv` are not a figure. `a9-sens.py` was not run either: with one unflagged round it has nothing to say.

The gate cleared and the load arrived 75 seconds or so later, as on read 1. The clear check cannot guard a hold (`…9e878ba6`).

**Next:** the one re-read, same harness and arms, `<scratch>/qe307/out/n8-r4`, on what is left of the same clock, to 20:01:24Z. If no slot opens by then, the hop stops with this void standing and the re-read unspent. Foreign load was recorded and not touched.
