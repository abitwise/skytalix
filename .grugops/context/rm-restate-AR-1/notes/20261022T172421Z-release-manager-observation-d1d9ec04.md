---
id: 20261022T172421Z-release-manager-observation-d1d9ec04
kind: observation
by: release-manager
at: 2026-10-22T17:24:21Z
verified_by: 
confidence: high
refs:
  - AR-1
  - ABC-198
  - ABC-056
  - e0e5f987
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - 20261022T153947Z-orchestrator-decision-e4ef897b
  - 20261022T161122Z-security-nfr-decision-0f626230
  - 20261022T172500Z-orchestrator-decision-2c4d34bd
  - GHSA-2v37-7h3g-55p8
  - GHSA-fxqj-rqcc-2cmp
  - GHSA-68fv-2mgg-jv7q
supersedes: 
seal: sha256:db0fe3486bf172b7a5c7580ae70a4799150f9e17f309f509f430ecdfe7353865
---

# AR-1 readings at `main` @ `e0e5f987`: the `npm audit` set is exactly 3 (package, advisory) pairs, all inside the owner-approved set `…193e08fb`; `--omit=dev` reads 0

## Where and how
- A fresh `git clone` of this repository, checked out at `e0e5f987` (the ABC-198 merge). It sits in this hop's scratch folder, outside every checkout. Nothing ran in main's checkout.
- Manifest md5s at `e0e5f987`: `package.json` `e33daa26e800038534bda284b3ff4133`, `package-lock.json` `f6c3d961173fca9cde4f2acecd7dce50`.
- `npm ci --ignore-scripts` with a scratch npm cache: exit 0. `git status --porcelain` is empty afterwards.
- npm 11.20.0, node v26.11.1. Readings taken 2026-10-22, about 17:23Z.
- `npm audit fix` was **not** run. Nothing was installed beyond `npm ci`.

## `npm audit --json`
- Exit 1. Metadata: info 0, low 0, moderate 1, high 2, critical 0, total 3. Dependencies: prod 1, dev 122, optional 60.
- Every `via` is a single advisory object; there are no via-only rows.

| package | installed | lock `dev` | severity | direct | advisory | range | fixAvailable |
|---|---|---|---|---|---|---|---|
| `nanoid` | 3.3.16 | true | high | false | GHSA-2v37-7h3g-55p8 | `<3.3.18` | true |
| `postcss` | 8.5.22 | true | moderate | false | GHSA-fxqj-rqcc-2cmp | `<=8.5.22` | true |
| `source-map-js` | 1.2.1 | true | high | false | GHSA-68fv-2mgg-jv7q | `1.0.0 - 1.2.1` | true |

## Pair comparison (pairs, not counts)
- The measured pair list, sorted, `diff`s empty against the brief's expected 3 pairs.
- Against `…193e08fb`'s approved 6 pairs (the 3 above, plus vite GHSA-698v-4r3x-3vcv, GHSA-r825-w8mm-5pxw and GHSA-587h-7wmj-h5pm): measured minus approved is **empty**. Approved minus measured is the 3 vite pairs, which ABC-198's in-range bump removed.
- **No new HIGH.** The 2 high pairs (nanoid, source-map-js) were already in `…193e08fb` at high.
- None of the 4 pairs under the interim accept `…e4ef897b` (vite GHSA-9jrq-w75r-8gcw and GHSA-rq7h-c2jc-7f22; @vitest/mocker GHSA-qxg6-89mg-rqv8 and GHSA-xp26-3454-mjgp) is present.

## `npm audit --omit=dev`
`found 0 vulnerabilities`, exit 0.

## Agreement with earlier readers
This matches Security/NFR `…0f626230` Ruling 2 and the Orchestrator's `…2c4d34bd` reading on `main`. It is my own run, not a copy of theirs.
