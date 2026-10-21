---
id: 20261021T090141Z-software-engineer-observation-0a18c392
kind: observation
by: software-engineer
at: 2026-10-21T09:01:41Z
verified_by: 
confidence: high (git readings on the tip)
refs:
  - ABC-179
  - grugops/ABC-179
  - dd131b71
  - ccccc6bb
  - plans/tickets/ABC-179-three-test-comments-say-what-their-source-does-not.md
supersedes: 
seal: sha256:5f7fd747360f24e80dac1122f6acb7141cfed1b6266308fe2ff294b3fde4ad5a
---

# ABC-179 diff (branch `grugops/ABC-179`, tip `dd131b71`, base `main` `ccccc6bb`)

One commit, `dd131b71` "docs(nfr-tests): grug ABC-179 make three test comments say only what their source says". Not pushed, not merged.

| file | numstat | hunk |
|---|---|---|
| `src/san.nfr.test.ts` | 2/2 | `:18-19`, inside the header (closes `:28`) |
| `src/status-panel.nfr.test.ts` | 3/3 | `:4-6`, inside the header (closes `:13`) |
| `src/history-pane.nfr.test.ts` | 3/3 | `:5-7`, inside the header (closes `:22`) |
| `src/cli.test.ts` | 3/3 | `:1831-1833`, all `//` lines inside `A12` (`:1830-1843`) |

No production file, test body, `.snap`, dependency or doc changed. Every changed line is under 100 characters (biome `lineWidth`).
Not touched: `plans/board.md`, `plans/traceability.md`, `AGENTS.md`, `turn-loop.nfr.test.ts`, `glyph-mode.nfr.test.ts`.
Remaining work: a QE hop is owed (page Test note 4). The board move and the trace row are the Orchestrator's.
