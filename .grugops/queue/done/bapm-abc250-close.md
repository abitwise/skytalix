---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:17:00Z
subtask: bapm-abc250-close
role: ba-pm
ref: .grugops/context/bapm-abc250-close/
branch: new grugops/bapm-abc250-close from main (worktree .claude/worktrees/bapm-abc250-close)
width: records only, beside arch-abc250-close (memory-bank only) and se-ABC-262 (tests under the lock).
---
# BA/PM: close ABC-250 by routing, drop ABC-252, narrow ABC-251, record E1650
## Inputs
- Orchestrator decision .grugops/context/orch-2026-10-30a/notes/20261101T201645Z-orchestrator-decision-d2571be5.md (ABC-250 CLOSED NOT MERGED by routing, NOT a graded miss; ABC-251 → O1-c alone; ABC-252 dropped; branch kept).
- Owner word .grugops/context/orch-2026-10-30a/notes/20261101T201630Z-orchestrator-decision-1f5e3b27.md (smoke stays E1650; raise when pooled evidence shows too easy).
- qe-ABC-250 records on main: .grugops/context/qe-ABC-250/ (verdict …4fe9c469, gaps …f2befa65).
## Do
1. ABC-250 page: dated close block — "closed not merged by routing; A4 not graded (UNRESOLVED)"; never "missed". Front matter per the repo's dropped convention (cf. ABC-256). List what was green.
2. ABC-252 page: dropped (consequence), same convention.
3. ABC-251: re-scope to O1-c alone per its own page's miss branch; drop dependencies on packed generation; DoR honest (Architect design input may be owed — say so); keep the QE-259-c/QE-260-a review notes.
4. EPIC-010: rows for 250/251/252 and milestone 1b status; note O1-b part 1 closed. Remaining 1b: ABC-251 (narrowed), ABC-253, ABC-262 is EPIC-011 (no change). EPIC-010 and EPIC-011: the smoke's E1650 is owner-confirmed with the raise rule.
## Fences
plans/tickets/ABC-250*, ABC-251*, ABC-252*, plans/epics/EPIC-010*/EPIC-011* (rows/blocks only), plans/traceability.md (append), your notes. Not board, memory-bank/, src/, tools/, data/. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task bapm-abc250-close, contextRoot = worktree's .grugops/context, never the plugin cache; cite only existing commits), commit, ## Result + trace row, brief + claim to done/.

## Result
- **`ABC-250`: closed not merged by routing; A4 not graded (UNRESOLVED); never "missed".** Front matter is
  `status: dropped`, `column: Done`, per the convention of `ABC-209` and `ABC-256`. A dated close block is added.
  - **What was green:** A1, A2, A3/G4, A5 (1.003 / 0.994 / 1.005), G1, G5–G9, the gates, 6/6 plants.
  - **No `failed-attempt` note is owed.**
  - The branch `grugops/ABC-250` (`2e04eee5`) is kept, and revival needs an Architect-ruled read method.
  - QE-250-a goes to the Architect and QE-250-b to the Orchestrator.
- **`ABC-252`: dropped** (the consequence), with the same front matter and a dated block. Nothing was built.
- **`ABC-251`: narrowed to O1-c alone**, its own "Narrowed form" branch.
  - **Scope:** `pieceType` / `isBlack` (`src/position.ts:52`/`:55`) inlined on the hot path, or made provably
    inlinable. `deepen`'s `Budget` gets a constant shape, with no `...heuristics` spread (`src/engine.ts:719`). On
    today's `Move` objects. No packed-generation dependency remains.
  - **Acceptance:** A1 G4 byte-equal against `main`; A2 the `ABC-240` oracle with 0 mismatches; A3 ≥ 1.03× on two
    boards and ≥ 1.00× on the third (D3 + D3-V2 plus any `arch-abc250-close` rule); A4 struck; A5 gates (G2/G3 if
    `evaluate.ts` changes).
  - **Miss and VOID:** a miss means dropped, with a `failed-attempt` note. VOID goes back to QE.
  - **Size S, P2.** P2 is for the epic-close path. The risk is stated: the bar sits near the top of the 1.00–1.04×
    estimate.
  - **Test notes:** 6 (QE-259-c) and 7 (QE-260-a) are kept. Note 8 is added: generation order is bound by
    `ABC-261`'s and `ABC-262`'s rows.
  - **DoR 9/10, Backlog.** Row 10 waits on `arch-abc250-close`: item 4 is a design input or none, and item 2 is
    QE-250-a's bearing on the read.
  - If the Architect says none, or adds only a forward-only read rule, DoR is 10/10 on that merge and the Ready
    recommendation applies with no further BA/PM hop. Otherwise BA/PM folds the input first.
- **`EPIC-010`:**
  - A dated top block is added.
  - Rows 25–27 are re-stated. The stale status cells of rows 24 and 29–32 are set to Done with their merges.
  - The § Milestone 1b rows are marked.
  - **Milestone 1b status:** O1-b part 1 is closed. Delivered: `ABC-254`, `ABC-259`/`260`/`261` and `ABC-249`.
    Remaining: `ABC-251` (narrowed) and `ABC-253` (Ready), run one after the other.
  - `ABC-262` is `EPIC-011` M0, with no change. Exit readings are about 2 h ALONE (estimate).
- **E 1 650, owner-confirmed, on `EPIC-010` and `EPIC-011`.** "May revert to 1 910" is superseded.
  - **Raise rule:** a pooled S′ score above 85 % over ≥ 30 games re-pins E upward one step (E ≤ 2 600), with no
    owner ask.
  - **BA/PM's reading:** a downward re-pin goes to the owner (the Orchestrator may correct this).
  - "The packed base" is re-read as "the base milestone 1b leaves".
- **Commits:** claim `24f6caae`; records `c64a9672`. The notes, this Result and the move to done/ are in the closing
  commit.
- **Notes** (sealed, contextRoot = this worktree's `.grugops/context`, `at` from `date -u` 2026-11-01T20:25:35Z):
  decision `20261101T202535Z-ba-pm-decision-081194a8`, observation `20261101T202535Z-ba-pm-observation-6878dbe1`.
- **Trace rows** appended to `plans/traceability.md`: `ABC-250`, `ABC-251`, `ABC-252` and `bapm-abc250-close`. The
  refs are on both notes.
- **Not touched:** the board, `memory-bank/`, `src/`, `tools/`, `data/`, the ADRs. Nothing was run, built, timed,
  pushed or merged.
