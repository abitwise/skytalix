---
id: 20261010T160355Z-software-engineer-decision-abc138-any-callee-first-arg-and-bound-name-references-8d70af7c
kind: decision
by: software-engineer
at: 2026-10-10T16:03:55Z
verified_by:
confidence: high
refs:
  - ABC-138
  - ABC-133
  - F-133-1
  - QE-133-a
  - QE-133-b
  - QE-133-e
  - AR-133-LOADER
  - AR-133-WRAP
  - AR-058-STRIP
  - Q14
  - C14
  - V1.2.5
  - N8-SPAWN
  - src/cli.test.ts
  - 20261010T154202Z-ba-pm-decision-r5c-cut-abc137-f1331-cut-a-and-b-abc138-c14-split-3b2a76f6
  - 20261010T160355Z-software-engineer-observation-abc138-gates-plants-a1-a6-cost-74a52ca8
supersedes:
---

# `ABC-138` build: (i) drops its callee test, (iii) filters the identifiers the same walk already visits, (ii) is left byte-identical

This note is hand-authored and unsealed. The readings are in `…74a52ca8` and `../probe/`.

1. **(a) is the callee test deleted, not widened.** Count (i)'s call branch was "callee is `import`
   or `require`, and the first argument names the module". It is now "the first argument names the
   module".
   - `import()` and `require()` are still counted once each, because each is one `CallExpression`
     and the branch runs once per call. `P-DYN` still reads one extra entry,
     `[["spawnSync"],[]]`.
   - An argument-call entry is `[]`, as `import()`/`require()` entries were: such a load binds
     nothing the pin can see.
   - `namesChildProcess` is unchanged. It uses `isStringLiteralLike`, so a no-substitution template
     counts, as the page asks.
2. **(b) is a third assertion, (iii), over the same walk.**
   - `visit` collects every `Identifier` it passes, as it already collects every callee.
   - After the walk, it keeps those whose text is in `bound` and that have no `TypeNode` ancestor.
     It labels each one by its parent's syntax kind.
   - The unmutated file reads `["spawnSync (ImportSpecifier)", "spawnSync (CallExpression)"]`.
   - **Filtering after the walk, not during it,** means the count does not depend on the import
     preceding its uses in source order.
   - **Labels are parent kinds, not "in childOf".** A first draft hoisted the `childOf` ancestor test
     into a helper shared by (ii) and (iii). That restructures (ii), which the page puts out of
     scope, so it was reverted before commit. (ii) already pins that the one resolved call is in
     `childOf`; (iii) only has to count. On a red, the parent kind names the shape:
     `ParenthesizedExpression`, `BinaryExpression`, `NonNullExpression`, `AsExpression`,
     `CallExpression` (as an argument) or `VariableDeclaration`.
3. **Member names and object keys spelled like a bound name are counted (loud).** The page's Test note 4
   allows this, and the file holds no such text. Excluding them would add code for a case that
   does not exist. Shadowing (`QE-133-e`) stays loud on (ii) and now also on (iii).
4. **The comment.**
   - It states (i)'s and (iii)'s reach by plant.
   - It drops the variable-alias bound and "resolving it needs data flow" (1 → 0).
   - It names `C14`'s class as the one false red, and says how to avoid it (spell the name through
     a `const`, as bar 1's list does).
   - It names the remaining bound: a non-literal module name.
5. **No numeric literal was added.** "Exactly two" is a two-element `toEqual`, so `A6`'s frame-height
   literal scan over this file is not engaged.
6. **`AR-058-STRIP`'s trigger did not fire.**
   - No added literal holds `//` or `/*`.
   - No `child_process` import form was added.
   - The file's `child_process` text count goes 7 → 8. The new one is (iii)'s assertion message,
     which matches (ii)'s message style; it is not an import or specifier.
