---
id: 20261102T210820Z-architect-design-decision-4d5a0fe3
kind: decision
by: architect-design
at: 2026-11-02T21:08:20Z
verified_by: 
confidence: high (a pre-registration: instrument, forms, gates, choice rule, bar-derivation rules and verdict rule fixed before any measured run)
refs:
  - arch-ABC-233
  - grugops/arch-ABC-233
  - ABC-233
  - EPIC-011
  - O1h
  - P1
  - P4
  - ADR-0063
  - ADR-0060
  - ADR-0061
  - ADR-0056
  - ADR-0050
  - ADR-0026
  - e72487e1
  - 60b76b52
  - orch-2026-10-30a/20261102T210500Z-orchestrator-decision-8ce2fd23
  - arch-post-268/20261102T205950Z-architect-design-decision-1bc554fb
  - arch-post-268/20261102T205950Z-architect-design-observation-9a7f24af
supersedes: 
seal: sha256:cf306fb4151c82ef05cc4b29ced34ab03da7a4317a9021525198ee1aa1c53100
---

# arch-ABC-233 PREREG: O1h (history heuristic) on `main` `e72487e1`'s search (futility in force): candidate forms, gates, choice rule, the bar-derivation rules and the verdict rule, sealed and committed before any measured run

Architect/Design, task `arch-ABC-233`, on `grugops/arch-ABC-233` from `main` `60b76b52` (its `src/` is tree `58fa3eb4`, `e72487e1`'s). Inputs: Orchestrator `…8ce2fd23` (ABC-233 next; E 1 810), `ADR-0060` decision 11 (the history term is O1h's), `ADR-0061` (instrument, cut audit), `ADR-0026` d9/d10, `plans/tickets/ABC-233-…md`. **No measured run has been made in this hop.** The patch was applied and the module loaded once with history off (a load check; no count was read).

## Instrument
- Base: `git archive HEAD src package.json` into a scratch directory outside the repository (deleted after).
- `patch_post268.py` (`arch-post-268`'s, unchanged), then `patch_233.py`: a history table (`Int32Array(2 × 64 × 64)`), cleared at every `search()` / `chooseMove` entry and kept across `chooseMove`'s iterations (the killers' lifetime); on a quiet move's beta cutoff at remaining depth d, `+d²` to it and (malus on) `−d²` to each quiet move searched before it at that node, by the gravity form `h += b − trunc(h·|b| / 16 384)`; read by `orderKey` **after the killers** (killer key moved to 500 000 + rank, above any history value; with history off the order is unchanged). Both recursions. Futility-skipped moves are not "searched" (no malus). With `hh: 0` the scratch search is `main`, node for node.
- Driver: `arch-post-268`'s `probe.ts` plus a history audit (below), cutoff counters and a `table` mode (A2's shape). Every run under `flock <host-test.lock> timeout 300`, every job `timeout 300`; deterministic counts only (fixed depth, `maxNodes` on a frozen clock, `G1` on its virtual clock). No timing is read.

## Candidate forms (all: cleared per search, killers above, bonus d², gravity 16 384)
- **H1** side × from × to, bonus + malus (the textbook O1h "(+ malus)"; listed first).
- **H0** from × to without side (the ticket's 64 × 64), bonus + malus.
- **H2** side × from × to, bonus only.
- **H3** piece × to, bonus + malus.
- **H1nr** H1 with the root not ordered by history: nodes and reach only, a report.

## Instrument check (not a bar)
The door (`hh: 0`) must reproduce `ADR-0061` d9's counts to the node: `search()` d8 888 786 / 1 262 046, `chooseMove` d8 1 306 981 / 391 451 (kiwipete / position-6), reach 5.837 at 47 000. A count that differs is explained before any gate is read.

## Gates (each of H1, H0, H2, H3)
- **Safety:** drift at depth 5 on the 190, both recursions: ≥ 95 % of non-mate scores within 25 cp, max ≤ 75 cp (`main`'s shared drift literal), 0 mate sign changes; mate floor door d4 → head d5 on the 287: 0 violations; `ADR-0050` d9's seven zugzwang rows at recorded depths: 7 / 7; `G1` ≥ 54 / 58 with no NEWLY-MISSED line.
- **Pay:** nodes at depth 8 on kiwipete and position-6, `search()` and `chooseMove`: ≤ 0.95× the door's on each of the four (the ticket's ordering figure).

## Choice rule
Among forms passing both gates, the largest reach gain at 47 000 nodes on the 190 (`chooseMove`, `maxNodes`); a gain within 0.02 ply of the best goes to the earlier form in the order H1, H0, H2, H3.

## Bars the ADR writes for the chosen form (derived by these rules, fixed now)
- **A4 (a)** d8, four readings: ≤ min(0.95, ⌈100·(max of the four + 0.05)⌉ / 100).
- **Intent:** **GAIN** if the measured reach gain ≥ +0.10 ply (it fires at 100 ms); then **A4 (b)** ≥ door + max(0.10, ⌊20·0.7·gain⌋ / 20). Otherwise **NEUTRAL**, with A4 (a) as its deep bar (C2′'s "C yes" rule) and reach a report.
- **A4 (c)** `G6` "≥ base": a build's gate, not read here.
- **Drift:** ≥ 95 % within 25 cp, none beyond max(25, min(75, ⌊1.5 × the larger measured maximum of the two recursions⌋)) cp, 0 sign changes; mate-status flips reported.
- **Mate floor:** same-depth (door d5 → head d5) 0 violations if the chosen form reads 0 there; otherwise `ADR-0026`'s d4 → d5.
- **Zugzwang** 7 / 7; **`G1`** ≥ 54 / 58, no NEWLY-MISSED.
- **Cut audit (information, never a bar):** `search()` d6 over the 190 + 6 endgames; a null-window node is marked when history changes its move order; every 10th marked node is re-searched fresh three times (head at the node's window with the table snapshot taken at the mark; door at that window; door full window = v). Flips and errors ≥ 100 / 200 / 300 / 500 cp reported. `ADR-0061`'s bars (≤ 0.5 %, 0 ≥ 200 cp) quoted for scale only. If a job times out, re-run once at AUD = 50.
- **Reports, not bars:** d7 nodes (the ticket's A3 figure), d8 on position-4 / position-5 / startpos, reach at 20 000, firing at d6 (order-changed nodes, first-move cutoff rate, mean index of quiet cutoffs, killer share), `table` mode (A2's shape).

## P1 information row (cannot change this ADR's verdict)
After the choice: `ADR-0060` decision 1 (R0, unchanged) over the chosen history form as door: d8 four readings (bar 0.85), drift d5 `search()` (27 cp cap), zugzwang 7 rows, reach at 47 000 (+0.25). Reported to the Orchestrator as evidence for whether O1h re-opens P1; no P1 verdict is given here (a re-open is its own pre-registered hop).

## Verdict rule
- **A form passes both gates:** `ADR-0063` is written PROPOSED for it, with the bars above, intent as derived.
- **No form passes:** `ADR-0063` is written PROPOSED with "premise not met on `main`", the failed gate(s) named; no form is tuned after the read in this hop; DoR 10 stays ❌.
