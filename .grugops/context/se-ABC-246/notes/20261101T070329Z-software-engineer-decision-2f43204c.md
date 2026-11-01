---
id: 20261101T070329Z-software-engineer-decision-2f43204c
kind: decision
by: software-engineer
at: 2026-11-01T07:03:29Z
verified_by: 
confidence: high: two rows and one comment as the ticket words them; the comment's figure was measured
refs:
  - se-ABC-246
  - ABC-246
  - EPIC-009
  - ADR-0052
  - NFR-008
  - QE-221-a
  - SE-221-g
  - SE-246-a
  - ABC-221
  - ABC-170
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-8ad25906
  - qe-ABC-221/20261031T060935Z-qe-e2e-observation-c6f37a35
  - se-ABC-221/20261031T053932Z-software-engineer-observation-7896971d
  - grugops/ABC-246
  - 3c5e05fd
  - 832ff246
  - src/uci-session.test.ts
  - src/engine.test.ts
supersedes: 
seal: sha256:5c4f82425b689d50f28a24f0838b704dfe8fcfea9388a16023e34da3c15ced84
---

# `ABC-246` built as the ticket words it: two rows in `ABC-221`'s block, one comment fixed in `src/engine.test.ts`, no production line

- **Where the rows sit.** They are in a new nested `describe("ABC-246 (QE-221-a) — the hard stop with an increment, and
  movetime over a clock, in the mode")`, last inside `describe("ABC-221 — TimeMode uci-clock-mode over UCI (ADR-0052
  D4)")`. A nested block keeps the ticket id in the row's full name, so QE's red lists and the trace find it. Every
  existing `ABC-220` / `ABC-221` row is unedited (the diff on `src/uci-session.test.ts` is 18 added lines, 0 removed).
- **Form.** This is A7's form on the stubbed `chooseMove`: `session220()`, `rig221.send(CLOCK_MODE)`, `position
  startpos moves e2e4`, the `go` line, then `handed.map(({ budgetMs }) => budgetMs)` equal to `[budget]`. A1 does not
  read the clock left through `replayClock`. The ticket's test note 1 makes that optional and grades the budget.
  - A1: `go wtime 3000 btime 3000 winc 500 binc 500 movestogo 1` → `[1_900]`.
  - A2: `go wtime 900000 btime 900000 movestogo 40 movetime 5000` → `[5_000]`.
  - The row titles name the figure a broken build hands: 2 400 for A1 and 22 375 for A2.
- **SE-221-g comment (A4).** The ticket offered two routes, a figure derived at `HARD_CEILING_MS` 60 000 or no count.
  I chose the figure: the ceiling is 60 000 ms, a 1 ms-step `tickingClock` reads about 60 000 times before the
  deadline, and the 6 000-node budget ends the search after about 10. The "about 10" was measured: the block's exact
  call (kiwipete, `budgetMs` = `HARD_CEILING_MS`, step 1, `maxNodes` 6 000) read the clock **9** times
  (`raw/abc170-a2-readings.txt`). The comment went from one JSDoc line to four. The code and assertions are unchanged.
- **Not done (fenced):** QE-221-b (`src/levels.ts` header) and any production line.
