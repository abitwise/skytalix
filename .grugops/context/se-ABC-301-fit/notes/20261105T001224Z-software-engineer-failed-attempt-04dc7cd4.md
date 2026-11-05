---
id: 20261105T001224Z-software-engineer-failed-attempt-04dc7cd4
kind: failed-attempt
by: software-engineer
at: 2026-11-05T00:12:24Z
verified_by: 
confidence: high on the row, the depth table and the defect check, all run; the cause is UNKNOWN - verify
refs:
  - se-ABC-301-fit
  - se-ABC-301-fit-2
  - ABC-301
  - EPIC-011
  - ADR-0067
  - ADR-0070
  - B-T5
  - F4
  - zugzwang.001
  - grugops/ABC-301
  - dd88560f
  - src/search.null-move.test.ts
supersedes: 
seal: sha256:daaec329da21716b2a6b0136f9e8373956c285c03a8dfdb7c5a2545f28342f0c
---

# se-ABC-301-fit STOP: zugzwang.001 plays e1e5 at depth 9 on the one fit's emission, as the first pull did. The defect check is clean. No refit, no re-pin, no scope 4

The row: src/search.null-move.test.ts, "zugzwang.001: chooseMove on a frozen clock to depth 9 plays e1f1". On dd88560f it reads e1e5. The brief's line: if zugzwang.001 or any safety row is red, STOP and report; no re-fit to chase it.

**Defect check (F4's first step), both clean.** The identity gate on the emitted file: 0 misses of 1 532 990. B-T3: byte-identical. tableOf(emission) equals fit.json. So nothing here points at the tool, the tracer or the emitter, and I have no ground to call this a defect. Read as written, ticket and ADR make that a real miss and F4 NOT MET. **The disposition is not mine;** I stopped at the row.

**The row by depth** (chooseMove, frozen clock, one read each; raw/zugzwang001-by-depth.jsonl.txt, squares as 0x88 indexes):

| depth | candidate | score | nodes | base | score | nodes |
|---|---|---|---|---|---|---|
| 8 | e1e5 | -435 | 28 201 | e1e5 | -408 | 35 792 |
| 9 | **e1e5** | -434 | 70 212 | e1f1 | -392 | 62 290 |
| 10 | e1f1 | -396 | 154 687 | e1f1 | -394 | 101 108 |
| 11 | e1f1 | -317 | 240 958 | e1f1 | -346 | 168 560 |
| 12 | e1f1 | -318 | 447 918 | e1f1 | -348 | 325 770 |
| 13 | e1f1 | -278 | 943 782 | e1f1 | -268 | 603 053 |

The candidate is one ply later than the base; the first pull was three plies later (e1f1 at 12). That is context for the Architect, not a case for a deeper row: B-T5 fixes depth 9 and no bar moves. Why E4a's values narrow the gap and do not close it is **UNKNOWN - verify**: I ran no attribution, since none of it may feed a refit.

**State left.** grugops/ABC-301 carries the emission at dd88560f, with 115 default-lane reds because scope 4 was not taken. The last green tree is b297ab89. No pin moved and no row retired, so K0's seven rows, the two "every half 0" rows and FROZEN.k0 stand as they are. Not read: G2, the endgame G2, mate floor, G1, the futility audit, B-T6 to B-T8.

**Asked:** the F4 disposition from whoever holds it. ADR-0070 F5 and ADR-0067 F6 say a NOT MET read means not merged and nothing is re-fitted on play; the structure stays on main, value-identical.
