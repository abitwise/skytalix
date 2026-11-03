# arch-ABC-234 PREREG: O3s (SEE orders captures, ordering only) on `main`'s search (`src/` tree `58fa3eb4`, futility in force): premise counters, three forms, two gates, the choice rule, the bar-derivation rules and the verdict rule, sealed and committed before any measured run

Architect/Design, task `arch-ABC-234`, on `grugops/arch-ABC-234` from `main` `17725732` (its `src/` is tree `58fa3eb4`, the same tree `ADR-0063`'s probe used: `e72487e1`'s). Inputs: brief `.grugops/queue/claimed/arch-ABC-234.md` (Orchestrator, 2026-11-03T09:25:07Z), `plans/tickets/ABC-234-…md`, `ADR-0024` d4 (the fence), `ADR-0056` (row O3s; C2′ GAIN 50.0 / NEUTRAL 43.0; "C yes"; the depth-gated rule), `ADR-0061` (instrument, cut audit), `ADR-0063` (probe shape, reused). **No measured run has been made in this hop.** The patches were applied and the modules imported once (a load check; no search was run, no count was read).

## Already read, not measured: A0 (the fence)
- `ADR-0024` d4's re-open condition: "`ABC-084`'s puzzle count says the engine is losing material to a defended-square capture it should have pruned".
- `src/puzzle-suite.baseline.json` (committed, `G1`): 54 / 58; the four unsolved rows are all "mate in 3 … headroom" rows. All 24 `do-not-hang` rows (`HANGING_CORPUS`, each a capture onto a defended square) are solved.
- So **A0, read on its own words, is not met.** The ruling on what that means for an ordering-only ticket is written in the result notes and the ADR, after the probe; the probe's `G1` run per form re-reads the count.

