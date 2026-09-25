---
id: 20260925T234000Z-orchestrator-decision-6a63f2b7
kind: decision
by: orchestrator
at: 2026-09-25T23:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-122
  - ABC-121
  - ADR-0026
  - .grugops/context/secnfr-ABC-122/
  - .grugops/context/validate-adr0026/
supersedes: 
---

# Owner's word: ABC-122 UAT, R1, main merge, ADR-0026

Owner (Olger Oeselg), 2026-09-25, verbatim: *"1. accept - you can ask engineer or qe to run tests, no need to send this to me ; 2. R1 accept ; 3. yes ; 4. accept"*.

1. **`ABC-122` accepted at UAT** → `Done`. **Standing instruction:** hands-on test runs for UAT are delegated to the Engineer or QE; do not route "run the tests yourself" to the owner. The owner's word is still asked for acceptance itself.
2. **R1 accepted** (LOW, owner Olger Oeselg): a SIGHUP/SIGQUIT/SIGKILL to the wrapper can orphan a hung `vitest`; stop `npm test` with SIGTERM/Ctrl-C. No follow-up ordered. R2 (bound > 2^31−1 ms false-red) and R3 (stale `run-bounded.js` header) stay owed to the Engineer's next touch of `tools/grugops/`.
3. **`main` merge licensed**: `ABC-122` → wave → `main`, local fast-forward, no push (upstream not yet set up).
4. **`ADR-0026` accepted with the four amendments** of the independent review (`…9a3f6e21`): predicate returns the reduction in plies and classifies the move itself; drift bars at d5 in both recursions; mate floor → one-extra-ply floor on the mate-rich corpus; `ABC-121` `A4` fail-high at a null-window node; plus the one-door alternative recorded. Architect/Design writes the amendments and the status; BA/PM folds them into `ABC-121`.
