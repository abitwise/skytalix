---
id: 20261021T145301Z-ba-pm-observation-89ba3c6d
kind: observation
by: ba-pm
at: 2026-10-21T14:53:01Z
verified_by: 
confidence: high (measured in scratch; prototype is not a design)
refs:
  - ABC-188
  - ABC-189
  - ABC-190
  - ABC-168
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - AR-168-BINPIN
  - QE-172-a
  - QE-182-a
  - QE-168-b
  - ADR-0036
  - 96dc3fa3
  - b71f8902
  - 6d27dc9e
  - 341da4c1
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - .grugops/context/design-F-072-1/probe/r2-mutants.sh
  - 20261021T143943Z-security-nfr-decision-75a45be0
  - 20261021T143759Z-security-nfr-observation-edfed8cb
supersedes: 
seal: sha256:921d241c61bfa07dd6c12a79180c4ef557ccf466a4b3c70ce2fb96de906d4943
---

# bapm-cut-ABC-168-followups readings at `main` `96dc3fa3` (scratch only; nothing written in the repository)

## 1. Instrument prototype (scratch copy of `clause-b.mjs`, NOT a design)
- Copy with only `!lines.size || ` removed from `:273`, run through `r2-mutants.sh` at `96dc3fa3`: exit 1, `limb 1 MISMATCH: G1-IMP G1-GRD` (both now FIRES, R2 `src/book-file.ts@<base>` and `@<base> and <head>`); P2b/P2c/CMT/X1/NOH unchanged; no `DIFFER` (limbs 2/3 identical to `341da4c1` on 7 of 7).
- Plants by hand, main instrument vs prototype, limb 1:
  - G1B (Security/NFR G-1b: no-parameter `statSync` guard at base; head deletes the `if` line, 0/1): does not fire / FIRES (`src/book-file.ts`, `<base> and <head>`).
  - UNC1 (QE limb-1 uncomment: `src/book.ts` prefixed `/*`, import, `*/` at base; head deletes the 2 delimiters, 0/2): does not fire / FIRES (`src/book.ts`, `<head>`).
  - REN (QE rename-and-drop: `book-file.ts` -> `book-reader.ts`, import dropped, returns `new Uint8Array(0)`, `cli.ts` import follows): does not fire / **does not fire**.
  - DELF (`src/book-file.ts` deleted only): does not fire / **does not fire**.
  - D1 at `b71f8902` (drop `process.exitCode = INTERNAL_ERROR_EXIT_CODE;`, 0/1): does not fire / FIRES (`src/uci.ts`, `<base> and <head>`); limbs 2/3 "does not fire" on both instruments.
  - D2 at `b71f8902` (drop the 4-line `sink.on("error", …)` arm, 0/4): does not fire / FIRES.
- Cause of REN/DELF (read): `addedLines` (`:207`) sets `file = null` on `+++ /dev/null`, so a holder deleted or renamed away at `<head>` never reaches Ruling 2. Security/NFR's worded ruling (`…75a45be0` § 2) covers it; the by-hand `--name-only` check lists it.
- The prototype's summary line still reads `holder files with + lines: 1` on `−`-only files (misleading wording; the harness checks only NOH's `adds nothing`).

## 2. `AR-168-BINPIN` pin (scratch `git archive 6d27dc9e`, node_modules symlinked, `vitest -t "A10 — package.json"`, heap 400)
- No pin: real `bin` 1 passed; `(iv-b)` `src/uci.ts` 1 passed (the gap).
- With `expect(packaged.bin, "package.json bin (AR-168-BINPIN)").toEqual({ skytalix: "dist/uci.js" })` beside `expect(packaged.private).toBe(true)`: real 1 passed; `(iv-b)` 1 failed (`expected { skytalix: 'src/uci.ts' } to deeply equal { skytalix: 'dist/uci.js' }`); `(iv-a)` `dist/cli.js` 1 failed. `cli.test.ts` 88 tests, 1 selected.

## 3. Lock regeneration (scratch copy of `6d27dc9e`'s `package.json` + lock, npm 11.20.0)
- `npm install --package-lock-only --ignore-scripts --no-audit --no-fund`: rc 0, numstat `4 0`; the 4 lines are `"license": "UNLICENSED",` and the 3-line `bin` block under `packages[""]`. Matches `…216ceb43`. `npm ci` was not run at cut.

## 4. Other
- `AR-163-UNCOMMENT` trigger: 0 non-JSDoc block-comment openers (`/*` not followed by `*`) in production `src/` at `96dc3fa3` and `b71f8902`. JSDoc blocks not read for compilable limb code: UNKNOWN - verify.
- `src/` and `package.json` byte-equal `4890782a..96dc3fa3`, so base counts are QE-187's 59 / 1987.
- `src/book-file.ts` at `96dc3fa3`: 17 lines.
