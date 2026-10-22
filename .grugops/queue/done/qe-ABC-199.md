---
subtask: qe-ABC-199
role: qe-e2e
ticket: plans/tickets/ABC-199-two-coverage-heavy-rows-time-out-at-vitests-5-s-default-under-load-lighten-them-and-keep-the-timeout.md
ref: .grugops/context/qe-ABC-199/
branch: grugops/ABC-199 (tip 8c0c5c81; code 3d6856db; base 08d42d01); worktree ../wt-ABC-199 (read only)
width: 3 (beside security-nfr-ABC-199 and arch-design-ABC-200, both records only)
---

# QE gate for ABC-199 (A7): re-read A1–A6 on your own runs

## Do
- Create your own worktree `../wt-qe-ABC-199` on `grugops/qe-ABC-199` from the tip. Merge the current `main` into it first (a merge, not a rebase) and report the sha. Install its own `node_modules` with `npm ci --ignore-scripts`. Never use main's `node_modules`.
- Re-read A1–A6 with your own runs **before** opening the SE's notes (`…c662ec3c`, `…925c7566`, `…71bb85ca`). That covers the node census at base and tip, K1–K4 planted on your own scratch copies at base and tip, the A5 diff scope and test-name equality, and the gates.
- The SE planted K1 one particular way: it keeps the best move and score of the cut-off search and leaves the reported depth alone. That plant is green at base. Plant it your own way and let your base reading decide.
- Gates at your merge: lint, typecheck, build; `npm test` plus `last-run.json` success; skip-count capture → `test-skip-integrity.js`; `ENGINE_DEEP`, `UCI_DEEP`. Heap 128 multi-file, 400 one-file. The UAT waiver form must print nothing.
- **No timing claims and no NFR-008 readings.** Each `A` row is a pass/fail reading, not a time.
- Verdict: PASS, PASS_WITH_GAPS or FAIL, with a gap register (`QE-199-x`).

## Fences
- Work only in `../wt-qe-ABC-199` and `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/qe199/`. Commit typed notes plus a `## QE` section on the ABC-199 page in your worktree. No edits to `src/` on the tip, `package*.json`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md` or other pages. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `qe-ABC-199`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in **main's** `.grugops/queue/`, then move it to `done/`.

## Result

**QE/E2E, 2026-10-22: PASS_WITH_GAPS** (decision `…be6588e4`). Every gap is INFO and none blocks. QE releases `In Review` → `In Security/NFR`; the Orchestrator moves the board (`plans/` fenced).

- **Where it ran:**
  - Worktree `../wt-qe-ABC-199` on `grugops/qe-ABC-199`, cut from tip `8c0c5c81`.
  - **Merge `d4b2536e`** brings in `main` `8bd75e46`: a merge, not a rebase, with no code change from `main`.
  - **Commit `09da7990`**: 5 sealed notes and the `## QE` section on the ABC-199 page.
  - Own `node_modules` (`npm ci --ignore-scripts`).
  - Scratch only in `…/scratchpad/qe199/`.
  - Not pushed, nothing merged into `main`.
- **Verdict formed before** the SE's notes were opened. They agree on every shared number. One disclosure: QE's whole-diff `timeout` grep showed 2 lines of them first (`QE-199-e`).
- **A1 MET.**
  - N 6 000.
  - Row 1: 6 746 nodes, inside [6 000, 7 024].
  - Row 2: d = 2, 6 746 > 2 538, census 35 759 → 11 221 (31.4 %).
  - Row 3, `LONG_MS` and `tickingClock(1)` are byte-identical.
- **A2 MET.**
  - Step 100; free depth 5, so the floor stays ≥ 5 and the title is unchanged.
  - Capped half: 2 lines, depth 3.
  - Census 55 972 → 26 276 (46.9 %).
