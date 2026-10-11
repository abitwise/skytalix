---
id: 20261011T084150Z-ba-pm-decision-batch-085-fold-105-rescore-095-fold-cut-143-144-111-fold-f4950252
kind: decision
by: ba-pm
at: 2026-10-11T08:41:50Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ABC-105
  - ABC-095
  - ABC-142
  - ABC-143
  - ABC-144
  - ABC-111
  - ABC-083
  - ABC-094
  - ABC-072
  - ABC-073
  - ADR-0038
  - ADR-0035
  - ADR-0008
  - NFR-008
  - QE-094-a
  - QE-094-e
  - QE-094-f
  - QE-142-a
  - QE-142-b
  - QE-142-c
  - plans/tickets/ABC-085-self-play-ladder.md
  - plans/tickets/ABC-105-qe-hop-detector.md
  - plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md
  - plans/tickets/ABC-142-npm-test-keeps-the-failing-tests-name-when-the-console-is-truncated.md
  - plans/tickets/ABC-143-a-red-npm-test-can-leave-a-result-file-that-reads-green.md
  - plans/tickets/ABC-144-npm-test-chokes-the-macbook-air-m3-cut-its-cpu-and-cap-its-cores.md
  - plans/tickets/ABC-111-settle-the-warm-cold-protocol-for-nfr008s-wall-clause.md
  - .grugops/context/wave-2026-09-25/notes/20261010T201446Z-orchestrator-observation-handoff-5-e41d7a20.md
  - .grugops/context/wave-2026-09-25/notes/20261010T192920Z-orchestrator-decision-owner-word-six-answers-b7c41e09.md
  - .grugops/context/design-ABC-085/notes/20261010T182536Z-architect-design-decision-abc085-d4-step-4-verdict-step-120-short-ladder-deep-after-abc083-8d778218.md
  - .grugops/context/qe-ABC-142/notes/20261010T192804Z-qe-e2e-observation-abc142-gap-register-68f78a28.md
  - grugops/ABC-094-book-probe:.grugops/context/qe-ABC-094/notes/20261010T193535Z-qe-e2e-observation-abc094-gap-register-3058eacd.md
supersedes:
---

# BA/PM batch 2026-10-11: `ABC-085` 10/10, `ABC-105` 10/10, `ABC-095` folded, `ABC-143` + `ABC-144` cut, `ABC-111` fold → drop

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Worked against** the wave tip `506550f3`, in a worktree on `grugops/bapm-batch-2026-10-11`.
- **The `ABC-094` gap register** was read with `git show grugops/ABC-094-book-probe:…` (tip
  `7362f1f9`).
- **Nothing was measured.** No timing, no CPU and no `npm test` run, under this subtask's fence.
  The one read beyond notes and pages was vitest's installed type declarations (see `ABC-143`).
- **Not edited:** `plans/board.md`, `src/`, `AGENTS.md`, the `ABC-083` and `ABC-094` pages, and
  any ticket's `status`/`column`.
- **Next free id** was `ABC-143`, checked on every local branch's `plans/tickets/` and on the board.

## Item → result (exactly one each)

| # | item | result | DoR |
|---|---|---|---|
| 1 | Fold `ADR-0038` into `ABC-085` (9 items, `…8d778218`) | **FOLDED, all 9.** `A1`: verdict step 4 on a tree containing `ABC-083`'s merge, with report fields. `A2`: same step; 3v4 and 4v5 first; **measured and reported** against `> 50%` (owner option (a)), and a RED goes to `ABC-087`. `A5`: one step per run, named constants. `A6`: steps replace "default/reduced budget"; short mode labelled. Scope: two named steps, budgets never scaled. `N8-LANE`: `LADDER_DEEP` lane, 0 games / +1 file by count, cost table. Dependencies: verdict waits for `ABC-083`, build does not; staleness rule; **split trigger** (verdict → own `XS` if the build passes QE before `ABC-083` merges). **`A3` (BA/PM's call): claim every claimable draw at first offer**, reason recorded as `(claimed)`, and claimed draws counted per pair | **10/10** (was 8/10) |
| 2 | Re-score `ABC-105` | **Item 10 cleared** on owner answer 5. **Owner answer 3 folded as `A9`** (a `security-nfr` verdict covers under a distinct substitute label; `ABC-072` exit 0, `ABC-073` exit 1). **`A4` amended:** "0 in-scope findings" struck, because drops and owner-word closes in `Done` (`ABC-060`, `074`, `092`, `100`, `108`, `112`) and `ABC-073` would fail it on day one. The deliverable is now exact counts with every finding named. `AGENTS.md` 23,609 B, so 967 B headroom | **10/10** (was 9/10) |
| 3 | Fold `QE-094-a` into `ABC-095` `A5` | **FOLDED** as `A5`'s stream half. On a real `node src/cli.ts` child with the artifact moved aside, from launch to `quit`: stderr carries the warning exactly once, and stdout carries 0 bytes **of the warning's text**. It is a `CLI_DEEP` row, not a new file. **Read "0 bytes stdout" as 0 bytes OF THE WARNING.** A live game writes frames to stdout, and QE's 0 B came from a probe-only binding. `A2`'s reference runtime is re-pointed to v26.11.0 (this clears `QE-094-f`'s ambiguity for this page). `ABC-094` was not touched | **8/10, not re-scored** (trigger: `ABC-094` merge) |
| 4 | Follow-ups from `ABC-142`'s QE gaps | **CUT → `ABC-143`**: `QE-142-a` (MEDIUM) + `QE-142-c` (LOW) + `QE-142-b` (LOW) as `A4`. **One ticket, not three**: all three are the same reader misled by the same file. a and c would both edit the byte-pinned `scripts.test` line. b's query has to cover a's new error records. **Page note on `ABC-142` § Delivery** carries QE's suite-level query and a "read the console on a non-zero exit" warning meanwhile. Feasibility read, not run: vitest 3.2.7's reporter type exposes `onTestRunEnd(…, unhandledErrors, reason)` | `ABC-143` **10/10** |
| 5 | P1 ticket for the owner's CPU goal + re-read `ABC-111` | **CUT → `ABC-144`.** `A1` CPU ≤ 0.85 × base (≥ 15 %). `A2` ≤ 4 test workers. `A3` wall ≤ W (10 s, or the owner's `W_new`). `A4` warm and cooled both ≤ W by R (`ABC-111` folded). `A5` Security/NFR's `W_new` proposal content. `A6` `isolate` true + 20-run screen with every `*.nfr.test.ts` + equal counts + opt-in lanes unchanged. `A7` a value pin, no timing. Architect rules the setting; Security/NFR reads in a no-other-hop window. **15 % and 4 are BA/PM proposals with a stated owner fork** (the frontier table → his pick, dated on the page) | `ABC-144` **10/10** |

