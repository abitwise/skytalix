---
id: ABC-164
title: "`AGENTS.md` makes every role session read material only some sessions need, and at 24,575 of 24,576 B no owed line can land"
status: in-review
column: In Review
size: S
priority: P2
epic: —
feature: —
---

# ABC-164 — `AGENTS.md` keeps what every role session needs; the rest moves to documents it points at. Scribe, then QE; ZERO `src/` lines

> **Option A folded in 2026-10-21 by BA/PM** (subtask `bapm-fold-A-ABC-164`). The owner picked Option A of the Scribe audit
> and kept `P2` (Orchestrator `…18e4ada0`). The split comes from the audit's block table `…ffbb746f` and proposed split
> `…38d2af93` (`.grugops/context/scribe-audit-agents-md/notes/`), with two corrections, C1 and C2 below. Readings and
> rulings: `.grugops/context/bapm-fold-A-ABC-164/notes/`. **DoR 10/10 → Ready.**
>
> **Re-scoped 2026-10-21 by BA/PM** (`bapm-rescope-ABC-164`, `…45c39699`) on the owner's direction (verbatim, `…c6bf41be`):
> *"AGENTS.md needs to be re-checked, what is not necessary for every role session should be moved out into separate
> markdown document that is reached from AGENTS.md or other index document."* The 2026-10-17 page is in git at `a222592b`.

## Problem

*User:* every role session, because each one reads `AGENTS.md` in full on start. Also the Scribe hop that has to add the next line.

*Pain, at `main` `3d36999b` (its `AGENTS.md` is byte-equal to `89fd4e83`'s and to `60d72e66`'s):*
- `wc -c AGENTS.md` = **24,575** of the **24,576 B** budget (`ABC-109`, guarded by `src/cli.test.ts` `ABC-109` `A5`).
  That leaves **1 B of headroom, 0.0 edits** at `ABC-109`'s measured 1,159 B/edit. The next line reds `npm test`.
  Every Scribe hop today had to trim before it could add: `59ce86b9`, `8187ee19` and `edf85a40`.
- **Three owed lines are waiting** (§ Owed lines).
- The audit counts 39 blocks. About 10 KB of them serve one role or one trigger (governance rationale, lane receipts and
  traps, rare commands).

*Value:*
- Every role session reads about 9.5 KB less on start.
- The owed lines land.
- The next `AGENTS.md` edits fit without trimming: at least **5** edits of headroom.

## Scope (Option A)

**Builder: the AGENTS.md Scribe, then QE.** Every moved block keeps its words. Only O2 and O3 reword anything. Pointer
lines and the `## Standing rulings` summary are new lines; they are not rewordings (rule S below).

### The split (39 blocks; bytes and line ranges: audit observation `…ffbb746f`)

**KEEP whole (26):** `B01` Title/Mission, `B03` How to work here, `B04` Role/workflow pointers, `B05` note-writer
blockquote (+ O1), `B06` `## Kit vs state` (heading text unchanged: 17 `.claude/agents/` adapters cite it), `B07` Commands
intro, `B08` Install, `B09` Development header + `Dev / run` slot, `B13` `### Test` header + receipts pointer, `B14` `pgrep`
trap, `B15` `npm test` + its comment, `B16` heap-flag rule, `B19` Test (single file), `B21` Acceptance, `B22` skip-count and
test-integrity, `B24`–`B29` Lint, Typecheck, Build, E2E, Stack, Delivery, **`B35` `## Safety rules`** (C2), `B36` the 12
coding rules (numbering unchanged), `B37` DoR/DoD, `B38` Memory bank & plans (+ two pointers), `B39` When uncertain.

**SPLIT (10) and MOVE (3):**

