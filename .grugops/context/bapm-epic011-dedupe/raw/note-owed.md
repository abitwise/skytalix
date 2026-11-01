# `bapm-epic011-dedupe`: what is owed after this hop, and to whom

- **Orchestrator (board moves):**
  1. Add `[EPIC-011]` to Backlog (owner BA/PM, size XL, P2, since 2026-11-01; starts after EPIC-006/009/010 close; goal 3 000 at 40/15).
  2. Re-tag the Backlog lines of ABC-231, 232, 233, 234, 236, 237, 238, 239 and ABC-254 to EPIC-011 (ABC-238 P3 → P2; ABC-237 after ABC-238; ABC-254's "milestone 1b" tag → EPIC-011 Phase 5, with the exception: yes + ADR before ABC-250 enters development pulls it back into 1b, first).
  3. Add Backlog lines for ABC-255 (M, P1, 8/10), ABC-256 (S, P2, 8/10), ABC-257 (S, P3, 8/10), ABC-258 (S, P3, 8/10). None goes Ready: EPIC-011 waits the other epics.
  4. EPIC-010 line: goal text moved to EPIC-011; remaining = ABC-249, ABC-250..253; close after 1b + a close hop (M3/M4); M2 stands on milestone 1's batch.
  5. EPIC-009 line: closes on ABC-223's grade.
  6. EPIC-006: move to Done (close); its line's "acceptance 1 unmeetable" and "two epics" text are stale.
  7. Trace render from the artifacts note's refs.
- **Owner (via the Orchestrator):** Q-3K-2 (SPRT in the per-change rule), Q-3K-3 (width/cores), Q-3K-4 (G6 "≥ base"), Q-3K-6 (NFR-009 > 16 MiB; ABC-258 beyond 8 MiB), Q-3K-7 (tuning data), Q-3K-8 (bitboards, later), Q-SP-3 (ABC-254); confirm the scale and the claim rule (rest of Q-3K-1). Information, not asks: save/resume not built at EPIC-006's close; the major validation merged into EPIC-011's 40/15 readings; a 200-game 40/15 reading is of the order of 100–200 h at width 1 (BA/PM estimate).
- **Architect (`arch-adr0056-owner-fold`, in flight):** the routine control(s) and game counts (ABC-255 default, ABC-256), Stockfish's side at high E, the 40/15 reading cost; C3 (O1-a vs O1-b order). Later: `-sprt` on cutechess-cli 1.5.1 at ABC-255's design; the ADR revising ABC-081 A1 (ABC-238).
- **BA/PM (later):** grade EPIC-009 milestone 2 on ABC-223; EPIC-010 close fold; refine each EPIC-011 phase's stubs into pages at its turn; close ABC-231/232 as merged when E1 is cut.
