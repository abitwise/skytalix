---
id: ABC-170
title: "`src/engine.ts` takes two optional limits, `maxDepth` and `maxNodes`; absent, it is today's engine node for node"
status: done
column: Done
size: XS
priority: P1
epic: EPIC-007
feature: —
---

# ABC-170 — two optional `EngineOptions` fields that can only shorten a search, so UCI `go depth` / `nodes` / `mate` can be honoured

> **Accepted 2026-10-18 by the owner** (BA/PM, subtask `bapm-epic007-accept`). Owner word, verbatim
> (`.grugops/context/wave-2026-09-25/notes/20261018T113000Z-orchestrator-decision-owner-word-engine-private-adr0044-epic007-accepted-c3e81a57.md`,
> a transcription, not a stamp): *"accept the revised ADR-0044 and EPIC-007"*. The DoR item "owner acceptance" (item
> 10) is met, and the score is now 10 of 10. Readings below are unchanged from the cut.

> **Cut 2026-10-18 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-engine-revise`) as a **proposal**. It stays in
> `Backlog` until the owner accepts the revised `ADR-0044` (D12) and `EPIC-007`. Design: `ADR-0044` D12. Owner word:
> Q6, *"don't ignore, implement if it has not been implemented in our engine"* (`…a41c7e02`). Architect's suggestion
> to cut it as its own `XS`: `.grugops/context/arch-engine-revise/notes/…e4a7c912` § For BA/PM.
> **This hop ran nothing.** Line numbers are read at `main` `a10e09c2`.

## Problem

*User:* the owner's UI backend, and any UCI GUI or tester that sends `go depth N`, `go nodes N` or `go mate N`.

*Pain:* the engine deepens until the clock says stop (`src/engine.ts` `deepen`, `:452-504`). Nothing can stop it at a
depth or a node count. `search(position, depth)` cannot be aborted and is not bound by the ceiling, so the session
cannot use it (`ADR-0044` D12, Alternatives 9 and 10).

*Value:* `ABC-167` can map `depth`, `nodes` and `mate` onto the engine directly. Every existing caller passes neither
field, so the terminal game, the levels and the ladder keep today's engine.

## Scope

1. **`src/engine.ts`:** two optional fields on `EngineOptions`, as `ADR-0044` D12 specifies:
   - `readonly maxDepth?: number` stops deepening once that iteration has completed;
   - `readonly maxNodes?: number` aborts once `budget.nodes ≥ maxNodes`. The check sits in `countNode`'s existing
     every-1 024-nodes branch, **after** the clock read, and in the loop condition. The aborted iteration is discarded,
     as it is for time.
2. **`src/engine.test.ts`:** the `A4` amendment (`A4` below) and new rows (`A1`–`A3`, `A5`).

## Out of scope

- `src/search.ts`, `src/levels.ts` (forwarding the limits at blunder levels is `ADR-0044` D6, not v1), and every other
  file under `src/`.
- Any default value for either field, any depth constant, any new export, and any change to `budgetMs`.
- The UCI mapping (`depth N` → `maxDepth N`, and so on). That is `ABC-167`.
- `searchmoves`, a per-iteration `info` hook, and a longer pv (`ADR-0044` D6).

## Acceptance (Given/When/Then)

All rows run on the injected ticking clock (`tickingClock`, `ADR-0027`), so every figure is a function of node counts
and is the same on every host.

- **`A1` (`maxDepth` stops at that depth).** **Given** the `kp-vs-k` endgame FEN and a `tickingClock(1)` budget at which
  the unlimited engine completes depth ≥ 6 (the `A4` behavioural row, `:543`, reads 6 at 10 ms), **when** `chooseMove` is
  called with `maxDepth: 3`, **then** the result reports `depth` **3**, and its `move` and `score` equal
  `search(position, 3)`'s (the `A3` identity reference). With `maxDepth: 1` it reports depth **1** and a legal move.
- **`A2` (`maxNodes` aborts and plays the last completed iteration).** **Given** Kiwipete and a budget long enough that
  the clock does not bind first, **when** `chooseMove` is called with `maxNodes: 20000`, **then**:
  - the reported `nodes` is ≤ **20 000 + `NODES_PER_CLOCK_CHECK`** (21 024);
  - the reported `move` and `score` equal `search(position, d)`'s, where `d` is the reported `depth`, so the aborted
    iteration was discarded;
  - with `maxNodes: 1` the result is non-null, legal and reports depth **1**: the first iteration always completes.
- **`A3` (absent fields are today's engine, clock read for clock read).** **Given** each of the six perft FENs
  (`src/perft.test.ts:21-52`) at a 50 ms budget on `tickingClock(1)`, **when** `chooseMove` is called (a) with neither
  field and (b) with `maxDepth: 1000, maxNodes: Number.MAX_SAFE_INTEGER`, **then** (a) and (b) return identical
  `move`, `score`, `depth`, `nodes` and `elapsedMs`. An extra clock read in either path would move the ticking clock and
  fail this row. **And** every `src/engine.test.ts` row outside the `A4` `describe` (`:478-556`) is unedited and green,
  `A3`'s identity rows and the depth-3 literal included.
- **`A4` (the `ABC-078` `A4` amendment, and only it).** **Given** the `A4` `describe` (`:478-556`), **when** the diff is
  read, **then**:
  - the check at `:515` (*"carries no depth default and no depth constant"*) still bans `default_?depth`,
    `fixed_?depth` and any defaulted depth (`depth … =`). It allows `max_?depth` **only** as the optional field, and pins
    `readonly maxDepth?: number;` with no default anywhere in the file;
  - the check at `:520` (*"the deepening loop has no upper bound"*) is amended to pin the new loop header, with the clock
    condition **first**. **This second check is not named in `ADR-0044` D12**, which says "one check". Read at
    `a10e09c2`, it pins `for (let iteration = 2; now() < budget.deadline; iteration++)` verbatim, and D12 puts both new
    conditions in that header (`EPIC-007` `RISK-EPIC007-04`);
  - the export-list and arity check (`:487`), the `budgetMs` check (`:508`) and the behavioural half (`:543`) are
    **unedited and green**. `Object.keys(engineModule)` is the same seven names, and `chooseMove.length` is **2**;
  - `git diff <base> <tip> -- src/engine.test.ts` shows edits only inside `:478-556`, plus appended rows.
- **`A5` (the limits only shorten; the ceiling holds).** **Given** the `RF-1` rows (`:577` on), **when** they run,
  **then** they are unedited and green. **And** a new row: on the fused clock, `budgetMs: Infinity` with
  `maxDepth: 1000` returns within the same consultation count as without it. At `budgetMs: 5` on `tickingClock(1)`,
  `maxDepth: 50` returns the same `depth` and `move` as no `maxDepth`.
- **`A6` (`NFR-005` re-read).** **Given** the build tip, **when** `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` runs
  its `NFR-005` `describe` (`:1005`), **then** Kiwipete and `position-6` each complete **≥ depth 6** in 3 s (below 6 =
  FAIL). The reading, its host, load1 and the last recorded reading are reported side by side. A drop of one depth is
  reported, not argued away.
- **`A7` (fences).** `git diff --name-only <base> <tip> -- src` lists exactly `src/engine.ts` and
  `src/engine.test.ts`. The `ADR-0036` (b1) grep over `src/engine.ts`'s `+` lines finds no limb token.

## Dependencies

- **None among open tickets.** `src/engine.ts` and `src/engine.test.ts` are not in any open ticket's file list at
  `a10e09c2`. `UNKNOWN - verify` at pull time against the board's `In Development` column.
- **Blocks `ABC-167`**, which maps `go depth` / `nodes` / `mate` onto these fields.
- **Gate: met.** The owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`). D12 amends
  `ABC-078` `A4` and `ADR-0027` decision 3 on that word.

