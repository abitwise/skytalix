---
id: ABC-225
title: "One command reads an interleaved R pair: base and candidate against the same Stockfish, in alternating blocks, with the opening-paired error and a host log"
status: done
column: Done
closed: "2026-10-30, merged to main at 59dc3ab4; QE PASS_WITH_GAPS at --concurrency 1 (qe-ABC-225-w1, d0807789); tools/ only, no UAT"
size: M
priority: P2
epic: EPIC-010
---

# ABC-225: an interleaved R pair in the rating harness

> **RESTATED 2026-10-31 by BA/PM** (task `bapm-rpair-level6-cut`, records only, at `main` `278a9bb7`; nothing run, built or
> timed). Source: `qe-EPIC-010-m1-batch` `…5967dfc1` (QE-M1B-a HIGH, QE-M1B-b MEDIUM) and the Orchestrator's route (A)
> (`orch-2026-10-30a` `…fb0c8978`). **The page stays Done, and A1–A6 stay MET as written.**
>
> - **A5 was labelled 4 000 ms but played at 3 000 ms on both sides.** Its two builds, `02fa9556` and `baf99a7c`, both
>   predate `ABC-228` (`e42b637b`), where `LEVELS[5]` is 3 000 ms. `rpair` sends `go movetime 4000` with no `Skill
>   Level`, and `go()` caps it at the level's budget. QE's count on A5's records: 0 of 905 and 0 of 1 000 `info … time`
>   values above 3 100 ms; PGN clocks at 3.0 s on 895 and 991 skytalix moves, at 4.0 s on none. Both sides were equal,
>   and A5 graded no strength (its Elo was INFO), so **no verdict moves.**
> - **A6's 21.67 games/h is a 3 000 ms rate**, so the 18.46 h projection (17.5–19.4 h) does not price a 4 000 ms
>   pair, and is withdrawn as the batch estimate. The "why it fell" line in the ESTIMATE RESTATED block below
>   (shorter games) is superseded: the cap explains the fall. **A 400-game pair at width 1 with both sides at
>   4 000 ms is about 21.7–24.1 h ALONE, plus about 1 h of QE** (QE-M1B-b: 3.26–3.61 min a game from the
>   `qe-ABC-228-ii` and `qe-ABC-241` R smokes). `EPIC-010`'s cost lines carry the same restatement.
> - **What changes in the tool:** `ABC-247` (XS, P1, Ready): `rpair` passes `option.Skill Level=6` to skytalix on both
>   builds. Level 6 is `{ 5 000 ms, rate 0 }` at every SHA so far, so both sides search 4 000 ms. A1's "`rpair` = `r`'s
>   argv except openings and output paths" gains that one token, restated and pinned by `ABC-247` A1. The `r` and `d`
>   paths are unchanged.
> - Notes: `.grugops/context/bapm-rpair-level6-cut/notes/`.

