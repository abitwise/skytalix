---
subtask: bapm-cut-engine-strength
role: ba-pm
ticket: memory-bank/analysis/2026-10-23-game-1.md
ref: .grugops/context/bapm-cut-engine-strength/
width: 2 (records only; beside ticket-to-pr-ABC-203)
---

# Cut an engine-strength epic and its ordered tickets from the 8 accepted proposals

## Do
- The owner accepted all 8 improvement proposals (`…7feb0553`) of the Architect's game-1 analysis (`…f1771bb3`). Write a new epic (next free EPIC id) — goal: skytalix plays measurably stronger at the same levels/time budgets; success measured by the rating harness, not one game. No Elo target unless the owner gives one: propose one as an owner question, don't set it.
- Cut one ticket per proposal (split if XL), ordered: (a) the rating harness first, so every later change is measured — outside `npm test`, NFR-008 untouched, Stockfish `UCI_LimitStrength` + cutechess-cli at the pinned host paths; (b) king safety with queens on + tapered king table; then the rest in the analysis's rank order. For each: the measurable criterion (harness Elo delta with its error bar, plus the existing regression gates the analysis names: `PUZZLE_DEEP`, A5 eval cost bar, NFR-004/005/009, identity sweeps), size, priority, DoR.
- **ADR touch points:** where a ticket needs a new or changed ADR (null move: new ADR + ADR-0026 door; TT across moves: ADR-0025 D4; checks in quiescence: reverses `src/quiescence.ts:21-24`'s decision; king safety: ADR-0031 addendum), say so on the page. The owner accepted the proposals; each ADR text still goes to him when written — mark these tickets so the Orchestrator routes the ADR to him.
- Any ticket that would move an NFR bound: flag it; that stays the owner's.
- Pages land in Backlog/Ready per DoR; the Orchestrator pulls.

## Fences
- Work on `grugops/bapm-cut-engine-strength` (worktree `../wt-bapm-cut-engine-strength` from `main`). Only the new epic page, new ticket pages and your notes. No `src/`, ADRs, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, ABC-203's page. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm-eng/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-cut-engine-strength`), `at` from `date -u`, with a `kind: decision`. Write `## Result` (board card lines for the epic and every ticket) plus 10-cell trace rows into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result (ba-pm, 2026-10-23T20:40Z): **`EPIC-008` cut with eight ordered tickets, `ABC-204`…`ABC-211`. Three are Ready (`204`, `205`, `206`) and five are in Backlog. No Elo target is set; one is proposed as owner Q1. No STOP.**

- **Claimed** at 20:21:28Z. Records only, on `grugops/bapm-cut-engine-strength` in `../wt-bapm-cut-engine-strength`, cut from `main` `55a8f4ef`.
- **One commit, `3076b667`.** Not merged and not pushed.
- **Notes** are in `.grugops/context/bapm-cut-engine-strength/notes/`. They were sealed with grugops 2.1.0 `context-io.js` `admitAndAppend` (context root: the worktree's) and read back 3/3:
  - `20261023T203657Z-ba-pm-observation-81e021ac`: what was read and probed;
  - `20261023T203657Z-ba-pm-decision-9835722a`: superseded. Its last ref was a scripting slip, `[object Object]`;
  - **`20261023T203717Z-ba-pm-decision-8c3b2f47`**: the rulings. It supersedes `…9835722a`.

**EPIC-008** (Backlog, L, P2). Goal: `skytalix` plays measurably stronger at the same levels and time budgets. `src/levels.ts` stays byte-identical (G9).
- **The two readings** use `cutechess-cli`'s own `Elo difference X +/- Y`, where Y is the 95 % half-width (`elo.cpp:44-49`).
  - **R:** skytalix at level 5, 3 000 ms, against Stockfish 19 `UCI_LimitStrength` at a frozen E. 200 games.
  - **D:** candidate against its merge-base. 400 games. The budget is 3 000 ms, or a frozen budget ≥ 1 000 ms if `ABC-204` `A6` rules one.
- **D states:** GAIN (X − Y > 0), LOSS (X + Y < 0), NEUTRAL, UNRESOLVED.
- **Ship rules.**
  - **S1** (value-changing): GAIN, or GAIN after one extension. Otherwise the change is not merged.
  - **S2** (`206` value-identical, `211` data): the ticket's own bar is met, and D is not LOSS.
- **Common gates G1–G11:**
  - G1: puzzles ≥ 54/58.
  - G2: eval ≤ 1 100 ns.
  - G3: ABC-083 relations.
  - G4: identity and ADR-0026 oracles.
  - G5: NFR-004.
  - G6: NFR-005, ≥ 6 and ≥ base.
  - G7: NFR-009.
  - G8: NFR-008.
  - G9: levels unchanged.
  - G10: ADR-0028 route.
  - G11: game-1 replay, reported only.
- **Measures:**
  - M1: R(close) − R(baseline) has a 95 % interval above 0;
  - M2: every merged ticket meets S1 or S2;
  - M3: no regression;
  - M4: the owner's decisions stay his.

**ADR touch points**, marked in each page's front matter (`adr:`) so the Orchestrator routes the text to the owner when it lands:
- `ABC-205`: `ADR-0031` addendum;
- `ABC-208`: a new ADR plus an `ADR-0026` door;
- `ABC-209`: `ADR-0025` D4 amendment;
- `ABC-210`: reverses `src/quiescence.ts:21-24`, so an ADR plus an `ADR-0026` door;
- **`ABC-211`: `ADR-0023`, not in the brief.** Probed at this cut: the current CC0 source has no 3...b6 after 3.Nf3 (the book offers `b8c6`, `d7d5`, `e7e5` only), so a new source is needed;
- `ABC-207`: conditional. None while `ADR-0031` D2's form stays.

**NFR bounds:** none moved, and none planned. A bound at risk is a STOP to the owner, not a re-level:
- NFR-005 floor (`205`, `207`, `210`);
- NFR-009 (`209`);
- NFR-001 leaf clause (`206`);
- NFR-006 (`211`);
- the puzzle baseline (all).

**Owner questions** (neither blocks a pull):
- **Q1, proposed Elo target:** M1 point estimate ≥ +100 on the harness scale, with the interval above 0. Default without an answer: no number.
- **Q2, machine time:** about 10 multi-hour unattended readings (R ≤ 10 h, D ≤ 8 h, measured by `ABC-204` `A6`). Should they run in windows he names, or whenever the board is idle? Default: whenever idle, at width 1.

**Flagged as cheap to reverse:**
- under S1, an accepted proposal that is not GAIN does not ship;
- D is head-to-head, while M1 is R.

**Corrections to the source analysis:**
- `cutechess-cli` is not absent; it has been at the pinned path since `…7ea41eea`;
- Black, not White, left the book first in game 1 (3...b6).

**Not touched:** `src/`, the ADRs, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, and ABC-203's page and files. In main's checkout, only this record and its claim moved, uncommitted.

**For the Orchestrator:**
- add the epic card to Backlog, `ABC-204`/`205`/`206` to Ready (3/8), and `ABC-207`…`211` to Backlog;
- append the trace rows at merge;
- pull `ABC-204` first. `205` and `206` can build beside it on disjoint files, but every reading runs at width 1;
- next free id: `ABC-212`.

### Board card lines

`- [EPIC-008] skytalix plays measurably stronger at the same levels and time budgets, measured by a rating harness and not by one game  (owner: BA/PM, size: L, priority: P2, since: 2026-10-23; cut in \`bapm-cut-engine-strength\` (\`…8c3b2f47\`). Owner word \`…7feb0553\`: all 8 game-1 proposals accepted. R = skytalix L5 vs Stockfish 19 UCI_LimitStrength (200 games, frozen E); D = candidate vs merge-base (400 games); cutechess 95 % interval. S1: value changes ship only on GAIN. src/levels.ts byte-identical. Tickets ABC-204…ABC-211 in pull order. No Elo target: +100 proposed (owner Q1); Q2 machine time. ADRs to the owner when written: 0031 add., new null-move ADR, 0025 D4, quiescence-checks reversal, 0023 book source)`

`- [ABC-204] Rating harness: cutechess-cli plays the built skytalix against Stockfish UCI_LimitStrength (R) and against its own base (D), outside npm test  (owner: software-engineer, after an Architect/Design ruling; readings by QE, size: M, priority: P2, epic: EPIC-008, since: 2026-10-23, DoR 10/10; \`…8c3b2f47\`. tools/rating only, 0 lane files (NFR-008 untouched); baseline R (25–75 % band, E frozen), A/A D (100 games, interval contains 0), wall ruling R ≤ 10 h, D ≤ 8 h (D budget ≥ 1 000 ms if needed). No ADR, no Security/NFR hop. Width 1 for readings)`

`- [ABC-205] King safety bites while the enemy queen is on, and the king table is tapered  (owner: software-engineer, after Architect/Design (ADR-0031 addendum → owner when written), size: M, priority: P2, epic: EPIC-008, since: 2026-10-23, DoR 10/10; \`…8c3b2f47\`. Strict relations (queen scale ≥ 6 pairs, taper, no castled bonus without shelter); G2 ≤ 1 100 ns, G6 depth ≥ 6 and ≥ base, G1 ≥ 54/58; D: S1 GAIN. D waits on ABC-204)`

`- [ABC-206] The search runs faster with identical answers (one generation per leaf, captures-only quiescence, gives-check without make/unmake)  (owner: software-engineer, size: M, priority: P2, epic: EPIC-008, since: 2026-10-23, DoR 10/10; \`…8c3b2f47\`. Node-equal identity sweep + clock-count equal; median time to depth 8 ≤ 0.85 × base on kiwipete and position-6 (plain node, n ≥ 7); NFR-001 leaf clause kept; D: S2 not LOSS. No ADR expected)`

`- [ABC-207] Mobility is weighted per piece (queen lowest) and an early queen trip costs  (owner: software-engineer, size: S, priority: P3, epic: EPIC-008, since: 2026-10-23, DoR 9/10 — held until ABC-205 is Done; \`…8c3b2f47\`. ADR only if the ADR-0031 form changes; ±100 cp cap, ≤ 1 100 ns; D: S1)`

`- [ABC-208] Null-move pruning behind an ADR-0026 off door, with a zugzwang guard  (owner: software-engineer, after Architect/Design (NEW ADR + ADR-0026 door → owner when written), size: M, priority: P2, epic: EPIC-008, since: 2026-10-23, DoR 9/10 — held until ABC-206 is Done; \`…8c3b2f47\`. Door node-equal; 6/6 zugzwang moves; 0 null moves in check or without non-pawn material; bounded drift; D: S1)`

`- [ABC-209] The transposition table is kept across the moves of one game  (owner: software-engineer, after Architect/Design (ADR-0025 D4 amendment → owner when written), size: S, priority: P3, epic: EPIC-008, since: 2026-10-23, DoR 9/10 — held until ABC-208 is Done; \`…8c3b2f47\`. Fresh game node-equal; cleared on new game/ucinewgame; 4 MiB unchanged; growth ≤ 1 MiB over 40 moves (NFR-009; over = STOP); D: S1)`

`- [ABC-210] Checks at the horizon: a check extension or checks in quiescence  (owner: software-engineer, after Architect/Design (reverses quiescence.ts:21-24: ADR + ADR-0026 door → owner when written), size: M, priority: P3, epic: EPIC-008, since: 2026-10-23, DoR 9/10 — held until ABC-209 is Done; \`…8c3b2f47\`. Nodes ≤ 1.5 × base at depth 6; NFR-005 floor 6 unmoved, ≥ base − 1 for this ticket; D: S1)`

`- [ABC-211] The opening book goes deeper in the English lines  (owner: Architect/Design source ruling first, then software-engineer, size: S, priority: P3, epic: EPIC-008, since: 2026-10-23, DoR 9/10 — held for the source ruling; \`…8c3b2f47\`. Probed: the current CC0 source lacks 3...b6, so a new source is needed: ADR-0023 → owner. ≥ 1 book move at game 1's position; NFR-006 ≤ 1 048 576 B; byte-for-byte rebuild; D: S2 not LOSS)`

### Trace rows (10 cells, header order)

| EPIC-008 (bapm-cut-engine-strength) | skytalix plays measurably stronger at the same levels and time budgets: R (vs Stockfish 19 UCI_LimitStrength, 200 games, frozen E) for M1; D (candidate vs merge-base, 400 games) per ticket; S1/S2 ship rules; gates G1–G11; levels byte-identical | EPIC-008 | — | no bound moved; at risk (STOP to owner): NFR-005 floor, NFR-009, NFR-001 leaf clause, NFR-006, puzzle baseline; notes …7feb0553, …f1771bb3, …81e021ac, …8c3b2f47 | grugops/bapm-cut-engine-strength @ 3076b667 (records only)<br>plans/epics/EPIC-008-skytalix-plays-measurably-stronger-at-the-same-levels-and-time-budgets.md | — (records only; host tools re-hashed; one book probe in the scratchpad) | — | — | cut → Backlog (L, P2); owner Q1 (Elo target, +100 proposed), Q2 (machine time); next free ABC-212 |
| ABC-204 (bapm-cut-engine-strength) | Rating harness: cutechess-cli 1.5.1 plays the built skytalix vs Stockfish 19 UCI_LimitStrength (R) and vs its base (D), under tools/rating, outside npm test | EPIC-008 | — | NFR-008 untouched (0 lane files); NFR-004 forfeits counted; no ADR-0036 limb (no src/) | grugops/bapm-cut-engine-strength @ 3076b667 (records only)<br>plans/tickets/ABC-204-a-rating-harness-plays-skytalix-against-stockfish-uci-limitstrength-and-against-its-base-in-cutechess-cli-outside-npm-test.md | — | waived (0 production lines); QE reading note is the evidence | — | cut → Ready (M, P2, DoR 10/10; In Design first, 5 questions, no ADR) |
| ABC-205 (bapm-cut-engine-strength) | King safety bites while the enemy queen is on, and the king table is tapered | EPIC-008 | — | G2 ≤ 1 100 ns; G6 NFR-005 ≥ 6 and ≥ base; G5; G8; no bound moved; ADR-0031 addendum → owner when written | grugops/bapm-cut-engine-strength @ 3076b667 (records only)<br>plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md | — | QE verdict signs UAT (…5aaf7cec) | — | cut → Ready (M, P2, DoR 10/10; In Design first for the addendum; D waits on ABC-204) |
| ABC-206 (bapm-cut-engine-strength) | The search runs faster with identical answers: one generation per leaf, captures-only quiescence, gives-check without make/unmake | EPIC-008 | — | NFR-001 leaf clause kept (contract change = owner); NFR-004 clock count equal; NFR-005 ≥ base; time to depth 8 ≤ 0.85 × base; no ADR expected | grugops/bapm-cut-engine-strength @ 3076b667 (records only)<br>plans/tickets/ABC-206-the-search-runs-faster-with-identical-answers.md | — | QE verdict signs UAT | — | cut → Ready (M, P2, DoR 10/10) |
| ABC-207 (bapm-cut-engine-strength) | Mobility weighted per piece (queen lowest) and an early-queen term | EPIC-008 | — | G2 ≤ 1 100 ns; ±100 cp cap; G6; ADR only if the ADR-0031 form changes | grugops/bapm-cut-engine-strength @ 3076b667 (records only)<br>plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md | — | QE verdict signs UAT | — | cut → Backlog (S, P3, DoR 9/10; Ready when ABC-205 Done) |
| ABC-208 (bapm-cut-engine-strength) | Null-move pruning behind an ADR-0026 off door, with a zugzwang guard and a bounded oracle | EPIC-008 | — | NFR-005 expected up (G6); NFR-004 unchanged; new ADR + ADR-0026 door → owner when written | grugops/bapm-cut-engine-strength @ 3076b667 (records only)<br>plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md | — | QE verdict signs UAT | — | cut → Backlog (M, P2, DoR 9/10; Ready when ABC-206 Done) |
| ABC-209 (bapm-cut-engine-strength) | The transposition table is kept across the moves of one game, cleared at a new game | EPIC-008 | — | NFR-009: 4 MiB unchanged, growth ≤ 1 MiB (over = STOP; re-level the owner's); ADR-0025 D4 amendment → owner when written | grugops/bapm-cut-engine-strength @ 3076b667 (records only)<br>plans/tickets/ABC-209-the-transposition-table-is-kept-across-the-moves-of-one-game.md | — | QE verdict signs UAT | — | cut → Backlog (S, P3, DoR 9/10; Ready when ABC-208 Done) |
| ABC-210 (bapm-cut-engine-strength) | Checks at the horizon: a check extension or checks in the first quiescence ply | EPIC-008 | — | NFR-005 floor 6 unmoved; nodes ≤ 1.5 × base at depth 6; reverses quiescence.ts:21-24 (ABC-079): ADR + ADR-0026 door → owner when written | grugops/bapm-cut-engine-strength @ 3076b667 (records only)<br>plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md | — | QE verdict signs UAT | — | cut → Backlog (M, P3, DoR 9/10; Ready when ABC-209 Done) |
| ABC-211 (bapm-cut-engine-strength) | The opening book goes deeper in the English lines | EPIC-008 | — | NFR-006 ≤ 1 048 576 B (356 526 B today); NFR-007 re-read past 2x growth; ADR-0023 source and licence → owner (probed: current source lacks 3...b6) | grugops/bapm-cut-engine-strength @ 3076b667 (records only)<br>plans/tickets/ABC-211-the-opening-book-goes-deeper-in-the-english-lines.md | — | QE verdict signs UAT | — | cut → Backlog (S, P3, DoR 9/10; Ready on the Architect's source ruling) |
