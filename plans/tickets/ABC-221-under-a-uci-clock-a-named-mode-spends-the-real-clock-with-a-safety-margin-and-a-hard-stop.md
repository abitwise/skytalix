---
id: ABC-221
title: "`uci-clock-mode` over UCI: spends the real clock with a safety margin and a hard stop, 60 s per-move ceiling, never loses on time"
status: backlog
column: Backlog
size: M
priority: P3
epic: EPIC-009
---

# ABC-221: `uci-clock-mode`: the real clock, a safety margin, a hard stop, a 60 s ceiling

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
- **Value:** one named setting that spends the clock it is given, up to 60 s on a move, keeps a margin on every move,
  and never loses on time.

## Scope

1. **The setting `uci-clock-mode`,** selected over UCI in the form per the Architect's ruling, and off by default.
2. **With it on and a clock in `go`:** the budget comes from the side's remaining clock, `movestogo` and the increment,
   less a safety margin, as the Architect rules. It is **not** capped at a level's per-move budget. It is capped at
   **60 000 ms** (Q5).
3. **A hard stop:** the search's deadline is never later than the remaining clock less the margin, whatever the share.
4. **Without `movestogo`:** a fallback rule the Architect sets, held to the same margin.
5. **With it on and no clock in `go`:** the Architect rules the budget, never above 60 000 ms.
6. **The 60 s ceiling replaces the 32 s clamp for this mode only.** Levels 1–7 and `simple-tournament` keep theirs.

## Out of scope

- Spending more time on a hard move (a search change; `EPIC-009` § Out of scope). Pondering. A worker for `isready`.
- Levels 1–7, the `Skill Level` default, the 32 s clamp for levels, and today's allocation when the mode is off.
- `simple-tournament` (`ABC-220`). The CLI (`EPIC-009` § CLI parity). The real-clock games (`ABC-223`).

## Acceptance criteria

Rows A1–A9 run on the virtual clock (`ADR-0027`). Each simulated search takes its budget + 31 ms (`AR-NFR004-A`'s
bound), and a book move takes 0 ms. "The mode" means `uci-clock-mode` selected in the ruled form.

- **A1 (offered, off by default).** **Given** `uci`, **then** the mode is offered in the ruled form, byte-exact, and
  off by default. `Skill Level` still reads `default 5 min 1 max 7`.
- **A2 (one 40/15 period).** **Given** the mode, **when** one whole period is played (900 000 ms, `movestogo` 40…1,
  no book moves), **then** the clock left after every one of the 40 moves is **≥ 1 000 ms**, and the period uses
  **≥ 85 %** of 900 s.
- **A3 (banked book time).** **Given** the same period with the first 6 moves from the book, **then** every move leaves
  ≥ 1 000 ms, and the 34 searched moves use ≥ 85 % of 900 s together.
- **A4 (three periods).** **Given** 120 moves across 3 periods (the clock gains 900 000 ms after moves 40 and 80),
  **then** every move leaves ≥ 1 000 ms, and each period uses ≥ 85 %.
- **A5 (hard stop).** **Given** `go wtime 3000 btime 3000 movestogo 1` with the mode on, **then** the search's deadline
  leaves ≥ 1 000 ms of the 3 000 ms. **Given** `wtime 800`, **then** a move is still returned (the engine's
  unabortable depth 1), and the row records how much clock it used.
- **A6 (no `movestogo`).** **Given** `go wtime 900000 btime 900000` with no `movestogo`, **when** 80 moves are played
  with no added time, **then** every move leaves ≥ 1 000 ms.
- **A7 (the 60 s ceiling).** **Given** a clock whose share is above 60 s (for example `go wtime 3600000 btime 3600000
  movestogo 40`, a 90 s share), **then** the budget is ≤ 60 000 ms. **Given** `go movetime 90000` or a bare `go`,
  **then** the budget is ≤ 60 000 ms.
- **A8 (off: unchanged, `EPIC-009` M3).** **Given** the mode off and `Skill Level` 1–7, **when** A2's period is
  replayed, **then** every `go`'s budget equals base's, row for row. `HARD_CEILING_MS` is still 32 000 for levels.
