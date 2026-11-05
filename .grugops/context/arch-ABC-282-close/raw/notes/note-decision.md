# arch-ABC-282-close: `ADR-0071` is in force from `a6ae8227`; `ADR-0066` decision 5 has its dated line; QE-282-l moves no decision and adds two dated lines; one Security/NFR read is owed, records only; BA/PM changes `ABC-223`'s disposition c

Architect/Design, task `arch-ABC-282-close`, records only, on `grugops/arch-ABC-282-close` from `main` `2e46933f`. Nothing was run. Inputs: `qe-ABC-282` `…5191f871`, `…4f8f7f5d`, `…1434a7d1`; `orch-2026-10-30a` `…16e0ec2c`; `bapm-ABC-282-close` `…77657fed`.

**1. `ADR-0071` § Status.** IN FORCE 2026-11-05, from `ABC-282`'s merge `a6ae8227`. The ACCEPTED block stays under *Before the merge*. Two log rows.

**2. `ADR-0066` decision 5.** The dated line says what D12 item 5 says: "`ABC-078` `A3` unchanged" reads "`A3` as amended by `ADR-0071` D7 (with a soft limit only)". One log row. `ABC-282` landed second, so the line was owed at this merge.

**3. QE-282-l, ruled: no decision, value or bar moves, and nothing is re-opened.**
- The hard limit did what D3 says. The 59 500 cap, `C`, b and the 60 000 ceiling stay. 59 501 ms is 499 ms under the ceiling, and the 500 ms is `ADR-0052` D4's designed margin. F5 did not fire, so D11's route to b, the soft limit's form or a last-move rule stays closed.
- **`ADR-0071` D11, dated line.** "`C` hands out the whole remainder" was wrong above the cap, and it was written that way. The budget is min(59 500, C), so the clock above it carries to the next period. D11's figures stand: both scripts apply the cap.
- **`ADR-0071` § Consequences, `NFR-004`, dated line.** The ADR did not state that W1 brings the cap into play at 40/15. It does now, with `AR-UCI-BUSY`'s reading.
- **`AR-UCI-BUSY`, mine to rule.** The bound stays ≤ 60 s. The wait is now real in play, about 59.5 s, where it was about 25 s. A4 read 0 `isready` during a search, and no `ADR-0044` D5 trigger fires.
- **Not decided.** Whether these late moves are the best use of the time is `UNKNOWN - verify`. Spreading them differently moves a budget formula, which is the owner's. Five games do not ask him to, so there is no owner question.
- **R-0071-1, which `…1434a7d1` left to the Architect:** read, and nothing follows. M2's least is 93.16 %, above D11's modelled 87.8 %. Later periods are read to P2 only (QE-282-n). No ADR line. R-0071-2 stays open at LOW: M2 held to depth 17, and b was not measured there.

**4. A Security/NFR read is owed: records only, no run, no gate, blocking nothing, no owner item.** The reasons:
- `secnfr-ABC-221` named `ABC-223`'s games as the next real-clock reading at this bound, and those games never reached the cap. A4 is the first reading in play.
- `NFR-004`'s `Verified by` cell still reads `UNKNOWN - verify` until QE's `A10` re-run. That re-run landed long ago (59 500.8 ms, `ABC-221`'s page, `ADR-0044` D5). Only Security/NFR moves that cell.
- `AR-NFR004-A` is Security/NFR's to re-accept with its number. The Architect cannot do that. QE-223-d's +2.5 ms is waiting for the same hop.

What to read: the 60 s clause against 59 501 ms; `AR-NFR004-A` against A4's +3.9 ms, on a host under foreign load. `secnfr-census-1105`'s brief does not cover this. The route is the Orchestrator's. A move ≥ 59 900 ms or an overshoot past ~31 ms would be a new question, not this read.

**5. The page line for BA/PM.** `plans/tickets/ABC-223-smoke-reading-uci-clock-mode-plays-5-games-at-40-15-with-0-losses-on-time.md` line 40 at `2e46933f`, § CLOSED, disposition "c (INFO, A5)", the sentence "The cap is not approached at 40/15." Suggested text, struck and kept:

> ~~The cap is not approached at 40/15.~~ (true until `ABC-282`'s merge `a6ae8227`) *2026-11-05 (`ADR-0071`, QE-282-l): under W1 the cap is reached at 40/15: 13 of 606 budgets at 59 500, longest move 59 501 ms. No bar moved.*

Leave these lines as they are:
- `ABC-223` line 26 and `EPIC-009` line 27: readings, true of their run.
- `ABC-223` lines 67 and 102: that ticket's expectation for its own games.
- `ABC-223` line 48: "the cap" there is the move cap, not the 59 500 cap.
- `qe-ABC-223` `…5c8f2995` and `bapm-epic009-close` `…d9cef956`: sealed.
