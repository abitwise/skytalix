---
id: 20261021T082642Z-agents-md-scribe-observation-1ab99dce
kind: observation
by: agents-md-scribe
at: 2026-10-21T08:26:42Z
verified_by: 
confidence: high (each fact read from the installed plugin files on 2026-10-21)
refs:
  - AGENTS.md
  - QE-160-c
  - QE-159-g
supersedes: 
seal: sha256:a7636ddcb88db8eb9a2dd690dcae0625a2657dd096dc4909fd05c6e97a53ed44
---

# The note writer and claim helper exist; AGENTS.md said they did not

Read from `~/.claude/plugins/cache/grugops/grugops/2.1.0/scripts/` (installPath of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json`):
- `context-io.js` exports `admitAndAppend` (line 5400) and `readContext` (line 2011); it seals via `appendNote`.
- `claim.js` exports `claimTask`, `transition`, `sweepStale`, `renderNowRunning`.
- `.claude-plugin/plugin.json` declares the MCP server `grugops` (`scripts/admission-server.js`); its tool `propose_note` is named `mcp__plugin_grugops_grugops__propose_note` by the platform.
- `.grugops/factory.config.json` line 62: `human_admission: "off"`, so no `finding` is admissible. Unchanged.
The old AGENTS.md text said all three were absent and told agents to hand-author notes; that produced unsealed notes in QE-160-c and QE-159-g.
