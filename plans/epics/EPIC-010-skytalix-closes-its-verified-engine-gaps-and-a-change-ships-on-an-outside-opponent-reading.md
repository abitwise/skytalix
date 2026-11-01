---
id: EPIC-010
title: "`skytalix` closes the engine gaps the owner's ideas named and the System Analyst verified, and a value-changing change ships only on the outside-opponent reading the owner sets"
status: backlog
column: Backlog
priority: P2
size: L
owner: BA/PM
---

# EPIC-010: the verified engine gaps, closed one measured change at a time, against an outside opponent

> **THE `ADR-0056` OWNER-ANSWERS FOLD, ON THIS PAGE, 2026-11-01, by BA/PM** (task `bapm-reconcile-adr0056`, records
> only, at `main` `bd29dd50`; nothing run). The Architect's fold of the owner's three answers is on `main` (merge
> `a0f9297e`, ADR commit `fe50a11f`; notes `arch-adr0056-owner-answers` `…d3c756d1`, `…c8c38f1e`). **Its figures
> replace every "pending the fold" and "`UNKNOWN - verify` until the fold merges" line in the block below;** those lines
> are rewritten in place under this task's name. The Orchestrator's rulings with it: "0.5s difficulty" is `skytalix` at
> `st=0.5` on level 5 (a time setting, not a level); the smoke's E is 1 650 as the ADR sets it (the owner has been told
> and may revert to 1 910); `ABC-256` closes as superseded by C3″ (`EPIC-011`).
>
> - **Per epic, `ADR-0056` C3″:** 400 games head to head at 100 ms, `d <head> <base> <out> --budget-ms 100 --rounds
>   200 --concurrency 1`. Valid when 400 of 400 complete and neither build faults or loses on time at the 50 ms margin
>   (else UNRESOLVED, re-run once). **MET at ≥ 200.0 of 400** (point estimate ≥ 0); the interval is reported, not
>   graded. ≈ 1.55 h plus two builds (estimate; pre-approved).
> - **The smoke, `ADR-0056` S′:** 10 games, the candidate against Stockfish 19 `UCI_LimitStrength` at **E 1 650**;
>   `skytalix` `st=0.5` on level 5, `timemargin` **50 ms**; Stockfish `st=0.5`, `timemargin` 2 000 ms; openings 1–5,
>   both colours: `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1` (`ABC-255` item 2). **Bars:** S-1
>   (0 faults), S-2 (0 losses on time) and S-4 (≥ 3.0 of 10; below that, 10 more games and ≥ 7.0 of 20), as § The merge
>   rule states them; S-3 is C2′'s now. **Before any graded S′,** `ABC-255`'s one S′ on `main` reports the largest
>   overshoot at 500 ms; if it is over 12 ms, the Architect re-sets the margin first. **Pooling** (the ADR's
>   recommendation, recorded here as the rule): S′ scores pool in § The smoke ledger, and when the pooled score leaves
>   60–85 % over ≥ 30 games, E is re-pinned by one band-rule step (E ≤ 2 600). Owed per strength-changing ticket
>   beside its C2′ read and per epic on the closing head; never for a value-identical ticket. ≈ 10 min (estimate).
> - **The owner's condition, `ADR-0056` R-TC.** Part 1: a test control is harness configuration only, and the budget
>   enters the engine core only as the deadline; review reads each strength diff against R-TC item 2, and `ABC-259`
>   (new, below) makes that a default-lane row. Part 2, *"it works on different difficulty settings"*: **per
>   strength-changing ticket, the Levels deep lane** on the candidate head, beside C2′:
>   `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts --reporter=verbose`, QE,
>   host alone, ≈ 9 min; passes on exit 0 with every test passed (41 at the ADR's count; QE counts its own run).
>   **Per epic, on the closing head, beside C3″:** the Levels deep lane, the ladder in short mode
>   (`LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/ladder.test.ts`, 848 s on a loaded host)
>   and the UCI session deep lane (`ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run
>   src/uci-session.test.ts`, ≈ 5 min, estimate), each exit 0 with every test passed; ≈ 30 min together, under 1 h,
>   not asked.
> - **This epic's close, then:** C3″ (head = `main` after milestone 1b, base = `ca6e675c`), S′ on the head, and the
>   three lanes on the head. M2 stays graded on milestone 1's batch. Every ticket left here is value-identical or
>   test-only, so no per-ticket C2′, S′ or Levels deep lane is owed inside this epic.
> - **`ABC-259` cut (G-1; milestone 1b; test-only, XS, P2):** one default-lane source-scan row that turns red when
>   engine-core code reads the budget other than as the deadline, or reads a test flag or the environment. Row 30 of §
>   Tickets. Placed here, not in `EPIC-011` M0: milestone 1b rewrites the search, legality and key files the scan
>   reads, and this epic's close is the first read graded under R-TC.
> - **G-2 is not on any `plans/` page.** The Levels deep lane's trigger list ("after any src/levels.ts, src/engine.ts
>   or src/virtual-clock.ts change") lives in `memory-bank/90-agents-md-command-log.md` (§ On-demand commands),
>   outside this hop's fence; the Scribe owes the line. The per-ticket duty above binds whatever that line says.
> - **`RISK-EPIC010-08` (new, § Risks):** C3″ plays each opening four times, so its ± 24 Elo flatters. QE checks it at
>   this epic's close read, the first C3″. The shape does not change.

> **THE OWNER'S ANSWERS, 2026-11-01, by BA/PM** (task `bapm-owner-answers`, records only, at `main` `adab5f0d`;
> nothing run). The owner's word (`orch-2026-10-30a` `…43098cef`, verbatim there): *"1. b ; 2. ok ; 3. quick check
> can be with 0.5s difficulty. Make sure engine is not changed internally and it works on different difficulty
> settings."* The Orchestrator's rulings with it: the Stockfish smoke is kept at 0.5 s; this epic's close owes the
> per-epic read; `ABC-255` may be pulled before the close (`EPIC-011` C12). **This block amends the one below where
> they differ.** The `ADR-0056` fold of these answers (`arch-adr0056-owner-answers`) is not on `main` at this hop.
> *(Merged since, `a0f9297e`: the block above, `bapm-reconcile-adr0056`.)*
>
> - **Per epic (answer 1, "b"): 400 games head-to-head at 100 ms, the epic's closing build against its starting
>   build.** Self-play in `d`'s shape, through `ABC-255`: `d <head> <base> <out> --budget-ms 100 --rounds 200
>   --concurrency 1` (`d`'s default 200 rounds over the 100 openings of `tools/rating/openings.epd`, both colours; one
>   game at a time). About ± 24 Elo at 95 % (the probe's ± 48 for 100 games, `…07357280`, over √4; arithmetic).
>   **Pass:** 400 of 400 games complete, neither build makes a fault or loses on time at the 50 ms margin, and **the
>   head's point estimate against the base is ≥ 0 (a score ≥ 200.0 of 400), `ADR-0056` C3″** *(was "pending the
>   owner-answers fold"; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. On NOT MET, BA/PM names the suspects and the Orchestrator rules keep, revert or re-read; no revert is
>   automatic. ≈ 1.6 h (4 × the 0.4 h change read; estimate). Owner-set, so no further ask. **It replaces the 200 +
>   200 pair against Stockfish** of the block below.
> - **The bars (answer 2, "ok"):** C2′'s GAIN (≥ 50.0 of 100) and NEUTRAL (≥ 43.0 of 100) stand, with their stated
>   blind spot.
> - **The smoke (answer 3): 10 games against Stockfish, `skytalix` at 0.5 s a move, beside every strength-changing
>   ticket's 100-game read, and at every epic's close on the closing build.** `r <build> <out> --budget-ms 500
>   --rounds 5 --concurrency 1` (`ABC-255` item 2; today `r` plays `skytalix` only at 4 000 ms), `skytalix` with
>   `timemargin` 50 ms; Stockfish at `r`'s own `st=0.5`. It carries S-1 (0 faults) and S-2 (0 losses on time) of § The
>   merge rule. **Its E is 1 650 and its no-collapse bar is S-4: ≥ 3.0 of 10, below that 10 more games and ≥ 7.0 of
>   20** (`ADR-0056` S′) *(was "the fold's … `UNKNOWN - verify` until the fold merges"; merged `a0f9297e`,
>   `bapm-reconcile-adr0056`)*. ≈ 10 min (estimate, ≈ 85 plies a game). This restores the R smoke the block below dropped, at
>   0.5 s and not 4 s.
> - **The owner's condition, "engine is not changed internally":** every test control (100 ms, 0.5 s) is harness
>   configuration only. It reaches `skytalix` as `cutechess-cli`'s `st=` (`go movetime`) at the shipped level 5, whose
>   cap is above both (4 000 ms today, 3 000 ms at `ca6e675c`; `src/levels.ts`). No engine code path is keyed on a
>   test control, and `ABC-255` changes no `src/` or `data/` file (its A6).
> - **"It works on different difficulty settings":** the validation must show the engine plays correctly across its
>   levels and time controls, not only at the test control. ~~**No ticket in this epic or in `EPIC-011` carries that
>   check today.** The Architect names it in the fold; no ticket is cut on this hop.~~ *(2026-11-01,
>   `bapm-reconcile-adr0056`: the fold names it, `ADR-0056` R-TC part 2: the Levels deep lane per strength-changing
>   ticket, plus the ladder short mode and the UCI session deep lane per epic. Every strength ticket's reading row and
>   each epic's close carry it; the block above.)*
> - **This epic's close:** the 400-game head-to-head read (head = `main` after milestone 1b, base = `ca6e675c`) and the
>   0.5 s smoke on the head *(and, `bapm-reconcile-adr0056`, the Levels deep lane, the ladder short mode and the UCI
>   session deep lane on the head; the block above)*. M2 stays graded on milestone 1's batch. `ABC-256` (B0) **no
>   longer** merges into this read, because it has no Stockfish half (`EPIC-011` C13, void) *(and is closed as
>   superseded by C3″, `bapm-reconcile-adr0056`)*.

> **THE OWNER'S VALIDATION RULE, 2026-11-01, by BA/PM** (task `bapm-100-400-rule`, records only, at `main`
> `452415bd`; nothing run). The owner's word (`orch-2026-10-30a` `…2896c6eb`, verbatim there): no SPRT; *"We can just
> run 100 games that's it and 400 games after each epic is done on 100ms."* Earlier the same day: games on one core
> (`…f7a50e95`), and any validation run estimated over 1 h is asked of him first (`…aab3b5f4`). **From this date it
> replaces § The merge rule's smoke pair, trend and batch for every merge still to come.** *(2026-11-01,
> `bapm-owner-answers`: the R smoke returns, at 0.5 s; the block above.)* Rows below that name them
> are history and stay on record.
>
> - **Per strength-changing ticket: 100 games at 100 ms a move, before the merge.** The candidate head rebased on
>   `main` against its merge-base, self-play, openings 1–50 of `tools/rating/openings.epd` with both colours, one game
>   at a time. **Pass (`ADR-0056` C2′, merged `94f1504c`):** 0 faults and 0 losses on time by the candidate at a 50 ms
>   margin, and ≥ 50.0 of 100 for a GAIN or ≥ 43.0 for a NEUTRAL, the intent declared at design; a miss is NOT MET, not
>   re-played. 100 games resolve about ± 48 Elo (95 %): a guard against a clear regression, not a proof of a small gain
>   (`qe-tc-depth-probe` `…07357280`).
> - *(Superseded 2026-11-01, `bapm-owner-answers`: the owner's answer 1 makes it head-to-head, closing build against
>   starting build; the block above.)* **Per epic: 400 games at 100 ms, when the epic's last ticket is Done and before it closes.** By the Orchestrator's
>   reading (`…2896c6eb` item 2): the interleaved pair (`ABC-225`'s `rpair` shape), the epic's base (`main` at its
>   first merge-base) and its head (`main` at the close), each 200 games against Stockfish 19 `UCI_LimitStrength`,
>   `skytalix` at 100 ms. **`ADR-0056` C3′:** Stockfish `st=0.1` for E ≤ 2 600, E by `ABC-204`'s band rule; MET when
>   the pair's point estimate is ≥ 0. The pair resolves about ± 58–78 Elo (the ± 24 of 400 games holds only
>   head-to-head); ≈ 1.0–1.6 h (estimate). The owner set this run, so it needs no further ask.
> - **Any other validation run estimated over 1 h goes to the owner before it starts:** a re-read, a bisect, a longer
>   control, an outside pair before a merge.
> - **Value-identical (speed) tickets keep their S2 nps reading and play no games.** Every ticket left in this epic is
>   value-identical (`ABC-250`–`ABC-254`) or test-only (`ABC-249`), so **no per-change reading is owed here.**
> - *(Its shape and pass line superseded 2026-11-01, `bapm-owner-answers`: head-to-head; the block above.)* **This epic's close now owes the per-epic reading:** base `ca6e675c` (the first merge-base, as milestone 1's batch)
>   against `main` after milestone 1b. **M2 stays graded on milestone 1's batch** (NOT LOSS, `…1a53a7f9`; the measure
>   the owner accepted). The 400-game reading is added by his new rule and is graded by C3′. On NOT MET, BA/PM names
>   the suspects and the Orchestrator rules keep, revert or re-read (C3′; no revert is automatic); any run over 1 h it
>   needs is asked first.
> - *(2026-11-01, `bapm-owner-answers`: the two shapes are now `d` at 100 ms and `r` / `rpair` at 0.5 s; `ABC-255`.)*
>   *(2026-11-01, `bapm-reconcile-adr0056`: per the merged fold, `d --budget-ms 100` and `r --budget-ms 500`;
>   `rpair` gains no control.)*
>   **The instrument:** today `rpair` plays only 4 000 ms against Stockfish at `st=0.5`, and `d` refuses budgets
>   under 1 000 ms (`tools/rating/rating.ts` `D_BUDGETS_MS`). `ABC-255` is re-scoped to add both 100 ms shapes
>   (`EPIC-011`). It is tools only and touches no file milestone 1b edits, so **the Orchestrator may pull it before
>   this epic closes** (`EPIC-011` C12). Otherwise QE reads the close from a scratch command, as the probe did.

> **`ABC-254` BACK IN MILESTONE 1b, FIRST, 2026-11-01 by BA/PM** (task `bapm-ABC-254-ready`, records only, at `main`
> `039cb05e`; nothing run, built or timed, because `qe-ABC-223` holds the host STRICTLY ALONE). The owner said
> "ABC-254: yes" (`orch-2026-10-30a` `…f7a50e95`; Q-SP-3 = yes), and the Architect amended `ADR-0003` clauses 1 and 3
> on that word (`arch-adr0003-amend` `…c314772c`, merged `89af8b56`). Both landed before `ABC-250` entered development,
> so the exception on `ABC-254`'s page (`EPIC-011` C11) is met: **`ABC-254` is this epic's again, milestone 1b,
> first, DoR 10/10** (Ready recommended; the column move is the Orchestrator's). Milestone 1b's order is now
> `ABC-254` → `ABC-250` → `ABC-251` → `ABC-252` → `ABC-253`; `ABC-250` packs the lazy filter. Lines below that put it in
> `EPIC-011` are struck or carry this date. One more S2 nps reading is owed at the close (≈ 1 h ALONE, estimate).

> **CLOSE-OUT PLAN AND RE-HOME 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main`
> `2e9a2457`; nothing run, built or timed, because `qe-ABC-223` holds the host STRICTLY ALONE; `src/`, `tools/`,
> `data/`, the board, the trace, the ADRs and `AGENTS.md` untouched). Source: the owner's word of 2026-11-01
> (`orch-2026-10-30a` `…022fb66f`, verbatim): *"… let's create new Epic yes and finish other epics before that. Go over
> previous epics and tickets to find conflicting work, no need to do the same work twice."*
>
> - **This epic closes after milestone 1b.** What remains: `ABC-249` (Ready, test-only), then *(2026-11-01)* `ABC-254`
>   (first in 1b, top block), then `ABC-250` (Ready) →
>   `ABC-251` → `ABC-252` → `ABC-253` (Ready, pulled last), as § Milestone 1b orders them.
> - **Moved to `EPIC-011`** (the 3 000 path, `ADR-0056`; ids unchanged, each page carries a dated line): milestone 2
>   (`ABC-231`, `232`, `233`, `234`, `236`, `237`, `238`), milestone 3 (`ABC-239`), ~~and `ABC-254` (it waits on the
>   owner's Q-SP-3 and would hold this epic open)~~ *(`ABC-254` back here 2026-11-01, top block)*. Also moved: Q6 and the 3 000 goal (§ Product goal). `ADR-0056` D4
>   maps every one of them to its gap list; keeping them here would make this epic's close wait on the 3 000 path.
> - **Milestone 1b stays here, last.** `ADR-0055` D2/D4 and `ADR-0056` D6 both put O1 before any ticket that edits
>   `orderMoves`, the search or `evaluate`, and the owner closes this epic before `EPIC-011` starts, so 1b lands first
>   either way and `EPIC-011` is written on the packed base. `ABC-250` stays first (the O1-a / O1-b order line in
>   `ADR-0056` D6 is with the Architect, `arch-adr0056-owner-fold` item 4).
> - **Exit readings still owed:** one S2 nps reading per 1b ticket (≈ 1 h ALONE each, ≈ 4 h, estimate); `ABC-249`'s
>   `G8`; a close hop on `main` reading **M3** (the `Q-SET` rows) and **M4** (`G1` ≥ 54/58, `G5`, `G6`, `G7`, `G8`,
>   `G9`); **M1** and **M5** from the records.
> - **M2 needs no new batch.** Milestone 1's batch (head `51902be5` against the first merge-base `ca6e675c`) read NOT
>   LOSS. `git log 51902be5..2e9a2457` shows no production `src/` change, and milestone 1b is value-identical by `G4`,
>   so that batch is M2 at the close (the milestone 1 grade: "this reading stands as M2 only if the epic stops here";
>   the value-changing work of this epic stops there). This saves a ≈ 23 h ALONE batch.
> - **Fences unchanged:** § Out of scope still fences the re-tries, SEE and delta pruning and rook activity **for this
>   epic**; `EPIC-011` holds them now (the owner's Q-3K-5 answer re-opened them there).
> - Tickets table: rows 11–18 ~~and 29~~ read "Moved to `EPIC-011`" *(row 29 back 2026-11-01)*. The dedupe audit of every epic and ticket is on
>   `EPIC-011` § Dedupe audit. The notes are in `.grugops/context/bapm-epic011-dedupe/notes/`.

> **GOAL RESTATED AND MILESTONE 1b CUT 2026-11-01 by BA/PM** (task `bapm-goal3000-o1-cut`, records only, at `main`
> `bae25131`; nothing run, built or timed, because `qe-ABC-223` holds the host STRICTLY ALONE; `src/`, `tools/`,
> `data/`, the board, the trace, the ADRs and `AGENTS.md` untouched). Source: the owner's word of 2026-11-01, verbatim
> in Orchestrator `orch-2026-10-30a` `…74216a44`: *"my call is let's go with 1, least effort and risk. Analyze current
> state of algorithms, maybe this needs separate spike ticket, also I remember some tickets addressing similar topics,
> check if they are done and do we need to analyze algorithm side. As we can see it is possible to reach 3000 elo
> rating without neural engine? Set the goal to 3000 elo rating from current goal."*
>
> - **The product goal is now 3 000 Elo**, replacing 2026-10-29's "2 700 Elo or more" (§ Product goal, dated; the old
>   text is struck and kept). **Its scale is still `UNKNOWN - verify`** (he names none). **What reading would show it
>   is open** (MQ-3000, § Product goal), routed to the Architect's running analysis (`arch-algo-analysis`), not settled
>   here. No ticket, gate or measure is bound to it yet; M2 stays "not LOSS".
> - **Milestone 1b, value-identical speed (`ADR-0055` option O1), is cut:** `ABC-250` (O1-b part 1: packed moves in
>   the rules core, read on perft; M, P2, DoR 10/10, Ready recommended), `ABC-251` (O1-b part 2 with O1-c: the search
>   on packed moves, inlined helpers; L, P2, 9/10, waits `ABC-250`'s reading), `ABC-252` (O1-b part 3: one generator,
>   the shell adapter; M, P3, 9/10, only on `ABC-250` GO), `ABC-253` (O1-a: BigInt off the hot path; M, P3, 10/10,
>   Ready recommended, after the O1-b chain) and `ABC-254` (O1-d: lazy legality; M, P2, 9/10, **Backlog, waits the
>   owner's yes on amending `ADR-0003`**, Q-SP-3). **O1-e is not cut** (`ADR-0055`: "not proposed now"). All are S2,
>   0 games. § Milestone 1b gives the order, the placement reason and the cost; tickets table rows 25–29.
> - **No algorithm ticket is cut or changed.** `ABC-231`…`ABC-239` stay as they are until `arch-algo-analysis` reports.
> - **Owner calls named:** Q-SP-3 (amend `ADR-0003` for `ABC-254`); Q-SP-2 (`ADR-0055` D3's bars, used by `ABC-250`
>   A4, apply as written unless he resets them); Q6, the 3 000 goal's scale and whether it becomes a measure (after
>   `arch-algo-analysis`). § Owner questions.
> - The notes are in `.grugops/context/bapm-goal3000-o1-cut/notes/`.

> **FOLDED 2026-11-01 by BA/PM** (task `bapm-ABC-248-close`, records only, at `main` `37a93b76`; nothing run, built
> or timed, because `qe-qehop-growth` holds the host ALONE; `src/`, `tools/`, `data/`, the board and `AGENTS.md`
> untouched).
>
> - **`ADR-0046` tranche 2 is delivered.** `ABC-248` is **Done**, merged `ef4cd095` (code `71700836`); QE
>   PASS_WITH_GAPS, no gap blocking (`qe-ABC-248` `…cf9bdabf`); UAT waived (0 production lines). **`G8` H 9.09 s,
>   B 9.37 s** (H − B −0.28 s): `NFR-008` MET, the 9.4 s design target MET, W1 not triggered, so no tranche 3 opens.
>   The ADR carries the dated line in its § BA/PM ruling 2026-10-31. Its page is closed.
> - **QE-248-a (MEDIUM):** ruling 6 / A10's `-t` form ran 0 tests with exit 0 (unescaped "[deep, …]"). Corrected on the
>   page and in the ADR (escaped brackets; the check is "4 passed"). The Architect's condition 4 text is owed a matching
>   co-edit (LOW, not blocking).
> - **SE-248-b / QE-248-b:** ruled met as written; a floor is added for later depth-sensitive step moves (in-search
>   node checks ≥ 2, else the step holds until the Architect rules the unit). Nothing is owed now.
> - **`ABC-249` cut** (XS, P3, test-only, DoR 10/10, Ready recommended), from QE-248-c (LOW): one `src/engine.test.ts`
>   row where a position that stood twice before the root is met at ply ≥ 4, so `QPLY4` turns the lane red. Tickets
>   table: row 24. QE-248-d (`QPARITY` likely equivalent) and QE-248-e/f/g are closed on `ABC-248`'s page.
> - Tickets table: row 23 (`ABC-248`) reads Done, as the board does, and row 24 (`ABC-249`) is added. The notes are in
>   `.grugops/context/bapm-ABC-248-close/notes/`.

> **MILESTONE 1 DONE 2026-11-01, graded by BA/PM** (task `bapm-m1-batch-fold`, records only, at `main` `832ff246`;
> nothing run, built or timed; `src/`, `tools/`, `data/`, the board, the ADRs and `AGENTS.md` untouched). Source:
> `qe-EPIC-010-m1-batch-2` (PREREG `…316833e1`, VOID run 1 `…3fb3b1fd`, verdict `…1a53a7f9`, run `…428e3797`, findings
> `…f9a3c308`), merged `5325a0f0`.
>
> **Milestone 1's batch reads NOT LOSS (NEUTRAL): X = −58.3, Y = 77.9, X + Y = +19.6 ≥ 0.** Base `ca6e675c` (main just
> before `ABC-230`) 151/38/11 = **78.25 % ± 5.48 points**. Head `51902be5` (main at spawn, with `ABC-247`) 141/53/6 =
> **72.00 % ± 6.11 points**. 200 + 200 games at 4 000 ms on both sides (`Skill Level` 6), against Stockfish 19 E 1 910,
> width 1. 0 faults, 0 time losses, 400 / 400 games. The block-01 guard passed on both builds, and all 20 PGNs show 0
> skytalix moves at 3.0 s.
>
> **The grade, by the milestone's own rule** (§ The batch: when and what: "not LOSS (X + Y ≥ 0) passes"): **milestone 1
> is DONE and MET.** Every order row is Done (`ABC-226`, `227`, `225`, `228`, `229`, `230`, `235`, `240`, `241`), and
> its close, the batch, is not LOSS.
>
> | # | measure | read at milestone 1 | grade | source |
> |---|---|---|---|---|
> | close | the batch is not LOSS | X + Y = +19.6 | **MET** | `…1a53a7f9` |
> | M1 | every value-changing merge passed the rule | 4 of 4 met S-1 to S-4 (`ABC-230` D 5.5 / R 8.0, `ABC-228` 5.0 / 7.0, `ABC-241` 6.0 / 6.5, `ABC-229` 4.5 / 9.0; 0 faults, 0 time losses). 2 of 2 value-identical merges met S2 (`ABC-235` `…c575d703`, `ABC-240` `…19068f9d`) | **MET** (milestone 1's part) | § The smoke ledger |
> | M2 | not weaker outside, at the close | not read. M2 is the epic-close batch; this reading stands as M2 only if the epic stops here (§ The batch: what) | — | — |
> | M3, M4 | the gaps are closed; nothing regressed | read on `main` at the epic's close | — | — |
> | M5 | the owner's decisions stayed his | `ADR-0053`, `ADR-0054` and `ADR-0020` § AMENDMENT accepted on his word; level 5's 4 000 ms on his OQ-228-1 (ii); Q1 deferred and Q3 answered by him; `ABC-247` was `tools/` only, with no ADR (Orchestrator `…fb0c8978`) | **MET so far** | § Owner questions |
>
> - **QE-M1B2-d (INFO): what the grade does not say.** The point estimate is negative. The head scored 6.25 points
>   (−58.3 Elo) below the base, and only the pair's ± 77.9 keeps it out of LOSS (margin +19.6). A fall of tens of Elo
>   stays invisible at 200 + 200 games (`RISK-EPIC010-01`). The new reference is read on this head, so a real fall of
>   that size, if there is one, sits inside the reference, and the trend cannot see it. A bigger batch (400 + 400) or
>   the owner's longer-thinking games run only on his word (§ The batch). Information for the owner; nothing is asked.
> - **The new 4 000 ms trend reference is 72.00 % ± 6.11 points** (head `51902be5`, 200 R games, 141/53/6). **The flag
>   reads 52.00 %:** ≥ 30 pooled R games at or below 52.00 % pull the next batch forward. **The pool restarts here,
>   empty.** The waiting rows of `ABC-228`, `ABC-241` and `ABC-229` (22.5 / 30 at 4 000 ms) are inside this head, so they
>   close unpooled and are never judged. § "Did things get worse?" and § The smoke ledger carry dated lines. The
>   3 000 ms reference (64.75 %, flag 44.75 %) closed on 2026-10-30 and stays on record only.
> - **QE-M1B2-b (MEDIUM, QE method): a rule for every later batch PREREG**, placed in § The batch: what (dated line).
>   No ADR edit is needed: it says how the harness is launched, not what the batch measures.
> - **QE-M1B2-c (MEDIUM, host): recorded.** The batch was briefed STRICTLY ALONE, but another repository on the host
>   ran `vitest` in bursts: 102 of 1 332 watcher ticks (7.7 %), and three block-runs above 25 % (base b01 34 %, base
>   b04 30 %, candidate b05 42 %). It drove run 1's thermal pause and, through QE-M1B2-b, its VOID. It was logged and
>   never killed. It is not a cause under the PREREG, and no block shows a fault, a time loss or a clock off 4.0 s. Its
>   effect on the scores is `UNKNOWN - verify` (it fell on both sides). The Orchestrator routed it to the owner. **No
>   ticket:** the host is shared outside this repository, and the PREREG's wait-clear, contamination log and thermal
>   pause already guard a batch.
> - **The wall:** session 22.22 h (18.0 games/h, 0 pauses), inside the restated 21.7–24.1 h. The hop took 23.17 h,
>   counting VOID run 1 (48 min). § Cost on this host and `ABC-225`'s page carry a dated line.
> - **Tickets table:** rows 7 (`ABC-235`), 8 (`ABC-240`), 19 (`ABC-243`), 20 (`ABC-244`), 21 (`ABC-245`) and 22
>   (`ABC-247`) read Done, and row 23 (`ABC-248`) reads Ready, as the board does. `ABC-247`'s page is closed.
> - The notes are in `.grugops/context/bapm-m1-batch-fold/notes/`.

> **CUT AND RESTATED 2026-10-31 by BA/PM** (task `bapm-rpair-level6-cut`, records only, at `main` `278a9bb7`; nothing
> run, built or timed, because `qe-ABC-245` holds the host ALONE; `src/`, `tools/`, `data/`, the board and the ADRs
> untouched). Source: QE's STOP of milestone 1's batch before game 1 (`qe-EPIC-010-m1-batch` `…5967dfc1`,
> `…21029f54`; QE-M1B-a HIGH, QE-M1B-b MEDIUM) and the Orchestrator's route (A) (`orch-2026-10-30a` `…fb0c8978`).
>
> - **`ABC-247` cut** (XS, **P1**, tools only, DoR 10/10, Ready): `rpair` passes `option.Skill Level=6` to skytalix
>   on both builds. The base `ca6e675c` caps `go movetime 4000` at its `LEVELS[5]` = 3 000 ms. Level 6 is
>   `{ 5 000 ms, rate 0 }` at both SHAs, so both sides then search 4 000 ms. `pair-check` pins the token; a 4-game
>   probe reads 4.0 s clocks at both SHAs; the SE confirms the skill reaches only the cap in `go()`. **The D and R
>   smoke paths are left alone** (the reason is on its page). It blocks the batch. Tickets table: row 22.
> - **The batch's cost is restated: about 21.7–24.1 h ALONE at 4 000 ms on both sides, plus about 1 h of QE (about
>   22.7–25.1 h).** QE-M1B-b: 3.26–3.61 min a game, from the `qe-ABC-228-ii` and `qe-ABC-241` R smokes (36.1 and
>   32.6 min for 10 games), × 400 games. **The 18.5 h figure is withdrawn:** `ABC-225` A6's 21.67 games/h was a
>   **3 000 ms rate**, because both A5 builds came before `ABC-228` and capped `movetime 4000` at 3 000 ms (QE's
>   count: PGN clocks 3.0 s on 895 and 991 skytalix moves, 4.0 s on none). BA/PM's cross-check, arithmetic and not a
>   measurement: scaling A5's 2.77 min a game by (4 + 0.5) / (3 + 0.5) s a move pair gives 3.56 min, or about 23.7 h,
>   inside the range. **The whole milestone, spent plus remaining, is about 29–32 h, about 26–29 h of it ALONE**
>   (an estimate; `ABC-247`'s probe, about 0.3 h, is not counted). The Orchestrator tells the owner, who may stop or
>   reschedule. Changed with dated marks: the cost table's batch and total rows, § Cost on this host and
>   `RISK-EPIC010-04`. `ABC-225`'s page carries the same block.
> - **Audit of the smoke ledger for 3 s / 4 s asymmetry (records only; confidence high):** **no ledger reading was
>   asymmetric, no verdict moves and the trend pool does not move.**
>   - Two ledger rows have a base before `ABC-228`'s merge `e42b637b`: `ABC-230` (base `c0698ddd`) and `ABC-228`
>     (base `61d5d629`). `ABC-241` (base `e42b637b`) and `ABC-229` (base `b92a3394`, after it) do not.
>   - **`ABC-230`:** R sent 3 000 ms then (the R literal was 3 000 at `dad753dc`), so it is outside the question. PGN:
>     468 skytalix moves at 3.0 s, 0 at 4.0 s. It is the closed 3 000 ms pool's one row, read in its own frame.
>   - **`ABC-228`:** R sent 4 000 ms. **An R smoke plays one skytalix build, the candidate; its base does not play.**
>     The candidate `5e84d0d7` has `LEVELS[5]` = 4 000: the R literal and the level moved in one commit, `8c82399f`.
>     PGN: 476 skytalix moves at 4.0 s, 0 at 3.0 s (`TimeControl "4/move"`). Not capped.
>   - **D smokes:** both builds play at B = 1 500 ms, below every `LEVELS[5]` in this epic (3 000 ms or more;
>     `D_BUDGETS_MS` tops out at 3 000). All four D PGNs read 1.5 s on every move. Never capped.
>   - **Why only `rpair` was exposed:** it is the one mode where two skytalix builds play under the R pins and one can
>     predate `e42b637b`. Its one real run, `qe-ABC-225-w1` A5, played both sides at 3 000 ms (symmetric but labelled
>     4 000 ms). A5 graded no strength, so its verdict stands; its rate moves the cost (above). `qe-ABC-225`'s
>     thermal-stopped A5 (4 games) read nothing. `qe-ABC-228-ii`'s `G6`/`G11` ran each build at its own `LEVELS[5]` by
>     design under (ii), recorded as such; that is not a smoke and not this defect.
>   - **What moves:** nothing graded. The 4 000 ms rows waiting for the reference (`ABC-228`, `ABC-241`, `ABC-229`)
>     are all truly 4 000 ms by their PGN clocks (476, 430 and 410 moves at 4.0 s, none at 3.0 s).
>   - **What is owed:** (1) `ABC-229`'s ledger row, owed at this page's next BA/PM hop and before any batch, is
>     **folded on this hop** (§ The smoke ledger). (2) `ABC-229`'s page close and tickets-table row 5 (merged
>     `5953c631`, QE PASS_WITH_GAPS `qe-ABC-229` `…2afef8bf`) are a separate fold, not done here. (3) The dated cost
>     lines, done here. Nothing is owed to the owner from the audit.
> - The notes are in `.grugops/context/bapm-rpair-level6-cut/notes/`.

