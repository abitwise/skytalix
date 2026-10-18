---
id: 20261018T073403Z-ba-pm-decision-abc166-cut-6db850fa
kind: decision
by: ba-pm
task: bapm-cut-ABC-166
at: 2026-10-18T07:34:03Z
verified_by:
confidence: high
refs:
  - ABC-166
  - ABC-146
  - ABC-085
  - ABC-087
  - ABC-164
  - EPIC-004
  - ADR-0038
  - 20261018T073403Z-ba-pm-observation-abc166-readings-b2b1241a
  - .grugops/context/wave-2026-09-25/notes/20261018T072901Z-orchestrator-decision-owner-word-abc146-rerun-tonight-as-ticket-f8c7af0c.md
supersedes:
---

# `ABC-166` cut: re-run `ABC-146`'s verdict with `--reporter=verbose`. XS, P1, EPIC-004, DoR 10/10, recommended Ready

This note is hand-authored and unsealed. Owner word: `…f8c7af0c`. The ticket's `## Scope` and `## Out of scope`
sections are authoritative. This note does not restate them.

- **Value:** `ABC-085` `A1`/`A2` (the epic's first criterion) are read for one more night of one core and no code. Run 1
  proved termination and replay, but it printed no score.
- **The acceptance shape:**
  - `A1`: the pre-flight (`A0` not stale, the flag shown on the real file, AC power, lid open, width 1);
  - `A2`: counts (exit 0, 17/17, 5 `PAIR` lines, 180 `GAME` lines, the order and the commit);
  - `A3`: the `ABC-146` `A5` reading, from run 2 only;
  - `A4`: no complete run means no score, then the owner, with route N named;
  - `A5`: two records-only decisions;
  - `A6`: fences.
- **Interpretations picked and stated:**
  - **The run tree is `wt-ABC-146`**, because the records live there. The Orchestrator may pick a fresh worktree from
    `main` if he says so before the start.
  - **The pre-flight is a real-file short pair** (`-t "3v4"`), not a probe file. It is stronger and adds no bytes.
  - **An external kill counts as "no complete run"** (`A4`). The brief's rule covers a non-zero exit, and this case is
    added so that no partial `PAIR` line is ever quoted.
- **Recommendations for `A5`, which are not decisions of this role:**
  - Architect: note `--reporter=verbose` in addendum 2's command, as a dated line.
  - Scribe, after `ABC-146` merges: rewrite `AGENTS.md`'s ladder comment, net ≤ 0 B or together with `ABC-164`.
- **Size and priority:** `XS`, because there is no code. `P1` is inherited from `ABC-146`.
- **Not touched:** `plans/board.md` and `plans/traceability.md`. The board row and the trace row go to the
  Orchestrator in the hand-off.
