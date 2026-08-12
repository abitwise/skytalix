---
id: 20260812T190000Z-ba-pm-artifact-ref-the-verbatim-board-rows-and-everything-this-hop-wrote-1b6a8d05
kind: artifact-ref
by: ba-pm
at: 2026-08-12T19:00:00Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ABC-021
  - ABC-024
  - ABC-026
  - ABC-030
  - ABC-031
  - ABC-032
  - ABC-033
  - ABC-034
  - ABC-035
  - ABC-036
  - ABC-037
  - ABC-038
  - EPIC-003
  - EPIC-006
  - plans/board.md
  - plans/traceability.md
supersedes:
---

# The board rows I want, **verbatim**, and the complete inventory of what this hop wrote

> **Hand-authored, no stamp.** No `scripts/context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off`, no `§14-gate` verdict under this task — **no `finding` on this hop**.
>
> **`plans/board.md` was NOT opened for edit.** It is the Orchestrator's. Everything below is a
> request. Two moves (`Backlog → Ready`) are BA/PM's own exit to own — the **judgement** is mine and
> taken, the **row** is not.

## A. `## Ready (WIP 0/8 → 2/8)` — TWO rows MOVED from `Backlog`

```
- [ABC-021] Draw-claim interaction — the player having the move claims  (owner: BA/PM, size: S, P1, epic: EPIC-002, promoted: 2026-08-12 by BA/PM at task `post-abc030-2026-08-12`; **blocked-until: NONE — `ABC-020` merged 2026-08-02 and `ABC-019` is now in `Done`, both re-checked AT THE SOURCE (`src/turn-loop.ts` exists on `main` exporting `InputSeam`/`PromptOutcome`/`TerminalReason`/`runTurnLoop`); the row's standing `blocked-until: ABC-019 only` is the SIXTH stale reference found on this board, and the mechanism is structural — a row is corrected when the blocker is CHECKED, not when it MERGES**; **DoR 10/10 RE-VERIFIED item by item, not repeated**; **TWO owed corrections APPLIED, both re-derived rather than transcribed: (1) the `src/gameend.test.ts` citation is `26-50`, not `27-58` — `knightCycles` runs from its doc comment at 26 to its closing brace at 50, so the old range started inside the comment and ran eight lines into `describe("ABC-007 acceptance")`; (2) the transition boundary — merged `PromptOutcome` ALREADY has six arms, `ABC-019` owns only that `game-over` is reachable from `awaiting-human`, and this ticket owns TRANSITION 16, driving it with a claimed reason. NO SIZE CHANGE, and the re-sizing condition is DISCHARGED — `TerminalReason` shipped as a union and admits reasons additively**; closes `EPIC-002` entirely; inherits `N8-LANE` by that row's own default clause, 0–1 new test files)
- [ABC-026] The default test lane has no cumulative budget — only per-ticket ratios  (owner: BA/PM with Architect/Design, size: S, **P1 — RAISED from `P2` 2026-08-12 by BA/PM because the ticket's OWN trigger FIRED THREE-FOR-TWO: test files under `src/` went 22 → 28, and `ABC-016` (`695a2e7`), `ABC-017` (`09d4515`) and `ABC-019` (`d83a7e4`) EACH added one against a threshold of two. The other half — the lane passing 3 s — is NOT fired at 1.59 s wall, and that is ONE RUN, not a median**, epic: —, promoted: 2026-08-12; **DoR 9/10 → 10/10: BA/PM wrote the one open item, the acceptance criteria, at this hop — `A1` measures the lane total to `NFR-008`'s own protocol (≥ 7 interleaved runs, both clauses stated MET/NOT MET) and DISCHARGES `H5`, owed past two merges; `A2` reports the headroom in FILES with its band and the arithmetic shown; `A3` asserts `N8-LANE` inheritance as a QUANTIFIER over the backlog; `A4` adopts-or-refuses `pool: "threads"` with the ≥ 20-consecutive-green-run screen; `A5` places the isolation warning; `A6` pins `src/` byte-identical**; **ONE COLLISION RULED: the isolation warning goes in `vitest.config.ts` (verified 2026-08-12 — NO such file exists today) and in `ADR-0008`, NOT in the four `*.nfr.test.ts` files, because `ABC-030` is rewriting those same four comment blocks and its own `## Dependencies` forbids a concurrent hop there**)
```

## B. `## Backlog` — EIGHT rows APPENDED (`EPIC-003`'s decomposition, all new work lands here)

