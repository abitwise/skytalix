---
id: 20261010T141133Z-qe-e2e-observation-abc135-gap-register-efa99c8b
kind: observation
by: qe-e2e
at: 2026-10-10T14:11:33Z
verified_by:
confidence: high
refs:
  - ABC-135
  - ADR-0030
  - QE-054-e
  - src/render-seam.test.ts
  - commit:ce6d8746
  - 20261010T141133Z-qe-e2e-observation-abc135-mutants-probes-map-2a045cdb
supersedes:
---

# `ABC-135` gap register: 1 LOW closed by QE, 1 LOW open, 4 INFO. None is a criterion miss

| id | sev | gap | evidence | owner / route |
|---|---|---|---|---|
| QE-135-a | LOW, **CLOSED** at `ce6d8746` | The six delivered rows only see a strip that removes too LITTLE. Three over-strip mutants survived the whole file at `b09d880c`: `M-LINE-TO-EOF`, `M-LINE-WHOLE-LINE` and `M-SWAP-ORDER`. Each leaves today's real-tree map unchanged, so no reading of the map can see them. If one shipped, a later comment would drop a real consumer. On `A8`'s three targets that shows as an unexplained RED on an innocent change | mutants note `…2a045cdb` | QE added a sibling `it` with three `true` rows. All three mutants are RED, and pristine is 14/14 |
| QE-135-b | LOW | The docblock names one naive-strip limit (a `/*` or `//` inside a string literal, P1). It does not name the second: a `/*` inside a **line comment** opens a block that eats code down to the next `*/` (P2). Both under-count. The real tree has 0 of either spelling (hazard scan 0/35, planted control 4/4), so there is no exposure today | `…2a045cdb` P1, P2, hazard scan | Whichever hop next edits `bindsAValueFrom`'s docblock. Prose only. QE did not pin a known-wrong verdict as a row |
| QE-135-c | INFO | The docblock says the strip "is held to the real tree by the base's consumer map". That map was **measured once**, in the PR notes, and the suite does not re-run it (and ticket test note 2 forbids making `A8` an equality). On a later tree only `A8`'s three-target `toContain` and the rows hold the strip | docblock, `A8` | A hop that edits `withoutComments` or `bindsAValueFrom` re-runs a whole-map reading (QE's `raw-qe-a3-map.cjs.txt` is reusable). No action on `ABC-135` |
| QE-135-d | INFO | NEW over-count P15: `from "./m.ts/*x*/"` is rewritten to `"./m.ts"` and counts. That path cannot resolve, so typecheck reds any production module that spells it, and the case is unreachable in a gate-clean tree | P15 | none |
| QE-135-e | INFO, from before this ticket | Two under-counts are unchanged from the base, both from the `^import` column-0 anchor: a second import on the same line (P5), and `/* a */ import { f } …` on one line (P13). They are not among `QE-054-e`'s named spellings. Each fails RED | P5, P13 | BA/PM: add them to `ADR-0030`'s residual list when the instrument is next cut. Not `ABC-135`'s |
| QE-135-f | INFO | `A4` reads `git diff --name-only <base>..<delivered>`. On the code commits (`b09d880c`, and QE's `ce6d8746`) and on `-- src/` it is exactly `src/render-seam.test.ts`. The branch tip also carries the ticket page, `plans/traceability.md` and `.grugops/context/` notes, as every hop in this repository does | `git diff --name-only 5c17d1ed..ce6d8746` | none. The merge-time UAT-waiver probe (`src/` non-test lines) is empty on both commits |

**Not covered (stated, not smoothed).**
- `N8-LANE` was not re-measured by QE. The QE `it` adds 3 string rows and 0 files, and the Engineer's
  reading 2 (admissible twin, R 40 ms) stands for the delivered code.
- Regex-literal hazards were scanned for by AST. The probe did not plant a production regex that
  holds `/*` (for example `/[/*]/`). It is `UNKNOWN - verify`, and it is P1's class.
- No deep lane is triggered: `src/render-seam.test.ts` is not engine code, `src/cli.ts` or an input seam.
