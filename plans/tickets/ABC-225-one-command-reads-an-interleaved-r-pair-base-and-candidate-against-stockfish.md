---
id: ABC-225
title: "One command reads an interleaved R pair: base and candidate against the same Stockfish, in alternating blocks, with the opening-paired error and a host log"
status: in-development
column: In Development
size: M
priority: P2
epic: EPIC-010
---

# ABC-225: an interleaved R pair in the rating harness

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
>   it). The width of `EPIC-010`'s batch is not set by this word, and it is the Orchestrator's to schedule or take to
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
  estimated at about 22–24 h. A width-2 figure is not projected (QE-225-b (iii)). A6 is MET when both numbers are
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

**DoR 10/10 (re-scored 2026-10-29; held 2026-10-30, `bapm-ABC-242-225-owner`). In Development.** Pull before
milestone 1's batch is due; it never runs beside an ALONE reading.
