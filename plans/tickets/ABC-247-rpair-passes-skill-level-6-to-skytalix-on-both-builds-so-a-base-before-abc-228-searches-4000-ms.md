---
id: ABC-247
title: "`rpair` passes `Skill Level` 6 to skytalix on both builds, so `go movetime 4000` searches 4 000 ms on a base whose level 5 is 3 000 ms; the `r` and `d` paths are unchanged (tools only)"
status: done
column: Done
closed: "2026-10-31, merged to main at 3af97f71; QE PASS (qe-ABC-247, 236bbe39); tools only, no UAT"
size: XS
priority: P1
epic: EPIC-010
---

# ABC-247: `rpair` plays both builds at `Skill Level` 6

> **CLOSED, Done, folded 2026-11-01 by BA/PM** (task `bapm-m1-batch-fold`, records only, at `main` `832ff246`;
> nothing run). The page read `ready` after the merge; this fold closes it. QE's verdict is **PASS** (`qe-ABC-247`
> `…236bbe39`, PREREG committed at `3050c636` before any check). It was **merged at `3af97f71`** on 2026-10-31.
> `tools/` only, so **no UAT** (Test note 1).
>
> - **A1–A4 MET** as QE re-ran them at `cec9c252`: `pair-check` 25 / 25; mutation M1 red (3 tests); `r` / `d` argvs
>   byte-equal to `main`; the batch command gains exactly 20 `option.Skill Level=6` lines. A2 (ALONE): base 0 moves at
>   3.0 s and 84 at 4.0 s, head 0 and 125; the control without the token 95 at 3.0 s and 0 at 4.0 s.
> - **Test note 3 held in the batch it was cut for** (`qe-EPIC-010-m1-batch-2` `…428e3797`): levels 5 / 6 read rate 0
>   at both SHAs with `LEVELS[6]` = 5 000 ms; block 01 read 943 (base) and 951 (head) skytalix moves at 4.0 s and 0 at
>   3.0 s; all 20 PGNs read 0 at 3.0 s. The batch read NOT LOSS (NEUTRAL) (`…1a53a7f9`).
> - **QE's five INFO findings, dispositioned:** QE-247-a (the clock reader's regex) was fixed in QE's reader and reused
>   by the batch. QE-247-b (redact dry-run prints) was applied in the batch PREREG. QE-247-c (two off-path `skill`
>   lines) needs nothing. QE-247-d (probe build method) is moot: the batch built its own clones and recorded their dist
>   trees. QE-247-e (head SHA) is moot: the batch named its own head. No follow-up ticket.
> - Notes: `.grugops/context/bapm-m1-batch-fold/notes/`.

> **Cut 2026-10-31 by BA/PM** (task `bapm-rpair-level6-cut`, records only, at `main` `278a9bb7`; nothing run, built
> or timed, because `qe-ABC-245` holds the host ALONE; `src/`, `tools/`, `data/`, the board and the ADRs untouched).
> Source: the Orchestrator's ruling **route (A)** (`orch-2026-10-30a` `…fb0c8978`), on QE's STOP of milestone 1's
> batch before game 1 (`qe-EPIC-010-m1-batch`: PREREG `…93c1fb08`, evidence `…5967dfc1`, STOP `…21029f54`, gap
> **QE-M1B-a**, HIGH). `ADR-0053` d10 is unchanged; this ticket keeps its intent ("the batches run both sides at
> 4 000 ms").

## Problem

- **User:** the QE who runs `EPIC-010`'s milestone-1 batch, and the owner, who reads its LOSS / not-LOSS call.
- **Pain:** `rpair` gives skytalix `st=4 timemargin=1000` and no `Skill Level`, so cutechess sends `go movetime 4000`
  and the engine runs at its default level 5. `go()` caps the request at `LEVELS[skill].budgetMs`. At the batch's
  base `ca6e675c` (main just before `ABC-230`), `LEVELS[5]` is `{ 3 000 ms, rate 0 }`. At the head `72a65fb7` it is
  `{ 4 000 ms, rate 0 }` (`ABC-228`, commit `8c82399f`, merged `e42b637b`). The pinned batch would play the base at
  3 000 ms against the head at 4 000 ms.
- **Evidence (QE, `…5967dfc1`):** a `go movetime 4000` probe read `bestmove` after 3 001 ms at the base and 4 001 ms
  at the head. After `setoption name Skill Level value 6`, both read 4 001 ms. `qe-ABC-225-w1`'s A5 (two builds
  before `ABC-228`) already played at 3 000 ms: 0 of 905 and 0 of 1 000 `info … time` values above 3 100 ms, and
  895 and 991 PGN clocks at 3.0 s with none at 4.0 s.
