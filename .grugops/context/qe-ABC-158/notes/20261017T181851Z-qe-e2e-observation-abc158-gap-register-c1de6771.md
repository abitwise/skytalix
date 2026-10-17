---
id: 20261017T181851Z-qe-e2e-observation-abc158-gap-register-c1de6771
kind: observation
by: qe-e2e
at: 2026-10-17T18:18:51Z
verified_by:
confidence: high
refs:
  - ABC-158
  - AR-1
  - ADR-0036
  - ABC-041
  - QE-158-a
  - QE-158-b
  - QE-158-c
  - QE-158-d
  - QE-158-e
  - QE-158-f
  - 20261017T181851Z-qe-e2e-observation-abc158-plants-c6b1b211
supersedes:
---

# QE `ABC-158`: gap register. Four LOW, two INFO. None fails a criterion

Hand-authored and unsealed. The plant evidence is in `…plants-c6b1b211`.

| id | sev | owner | gap | evidence | other route today |
|---|---|---|---|---|---|
| `QE-158-a` | LOW | RM | **Check 5's file set is not exactly ADR-0036's production set, though the note says it is.** `! -name '*.test.*'` drops any name that has `.test.` anywhere in it. ADR-0036's `isProduction` (`clause-b.mjs:68`) drops only `\.test\.[mc]?[jt]s$`. Also, `find -type f` skips symlinks. Today both sets are the same 40 files. | N1 (`src/qe.test.util.ts`) loads `nanoid`, and every check reads as recorded | ADR-0036 limb 1 fires on N1 |
| `QE-158-b` | LOW | RM, and Architect/Design for ADR-0036 | **A symlink in `src/` to a file outside `src/` is seen by no check and by no instrumented route.** This weakens the ticket's own `P3` reason, "every blind form is caught today by another route". | N2 loads `nanoid`. Checks 1–7 read as recorded. ADR-0036 limbs 1–3 do not fire. Neither manifest is touched | **none found** (only human diff review). Editing ADR-0036 is outside this ticket's scope |
| `QE-158-c` | LOW | RM | **The checks are lexical and line-based.** A multi-line import, a `*`-led continuation line (5b's comment filter), a typed computed member name, and a runtime import of a `.d.ts` file all load a package with every check unchanged. | N3, N10, N8b, N9 | ADR-0036 (b) fires on all four (N3 limb 1, N8b limb 2, N9 and N10 disputed/fail-safe) |
| `QE-158-d` | LOW | RM | **Runtime-path legs outside `scripts.chess` are unpinned.** A `prechess` script runs inside `npm run chess`. A dev dependency that ships a `node` bin shadows the interpreter, because npm puts `node_modules/.bin` first on `PATH`, and check 7 counts only non-dev entries. A `.npmrc` `node-options` line (the RM's named residual) changes no check. | N5, N7 (install simulated), N6 | N5 and N7: `ABC-041` (a). N6: **none instrumented** |
| `QE-158-e` | INFO | RM | **The page says clause (1) is "word-for-word unchanged", but it is not.** "the `A2` table" became "the advisory table above", and the closing sentence ("That is how the set drifted twice between 2026-07-22 and 2026-10-11 with no lockfile commit.") was dropped. The operative test is the same, so `A4` ("Clause (1) is unchanged") is MET in substance. | word diff of clause (1), `…718112dd` against `…901f43b6` | n/a |
| `QE-158-f` | INFO | RM | **Clause (2)'s examples for check 4 name only "writing a file".** A tsc failure (N8, exit 2, nothing emitted) changes check 4's recorded output (`exit 0`), so "any of checks 1–7 reads differently" fires. The examples do not say so, and the "required" column ("emits nothing") still reads as satisfied. | N8 | n/a |

**What closes them (a suggestion, not a ruling):** `QE-158-a` takes a suffix-anchored exclusion, plus `-type l` or
`find -L`. `QE-158-b` needs the same in ADR-0036's instrument (a separate ticket). `QE-158-c` needs an AST reading,
for which ADR-0036's instrument already exists, and could cite it. `QE-158-d` needs check 6 to read every `pre`/`post`
`chess` script and any `.npmrc` `node-options`/`script-shell`, and check 7 or a new check to read `.bin/node`. Ranking
them is BA/PM's.
