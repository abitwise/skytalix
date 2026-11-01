# `arch-qehop-threshold` artifacts: branch `grugops/arch-qehop-threshold` from `main` `28e46464`; records commit `b5bb0ce4` (ADR-0035 +189, catalog +54, insertions only)

## Scope
Records only. Fenced to `ADR-0035`, `plans/nfr-catalog.md`, this task's context and the brief. No board, trace, `src/`, `tools/`, `data/`, `AGENTS.md`. No vitest, npm, build, engine or game; `qe-ABC-223` held the host alone. Nothing pushed, forced, amended, rebased or merged.

## Files
- `memory-bank/50-decisions/ADR-0035-…md`: § Status pointer "Addendum 2026-11-01" and § Addendum 2026-11-01 (after qe-qehop-growth) C1–C5. `git diff --numstat` 189 / 0.
- `plans/nfr-catalog.md`: one `_Updated:` line; one floors-block sub-bullet (C3); one subsection ending "`N8-LANE` at `ABC-105`". 54 / 0.
- NFR rows: all twelve `^\| NFR-` lines hash `39291dcf…9d83` before and after; `NFR-001`–`NFR-008` hash `983e7e7f…46f9bb` before and after.
- `.grugops/context/arch-qehop-threshold/raw/`: `recompute.py`, `recompute.out.txt`, `seal.mjs` (from `arch-hostname-adrs`, logic unchanged), `seal-spec.json`, note bodies.

## Commands
- `python3 -I raw/recompute.py ../../qe-qehop-growth/probe/w1/n8-qeg.tsv > raw/recompute.out.txt`
- `node raw/seal.mjs <worktree>/.grugops/context arch-qehop-threshold raw/seal-spec.json`

## Risks
- None open on this hop. Owed elsewhere: none. The Orchestrator merges.