> **FOLDED 2026-10-31 by BA/PM** (task `bapm-ABC-242-close`, records only, at `main` `d58f2d77`; nothing run, built
> or timed; `src/`, `tools/`, `data/`, the board and the ADRs untouched).
>
> - **Milestone 1's total is restated at width 1.** Every build ticket of milestone 1 is Done (`ABC-225`, `226`, `227`,
>   `228`, `229`, `230`, `235`, `240`, `241`), so **what remains is the batch alone: about 18.5 h ALONE (range
>   17.5–19.4 h) plus about 1 h of QE, about 19.5 h.** The "≈ 15 h, of which ≈ 12 h ALONE" total assumed the batch
>   at width 2 (≈ 9 h) and is stale.
>   - **Why width 1:** the owner's word, verbatim (`orch-2026-10-30a` `…65848126`): *"ABC-225 - approve to run one
>     at a time"*. It covers `ABC-225`'s A5. The Orchestrator ruled on 2026-10-30 (board, under the 2026-10-22
>     delegation) that the batch also runs at `--concurrency 1`, on the same thermal ground: width 2 tripped 85 °C.
>     The owner was informed and may override.
>   - **The source of 18.5 h:** `ABC-225` A6 (`qe-ABC-225-w1` `…7e9bd36f`), 21.67 games/h over 40 games at 4 000 ms. *(2026-10-31, `bapm-rpair-level6-cut`: a **3 000 ms** rate; both A5 builds
>     predate `ABC-228` and capped `movetime 4000` at 3 000 ms (QE-M1B-a). The batch is about 21.7–24.1 h ALONE plus
>     about 1 h; the block at the top.)*
>     It is an estimate from a small sample, and 22–24 h stays the slow case. The batch reads its own wall.
>   - **The whole milestone, spent plus remaining, is about 26 h, about 23 h of it ALONE** (an estimate): the four
>     smoke pairs as costed on 2026-10-29 (≈ 4.8 h, ≈ 2.8 h ALONE; not re-summed from the ledger), `ABC-225`'s A5 as
>     read (1.85 h play), and the batch (≈ 19.5 h).
>   - **Heat at width 1:** the A5 run read a Tctl median of 74.1 °C and a max of 78.8 °C. The table's "82–83 °C,
>     84–87 °C" was the width-2 R reading.
>   - Changed: the cost table's total row, § Cost on this host's batch line, and `RISK-EPIC010-04`'s milestone 1
>     figure, each with a dated line.
> - **`ABC-242`: Done**, merged `af5b2b49`; QE PASS_WITH_GAPS (`qe-ABC-242` `…f24601b8`) signs UAT. `G8` H 9.41 s
>   (B 9.21 s). **QE-242-a (MEDIUM) is pending with the Architect** (`arch-qe242a-ruling`): whether `ABC-244`'s
>   condition 2 reads a blunder per call or per child search. BA/PM does not rule it. The other gaps are folded on
>   its page.
> - **`ABC-245` cut** (XS, P3, test-only, Backlog 9/10), from QE-242-b (LOW): one far-repeat row so that lowering the
>   100-key cap turns the lane red, plus the stale `src/levels.test.ts` header count (SE-242-f). It waits on the
>   QE-242-a ruling for its step. It is in no milestone.
> - **`ABC-225`: Done** (merged `59dc3ab4` on 2026-10-30). Its page is closed, with the dispositions of QE-225w1-a, -c,
>   -d and -e. QE-225w1-d's nps spread is read in the batch.
> - Tickets table: rows 3 (`ABC-225`) and 10 (`ABC-242`) read Done, and row 21 (`ABC-245`) is added. The notes are in
>   `.grugops/context/bapm-ABC-242-close/notes/`.

