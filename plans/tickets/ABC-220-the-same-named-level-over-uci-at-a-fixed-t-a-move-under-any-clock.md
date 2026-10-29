---
id: ABC-220
title: "`simple-tournament` over UCI: a fixed T a move (22.0 s proposed) under a 22.5 s hard ceiling, levels 1–7 unchanged"
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-009
---

# ABC-220: `simple-tournament` over UCI, a fixed T a move under a 22.5 s hard ceiling

> **RE-SCOPED 2026-10-29 by BA/PM** (task `bapm-amend-epic009`, records only, at `main` `a5d70e35`), on the owner's
> answers of 2026-10-29 (`orch-2026-10-29g` `…a67f71ac`).
>
> - **Was:** "the same named level over UCI", option (a) only, S, after `ABC-219`.
> - **Now:** the `simple-tournament` setting itself, over UCI. It takes in the retired `ABC-219`'s core: the setting,
>   a fixed T, and rate 0. The CLI is out (`EPIC-009` § CLI parity). The size grows S → M.
> - **The owner's words that rule it:**
>   - Q1: cutechess, so UCI is the surface;
>   - Q2: "22.5 second separate difficulty setting" first;
>   - Q3: the name `simple-tournament`, "maybe separate inputs";
>   - Q4: a "22.5 ceiling";
>   - Q8: 0 losses on time, closest call ≥ 500 ms, ≥ 75 % per period.
> - **T = 22 000 ms is proposed** under the ceiling (`EPIC-009` § The budget T). The owner is told the number.
> - **Waits in Backlog only on the Architect's ruling** (`arch-epic009-settings`): the input form, the `go`
>   interaction, and T if he refines it. It also waits on the owner accepting that ADR.
>
> **Cut 2026-10-29 by BA/PM** (task `bapm-epic009-tournament`, at `main` `51c85f49`) as option (a)'s UCI half. The
> cut's text is in git at `f45aea95`.

## Problem

- **User:** a `cutechess-cli` match at a 40/15 clock, engine against engine (Q1).
- **Pain:** no setting is named for 40/15. `Skill Level` 7 gets ~22.5 s a move only when the GUI sends a clock, with
  ~50 ms left at a period's 40th move (`EPIC-009` T3–T4). That can lose on time.
- **Value:** one named setting that a match selects. It thinks a fixed T a move, never more than 22.5 s, and it keeps a
  margin at every period's end by arithmetic.

## Scope

1. **The setting `simple-tournament`:**
   - per-move budget T = 22 000 ms (proposed; the Architect's ruling may refine it);
   - blunder rate 0;
   - a **hard ceiling of 22 500 ms** on every move: no `go` (clock, `movetime`, `infinite`, bare) makes it think
     longer.
2. **Selectable over UCI** in the form per the Architect's ruling. Its `uci` lines are as ruled, and so is the exact
   `cutechess-cli` line `option.<Name>=<value>` that selects it.
3. **How it meets a `go` clock**, per the Architect's ruling: a GUI clock caps it (today's D4.2 `min(G, budget)`), or it
   ignores `wtime`/`btime`. Either meets `EPIC-009` M1 and M2 at 40/15 (§ The budget T). The rows below pin whichever is
   ruled.
4. **Off by default.** With it not selected, every `go` behaves exactly as at base.

## Out of scope

- The CLI (flag, start-up question, PGN tag): `EPIC-009` § CLI parity.
- Levels 1–7, the default (5), the `Skill Level` default (5) and the 32 s clamp for levels.
- Clock-based allocation (`ABC-221`). An early stop on a forced move (`RISK-EPIC009-06`). Think-time display (Q7).
- The real-clock games (`ABC-222`).

## Acceptance criteria

