---
id: ABC-221
title: "`uci-clock-mode` over UCI (`TimeMode`): spends the real clock through a safe share with a hard stop, a 59.5 s budget under a 60 s ceiling, never loses on time"
status: ready
column: Ready
size: M
priority: P3
epic: EPIC-009
---

# ABC-221: `uci-clock-mode`: the real clock, a safety margin, a hard stop, a 60 s ceiling

> **DATED 2026-10-31 by BA/PM** (task `bapm-ABC-222-epic009-m1`, records only, at `main` `4bd9ac6a`).
>
> - **Milestone 1 is Done.** `ABC-222` merged at `ae7211c3` on QE's PASS (`qe-ABC-222` `…cc542c76`). It meets M1–M4
>   (`EPIC-009`).
> - **Both pull-order lines are met:** after `ABC-222` (Done) and after `ABC-244` (Done, `24b22339`). This ticket is
>   pullable.
>   - It shares `src/uci-session.test.ts` with `ABC-243` (In Development) and `ABC-242` (Ready). That is rebase order
>     only.
>   - The board's order, `ABC-243` → `ABC-242` → `ABC-221`, is the Orchestrator's.
> - **What `ABC-222` read on the real pipe:** the per-move overhead has a median of 0 ms and a max of +2 ms (561
>   searches, `AR-NFR004-A` at 22 s). D5's ≤ 600 ms slack is far from that. No row here moves.
> - Size M, P3 and DoR **10/10** are unchanged.

