---
id: 20261017T150100Z-software-engineer-decision-header-placement-a1560002
kind: decision
by: software-engineer
at: 2026-10-17T15:01:00Z
verified_by:
confidence: medium
refs:
  - ticket-to-pr-ABC-156
  - ABC-156
supersedes:
---

# Row edit kept in place, and the header has no blank separator

- Row `:28` was edited in place. The figures and clauses the criteria name were replaced: the total, 017, 019,
  the last-ten moves with a one-clause method, and the "off by one" sentence, which now points to the register.
  One correction clause was appended to the Period cell, and the original method text was kept. Nothing else in
  the row changed. The "3/10" in the `Gate pass rate` row is out of scope and still holds (022, 023 and 013 have 0 moves).
- `A5` allows exactly one added `_Updated:` line. A blank separator would be a second added line, so the new
  header sits directly on the old one, and in rendered Markdown the two run together. If QE prefers the blank
  line, `A5` has to allow it.
