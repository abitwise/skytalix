---
id: 20261022T161113Z-security-nfr-observation-fbe0c143
kind: observation
by: security-nfr
at: 2026-10-22T16:11:13Z
verified_by: 
confidence: high (each command run by Security/NFR on 2026-10-22 in fresh scratch clones with a scratch npm cache; outputs read)
refs:
  - ABC-198
  - AR-1
  - EPIC-007
  - RISK-ABC143-01
  - grugops/ABC-198
  - grugops/qe-ABC-198
  - 4952425a
  - a42f4bbb
  - ef1d5ebc
  - 24f32527
  - fbb967f2
  - GHSA-qxg6-89mg-rqv8
  - GHSA-xp26-3454-mjgp
  - GHSA-9jrq-w75r-8gcw
  - GHSA-rq7h-c2jc-7f22
  - GHSA-587h-7wmj-h5pm
  - GHSA-698v-4r3x-3vcv
  - GHSA-r825-w8mm-5pxw
  - GHSA-2v37-7h3g-55p8
  - GHSA-fxqj-rqcc-2cmp
  - GHSA-68fv-2mgg-jv7q
  - 20261022T160319Z-software-engineer-observation-f4334765
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - V15.1.1
  - V15.2.1
  - NFR-008
supersedes: 
seal: sha256:ca4cbba2d428481679910c11be43490f9a94ca428d533113a3b8e9b9150bc684
---

# ABC-198 A8 readings: the lock diff moves exactly the 10 packages, and all 10 integrity hashes match the registry. The audit drops 7 pairs and 3 via rows and adds nothing; the 3 left are in AR-1's approved set. The 4.1.12 and 7.3.7 releases look like normal upstream patch releases

Security/NFR, task `security-nfr-ABC-198`, 2026-10-22. Base `4952425a` (= the merge-base with `main`; `main` `fbb967f2` has not touched `package*.json` since). Lock commit `a42f4bbb`; tip `ef1d5ebc`, whose lock is byte-equal to `a42f4bbb`'s. QE's merge `24f32527` has the same lock, `package.json`, `src/`, `tools/` and `vitest.config.ts` as the tip. Node v26.11.1, npm 11.20.0. npm ran only in fresh scratch clones under the session scratchpad, with a scratch npm cache. Nothing ran in main's checkout.

## Clause (a): the lock diff, read myself
- `git diff --numstat 4952425a a42f4bbb` prints only `53	53	package-lock.json`. `package.json` is byte-equal from base to tip. Top-level lock keys are equal; `lockfileVersion` is 3 at both ends.
- Structural read (node, `packages`): there are 123 entries at both ends, 0 added and 0 removed. Exactly 10 differ. Every other entry, including the root `""`, is deep-equal.
- The 10: `vitest`, `@vitest/coverage-v8`, `@vitest/expect`, `@vitest/mocker`, `@vitest/pretty-format`, `@vitest/runner`, `@vitest/snapshot`, `@vitest/spy`, `@vitest/utils` (4.1.11 → 4.1.12), and `vite` (7.3.6 → 7.3.7).
- Inside the 10, the only fields that change are `version`, `resolved`, `integrity`, and `4.1.11` → `4.1.12` pins in `dependencies`/`peerDependencies`. The one exception is `vitest`'s peer `@vitest/browser-webdriverio` `4.1.11` → `^4.1.11`, as published. `vite`'s entry changes `version`, `resolved` and `integrity` only.
- `dev`, `bin`, `license` and `engines` are unchanged on all 10. Every entry is still `dev: true`; there is no non-dev entry in the lock.
- Every `resolved` in the tip lock is on `https://registry.npmjs.org/`. Every non-root entry has an `integrity`.
- `hasInstallScript` is on the same 2 entries at both ends (`esbuild`, `fsevents`), so there is no new install script. Entries carrying `bin`: 10 at both ends, so there is no new `bin`.
- Regeneration: the ticket's Scope 1 command, run on a fresh clone at base, exits 0, prints numstat `53	53`, and is `cmp`-equal to the tip lock (sha256 prefix `5d48a90473834f4c`).

## Integrity hashes against the registry (`npm view <pkg>@<ver> dist.integrity dist.tarball`)
Lock `integrity` and `resolved` equal the registry's `dist.integrity` and `dist.tarball` for 10 of 10:
- `vitest@4.1.12` `sha512-5eWdz2yb3ajx…` MATCH
- `@vitest/coverage-v8@4.1.12` `sha512-6S7/iVknKglL…` MATCH
- `@vitest/expect@4.1.12` `sha512-vFlTt+YEu9WB…` MATCH
- `@vitest/mocker@4.1.12` `sha512-fKShNpKZzupW…` MATCH
- `@vitest/pretty-format@4.1.12` `sha512-XW9O8+Mxx4Vp…` MATCH
- `@vitest/runner@4.1.12` `sha512-NKlVKCr5QnCe…` MATCH
- `@vitest/snapshot@4.1.12` `sha512-ko1y1Qgb/slz…` MATCH
- `@vitest/spy@4.1.12` `sha512-RGq9x4JNGNTZ…` MATCH
- `@vitest/utils@4.1.12` `sha512-Q3awXrwOfEV+…` MATCH
- `vite@7.3.7` `sha512-AHEzTORMbi7/…` MATCH

`npm audit signatures` in both clones: 66 of 66 installed packages have verified registry signatures, and 32 have verified attestations, at base and at tip.

