---
id: 20261010T144155Z-architect-design-observation-clause-b-instrument-readings-fixtures-mutants-self-run-23cfa14f
kind: observation
by: architect-design
at: 2026-10-10T14:41:55Z
verified_by:
confidence: high
refs:
  - ABC-072
  - ABC-073
  - ABC-055
  - ABC-042
  - ABC-082
  - ABC-059
  - ABC-065
  - ADR-0036
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
  - .grugops/context/design-ABC-072/probe/clause-b.mjs
  - .grugops/context/design-ABC-072/probe/RUN.txt
  - .grugops/context/design-ABC-072/probe/mutants.sh
  - .grugops/context/design-ABC-072/probe/mutants.out.txt
  - .grugops/context/bapm-followups-2026-10-10/probe/abc073-set.sh
  - .grugops/context/rescore-batch-2-2026-10-10/probe/clause-b-limbs.mjs
supersedes:
---

# Clause (b) instrument readings: the three fixtures give their known answers, the baseline is 0 / 3 / 0, nine mutants behave as designed, and the hop's own commit does not fire

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Where:** worktree `.claude/worktrees/design-ABC-072`, branch `grugops/ABC-072-clause-b-delta`,
  from wave tip `6bfc7b29`. Node v26.11.0, TypeScript 5.9.3.
- **Commands and full output:** `probe/RUN.txt`. The mutant ledger is in `probe/mutants.out.txt`.

## O1. Premises re-verified at `6bfc7b29`, before any edit

- `ABC-041` clause (b) is unchanged (`:223`).
- The STATE baseline holds at **0 / 3 / 0**, over **36** production files. `src/levels.ts` was
  added and holds no limb. BA/PM's `clause-b-limbs.mjs` and this hop's AST instrument agree.
- **`ABC-073`'s live set is `ABC-055` alone.** It is in `Ready`, not `Done`, and carries the interim
  "unruled" text with the fail-safe (`abc073-set.sh`).
- Not stale, so the hop went ahead.

## O2. The three `A3` fixtures

| fixture | limb 1 | limb 2 | limb 3 | (b) | the page's known answer |
|---|---|---|---|---|---|
| `dbaf972f^..dbaf972f` (`ABC-042`) | 0 | (b1) 4: `cli.ts:73`, `:76`, `:81`, `:90`; (b2) `cli.ts -> glyph-mode.ts` (holds it) | 0 | **FIRES** | FIRES ✅ |
| `34c9c026^..34c9c026` (`ABC-082`) | 0 | 0; **4** new edges, none to a holder | 0 | does not fire | does not fire ✅ |
| `4c33b72b^1..4c33b72b` (`ABC-059`) | 0 production files | 0 | 0 | does not fire | does not fire ✅ |

- **`ABC-082` has 4 new edges, not BA/PM's 3.** The fourth is a multi-line
  `import { … } from "./position.ts"`. That is the limit BA/PM named for the rough grep. The answer
  does not move.
- **Word hits listed, not counted, on `ABC-042`:** 5 `process.` words in `cli.ts` comments, and
  `cli-options.ts:8` "spawn" in a comment.

## O3. Baselines (STATE, recorded, not a trigger)

- At `6bfc7b29` (36 files): limb 1 is 0 files. Limb 2 is 3 files in code (`cli.ts`,
  `glyph-mode.ts`, `perft-bench.ts`) and 9 by raw word hit. Limb 3 is 0 files in code and 6 by raw
  word hit. The 3 `RegExp.prototype.exec` calls (`coordinate-move.ts:91`, `san.ts:233`, `:249`) are
  not counted.
- At `f76e041` (35 files): 0 / 3 / 0, with the same files, as `A3` names them.
- **Runtime reach at `6bfc7b29`:** only the three holders reach a holder. The one runtime edge into
  a holder is `cli.ts -> glyph-mode.ts`. `cli-options.ts` reaches `glyph-mode.ts` by `import type`
  only.

## O4. Mutant ledger, out of tree (`git clone --shared` in the private scratchpad)

**9 of 9 as designed:**
- `M1` (`node:fs` import) fires limb 1 (b1).
- `M2` (`cp.execSync`, new file) fires limbs 1 and 3 (b1).
- `M3` (words only: `/a/.exec`, a comment, a string) fires nothing. It lists 2 + 2 word hits.
- `M4` (a value edge to `glyph-mode.ts`) fires limb 2 (b2).
- `M5` (`import type` of a holder) fires nothing.
- `M6` (inline `import { type X }` of a holder) fires limb 2 (b2).
- `M7` (a new edge to a bridge that reaches a holder) fires limb 2 (b2).
- `M8` (a holder's `process.` line edited in place) fires limb 2 (b1).
- `M9` (a comment line shifting a holder) fires nothing.
- **`M6` matches Node's runtime.** Under Node v26.11.0 type stripping, `import { type A } from
  "./x.ts"` evaluates `x.ts` and `import type` does not. Both were run in the scratchpad.

## O5. `A5` and the hop's own commit

- **`ABC-065`'s merge `460b9f58^1..460b9f58`:** 0 production files, 0 / 0 / 0, does not fire.
- **The delivered commit `088e48db~1..088e48db`:** 0 production files, 0 / 0 / 0, does not fire.
- **The fenced pages are byte-identical by blob SHA:** `ABC-041` (`2fa4aec2…`), `ABC-042`
  (`43954c4f…`), `ABC-065` (`7432212c…`) and `ABC-066` (`6089e6c8…`).

## O6. Gates at `088e48db`

- `npm run lint`: exit 0.
- `npm test`: exit 0, 52 files, 1608 passed, 6.95 s.
- Skip count: **0**. `test-skip-integrity.js` reads `No findings.`
