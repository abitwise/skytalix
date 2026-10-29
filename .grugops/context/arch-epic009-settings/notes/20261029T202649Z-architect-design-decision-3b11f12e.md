---
id: 20261029T202649Z-architect-design-decision-3b11f12e
kind: decision
by: architect-design
at: 2026-10-29T20:26:49Z
verified_by: 
confidence: high (the question is the owner's to answer)
refs:
  - arch-epic009-settings
  - EPIC-009
  - orch-2026-10-29g/…a67f71ac
  - sa-ideas-verify/…1ccf0010
  - ADR-0052
  - OQ-0052-1
  - NFR-004
supersedes: 
seal: sha256:1463abbd8d6b8a87581fba93b97e32d750aedca2bcf3594e65025a4ca31f7c23
---

# Owner question OQ-0052-1: accept ADR-0052 (the two EPIC-009 settings)?

For the Orchestrator to put to the owner. The design is delivery, under his delegation. Two points are his: the ADR's
acceptance, and any NFR bound (`NFR-004`).

**One question, five points, one answer:**

1. **Form:** a UCI option `TimeMode` with values `level` (the default, today's behaviour), `simple-tournament`, and
   later `uci-clock-mode`. In cutechess it is `option.TimeMode=simple-tournament`. `Skill Level` and levels 1–7 are
   unchanged. Nothing is added to the CLI, which has no clock.
2. **T = 22.0 s a move** under your 22.5 s ceiling. At exactly 22.5 s, the 40th move of a 40/15 period ends about
   50 ms from the flag, which misses your ≥ 500 ms. At 22.0 s about 19 s are left, and 98 % of the clock is used.
3. **Neither mode ever spends past the clock.** Each keeps ≥ 1 s at any time control. At 40/15 this never shortens
   simple-tournament's 22.0 s.
4. **The clock mode's 60 s ceiling:** the engine's one safety clamp moves from 32 s to 60 s, in that ticket only.
   Levels 1–7 are unaffected.
5. **One move late:** a GUI's `isready`/`stop` sent mid-move is answered when the move ends, up to 60 s in the clock
   mode. This is accepted, with no worker thread. cutechess does not ping mid-move in timed play.

**Options:** (a) accept as written; (b) accept with a different T (anything under 22.5 s); (c) decline.
**No default.** Nothing is built on `ADR-0052` until he answers. The `simple-tournament` ticket can leave `Backlog` on
(a) or (b).
