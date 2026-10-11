---
id: 20261011T231055Z-security-nfr-observation-abc152-v12-dependency-review-daf38cf7
kind: observation
by: security-nfr
at: 2026-10-11T23:10:55Z
verified_by:
confidence: high
refs:
  - ABC-152
  - ABC-056
  - AR-1
  - ADR-0042
  - RISK-ABC143-01
  - RISK-ABC152-NEGWORKERS
  - .grugops/context/secnfr-ABC-152-window/probe/v12/lockdiff.py
  - .grugops/context/secnfr-ABC-152-window/probe/v12/lockdiff.out.txt
  - .grugops/context/secnfr-ABC-152-window/probe/v12/audit-base.dev.json
  - .grugops/context/secnfr-ABC-152-window/probe/v12/audit-base.omitdev.json
  - .grugops/context/secnfr-ABC-152-window/probe/v12/audit-head.dev.json
  - .grugops/context/secnfr-ABC-152-window/probe/v12/audit-head.omitdev.json
  - .grugops/context/secnfr-ABC-152-window/probe/v12/audit-signatures.txt
  - .grugops/context/secnfr-ABC-152-window/probe/v12/npmci.txt
supersedes:
---

# `ABC-152` `V12`: the dependency change is reviewed. **MET.** The bump retires 2 critical, 1 moderate and the `brace-expansion` highs, adds no install script and no non-permissive licence, and `--omit=dev` stays 0. 0 production lines

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
Base `91024242` (`main`, vitest 3.2.7). Head `3c55b965` (branch tip, vitest 4.1.11). Read 2026-10-11 between 22:34Z and
22:38Z. Node v26.11.0, npm 11.20.0. **No timing was read for `V12`.**

## The lockfile (`probe/v12/lockdiff.py`, reading both `package-lock.json` files from git)

- **+3 / −61 / 20 changed**, as `ADR-0042` d1 and the SE read. Entries: base 180, head 122. Both are lockfile v3.
- **Added (3), all `dev`, all MIT, none with an install script:** `@standard-schema/spec` 1.1.0, `convert-source-map`
  2.0.0, `obug` 2.2.1.
