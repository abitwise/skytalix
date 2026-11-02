---
id: 20261102T212832Z-architect-design-decision-4de572aa
kind: decision
by: architect-design
at: 2026-11-02T21:28:32Z
verified_by: 
confidence: high (a pre-registration: instrument, closed form set, doors, gates, choice rule, verdict rule and the evaluation probe's metrics and reading rule fixed before any measured run)
refs:
  - arch-next-pull
  - grugops/arch-next-pull
  - EPIC-011
  - O1h
  - P1
  - P4
  - P5
  - ABC-233
  - ABC-234
  - ABC-236
  - ABC-231
  - ABC-232
  - ABC-239
  - E1
  - E2
  - ADR-0063
  - ADR-0060
  - ADR-0061
  - ADR-0056
  - ADR-0055
  - ADR-0050
  - RISK-EPIC011-08
  - e72487e1
  - a6039c5b
  - arch-ABC-233/20261102T210820Z-architect-design-decision-4d5a0fe3
  - arch-ABC-233/20261102T212011Z-architect-design-observation-9f0b5da7
  - arch-ABC-233/20261102T212011Z-architect-design-decision-f3a4dac0
supersedes: 
seal: sha256:da9281fb401be6bbc47e9f740f91e09480d39585afb83307fc616f567f30eed9
---

# arch-next-pull PREREG: (1) the joint O1h + P1 probe (ADR-0063 H1 table + ADR-0060 decision 1 with decision 11's history term), a closed set of four forms, every ADR-0060 bar unchanged and zugzwang 7 / 7 a hard gate; (2) the evaluation-lever probe for ranking the next EPIC-011 pull. Sealed and committed before any measured run

Architect/Design, task `arch-next-pull`, on `grugops/arch-next-pull` from `main` `a6039c5b` (its `src/` is tree `58fa3eb4`, `e72487e1`'s, futility in force; the same tree `arch-ABC-233` measured). Inputs: `arch-ABC-233` `…4d5a0fe3` (its PREREG), `…9f0b5da7` (results), `…f3a4dac0` (decisions); `ADR-0063` (F4 fired); `ADR-0060` (P1 parked; decision 11's history term; its § Status line "what would re-open P1"); `ADR-0061` (in force); `ADR-0056` D2 / D6; `EPIC-011` `RISK-EPIC011-08`. **No measured run has been made in this hop.** The patches were applied and the module loaded once (a load check; no count read). The position corpus for part 2 was extracted from a PGN (no search run).

## Part 1: the joint probe

### Instrument
- Base: `git archive HEAD src package.json` into a scratch directory outside the repository (deleted after).
- `patch_post268.py` and `patch_233.py` (both `arch-ABC-233`'s, unchanged), then `patch_joint.py`: decision 11's history term inside the log-table predicate (`lmrProbe`, shared by both recursions). Knobs, all off by default: `hT` (term on; acts only with `hh = 1` and the log table), `hLess` (plies less when the move's history value h > 0), `hZero` (h > 0: no reduction), `hMore` (plies more when h < 0), `hNegCap` (the cap for h < 0; 0 = the common cap 2). The term is applied after the PV term, before the cap and the clamp r ≤ d − 2. h is read from the table at the moment the move is considered (side × from × to, `ADR-0063` H1).
- Driver: `arch-ABC-233`'s `probe.ts`, unchanged. `job2.sh` composes each form from components. Every batch under `flock <host-test.lock> timeout 300`, every job `timeout 300`; deterministic counts only (fixed depth, `maxNodes` on a frozen clock, `G1` on its virtual clock). No timing is read.

### Instrument check (not a bar)
- `P1H1@H1 nodes` must reproduce `arch-ABC-233`'s diagnostic to the node: door (H1) and head (decision 1 over H1) d8 counts as in `raw/probe/out/P1H1_over_H1-nodes.out` of that task; the head ratios 0.7505 / 0.7952 / 0.7166 / 0.7749.
- The H1 door's reach must read 5.926 at 47 000 (`arch-ABC-233`). A count that differs is explained before any gate is read.

### The closed set (every form = H1 table + decision 1 exactly + one history term; listed in tie-break order)
- **J1** less only: h > 0 → one ply less.
- **J2** symmetric: h > 0 → one ply less; h < 0 → one ply more; cap 2.
- **J3** J2 with the cap at 3 for h < 0 (the "deeper reduction made safe by history" that decision 11 names).
- **J4** h > 0 → not reduced at all.
- h = 0 (never seen): decision 1 unchanged. Reference row, not a candidate: **P1H1** (decision 1 over H1, no term), whose zugzwang 5 / 7 is on record.

### Doors
- **ADR-0060's bars are read against its own door in the joint ladder: H1** (history on, flat LMR), as `ADR-0060` § Status (2026-11-02, `arch-ABC-233` line) frames the re-open: "decision 1 … measured over the history table as its door".
- **The history layer** keeps `ADR-0063`'s safety bars against `main` (met for H1 on record; re-cited, not re-read).
- **Stricter additions against `main`** (the joint change ships as one): `A4` (a) ≤ 0.85 on the four readings against `main` too; drift against `main` both recursions ≥ 95 % within 25 cp, max ≤ 42 cp (`ADR-0063`'s derived cap for the layer), 0 sign changes.

### Gates (each of J1–J4; every one must hold; no bar is moved)
- `A4` (a): d8 nodes, kiwipete and position-6, `search()` and `chooseMove`: ≤ 0.85× the H1 door on all four; and ≤ 0.85× `main` on all four.
- `A4` (b): reach at 47 000 on the 190 (`chooseMove`, `maxNodes`): ≥ H1 door + 0.25 ply.
- `A3` drift d5 on the 190, both recursions, against H1: ≥ 95 % of non-mate scores within 25 cp, none beyond **27 cp**, 0 mate sign changes. Against `main`: the stricter addition above.
- Mate floor: H1 door d4 → head d5 on the 287: 0 violations (same-depth d5 a report).
- **Zugzwang: `ADR-0050` d9's seven rows at their recorded depths, 7 / 7. HARD gate.** A lost row is F3, never a re-pin.
- `G1` ≥ 54 / 58 with no NEWLY-MISSED line.
- `G6`: a build's gate, not read here. The cut audit: not read (no `ADR-0060` bar).

### Choice rule
Among forms meeting every gate, the largest reach gain over the H1 door at 47 000; within 0.02 ply of the best, the earlier form in J1, J2, J3, J4.

### Verdict rule
- **A form meets every gate:** a joint ADR (P1 + O1h) is written PROPOSED for the chosen form, with the bars above as its bars, intent GAIN (`ADR-0060` d10's rule: it fires at 100 ms), F-rules carried from `ADR-0060` and `ADR-0063`.
- **No form meets every gate:** no ADR is written; dated lines in `ADR-0060` and `ADR-0063` record the result, the failed gate(s) named per form; no form is tuned after the read in this hop.

### Reports (not bars)
Reach and nodes against `main`; d8 on position-4 / position-5 / startpos is not read. If a form loses `zugzwang.004`, `zugd` (depths 10–13) is read for it as a report.

## Part 2: the evaluation-lever probe (information for the ranking; it decides no ADR)

### Question
Is evaluation now the bigger lever than further search pruning/ordering? A search change buys effective depth; the whole open pruning/ordering set (P5, O3s, S1, and whatever O1h + P1 gives) is estimated at well under one node doubling at 100 ms (the measured reach gains are +0.06 to +0.38 ply). So the probe asks: how much of skytalix's move error at the 100 ms node budget does one and two node doublings remove?

### Instrument
- Positions: `qe-EPIC-010-close/raw/c3/d.pgn` (400 self-play games at 0.1 s/move, 2026-11-01): games 1, 9, 17, … (every 8th, 50 games); the position after 20, 40 and 60 plies when the game is still in progress. **145 positions** (extracted; no search run).
- Skytalix: the same scratch tree with every knob at its default (= `main`, node for node); `chooseMove` with `maxNodes` 47 000 (1×, the 100 ms median), 94 000 (2×) and 188 000 (4×) on a frozen clock; move, score, depth recorded.
- Reference: Stockfish 19, Threads 1, Hash 64, fixed depth 16, `ucinewgame` per position (deterministic). Best score S*; for each distinct skytalix move m not SF's best, `go depth 16 searchmoves m` → S(m). loss = max(0, S* − S(m)), mates as ± (10 000 − plies), clamped to 1 000.
- `evalprobe.ts`, `sf.py`, `analyze_eval.py` as committed with this note. One batch, ≤ 5 min, under the host lock.

### Metrics
Mean / median loss at 1×, 2×, 4×; counts of loss ≥ 50 / 150 / 300; share of 1× errors (≥ 50) still errors at 4×; mean loss drop per doubling; Pearson r, raw MAE and fitted MAE of skytalix's 47 000-node score against S* (non-mate, clamped ± 1 000); sign disagreements where |S*| ≥ 100.

### Reading rule (fixed now; a judgement input to the ranking, not a verdict)
- One doubling ≈ 50–100 Elo (`ADR-0055`). The drop in mean loss from 1× to 2× is what one doubling of search buys on this corpus.
- **If ≥ 50 % of the 1× errors (loss ≥ 50) are still errors at 4× (two doublings, more search than every open pruning/ordering item together), the remaining error is mostly not search-depth-fixable at this scale, and evaluation is read as the bigger lever.** Below 50 %, search remains the bigger lever.
- Limits stated before the run: SF d16 is a reference, not truth; 145 positions from one self-play control; a residual error can also be a horizon or tactics miss that no eval term fixes. The reading ranks; it proves nothing about Elo.

## Ranking rule (part 2's output)
Expected Elo per cost, using `ADR-0056` D2's estimates corrected by today's readings (P2 −42, P3 +56 ± 56 read; P1/P4/P6 lost or waiting; O1h standalone NEUTRAL), the joint verdict above, and the evaluation reading. Candidates: the joint (if eligible), P5 NEUTRAL, `ABC-234` (O3s), `ABC-236` (S1), E1 (folding `ABC-231` / `ABC-232`), `ABC-239` (E2). One next ticket is recommended, with why, and whether `EPIC-011`'s plan needs a re-plan question to the owner.
