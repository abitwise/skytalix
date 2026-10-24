---
subtask: qe-ABC-204
role: qe-e2e
ticket: plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md
ref: .grugops/context/qe-ABC-204/
branch: grugops/ABC-204 (0e88c5df)
width: 1 — ALONE, when the board is idle (owner …e44d2903); after qe-timing-ABC-203. Hours.
---

# QE gate + long readings for ABC-204 (rating harness)

> **Owner rule 2026-10-24 (`…4c3f7639`): ONE run.** No prior valid reading exists, so run once under the preconditions and write the result; it is final. No repeat on UNRESOLVED/NOT MET (grade it as the page says); the procedure's own defined steps (e.g. a pooled extension) are part of the one run.

## Do
- Own worktree from `grugops/ABC-204`, merge current `main` first (report sha), own `npm ci`.
- Verify A1–A3 independently, then the long readings exactly as the page and Design ruling state: A5 first (D at 3 000 ms, concurrency 3 → median game wall → rule budget B), then A4 baseline R (200 games, E start 1650, the E′ rule, 25–75 % score band, Stockfish depth guard), then A6 A/A D (100 games, interval contains 0). Plus the QE-owned checks the SE listed (book-move counts, `[FEN]` colour pairs, go→bestmove gap stats reported not graded, gzip of .out).
- Preconditions per reading: AC, no foreign vitest, load1 ≤ 8 at start, thermal logged; a fault on a non-quiet host is UNRESOLVED. If the host goes onto battery mid-run, stop that reading and report.
- Verdict per criterion; the baseline R (with interval) is EPIC-008's M1 baseline.

## Fences
- Only your worktree and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe204/`; raw outputs committed under your context folder per A7 (.out.gz + PGN). No `src/`/`tools/` edits (findings only). Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-204`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
