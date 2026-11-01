---
id: ABC-249
title: "A position that stood twice before the root, met four or more plies into the search, scores exactly 0, so turning the pre-root scan off at depth (`QPLY4`) turns the default lane red (test-only, from QE-248-c)"
status: done
column: Done
closed: "2026-11-01, merged to main at 98d601d6; QE PASS_WITH_GAPS (qe-ABC-249, 17ce7d7c); test-only, UAT waived; front matter aligned to the board by bapm-epic010-close"
size: XS
priority: P3
epic: EPIC-010
feature: —
---

# ABC-249: pin `ADR-0054` decision 3's pre-root scan below ply 3 with one default-lane row (QE-248-c)

> **Cut 2026-11-01 by BA/PM** (task `bapm-ABC-248-close`, records only, at `main` `37a93b76`; nothing run, built or
> timed, because `qe-qehop-growth` holds the host ALONE; `src/`, `tools/`, `data/` and the board untouched). Source:
> QE gap **QE-248-c** (LOW, a pre-existing regression gap) in `qe-ABC-248` `…b519324e`, from the P-2 read
> (`QE-244-c`, `bapm-page-closes`). `ABC-248` met its acceptance and is Done (`ef4cd095`). This is a lane gap, not a
> build fault. **DoR 10/10. Recommended `Backlog → Ready`.** Column moves are the Orchestrator's.

## Problem

- **User:** the SE or QE who next edits `src/engine.ts` `negamax` or `repeatsBeforeRoot`, and the owner, who plays
  games in which a position from before the move stands twice.