## New tickets

| id | size | priority | DoR | UAT | recommended placement |
|---|---|---|---|---|---|
| `ABC-143` | `S` | `P2` | 10/10 | waiver expected (no production `src/` line) | `Ready` |
| `ABC-144` | `M` | `P1` | 10/10 | waiver expected; owner word only if wall > 10 s | `Ready`, then `In Design` (Architect hop) |

## `ABC-111`: FOLD, then DROP

- **Fold.** Its one surviving trigger moves into `ABC-144` `A4`/`A5`. A worker cap lowers
  parallelism and raises the wall toward exactly the zone where warm/cold can flip a verdict
  (8.76 s against 10 s in the 2026-10-10 re-score). `ABC-111` found that its effect lives in
  parallelism.
- **Drop.** Close as SUPERSEDED by `ABC-144`. Keeping both would read the same lane twice in the
  same window.
- **It must not be dropped before `ABC-144` exists on the board.** The trigger was never carried
  by `NFR-008` (no "8.76" in `plans/nfr-catalog.md` at `506550f3`).

## Board moves recommended (the Orchestrator's to make)

1. **`ABC-085`: `In Design` → `Ready for Dev`** (DoR 10/10; design hop complete; `ADR-0038`
   accepted and folded). In Design drops to 0/2. The build is pullable now. **The verdict run is
   not**: it waits for `ABC-083`.
2. **`ABC-144`: new → `Ready` → `In Design`** (In Design 1/2), and dispatch the Architect frontier
   hop. **Schedule a no-other-hop window** for its readings, then the Security/NFR readings later.
3. **`ABC-143`: new → `Ready`** (`S`, `P2`).
4. **`ABC-105`: `Backlog` → `Ready`** (10/10, `M`, `P2`).
5. **`ABC-111`: `Backlog` → `Done` as DROPPED (SUPERSEDED by `ABC-144`)**, in the same board edit
   that places `ABC-144`.
6. **`ABC-095`: stays in `Backlog`** (8/10; re-score when `ABC-094` merges).
7. **Ready WIP.** It is 4/8 today. Moves 3 and 4 make it 6/8, and 2 makes 7/8 until `ABC-144` is
   pulled into `In Design`, then 6/8.
8. **Row text to refresh** when the rows are touched: the board's `ABC-085` row still says
   "DoR 7/10, needs ABC-087 + ABC-086; ~5 h"; the `ABC-111` row still says "M, P1 … 9/10";
   the `ABC-105` row still says "9/10".

## Owner questions (for the Orchestrator to put; none blocks a move above)

1. **`ABC-144`:** are "≥ 15 % less CPU" and "at most 4 of 8 cores for test workers" what "stop
   choking the Air" means to him? If the felt problem is heat or app-switch lag, the Architect's
   frontier table will show other points.
2. **`ABC-144`:** BA/PM recommends **no new CPU level** in `NFR-008`. The value pin (`A7`) holds the
   cap, and CPU stays reported (R-1).

## Seen, not homed (for the Orchestrator)

- **"Quiet-machine readings" cannot mean load1-gated.** `ABC-108` `A1` and `ADR-0035` rejected
  that. `ABC-144` defines it as **a window with no other agent hop running**, load1 logged, R-1's
  load1 ≤ 8. That is width 1 while the readings run.
- **`ADR-0035`'s recorded floors `F`** were read under the 7-worker default. `ABC-144` asks the
  Architect to say whether they carry over. **`ABC-083`'s open `N8-LANE` +1.08 s** re-reads on
  whatever base it rebases onto.
- **`ABC-085` split trigger.** If `ABC-083` stays `Blocked`, the Orchestrator may split the verdict
  run off once the build passes QE. It is on the page and pre-registered.
