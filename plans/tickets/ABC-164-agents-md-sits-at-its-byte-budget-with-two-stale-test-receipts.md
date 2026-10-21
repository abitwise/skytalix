---
id: ABC-164
title: "`AGENTS.md` makes every role session read material only some sessions need, and at 24,575 of 24,576 B no owed line can land"
status: backlog
column: Backlog
size: S
priority: P2
epic: —
feature: —
---

# ABC-164 — `AGENTS.md` keeps what every role session needs; the rest moves to documents it points at. Scribe, then QE; ZERO `src/` lines

> **Re-scoped 2026-10-21 by BA/PM** (subtask `bapm-rescope-ABC-164`), on the owner's direction (verbatim, Orchestrator note
> `…c6bf41be`): *"AGENTS.md needs to be re-checked, what is not necessary for every role session should be moved out into
> separate markdown document that is reached from AGENTS.md or other index document."* Readings and rulings:
> `.grugops/context/bapm-rescope-ABC-164/notes/` (observation `…c8a818d5`, decision `…45c39699`).
>
> **What the 2026-10-17 cut asked for is already true at base**, so those criteria no longer test anything. `Test (all)`
> carries no count since `affee860` (`ABC-173`). `CLI_DEEP` reads "(count: the test file)" since `59ce86b9`. All four rule
> strings are present. The full old page is in git at `a222592b`.

## Problem

*User:* every role session, because each one reads `AGENTS.md` in full on start. Also the Scribe hop that has to add the next line.

