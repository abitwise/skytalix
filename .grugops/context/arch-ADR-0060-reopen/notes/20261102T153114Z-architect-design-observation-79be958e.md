---
id: 20261102T153114Z-architect-design-observation-79be958e
kind: observation
by: architect-design
at: 2026-11-02T15:31:14Z
verified_by: 
confidence: high (deterministic fixed-depth and maxNodes runs on a scratch copy of main's src; the door and decision 1 reproduce arch-phase2-rebase's counts to the node)
refs:
  - arch-ADR-0060-reopen
  - grugops/arch-ADR-0060-reopen
  - EPIC-011
  - P1
  - P3
  - ADR-0060
  - ADR-0050
  - ADR-0026
  - ADR-0056
  - ABC-121
  - ABC-264
  - ABC-233
  - 0b73f51d
  - 5ffbae25
  - cfff6993
  - 0df9b672
  - arch-ADR-0060-reopen/20261102T152416Z-architect-design-decision-0481036d
  - arch-phase2-rebase/20261102T151839Z-architect-design-decision-f9f440c9
  - arch-phase2-rebase/20261102T151839Z-architect-design-observation-d5870a7a
  - arch-phase2-p1/20261102T144713Z-architect-design-observation-35bd3967
  - NFR-005
  - NFR-008
supersedes: 
seal: sha256:efc55f38fdf0cc096516f4842d214234b7e4c6c60f842278c5458f4b3cdff6aa
---

# ADR-0060 re-open probe on main: none of the nine pre-registered forms meets every bar. Capping PV reductions at one ply clears A3 and A4 (a) but loses A4 (b) reach (+0.17 to +0.19 ply) and zugzwang.004; decision 1 keeps reach and zugzwang but misses the 27 cp cap and A4 (a)

## Instrument
- Scratch `git archive` of this branch's src (equal to main `5ffbae25` / `0b73f51d`), outside the repository, deleted
  after. `patch_reopen.py` = `arch-phase2-rebase`'s patch plus one PV-only cap knob; `arch-phase2-p1`'s `probe.ts`
  unchanged. The set and rule were sealed first (decision `…0481036d`, commit `0df9b672`).
- Instrument check, exact: door 1 116 785 / 1 602 457 (`search()` d8 kiwipete / position-6), 1 575 537 / 476 244
  (`chooseMove` to 8); R0 head 849 358 / 1 183 439 / 1 155 460 / 414 286, as `arch-phase2-rebase` read.
- Two batches, each `flock <host-test.lock> timeout 300`, every job `timeout 300`; node counts only, no timing.
  Raw: `raw/probe/` (README, patch, driver, forms, runners, 63 outputs).

## Stage A, every form (A4 (a) head / door at d8; A3 drift d5, both recursions, 187 non-mate rows)
| form | `search()` kiwi / pos-6 | `chooseMove` kiwi / pos-6 | drift `search()` | drift `chooseMove` | A4 (a) | A3 |
|---|---|---|---|---|---|---|
| R0 decision 1 | 0.7605 / 0.7385 | 0.7334 / **0.8699** | 99.47 %, **63** | 100 %, 18 | miss | miss (cap) |
| C1 no PV reduction | 0.9531 / **1.2795** | **0.8928** / **1.0882** | 97.33 %, **63** | 96.79 %, **63** | miss | miss (cap) |
| C2 PV ≤ 1, cap 2 | 0.8014 / **0.9127** | 0.7532 / **0.8664** | 100 %, 5 | 100 %, 2 | miss | met |
| C3 PV flat 1, cap 2 | 0.8002 / **0.9087** | 0.7375 / **0.8656** | 99.47 %, **30** | 100 %, 21 | miss | miss (cap) |
| C4 PV ≤ 1, cap 3 | 0.7635 / 0.8354 | 0.6568 / 0.8057 | 100 %, 5 | 100 %, 2 | met | met |
| C5 PV flat 1, cap 3 | 0.7624 / 0.8303 | 0.6453 / 0.8049 | 99.47 %, **30** | 100 %, 21 | met | miss (cap) |
| C6 PV ≤ 1, uncapped | 0.7222 / 0.8240 | 0.6289 / 0.7865 | 100 %, 5 | 100 %, 2 | met | met |
| C7 C4 + index ≥ 2 | 0.7632 / 0.8349 | 0.6568 / 0.8119 | 100 %, 10 | 100 %, 2 | met | met |
| C8 C4 + divisor 1.75 | 0.7609 / 0.8215 | 0.6364 / 0.7986 | 99.47 %, **30** | 100 %, 21 | met | miss (cap) |

