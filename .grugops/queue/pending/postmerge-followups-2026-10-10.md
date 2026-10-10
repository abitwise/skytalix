---
task: wave-2026-09-25
subtask: postmerge-followups-2026-10-10
role: ba-pm
workflow: agent-factory/workflows (BA/PM fold + cuts)
ref: .grugops/context/postmerge-followups-2026-10-10/
source_refs: .grugops/context/secnfr-ABC-053/ (…8deff3d6: AR-053-COMPOSER, AR-053-ORDER)  .grugops/context/qe-ABC-053/ (…a4b293d2)  .grugops/context/secnfr-ABC-058/ (…ae61a3cb: F-058-1, AR-058-STRIP/SAMPLE)  .grugops/context/qe-ABC-126/ (QE-126-b)
enqueued_by: orchestrator
enqueued_at: 2026-10-10T12:19:32Z
branch: grugops/postmerge-followups-2026-10-10
base: grugops/wave-2026-09-25 (tip after this enqueue)
---

# Subtask: fold and cut the follow-ups today's merges left owed

1. **`ABC-054`** (now unblocked by `ABC-053`'s merge `a090dda0`): fold AR-053-COMPOSER (either count
   re-export hops and `import("./frame.ts")` in the composer tripwire, or narrow the docblock's
   "fails closed" claim — say which) and AR-053-ORDER's test note (re-run QE's two arming-order control
   builds). Re-anchor to today's tree; re-score; say Ready.
2. **CUT XS:** the three stale production docblocks `ABC-053` left (`src/render-seam.ts:34-36`,
   `src/result-screen.ts:13-15`, `src/cli.ts:8`). Production lines → owner UAT word; say so.
3. **CUT `F-058-1`** (LOW, P3): spawn pin counts every `node:child_process` import form and every call to
   a `child_process` member over the TypeScript parser's view; decide whether `P1` folds in. Order vs
   `ABC-059` (same file, Ready).
4. **QE-126-b:** the `+N` gain in a puzzle row's `source` is never checked against the oracle — fold into
   `ABC-131` (Ready, same files) or cut; say which.
Next free ids after ABC-131. Fences: no `src/`, no `plans/board.md`, no ADRs. Decision note per
Workflow 16; trace rows at the END of `plans/traceability.md`.
