---
id: ABC-212
title: "Two stronger levels: 6 thinks 5 s and 7 thinks 30 s a move, at every surface, and the default stays 5"
status: ready
column: Ready
size: M
priority: P2
epic: EPIC-004
feature: difficulty levels (ABC-087 mechanism, ABC-101 selection, ABC-171 Skill Level)
---

# ABC-212: levels 6 (5 s) and 7 (30 s), blunder rate 0, at every surface; the default stays 5

> **Cut 2026-10-24 by BA/PM** (task `bapm-cut-levels-6-7`, records only, at `main` `6c0ab29e`). The rulings are in
> `.grugops/context/bapm-cut-levels-6-7/notes/`. This hop ran no test, took no timing and ran no probe.
>
> **Owner word.** `owner-word-2026-10-23` `…e44d2903`, item 3, verbatim: *"I think we can add 2 more difficulty
> settings: 6 - allow to think 5 seconds and 7 - allow to think up to 30 seconds, to squeeze maximum out."* It is a
> requirement and scope word, and it moves bounds that are the owner's. **The `NFR-004` text and the `ADR-0045`
> amendment go back to him as PROPOSED** (§ Owner decisions owed). Nothing in this page moves a bound by itself.
>
> **Why `EPIC-004` and not `EPIC-008`.** `EPIC-008` is "stronger **at the same levels and time budgets**". Its scope
> holds the level table fixed (gate `G9`), and every one of its tickets ships on a level-5 reading. New levels belong
> on the levels line: `EPIC-004`'s "difficulty levels that map to a search budget plus a blunder rate" (`ABC-087`).
> `EPIC-004` stays Done. This is a post-close addition, and its acceptance criteria are not reopened (§ Dependencies).

## Problem

- **User:** the owner, who plays `npm run chess` and drives `skytalix` from a UCI GUI.
- **Pain:** the hardest level is the default, level 5 at 3 s a move. Nothing lets him give the engine more time
  when he wants its best play.
- **Value:** two levels above the default that think longer, at 5 s and at 30 s a move, with no blunders. The same
  engine searches deeper: about +0.36 ply at 5 s and about +2.3 ply at 30 s over level 5 (`ADR-0045` § Context: one
  ply costs 2.67x the time; 3 000 v 5 000 ms was measured at +0.36 ply). The 30 s figure is a prediction,
  `UNKNOWN - verify` (`A15` reads it).

## "Up to 30 s": ruled

- **Ruling: level 7's budget is 30 000 ms, and it is spent like every other level's.** The search deepens until the
  budget runs out (`src/engine.ts` `deepen`), and the most it thinks is 30 s plus the ceiling margin.
- **It thinks less only where every level already does.** A book move returns at once (`ABC-095`'s book wraps the
  level seam). Under UCI, the GUI's `movetime` or clock caps the budget (`ADR-0044` D11: `min(G, level budget)`).
- **No early stop is built here.** "Stop when the search is clearly done" has no number. The candidate rules (one
  legal move; a proven forced mate) change the engine's mechanism, which `ADR-0045` D3 holds fixed. They would also
  apply at levels 1–5 and change `EPIC-008`'s level-5 readings. It is offered to the owner as a follow-up, not cut
  (§ Owner decisions owed, OQ-212-2). The ruling is cheap to reverse.

## Scope

1. **The table** (`src/levels.ts`): `LEVELS[6] = { budgetMs: 5 000, blunderRate: 0 }` and
   `LEVELS[7] = { budgetMs: 30 000, blunderRate: 0 }`. `HARDEST_LEVEL` becomes 7. `EASIEST_LEVEL` stays 1 and
   `DEFAULT_LEVEL` stays 5. `LEVELS[1..5]` do not change.
2. **The ceiling.** The engine's clamp (`HARD_CEILING_MS`, `src/engine.ts:129`, `RF-1`) admits each level's ceiling
   under the `NFR-004` text the owner accepts (proposed: 5 s at levels 1–5, 7 s at 6, 32 s at 7). The mechanism's
   shape (one absolute clamp, or a ceiling per level) is Architect/Design's (§ Design owed).
