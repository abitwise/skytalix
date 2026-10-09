---
id: 20261009T154500Z-orchestrator-decision-7c41e9a2
kind: decision
by: orchestrator
at: 2026-10-09T15:45:00Z
verified_by: 
confidence: high
refs:
  - ABC-124
  - main
  - tools/grugops/host-protection.js
supersedes: 
---

Owner (Olger Oeselg), 2026-10-09, verbatim: "commit the install changes, then pull ABC-120" — then, on the lint failure, "go ahead with option 1".

1. Kit reinstall output committed to the wave at `1674f74` (settings ask-gate, config model/effort map, install ledger, `.pi/prompts/grugops.md`, `tools/grugops/host-protection.js`).
2. `ABC-120` NOT pulled: it is already `Done` (built `d8e7ccc`, QE PASS, owner-accepted `51df3e6` 2026-09-25). The Orchestrator's earlier recommendation misread its board row as Backlog.
3. Lint was red on the wave tip after (1): `host-protection.js` is a kit-installed file now inside ABC-124's lint scope — 3x `noControlCharactersInRegex` (`:527`, `:555`, deliberate control-char rejection) + 1x `useOptionalChain` (`:483`). Ruled: exclude that ONE file in `biome.json` `files.includes` (`!tools/grugops/host-protection.js`). Not edited locally — the install ledger tracks it and a reinstall would revert a local edit.
4. Guard re-planted per the ABC-124 carried finding: a violation appended to `tools/grugops/lane-inventory.js` still turns `biome check .` red (exit 1); reverted.
5. Gates on the tip: lint 0, typecheck 0, build 0, unit 1467/1467 (48 files).
6. Local `main` fast-forwarded to the wave. No remote; nothing pushed.
Carried (unscheduled): kit upstream — make `host-protection.js` lint-clean under Biome recommended, then drop the exclusion.
