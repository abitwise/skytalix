---
id: 20261030T013022Z-software-engineer-observation-ba9b4b1f
kind: observation
by: software-engineer
at: 2026-10-30T01:30:22Z
verified_by: 
confidence: medium (indicative; one host, load1 1.7-2.9, Tctl 75-81 C; QE reading decides A3)
refs:
  - ABC-240
  - EPIC-010
  - ABC-235
  - arch-ABC-235/20261029T205200Z-architect-design-decision-7fc1b90c
  - arch-ABC-235/20261029T205200Z-architect-design-decision-eebca902
  - bapm-ABC-235-split
  - grugops/ABC-240
  - 0e0ef856
  - 69e19fc4
  - 7913499d
  - ABC-227
  - NFR-005
  - .grugops/context/se-ABC-240/raw/
supersedes: 
seal: sha256:3290bcf38b4d55b7a9621640f1bde329ffb77fca39262709f76b8296caf95a3d
---

# Software Engineer observation, se-ABC-240: A3 nps at the tip, indicative only (QE's interleaved reading decides)

Method (ABC-227's, as in `se-ABC-235`): one fresh process per search, `chooseMove` at 3 000 ms on the real clock, `nps = nodes / elapsedMs`. One process at a time; builds interleaved (base, tip) 5 times per board. The base is `git archive 0e0ef856 src` and the tip `git archive 7913499d src`. Driver: `se-ABC-240/raw/nps240.sh` with ABC-235's `nps.mjs`, summarised by `npsmed240.mjs`.

**The wait-clear.** Before the first run, the driver waited until `pgrep -x cutechess-cli` was empty AND `pgrep -f "[/]vitest"` was empty (bound 30 min; 0 s needed). It re-checked both before every run, and none appeared. load1 and Tctl (`sensors`, k10temp) were recorded per run. Host: Linux, 24 cores, Node v26.12.1. Read 2026-10-30 01:10:26Z to 01:12:00Z.

| board | base median | tip median | tip / base | completed depth, all 5 runs each |
|---|---|---|---|---|
| kiwipete | 770 766 | 861 189 | **1.117** | 8 = 8 |
| position-6 | 788 001 | 874 017 | **1.109** | 10 = 10 |
| start | 577 201 | 621 233 | **1.076** | 10 = 10 |

- load1 1.72–2.91. Tctl 74.8–81.0 °C during the runs (44.8 °C before the first). Tonight's thermal stop (orch `…6db452d1`) is why Tctl is recorded.
- In this reading, A3's bar (≥ 1.03x on two boards, ≥ 1.00x on the third) is met on all three. It is indicative only; QE's 5 interleaved runs at the tip decide.
- **Above the Architect's bound, flagged rather than explained.** The re-cut bound was 5.6–6.7 % inclusive for `orderMoves` plus 0.2–1.1 % for quiescence's sort, and the gains here are 7.6–11.7 %. Possible causes include allocation and GC pressure that the self-time profile does not attribute to `orderMoves`, and run-to-run noise on a warm host. Neither is measured here: `UNKNOWN - verify`. No per-item split was read; the ticket's A3 judges the tip as a whole.
- G6 (indicative): completed depth is equal in every pair. QE owes G6's 5 interleaved runs per its pre-registration.