Rows A2–A5 and A7 run on the virtual clock (`ADR-0027`). Each simulated search takes its budget + 31 ms
(`AR-NFR004-A`'s bound), and a book move takes 0 ms. "The setting" means `simple-tournament` selected in the ruled form.

- **A1 (offered, off by default).** **Given** `uci`, **then** the reply offers the setting in the ruled form, byte-exact.
  The `Skill Level` line still reads `default 5 min 1 max 7`. With nothing set, no `go` differs from base (A7).
- **A2 (no clock).** **Given** the setting and `go` with no time token, **then** the search gets `budgetMs` = T
  (22 000).
- **A3 (one 40/15 period).** **Given** the setting, **when** one whole period is played (`go` carries the clock left
  and `movestogo` 40…1, from 900 000 ms, no book moves), **then** every move's `budgetMs` = T, and the clock left after
  the 40th move is **≥ 18 000 ms** (arithmetic: 900 000 − 40 × 22 031 = 18 760). The period uses **≥ 75 %** of 900 s
  (97.9 %).
- **A4 (book moves).** **Given** A3's period with its first 6 moves from the book, **then** the period uses ≥ 75 % of
  900 s (83.2 %), and every move leaves ≥ 18 000 ms.
- **A5 (no `movestogo`).** **Given** the setting and `go wtime 900000 btime 900000` with no `movestogo`, **when** 40
  moves are played with no added time, **then** every move leaves **≥ 1 000 ms**, and the 40 moves use ≥ 75 % of
  900 s. The row records the clock left after move 40. By arithmetic it is ~165 s under a GUI cap and ~18.8 s with no
  cap.
- **A6 (the hard ceiling).** **Given** the setting, **when** `go movetime 30000`, `go infinite`, a bare `go`, and
  `go wtime 3600000 btime 3600000 movestogo 40` (share 90 s) are each sent, **then** each search's budget is ≤ T, and
  its deadline is ≤ start + 22 500 ms. The rows read the deadline that the engine is handed.
- **A7 (levels unchanged, `EPIC-009` M3).**
  - `git diff` base..head shows `LEVELS[1..7]`, `DEFAULT_LEVEL` and the `Skill Level` default unchanged, and
    `HARD_CEILING_MS` still 32 000 for levels.
  - **Given** the setting not selected and `Skill Level` 1–7, **when** A3's period is replayed, **then** every `go`'s
    budget equals base's, row for row.
- **A8 (rate 0).** **Given** the setting, **when** 10 non-book moves are played with a seeded random source, **then** 0
  of 10 take the blunder path.
- **A9 (wall, deep lane).** **Given** 5 fixed positions, **when** each is searched once with the setting on the real
  clock in plain `node`, **then** each returns in **≤ 22 500 ms** of wall, and the max is recorded. It runs in the
  `ENGINE_DEEP` lane, never in the default lane, and ALONE (~2 min).
- **A10 (`NFR-008`).** The default lane gains 0 real-clock rows. `npm test` wall stays ≤ 10 s at load1 ≤ 8.

## NFR triggers

- **`NFR-004` (owner's, Q4): a 22.5 s ceiling for the setting.** It departs from the "budget + 2 s" rule by his word.
  The Architect names the change and Security/NFR places the line. A6 and A9 read it, and `ABC-222` reads it on games.
  `AR-NFR004-A` (≤ ~31 ms) is re-read at the gate.
- **`NFR-009`:** 22.5 s is inside `ABC-212`'s 30 s reading (≤ 16 MiB). No re-read is owed.
- **`NFR-008`:** A10.
- **`ADR-0044` D5:** an `isready` or `stop` during a search is answered up to ~22.5 s late, against level 7's 32 s
  today (`RISK-EPIC009-02`). It is accepted unless the Architect rules otherwise.
- **Security (ASVS L1):** one value in a closed set, in the ruled form. No new input class.

## Test notes

1. Default lane: A1–A8 and A10, on the virtual clock, in `src/uci-session.test.ts`'s pattern (`ADR-0027`). A3–A5 are
   each one simulated sequence.
2. `ENGINE_DEEP` lane: A9, ~2 min, ALONE, never during a reading.
3. UAT is owed (production lines change). The QE verdict signs it (`…5aaf7cec` item 2). `ABC-222` is the real-clock
   smoke.

## Size and priority

- **Size: M.** The setting's data, a UCI input of the ruled form, a per-setting ceiling below the 32 s clamp, and 10
  rows. `ABC-212` was M for a similar spread. If the ruled form needs more, re-size at Ready.
- **Priority: P2.** It is the owner's own idea and his milestone 1. Nothing is broken without it.

## Dependencies

- **The Architect's ruling (`arch-epic009-settings`):** the form, the `go` interaction, T, and the ADR text (amendments
  to `ADR-0044` and `ADR-0045`, or a new ADR, PROPOSED). The owner accepts it. This is the only open blocker.
- Shares `src/uci-session.ts` (and maybe `src/levels.ts` or `src/engine.ts`) with `ABC-221`, which is milestone 2.
  Whichever merges second rebases.
- Owner answers: all in (Q1–Q4, Q8; 2026-10-29).

## Definition of Ready (re-scored 2026-10-29)

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word (Q1–Q4); user, pain and value stated |
| 2 | scope and out-of-scope | ✅ 4 scope items; CLI, levels, clock mode and games out |
| 3 | INVEST | ✅ independent of `ABC-221`; M; testable |
| 4 | testable, measurable acceptance | ✅ A1–A10: ms, %, a row-for-row identity, wall ≤ 22 500 ms |
| 5 | dependencies known | ✅ the Architect's ruling, named; owner answers in |
| 6 | NFR triggers with targets | ✅ `NFR-004` 22.5 s (owner's word); `NFR-009` ≤ 16 MiB inside the 30 s reading; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ❌ **the Architect's ruling** (`arch-epic009-settings`: form, `go` interaction, T) and the owner's acceptance of its ADR |

**DoR 9/10. Backlog. It waits only on the Architect's ruling.** When that lands and the owner accepts it, BA/PM fills
in the ruled form in A1, A3 and A6, and the ticket goes to Ready.