- **A9 (`NFR-008`).** The default lane gains 0 real-clock rows. `npm test` wall stays ≤ 10 s at load1 ≤ 8.
- **A10 (wall and memory at 60 s, deep lane).** **Given** 3 fixed positions, **when** each is searched once with the
  mode at a 60 s budget on the real clock, **then** each returns in ≤ 60 000 ms + 31 ms of wall. Search-held memory
  stays ≤ 16 MiB, with growth ≤ 1 MiB (`NFR-009`, measured as `ABC-212` measured it). It runs in the `ENGINE_DEEP` lane,
  ALONE (~3–4 min).

The 1 000 ms on the virtual clock leaves room for pipe and GUI latency under `EPIC-009` M1's ≥ 500 ms closest call.
`ABC-223` reads M1 on the real clock.

## NFR triggers

- **`NFR-004` (owner's, Q5): a 60 s ceiling for the mode,** above today's 32 s clamp, for this mode only. The Architect
  names the change and Security/NFR places the line. A7 and A10 read it.
- **`NFR-009`:** 60 s is outside `ABC-212`'s 30 s reading, so A10 re-reads it (≤ 16 MiB, growth ≤ 1 MiB)
  (`RISK-EPIC009-07`).
- **`ADR-0044` D5:** `isready` and `stop` are answered up to one budget late, up to 60 s (`RISK-EPIC009-02`).
  `cutechess-cli`'s 15 000 ms `IdleTimeout` after a mid-search `stop` is a known kill (`ADR-0045` A4). The Architect
  rules on this residual and names the row it owes.
- **`NFR-008`:** A9.
- **Security (ASVS L1):** one value in a closed set, in the ruled form. `go`'s numeric tokens are already parsed and
  refused today.

## Test notes

1. Default lane: A1–A9 on the virtual clock, in `src/uci-session.test.ts`'s pattern (`ADR-0027`). A2–A7 are each one
   simulated sequence.
2. `ENGINE_DEEP` lane: A10, ALONE, never during a reading.
3. UAT is owed. The QE verdict signs it. `ABC-223` is the real-clock smoke.

## Size and priority

- **Size: M.** One allocation rule with its margin, stop and fallback, an option, a per-mode ceiling above the clamp,
  and 10 rows. It is not L, because variable allocation is out. If the ruled ceiling change spreads past the engine's
  one clamp, re-size at Ready.
- **Priority: P3.** It is the owner's milestone 2 ("later"), after `ABC-220` and `ABC-222`.

## Dependencies

- **The Architect's ruling (`arch-epic009-settings`):** the form, the allocation rule, the fallback, the margin, the
  stop, the 60 s ceiling and the D5 residual. The ADR is an `ADR-0044` D4/D5 amendment, or a new ADR, PROPOSED. The
  owner accepts it.
- **Milestone order:** after `ABC-220` and `ABC-222` (the owner's "later"). It needs no code from them. It shares
  `src/uci-session.ts` with `ABC-220`, so whichever merges second rebases.
- Owner answers: all in (Q2, Q3, Q5, Q8; 2026-10-29).

## Definition of Ready (re-scored 2026-10-29)

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ owner word (Q2, Q3, Q5); user, pain and value stated |
| 2 | scope and out-of-scope | ✅ 6 scope items; variable allocation, levels and CLI out |
| 3 | INVEST | ✅ independent of `ABC-220` in code; M; testable |
| 4 | testable, measurable acceptance | ✅ A1–A10: ms, %, a row-for-row identity, ≤ 60 000 ms, ≤ 16 MiB |
| 5 | dependencies known | ✅ the Architect's ruling, named; milestone 1 |
| 6 | NFR triggers with targets | ✅ `NFR-004` 60 s (owner's word); `NFR-009` ≤ 16 MiB re-read; `NFR-008` ≤ 10 s |
| 7 | test notes | ✅ 3 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P3 |
| 10 | no major unresolved blocker | ❌ **the Architect's ruling** (`arch-epic009-settings`) and the owner's acceptance of its ADR |

**DoR 9/10. Backlog.** It waits on the Architect's ruling. Its sequence after milestone 1 is a pull-order matter, not
a DoR gap.