3. **The CLI flag** (`src/cli-options.ts`): `--difficulty` accepts `1`–`7`. The usage line and the missing-value
   message name `1|2|3|4|5|6|7`.
4. **The startup question** (`src/startup-questions.ts`, `ABC-200`): `difficulty (1|2|3|4|5|6|7) [5]: `.
5. **UCI** (`src/uci-session.ts`): `option name Skill Level type spin default 5 min 1 max 7`. Levels 6 and 7 take the
   rate-0 path (`chooseMove` with `ADR-0044` D12's limits, score line sent). A `go` with no time (bare, `infinite`,
   `ponder`, depth, nodes or mate only) searches the level's budget.
6. **In-code text:** the headers and comments that say "1-5", "no level reaches `HARD_CEILING_MS`" or "the default
   is the hardest" (`src/levels.ts`, `src/engine.ts`, `src/uci-session.ts`, `src/cli-options.ts`, `src/cli.ts`).
7. **Docs outside `src/`:** `AGENTS.md` "Dev / run" (the Scribe, within its 18 432 B budget) and
   `memory-bank/70-runbook.md` § Operate (Architect/Design). Both land with the merge.

## Out of scope

- An early stop (OQ-212-2), a worker thread for UCI (`ADR-0044` D5; § Design owed decides if it is owed), pondering.
- Any change to levels 1–5, to `DEFAULT_LEVEL`, to the blunder construction (`ADR-0032`) or to the search.
- **The ladder.** Levels 6–7 do not join `ABC-085`'s self-play ladder. `src/ladder.test.ts`'s pair plan and its
  `[1, 2, 3, 4, 5]` loop stay unchanged. No 5v6 or 6v7 verdict is pre-registered (OQ-212-4).
- An Elo claim for any level (`src/levels.ts` header; `EPIC-007` § Success measures).
- `EPIC-008`'s readings. They stay at `Skill Level` 5.

## Acceptance criteria

**The table and the default**
- **A1.** **Given** `src/levels.ts`, **then** `Object.keys(LEVELS)` is `["1", …, "7"]`; `LEVELS[6]` is
  `{ budgetMs: 5 000, blunderRate: 0 }` and `LEVELS[7]` is `{ budgetMs: 30 000, blunderRate: 0 }`; `LEVELS[1..5]` are
  byte-identical to base (100/0.4, 180/0.2, 330/0.1, 1 000/0.05, 3 000/0); `[EASIEST_LEVEL, DEFAULT_LEVEL,
  HARDEST_LEVEL]` is `[1, 5, 7]`; every level's keys are exactly `[blunderRate, budgetMs]`; the ordering row holds over
  1..7 (budgets never fall, rates never rise, each step improves one of the two); the table and each entry are frozen.