## Instrument
- Base: `git archive HEAD src package.json` into a scratch directory outside the repository (deleted after).
- `patch_post268.py` (`arch-post-268`'s, unchanged: `PROBE`, `probeNode`, the `toFen` import), then `patch_234.py`:
  - `see(position, move)` in `quiescence.ts` (scratch): swap list on the target square, least-valuable attacker each step (P, N, B, R, Q, K), x-rays through captured squares, pins ignored; values `ORDER_VALUE`'s (100 / 320 / 330 / 500 / 900), king 20 000.
  - A capture is **LOSING** iff it does not promote, the mover is not the king, its victim is worth less than its attacker, and `see < −margin`. A non-capture promotion, an en-passant capture (P×P) and any capture of an equal or bigger piece are never losing.
  - `orderKey` takes the node's position (`orderMoves(…, position)` at all four call sites: `search.ts` negamax and root through `ordered`, `engine.ts` negamax and root). With `see: 0`, or a null position, the key is today's. The hash move stays first even if losing.
  - Premise counters in `search.ts` negamax (`count` on); quiescence counters (report only).
  - The SEE audit mark: a null-window node where SEE changed the order (head order ≠ the order with SEE off).
  - With `see: 0` the scratch search is `main`, node for node.
- Driver: `arch-ABC-233`'s `probe.ts`, history and `table` removed, `fire` re-written for the SEE counters, the audit re-pointed at the SEE mark, and a `seecheck` mode added.
- Every batch under `flock <host-test.lock> timeout 3000`, every job `timeout 600`, **one job at a time** (one core). Deterministic counts only (fixed depth; `maxNodes` on a frozen clock; `G1` on its virtual clock). No timing is read.

## Instrument checks (not bars; a miss is fixed in the instrument and explained before any gate is read)
- **SEE:** `see < 0` and LOSING on all 24 `HANGING_CORPUS` losing moves; and six hand-worked rows equal exactly: undefended pawn +100; CPW's x-ray row (`Nxe5`) −220; Q×P defended by a pawn −800; R×R recaptured, x-ray queen stops +500; N×N defended 0; B×N defended by a pawn −10.
- **The door** (`see: 0`) reproduces `ADR-0061` d9's counts to the node: `search()` d8 888 786 / 1 262 046, `chooseMove` d8 1 306 981 / 391 451 (kiwipete / position-6), reach 5.837 at 47 000; zugzwang door nodes 905 900 (`.004`) and 1 310 019 (`.005`); `G1` 54 / 58.

## The premise on `main` (the door), read first and reported in full
`fire` at depth 6 over the 190 (+ 6 endgames), `search()`, margin 0:
- the share of full-width nodes holding a losing capture, and holding one **ordered ahead of a quiet move**;
- losing captures searched, and of them refuted (score ≤ alpha before it), raised alpha, and cut;
- the nodes spent under losing captures, and under refuted ones, as a share of all nodes;
- the share of cutoffs made by a losing capture; first-move cutoff rate.
- **Stated expectation (not a gate):** a 0.95× node gate needs at least ~5 % of nodes to be recoverable. If the nodes under refuted losing captures are below 5 % of all nodes at depth 6, the pay gate is not expected to pass. The verdict comes from the gates only.
- Quiescence (report, `Q1`'s premise, not in scope): the share of quiescence moves that are losing captures, refuted share, and the share of quiescence nodes under them. `quiesce` today neither orders by nor prunes on SEE (`src/quiescence.ts` header: "Not here … static exchange evaluation").

## Candidate forms (all: ordering only, both recursions, losing captures ordered among themselves by MVV-LVA)
- **S1** losing (`see < 0`) captures after the killers, before the other quiet moves (the ticket's scope 2; listed first).
- **S2** losing (`see < 0`) captures after every quiet move (the ticket's title).
- **S1m** as S1, but losing means `see < −50` (a bishop-for-knight trade stays with the captures).

## Gates (each of S1, S2, S1m)
- **Safety:** drift at depth 5 on the 190, both recursions: ≥ 95 % of non-mate scores within 25 cp, max ≤ 75 cp, 0 mate sign changes; mate floor door d4 → head d5 on the 287: 0 violations; **`ADR-0050` d9's seven zugzwang rows at recorded depths: 7 / 7 (hard)**; `G1` ≥ 54 / 58 with no NEWLY-MISSED line.
- **Pay:** nodes at depth 8 on kiwipete and position-6, `search()` and `chooseMove`: **≤ 0.95×** the door's on each of the four readings.
- **The NEUTRAL route does not waive the pay gate.** `ADR-0056` lists O3s among the rows that fire at 100 ms, so "NEUTRAL (invisible at 100 ms)" is not open to it by that list; and even where "C yes" applies, the ticket's own measured bar (`A3`, ≤ 0.95× nodes) must pass too. The intent is derived below only for a form that passes.

## Choice rule
Among forms passing both gates, the largest reach gain at 47 000 nodes on the 190 (`chooseMove`, `maxNodes`); a gain within 0.02 ply of the best goes to the earlier form in the order S1, S2, S1m.

## Bars the ADR writes for the chosen form (derived by these rules, fixed now)
- **A3 / A4 (a)** d8, four readings: ≤ min(0.95, ⌈100·(max of the four + 0.05)⌉ / 100). The ticket's `A3` (d7, two readings) is re-pinned to d8, four readings.
- **Intent:** **GAIN** if the measured reach gain ≥ +0.10 ply; then a reach bar ≥ door + max(0.10, ⌊20·0.7·gain⌋ / 20). Otherwise **NEUTRAL**, with A4 (a) as its measured bar and reach a report.
- **`G6` "≥ base"**: a build's gate (the ticket's `A4`), not read here. `Q-3K-4` (b) covers evaluation tickets only.
- **Drift:** ≥ 95 % within 25 cp, none beyond max(25, min(75, ⌊1.5 × the larger measured maximum of the two recursions⌋)) cp, 0 sign changes.
- **Mate floor:** same depth (door d5 → head d5) 0 violations if the chosen form reads 0 there; otherwise d4 → d5.
- **Zugzwang** 7 / 7; **`G1`** ≥ 54 / 58, no NEWLY-MISSED.
- **Cut audit (information, never a bar):** `search()` d6 over the 190 + 6 endgames; every 10th SEE-marked null-window node is re-searched fresh three times (head at the node's window; door at that window; door full window = v). Flips and errors ≥ 100 / 200 / 300 / 500 cp reported; `ADR-0061`'s bars (≤ 0.5 % flips, 0 errors ≥ 200 cp) quoted for scale. A timed-out job is re-run once at AUD = 50.
- **Reports, not bars:** d7 nodes (the ticket's `A3` depth), d8 on position-4 / position-5 / startpos, reach at 20 000, premise counters for each form.

## Verdict rule
- **A form passes both gates:** `ADR-0065` is written PROPOSED for it, with the bars above and the intent as derived, a test-only off-door pair, file list, test rows, falsifiers and effort.
- **No form passes:** `ADR-0065` is written PROPOSED with "premise not met on `main`" (the `ADR-0063` pattern), the failed gate(s) named; no form is tuned after the read in this hop; the recommendation is park.
- Anything run after the gates are read is labelled DIAGNOSTIC and cannot change the verdict.
