---
id: 20261027T041209Z-architect-design-observation-8e6a40c2
kind: observation
by: architect-design
at: 2026-10-27T04:12:09Z
verified_by: 
confidence: high: deterministic counts on scratch clones of f0c50046; base reproduces ADR-0050 head counts and the qe-ABC-209 pre-check exactly; no real-clock reading
refs:
  - ABC-210
  - EPIC-008
  - ADR-0051
  - ADR-0050
  - ADR-0026
  - ADR-0025
  - ADR-0024
  - ADR-0034
  - NFR-005
  - NFR-004
  - G1
  - G6
  - A1
  - A2
  - A3
  - plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
  - memory-bank/50-decisions/ADR-0051-a-check-extension-arrives-at-the-horizon-once-per-line-behind-a-test-only-off-door-pair.md
  - orch-2026-10-27d/20261027T033728Z-orchestrator-decision-828d5794
  - bapm-ready-ABC-210/20261027T033612Z-ba-pm-decision-133465f3
  - bapm-ready-ABC-210/20261027T033612Z-ba-pm-observation-3bbfaa07
  - arch-design-ABC-208/20261026T023232Z-architect-design-decision-012b1053
  - qe-ABC-208/20261026T122350Z-qe-e2e-observation-3d6a4c99
  - qe-ABC-209/20261027T032028Z-qe-e2e-observation-7c874c4e
  - grugops/arch-design-ABC-210
  - f0c50046
  - b5c67ab7
supersedes: 
seal: sha256:f9f8e0e1464692ba486a6b101fe0878cac01b038fdf1e34d59098ec02c863f1e
---

# Architect/Design: ABC-210 design probes. Both forms and five placements/caps, five planted mutants, frozen-clock d6–d10, A3 d6 nodes, d5 drift, the same-depth mate floor, A2 rows and instrument, G1, and the moved-pin lanes on scratch clones. No real-clock timing

Task `arch-design-ABC-210`, records only. Trees are `git clone`s of `main` `f0c50046` in `<scratchpad>/arch210/trees/`:
`base`; `h` (both forms behind probe-only env switches: cap, placement node / horizon / interior / PV, quiet checks in
quiescence); `hd` (the design hardcoded, no switches); `m-everywhere`, `m-nocap`, `m-two`, `m-never`, `m-notcheck`.
`probe/patch.py` and `probe/patch-final.py` wrote them, never into a worktree. Plain node v26.11.1. Scripts (not
committed): `nodes.mts`, `a1.mts`, `drift.mts`, `a2.mts`, `a2-instrument.test.ts`, `zz5.mts`, `rep.mts`, `cost.mts`,
`deep.sh`.

## Doors (A1 premise)
- `hd`'s `searchWithoutCheckExtension` / `chooseMoveWithoutCheckExtension` against base's `search()` / `chooseMove`,
  and every older `hd` door against base's same door: **300/300 cells node-, score- and move-equal** (six roots; 10
  search doors at d1–6; 4 engine doors at maxDepth 3/5/6). Shipped `search()` and `chooseMove` differ from base at d6
  on 6/6 roots.

## Frozen-clock nodes to complete depth k (`chooseMove`, `now: () => 0`, `maxDepth: k`)
| tree | kiwipete d6 / d7 / d8 / d9 | position-6 d6 / d7 / d8 / d9 |
|---|---|---|
| base | 309 541 / 590 489 / 1 259 463 / 2 907 475 | 52 265 / 180 941 / 355 565 / 940 109 (d10 1 765 861) |
| horizon cap 1 (= `hd`) | 324 937 / 610 577 / 1 302 377 / 2 830 006 | 52 341 / 181 191 / 358 872 / 993 871 |
| horizon cap 2 / 3 / none | 324 949 / 610 670 / 1 302 537 / 2 830 393–409 | 52 341 / 181 191 / 358 904–905 / 994 558–565 |
| every node cap 1 | 343 711 / 641 891 / 1 369 820 / 3 256 498 | 58 478 / 212 224 / 418 255 / 1 202 218 |
| every node cap 2 | 347 823 / 650 706 / 1 417 410 / 3 411 706 | 60 716 / 218 441 / 435 820 / 1 394 623 |
| every node cap 3 | 348 371 / 682 613 / 1 445 210 / 3 439 983 | 60 962 / 219 574 / 438 166 / 1 423 214 |
| every node cap 4 | 348 427 / 683 191 / 1 448 660 / 3 457 102 | 60 994 / 219 620 / 438 489 / 1 432 113 |
| every node cap 8 / none | 348 436 / 683 366 / 1 449 937–940 / 3 469 976–3 470 023 | 60 995 / 219 621 / 438 514 / 1 435 732 |
| interior only, cap 1 | 333 528 / 628 662 / 1 358 328 / 3 221 230 | 57 974 / 210 698 / 411 273 / 1 089 255 |
| PV nodes only, cap 1 | 311 101 / 592 660 / 1 263 017 / 2 922 645 | 52 244 / 183 457 / 363 574 / 956 075 |
| (b) quiet checks, first q-ply | 317 174 / 605 140 / 1 327 228 / 3 083 740 | 55 111 / 190 443 / 376 904 / 990 916 |
| every node cap 1 + (b) | 352 387 / 668 793 / 1 455 496 / 3 459 129 | 61 878 / 225 890 / 441 504 / 1 312 668 |
| m-two / m-notcheck | 366 326 / 718 689 / 1 476 533 · 329 372 / 941 062 / 2 287 629 | 64 546 / 221 263 / 431 269 · 73 249 / 421 877 / 650 030 |
- Base equals `ADR-0050`'s head counts. (b)'s quiet-check move generations: kiwipete 12 782 / 24 090 / 61 452 /
  175 830, position-6 3 240 / 10 039 / 20 718 / 57 087 (d6–d9).
