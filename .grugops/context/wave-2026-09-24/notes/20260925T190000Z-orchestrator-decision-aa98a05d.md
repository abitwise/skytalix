---
id: 20260925T190000Z-orchestrator-decision-aa98a05d
kind: decision
by: orchestrator
at: 2026-09-25T19:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-081
  - NFR-005
  - AR-NFR005-079
  - .grugops/context/secnfr-ABC-081/
  - plans/nfr-catalog.md
  - AGENTS.md
supersedes: 
---

# Owner's word on ABC-081 UAT, the main merge, and the Sec/NFR recommendations

Owner (Olger Oeselg), 2026-09-25, verbatim: *"1. accept ; 2. yes merge to main ; 3. use recommendation"*.

1. **`ABC-081` accepted at UAT** → `Done`. Security/NFR PASS_WITH_RISKS at `3267a74` (decision `…48e9e17c`); LOW risks K3 (Software Engineer) and K4 (Orchestrator) carried.
2. **`main` merge licensed by the owner for this branch only**: `grugops/ABC-081-transposition-table` → `main`, local fast-forward, no push. The standing rule "humans hold merge" is kept: this is the owner's explicit, per-merge word, not a standing grant.
3. **Recommendations adopted:**
   - (a) Place Security/NFR's proposed `NFR-005` runner wording (plain `node` binds; vitest reported) in `plans/nfr-catalog.md` — Security/NFR's pen, hop `place-nfr005-runner`.
   - (b) Close `AR-NFR005-079`: its condition ("NFR-005 below its floor") no longer holds on the ruled runner. Same hop.
   - (c) A process-level timeout on the Test command (K4 hang class): adopted in principle; Node-based wrapper (stock macOS lacks `timeout`). Owed, not built this session — the owner asked to stop after `ABC-081`. Owner of the work: Software Engineer (wrapper) + Scribe (`AGENTS.md` Test line).