| block | stays in `AGENTS.md` | moves, verbatim, to |
|---|---|---|
| `B02` budget paragraph | `**Byte budget: this file targets ≤ 24,576 B.**` + a pointer to the log | the sentence starting "The 32,768-byte reader cap" → `90` preamble (above its first `## `) |
| `B10` slot WRITING RULES (MOVE) | inside the slot comment, a pointer to `90` § "Dev / run" (line 65's existing pointer may carry it) | `90` § "Dev / run" |
| `B11` perft lines (**C1**) | **the `PERFT_DEEP=1 …` line** | `npm run perft` and `npm run spike:perft [depth]` lines → `90` § "On-demand commands" |
| `B12` book regen (MOVE) | — | command line → `90` § "On-demand commands"; its RUN comment → `90` § "Regenerate the opening book" |
| `B17` worker cap | the cap sentence(s): `maxWorkers: 2`, never raise, env may only lower | the rest (`VITEST_MAX_THREADS`, `viteModuleRunner`, `RISK-ABC152-NEGWORKERS`) → `90` § "Vitest worker cap and module runner" (new) |
| `B18` 11 lane bullets (12 commands) | each label + backticked command, no comment; one pointer line to `90` § "On-demand commands" | each lane's HTML comment → that lane's `90` §; the ladder comment → `90` § "Self-play ladder lane" (new), with O3 |
| `B20` coverage ×2 | both command lines, no comment | the comment → `90` § "Coverage" (the `— \`npx vitest run --coverage\`` one) |
| `B23` QE-hop | the command line | its comment → `memory-bank/40-contributing.md` § "Conventions" |
| `B30` Process rules (MOVE) | its two bold rule sentences, inside `## Standing rulings` | `45` § "Process rules (this project)" |
| `B31` Branching model | operative sentences, inside `## Standing rulings` | `45` § "Branching model" |
| `B32` Test and UAT authority | operative sentences, inside `## Standing rulings` | `45` § "Test and UAT authority" |
| `B33` QE validation authority | the QE sentence and the `remain THREE` sentence, inside `## Standing rulings` | `45` § "QE validation authority" |
| `B34` Deployment posture | operative sentence, inside `## Standing rulings` | `45` § "Deployment posture" |

`45` = **NEW** `memory-bank/45-standing-rulings.md` (title `# Standing rulings`; its five `##` headings are the old ones,
verbatim). `90` = `memory-bank/90-agents-md-command-log.md`.

**Corrections to the audit (BA/PM, measured at `60d72e66`):**
- **C1. `B11` is SPLIT, not MOVE.** Line 67 (`PERFT_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run
  src/perft.test.ts`, 127 B) is one of the 17 commands `vitestCommandsIn` finds. `ABC-173` `A3` requires a `PERFT_DEEP=1`
  line. Moving it makes 16 and reds `npm test`. The audit's "13 deep-lane commands" in `B18` are 12; the 13th is this one.
- **C2. `B35` Safety rules stays whole.** Safety rules is one of this page's fixed keeps. The audit's "fold the merge/deploy
  bullets into the summary" would also make `A4` miss their words, which exist nowhere else. Only its three backticked
  references (`## Branching model`, `## Test and UAT authority`, `## Deployment posture`) are re-pointed to `45` §.

### New sections and pointers

- **`AGENTS.md` `## Standing rulings`** (new, where `## Process rules (this project)` was). It holds one pointer line
  naming `memory-bank/45-standing-rulings.md` and its five headings, plus the operative sentences in **rule S**.
- **`90` § "On-demand commands"** (new, above § "Dev / run"). It holds the `B11`/`B12` command lines and a **lane table**.
  The table has one row per `B18`/`B20` command line and one for `PERFT_DEEP`, 15 rows. Columns:
  - the label as `AGENTS.md` spells it;
  - who runs it, after which change: copied verbatim from the moved comment, or `—`;
  - the `90` heading holding that lane's text: full text, or `—` when it has none.
  The table is the index for the lane comments, the same way `00-index.md` is for files (`A3`).
- **`90` § "Vitest worker cap and module runner"** and **`90` § "Self-play ladder lane"**: new, as above.
- **`90` preamble and Reader paragraph:** name QE and the Software Engineer as readers.
- **`AGENTS.md` § Test:** one pointer line to `90` § "On-demand commands" (lane triggers, traps, receipts). **§ Memory bank &
  plans:** names `45` and `90`.
- **`memory-bank/00-index.md`:** a row for `45-standing-rulings.md`. The `90` row's purpose now names on-demand commands
  and lane triggers. This file is a second route, not a target: no block moves into it.

**Rule S (the summary).** `## Standing rulings` has pointer lines and operative sentences only. Each sentence that is not a
pointer occurs verbatim in `45` (joined text, `**` removed), so its meaning cannot drift. At least these appear:
- "Criteria review happens at the `Ready for Dev` exit, not at a gate."
- "Ticket prose has a size budget; overflow goes to context notes."
- "Merge to `main` in THIS project is allowed once all tests pass and the ticket is done, never before."
- "commit on `grugops/<task>`, never `main` directly."
- "the owner's word in session IS the `In UAT` signature."
- "a ticket whose delivered diff carries ZERO PRODUCTION LINES has UAT WAIVED, standing."
- the waiver measurement `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'`;
- the snapshot-only exception sentence (it carries `src/__snapshots__/*.snap`);
- "Every ticket gets a `qe-e2e` hop and QE's recorded verdict before leaving `In Review`; none reaches `Done` without one."
- "This project's kit overrides remain THREE: the branching model, the deployment posture, and the zero-production-lines UAT waiver."
- "`production_requires_human_confirmation` stays `true`".

**Traps the Scribe must not walk into (each reds a pinned test):**
- **No new backticked `npx vitest` span in `AGENTS.md`.** That includes pointers, the summary and O3. `ABC-173` `A3`
  parses every backticked span outside comments. A new one makes an 18th command, and a span without its heap flag reds.
  The `90` lane headings contain such spans, so **never quote a `90` lane heading in `AGENTS.md`**. The lane table, which
  lives in `90`, names them instead.
- **`Dev / run` slot:** it stays exactly one, and its comment closes before the next `\n- ` (`ABC-071`, `ABC-067`). New
  prose that says "Dev / run" must not name another `npm run …` or `UNKNOWN - verify` before its sentence ends (`ABC-059`).
  Name no slot option (`--colour`, `--difficulty`, `--ascii`, `--unicode`) anywhere new in `AGENTS.md` (`ABC-065`).

### Fixed keeps (unchanged)

- **All 17 vitest commands stay in `AGENTS.md`, in backticks, outside HTML comments.** That includes `PERFT_DEEP` (C1).
- **The `Dev / run` slot stays as is:** `ABC-042` `A1`, `ABC-065`, `ABC-067`, `ABC-071`, `ABC-059`.
- **Also kept:**
  - the 12 coding rules;
  - the `## Kit vs state` heading text;
  - `## Safety rules`;
  - the note-writer blockquote with O1;
  - every gate command: lint, typecheck, build, `npm test`, skip-count, test-integrity, QE-hop check;
  - `remain THREE`.

### Record

Add one entry to `90` for this pass. It states:
- the bytes before and after;
- the headroom in bytes and in edits at 1,159 B/edit;
- the `A4` miss list.

## Owed lines (all land in this ticket)

| # | line | owed by | lands in | base reading |
|---|---|---|---|---|
| O1 | Note-writer pointer: pass the main checkout's `.grugops/context` as `contextRoot` (the default root is the plugin's own directory) | `bapm-rework-ABC-161` done record (stray notes in the plugin cache), and every brief since | `AGENTS.md` `B05` blockquote (every role seals notes) | `contextRoot` 0× |
| O2 | QE-184-c: counting `[CLI_DEEP]` children in an agent session needs `--reporter=verbose`; the count is ≥ 1 | QE `…7b9ef6a7`; Orchestrator `…9fd3189b` | `90` § "Real-engine CLI lane (…)" | `reporter=verbose` 0× in `AGENTS.md` |
| O3 | Ladder lane: the verdict ran **inside vitest** (route V), not "not run here (~44 h)" and not "plain node". Command `LADDER_DEEP=verdict NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts --reporter=verbose`; cite `ADR-0038` addendum 2 and run 2's reading `…4c1d8e27` | Orchestrator `…6a2f9d03`; heap flag per Architect `…7c31d5e8` | `90` § "Self-play ladder lane" (new); **never in `AGENTS.md`** | `plain node` 1×, `not run here` 1×, `LADDER_DEEP=verdict` 0× |

