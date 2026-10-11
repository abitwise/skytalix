---
id: 20261011T162336Z-architect-design-observation-abc151-handoff-nothing-timed-6cc7b91d
kind: observation
by: architect-design
at: 2026-10-11T16:23:36Z
verified_by:
confidence: high
refs:
  - ABC-151
  - ABC-152
  - ABC-149
  - ADR-0040
  - AGENTS.md
  - plans/traceability.md
  - plans/tickets/ABC-151-heat-the-owner-picks-two-test-workers-lower-the-cap-3-to-2-re-pin-it-and-read-wall-and-heat.md
supersedes:
---

# `ABC-151` design hop: what was read, what is owed, and the next hop

This note is hand-authored and unsealed.

## Read, and nothing timed

- **Read:**
  - the `ABC-151` and `ABC-144` pages;
  - `ADR-0040` with its first addendum;
  - the four Window B notes (`…e451fa31`, `…bfdcf3b3`, `…1ff56629`, `…866dc5af`);
  - the owner-word note `…fbbdde16`;
  - `ADR-0035`'s floors and `plans/nfr-catalog.md`'s floors;
  - `vitest.config.ts` and the `ABC-144 A7` pin in `src/cli.test.ts`.
- **Nothing was run.** There was no `npm test`, no timing, no resolved-config read and no `node_modules` use, so
  no `node_modules` symlink was made in the worktree.
- **Arithmetic re-checked at this hop:**
  - 0.7729 ÷ 0.8352 − 1 = −7.46 %;
  - `ENGINE_DEEP` CPU ÷ wall = 531.39 ÷ 283.01 = 1.878;
  - `SEARCH_DEEP` CPU ÷ wall = 1256.76 ÷ 968.22 = 1.298.

## Owner word

- **None is owed for the addendum.** It records his own pick, and its literals follow from decisions 2 and 4.
- **Conditional, at the window only** (as the ticket already says):
  - `A3`: head over W = 10 s;
  - `A4`: the CPU interval does not lie wholly below 0;
  - `A5`: k = 2 heats no later than k = 3, and on no fewer reads.
- **The `A5` result goes beside the merge either way** (it is his `RISK-ABC144-HEAT`). One reading is surfaced and
  not ruled: "2 workers" could have meant agent hops only (`VITEST_MAX_THREADS=2`). The transcription and the cut
  read it as the lane setting.

## Next hop

- **Board (the Orchestrator's move):** `ABC-151` leaves `In Design` for `Ready for Dev`, then the criteria
  re-read at the `Ready for Dev` exit (process rule 1).
- **SE build (`ABC-151` § Scope 2):**
  - the config literal and header paragraph;
  - the pin's literals and its comment citing "`ADR-0040` addendum 2";
  - the armed reds, from addendum 2's item 4.
- **Then:** QE, then Security/NFR's width-1 window in the addendum's step order, then the Scribe.
- **`ABC-152` merges after `ABC-151`.** Its `D2`(a) owns whether the `VITEST_MAX_THREADS`/`poolOptions` names
  survive on 4.1.
- **For the Scribe:** `AGENTS.md` is 24,474 B at `4973d8e0`, which leaves 102 B of headroom under 24,576 B.
  The worker-cap line's 3 → 2 edits (`maxWorkers: 2`, `≤ 2`) are byte-neutral. Adding `ABC-151` to the line's
  parenthesis costs 9 B.

## Trace

`plans/traceability.md` gains an `ABC-151 (design)` row on this branch. It is append-only, so it may conflict
with the parallel hops' rows (as `QE-144-d` did). The conflict is the Orchestrator's to resolve.
