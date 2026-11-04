# Every uncut EPIC-011 area cut as ABC-284..ABC-299: 16 pages, all Backlog; 14 engine pages at DoR 9/10 (an ADR, probe or hold owed), R2 and R3 at 10/10, held on their phase's close

Source: the owner's ruling 3 (orch-2026-10-30a …4c4cb03d): "after cutting W1, start cutting EPIC-011 areas". Records only, at main b274711c (merged into the branch at 9dc1644f); nothing run. Pages and EPIC-011 at aebc9783. Numbered in § Phases' order.

| id | row | size | pri | hold, and re-open trigger | owed |
|---|---|---|---|---|---|
| ABC-284 | P1 log LMR | S–M | P2 | parked: no ADR-0060 form meets every bar on main. Re-opens on a new named premise with its own probe: E1's tree (on main since 54dee3f2; no P1 re-probe on record, UNKNOWN - verify), ABC-283 merged (history), or the second pull | ADR-0060 re-open (Architect); bars ADR-0060 d8/d9 by reference; intent GAIN (epic § P1 parked) |
| ABC-285 | P5 null-move R by depth and margin | S | P3 | deferred (Orchestrator, Phase 2 closed); about 0 at 100 ms | ADR-0050 amendment with a deep-depth bar (owner accepts); intent NEUTRAL (invisible at 100 ms), as ADR-0056 D2 names it |
| ABC-286 | P4 move-count pruning | S | P3 | held: ABC-283 merged, then a joint probe with history as input (ADR-0063 d11) meeting every bar | new ADR |
| ABC-287 | P6 razoring | S | P3 | held: rejected on today's eval; re-measured after the second pull merges, on the rows it failed; fails again → dropped | re-measure, then a new ADR |
| ABC-288 | O2c countermove / continuation history | M | P3 | held: ABC-283 merged; or on a miss the Architect names O2c as O1h's re-open premise | new ADR or ADR-0063 amendment; NFR-009 ≤ 16 MiB in all |
| ABC-289 | Q2 delta pruning | S | P3 | held: ADR-0024 d4 keeps delta fenced (Q-3K-10, the owner's) and an Architect re-measure over Q1 | the owner's word, a re-measure, an ADR |
| ABC-290 | E3b king-zone attackers | M | P2 | after the second pull | new ADR: form (a) structure at 0 or (b) rule values |
| ABC-291 | E4b connected / phalanx / backward | S–M | P3 | after the second pull | new ADR (definitions, pawn memo, form) |
| ABC-292 | E5 bishop pair, rook files, outposts, mobility per piece | M | P2 | after the second pull; split per term if forms differ | new ADR (an ADR-0031 change for mobility) |
| ABC-293 | E6 threats and tempo | M | P3 | after the second pull | new ADR with tempo's relation rows |
| ABC-294 | E7b rook-pawn, wrong-bishop, rook endings | M | P3 | premise-gated: after ABC-272's probe; no premise → dropped | a probe, then an ADR |
| ABC-295 | R2 reading | S | P2 | Phase 4's close (which tickets close it: the Orchestrator's) | none (ruled …8136b589); DoR 10/10 |
| ABC-296 | X1 check extension, every depth | S | P3 | the ADR only | new ADR (or part of ADR-0051 revived) |
| ABC-297 | X2 singular extension + IIR | M | P3 | a premise probe on usable stored entries (the dead "after T1" replaced); IIR split out if landed first | probe, then a new ADR |
| ABC-298 | V3 staged generation | M | P3 | the ADR; after ABC-283 on orderMoves; V2 met (3bfe180e) | new ADR (value-identical with S2, or value-changing with C2′) |
| ABC-299 | R3 reading | S | P3 | Phase 5's close; C3′'s probe first only if E > 2 600 | none; DoR 10/10 |

Rules applied on every page:
- Bars: only the epic's per-change rule (C2′ GAIN ≥ 50.0 / NEUTRAL ≥ 43.0 of 100, S′ at E 1 810, the Levels lane), ADR-0064 d7's safety rows (mate floor 0, zugzwang 7 / 7 at recorded depths, G1 no NEWLY-missed), G4 door identity, G6 per Q-3K-4 (b)'s scope (search pages: "≥ base" binds; evaluation pages: the depth-6 floor, "≥ base" reported; structure-at-0 pages: ≥ base as ABC-270 / ABC-271 K4), NFR-008 ≤ 10 s and NFR-009 ≤ 16 MiB. Every mechanism number (ratios, margins, drift, the probes' lines) is named as owed to the Architect. None invented.
- Intent class only where stated: P1 GAIN (epic), P5 NEUTRAL (ADR-0056 D2). Every other page leaves the intent to its ADR.
- Value: ADR-0056 D2's estimate only, labelled; for split rows (E3, E4, E7) the figure is the whole row's, said so.
- Under the tuner (E3b, E4b, E5, E6): none of their new weights comes from the second pull. Its free set is the first pull's plus ABC-271's KD and FP eg (ADR-0067 d6, dated 2026-11-04). E5's shared MOBILITY_WEIGHT is the one exception: it is already in that set. The new weights come from a later pull (no ticket) under ADR-0067 with its own PREREG. The emitter writes 13 exports today (…6ccd8243 item 3), so each new export is owed to that pull's tools change. Landing a structure before the second pull is named as the Orchestrator's alternative and not recommended, because it changes what the ruled single read judges.
- E7b: order free relative to the tuner if its terms are a rule and a factor (ADR-0067 § Consequences 6, written for E7a; UNKNOWN - verify for E7b).
- The epic's rule "stubs get an id at refinement, not before" and § "P1, parked"'s "no id" are superseded by the owner's ruling 3, with dated lines.

Judgments flagged:
1. Numbering in § Phases' table order within each phase: P1, P5, P4, P6 (the order of the epic's 2026-11-02 lines), then O2c, Q2, E3b–E7b, R2, X1–V3, R3.
2. Priorities P2 on P1, E3b, E5 and R2 (largest estimates; R2 as R1 was raised); P3 elsewhere.
3. Pages are about 110–130 lines each, under the 300-line budget.
4. Row-label prefixes chosen so that no label reads as a gate or stub name (CE, SE, DP, CH, SG).