**Not owed:** `ABC-146`'s `node`-route line (route V; O3 replaces it); QE-159-f's line (landed `8187ee19`).

## Out of scope

- **The 24,576 B budget constant.** It stays `24_576`. Lowering it is an **open owner decision** (the audit recommends
  18,432 under A). It needs a `src/cli.test.ts` edit, so it is an Engineer ticket after this merges. Raising it is out.
- Option B: the lane and coverage commands leaving `AGENTS.md`, and any `ABC-173` `A3` edit.
- `src/`, `tools/` and `plans/`.
- Changing any rule's meaning. Rewordings are limited to O2 and O3.
- `AGENTS.md:NNN` citations in ticket pages and notes. They are historical readings.

## Acceptance (Given/When/Then)

Read every string on **joined text**: newlines become spaces and runs of spaces collapse (`G-QE-070-2`). "Base" is the
merge base. **Heading match:** a `## ` line matches a named heading `X` when it is `## X`, or starts with `## X —` or
`## X (`. QE counts the matching lines in the named file.

- **`A1` (headroom).**
  - **Given** head, **then** `wc -c AGENTS.md` ≤ **18,432** (base 24,575: red), with O1 included.
  - The `90` entry states the figure, the headroom in bytes and the headroom in edits at 1,159 B/edit (≥ 5.3).
  - *Expected about 15,000 B: the audit's ~14,400 ± 600, plus 127 B for C1 and about 490 B for C2.*