- **Removed (61).** They include both `brace-expansion` copies (5.0.7 and 2.1.2 under `glob`), `glob` 10.5.0 (base's
  `npm ci` prints its deprecation line; head's does not), `tinypool` 1.1.1, `vite-node` 3.2.4 and `cross-spawn`.
- **Changed (20):**
  - 17 cross a major (0.x minor counted as major): the 9 vitest packages 3.2.7 → 4.1.11, `chai` 5 → 6,
    `ast-v8-to-istanbul` 0.3 → 1.0, `es-module-lexer` 1 → 2, `js-tokens` 9 → 10, `magicast` 0.3 → 0.5, `std-env` 3 → 4,
    `tinyexec` 0.3 → 1.3, `tinyrainbow` 2 → 3;
  - 3 do not: `@babel/parser`, `@babel/types`, `@jridgewell/sourcemap-codec`;
  - **no changed package changed its licence.**
- **`vite` stays 7.3.6**, now a direct devDependency `~7.3.6` (`ADR-0042` d1). `npm ls vitest @vitest/coverage-v8 vite`
  exits 0 in each tree.
- **Every head entry is `dev`**, resolves from `registry.npmjs.org` and carries a `sha512` integrity. The root has no
  `dependencies` key.

## Licences (every entry in the lockfile)

| | MIT | MIT OR Apache-2.0 | BSD-3-Clause | ISC | Apache-2.0 | BlueOak-1.0.0 |
|---|---|---|---|---|---|---|
| base (180) | 146 | 9 | 5 | 12 | 3 | 5 |
| head (122) | 104 | 9 | 4 | 3 | 2 | **0** |

All are permissive. No copyleft licence enters, and none is unlisted. `BlueOak-1.0.0` leaves with `glob`'s tree.

## Install scripts

- **The set is the same at base and head, by name and version:** `esbuild@0.28.1` (postinstall `node install.js`) and
  `fsevents@2.3.3` (install).
- **npm 11.20.0 ran neither script, in any of the three trees.** Each `npm ci` printed
  `2 packages have install scripts not yet covered by allowScripts` (`probe/v12/npmci.txt`). The lane ran green in all
  three trees anyway (smoke runs, untimed: B and T 56 / 1740, H 56 / 1741). The three trees are therefore built the
  same way, and no script ran anywhere.

## `npm audit` (`--package-lock-only`, 2026-10-11T22:36Z)

| | critical | high | moderate | total | `--omit=dev` |
|---|---|---|---|---|---|
| base `91024242` | **2** | 3 | 3 | 8 | **0** |
| head `3c55b965` | **0** | 2 | 1 | 3 | **0** |

- **Retired by this bump:**
  - `tinypool` critical: GHSA-5gmw-xhrv-c9v3 and GHSA-85c8-ppgw-ccpr (a prototype-pollution gadget in worker options
    leads to RCE). `tinypool` leaves the tree;
  - `vitest` critical (via `@vitest/mocker` and `tinypool`), `@vitest/mocker` moderate GHSA-82fw-gwwq-j7x9 (path
    traversal / arbitrary file read via a redirect mock, range `>=2.1.0 <4.1.11`), and `@vitest/coverage-v8` moderate
    (via `vitest`).
    - **4.1.11 is the first fixed version.** `ABC-056` priced `npm audit fix --force` at coverage-v8 **4.1.10**, which
      sits inside that range. Today npm's own suggestion is 5.0.3, which the ticket fences out.
  - `brace-expansion` high: GHSA-mh99-v99m-4gvg, -rgw5-rvv9-x895, -qhr7-859c-m2p7, -6j4f-fj2g-mc7p, and moderate
    -q2hr-2g5m-vwhr. The package leaves the tree.
- **Remaining at head. Each was present at base, at the same version, and this bump touches none of them:**
  - `nanoid` 3.3.16, high, GHSA-2v37-7h3g-55p8;
  - `source-map-js` 1.2.1, high, GHSA-68fv-2mgg-jv7q;
  - `postcss` 8.5.22, moderate, GHSA-fxqj-rqcc-2cmp.
  - All three reach the tree only through `vite` 7.3.6 → `postcss` (→ `nanoid`, `source-map-js`). npm reports a
    non-major fix for each. `postcss` is `^8.5.6` in vite's range, so the `~7.3.6` hold does not block it.
- **`--omit=dev` is 0 at base and at head** (prod 1, the root package; there are no runtime dependencies).

## Provenance (`npm audit signatures`, in the B and H trees after `npm ci`)

- base: 124 of 124 packages have verified registry signatures; 35 have verified attestations.
- **head: 66 of 66 verified; 32 verified attestations; 0 invalid; 0 missing.** `vitest` and every `@vitest/*` at
  4.1.11, `vite` 7.3.6 and `chai` 6.3.0 carry SLSA provenance.
- Of the three added packages, `@standard-schema/spec` and `obug` carry attestations. **`convert-source-map` 2.0.0 has
  a signature but no provenance attestation.** It is a 2022 release of a long-standing package, so this is noted, not
  a finding.

## `AR-1`'s three advisories, and the pointer for `ABC-056`

- **`AR-1`'s own subject, `brace-expansion`, is gone at head.**
- **`ABC-056`'s two drift entries, `nanoid` and `postcss`, remain**, at unchanged versions.
- **A fourth advisory is outside both records:** `source-map-js` high GHSA-68fv-2mgg-jv7q. It is present at base
  today and at head, so this ticket does not introduce it. The set drifted again, as `ABC-056` predicted.
- **The override's structural premise holds at head:** `--omit=dev` is 0, there is no `dependencies` key, the
  package is private, and nothing is deployed.
- **`ABC-056`'s pointer:**
  - this ticket performs the coverage-v8 major upgrade that `ABC-056` priced, at 4.1.11, not 4.1.10;
  - after the merge, head's set is `nanoid`, `postcss` and `source-map-js`;
  - the Release Manager re-states `AR-1` over that set.
  - Recorded in a trace row. `ABC-056`'s own row is not edited.

## 0 production lines

`git diff --name-only 91024242 3c55b965 | grep -v '\.test\.ts$' | grep '^src/'` is **empty** (grep exit 1). The non-test
files outside `.grugops/`, `plans/` and `memory-bank/` are `package.json`, `package-lock.json`, `vitest.config.ts` and
`tools/grugops/result-file-reporter.js`.

## Security reading (ASVS L1, `security.block_on: high`)

- **The change is a dev-toolchain swap.** There is no runtime dependency, no input surface, no network, no secret and
  no data path.
- The reporter delta (`onTestRunEnd`, the load-time check and the `vitest/node` specifier) reads no new input and
  writes the same result file.
- **The runner-off mode loads `vi.mock` through Node's `module.registerHooks`.** That happens inside the test worker
  only, and nothing ships.
- **`RISK-ABC152-NEGWORKERS` (co-owned, low): kept as ruled.** A negative `VITEST_MAX_WORKERS` is set by whoever runs
  `npm test`, not by an attacker. The result file stays truthful. Not re-run here: a vitest run during the window's
  gate would hold the gate.
- **No security finding against this diff.** The three remaining advisories belong to `AR-1` / `ABC-056`, owned by
  the Release Manager.
