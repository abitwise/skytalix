---
id: 20261010T130030Z-qe-e2e-observation-abc054-gap-register-ee331683
kind: observation
by: qe-e2e
at: 2026-10-10T13:00:30Z
verified_by:
confidence: high
refs:
  - ABC-054
  - ABC-041
  - ABC-043
  - ABC-057
  - ADR-0030
  - ADR-0029
  - AR-053-COMPOSER
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
  - 20261010T130030Z-qe-e2e-observation-abc054-spellings-ledger-mutants-cost-4ef68dd1
  - 20261010T130030Z-qe-e2e-decision-abc054-verdict-pass-with-gaps-35137d2d
supersedes:
---

# `ABC-054` gap register: three LOW (two reach gaps, one pinning gap), four INFO

This note is hand-authored and unsealed. **No gap fails a criterion.** Each one is measured, and the
build that shows it is in `…4ef68dd1` and `../probe/`. "Gate-clean" means `tsc --noEmit` exit 0 and
`biome check` exit 0 in the copy, which is the mandatory lint gate as it runs (check only, no write).

| id | severity | gap | evidence | suggested owner |
|---|---|---|---|---|
| **QE-054-a** | LOW | **`A8`'s instrument reads comments as specifiers, so it over-counts.** `ADR-0030` decision 2 says the instrument "reads the specifier list". A **comment inside an all-`type` brace** (`{ /* … */ type X }`, `type X, // …`, or a commented-out `// renderBoard,` line) makes a specifier that does not start with `type`, so it counts a consumer. So does an `import … from "./render.ts";` line at **column 0 inside a block comment**. On `X3b`, each of these leaves **`A8` GREEN** with `render.ts` → `["render-seam.ts"]`. Only `A11` reds them, and `A11` reaches the seam's three modules only. The old regex had the same blind spot (5 of 6 probes), so this is not a regression. **It is not one of `ADR-0030`'s residuals:** `C1` is a binding never called and `C2` is re-export chains | Gate-clean: `QX3b-O1`, `-O2`, `-O6` (each with a `useImportType` **warning**), `-O4`, and `-O4b` (with `import type`, **no diagnostic at all**). `biome check --write` rewrites `O1`/`O2`/`O6` to `import type` and the kill returns. It does not touch `O4`. `O3` (`import type{`) is stopped by the formatter | Architect/Design: either name it as residual `C3` beside `C1` (same trigger: the first target outside `A11`'s reach), or rule it a fix. The fix is a test-only change: strip `/*…*/` and `//…` from the source before matching. It needs a ticket, not this hop |
| **QE-054-b** | LOW | **The narrowed composer claim is still wider than the tripwire.** After `A6` the docblock says the tripwire fails closed on "a second composer that binds `assembleFrame` BY A STATIC VALUE IMPORT, and on no wider set". Two static value-binding spellings are **not counted**: (1) a comment before the name, `import { /* composer */ assembleFrame } from "./frame.ts";`. The tripwire's `/^assembleFrame\b/` sees `/* composer */ assembleFrame`. (2) a **default binding** (`import assembleFrame from`, `import F, { … } from`, `{ default as assembleFrame }`). The Engineer noticed (2). The new "WHAT NEITHER PHASE COVERS" entry names neither. `bindsAValueFrom` counts all four. `A6` is met as written: (i) has the word, and (iii) is byte-identical by requirement | `QF-COMMENT`: tripwire **GREEN** 24/24, gate-clean, **no diagnostics**, survives autofix. `QF-DEFAULT`: green but `tsc` **2** (`TS2613`: `frame.ts` has no default export), so it is gated today. `QF-DEFAULT+EXPORT` (a production change gives `frame.ts` a default export): green, gate-clean | BA/PM: one clause in the same docblock, in `ABC-057`'s pass on this file, which already has to re-anchor here. Re-pointing the tripwire at `bindsAValueFrom` would close both, but that is out of scope by name (`ADR-0029` names the site, Architect/Design's). Neither spelling is ahead of re-export and dynamic in likelihood |
| **QE-054-c** | LOW | **Two properties the instrument has are pinned by no test.** (1) **Across lines** (test note 3: "it must read a statement across lines"). None of the eight spellings and none of the three `A8` targets' importers spans a line. (2) **Every statement in a file, not only the first.** Both hold today: `E2`–`E5` and `E14`–`E17` agree with the oracle. A refactor that loses either one goes unnoticed until a legitimate multi-line or split import of a target reds `A8`. That is a false RED, never a false green | `M-SINGLE-LINE` and `M-FIRST-STATEMENT-ONLY`: both **survive** (24/24) | SE fix-forward (optional, XS, test-only): two rows in the eight-spelling test, a multi-line mixed brace and a source with `import type { … }` followed by `import { f }`. Or accept, because the direction is fail-red |
| QE-054-d | INFO | **`ADR-0030` `C1` is now measured, not reasoned.** `void renderBoard;` beside a called copy is **gate-clean with no diagnostics** and leaves `A8` GREEN. `A11` reds it. The ADR row says "reasoned, not measured: `UNKNOWN - verify`" | `QC1-VOID` | Architect/Design may cite it in the `C1` row. No action |
| QE-054-e | INFO | Under-counts (all fail red): `import { type as t }` (a value named `type`; TypeScript keeps it) and a string-named specifier `{ "g" as h }`. These are not normalised by the formatter. Single quotes, no semicolon, `import{`, and two statements on one line are formatter-normalised (QE-053 measured single quotes; the others are reasoned). Import attributes do not apply to `.ts` targets | `spelling-table.md` rows `E24`, `U1`–`U6` | none |
| QE-054-f | INFO | `M-TYPE-NO-WS` survives. It is equivalent on every asserted input and differs only for a value specifier spelled `typeX`, which is an under-count. `M-A8-SELF` is equivalent: no production module imports itself | `ledger-D.tsv` | none |
| QE-054-g | INFO | `N8-LANE` now has an admissible reading: narrow set, twin −1.13 %, R = 0.038 s, head +0.017 s, **MET** under `ADR-0035` as proposed. The base arm reading above its identical twin recurs (5/8 here, 13/16 at the SE hop). The cause is `UNKNOWN - verify` | `cost-Q1.tsv` | whoever next owns the `ADR-0035` harness |

**Not a gap, recorded so nobody re-derives it:**
- **`A8` is `toContain`, so `A8` alone cannot see an over-count.** `M-NO-CLAUSE-TYPE` puts 4 modules on
  `render.ts` and `A8` stays green. The eight-spelling test is what kills it. That was the Engineer's
  stated choice (an equality would red a later legitimate consumer), and it holds as a measurement:
  `A4` reads exactly `["render-seam.ts"]` ×3.
- **The header-docblock correction in `src/render-seam.test.ts`**, flagged by the Engineer as beyond the
  literal scope, is **true as written**. `X3b` reds `A8` (measured), and "a copy shipped BESIDE a
  consumed `renderBoard` is still green" is `QC1-VOID`'s reading for `A8`.
- **Biome's autofix is not the gate.** `quality.lint.autofix: true` is a dial. `npm run lint` is
  `biome check .` with no `--write`, so QE-054-a is read on the check, and the autofix rows are
  reported as the softer bound.