- **A2.** **Given** no `--difficulty` and no `Skill Level`, **then** the difficulty is 5 and the level is
  `{ 3 000, 0 }`: `DEFAULT_DIFFICULTY === DEFAULT_LEVEL === 5`, and the UCI `default` is 5. `ABC-101` `A8′` ("a
  session without the flag plays as it did") stays green with no edit to its expectations.
- **A3. Levels 1–5 play exactly as before** (QE reading, not a lane row). For each level 1–5, on 10 positions of the
  perft corpus (`spread`, every sixth), seed 1, virtual clock step = budget ÷ 30: `createLevel`'s `(move, kind, depth,
  nodes)` at head equals base on **50 of 50**. Also `chooseMove` at 3 000 ms equals base on the same 10 positions.
  This makes `ABC-212` value-identical for `EPIC-008`'s readings.

**The time a move takes**
- **A4. Real clock, `ENGINE_DEEP` levels lane only.**
  - Level 6, 30 positions (`A5`'s set): every move takes **≥ 5 000 ms and ≤ 7 000 ms**, 30 of 30.
  - Level 7, the first 10 of those positions: every move takes **≥ 30 000 ms and ≤ 32 000 ms**, 10 of 10.
  - Level 5: the existing `A5` row reads `LEVELS[5]` by number (not `HARDEST_LEVEL`) and stays ≤ 5 000 ms on 30 of 30.
  - The log prints each level's max and the max completed depth.
- **A5. The clamp is still there** (virtual clock, default lane). `chooseMove` handed `Infinity`, or twice the
  largest ceiling, returns at the largest ceiling of the accepted `NFR-004` text (32 000 ms as proposed) plus at most
  one clock step, and equals the run at exactly that ceiling. No surface can start a level-L search with a budget above
  ceiling(L): the data row asserts `LEVELS[L].budgetMs ≤ ceiling(L)` for L = 1..7, and `budgetMs < 5 000` for 1..5.

**Every surface**
- **A6. CLI flag.** `--difficulty 6` and `--difficulty 7` resolve to 6 and 7. The boundary pair moves from `0`/`6` to
  `0`/`8`, and both are refused, together with today's near-number list (`-1`, `3.5`, `three`, `3.0`, `+3`, `03`, `""`,
  `" 3"`, `"3\n"`, `constructor`, `__proto__`). The accepted words equal `Object.keys(LEVELS)` both ways. A bare flag
  gives `--difficulty needs one of 1|2|3|4|5|6|7`.
- **A7. Usage.** The usage line is byte-exact
  `usage: npm run chess -- [--colour white|black|random] [--difficulty 1|2|3|4|5|6|7] [--ascii | --unicode]`, read
  from the existing refusal child (0 new spawns), and each advertised form resolves.
- **A8. Startup question.** On a terminal with the flag absent, the question is `difficulty (1|2|3|4|5|6|7) [5]: `.
  `6` and `7` are accepted, `8` is named and the question is asked again, and Enter keeps 5.
- **A9. UCI `Skill Level`.**
  - `uci` lists `option name Skill Level type spin default 5 min 1 max 7`.
  - `setoption name Skill Level value 7` sets 7. Values `0` and `8` keep the previous level with
    `info string Skill Level takes an integer 1-7, got <x>; kept <n>`.
  - Virtual clock, step = budget ÷ 30, `ABC-167` `A5`'s bound (`G ≤ time ≤ G + 2·step`):
    - a bare `go` at 7 searches 30 000 ms, and at 6 it searches 5 000 ms;
    - `go movetime 60000` at 7 searches 30 000; `go movetime 1000` at 7 searches 1 000;
    - `go wtime 600000 btime 600000` at 7 searches `min(600 000 ÷ 20, 30 000)` = 30 000;
    - `go depth 3` at 7 stops at depth 3 (D12 applies: rate 0), and the `info` line carries a score.
  - At `Skill Level` 1–5, every existing UCI row passes with no edit to its expected values.
- **A10. The wait at level 7, by hand** (QE, a real pty, `npm run chess -- --difficulty 7`). The engine-thinking
  frame is drawn before the search. One engine move returns in **30–32 s**. Ctrl-C during the search ends the process
  within **1 s** of the keypress. A game at level 6 or 7 still writes its PGN at the end (`ABC-203`).
- **A11. Docs.** `AGENTS.md` "Dev / run" and `memory-bank/70-runbook.md` § Operate name `--difficulty
  1|2|3|4|5|6|7`, default 5, and say that levels 6 and 7 think 5 s and 30 s a move. No other line of either file moves.

**Value, cost and pins**
- **A12. Lane cost.** 0 new test files and 0 new spawned children. A default-lane row that searches at level 6 or 7
  runs on a virtual clock with **≤ 30 clock readings** per search, or reads the budget handed to the engine without
  searching. No level-6 or level-7 search runs on the real clock in the default lane, `CLI_DEEP` or `UCI_DEEP`.
- **A13. Pin edits are licensed by this list, and only by it** (any other expectation that moves is out of class: stop
  to BA/PM):
  - `src/levels.test.ts`: the keys row (`:192`), `[1, 5, 5]` → `[1, 5, 7]` (`:193`, `:244`), `DEFAULT_LEVEL ===
    HARDEST_LEVEL` (`:245`) → `DEFAULT_LEVEL === 5` and `HARDEST_LEVEL === 7`, the `[1..5]` lists at `:279`, `:286`
    and `:588`, the clause-B row (`:293`–`:296`) re-read against ceiling(L), and `A5` (`:627`) reading `LEVELS[5]`;
  - `src/cli.test.ts`: `A2` (`:4365`–`:4372`), where the default is no longer the maximum and equals `DEFAULT_LEVEL`,
    plus the refused `"6"` → `"8"` (`:4391`);
  - `src/uci-session.test.ts`: the `max 5` lines (`:122`, `:695`, `:950`, `:954`–`:956`);
  - `src/startup-questions.test.ts:36` (`LEVELS` text);
  - `src/engine.test.ts`: `HARD_CEILING_MS` toBe `5_000` (`:644`), and the rows at `:647`–`:662` re-read at the
    accepted value;
  - `src/cli.real-engine.test.ts:221` and `src/uci.real-engine.test.ts:79` (`HANG_GUARD_MS = 4 * HARD_CEILING_MS`)
    only if the constant's value moves, and then set so that their hang guards stay as they are today, at 20 s.
  - `src/ladder.test.ts` is **not** edited.
- **A14. Plants** (pre-registered; each must red at least one row at head):
  - P1: `LEVELS[7].budgetMs` 3 000 → `A1`;
  - P2: the clamp left at 5 000 → `A4` level 7 and `A9` bare `go`;
  - P3: `Skill Level` `max 5` kept → `A9`;
  - P4: `DEFAULT_LEVEL` 7 → `A2`;
  - P5: `--difficulty` words kept at 1–5 → `A6`.
- **A15. Value reading** (Security/NFR or QE, plain `node`, Apple M3, one session, `NFR-005`'s instrument):
  completed depth on `kiwipete` and `position-6` at level 5 (3 000 ms), level 6 and level 7.
  - **Bar:** level 7 ≥ level 5 + 1 on both positions, and level 6 ≥ level 5 on both.
  - Reported: depths and nodes. A miss is a wiring or clamp defect until shown otherwise. It is a stop to BA/PM, not a
    re-tune.

## NFR triggers

- **`NFR-004` (moves; owner).** The proposed text is in § Owner decisions owed. Readings: `A4` and `A5`. Security/NFR
  rules the row and `AR-NFR004-A` at the gate. The catalog's "If a level's budget ever reaches `HARD_CEILING_MS`, the
  ceiling residual becomes player-reachable" fires at level 6. Under the proposed text, the residual (≤ 31 ms) sits
  inside a 2 000 ms margin.
- **`NFR-005`: untouched.** Its referent is the default, level 5 at 3 s, with the 5 s ceiling. `A15` uses its
  instrument and does not grade it.
- **`NFR-008`:** `A12`. 0 files, 0 spawns. Security/NFR rules whether an `N8-LANE` reading is owed for edits only.
- **`NFR-009` (re-read at 30 s; Security/NFR, plain `node`).** Search-held memory at level 7 **≤ 16 MiB**, and growth
  between a 3 s and a 30 s search **≤ 1 MiB**. The table is allocated once (`ADR-0025`), so it is expected flat, but
  that is `UNKNOWN - verify`. Over = stop to the owner through the Orchestrator.
- **`NFR-011`, `NFR-012`: untouched.** `NFR-011` sends no `go`. `NFR-012` reads at default options (`Skill Level` 5).
  At 6–7 under a clock, `G`'s formula is the same and the level only lowers it.
- **`ADR-0044` D5, latency (fires).** One thread: `isready` and `stop` during a search are answered at most one
  budget late. That is about 7 s at level 6 and about 32 s at level 7, against about 5 s today. D5's first worker
  trigger, "the owner lifts the 5 s ceiling for UCI", fires. § Design owed rules it.
- **`KEY_ARRAY_CAPACITY` (128):** `src/search.ts:110` says it is "sized far above any depth … in `NFR-004`'s 5 s
  ceiling". The guard keeps a deeper search safe. `A4` logs the max completed depth at 30 s. If it is ≥ 100,
  Architect/Design is told.
- **Security (ASVS L1):** no new input class. The flag, answer and option are closed sets that grow by two words.
  `ADR-0036` clause (b): no capability import is expected. Security/NFR confirms at the gate.

## Test notes

1. Default lane: unit rows only, on the virtual clock (`A12`), plus `A7`'s read of the existing refusal child.
2. `ENGINE_DEEP` levels lane: `A4` adds about 2.5 min (level 6) plus 5 min (level 7) of wall. It runs at width 1 on a
   quiet host, **never during an `EPIC-008` harness reading** (both are alone-when-idle work).
3. `A3`, `A10` and `A15` are hand readings, recorded in QE's or Security/NFR's notes with raw files. `A3` runs the
   base and head trees from `git archive` copies.
4. UAT is owed: production lines change. The QE verdict signs it under the owner delegation (`…5aaf7cec` item 2). The
   owner may play a level-7 game; nothing waits on it.

## Size and priority

- **Size: M.** Data plus five surfaces plus one clamp, about 13 pins, two deep-lane rows and three hand readings. It is
  not split: the surfaces share one table and one set of pins, and a level that one surface offers and another refuses
  is a defect. The pre-registered split is in § Design owed.
- **Priority: P2.** It is the owner's own request. Nothing is broken without it, and `EPIC-008` (P2) is unaffected.

## Dependencies

- **Before the SE pull:** the owner accepts the `NFR-004` text and the `ADR-0045` amendment (Architect drafts it,
  PROPOSED). Moving a bound is his.
- **Files shared with `EPIC-008`:** `src/engine.ts` (`ABC-206`, `208`, `209`, `210`). `ABC-212` touches only the clamp
  line there. Whichever merges second rebases. Under `EPIC-008`'s staleness rule, `ABC-212`'s merge is value-identical
  at level 5 (`A3`), so it does not stale a D reading.
- **`ABC-204`'s `timemargin` rule** ("5 000 − budget") is read as "ceiling(level) − budget". At `Skill Level` 5 that
  is 5 000 − B, so it is unchanged. If the clamp constant's *value* moves, the `ABC-204` page's derivation line
  ("`HARD_CEILING_MS` (5 000)") gets a dated erratum from BA/PM at this ticket's merge.
- **`EPIC-004` / `ABC-085` `A1` vocabulary.** "The hardest difficulty" in `EPIC-004`'s acceptance and `ABC-085` `A1`
  was verdicted as level 5 (1v5, `ADR-0045` D6). It stays read that way. No 1v7 verdict is owed.
- **`ABC-087` `A5`** names "the hardest level". It is re-pinned to `LEVELS[5]` (`A4`), and levels 6–7 get their own rows.
- No dependency on `ABC-203`'s merge state.

## Design owed (Architect/Design, In Design first)

1. **The `ADR-0045` amendment, PROPOSED** (points in § Owner decisions owed), with the clamp shape:
   - **(i)** one absolute clamp at the largest ceiling, with each level's ceiling held by its budget;
   - **(ii)** a ceiling per level, carried with the level, which reopens D3's "a budget and a rate, and nothing else".
   - The criteria above hold under either.
2. **`ADR-0044` folds:** D4.1 (`G` for a `go` with no time = the level's budget, not `HARD_CEILING_MS`), D4.4 (the
   clamp), D11 (`max 7`, which levels take the rate-0 path), D5 (latency ~32 s).
3. **D5's worker trigger fired: rule it.** Either accept the latency at 6–7 in `ADR-0044` (a GUI that times out on
   `isready` or `stop` mid-search is told to stay at ≤ 5), or rule the worker owed first. **Pre-registered split:**
   if the worker is owed first, `A9`'s rows move to a new ticket (next free id), `ABC-212` ships with `Skill Level`
   `max 5`, and the CLI levels ship without waiting.

## Owner decisions owed (PROPOSED, for the Orchestrator to put to the owner)

**OD-212-1. The `NFR-004` text (blocks the SE pull).**
- Today: *"Engine returns a move in **≤ 3 s** at default difficulty; **hard ceiling 5 s** at any difficulty"*.
- **Proposed:** *"Engine returns a move in **≤ 3 s** at default difficulty (level 5); **hard ceiling per level: 5 s at
  levels 1–5, 7 s at level 6, 32 s at level 7** (a level above 5 gets its budget + 2 s)."* With a dated line: amended
  on the owner's word `…e44d2903`; levels 1–5 unchanged.
- **Why + 2 s.** It is the margin level 5 has today (5 000 − 3 000). It is the same rule `ABC-204`'s harness uses for
  `timemargin`. It holds the measured ≤ 31 ms overshoot (`AR-NFR004-A`) about 60 times over.
- **Options:** (a) as proposed; (b) budget + 0.5 s (5.5 s, 30.5 s); (c) one ceiling of 32 s at every level, so that
  levels 1–5 keep their 5 s by budget only and `NFR-005`'s "never exceeds the 5 s ceiling" needs a re-read.
- **Recommended: (a).**

**OD-212-2. The `ADR-0045` amendment points** (Architect writes the text; owner accepts):
1. D1: the table grows by 6 = 5 000/0 and 7 = 30 000/0. "Every adjacent pair differs by more than time alone" stops
   being true for 5v6 and 6v7 (rate 0 on all three).
2. D2: `DEFAULT_LEVEL` stays 5, and `HARDEST_LEVEL` becomes 7. "`DEFAULT_LEVEL = HARDEST_LEVEL`", "the default is
   called the hardest" and "there is no level above it" are retired. The owner's word overturns them.
3. D3: the level mechanism is unchanged. `src/engine.ts` changes at the clamp only (`RF-1`'s value or shape).
4. D4: `Skill Level` `max 7`; levels 6–7 take the rate-0 path; `G` with no time = the level's budget (with the
   `ADR-0044` folds above).
5. D6 / `ADR-0038`: levels 6–7 are outside the ladder; the 2026-10 verdict's "hardest" is level 5.
6. Consequences: `NFR-004` as in OD-212-1; `AR-NFR004-A`'s "the hardest level is the default, so clause A covers it"
   is retired; `NFR-005` unchanged; `NFR-009` re-read at 30 s; D5 latency.
7. Rollback: a data revert of two entries, `HARDEST_LEVEL` and the clamp.

**Questions that do not block (each has a default):**
- **OQ-212-1. Level 6 at 5 s plays almost like level 5.** `ADR-0045` measured 3 000 v 5 000 ms: deeper on 18 of 50
  positions, +0.36 ply, and a different move on 2 of 50. That is the "two levels are one engine" shape that `ADR-0045`
  was cut to remove. Options: (a) keep 5 s, as you said; (b) 9 s (3x, about +1 ply; ceiling 11 s). **Default: (a).**
- **OQ-212-2. "Up to 30 s"** is ruled as "spends 30 s" (§ "Up to 30 s"). Options: (a) as ruled; (b) a follow-up
  ticket that stops early on one legal move or a proven mate. That is an engine mechanism change, so it needs an ADR
  and an `EPIC-008` reading. **Default: (a).**
- **OQ-212-3. Under UCI, a GUI may give up on the engine at 6–7** if it pings `isready` or sends `stop` mid-search
  (the answer can come ~32 s late). Options: (a) accept, and use ≤ 5 in such GUIs; (b) build the worker first.
  **Default: whatever Architect/Design rules under D5.**
- **OQ-212-4. A measured ordering for 6 and 7** (ladder pairs 5v6, 6v7) costs an estimated ~10 h of host time.
  **Default: none.**

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word `…e44d2903`; user, pain and value stated |
| 2 | scope and out-of-scope | ✅ 7 scope items; early stop, worker, ladder and `EPIC-008` readings are out |
| 3 | INVEST | ✅ independent of `EPIC-008` (value-identical at 1–5); M; split pre-registered |
| 4 | testable, measurable acceptance | ✅ `A1`–`A15`: ms bounds, byte-exact texts, 50/50 identity, depth bar |
| 5 | dependencies known | ✅ owner acceptance (OD-212-1/2) before SE; Architect first; `engine.ts` shared with 206/208/209/210 |
| 6 | NFR triggers with targets | ✅ `NFR-004` per level; `NFR-009` ≤ 16 MiB / ≤ 1 MiB; `NFR-008` 0 files / 0 spawns / ≤ 30 readings |
| 7 | test notes | ✅ 4 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ the owner's word sets the levels; the text acceptance is a gate before the SE pull, not a blocker to design |

**DoR 10/10. Ready → In Design** (Architect/Design: § Design owed), then the owner's acceptance, then In Development.
