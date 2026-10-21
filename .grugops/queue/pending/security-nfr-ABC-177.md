---
subtask: security-nfr-ABC-177
role: security-nfr
ticket: ABC-177
branch: grugops/ABC-177 @ f81bf03c (base ff1e375f)
ref: .grugops/context/qe-ABC-177/
width: 2 (beside arch-O3-ABC-177; neither runs timing)
---

# Security/NFR review of ABC-177: NFR-008 line, R-174-1 ruling, catalog fold-ins

## Read first
- The ticket `plans/tickets/ABC-177-*.md` and ADR-0046.
- `.grugops/queue/done/qe-ABC-177{,-timing,-timing-2,-timing-3}.md`.
- QE notes `…bc49c2fe`, `…84059cad`, `…e808274d`, plus the owner words:
  - `…bfdc97e5` (AC only);
  - `…b87c35b6` and `…f8cd47ba` (foreign runs logged);
  - `…31ab7d2d` (thermal kept, **ABC-177 only, no precedent**).
- The `plans/nfr-catalog.md` NFR-008 row, and R-174-1.

## Do
1. **NFR-008 verdict on `f81bf03c`.** QE reads MET at 9.395 s, flagged warm host 5/8, foreign runs logged, under the ABC-177-only thermal rule; the strict view is VOID. Rule MET or NOT MET and record exactly which flags go on the catalog line.
2. **R-174-1: discharge or not.** Rule on it and give the reason.
3. **Catalog fold-in, owed since 2026-10-20.** Add the AC-power rule (`…bfdc97e5`) to the NFR-008 row. Record the ABC-177-only thermal exception as an exception, not a rule change.
4. **Security surface.** The change is test-only (`src/uci-session.test.ts`); confirm that nothing else is touched.
5. **QE gaps:** the B/T twin at 1.54 % against the 1.5 % bar (ADR-0035 d1), and the `sampler174.mjs` crash on an unparsed `ps` line. Accept each as a risk, require a fix, or cut it to BA/PM.

## Fences
- Do not edit `plans/nfr-catalog.md` beyond the NFR-008 row and its risk block.
- Do not edit `src/` or the worktree.
- Run no timing. Never push or merge.

## Publish
- Sealed notes via the sanctioned writer (task `security-nfr-ABC-177`).
- Write `.grugops/queue/done/security-nfr-ABC-177.md` (brief + `## Result`) and `.claim.md`, uncommitted. The result gives the verdict (PASS / PASS_WITH_RISKS / FAIL), the required fixes, the accepted risks, and a trace row.
