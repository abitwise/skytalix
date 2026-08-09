---
id: 20260809T213847Z-software-engineer-observation-12f02b0d
kind: observation
by: software-engineer
at: 2026-08-09T21:38:47Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - src/legal.ts
  - src/legal.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# Every `A11` line citation below the edits has moved, and here is the map

The corrected paragraphs are longer than the ones they replace, so this hop **invalidated `A11`'s own
line numbers** for everything below each edit. That is a side effect of the criterion being carried
out, not a defect in it — but this board has already been bitten once on this ticket by a citation
pointing at the wrong line (`102-104` invited an edit to the true sentence at 104-105), so the drift
is measured and published rather than left to be re-discovered.

**`A11` was NOT edited to follow these** — `## Acceptance` is BA/PM's and the brief forbids it. The
map is recorded here and in the ticket's `## Implementation`.

```
src/legal.ts
  site 3  (the corrected paragraph)         69-70    ->  68-77   (rewritten, now 10 lines)
  site 2  "(a) buys the ANSWER" comment      102     ->  107
  FENCED  "Purity does NOT need it"        108-109   ->  113-114
          "(b) buys PURITY"                  110     ->  115

src/legal.test.ts
  site 4                                   268-269   ->  267-272
  site 5                                   368-371   ->  370-375
  site 6                                   373-374   ->  377-379
  FENCED  "Each one corrupts …"            279-280   ->  282-283
  FENCED  "reads an occupied ep target …"  286-289   ->  289-292
  out of remit  "the second FEN (ABC-009)"   202     ->  202  (above every edit; unmoved)
```

Anyone verifying `A11` from the ticket's table should use this map or, better, match on the
sentences — `A11` quotes each of them, and a quote does not go stale when a paragraph above it
grows. The same is true for QE: **the citations are the fragile part of the criterion, the quoted
text is not.**