## Security / NFR triggers

- **Security: not triggered.** (a) no manifest; (b) no limb token and no new import edge; (c) no new test-lane
  capability; (d) only the two named files.
- **`NFR-004`:** unchanged. Both fields can only shorten a search that the clamp still bounds (`A5`).
- **`NFR-005`:** re-read at the build hop (`A6`). Target unchanged: ≥ depth 6 in 3 s on Kiwipete and `position-6`.
  The added cost is one comparison per 1 024 nodes plus one per iteration, believed negligible (`UNKNOWN - verify`).
- **`NFR-008`:** about six new default-lane rows in an existing file, all on the virtual clock. No new file. The
  `N8-LANE` delta is measured at the gate, not asserted here.

## Test notes

1. **`A3` is the row that matters most.** "Absent means today" is easy to break silently, for example with a clock read
   added to the loop condition. Two calls on the same ticking clock make any extra read visible.
2. **`A2`'s identity check is what proves the discard.** A build that returns the aborted iteration's move passes a
   node-count row and fails the `search(position, d)` comparison.
3. **No absolute hardware depth is asserted outside `A6`**, so `ABC-078` test note 4 still holds.
4. **The `A3` identity sweep's deep lane** (`ENGINE_DEEP=1`, `:1041`) is rerun at the build hop alongside `A6`.

