---
id: 20261010T182536Z-architect-design-decision-abc085-d4-step-4-verdict-step-120-short-ladder-deep-after-abc083-8d778218
kind: decision
by: architect-design
at: 2026-10-10T18:25:36Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ABC-083
  - ABC-087
  - ABC-101
  - ABC-125
  - EPIC-004
  - ADR-0012
  - ADR-0025
  - ADR-0027
  - ADR-0031
  - ADR-0035
  - ADR-0038
  - NFR-004
  - NFR-005
  - NFR-008
  - N8-LANE
  - RISK-003
  - plans/tickets/ABC-085-self-play-ladder.md
  - memory-bank/50-decisions/ADR-0038-the-ladder-step-is-one-named-constant-per-run-step-4-for-the-verdict-step-120-for-the-short-mode.md
  - 20261010T182536Z-architect-design-observation-abc085-step-readings-equivalence-floor-same-game-both-chairs-d60bfcc9
  - 20261010T172705Z-ba-pm-decision-p1-backlog-two-in-design-two-backlog-0e4da324
supersedes:
---

# D4 for `ABC-085`: one step per run. Step 4 is the verdict step (recommended; the owner may choose 4–10) and step 120 the short mode. The lane is `LADDER_DEEP`, and the verdict is taken after `ABC-083` merges

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). Subtask
`design-ABC-085`, Workflow 02 In Design hop and Workflow 07, at `489c549e`. The ruling is recorded as
**`ADR-0038` (proposed)**. The readings are in `…d60bfcc9`. The issuing scope and risks are `ABC-085`'s
§ Scope and § Dependencies, and BA/PM's `…0e4da324` D4. This note cites them and does not restate them.

## The ruling, in short (`ADR-0038` decisions 1–6)

1. **The step belongs to the run, never to a level.**
   - Every level is played at its `LEVELS` budget, verbatim.
   - A "reduced budget" is a coarser step: `(b, s)` ≡ `(b/k, s/k)` on 50/50 positions.
   - A per-level step is a re-tuned level, and it is refused.
2. **Each step is a named constant.** A step calibrated at run time breaks `A5`.
3. **Two steps:**
   - **Short step: 120.** It claims `A3`, `A4` and `A5` only, plus an early signal.
   - **Verdict step: 4.** It is about real time on the reference stack. It is recommended, and the owner
     decides.
   - **Admission rule for a verdict step:** `s ≤ LEVELS[1].budgetMs ÷ 10` = 10. **Steps 30 and 120 can
     never carry a verdict,** because level 1 sits on the depth-1 floor (on 50/50 positions at step 120,
     and 6/50 at step 30).
4. **What a verdict claims.**
   - The shipped engine and the shipped table, at a named commit, at `1 024 ÷ s` nodes per budget
     millisecond. At step 4 that is a player's ladder on the reference stack, without the clock's noise.
   - **No real-clock time or depth** (`ADR-0027`). No other machine's order, no jitter, no Elo and no book.
   - **The step cannot repair 3v4 or 4v5**, because the ratios do not change with the step. Question 1
     cannot be traded against question 2.
5. **Lane `LADDER_DEEP`.**
   - `=1` is the short mode and `=verdict` the verdict mode. When unset, the rows are NOT DEFINED.
   - There is one `it` per pair, so `-t` re-runs one pair.
   - The harness lives in a test file only. The default lane plays 0 games, pinned by a count, plus 1 file.
   - It is not a gate and not a per-ticket trigger.
6. **The verdict waits for `ABC-083`. The build does not.**
   - A verdict is STALE after a merge that touches `PUZZLE_DEEP`'s engine trigger list, `src/levels.ts`
     or `src/virtual-clock.ts`.
   - Re-taking it is the Orchestrator's to schedule.

## Owner menu (Olger Oeselg), for the Orchestrator to put to him

**Question 1. Levels 4 and 5 barely differ, and 3 and 4 not much more.** At every step, 4 and 5 picked the
same move on 48–50 of 50 positions. At step 30, one of two openings played the identical game from both
chairs, and the pair scored exactly 50 %. `A2` needs more than 50 %.
- **(a)** Run the ladder as cut. If 3v4 or 4v5 reads 50 % or below, that is `ABC-087`'s finding, with a
  real score.
