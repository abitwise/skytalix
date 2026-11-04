# ADR-0071 PROPOSED (W1): soft limit = budget ÷ 2.3 in uci-clock-mode under a clock; the partial move kept on exact scores; read at tc=40/8 after a harness ticket

Text of record: `memory-bank/50-decisions/ADR-0071-…md` on `grugops/arch-ABC-282`. Readings: this task's observation
note.

## Decisions (what the ADR fixes, as `ABC-282` row 10 asks)

- **D1, the modes: reading (a), narrowed.** W1 acts only in `uci-clock-mode` with the side to move's clock and no
  `movetime`. `level`, every `movetime`, `simple-tournament` (any tokens) and a bare `go` are node-identical to `main`.
  - `simple-tournament` is out: T binds every 40/15 move, so M2 would read 62.7 % (42.6 % in the worst case).
  - Reading (b) is rejected: at a fixed budget the head is 1 ply shallower on 22 of 125 rows.
- **D2, the rule.** At each iteration boundary, one clock reading t. Iteration d + 1 starts only if t < deadline (today)
  and t − start < softMs, where softMs = hard ÷ b.
  - b = `ITERATION_GROWTH` = 2.3, measured: P1's pooled median 2.3319.
  - It is continuous in the time left and the same at every clock (R-TC part 1 item 2). The test sits before
    `runIteration`, so 0 nodes of a doomed iteration are visited.
- **D3, the limits.** The hard limit is unchanged: min(59 500, C), clamped at 60 000. The soft limit is hard ÷ 2.3, in
  D1's row only; every other row has none. `NFR-004` holds by construction, D2's 1 ms floor excepted.
- **D4, the partial test.** On abort, the latest root move M whose completed depth-(d + 1) score is strictly above the
  incumbent's completed depth-(d + 1) score is played. The incumbent is searched first; P3 counted 0 exceptions.
  Otherwise the incumbent is played, as on `main`. Mate scores take the same `>` with no special case.
- **D5, reporting.**
  - `depth` is still the deepest completed iteration.
  - `move` and `score` are the played move's.
  - A new optional field `EngineChoice.partial?: true`, present only when a move is kept.
  - UCI: `info string partial depth <d + 1>` before the `info depth` line.
- **D6, the seam.**
  - Engine: `EngineOptions.softMs?`. No new export, door or switch, because `softMs` absent is `main` (I0, 125 of
    125).
  - Session: `ITERATION_GROWTH` and `softMs` in `parseGo`'s clock branch for `uci-clock-mode`.
- **D7, the `ABC-078` A3 amendment.**
  - (i) Without a soft limit: unchanged, and the old row stays.
  - (ii) With a soft limit: D4's rule; the new rows are `ABC-282` A2.
  - The `src/engine.ts` header paragraph at :26–31 is replaced.
  - `ABC-078` A4's loop-header text pin is re-pointed.
- **D8, A0's counts** (on `main` `5853d17f`):
  - frozen clock, kiwipete d6 / d7 / d8: 144 120 / 346 458 / 766 275; position-6: 15 209 / 35 436 / 87 475;
  - `virtualClock(1)`, 50 / 200 ms: kiwipete 48 408 / 199 960, position-6 44 105 / 196 681;
  - the session rows A0-3.
- **D9, A1 (c).**
  - Corpus: K25, `qe-tc-depth-probe` R1's 25 (named.json `e41a4914…`, positions.json `63d88b2a…`).
  - Clock: `virtualClock(1)`, H ∈ {25, 50, 100, 200, 400}, so 125 rows.
  - Head: softMs = H / 2.3. Base: softMs absent.
  - Share: (nodes − N_frozen(depth)) / nodes. Bar: the head's median strictly below the base's.
  - Forecast 0.3766 → 0.0000. Lane: `ENGINE_DEEP`.
- **D10, the read (A6).**
  - Control: `tc=40/8` on both sides, `timemargin=0`, `option.TimeMode=uci-clock-mode` on both.
  - C2′'s shape (100 games, head against merge-base, openings 1–50 both colours, `OwnBook` on, `restart=on`,
    `-maxmoves 200`, width 1, ALONE).
  - Intent: **GAIN**. MET on 100 / 100, 0 losses on time, 0 faults, ≥ 50.0. About 40 min (estimate).
  - S′ is a fault smoke only, because st= means W1 is off. The Levels lane is not owed.
- **D11, A4.** 5 games at 40/15, unchanged.
  - M1 holds by D2's arithmetic.
  - M2 is the risk: the worst case is 72.5 % / 69.0 %, measured use gives ≥ 85.2 %. F5 routes a miss here.
- **D12, `ABC-283`.** The second to land rebases:
  - D4 generalised per pass under aspiration: the incumbent exact inside the pass window, and M exact or failing high
    above it;
  - b re-read by P1's method;
  - A0 re-read;
  - an `ADR-0066` d5 dated line;
  - the text conflicts in `deepen` and `runIteration`.

