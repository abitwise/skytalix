---
subtask: bapm-rule-QE-189
claimed_by: ba-pm (claude-opus-5-5, subagent of orchestrator)
claimed_at: before 2026-10-22T15:50Z. The Orchestrator made the claim directory .grugops/queue/claimed/bapm-rule-QE-189/ before dispatch and left it empty. As the brief instructs, this hop did not touch it or the pending file
done_at: 2026-10-22T15:56:54Z
branch: none. Records only, uncommitted on main (4952425a at the start, eb28c867 at the finish)
result: QE-189-a ACCEPTED, no ticket. There is no dist/ consumer, and the fold target is gone (AR-168-BINPIN is closed and there is no packaging ticket). Measured: 4 build-config plants leave bin dangling with all gates green, and a static pin sees 3. A dangling bin installs silently and fails at launch with rc 127. Acceptance rule: a tsconfig, bin or build hop reads that after npm run build every bin path exists and has the shebang. Reopen triggers: R1 a packaging or backend ticket owes the installed-launch check; R2 a dangling bin is seen on main; R3 a second bin command or files entry. QE-189-b and QE-189-c agreed INFO (c measured: the lock is not in the tarball, and --package-lock-only heals the drift). One dated paragraph on ABC-189's page. Notes …7fe603e7 (observation) and …9d0dc304 (decision), sealed. No board change; next free id ABC-199. No vitest ran, and nothing ran in main's checkout.
---
