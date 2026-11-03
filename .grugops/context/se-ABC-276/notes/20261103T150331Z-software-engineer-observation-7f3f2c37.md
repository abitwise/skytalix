---
id: 20261103T150331Z-software-engineer-observation-7f3f2c37
kind: observation
by: software-engineer
at: 2026-11-03T15:03:31Z
verified_by: 
confidence: medium
refs:
  - ABC-276
  - ADR-0049
  - tools/rating/pair.ts
  - tools/rating/rating.ts
supersedes: 
seal: sha256:6c796c46c8890ebc87b552defffeb3eda83570bdc3d9a157913ca7f9be3487ce
---

# SE observation, se-ABC-276: a user or host name that equals a placeholder word is substituted again (inherited from rpair, LOW)

- `redact`'s word pass replaces a whole-word user or host name (≥ 3 chars) even inside a placeholder: the `<` and `>` around it are not in `[\w.-]`. If the user or host is named `home`, `repo`, `out`, `node`, `user` or `host`, a placeholder such as `<home>` becomes `<<home>>`. machine.txt and cmd.txt are redacted twice (on write, then in the sealing step), as rpair's machine.txt and summary.txt already were.
- No path leaks either way, and the sums stay right because they are taken after the last pass. Only the placeholder text would look odd. Not fixed here: it is pair.ts behavior, which is out of this ticket's scope. A follow-up could skip matches that are already a placeholder.
