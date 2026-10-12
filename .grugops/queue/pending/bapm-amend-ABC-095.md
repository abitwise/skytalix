---
task: wave-2026-09-25
subtask: bapm-amend-ABC-095
role: ba-pm
ref: .grugops/context/bapm-amend-ABC-095/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/bapm-amend-ABC-095
base: main @ 22614b9d
---

# Subtask: BA/PM amends ABC-095, ABC-119 and ABC-043 (+ confirms ABC-044/045/046) to the Architect's and Security/NFR's wiring rulings, so the SE wiring hop has a correct contract

Rulings on main: ADR-0037 § Addendum — 2026-10-12 (R1–R3, merge order) with the exact amendment list in `.grugops/context/design-ABC-095-wiring/notes/…a4fe3027`; ADR-0036 § "S1 — the fourth holder — 2026-10-12" and the S3 checklist in `.grugops/context/secnfr-ABC-095-placement/notes/…a096cf43`. Apply the Architect's BA/PM list verbatim in substance (ABC-095 Scope/A7/Security/NFR-004/NFR-008/lane-cost/size; ABC-043 A1 pointer, A5 (N) row, A2/A7 (N); ABC-044 A3, ABC-045, ABC-046 confirm (N); ABC-042 no change; ABC-119 A1/A3/A4 Givens + default-lane row), plus Security/NFR's additions:
- ABC-119 A1's Given and its default-lane row require a REAL copy with no symbolic links (Node resolves `import.meta.url` to the real path; a linked `src/` reads the repo's book), made under `mkdtemp(os.tmpdir())`, `rmSync` only on that exact path.
- ABC-119 A3(iv) asserts the book-absent warning is PRESENT (the leak detector).
- ABC-095's Security bullet cites ADR-0036 § S1 and the S3 checklist; name `AR-095-READ` (LOW, oversized/non-regular `book.json`) and `AR-095-L1UNIT` (LOW, until clause-b.mjs folds Ruling 2) as the accepted risks they are.
- A2's Given stated as COLD (first call in a fresh process); the 5 ms miss bar as WARM with R3's procedure (warm-up hit, 200 timed calls, max ≤ 5 ms, median and p99 recorded).
- Re-check size (S may become M given +1 production module, 10 re-targeted children, ABC-119's lane edit) and say so. Re-score ABC-095's DoR; it must stay 10/10 for the wiring hop to proceed.
All edits dated and append-only where the page is Done (ABC-043/044/045/046/119 are Done tickets: dated amendment sections, criteria text struck-not-deleted). Note on each Done page that the amended criterion is delivered by ABC-095's diff.

## Fences (you are the ONLY hop running, width 1)
Edit only those ticket pages under `plans/tickets/`, your notes under `ref:`, and one trace row at the END of `plans/traceability.md`. Do not touch `src/`, `tools/`, ADRs, `plans/board.md`, `AGENTS.md`. Own worktree (`git worktree add ../wt-bapm-amend-ABC-095 -b grugops/bapm-amend-ABC-095 main`); `node_modules` into the worktree root only if needed. No `update-ref`, `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. No timing readings. Run the gates before your last commit if you change any committed file other than notes (lint, typecheck, build, `npm test` success:true). End commits with a `Co-Authored-By:` trailer naming the model you are. Queue: `mkdir .grugops/queue/claimed/bapm-amend-ABC-095`, then FLAT done files, uncommitted; `rmdir` the claim dir. Report: branch tip, each page's amendments, ABC-095's new DoR table, size, and anything still open.
