---
id: 20261010T124426Z-software-engineer-observation-abc054-gates-ledger-controls-cost-144df3f3
kind: observation
by: software-engineer
at: 2026-10-10T12:44:26Z
verified_by:
confidence: high
refs:
  - ABC-054
  - ABC-041
  - ABC-053
  - ADR-0030
  - ADR-0029
  - ADR-0035
  - AR-053-COMPOSER
  - AR-053-ORDER
  - N8-LANE
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
  - .grugops/context/qe-ABC-053/probe/plant.py
  - 20261010T124426Z-software-engineer-decision-abc054-a8-counts-value-bindings-licence-and-composer-prose-2d1f4a22
supersedes:
---

# `ABC-054` readings: gates, the eight spellings, `X3b`, the composer and arming controls, and cost

This note is hand-authored and unsealed. The raw files are in `../probe/`. Every build was planted into
a fresh `git archive` copy outside the worktree (`ledger054.sh` → `plant054.py`). `plant054.py` adds
`X3b` and a `+PRINT` hook that logs `runtimeConsumersOf` from inside `A8`. Every other build is
delegated to QE's `qe-ABC-053/probe/plant.py`, unchanged. Node v26.11.0.

## Gate on `9989f28c` (in the worktree)

| command | result |
|---|---|
| `npm run lint` | exit 0, 98 files, no fixes |
| `npm run typecheck` | exit 0 |
| `npm run build` | exit 0 |
| `npm test` | exit 0, **51 files, 1583 passed**, 6.14 s, load1 2.42 before and 5.60 after |
| skip count (`vitest --reporter=json`, pending + todo) | **0**, measured |
| `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, exit 0 |
| `lane-inventory.js` | "The lane collects 51 test files; git tracks 51. No findings.", exit 0 |

The two touched files: base 23 tests, head 24 tests (+1, the eight-spelling test).

## Per criterion

| # | verdict | reading |
|---|---|---|
| `A1` | MET | The new test asserts all 8. The new instrument counts **4 of 8**: `{ f }`, `{ type X, f }`, default, `* as ns`. **For contrast, the old regex counts 7 of 8.** Only `import type { X }` is excluded by it, so it also counts the all-type brace, the bare import and `export … from`. Red first: the test was written and run before the helper existed and failed with `ReferenceError: bindsAValueFrom is not defined` |
| `A2` | MET | `X3b` on `9989f28c`: **`A8` RED**, "production runtime consumers of render.ts: expected [] to include 'render-seam.ts'"; `render.ts` → `[]`. `A11` is red too (`renderBoard` called 0 times); 2 failed / 22 passed. **Control: `X3b` on base `68dd87ac` leaves `A8` green** (`render.ts` → `["render-seam.ts"]`), and only `A11` is red. That is the defect, reproduced |
| `A3` | MET | The docblock contains `EVALUATION`, `verbatimModuleSyntax`, `import type`, `UNDER-COUNT`, `R4` and `R3`. The regex lines moved from `:332` to `:347` and from `:401` to `:416`. Their content is **byte-identical** (sha1 of both lines, base vs head: `24793f9b…` = `24793f9b…`) |
| `A4` | MET | `+PRINT` on `9989f28c`: `render.ts`, `status-panel.ts` and `history-pane.ts` each give **exactly `["render-seam.ts"]`** |
| `A5` | MET | `git diff --name-only 68dd87ac..9989f28c` = `src/history-pane.nfr.test.ts`, `src/render-seam.test.ts`. The production filter prints nothing. numstat: `+22/−5` and `+62/−17`. Every `+`/`−` line in the nfr file is a `*` or `//` comment line (filter checked: it printed nothing). 0 new files, 0 spawns added |
| `A6` (i) | MET | Fail-closed sentence: `:187-189`, "static value-binding import". In-test comment: `:518-522`, "a static value import" |
| `A6` (ii) | MET | One entry was added as the 4th of five. It names `export … from` and `import("./frame.ts")` and cites `ABC-043` `A1`. The four existing entries are unchanged |
| `A6` (iii) | MET | The tripwire span `const directory` … `.toEqual([COMPOSITION_ROOT]);` is 17 lines, sha1 `c642da35…`, the same at base and head |
| `A6` (iv) | MET | `Q-COMPOSER-REEXPORT` **GREEN**, 24/24. `Q-COMPOSER-DYNAMIC` **GREEN**, 24/24. `SECOND-COMPOSER` **RED** on the tripwire: `['cli-options.ts','render-seam.ts']` vs `['render-seam.ts']` |
| test note 5 | as required | `Q-CTRL-DEAF-AFTER-LOAD+X5b` is **RED** on "the probe is ARMED: expected [] to include 'history.ts'". `Q-CTRL-ARMING-FIRST+DEAF+X5b` is **GREEN**, 24/24, by construction, and is reported, not required. The probe string is untouched. The arming statements moved by +17 lines (`loaded = []` at `:657`/`:661`, `await import(arming)` at `:662`) and their order is unchanged |
| test note 6 | armed, silent | The trigger grep prints nothing (exit 1). `src/cli.ts` holds `render: makeRenderSeam(mode, orientation)` once |

Ledger load1 was 3.47–3.60 (`ledger.tsv`).

## Cost (`ADR-0035`, PROPOSED). Narrow set = the two modified test files; no production file

The harness is `cost.py`. It uses three `git archive` arms: base `68dd87ac`, head `9989f28c`, and a twin
of base (`/usr/bin/diff -r` exit 0). Each run is a fresh `vitest run <set>`. CPU is user + sys of the
child tree. Rounds are rotated, 9 per set with round 0 discarded (n = 8, k = 2), counts are asserted
(23 / 24 / 23), and load1 is logged before every run.

| set | load1 | twin − base median | twin sign + | twin R | head − base median | head interval x(2)..x(7) | state |
|---|---|---|---|---|---|---|---|
| 1 | 2.87–4.16 | −0.035 s (**−2.61 %** of 1.339 s) | 2/8 | 0.066 s | −0.023 s | −0.061..+0.047 s | **INADMISSIBLE** (twin > 1.5 %) |
| 2 | 4.12 / **9.95** / 10.38 | −0.034 s (**−2.44 %** of 1.373 s) | 1/8 | 0.299 s | −0.011 s | −0.033..+0.055 s | **INADMISSIBLE** (twin > 1.5 %) |

- **Neither set is admissible, so no `N8-LANE` verdict is claimed: not MET, and not UNRESOLVED.**
- Stated as the record and not as a verdict: in both sets, the head interval's upper end (+0.047 s and
  +0.055 s) is far below 650 ms.
- The base arm read higher than its identical twin in 13 of 16 rounds (6 + 7). The cause is `UNKNOWN - verify`
  (arm position or a per-root cache are candidates, not tested).
- I stopped at two pre-registered sets rather than run until one came out admissible.
- `N8-LANE`'s added-file scope is empty (0 files added). No `NFR-008` verdict is claimed.
