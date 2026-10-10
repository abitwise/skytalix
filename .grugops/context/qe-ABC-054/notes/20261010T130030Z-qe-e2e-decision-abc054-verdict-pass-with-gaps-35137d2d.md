---
id: 20261010T130030Z-qe-e2e-decision-abc054-verdict-pass-with-gaps-35137d2d
kind: decision
by: qe-e2e
at: 2026-10-10T13:00:30Z
verified_by:
confidence: high
refs:
  - ABC-054
  - ABC-041
  - ABC-043
  - ABC-053
  - ABC-057
  - ADR-0030
  - ADR-0029
  - ADR-0035
  - AR-053-COMPOSER
  - AR-053-ORDER
  - N8-LANE
  - src/render-seam.test.ts
  - src/history-pane.nfr.test.ts
  - 20261010T130030Z-qe-e2e-observation-abc054-spellings-ledger-mutants-cost-4ef68dd1
  - 20261010T130030Z-qe-e2e-observation-abc054-gap-register-ee331683
  - 20261010T124426Z-software-engineer-decision-abc054-a8-counts-value-bindings-licence-and-composer-prose-2d1f4a22
  - 20261010T124426Z-software-engineer-observation-abc054-gates-ledger-controls-cost-144df3f3
supersedes:
---

# `ABC-054` QE verdict: **PASS_WITH_GAPS** at `b85f1d82`. `A1`–`A6` MET; test notes 5 and 6 as required; three LOW gaps and four INFO items, none blocks

This note is hand-authored and unsealed. It is a `decision`, not a `finding`: no `§14-gate` verdict
exists on this install (`AGENTS.md`).
- Under review: `68dd87ac..b85f1d82` on `grugops/ABC-054-consumers`. The code commit is `9989f28c`.
- QE ran the gates in the Engineer's worktree.
- Every build ran on QE's own harness (`../probe/plantqe.py`, `../probe/ledger.sh`) with QE's own
  spellings. Each was planted into a fresh `git archive` copy in QE's scratchpad. No byte of the
  worktree was planted.
- The instruments were judged against the ticket and `ADR-0030`, and against an oracle that is
  independent of both: TypeScript's own `transpileModule` under `verbatimModuleSyntax`
  (`../probe/spell.cjs`). The Engineer's readings were not used.

