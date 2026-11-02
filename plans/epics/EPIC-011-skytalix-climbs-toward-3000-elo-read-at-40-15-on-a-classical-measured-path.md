---
id: EPIC-011
title: "`skytalix` climbs toward 3 000 Elo, read at 40/15 against Stockfish's `UCI_Elo`, on a classical path where every change is measured"
status: backlog
column: Backlog
priority: P2
size: XL
owner: BA/PM
---

# EPIC-011: the path toward 3 000 Elo, classical and measured (`ADR-0056`)

> **`ABC-264` CLOSED AS DROPPED; P2 OUT OF PHASE 2; P1 PARKED ON `main`; ONE OPTIONAL OWNER QUESTION, 2026-11-02, by
> BA/PM** (task `bapm-phase2-records`, records only, at `main` `4849c4ab`; nothing run). Sources: `arch-phase2-rebase`
> `…f9f440c9` and `…e4680ed2`; `arch-ADR-0060-reopen` `…e17a23f4` and `…79be958e`; `ADR-0059`, `ADR-0060` and
> `ADR-0056` D2 (dated lines).
> - **`ABC-264` (P2): closed as dropped, not merged.**
>   - The Architect's retry ruling is **DROP**, and `ADR-0059` is accepted, not in force on `main`.
>   - A re-cut is a new ticket with a named new premise (`ADR-0059` § Status). `QE-264-p2-b` stays open for tools.
>   - The S′ 7.0 / 10 stays unpooled.
>   - Page `status: dropped`, `column: Done`. § Tickets row 16.
> - **P2 is dropped from Phase 2.** The order is **P1 → P4 → P3 → P5 → P6** (`ADR-0056` D2's dated line).
>   - P3's and P6's "after P2" waits are void.
>   - P4 still depends on P1, so it waits with it.
>   - Which item is pulled next is the Orchestrator's call. `arch-phase2-p3` is queued.
> - **P1 is PARKED on `main`.** The `ADR-0060` re-open ran a pre-registered set of nine forms; none meets every bar,
>   so no rule is written in and the build does not start.
>   - The stub is in § Phases, "P1, parked". It is title-only and holds no id (BA/PM's call; the reasons are there).
>   - **Its trigger:** re-measure `ADR-0060` decision 1, unchanged and under every bar, after P3 merges or after O1h
>     (`ABC-233`) lands. The owner's acceptance follows.
> - **Optional owner question:** may A3's 27 cp cap be re-derived to 94 cp? The default is **keep**, and a "yes" alone
>   admits no form. § Owner questions.

> **`ABC-264` A6 NOT MET, NOT MERGED; `ABC-265` DoR 10/10; THE S′ POOL TAKES MERGED BUILDS ONLY, 2026-11-02, by
> BA/PM** (task `bapm-ABC-265-rows`, records only, at `main` `f312e9d7`; nothing run).
> - **`ABC-264` (P2):** `qe-ABC-264-p2` FAIL (`…4a487d20`). A6 **44.0 / 100** (30 / 28 / 42, −41.9 ± 58.5 Elo, 0 losses
>   on time) against the GAIN bar of 50.0: **NOT MET**, not re-played. Smoke 7.0 / 10 MET; Levels 57 / 57 MET; gates
>   green. **Not merged** (`ADR-0059` F5). Blocked, closed-not-merged, **pending the Architect's retry ruling**. This
>   page does not decide the retry. § Tickets row 16.
> - **`ABC-265` (TH-1):** the `ADR-0025` shared-table amendment is written, PROPOSED (`arch-ABC-265` `…e396e5ab`). The
>   page carries T10 in A2 and cites the amendment. **DoR 10/10 on reading (b):** the build may start; the merge waits
>   on the owner's acceptance. § Tickets row 17.
> - **The Orchestrator's ruling: `ABC-265` owes no S2 nps reading.** § The per-change rule names it as an exception to
>   the S2 line.
> - **The S′ pool counts merged builds only (BA/PM's ruling).** `ABC-264`'s 7.0 / 10 is recorded and not pooled.
>   § Close-out, the S′ pool row, carries the reasons. Neither choice fires a re-pin today.

> **THE OWNER'S ANSWERS OF 2026-11-02 FOLDED; THREADS IN SCOPE; THE THREAD STRAND CUT AS `ABC-265`–`ABC-267`, by
> BA/PM** (task `bapm-threads-cut`, records only, at `main` `48f3fc01`; nothing run). His words (`orch-2026-10-30a`
> `…81ae2db4`, verbatim): *"R yes, P yes, A accept, B park, C yes; 1 yes, 2 a, 3 c, 4 a, 5 no, 6 later"*. The ADRs
> carry them (`arch-owner-answers-1102`, merged `9dc320b1`: `ADR-0059`, `ADR-0058`, `ADR-0025`, `ADR-0056`, `ADR-0057`,
> `ADR-0044`). This block records what they change on this page; the sections below carry dated marks.
> - **R:** `ADR-0059` ACCEPTED. `ABC-264` part 2 (A6, S′, the Levels deep lane) and its merge no longer wait on him.
>   A2's static-score sentence is re-worded to the derived bound |`evaluate`| ≤ 10 885 cp (`QE-264-b`).
> - **P, Phase 1 paused, is his order now,** not only the order being worked. Pruning (Phase 2) goes first. `ABC-237` and
>   `ABC-258` are parked, and `ABC-257` is paused. Lifting a pause is the Orchestrator's call within P.
> - **A:** `ADR-0058` ACCEPTED, NOT IN FORCE. It comes into force only at `ABC-257`'s merge with A8′ (≤ 0.93×) met and
>   its game read passed.
> - **B:** the `ADR-0025` T2 amendment (`ABC-237`) is PARKED with `ABC-258`. It is re-asked with `ABC-258` or after the
>   worker pool, whichever loads the table first.
> - **C, the NEUTRAL bar for a change invisible at 100 ms** (`ADR-0056` C2′'s 2026-11-02 line). A strength change whose
>   mechanism barely fires at 100 ms may be read on **NEUTRAL (≥ 43.0 of 100)**, never alone: its own pre-registered
>   measured bar must pass too. **The ticket's page names it before the read**, with the intent line "NEUTRAL
>   (invisible at 100 ms)". BA/PM writes it from the design note at or before Ready, and it is never re-classed after
>   a score is seen. § The per-change rule carries it. `ABC-264` stays GAIN.
> - **`ADR-0057` ACCEPTED (threads):**
>   - **OQ-1 yes:** the "Threads" half of § Out of scope is lifted. Pondering stays out. `ADR-0044` D5's reversal is
>     accepted for the thread tickets, and the amending ADR comes with the worker-pool ticket.
>   - **OQ-2 (a):** one game at a time, and the engine may use several cores inside a game. **Every 100 / 400 read
>     stays `Threads 1` against `Threads 1`.**
>   - **OQ-3 (c):** the 40/15 claim is read and reported at `Threads 1` and at `Threads N` separately, **`Threads 1`
>     first**. Each result is labelled **"1 CPU"** or **"N CPU"**, with N and the cores stated, and no "3 000" is
>     quoted without its label (`ADR-0056` C1's dated line; G1).
>   - **OQ-4 (a):** `NFR-009` counts retained search growth, not each worker's V8 baseline heap. That is about 4 MiB for
>     the shared table once plus about 0.5 MiB a worker, about 10 MiB at 12 (`estimate`), inside 16 MiB. Its level does
>     not move, so Q-3K-6 stays open.
>   - **OQ-5 no:** no host change. The accelerator strand (NPU, iGPU) stays parked.
>   - **OQ-6 later:** NNUE on the CPU is re-asked on V4's trigger. § Out of scope's neural line stands.
> - **The thread strand's place** (`ADR-0057` D6's and `ADR-0056` D6's 2026-11-02 lines; set here by BA/PM, the board
>   is the Orchestrator's):
>   - after Phase 2 and its R1 reading, before Phase 3;
>   - **`ABC-265` (TH-1) may be pulled beside Phase 2 by width:** it edits only `src/transposition.ts` and is
>     node-equal at `Threads 1`;
>   - all three land before W1 and before any 40/15 reading;
>   - T2 and T4 are re-asked after `ABC-266`.
>   - Cut: **`ABC-265`** TH-1, the shared table (M, DoR 9/10, owes its `ADR-0025` amendment); **`ABC-266`** TH-2, the
>     worker pool and `Threads`, default 1 (L, DoR 9/10, owes its `ADR-0044` amendment); **`ABC-267`** TH-3, the tests
>     and lanes (S, DoR 9/10, test-only, may fold into `ABC-266`).

> **PHASE 1 (THE TT) PAUSED; PHASE 2 NEXT, 2026-11-02, by BA/PM** (task `bapm-phase1-pause`, records only, at `main`
> `e8495fc5`; nothing run). Source: the ruling `arch-phase1-replan` `…64e95bfa`, with `…c0e9f5a0`, `…64bcf436`,
> `…5ea73b5c`, and `se-ABC-238` `…db17e44b`.
> - **`ABC-238` (T1) closed unmerged on `ADR-0058` F4:** 0.9939× / 0.9958× at depth 8 against ≤ 0.95×. Code kept,
>   `grugops/ABC-238` `3abaefdd`. `ABC-081` `A1` gains its "not in force" line.
> - **Phase 1 rows T1–T4 are paused** under the ruling. `ABC-237` (T2) is parked, re-read with `ABC-258`.
>   `ABC-257` is re-scoped to the combined T1 + T3 attempt with a pre-registered held-out bar (≤ 0.93× over searches
>   2–9, no game > 1.00×), and paused until the owner answers C2′ yes or allows a longer read. `ABC-258`'s premise is
>   restated (3–5 % of nodes store) and T2 folded in; paused. `ABC-236` no longer waits on T1.
> - **Row T3's rationale is corrected:** kept entries do cut under exact depth, 17–23 % of exact cuts (`…5ea73b5c`).
>   `ADR-0056` D2's same line is owed by a later Architect hop on `ADR-0056`.
> - **Phase 2 is next: P2, reverse futility, cut as `ABC-264`** (§ Tickets row 16). Its ADR is the Architect's. If a
>   full page is wanted sooner, `ABC-233` (DoR 9/10, owes its ADR) is the ruling's fallback.
> - **This changes `ADR-0056` D6's Phase 1 order**, so the owner hears the pause with the ADR answers (the
>   Orchestrator's). The board is the Orchestrator's.

> **THE SMOKE'S E 1 650 CONFIRMED BY THE OWNER; `ABC-250` CLOSED, 2026-11-01, by BA/PM** (task `bapm-abc250-close`,
> records only, at `main` `767a2e3e`; nothing run). `EPIC-010`'s block of the same date carries the detail.
>
> - **S′ keeps E 1 650** (`orch-2026-10-30a` `…1f5e3b27`, verbatim: *"ok set to 1650 and if you see in the future we
>   can raise it then let's raise."*).
>   - The "may revert to 1 910" line in the `ADR-0056` fold block below is superseded.
>   - **The raise rule** is C10's re-pin trigger: a pooled S′ score above 85 % over ≥ 30 games re-pins E **upward** by
>     one band-rule step (E ≤ 2 600), with no owner ask.
>   - First reading, cited by the Orchestrator: `qe-ABC-255` A5, 9/10. That is one smoke, under 30 games.
>   - A downward re-pin (pooled below 60 %) is outside the owner's word. BA/PM reads it as a question for the owner.
>   - `RISK-EPIC011-03` stands. This rule is how it is watched.
> - **"The packed base"** on this page (§ Close-out of the open epics, § Dependencies) now reads **the base `EPIC-010`'s
>   milestone 1b leaves**. `ABC-250` (O1-b) closed and did not merge (by routing, A4 not graded), and `ABC-252` was
>   dropped. So Phase 1+ tickets are written on today's `Move` objects with `ABC-254`'s lazy filter, plus O1-c
>   (`ABC-251`, narrowed) and O1-a (`ABC-253`) if they merge. No ticket here changes for this.
> - **`ABC-262`** (row 14, M0) does not change. Its test notes bind generation order, which no live ticket now plans
>   to change. `ABC-251`'s test note 8 carries that bar.

> **THE `ADR-0056` OWNER-ANSWERS FOLD, ON THIS PAGE, 2026-11-01, by BA/PM** (task `bapm-reconcile-adr0056`, records
> only, at `main` `bd29dd50`; nothing run). The fold is on `main` (merge `a0f9297e`, ADR commit `fe50a11f`; notes
> `arch-adr0056-owner-answers` `…d3c756d1`, `…c8c38f1e`). **Its figures replace every "pending the fold" line in the
> block below and in § The per-change rule, § Success measures, § Tickets and § Dedupe audit;** each is rewritten in
> place under this task's name. `EPIC-010`'s block of the same date carries the full figures; this page uses them.
>
> - **Per epic, C3″:** 400 games head to head at 100 ms (`d --budget-ms 100 --rounds 200`); **MET at ≥ 200.0 of 400**;
>   validity 400/400, 0 faults and 0 losses on time at the 50 ms margin by either build. An epic with no engine-core
>   change owes no C3″ (the Architect's reading, the owner may correct it).
> - **The smoke, S′:** 10 games against Stockfish 19 at **E 1 650**, `skytalix` `st=0.5` on level 5 with `timemargin`
>   50 ms (`r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`); bars S-1, S-2 and S-4 (≥ 3.0 of 10; below
>   that, 10 more and ≥ 7.0 of 20). "0.5s difficulty" is that control, not a level (the Orchestrator's ruling); E 1 650
>   is the ADR's (the owner has been told and may revert to 1 910). C10's re-pin now has a trigger: pooled S′ outside
>   60–85 % over ≥ 30 games.
> - **The owner's condition, R-TC:** controls are harness configuration only, and the budget enters the core only as
>   the deadline (`ABC-259`, cut in `EPIC-010` milestone 1b, makes this a default-lane row). **"Works on different
>   difficulty settings":** the Levels deep lane per strength-changing ticket (in each reading row: `ABC-231`…`234`,
>   `236`…`239`, `257`, `258`), and per epic, on the closing head, the Levels deep lane, the ladder short mode and the
>   UCI session deep lane (§ The per-change rule; G7).
> - **`ABC-255` aligned to the fold:** `d --budget-ms 100` (C2′ and C3″) and `r --budget-ms 500` (S′); `rpair` gains
>   no control. **DoR 10/10, Ready recommended** (the column move is the Orchestrator's).
> - **`ABC-256` closed as superseded by C3″** (the Orchestrator's ruling on the fold's recommendation): no routine
>   reading against Stockfish remains for it. Its page is `dropped`; the board card move is the Orchestrator's.
> - **C1's claim timing and C4's anchors, per the fold:** A0 and A1 each take their own 200-game 100 ms reading
>   against Stockfish on the same build (C3′'s Stockfish settings and its E > 2 600 probe rule, ≈ 0.5–0.8 h), asked of
>   the owner with the anchor. **The claim is spent only when such a 100 ms reading on the latest head, plus the
>   measured offset, reaches 3 000.** The "latest C3′ head figure" no longer exists; no line on this page relies on it.
> - **Still open (not ruled by the fold by name): G2's milestone readings R1–R3.** The fold's item 7 is now C3″, S′
>   and the three lanes after each epic, then C4's anchors and C1; it names no R1–R3 control. BA/PM's reading: the
>   anchors' own 100 ms outside readings are what can name a milestone, so G2 stays *[proposed]* until the Orchestrator
>   or the Architect says whether R1–R3 survive (`UNKNOWN - verify`).
> - **`RISK-EPIC010-08` applies here:** C3″'s ± 24 flatters (each opening played four times); QE checks it at the
>   first C3″ (`EPIC-010`'s close).

> **THE OWNER'S ANSWERS, 2026-11-01, by BA/PM** (task `bapm-owner-answers`, records only, at `main` `adab5f0d`;
> nothing run). The owner's word (`orch-2026-10-30a` `…43098cef`, verbatim there): *"1. b ; 2. ok ; 3. quick check
> can be with 0.5s difficulty. Make sure engine is not changed internally and it works on different difficulty
> settings."* **This block amends the one below where they differ;** § The per-change rule carries the result. The
> `ADR-0056` fold of these answers (`arch-adr0056-owner-answers`) is not on `main` at this hop. *(Merged since,
> `a0f9297e`: the block above, `bapm-reconcile-adr0056`.)*
>
> - **Per epic: 400 games head-to-head at 100 ms**, the closing build against the starting build, `d` at 100 ms
>   through `ABC-255`; about ± 24 Elo; MET when the head's point estimate is ≥ 0, ≥ 200.0 of 400 (`ADR-0056` C3″,
>   merged `a0f9297e`; was "pending the fold"; G7). It replaces
>   the 200 + 200 pair against Stockfish.
> - **The bars stand** (C2′: GAIN ≥ 50.0, NEUTRAL ≥ 43.0 of 100).
> - **The smoke is kept, at 0.5 s:** 10 games against Stockfish, `skytalix` at 0.5 s a move, beside each
>   strength-changing ticket's 100-game read and at the epic's close (the Orchestrator's ruling on the R-smoke
>   difference below). ~~Its E and its no-collapse bar at 0.5 s are the fold's.~~ *(`bapm-reconcile-adr0056`: E 1 650,
>   S-4, `timemargin` 50 ms; `ADR-0056` S′.)*
> - **The owner's condition:** test controls are harness configuration only, with no engine code path keyed on them;
>   and the validation shows the engine works across its difficulty settings. ~~**No ticket on this page or in
>   `EPIC-010` carries the difficulty-settings check today;** the Architect names it in the fold.~~ *(Named by the fold,
>   R-TC part 2, and carried by the reading rows and the close lines: `bapm-reconcile-adr0056`.)*
> - **`ABC-255` re-scoped again:** `d` at 100 ms (100 and 400 games) and the 0.5 s control on `r` and `rpair`; the
>   100 ms control on `rpair` / `r` is dropped. DoR 9/10 (row 5 waits on the fold). *(`bapm-reconcile-adr0056`: the
>   fold merged; `r --budget-ms 500` only, `rpair` unchanged; DoR 10/10.)* **C13 is void:** `ABC-256` does not
>   merge into `EPIC-010`'s close read, which no longer plays Stockfish.
> - ~~**Waiting on the fold, beyond the two above:**~~ *(Answered by the fold, `bapm-reconcile-adr0056`, the block
>   above: B0 closed as superseded; C1's claim timing re-pointed; R1–R3 still open.)* whether any routine reading against Stockfish remains for B0
>   (`ABC-256`), G2's milestone readings R1–R3 and C1's claim timing (`ADR-0056` re-pointed it at "the latest C3′ head
>   figure", which a head-to-head read does not produce).

> **THE OWNER'S VALIDATION RULE, 2026-11-01, by BA/PM** (task `bapm-100-400-rule`, records only, at `main`
> `452415bd`; nothing run). The owner's word (`orch-2026-10-30a` `…2896c6eb`, verbatim there): no SPRT; *"We can just
> run 100 games that's it and 400 games after each epic is done on 100ms."* With it: one core (`…f7a50e95`), and any
> other validation run estimated over 1 h is asked of him first (`…aab3b5f4`).
>
> - **Q-3K-2 is answered: no SPRT.** The per-change rule is 100 games at 100 ms (§ The per-change rule, rewritten).
>   **Q-3K-3 is answered: one core**, one game at a time.
> - **Per epic: 400 games at 100 ms before this epic closes** (§ The per-change rule; § Success measures, G7).
> - *(2026-11-01, `bapm-owner-answers`: re-scoped again, the block above.)* **`ABC-255` is re-scoped** from the SPRT lane to the harness's two 100 ms shapes: 100 games new against base, and
>   the 400-game pair against Stockfish, as the `ADR-0056` fold rules (`arch-adr0056-100ms-fold`, merged `94f1504c`
>   during this hop and folded here the same day). It may be pulled before `EPIC-010` closes (C12).
> - **Aligned:** the reading row of `ABC-231`, `232`, `233`, `234`, `236`, `237`, `238`, `239`, `257` and `258`.
>   `ABC-256` gets a dedupe line (C13, condition met; *void 2026-11-01, `bapm-owner-answers`*). The pass lines are `ADR-0056` C2′ (per change) and C3′ (per
>   epic).
> - *(Ruled 2026-11-01 on the owner's answer 3: the smoke is kept, at 0.5 s; the block above.)* **Where BA/PM and the fold differ:** the fold recommends keeping the 10-game R smoke at 4 s beside C2′ and leaves
>   it to this record and the Orchestrator. This page drops it, on the owner's "100 games that's it"; the epic read is
>   the outside check. **The Orchestrator rules, or asks the owner** (`ADR-0056` lists it as his if he wants it).
> - **What 100 ms can see** (`qe-tc-depth-probe` `…b505d675`): depth 6 median (5 cold), against 10 at 4 s. A change
>   that acts only at depth 7 or more mostly does not fire at 100 ms (`RISK-EPIC011-05`). 100 games resolve about ±
>   48 Elo; the 400-game pair about ± 58–78 (`ADR-0056` C3′).

> **`ABC-254` RETURNED TO `EPIC-010` 2026-11-01 by BA/PM** (task `bapm-ABC-254-ready`, records only, at `main`
> `039cb05e`; nothing run, built or timed). C11's exception is met: the owner's "ABC-254: yes" (`orch-2026-10-30a`
> `…f7a50e95`; Q-SP-3 = yes) and the ADR amending `ADR-0003` (`arch-adr0003-amend` `…c314772c`, merged `89af8b56`)
> both landed before `ABC-250` entered development. So `ABC-254` (V2) leaves Phase 5 and goes back to `EPIC-010`
> milestone 1b, first, DoR 10/10. It lands before this epic starts; V3 (staged generation) stays here and is written
> on it. Q-SP-3 is no longer open. Lines below that place `ABC-254` here are struck or carry this date.

> **CREATED 2026-11-01 by BA/PM** (task `bapm-epic011-dedupe`, records only, at `main` `2e9a2457`). Nothing was run,
> built or timed, because `qe-ABC-223` holds the host STRICTLY ALONE. `src/`, `tools/`, `data/`, the board, the trace,
> the ADRs and `AGENTS.md` are untouched. An Architect hop (`arch-adr0056-owner-fold`) is folding the owner's answers
> into `ADR-0056` at the same time. Where this page needs a number that hop owns, it says so and does not guess.
>
> **The owner's word, 2026-11-01** (Orchestrator `orch-2026-10-30a` `…022fb66f`, verbatim): *"3000 elo target would be
> 22s per move or 15 minutes per 40 moves, not with 4s per move. But let's not benchmark all the time with those
> values, we can becnhmark with smaller values for faster feedback loop, can be also 0,5s per move to get faster
> readings. Otherwise i'm happy with where we are going, let's create new Epic yes and finish other epics before that.
> Go over previous epics and tickets to find conflicting work, no need to do the same work twice."* Earlier the same
> day (`…74216a44`): *"Set the goal to 3000 elo rating from current goal."*
>
> - **Status: backlog. It starts only after `EPIC-006`, `EPIC-009` and `EPIC-010` close** (his order). § Close-out of
>   the open epics says what each still owes.
> - **What is confirmed:** the goal is 3 000; **the claim is read at 40/15** (40 moves in 15 minutes, about 22 s a
>   move; Q-3K-1's time half); routine readings may use shorter controls, down to 0.5 s a move; `ADR-0056`'s direction
>   is accepted; a new epic, after the others (Q-3K-5).
> - **What is proposed and not yet confirmed by him** (marked *[proposed]* wherever it appears): the scale, Stockfish 19
>   `UCI_Elo` (the Orchestrator reads it as not contested, `…022fb66f` item 1, but he did not name it); the claim rule
>   (a 200-game reading at E = M scoring ≥ 50 %, `ADR-0056` D5 item 5); the milestones 2 200 … 2 800; the routine
>   control and its game counts (the Architect's, `arch-adr0056-owner-fold` item 3).
> - **Open owner calls:** Q-3K-2, Q-3K-3, Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8 ~~and Q-SP-3~~ (§ Owner questions; Q-SP-3
>   answered yes 2026-11-01).
> - **The dedupe audit** of every epic and ticket against `ADR-0056` and against each other is § Dedupe audit. No work
>   on this page repeats work already done or held elsewhere.

## Problem

- **User:** the owner, who wants `skytalix` to be the best TypeScript / vibe-engineered chess engine (`EPIC-010` §
  Product goal, 2026-10-29) and has set the bar at 3 000 Elo, read at a tournament control.
- **Pain, from the records:**
  - Today's only outside number reads **≈ 2 074** on "Stockfish 19's `UCI_Elo` scale at R's pins on this host"
    (`skytalix` at 4 000 ms a move against E = 1 910 at `st=0.5`; head `51902be5` 72.00 % ± 6.11,
    `qe-EPIC-010-m1-batch-2` `…1a53a7f9`). That is not 40/15 and not equal time.
  - The engine is a correct 2010-era search core over an untapered, untuned evaluation (`ADR-0056` D1). About thirty
    known gaps stand between it and 3 000 (`ADR-0056` D2), and eight of them already have tickets in `EPIC-010`'s
    Backlog.
  - **No instrument on record can see the +5 to +40 Elo steps a classical climb is made of.** The smoke pair sees a
    collapse (≈ 250 Elo), a 200 + 200 R pair resolves ± 78, and an 800-game D resolves ± 16–23 at ≈ 34 h
    (`ADR-0056` § The measurement problem). Two outside point estimates in a row were negative, and no reading can
    say why.
- **Value:** a climb that can be steered: each change measured finely enough to keep or drop, milestone readings that
  show where the engine stands, and one claim reading at 40/15 that says whether 3 000 was reached.

## The goal and how it is read

| item | value | state |
|---|---|---|
| Goal | **3 000 Elo** | confirmed (owner, `…74216a44`) |
| Claim control | **40/15** (40 moves in 15 minutes, about 22 s a move), `skytalix` in `uci-clock-mode` (`EPIC-009`, `ADR-0052`) | confirmed (owner, `…022fb66f`) |
| Scale | Stockfish 19 `UCI_LimitStrength`, `UCI_Elo` E (≈ CCRL Blitz ± 100 by Stockfish's own calibration; tops out at 3 190) | *[proposed]* `ADR-0056` D5 item 1; read as not contested by the Orchestrator |
| Stockfish's side at high E | its time or depth such that its strength holds at E ≈ 3 000 (`ADR-0056` D5 item 3: at `st=0.5` the pick depth may not be reached) | the Architect's (`arch-adr0056-owner-fold` item 2); `UNKNOWN - verify` until it lands |
| Claim rule | milestone M is MET when a 200-game reading at E = M scores ≥ 50 %; the interval is reported, not graded | *[proposed]* `ADR-0056` D5 item 5; the owner's call |
| Milestones | 2 200, 2 400, 2 600, 2 800, 3 000 on the chosen scale; each a **reading** after a block of work, **never a gate on a ticket** | *[proposed]* `ADR-0056` D5 |
| Routine readings | shorter controls, down to 0.5 s a move, for the per-change test (M0) and the milestone trend. ***2026-11-01:** 100 ms a move: 100 games per strength change, 400 per epic, no SPRT* | confirmed in principle (owner); ***2026-11-01:** control and counts set by the owner (`…2896c6eb`); pass lines and Stockfish `st=0.1` (E ≤ 2 600): `ADR-0056` C2′ / C3′ (`94f1504c`)*; ***2026-11-01 (`bapm-owner-answers`):** the epic read is head-to-head (owner, answer 1); the Stockfish smoke at 0.5 s (answer 3)* |
| What a routine reading can say about 40/15 | it predicts the trend, not the level: an engine's gain at a short control is not its gain at a long one, and a fixed-depth Stockfish pick does not scale with time the way `skytalix` does | the Architect states the caveat in the fold; this page claims nothing at 40/15 from a shorter reading |

**Cost of a 40/15 reading (BA/PM arithmetic, an estimate, not a reading; the Architect's figure in `ADR-0056` governs
once it lands):** each side has 15 minutes for its first 40 moves, so a game is up to about 30 minutes before move 40
and more after it. At width 1 a 200-game reading is **of the order of 100–200 h of host time**. That is why the owner's
fast routine readings matter, why the 40/15 reading is kept for the claim and for any milestone the Architect names,
and why Q-3K-3 (width) is his.

## The cheapest slice that proves the value

1. **M0 first** (`ABC-255`): ~~a self-play SPRT lane on the existing harness (`tools/rating/`, `cutechess-cli`), which
   proves itself by stopping H1 on a known gain (`ABC-208`'s null move) and H0 on an identical pair. Without it, no
   later change can be told from noise (`ADR-0056` D3, "Without M0 the climb cannot be steered").~~ *2026-11-01, the
   owner's rule (no SPRT):* the harness plays the owner's two reads at 100 ms, 100 games new against base and the
   400-game pair against Stockfish, so every later change gets its read from one command. *2026-11-01 (`bapm-owner-answers`): the
   epic read is 400 games head-to-head (`d` at 100 ms), and the smoke runs at 0.5 s against Stockfish (`r`).*
2. **B0** (`ABC-256`): one baseline reading on the routine milestone control, on `main` after `EPIC-010` closes, so the
   milestones have a starting point on the control they will be read on.
3. **The TT block** (`ABC-238`, `ABC-237`, `ABC-257`, `ABC-258`): one file, cheap, the "cheapest real gap in the
   search" (`ADR-0056` § EPIC-010's Backlog). *2026-11-02 (`bapm-threads-cut`): paused by the owner's order (P);
   Phase 2 goes first.*

The epic can stop after any phase and hold only changes that passed the per-change rule in force.

## Phases, milestones and order (`ADR-0056` D6, re-based on this page)

`ADR-0056` D6's Phase 0 has three parts. **Two of them stay in `EPIC-010`**, because the owner's order closes
`EPIC-010` first: O1 (milestone 1b, `ABC-250`–`ABC-253`) and `ABC-249`. **The third, M0, is this epic's Phase 0.**
D6 says "the phase order is a recommendation … the Orchestrator and BA/PM may reorder by width and evidence"; the two
reorders made here are named in the "why" column.

| phase | `ADR-0056` row | ticket | page | why here |
|---|---|---|---|---|
| **0, instrument** | M0 | **`ABC-255`** ~~SPRT self-play lane~~ the owner's 100 / 400 reads at 100 ms (re-scoped 2026-11-01; *and again: 400 head-to-head, the 0.5 s smoke, `bapm-owner-answers`*) | full page (new) | every later strength change and the epic's close are read on it; `tools/` only, no file collision; may be pulled before `EPIC-010` closes (C12) |
| 0 | (D5 item 2) | **`ABC-256`** B0: baseline reading on the routine milestone control | full page (new) | the milestones need a starting point on the control they are read on. It runs even if that control is R's pins: milestone 1b is value-identical but faster, so at a fixed time the 2 074 figure is stale |
| 0 | (QE-261-a/b) | **`ABC-262`** two default-lane rows for the lazy legality filter: a pawns-first early-exit board and black-to-move in-check promotions (test-only) | full page (new, `bapm-qe-gaps-1101b`) | the Orchestrator's rule for this hop: it does not have to land before `ABC-251` (which touches neither `src/legal.ts` nor generation order), so it sits here, not in `EPIC-010` milestone 1b; test files only, no value change |
| **1, the TT** *(PAUSED 2026-11-02, `…64e95bfa`; **the owner's order**, "P yes", `…81ae2db4`)* | T1 | `ABC-238` deeper stored entry may cut a shallower search | full page (moved in) | `ADR-0056`: the cheapest real gap, +15–40 (estimate). **First:** `ADR-0056` D6 order, adopted over `EPIC-010`'s `ABC-237` → `ABC-238` (§ Dedupe audit, C2) *2026-11-02: **closed unmerged on F4** (0.9939× / 0.9958× vs ≤ 0.95×); its rule travels with `ABC-257`* |
| 1 | T2 | `ABC-237` depth-preferred replacement | full page (moved in) | ~~after T1 (same file)~~ *2026-11-02: **paused, parked**, re-read with `ABC-258` (pays only on a loaded table: 0.77× at 2^14, 1.00× at 2^18)* |
| 1 | T3 | **`ABC-257`** TT kept across the moves of a game, ~~re-tried after T1 and T2~~ *combined with T1 (2026-11-02)* | full page (new; re-try of dropped `ABC-209`) | ~~`ABC-209`'s NEUTRAL was read under exact-depth cutoffs, where a kept entry almost never cuts (`ADR-0056` D2 T3)~~ *2026-11-02, corrected: kept entries supply 17–23 % of exact cuts (`…5ea73b5c`), so "never cuts" does not explain `ABC-209`'s NEUTRAL. The premise is the combination: T1 + T3 0.904× over searches 2–9 at depth 8, against 0.973× for T3 alone. **Paused** until the owner answers C2′ yes or allows a longer read; bar pre-registered (≤ 0.93×, held out, no game > 1.00×)* |
| 1 | T4 | **`ABC-258`** a larger TT | full page (new) | at 40/15 (≈ 22 s, ≈ 14–20 M nodes a move at today's 0.63–0.90 M nodes/s) ~~a 2^18-slot table (262 144 entries) is far too small~~ *2026-11-02: only 3–5 % of nodes store, ≈ 0.4–1.0 M stores a search, 1.6–3.8 a slot (`…5ea73b5c`); T2 folded in as the alternative remedy; **paused***; 8 MiB fits `NFR-009` today, more is Q-3K-6 |
| **2, pruning and reductions** *(NEXT, 2026-11-02)* | P2 | ~~*stub:*~~ **`ABC-264`** reverse futility (static null move) | ~~title only~~ full page (new, `bapm-phase1-pause`) | top expected Elo per cost (`ADR-0056` D2); acts at remaining depth 1–3, so the 100 ms read sees it. *2026-11-02: first of Phase 2, the ruling's next ticket; ~~owes its ADR~~ `ADR-0059` PROPOSED (`arch-ABC-264`): 120 cp a ply, depth 1–3, null-window; A4 ≤ 0.75× both recursions; DoR 10/10 (reading (b)), In Development (`bapm-ABC-264-rows`)* *2026-11-02 (`bapm-threads-cut`): `ADR-0059` **ACCEPTED** ("R yes"); A6 and the merge no longer wait on the owner* *2026-11-02 (`bapm-ABC-265-rows`): **A6 NOT MET** (44.0 / 100, `qe-ABC-264-p2` `…4a487d20`); not merged (`ADR-0059` F5); Blocked, closed-not-merged, pending the Architect's retry ruling* *2026-11-02 (`bapm-phase2-records`): **DROPPED from Phase 2.** The retry ruling is DROP (`arch-phase2-rebase` `…f9f440c9`); `ADR-0059` accepted, not in force; `ABC-264` closed as dropped, not merged; a re-cut is a new ticket with a named new premise* |
| 2 | P1 | *stub:* LMR by a log table of depth × move index~~, history-adjusted~~ (amends `ABC-121`'s flat 1-ply LMR, `ADR-0026`) *(2026-11-02: "history-adjusted" struck by `ADR-0060` d11; the history term waits for O1h)* | title only; ***parked*** *(§ P1, parked, below)* | *2026-11-02 (`bapm-phase2-records`): first in the order (`ADR-0056` D2's dated line). **PARKED on `main`**: in the `ADR-0060` re-open, no form in the pre-registered set of nine meets every bar (`…e17a23f4`). Re-measured after P3 merges or after O1h* |
| 2 | P4 | *stub:* late-move (move-count) pruning | title only | after P1 *(2026-11-02: so it waits while P1 is parked)* |
| 2 | P3 | *stub:* futility pruning near the leaves | title only | ~~after P2~~ *2026-11-02: P2 dropped, so no wait. P1's re-measure is triggered when P3 merges. Next pull is the Orchestrator's (`arch-phase2-p3` queued)* |
| 2 | P5 | *stub:* null move whose R grows with depth and eval margin (amends `ADR-0050`; `ABC-208`'s fixed R = 3) | title only | |
| 2 | P6 | *stub:* razoring | title only | ~~after P2~~ *2026-11-02: P2 dropped, so no wait* |
| — | reading | **R1**, milestone reading on the routine control | (a QE reading; ticket cut when Phase 2 closes) | `ADR-0056` D6 item 7 |
| **threads** *(2026-11-02, `ADR-0057`; owner OQ-1 yes)* | TH-1 | **`ABC-265`** one lockless shared table: four `Uint32` words a slot over a `SharedArrayBuffer`, XOR check, 2^18 slots, 4 MiB, node-equal at `Threads 1` | full page (new, `bapm-threads-cut`) | after Phase 2 and R1, before Phase 3; **may be pulled beside Phase 2 by width** (edits only `src/transposition.ts`, which no Phase 2 ticket edits; value-identical, so it stales no C2′ read). ~~Owes its `ADR-0025` amendment (the owner's when written)~~ *2026-11-02 (`bapm-ABC-265-rows`): the amendment is written, PROPOSED (`arch-ABC-265`); DoR 10/10 (reading (b)); no S2 reading (the Orchestrator's ruling)* |
| threads | TH-2 | **`ABC-266`** a Lazy SMP worker pool behind a UCI `Threads` option, default 1; read once, `Threads N` against `Threads 1`, labelled a hardware gain | full page (new) | after `ABC-265`; owes its ADR amending `ADR-0044` D3 and D5 (D5's reversal pre-accepted). The only `Threads N` read; every phase read stays `Threads 1` against `Threads 1` (OQ-2 (a)) |
| threads | TH-3 | **`ABC-267`** multi-worker property rows, the torn-entry stress, `NFR-009` summed over workers, the default lane's wall (test-only) | full page (new) | after `ABC-266`, or folded into it (the Orchestrator's call). **All three land before W1 and any 40/15 reading** |
| **3, ordering** | O1h | `ABC-233` history heuristic after the killers | full page (moved in) | |
| 3 | O2c | *stub:* countermove and continuation history | title only | after `ABC-233` |
| 3 | O3s | `ABC-234` SEE orders captures, ordering only | full page (moved in) | |
| 3 | Q1 | *stub:* SEE pruning of losing captures, in quiescence and the main search | title only | after `ABC-234`; was fenced out of `EPIC-010` |
| 3 | Q2 | *stub:* delta pruning in quiescence | title only | was fenced out of `EPIC-010` |
| 3 | S1 | `ABC-236` aspiration windows at the root | full page (moved in) | after T1 (`ADR-0056` D2) |
| **4, evaluation** | E1 | *stub:* the full taper: every PST and material term in middlegame and endgame halves, blended by phase. **Folds `ABC-231` and `ABC-232`** | title only | `ABC-231`/`ABC-232` are subsets (§ Dedupe audit, C7) |
| 4 | E2 | `ABC-239` offline tuning, constants only | full page (moved in) | after E1; Q-3K-7 (data) |
| 4 | E3 | *stub:* king attack: attackers on the king zone, weighted, tapered (re-try of dropped `ABC-205`'s term) | title only | under the tuner; Q-3K-4 (`G6`) |
| 4 | E4 | *stub:* pawn and passer terms: backward, connected, passer king distance, free path, unstoppable | title only | builds on E1's passer scaling (`ABC-232`'s part) |
| 4 | E5 | *stub:* piece terms: bishop pair, rook on open and semi-open files, outposts, mobility per piece, tuned (re-try of dropped `ABC-207` by the tuner; rook activity was fenced out of `EPIC-010`) | title only | |
| 4 | E6 | *stub:* threats (pawn attacks on pieces, hanging pieces) and tempo | title only | |
| 4 | E7 | *stub:* endgame scaling and knowledge (opposite bishops, drawish material, mop-up) | title only | |
| — | reading | **R2**, milestone reading on the routine control | (QE reading, cut when Phase 4 closes) | |
| **5, extensions, time, speed** | X1 | *stub:* check extension at every depth (not `ABC-210`'s horizon form, which stays closed) | title only | |
| 5 | X2 | *stub:* singular extension (and IIR) | title only | after T1 |
| 5 | W1 | *stub:* time use under a clock: no doomed iteration started, a partial iteration's root move kept when it beat the incumbent, soft and hard limits | title only | **must land before the first 40/15 reading**, wherever that falls (reorder: the owner set 40/15 as the claim control, and `uci-clock-mode` today has no soft/hard limit, `ADR-0056` § Inventory, "Time use"). *2026-11-02 (`bapm-threads-cut`): after the thread strand (`ABC-265`–`ABC-267`); its limits are written against the worker pool (`ADR-0056` D6's dated line, item 3)* |
| ~~5~~ | V2 | `ABC-254` lazy legality (O1-d) | ~~full page (moved in)~~ **returned to `EPIC-010`** 2026-11-01 | ~~**waits the owner's yes (Q-SP-3)**; after `EPIC-010`'s `ABC-252` (both rewrite `src/legal.ts`)~~ yes `…f7a50e95` and `ADR-0003` amended before `ABC-250` entered development: `EPIC-010` milestone 1b, first (C11) |
| 5 | V3 | *stub:* staged move generation (hash move before generating; captures before quiets) | title only | after V2 (`ABC-254`, in `EPIC-010` since 2026-11-01) |
| — | reading | **R3**, milestone reading; and **the 40/15 claim reading** when a routine reading points at 3 000 | (QE readings) | `ADR-0056` D6 item 7. *2026-11-02 (OQ-3 (c), `bapm-threads-cut`): the claim is read at `Threads 1` first, then at `Threads N`, each labelled "1 CPU" / "N CPU"; the `Threads N` claim's PREREG is the Architect's, after the strand merges* |
| later | V4 | (not a stub) bitboards: re-opening `ADR-0001` | — | **Q-3K-8, the owner's**, only if the curve flattens below 3 000 after Phase 5 |
| any time | (owner, `…78c476bf`) | **`ABC-263`** SPIKE: NPU, iGPU and CPU threads from Node.js, and search info shared between them (records only, Architect) | full page (new, `bapm-spike-accel`) | independent of the classical phases: it writes records only, gates no phase and is gated by none. It recommends; any thread or net it favours stays out of scope (§ Out of scope) until the owner opens it. *2026-11-02 (`bapm-threads-cut`): its `ADR-0057` is ACCEPTED; threads opened (OQ-1 yes) and cut as `ABC-265`–`ABC-267`; devices parked (OQ-5 no); a net later (OQ-6)* |

- **Milestone readings report which milestone (2 200 … 3 000) a reading meets; they gate nothing.** The 40/15 reading
  is taken for the claim and for any milestone the Architect's fold names; otherwise milestones are read on the
  routine control *[proposed]*.
- **Stubs get an id and a full page at their phase's refinement**, not before. Their estimates are `ADR-0056` D2's and
  are not readings.
- **The thread strand** *(2026-11-02, `bapm-threads-cut`)* sits between R1 and Phase 3 by `ADR-0057` D6's dated line,
  a recommendation BA/PM adopts here. The Orchestrator may pull `ABC-265` beside Phase 2 by width. Its read rules are
  in § The per-change rule.
- **Not cut, recorded:** `ADR-0055` O1-e (incremental material + PST): "not proposed now"; after E1 the evaluation has
  two halves, so it is re-read then, not here.

### P1, parked (stub; 2026-11-02, `bapm-phase2-records`)

- **Title:** P1: late-move reductions from a log table of remaining depth × move index, replacing `ABC-121`'s flat 1-ply
  LMR (`ADR-0026`), behind a test-only off-door pair. The title drops "history-adjusted" (`ADR-0060` d11). It names no
  PV term and no cap, because no form is written into `ADR-0060` as its rule.
- **State:** Backlog, **parked**. Not refined, and not Ready. It cannot reach Ready on today's `ADR-0060` text. The
  re-open found no form meeting every bar on `main` (`arch-ADR-0060-reopen` `…e17a23f4`, `…79be958e`).
- **No id (BA/PM's call).** The id and the full page come at its refinement, by § Phases' rule ("stubs get an id and a
  full page at their phase's refinement, not before"). Reasons:
  - Phase 2 gives an id only to the item about to be pulled: P2 became `ABC-264` when it was next. P3–P6 stay
    title-only.
  - P1 is not next, and there is no rule to build. A page now would carry acceptance rows against a form that does not
    exist.
  - The bars already have one home, `ADR-0060` d8 and d9. A page would copy them and could drift from them.
  - No parked ticket here was parked before it was refined. `ABC-237` and `ABC-258` were full pages first.

  `arch-phase2-rebase` `…e4680ed2` suggested the stub hold an id. The brief left the call to BA/PM, and it is taken
  here. When the trigger below passes, BA/PM cuts the page with the next free id.
- **Intent: GAIN.** LMR fires at 100 ms: 11.0 % of non-first moves are reduced at depth 6 on `main`
  (`arch-phase2-rebase`). It is not a NEUTRAL candidate. **Size:** S–M (`ADR-0056` D2). **Priority:** P2, the largest
  Phase 2 estimate, +40–100 (estimate, `ADR-0056` D2; not a reading).
- **Bars carried, unchanged, by reference** (`ADR-0060` d8, d9 and the re-open's decision 2; listed here so the stub is
  checkable, and the ADR governs):
  - `A1`: export lists +2 (`ABC-077` `A6`) and +1 (`ABC-078` `A4`).
  - `A2`: the table cells, each exclusion, the two-ply re-search row and the source row.
  - `A3`: ≥ 95 % within 25 cp, none beyond 27 cp, 0 sign changes, both recursions at d5 on the 190. The mate floor is
    one ply deeper (door d4, head d5) at 0 violations. The seven zugzwang rows are played at their recorded depths,
    never re-pinned deeper.
  - `A4`: (a) ≤ 0.85× at d8 on kiwipete and position-6 in both recursions. (b) Mean completed depth at maxNodes 47 000
    on the 190 ≥ door + 0.25 ply. (c) `G6` ≥ base.
  - `A5`: `G1` ≥ 54 / 58, no NEWLY line.
  - `A6`: C2′ GAIN ≥ 50.0 of 100, S′, and the Levels deep lane.

  Base facts: the base is `main`, with no reverse futility. The door counts are 1 116 785 / 1 602 457 (`search()` d8)
  and 1 575 537 / 476 244 (`chooseMove` to 8). There are no `ABC-264` rows to re-point.
- **Dependencies, in order:**
  1. **The re-measure trigger:** P3 merged, or O1h (`ABC-233`) landed. Then `ADR-0060` decision 1 is re-measured
     unchanged, under every bar unchanged, by a dated line in `ADR-0060` (the Architect's). That P3 restores the
     margin is a judgement (`UNKNOWN - verify`). If decision 1 meets every bar, BA/PM cuts the page.
  2. **The owner's acceptance of `ADR-0060`.** It gates C2′ and the merge (reading (b)).

  Under "keep the cap" (the default), P1 waits here and the flat 1-ply LMR stays on `main`. If the re-measure misses
  too, the cap question comes back in the same shape (`…e17a23f4`, Risks).
- **Still BA/PM's, not decided here:** whether `ABC-233`'s page carries a history term in LMR, or a follow-up does
  (`ADR-0060` d11).

## The per-change rule (what a value-changing ticket needs before it merges)

- ~~**Until the owner answers Q-3K-2, `EPIC-010` § The merge rule applies here unchanged, by reference** (his Q4 = (e),
  extended: a 10-game D smoke and a 10-game R smoke, S-1 to S-4, before the merge; the trend; batched readings).
  Value-identical tickets stay on S2 with 0 games.~~
- ~~**If Q-3K-2 is yes,** M0's SPRT verdict joins the rule as he words it (beside the D smoke, or in its place). The
  smoke pair stays as the fault, time-loss and collapse guard (`ADR-0056` D5).~~
- **2026-11-01, the owner's rule (`…2896c6eb`; `bapm-100-400-rule`). It replaces the two struck lines and every SPRT
  line on this page.**
  - **Per strength-changing ticket, before the merge: 100 games at 100 ms a move.** The candidate head rebased on
    `main` against its merge-base, self-play, openings 1–50 of `tools/rating/openings.epd` with both colours, one game
    at a time, QE with the host ALONE, through `ABC-255`. It passes (**`ADR-0056` C2′**, merged `94f1504c`) when 100
    of 100 games complete, the candidate makes 0 faults (`EPIC-010` S-1's states) and loses 0 games on time at a 50 ms
    margin, and scores **≥ 50.0 of 100 for a GAIN or ≥ 43.0 for a NEUTRAL**, the intent declared at design. A miss is
    NOT MET and is not re-played; a base fault makes the read UNRESOLVED (re-run once). A depth-gated change names its
    firing rate at 100 ms at design. Reported: W/L/D, score, `cutechess-cli`'s Elo ± error, `G11`. **What it can
    see:** about ± 48 Elo at 95 %. It stops a clear regression; it does not prove a small gain, and the owner accepted
    that ("the effort is not worth it").
  - ~~**The R smoke (10 games at 4 s against Stockfish) is not part of this rule.** The fold recommends keeping it; the
    owner's "that's it" drops it. The Orchestrator rules or asks the owner.~~
  - **2026-11-01, the owner's answer 3 (`…43098cef`; `bapm-owner-answers`): the Stockfish smoke, beside the 100-game
    read and at the epic's close.** 10 games, the candidate (at the close: the closing build) against Stockfish 19
    `UCI_LimitStrength`, `skytalix` at 0.5 s a move and Stockfish at `r`'s `st=0.5`, openings 1–5 with both colours,
    one game at a time: `r <build> <out> --elo E --rounds 5 --concurrency 1` with `ABC-255`'s 0.5 s control. Passes on
    10 of 10 complete, 0 faults (S-1's states) and 0 losses on time (S-2), and the no-collapse bar the fold names for
    0.5 s with its E (~~`UNKNOWN - verify` until the fold merges; S-4's ≥ 3.0 of 10 at E 1 910 was set for 4 s~~
    *2026-11-01, `bapm-reconcile-adr0056`: `ADR-0056` S′, E 1 650, S-4 = ≥ 3.0 of 10, below that 10 more games and
    ≥ 7.0 of 20; `skytalix` `timemargin` 50 ms; `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`*). A
    collapse miss is NOT MET; a fault or time loss is a defect, back to the Software Engineer. ≈ 10 min (estimate).
    It sees only a collapse (± 200 Elo or wider at 10 games, `EPIC-010` § What 10 games can and cannot see).
  - **2026-11-01, the owner's condition (answer 3):** the 100 ms and 0.5 s controls are harness configuration only.
    They reach `skytalix` as `cutechess-cli`'s `st=` at the shipped level 5, below its 4 000 ms cap; no engine code
    path is keyed on a test control, and no strength-changing ticket adds one. The validation also shows the engine
    works across its difficulty settings: ~~**no ticket carries that check today**; the Architect names it in the fold~~
    *(the next bullet, `bapm-reconcile-adr0056`)*.
  - **2026-11-01, `ADR-0056` R-TC part 2 (`bapm-reconcile-adr0056`): the engine still plays at each difficulty
    setting.** Per strength-changing ticket, beside the 100-game read, QE runs the **Levels deep lane** on the
    candidate head, host alone: `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts
    --reporter=verbose` (~~≈ 9 min~~ *577 s*). It passes on exit 0 with every test passed (~~41 at the ADR's count~~ *57 tests, `qe-EPIC-010-close` `…388b3044`*; QE counts its own
    run); a failure is a defect, back to the Software Engineer. Per epic, on the closing head, beside C3″: the Levels
    deep lane, the ladder short mode (`LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run
    src/ladder.test.ts`, ~~848 s loaded~~ *18 tests, 23 s*) and the UCI session deep lane (`ENGINE_DEEP=1
    NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts`, ~~≈ 5 min, estimate~~ *241 tests, 291 s*), each exit 0
    with every test passed; ~~≈ 30 min~~ *≈ 15 min (891 s; figures 2026-11-01, `bapm-phase1-wording`)* together, not asked. R-TC part 1, item 2 (no engine path keyed on a control, a
    budget value, a test flag or the environment) is read at review and, once `ABC-259` merges, by its default-lane
    row.
  - **2026-11-01, the owner's answer 1 ("b"): per epic, before the close, 400 games head-to-head at 100 ms.** The
    closing build (head = `main` at the close) against the starting build (base = `main` before this epic's first
    strength-changing merge), self-play, `d <head> <base> <out> --budget-ms 100 --rounds 200 --concurrency 1` through
    `ABC-255` (200 rounds over the 100 openings, both colours). About ± 24 Elo at 95 % (the probe's ± 48 for 100 games
    over √4; arithmetic). **MET when 400 of 400 games complete, neither build faults or loses on time at the 50 ms
    margin, and the head's point estimate against the base is ≥ 0 (≥ 200.0 of 400), `ADR-0056` C3″** *(was "pending
    the owner-answers fold"; merged `a0f9297e`, `bapm-reconcile-adr0056`)*. On NOT MET the next epic's strength tickets wait until BA/PM names the suspects and the
    Orchestrator rules keep, revert or re-read. ≈ 1.6 h (estimate). Owner-set, so no further ask. Plus the 0.5 s
    smoke on the head *and the three lanes of R-TC part 2 (`bapm-reconcile-adr0056`)*. It replaces the bullet below.
  - *(Superseded 2026-11-01 by the bullet above, `bapm-owner-answers`.)* **Per epic, before the close: 400 games at 100 ms.** By the Orchestrator's reading (`…2896c6eb` item 2): the
    interleaved pair (`rpair` shape), base = `main` before this epic's first strength-changing merge, head = `main`
    at the close, each 200 games against Stockfish 19 `UCI_LimitStrength` at E, 100 openings with both colours,
    `skytalix` at 100 ms (**`ADR-0056` C3′**): Stockfish `st=0.1` for E ≤ 2 600 (above it, an R5-style probe first),
    E by `ABC-204`'s band rule. **MET when the pair's point estimate is ≥ 0**; on NOT MET the next epic's strength
    tickets wait until BA/PM names the suspects and the Orchestrator rules keep, revert or re-read. The pair resolves
    about ± 58–78 Elo; ≈ 1.0–1.6 h (estimate; the Stockfish-side rate is `UNKNOWN - verify`). Owner-set, so no
    further ask.
  - **2026-11-02, the owner's "C yes" (`…81ae2db4`; `ADR-0056` C2′'s dated line; `bapm-threads-cut`): NEUTRAL for a
    change invisible at 100 ms.** A strength change whose design shows, by its firing figure at 100 ms (measured or
    derived), that its mechanism barely fires there may be read on **NEUTRAL (≥ 43.0 of 100)** in place of GAIN.
    - **It never stands alone:** the ticket's own pre-registered measured bar must pass too (a fixed-depth node ratio,
      a completed depth at a longer budget, held-out lines). That bar is not loosened after Ready, and a miss is NOT
      MET.
    - **Who names it:** the ticket's page, **before the read**, with the intent line "NEUTRAL (invisible at 100 ms)".
      BA/PM writes it from the design note at or before Ready. It is never re-classed after a score is seen, and QE
      grades on the intent the page held when the read began.
    - **Unchanged:** C-1, C-2, S′ and the Levels deep lane. A change whose design expects its gain to show at 100 ms
      keeps GAIN (`ABC-264`).
    - **The cost:** up to about 49 Elo lost unseen at 100 ms per such change. C3″ is the net check across the epic.
  - **2026-11-02, `ADR-0057` OQ-2 (a) (`bapm-threads-cut`): every 100 / 400 read stays `Threads 1` against
    `Threads 1`.** One exception: `ABC-266`'s own read, `Threads N` against `Threads 1` at 100 ms on the GAIN bar,
    labelled a hardware gain and reported in wall time and core-seconds. A thread merge is value-identical at
    `Threads 1`, so it makes no phase read stale.
  - **Value-identical tickets** keep the S2 nps reading and play no games.
    - *(2026-11-02, `bapm-ABC-265-rows`.)* **Named exception: `ABC-265` (TH-1) owes no S2 nps reading.** The
      Orchestrator's ruling, on the Architect's recommendation (`ADR-0025` amendment, § The read `ABC-265` owes).
      - It is an identity ticket, not a speed ticket. Its own cost bar is its A4: `G6` plus the `probeTable` and
        `storeEntry` profile, named by `ADR-0057`.
      - Its fallback fires on `G6` below base (its F2, the amendment's T9).
      - An nps reading cannot see the effect: those two functions take about 1–1.4 % of samples, under the host's
        1.8–5.9 % A/B spread.
      - The S2 line stands for every other value-identical ticket. A further exception is named here by ticket.
  - **Any other validation run estimated over 1 h** goes to the owner before it starts: a re-read, a bisect, a
    longer control, R1–R3, an outside pair before a merge (`ABC-239`), C4's anchors, the 40/15 claim. (B0 at the C3′
    control is ≈ 0.5–0.8 h and is not asked; C13.) *(2026-11-01, `bapm-owner-answers`: C13 void; B0's control waits on the fold.)* *(`bapm-reconcile-adr0056`: B0
    closed as superseded by C3″; C4's anchors now carry their own 100 ms outside readings, asked with each anchor.)*
- **`G6` "≥ base" binds as today** (his word `…2ae5fc12`) until Q-3K-4 is answered. `NFR-005`'s depth-6 floor never
  moves.
- **Common gates:** `EPIC-008` § Common gates `G1`–`G11`, by reference, as `EPIC-010` uses them. Each ticket names
  the gates it owes.

## Scope

- One `tools/` change (`ABC-255`, M0) and readings by QE (`ABC-256`, R1–R3, the 40/15 claim). *(2026-11-01,
  `bapm-reconcile-adr0056`: `ABC-256` closed as superseded; R1–R3 open, the top block.)*
- The engine changes of Phases 1–5, each in its own ticket, behind its own ADR or ADR reading and its own `ADR-0026`
  off-door where it changes values, each measured by the per-change rule above.
- **Re-opened here by the owner's Q-3K-5 answer** (a new epic; `ADR-0056` D7: "Either way, it re-opens fenced
  items"): re-tries of `ABC-209` (as `ABC-257`), `ABC-210` (X1, another form), `ABC-205`'s king-safety term (E3) and
  `ABC-207`'s piece weights (E5, by the tuner), SEE pruning (Q1), delta pruning (Q2), rook activity (E5). **They stay
  fenced in `EPIC-010`**, whose remaining scope holds none of them.
- **The thread strand** *(2026-11-02, owner OQ-1 yes, `bapm-threads-cut`)*: a Lazy SMP search over one lockless
  shared table (`ADR-0057` D2), in three tickets (`ABC-265`–`ABC-267`). Behind a UCI `Threads` option, default 1, so the
  default product stays single-threaded.
- `src/search.ts`, `src/engine.ts`, `src/quiescence.ts`, `src/evaluate.ts`, `src/transposition.ts`, `src/legal.ts`,
  `src/moves.ts` and `tools/rating/` change, each only in the ticket that names it. *2026-11-02:* also `src/uci-session.ts`
  and a new worker module (named by `ABC-266`'s ADR), in `ABC-266` only.

## Out of scope

- **A neural network or any learned runtime component** (`EPIC-004` permanent non-goal; the owner's "without neural
  engine"). `ABC-239` emits constants only. *2026-11-02 (`ADR-0057` OQ-6 "later"): NNUE on the CPU is re-asked on
  `ADR-0056`'s V4 trigger (the curve flattening below 3 000 after Phase 5); until then this line stands.*
- **Syzygy tablebases** (`EPIC-010` Q1: deferred by the owner, 2026-10-30; `EPIC-004`'s non-goal stands).
- ~~**Threads, pondering**~~ **Pondering** (single-threaded by decision, `EPIC-010` § Out of scope; `ADR-0044` D5).
  *2026-11-02 (`bapm-threads-cut`): the "Threads" half is **lifted** by the owner (`ADR-0057` OQ-1 yes, `…81ae2db4`).
  Threads are in scope as § Scope's thread strand. Pondering stays out.*
- **Accelerators** *(2026-11-02, `ADR-0057` D6 and OQ-5 "no")*: the NPU and the iGPU, a table shared with a device, and
  the host's `render` group change. The strand stays parked on `ADR-0057` D6's re-open trigger.
- **Several games at once** *(Q-3K-3, read by `ADR-0057` OQ-2 (a))*: one game at a time, under either thread count.
- **A language port** (`ADR-0055` O2, O3: not pursued, owner 2026-11-01). **Bitboards** unless the owner answers
  Q-3K-8 yes.
- **The levels and their budgets** (`LEVELS[1..7]`, `DEFAULT_LEVEL`, `HARD_CEILING_MS` byte-identical, `G9`;
  `ADR-0056` D7 "Not asked").
- **A user-visible Elo, a rating-list entry, CCRL** (`EPIC-008` § Out of scope; distribution is `ADR-0049` and his).
- **`EPIC-010` milestone 1b and `ABC-249`** (they close `EPIC-010`).

## Success measures *[proposed; the owner accepts or changes them]*

| # | measure | target | how it is read |
|---|---|---|---|
| G1 | **3 000, claimed at 40/15** | a reading at 40/15, `skytalix` in `uci-clock-mode` against Stockfish 19 `UCI_LimitStrength` at E = 3 000, meets the claim rule (*[proposed]*: ≥ 50 % over 200 games; the interval reported) | QE, ALONE, by the Architect's measurement plan (`ADR-0056` D5 as folded). *2026-11-02 (OQ-3 (c), `bapm-threads-cut`): read and reported at `Threads 1` first, then at `Threads N`, each labelled "1 CPU" / "N CPU" with N and the cores stated; no "3 000" is quoted unlabelled; Stockfish stays `Threads 1`* |
| G2 | **The climb is visible** | a milestone reading after Phases 2, 4 and 5 names the highest milestone met | R1–R3 on the routine control |
| G3 | **Every value-changing merge passed the rule in force** | 100 % (the per-change rule above) | each ticket's `## Reading` and QE note |
| G4 | **Never loses on time at 40/15** | 0 losses on time and closest call ≥ 500 ms in every 40/15 reading (`EPIC-009` M1's bar, carried) | the 40/15 readings' PGNs; this replaces `EPIC-009`'s later "major validation" (§ Dedupe audit, C6) |
| G5 | **Nothing regressed** | `G1` ≥ 54/58, `G5`, `G7`, `G8`, `G9` green on `main` at each milestone reading | the gates' own instruments |
| G6 | **The owner's decisions stayed his** | 0 NFR bounds moved without his word; Q-3K-2…8 and Q-SP-3 answered before a ticket that waits on them leaves Backlog | ADR pages, owner-word notes |
| G7 | *(2026-11-01)* **The epic's 400-game reading** | ~~400 games at 100 ms, base and head each against Stockfish (§ The per-change rule): the pair's point estimate ≥ 0 (`ADR-0056` C3′)~~ *(2026-11-01, `bapm-owner-answers`, the owner's answer 1)* 400 games head-to-head at 100 ms, closing build against starting build (§ The per-change rule): 400 / 400 complete, 0 faults, 0 losses on time, the head's point estimate ≥ 0, ≥ 200.0 of 400 (`ADR-0056` C3″, merged `a0f9297e`); and the 10-game Stockfish smoke at 0.5 s on the head (S′, E 1 650, S-1/S-2/S-4); *and the Levels deep lane, the ladder short mode and the UCI session deep lane on the head, each exit 0 (R-TC part 2; `bapm-reconcile-adr0056`)* | QE, ALONE, before the close; owner-set, no further ask |

**Close:** G1 MET, or the owner stops the epic after a milestone reading. *2026-11-01: either way, the per-epic
400-game reading at 100 ms (G7) is read before the close (head-to-head, with the 0.5 s smoke: `bapm-owner-answers`).*
*2026-11-01 (`bapm-reconcile-adr0056`): G7 also carries the three lanes of `ADR-0056` R-TC part 2 on the closing head
(the Levels deep lane, the ladder short mode, the UCI session deep lane), the owner's "works on different difficulty
settings".* If the curve flattens below 3 000 after
Phase 5, the next question is V4 and it is his (`ADR-0056` D6 item 7).

## Tickets

| order | id | title | size | priority | column | DoR | waits on |
|---|---|---|---|---|---|---|---|
| 1 | `ABC-255` | M0: ~~a self-play SPRT lane on the rating harness that stops H1 on a known gain and H0 on an identical pair~~ *(re-scoped 2026-11-01)* the rating harness plays the owner's two reads at 100 ms: 100 games new against base, and the 400-game ~~pair against Stockfish~~ *head-to-head read; and the 10-game Stockfish smoke at 0.5 s (`bapm-owner-answers`)* | ~~M~~ S | P1 | Backlog *(Ready recommended, `bapm-reconcile-adr0056`)* | ~~10/10~~ ~~9/10 *(row 5: the owner-answers fold)*~~ **10/10** *(fold merged `a0f9297e`)* | ~~`EPIC-006`/`009`/`010` closed; Q-3K-2 (its use as a gate), Q-3K-3 (width); the Architect's routine control~~ none (`ADR-0056` fold merged `94f1504c`); may be pulled before `EPIC-010` closes (C12) |
| 2 | `ABC-256` | ~~B0: baseline reading of `main` on the routine milestone control, after `EPIC-010` closes~~ **Closed as superseded by C3″** (2026-11-01, `bapm-reconcile-adr0056`) | S | P2 | ~~Backlog~~ **dropped** (page `status: dropped`; the board move is the Orchestrator's) | ~~8/10~~ — | the Architect's routine control; `EPIC-010` closed; *2026-11-01:* ~~closes as merged into `EPIC-010`'s 400-game close reading (C13; condition met by the fold, `94f1504c`)~~ *C13 void (`bapm-owner-answers`): the close read is head-to-head; B0's control and fate wait on the owner-answers fold* *(answered: the fold keeps no routine Stockfish reading; closed as superseded, `bapm-reconcile-adr0056`)* |
| 3 | `ABC-238` | A deeper stored entry may cut off a shallower search (T1) | M | P2 *(was P3)* | ~~Backlog~~ ~~**Ready** *(2026-11-01, `bapm-phase1-wording`; moves past Ready are the Orchestrator's)*~~ **dropped: closed unmerged on F4** *(2026-11-02, `bapm-phase1-pause`; page `status: dropped`; the board move is the Orchestrator's; code `3abaefdd` kept)* | ~~9/10~~ **10/10** | ~~the ADR revising `ABC-081` `A1`; `ABC-255` (if Q-3K-2 yes)~~ *2026-11-01:* `ADR-0058` written, PROPOSED; reading (b): build now, read and merge on the owner's acceptance |
| 4 | `ABC-237` | The TT prefers deeper entries when it replaces (T2) | S | P3 | Backlog, **parked** *(2026-11-02)* | 9/10 | ~~`ADR-0025` amendment~~ *(written 2026-11-01, PROPOSED; read and merge on the owner's acceptance)*; ~~`ABC-238` merged or closed~~ *2026-11-02: re-read with `ABC-258` (the amendment recommended parked with it)* *2026-11-02 (`bapm-threads-cut`): **parked by the owner** ("B park"), with `ABC-258`, or after `ABC-266`, whichever loads the table first* |
| 5 | `ABC-257` | The TT is kept across the moves of one game, ~~re-tried after T1 and T2 (T3)~~ *together with `ABC-238`'s deeper cutoffs (T1 + T3), on a pre-registered held-out bar (2026-11-02)* | ~~S~~ M | P3 | Backlog, **PAUSED** | 8/10 | ~~`ABC-238`, `ABC-237`;~~ ~~*the owner: C2′ yes, or a longer read;*~~ *2026-11-02 (`bapm-threads-cut`): C2′ answered ("C yes"); **paused by the owner's order (P)**, the Orchestrator lifts it within P; intent line owed at resume;* `ADR-0025` d4 amendment (accepted 2026-10-26, not in force) re-read; `ADR-0058` as base (**ACCEPTED, NOT IN FORCE**, "A accept"; in force only at this ticket's merge with A8′ met) |
| 6 | `ABC-258` | A larger transposition table: 8 MiB inside `NFR-009`, more only on the owner's word (T4) *; T2 measured alongside (2026-11-02)* | S | P3 | Backlog, **PAUSED** | ~~8/10~~ 9/10 *(the page's score since 2026-11-01)* | `ABC-257`; Q-3K-6 for > 8 MiB; *2026-11-02 (`bapm-threads-cut`): **paused by the owner's order (P)**; the T2 amendment parked with it ("B park"); re-asked after `ABC-266`, on the shared table* |
| 7 | `ABC-233` | History heuristic after the killers (O1h) | M | P3 | Backlog | 9/10 | the ADR (`ADR-0026` d10) |
| 8 | `ABC-234` | SEE orders captures, ordering only (O3s) | M | P3 | Backlog | 8/10 | `ADR-0024` d4 re-open evidence; the ADR |
| 9 | `ABC-236` | Aspiration windows at the root (S1) | M | P3 | Backlog | 9/10 | new ADR; ~~`ABC-238`~~ *(lifted 2026-11-02: T1 not in force; the instability coupling returns with T1)* |
| 10 | `ABC-231` | King table tapered by phase, alone | S | P3 | Backlog | 9/10 | **to be merged into E1** at Phase 4's refinement |
| 11 | `ABC-232` | Passed pawns by phase | S | P3 | Backlog | 9/10 | **to be merged into E1** (phase scaling) and E4 (passer terms) |
| 12 | `ABC-239` | Weights tuned offline, constants only, validated outside (E2) | L | P3 | Backlog | 8/10 | E1; Q-3K-7; `ADR-0048` licence; the method ADR |
| ~~13~~ | `ABC-254` | Lazy legality (V2, O1-d) | M | P2 | **Returned to `EPIC-010`** 2026-11-01 (milestone 1b, first) | 10/10 | ~~**Q-SP-3**; the ADR amending `ADR-0003`; `EPIC-010`'s `ABC-252` (or where the O1-b chain stops)~~ none (yes `…f7a50e95`; `ADR-0003` amended, `89af8b56`) |
| 14 | `ABC-262` | The lazy-legality rows read the board shapes they missed: `hasLegalMove`'s early exit on a pawns-first board, and the in-check quiet queen promotion with black to move (phase 0, M0; test-only, from QE-261-a and QE-261-b, both LOW; cut 2026-11-01, `bapm-qe-gaps-1101b`) | XS | P3 | ~~Backlog (Ready recommended)~~ **Done** 2026-11-01 (merged `2cf2bb69`; QE PASS_WITH_GAPS `…ed4d02a5`; A4 waived by the Orchestrator, marked on the page by `bapm-spike-accel`) | **10/10** | `ABC-261` merged (`12e78c4d`); no ADR of its own; recommended after `ABC-250` merges or is dropped, before `EPIC-010`'s `ABC-252`; does not hold `EPIC-010`'s close |
| 15 | `ABC-263` | **SPIKE** (records only, Architect): can `skytalix` use the NPU, the iGPU and more CPU threads from Node.js on this host, and share search info between them? Q1 accelerators (with and without a net), Q2 threads (Lazy SMP, shared TT), Q3 shared or device memory on the APU, Q4 the owner's rules it would meet; it recommends and changes no rule (owner `…78c476bf`; cut 2026-11-01, `bapm-spike-accel`) | M | P2 | Backlog | **10/10** | none hard. **Where it sits:** outside phases 0–5, any time, records only; no phase ticket waits on it and it waits on none. Its follow-ups need the owner to open scope (§ Out of scope: threads, neural). *2026-11-02 (`bapm-threads-cut`): `ADR-0057` ACCEPTED; threads opened and cut as rows 17–19; neural later (OQ-6)* |
| 16 | `ABC-264` | P2: reverse futility (static null move) at remaining depth 1–3, behind an `ADR-0026` off-door pair, with mate, check and zugzwang guards (Phase 2, first; cut 2026-11-02, `bapm-phase1-pause`) | S | P2 | ~~Backlog~~ ~~**In Development** *(2026-11-02, the Orchestrator's pull `0b73f51d`; page by `bapm-ABC-264-rows`)*~~ **dropped: closed, not merged, retry DROP** *(2026-11-02, `bapm-phase2-records`; page `status: dropped`; the board move is the Orchestrator's; code `4d1c0616` kept)* | ~~9/10~~ **10/10** | ~~the ADR (margin, depth range, guards, door names; `ADR-0026` d10) — the Architect's; then Ready~~ *2026-11-02:* `ADR-0059` written, PROPOSED; reading (b): build now, read (A6) and merge on the owner's acceptance *2026-11-02 (`bapm-threads-cut`): **ACCEPTED** ("R yes"); A2's static-score sentence re-worded (≤ 10 885 cp, `QE-264-b`)* *2026-11-02 (`bapm-ABC-265-rows`): **A6 NOT MET**, 44.0 / 100 (30 / 28 / 42, −41.9 ± 58.5 Elo, 0 time losses); smoke 7.0 / 10 MET (not pooled); Levels 57 / 57 MET; **not merged** (`ADR-0059` F5); **Blocked, closed-not-merged, pending the Architect's retry ruling** (not decided here); code on `grugops/ABC-264-fix` `4d1c0616`* *2026-11-02 (`bapm-phase2-records`): the Architect's retry ruling is **DROP** (`arch-phase2-rebase` `…f9f440c9`); `ADR-0059` accepted, not in force; waits on nothing. A re-cut is a new ticket with a named new premise (`ADR-0059` § Status); `QE-264-p2-b` open for tools; S′ unpooled* |
| 17 | `ABC-265` | **TH-1:** one lockless shared table, four `Uint32` words a slot over a `SharedArrayBuffer` with an XOR check, 2^18 slots, 4 MiB, node-equal to `main` at `Threads 1` (value-identical; no game read; `G4`, `G6` and the profile) (cut 2026-11-02, `bapm-threads-cut`) | M (L on its fallback) | P2 | Backlog | ~~9/10~~ **10/10** *(2026-11-02, `bapm-ABC-265-rows`)* | ~~the `ADR-0025` amendment (decision 2, decision 4's last bullet), the Architect's; the owner's when written (reading (b))~~ *2026-11-02:* the amendment is written, PROPOSED (`arch-ABC-265`); A2 gains T10; no S2 reading (the Orchestrator's ruling); reading (b): build may start, merge waits on the owner's acceptance. Pullable beside Phase 2 |
| 18 | `ABC-266` | **TH-2:** a Lazy SMP worker pool behind a UCI `Threads` option, default 1; `Threads 1` node-equal; read once, `Threads N` against `Threads 1` at 100 ms, GAIN, labelled a hardware gain (cut 2026-11-02) | L | P2 | Backlog | **9/10** | `ABC-265` merged; a new ADR amending `ADR-0044` D3 and D5 (D5's reversal pre-accepted, OQ-1); M and N fixed on the page; whether `d` sets `Threads` per side (`UNKNOWN - verify`) |
| 19 | `ABC-267` | **TH-3:** multi-worker property rows across thread counts, the multi-writer torn-entry stress, `NFR-009` summed over workers, the default lane's wall before and after its one 2-worker row (test-only; cut 2026-11-02) | S | P2 | Backlog | **9/10** | `ABC-266` merged and its ADR (M, the deep flag); **may fold into `ABC-266`** (the Orchestrator's call) |

The stubs of § Phases get ids when their phase is refined. **Ids `ABC-255`…`ABC-258` are taken here; `ABC-224` stays in
the Orchestrator's pool.** *(2026-11-02: `ABC-264` taken for P2.)* *(2026-11-02, `bapm-threads-cut`: `ABC-265`, `ABC-266` and `ABC-267` taken for
TH-1, TH-2 and TH-3.)* No moved ticket was renumbered.

## Dedupe audit (2026-11-01; every epic, every ticket not plainly Done, and every Done ticket `ADR-0056` touches)

**Method.** Every page under `plans/epics/` and `plans/tickets/` was read for status, epic and scope, and checked
against the board's columns at `main` `2e9a2457` and against `ADR-0056` D2/D4/D6. Done tickets whose work `ADR-0056`
does not touch are grouped by epic. Verdicts: **keep** (where it is), **move** (to `EPIC-011`, re-homed with a dated
line, id unchanged), **merge into X**, **supersede**, **drop**, **close** (the epic).

### Epics

| epic | overlaps with | verdict | reason |
|---|---|---|---|
| `EPIC-001`, `002`, `003`, `005`, `007` | none | keep (done) | no `ADR-0056` row touches their scope |
| `EPIC-004` engine and AI | `ADR-0056`'s base (`ABC-075`…`087`); its permanent non-goals (neural, tablebases) | keep (done) | `EPIC-011` inherits the non-goals as § Out of scope; the "~1700" non-goal was already removed (2026-10-29) |
| `EPIC-008` stronger at the same levels | the harness (`ABC-204`), the R scale, the dropped `ABC-205`/`207`/`209`/`210` | keep (done) | `EPIC-011` reuses its harness and pins; the dropped tickets stay closed and are re-tried here under new ids or stubs |
| `EPIC-006` game session and packaging | none with `ADR-0056` | **close** (§ Close-out) | every cut ticket is Done; the save/resume slice is not earned |
| `EPIC-009` 40/15 clock | the claim control; W1; its "major validation" and "strength at 40/15, later" | **close** on `ABC-223`'s grade; three items move here | § Close-out; C4–C6 below |
| `EPIC-010` verified engine gaps | milestones 2 and 3 (`ABC-231`…`239`), ~~`ABC-254`~~ (returned 2026-11-01), Q6 and the 3 000 goal | **close** after milestone 1b; those items move here | § Close-out; `ADR-0056` D4 maps all eight Backlog tickets to its gap list |

### Tickets

| ticket | overlaps with | verdict | reason |
|---|---|---|---|
| `ABC-231` king taper alone | E1 (full taper); `ABC-205`'s taper half | **move**, then **merge into E1** | a subset of E1 (`ADR-0056` D2, D8: "`ABC-231` and `ABC-232` folded into E1"). Kept as a page until E1 is cut, so its acceptance rows (the `ABC-205` `G6` replay) carry over; then closed as merged |
| `ABC-232` passers by phase | E1 (phase scaling), E4 (passer terms) | **move**, then **merge into E1 / E4** | same; its phase scaling is E1's, any passer term beyond it is E4's |
| `ABC-233` history heuristic | O1h; O2c builds on it | **move** (Phase 3) | covered gap, no duplicate |
| `ABC-234` SEE ordering | O3s; Q1 (SEE pruning) needs it | **move** (Phase 3) | covered gap; its `ADR-0024` d4 evidence wait stands |
| `ABC-236` aspiration | S1 | **move** (Phase 3, after T1) | covered gap; `ADR-0056` makes it depend on T1 |
| `ABC-237` TT replacement | T2; order against `ABC-238` | **move** (Phase 1, second) | covered gap; order C2 |
| `ABC-238` deeper cutoffs | T1 | **move** (Phase 1, first; P3 → P2) | covered gap, the cheapest real one; order C2 |
| `ABC-239` offline tuning | E2; Q-3K-7 | **move** (Phase 4, after E1) | covered gap; its wait on "milestone 2's evaluation" becomes E1 |
| `ABC-254` lazy legality | V2; `ABC-235`'s struck cut 4 ("cheaper legality for non-captures") | ~~**move** (Phase 5, whenever Q-SP-3 is yes)~~ **keep in `EPIC-010`, milestone 1b, first** (2026-11-01: the exception below was met) | it would hold `EPIC-010` open on an unanswered owner call; `ADR-0056` D6: "O1-d whenever the owner says yes (after O1-b)". Exception kept: on a yes plus its ADR before `ABC-250` enters development, the Orchestrator may pull it back into 1b, first (C11). Not a duplicate of `ABC-235`: cut 4 was struck, never built |
| `ABC-249` pre-root repetition row | `ADR-0056` Phase 0 | **keep** in `EPIC-010` | test-only, Ready, closes with `EPIC-010` |
| `ABC-250`…`ABC-253` milestone 1b | `ADR-0056` V1 / Phase 0 | **keep** in `EPIC-010` | `ADR-0055` D2/D4 and `ADR-0056` D6 both put O1 before every algorithm ticket, and the owner closes `EPIC-010` first, so the order holds without a move. `ABC-250` stays first (C3) |
| `ABC-223` `uci-clock-mode` smoke | `EPIC-011`'s 40/15 claim control | **keep** in `EPIC-009` | its 5 games prove the mode; the claim readings use it |
| `ABC-209` TT kept across moves (dropped) | T3 | **supersede by `ABC-257`**; stays dropped | re-tried after T1/T2 under a new id, reusing `grugops/ABC-209` `bb6cf451` and `ADR-0025` d4's accepted amendment. Its NEUTRAL +8.7 ± 18.3 stays on record |
| `ABC-210` horizon check extension (dropped) | X1 | **stays dropped**; X1 is a **different form** (every depth) | `ABC-228` covers the horizon case; re-running form (a) would do the same work twice |
| `ABC-205` king safety + taper (dropped) | E1 (taper half), E3 (king attack half) | **stays dropped**; E1 and E3 cite it | its forms on `grugops/ABC-205-final` `b5d5cea5` are input; it died on `G6` "≥ base" (Q-3K-4), not on play |
| `ABC-207` per-piece mobility (dropped) | E5 | **stays dropped**; E5 tunes, never hand-weights | D LOSS −18.3 ± 16.5 with hand weights; `ADR-0056` E5: "by the tuner, not by hand" |
| `ABC-211` deeper English book (dropped) | none (`ADR-0056` has no book row) | stays dropped | owner's O0 |
| `ABC-218` Skill 7 at 40/15 (dropped) | the 40/15 claim reading | stays dropped; **superseded** by `EPIC-011`'s 40/15 readings | the owner closed it; `uci-clock-mode` is the 40/15 setting now |
| `ABC-219` CLI tournament level (dropped) | none | stays dropped | CLI parity out of scope (`EPIC-009`) |
| `ABC-074` non-M3 spike (dropped) | none | stays dropped | hardware; unrelated |
| `ABC-263` accelerator and threads spike (new, 2026-11-01) | `ADR-0055` (speed path; O2/O3 not pursued, owner); § Out of scope (threads, neural); `ADR-0044` D5; `ABC-239` (offline tuning, which Q1 may place on a device) | **keep** (new; records only) | no ticket covers device or thread use; it re-opens nothing, recommends only, and touches no `ABC-239` scope |
| `ABC-038`, `052`, `060`, `108`, `111` (dropped) | none | stay dropped | unrelated to the engine path |
| `ABC-204` rating harness (Done) | M0 | **keep**; M0 builds on it | `ABC-204` fenced SPRT out of its own scope; M0 adds it as a mode of the same harness, not a second harness |
| `ABC-225` R pair (Done) | milestone readings, B0 | **keep**; reused | the milestone instrument |
| `ABC-208` null move (Done) | P5; M0's known-gain control | **keep** | P5 amends `ADR-0050`; its door pair is M0's H1 control |
| `ABC-121` PVS + LMR (Done) | P1 | **keep** | P1 amends `ADR-0026`'s flat 1-ply LMR; not a re-run |
| `ABC-215` own eval values (Done) | E2 | **keep** | E2 re-fits the values by a method; one untested hypothesis for the negative R estimates (`ADR-0056` § Context) |
| `ABC-081` TT (Done) | T1 revises its `A1` | **keep** | the revision is `ABC-238`'s ADR |
| `ABC-220`, `221`, `222` (Done) | the 40/15 control | **keep** | the setting the claim is read in |
| `ABC-206`, `227`, `235`, `240` (Done) | V1 | **keep** | speed already delivered; 1b continues it |
| `ABC-228`, `229`, `230`, `241`, `242` (Done) | none in `ADR-0056` D2 | **keep** | milestone 1's gaps, closed |
| `ABC-075`…`ABC-087` (Done, `EPIC-004`) | the base every row extends | keep | no row repeats one |
| `ABC-203`, `212`, `213`, `214`, `216`, `226`, `227`, `246` (Done) | — | keep; **page front matter folded** | their pages still read Ready / In Review / In Development; the board holds them Done. A stale "Ready" page invites the same work twice, so each gets `status: done`, `column: Done` and one dated line |
| every other ticket, `ABC-001`…`ABC-248` (Done) | none | keep | no `ADR-0056` row touches them |

### Conflicts found and how each is resolved

| # | conflict | resolution |
|---|---|---|
| C1 | `EPIC-010` § Out of scope fences the re-tries, SEE pruning, delta pruning and rook activity; `ADR-0056` wants them | they are `EPIC-011` scope (Q-3K-5 answered: a new epic); `EPIC-010` keeps its fence, because its remaining scope (1b, `ABC-249`) holds none of them |
| C2 | `EPIC-010` orders `ABC-237` → `ABC-238`; `ADR-0056` D6 orders T1 (`ABC-238`) → T2 (`ABC-237`), "T1 order free" | `ADR-0056`'s order adopted: the larger expected gain first, and the only coupling is the shared file. Both pages carry a dated line |
| C3 | `ADR-0056` D6 lists O1-a before O1-b; `ADR-0055` D4 and the board pull `ABC-250` (O1-b) first, `ABC-253` (O1-a) last | with the Architect (`arch-adr0056-owner-fold` item 4); `EPIC-010` keeps `ABC-250` first, as the Orchestrator's brief says, unless the Architect shows a reason |
| C4 | `EPIC-009` § Out of scope: "spending more time on a hard move (a search change)"; `ADR-0056` W1 | W1 is `EPIC-011`'s (Phase 5, before the first 40/15 reading). `EPIC-009` built the modes, not time management; nothing in it is redone |
| C5 | `EPIC-009` Q6: "no strength reading at 40/15 in this epic, later" | the later reading is `EPIC-011`'s claim, on the owner's 2026-11-01 word |
| C6 | `EPIC-009` § Out of scope: "major validation, ≥ 100 games at 40/15, later, its own ticket on the owner's word"; `EPIC-011`'s 40/15 readings | **merged:** a 200-game 40/15 reading counts losses on time and the closest call (G4 here), so it is the major validation. No separate ticket is cut; one set of games serves both. The owner may still ask for a dedicated one |
| C7 | `ABC-231`, `ABC-232` vs E1 | merged into E1 at Phase 4's refinement |
| C8 | `EPIC-010` Q5 "no Elo target" vs the 3 000 goal | no conflict: `EPIC-010` M2 stays "not LOSS"; the goal is `EPIC-011`'s |
| C9 | `EPIC-010` Q6 (the 3 000 scale and measure) | moved here; its time-control half is answered (40/15); the scale and the claim rule stay *[proposed]* |
| C10 | The R smoke (E = 1 910) loses meaning as the engine climbs (a 2 400 engine scores ≈ 95 % against it; S-4's 3.0 of 10 then guards nothing) | risk `RISK-EPIC011-03`; the Architect or QE proposes E for the smoke when a milestone reading moves past 2 200 (the game counts and pins inside the owner's rule are delivery, `EPIC-010` § Owner questions). *2026-11-01 (`bapm-reconcile-adr0056`): the smoke is now S′ at 0.5 s, E 1 650 (`ADR-0056`), re-pinned one band-rule step when the pooled S′ score leaves 60–85 % over ≥ 30 games (E ≤ 2 600)* |
| C12 | *(2026-11-01)* `EPIC-010`'s close owes the 400-game reading at 100 ms, and today only `ABC-255` (this epic) would make it one command; the owner's order closes `EPIC-010` before this epic starts | the Orchestrator may pull `ABC-255` before `EPIC-010` closes: it is tools only, touches no file milestone 1b edits, and is the instrument of the close reading. Otherwise QE reads the close from a scratch command, as `qe-tc-depth-probe` did, and `ABC-255` waits. *2026-11-01 (`bapm-owner-answers`): confirmed by the Orchestrator; the close read is now `d` at 100 ms head-to-head plus the 0.5 s smoke through `r`, both `ABC-255`'s* |
| C13 | *(2026-11-01)* `ABC-256` (B0) reads `main` after milestone 1b against Stockfish; the head half of `EPIC-010`'s 400-game close reading plays the same build against Stockfish | if the `ADR-0056` fold names 100 ms the milestone control, the close reading's head half is B0, and `ABC-256` closes as merged into it (no second run). If it names another control, `ABC-256` stands, and a B0 over 1 h is asked first. *Condition met (fold `94f1504c`: B0 is a 200-game read at the C3′ control and the base half of the first C3′ comparison)*. ***Void 2026-11-01 (`bapm-owner-answers`):** the owner's answer 1 makes the close read head-to-head, with no Stockfish half, so B0 has nothing to merge into. `ABC-256` stays in Backlog; whether any routine Stockfish reading remains for it is the owner-answers fold's. BA/PM recommends closing it as superseded if the fold keeps none* *(2026-11-01, `bapm-reconcile-adr0056`: the fold, merged `a0f9297e`, keeps none, and the Orchestrator ruled: `ABC-256` is closed as superseded by C3″)* |
| C11 | `ADR-0055` D4 puts O1-d (`ABC-254`) first in O1; `ADR-0056` D6 puts it "whenever the owner says yes (after O1-b)" | `ADR-0056`'s placement adopted (it is in `EPIC-011`), with `ADR-0055` D4's order kept as the exception on `ABC-254`'s page: yes plus ADR before `ABC-250` enters development pulls it back into `EPIC-010` 1b, first. **2026-11-01: met** (yes `…f7a50e95`; `ADR-0003` amended, `89af8b56`; `ABC-250` not yet in development); `ABC-254` is back in `EPIC-010` 1b, first |

## Close-out of the open epics (the owner: finish them first)

### `EPIC-006` (game session and packaging)

- **What remains to Done:** nothing cut is open. All 24 ticket pages with `epic: EPIC-006` sit in the board's Done
  column (`ABC-041`…`046`, `ABC-100`…`102`, `ABC-112`…`115`, `117`, `119`, `120`, `148`, `161`, `200`, `201`, `203`,
  `213`, `216`; `ABC-060` dropped). Acceptance 1 is MET (`ABC-201`,
  Security/NFR 2026-10-23, fresh clone, `NFR-007` 220.9 ms), 2 (`ABC-102`), 3 (`ABC-044`) and 4 (`ABC-101`, `ABC-200`).
- **The negotiable slice (save/resume):** by the epic's own rule it is built "only if play-testing shows people abandon
  games mid-way". The log holds one game, relayed engine-against-engine, which "says little about abandonment"
  (`plans/uat/EPIC-006-play-test-log.md`). **Not earned, so not built at the close** (BA/PM ruling under the owner's
  delivery delegation; reversible). Re-opened as its own ticket only if a log row shows an abandoned game with
  "would have saved: y".
- **3 000-path work in it:** none. **Exit reading owed:** none.
- **Close:** a card move (the Orchestrator's). The 2026-08-13 recommendation "this should probably be two epics" is
  moot and withdrawn.

### `EPIC-009` (40/15 clock)

- ~~**What remains to Done:** `ABC-223` (In Development, `qe-ABC-223` ALONE now), then BA/PM grades milestone 2 (M1, M2
  for `uci-clock-mode`, the 60 s ceiling) from its reading. `ABC-246` is Done (`0ce5041d`).~~ **CLOSED 2026-11-01**
  (`bapm-epic009-close`, merged `ead25f7b`): `ABC-223` is Done (merged `b45162fc`, QE PASS_WITH_GAPS `…767b4959`),
  milestone 2 is MET, and `ABC-246` is Done (`0ce5041d`). Nothing remains.
- **Moved to `EPIC-011`:** W1 (time management, C4), the strength reading at 40/15 (C5), and the major validation
  (C6, merged into the 40/15 readings). None of them was a ticket; nothing is renumbered.
- **Exit reading owed:** `ABC-223`'s 5 games at 40/15 (0 losses on time, closest call ≥ 500 ms, ≥ 75 % clock use,
  longest move ≤ 60 s). If it misses, the fix stays in `EPIC-009`: it is a defect in a built mode, not 3 000-path
  work.

### `EPIC-010` (verified engine gaps)

- ~~**What remains to Done:** `ABC-249` (Ready, test-only), then milestone 1b: *(2026-11-01)* `ABC-254` (first, 10/10),
  `ABC-250` (Ready; its A4 perft reading
  decides `ABC-251`'s form and whether `ABC-252` exists), `ABC-251`, `ABC-252`, `ABC-253` (Ready, pulled last).~~
  **CLOSED 2026-11-01** (`bapm-epic010-close`). The close reads are MET (`qe-EPIC-010-close` `…b52cee9a`, merged
  `70847284`): C3″ 218.0 of 400 at `053733d2` against `ca6e675c`, +31.4 ± 26.4 Elo (effective ± 27.7); S′ 9.0 of 10
  at E 1 650; Levels 57/57, UCI session 241/241, ladder 18/18. **M1–M5 are MET.** Milestone 1b delivered `ABC-254`,
  `ABC-249`, `ABC-259`, `ABC-260` and `ABC-261`. `ABC-250` closed by routing, and `ABC-251`, `ABC-252` and `ABC-253` were
  dropped. Nothing remains. **With `EPIC-006`, `EPIC-009` and `EPIC-010` closed, this epic may start** (the owner's
  order, `…022fb66f`). The column move is the Orchestrator's.
- **Carried into this epic from `EPIC-010`'s close (2026-11-01, `bapm-epic010-close`):**

  | item | as it stands | what it means here |
  |---|---|---|
  | The S′ pool (500 ms, E 1 650) | `qe-ABC-255` A5 9.0 / 10 (`becf571a`) plus `qe-EPIC-010-close` 9.0 / 10 (`053733d2`) = **18.0 / 20 = 90.0 %**; < 30 games, so no re-pin yet (`…77ca3420`, QE-E010C-d) | QE adds each S′ to this pool. It does not restart. **The next S′ at ≥ 8.0 of 10 makes the pool ≥ 26.0 / 30 = 86.7 % > 85 % and fires the upward re-pin**, one band-rule step, E ≤ 2 600, with no owner ask (C10's trigger; `RISK-EPIC011-03`). A score of 7.5 or less does not fire it. A downward re-pin is a question for the owner. *2026-11-02 (`bapm-ABC-265-rows`, BA/PM's ruling): **only a merged build's S′ pools.** `ABC-264`'s 7.0 / 10 (`4d1c0616`, `qe-ABC-264-p2`) is recorded and not pooled, because `ABC-264` is not merged. Reasons: (1) the pool keeps E matched to the engine on `main` (C10, `RISK-EPIC011-03`), and a build the gate refused is not that engine; (2) `EPIC-010`'s trend rule, which `ADR-0056` asks this pool to copy, pools "every value-changing merge"; (3) a refused candidate is often weaker by construction, and an S′ collapse candidate could push the pool under 60 % and raise a downward re-pin question about code nobody ships. No effect today: pooled, it would read 25.0 / 30 = 83.3 % (no re-pin); unpooled, the pool stays **18.0 / 20 = 90.0 %** (not evaluable). The next merged S′ at ≥ 8.0 of 10 still fires the upward re-pin. If a refused candidate later merges, for example after a retry, its own merged head's S′ pools, not this one*
  | C3″'s resolution (`RISK-EPIC010-08`, closed) | effective **± 27.7 Elo** by opening cluster at 40 % draws (design effect 1.094); ± 26.4 iid; the ADR's ± 24 assumed 0.50 draws (`…33395f26`, QE-E010C-b) | Read this epic's C3″ (G7) interval as about ± 28, not ± 24. QE reports the cluster figure again at each C3″. The MET line (≥ 200.0 of 400) does not change |
  | The base this epic is written on | `main` at `053733d2`: today's `Move` objects with `ABC-254`'s lazy filter. O1-c and O1-a were not built (`ABC-251` and `ABC-253` dropped) | "The packed base" on this page reads this base (the top block) |
- **Moved to `EPIC-011`:** `ABC-231`, `232`, `233`, `234`, `236`, `237`, `238` (milestone 2), `ABC-239` (milestone 3),
  ~~`ABC-254` (it waits on Q-SP-3 and would hold the close),~~ Q6 and the 3 000 goal. *(`ABC-254` returned 2026-11-01.)*
- **Milestone 1b stays in `EPIC-010`, last,** because `ADR-0055` D2/D4 and `ADR-0056` D6 both place O1 before every
  ticket that edits `orderMoves`, the search or `evaluate`, and the owner closes `EPIC-010` before `EPIC-011` starts.
  So 1b lands first under either reading, `EPIC-011` is written on the packed base, and no file collision is ordered
  across two epics.
- **Exit readings owed:** one S2 nps reading per 1b ticket (≈ 1 h ALONE each, ≈ 4 h, estimate); `ABC-249`'s `G8`;
  a close hop on `main` reading M3 (the `Q-SET` rows) and M4 (`G1` ≥ 54/58, `G5`, `G6`, `G7`, `G8`, `G9`).
  *(2026-11-01, `bapm-epic010-close`: settled. `ABC-254`'s nps reading is MET, and `ABC-249`'s `G8` was read. `ABC-250`'s
  reading was UNRESOLVED, and the ticket closed by routing. `ABC-251` and `ABC-253` stopped before their readings, and
  `ABC-252` was dropped. M3 and M4 are MET from the
  records on the closing code.)*
  **M2 needs no new batch:** milestone 1's batch (head `51902be5` vs the epic's first merge-base `ca6e675c`, NOT LOSS)
  read the last value change. `git log 51902be5..2e9a2457` shows no production `src/` change since, and 1b is
  value-identical by `G4`, so that batch stands as M2 at the close. This saves a ≈ 23 h ALONE batch.
  *2026-11-01 (`bapm-100-400-rule`): the owner's per-epic rule adds the 400-game reading at 100 ms at this close
  (base `ca6e675c`, head `main` after 1b; `ADR-0056` C3′, ≈ 1.0–1.6 h, estimate). M2 stays graded on the batch. `EPIC-010`'s top block.*
  *2026-11-01 (`bapm-owner-answers`): that read is now 400 games head-to-head at 100 ms (head against `ca6e675c`, ≈ 1.6 h,
  estimate), plus the 10-game Stockfish smoke at 0.5 s on the head.* *2026-11-01 (`bapm-reconcile-adr0056`): graded
  by `ADR-0056` C3″ (≥ 200.0 of 400) and S′ (E 1 650, S-4), plus the Levels deep lane, the ladder short mode and the UCI
  session deep lane on the head (`EPIC-010`'s top block).*

## Owner questions (open; the Orchestrator takes them to him)

| Q | asked | default until he answers | blocks |
|---|---|---|---|
| ~~**Q-3K-2**~~ | Does M0's SPRT verdict join his Q4 = (e) per-change rule, beside the D smoke or in its place? | **answered 2026-11-01: no SPRT;** 100 games at 100 ms per strength change, 400 per epic (`…2896c6eb`) | nothing (`ABC-255` re-scoped) |
| ~~**Q-3K-3**~~ | Test width: SPRT and 40/15 readings at width 1 are slow (an SPRT ≈ 10–30 h, a 200-game 40/15 reading of the order of 100–200 h, estimates); more cores breaks "one at a time" | **answered 2026-11-01: one core** ("Keep game on one core", `…f7a50e95`); width 1. *2026-11-02, refined by `ADR-0057` OQ-2 (a): one game at a time; the engine may use several cores inside a game; every 100 / 400 read at `Threads 1`* | nothing new; a 40/15 reading stays of the order of 100–200 h and is asked first |
| **Q-3K-4** | `G6` "≥ base": keep it, or judge value-changing tickets on play (M0) with `NFR-005`'s depth-6 floor and depth-7 WARN | "≥ base" binds | E1–E7 most (every eval term costs nodes; `ABC-205` died on it) |
| **Q-3K-6** | `NFR-009` above 16 MiB for T4 (he pre-offered 128 MiB, 2026-09-25) | 16 MiB; `ABC-258` goes to 8 MiB only | `ABC-258` beyond 8 MiB. *2026-11-02: still open; `ADR-0057` OQ-4 (a) does not move the level (a threads build ≈ 10 MiB at 12 workers, `estimate`)* |
| **Q-3K-7** | Tuning data: the project's own games (allowed by default), Lichess exports (CC0), a Stockfish-labelled set (a product-identity question) | own games only | `ABC-239`'s data source |
| **Q-3K-8** | Re-open `ADR-0001` (bitboards), only if the readings call for it | no | V4 |
| ~~**Q-SP-3**~~ | Amend `ADR-0003` so lazy legality may be built | **answered yes 2026-11-01** (`…f7a50e95`); `ADR-0003` amended | nothing (`ABC-254` is in `EPIC-010`) |
| ~~**`ADR-0057` OQ-1–OQ-6**~~ | Threads in scope; the reading of "one core"; the claim's thread count; `NFR-009` for workers; the host change; NNUE on the CPU | **answered 2026-11-02** (`…81ae2db4`): 1 yes, 2 a, 3 c, 4 a, 5 no, 6 later (top block) | nothing (`ABC-265`–`ABC-267` cut) |
| **TH-1's `ADR-0025` amendment** *(new 2026-11-02, `arch-owner-answers-1102` open question 1)* | Accept the shared-table amendment to `ADR-0025` decision 2 and decision 4's last bullet, an accepted ADR that OQ-1 did not name | asked when written (recommended); or the Orchestrator reads OQ-1 as covering it. *2026-11-02 (`bapm-ABC-265-rows`): written, PROPOSED (`arch-ABC-265`, merged `c0f3cbad`); the Orchestrator has asked the owner (board, 2026-11-02)* | `ABC-265`'s merge (its build may start under reading (b)) |
| **P1's 27 cp cap** *(new 2026-11-02, `arch-ADR-0060-reopen` `…e17a23f4` decision 4; recorded by `bapm-phase2-records`; **optional**)* | May `ADR-0060` A3's 27 cp drift cap be re-derived on `main` by `ADR-0050` d8's method? It would become **94 cp** (⌊1.5 × 63⌋, decision 1's larger maximum on `main`). **A "yes" alone admits no form:** decision 1 still misses A4 (a) on `chooseMove` position-6 (0.8699 against 0.85), and no form in the set misses only the cap. The answers that settle it: "keep the cap"; "re-derive the cap and A4 (a)" (decision 1 re-proposed with 94 cp and his A4 (a) number); or "decline `ADR-0060`" | **keep the cap** (the Architect's recommendation, which BA/PM adopts). P1 stays parked, the flat 1-ply LMR stays on `main`, and decision 1 is re-measured unchanged after P3 merges or after O1h | nothing today. Under the default, P1 waits on its re-measure trigger (§ Phases, "P1, parked") |
| (part of Q-3K-1) | Confirm the scale (Stockfish 19 `UCI_Elo`) and the claim rule (≥ 50 % over 200 games at E = M) | *[proposed]* as written | G1's wording |

## Dependencies

- `ADR-0056` (accepted in direction; the owner fold is the Architect's, in flight) and `ADR-0055` (ACCEPTED, O1).
- `EPIC-009`'s `uci-clock-mode` (`ADR-0052`): the 40/15 setting.
- `ABC-204`'s pinned host tools (`cutechess-cli` 1.5.1, Stockfish 19); paths out of the records (`ADR-0049` d4).
- `EPIC-010` closed: 1b's packed base is what every Phase 1+ ticket edits.
- Within the epic: ~~`ABC-238` → `ABC-237` → `ABC-257` → `ABC-258`~~ *(2026-11-02: `ABC-257` (T1 + T3) → `ABC-258` (with T2), both paused)* share `src/transposition.ts`; `ABC-233` → O2c →
  `ABC-234` → Q1 share `orderMoves` and the capture path; *2026-11-02 (`bapm-threads-cut`):* `ABC-265` → `ABC-266` →
  `ABC-267` in order; `ABC-265` shares `src/transposition.ts` with the paused `ABC-257` and the parked `ABC-258` (one at
  a time, and whichever follows it is written on the shared layout); `ABC-266` shares `src/engine.ts` and
  `src/uci-session.ts` with every Phase 2 ticket that edits them, so it waits for Phase 2 and R1; E1 → `ABC-239` → E3–E7 share `src/evaluate.ts`; `ABC-254` →
  V3 share `src/legal.ts` and `src/moves.ts` (`ABC-254` in `EPIC-010` since 2026-11-01, so it lands first).

## Risks

- **`RISK-EPIC011-01`: 3 000 may not be reachable in TypeScript.** `ADR-0056` D3: central landing ≈ 2 550–2 800 on
  R's scale (estimate), 3 000 at the optimistic edge; probability with O1 alone < 1 in 4 (judgement). No public
  TypeScript engine with a list rating was found. Mitigated by milestone readings that show the curve, and by the
  owner's V4 question if it flattens.
- **`RISK-EPIC011-02`: host hours.** A 40/15 reading is of the order of 100–200 h at width 1 (estimate); SPRT tests ≈
  10–30 h each (`ADR-0056` D5). Mitigated by fast routine readings (owner) and Q-3K-3. *2026-11-01: no SPRT; a
  change read is ≈ 0.4 h and an epic read ≈ 1.0–1.6 h at 100 ms (estimates, `ADR-0056` C2′ / C3′); width 1 (one core); any other run over 1 h
  is asked first.* *2026-11-01 (`bapm-owner-answers`): the head-to-head epic read ≈ 1.6 h; each 0.5 s smoke ≈ 10 min (estimates).*
- **`RISK-EPIC011-03`: the R smoke stops guarding** as strength rises (C10).
- **`RISK-EPIC011-04`: self-play gains do not transfer outside** (`RISK-EPIC008-03`). Mitigated by the milestone R
  readings. *2026-11-01 (`bapm-owner-answers`): the risk rises. With the epic read head-to-head (the owner's answer 1), every
  routine read is self-play but the 10-game smoke at 0.5 s, which sees only a collapse. The outside checks left are
  that smoke, the 40/15 claim readings and any milestone reading the fold keeps.* *2026-11-01
  (`bapm-reconcile-adr0056`): the fold keeps none routinely; C4's anchors (A0, A1) each carry their own 100 ms outside
  reading, and the fold recommends pooling the S′ scores in `EPIC-010`'s smoke ledger (≈ 140 Elo resolution once
  30 or more games pool), recorded there as the rule.*
- **`RISK-EPIC011-05`: short-control gains do not carry to 40/15.** Mitigated by keeping the claim at 40/15 and
  reading nothing at 40/15 from a shorter control. *2026-11-01, measured (`qe-tc-depth-probe` `…1889e3b0`): at 100 ms
  `skytalix` completes depth 6 (5 on a cold first move), against 10 at 4 s. A change that acts only at depth 7 or more
  (a depth-gated pruning, a larger table, a singular extension) mostly does not fire in a 100-game read, so its read
  guards against breakage and says little about its gain. A longer-control read is an other run (asked first if over
  1 h).*

- **`RISK-EPIC011-06` (2026-11-02, `ADR-0057` D4 Q4 risks): a 3 000 quoted from a `Threads N` reading without its
  label, or per-change reads drifting to several threads** and losing the owner's "less cpu" squeeze. Mitigated by OQ-3
  (c)'s labels on G1 and R3, and by OQ-2 (a) in § The per-change rule: `ABC-266`'s read is the only `Threads N` read.
- **`RISK-EPIC011-07` (2026-11-02): a multi-worker lane that flakes.** Lazy SMP above one worker is not deterministic.
  Mitigated by testing properties only at `Threads ≥ 2`, by `Threads 1` staying node-equal (every oracle holds), and by
  at most one 2-worker row in the default lane (`ABC-266` test note 1, `ABC-267` A4–A5).
- **`RISK-EPIC011-08` (2026-11-02, `bapm-phase2-records`): Phase 2 has lost its two largest estimates for now.** P2
  (+30–60) is dropped and P1 (+40–100) is parked (`ADR-0056` D2 estimates, not readings). P4 (+20–40) waits on P1.
  That leaves P3, P5 and P6 (+15–40, +10–30 and +5–15) pullable on today's `main`, so R1 may read a
  small Phase 2. Mitigated by P1's named re-measure trigger (P3 merged, or O1h) under unchanged bars, and by
  `ADR-0059`'s named re-cut premises for P2. No bar is loosened to recover either one.

## NFR triggers

- **`NFR-005`** (depth floor 6 at the default budget): at risk from every value-changing ticket; `G6` reads it.
- **`NFR-009`** (≤ 16 MiB, ≤ 1 MiB growth): `ABC-257` (table kept across moves, growth over a game), `ABC-258` (size),
  `ABC-233`/O2c (history tables). *2026-11-02 (`ADR-0057` OQ-4 (a)):* for `ABC-266` and `ABC-267`, retained growth
  summed over the main thread and every worker, the shared table counted once, each worker's V8 baseline heap outside
  the bound. About 10 MiB at 12 workers (`estimate`); the level does not move. `NFR-009`'s file may need one line on this
  reading, the `ABC-266` design hop's, with Security/NFR.
- **`NFR-004`** (per-move ceilings, incl. `uci-clock-mode`'s 60 s): W1 and every 40/15 reading. *2026-11-02:* `ABC-266`,
  where each worker checks the clock every `NODES_PER_CLOCK_CHECK` (1 024) nodes and `G5` is read at both thread counts.
  `AR-UCI-BUSY` is unchanged at `Threads 1`.
- **`NFR-008`** (`npm test` ≤ 10 s): new rows on the virtual clock or at fixed depth only; readings never run in
  `npm test`. *2026-11-02:* at most one small 2-worker property row in the default lane, read before and after
  (`ABC-267` A4). Every other multi-worker row sits behind a deep flag.
- **Security (ASVS L1):** `ABC-255` reads only artifacts it builds; no new input path in the engine.

## Test notes

- Readings run in QE's scratch clone, ALONE, outside `npm test`, as `ABC-204`/`ABC-225`.
- Search and evaluation tickets use the `ADR-0026` door pattern (`G4`: the door reproduces base node for node).
- Value-changing tickets owe UAT; the QE verdict signs it (owner delegation `…5aaf7cec` item 2).
- W1 cannot be graded at a fixed time per move; its test needs a clock control (named at its refinement).
- *2026-11-02 (`bapm-threads-cut`):* `Threads 1` keeps every oracle node for node (`G4`). `Threads ≥ 2` is tested by
  properties only (a legal move, a bounded time, no thrown error, no corrupt hit), never by node counts (`ADR-0057` D4).
