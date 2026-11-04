---
id: 20261104T233924Z-architect-design-observation-261ea757
kind: observation
by: architect-design
at: 2026-11-04T23:39:24Z
verified_by: 
confidence: high: read as run, one run, output checked non-empty
refs:
  - ABC-303
  - ABC-271
  - ABC-283
  - ADR-0070
  - ADR-0072
  - se-ABC-303/20261104T232552Z-software-engineer-observation-dd8e56d8
supersedes: 
seal: sha256:90cf0ba9ceefba7c101a6453e25efc4754a191ec59a435fcfeceec888ac2426b
---

# arch-ABC-303-open item 2, the run: `ABC-271` K0 is RED on `main`. `SEARCH_DEEP=1 src/evaluate.passer.test.ts` on `c118a5cf`: exit 1, 7 failed, 21 passed. Every printed count is `ABC-283`'s shipped head

The one deep run the brief allows. Tree: this worktree at `main` `c118a5cf`, `src/` tree `845f5662`, the same tree as `1bcdbf2d`, where the engineer read it. One core (`taskset -c 0`, `VITEST_MAX_WORKERS=1`), under the host lock, 6.52 s. Output non-empty, 12 251 bytes after the host path and colour codes were stripped: `raw/out/k0-main.txt`.

| row | frozen (`FROZEN.k0`) | read on `main` |
|---|---|---|
| `kiwipete_chooseMove_d8` | 766 275 | 707 548 |
| `kiwipete_chooseMove_d9` | 1 725 150 | 1 595 095 |
| `pos6_chooseMove_d8` | 87 475 | 101 425 |
| `pos6_chooseMove_d9` | 253 724 | 226 171 |
| `pos6_chooseMove_d10` | 533 916 | 471 434 |
| `kiwipete_search_d8` | 605 117 | 523 847 |
| `pos6_search_d8` | 406 787 | 234 214 |

The four d8 figures are `ADR-0072` d6's main figures, 707 548 / 101 425 and 523 847 / 234 214, the counts `ABC-283` shipped. The engineer's report is confirmed: 7 of 28 failed, on the base as on `grugops/ABC-303`.
