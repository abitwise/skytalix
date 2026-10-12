---
id: 20261012T050010Z-qe-e2e-observation-abc148-comparison-and-gaps-ceabe8d9
kind: observation
by: qe-e2e
role: qe-e2e
task: qe-ABC-148
at: 2026-10-12T05:00:10Z
verified_by:
confidence: high
refs:
  - ABC-148
  - ABC-114
  - QE-114-c
  - QE-148-a
  - QE-148-b
  - QE-148-c
  - QE-148-d
  - 20261012T050010Z-qe-e2e-observation-abc148-readings-cb622f01
  - 20261012T045304Z-software-engineer-observation-abc148-a1-five-forms-3f61c0a2
  - 20261011T091155Z-qe-e2e-observation-abc114-readings-94a87a28
supersedes:
---

# QE `ABC-148`: my readings against the SE's table and against `QE-114-c`, and the gap register

This note is hand-authored and unsealed. I read the SE's note (`…3f61c0a2`) and QE-114's
(`…94a87a28` § A2) only after my readings in `…cb622f01`.

## Agreement

- **All five `tsc` exits agree** across QE-114, the SE and me: 0, 0, 0, 2, 2. So do both TS2322
  messages.
- **All five open / counted / closed calls agree.**
  - The bare-arrow red is the same row with the same value: `[ 'history =', 'history =' ]`, length 2.
  - `for…in` reds 26 rows, and the count row stays green. The SE and I agree on this.
  - `catch (history)` passes 69 / 69, so its only guard is the typecheck. The SE and I agree on this
    too.
- **File totals.** QE-114's 67 has become 69 because the file grew. The SE and I both read 69 at
  base and at tip.

## Disagreements, every one named

1. **The first `for…in` red's message.** The SE wrote that the first red is `ABC-042` `A1`, "expected 70
   to be +0". On my run, `ABC-042` `A1` fails with "npm run chess failed: internal error: a bug ended
   this session …". "expected 70 to be +0" is the third red, an `ABC-042` `A7` row. The count (26) and
   the cause (child exit 70) agree. Only which message the SE attached to which row differs (INFO,
   `QE-148-c`).
2. **The `it(` count method.** The SE's 101 is an unanchored `it(`, which also counts `exit(`,
   `split(` and the like. Anchored, `\bit(` gives 69. Both methods are equal at base and at tip, so
   `A4` holds either way. The number is not the count of `it(` calls the criterion names (INFO,
   `QE-148-c`).
3. **The plant host.** The SE ran the callback forms through `[spare].map(…)` inside a `for…of` over
   the results. I ran them through `Promise.resolve(spare).then(…)`. The readings are the same. Two
   different hosts giving the same reading strengthens it.
4. **Against `QE-114-c`: no disagreement on the five forms.** Both QE-114 and the SE, though, frame the
   five as the whole `[:=]`-free class. My hunt says it is not (`QE-148-a`).

## Gap register

| id | severity | where | what | owner |
|---|---|---|---|---|
| `QE-148-a` | MEDIUM | `src/cli.test.ts` `ABC-043` `A1` comment, "The open remainder (…) is the two …"; criterion `ABC-148` `A2` wording | **Six more `[:=]`-free binders are `tsc`-clean and 69 / 69 green:** `const [history] = [spare]`, the same with a tuple annotation, `const { spare: history } = { spare }`, `function (history)` as a callback, `({ spare: history }) =>`, and `for (const { spare: history } of …)`. The paragraph calls its two forms "the open remainder", which reads as the complete open set, and it does not name destructuring or `function`-expression binders. **This errs in the UNSAFE direction**, the opposite of the `P3` error `ABC-148` fixed: the comment now understates the hole. A hop that closes "the two" (the `ABC-114` § Out of scope ticket) would leave six open. `A2` is **MET as written**: it binds the list to `A1`'s five forms, and the comment matches them exactly. So this is a criterion-scope gap, the same shape as `QE-114-c`. The page note is scoped "of those four forms" and stays true. Its first sentence's mechanism ("a binder with neither `:` nor `=` after the name") is correct and already covers `H1`–`H6` | BA/PM (criterion scope). Orchestrator decides between a pre-merge one-sentence repair on this branch (fold rule) and a follow-up |
| `QE-148-b` | LOW | the same paragraph, "five `[:=]`-free forms re-planted" | The bare `history =>` is one of the "five `[:=]`-free forms", but the same paragraph says its `=` matches and the row counts it. The label is self-contradictory. It was inherited from the ticket's table, which lists five forms under a four-form heading | BA/PM / SE (fold into `QE-148-a`'s repair if one is made) |
| `QE-148-c` | INFO | SE note `…3f61c0a2`; the ticket's § Delivery `A4` | Disagreements 1 and 2 above: a failure message attached to the wrong `for…in` row, and `it(` counted unanchored (101, against 69 anchored). Neither changes a verdict | SE (no action required) |
| `QE-148-d` | INFO | `tools/grugops/host-protection.js` | Exit 2: `UNKNOWN - verify`, no git remote. This is standing for this repo and never read as a pass | none |

**Unverified / out of reach:** Whether a seventh family exists (for example, a binder introduced by a
`with` statement, which is illegal in ESM, or by a class field) was not tried. `UNKNOWN - verify`
whether the family list above is complete.
