---
subtask: ticket-to-pr-ABC-212
role: software-engineer
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/ticket-to-pr-ABC-212/
width: 3 of 3
---

# Build ABC-212: levels 6 (5 s) and 7 (30 s)

## Do
- Worktree `../wt-ABC-212` on `grugops/ABC-212` from `main`, own `npm ci --ignore-scripts`. Never run npm in main's checkout.
- Build exactly to the page and its `## Design ruling` / ADR-0045 amendment: LEVELS rows 6–7, `HARDEST_LEVEL` 7, `HARD_CEILING_MS` 32 000, every surface (flag, usage/missing-value texts, startup question, UCI `Skill Level max` from `HARDEST_LEVEL`), the exact A13 pins + the Architect's four additions. Red-first on the page's plants. Any other existing test that goes red is a STOP back to Architect.
- Gates: lint, typecheck, build; `npm test` + `last-run.json`; skips; `CLI_DEEP`, `UCI_DEEP`. **Do not run `ENGINE_DEEP`** (A4, ~7.5 min of real clock) — it is QE's, width 1. Heap 128 / 400.
- AGENTS.md / runbook edits named by A11 are the Scribe's / Architect's — list what they need, don't edit.

## Fences
- Only the files the page/ruling name. No `package*.json`, ADRs, `AGENTS.md`, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se212/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `ticket-to-pr-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**Built, then STOP to Architect: 8 existing rows outside A13 + ruling 4 go red and were not edited.** Branch `grugops/ABC-212` in worktree `../wt-ABC-212` (own `node_modules`, `npm ci --ignore-scripts`), from `main` `c735577f`. Tip **`2dba7331`**: `8e101313` (code), then `2dba7331` (notes). Not pushed, not merged. Host not quiet (load1 6–10, two Architect hops), so no wall-clock figure here is a reading.

Notes, sealed via `admitAndAppend` with `contextRoot` = the worktree's `.grugops/context`, read back 3/3, in `../wt-ABC-212/.grugops/context/ticket-to-pr-ABC-212/notes/`:
- decision `…e4a87583`: the build to the ruling, the SE's calls, the STOP;
- observation `…f2d7bc56`: red-first, plants, gates, A12 readings;
- observation `…93ffdad9`: the 8 unlicensed rows and the one-line edit each needs.

### STOP: the 8 rows (all mechanical consequences of the accepted spec; none licensed)
| # | row | proposed edit |
|---|---|---|
| U1 | `cli.test.ts:1340` ABC-042 A6(i) `TABLE_LEVELS` | add `"6","7"` |
| U2 | `cli.test.ts` ABC-042 A8 `numbersIn("cli-options.ts")` | add `"6","7"` |
| U3 | `cli.test.ts:2331` ABC-065 A3 (reads AGENTS.md) | none: green when the Scribe's A11 AGENTS.md line lands |
| U4 | `cli.test.ts` ABC-101 A7 `Difficulty` regex | `… 5 \| 6 \| 7;` |
| U5 | `cli.test.ts` ABC-101 A8′ own-key list | `6` → `8` |
| U6 | `levels.test.ts` ABC-174 A1 deep-equal | add rows 6 and 7 |
| U7 | `startup-questions.test.ts:250` ABC-200 A4 | `6` → `8` |
| U8 | `uci-session.test.ts:718` ABC-171 A2 invalid list | `"6"` → `"8"` |
The Architect's probe ran with the clamp only (no `LEVELS[6]/[7]`), which is why these were not seen.

### Per criterion (the SE's share)
| crit | result |
|---|---|
| A1 | **Built, green** (new ABC-212 A1 rows + re-pinned keys/`[1,5,7]`); U6 red pending licence |
| A2 | **Built, green**: `DEFAULT_DIFFICULTY === DEFAULT_LEVEL === 5`, UCI `default 5`; `A8′` unedited and green |
| A3 | owed: QE (50/50 identity, `git archive` base v head) |
| A4 | rows written (`levels.test.ts` ENGINE_DEEP: L6 30 pos 5 000–7 000, L7 10 pos 30 000–32 000, L5 re-pinned to `LEVELS[5]`, ≤ 5 000); **not run**: QE, width 1 |
| A5 | **Built, green**: RF-1 at 32 000 (step `H/2`), clause-B per-level row, R1 refixed; plants red as probed |
| A6 | **Built, green** (6/7 resolve, `8` refused, bare-flag text); U4/U5 red pending licence |
| A7 | **Built, green**: byte-exact usage from the existing `badColour` child, 0 new spawns |
| A8 | **Built, green** (new rows: exact question, 6/7 taken, `8` named, Enter keeps 5); U7 red pending licence |
| A9 | **Built, green**: `max 7`; 0/8 kept with `1-7` text; bare `go` 7→30 000, 6→5 000; movetime 60000→30 000, 1000→1 000; wtime→30 000; depth 3 with score. U8 red pending licence |
| A10 | owed: QE (pty) |
| A11 | owed: Scribe (AGENTS.md "Dev / run", also turns U3 green) and Architect (runbook § Operate) |
| A12 | 0 new files, 0 new spawns; **page tension**: A9's step G÷30 makes ≥ 31 readings unavoidable; measured 32–33 (depth 3: 5). Built to A9 |
| A13 | licensed pins edited only (list in decision note); `ladder.test.ts` untouched |
| A14 | P1–P5 each red at least one target row at head (P2's A4 half is ENGINE_DEEP, QE) |
| A15 | owed: Security/NFR or QE |

**Gates:** lint rc 0; typecheck rc 0; build rc 0; `npm test` rc 1: 62 files, 2 057 tests, 2 049 passed, 8 failed = U1–U8 exactly (`last-run.json` `success` false); base was 62/2 038 green; skips 0 → `No findings.`; `CLI_DEEP` 11/11; `UCI_DEEP` 5/5. `ENGINE_DEEP` not run.

Files: `src/levels.ts` +16/−9, `src/engine.ts` +18/−13, `src/cli-options.ts` +10/−7, `src/cli.ts` +1/−1, `src/uci-session.ts` +18/−7, `src/levels.test.ts` +127/−24, `src/uci-session.test.ts` +79/−6, `src/startup-questions.test.ts` +38/−1, `src/cli.test.ts` +27/−8, `src/engine.test.ts` +7/−5, `src/cli.real-engine.test.ts` +7/−5, `src/uci.real-engine.test.ts` +5/−3.

### Trace row
| ABC-212 (ticket-to-pr-ABC-212) | levels 6 (5 s) and 7 (30 s), rate 0, at every surface; default stays 5 | EPIC-004 | — | ADR-0045 § AMENDMENT 2026-10-24 (shape (i), clamp 32 000); ADR-0044 D5 latency accepted; NFR-004 per-level ceiling (catalog text: Security/NFR) | grugops/ABC-212 @ 2dba7331 (code 8e101313)<br>src/levels.ts, engine.ts, cli-options.ts, cli.ts, uci-session.ts; tests: levels, uci-session, startup-questions, cli, engine, cli.real-engine, uci.real-engine; .grugops/context/ticket-to-pr-ABC-212/notes/ (3) | red-first + P1–P5 + RF-1/R1 plants red; lint/typecheck/build 0; npm test 2049/2057 (8 = STOP rows); CLI_DEEP 11/11; UCI_DEEP 5/5; skips 0, No findings. | owed (production lines; QE verdict signs) | — | In Development (STOP: 8 unlicensed rows → Architect; then QE A3/A4/A10, Sec/NFR A15/NFR-009, Scribe+Architect A11) |
