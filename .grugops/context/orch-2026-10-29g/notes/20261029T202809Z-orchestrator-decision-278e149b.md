---
id: 20261029T202809Z-orchestrator-decision-278e149b
kind: decision
by: orchestrator
at: 2026-10-29T20:28:09Z
verified_by: 
confidence: high
refs:
  - EPIC-010
  - EPIC-004
  - bapm-epic010-improvements/…5ada23af
  - bapm-epic010-improvements/…3461cdd9
  - sa-ABC-226/…cc53fc79
  - arch-epic009-settings/…fa9e821e
  - arch-epic009-settings/…3b11f12e
  - ADR-0052
  - ABC-220
supersedes: 
seal: sha256:dbe7fc7f28b719a915f4b7aa21b899f760b4972859eab98a3cab608f5408be48
---

# Owner words on EPIC-010 Q2/Q4/Q5; Q1 and Q3 asked back; merges of sa-ABC-226 and arch-epic009-settings

**Owner (Olger Oeselg), 2026-10-29, in session, verbatim:**
"Selecting Q4 option e, extend a bit, let's set 10 games self-play + 10 games vs stockfish ; 1. not sure, explain ; 2. remove that goal, I would set another goal - be the best vibe-engineered or TypeScript-based chess-engine (not sure what exists out there, we can put goal to 2700 elo rating or more, world record is 3650). It can be that in the future we need to rewrite to Rust, but let it be for now, this is big undertaking. ; 3. not sure, explain ; 4. accept without elo target, elo target is hard to reach, but try to understand if things get worse."

**Recorded (his numbers 1–4 follow EPIC-010's Q1, Q2, Q3 and Q5; Q4 he answered first):**
- **Q4 = (e), extended.** Each value-changing ticket gets a smoke of 10 self-play games (D) and 10 games against
  Stockfish (R). Major validation is batched later.
  - Orchestrator caveat for BA/PM to state on the page: 10 games can only catch a crash, a time loss or a collapse.
    A loss of tens of Elo cannot be seen. "Understand if things get worse" therefore needs the batched validation
    and a trend across tickets.
- **Q2:** EPIC-004's "strength above ~1700" non-goal is **removed** (an amendment with a date). The new product goal is
  to be the best vibe-engineered / TypeScript-based chess engine, aiming at 2 700 Elo or more.
  - The scale and the field of comparison are UNKNOWN - verify; Architect or BA/PM research them.
  - A Rust rewrite is possible in the future and explicitly NOT now.
- **Q5:** EPIC-010's measures are accepted, with no Elo target. The intent: detect when things get worse.
- **Q1 (Syzygy) and Q3 (ADR-0020 d2):** the owner is not sure. The Orchestrator explains both in session; the defaults
  hold until he answers.

**Merged:**
- `sa-ABC-226` (`d120ab0f`): ABC-226 → Done. 484 costed repetitions (R 26), so ABC-230 stays in milestone 1. 22
  games show cutechess counts threefold with an ep-normalised key (relevant to Q3).
- `arch-epic009-settings` (`a060c449`): ADR-0052 PROPOSED.
  - A `TimeMode` combo beside `Skill Level`.
  - simple-tournament budget `min(T = 22 000, C)`.
  - A safe clock share C that keeps 1 s plus 100 ms for each move to go.
  - uci-clock-mode with a 59.5 s budget and the 60 s clamp, moved only at that ticket.
  - Mid-search latency up to 60 s accepted.
  - Owner question OQ-0052-1 (accept: a/b/c).
- **Owed:** BA/PM reconciles ABC-220 to ADR-0052 (`min(T, C)`, not `min(G, T)`).

**Routed:** `bapm-owner-words-b` (BA/PM): EPIC-010 Q2/Q4/Q5, the EPIC-004 line, and ABC-220/221/222/223 reconciled to
ADR-0052 as proposed.
