---
id: 20261017T103636Z-qe-e2e-observation-abc056-gap-register-8f36c18b
kind: observation
by: qe-e2e
at: 2026-10-17T10:36:36Z
verified_by:
confidence: high
refs:
  - ABC-056
  - AR-1
  - ADR-0036
  - ADR-0018
  - ABC-041
  - QE-056-a
  - QE-056-b
  - QE-056-c
  - QE-056-d
  - 20261017T103636Z-qe-e2e-observation-abc056-plants-a1a81cb9
supersedes:
---

# QE `ABC-056`: gap register. Two LOW and two INFO. No criterion fails

Hand-authored and unsealed. The evidence is in `…a1a81cb9` (plants) and `…ed286904` (readings).

| id | sev | owner | gap | evidence | mitigation today |
|---|---|---|---|---|---|
| `QE-056-a` | LOW | Release Manager (the record), BA/PM if a criterion moves | **Check 5 does not cover the whole runtime import surface.** Four forms load code with 5a, 5b and 5c unchanged: a production file in a subdirectory (the file set is `ls src/*.ts`; `.mjs`/`.js`/`.cts` under `src/` are also unread, which I inferred from the glob and did not plant); a `./`-prefixed path that climbs out (`./../node_modules/nanoid/index.js`); `import (x)` with a space (5b was tightened to `import\(`); and `process.getBuiltinModule(…)`, which loads a built-in without a specifier, so 5c cannot see it | G1–G4: `nanoid` loads in G1–G3 and in G4's child, and every check reads the same as the record | ADR-0036 (b) FIRES on all four (G2/G3 as disputed), which routes the diff to Security/NFR. A narrow fix would be for check 5 to read ADR-0036's widened file set, or for 5a to keep `./` specifiers that contain `..`. Writing it is not QE's job |
| `QE-056-b` | LOW | Release Manager | **Two legs of the reason are pinned by no check.** (1) "`node src/cli.ts` with no loader flag": `scripts.chess` = `node --import nanoid src/cli.ts` loads `nanoid` while checks 1–5c all read the same. (2) "no `dependencies` key, so every audited package is a dev dependency": an `optionalDependencies` entry for a package with no advisory leaves checks 1–5c unchanged, and the inference is then false | G5, G6b (G6 control: a vulnerable optional dependency does trip check 1) | `ABC-041` clause (a) fires on any `package.json` touch. A check such as `jq -r '.scripts.chess'` = `node src/cli.ts`, or the lockfile count of packages without `dev: true` (0 of 122 today), would pin them |
| `QE-056-c` | INFO | Release Manager | The reason says dev packages run only when a developer runs the toolchain. **`npm install`, which is ADR-0018's channel, also runs install scripts:** the lockfile marks `esbuild` 0.28.1 and `fsevents` 2.3.3 `hasInstallScript`. None of today's three advisories is in either package, so `A1` holds | `jq '.packages[]\|select(.hasInstallScript)'` | Clause (1) forces a re-read on any new advisory, and that re-read is where install-time reach would be judged |
| `QE-056-d` | INFO | Release Manager | Record ergonomics. The `A2` `jq` line prints advisory **URLs** and ranges, not ids, so the comparison needs the id stripped out. The `A3` table writes `\|` for `|` and cannot be pasted verbatim. The page's Amendment section has the runnable forms | read | The note itself says so for the table |

**Not gaps (checked):** the RM's set, paths and every check reading match QE's own. Clause (1) fires on a lockfile
plant. 5a fails closed on a prefix-less built-in (P4b). No dynamic `import(` exists in production code (one prose
hit in a comment, `src/book-file.ts:8`). `A5` is empty on both forms of the range.