- **Pain:** `ADR-0054` decision 3 says a node at any ply `p ≥ 1` scores a draw if its position stood twice before the
  root. QE's mutant **`QPLY4`** adds `if (ply >= 4) return false;` at the top of `repeatsBeforeRoot`
  (`src/engine.ts:350`), so the pre-root scan stops at ply 4 and below. **It survives the whole default lane:** `npm test`
  2 362 / 2 362 green with it applied (`qe-ABC-248/raw/p2/`). `qe-ABC-244` saw the same.
  - Every `ABC-230` default-lane row meets its pre-root repeat at ply 1 (`src/engine.test.ts` § "ABC-230 A1": the
    repeat is the root's child, at fixed depth 4). No row meets one at ply ≥ 4.
  - The deep lanes were not run against `QPLY4`. Whether any of them kills it is `UNKNOWN - verify`. It does not change
    the gap: the default lane is the gate on every ticket.
- **Why it matters:** a future engine change could stop the search from seeing a game repetition further down a line
  (for example a pruning or table change that skips the scan at depth). The default lane would stay green, and the
  only signal would be a smoke or batch reading, which cannot see a change of this size (`RISK-EPIC010-01`).
- **Value:** decision 3's "at any ply" is held by a row, not by memory. Cost: one row in one test file.

## Scope

1. **One row** in `src/engine.test.ts`, beside the `ABC-230` rows. Its fixture is a position whose search reaches a
   node at ply **≥ 4** whose position stood **exactly twice** among the prior keys a production caller hands
   (trimmed, ≤ 100 keys) and **not** on the search path from the root to that node (root included). So only the
   pre-root half of decision 3 can score it 0.
2. The row asserts a figure of that search (the move, the score or the node count, the SE's pick) that **differs** from
   the same search with the prior keys withheld, and equals the production reading.

## Out of scope

- Any change under `src/` other than `src/engine.test.ts`. `src/engine.ts`, `repeatsBeforeRoot` and
  `PRIOR_KEYS_WINDOW` do not change.
- Every existing row: no `ABC-230`, `ABC-241`, `ABC-242` or `ABC-245` row is edited.
- **`QPARITY`** (QE-248-d): very likely an equivalent mutant (the key carries the side to move). No row is owed for it.
- Running `QPLY4` against the deep lanes. It is not owed here; if QE reads it, it is information.
- `tools/`, `data/`, `vitest.config.ts`, `package.json`, `AGENTS.md`, the board.

## Acceptance criteria

The base is `main` at the commit the build branches from. The tip is this ticket's delivered commit.

- **`A1` (non-vacuity, read in the row).** **Given** the Scope 1 fixture, built from a FEN and a legal move list as
  `ABC-230`'s rows are, **then** the row asserts:
  - the repeating position stands **exactly 2** times among the prior keys (as `occurrencesAfter` reads it);
  - the prior keys are what a production caller hands (`trimPriorKeys` of the game's key history, ≤ 100 keys).
  - The build note names the line from the root to the repeating node, and its ply (**≥ 4**), and states that no
    position on that line before it, root included, equals it.
- **`A2` (the scan at depth decides the figure).** **Given** the fixture, **when** the search runs at the fixed depth
  the SE picks with the prior keys, and again with them withheld, **then** the asserted figure differs between the
  two runs, and the row pins the with-keys figure. The position at the root is byte-identical after each search.
- **`A3` (it kills `QPLY4`).** **Given** `QPLY4` (`.grugops/context/qe-ABC-244/raw/frozen-mutants.json`, id `QPLY4`)
  applied alone to a scratch copy of production, **then** the new row turns red, and at production it is green. The
  SE reads it out of tree; QE re-reads it. The mutant is never committed.
- **`A4` (what the diff may touch).** **Given** `git diff <base> <tip> --name-only`, **then** it prints only
  `src/engine.test.ts`. No existing row's title or `expect(` line changes. Added comments cite only `ABC-249`,
  `ADR-0054` or `QE-248-c`.
- **`A5` (cost).** **Given** the vitest JSON report of three head runs of `npm test`, **then** the new row's duration
  median is **≤ 100 ms**, and the build note gives its node count. The search uses a fixed depth, so no virtual or real
  clock is read.
- **`A6` (gates).** **Given** the tip, **then** lint, typecheck and build exit 0; `npm test` is green with 0 skips and
  the count is base + 1; `test-skip-integrity` and `lane-inventory` report no findings; `G8` head median ≤ 10 s
  (`NFR-008`).

**If no fixture meets A1–A3 within A5's 100 ms,** the SE stops and reports the best candidate and its cost. The ticket
goes back to BA/PM. The fixture is not forced through a dearer row or a production door.

## NFR triggers

- **`NFR-008`:** the default lane stays **≤ 10 s** (A6). `G8` read 9.09 s at `qe-ABC-248`, so the headroom is about
  0.9 s. The row's budget is **≤ 100 ms** (A5), an estimate of its share until `G8` reads it. W1 applies to the head
  median as at every gate (`ADR-0046` § BA/PM ruling 2026-10-31).
- **`ADR-0046` R1–R4:** not triggered. The row reads no clock (fixed depth).
- **`NFR-004` / `G5` / `NFR-009`:** no production line changes, so none moves.
- **Security (ASVS L1):** not triggered. Test-only, with no input surface.

## Test notes

1. **The fixture is the SE's to build.** The repeating node must sit off the path: if the root itself, or any position
   two plies apart on the path, equals it, decision 3's path half scores it 0 and `QPLY4` stays alive. A shuttle where
   the repeat lies four or more plies away (two pieces each making a two-move trip, or a longer king walk in a bare
   ending) is one way. QE's hint (`…b519324e`): "a fixture whose third occurrence sits ≥ 4 plies into the search with
   two pre-root occurrences".
2. **Base reads it otherwise (A2) by construction:** withholding the prior keys is base's search (`ABC-230` A3 and A4,
   node for node). No out-of-tree base tree is needed.
3. **QE re-runs `QPLY4`** (A3) and reads `G8`. No production line, so no smoke and no UAT: the waiver
   (`AGENTS.md`, 2026-08-17) holds if `git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep
   '^src/'` is empty at delivery. QE's verdict is the gate.
4. **Rollback:** revert the delivered commit.

## Size and priority

- **Size: `XS`.** One row in one test file, with a fixture and one mutant read. **Not `S`:** no lever, no parity set,
  no timed design target.
- **Priority: `P3`.** It guards a rule nothing in flight touches, and the gap is pre-existing (`qe-ABC-244` saw it).
  **Not `P2`:** no user-visible behaviour is wrong, and `QPLY4` is a mutant, not a defect. It is in no milestone.

## Dependencies

- **`ABC-230` Done** (`24f3e322`), `ADR-0054` (ACCEPTED 2026-10-30) decision 3.
- **Shared file:** `src/engine.test.ts` only. No open ticket in flight edits it at `37a93b76`. The next pulls on the
  board (`ABC-223`, a smoke reading) do not touch it. Recommended, not binding: pull it before any `EPIC-010`
  milestone 2 ticket that edits `negamax`'s node order or table use (`ABC-233`, `ABC-236`, `ABC-237`, `ABC-238`), so
  that a change there meets the row. Order is the Orchestrator's.
- **Host:** `G8` (A6) needs an ALONE slot. A1–A5 do not.
- **Owners:** SE: A1–A5. QE: A3's re-read and A6's lane.
- No owner question.

## Definition of Ready

BA/PM, 2026-11-01, at `main` `37a93b76`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ `QPLY4` survives `npm test` 2 362 / 2 362; every `ABC-230` default-lane row meets its pre-root repeat at ply 1 |
| 2 | scope and out-of-scope clear | ✅ one row, one file; production, existing rows, `QPARITY` and the deep lanes out |
| 3 | INVEST-shaped | ✅ one row; independent; XS; testable by one mutant |
| 4 | acceptance testable and measurable | ✅ exactly 2 prior occurrences; ply ≥ 4 off the path, named in the build note; the figure differs with keys withheld; red under `QPLY4`, green at production; one file; ≤ 100 ms; count base + 1, 0 skips; `G8` ≤ 10 s |
| 5 | dependencies known | ✅ `ABC-230` Done; `src/engine.test.ts` not in flight; recommended order before milestone 2's search tickets |
| 6 | security/NFR triggers with a measurable target | ✅ `NFR-008` ≤ 10 s; row ≤ 100 ms; R1–R4 not triggered (no clock); security not triggered |
| 7 | test notes present | ✅ four |
| 8 | size assigned | ✅ `XS` |
| 9 | priority assigned | ✅ `P3`, both directions argued |
| 10 | no major unresolved blocker | ✅ none; a fixture that cannot meet A5 stops the build and comes back (stated), which is a scope check, not a wait |

**Recommended: `Backlog → Ready`.** Column moves are the Orchestrator's.
