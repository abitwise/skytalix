---
id: 20261025T031013Z-software-engineer-decision-2e24ed24
kind: decision
by: software-engineer
at: 2026-10-25T03:10:13Z
verified_by: 
confidence: high (gates run at the tip by the SE)
refs:
  - ABC-217
  - EPIC-008
  - QE-206-a
  - QE-206-b
  - QE-206-e
  - SEC-206-a
  - QE-212L-a
  - NFR-001
  - NFR-008
  - plans/tickets/ABC-217-the-abc-206-and-abc-212-guards-see-discovered-checks-in-module-rebuilds-and-the-session-clock.md
  - qe-ABC-206/…809cd42a
  - qe-lane-ABC-212/…db746b16
  - security-nfr-note-ABC-206/…322a594a
  - grugops/ABC-217
  - 476c9f63
  - a98bfc32
  - owner-q4/…5c8e2a17
supersedes: 
seal: sha256:6e03715bb51a73a4c7d512f08b785a42889550b8a0086b4904998db527c20773
---

# ABC-217 tip gates, scope and the gameend.ts comment-only proof

Software Engineer, task `ticket-to-pr-ABC-217`, `grugops/ABC-217`, code `a98bfc32` on `main` `476c9f63`.

- **A5:** `git diff --name-only 476c9f63 a98bfc32 -- src tools package.json package-lock.json` lists exactly `src/gameend.nfr.test.ts`, `src/gameend.ts`, `src/legal.test.ts`, `src/uci-session.test.ts` (+67 -9). Every `-` line is a replaced import (2 in gameend.nfr, 1 in legal.test), the NFR-001 describe title, the `rig` return line and the `budgetAt` destructure; no row removed, no expectation weakened.
- **A6:** `git diff -U0` of `src/gameend.ts` is one hunk `@@ -17,3 +17,3 @@` inside the header block (lines 1-20); all 6 `+`/`-` lines start with ` *` (0 that do not). `ts.transpileModule(..., { removeComments: true }).outputText` is byte-identical at base and tip (2 994 bytes, sha256 prefix `f5ecc1e294afce9e` both). UAT waiver expected under `…5c8e2a17`; the QE verdict decides.
- **A7 at the tip:** lint clean (125 files); typecheck rc 0; build rc 0; `npm test` rc 0, 62 files, **2 075 passed** = base 2 073 + 2 new rows, `last-run.json` success true / failed 0 / pending 0 / todo 0; Duration 7.32 s (base 7.14 s; load1 4.0, not a reading); `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` printed `No findings.`; `lane-inventory.js` rc 0 (62 collected = 62 tracked).
- **NFR-008:** no file, spawn or real-clock read added. The Duration line is a gate output, not a timing reading; the merge sentinel is the Orchestrator's.
- **No STOP:** nothing red outside scope; no production line changed.