- Design cost proxy (`hdc`, a counter copy): kiwipete to d8, 190 336 added `isInCheck` calls (14.6 % of nodes), 10 748
  extended (0.83 %); position-6 to d9, 184 390 (18.6 %), 9 686 (0.97 %).
- Extensions in `search(…, 6)`: every node cap 1 kiwipete 2 445 (2 228 at the horizon), position-6 1 583 (1 264);
  horizon 2 314 / 1 349; PV only 5 / 22.

## Fixed depth 6, `search(…, 6).nodes` (A3)
base 237 007 / 109 912; horizon 249 811 / 110 654; every node cap 1 271 653 / 185 584; no cap 278 039 / 192 190;
interior 262 136 / 185 383; PV 245 336 / 141 047; (b) 244 286 / 121 453; m-two 284 084 / 158 546; m-notcheck 554 847 /
487 913.

## Drift (ABC-121's 190, d5) and the mate floor (the 287, d5 → d5)
| tree | search() vs door | chooseMove vs door | mate floor |
|---|---|---|---|
| `hd` | 93.58 %, max 116 (position-4/f1f2 708 → 824), 34 changed | 94.12 %, max 116, 33 changed | 0 of 189 |
| m-nocap | 93.58 %, 116 | 94.12 %, 116 | — |
| m-two | 91.98 %, 116 | 92.51 %, 116 | 0 of 189 |
| m-everywhere | 87.17 %, 145 | 88.24 %, 145 | 0 of 189 (7 newly mate) |
| m-notcheck | 56.68 %, 145 | 49.73 %, 145 | 0 of 189 (23 newly mate) |
- 0 mate-status flips on the 190 for every tree.

## A2 (depth 1; shipped plays the check, the door does not)
knight fork K+R Nc7+ (door Nd6), knight fork K+Q Nf6+ (Kh1), bishop skewer Bb5+ (Bd3), rook skewer Rh1+ (Rb7), Black
knight fork Nc2+ (Nc6); at d2–d3 both agree. A queen fork K+R row bit nothing and is not taken. Instrument
(`a2-instrument.test.ts`, call-through spies on `apply.ts` and `quiescence.ts`, heap 400): `hd` green on all 10 rows (two runs); m-two red
(ply 3 at d1, 7 at d5); m-never red (1, 5); m-nocap red only on the cap row (ply 3); m-everywhere green; m-notcheck out
of memory.

## G1 (`PUZZLE_DEEP=1`, virtual clock)
base 54/58; `hd` 54/58, no NEWLY line; m-everywhere 53/58 (NEWLY-MISSED seed 1163); (b) 53/58 (NEWLY-MISSED 1632, 1163,
5180, 5527; NEWLY-SOLVED 24, 234, 288).

## The moved pins under every form
- `transposition.test.ts` `REPEATS_AT_PLY_4` d2 / d3 / d4: base −502 / −485 / 0; horizon −502 / 0 / 0; every node −485
  / 0 / 0; interior −485 / 0 / 0; PV −502 / 0 / 0; (b) −392 / −511 / 0; every node cap 8: 0 / 0 / 0.
- `zugzwang.005` (`chooseMove`, frozen, d9–d13): base Ne2 Ne2 Ne2 **Nxd5** Nxd5; horizon Ne2 ×4, Nxd5 at 13
  (8 250 117 nodes); every node Ne2 ×4, Nxd5 at 13; PV Ne2 ×3, Nxd5 at 12; (b) Ne2 through 13. Door = base.

## Lanes (main's tests)
- Default (heap 128): base 2 128 / 2 128; `hd` 2 123 (the two export lists, the two `QE-208-c` door maps, P1). With
  `extensions` after `afterNull` (first draft), the two `ABC-208` source rows also red; placed before it, they pass.
- Deep, one file per run (heap 400), real-clock names filtered: base all green. `hd` adds the `ABC-208` d5 drift ×2
  (94.12 % against 95 %) and P2.

## Not run
Any real-clock search, `G2`, `G5`, `G6`, `G8`, `G9`, `G11`, D, `LADDER_DEEP`, `UCI_DEEP`, `CLI_DEEP`, and the
real-clock rows named above.
