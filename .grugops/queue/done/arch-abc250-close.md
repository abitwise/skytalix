---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-01T20:17:00Z
subtask: arch-abc250-close
role: architect-design
ref: .grugops/context/arch-abc250-close/
branch: new grugops/arch-abc250-close from main (worktree .claude/worktrees/arch-abc250-close)
width: records only, beside bapm-abc250-close (plans/ only) and se-ABC-262.
---
# Architect: ADR-0055/0056 status after ABC-250; rule on QE-250-a; E1650 confirmed
## Inputs
Decision .grugops/context/orch-2026-10-30a/notes/20261101T201645Z-orchestrator-decision-d2571be5.md; owner .grugops/context/orch-2026-10-30a/notes/20261101T201630Z-orchestrator-decision-1f5e3b27.md; qe-ABC-250 on main (.grugops/context/qe-ABC-250/: PREREG …7ff2b573, verdict …4fe9c469, A4 …677d4d41, host …c320bc15, gaps …f2befa65); se-ABC-250 informal speed …ff7ffb6e (allocation ~4 % of perft after ABC-254).
## Do
1. ADR-0055: dated status line — O1-b part 1 (ABC-250) closed not merged by routing (A4 not graded); O1-b part 2 (ABC-252) dropped; what O1 has delivered so far (ABC-254 lazy legality 1.11–1.12×) and what remains (O1-c via ABC-251, O1-a via ABC-253). Re-estimate the remaining O1 speed path honestly in one paragraph.
2. QE-250-a: rule whether future short-run reads (perft-scale) need a cool-down/thermal gate or core pinning beyond D3-V2 — forward-only addendum, or "not needed now" with reason. ABC-251/253's A4 reads are search/perft? Say what their reads should use.
3. ADR-0056: one dated line — smoke E1650 owner-confirmed; raise under the re-pin rule.
4. Does ABC-251 (narrowed to O1-c) need a design input? Give it, or say none.
## Fences
memory-bank/50-decisions/ADR-0055*, ADR-0056*, your notes. Run nothing. No push, force, amend, rebase, merge into main.
## Publish
Sealed notes (task arch-abc250-close, contextRoot = worktree's .grugops/context, never the plugin cache), commit, ## Result + trace row, brief + claim to done/.

## Result
- **By:** Architect/Design (claude-opus-5-5), branch `grugops/arch-abc250-close` from `main` `767a2e3e`. Records only.
  Nothing run, built, timed, pushed or merged. Inputs were read through the sanctioned reader, `git` and `src/`.
- **1. ADR-0055, dated status line.**
  - `ABC-250` (O1-b part 1) is closed, not merged, by routing. Its A4 was **not graded**: kiwipete and start VOID,
    position-6 valid at 1.111. The wording "not graded, closed by routing" is carried. The branch is kept, and a
    revival needs a perft method ruled first.
  - The rest of O1-b is dropped (`ABC-252`, and `ABC-251`'s full form). `ABC-251` narrows to O1-c alone.
  - Delivered: O1-d (`ABC-254`) at 1.11–1.12×, below D1's 1.15–1.40× band. Remaining: O1-c (`ABC-251`, ≥ 1.03×) and
    O1-a (`ABC-253`, ≥ 1.02×).
  - **Re-estimate:** O1-c ≈ 1.00–1.04× and O1-a ≈ 1.01–1.06×, together ≈ 1.01–1.10×, central ≈ 1.04× (≈ 3–6 Elo,
    informal). O1 in total ≈ 1.12–1.23×, central ≈ 1.16×, against D1's 1.25–1.85× (central 1.5×).
  - Both remaining bars sit inside their estimates, so a miss (dropped) is likely and harmless. Speed beyond O1 is
    `ADR-0056` V3 and V4.
- **2. QE-250-a: not needed now. D3-V2 stands unchanged** (ADR-0055 § Addendum — 2026-11-01, second).
  - No open ticket owes a graded perft-scale read.
  - The search reads at 4 000 ms graded valid on 7 of 7 boards, in the same thermal band where the perft read voided.
  - **`ABC-251` A3 and `ABC-253` A5 are search reads.** They use D3-V2 as written, with no cool-down and no pinning.
    The agreement guard reads each ticket's own bars (1.03 / 1.00 and 1.02 / 1.00). Perft stays INFO.
  - If a perft-scale read is ever graded, the method order is: an untimed base-against-base diagnosis first, then the
    least intrusive fix that answers it (a cool-down gate if heat drives the spread, `taskset` CPUs 0–3 if placement
    does). More REPS alone is not a fix. No bar loosens.
- **3. ADR-0056, one dated line.** S′ keeps E 1 650 (owner, `…1f5e3b27`). E is raised under S′'s re-pin rule as
  written: pooled > 85 % over ≥ 30 games, one band-rule step up, E ≤ 2 600, with no further ask. The downward side
  stays as written. The first S′ reading is 9/10 (`qe-ABC-255` `…f41a5b6e`), which is not yet a pool. The line points
  V1/V2 at ADR-0055's re-read.
- **4. ABC-251 needs a design input, and it is given** (decision `…a07418ac`).
  - It is value-identical by construction, so no ADR is needed.
  - **Profile first, with a stop rule:** if `isBlack` / `pieceType` do not show as frames, inline nothing. If nothing
    measurable shows, report before any ALONE read is spent.
  - Inline only at the hot sites the profile names. `evaluate.ts` is touched only if named, because that owes `G2` /
    `G3`.
  - Replace `...heuristics` in `deepen`'s `Budget` literal with the six fields written out. Expected effect: small.
  - Nothing else is in scope. The read is a search read under D3-V2. Order against `ABC-253`: either order works,
    and the page's order stands.
- **Owner ask:** none. No bar, NFR bound, requirement or scope moves, and no ADR is reversed.
- **Commits:** claim `f8c27b71`; ADRs `032def2a`; notes, this Result, the trace row and the move to done/ in the
  closing commit.
- **Notes** (sealed via `admitAndAppend`, contextRoot = this worktree's `.grugops/context`, `at` from `date -u`
  2026-11-01T20:23:47Z): decision `20261101T202347Z-architect-design-decision-aeb470f4` (rulings), observation
  `20261101T202347Z-architect-design-observation-f5f41888` (re-estimate), decision
  `20261101T202347Z-architect-design-decision-a07418ac` (ABC-251 design input).
- **Trace row** appended to `plans/traceability.md`. Refs on the notes: ADR-0055, ADR-0055-D3-V2, ADR-0056,
  ABC-250…254, EPIC-010, QE-250-a/b, QE-255-d, NFR-001.
- **For the Orchestrator:** `bapm-abc250-close` (concurrent) owns the `ABC-251` page re-scope. Its Problem, Value and
  Dependencies sections still describe the packed core. QE-250-b (foreign vitest in ALONE windows) is still open for
  the ABC-251/253 reads.
