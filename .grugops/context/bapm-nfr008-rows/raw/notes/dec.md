# bapm-nfr008-rows decision: ABC-281 cut (S, P2, EPIC-011 lane hygiene); DoR 9/10, held in Backlog on the Architect's confirmation, which is ruled needed

BA/PM, task `bapm-nfr008-rows`, records only, on `grugops/bapm-nfr008-rows` from `main` `3e87ceaf`. Nothing was run. The authoritative text is the page `plans/tickets/ABC-281-…` (§ Scope, § The Architect's confirmation, § Acceptance criteria, § Risks, § Definition of Ready). This note gives the decisions and the trace ids.

## 1. The ticket
- **`ABC-281`**, size `S` (low end), `P2`, epic `EPIC-011` (lane hygiene, outside the phase order; `EPIC-010` is done). Test-only, so UAT is waived at delivery by the standing rule; QE's verdict signs.
- **Scope:** three rows to their own files' existing deep lanes, as Security/NFR recommends (`secnfr-nfr008-headroom` `…8a4fb936`). R1 is `QE-208-a` position-6, from `src/search.null-move.test.ts` to `SEARCH_DEEP`. R2 is `ABC-230` A4, from `src/engine.test.ts` to `ENGINE_DEEP`. R3 is levels A9, from `src/levels.test.ts` to `ENGINE_DEEP`. Bodies stay byte-identical; titles take each file's own deep suffix. No new file (`R-N8H-3`).
- **`AGENTS.md`:** only the null-move line carries a count ("44 rows"). It becomes the tip's deep total, expected 45: 0 B net, against 18 429 / 18 432 B. A digit-boundary crossing would cost +1 B and still fit. The engine and levels lines carry no count, so no edit. The SE does it in the delivered commit, with a command-log entry, or the Orchestrator routes it to a Scribe inside the ticket's diff.
- **Acceptance A1–A9:**
  - A1, the name-only list;
  - A2, bodies byte-identical;
  - A3, the lane at base − 3, 0 skipped;
  - A4, "1 passed" per moved row with escaped `-t`, and each deep lane's count + 1;
  - A5, `AGENTS.md` ≤ 18 432 B;
  - A6, a frozen mutant matrix: killed or not by the default lane and by the deep lane;
  - A7, gates;
  - A8, `NFR-008` graded: pre-registered, ALONE, B / H / H2 identity twin (`ADR-0035` D1), n ≥ 8, H ≤ 10 s MET, > 10 s to the owner, ≥ 9.6 s the Orchestrator's `Q-N8H-1` trigger;
  - A9, Security/NFR records `R-N8H-1`'s state.
- **Risks on the page:** `R-N8H-1` (MEDIUM, Orchestrator / Architect), `R-N8H-2` (LOW, Architect), `R-N8H-3` (INFO, BA/PM, applied), plus `R-281-a` (LOW: moved coverage runs only when a deep lane runs). `Q-N8H-1` is held by the Orchestrator and not asked.

## 2. The Architect's confirmation: ruled NEEDED, as DoR row 11, and narrowed
- **The floor account is not the ground.** No file leaves the lane and no per-file cost changes. That is the content account, BA/PM's at each cut (`NFR-008` row, plans/nfr-catalog.md).
- **Coverage is the ground.** `ADR-0046` § Addendum 2026-10-31 (the T2b census) and BA/PM's own `ABC-248` ruling ("Why not T2b") put moving `QE-208-a` to `SEARCH_DEEP` at the owner's option (b). The reason given there: it takes `ADR-0050`'s abort-restores-root guard out of the default lane, where no other row holds it. `ADR-0046` § Consequences lets a row leave only under default-lane kill parity, and only on the tranche-2 ticket. BA/PM cannot reverse that by a ticket line.
- **Security/NFR's "what stays" list for R1 does not hold that guard** (see the observation). R2 and R3 each move a single-holder property.
- **The question to Architect/Design:** one form per row, as a dated line. W is a whole move, with the reason option (b) does or does not bind; if it binds, the Orchestrator routes it. S is a slice: the remnant keeps the kill in the default lane. K keeps the row, which then leaves the ticket. The acceptance is written for all three forms, so any pick makes it Ready with no re-cut. BA/PM's lean, not binding: W for R2 and R3, S for R1.

## 3. Board
- `ABC-281` stays in `Backlog`, DoR 9/10. Row 10 waits on row 11. `plans/board.md` is not edited; the card and the column moves are the Orchestrator's.
