---
subtask: security-nfr-ABC-199
role: security-nfr
ticket: plans/tickets/ABC-199-two-coverage-heavy-rows-time-out-at-vitests-5-s-default-under-load-lighten-them-and-keep-the-timeout.md
ref: .grugops/context/security-nfr-ABC-199/
branch: grugops/ABC-199 (tip 8c0c5c81; code 3d6856db)
width: 3 (beside qe-ABC-199 and arch-design-ABC-200)
---

# A8: rule whether an N8-LANE CPU reading is owed for ABC-199

## Do
- Read the ABC-199 page (A8, N8-LANE ≤ 650 ms CPU per one-file set), the diff `08d42d01..3d6856db` (two test files, search work only removed), and the SE's census (`…c662ec3c`).
- Rule whether a CPU reading is owed.
  - **If it is not owed,** give the reason, then confirm the diff touches nothing in `src/` outside `*.test.ts`, no `package*.json` and no config.
  - **If it is owed,** say exactly what to measure. Do **not** take it now: the host is reserved for ABC-178's timing hop, and the reading is scheduled after that.
- While you are here, mark two stale catalog cells for correction: `NFR-006` ("not built yet") and `NFR-003` ("no prompt exists"), flagged by BA/PM in `…623c0fed`. Fix them in `plans/nfr-catalog.md` only if that file is yours to edit.

## Fences
- Records only (plus `plans/nfr-catalog.md` if you own it). No vitest or timing runs. Work on `grugops/security-nfr-ABC-199` (worktree `../wt-security-nfr-ABC-199` from `main`). Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/sec199/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `security-nfr-ABC-199`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief, then move it to `done/`.