*Pain, at `main` `3d36999b` (its `AGENTS.md` is byte-equal to `89fd4e83`'s):*
- `wc -c AGENTS.md` = **24,575** of the **24,576 B** budget (`ABC-109`, guarded by `src/cli.test.ts` `ABC-109` `A5`).
  That leaves **1 B of headroom, 0.0 edits** at `ABC-109`'s measured 1,159 B/edit. The next line reds `npm test`.
  Every Scribe hop today had to trim before it could add: `59ce86b9`, `8187ee19` and `edf85a40`.
- **Three owed lines are waiting** (§ Owed lines).
- Much of what every session reads serves one role or one trigger. Examples: the merge, UAT and QE authority rationale
  (Orchestrator, QE, UAT); the deployment posture (Release Manager); the process-rule controls (Orchestrator, BA/PM); the
  per-lane comments (QE and the Engineer, when that lane's files change). BA/PM's estimate is about 11.9 KB of on-demand text,
  **UNKNOWN - verify** by the Scribe audit `scribe-audit-agents-md`.

*Value:*
- Every role session reads less on start.
- The owed lines land.
- The next `AGENTS.md` edits fit without trimming: at least **5** edits of headroom.

## Scope

1. **Split.** Each block of `AGENTS.md` is classed *every session* or *on demand*. The class, and the target document for
   each on-demand block, come from the Scribe audit's split table. **BA/PM writes that table into this page at re-score**
   (DoR items 2 and 4).
2. **Move.** Each on-demand block moves to its target: an existing file such as `memory-bank/90-agents-md-command-log.md`,
   or a new `memory-bank/` file the split table names. The block keeps its words. The only rewordings allowed are the ones
   § Owed lines names.
3. **Point.** Every moved block is reachable by one pointer line naming `<file>` § `<heading>`. The pointer sits in
   `AGENTS.md`, or in `memory-bank/00-index.md` when `AGENTS.md` points at that index.
4. **Owed lines.** The three below land in this ticket.
5. **Record.** Add one history row to `memory-bank/90-agents-md-command-log.md`. It states the bytes before and after,
   the headroom in bytes, and the headroom in edits at 1,159 B/edit.

**Fixed now, whatever the audit says.** These are what tests pin, and what every session needs.
- **All 17 vitest commands stay in `AGENTS.md`, in backticks, outside HTML comments.** `ABC-173` `A3` counts **≥ 17**,
  and base has exactly 17. It also requires a line for each of `PERFT`/`SEARCH`/`ENGINE`/`INPUT`/`ZOBRIST`/`PUZZLE`/`CLI`/`LADDER`
  `_DEEP=1`, at least 3 suite-shaped commands, and one `INPUT_DEEP` line carrying `--expose-gc`. A lane's *comment* may
  move; its *command* may not.
- **The `Dev / run` slot stays as is.** It is pinned by `ABC-042` `A1` (`- Dev / run: \`npm run chess\``), `ABC-065`,
  `ABC-067` (its comment closes inside the slot), `ABC-071` (exactly one slot) and `ABC-059`.
- **Kept in `AGENTS.md`:**
  - the 12 coding rules;
  - `## Kit vs state`;
  - `## Safety rules`;
  - the note-writer blockquote;
  - every gate command (lint, typecheck, build, `npm test`, skip-count, test-integrity, QE-hop check);
  - a line naming the kit overrides and their count, with the words `remain THREE` and a pointer to where they are written.

## Owed lines (all land in this ticket)

| # | line | owed by | lands in | base reading |
|---|---|---|---|---|
| O1 | Note-writer pointer: pass the main checkout's `.grugops/context` as `contextRoot` (the default root is the plugin's own directory) | `bapm-rework-ABC-161` done record (stray notes in the plugin cache), and every brief since | `AGENTS.md` (every session: every role seals notes) | `contextRoot` 0× |
| O2 | QE-184-c: counting `[CLI_DEEP]` children in an agent session needs `--reporter=verbose`; the count is ≥ 1 | QE `…7b9ef6a7`; Orchestrator adopted it in briefs, `…9fd3189b` | the real-engine CLI lane's on-demand text (QE only) | `reporter=verbose` 0× |
| O3 | Ladder lane: the verdict ran **inside vitest** (route V). It is not "not run here (~44 h)" and not "plain node". The command is `LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`; cite `ADR-0038` addendum 2 and run 2's reading `…4c1d8e27` | Orchestrator ruling `…6a2f9d03` (ABC-166 A5: "net ≤ 0 B or ride with ABC-164"); heap flag per Architect `…7c31d5e8` | the ladder lane's on-demand text | `plain node` 1×, `not run here` 1×, `LADDER_DEEP=verdict` 0× |

**Not owed:**
- **`ABC-146`'s `node`-route line.** `A0` picked route V, which cancelled route N's scope, so no `node` command exists. O3
  replaces it.
- **QE-159-f's line.** It landed in `8187ee19`.

## Out of scope

- **Raising the 24,576 B budget.** Lowering it is out of scope too: that needs a `src/cli.test.ts` constant, which is an
  Engineer change. It is owed to the owner as a follow-up decision once this merges.
- `src/`, `tools/` and `plans/`.
- Changing any rule's meaning. A block moves; its authority and its words do not change, apart from O2 and O3.
- Line-number citations of `AGENTS.md:NNN` in ticket pages and notes. They are historical readings and stay as written.

## Acceptance (Given/When/Then)

Every string criterion is read on **joined text**: newlines become spaces and runs of spaces collapse (`G-QE-070-2`).
"Base" is the merge base. Each criterion is red at base and green at head, except where it says otherwise.

- **`A1` (headroom).**
  - **Given** head, **then** `wc -c AGENTS.md` ≤ **18,432** (base 24,575: red), with O1 included.
  - The command-log row states the figure, the headroom in bytes and the headroom in edits at 1,159 B/edit (≥ 5.3).
  - *At re-score, the audit's estimate may lower this target. It may not raise it.*
- **`A2` (on-demand blocks out).** Each block the split table classes *on demand* is gone from `AGENTS.md` at head. QE reads
  it by the block's heading, or by its first sentence when it has no heading: 0 occurrences at head, 1 at base.
- **`A3` (reachable in one pointer).** For each moved block, a pointer line in `AGENTS.md` (or in `memory-bank/00-index.md`,
  when `AGENTS.md` points there) names `<file>` § `<heading>`. At head, `test -f <file>` passes and the heading occurs
  exactly once in `<file>`. Base: the headings do not exist.
- **`A4` (nothing lost).**
  - QE joins each run of lines that `git diff <base> -- AGENTS.md` removes, and finds it in the union of the target files
    at head.
  - Misses must be **0**, apart from O2, O3 and the pointer lines themselves, each named in the command-log row.
  - *This is a conservation criterion, read at head only. A1 makes it non-vacuous.*
- **`A5` (rules and traps survive).**
  - Each of these strings is present on joined text in `AGENTS.md` or in a file an A3 pointer names: `exits 124`,
    `never SIGKILL`, `NOT DEFINED, not skipped`, `Run at QE`, `RISK-ABC152-NEGWORKERS`, `RISK-ABC143-01`, `pgrep`. Each
    occurs at least once at base.
  - `remain THREE` stays in `AGENTS.md` itself.
- **`A6` (owed lines landed).**
  - O1: `AGENTS.md` contains `contextRoot` (base 0).
  - O2: the CLI lane's text contains `--reporter=verbose` (base 0 in `AGENTS.md`).
  - O3: neither `AGENTS.md` nor the ladder target contains `plain node` or `not run here`. The ladder text contains
    `LADDER_DEEP=verdict` and `ADR-0038` (base: `plain node` 1×).
- **`A7` (pins and fences).**
  - `npm test` is green, including the `ABC-042` `A1`, `ABC-059`, `ABC-065`/`ABC-067`/`ABC-071`, `ABC-109` `A5` and
    `ABC-173` `A3` rows.
  - `vitestCommandsIn(AGENTS.md)` still returns **17**.
  - `git diff --name-only <base>` lists only `AGENTS.md` and the `memory-bank/*.md` files the split table names.
  - **0 `src/` lines**, and `AGENTS_MD_BUDGET_BYTES` is unchanged at `24_576`.

## Dependencies

- **`scribe-audit-agents-md`** (Scribe, records only; dispatched at `dcdb9c2f`). Its split table fills Scope 1 and A2/A3.
  **Re-score trigger:** `.grugops/queue/done/scribe-audit-agents-md.md` exists.
- `ABC-109` `Done`: the budget and its guard. `ABC-173` `Done`: the vitest-command pin. `ABC-146` and `ABC-166` merged at
  `1ec00430`: O3's facts.
- `ABC-185` and `ABC-179` touch no file this ticket touches.

## Security / NFR triggers

- **NFR:** not triggered. The ticket adds 0 test files and 0 tests. Its measurable target is bytes (A1).
- **Security:** not triggered. Documentation only; no secret, path or command changes meaning.

## Test notes

1. Read every string on joined text (`G-QE-070-2`); comments wrap.
2. QE runs A4 with its own script over `git diff -U0 <base> -- AGENTS.md`, and records the miss list (expected: O2, O3 and
   the pointers).
3. QE spot-reads three role sessions' start paths. For each, record the bytes it reads before and after, and the second
   documents it now needs.
4. **Gates:**
   - lint, typecheck, build, `npm test`;
   - `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "AGENTS.md"` (one file, 400).
   - A QE hop is owed. The UAT waiver is expected (0 production lines).

## Size and priority

**`S`:** one Scribe hop that moves text into 1–3 documents and adds pointers, with no code. **Not `XS`:** about 11 KB moves,
and A4 needs a conservation read. **Re-size `M` at re-score** if the split table names more than 3 target documents, or
any rewording beyond O2/O3.

**`P2`** (was `P3`). **The page's own promotion trigger has fired:** "a ticket that must add text to `AGENTS.md` is cut or pulled".
- O3 was ruled to "ride with `ABC-164`" (`…6a2f9d03`).
- O1's absence has already put stray notes in the plugin cache once (`bapm-rework-ABC-161`).
- `scribe-trace-row-pointer` spent the last 15 B.
- On top of that comes the owner's direction. **Not `P1`:** nothing delivered is blocked, because briefs carry O1 and O2
  by hand meanwhile.

## Definition of Ready

BA/PM, 2026-10-21, re-score of the re-scope. **Result: 8 of 10. Stays in `Backlog`** until the audit's split table is
written in.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 24,575 of 24,576 B (1 B, 0.0 edits); 3 owed lines; owner's every-session direction |
| 2 | scope and out-of-scope clear | **⚠️** fixed keeps, owed lines and fences are clear; **the per-block split comes from `scribe-audit-agents-md`** |
| 3 | INVEST-shaped | **✅** one Scribe hop, independent of in-flight work, valuable to every session |
| 4 | acceptance testable and measurable | **⚠️** A1, A4–A7 are measurable now; **A2/A3 need the split table's block and heading list** |
| 5 | dependencies known | **✅** the audit (re-score trigger), plus `ABC-109`, `ABC-173`, `ABC-146`/`ABC-166` done |
| 6 | security/NFR triggers with a measurable target | **✅** not triggered; the target is ≤ 18,432 B |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `S`, with a re-size rule |
| 9 | priority assigned | **✅** `P2`, trigger fired |
| 10 | no major unresolved blocker | **✅** the audit is dispatched, not blocked |

Column moves are the Orchestrator's. Owner of the build: **the AGENTS.md Scribe**, then QE.
