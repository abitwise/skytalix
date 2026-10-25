---
subtask: qe-ABC-217
role: qe-e2e
ticket: plans/tickets/ABC-217-the-abc-206-and-abc-212-guards-see-discovered-checks-in-module-rebuilds-and-the-session-clock.md
ref: .grugops/context/qe-ABC-217/
branch: new grugops/qe-ABC-217 from grugops/ABC-217 (5212a4bd), worktree ../wt-qe-ABC-217
width: 3 of 3 (beside qe-fix-ABC-204, qe-ABC-216; no real-clock timing)
---

# QE gate for ABC-217 (test hardening)

## Do
- Merge current `main` into your branch first (report sha); own `npm ci --ignore-scripts`.
- Verify A1–A7 independently; re-run the four plants yourself (P-a, P-b1, P-b2, Q1) in scratch copies, red at tip and the P-a gap green at base; confirm A6 (`src/gameend.ts` comment-only, stripped output identical) and A5 (exactly four files; no row removed, no expectation weakened).
- Gates: lint, typecheck, build, `npm test` + `last-run.json`, skips. No real-clock searches (keep Q1 off the ABC-167 real-clock rows). Verdict; UAT (waiver if A6 holds).

## Fences
- Only your worktree and `<scratchpad>/qe217/`. No `src/` edits. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task qe-ABC-217). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**QE/E2E, 2026-10-25. Verdict: PASS.** Branch `grugops/qe-ABC-217` @ `b63a4d0a` (merge of `main` `e9cc0a99` into `5212a4bd` = `9d04cb91`, no conflict), worktree `../wt-qe-ABC-217`, own `npm ci --ignore-scripts`. `<base>` = `476c9f63`. Plants and probes in `<scratchpad>/qe217/` only; nothing planted committed; no `src/` edit.

- **A1 MET:** both discovered-check fixtures in the `givesCheck` depth-1 row (legal, `FLAG_NONE`, gives check, `givesCheck` true; every legal move make/isInCheck/unmake + unchanged). **P-a** (QE's own form) tip full lane: 1 red of 2 075 (`givesCheck(p, m) equals make, …`); **base full lane 62 files 2 073 / 2 073 green** (gap closed). Probe: each fixture alone reds P-a.
- **A2 MET:** `hasLegalMove` start = 1 makeMove; `legalCaptures` kiwipete = N = 8, 0 < N < pseudo count. **P-b1** 1 red (`hasLegalMove … EXACTLY one move`, 20 v 1); **P-b2** 1 red (`legalCaptures on kiwipete …`, 48 v 8); both full tip lane. Probe: both green at base.
- **A3 MET:** all 6 budget-read rows assert `toBe(now)` via `budgetAt`. **Q1** (`-t "ABC-212 A9"`, off the ABC-167 real-clock rows): 2 red (`go movetime 60000 at 7`, `go movetime 1000 at 7`), 7 green, 128 filtered. Probe: green at base.
- **A4 MET:** `grep -c` 0 / 0; comment names `leafEndReason` (ABC-206); describe at `:68` changed its title only.
- **A5 MET:** exactly the four files (+67 −9); all 9 `-` lines read (imports, title, 3 comment lines, `rig` return, `budgetAt` destructure); nothing removed or weakened.
- **A6 MET:** one hunk `@@ -17,3 +17,3 @@` in the header, 6/6 lines ` *`; stripped `transpileModule` output byte-identical (2 994 bytes, sha256 `f5ecc1e294afce9e…` both).
- **A7 MET:** lint 0 (125 files), typecheck 0, build 0; `npm test` rc 0, 62 files, **2 075 passed** (base 2 073 + 2), `last-run.json` success / failed 0 / pending 0 / todo 0, **Duration 7.88 s** (load1 7.6 → 9.0, foreign vitest processes: 2; not a reading); skips 0, `test-skip-integrity.js` `No findings.`; `lane-inventory.js` rc 0 (62 = 62).
- **Findings:** QE-217-a **INFO** (`toBe(now)` would pass vacuously if the rig's `now` were ever undefined; today it is a function and Q1 bites). No blocking, HIGH, MEDIUM or LOW finding.
- **UAT: WAIVED** under the owner's Q4 word (`…5c8e2a17`): A6 holds. Security/NFR: no hop triggered (no `package*` change, no runtime import edge).
- **Notes** (`../wt-qe-ABC-217/.grugops/context/qe-ABC-217/notes/`, sealed, read back, `validate` clean): `…2123e5e6` (plants, probes), `…9760856b` (gates, A5, A6), verdict `…67c59112`.

**Trace row** (for the Orchestrator):

| ABC-217 (qe-ABC-217) | QE: PASS at merge 9d04cb91; A1–A7 MET; P-a red at tip, green at base 2073/2073; P-b1/P-b2 1 red each; Q1 2 red (A9 filter) | EPIC-008 | default-lane guards for discovered checks, in-module rebuilds, the session clock; two stale gameStatus texts reworded (QE-206-a/-b/-e, SEC-206-a, QE-212L-a) | NFR-001 (comment only, stripped output identical), NFR-008 (npm test 7.88 s, not a reading); QE-217-a INFO | grugops/qe-ABC-217 @ b63a4d0a (merge 9d04cb91)<br>src/legal.test.ts, src/gameend.nfr.test.ts, src/uci-session.test.ts, src/gameend.ts (comment)<br>.grugops/context/qe-ABC-217/notes/ (3) | +2 rows (62/2075 = base 2073 + 2); lint/typecheck/build 0; skips 0 No findings.; lane-inventory 0 | WAIVED under …5c8e2a17 (A6 holds) | none | In Review → Orchestrator's call |