## Install (fresh clones, `npm ci --ignore-scripts`)
- Base and tip both exit 0, and `git status --porcelain` is empty in both.
- `node_modules/.bin` is identical at both ends (11 entries).
- None of the 10 installed `package.json` files at tip declares `preinstall`, `install`, `postinstall` or `prepare`. The registry metadata for all 10 shows the same.
- `npm ls` at tip shows only `vitest@4.1.12`, `@vitest/mocker@4.1.12` and `vite@7.3.7`.

## Audit, pair by pair (`npm audit --json`, same session; via-only rows as `package via:<name>`)
**Base** `4952425a`, metadata `{info 0, low 0, moderate 4, high 3, critical 0, total 7}`:
- `@vitest/coverage-v8 via:vitest`
- `@vitest/mocker GHSA-qxg6-89mg-rqv8`
- `@vitest/mocker GHSA-xp26-3454-mjgp`
- `nanoid GHSA-2v37-7h3g-55p8`
- `postcss GHSA-fxqj-rqcc-2cmp`
- `source-map-js GHSA-68fv-2mgg-jv7q`
- `vite GHSA-587h-7wmj-h5pm`
- `vite GHSA-698v-4r3x-3vcv`
- `vite GHSA-9jrq-w75r-8gcw`
- `vite GHSA-r825-w8mm-5pxw`
- `vite GHSA-rq7h-c2jc-7f22`
- `vitest via:@vitest/coverage-v8`
- `vitest via:@vitest/mocker`

**Tip** `ef1d5ebc`, metadata `{info 0, low 0, moderate 1, high 2, critical 0, total 3}`:
- `nanoid GHSA-2v37-7h3g-55p8`
- `postcss GHSA-fxqj-rqcc-2cmp`
- `source-map-js GHSA-68fv-2mgg-jv7q`

- Base minus tip (`comm -23`): exactly the 7 pairs (2 `@vitest/mocker`, 5 `vite`) and the 3 via rows the ticket names.
- Tip minus base (`comm -13`): empty. Nothing is added, and there is no same-day registry drift.
- `npm audit --omit=dev` totals 0 at both ends.
- All 3 tip pairs are in AR-1's approved set `…193e08fb` (nanoid GHSA-2v37, postcss GHSA-fxqj, source-map-js GHSA-68fv).
- My readings equal SE's `…f4334765` line for line.

## Supply-chain read
- **Publisher.** All 10 are published by `GitHub Actions` through npm trusted publishing (OIDC), with SLSA v1 provenance and a registry signature under npm's current key `SHA256:DhQ8wR5A…`. The 9 vitest packages carry the approver `oreanno`, who is a listed maintainer. This matches 4.1.11 (`vitest`, `@vitest/mocker`) and `vite` 7.3.5/7.3.6.
- **Maintainers unchanged.** vitest family: ariperkkio, antfu, hiogawa, oreanno, yyx990803, the same as 4.1.11. vite: yyx990803 and vitebot, the same as 7.3.6.
- **Timing.**
  - `vite` 7.3.7 was published 2026-10-06T05:11Z, in one batch with 8.2.4 and 8.1.6, and after 8.3.3. That is a normal backport set.
  - `vitest` family 4.1.12 was published 2026-10-15 (14:40Z for `@vitest/mocker`, 14:51Z for `vitest`), 22 minutes after 5.0.5. The `V4` dist-tag points to 4.1.12.
  - The fixes predate the advisories (GitHub advisory database: the vite/launch-editor ids were published 2026-10-20/21, the vitest ids 2026-10-21). That pattern is consistent with coordinated disclosure.
- **Changelog matches the advisories.**
  - vitest v4.1.12 release (GitHub, by github-actions): one bug fix, "mocker: Harden manual and redirect mocks [backport to v4]" (#11580). That fits GHSA-qxg6 (manual mock registration) and GHSA-xp26 (redirect allowlist), whose first patched version is 4.1.12.
  - vite `CHANGELOG.md` at tag v7.3.7 (2026-10-06): launch-editor updated to v2.14.2 (#23654), which fits GHSA-587h, GHSA-698v and GHSA-r825; `server: store ids to safeModulePaths rather than URLs` (#23656), which fits GHSA-rq7h; and an html `transformIndexHtml` filename fix (#23653). GHSA-9jrq also lists 7.3.7 as its first patched version.
- **One difference from 7.3.6, read and explained.** `vite` 7.3.7 carries 2 registry signatures under the same key id; 7.3.6 carries 1. The sibling releases 8.3.5, 8.2.4, 8.1.6 and 6.4.5 also carry 2. Both 7.3.7 signatures differ (ECDSA), and `npm audit signatures` verifies the installed tarball. I read this as a registry-side pattern for that batch, not a sign of tampering.
- Nothing else unusual.

## Clause (c)
- `git diff --numstat 4952425a ef1d5ebc -- src/ tools/` prints only `1	1	src/cli.test.ts`. The diff is one test literal: `CAPTURE_ARM_READ_ON_VITEST = "4.1.11"` → `"4.1.12"`. It adds no input path, no I/O and no dependency. Clause (c) does not fire.
- `vitest.config.ts` and `package.json` name no `ui`, `api`, `browser` or `server` mode at tip.

## Not read here
- `A7` (0 listening sockets during a plain `npm test`) is QE's, running in parallel in `qe-ABC-198`. It is not in the context yet.
- `NFR-008` wall time on 4.1.12: no timing was run. `UNKNOWN - verify`.
