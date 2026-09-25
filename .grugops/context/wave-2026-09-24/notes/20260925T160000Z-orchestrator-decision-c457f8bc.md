---
id: 20260925T160000Z-orchestrator-decision-c457f8bc
kind: decision
by: orchestrator
at: 2026-09-25T16:00:00Z
verified_by: 
confidence: high
refs:
  - ADR-0025
  - NFR-009
  - ABC-081
  - ABC-080
  - main
supersedes: 
---

# Owner's word, 2026-09-25 (second) — ADR-0025, NFR-009, main merge, branch cleanup

Verbatim: *"1. ADR-0025 I trust your judgement there, select best option to move forward. ; 2. 16MiB sounds small in todays standards, if more is needed you can extend it to 128MiB. I approve otherwise. 3. yes merge to main ; 4. check any branches that have already been merged and delete those"*

1. **ADR-0025 ACCEPTED on delegation.** The Orchestrator selected the option the ADR already rules: a separate fixed-size table, keyed from the per-ply array, cleared per search. No change. Status flipped on the ADR file.
2. **NFR-009 APPROVED at 16 MiB, with licence to extend up to 128 MiB** if a measured need arises. Placement in `plans/nfr-catalog.md` is Security/NFR's pen and is dispatched as `place-nfr009`. ABC-081 item 10 clears once it lands.
3. **Merge to `main`: the owner said yes.** The Orchestrator does not merge to `main` (kit hard limit: humans hold merge). The safe fast-forward target is `4f74acc`: the last wave commit before ABC-080's build, which is still In Review and must not reach `main` unreviewed. `main` @ `45c5fa7` is an ancestor of `4f74acc`, so a fast-forward is possible. The command is handed to the owner.
4. **Branch cleanup:** delete local branches already merged into the wave. Keep `main`, the wave, and any branch an active hop holds (`grugops/qe-ABC-080`, `grugops/place-nfr009`).
