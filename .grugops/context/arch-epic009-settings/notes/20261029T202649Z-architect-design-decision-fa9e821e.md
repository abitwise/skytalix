---
id: 20261029T202649Z-architect-design-decision-fa9e821e
kind: decision
by: architect-design
at: 2026-10-29T20:26:49Z
verified_by: 
confidence: high on the rules and arithmetic; PROPOSED until the owner accepts ADR-0052
refs:
  - arch-epic009-settings
  - EPIC-009
  - orch-2026-10-29g/…a67f71ac
  - sa-ideas-verify/…1ccf0010
  - memory-bank/50-decisions/ADR-0052-two-uci-time-modes-simple-tournament-and-uci-clock-mode-arrive-as-one-timemode-combo-beside-skill-level-over-one-safe-clock-share.md
  - ADR-0044
  - ADR-0045
  - NFR-004
  - NFR-009
  - NFR-011
  - NFR-008
  - AR-NFR004-A
  - RISK-EPIC009-02
  - ABC-219
  - ABC-220
  - ABC-221
  - ABC-222
  - bapm-amend-epic009
  - EPIC-010 G9
  - src/uci-session.ts
  - src/engine.ts
supersedes: 
seal: sha256:c14ff717085fa02cc6df8ed3c9407a0412ad84b74a49cc886cf685bf51ef1009
---

# Design ruling, EPIC-009's two settings: one `TimeMode` combo; simple-tournament T = 22 000 ms under 22 500; one safe clock share C; the clock mode's 60 s ceiling moves the one clamp at its own build

Recorded as `ADR-0052` (status **proposed**; the owner accepts or declines it), at
`memory-bank/50-decisions/ADR-0052-two-uci-time-modes-simple-tournament-and-uci-clock-mode-arrive-as-one-timemode-combo-beside-skill-level-over-one-safe-clock-share.md`.
Governed by the owner's words `orch-2026-10-29g/…a67f71ac`. Evidence: the observation note of this task, and SA `…1ccf0010`.
`bapm-amend-epic009` cites this note for the form and the rules.

## Scope

The input form for both settings, the per-move budget rules, the overhead model, the ceilings, the engine clamp, the
single-thread latency, and the NFR text proposed for the owner. Records only: no `src/`, `tools/`, epic, ticket or board edit.

## The ruling

1. **Form: a UCI `combo`, `TimeMode`, beside `Skill Level`.**
   - At the simple-tournament build: `option name TimeMode type combo default level var level var simple-tournament`.
   - At the uci-clock-mode build it gains `var uci-clock-mode`, and only then.
   - `Skill Level` stays byte-identical (`spin default 5 min 1 max 7`). `LEVELS`, `Difficulty`, `DEFAULT_LEVEL`,
     `HARDEST_LEVEL` and the CLI do not change.
   - The value matches exactly against a frozen tuple. A bad value keeps the old one and writes one `info string`.
     `ucinewgame` does not reset it.
   - While `TimeMode` is not `level`, `Skill Level` is not read: rate 0, the `chooseMove` path with D12's limits. The
     blunder path and `random` are not reached.
   - cutechess lines: `option.TimeMode=simple-tournament` and `option.TimeMode=uci-clock-mode` (no quoting needed).
   - CLI: nothing. If parity is ever wanted, it is a separate flag (`--time-mode`), never a `Difficulty` value. Whether
     `ABC-219` stays is BA/PM's.
2. **One safe share for both modes:** `C = max(1, min((t − 1000 − m·100)/m + inc, t − 1100))`, where m is
   `movestogo`, or 20 without it. RESERVE is 1 000 ms at the control and OVERHEAD is 100 ms per move. The second term is
   the hard stop on the reported clock, enforced by the engine's existing deadline. It is closed-loop: it is recomputed
   at every `go`.
