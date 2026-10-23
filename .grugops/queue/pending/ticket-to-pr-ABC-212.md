---
subtask: ticket-to-pr-ABC-212
role: software-engineer
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/ticket-to-pr-ABC-212/
width: 3 of 3
---

# Build ABC-212: levels 6 (5 s) and 7 (30 s)

## Do
- Worktree `../wt-ABC-212` on `grugops/ABC-212` from `main`, own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page and its `## Design ruling` / ADR-0045 amendment: LEVELS rows 6–7, `HARDEST_LEVEL` 7, `HARD_CEILING_MS` 32 000, every surface (flag, usage/missing-value texts, startup question, UCI `Skill Level max` from `HARDEST_LEVEL`), the exact A13 pins + the Architect's four additions. Red-first on the page's plants. Any other existing test that goes red is a STOP back to Architect.
- Gates: lint, typecheck, build; `npm test` + `last-run.json`; skips; `CLI_DEEP`, `UCI_DEEP`. **Do not run `ENGINE_DEEP`** (A4, ~7.5 min of real clock) — it is QE's, width 1. Heap 128 / 400.
- AGENTS.md / runbook edits named by A11 are the Scribe's / Architect's — list what they need, don't edit.

## Fences
- Only the files the page/ruling name. No `package*.json`, ADRs, `AGENTS.md`, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se212/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `ticket-to-pr-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
