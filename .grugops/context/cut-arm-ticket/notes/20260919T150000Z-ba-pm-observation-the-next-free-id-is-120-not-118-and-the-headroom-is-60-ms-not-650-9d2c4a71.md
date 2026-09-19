---
id: 20260919T150000Z-ba-pm-observation-the-next-free-id-is-120-not-118-and-the-headroom-is-60-ms-not-650-9d2c4a71
kind: observation
by: ba-pm
at: 2026-09-19T15:00:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ABC-118
  - ABC-119
  - ABC-046
  - ABC-102
  - ABC-045
  - ADR-0021
  - ADR-0019
  - NFR-008
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
supersedes:
---

# WHAT I MEASURED AT THIS CUT — three facts the subtask did not carry, none of them argued

**Not a finding.** `human_admission` is `off`, `scripts/context-io.ts` and `mcp__grugops__propose_note`
are absent on this install, so this is an `observation`. Nothing downstream may read it as verified.
**Zero files under `src/` were opened for writing.** Base: `grugops/wave-2026-09-19` @ `4f0ef01`.

## 1. The next free id is `ABC-120`, not `ABC-118`

The subtask said *"last known ABC-117"*. `git log --all --format=%s | grep -o 'ABC-11[89]'` returns
`ABC-118` and `ABC-119`, both minted by commit `81add97` (2026-08-21, BA/PM, task
`cut-050-exclude-and-g06-2026-08-21`) on branch `grugops/cut-050-exclude-and-g06`, which
`git merge-base --is-ancestor` says is **NOT** an ancestor of `HEAD`. The pages exist on that branch:
`plans/tickets/ABC-118-a-type-valid-exclude-glob-silently-changes-what-the-lane-collects.md` and
`plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md`. The main checkout's
`git status` also shows `.grugops/queue/done/cut-050-exclude-and-g06/` untracked — the work was done
and never merged. Reusing 118 collides at merge; the gap is deliberate and recorded on the ticket page.

**For the Orchestrator:** `grugops/cut-050-exclude-and-g06` is an unmerged, 4-week-old BA/PM branch
carrying two cut tickets (`S`/`P1` and `M`/`P2` by their board rows). Whether it merges is not this
subtask's question; that it exists is.

## 2. `src/turn-loop.ts` at `4f0ef01` is byte-identical to the `2c96dbd` the ADR cites

Every line number `ADR-0021` uses (`:104-124`, `:125-132`, `:155-173`, `:176`, `:246-262`, `:307`,
`:311-315`, `:342-346`, `:374`, `:390`) was re-read at `4f0ef01` and matches. The four phrases `A10`
greps for are present today: `FOUR of these do not advance a ply` (`:105`), `only on end-of-input`
(`:164`), `Eight states and sixteen transitions; the sixteenth` (`:247`), `FIVE outcomes are
non-advancing and only four of them emit a frame` (`:255`). **`A10` was narrowed from `sixteen` to
`sixteen transitions` because "the sixteenth" at `:248` is true and may stay.**

`src/turn-loop.test.ts` is 1860 lines: `scriptedSeams` at `:258-287` maps `board`/`claim` to outcomes
(the idiom the three new test tokens copy); `TABLE` at `:753-883`; `run()` at `:447-490`;
`EVERY_TERMINAL_REASON` at `:218`; `derivesMade()` at `:530`. `src/turn-loop.nfr.test.ts` is 144
lines and its *"derives ZERO times on a non-advancing prompt outcome"* row drives `rejected` only
(`selfPlayingSeams(40, 12)`), which is why the ticket fences it byte-identical rather than re-titling.

## 3. `N8-LANE`'s 650 ms is not the binding number — `NFR-008`'s headroom is

`plans/nfr-catalog.md` line 3 (Architect/Design, 2026-09-19): `NFR-008` CPU is 15 s (`ADR-0019`),
re-measured at `2c96dbd` as **14.940 s, MET by 60 ms**, n = 8, null control −0.37%. `N8-LANE`'s
5% / 650 ms *did not move*. So a ticket can meet `N8-LANE` by 590 ms and still put the lane over its
clause. The ticket's `## NFR / security` writes the bar as
`min(650 ms, headroom re-measured at the delivery base)` and says the base is re-measured at pull
time rather than the 60 quoted. The rows themselves are ≤ 6 in-process runs of ≤ 16 plies on a spied
`gameStatus` — the same shape as `A4` / `ABC-021` `A1` — so the expectation is single-digit ms; that
expectation is not a measurement and the page does not claim one.

## 4. Two facts checked so the ticket could say "independent"

- **`ABC-045` and `ABC-120` share no file.** `ABC-045` `## Scope`: a row in `ABC-035`'s command
  table (`src/command-input.*`) resolving to the EXISTING `game-over` arm. `ABC-120` opens
  `src/turn-loop.ts` and `src/turn-loop.test.ts` only. Either order.
- **Neither `In Development` ticket overlaps.** `ABC-034` (rejections that teach, `EPIC-003`, the
  parser) and `ABC-079` (quiescence, `src/search.ts`). `Ready` is 2/8 on the board (`ABC-107`,
  `ABC-075`), so the row fits without a WIP question.

## What this does NOT establish

- No lane CPU figure for the rows — none was run; `src/` was not opened and no scratch copy was built
  at this hop. Architect/Design's out-of-tree 4-row prototype (sibling task's `observation`) is the
  only behavioural evidence and it is unstamped.
- Nothing about `ABC-046`'s confirmation wrapper or `ABC-102`'s refusal wording — both remain those
  tickets' and the page says so.
