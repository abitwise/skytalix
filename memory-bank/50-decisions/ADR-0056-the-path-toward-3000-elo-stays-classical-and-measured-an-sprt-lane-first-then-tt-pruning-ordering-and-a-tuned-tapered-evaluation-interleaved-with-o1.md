---
kind: adr
id: ADR-0056
---
# ADR-0056: The path toward 3 000 Elo stays classical and measured. A fast self-play SPRT lane comes first, then the transposition table, pruning, ordering and a tuned, tapered evaluation, interleaved with ADR-0055's O1 cuts. 3 000 is a stretch on any scale, and the scale is the owner's

## Status

**ACCEPTED IN DIRECTION** 2026-11-01 by the owner. Folded by Architect/Design (task `arch-adr0056-owner-fold`,
records only, at `main` `2e9a2457`). Nothing was run.

- **His words, verbatim** (`orch-2026-10-30a` `…022fb66f`): *"3000 elo target would be 22s per move or 15 minutes per
  40 moves, not with 4s per move. But let's not benchmark all the time with those values, we can becnhmark with
  smaller values for faster feedback loop, can be also 0,5s per move to get faster readings. Otherwise i'm happy with
  where we are going, let's create new Epic yes and finish other epics before that. Go over previous epics and tickets
  to find conflicting work, no need to do the same work twice."*
- **What "in direction" accepts:** the classical path (D1–D4), measuring on a named scale with a per-change instrument
  (D5), and the phase order (D6) as a recommendation. Each step still brings its own ticket, and its own ADR where an
  existing decision changes. Nothing in D7 that he did not answer is accepted.
- **Answered:**
  - **Q-3K-1, the time part.** The 3 000 claim is read at **40/15** (40 moves in 15 minutes, about 22 s a move), not
    at 4 s a move. That replaces D5 item 2's "one 120 + 1 reading at the claim". The scale (Stockfish 19 `UCI_Elo`)
    and the claim rule (D5 item 5) were not contested. They stand as proposed, accepted in direction. The claim plan
    is under D5 (dated block, 2026-11-01).
  - **Routine readings use shorter controls, down to 0.5 s a move** (his word). The controls proposed are under D5
    (dated block). The claim stays at 40/15.
  - **Q-3K-5, scope.** A **new epic** (`EPIC-011`, created by BA/PM, task `bapm-epic011-dedupe`). It **starts after
    the open epics close**, and no work is done twice (his dedupe word, BA/PM's audit).
- **Still open (his):** Q-3K-2 (SPRT in the per-change rule), Q-3K-3 (test width, cores), Q-3K-4 (`G6` "≥ base"),
  Q-3K-6 (`NFR-009` above 16 MiB), Q-3K-7 (tuning data), Q-3K-8 (bitboards, later), and `ADR-0055`'s Q-SP-3
  (`ABC-254`, the `ADR-0003` amendment). See D7's dated lines.
- **One order line is corrected:** D6 Phase 0's "O1-a, then O1-b/c" yields to `ADR-0055` D4 as BA/PM cut it.
  `ABC-250` (O1-b part 1, the gate reading) comes first and `ABC-253` (O1-a) after. See D6's dated line.
- **One estimate is corrected:** D5 item 3's pick depth at E ≈ 3 000 is **14**, not 18–20 (read from Stockfish's
  `search.h` at `sf_19`). See D5's dated block.

**Folded 2026-11-01, second time** (task `arch-adr0056-100ms-fold`, records only, at `main` `452415bd`; nothing run):
the owner's word of 2026-11-01 (`orch-2026-10-30a` `…2896c6eb`) and the `qe-tc-depth-probe` readings (readout
`…b505d675`, READ, not graded).

- **His words, verbatim:** *"We can just run 100 games that's it and 400 games after each epic is done on 100ms. This
  squeezes the algorithm to be better with less cpu resources."* On SPRT he said: *"We need to skip even testing it due
  to time constraints."* The Orchestrator recorded this as "no SPRT".
- **What changes:** **there is no SPRT lane.** C2 (the per-change SPRT) and C3 (4 s milestone trend readings) are
  superseded by D5's dated block "the fixed-count rule at 100 ms". It holds two readings: a 100-game self-play read per
  strength change and a 400-game interleaved pair against Stockfish per epic. The title's "an SPRT lane first" now
  reads "a fixed-count 100 / 400 lane first". The file name is kept so that references do not break.
- **Answered by this word and `…f7a50e95`:** Q-3K-2 (no SPRT; fixed counts) and Q-3K-3 (one core, width 1). See D7.
- **Unchanged:** the 40/15 claim (C1), its 0.5 s Stockfish floor, the scale, the claim rule, and D1–D4 and D6's order.
  C4's anchors keep their place, but their paired fast reading moves from 4 s to 100 ms.

**Folded 2026-11-01, third time** (task `arch-adr0056-owner-answers`, records only, at `main` `adab5f0d`; nothing run):
the owner's answers to the three calls the second fold left open (`orch-2026-10-30a` `…43098cef`).

- **His words, verbatim:** *"1. b ; 2. ok ; 3. quick check can be with 0.5s difficulty. Make sure engine is not
  changed internally and it works on different difficulty settings."*
- **What changes:**
  - **"1. b":** the per-epic read is **400 games head to head**, the epic's closing build against its starting build,
    at 100 ms. C3′ (200 + 200 games against Stockfish) is superseded by **C3″** in D5's dated block "the owner's three
    answers".
  - **"2. ok":** C2′'s GAIN (≥ 50.0 of 100) and NEUTRAL (≥ 43.0 of 100) bars are **owner-accepted**, with their stated
    blind spot.
  - **"3.":** the R smoke stays, as **10 games against Stockfish at 0.5 s a move**, not 4 s (**S′**). His condition is
    written as the rule **R-TC**: a test control lives in the harness and its configuration only, and every strength
    change shows that the engine still plays at each difficulty setting. The same block names the check.
- **The outside opponent now:** the 0.5 s smoke, and the 40/15 readings (the C1 claim and the C4 anchors). No routine
  per-epic reading against Stockfish remains.
- **Unchanged:** C1; C2′, except its smoke paragraph; the scale; the claim rule; D1–D4; D6's order.

**Folded 2026-11-02, fourth time** (task `arch-owner-answers-1102`, records only, at `main` `7daf8086`; nothing run):
the owner's answers of 2026-11-02 (`orch-2026-10-30a` `…81ae2db4`).

- **His words, verbatim:** *"R yes, P yes, A accept, B park, C yes; 1 yes, 2 a, 3 c, 4 a, 5 no, 6 later"*. R, A and
  B are `ADR-0059`, `ADR-0058` and `ADR-0025`'s T2 amendment; 1–6 are `ADR-0057`'s OQ-1 to OQ-6.
- **What changes here:**
  - **"P yes":** Phase 1 (the TT) is paused, and Phase 2 (pruning) goes first. D6's 2026-11-02 line is now his
    order, not only the order being worked. See D6's dated line of this fold.
  - **"C yes":** the NEUTRAL bar (≥ 43.0 of 100) may grade a change that cannot be seen at 100 ms, together with the
    ticket's own measured bar. The ticket's page names it, before the read. See C2′'s dated line.
  - **`ADR-0057` accepted (threads):** the threads strand joins `EPIC-011`. Its place in the order is in D6's dated
    line. Q-3K-3's reading is now OQ-2 (a), and the 40/15 claim is read at `Threads 1` and `Threads N` separately
    (OQ-3 (c)). See D7's and C1's dated lines.
- **Unchanged:** the GAIN bar, C1's rule and scale, C3″, S′, R-TC, D1–D4, and Phases 2–5's order.

