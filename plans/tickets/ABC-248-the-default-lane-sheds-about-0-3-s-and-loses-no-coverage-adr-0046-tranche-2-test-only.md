---
id: ABC-248
title: "The default lane sheds about 0.3 s and loses no coverage: `QE-208-a` sampled more sparsely and `QE-208-b` on a cheaper root, `ABC-167` A5's duplicated searches moved to the file's `ENGINE_DEEP` branch under default-lane kill parity, and A4-a2 on R2 (`ADR-0046` tranche 2; test-only)"
status: ready
column: Backlog
size: S
priority: P1
epic: EPIC-010
feature: —
---

# ABC-248: tranche 2 of the lane remedy, T2c + T2a (narrow) + T2d. Two test files

> **Cut 2026-10-31 by BA/PM** (task `bapm-tranche2-ruling`, records only, at `main` `209f4c5f`; nothing run, built or
> timed, because QE holds the host ALONE; `src/`, `tools/`, `data/` and the board untouched).
>
> - **Design:** `ADR-0046` § Addendum 2026-10-31 (`arch-g8-tranche2`, decision `…28d7bc3b`, census `…f1e25b52`).
> - **The ruling:** that ADR's § BA/PM ruling 2026-10-31, where T2-R is accepted with amendments. This page's § BA/PM
>   ruling carries them in full.
> - **What opened it:** `qe-ABC-245`'s `G8` head median, 9.82 s, above the 9.6 s line (`…af467c7b`; `QE-245-b`
>   `…cf53b0ed`).
> - **DoR 10/10. Recommended `Backlog → Ready`, pulled after `ABC-246`.** Column moves are the Orchestrator's.

## Problem

- **User:** the owner, and every agent hop that runs the default lane at a gate.
- **Pain:** the lane sits close to its 10 s level (`NFR-008`).
  - The central value is about **9.5 s**. `ABC-245`'s six `G8` runs pooled read 9.51 s, and adding up from
    `ABC-242`'s 9.41 s agrees. This is an estimate.
  - One head run already read **10.19 s** (`qe-ABC-245`). In a noisy window the head's three runs spanned 0.75 s.
  - Tranche 1 (`ABC-244`) has landed, and the 9.6 s line that opened this tranche is now spent. What is left to watch is
    9.7 s (the owner line, read under W1) and 10 s (`NFR-008`, `ADR-0035` D6).
