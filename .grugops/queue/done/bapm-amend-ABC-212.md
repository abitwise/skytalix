---
subtask: bapm-amend-ABC-212
role: ba-pm
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/bapm-amend-ABC-212/
width: 3 of 3 (records only)
---

# Amend ABC-212: license pins U1–U8 and fix the A12/A9 contradiction

## Do
- Read the SE's STOP (`…93ffdad9`) and the eight rows U1–U8 with their proposed edits. For each, rule: a direct, value-only consequence of the owner-accepted spec (levels 6–7 exist; refused boundary 0/6 → 0/8) → add to A13's licensed list with the exact edit; anything that is not → say why (STOP to Architect). U3 needs no test edit; it passes when the Scribe's A11 AGENTS.md line lands, so the merge must carry both.
- Re-word A12 vs A9 (clock-reading count): the SE measured 32–33 readings per search at A9's step; pick the wording that keeps A9's intent.
- A dated amendment block on the page (old text visible). No requirement or bound moves; if one would, STOP to the Orchestrator.

## Fences
- Worktree `../wt-bapm-amend-ABC-212` from `main`. Only the ABC-212 page and your notes. No `src/`, tests, ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm212a/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `bapm-amend-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result (ba-pm, 2026-10-23T22:15Z UTC): **SE STOP ruled. All eight rows U1–U8 are licensed into `A13` with exact edits, and none goes to the Architect. U3 needs no test edit, and the merge must carry `A11`'s `AGENTS.md` line. `A12` is re-worded to follow `A9`'s step, and `A9` stands. No requirement or bound moves. No STOP.**

Records only, on `grugops/bapm-amend-ABC-212` in `../wt-bapm-amend-ABC-212`, cut from `main` `268ff42a`. Main had moved past `4531898d` by the ABC-206 design merge, and the ABC-212 page was unchanged by it. Tip **`ecd00a89`**, one commit, not merged and not pushed. Each row was read at `grugops/ABC-212` `2dba7331` with `git show`, and the SE worktree was not touched. No test, probe or timing ran. The only scratch used is `…/scratchpad/bapm212a/`.

Notes in `.grugops/context/bapm-amend-ABC-212/notes/` were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend`, with the worktree's `.grugops/context` as the explicit context root. Both were read back through `readContext` (2/2):
- `20261023T221456Z-ba-pm-observation-19232445`: each row as read in the code, the forward scan, and the A12 v A9 arithmetic;
- `20261023T221502Z-ba-pm-decision-26b36292`: the rulings.

| # | row (at `2dba7331`) | ruling and exact edit |
|---|---|---|
| U1 | `cli.test.ts:1340` `ABC-042` `A6(i)` | licensed: `TABLE_LEVELS` gains `"6", "7"` and stays hand-transcribed; comment `:1338` "five" → "seven" |
| U2 | `cli.test.ts:1824` `ABC-042` `A8` | licensed: expected `numbersIn("cli-options.ts")` gains `"6", "7"`; comment `1`-`5` → `1`-`7`, and the stale "`3` is also the default level" → "`5`" |
| U3 | `cli.test.ts:2331` `ABC-065` `A3` | licensed, no test edit. Green when `A11`'s `AGENTS.md` line lands, and the merge carries both. That line must hold exactly one `--difficulty 1\|2\|3\|4\|5\|6\|7` run, with no second `--difficulty` list and no new `--` token |
| U4 | `cli.test.ts:4465` `ABC-101` `A7` | licensed: the regex gains `\| 6 \| 7` before `;` |
| U5 | `cli.test.ts:4521` `ABC-101` `A8′` | licensed: refused key `6` → `8` |
| U6 | `levels.test.ts:243`–`:251` `ABC-174` `A1` | licensed: add `6: { budgetMs: 5_000, blunderRate: 0 }` and `7: { budgetMs: 30_000, blunderRate: 0 }`; the frozen loop `:253` is unchanged |
| U7 | `startup-questions.test.ts:250`, `:255`, `:274` `ABC-200` `A4` | licensed: `6` → `8` in the title, the input and `'"6"'` |
| U8 | `uci-session.test.ts:717` `ABC-171` `A2` | licensed: `"6"` → `"8"` |

**A12 (re-worded; A9 stands).** Old: "≤ 30 clock readings per search". New: a level-6/7 default-lane search on the virtual clock uses a step no finer than `A9`'s (⌊G ÷ 30⌋ ms) and reads the clock **at most ⌈G ÷ step⌉ + 3 times**. That is 33 at G ÷ 30 exactly and 34 at a floored step. A search that stops early reads fewer, and 0 files, 0 spawns and no real clock are unchanged.
- Why: reaching G at `A9`'s step takes at least 31 readings. The SE measured 32/33/5, and all of them hold under the new wording. The cut's 30 meant that coarseness and miscounted the start reading plus the 2-step slack.
- Alternative rejected: coarsening `A9` to about G ÷ 27, which would break its parity with `ABC-167` `A5`.
- `NFR-008` and `N8-LANE` are untouched. DoR row 6 reads as amended, and the DoR stays 10/10.

**Forward scan:** no ninth default-lane row of this class at `2dba7331`. `ENGINE_DEEP` was not run. A red there outside the licence is the same class: stop to BA/PM.

**Next (Orchestrator):** one SE hop on `grugops/ABC-212` applies U1, U2 and U4–U8, editing tests only. `npm test` then reds U3 alone until `A11`'s `AGENTS.md` line is on the tested tree, and shows 0 red with it. The rest stays as the page says.

Files:
- `plans/tickets/ABC-212-…md`: +73/−0, a dated § Amendment 2026-10-24 plus one pointer line each under `A12` and `A13`, with the old text intact;
- `.grugops/context/bapm-amend-ABC-212/notes/`: 2 new notes;
- this record and its claim, moved to `done/`.

Not touched: `src/`, tests, ADRs, `AGENTS.md`, `memory-bank/`, `plans/board.md`, `plans/traceability.md`, other worktrees (the SE's was read via `git show` only), the remote and git config.

No stop.

### Trace row (10 cells, header order)

| ABC-212 (bapm-amend-ABC-212) | levels 6 (5 s) and 7 (30 s), rate 0, at every surface; default stays 5 — SE STOP ruled: U1–U8 licensed into A13 (value-only: set 1–7, refused 0/8), U3 = A11 AGENTS.md line in the same merge; A12 re-worded to A9's step (≤ ⌈G ÷ step⌉ + 3 readings) | EPIC-004 | — | NFR-008 untouched (A12 proxy corrected, no bound moves); NFR-004 unchanged; notes …93ffdad9, …e4a87583, …f2d7bc56, …44bee405, …19232445, …26b36292 | grugops/bapm-amend-ABC-212 @ ecd00a89 (records only)<br>plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md (§ Amendment 2026-10-24) | — (records only; rows read at 2dba7331, no test ran) | owed (production lines; QE verdict signs) | — | In Development (licence given; SE fix hop U1/U2/U4–U8, then the merge carries A11's AGENTS.md line for U3) |