> **ESTIMATE RESTATED 2026-10-31 by BA/PM** (task `bapm-ABC-222-epic009-m1`, records only, at `main` `4bd9ac6a`;
> QE-225w1-b, LOW). **Milestone 1's batch, a 400-game interleaved R pair (200 + 200) at width 1, is about 18.5 h
> ALONE (range 17.5–19.4 h), plus about 1 h of QE.** It was about 22–24 h. *(Withdrawn 2026-10-31,
> `bapm-rpair-level6-cut`: A6's rate was read at 3 000 ms, not 4 000 ms (QE-M1B-a/b). At 4 000 ms on both sides the
> batch is about 21.7–24.1 h ALONE plus about 1 h of QE; the block at the top.)*
>
> - The source is `ABC-225`'s A6 reading (`qe-ABC-225-w1` `…7e9bd36f`): 21.67 games/h at `--concurrency 1` and
>   4 000 ms, over 40 games, ALONE. The Tctl median was 74.1 °C and the max 78.8 °C.
> - The rate depends on game length (36 of 40 ended in mate), and 40 games is a small sample for a rate. So 22–24 h
>   stays as the slow case. The batch reads its own wall.
> - Changed: the cost table's batch row and the 2026-10-30 FOLDED block's A6 line (dated inline). The width-2 ≈ 9 h
>   figure is not re-read: no width-2 run is planned (QE-225-b (iii)).
> - Scheduling an ALONE run of about 18–20 h is the Orchestrator's call. `ABC-225`'s page carries the same block.

> **CUT 2026-10-30 by BA/PM** (task `bapm-g8-headroom-cut`, records only, at `main` `161e940d`; `src/`, `data/`,
> `tools/`, the board and the ADRs untouched). **`ABC-244` cut** (S, P1, test-only, DoR 10/10): the time-blind
> `ABC-230` / `ABC-241` virtual-clock rows take the coarsest kill-set-preserving step (`ADR-0046` § Addendum
> 2026-10-30 R1–R4, whose BA/PM word is given on its page). It answers `QE-229-a` (`G8` 9.90 s, 0.10 s of headroom),
> with a design target of `G8` ≤ 9.4 s. **It is pulled before `ABC-242` and `ABC-243`.** Both gained dated lines:
> `ABC-242`'s rows take level 1's 100 ms at the coarsest safe step, not QE's 2 000 ms probe set-up; `ABC-243` is
> estimated at about +0.03 s. Tickets table: row 20 added. The notes are in
> `.grugops/context/bapm-g8-headroom-cut/notes/`.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-ABC-242-225-owner`, records only, at `main` `5090a4d6`; `src/`, `data/`
> and `tools/` untouched). The owner's words, verbatim (`orch-2026-10-30a` `…65848126`): *"ABC-242: accept, ABC-225 -
> approve to run one at a time"*.
>
> - **`ABC-242`: DoR 9/10 → 10/10, Ready.** The owner accepted `ADR-0054` § Proposed amendment 2026-10-30, so the
>   blunder path scores a root move's third occurrence exactly 0, with no child search. `A1` gained the
>   last-in-order fixture. `A4` is read through determinism. `A8` is corrected: the ladder lane is an identity row,
>   and `A1`–`A5` are the checks. It is S2 with no smoke and in no milestone. It shares only
>   `src/uci-session.test.ts` with `ABC-243`, which makes that rebase order only.
> - **`ABC-225`: Blocked → In Development.** A5 runs at `--concurrency 1`.
>   - Its wall is about 2 h, or about 2.2–2.4 h by the recorded 4 000 ms width-1 R rate.
>   - The `rpair` budget still moves 3 000 → 4 000 (`se-ABC-225-main`). DoR stays 10/10.
>   - A6 now projects the full pair at width 1, at about 22–24 h *(read 2026-10-31: about 18.5 h, range 17.5–19.4 h;
>     the ESTIMATE RESTATED block at the top)*. **For the Orchestrator:** milestone 1's batch
>     costs about 9 h at width 2 (§ cost). The owner's word covers `ABC-225`'s A5, not the batch's width.
> - Tickets table: rows 3 (`ABC-225`) and 10 (`ABC-242`) changed. The notes are in
>   `.grugops/context/bapm-ABC-242-225-owner/notes/`.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-ABC-241-merge-fold`, records only, at `main` `a649fbc4`; `src/`, `data/`
> and `tools/` untouched). **`ABC-241` is Done.** It merged at `1f6abec4` on QE's PASS_WITH_GAPS (`qe-ABC-241`
> `…2368b03f`), which signs UAT.
>
> - **§ The smoke ledger:** one row, `ABC-241` (D 4/2/4 = 6.0, R 6/3/1 = 6.5 at 4 000 ms, recorded and not pooled).
>   S-1..S-4 were met. Rows waiting at 4 000 ms are now `ABC-228` and `ABC-241`, 13.5 / 20, INFO only and never judged.
>   There is still no 4 000 ms reference before milestone 1's batch.
> - **`ABC-243` re-scored 10/10, Ready** (its wait was `ABC-241`'s merge). It gained one row from QE-241-a (LOW): a UCI
>   `position fen` that carries an uncapturable ep square. It is still XS and test-only.
> - Tickets table: rows 9 (`ABC-241` Done) and 19 (`ABC-243` Ready) changed. The notes are in
>   `.grugops/context/bapm-ABC-241-merge-fold/notes/`.

> **RE-SCORED 2026-10-30 by BA/PM** (task `bapm-ABC-229-rescore`, records only, at `main` `ee3c7694`; `src/`, `data/`
> and `tools/` untouched). **`ABC-229` is 10/10, Ready.** Its wait, `ABC-228`'s merge, is met (`e42b637b`). Its page
> folds what (ii) changes: `G5`/`G6` at 4 000 ms, R at 4 000 ms recorded and not pooled, and no 3 000 ms reference.
> A `G6` miss is not pre-answered and goes to the owner. The `Q-SET` promotion rows are still to be frozen by QE. It
> shares no production file with `ABC-241`, `ABC-220` or `ABC-243`. Only the tickets table's row 5 changed. The notes
> are in `.grugops/context/bapm-ABC-229-rescore/notes/`.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-ABC-228-merge-fold`, records only, at `main` `e42b637b`; `src/`, `data/`
> and `tools/` untouched). **`ABC-228` is Done.** It merged under (ii) at `e42b637b` on QE's PASS_WITH_GAPS
> (`qe-ABC-228-ii` `…e39d190c`). The (ii) build happened: the graded `G6` at 3 s missed (position-6 9 against 10),
> `A9` read ≤ 133 %, and `G6` under (ii) read 8 = 8 and 10 = 10.
>
> - **The R frame is now 4 000 ms.** § The merge rule's R row, § The trend's reference and flag, the batch's budget,
>   § Out of scope's `G9` line and § NFR triggers carry dated marks.
> - **§ The smoke ledger:** two rows folded, `ABC-230` (3 000 ms) and `ABC-228` (R at 4 000 ms, recorded and not
>   pooled). **The 3 000 ms trend pool closed at this merge** with 10 R games, 8.0 / 10, flag not evaluable. Until
>   milestone 1's batch sets the 4 000 ms reference, later R rows are recorded and not pooled, so **layer 2 (the trend)
>   cannot fire before that batch.** Layers 1 (the smokes) and 3 (the batch) are unchanged.
> - **`ABC-243` cut** (XS, P3, Backlog, test-only): QE's non-blocking gaps SE-228ii-a and QE-228ii-b.
> - The notes are in `.grugops/context/bapm-ABC-228-merge-fold/notes/`.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-q3c-oq228ii-fold`, records only, at `main` `7b8eeb94`; `src/`, `data/`
> and `tools/` untouched). The owner answered in session, verbatim *"QQ-228-1: ii ; Q3: c"* (`orch-2026-10-29g`
> `…c4ab73de`). The Architect recorded both (`arch-q3c-oq228ii` `…b86f7d93`): `ADR-0020` § AMENDMENT 2026-10-30 and
> `ADR-0053` decision 10.
>
> - **Q3 answered (c):** normalise the ep file only when comparing against the game's earlier positions; the hash does
>   not change. **`ABC-241` is cut:** S, P2, milestone 1, value-changing (smoke pair, with the repetition-ending count),
>   DoR 9/10, Backlog until `ABC-230` merges. § B item 3, § Out of scope, the tickets table and § Owner questions are
>   folded.
> - **OQ-228-1 answered (ii):** on an `ABC-228` `A8` miss, level 5's per-move time goes 3 000 → 4 000 ms inside
>   `ABC-228`, after a re-forecast at ≤ 133 % (above it, back to the owner). `G9` is waived for `ABC-228` on
>   `LEVELS[5]` only (§ Out of scope). `ABC-228` carries the `rating.ts` R literal (3000 → 4000). The R frame then
>   moves to 4 000 ms: the 3 000 ms references (R(close) 64.75 %, the trend flag at ≤ 44.75 %) are never compared
>   with a 4 000 ms reading, the trend pool closes at `ABC-228`'s merge, and the batches run both sides at 4 000 ms.
>   § The merge rule's R row and § NFR triggers read 3 000 ms until that merge. If `A8` fits, none of it happens.
> - The notes are in `.grugops/context/bapm-q3c-oq228ii-fold/notes/`.

> **FOLDED 2026-10-30 by BA/PM** (task `bapm-owner-adr-fold`, records only, at `main` `a046e839`; `src/`, `data/` and
> `tools/` untouched). The owner answered in session (`orch-2026-10-29g` `…3dd61448`, verbatim): *"ADR-0053: accept ;
> QQ-228-1: If engine requires more effort then increase 3s to 4s, build it fully. ; ADR-0054: accept ; Q1: ok defer
> Syzygy tables ; Q3: I need more info to answer"*.
>
> - **`ADR-0053` accepted:** `ABC-228` DoR 10/10, **Ready**. `ABC-229` stays 9/10, and its wait is now `ABC-228`'s merge.
> - **OQ-228-1:** build the full evasion design. The "3s to 4s" clause applies only if `ABC-228` `A8` (`ADR-0053`
>   decision 9's forecast, re-read after `ABC-235`/`ABC-240`) still misses `G6`. Which 3 s it means (`G6`'s budget,
>   or level 5's per-move time) ~~is pending the owner~~ **is (ii), level 5's per-move time** *(answered 2026-10-30,
>   `…c4ab73de`; see the block above)*. A level-5 reading would move `NFR-005`'s referent and `ADR-0045`, so it is
>   his.
> - **`ADR-0054` accepted:** `ABC-230` DoR 10/10, **Ready**.
> - **Q1 deferred** by the owner: Syzygy stays out of this epic. ~~**Q3 still open:** he asked for more information.
>   The Orchestrator gives it in session from `arch-ABC-230-reading` `…90a3aa31` § 3. Default (a) holds.~~ *(Q3
>   answered (c), 2026-10-30; see the block above.)*
> - The notes are in `.grugops/context/bapm-owner-adr-fold/notes/`.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-ABC-235-split`, records only, at `main` `a37f1d87`; `src/`, `data/` and
> `tools/` untouched). The Architect ruled on `ABC-227`'s six cuts (`arch-ABC-235` `…7fc1b90c`, `…eebca902`):
>
> - **`ABC-235` keeps cuts 1, 3 and 5.** Its page carries a dated scope line: cut 6 moved out; the "piece list" and
>   "cheaper legality for non-captures" candidates struck; cuts 2 and 4 out, for the Architect's reasons. DoR 10/10.
> - **`ABC-240` is new: cut 6, move ordering without per-move allocation.** It is value-identical under the
>   Architect's four conditions, on S2 with no smoke. Its bar is ≥ 1.03 × nps on two boards. If it misses, it is not
>   merged and is closed as dropped, and nothing waits on it. S, P3, DoR 10/10, Ready. It is milestone 1's order 8,
>   after `ABC-235` and before `ABC-233`/`ABC-234`, which edit the same `orderMoves`.
> - **One observation, not a ticket:** the castling attack tests left under `hasLegalMove` (§ Observations).
> - The notes are in `.grugops/context/bapm-ABC-235-split/notes/`.

> **AMENDED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only, at `main` `4dcb353e`; `src/`, `data/` and
> `tools/` untouched by this hop). The owner answered Q2, Q4 and Q5 on 2026-10-29 (`orch-2026-10-29g` `…278e149b`,
> verbatim; his words govern): *"Selecting Q4 option e, extend a bit, let's set 10 games self-play + 10 games vs
> stockfish ; 1. not sure, explain ; 2. remove that goal, I would set another goal - be the best vibe-engineered or
> TypeScript-based chess-engine (not sure what exists out there, we can put goal to 2700 elo rating or more, world
> record is 3650). It can be that in the future we need to rewrite to Rust, but let it be for now, this is big
> undertaking. ; 3. not sure, explain ; 4. accept without elo target, elo target is hard to reach, but try to
> understand if things get worse."* (His 1–4 are this page's Q1, Q2, Q3 and Q5; Q4 he answered first.)
>
> - **Accepted** (Q5): `proposed` → `backlog`. M1–M5 as written, **no Elo target**. His intent, "understand if things
>   get worse", is answered by § The merge rule's three layers.
> - **Q4 = (e), extended:** a 10-game D smoke and a 10-game R smoke per value-changing ticket before its merge, and a
>   batched major validation later. § The merge rule (in force) writes it out, with the caveat that 10 games catch
>   crashes, time losses and collapses, not a loss of tens of Elo.
> - **Q2:** `EPIC-004`'s "strength above ~1700" non-goal is removed (dated amendment on that page). The new product
>   goal is in § Product goal: aspirational, no ticket bound to it, its scale `UNKNOWN - verify`. A Rust rewrite is
>   out of scope.
> - **Q1 and Q3 stay open**, with their defaults: (a) keep Syzygy out; (a) keep `ADR-0020` d2.
> - **`ABC-225` re-scoped, not retired:** it is the batched validation's instrument, no longer the per-ticket reading.
>   `Backlog` → `Ready`, DoR 10/10.
> - **Every other ticket:** Q4 is removed from its wait, its next real wait is named, and its DoR is re-scored
>   (value-changing tickets +1: row 4 now has a measurable reading). `ABC-226` is Done (SA `sa-ABC-226` `…cc53fc79`:
>   484 costed games, R 26), so `ABC-230` stays in milestone 1.
> - **Milestone 1 re-costed:** ≈ 15 h of host readings, ≈ 12 h of it ALONE, against ≈ 60–80 h under (b).
> - The notes are in `.grugops/context/bapm-owner-words-b/notes/`.

> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`. `main`'s `src/`,
> `data/` and `tools/` are unchanged since `3ad6bc10`, the commit the SA read). The rulings are in
> `.grugops/context/bapm-epic010-improvements/notes/`. This hop ran no test, no game and no probe.
>
> **Source and evidence.** The owner's 10 external ideas (`ideas-2026-10-29/input/owner-ideas.md` § B) are the
> **input, not the evidence**. The owner asked that they be checked. Every fact on this page comes from the System
> Analyst's verified notes: the claims table `sa-ideas-verify` `…306a4012`, the decision on which items stand
> `…837e6fa8`, and the time note `…1ccf0010` (item 4 only). The measurement question comes from the Architect's
> `arch-epic008-rd` `…0c5d62f4` / `…9d172446`. A fact no note verified is marked `UNKNOWN - verify`.
>
> **Routing:** Orchestrator `orch-2026-10-29g` `…ccb72dbe` (deferred until the SA and the Architect landed), `…a8bfb3be`,
> `…183a5bbc` (owner: no R gauntlet; EPIC-008 accepted as is; "i will run longer-thinking games in the future") and
> `…27fae3c4` (routed, with owner questions 1–4).
>
> **What is the owner's here:** the pre-merge measurement rule (Q4), the two `EPIC-004` non-goals (Q1, Q2), re-opening
> `ADR-0020` d2 (Q3) and this epic's measures (Q5). Nothing on this page picks them. Until he answers, only the two
> records-and-probe tickets `ABC-226` and `ABC-227` are `Ready`; no engine value changes. *(As cut. Since 2026-10-29:
> Q2, Q4 and Q5 are answered and Q1 and Q3 stay open; see the amendment above.)*