| | QE's reading | result |
|---|---|---|
| `A1` | QE wrote its own copies of the eight spellings. `bindsAValueFrom` was **extracted by text from `b85f1d82`**, so no copy can drift. It counts **4 of 8**: value, mixed, default, namespace. The base regex counts 7 of 8. **All 8 agree with the oracle.** The in-file test asserts all 8. Every mutant that flips a row is killed by it (7 of 7) | **MET** |
| `A2` | `QX3b` (QE's own spelling: `board-copy.ts`, seam keeps `{ type GlyphMode, type Orientation }`) on head: **`A8` RED**, `render.ts` → `[]`, with `A11` red too. On base `68dd87ac` the same build leaves `A8` **green** (A11 only), so the defect is reproduced. Four more X3b spellings are also A8 RED: `import type`, multi-line all-type, bare + all-type, and all of these after `biome check --write` | **MET** |
| `A3` | The added docblock paragraph contains `EVALUATION`, `verbatimModuleSyntax`, `import type` (with "NEVER the licence"), `UNDER-COUNT`, `R4` and `R3`. Regex line base `:332` = head `:347` and base `:401` = head `:416`: sha1 equal per line | **MET** |
| `A4` | Read outside the test (`../probe/consumers.cjs` runs the tree's own extracted instrument over `src/`): `render.ts`, `status-panel.ts` and `history-pane.ts` → **exactly `["render-seam.ts"]`** each | **MET** |
| `A5` | `git diff --name-status 68dd87ac..b85f1d82 -- src/` = `M src/history-pane.nfr.test.ts`, `M src/render-seam.test.ts`. 0 production paths, 0 added files. numstat `+22/−5`, `+62/−17`. In the nfr file **every** changed line is a comment line, and its non-comment lines are identical to base. The four hunks (`:187`, `:197`, `:231`, `:518`) sit outside the probe's child string. Spawn/exec/fetch/eval token counts are unchanged (4 → 4, 0 → 0) | **MET** |
| `A6` | (i) `static` appears in the fail-closed sentence (`:188`) and in the in-test comment (`:519`). (ii) The list goes from 4 to 5 entries. The added 4th entry names `export … from`, `import("./frame.ts")`, `ABC-043` `A1`. The four existing entries are byte-unchanged (diff = pure insertion). (iii) The tripwire span `const directory` … `.toEqual([COMPOSITION_ROOT]);` is base `:509-525` and head `:526-542`, 17 lines, sha1 `c642da35cd73` both. (iv) `Q-COMPOSER-REEXPORT` GREEN, `Q-COMPOSER-DYNAMIC` GREEN, `SECOND-COMPOSER` RED on the tripwire | **MET** (gap QE-054-b on the claim's reach) |
| test note 5 | `Q-CTRL-DEAF-AFTER-LOAD+X5b` is **RED** on `the probe is ARMED: expected [] to include 'history.ts'`. `Q-CTRL-ARMING-FIRST+DEAF+X5b` is **GREEN** (by construction; reported, not required). The probe's child string is **byte-identical** to base (26 lines). The arming order is unchanged: `loaded = []` ×2, then `await import(arming)` | as required |
| test note 6 | The trigger grep prints nothing (exit 1). `src/cli.ts` holds `render: makeRenderSeam(mode, orientation)` once | armed, silent |

**Gate at `b85f1d82`** (`../probe/gates-tip.txt`). Node v26.11.0, load1 2.45–2.57.
- `npm run lint`: exit 0, 98 files.
- `npm run typecheck` and `npm run build`: exit 0.
- `npm test`: exit 0, **51 files / 1583 passed**.
- Skip count: **0**, measured.
- `test-skip-integrity.js … --skip-count 0`: `No findings.`
- `lane-inventory.js`: 51/51, no findings.
- Not triggered: `PUZZLE_DEEP` (no engine file) and `CLI_DEEP` (no `src/cli.ts` or `src/engine.ts` change).

**Cost.** One pre-registered narrow set, `ADR-0035` (PROPOSED) decision 2 (`../probe/cost-Q1.tsv`).
- The set is **admissible**: twin −1.13 %, sign 3/8, **R = 0.038 s**, so it resolves 650 ms.
- Head − base median is **+0.017 s**, interval −0.027..+0.029 s, load1 2.94–3.62.
- **`N8-LANE` reads MET under `ADR-0035` as proposed.** The added-file scope is still 0 files.

**Why PASS_WITH_GAPS and not PASS.** Every criterion is met as written, and `A2`'s named mutant is red.
The gaps are about what the instruments read beyond the criteria, and each is measured:
- **QE-054-a.** A comment inside an all-`type` brace list, or a column-0 import line inside a block
  comment, makes `A8` count a consumer that binds nothing. On `X3b` that leaves `A8` GREEN on a tree
  where `tsc` and `biome check` exit 0. Only `A11` reds it, and only for the seam's three modules.
- **QE-054-b.** The narrowed composer claim ("a static value import, and on no wider set") is still
  wider than the tripwire. `import { /* … */ assembleFrame } from "./frame.ts"` is a static value import
  and the tripwire stays GREEN.
- **QE-054-c.** Two properties of the instrument are unpinned by any test: reading across lines (test
  note 3) and reading every statement, not just the first. Both mutants survive, in the fail-red
  direction.

**Why not FAIL.** No criterion fails. No `ADR-0030` table cell disagrees with the oracle. Every false
green needs a spelling outside the eight ruled ones. No reading here depends on the Engineer's numbers.

**Spelling table vs the Engineer's.** They agree. Both read 4 of 8 on the new instrument and 7 of 8 on
the old regex. QE adds 39 spellings: 26 agree with the oracle, 6 over-count (4 of them survive the gate
and are QE-054-a; `O3` is a format error and `O5` was not planted), and 7 under-count (fail red).

**Next.** The board move out of `In Review` belongs to the Orchestrator (the board is fenced from QE's hop).
- Security is "not triggered" on the page: 0 production lines, 0 spawns, two guard files. QE measured
  nothing that contradicts that.
- UAT is waived by the zero-production-lines rule (measured: the filter prints nothing).
- At merge, BA/PM's one-line annotation on `ABC-041` `A8` is still owed.
- The gaps are routed in `…ee331683`.
- Not merged, not pushed.