```
- [ABC-031] Coordinate move input — `e2e4`, `E2E4`, `e2-e4`, `e7e8q`, resolved against the legal move list  (owner: BA/PM, size: S, P0, epic: EPIC-003, since: 2026-08-12, cut at `EPIC-003`'s decomposition; **DoR 10/10 MET**; INDEPENDENT — merged code only, not behind `ABC-032` and not behind `ABC-010`; adopts `ADR-0004` (2b)'s move-identity rule for a module that ADR does not name, flagged non-blocking; `A5` is a provenance property over `src/perft.test.ts`'s six positions with ZERO exceptions; **1 new test file, NO `*.nfr.test.ts`** — `A6` makes the call-count property observable by reference identity instead of by `vi.mock`; production-module count moves 17 → 18)
- [ABC-032] `parseSan` — SAN resolved against the legal move list, three closed outcomes, every move generator-owned  (owner: BA/PM, size: M, P0, epic: EPIC-003, since: 2026-08-12; **DoR 10/10 MET**; **CARRIES THE TWO PARAGRAPHS THIS BOARD'S `EPIC-003` ROW HAS HELD SINCE `ABC-025`'s `N5` RULING HOP — (a) `src/san.nfr.test.ts`'s FIVE `N1` call-count rows go red on a sanctioned `toSan` optimisation and that is `N1` WORKING AS SPECIFIED, do not delete the row (verified: the file holds exactly 5 tests, one `N1` describe block; `A6` forbids the diff); (b) the lane bar is `N8-LANE`, NOT `ABC-025`'s `N5` — same clauses, corrected denominator, per `ABC-026` § What remains 1(a), with the wall-clock wording still refused because its own identity null control read +0.3/+3.2/+0.7% and two EMPTY files out-measured 24 real tests on it. THE ROW'S INSTRUCTION IS THEREFORE DISCHARGED and may be retired when this row is next written**; signature and three outcomes fixed by `ADR-0004` clause 2 AS AMENDED; **0–1 new test files** — `parseSan` lands in the EXISTING `src/san.ts` and any `N1` additions go in the EXISTING `src/san.nfr.test.ts`)
- [ABC-033] One prompt, both formats, no mode switch — and the ambiguity outcome that fits the frame  (owner: BA/PM, size: S, P0, epic: EPIC-003, since: 2026-08-12; **DoR 9/10, NOT MET — 2 ⚠️, both the same open ordering dependency on `ABC-031` + `ABC-032`, recorded not smoothed**; carries the BA/PM ruling that SAN case-folding is a RETRY and a multi-match is `ambiguous` NEVER a guess — `bxc4` and `Bxc4` can both be legal in one position, so a case-folding parser must guess, which this epic's own scope forbids; `A4` requires the frame's message region to hide NOTHING (`MESSAGE_ROWS` = 2, `src/frame.ts:45`); **1 new test file, no `*.nfr.test.ts`**)
- [ABC-034] Rejections that teach — a closed reason set, computed from the generator, never a bare "invalid"  (owner: BA/PM, size: M, P0, epic: EPIC-003, since: 2026-08-12; **DoR 9/10, NOT MET — 2 ⚠️, one open ordering dependency on `ABC-032`**; seven codes, each COMPUTED — `own-king-exposed` is the SET DIFFERENCE `generateMoves` minus `legalMoves`, asserted over all six perft positions with zero exceptions, so a heuristic classifier fails; `A4` asserts the message set as a SET (seven distinct, no substring relation, NO catch-all arm); zero production lines outside its module, `src/moves.ts` hash pinned; **1 new test file, no `*.nfr.test.ts`**)
- [ABC-035] In-game commands — `help`, `board`, `quit`, `claim`: the grammar, the tolerance, and the teaching rejection  (owner: BA/PM, size: S, P1, epic: EPIC-003, since: 2026-08-12; **DoR 9/10, NOT MET — 2 ⚠️, one open ordering dependency on `ABC-033`**; **carries the BA/PM boundary ruling: `EPIC-003` owns the GRAMMAR of `quit` and `claim`, `EPIC-006` and `ABC-021` own their EFFECTS — one rule applied twice, the same split the 2026-07-31 `claim` amendment already made**; `A1`'s NEGATIVE half is the criterion (`b4` must never read as `board`); `A6` holds `ABC-019`'s ≤ 100 µs per-ply bar at ZERO additional derives, the wrong build priced at 46–50 µs; **1 new test file, no `*.nfr.test.ts`**)
- [ABC-036] The `moves` command — the count is exact, and the frame cannot show the list  (owner: BA/PM, size: S, P1, epic: EPIC-003, since: 2026-08-12, **SPLIT OUT OF `ABC-035` AT THE CUT**; **DoR 8/10, NOT MET — 3 ⚠️, and the third is a REDUCED USER-FACING PROMISE AWAITING A NAMED HUMAN**: this epic's acceptance #4 promises EVERY legal move is listed, and the merged frame cannot — `MESSAGE_ROWS` is 2 (`src/frame.ts:45`), the region is bounded by the panels' ~21-char width (measured from the merged snapshots) and packs with a `+N` marker (`src/frame.ts:182-188`), so at the start position ~9 of 20 show and `+11` hides. **Amended to an EXACT COUNT plus a partial list; three alternatives rejected on merged evidence; the ONE reversible choice (a pager) named. NON-BLOCKING — `EPIC-002` `[A1]`'s posture, the criterion is testable either way**; `A3` catches the plausible wrong build that states the SHOWN count instead of the LEGAL one; **1 new test file, no `*.nfr.test.ts`**)
- [ABC-037] The real prompt — a line reader over stdin that IS `ABC-019`'s `InputSeam`, with EOF and a ruling on a parser bug  (owner: BA/PM, size: M, P0, epic: EPIC-003, since: 2026-08-12; **DoR 9/10, NOT MET — 2 ⚠️, open ordering dependencies on `ABC-033` + `ABC-035`; it IS independent of `EPIC-006` in the direction that matters — buildable, testable and mergeable with no entry point in existence**; **RULES A THIRD OWED PARAGRAPH FOUND AT THIS HOP: `ABC-019` `[D31]`'s open question *does a parser bug end the game?* — `EPIC-003`'s half is that the prompt CATCHES NOTHING, so the merged repair-then-rethrow runs and a crash surfaces as a crash; catching it as `rejected` teaches a false rule and terminating quietly is byte-identical to a clean EOF, which `[D31]` already called definitely wrong. It costs nothing: `parseSan` is total by `ADR-0004` (2a), so any throw is by construction a defect. `EPIC-006`'s half is recorded against that epic**; **`NFR-003` (< 50 ms keystroke) IS OWNED HERE**, as counts: 0 derives per keystroke, 1 per line; **SECURITY NOT WAIVED — first production module in this repo that reads outside input**: three measurable bars plus a falsifiable threshold; every criterion provable over PIPES, no TTY; **1 new test file, no `*.nfr.test.ts`**)
- [ABC-038] Tab-completion of legal moves and commands — one derive per prompt  (owner: BA/PM, size: S, **P2 — the epic's NEGOTIABLE SLICE, stated as a choice and not a default: cut this FIRST if `EPIC-003` runs long, because all four of the epic's acceptance criteria hold without it and it is the only ticket in the decomposition of which that is true**, epic: EPIC-003, since: 2026-08-12; **DoR 9/10, NOT MET — 2 ⚠️, open ordering dependencies on `ABC-037` + `ABC-035`**; `A3` pins ONE `legalMoves` call across FIVE Tab presses, which is what stops it breaking `ABC-037`'s per-keystroke bar; coordinate completion EXPLICITLY DECLINED with its reason; one escalation trigger, CHECKED and NOT FIRED — no play-testing has happened because there is nothing runnable to test; **1 new test file, no `*.nfr.test.ts`**)
```

