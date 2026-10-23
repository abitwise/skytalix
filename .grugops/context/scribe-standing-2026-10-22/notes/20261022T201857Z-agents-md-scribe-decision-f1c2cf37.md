---
id: 20261022T201857Z-agents-md-scribe-decision-f1c2cf37
kind: decision
by: agents-md-scribe
at: 2026-10-22T20:18:57Z
verified_by: 
confidence: high (grep and read of AGENTS.md against the six notes)
refs:
  - AGENTS.md
  - memory-bank/45-standing-rulings.md
  - ABC-168
  - ADR-0007
  - 20261022T174056Z-release-manager-decision-edd18e94
supersedes: 
seal: sha256:cba3d106cd2f76cc377c8f44cd8c835685680f6c2fb3106d6257880a67448ebf
---

# AGENTS.md left untouched; one stale sentence found in the rulings file and not changed

No line in `AGENTS.md` is false because of today's notes, so it is unchanged (16,669 B, budget 18,432 B; no test run was owed). Its Build line already names `dist/uci.js`.

Found, not changed: `memory-bank/45-standing-rulings.md` § Deployment posture says "`package.json` is `private: true`, no `bin`/`main`/`exports`/`files`". Since ABC-168 `package.json` has a `bin` (`skytalix` -> `dist/uci.js`; AR-1 check 3, `…edd18e94`). The sentence is the owner's ruling moved word for word, and ADR-0007 is Architect/Design's to amend, so it is for the Orchestrator to route. The posture itself (not deployable, private) is unchanged.