- **Why it matters:** the time gap favours the head (1.33 × the base's thinking time), so it biases the one call
  the batch exists to make toward "not LOSS". A not-LOSS read that way cannot separate "the merges did not hurt"
  from "the head had 33 % more time". Every base the batch rule allows comes before `e42b637b`, so `rpair` as it is
  cannot run milestone 1's batch as specified.
- **Why level 6 fixes it:** `LEVELS[6]` is `{ 5 000 ms, rate 0 }` at both SHAs (read in git at `ca6e675c` and
  `72a65fb7`). Under level 6, a `go movetime 4000` is capped at min(4 000, 5 000) = 4 000 ms and takes the rate-0
  path, which is what level 5 does at the head. QE read the skill as reaching only that `LEVELS` lookup in `go()`
  (base `src/uci-session.ts:286`, head `:382`). The SE confirms it (A3).
- **Value:** the batch reads what `ADR-0053` d10 and `EPIC-010` specify, for one argv token.

## Scope

1. **`rpair` gives skytalix `option.Skill Level=6` on both builds**, in every block's `cutechess-cli` argv, base and
   candidate alike. How the SE carries it (an `ArgSpec` field, or an argument to `sky()` set by `rpair` only) is the
   SE's call. The `rpair` dry run prints it.
2. **`tools/rating/pair-check.ts` pins it** (A1), and A1's "`rpair` = `r`'s argv except openings start/count and output
   paths" is restated to allow exactly this one added option on the skytalix engine.
3. **The SE's confirmation at both SHAs** (A3), recorded in the build note with file:line at each SHA.

## Out of scope

- **The `r` (R smoke) and `d` (D smoke) paths: left alone.** BA/PM's call and reason are in § The D and R smoke
  paths, below. Their argv must not change (A1 (c)).
- Any edit under `src/` or `data/`. `LEVELS`, `DEFAULT_LEVEL` and `go()` do not change.
- `rpair`'s unread `budget: 4000` field (QE-225w1-a). Its fold rule fires on a ticket that **moves** the R budget.
  This one does not move it, so the field is not touched. *(If the SE's design threads the skill through
  `ArgSpec` and dropping `budget` costs nothing extra, the SE may say so in the build note; it is not acceptance.)*
- Passing level 6 only to a build whose `LEVELS[5]` is below 4 000 ms (QE's alternative). Both builds get the same
  option, so the two sides are read under one identical argv except for the clone path.
- The batch itself, its PREREG and its wall. They are `qe-EPIC-010-m1-batch`'s, after this ticket is Done.

## The D and R smoke paths (BA/PM's call: both left alone)

- **D (`d`):** both skytalix builds play at `--budget-ms` B, and `D_BUDGETS_MS` admits only 3 000, 2 500, 2 000,
  1 500 and 1 000 ms. The frozen smoke B is 1 500 ms. `LEVELS[5]` is 3 000 ms or more at every SHA in this epic, so a
  D side is never capped. The records agree: every move in the four D smokes' PGNs (`ABC-230`, `ABC-228`, `ABC-241`,
  `ABC-229`) reads 1.5 s. Adding the option would change nothing in the search and would make the D argv differ from
  every ledger row's.
- **R (`r`):** an R smoke plays **one** skytalix build, the candidate, against Stockfish. No base plays in it. The R
  literal 4 000 and `LEVELS[5]` = 4 000 entered in the same commit (`8c82399f`, merged `e42b637b`). Every candidate
  from now on is rebased on a `main` that carries both, so `go movetime 4000` is never capped there. The records
  agree: the three R smokes at 4 000 ms read 476, 430 and 410 skytalix moves at 4.0 s and 0 at 3.0 s. Leaving R alone
  keeps it reading the **shipped default level 5**, and keeps the ledger's rows comparable with each other by
  construction.
- **The cost of that call, stated:** after a passing batch, its head's R score (read at level 6) becomes the trend
  reference for R smokes read at level 5. They are the same search only while level 5 and level 6 match below
  4 000 ms: both rate 0, `LEVELS[5].budgetMs` = 4 000 and `LEVELS[6].budgetMs` ≥ 4 000, and the skill reaches nothing
  else in `go()`. A3 establishes that at the head. A ticket that changes `LEVELS[5]` or `LEVELS[6]`, or what the skill
  reaches in `go()`, re-opens it. `G9` binds only `LEVELS[1..5]`, so a level-6-only change would not be caught by
  `G9` (Test note 3 carries the guard).

## Acceptance criteria

- **A1 (the pin in the argv).** **Given** `node tools/rating/rating.ts rpair <base> <head> <out> --dry-run` (any two
  SHAs, any `--rounds`), **when** `node --test tools/rating/pair-check.ts` reads its argvs, **then**:
  - (a) every block's argv, for both builds, carries the skytalix engine token `option.Skill Level=6` **exactly
    once**, inside the skytalix `-engine` group, and the Stockfish group carries no `Skill Level` option;
  - (b) each `rpair` block argv differs from `r`'s argv only in the openings start/count, the output paths and that
    one token (A1's allowed set, restated);
  - (c) the `r` and `d` dry-run argvs carry **no** `Skill Level` token, and are otherwise unchanged from `main`
    (byte-equal argv lists for the same arguments);
  - (d) the pair-check run reports 0 fail and 0 skipped, with at least one new test. Removing the token from `rpair`
    turns at least one test red (the SE's mutation check, re-run by QE; never committed).
- **A2 (the probe: 4 000 ms at both SHAs).** **Given** scratch builds of base `ca6e675c` and head `72a65fb7` (or the
  head as `main` reads at QE time, if `src/` has moved), **when** QE runs the argv the `rpair` dry run prints for
  block 01 through `cutechess-cli`, changed only to `-rounds 1` and a scratch output, once per SHA (2 games each),
  **then** for each SHA:
  - the `-debug all` log shows `setoption name Skill Level value 6` sent to skytalix before its first `go`;
  - every skytalix `go` is `go movetime 4000`;
  - the PGN's skytalix move clocks read **0 moves at 3.0 s** and **at least 20 moves at 4.0 s** (book and instant
    replies, under 1 s, are not counted);
  - 0 skytalix faults and 0 losses on time.
  A control is read beside it, at the base only: the same argv **without** the token reads skytalix moves at 3.0 s
  (or a plain UCI `go movetime 4000` at the default level reads `bestmove` between 2 900 and 3 100 ms), so the probe
  is shown to tell the two apart. These are probe games and grade no strength.
- **A3 (the level reaches only the cap).** **Given** `src/uci-session.ts` (and every module it hands `skill` to) at
  `ca6e675c` and at the head, **then** the SE records, with file:line at each SHA, that:
  - `skill` is read in `go()` only as `LEVELS[skill]`, for `budgetMs` (the cap) and for `blunderRate` (the
    blunder branch, taken only when it is above 0);
  - `LEVELS[5]` and `LEVELS[6]` are both `blunderRate: 0` at both SHAs, `LEVELS[6].budgetMs` is 5 000 at both, and
    `LEVELS[5].budgetMs` is 3 000 at the base and 4 000 at the head;
  - at the head, the clock-mode gate (`timeMode`, `ADR-0052` D1) is `level` by default, so the cap applies under
    `rpair`;
  - nothing else reads `skill` on a `go movetime` path (book, `OwnBook`, `info` lines, the TT, the hash option).
  If any of these fails, the SE STOPS before building and hands back to BA/PM and the Orchestrator (route (A) rests on
  it).
- **A4 (gates).** `npm run lint`, `npm run typecheck` and `npm run build` exit 0. `npm test` green with 0 skips and
  skip-integrity clean. No file under `src/` or `data/` differs from `main` (`git diff --stat main -- src data` is
  empty).

## NFR triggers

- **`NFR-008` (default lane ≤ 10 s):** not touched. `pair-check.ts` runs under `node --test`, not vitest, and no
  `src/` file changes. `G8` is not re-read unless the diff touches a vitest file.
- **`NFR-004` / `NFR-005` / `G5` / `G9`:** no production line changes, so none moves.
- **Records (`ADR-0049` d4):** the new token carries no host path; the dry run's redaction is unchanged.
- **Security (ASVS L1):** no input path. The option is a fixed literal in a harness argv.

## Test notes

1. **Who reads what.** The SE builds (A1, A3, A4) and reports A3 at both SHAs. QE re-runs A1 and A4, runs A2 ALONE
   (4 probe games plus 1 control, about 15–20 min of games plus two scratch builds, an estimate), and gives the
   verdict. `tools/` only, so **no UAT**; the QE verdict closes it.
2. **A2 runs ALONE** (it starts engines on the real clock), with the usual wait-clear. It is a probe, not a reading:
   no S-row, no Elo, no ledger row.
3. **A guard for every batch that runs on this argv** (for the batch's PREREG; recorded here so it is not lost).
   Before game 1, QE reads `LEVELS[5]` and `LEVELS[6]` at both SHAs and confirms: both `blunderRate: 0`,
   `LEVELS[6].budgetMs` ≥ 4 000, and `go()` reads the skill only for the cap and the blunder branch. After block 01 of
   each build, the PGN's skytalix clocks read 4.0 s and none 3.0 s. Either miss is a STOP.
4. Cutechess sends a `option.<name>=<value>` only for an option the engine declares. Skytalix declares `option name
   Skill Level type spin default 5 min 1 max 7` at both SHAs (read in git, `src/uci-session.ts` base `:359`, head
   `:462`). A2's `setoption` line is what proves it is sent.

## Size and priority

- **Size: XS.** One argv token on one path, one pair-check pin and a restated allowed set; a code read at two SHAs;
  a 4-game probe.
- **Priority: P1.** It blocks milestone 1's batch, which blocks the 4 000 ms trend reference (layer 2) and the
  milestone's close.

## Dependencies

- **`ABC-225` Done** (`59dc3ab4`): `rpair` and `pair-check.ts` exist on `main`.
- **Order only:** the Orchestrator's ruling (`…fb0c8978`): `qe-ABC-245` runs ALONE first, then the SE builds this,
  then the tools QE (A2 ALONE), then the batch.
- **Shared files:** `tools/rating/rating.ts` and `tools/rating/pair-check.ts`. No ticket in flight names them
  (`UNKNOWN - verify` at the pull; `ABC-245` and `ABC-246` are test-only under `src/`).
- **No ADR.** `ADR-0053` d10's intent is kept; the Orchestrator ruled route (A) needs no amendment.

## Definition of Ready

| # | check | state |
|---|---|---|
| 1 | problem clear | ✅ the base caps `go movetime 4000` at 3 000 ms; QE's probe and A5's clocks show it |
| 2 | scope and out-of-scope | ✅ 3 items; `r`, `d`, `src/`, `data/`, `budget` field and the batch out |
| 3 | INVEST | ✅ one token on one path; independent of every engine ticket; testable offline (A1) and by a 4-game probe (A2) |
| 4 | testable, measurable acceptance | ✅ A1 token exactly once per block, `r`/`d` argv byte-equal, mutation red; A2 0 moves at 3.0 s and ≥ 20 at 4.0 s per SHA, control at 3.0 s; A3 file:line at both SHAs; A4 gates, empty `src`/`data` diff |
| 5 | dependencies known | ✅ `ABC-225` Done; order behind `qe-ABC-245` |
| 6 | NFR triggers marked, measurable | ✅ `NFR-008` untouched (no vitest file); no production line |
| 7 | test notes present | ✅ 4 notes, including the batch guard |
| 8 | size | ✅ XS |
| 9 | priority | ✅ P1 |
| 10 | no major unresolved blocker | ✅ the host order is the only wait |

**DoR 10/10. Ready.** The board move is the Orchestrator's.