## The harness finding

On `main` the harness cannot play a clock: `tools/rating/rating.ts` emits only `st=`, and `d` takes `--budget-ms`
only. **A tools ticket must land before A6.** Its scope is the owed line below, for BA/PM to cut; it is not cut here.

## Owner question (for the Orchestrator to put)

- **OQ-0071-1: accept ADR-0071?** Options: (a) as written; (b) as written, plus the partial-move rule in every mode as
  its own follow-up; (c) decline. The recommendation is (a).
- The build may start on PROPOSED (`ABC-282` front matter, reading (b)).

## Owed lines

**BA/PM, on `plans/tickets/ABC-282-…md`:**
1. **Front matter `adr:`** → "`ADR-0071` PROPOSED 2026-11-04 (`arch-ABC-282`); the owner accepts (OQ-0071-1); reading
   (b) lets the build start on PROPOSED".
2. **DoR row 10:** "✅ 2026-11-04, Architect/Design (`arch-ABC-282`; `ADR-0071` PROPOSED): the rule (soft = budget ÷
   2.3, b measured), the limits per mode, the partial-iteration test, the modes (reading (a) narrowed to
   `uci-clock-mode` under a clock), the `ABC-078` A3 amendment, A0's counts, A1 (c)'s corpus and clock, the read's
   control (`tc=40/8`) and intent (GAIN) are fixed." Then re-score the DoR. Row 5 gains the harness ticket.
3. **Scope 4:** reading (a) as `ADR-0071` D1 narrows it. `simple-tournament` is out, with the M2 arithmetic, and is
   node-identical to `main` with every token. **Scope 5:** replace `UNKNOWN - verify` with D5.
4. **A0:** D8's rows A0-1, A0-2 and A0-3 with their counts. They are re-read on the merge-base if `ABC-283` lands first.
5. **A1 (c):** D9's corpus, clock, head and base, share and bar. `ENGINE_DEEP`. QE freezes it before the build.
6. **A2 (c):** D4's mate sentence as the stated row.
7. **A3 (b):** add "except `ADR-0052` D2's floor of 1 ms, where depth 1 answers at once".
8. **A4:** unchanged, 5 games. M2 is the watched row (R-0071-1).
9. **A6:** D10's control, shape, intent GAIN and wall estimate. S′ is a fault smoke only. The Levels lane is not owed.
   It runs only after the harness ticket merges.
10. **§ Dependencies and § Size:** the harness ticket comes first. Size M → **L**, by the page's own rule ("It becomes L
    if the harness needs a clock mode first").
11. **Test note 3:** the old row is `src/engine.test.ts` "A3 — an aborted iteration's move is discarded, not returned"
    (and its deep twin), unchanged as A3 (i). The new rows are A2 (a)–(c), as A3 (ii).
12. **`NFR-008`:** A0-1, A0-2 and A1 (c) go in `ENGINE_DEEP`. An optional default slice is position-6 at 50 ms
    (44 105 nodes).

**BA/PM, on the `ABC-078` page:** A3's amended text (D7), dated, "in force when `ABC-282` merges".

**BA/PM, the harness ticket to cut** (tools only, XS–S, P2; its id is BA/PM's — ABC-300 is the next free id on `main`,
`UNKNOWN - verify` at the cut):
- `d` accepts `--tc 40/8`, the only value. Each skytalix side gets `tc=40/8`, `timemargin=0` and
  `option.TimeMode=uci-clock-mode` in place of `st=` and `timemargin=`.
- The rest is as `d --budget-ms 100`.
- `machine.txt` gets a `control:` line.
- `--tc` with `--budget-ms` is refused, and any other `--tc` value is refused.
- A `--dry-run` row for `d <c> <b> <out> --tc 40/8 --rounds 50 --concurrency 1`.
- Every existing `r`, `d` and `rpair` dry run stays byte-equal, and the `pair-check` rows stay unedited.
- 0 lines under `src/` (R-TC item 4).

**BA/PM, on `EPIC-011`:** row W1 and Tickets row 34 get `ADR-0071` PROPOSED and the harness ticket. The harness ticket
gets a new Tickets row.

**The Orchestrator:**
- put OQ-0071-1 to the owner;
- order `ABC-282` after `ABC-283` (D12);
- order the harness ticket before `ABC-282`'s A6.
- The board moves are yours.

**The Scribe, at the build:** the `AGENTS.md` UCI time-mode line (`ADR-0071`), within the byte budget.

## Records written by this task

- `ADR-0071` (new);
- `ADR-0056` row W1's last cell;
- `ADR-0052` a dated line under § Alternatives (A10 taken up).

No ticket, EPIC, board, `src/` or `tools/` file was edited.
