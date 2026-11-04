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

> **OQ-0072-1, OQ-0073-1 AND OQ-0074-1 ANSWERED; `ADR-0072`, `ADR-0073` AND `ADR-0074` ACCEPTED; BUNDLE 1 CUT AS `ABC-303` (M, P3,
> DoR 10/10, READY); BUNDLE 1 READS FIRST, `ABC-289` ALONE AFTER IT, 2026-11-04, by BA/PM** (task `bapm-bundle-1-cut`, records only, at
> `main` `3ad21218`; nothing run). Sources: the owner's word `orch-2026-10-30a` `…3e73f9f9`, `arch-owner-answers-1104b`
> `…88ca95bd` § 6, `ADR-0056` D5's dated block, and the Orchestrator's slot (brief `bapm-bundle-1-cut`).
> - **`ADR-0072` and `ADR-0073` are ACCEPTED over missed premises, an override and not a pass.** F1 stays fired on both. They are
>   in force only at `ABC-303`'s merge, and on NOT MET B6 returns each to PROPOSED. `ABC-286` and `ABC-288` stay as design
>   pages; `ABC-288` narrows to the countermove.
> - **`ABC-303`:** its bars are `ADR-0056` D5's tables 1–3, copied word for word. One C2′, GAIN ≥ 50.0, S′ and the Levels deep
>   lane as bars. The code may be built now; its C2′ runs only after `ABC-282` and `ABC-301` have each merged or been
>   recorded as failed.
> - **`ADR-0074` is ACCEPTED,** not in force until `ABC-289` merges on its own read. Its build starts when `ABC-303`'s merge
>   or `failed-attempt` is recorded.
> - **`ABC-284`'s R-283-LMR line is written** (`…37b7fb23` § Owed, item 5), so it is no longer owed.
> - **Rows touched:** § Phases (P4, O2c, Q2); § Tickets (rows 38, 40, 41, new row 55, the ids line); § Owner questions
>   (dated line; OQ-0072-1, OQ-0073-1, OQ-0074-1 struck); § Dependencies (`ABC-303`, `ABC-289`).

> **THE BUNDLE READ'S POINTER READS ACCEPTED; OQ-0072-1 AND OQ-0073-1 ADDED, ONE ANSWER; ROWS P4 AND O2c POINT AT
> `ADR-0072` / `ADR-0073` PROPOSED, PREMISES NOT MET, 2026-11-04, by BA/PM** (task `bapm-lines-1104b`, records only, at
> `main` `732a0cea`; nothing run). Sources: `arch-bundle-1` `…37b7fb23` and the Orchestrator's `orch-2026-10-30a`
> `…5ec6c124` 5 and `…878035ca` 4.
> - **Bundle 1 is `C1+M3`, and neither premise is met.** P4 misses L2; O2c misses CH3. F1 fired on both, so the build
>   waits on the owner's one answer, (a), (b) or (c). `ABC-286` and `ABC-288` take only their `adr:` lines now; every
>   line that depends on his answer waits, and each page says so.
> - **Rows touched:** § Phases (P4, O2c); § The per-change rule (the pointer); § Tickets (rows 38, 40); § Owner questions
>   (dated line; OQ-0072-1 and OQ-0073-1 added).

> **`ABC-289` (Q2) DoR 10/10, READY ON `ADR-0074` PROPOSED, PREMISE MET; OQ-0074-1 ADDED; `Q-N8H-1` AND `Q-3K-11` ANSWERED
> (a), BUNDLE 1 NAMED; LANE BUDGETS ON FIVE PAGES, 2026-11-04, by BA/PM** (task `bapm-lines-1104`, records only, at `main`
> `18fbc754`; nothing run). Sources: `arch-ABC-289` `…62012bbe` § 6 and the Orchestrator's `orch-2026-10-30a`
> `…3b15b361`, `…f30bd604` and `…085f647c`.
> - **`ABC-289`:** out of check, a capture is skipped when stand pat + victim + 200 cp ≤ alpha, and the skip raises the
>   node's value to that bound. The build may start on PROPOSED; the merge waits on OQ-0074-1 and its read. The build
>   is not yet scheduled.
> - **Budgets:** `ABC-282`, `ABC-301` and `ABC-289` hold ≤ +0.10 s each; bundle 1 (`ABC-286` + `ABC-288`) ≤ +0.10 s as a
>   whole. The lines are on those pages.
> - **Rows touched:** § Phases (row 3); § Tickets (row 41); § Owner questions (dated line; `Q-3K-11` struck; `Q-N8H-1`
>   and OQ-0074-1 added); § Dependencies (`ABC-289`).

> **LANE HYGIENE: `ABC-302` CUT (S, P1, DoR 9/10, BACKLOG ON THE ARCHITECT'S REMNANTS); `ABC-282` AND `ABC-301` GET A
> DEFAULT-LANE BUDGET OF ≤ +0.1 s AND BUILD AFTER IT, 2026-11-04, by BA/PM** (task `bapm-ABC-302-cut`, records only, at
> `main` `9ee778b9`; nothing run). Sources: Security/NFR `secnfr-nfr008-1104` `…1184fec4` (`NFR-008` MET at 9.84 s
> graded, 0.16 s headroom; `R-N8H-1` MEDIUM) and the Orchestrator's ruling `orch-2026-10-30a` `…112cd856`.
> - **`ABC-302`:** nine named rows go to existing deep lanes in `ABC-281`'s form S, about −0.5 s. Seven go to their
>   own files' lanes. Two (`cli.test` `ABC-241` A4 and `engine.capacity` `ABC-122` A8) go across to lanes the Architect
>   places. Each row keeps a default-lane remnant, which the Architect confirms by mutant reads. QE re-grades
>   `NFR-008` with twin arms, target median ≤ 9.4 s. No new test file and no new lane line. **Row 10 waits on
>   `arch-ABC-302`.**
> - **`ABC-282` / `ABC-301`:** each gets a default-lane delta of ≤ +0.10 s, no new default-lane file, and any row of
>   ≥ 50 ms deep. W1's identity slice goes deep. Both build after `ABC-302` merges. DoR unchanged (10/10).
> - Outside the phase order, like `ABC-281`. **Rows touched:** § Tickets (rows 34 and 53, new row 54, the ids line).

> **E2'S SECOND PULL CUT AS `ABC-301` (L, P2, DoR 10/10, READY; INTENT GAIN); THE `ADR-0067` d6 AMENDMENT AND B-T8
> ANSWERED YES; `Q-3K-11` (THE BUNDLE READ) ADDED, 2026-11-04, by BA/PM** (task `bapm-ABC-301-cut`, records only, at
> `main` `d7cd6871`; nothing run). Sources: the owner's *"1. yes; 2. yes"* (`orch-2026-10-30a` `…dda43b71`) and the
> Architect's owed lines (`arch-second-pull-1104` `…4917f0f7` § 5, `…a5d74f70` § Owed lines).
> - **`ABC-301`:** one fit with every relation row bounded at once (d6 amendment; no refit, a red relation is a
>   defect, an infeasible set a STOP), over E4a's structure: king distance and free path freed (eg ≥ 0, mg 0), U held
>   at 0. Four preconditions before the fit (`QE-271-h`, `-g`, `-i`, `-f`). B-T0–B-T8 carried by reference; B-T4 gains
>   the endgame `G2` ≤ 1.02 ×; B-T8 re-confirmed (about 5 h). `ABC-271`, `ABC-280` and `ABC-283` are merged.
> - **Rows touched:** § Phases (E2); § The per-change rule (the existing pointer gains its source); § Tickets (new row
>   53, the ids line); § Owner questions (dated line; the d6 and B-T8 rows struck; `Q-3K-11` added); § Dependencies.

> **`ABC-283` DONE (MERGED `58e90d07`): O1h, O3s AND S1 DELIVERED; `ADR-0063` (WITH K3), `ADR-0065` AND `ADR-0066`
> ACCEPTED AS A BUNDLE; `ABC-282` UNHELD, `ABC-286` / `ABC-288` UNHELD FOR THEIR PROBES, 2026-11-04, by BA/PM** (task
> `bapm-ABC-283-done`, records only, at `main` `fd6b595f`; nothing run). Sources: QE `qe-ABC-283` `…de1dc511` (PASS_WITH_GAPS,
> no blocking gap; it signs UAT), the Orchestrator's `orch-2026-10-30a` `…2409cec9`, the re-read on the merged tree
> `se-ABC-283-merge` `…f7f63e1d`, and the Architect's owed lines `arch-ABC-283-accept` `…cbf0bc7b` § Owed, items 1–4.
> - **The read:** C2′ 59 / 27 / 14 = **66.0 / 100 ≥ 50.0** (Elo +115.2 ± 67.0), played once, all three parts on. S′
>   6.0 / 10 against E 1 810 (information). The credit is the bundle's; no reading isolates a part's share.
> - **Pages:** `ABC-233`, `ABC-234`, `ABC-236` → Done, delivered by `ABC-283`, DoR 10/10; `ABC-283` → Done.
>   `ABC-282` (W1) unheld (DoR 10/10, Ready). `ABC-286` (P4) and `ABC-288` (O2c) unheld for their probes (DoR 9/10,
>   Backlog, held on the probe and the ADR). `ABC-284` (P1) points at R-283-LMR (`ADR-0060` § Status).
> - **The owner's bundling direction and R-BUNDLE-1** are pointed at in § The per-change rule; the rule is the
>   Architect's draft (`arch-second-pull-1104`), not written here.
> - **Rows touched:** § Phases (O1h, O3s, S1; P1, P4, O2c, W1 one line each); § Tickets (rows 7, 8, 9, 34, 35, 36, 38,
>   40); § The per-change rule (one pointer); § Dedupe audit (three rows); § Dependencies (three lines); the
>   `bapm-W1-bundle-cut` banner. The history headers stay as written.

> **THE OWNER'S ANSWERS FOLDED: OQ-0071-1 ANSWERED (a) (`ADR-0071` ACCEPTED AS WRITTEN) AND `Q-3K-10` ANSWERED YES
> (`ADR-0024` d4 OPEN FOR Q2'S DESIGN), 2026-11-04, by BA/PM** (task `bapm-owner-answers-1104`, records only, at `main`
> `7dd241cf`; nothing run). Sources: the owner's word as the Orchestrator recorded it (`orch-2026-10-30a` `…7de79e90`)
> and the Architect's owed lines (`arch-owner-answers-1104` `…d6345b29` § 4).
> - **`ABC-282` (W1):** `ADR-0071` ACCEPTED, not in force until `ABC-282` merges on A6. A6 runs on `ABC-300`'s
>   `d --tc 40/8` (merged `4ea39135`). Still held until `ABC-283` merges or misses (D12). Option (b) not taken.
> - **`ABC-289` (Q2):** the owner's hold is lifted. It is held on the Architect's re-measure over Q1 and its ADR, a new
>   ADR that amends d4 (`ADR-0024` § Status, the fourth block). DoR 9/10, Backlog.
> - **Rows touched:** § Phases row 3 (Q2); § Tickets rows 34 and 41; § Owner questions (the dated header line,
>   OQ-0071-1 and `Q-3K-10` struck); § Dependencies (`ABC-289`). The history headers stay as written.

> **`ADR-0071` PROPOSED FOLDED INTO `ABC-282` (DoR 10/10, READY, M → L); THE HARNESS TICKET CUT AS `ABC-300` (S, P2,
> DoR 10/10, READY); OQ-0071-1 RECORDED, 2026-11-04, by BA/PM** (task `bapm-ABC-282-adr`, records only, at `main`
> `19581ca1`; nothing run). Source: `ADR-0071` (merged `9471eb32`) and the Architect's owed lines (`arch-ABC-282`
> `…0187186b`).
> - **`ABC-282` (W1):** W1 acts only in `uci-clock-mode` under a clock (soft limit = budget ÷ 2.3; the hard limit
>   unchanged; a partial iteration's move kept only when it beat the incumbent on exact scores). The read is 100 games
>   at `tc=40/8`, GAIN. **Order: `ABC-283` → `ABC-282`** (D12), and **`ABC-300` before `ABC-282`'s A6**.
> - **`ABC-300`:** `tools/rating` `d --tc 40/8` (`tc=40/8`, `timemargin=0`, `option.TimeMode=uci-clock-mode` on both
>   sides; a `control:` line; any other value refused; every existing argv byte-equal; 0 `src/` lines). No new ADR.
> - **`ABC-078`:** a dated A3 amendment line (`ADR-0071` D7), in force when `ABC-282` merges.
> - **Rows touched:** § Phases (W1); § Tickets (row 34, new row 52, the ids line); § Owner questions (OQ-0071-1).

> **EVERY UNCUT `EPIC-011` AREA CUT AS `ABC-284`–`ABC-299` (16 PAGES, ALL IN BACKLOG); `ABC-271`'S OWED EPIC LINES
> FOLDED, 2026-11-04, by BA/PM** (task `bapm-epic011-areas`, records only, at `main` `b274711c`; nothing run). Source:
> the owner's ruling 3 (`orch-2026-10-30a` `…4c4cb03d`: "after cutting W1, start cutting EPIC-011 areas") and
> `arch-ADR-0070-accept` `…212d6a4c` § 5.
> - **Phase 2:** `ABC-284` P1 (parked), `ABC-285` P5 (deferred; NEUTRAL), `ABC-286` P4 (held on `ABC-283`), `ABC-287` P6
>   (held until the second pull).
> - **Phase 3:** `ABC-288` O2c (held on `ABC-283`), `ABC-289` Q2 (held on `ADR-0024` d4, **`Q-3K-10`, the owner's**, and
>   on a re-measure).
> - **Phase 4:** `ABC-290` E3b, `ABC-291` E4b, `ABC-292` E5 and `ABC-293` E6, each after the second pull; none of their
>   new weights comes from the second pull (only E5's shared mobility weight is in its set). `ABC-294` E7b,
>   premise-gated.
> - **Phase 5:** `ABC-296` X1, `ABC-297` X2 (a premise probe first), `ABC-298` V3.
> - **Readings:** `ABC-295` R2 and `ABC-299` R3, DoR 10/10, held until their phase closes.
> - **DoR:** 9/10 on every engine page (row 10 is an owed ADR, a probe or a hold); 10/10 on R2 and R3. No bar was
>   invented: each page carries the epic's per-change rule and `ADR-0064` d7's rows by reference and names the rest as
>   owed to the Architect. Value figures are `ADR-0056` D2's estimates, labelled.
> - **`ABC-271`, folded from `…212d6a4c` § 5:** row E4, E4a → `ADR-0070` ACCEPTED, structure only at 0; row E2, the
>   second pull fits KD and FP (eg ≥ 0, mg 0) and holds U at 0; § Dependencies, `ABC-271` → the second pull, one read
>   judging both; § Owner questions, the d6 amendment and B-T8's re-confirmation. § Tickets row 23 is aligned to the
>   merged page (S, Ready, 10/10).
> - **Rows touched:** § Phases (17 rows, the stub-id rule, the Q2 line), § "P1, parked", § Tickets (row 23, new rows
>   36–51, the ids line), § Owner questions, § Dependencies. Outside the epic: one pointer line in
>   `memory-bank/40-contributing.md` § Conventions (`R-281-a`).

> **W1 CUT AS `ABC-282` (M, P2, DoR 9/10, BACKLOG ON ITS ADR); THE O1h + O3s + S1 BUNDLE CUT AS `ABC-283` (L, P2,
> DoR 10/10, READY), 2026-11-04, by BA/PM** (task `bapm-W1-bundle-cut`, records only, at `main` `09694a4e`; nothing
> run). Source: the owner's *"yes, cut W1; merge ABC-233, ABC-234 and ABC-236 into one branch and do one test run"*
> (`orch-2026-10-30a` `…4c4cb03d`).
> - **`ABC-282` (W1):** no doomed iteration, a partial iteration's root move kept when it beat the incumbent, and soft
>   and hard limits. It lands before the first 40/15 reading. **The ADR is owed by the Architect** (DoR row 10).
> - **`ABC-283` (the bundle):** `ADR-0063` + `ADR-0065` + `ADR-0066` on one branch. The bars are copied from the
>   owner's note, and one read decides it. `ABC-233`, `ABC-234` and `ABC-236` stay as the design pages, each with a
>   dated pointer. *2026-11-04 (`bapm-ABC-283-done`): **the outcome: passed and merged** (`58e90d07`; C2′ 66.0 / 100).
>   The three ADRs are ACCEPTED as a bundle, and the three design pages are Done, delivered by `ABC-283`.*
> - **Front matter fixed to Done:** `ABC-270`, `ABC-278`, `ABC-279`, `ABC-280` and `ABC-281`. The board already
>   records them Done.
> - **Next, by the owner's ruling 3:** the uncut `EPIC-011` areas, as `ABC-284` onward.
> - **Rows touched:** § Phases (W1, O1h, O3s, S1); § Tickets (new rows 34–35, the ids line).

> **LANE HYGIENE: `ABC-281` CUT (S, P2, DoR 9/10, BACKLOG ON THE ARCHITECT'S CONFIRMATION), 2026-11-04, by BA/PM**
> (task `bapm-nfr008-rows`, records only, at `main` `3e87ceaf`; nothing run). Source: Security/NFR `secnfr-nfr008-headroom`
> `…8a4fb936` (PASS_WITH_RISKS; `main`'s lane median 9.77 / 9.90 s, `R-N8H-1` MEDIUM).
> - **`ABC-281`:** three named rows move to their files' existing deep lanes (`QE-208-a` position-6 to `SEARCH_DEEP`;
>   `ABC-230` A4 and levels A9 to `ENGINE_DEEP`), about −0.38 s on a probe. `AGENTS.md`'s null-move count changes at 0 B
>   of the 3 B left. QE re-reads `NFR-008` graded, with an identity twin, ALONE.
> - **Held, not Ready:** DoR row 11 (Architect/Design confirms the coverage moves, one form per row) is open. `ADR-0046`
>   puts coverage-losing moves at the owner's option (b), and `QE-208-a` is the only default-lane holder of an
>   `ADR-0050` guard. `Q-N8H-1` is held by the Orchestrator and not asked.
> - Lane hygiene, outside the phase order, like `ABC-276`–`ABC-278`. **Rows touched:** § Tickets (new row 33, ids line).
> - **2026-11-04, `bapm-ABC-281-dor`: DoR 10/10, Ready.** Architect/Design met row 11 (`arch-ABC-281` `…d7b2b02b`;
>   `ADR-0046` § Dated 2026-11-04): form S on all three rows, each with a small default-lane remnant. Kill parity was
>   measured on seven mutants, so there is no owner question. Forecast about −0.36 s. **Rows touched:** § Tickets row 33.

> **E2'S FIRST PULL (`ABC-239`) CLOSED NOT MET; THE TOOL LANDS ALONE AS `ABC-280` (S, P3, DoR 10/10, READY); E4a
> (`ABC-271`) GOES BEFORE A SECOND PULL, 2026-11-04, by BA/PM** (task `bapm-ABC-239-close`, records only, at `main`
> `ac55ddf6`; nothing run). Sources: the Orchestrator's decision `orch-2026-10-30a` `…4c76bf7a` (path (iii)); the
> Architect's `arch-ABC-239-f3f4` results `…4eae0fd3` and rulings `…69f22167`; `se-ABC-239b` `…c3f94eab`.
> - **E2, `ABC-239`: first pull CLOSED NOT MET, not shipped** (page `status: done`, closed). On the fit of record
>   `26d06118`, B-T1, B-T2 (0.9905 ×) and B-T3 were MET. Then F3 fired (pawns A2 53 > 50), and so did F4
>   (`zugzwang.001` e1e5 at depths 9–11, the third fitted set to play it). **`main` keeps E1's table.** No bar moved, so
>   no owner word was needed.
> - **New: `ABC-280`**, the tuner landing alone: `grugops/ABC-239b`'s four tool commits, `src/` byte-identical to
>   `main`, B-T1 and B-T3 read on `main`'s table. Tools only, so UAT is waived.
> - **Phase 4 order:** `ABC-271` (E4a) → a second E2 pull. F4's cause needs E4a's free-path and king-distance terms.
>   The second pull is a new attempt under `ADR-0067` F6, with its own PREREG, and it needs the owner's word then on
>   d6's amendment (every relation row bounded at once). `ABC-280` may land at any time before it.
> - **§ Success measures G3:** unchanged. G3 counts value-changing merges, and `ABC-239` did not merge (it never
>   reached B-T7).
> - **Rows touched:** § Phases (E2, E4); § Tickets (rows 12, 23; new row 32; the id line); § Dependencies.

> **`ADR-0068` AND `ADR-0069` ACCEPTED; `ABC-270` RE-CUT AS STRUCTURE ONLY (S, DoR 10/10, READY); Q1 CUT AS
> `ABC-279` (S–M, P2, DoR 10/10, READY); PHASE 4 ORDER SET, 2026-11-03, by BA/PM** (task `bapm-owner-answers-1103b`,
> records only, at `main` `0bf243df`; nothing run). Sources: the owner's *"yes, accept ADR-0068 and ADR-0069"*
> (`orch-2026-10-30a` `…401c3d09`), `ADR-0068`, `ADR-0069`, and the Architect's owed lines (`arch-ABC-270` `…c858b5a5`
> § 5, `arch-Q1-see-pruning` `…5e73b0d4` § 5).
> - **E3a, `ABC-270`:** structure only (three queen-on exposure pairs at `{ 0, 0 }`, value-identical, node-identical,
>   no switch, no doors, no games). `ADR-0068` d6's K0–K4 replace K0–K8. Intent GAIN struck. Size M → S. S1–S3 move to
>   a report in `ABC-239`'s PR. S2 nps is reported only (the Orchestrator's ruling). QE freezes ≥ 6 queen pairs before
>   the build. **DoR 9/10 → 10/10, Ready.**
> - **Q1, `ABC-279`:** quiescence skips SEE-losing captures out of check, behind an off-door pair (`ADR-0069`). A1–A6
>   cite `ADR-0069`'s bars: drift ≥ 93 % within 25 cp with max ≤ 144; mate floor 0; zugzwang 7 / 7; `G1` ≥ 54 / 58;
>   d8 nodes ≤ 0.78 × on four readings; reach ≥ door + 0.55 ply; `G6` / `NFR-005`; `G2` by byte identity; C2′ 100
>   games at 100 ms, GAIN ≥ 50.0; S′ at E 1 810; the Levels deep lane. **On a miss it is closed unmerged under S1 (`EPIC-008`'s ship rule), not
>   shipped. DoR 10/10, Ready.**
> - **Phase 4 order:** `ABC-270` (structure) → `ABC-239`'s fit; one read (`ABC-239`'s B-T7 / B-T8) covers both. Q1
>   merges or misses before `ABC-239`'s candidate is frozen for B-T7 / B-T8. `ABC-270`'s and `ABC-279`'s builds run
>   beside `ABC-239`'s tool build (no file collision between `ABC-279` and either).
> - **Owner questions:** `ADR-0068` and `ADR-0069` accepted; Q-3K-9 closed by `ADR-0069`. **Still open: Q-3K-6 and
>   Q-3K-8 only.**
> - **Rows touched:** § Phases (Q1, E2, E3); § Tickets (rows 12, 22; new row 31; the id line); § Owner questions;
>   § Dependencies.

> **OWNER ANSWERS 1–8 FOLDED: `ADR-0067` ACCEPTED, `ABC-274` DONE, `ABC-239` DoR 10/10 READY ON A PINNED DATA SET;
> ONLY Q-3K-6 AND Q-3K-8 OPEN, 2026-11-03, by BA/PM** (task `bapm-owner-answers-1103`, records only, at `main`
> `bdecb7e1`; nothing run). Sources: the owner's answers `orch-2026-10-30a` `…af126c04` ("1. yes ; 2. yes ; 3. no ;
> 4. no ; 5. ok yes ; 6. yes ; 7. yes; 8. yes"), the Architect's fold `arch-owner-answers-1103` (`…ab9f83a3`,
> `…e81f6b25`; merged `5a254b61`), `ADR-0067` § Addendum 2026-11-03.
> - **Answered:** `ADR-0067` accepted (1); Q-3K-7 (a) yes (2), (b) no (3), (c) no (4); B-T8 approved (5); Q-3K-9 yes,
>   `ADR-0024` d4 open for Q1's **design** only (6); SEC-HP-2 yes (7); `ABC-270`'s design may start now (8). **Still
>   open: Q-3K-6 and Q-3K-8 only.**
> - **Phase 4:** E2-pre (`ABC-274`) **Done**, merged `2410d4f7`, F8 not fired. E2 (`ABC-239`) **DoR 10/10, Ready, P2**
>   (was P3): own games plus the Lichess `2017-03` CC0 export (≤ 1 000 000 positions, own share 0.5 of the loss,
>   validation own only), B-T7 and B-T8 before its merge, four data-stage stops. **In design:** E3a (`ABC-270`,
>   `arch-ABC-270`) and Q1 (`arch-Q1-see-pruning`). **No Q1 ticket is cut yet:** it follows its design, PREREG and ADR.
> - **`ABC-277` A7 done** at `1e558566`; the line held **3** processes (one vitest runner, two fork workers), not 2.
> - **Rows touched:** § Phases (Q1, E2-pre, E2, E3); § Tickets (rows 12, 22, 26, 29); § Owner questions.

