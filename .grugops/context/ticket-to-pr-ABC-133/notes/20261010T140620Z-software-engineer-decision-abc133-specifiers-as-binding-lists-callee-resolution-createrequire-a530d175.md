---
id: 20261010T140620Z-software-engineer-decision-abc133-specifiers-as-binding-lists-callee-resolution-createrequire-a530d175
kind: decision
by: software-engineer
at: 2026-10-10T14:06:20Z
verified_by:
confidence: high
refs:
  - ABC-133
  - ABC-058
  - ABC-042
  - F-058-1
  - QE-058-a
  - QE-058-e
  - AR-058-STRIP
  - V1.2.5
  - N8-SPAWN
  - ADR-0035
  - src/cli.test.ts
  - 20261010T140620Z-software-engineer-observation-abc133-gates-plants-a1-a5-cost-ccb75b95
supersedes:
---

# `ABC-133` build decisions: each specifier position is recorded as the list of names it binds, a callee resolves by name or member, the `childOf` placement is asserted, and `typescript` is loaded with `createRequire`

Hand-authored and unsealed: no `finding` is admissible on this install (`AGENTS.md`). The page is
the contract; these are the choices it left open.

1. **Count (i) is one list per specifier position, holding what it binds.**
   - A static import yields `default x`, `* as x`, `name` or `name as local`. An `export … from`,
     an `import()` or a `require()` yields `[]`.
   - The assertion is `toEqual([["spawnSync"]])`. It checks the count and the binding in one value,
     and a failure prints the extra position.
   - The list is built from the parser's nodes only:
     - `ImportDeclaration` / `ExportDeclaration` with a `child_process` `moduleSpecifier`;
     - a `CallExpression` whose callee is the `import` keyword or the identifier `require`, with a
       `child_process` first argument.
   - The `:1706` literal is a string in an array, so it is not a specifier. The count reads 1 on the
     unmutated file.
   - The match is `/^(node:)?child_process$/`, the same as BA/PM's reference walk.
2. **Count (ii) resolves the callee to a binding, never to a member name.**
   - A callee counts when it is an identifier bound by any `child_process` import, or a property or
     element access on one.
   - So `RegExp.prototype.exec` at `:505` is not counted (test note 3). `cp.execSync`,
     `cp["execSync"]` and `spawnSync.call` are counted.
   - Bindings are collected from every such import, not just the first. A second import's names
     therefore still resolve under (ii): `P1` reds on both counts (observation `…ccb75b95`).
   - Element access and the `.call` form cost no added branch. That is why they are in; no plant
     asked for them.
3. **"The call in `childOf`" is asserted, not assumed.**
   - Each resolved call is shown as its callee text. It gets ` in childOf` when
     `ts.findAncestor` finds the `childOf` variable declaration above it.
   - The expectation is `["spawnSync in childOf"]`. A stray call prints as a bare `spawnSync` or
     `cp.execSync`.
4. **The bound kept is stated as a class.** The comment does not name only the one plant.
   - It reads: a callee that is neither a bound name nor a member of one. A variable alias (`Q14`)
     is the named instance.
   - That class also covers a parenthesised or comma callee, such as `(0, cp.execSync)()`. Nothing
     is claimed beyond what the walk sees.
   - Shadowing is not modelled. A local that reuses a bound name would be over-counted. That fails
     loud, never silent.
5. **`typescript` is loaded with `createRequire(import.meta.url)`, inside the pin's `it`.** The
   types come from `import type * as Ts`.
   - The first build used `import ts from "typescript"` at module scope. Inside vitest the ESM
     import measured about **205 ms** CPU for the load alone (5 runs, `probe/a4-in-vitest.out.txt`).
     `createRequire` measured about **85 ms** (`probe/a4-in-vitest-require.out.txt`).
   - With the ESM import, the in-file total was about 280 ms, which is over `A4`'s 250 ms. On the
     narrow set it read head − base **+0.358 s** (interval +0.281..+0.482).
   - The cause is not established; only the difference was measured. The comment says only that.
   - Loading inside the `it` keeps the load and the parse to once per run of the file, and only on
     that row.
   - The two build commits were squashed into one code commit, `cd594b5f`. Every reading in the
     observation was re-taken on it.
6. **Nothing else moved.**
   - `executableCodeOf` and its other callers are unchanged, and so are the three other strip
     helpers. `N8_SPAWN` stays `17 + 7 + 1 + 2`.
   - The first four lines of the pin's comment are kept verbatim. Only the sentences about the old
     regex count were replaced.
   - No numeric literal was added. `ADR-0009` clause 9a's self-scan bars frame heights from this
     file's code.
7. **Not this ticket's, recorded:** `QE-058-e` (INFO) is closed as a side effect.
   - `Q8`, a template literal's text naming `spawnSync(`, red a correct file at base. It is GREEN
     at delivery, because template text is not a call in the parser's view.
   - This is the page's "prose cannot red a correct file" widened from comments to strings. It is
     not a traded kill: `Q9`, a real call inside an interpolation, stays RED.