- **Where the slack is** (census of `se-ABC-221`'s lane report at `c48a6f83`, shape and ranking only):
  - `QE-208-a`'s sweep, 0.40 s in-thread. Its cost is Σ readings × 1 024 nodes whatever the root, so only sparser
    sampling cuts it.
  - `QE-208-b`'s two rows, 0.37 s. Their cost is a depth-6 search on position-6, so a cheaper root cuts it.
  - `ABC-167` A5's six searched rows, 0.33 s. Two of them read nothing another default-lane row does not already
    read. The bare go duplicates four other rows, and "G = 3 500" sends `ABC-171` A6's level-5 go line against the
    same bound. The D4 arithmetic is pinned exactly on the stub seam (`ABC-220` A8, `ABC-212` A12, `ABC-221` A8/A12).
  - `ABC-167` A4-a2, 77 ms. It is time-blind and runs a bare go at step 100, and tranche 1's scope missed it.
- **Value:** about **−0.3 s of lane wall** (est. −0.15..−0.45 s, `UNKNOWN - verify` until A9 reads it), with **no
  default-lane coverage lost**. A change that fails its condition is not made.

## Scope

Two files: `src/search.null-move.test.ts` and `src/uci-session.test.ts`. Line numbers are as read at `209f4c5f`.

| lever | file | rows (line) | change | condition |
|---|---|---|---|---|
| **T2c-a** | `src/search.null-move.test.ts` | `QE-208-a`, "position-6, readings 3 to 25: …" (`:507`, in the describe at `:477`) | sample a subset S of readings 3–25, with Σ S < 322 (the sum of 3..25) | non-vacuity and plant parity (ruling 4) |
| **T2c-b** | `src/search.null-move.test.ts` | `QE-208-b`, "search() on position-6 at depth 6" and "chooseMove on position-6 deepened to 6" (describe at `:514`) | re-root both rows on one cheaper position, still at depth 6 | non-vacuity and plant parity (ruling 4) |
| **T2a (narrow)** | `src/uci-session.test.ts` | `ABC-167` A5 (`:215`): "movetime 100", "white reads wtime", "black reads btime", "G = 3 500, under the default level 5's 4 000", "a bare go", "A5-b3" | each one moves to a `describe` under `RUN_ENGINE_DEEP` (the pattern at `:2169`) **only under default-lane kill parity**; otherwise it stays | ruling 3 |
| **T2d** | `src/uci-session.test.ts` | `ABC-167` A4-a2 (`:194`), `talk(…, 100)` | step 100 → 1 000 if R2 parity holds; else it keeps 100 | ruling 2 (`ABC-244`'s conditions 1–3) |
| (T2d census) | either file | at most **two** more time-blind virtual-clock rows that `ABC-244`'s census did not list | the same rule as A4-a2 | ruling 2; if more than two are found, none joins |

- **"A short clock"** and the pinned rows A5-b1, A5-b2, A5-b4, A5-b5 and A5-c1 stay in the default lane, byte-identical.
- A moved T2a row keeps its `it` title byte-identical. Its `describe` title ends "[deep, ENGINE_DEEP=1]". With
  `ENGINE_DEEP` unset it is not defined, which is the file's existing pattern. It is not a skip.
- **The order inside the ticket is free,** but each lever's evidence is recorded separately, so each one can be
  reverted alone.

## Out of scope

- **T2b:** moving `QE-208-a`, `QE-208-b` or A2's pawn-only depth-6 row to `SEARCH_DEEP`. That trades `ADR-0050`'s guards
  for speed, which is the owner's lever (framing (b)).
- **T2a (wide):** any class P/C row other than the six named. That includes A7's D12 rows, the dropped-token time reads,
  A6-d1, and `ABC-174` A5, `ABC-171` A6, `ABC-212` A9 and the Hash row.
- **Also out:**
  - the `ABC-241` U2 rows (they are the ep guard's only killers);
  - `src/cli.test.ts` and its children (O4), and merging files (O5);
  - a coarser step on any class P row, and a "jump" clock.
- **Every other file.** That means production `src/*.ts`, `vitest.config.ts`, `package.json`, `AGENTS.md`, `tools/`,
  `data/` and `plans/nfr-catalog.md`. `AGENTS.md`'s `ENGINE_DEEP` line still runs the moved rows, and its `-t` form
  reaches one describe (`ADR-0046` T2-R condition 5).
- **The shared helpers stay byte-identical:** `talk`, `dialogue`, `rig`, `session220`, `virtualClock`, `instrument`,
  `probes`, `fenOf` and `parseInfo`.
- **Owner levers:** `NFR-008`'s 10 s, `maxWorkers`, the heap flag, W.
- **`T-QEHOP-GROWTH`'s re-read:** that is its own QE hop (`ADR-0035` B3), not part of this gate.

## BA/PM ruling: T2-R is accepted, with these conditions

**Ruling (BA/PM, 2026-10-31).** `ADR-0046` § Addendum 2026-10-31's T2-R is accepted, and this ticket is its cut. The
dated record is that ADR's § BA/PM ruling 2026-10-31. The Architect's conditions 1–5 bind, as amended here:

1. **No owner word is owed.** D1 ("no row leaves the default lane") was the scope of `ABC-177`'s remedy. The text the
   owner accepted already says tranche 2 re-opens with O3 "for a BA/PM ruling" (D4) and "O3 is tranche 2 if D4 misses"
   (§ Alternatives). T2a (narrow) is a strict subset of O3: six named rows, an existing lane, no new `AGENTS.md` line,
   and parity first. No NFR level, cap, pin, W, step set or lane command moves.
2. **Per changed step (T2d):** `ABC-244`'s conditions 1–3 carry over unchanged.
   - Kill-set parity decides the step: the coarsest step in {1, 10, 100, 1 000} at which the row kills exactly its
     base mutant ids, and never finer than today's.
   - Step 1 000 never turns a search of ≥ 2 clock-check intervals into a one-interval search. A4-a2 passes: 4 000 ms is
     40 intervals at 100 and 4 at 1 000.
   - The mutant list is frozen before any head run.
3. **Default-lane kill parity (T2a).** A row leaves the default lane only if every named mutant it kills at base is
   still killed by **the default lane** at the tip. A row that is the only default-lane killer of any mutant stays.
   - The frozen list holds at least: M01–M11 (as frozen at `ABC-177` A6), and the wrong builds A5's rows name
     (W ≠ G for each side, `movestogo`, `movetime`).
   - It also holds **`WRONGSIDE`**: in level mode the session hands white's search `btime` and black's `wtime`. The
     census marked "white reads wtime" and "black reads btime" as possibly its only default-lane killers
     (`UNKNOWN - verify`). Parity decides.
4. **Non-vacuity and plant parity (T2c).**
   - `QE-208-a`'s `insideNull` is ≥ 3 at the tip.
   - `QE-208-b`'s `underNull` is > 0 in both rows.
   - The new root has ≥ 3 non-pawn pieces for each side, so a null move is legal at its nodes.
   - `ADR-0050`'s plants are killed at the tip as at base: the null move not unmade on abort (`QE-208-a`), and the null
     child's key not written, in each recursion (`QE-208-b`).
5. **Retitles (BA/PM's word).** `QE-208-a`'s `it` title states the readings it samples, exactly. `QE-208-b`'s two `it`
   titles name the new root (a fixture name `fenOf` knows, or the FEN's source). Both `describe` titles stay. No other
   title changes.
6. **A moved row runs green in its deep lane** at this ticket's QE:
   `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts -t "<moved describe>"`.

**Why accept.** It is the only set that sizes to the noise reading (about −0.3 s against a lane centred near 9.5 s)
with no coverage lost by construction, and each lever reverts alone. **Why one ticket:** three gates for one −0.3 s
remedy would each be below what one n = 3 `G8` can resolve. **Why not T2b:** it buys about 0.1 s more by taking two
`ADR-0050` guards out of the default lane, where no other row holds them, and that trade is the owner's.

## Acceptance criteria

The base is `main` at the commit the build branches from, carrying `ABC-246`'s merge. The tip is this ticket's
delivered commit.

**Build (Software Engineer)**

- **`A1` (R1 census).** **Given** the build note, **then** it holds one line per row in § Scope, census candidates
  included, with:
  - the title;
  - the budget and step, or the readings and depth, at base and at the tip;
  - the reads per search (⌈budget ÷ step⌉), or Σ S for `QE-208-a`, at base and at the tip;
  - the class: time-blind, or reads time (and which assertion reads it).
- **`A2` (each lever's decision is recorded).** **Given** the build note, **then**, for each of the six T2a rows,
  A4-a2 and each census row, it says **moved or stayed** (T2a), or **the step chosen** (T2d). It cites the SE's parity
  result under § BA/PM ruling 2–3. For T2c it gives S and the new root, with `insideNull` and `underNull` read at the
  tip.
- **`A3` (counts and names).** **Given** the vitest JSON report of the default lane at base and at the tip, **then**:
  - `src/search.null-move.test.ts`'s count is equal. Its sorted full names differ only by the retitles in ruling 5;
  - `src/uci-session.test.ts`'s count at the tip equals base minus the T2a rows moved. Its sorted names equal base's
    with exactly those rows removed;
  - all pass, with 0 skipped. The lane total equals base minus the T2a rows moved.
- **`A4` (what the diff may touch).** **Given** `git diff <base> <tip>`, **then**:
  - `--name-only` prints only the two files;
  - no `expect(` line changes in a row that stays in the default lane, except in `QE-208-b` where the re-root needs it
    (its non-vacuity `expect`s stay);
  - the moved T2a rows' bodies and assertions are byte-identical; only their enclosing block moves;
  - in A4-a2 and each census row, only the step literal changes;
  - added comments only cite `ABC-248` or `ADR-0046` § Addendum 2026-10-31;
  - the helpers in § Out of scope are byte-identical;
  - scratch instrumentation (A7) is not committed.

**Gate (QE, then Security/NFR)**

- **`A5` (default-lane parity, T2a and T2d).** **Given** the mutant list of ruling 3, `WRONGSIDE` included, frozen
  before any head run and recorded in the gate report, **when** each mutant is applied to a scratch copy of production
  and the default lane's `src/uci-session.test.ts` runs at base and at the tip, **then** every mutant killed at base is
  killed at the tip. Each A4-a2 or census row also kills exactly its base ids (ruling 2). The SE's result is
  re-confirmed by QE.
- **`A6` (plant parity, T2c).** **Given** `ADR-0050`'s two plants, the null move not unmade on abort and the null
  child's key not written (each recursion), **when** each is applied in scratch, **then** `QE-208-a` turns red under
  the first and both `QE-208-b` rows turn red under the second, at the tip as at base. `insideNull` ≥ 3 and
  `underNull` > 0 are read and recorded.
- **`A7` (node census, not timing).** **Given** `deepen`'s return instrumented in scratch (as at `ABC-244` A7), **then**
  a table gives nodes per changed row at base and at the tip.
  - Every T2c and T2d row whose input changed reads **strictly fewer** nodes at the tip.
  - Each T2a row is listed as moved or stayed.
  - The summed default-lane delta is reported, in nodes.
- **`A8` (`N8-LANE`, the two-file set).** **Given** `ADR-0035` D2 as amended, the set `src/search.null-move.test.ts` +
  `src/uci-session.test.ts`, and the runner and arms as at `ABC-244` A8, **then**:
  - the charge is ≤ **650 ms CPU** (`N8-LANE` MET);
  - H − B CPU and wall medians, with intervals, are reported as the narrow-set saving.
- **`A9` (`G8`, the design target, W1).** **Given** base and tip, **when** QE reads `npm test` interleaved b h h b b h,
  after a wait-clear, as at `ABC-244` A9, **then** the report gives:
  - H's median and the `NFR-008` state. ≤ 10 s is MET;
  - H − B;
  - H against the **design target ≤ 9.4 s**. This is not an NFR level.

  How a reading routes:
  - **A miss of 9.4 s with H ≤ 10 s does not fail this ticket,** and no tranche 3 opens.
  - **H > 9.7 s** starts W1 (`ADR-0046` § BA/PM ruling 2026-10-31): a head-only n = 3 re-read of the same tree, in a
    second admissible window ≥ 30 min later. If the median of the six head runs is above 9.7 s, it goes to the owner.
    W1 does not hold this ticket's verdict or merge.
  - **H > 10 s** goes to the owner (`ADR-0035` D6), and the ticket holds at the gate until his word. No cap, pin, bar
    or level moves to get under.
- **`A10` (the deep lane).** **Given** the tip, **then** the command in ruling 6 runs the moved rows green, and with
  `ENGINE_DEEP` unset they are not collected.
- **`A11` (gates).** **Given** the tip, **then**:
  - lint, typecheck, unit and build are green;
  - the default lane has 0 skips, and `test-skip-integrity` and `lane-inventory` report no findings;
  - every row that stays is green, with its title and assertions unedited (A4, ruling 5).

## NFR triggers

- **`NFR-008`:** `npm test` median wall **≤ 10 s** at load1 ≤ 8 on the declared stack (A9). CPU is reported.
- **Design target:** H median ≤ **9.4 s** at this gate (A9).
- **The owner line:** 9.7 s, read on this gate's head median and on every later admissible one, under W1 (A9).
- **`N8-LANE`:** charge ≤ **650 ms CPU** on the two-file set (A8).
- **R1:** the census line (A1) is present. Reads per search drop on every T2d row moved (40 → 4 on A4-a2).
- **`NFR-010`** and the heap caps are untouched, and no config or flag moves.
- **Security:** not triggered. Test-only, with no input surface.

## Test notes

1. **Freeze first.** QE's mutant list (A5, `WRONGSIDE` included) and the two plants (A6) are recorded with the base
   kill sets before any row changes. The SE's parity runs use the same lists.
2. **T2a is per row.** Move one row, run the default lane's file against the list, and keep the move only if parity
   holds. Expect the bare go and "G = 3 500" to move. "white reads wtime" and "black reads btime" may stay on
   `WRONGSIDE`. That is a result, not a failure.
3. **T2c picks by parity.** Try S and the new root, then run the non-vacuity reads and the plants. If no cheaper root
   keeps `underNull` > 0 in both recursions, `QE-208-b` keeps position-6. Record it. The ticket can close on its
   other levers.
4. **The census is a read, not a timing.** A1, A2, A5, A6, A7 and A10 do not need a quiet host. A8 and A9 do, ALONE,
   never beside a smoke, a batch or another timed read. W1's second window is ALONE too.
5. **No smoke and no UAT.** The ticket changes no production line, so `EPIC-010` § The merge rule does not bind it.
   UAT is waived under `AGENTS.md`'s standing rule (2026-08-17) if `git diff --name-only <delivered>~1 <delivered> |
   grep -v '\.test\.ts$' | grep '^src/'` is empty, measured at delivery. QE's verdict is the gate.
6. **Rollback.** Revert the delivered commit. A moved row goes back on its own, and so does a re-sampled or re-rooted
   row (`ADR-0046` § Addendum 2026-10-31, Rollback).

## Size and priority

**`S`.** Two files and three levers: at most six rows move, two rows re-root, one sweep is re-sampled, and at most three
step literals change. The work is per-row parity, two non-vacuity reads, and a two-part timed gate. **Not `XS`:**
parity per moved row and the timed reads. **Not `M`:** the moves are named and the census is capped at two.

**`P1`.** The lane's central value is about 9.5 s, one run has read 10.19 s, and every gate that reads `G8` risks
`NFR-008` NOT MET on noise until this lands. **Not `P0`:** `NFR-008` is MET (9.82 s head, 9.44 s base), and no
user-visible behaviour is wrong.

**Epic: `EPIC-010`,** as `ABC-244` was (`ADR-0046` § Addendum 2026-10-31).

## Dependencies

- **`ADR-0046` § Addendum 2026-10-31** (`38d02496`, merged `c7b45b2f`), and BA/PM's ruling on it (given here and in
  the ADR's dated section).
- **Pull order: after `ABC-246`.** Both edit `src/uci-session.test.ts`. `ABC-246` (XS, Ready) is pulled first, so its
  two stubbed rows are in this ticket's base and its `G8`. The Orchestrator's queue already runs `ABC-246` after the
  batch.
- **In flight:** `ABC-247` (In Review, `tools/` only) shares no file. No other open ticket edits either file.
- **Host:** A8, A9 and W1's window wait for an ALONE slot. The milestone-1 batch, about 21.7–24.1 h ALONE, comes first in
  the Orchestrator's queue.
- **Owners:** SE: A1–A4. QE: A5–A10 and A11's lane. Security/NFR: the `NFR-008` state. Architect/Design: the records.
- No owner question.

## Definition of Ready

BA/PM, 2026-10-31, at `main` `209f4c5f`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ lane centred at about 9.5 s, with one run at 10.19 s; the 9.6 s line fired and is spent; the slack is named by row and in-thread cost |
| 2 | scope and out-of-scope clear | ✅ two files, three levers, rows by title and line; T2b, T2a (wide), U2, O4 and O5, the helpers, other files and the owner levers are fenced off |
| 3 | INVEST-shaped | ✅ one slice; independent of `ABC-247`; ordered after `ABC-246` (same file); each lever reverts alone; testable by parity, counts and nodes |
| 4 | acceptance testable and measurable | ✅ per-row census; moved or stayed per row with parity; counts and names; the same mutant ids killed (`WRONGSIDE` named); insideNull ≥ 3, underNull > 0, plants red; strictly fewer nodes; 650 ms CPU; ≤ 10 s; ≤ 9.4 s; the W1 route |
| 5 | dependencies known | ✅ the ADR addendum and this ruling; after `ABC-246`; ALONE host for A8, A9 and W1; owners named |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s at load1 ≤ 8; target 9.4 s; owner line 9.7 s under W1; `N8-LANE` 650 ms; R1 census present; security not triggered |
| 7 | test notes present | ✅ six |
| 8 | size assigned | ✅ `S` |
| 9 | priority assigned | ✅ `P1`, both directions argued |
| 10 | no major unresolved blocker | ✅ the ruling is given; `ABC-246` first is pull order, not a design wait |

**Recommended: `Backlog → Ready`, pulled after `ABC-246`.** Column moves are the Orchestrator's.