## C. `## Backlog` — FIVE existing rows to EDIT

```
- [ABC-010] FEN semantic validation  (owner: BA/PM, size: M, P1, epic: EPIC-003, since: 2026-07-29, **DoR RE-VERIFIED 2026-08-12 by BA/PM and it is 9/10, NOT the 10/10 the page claimed — NOT PROMOTED**. Its own closing line fires at this hop (*"must be `Ready` before `EPIC-003` is decomposed"*) and it failed on a measurement its own argument rests on: the page says `src/fen.ts` has **exactly ONE production consumer** and is **not on any hot path**; measured at the source on `43d5a9d`, it has **FOUR** — `perft-bench.ts`, `history.ts:117` (inside `keyHistory`, so once per ply through `gameStatusOf`), `status-panel.ts:156` and `history-pane.ts:121`, **the last two ONCE PER FRAME**. So item 6's trigger set **omits `NFR-002` entirely** and its *"< 1 ms per call"* bar is the wrong size — two calls at 1 ms is 12.5% of a 16 ms frame. **The acceptance criteria and the `P1` latency argument are unaffected** — no caller feeds it a user-supplied string. Needs ONE short BA/PM + Architect/Design pass; routes `Ready → In Design → Ready for Dev` when pulled; expected new test files **0**)
- [ABC-024] Castling guards protected only by the opt-in deep lane  (owner: BA/PM, size: S, P2, epic: EPIC-001, since: 2026-08-10, **DoR RE-SCORED 2026-08-12: 8/10 → 9/10. BOTH original ⚠️ DISCHARGED by `ABC-023`'s merge; ONE NEW ⚠️ OPENS and it is NOT the failure mode the ticket predicted. `src/moves.ts` md5 is STILL `6335b452fc21ffe2d0f902ecab930840` — byte-identical four merges later, verified — and the ticket went stale anyway BECAUSE THE LANE GREW AROUND IT: its figures were scored at 625 tests on 18 files and the lane is 807 on 28. `A4` carries `625` inside a CRITERION, not just in evidence, so it is false before a row is added; and the seven survivor verdicts are `UNKNOWN - verify` because four of the ten added files drive `toSan` over generated legal move lists. A mutant's survival is a property of the WHOLE SUITE, not of the file it sits in. Needs a dev/QE re-measurement hop, NOT a BA/PM hop. BOTH escalation triggers re-checked at the source: BOTH still NOT FIRED — and note that `ABC-031`/`ABC-032`/`ABC-034` now run property tests OVER `src/perft.test.ts`'s six positions read-only, so that table carries more load than it did**)
- [ABC-030] NFR-justification comments cite a live sibling test count  (owner: BA/PM, size: XS, priority: P3, **epic: EPIC-002 — CORRECTED: this row reads `epic: —` while the ticket front matter AND the traceability row both read `EPIC-002`; two records against one**, since: 2026-08-13, **DoR 10/10 RE-VERIFIED — all four cited comment sites still exist and the `A1`/`A2` greps are correctly RED today. ONE LIVE CLAUSE CORRECTED 2026-08-12: the firing threshold read *"any production line at all, or any new file"* UNSCOPED, which `ABC-028`'s gate measured as firing on 33 NON-SOURCE files — every context note and queue record a normal hop writes. Now reads *"any new file UNDER `src/`"*. `ABC-028` is in `Done` and was NOT re-opened; its own two false sentences stand as a closed record and the fix landed where the clause is still live**; still must NOT be pulled ahead of anything, on its own instruction, which BA/PM re-read and agrees with)
- [EPIC-003] Move input and controls  (owner: BA/PM, **size: XL — CORRECTED from `M` 2026-08-12 by BA/PM with the arithmetic shown: eight new tickets at 19 points plus `ABC-010` at 3 = 22 points over NINE tickets, against `EPIC-002`'s identical correction at 23 points over nine. The no-XL-into-dev rule applies to TICKETS, not epics; the largest here is `M`, so NO `SPLIT_REQUIRED`**, priority: P0, since: 2026-07-22, **DECOMPOSED 2026-08-12 into `ABC-031`…`ABC-038` (+ `ABC-010`, which was ALREADY under this epic since 2026-07-29 — this epic was never undecomposed, it was one ticket in and eight short)**; **THE TWO-PARAGRAPH INSTRUCTION THIS ROW HAS CARRIED IS DISCHARGED — both paragraphs are on `ABC-032` and the discharge is also recorded in `plans/epics/EPIC-003-move-input-and-controls.md` so it survives a board rewrite. The clause may be RETIRED from this row**)
- [EPIC-006] Game session and packaging  (owner: BA/PM, size: M, **priority: P1 — RAISED from `P2` 2026-08-12 by BA/PM in the epic file, on a measurement rather than an argument: `src/status-panel.ts` and `src/history-pane.ts` have ZERO production importers, `renderBoard` has ZERO runtime consumers (both production importers of `src/render.ts` are `import type`), and `src/turn-loop.ts` has ZERO — FOUR of seventeen production modules are reachable only from test files, and they are the entire user-visible surface of a `P0` `XL` epic that is otherwise nine-ninths delivered. The wiring is the render-seam closure and `ADR-0009` clause 9b + `ABC-019` `[D30]` put it in THIS epic. So a `P2` epic gates the visible outcome of two `P0` epics, and `P2` on this board is the DROP-FIRST tier — this is the one epic that cannot be dropped without the product ceasing to exist. Not `P0`: nothing is broken and there is no user today**, since: 2026-07-22, **NOT DECOMPOSED and the reason is on the epic page: its packaging tickets depend on a distribution decision `ADR-0007`/`AGENTS.md` reserve to this epic (*"do not fill that in"*) and its difficulty/undo criteria need `EPIC-004`. THREE cuttable tickets are named IN PROSE with NO IDs allocated — the render-seam closure (the highest-value uncut ticket on this board), the entry point + argv (which owes `EPIC-006`'s half of `ABC-019` `[D31]`), and the result screen (whose reason count is now a READ against merged `ABC-020`). RECOMMENDED AS THE NEXT DECOMPOSITION HOP**)
```

