---
id: 20261029T221000Z-orchestrator-decision-a67f71ac
kind: decision
by: orchestrator
at: 2026-10-29T22:10:00Z
verified_by: 
confidence: high
refs:
  - EPIC-009
  - bapm-epic009-tournament/…4d365276
  - ABC-218
  - ABC-219
  - ABC-220
  - ABC-221
  - ABC-222
  - orch-2026-10-29g/…0c536e58
supersedes: 
seal: sha256:15cbb2360f467e30e72949f7c2dfdc8135f1a8582398a70742d93012a3594da8
---

# Owner words on EPIC-009 (Q1–Q8) and ABC-218

**Owner (Olger Oeselg), 2026-10-29, in session, verbatim:**
"Close ABC-218 - no need to measure it, it is not deterministic and we can't anyway use it for tournament. Let the difficulty setting stay. My answers: 1. cutechess matches. For simpler tests use much less matches, 5 or 10, just to make sure things work, major validation with 100 or more games comes later since it can run over 24 or 48 hours. 2. Initially let's add 22.5 second separate difficulty setting and use that, later UCI clock mode ; 3. it might make sense to use 2 new difficulty settings then, 22.5s one could be simple-tournament and other one uci-clock-mode (maybe separate inputs) ; 4. 22.5 ceiling ; 5. increase to 60s ; 6. not yet, let's do that after other improvements are done ; 7. no ; 8. ok"

**Recorded:**
- **ABC-218: CLOSED, not run.** Ready → Done (dropped).
- **Levels 1–7 stay** as they are.
- **Q1:** played in cutechess matches, so UCI is the required surface. Smoke readings are 5–10 games, only to show it
  works. Major validation (≥ 100 games, 24–48 h) comes later and is not part of this MVP.
- **Q2:** option (a) first: a separate fixed 22.5 s setting. The UCI clock mode (b) comes later, as its own ticket and
  milestone.
- **Q3:** two new settings, `simple-tournament` (fixed 22.5 s) and `uci-clock-mode`. They may be separate inputs (for
  example their own UCI option rather than a level number). The Architect rules the form.
- **Q4:** simple-tournament's ceiling is 22.5 s.
- **Q5:** the clock mode's per-move ceiling rises to 60 s, from the 32 s clamp.
- **Q6:** no strength reading at 40/15 until the other improvements are done.
- **Q7:** no think time shown in the CLI.
- **Q8:** the measures are accepted: 0 losses on time, closest call ≥ 500 ms, ≥ 75 % clock use per period.

**Tension (my reading; owner may veto):**
- Q4 (ceiling 22.5 s) and Q8 (closest call ≥ 500 ms) together mean simple-tournament's per-move budget must sit below
  22.5 s, so that 40 moves plus overhead fit in 900 s. BA/PM measured that 22.5 s exactly leaves about 50 ms at move 40.
- Delivery reading: the hard ceiling is 22.5 s and is never exceeded. The Architect and BA/PM set the budget T under
  it, so that Q8 holds (BA/PM's arithmetic gives about 22.0 s), and the owner is told the number.

**Routed:**
- `bapm-amend-epic009`: amend the page and tickets to these words.
- `arch-epic009-settings`: ADR amendments for the two settings, their input form, and the 22.5 s and 60 s ceilings.