3. **simple-tournament:** T = **22 000 ms** = the 22 500 ms ceiling − 500 ms.
   - The budget is `movetime ? min(x, T)`, else, with a clock, **`min(T, C)`**, else T.
   - It does **not** ignore `wtime`. The clock caps it through C, not through D4.1's G, whose `t − 50` at a period's
     last move misses M1.
   - At 40/15, C starts at 22 375 and grows, so T binds on all 40 moves. 18 760 ms are left after move 40 and 97.9 %
     is used; 83.2 % with 6 book moves.
4. **uci-clock-mode (later milestone):** the budget is `movetime ? min(x, 59 500)`, else, with a clock, `min(59 500, C)`,
   else T.
   - The ceiling is 60 000. It is not capped by any level.
   - At 40/15 the closest call is 1 069 ms (virtual, δ = 31) and 99.9 % is used. `ABC-221` A2–A7 hold by arithmetic.
5. **Clamp:** `HARD_CEILING_MS` 32 000 → 60 000 at the uci-clock-mode build only, in `ADR-0045` A3's one-clamp shape.
   Each setting's ceiling is held by its data: levels by `LEVELS` (unchanged), simple-tournament by T, the clock mode by
   59 500.
   - Levels 1–7 are value-identical: every budget is ≤ 30 000.
   - A raw `chooseMove` call is then bounded at 60 s: the owner's Q5. The simple-tournament build does not touch
     `src/engine.ts`.
6. **Overhead model:**
   - overshoot ≤ ~31 ms (`AR-NFR004-A`) and the pipe 1–3 ms (SA P1/P4/P5) sit inside OVERHEAD = 100 ms;
   - cutechess's own read is `UNKNOWN - verify`;
   - D4.1's 50 ms stays for `TimeMode level` only;
   - RESERVE is 1 000 ms; the margin under each ceiling is 500 ms;
   - M1 (≥ 500 ms) survives δ ≤ 600 ms on a period's last move at 40/15, and ≤ 456 ms per move at tc=40/60.
7. **Latency (`ADR-0044` D5):** `isready`/`stop` mid-search are answered ≤ one budget late: ≤ 22.5 s and ≤ 60 s.
   - Accepted, no worker. cutechess pings only between moves, and sends a mid-search `stop` only at a game end or when
     pondering, then kills after `IdleTimeout` 15 s.
   - **Owed:** an accepted-risk entry beside `NFR-011` (Security/NFR; no new bound), a default-lane in-order `readyok`
     row, and an opt-in real-child row (`go movetime 2000`, then `isready`; `readyok` ≤ 100 ms after `bestmove`).
8. **Code location:**
   - simple-tournament: `src/uci-session.ts` only, with no new file;
   - clock mode: plus one value in `src/engine.ts`.

## NFR-004 change (proposed text; the owner's bound, placed by Security/NFR)

- At the simple-tournament build, append to the accepted text: *"; 22.5 s in UCI `TimeMode` `simple-tournament`
  (budget 22 s)"*. The clamp stays 32 000.
- At the uci-clock-mode build, append: *"; 60 s in UCI `TimeMode` `uci-clock-mode` (budget ≤ 59.5 s). The engine's one
  clamp sits at the largest ceiling in force, 60 s."*
- `AR-NFR004-A` is re-read at 22 s and at 59.5 s. A `NFR-009` re-read is owed at 59.5 s only. `NFR-005`, `NFR-011` and
  `NFR-012` are unchanged (their referent is `TimeMode level`).

## Risks

- `RISK-EPIC009-01` (flag at a period's last move): closed by design (C's reserve), and read by the smoke readings.
- `RISK-EPIC009-02` (a GUI gives up mid-search): accepted to 60 s (point 7). Other GUIs `UNKNOWN - verify`.
- `RISK-EPIC009-03` (no `movestogo`): cutechess v1.5.1 sends it. Without it, C spreads over 20 and stays safe.
- New: the clamp move meets `EPIC-010`'s `G9` (`HARD_CEILING_MS` byte-identical). G9 binds `EPIC-010`'s own diffs.
  Whichever merges second rebases; the Orchestrator orders them.
- Security (ASVS L1): one closed-set option; no new input class.
