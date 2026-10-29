---
id: 20261029T063212Z-orchestrator-decision-0bacc1dd
kind: decision
by: orchestrator
at: 2026-10-29T06:32:12Z
verified_by: 
confidence: high
refs:
  - EPIC-008
  - qe-epic008-close/…bdbccbbf
  - qe-epic008-close/…e8d5c13a
  - qe-epic008-close/…f361ab33
  - qe-epic008-close/…ffb593fe
  - bapm-close-EPIC-008
supersedes: 
seal: sha256:e04091214c145e8117df1c5bf3d7ba6093359892763b5cdd07fd179aaba08098
---

# qe-epic008-close PASS merged; EPIC-008 step 4 routed to BA/PM

**Verified by the Orchestrator from the raw files (not from the summary):**
- r1, `3497aad2…`: `UCI_Elo=1910`, 100 rounds × 2 games. The result line reads "Score of skytalix vs stockfish: 146 - 47 - 7 [0.748] 200" and "Elo difference: 188.5 +/- 54.8".
- r2, `38536a34…`: `UCI_Elo=1910`, 100 rounds × 2 games. The result line reads "Score of skytalix vs stockfish: 125 - 66 - 9 [0.647] 200" and "Elo difference: 105.6 +/- 49.5".
- Both tool pins read `= pin` before game 1 of each reading. The QE branch holds no `src/`, `tools/` or `data/` change.

**M1 inputs:**
- R(baseline) = 2 098.5 ± 54.8 and R(close) = 2 015.6 ± 49.5.
- M1 = **−82.9 ± 73.8**, interval [−156.7, −9.1], **wholly below 0**.
- Grading is BA/PM's (step 4).

**Delivery calls:**
- Merge `grugops/qe-epic008-close` (records).
- Route `bapm-close-EPIC-008`: grade M1–M4 and write the epic close. Record the confounds (fixed order, back-to-back runs, 82–87 °C, throttling UNKNOWN) as facts, not excuses.
- Any re-read or investigation is a question for the owner. Under `…4c3f7639`, a re-run is his word.
- Width 1/3. No real-clock work is queued.
