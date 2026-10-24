---
id: 20261024T154217Z-agents-md-scribe-decision-9f2aaeef
kind: decision
by: agents-md-scribe
at: 2026-10-24T15:42:17Z
verified_by: 
confidence: high: three dated lines applied and read back; records only, nothing run
refs:
  - ADR-0049
  - ADR-0007
  - ADR-0018
  - memory-bank/45-standing-rulings.md
  - memory-bank/50-decisions/ADR-0049-the-source-is-public-on-github-and-the-engine-still-deploys-nowhere-and-publishes-no-package.md
  - arch-accept-adr0049/20261024T153859Z-architect-design-decision-1e9e06f0
  - owner-word-2026-10-24/20261024T153400Z-orchestrator-decision-619938c5
  - grugops/scribe-adr0049-rows
  - c7529e5f
  - 5ec82f34
supersedes: 
seal: sha256:78ef41172f6829ad2e1cc9c2cd29e6295ef712ab1444727b8f878d39cfcd3852
---


# ADR-0049 rows 28, 29 and 35 applied: three dated lines in the standing rulings; records only

AGENTS.md Scribe, task scribe-adr0049-rows, branch grugops/scribe-adr0049-rows from main 5ec82f34; code commit c7529e5f. Not pushed, not merged. One file, 20 added lines, 0 removed. Nothing run: no npm, vitest or build.

## Rows applied (memory-bank/45-standing-rulings.md)
- **Rows 28 and 29, one dated correction** in section Deployment posture, directly after the 2026-10-23 correction (its shape): "Correction 2026-10-24 (ADR-0049 rows 28 and 29): a git remote exists, and the source is public." Row 28: the git-remote part of "No container, manifest, CI or git remote, and no release has ever been cut" is false since 2026-10-23; the rest holds (git remote -v read at this hop: 2 lines, one remote; plans/releases holds .gitkeep only). Row 29: "EPIC-006 ... decides HOW it is eventually distributed" is stale since ADR-0018, which decided the channel; the clone is now reachable by anyone; EPIC-006 stays the trigger for any package or binary; npx from the git URL is not offered (ADR-0049 decision 3). A closing "No ruling changes" paragraph restates the unchanged posture by pointer to the config values and ADR-0049.
- **Row 35, one dated line** in section Branching model, under the Config trap paragraph: the "No git remote" clause is false since 2026-10-23; for agents pr still means branch + gate; pushing is the owner's; agents never push, force or open a PR (ADR-0049 decision 1).
- The quoted sentences stay as written, as history.

## Not touched
- No AGENTS.md line moves (row 36 is "none: true"), so 90-agents-md-command-log.md has no entry for this pass. AGENTS.md stays at its size.
- Rows 20-24 (BA/PM, sibling branch), row 34 (Security/NFR) and the 14 Architect/Design rows are not edited. No board, plans/, src/, tools/ or package.json line.

## Check
- git diff --stat shows memory-bank/45-standing-rulings.md only.
- Class scan of the added lines: IPv4 addresses, personal paths, host/realm/namespace patterns, the reference-check word FORBIDDEN and the bin name: 0 hits. Infrastructure is named by class and count only (ADR-0049 decision 4, P5).
- The reference checker and tests were not run, to keep the host quiet for the QE timing run. No test cites this file by name (grep over src, tools, scripts: 0 files).

## Owed
- plans/traceability.md was not touched (sibling branches edit plans/); the 10-cell trace row is in the brief's Result for the Orchestrator to place.