> **CLOSED, Done, folded 2026-10-31 by BA/PM** (task `bapm-ABC-242-close`, records only, at `main` `d58f2d77`;
> nothing run). The page read `in-development` after the merge; this fold closes it. QE's verdict is
> **PASS_WITH_GAPS** (`qe-ABC-225-w1` `…d0807789`, by PREREG `…6d1d5bff`, committed at `b4d7d5d5` before any game).
> It was **merged at `59dc3ab4`** on 2026-10-30, with the `qe-ABC-225` records of the width-2 thermal stop. `tools/`
> only, so **no UAT** (Test note 2). The SE merge hop is `se-ABC-225-main` (`3dca0e67`; `rpair` at 4 000 ms).
>
> - **A1–A6 MET.** A1–A4 re-run by QE at `933d9f35` (`…5d562743`); A5 and A6 on the real 40-game run at
>   `--concurrency 1`, ALONE, to the end (`…7e9bd36f`): Tctl median 74.1 °C, max 78.8 °C, no thermal stop, rc 0.
>   A6: 1.846 h play wall, 21.67 games/h, a 400-game pair at width 1 projected at 18.46 h (17.5–19.4 h). The
>   ESTIMATE RESTATED block below carries that figure. *(2026-10-31, `bapm-rpair-level6-cut`: read at 3 000 ms on both sides, not
>   4 000 ms; the RESTATED block at the top.)*
> - **The SE's four `UNKNOWN - verify` points are closed by the real run:** cutechess honours `start=S` (the
>   `start=51` probe), every block yields an nps value, k10temp Tctl reads, and a block's Elo line equals the pooled
>   formula.
> - **QE-225w1-b (LOW, records):** done on 2026-10-31 (`bapm-ABC-222-epic009-m1`), the block below.
>
> **Gap dispositions:**
>
> | gap | QE grade | disposition |
> |---|---|---|
> | **QE-225w1-a** | LOW, maintainability (the SE's LOW, confirmed) | **No ticket. Recorded here as a known misleading field.** `cutechessArgs()` takes the R budget from its literal (`mode === "r" ? 4000 : budget`), so `rpair`'s `budget: 4000` (`rating.ts:660`) is passed and never read. A1 holds by construction, and `pair-check.ts`'s A1 pin (`st=4 timemargin=1000`) turns red if the literal moves alone (the SE's mutation check, `se-ABC-225-main` `…a9f5834c`). The risk is only a reader who edits `rpair`'s `budget` and expects an effect; a dry run shows `st=4`. **Fold rule:** the next ticket that moves the R budget names one R-budget constant or drops `budget` from `rpair`'s spec in the same change. Cutting a ticket for a field nothing reads is not worth a hop. |
> | **QE-225w1-c** | INFO, host | **No ticket.** A foreign vitest from another session showed in 1 of 111 watcher samples (about 60 s) and did not move Tctl. Host coordination stays outside this factory (QE-225-c stands). The batch's PREREG keeps the wait-clear and the logged-not-stopped rule. |
> | **QE-225w1-d** | INFO | **No ticket; carried to the batch.** Stockfish's nps swung +7 % between two consecutive blocks (1.635 M → 1.753 M) on one binary and host. That is the variance the gauge exists to show. Milestone 1's batch reads `nps.log` per block (20 per build) and reports the spread, information only. |
> | **QE-225w1-e** | INFO | **No ticket; a residual.** A4's real halt path is unexercised on real data (0 faults); it is covered offline by `pair-check.ts`'s A4 suite. The first real fault, in the batch or later, exercises it, and that run's QE reads the halt. |
>
> - **Carried unchanged:** QE-225-d (LOW, `qe-ABC-225`: the pentanomial variance convention is unstated in `pair.ts`).
> - Elo (INFO, graded by nothing): pair −69.9 ± 219.0 NEUTRAL, 40 games.
> - Notes: `.grugops/context/bapm-ABC-242-close/notes/`.

> **ESTIMATE RESTATED 2026-10-31 by BA/PM** (task `bapm-ABC-222-epic009-m1`, records only, at `main` `4bd9ac6a`;
> QE-225w1-b, LOW, from `qe-ABC-225-w1` `…d0807789`). **A 400-game R pair at width 1 is about 18.5 h ALONE (range
> 17.5–19.4 h), plus about 1 h of QE.** It was about 22–24 h.
>
> - **Source:** A6's own reading (`qe-ABC-225-w1` `…7e9bd36f`). 40 games at `--concurrency 1` and 4 000 ms took
>   1.846 h, which is 21.67 games/h, or 2.77 min a game. Play wall × 10 + build = 18.46 h. The per-block range
>   (52.6–58.1 min × 20 block-runs) gives 17.5–19.4 h.
> - ~~**Why it fell.**~~ *(Superseded 2026-10-31, `bapm-rpair-level6-cut`: the A5 builds capped `movetime 4000` at 3 000 ms; the block
>   at the top. At 4 000 ms the pair is about 21.7–24.1 h ALONE plus about 1 h.)* The 22–24 h came from 3.3–3.6 min a game in the `qe-ABC-228-ii` and `qe-ABC-241` R smokes. This
>   run's games were shorter, likely because 36 of 40 ended in mate (QE's reading).
> - **How firm it is.** The rate depends on game length, and 40 games is a small sample for a rate. Read 18.5 h as the
>   central figure and the old 22–24 h as the slow case if games run longer. It is still an estimate: the batch reads
>   its own wall.
> - **Nothing graded moves.** A6 was MET as written: both numbers were reported from the run's own times. Scheduling an
>   ALONE run of about 18–20 h, or a narrower batch, is the Orchestrator's call.