## Which ideas this epic carries (SA `…837e6fa8`)

| § B item | SA verdict | Here |
|---|---|---|
| 1 Quiescence | **Stands**, one correction: the leaf (ply 0) is checked for mate and stalemate | `ABC-228` (evasions in check), `ABC-229` (quiet promotions) |
| 2 Evaluation process | Facts true; **already in hand** (`arch-epic008-rd`); paired openings already exist | **The measurement rule (Q4)** and `ABC-225` (the reading it needs) |
| 3 Game history into search | **Stands**; never tried. The ep-late point is an owner ruling (`ADR-0020` d2) | `ABC-226` (records scan first), `ABC-230` (the build). The ep point is Q3, answered (c) 2026-10-30: `ABC-241` (the repetition key, after `ABC-230`) |
| 4 Tournament clock | Stands, corrected | **Not here: `EPIC-009`** (`ABC-218`–`ABC-222`). Cross-referenced, not duplicated |
| 5 Phase-aware evaluation | **Stands**. `ABC-205` failed on depth cost (`G6`), not on play | `ABC-231` (king table taper only), `ABC-232` (passed pawns by phase) |
| 6 Move ordering | **Stands**. SEE is fenced (`ADR-0024` d4); under LMR an order change changes values | `ABC-233` (history heuristic), `ABC-234` (SEE for capture order, behind its fence) |
| 7 Cost per node | **Stands in part**: captures-only legality is done (`ABC-206`) | `ABC-227` (profile first), `ABC-235` (value-identical cuts 1, 3, 5), `ABC-240` (cut 6, ordering without allocation) |
| 8 Offline tuning | **Stands; never tried** | `ABC-239`, last |
| 9 TT and aspiration | **Stands in part**: TT kept across a game is already tried (`ABC-209`) | `ABC-236` (aspiration), `ABC-237` (depth-preferred replacement), `ABC-238` (deeper-entry cutoffs) |
| 10 Syzygy | **Against a permanent non-goal** (`EPIC-004`) | Nothing cut. Q1: **deferred** by the owner, 2026-10-30 |

**Not re-proposed as it was tried** (SA `…837e6fa8` § Already tried):
- `ABC-209`'s TT kept across one game (NEUTRAL +8.7 ± 18.3, 800 games). `ABC-237`/`ABC-238` change how one search uses
  the table, and the table is still cleared per search (`ADR-0025` d4 as in force).
- `ABC-210`'s horizon check extension, form (a) (NEUTRAL −4.8 ± 16.2). `ABC-228` searches evasions *inside*
  quiescence, which was never built. Where they overlap (a frontier node in check), `ABC-210` is the nearest prior
  evidence, and it was NEUTRAL (`RISK-EPIC010-02`).
- `ABC-205`'s design (king-safety term plus a tapered king table, closed on `G6` at `position-6`). `ABC-231` is the
  taper alone, with no king-safety term, and must first replay `ABC-205`'s failing `G6` reading (its `A1`).
- `ABC-207`'s mobility weights and early-queen term (LOSS −18.3 ± 16.5). Nothing here re-tunes them by hand.
  `ABC-239` would tune all weights by a stated method, last.

## Problem

- **User:** the owner, who plays `npm run chess` at level 5 (3 s a move) and drives `skytalix` from a UCI GUI.
- **Pain, from the records:**
  - `EPIC-008` shipped two value-changing changes on self-play (D) readings, and its outside reading (R, Stockfish 19
    at E = 1 910, `skytalix` at 3 000 ms) **fell**: −82.9 ± 73.8 (`M1` NOT MET). The Architect ranks "the changes did
    not transfer from self-play to Stockfish" first (`arch-epic008-rd` `…0c5d62f4`). **A ship rule that reads only D
    can ship a loss.** That is the first pain this epic addresses.
  - The search has code-proven gaps (SA `…306a4012`): quiescence stands pat **in check** (probe Q2: `quiesce` =
    static = −548 with only a quiet king evasion), skips **quiet promotions** (probe Q3: `quiesce` 212 against
    `chooseMove` 1 033), and the search never sees **the game's earlier positions** (rows 3a–3c), so it cannot know
    that a move repeats a position from the game.
  - The evaluation is untapered (5a, 5b), ordering has no quiet-move history (6b), and the TT and root window are
    basic (9a–9e). Each is a known gap; none has a play effect on record (`UNKNOWN - verify`).
