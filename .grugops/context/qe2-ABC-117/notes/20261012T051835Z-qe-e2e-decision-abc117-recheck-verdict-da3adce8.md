---
id: 20261012T051835Z-qe-e2e-decision-abc117-recheck-verdict-da3adce8
kind: decision
by: qe-e2e
task: qe2-ABC-117
at: 2026-10-12T05:18:35Z
verified_by:
confidence: high
refs:
  - ABC-117
  - ABC-115
  - A1
  - A4
  - A5
  - A6
  - A7
  - S10
  - S11
  - QE-117-a
  - QE-117-c
  - QE2-117-a
  - QE2-117-b
  - 20261012T051835Z-qe-e2e-observation-abc117-recheck-readings-da88891b
  - 20261012T051835Z-qe-e2e-observation-abc117-recheck-search-and-fences-4e3fc7de
  - 20261012T051835Z-qe-e2e-artifact-ref-abc117-recheck-commands-and-gates-ac7248ac
supersedes:
---

# QE re-check `ABC-117` (widening for QE-117-a / QE-117-c): PASS_WITH_GAPS

Reviewed tip `86bf76b5` (corrections `7bf4c61e`, base `3537fe48`). I did not author the repair. I
took my readings before reading the Engineer's notes. This is an agent `decision`, not a stamp
(`human_admission` is `off`).

| item | verdict |
|---|---|
| 1 A1 re-taken; S10/S11 wording and the five line cites against QE's readings | **MET** |
| 2 S10 appended at END, `ABC-115` row `cmp` equal, names row + clause, re-opens nothing; S11 shape; only added notes | **MET** |
| 3 page: original `## Out of scope` bullet kept, dated correction true | **MET** |
| 4 QE-117-c referent unambiguous, 3 lines comment-only, nothing new said | **MET — QE-117-c closed** |
| 5 QE's own search: no CLAIM-B beyond S1–S11; `…8d7cad3b:80` not a site | **MET — QE-117-a closed** |
| 6 fences A4–A7 vs `3537fe48`, `T2` not fired, gates at tip, UAT-waiver reading | **MET; waiver applies** |

## Gaps

- **QE2-117-a (LOW, wording, not blocking).** Five corrections compress the mechanism to "the
  re-throw fires on a later tick than `main`'s `try`": board `:661` (S6/S9), `ABC-115` page `:321`
  (S7), `src/cli.test.ts:3368` (S8), trace `:1035` (S10) and `…3429abce:43` (S11). Measured, `main`'s
  `try` is **still open** (suspended on `await runTurnLoop`) when the listener throws, and the throw
  still escapes. If that sentence is read as "after the `try` was left", it is wrong about the
  product. The precise wording, "no `try` on the stack" from an emitter listener, is already in
  `…0081a95a` (ii), which is the note a future hop is pointed to. **The conclusion every one of the
  five sites draws (`1` is Node's, and no `try`/`catch` can route it) is TRUE.** No CLAIM-B
  sentence was created. Recommendation: **no further hop before merge.** Correcting five records
  append-only to sharpen a true conclusion costs more than the imprecision. If the residual-closing
  ticket is ever cut (`ABC-117`'s `P1` trigger), its cut should cite `…0081a95a` (ii) and this note,
  not the paraphrase. Routing is the Orchestrator's.
- **QE2-117-b (INFO).** QE's search surfaced two value-level "collision" lines that `…9016b077`
  does not enumerate: trace `:117` and `ABC-115` page `:449`. Both are judged **not** sites, so no
  action is needed.
- **Carried, not this delta's:** QE-117-b (LOW, BA/PM: amend A1's quantity to the `usage:` line) and
  QE-117-d's four lines left alone. Neither was in this hop's scope, and neither is re-scored here.

## Board

`ABC-117` may leave `In Review`. With 0 production lines (measured), UAT is waived under the
2026-08-17 standing rule, so the next column is the Orchestrator's to set (`Ready for UAT` → `Done`
on the waiver). QE moves no column itself and writes nothing to `plans/board.md`, per the subtask's
fence.
