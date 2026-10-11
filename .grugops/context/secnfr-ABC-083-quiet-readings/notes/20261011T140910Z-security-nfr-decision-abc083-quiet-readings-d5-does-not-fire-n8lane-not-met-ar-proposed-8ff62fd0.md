---
id: 20261011T140910Z-security-nfr-decision-abc083-quiet-readings-d5-does-not-fire-n8lane-not-met-ar-proposed-8ff62fd0
kind: decision
by: security-nfr
at: 2026-10-11T14:09:10Z
verified_by:
confidence: high
refs:
  - ABC-083
  - NFR-005
  - N8-LANE
  - NFR-008
  - AR-NFR005-082
  - ADR-0031
  - ADR-0039
  - ADR-0035
  - ADR-0014
  - .grugops/context/secnfr-ABC-083-quiet-readings/notes/20261011T140910Z-security-nfr-observation-abc083-a9-a7-quiet-depth-and-nodes7-1643be6c.md
  - .grugops/context/secnfr-ABC-083-quiet-readings/notes/20261011T140910Z-security-nfr-observation-abc083-n8lane-k3-narrow-set-split-4583f42c.md
  - .grugops/context/design-abc083-r-reds-2026-10-11/notes/20261011T083630Z-architect-design-decision-abc083-routes-puzzle-deep-qe-n8-lane-secnfr-072c2994.md
  - .grugops/context/design-low-batch-2026-10-11/notes/20261011T083621Z-architect-design-decision-n8lane-5pct-is-of-the-13s-level-650ms-is-fixed-5ad29a76.md
supersedes:
---

# `ABC-083` quiet readings: **`A9` is not a stop and `ADR-0031` decision 5 does NOT fire.** `A7` is MET. **`N8-LANE` is NOT MET (+1.005 s against 650 ms). There is no required fix, and two accepted risks are proposed to the owner**

This note is hand-authored and unsealed. It records a decision by Security/NFR on two readings. It is not a stamp, and it does not accept any risk: acceptance is the owner's word.

## 1. `A9` / `NFR-005` depth: no stop

Readings: `…1643be6c`. The rule was fixed before the first run (`preregistered.txt` item 3).

- **FAIL floor (depth < 6):** none in 24 runs. **MET.**
- **Depth 7 (the WARN level, which R2 keeps):** every GRADED branch run reached depth 7 on an uncontended machine. That is kiwipete 3/3 and position-6 3/3, at load1 1.90–2.34, thermal 0, foreign 0. The descriptive rounds read 3/3 and 3/3 as well.
- **`A7` (depth ≥ base, same machine):** MET on all 6 graded pairs and all 12 pairs in total (7 = 7).
- **Therefore `ADR-0031` decision 5 does not fire.** Mobility is not cut. `ADR-0039` decision 3 (the re-level in `547b5155`) is **not void**. The build's one depth-6 run on position-6 was in a load spike (load1 → 43.8). It is not a quiet-machine loss, and on a quiet machine it did not reproduce.
- **`AR-NFR005-082`'s trigger is discharged for this build.** Kiwipete reads 566 233 nodes to depth 7 (−7.2 %), and its margin is 1.126–1.130x (base 1.112–1.122x). The kiwipete risk the owner accepted is no larger here.

## 2. Proposed accepted risk `AR-NFR005-083` (LOW): the thin depth-7 margin moves to position-6

- **The facts:**
  - Position-6 needs 644 469 nodes to complete depth 7, against 462 871 on base (+39.2 %). The margin falls from 1.47x to **1.056–1.066x** at a quiet load.
  - A sustained slowdown of about 6 % loses depth 7 there. Contention, heat or a slower host can cause that. The depth-6 FAIL floor is not at risk: depth 6 needs 169 685 nodes, about 4x headroom.
