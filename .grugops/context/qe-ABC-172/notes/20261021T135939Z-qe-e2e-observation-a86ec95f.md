---
id: 20261021T135939Z-qe-e2e-observation-a86ec95f
kind: observation
by: qe-e2e
at: 2026-10-21T13:59:39Z
verified_by: 
confidence: high (repo searched by QE at a0dc4135; every hit read)
refs:
  - ABC-172
  - EPIC-007
  - grugops/ABC-172
  - grugops/qe-ABC-172
  - 2eaf1a1c
  - 0bddbb43
  - 3e617b26
  - a0dc4135
  - QE-172-a
  - QE-172-b
  - QE-172-c
  - ADR-0018
  - ADR-0044
  - Q14
supersedes: 
seal: sha256:3acbf4bd6f65428ba24ce051fabdff27a8d6a1e1760cfa252ffa8c05820cdac0
---

# ABC-172 QE verdict PASS_WITH_GAPS; gap register QE-172-a..c (all LOW/INFO, none blocks)

No name left behind: `git grep cli-chess` outside `.grugops/` (tracked), plus `grep -rIl` over untracked files (node_modules, .git excluded). Hits, each judged:
- `memory-bank/50-decisions/ADR-0018…:128,:131` (rejected-option table), `ADR-0044…:773` (Q13 text): Architect's records, excluded by A3, not rewritten. In scope? No.
- `plans/epics/EPIC-007…:144,:271`, `plans/nfr-catalog.md:1214`, `plans/tickets/ABC-028…:1838`, `ABC-029…:975` (old worktree dir names), `ABC-169…:187`, `ABC-172` page, `plans/tickets/history/ABC-019…:54`, `plans/traceability.md` rows: dated history/planning records, excluded. In scope? No.
- `.grugops/install.json:6` target and the worktree `.git` gitdir: the DIRECTORY `cli-chess-example`, Out of scope 1-2 (owner's step).
- `npm run chess`/`usage: npm run chess -- …` (src/cli.ts:93): the command, kept by Q14. Not a package-name hit.
- No live package-name hit remains. Variants `cli_chess`/`clichess`/`CLI Chess`: none.

Gaps:
- **QE-172-a (LOW)** the lock lacks `packages[""].license: "UNLICENSED"`, which package.json declares (ABC-169 drift, pre-existing at base). It was hand-removed against Scope 2's method to hold A2. The next `npm install` re-adds it. Land it separately (see the QE decision note).
- **QE-172-b (INFO)** A5 read literally at the notes tip `2eaf1a1c` lists 5 files (the 2 manifests + 3 SE context notes). It holds at the code commit `0bddbb43`, the ABC-185/187 pattern. The page's `<tip>` should be read as the code tip, or the page should say so.
- **QE-172-c (INFO)** ADR-0018's table (:128, :131) names `cli-chess` with no dated line, although the page says the decision records "each get a dated line". ADR-0044 D8/D13 carry their dated L2 lines. ADR-0018 is the Architect's record and outside A5's fence, so it is not this ticket's gap to fix.

Next gate: ABC-041 clause (a) fires on package.json/package-lock.json. The security short hop is owed (expected: no finding; no dependency added).