> **HOST-PATH TICKETS `ABC-276` AND `ABC-277` DONE; `ABC-278` CUT (THE CHECK HARDENED, S, P2, READY), 2026-11-03, by
> BA/PM** (task `bapm-gaps-1103`, records only, at `main` `8580bbd3`; nothing run but the path check). Sources: QE
> `qe-ABC-276` `…a79db6c1` / `…1cbc2325`, `qe-ABC-277` `…98c1d275` / `…7d149fbd`; the Orchestrator's board lines.
> - **`ABC-276` Done** (merged `3dd27cfc`; QE PASS_WITH_GAPS; A1–A7 met on 20 real `r` / `d` runs). `QE-276-a` (no row
>   for `main()`'s seal call) and `QE-276-b` (placeholder-word or short user / host names) are **accepted LOW** on its
>   page, each with a re-open trigger. They are not folded into `ABC-278`: another file set (`tools/rating/`), and the
>   only row for -a costs a clone and a build per run.
> - **`ABC-277` Done** (merged `541ddf45`; QE PASS_WITH_GAPS; A1–A6 met; A7 waits on the owner's SEC-HP-2 answer).
> - **New: `ABC-278`** (S, P2, DoR 10/10, Ready): the check reads records as text whatever `.gitattributes` says
>   (`QE-277-a`, MEDIUM, fail-open), decompresses `.xz` (-b), catches wider foreign-argv shapes with a false-positive
>   budget of ≤ 10 (-c) and a home path followed by `.` / `-` / `_` (-d), prints quoted names clean (-e), and reads both
>   homes, with a runbook line on the real `HOME` (-f). Records hygiene, outside the phase order, like its parents.
> - **Rows touched:** § Tickets (rows 28–29, new 30, ids line).

> **R1 READ: X = 1 806.5 ± 47.4 AT E 1 810 (`ABC-273` DONE); `ABC-275` DONE; `ABC-274` QE PASS, READY TO RELEASE ON
> "ACCEPT ADR-0067"; HOST-PATH TICKETS `ABC-276` AND `ABC-277` CUT (P2), 2026-11-03, by BA/PM** (task `bapm-sec-cut`,
> records only, at `main` `5222a9b4`; nothing run). Sources: QE `qe-ABC-273` `…07b3c794` / `…334a1bf6`, `qe-ABC-275`
> `…8d38c358`, `qe-ABC-274` `…fa87f74d` / `…d4c26218` (on `grugops/ABC-274`), Security/NFR `sec-host-paths`
> `…72b4070b` / `…45ef018a`; the Orchestrator's board lines.
> - **R1 (`ABC-273`, Done, merged `20d539e1`):** 99.0 / 200 (49.5 %) against Stockfish 19 at E 1 810, Elo −3.5 ± 47.4,
>   **X = 1 806.5 ± 47.4** (opening-cluster ± 48.4), on `main` `85a304ff` (after E1). 0 faults, 0 time losses, 0.59 h.
>   E 1 810 confirmed by the band rule: no step, no owner ask. **Highest milestone met: none** (E < 2 200). R1-A4 met
>   here: § Phases R1 row and § Success measures G2. `QE-273-c` folded: R2 and R3 read **"re-run once, asked of the
>   owner first"**.
> - **`ABC-275` Done** (merged `85a304ff`; QE PASS_WITH_GAPS; A6 met at R1). `QE-275-a` (usage text) folded into
>   `ABC-276`.
> - **`ABC-274` (E2-pre):** QE PASS_WITH_GAPS signs UAT (`G2` 0.9897 ×, `G6` = base, 0 mismatches over 4.8 M rows).
>   Board: Ready to Release. The merge waits on the owner's *"accept ADR-0067"* (pending). `QE-274-a` → § Test notes
>   (QE freeze before the build); `QE-274-b` → `ABC-239` test note 3.
> - **New, both P2, DoR 10/10, Ready:** **`ABC-276`** (S, tools only): `rating.ts r` / `d` redact their records like
>   `rpair`, `SHA256SUMS` after redaction, the played argv byte-equal, `usage()` names 100. **`ABC-277`** (M, low
>   end): a diff-scoped records path check (five classes, `.gz`, renames pass), run by the Orchestrator before each
>   merge, and the placeholder rule as a standing ruling with the hostname exemption. Both from `QE-273-b` /
>   `SEC-HP-1` / `SEC-HP-2` (`ADR-0049` D4). They sit outside the phase order (records hygiene, no Elo); homed here
>   because their source is this epic's readings.
> - **Owner, pending:** SEC-HP-2's one-line redaction (§ Owner questions; Security/NFR recommends yes). History is not
>   rewritten and the 816 existing files are not bulk-redacted (accepted risk, Olger Oeselg).
> - **Rows touched:** § Phases (R1, E2-pre, R2, R3); § Success measures (G2); § Tickets (rows 25–27, new 28–29, ids
>   line); § Owner questions (SEC-HP-2); § Test notes (the freeze line).

> **R1–R3 RULED: THEY SURVIVE AT 100 MS; `ABC-275` CUT (R1's harness, S, P2, Ready); `ABC-273` (R1) DoR 10/10, HELD ON
> `ABC-275`; S′ POOL AT E 1 810 = 7.0 / 10, NO STEP; `ADR-0064` IN FORCE, 2026-11-03, by BA/PM** (task `bapm-R1-cut`,
> records only, at `main` `30d15584`; nothing run). Sources: the Architect's `arch-post-269` notes, decision `…8136b589`
> (the R1–R3 ruling), observation `…ee31f3ee` (the S′ pool), decision `…3f30baf8` (`ADR-0064` in force; `QE-269-f` /
> `-g`) and observation `…1fa63931` (the owed lines); the Orchestrator's board line at `30d15584`.
> - **R1–R3 survive** as G2's milestone readings, on C4's 100 ms reading against Stockfish 19: 200 games, both sides at
>   `st=0.1`, E by the band rule, and C3′'s probe first above E 2 600. R1 is now, R2 at Phase 4's close, and R3 after
>   Phase 5 (`ADR-0056` D6's dated line of 2026-11-03). **G2 no longer waits on a ruling.** Its targets stay
>   *[proposed]*, which is the owner's call. § Success measures G2; § Phases R1, R2, R3; the owner-answers block
>   ("Still open … R1–R3": ruled).
> - **`ABC-275` (new, S, P2, DoR 10/10, Ready):** `r` accepts `--budget-ms 100`, with Stockfish at `st=0.1` /
>   `timemargin` 2 000. At 100 ms, `--elo` above 2 600 is refused, and every other argv stays byte-equal. It is
>   `ABC-255` item 2 narrowed to `r`. The Architect wrote P3. The Orchestrator's brief sets P2 because it gates R1.
>   § Tickets row 27.
> - **`ABC-273` (R1):** DoR row 10 ✅, so **10/10**. It is held in Backlog on `ABC-275`'s merge (the Architect's line).
>   The exact command is on its page. Host time is about 0.4–0.9 h (estimate), so the owner is not asked unless QE's
>   PREREG estimate passes 1 h or the band rule steps E. **Placement** (the Orchestrator's ruling): R1 runs before the
>   next value-changing merge (`ABC-239`, `ABC-270`, `ABC-271` or `ABC-272`). § Tickets row 25.
> - **The S′ pool at E 1 810:** `qe-ABC-269` 7/3/0, merged `54dee3f2`, gives 7.0 / 10 = 70.0 %. That is below 30
>   games, so **no step**. Those are the Architect's figures (`…ee31f3ee`), copied here, not computed. R1 plays at
>   100 ms and never pools. § Close-out, the S′ pool row. C10 is unchanged.
> - **E1:** DONE was already recorded by `bapm-269-done` (checked: the top block, § Phases row E1, § Tickets row 21).
>   Added: `ADR-0064` is **IN FORCE** by its own § Status (`…3f30baf8`).
> - **`ABC-274` A5:** its page cites `ADR-0067` d8's dated line (the session spread stated ahead as a report; the round
>   order in words; the bar unchanged).
> - **Rows touched:** § Phases (E1, R1, R2, R3); § Success measures (G2); § Tickets (rows 25, 27, and the ids line);
>   § Close-out (the S′ pool row); § Owner questions (the `ADR-0064` row); § Dependencies (the Phase 4 order line);
>   the owner-answers block ("Still open").

> **`ABC-269` (E1) DONE, THE FIRST EVALUATION CHANGE AND THE FIRST PHASE 4 MERGE; `ABC-274` (E2-PRE) READY, DoR 10/10;
> `ABC-270`–`ABC-273` NO LONGER WAIT ON E1, 2026-11-03, by BA/PM** (task `bapm-269-done`, records only, at `main`
> `128e3c6c`; nothing run). Sources: QE `qe-ABC-269` `…eff2fe64` (verdict) and `…9ba289c2` (gaps); the Orchestrator's
> board line (`128e3c6c`); the Architect `arch-ABC-269-F3` `…a0468a78`.
> - **`ABC-269` (E1, the tapered evaluation): Done.** Merged to local `main` at `54dee3f2` with cut C1. F3 fired once on
>   `G2` (1.071 / 1.067 ×), and the one value-identical cut re-read **1.0373 ×, MET** (PREREG `…e36ee7ca`). B8: C2′
>   **57.0 / 100** (W / L / D 44 / 30 / 26, +49.0 ± 59.5 Elo, LOS 94.8 %, 0 time losses), S′ 7.0 / 10 at E 1 810,
>   Levels 57 / 57. B5 and B7 MET. Post-merge `npm test` 2 566 / 2 566. QE PASS_WITH_GAPS signs UAT. `ADR-0064` is in
>   force from the merge; the Architect's dated line is in flight (`arch-post-269`). § Phases row E1, § Tickets row 21.
>   - **A pass, not a proven gain** (`QE-269-i`): the interval crosses 0, as `ABC-268`'s did. G3's tally is 2 of 2;
>     C3″ (G7) at the close is the net check. § Success measures.
> - **Phase 4 next: `ABC-274`** (E2-pre, value-identical). DoR row 10 is met, so it is **10/10, Ready**; the
>   Orchestrator pulled it to In Development (`se-ABC-274`). Its merge waits on *"accept ADR-0067"* (pending, not
>   assumed). § Tickets row 26.
> - **`ABC-270`, `ABC-271`, `ABC-272`, `ABC-273`:** the `ABC-269` wait is met on each page. Each stays 9/10 on its own
>   design, probe or ruling. **R1's window is open** (before `ABC-239` merges); its control ruling is the Architect's
>   (`arch-post-269` item 4). `ABC-239`'s first hard wait is met.
> - **The S′ pool (`QE-269-k`):** `ABC-269`'s 7.0 / 10 at E 1 810 joins it. The pool arithmetic is the Architect's, in
>   `ADR-0056` S′ (`arch-post-269` item 3), and is not computed here. § Close-out, the S′ pool row.
> - **QE's other gaps:** `QE-269-f` (LOW, the `G2` margin ≈ one session's spread) and `-g` (INFO, PREREG wording) go
>   to the Architect for `ABC-274`'s PREREG. `-h` (INFO, +2.4–4.5 % ns per node) is a report. `-j` (INFO, the rating
>   tool's environment variables) is the Orchestrator's. `ABC-269`'s Result block lists each one with its owner.
> - **Rows touched:** § Phases (E1, E2-pre, R1); § Success measures (G3); § Tickets (rows 12, 21–26); § Close-out (the
>   S′ pool row); § Owner questions (the `ADR-0064` row); § Dependencies (the Phase 4 order line).

> **E2-PRE CUT AS `ABC-274` (S, P2, DoR 9/10); `ABC-239` (E2) ALIGNED TO `ADR-0067` (PROPOSED); PHASE 4 ORDER; FOUR
> OWNER ITEMS PENDING (`ADR-0067`, Q-3K-7 (a) / (b) / (c), B-T8), 2026-11-03, by BA/PM** (task `bapm-E2pre-cut`,
> records only, at `main` `0b87f2d5`; nothing run). Sources: `ADR-0067` (PROPOSED), the Architect's `arch-ABC-239`
> decision `…e4c34239` (§ 3 the order, § 4 the owner questions, § 5 the owed lines) and results `…48ae6a93`.
> - **`ABC-274` (E2-pre):** every term enters the blend (`ADR-0064` d2's delta form, unchanged; a packed score
>   recommended). It is value-identical at E1's table: the same scores and the same node counts.
>   - Bars (`ADR-0067` d8): node identity, B0's 11 rows plus the 190 cross-build at 0 mismatches; `evaluate` equal
>     under `Object.is`; `G3`; `G2` ≤ 1.05 ×; `G6` "≥ base", graded, because `Q-3K-4` (b) does not apply to a
>     value-identical ticket. BA/PM adds a row that every term's endgame half is blended live. No games.
>   - Waits on `ABC-269`'s merge (held on `ADR-0064` F3). The owner's acceptance of `ADR-0067` gates the merge only.
>     Owed before Ready: the Architect's E2-pre disposition line in `ADR-0067`; the Orchestrator's S2 ruling is open.
> - **`ABC-239` (E2):** the `…e4c34239` § 5 lines are on its page (A1 data per `ADR-0067` d9; A2 cross-entropy
>   < 1.000 × on an opening split; A3 / A4 hold once `ABC-274` merges; A5 / A6 → B-T5–B-T8; intent GAIN; test note 1;
>   `ABC-215` A2's rule rows → a provenance row; dependencies; DoR rows 3, 5, 6 and 10). DoR 8/10, unchanged.
> - **Phase 4 order** (`ADR-0067` § Consequences, adopted): `ABC-269` → `ABC-274` → `ABC-239` → `ABC-270` /
>   `ABC-271`, with `ABC-272` in any order. **Stall clause:** if `ABC-239` stalls on data, `ABC-270` may go first on
>   its rule values, and the tuner traces it in its first pull. `ABC-273` (R1) is read after E1 and before E2 merges.
> - **The king-table finding** (`…48ae6a93` reading 3, information, not a bar): in every fit the king's square tables
>   came out about **3–3.6 × (mg) and 2.2–2.8 × (eg)** heavier than E1's rule-made ones. In other words, the rule
>   tables weight the king about 3 × too lightly. This supports `ABC-270`'s premise, and it suggests that part of
>   E3a's gap is a weight the tuner finds.
> - **Owner items, each PENDING and not assumed** (asked by the Orchestrator 2026-11-03, board): *"accept ADR-0067"*;
>   **Q-3K-7 split** into (a) Lichess CC0 for training (recommended yes), (b) a Stockfish-labelled set (recommended
>   no) and (c) games against Stockfish as data (recommended no); **B-T8**, the 200 + 200 outside pair (≈ 5 h) before
>   `ABC-239` merges (recommended yes). § Owner questions.
> - **Rows touched:** § Phases (E2-pre row new; E2, E3, E4 and E7 rows dated); § Tickets (row 12 dated; row 26 new;
>   rows 22–24 dated; the id line); § Owner questions (Q-3K-7, `ADR-0067`, B-T8); § Dependencies; § Risks
>   (`RISK-EPIC011-12`, new); the "Open owner calls" line. `ADR-0056`'s rows (E2 → `ADR-0067`, Q-3K-7 re-framed,
>   Phase 4) and `ADR-0064`'s d4 / d6 pointers are the Architect's, owed at the next fold, not edited here.

> **`ABC-236` (S1) PARKED: `ADR-0066` PROPOSED, PREMISE NOT MET ON `main`; S1 FIRES AT 100 ms, SO ANY RE-OPEN IS
> GAIN, 2026-11-03, by BA/PM** (task `bapm-ABC-236-park`, records only, at `main` `06d4d0ee`; nothing run). Sources:
> the Architect's `arch-ABC-236` decision `…0886976b` (§ 7, the page lines) and results note `…22d9d55f`; `ADR-0066`
> § Status; the Orchestrator's ruling `…38f865c3` (`orch-2026-10-30a`).
> - **`ABC-236` is parked.** Four forms probed; every one passes the safety gate and misses the pay gate (≤ 0.95×
>   `chooseMove` nodes at d8); the design of record, A100, reads **0.9836 / 0.9913** (F4). *(The `781c11a2` merge
>   message and the board line paired A100 with A25's position-6, "0.9836/0.9619"; the correct pair is 0.9836 /
>   0.9913. Verdict unchanged.)* DoR 9/10, Backlog. The root is already PVS, so the ceiling is about 2 %.
> - **S1 fires at 100 ms** (70.4 % of nodes at 47 000 inside aspiration passes); `ADR-0056` C2′'s depth-gated line is
>   corrected (`arch-adr0056-fold-1103` `…df88abcf`). Intent on any re-open: **GAIN**.
> - **Re-opens on** T1 landing (`ABC-257`) or a deeper shipped search, each under a new PREREG; named, not expected.
>   E1 is not a re-open condition.
> - **Rows touched:** § Phases row S1; § Tickets row 9; § Dedupe audit `ABC-236`; § Dependencies. Next in the owner's
>   2026-11-03 order: `ABC-239` (E2) design (its rows untouched here).

> **`ABC-234` (O3s) PARKED: `ADR-0065` PROPOSED, PREMISE NOT MET ON `main`; THE Q1 STUB RE-STATED (CARRIES `see`
> ITSELF; NEEDS `ADR-0024` d4 OPENED, OWNER ASKED, PENDING); THE Q1 DIAGNOSTIC RECORDED, 2026-11-03, by BA/PM** (task
> `bapm-ABC-234-park`, records only, at `main` `32b807c7`; nothing run). Sources: the Architect's `arch-ABC-234`
> decision `…a4ed96aa` (§ 5, the page lines) and results note `…ffe76d35`; `ADR-0065` § Status and decisions 1–2; the
> Orchestrator's ruling *"ABC-234 PARKED"* and its owner ask (board, 2026-11-03, `main` `32b807c7`).
> - **`ABC-234` is parked.** Every probed form passes the safety gate and misses the pay gate (≤ 0.95× at d8 on four
>   readings); the design of record, S1m, reads `chooseMove` **0.9864 / 0.9548** (F4). A0 is ruled by `ADR-0065`
>   decision 1: `ADR-0024` d4 fences Q1 (SEE pruning in quiescence), not O3s. DoR 8/10 → 9/10, Backlog. Re-opens on one
>   of three named premises (Q1 built first; staged move generation, V3; a time-per-move instrument by the owner's
>   ruling), each under a new PREREG; intent GAIN on any re-open (C2′). § Phases row O3s, § Tickets row 8.
> - **The Q1 stub no longer depends on `ABC-234`.** It carries `see` itself (`ADR-0065` decision 2). It **does** need
>   `ADR-0024` d4 opened, by evidence or by the owner's word: the Orchestrator asked the owner 2026-11-03, and it is
>   **unanswered (pending, `Q-3K-9`)**. Nothing here assumes the answer. The quiescence counters are evidence of cost,
>   not of material lost (`ADR-0065` decision 1), so d4's own condition is not met by them.
> - **The Q1 diagnostic** (`arch-ABC-234`, after the O3s miss; **not pre-registered**; it changes no verdict and is
>   not a reading): quiescence skips `see < 0` captures out of check, over `main` (src `58fa3eb4`): reach 5.837 →
>   6.721, **+0.884 ply** at 47 000 nodes (128 deeper, 1 shallower); d8 nodes **0.22–0.68×** (`search()` 0.6782 /
>   0.3227, `chooseMove` 0.5876 / 0.2239); mate floor 0 / 163, **zugzwang 7 / 7**, `G1` 54 / 58; **drift** at d5
>   96.26 % within 25 cp, **max 69 cp**. The largest single lever any EPIC-011 probe has read (P1 +0.38, O1h +0.09,
>   O3s +0.07). On `main`, 31.3 % of quiescence moves are losing captures and 96.9 % of those are refuted. It needs its
>   own PREREG and an ADR. Whether Q1 is ranked ahead of S1 (`ABC-236`) is the Orchestrator's call (`…a4ed96aa` § 4);
>   this block changes no order.
> - **Rows touched:** § Phases O3s, Q1; § Tickets row 8; § Dedupe audit `ABC-234`; § Owner questions (`Q-3K-9`, new);
>   § Dependencies (`ABC-234` → Q1); the "Open owner calls" line. `ADR-0056`'s rows (O3s, the survey, the `EPIC-010`
>   map, Q1, the dated ranking line) are the Architect's, owed at the next `ADR-0056` fold, not edited here.

> **`QE-269-a` RULED (a); `Q-3K-4` (b)'S SCOPE RULED; THE ARCHITECT'S OWED LINES FOLDED, 2026-11-03, by BA/PM** (task
> `bapm-ABC-269-fold`, records only, at `main` `2c304327`; nothing run). Sources: `arch-ABC-269-rule` `…8ccb561f`
> (decision) and `…1c2ca5ff` (page lines); `ADR-0064` § Decision log; `ADR-0056` D2, D6, D7 (dated 2026-11-03); the
> owner record `orch-2026-10-30a` `…cc7db847`.
> - **Owner:** `ADR-0064` accepted (not in force until `ABC-269` merges) and `Q-3K-4` = (b), both 2026-11-02.
> - **`QE-269-a` ruled (a), no bar moved:** `ABC-269`'s B1 (d) covers a corner king not behind both of its shelter
>   pawns (QE's D1–D6). The castled corner (S1–S3, forecast +13 / +13 / +23) is a report in `ABC-269`'s PR and is
>   **E3's: `ABC-270`'s first graded rows, at ≥ 20 cp.** No PREREG or fixture addendum.
> - **`Q-3K-4` (b)'s scope, ruled by the Orchestrator:** value-changing **evaluation** tickets only. Every other
>   value-changing ticket keeps `G6` "≥ base" binding until a wider reading is recorded. The `UNKNOWN - verify` marks
>   on that scope (top block of 2026-11-03, § The per-change rule) are replaced.
> - **The P1 order line** ("parked after P3") is now also in `ADR-0056` D6, not only D2.
> - Rows touched: § Phases E1, E3; § The per-change rule (`G6` line); § Tickets rows 21, 22; § Dedupe audit
>   `ABC-205`; § Owner questions `Q-3K-4`, `ADR-0064`; the "Open owner calls" line.

> **GAP ANALYSIS AND NEXT CUTS: `ABC-270` (E3a), `ABC-271` (E4a), `ABC-272` (E7a), `ABC-273` (R1); THE OWNER'S
> 2026-11-02 ANSWERS FOLDED (`ADR-0064` ACCEPTED, `Q-3K-4` = (b)); `ABC-263` PAGE DONE, 2026-11-03, by BA/PM** (task
> `bapm-epic011-cut`, records only, at `main` `17725732`; no engine run: one records-only re-classification of the
> `arch-next-pull` / `arch-E1` probe outputs, under the host lock). Source: the owner's *"Analyze and create tickets
> under EPIC-011"* (2026-11-03). The full gap table is the sealed decision note of `bapm-epic011-cut`; this block
> carries what changes on this page.
> - **The owner's answers** (`orch-2026-10-30a` `…cc7db847`, verbatim *"64 yes, Q-3K-4 b"*):
>   - **`ADR-0064` ACCEPTED.** `ABC-269`'s B8 and merge follow the build and QE. § Owner questions, § Tickets row 21.
>   - **`Q-3K-4` = (b):** value-changing **evaluation** tickets are judged on play (C2′) with `NFR-005`'s depth-6 floor
>     and the depth-7 WARN; `G6` "≥ base" is **reported, not graded** for them. Other value-changing tickets keep
>     "≥ base" until a ruling says otherwise (~~`UNKNOWN - verify`;~~ the Architect folds the scope into `ADR-0056`,
>     `arch-ABC-269-rule`). § The per-change rule, § NFR triggers, `RISK-EPIC011-10`. *2026-11-03
>     (`bapm-ABC-269-fold`): ruled: the scope stays evaluation tickets (`Q-3K-4` (b)'s scope: the Orchestrator's ruling 2026-11-03, brief `bapm-ABC-269-fold`, on the owner record `orch-2026-10-30a` `…cc7db847`; `ADR-0056` D7 dated 2026-11-03).*
>   - **`QE-269-a`** (E1's castled-corner endings, +13 / +13 / +23 cp against B1 (d)'s 20): ~~**placeholder**, the
>     Architect rules it in parallel (`arch-ABC-269-rule`); `ABC-269`'s page carries the marked effect for each answer.~~
>     *2026-11-03: ruled (a) (`…8ccb561f`); B1 (d) on D1–D6, S1–S3 a report and `ABC-270`'s first graded rows.*
> - **The re-classification** (sealed observation of this task; script and output in its `raw/`):
>   - **22 of the 145 probe positions are exact duplicates** (games n and n + 200 replay the same opening
>     deterministically). On the **123 unique**, 38 errors of ≥ 50 cp at 47 000 nodes, **25 persist at 188 000
>     (65.8 %)**: the "evaluation is the bigger lever" reading holds. After 60 plies it is 8 of 10 (not 11 of 13).
>   - **E1's chosen form fixes 1 of the 25.** 22 of the 25 sit at phase ≥ 7, 14 with queens on, 8 with a passed pawn,
>     3 at phase ≤ 6. `ADR-0064` d9's "the king and the passers are where the instrument's surviving errors sit" is
>     not supported by this corpus; E1's GAIN is still decided by B8, not by this.
> - **Gap ranking of the uncut items** (evidence-backed expected gain per host hour; every strength item costs about
>   0.8 h of host for its read, so the order is expected Elo × the strength of its premise; estimates, not readings):
>   1. **E3a, king safety by phase + the queen scale → `ABC-270`** (M, P2): game 1 (35 vs 360 cp), `QE-269-a`, 14 of 25
>      persistent errors with queens on; `ABC-205` died on `G6` cost alone, which (b) no longer grades; forms and owner
>      levels exist. +15–50.
>   2. **E4a, passers that read the kings and the path → `ABC-271`** (M, P3): rules the tuner cannot create; 8 of 25
>      with a passer (weak). +10–30.
>   3. **E7a, mop-up and drawish scaling → `ABC-272`** (M, P3, premise-gated): no tablebases; the corpus has no
>      pawnless win, so a pre-registered probe decides each half first. +10–30.
>   4. **Q2, delta pruning** (stub, not cut): `ADR-0024`'s 1.3–1.5 × quiescence trim was read on a 2026-08 base; a
>      re-measure on `main` is owed before a cut; a search item, which the probe ranks below evaluation.
>   5. **E3b (king-zone attackers), E5, E6** (stubs, not cut): weights from the tuner (`ABC-207`'s hand weights lost,
>      −18.3 ± 16.5); ids at E2's merge.
>   6. **O1-e and lazy evaluation** (recorded, not cut): cost cuts worth ≈ 1.02–1.05 × / `UNKNOWN - verify`; re-read when
>      E2's two-accumulator form makes the evaluation costlier (§ Phases, "Not cut, recorded").
>   - **Ahead of all of them, already ticketed:** `ABC-269` (E1, in development) and `ABC-239` (E2, the largest block,
>     design owed after `ABC-234` and `ABC-236` by the owner's 2026-11-03 order). Not duplicated.
>   - **A reading, ranked apart: R1 → `ABC-273`** (S, P3), after E1 merges and before the next evaluation merge; the
>     control is owed (R1–R3's survival, `UNKNOWN - verify`).
> - **Premises flagged** (no item re-opened): `ADR-0064` d9's error-location rationale (above); the E3 stub's
>   "`Q-3K-4` (`G6`)" wait (dissolved by (b)); X2's "after T1" (T1 closed on F4: the wait names a premise that no longer
>   exists; re-stated at X2's refinement); W1's "after the thread strand" (the strand is parked: moot, W1 waits on
>   nothing but its own design); P4's route (O1h parked). Already recorded and unchanged: P2, P1, O1h, joint O1h + P1,
>   P6 on today's evaluation, T1, the T3 rationale, the threads gain.
> - **`ABC-263` reads Done** (page drift; Done on the board 2026-11-01, `qe-ABC-263` `…f9116735`). § Tickets row 15.

> **E1 CUT AS `ABC-269` (DoR 10/10, READING (b)) AND PULLED FORWARD; `ABC-231` AND `ABC-232` CLOSED AS FOLDED;
> PHASE 2 CLOSED; R1 AFTER E1; TWO OWNER QUESTIONS (`ADR-0064`, `Q-3K-4`); `ABC-265` AND `ABC-255` PAGES DONE,
> 2026-11-02, by BA/PM** (task `bapm-E1-cut`, records only, at `main` `2bef4d31`; nothing run). Sources: `ADR-0064`
> (PROPOSED, `arch-E1` `…01c2d6a5`, `…c524a01d`, `…d8150777`; merged `6e11bd97`), `arch-next-pull` `…7e3ace66`, and the
> Orchestrator's rulings on the board (2026-11-02: *"Phase 2 closed (P5 deferred, ≈ 0 at 100 ms); R1 reading deferred
> to after E1 (saves host time); next pull E1 (full taper, ABC-231/232 folded)"*).
> - **`ABC-269` (E1, the full taper): cut, size M, P2, intent GAIN.** One linear phase; every term a middlegame /
>   endgame pair in one data-only table (`src/evaluate-params.ts`, E2's seam); at E1 only the king's endgame half
>   (40 − 15 m) and the passers' (2 × by rank) differ; one switch `taper` and three test-only doors. Rows B0–B8 carry
>   `ADR-0064` d8 with the probe figures: B0 exact node counts (`chooseMove` kiwipete d8 1 296 788 / d9 2 733 330,
>   position-6 d8 404 930 / d9 926 005 / d10 1 692 669; `search()` d8 839 514 / 1 533 901), B1 relations (exact at
>   phase 24, king ≥ 20 cp on 6 frozen endings, passers ≥ 1.5 × / exact / ≤ 1.25 ×), B2 mate floor 0, B3 zugzwang
>   7 / 7, B4 `G1` ≥ 54 / 58, B5 the `ADR-0061` audit, B6 `G2` ≤ 1.05 ×, B7 `G6` by `Q-3K-4`, B8 C2′ GAIN, S′ at
>   E 1 810, Levels. **DoR 10/10 on reading (b):** the build may start; B8 and the merge wait on the owner's acceptance
>   of `ADR-0064`; B7 is graded once `Q-3K-4` is answered. § Phases (Phase 4), § Tickets row 21.
> - **E1 is pulled forward** ahead of Phase 3 and the rest of Phase 2, by `ADR-0056` D6's reorder rule and on measured
>   evidence (65 % of the ≥ 50 cp errors survive two node doublings; `…d0f1a5fc`). A delivery call: the owner is told,
>   not asked.
> - **`ABC-231`: closed as merged into `ABC-269`. `ABC-232`: closed as merged into `ABC-269` (phase scaling) and E4
>   (any other passer term). `ABC-205` stays dropped.** Each folded row's new home is on `ABC-269`'s page. § Tickets
>   rows 10 and 11; § Phases E4.
> - **Phase 2 is closed** (the Orchestrator's ruling): P3 done, P2 dropped, P1 parked, **P5 deferred** (≈ 0 at 100 ms);
>   P4 and P6 stay stubs. **R1 is read after E1**, not at Phase 2's close. § Phases.
> - **Owner questions** (§ Owner questions): *"accept ADR-0064"* or *"decline it"* (default: no taper; blocks only
>   B8 and the merge), and **`Q-3K-4`, now live** (default "≥ base" binds; the Architect recommends judging on play;
>   blocks only B7's grading). The Orchestrator has put both to the owner (board).
> - **Page drift fixed:** `ABC-265` reads Done (merged `605874b8`, § Tickets row 17) and `ABC-255` reads Done (merged
>   `87484808`, row 1). Front matter and a dated block each; no row or bar moved.

> **`ABC-268` (P3) DONE, THE FIRST PHASE 2 GAIN; P1 STAYS PARKED AFTER P3; S′ RE-PINNED TO E 1 810 WITH AN EMPTY POOL;
> `ABC-233` (O1h) PARKED ON `ADR-0063`'S F4; THE THREAD STRAND PARKED BY THE OWNER, 2026-11-02, by BA/PM** (task
> `bapm-records-1102c`, records only, at `main` `a6039c5b`; nothing run). Sources: the Orchestrator `…77a82ec1`,
> `…8ce2fd23`, `…773be7de` and the board (2026-11-02, *"ABC-233 parked"*); the Architect `arch-post-268` `…1bc554fb`
> and `arch-ABC-233` `…f3a4dac0`; QE `qe-ABC-268-p2` `…186a743e`.
> - **`ABC-268` (P3, futility pruning): Done.** Merged to local `main` at `e72487e1` on the owner's *"61 yes"*. A6
>   **58.0 / 100** (W / D / L 41 / 34 / 25, +56.1 ± 56.1 Elo, LOS 97.6 %, 0 time losses), S′ 8.0 / 10 at E 1 650, Levels 57 / 57;
>   post-merge `npm test` 2 429 / 2 429. QE PASS_WITH_GAPS signs UAT. `ADR-0061` is in force. § Tickets row 20.
> - **P1: parked after P3.** Its re-measure trigger fired on the merge. On the new `main`, `ADR-0060` decision 1 missed
>   three bars: A4 (a) (`chooseMove` position-6 0.8528 > 0.85), A3's 27 cp cap (63 cp) and zugzwang 7 / 7
>   (`zugzwang.004`). The 27 cp question is moot (the Orchestrator, `…8ce2fd23`). § P1, parked.
> - **S′ is now E 1 810, and its pool is empty.** The E 1 650 pool closed at 26.0 / 30 = 86.7 % and fired the upward
>   re-pin. The rule as written gave E 1 980. The Orchestrator ruled the band-centre step instead (`…8ce2fd23`), and the
>   Architect wrote it into `ADR-0056` S′: E′ = E + X − 168.4 = 1 650 + 325.2 − 168.4 → **1 810**. The 1 980 pool never
>   opened. **Command:** `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5
>   --concurrency 1`. `r`'s default in code stays 1 650, so a run without `--elo 1810` does not pool. Every open
>   strength ticket's S′ line now reads `--elo 1810` (`ABC-231`, `232`, `233`, `234`, `236`, `237`, `239`, `257`, `258`,
>   `266`). § The per-change rule, § Close-out, C10.
> - **`ABC-233` (O1h, the history heuristic): parked.** `ADR-0063` is PROPOSED with its premise not met on `main`:
>   every form misses the pay gate (design of record at d8: 1.0011 / 0.7970 / 0.9751 / 0.9832 against ≤ 0.95× on
>   four), so F4 fired and the build does not start. The Orchestrator parked the ticket. DoR 9/10; `NFR-009` 32 KiB; its
>   A3 is superseded by `ADR-0063` decision 9. **O1h is no longer a standalone first pull in Phase 3.** The Orchestrator's
>   `arch-next-pull` ranks a joint history + LMR probe against the other candidates. § Phases, § Tickets row 7.
> - **The thread strand: parked** (the owner, *"park threads"*, `…773be7de`). `ABC-266` is parked, `ADR-0062` stays
>   PROPOSED and not in force, and the product stays at `Threads 1`. `ABC-265` (TH-1) merged on its own (`605874b8`).
>   § Phases, § Scope, § Tickets row 18, § Owner questions.
> - **Owner questions:** `ADR-0061` and the `ADR-0025` amendment are answered yes; `ADR-0062` and the `THREADS_DEEP`
>   cores are moot while threads are parked; the 27 cp cap is moot. § Owner questions.

> **P3 CUT AS `ABC-268` (DoR 10/10, READING (b)); PHASE 2 RE-ORDERED; OWNER QUESTION "ACCEPT ADR-0061"; `ABC-266`'S
> D12 PROBE READ MISS AND `RISK-EPIC011-09` IS REALISED, 2026-11-02, by BA/PM** (task `bapm-P3-page`, records only, at
> `main` `6413f91f`; nothing run). Sources: `ADR-0061` (PROPOSED, `arch-phase2-p3` `…004b35ed`, `…55f7725e`,
> `…e8bec702`; merged `2f9c32f4`), `ADR-0056` D2's dated line of 2026-11-02, the Orchestrator's ruling *"P3 ahead of
> parked P1"* (board), and `qe-ABC-266-d12` `…9f9aeb87` / `…cc1de664` (merged `3105a5b0`).
> - **`ABC-268` (P3, futility pruning): cut, size S, P2, intent GAIN.** At null-window nodes of remaining depth 1–3,
>   not in check and outside the mate band, with `evaluate + 150 / 350 / 550 ≤ alpha`, quiet non-checking moves after
>   the first are skipped, in both recursions, behind `searchWithoutFutility` / `chooseMoveWithoutFutility`. Rows
>   A1–A6 carry `ADR-0061` d4–d10, including the cut audit A3 (d) with its exact counts (2 943 sampled: 1 918 / 966 /
>   59, 0 flips) and A4's (888 786 / 1 262 046 / 1 306 981 / 391 451; reach 5.558 → 5.837). **DoR 10/10 on reading
>   (b):** the build may start; A6 and the merge wait on the owner's acceptance of `ADR-0061`. § Tickets row 20.
>   - It shares `src/search.ts` and `src/engine.ts` with the parked P1. Whichever merges second re-reads its door
>     counts on the new `main`.
> - **Phase 2 order** (`ADR-0056` D2's dated line, a suggestion the Orchestrator has taken for P3): **P3 (`ABC-268`)
>   now → P1 if the owner's cap answer and its re-measure make it green → P5 (NEUTRAL, with a deep-depth bar) → P4
>   after O1h (`ABC-233`) → P6 not before E1 / E2.** § Phases carries it; P4's dependency is now O1h, not P1.
> - **Owner question, new:** *"accept ADR-0061"* or *"decline it"*. Default: no futility on `main`. It blocks only
>   `ABC-268`'s A6 and merge. § Owner questions.
> - **`ABC-266` (TH-2): the D12 probe read MISS, not loaded.** Median played depth at 100 ms: 7 at `Threads 1`, 4 and
>   12; the 12 workers finished the same depth in 19 of 20 searches. **Development is blocked** until the Architect's
>   re-proposal (`arch-ABC-266-repropose`, queued) and the page's re-cut. **`RISK-EPIC011-09` is realised.** § Tickets
>   row 18; § Risks.
> - **`ABC-265`'s page no longer cites `ABC-267`:** its three pointers (§ Out of scope, A2's verified-copy row, test
>   note 3) now read `ABC-266` A8. No row or bar changes.

> **`ABC-266` ALIGNED TO `ADR-0062`; `ABC-267` CLOSED AS FOLDED INTO IT; TWO OWNER QUESTIONS; THE THREAD GAIN IS
> UNSUPPORTED UNTIL THE D12 PROBE, 2026-11-02, by BA/PM** (task `bapm-ABC-266-rows`, records only, at `main`
> `09306a14`; nothing run). Sources: `ADR-0062` (PROPOSED, `arch-ABC-266`, merged `a3a300e0`), the Architect's notes
> `…4f828986` and `…0c8cf7d0`, and the Orchestrator's ruling *"ABC-267 folds into ABC-266"* (board, 2026-11-02).
> - **`ABC-266` (TH-2): DoR 9/10, Backlog.** The page carries every item on the Architect's BA/PM list: the `adr:` line,
>   scope 4 as `ADR-0062` D1–D9 (the deepest completed iteration is played), M = N = 12, A1's refusal and
>   constructor-count rows, A3/A5/A8 in `THREADS_DEEP`, A4's fake-pool rows, A6's `G8` at zero real-worker rows, scope 5
>   (`d --threads N`) with A7's exact command, the NFR triggers, and the dependencies. Size L, about 20–45 h.
>   - **Row 10 waits only on `ABC-265`'s merge.** The pull into Development also waits on the D12 timing probe
>     (`qe-ABC-266-d12`). The merge waits on the owner's acceptance of `ADR-0062` and on A7. § Tickets row 18.
> - **`ABC-267` (TH-3): closed as folded into `ABC-266`** (`ADR-0062` D13). Its rows join `ABC-266`'s acceptance, with
>   the probe-then-cutoff case added. Its 2^10-slot seam is dropped, and its default-lane row is settled at zero. Page
>   `status: done`, `column: Done`, with a `closed:` line reading folded. § Tickets row 19.
> - **Two owner questions** (§ Owner questions): accept `ADR-0062` with max 12, with max 8, or decline; and may the
>   opt-in `THREADS_DEEP` lane run an engine child on up to M cores with the host ALONE. Neither blocks the build.
> - **New risk `RISK-EPIC011-09`:** the design probe found that helpers barely shorten worker 0's path to a depth, so
>   the +55 to +150 Elo estimate for threads is unsupported until the D12 probe and A7 read.

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
>   or the Architect says whether R1–R3 survive (`UNKNOWN - verify`). *2026-11-03 (`bapm-R1-cut`): **ruled**, so
>   this item is no longer open. R1–R3 survive on C4's 100 ms reading (`arch-post-269` `…8136b589`; `ADR-0056` D6's
>   dated line). G2 no longer waits on a ruling, and its targets stay* [proposed]*.*
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
> - **Open owner calls:** ~~Q-3K-2, Q-3K-3, Q-3K-4,~~ Q-3K-6, Q-3K-7, Q-3K-8 ~~and Q-SP-3~~ (§ Owner questions; Q-SP-3
>   answered yes 2026-11-01). *2026-11-03 (`bapm-ABC-269-fold`): Q-3K-2 and Q-3K-3 answered 2026-11-01, Q-3K-4
>   answered (b) 2026-11-02 (§ Owner questions); Q-3K-6, Q-3K-7 and Q-3K-8 stay open.* *2026-11-03
>   (`bapm-ABC-234-park`): **Q-3K-9** (open `ADR-0024` d4 for Q1) asked 2026-11-03, pending.* *2026-11-03 (`bapm-E2pre-cut`):* **`ADR-0067`
  acceptance, Q-3K-7 (a) / (b) / (c) and B-T8** asked 2026-11-03, each pending.
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
| **2, pruning and reductions** *(~~NEXT, 2026-11-02~~ **CLOSED 2026-11-02**, the Orchestrator's ruling (board): P3 done, P2 dropped, P1 parked, P5 deferred; P4 and P6 stay stubs; `bapm-E1-cut`)* | P2 | ~~*stub:*~~ **`ABC-264`** reverse futility (static null move) | ~~title only~~ full page (new, `bapm-phase1-pause`) | top expected Elo per cost (`ADR-0056` D2); acts at remaining depth 1–3, so the 100 ms read sees it. *2026-11-02: first of Phase 2, the ruling's next ticket; ~~owes its ADR~~ `ADR-0059` PROPOSED (`arch-ABC-264`): 120 cp a ply, depth 1–3, null-window; A4 ≤ 0.75× both recursions; DoR 10/10 (reading (b)), In Development (`bapm-ABC-264-rows`)* *2026-11-02 (`bapm-threads-cut`): `ADR-0059` **ACCEPTED** ("R yes"); A6 and the merge no longer wait on the owner* *2026-11-02 (`bapm-ABC-265-rows`): **A6 NOT MET** (44.0 / 100, `qe-ABC-264-p2` `…4a487d20`); not merged (`ADR-0059` F5); Blocked, closed-not-merged, pending the Architect's retry ruling* *2026-11-02 (`bapm-phase2-records`): **DROPPED from Phase 2.** The retry ruling is DROP (`arch-phase2-rebase` `…f9f440c9`); `ADR-0059` accepted, not in force; `ABC-264` closed as dropped, not merged; a re-cut is a new ticket with a named new premise* |
| 2 | P3 | ~~*stub:*~~ **`ABC-268`** futility pruning near the leaves: late quiet moves skipped at null-window nodes of remaining depth 1–3, margins 150 / 350 / 550 cp | ~~title only~~ full page (new, `bapm-P3-page`) | ~~after P2~~ *2026-11-02: P2 dropped, so no wait. P1's re-measure is triggered when P3 merges. Next pull is the Orchestrator's (`arch-phase2-p3` queued)* *2026-11-02 (`bapm-P3-page`): **first in the order** (`ADR-0056` D2's dated line; the Orchestrator's ruling "P3 ahead of parked P1"). `ADR-0061` PROPOSED: 0.79–0.83× at depth 8 both recursions, +0.279 ply at 47 000 nodes, every safety row clean (audit 0 of 2 943); intent GAIN; DoR 10/10 (reading (b)): build may start, A6 and merge on the owner's acceptance. Shares `src/search.ts` / `src/engine.ts` with P1: the second to merge re-reads its door counts* *2026-11-02 (`bapm-records-1102c`): **DONE**, merged `e72487e1` (A6 58.0 / 100, GAIN met; S′ 8.0 / 10; Levels 57 / 57; `ADR-0061` in force)* |
| 2 | P1 | ~~*stub:*~~ **`ABC-284`** LMR by a log table of depth × move index~~, history-adjusted~~ (amends `ABC-121`'s flat 1-ply LMR, `ADR-0026`) *(2026-11-02: "history-adjusted" struck by `ADR-0060` d11; the history term waits for O1h)* | ~~title only~~ full page (new, `bapm-epic011-areas`); ***parked*** *(§ P1, parked, below)* | *2026-11-02 (`bapm-phase2-records`): first in the order (`ADR-0056` D2's dated line). **PARKED on `main`**: in the `ADR-0060` re-open, no form in the pre-registered set of nine meets every bar (`…e17a23f4`). Re-measured after P3 merges or after O1h* *2026-11-02 (`bapm-P3-page`): **second**, after P3 (`ADR-0056` D2's dated line): "P1 if the owner's cap answer re-opens it green". Its re-measure trigger is `ABC-268`'s merge or O1h* *2026-11-02 (`bapm-records-1102c`): **parked after P3.** Re-measured on `main` with futility (`arch-post-268` `…1bc554fb`): decision 1 misses A4 (a) (0.8528), the 27 cp cap (63 cp) and `zugzwang.004`. O1h is parked too, so the trigger left on record is a new named premise with its own probe (`ADR-0063` decision 11's joint history + LMR probe is the one being ranked)* *2026-11-04 (`bapm-epic011-areas`; owner `…4c4cb03d` ruling 3): **cut as `ABC-284`** (S–M, P2, DoR 9/10, Backlog, **parked**). The bars stay `ADR-0060`'s, by reference. Re-open trigger unchanged: a new named premise with its own pre-registered probe. Named: E1's tree (on `main` since `54dee3f2`; no P1 re-probe on it is on record, `UNKNOWN - verify`), `ABC-283` merging (history on `main`), E2's second pull* *2026-11-04 (`bapm-ABC-283-done`): `ABC-283` merged `58e90d07`, so the history premise (2) is on `main`; P1 stays parked until the Architect re-opens it. Read R-283-LMR first (`ADR-0060` § Status, 2026-11-04)* |
| 2 | P5 | ~~*stub:*~~ **`ABC-285`** null move whose R grows with depth and eval margin (amends `ADR-0050`; `ABC-208`'s fixed R = 3) | ~~title only~~ full page (new, `bapm-epic011-areas`) | *2026-11-02 (`bapm-P3-page`): **third** (`ADR-0056` D2's dated line). A NEUTRAL (invisible at 100 ms) candidate with a deep-depth bar: clean but depth-gated, +0.06 to +0.09 ply at 47 000 nodes (`ADR-0061` § Context)* *2026-11-02 (`bapm-E1-cut`): **deferred**, and Phase 2 closed without it (the Orchestrator's ruling, board). Its value at 100 ms is ≈ 0 (`arch-next-pull` `…7e3ace66`: 0.88–0.95×, +0.06 ply; its read can only show "no harm"). It stays a stub with no id* *2026-11-04 (`bapm-epic011-areas`): **cut as `ABC-285`** (S, P3, DoR 9/10, Backlog, **deferred**). Intent NEUTRAL (invisible at 100 ms), as `ADR-0056` D2 names it; the `ADR-0050` amendment with its deep-depth bar is owed (the owner accepts an amendment of an accepted ADR)* |
| 2 | P4 | ~~*stub:*~~ **`ABC-286`** late-move (move-count) pruning | ~~title only~~ full page (new, `bapm-epic011-areas`) | ~~after P1~~ *(2026-11-02: so it waits while P1 is parked)* *2026-11-02 (`bapm-P3-page`): **fourth, after O1h (`ABC-233`)**, not after P1 (`ADR-0056` D2's dated line). Without a quiet-move order it prunes generation-order moves: drift 87.7–89.3 % within 25 cp and 11.5–11.9 % audit flips with piece-sized errors (`ADR-0061` § Alternatives)* *2026-11-02 (`bapm-records-1102c`): O1h is parked (`ADR-0063` F4), so P4 waits on a joint probe that takes history as its input, not on `ABC-233` alone (`ADR-0063` decision 11)* *2026-11-04 (`bapm-epic011-areas`): **cut as `ABC-286`** (S, P3, DoR 9/10, Backlog, **held**). Re-opens when `ABC-283` merges (history on `main`) and a joint probe with history as its input meets every bar; on an `ABC-283` miss it stays held. The ADR is owed* *2026-11-04 (`bapm-ABC-283-done`): `ABC-283` merged `58e90d07`: **unheld for its probe**; held on the joint probe and the ADR* *2026-11-04 (`bapm-lines-1104b`): **`ADR-0072` PROPOSED, premise not met** (`arch-bundle-1` `…37b7fb23`: form M3, L2 missed, F1 fired). Held on OQ-0072-1; the build does not start without the owner's word* *2026-11-04 (`bapm-bundle-1-cut`): **`ADR-0072` ACCEPTED over a missed premise** (OQ-0072-1, (a), `…3e73f9f9`), form M3, F1 stays fired, not in force. **Built and read as `ABC-303`,** with O2c; `ABC-286` stays the design page* |
| 2 | P6 | ~~*stub:*~~ **`ABC-287`** razoring | ~~title only~~ full page (new, `bapm-epic011-areas`) | ~~after P2~~ *2026-11-02: P2 dropped, so no wait* *2026-11-02 (`bapm-P3-page`): **last, not before E1 / E2** (`ADR-0056` D2's dated line). Rejected on today's evaluation: loses `zugzwang.004`, drifts up to 345 cp, 1.4–2.0 % audit flips with one missed mate (`ADR-0061` § Alternatives)* *2026-11-04 (`bapm-epic011-areas`): **cut as `ABC-287`** (S, P3, DoR 9/10, Backlog, **held**). Re-measured by the Architect after E2's second pull merges, on the rows it failed (zugzwang, drift, audit, mate); fails again → dropped* |
| — | reading | **R1**, milestone reading on the routine control | (a QE reading; ~~ticket cut when Phase 2 closes~~ *read after E1*) | `ADR-0056` D6 item 7. *2026-11-02 (`bapm-E1-cut`): **deferred to after E1** (the Orchestrator's ruling, board: it saves host time). No ticket yet* *2026-11-03 (`bapm-epic011-cut`): **cut as `ABC-273`** (S, P3, DoR 9/10): 200 games at 100 ms against Stockfish at the band-rule E (C4's shape), after `ABC-269` merges and before the next evaluation merge; the control ruling is owed (R1–R3's survival)* *2026-11-03 (`bapm-269-done`): `ABC-269` merged, so R1's window is open (before `ABC-239` merges; `ABC-274` changes no value). The control ruling is the Architect's, in flight (`arch-post-269` item 4)* *2026-11-03 (`bapm-R1-cut`): **control ruled**: R1–R3 survive on C4's 100 ms reading (`…8136b589`; `ADR-0056` D6). The command needs **`ABC-275`** first (`r --budget-ms 100`, Stockfish `st=0.1`; `tools/` only, S, P2, Ready). `ABC-273` is DoR 10/10 and held in Backlog until `ABC-275` merges. It runs before the next value-changing merge (the Orchestrator's ruling), in about 0.4–0.9 h (estimate; not asked unless over 1 h or E steps)* *2026-11-03 (`bapm-sec-cut`, R1-A4): **READ, `ABC-273` Done** (merged `20d539e1`; QE `…07b3c794`): on `main` `85a304ff`, 99.0 / 200 (49.5 %) against Stockfish 19 at E 1 810, Elo −3.5 ± 47.4, **X = 1 806.5 ± 47.4** (opening-cluster ± 48.4); 0 faults, 0 time losses, 0.59 h; E confirmed, no step. **Highest milestone met: none.** Its own scale: never compared with the 4 s ≈ 2 074, never pooled into S′* |
| **threads** *(2026-11-02, `ADR-0057`; owner OQ-1 yes)* | TH-1 | **`ABC-265`** one lockless shared table: four `Uint32` words a slot over a `SharedArrayBuffer`, XOR check, 2^18 slots, 4 MiB, node-equal at `Threads 1` | full page (new, `bapm-threads-cut`) | after Phase 2 and R1, before Phase 3; **may be pulled beside Phase 2 by width** (edits only `src/transposition.ts`, which no Phase 2 ticket edits; value-identical, so it stales no C2′ read). ~~Owes its `ADR-0025` amendment (the owner's when written)~~ *2026-11-02 (`bapm-ABC-265-rows`): the amendment is written, PROPOSED (`arch-ABC-265`); DoR 10/10 (reading (b)); no S2 reading (the Orchestrator's ruling)* |
| threads | TH-2 | **`ABC-266`** a Lazy SMP worker pool behind a UCI `Threads` option, default 1; read once, `Threads N` against `Threads 1`, labelled a hardware gain | full page (new) | after `ABC-265`; ~~owes its ADR amending `ADR-0044` D3 and D5 (D5's reversal pre-accepted)~~. The only `Threads N` read; every phase read stays `Threads 1` against `Threads 1` (OQ-2 (a)). *2026-11-02 (`bapm-ABC-266-rows`): `ADR-0062` written, PROPOSED (`arch-ABC-266`); deepest completed iteration played; M = N = 12; `ABC-267` folded in; DoR 9/10 (waits on `ABC-265`'s merge); the D12 timing probe before Development; the merge on the owner's acceptance and A7* *2026-11-02 (`bapm-P3-page`): **D12 read MISS** (7 against 7 at 100 ms, not loaded, `…9f9aeb87`); Development blocked until the Architect's re-proposal (`arch-ABC-266-repropose`) and the page's re-cut* *2026-11-02 (`bapm-records-1102c`): the re-proposal found no win (`…b6305641`); **PARKED by the owner** ("park threads", `…773be7de`); `ADR-0062` PROPOSED, not in force; `Threads` stays 1* |
| threads | TH-3 | **`ABC-267`** multi-worker property rows, the torn-entry stress, `NFR-009` summed over workers, the default lane's wall (test-only) | full page (new) | after `ABC-266`, or folded into it (the Orchestrator's call). **All three land before W1 and any 40/15 reading** *2026-11-02 (`bapm-ABC-266-rows`): **folded into `ABC-266`** (the Orchestrator's ruling, `ADR-0062` D13); page closed as folded. The strand is now two tickets, and both land before W1 and any 40/15 reading* |
| **3, ordering** | O1h | `ABC-233` history heuristic after the killers | full page (moved in) | *2026-11-02 (`bapm-records-1102c`): **parked**, no longer a standalone first pull. `ADR-0063` PROPOSED, premise not met on `main` (every form misses ≤ 0.95× at d8; the killers hold 90 % of quiet cutoffs); the Orchestrator's ruling. It re-opens on a new named premise: a joint P1 / P4 probe with history as input, an ordering change that leaves more cutoffs to history (O2c, V3), or a depth-gated instrument (`ADR-0063` § Status)* *2026-11-04 (`bapm-W1-bundle-cut`; owner `…4c4cb03d` ruling 2): **re-opened by the owner's word as part of `ABC-283`** (the O1h + O3s + S1 bundle, one branch `grugops/ABC-283`, each behind its own ADR door plus one all-off door), over the three not-met premises. Bars: P0 all-off node counts equal `main` exactly; `ADR-0064` d7's safety rows (mate floor, zugzwang 7 / 7, `G1` none newly missed); `NFR-008` ≤ 10 s. Then ONE read: 100 games at 100 ms, bundle against `main`, GAIN ≥ 50.0, PREREG sealed first, never re-played. Pass: merged, `ADR-0063` / `ADR-0065` / `ADR-0066` accepted as a bundle. Miss: not merged, the three stay parked. This page stays the design page* *2026-11-04 (`bapm-ABC-283-done`): **accepted as a bundle, delivered by `ABC-283`** (merged `58e90d07`; QE PASS_WITH_GAPS `…de1dc511`, C2′ 59 / 27 / 14 = 66.0 / 100, Elo +115.2 ± 67.0). `ADR-0063` (with K3) / `ADR-0065` / `ADR-0066` ACCEPTED 2026-11-04, in force at the merge; the premise was overridden, not met. The ticket is Done* |
| 3 | O2c | ~~*stub:*~~ **`ABC-288`** countermove ~~and continuation history~~ | ~~title only~~ full page (new, `bapm-epic011-areas`) | after `ABC-233` *(2026-11-02: `ABC-233` parked; O2c builds on its table, so it waits with it unless a re-open names O2c itself as the premise, `ADR-0063` § Status 2)* *2026-11-04 (`bapm-epic011-areas`): **cut as `ABC-288`** (M, P3, DoR 9/10, Backlog, **held**). O1h is inside `ABC-283` now: re-opens when `ABC-283` merges, or, on a miss, if the Architect names O2c as O1h's re-open premise (`ADR-0063` § Status 2)* *2026-11-04 (`bapm-ABC-283-done`): `ABC-283` merged `58e90d07`: **unheld for its probe** (re-open (a)); held on the probe and the ADR* *2026-11-04 (`bapm-lines-1104b`): **`ADR-0073` PROPOSED, premise not met** (`arch-bundle-1` `…37b7fb23`: form C1, CH3 missed, F1 fired). Held on OQ-0073-1; the build does not start without the owner's word* *2026-11-04 (`bapm-bundle-1-cut`): **`ADR-0073` ACCEPTED over a missed premise** (OQ-0073-1, (a), `…3e73f9f9`), form C1, the countermove alone, F1 stays fired, not in force. **Built and read as `ABC-303`,** with P4; `ABC-288` stays the design page* |
| 3 | O3s | `ABC-234` SEE orders captures, ordering only | full page (moved in) | *2026-11-03 (`bapm-ABC-234-park`): **parked: `ADR-0065` premise not met on `main`** (S1m `chooseMove` d8 0.9864 / 0.9548 > 0.95; every form safe); the Orchestrator's ruling. A0 ruled (`ADR-0065` decision 1: d4 fences Q1, not O3s). Re-opens on a named premise: Q1 built first, staged move generation (V3), or a time-per-move instrument (`ADR-0065` § Status); intent GAIN* *2026-11-04 (`bapm-W1-bundle-cut`; owner `…4c4cb03d` ruling 2): **re-opened by the owner's word as part of `ABC-283`** (the O1h + O3s + S1 bundle, one branch `grugops/ABC-283`, each behind its own ADR door plus one all-off door), over the three not-met premises. Bars: P0 all-off node counts equal `main` exactly; `ADR-0064` d7's safety rows (mate floor, zugzwang 7 / 7, `G1` none newly missed); `NFR-008` ≤ 10 s. Then ONE read: 100 games at 100 ms, bundle against `main`, GAIN ≥ 50.0, PREREG sealed first, never re-played. Pass: merged, `ADR-0063` / `ADR-0065` / `ADR-0066` accepted as a bundle. Miss: not merged, the three stay parked. This page stays the design page* *2026-11-04 (`bapm-ABC-283-done`): **accepted as a bundle, delivered by `ABC-283`** (merged `58e90d07`; QE PASS_WITH_GAPS `…de1dc511`, C2′ 59 / 27 / 14 = 66.0 / 100, Elo +115.2 ± 67.0). `ADR-0063` (with K3) / `ADR-0065` / `ADR-0066` ACCEPTED 2026-11-04, in force at the merge; the premise was overridden, not met. The ticket is Done* |
| 3 | Q1 | *stub:* SEE pruning of losing captures, in quiescence and the main search | title only | ~~after `ABC-234`~~; was fenced out of `EPIC-010` *2026-11-03 (`bapm-ABC-234-park`): **carries `see` itself** (`ADR-0065` decision 2; no longer waits on `ABC-234`); **needs `ADR-0024` d4 opened**, by evidence or the owner's word (`Q-3K-9`, asked 2026-11-03, **pending**). Diagnostic (quiescence half only, not pre-registered): +0.884 ply reach, d8 0.22–0.68× nodes, zugzwang 7 / 7, drift max 69 cp (top block). Needs its own PREREG and ADR* *2026-11-03 (`bapm-owner-answers-1103`): **Q-3K-9 answered yes** (`…af126c04` item 6): `ADR-0024` d4 is open for Q1's **design** only (its dated line); a build ships on its own evidence (C2′ 100 games at 100 ms, with S′ and the Levels lane); delta pruning and checks in quiescence stay fenced. **In design** (`arch-Q1-see-pruning`). The ticket is cut after that design, with its PREREG and ADR, not before* *2026-11-03 (`bapm-owner-answers-1103b`): **cut as `ABC-279`** (S–M, P2, DoR 10/10, Ready). **`ADR-0069` ACCEPTED** (owner `…401c3d09`; premise met, `arch-Q1-see-pruning` `…5e73b0d4`): form QS, quiescence skips a SEE-losing capture out of check; the main search is unchanged (QSM a named follow-up); `ADR-0024` d4 amended. Measured: +0.837 ply reach, d8 0.22–0.72 × nodes, every safety row clean. Intent GAIN. **Slot: merges or misses before `ABC-239`'s candidate is frozen for B-T7 / B-T8.** On a miss: closed unmerged under S1 (`EPIC-008`'s ship rule, not row S1), not shipped* |
| 3 | Q2 | ~~*stub:*~~ **`ABC-289`** delta pruning in quiescence | ~~title only~~ full page (new, `bapm-epic011-areas`) | was fenced out of `EPIC-010` *2026-11-04 (`bapm-epic011-areas`): **cut as `ABC-289`** (S, P3, DoR 9/10, Backlog, **held**). Two holds: `ADR-0024` d4 keeps delta pruning fenced (`Q-3K-9` and `ADR-0069` opened it for SEE only), so opening it is the owner's word, **`Q-3K-10`** (§ Owner questions); and the Architect's re-measure on `main`, over Q1, comes first* *2026-11-04 (`bapm-owner-answers-1104`): `Q-3K-10` answered yes (`…7de79e90`); d4 is open for Q2's design only. **Held on the Architect's re-measure over Q1 and its ADR** (a new ADR that amends d4)* *2026-11-04 (`bapm-lines-1104`): **premise met, `ADR-0074` PROPOSED, +0.279 ply** (reach 6.868 → 7.147 at 47 000 nodes; d8 0.64–0.83×; form D200b). `ABC-289` is DoR 10/10, Ready. OQ-0074-1 is open: the build may start on PROPOSED, and the merge waits on his acceptance and its read* *2026-11-04 (`bapm-bundle-1-cut`): **`ADR-0074` ACCEPTED** (OQ-0074-1, `…3e73f9f9`), not in force until `ABC-289` merges on its own read. **It reads alone, after bundle 1:** its build starts when `ABC-303`'s merge or `failed-attempt` is recorded* |
| 3 | S1 | `ABC-236` aspiration windows at the root | full page (moved in) | ~~after T1 (`ADR-0056` D2)~~ *2026-11-03 (`bapm-ABC-236-park`): **parked; `ADR-0066` PROPOSED, premise not met on `main`** (A100 `chooseMove` d8 0.9836 / 0.9913 > 0.95; every form safe); the Orchestrator's ruling (`…38f865c3`). Fires at 100 ms (70.4 % of nodes at 47 000), so intent GAIN on any re-open. Re-opens on T1 (`ABC-257`) or a deeper shipped search (`ADR-0066` § Status)* *2026-11-04 (`bapm-W1-bundle-cut`; owner `…4c4cb03d` ruling 2): **re-opened by the owner's word as part of `ABC-283`** (the O1h + O3s + S1 bundle, one branch `grugops/ABC-283`, each behind its own ADR door plus one all-off door), over the three not-met premises. Bars: P0 all-off node counts equal `main` exactly; `ADR-0064` d7's safety rows (mate floor, zugzwang 7 / 7, `G1` none newly missed); `NFR-008` ≤ 10 s. Then ONE read: 100 games at 100 ms, bundle against `main`, GAIN ≥ 50.0, PREREG sealed first, never re-played. Pass: merged, `ADR-0063` / `ADR-0065` / `ADR-0066` accepted as a bundle. Miss: not merged, the three stay parked. This page stays the design page* *2026-11-04 (`bapm-ABC-283-done`): **accepted as a bundle, delivered by `ABC-283`** (merged `58e90d07`; QE PASS_WITH_GAPS `…de1dc511`, C2′ 59 / 27 / 14 = 66.0 / 100, Elo +115.2 ± 67.0). `ADR-0063` (with K3) / `ADR-0065` / `ADR-0066` ACCEPTED 2026-11-04, in force at the merge; the premise was overridden, not met. The ticket is Done* |
| **4, evaluation** *(E1 **pulled forward** 2026-11-02, ahead of Phase 3 and the rest of Phase 2; `ADR-0056` D6's reorder rule; `bapm-E1-cut`)* | E1 | ~~*stub:*~~ **`ABC-269`** the full taper: one linear phase, every term a middlegame / endgame pair in one parameter table (`src/evaluate-params.ts`); at E1 only the king (40 − 15 m) and the passers (2 × by rank) get endgame halves. **Folds `ABC-231` and `ABC-232`** | ~~title only~~ full page (new, `bapm-E1-cut`) | `ABC-231`/`ABC-232` are subsets (§ Dedupe audit, C7) *2026-11-02 (`bapm-E1-cut`): **next pull** (`arch-next-pull` `…7e3ace66` ranks it first: 65 % of the ≥ 50 cp errors survive two node doublings, so evaluation is the bigger lever; the Orchestrator's ruling). `ADR-0064` PROPOSED (`arch-E1`): linear form chosen by the pre-registered rule (S 1.0344 against P's 1.1286); identical to `main` at phase 24; `chooseMove` 0.96–1.035× at d8–d10 on the `G6` boards; zugzwang 7 / 7, mate floor 0, `G1` 54 / 58. Intent GAIN; size M; P2. **DoR 10/10 on reading (b):** the build may start; B8 and the merge wait on the owner's acceptance of `ADR-0064`; B7 (`G6`) is graded per `Q-3K-4`. `ABC-231` and `ABC-232` closed as merged* *2026-11-03 (`bapm-ABC-269-fold`): **`ADR-0064` ACCEPTED 2026-11-02; B7 under `Q-3K-4` = (b)**; `QE-269-a` ruled (a): B1 (d) on D1–D6, S1–S3 E3's* *2026-11-03 (`bapm-269-done`): **DONE**, merged to local `main` `54dee3f2` with cut C1 (F3 fired once on `G2` 1.071 / 1.067 ×; the one cut re-read 1.0373 ×, MET). QE PASS_WITH_GAPS `…eff2fe64` signs UAT: B8 **57.0 / 100** (GAIN met; +49.0 ± 59.5 Elo, the interval crosses 0), S′ 7.0 / 10 at E 1 810, Levels 57 / 57; post-merge `npm test` 2 566 / 2 566. `ADR-0064` in force from the merge. **Phase 4 next: `ABC-274`** (E2-pre)* *2026-11-03 (`bapm-R1-cut`): **`ADR-0064` IN FORCE** by its own § Status (`arch-post-269` `…3f30baf8`)* |
| 4 | E2-pre | **`ABC-274`** every term enters the blend, value-identical at E1's table (same scores, same node counts); a packed score recommended; no games | full page (new, `bapm-E2pre-cut`) | *2026-11-03 (`bapm-E2pre-cut`): `ADR-0067` d8. It keeps `ABC-239`'s A3 ("constants only") and A4 (`G2` ≤ 1.02 ×) true as written. Bars: node identity, `G2` ≤ 1.05 ×, `G6` "≥ base" (graded; not a value change). Size S, P2, DoR 9/10. Waits on `ABC-269` merged; the merge waits on "accept ADR-0067" (pending)* *2026-11-03 (`bapm-269-done`): `ABC-269` merged (`54dee3f2`), so **DoR 10/10, Ready**; the Orchestrator pulled it to In Development (`se-ABC-274`). The merge still waits on "accept ADR-0067" (pending). `QE-269-f`'s `G2` guidance for its PREREG is the Architect's (`arch-post-269`)* *2026-11-03 (`bapm-sec-cut`): **QE PASS_WITH_GAPS** (`qe-ABC-274` `…fa87f74d`, on `grugops/ABC-274` `2a2e1e02`) signs UAT: `G2` 0.9897 × (bar 1.0500), `G6` = base, A1 / A2 0 mismatches over 9 120 / 4 840 290 rows, `npm test` 2 588. Board: Ready to Release. **The merge waits on "accept ADR-0067"** (pending)* *2026-11-03 (`bapm-owner-answers-1103`): **Done**, merged `2410d4f7` on the owner's "accept ADR-0067" (`…af126c04` item 1); F8 did not fire, so `ABC-239`'s A3 / A4 hold as written* |
| 4 | E2 | `ABC-239` offline tuning, constants only; ***second pull cut as `ABC-301`*** | full page (moved in); `ABC-301` full page (new, `bapm-ABC-301-cut`) | after E1; Q-3K-7 (data) *2026-11-03 (`bapm-E2pre-cut`): **design PROPOSED, `ADR-0067`** (Texel-style logistic fit, cross-entropy, Newton on a traced model, material frozen at the first pull; prototype 0.9863 × outer cross-entropy, 0.9960 × with material frozen and bounded). **After E1 and E2-pre (`ABC-274`).** Owner, pending: "accept ADR-0067"; Q-3K-7 (a) / (b) / (c); B-T8. Intent GAIN* *2026-11-03 (`bapm-owner-answers-1103`): **`ADR-0067` ACCEPTED** (item 1). Data pinned (§ Addendum): own games plus the Lichess `2017-03` export, CC0, ≤ 1 000 000 positions, own share 0.5 of the loss, validation own games only; Q-3K-7 (a) yes / (b) no / (c) no; B-T8 approved. **DoR 10/10, Ready, P2.** The next build* *2026-11-03 (`bapm-owner-answers-1103b`): In Development (`se-ABC-239`, the Orchestrator's). **Its fit is taken on a `main` that contains `ABC-270`** (`ADR-0068` d7), and the first pull fits the queen-on pairs (mg free ≥ 0, eg held at 0; `ADR-0068` d8). **Its candidate is frozen for B-T7 / B-T8 after Q1 (`ABC-279`) merges or misses.** The filter names its quiescence rules record (`ADR-0069` d6). The PR prints S1–S3 and game 1's move 13 as reports* *2026-11-04 (`bapm-ABC-239-close`; Orchestrator `…4c76bf7a`): **first pull CLOSED NOT MET**, not shipped. On `26d06118`: B-T1, B-T2 0.9905 × and B-T3 MET; F3 (pawns A2 53 > 50) and F4 (`zugzwang.001` e1e5 at d9–11) fired. `main` keeps E1's table. **The tool lands alone as `ABC-280`.** **A second pull comes after E4a (`ABC-271`):** a new attempt under F6 with its own PREREG and the owner's word then on `ADR-0067` d6's amendment* *2026-11-04 (`bapm-epic011-areas`; `arch-ADR-0070-accept` `…212d6a4c` § 5): **the second pull fits king distance and free path (eg ≥ 0, mg 0) and holds `PASSED_UNSTOPPABLE` at 0** (`ADR-0067` d6, dated 2026-11-04). It is a new attempt under F6 with its own PREREG, on a `main` that contains `ABC-271`. Still the owner's before it: the d6 amendment (the margin-aware form, every relation bounded at once) and B-T8's re-confirmation (§ Owner questions). ~~It has no ticket id yet.~~ Its free set is the first pull's plus E4a's two terms, so no `ABC-290`–`ABC-293` weight comes from it (the shared mobility weight excepted, `ABC-292`)* *2026-11-04 (`bapm-ABC-301-cut`; `arch-second-pull-1104` `…4917f0f7` § 5): **the second pull is cut as `ABC-301`** (L, P2, DoR 10/10, Ready; intent GAIN). The owner answered both items yes (`…dda43b71`): **every relation row is bounded at once from the first fit** (d6 amendment: one fit, no refit; a red relation is a defect, an infeasible set a STOP), and **B-T8 is re-confirmed** (about 5 h). Four preconditions are met before the fit: `QE-271-h` (hot-path row), `QE-271-g` (`pawnStructureForTest` guard), `QE-271-i` (13 → 17 exports and the tracer) and `QE-271-f` (the endgame `G2` row, ≤ 1.02 ×, in the PREREG). `ABC-271`, `ABC-280` and `ABC-283` are merged* |
| 4 | E3 | *stub:* king attack: attackers on the king zone, weighted, tapered (re-try of dropped `ABC-205`'s term); ***E3b cut as `ABC-290`*** | title only; ***first slice cut as `ABC-270`***; ***E3b as `ABC-290`*** | under the tuner; ~~Q-3K-4 (`G6`)~~ *2026-11-03 (`bapm-epic011-cut`): the `Q-3K-4` wait is dissolved by (b). **E3a → `ABC-270`** (M, P2, DoR 9/10): the exposure terms get endgame halves and the `ADR-0031` addendum's queen scale and shelter gate (accepted 2026-10-24, never shipped; `ABC-205` died on `G6` cost alone) are re-read over E1, judged on play. **E3b**, the king-zone attacker term, stays this stub, after E2 (tuned weights)* *2026-11-03 (`bapm-ABC-269-fold`): judged on play (`Q-3K-4` = (b)). Its first graded rows: QE's castled-corner S1–S3 (`TAPER_KP_SHELTER_STRESS`, `grugops/ABC-269` `d6a57653`) at ≥ 20 cp, in `ABC-270` K1 (b) (`QE-269-a` ruled (a); `ADR-0064` § Decision log; `ADR-0056` D2 row E3)* *2026-11-03 (`bapm-E2pre-cut`):* **E3a after `ABC-239`**, so that its terms enter with fitted weights (`ABC-207` lost on hand weights). If `ABC-239` stalls on data, `ABC-270` may go first on its rule values, and the tuner traces it. **Supporting information** (`…48ae6a93`, not a bar): every tuner fit weights the king's square tables about 3–3.6 × (mg) and 2.2–2.8 × (eg) above E1's rule tables, which supports E3a's premise *2026-11-03 (`bapm-owner-answers-1103`): E3a (`ABC-270`) **in design now** (owner item 8; `arch-ABC-270`). The build order stays `ABC-239` first under the stall clause; which build lands first is the Orchestrator's* *2026-11-03 (`bapm-owner-answers-1103b`): **`ADR-0068` ACCEPTED** (owner `…401c3d09`). **E3a = `ABC-270`, structure only**: three queen-on exposure pairs at `{ 0, 0 }`, value-identical, no switch, no doors, no games; size S; **DoR 10/10, Ready**. The `ADR-0031` rule values (× 3, endgame half 0) failed the d5-against-d5 mate floor (2 / 190, KQK) and are not shipped; the shelter gate is out. **Order: `ABC-270` (structure) → `ABC-239`'s fit**, one read for both; the stall clause is void. S1–S3 become a report in `ABC-239`'s PR* *2026-11-04 (`bapm-epic011-areas`): **E3b cut as `ABC-290`** (M, P2, DoR 9/10, Backlog): the king-zone attacker term, after the second pull; its weights come from a later pull, not the second; form (a) structure at 0 or (b) rule values is the Architect's* |
| 4 | E4 | *stub:* pawn and passer terms: backward, connected, passer king distance, free path, unstoppable; ***E4a = `ABC-271`, E4b cut as `ABC-291`*** | ~~title only~~ two pages: `ABC-271` (E4a), `ABC-291` (E4b, new, `bapm-epic011-areas`) | builds on E1's passer scaling (`ABC-232`'s part) *2026-11-02 (`bapm-E1-cut`): `ABC-232` closed as merged into `ABC-269` (phase scaling) and here (every other passer term); E4 gets its id at its refinement* *2026-11-03 (`bapm-epic011-cut`): **E4a → `ABC-271`** (M, P3, DoR 9/10): king distance to the queening square, a free path and the unstoppable passer (rule of the square), each by a stated rule, endgame halves only. **E4b** (connected / phalanx, backward) stays this stub, under the tuner* *2026-11-03 (`bapm-E2pre-cut`):* **E4a after `ABC-239`** (`ADR-0067` § Consequences 5): king distance and free path become fitted weights; the rule of the square stays a rule *2026-11-04 (`bapm-ABC-239-close`):* **order flipped: E4a before a second E2 pull.** F4 in `ABC-239`'s first pull needs the free-path and king-distance terms (`arch-ABC-239-f3f4` `…69f22167` § 1). In design (`arch-ABC-271`) *2026-11-04 (`bapm-epic011-areas`; `…212d6a4c` § 5): **E4a → `ADR-0070` ACCEPTED** (the owner, form (a), **structure only at 0**: value-identical and node-identical, no switch, no doors, no games); `ABC-271` re-cut S, DoR 10/10, Ready (`bapm-ABC-271-ready`, merged `af0b0ae6`). **E4b cut as `ABC-291`** (S–M, P3, DoR 9/10, Backlog): connected / phalanx and backward pawns, after the second pull; weights from a later pull* |
| 4 | E5 | ~~*stub:*~~ **`ABC-292`** piece terms: bishop pair, rook on open and semi-open files, outposts, mobility per piece, tuned (re-try of dropped `ABC-207` by the tuner; rook activity was fenced out of `EPIC-010`) | ~~title only~~ full page (new, `bapm-epic011-areas`) | *2026-11-04 (`bapm-epic011-areas`; the owner's ruling 3 supersedes "id at E2's merge"): **cut as `ABC-292`** (M, P2, DoR 9/10, Backlog): after the second pull, which fits only the shared mobility weight; the new weights from a later pull; split per term if the ADR gives the four terms different forms* |
| 4 | E6 | ~~*stub:*~~ **`ABC-293`** threats (pawn attacks on pieces, hanging pieces) and tempo | ~~title only~~ full page (new, `bapm-epic011-areas`) | *2026-11-03 (`bapm-epic011-cut`): not cut: weights from the tuner (`ADR-0056` D2: after E2); id at E2's merge. E5 likewise (`ABC-207`'s hand weights lost)* *2026-11-04 (`bapm-epic011-areas`): **cut as `ABC-293`** (M, P3, DoR 9/10, Backlog): after the second pull; weights from a later pull; tempo's relation rows owed with the ADR* |
| 4 | E7 | *stub:* endgame scaling and knowledge (opposite bishops, drawish material, mop-up); ***E7b cut as `ABC-294`*** | title only; ***first slice cut as `ABC-272`***; ***E7b as `ABC-294`*** | *2026-11-03 (`bapm-epic011-cut`): **E7a → `ABC-272`** (M, P3, DoR 9/10, premise-gated): mop-up in pawnless wins (KQK, KRK, KBNK) and a scale toward 0 for drawish material; a pre-registered probe (≤ 10 / 12 conversions; ≥ 100 cp on ≥ 5 / 10 drawish) decides each half before any design. Rook-pawn, wrong-bishop and rook-ending knowledge stay this stub* *2026-11-03 (`bapm-E2pre-cut`):* **order free** (`ADR-0067` § Consequences 6): a pawnless rule plus a multiplicative scale, which the tracer applies; the premise probe may run any time after E1 *2026-11-04 (`bapm-epic011-areas`): **E7b cut as `ABC-294`** (M, P3, DoR 9/10, Backlog, **premise-gated**): rook-pawn, wrong-bishop and rook-ending knowledge, after `ABC-272`'s premise probe; order free relative to the tuner* |
| — | reading | **`ABC-295`** **R2**, milestone reading on ~~the routine control~~ *C4's 100 ms reading (2026-11-03, `bapm-R1-cut`)* | ~~(QE reading, cut when Phase 4 closes)~~ full page (new, `bapm-epic011-areas`) | *2026-11-03 (`bapm-R1-cut`; `…8136b589` § 1): the same shape as R1, through `ABC-275`'s command, at Phase 4's close. An R reading and an anchor's 100 ms half on the same SHA are one reading* *2026-11-03 (`bapm-sec-cut`, `QE-273-c`): a base or Stockfish fault makes the reading UNRESOLVED: **re-run once, asked of the owner first**. A band-rule step's second run is asked first too (R1-A3's rule)* *2026-11-04 (`bapm-epic011-areas`; the owner's ruling 3): **cut as `ABC-295`** (S, P2, DoR 10/10, Backlog, held until Phase 4's close; which tickets close it is the Orchestrator's ruling)* |
| **5, extensions, time, speed** | X1 | ~~*stub:*~~ **`ABC-296`** check extension at every depth (not `ABC-210`'s horizon form, which stays closed) | ~~title only~~ full page (new, `bapm-epic011-areas`) | *2026-11-04 (`bapm-epic011-areas`): **cut as `ABC-296`** (S, P3, DoR 9/10, Backlog): only the ADR holds it; `ABC-210`'s −4.8 ± 16.2 is the nearest prior evidence* |
| 5 | X2 | ~~*stub:*~~ **`ABC-297`** singular extension (and IIR) | ~~title only~~ full page (new, `bapm-epic011-areas`) | after T1 *2026-11-03 (`bapm-epic011-cut`): T1 closed on F4 and is not in force, so this wait names a premise that no longer exists. X2's real input (stored entry depth and bound) is re-stated at its refinement (`UNKNOWN - verify`)* *2026-11-04 (`bapm-epic011-areas`): **cut as `ABC-297`** (M, P3, DoR 9/10, Backlog). The input re-stated: `main`'s per-move table stores depth and bound (`src/transposition.ts`); a premise probe on usable entries comes first; IIR split out if the ADR lands it first* |
| 5 | W1 | ~~*stub:*~~ **`ABC-282`** time use under a clock: no doomed iteration started, a partial iteration's root move kept when it beat the incumbent, soft and hard limits | ~~title only~~ full page (new, `bapm-W1-bundle-cut`) | **must land before the first 40/15 reading**, wherever that falls (reorder: the owner set 40/15 as the claim control, and `uci-clock-mode` today has no soft/hard limit, `ADR-0056` § Inventory, "Time use"). *2026-11-02 (`bapm-threads-cut`): after the thread strand (`ABC-265`–`ABC-267`); its limits are written against the worker pool (`ADR-0056` D6's dated line, item 3)* *2026-11-03 (`bapm-epic011-cut`): the strand is parked (`ABC-265` merged, `ABC-266` parked, `ABC-267` folded), so that wait is moot. W1 is still the claim's precondition and invisible in the fixed-time (`st=`) reads; it waits on its own design only. If threads re-open, its limits are re-read against the pool* *2026-11-04 (`bapm-W1-bundle-cut`; owner `…4c4cb03d` ruling 1, "yes, cut W1"): **cut as `ABC-282`** (M, P2, **DoR 9/10, Backlog**). Row 10: **the ADR is owed by the Architect** after this cut (the rule, the soft / hard limits per mode, the partial-iteration test, the modes it applies to, the `ABC-078` A3 amendment, the read's control and intent). Still lands before the first 40/15 reading. It is read under a clock, not at `st=`, and it builds after `ABC-283` on `src/engine.ts`* *2026-11-04 (`bapm-ABC-282-adr`): **`ADR-0071` PROPOSED** (`arch-ABC-282`, merged `9471eb32`; the owner's acceptance is OQ-0071-1, § Owner questions; reading (b): the build may start on PROPOSED). W1 acts only in `uci-clock-mode` under a clock; every other mode is node-identical to `main`. `ABC-282` → **DoR 10/10, Ready, M → L**. **Order: `ABC-283` → `ABC-282`** (D12: one at a time on `src/engine.ts`; the second to land rebases, re-reads b and A0); **`ABC-300` (the harness, `d --tc 40/8`) before `ABC-282`'s A6**, the read of 100 games at `tc=40/8`, GAIN* *2026-11-04 (`bapm-ABC-283-done`): `ABC-283` merged `58e90d07`: **unheld**; `ABC-282` rebases on the merge-first branch of D12* |
| ~~5~~ | V2 | `ABC-254` lazy legality (O1-d) | ~~full page (moved in)~~ **returned to `EPIC-010`** 2026-11-01 | ~~**waits the owner's yes (Q-SP-3)**; after `EPIC-010`'s `ABC-252` (both rewrite `src/legal.ts`)~~ yes `…f7a50e95` and `ADR-0003` amended before `ABC-250` entered development: `EPIC-010` milestone 1b, first (C11) |
| 5 | V3 | ~~*stub:*~~ **`ABC-298`** staged move generation (hash move before generating; captures before quiets) | ~~title only~~ full page (new, `bapm-epic011-areas`) | after V2 (`ABC-254`, in `EPIC-010` since 2026-11-01) *2026-11-04 (`bapm-epic011-areas`): **cut as `ABC-298`** (M, P3, DoR 9/10, Backlog). V2 merged (`3bfe180e`), so that wait is met; after `ABC-283` on `orderMoves`; value-identical or not is the ADR's* |
| — | reading | **R3** (**`ABC-299`**), milestone reading *(C4's 100 ms reading, 2026-11-03, `bapm-R1-cut`)*; and **the 40/15 claim reading** when a routine reading points at 3 000 | (QE readings); R3 a full page (new, `bapm-epic011-areas`) | `ADR-0056` D6 item 7. *2026-11-03 (`bapm-R1-cut`; `…8136b589` § 1): R3 is after Phase 5, in R1's shape. Above E 2 600, C3′'s probe runs first (`ABC-275` refuses that range at 100 ms).* *2026-11-02 (OQ-3 (c), `bapm-threads-cut`): the claim is read at `Threads 1` first, then at `Threads N`, each labelled "1 CPU" / "N CPU"; the `Threads N` claim's PREREG is the Architect's, after the strand merges* *2026-11-03 (`bapm-sec-cut`, `QE-273-c`): a base or Stockfish fault makes the reading UNRESOLVED: **re-run once, asked of the owner first**. A band-rule step's second run is asked first too (R1-A3's rule)* *2026-11-04 (`bapm-epic011-areas`; the owner's ruling 3): **R3 cut as `ABC-299`** (S, P3, DoR 10/10, Backlog, held until Phase 5's close; C3′'s probe first only if E > 2 600). The 40/15 claim reading stays a QE reading asked of the owner, not a ticket* |
| later | V4 | (not a stub) bitboards: re-opening `ADR-0001` | — | **Q-3K-8, the owner's**, only if the curve flattens below 3 000 after Phase 5 |
| any time | (owner, `…78c476bf`) | **`ABC-263`** SPIKE: NPU, iGPU and CPU threads from Node.js, and search info shared between them (records only, Architect) | full page (new, `bapm-spike-accel`) | independent of the classical phases: it writes records only, gates no phase and is gated by none. It recommends; any thread or net it favours stays out of scope (§ Out of scope) until the owner opens it. *2026-11-02 (`bapm-threads-cut`): its `ADR-0057` is ACCEPTED; threads opened (OQ-1 yes) and cut as `ABC-265`–`ABC-267`; devices parked (OQ-5 no); a net later (OQ-6)* |

- **Milestone readings report which milestone (2 200 … 3 000) a reading meets; they gate nothing.** The 40/15 reading
  is taken for the claim and for any milestone the Architect's fold names; otherwise milestones are read on the
  routine control *[proposed]*.
- **Stubs get an id and a full page at their phase's refinement**, not before. Their estimates are `ADR-0056` D2's and
  are not readings. *2026-11-04 (`bapm-epic011-areas`): **superseded by the owner's ruling 3** (`…4c4cb03d`, "after
  cutting W1, start cutting EPIC-011 areas"). Every stub left is cut as `ABC-284`–`ABC-299`, each in Backlog with its
  hold and re-open trigger on its page. A held page is not "almost ready": the hold is DoR row 10. The estimates stay
  estimates.*
- **The thread strand** *(2026-11-02, `bapm-threads-cut`)* sits between R1 and Phase 3 by `ADR-0057` D6's dated line,
  a recommendation BA/PM adopts here. The Orchestrator may pull `ABC-265` beside Phase 2 by width. Its read rules are
  in § The per-change rule. *2026-11-02 (`bapm-records-1102c`): **the strand is parked by the owner** ("park threads",
  `…773be7de`). `ABC-265` merged (`605874b8`); `ABC-266` is parked; `ADR-0062` is not in force; the ~30 min re-probe
  is not funded. Its re-open triggers are on `ABC-266`'s page.*
- **Not cut, recorded:** `ADR-0055` O1-e (incremental material + PST): "not proposed now"; after E1 the evaluation has
  two halves, so it is re-read then, not here.
- *2026-11-03 (`bapm-epic011-cut`; `ADR-0057` D8.8's optional line, owed since 2026-11-02):* **lazy evaluation of the
  mobility term (and of later costly terms), `ADR-0057` D8.7; worth `UNKNOWN - verify` until a `chooseMove` profile at
  `main` gives mobility's share.** Not a stub, no ticket. Weighed when E2's two-accumulator form, E3b, E5 or E6 make
  the evaluation costlier; O1-e would be its cheap first stage. Under `Q-3K-4` (b) a cost cut no longer buys `G6`, only
  depth, so it is ranked by its depth gain.
- *2026-11-03 (`bapm-epic011-cut`):* **Q2 (delta pruning) is not cut yet:** its only figure (`ADR-0024`, a 1.3–1.5 ×
  quiescence trim) was read on a 2026-08 base before futility and ordered quiescence. An Architect re-measure on
  `main` (quiescence share of nodes, the trim, drift, the mate floor) comes first. *2026-11-04 (`bapm-epic011-areas`):
  **cut as `ABC-289`**, held on that re-measure and on `ADR-0024` d4, which keeps delta pruning fenced (`Q-3K-10`, the
  owner's).*

### P1, parked (stub; 2026-11-02, `bapm-phase2-records`)

- **Title:** P1: late-move reductions from a log table of remaining depth × move index, replacing `ABC-121`'s flat 1-ply
  LMR (`ADR-0026`), behind a test-only off-door pair. The title drops "history-adjusted" (`ADR-0060` d11). It names no
  PV term and no cap, because no form is written into `ADR-0060` as its rule.
- **State:** Backlog, **parked**. Not refined, and not Ready. It cannot reach Ready on today's `ADR-0060` text. The
  re-open found no form meeting every bar on `main` (`arch-ADR-0060-reopen` `…e17a23f4`, `…79be958e`).
- **No id (BA/PM's call).** The id and the full page come at its refinement, by § Phases' rule ("stubs get an id and a
  full page at their phase's refinement, not before"). *2026-11-04 (`bapm-epic011-areas`): **superseded by the owner's
  ruling 3: cut as `ABC-284`** (Backlog, parked, DoR 9/10). The page carries the bars below by reference to `ADR-0060`,
  so they keep one home; the door counts are re-derived at the re-open.* Reasons:
  - Phase 2 gives an id only to the item about to be pulled: P2 became `ABC-264` when it was next. P3–P6 stay
    title-only. *(2026-11-02, `bapm-P3-page`: P3 became `ABC-268` when it was next, by the same rule. P4–P6 stay
    title-only.)*
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
  1. **The re-measure trigger:** P3 *(`ABC-268`, 2026-11-02)* merged, or O1h (`ABC-233`) landed. Then `ADR-0060` decision 1 is re-measured
     unchanged, under every bar unchanged, by a dated line in `ADR-0060` (the Architect's). That P3 restores the
     margin is a judgement (`UNKNOWN - verify`). If decision 1 meets every bar, BA/PM cuts the page.
     *2026-11-02 (`bapm-records-1102c`): **fired, and missed.** On `main` `e72487e1` (futility in force), decision 1 misses
     A4 (a) (`chooseMove` position-6 0.8528 > 0.85), the 27 cp cap (63 cp, position-6 / g5h6) and zugzwang 7 / 7
     (`zugzwang.004` g7f6 at d11) (`ADR-0060` § Status, `arch-post-268` `…1bc554fb`). P1 stays parked. The O1h branch
     of this trigger is closed too: `ABC-233` is parked on `ADR-0063` F4. A diagnostic, not pre-registered: P1 over the
     history table meets A4 (a), reach and the cap, but reads zugzwang 5 / 7 (`…f3a4dac0`). P1 now re-opens only on a
     new named premise with a new pre-registered probe.*
  2. **The owner's acceptance of `ADR-0060`.** It gates C2′ and the merge (reading (b)).

  Under "keep the cap" (the default), P1 waits here and the flat 1-ply LMR stays on `main`. If the re-measure misses
  too, the cap question comes back in the same shape (`…e17a23f4`, Risks). *2026-11-02 (`bapm-records-1102c`): it missed, and
  the cap question is **moot**: a "yes" admits nothing while A4 (a) and zugzwang remain (the Orchestrator,
  `…8ce2fd23`).*
- ~~**Still BA/PM's, not decided here:** whether `ABC-233`'s page carries a history term in LMR, or a follow-up does
  (`ADR-0060` d11).~~ *2026-11-02 (`bapm-records-1102c`): settled by `ADR-0063` decision 11. `ABC-233` only orders; a history
  term in LMR belongs to a later P1 probe, measured jointly with the table.*

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
    ≥ 7.0 of 20; `skytalix` `timemargin` 50 ms; `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1`* *2026-11-02 (`bapm-records-1102c`): `ADR-0056` S′ amended
    to **E 1 810** (the band-centre step), so the line reads `r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5
    --concurrency 1`; S-4 unchanged; § Close-out*). A
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
- ~~**`G6` "≥ base" binds as today** (his word `…2ae5fc12`) until Q-3K-4 is answered.~~ `NFR-005`'s depth-6 floor never
  moves. *2026-11-03 (`bapm-epic011-cut`): **`Q-3K-4` = (b)** (`…cc7db847`): a value-changing **evaluation** ticket is
  judged on play (C2′) with `NFR-005`'s floor (every `G6` run completes depth ≥ 6; FAIL below) and the depth-7 WARN;
  "≥ base" is **reported, not graded**. Every other value-changing ticket keeps "≥ base" until the Architect's
  `ADR-0056` fold or the Orchestrator rules its scope (~~`UNKNOWN - verify`~~ *2026-11-03, `bapm-ABC-269-fold`:
  **ruled, evaluation tickets only**; every other value-changing ticket keeps "≥ base" binding until a wider reading
  is recorded (`Q-3K-4` (b)'s scope: the Orchestrator's ruling 2026-11-03, brief `bapm-ABC-269-fold`, on the owner record `orch-2026-10-30a` `…cc7db847`; `ADR-0056` D7 dated 2026-11-03)*). Each evaluation ticket's page names which
  branch grades its `G6` row (`ABC-269` B7, `ABC-270` K7, `ABC-271` P7, `ABC-272` N7).*
- **Common gates:** `EPIC-008` § Common gates `G1`–`G11`, by reference, as `EPIC-010` uses them. Each ticket names
  the gates it owes.
- *2026-11-04 (`bapm-ABC-283-done`), a pointer only; the rule is not written here.* **The owner's bundling
  direction** (`orch-2026-10-30a` `…dda43b71` item 3): related changes may be built together and judged by one read,
  as `ABC-283` was. **The owner's risk acceptance R-BUNDLE-1** (`…ce2883d8`): a bundle's single read may hide a part
  with a small negative share. The rule, its guards and R-BUNDLE-1's text are the Architect's ~~draft,~~ a dated rule in
  `ADR-0056`'s per-change rule (`arch-second-pull-1104`; merged `48b98f43` after this line's base: § Dated 2026-11-04,
  "the bundle read", ~~PROPOSED~~ **ACCEPTED**). ~~Its acceptance is the owner's (`Q-3K-11`); reading (b) lets it be used while PROPOSED
  for bundles the owner names.~~ *2026-11-04 (`bapm-lines-1104b`): **ACCEPTED** by the owner, `Q-3K-11` (a) (`…3b15b361`), carrying
  R-BUNDLE-1. It is part of the per-change rule, and `ADR-0056` § Status and the section's heading read so (`arch-bundle-1`).*
  *(2026-11-04, `bapm-ABC-301-cut`: this is the one pointer `arch-second-pull-1104`
  `…a5d74f70` owes; `Q-3K-11` is in § Owner questions.)*

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
  default product stays single-threaded. *2026-11-02 (`bapm-ABC-266-rows`): two tickets now; `ABC-267` is folded into
  `ABC-266` (`ADR-0062` D13).* *2026-11-02 (`bapm-records-1102c`): **parked by the owner** ("park threads", `…773be7de`).
  `ABC-265` merged (`605874b8`); `ABC-266` parked; `ADR-0062` not in force; the product stays at `Threads 1`.*
- `src/search.ts`, `src/engine.ts`, `src/quiescence.ts`, `src/evaluate.ts`, `src/transposition.ts`, `src/legal.ts`,
  `src/moves.ts` and `tools/rating/` change, each only in the ticket that names it. *2026-11-02:* also `src/uci-session.ts`
  and a new worker module (named by `ABC-266`'s ADR), in `ABC-266` only. *2026-11-02 (`ADR-0062` D8): `src/search-pool.ts`
  and `src/search-worker.ts` (names the Engineer's), `src/uci.ts`, `tsconfig.build.json`'s `files`, and `d --threads` in
  `tools/rating/`, in `ABC-266` only.*

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
| G2 | **The climb is visible** | a milestone reading after Phases 2, 4 and 5 names the highest milestone met | R1–R3 on ~~the routine control~~ *C4's 100 ms reading: 200 games against Stockfish 19 at the band-rule E, both sides at `st=0.1`. R1 after E1 (`ABC-273`, through `ABC-275`), R2 at Phase 4's close, R3 after Phase 5. A milestone M is met when E = M ≥ 2 200 scores ≥ 50 % (`ADR-0056` D5's claim rule). A band-rule E below 2 200 names "none" and reports X ± Y. 2026-11-03 (`bapm-R1-cut`; `…8136b589`): ruled, so G2 no longer waits on a ruling. The milestones stay* [proposed]* *2026-11-03 (`bapm-sec-cut`, R1-A4): **R1 read** (`ABC-273`, QE `…07b3c794`): X = **1 806.5 ± 47.4** at E 1 810 (49.5 %), on `main` `85a304ff` after E1; highest milestone met **none**. R2 at Phase 4's close is the next point on this scale* |
| G3 | **Every value-changing merge passed the rule in force** | 100 % (the per-change rule above) | each ticket's `## Reading` and QE note. *2026-11-03 (`bapm-269-done`), the tally from the pages: **2 of 2.** `ABC-268` (P3, GAIN, C2′ 58.0 / 100, `…186a743e`) and `ABC-269` (E1, GAIN, C2′ 57.0 / 100, `…eff2fe64`), each with S′ and the Levels lane MET. Both intervals cross 0: passes, not proven gains. Value-identical merges (`ABC-265`) are not counted* |
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
| 1 | `ABC-255` | M0: ~~a self-play SPRT lane on the rating harness that stops H1 on a known gain and H0 on an identical pair~~ *(re-scoped 2026-11-01)* the rating harness plays the owner's two reads at 100 ms: 100 games new against base, and the 400-game ~~pair against Stockfish~~ *head-to-head read; and the 10-game Stockfish smoke at 0.5 s (`bapm-owner-answers`)* | ~~M~~ S | P1 | ~~Backlog *(Ready recommended, `bapm-reconcile-adr0056`)*~~ **Done** *(2026-11-01, merged `87484808`; QE PASS_WITH_GAPS `…cc9d4bad`; page `status: done` 2026-11-02, `bapm-E1-cut`)* | ~~10/10~~ ~~9/10 *(row 5: the owner-answers fold)*~~ **10/10** *(fold merged `a0f9297e`)* | ~~`EPIC-006`/`009`/`010` closed; Q-3K-2 (its use as a gate), Q-3K-3 (width); the Architect's routine control~~ none (`ADR-0056` fold merged `94f1504c`); may be pulled before `EPIC-010` closes (C12) |
| 2 | `ABC-256` | ~~B0: baseline reading of `main` on the routine milestone control, after `EPIC-010` closes~~ **Closed as superseded by C3″** (2026-11-01, `bapm-reconcile-adr0056`) | S | P2 | ~~Backlog~~ **dropped** (page `status: dropped`; the board move is the Orchestrator's) | ~~8/10~~ — | the Architect's routine control; `EPIC-010` closed; *2026-11-01:* ~~closes as merged into `EPIC-010`'s 400-game close reading (C13; condition met by the fold, `94f1504c`)~~ *C13 void (`bapm-owner-answers`): the close read is head-to-head; B0's control and fate wait on the owner-answers fold* *(answered: the fold keeps no routine Stockfish reading; closed as superseded, `bapm-reconcile-adr0056`)* |
| 3 | `ABC-238` | A deeper stored entry may cut off a shallower search (T1) | M | P2 *(was P3)* | ~~Backlog~~ ~~**Ready** *(2026-11-01, `bapm-phase1-wording`; moves past Ready are the Orchestrator's)*~~ **dropped: closed unmerged on F4** *(2026-11-02, `bapm-phase1-pause`; page `status: dropped`; the board move is the Orchestrator's; code `3abaefdd` kept)* | ~~9/10~~ **10/10** | ~~the ADR revising `ABC-081` `A1`; `ABC-255` (if Q-3K-2 yes)~~ *2026-11-01:* `ADR-0058` written, PROPOSED; reading (b): build now, read and merge on the owner's acceptance |
| 4 | `ABC-237` | The TT prefers deeper entries when it replaces (T2) | S | P3 | Backlog, **parked** *(2026-11-02)* | 9/10 | ~~`ADR-0025` amendment~~ *(written 2026-11-01, PROPOSED; read and merge on the owner's acceptance)*; ~~`ABC-238` merged or closed~~ *2026-11-02: re-read with `ABC-258` (the amendment recommended parked with it)* *2026-11-02 (`bapm-threads-cut`): **parked by the owner** ("B park"), with `ABC-258`, or after `ABC-266`, whichever loads the table first* |
| 5 | `ABC-257` | The TT is kept across the moves of one game, ~~re-tried after T1 and T2 (T3)~~ *together with `ABC-238`'s deeper cutoffs (T1 + T3), on a pre-registered held-out bar (2026-11-02)* | ~~S~~ M | P3 | Backlog, **PAUSED** | 8/10 | ~~`ABC-238`, `ABC-237`;~~ ~~*the owner: C2′ yes, or a longer read;*~~ *2026-11-02 (`bapm-threads-cut`): C2′ answered ("C yes"); **paused by the owner's order (P)**, the Orchestrator lifts it within P; intent line owed at resume;* `ADR-0025` d4 amendment (accepted 2026-10-26, not in force) re-read; `ADR-0058` as base (**ACCEPTED, NOT IN FORCE**, "A accept"; in force only at this ticket's merge with A8′ met) |
| 6 | `ABC-258` | A larger transposition table: 8 MiB inside `NFR-009`, more only on the owner's word (T4) *; T2 measured alongside (2026-11-02)* | S | P3 | Backlog, **PAUSED** | ~~8/10~~ 9/10 *(the page's score since 2026-11-01)* | `ABC-257`; Q-3K-6 for > 8 MiB; *2026-11-02 (`bapm-threads-cut`): **paused by the owner's order (P)**; the T2 amendment parked with it ("B park"); re-asked after `ABC-266`, on the shared table* |
| 7 | `ABC-233` | History heuristic after the killers (O1h) | M | P3 | ~~Backlog, **parked** *(2026-11-02, the Orchestrator's ruling; `bapm-records-1102c`)*~~ **Done** *(2026-11-04, delivered by `ABC-283`)* | ~~9/10~~ **10/10** | ~~the ADR (`ADR-0026` d10)~~ *2026-11-02: `ADR-0063` PROPOSED, **premise not met on `main`** (F4: d8 1.0011 / 0.7970 / 0.9751 / 0.9832 against ≤ 0.95× on four); no build, no read. DoR row 10 ❌ on F4; `NFR-009` 32 KiB; A3 superseded by `ADR-0063` d9; S′ `--elo 1810`. Re-opens on a new named premise and a new pre-registered probe (`ADR-0063` § Status)* *2026-11-04 (`bapm-ABC-283-done`): **Done, delivered by `ABC-283`** (merged `58e90d07`); `ADR-0063` (with K3) ACCEPTED as a bundle; DoR 10/10* |
| 8 | `ABC-234` | SEE orders captures, ordering only (O3s) | M | P3 | ~~Backlog *(parked 2026-11-03)*~~ **Done** *(2026-11-04, delivered by `ABC-283`)* | ~~8/10~~ ~~9/10~~ **10/10** | ~~`ADR-0024` d4 re-open evidence; the ADR~~ *2026-11-03 (`bapm-ABC-234-park`): A0 ruled; `ADR-0065` PROPOSED, premise not met on `main` (F4). **Parked** (the Orchestrator's ruling); re-opens on one of `ADR-0065` § Status's three premises. Intent GAIN on re-open* *2026-11-04 (`bapm-ABC-283-done`): **Done, delivered by `ABC-283`** (merged `58e90d07`); `ADR-0065` ACCEPTED as a bundle; DoR 10/10* |
| 9 | `ABC-236` | Aspiration windows at the root (S1) | M | P3 | ~~Backlog~~ **Done** *(2026-11-04, delivered by `ABC-283`)* | ~~9/10~~ **10/10** | ~~new ADR~~ *`ADR-0066`: premise not met (2026-11-03, `bapm-ABC-236-park`; **parked**, the Orchestrator's ruling `…38f865c3`)*; ~~`ABC-238`~~ *(lifted 2026-11-02: T1 not in force; the instability coupling returns with T1)* *2026-11-04 (`bapm-ABC-283-done`): **Done, delivered by `ABC-283`** (merged `58e90d07`); `ADR-0066` ACCEPTED as a bundle; DoR 10/10* |
| 10 | `ABC-231` | King table tapered by phase, alone | S | P3 | ~~Backlog~~ **closed: merged into `ABC-269` (E1)** *(2026-11-02, `bapm-E1-cut`; page `status: done`, `closed:` merged; the board move is the Orchestrator's)* | ~~9/10~~ — | ~~**to be merged into E1** at Phase 4's refinement~~ *folded: A1 → B7, A2 → B1 (b) / (d), A3 → B1 (a), A4 → B6, A5 → B4 + `G7`, A6 → B8* |
| 11 | `ABC-232` | Passed pawns by phase | S | P3 | ~~Backlog~~ **closed: merged into `ABC-269` (E1) and E4** *(2026-11-02, `bapm-E1-cut`; page `status: done`, `closed:` merged; the board move is the Orchestrator's)* | ~~9/10~~ — | ~~**to be merged into E1** (phase scaling) and E4 (passer terms)~~ *folded: A1 → B1 (e) (the within-5-cp clause replaced), A2 → B1 (a), A3 → B6, A4 → B4 + `G7`, A5 → B8; other passer terms → E4* |
| 12 | `ABC-239` | Weights tuned offline, constants only, validated outside (E2) | L | ~~P3~~ P2 *(2026-11-03, `bapm-owner-answers-1103`)* | ~~Backlog~~ ~~**Ready**~~ *(2026-11-03, `bapm-owner-answers-1103`; Ready for Dev is the Orchestrator's move)* **Done, closed NOT MET (first pull), not shipped** *(2026-11-04, `bapm-ABC-239-close`)* | ~~8/10~~ **10/10** | ~~E1; Q-3K-7; `ADR-0048` licence; the method ADR~~ *2026-11-03 (`bapm-E2pre-cut`):* `ABC-269` merged *(merged 2026-11-03, `54dee3f2`)* → `ABC-274` (E2-pre) merged (both hard); the method ADR is **`ADR-0067` PROPOSED** (reading (b): build first; A6's read and merge on *"accept ADR-0067"*, pending); data **Q-3K-7 (a) / (b) / (c)**, pending (own games by default under `ADR-0048`, so the build does not wait); **B-T8** pending, asked before the merge. Page aligned to `ADR-0067` B-T0–B-T8. Intent GAIN *2026-11-03 (`bapm-owner-answers-1103`): all met: `ABC-269` and `ABC-274` (`2410d4f7`) merged; `ADR-0067` ACCEPTED; data pinned (own + Lichess `2017-03`); B-T8 approved. One manual precondition: the export downloaded by hand and checked with `sha256sum -c`* *2026-11-03 (`bapm-owner-answers-1103b`): DoR unchanged. The fit waits on `ABC-270`'s merge (or its failed disposition); the candidate freeze for B-T7 / B-T8 waits on `ABC-279` (Q1) merging or missing; B-T8 is one `rpair` (the Orchestrator's ruling)* *2026-11-04 (`bapm-ABC-239-close`): **closed** under F3 / F4 as written (Orchestrator `…4c76bf7a`, path (iii)); `main` keeps E1's table; tool → `ABC-280`; a second pull is a new attempt after `ABC-271`* |
| ~~13~~ | `ABC-254` | Lazy legality (V2, O1-d) | M | P2 | **Returned to `EPIC-010`** 2026-11-01 (milestone 1b, first) | 10/10 | ~~**Q-SP-3**; the ADR amending `ADR-0003`; `EPIC-010`'s `ABC-252` (or where the O1-b chain stops)~~ none (yes `…f7a50e95`; `ADR-0003` amended, `89af8b56`) |
| 14 | `ABC-262` | The lazy-legality rows read the board shapes they missed: `hasLegalMove`'s early exit on a pawns-first board, and the in-check quiet queen promotion with black to move (phase 0, M0; test-only, from QE-261-a and QE-261-b, both LOW; cut 2026-11-01, `bapm-qe-gaps-1101b`) | XS | P3 | ~~Backlog (Ready recommended)~~ **Done** 2026-11-01 (merged `2cf2bb69`; QE PASS_WITH_GAPS `…ed4d02a5`; A4 waived by the Orchestrator, marked on the page by `bapm-spike-accel`) | **10/10** | `ABC-261` merged (`12e78c4d`); no ADR of its own; recommended after `ABC-250` merges or is dropped, before `EPIC-010`'s `ABC-252`; does not hold `EPIC-010`'s close |
| 15 | `ABC-263` | **SPIKE** (records only, Architect): can `skytalix` use the NPU, the iGPU and more CPU threads from Node.js on this host, and share search info between them? Q1 accelerators (with and without a net), Q2 threads (Lazy SMP, shared TT), Q3 shared or device memory on the APU, Q4 the owner's rules it would meet; it recommends and changes no rule (owner `…78c476bf`; cut 2026-11-01, `bapm-spike-accel`) | M | P2 | ~~Backlog~~ **Done** *(2026-11-01 on the board: `qe-ABC-263` PASS_WITH_GAPS `…f9116735`, merged `749a7fe3`, UAT waived; page `status: done` 2026-11-03, `bapm-epic011-cut`)* | **10/10** | none hard. **Where it sits:** outside phases 0–5, any time, records only; no phase ticket waits on it and it waits on none. Its follow-ups need the owner to open scope (§ Out of scope: threads, neural). *2026-11-02 (`bapm-threads-cut`): `ADR-0057` ACCEPTED; threads opened and cut as rows 17–19; neural later (OQ-6)* |
| 16 | `ABC-264` | P2: reverse futility (static null move) at remaining depth 1–3, behind an `ADR-0026` off-door pair, with mate, check and zugzwang guards (Phase 2, first; cut 2026-11-02, `bapm-phase1-pause`) | S | P2 | ~~Backlog~~ ~~**In Development** *(2026-11-02, the Orchestrator's pull `0b73f51d`; page by `bapm-ABC-264-rows`)*~~ **dropped: closed, not merged, retry DROP** *(2026-11-02, `bapm-phase2-records`; page `status: dropped`; the board move is the Orchestrator's; code `4d1c0616` kept)* | ~~9/10~~ **10/10** | ~~the ADR (margin, depth range, guards, door names; `ADR-0026` d10) — the Architect's; then Ready~~ *2026-11-02:* `ADR-0059` written, PROPOSED; reading (b): build now, read (A6) and merge on the owner's acceptance *2026-11-02 (`bapm-threads-cut`): **ACCEPTED** ("R yes"); A2's static-score sentence re-worded (≤ 10 885 cp, `QE-264-b`)* *2026-11-02 (`bapm-ABC-265-rows`): **A6 NOT MET**, 44.0 / 100 (30 / 28 / 42, −41.9 ± 58.5 Elo, 0 time losses); smoke 7.0 / 10 MET (not pooled); Levels 57 / 57 MET; **not merged** (`ADR-0059` F5); **Blocked, closed-not-merged, pending the Architect's retry ruling** (not decided here); code on `grugops/ABC-264-fix` `4d1c0616`* *2026-11-02 (`bapm-phase2-records`): the Architect's retry ruling is **DROP** (`arch-phase2-rebase` `…f9f440c9`); `ADR-0059` accepted, not in force; waits on nothing. A re-cut is a new ticket with a named new premise (`ADR-0059` § Status); `QE-264-p2-b` open for tools; S′ unpooled* |
| 17 | `ABC-265` | **TH-1:** one lockless shared table, four `Uint32` words a slot over a `SharedArrayBuffer` with an XOR check, 2^18 slots, 4 MiB, node-equal to `main` at `Threads 1` (value-identical; no game read; `G4`, `G6` and the profile) (cut 2026-11-02, `bapm-threads-cut`) | M (L on its fallback) | P2 | ~~Backlog~~ **Done** *(2026-11-02, merged `605874b8` on the owner's "25 yes"; QE PASS_WITH_GAPS `…d9879b9c` signs UAT; post-merge 2 388 / 2 388; page `status: done`, `bapm-E1-cut`)* | ~~9/10~~ **10/10** *(2026-11-02, `bapm-ABC-265-rows`)* | ~~the `ADR-0025` amendment (decision 2, decision 4's last bullet), the Architect's; the owner's when written (reading (b))~~ *2026-11-02:* the amendment is written, PROPOSED (`arch-ABC-265`); A2 gains T10; no S2 reading (the Orchestrator's ruling); reading (b): build may start, merge waits on the owner's acceptance. Pullable beside Phase 2 |
| 18 | `ABC-266` | **TH-2:** a Lazy SMP worker pool behind a UCI `Threads` option, default 1; `Threads 1` node-equal; read once, `Threads N` against `Threads 1` at 100 ms, GAIN, labelled a hardware gain (cut 2026-11-02) | L *(20–45 h with `ABC-267` folded, 2026-11-02)* | P2 | Backlog | **9/10** | `ABC-265` merged; ~~a new ADR amending `ADR-0044` D3 and D5 (D5's reversal pre-accepted, OQ-1); M and N fixed on the page; whether `d` sets `Threads` per side (`UNKNOWN - verify`)~~ *2026-11-02 (`bapm-ABC-266-rows`): `ADR-0062` written, PROPOSED (reading (b)); M = N = 12 (8 / 8 on "max 8"); `d` cannot set `Threads`, so scope 5 (`--threads N`) is owed; `ABC-267`'s rows folded in (A3, A5, A8; A6 `G8` at zero real-worker rows). Row 10 waits only on `ABC-265`'s merge. **The D12 timing probe (`qe-ABC-266-d12`) comes before Development**; a "not above" reading sends the design back to the Architect. The merge waits on the owner's acceptance of `ADR-0062` and on A7* *2026-11-02 (`bapm-P3-page`): **the D12 probe read MISS**, not loaded (median 7 at `Threads 1`, 4 and 12 at 100 ms; `qe-ABC-266-d12` `…9f9aeb87`). **Development blocked** until the Architect's re-proposal (`arch-ABC-266-repropose`) and this page's re-cut; DoR 9/10 with row 10 blocked twice; `RISK-EPIC011-09` realised* *2026-11-02 (`bapm-records-1102c`): re-proposal NO WIN (`…b6305641`); **PARKED by the owner** ("park threads", `…773be7de`); `ADR-0062` PROPOSED, not in force; `ABC-265` merged `605874b8`; S′ `--elo 1810`* |
| 19 | `ABC-267` | **TH-3:** multi-worker property rows across thread counts, the multi-writer torn-entry stress, `NFR-009` summed over workers, the default lane's wall before and after its one 2-worker row (test-only; cut 2026-11-02) | S | P2 | ~~Backlog~~ **closed: folded into `ABC-266`** *(2026-11-02, `bapm-ABC-266-rows`; the Orchestrator's ruling, `ADR-0062` D13; page `status: done`, `column: Done`, `closed:` folded; the board move is the Orchestrator's)* | ~~9/10~~ — | ~~`ABC-266` merged and its ADR (M, the deep flag); **may fold into `ABC-266`** (the Orchestrator's call)~~ *folded: A1 → `ABC-266` A3, A2 → A8 (plus probe-then-cutoff), A3 → A5, A4 → zero default-lane rows, A5 → A6; scope 5 (the 2^10 seam) dropped* |
| 20 | `ABC-268` | **P3:** futility pruning skips the late quiet moves at null-window nodes of remaining depth 1–3 (margins 150 / 350 / 550 cp), in both recursions, behind an `ADR-0026` test-only off-door pair (Phase 2, first; cut 2026-11-02, `bapm-P3-page`) | S | P2 | ~~Backlog *(Ready recommended; the board move is the Orchestrator's)*~~ **Done** *(2026-11-02, merged `e72487e1`; QE PASS_WITH_GAPS `…186a743e` signs UAT; page `status: done`, `bapm-records-1102c`)* | **10/10** *(reading (b))* | ~~`ADR-0061` PROPOSED (`arch-phase2-p3`): the build may start; A6 (C2′ GAIN ≥ 50.0 of 100, S′, the Levels deep lane) and the merge wait on the owner's acceptance. Shares `src/search.ts` / `src/engine.ts` with the parked P1 (the second to merge re-reads its door counts) and with `ABC-266` (blocked). Intent GAIN~~ *2026-11-02: nothing. `ADR-0061` ACCEPTED ("61 yes") and in force; A6 **58.0 / 100** (W / D / L 41 / 34 / 25, +56.1 ± 56.1 Elo), S′ 8.0 / 10 at E 1 650 (pooled), Levels 57 / 57; post-merge 2 429 / 2 429* |
| 21 | `ABC-269` | **E1:** the evaluation is tapered by one linear phase (N 1, B 1, R 2, Q 4, out of 24); every term a middlegame / endgame pair in one data-only parameter table; at E1 only the king square (40 − 15 m) and the passed pawns (2 × by rank) get endgame halves, behind an `ADR-0026` test-only off-door pair. **Folds `ABC-231` and `ABC-232`** (Phase 4, pulled forward; cut 2026-11-02, `bapm-E1-cut`) | M | P2 | ~~Backlog *(Ready recommended; the board move is the Orchestrator's)*~~ **Done** *(2026-11-03, merged `54dee3f2`; QE PASS_WITH_GAPS `…eff2fe64` signs UAT; B8 57.0 / 100, GAIN met, +49.0 ± 59.5 Elo; S′ 7.0 / 10 at E 1 810; Levels 57 / 57; post-merge 2 566 / 2 566; page `status: done`, `bapm-269-done`)* | **10/10** *(reading (b))* | ***2026-11-03 (`bapm-269-done`): nothing; merged. The history follows.*** `ADR-0064` PROPOSED (`arch-E1`): the build may start; B8 (C2′ GAIN ≥ 50.0 of 100, S′ at E 1 810, the Levels deep lane) and the merge wait on *"accept ADR-0064"*; B7 (`G6`) graded once `Q-3K-4` is answered; QE freezes the 6 king-and-pawn endings, the passer readings and ≥ 15 mirror positions before the build; B0's counts re-derived with `patch_e1.py` if `main`'s `src/` moves (tree `58fa3eb4` at the cut). Intent GAIN *2026-11-03 (`bapm-epic011-cut`): **`ADR-0064` ACCEPTED** ("64 yes", `…cc7db847`): B8 and the merge follow the build and QE; **`Q-3K-4` = (b)**: B7 graded on the depth-6 floor, "≥ base" reported; F3's `G6` half void. ~~`QE-269-a` (B1 (d)'s scope) is the Architect's ruling, placeholder on the page.~~ Board: In Development (the Orchestrator's)* *2026-11-03 (`bapm-ABC-269-fold`): `ADR-0064` ACCEPTED 2026-11-02; B7 under `Q-3K-4` = (b). `QE-269-a` ruled (a) (`…8ccb561f`): B1 (d) graded on D1–D6; S1–S3 a report in the PR, `ABC-270`'s. Two wording fixes, bars unchanged (d2 delta form only; B1 (e) ≥ 1.6 × under trunc). DoR 10/10* |
| 22 | `ABC-270` | **E3a:** ~~king safety by phase: the exposure terms get endgame halves on E1's table and scale with the enemy queen (the `ADR-0031` addendum's queen scale and shelter gate, accepted 2026-10-24 and never shipped, re-read over E1), behind an off-door pair, judged on play under `Q-3K-4` (b)~~ *2026-11-03 (`bapm-owner-answers-1103b`, `ADR-0068` ACCEPTED):* **structure only: three queen-on exposure pairs at `{ 0, 0 }`, value-identical and node-identical, no switch, no doors, no games; `ABC-239`'s first pull fits them** (Phase 4; cut 2026-11-03, `bapm-epic011-cut`) | ~~M~~ **S** | P2 | ~~Backlog~~ **Ready** *(Ready for Dev is the Orchestrator's move)* | ~~9/10~~ **10/10** | `ABC-269` merged *(merged 2026-11-03, `54dee3f2`)*; the ADR (a dated re-open of the addendum on E1, or a new ADR; reading (b)); ~~the `QE-269-a` ruling (scope 1's home)~~ *(2026-11-03: ruled (a); scope 1 and S1–S3 at ≥ 20 cp are here)*. Intent GAIN *2026-11-03 (`bapm-E2pre-cut`):* in the order, after `ABC-239` (fitted weights); if `ABC-239` stalls on data, this may go first on its rule values. The tuner's king-table finding (≈ 3 × heavier in every fit) supports its premise *2026-11-03 (`bapm-owner-answers-1103`; owner `…af126c04` item 8): its **design** may start now (`arch-ABC-270`, running); the build order stays after `ABC-239` under the stall clause* *2026-11-03 (`bapm-owner-answers-1103b`): **all met.** `ADR-0068` ACCEPTED (`…401c3d09`); `ABC-269` and `ABC-274` merged. It goes **before `ABC-239`'s fit**; QE freezes ≥ 6 queen pairs before the build; K0–K4 (exact node counts, `Object.is`, 0 re-pins, `G2` ≤ 1.05 ×, `G6` ≥ base); S2 nps reported only. Intent GAIN struck* |
| 23 | `ABC-271` | **E4a:** passed pawns read the kings and the path: endgame-only king distance to the queening square, a free path, and the unstoppable passer by the rule of the square, each by a stated rule, behind an off-door pair (Phase 4; cut 2026-11-03) | ~~M~~ **S** | P3 | ~~Backlog~~ **Ready** *(2026-11-04, `bapm-ABC-271-ready`, merged `af0b0ae6`; the board moves are the Orchestrator's)* | ~~9/10~~ **10/10** | `ABC-269` merged *(merged 2026-11-03, `54dee3f2`)*; a new ADR (rules, values, where the king-dependent part sits beside the pawn memo; firing figure at 100 ms). Intent GAIN unless the ADR names NEUTRAL (invisible at 100 ms) before Ready *2026-11-03 (`bapm-E2pre-cut`):* in the order, after `ABC-239` (king distance and free path become fitted weights; `ADR-0067` § Consequences 5) *2026-11-04 (`bapm-ABC-239-close`):* **next, and before a second E2 pull** (F4's missing features; Orchestrator `…4c76bf7a`); in design, `arch-ABC-271` (the board's) *2026-11-04 (`bapm-epic011-areas`, from the merged page; `arch-ADR-0070-accept` `…212d6a4c` § 5): **`ADR-0070` ACCEPTED, form (a), structure only at 0**: value- and node-identical, no switch, no doors, no games (K0–K4, F1–F5). Next `qe-ABC-271-freeze`, then the build. **Then E2's second pull**, one read judging both (§ Dependencies)* |
| 24 | `ABC-272` | **E7a:** won and drawish endings: mop-up for pawnless wins (KQK, KRK, KBNK) and a scale toward 0 for drawish material, each half premise-gated by a pre-registered probe, behind an off-door pair (Phase 4; cut 2026-11-03) | M (S per half) | P3 | Backlog | 9/10 | `ABC-269` merged *(merged 2026-11-03, `54dee3f2`)*; the premise probe (≤ 10 / 12 conversions at 47 000 nodes; ≥ 100 cp on ≥ 5 / 10 drawish), then a new ADR; both premises fail → closed as dropped. Intent named by the ADR before Ready *2026-11-03 (`bapm-E2pre-cut`):* order free relative to `ABC-274` / `ABC-239` (`ADR-0067` § Consequences 6) |
| 25 | `ABC-273` | **R1:** the first milestone reading, after E1 merges and before the next evaluation merge: 200 games at 100 ms against Stockfish 19 at the band-rule E, X ± Y and the highest milestone met (QE reading, records only; cut 2026-11-03) | S | ~~P3~~ P2 *(the Orchestrator, 2026-11-03)* | ~~Backlog *(held on `ABC-275`, 2026-11-03)*~~ **Done** *(2026-11-03, merged `20d539e1`; QE `…07b3c794`: 99.0 / 200 at E 1 810, X = 1 806.5 ± 47.4, milestone none; page `status: done`, `bapm-sec-cut`)* | ~~9/10~~ **10/10** *(2026-11-03, `bapm-R1-cut`)* | `ABC-269` merged *(merged 2026-11-03, `54dee3f2`)*; ~~the control ruling (R1–R3's survival; the exact `r` / `rpair` command)~~ *ruled 2026-11-03 (`…8136b589`): R1–R3 survive at 100 ms; the command is `r <main-sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1` with `CUTECHESS_CLI` and `STOCKFISH` set*; **`ABC-275` merged** (hard); before the next value-changing merge (the Orchestrator's placement); about 0.4–0.9 h (estimate), asked only if over 1 h or E steps |
| 26 | `ABC-274` | **E2-pre:** every term enters the blend (`ADR-0064` d2's delta form; a packed score recommended), value-identical at E1's table: the same scores and node counts; no games (Phase 4, between E1 and E2; cut 2026-11-03, `bapm-E2pre-cut`) | S | P2 | ~~Backlog~~ **Ready** *(2026-11-03, `bapm-269-done`; the Orchestrator pulled it to In Development, `se-ABC-274`)* *2026-11-03 (`bapm-sec-cut`): **QE PASS_WITH_GAPS, UAT signed** (`…fa87f74d`); board: **Ready to Release**; merge waits on "accept ADR-0067"* **Done** *(2026-11-03, merged `2410d4f7` on the owner's acceptance of `ADR-0067`; post-merge `npm test` 2 588 / 2 588; page `status: done`, `bapm-owner-answers-1103`)* | ~~9/10~~ **10/10** | ~~`ABC-269` merged (held on `ADR-0064` F3, `arch-ABC-269-F3`)~~ *`ABC-269` merged `54dee3f2` (met)*; the Architect's E2-pre disposition line in `ADR-0067` (owed before Ready); the merge waits on *"accept ADR-0067"* (pending; reading (b)); the S2 ruling (the Orchestrator's; BA/PM recommends the `ABC-265` exception). Bars: node identity (B0's 11 + the 190 cross-build), `Object.is`, every term's blend live, `G3`, `G2` ≤ 1.05 ×, `G6` "≥ base" graded (not a value change), 0 test expectations moved |
| 27 | `ABC-275` | **R1's harness:** `tools/rating/rating.ts r` accepts `--budget-ms 100`, with skytalix at `st=0.1` / 50 and Stockfish at `st=0.1` / 2 000; at 100 ms `--elo` above 2 600 is refused; every other argv, default, pin and dry-run print stays byte-equal (`tools/` only; `ABC-255` item 2 narrowed to `r`; cut 2026-11-03, `bapm-R1-cut`) | S | P2 *(the Orchestrator's brief: it gates R1; the Architect wrote P3)* | ~~**Ready**~~ **Done** *(2026-11-03, merged `85a304ff`; QE PASS_WITH_GAPS `…8d38c358`; A6 met at R1; page `status: done`, `bapm-sec-cut`)* | **10/10** | `ABC-255` Done; the ruling `…8136b589` (`ADR-0056` D6). Blocks `ABC-273`. `tools/rating/` only, so it can run beside `ABC-274` by width |
| 28 | `ABC-276` | **Records:** `tools/rating/rating.ts r` and `d` redact their records like `rpair` (host paths, user and host name as placeholders); `SHA256SUMS` after redaction; the played argv byte-equal; `usage()` names r's 100 (folds `QE-275-a`); tools only (`ADR-0049` D4; `QE-273-b`, `SEC-HP-1`; cut 2026-11-03, `bapm-sec-cut`) | S | P2 *(the Orchestrator's brief: public repo)* | ~~**Ready**~~ **Done** *(2026-11-03, merged `3dd27cfc`; QE PASS_WITH_GAPS `…a79db6c1`; page `status: done`, `bapm-gaps-1103`; `QE-276-a` / `-b` accepted LOW with re-open triggers on the page)* | **10/10** | none hard; preferred before R2. `tools/rating/` only |
| 29 | `ABC-277` | **Records:** a diff-scoped records path check over added lines under `.grugops/`, `plans/`, `memory-bank/` (and added or changed `.gz`): home path, slug form, `/Users/<name>`, scratch path, `pgrep -a` argv; file and class only, never the value; the Orchestrator runs it before each merge; the placeholder rule as a standing ruling with the hostname exemption (`ADR-0049` D4; `SEC-HP-1`, `SEC-HP-2`; cut 2026-11-03, `bapm-sec-cut`) | M *(low end)* | P2 *(the Orchestrator's brief)* | ~~**Ready**~~ **Done** *(2026-11-03, merged `541ddf45`; QE PASS_WITH_GAPS `…98c1d275`; A7 not done, owner pending; page `status: done`, `bapm-gaps-1103`; `QE-277-a`…`-f` → `ABC-278`)* | **10/10** | none hard; A7 (SEC-HP-2's one-line redaction) only on the owner's yes, pending *2026-11-03 (`bapm-owner-answers-1103`): SEC-HP-2 answered yes (item 7); **A7 done** at `1e558566` (`<foreign: vitest> count=3`; 3 processes, not 2)* |
| 30 | `ABC-278` | **Records:** the records path check hardened: added lines read as text whatever `.gitattributes` says (the verdict no longer depends on the checkout; `QE-277-a` MEDIUM); `.xz` decompressed like `.gz`; wider foreign-argv (flags before the path, a lone absolute executable, `ps -ef` / `ps aux`) with ≤ 10 new non-process hits; home before `.` / `-` / `_`; quoted names printed clean; both homes read, runbook line on the real `HOME` (`ADR-0049` D4; `QE-277-a`…`-f`; cut 2026-11-03, `bapm-gaps-1103`) | S *(upper end)* | P2 *(the Orchestrator's brief)* | **Ready** *(the column move is the Orchestrator's)* | **10/10** | none hard (`ABC-277` Done). `tools/grugops/records-path-check*.js` and one line of `memory-bank/70-runbook.md` |
| 31 | `ABC-279` | **Q1:** quiescence skips SEE-losing captures out of check (no promotion, not the king, a lesser victim, `see < 0`), behind an `ADR-0026` off-door pair; in check every evasion is searched; the main search is unchanged; a new pure `src/see.ts` (288 B fixed); one switch `seePruning` in both recursions, reaching `quiesce` through its rules record (`ADR-0069`; Phase 3; cut 2026-11-03, `bapm-owner-answers-1103b`) | S–M *(front matter M)* | P2 | **Ready** *(Ready for Dev is the Orchestrator's move)* | **10/10** | none hard: `ADR-0069` ACCEPTED (`…401c3d09`). **Slot:** merges or misses before `ABC-239`'s candidate freeze for B-T7 / B-T8. No file collision with `ABC-239` or `ABC-270`; whichever merges second re-reads its instrument counts. Intent GAIN; on a miss, closed unmerged under S1 (`EPIC-008`'s ship rule, not row S1) |
| 32 | `ABC-280` | **`tools/tune` lands alone:** `ABC-239`'s tuner (tracer, PGN reader, bounds, fit, tests) from `grugops/ABC-239b`'s four tool commits, with no `src/` change; B-T1 (0 misses) and B-T3 (two byte-identical emissions, to scratch) read on `main`'s table; tools only, UAT waived (Phase 4; cut 2026-11-04, `bapm-ABC-239-close`) | S | P3 | **Ready** *(Ready for Dev is the Orchestrator's move)* | **10/10** | none hard; the Lichess export present and `sha256sum -c` OK (manual). Before a second E2 pull; if `ABC-271` adds terms first, its identity gate may miss (STOP to Architect/Design) |
| 33 | `ABC-281` | **Lane hygiene:** three named rows move to their own files' existing deep lanes (`QE-208-a` position-6 → `SEARCH_DEEP`; `ABC-230` A4 and levels A9 → `ENGINE_DEEP`), about −0.38 s; `AGENTS.md`'s null-move count at 0 B; `NFR-008` re-read graded with an identity twin, ALONE; test-only, UAT waived (outside the phase order; `R-N8H-1`; cut 2026-11-04, `bapm-nfr008-rows`) | S | P2 | **Ready** *(2026-11-04, `bapm-ABC-281-dor`; the board shows In Development, the Orchestrator's)* | **10/10** *(row 11 met: S, S, S, `arch-ABC-281`)* | an ALONE slot for the graded read |
| 34 | `ABC-282` | **W1:** time use under a clock: no iteration started that the clock says cannot finish; a partial iteration's root move kept when it beat the incumbent (amends `ABC-078` A3); a soft and a hard limit a move inside the `NFR-004` ceilings; `EPIC-009` M1 / M2 kept; read under a clock (Phase 5; cut 2026-11-04, `bapm-W1-bundle-cut`) | ~~M *(L with a harness ticket)*~~ **L** *(2026-11-04)* | P2 | ~~Backlog~~ **Ready** *(2026-11-04, `bapm-ABC-282-adr`; the column moves are the Orchestrator's)* | ~~**9/10**~~ **10/10** | ~~**the ADR, owed by the Architect** (row 10); whether `ABC-255`'s harness plays a clock read (`UNKNOWN - verify`; a tools ticket if not);~~ builds after `ABC-283` on `src/engine.ts`. Before the first 40/15 reading *2026-11-04 (`bapm-ABC-282-adr`): **`ADR-0071` PROPOSED** (OQ-0071-1 pending; reading (b)); the harness cannot play a clock, so **`ABC-300` (row 52) lands before A6**; after `ABC-283` (D12). The merge waits on A6 and the owner's acceptance* *2026-11-04 (`bapm-owner-answers-1104`): **`ADR-0071` ACCEPTED 2026-11-04** (OQ-0071-1, (a)); `ABC-300` merged `4ea39135`. The merge waits on A6 only; still after `ABC-283`* *2026-11-04 (`bapm-ABC-283-done`): `ABC-283` merged `58e90d07`: **unheld**; Ready, 10/10* *2026-11-04 (`bapm-ABC-302-cut`): **builds after `ABC-302` merges**; a default-lane budget of ≤ +0.10 s, and the identity slice goes deep (`…112cd856` rulings 2, 3)* |
| 35 | `ABC-283` | **The O1h + O3s + S1 bundle:** `ADR-0063` (history), `ADR-0065` (SEE orders losing captures, on `src/see.ts`) and `ADR-0066` (root aspiration) on one branch, each behind its own door plus one all-off door; P0 all-off = `main` exactly, the `ADR-0064` d7 safety rows, `NFR-008` ≤ 10 s; ONE read, 100 games at 100 ms against `main`, GAIN ≥ 50.0, PREREG first, never re-played; pass: merged and the three ADRs accepted as a bundle; miss: the three stay parked (Phase 3; the owner's word `…4c4cb03d`; cut 2026-11-04, `bapm-W1-bundle-cut`) | L | P2 | ~~**Ready** *(Ready for Dev is the Orchestrator's move; `se-ABC-283` queued)*~~ **Done** *(2026-11-04)* | **10/10** | none hard (the three ADRs are the design; `src/see.ts` on `main`). Open for the Orchestrator, not bars: S′ and the Levels lane, the ADRs' drift bars, `G6` *2026-11-04 (`bapm-ABC-283-done`): **Done** (merged `58e90d07`; QE PASS_WITH_GAPS `…de1dc511`, C2′ 66.0 / 100, Elo +115.2 ± 67.0); B5's pass branch: the three ADRs ACCEPTED as a bundle; § Open ruled (`…3851bf43`)* |
| 36 | `ABC-284` | **P1:** late-move reductions from a log table of remaining depth × move index, replacing the flat 1-ply LMR, behind an off-door pair; **parked** (Phase 2; cut 2026-11-04, `bapm-epic011-areas`) | S–M | P2 | Backlog, **parked** | 9/10 | a new named premise with its own pre-registered probe (`ADR-0060` re-open, the Architect's): E1's tree (on `main`, no re-probe on record), `ABC-283` merged, or the second pull. Bars `ADR-0060` d8 / d9 by reference. Intent GAIN *2026-11-04 (`bapm-ABC-283-done`): `ABC-283` merged; premise (2) on `main`, still parked; R-283-LMR first (`ADR-0060` § Status)* |
| 37 | `ABC-285` | **P5:** the null-move R grows with depth and eval margin, amending `ADR-0050`'s fixed R = 3; NEUTRAL (invisible at 100 ms) with a deep-depth bar; **deferred** (Phase 2) | S | P3 | Backlog, **deferred** | 9/10 | the `ADR-0050` amendment with its deep-depth bar (the Architect's; the owner accepts); the Orchestrator's pull |
| 38 | `ABC-286` | **P4:** late-move (move-count) pruning at low depth, over a history-ordered quiet list; ~~**held**~~ *design page of `ABC-303`* (Phase 2) | S | P3 | Backlog, ~~**held**~~ *design page* | ~~9/10~~ 10/10 | `ABC-283` merged (history on `main`), then a joint probe with history as its input (`ADR-0063` decision 11) meeting every bar; the ADR *2026-11-04 (`bapm-ABC-283-done`): `ABC-283` merged `58e90d07`: unheld for its probe; held on the probe and the ADR* *2026-11-04 (`bapm-lines-1104b`): `ADR-0072` PROPOSED, premise not met; held on OQ-0072-1* *2026-11-04 (`bapm-bundle-1-cut`): `ADR-0072` ACCEPTED over a missed premise; built and read as `ABC-303`; on NOT MET, held again (B6)* |
| 39 | `ABC-287` | **P6:** razoring at low depth; **held**, rejected on today's evaluation (Phase 2) | S | P3 | Backlog, **held** | 9/10 | E2's second pull merged, then the Architect's re-measure on the rows it failed; fails again → dropped |
| 40 | `ABC-288` | **O2c:** countermove ~~and continuation history~~ on top of the history table; ~~**held**~~ *design page of `ABC-303`* (Phase 3) | M | P3 | Backlog, ~~**held**~~ *design page* | ~~9/10~~ 10/10 | `ABC-283` merged, or on a miss the Architect names O2c as O1h's re-open premise; the ADR; `NFR-009` ≤ 16 MiB in all *2026-11-04 (`bapm-ABC-283-done`): `ABC-283` merged `58e90d07`: unheld for its probe; held on the probe and the ADR* *2026-11-04 (`bapm-lines-1104b`): `ADR-0073` PROPOSED, premise not met; held on OQ-0073-1* *2026-11-04 (`bapm-bundle-1-cut`): `ADR-0073` ACCEPTED over a missed premise, form C1; built and read as `ABC-303`; on NOT MET, held again (B6)* |
| 41 | `ABC-289` | **Q2:** delta pruning in quiescence; ~~**held** on~~ ~~`ADR-0024` d4 and a re-measure~~ ~~the Architect's re-measure over Q1 and its ADR~~ *2026-11-04: out of check, margin 200 cp, a skip returns the skipped capture's bound; `ADR-0074` ~~PROPOSED~~ ACCEPTED, premise met* (Phase 3) | S | P3 | ~~Backlog, **held**~~ **Ready** *(2026-11-04, `bapm-lines-1104`; the column moves are the Orchestrator's)* | ~~9/10~~ **10/10** | ~~**`Q-3K-10`** (the owner: open d4 for Q2's design);~~ ~~the Architect's re-measure on `main` over Q1; the ADR~~ *2026-11-04 (`bapm-owner-answers-1104`): `Q-3K-10` answered yes; **held on the Architect's re-measure over Q1 and its ADR** (a new ADR that amends d4)* *2026-11-04 (`bapm-lines-1104`): the re-measure and the ADR are done. **OQ-0074-1** holds the merge, not the build (reading (b)); DP4 reads it. One at a time with `ABC-282` and bundle 1; not yet scheduled (`…085f647c` 5)* *2026-11-04 (`bapm-bundle-1-cut`): OQ-0074-1 answered yes. **After `ABC-303`, alone:** the build starts when its merge or `failed-attempt` is recorded; on top of the bundle if it merged, on `main` without it if NOT MET; DP4 reads it* |
| 42 | `ABC-290` | **E3b:** king attack, attackers on the king zone weighted by piece and tapered; weights from a pull after the second (Phase 4) | M | P2 | Backlog | 9/10 | E2's second pull merged or closed; the ADR (form (a) structure at 0 or (b) rule values; the zone; the G2 ratio); the emitter learns its exports |
| 43 | `ABC-291` | **E4b:** connected / phalanx and backward pawns, tapered; weights from a pull after the second (Phase 4) | S–M | P3 | Backlog | 9/10 | E2's second pull merged or closed; the ADR (definitions, the pawn memo, the form) |
| 44 | `ABC-292` | **E5:** bishop pair, rook on open / semi-open files, outposts, mobility per piece; the new weights from a pull after the second (Phase 4) | M | P2 | Backlog | 9/10 | E2's second pull merged or closed; the ADR (an `ADR-0031` change for mobility's form); split per term if the forms differ |
| 45 | `ABC-293` | **E6:** threats (pawn attacks on pieces, hanging pieces) and tempo; weights from a pull after the second (Phase 4) | M | P3 | Backlog | 9/10 | E2's second pull merged or closed; the ADR, with tempo's relation rows |
| 46 | `ABC-294` | **E7b:** rook-pawn and wrong-bishop draws and rook-ending rules, each premise-gated, behind an off-door pair (Phase 4) | M | P3 | Backlog, **premise-gated** | 9/10 | `ABC-272`'s premise probe read; this page's probe and ADR; no premise → dropped; order free relative to the tuner |
| 47 | `ABC-295` | **R2:** the milestone reading at Phase 4's close, R1's shape: 200 games at 100 ms against Stockfish at the band-rule E (QE reading, records only) | S | P2 | Backlog, **held** | **10/10** | Phase 4's close (which tickets close it: the Orchestrator's ruling); ≤ 1 h or asked; re-run once, asked first |
| 48 | `ABC-296` | **X1:** a check extension at every depth, bounded, behind an off-door pair; not `ABC-210`'s horizon form (Phase 5) | S | P3 | Backlog | 9/10 | the ADR (new, or a revival of part of `ADR-0051`) |
| 49 | `ABC-297` | **X2:** singular extension and IIR from the stored entry's depth and bound, behind an off-door pair (Phase 5) | M | P3 | Backlog | 9/10 | a premise probe on usable entries, then the ADR; IIR split out if landed first |
| 50 | `ABC-298` | **V3:** staged move generation: the hash move before generating, captures before quiets (Phase 5) | M | P3 | Backlog | 9/10 | the ADR (value-identical with S2, or value-changing with C2′); after `ABC-283` on `orderMoves`; V2 met (`3bfe180e`) |
| 51 | `ABC-299` | **R3:** the milestone reading after Phase 5, R1's shape; above E 2 600, C3′'s probe first (QE reading, records only) | S | P3 | Backlog, **held** | **10/10** | Phase 5's close; C3′'s probe only if E > 2 600. The 40/15 claim is not this ticket |
| 52 | `ABC-300` | **W1's harness:** `tools/rating/rating.ts d` accepts `--tc 40/8` (both skytalix sides `tc=40/8`, `timemargin=0`, `option.TimeMode=uci-clock-mode` in place of `st=` / `timemargin=`); a `control:` line and a dry-run row; any other `--tc` value and `--tc` with `--budget-ms` refused; every existing argv byte-equal; 0 `src/` lines (tools only; `ADR-0071` D10; cut 2026-11-04, `bapm-ABC-282-adr`) | S | P2 | **Ready** *(the column moves are the Orchestrator's)* | **10/10** | none hard; no new ADR (`ADR-0056` R-TC part 1 item 1, `ADR-0071` D10). `tools/rating/` only. **Blocks `ABC-282` A6** (not its build). If the owner declines `ADR-0071`, it loses its planned consumer (the Orchestrator's call) |
| 53 | `ABC-301` | **E2's second pull:** the tuner fits again on a `main` with E4a's structure; every relation row bounded at once (`ADR-0067` d6 amendment: one fit, no refit); king distance and free path freed (eg ≥ 0, mg 0), U held at 0; four preconditions first (`QE-271-h`, `-g`, `-i`, `-f`); B-T0–B-T8 carried, B-T4 plus the endgame `G2` ≤ 1.02 ×; one read judges both E2 and E4a (B-T7, B-T8) (Phase 4; cut 2026-11-04, `bapm-ABC-301-cut`) | L | P2 | **Ready** *(the column moves are the Orchestrator's)* | **10/10** | none open: `ABC-271` (`872e5ffc`), `ABC-280` (`0c8b385a`) and `ABC-283` (`58e90d07`) merged; d6 amendment and B-T8 yes (`…dda43b71`). The four preconditions are its scope 0. `NFR-008` headroom from `secnfr-nfr008-1104` (in flight). `src/evaluate*.ts` one at a time with `ABC-272` *2026-11-04 (`bapm-ABC-302-cut`): headroom reported (9.84 s graded, `…1184fec4`); **scope 0 builds after `ABC-302` merges**; a default-lane budget of ≤ +0.10 s (`…112cd856` rulings 2, 3)* |
| 54 | `ABC-302` | **Lane hygiene:** nine named rows move to existing deep lanes in `ABC-281`'s form S, about −0.5 s. Part 1: null-move A2, `ABC-241` A5 (`uci-session`), futility "the rule changes the work", `ABC-075` ep property, `ABC-170` A5, levels A7 and `ABC-174` A3 go to their own files' lanes. Part 2: `cli.test` `ABC-241` A4 and `engine.capacity` `ABC-122` A8 go to lanes the Architect places. Each keeps a default-lane remnant, confirmed by mutant reads. `NFR-008` is re-graded with twin arms, target ≤ 9.4 s. No new file or lane line; test-only, UAT waived (outside the phase order; `R-N8H-1`; cut 2026-11-04, `bapm-ABC-302-cut`) | S | P1 | ~~Backlog~~ **Ready** *(2026-11-04, `bapm-ABC-302-dor`; the board shows In Development, the Orchestrator's)* | ~~9/10~~ **10/10** *(row 10 met: six S, three W, `arch-ABC-302`)* | ~~**`arch-ABC-302`** (row 10): a form and a confirmed remnant per row, A6's mutants, and R8 / R9 placement with their `-t` lines. R9's file-scoped mocks block a byte-identical move into `src/engine.test.ts`.~~ An ALONE slot for the graded read. Blocks `ABC-282` and `ABC-301` scope 0 *2026-11-04 (`bapm-ABC-302-dor`): R8 to `uci-session`'s `ENGINE_DEEP`, R9 option (ii) in its own file; parity on 27 mutants, no owner question* |
| 55 | `ABC-303` | **Bundle 1:** `ADR-0072` (P4, form M3) and `ADR-0073` (the countermove, form C1) on one branch, each behind its own door plus one all-off door; the bars are `ADR-0056` D5's dated block, tables 1–3; ONE read, 100 games at 100 ms against the merge-base, GAIN ≥ 50.0, never re-played, with S′ at E 1 810 and the Levels deep lane as bars; `ABC-286` and `ABC-288` stay the design pages (Phases 2 and 3; cut 2026-11-04, `bapm-bundle-1-cut`) | M | P3 | **Ready** *(the column moves are the Orchestrator's)* | **10/10** | none hard for the build; the C2′ read after `ABC-282` and `ABC-301` have each merged or been recorded as failed (the Orchestrator's slot); `ABC-289` after it |

The stubs of § Phases get ids when their phase is refined. **Ids `ABC-255`…`ABC-258` are taken here; `ABC-224` stays in
the Orchestrator's pool.** *(2026-11-02: `ABC-264` taken for P2.)* *(2026-11-02, `bapm-threads-cut`: `ABC-265`, `ABC-266` and `ABC-267` taken for
TH-1, TH-2 and TH-3.)* *(2026-11-02, `bapm-P3-page`: `ABC-268` taken for P3.)* *(2026-11-02, `bapm-E1-cut`: `ABC-269` taken for E1.)* *(2026-11-03, `bapm-epic011-cut`: `ABC-270`–`ABC-273` taken for E3a, E4a, E7a and R1.)* *(2026-11-03, `bapm-E2pre-cut`: `ABC-274` taken for E2-pre.)* *(2026-11-03, `bapm-R1-cut`: `ABC-275` taken for R1's harness.)* *(2026-11-03, `bapm-sec-cut`: `ABC-276` and `ABC-277` taken for the host-path tickets T1 and T2.)* *(2026-11-03, `bapm-gaps-1103`: `ABC-278` taken for the check's hardening.)* *(2026-11-03, `bapm-owner-answers-1103b`: `ABC-279` taken for Q1.)* *(2026-11-04, `bapm-ABC-239-close`: `ABC-280` taken for the tuner's tools-only landing.)* *(2026-11-04, `bapm-nfr008-rows`: `ABC-281` taken for the lane-hygiene row moves.)* *(2026-11-04, `bapm-W1-bundle-cut`: `ABC-282` taken for W1 and `ABC-283` for the O1h + O3s + S1 bundle.)* *(2026-11-04, `bapm-epic011-areas`, the owner's ruling 3: `ABC-284`–`ABC-299` taken for P1, P5, P4, P6, O2c, Q2, E3b, E4b, E5, E6, E7b, R2, X1, X2, V3 and R3, in § Phases' order. No stub is left without an id.)* *(2026-11-04, `bapm-ABC-282-adr`: `ABC-300` taken for W1's harness, `d --tc 40/8`.)* *(2026-11-04, `bapm-ABC-301-cut`: `ABC-301` taken for E2's second pull.)* *(2026-11-04, `bapm-ABC-302-cut`: `ABC-302` taken for the `NFR-008` headroom row moves.)* *(2026-11-04, `bapm-bundle-1-cut`: `ABC-303` taken for bundle 1.)* No moved ticket was renumbered.

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
| `ABC-233` history heuristic | O1h; O2c builds on it | **move** (Phase 3) | covered gap, no duplicate *2026-11-04 (`bapm-ABC-283-done`): delivered by `ABC-283` (merged `58e90d07`); Done* |
| `ABC-234` SEE ordering | O3s; Q1 (SEE pruning) needs it | **move** (Phase 3) | covered gap; its `ADR-0024` d4 evidence wait stands *2026-11-03 (`bapm-ABC-234-park`): parked (`ADR-0065`, premise not met); A0 ruled (d4 governs Q1, not O3s); Q1 no longer needs it (carries `see`)* *2026-11-04 (`bapm-ABC-283-done`): delivered by `ABC-283` (merged `58e90d07`, on `src/see.ts` from `ABC-279`); Done* |
| `ABC-236` aspiration | S1 | **move** (Phase 3, after T1) | covered gap; `ADR-0056` makes it depend on T1 *2026-11-03 (`bapm-ABC-236-park`): `ADR-0066`: premise not met; **parked**, Backlog; T1 is now its re-open condition, not a wait* *2026-11-04 (`bapm-ABC-283-done`): delivered by `ABC-283` (merged `58e90d07`); Done; T1 is no longer its re-open condition* |
| `ABC-237` TT replacement | T2; order against `ABC-238` | **move** (Phase 1, second) | covered gap; order C2 |
| `ABC-238` deeper cutoffs | T1 | **move** (Phase 1, first; P3 → P2) | covered gap, the cheapest real one; order C2 |
| `ABC-239` offline tuning | E2; Q-3K-7 | **move** (Phase 4, after E1) | covered gap; its wait on "milestone 2's evaluation" becomes E1 |
| `ABC-254` lazy legality | V2; `ABC-235`'s struck cut 4 ("cheaper legality for non-captures") | ~~**move** (Phase 5, whenever Q-SP-3 is yes)~~ **keep in `EPIC-010`, milestone 1b, first** (2026-11-01: the exception below was met) | it would hold `EPIC-010` open on an unanswered owner call; `ADR-0056` D6: "O1-d whenever the owner says yes (after O1-b)". Exception kept: on a yes plus its ADR before `ABC-250` enters development, the Orchestrator may pull it back into 1b, first (C11). Not a duplicate of `ABC-235`: cut 4 was struck, never built |
| `ABC-249` pre-root repetition row | `ADR-0056` Phase 0 | **keep** in `EPIC-010` | test-only, Ready, closes with `EPIC-010` |
| `ABC-250`…`ABC-253` milestone 1b | `ADR-0056` V1 / Phase 0 | **keep** in `EPIC-010` | `ADR-0055` D2/D4 and `ADR-0056` D6 both put O1 before every algorithm ticket, and the owner closes `EPIC-010` first, so the order holds without a move. `ABC-250` stays first (C3) |
| `ABC-223` `uci-clock-mode` smoke | `EPIC-011`'s 40/15 claim control | **keep** in `EPIC-009` | its 5 games prove the mode; the claim readings use it |
| `ABC-209` TT kept across moves (dropped) | T3 | **supersede by `ABC-257`**; stays dropped | re-tried after T1/T2 under a new id, reusing `grugops/ABC-209` `bb6cf451` and `ADR-0025` d4's accepted amendment. Its NEUTRAL +8.7 ± 18.3 stays on record |
| `ABC-210` horizon check extension (dropped) | X1 | **stays dropped**; X1 is a **different form** (every depth) | `ABC-228` covers the horizon case; re-running form (a) would do the same work twice |
| `ABC-205` king safety + taper (dropped) | E1 (taper half), E3 (king attack half) | **stays dropped**; E1 and E3 cite it | its forms on `grugops/ABC-205-final` `b5d5cea5` are input; it died on `G6` "≥ base" (Q-3K-4), not on play. *2026-11-03 (`bapm-ABC-269-fold`): `Q-3K-4` answered (b) 2026-11-02; a re-try under E3 (`ABC-270`) is judged on play* |
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
| C10 | The R smoke (E = 1 910) loses meaning as the engine climbs (a 2 400 engine scores ≈ 95 % against it; S-4's 3.0 of 10 then guards nothing) | risk `RISK-EPIC011-03`; the Architect or QE proposes E for the smoke when a milestone reading moves past 2 200 (the game counts and pins inside the owner's rule are delivery, `EPIC-010` § Owner questions). *2026-11-01 (`bapm-reconcile-adr0056`): the smoke is now S′ at 0.5 s, E 1 650 (`ADR-0056`), re-pinned one band-rule step when the pooled S′ score leaves 60–85 % over ≥ 30 games (E ≤ 2 600)* *2026-11-02 (`bapm-records-1102c`): the trigger fired at 26.0 / 30 = 86.7 % (`ABC-268`'s merge). The step is now the band-centre rule (`ADR-0056` S′ amendment, `arch-ABC-233`): E′ = E + X − 168.4. **S′ is at E 1 810, pool empty**, `--elo 1810` (§ Close-out, the S′ pool row). The 1 980 pool never opened* |
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
  | The S′ pool (500 ms, E 1 650) | `qe-ABC-255` A5 9.0 / 10 (`becf571a`) plus `qe-EPIC-010-close` 9.0 / 10 (`053733d2`) = **18.0 / 20 = 90.0 %**; < 30 games, so no re-pin yet (`…77ca3420`, QE-E010C-d) | QE adds each S′ to this pool. It does not restart. **The next S′ at ≥ 8.0 of 10 makes the pool ≥ 26.0 / 30 = 86.7 % > 85 % and fires the upward re-pin**, one band-rule step, E ≤ 2 600, with no owner ask (C10's trigger; `RISK-EPIC011-03`). A score of 7.5 or less does not fire it. A downward re-pin is a question for the owner. *2026-11-02 (`bapm-ABC-265-rows`, BA/PM's ruling): **only a merged build's S′ pools.** `ABC-264`'s 7.0 / 10 (`4d1c0616`, `qe-ABC-264-p2`) is recorded and not pooled, because `ABC-264` is not merged. Reasons: (1) the pool keeps E matched to the engine on `main` (C10, `RISK-EPIC011-03`), and a build the gate refused is not that engine; (2) `EPIC-010`'s trend rule, which `ADR-0056` asks this pool to copy, pools "every value-changing merge"; (3) a refused candidate is often weaker by construction, and an S′ collapse candidate could push the pool under 60 % and raise a downward re-pin question about code nobody ships. No effect today: pooled, it would read 25.0 / 30 = 83.3 % (no re-pin); unpooled, the pool stays **18.0 / 20 = 90.0 %** (not evaluable). The next merged S′ at ≥ 8.0 of 10 still fires the upward re-pin. If a refused candidate later merges, for example after a retry, its own merged head's S′ pools, not this one* *2026-11-02 (`bapm-records-1102c`): **the E 1 650 pool is closed at 26.0 / 30 = 86.7 %** (`qe-ABC-255` 9 / 1 / 0 + `qe-EPIC-010-close` 9 / 1 / 0 + `qe-ABC-268-p2` 8 / 2 / 0, merged builds only), and the upward re-pin fired (`…77a82ec1`). The rule as written gave E 1 980 (`arch-post-268` `…1bc554fb`); the Orchestrator ruled the band-centre step (`…8ce2fd23`), written into `ADR-0056` S′ by `arch-ABC-233` (`…f3a4dac0`): E′ = E + X − 168.4, symmetric, rounded to 10, clamped 1 320–3 190; upward with no ask up to 2 600, downward the owner's question. This step: 1 650 + 325.2 − 168.4 = 1 806.8 → **E 1 810** (pick depth 4; expected score about 72 %). **The pool opens empty at E 1 810** with the next merged build's S′; the 1 980 pool never opened. **Command:** `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5 --concurrency 1` (`r`'s default stays 1 650 in code, so a run without `--elo 1810` does not pool). The trigger is read again at ≥ 30 games: above 85 % steps up by the same rule; below 60 % is the owner's question* *2026-11-03 (`bapm-269-done`, `QE-269-k`): **`ABC-269`'s S′, 7.0 / 10 at E 1 810** (7 / 3 / 0, `qe-ABC-269` `…2c51ee30`, merged build `54dee3f2`), **joins the E 1 810 pool** under the merged-builds rule. The pool's count and whether any step fires are the Architect's, written into `ADR-0056` S′ by `arch-post-269` (item 3, in flight). This page does not compute them; where that line lands, it governs* *2026-11-03 (`bapm-R1-cut`; the Architect's `arch-post-269` `…ee31f3ee`, copied, not computed here): **E 1 810 pool: `qe-ABC-269` 7/3/0, merged `54dee3f2`, 7.0 / 10 = 70.0 %. Below 30 games, so no step.** X = +147.2, which puts `main` near 1 957 at 0.5 s. It is a 10-game figure, not a rating. At 30 games, ≥ 19.0 of the next 20 steps up, and ≤ 10.5 of the next 20 raises the owner's downward question. `ABC-274` plays no games, and R1 (100 ms) never pools. C10 is unchanged*
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

*2026-11-03 (`bapm-owner-answers-1103`): the owner answered items 1–8 (`…af126c04`). **Open now: Q-3K-6 and Q-3K-8 only**, plus the proposed Q-3K-1 wording row, unchanged.*
*2026-11-03 (`bapm-owner-answers-1103b`): the owner accepted `ADR-0068` and `ADR-0069` (`…401c3d09`; rows below). **Still open: Q-3K-6 and Q-3K-8 only**, plus the Q-3K-1 wording row.*
*2026-11-04 (`bapm-epic011-areas`): **open now: Q-3K-6, Q-3K-8, `Q-3K-10` (new), the `ADR-0067` d6 amendment and B-T8's re-confirmation for the second pull**, plus the Q-3K-1 wording row. Only `Q-3K-10` holds a page cut here (`ABC-289`). The two second-pull items are recorded from `arch-ADR-0070-accept` `…212d6a4c` § 3; they are asked before the second pull, not now. No other uncut area needed an owner choice: every other hold is an Architect's ADR, a probe or a ticket's read.*
*2026-11-04 (`bapm-ABC-282-adr`): **OQ-0071-1 added** (accept `ADR-0071`), from `arch-ABC-282` `…0187186b`; the Orchestrator puts it. **Open now: Q-3K-6, Q-3K-8, `Q-3K-10`, OQ-0071-1, the `ADR-0067` d6 amendment and B-T8's re-confirmation**, plus the Q-3K-1 wording row.*
*2026-11-04 (`bapm-owner-answers-1104`): OQ-0071-1 answered (a) and `Q-3K-10` answered yes (`…7de79e90`; rows below, struck). **Open now: Q-3K-6, Q-3K-8, the `ADR-0067` d6 amendment and B-T8's re-confirmation, plus the Q-3K-1 wording row.***
*2026-11-04 (`bapm-ABC-301-cut`): the `ADR-0067` d6 amendment and B-T8's re-confirmation answered yes (`…dda43b71`, "1. yes; 2. yes"; rows below, struck; the second pull is cut as `ABC-301`). **`Q-3K-11` added** (the bundle read), from `arch-second-pull-1104` `…a5d74f70`; the Orchestrator asks it. **Open now: Q-3K-6, Q-3K-8 and `Q-3K-11`, plus the Q-3K-1 wording row.***
*2026-11-04 (`bapm-lines-1104`): `Q-N8H-1` answered (a), `Q-3K-11` answered (a) (the bundle read ACCEPTED) and bundle 1 named (`…3b15b361`; rows below). **OQ-0074-1 added** (accept `ADR-0074`), from `arch-ABC-289` `…62012bbe` § 7. **Open now: Q-3K-6, Q-3K-8 and OQ-0074-1, plus the Q-3K-1 wording row.***
*2026-11-04 (`bapm-lines-1104b`): **OQ-0072-1 and OQ-0073-1 added** (accept `ADR-0072` and `ADR-0073`, one answer, (a), (b) or (c)), from `arch-bundle-1` `…37b7fb23`; rows below. **Open now: Q-3K-6, Q-3K-8, OQ-0074-1, and OQ-0072-1 with OQ-0073-1, plus the Q-3K-1 wording row.***
*2026-11-04 (`bapm-bundle-1-cut`): OQ-0072-1 and OQ-0073-1 answered (a), and OQ-0074-1 answered yes (`…3e73f9f9`; rows below, struck). **Open now: Q-3K-6 and Q-3K-8, plus the Q-3K-1 wording row.***

| Q | asked | default until he answers | blocks |
|---|---|---|---|
| ~~**Q-3K-2**~~ | Does M0's SPRT verdict join his Q4 = (e) per-change rule, beside the D smoke or in its place? | **answered 2026-11-01: no SPRT;** 100 games at 100 ms per strength change, 400 per epic (`…2896c6eb`) | nothing (`ABC-255` re-scoped) |
| ~~**Q-3K-3**~~ | Test width: SPRT and 40/15 readings at width 1 are slow (an SPRT ≈ 10–30 h, a 200-game 40/15 reading of the order of 100–200 h, estimates); more cores breaks "one at a time" | **answered 2026-11-01: one core** ("Keep game on one core", `…f7a50e95`); width 1. *2026-11-02, refined by `ADR-0057` OQ-2 (a): one game at a time; the engine may use several cores inside a game; every 100 / 400 read at `Threads 1`* | nothing new; a 40/15 reading stays of the order of 100–200 h and is asked first |
| ~~**Q-3K-4**~~ *(**answered 2026-11-02: (b)**, `…cc7db847`; folded 2026-11-03, `bapm-epic011-cut`: evaluation tickets judged on play with the depth-6 floor, `G6` "≥ base" reported, not graded)* *(2026-11-03, `bapm-ABC-269-fold`: graded = C2′ with S′ and the Levels lane, plus `NFR-005`'s floor (every run ≥ 6 at `LEVELS[5]`, depth 7 a WARN); `G6`'s median against base reported. Scope as recorded: evaluation tickets only; other value-changing tickets keep "≥ base" until a wider reading is recorded (`Q-3K-4` (b)'s scope: the Orchestrator's ruling 2026-11-03, brief `bapm-ABC-269-fold`, on the owner record `orch-2026-10-30a` `…cc7db847`; `ADR-0056` D7 dated 2026-11-03))* *(**live**, 2026-11-02; put to the owner with `ADR-0064` (board, `arch-next-pull` and `arch-E1` merges); `bapm-E1-cut`)* | `G6` "≥ base": keep it, or judge value-changing tickets on play (M0) with `NFR-005`'s depth-6 floor and depth-7 WARN. *2026-11-02: the answers that settle it: "keep G6 ≥ base" or "judge on play with the depth-6 floor". **The Architect recommends judging on play** (`arch-E1` `…d8150777`): E1's tree reads 0.96–1.035× on the `G6` boards, so a "≥ base" median on a board at its depth edge would grade that noise, not the evaluation. E1 is designed for both answers* | "≥ base" binds | E1–E7 most (every eval term costs nodes; `ABC-205` died on it). *2026-11-02: **`ABC-269` B7's grading only**; its build does not wait. Under the default, a `G6` miss is `ADR-0064` F3 (one value-identical cost cut, one new reading, then this question again with both readings)* |
| ~~**`ADR-0064` acceptance**~~ *(**answered yes 2026-11-02**, "64 yes", `…cc7db847`; folded 2026-11-03, `bapm-epic011-cut`; `ABC-269`'s B8 and merge follow the build and QE; not in force until `ABC-269` merges, `ADR-0064` § Status)* *(new 2026-11-02, `arch-E1` `…d8150777`; asked by the Orchestrator with `Q-3K-4` (board); recorded by `bapm-E1-cut`)* | Accept `ADR-0064`, the tapered evaluation (E1): one linear phase (N 1, B 1, R 2, Q 4, out of 24), every term a middlegame / endgame pair in `src/evaluate-params.ts`, and at E1 only the king's endgame half (40 − 15 m) and the passers' (2 × by rank), behind a test-only off-door pair. Intent GAIN. `ADR-0056` (accepted in direction) covers E1's direction, not this text. The answers that settle it: *"accept ADR-0064"* or *"decline it"* | **not accepted:** `main` keeps its untapered evaluation. Under reading (b), `ABC-269`'s build and gates may start now | `ABC-269`'s B8 (the 100-game read, S′, the Levels deep lane) and its merge. *2026-11-03 (`bapm-269-done`): `ABC-269` merged `54dee3f2`; `ADR-0064` in force from the merge (the Architect's dated line, `arch-post-269`)* *2026-11-03 (`bapm-R1-cut`): the dated line is written. `ADR-0064` is **IN FORCE** by its § Status (`…3f30baf8`)* |
| **Q-3K-6** | `NFR-009` above 16 MiB for T4 (he pre-offered 128 MiB, 2026-09-25) | 16 MiB; `ABC-258` goes to 8 MiB only | `ABC-258` beyond 8 MiB. *2026-11-02: still open; `ADR-0057` OQ-4 (a) does not move the level (a threads build ≈ 10 MiB at 12 workers, `estimate`)* |
| ~~**Q-3K-7**~~ *(**answered 2026-11-03**: (a) yes, (b) no, (c) no; `…af126c04` items 2–4; `bapm-owner-answers-1103`)* *(2026-11-03, `bapm-E2pre-cut`: **split into (a) / (b) / (c)** by `ADR-0067` d9 and `…e4c34239` § 4; asked by the Orchestrator 2026-11-03 (board); **each pending**)* | Tuning data: the project's own games (allowed by default), Lichess exports (CC0), a Stockfish-labelled set (a product-identity question) | own games only | `ABC-239`'s data source |
| ~~**Q-3K-7 (a)**~~ *(new 2026-11-03; ~~pending~~ **answered yes** 2026-11-03, item 2; pinned in `ADR-0067` § Addendum: the `2017-03` export, a rating gap ≤ 200 added, ≤ 1 000 000 positions, own share 0.5; `ADR-0048` d6)* | May the tuner train on one Lichess standard-game monthly export? Terms: CC0 per its page (fetched 2026-11-03); URL and sha256 recorded; the file kept outside the repository; rated, base ≥ 180 s, both ratings ≥ 2000, normal termination, positions from ply 16; every comment ignored (`[%eval]` included); at most 1 M positions; validation stays own games. **The Architect recommends yes:** own games alone fit implausible material (queen 2 593 / 137) and leave about 0.4 % bounded. Cost: one manual download, minutes of host, no runtime network | **no:** own games only (A1). If declined, more own games (≈ 4 h per 1 000 at 100 ms, over the 1 h line) is asked separately | `ABC-239`'s fit data, not its build; the size of the first pull |
| ~~**Q-3K-7 (b)**~~ *(new 2026-11-03; ~~pending~~ **answered no** 2026-11-03, item 3: no Stockfish-labelled training target)* | A Stockfish-labelled position set (regression to engine scores)? A product-identity question (labels from a neural engine). **The Architect recommends no**: not needed | **no** | nothing |
| ~~**Q-3K-7 (c)**~~ *(new 2026-11-03; ~~pending~~ **answered no** 2026-11-03, item 4: games against Stockfish stay the outside measure)* | Games against Stockfish as training data? Half the moves are Stockfish's, and the results lean to losses. **The Architect recommends no** | **no** (`ADR-0067` d9 excludes them) | nothing |
| ~~**`ADR-0067` acceptance**~~ *(**ACCEPTED 2026-11-03**, item 1; `ABC-274` merged `2410d4f7`)* *(new 2026-11-03, `arch-ABC-239` `…e4c34239`; asked by the Orchestrator 2026-11-03 (board); **pending**; recorded by `bapm-E2pre-cut`)* | Accept `ADR-0067`, the offline tuning method (E2): a logistic fit of game results, cross-entropy with K fixed first, Newton steps on a traced linear model behind an identity gate; material frozen at the first pull and a sign-bounded free set; `tools/tune/` writes only `src/evaluate-params.ts`; E2-pre (`ABC-274`) first. `ADR-0056` (accepted in direction) covers E2's direction, not this text. The answers that settle it: *"accept ADR-0067"* or *"decline it"*, with Q-3K-7 answered beside it | **not accepted:** `main` keeps E1's rule-made table. Under reading (b), `ABC-274`'s build and then `ABC-239`'s may start | `ABC-274`'s merge; `ABC-239`'s A6 (B-T7) read and merge |
| ~~**B-T8**~~ *(**approved 2026-11-03**, "5. ok yes", item 5: runs before `ABC-239` merges)* *(new 2026-11-03, `ADR-0067` B-T8 / `ABC-239` A6; asked by the Orchestrator 2026-11-03 (board); **pending**)* | Before `ABC-239` merges, the outside pair: the candidate and its merge-base, each 200 games against Stockfish 19 `UCI_LimitStrength` at 0.5 s (≈ 5 h, over the 1 h line); MET on a point estimate ≥ 0. **The Architect recommends yes:** a tuned set judged by self-play alone repeats `EPIC-008`'s failure (`RISK-EPIC010-05`) | **not run:** `ABC-239` merges on B-T7 (the 100-game read, S′, Levels), and `RISK-EPIC010-05` stays open for it | `ABC-239`'s merge only if he says yes |
| ~~**SEC-HP-2**~~ *(**answered yes 2026-11-03**, item 7; done at `1e558566`)* *(new 2026-11-03, `sec-host-paths` `…72b4070b` (c); recorded by `bapm-sec-cut`; **pending**)* | Redact one line at the tip: `.grugops/context/se-ABC-262/raw/gates/summary.txt` line 5 (a foreign private project's process argv, ~~2~~ *3* processes *(2026-11-03: one vitest runner and two fork workers; the redaction reads `count=3`)*) becomes `<foreign: CLASS>`. 1 file, no seal, no checksum; history keeps the old blob. **Security/NFR recommends yes** | **not redacted**; if declined, an accepted risk owned by Olger Oeselg | `ABC-277` A7 only |
| **Q-3K-8** | Re-open `ADR-0001` (bitboards), only if the readings call for it | no | V4 |
| ~~**Q-SP-3**~~ | Amend `ADR-0003` so lazy legality may be built | **answered yes 2026-11-01** (`…f7a50e95`); `ADR-0003` amended | nothing (`ABC-254` is in `EPIC-010`) |
| ~~**`ADR-0057` OQ-1–OQ-6**~~ | Threads in scope; the reading of "one core"; the claim's thread count; `NFR-009` for workers; the host change; NNUE on the CPU | **answered 2026-11-02** (`…81ae2db4`): 1 yes, 2 a, 3 c, 4 a, 5 no, 6 later (top block) | nothing (`ABC-265`–`ABC-267` cut) |
| ~~**TH-1's `ADR-0025` amendment**~~ *(new 2026-11-02, `arch-owner-answers-1102` open question 1; **answered yes 2026-11-02**, "25 yes", `…773be7de`; `ABC-265` merged `605874b8`; `bapm-records-1102c`)* | Accept the shared-table amendment to `ADR-0025` decision 2 and decision 4's last bullet, an accepted ADR that OQ-1 did not name | asked when written (recommended); or the Orchestrator reads OQ-1 as covering it. *2026-11-02 (`bapm-ABC-265-rows`): written, PROPOSED (`arch-ABC-265`, merged `c0f3cbad`); the Orchestrator has asked the owner (board, 2026-11-02)* | `ABC-265`'s merge (its build may start under reading (b)) |
| ~~**`ADR-0062` acceptance**~~ *(new 2026-11-02, `arch-ABC-266` `…4f828986`; recorded by `bapm-ABC-266-rows`; **moot 2026-11-02**: the owner parked threads, "park threads", `…773be7de`; `ADR-0062` stays PROPOSED, not in force, neither accepted nor declined; re-asked only if threads re-open; `bapm-records-1102c`)* | Accept `ADR-0062`, the worker pool and `Threads`. The D5 reversal is pre-accepted (OQ-1). Two parts go further than `ADR-0057` § Inputs and are asked by name: **D6**, the deepest completed iteration among the workers is played, not worker 0's; and **D1**, the maximum, 12 (recommended) or 8 to leave the host room. The answers that settle it: *"accept ADR-0062 (max 12)"*, *"accept ADR-0062 with max 8"*, or *"decline"* | **not accepted:** `ADR-0044` D3 and D5 stand as written, and `ABC-266` is not merged. The build may start under reading (b) once `ABC-265` has merged and the D12 probe has read. With "max 8", M and N on `ABC-266` read 8, and nothing else moves | `ABC-266`'s merge |
| ~~**The 2-core rule for `THREADS_DEEP`**~~ *(new 2026-11-02, `ADR-0062` D11; recorded by `bapm-ABC-266-rows`; **moot 2026-11-02** while threads are parked; default (b) stands; `bapm-records-1102c`)* | His rule *"vitest needs to be capped to max 2 cpu cores"* is held today by `maxWorkers: 2`. May the opt-in `THREADS_DEEP` lane run an engine child on **up to M cores** for its rows? **(a)** yes, run with the host ALONE; or **(b)** no, the rows stay at `Threads 2` | **(b)** (the Architect recommends (a)). The standing rows run at `Threads 2` and W = 2. `Threads 4` and `Threads M` play only in `ABC-266` A7's 100 games. QE reads A5 and `G5` at `Threads M`, and A8 at W = 12, once out of tree with the same fixtures and flags, host ALONE. Both answers are written into `ABC-266`'s rows | nothing: it decides which `ABC-266` rows stand in the lane and which QE reads once |
| ~~**P1's 27 cp cap**~~ *(new 2026-11-02, `arch-ADR-0060-reopen` `…e17a23f4` decision 4; recorded by `bapm-phase2-records`; **optional**; **moot 2026-11-02**: after P3, decision 1 misses A4 (a) and zugzwang too, so a "yes" admits nothing; the Orchestrator `…8ce2fd23`; the default, keep the cap, stands; `bapm-records-1102c`)* | May `ADR-0060` A3's 27 cp drift cap be re-derived on `main` by `ADR-0050` d8's method? It would become **94 cp** (⌊1.5 × 63⌋, decision 1's larger maximum on `main`). **A "yes" alone admits no form:** decision 1 still misses A4 (a) on `chooseMove` position-6 (0.8699 against 0.85), and no form in the set misses only the cap. The answers that settle it: "keep the cap"; "re-derive the cap and A4 (a)" (decision 1 re-proposed with 94 cp and his A4 (a) number); or "decline `ADR-0060`" | **keep the cap** (the Architect's recommendation, which BA/PM adopts). P1 stays parked, the flat 1-ply LMR stays on `main`, and decision 1 is re-measured unchanged after P3 merges or after O1h | nothing today. Under the default, P1 waits on its re-measure trigger (§ Phases, "P1, parked") |
| ~~**`ADR-0061` acceptance**~~ *(new 2026-11-02, `arch-phase2-p3` `…004b35ed` decision 10; recorded by `bapm-P3-page`; **answered yes 2026-11-02**, "61 yes", `…773be7de`; `ABC-268` merged `e72487e1`; `bapm-records-1102c`)* | Accept `ADR-0061`, futility pruning (P3): late quiet, non-checking moves skipped at null-window nodes of remaining depth 1–3 when `evaluate + 150 / 350 / 550 cp ≤ alpha`, in both recursions, behind a test-only off-door pair. `ADR-0056` (accepted in direction) covers P3's direction, not this text. The answers that settle it: *"accept ADR-0061"* or *"decline it"* | **not accepted:** no futility pruning on `main`. Under reading (b), `ABC-268`'s build and gates may start now | `ABC-268`'s A6 (the 100-game read, S′, the Levels deep lane) and its merge |
| ~~**Q-3K-9**~~ *(**answered yes 2026-11-03**, item 6: `ADR-0024` d4 open for Q1's design only; a build on its own evidence)* *(new 2026-11-03; asked by the Orchestrator 2026-11-03 (board, `main` `32b807c7`); **unanswered, pending**; id given here by BA/PM, `bapm-ABC-234-park`)* | Open `ADR-0024` decision 4 for Q1 (SEE pruning of losing captures in quiescence)? d4's own re-open condition (a lost defended-square capture) is not met (`ADR-0065` decision 1: all 24 `do-not-hang` rows solved); the evidence offered is cost: a diagnostic, not pre-registered, Q1 reads +0.884 ply reach, d8 0.22–0.68× nodes, zugzwang 7 / 7, drift max 69 cp (`arch-ABC-234` `…ffe76d35`) | **not opened:** Q1 stays fenced (`ADR-0024` d4; `EPIC-010` § Out of scope) | Q1's PREREG, ADR and ticket; `ABC-234`'s re-open premise 1 *2026-11-03 (`bapm-owner-answers-1103b`): closed. `ADR-0069` written and ACCEPTED (it amends d4 for quiescence pruning); Q1 cut as `ABC-279`* |
| ~~**`ADR-0068` acceptance**~~ *(**ACCEPTED 2026-11-03**, "yes, accept ADR-0068 and ADR-0069", `…401c3d09`; recorded by `bapm-owner-answers-1103b`)* *(asked by the Orchestrator 2026-11-03, board; `arch-ABC-270` `…c858b5a5` § 6)* | E3a (`ABC-270`) lands as structure only (three queen-on exposure pairs at 0), before the tuner; the `ADR-0031` rule values are not shipped | `ABC-239` fits without the queen-on terms | nothing now (`ABC-270` DoR 10/10, Ready) |
| ~~**`ADR-0069` acceptance**~~ *(**ACCEPTED 2026-11-03**, same answer, `…401c3d09`; recorded by `bapm-owner-answers-1103b`)* *(asked by the Orchestrator 2026-11-03, board; `arch-Q1-see-pruning` `…5e73b0d4` § 6)* | Q1: quiescence skips SEE-losing captures out of check; amends `ADR-0024` d4 (delta pruning and quiet checks stay fenced) | nothing built; d4 as written | nothing now (`ABC-279` DoR 10/10, Ready) |
| ~~**`Q-3K-10`**~~ *(**answered yes 2026-11-04** (`…7de79e90`): `ADR-0024` d4 is open for Q2's design only; `ABC-289`'s owner hold is lifted, and the re-measure and the ADR still hold it; `bapm-owner-answers-1104`)* *(new 2026-11-04, `bapm-epic011-areas`; not yet asked; the Orchestrator takes it to him)* | Open `ADR-0024` decision 4 for the **design** of Q2, delta pruning in quiescence, as `Q-3K-9` opened it for Q1? `Q-3K-9`'s yes and `ADR-0069` both left delta pruning fenced. Its only figure, a 1.5× trim (`ADR-0024`), predates futility, ordered quiescence and Q1, so the Architect re-measures on `main` first. A build would ship on its own evidence (C2′, S′, the Levels lane). `ADR-0056` D2 estimates +5–20 Elo (an estimate). The answers that settle it: *"open d4 for Q2's design"* or *"keep it fenced"* | **not opened:** Q2 stays fenced; `ABC-289` held | `ABC-289`'s design and ADR |
| ~~**OQ-0071-1**~~ *(**answered 2026-11-04: (a), accepted as written** (`…7de79e90`); `ADR-0071` is ACCEPTED, not in force until `ABC-282` merges on A6; `bapm-owner-answers-1104`)* *(new 2026-11-04, `arch-ABC-282` `…0187186b`; recorded by `bapm-ABC-282-adr`; asked by the Orchestrator)* | Accept `ADR-0071` (W1)? (1) the modes: W1 acts only in `uci-clock-mode` with a clock; `level`, `movetime` and `simple-tournament` are node-identical to `main`; (2) the rule: no iteration starts once the search has spent the budget ÷ 2.3 (measured, not tuned); the budget stays the hard limit, and no ceiling or budget formula moves; (3) the partial move: played only when it beat the incumbent on exact scores at the same depth, amending `ABC-078` A3 in that mode only; (4) the read: 100 games at `tc=40/8` in `uci-clock-mode`, GAIN ≥ 50.0, about 40 min, after `ABC-300`. The answers that settle it: *(a)* accept as written (recommended); *(b)* accept, and take the partial-move rule into every mode as a follow-up ticket of its own (it owes C2′ at 100 ms, the Levels lane and an `NFR-005` re-read); *(c)* decline | **not accepted:** `ADR-0071` PROPOSED, not in force; `ABC-078` A3 as written. Under reading (b), `ABC-282`'s build may start (after `ABC-283`) | `ABC-282`'s merge |
| ~~**`ADR-0067` d6 amendment**~~ *(**answered yes 2026-11-04**, item 1, `…dda43b71`: adopted for the second pull and every later pull; `ADR-0067` d6 and F3, dated 2026-11-04, `arch-second-pull-1104`; `ABC-301`; `bapm-ABC-301-cut`)* *(open, the owner's; `arch-ADR-0070-accept` `…212d6a4c` § 3; recorded 2026-11-04, `bapm-epic011-areas`)* | For E2's second pull: the margin-aware bound form, every relation bounded at once from the first fit, with no refit step (`arch-ABC-239-f3f4`'s dated line) | the second pull runs F3 as written (a bound and one refit) | the second pull's PREREG; asked before it |
| ~~**B-T8 re-confirmation**~~ *(**answered yes 2026-11-04**, item 2, `…dda43b71`: the 200 + 200 pair at 0.5 s, about 5 h, runs before the second pull merges; `ABC-301` B-T8; `bapm-ABC-301-cut`)* *(open, the owner's; same source)* | He approved the 200 + 200 outside pair (about 5 h) for `ABC-239` (`…af126c04` item 5). The second pull is a new attempt: does that approval carry to it? | not decided (`UNKNOWN - verify` until he answers) | the second pull's merge |
| ~~**`Q-3K-11`**~~ *(**answered 2026-11-04: (a)**, `…3b15b361` 2: `ADR-0056`'s "bundle read" section is ACCEPTED as written and is part of the per-change rule, carrying R-BUNDLE-1; `arch-bundle-1` records it in `ADR-0056`. The optional ask, `…3b15b361` 3: **bundle 1 is NAMED**, `ABC-286` + `ABC-288`, under the bundle read; `bapm-lines-1104`)* *(new 2026-11-04, `arch-second-pull-1104` `…a5d74f70`; recorded by `bapm-ABC-301-cut`; the Orchestrator asks him)* | Accept `ADR-0056`'s PROPOSED section "the bundle read" (dated 2026-11-04) as part of the per-change rule? Related value-changing parts (a shared file or mechanism, B1) built on one branch and judged by one C2′ read (B4); each part keeps what it shows alone, its door pair, rule rows and own bar (B2); the safety rows are read with all parts on (B3); credit goes to the bundle (B5). The answers that settle it: *(a)* accept as written; *(b)* accept with changes he names; *(c)* decline, and bundles are then only by his word, case by case, as for `ABC-283`. **A second, optional ask:** does he name bundle 1 (`ABC-286` + `ABC-288`, over history) now? `ABC-283` has merged, so it could run | reading (b): the section is used only for bundles he names | a bundle's ticket (cut in `ABC-283`'s form once a bundle is named); no page holds on it today (`ABC-301` is kept apart) |
| ~~**`Q-N8H-1`**~~ *(**answered 2026-11-04: (a)**, `…3b15b361` 1; the row is new here, for the record; `bapm-lines-1104`)* | Re-state `NFR-008`? (a) keep `npm test` ≤ 10 s and keep moving heavy rows to deep lanes; (b) re-state W; (c) revisit the 2-worker cap | (a): `NFR-008` stays at 10 s, and room is made by moving slow rows (`ABC-302`). Fallback, only if a graded median stays ≥ 9.6 s after `ABC-302`: (b) re-state W, which comes back to him before it is used. If the lane returns to ≥ 9.6 s later: a row move first, and the owner only if the next graded read is still ≥ 9.6 s (the Orchestrator's reading inside (a), `…f30bd604` 2; disclosed, and he may overrule it) | nothing now |
| ~~**OQ-0074-1**~~ *(**answered 2026-11-04: yes** (`…3e73f9f9`, "2. OQ-0074-1: yes accept."); `ADR-0074` is ACCEPTED, not in force until `ABC-289` merges on its own read; `ADR-0024` d4 amended by pointer; `bapm-bundle-1-cut`)* *(new 2026-11-04, `arch-ABC-289` `…62012bbe` § 7; recorded by `bapm-lines-1104`; the Orchestrator takes it to him, recommendation yes, `…085f647c` 3)* | Accept `ADR-0074`? It amends `ADR-0024` d4: delta pruning enters quiescence, with quiet checks still fenced. Out of check, a capture is skipped when stand pat + victim + 200 cp ≤ alpha, and the skip raises the node's value to that bound. d8 0.64–0.83× nodes, reach +0.279 ply, safety rows clean; the five stand-pat forms failed drift. The answers that settle it: *"accept ADR-0074"* or *"decline it"* | **not accepted:** `ADR-0024` d4 stays as written, apart from the design opening he already gave. Under reading (b) the build may start on PROPOSED | `ABC-289`'s merge, not its build |
| ~~**OQ-0072-1**~~ *(**answered 2026-11-04: (a)** (`…3e73f9f9`, "1. Bundle 1: (a)"), one answer with OQ-0073-1; `ADR-0072` is ACCEPTED over a missed premise, form M3, F1 stays fired, not in force until `ABC-303` merges on its read; `bapm-bundle-1-cut`)* *(new 2026-11-04, `arch-bundle-1` `…37b7fb23`; recorded by `bapm-lines-1104b`; the Orchestrator takes it to him; **one answer with OQ-0073-1**)* | Accept `ADR-0072`, lifting L2 for bundle 1? P4 in form M3 (T = 4 / 7 / 12, d ≤ 3, key-0 quiets only, three non-pawn pieces) meets L3 and L4 and misses drift narrowly (93.58 % / 94.12 % against ≥ 95 %; 80 / 79 cp against ≤ 75) and the audit by thirty times (15.27 % against ≤ 0.5 %; 29 errors ≥ 200 cp against 0). Every form misses the audit (13.9–17.6 %). Lifting it overrides a guard, not only a pay gate as in `ABC-283`. The answers are in the next row | (c): **not accepted:** `ADR-0072` PROPOSED; no move-count pruning on `main`; `ABC-286` stays held at DoR 9/10. Reading (b) does not start this build: F1 fired, and it enters only by his word (`ADR-0056` B2 (d), B6) | `ABC-286`'s build and its held page lines; the bundle ticket; with OQ-0074-1, `ABC-289`'s build, held by the Orchestrator (`…5ec6c124` 3) |
| ~~**OQ-0073-1**~~ *(**answered 2026-11-04: (a)**, the same answer; `ADR-0073` is ACCEPTED over a missed premise, form C1, `ABC-288` narrowed to the countermove, F1 stays fired, not in force until `ABC-303` merges on its read; `bapm-bundle-1-cut`)* *(new 2026-11-04, same source and recording; **one answer with OQ-0072-1**)* | Accept `ADR-0073`, lifting CH3 for bundle 1, with `ABC-288` narrowed to the countermove? O2c in form C1 meets CH2 and misses CH3 on all four readings (1.0031 / 0.9999 / 1.0935 / 0.9989 against ≤ 0.95). Continuation history failed Safety and bought no node. **The answers that settle both:** *(a)* lift both; build `C1+M3`; one read (C2′, 100 games at 100 ms, GAIN ≥ 50.0). On a pass both ADRs are accepted as a bundle; on a miss both return to held. *(b)* lift L2 only; `ABC-286` alone on its own C2′; O2c stays held. *(c)* hold both; the slot goes to the next item. **The Architect's recommendation: (a), over two misses, and said as such.** For it: the safety rows are all green, the read is about 0.7 h of host plus the build, and a miss merges nothing. Against it: reach is only +0.148 ply, and 100 games cannot tell +10 from −10; O2c is nearly free and nearly empty, so R-BUNDLE-1 is exactly its risk. (b) is the plain alternative | (c): **not accepted:** `ADR-0073` PROPOSED; no countermove on `main`; `ABC-288` stays held at DoR 9/10. Reading (b) does not start this build, as above | `ABC-288`'s build, its held page lines and its title and scope; the bundle ticket; `ABC-289`'s build, as above |
| (part of Q-3K-1) | Confirm the scale (Stockfish 19 `UCI_Elo`) and the claim rule (≥ 50 % over 200 games at E = M) | *[proposed]* as written | G1's wording |

## Dependencies

- `ADR-0056` (accepted in direction; the owner fold is the Architect's, in flight) and `ADR-0055` (ACCEPTED, O1).
- `EPIC-009`'s `uci-clock-mode` (`ADR-0052`): the 40/15 setting.
- `ABC-204`'s pinned host tools (`cutechess-cli` 1.5.1, Stockfish 19); paths out of the records (`ADR-0049` d4).
- `EPIC-010` closed: 1b's packed base is what every Phase 1+ ticket edits.
- Within the epic: ~~`ABC-238` → `ABC-237` → `ABC-257` → `ABC-258`~~ *(2026-11-02: `ABC-257` (T1 + T3) → `ABC-258` (with T2), both paused)* share `src/transposition.ts`; `ABC-233` → O2c →
  `ABC-234` → Q1 share `orderMoves` and the capture path *(2026-11-03, `bapm-ABC-234-park`: `ABC-234` parked; Q1
  carries `see` itself, so the arrow no longer orders them; if `ABC-234` re-opens on its premise 1, it follows Q1)* *(2026-11-04, `bapm-ABC-283-done`: `ABC-233` and `ABC-234` are Done, delivered by `ABC-283` (merged `58e90d07`); O2c (`ABC-288`) now follows `ABC-283`)*; *2026-11-02 (`bapm-threads-cut`):* `ABC-265` → `ABC-266` →
  `ABC-267` in order *(2026-11-02, `bapm-ABC-266-rows`: `ABC-267` folded into `ABC-266`, so `ABC-265` → `ABC-266`; the
  D12 timing probe before `ABC-266`'s Development)*; `ABC-265` shares `src/transposition.ts` with the paused `ABC-257` and the parked `ABC-258` (one at
  a time, and whichever follows it is written on the shared layout); `ABC-266` shares `src/engine.ts` and
  `src/uci-session.ts` with every Phase 2 ticket that edits them, so it waits for Phase 2 and R1; *2026-11-02 (`bapm-P3-page`): `ABC-268` (P3) shares `src/search.ts` and
  `src/engine.ts` with the parked P1, one at a time, and the second to merge re-reads its door counts on the new `main`
  (`ADR-0061` d9); `ABC-266`'s Development is blocked after the D12 MISS, pending the Architect's re-proposal;* E1 *(`ABC-269`, 2026-11-02; also `src/search.ts`, `src/engine.ts` and `src/quiescence.ts` for its switch and doors, which only parked tickets touch)* → `ABC-239` → E3–E7 share `src/evaluate.ts`; *2026-11-03 (`bapm-epic011-cut`): `ABC-269` → { `ABC-270`, `ABC-271`, `ABC-272`, `ABC-239` } share `src/evaluate.ts` and `src/evaluate-params.ts`, one at a time in the Orchestrator's order, the second to merge re-reading its door counts; `ABC-273` (R1) reads `main` between `ABC-269`'s merge and the next of those;* `ABC-254` →
  V3 share `src/legal.ts` and `src/moves.ts` (`ABC-254` in `EPIC-010` since 2026-11-01, so it lands first).
- *2026-11-03 (`bapm-E2pre-cut`):* **Phase 4 order** (`ADR-0067` § Consequences, adopted): `ABC-269` → `ABC-274` (E2-pre) → `ABC-239` (E2) →
  { `ABC-270`, `ABC-271` }; `ABC-272` in any order. All share `src/evaluate.ts` (and, from `ABC-239` on,
  `src/evaluate-params.ts`), one at a time, and whichever follows re-reads its door counts. **Stall clause:** if
  `ABC-239` stalls on data, `ABC-270` may go first on its rule values, and the tuner's first pull traces it.
  `ABC-273` (R1) is read after `ABC-269` merges and before `ABC-239` merges. `ABC-274` changes no value, so R1 is not
  ordered by it. *2026-11-03 (`bapm-269-done`): **`ABC-269` merged** (`54dee3f2`); `ABC-274` is next (In Development).* *2026-11-03 (`bapm-R1-cut`): **`ABC-275` → `ABC-273` (R1)**, both before the next value-changing merge (`ABC-239`, `ABC-270`, `ABC-271` or `ABC-272`; the Orchestrator's ruling). `ABC-275` edits `tools/rating/` only, so it collides with no Phase 4 ticket. `ABC-274` does not close R1's window.*
- *2026-11-03 (`bapm-owner-answers-1103b`; owner `…401c3d09`; `ADR-0068` d7, `ADR-0069` design note § 3):* **Phase 4
  E3 order, set:** `ABC-270` (E3a structure, value-identical) → `ABC-239`'s fit and emission, on a `main` that contains
  `ABC-270` (or after its failed disposition). One read, `ABC-239`'s B-T7 / B-T8, covers both. The stall clause above
  is void. **Q1 (`ABC-279`) merges or misses before `ABC-239`'s candidate is frozen for B-T7 / B-T8**, never between
  that freeze and `ABC-239`'s merge. `ABC-270`'s and `ABC-279`'s builds run beside `ABC-239`'s tool build, one job at a
  time on the host. Files: `ABC-279` edits `src/see.ts` (new), `src/quiescence.ts`, `src/search.ts` and
  `src/engine.ts`, so it does not collide with `ABC-239` or `ABC-270` (`src/evaluate.ts`, `src/evaluate-params.ts`).
  Whichever merges second re-reads its instrument counts on the new `main`.
- *2026-11-04 (`bapm-ABC-239-close`; Orchestrator `…4c76bf7a`; `arch-ABC-239-f3f4` `…69f22167` § 4):* **`ABC-239`'s
  first pull is closed NOT MET, and the Phase 4 order after it is `ABC-271` (E4a) → a second E2 pull.** The earlier
  "`ABC-239` → { `ABC-270`, `ABC-271` }" is spent: `ABC-270` merged before the fit, and the first fit did not ship.
  The second pull is a new attempt under `ADR-0067` F6, with its own PREREG, on a `main` that contains `ABC-271`; the
  owner's word on d6's amendment is asked then. **`ABC-280`** (tools only) collides with no Phase 4 file and may
  land at any time before that pull. `ABC-272` keeps its "any order" slot.
- *2026-11-04 (`bapm-epic011-areas`; `arch-ADR-0070-accept` `…212d6a4c` § 5; `ADR-0056` D6's dated line of 2026-11-04):*
  **Phase 4 order: `ABC-271` (E4a, structure only at 0) → E2's second pull, one read judging both.** The second pull's
  fit is taken on a `main` that contains `ABC-271`; if `ABC-271` fails (`ADR-0070` F1 / F2), the fit runs without E4a's
  features. Before it, the owner's: the `ADR-0067` d6 amendment and B-T8's re-confirmation (§ Owner questions). ~~The
  second pull has no ticket id yet.~~ *(2026-11-04, `bapm-ABC-301-cut`: both answered yes; the second pull is
  `ABC-301`.)*
  - **After it:** `ABC-290`–`ABC-293` (E3b, E4b, E5, E6), whose new weights a later pull fits. `ABC-272` and `ABC-294`
    (E7a, E7b) in any order relative to the tuner, E7b after E7a's premise probe. All share `src/evaluate.ts` /
    `src/evaluate-params.ts`, one at a time, and whichever follows re-reads its counts.
  - **Search side:** `ABC-283` → { `ABC-286` (P4), `ABC-288` (O2c), `ABC-298` (V3) } (history and `orderMoves`);
    `ABC-284` (P1) on its own named premise; `ABC-287` (P6) after the second pull; `ABC-285` (P5), `ABC-296` (X1) and
    `ABC-297` (X2) on their ADRs. They share `src/search.ts` / `src/engine.ts` with `ABC-282` and with each other, one at
    a time; whichever merges second re-reads its door counts (`ADR-0061` d9). *2026-11-04 (`bapm-ABC-283-done`):
    **`ABC-283` merged `58e90d07`**; `ABC-286` and `ABC-288` are unheld for their probes, `ABC-298`'s turn after it has
    come (it waits on its ADR only), and `ABC-282` is unheld (it rebases, D12).*
  - **`ABC-289` (Q2):** ~~`Q-3K-10`, then the Architect's re-measure~~ held on the Architect's re-measure over Q1 and
    its ADR *(2026-11-04, `bapm-owner-answers-1104`: `Q-3K-10` answered yes)*; `src/quiescence.ts`. *2026-11-04
    (`bapm-lines-1104`): that hold is cleared (`ADR-0074` PROPOSED, premise met). The merge waits on OQ-0074-1 and its read.
    **One at a time with `ABC-282` and bundle 1** (`ABC-286` + `ABC-288`, named `…3b15b361` 3): whichever merges second
    re-reads its instrument counts, and the later switch is the top rung (`ADR-0074` § Consequences). Not yet scheduled:
    after W1 the build order is `ABC-301` scope 0, bundle 1, then `ABC-289`, and the row census gates the second of
    them (`…085f647c` 5).* *2026-11-04 (`bapm-bundle-1-cut`; `ADR-0056` D5's dated block): OQ-0074-1 answered yes. **Bundle 1 reads first;
    `ABC-289` reads alone after it,** on top of the bundle if it merged, on `main` without it if NOT MET. Its build starts when
    `ABC-303`'s merge or `failed-attempt` is recorded, not before.*
  - **`ABC-303` (bundle 1; `ABC-286` + `ABC-288`):** *2026-11-04 (`bapm-bundle-1-cut`; the Orchestrator's slot):* the code may be built now. Its
    C2′ read runs only after `ABC-282` and `ABC-301` have each merged or been recorded as failed, so neither makes that read
    stale. If `ABC-282` merges, this ticket lands second and carries the re-read of b = 2.3 and A0's counts (`ADR-0072` d11).
  - **Readings:** `ABC-295` (R2) at Phase 4's close, `ABC-299` (R3) at Phase 5's close; which tickets close each phase is
    the Orchestrator's ruling.
- *2026-11-04 (`bapm-ABC-301-cut`; `arch-second-pull-1104` `…4917f0f7` § 5, `…a5d74f70`):* **`ABC-271` → `ABC-301`
  (E2's second pull), one read judging both** (`ADR-0070` d7). `ABC-271` (`872e5ffc`), `ABC-280` (the tool,
  `0c8b385a`) and `ABC-283` (`58e90d07`) are merged, so nothing open orders the fit. B-T7's base is `main` at the
  candidate freeze; a value-changing merge after the freeze makes B-T7 stale (C2′'s stale rule). `ABC-301` shares
  `src/evaluate.ts` / `src/evaluate-params.ts` with `ABC-272`, one at a time. It is kept apart from any bundle
  (`…a5d74f70`). After it: `ABC-287` (P6) and `ABC-290`–`ABC-293`, as written above.
- *2026-11-03 (`bapm-ABC-236-park`):* `ABC-236` (S1) is parked (`ADR-0066`, premise not met), so it orders nothing.
  On a re-open it edits `src/engine.ts` only and takes its turn after whichever ticket then holds that file; its T1
  re-open condition puts it after `ABC-257`'s merge. *2026-11-04 (`bapm-ABC-283-done`): superseded. `ABC-236` is Done,
  delivered by `ABC-283` (merged `58e90d07`); root aspiration is on `main`, so `ABC-282` rebases over it (D12).*

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
  at most one 2-worker row in the default lane (`ABC-266` test note 1, `ABC-267` A4–A5). *2026-11-02 (`bapm-ABC-266-rows`,
  `ADR-0062` D11): the default lane holds **zero** real-worker rows, fake-pool rows only; every real-worker row runs in
  a Node child in the opt-in `THREADS_DEEP` lane.*
- **`RISK-EPIC011-08` (2026-11-02, `bapm-phase2-records`): Phase 2 has lost its two largest estimates for now.** P2
  (+30–60) is dropped and P1 (+40–100) is parked (`ADR-0056` D2 estimates, not readings). P4 (+20–40) waits on P1.
  That leaves P3, P5 and P6 (+15–40, +10–30 and +5–15) pullable on today's `main`, so R1 may read a
  small Phase 2. Mitigated by P1's named re-measure trigger (P3 merged, or O1h) under unchanged bars, and by
  `ADR-0059`'s named re-cut premises for P2. No bar is loosened to recover either one.
  *2026-11-02 (`bapm-P3-page`): P3 is cut as `ABC-268` on a measured premise (0.79–0.83× at depth 8, +0.279 ply),
  with `ADR-0056` D2's +15–40 still an estimate until its read. P6 is rejected on today's evaluation and P4 waits on
  O1h, so P3 and P5 are what Phase 2 can read on today's `main`.*
- **`RISK-EPIC011-09` (2026-11-02, `bapm-ABC-266-rows`): the threads gain may not show at 100 ms.** In the
  `ADR-0062` design probe, helpers barely shortened worker 0's path to a depth (ratios 0.868–1.406 to the same search
  alone, with no consistent reduction), and worker 0 reached its solo depth in 64 of 64 runs (`…0c8cf7d0`; counts, no
  clock). So the +55 to +150 Elo estimate (`ADR-0057` D2.5) is unsupported. If `Threads 12` plays at about
  `Threads 1`'s depth, A7 reads about 50 and misses about half the time on noise, and F4 forbids a replay. Mitigated
  by `ADR-0062` D6 (the deepest completed iteration is played, which follows the fastest core) and by the D12 timing
  probe before Development. A "not above" reading sends the design back to the Architect, for helper diversity or
  `ADR-0058`'s rule at `Threads ≥ 2`. No bar is loosened.
  *2026-11-02 (`bapm-P3-page`): **REALISED.** The D12 probe read MISS, not loaded (`qe-ABC-266-d12` `…9f9aeb87`):
  median played depth 7 at `Threads 1`, 4 and 12 at 100 ms; the 12 workers finished the same depth in 19 of 20
  searches; a worker at T12 ran at about 0.69 of a single thread's nodes (cause `UNKNOWN - verify`). D6 changed the
  played depth once. `ABC-266`'s Development is blocked until the Architect's re-proposal (`arch-ABC-266-repropose`),
  which pre-registers its candidates and may recommend parking the strand. No bar is loosened.*

- **`RISK-EPIC011-10` (2026-11-03, `bapm-epic011-cut`): under `Q-3K-4` (b) depth can erode a little per evaluation
  ticket, unseen.** Each evaluation ticket may cost a few percent of depth and pass on play; only the depth-6 floor
  binds. Several such tickets (E1, E3a, E4a, E7a, E2) could together push the `G6` boards toward the floor.
  Mitigated by: every page reports the `G6` medians against base; C3″ is the net check across the epic; each page's
  `G2` row (≤ 1.05 × per call) still binds; and lazy evaluation / O1-e are recorded as the cost cuts to weigh once
  the evaluation grows (§ Phases, "Not cut, recorded").
- **`RISK-EPIC011-11` (2026-11-03, `bapm-epic011-cut`): the evaluation instrument is small.** It is 123 unique positions
  (22 of the 145 were duplicates), 38 errors at the 100 ms node budget. It ranks levers; it cannot tell one evaluation
  form from another (E1's L read 39 against base's 38). It stays information only, never a bar, as every PREREG so far
  has fixed. A larger, de-duplicated set is a design choice for `ABC-239`'s method ADR, not a ticket here.
  *2026-11-03 (`bapm-E2pre-cut`):* `ADR-0067` keeps the instrument as information only and uses the tuner's own loss on held-out openings.
- **`RISK-EPIC011-12` (2026-11-03, `bapm-E2pre-cut`): on own games alone, E2's first pull may be too small to read.**
  The bounded fit moves the loss about 0.4 % (0.9960 × inner, `…48ae6a93`), which is likely inside C2′'s ± 48 Elo, so
  `ABC-239`'s F6 may fire. A loss figure is not Elo. About 40 % of today's rows come from C2′'s openings 1–50, so a
  fitted set may read a few Elo better there than elsewhere. Mitigated by: Q-3K-7 (a) (broader training data, owner,
  pending); S′ and B-T8 as the outside checks (B-T8 pending); F6's rule that no set is re-fitted on play results.

## NFR triggers

- **`NFR-005`** (depth floor 6 at the default budget): at risk from every value-changing ticket; `G6` reads it. *2026-11-03 (`bapm-epic011-cut`): for evaluation tickets, graded on the floor only (`Q-3K-4` (b)); "≥ base" reported; `RISK-EPIC011-10`.*
- **`NFR-009`** (≤ 16 MiB, ≤ 1 MiB growth): `ABC-257` (table kept across moves, growth over a game), `ABC-258` (size),
  `ABC-233`/O2c (history tables). *2026-11-02 (`ADR-0057` OQ-4 (a)):* for `ABC-266` and `ABC-267`, retained growth
  summed over the main thread and every worker, the shared table counted once, each worker's V8 baseline heap outside
  the bound. About 10 MiB at 12 workers (`estimate`); the level does not move. ~~`NFR-009`'s file may need one line on this
  reading, the `ABC-266` design hop's, with Security/NFR.~~ *2026-11-02 (`bapm-ABC-266-rows`): the line is written in
  `ADR-0062` D10, for Security/NFR to place at `ABC-266`'s gate; `ABC-267`'s row is now `ABC-266` A5.*
- **`NFR-004`** (per-move ceilings, incl. `uci-clock-mode`'s 60 s): W1 and every 40/15 reading. *2026-11-02:* `ABC-266`,
  where each worker checks the clock every `NODES_PER_CLOCK_CHECK` (1 024) nodes and `G5` is read at both thread counts.
  `AR-UCI-BUSY` is unchanged at `Threads 1`.
- **`NFR-008`** (`npm test` ≤ 10 s): new rows on the virtual clock or at fixed depth only; readings never run in
  `npm test`. *2026-11-02:* at most one small 2-worker property row in the default lane, read before and after
  (`ABC-267` A4). Every other multi-worker row sits behind a deep flag. *2026-11-02 (`ADR-0062` D11): **zero**
  real-worker rows in the default lane; `N8-LANE` still read before and after (`ABC-266` A6).*
- **`NFR-010`** *(2026-11-02, `ADR-0062` D11, `bapm-ABC-266-rows`)*: the `THREADS_DEEP` engine child runs with
  `--max-old-space-size=48 --max-semi-space-size=8`, 72 MiB an isolate. The child plus 12 workers is 936 MiB, inside
  the one-file shape's 992 MiB child allowance; the lane total is 1 928 ≤ 2 048 MiB. The row is Security/NFR's to
  place at `ABC-266`'s gate. The level does not move.
- **Security (ASVS L1):** `ABC-255` reads only artifacts it builds; no new input path in the engine.

## Test notes

- Readings run in QE's scratch clone, ALONE, outside `npm test`, as `ABC-204`/`ABC-225`.
- Search and evaluation tickets use the `ADR-0026` door pattern (`G4`: the door reproduces base node for node).
- Value-changing tickets owe UAT; the QE verdict signs it (owner delegation `…5aaf7cec` item 2).
- W1 cannot be graded at a fixed time per move; its test needs a clock control (named at its refinement).
- *2026-11-02 (`bapm-threads-cut`):* `Threads 1` keeps every oracle node for node (`G4`). `Threads ≥ 2` is tested by
  properties only (a legal move, a bounded time, no thrown error, no corrupt hit), never by node counts (`ADR-0057` D4).
- *2026-11-03 (`bapm-sec-cut`; `QE-274-a`, LOW):* **QE freeze before the build.** When a ticket's test note puts a QE
  act before the build (a frozen position set, a PREREG), the Orchestrator dispatches that QE act before the Engineer's
  first commit, and the Engineer's brief cites the frozen set's note. A freeze made after the build protects nothing.
  (No ticket template exists in this repo; this line is the home until one does.)
- *2026-11-03 (`bapm-sec-cut`; `ADR-0049` D4):* records name host paths by placeholder only (`<home>`, `<repo>`,
  `<scratch>`, `<out>`); the rule and its check are `ABC-277`.
