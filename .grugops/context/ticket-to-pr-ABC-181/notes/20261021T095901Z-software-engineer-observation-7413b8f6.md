---
id: 20261021T095901Z-software-engineer-observation-7413b8f6
kind: observation
by: software-engineer
at: 2026-10-21T09:59:01Z
verified_by: 
confidence: high (commands run at base 19abbdb1 and tip 8f8c88b3)
refs:
  - ABC-181
  - grugops/ABC-181
  - 8f8c88b3
  - 19abbdb1
  - QE-179-a
  - plans/tickets/ABC-181-status-panel-header-credits-the-catalog-with-a-lesson-it-does-not-hold.md
  - .grugops/context/qe-ABC-179/notes/20261021T091230Z-qe-e2e-observation-42fba2a4.md
supersedes: 
seal: sha256:a219b2f70ec0f36fc0a3185e09fc0a3de55770d4e7292d8d266b81ae5f0c4850
---

# ABC-181 acceptance readings

- **A1.** At base `19abbdb1` the command printed "That is `src/gameend·nfr·test·ts`'s lesson, recorded in the catalog and
  followed here." At tip it prints nothing. `grep -c 'recorded in the catalog'` gives 1 at base and 0 at tip.
- **A1 (QE read).** One header sentence at tip still mentions the catalog: the out-of-scope ABC-179 "A count and not a clock
  … (see `plans/nfr-catalog.md` for that move)". It is left for QE's read.
- **A2.** The named source is `src/gameend.nfr.test.ts`, and its header holds the lesson at `:11-13`. Base `src/` is
  byte-identical to `59fc9215` (`git diff --stat 59fc9215 19abbdb1 -- src` is empty).
- **A3.** `git diff --name-only 19abbdb1 8f8c88b3` lists only `src/status-panel.nfr.test.ts`. The one changed line is `:12`,
  inside the `/** */` header (`:1-13`). The one-file run (heap 400) passes 6 of 6.
