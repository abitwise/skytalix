---
id: 20261021T093522Z-security-nfr-observation-3b895278
kind: observation
by: security-nfr
at: 2026-10-21T09:35:22Z
verified_by: 
confidence: high (instrument run read-only; plants in session scratch from git archive dc4d4f15)
refs:
  - ABC-163
  - AR-095-L1UNIT
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - AR-180-VALIDATED
  - AR-095-CWD
  - AR-095-READ
  - F-095-1
  - G-1
  - G-2
  - G-4
  - ADR-0036
  - V5.3.2
  - V5.2.1
  - NFR-008
  - grugops/ABC-163
  - dc4d4f15
  - 87d3897d
  - d8c073e2
  - ccccc6bb
  - 341da4c1
  - grugops/qe-ABC-163
  - 2270c8fa
  - f459353e
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - src/book-file.ts
  - src/book.ts
  - 20261021T093010Z-qe-e2e-observation-7f56f339
  - 20261021T093040Z-qe-e2e-decision-8a60d7c8
  - 20261021T091929Z-architect-design-observation-a76b1b2e
  - 20261021T091930Z-architect-design-decision-c3568326
  - 20261021T091931Z-architect-design-decision-a7d9c818
  - 20261021T091932Z-architect-design-decision-c7df0411
  - 20261021T092600Z-security-nfr-decision-1b032e3f
  - 20261021T093500Z-orchestrator-decision-73eb06c5
supersedes: 
seal: sha256:f14a77db321a6f59bf3a9a420686c2fb60994094456bcde69ad5b2ef5aec195f
---

# Security/NFR readings, `ABC-163` at QE tip `2270c8fa` (SE `dc4d4f15`, base `ccccc6bb`): 0 `src/` lines; G-1 holds for a NO-PARAMETER guard, which § Decision 3's trigger does not cover; G-2's precondition is absent from the tree

No timing was read. Every plant was built in the session scratchpad (`sec163/`, a `git archive` of `dc4d4f15`), outside the
repository. Nothing was written to the main tree or to any worktree. The instrument was run read-only.

## 1. The surface
- `git diff --numstat ccccc6bb 2270c8fa -- src/`: empty. The non-note files in the range are
  `.grugops/context/design-F-072-1/probe/clause-b.mjs`, `ADR-0036` and the `ABC-163` page.
- Nothing on `main` since `ccccc6bb` touches `src/book-file.ts`, the instrument or `ADR-0036` (0 paths).
- The NEW instrument on `ccccc6bb..2270c8fa` itself: 0 production files changed; limbs 1, 2 and 3 do not fire;
  Ruling 2 `holders 1 at <base>, 1 at <head>; holder files with + lines: 0`.
- The instrument's subprocess use is unchanged: `execFileSync("git", args)` with an argument array and no shell.
  Ruling 2 adds no call (QE `A3`: 79 = 79 calls) and no write.
- The ASVS L1 set has no requirement on the diff, because it holds no application code. `V5.3.2` [L1] and
  `V5.2.1` [L1] matter only through the holder (section 2).

## 2. G-1 (deletion-only holder edits), re-planted
Today's holder `src/book-file.ts` at `main` has 17 lines: one `node:fs` import, and one export that takes no
parameter and does a single-line `readFileSync(new URL(…))`. No deletion can widen it. A deleted import or read line
fails typecheck or drops the capability (the safe direction). This agrees with QE `…7f56f339` and Architect D1/D2
(`…a76b1b2e`).

| plant (base → head, deletion only) | NEW L1 | by-hand `--name-only` |
|---|---|---|
| G-1a: a guarded holder with a parameter `readBookFile(path: URL = BOOK)` and `if (path.href !== BOOK.href) throw …`; the guard line is deleted | does not fire (`holders 1 at <base>, 1 at <head>; + lines: 0`) | lists `src/book-file.ts` |
| **G-1b: a NO-PARAMETER guard**, `statSync(BOOK)` then `if (!st.isFile() \|\| st.size > 1_048_576) throw …`, the shape `AR-095-READ`'s fix would add (`V5.2.1` [L1]); the guard line is deleted | **does not fire** | lists `src/book-file.ts` |

- In both, the instrument still lists the holder under `production files changed: 1`. The file is visible in the
  output, but the verdict does not fire.
- **G-1b is not § Decision 3's re-armed trigger.** That trigger needs a caller-supplied value reaching the capability,
  or a fifth holder. G-1b has neither. So the sentence in `…a7d9c818`'s replacement text, "§ S1's re-armed § Decision 3
  trigger re-opens this case", is narrower than the gap. A cap or regular-file guard with no parameter makes the
  gap live without firing that trigger.
- **Every trigger shape routes itself.** A guard, a parameter, a multi-line read or a second limb-1 holder can only
  arrive as `+` lines in a holder, or as a new holder's import. So Ruling 2 or (b1) fires on the ticket that
  introduces it, and that ticket reaches `In Security/NFR`.

## 3. G-2 (uncomment by deletion), re-planted
- **Base:** `src/book.ts` starts `/*` / `import { readFileSync } from "node:fs";` / `*/`.
- **Head:** the two delimiter lines are deleted. NEW L1 does not fire. Ruling 2 shows
  `holders 1 at <base>, 2 at <head>; + lines: 0`; only the STATE line moves.
- **The first step is visible.** The commit that adds the commented import is listed as a word hit on an added line
  (`word hits on added lines, not counted: 1`) and does not fire.
- **The precondition is absent today.** A scan of every production `src/*.ts` found 0 lines of limb code inside a
  `/* … */` block that would compile once the delimiters are removed. Every `process.` or `node:` mention in a
  comment is JSDoc prose (`*`-prefixed lines) or a `//` line.

## 4. Records cross-read
- **`AR-095-CWD` is closed.** It closed on `main` at the `ABC-162` merge `f459353e` (`…06c147db`). The replacement
  text's "the instrument carries `AR-095-CWD`'s interim control" therefore names a closed risk. The live residual
  that lists Ruling 2 and clause (b) limb 1 as compensating controls is `AR-180-VALIDATED` (`…1b032e3f`,
  `…73eb06c5`).
- **G-1 does not weaken `AR-180-VALIDATED`.** A P6g-class cwd read needs added read code, which is `+` lines in the
  holder, so Ruling 2 fires.
