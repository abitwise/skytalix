---
id: 20261010T183947Z-software-engineer-claim-abc093-agents-md-regeneration-line-owed-a6cb510f
kind: claim
by: software-engineer
at: 2026-10-10T18:39:47Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ADR-0037
  - AGENTS.md
  - .grugops/queue/pending/ticket-to-pr-ABC-093.md
supersedes:
---

# `ABC-093` § Scope's `AGENTS.md` regeneration line is OWED: the queue fence forbade this hop to write it

**The conflict.** `ABC-093` § Scope puts the regeneration command into `AGENTS.md`'s command table
"only after it has been RUN". The subtask's fences say "No `plans/board.md`, ADRs, `AGENTS.md`".
The queue file is binding, so `AGENTS.md` is untouched.

**What is ready for whoever holds the pen.** The command was RUN three times on 2026-10-10 (exit 0,
`cmp` exit 0 between runs; readings in `…02e9031a`):

`node tools/opening-book/compile.ts <dir holding a.tsv … e.tsv at the pinned SHA>`

The pinned SHA and raw URLs are in `data/opening-book/ATTRIBUTION.md`, which also carries the same
regeneration instruction, so the provenance is not lost meanwhile. Budget: `AGENTS.md` had 943 B left
at `4768b3b0` (ticket page). **Routing:** the Orchestrator (an AGENTS.md Scribe hop or a fence lift).
