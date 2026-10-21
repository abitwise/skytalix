---
id: 20261021T130000Z-orchestrator-decision-c6bf41be
kind: decision
by: orchestrator
at: 2026-10-21T13:00:00Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - ABC-164
  - ABC-109
  - memory-bank/90-agents-md-command-log.md
supersedes: 
seal: sha256:d7ba149cc17e3aa4bc8e2647e1fb0382c6f731b89c16880af7d81ccaa5119317
---

Owner direction (Olger Oeselg, 2026-10-21, verbatim): "AGENTS.md needs to be re-checked, what is not necessary for every role session should be moved out into separate markdown document that is reached from AGENTS.md or other index document."

Orchestrator routing:
- This widens ABC-164 beyond buying back headroom: AGENTS.md keeps only what every role session needs; everything else moves to separate markdown document(s), reachable by a pointer from AGENTS.md or from an index document (e.g. memory-bank/00-index.md).
- Step 1: Scribe audit `scribe-audit-agents-md` (records only): classify every AGENTS.md section/line as every-session vs on-demand, name the target document(s) and pointers, find every test or tool that reads AGENTS.md text (budget, slot, pinned lines) and what a move would break, and estimate bytes after.
- Step 2: BA/PM cuts the restructure ticket(s) from that audit (ABC-164 re-cut or superseded; bapm-rescope-ABC-164's output is input, not final).
- Step 3: Scribe builds, QE checks. No AGENTS.md edits before the cut.
