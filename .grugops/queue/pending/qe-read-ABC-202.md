---
subtask: qe-read-ABC-202
role: qe-e2e
ticket: plans/tickets/ABC-202-cutechess-cli-plays-the-built-skytalix-read-epic-007-m1-and-m8a.md
ref: .grugops/context/qe-read-ABC-202/
width: 1 (ALONE among agent hops; the page requires it)
---

# Read EPIC-007 M1 and M8(a) with cutechess-cli, exactly as ABC-202 pins them

## Do
- Follow the ABC-202 page exactly: re-check the tool's version and sha256; fresh clone of `main` at the sha you record as S, `npm ci && npm run build`; run M1 then M8(a) with the pinned flags, the page's EPD file and watchdogs; check every result text against the page's pass list.
- Host: AC at the start (required); log load1, thermal and foreign vitest (not gating). Apply the page's rule for a fault on a non-quiet host (UNRESOLVED, owner-window re-run owed) — do not re-run on your own beyond what the page allows.
- A flag that misbehaves: fix the spelling in-hop and record it, as the page allows; anything that changes what is measured is a STOP back to BA/PM.
- Keep every raw file (pgn, debug logs, stderr, EPD, versions) under `.grugops/context/qe-read-ABC-202/raw/` in your worktree.
- Verdict per measure: MET, NOT MET or UNRESOLVED, and the route the page names for any failure. Fix nothing.

## Fences
- Work in `../wt-qe-read-ABC-202` on `grugops/qe-read-ABC-202` from `main`, the fresh clone, and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe202/`. Commit notes, raw files and a dated `## QE` addendum on the ABC-202 page. No `src/`, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`, `memory-bank/50-decisions/`; do not touch the cutechess checkout. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-read-ABC-202`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
