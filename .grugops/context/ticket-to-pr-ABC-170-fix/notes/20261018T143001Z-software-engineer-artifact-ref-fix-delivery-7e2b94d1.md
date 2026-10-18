---
id: 20261018T143001Z-software-engineer-artifact-ref-fix-delivery-7e2b94d1
kind: artifact-ref
by: software-engineer
task: ticket-to-pr-ABC-170-fix
at: 2026-10-18T14:30:01Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-170-fix
  - ABC-170
  - QE-170-a
supersedes:
---

# ABC-170 fix delivery: branch `grugops/ABC-170`, merge `025a6bef`, code `52f504f6`

This note is hand-authored and unsealed. The branch is not pushed and not merged.

- **Merge:** `git merge --no-ff main` (main `acfdbeb3`) gives `025a6bef`. It was clean, with no conflicts.
- **Code:** `52f504f6`. Only `src/engine.test.ts` changed (+10/-6), and only inside the `ABC-170 A3` describe. `src/engine.ts` is untouched.
- **Row durations:** these are the vitest-reported durations from the JSON reporter, not NFR readings.
  - Before, as one row isolated (`-t "ABC-170 A3"`, merged tip `025a6bef`): 2 742 ms.
  - After, isolated: 522 / 382 / 310 / 450 / 512 / 507 ms (startpos, kiwipete, position-3..6), 2 683 ms summed.
  - After, in the full `npm test` lane: 644 / 559 / 473 / 508 / 718 / 598 ms.
- **Gates at `52f504f6`:**
  - lint 0, typecheck 0, build 0.
  - `npm test`: exit 0 on the first run, 58 files, 1844/1844. The count is 1839 + 5, because one row became six.
  - `last-run.json` reads success true, numTotalTests 1844, numPassedTests 1844, failed 0, pending 0, todo 0.
  - `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.` and exited 0.
- **Remaining:** A6 (`NFR-005`) is OPEN. QE-170-b..g go to BA/PM as follow-ups.