> **UNBLOCKED 2026-10-30 by the owner, folded by BA/PM** (task `bapm-ABC-242-225-owner`, records only, at `main`
> `5090a4d6`; `src/`, `tools/` and `data/` untouched). His words, verbatim (`orch-2026-10-30a` `…65848126`):
> *"ABC-242: accept, ABC-225 - approve to run one at a time"*.
>
> - **A5 runs at `--concurrency 1`, one game at a time**, by the owner's word. This settles the 2026-10-30 thermal
>   block (QE-225-b: a Tctl median of 87.05 °C at width 2 in `qe-ABC-225` `…3a53bdfc`), using QE's option (iii).
>   - `rpair` already takes `--concurrency C` (1–8, default 2) on `grugops/ABC-225`, so no tool change is owed for
>     it. QE passes `--concurrency 1` explicitly.
>   - The 85 °C Tctl-median stop line and ALONE still hold. A new PREREG goes with the re-run, as QE asked.
> - **The width-1 wall of the A5 smoke (40 games):**
>   - About **2 h**, double the width-2 estimate of about 1 h.
>   - The recorded width-1 R rate at 4 000 ms puts it a little higher, at **about 2.2–2.4 h**. The R smokes of
>     `qe-ABC-228-ii` and `qe-ABC-241` took 36.1 and 32.6 min for 10 games each, at `--concurrency 1` and skytalix
>     `st=4`, which is 3.3–3.6 min a game.
>   - The figure is an estimate. A6 reads the real one.
> - **The budget line stands: `rpair`'s `budget: 3000` moves to 4 000** (the dated line below, `bapm-ABC-228-merge-fold`;
>   `A1`, "the same pins as `r`"). The SE hop `se-ABC-225-main` takes `main` into this branch by **merge**, not
>   rebase. Read "rebase" in the two dated lines below as that merge.
> - **A6 is re-worded for width 1.** A smoke at width 1 cannot project a width-2 pair (QE-225-b (iii)), so A6 now
>   projects the full pair at width 1 and no longer grades the width-2 ≤ 10 h estimate. By the rate above, a
>   400-game pair at width 1 is **about 22–24 h** ALONE, against about 9 h at width 2. That is an estimate (A6 reads
>   it). *(Restated 2026-10-31 from A6's reading: about 18.5 h, range 17.5–19.4 h; see the block at the top.)* The width of `EPIC-010`'s batch is not set by this word, and it is the Orchestrator's to schedule or take to
>   the owner.
> - **Column: Blocked → In Development** (the Orchestrator's board, 18:10Z). The order is `se-ABC-225-main` (merge
>   and budget), then QE re-reads A5 and A6 ALONE at width 1. **DoR stays 10/10.**

> **Dated line 2026-10-30 by BA/PM** (task `bapm-ABC-228-merge-fold`, records only). **(ii) is on `main`:** `ABC-228`
> merged at `e42b637b`, and `tools/rating/rating.ts` R mode now passes skytalix 4000 (`mode === "r" ? 4000`). So the
> follow-up below applies when this branch rebases: `rpair`'s `budget: 3000` moves to **4 000** in the same rebase.
> `A1` ("the same pins as `r`") requires it, because `r` now plays 4 000 ms. Scope 1's "`skytalix` at 3 000 ms" reads
> 4 000 ms from that rebase. `A3`'s arithmetic rows read the 3 000 ms records and do not move. Still Blocked (thermal,
> the owner's call).

> **Dated line 2026-10-30 by BA/PM** (task `bapm-q3c-oq228ii-fold`, records only). OQ-228-1 is (ii) (`ADR-0053` d10):
> on an `ABC-228` `A8` miss, level 5 plays 4 000 ms, and the batches run both sides at 4 000 ms. **`ABC-228` carries
> the `r` mode literal 3000 → 4000** (`tools/rating/rating.ts:405` on `main`). This branch's `rpair` passes its own
> `budget: 3000` (`9988a778`, `:660`). When it rebases onto a `main` that carries (ii), that value moves to 4 000 in
> the same rebase. If (ii) is not built, nothing changes. No scope or acceptance line changes; still Blocked.

> **RE-SCOPED 2026-10-29 by BA/PM** (task `bapm-owner-words-b`, records only). The owner set Q4 = (e), extended
> (`orch-2026-10-29g` `…278e149b`): a 10-game D smoke and a 10-game R smoke per value-changing ticket, then a batched
> major validation later. The cut said "under (a) or (d) it is closed unbuilt"; (e) is neither, so its purpose was
> re-checked:
>
> - **Not the per-ticket reading any more.** The smokes run on today's harness as it is: `r <sha> <out> --elo 1910
>   --rounds 5` and `d <candidate> <base> <out> --budget-ms 1500 --rounds 5` (10 games each; `tools/rating/rating.ts`
>   usage lines 5–6, `--rounds` read at line 328). No `tools/` change is needed for them.
> - **It is the batched validation's instrument.** Each batch, and `EPIC-010` M2 at the close, is an interleaved R
>   pair: the batch's head against its base, 200 + 200 games. Two `r` runs back to back carry the order and drift
>   confound that `EPIC-008`'s close carried. That pain is unchanged, so the mechanism, the scope and A1–A6 stand.
> - **Kept, re-scoped, not renumbered.** Its place in milestone 1 moves from "before every value-changing reading" to
>   "Done before milestone 1's batch", which reads after `ABC-228`, `ABC-229` and `ABC-230` merge.
> - **Wait:** none. Q4 is answered. **DoR 9/10 → 10/10, Backlog → Ready** (P2). It may be built beside the In Design
>   work of milestone 1; it is `tools/` only and plays 40 games once (A5).
>
> **Cut 2026-10-29 by BA/PM** (task `bapm-epic010-improvements`, records only, at `main` `f45aea95`). § B item 2,
> after the Architect's `arch-epic008-rd` (`…0c5d62f4`, `…9d172446`). Waited on Q4 (b) or (c) until the re-scope above.

> **Result 2026-10-29 by SE** (task `se-ABC-225`, branch `grugops/ABC-225`, code `83751dc0`; notes
> `20261029T210343Z-software-engineer-decision-e58c4d25`, `…-observation-868049fb`, `…-observation-14fdbedc`).
> `rating.ts rpair <base> <candidate> <out>`: E 1 910 default, width 2, blocks of 10 openings, ABBA order. It pools each
> build's blocks by cutechess-cli 1.5.1's own Elo formula, checked against each block's line. It prints the pair
> X₂ − X₁ ± √(Y₁² + Y₂²) with EPIC-008's states and the pentanomial (information). It writes `nps.log` per block per
> build and `thermal.log` every 10 s, with placeholders for host paths. `--dry-run` in every mode. No game was played.
> A1–A4 met offline (`node --test tools/rating/pair-check.ts`, 22/22): A1 only start, count and output paths differ
> from `r`. A2 10 alternating blocks, 1–100 once per build. A3 −82.9 ± 73.8 and −82.9 ± 64.3 from the r1/r2 records.
> A4 any fault makes the build and pair UNRESOLVED, and the run halts. `r`/`d` defaults: `cmd.txt`, argv,
> `summary.txt`, `machine.txt` byte-identical to `main`'s harness (stub cutechess-cli). lint, typecheck and build 0.
> `npm test` 63 files / 2 128, skips 0. **A5 and A6 are QE's** (`rpair … --rounds 10`, 40 games, ALONE).

## Problem

- **User:** QE/E2E, who reads each batched validation and `EPIC-010` M2 (Q4 = (e)), and the owner, who reads the
  result to see whether things got worse (his Q5 word).
- **Pain:** `tools/rating/rating.ts` has two modes, `r` (one build against Stockfish) and `d` (candidate against
  base). Two `r` runs back to back carry the fixed-order and drift confound that `EPIC-008`'s close carried
  (`EPIC-008` § close block, "Fixed order"). The tool reports cutechess's unpaired Y only; the opening-paired error
  read −82.9 ± 64.3 against the tool's ± 73.8 (`…9d172446` § 4). Host speed is not gauged by the opponent's nps.
- **Value:** one command, one pin set, the two builds read in the same window against the same opponent, with the
  confounds that `arch-epic008-rd` had to dig out of raw files reported up front.

## Scope

1. A third mode in `tools/rating/rating.ts`: `rpair <base> <candidate>`. Each build is read exactly as `r` reads it
   (Stockfish 19 at the frozen E = 1 910, `skytalix` at 3 000 ms, the pinned openings, both colours).
2. **Interleaving:** the 100 openings are split into blocks of 10 (20 games per build per block); blocks alternate
   base-first and candidate-first.
3. **Output:** per build, cutechess's `Elo difference: X +/- Y`; the pair's X₂ − X₁ ± √(Y₁² + Y₂²); and the
   opening-paired (pentanomial) difference and its 95 % half-width, labelled information.
4. **Host log:** Stockfish's median nps per block from the `-debug all` log, and a Tctl and busy-core frequency sample
   every 10 s (the `qe-epic008-q4c` sampler shape).
5. The tool's `summarise` checks (0 faults, games equal to pinned, raw files present) apply per build.

## Out of scope

- Moving any pin: E, openings, budgets, cutechess and Stockfish versions. A `tc=` clock mode (`EPIC-009`).
- `src/` and `data/`. `npm test` (`NFR-008`).

## Acceptance criteria

- **A1 (same pins as `r`).** **Given** `rpair` and `r` on the same build, **then** the cutechess argument vectors for
  that build differ only in `-openings` start/count and output paths (a dry-run print compares them byte for byte).
- **A2 (interleaving).** **Given** a dry run, **then** the printed schedule has 10 blocks per build, alternates order
  per block, and covers openings 1–100 exactly once per build with both colours.
- **A3 (the arithmetic).** **Given** two fixed cutechess outputs and PGNs from the records (`qe-epic008-close` r1
  and r2), **then** the pair difference reads −82.9 ± 73.8 and the pentanomial reads −82.9 ± 64.3 (± 0.1), as
  `…9d172446` § 4 computed.
- **A4 (faults).** **Given** one block with a fault (illegal move, disconnect, stall, time forfeit), **then** that
  build's reading is UNRESOLVED by `EPIC-008`'s states, and the pair is UNRESOLVED.
- **A5 (host log).** **Given** a real 2-block smoke run (40 games, ALONE, **`--concurrency 1`**: the owner's word
  2026-10-30), **then** the log has one nps value per block per build and ≥ 1 thermal sample per 10 s, and no
  absolute host path or username appears in any output file.
- **A6 (cost; re-worded 2026-10-30, `bapm-ABC-242-225-owner`).** The smoke run's wall at width 1 is reported, with
  its start and end times and its games per hour. The full 400-game pair's wall **at width 1** is projected from it,
  estimated at about 22–24 h *(read 2026-10-31: 18.46 h, range 17.5–19.4 h; the block at the top)*. A width-2 figure is not projected (QE-225-b (iii)). A6 is MET when both numbers are
  reported from the run's own times. *(Was: "projected from it (target ≤ 10 h at width 2, the R rate 44–46
  games/h)".)*

## NFR triggers

- **`NFR-008`:** no new file under `src/`; any tool test runs outside the default lane, as `ABC-204`'s did.
- **Security (ASVS L1):** two sha arguments, validated as `[0-9a-f]{7,40}` before any `git` call; no shell string
  concatenation. No host paths in outputs (`ADR-0049` d4).
- **Heat:** the smoke run is ALONE, on AC, with the thermal log, at `--concurrency 1` (owner 2026-10-30). It stops
  when the Tctl median goes over 85 °C. For reference, the width-1 R smokes of `ABC-230` read a median of 73.75 °C.

## Test notes

1. A2 and A1 by dry run, no engines started. A3 offline from committed records. A5 is the only real run (≈ 1 h at
   width 2; *2026-10-30:* ≈ 2 h at width 1, ≈ 2.2–2.4 h by the recorded 4 000 ms width-1 R rate).
2. `tools/` only, no production line: no UAT. QE reads A5.

## Size and priority

- **Size: M.** One mode, a scheduler, a pentanomial computation, a sampler; `ABC-204` was M for the whole harness.
- **Priority: P2.** Milestone 1's batch waits on it; no per-ticket reading does (re-scoped 2026-10-29).

## Dependencies

- **Owner:** Q4 answered 2026-10-29: (e), extended. It needs no further owner word. *(2026-10-30: the thermal block
  was the owner's call, and he answered it: "approve to run one at a time", `…65848126`.)*
- *(2026-10-30.)* `se-ABC-225-main` (merge `main` in; `rpair` budget 3 000 → 4 000) comes before QE's re-run.
- `ABC-204`'s host pins (re-pinned on this host). No ADR: `tools/rating/rating.ts` cites none, and this adds no
  engine behaviour. Architect/Design reviews the pentanomial formula at design.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ `arch-epic008-rd`'s confounds |
| 2 | scope and out-of-scope | ✅ 5 items; no pin moves |
| 3 | INVEST | ✅ independent of every engine ticket; M; testable offline |
| 4 | testable, measurable acceptance | ✅ A1–A6, A3 against recorded numbers |
| 5 | dependencies known | ✅ `ABC-204` pins; Q4 answered |
| 6 | NFR triggers with targets | ✅ `NFR-008` 0 lane files; input validation; heat |
| 7 | test notes | ✅ 2 |
| 8 | size | ✅ M |
| 9 | priority | ✅ P2 |
| 10 | no major unresolved blocker | ✅ none (Q4 answered 2026-10-29; the thermal block answered 2026-10-30: width 1) |

**Done (merged `59dc3ab4`, 2026-10-30; folded 2026-10-31, `bapm-ABC-242-close`).** It is the instrument of
milestone 1's batch, which runs at `--concurrency 1`.

*(Was: "DoR 10/10 (re-scored 2026-10-29; held 2026-10-30, `bapm-ABC-242-225-owner`). In Development. Pull before
milestone 1's batch is due; it never runs beside an ALONE reading.")*
