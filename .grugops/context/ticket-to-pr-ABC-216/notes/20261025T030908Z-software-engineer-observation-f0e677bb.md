---
id: 20261025T030908Z-software-engineer-observation-f0e677bb
kind: observation
by: software-engineer
at: 2026-10-25T03:09:08Z
verified_by: 
confidence: high
refs:
  - ABC-216
  - EPIC-006
  - 476c9f63
  - 71b7facf
  - README.md
  - 20261025T030855Z-software-engineer-decision-b31fcae0
  - 20261025T030857Z-software-engineer-observation-1f08c91d
supersedes: 
seal: sha256:bfeb495b25eabbfbd86abe174b32d00ca157336b7ac32b09236fedbf73358fc5
---

# ABC-216 branch, commit, file and commands

Recorded as an `observation`: `admitAndAppend` refused it as an `artifact-ref` (no `sha` / `gate_run` / `content_hash`; no `§14-gate` verdict exists to bind on this install).

- **Branch:** `grugops/ABC-216`, worktree `../wt-ABC-216`, cut from `main` `476c9f63`. Not pushed, not merged.
- **Build commit:** `71b7facf` `docs(ABC-216): add README.md with an ASCII-art skytalix title`. The records commit follows it on the same branch.
- **Files:** `README.md` (new, 86 lines, 8 `## ` headings) and these notes under `.grugops/context/ticket-to-pr-ABC-216/`. No `src/`, `tools/`, `package*.json`, `AGENTS.md`, runbook, `LICENSE` or `NOTICE` change.
- **Sections:** art + tagline, Requirements, Quick start, Play, Levels, Saved games, Use with a chess GUI, Development, Licence.
- **Commands run (worktree):** `npm ci --ignore-scripts`; five `npm run chess` argument sets with stdin `/dev/null`; `npm run build` then `uci`/`isready`/`quit` into `node dist/uci.js`; the page's A2/A3/A5/A6/A8/A9 greps; `npm run lint`; `npm run typecheck`; `npm run build`; `npm test`; the skip-count capture; `test-skip-integrity.js`.
- **Commands run (fresh clone, `<scratchpad>/se216/a4/`):** every line of the README's `sh` blocks verbatim, in order, the clone URL replaced by the local tip path (the tip is not pushed; the only edit).
- **UAT:** waived by measurement: the diff lists no `src/` file. The QE hop is owed.
