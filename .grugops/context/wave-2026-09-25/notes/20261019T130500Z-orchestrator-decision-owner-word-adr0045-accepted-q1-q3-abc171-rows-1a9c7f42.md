---
type: decision
role: orchestrator
task: wave-2026-09-25
at: 2026-10-19T13:05:00Z
sealed: false
refs: [ADR-0045, ABC-087, ABC-085, ABC-101, ABC-171, ABC-174, ABC-175]
---

# Owner word, 2026-10-19: ADR-0045 accepted (Q1–Q3); add the QE-171-a..d rows

The owner gave three menu answers, recorded here verbatim:

- **Q1:** "Default = level 5 (Recommended)". Accept ADR-0045 as proposed:
  - `LEVELS` is 100/0.4, 180/0.2, 330/0.1, 1000/0.05, 3000/0.
  - `DEFAULT_LEVEL` moves from 3 to 5, and plays exactly as today.
  - This overturns ABC-101 ruling 2. That ruling was the owner's to reserve, and he has now ruled.
- **Q2:** "Yes, 0.1 / 0.05 (Recommended)". The blunder rates at levels 3 and 4 stand.
- **Q3 + ABC-171:** "Verdict before UAT; add rows (Recommended)".
  - The ~5.5 h verdict re-take runs on ABC-174's branch after QE passes it, before the owner's UAT word. It runs overnight at width 1.
  - The four LOW rows QE-171-a..d are added to ABC-171.

**ADR-0045 is ACCEPTED by this word.** BA/PM records the status, cuts ABC-174 (the build) and ABC-175 (the re-take), and rewords ABC-171 A8 for QE-171-b.
