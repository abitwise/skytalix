---
id: 20261021T140436Z-security-nfr-decision-fff3ec2a
kind: decision
by: security-nfr
at: 2026-10-21T14:04:36Z
verified_by: 
confidence: high
refs:
  - ABC-172
  - EPIC-007
  - grugops/ABC-172
  - grugops/qe-ABC-172
  - 8af64abc
  - a0dc4135
  - 0bddbb43
  - 3e617b26
  - ABC-041
  - QE-172-a
  - AR-1
  - ABC-056
  - ABC-168
  - QE-172-b
  - QE-172-c
  - ABC-169
  - b3fecb1b
  - bapm-amend-ABC-168
  - 20261021T135939Z-qe-e2e-decision-933d8f15
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - ADR-0044
  - V15.1.1
  - V15.2.1
  - V15.2.4
supersedes: 
seal: sha256:94d926139ecd514132dda642d4a0b932a5928f1782e4feedf60fce415e926915
---

# ABC-172 Security/NFR result: PASS_WITH_RISKS, no required fix. Clause (a) confirmed; QE-172-a accepted as LOW and routed to ABC-168's lock regeneration; AR-1 re-statement owed (vite advisories)

The readings are in this task's observation note. I cite the ticket page's `## Scope` (two `name` fields, lock regenerated rather than hand-edited) and `## Security / NFR triggers` (clause (a) only; expected result: no finding) as authoritative. ASVS level L1, `block_on: high`. No compliance regime is set.

## Ruling 1: clause (a) is CONFIRMED with no finding
- I read the diff myself. It changes exactly the two lock `name` fields and the manifest `name`.
- No dependency, version, resolved URL, integrity hash, script or `bin` moves. Apart from the names, the lock is byte-identical to base.
- `npm ci --ignore-scripts` on the delivered lock (`a0dc4135`) exits 0 and leaves the lock untouched. QE got the same result in a real worktree install.
- Clauses (b), (c) and (d) do not fire: there is no `src/` change and no test change.
- Nothing at runtime reads the package name. QE checked this, and the diff gives it no new reader.
- **Supply chain: the rename lowers the dependency-confusion exposure.**
  - The old name `cli-chess` is a live third-party package on npm (1.0.4). A consumer that wrote it as a bare semver dependency would have fetched a stranger's code.
  - `skytalix` is unclaimed on npm, and the package is `"private": true`.
  - `V15.2.4` (dependency confusion) is L3, which is outside the L1 filter, so I record no finding.
  - **INFO, owner: the owner (the web backend is the web project's decision, `ADR-0044` D8):** the backend should take this package from its clone path or a git ref, never as a bare `"skytalix": "^x"` from the registry. Nothing is owed in this repository.

## Ruling 2: QE-172-a is ACCEPTED as LOW. It is not a supply-chain concern
- `packages[""].license` is metadata about the root package only. It carries no resolution, integrity or install effect: `npm ci` exits 0 without it, and no dependency entry depends on it.
- The missing line is drift left by ABC-169 (`b3fecb1b`), present at base. ABC-172 neither caused it nor widened it. QE's ruling that A2 is read literally stands.
- **Where it lands: ABC-168's lock change.** ABC-168 adds `bin` to `package.json`, and lockfile v3 records `packages[""].bin`, so ABC-168 has to regenerate the lock anyway. Regenerating with `npm install --package-lock-only` adds the license line by itself. ABC-168's lock criterion should name that line, so the diff is expected rather than flagged as noise. BA/PM's amendment of ABC-168 (`bapm-amend-ABC-168`) is in flight now, which is the cheapest moment to add it.
- **Fallback:** if ABC-168 is dropped, or its lock change is cut, the line lands as a one-line chore. It does not land nowhere: otherwise every future `npm install` re-adds it to someone else's diff.
- **Owner of the routing:** the Orchestrator (with BA/PM for ABC-168's criterion).

## Ruling 3: AR-1 trigger clause (1) FIRED. Re-statement owed; it does not block ABC-172
- **What fired:** today's `npm audit` set adds three `vite` 7.3.6 pairs (GHSA-698v-4r3x-3vcv, GHSA-r825-w8mm-5pxw, GHSA-587h-7wmj-h5pm; all high, from `launch-editor`, which `vite` bundles). They are not in `…901f43b6`'s table.
- **Why it does not block ABC-172:** the lock is unchanged apart from the names, so the drift came from the registry. It is pre-existing at base, and this change did not cause it.
- **Severity:**
  - The npm default is high.
  - **Contextual override to low, under AR-1's own reason, which is package-independent:** every audited package is a dev dependency, and no npm package loads on the runtime path. The premise checks this diff could move (1, 2, 3, 6, 7) read as recorded.
  - Two of the three advisories are Windows-only. The owner's host is macOS.
  - `launch-editor` is reached through vite's dev-server open-in-editor path. This repo starts vite only under vitest, and `vitest.config.ts` names no UI, browser or api server. **`UNKNOWN - verify`:** I did not prove that vitest exposes no open-in-editor endpoint. The Release Manager settles that in the re-statement.
- **Named owner: the Release Manager** (AR-1's owner).
  - Re-state AR-1 with the six pairs, per its own clause (1).
  - Or take the owner question already on record: a non-`--force` `npm audit fix` is now offered for all four packages.
- `V15.1.1` and `V15.2.1` [L1] are met under AR-1's documented override, with the re-statement owed.

## Result
**PASS_WITH_RISKS.** There is no required fix before merge, and no finding.

Accepted risks:
- **QE-172-a:** LOW, owner the Orchestrator, lands with ABC-168.
- **AR-1 re-statement:** owed, low after the override, owner the Release Manager.

Other items:
- **Dependency-confusion residual:** INFO, owner the owner.
- **QE-172-b and QE-172-c:** INFO, as QE ruled. Neither is a security matter.
- **NFRs:** none apply.
- **UAT:** the waiver holds (0 production lines).

The ticket moves `In Security/NFR` → `Ready for UAT`, or merges under the waiver. That move is the Orchestrator's.
