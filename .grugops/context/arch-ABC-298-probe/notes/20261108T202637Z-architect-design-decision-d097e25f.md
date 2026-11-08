---
id: 20261108T202637Z-architect-design-decision-d097e25f
kind: decision
by: architect-design
at: 2026-11-08T20:26:37Z
verified_by: 
confidence: high on the counts and the identity (exact, one run, checked against main's unpatched copy); the rule is d9's as sealed; d9's 0.6 bound is judgement and enters nothing
refs:
  - arch-ABC-298-probe
  - ABC-298
  - ADR-0077
  - ADR-0077 d9 step 3
  - arch-ABC-298-probe/20261108T202500Z-architect-design-decision-56ac06ee
  - da4f1c53
  - 090e17d1
  - bba42fb7
  - sha256:96760ffd8fb7436883c544bc9d9919fccc6aaa16a5d233bf54d23271f917c18c
supersedes: 
seal: sha256:f85925f65239ef8380d691fbbb36726fa55b9db41e45115fbdf41f377d71e582
---

# arch-ABC-298-probe RESULT: GO by the sealed rule. s = C ÷ G is 0.0754 on kiwipete, 0.0579 on position-6 and 0.0320 on start, below 0.048 on one board of three. Identity held on every board. One run, no re-run, no defect

Architect/Design, task `arch-ABC-298-probe`, on `grugops/arch-ABC-298-probe` from `main` `090e17d1` (`src/` tree `bba42fb7`). This is `ADR-0077` d9 step 3, read under the plan `…56ac06ee`, sealed and committed at `da4f1c53` before any measured run.

## What ran
- **Batch P, once,** under the host lock, on one core, one process at a time. Each board ran `main` (the unpatched copy), then `count` (the patched copy), as fresh processes.
- **`analyse.mjs`, once,** on the outputs.
- **Every script and copy matched its sealed sha256 just before the run.** All six processes exited 0. Outputs are in `raw/out/`: the six `P-*.out`, `analyse.out`, `exits.txt` and `holds.txt`.
- **No timing figure was taken or read.** `holds.txt` gives start and end UTC per batch, for lock use only.

## Identity first (`analyse.mjs`, before any count was printed)

| board | depth | nodes, `main` = `count` | score | move | position restored | X |
|---|---|---|---|---|---|---|
| kiwipete | 9 | 1 320 857 | −128 | e2a6 | yes / yes | 0, 0 |
| position-6 | 9 | 234 984 | 34 | c3d5 | yes / yes | 0, 0 |
| start | 9 | 64 849 | 17 | b1c3 | yes / yes | 0, 0 |

- The counted copy is value-identical to `main`'s on every board: the same nodes, depth, score and move.
- No hash move was out of first place (X[0] = 0). No cut at index 0 came from a move other than the hash move at a node that had one (X[1] = 0).
- No count fell at remaining 0 or at 63 and above, and G's sum is below the node count on every board. **No defect, so no addendum and no fix.**
- No row on `main` pins these depth-9 figures. `main`'s own unpatched copy, blob for blob `main:src`, is the reference, as the plan says.

## The counts (gate: remaining depth 1 or 2)

| board | G | H | C | s = C ÷ G | against 0.048 |
|---|---|---|---|---|---|
| kiwipete | 74 356 | 9 831 | 5 606 | 0.075394 | at or above |
| position-6 | 25 180 | 2 619 | 1 457 | 0.057863 | at or above |
| start | 14 458 | 1 306 | 462 | 0.031955 | **below** |

**The rule, as sealed (d9):** *"STOP if s < 0.048 on at least two of the three boards. … Otherwise GO, to step 4."* s is below 0.048 on **one** board (start). **GO.**

**What GO means, by d9:** only "it can pay". It says nothing about SG3's bar, and no figure here enters SG3. The freeze stays blind: no V3 code exists.
- **One overlap, stated plainly.** `main`'s kiwipete figure above was run in the same form as one of SG1 (a)'s rows (`chooseMove`, `maxDepth` 9, `now: () => 0`). It is `main`'s figure, read here only to check the instrument's identity. It does not stand in for QE's freeze. QE reads and freezes its own figures at step 4.

## INFO: G_r / H_r / C_r by remaining depth r (no part in the rule)

| r | kiwipete | position-6 | start |
|---|---|---|---|
| 1 | 50 094 / 999 / 471 | 17 119 / 204 / 88 | 10 444 / 234 / 111 |
| 2 | 13 175 / 8 832 / 5 135 | 4 318 / 2 415 / 1 369 | 2 075 / 1 072 / 351 |
| 3 | 6 354 / 5 409 / 3 691 | 2 008 / 1 380 / 902 | 975 / 756 / 560 |
| 4 | 2 872 / 2 498 / 1 657 | 979 / 678 / 441 | 496 / 325 / 98 |
| 5 | 1 337 / 1 189 / 861 | 427 / 344 / 204 | 365 / 238 / 175 |
| 6 | 393 / 356 / 300 | 217 / 179 / 138 | 59 / 55 / 22 |
| 7 | 89 / 83 / 40 | 77 / 75 / 39 | 34 / 33 / 20 |
| 8 | 42 / 37 / 36 | 35 / 33 / 31 | 10 / 9 / 7 |
| 9 and above | 0 | 0 | 0 |
| H, C all depths | 19 403 / 12 191 | 5 308 / 3 212 | 2 722 / 1 344 |

- **What the gate costs:** of all cuts by the hash move at index 0, the gate keeps 46 % on kiwipete, 45 % on position-6 and 34 % on start (C ÷ C all depths). This is § Context's narrowing, counted. It is not a reason to widen the gate: d12 and his question 2 rule that out.
- **Where it can cost (§ Where it costs):** H − C, gated nodes whose hash move did not cut off, is 4 225, 1 162 and 844. That is 5.7 %, 4.6 % and 5.8 % of G.
- **Remaining depth 1 rarely has a hash move** (H_1 ÷ G_1 about 2 %, 1.2 % and 2.2 %), as § Context foresaw: one iteration back, those nodes were leaves. Nearly all of the gate's C is at remaining 2.
- **d9's bound, arithmetic only, judgement inside it:** 1 / (1 − 0.6 × s) is 1.047 on kiwipete, 1.036 on position-6 and 1.020 on start. It rests on d9's stated assumption, a 0.6 share that is above the only profile on record, with the check's cost taken as 0. It is a ceiling, not an estimate. **It enters nothing.** One reading of it, recorded for the build and not a bar: by that bound, start cannot reach 1.03, so SG3's two 1.03 boards would have to be kiwipete and position-6, and start would carry the ≥ 1.00 floor. SG3's bar and rule are unchanged (d7).

## Next, by d9
- **Step 4, `qe-ABC-298-freeze`,** on `main`'s tip, under the host lock. It is not a timing read. Then the Orchestrator's check (step 5), then the build (step 6).
- **One dated line in `ADR-0077` d9** records this outcome. No other `ADR-0077` text, no `src/`, ticket, EPIC or board edit. No held host was taken.
- **Lock used:** under 15 s in all. Batch P ran 20:25:17–20:25:24Z. The patch, the load-only smoke, the seal, the path check and the analysis took about 1 s each.
