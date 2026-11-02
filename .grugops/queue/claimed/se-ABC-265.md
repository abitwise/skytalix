---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-02T14:42:30Z
subtask: se-ABC-265
role: software-engineer
ref: .grugops/context/se-ABC-265/
branch: new grugops/ABC-265 from main (at dispatch) — worktree .claude/worktrees/se-ABC-265
width: wrap EVERY test/build/engine run in `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. One core.
---
# Build ABC-265 (TH-1): one lockless shared transposition table
## Read
plans/tickets/ABC-265*.md (DoR 10/10, reading (b)), ADR-0025 "Proposed amendment 2026-11-02 (ABC-265, TH-1)" incl. the verified-copy rule and T8–T10, ADR-0057 D2.3, arch-ABC-265 notes (…6b1aba14, …e396e5ab), Orchestrator ruling …d39f74ef (no S2 read).
## Do
- Implement exactly the amendment in src/transposition.ts (and only the call sites it names): 4×Uint32 words a slot over one SharedArrayBuffer, XOR check, key split inside probeTable/storeEntry (bigint signatures kept), verified copy used by tableCutoff, plain writes in order 2,3,0,1, Threads 1 node-for-node equal to main.
- Rows: every acceptance row on the page incl. A2 T10 (both cases); ABC-081/122/208 rows must run UNEDITED (needing an edit = stop and report for an Architect ruling). Plant defects for T10 (live score read, live depth read) and the XOR check and show them red.
- A3 identity across the page's fixed-depth sets; A4 G6 vs base + a profile (reported). Fix the four named comments (Scope 7).
- npm test, lint, typecheck, build. Do NOT merge; the merge waits the owner's acceptance of the amendment.
## Fences
Scope per page only. No push, force-push, merge into main. Leave nothing running.
## Publish
Sealed notes (task se-ABC-265, contextRoot = worktree's .grugops/context, never the plugin cache); queue moves inside your worktree; commit; ## Result + trace row; brief + claim to done/.
