---
id: 20261021T173615Z-agents-md-scribe-decision-aaad8f92
kind: decision
by: agents-md-scribe
at: 2026-10-21T17:36:15Z
verified_by: 
confidence: high
refs:
  - AR-191-QUOTEPATH
  - 20261021T173242Z-orchestrator-decision-717a2219
  - 20261021T165304Z-security-nfr-decision-7c1f3590
supersedes: 
seal: sha256:e6c96cf7c12d18ff61a2214ea82b98a7ff5ccf4208c1d4159377df6cff090510
---

The UAT waiver measurement now reads `git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`, in both `AGENTS.md:150` and `memory-bank/45-standing-rulings.md:67` (commit 6fe742c3, branch grugops/scribe-waiver-quotepath from 47a3c9a1). Only the command changed; the unfiltered reference form, the snapshot exception, 'a waiver is not a signature' and the three overrides are untouched. AGENTS.md 15,797 -> 15,821 B (+24; the brief expected +22, the added text '-c core.quotePath=false ' is 24 bytes). No new backticked npx vitest text (ABC-173 A3 count stays 17). Logged in memory-bank/90-agents-md-command-log.md. This is AR-191-QUOTEPATH's waiver half only; no src/, tools/, plans/ or git config touched.
