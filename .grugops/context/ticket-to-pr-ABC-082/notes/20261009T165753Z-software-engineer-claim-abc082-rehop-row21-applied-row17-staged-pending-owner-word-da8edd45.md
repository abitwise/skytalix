---
id: 20261009T165753Z-software-engineer-claim-abc082-rehop-row21-applied-row17-staged-pending-owner-word-da8edd45
kind: claim
by: software-engineer
at: 2026-10-09T16:57:53Z
verified_by:
confidence: UNKNOWN - verify
refs:
  - ABC-082
  - ABC-079
  - ABC-081
  - ADR-0028
  - src/quiescence.test.ts
  - src/transposition.test.ts
  - 20261009T164755Z-architect-design-decision-what-the-engineer-changes-what-ba-pm-folds-owner-word-owed-33e5e0a3
supersedes:
---

# Re-hop: row 21 applied, row 17 staged as a separate tip commit pending the owner's word, row 8 untouched

Hand-authored, no `seal`. A claim, not a finding: no `§14-gate` verdict exists on this install.

- **Row 21** (`…f0115510`): `src/quiescence.test.ts` `:208` and `:220` now carry the ruled FENs
  (+ black g7 / mirror + white g2), plus a two-line pointer comment. Names, `losing` moves and
  `Math.floor(HANGING_CORPUS.length / 20)` are unchanged.
- **Row 17** (`…8c0fee21`): one commit at the branch tip, subject `test(ABC-081): PENDING OWNER
  WORD — …`. It touches only `src/transposition.test.ts`: `0.15` → `0.1` twice, the describe text
  becomes "at least 10%", and the two A2 comments carry the readings and an `ADR-0028` pointer.
  **A refusal is `git revert <tip>`.**
- **Row 8** (`…4fdb96bc`): nothing.
- **Not verified here:** the 370 / 280 cp margins and position-3's 16.22% are the ruling's
  measurements, cited, not re-measured. The default-lane position-3 row only asserts `≥ 0.1`, and
  it prints nothing.
- **Not done (fenced to BA/PM / Orchestrator):** `ABC-082` / `ABC-081` / `ABC-079` / `ABC-083`
  criteria folds, board, `ADR-0028` status.
