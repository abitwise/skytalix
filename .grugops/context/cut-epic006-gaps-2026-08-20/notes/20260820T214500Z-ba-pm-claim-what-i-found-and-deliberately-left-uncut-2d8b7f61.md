---
id: 20260820T214500Z-ba-pm-claim-what-i-found-and-deliberately-left-uncut-2d8b7f61
kind: claim
by: ba-pm
at: 2026-08-20T21:45:00Z
verified_by: 
confidence: medium
refs:
  - EPIC-006
  - ABC-044
  - ABC-046
  - ABC-102
  - ABC-045
  - ABC-107
  - src/status-panel.ts
supersedes: 
---

# Found and deliberately left uncut — named, priced, and not turned into tickets

**Hand-authored `claim`, unstamped, `confidence: medium` where it says so — explicitly
non-load-bearing.** The brief's fence is *"if you find a third thing, name it and leave it uncut"*.
Here is everything I found beyond `ABC-112`. **Nothing below was cut, and none of it is a
recommendation to cut it.**

## 1. The status panel says `CHECK` and `White to move` on a mated position — NOT a defect

Measured at this hop: the final frame of `1. f3 e5 2. g4 Qh4#` reads `White to move  3.  CHECK`.

**I examined this as a candidate second ticket and rejected it.** `src/status-panel.ts:202-206`
documents that the panel reports *"whether the side to move is in check and nothing else"*, which is
the honest reading of its own criterion — and **both statements are true of that position**: it is
White's turn and White is in check. The panel is not wrong; it is **incomplete**, and it is
incomplete only because no result line sits beside it. **`ABC-044` supplies that line.** Cutting a
panel ticket would have been inventing scope to fill a quota, and it would have put a second owner on
one screen. `confidence: high` on the reasoning; the *product* judgement that a result line is
sufficient is `medium` until a human sees the screen `ABC-044` builds.

## 2. The same advertisement bug is already queued to recur twice — not cut, because `ABC-112` covers it

`resign` (`ABC-045`) and `undo` (`ABC-102`) both add tokens to `COMMAND_TABLE` ahead of their
effects, and `helpMessages()` advertises anything in that table. **`ABC-112` `A3` requires the
exclusion to be DATA on the table rather than a hard-coded name**, so both are covered by the ticket
that already exists. **No third ticket, and no "make it general" flexibility beyond the one field
`ABC-046` needs to flip back.**

## 3. `ABC-046`'s (a)/(b)/(c) contract ruling is still nobody's scheduled work — ROUTED, NOT CUT

It blocks `ABC-046` **and** `ABC-102` (the board row says so: *"blocked by the SAME RULING as
`ABC-046`, owner Architect/Design (rule it once for both)"*). It is Architect/Design's, it has been
open since 2026-08-13, and **it is the actual reason `quit` still does not quit.** **I did not decide
it, and `ABC-112` is written so that it does not pre-empt any of the three shapes.** Routing it is
the Orchestrator's.

## 4. `ABC-044`'s page still says its blocker is OPEN — annotated, not re-scored

The page reads *"`ABC-043` must land first — OPEN, and it is blocked in turn"*; `ABC-043`'s code is
merged to `main` (`6091212`) and `ABC-037` and the `EngineSeam` both exist now. **Re-scoring that DoR
is BA/PM's pen and I deliberately did not use it at a cut hop** — the same restraint the Orchestrator
recorded on `ABC-035` on 2026-08-18 (pull on the measured fact, record that the page is unre-scored,
do not smooth). **The `Backlog` row is annotated in place; the page, the score and the column are
untouched.**

## 5. `EPIC-006`'s decomposition table is now out of date in one row — not touched

The epic page's table still reads `ABC-043` *"7/10 ⚠️×3 — `ABC-037` open, **no `EngineSeam`
exists**"*. Both conditions have since cleared. **`plans/epics/` was not opened for writing at this
hop** and this is recorded rather than fixed, because an epic page edit is a wider act than the brief
authorises.

## Fences, verified rather than promised

- **`plans/nfr-catalog.md` and `ADR-0014` were not opened for writing** — `git status --porcelain`
  over both paths returns **0 lines**. **The `sha256 63f66795…ca31` fence is NOT restated as
  verified**: that hash has no defined byte range and QE could not reproduce it (recorded by the
  Orchestrator at `cut-nfr008-wall-2026-08-20`). **A hash nobody can recompute is not an instrument**,
  so the honest check is the diff, and the diff is what was run. **Nothing was promised.**
- **0 files under `src/`** — `git status --porcelain -- src` returns **0 lines**.
- **`ABC-033`, `ABC-035`, `ABC-037`, `ABC-078` pages untouched** — `git status --porcelain` over all
  four returns **0 lines**.
- **`ABC-110`'s lever was not decided** and `ABC-110` was not opened.
- **No column moved, no WIP limit touched, nothing archived, nothing merged.**
- **Lane, measured not assumed:** `npx vitest run --dir src` → **39 files / 1190 tests passed, skip
  0, 2.90 s wall**, matching the documented contained baseline. **Run in the repository tree, which is
  the only checkout with `node_modules`; the worktree this hop wrote in has none, and that is stated
  rather than glossed.** `ABC-112` adds **0 test files**, so the lane cost of this cut is **nil by
  construction**, not by measurement.