- **A3 MET.** K1–K4 are red at base and at the tip, all 4 counted.
  - K1 is QE's own shape: the partial move and score are played, and the aborted depth is reported. It reds through the nodes inequality: base `20058 > 26733` false, tip `6746 > 9119` false.
  - K2: `5112410 ≤ 21024` / `≤ 7024`. K3: `6 ≠ 3`. K4: `4 ≠ 3`.
  - Not counted: K1m (move only) is green at both ends. K1se (the SE's shape) is green at base and red at the tip (`70 ≠ 109`).
- **A4.** The fallback was not taken, and the readings justify that for both rows.
- **A5 MET.**
  - Name-only: the 2 test files plus 3 SE notes.
  - `timeout` on `+` lines in `src/`: 0. `vitest.config.ts` is unchanged.
  - Hunks: 1269–1276 inside the A2 block (1265–1316), and 363–370 inside the A7 block (361–524).
  - Names are equal per file (47 / 126) and over the whole suite (1 995 on 60 files).
- **A6 MET** at `d4b2536e`.
  - lint, typecheck and build 0.
  - `npm test` 60 / 1 995 rc 0, and `last-run.json` reads success true (fresh). Base also 60 / 1 995.
  - Skips 0 → `No findings.`
  - Coverage, both forms × 2 runs: `numFailedTests` 0 (JSON reporter).
  - ENGINE_DEEP 60 / 60, UCI_DEEP 5 / 5. Heap 128 multi-file, 400 one-file.
  - The waiver form prints nothing.
- **Gaps:**
  - `QE-199-a` (Orchestrator): `ABC-178` is not on `main`. The trial merge-tree is clean, and its hunk is in `ABC-167 A6`. Merge after it lands, then re-gate on the merged tree.
  - `QE-199-b`: d ≥ 2 is not asserted.
  - `QE-199-c`: A7's floor margin is 0 plies; the row fails closed.
  - `QE-199-d`: K1's kill depends on the plant's shape.
  - `QE-199-e`: A5's `timeout` wording also matches note prose.
- **Notes:** `.grugops/context/qe-ABC-199/notes/` (on `grugops/qe-ABC-199`):
  - census `…b763e8a0`
  - plants `…658d4ad2`
  - A5/A6 `…7ab55568`
  - gaps `…1593ea77`
  - verdict `…be6588e4`
- **No timing claims** and no `NFR-008` or `N8-LANE` reading.

**Addendum (same hop, after the verdict).** `main` moved from `8bd75e46` to `bd745ac9` during this hop. The move is records only: nothing changed under `src/`, `tools/`, `vitest.config.ts` or `package*.json`, so the merge `d4b2536e` readings stand. Security/NFR has already recorded A8 as not owed (`…3a990437`, merged `10c16ad9`), so the board's next step after QE is the Orchestrator's. The notes keep "A8 owed" as it read when they were sealed; they are append-only.

**Trace row** (for the Orchestrator):

| ABC-199 (qe-ABC-199) | QE: A1–A6 met on own runs at d4b2536e (main 8bd75e46 merged into tip 8c0c5c81); census row 2 35 759 → 11 221 (31.4 %), A7 row 1 55 972 → 26 276 (46.9 %); K1 (QE shape: partial + aborted depth), K2, K3, K4 red base and tip; A4 fallback not taken | EPIC-007 | — | N8-LANE (A8 ruled not owed by Security/NFR …3a990437, on main fa201cc5); NFR-008 not read; QE-199-a (ABC-178 not on main; merge-tree clean) / -b / -c / -d / -e INFO | grugops/qe-ABC-199 @ 09da7990 (merge d4b2536e)<br>.grugops/context/qe-ABC-199/notes/ (5), ABC-199 page ## QE | lint/typecheck/build 0; npm test 60/1995 = base, names equal, success true; skips 0, No findings.; coverage 2 forms × 2 runs numFailedTests 0; ENGINE_DEEP 60, UCI_DEEP 5; K1m green/green, K1se green/red (not counted) | UAT waived (0 production lines; waiver form empty; not a signature) | — | In Review → In Security/NFR (QE PASS_WITH_GAPS …be6588e4; A8 already recorded not owed; merges after ABC-178) |