- 0 sign flips and 0 mate-status flips in every form and recursion. Root moves at d8 unchanged on both boards.
- Maxima: R0 and C1 position-6/g5h6 or f3h4 (63); C3 / C5 / C8 startpos/h2h3 30 -> 0 (30); C2 / C4 / C6 startpos/b2b4
  (5) and position-3/b4e4 (2).
- C2, C4 and C6 read identically at depth 5: the child-depth clamp (r ≤ d - 2) never lets a cap of 3 bind at d5. The
  drift instrument cannot see a deeper cap.

## Stage B (C4-C8: every stage-A bar met, or only the 27 cp cap missed)
| form | A4 (b) reach at 47 000 (door 5.558) | mate floor | zugzwang | G1 | eligible |
|---|---|---|---|---|---|
| C4 | 5.726, **+0.168** (30 deeper, 2 shallower) | 0 / 163 | **6 / 7** (`zugzwang.004` g7f6 at 11) | 54 / 58, no NEWLY | no |
| C5 | 5.695, **+0.137** (24 / 1) | 0 / 163 | **6 / 7** (`.004`) | 54 / 58 | no |
| C6 | 5.732, **+0.174** (31 / 2) | 0 / 163 | **6 / 7** (`.004`) | 54 / 58 | no |
| C7 | 5.747, **+0.189** (32 / 2) | 0 / 163 | **5 / 7** (`.001` e1e6 at 9, `.004`) | 54 / 58 | no |
| C8 | 5.721, **+0.163** (29 / 1) | 0 / 163 | **6 / 7** (`.004`) | 54 / 58 | no |
| R0 (from `arch-phase2-rebase`, same instrument) | 5.811, +0.2526 | 0 / 163 | 7 / 7 | 54 / 58 | no (stage A) |

- C1, C2, C3: stage B not read (A4 (a) missed; they cannot be eligible), per the pre-registration.
- Reports (not bars): reach at 20 000 nodes (door 4.426): C4 +0.095, C5 +0.090, C6 +0.095, C7 +0.100, C8 +0.079 (R0
  +0.216). d8 `search()` / `chooseMove` on position-4, position-5, startpos: C4 0.860 / 0.724, 0.837 / 0.731,
  0.467 / 0.489; C6 0.858 / 0.717, 0.827 / 0.705, 0.467 / 0.489. Firing at d6 on the 190 (`search()`): C4 nodes 0.928×,
  C6 0.928×, C7 0.936× (R0 0.843×).
- `zugzwang.004` at depth 11: C4 plays g7f6 after 156 620 nodes (the door plays h3h4 after 587 282).

## What it shows
- **Eligible forms: none.** Every bar-count is two or more misses:
  - R0: the 27 cp cap and A4 (a) `chooseMove` position-6.
  - C4, C6: A4 (b) and `zugzwang.004`.
  - C7: A4 (b), `zugzwang.001` and `zugzwang.004`.
  - C5, C8: the cap, A4 (b) and `zugzwang.004`.
  - C1, C2, C3: A4 (a), plus the cap for C1 and C3.
- **No form misses only the 27 cp cap.** So a re-derived cap alone admits no form in the set.
- **On main, the reach comes with the PV two-ply reductions.** With PV capped at one ply, even uncapped non-PV
  reductions (C6) reach +0.174 against R0's +0.253. Deeper non-PV reductions buy node savings on the two A4 boards but
  little reach, and they lose `zugzwang.004`, as uncapped did on `4d1c0616`.

## Scope
Measurements only; nothing committed to src/. Scratch copy deleted.

## Risks
- Node ratios and reach are proxies; strength is C2′'s.
- The set is nine forms; a form outside it might pass. Searching further on the same boards is the fitting the
  pre-registration guards against; it is a new hop with a new premise.
