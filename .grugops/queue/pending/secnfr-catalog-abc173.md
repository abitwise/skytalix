---
subtask: secnfr-catalog-abc173
role: security-nfr
tickets: [ABC-173]
branch: grugops/secnfr-catalog-abc173 (from main, current tip)
worktree: ../wt-secnfr-catalog-abc173
---

# Catalog edit for ABC-173: add NFR-010 and the NFR-008 heap clause (records only)

ABC-173 is merged on main (`03859f2e`), with the owner's word on R-173-1 and R-173-2 (`…5c8d2f71`). Your own gate wrote the text for this edit: `.grugops/context/secnfr-ABC-173/notes/…bec09225`.

Make these changes in `plans/nfr-catalog.md`:
1. Add the **NFR-010** row, verbatim.
2. Insert the **NFR-008 heap clause** at the place the note names.
3. Correct the NFR-008 stack line, which still reads Node v26.11.0 / vitest 3.2.7. The live stack is v26.11.1 / 4.1.11. Write the correction as a dated, forward-only line.
4. Record **R-173-1** (A9 owed) and **R-173-2** (N8-LANE owed) as accepted on the owner's word, each with its arms. Use the same form as R-167-2 and R-171-1, which are also owed, if those are in the catalog.

**Fences:**
- Records only: `plans/nfr-catalog.md` and one note.
- Do not run any vitest or timing.
- Do not touch `src/`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`.
- Never push or merge.

**Hand-off:** write `.grugops/queue/done/secnfr-catalog-abc173.md` and `.claim.md` in main's working tree, uncommitted. Include the commit and a trace row.
