---
id: 20261012T051338Z-qe-e2e-observation-abc148-recheck-paragraph-and-gaps-18ca4c99
kind: observation
by: qe-e2e
role: qe-e2e
task: qe2-ABC-148
at: 2026-10-12T05:13:38Z
verified_by:
confidence: high
refs:
  - ABC-148
  - ABC-113
  - QE-148-a
  - QE-148-b
  - QE-148-c
  - QE-148-d
  - QE2-148-a
  - 20261012T051338Z-qe-e2e-observation-abc148-recheck-readings-e7dc8867
  - 20261012T050640Z-software-engineer-observation-abc148-six-forms-ade9973f
  - 20261012T050010Z-qe-e2e-observation-abc148-readings-cb622f01
supersedes:
---

# QE re-check `ABC-148`: the repaired paragraph read against all eleven forms, against the SE's table, and the gap register

This note is hand-authored and unsealed. I read the SE's `…ade9973f` only after my readings
(`…e7dc8867`).

## Against the SE's table: no disagreement

- **Shared forms.** I re-planted four of the SE's rows: `H2` `const [history]`, `H4`
  `function (history)`, `H6` `for…of` object destructure, and the bare-arrow control. Each matches on
  `tsc` exit, on file result, and on the control's failing row and value.
- **A different scaffold.** My `spare` sits in the outer scope and the SE's inside the IIFE, yet the
  readings are the same.
- **Forms I did not plant.** `H1` (tuple-annotated), `H3` (`const { spare: history }`), `H5`
  (`({ spare: history }) =>`) and `D4` (`for (const history of [spare])`). For these the paragraph
  rests on two earlier independent readings that agree: the SE's and QE's `…cb622f01`. My
  re-plant of `(history) =>`, `for…in` and `catch` also agrees with both.

## The paragraph (`src/cli.test.ts`, `ABC-043` `A1`, "WHAT THIS COUNT CANNOT SEE") against the eleven

| claim in the paragraph | reading | verdict |
|---|---|---|
| the regex `/\bhistory\s*[:=]/g` sees `history` only where `:` or `=` directly follows it, whitespace allowed | true of the regex. Plants C and 9 (counted) and plants 1–4, 7, 8 and 10 (unseen) agree | correct |
| eleven forms re-planted: `A1`'s five, then six more in the repair | 5 + 6 = 11 | correct |
| eight are `tsc`-clean and green on every row, so OPEN: `for…of`, `for…of` object destructure, `(history) =>`, `function (history)`, `({ spare: history }) =>`, `const [history] = …`, its tuple twin, `const { spare: history } = …` | four by me, all eight by the SE and by QE `…cb622f01`: each is `tsc` 0 and 69 / 69 | correct |
| bare `history =>` IS counted; this row reds it with 2 binders | plant C: 1 red, the count row, length 2 | correct |
| `for…in` and `catch (history)` are closed by the typecheck: `tsc` exit 2, a `string` key and an `unknown` catch binding are not a `GameHistory` | plants 5 and 6: exit 2, TS2322 `string` and TS2322 `unknown` | correct |
| "That list is what was measured, NOT an exhaustive one: any binder that does not put `:` or `=` straight after `history` is unseen by this count, measured or not" | claims no completeness | correct. It also covers plants 7, 8 and 10 (below) |

- **`QE-148-a` is closed.** "The open remainder … is the two" is gone. The paragraph names the eight
  measured open forms and disclaims completeness.
- **`QE-148-b` is closed.** "five `[:=]`-free forms" is gone. `grep` finds no `[:=]`-free label
  anywhere in `src/cli.test.ts`. The bare arrow appears only as counted.
- **The `ABC-113` page correction** gives the same eight, by the same families, says "not an exhaustive
  one", and is dated 2026-10-12.

## The seventh-family hunt

- **Two more families are open.** Both are `tsc` 0 and 69 / 69, and neither is among the paragraph's
  three families:
  - **(i) Declare, then assign through a non-`=` target.** `let history;` followed by
    `for (history of [spare])` (plant 7), or by `[history] = [spare]` (plant 8). The binder
    `let history;` has `;` after the name. Its twin, `history = spare`, is counted (plant 9).
  - **(ii) An object-method-shorthand parameter, contextually typed through `satisfies`** (plant 10).
    The paragraph's "callback parameters" names arrows and `function` expressions, not method
    shorthand.
- **They are covered.** Both are binders that do not put `:` or `=` straight after `history`. The
  paragraph's "NOT an exhaustive one … unseen by this count, measured or not" names them by
  mechanism. **INFO, not a gap** (`QE2-148-a`).
- **A class parameter property is not open** (plant 11). The count reds it (`history:`), and Node's
  strip-only type stripping refuses to load the file.

## Gap register

| id | severity | where | what | owner |
|---|---|---|---|---|
| `QE2-148-a` | INFO | `src/cli.test.ts` paragraph; any future "close `D4`" ticket (`ABC-114` § Out of scope) | Two more open families were measured (declare-then-assign through a `for…of` target or a destructuring assignment; an object-method-shorthand parameter typed through `satisfies`). The paragraph's not-exhaustive sentence covers them by mechanism, so no wording change is owed. A ticket that closes the open set must work from the mechanism, not from the eight-item list: eleven measured forms are open (the eight, plus plants 7, 8 and 10). | BA/PM, when that ticket is cut. No action on this branch |
| `QE-148-c` | INFO (carried) | the ticket's § Delivery `A4`, "`it(` occurs 101 times" | Unchanged by the repair. The repair notes use the anchored 69. No verdict changes | none |
| `QE-148-d` | INFO (standing) | `tools/grugops/host-protection.js` | Exit 2, `UNKNOWN - verify`, no remote | none |

**Unverified:**
- I did not plant `H1`, `H3`, `H5` or `D4` (see above).
- The `using` and parameter-default forms are inferred to be counted from the regex, not measured.
- `UNKNOWN - verify` whether any family beyond the five now measured is open. The paragraph does not
  claim otherwise.
