---
subtask: security-nfr-timing-2026-10-23
role: security-nfr
tickets: plans/tickets/ABC-200-on-a-terminal-npm-run-chess-asks-for-colour-and-difficulty-when-the-flags-are-absent.md (N8-LANE, pre-merge); plans/tickets/ABC-201-on-a-fresh-git-clone-npm-install-then-npm-run-chess-starts-a-playable-game-and-the-first-board-in-under-2-s.md (build: fresh-clone AC1 + NFR-007)
ref: .grugops/context/security-nfr-timing-2026-10-23/
branch: grugops/qe-ABC-200 (55618845; merge d062d60e); main c91445e3
width: 1 (ALONE: the owner's quiet window; nothing else runs)
---

# Quiet-host timing pass: (1) ABC-200's N8-LANE, then (2) ABC-201's fresh-clone reading

## Preconditions (check before EVERY scored window, and record each one)
AC power (`pmset -g batt`); load1 ≤ 8; no foreign vitest (`pgrep -fl '[v]itest'`); thermal recorded ("thermal kept and flagged"). If a precondition fails, wait and re-check; do not score that window. If the host never qualifies, report UNRESOLVED with the readings.

## (1) ABC-200 N8-LANE
- Worktree `../wt-sec-timing-ABC-200` on `grugops/sec-timing-ABC-200`, from `grugops/qe-ABC-200`. **Merge `main` in first** (a merge, not a rebase). `main` now carries ABC-178 and ABC-199. Run your own `npm ci --ignore-scripts`, then a correctness check: `npm test` + `last-run.json` success (expect 61 files / 2 018 tests).
- Measure exactly as your own spelling in `…08e4152e` § 3:
  - the narrowest set: the new and edited test files plus `vitest related` for the changed sources;
  - at base, the new file is a one-assertion placeholder, with an identical twin as the noise control;
  - at least 8 interleaved rounds;
  - the bar is ≤ 0.650 s CPU.
- Pre-register before any reading. Result: MET, NOT MET or UNRESOLVED.
- If it is NOT MET or UNRESOLVED, a full-lane NFR-008 reading is owed (headroom 0.990 s, `…d0c770b5`). Take it in this window under the ABC-177 A9 protocol, if the host still qualifies.

## (2) ABC-201: you are the builder
- Build to the ABC-201 page: A1–A4 on a fresh `git clone` of `main` at `c91445e3`, with an empty npm cache and an empty user config.
  - A2: the piped smoke run.
  - A3: spawn to first frame under 2 000 ms on the max of at least 10 runs, using the instrument from `…8d3f6c15`. The first launch after install counts.
  - A4: one dated catalog insertion; the bar stays byte-identical.
- **If A3 is NOT MET, ADR-0018 Decision 3's revisit trigger fires.** Stop and say so: that goes to the owner.

## Fences
- Work only in your worktrees and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sectime/`. Records (`plans/nfr-catalog.md` insertions, ticket page sections) go on `grugops/security-nfr-timing-2026-10-23` (worktree `../wt-security-nfr-timing-2026-10-23` from `main`). No `src/` edits; no `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-timing-2026-10-23`), `at` from `date -u`, with a `kind: decision` for each part. Write `## Result` plus one trace row per ticket into this brief in main's queue, then move it and its `claim.md` to `done/`.
