---
subtask: qe-ABC-197
role: qe-e2e
ticket: plans/tickets/ABC-197-one-step-100-uci-row-restores-the-dropped-token-budget-band-qe-177-b.md
ref: .grugops/context/qe-ABC-197/
branch: grugops/ABC-197 (tip 20e397c8; base 051d557a); worktree ../wt-ABC-197 (read only)
inputs: BA/PM re-rule …4df5ef95 (A5 is now 3 probes: QP0, QP6, QP6-2800); SE …3c9e5d2b, …eeec2b5f (open them only after your verdict)
width: 1
---

# QE gate for ABC-197, non-timing part: A1–A5 and A8. A6/A7 go to a later quiet-host timing hop

## Do
- Create your own worktree `../wt-qe-ABC-197` on `grugops/qe-ABC-197` from the tip. Merge the current `main` in first (a merge, not a rebase). Run your own `npm ci --ignore-scripts`.
- Re-read A1–A4 on your own runs, including the node census against 26 000. Then run A5 **as re-ruled**: `gp.mjs` plus the QP6-2800 variant, on the file and on the lane, at base and at tip. Also check the clock rule `time = (⌈G/step⌉ + 1) · step` from the code.
- A8 gates at your merge: lint, typecheck, build; `npm test` + `last-run.json` (61 / 2 019); skip capture → `test-skip-integrity.js`; `UCI_DEEP`. Heap 128 multi-file, 400 one-file. The UAT waiver form must print nothing.
- **No timing claims.**
- Verdict: PASS, PASS_WITH_GAPS or FAIL for A1–A5 and A8, with a gap register (`QE-197-x`). Name A6/A7 as owed.

## Fences
- Work only in `../wt-qe-ABC-197` and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe197/`. Commit notes plus a `## QE` section on the ABC-197 page in your worktree. No `src/` edits on the tip; no `package*.json`, `AGENTS.md`, `plans/board.md` or `plans/traceability.md`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-197`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**QE/E2E, 2026-10-23: PASS_WITH_GAPS for A1–A5 and A8** (decision `…479b5c68`). Every gap is INFO and none blocks.
**A6 and A7 are owed** to the quiet-host timing hop. The Orchestrator moves the board (`plans/` fenced).

- **Where it ran:**
  - Worktree `../wt-qe-ABC-197` on `grugops/qe-ABC-197`, cut from tip `20e397c8`.
  - **Merge `82a3f153`** brings in `main` `8804937e`. It is a merge, not a rebase, with no code change from the tip.
  - **Commit `1f2aa4b0`**: 5 sealed notes and the `## QE` section on the ABC-197 page.
  - Own `node_modules` (`npm ci --ignore-scripts`). Scratch only in `…/scratchpad/qe197/`. Base `051d557a` (the
    branch point; `ABC-199` merged after `ABC-178`).
  - Not pushed. Nothing was merged into `main`.
- **Verdict formed before** the SE's notes were opened (08:32:26Z). They agree on every shared number. Before the
  verdict, QE had read the BA/PM inputs, which quote the SE's scan.
- **A1 MET.** R2 reads `info string …` / `info depth 5 score cp 55 nodes 25621 time 3100 … pv g1f3` / `bestmove g1f3`.
- **A2 MET.** One file, one hunk, 0 `-` lines: the citing comment, the 9-line row and 1 blank line (`QE-197-c`).
- **A3 MET.** File 127 → 128 and lane 2 018 → 2 019, all passed, 0 skipped. As multisets, tip − base = {R2} and
  base − tip = ∅.
- **A4 MET.** R2 reads 25 621 nodes, ≤ 26 000. The other 127 rows are unchanged; sum 579 269 → 604 890.
- **A5 MET.** `gp.mjs` byte copy plus QP6-2800, added to the scratch copy `gp197.mjs` before any tip run.
  - QP0: 0 red at base and at the tip, on the file and on the lane.
  - QP6 and QP6-2800: R2 alone red at the tip, 1 / 128 on the file and 1 / 2 019 on the lane. The base is green under
    both, 0 / 127 and 0 / 2 018.
- **Clock rule holds.** `time = (⌈G/s⌉ + 1) · s` follows from `virtualClock` (it returns the reading, then adds s)
  and `deepen` (it stops at the first read ≥ start + G, then reads once more). The scan matches 34 / 34 rows at steps
  100 and 1 000.
- **A8 MET** at `82a3f153`:
  - lint, typecheck and build 0;
  - `npm test` 61 / 2 019 rc 0, and `last-run.json` reads success true (fresh);
  - skips 0 → `No findings.`;
  - UCI_DEEP 5 / 5;
  - M4 sweep row green; the M4 plant reds it (13 / 128);
  - heap 128 multi-file and 400 one-file;
  - the waiver form prints nothing.
- **Gaps:**
  - `QE-197-a`: the (2 800, 3 000) residual. Accepted by BA/PM.
  - `QE-197-b`: R2's comment and title wording ("1 000 band"; the time window called "G").
  - `QE-197-c`: the blank line in A2's hunk.
  - `QE-197-d`: the kill rests on R2 alone.
  - `QE-197-e`: the `nodes`/`mate`-only drop path is out of scope.
- **Notes:** `.grugops/context/qe-ABC-197/notes/` (on `grugops/qe-ABC-197`):
  - A1–A4 `…f789357b`
  - A5 and the clock rule `…34a8abc0`
  - A8 `…5fc0dfac`
  - gaps `…246cfd1c`
  - verdict `…479b5c68`
- **No timing claims** and no `N8-LANE` or `NFR-008` reading.

**Trace row** (for the Orchestrator):

| ABC-197 (qe-ABC-197) | QE: A1–A5 and A8 met on own runs at 82a3f153 (main 8804937e merged into tip 20e397c8), base 051d557a; R2 time 3100, 25 621 nodes; A5 re-ruled: QP0 green, QP6 and QP6-2800 red R2 alone at the tip (file 1/128, lane 1/2019), base 0/127 and 0/2018; clock rule (⌈G/s⌉+1)·s 34/34 | EPIC-007 | — | QE-177-b; NFR-008 and N8-LANE not read (A6/A7 owed, quiet-host timing hop); QE-197-a/-b/-c/-d/-e INFO | grugops/qe-ABC-197 @ 1f2aa4b0 (merge 82a3f153)<br>.grugops/context/qe-ABC-197/notes/ (5), ABC-197 page ## QE | lint/typecheck/build 0; npm test 61/2019 = base + 1 (multiset tip − base = {R2}), success true; skips 0, No findings.; UCI_DEEP 5/5; census 579 269 → 604 890 (R2 25 621); M4 sweep red under plant 13/128 | UAT waived (0 production lines; waiver form empty; not a signature) | — | In Review (QE A1–A5/A8 PASS_WITH_GAPS …479b5c68; A6/A7 owed to the timing hop; Orchestrator's move) |