- **`A2` (on-demand blocks out). Given** head, **when** QE reads `AGENTS.md`, **then:**
  - (a) 0 lines are `## Process rules (this project)`, `## Branching model`, `## Test and UAT authority`,
    `## QE validation authority` or `## Deployment posture`. At base there is 1 of each.
  - (b) 0 backticked self-references `` `## Branching model` ``, `` `## Test and UAT authority` ``,
    `` `## Deployment posture` ``, `` `## QE validation authority` `` (base 1, 2, 1, 2).
  - (c) exactly **1** `<!--` between `### Test` and `### Acceptance`: `npm test`'s (base 10).
  - (d) 0 occurrences of each canary, with the base count in brackets: `32,768` (1), `WRITING RULES` (1),
    `npm run perft` (1), `spike:perft` (1), `compile.ts` (1), `VITEST_MAX_THREADS` (1), `viteModuleRunner` (1),
    `RISK-ABC152-NEGWORKERS` (1), `NOT DEFINED, not skipped` (3), `Run at QE` (2), `ENDGAMES 204` (1), `heapUsed` (1),
    `TRIGGER (owner` (1), `QE-085-e` (1), `not run here` (1), `plain node` (1), `process boundary` (1),
    `at every move to` (1), `be910aa8` (1), `d9aa42b9` (1).
  - (e) exactly one `## Standing rulings` line. Its section meets rule S: every listed string is present, and every other
    non-pointer sentence is found verbatim in `45`.
- **`A3` (reachable). Given** head:
  - (a) `test -f memory-bank/45-standing-rulings.md`. Each of its five headings matches exactly **1** line there.
  - (b) In `90`, each of "On-demand commands", "Vitest worker cap and module runner" and "Self-play ladder lane" matches
    exactly **1** line. "Dev / run", "Coverage — `npx vitest run --coverage`", "Regenerate the opening book" and
    "Real-engine CLI lane" each still match exactly 1. In `40-contributing.md`, "Conventions" matches exactly 1.
  - (c) `AGENTS.md` has a pointer line for each of these, naming file § heading:
    - `45` (in `## Standing rulings`);
    - `90` § "On-demand commands" (in § Test);
    - `90` § "Vitest worker cap and module runner";
    - `90` § "Dev / run";
    - `40-contributing.md` § "Conventions" (beside the QE-hop command);
    - the `90` preamble (beside the budget sentence).
    § Memory bank & plans names `45` and `90`. `00-index.md` has a `45-standing-rulings.md` row.
  - (d) The lane table has 15 rows. Every heading it names matches exactly 1 line in `90`.
  - Base: `45` does not exist, and the three new `90` headings match 0.
- **`A4` (nothing lost).** QE joins each run of lines that `git diff <base> -- AGENTS.md` removes, and finds it in the union
  of `45`, `90` and `40-contributing.md` at head. Misses must be **0**, apart from three, each named in the `90` entry:
  - the O3 rewording;
  - the re-pointed `## X` references;
  - the lines replaced by pointers.
  *A conservation criterion, read at head only. A1 makes it non-vacuous.*
- **`A5` (rules and traps survive).**
  - In `AGENTS.md`: `exits 124`, `never SIGKILL`, `pgrep`, `RISK-ABC143-01` and `remain THREE`.
  - In `AGENTS.md` or `90`: `NOT DEFINED, not skipped`, `Run at QE` and `RISK-ABC152-NEGWORKERS`.
  - In `45`: `be910aa8`, `d9aa42b9` and `src/__snapshots__/*.snap`.
  - Each string occurs at least once at base.
- **`A6` (owed lines landed).**
  - O1: `AGENTS.md` contains `contextRoot` (base 0).
  - O2: `90` § "Real-engine CLI lane" contains `--reporter=verbose` and `[CLI_DEEP]`.
  - O3: `90` § "Self-play ladder lane" contains `LADDER_DEEP=verdict`, `ADR-0038`, `addendum 2` and `4c1d8e27`. Neither
    that section nor `AGENTS.md` contains `plain node` or `not run here`. `AGENTS.md` contains `LADDER_DEEP=verdict` 0×.