> **AMENDED 2026-10-30 by BA/PM** (task `bapm-g8-headroom-cut`, records only, at `main` `161e940d`). Source:
> `ADR-0046` § Addendum 2026-10-30 R1–R4 (`arch-g8-headroom`, `5fd3eee7`), given BA/PM's word on `ABC-244`'s page.
> `G8` read 9.90 s at `ABC-229` (`QE-229-a`): 0.10 s of headroom.
>
> - **A9 gains an R1 census line:** each real-engine default-lane row (A8's parity rows, A11's lane row, and any
>   other row that reaches the real `chooseMove`) records its clock reads per search in the build note. **The
>   period rows A2–A4 stay on the stubbed `chooseMove`**, as `ABC-220`'s do. A time-blind real-engine row takes its
>   R2 step at this build.
> - **Pull order:** after `ABC-244` (shared `src/uci-session.test.ts`). The pull after `ABC-222` stands.
> - The estimate is about +0.1 s of lane wall with the period rows stubbed, `UNKNOWN - verify`. A9's ≤ 10 s does not
>   move. Size M, P3 and DoR **10/10** are unchanged; rows 5 and 6 gain dated lines.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-ABC-220-merge-fold`, records only, at `main` `4ac4f3bb`). **Both waits
> are met:** the owner accepted `ADR-0052` (OQ-0052-1, `orch-2026-10-29g` `…3dd61448`; D4 and D6 as written, 59.5 s
> under 60 s), and **`ABC-220` merged at `ec1e835b`**, so `C` (`safeClockShare`), `TIME_MODES` and D3's rule are on
> `main`. **DoR 9/10 → 10/10. Backlog → Ready.** Pull order: after `ABC-222`, by the owner's "later" (milestone 2).
> The board move and the order are the Orchestrator's.
>
> - **A11 re-worded** to `ABC-220`'s split of A14 into A14a (lane row) and A14b (QE probe) (`arch-ABC-220-a14`). The
>   bound, the order and the count are unchanged. The existing A14a row pins the two-value option line, so it moves
>   with A1 at this build.
> - **A12 added (QE-220-a, LOW, from `qe-ABC-220` `…c6bdd364`):** QE-A3a's four asymmetric-increment rows go into
>   `src/uci-session.test.ts`'s `simple-tournament` A7 block, with the same four inputs in this mode. QE's mutant QM4
>   (the mode reads `winc` for either side) survives `npm test` today.
> - **Test note 5 added (`SEC-220-b`, INFO):** the `milliseconds` comment in `src/uci-session.ts` is corrected. No
>   behaviour changes, and no row is added.
> - **`NFR-008` headroom** is 0.27–0.31 s after `ABC-220` (QE-220-c). A9's bound is unchanged; the line under NFR
>   triggers names the risk.
> - **Size stays M**: 12 rows, one comment line. Priority P3.

> **RECONCILED 2026-10-29 to `ADR-0052` (PROPOSED) by BA/PM** (task `bapm-owner-words-b`, records only, at `main`
> `4dcb353e`). The Architect ruled the form, the allocation rule, the fallback, the margin, the stop, the ceiling and
> the D5 residual (`arch-epic009-settings` `…fa9e821e`, `…04fdc439`; `ADR-0052` D1, D2, D4–D9). The rows now pin it:
>
> - **Form:** `TimeMode` gains its third value at this build, and only then: `option name TimeMode type combo default
>   level var level var simple-tournament var uci-clock-mode`. cutechess: `option.TimeMode=uci-clock-mode`.
> - **Budget at `go`:** `movetime x` → `min(x, 59 500)`; a clock → `min(59 500, C)`; no time token → T (22 000). C is
>   `ABC-220`'s safe share, with nothing more.
> - **The ceiling:** `CLOCK_MODE_CEILING_MS` = 60 000, and the budget cap `CLOCK_MODE_MAX_BUDGET_MS` = **59 500**.
> - **The clamp:** `HARD_CEILING_MS` goes from 32 000 to **60 000** in `src/engine.ts` at this build (`ADR-0045` A3's
>   one-clamp shape). Each setting's own ceiling is held by its data. Levels 1–7 stay value-identical, because every
>   level budget is ≤ 30 000. The cut's "the 60 s ceiling replaces the 32 s clamp for this mode only" is replaced by
>   this rule (`ADR-0052` D6 rejects a per-call ceiling again).
> - **Rows added or changed:** A1, A5, A7, A8 and A10 pin the ruling. A11 re-reads `ABC-220`'s latency rows in this
>   mode.
> - **Wait:** the owner accepts `ADR-0052` (OQ-0052-1), then milestone 1. DoR stays 9/10.
>
> **RE-SCOPED 2026-10-29 by BA/PM** (task `bapm-amend-epic009`, records only, at `main` `a5d70e35`), on the owner's
> answers of 2026-10-29 (`orch-2026-10-29g` `…a67f71ac`).
>
> - **Was:** "a named mode", built under option (b) or (c), with a 32 s ceiling by default.
> - **Now:** the setting `uci-clock-mode`, the owner's milestone 2.
> - **The owner's words that rule it:**
>   - Q2: "later UCI clock mode";
>   - Q3: the name `uci-clock-mode`, "maybe separate inputs";
>   - Q5: "increase to 60s", replacing the 32 s clamp for this mode only;
>   - Q8: the measures.
> - **Priority P2 → P3.** The owner sequenced it after `simple-tournament` (`ABC-220`, `ABC-222`).
> - **Waits in Backlog on the Architect's ruling** (`arch-epic009-settings`: the form, the allocation rule, the
>   no-`movestogo` fallback, the margin, the hard stop, the 60 s ceiling and the D5 residual). It also waits on the
>   owner accepting that ADR, and on milestone 1.
> - It rests on today's behaviour as the System Analyst mapped it (`sa-ideas-verify` `…1ccf0010` §§ 3–5, 7, 9; `EPIC-009`
>   T3–T6), not on `owner-ideas.md` § B. The SA's § 9 names what blocks a clock mode today: the level cap, the 32 s
>   clamp, no time manager, and no measuring path. For this mode only, this ticket removes the first three. `ABC-223`
>   is the measuring path.
>
> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, at `main` `51c85f49`). The cut's text is in git at
> `f45aea95`.

## Problem

- **User:** a `cutechess-cli` match at a 40/15 clock, or any other clock (Q1).
- **Pain:** today the clock's share is capped at the `Skill Level`'s budget (T4), and at 32 s by the clamp. At the
  default level 5 it uses 13 % of a 40/15 clock. At level 7 the margin at a period's last move is 50 ms (T3).
  `simple-tournament` banks nothing: a book move's saved time is never spent.
- **Value:** one named setting that spends the clock it is given, up to 59.5 s on a move, keeps ≥ 1 s on the clock
  after every move, and never loses on time.

## Scope

All of it is `ADR-0052` (PROPOSED), D1, D2 and D4–D9. *(2026-10-30: ACCEPTED by the owner, `…3dd61448`; D4 and D6 as
written.)*

1. **The value `uci-clock-mode`** joins `TimeMode` at this build: `option name TimeMode type combo default level var
   level var simple-tournament var uci-clock-mode`. `setoption`, the exact-match tuple, the refusal line and
   `ucinewgame` behave as in `ABC-220`. `Skill Level` is not read in the mode (rate 0, D12's limits). Off by default.
2. **The budget at `go`** (D4):
   - `movetime x`: `min(x, CLOCK_MODE_MAX_BUDGET_MS)`;
   - a clock for the side to move: `min(CLOCK_MODE_MAX_BUDGET_MS, C)`, with `ABC-220`'s C (D2): the clock spread over
     `movestogo` (20 without it), the increment, `RESERVE` 1 000 ms and `OVERHEAD` 100 ms per move to go, and the hard
     stop `t − 1 100`. It is not capped at any level's budget;
   - no time token: T (22 000). A mode with no clock to read plays the tournament pace.
   - Nothing more: spending more on a hard move stays out (`EPIC-009` § Out of scope).
3. **The ceiling:** `CLOCK_MODE_CEILING_MS` = 60 000 (Q5) and `CLOCK_MODE_MAX_BUDGET_MS` = 60 000 − 500 = 59 500.
4. **The clamp** (D6): `HARD_CEILING_MS` 32 000 → **60 000**, and its header comment's numbers. Levels 1–7 stay held
   by `LEVELS[L].budgetMs`, `simple-tournament` by T, and the mode by 59 500.
5. **Where the code goes** (D8): `src/uci-session.ts` (the third value, D4's rule, the two constants) and one value in
   `src/engine.ts`. No new file. `src/levels.ts`, the CLI files and `src/search.ts` do not change.

## Out of scope

- Spending more time on a hard move, a soft/hard split, an early stop on a stable root (`ADR-0052` A10). Pondering.
  A worker for `isready` (`ADR-0044` D5 stands).
- Levels 1–7, the `Skill Level` default, and today's allocation when the mode is off. A per-call ceiling (`ADR-0045`
  A3, `ADR-0052` D6).
- `simple-tournament` (`ABC-220`). The CLI (`EPIC-009` § CLI parity). The real-clock games (`ABC-223`).

## Acceptance criteria

Rows A1–A9 and A11's default-lane row run on the virtual clock (`ADR-0027`). Each simulated search takes its budget
+ 31 ms (`AR-NFR004-A`'s bound), and a book move takes 0 ms. "The mode" means `setoption name TimeMode value
uci-clock-mode`. The numbers are `ADR-0052`'s arithmetic (`arch-epic009-settings` `raw/alloc.txt`).

- **A1 (offered, off by default).** **Given** `uci`, **then** the reply holds `option name TimeMode type combo default
  level var level var simple-tournament var uci-clock-mode`, byte-exact, after the `Skill Level` line (byte-identical
  to base) and before `uciok`. `setoption name TimeMode value uci-clock-mode` is accepted, and `ABC-220`'s A10
  refusals still hold for other values.
- **A2 (one 40/15 period).** **Given** the mode, **when** one whole period is played (900 000 ms, `movestogo` 40…1,
  no book moves), **then** the clock left after every one of the 40 moves is **≥ 1 000 ms** (1 069), and the period
  uses **≥ 85 %** of 900 s (99.9 %).
- **A3 (banked book time).** **Given** the same period with the first 6 moves from the book, **then** every move leaves
  ≥ 1 000 ms (1 069), and the 34 searched moves use ≥ 85 % of 900 s together (99.9 %).
- **A4 (three periods).** **Given** 120 moves across 3 periods (the clock gains 900 000 ms after moves 40 and 80),
  **then** every move leaves ≥ 1 000 ms (1 069), and each period uses ≥ 85 %.
- **A5 (hard stop).** **Given** the mode and `go wtime 3000 btime 3000 movestogo 1`, **then** the budget is
  **1 900 ms**, and the move leaves ≥ 1 000 ms of the 3 000 ms (1 069). **Given** `go wtime 800 btime 800`, **then**
  the budget is 1 ms, a move is still returned (the engine's unabortable depth 1), and the row records the clock used.
- **A6 (no `movestogo`).** **Given** `go wtime 900000 btime 900000` with no `movestogo`, **when** 80 moves are played
  with no added time, **then** every move leaves ≥ 1 000 ms (≥ 117 s by arithmetic).
- **A7 (the ceiling).** **Given** the mode:
  - `go wtime 3600000 btime 3600000 movestogo 40` (C ≈ 89 875) → budget **59 500**, deadline ≤ start + 60 000;
  - `go movetime 90000` → budget 59 500; `go movetime 5000` → 5 000;
  - a bare `go`, `go infinite` → budget **22 000** (T).
- **A8 (levels value-identical, `EPIC-009` M3).**
  - `git diff` base..head: `LEVELS[1..7]`, `DEFAULT_LEVEL` and the `Skill Level` default unchanged. `HARD_CEILING_MS` =
    60 000, the only `src/engine.ts` change.
  - **Given** `TimeMode` unset, and again `level`, at `Skill Level` 1–7, **when** A2's period is replayed, **then**
    every `go`'s budget equals base's, row for row.
  - **Given** `Skill Level` 7 and `go movetime 60000`, **then** the search gets 30 000 (the level's cap), as at base.
    A bare `go` at a level is still the level's budget. The blunder path's `min(level.budgetMs, HARD_CEILING_MS)` is
    unchanged in value.
  - `simple-tournament`'s rows (`ABC-220` A2–A7) still pass unchanged.
- **A9 (`NFR-008`).** The default lane gains 0 real-clock rows. `npm test` wall stays ≤ 10 s at load1 ≤ 8. Any
  default-lane row that hands the engine an unclamped budget (the `RF-1` rows) still makes the same number of clock
  reads: its virtual step scales with the clamp, as at `ABC-212` (`ADR-0046`). The SE checks this at the build.
  *(Amended 2026-10-30, `bapm-g8-headroom-cut`, `ADR-0046` § Addendum R1–R4.)*
  - **R1 census.** Each default-lane row that reaches the real `chooseMove` on a virtual clock (A8's parity rows,
    A11's default-lane row, and any other such row this build adds or edits) has one line in the build note: its
    title, budget, step and clock reads per search (⌈budget ÷ step⌉).
  - **The period rows A2–A4 stay on the stubbed `chooseMove`**, as `ABC-220`'s A2–A7 do. They read budgets and the
    clock left, so a real search adds cost and no check.
  - **R2.** A real-engine row whose assertions read no `time`, elapsed time, virtual-time bound or depth on a budget
    takes the coarsest step in {1, 10, 100, 1 000} that keeps its assertions and QE's kill set (`ABC-244`'s
    conditions 1–3). A row that reads time keeps its step.
  - Estimate: about +0.1 s of lane wall, `UNKNOWN - verify` until `G8` reads it. If this ticket's `G8` head median
    reads > 9.6 s, `ABC-244`'s tranche-2 trigger fires.
- **A10 (wall, depth and memory at 59.5 s, deep lane).** **Given** 3 fixed positions, **when** each is searched once
  in the mode at a 59 500 ms budget on the real clock, **then** each returns in **≤ 60 000 ms** of wall, the max
  completed depth is logged against `KEY_ARRAY_CAPACITY`'s tripwire (≥ 100 → the Architect), and search-held memory
  stays ≤ 16 MiB, with growth ≤ 1 MiB (`NFR-009`, measured as `ABC-212` measured it). It runs in the `ENGINE_DEEP`
  lane, ALONE (~3–4 min).
- **A11 (busy `isready`; re-worded 2026-10-30, `bapm-ABC-220-merge-fold`).** *(Was: "`ABC-220`'s A13 (default lane)
  and A14 (opt-in real-child lane) pass with `TimeMode` `uci-clock-mode`." `ABC-220`'s A14 was split into A14a and
  A14b on 2026-10-30, `arch-ABC-220-a14`.)* A11 is MET only when all three are met:
  - **A13 in the mode (default lane).** `ABC-220`'s A13 passes with `TimeMode` `uci-clock-mode`: exactly one
    `readyok`, after the `bestmove`, in order.
  - **A14a in the mode (`UCI_DEEP`, `src/uci.real-engine.test.ts`).** `ABC-220`'s A14a fixed script, with
    `setoption name TimeMode value uci-clock-mode` in place of `simple-tournament`, meets every A14a bullet. The
    existing `simple-tournament` A14a row still passes. Its option-line expectation becomes A1's three-value line.
  - **A14b in the mode (QE hand reading, outside vitest).** At the QE hop QE runs `ABC-220`'s A14b protocol once with
    `TimeMode` `uci-clock-mode`. The script is a copy of `qe-ABC-220`'s `probe/a14b-probe.mjs` with the one
    `setoption` value changed, kept under QE's own task context. **R1** ≤ 100 ms, **R2** busy and **R3** one
    `readyok` per `isready` are graded as `ABC-220` A14b states, with the same record and the same "one run counts"
    rule.

- **A12 (the side to move reads its own increment; added 2026-10-30, QE-220-a).** In `src/uci-session.test.ts`'s
  `simple-tournament` A7 block, with `go wtime 10000 btime 10000 movestogo 10` and the increments below, the budget
  is:
  - Black to move, `winc 0 binc 2000` → **2 800**;
  - Black to move, `winc 2000 binc 0` → **800**;
  - White to move, `winc 2000 binc 0` → **2 800**;
  - White to move, `winc 0 binc 2000` → **800**.

  `C` = (10 000 − 1 000 − 10 × 100) / 10 + the side's own increment = 800 + inc, under the hard stop 8 900, and
  below T, so `C` binds. The same four inputs in `uci-clock-mode` give the same four budgets, because `C` is also
  below 59 500. These are QE-A3a's rows (`qe-ABC-220` `raw/qrows/qrows-v1.txt`). A plant that makes a mode read `winc`
  for either side (QE's QM4) turns that mode's two Black rows red in `npm test`.

The 1 000 ms reserve on the virtual clock leaves room for pipe and GUI latency under `EPIC-009` M1's ≥ 500 ms closest
call: M1 survives δ ≤ 600 ms on a period's last move at 40/15 (`ADR-0052` D5). `ABC-223` reads M1 on the real clock.

## NFR triggers

- **`NFR-004` (owner's, Q5): a 60 s ceiling for the mode.** Proposed text (`ADR-0052` § Consequences), placed by
  Security/NFR at this gate: *"; 60 s in UCI `TimeMode` `uci-clock-mode` (budget ≤ 59.5 s). The engine's one clamp
  sits at the largest ceiling in force, 60 s."* `NFR-004` clause B's bound on a raw `chooseMove` call moves from 32 s
  to 60 s, by the owner's Q5. A7, A8 and A10 read it. `AR-NFR004-A` is re-read at 59.5 s.
- **`NFR-009`:** 59.5 s is outside `ABC-212`'s 30 s reading, so A10 re-reads it (≤ 16 MiB, growth ≤ 1 MiB)
  (`RISK-EPIC009-07`). A flat reading is expected because the table is allocated once; that is `UNKNOWN - verify`.
- **`ADR-0044` D5 latency:** `isready` and `stop` are answered ≤ one budget late, ≤ 60 s in this mode. Accepted with
  no worker (`ADR-0052` D7). cutechess pings only between moves, and sends a mid-search `stop` only at a game end or
  when pondering. The accepted-risk entry placed at `ABC-220`'s gate already names ≤ 60 s. A11. *(2026-10-30: placed as
  `AR-UCI-BUSY` beside `NFR-011`, owner Architect/Design. In this mode 59 500 + ~31 + 100 < 60 000, so "≤ 60 s" is
  read exactly; Security/NFR re-reads it at this gate.)*
- **`NFR-008`:** A9. **`NFR-005`, `NFR-011`, `NFR-012`:** unchanged (their referent is `TimeMode level`).
  - *(2026-10-30, QE-220-c.)* After `ABC-220` the headroom under 10 s is 0.27–0.31 s (`A12` 9.69 s; `G8` head
    9.73 s). `ABC-229` and `ABC-243` also add rows. This ticket adds about 12 virtual-clock rows. A9's ≤ 10 s does not
    move. If the wall crosses 10 s, A9 is NOT MET and the Orchestrator's `NFR-008` watch takes it; it is not waived
    here. The added wall is `UNKNOWN - verify` until read.
- **Security (ASVS L1):** the closed set gains one value. `go`'s numbers are already parsed and refused today.

## Test notes

1. Default lane: A1–A9, A11's first row and A12 on the virtual clock, in `src/uci-session.test.ts`'s pattern
   (`ADR-0027`). A2–A7 are each one simulated sequence. *(A12 added 2026-10-30.)*
2. `ENGINE_DEEP` lane: A10, ALONE, never during a reading. Opt-in real-child lane (`UCI_DEEP`): A11's second row.
   A11's third row is QE's probe, run once in QE's ALONE window, never through vitest. *(Amended 2026-10-30.)*
3. UAT is owed. The QE verdict signs it. `ABC-223` is the real-clock smoke.
4. **Owed at merge:** BA/PM folds the dated line into `ADR-0045` § AMENDMENT A3 (`HARD_CEILING_MS` 60 000).
   *(2026-10-30: also the `uci-clock-mode` halves of `ADR-0044`'s folds, left at `ABC-220`'s merge: D3's third `var`,
   D4.5's clock-mode line with D4.4's clamp at 60 000, and D5's ≤ 60 s.)*
5. **Carried note (`SEC-220-b`, INFO, pre-existing; added 2026-10-30).** `milliseconds` in `src/uci-session.ts` is
   documented as "any finite decimal number", but a figure longer than 308 digits parses to ±Infinity. QE found every
   branch safe (QE-220-d): ±Infinity and NaN reach T, the cap or depth 1. **BA/PM's call: fix the comment, not the
   rule.** The SE rewords that one comment to say what it returns, including ±Infinity. No behaviour changes, and no
   row is added. If the SE finds the rule itself should change, that is a new ticket, not this one.

## Size and priority

- **Size: M.** One value, one rule over `ABC-220`'s C, two constants, one clamp value, and 11 rows *(12 from
  2026-10-30: A12, plus one comment line)*. Variable
  allocation is out, so it is not L.
- **Priority: P3.** It is the owner's milestone 2 ("later"), after `ABC-220` and `ABC-222`.

## Dependencies

- **The owner accepts `ADR-0052` (OQ-0052-1).** It is PROPOSED; nothing is built on it until he answers. *(Met
  2026-10-30, `…3dd61448`: accepted, D4 and D6 as written.)*
- *(2026-10-30, `bapm-g8-headroom-cut`.)* **Pull after `ABC-244`** (cut 2026-10-30, P1, test-only), which changes
  step literals in `src/uci-session.test.ts`. This ticket rebases on it. That is order, not a design wait.
- **Milestone order:** after `ABC-220` and `ABC-222` (the owner's "later"). It **uses `ABC-220`'s C and `TimeMode`**,
  so `ABC-220` merges first. That is a code dependency now, not only a pull order. *(Met 2026-10-30: `ABC-220` merged
  at `ec1e835b`. The pull order after `ABC-222` stands.)*
- **`EPIC-010`'s `G9`** ("`HARD_CEILING_MS` byte-identical") binds `EPIC-010`'s own diffs. This ticket moves the
  clamp. If both are in flight, whichever merges second rebases, and the Orchestrator orders them.
- Owner answers: all in (Q2, Q3, Q5, Q8; 2026-10-29).

## Definition of Ready (re-scored 2026-10-30, `bapm-ABC-220-merge-fold`; was 9/10 on 2026-10-29, `bapm-owner-words-b`)

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word (Q2, Q3, Q5); user, pain and value stated |
| 2 | scope and out-of-scope | ✅ 5 scope items, each from `ADR-0052`; variable allocation, levels, per-call ceiling and CLI out |
| 3 | INVEST | ✅ M; testable; builds on `ABC-220`'s C (named) |
| 4 | testable, measurable acceptance | ✅ A1–A12: byte-exact lines, ms, %, a row-for-row identity, ≤ 60 000 ms wall, ≤ 16 MiB, R1 ≤ 100 ms, four exact budgets (A12) |
| 5 | dependencies known | ✅ `ADR-0052` (ACCEPTED 2026-10-30); `ABC-220` merged at `ec1e835b`; `EPIC-010` `G9`. *2026-10-30:* pull after `ABC-244` (shared test file) |
| 6 | NFR triggers with targets | ✅ `NFR-004` 60 s (owner's word; text proposed); `NFR-009` ≤ 16 MiB re-read; `NFR-008` ≤ 10 s (headroom 0.27–0.31 s named); `AR-UCI-BUSY` ≤ 60 s. *2026-10-30:* headroom 0.10 s (`QE-229-a`); A9's R1 census line per real-engine row owed; period rows stubbed |
| 7 | test notes | ✅ 5 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ✅ `ADR-0052` accepted (2026-10-30) and `ABC-220` merged (`ec1e835b`). *(Was ❌: the owner's acceptance of `ADR-0052`, OQ-0052-1.)* |

**DoR 10/10 (2026-10-30). Ready.** Pull it after `ABC-222` (milestone 1 closes first, by the owner's "later"). That
is pull order, not a DoR gap. It shares `src/uci-session.ts` with any ticket in flight on that file; the Orchestrator
orders them. *(Was: "DoR 9/10. Backlog. It waits on the owner accepting `ADR-0052`.")*
