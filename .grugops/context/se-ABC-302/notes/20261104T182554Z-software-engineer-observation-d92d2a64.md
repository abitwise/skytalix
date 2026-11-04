---
id: 20261104T182554Z-software-engineer-observation-d92d2a64
kind: observation
by: software-engineer
at: 2026-11-04T18:25:54Z
verified_by: 
confidence: high (git, as run); observation because artifact-ref needs a section-14 gate_run this hop does not have
refs:
  - se-ABC-302
  - ABC-302
  - EPIC-011
  - ADR-0046
  - NFR-008
  - R-N8H-1
  - R-302-a
  - arch-ABC-302/20261104T181301Z-architect-design-decision-bcadd41d
  - arch-ABC-302/20261104T175227Z-architect-design-decision-23abb6c5
  - src/search.null-move.test.ts
  - src/uci-session.test.ts
  - src/search.futility.test.ts
  - src/zobrist.test.ts
  - src/engine.test.ts
  - src/levels.test.ts
  - src/cli.test.ts
  - src/engine.capacity.test.ts
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - grugops/ABC-302
  - bff22046
  - 71e9c401
  - 44817c44
  - 7f4c513a
supersedes: 
seal: sha256:5fe54e2debda4e37a10cf86250fdfdbccdea2eb03ae6d41a64b139a1905f09aa
---

# se-ABC-302 observation (artifact record): the ABC-302 build

- **Branch:** `grugops/ABC-302` (worktree `.claude/worktrees/se-ABC-302`), from `main` `bff22046`.
- **Commits:**
  - `71e9c401`: claim;
  - `44817c44`: test, the eight test files;
  - `7f4c513a`: `AGENTS.md`'s two counts and the command-log entry;
  - then records: these notes, the Result, the trace row, and the brief and claim moved to done.
- **Files:** the eight test files in refs, plus `AGENTS.md` and `memory-bank/90-agents-md-command-log.md`. No file is added or removed. `git -c core.quotePath=false diff --name-only bff22046 7f4c513a | grep -v '\.test\.ts$' | grep '^src/'` is empty, so the UAT waiver applies at delivery.
- **Raw evidence** (`raw/`): `a2check.py`, `a3-counts.txt`, `a3-names.diff`, `tlines.sh` with `tlines.txt`, `mutrun.sh` with `mut-spotcheck.txt`, and `wall.sh` with `wall.tsv`.
- **Remaining:** QE takes A6 (freeze; base, tip and deep kills on the 27), A7 (the ADR-0046 run-rule lines) and A8 (the B/H/H2 twin). Security/NFR takes A9. The Orchestrator moves the board.