- **`A7` (pins and fences).**
  - `npm test` is green, including the `ABC-042` `A1`, `ABC-059`, `ABC-065`/`ABC-067`/`ABC-071`, `ABC-109` `A5` and
    `ABC-173` `A3` rows.
  - `vitestCommandsIn(AGENTS.md)` returns exactly **17**, among them one `PERFT_DEEP=1` line.
  - `git diff --name-only <base>` lists only these five: `AGENTS.md`, `memory-bank/45-standing-rulings.md`,
    `memory-bank/90-agents-md-command-log.md`, `memory-bank/40-contributing.md` and `memory-bank/00-index.md`.
  - **0 `src/` lines.** `AGENTS_MD_BUDGET_BYTES` is unchanged at `24_576`.

## Dependencies

- **`scribe-audit-agents-md`: done** (`.grugops/queue/done/scribe-audit-agents-md.md`). Its split is folded in above with
  C1/C2. **Owner pick: Option A** (`…18e4ada0`).
- `ABC-109` `Done`: the budget and its guard. `ABC-173` `Done`: the vitest-command pin. `ABC-146` and `ABC-166` merged at
  `1ec00430`: O3's facts.
- `ABC-186` (In Development) and `ABC-185` touch only `plans/traceability.md`. They touch no file this ticket touches.

## Security / NFR triggers

- **NFR:** not triggered. The ticket adds 0 test files and 0 tests. Its measurable target is bytes (A1).
- **Security:** not triggered. Documentation only; no secret, path or command changes meaning.

## Test notes

1. Read every string on joined text (`G-QE-070-2`); comments wrap.
2. QE runs A4 with its own script over `git diff -U0 <base> -- AGENTS.md`. It records the miss list (expected: O3, the
   re-pointed references, the pointers).
3. QE runs `vitestCommandsIn` (ABC-173's own parser) on head and records the 17 spans.
4. QE spot-reads three role sessions' start paths: QE, the Orchestrator and the Software Engineer. For each, it records the
   bytes read before and after, and which second document the role now needs. The Software Engineer should need none.
5. **Gates:**
   - lint, typecheck, build, `npm test`;
   - `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "AGENTS.md"` (one file, 400).
   - A QE hop is owed. The UAT waiver is expected (0 production lines).

## Size and priority

**`S`** (re-size rule checked). There are 3 target documents (`45`, `90`, `40-contributing.md`); `00-index.md` gets a row
and no block. No rewording beyond O2/O3: rule S copies sentences verbatim. One Scribe hop, no code. **Not `XS`:** about
9.5 KB moves, and A4 needs a conservation read.

**`P2`**, kept by the owner (`…18e4ada0`).
- O3 rides here (`…6a2f9d03`).
- O1's absence already put stray notes in the plugin cache.
- 1 B of headroom is left.
- **Not `P1`:** nothing delivered is blocked, because briefs carry O1/O2 by hand meanwhile.

## Definition of Ready

BA/PM, 2026-10-21, re-score after the audit and the owner's Option A. **Result: 10 of 10. Backlog → Ready.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** 24,575 of 24,576 B (0.0 edits); 3 owed lines; owner's every-session direction |
| 2 | scope and out-of-scope clear | **✅** (was ⚠️) all 39 blocks classed with a target (split table); C1/C2 recorded; Option B and the budget constant out |
| 3 | INVEST-shaped | **✅** one Scribe hop, independent of `ABC-186`/`ABC-185`, valuable to every session |
| 4 | acceptance testable and measurable | **✅** (was ⚠️) A2: 5 headings, 4 references, 1 comment, 20 canaries, all with base counts; A3: headings that must match exactly 1, 6 pointers, a 15-row table |
| 5 | dependencies known | **✅** the audit done; owner picked A; `ABC-109`, `ABC-173`, `ABC-146`/`ABC-166` done |
| 6 | security/NFR triggers with a measurable target | **✅** not triggered; the target is ≤ 18,432 B |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `S`, re-size rule checked (3 targets, no rewording) |
| 9 | priority assigned | **✅** `P2`, owner |
| 10 | no major unresolved blocker | **✅** the open budget-constant decision is outside this ticket |

Column moves past `Ready` are the Orchestrator's. Owner of the build: **the AGENTS.md Scribe**, then QE.
