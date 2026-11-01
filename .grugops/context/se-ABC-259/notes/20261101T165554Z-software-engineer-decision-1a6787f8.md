---
id: 20261101T165554Z-software-engineer-decision-1a6787f8
kind: decision
by: software-engineer
at: 2026-11-01T16:55:54Z
verified_by: 
confidence: high: each choice below was read against the five files at 8f2fc9b5 and against out-of-tree plants run under flock host-test.lock
refs:
  - se-ABC-259
  - ABC-259
  - EPIC-010
  - ADR-0056
  - R-TC
  - G-1
  - grugops/ABC-259
  - 8f2fc9b5
  - 496a8941
  - f40665b1
  - e1c10e19
  - src/levels.test.ts
  - A8
  - ABC-249
  - NFR-008
supersedes: 
seal: sha256:e52454dd39a9c9dd0e4f6d4deee3116650da3b7328b9fbdd101c347de1cdfb42
---

# se-ABC-259 design: one describe block in src/levels.test.ts after A8, three rows (budget, environment, test flag), A8's comment-strip regex

1. **File:** `src/levels.test.ts`, directly after `A8 — the level module's boundary` (the ADR's shape, ticket § Scope 1). `src/engine.test.ts` is avoided because ABC-249 is in flight.
2. **Strip:** A8's regex, used verbatim: `/\/\*[\s\S]*?\*\/|\/\/.*$/gm`. A probe of the five files at 8f2fc9b5 found no string or regex literal holding `//` or `/*`. So the A1/A5 STOP case (stripping going wrong on these files) does not arise.
3. **Files:** a literal list: src/engine.ts, src/search.ts, src/quiescence.ts, src/evaluate.ts, src/transposition.ts, each read with `readFileSync(new URL("../<file>", import.meta.url))`.
4. **Budget rule:** in each file, the trimmed code lines that contain `budgetMs` must equal an allowed list. For src/engine.ts the list is exactly `readonly budgetMs: number;` and `deadline: start + Math.min(options.budgetMs, HARD_CEILING_MS),`. For the other four it is empty. Each allowed line holds `budgetMs` once, so equal lines mean exactly 2 uses in engine.ts and 0 elsewhere. The line pins also catch a read that moves into either line.
5. **Environment rule:** `/process\.|argv|import\.meta\.env/` on stripped code.
6. **Test-flag rule:** `/VITEST|NODE_ENV|[\w$]*_DEEP\b/` on stripped code.
7. **Message (deviation, found by the plants):** `expect(violations).toEqual([])` printed only "expected [ Array(1) ] to deeply equal []", so it did not name the file. Commit e1c10e19 compares the joined violations to `""` instead. The headline now reads e.g. "expected 'src/engine.ts: budget rule — budgetMs…' to be ''".
8. **Header:** the file's lane header "DEFAULT (`npm test`, 46 tests)" was accurate (49 in the head file run = 46 + 3), so it is raised to 49 (A7).
9. **Commit order (deviation, recorded):** the claim commit 496a8941 (queue files only) sits between base 8f2fc9b5 and the code. So `git diff 8f2fc9b5 e1c10e19 --name-only` lists the two queue files plus src/levels.test.ts, and `git diff 496a8941 e1c10e19 --name-only` lists src/levels.test.ts only. No src/, tools/, data/ or config file other than the test changes on the branch.
