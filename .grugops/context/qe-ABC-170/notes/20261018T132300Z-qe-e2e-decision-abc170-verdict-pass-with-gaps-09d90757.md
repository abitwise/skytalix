---
id: 20261018T132300Z-qe-e2e-decision-abc170-verdict-pass-with-gaps-09d90757
kind: decision
by: qe-e2e
task: qe-ABC-170
at: 2026-10-18T13:23:00Z
verified_by:
confidence: high
refs:
  - ABC-170
  - plans/tickets/ABC-170-the-engine-takes-two-optional-limits-maxdepth-and-maxnodes.md
  - ADR-0044
  - EPIC-007
  - ABC-167
  - NFR-005
  - NFR-008
  - QE-170-a
  - QE-170-b
  - QE-170-c
  - QE-170-d
  - QE-170-e
  - QE-170-f
  - QE-170-g
  - 20261018T132000Z-qe-e2e-observation-abc170-criteria-and-gates-8bd2de27
  - 20261018T132100Z-qe-e2e-observation-abc170-break-attempts-bca451d6
  - 20261018T132200Z-qe-e2e-observation-abc170-mutants-c63fb059
  - 20261018T122615Z-software-engineer-observation-readings-7c1e4a90
  - 20261018T122616Z-software-engineer-decision-reference-and-pins-3b9d52e1
supersedes:
---

# QE `ABC-170` on `grugops/ABC-170` (tip `64b07741`, code `e29f7951`, base `358810ac`): **PASS_WITH_GAPS**

This note is hand-authored and unsealed. No timing reading was taken. A6 (`NFR-005`) is **OPEN**, owed in a quiet window as the
Orchestrator's reading. Nothing was committed to `grugops/ABC-170`, pushed or merged.

| item | ruling | basis |
|---|---|---|
| A1 | **MET** | d3 = `search(p,3)` `e1f2` 151. d1 gives a legal move. Unlimited reaches d7 (`…8bd2de27`) |
| A2 | **MET** | 20 058 ≤ 21 024. d3 = `search(p,3)`. `maxNodes: 1` gives d1. The discard held 102/102 across a sweep of values, and a partial-best mutant (M19) is killed |
| A3 | **MET** | Against the **base** engine: 6 768 comparisons on 72 positions, 3 doors and 4 tip variants, 0 mismatches in all five fields (`…bca451d6`) |
| A4 | **MET** | hunks `:517` and `:520-523`, then appended `:1222+`. The export, arity, `budgetMs` and behavioural rows are unedited and green |
| A5 | **MET** | `RF-1` is unedited and green. Both new rows are green |
| A6 | **OPEN** | not read and not estimated |
| A7 | **MET** | exactly two `src/` files. The wide limb grep over the `+` lines is empty |
| Gates | **green** | lint, typecheck and build exit 0. `npm test` exit 0 on the first run, 58 files, 1839/1839. Integrity `No findings.`. `merge-tree` against main `b4645a82` is clean |
| UAT waiver | **does not apply** | production `src/engine.ts` is in the diff |

## Gap register
No acceptance criterion is unmet. None of these gaps blocks on its own. QE-170-a should be fixed before the gate.
- **QE-170-a MEDIUM (flake risk).** The `ABC-170 A3` row ran 3.4-4.8 s against vitest's default 5 s `testTimeout`. It timed out in
  11 of 18 lane runs under moderate load, with no assertion failing. A per-row timeout (as the deep rows have) or a smaller budget
  would fix it. A smaller budget means amending A3's "50 ms" wording, which is BA/PM's call. The row's `NFR-008` cost is
  `UNKNOWN - verify` at the gate's `N8-LANE` measurement.
- **QE-170-b LOW.** A `maxNodes` default is pinned nowhere. Defaults of 60 k, 200 k and 10 M all survive the lane (M08/b/c).
  The ticket puts "any default value for either field" out of scope, but only `maxDepth` has a text pin. A default low enough
  to hurt would show up only at A6's real-clock reading. A one-line text pin on `maxNodes: options.maxNodes ?? Number.POSITIVE_INFINITY,`
  would close it.
- **QE-170-c LOW, already there before this ticket and not a regression.** A constant depth cap in the loop **body**
  (`if (iteration > N) break;`) evades both the old and the amended A4 check, because the ban regex is one-directional.
  `ABC-122 A8` catches N ≤ about 128. N ≥ 130 survives (M10b/c).
- **QE-170-d LOW.** The clock-first order inside `countNode` is unpinned (M04 survives). The only effect is one fewer clock read,
  so `elapsedMs` is one tick lower when the node limit fires. The absent path is unaffected. The header order is pinned only by the A4 text check (M05).
- **QE-170-e INFO.** A1/A2's `search(p, d)` oracle holds at the chosen fixtures but is not an engine invariant: 21 of 102 sweep rows
  differ while the discard is correct. If a future engine change moves the A2 fixture to another depth, the row could go red
  with the discard still correct. `chooseMove({maxDepth: d})` is the exact discard oracle.
- **QE-170-f INFO.** An extra clock read added to **both** paths (M16, M18) is invisible to the new `ABC-170 A3` row, despite
  its comment. It is caught by older exact-count rows (`ABC-086 A1`, levels R1, `G1`, transposition A6, engine A3 abort) and by
  probe A. "Absent = today" holds, but its guard is that older set of rows and not the new row.
- **QE-170-g INFO, for `ABC-167`.** The edge semantics are unspecified but safe and consistent:
  - `maxDepth`/`maxNodes` of ≤ 0, NaN or below 1 give d1 with a legal move;
  - a fractional `maxDepth` floors;
  - `null` is treated as absent;
  - below the depth-1 cost, the reported `nodes` exceeds `maxNodes` (position-4 at `maxNodes: 1` reports 1 484).
  The UCI mapping should validate `go depth 0` and `go nodes N` itself.

**Next column:** for the `In Review` exit, QE recommends `In Security/NFR` for the A6 quiet-window reading, with QE-170-a
fixed or explicitly accepted first. UAT is required because the waiver does not apply. The Orchestrator decides. I did not
touch `plans/board.md` or `plans/traceability.md`; the trace row is in the handoff.
