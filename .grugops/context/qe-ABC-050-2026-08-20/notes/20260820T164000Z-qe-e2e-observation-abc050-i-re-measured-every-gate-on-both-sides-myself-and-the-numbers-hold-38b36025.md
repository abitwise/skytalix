---
id: 20260820T164000Z-qe-e2e-observation-abc050-i-re-measured-every-gate-on-both-sides-myself-and-the-numbers-hold-38b36025
kind: observation
by: qe-e2e
at: 2026-08-20T16:40:00Z
verified_by: ""
confidence: high
refs:
  - ABC-050
  - plans/tickets/ABC-050-lane-runner-config-has-no-guard.md
  - biome.json
  - tsconfig.json
  - vitest.config.ts
  - src/glyph-mode.nfr.test.ts
  - .grugops/test-skips.md
supersedes: ""
type: observation
task: qe-ABC-050-2026-08-20
role: qe-e2e
ticket: ABC-050
created: 2026-08-20T16:40:00Z
tree: grugops/abc050-lane-runner-guard @ ca50b26, base main @ d127ae3
---

# `A1` and `A3`, re-measured by me on BOTH sides. Every number the engineer reported reproduces. None was quoted.

**Timestamp convention, stated because it looks odd:** stamped on the local wall clock labelled
`Z`, matching this ticket's four earlier notes so replay by `at` keeps the order it happened in.
True UTC at write was `13:1xZ`.

**How the base side was measured without moving HEAD.** A second QE hop on `ABC-043` is live in
this same working tree, so no `checkout` / `switch` / `stash` / `reset` was run. Both sides were
materialised into the scratchpad with `git archive <rev> | tar -x`, `node_modules` symlinked to
the repo's. The tip archive of `ca50b26` was byte-compared against the live worktree copy of
`src/glyph-mode.nfr.test.ts` before use, and matched. **`git status --porcelain` in the repo is
unchanged from when I started** — see the residue note in this folder.

**Exit codes were captured UNPIPED**, `$?` immediately after the process being judged, never after
a pipeline. That is the defect the Orchestrator wrote down against himself on this ticket
(`20260820T163000Z-...-5b2e8f41`), and it is not repeated here.

## `A1` — the delta, and the biome probe on both sides

| | `npm run lint` | files checked | `npx biome check vitest.config.ts` | `provided but ignored` lines |
|---|---|---|---|---|
| base `d127ae3` | exit **0** | **72** | exit **1** — *"No files were processed in the specified paths"*, `Checked 0 files` | **1** |
| tip `ca50b26` | exit **0** | **73** | exit **0** — `Checked 1 file` | **0** (`grep -c` = 0) |

**Exactly one higher. `A1` MET on both clauses.** The engineer's `72 -> 73` reproduces exactly, and
their correction of the relayed base-side exit code is confirmed independently: base-side biome
exits **1**, not 0. No constant from the ticket page or `AGENTS.md` was used as an input; the page's
`49` is stale.

## `A3` — the four mandatory gates, both sides, measured by me

| | lint | typecheck | build | test | test files | tests | skips | skip-integrity |
|---|---|---|---|---|---|---|---|---|
| base `d127ae3` | **0** (72) | **0** | **0** | **0** | **40** | **1207 passed** | **0** | `No findings.` exit **0** |
| tip `ca50b26` | **0** (73) | **0** | **0** | **0** | **40** | **1207 passed** | **0** | `No findings.` exit **0** |

Test-file count, test total and skip count **identical**. Skip count taken with `AGENTS.md`'s
command (`npx vitest run --reporter=json 2>/dev/null | jq '.numPendingTests + .numTodoTests'` -> `0`
on both) and fed to `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
--skip-count 0`. **`.grugops/test-skips.md` was READ and RUN AGAINST. Zero rows written. It is
`H2`'s.** `A3` **MET**.

**No suppression bought this green, checked from git rather than from the report:** `biome.json`'s
`.linter` block is byte-identical base→tip (`jq -S '.linter'`, empty diff), `tsconfig.json`'s
`.compilerOptions` is byte-identical (`jq -S`, empty diff), and the whole four-file diff contains
zero added `biome-ignore` / `ts-ignore` / `ts-expect-error` / `eslint-disable`. `biome.json`'s only
changed line is `+ "vitest.config.ts"`.

## The fences, each measured from git

- **ZERO production lines under `src/`.** `git diff --name-only d127ae3 ca50b26 | grep -v
  '\.test\.ts$' | grep '^src/'` -> **EMPTY** (grep exit 1). The only `src/` file in the diff is
  `src/glyph-mode.nfr.test.ts`.
- **ZERO runner options moved.** The whole `export default defineConfig({...})` body of
  `vitest.config.ts` is **byte-identical** to base (`sed -n '/^export default defineConfig/,$p'` on
  both, `diff` empty). `vitest.config.ts`'s +12/−6 is **comment lines only**, as reported.
  `NFR-008`'s firing threshold never fired.
- **`2bef492` untouched.** It is an ancestor of `d127ae3`; its `exclude` key and its seven
  `!`-negations survive verbatim, and the one added `biome.json` line sits above them.
- **Shape confirmed:** 4 code files, `biome.json` +1/−0, `tsconfig.json` +1/−1, `vitest.config.ts`
  +12/−6 (comments only), `src/glyph-mode.nfr.test.ts` +24/−2. Plus `plans/board.md` (+4/−4) and
  `plans/traceability.md` (+3), which are the engineer's own hop's rows.

## What I did NOT measure

**`N8-LANE`'s ≤ 650 ms CPU was NOT independently re-measured.** The engineer's paired interleaved
campaign (n = 8, median −42.5 ms, null control +0.69%) is not re-run here, and my two single
full-suite runs are **not** a measurement of it — they ran on a machine carrying a concurrent QE hop
and are unpaired. What I did verify is the **construction** the criterion rests on, from the diff:
**zero test FILES added** and **zero test cases added** (1207 on both sides), so the per-file term
is `+0` by construction rather than by assertion. Anything beyond that: `UNKNOWN - verify`.