## Size and priority

**`XS`:** two optional fields, two conditions, and one amended `describe` in a file whose fixtures already exist.
**Not `S`:** there is no new module, no new fixture and no new API.

**`P1`, inherited from `EPIC-007`.** It is first in the chain. **Not `P0`:** the terminal product does not need it.

## Definition of Ready

BA/PM, 2026-10-18, at `main` `a10e09c2`. **Result: 10 of 10.** Re-scored 2026-10-18 at `main` `50e081fc` (subtask
`bapm-epic007-accept`). It was 9 of 10 at the cut, with item 10 open until the owner accepted.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** no depth or node cap exists, and `search()` is unbounded |
| 2 | scope and out-of-scope clear | **✅** two named files; `search.ts`, `levels.ts` and the mapping fenced off |
| 3 | INVEST-shaped | **✅** independent, and testable on the virtual clock |
| 4 | acceptance testable and measurable | **✅** depth 3 and 1; ≤ 21 024 nodes; identity to `search()`; identical five fields; ≥ depth 6 |
| 5 | dependencies known | **✅** none open; blocks `ABC-167` |
| 6 | security/NFR triggers with a measurable target | **✅** none fire; `NFR-005` ≥ depth 6; `NFR-004` unchanged |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P1` |
| 10 | no major unresolved blocker (owner acceptance) | **✅** the owner accepted the revised `ADR-0044` and `EPIC-007` on 2026-10-18 (`…c3e81a57`) |

**Recommended: → `Ready` now, as far as Ready's WIP limit (8) allows. It heads the chain and has no open dependency.**
Column moves are the Orchestrator's.

## Delivery — 2026-10-18 (Software Engineer, subtask `ticket-to-pr-ABC-170`)

Branch `grugops/ABC-170`, code `e29f7951`, from `main` `358810ac` (its `src/` is identical to `a0c6db6c`). Not
pushed, not merged. **No timing was read** (a parallel vitest run). Notes: `.grugops/context/ticket-to-pr-ABC-170/notes/`
(`…7c1e4a90` readings, `…3b9d52e1` decision, `…e8f04d26` delivery).

- **`A1` MET.** `kp-vs-k` at 10 ms: unlimited depth ≥ 6 (7); `maxDepth: 3` → depth 3, move and score = `search(p, 3)`;
  `maxDepth: 1` → depth 1, legal.
- **`A2` MET.** Kiwipete, `maxNodes: 20000` → depth 3, 20 058 nodes (≤ 21 024), move and score = `search(p, 3)`, and
  more nodes than a `maxDepth: 3` run (the depth-4 iteration was entered and discarded). `maxNodes: 1` → depth 1, legal.
- **`A3` MET.** Six perft roots at 50 ms: absent vs `maxDepth: 1000, maxNodes: MAX_SAFE_INTEGER` identical in all five
  fields. Every pre-existing row outside `A4` unedited and green.
- **`A4` MET.** Only the two named checks changed (`:517`, `:520-523`); export list, arity, `budgetMs` and the
  behavioural half unedited and green. Other hunks are appended rows only.
- **`A5` MET.** `RF-1` rows unedited and green; new rows: `Infinity` budget with `maxDepth: 1000` = same consultation
  count and result; `budgetMs: 5`, `maxDepth: 50` = same depth and move (`kp-vs-k`, startpos).
- **`A6` OPEN** — owed in a quiet window (Orchestrator).
- **`A7` MET.** `src` diff lists exactly `src/engine.ts`, `src/engine.test.ts`; no limb token on the `+` lines.
- **Gates on `e29f7951`:** lint, typecheck, build, `npm test` exit 0 (58 files, 1839/1839); `last-run.json` success;
  skip count 0, `No findings.`; `CLI_DEEP=1` 10/10; `PERFT_DEEP=1` 32/32; deep `A3` identity sweep 2/2.
