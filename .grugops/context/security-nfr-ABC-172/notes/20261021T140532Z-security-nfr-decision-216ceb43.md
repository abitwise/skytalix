---
id: 20261021T140532Z-security-nfr-decision-216ceb43
kind: decision
by: security-nfr
at: 2026-10-21T14:05:32Z
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
  - QE-172-b
  - QE-172-c
  - AR-1
  - ABC-056
  - ABC-168
  - ABC-169
  - b3fecb1b
  - fc0cefac
  - ticket-to-pr-ABC-168b
  - 20261021T135939Z-qe-e2e-decision-933d8f15
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
  - 20261021T140436Z-security-nfr-observation-5dbc8cae
  - ADR-0044
  - V15.1.1
  - V15.2.1
  - V15.2.4
supersedes: 20261021T140436Z-security-nfr-decision-fff3ec2a
seal: sha256:63c7cb5b15069c84baafb2678de617200069a2fea912fde14335f435fc790c14
---

# ABC-172 Security/NFR result (re-issued): PASS_WITH_RISKS, no required fix. Clause (a) confirmed; QE-172-a accepted as LOW and lands in one lock-regeneration chore after ABC-168 merges (not inside ABC-168, whose A12 fences the lock); AR-1 re-statement owed (vite advisories)

This note supersedes `20261021T140436Z-security-nfr-decision-fff3ec2a`. Only Ruling 2's landing place changed: that note routed QE-172-a into ABC-168's lock change. Read after sealing, ABC-168's page `A12` (amended, merged `fc0cefac`) fences `package-lock.json` as unchanged, and its build hop `ticket-to-pr-ABC-168b` is already claimed. Rulings 1 and 3 and the result are unchanged.

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
- **ABC-168 will not regenerate the lock, and should not be re-opened for this.** Its `A12` says `package-lock.json` is unchanged.
  - My reading in scratch at `a0dc4135`: I added ABC-168's `bin` (`{"skytalix":"dist/uci.js"}`) and `scripts.uci`. `npm ci --ignore-scripts` on the unchanged lock exits 0 and leaves the lock untouched, so `A12` holds literally.
  - `npm install --package-lock-only` then adds 4 lines under `packages[""]`: `"license": "UNLICENSED"` plus a 3-line `"bin": {"skytalix": "dist/uci.js"}`. Lockfile v3 records the root `bin`.
  - So ABC-168 widens the same drift class (root metadata only; no resolution, integrity or install effect). This is INFO, not a security matter, and not a defect in ABC-168: its fence is a deliberate scope choice.
  - Changing ABC-168's criteria mid-build costs more than the line is worth.
- **Where it lands: one lock-regeneration chore, cut after ABC-168 merges.**
  - Acceptance: `npm install --package-lock-only --ignore-scripts`. The lock diff is exactly the root `license` line and the root `bin` block (4 added lines, 0 removed). No version, `resolved` or `integrity` value moves. `npm ci` exits 0.
  - One regeneration closes QE-172-a and ABC-168's `bin` drift together.
  - If ABC-168 is dropped, the same chore lands with the `license` line alone.
  - It does not land nowhere: otherwise every future `npm install` re-adds these lines to someone else's diff.
- **Owner:** the Orchestrator, who cuts the chore through BA/PM at ABC-168's merge, `XS`/`P3`.

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
- **QE-172-a:** LOW, owner the Orchestrator. It lands in the post-ABC-168 lock chore.
- **AR-1 re-statement:** owed, low after the override, owner the Release Manager.

Other items:
- **Dependency-confusion residual:** INFO, owner the owner.
- **QE-172-b and QE-172-c:** INFO, as QE ruled. Neither is a security matter.
- **NFRs:** none apply.
- **UAT:** the waiver holds (0 production lines).

The ticket moves `In Security/NFR` → `Ready for UAT`, or merges under the waiver. That move is the Orchestrator's.
