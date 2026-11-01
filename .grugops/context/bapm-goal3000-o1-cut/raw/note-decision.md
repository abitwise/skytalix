# Goal restated to 3 000 Elo (scale `UNKNOWN - verify`, MQ-3000 open); `ADR-0055` option O1 cut as `EPIC-010` milestone 1b: `ABC-250`–`ABC-254`; O1-e not cut; no algorithm ticket touched

**Source:** the owner's word of 2026-11-01, verbatim in Orchestrator `orch-2026-10-30a` `…74216a44` ("my call is let's go with 1, least effort and risk. … Set the goal to 3000 elo rating from current goal."). `ADR-0055` (PROPOSED, read in full at `bae25131`) § D1 O1 table, D3 bars, D4 order, D6 "what BA/PM would cut". Records only; nothing run, built or timed (`qe-ABC-223` ALONE).

## 1. The goal
- `EPIC-010` § Product goal: a dated 2026-11-01 block with the verbatim quote. **3 000 Elo replaces "2 700 Elo or more"**; the old bullet is struck and kept; the 2026-10-29 block is kept as recorded. The rest of the 2026-10-29 goal (best vibe-engineered / TypeScript-based engine; no neural net; no Rust rewrite) is not withdrawn by his word.
- **Still no ticket, gate or measure bound to it**; Q5's "no Elo target" on M2 stands. Whether 3 000 becomes a measure is the owner's (new Q6), after `arch-algo-analysis`.
- **Scale `UNKNOWN - verify`** (he named none).
- **MQ-3000 named, not settled:** R today = skytalix level 5 at 4 000 ms vs Stockfish 19 `UCI_LimitStrength` `UCI_Elo` 1 910 at `st=0.5` (`tools/rating/rating.ts`), 8× time odds; milestone 1 head 72.00 % ± 6.11 ≈ +164 over 1 910 (BA/PM arithmetic, logistic), a figure on Stockfish's scale under those odds, not on any list; `UCI_Elo` caps at 3 190. Open: scale (owner), time control and odds, opponents, game count and precision, next milestones' measures. Routed to `arch-algo-analysis` (its brief item 5).
- Also: `EPIC-004` top `_Updated:` line and a dated sub-bullet under the removed ~1700 non-goal; `EPIC-010` § Out of scope (≥ 2 700 line struck, 3 000 line added) and Q2 row (dated).

## 2. The O1 tickets (all value-identical, S2, 0 games; graded on nps like `ABC-235`/`ABC-240`)
| pull | id | cut | size | prio | DoR | column (recommended) |
|---|---|---|---|---|---|---|
| first only if allowed in time | ABC-254 | O1-d lazy legality (`ADR-0003` (c2)); bar ≥ 1.10× on 2 of 3 boards, position-4 in-check guard ≥ 0.97× | M | P2 | 9/10 | Backlog: waits the owner's yes (Q-SP-3) + an ADR amending `ADR-0003` clauses 1 and 3 |
| 1 | ABC-250 | O1-b part 1: packed int moves in per-ply typed arrays for generation, legality, make/unmake; perft on the packed path; search untouched. A4 = `ADR-0055` D3's A1/A0 bar on perft (GO ≥ 1.25× → merge; HOLD 1.10–1.25× / NO-GO < 1.10× → not merged, dropped); search guard ≥ 0.98× | M | P2 | 10/10 | Ready |
| 2 | ABC-251 | O1-b part 2 + O1-c (paired, as `ADR-0055` folds O1-c into O1-b): search, quiescence, ordering, killers on packed moves; `Move` built once at `chooseMove`'s return; inlined helpers. Full form bar ≥ 1.10× (2 of 3, ≥ 1.00 third); narrowed to O1-c alone on HOLD/NO-GO, bar ≥ 1.03× | L (S narrowed) | P2 | 9/10 | Backlog until ABC-250's reading |
| 3 | ABC-252 | O1-b part 3 (the shell adapter): one generator, the shell through one converter; nps guard ≥ 0.98× | M | P3 | 9/10 | Backlog; dropped if ABC-250 is dropped |
| 4 | ABC-253 | O1-a: keys as two u32 halves in search, TT, repetition scan; `bigint` at the API (zobristKey, book, history, gameend, levels, UCI, priorKeys converted once); bar ≥ 1.02× (ceiling ≈ 1.04×, so 1.03 would demand 3/4 of it; the 5-run resolution is `UNKNOWN - verify`, D3 validity applies) | M | P3 | 10/10 | Ready, pulled after the O1-b chain |
- **O1-e not cut** (`ADR-0055`: "S; not proposed now"). Recorded in § Milestone 1b.
- **Split rationale:** `ADR-0055` D6 splits O1-b into core / search / shell adapter. BA/PM staged the core ticket so its perft reading is taken before the L-sized search ticket is spent: the unrun prototype's A1/A0 reading happens in ABC-250, and the chain can stop there. The two records that disagree on O1-b's yield (`ADR-0003` (c4): < 1.24× per call; `qe-ABC-240`: allocation under-charged 4–15×) are why.
- **Architect checks named at design:** value-identity (as `arch-ABC-235`); `ADR-0003` clause 1 read as "make/test/unmake stays the strategy" for ABC-250/252 (if read literally, they wait on that reading).

## 3. Placement: `EPIC-010` milestone 1b, not a new epic
The S2 rule and its precedents (`ABC-235`, `ABC-240`) live on `EPIC-010`; milestone 1b collides with milestone 2 on files (`orderMoves`, evaluate, search, TT, legal.ts), and `EPIC-010` § Dependencies orders those collisions; `ADR-0055` D2's order (speed first, then milestone 2) is a statement about this epic's sequence; five S2 tickets with no measure of their own do not earn an epic. Against: the page is long; the speed work is one section and one block. Milestone 1b has no batch (value-identical), so the 4 000 ms trend pool and reference are untouched. Cost ≈ 4–5 h ALONE (one ≈ 1 h nps reading each, estimate), 0 games.

## 4. Not done here
- No algorithm ticket cut or changed: `ABC-231`…`ABC-239` stay until `arch-algo-analysis` reports; milestone 2 gets only a dated "after milestone 1b; content waits on the analysis" line.
- No board, trace, ADR, `src/`, `tools/`, `data/` or `AGENTS.md` edit.