## D. One trace-file retirement, routed not taken

`plans/traceability.md` still holds `| pending | Move input and controls | EPIC-003 | pending | NFR-003 | | | | | Backlog |`. **It is now stale** — the epic is decomposed — and `EPIC-002`'s precedent was to remove its equivalent row. **I left it**: my boundary is *append rows for tickets you create only*, and deleting a row is the class of edit that boundary exists to prevent. One-line retirement, the Orchestrator's call.

## E. Complete inventory of what this hop wrote — 17 files, ZERO under `src/`

```
NEW tickets (8)      plans/tickets/ABC-031-coordinate-move-input.md
                     plans/tickets/ABC-032-parse-san.md
                     plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
                     plans/tickets/ABC-034-rejections-that-teach.md
                     plans/tickets/ABC-035-in-game-commands.md
                     plans/tickets/ABC-036-the-moves-command.md
                     plans/tickets/ABC-037-the-real-prompt-input-seam.md
                     plans/tickets/ABC-038-tab-completion.md
AMENDED tickets (5)  plans/tickets/ABC-010-...  (DoR re-score 10/10 -> 9/10, NOT promoted)
                     plans/tickets/ABC-021-...  (two owed corrections applied; DoR 10/10; Ready requested)
                     plans/tickets/ABC-024-...  (DoR re-score 8/10 -> 9/10; triggers re-checked)
                     plans/tickets/ABC-026-...  (acceptance criteria WRITTEN; P2 -> P1; DoR 10/10; Ready requested)
                     plans/tickets/ABC-030-...  (one live clause scoped to `under src/`)
AMENDED epics (2)    plans/epics/EPIC-003-move-input-and-controls.md  (size M -> XL, decomposition, 3 rulings, features ruling)
                     plans/epics/EPIC-006-game-session-and-packaging.md  (P2 -> P1, evidence, 3 cuttable tickets in prose)
TRACE (1)            plans/traceability.md  (+8 rows, 41 -> 49 table lines, all 10 columns; NO existing row touched;
                                             the ABC-028/ABC-029 duplicate PAIRS verified still present and untouched)
NOTES (6)            .grugops/context/refinement-post-abc030/notes/  (this file is the sixth)
QUEUE                .grugops/queue/claimed/refinement-post-abc030/  (claim.md + the subtask file), then -> done/
```

**No file under `src/` was opened for edit and none was written. No `Done` ticket was edited. No ADR,
no `plans/metrics.md`, no `plans/nfr-catalog.md`, no `plans/board.md`.** The two concurrent audit lanes'
files were not touched.