- **Value:** a stronger opponent at the same levels. Every change that alters a value is shown to work against an
  outside opponent at the product's own 3 s budget before it merges (no fault, no loss on time, no collapse), and the
  merged changes are read in batches for a fall (the owner's Q5: "try to understand if things get worse"). "Stronger"
  here is a reading, never a forecast. *(Amended 2026-10-29 for Q4 = (e); the cut read "shown not to lose".)*

## The cheapest slice that proves the value

1. **Measure first, at no game cost:** `ABC-226` scans the 14 reading PGNs already in the records (4 R, 10 D) for repetitions the search
   could not see; `ABC-227` profiles where a node's time goes. Both are `Ready` now.
2. **The rule is set** (owner, Q4 = (e), extended, 2026-10-29): two 10-game smokes per value-changing ticket on
   today's harness, and a batched R pair later. `ABC-225` makes the batch one command.
3. **Then the one proven tactical gap:** `ABC-228`, evasions in check inside quiescence, behind an ADR, an
   `ADR-0026` door and the Q4 reading. If it does not pass the rule, it does not ship, and the epic has still bought a
   ship rule that EPIC-008 lacked.

The epic can stop after any ticket and hold only changes that passed the owner's rule.

## The merge rule (in force from 2026-10-29: owner Q4 = (e), extended)

> **Superseded 2026-11-01 for every merge still to come** (`bapm-100-400-rule`, the owner's word `…2896c6eb`): 100
> games at 100 ms per strength-changing ticket, 400 at 100 ms per epic, no SPRT; the top block of this page. *(2026-11-01,
> `bapm-owner-answers`: the epic read is head-to-head and a 10-game Stockfish smoke at 0.5 s sits beside each
> 100-game read; the first block of this page.)* This
> section stays as the record of the rule milestone 1 was merged under.

**The owner's word** (`…278e149b`): *"Selecting Q4 option e, extend a bit, let's set 10 games self-play + 10 games vs
stockfish"*, and for Q5 *"accept without elo target … but try to understand if things get worse."* His `EPIC-009` word
sets the shape: smokes "just to make sure things work", major validation of 100 or more games later (`…a67f71ac`).

### Per value-changing ticket: two smokes before the merge

After the ticket's own gates are green, QE reads both smokes on the candidate head, rebased on `main` as it will merge.
Both run ALONE, on AC, with the thermal and frequency log; a frequency fall over 5 % makes a smoke UNRESOLVED, and it
is re-run once (`RISK-EPIC009-04`). Both use today's harness as it is: no `tools/` change.

| smoke | who plays | command (`tools/rating/rating.ts`) | games | width | wall on this host |
|---|---|---|---|---|---|
| **D** | the candidate against base (base = the candidate's merge-base on `main`), both at the frozen B = 1 500 ms | `d <candidate> <base> <out> --budget-ms 1500 --rounds 5 --concurrency 1` | 10: openings 1–5, both colours | 1 | ≈ 26 min (23.3 games/h, `qe-epic008-q4c` `…311eb14b`) |
| **R** | the candidate (level 5, 3 000 ms *(4 000 ms from `ABC-228`'s merge `e42b637b`: `rating.ts` R passes `4000`)*, `OwnBook` on) against Stockfish 19 `UCI_LimitStrength` E = 1 910 | `r <candidate> <out> --elo 1910 --rounds 5 --concurrency 2` | 10: openings 1–5, both colours | 2 | ≈ 13–14 min (44–46 games/h, `qe-epic008-close`) |

**The merge rule.** A value-changing ticket merges only if all four hold:

- **S-1 (faults).** The candidate makes 0 faults in the 20 games: no illegal move, crash, disconnect or stall
  (`EPIC-008`'s states). A fault by base or by Stockfish makes that smoke UNRESOLVED; it is re-run once, and a base
  fault is routed as a defect on `main`.
- **S-2 (time).** The candidate loses 0 games on time in the 20.
- **S-3 (D, no collapse).** The candidate scores **≥ 3.0 of 10** against base.
- **S-4 (R, no collapse).** The candidate scores **≥ 3.0 of 10** against Stockfish.
- **Below 3.0 on S-3 or S-4:** that smoke plays 10 more games, and all 20 are judged together: **≥ 7.0 of 20** passes,
  below is NOT MET. The first 10 still count; this is a confirmation, not a second try for luck.

**What follows a miss.**
- S-1 or S-2 missed: NOT MET. It is a defect, so the ticket goes back to the Software Engineer, and both smokes are
  read again after the fix.
- S-3 or S-4 missed: NOT MET. QE records a `failed-attempt` note. The ticket goes back to BA/PM and does not merge.
- **Stale smokes:** a smoke read on a base that another value-changing merge has since moved is stale, and it is read
  again (≈ 1 h; `EPIC-008` § When a D reading goes stale, scaled down).
- **Value-identical tickets** (`ABC-235`, `ABC-240`) stay on `EPIC-008`'s S2 and play no smoke.
- **Where it is recorded:** QE's smoke note carries one row of § The smoke ledger. The ticket's `## Reading` cites
  that note.

### What 10 games can and cannot see (the Orchestrator's caveat)

**10 games catch a crash, an illegal move, a loss on time and a collapse. They cannot see a loss of tens of Elo.**
BA/PM's arithmetic (exact over win/draw/loss, from the recorded scores; not a measurement):

- `main`'s R reference is `EPIC-008`'s R(close): 64.75 % (W/L/D 125/66/9) at `38536a34`. `main`'s `src/` and `data/`
  are identical to that build today (`git diff` empty). *(2026-11-01, `bapm-m1-batch-fold`: that 3 000 ms reference
  closed on 2026-10-30. The R reference is now 72.00 % ± 6.11 at 4 000 ms (head `51902be5`, milestone 1's batch). The
  odds below were worked at 64.75 % and are not re-derived at 72.00 %.)*
- **10 R games read the score to about ± 29 points of percentage (95 %), so ± 200 Elo or wider.**
- An unchanged candidate is stopped by S-4 about 7 times in 10 000, and by S-3 about 1 time in 60 to 160 (it depends on
  the D draw rate, 30–50 %).
- A candidate that truly fell to 30 % against Stockfish (≈ 250 Elo below `main`'s +105 over E = 1 910) is stopped
  about **4 times in 10**. A fall to 20 % is stopped about 7 times in 10, and a fall to 15 % about 85 times in 100.
- So a smoke stops a broken change and a gross collapse. It lets every small loss through.

### "Did things get worse?": the trend and the batched validation

Three layers answer it. Each sees a different size of fall, and none sees a fall of tens of Elo.

| layer | what it reads | what it can see | what it does |
|---|---|---|---|
| **1. The smoke** (per ticket) | S-1 to S-4 | a fault, a loss on time, a collapse (≈ 250 Elo or more at R) | the ticket does not merge |
| **2. The trend** (across tickets) | the **pooled R smoke score** of every value-changing merge since the last batch, in § The smoke ledger, against the R reference | a cumulative fall of **≈ 140 Elo** or more, once ≥ 30 R games are pooled | **The trend flag:** pooled ≥ 30 games and pooled score ≤ reference − 20 points (≤ 44.75 % today; *2026-10-30: that 3 000 ms reference closed at `ABC-228`'s merge. The next is milestone 1's passing batch head at 4 000 ms, and its flag is that score − 20 points. Until then no flag is evaluable*; *2026-11-01, `bapm-m1-batch-fold`: the 4 000 ms reference is 72.00 % ± 6.11 (head `51902be5`, milestone 1's batch, NOT LOSS), so the flag reads ≤ 52.00 %; the pool restarted empty*). The batch is then pulled forward, and no further value-changing merge happens until it reads |
| **3. The batch** (major validation) | an interleaved R pair (`ABC-225`): the batch's head against its base, 200 + 200 games | a fall larger than **≈ 70–75 Elo**, the pair's half-width at `EPIC-008`'s Y | not LOSS (X + Y ≥ 0) passes. LOSS: see below |

- **The trend's own error** (same arithmetic): with nothing changed, the flag fires about 1 time in 100 per check. At a
  true fall to 44.75 % (≈ 140 Elo) it fires about half the time; at 40 %, about 7 times in 10. A fall to 55 % (≈ 70
  Elo) fires it about 1 time in 9. *(2026-11-01: worked against 64.75 %; not re-derived against 72.00 %.)*
- **The batch: when.** At each milestone's close, after its value-changing merges (milestone 1: after `ABC-228`,
  `ABC-229`, `ABC-230` and `ABC-241`; *read 2026-11-01: NOT LOSS (NEUTRAL), `qe-EPIC-010-m1-batch-2` `…1a53a7f9`*). Earlier if the trend flag fires, or on the owner's word. The epic-close batch is M2.
- **The batch: what.** Base = `main` just before the batch's first value-changing merge (for the first batch, the
  epic's first merge-base, so milestone 1's batch is also M2 if the epic stops there). E = 1 910, 3 000 ms *(4 000 ms
  on both sides from `ABC-228`'s merge, `ADR-0053` d10; the added wall time is `UNKNOWN - verify`)*, the R
  pins, width 2, ALONE: ≈ 9 h plus ≈ 1 h of QE. That is the owner's "100 or more games" at the R pins.
  *(2026-10-31, `bapm-rpair-level6-cut`: a base before `e42b637b` caps `go movetime 4000` at its level 5's 3 000 ms (QE-M1B-a), so
  `rpair` plays both builds at `Skill Level` 6 (`{ 5 000 ms, rate 0 }` at every SHA so far), which searches 4 000 ms
  on both sides: `ABC-247`, route (A), `…fb0c8978`. Each batch PREREG checks that level 6 is still rate 0 with a
  budget ≥ 4 000 ms at both SHAs, and reads 4.0 s clocks on both builds after block 01 (`ABC-247` Test note 3). At
  width 1 and 4 000 ms the batch is ≈ 21.7–24.1 h ALONE plus ≈ 1 h of QE.)*
  *(2026-11-01, `bapm-m1-batch-fold`, from QE-M1B2-b (MEDIUM): **every later batch PREREG whose thermal pause works
  by a signal (`SIGSTOP` / `SIGCONT`) launches the harness, and its watcher, detached from any agent job-control
  parent** (`setsid -f`, as milestone 1's re-run did), **and records the harness's parent pid before game 1; it must
  not be an agent task runner's process.** Launched as an agent's background task, the pause becomes a kill: milestone
  1's run 1 was torn down at the first `SIGSTOP` and was VOID at 48 min (`…3fb3b1fd`). The pause path is still
  unexercised on a real batch, so the PREREG also records a `SIGSTOP` / `SIGCONT` test on a detached process before
  game 1, as QE did.)*
- **After a passing batch,** its head's own R score becomes the trend's reference, and the pool restarts.
  *(2026-11-01: milestone 1's batch passed. The reference is 72.00 % ± 6.11 points, head `51902be5`, 200 R games at
  4 000 ms; the flag reads 52.00 %; the pool restarted empty. § The smoke ledger.)*
- **A batch that reads LOSS** cannot say which merge caused it. Then no further value-changing merge of this epic
  happens. The ledger names the suspects, the merges in the batch with their R smoke scores, for information only.
  BA/PM frames three options for the owner: (i) revert the suspects; (ii) bisect with one R pair per merge, ≈ 10 h
  each; (iii) accept. Heat and hours are his (`…a8bfb3be`, `…183a5bbc`).
- **Tens of Elo stay invisible.** Seeing them needs a bigger batch (400 + 400 games: about ± 50, ≈ 18 h plus 1 h),
  or the owner's own longer-thinking games (`…183a5bbc`). Either one runs only on his word.

### The smoke ledger

QE appends one row per smoke pair, in its smoke note. BA/PM folds the rows in here at its next hop on this page, and
always before a batch. The pooled score and the flag are QE's to compute at each smoke.

| ticket | candidate sha | base sha | D W/L/D (score) | R W/L/D (score) | faults | time losses | pooled R since last batch | flag | Tctl median / max |
|---|---|---|---|---|---|---|---|---|---|
| `ABC-230` | `dad753dc` | `c0698ddd` | 4/3/3 (5.5) | 8/2/0 (8.0) | 0 | 0 | 8.0 / 10 = 80.0 % (this smoke only; the ledger had no row) | not evaluable (10 < 30 pooled games) | D 73.5 / 75.8 °C; R 73.75 / 77.6 °C (width 1) |
| `ABC-228` | `5e84d0d7` | `61d5d629` | 3/3/4 (5.0) | 7/3/0 (7.0) **at 4 000 ms; recorded, not pooled** | 0 | 0 | 8.0 / 10 = 80.0 % (`ABC-230`'s row at 3 000 ms; the pool closes at this merge) | not evaluable (10 < 30 pooled games) | D 76.0 / 87.3 °C; R 75.13 / 85.8 °C (width 1) |
| `ABC-241` | `d1a2d5cd` | `e42b637b` | 4/2/4 (6.0) | 6/3/1 (6.5) **at 4 000 ms; recorded, not pooled** | 0 | 0 | none computed: there is no 4 000 ms reference until milestone 1's batch (the 3 000 ms pool closed at `ABC-228`'s merge). Rows waiting at 4 000 ms: `ABC-228` 7.0 / 10 and `ABC-241` 6.5 / 10 (13.5 / 20, INFO only, never judged) | not evaluable (no reference) | D 74.38 / 83.6 °C; R 74.63 / 85.5 °C (width 1) |
| `ABC-229` | `e196a281` | `b92a3394` | 2/3/5 (4.5) | 9/1/0 (9.0) **at 4 000 ms; recorded, not pooled** | 0 | 0 | none computed: no 4 000 ms reference until milestone 1's batch. Rows waiting at 4 000 ms: `ABC-228` 7.0 / 10, `ABC-241` 6.5 / 10 and `ABC-229` 9.0 / 10 (22.5 / 30, INFO only, never judged) | not evaluable (no reference) | D 74.75 / 83.0 °C; R 78.44 / 87.5 °C (width 1) |

*Reference: R(close) 64.75 % at `38536a34` (`EPIC-008`), at 3 000 ms.* *(Retired 2026-11-01, `bapm-m1-batch-fold`:
it closed at `ABC-228`'s merge and stays on record. The reference is now 72.00 % ± 6.11 at 4 000 ms; see the 4 000 ms
pool below.)* *Folded 2026-10-30 by BA/PM
(`bapm-ABC-228-merge-fold`), copied from QE's smoke notes: `qe-ABC-230` `…a715c1d8` and `qe-ABC-228-ii` `…2123617d`.
Both rows ran at width 1 (the Orchestrator's delivery call after the width-2 thermal stop), not at the table's R width 2.*
*`ABC-241`'s row was folded 2026-10-30 by BA/PM (`bapm-ABC-241-merge-fold`), copied verbatim from QE's smoke note
`qe-ABC-241` `…5d70bb7c`. It ran ALONE at width 1. A foreign process overlapped part of each smoke (D 31 of 253
samples, R 13 of 195), with no thermal stop and a frequency fall ≤ 0.10 %, so both readings stand (QE-241-f). Repetition
endings were D 1 / R 1 against base's 1 / 0, and `ABC-241`'s rule touched neither (QE-241-e).*
*`ABC-229`'s row was folded 2026-10-31 by BA/PM (`bapm-rpair-level6-cut`), copied from QE's smoke note `qe-ABC-229`
`…cfb537cf` (merged `5953c631`; verdict `…2afef8bf`). It ran ALONE at width 1. The first R run was killed externally in
game 1 (VOID) and re-run once. A foreign vitest overlapped part of each smoke (D 25 of 220 samples, R 127 of 188), with
no thermal stop and a frequency fall of 0.10 % (D) and 0.82 % (R), so both readings stand under QE's PREREG. Its R row
read 410 skytalix moves at 4.0 s and 0 at 3.0 s (PGN clocks). The audit of 2026-10-31 (the block at the top) found no
row in this ledger read at an unequal or capped time: `ABC-230` at 3 000 ms and the other three at 4 000 ms, as
labelled; every D at 1 500 ms on both sides.*

- **The 3 000 ms pool is closed** (`ABC-228`'s merge, `e42b637b`): 1 row, 10 R games, 8.0 / 10 = 80.0 %, judged
  against 64.75 %. The flag was never evaluable (fewer than 30 games). This pool is not carried forward.
- **`ABC-228`'s R row is at 4 000 ms.** It is recorded here and is never compared with the 3 000 ms reference or pooled
  with the 3 000 ms row.
- **From this merge until milestone 1's batch:** each value-changing ticket's R row is recorded at 4 000 ms and waits.
  No pool is computed and no flag is evaluable, because there is no 4 000 ms reference yet. The batch runs both sides
  at 4 000 ms; if it passes, its head score is the reference and a new pool opens. *(Closed 2026-11-01: milestone 1's
  batch passed, NOT LOSS (NEUTRAL), `qe-EPIC-010-m1-batch-2` `…1a53a7f9`.)*
- **The 4 000 ms pool (open from 2026-11-01, `bapm-m1-batch-fold`).**
  - **Reference: 72.00 % ± 6.11 points**, the R score of milestone 1's batch head `51902be5` (141/53/6 over 200 games,
    100 openings, both colours), against Stockfish 19 `UCI_LimitStrength` E 1 910, 4 000 ms, width 1.
  - **Flag: ≥ 30 pooled R games scoring ≤ 52.00 %** (72.00 − 20). It pulls the next batch forward, as layer 2 says.
  - **Pool: empty, 0 games, flag not evaluable.** The next value-changing merge's R row opens it. QE computes the pool
    and the flag at each smoke, as before.
  - **The waiting rows close unpooled:** `ABC-228` 7.0 / 10, `ABC-241` 6.5 / 10 and `ABC-229` 9.0 / 10 (22.5 / 30) were
    played on builds that are inside this batch's head, not merged since it. They stay on record, INFO only, never
    judged.
  - **Comparability:** a per-ticket R smoke runs `r` (level 5), and the batch ran `rpair` (level 6). At any SHA from
    `e42b637b` on, both search `go movetime 4000` for 4 000 ms at rate 0 (QE, `…1a53a7f9`), so a later R row compares
    with this reference. The R smokes since `ABC-230` ran at width 1, as the batch did. If `LEVELS[5]` is ever rolled
    back to 3 000 ms (`ADR-0053` d10 § Rollback), this reference is stale.

### Cost on this host

- **Per value-changing ticket:** about 0.7 h of ALONE games (D ≈ 26 min at Tctl median 74–76 °C; R ≈ 13–14 min at
  82–83 °C), plus about 0.5 h of QE: **about 1.2 h.** A confirmation smoke adds up to 0.45 h. The harness clones and
  builds once per run; that time is not in the records (`UNKNOWN - verify`; minutes).
- **Per batch:** ≈ 9 h ALONE plus ≈ 1 h of QE. *(2026-10-31, `bapm-ABC-242-close`: that is width 2. The batch runs at `--concurrency 1`
  (the owner's "one at a time" for `ABC-225`, extended to the batch by the Orchestrator's ruling of 2026-10-30), at
  **≈ 18.5 h ALONE (17.5–19.4 h) plus ≈ 1 h of QE**, from `ABC-225` A6.)* *(2026-10-31, `bapm-rpair-level6-cut`: **≈ 21.7–24.1 h
  ALONE plus ≈ 1 h of QE** at 4 000 ms on both sides (QE-M1B-b, from the 4 000 ms R smokes' 3.26–3.61 min a game).
  A6's 21.67 games/h was a 3 000 ms rate, so 18.5 h is withdrawn.)* *(**Read 2026-11-01**, milestone 1's batch
  (`…1a53a7f9`): session 22.22 h at width 1, 18.0 games/h, 0 pauses, inside the 21.7–24.1 h estimate; the hop took
  23.17 h with its VOID run 1 (48 min).)*
- **Against the framed options:** (b) was ≈ 19–27 h per ticket; (a) was ≈ 9–17 h.

## Measurement first: the options as framed for Q4 (history; the owner picked (e), extended, 2026-10-29)

*This section is the cut's text, kept as framed. § The merge rule above is in force.*

**Why.** The Architect's ranking (`…0c5d62f4`): (1) opponent dependence, not separable from (3) time per move; (2)
chance on R's size, not its sign (joint p 0.001–0.002 that R and D measure the same thing). Under (1) and (3), the
conclusion is the same: *"a change that alters values should not ship on self-play alone. Its ship rule needs an
outside-opponent reading at the product budget, before merge."* The owner declined a gauntlet on `EPIC-008` and
asked that this lesson be carried here as a rule for him to set (`…183a5bbc`).

**The readings, as pinned** (`EPIC-008` § The two readings; tools re-pinned on this host in `ABC-204` § Dependencies,
2026-10-28; no pin moves here):
- **R:** the built `skytalix` (level 5, 3 000 ms, `OwnBook` on) against Stockfish 19 `UCI_LimitStrength` at
  E = 1 910, 200 games (100 openings, both colours). Y ≈ 50–55 at the scores read so far.
- **R pair:** R on the base and R on the candidate, **interleaved in blocks** on one host in one window (the order
  and drift confound `EPIC-008`'s close carried), difference X ± √(Y₁² + Y₂²) ≈ ± 70–75 at EPIC-008's Y. Reported
  with the opening-paired (pentanomial) error beside the tool's Y (`…0c5d62f4` explanation 2: −82.9 ± 64.3 against
  ± 73.8).
- **D:** candidate against base, self-play, 400 games at the frozen B = 1 500 ms. Y ≈ 23.

**This host's costs** (from the records; estimates where marked):

| reading | games | wall | heat (Tctl) | source |
|---|---|---|---|---|
| R, width 2 | 200 | 4.3–4.5 h (44–46 games/h) | median 82–83 °C, max 84–87 °C | `qe-epic008-close`; `…0c5d62f4` |
| R pair, width 2 | 400 | **≈ 9 h + ≈ 1 h QE** | as R, for ≈ 9 h | the line above, ×2 |
| D, width 1 | 400 | **≈ 17 h** (23.3 games/h on the 100-game look) | median 74–76 °C; max 95.5 °C under foreign load | `qe-epic008-q4c` `…311eb14b` |
| D, width 2 | 400 | ≈ 9 h, `UNKNOWN - verify` (never read at width 2 here) | ≈ as R | estimate from R's rate |
| a NEUTRAL extension (S1) | +400 D | the same again | the same again | `EPIC-008` S1 |

**Options** (per value-changing ticket; a value-identical ticket stays on `EPIC-008`'s S2 in every option):

| | rule | host time per ticket | what it catches | what it misses |
|---|---|---|---|---|
| **(a)** | `EPIC-008`'s S1 as is: D GAIN (one NEUTRAL extension); R only at the epic's close | ≈ 9–17 h (+ the same on a NEUTRAL) | small self-play gains (Y ≈ 23) | exactly `EPIC-008`'s failure: a change that wins self-play and loses outside |
| **(b)** | S1 on D, **then an R pair before merge: merge only if the R pair is not LOSS** (X + Y ≥ 0) | ≈ 19–27 h (D + ≈ 9 h + 1 h) | a non-transferring drop larger than ≈ 70–75 Elo, at the product budget, same opponent | a drop smaller than ≈ 70: R at 200 + 200 cannot see it |
| **(c)** | **the R pair replaces D:** merge if X > 0 and X + Y ≥ 0 | ≈ 10 h | the sign that matters, at the product budget | precision: a change worth 0 passes about half the time |
| **(d)** | **hold:** no value-changing ticket of this epic merges until the owner sets (a)–(c) or gives other evidence (for example his own longer-thinking games, `…183a5bbc`) | 0 h | — | nothing ships |

- **BA/PM's reading, offered and not picked: (b).** It keeps D's precision for the gain and adds the outside check
  that `RISK-EPIC008-03`'s mitigation (`M1` is R) applied only at the close, after the merges. Its cost is real:
  milestone 1 has three value-changing tickets (`ABC-228`, `229`, `230`), so ≈ 60–80 h of ALONE host time at
  82–87 °C, spread over idle windows (`EPIC-008` Q2: whenever idle).
- **Default without an answer: (d).** BA/PM does not apply a rule on its own. Every value-changing ticket stays in
  `Backlog`; the records tickets (`ABC-226`, `ABC-227`) and the value-identical `ABC-235` are unaffected.
- **INFO for Q4, not applied (owner word on `EPIC-009`, Orchestrator `…a67f71ac`, Q1):** *"For simpler tests use much
  less matches, 5 or 10, just to make sure things work, major validation with 100 or more games comes later since it
  can run over 24 or 48 hours."* He said it of `EPIC-009`. If he means the same here, it is a fifth option, **(e):** a
  5–10-game smoke per ticket (no faults, no illegal moves), and one batched outside validation later. Cost ≈ 0.5 h per
  ticket. It shows a change works; at ± 200 Elo or wider it cannot show a gain or catch a per-ticket loss, so a later
  batch that reads LOSS cannot say which merge caused it. Asked under Q4, not assumed.
- **Not decided here:** a longer budget (the owner's "for promising changes, longer" in § B item 2). The owner plans
  longer-thinking games himself; when they exist they are evidence for this epic, and a ship reading only on his word.
- The thermal rule of `EPIC-009` (`RISK-EPIC009-04`) applies to every reading: ALONE, on AC, thermal and frequency
  log, a frequency fall over 5 % makes the reading UNRESOLVED.

## Milestones and order (the external list's #1–#3 order is one input, not a ruling)

**Milestone 1, "measure, then the proven gaps":**

| order | id | why here |
|---|---|---|
| 1 | `ABC-226` | Records only, 0 games, minutes of CPU. It tells whether item 3 costs games at all (the SA's named probe), which sets `ABC-230`'s priority |
| 2 | `ABC-227` | Probes only, single positions, 0 games. Item 7's "success is playing results, not nps alone" needs a profile before any cut. Feeds `ABC-235` |
| 3 | `ABC-225` | `tools/` only, `Ready`. **Re-scoped 2026-10-29:** it is the batch's instrument and is on no ticket's path. It must be Done before milestone 1's batch; it may be pulled whenever width allows |
| 4 | `ABC-228` | The external list's #1, and the strongest code evidence (probe Q2, row 1b). Never built in this form. **ADR first:** `ADR-0024` d4 and `ABC-079`'s recorded decision (`src/quiescence.ts:21-24`), plus an `ADR-0026` d10 door |
| 5 | `ABC-229` | Same ADR as `ABC-228` (one amendment can name both), separate mechanism, so its own reading. Small |
| 6 | `ABC-230` | The external list's #3. Proven gap (rows 3a–3c), never tried. **ADR reading first:** `ADR-0002` clause 3 already speaks of seeding the per-ply array from history, and `ABC-081` `A6` forbids importing `src/history.ts` into the search, so keys are handed in; `ADR-0044` D3 for the UCI parser. Behind `ABC-226` |
| 7 | `ABC-235` | Value-identical, so S2 and no playing reading: the cheapest engine change. Behind `ABC-227` |
| 8 | `ABC-240` | Split from `ABC-235` (2026-10-29, cut 6). Value-identical, S2, no smoke. After `ABC-235`, so its reading has a quiet host and a base that holds it. It must land before milestone 2's `ABC-233`/`ABC-234`, which edit the same `orderMoves`. If its A3 misses, it is dropped and the order closes up |
| 9 | `ABC-241` | Q3 (c), cut 2026-10-30: the repetition key drops an uncapturable ep file in the game-end count and the prior keys. After `ABC-230`, whose prior-key builders it edits. Value-changing, S |
| close | the batch | An interleaved R pair (`ABC-225`), milestone 1's head against the epic's first merge-base (§ The merge rule). *Read 2026-11-01: NOT LOSS (NEUTRAL), X −58.3 ± 77.9, base `ca6e675c` 78.25 %, head `51902be5` 72.00 % (`…1a53a7f9`); milestone 1 DONE (the block at the top)* |

**Milestone 1, re-costed 2026-10-29 under Q4 = (e)** (this host; the `G6` real-clock gates each ticket owes are the
same under every option and are not counted):

| item | reading | host time |
|---|---|---|
| `ABC-226` | Done: a records scan, 3.7 s of CPU | 0 |
| `ABC-227` | a profile, 0 games | 0 games |
| `ABC-228`, `ABC-229`, `ABC-230` | one smoke pair each | ≈ 3 × 1.2 h ≈ 3.6 h (≈ 2.1 h ALONE) |
| `ABC-241` (added 2026-10-30) | one smoke pair | ≈ 1.2 h (≈ 0.7 h ALONE); the total below is as re-costed 2026-10-29 and now ≈ 16 h, ≈ 13 h ALONE |
| `ABC-235` | S2, no playing reading | 0 games |
| `ABC-240` | S2, no playing reading | 0 games |
| `ABC-225` | its A5 run, 40 games | ≈ 1 h ALONE *(2026-10-30: at `--concurrency 1` by the owner's word, ≈ 2 h, or ≈ 2.2–2.4 h by the recorded 4 000 ms width-1 R rate)* |
| milestone 1's batch | an interleaved R pair, 200 + 200 | ≈ 9 h ALONE plus ≈ 1 h *(at width 2; at width 1 ≈ 22–24 h, an estimate from the 4 000 ms width-1 R smokes. The batch's width is the Orchestrator's to schedule or take to the owner, 2026-10-30)* *(**Restated 2026-10-31:** at width 1 ≈ 18.5 h ALONE, range 17.5–19.4 h, plus ≈ 1 h, from `ABC-225` A6's 21.67 games/h (`qe-ABC-225-w1` `…7e9bd36f`); 22–24 h is the slow case)* *(**Restated 2026-10-31, `bapm-rpair-level6-cut`:** ≈ 21.7–24.1 h ALONE plus ≈ 1 h, at 4 000 ms on both sides with `rpair` at `Skill Level` 6 (`ABC-247`); A6's rate was a 3 000 ms rate, QE-M1B-a/b)* |
| **total** | | ~~≈ 15 h, of which ≈ 12 h ALONE (R heat: Tctl median 82–83 °C, max 84–87 °C)~~ *(stale: the batch at width 2)* **Restated 2026-10-31 (`bapm-ABC-242-close`), at width 1: what remains is the batch alone, ≈ 18.5 h ALONE (17.5–19.4 h) plus ≈ 1 h of QE (≈ 19.5 h); every other row is spent. Spent plus remaining ≈ 26 h, ≈ 23 h ALONE (an estimate; the smoke rows are the 2026-10-29 costing, `ABC-225` A5 is the read 1.85 h). Width 1 by the owner's "one at a time" (`…65848126`) and the Orchestrator's batch ruling of 2026-10-30. Heat at width 1: Tctl median 74.1 °C, max 78.8 °C (`ABC-225` A5)** *(**Restated 2026-10-31, `bapm-rpair-level6-cut`:** what remains is `ABC-247` (XS, its probe ≈ 0.3 h ALONE, an estimate) and the batch, ≈ 21.7–24.1 h ALONE plus ≈ 1 h of QE (≈ 22.7–25.1 h). Spent plus remaining ≈ 29–32 h, ≈ 26–29 h ALONE, the probe not counted. The A5 heat figure was read at 3 000 ms; the batch reads its own)* |

Under (b), the same milestone was ≈ 60–80 h ALONE. A confirmation smoke adds ≤ 0.45 h per ticket that needs one.

*`ABC-242` (added 2026-10-30, QE-230-a) is in no milestone: P3, S2 with 0 smoke games (its `A8`; the Orchestrator ruled S2,
no smoke), pulled after `ABC-241` once its Architect reading is in. It does not change milestone 1's batch, which plays level 5 only.
2026-10-30 (`bapm-ABC-242-225-owner`): `ABC-241` is Done, the reading is merged and the owner accepted it. Ready 10/10.
2026-10-31 (`bapm-ABC-242-close`): Done, merged `af5b2b49`, 0 smoke games as ruled. QE-242-a is with the Architect.*

**Milestone 1b, "value-identical speed" (`ADR-0055` option O1; owner 2026-11-01, `…74216a44`; cut 2026-11-01 by
BA/PM, `bapm-goal3000-o1-cut`).** Every ticket is value-identical, graded on S2 (identity, perft, node-rate bar,
`G1`–`G9`), and plays **0 games**, as `ABC-235` and `ABC-240` did (`ADR-0055` § Elo per speed doubling: a 1.5× speed-up
sits inside the batch's ± 78, so speed is graded on nps, not games).

| order | id | `ADR-0055` cut | size, priority | why here |
|---|---|---|---|---|
| ~~(first, only if allowed in time)~~ ~~**moved to `EPIC-011` 2026-11-01** (`bapm-epic011-dedupe`: waits Q-SP-3; would hold the close)~~ **first** (back 2026-11-01, `bapm-ABC-254-ready`) | `ABC-254` | O1-d, lazy legality (`ADR-0003` (c2)), est. 1.15–1.40× | M, P2 | The largest single prize; `ADR-0055` D4 puts it first. ~~**Waits the owner's yes on amending `ADR-0003` (Q-SP-3) and the amending ADR.** If they arrive before `ABC-250` enters development, it goes first; otherwise after `ABC-252`, because both rewrite `src/legal.ts`~~ **2026-11-01: the yes (`…f7a50e95`) and the amending ADR (`89af8b56`) arrived before `ABC-250` entered development, so it goes first**, and `ABC-250` packs the lazy filter |
| 1 | `ABC-250` | O1-b part 1: packed moves in generation, legality, make/unmake; read on perft | M, P2 | Reads O1-b's data-layout gain on perft before the search is spent, with `ADR-0055` D3's A1 / A0 bars (GO ≥ 1.25×; HOLD 1.10–1.25×; NO-GO < 1.10×). The AssemblyScript prototype is not run, so this is where that reading happens. Not merged on HOLD or NO-GO |
| 2 | `ABC-251` | O1-b part 2 with O1-c: the search, quiescence, ordering and killers on packed moves; inlined helpers | L (S if narrowed), P2 | On GO: the full form, bar ≥ 1.10×. On HOLD / NO-GO: narrowed to O1-c alone, bar ≥ 1.03× (`ADR-0055`'s HOLD row: "only the cheap parts (O1-a, O1-c)") |
| 3 | `ABC-252` | O1-b part 3: one generator; the shell through one converter | M, P3 | Removes the second move path `ABC-250` stages; dropped if `ABC-250` is dropped |
| 4 | `ABC-253` | O1-a: keys as two 32-bit halves in the hot path; `bigint` at the API | M, P3 | `ADR-0055` D4's last O1 step. Independent of `ABC-250`'s reading; shares the search, TT and key files, so it rebases on the chain |
| — | (not cut) | O1-e, incremental material + PST | — | `ADR-0055`: "S; not proposed now" (`arch-ABC-235`: "low net, wide reach, collides with `ABC-231`"). Recorded, not cut |

- **Placement: a milestone of this epic, not a new epic.** (1) This page already carries the S2 rule for
  value-identical tickets (§ The merge rule) and the two precedents (`ABC-235`, `ABC-240`, milestone 1 rows 7–8); a
  new epic would restate the gates, the merge rule and the NFR triggers. (2) Milestone 1b and milestone 2 **collide on
  files** (`orderMoves`, `src/evaluate.ts`, the search, the TT, `src/legal.ts`; `ADR-0055` D2), and § Dependencies is
  where this epic orders collisions; splitting the pages would split that ordering. (3) `ADR-0055` D2's order, cheap
  value-identical speed first and then milestone 2, is a statement about this epic's sequence. (4) Five tickets with no
  success measure of their own beyond S2 do not earn an epic. **Against:** this page is long; the speed work is named
  in one section and one block, so it reads on its own.
- **Order against milestone 2:** milestone 1b goes first (`ADR-0055` D2, D4), so milestone 2's value-changing tickets
  are written on the packed base and their smokes read a faster base (fair to both sides of a pair). Milestone 2's own
  order and content wait on `arch-algo-analysis` (no change here). `ABC-249` (test-only) is recommended before
  `ABC-251`. *(2026-11-01, `bapm-reconcile-adr0056`: so is `ABC-259` (test-only, G-1), so that `ABC-251`'s rewrite of
  the search is a change the scan already reads.)*
- **Close:** milestone 1b closes when its last ticket is merged, dropped or (for `ABC-254`) declined. **There is no
  batch:** value-identical merges move no value, so the 4 000 ms trend pool and reference are untouched.
- **Cost on this host (estimate):** 0 games. One QE nps reading per ticket, about 1 h ALONE with `G6` each (the
  `qe-ABC-235` / `qe-ABC-240` shape), so about 4–5 h ALONE across the milestone. Expected gain, `ADR-0055` § O1
  combined: **1.08–1.35× without O1-d, 1.25–1.85× with it** (low-medium confidence; central guesses ≈ 1.2× and
  ≈ 1.5×). Informally ≈ 16–58 Elo for 1.25–1.5× (`ADR-0055` § Elo per speed doubling), invisible to the batch.
- **Not decided here:** the language port (O2, O3: not pursued, owner 2026-11-01); the prototype (Q-SP-1: not run);
  Q-SP-4 and Q-SP-5 fall away (Orchestrator `…74216a44`).

**Milestone 2, "evaluation by phase, ordering, TT and window"** (each value-changing, each with its own smoke pair, each
`Backlog` on an ADR; Q4 no longer holds them since 2026-10-29): `ABC-231` → `ABC-232` (evaluation; after milestone 1's quiescence changes settle the node
budget that `G6` reads, because `ABC-205` failed on exactly that), `ABC-233`, `ABC-234` (ordering; `ABC-234` behind
`ADR-0024` d4's own re-open condition), `ABC-236`, `ABC-237`, `ABC-238` (TT and window). ***(2026-11-01, `bapm-epic011-dedupe`: milestone 2 moved to `EPIC-011`, Phases 1, 3 and 4, in `ADR-0056` D6's order. This epic does not read it.)*** *(2026-11-01,
`bapm-goal3000-o1-cut`: after milestone 1b, on its packed base. Its content and order are unchanged here and wait on
the Architect's `arch-algo-analysis`, which maps `ABC-231`…`ABC-239` against the 3 000 goal.)*

**Milestone 3:** ***(2026-11-01, `bapm-epic011-dedupe`: moved to `EPIC-011` Phase 4 as E2, after the full taper E1.)*** `ABC-239`, offline tuning. Item 8 itself says "after the phase-aware design settles". It is the
costliest (High in § B), it needs a data licence ruling (`ADR-0048`), and self-play non-transfer (`…0c5d62f4`) bears
directly on how a tuned set is judged.

**Why this order and not § B's.**
- § B ranks #2 second; here it is the rule (Q4, set 2026-10-29 as (e)), ahead of every value-changing build, because
  `EPIC-008` shows a reading that measures the wrong thing ships losses. `ABC-225` now serves the batch.
- Items 1 and 3 have code-proven gaps and were never tried; items 5, 6 and 9 are known gaps with no play evidence, and
  item 5's last try failed on cost. Records and probes (0 games) come before builds (each ≈ 1.2 h of smokes under (e); ≈ 10–27 h under the cut's options).
- Item 4 is `EPIC-009`'s. Its `ABC-218` reading and this epic's readings both run ALONE; the Orchestrator orders them.

## Product goal (owner, 2026-10-29, Q2; restated by the owner 2026-11-01: 3 000 Elo): no ticket bound to it

**2026-11-01 (`bapm-epic011-dedupe`): the 3 000 goal now lives in `EPIC-011`**, with its claim control (40/15, the owner's word `…022fb66f`) and its open parts (scale, claim rule, milestones). This section is kept as the record; this epic binds no measure to it, and M2 stays "not LOSS".

**2026-11-01, the owner's word** (Orchestrator `orch-2026-10-30a` `…74216a44`, verbatim; recorded by BA/PM,
`bapm-goal3000-o1-cut`): *"As we can see it is possible to reach 3000 elo rating without neural engine? Set the goal to
3000 elo rating from current goal."*

- **The goal, from 2026-11-01:** `skytalix` aims at **3 000 Elo**. It **replaces** "2 700 Elo or more" (2026-10-29,
  below, struck and kept). The rest of the 2026-10-29 goal is not withdrawn by his word: the best vibe-engineered /
  TypeScript-based chess engine, with no neural network (his question assumes none; `EPIC-004`'s permanent non-goal and
  § Out of scope stand). A Rust rewrite stays out of scope.
- **Still no ticket, gate or measure bound to it.** He set "the goal", not a measure of this epic. Q5's "no Elo
  target" on M2 stands until he says otherwise. Whether 3 000 becomes a measure, and of what, is his call, informed by
  the Architect's `arch-algo-analysis` (Q6, § Owner questions).
- **Its scale stays `UNKNOWN - verify`.** He names no rating list, time control or field. This page does not pick one.
- **MQ-3000, the open measurement question (for `arch-algo-analysis`, item 5 of its brief; not settled here):**
  - **Today's only outside number is R:** `skytalix` level 5 at **4 000 ms a move** against Stockfish 19
    `UCI_LimitStrength` at `UCI_Elo` **1 910**, Stockfish at **0.5 s a move** (`tools/rating/rating.ts`: `st=0.5`), so
    `skytalix` plays at **8× time odds**. Milestone 1's batch head read **72.00 % ± 6.11** (`…1a53a7f9`), which is
    **≈ +164** over 1 910 by the logistic formula (BA/PM's arithmetic, not a reading). That is a figure on Stockfish's
    `UCI_Elo` scale **under those odds**. It is not a rating on any list, and this page compares it with none.
  - **Stockfish's `UCI_Elo` tops out at 3 190**, so the R ladder has little room near 3 000, and at 8× odds its
    figures do not say what an equal-time reading would.
  - **What is open:** which scale 3 000 is on (the owner's); at what time control and odds a reading is taken; which
    opponents (E steps up to the cap, at equal time, or engines with a published rating); how many games, at what
    precision; and what the next milestones' measures should be. The Architect proposes; the owner owns the scale.
- **Recorded, not answered:** his "As we can see it is possible to reach 3000 elo rating without neural engine?" is a
  question about classical engines. Whether and how `skytalix` can get there is `arch-algo-analysis`'s gap list.

**2026-10-29 (Q2), kept as recorded:**

- **His words** (`…278e149b`): *"remove that goal, I would set another goal - be the best vibe-engineered or
  TypeScript-based chess-engine (not sure what exists out there, we can put goal to 2700 elo rating or more, world
  record is 3650). It can be that in the future we need to rewrite to Rust, but let it be for now, this is big
  undertaking."*
- ~~**The goal:** `skytalix` aims to be the best vibe-engineered / TypeScript-based chess engine, at 2 700 Elo or more.~~
  *(2026-11-01: "2 700 Elo or more" is replaced by **3 000 Elo** on the owner's word, `…74216a44`; the block above.)*
- **It is aspirational.** No ticket, measure or gate of this epic is bound to it. M2 stays "not LOSS", with no Elo
  target (Q5). No ticket is cut to chase it.
- **Its scale is `UNKNOWN - verify`.** He does not name the scale or rating list that 2 700, or his "world record
  3 650", is on, nor its time control. This repo's only outside number is R: Stockfish 19 `UCI_LimitStrength` at
  E = 1 910, `skytalix` at 3 000 ms a move. That read 2 015.6 ± 49.5 at `EPIC-008`'s close, on Stockfish's own scale.
  How that scale maps onto any list is `UNKNOWN - verify`. This page never compares a number on one scale with a
  number on another.
- **The field of comparison is `UNKNOWN - verify`.** Which TypeScript or "vibe-engineered" engines exist, and how
  strong they are, was not researched at this hop (no web access). The Architect or BA/PM researches it when it is
  routed. No ticket holds it.
- **A Rust rewrite is out of scope.** He calls it possible in the future, "but let it be for now". Nothing here
  prepares for it.
- `EPIC-004`'s "strength above ~1700" non-goal is **removed**, with a dated amendment on that page.

## Scope

- One `tools/` change (`ABC-225`), one records scan (`ABC-226`), one probe (`ABC-227`).
- Thirteen engine changes (`ABC-228`–`ABC-240`: eleven value-changing, two value-identical, `ABC-235` and `ABC-240`), each in its own ticket, behind its own ADR
  or ADR reading, each measured by the Q4 rule (value-identical: S2). *(2026-10-30: plus `ABC-241`, Q3 (c), value-
  changing: fourteen engine changes, twelve value-changing.)* *(2026-10-30: plus `ABC-242`, QE-230-a: value-changing on the
  blunder path (levels 1–4) only, node-equal at every smoke and batch pin, so BA/PM reads it under S2 (the Orchestrator to confirm): fifteen engine
  changes.)*
  *(2026-11-01, `bapm-goal3000-o1-cut`: plus milestone 1b, five value-identical speed tickets from `ADR-0055` option O1,
  `ABC-250`–`ABC-254`, each on S2 with 0 games; `ABC-254` waits on the owner's yes to amend `ADR-0003`. They add
  `src/moves.ts`, `src/apply.ts`, `src/zobrist.ts`, `src/perft.ts` and `src/perft-bench.ts` to the files below.)*
- `src/quiescence.ts`, `src/search.ts`, `src/engine.ts`, `src/evaluate.ts`, `src/transposition.ts`, `src/legal.ts`,
  `src/uci-session.ts`, `src/cli.ts` change, each only in the ticket that names it.

## Out of scope

- **Item 4, the tournament clock:** `EPIC-009`.
- **Item 10, Syzygy:** deferred by the owner, 2026-10-30 (Q1: "ok defer Syzygy tables"). `EPIC-004`'s tablebase
  non-goal stands. Bringing it back takes a later word of his and its own epic.
- **The levels and their budgets:** `LEVELS[1..7]`, `DEFAULT_LEVEL` and `HARD_CEILING_MS` byte-identical (`G9`).
  *(2026-10-30, OQ-228-1 (ii), `ADR-0053` d10: one conditional exception. On an `ABC-228` `A8` miss, `ABC-228` moves
  `LEVELS[5].budgetMs` and `DEFAULT_BUDGET_MS` to 4 000 ms, and `G9` is waived for `ABC-228` on `LEVELS[5]` only.
  Every other value stays byte-identical, and later tickets read `G9` against the new base.)* *(2026-10-30: the
  exception was taken. `ABC-228` merged at `e42b637b` with `LEVELS[5]` = `{ 4000, 0 }`. `G9` binds every later ticket
  against that base.)*
- **Re-runs of what was tried:** `ABC-209`'s TT retention, `ABC-210`'s horizon extension, `ABC-205`'s design,
  `ABC-207`'s weights (above).
- **Stalemate detection inside quiescence** (part of § B item 1): it needs a full legal-move count at every quiescence
  node that is not in check. Not cut; `ABC-228` gets mate in check for free (no evasion = mate).
- **Rook activity by phase** (part of § B item 5), **SEE pruning** (§ B item 6 calls it a separate, riskier change),
  **incremental evaluation as a value change**, **delta pruning**, **threads, pondering.**
- ~~**Normalising `epSquare` for repetition** (§ B item 3's ep point): only if the owner re-opens `ADR-0020` d2 (Q3); a
  ticket is then cut from the pool.~~ *(2026-10-30: Q3 answered (c). The comparison against the game's earlier
  positions is now in scope as `ABC-241` (`ADR-0020` § AMENDMENT 2026-10-30). Still out: normalising `epSquare` in
  the hash or upstream in `apply.ts`, and the in-tree and ep-root cases that stay one late (C4).)*
- **A user-visible Elo, rating lists, CCRL entry** (`EPIC-008` § Out of scope, unchanged).
- **A Rust rewrite** (Q2, 2026-10-29: "let it be for now"). ~~**Any ticket, gate or measure bound to the ≥ 2 700 goal**
  (§ Product goal: aspirational).~~ *(2026-11-01, `bapm-goal3000-o1-cut`: **any ticket, gate or measure bound to the
  3 000 goal**, until the owner sets a measure (Q6; § Product goal). A language port (`ADR-0055` O2, O3) is not
  pursued, owner 2026-11-01.)*
- **A neural network or any learned runtime component** (`EPIC-004` permanent non-goal; § B assumes none). `ABC-239`
  emits constants only.

## Common gates

`EPIC-008` § Common gates `G1`–`G11`, **unchanged, by reference**, on this host (`G6` read by its rule: 5 interleaved
runs per board per build, the median, "≥ base" graded on the owner's word `…2ae5fc12`, any run below depth 6 FAILs).
`G2`'s 1 100 ns was set on the previous host; it is read against base in the same session, so only the relative
clause binds here (`UNKNOWN - verify` as an absolute). Each ticket names the gates it owes.

**`Q-SET`, the dedicated position set (new, test-only).** The SA's three probe positions (`sa-ideas-verify/raw/
qprobe.mts`: Q1 capture-mate, Q2 in check with only a quiet evasion, Q3 quiet promotion) plus at least three more
per gap, chosen by QE and frozen before the first build: ≥ 6 rows "in check inside quiescence", ≥ 6 "a capture that
mates", ≥ 6 "a quiet promotion decides". It reads `quiesce` and `chooseMove` at a fixed depth, never the clock.
`ABC-228` and `ABC-229` own it.

## Success measures (accepted by the owner 2026-10-29, Q5: as written, no Elo target)

| # | measure | target | how it is read |
|---|---|---|---|
| M1 | **Every value-changing merge passed the owner's rule** | 100 % of this epic's value-changing merges carry the Q4 reading (the smoke pair, S-1–S-4) and meet it; value-identical merges meet S2 | each ticket's `## Reading` and QE note |
| M2 | **Not weaker outside, at the close** | an interleaved R pair, `main` at close against `main` at this epic's first merge-base, on this host: **not LOSS** (X + Y ≥ 0). **No Elo target** unless the owner sets one | `ABC-225`'s mode, the `EPIC-008` pins (the epic-close batch, § The merge rule) |
| M3 | **The proven gaps are closed** | `Q-SET`: every in-check row's `quiesce` ≠ stand pat and every mate row scores a mate (`ABC-228`); every quiet-promotion row reflects the promotion (`ABC-229`); every repetition fixture reads the draw (`ABC-230`) | the tickets' acceptance rows, on `main` at close |
| M4 | **Nothing regressed** | `G1` ≥ 54/58, `G5`, `G6`, `G7`, `G8`, `G9` green on `main` at close | the gates' own instruments |
| M5 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word; every ADR reported when it lands; Q1–Q4 answered before a ticket that waits on them leaves `Backlog` | ADR pages, owner-word notes |

## Tickets (order is the pull order; the pages are under `plans/tickets/`)

| order | id | title | size | priority | column | DoR | depends on / ADR | waits on |
|---|---|---|---|---|---|---|---|---|
| 1 | `ABC-226` | Records scan: how often the R and D games repeated a position the search could not see | S | P2 | **Done** (2026-10-29) | — | the committed PGNs | done: SA `sa-ABC-226` `…cc53fc79`, 484 games (R 26); `ABC-230` stays in milestone 1 |
| 2 | `ABC-227` | Profile: where a node's time goes, on the fixed boards, at 3 s | S | P2 | **Done** (2026-10-29) | — | none | done: SE `se-ABC-227`, merged `f4301d0c`; six value-identical cuts handed to `ABC-235` |
| 3 | `ABC-225` | One command reads an interleaved R pair (base and candidate against Stockfish), with the opening-paired error and a host log. **Re-scoped 2026-10-29: the batch's instrument** | M | P2 | **Done** (2026-10-30, `59dc3ab4`) | — | `ABC-204`'s pins; owner 2026-10-30: A5 at `--concurrency 1` | done: QE PASS_WITH_GAPS `…d0807789` at width 1 (A6: 400-game pair ≈ 18.5 h); QE-225w1-a/c/d/e dispositioned on its page (2026-10-31) |
| 4 | `ABC-228` | In check, quiescence searches every evasion and scores none as mate | M | P2 | **Done** (2026-10-30, `e42b637b`) | — | `ADR-0053` (ACCEPTED 2026-10-30); OQ-228-1 reading (ii), built | done: QE PASS_WITH_GAPS under (ii) `…e39d190c` (`G6` 8 = 8, 10 = 10; D 5.0, R 7.0 at 4 000 ms); its gaps are `ABC-243` |
| 5 | `ABC-229` | Quiescence searches quiet promotions to a queen | S | P2 | **Done** (2026-10-30, `5953c631`) | — | `ADR-0053` (ACCEPTED 2026-10-30) decisions 5–8; door; `ABC-228` (Done, `e42b637b`) | done: QE PASS_WITH_GAPS `…2afef8bf` signs UAT (`G6` 8 = 8, 10 = 10 at 4 000 ms; D 4.5, R 9.0 at 4 000 ms, not pooled); QE-229-a is `ABC-244` (Done) and now `ABC-248`; QE-229-b/c/d dispositioned on its page (2026-10-31) |
| 6 | `ABC-230` | The game's earlier positions reach the search, from the CLI and from UCI, so it sees a repetition the game already holds | M | P2 | **Done** (2026-10-30, `24f3e322`) | — | `ADR-0054` (ACCEPTED 2026-10-30) | done: QE PASS_WITH_GAPS `…ba5a249a`; its gap QE-230-a is `ABC-242` |
| 7 | `ABC-235` | Value-identical cuts in cost per node, from `ABC-227`'s profile: **cuts 1, 3, 5** (scoped 2026-10-29) | M | P2 | **Done** (2026-10-30, `baf99a7c`) | — | `ABC-227` (Done); Architect `…7fc1b90c` (1, 3, 5 value-identical; no ADR) | done: QE PASS on S2, no smoke (`qe-ABC-235` `…c575d703`; nps tip/base 1.262 / 1.284 / 1.200) |
| 8 | `ABC-240` | Move ordering without per-move allocation, value-identical (cut 6, split from `ABC-235`) | S | P3 | **Done** (2026-10-30, `5311f5bd`) | — | Architect `…7fc1b90c` C1–C4; no ADR | done: QE PASS on S2, no smoke (`qe-ABC-240` `…19068f9d`; nps tip/base 1.122 / 1.109 / 1.089); QE-240-a LOW |
| 9 | `ABC-241` | A repetition against the game's earlier positions ignores an en-passant square no pawn can legally take (Q3 (c)); the hash does not change | S | P2 | **Done** (2026-10-30, `1f6abec4`) | — | `ADR-0020` § AMENDMENT 2026-10-30 (ACCEPTED on the owner's word) | done: QE PASS_WITH_GAPS `…2368b03f` (D 6.0, R 6.5 at 4 000 ms); its gap QE-241-a is folded into `ABC-243` |
| 10 | `ABC-242` | On a blunder level (1–4), a root move that makes the third occurrence of a game position scores exactly 0 (QE-230-a) | S | P3 | **Done** (2026-10-31, `af5b2b49`) | — | `ADR-0054` § amendment 2026-10-30 and its `ADR-0032` d1 bullet (ACCEPTED) | done: QE PASS_WITH_GAPS `…f24601b8` signs UAT; QE-242-a pending with the Architect (`arch-qe242a-ruling`); QE-242-b is `ABC-245` |
| 11 | `ABC-231` | The king table is tapered by phase, alone, with no king-safety term | S | P3 | **Moved to `EPIC-011`** (2026-11-01; was Backlog) | **9/10** | `ADR-0031` addendum scope; door | the ADR ruling |
| 12 | `ABC-232` | Passed pawns are worth more as material comes off | S | P3 | **Moved to `EPIC-011`** (2026-11-01; was Backlog) | **9/10** | `ABC-231`'s phase | `ABC-231` |
| 13 | `ABC-233` | A history heuristic orders quiet moves after the killers, cleared per search | M | P3 | **Moved to `EPIC-011`** (2026-11-01; was Backlog) | **9/10** | `ADR-0026` d10; `ABC-080` `A6` | the ADR |
| 14 | `ABC-234` | SEE orders captures in the full-width search (ordering only, no pruning) | M | P3 | **Moved to `EPIC-011`** (2026-11-01; was Backlog) | **8/10** | `ADR-0024` d4 re-open evidence | the evidence; the ADR |
| 15 | `ABC-236` | Aspiration windows at the root, with a stated re-search | M | P3 | **Moved to `EPIC-011`** (2026-11-01; was Backlog) | **9/10** | new ADR; door | the ADR |
| 16 | `ABC-237` | The transposition table prefers deeper entries when it replaces | S | P3 | **Moved to `EPIC-011`** (2026-11-01; was Backlog) | **9/10** | `ADR-0025` (falsifier `T2`) | the ADR |
| 17 | `ABC-238` | A deeper stored entry may cut off a shallower search | M | P3 | **Moved to `EPIC-011`** (2026-11-01; was Backlog) | **9/10** | `ABC-081` `A1` revised; `ADR-0025`; door | the ADR; after `ABC-237` |
| 18 | `ABC-239` | Evaluation weights tuned offline by a stated method, emitted as constants, validated outside | L | P3 | **Moved to `EPIC-011`** (2026-11-01; was Backlog) | **8/10** | `ADR-0048` data licence; new ADR | milestone 2's evaluation done; the licence; the ADR. Its batch is read **before** its merge (its `A6`) |
| 19 | `ABC-243` | The setoption-Hash row reads a bare `go` (level 5 = 4 000 ms), and the TT `A7` title names the budget it reads (test-only, from `ABC-228`'s QE gaps); *2026-10-30:* plus a UCI row for a FEN that carries an uncapturable ep square (QE-241-a) | XS | P3 | **Done** (2026-10-31, `3628fe99`) | — | `ABC-228` and `ABC-241` Done; no ADR; `src/uci-session.test.ts` and `src/transposition.test.ts` only | done: QE PASS (`qe-ABC-243` `…2d790e40`; `G8` H 9.28 s); UAT waived (test-only) |
| 20 | `ABC-244` | Time-blind virtual-clock rows in `src/cli.test.ts` and `src/uci-session.test.ts` take the coarsest step that keeps QE's caught-mutant set (`ADR-0046` § Addendum 2026-10-30, tranche 1; test-only, from `QE-229-a`) | S | **P1** | **Done** (2026-10-30, `24b22339`) | — | `ADR-0046` § Addendum 2026-10-30 R1–R4 (PROPOSED, `5fd3eee7`; BA/PM's word given on its page); `ABC-230`/`ABC-241` Done | done: QE PASS (`qe-ABC-244` `…4fe9bfe1`; `G8` H 9.25 s, ≤ 9.4 s target met) and Security/NFR PASS (`secnfr-ABC-244` `…9087cb39`); UAT waived (test-only) |
| 21 | `ABC-245` | A blunder-level row reads a third occurrence whose earlier occurrences lie more than 50 plies back, so lowering the 100-key cap turns the lane red; the `src/levels.test.ts` header count is corrected (test-only, from QE-242-b and SE-242-f) | XS | P3 | **Done** (2026-10-31, `2cce84e0`) | — | `ABC-242` Done (`af5b2b49`); `ADR-0046` § Addendum R1–R4 and § Ruling 2026-10-31 (`10492743`: per level call, step 10) | done: QE PASS (`qe-ABC-245` `…b2ebc183`; `G8` H 9.82 s, which opened tranche 2, now `ABC-248`); QE-242-b closed; UAT waived (test-only) |
| 22 | `ABC-247` | `rpair` passes `Skill Level` 6 to skytalix on both builds, so `go movetime 4000` searches 4 000 ms on a base whose level 5 is 3 000 ms; the `r` and `d` paths are unchanged (tools only, from QE-M1B-a; route (A), `…fb0c8978`) | XS | **P1** | **Done** (2026-10-31, `3af97f71`) | — | `ABC-225` Done (`59dc3ab4`); no ADR (`ADR-0053` d10's intent kept) | done: QE PASS (`qe-ABC-247` `…236bbe39`); tools only, no UAT. Milestone 1's batch ran on it: block-01 guard PASS on both builds (`…428e3797`) |
| 23 | `ABC-248` | The default lane sheds about 0.3 s and loses no coverage: `QE-208-a` sampled more sparsely and `QE-208-b` on a cheaper root, `ABC-167` A5's duplicated searches moved to `ENGINE_DEEP` under default-lane kill parity, and A4-a2 on R2 (`ADR-0046` tranche 2; test-only, from `QE-245-b`) | S | **P1** | **Done** (2026-11-01, `ef4cd095`) | — | `ADR-0046` § Addendum 2026-10-31 T2-R, accepted with amendments in its § BA/PM ruling 2026-10-31; W1 given its word | done: QE PASS_WITH_GAPS (`qe-ABC-248` `…cf9bdabf`; `G8` H 9.09 s, ≤ 9.4 s target met, W1 not triggered); **tranche 2 delivered**; QE-248-a fixed on its page and the ADR; QE-248-c is `ABC-249`; UAT waived (test-only) |
| 24 | `ABC-249` | A position that stood twice before the root, met four or more plies into the search, scores exactly 0, so turning the pre-root scan off at depth (`QPLY4`) turns the default lane red (test-only, from QE-248-c) | XS | P3 | Backlog (Ready recommended) | **10/10** | `ABC-230` Done (`24f3e322`); `ADR-0054` decision 3; `src/engine.test.ts` only | none; recommended before milestone 2's search tickets (`ABC-233`, `236`, `237`, `238`). `G8` ALONE |
| 25 | `ABC-250` | Moves packed into integers in reused typed arrays for generation, legality and make/unmake, read on perft first; the search is not touched yet (milestone 1b, `ADR-0055` O1-b part 1, value-identical) | M | P2 | Backlog (Ready recommended) | **10/10** | `ADR-0055` (option O1 chosen by the owner 2026-11-01); no ADR; Architect confirms at design | none. Its A4 perft reading (GO ≥ 1.25× / HOLD / NO-GO) picks `ABC-251`'s form and whether `ABC-252` exists. ALONE |
| 26 | `ABC-251` | The search, quiescence, ordering and killers walk the packed moves and build a `Move` only at `chooseMove`'s return, with hand-inlined helpers (milestone 1b, O1-b part 2 with O1-c, value-identical) | L (S narrowed) | P2 | Backlog | **9/10** | `ABC-250` | `ABC-250`'s A4 reading (full form on GO, bar ≥ 1.10×; O1-c alone otherwise, bar ≥ 1.03×) |
| 27 | `ABC-252` | One move generator: the shell's move calls build their `Move` lists from the packed path through one converter, and the object generator is removed (milestone 1b, O1-b part 3, value-identical) | M | P3 | Backlog | **9/10** | `ABC-250` GO, `ABC-251` full form | `ABC-251`'s merge; dropped if `ABC-250` is dropped |
| 28 | `ABC-253` | Zobrist keys travel as two 32-bit halves in the search, the TT and the repetition scan, and stay `bigint` at the API (milestone 1b, O1-a, value-identical) | M | P3 | Backlog (Ready recommended) | **10/10** | none (`ADR-0025`, `ADR-0054` kept) | none; pulled after the O1-b chain (`ADR-0055` D4), bar ≥ 1.02× |
| 29 | `ABC-254` | Lazy legality: the full make/test/unmake only for king moves, en passant, pinned pieces and positions in check (milestone 1b, O1-d = `ADR-0003` (c2), value-identical) | M | P2 | Backlog (Ready recommended); ~~**Moved to `EPIC-011`**~~ back 2026-11-01 | **10/10** | `ADR-0003` amended (clauses 1 and 3; `…c314772c`, merged `89af8b56`) | none; ~~**the owner's yes (Q-SP-3)** and that ADR~~ yes `…f7a50e95`; **first in milestone 1b** |
| 30 | `ABC-259` | One default-lane source scan turns red when engine-core code reads the search budget other than as the deadline, or reads a test flag or the environment (`ADR-0056` R-TC item 2, gap G-1; milestone 1b; test-only) | XS | P2 | Backlog (Ready recommended) | **10/10** | `ADR-0056` R-TC (merged `a0f9297e`); no ADR of its own | none; recommended before `ABC-251` (which rewrites the scanned search files), beside `ABC-249` |
| 31 | `ABC-260` | The R-TC source scan catches `process` by any spelling, and a comment marker inside a string literal cannot hide code from it or from `ABC-087` A8 (milestone 1b; test-only, from QE-259-a MEDIUM and QE-259-b LOW; cut 2026-11-01, `bapm-qe-gaps-1101`) | XS | P2 | Backlog (Ready recommended) | **10/10** | `ABC-259` merged (`2091d301`); `ADR-0056` R-TC; no ADR of its own; `src/levels.test.ts` only | none; row number is not pull order: recommended before `ABC-251` (which rewrites the scanned search); independent of `ABC-254` |
| 32 | `ABC-261` | The default lane turns red when `hasLegalMove` loses its early exit, and reads `legalCapturesAndQueenPromotions`' quiet queen promotions while in check (milestone 1b; test-only, from QE-254-b and QE-254-c, both LOW; cut 2026-11-01, `bapm-qe-gaps-1101`) | XS | P3 | Backlog | **10/10** (conditional on `ABC-254`'s merge) | `ABC-254` merged (its lazy filter); `ADR-0003` as amended; `src/legal.test.ts` / `src/gameend.nfr.test.ts` | `ABC-254`'s merge (A4 re-read `qe-ABC-254-a4`); dropped if `ABC-254` is dropped or declined; row number is not pull order: recommended after `ABC-254`, before `ABC-250` |

*Re-scored 2026-10-29 (`bapm-owner-words-b`): Q4 is removed from every wait. Each value-changing ticket's DoR row 4
is now ✅, because its reading is the smoke pair. No ticket but `ABC-225` changes column on this hop. `ABC-227` (Done)
and `ABC-235` (In Design) moved on the Orchestrator's board during this hop (`ff416a56`).*

All fifteen reserved ids are used. None is `XL`; `ABC-239` is the one `L` and is the last pull. *`ABC-240` was added
2026-10-29 by the split of `ABC-235` (`bapm-ABC-235-split`); the order numbers from 8 on moved down by one.*
*`ABC-241` was added 2026-10-30 on the owner's Q3 (c) (`bapm-q3c-oq228ii-fold`); the order numbers from 9 on moved
down by one. Only its row and `ABC-228`'s were changed; the other rows' columns are as last folded, and the board
holds the live state.*
*`ABC-242` was added 2026-10-30 from QE gap QE-230-a (`bapm-qe230a-followup`); the order numbers from 10 on moved
down by one. Only its row and the `ABC-230` (Done) and `ABC-241` (Ready) rows were changed.*
*`ABC-243` was added 2026-10-30 from QE gaps SE-228ii-a and QE-228ii-b (`bapm-ABC-228-merge-fold`), at the end: it is
test-only (no smoke, no gate beyond the default lane) and is not one of the fifteen engine changes. Only its row and
`ABC-228`'s (Done) were changed.*
*Folded 2026-10-30 (`bapm-ABC-241-merge-fold`): only rows 9 (`ABC-241` Done) and 19 (`ABC-243` Ready 10/10, plus
QE-241-a's row) were changed. The board holds the live state.*
*Folded 2026-10-30 (`bapm-ABC-242-225-owner`, on the owner's words `…65848126`): only rows 3 (`ABC-225` In Development,
A5 at width 1) and 10 (`ABC-242` Ready 10/10) were changed. The board holds the live state.*
*`ABC-244` was added 2026-10-30 from `QE-229-a` (`bapm-g8-headroom-cut`), at the end, like `ABC-243`: it is
test-only and not one of the fifteen engine changes. **Its row number is not its pull order: it is pulled ahead of
`ABC-242` and `ABC-243`**, because all three edit `src/uci-session.test.ts` and it wins the lane headroom they spend.
Only its row was added; `ABC-242`'s and `ABC-243`'s pages gained dated lines, and their rows here are unchanged.*
*Folded 2026-10-31 (`bapm-ABC-242-close`): rows 3 (`ABC-225` Done) and 10 (`ABC-242` Done) were changed, and row 21
(`ABC-245`) was added at the end, like `ABC-243` and `ABC-244`: it is test-only and not one of the fifteen engine
changes. The board holds the live state.*
*`ABC-247` was added 2026-10-31 (`bapm-rpair-level6-cut`) at the end: it is tools only and not one of the fifteen engine
changes. Its row number is not its pull order: it is P1 and pulled after `qe-ABC-245`, ahead of the batch. Row 5
(`ABC-229`) is stale here (merged `5953c631`); its fold is owed separately. The board holds the live state.*
*Folded 2026-10-31 (`bapm-tranche2-ruling`): row 5 (`ABC-229` Done, `5953c631`) was folded, and row 23 (`ABC-248`)
was added at the end: it is test-only and not one of the fifteen engine changes. Its row number is not its pull order:
it is P1 and pulled after `ABC-246`. Rows 19 (`ABC-243`, merged `3628fe99`), 20 (`ABC-244`, `24b22339`) and 21
(`ABC-245`, `2cce84e0`) are Done on the board and stale here; they were not folded on this hop. The board holds the
live state.*
*Folded 2026-11-01 (`bapm-m1-batch-fold`): rows 7 (`ABC-235`), 8 (`ABC-240`), 19 (`ABC-243`), 20 (`ABC-244`), 21
(`ABC-245`) and 22 (`ABC-247`) read Done, and row 23 (`ABC-248`) reads Ready, each as the board holds it. Every other
row was checked against the board and agrees. The pages of `ABC-243`, `ABC-244`, `ABC-245` and `ABC-248` still carry
their old `status` / `column`; their closes are a separate fold, not done here. The board holds the live state.*
*Folded 2026-11-01 (`bapm-ABC-248-close`): row 23 (`ABC-248`) reads Done (`ef4cd095`), as the board holds it, and
row 24 (`ABC-249`) was added at the end: it is test-only and not one of the fifteen engine changes. Its page is cut,
not pulled; the column move is the Orchestrator's. The board holds the live state.*
*Cut 2026-11-01 (`bapm-goal3000-o1-cut`): rows 25–29 (`ABC-250`–`ABC-254`, milestone 1b) were added at the end. They
are value-identical engine changes outside the fifteen. **Their row numbers are not their pull order:** § Milestone 1b
gives it (`ABC-254` first only if the owner's yes and its ADR come in time; then `ABC-250` → `ABC-251` → `ABC-252` →
`ABC-253`). No other row was changed. The board holds the live state; the column moves are the Orchestrator's.*
*Folded 2026-11-01 (`bapm-ABC-254-ready`): row 29 (`ABC-254`) is back in this epic, DoR 10/10, first in milestone 1b,
because the owner's yes and the amending ADR came before `ABC-250` entered development. No other row was changed.*
*Cut 2026-11-01 (`bapm-reconcile-adr0056`): row 30 (`ABC-259`, `ADR-0056` gap G-1) was added at the end. It is
test-only and not one of the fifteen engine changes; it guards the owner's condition (R-TC item 2) for milestone 1b's
rewrites and for every strength change after them. Its row number is not its pull order. No other row was changed;
the column move is the Orchestrator's.*

## Observations (not tickets)

- **Castling attack tests outside `legalCaptures`** (Architect `arch-ABC-235` `…7fc1b90c` § Out of the six; recorded
  2026-10-29 by `bapm-ABC-235-split`). `addCastlingMoves`' attack tests are 8.0 / 0.3 / 2.2 % of self time in total
  (kiwipete / position-6 / start). `ABC-235`'s cut 3 removes them from `legalCaptures`. They stay under `hasLegalMove`
  (2.8 / 0.1 / 0.9) and `legalMoves` (1.0 / 0.0 / 0.3). `ABC-227`'s A5 does not name them, so they are outside
  `ABC-235`'s scope item 1. **No ticket is cut.** The largest remainder, 2.8 % on kiwipete alone, is a bound below
  both A5's 5 % threshold and the 3 % drop bar. Re-read only if a fresh profile after `ABC-235` ranks it ≥ 5 % on
  ≥ 2 boards.

## Owner questions (Q2, Q4, Q5 answered 2026-10-29, `…278e149b`; Q1 deferred 2026-10-30, `…3dd61448`; Q3 answered (c) 2026-10-30, `…c4ab73de`)

| Q | asked | answer | what it changed |
|---|---|---|---|
| Q1 | Syzygy (§ B item 10) against `EPIC-004`'s permanent non-goal: (a) keep out, (b) re-open as a later epic | "not sure, explain" (2026-10-29). **2026-10-30: "ok defer Syzygy tables"** | **Deferred**, out of this epic. The tablebase non-goal stands, and nothing is cut |
| Q2 | `EPIC-004`'s "Strength above ~1700": (a) cite his `EPIC-008` word, (b) amend the line | **2026-10-29:** "remove that goal", and a new goal: the best vibe-engineered / TypeScript-based engine, 2 700 Elo or more; Rust "let it be for now" | The non-goal is **removed** by a dated amendment on `EPIC-004`. § Product goal: aspirational, no ticket bound, scale `UNKNOWN - verify`. A Rust rewrite is out of scope. ***2026-11-01:** the owner restated the goal: "Set the goal to 3000 elo rating from current goal" (`…74216a44`). 3 000 replaces "2 700 or more"; § Product goal (dated); Q6 below* |
| Q3 | Re-open `ADR-0020` d2 (the ep repetition key)? (a) keep, (b) re-open | "not sure, explain" (2026-10-29); 2026-10-30: "I need more info to answer". The Orchestrator gave it in session (`arch-ABC-230-reading` `…90a3aa31` § 3: (a) keep, (b) ep-legal key, (c) normalise history only). **2026-10-30: "Q3: c"** (`…c4ab73de`) | **(c):** `ADR-0020` § AMENDMENT 2026-10-30 (ACCEPTED on his word; the hash, TT and book unchanged). **`ABC-241` cut** (S, P2, after `ABC-230`). SA `…cc53fc79` A6 was the information: in 22 D games, cutechess counted the threefold one occurrence before the repository's key would |
| Q4 | The pre-merge outside-opponent rule: (a)–(d), and (e) from his `EPIC-009` word | **2026-10-29: (e), extended:** "10 games self-play + 10 games vs stockfish" | § The merge rule: S-1 to S-4 per value-changing ticket, the trend, and a batched R pair. `ABC-225` re-scoped. Q4 is removed from every ticket's wait |
| Q5 | Accept this epic and M1–M5, no Elo target | **2026-10-29: accepted, no Elo target:** "elo target is hard to reach, but try to understand if things get worse" | `proposed` → `backlog`. M1–M5 stand as written. The "worse" question is answered by § The merge rule's three layers |
| Q6 (open, 2026-11-01; **moved to `EPIC-011`** 2026-11-01, `bapm-epic011-dedupe`: its time-control half is answered, 40/15) | The 3 000 goal: (a) which scale it is on (rating list, time control, field); (b) whether it becomes a measure of this epic or a later one, and read how (MQ-3000, § Product goal) | — **Asked after `arch-algo-analysis` reports**, which proposes the measurement; the Orchestrator takes it to him | Default until he answers: no ticket, gate or measure bound to 3 000; M2 stays "not LOSS"; scale `UNKNOWN - verify` |
| Q-SP-3 (`ADR-0055`, ~~open~~ answered) | Amend the owner-ratified `ADR-0003` clauses 1 and 3 so lazy legality ((c2)) may be built now, for speed | — Not answered explicitly on 2026-11-01 (Orchestrator `…74216a44`, item 2). **Later 2026-11-01: "ABC-254: yes"** (`…f7a50e95`); `ADR-0003` amended (`…c314772c`, merged `89af8b56`); `ABC-254` 10/10, first in milestone 1b | `ABC-254` waits in Backlog (9/10); on yes, the Architect writes the amending ADR and it goes Ready; on no, it is closed as declined |
| Q-SP-2 (`ADR-0055`, open) | `ADR-0055` D3's bars, as written or reset | — | Used only by `ABC-250` A4 (perft A1 / A0: GO ≥ 1.25×, HOLD 1.10–1.25×, NO-GO < 1.10×). **They apply as written unless he resets them before the reading** |

- **Q4 superseded 2026-11-01** (`bapm-100-400-rule`): the owner's word `…2896c6eb` replaces (e), extended, with 100
  games at 100 ms per strength-changing ticket and 400 at 100 ms per epic (the top block). M1 and M2 stand as graded.
- **The cut's text of Q1–Q5**, with the options and defaults, is in git at `542e8219` and in note
  `bapm-epic010-improvements` `…5ada23af`.
- **Not questions for him:** which form an ADR takes, the door's shape, `Q-SET`'s extra rows, and the game counts
  inside a rule he sets. Those are delivery, under his delegation (`…5aaf7cec` item 1). The 3.0-of-10 bar, the
  20-game confirmation, the trend flag and the batch's cadence are the game counts inside his rule (e).

## Dependencies

- `ABC-204`'s pinned host tools (`cutechess-cli` 1.5.1, Stockfish 19), re-pinned on this host. Paths stay out of the
  records (`ADR-0049` d4).
- `EPIC-009` runs beside this epic. Its readings and this epic's share the host: one ALONE reading at a time. Its
  files (`src/levels.ts`, `src/cli-options.ts`, `src/uci-session.ts`) overlap `ABC-230` on `src/uci-session.ts` only;
  whichever merges second rebases.
- **`EPIC-009`'s `uci-clock-mode` build** moves `HARD_CEILING_MS` from 32 000 to 60 000 (`ADR-0052` D6, accepted 2026-10-30).
  `G9` ("`HARD_CEILING_MS` byte-identical") binds this epic's own diffs. If both are in flight, whichever merges second
  rebases, and the Orchestrator orders them.
- Within this epic: `ABC-228` → `ABC-229` share `src/quiescence.ts`, and `ABC-240`'s item 2 edits its capture sort;
  `ABC-240` → `ABC-233` → `ABC-234` share `orderMoves` (if `ABC-240` is dropped, nothing waits on it);
  `ABC-237` → `ABC-238` share `src/transposition.ts`; `ABC-231` → `ABC-232` share `src/evaluate.ts`; `ABC-230` →
  `ABC-241` share the prior-key builders (`src/cli.ts`, `src/uci-session.ts`). A value-changing
  merge stales any D or R read on the old base (`EPIC-008` § When a D reading goes stale).
- **Milestone 1b (2026-11-01, `bapm-goal3000-o1-cut`):** `ABC-250` → `ABC-251` → `ABC-252` share `src/moves.ts`,
  `src/legal.ts`, `src/apply.ts` and `src/zobrist.ts` (the core) and `src/search.ts`, `src/engine.ts`,
  `src/quiescence.ts`, `src/transposition.ts` (the search); `ABC-253` shares the search, TT and key files, so it follows
  the chain; `ABC-254` shares `src/legal.ts` (~~first if allowed in time, else after `ABC-252`~~ first: allowed in time, 2026-11-01). **Against milestone 2:**
  `ABC-251` edits the `orderMoves` that `ABC-233`/`ABC-234` change, the search and TT that `ABC-236`–`ABC-238` change,
  and possibly `src/evaluate.ts` (`ABC-231`/`ABC-232`); milestone 1b goes first, so milestone 2 is written on it. A
  value-identical merge does not stale a D or R reading's verdict, but each nps reading needs its own ALONE window.

## Risks

- **`RISK-EPIC010-01`: the rule cannot see small losses.** *(Restated 2026-10-29 for Q4 = (e).)* A smoke sees a
  collapse (≈ 250 Elo or more at R). The trend sees ≈ 140 Elo once 30 R games are pooled. A batch sees ≈ 70–75. A
  fall of tens of Elo is invisible to all three. Mitigated by the batch at each milestone's close and at M2, by the
  opening-paired error reported beside Y, and by a bigger batch or the owner's longer games, on his word.
- **`RISK-EPIC010-07` (new, 2026-10-29): a batch that reads LOSS cannot name its cause.** Several merges share it.
  The ledger's per-ticket R smokes point, but at ± 200 Elo they cannot convict. A bisect costs ≈ 10 h per merge.
  Mitigated by batching per milestone (3–7 merges, not 11) and by the trend flag, which pulls a batch forward.
- **`RISK-EPIC010-02`: in-check evasions repeat `ABC-210`'s NEUTRAL.** The frontier node in check is where `ABC-210`
  extended. `ABC-228`'s gain lies in checks that arise inside the capture sequence; its size is `UNKNOWN - verify`.
- **`RISK-EPIC010-03`: added quiescence nodes miss `G6` "≥ base"**, as `ABC-205` did on cost. Each quiescence ticket
  carries a node bar (≤ 1.5 × base at fixed depth 6, `ADR-0024` d3's headroom precedent) and the frozen-clock
  pre-check before the real-clock `G6`.
- **`RISK-EPIC010-04`: heat and hours.** *(Re-costed 2026-10-29 under (e).)* ≈ 1.2 h per value-changing ticket
  (≈ 0.7 h ALONE) and ≈ 10 h per batch, at Tctl median 74–83 °C, max 84–87 °C. Eleven value-changing tickets and
  three batches come to ≈ 45 h, against ≈ 200–300 h under (b). *(2026-10-30: twelve with `ABC-241`, ≈ 46 h. Under
  OQ-228-1 (ii), a batch at 4 000 ms takes longer by `UNKNOWN - verify`.)* Milestone 1 is ≈ 15 h. *(2026-10-31,
  `bapm-ABC-242-close`: at width 1 a batch is ≈ 18.5 h ALONE plus ≈ 1 h of QE, from `ABC-225` A6 at 4 000 ms, so the
  4 000 ms question is answered for width 1. Milestone 1's remaining time is its batch, ≈ 19.5 h; spent plus remaining
  ≈ 26 h. The ≈ 45–46 h epic figure counted batches at ≈ 10 h and is not re-summed here.)* *(2026-10-31, `bapm-rpair-level6-cut`:
  that A6 rate was read at 3 000 ms (QE-M1B-a). At 4 000 ms both sides a width-1 batch is ≈ 21.7–24.1 h ALONE plus
  ≈ 1 h of QE; milestone 1 spent plus remaining ≈ 29–32 h, ≈ 26–29 h ALONE.)* The owner may stop the epic
  after any milestone.
- **`RISK-EPIC010-05`: self-play tuning repeats non-transfer** (`ABC-239`). Its validation is outside, by rule.
- **`RISK-EPIC010-06`: history keys widen the UCI input surface** (`ABC-230`): a `position … moves` list of any length
  now feeds the search. `KEY_ARRAY_CAPACITY` (128) bounds the per-ply array; the hand-over must be bounded too.
- **`RISK-EPIC010-08` (new 2026-11-01, `bapm-reconcile-adr0056`): the per-epic read's ± 24 Elo is optimistic.**
  C3″ plays each of the 100 openings four times (twice per colour, `d`'s default 200 rounds). The four games differ
  (identical 100 ms searches vary by a ply and up to ± 25 % in nodes), but they are not independent, so the true 95 %
  interval is wider than ± 24 by an amount that is `UNKNOWN - verify` (`ADR-0056` § Consequences). **QE checks it at
  this epic's close read, the first C3″,** and reports it beside the interval (for example, from the spread between
  the four games of each opening, or the per-opening paired error as `ABC-225` reports it; the method is QE's). The
  read's shape and its MET line do not change on this hop; a finding that the interval is much wider goes to the
  Architect.

## NFR triggers

- **`NFR-005` (depth at 3 s; *at 4 s from `ABC-228`'s merge, `ADR-0053` d10; the catalog text is Security/NFR's*):** at risk from every value-changing ticket. `G6` reads it; the depth-6 floor never moves.
- **`NFR-004` (per-move ceilings):** unchanged; `G5` reads it. *(2026-10-30: the default's bar is ≤ 4 s from
  `ABC-228`'s merge; the 5 s ceiling at levels 1–5 stays.)*
- **`NFR-009` (≤ 16 MiB search memory, ≤ 1 MiB growth):** `ABC-230` (history keys), `ABC-233` (history table),
  `ABC-237`/`238` (TT). 2^19 entries fits; 2^20 is a re-level, the owner's.
- **`NFR-008` (`npm test` wall ≤ 10 s at load1 ≤ 8):** new rows on the virtual clock or at fixed depth only; 0
  real-clock rows in the default lane. *(2026-11-01: each milestone 1b ticket adds ≤ 0.1 s of lane rows; its walks run
  under `ENGINE_DEEP=1`. `G8` headroom is 0.6–0.9 s, `ABC-248`.)*
- **`NFR-001` (perft ≥ 1 000 000 nodes/s, a diagnostic since `ADR-0003` clause 2):** re-read as INFO by `ABC-250` and
  `ABC-254` on this host (`UNKNOWN - verify` here). No bar moves. *(Added 2026-11-01, `bapm-goal3000-o1-cut`.)*
- **Security (ASVS L1):** `ABC-230` is the only new input path (the UCI move list and the CLI's game history reach the
  search). Bounded length, no new parsing; Security/NFR confirms at its gate. No other ticket adds input.

## Test notes

- Readings never run in `npm test`. They run in QE's scratch clone, ALONE, as `ABC-202`/`ABC-204`.
- Search tickets use the `ADR-0026` door pattern: the door reproduces base node for node (`G4`), cross-build.
- Each value-changing ticket changes production lines, so UAT is owed. The QE verdict signs it under the owner
  delegation (`…5aaf7cec` item 2).
- The board lines this cut asks for are in the decision note; the board is the Orchestrator's.
