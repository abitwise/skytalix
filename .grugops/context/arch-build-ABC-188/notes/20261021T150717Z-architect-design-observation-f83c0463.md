---
id: 20261021T150717Z-architect-design-observation-f83c0463
kind: observation
by: architect-design
at: 2026-10-21T15:07:17Z
verified_by: 
confidence: high (measured in scratch; no timing)
refs:
  - ABC-188
  - AR-163-DELONLY
  - QE-182-a
  - ADR-0036
  - 5cd279a4
  - 98487c1e
  - d722a6b6
  - eb097a7b
  - b71f8902
  - 341da4c1
  - b294ba6f
  - 6658629f
  - ea330b1d
  - .grugops/context/design-F-072-1/probe/r2-mutants.out.txt
supersedes: 
seal: sha256:f84224b022a7e07aea165e005f1e1450dd0f1e498a7265756159d7fe2407d1df
---

# ABC-188 builder readings: A2 and A3 red before the fix, A4–A7 green, gates at tip `eb097a7b`

Scratch only, under a private `TMPDIR` in the session scratchpad. `<repo>` is the worktree `../wt-ABC-188` on
`grugops/ABC-188`. Every instrument copy has `node_modules` symlinked, and all paths are absolute. No timing was taken.

## Commits (from `main` `5cd279a4`; its `src/`, `biome.json`, `package.json`, `vitest.config.ts`, probe dir and ADR dir are byte-equal to the cut's `96dc3fa3`)
- `98487c1e`: the harness only. This commit makes the red run possible.
- `d722a6b6`: the instrument, plus the harness's `R2 file` print line. This is the code commit, and every harness run
  below is at this tip.
- `eb097a7b`: the `ADR-0036` block, and `r2-mutants.out.txt` = the `A4` run byte for byte.

## Runs: `bash r2-mutants.sh <repo> d722a6b6 <scratch> <instrument>`
- **A2.** Instrument: `git show 5cd279a4:<clause-b.mjs>`. rc **1**, last line `r2-mutants: limb 1 MISMATCH: G1-IMP G1-GRD G1B UNC1 REN`. 0 `DIFFER` lines.
  - The same red also ran first at `98487c1e`, before any instrument edit.
- **A3.** Instrument: that copy with only `!lines.size || ` removed (`diff`: 1 line). rc **1**, `limb 1 MISMATCH: REN`, 0 `DIFFER`.
  - All other 9 rows were `ok`, UNC1 included.
- **A4.** Instrument: head's `clause-b.mjs` (sha-256 `55641c55cac2c060…`). Reference `341da4c1` (sha-256 `433d0c5052559b18…`).
  - rc **0**, `10 of 10 limb-1 rows as expected; limbs 2 and 3 identical to 341da4c1 on 10 of 10`.
  - Rows: P2b, P2c, CMT, G1-GRD and G1B are `@<base> and <head>`; X1, G1-IMP and REN are `@<base>`; UNC1 is
    `src/book.ts@<head>` (holders 1 / 2); NOH is `adds nothing`.
  - `git status --porcelain` (empty), `HEAD` and `for-each-ref` were the same before and after, in both the worktree
    and the main checkout.
- **A5** (from A4's `R2 file` lines):
  - P2b `1 + line, 1 - line`; P2c `2 + lines, 2 - lines`; CMT 1/1; X1 1/3;
  - G1-IMP `0 + lines, 1 - line`; G1-GRD 0/1; G1B `0 + lines, 1 - line`; UNC1 `src/book.ts` 0/2;
  - REN `src/book-file.ts  (fired by Ruling 2: 0 + lines, 17 - lines; holds limb 1 at <base>)`.
- **A7.** A scratch `git clone --shared` at `d722a6b6`, plus commit `b294ba6f`: `read: readBookFile,` →
  `read: () => readBookFile(),` (QE's `14989ee2` shape).
  - The harness with that clone and tip exits **2**.
  - stderr: `plant P2c did not apply at b294ba6f: changed [src/book-file.ts], names [src/book-file.ts src/cli.ts]`.
  - P2b ran `ok` before it.
  - Also: tip `619abc14` (no holder) exits 2 with `plant P2b did not apply at 619abc14: changed [], names [src/book-file.ts]`.

## A6: D1 and D2 by hand at `b71f8902` (`grugops/ABC-168` tip, `src/uci.ts` unchanged since)
A scratch clone at `b71f8902`. The plants used fixed dates.
- **D1** `6658629f`: numstat `0 1 src/uci.ts`; the line `process.exitCode = INTERNAL_ERROR_EXIT_CODE;`.
  - Head: `src/uci.ts  (fired by Ruling 2: 0 + lines, 1 - line; holds limb 1 at <base> and <head>)`, holders 2 / 2, `limb 1: FIRES`.
- **D2** `ea330b1d`: numstat `0 4`; the 4-line `sink.on("error", …)` arm.
  - Head: `0 + lines, 4 - lines`, the same ends, `limb 1: FIRES`.
- Both: limbs 2 and 3 are `cmp`-identical to the `341da4c1` copy (`does not fire`). Base's instrument (`5cd279a4`) limb 1 reads `does not fire`.

## Extra readings (not criteria)
- **DELF** (only `git rm src/book-file.ts` on `d722a6b6`): head FIRES, `0 + lines, 17 - lines; holds limb 1 at <base>`.
- **NOH under a git shim** (`f00038ef^1` + a comment line in `src/fen.ts`): `adds nothing`, `does not fire`.
  - 79 git calls, and the only `diff` call is `diff -U0 --no-renames <b> <h> -- src`.
  - The 2 `--name-only` calls are `ls-tree`.
- `git grep -E '^(-- |\+\+ )'` in production `src/`: 0 lines at `eb097a7b` and at `b71f8902` (`R-188-a`).

## Gates at `eb097a7b` (one at a time, in the worktree; `node_modules` is a symlink ignored by `.git/info/exclude`)
| gate | result |
|---|---|
| `npm run lint` | rc 0, `Checked 116 files … No fixes applied.` |
| `npm run typecheck` / `npm run build` | rc 0 / rc 0 |
| `npm test` (heap 128 from the script) | rc 0, 59 files / 1987 tests passed |
| `.test-results/last-run.json` | `success` true, 1987 / 1987 passed, 0 failed, 0 pending, 0 todo, 59 files |
| base counts | 59 / 1987 (QE-187 at `4890782a`). Test inputs are byte-equal: `src/`, `package.json`, `vitest.config.ts` and `biome.json` are unchanged `4890782a..96dc3fa3` (BA/PM) and `96dc3fa3..eb097a7b` (here) |
| skip count (AGENTS.md capture, heap 128) | 0 |
| `test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | `No findings.`, rc 0 |

**UAT waiver form**, unfiltered: `git diff --name-only <c>~1 <c> | grep -v '\.test\.ts$' | grep '^src/'`.
- It prints nothing for `98487c1e`, `d722a6b6` and `eb097a7b` (rc 1 each), and over `main...HEAD` (rc 1).
- No `.snap` file changed.
