---
id: 20261022T161122Z-security-nfr-decision-0f626230
kind: decision
by: security-nfr
at: 2026-10-22T16:11:22Z
verified_by: 
confidence: high
refs:
  - ABC-198
  - AR-1
  - EPIC-007
  - ABC-178
  - RISK-ABC143-01
  - grugops/ABC-198
  - grugops/qe-ABC-198
  - 4952425a
  - a42f4bbb
  - ef1d5ebc
  - 24f32527
  - 20261022T161113Z-security-nfr-observation-fbe0c143
  - 20261022T160319Z-software-engineer-observation-f4334765
  - 20261022T153947Z-orchestrator-decision-e4ef897b
  - 20261022T154813Z-ba-pm-decision-1a123d24
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - 20261021T140532Z-security-nfr-decision-216ceb43
  - 20261022T153804Z-security-nfr-decision-140008ff
  - 20261022T153729Z-security-nfr-observation-56bf0b02
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
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
  - V15.1.1
  - V15.2.1
  - NFR-008
supersedes: 
seal: sha256:d0b293fdaf2d433e743a02059d0c09c8ad3601f5bdec4a4dfb8cd59344124f30
---

# ABC-198 Security/NFR result (A8): **PASS**. No required fix, no finding, and no accepted risk added. Clause (a) is confirmed: the lock moves exactly the 10 packages in range, on the registry, with matching hashes and no new install surface. The audit retires 7 pairs and 3 via rows and adds nothing. After the merge, AR-1 rests on 3 pairs that the owner already approved; the Release Manager re-states it

The readings are in this task's observation note. I cite ABC-198's `## Scope` (one regeneration command, one test literal, `package.json` unchanged), `## Acceptance` `A1`, `A2` and `A8`, `## Who re-states AR-1`, and `## Security / NFR triggers` as authoritative. ASVS L1, `block_on: high`, `compliance_regime` empty, `human_admission` off, so this hop records no `finding`.

## Ruling 1: clause (a) is CONFIRMED, with no finding
- I read `git diff 4952425a a42f4bbb -- package-lock.json` myself. Only `version`, `resolved`, `integrity` and the in-family `4.1.11` → `4.1.12` pins move, on exactly the 10 packages. The one non-pin peer change, `@vitest/browser-webdriverio` → `^4.1.11`, is as published. The other 113 entries are deep-equal.
- Every `resolved` is on `registry.npmjs.org`. No package is added or removed. There is no new `hasInstallScript` (still only `esbuild` and `fsevents`) and no new `bin` (10 entries at both ends). None of the 10 declares a lifecycle script.
- All 10 `integrity` values equal the registry's `dist.integrity`, and all 10 `resolved` values equal `dist.tarball`. `npm audit signatures` verifies 66 of 66 at both ends.
- The regeneration reproduces `cmp`-equal from base. `npm ci --ignore-scripts` exits 0 with a clean tree at both ends.
- Clause (c) does not fire: the one `src/` change is the `CAPTURE_ARM_READ_ON_VITEST` literal in a test file. Clauses (b) and (d) do not fire either.
- `V15.1.1` and `V15.2.1` [L1] are met under AR-1, and this change improves them: 7 dev-only advisory pairs, including one npm-`high`, are remediated in range.

## Ruling 2: the audit set is confirmed pair by pair (`A2`)
- Base has 13 rows (10 pairs and 3 via rows), total 7. Tip has 3 pairs, total 3: nanoid GHSA-2v37-7h3g-55p8, postcss GHSA-fxqj-rqcc-2cmp and source-map-js GHSA-68fv-2mgg-jv7q.
- Base minus tip is exactly the ticket's 7 pairs and 3 via rows. Tip minus base is empty. `--omit=dev` is 0 at both ends.
- All 3 remaining pairs are in AR-1's owner-approved set `…193e08fb`.

## Ruling 3: the supply-chain read finds normal upstream patch releases
- Both lines are published by GitHub Actions trusted publishing, with SLSA provenance, the same maintainers and the same publisher pattern as the versions they replace.
- `vite` 7.3.7 (2026-10-06) is part of a coordinated backport batch with 8.2.4 and 8.1.6. `vitest` 4.1.12 (2026-10-15) is a v4 backport released right after 5.0.5, and holds the `V4` dist-tag.
- Each changelog names the fixes the advisories describe. The fixes were published before the advisories.
- The one difference I found: `vite` 7.3.7 carries 2 registry signatures under the same npm key, where 7.3.6 carries 1. Its sibling releases from the same batch carry 2 as well, and the signature verifies. I read it as registry-side and do not raise it.

## AR-1 after the merge
- **Position:** the `npm audit` set on `main` becomes the 3 pairs above. Every one was approved by the owner in `…193e08fb`. No pair is new. The set drops `vite`, which `…193e08fb` recorded as a `high` package, and on today's `main` that removes 1 npm-`high` pair (GHSA-587h).
- **Trigger clause (1), stated exactly:** the set will differ from `…193e08fb`'s recorded set, because it is a strict subset. So the re-read the ticket names is owed. It is a re-statement on a smaller set, not a new acceptance of anything.
- **Who:** the **Release Manager** (AR-1's owner) re-states AR-1 with the 3-pair set as the approved set, with trigger clause (1) unchanged. Accepting that set is the Orchestrator's under `…5aaf7cec` item 1, because it adds no HIGH. It does not go to the owner.
- **The interim accept:** the Orchestrator's interim LOW accept `…e4ef897b` covers only the 4 pairs that this change removes. It **ends at the merge**. If ABC-198 stops unmerged, it stands and the Orchestrator re-routes.
- **Left open for the re-statement, unchanged by this hop:** `…216ceb43`'s `UNKNOWN - verify` (vitest exposes no open-in-editor or dev-server socket). QE's `A7` probe in `qe-ABC-198` is the reading that settles it. It is not in the context at this writing. **If `A7` reads a count above 0,** that routes back to Security/NFR before merge. It does not revert this bump, which only removes advisories, and it does not change this A8 result. It reopens the reachability premise in AR-1's re-statement.

## NFR
- `NFR-008`: the triggers (tests, spawns) are not hit; 0 tests and 0 spawns are added. Whether the runner patch bump moves the lane's wall time is **`UNKNOWN - verify`**. That reading is owed to the next quiet-host timing hop. I do not rule it here, and no timing ran on this hop.
- No other NFR applies.

## Result
**PASS.** There is no required fix, no finding, and no accepted risk added by ABC-198. It is not `PASS_WITH_RISKS`: the open items are AR-1's pre-existing re-statement (owned by the Release Manager) and QE's `A7` (owned by QE), and neither is a risk this diff introduces.

**Owed:**
- **The Orchestrator:** move ABC-198 `In Security/NFR` → `Ready for UAT`, or merge under the UAT waiver (0 production lines), once QE's verdict is in. Re-read `git diff --numstat main...HEAD -- package-lock.json package.json` at merge time; it must still print `53	53	package-lock.json` and nothing for `package.json`, or clause (a) is re-read. Append the trace row. Order the merge relative to `ABC-178`'s B7/B8 timing hop.
- **The Release Manager:** re-state AR-1 on the 3-pair set after the merge.
- **QE:** `A7`. A non-zero count routes to Security/NFR before merge.
- **The next quiet-host timing hop:** the `NFR-008` reading on vitest 4.1.12.
