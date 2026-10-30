# Architect/Design observation, arch-ABC-220-a14: the D5 bound reading (F2), and what the next roles need

## F2: how "≤ 22 s" in the busy-latency entry is read (for Security/NFR's entry beside NFR-011)
- The latency has three terms: one budget (the budget the `go` handed, ≤ 22 000 ms in `simple-tournament`, which A6 reads exactly), plus `AR-NFR004-A` (the abort overshoot, ≤ ~31 ms), plus the drain (≤ 100 ms, A14b R1). The worst case is an `isready`/`stop` that arrives together with the `go`: ≈ 22 131 ms.
- **"≤ 22 s" is read to the whole second: a delay < 22 500 ms.** This is the same reading as A11's wall, and it follows the owner's "no need to implement fraction of a second ceiling". It is not read as ≤ 22 000 ms exactly. With the budget equal to the ceiling, the overshoot alone passes that, and the owner ruled out a sub-second margin.
- **Entry text for Security/NFR to place:** *"busy `isready`/`stop`: answered ≤ one budget + `AR-NFR004-A` late; ≤ 22 s in `simple-tournament` (read to the whole second: < 22 500 ms), ≤ 60 s in `uci-clock-mode`; one `readyok` per `isready`, in order"*.
- In `uci-clock-mode`, 59 500 + ~31 + 100 < 60 000, so "≤ 60 s" holds exactly. `ABC-221` re-reads that at its gate.
- The whole-second reading is the same one the ticket's FOLDED note already asks the owner to confirm. It blocks nothing and changes no code. If he rejects it, only this entry's text and A11's bound move. No new owner item.

## For QE (qe-ABC-220)
- Write and run A14b's probe (ticket test note 5). It may start from `qe-ABC-168`'s `probe/a6-probe.mjs`, but take load1 from `os.loadavg()[0]` (that probe's `sysctl` read is macOS only). Write `isready` 100 ms after `go`. Record R1 in ms and R1–R3 as met or missed, plus `go`→`bestmove` and `go`→`isready` (not graded). Run it ALONE, separately from A11 and A12.
- A14a is the existing `UCI_DEEP` lane at `68ba364c`, unchanged.

## Seen, not acted on
- `ADR-0044` D5's text still reads "about 5 s" and the `ADR-0045` A4 fold. The `simple-tournament` fold line (≤ 22 s, now with the whole-second reading) is owed by BA/PM at `ABC-220`'s merge (ticket test note 4). This hop did not add it.
- `NFR-011`'s cell names the macOS `sysctl` load read. The host is now Linux. That is Security/NFR's cell, so it was left as is.
