---
subtask: arch-design-ABC-204
role: architect-design
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/arch-design-ABC-204/
width: 2 (beside qe-ABC-203; records + light probes)
---

# Design ruling for ABC-204 (rating harness) before the build

## Do
- Answer the page's five Architect questions and write a dated `## Design ruling` section on the ABC-204 page. Short probes allowed (a handful of cutechess games, Stockfish `UCI_Elo` range check) — no long readings; the baseline R and A/A D are the build's.
- **STOP rule:** if your ruling needs a NEW ADR, or changes/reverses an accepted one, write it as **proposed** (never accepted) and report it — a new ADR is always the owner's (delegation `…5aaf7cec` item 3; `…3898cd9a`). Any NFR bound move is the owner's too.
- Recommend the next move.

## Fences
- Work on `grugops/arch-design-ABC-204` (worktree `../wt-arch-design-ABC-204` from `main`). Only the ABC-204 page, a proposed ADR if needed, and your notes. No `src/`, `tools/`, `package*.json`, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design204/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-design-ABC-204`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
