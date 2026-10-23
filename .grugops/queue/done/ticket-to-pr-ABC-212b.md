---
subtask: ticket-to-pr-ABC-212b
role: software-engineer
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/ticket-to-pr-ABC-212b/
branch: grugops/ABC-212 (2dba7331), same worktree ../wt-ABC-212
width: 3 of 3
---

# ABC-212: apply the licensed pins U1, U2, U4–U8 (tests only)

## Do
- On `grugops/ABC-212` in `../wt-ABC-212`: apply exactly the edits in the page's § Amendment 2026-10-24 for U1, U2, U4, U5, U6, U7, U8 (tests and their comments only). U3 needs no edit; it goes green when the Scribe's A11 AGENTS.md line lands (next hop on this branch).
- Gates: lint, typecheck, build; `npm test` → expect U3 the only red; skips; `CLI_DEEP`, `UCI_DEEP`. Any other red → STOP to BA/PM.

## Fences
- Tests only. No `src/` production files, `AGENTS.md`, ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se212b/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `ticket-to-pr-ABC-212b`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**Done, no STOP.** U1, U2 and U4–U8 applied exactly as § Amendment 2026-10-24 item 1 spells them, in tests only. `npm test` reds U3 alone, as the ruling predicts. Branch `grugops/ABC-212` in `../wt-ABC-212`, from `2dba7331`. Tip **`73339912`**: `f6e7e9a9` (tests), then `73339912` (note). Not pushed, not merged.

Note, sealed via `admitAndAppend` with `contextRoot` = the worktree's `.grugops/context`, read back 1/1: decision `20261023T221925Z-software-engineer-decision-12d21099` in `../wt-ABC-212/.grugops/context/ticket-to-pr-ABC-212b/notes/`.

| # | edit applied |
|---|---|
| U1 | `cli.test.ts:1340` `TABLE_LEVELS` += `"6", "7"`; `:1338` "five" → "seven" |
| U2 | `cli.test.ts:1824` expected += `"6", "7"`; comment `1`-`5` → `1`-`7`, default `3` → `5` |
| U3 | no edit (green with `A11`'s `AGENTS.md` line; the merge carries both) |
| U4 | `cli.test.ts:4465` regex → `… 5 \| 6 \| 7;` |
| U5 | `cli.test.ts:4521` refused key `6` → `8` |
| U6 | `levels.test.ts` rows 6 (5 000/0) and 7 (30 000/0) added; frozen loop 1..5 and title unchanged |
| U7 | `startup-questions.test.ts:250`, `:255`, `:274` `6` → `8`; count 4 unchanged |
| U8 | `uci-session.test.ts:717` `"6"` → `"8"` |

**Gates:** lint rc 0; typecheck rc 0; build rc 0; `npm test` rc 1: 62 files, 2 057 tests, 2 056 passed, 1 failed = U3 (`ABC-065` … `A3 — the documented option list EQUALS the accepted set, both ways, and names every value`), `last-run.json` success false; skips 0 → `No findings.`; `CLI_DEEP` 11/11; `UCI_DEEP` 5/5. `ENGINE_DEEP` not run (QE's). Host load1 about 5.7, with two other SEs running.

Files: `src/cli.test.ts` +7/−7, `src/levels.test.ts` +2/−0, `src/startup-questions.test.ts` +3/−3, `src/uci-session.test.ts` +1/−1; `.grugops/context/ticket-to-pr-ABC-212b/notes/` (1). Not touched: `src/` production files, `AGENTS.md`, ADRs, board/trace, the remote.

**Next:** the Scribe's `A11` `AGENTS.md` "Dev / run" line on this branch. With it, `npm test` is expected to show 0 red (`UNKNOWN - verify` until run on that tree).

### Trace row (10 cells, header order)

| ABC-212 (ticket-to-pr-ABC-212b) | levels 6 (5 s) and 7 (30 s), rate 0, at every surface; default stays 5 — licensed pins U1, U2, U4–U8 applied (tests only) | EPIC-004 | — | ADR-0045 § AMENDMENT 2026-10-24; A13 + § Amendment 2026-10-24 item 1 (…26b36292); note …12d21099 | grugops/ABC-212 @ 73339912 (tests f6e7e9a9)<br>src/cli.test.ts, levels.test.ts, startup-questions.test.ts, uci-session.test.ts; .grugops/context/ticket-to-pr-ABC-212b/notes/ (1) | lint/typecheck/build 0; npm test 2056/2057 (1 = U3, as ruled); CLI_DEEP 11/11; UCI_DEEP 5/5; skips 0, No findings. | owed (production lines; QE verdict signs) | — | In Development (U3 waits on Scribe A11 AGENTS.md line; then QE A3/A4/A10, Sec/NFR A15/NFR-009, Architect runbook) |
