---
id: 20261021T102744Z-software-engineer-observation-b56b418c
kind: observation
by: software-engineer
at: 2026-10-21T10:27:44Z
verified_by: 
confidence: high
refs:
  - ABC-161
  - QE-101-a
  - QE-101-b
  - SEC-101-a
  - ABC-174
  - ADR-0045
  - be6a5599
  - f6b63c1c
  - 69610c5b
  - src/cli.test.ts
  - 20261017T125103Z-ba-pm-observation-cut-followups-readings-85e8dfdd
  - 20261012T211800Z-qe-e2e-observation-abc101-plants-and-abc065-a3-value-check-9b0ef449
supersedes: 20261021T102706Z-software-engineer-observation-1ef80c09
seal: sha256:8480f63f3d3a73798745aea982ae2f46f236e634d4b6a16d5574e0c3f0a2224a
---

# ABC-161 base readings at main 69610c5b: P11 is already RED on base and P9d is GREEN on base, both opposite to the page (supersedes `…1ef80c09`, whose row line numbers were wrong)

**Method.** `git archive 69610c5b` extracted into the session scratchpad (outside the repository), `node_modules` symlinked, private `TMPDIR`. One fresh copy per plant; each plant is an exact-string edit asserted to occur once. Lane: the whole default `NODE_OPTIONS=--max-old-space-size=128 npx vitest run` (multi-file, so 128 per the heap rule), JSON reporter. One run at a time. No timing read. Each copy removed after its run; 0 copies left, `git status --porcelain` empty in `wt-ABC-161`.

The three rows at this base, found by name in `src/cli.test.ts`: `ABC-065` `A3` value check at `:2284` (the `toContain(value)` loop at `:2312-2314`); `ABC-101` `A3` refused values at `:4049` (`refusedValues` at `:4056`); `ABC-101` `A8′` equivalence at `:4116` (`call < 2` at `:4129`).

| plant | base result (59 files / 1987 tests) | page expects |
|---|---|---|
| unplanted | 1987/1987 green, 0 skipped | — |
| P11 createLevel per call | **1 failed**: `A8′` equivalence, "level 4, call 1" | green |
| S2c `/^[1-5]$/m` | 1987/1987 green | green |
| P9a `--difficulty 1\|2\|3\|4` | 1987/1987 green | green |
| P9b `1\|2\|3\|4\|9` | 1987/1987 green | green |
| P9c `1\|3\|4\|5` | 1987/1987 green | green |
| P9d `1\|2\|3\|5` | **1987/1987 green** | red |
| P9e `--colour white\|random` | 1987/1987 green | green |

**Why P11 reds now.** `ABC-174` (`be6a5599`, ADR-0045) re-cut `LEVELS`: level 4 is now `blunderRate: 0.05`. At seed 7 the first two draws are 0.0117 and 0.0620 (QE's reading), so level 4 decides blunder then engine. A rebuilt generator draws 0.0117 again and blunders twice, so call 1 differs. Levels 1-3 (0.4/0.2/0.1) still decide the same twice; the existing row discriminates P11 through level 4 only.

**Why P9d is green now.** `f6b63c1c` added "ADR-0045" to the slot. The slot now holds `4` outside the `--difficulty` list (in "ADR-0045"), so `toContain("4")` holds without the list. Every digit 1-5 occurs at least twice in the slot: no level word is load-bearing. QE-101-b is wider than recorded (5 of 5 plants blind, not 4 of 5).
