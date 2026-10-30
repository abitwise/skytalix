---
subtask: se-ABC-220-main
role: software-engineer
ticket: ABC-220
ref: .grugops/context/se-ABC-220-main/
branch: grugops/ABC-220 @ 8f444cc4 (worktree .claude/worktrees/se-ABC-220); bring main a649fbc4 in by MERGE (no rebase)
width: shared, NO timed reads
---
# SE ABC-220: take main (ABC-241 merged, also edits src/uci-session.ts) into the branch
## Do
- `git merge a649fbc4` into grugops/ABC-220. Resolve src/uci-session.ts and its test so BOTH hold: ABC-241's repetition-key
  prior keys (ADR-0020 § AMENDMENT 2026-10-30; gameend.ts import) and ABC-220's TimeMode (ADR-0052). Keep ABC-241's
  rows and yours; re-pin only where both changed the same pinned text, and say which.
- Architect's ruling (arch-ABC-220-a14, now on main): A14a = the lane row your code already asserts; confirm, no new code
  unless a row disagrees with the ruling's list.
- Gates via `npm run …`: lint, typecheck, unit, build; npm test count (expect ≈ 2 271 + 26).
## Fences
No other changes. Never push, force, amend, rebase, or merge into main. No board edits. Never bare `npx`/`npm exec`.
No timed reads (A11/A12/A14b are QE's ALONE). No host paths. Scratch `se-220-main/`.
## Publish
Sealed notes (task `se-ABC-220-main`, contextRoot = worktree), commit on the branch, `## Result` + trace row here, brief + claim to done/.

## Result

**2026-10-30, Software Engineer. Done to the brief's limits. Merge commit `9ac8b365` on `grugops/ABC-220` (from `8f444cc4` + main `a649fbc4`, by MERGE). The notes and this brief follow in the next `docs(se-ABC-220-main)` commit. Not merged to main, nothing pushed, no force, amend or rebase. No timed reads.**

- **Conflicts: none.** `src/uci-session.ts` and its test auto-merged. ABC-241 owns the `parsePosition` repetition keys and the `./gameend.ts` import; ABC-220 owns TimeMode, `parseGo` and `go`. They are on different lines and both hold (decision `…e8a008f6`).
- **Re-pins: none.** No pinned text was changed by both sides. ABC-241's A8 import pin holds because ABC-220 added no session import. All ABC-241 rows and all ABC-220 rows are kept.
- **A14a: confirmed, no new code.** Every item on arch-ABC-220-a14's list is asserted by the `UCI_DEEP` A14 rows in `src/uci.real-engine.test.ts`. A14b, A11 and A12 are QE's, run ALONE, and were not run here.
- **Gates** (observation `…837206e7`): `npm run lint`, `typecheck` and `build` exit 0. `npm test`: 63 files, **2 297 passed** (= 2 271 + 26), 0 failed, 0 skipped. There is no `unit` script; `npm test` is the unit run.
- **Diff check:** `git diff a649fbc4 9ac8b365 -- src` = ABC-220's three files only, the same counts as `68ba364c`.
- **Findings:** none new. Info: BA/PM still owes `ADR-0044` D5's simple-tournament fold line (from arch-ABC-220-a14).
- STOP: none.

### Trace row (10 cells, header order)

| ABC-220 | `simple-tournament` over UCI (`TimeMode` combo), now on top of main `a649fbc4` (ABC-241's repetition-key prior keys); T = 22 000 ms = its ceiling; `min(x, T)`, `min(T, C)`, T | EPIC-009 | ADR-0052 (D1–D3, D7–D9; amended 2026-10-30, A14a/A14b split); ADR-0020 § AMENDMENT 2026-10-30 | NFR-004 22 s (A6 exact, A11 unrun); ADR-0044 D5 ≤ 22 s, A13 green, A14a written, A14b QE probe; NFR-008 A12 structural, wall unread | grugops/ABC-220 @ 9ac8b365 (merge): src/uci-session.ts | src/uci-session.test.ts, src/uci.real-engine.test.ts (A14a deep unrun); npm test 63 files / 2 297 pass, skips 0 | — (UAT owed; QE verdict signs) | — | In Review (branch, not merged; A11/A14b/A12 wall pending QE) |
