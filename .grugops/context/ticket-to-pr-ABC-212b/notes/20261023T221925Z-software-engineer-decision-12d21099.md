---
id: 20261023T221925Z-software-engineer-decision-12d21099
kind: decision
by: software-engineer
at: 2026-10-23T22:19:25Z
verified_by: 
confidence: high on the edits and the measured reds; U3-green-with-A11 UNKNOWN - verify
refs:
  - ABC-212
  - EPIC-004
  - ADR-0045
  - f6e7e9a9
  - 2dba7331
  - grugops/ABC-212
  - bapm-amend-ABC-212/20261023T221502Z-ba-pm-decision-26b36292
  - ticket-to-pr-ABC-212/20261023T220736Z-software-engineer-observation-93ffdad9
  - plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
supersedes: 
seal: sha256:9bca7aaaabe99cb59f48c88da60882a27f559f86c8b19e9247cbf54e79da47f2
---

# ABC-212: licensed pins U1, U2, U4–U8 applied (tests only); npm test reds U3 alone, as ruled

Software Engineer, task `ticket-to-pr-ABC-212b`, branch `grugops/ABC-212` in `../wt-ABC-212`, from `2dba7331`; commit `f6e7e9a9` (tests only). Licence: the page's § Amendment 2026-10-24 item 1 (`bapm-amend-ABC-212/…26b36292`). Not pushed, not merged.

## Edits (exactly the ruling's text; nothing else)
- U1 `src/cli.test.ts:1338`–`:1340`: `TABLE_LEVELS` += `"6", "7"` (still hand-transcribed); comment "five level words" → "seven level words".
- U2 `src/cli.test.ts:1822`–`:1824`: expected `numbersIn("cli-options.ts")` += `"6", "7"`; comment `` `1`-`5` `` → `` `1`-`7` ``, "`3` is also the default level" → "`5` …".
- U3: no edit (goes green with `A11`'s `AGENTS.md` line; the merge carries both).
- U4 `src/cli.test.ts:4465`: regex → `/export type Difficulty = 1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7;/`.
- U5 `src/cli.test.ts:4521`: `A8′` refused key `6` → `8`.
- U6 `src/levels.test.ts:243`–`:251`: rows `6: { budgetMs: 5_000, blunderRate: 0 }`, `7: { budgetMs: 30_000, blunderRate: 0 }` added; frozen loop `:253` unchanged at 1..5; describe title left as is (the ruling's "may" not taken: smallest diff).
- U7 `src/startup-questions.test.ts:250`, `:255`, `:274`: `6` → `8` in title, input and `'"8"'`; rejection count 4 and every other expectation unchanged.
- U8 `src/uci-session.test.ts:717`: `"6"` → `"8"`.
Diff: 4 files, +13/−11. No `src/` production file, `AGENTS.md`, ADR, board or trace touched.

## Gates (worktree, host load1 ≈ 5.7, two other SEs running)
- lint rc 0 (biome, 125 files, no fixes); typecheck rc 0; build rc 0.
- `npm test` rc 1: 62 files, 2 057 tests, 2 056 passed, 1 failed = U3 exactly (`src/cli.test.ts` > ABC-065 … > A3 — the documented option list EQUALS the accepted set). `.test-results/last-run.json`: success false, 2057/2056/1.
- Skip count 0; `test-skip-integrity.js` → `No findings.`, rc 0.
- `CLI_DEEP` 11/11 rc 0; `UCI_DEEP` 5/5 rc 0. `ENGINE_DEEP` not run (QE's, width 1).

## Outcome
No STOP: the only red is U3, which the ruling predicts. Next on this branch: the Scribe's `A11` `AGENTS.md` "Dev / run" line (exactly one `--difficulty 1|2|3|4|5|6|7`, no second list, no new `--` token), after which `npm test` is expected 0 red — `UNKNOWN - verify` until run on that tree.