- *2026-11-01, dated line by Architect/Design (task `arch-abc250-close`, records only, at `main` `767a2e3e`).* **S′
  keeps E = 1 650, owner-confirmed** (`orch-2026-10-30a` `…1f5e3b27`, verbatim: *"ok set to 1650 and if you see in
  the future we can raise it then let's raise."*). Raising E follows S′'s re-pin rule as written: a pooled S′ score
  above 85 % over 30 or more games moves E up one band-rule step, kept at E ≤ 2 600, with no further owner ask. His
  word does not speak to the downward side, which stays as written. The first S′ on `main` scored 9 of 10 (0.900)
  at E 1 650 (`qe-ABC-255` `…f41a5b6e`, QE-255-d), above the 67–83 % estimate. That is 10 games, short of the
  30-game pool, so no re-pin yet. V1 and V2's O1 figures (D2) are re-read in `ADR-0055`'s status line of this date.
- *2026-11-02, dated line by Architect/Design (task `arch-post-268`, records only, at `main` `56b3782d`).* **S′ is
  re-pinned upward, from E = 1 650 to E = 1 980.** The rule fired, and the owner pre-authorised an upward move
  (`…1f5e3b27`). It was applied as written, with no owner ask.
  - **The trigger.** `ABC-268` merged at `e72487e1` (`orch-2026-10-30a` `…77a82ec1`), so its smoke joins the pool,
    which takes merged builds only. The pool is now:
    - `qe-ABC-255` A5, `becf571a`: 9/1/0;
    - `qe-EPIC-010-close`, `053733d2`: 9/1/0;
    - `qe-ABC-268-p2`, `1169c024`, merged as `e72487e1`: 8/2/0 (`…d582d7dd`).
    - That is W/L/D **26/4/0 = 26.0 / 30 = 86.7 %**, above 85 % over 30 games.
    - `ABC-264`'s 7.0 / 10 stays out of the pool, because `ABC-264` did not merge.
  - **The step,** one band-rule step (`ABC-204` `A4`'s rule: E′ = E + X, rounded to 10, clamped to 1 320–3 190, and
    E ≤ 2 600 here).
    - X is cutechess-cli's formula on the pooled score: −400 · log₁₀(1 / 0.8667 − 1) = **+325.2**. Its 95 % error
      on 26/4/0 is ± 292.3. It was computed with `tools/rating/pair.ts`'s `cutechessElo` formula; no game was played.
    - E′ = 1 650 + 325.2 = 1 975.2, which rounds to **1 980**. Neither the clamp nor the 2 600 cap binds.
  - **The new setting:** Stockfish 19, `UCI_LimitStrength` true, **`UCI_Elo` 1 980**. Everything else in S′ is
    unchanged:
    - `st=0.5`, `timemargin` 2 000 ms, `Threads 1`, `Hash 16`, `restart=on`;
    - skytalix at `st=0.5` with a 50 ms margin;
    - openings 1–5, both colours;
    - the bars S-1, S-2 and S-4 (≥ 3.0 of 10; below that, 10 more games and ≥ 7.0 of 20).
    - The depth guard follows E: at 1 980 Stockfish picks at depth 5 (level 4.11 by `sf_19`'s formula), not 3.
      `rating.ts` computes it from `--elo`. `st=0.5` keeps its headroom, since C1's 0.5 s floor holds up to
      E 2 600.
  - **The command:** `node tools/rating/rating.ts r <candidate> <out> --elo 1980 --budget-ms 500 --rounds 5
    --concurrency 1`.
    - The `r` default in `tools/rating/rating.ts` stays 1 650, and no code changes. So **`--elo 1980` must be written
      out**. A run without it is an S′ at the old E, and it does not pool.
    - `--dry-run` at `e72487e1` printed `option.UCI_Elo=1980` and `st=0.5` for both engines
      (`.grugops/context/arch-post-268/raw/s-prime-dry-run.txt`).
  - **When the pool resets: now.** The E 1 650 pool closes at 26.0 / 30 and is kept as history. Scores taken at two
    different values of E are never pooled.
    - A new pool opens at E 1 980 with the next merged build's S′, whether per ticket or per epic. It is empty until
      then.
    - The trigger is read again once it holds 30 or more games. Above 85 %, it steps up again by the same rule, up
      to E 2 600. Below 60 %, it is the owner's question, because his word covers the upward side only.
    - A candidate's S′ at E 1 980 is graded at once by S-4. It pools only if the build merges.
  - **What 1 980 expects, said plainly** (an estimate, not a reading).
    - The band-rule step aims at about 50 % for the engine as merged. At ± 292 that aim is coarse: the true X could
      be anywhere from about +150 to +600.
    - At 50 %, S-4's ≥ 3.0 of 10 stops an unchanged build about 5 % of the time on the first 10 games. The 20-game
      rule clears most of those.
    - **The trigger band, 60–85 %, no longer brackets the expected score.** A pool near 50 % would raise the downward
      question after 30 games, by construction. This is an open question for the Orchestrator (`arch-post-268`
      notes), and nothing is changed here.
    - For scale: S′'s own text estimated skytalix at 0.5 s at about 1 775–1 925. At E 1 910 it expected 31–52 %, so
      S-4 "would often stop an unchanged build". The pool now places the merged engine near 1 975, above that
      estimate. That is a 30-game point estimate, not a rating.
  - **Records owed elsewhere** (not this hop's fence): BA/PM records the new E and the reset in `EPIC-011` § Close-out
    (the S′ pool row) and C10. The strength tickets' S′ lines then read E 1 980.
- *2026-11-02, dated amendment by Architect/Design (task `arch-ABC-233`, records only, at `main` `60b76b52`). It
  supersedes the E 1 980 of the line above.* **The re-pin step aims at the centre of S′'s trigger band, so S′'s
  opponent is E = 1 810, not 1 980.** The Orchestrator ruled it (`orch-2026-10-30a` `…8ce2fd23`), adopting option (b)
  of `arch-post-268`'s open question 1 (`…1bc554fb`). This is a measurement setting, inside delivery and inside the
  owner's upward pre-authorisation (`…1f5e3b27`). The Orchestrator informs the owner.
  - **Why.** The band-rule step of the line above aims at about 50 %, but the trigger band is 60–85 %. A pool near
    50 % would then raise the downward question after 30 games by construction, and S-4 would stop an unchanged
    build about 5 % of the time. Aiming at the band's centre fixes both.
  - **The rule, written once and symmetric.** When the pooled S′ score p over 30 or more games leaves 60–85 %:
    - X = −400 · log₁₀(1 / p − 1), cutechess-cli's formula (`tools/rating/pair.ts`), is the pool's Elo against E;
    - C = −400 · log₁₀(1 / 0.725 − 1) = **+168.4** is the Elo at the band's centre, 72.5 %;
    - **E′ = E + X − C**, rounded to 10 and clamped to 1 320–3 190.
    - The same formula serves both directions. Upward (p > 85 %) it applies with no owner ask, up to E 2 600.
      Downward (p < 60 %) it gives the proposed E′, but applying it stays the owner's question, because his word
      covers the upward side only. Above E 2 600 the R5-style probe still runs first (S′'s Stockfish bullet).
  - **This step.** The E 1 650 pool, 26/4/0, gives p = 0.8667 and X = +325.2 (± 292.3 at 95 %). So E′ = 1 650 +
    325.2 − 168.4 = 1 806.8, which rounds to **1 810**. Neither the clamp nor the cap binds.
  - **The new setting:** Stockfish 19, `UCI_LimitStrength` true, **`UCI_Elo` 1 810**. Everything else in S′ is
    unchanged: `st=0.5`, `timemargin` 2 000 ms, `Threads 1`, `Hash 16`, `restart=on`; skytalix at `st=0.5` with a
    50 ms margin; openings 1–5, both colours; the bars S-1, S-2 and S-4.
    - The depth guard follows E: at 1 810, Stockfish picks at depth **4** (level 3.40 by `sf_19`'s formula in
      `rating.ts`'s `pickDepth`). `rating.ts` computes it from `--elo`.
  - **The command:** `node tools/rating/rating.ts r <candidate> <out> --elo 1810 --budget-ms 500 --rounds 5
    --concurrency 1`.
    - `r`'s default stays 1 650 in code, and no code changes. So **`--elo 1810` must be written out**. A run at any
      other E does not pool.
    - `--dry-run` at `e72487e1` printed `option.UCI_Elo=1810`, `st=0.5` for both engines, `timemargin` 50 / 2 000,
      and 5 rounds of 2 games (`.grugops/context/arch-ABC-233/raw/s-prime-dry-run-1810.txt`).
  - **The pool starts empty at E 1 810.** The E 1 980 pool never opened: no S′ was played at 1 980 (no build merged
    between the two rulings). The E 1 650 pool stays closed at 26.0 / 30 as history. The first S′ of the next merged
    build opens the 1 810 pool. A candidate's S′ is graded at once by S-4 and pools only if the build merges. The
    trigger is read again at 30 or more games, by the rule above.
  - **What 1 810 expects** (an estimate, not a reading). The pool puts the merged engine near 1 975 at 0.5 s, which
    gives about **72 %** against E 1 810. At ± 292 the true expectation could lie anywhere from about 33 % to 93 %. At
    72 %, S-4's ≥ 3.0 of 10 stops an unchanged build about 0.1 % of the time.
  - **Records owed elsewhere** (not this hop's fence): BA/PM records E 1 810 and the empty pool in `EPIC-011`
    § Close-out (the S′ pool row) and C10. Each open strength ticket's S′ line reads E 1 810 with `--elo 1810`;
    `ABC-233`'s A6 still reads "S-4 at E 1 650" with no `--elo`.

**Folded 2026-11-03** (task `arch-ABC-269-rule`, records only, on `grugops/arch-ABC-269-rule` from `main` `17725732`;
nothing run): the owner's word of 2026-11-02 (`orch-2026-10-30a` `…cc7db847`).

- **His words, verbatim:** *"64 yes, Q-3K-4 b"*.
- **`Q-3K-4`: answered (b).** Value-changing evaluation tickets are judged on play, with `NFR-005`'s depth-6 floor and
  depth-7 WARN. `G6` "≥ base" is reported for them, not graded. D7's dated line gives the rule and its scope.
- **E1's ADR is accepted:** `ADR-0064`, not in force until `ABC-269` merges (D2's dated line).
- **Still open (his):** Q-3K-6, Q-3K-7, Q-3K-8.

**Folded 2026-11-03** (task `arch-fold-1103b`, records only, on `grugops/arch-fold-1103b` from `main` `239ac715`;
nothing run): the lines owed by `arch-ABC-239` `…e4c34239` § 5.

- **Row E2 → `ADR-0067`** (PROPOSED). See D2's dated line.
- **D6 Phase 4, as worked:** `ABC-269` → `ABC-274` → `ABC-239` → `ABC-270` / `ABC-271`, with `ABC-272` in any order.
  See D6's dated line.
- **Q-3K-7 is split into (a) / (b) / (c), each pending.** `ADR-0067` acceptance and B-T8 are new owner items, also
  pending. See D7's dated line.
- **Still open (his):** Q-3K-6, Q-3K-7 (a) / (b) / (c), Q-3K-8, Q-3K-9, `ADR-0067` acceptance, and B-T8.

**Folded 2026-11-03** (task `arch-post-269`, records only, on `grugops/arch-post-269` from `main` `128e3c6c`; nothing
run): after `ABC-269`'s merge `54dee3f2` (QE PASS_WITH_GAPS `…eff2fe64`). Notes: the pool `…ee31f3ee`, the R1 ruling
`…8136b589`.

- **E1 is in force on `main`** (`ADR-0064`, status line of this date). Row E1 is done. D6 Phase 4 moves to `ABC-274`.
- **The S′ pool at E 1 810 opens with one merged build.** The rule is this section's dated amendment of 2026-11-02
  (`arch-ABC-233`): merged builds only, E′ = E + X − 168.4 once 30 or more pooled games leave 60–85 %.
  - **The pool now:** `qe-ABC-269`, candidate `be87a2f1`, merged as `54dee3f2`: W/L/D **7/3/0** (`…2c51ee30`). That is
    **7.0 / 10 = 70.0 %**. No other build has played S′ at E 1 810: `ABC-268`'s 8/2/0 closed the E 1 650 pool, and no
    build merged between the 1 810 ruling and `ABC-269`.
  - **No step fires.** The pool holds 10 games, below 30, so the trigger is not read. For scale, 70.0 % lies inside
    60–85 % in any case. Its Elo against E is X = −400 · log₁₀(1 / 0.7 − 1) = +147.2, which equals cutechess-cli's
    printed figure. That is a 10-game point estimate, ± 385 at 95 %.
  - **What would fire it at 30 games.** If the next 20 pooled games score **≥ 19.0** (26.0 / 30 = 86.7 %), the pool
    steps up with no owner ask. If they score **≤ 10.5** (17.5 / 30 = 58.3 %), the downward question goes to the owner.
    Anything between moves nothing.
  - `ABC-274` plays no games (value-identical), so it adds nothing to the pool. R1 is at 100 ms, a different control,
    so its games never pool.
- **R1–R3 survive, re-pointed to C4's 100 ms reading. R1's command needs one `tools/`-only change first.** The ruling
  and the exact command are in D6's dated line of this date. R1 is not asked of the owner: it is estimated at
  0.4–0.9 h, under 1 h.
- **Still open (his):** unchanged from the block above.

**Folded 2026-11-03** (task `arch-owner-answers-1103`, records only, on `grugops/arch-owner-answers-1103` from `main`
`dc7dc15d`; only a data-size probe was run): the owner's answers `orch-2026-10-30a` `…af126c04`.

- **His words, verbatim:** *"1. yes ; 2. yes ; 3. no ; 4. no ; 5. ok yes ; 6. yes ; 7. yes; 8. yes"*.
- **What changes here:**
  - **"1. yes":** `ADR-0067` (row E2's method) is **ACCEPTED** and in force as the method. `ABC-274` (E2-pre) merged
    at `2410d4f7`. See D2's dated line.
  - **"2. yes", "3. no", "4. no": Q-3K-7 is answered.**
    - (a) **yes:** the Lichess CC0 database export may be training data beside own self-play;
    - (b) **no:** no Stockfish-labelled targets;
    - (c) **no:** our games against Stockfish are never training data. They stay the outside measure.
    - The data pin is `ADR-0067` § Addendum 2026-11-03. See D7's dated line.
  - **"5. ok yes": B-T8 is approved,** the 200 + 200 outside pair (about 5 h) before `ABC-239` merges.
  - **"6. yes": Q-3K-9 is answered.** `ADR-0024` d4 is opened for the **design** of Q1 (SEE pruning of losing
    captures). A build ships only on its own evidence. See D2's dated line.
  - **"8. yes":** `ABC-270`'s design (E3a) may start now, ahead of `ABC-239`'s build. The build order is the
    Orchestrator's (`ADR-0067` § Consequences, dated line).
  - "7. yes" is `SEC-HP-2` (`ABC-277` A7). It is not this ADR's.
- **Still open (his):** Q-3K-6 (`NFR-009` above 16 MiB) and Q-3K-8 (bitboards, later).

**Folded 2026-11-03, again** (task `arch-owner-answers-1103b`, records only, on `grugops/arch-owner-answers-1103b`
from `main` `0bf243df`; nothing run): the owner's word `orch-2026-10-30a` `…401c3d09`.

- **His words, verbatim:** *"yes, accept ADR-0068 and ADR-0069"*.
- **What changes here:**
  - **Row E3: E3a is `ADR-0068`, ACCEPTED.** It is not in force until `ABC-270` merges. See D2's dated line.
  - **Row Q1: `ADR-0069`, ACCEPTED.** It is not in force until the Q1 ticket merges on its own read. It amends
    `ADR-0024` d4. See D2's dated line.
  - **D6 Phase 4's order:** `ABC-270` (structure) → `ABC-239`'s fit, with Q1 merging (or missing) before `ABC-239`'s
    B-T7 / B-T8 freeze. See D6's dated line.
- **Still open (his):** Q-3K-6 and Q-3K-8, unchanged.

*2026-11-04, dated line by Architect/Design (task `arch-bundle-1`, on `grugops/arch-bundle-1` from `main` `0cc9afd1`).*
**D5's bundle read is ACCEPTED** (the owner, `Q-3K-11` (a), `orch-2026-10-30a` `…3b15b361`), carrying R-BUNDLE-1
(`…ce2883d8`). It is part of the per-change rule. Bundle 1 is named by him: `ABC-286` + `ABC-288`. No other change to
the rule.

*2026-11-04, dated line by Architect/Design (task `arch-owner-answers-1104b`, records only at `main` `65e28f95`).*
**Bundle 1 goes to the build by the owner's word (`…3e73f9f9`, "1. Bundle 1: (a)"), over two missed premises.** `ADR-0072`
and `ADR-0073` are ACCEPTED, not in force. D5's dated block of this task states the rows its read holds and its order
against `ABC-289`. `ADR-0074` is ACCEPTED ("2. OQ-0074-1: yes accept."), not in force. D2's dated line of this task gives
the rows. No line of B1–B7 changes.

**Folded 2026-11-06** (task `arch-records-1106`, records only, on `grugops/arch-records-1106` from `main` `8e115110`; nothing
run): after `ABC-303`'s merge `434fa171` (QE MET, PASS_WITH_GAPS `…ebefbfa2`; B4 `…9e2facfa`). Owed by `arch-ABC-303-b5`
`…28283e48` § 2.

- **`ADR-0072` and `ADR-0073` are in force on `main`,** as the parts of bundle 1. Each ADR's § Status carries B5's line. "ACCEPTED,
  not in force" above no longer reads for those two. Credit is to the bundle, with no per-part Elo. The premises stay overridden.
- **`ADR-0074` stays ACCEPTED, not in force.** `ABC-289` is recorded NOT MET on an exact build. D2's dated line of this task gives
  the rows.
- **New, open (his):** OQ-0074-2, which blocks nothing.

*2026-11-05, dated line by Architect/Design (task `arch-owner-answers-1105b`, records only at `main` `6ff2554e`; his word `…0f1ab02e`, verbatim "1. yes;
2. yes; 3. yes").* **CF1–CF10 reach every later C2′ read, of one change or of a bundle. A term merged inside a bundle meets `ADR-0067`'s
third-pull trigger. CF7 is owner-accepted.** D5's dated block of this task holds the reach. No bar moves.

*Original status, kept:* **PROPOSED** 2026-11-01 by Architect/Design (task `arch-algo-analysis`, records and reading only, at `main` `bae25131`).
**Nothing is decided here.** Nothing was run, built, benchmarked or played: `qe-ABC-223` holds the host STRICTLY ALONE.
Every Elo figure below is either quoted from a sealed reading (named) or is an **estimate** with its basis. An
estimate is not a reading.

- **Source of the question.** The owner, 2026-11-01, verbatim (`orch-2026-10-30a` `…74216a44`): *"Analyze current
  state of algorithms, maybe this needs separate spike ticket, also I remember some tickets addressing similar topics,
  check if they are done and do we need to analyze algorithm side. As we can see it is possible to reach 3000 elo
  rating without neural engine? Set the goal to 3000 elo rating from current goal."*
- **What is the owner's:** the scale and time control a "3 000" is read on (D5); any change to his `EPIC-010` merge
  rule (Q4 = (e)); the `G6` "≥ base" reading rule (his word `…2ae5fc12`); the test width (his "one at a time",
  `…65848126`); scope changes, including re-running what `EPIC-010` § Out of scope fences; any NFR level (`NFR-009`
  above 16 MiB); re-opening `ADR-0001` (bitboards). D7 lists them. No agent marks any part of this ADR accepted.
- **What this ADR amends if accepted:** nothing by itself. It proposes an order (D6). Each step brings its own ticket,
  and its own ADR where an existing decision changes.
- **Companion:** `ADR-0055` is ACCEPTED (O1) by its dated status line of 2026-11-01. This ADR does not change it.

## Context

### Today's outside reading

- Milestone 1's batch (`qe-EPIC-010-m1-batch-2` `…1a53a7f9`): head `51902be5` scored **72.00 % ± 6.11** (141/53/6) at
  4 000 ms a move against Stockfish 19 `UCI_LimitStrength` E = 1 910 at `st=0.5`. That is E + 164 ≈ **2 074 on
  "Stockfish 19's `UCI_Elo` scale at R's pins on this host"** (`EPIC-008` § The two readings). Base `ca6e675c` read
  78.25 %. The pair is NOT LOSS but its point estimate is −58.3 ± 77.9.
- `EPIC-008`'s close R fell −82.9 ± 73.8 (`bapm-close-EPIC-008`). **Two consecutive outside readings after value
  changes have negative point estimates.** No reading isolates the cause (`UNKNOWN - verify`). One untested hypothesis
  is `ABC-215`'s rule-derived values, which replaced Michniewski's tables (D NEUTRAL +15.6 ± 23.8 in self-play).
- **The "8× time odds" is nominal.** With `UCI_LimitStrength`, Stockfish 19 picks its move once, at depth 1 + level,
  and keeps it (`ABC-204` § The pins, `search.cpp:557-559`, `625-628`, `search.h:247-268` at `sf_19`). Its strength is
  pinned by depth, not time. 0.5 s matters only as headroom for that depth.
- **The scale's calibration** (`ABC-204`): Stockfish's README says *"calibrated at a time control of 120s+1.0s and
  anchored to +- 100 Elo to CCRL Blitz"*; `search.h` says *"Skill 0 .. 19 now covers CCRL Blitz Elo from 1320 to
  3190, approximately"*. R's control is not 120 + 1, so R is not CCRL.

### Inventory of `src/` at `bae25131`: search

Two recursions hold one algorithm: `src/search.ts` (`search` plus 11 test-only doors) and the shipped, abortable copy
in `src/engine.ts` (`chooseMove` plus 5 doors), held together by the `ABC-078` identity sweep.

| technique | present? | parameters and form | cite |
|---|---|---|---|
| Negamax alpha-beta | yes | fail-soft; score for the side to move | `search.ts:428-552`, `engine.ts:375-468` |
| Iterative deepening | yes | depth 1 unabortable; clock read every 1 024 nodes; an aborted iteration is discarded whole; the root move list is generated once | `engine.ts:170`, `:302-312`, `:698-760` |
| Time use | basic | `level`: a fixed budget a move (level 5 = 4 000 ms, `levels.ts:55-61`); clock share `time / movestogo + inc / 2`; `uci-clock-mode` `safeClockShare`. **No soft/hard limit, no "will the next iteration finish" test, no use of a partial iteration** | `uci-session.ts:216-217`, `:295-320`; `engine.ts:733-751` |
| PVS | yes | null window for every move after the first; full re-search on a fail-high inside the window | `search.ts:570-648`, `engine.ts:477-501` |
| Aspiration windows | **no** | full window every iteration ("aspiration windows … none requested") | `engine.ts:96-98`, `:538` |
| LMR | yes, minimal | **1 ply, flat**, at index ≥ 3, remaining depth ≥ 3, not root, not capture/promotion, not in check, not giving check; reduced fail-high re-searched at full depth | `search.ts:307-336` |
| Null move | yes | **R = 3 fixed**; off at root, after a null move, depth < 2, in check, and with < 3 non-pawn pieces; returns beta; null-window nodes only; no verification search | `search.ts:338-374`, `engine.ts:405-429` |
| Futility, reverse futility, razoring, late-move pruning | **no** | — | (absent in `search.ts`, `engine.ts`) |
| Check extension | **no** | `ADR-0051` accepted, not in force: `ABC-210` closed unmerged | `ADR-0051` § Status |
| Singular extension, IID/IIR, mate-distance pruning | **no** | — | — |
| Quiescence | yes | captures (MVV-LVA, insertion sort); in check: every legal move, none = mate (`ABC-228`); quiet queen promotions (`ABC-229`); stand pat out of check; cap 8 plies; no TT in quiescence | `quiescence.ts:132`, `:169-221` |
| Delta pruning, SEE, quiet checks in quiescence | **no** | "a recorded decision rather than an omission" | `quiescence.ts:40-44`; `ADR-0024` d4 |
| Move ordering | yes | hash move (3 000 000) > captures and promotions by `mvvLvaKey` (victim + promotion − attacker/1000) > 2 killers per ply (quiet only, kept across iterations of one move) > generation order | `search.ts:163-243`; `quiescence.ts:75-89` |
| History / countermove / continuation history | **no** | — (`ABC-233` Backlog) | — |
| SEE for ordering | **no** | — (`ABC-234` Backlog, fenced; `ADR-0065`: premise not met, 2026-11-03) | — |
| Transposition table | yes | 2^18 slots × 16 B = **4 MiB**; full 64-bit key verified; **cleared at every `chooseMove`**; **always replace**; **cutoff only at exactly the stored depth** (`entryDepth(slot) !== depth`); mate scores ply-adjusted; hash move matched against the legal list | `transposition.ts:17-33`, `:42-45`, `:79-87`, `:156-170` (`:163`) |
| Repetition | yes | in-tree: one earlier occurrence on the path = 0; before the root: two earlier occurrences (`ABC-230`, `ADR-0054`); window ≤ 100 plies | `search.ts:146-153`; `engine.ts:228`, `:350-362`, `:388-394` |
| 50/75-move, dead position at the leaf | yes | `leafEndReason`: no legal move, insufficient material, 75-move | `gameend.ts:206-211` |
| Move generation and legality | 0x88; one heap object per move; make/test/unmake of every pseudo-legal move; captures-only generator for quiescence; `givesCheck` without a move played | `legal.ts:69-83`, `:116`, `:194`; `ADR-0003` |
| Opening book | yes | Zobrist-keyed JSON (`ADR-0037`) | `book.ts`, `book-engine.ts` |
| Threads, pondering | no | single-threaded by decision | `EPIC-010` § Out of scope |

### Inventory: evaluation (`src/evaluate.ts`)

One pass over the board; score for the side to move. **Nothing is tapered.**

| term | present? | values | cite |
|---|---|---|---|
| Material | yes | P 100, N 325, B 325, R 500, Q 900 | `:46-54` |
| Piece-square tables | yes, one per piece, **untapered** | rule-derived (`ABC-215`): pawn `2e(R−2)`; knight `10n−50`; bishop `10·ring−10`; rook +20 on the 7th only; queen `5·ring−5`; king prefers b1/g1 in **every** phase | `:66-148` |
| Pawn structure | yes | doubled −15, isolated −10; memoised by pawn masks (2^14 slots) | `:188-189`, `:333-436` |
| Passed pawns | yes, rank only | 0, 5, 10, 20, 35, 60, 100 | `:190`, `:199-214` |
| King safety | pawn shelter only | per file around the king: no shelter pawn −15, half-open −10, open −20. **No attacker count, no king zone** | `:222-224`, `:282-313` |
| Mobility | yes, crude | 4 cp per reachable square, all pieces alike, total clamped to ±100 | `:232-233`, `:244-275`, `:527` |
| Bishop pair, rook on (semi-)open file, outposts, threats, hanging pieces, space, tempo, backward/connected pawns, passer king distance, endgame scaling (opposite bishops, drawish material), mop-up | **no** | — | — |
| Incremental evaluation | no | full recompute per call | `:482-536` |

### What was tried before (from the records)

| ticket | what | outcome | what the records say it is worth |
|---|---|---|---|
| `ABC-075`…`ABC-087` (`EPIC-004`) | Zobrist, eval, negamax, ID, quiescence, ordering, TT, pawn terms, king safety + mobility, puzzles, ladder, levels | Done | the engine's base |
| `ABC-121` | PVS + LMR | Done | `ADR-0026`; graded on work and a drift oracle |
| `ABC-205` | king-safety term while queens are on + tapered king table | **dropped** 2026-10-25: `G6` "≥ base" missed on `position-6` (median depth 7 vs 8); D never run | cost, not play: the forms sit on `grugops/ABC-205-final` `b5d5cea5` |
| `ABC-206` | value-identical speed-up | Done | D waived |
| `ABC-207` | mobility weighted per piece, early-queen term | **dropped**: D LOSS −18.3 ± 16.5 (800 games) | hand weights lost |
| `ABC-208` | null move R = 3 | Done: D GAIN +38.4 ± 23.3 | the one value change with a measured self-play gain |
| `ABC-209` | TT kept across the moves of a game | **dropped**: D NEUTRAL +8.7 ± 18.3; code on `grugops/ABC-209` `bb6cf451`; `ADR-0025` d4 amendment accepted, not in force | read **under exact-depth cutoffs** (see D3, row T3) |
| `ABC-210` | check extension at the horizon, form (a) | **dropped**: D NEUTRAL −4.8 ± 16.2; `ADR-0051` not in force | the horizon case is now covered by `ABC-228` |
| `ABC-211` | deeper English book | dropped (owner O0) | — |
| `ABC-215` | own, rule-derived eval values | Done: D NEUTRAL +15.6 ± 23.8 | EPIC-008's R fell −82.9 ± 73.8 over the epic; share unknown |
| `ABC-228`, `229`, `230`, `241`, `242` | quiescence evasions, quiet promotions, game history in search, ep key, blunder-path repetition | Done (milestone 1); smokes passed | milestone 1 batch −58.3 ± 77.9 (NOT LOSS) |
| `ABC-227`, `235`, `240` | profile, value-identical cuts | Done: 1.20–1.28× and 1.09–1.12× | S2 |

**EPIC-010's Backlog (milestones 2 and 3), all still standing, all DoR 8–9/10, none started:**

| ticket | covers | waits on | still stands? |
|---|---|---|---|
| `ABC-231` | king table tapered by phase, alone | `ADR-0031` addendum ruling | yes, but it is a subset of a full taper (D3, E1) |
| `ABC-232` | passed pawns by phase | `ABC-231` | yes; subset of E1 |
| `ABC-233` | history heuristic after killers, cleared per search | ADR (`ADR-0026` d10) | yes |
| `ABC-234` | SEE for full-width capture ordering only | `ADR-0065`: premise not met; parked (2026-11-03) | yes; SEE pruning is fenced out of `EPIC-010` |
| `ABC-236` | root aspiration windows from depth 5 | `ADR-0066`: premise not met; parked (2026-11-03) | yes |
| `ABC-237` | depth-preferred TT replacement | `ADR-0025` amendment | yes |
| `ABC-238` | deeper stored entry may cut a shallower search | ADR revising `ABC-081` `A1`; after `ABC-237` | yes; **the cheapest real gap in the search** |
| `ABC-239` | offline eval tuning, constants only, outside validation | milestone 2's eval, data licence (`ADR-0048`), method ADR | yes; the largest single eval lever |

Every one of these is a real gap, and none is done. Every one is gated on `G6` "≥ base" (floor 6), and each is graded
on the smoke pair, which "cannot see a loss of tens of Elo" (`EPIC-010` § What 10 games can and cannot see).

### The measurement problem, stated once

- A classical engine climbs by many changes of +5 to +40 Elo each. Every instrument on record resolves far coarser:
  the smoke pair sees ≈ 250 Elo collapses; the 200 + 200 R pair resolves ± 77.9 (`…1a53a7f9`); the 800-game D reading
  resolved ± 16–23 and cost ≈ 34 h at 23.3 games/h.
- Two negative outside point estimates in a row, with no instrument able to say which change caused them, are what
  that looks like in practice.
- The engines that reached 2 700–3 400 classically were developed with sequential tests (SPRT) over thousands of fast
  games per change (Blunder's changelog quotes self-play gains to ± 16–38 per version; Texel's tuning gains were each
  read on 32 000 games at 1 s + 0.08 s).

## Decision

**PROPOSED, decides nothing.** D1–D4 are analysis. D5–D6 are the proposal the owner may accept, change or refuse.

### D1. What skytalix has, in one paragraph

A correct, conservative 2010-era search core (PVS, ID, 1-ply LMR, R = 3 null move, killers, MVV-LVA, a small
exact-depth TT, a sound quiescence with evasions) over an untapered, untuned, rule-derived evaluation (material, one
PST per piece, three pawn terms, a pawn-shelter king term, a capped mobility count), on a 0x88 object-move board at
0.63–0.90 M nodes/s (`qe-ABC-240`). It reads ≈ 2 074 on R's scale.

### D2. What it lacks, by area (the gap list toward 3 000)

**How to read the Elo column.** Each figure is an **estimate** of the self-play gain at about this engine's strength
and 4 s a move, informal and low confidence. Outside (R) gains are expected smaller (`RISK-EPIC008-03`). Gains do not
add: they overlap, and each later one is worth less. The basis column names the source.

Bases: **[B]** Blunder's changelog (a Go HCE engine from 2 038 CCRL at v5 to ≈ 2 700 at v8.5.5; self-play gains per
version, often bundled); **[T]** Texel's tuning record on CPW (+99.6 in seven steps on an already hand-tuned engine,
32 000 games each); **[t]** tomitankChess 4.0 (pure JavaScript, before its NN in 5.0) at 2 820 ± 27 CCRL 40/15
(2020-05-02), with "see pruning", "better lmr"; **[D]** `ADR-0055`'s 50–100 Elo per speed doubling; **[R]** this
repo's own readings; **[J]** Architect judgement from common practice (lowest confidence).

| id | gap | est. Elo | basis | cost | risk | depends on | ticket |
|---|---|---|---|---|---|---|---|
| **M0** | **SPRT self-play lane** (short control, sequential test, thousands of games) | enabler, 0 | [B], [T] method | M (`tools/`) | low code; host time high | owner: width, rule (D7) | **none — new ticket** |
| T1 | TT cutoff at stored depth ≥ requested | +15–40 | [J] | M | medium (revises `ABC-081` `A1`) | `ADR` | `ABC-238` |
| T2 | depth-preferred replacement (or two-slot bucket) | +5–15 | [B] 8.0 buckets; [J] | S | low | T1 order free | `ABC-237` |
| T3 | TT kept across moves, re-tried **after T1** (its NEUTRAL was read under exact-depth cutoffs, where a kept entry almost never cuts) | +10–30 after T1 | [R] `ABC-209` +8.7 ± 18.3; [J] | S (code exists, `bb6cf451`) | low | T1, T2; scope (fenced) | `ABC-209` re-cut (owner: scope) |
| T4 | larger TT (16–64 MiB) | +5–15 at 4 s | [J] | XS | low | `NFR-009` (16 MiB now; owner pre-offered 128 MiB, 2026-09-25) | none — new ticket |
| P1 | LMR by a log table of depth × move index, history-adjusted | +40–100 | [B] 7.1 (LMR + futility + SEE +115.6 ± 25.1), 7.3; [t] | S–M | medium | ordering helps | **none — new ticket** |
| P2 | reverse futility (static null move) | +30–60 | [B] 6.0 (RFP + history +80–100) | S | low–medium | eval scale | **none — new ticket** |
| P3 | futility pruning near the leaves | +15–40 | [B] 7.1 | S | medium | P2 | **none — new ticket** |
| P4 | late-move (move-count) pruning | +20–40 | [B] 7.5 (≈ +30) | S | medium | P1 | `ABC-286` (`EPIC-011`): `ADR-0072` ACCEPTED over a missed premise (2026-11-04, `…3e73f9f9`), form M3, in bundle 1; not in force |
| P5 | null move: R grows with depth (and eval margin) | +10–30 | [B] 7.3; [J] | S | low (`ADR-0050` amend) | — | none — new ticket |
| P6 | razoring | +5–15 | [B] 8.0 | S | medium | P2 | none — new ticket |
| O1h | history heuristic (+ malus) | +20–50 | [B] 6.0, 7.6 | M | low | — | `ABC-233` |
| O2c | countermove / continuation history | +10–30 | [J] | M | low | O1h | `ABC-288` (`EPIC-011`): `ADR-0073` ACCEPTED over a missed premise (2026-11-04, `…3e73f9f9`), form C1, the countermove alone, in bundle 1; not in force. Continuation history is rejected |
| O3s | SEE for capture ordering | +10–30 | [B] 7.1; [J] | M | low | — | `ABC-234`: `ADR-0065` PROPOSED, premise not met on `main` (2026-11-03; S1m `chooseMove` d8 0.986 / 0.955); A0 ruled: d4 fences Q1, not O3s; parked |
| Q1 | SEE pruning of losing captures (quiescence and main) | +20–50 | [t] "see pruning"; [J]; diagnostic +0.88 ply reach, d8 0.22–0.68× (`arch-ABC-234`, not pre-registered) | S–M, carrying `see` (`ADR-0065` decision 2) | medium | `ADR-0024` d4 (owner `Q-3K-9`, pending) | none (fenced out of `EPIC-010`) |
| Q2 | delta pruning in quiescence | +5–20 | pre-registered: D200b +0.279 ply, d8 0.64–0.83× (`arch-ABC-289`, PREREG `…174760a3`); `ADR-0024`'s 1.5× trim predates futility, the taper and Q1 | S | low | `ADR-0024` d4 opened for design by `Q-3K-10` yes (`…7de79e90`) | `ABC-289` (`EPIC-011`): `ADR-0074` ACCEPTED (2026-11-04, `…3e73f9f9`), premise met on `main`; not in force until `ABC-289` merges on its own read |
| S1 | aspiration windows | +10–30 | [J] | M | low | T1 | `ABC-236`: `ADR-0066` PROPOSED, premise not met on `main` (2026-11-03; A100 d8 0.9836 / 0.9913); fires at 100 ms; parked |
| X1 | check extension at every depth (not `ABC-210`'s horizon form) | +10–30 | [J]; [R] `ABC-210` −4.8 ± 16.2 (other form) | S | medium | — | `ABC-210` re-cut, other form (owner: scope) |
| X2 | singular extension (+ IIR) | +20–50 | [B] 8.0, 8.5.5 | M | high | T1 | none — new ticket |
| W1 | time use: no doomed iteration started; keep a partial iteration's root move when it beat the incumbent; soft/hard limits under a clock | +10–40 | [B] 7.4 time management; [J] | S–M | low | — | `ABC-282`: `ADR-0071` PROPOSED (2026-11-04, `arch-ABC-282`): `uci-clock-mode` under a clock only; soft limit = budget ÷ 2.3 (measured), the budget the hard limit; read 100 games at `tc=40/8` after a harness ticket |
| V1 | O1-a/b/c speed (1.08–1.35×) | +5–45 | [D], `ADR-0055` | 3–5 tickets | low | — | being cut now (`bapm-goal3000-o1-cut`) |
| V2 | O1-d lazy legality (1.25–1.85× with O1) | +15–90 total | [D] | M | medium | `ADR-0003` amend (owner) | O1-d (Backlog) |
| V3 | staged move generation (hash move before generating; captures before quiets) | +10–30 | [J] | M | medium | V1, V2 | none — new ticket |
| V4 | bitboards (re-open `ADR-0001`) | +50–150 (2–3× node rate, `UNKNOWN - verify`) | [D]; [J] | XL | high | everything | none (owner: architecture) |
| E1 | **full taper**: every PST and material term in middlegame and endgame halves, blended by phase | +40–120 | [B] 3.0 (taper + killers + perft TT ≈ +207), 5.0; [J] | M | low | — | `ABC-231` + `ABC-232` are subsets |
| E2 | **offline tuning** of all weights (Texel / logistic fit) | +100–250 here (rule-derived start) | [T] +99.6 on an already-tuned engine; [B] 7.0, 7.3 | L | medium (data, overfit) | E1; data licence (`ADR-0048`); M0 helps (games = data) | `ABC-239` |
| E3 | king attack: attackers on the king zone, weighted, tapered | +40–100 | [B] 7.3, 7.4; [R] `ABC-205` died on `G6` | M | medium | E2 | none (`ABC-205` dropped) |
| E4 | pawn and passer terms: backward, connected/phalanx, passer king distance, free path, unstoppable | +20–60 | [B] 7.3, 7.4 | M | low | E1, E2 | `ABC-232` (part) |
| E5 | piece terms: bishop pair, rook on open/semi-open file, outposts, mobility per piece (tuned) | +30–80 | [B] 7.4, 8.0; [R] `ABC-207` hand weights lost | M | low | E2 | none (`ABC-207` dropped) |
| E6 | threats (pawn attacks on pieces, hanging pieces), tempo | +20–50 | [J] | M | low | E2 | none — new ticket |
| E7 | endgame scaling and knowledge (opposite bishops, drawish material, mop-up) | +10–30 | [B] 6.1, 8.0 | M | low | E1 | none — new ticket |

**Top gaps by expected Elo per cost** (estimates): P2 reverse futility, P1 log LMR, P4 move-count pruning and T1
deeper cutoffs (each S–M, each +15–100); then E1 + E2, the taper and the tuner (M + L, together +140–370, the
largest block); then O1h history, T2/T3/T4 (S, cheap once T1 is in), Q1 SEE pruning, S1 aspiration; then the eval
terms E3–E7, each best added under the tuner; then X2 singular extensions and V3/V4 speed.

*Dated 2026-11-02 (`arch-ABC-264`, records only, at `main` `ecc0331f`): two corrections to this table.*
- **Row T3's rationale is wrong.** "A kept entry almost never cuts" under exact-depth cutoffs is false: measured with
  the table kept across a short game's searches, entries from earlier moves supplied **17–23 % of exact cuts**
  (kiwipete 38 081 of 227 253; position-6 35 051 of 151 274; `arch-phase1-replan` `…5ea73b5c`). T3 alone still read
  only 0.975× pooled at depth 8, so `ABC-209`'s NEUTRAL is not explained by "never cuts". The row's estimate and its
  dependency on T1 are not re-derived here; T1 + T3 is the paused combined attempt (`ABC-257`, bar pre-registered in
  `…64e95bfa`).
- **Row P2 has a ticket and an ADR:** `ABC-264`, `ADR-0059` (PROPOSED). Its premise is measured: at fixed depth 8 the
  rule needs 0.59–0.64× the door's nodes on kiwipete and position-6 in both recursions (`ADR-0059` § Context). The
  Elo column stays an estimate until C2′ reads it.

*Dated 2026-11-02 (`arch-phase2-p1`, records only, probe on `grugops/ABC-264-fix` `4d1c0616`): row P1.*
- **Row P1 has an ADR: `ADR-0060` (PROPOSED).** The rule: ⌊1.0 + ln d × ln m / 2.0⌋, one ply less at a PV node,
  capped at two plies, child depth ≥ 1, behind an off-door pair. Measured at depth 8: 0.68–0.80× the door's nodes in
  both recursions, and +0.305 ply at the 100 ms node budget (47 000 nodes).
- **"History-adjusted" is not buildable yet.** There is no history table; that is O1h (`ABC-233`). P1 ships the log
  table without it, and the history term is O1h's (`ADR-0060` decision 11). The row's +40–100 assumed the history
  term; the history-free, capped form is expected nearer the low end (estimate).
- **P1 stays next after P2.** At depth 8, on the same instrument, P3 futility read 0.88–0.91× and P5 depth-grown R
  0.83–0.99×, against P1's 0.68–0.80×. The order P2 → P1 → P4 → P3 → P5 → P6 is unchanged.

*Dated 2026-11-02 (`arch-phase2-rebase`, records only; probes on scratch copies of `main` and `4d1c0616`): rows P2 and P1.*
- **Row P2: dropped.** `ABC-264` read 44.0 / 100 (−41.9 ± 58.5), NOT MET, and was not merged. `ADR-0059` is
  accepted, not in force.
  - The read contradicts the row's +30–60 at about 99 %. The rule bought +0.70 ply at the 100 ms node budget and
    still lost, so the cost is on the value side.
  - No retry on today's `main`. A re-cut needs a new premise: E1 / E2, O1h, a 500 ms read, or a changed form.
    `ADR-0059` § Status gives the ruling, its reasons and the re-cut's bars.
  - Code on `grugops/ABC-264-fix` `4d1c0616`.
- **Row P1: `ADR-0060` re-opened.** Re-measured on `main`, its rule misses two of its own bars:
  - `A3`'s 27 cp drift cap (63 cp in `search()`);
  - `A4` (a) on `chooseMove` position-6 (0.8699 against 0.85).
  - F1 applies, and the build does not start on that text (`ADR-0060` § Status).
- **The order is now P1 (re-opened) → P4 → P3 → P5 → P6.** P4 still depends on P1. Whether P3 goes ahead of the
  re-opened P1 is the Orchestrator's call: P3's untuned form read 0.88–0.91× on the `4d1c0616` base, and it is not
  re-read on `main`.

*Dated 2026-11-02 (`arch-phase2-p3`, records only; probe on a scratch copy of `main`'s `src/` `f2388e40`): rows P3, P4, P5 and P6.*
- **Measured on `main`, each item alone.** Figures are depth-8 nodes against the door (`search()` / `chooseMove`,
  kiwipete and position-6) and the gain in reach at 47 000 nodes on the 190. The full table, with drift, mate,
  zugzwang and the cut audit, is in `ADR-0061` § Context.
  - **P3:** 0.79–0.83× and +0.279 ply. Clean on every row: audit 0 of 2 943 flips.
  - **P4:** 0.64–0.97× and +0.34 to +0.50 ply. But drift is 87.7 % within 25 cp, the audit shows 11.5 % flips with
    piece-sized errors, and the depth-1 form costs nodes on position-6.
  - **P5:** 0.88–0.95× and +0.06 ply. Clean, but depth-gated.
  - **P6:** 0.79–0.83× and +0.305 ply. But it loses `zugzwang.004`, drifts up to 345 cp, and shows 1.98 % audit
    flips.
- **Row P3 has an ADR: `ADR-0061` (PROPOSED).** Margins are 150 / 350 / 550 cp at remaining depth 1 / 2 / 3, so every
  margin from depth 2 up is above a minor piece. It sits behind an off-door pair, with intent GAIN. Its "depends on
  P2" was sequencing, not mechanism: it was measured without P2, and it needs neither P1 nor P2.
- **Row P4's real dependency is a quiet-move order (O1h, `ABC-233`),** more than P1. Without history it prunes
  generation-order quiet moves (the measurement above).
- **Row P5:** a NEUTRAL (invisible at 100 ms) candidate with a deep-depth bar, as C2′'s depth-gated rule names it.
- **Row P6:** rejected on today's evaluation.
- **The suggested order** (the Orchestrator's call): P3 (`ADR-0061`) now, independent of the P1 re-open → P1 if the
  owner's cap answer re-opens it green → P5 (NEUTRAL) → P4 after O1h → P6 not before E1 / E2.

*Dated 2026-11-02 (`arch-post-268`; written by `arch-E1`, the line `arch-post-268` named as owed): row P1, parked after P3.*
- **Row P1: parked after P3.** `ADR-0060` decision 1 was re-measured on `main` `e72487e1`, with futility (P3,
  `ADR-0061`) in force. It misses three bars: `A4` (a) on `chooseMove` position-6 (0.8528 against 0.85), `A3`'s 27 cp
  cap (63 cp, position-6/g5h6) and zugzwang 7 / 7 (`zugzwang.004` g7f6 at d11). `ADR-0060` § Status (dated
  `arch-post-268`) has the readings. The owner's cap question is moot.
- The joint O1h + P1 probe (`arch-next-pull`, the block below) did not re-open it. P1 re-opens only on a new named
  premise with a new pre-registered probe, for example an evaluation change that changes the tree (E1 / E2).

*Dated 2026-11-02 (`arch-ABC-233`, records only; probe on a scratch copy of `main`'s `src/` `58fa3eb4`, futility in force): row O1h.*
- **Row O1h has an ADR: `ADR-0063` (PROPOSED, premise not met on `main`).** Measured at depth 8, the history table
  reads 0.78–1.00× in `search()` and 0.97–1.00× in `chooseMove`, with +0.08 to +0.11 ply at 47 000 nodes. Every
  form misses the pre-registered pay gate (≤ 0.95× on all four readings). It is safe on every row.
- **Why the pay is small here:** the hash move and the two killers already take most cutoffs. 82 % of cutoffs fall
  on the first move, and the killers hold 90 % of quiet cutoffs. History re-orders what is left. The row's +20–50
  is not supported as a standalone change on this search (estimate; `ADR-0063` § Context).
- **As an enabler, the evidence is mixed.** Over the history table, `ADR-0060` decision 1 meets `A4` (a), reach and
  the 27 cp cap, which it misses on `main`. But it loses two zugzwang rows instead of one. That is a diagnostic, not
  pre-registered (`ADR-0063` § Context). P4 over history is not measured.

*Dated 2026-11-02 (`arch-next-pull`, records only; probes on a scratch copy of `main`'s `src/` `58fa3eb4`): rows P1 / O1h, and the ranking.*
- **The joint O1h + P1 probe failed.** It was the H1 table plus decision 1 plus four pre-registered history terms,
  with zugzwang as the hard gate.
  - Every form loses `zugzwang.004` and drifts 69 cp in `chooseMove`.
  - P1 and O1h stay parked (`ADR-0060` and `ADR-0063` § Status, dated lines).
- **The evaluation-lever probe** (information, pre-registered in `…4de572aa`):
  - The sample: 145 positions from 50 self-play games at 0.1 s, labelled by Stockfish 19 at depth 16.
  - Skytalix makes 48 errors of 50 cp or more at 47 000 nodes, 37 at 94 000 and 34 at 188 000.
  - **31 of the 48 (65 %) persist through two node doublings**, and 11 of 13 persist after 60 plies.
  - By the pre-registered rule, **evaluation is now the bigger lever**. The open pruning and ordering items each buy
    well under one doubling.
- **The "top gaps" order above is revised by evidence** (estimates, Architect; the Orchestrator's call):
  1. **E1 next**, with `ABC-231` and `ABC-232` folded in;
  2. then E2 (`ABC-239`);
  3. then P5 (NEUTRAL), O3s (`ABC-234`) and S1 (`ABC-236`), each estimated 0–15 Elo here.
  - D6 allows this reorder by evidence. The owner is told, not asked.
  - `Q-3K-4` (`G6` "≥ base") is now live for E1 and should be put to him (decision `arch-next-pull` § 3).

*Dated 2026-11-02 (`arch-E1`, records only; probe on a scratch copy of `main`'s `src/` `58fa3eb4`): row E1.*
- **Row E1 has an ADR: `ADR-0064` (PROPOSED).** One phase (N 1, B 1, R 2, Q 4, out of 24, linear). Every term is a
  middlegame / endgame pair in one data-only parameter table, `src/evaluate-params.ts` (E2's seam). At E1 only the
  king (40 − 15 m, `ABC-231`) and the passers (2 × by rank, `ABC-232`) get endgame halves. It sits behind a test-only
  off-door pair, with intent GAIN.
- **Measured** (node counts; no timing):
  - E1 is identical to `main` at phase 24;
  - `chooseMove` trees on the `G6` boards: 0.96–1.035 × at d8–d10;
  - per-node work: about 30 operations a call, estimated at 1–2 % of node time (`UNKNOWN - verify`, `G2` reads it);
  - mate floor 0, zugzwang 7 / 7, `G1` 54 / 58.
- **Designed for both `Q-3K-4` answers** (`ADR-0064` decision 8 B7). The plateau form read better on the evaluation
  instrument (information only) and is left to E2's tuner.

*Dated 2026-11-03 (`arch-ABC-269-rule`, records only; owner `…cc7db847`): rows E1 and E3.*
- **Row E1: `ADR-0064` ACCEPTED** 2026-11-02 ("64 yes"). It is not in force until `ABC-269` merges.
  - Its `G6` row (B7) is graded under `Q-3K-4` = (b): every run at depth ≥ 6, "≥ base" reported.
  - QE's pre-build gap `QE-269-a` is ruled (a): the claim is narrowed, and no bar moves. B1 (d)'s ≥ 20 cp covers a
    corner king not behind both of its shelter pawns. On the castled corner E1 forecasts +13 to +23, because
    `kingExposure` stays untapered at E1 (`ADR-0064` § Decision log).
- **Row E3 inherits that residual.** Shelter and file terms by phase are king safety. QE's three castled-corner
  endings (`TAPER_KP_SHELTER_STRESS` S1–S3, frozen on `grugops/ABC-269` `d6a57653`) are offered as E3's first graded
  rows, at ≥ 20 cp. Row E3's "`ABC-205` died on `G6`" no longer gates it the same way: under `Q-3K-4` = (b), E3 is
  judged on play.

*Dated 2026-11-03 (`arch-adr0056-fold-1103`, records only, at `main` `af15cbc9`; the lines owed by `arch-ABC-234` `…a4ed96aa` § 5): rows O3s and Q1, and the ranking.*
- **Row O3s: parked** (the Orchestrator, 2026-11-03, `…24990015` ruling 1). `ADR-0065` is PROPOSED, premise not met
  on `main`: every form is safe and misses the ≤ 0.95× pay gate; the closest, S1m, reads 0.9864 / 0.9548 in
  `chooseMove` at depth 8. It fires at 100 ms, so a re-open is GAIN. A0 is ruled: `ADR-0024` d4 fences Q1 (SEE
  pruning in quiescence), not O3s. It re-opens on Q1 built first, on staged generation (V3), or on a time-per-move
  instrument (`ADR-0065` § Status).
- **Row Q1 is where the SEE lever is on this engine** (a diagnostic, not pre-registered): +0.88 ply of reach at
  47 000 nodes and d8 nodes 0.22–0.68×, with mate floor 0, zugzwang 7 / 7 and `G1` 54 / 58. That is the largest
  single lever any `EPIC-011` probe has read (P1 +0.38, O1h +0.09, O3s +0.07). Q1 carries `see` itself, so its
  "after O3s" no longer holds (the row above is amended). It needs its own PREREG and ADR, and `ADR-0024` d4 opened
  by evidence or by the owner's word: **`Q-3K-9`, asked 2026-11-03, unanswered.** Until he answers, d4 stays closed
  and Q1 stays fenced.
- **The ranking (`arch-next-pull` item 3) as it now stands:** O3s is parked; S1 is parked (the line below). The
  Orchestrator's recommended slot for Q1, if `Q-3K-9` opens d4, is after `ABC-236`'s design and before `ABC-239`
  (`…24990015` ruling 3). This line does not change the order.

*Dated 2026-11-03 (`arch-adr0056-fold-1103`, records only, at `main` `af15cbc9`; the lines owed by `arch-ABC-236` `…0886976b` § 7): row S1.*
- **Row S1: parked** (the Orchestrator, 2026-11-03, this fold's brief). `ADR-0066` is PROPOSED, premise not met on
  `main`: every form is safe and misses the ≤ 0.95× `chooseMove` pay gate at depth 8; the design of record, A100,
  reads 0.9836 / 0.9913 (kiwipete / position-6). The root already runs PVS, so a window can narrow only the first
  move's subtree; the ceiling is about 2 % (`ADR-0066` § Status).
- **S1 is not depth-gated.** At 47 000 nodes, 70.4 % of all nodes are spent inside aspiration passes, on 186 of 190
  rows (51.3 % at 20 000). C2′'s depth-gated list and its "C yes" examples are corrected below. A re-open's intent is
  GAIN.
- **It re-opens on T1 landing** (bound-aware cutoffs, `ABC-257`), which the row's "depends on T1" names, **or on a
  deeper shipped search** (a read over 1 h is the owner's). E1 is not a re-open condition.

*Dated 2026-11-03 (`arch-fold-1103b`, records only, at `main` `239ac715`): rows E2 and E3.*
- **Row E2 has an ADR: `ADR-0067` (PROPOSED; acceptance is the owner's, pending).** It sets a logistic fit of game
  results, with cross-entropy as the loss, K fixed first, and Newton steps on a traced model behind an identity gate.
  At the first pull material is frozen and the free set is sign-bounded. The tool writes only `src/evaluate-params.ts`.
  - **Prototype** (own games, 254 485 rows): 0.9863 × E1's outer-validation cross-entropy unconstrained. The fitted
    material is not safe to play (queen 2 593 / 137). Bounded, the gain is about 0.4 % of loss.
  - **The row's "+100–250" stays an estimate,** and on own games alone it is likely too high. `ADR-0067`
    § Consequences gives the discount. The data question is Q-3K-7 (D7's dated line).
  - **A value-identical step comes first:** `ABC-274` (E2-pre), the blend of every half (`ADR-0067` d8, F8).
- **Row E3, supporting information only, not a bar:** in every fit the king's square tables come out about 3–3.6 ×
  (mg) and 2.2–2.8 × (eg) heavier than E1's rule tables. That is, E1's hand tables weight the king about 3 × too
  lightly (`ADR-0067` § Context, reading 4; the Orchestrator's correction `…690d3b30` item 2).

*Dated 2026-11-03 (`arch-owner-answers-1103`, records only, at `main` `dc7dc15d`; his word `…af126c04`): rows E2 and
Q1.*
- **Row E2: `ADR-0067` is ACCEPTED** ("1. yes") and in force as the method. **E2-pre is done:** `ABC-274` merged at
  `2410d4f7` on QE's PASS_WITH_GAPS (`…fa87f74d`). `ABC-239` is next.
  - Its data is own games plus one Lichess CC0 monthly export (`2017-03`, at most 1 M positions, own games carrying
    0.5 of the loss and serving as the only validation). The pin is `ADR-0067` § Addendum 2026-11-03.
  - The row's "+100–250" stays an estimate. With broader data the bounded first pull may move more than own games'
    0.4 %. Nobody has read it yet.
- **Row Q1: `ADR-0024` d4 is open for design** (`Q-3K-9` answered yes, "6. yes"). The row's "`ADR-0024` d4 (owner
  `Q-3K-9`, pending)" now reads "open for design (`…af126c04`)".
  - **Design only.** A build ships on its own evidence: the per-change rule, 100 games at 100 ms (C2′), with S′ and
    the Levels lane beside it (R-TC).
  - It needs its own PREREG and ADR, as the 2026-11-03 line above says. The design task is the Orchestrator's
    `arch-Q1-see-pruning`.
  - The slot the Orchestrator recommended ("after `ABC-236`'s design and before `ABC-239`") is now the Orchestrator's to apply.
    This line does not set the order.

*Dated 2026-11-03 (`arch-owner-answers-1103b`, records only, at `main` `0bf243df`; his word `…401c3d09`, verbatim
"yes, accept ADR-0068 and ADR-0069"): rows E3 and Q1.*
- **Row E3: E3a is `ADR-0068`, ACCEPTED** (not in force until `ABC-270` merges).
  - `ABC-270` lands as structure only: three queen-on exposure pairs at 0, value-identical and node-identical to
    `main` (K0–K4). It is size S and plays no games. Its S2 nps is reported only (the Orchestrator, `…401c3d09`).
  - `ABC-239`'s first pull fits the pairs (mg free and ≥ 0, eg held at 0; `ADR-0067` d6's dated line). One read covers
    both: `ABC-239`'s B-T7 / B-T8.
  - The `ADR-0031` A1 rule values are not shipped: they fail the mate floor at d5 against d5. The shelter gate is out.
  - The row's "depends on E2" now reads "**structure before E2's fit; values from E2**".
- **Row Q1: `ADR-0069`, ACCEPTED, premise met** (not in force until the Q1 ticket merges on its own read).
  - **Dependency:** "`ADR-0024` d4 (owner `Q-3K-9`, pending)" now reads "`ADR-0024` d4 opened by `Q-3K-9` yes
    (`…af126c04`) and amended by `ADR-0069` (accepted `…401c3d09`)".
  - **Basis gains:** "pre-registered: QS +0.837 ply reach, d8 0.22–0.72× (`arch-Q1-see-pruning`)".
  - **Scope:** "quiescence only; the main-search rule was measured and not taken (QSM +0.042 ply over QS)".
  - It is **the largest lever any `EPIC-011` probe has read, now pre-registered** (P1 +0.38, O1h +0.09, O3s +0.07,
    E1 +0.042).
  - **The slot:** Q1's build runs beside `ABC-239`'s tool build. It merges, or misses, before `ABC-239`'s candidate is
    frozen for B-T7 / B-T8, and never between that freeze and `ABC-239`'s merge.
  - It ships only on its own read: C2′ 100 games at 100 ms, GAIN ≥ 50.0, with S′ at E 1 810 and the Levels deep lane.
  - **Superseded:** the 2026-11-03 line above, "Until he answers, d4 stays closed and Q1 stays fenced". He answered
    (`…af126c04`), and he accepted the ADR (`…401c3d09`).

*Dated 2026-11-04 (`arch-ABC-271`, records only on `grugops/arch-ABC-271` from `main` `ac55ddf6`; probe on scratch
copies of `main`'s `src/` `8adb0a18`): rows E2 and E4.*
- **Row E2, status: the first pull closed NOT MET** (`ABC-239`, `…4c76bf7a`). F3 and F4 fired on the fit of record
  `26d06118` (`arch-ABC-239-f3f4` `…4eae0fd3`, `…69f22167`). `main` keeps E1's rule-made table. `ADR-0067` stays
  accepted and in force as the method. The tool exists on `grugops/ABC-239b`.
  - **E4a comes before a second pull.** F4's cause sits in the fitted endgame halves of P, R, K and PASS, and no
    feature could tell a frozen passer from a free one.
  - The second pull is a new attempt under `ADR-0067` F6 with its own PREREG, on a `main` with E4a. The margin-aware
    bound form is the owner's word then.
  - The row's "+100–250" stays an estimate. No pull has yet been read on play.
- **Row E4: E4a has an ADR, `ADR-0070` (PROPOSED; acceptance is the owner's).**
  - The terms: king distance to the queening square, a free path, and the unstoppable passer by the rule of the
    square. They are endgame halves by stated rules, computed outside the pawn memo (576 KiB), behind an off-door
    pair.
  - The probe: every play-safety row holds, the mate floor 0 / 0, zugzwang 7 / 7, `G1` 54 / 58 and `G2` 1.0269.
    E3's generated relations missed as pre-registered, explained by the other terms and by the blend's trunc; the
    relation domain is restated, and no value moved.
  - It fires on 29.75 % of the C2′ positions at ≥ 10 cp, so it is GAIN.
  - On `zugzwang.001` at depth 9 it widens the held margin from 29 to 191 cp. On the first pull's fitted table it
    turns e1e5 back to e1f1 (+150; not a fit).
  - The row's "depends on E1, E2" now reads "**E1; values by rule, read on play; E2's second pull fits king distance
    and free path after**".

*Dated 2026-11-04 (`arch-ADR-0070-accept`, records only at `main` `7a9ee712`; his word `…e8a3b5df`, "a"): row E4.*
- **`ADR-0070` is ACCEPTED in form (a), structure only** (`ADR-0068`'s form, the PREREG's choice rule 4, on the
  Orchestrator's ruling `…e0ff0aeb`). The three terms land at 0, value-identical and node-identical to `main`, with no
  switch, no doors and no games. They are computed outside the pawn memo, which grows to 576 KiB.
- The second pull fits the eg halves of king distance and free path. The unstoppable passer is held at 0: its rule
  value's pre-registered row missed (`ADR-0070` d7).
- The probe's readings (191 cp on `zugzwang.001`, the firing figure 29.75 %) were rule values, not shipped. They are a
  forecast for the second pull, not a reading of it.
- The row's dependency now reads "**E1; structure at 0; values from E2's second pull, judged in its read**".
- **Superseded:** the line above, "values by rule, read on play", and the 2026-11-04 bullet's "behind an off-door
  pair".

*Dated 2026-11-04 (`arch-owner-answers-1104`, records only at `main` `5d402485`; his word `…7de79e90`, verbatim
"Accept the W1 time-use design (ADR-0071); Q-3K-10: yes"): rows W1 and Q2.*
- **Row W1: `ADR-0071` is ACCEPTED, form (a), as written** (OQ-0071-1). It is not in force until `ABC-282` merges on
  A6. The row's ticket cell now reads "`ABC-282`: `ADR-0071` ACCEPTED (2026-11-04, `…7de79e90`)", with the rest of the
  cell unchanged.
  - The harness ticket is done: `ABC-300` merged at `4ea39135`. A6 plays its `d --tc 40/8`, so "after a harness
    ticket" now reads "on `ABC-300`'s `d --tc 40/8`".
  - `ABC-282` stays held until `ABC-283` merges or misses (the Orchestrator, `…7de79e90`; `ADR-0071` D12).
- **Row Q2: `ADR-0024` d4 is open for design** (`Q-3K-10` answered yes). The row's "depends on" cell, "—", now reads
  "`ADR-0024` d4 opened for design by `Q-3K-10` yes (`…7de79e90`)". Its ticket cell, "none (fenced out of
  `EPIC-010`)", now reads "`ABC-289` (`EPIC-011`)".
  - **Design only,** as for Q1: its own PREREG and its own ADR, which amends d4. What that ADR must show is listed in
    `ADR-0024` § Status, the fourth block. A build ships on its own read: C2′, with S′ and the Levels lane.
  - **Its premise is re-measured first,** on `main` with Q1 in it (`ABC-279`, `7b70e268`). The row's basis, "1.5× trim
    measured", predates futility, the taper and Q1. The row's +5–20 stays an estimate; after Q1 it is
    `UNKNOWN - verify`.
  - This line does not set Q2's slot. The order is the Orchestrator's.

*Dated 2026-11-04 (`arch-ABC-283-accept`, records only at `main` `715beb1c`; the owner's word `…4c4cb03d` ruling 2,
on QE's pass `qe-ABC-283` `…de1dc511`): rows O1h, O3s and S1.*
- **Rows O1h, O3s and S1: ACCEPTED as a bundle** (`ADR-0063` with K3, `ADR-0065`, `ADR-0066`). They are in force when
  `ABC-283` merges. Each ADR's pay premise was overridden by the owner, not met. The one read was the bundle's: C2′
  66.0 / 100 ≥ 50.0 (Elo +115.2 ± 67.0) at 100 ms, all three on. No reading splits it by row.
- **The ticket cells** of O1h, O3s and S1 now read "`ABC-283`: `ADR-0063` / `ADR-0065` / `ADR-0066` ACCEPTED as a
  bundle (2026-11-04, `…4c4cb03d`; QE `…de1dc511`)". The parked text in the O3s and S1 cells is superseded, and so are
  the 2026-11-03 "parked" lines above. The rows' Elo estimates stay estimates; the bundle's +115.2 is one read of
  three rows together, not a per-row figure.
- **What it unholds** (the Orchestrator, `…2409cec9` 5): after the merge, `ABC-282` (W1) is unheld, and `ABC-286` (P4, over the
  history-ordered quiet list) and `ABC-288` (O2c, on the history table) are unheld for their probes. P1 (`ABC-284`) reads `R-283-LMR`
  (`ADR-0060` § Status, dated 2026-11-04).

*Dated 2026-11-04 (`arch-records-1104`, records only at `main` `83894094`; owed by `arch-ABC-289` `…62012bbe` § 6, the
Orchestrator's `…5ec6c124` 5 and `…0edae6fd` 1; `arch-bundle-1` released the file, merged `5fb58b95`): row Q2.*
- **The row is rewritten in place.** Its basis cell now reads "pre-registered: D200b +0.279 ply, d8 0.64–0.83×", and its
  dependency and ticket cells carry the line of `arch-owner-answers-1104` above, which had left them as written.
- **The re-measure that line asked for is done, and the premise is met** on `main` `0cc9afd1` with Q1 in it: reach at
  47 000 nodes 6.868 → 7.147; d8 0.6362 / 0.8263 in `search()` and 0.6484 / 0.8201 in `chooseMove`.
- **The row's +5–20 stays an estimate.** +0.279 ply is about a third of Q1's reach, and C2′ cannot size the gain. The
  build ships on its own read.
- **Not settled here.** `ADR-0074` is PROPOSED and the owner accepts it; until then `ADR-0024` d4 stands as written.
  `ABC-289`'s build is held on his answers (`…5ec6c124` 3). This line does not set Q2's slot.

*Dated 2026-11-04 (`arch-owner-answers-1104b`, records only at `main` `65e28f95`; his word `…3e73f9f9`, verbatim "1. Bundle 1:
(a) ; 2. OQ-0074-1: yes accept."): rows P4, O2c and Q2.*
- **Rows P4 and O2c: ACCEPTED over a missed premise,** in bundle 1 (`ADR-0072` M3, `ADR-0073` C1). Neither premise is met, and
  F1 stays fired on both. The ticket cells above are rewritten in place. Their Elo estimates stay estimates, and bundle 1's
  read will not split them (B5).
- **Row O2c's name keeps "continuation history"** as the row was cut. The form is the countermove alone.
- **Row Q2: `ADR-0074` ACCEPTED.** It supersedes "`ADR-0074` is PROPOSED" in the dated line above. `ADR-0024` d4 is amended (its
  § Status and d4 carry the pointers), in force at `ABC-289`'s merge.
- **The order:** bundle 1, then `ABC-289`, alone. D5's dated block of this task gives the reason.

*Dated 2026-11-06 (`arch-records-1106`, records only at `main` `8e115110`; owed by `arch-ABC-303-b5` `…28283e48` § 2 and
`arch-ABC-289-joint` `…7c297147` § 6): rows P4, O2c and Q2.*
- **Rows P4 and O2c: in force on `main` at `434fa171`,** in bundle 1 (`ABC-303`, QE `…ebefbfa2`). The cells stay as written, and
  their "not in force" reads through this line. The one read was the bundle's: C2′ 55.5 / 100 against 50.0 at 100 ms, all on. No
  reading splits it by row. The rows' Elo estimates stay estimates.
- **Row Q2: `ABC-289` is recorded NOT MET on an exact build,** by `ADR-0074` F1 and F7 (`…7c297147`, `…40ef8351`). With P4 on, drift
  read 34 cp against ≤ 30, and `G1` 53 / 58 against 54, row 1632 newly missed. No game was played. `ADR-0074` stays ACCEPTED, not in
  force, so `ADR-0024` d4's amendment is not in force either. Branch `grugops/ABC-289` at `b42706b3` is kept, unmerged.
  - **The cell's "premise met on `main`"** is `0cc9afd1`'s record, not re-read (`…7c297147` § 1). Its "not in force until `ABC-289`
    merges" stands. The row's +5–20 stays an estimate, unmeasured.
  - **Not closed.** OQ-0074-2 is with the owner and blocks nothing. The ticket closes on (a) or on no answer. Only he can open (b)
    to (d). No bar moved, nothing was re-pinned, and no row retired.

*Dated 2026-11-05 (`arch-owner-answers-1105`, records only at `main` `a44aa057`; his word `…b836b85c`, verbatim "1. yes; 2. yes;
3. wait"): rows E2, E3, E4, E5 and E6.*
- **Row E2, status: waiting, not closed.** Both pulls closed NOT MET on `zugzwang.001` (`ABC-239`, `ABC-301`). `main` keeps E1's
  table. There is no third fit now and no date. `ADR-0067` stays accepted, and the rules of the wait are its dated block of this
  task. **A third miss on this row closes tuning.**
  - The row's "+100–250" stays an estimate, and it stays unclaimed. No fitted table has played a graded game.
- **Rows E3 (E3b), E4 (E4b), E5 and E6: the dependency "E2" now reads "E1; hand values on its own read".** Each term goes
  on its own C2′ with values fixed by a stated rule, as form (b) on its page. **Superseded for these four:** "structure at 0, values
  from a pull", and the Top gaps line's "each best added under the tuner" as a condition. E4a stays as it is: at 0, unfitted.
  - Hand values have a poor record here (`ABC-207` lost; `ABC-205` died on cost; `ADR-0068`'s and `ADR-0070`'s rule values
    missed a pre-registered row). This path may end in closing tuning anyway (`…e5a5ac0c`).
- **The landing.** § Consequences' 2 550–2 800, with 3 000 at the optimistic edge, assumed E2 and terms fitted by it. It now stands
  lower by an amount nobody has read (`…2b3440cf`). No target moves; the targets stay his.

*Dated 2026-11-05 (`arch-ABC-291`, records only at `main` `148fd329`): row E4 (E4b).* **`ADR-0075` is ACCEPTED,** form (b), and acceptance is the owner's. Its definitions, rule and values
are fixed before any row is read, and its probe is written and not run. Row E4's +20–60 stays an estimate. d11 (d), "no second set of values after a miss", narrows C2′'s "a changed form may come back" for this term
only, and only on his acceptance. It also sets the pattern `ABC-292`, `ABC-290` and `ABC-293` copy. **No bar moves.**

*Dated 2026-11-07 (`arch-ABC-291-closed`, records only at `main` `78f13b30`; nothing run): row E4 (E4b).* **`ABC-291` is NOT MET: C2′ 46.0 of 100 against 50.0, clean, `ADR-0075` F4 by CF5** (`…211fb87a`). Nothing merged, and the branch is kept. "`ADR-0075` is ACCEPTED" reads accepted, not in force. Row E4's +20–60 stays an estimate and stays unclaimed, and this read cannot size it: −27.9 ± 61.6 spans 0. E4a stands at 0, so row E4 adds nothing to `main`'s score today.
d11 (d) now applies, to this term only. "It also sets the pattern" stands as a list for the next ADRs: each states its own lines and he accepts them there, so the list does not wait on `ADR-0075` being in force (its dated block of this task). **No bar moves.**

*Dated 2026-11-07 (`arch-ABC-292`, records only at `main` `b1227f2b`; nothing run): row E5.* **`ADR-0076` is PROPOSED, form (b), and acceptance is the owner's.** The bishop pair and the rook file terms go on one read, on hand values fixed by one rule before any row is read. Outposts split off and wait, by the page's split rule, and per-piece mobility stays `ABC-306`. Row E5's +30–80 stays an estimate for the whole row, and these two terms' share is `UNKNOWN - verify`. Nothing here is in force until his answer and `ABC-292`'s merge. **No bar moves.**

### D3. Is 3 000 reachable without a neural network?

- **For a classical engine, yes, in principle.** Stockfish 11, the last hand-crafted Stockfish, reads ≈ 3 430 CCRL
  40/15 (1 CPU). Fruit 2.1 reads ≈ 2 695. Several C/C++ hand-crafted engines sit above 3 000.
- **For a single-threaded TypeScript engine, 3 000 would be beyond the best public precedent found.** tomitankChess
  4.0, pure JavaScript and hand-crafted, read **2 820 ± 27 CCRL 40/15** after years of work. Its author estimated
  "over 2900" for the same engine in C. Lozza (JavaScript, Fruit-inspired) is lower. No TypeScript engine with a list
  rating was found (`UNKNOWN - verify`; not exhaustive).
- **The arithmetic** (estimates): D2's rows sum to roughly +520 to +1 330 in self-play. Discounted for overlap and
  self-play inflation (× 0.5–0.7), that is ≈ +260 to +930 outside, on today's ≈ 2 074. **Central landing ≈ 2 550–2 800
  on R's scale; 3 000 at the optimistic edge.** Blunder's path (2 038 → ≈ 2 700 CCRL with most of D2's search and
  eval rows, on bitboards) is the nearest worked example and agrees.
- **The honest answer:** reachable without a neural network, as a stretch goal. It needs essentially all of D2, a
  tuned evaluation, an instrument that sees +5 to +20 Elo (M0), and very likely a speed step beyond O1 (O1-d, staged
  generation, perhaps bitboards). Without M0 the climb cannot be steered: changes of that size are invisible to every
  instrument on record. Probability of 3 000 on R's scale with O1 alone: low (judgement, < 1 in 4). Confidence in
  every number here: low.
- **Caveats.** The scale is unnamed (D5). Readings against `UCI_LimitStrength` Stockfish are not engine-list ratings;
  the mapping is approximate by Stockfish's own words (± 100) and unmeasured on this host. A longer think time would
  raise skytalix's R reading without making it stronger at a fixed control, so the time must be part of the scale.

### D4. Ticket coverage, summarised

- **Covered by `EPIC-010`'s Backlog:** T1, T2, O1h, O3s, S1, E2, and parts of E1/E4 (`ABC-231`, `ABC-232`).
- **Tried and dropped, worth a re-try because a precondition changed:** T3 (`ABC-209`, after T1), X1 (`ABC-210`, at
  every depth rather than the horizon), E3 (`ABC-205`, if `G6` is read differently), E5 (`ABC-207`, by the tuner, not
  by hand). Each is fenced by `EPIC-010` § Out of scope ("Re-runs of what was tried").
- **Fenced by `EPIC-010` § Out of scope:** Q1 SEE pruning, Q2 delta pruning, rook activity by phase (part of E5).
- **Not covered anywhere:** M0, P1–P6, O2c, X2, W1, T4, V3, V4, E6, E7.
- **Speed:** V1 is being cut by `bapm-goal3000-o1-cut`; V2 waits the owner's yes on `ADR-0003`.

### D5. Measuring a 3 000 goal

**Today:** skytalix at 4 000 ms a move against Stockfish 19 E = 1 910 at `st=0.5`, 200 games, reads ≈ 2 074 (+57 / −50 from the ± 6.11-point interval) on
R's scale.

**What a "3 000" reading needs:**
1. **A named scale, the owner's call.** The proposal: Stockfish 19 `UCI_Elo` (≈ CCRL Blitz ± 100 by Stockfish's own
   calibration), because it is the instrument this repo already runs and it reaches 3 190. Alternatives: CCRL 40/15 or
   Blitz via a gauntlet against list-rated engines (foreign binaries: an owner yes on downloads); FIDE (not applicable
   to engines); Lichess bot (a different, human-dominated pool).
2. **A fixed time for skytalix, part of the scale.** Either level 5's 4 000 ms a move (continuity with every reading on
   record) or Stockfish's calibration control, 120 s + 1 s a game (needs W1's time management, which does not exist).
   Recommended: 4 000 ms a move for the trend, plus one 120 + 1 reading at the 3 000 claim.
3. **Stockfish's `st` raised with E.** At E ≈ 3 000 Stockfish picks at depth 1 + level ≈ 18–20 (`UNKNOWN - verify`;
   level comes from a cubic fit). `ABC-204`'s probe read depth 12 at 250 ms, so `st=0.5` may not reach it, and its
   guard would make the reading UNRESOLVED. The fair setting is **equal time** (Stockfish `st` = skytalix's 4 s),
   which roughly doubles each game's wall time (estimate: ≈ 20–25 h ALONE per 200-game reading at width 1).
4. **E stepped up by `ABC-204`'s band rule** (keep the score in 25–75 %; E′ = E + X, clamped to 1 320–3 190). The cap
   does not block a 3 000 claim: E = 3 000 at ≥ 50 %, or E = 3 190 at ≥ 25 %, both read it.
5. **A claim rule, the owner's call.** Proposed: a milestone M is MET when a 200-game reading at E = M scores ≥ 50 %
   (point estimate ≥ M); the interval is reported, not graded.

**Milestones proposed:** 2 200, 2 400, 2 600, 2 800, 3 000 on the chosen scale. Each is a reading after a block of
D6 lands, not a gate on any ticket.

**Per-change measure (M0):** an SPRT lane, self-play at a short control (for example 10 s + 0.1 s a game, or fixed
nodes), bounds [0, 5] Elo for a gain and [−5, 0] for a simplification or speed change, a few thousand games per test.
The smoke pair stays as the fault, time-loss and collapse guard. Milestone R readings catch self-play non-transfer.
Throughput is the owner's call: at width 1 an SPRT test costs ≈ 10–30 h (estimate); with the CPU's spare cores in use
it costs a few hours, but the host is then not "one at a time".

#### Dated 2026-11-01 (owner fold, `arch-adr0056-owner-fold`): the claim at 40/15, and the fast routine controls

The owner set the claim's time control (Q-3K-1) and allowed shorter routine controls, down to 0.5 s a move
(`…022fb66f`). This block amends D5 items 2 and 3 and the per-change paragraph above. Items 1, 4 and 5 stand. Every
hour and game count below is an **estimate**, with its basis named. None is a reading. Nothing was run.

**Facts used** (from the records, not re-read on the host):
- Width 1 is the owner's rule, for heat. At width 2, Tctl read a median of 87.05 °C, and he moved readings to one game
  at a time (`…65848126`). At width 1, `ABC-222`'s 40/15 self-play read a Tctl median of 73.9 °C and a max of 76.1 °C.
  Its frequency fell ≤ 0.01 % over 3.44 h for 5 games, about 41 min a game with both sides on the clock and an 80-move
  cap (`qe-ABC-222` `…00cc4db1`). The longest clean run at width 1 on record is the milestone 1 R pair: 22.22 h,
  400 games, 18.0 games/h, 0 thermal pauses (`ADR-0053`). That is about 200 s a game at 4 s + 0.5 s a move.
- **Stockfish's pick depth, read from `search.h` at `sf_19`.** `level = clamp(((37.2473·e − 40.8525)·e + 22.2943)·e −
  0.311438, 0, 19)`, with e = (E − 1 320) / 1 870. The pick is made at depth 1 + int(level). This reproduces
  `ABC-204`'s two recorded values: level 2.56 at E 1 650, and depth 5 at E 2 000. It gives:

  | E | 2 200 | 2 300 | 2 400 | 2 600 | 2 800 | 2 900 | 3 000 | 3 190 |
  |---|---|---|---|---|---|---|---|---|
  | pick depth | 6 | 6 | 7 | 8 | 11 | 12 | **14** | 19 |

  D5 item 3's "≈ 18–20 at E ≈ 3 000" was wrong; it is 14. `ABC-204`'s probe read depth 12 at 250 ms, but that was on
  the previous host and from a probe position. So `st=0.5` holds the pick depth with headroom up to about E 2 600.
  Above that it is `UNKNOWN - verify` on this host.

**C1. The 3 000 claim reading, at 40/15.**
- **skytalix:** a real 40/15 clock (`cutechess-cli` `tc=40/900`). The time mode is `uci-clock-mode` if `ABC-223`
  reads it MET, because that mode spends the clock as a clock. Otherwise it is `simple-tournament` (22 s a move,
  capped by the clock; M1 and M2 were MET at `ABC-222`). Both are about 22 s a move, the owner's figure. Book on, as
  the product ships.
- **Time management (W1)** is not needed for the claim to be legal: both modes have never lost on time (`EPIC-009`
  M1). It is needed for strength. With no "will the next iteration finish" test, an iteration that cannot finish is
  aborted and thrown away. At a branching factor of about 2.5–3, that is often half or more of a move's time (estimate,
  `[J]`). W1 lands before the claim reading, inside `EPIC-011`. Its gain is graded at the fast control (C2): the waste
  is a share of the move's time, so it shows at 0.5 s as well.
- **Stockfish's side:** 19, `UCI_LimitStrength`, `UCI_Elo` = E, `Threads 1`, `Hash 16`, as `ABC-204` pins it. E is
  stepped by `ABC-204`'s band rule (D5 item 4). **Its move time is fixed (`st`), not a clock.**
  - Its play is pinned by depth: it picks at depth 1 + int(level) and keeps that move. So any time past that depth
    changes nothing in play (`ABC-204` § Q2). That holds just as much on the 120 + 1 clock its scale was calibrated
    on.
  - The fixed time is set at PREREG by a probe on this host. It is at least 4× the 95th percentile of
    time-to-pick-depth over the reading's openings, with a floor of 0.5 s. Estimate at E 3 000 (depth 14): about
    2–4 s (`UNKNOWN - verify`).
  - `ABC-204`'s depth guard stays: a Stockfish move below its pick depth makes the reading UNRESOLVED.
  - **The alternative is both engines on the same 40/15 clock.** That is the same strength for Stockfish and about
    twice the wall time. It is open to the owner if he prefers both sides on one clock to read the claim (see D7).
- **Games:** 200, at E = 3 000. MET when the score is ≥ 50 % (D5 item 5); E = 3 190 at ≥ 25 % reads it as well. At a
  50 % score, 200 games give about ± 40–45 Elo (95 %), by the spread of the R readings on record (± 6.11 points at
  200 games).
  - **Futility stop, pre-registered:** after 100 games, a score below 41 % (more than 2 SE under 50 %) stops the
    reading as NOT MET. That saves about 1.5 days. The stop can only fail a claim. It can never make one.
- **Host hours at width 1 (estimate):** skytalix spends about 20 min of clock a game (`ABC-222`'s 41 min for two
  sides). Stockfish spends about 2–3.5 min (≈ 50 moves × 2–4 s). That is about 22–24 min a game, and **≈ 75–80 h
  (about 3.2 days) ALONE for 200 games**. On the equal-clock alternative it is ≈ 130–140 h (about 5.5–6 days).
- **Heat:** width 1 only, on mains, with `ABC-222`'s A7 rule (a sampler ≤ 60 s, the Tctl median per quarter and the
  max, and a frequency fall > 5 % from the first quarter makes the session UNRESOLVED, re-run once).
  - The run is split into **sessions of 50 games** (≈ 19–20 h each, inside the 22 h the host has run clean), each a
    fixed, seeded slice of the openings. A cool-down gap between sessions waits until Tctl is back at its idle level
    (the level is pinned at PREREG).
  - A thermal or fault event then costs one session, not the reading. Holding Tctl near 74 °C for days is
    `UNKNOWN - verify`: nothing on record has run longer than 22.22 h.
- **When to spend it:** only when a 4 s trend reading, plus the measured 40/15 offset (C4), puts the point estimate
  at or above 3 000. Otherwise the 3 days buy a known NOT MET.
- *Dated 2026-11-02 (`ADR-0057` OQ-3 (c), owner `…81ae2db4`; `arch-owner-answers-1102`).* **The claim is read and
  reported at `Threads 1` and at `Threads N` separately, `Threads 1` first.** Each result is labelled "1 CPU" or "N
  CPU", with N and the cores used stated. No "3 000" is quoted without the label. Stockfish stays at `Threads 1`: its
  limited play is pinned by depth. The `Threads 1` claim keeps every rule in this block. The `Threads N` claim's
  "when to spend it" and its PREREG are the Architect's, written when the threads strand has merged (named, not
  decided here).

**C2. The per-change SPRT, the fast routine control** (the tool is M0; whether its verdict enters the per-change rule
is still Q-3K-2):
- *Superseded 2026-11-01 (`arch-adr0056-100ms-fold`; owner `…2896c6eb`: no SPRT). The per-change read is now C2′ in
  the dated block "the fixed-count rule at 100 ms" below. C2 is kept as history. Its depth and throughput estimates
  are corrected there by measurement.*
- **Control: 0.5 s a move on both sides** (`st=0.5`; `movetime` is the budget under level 5's cap), self-play,
  candidate against base. Each opening is played with both colours. The opening set is fixed and seeded, and larger
  than `ABC-204`'s 100 positions; its size is M0's. Width 1.
- **Bounds:** gain tests H0 Elo ≤ 0 against H1 Elo ≥ 10. Non-regression tests (a value change meant to be neutral,
  such as a simplification) use [−10, 0]. α = β = 0.05. Value-identical tickets stay on their S2 perft/nps reading,
  with no games.
  - D5's [0, 5] is **not affordable at width 1**. The arithmetic (estimate; logistic SPRT, about 30 % draws): [0, 5]
    needs about 4× the games of [0, 10]. [0, 10] needs about 700 games for a true +40, about 1 650 for +20, about
    5 000 for +10 or for 0, and about 7 300 at worst (+5).
  - D2's early rows (P1, P2, P4, T1) are estimated at +15 to +100. They end in the low thousands of games or fewer.
    Rows smaller than +10 need more width (Q-3K-3) or wait for the block reading.
  - D5's "a few thousand games per test" and "≈ 10–30 h" were optimistic for [0, 5]. This replaces them.
- **Throughput (estimate):** at 0.5 s a move, a game is about 90 plies × 0.5 s plus engine start, so ≈ 45–55 s, or
  **≈ 65–80 games/h at width 1** (scaled from the R pair's 200 s a game; `UNKNOWN - verify`, read on M0's first run).
  A +40 change ends in ≈ 10 h, a +20 change in ≈ 24 h, and a null change in ≈ 70 h. A **cap of 6 000 games
  (≈ 85 h)**: a test still running at the cap has not shown a gain.
- **Depth caveat at 0.5 s:** skytalix reaches about 2 plies less than at 4 s (median depth 7–8 at 4 s, `G6`; so about
  5–6, `UNKNOWN - verify`). Where a ticket's mechanism barely fires at that depth (X2 singular extensions, T4 a larger
  TT, depth-scaled null move P5), the Architect names a longer SPRT control at design. Use 2 s a move (about
  4× slower), and show the mechanism's firing rate at 0.5 s as the reason.
- The smoke pair stays as the fault, time-loss and collapse guard, as D5 says.

**C3. Milestone trend readings, against Stockfish:** R's instrument at **4 s a move** (level 5), Stockfish at E by the
band rule, with `st` held to the pick-depth headroom rule in C1 (0.5 s up to about E 2 600). 200 games, width 1,
≈ 11–12 h ALONE (18.0 games/h, `ADR-0053`).
- *Superseded 2026-11-01 (`arch-adr0056-100ms-fold`; owner `…2896c6eb`). The routine outside reading is now C3′, a
  400-game pair at 100 ms per epic, in the dated block below. A 4 s reading is no longer routine. As a run over 1 h,
  it is asked of the owner first.*
- **Why 4 s and not 0.5 s:** it continues every outside reading on record (≈ 2 074, `…1a53a7f9`). It is also about
  2.5 doublings from 40/15 (22/4), where 0.5 s is about 5.5. So its offset to 40/15 is smaller and drifts less.
- A 0.5 s reading against Stockfish (≈ 3 h for 200 games) may be used as a quick check between milestones. It is
  labelled as such and is never a milestone.
- Milestones 2 200 … 2 800 are trend readings at 4 s, reported as "at 4 s a move", plus the latest measured offset.
  Only 3 000 is claimed, and only at 40/15 (C1).

**C4. The 40/15 anchor readings** (the readings the Architect names at 40/15 besides the claim):
- **A0, first reading of `EPIC-011`:** 100 games at 40/15 at the E the band rule picks (expected about 2 200–2 400).
  Stockfish `st=0.5` holds depth 6–7. It is paired with a 4 s trend reading on the same build, so the 40/15 offset is
  **measured**, not assumed. ≈ 35 h ALONE (about 20.5 min a game).
- **A1, after Phase 4** (the tuned evaluation; the change most likely to move how the engine scales): the same pair
  again, so the offset is re-measured before C1 relies on it.
  - *Dated 2026-11-05 (`arch-owner-answers-1105`; his word `…b836b85c`, "3. wait"):* **A1 keeps its place, after Phase 4. Its reason
    changes.** "The tuned evaluation" no longer describes Phase 4: on the wait, `main` carries rule-made and hand values. It now
    reads "the evaluation as Phase 4 leaves it". Whether the pair is worth its hours at that point is a question for that hop,
    asked of the owner as A1 always was (`…2b3440cf`). If a third pull ever merges after A1, whether the offset is read again is
    `UNKNOWN - verify` and is his.
- Nothing else is read at 40/15.

**What a shorter control can and cannot predict about 40/15** (the scaling caveat):
- **It can predict:**
  - the **sign** of most changes;
  - bugs, collapses and losses on time;
  - time-use changes (W1), which are a share of the move's time;
  - the trend's direction from milestone to milestone.
- **It cannot predict:**
  - **The size of a gain at 40/15.** Evaluation gains often shrink at longer controls. Gains from searching deeper
    (reductions, extensions, a larger TT) often grow, and may read zero or negative at 0.5 s.
  - **skytalix's absolute R at 40/15.** skytalix gains with its own time: about 50–100 Elo per doubling (`ADR-0055`
    [D]), less at depth. Limited Stockfish does not, because its play is depth-pinned. So a 4 s reading
    underestimates 40/15 by an offset. Estimate: about +120 to +250 at 2.5 doublings, low confidence. A 0.5 s
    reading underestimates it by more (≈ +270 to +550, lower confidence still).
  - **The offset after the engine changes.** Better pruning steepens the scaling curve, which is why C4 measures the
    offset twice.
  - **Self-play inflation.** Self-play gains overstate outside gains (`RISK-EPIC008-03`), at any control.
- So no fast reading is a claim. The claim rule stays at 40/15.

#### Dated 2026-11-01 (`arch-adr0056-100ms-fold`): no SPRT. The fixed-count rule at 100 ms (supersedes C2 and C3)

The owner set the per-change and per-epic readings (`…2896c6eb`): **100 games at 100 ms a move per strength change,
new against base, and 400 games at 100 ms per epic, with no SPRT.** This block defines what "pass" means for each,
names the opponents, and states what the rule cannot see. The facts come from `qe-tc-depth-probe` (`…b505d675`), on
`main` `8efbb827`, Node v26.12.1. The host was SHARED for most rows (QE-TCP-a), so the throughput figures are lower
bounds and the overshoot figures upper bounds. Every hour and Elo figure not quoted from that probe is an
**estimate**.

**Facts used (measured; they replace C2's estimates)**

| skytalix `go movetime` | 100 ms | 250 ms | 500 ms | 1 000 ms | 4 000 ms |
|---|---|---|---|---|---|
| completed depth, median [min–max] (`…1889e3b0` R1, 25 positions, one fresh process per search) | **6** [3–10] | 7 [5–11] | **8** [5–12] | 9 [7–13] | **10** [8–14] |
| self-play games per hour, width 1 (`…07357280` R4) | **259.2** | — | **44.2** | — | — |

- **C2's depth estimate was wrong by two plies.** C2 put 0.5 s at depth "about 5–6". Measured, 500 ms reaches 8,
  and **100 ms reaches 6** (5 cold). So 100 ms sits where C2 feared 0.5 s would. C2's "7–8 at 4 s" was `G6`'s median
  on its own positions, read before milestone 1b's speed-ups. This probe's 25 positions read 10 at 4 s. The two sets
  differ, so the two numbers are not compared.
- **C2's throughput was wrong too.** C2 estimated 65–80 games/h at 0.5 s. The probe read 44.2, because self-play games
  run long (163.7 plies). At 100 ms the probe read 259.2 games/h, with games of 137.6 plies.
- **The 100 ms control is mechanically sound on this host.** The largest overshoot was 4 ms over 5 355 searched
  moves, no move went more than 10 ms over budget, and there were 0 losses on time (`…07357280`).
- **Noise and warm-up at 100 ms** (`…1889e3b0` R2, R3):
  - Identical fresh searches vary by one ply and by up to ±25 % in nodes.
  - A cold search (the first in a fresh process) reaches a median 1.47× fewer nodes than a warm one. It is one ply
    shallower on 9 of 25 positions.
- **Stockfish** (`…9fd1fdce` R5): it reached its pick depth in 320 of 320 searches, at E 1 910…2 600. The 95th
  percentile time was 3.9–19.1 ms, and the largest was 29.2 ms. **E above 2 600 was not measured.**
- **Stockfish spends its whole move time.** The milestone 1 batch PGN shows it, for example
  `qe-EPIC-010-m1-batch-2/raw/batch/base/b04/r.pgn`. At E 1 910, whose pick depth is 4, Stockfish's moves read
  `0.50s` at depths 15–18. It keeps searching after it picks, and the extra depth changes nothing in its play
  (`ABC-204` § Q2).

**C2′. The per-change read: 100 games, self-play, 100 ms**

- **Who plays.** The candidate (the ticket's head, rebased on `main` as it will merge) plays its base (the merge-base
  on `main`), as the `EPIC-010` D smoke pairs them. It applies to every **strength-changing** ticket, meaning any
  value change. Value-identical (speed) tickets keep their S2 perft/nps reading and play no games (owner's reading,
  item 4).
- **The control.**
  - Both sides think 100 ms a move (`st=0.1`). Openings 1–50 of `tools/rating/openings.epd`, each played with both
    colours, give 100 games.
  - Width 1, as the owner set it (`…f7a50e95`).
  - The harness defaults stay: level 5, `OwnBook` on, `restart=on`, `-maxmoves 200`.
- **Losses on time: `timemargin` = 50 ms at 100 ms, not Q1's 5 000 − budget.**
  - The reason: at 100 ms, Q1's rule gives 4 900 ms of margin. A candidate could think 50× its budget without losing,
    and a change that broke the time check would read as a gain in strength.
  - 50 ms is 12× the largest overshoot measured (4 ms over 5 355 moves).
  - Stockfish's own `timemargin` (2 000 ms) is unchanged: its play is pinned by depth.
- **Wall time:** ≈ 23 min at 259 games/h, plus two builds. That is under 1 h, and the run is owner-set, so it is not
  asked.
- **The decision rule.** The candidate passes only if all three hold:
  - **C-1 (faults).** The candidate makes 0 faults: no illegal move, crash, disconnect or stall (`EPIC-008`'s
    states).
  - **C-2 (time).** The candidate loses 0 games on time at the 50 ms margin. A fault or a loss on time by the base
    makes the read UNRESOLVED. It is re-run once, and a base defect is routed as a defect on `main`.
  - **C-3 (score).** The bar depends on the ticket's intent, which the design declares before the read:
    - **GAIN** (the change is meant to make it stronger): **≥ 50.0 of 100**. The point estimate must be ≥ 0 Elo:
      "not seen worse than base".
    - **NEUTRAL** (a correctness fix or simplification that changes values): **≥ 43.0 of 100**, which is
      ≈ −49 Elo, the lower edge of the 95 % interval at 50 %: "no clear loss".
    - *Owner-accepted 2026-11-01 (`…43098cef`, "2. ok"): both bars stand, with the blind spot stated below.*
    - *Dated 2026-11-02 (owner `…81ae2db4`, "C yes"; `arch-owner-answers-1102`).* **NEUTRAL for a change invisible
      at 100 ms.** A strength change whose mechanism cannot be seen at 100 ms may be read on the NEUTRAL bar
      (≥ 43.0 of 100) in place of GAIN. It never stands alone: the ticket's own measured bar must pass too.
      - **Who names it: the ticket's page, before the read.** Its intent line reads "NEUTRAL (invisible at 100 ms)".
        BA/PM writes it from the ticket's design note, at or before Ready, and it is fixed before the read starts.
        No ticket is re-classed after a score is seen. QE grades on the intent the page held when the read began.
      - **What qualifies:** the design names the depth at which the mechanism acts and its firing at 100 ms,
        measured or derived (the depth-gated rule below). The mechanism qualifies only if that figure shows it barely
        fires at 100 ms. Examples on record: T4 by construction; T2 (at most 8.5 % of stores meet another position's
        entry); X2 and P5 by their depth gates (S1 struck 2026-11-03: measured to fire, `ADR-0066`). A change
        whose design expects its gain to show at 100 ms keeps GAIN. `ABC-264` (P2) cuts 5.8 % of nodes at depth 6, so it is GAIN.
      - **The ticket's own measured bar:** pre-registered on the page, read where the mechanism does fire. Examples:
        a fixed-depth node ratio, a completed depth at a longer budget, or held-out lines (`ABC-257` A8′, `ABC-237`
        A3). It is not loosened after Ready, and a miss is NOT MET, as a score miss is.
      - **Everything else stands:** C-1 and C-2, S′ and the Levels deep lane. The correctness-fix NEUTRAL above is
        unchanged.
      - **The cost, stated:** a NEUTRAL change may lose up to about 49 Elo at 100 ms unseen (P(pass | −20) = 0.88,
        the table below). The mechanism bar shows that it works, not that it gains. C3″ is the net check across the
        epic.
  - **A miss is NOT MET.** QE records a `failed-attempt`, and the ticket goes back to BA/PM. A miss is not re-played
    for luck, and the 100 games are not extended. A changed form may come back as a new attempt, and that is a new
    read.
    *Dated 2026-11-05 (`arch-owner-answers-1105b`; his word `…0f1ab02e`, "1. yes"):* a candidate fault or a loss on time is not this line's miss. It is read through
    CF1–CF10, for every read D5's dated block of that task names. A clean score below the bar is this line's miss, final (CF5).
  - **A stale read** is one whose base another value-changing merge has since moved. It is read again
    (≈ 25 min).
- **The blind spot, stated honestly.** At the measured draw ratio of 0.50, 100 games resolve **±48 Elo** (95 %),
  and **±57** at a draw ratio of 0.30 (`…07357280` R6). By the normal approximation, the chance that a GAIN ticket
  passes, given its true effect, is:

  | true effect (Elo) | +40 | +20 | +10 | 0 | −10 | −20 | −48 |
  |---|---|---|---|---|---|---|---|
  | P(pass), GAIN rule | 0.95 | 0.79 | 0.66 | 0.50 | 0.34 | 0.21 | 0.03 |
  | P(pass), NEUTRAL rule | 1.00 | 1.00 | 0.99 | 0.98 | 0.94 | 0.88 | 0.52 |

  So the read **keeps clear gains and stops clear losses. It cannot tell +10 from −10.**
  - About a third of real +10 changes are dropped, and about a third of real −10 changes are kept.
  - Small losses can pile up across an epic unseen. C3′ is the net check on that.
  - A kept change's measured score overstates its true value (the winner's curse). Per-change point estimates are not
    added up to forecast an epic.
  - Self-play inflation (`RISK-EPIC008-03`) applies to every per-change figure.
  - The owner accepted this error rate (*"error rate is still high enough that detection might be untrue"*).
- **Depth-gated mechanisms.** At 100 ms skytalix completes depth 6 (5 cold, 3 on kiwipete). A mechanism that acts
  only deeper barely fires, so it reads as noise or as a loss:
  - X2 singular extension;
  - P5, null move with R grown by depth;
  - and T4, the larger TT, by construction. A median 100 ms search visits ≈ 47 000 nodes, against the 4 MiB table's
    262 144 slots, which are cleared at every move. A larger table cannot show (derivation from `…1889e3b0` R1).
  - Rows that act at shallow depth fire at 100 ms: P1–P4, T1, T2, O1h, O3s, S1, and the evaluation rows. S1 is
    measured: 70.4 % of nodes at 47 000 inside aspiration passes (`arch-ABC-236`). *(2026-11-03,
    `arch-adr0056-fold-1103`: S1 moved here from the list above, where it was "aspiration windows, which `ABC-236`
    starts at depth 5".)*
  - **The rule:** the ticket's design names the depth at which its mechanism acts, and its firing rate at 100 ms if it
    is depth-gated. If it barely fires, the 100 ms read is reported with that limit stated. A read at a longer control
    (100 games at 500 ms ≈ 2.3 h) is a run over 1 h, so it is **asked of the owner** first. C2's "the Architect names
    a 2 s control" is withdrawn.
- **The smokes.** C2′ holds the D smoke's whole content (S-1, S-2, S-3) at 10× the games, so it **replaces the D
  smoke** for a strength-changing ticket. **Recommended: the R smoke stays** (10 games against Stockfish at the shipped
  4 s control, ≈ 14 min). It is the only per-change check of the shipped control and of an outside opponent. Dropping
  it is not this ADR's call. BA/PM records the merge rule (`bapm-100-400-rule`), and the Orchestrator rules if they
  differ.
  - *Superseded in part 2026-11-01 (`arch-adr0056-owner-answers`; owner `…43098cef` item 3). The D smoke stays
    replaced. The R smoke stays, at **0.5 s** a move, not 4 s: S′ in D5's dated block "the owner's three answers".*

**C3′. The per-epic read: 400 games, an interleaved pair against Stockfish, 100 ms**

- *Superseded 2026-11-01 (`arch-adr0056-owner-answers`; owner `…43098cef`, "1. b"). The per-epic read is now C3″,
  400 games head to head, in D5's dated block "the owner's three answers". C3′ is kept as history. Its Stockfish
  settings and its E > 2 600 probe rule still apply to the 100 ms readings C4 and C1 take (that block, "C4 and C1
  re-pointed").*
- **Who plays.** This is `rpair`'s shape, as in the milestone 1 batch, at 100 ms.
  - The base is the epic's starting SHA on `main`. The head is `main` when the epic's last ticket has merged.
  - Each build plays 200 games (`--rounds 100`: openings 1–100, both colours) against Stockfish 19
    `UCI_LimitStrength` at `UCI_Elo` E, in alternating blocks.
  - Width 1, `--concurrency 1`; `rpair`'s default of 2 is not used (owner, one core).
- **Why Stockfish, and not self-play head against base:**
  - The per-change reads are all self-play. The failure on record is self-play gains that did not transfer: two
    negative outside point estimates in a row (§ Today's outside reading). The epic read is the loop's only outside
    instrument.
  - Interleaving cancels host drift. That matters at 100 ms, because skytalix's nps moves with load and this host is
    often shared.
  - It also gives the trend figure, read on its own scale.
  - **The cost is resolution, and it is stated honestly.** The ±24 Elo for 400 games holds only for a 400-game
    head-to-head. Split into 200 + 200 against an outside opponent, it gives each build about **±41–55** Elo and the
    pair **±58–78** (estimate; the milestone 1 pair read ±77.9).
  - An epic bundle is expected at +60…+150 (D2's rows, estimates). The pair sees that size. It does not see +20.
- **Stockfish's move time: `st=0.1` for E ≤ 2 600. The 0.5 s floor is dropped for routine reads.**
  - 100 ms is ≥ 5× the slowest 95th percentile (19.1 ms) and > 3× the slowest single search (29.2 ms). So it
    meets C1's "≥ 4 × p95" rule.
  - The floor buys nothing in play, because Stockfish's play is pinned by its pick depth.
  - It would cost wall time, because Stockfish spends its whole `st`. Its moves would take 5× skytalix's, and a game
    would take about 3× as long (estimate).
  - `ABC-204`'s depth guard stays: a Stockfish move below its pick depth makes the read UNRESOLVED.
  - **C1's floor for the 40/15 claim is unchanged.** There, 0.5 s is small beside skytalix's 22 s a move, and the
    depth at E 3 000 is unmeasured.
- **E.** It is set by `ABC-204`'s band rule (score in 25–75 %, one step allowed).
  - skytalix at 100 ms is weaker than at 4 s: it searches 4 plies less, over 5.3 time doublings. The first 100 ms read
    is expected to place it at about E 1 550–1 850 (estimate, 50–100 Elo per doubling below ≈ 2 074; QE picks the
    starting E at PREREG).
  - Below E 1 910 the pick depth is 4 or less, so `st=0.1` holds with more headroom than measured.
- **Validity.** 400 of 400 games complete. Neither skytalix build makes a fault or loses on time (50 ms margin), and
  Stockfish's pick depth is reached. Otherwise the read is UNRESOLVED and re-read once.
- **The figures.** Per build, E + X on "Stockfish 19's `UCI_Elo` scale, skytalix at 100 ms, Stockfish `st=0.1`, this
  host". That figure is never compared with the 4 s ≈ 2 074 or with any list. Also the pair X_head − X_base ±
  √(Y₁² + Y₂²), and `rpair`'s pentanomial line as information.
- **The decision rule.**
  - **MET:** the pair's point estimate is ≥ 0, meaning the epic is not seen worse outside.
  - **NOT MET:** the point estimate is below 0. The next epic's strength tickets do not start until two things happen.
    BA/PM records which of the epic's changes are suspect, from their C2′ reads, intents and self-play margins. Then
    the Orchestrator rules keep, revert or re-read. No revert is automatic.
  - The interval is reported, not graded.
- **Wall time:** ≈ 1.0–1.6 h (estimate). At 100 ms on both sides a ply costs what it costs in self-play (13.9 s for
  137.6 plies). Games against Stockfish ran ≈ 85 plies at 4 s in the milestone 1 batch, and the 100 ms length is
  `UNKNOWN - verify` until the first read. The run is owner-set, so it is not asked (owner's reading, item 3).

**Restart and warm-up (both reads): keep `restart=on`, and add no warm-up move.**

- Under `restart=on`, only a game's first searched move is cold: one move in about 65 per side (QE-TCP-g).
- In C2′ both sides pay it equally, so the pair is unbiased.
- In C3′ it is a small, constant handicap against native Stockfish. Base and head pay it equally, so the pair cancels
  it. It biases each build's E + X slightly low, by an amount that is unmeasured and not corrected.
- A warm-up move would buy almost nothing and would add a harness path (gold plating). `restart=on` keeps each game
  isolated from the last.
- **The rule for single searches:** a depth or nps reading from one search at 100 ms is taken warm (10 warm-up
  searches, as R2 did) or labelled "cold".

**Before Stockfish can be used above E 2 600 at 100 ms** (`UNKNOWN - verify` today, QE-TCP-h):

- **A probe like R5, at E 2 700, 2 800, 2 900, 3 000 and 3 190.** The pick depths are 9…19 by `sf_19`'s formula; the
  table above has 11 at 2 800, 14 at 3 000 and 19 at 3 190. Use the same 40 positions, a fresh process, `go depth D`,
  and report p95 and max. Run it ALONE, or CLEAN-majority by `qe-tc-depth-probe`'s PREREG § 5.
- **The rule it feeds:** Stockfish's `st` = 100 ms where 4 × p95 ≤ 100 ms and the max is below 100 ms. Otherwise
  `st` = 4 × p95, rounded up to 50 ms. There is no 0.5 s floor. skytalix stays at 100 ms, and Stockfish's strength
  stays pinned by depth. A longer Stockfish `st` lengthens the epic read's wall time.
- **Cost and timing:** a few minutes of play, under 1 h, so it is not asked. It runs before the first C3′ read whose
  band rule picks E > 2 600. On the estimate above, that is far off.

**What 100 ms cannot tell about 40/15** (C2's scaling caveat, sharpened):

- 100 ms is about **7.8 doublings** under 40/15 (22 s / 0.1 s). 4 s is 2.5, and 0.5 s is 5.5.
- Gains that come from searching deeper read smaller, or negative, at 100 ms. Evaluation gains read larger.
- The 100 ms trend figure underestimates skytalix at 40/15 by an offset of the order of +390 to +780 (estimate,
  50–100 Elo per doubling; lower confidence than any figure in C4). That offset is too uncertain to time the claim.
- **C4, re-pointed:** A0 and A1 pair their 40/15 reading with a **100 ms** reading on the same build, in place of 4 s.
  So the offset the claim relies on is measured from the routine control. Both are runs over 1 h, so both are asked of
  the owner.
- **C1's "when to spend it", re-pointed:** the claim is spent only when the latest C3′ head figure plus the measured
  100 ms → 40/15 offset reaches 3 000. Everything else in C1 is unchanged.

**ABC-255 (M0): re-scope it to the fixed-count lane. It shrinks from M to S.** For BA/PM (`bapm-100-400-rule`), the
Architect's ruling:

- **Drop:** the `sprt` mode, the SPRT bounds, the ≥ 1 000-position opening file (100 and 400 games fit
  `openings.epd`'s 100 positions), and the `-sprt` question on cutechess-cli 1.5.1 (moot).
- **Keep and narrow to:**
  1. `d` accepts `--budget-ms 100`, with `timemargin` 50 ms at that budget. Q1's 5 000 − budget stays for every other
     budget, and every existing `--dry-run` output stays byte-equal. C2′ is then
     `d <candidate> <base> <out> --budget-ms 100 --rounds 50 --concurrency 1`.
  2. `rpair` (and `r`) accept the 100 ms control. skytalix gets `st=0.1` with `timemargin` 50 ms, and Stockfish gets
     `st=0.1` with its 2 000 ms margin. Existing defaults and pins are unchanged. C3′ is then
     `rpair <base> <head> <out> --elo E --rounds 100 --concurrency 1` with that control.
  3. The run records as `ABC-204` / `ABC-225` write them.
- **Acceptance in place of A2/A3:**
  - a `--dry-run` row for each of the two command lines above;
  - one real C2′ read on a known pair, `ABC-208`'s merge `b5c67ab7` against its first parent, as a sanity reading
    (reported, not graded: if its +38 holds at 100 ms, it passes the GAIN rule 94 % of the time);
  - one C2′ read on an identical pair. It reports games/h and the draw ratio at 100 ms, and grades nothing.
- **`ABC-256` (B0):** it becomes a 200-game read of `main` at the C3′ control, ≈ 0.5–0.8 h (estimate). That is under
  1 h, so it is not asked. It is the base half of the first C3′ comparison. This is for BA/PM to record.

#### Dated 2026-11-01 (`arch-adr0056-owner-answers`): the owner's three answers. A head-to-head epic read, the bars accepted, the smoke at 0.5 s, and the test-control rule (supersedes C3′)

The owner answered the three calls (`…43098cef`): *"1. b ; 2. ok ; 3. quick check can be with 0.5s difficulty. Make
sure engine is not changed internally and it works on different difficulty settings."* "2. ok" is folded into C2′ as
a dated line, and nothing else in C2′ moves. This block holds items 1 and 3. Every hour and Elo figure not quoted from
a reading is an **estimate**, with its basis named. Nothing was run.

**C3″. The per-epic read: 400 games head to head at 100 ms** (supersedes C3′)

- **Who plays.** The head is `main` when the epic's last ticket has merged. The base is the epic's starting SHA on
  `main`, before its first engine-changing merge. It is self-play, as C2′ is.
- **The control.**
  - Both sides think 100 ms a move (`st=0.1`), with `timemargin` 50 ms on both sides (C2′'s reason).
  - The harness defaults stay: level 5 with no `Skill Level` sent, `OwnBook` on, `restart=on`, `-maxmoves 200`.
  - Width 1, one game at a time (`…f7a50e95`).
- **The openings.** Openings 1–100 of `tools/rating/openings.epd`, each played with both colours. The file is read in
  sequence and wraps at round 101, so each opening is played twice with each colour. That is `d`'s default of
  200 rounds, the shape `ABC-207`'s 400-game D reading ran (`EPIC-008`).
- **The command:** `d <head> <base> <out> --budget-ms 100 --rounds 200 --concurrency 1`. It needs only `ABC-255`
  item 1, which C2′ already needs. There is no new harness path.
- **Wall time:** 400 games at 259.2 games/h is ≈ 1.55 h, plus two builds. The owner pre-approved about 1.5 h, so it is
  not asked again. 259.2 was read on a shared host, so it is a lower bound.
- **Validity.** 400 of 400 games complete, and neither build makes a fault (`EPIC-008`'s states) or loses on time at
  the 50 ms margin. Otherwise the read is UNRESOLVED and is re-run once. A fault in the base is routed as a defect on
  `main`.
- **The decision rule.**
  - **MET:** the head scores **≥ 200.0 of 400**, so its point estimate is ≥ 0 Elo: "the epic is not seen worse than
    where it started". It is C2′'s GAIN bar at four times the games.
  - **NOT MET:** below 200.0. As under C3′, the next epic's strength tickets do not start until two things happen.
    BA/PM records which of the epic's changes are suspect, from their C2′ reads, intents and margins. Then the
    Orchestrator rules keep, revert or re-read. No revert is automatic, and a miss is not re-played for luck.
  - The interval is reported, not graded.
- **What it resolves.** About **±24 Elo** at 95 % at the measured draw ratio of 0.50 (C2′'s ±48 at 100 games,
  divided by √4), and about ±28–29 at 0.30.
  - Each opening is played four times. The four games differ, because identical 100 ms searches vary by a ply and by
    up to ±25 % in nodes (`…1889e3b0` R2). But they are not fully independent, so "±24" slightly flatters the read.
  - By the normal approximation (SE ≈ 12.2 Elo), the chance of MET given the epic's true net effect:

    | true net effect (Elo) | +40 | +20 | +10 | 0 | −10 | −20 |
    |---|---|---|---|---|---|---|
    | P(MET) | 1.00 | 0.95 | 0.79 | 0.50 | 0.21 | 0.05 |

  - An epic bundle is expected at +60…+150 (D2's rows, estimates), and it reads MET almost surely. A net loss of 20 or
    more is stopped 19 times in 20. That is about three times finer than C3′'s ±58–78.
- **What it cannot see (the owner's choice, stated once).** It is self-play, and so is every per-change read. So
  self-play gains that do not transfer to an outside opponent stay unseen until a 40/15 reading. Two negative outside
  point estimates in a row are on record (§ Today's outside reading, `RISK-EPIC008-03`). The outside checks left are
  S′, which sees collapses only, and C4 and C1.
  - **Recommended to BA/PM (no new run):** pool the S′ scores in the smoke ledger, as `EPIC-010`'s trend rule pools
    the R smokes. A slow outside slide then shows once 30 or more games are pooled, at about 140 Elo resolution.
- **No E + X trend figure** comes from the epic read any more. The trend toward 3 000 is read only by C4's anchors and
  by C1.
- **An epic with no engine-core change** (no change under `src/` that the shipped `dist/uci.js` runs) would read an
  identical pair, so it owes no C3″. This is the Architect's reading of "after each epic is done", and the owner may
  correct it.

**S′. The smoke: 10 games against Stockfish at 0.5 s a move** (replaces the R smoke at 4 s; owner item 3)

- **Who plays:** one skytalix build, the candidate, as the R smoke did. The base does not play.
- **skytalix:** `st=0.5`, level 5 with no `Skill Level` sent, `OwnBook` on, `restart=on`, and `timemargin` **50 ms**
  (not Q1's 5 000 − 500).
  - The reason: the engine reads the clock every `NODES_PER_CLOCK_CHECK` nodes (`src/engine.ts`). So its overshoot is
    a fixed amount, not a share of the budget, and the largest measured was 4 ms at 100 ms. A 4 500 ms margin would let
    a broken time check think 10× its budget and pass S-2.
  - The overshoot at 500 ms is `UNKNOWN - verify`. `ABC-255`'s first S′ reports its largest. If that is over 12 ms
    (a quarter of the margin), the Architect re-sets the margin before any graded S′.
- **Stockfish, by C1's settings at this control:** Stockfish 19, `UCI_LimitStrength` true, `Threads 1`, `Hash 16`,
  `restart=on`, `timemargin` 2 000 ms, and **`st=0.5`**.
  - C1's rule is "at least 4 × the 95th percentile of time-to-pick-depth, with a floor of 0.5 s". Up to E 2 600 the
    95th percentile is ≤ 19.1 ms (`…9fd1fdce` R5), so the floor decides: 0.5 s, equal time with skytalix.
  - It is `r`'s existing Stockfish pin, unchanged. `ABC-204`'s depth guard stays.
  - Above E 2 600, the R5-style probe in the 100 ms block runs first, and `st` = the larger of 0.5 s and 4 × p95.
- *2026-11-02 (`arch-post-268`): **re-pinned to E = 1 980** by the trigger below (pool 26.0 / 30). The command
  carries `--elo 1980`. § Status, dated line of this date.*
- *2026-11-02 (`arch-ABC-233`): **amended to E = 1 810.** The step now aims at the band's centre: E′ = E + X − 168.4,
  in either direction. The command carries `--elo 1810`, and the pool starts empty at 1 810. § Status, dated
  amendment of this date. It supersedes the 1 980 above.*
- **E = 1 650** (`r`'s default, `ABC-204`'s first pin), not the R smoke's 1 910.
  - The basis (estimate): skytalix at 0.5 s is three time doublings under 4 s (≈ 2 074). At 50–100 Elo a doubling it
    sits at about 1 775–1 925.
  - At E 1 650 an unchanged build then expects about 67–83 %. That is near the 72 % that S-4's bar was set against at
    4 s (`EPIC-010`'s milestone 1 reference).
  - At E 1 910 it would expect about 31–52 %, and S-4's "≥ 3.0 of 10" would often stop an unchanged build.
  - E is re-pinned when the pooled S′ score leaves 60–85 % over 30 or more pooled games: one band-rule step, kept at
    E ≤ 2 600. That is `EPIC-011` C10's re-pin, now with a trigger. The expected score is `UNKNOWN - verify` until the
    first S′ on `main`.
    - *2026-11-02 (`arch-ABC-233`): the step is now the band-centre step, E′ = E + X − 168.4, in both directions
      (§ Status, dated amendment). A downward step is still the owner's question.*
- **The bars:** S-1, S-2 and S-4 as `EPIC-010` states them (S-4: ≥ 3.0 of 10; below that, 10 more games and ≥ 7.0 of
  20). S-3 is C2′'s now. BA/PM records the rule.
- **The command:** `r <candidate> <out> --budget-ms 500 --rounds 5 --concurrency 1` (openings 1–5, both colours).
  `r` refuses `--budget-ms` today, so this is `ABC-255`'s item 2, re-pointed below.
- **Wall time:** about 10 min (estimate: games of about 85–140 plies at 0.5 s a side, plus engine starts).
- **When it is owed:**
  - per strength-changing ticket, on the candidate head, beside its C2′ read;
  - per epic, on the closing head, beside C3″;
  - never for a value-identical ticket, which keeps its S2 reading and plays no games.
- **Why 0.5 s keeps the smoke's job:** faults, losses on time and collapses show at any control (C2's scaling caveat,
  "It can predict"). What the move to 0.5 s loses is the per-change game check at the shipped 4 s control. The
  real-clock level 5 row (A5 in R-TC part 2) carries that.

**R-TC. The test-control rule** (the owner's *"make sure engine is not changed internally and it works on different
difficulty settings"*)

*Part 1: a test control is harness and configuration only.*

1. **Where a control is set.** A test control (100 ms, 0.5 s, 40/15, or any later one) is set only outside the
   engine: by `cutechess-cli`'s `st=` / `tc=` / `timemargin`, by the harness under `tools/rating/`, and by the UCI
   options the product already ships (`Skill Level`, `TimeMode`, `OwnBook`).
   - The engine receives it as the ordinary `go movetime` or clock that any GUI sends.
   - At 100 ms and at 0.5 s the session is at level 5, and `go()` passes min(G, 4 000) = G (`src/uci-session.ts`). So
     every fast read takes the shipped path at rate 0.
2. **No engine code path is keyed on the control.** That means no path keyed on a budget's value, on a test or bench
   flag, or on the environment.
   - The budget enters the engine core only as the deadline: `start + Math.min(options.budgetMs, HARD_CEILING_MS)` in
     `src/engine.ts`.
   - Read at `main` `adab5f0d`: that is the only read of `budgetMs` in `src/engine.ts`. `src/search.ts`,
     `src/quiescence.ts`, `src/evaluate.ts` and `src/transposition.ts` read neither the budget nor the environment.
   - **Allowed:**
     - rules keyed on search state (depth, ply, nodes, the TT);
     - a time rule that is a continuous function of the time left and acts the same at every control, such as W1's
       "will the next iteration finish". That is product behaviour at every level, and C2′ grades it like any other
       change.
   - **Not allowed:**
     - a branch chosen by a particular budget or control ("if the budget is 100 ms or less …");
     - a constant tuned to one test control and used only there;
     - a door the harness switches on;
     - an environment read in the engine.
3. **Every read plays the shipped artifact.** That is the built `dist/uci.js` of the SHA under test (`rating.ts`
   passes `arg=<clone>/dist/uci.js`), the artifact `npm run uci` and the build ship.
   - `ADR-0026`'s test-only doors stay separate exports that no shipped entry calls, and no read uses them.
4. **A harness ticket changes `tools/` only.** That covers `ABC-255` and any harness ticket after it. Its diff holds 0
   lines under `src/`, read from the PR's numstat at review, and the existing dry runs stay byte-equal.

The check per strength-changing ticket: the review reads the diff against item 2. Any new read of the budget, the
deadline, `movetime` or the environment in the engine core goes to the Architect. G-1 below would make this
mechanical.

*Part 2: the engine still plays at each difficulty setting.*

The settings in use:
- `Skill Level` 1–7, with budgets of 100 / 180 / 330 / 1 000 / 4 000 / 5 000 / 30 000 ms and blunder rates from 0.4
  down to 0;
- `TimeMode` `level`, `simple-tournament` (22 s) and `uci-clock-mode` (up to 59.5 s);
- the test controls, 100 ms and 0.5 s.

- **Every PR, already owed: `npm test`** (a mandatory gate). Its default rows prove the wiring of every setting, on
  virtual clocks, at no new cost:
  - in `src/levels.test.ts`: the table; level 5 at rate 0 is `chooseMove`, move for move; the seed is threaded; the
    boundary scan (A8);
  - in `src/uci-session.test.ts`: `Skill Level` 1–7 reaches the level and caps `go`, with `ABC-171` A6 at levels 1, 3
    and 5 and `ABC-212` A9 at 6–7; the blunder path; `ABC-220` and `ABC-221`, the two `TimeMode` budgets.
- **Per strength-changing ticket, the named check: the Levels deep lane.**
  - The command: `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/levels.test.ts
    --reporter=verbose`. It has 57 tests and took 577 s on `EPIC-010`'s closing head (`memory-bank/90-agents-md-command-log.md`
    § "Levels deep lane"). *(Refreshed 2026-11-01; was "41 tests and takes about 555 s".)*
  - It is the cheapest existing check that runs the changed engine at every level:
    - A2: each of levels 1–7 on the shipped path spends its budget ± 20 % on a fine virtual step, inside its ceiling,
      and so does level 1's blunder path;
    - A4: level 1's blunder path over at least 200 endgame moves, and over the perft and puzzle corpus. Every move is
      legal, the blunder rate is within ± 5 points, the worst move is never played, and the blunder is the strict
      second-best;
    - A5: level 5, the shipped default at 4 s, on 30 positions on the real clock, every move ≤ 5 s;
    - `ABC-212` A4: levels 6 and 7 on the real clock, each move inside its ceiling. It also logs the depth that
      `KEY_ARRAY_CAPACITY` is watched by;
    - A3: level 1 solves strictly fewer puzzles than level 5, so the two ends of the scale stay ordered.
  - The games cover the fast end: the 100 ms read is level 1's budget at rate 0, and S′ sits between levels 3 and 4.
    A5 and the level 6–7 rows cover the slow end.
  - QE runs it on the candidate head, host alone, beside C2′. The pass is exit 0 with 57 passed (count your run).
    About 10 min. *(Refreshed 2026-11-01; was "41 passed" and "About 9 min".)*
- **Per epic, on the closing head, beside C3″**, two more lanes:
  - the self-play ladder in short mode, `LADDER_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run
    src/ladder.test.ts` (18 tests, 23.4 s with the host alone, the command log; *refreshed 2026-11-01, was "848 s on a
    loaded host"*). It plays real games between levels 1–5, blunders
    included, and asserts each one ends legally (A3, A4);
  - the UCI session deep lane, `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run
    src/uci-session.test.ts`. Its 5 × 22 s and 3 × 59.5 s searches put both `TimeMode`s on the real clock. 241
    tests, 291 s with the host alone (*refreshed 2026-11-01; was "About 5 min (estimate)"*).
  - Together with the Levels deep lane that is about 15 min (*refreshed 2026-11-01; was "about 30 min"*). Each lane
    is under 1 h, so none is asked.
  - *2026-11-01, dated figure refresh by Architect/Design (task `arch-adr0057-fix`, records only, at `main`
    `ff775417`; nothing run).* The four refreshed figures above are QE's readings on `EPIC-010`'s closing head
    (`qe-EPIC-010-close` `…388b3044`: worktree at `608ebfa4`, `src/` equal to `053733d2`, vitest 4.1.12, each lane
    under the host lock, one at a time). All three lanes exited 0 with every test passed: Levels 57 of 57, 577 s, host
    SHARED; ladder short 18 of 18, 23.4 s, host ALONE; UCI session 241 of 241, 291 s, host ALONE. The Scribe listed
    them as stale (`scribe-lane-figures` `…1fdc30f0`). No rule, lane, command or duty in this section changes.

**Gaps (for BA/PM to cut; nothing covers them today)**

- **G-1: R-TC item 2 has no mechanical guard.** Proposed: one default-lane source-scan row, in the shape of
  `levels.test.ts`'s boundary row A8. It reads `src/engine.ts`, `search.ts`, `quiescence.ts`, `evaluate.ts` and
  `transposition.ts`. `budgetMs` may be read only in the deadline expression, and no file may read the environment or
  argv. It is test-only, size XS, and touches one `src/` test file. Without it, item 2 rests on review.
- **G-2: the Levels deep lane's recorded trigger is too narrow.** The command log says "after any change to
  `src/levels.ts`, `src/engine.ts` or `src/virtual-clock.ts`". It misses the files strength tickets change:
  `search.ts`, `evaluate.ts`, `quiescence.ts`, `transposition.ts` and the move-ordering code. The per-ticket duty above
  covers this, but the trigger line should name the engine core. Records only, a Scribe line.
- **Recorded, not proposed:** no lane plays real games at levels 6 and 7, or at any level against an outside engine.
  The ladder covers 1–5 in self-play. Levels 6 and 7 are at rate 0 and differ from level 5 by budget alone, so A2 and
  `ABC-212` A4 are judged enough. More would be gold plating.

**`ABC-255` re-pointed again** (for BA/PM)

- **Item 1 stays:** `d --budget-ms 100`, with `timemargin` 50 ms. It now carries both C2′ (`--rounds 50`) and C3″
  (`--rounds 200`).
- **Item 2 changes:**
  - `rpair` at 100 ms is no longer needed, because there is no per-epic pair.
  - Instead, `r` accepts `--budget-ms 500`: skytalix gets `st=0.5` and `timemargin` 50 ms. Stockfish's pins are
    unchanged (`st=0.5`, 2 000 ms margin), and `--elo` keeps its default of 1 650.
  - Every existing `r`, `d` and `rpair` default, pin and dry-run output stays byte-equal.
- **Acceptance:**
  - a `--dry-run` row for each of the three command lines (C2′, C3″, S′);
  - the `ABC-208` sanity C2′ read and the identical-pair C2′ read, as before;
  - one S′ on `main`, reported and not graded: the score and the largest overshoot at 0.5 s;
  - 0 lines under `src/` (R-TC item 4).
- **`ABC-256` (B0)** was C3′'s base half, and with C3′ gone it has no routine use. **The Architect recommends dropping
  it now.** The 100 ms reading against Stockfish that C4 and C1 need is cut with A0, when the owner is asked for it.

**C4 and C1 re-pointed**

- The routine 100 ms outside figure (C3′'s head figure) no longer exists.
- A0 and A1 each take their own 100 ms reading against Stockfish on the same build: 200 games, with C3′'s Stockfish
  settings and its E > 2 600 probe rule, about 0.5–0.8 h. It is part of the anchor the owner is asked for.
- **C1's "when to spend it":** the claim is spent only when a 100 ms reading of that kind on the latest head, plus the
  measured offset, reaches 3 000.
- `r` at 100 ms (skytalix and Stockfish both at `st=0.1`) is cut with A0, not now.
  - *Dated 2026-11-03 (`arch-post-269`): pulled forward. Its first user is R1 (`ABC-273`), not A0. The change is
    `tools/` only, and its shape is in D6's dated line of this date. A0 and A1 later use the same command.*

#### Dated 2026-11-04 (`arch-second-pull-1104`), ACCEPTED 2026-11-04: the bundle read. Related changes built on one branch and judged by one C2′ read (an amendment of C2′, the per-change rule)

**Status: ACCEPTED 2026-11-04 by the owner (`Q-3K-11` (a), `orch-2026-10-30a` `…3b15b361`), as written, carrying
R-BUNDLE-1** (`…ce2883d8`, his risk acceptance: a bundle's single read may hide a part with a small negative share).
It is part of the per-change rule. Recorded by Architect/Design (task `arch-bundle-1`); no line of B1–B7 changed.
*Was:* **PROPOSED. Acceptance is the owner's** (`Q-3K-11`): it changes the per-change rule (`EPIC-011` § The
per-change rule). **Reading (b):** while PROPOSED it may be used only for a bundle the owner names. Records only, at
`main` `fad72f17`; nothing was run.
- **His direction, verbatim** (`orch-2026-10-30a` `…dda43b71`): *"super news about ABC-233, 234 and 236 together
  having very nice impact. This could be approach for future as well, compounds the evidence better."* The guards are
  the Orchestrator's, drawn from `ABC-283` (`…dda43b71` item 3).
- **The precedent:** `ABC-283` (O1h + O3s + S1). Three changes, each parked on its own pay gate, were built on one
  branch, each behind its own door plus one all-off door. They were read once: 66.0 / 100, Elo +115.2 ± 67.0
  (`…2409cec9`). Its mate-floor red was traced per part, to history's negative cells through LMR, and fixed
  structurally (K3, `…6c6fb0be`).

**B1. When a bundle is allowed.** Each part is a value-changing change with its own ADR or design page, and the parts
are related in at least one of these ways:
- (a) **they share a file**, so they would go one at a time anyway (the tickets' "one at a time" lines);
- (b) **they share a mechanism:** one part consumes another's output (history → move-count pruning, countermove), or
  they share one computation and its cost (one attack map, one tuning fit);
- (c) **a part is parked or marginal** (its pay gate is not met alone, or its value is below C2′'s ± 48), and it is
  coupled by (a) or (b) to a part in the bundle.

Not allowed:
- **A value-identical part.** It keeps its own identity and S2 bars, plays no games, and lands on its own.
- **Unrelated parts bundled to save host time.** The relation is stated in the design note before the PREREG.
- **A part whose own bar is a deep-depth bar the 100 ms read cannot see**, unless that bar is graded in the bundle too
  (B2 (d)).

**B2. What each part still shows alone** (before the read, on the bundle's branch):
- (a) **Its own door:** a test-only off-door pair (`ADR-0026` d10), and its own rule rows.
- (b) **The all-off door is node-identical to `main`,** exactly (P0). Every older door turns every part off.
- (c) **Its form is its ADR's, fixed before the build.** No form, margin or table is chosen or re-tuned after the read.
- (d) **Its own measured bar, where its ADR has one.** For a NEUTRAL (invisible at 100 ms) part, that is C2′'s "C yes"
  bar. A part's own pay gate is graded, unless the owner's word or that part's own named re-open trigger lifts it (the
  fourth guard). Then the ratio is reported per part.
- (e) **The cost rows are read with all parts on:** `G2`, `G6` and `NFR-008`. Each part's node ratio is reported.

**B3. The safety rows: all on, then per part on a red.**
- **The mate floor, zugzwang 7 / 7 and `G1`** (`ADR-0064` d7's rows) are read with every part on.
- **When one goes red,** it is read again with each part's own door (that part off, the others on). The cause is named
  before any fix.
  - If no single door clears it, the cause is joint: a STOP to Architect/Design.
  - A fix is structural, written as a dated line in that part's ADR (`ABC-283`'s K3). It is never a re-pin, a deeper
    depth or a tune.
  - After the fix, every safety row is read again with all parts on.

**B4. The read: one, pre-registered, never re-played.**
- **One C2′ read** (100 games at 100 ms), the bundle with all parts on against its merge-base on `main`. S′ and the
  Levels deep lane follow as C2′ has them, unless the owner's word for that bundle says otherwise (`ABC-283` § Open).
- **The PREREG is sealed first.** It names the parts, the candidate and base SHAs, the control, the intent and the
  bar. The intent is GAIN, unless every part qualifies as NEUTRAL (invisible at 100 ms).
- **It is never re-played.** No part is dropped and no subset is read in its place, before the read or after it.
- *Dated 2026-11-05 (`arch-owner-answers-1105`; his word `…b836b85c`, "2. yes"):* **for `ABC-303` only, a new C2′ after a candidate
  fault that could have decided the verdict is not a re-play.** The form is CF1–CF10 in the dated block of that task, below.
  For every other read this line stands as written.
  *Dated 2026-11-05 (`arch-owner-answers-1105b`; his word `…0f1ab02e`, "1. yes"):* **"for `ABC-303` only" is widened.** The dated line above now holds for every later
  bundle read that task's dated block, below, reaches.
- **Before the merge,** `main` is merged into the branch, with no rewrite. The deterministic rows (P0, the safety rows,
  the gates, `NFR-008`) are read again on the merged tree, as `QE-283-i` did. Games are re-run only under C2′'s stale
  rule.

**B5. Credit and attribution.**
- **Credit is to the bundle, not per part.** It counts as one value-changing merge in `EPIC-011`'s G3 and is one
  suspect in a C3″ NOT MET. No per-part Elo is stated or inferred from the read.
- **Each part's ADR is accepted as part of the bundle.** Its Status line names the bundle ticket and the read.
- **Removing one part later** is a value change, and it gets its own read.

**B6. On a miss.**
- **NOT MET:** nothing merges, and each part returns to the status it held before (parked, held or PROPOSED). QE
  records a `failed-attempt` naming the bundle.
- **No re-play, and no subset is read instead.** The same parts with the same forms count as the same bundle.
- **A part comes back only as a new attempt,** alone on its own premise or in a changed bundle under a new PREREG. A
  part that only re-opens a not-met premise needs the owner's word, or its own named trigger.
- **A red row before the read** (B2 or B3) is a defect or a STOP, not a miss. The read does not start until every row
  is met.
- *Dated 2026-11-05 (`arch-owner-answers-1105`):* **for `ABC-303` only, this section is read through CF1–CF10** (the dated block
  below). A fixed tree under CF4 is not a new attempt and does not need this section's route back.
  *Dated 2026-11-05 (`arch-owner-answers-1105b`; his word `…0f1ab02e`, "1. yes"):* the same widening, to every later bundle read that task's dated block, below, reaches.

**B7. Who names a bundle.** While PROPOSED, the owner names it. After acceptance, the Architect's design note names
the parts and shows B1's relation. BA/PM cuts one ticket in `ABC-283`'s form, with the parts' pages kept as design
pages, and the Orchestrator orders it.

**Candidate bundles in the backlog** (recommendations; the owner names any he wants while this is PROPOSED):
1. **`ABC-286` (P4) + `ABC-288` (O2c), over history, after `ABC-283` merges.** Both act on the history-ordered quiet
   list, and O2c changes the order P4 prunes by. Read apart, P4's drift and audit rows would be read on an order that
   O2c then moves. They share `orderMoves` / `src/search.ts`, and P4 is the parked part (B1 (c)). P4's joint probe
   (`ADR-0063` decision 11) is its own named trigger. The mate floor is the row to watch (`R-283-LMR`).
2. **`ABC-290` (E3b, king attack) + `ABC-293` (E6, threats and tempo).** Both need attacked squares, so one attack-map
   pass pays for both, and its cost is read once. Both land as structure at 0 and are fitted by the pull after the
   second.
3. **The pull after the second, over every structure-at-0 term on `main` at its fit** (E3b, E4b, E5, E6: `ABC-290`
   –`ABC-293`). The tuner fits them jointly anyway, as the second pull judges E4a with its own fit (`ADR-0070` d7).
   This rule supplies the credit line and the per-part read on a red: one part's weights at 0 inside
   `withParametersForTest`.
4. **Later, conditional: `ABC-272` (E7a) + `ABC-294` (E7b),** if `ABC-272`'s probe says E7a builds the scale seam E7b
   uses (a shared mechanism).

*Dated 2026-11-05 (`arch-owner-answers-1105`; his word `…b836b85c`, "3. wait"):* items 2 and 3 above read on a pull that no longer
stands behind them. Item 3 has no pull until a third is asked for. Item 2's "structure at 0" is superseded. `ABC-290` + `ABC-293` as
a hand-valued bundle stays lawful under B1, but it would not open `ADR-0067`'s third-pull door, and CF1–CF10 would not reach it
without his word (the dated block below).
*Dated 2026-11-05 (`arch-owner-answers-1105b`; his word `…0f1ab02e`, "1. yes; 2. yes"):* both halves of that last clause are answered. A term
merged in such a bundle meets the third-pull trigger, and CF1–CF10 reach its read.

Not recommended as bundles:
- `ABC-284` (P1) stays apart from bundle 1. It moves LMR, the lever the mate floor rests on (`R-283-LMR`), so it is
  read alone to keep that row attributable.
- `ABC-285` (P5): about 0 at 100 ms, and its bar is a deep-depth one.
- `ABC-287` (P6): its re-measure on the second pull's `main` comes first, on safety rows it failed alone.
- `ABC-289` (Q2): alone on `src/quiescence.ts`.
- `ABC-296` / `ABC-297` (X1 / X2): X2's premise probe comes first.
- `ABC-298` (V3): value-identical.
- `ABC-282` (W1): its own clock read (`ADR-0071`).
- The second pull (`ABC-301`): its scope and B-T8 are owner-confirmed as they stand.

#### Dated 2026-11-04 (`arch-owner-answers-1104b`, records only at `main` `65e28f95`; his word `…3e73f9f9`): bundle 1's read, row by row, and its order against `ABC-289`

His answer, verbatim: *"1. Bundle 1: (a)"*. He overrode both missed premises, `ABC-286`'s L2 (drift and audit) and
`ABC-288`'s CH3, and named the forms: P4 M3 and the countermove C1. **No line of B1–B7 changes.** This block rules what
the override leaves. The SE and QE briefs copy these rows and add none. PREREG `…aa5c4dc1` stays as sealed. The shape QE
fills is `arch-owner-answers-1104b` `…d776c0f0`.

**The doors.** All on is the shipped `search()` / `chooseMove`. The all-off door is `searchWithoutQuietBundle` /
`chooseMoveWithoutQuietBundle`. P4's own door is `searchWithoutMoveCountPruning` / `chooseMoveWithoutMoveCountPruning`.
O2c's own door is `searchWithoutCountermove` / `chooseMoveWithoutCountermove`. A row is read all on unless it names a door.
Four-figure ratios run `search()` kiwipete, `chooseMove` kiwipete, `search()` position-6, `chooseMove` position-6. Figures
are the probe's, on `0cc9afd1`.

**Table 1: the safety bars.** Graded. Read all on, and per part only on a red (B3).

| # | row | bar | on `0cc9afd1` |
|---|---|---|---|
| S1 | all-off identity (P0, B2 (b)): the all-off door against the merge-base, kiwipete and position-6, d6–d8, both recursions | nodes, score and move equal, exactly | d8 523 847 / 234 214 (`search()`), 707 548 / 101 425 (`chooseMove`) |
| S2 | every older door, node-equal to itself (`G4`) | exact | as pinned |
| S3 | the mate floor at the same depth on the 287, door to head: PREREG rows B1, B2 and every B3 row | 0 violations on each | 0 / 191; 0 / 189; 0 / 190, 189, 190, 189, 163; 0 / 188 |
| S4 | zugzwang, `ADR-0050` d9's seven rows | 7 / 7 at recorded depths, none re-pinned | 7 / 7 |
| S5 | `G1` | ≥ 54 / 58, none newly missed | 54 / 58 |
| S6 | mate sign changes in the drift rows, depth 5 on the 190, both recursions: all on, and on each part's own door | 0 | 0 |
| S7 | O2c's drift, CH2, on O2c's own door, both recursions | ≥ 95 % within 25 cp, none beyond 25 cp | 100 %, 9 / 100 %, 4 |

**Table 2: the part bars and gates.** Graded, on the branch, before the read.

| # | row | bar | on `0cc9afd1` |
|---|---|---|---|
| P1 | each part's door pair and rule rows (B2 (a)) | present and green | not built |
| P2 | the forms (B2 (c)) | M3 and C1 as `ADR-0072` d1–d3 and `ADR-0073` d1–d6 state them | fixed |
| P3 | L4 (a), d8 on P4's own door | ≤ **0.89 ×** on each of the four | 0.6039 / 0.8170 / 0.7509 / 0.8363 |
| P4 | L4 (b), reach at 47 000 on P4's own door | ≥ door + **0.10** | +0.116 |
| P5 | CH1, `NFR-009` | the table reads 3 072 bytes | 3 072 |
| P6 | `G6`, all on | "≥ base" by the median, every run ≥ depth 6 | not read |
| P7 | `NFR-008`, all on | the graded median ≤ 10 s, and **≤ +0.10 s for the bundle as a whole**, head minus base | not read |
| P8 | typecheck, lint, build, the skip count, the run rule's `-t` lines | as the gates state them | not read |

**Table 3: reported only.** Read on the build and printed beside the figure on `0cc9afd1`. No verdict rides on them.

| # | row | read on | on `0cc9afd1` |
|---|---|---|---|
| R1 | L2 drift share and cap, depth 5 on the 190, both recursions | P4's own door, and all on | 93.58 %, 80 cp / 94.12 %, 79 cp, on each |
| R2 | L2 audit: flips, and errors ≥ 200, ≥ 300, ≥ 500 cp, `ADR-0061` d8 (d)'s sample | P4's own door | 288 of 1 886 (15.27 %); 29, 9, 0 |
| R3 | CH3, d8 | O2c's own door; O2c alone over the all-off door | 1.0031 / 0.9999 / 1.0935 / 0.9989; 0.9848 / 0.9922 / 0.9298 / 1.1190 |
| R4 | `chooseMove` d6 on the 287 (PREREG R1), and `krk` | all on | 0 / 209; 0 / 17, 17, 29 |
| R5 | `G2` (door / head) | all on | 0.9921 / 1.0537, mean 1.0229 |
| R6 | d8 and reach against `main`; the firing figures; O2c's and P4's node ratios (B2 (e)) | all on | 0.5947 / 0.8106 / 0.6982 / 0.9358; +0.148; P4 fires at 5.91 nodes per 1 000 |
| R7 | the head's counts, an instrument check | all on | d8 311 546 / 163 523 (`search()`), 573 518 / 94 911 (`chooseMove`); reach 7.016 |

**The read.** One C2′, 100 games at 100 ms, all on against the merge-base, **GAIN ≥ 50.0 / 100**, with 100 of 100 complete,
0 candidate faults and 0 losses on time. Never re-played, no subset. Then **S′ at E 1 810, a bar:** S-1, S-2 and S-4 (≥ 3.0
of 10; below that, 10 more games and ≥ 7.0 of 20). Then **the Levels deep lane, a bar:** exit 0, every test passed.

**The rows ruled here** (each was open on the records):
- **S6, a bar.** The owner overrode what was missed. L2's third clause, 0 mate sign changes, was met on every form, so it
  stands.
- **S7, a bar.** `ADR-0073` d10 sets it and CH2 was met. OQ-0073-1 lifted CH3 and nothing else. L2's override is P4's, so
  it does not reach O2c's own door.
- **P3 and P4, bars.** Only L2 was overridden. L4 was met and stays graded (`ADR-0072` d8 (d)). Its reach margin is thin:
  +0.116 against +0.10.
- **R4, reports.** `ADR-0072` d9's "every row of Step C" reads as B1, B2 and the B3 rows. The sealed PREREG calls R1 and
  `krk` reports, says no bar is new, and `ADR-0060` § Status keeps d6 a report.
- **S′, a bar.** B4 says S′ follows as C2′ has it unless the owner's word for that bundle says otherwise, and his word here
  does not. `ABC-283`'s "information only" was that ticket's ruling (`…3851bf43` 1) and does not carry. `ADR-0072` F4 reads a
  collapse as NOT MET.
- **P6, a bar.** `Q-3K-4` (b) covers evaluation tickets only, and `…3851bf43` 3 bound `ABC-283` alone.
- **R5, a report.** `ADR-0072` § Consequences says so, and no ADR sets a `G2` bar for this bundle.
- **B1's deep-depth exclusion does not bite on O2c.** CH3 is ungraded by the owner's word, the route B2 (d) names, and the
  rule fires at 100 ms.

**What "reported" means for R1 and R2.** `ADR-0072` d8 (d) has them reproduced to the count.
- **On a base whose production `src/` equals `0cc9afd1`'s,** a count that differs is a defect in the wiring (`ADR-0072` F2),
  explained before anything else is read.
- **On a moved base,** the same rows are read on the new base and both sets go in the PR, with the merge that moved them
  named. A re-derived count is a dated line in `ADR-0072`, never a moved bar.
- **There is no ceiling.** His word is on the form, not on a figure, and a bar added now would be a new bar after a read.
  So a worse R1 or R2 stops nobody. It goes in the Software Engineer's hand-off, before QE seals its PREREG. Whether a
  figure far from the one he was shown goes back to him is the Orchestrator's call, not the SE's or QE's.
- **The audit has no hook in the build.** It is read on a scratch copy of the built tree, in the shape of
  `arch-bundle-1`'s `raw/probe/` audit mode, with nothing committed to `src/` or `tools/`. The SE reads R1 and R2, and QE
  re-reads them with its own driver.

**A red, by row.**
- **S1, S2, P1, P2, P5:** a defect in the wiring, back to the Software Engineer.
- **S3–S7:** B3. Read per part, name the cause; a structural dated line in that part's ADR; every safety row again. If no
  single door clears it, a STOP to Architect/Design. **The lever is LMR (`R-283-LMR`), not history, T or another form.**
- **P3, P4, P6 on an exact build:** a STOP to Architect/Design (B6: a red before the read is a STOP, not a miss). The
  override does not reach them. Any lift is the owner's word.
- **P7:** a row move first (`…f30bd604` 2).
- **C2′ below 50.0, or an S′ collapse:** NOT MET, B6. **A fault, a loss on time or a Levels red:** a defect.

**The order against `ABC-289`. Bundle 1 reads first. `ABC-289` reads alone, after it.** This confirms the Orchestrator's
`…085f647c` 5, now with the reason.
- **`ABC-289` is not in the bundle.** The owner named the parts, and this section's list keeps Q2 apart. It has its own
  PREREG, its own C2′ and its own bars (`ADR-0074` d11–d13).
- **Its base.** It reads against whatever `main` is when it is built. If bundle 1 merged, its base carries the bundle, so it
  reads on top of it and the candidate differs from the base by Q2 alone. If bundle 1 was NOT MET, it reads on `main`
  without the bundle, on the figures `ADR-0074` records.
- **Its build** starts when bundle 1's merge or `failed-attempt` is recorded, not before. Both edit every door and both
  `Switches` records (`ADR-0074` § Consequences), so they go one at a time. `…5ec6c124` 3's hold ended with his answers; this
  order replaces it.
- **Why not side by side.** Two reads on one base cannot both stand. The first merge makes the second stale, so the second is
  read on top of the first either way. Only the order is open.
- **Why the bundle goes first:**
  1. **Its pay bar has the least room.** P4's reach is +0.116 against +0.10; `ABC-289`'s is +0.279 against +0.15, and its d8
     0.8263 against 0.88. A pruning rule read over another has lost pay before: P4 fell from +0.34–0.50 to +0.116 with
     futility in force (`ADR-0072` § Context). Reading P4 first keeps it on the tree it was measured on.
  2. **The override rests on figures read without Q2.** Read first, R1 and R2 stay comparable with what he was shown.
  3. **A joint red has one door.** Whichever goes second carries the first tree with P4 and Q2 both on. With `ABC-289`
     second, a floor red is read with one door, `…WithoutDeltaPruning`. The other way round it needs per-part reads on a
     floor `R-283-LMR` calls order-sensitive.
- **What it costs.** The one premise that was met waits behind two that were not. And `ADR-0074` d11's drift bars are tight
  by rule (≤ 30 cp from a reading of 20) and would be read on a tree with P4 in it. If one trips, `ADR-0074` F1 governs and
  no bar moves.
- **What the records do not settle.** No probe has had P4 and Q2 both on. Reason 1 is reasoned from margins and one
  precedent, not measured, so the joint effect on either ticket's pay and drift is `UNKNOWN - verify`.
- **The lane does not set the order.** Each budget of ≤ +0.10 s is head minus base on its own base, so the sum is the same
  either way. The census ask with `ABC-289` is about −0.38 s: `…085f647c` 2's "more" worked out on `…f30bd604` 3's −0.28 s
  target, an estimate. Whether the rows exist is `UNKNOWN - verify` until the census reads.
- **Both orders' re-reads.** Whichever lands second carries the first's instrument re-read, `ADR-0072` d9 or `ADR-0074` d12.
  The slots against `ABC-282` and `ABC-301` stay the Orchestrator's.
- *Dated 2026-11-06 (`arch-records-1106`, records only at `main` `8e115110`; for `ABC-289`'s NOT MET):* **the order ran, and the cost
  it named came.** Bundle 1 read first and merged at `434fa171`. `ABC-289` built on it and read red before any game (`…7c297147`).
  Drift read 34 cp against ≤ 30, so `ADR-0074` F1 governed and no bar moved, as "What it costs" says. `G1` also read red, under F7,
  which that line did not name. "No probe has had P4 and Q2 both on" is now read once, on `b42706b3`: both reds are P4 with Q2
  (`…d61479af`). The pay half stays as `…7c297147` § 1 leaves it. `ABC-289`'s read is not played, and the later terms' reads no longer
  wait on it (`ADR-0075`'s Order line). If the owner opens a route on OQ-0074-2, it is ordered against `ABC-291`'s read then. This
  block's reasons stand as written.
  *Dated 2026-11-07 (`arch-ABC-291-closed`):* `ABC-291`'s read is played and closed, NOT MET, so it went first. A route on OQ-0074-2, if he opens one, is ordered against the next read then.

#### Dated 2026-11-04 (`arch-ABC-303-open`, records only at `main` `c118a5cf`): `ABC-303` § Open 1 and 2, and the moved base. No bar moves

**1. A candidate fault against "never re-played" (`ABC-303` § Open 1).** The records left this open. C-1 and C-2 pass the
candidate only at 0 faults and 0 losses on time. The block above calls either "a defect", beside NOT MET. B4 says never
re-played, and `…d776c0f0` § 6 has no candidate-fault line. What "never re-played" guards is a second draw after a score is
seen, so that is what these lines keep shut. They are sealed before the read, and QE copies them into its PREREG's § 6. They
add no bar.
- **A candidate fault or a candidate loss on time ends that read with no pass, at any score.** Its score is not kept, high or
  low.
- **The verdict test comes first.** Count each game the candidate lost by fault or on time as a win for it. If the read
  still misses its bar (C2′: 50.0; S′: S-4), the fault did not decide it. That is NOT MET, final, B6, and the defect is routed
  as well.
- **Otherwise it is a defect, with no verdict.** The Software Engineer names and reproduces the cause, and fixes it. No form,
  T, tier or door moves (row P2). Tables 1 and 2 are read again.
- **Then one new C2′,** on the fixed candidate, under a new PREREG with the same bars. It is final. It is not a re-play: the
  first read returned no verdict, and this is another tree. A second candidate fault is NOT MET, B6.
- **A cause nobody can reproduce** is a STOP to Architect/Design, with no new read.
- **C2′ clean and MET, then an S′ fault or loss on time, or a Levels red.** A Levels red is read first by `ADR-0028`, as
  `ADR-0064` d7 has it: the fixture, then one headroom, then the owner.
  - **The fix is value-identical:** test or fixture only; or it reads no clock, and nodes, score and move stay equal on S1, S2
    and R7. C2′ stands and is not played again.
  - **Any other fix:** C2′ read another engine, so it does not stand. One new C2′ as above, final even if it lands lower.
  - Either way the red part runs again, whole and once, on the fixed candidate: S′ by the verdict test above, Levels at exit 0.
- **Unchanged:** a base fault is UNRESOLVED, re-run once. A harness error before the first game is not a read. Below 50.0 and an
  S′ collapse are NOT MET.
- **The weak point, stated.** B6's "the same parts with the same forms count as the same bundle" sits under "on a miss", and
  this reading rests on a fault not being a miss. **If the Orchestrator reads the new C2′ as crossing B4, that line is the
  owner's question.** Until he answers, the strict reading holds: a candidate fault closes the read unpassed, and B6 governs
  the return.
  *Dated 2026-11-05 (`arch-owner-answers-1105`): answered. He said yes to the new C2′ (`…b836b85c`). The strict reading is gone for
  `ABC-303`, and this item's lines are replaced as its form by CF1–CF10 in the dated block below.*

**2. S′'s E (`ABC-303` § Open 2).** E is a setting and the bar is S-1, S-2 and S-4, so the block's 1 810 is the value in force
at its writing, not a level.
- **QE fills § 6's blank with the E in force at the seal,** by S′'s rule. Today that is 1 810.
- **The pool has reached 30 games, and no step fires.** `ABC-269` 7 / 3 / 0, `ABC-279` 5 / 4 / 1, `ABC-283` 6 / 4 / 0: all merged, all at
  E 1 810, 18.5 / 30 = 61.7 %, inside 60–85 %. This line is the trigger's first read. `ABC-283`'s S′ was information for its
  own bars and still pools: a merged build, at this E.
- **The lower edge is close.** At 40 games, a next merged S′ below 5.5 / 10 leaves the band. 5.0 gives 23.5 / 40 = 58.8 %,
  so E′ = 1 700 by the rule. That step is the owner's question, and without his word E stays 1 810. The upper edge cannot fire
  at 40 games.
  *Dated 2026-11-06 (`arch-records-1106`; `…28283e48` § 5): superseded by the read. `ABC-303`'s S′ merged at 9 / 1 / 0, 9.0 / 10, so the
  lower edge did not bite. The pool reads 27.5 / 40 = 68.75 %, inside 60–85 %, X = +137.0. This is the 40-game trigger read: no step
  fires, no owner question arises, and E stays 1 810. `ABC-289` adds no S′, so `ABC-291` seals at 1 810.*
  *Dated 2026-11-07 (`arch-ABC-291-closed`): `ABC-291` sealed at 1 810 and played no S′ (`…a207a827` § 5, `…ef659beb`). Nothing pools: 27.5 / 40 stands, no step fires, and the next read seals at 1 810.*
- **A step before the seal** is a dated line here, which then governs, and a dated line on `ABC-303`'s page (BA/PM).
- **A step after the seal does not reach this read.** It plays at the sealed E. An S′ at a superseded E does not pool.

**3. The block's reasons on a base moved by `ABC-301`.** The order stands: no cause is shown. A fit lands under `ABC-289`'s read
as much as under this one, so a moved base favours neither order. Two sentences narrow.
- **Reason 1** keeps its point, the least room. "Keeps it on the tree it was measured on" no longer holds after a fit, either way.
  What bundle-first still keeps is P4 read with no other pruning rule over it, and the precedent (futility) was one pruning rule
  over another. A fit is not one. Whether +0.116 survives a fitted evaluation is `UNKNOWN - verify`: no probe has read it.
- **Reason 2** narrows the same way. R1 and R2 will differ from what he was shown by the fit. Read first, they differ by that one
  named merge, not by the fit and Q2 together, and `…3c67d3c4` 4 sends them to the Orchestrator before the seal.
- **Reason 3** reads no base and stands.
- **The one change of practice:** the hop that brings R1 and R2 on the new base also brings P3 and P4. They are table rows read
  on that tree anyway, reach has the thinnest margin, and a red there is a STOP, cheapest before the seal. A lift stays the
  owner's word.

#### Dated 2026-11-05 (`arch-owner-answers-1105`, records only at `main` `a44aa057`; his word `…b836b85c`, verbatim "2. yes"): a new C2′ after a candidate fault, for `ABC-303`. No bar moves

His answer takes the strict reading's place for `ABC-303`. A read that a candidate fault could have decided gets one new read on
the fixed tree. CF1–CF10 below are the form.

*Dated 2026-11-05 (`arch-owner-answers-1105b`; his word `…0f1ab02e`):* CF1–CF10's words stand. Their reach is widened and CF7 is owner-accepted: the next
dated block.

**What QE copies.** QE copies CF1–CF10 word for word into § 6 of `…d776c0f0`'s shape, after § 6 item 3, in every `ABC-303`
PREREG. There is no blank in them. § 6's "A fault or a loss on time is a defect" and "A failure is a defect" are read through them.
`…d776c0f0` is sealed and is not rewritten; "QE changes no line outside a blank" does not stop this copy, because the block
governs that shape.

*Dated 2026-11-06 (`arch-ABC-303-load`):* QE also copies FL after CF10: the dated block of that task, at the end of D5. CF1–CF10's words do not change.

- **CF1. What ends a read.** A candidate fault or a candidate loss on time in C2′ or S′ ends that read with no pass, at any score.
  The match plays out as the harness runs it. Its score is used for CF2 and for nothing else.
- **CF2. The verdict test comes first.** Count each game the candidate lost by fault or on time, and each game not finished, as a
  win for it.
  - **C2′:** below 50.0, the fault could not have changed the verdict: NOT MET, final, B6, and the defect is routed as well. At 50.0
    or above, a read that already scored above the bar included, the fault could have decided it: CF3.
  - **S′, S-4 read whole:** at 3.0 of 10 or above: CF3. Below 3.0 of 10, S-4's 10 more games are played and the same count is
    taken on the 20: below 7.0, NOT MET, final, B6; at 7.0 or above, CF3.
- **CF3. A defect, no verdict.** The Software Engineer names and reproduces the cause, and fixes it. **Nothing is tuned between
  reads:** no form, T, tier, door, margin or table moves (row P2). Tables 1 and 2 are read again. A cause nobody can reproduce is a
  STOP to Architect/Design, with no new read.
- **CF4. One new read on the fixed tree.** One new C2′ under a new PREREG with the same bars, then S′ and the Levels lane in § 6's
  order. It is final. It is not a re-play: the first read returned no verdict, and this is another tree.
- **CF5. A clean low score stays final.** C2′ below 50.0, or S′ below S-4, with 0 candidate faults and 0 losses on time on that
  read: NOT MET, B6. No new read.
- **CF6. A clean C2′, then a faulted S′.** C2′ is clean and MET, and CF2 sends the S′ to CF3.
  - **The fix is value-identical:** test or fixture only; or it reads no clock and nodes, score and move stay equal on S1, S2 and R7.
    C2′ stands and is not played again. Only the faulted S′ is replayed, whole and once, at the sealed E, under an addendum sealed
    first that names the fixed tree.
  - **Any other fix:** C2′ read another engine, so it does not stand. CF4's one new read, final even if it lands lower.
- **CF7. A clean C2′, then a Levels red.** The red is read first by `ADR-0028`, as `ADR-0064` d7 has it: the fixture, then one
  headroom, then the owner. If a fix follows, CF6's two cases apply, with the Levels lane run again, whole and once, at exit 0, in
  place of S′.
- **CF8. A second candidate fault is NOT MET.** A candidate fault or loss on time on any read after a fix (CF4's new C2′ or its S′,
  or the replayed S′) is NOT MET, B6, at any score. No verdict test and no third read. Several faults in one read are one
  event.
- **CF9. Unchanged.** A base fault is UNRESOLVED, re-run once. A harness error before the first game is not a read. C2′'s stale
  rule stands.
- **CF10. Anything else.** A case these lines do not name is a STOP to Architect/Design. No brief decides it.

**Which lines are his.** The Orchestrator's record of what he accepted is `…b836b85c` item 2. The text of the question is not on the
records, only "as put to him".
- **In that note:** one new read on the fixed tree (CF4), only if the fault could have decided (CF2); a fault that could not have
  changed it leaves NOT MET final (CF2); a second candidate fault is NOT MET (CF8); nothing tuned between reads (CF3); a clean low
  score stays final (CF5); a clean C2′ stands after a value-identical fix with only the faulted S′ replayed (CF6); the answer
  reaches any read not yet sealed.
- **Carried from `arch-ABC-303-open`'s block, not in that note:** a loss on time beside a fault; the count that makes the verdict
  test; the STOP on a cause nobody can reproduce; CF6's second case; CF7. Each is the block's line, and none contradicts the note.
  CF7 is the widest of these: the note names S′ alone. A Levels re-run has no score to draw again, so it is not what "never
  re-played" guards.
  *Dated 2026-11-05 (`arch-owner-answers-1105b`; his word `…0f1ab02e`, "3. yes"):* **CF7 is owner-accepted and leaves this list.** Its second case
  stays here as CF6's: the next dated block, item 3.
- **New here, the Architect's reading, so that no brief must judge:** games not finished in the count; S-4 read whole in CF2,
  because the block's "S′: S-4" did not say what a fault in a two-stage bar does; "several faults are one event"; the addendum
  in CF6; CF10. None adds a bar.

**How far it reaches.**
*Dated 2026-11-05 (`arch-owner-answers-1105b`; his word `…0f1ab02e`, "1. yes"):* **"Across tickets: `ABC-303` only" below is superseded, with its first sub-line, and the
question its last sub-line owed is answered.** The next dated block gives the reach. "In time" and the A4 sub-line stand.

- **In time: every `ABC-303` read not yet sealed.** No `ABC-303` PREREG is sealed today: no `qe-ABC-303` record exists on any local
  branch at this hop. So the first read and any CF4 read carry this form. Both of BA/PM's open points (`…4843d1f2` 1 and 2) are
  answered: the clean C2′ line stands as CF6, and no sealed read exists for the answer to miss.
- **Across tickets: `ABC-303` only.** His verbatim word is "2. yes". The Orchestrator's restatement names no bundle rule, no B4 and
  no "every". Its "any read not yet sealed" answers a question about timing: BA/PM's point was whether an answer "after QE's seal"
  reaches "this read". The chain that sent it to him is `ABC-303`'s (§ Open 1, `…681c6363` 2), and the form names `ABC-303`'s rows.
  B4 is a rule he accepted, so widening it needs his word and not a reading of silence.
  - **So B4 and B6 stand as written for every later bundle,** and the strict reading holds there: a candidate fault closes the read
    unpassed. `ABC-289` and the term reads of `ADR-0067`'s wait are plain C2′ reads, on C-1 as written.
  - **It does not reach `ABC-282`'s A4,** which is neither a C2′ nor a bundle read. That read has its own miss rule (F5), and
    "A6 is not re-played" stands (`…b836b85c` 1).
  - **If the question as put to him named every bundle read,** the Orchestrator holds that text. One dated line here then widens
    this, with CF's row names re-stated per bundle. Otherwise it is one question for him, owed before the next PREREG that is not
    `ABC-303`'s, which is `ABC-289`'s.

#### Dated 2026-11-05 (`arch-owner-answers-1105b`, records only at `main` `6ff2554e`; his word `…0f1ab02e`, verbatim "1. yes; 2. yes; 3. yes"): CF1–CF10 reach later C2′ reads. CF7 is owner-accepted. A bundle term meets the third-pull trigger. No bar moves

CF1–CF10's words do not change, so `ABC-303`'s form stands as written and needs nothing below. This block says which other reads
carry them and how their `ABC-303` names read there.

**1. Which reads.** The Orchestrator's record of his answer: the fault rule "also covers later reads, 'like delta pruning and the new
terms'", and "CF1-CF10 widen from ABC-303 to later single-read reads and bundles". QE copies this line word for word, above CF1, in
the PREREG of every read it names:

> **Reach.** CF1–CF10 govern this read. It is a C2′ read of one change or of a bundle, with the S′ and the Levels lane that follow it,
> and this PREREG is sealed after the owner's word `…0f1ab02e` of 2026-11-05. The `ABC-303` names in those lines read as the table
> below says.

- **Reached:** `ABC-289` (delta pruning) on its own read. E3b, E4b, E5 and E6 (`ABC-290`–`ABC-293`) on hand values, alone or in a
  bundle. Every other strength-changing ticket or bundle that plays C2′ from now on, on either intent, `ABC-272` among them. No `qe-`
  context for `ABC-303`, `ABC-289`, `ABC-290`–`ABC-294` or `ABC-272` exists on any local branch at this hop, so no such PREREG needs
  re-sealing.
- **Not reached:**
  - **`ABC-282`.** A4 is not a C2′ read, and its miss rule is F5. A6 is played, and "A6 is not re-played" stands (`…b836b85c` 1).
  - **Every read that is not a C2′ read.** C3″, with the S′ and the lanes run beside it, the milestone reads R1–R3, B-T8 and the 40/15
    claim each keep their own validity line. A value-identical ticket plays no games.
  - **A closed read.** A read with a recorded verdict or `failed-attempt` is not re-opened. "Later" is his word.

**2. A single-part read: which lines adapt.** The rule does not change, but six phrases in the lines were written for `ABC-303`. QE
copies CF1–CF10 unaltered, then this table with the third column filled from the ticket's page and ADR. The table adds no bar. A name QE cannot fill is a STOP to Architect/Design before the seal (CF10).

| the words | in | on any read but `ABC-303`'s, they read |
|---|---|---|
| "50.0" | CF2, CF5 | the read's C-3 bar as sealed: 50.0 for GAIN, 43.0 for NEUTRAL |
| "B6" | CF2, CF5, CF8 | a bundle: B6. One change: C2′'s miss line: NOT MET, nothing merges, QE records a `failed-attempt`, and the ticket goes back to BA/PM |
| "no form, T, tier, door, margin or table moves (row P2)" | CF3 | no form, value, threshold, door, margin or table that the ticket's ADR fixed moves. For a hand-valued term that is every value |
| "Tables 1 and 2" | CF3 | every graded row the PREREG reads before the first game |
| "§ 6's order" | CF4 | the PREREG's order: C2′, then S′, then the Levels lane |
| "S1, S2 and R7" | CF6, and CF7 through it | the off-door against the merge-base, every older door, and the head's counts on the ticket's instrument. `ABC-289`: `…WithoutDeltaPruning`, the older doors, `ADR-0074` d12's instrument check. A change with no door: the head's counts alone, on rows its ADR names |

- **No change:** CF1, CF9 and CF10. CF7 changes only through CF6, and CF8 only by "B6". CF2's 3.0 of 10 and 7.0 of 20 are S-4 on every read, and "the sealed
  E" is the E in force at that read's seal.
- **Where it goes.** After the line that states the Levels lane. `…d776c0f0` is bundle 1's shape, so no other PREREG has its § 6. Any
  line there reading "a fault is a defect" is read through CF1–CF10.
- **NEUTRAL (the Architect's reading).** A miss on the ticket's own measured bar is NOT MET whatever CF2 reads. It is not read on the
  games, so no game's fault could have decided it.
- **A later bundle.** The same table. B4's "no part is dropped and no subset" holds through CF3 and CF4: a new read carries every part
  in its form, all on. B3 still governs a safety red.
- **What stays.** C-1, C-2 and C-3 are the bars. "Never re-played" still shuts a second draw after a clean score: CF5. `ADR-0074` d13's
  "not re-played" speaks of a miss, which a read closed by CF3 is not. It takes C2′ by reference, so it needs no line.

**3. CF7.** The Orchestrator's record: "CF7 is confirmed: a clean C2' stands when the Levels test then fails and the fix does not change
play." It leaves the carried list.
- That sentence is CF7's first case, and "does not change play" is CF6's value-identical test.
- CF7's second case, a fix that does change play, is not in the sentence. It is CF6's second case, which stays on the carried list. It
  leads only to CF4's one new read.
- His "1. yes" widens CF1–CF10 by name. I read that as their reach. It does not move any other line of `arch-owner-answers-1105`'s
  sorted list, so those lines keep their labels and still bind as the block's lines.

**4. The bundle term.** A term merged inside a bundle meets `ADR-0067`'s third-pull trigger. That ADR's dated line of this task reads the
four tests for it. B5 stands: the door reads a merge, not a credit, and no per-part Elo follows from it. The default does not move.
The next terms go on their own reads (`…b836b85c` 3) in D6's order, and a bundle stays what B1 and B7 allow.

**Not settled by the records.**
- **A third pull's C2′.** It is a C2′ read, so his restatement's words take it in, but his examples do not name it. No such read exists,
  and none can without a new word from him. CF4's second read has not been set against test 4's "one fit" or F6. That goes to
  Architect/Design with any such word (CF10). It is not ruled here.
- **The question as put to him.** Its verbatim text is not on the records, only his "yes" and the Orchestrator's restatement. Item 1's
  reach rests on that restatement.

#### Dated 2026-11-06 (`arch-ABC-303-load`, records only at `main` `b716d86c`; CF10, on QE's stop `…b59650bc`): foreign load during C2′ and S′. No bar moves, and no word of CF1–CF10 moves

QE stopped before `ABC-303`'s first game (`…53858301` § 0, H1): the records do not say what foreign load does to a game read. This
block answers for that read and every later C2′. It was written before any game, and no score exists.

**The reading.** Foreign load is a condition of the host, not a case of its own. C-1 to C-3, S′'s bars and CF1–CF9 grade what happened
in the games, and none asks why. So each outcome under load is already named, and CF10 needs only this statement of it. **A played
read is never voided for load.** Option (a) is the rule. Option (b) is not taken. Option (c) is a launch condition on this read, and
no read's standing rests on it.

**FL, the line.** QE copies it word for word after CF10, and after the Reach table where a PREREG has one, in the PREREG or addendum
of every read the Reach line names. `ABC-303`'s addendum carries it, and that fills H1. It uses no `ABC-303` name, so it needs no row
in that table.

> **FL. Foreign load.** Foreign load during C2′ or S′ changes no line of this read. No game or read is voided, stopped, paused or
> played again for it, and no foreign process is touched. The read is graded as played, by its bars and CF1–CF10, whatever the host
> did: a clean read at or above its bar is MET; a clean read below it is NOT MET (CF5); a candidate fault or loss on time is CF1; a
> base fault or loss on time is UNRESOLVED, re-run once (C-2, CF9). Load does not answer CF3: if the cause is the host alone, no tree
> is fixed, so it is CF3's STOP with no new read, and `timemargin` and the control do not move. QE reports beside the result, by
> class and count: the harness's `host.log`, `fsample.sh`'s busy foreign samples of the total, the largest load1, and each side's
> largest move time. No verdict rides on those figures.

**W, the window, this read.** `ABC-303`'s addendum carries this line as well.

> **W. The window.** The first game starts only on the owner's word that the whole host is quiet, this project, `grugops` and any
> other, for all three stages of § 6, checked with `ps` first. A busy foreign process at that check is a wait, not a read. If load
> comes after the first game, FL governs and the read plays on.

- **Why this read has it.** W shrinks the one branch with no way back (below), on the bundle's one read, for about 44 minutes once.
  He is already asked for the timing window. The addendum can be sealed before that window, so the games can follow it directly if
  P6 and P7 are met.
- **W is a host fact, asked as one, and no bar.** It is `R-CEN-1`'s working control (`…43e6d8fd` 4) carried to a game read. If he
  will not give it, the Orchestrator may drop W by a recorded line before the first game, and FL alone governs. Never after.
- **Later C2′ reads.** FL binds them. W is the Orchestrator's, read by read, because the owner's time is what it spends. The advice:
  ask when the read already owes a quiet window for timing rows, and do not hold a read for it otherwise.
- **The fsample line.** `fsample.sh` (`qe-ABC-307`'s, as PREREG § 6a names it) records and plays nothing, so it is not "something
  else" in § 6's hold. It is there because `host.log`'s count is `pgrep -f /vitest`, by argv, which cannot tell a busy process from a waiting one (`…b9038a14` item 4 built the count that can).

**Why the score needs no void.** A timing read is a wall-clock figure, and load moves it one way, so a flag voids it. A game read
compares two sides on the same host, one game at a time, with each opening played from both colours. Load is not aimed at a side. The
100 ms reads on the records bear this out:

| read | foreign load | largest move time | losses on time | score, as it stood |
|---|---|---|---|---|
| `qe-ABC-264-p2` A6 (`…3af11ebd`) | grugops vitest "at times", not counted | 105 ms | 0 | 44.0, NOT MET |
| `qe-ABC-268-p2` A6 (`…186a743e`) | 2–3 `/vitest` in 24 of 126 samples, load1 ≤ 3.61 | 106 ms | 0 | 58.0, MET |
| `qe-ABC-269` (`…2c51ee30`) | 0 of 125 samples | 104 ms | 0 | 57.0 |

- A candidate loses on time past 150 ms. The largest move under load read 1–2 ms above the quiet read, and a miss and a MET each
  stood under it. These are closer precedents than `qe-ABC-282`'s A6, which played `tc=40/8`.
- **A correction to the brief's fact.** "One core" here is width 1, one game at a time. Nothing pins the match: `rating.ts` sets no
  affinity, and the host has 24 cores (`…186a743e`). So load does not fall on both engines through a shared core. It reaches a single
  move through the scheduler, the frequency and the heat. The conclusion holds, because which side is on move then is not chosen.
- **`UNKNOWN - verify`:** the move-time tail at 100 ms under heavier load. The 4 vitests at up to 196 % of a core that `qe-ABC-282`'s
  A4 saw (`…1434a7d1`) have never been read at this control. Two reads are thin evidence. Neither shows how load moves a score.

**Why (b) is not taken.** On the score a void is not needed, and on a loss on time it is not allowed.
- **On a clean low score it moves CF5.** That a clean low score stays final is in the owner's record (`…b836b85c` 2), and `…d776c0f0`
  § 6 has "Once a game has started, the read is the read". Even a void blind to the score would give a played read a second draw, which is what B4 keeps
  shut. A rule that voids only low scores is worse.
- **On a candidate loss on time it moves C-2 and CF3.** C-2's bar is 0 losses at the 50 ms margin, with no clause on cause. A re-read
  on the same tree is what CF3's "no new read" and CF4's "another tree" refuse. `ABC-223`'s foreign window rule, quoted in `…6b4674af`,
  did leave a row ungraded, but that was a line of its own read, and `ABC-282` sits outside CF's reach. Its reason was that load can
  cause a forfeit. That is not enough here: a load excuse can also cover a real time-check defect, and 50 ms exists so that a change
  that broke the time check cannot read as a gain.
- **Its trigger would fire on presence.** The record the brief gives, five of seven lane reads voided (not re-derived), counts how
  often load is there, not what it does to a game. Voiding on the same flag would cost most reads about 25 minutes for no gain in
  the score's meaning. And samples every 3 s can miss a spike, so they cannot ground a void.

**What this leaves, stated.** One foreign spike can still end the read. A candidate move past 150 ms is CF1. If CF2 still counts 50.0
or more, CF3 runs.
- A real gap in the engine's time check is a defect with a fix, and CF4 gives the one new read. A fix that reads a clock is never
  CF6's value-identical case.
- A cause that is the host's alone, or that nobody can reproduce, leaves no fixed tree. That is CF3's STOP: no new read and no
  verdict. It is not a miss, so B6 does not fire, and only his word could open another read.
- **That word is not asked here.** It would move C-2, CF3 and CF4, and a load excuse can cover a real time-check defect. W is the
  cheaper control. If the Orchestrator wants the branch closed in advance, it is the owner's question, before the first game.

**Where it sits.** Within `ADR-0056`'s accepted form. FL adds no bar, drops none, and changes no word of CF1–CF10, B4, B6 or C-1 to C-3.
"Load does not answer CF3" is the Architect's reading of what CF3 and CF4 already say, and it narrows nothing he accepted. Reach is the
Reach line's: `ABC-282`, closed reads and every read that is not a C2′ read keep their own validity lines. No `qe-` context for
`ABC-289`, `ABC-290`–`ABC-294` or `ABC-272` exists at this hop, so nothing sealed needs a change. The Levels lane was not asked: a
Levels red is CF7's, read by `ADR-0028`, and W spans it because § 6 runs it third. Q2's order is the Orchestrator's ruling, not this
block's.

*Dated 2026-11-06 (`arch-records-1106`; `…28283e48` § 3 (d), confirmed by `…aaeffb04` 1):* **the Levels lane now has its line.** In a C2′
read's PREREG, "alone" for the Levels lane means alone under the host lock. Foreign load during the lane changes no line of the read,
and no run is voided for it. The lane is graded as played, and a red is CF7's. QE reports the lane's `fsample.sh` count and largest load1
beside it, by class and count, and no verdict rides on them. Each PREREG states this before the first game, in `…28283e48` § 3 (d)'s
words. It adds no bar and moves no word of CF7 or FL. It does not reach `G6`, K4, K5 or `NFR-008`, which keep their own void lines.

*Dated 2026-11-07 (`arch-ABC-291-closed`, records only at `main` `78f13b30`; nothing run):* **`ABC-291`'s read, under these lines. No bar moves, and no word of CF1–CF10, FL or the Reach line moves.**
- **Reach.** E4b's read ran under CF1–CF10 and FL, and CF5 ended it. It is now a closed read, which the Reach line does not re-open. E5, E3b and E6 stay reached.
- **FL governed, with no void.** W was dropped by a recorded line (`…70f8b0c2`) before the first game. The first foreign sample reads 19:38:48Z, about five minutes and 21 games after the 19:33:55Z start. The read was graded as played, largest move 105 / 105 ms, 0 past 150 ms.
- **What W could and could not have changed.** It could not have changed how this load is graded: its last sentence gives load after the first game to FL. It could have changed the rest. It is a launch condition, so kept, no game starts without his word that the whole host is quiet, which `…70f8b0c2` says he did not give. And a held window is what keeps load off: the held timing stage read 0 foreign vitest samples of 219 (`…024bbd63`). Whether it would have kept this load off, and how load moves a score, stay `UNKNOWN - verify`. Neither is a ground for a void or a re-read. W stays the Orchestrator's, read by read.

### D6. The order proposed (speed and algorithms interleaved)

Ordered by expected Elo per cost, by file collisions (`ADR-0055` D2), and by what each step needs measured.

1. **Phase 0, no games (now):**
   - O1-a, then O1-b/c (value-identical, S2), as BA/PM cuts them. O1-b changes the core's move type, so it lands
     before any ticket that edits `orderMoves`, `negamax` or `evaluate`.
   - **M0**, the SPRT lane (`tools/` only, beside O1, no file collision).
   - The owner calls in D7.
   - `ABC-249` (test-only), already recommended before milestone 2's search tickets.
2. **Phase 1, the TT (S–M, cheap, one file):** T1 (`ABC-238`) → T2 (`ABC-237`) → T3 (`ABC-209` re-try) → T4.
3. **Phase 2, pruning and reductions (S each, the largest search block):** P2 → P1 → P4 → P3 → P5 → P6, each graded
   by M0.
4. **Phase 3, ordering:** O1h (`ABC-233`) → O2c → O3s (`ABC-234`; parked 2026-11-03, `ADR-0065`) → Q1, Q2. Then S1
   (`ABC-236`; parked 2026-11-03, `ADR-0066` premise not met).
5. **Phase 4, evaluation:** E1 (the full taper, folding `ABC-231`/`ABC-232`) → E2 (`ABC-239`, the tuner; M0's games
   are its data, positions from the project's own games are allowed by default) → E3–E7, each added and re-tuned.
6. **Phase 5:** X1, X2, W1. O1-d whenever the owner says yes (after O1-b). V3 after O1-d.
7. **Readings:** an R milestone reading after Phases 2, 4 and 5 (D5). If the curve flattens below 3 000 after Phase 5,
   V4 (bitboards) is the next question, and it is the owner's.

The phase order is a recommendation. Within the owner's calls, the Orchestrator and BA/PM may reorder by width and
evidence.

*Dated 2026-11-01 (owner fold, `arch-adr0056-owner-fold`):*
- **The O1 order line. Ruling: `ABC-250` first stands.** Phase 0's "O1-a, then O1-b/c" is withdrawn. O1 runs in
  `ADR-0055` D4's accepted order as BA/PM cut it: `ABC-249` → **`ABC-250`** (O1-b part 1, the perft gate reading) →
  `ABC-251` / `ABC-252` on its reading → **`ABC-253`** (O1-a). That is the board's queue. The reasons:
  1. `ADR-0055` is ACCEPTED, and this ADR's own status says it does not change it. D4 item 2 placed O1-b before O1-a,
     and its fold made the order "BA/PM's cut". So the "O1-a first" in Phase 0 was a slip, not a choice. No reason
     for it was given.
  2. `ABC-250` is the gate. Its ≥ 1.25× bar decides whether `ABC-251` and `ABC-252` exist at all. Reading it first
     settles the most open question for one M ticket.
  3. Its expected yield is the larger (bar 1.25× against `ABC-253`'s 1.02×).
  4. O1-b changes the core's move type, so Phase 0's own rule (land before any ticket that edits `orderMoves`,
     `negamax` or `evaluate`) holds either way.
  No file collision argues for O1-a first.
- **Phases 1–5 and M0 are `EPIC-011`'s** (Q-3K-5). By the owner's order they start after the open epics close. So
  Phase 0's "M0 … now" becomes "M0 first in `EPIC-011`". BA/PM's dedupe (`bapm-epic011-dedupe`) places the
  `EPIC-010` milestone 2 tickets (`ABC-231`…`ABC-239`). This ADR notes only one thing: a ticket graded before M0
  exists is graded by the current rule, with the resolution limits stated under § The measurement problem.
- **Readings (item 7), restated by D5's dated block:** 4 s trend readings after Phases 2, 4 and 5 (C3), 40/15 anchors
  A0 (first in `EPIC-011`) and A1 (after Phase 4) (C4), and the 40/15 claim (C1) only when the trend plus the offset
  reaches 3 000. W1 lands before the claim.

*Dated 2026-11-01 (`arch-adr0056-100ms-fold`; owner `…2896c6eb`):*
- **M0 is the fixed-count lane, not an SPRT lane.** It is `ABC-255`, re-scoped as D5's dated block "the fixed-count
  rule at 100 ms" says. "Each graded by M0" in Phases 2–5 now means each strength ticket is graded by C2′ (100 games at
  100 ms). The readings in item 7 are C3′ (400 games at 100 ms) after each epic, plus C4's anchors and the C1 claim.
  The order is unchanged.

*Dated 2026-11-01 (`arch-adr0056-owner-answers`; owner `…43098cef`):*
- **Per strength ticket:** C2′, plus S′ (10 games at 0.5 s against Stockfish) and the Levels deep lane (R-TC part 2).
- **Readings, item 7:** after each epic, C3″ (400 games head to head at 100 ms), plus S′, the Levels deep lane, the
  ladder in short mode and the UCI session deep lane on the closing head. Then C4's anchors, each with its own 100 ms
  outside reading, and the C1 claim. The order is unchanged.

*Dated 2026-11-02 (`arch-ABC-264`, records only; ruling `arch-phase1-replan` `…64e95bfa`):*
- **Phase 1 is paused; Phase 2 is next, pending the owner.** `ABC-238` (T1) missed its bar (F4, `ADR-0058`) and is
  closed unmerged; `ABC-237` (T2) is parked with `ABC-258` (T4); `ABC-257` is re-scoped to T1 + T3 and paused until
  the owner answers the C2′ NEUTRAL-bar question or allows a longer read. Item 2's order "T1 → T2 → T3 → T4" is
  therefore not being worked.
- **Phase 2 starts with P2,** `ABC-264` under `ADR-0059` (PROPOSED), then P1 → P4 → P3 → P5 → P6 as item 3 says.
- **This is the Orchestrator's reorder by evidence** (the paragraph under item 7 allows it), but the pause changes the
  recommended phase order, so it goes to the owner with `ADR-0058` and `ADR-0059`. Until he answers, item 2 stands as
  written and this line records the order actually being worked.

*Dated 2026-11-02 (`arch-owner-answers-1102`; owner `…81ae2db4`, "P yes" and `ADR-0057` accepted):*
- **"P yes": the pause is his order.** Phase 1 is paused and Phase 2 goes first, P2 (`ABC-264`) then P1 → P4 → P3 →
  P5 → P6. `ABC-237` (T2) and `ABC-258` (T4) are parked. `ABC-257` (T1 + T3) is paused; its old trigger, the
  NEUTRAL-bar question, is answered, so the pause alone holds it. Lifting it is the Orchestrator's call within "P".
- **The threads strand (`ADR-0057`, about three tickets) has a place.** `ADR-0057` D6 put it after Phase 1. Phase 1
  is paused with no end date, so that slot no longer exists. The Architect's recommendation, the Orchestrator's and
  BA/PM's to set (the reorder paragraph under item 7 allows it):
  1. **After Phase 2 and its R1 reading, before Phase 3.** The owner's "pruning first" holds.
  2. **The shared-table ticket may be pulled earlier, beside Phase 2, by width.** It touches `src/transposition.ts`
     only, which no Phase 2 ticket edits. It is node-for-node equal to today at `Threads 1`, so it moves no Phase 2
     base and stales no C2′ read.
  3. **All three land before W1 and before any 40/15 reading.** W1's time rules must be written against the worker
     pool, and the claim is read at both thread counts (C1's dated line).
  4. **The parked T2 and T4 are re-asked after the worker-pool ticket,** on the shared table. Several workers loading
     one table is the pressure they need (`ADR-0025` T2 status). `ABC-257`, if resumed later, ports its rule onto
     the shared layout (`ADR-0058` status).
  5. **Every Phase 2–5 read stays `Threads 1` against `Threads 1`** (`ADR-0057` OQ-2 (a)). A threads merge is
     value-identical at `Threads 1`, so it does not make any read stale.

*Dated 2026-11-03 (`arch-ABC-269-rule`, records only; the order as worked, from D2's dated lines and the board):*
- **Phase 2 is closed** (the Orchestrator's ruling, 2026-11-02). The lines above that read "P2 then P1 → P4 → P3 → P5 →
  P6" no longer describe the work:
  - P2 dropped (`ADR-0059`, 44.0 / 100);
  - P3 done (`ABC-268`, `ADR-0061` in force);
  - **P1 parked after P3** (`ADR-0060`: three bars missed on `main` `e72487e1`; D2's dated line);
  - P5 deferred (NEUTRAL, ≈ 0 at 100 ms);
  - P4 and P6 stay stubs.
- **E1 (`ABC-269`) is pulled forward,** ahead of Phase 3, by the reorder paragraph under item 7 and on measured
  evidence (`arch-next-pull`). R1 is read after E1. P1 re-opens only on a new named premise with a new
  pre-registered probe, for example E1's changed tree after it merges (`ADR-0064` § Consequences).

*Dated 2026-11-03 (`arch-fold-1103b`; `arch-ABC-239` `…e4c34239` § 3, folded by BA/PM in `bapm-E2pre-cut`
`…a193625d`):*
- **Item 5, the Phase 4 order as worked:**
  1. **`ABC-269`** (E1). It is held on `ADR-0064` F3, with cut C1 and one `G2` re-read.
  2. **`ABC-274`** (E2-pre, value-identical; `ADR-0067` d8 and F8).
  3. **`ABC-239`** (E2, the tuner; `ADR-0067`).
  4. **`ABC-270` / `ABC-271`** (E3a, E4a), after `ABC-239`. Their new terms then get fitted weights, not hand ones.
     **If `ABC-239` stalls on data, `ABC-270` may go first** on its rule values, and the tuner's first pull traces it.
  - **`ABC-272`** (E7a): any order after E1.
  - `ABC-273` (R1) stays after E1, where BA/PM placed it.
- "E3–E7, each added and re-tuned" in item 5 still stands. This line only names the tickets and puts E2-pre between
  E1 and E2. The reorder paragraph under item 7 allows it.

*Dated 2026-11-03 (`arch-post-269`, records only, at `main` `128e3c6c`; nothing run): **the R1–R3 control ruling**,
which `ABC-273`'s DoR row 10 owes (`EPIC-011` § The owner's answers, "Still open … R1–R3").*
- **Item 1 is done.** `ABC-269` merged at `54dee3f2`, and E1 is in force (`ADR-0064`). `ABC-274` is next.
- **R1–R3 survive, as `EPIC-011` G2's milestone readings.** Their control is C4's 100 ms reading against Stockfish
  (D5, "C4 and C1 re-pointed"). Reasons:
  1. The owner-answers fold restated item 7 without naming R1–R3, but it did not withdraw them. Item 7's "an R
     milestone reading after Phases 2, 4 and 5" still stands, and D6's dated lines of 2026-11-02 and 2026-11-03 place
     R1 after E1.
  2. Nothing else gives G2 an outside number between the anchors. C3″ and C2′ are self-play. S′'s 10 games see only a
     collapse. A0 and A1 run at 40/15 and are asked of the owner.
  3. C1 is timed by "a 100 ms reading of that kind on the latest head, plus the measured offset". An R reading is that
     reading. It tells the Orchestrator when asking for A1 or C1 is worth the owner's hours.
  - **The shape:**
    - one build, `main`, at 200 games: openings 1–100 with both colours, one game at a time;
    - skytalix at `st=0.1` with `timemargin` 50 ms, at level 5 with no `Skill Level` sent, `restart=on`;
    - Stockfish 19 at `UCI_LimitStrength`, `UCI_Elo` E, `st=0.1` with `timemargin` 2 000 ms, `Threads 1`, `Hash 16`,
      `restart=on`;
    - `ABC-204`'s depth guard;
    - E by the band rule (25–75 %). Above E 2 600, C3′'s probe runs first.
  - **The timing:** R1 after E1 (now), R2 when Phase 4 closes, R3 after Phase 5.
  - **No duplicates:** an R reading and an anchor's 100 ms half on the same `main` SHA are one reading, not two.
  - **The milestone named:** by D5's claim rule, M is met when a 200-game reading at E = M scores ≥ 50 %. A reading at a
    band-rule E below 2 200 names **"none"** and reports X ± Y, as `ABC-273` scope 3 already says.
- **R1 has no runnable command today.** This was read from `tools/rating/rating.ts` at `128e3c6c`, not run.
  - `r` accepts only `--budget-ms 500`: `--budget-ms 100` throws "r takes only 500".
  - Stockfish's `st=0.5` is fixed in `cutechessArgs`.
  - `rpair` plays at 4 000 ms, and `d` is self-play. So `ABC-273` scope 2's "UNKNOWN - verify" resolves to: **a
    harness gap**. `ABC-273`'s own § Out of scope sends that to a new ticket.
- **The change (`tools/` only, size S; BA/PM cuts it, and `ABC-273` depends on it).** It is `ABC-255`'s item 2
  narrowed to `r`. `rpair` has no user and is left alone.
  1. `r` accepts `--budget-ms 100` as well as 500. At 100, skytalix gets `st=0.1` with `timemargin=50` (the existing
     `SHORT_MARGIN_MS` entry), and Stockfish gets `st=0.1` with `timemargin=2000`, in place of `st=0.5`.
  2. At 100, `--elo` above 2 600 is refused, until C3′'s probe gives a rule.
  3. Without the flag, and at 500, every `r` argv, every default, every pin and every `--dry-run` output stays
     byte-equal. `d` and `rpair` are untouched.
  4. Acceptance:
     - one `--dry-run` row for R1's command, printing both engines at `st=0.1` and `option.UCI_Elo=1810`;
     - the existing dry-run rows unchanged;
     - 0 lines under `src/` (R-TC).
- **R1's command, once that change has merged** (QE, host ALONE, under the host lock; paths out of the records,
  `ADR-0049` d4; `QE-269-j`):

  ```sh
  CUTECHESS_CLI=<cutechess-cli 1.5.1, sha256 dc776901…2154f40a> \
  STOCKFISH=<Stockfish 19, sha256 c78c22a9…4593e352d2> \
  node tools/rating/rating.ts r <main-sha> <out> --elo 1810 --budget-ms 100 --rounds 100 --concurrency 1
  ```

  - **Both environment variables must be set.** The tool has no default and stops before any build when either is
    missing (`ABC-204`; `qe-ABC-269`'s first B8 launch).
  - **`--concurrency 1` must be written out,** because `r` defaults to 2. `--rounds 100` is `r`'s default, written out
    so the record shows 200 games.
  - **E 1 810 is the starting value; QE confirms it in the PREREG.** At 0.5 s the S′ pool puts `main` near 1 957 ±
    385. 100 ms is about 2.3 doublings slower, so at 50–100 Elo a doubling that is about 1 730–1 840. Against 1 810
    that expects about 40–55 %, inside the band (an estimate). Stockfish's pick depth is 4, and `st=0.1` holds with
    headroom below E 1 910 (C3′). Sharing S′'s E does not pool anything, because the control differs.
- **Host time: about 0.4–0.9 h (estimate), so R1 is not asked of the owner** (`ABC-273` R1-A3; asked only over 1 h).
  - The basis is two readings from `qe-ABC-269`'s B8. C2′ at 100 ms on both sides played 100 games in 23 min 50 s,
    builds included: 14.3 s a game at about 71 moves a side. S′ games against Stockfish ran about 33 moves a side.
  - At 0.1 s a move on both sides, a game is about 6.6–14.2 s, and 200 games take 22–47 min, plus one build.
  - QE re-estimates in the PREREG. **If that estimate is over 1 h, the owner is asked before the start.**
  - **If the band rule steps E,** the second 200 games are a new run. The two together pass 1 h, so the step's run is
    asked of the owner first.
- **Rejected:**
  - **R1 at S′'s 0.5 s control, with today's tool and no code.** The command would be
    `r <main-sha> <out> --elo 1810 --budget-ms 500 --rounds 100 --concurrency 1`. S′ measured 32.2 s a game (10 games
    in 5 min 22 s), so 200 games take about **1.8 h**: over 1 h, so it would be asked. It also reads on a scale that
    C1 and C4 do not use.
  - **`rpair` at 4 s:** two builds and hours of host time, on the retired 4 s scale.
  - **`d`:** self-play, so it gives no outside number.
  - **Dropping R1–R3:** G2 would have no reading below the owner-asked anchors.
- **No owner item is created.** This is a measurement setting inside the accepted D5/C4 control. The `tools/` change is
  delivery, already designed in `ABC-255`'s re-scope.

*Dated 2026-11-03 (`arch-owner-answers-1103b`; his word `…401c3d09` accepts `ADR-0068` and `ADR-0069`): **item 5, the
Phase 4 order as it now stands.***
1. `ABC-269` (E1): merged (`54dee3f2`).
2. `ABC-274` (E2-pre): merged (`2410d4f7`).
3. **`ABC-270` (E3a, structure only, `ADR-0068`)**, whose build runs beside `ABC-239`'s tool build.
4. **`ABC-239` (E2):** its fit and emission are taken on a `main` that contains `ABC-270`. They fit the queen-on pairs.
   One read covers both.
5. `ABC-271` (E4a), after `ABC-239`, unchanged.
- **Q1 (`ADR-0069`), a search-side row in this window:** its build runs beside `ABC-239`'s tool build. It merges, or
  misses, before `ABC-239`'s candidate is frozen for B-T7 / B-T8.
- `ABC-272` (E7a): any order after E1. It is also the structural candidate if B-T5's mate floor fires on KQK rows
  (`ADR-0067`'s dated line under its bars).
- **Superseded:** the 2026-11-03 line above (item 4, "`ABC-270` / `ABC-271` after `ABC-239`", and its stall clause).

*Dated 2026-11-04 (`arch-ABC-271`; `arch-ABC-239-f3f4` path (iii), taken by the Orchestrator `…4c76bf7a`): **item 5,
the Phase 4 order now.***
1. `ABC-269` (E1), `ABC-274` (E2-pre), `ABC-270` (E3a structure) and Q1 (`ABC-279`): merged.
2. `ABC-239` (E2's first pull): **closed NOT MET**. `main` keeps E1's table.
3. **`ABC-271` (E4a, `ADR-0070`):** rule values, read on its own C2′ (GAIN).
4. **E2's second pull**, a new attempt on a `main` with E4a. It fits king distance and free path, and holds the rule
   of the square.
- `ABC-272` (E7a): any order after E1, one at a time on the evaluation files.
- **Superseded:** the 2026-11-03 line above, item 5 ("`ABC-271` (E4a), after `ABC-239`, unchanged").

*Dated 2026-11-04 (`arch-ADR-0070-accept`; `ADR-0070` accepted in form (a), `…e8a3b5df`): **item 5's step 3
changes form, not place.***
3. **`ABC-271` (E4a, `ADR-0070`):** structure only, at 0, value-identical. No games and no read of its own.
4. **E2's second pull**, a new attempt on a `main` with E4a's structure. It fits king distance and free path, and
   holds the unstoppable passer at 0. Its read judges E4a's values with its own.
- The order is unchanged. **Superseded:** step 3's "rule values, read on its own C2′ (GAIN)", and step 4's "holds the
  rule of the square" where that meant the value 400.
- Still the owner's before the second pull: `ADR-0067`'s d6 amendment (the margin-aware bound form) and B-T8's
  re-confirmation.

*Dated 2026-11-05 (`arch-owner-answers-1105`; his word `…b836b85c`, "3. wait"): **item 5, the Phase 4 order now.***
1. `ABC-269` (E1), `ABC-274` (E2-pre), `ABC-270` (E3a), `ABC-271` (E4a) and Q1 (`ABC-279`): merged. E3a's and E4a's terms stay at 0.
2. **E2 waits.** `ABC-239` and `ABC-301` closed NOT MET. No third fit now and no date (`ADR-0067`'s dated block of this task).
3. **The next terms go on their own reads with hand values, one at a time on `src/evaluate.ts` / `src/evaluate-params.ts`.** The
   records do not set their order: item 5's "E3–E7" is a range, and `…2b3440cf` left the order open. **Recommended: E4b (`ABC-291`),
   then E5 (`ABC-292`) without its per-piece mobility, then E3b (`ABC-290`), then E6 (`ABC-293`).** The reasons are in
   `arch-owner-answers-1105` `…ba8265e9`. The order is the Orchestrator's by this section's reorder rule, and the owner is told.
4. **A third pull may be asked for** only after one of those terms has merged on its own read, under `ADR-0067`'s four tests.
   *Dated 2026-11-05 (`arch-owner-answers-1105b`; his word `…0f1ab02e`, "2. yes"):* or has merged inside a bundle. `ADR-0067`'s dated line of that task
   reads the four tests for such a term. This order does not change.
- `ABC-272` (E7a): any order after E1, one at a time on the same files, as before.
- **The reads queue behind each other.** A value-changing merge stales the read after it, so a term's C2′ follows `ABC-303` and
  `ABC-289`. Its ADR and probe need not wait for them, only for the host.
  *Dated 2026-11-06 (`arch-ABC-291-stop`, records only at `main` `48993089`; owed by `arch-records-1106` `…860a0dbd`; nothing run): `ABC-303` merged at `434fa171`. `ABC-289` is recorded NOT MET on an exact build and stays unmerged (`…7c297147`, `…40ef8351`). So no merge is left to stale a term's read, and the wait this line names is met. The rule stands for the terms: each value-changing merge stales the read after it. `ABC-289` is not closed. OQ-0074-2 is with the owner, and if he opens a route, `ABC-291`'s read goes first or waits, as `ADR-0075` § Consequences' Order line says. No order, value or bar moved.*
  *Dated 2026-11-07 (`arch-ABC-291-closed`, records only at `main` `78f13b30`; nothing run): **step 3's first term is spent, NOT MET (`…211fb87a`). It holds nothing behind it, and no order, value or bar moved.***
  - **E5 (`ABC-292`) is next, then E3b (`ABC-290`), then E6 (`ABC-293`).** `ADR-0075` d11 (d): a miss there leaves `ABC-292` where it stands. Each ADR is still owed, and each is his to accept. The order stays the Orchestrator's by this section's reorder rule, with the owner told.
  - **Item 4:** E4b can no longer open the door. It rests on E5, E3b and E6. This is no miss on row E2, and tuning waits as it did (`ADR-0067`'s dated line of this task).
  - **The queue:** no read waits. `main`'s `src` and `tools` read as `780d9021`, so the next term's base is `main` as it stands.
  - **`ABC-289`'s NOT MET is row Q2's.** It counts neither for nor against a term here. OQ-0074-2 stands as `…40ef8351` left it.
- **What a hand value must show:** the term's page, form (b). Values fixed by a stated rule in its ADR before any row is read,
  which the owner accepts; `ADR-0064` d7's safety rows, `zugzwang.001` among them; `G2` at the ADR's ratio; `G6` under `Q-3K-4` (b);
  C2′ GAIN ≥ 50.0 of 100, since evaluation rows fire at 100 ms; S′; the Levels lane. A miss is not merged and not re-played.
- **Superseded:** item 5's "E3–E7, each added and re-tuned" (each is added; a re-tune exists only if a third pull does), and
  steps 3 and 4 of the 2026-11-04 lines above as next steps. Which tickets close Phase 4 stays the Orchestrator's ruling
  (`…2b3440cf` reads `ABC-272` and `ABC-290`–`ABC-294`).

### D7. What is the owner's call

- **Q-3K-1, the scale and the time** a "3 000" is read on (D5 items 1, 2 and 5). The proposal is Stockfish 19
  `UCI_Elo` at 4 000 ms a move, equal time, with one 120 + 1 reading at the claim.
- **Q-3K-2, the per-change rule.** Adding an SPRT verdict (M0) to his Q4 = (e) rule, or putting it in place of the
  D smoke, is a change to his rule.
- **Q-3K-3, width.** SPRT at width 1 is slow; using more cores breaks "one at a time".
- **Q-3K-4, `G6` "≥ base".** It stopped `ABC-205` on cost alone and binds every Backlog ticket. Every eval term costs
  nodes. The proposal: value-changing tickets keep `NFR-005`'s floor (depth 6) and the WARN (depth 7), and are judged
  on play (M0) instead of "≥ base". `NFR-005`'s level does not move.
- **Q-3K-5, scope.** A new epic for the path to 3 000, or `EPIC-010` widened. Either way, it re-opens fenced items:
  re-tries of `ABC-209` and `ABC-210`, SEE and delta pruning, and rook activity.
- **Q-3K-6, `NFR-009` above 16 MiB** for T4. He pre-offered 128 MiB on 2026-09-25 ("if more is needed you can extend
  it to 128MiB"). Moving the level still needs his recorded word.
- **Q-3K-7, tuning data** for E2. The project's own games are allowed by default (`ABC-239` A1). Lichess game exports
  are CC0 by their page. A Stockfish-evaluated position set raises a product-identity question (labels from a neural
  engine). The licence and that question are his.
- **Q-3K-8, later:** re-opening `ADR-0001` (bitboards), only if the readings call for it.
- **Not asked:** any level or budget (`G9` holds), any NFR level other than Q-3K-6, any language change (`ADR-0055`
  O1 holds).

*Dated 2026-11-01 (owner fold, `arch-adr0056-owner-fold`; his word `…022fb66f`):*
- **Q-3K-1: answered (the time).** The claim is read at 40/15, not at 4 s. The scale (Stockfish 19 `UCI_Elo`) and the
  claim rule were not contested and stand, accepted in direction. One sub-choice is left open to him, only if he wants
  it: Stockfish on a fixed, depth-safe move time (recommended; about 3.2 days for 200 games), or on the same 40/15
  clock (the same strength for Stockfish, about 5.5–6 days). D5's dated block C1 uses the first.
- **Q-3K-2: open.** He allowed fast routine controls (down to 0.5 s). He did not say whether an SPRT verdict joins or
  replaces his Q4 = (e) rule. C2 proposes the control and bounds. The rule stays his.
- **Q-3K-3: open.** C2's arithmetic is the input: at width 1, a +20 change costs about 24 h and a null change about
  70 h. Rows below +10 need more width.
- **Q-3K-4: open** (`G6` "≥ base" for value-changing tickets).
- **Q-3K-5: answered.** A new epic, `EPIC-011`, after the open epics close, with no work done twice. Re-trying a
  dropped ticket (`ABC-209` after T1, `ABC-210` in another form, `ABC-205`/`ABC-207` under the tuner) is not "the same
  work twice" only where D4's changed precondition is recorded. BA/PM's audit records it per ticket.
- **Q-3K-6, Q-3K-7, Q-3K-8: open.**
- **`ADR-0055` Q-SP-3 (`ABC-254`, the `ADR-0003` amendment): open.**

*Dated 2026-11-01 (`arch-adr0056-100ms-fold`):*
- **Q-3K-2: answered** (`…2896c6eb`). There is no SPRT. A strength change is read on 100 games at 100 ms against its
  base, and an epic on 400 games at 100 ms. What "pass" means is C2′ and C3′. The GAIN and NEUTRAL bars and the choice
  of Stockfish as the epic opponent are the Architect's reading of his rule. He may correct them.
- **Q-3K-3: answered** (`…f7a50e95`): one core, width 1, one game at a time.
- **`ADR-0055` Q-SP-3: answered yes** (`…f7a50e95`). The `ADR-0003` amendment is the Orchestrator's queued records
  task, not this ADR's.
- **Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8: still open.**
- **New, the owner's if he wants it:** whether the R smoke (4 s, 10 games) stays beside C2′. The Architect recommends
  that it does.

*Dated 2026-11-01 (`arch-adr0056-owner-answers`; his word `…43098cef`):*
- **The GAIN and NEUTRAL bars: answered, "2. ok".** They stand, owner-accepted.
- **The epic opponent: answered, "1. b".** The epic is read head to head (C3″). Stockfish is no longer the epic
  opponent.
- **The R smoke: answered (item 3).** It stays, at 0.5 s a move (S′), under the rule R-TC.
- **The Architect's readings, which he may correct:**
  - S′ at E 1 650 with a 50 ms margin;
  - an epic with no engine-core change owes no C3″;
  - the lanes R-TC part 2 names.
  None of them is a new owner call.
- **Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8: still open.**

*Dated 2026-11-02 (`arch-owner-answers-1102`; his word `…81ae2db4`):*
- **Q-3K-3, refined by `ADR-0057` OQ-2 (a).** "One core, width 1, one game at a time" reads: one game at a time;
  the engine may use several cores inside a game; every 100 / 400 read stays at `Threads 1` on both sides.
- **The C2′ NEUTRAL-bar question: answered, "C yes"** (C2′'s dated line).
- **The Phase 1 pause: answered, "P yes"** (D6's dated line).
- **Q-3K-4, Q-3K-6, Q-3K-7, Q-3K-8: still open.** `ADR-0057` OQ-4 (a) does not move `NFR-009`'s level, so it does not
  answer Q-3K-6.

*Dated 2026-11-03 (`arch-ABC-269-rule`; his word `…cc7db847`, verbatim "64 yes, Q-3K-4 b"):*
- **Q-3K-4: answered (b), judge on play.** For a value-changing evaluation ticket:
  - **Graded:** C2′ (100 games at 100 ms, by its declared intent), with S′ and the Levels deep lane beside it
    (R-TC), and **`NFR-005`'s floor**: at `LEVELS[5]` (4 000 ms), on `G6`'s boards and reading rule, every run
    completes depth ≥ 6 (FAIL below), and depth 7 is a WARN.
  - **Reported, not graded:** `G6`'s "median ≥ base".
  - **Unchanged:** `NFR-005`'s level and `G6`'s reading rule (`ABC-205`'s: ≥ 5 interleaved rounds per board, width 1,
    load recorded).
- **Scope, as recorded.** The question above said "value-changing tickets". The Orchestrator recorded the answer for
  "value-changing evaluation tickets" (D2's E rows; `ABC-269` first). Every other value-changing ticket keeps
  `G6` "≥ base" binding until the Orchestrator records a wider reading of his word, or he gives one. A value-identical
  ticket keeps its own cost bar as before.
- **`ADR-0064` (E1): accepted** ("64 yes"). It is not in force until `ABC-269` merges.
- **Q-3K-6, Q-3K-7, Q-3K-8: still open.**

*Dated 2026-11-03 (`arch-fold-1103b`, records only, at `main` `239ac715`; `ADR-0067` § Status and decision
`arch-ABC-239` `…e4c34239` § 4):*
- **Q-3K-7 is split into three parts.** Each part is **pending**. Each has a recommendation and a default; none is
  assumed. The prototype's evidence (`ADR-0067` § Context) is behind each recommendation. On own games alone, the
  unconstrained fit gives queen 2 593 / 137. With material frozen and sign bounds, about 0.4 % of loss is left to win.
  - **(a) Lichess CC0 standard games, for training only** (one monthly export, comments ignored, own games kept as
    validation; `ADR-0067` d9). **Recommend yes.** Default: own games only, a bounded first pull.
  - **(b) A Stockfish-labelled position set.** **Recommend no:** the product-identity question; not needed.
    Default: not used.
  - **(c) Games against Stockfish as training data.** **Recommend no:** half the moves are Stockfish's, and the
    results lean to losses. Default: excluded.
- **New owner items from `ADR-0067`, each pending:** acceptance (*"accept ADR-0067"* or *"decline it"*). Acceptance
  gates `ABC-274`'s merge and `ABC-239`'s 100-game read and merge, not their builds (reading (b)). The other item is
  **B-T8**, the 200 + 200 outside pair (about 5 h) before `ABC-239` merges. **Recommend yes.**
- **Q-3K-6, Q-3K-7 (a) / (b) / (c), Q-3K-8, Q-3K-9: still open.**

*Dated 2026-11-03 (`arch-owner-answers-1103`; his word `…af126c04`, verbatim "1. yes ; 2. yes ; 3. no ; 4. no ; 5. ok
yes ; 6. yes ; 7. yes; 8. yes"):*
- **Q-3K-7: answered.**
  - **(a) yes:** `ABC-239` may train on the public-domain (CC0) Lichess database export, beside own self-play. The
    export, the slice, the filters, the split, the mix and the provenance are pinned in `ADR-0067` § Addendum
    2026-11-03. Validation stays own games.
  - **(b) no:** no Stockfish-labelled position is a training target. The tuner reads no comment, `[%eval]` included,
    and a test proves it.
  - **(c) no:** our games against Stockfish (S′, B-T8, C4's anchors, R1–R3) are never training data. They stay the
    outside measure.
- **`ADR-0067`: accepted** ("1. yes"). **B-T8: approved** ("5. ok yes"). Its bar is unchanged (point estimate ≥ 0).
- **Q-3K-9: answered yes** ("6. yes"). `ADR-0024` d4 is open for Q1's design only. See D2's dated line.
- **Q-3K-6 and Q-3K-8: still open.**

*Dated 2026-11-03 (`arch-owner-answers-1103b`; his word `…401c3d09`, verbatim "yes, accept ADR-0068 and ADR-0069"):*
- **`ADR-0068` (E3a): accepted.** **`ADR-0069` (Q1): accepted.** Each comes into force at its own ticket's merge.
  Q1's merge waits on its own read.
- **Q-3K-6 and Q-3K-8: still open.** No new owner item is created.

### D8. What BA/PM would cut on a yes

- On Q-3K-2/3: the M0 ticket (`tools/` only; acceptance: an SPRT run on a known +gain pair such as `ABC-208`'s door
  terminates H1, and on an identical pair terminates H0).
- On Q-3K-5: a new epic, or `EPIC-010` milestone 2 re-ordered as D6 Phases 1–3, with new tickets P1–P6, O2c, Q1, Q2,
  T4, W1, X2, E3–E7 and re-cuts of T3/X1. `ABC-231` and `ABC-232` folded into E1.
- On nothing: `EPIC-010` milestone 2 proceeds as written, and this ADR's gap list stays a reference.
- *Dated 2026-11-01 (`arch-adr0056-100ms-fold`):* the "On Q-3K-2/3" line is superseded. The M0 ticket is the
  fixed-count lane (`ABC-255` re-scoped, size S), with acceptance as D5's dated block lists it. The SPRT H1/H0
  acceptance is withdrawn.
- *Dated 2026-11-01 (`arch-adr0056-owner-answers`):* `ABC-255` item 2 and its acceptance change, as D5's block "the
  owner's three answers" lists them: `r --budget-ms 500` in place of `rpair` at 100 ms, plus an S′ row. The size stays
  S. `ABC-256` is recommended dropped. G-1 (a source-scan row, XS, test-only) and G-2 (the Levels deep lane's trigger,
  a records line) are offered for cutting.

## Alternatives

- **A neural evaluation.** Rejected by the frame: `EPIC-004`'s permanent non-goal and the owner's question ("without
  neural engine"). E2 tunes constants only.
- **Keep the current per-change rule alone.** Possible (it is today's). It cannot see the +5 to +40 changes the climb is
  made of; the two negative outside point estimates on record are what that looks like.
- **Evaluation first, search later.** Not proposed: E2 needs E1 and data; the pruning rows are S tickets with large
  expected gains and no data wait. Phases 2 and 4 may swap if the owner rules Q-3K-7 first.
- **A port (O2/O3) for speed.** Closed by the owner's O1 choice. V4 (bitboards in TypeScript) is the speed question
  that remains, later.
- **Measure Elo per change on R batches.** Rejected: ± 78 per 200 + 200 games, ≈ 22–24 h ALONE each.

## Consequences

- **If accepted as proposed:** one `tools/` ticket (M0) and the owner's answers first; then about 20–30 S–M engine
  tickets in five phases, each graded on M0 plus the smoke guard, with three milestone R readings. Expected landing
  ≈ 2 550–2 800 on R's scale (estimate), 3 000 at the optimistic edge.
- **If not accepted:** `EPIC-010` milestone 2 proceeds as written (eight tickets), graded on smokes; its gains, if any,
  stay below every instrument's resolution until the epic-close batch.
- **Open `UNKNOWN - verify` items:** every Elo estimate in D2; the mapping of R's scale to any list; the depth
  Stockfish 19 needs at E ≈ 3 000 and the `st` that reaches it on this host; SPRT throughput on this host; the cause of
  the two negative outside point estimates; whether a TypeScript engine with a list rating exists.
- *Dated 2026-11-01 (owner fold):*
  - **Closed:** the pick depth at E ≈ 3 000 is 14 (`sf_19` `search.h`; D5's dated block).
  - **Added `UNKNOWN - verify`:**
    - the `st` that reaches depth 14 on this host;
    - games per hour at 0.5 s a move;
    - skytalix's depth at 0.5 s;
    - the 4 s → 40/15 offset (C4 measures it);
    - multi-day heat at width 1.
  - **Host cost of the claim path at width 1:** A0 ≈ 35 h + 11 h, A1 the same, three trend readings ≈ 11–12 h each,
    the claim ≈ 75–80 h, plus each SPRT test (≈ 10–85 h).
- *Dated 2026-11-01 (`arch-adr0056-100ms-fold`):*
  - **Closed by `qe-tc-depth-probe`:**
    - skytalix's depth at 0.5 s is 8, and at 100 ms it is 6;
    - games per hour at 0.5 s is 44.2, and at 100 ms 259.2 (self-play; lower bounds);
    - Stockfish's `st` for its pick depth up to E 2 600 is ≤ 20 ms at p95.
  - **Added `UNKNOWN - verify`:**
    - games per hour and game length for the C3′ pair against Stockfish at 100 ms;
    - Stockfish's pick-depth time above E 2 600;
    - skytalix's E at 100 ms (estimated 1 550–1 850);
    - the 100 ms → 40/15 offset (C4 measures it).
  - **Host cost, re-stated:**
    - per strength change ≈ 0.4 h (C2′), and per epic ≈ 1.0–1.6 h (C3′), both owner-set;
    - the anchors and the claim as before, asked of the owner first;
    - no SPRT cost.
- *Dated 2026-11-01 (`arch-adr0056-owner-answers`):*
  - **Moot now:** games per hour for the C3′ pair against Stockfish. skytalix's E at 100 ms is wanted only when A0
    is asked.
  - **Added `UNKNOWN - verify`:**
    - skytalix's overshoot at 500 ms (`ABC-255`'s first S′ reports it);
    - skytalix's expected S′ score at E 1 650 (estimated at 67–83 %);
    - S′'s wall time (estimated at about 10 min);
    - how far C3″'s four games per opening fall short of independent games.
  - **New risk, the owner's choice:** with both reads self-play, self-play non-transfer is unseen between 40/15
    readings. Pooling the S′ scores is the cheap mitigation (C3″).
  - **Host cost, re-stated (estimates):**
    - per strength change ≈ 0.7 h: C2′ ≈ 0.4 h, S′ ≈ 10 min, the Levels deep lane ≈ 9 min;
    - per epic ≈ 2.1 h: C3″ ≈ 1.55 h, S′, and three lanes of about 30 min together.

## Rollback

- **This ADR:** nothing to roll back; it changes no code and no level. Withdrawing it leaves `EPIC-010` as written.
- **Each later ticket:** behind its own `ADR-0026` off-door and its own revert, as today.

## Sources (web, read 2026-11-01)

- Blunder changelog (Christian Dean): https://raw.githubusercontent.com/algerbrex/blunder/main/docs/changelog.md;
  "rated close to 2700" on CCRL: the TalkChess thread "Progress on Blunder" (https://talkchess.com/viewtopic.php?p=930590
  and neighbouring posts; which post carries the sentence is `UNKNOWN - verify`)
- Texel's Tuning Method (CPW): https://www.chessprogramming.org/Texel%27s_Tuning_Method
- tomitankChess 4.0 CCRL 40/15 2 820 ± 27 (2020-05-02): https://talkchess.com/viewtopic.php?p=842843; its release
  note: https://www.talkchess.com/forum3/viewtopic.php?p=827061; tomitankChess 1.4 "~2500": https://talkchess.com/viewtopic.php?p=733981
- Lozza (CPW): https://www.chessprogramming.org/Lozza
- Stockfish 11 ≈ 3 430 CCRL 40/15 1 CPU and Fruit 2.1 ≈ 2 695 (2020-08-29 list): read from web-search extracts of CCRL
  list posts on TalkChess (for example https://talkchess.com/viewtopic.php?p=825477 and
  https://talkchess.com/viewtopic.php?p=855555). Snapshots, not current; the exact post per figure is `UNKNOWN - verify`;
  the live lists are at https://computerchess.org.uk/ccrl/4040/
- Lichess database licence (CC0): https://database.lichess.org/
- Stockfish `UCI_Elo` calibration and pick depth: quoted from `ABC-204` § The pins (repo record, read at `sf_19`).
