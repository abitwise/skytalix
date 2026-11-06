---
id: 20261106T134724Z-software-engineer-observation-eb34eea6
kind: observation
by: software-engineer
at: 2026-11-06T13:47:24Z
verified_by: 
confidence: high
refs:
  - se-ABC-303-main2
  - grugops/ABC-303
  - ABC-303
  - ABC-305
  - ABC-307
  - EPIC-011
  - ADR-0056
  - ADR-0072
  - ADR-0073
  - se-ABC-303-main/20261105T122839Z-software-engineer-observation-bd60978c
  - se-ABC-303-rows/20261105T125756Z-software-engineer-observation-1932d8a5
  - qe-ABC-305/20261106T132438Z-qe-e2e-observation-ab07f1f1
supersedes: 
seal: sha256:da0f3653441878b29ad90c206182d7682a01581a68edd1a534036856f0b5bbd0
---

# se-ABC-303-main2 artifact: `grugops/ABC-303`, `main` `38914841` in, gates and lanes green; not pushed, not merged

Recorded as an observation: the writer refuses an `artifact-ref` with no gate run (`se-ABC-303-main`'s note on this).

- Branch `grugops/ABC-303`, worktree `.claude/worktrees/se-ABC-303`.
- Merge `bb0cc134` (parents `80bc0711`, `38914841`); claim `0799da29`. No file under `src/` or `tools/` changed beyond what `main` brought: this hop wrote no code and no test.
- Files this hop wrote: `plans/traceability.md` (conflict; one trace row), `.grugops/queue/` moves, `.grugops/context/se-ABC-303-main2/`.
- Commands: `git merge`; `npm run typecheck`, `npm run lint`, `npm run build`, `npm test`; the skip capture as `AGENTS.md` spells it; six deep lanes (raw `gates.sh`); `raw/bounds-read.mjs` on the tip and on an export of `main`.
- Raw: `summary.txt`, `proof.txt`, `lanes.txt`, `counts.txt`, `bounds-tip.tsv`, `tune-rows.tsv`, `gates.sh`, `bounds-read.mjs`, `cmp.py`.