- **(b)** Re-cut levels 4 and 5 now. That changes `ABC-101`'s level vocabulary.
- **(c)** Require "each level beats the one below" only up to the default level, 3.
- **Recommended: (a).** Run 4v5 and 3v4 first (test note 5). Read `A2` as "measured and reported", so a red
  closes `ABC-085` with a score and opens `ABC-087`'s question. You then choose (b) or (c) on a game
  result, not on a prediction. Choosing (b) or (c) now is a product change made on 4-game samples.

**Question 2. Which step gives the official result for the epic's first criterion?**
- **(A) Step 4:** play about as strong as real time on this Mac. About **10 machine-hours** (7–13) for the
  whole ladder, run once in the background. `A1` alone is ~3.3 h.
- **(B) Step 10:** every level about one search ply shallower than real. About **4 h** (3–5).
- **Not offered: step 30 or 120** (20 min). It is cheap, but level 1 is reduced to its floor, so it does not
  measure level 1. It stays the quick check.
- **Recommended: (A).** The criterion is about the ladder a player meets, and only step 4 claims that. The
  cost is machine time, once per verdict, never a human's wait or a gate.

**Question 3. P1 or P0?**
- **Recommended: keep P1.** The verdict cannot be taken before `ABC-083` merges, and question 1 may change
  the level table. So P0 buys no earlier verdict. The build can be pulled as soon as BA/PM folds this ADR.
  This is the owner's call, as the page has always said.

## Fold list for BA/PM (`ABC-085` page; this hop does not edit it)

1. **`A1`:** "at the verdict step (`ADR-0038`), on a tree that contains `ABC-083`'s merge. The report names
   the commit, step, seeds, game count, wall time and load1."
2. **`A2`:** the same step. The 3v4 and 4v5 pairs run first. Fold question 1's answer here, including
   whether `A2` is "measured and reported" or "> 50 %".
3. **`A5`:** one step per run for both sides, each side on its own clock instance. Steps are named
   constants, never computed from a timing. The Dependencies sentence "the levels may use different steps"
   (`ABC-125`) is overtaken. `ABC-125`'s row stays as a guard.
4. **`A6`:** "default budget" becomes "the levels' own budgets at the verdict step". "Reduced budget" becomes
   "the short step, 120". The short mode is `LADDER_DEEP=1`, and its numbers are labelled "short mode,
   step 120" and never quoted as `A1`.
5. **Scope:** "Runs at a configurable reduced budget" becomes "at one of two named steps. Budgets are never
   scaled."
6. **Security / NFR triggers, `N8-LANE`:** the lane is `LADDER_DEEP` (`=1` / `=verdict`) in a test file. The
   default lane plays 0 games, pinned by a count, plus 1 file at the per-file floor. No wall bound.
   - The 650 ms short-mode sentence is overtaken.
   - Add the cost table (`ADR-0038` § Consequences).
7. **Dependencies:** the verdict waits for `ABC-083`; the build does not. Add the staleness rule
   (decision 6).
8. **`A3`:** the threefold / fifty-move claim policy. It is BA/PM's choice. For a deterministic pair it
   changes cost, not score (`…d60bfcc9` item 6).
9. **DoR:**
   - Item 4 ⚠️ → ✅.
   - Item 10 is re-worded: the home is `LADDER_DEEP`. The verdict runs once, in the background, on the
     Orchestrator's schedule. What remains open is the owner's step choice (question 2), not a homeless run.

## Not done here (fences)

- No `src/`, no ticket page, no `plans/board.md`, no `AGENTS.md`, no column change.
- `plans/nfr-catalog.md` is not opened. `NFR-004` and `NFR-005` are not triggered, and `NFR-008` takes
  +1 file by count, which is Security/NFR's row.
- Probe runs were 18 s, 126 s, 122 s, 267 s and under 2 min (equiv + floor), each under the 10-minute fence.
