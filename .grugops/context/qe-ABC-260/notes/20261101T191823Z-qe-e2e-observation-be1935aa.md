---
id: 20261101T191823Z-qe-e2e-observation-be1935aa
kind: observation
by: qe-e2e
at: 2026-11-01T19:18:23Z
verified_by: 
confidence: high for the survivals (each plant run; raw/plants-tip/*.diff); medium for severity and remedies (QE judgement; today's exposure probed as text counts on the six files)
refs:
  - qe-ABC-260
  - ABC-260
  - EPIC-010
  - ADR-0056
  - R-TC
  - QE-259-a
  - QE-259-b
  - ABC-259
  - ABC-087
  - grugops/ABC-260
  - grugops/qe-ABC-260
  - 524b7949
  - 040f7f26
  - 64c7e829
  - src/levels.test.ts
  - QE-260-a
  - QE-260-b
  - QE-260-c
  - QE-260-d
  - QE-260-e
  - ABC-251
  - BA/PM
  - Q8
  - Q9
  - Q11b
supersedes: 
seal: sha256:97afafca92d9b3ee0a69d87061bf295a4b8f385bcf2abe7475e2d1782438217d
---

# qe-ABC-260 gaps: QE-260-a LOW (regex literals), QE-260-b LOW (backtick inside ${}), QE-260-c/d/e INFO

- **QE-260-a (LOW, outside the ticket's scope; carrier BA/PM, or a review note on ABC-251).** A regex literal can still hide code: a quote inside it flips the string pairing so a later string's `//` reads as a comment (Q8), and `\/\/` inside it reads as `//` (Q9). 0 regex literals in the six files today. Remedy if wanted: a guard row that fails on any regex literal in the six files, or a tokenizer that knows regex literals.
- **QE-260-b (LOW, the SE's declared limit).** A template literal whose `${}` holds a backtick closes early and can hide the rest of its line (Q11b). The five core files hold no template literal; levels.ts holds one, without `${}`. Remedy as QE-260-a.
- **QE-260-c (INFO, accepted).** A4's second clause: the levels.ts plant fails A8's argv row, whose message prints the stripped source and the regex, not "src/levels.ts". The row reads only src/levels.ts and its describe names the level module, and A7 forbids changing A8's `expect(`. QE accepts the row identity as naming the file. For BA/PM: future criteria that freeze an `expect(` line should not also demand a message that line does not print.
- **QE-260-d (INFO).** The added comment cites `A8` beside the A7 list (as QE-259-d). Nothing to change.
- **QE-260-e (INFO, regression risk).** Because literals are kept and `process` is now whole-word, a future string in a core file containing the word "process" (an error message, say) turns the env row red. It fails loud, never silent; 0 such strings today.
- **None blocks:** each sits outside the ticket's literal criteria or is accepted wording.
