---
id: 20261012T091901Z-qe-e2e-decision-abc105-qe2-verdict-p-q-closed-3bc30c08
kind: decision
by: qe-e2e
task: qe2-ABC-105
at: 2026-10-12T09:19:01Z
verified_by:
confidence: high
refs:
  - ABC-105
  - plans/tickets/ABC-105-qe-hop-detector.md
  - QE-105-p
  - QE-105-q
  - QE-105-r
  - QE-105-s
  - QE-105-t
  - QE-105-u
  - QE-105-w
  - QE-105-x
  - 20261012T080130Z-qe-e2e-decision-abc105-verdict-pass-with-gaps-8094d5b1
  - 20261012T080623Z-software-engineer-observation-abc105-fix-red-green-plants-verbatim-5c1e7a20
  - 20261012T091900Z-qe-e2e-observation-abc105-qe2-plants-gates-reads-3b7da581
  - 20261012T091902Z-qe-e2e-artifact-ref-abc105-qe2-commands-probe-a1267fb5
supersedes:
---

# QE re-check `qe2-ABC-105`: `QE-105-p` CLOSED, `QE-105-q` CLOSED. `ABC-105` stays PASS_WITH_GAPS, now LOW/INFO only

This is a hand-authored, unsealed note (`AGENTS.md`: no `finding` is admissible on this install). It is QE's
verdict on `grugops/fix-ABC-105`, tip `cf353820`, code `4bf6f3ee`, which is off QE's tip `a0016dbb`. The check
was done on QE's own branch, `grugops/qe2-ABC-105`. The readings are in `…3b7da581`.

| gap | ruling | basis |
|---|---|---|
| `QE-105-p` (MEDIUM) | **CLOSED** | Under QE's own `coverage()`-only refs-only plant text, the new file goes **3 red** (the old file went 1 red). Two of those are new tests: `A3`'s unfiltered `coverage()` on ABC-062/ABC-073, and `A9`'s `--sweep` lists ABC-073. The criterion that earns the ticket now sees the regression itself; it no longer depends only on `A5`'s synthetic negative. The unmutated tool reads 32/32. |
| `QE-105-q` (LOW) | **CLOSED** | QE's `notes/`-dir and note-file symlink plants were 0 red under the old file. Under the new file each is **1 red**, on the matching new `A6` case. The folder-level plant is still caught by the existing test. |

- **Scope holds.**
  - The code change is the test file only (+34 lines).
  - `tools/grugops/qe-hop-integrity.js` is `cmp` 0 to `60415a8a`.
  - There is still 1 test file with 0 spawns, and 0 files under `src/`.
  - `AGENTS.md`, `tsconfig.json`, `biome.json` and the board are untouched.
- **Gates are green at `cf353820`.**
  - Lint, typecheck, build and `npm test` all exit 0: 57 files / 1775 tests, with `success: true`, skip 0 and
    integrity `No findings.`
  - `--sweep` reads 132/38/77/2/15 and exits 1.
- **`QE-105-t`, INFO: addressed for this fix.** The Engineer's plant text is in `…5c1e7a20` verbatim, and QE
  reproduced every row of it. The original build's "5 red" stays unreproducible, but that no longer matters for
  this fix.
- **`QE-105-x`, LOW: still open, and its driver grew.** The new tests add **2 whole-tree reads of the real
  notes**, so the file now makes 5, up from 3. Per the brief, this hop did not re-time the lane. The earlier
  reading of +0.475 s against 650 ms predates these two reads. Re-read `N8-LANE` on this set before trusting
  that margin.
- **Still open, unchanged and not blocking:** `QE-105-r` (symlinked root, LOW, a tool behaviour change),
  `QE-105-s` (LOW, by design), `QE-105-u` (LOW) and `QE-105-w` (INFO).
- **`QE-105-v` / UAT.** The owner waived UAT for ABC-105 on 2026-10-12. That is not re-litigated here.

**Recommendation:** the MEDIUM gap is closed, so QE has no objection to `ABC-105` moving on from `In Review`.
Board, merge and the `Done` exit are the Orchestrator's.