- **Why it is not a stop:** `A9` asks for depth 7 on an uncontended machine, and that held. The page and `ADR-0031` decision 5 make a quiet-machine loss the trigger, not a thin margin.
- **Severity:** LOW. This is the same shape and the same level of harm as `AR-NFR005-082`, which the owner accepted: a WARN level held on a margin of about 1.05x.
- **Risk owner:** Olger Oeselg (the owner). He holds `NFR-005`'s levels and R2, and only he moves a level. **Proposed, not accepted.** His word is owed before merge.
- **Re-read trigger:** the next value-changing evaluator or search ticket, or any quiet-machine position-6 read at depth 6. Run the same two instruments: the real-clock depth read and clock-free nodes to depth 7.
- **`UNKNOWN - verify`:** whether `thermalpressurelevel` 1 alone costs more than 6 % of single-thread node rate on this M3.

## 3. `N8-LANE`: NOT MET. No required fix. Proposed accepted risk `AR-N8LANE-083` (LOW)

Readings: `…4583f42c`. Verdict by `ADR-0035` decision 1, at b = 650 ms CPU (fixed, `…5ad29a76`).

- **The reading is admissible:** the twin is +0.42 %, sign 4/8.
- **It resolves the bound:** R = 0.110 s ≤ 0.650 s.
- **The treatment median is +1.005 s > 0.650 s, and its lower end, +0.910 s, is also > 0.650 s. The state is NOT MET.** That is 1.55x the bar. It confirms the build's +1.083 s, now at k = 3 on the 17-file set.
- **No required fix.** The miss is real, but no fix within this ticket's scope buys it back:
  - The added test file costs about 0.15 s (H − X, descriptive), which is inside 650 ms. Trimming it cannot reach the bar.
  - About 0.8 s (X − B) is the costlier evaluator, paid by search tests that already existed. One example is `src/search.test.ts`, which the ticket does not touch. Removing that cost means one of three things:
    - cutting a term. `N8-LANE` is a rate limit (`ADR-0014` decision 4), not an `ADR-0031` trigger (Architect/Design `…072c2994`), so the cut would be the owner's scope word, not this gate's.
    - moving existing engine coverage to an opt-in lane. That is an unrelated refactor, and it weakens the default gate.
    - making `evaluate` cheaper. `A5` is already met at 775.8 ns.
  - None of these is warranted by a 355 ms overrun.
- **Precedents applied, not re-invented:** `AR-N8LANE-078` (1.29x, accepted, LOW) and `AR-N8LANE-079` (+3.6 s, the owner, *"3. accept"*).
- **`NFR-008`'s level is not threatened.** H's full `npm test` reads 7.38–7.64 s wall against R-1's W = 10 s, at load1 4.2–4.4. The trip-wire did not trip.
- **Proposed risk text:** *"`ABC-083` charges +1.005 s CPU on its 17-file narrow set at k = 3 (+0.910..+1.060, twin R 0.110 s) against `N8-LANE`'s 650 ms. About 0.8 s is the costlier `evaluate` (`A5` 775.8 ns) paid by existing search tests, and about 0.15 s is its own new file."*
  - **Severity:** LOW.
  - **Risk owner:** Architect/Design, as owner of `NFR-008`'s accounts.
  - **Accepted by:** the owner, Olger Oeselg. His word is owed.
  - **Discharge (proposed):** at `ABC-150`, the open lane-CPU P1 ticket (In Design; `ADR-0041` is proposed), or at the next hop that re-levels lane CPU. There this charge is one input among many.
- **If the owner declines:** the route is his scope word. Either king safety ships alone, with the charge re-read on that build as `…072c2994` says, or engine coverage moves to an opt-in lane through its own ticket. This gate does not choose between them.

## 4. Security

**Not triggered**, as the page says. The change has no input surface, no I/O, no spawn and no dependency change. Nothing in this hop changes that.

## Result of this hop

**`A7`/`A9`: MET. `N8-LANE`: NOT MET. No required fix. The overall reading is PASS_WITH_RISKS, conditional on the owner accepting `AR-N8LANE-083` and `AR-NFR005-083`.**

The ticket stays `Blocked` until that word is given and QE classes `PUZZLE_DEEP` seed 5061 (not this hop). There was no board move, and nothing was merged or pushed.
