---
task: wave-2026-09-25
subtask: bapm-rescore-backlog-r1-2026-10-10
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/bapm-rescore-backlog-r1-2026-10-10/
source_refs: memory-bank/50-decisions/ADR-0035* (accepted, NFR-008 R-1), plans/nfr-catalog.md (NFR-008, NFR-005 after the catalog hop), .grugops/context/secnfr-catalog-2026-10-10/notes/*d1e00b44.md (§ Flagged), .grugops/context/qe-ABC-141/notes/ (QE-141-a, QE-141-d)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T18:58:17Z
branch: grugops/bapm-rescore-backlog-r1-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: BA/PM — re-score the non-book backlog against ADR-0035 / NFR-008 R-1

The owner accepted ADR-0035 with R-1 (wall ≤ 10 s at load1 ≤ 8 is the gate; CPU reported, not gated), and
NFR-005's PROVISIONAL marker is retired. Re-read each premise at the tip and recommend, per ticket: Ready (with
DoR), stays Backlog (why), fold into another ticket, or DROP (overtaken — say by what).

1. **ABC-108** (P1: default lane at/over NFR-008's 13 s CPU clause) and **ABC-111** (P1: warm/cold protocol
   for the wall clause) — likely overtaken or reshaped by R-1. Say exactly what survives.
2. **ABC-116, ABC-114, ABC-105, ABC-117, ABC-070** — quick premise check and re-score.
3. Say whether any of these need a ticket, and cut it only if yes (owner + size):
   - the three LOW items Security/NFR flagged (`--dir src` vs `tools/` tests; ABC-084 file count 49/51;
     N8-LANE "5 %" with no CPU level under R-1);
   - QE-141-a (unnamed flake: keep the JSON log and name the test on any red `npm test`);
   - QE-141-d (`host-protection.js` exited 2).

Do NOT touch ABC-083, ABC-085, ABC-093, ABC-094, ABC-095, ABC-096 pages (in flight or awaiting the owner).

## Fences
Ticket pages, new ticket pages, trace rows and your notes only. No `src/`, `plans/board.md`, ADRs, `AGENTS.md`,
`plans/nfr-catalog.md`, or `column:`/`status:` frontmatter. Never merge; never push. Own worktree.
Commit-message file in a PRIVATE scratchpad subdirectory. Real UTC stamps. Trailer
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Quoted heredocs only (`<<'EOF'`).

## Publish
Note per Workflow 16, trace row at the END of `plans/traceability.md`. Queue pending → claimed → done (by hand,
main checkout, uncommitted). Report: one line per ticket (verdict, DoR, column), new tickets, owner questions,
branch + sha.
