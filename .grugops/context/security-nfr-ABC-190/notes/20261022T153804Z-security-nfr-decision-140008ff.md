---
id: 20261022T153804Z-security-nfr-decision-140008ff
kind: decision
by: security-nfr
at: 2026-10-22T15:38:04Z
verified_by: 
confidence: high
refs:
  - ABC-190
  - EPIC-007
  - QE-172-a
  - ABC-168
  - ABC-172
  - AR-1
  - ABC-056
  - AR-168-BINPIN
  - grugops/ABC-190
  - grugops/qe-ABC-190
  - 823a9885
  - 15766056
  - d79f4684
  - a0b42688
  - 180ed863
  - 20261022T153729Z-security-nfr-observation-56bf0b02
  - 20261021T140532Z-security-nfr-decision-216ceb43
  - 20261021T143943Z-security-nfr-decision-75a45be0
  - 20261021T161340Z-orchestrator-decision-193e08fb
  - 20261022T153220Z-qe-e2e-decision-d21b9a3a
  - 20261022T153005Z-qe-e2e-observation-6e8cf84f
  - 20261022T152415Z-software-engineer-decision-723e5ad8
  - 20261022T140148Z-orchestrator-decision-5aaf7cec
  - GHSA-9jrq-w75r-8gcw
  - GHSA-rq7h-c2jc-7f22
  - GHSA-qxg6-89mg-rqv8
  - GHSA-xp26-3454-mjgp
  - NFR-008
  - V15.1.1
  - V15.2.1
supersedes: 
seal: sha256:f93ef3fccf722b77c5bb92ba341428ab2c0755986315fca9e33e07a912a258b8
---

# ABC-190 Security/NFR result: **PASS**. No required fix, and no accepted risk owed by this change. Clause (a) is confirmed: root metadata only, with no install effect. QE-172-a closes when ABC-190 merges. **Separately: AR-1 trigger clause (1) has fired again on `main`** (4 new moderate/low advisory pairs, from registry drift). That re-read is owed by AR-1's owner and does not block ABC-190

The readings are in `20261022T153729Z-security-nfr-observation-56bf0b02`. I cite ABC-190's `## Scope` (one command, one file, regenerated rather than hand-edited) and `## Security / NFR triggers` (clause (a) only; expected result: no finding; closes QE-172-a when it merges) as authoritative. ASVS L1, `block_on: high`, `compliance_regime` empty, `human_admission` off, so there is no `finding`.

## Ruling 1: clause (a) is CONFIRMED, with no finding
- The lock diff `823a9885..15766056` is exactly +4 -0 under `packages[""]`: the root `license` line and the root `bin` block. I read it myself and checked it structurally. No dependency, version, `resolved`, `integrity`, `engines` or `devDependencies` value moves, and all 122 non-root entries are deep-equal to base.
- The regeneration reproduces byte-for-byte from base. `npm ci` exits 0 with a clean tree, both with `--ignore-scripts` and with scripts on.
- **The root `bin` in the lock changes nothing `npm install` or `npm ci` does on any machine.**
  - Here, the root project's `bin` comes from `package.json` and is never linked into its own `node_modules/.bin` (measured: 0 entries).
  - For a consumer, this lock is never read: npm ignores a `package-lock.json` that is not at the root project, and the package is private and never published. A consumer gets `bin` from `package.json`, where it has been since `ABC-168` and where it was reviewed (`…75a45be0` § 3, § 5 `AR-168-BINPIN`, owner the Orchestrator, unchanged by this diff).
  - There are no lifecycle scripts.
- So there is no new install-time surface. `V15.1.1` and `V15.2.1` [L1] stand exactly as they did at ABC-172 and ABC-168: met under AR-1's documented override.
- Clauses (b), (c) and (d) do not fire: there is no `src/` and no test change.
- **NFRs:** none apply. `NFR-008` is not triggered (0 tests, 0 spawns), as the page says.

## Ruling 2: QE-172-a closes at the merge of ABC-190
- **The close condition** from `…216ceb43` Ruling 2: the lock diff is exactly the root `license` line and the root `bin` block (+4 -0), no version/`resolved`/`integrity` value moves, and `npm ci` exits 0. That is met at `15766056` and at QE's merge `a0b42688`, from my own reads.
- **It is CLOSED when the Orchestrator merges ABC-190 to `main`**, provided `git diff --numstat main...HEAD -- package-lock.json` still prints `4 0` at merge time.
  - Today `main` `180ed863` has the base lock, and none of the parallel branches (`grugops/ABC-178`, `grugops/ABC-189`, `grugops/qe-ABC-189`) touches `package.json` or the lock.
  - If `main`'s lock has moved by merge time, re-read clause (a) before closing.
- ABC-168's root-`bin` drift (`…75a45be0` § 3, INFO) closes with it.

## Ruling 3: AR-1 trigger clause (1) FIRED again. A re-read is owed by AR-1's owner; it is not ABC-190's and does not block it
- **What fired:** the brief says "AR-1 is not re-stated", and I do not re-state it. But the 7-package set that QE and SE recorded is not the 4-package, 6-pair set the owner approved on 2026-10-21 (`…193e08fb`). Clause (1) asks for a re-read whenever the (package, advisory) set differs.
- **The new pairs:**
  - vite: GHSA-9jrq-w75r-8gcw (low) and GHSA-rq7h-c2jc-7f22 (moderate);
  - @vitest/mocker: GHSA-qxg6-89mg-rqv8 and GHSA-xp26-3454-mjgp (both moderate);
  - vitest and @vitest/coverage-v8 appear as via-only rows (moderate).
- **There is no new high pair.** None of the 4 ids was on record anywhere before my observation note.
- **Why it does not block ABC-190:** it is registry drift. The lock has not moved since ABC-168, and the set is byte-equal at base and tip. It is live on `main` today, whether or not ABC-190 merges.
- **Severity:**
  - npm's default for the delta is moderate (3 pairs) and low (1 pair).
  - Under AR-1's own package-independent reason, the contextual severity is low: every audited package is a dev dependency, and `npm audit --omit=dev` finds 0.
  - The delta's specific preconditions are a running Vite dev server, with `mockerPlugin`/`interceptorPlugin` for the two vitest ids, and Windows for GHSA-xp26. The repository has none of those in its source or config.
  - **`UNKNOWN - verify`** (carried from `…216ceb43`, still not proved): that a plain vitest run opens no dev-server socket.
- **Owner:** the **Release Manager**, AR-1's owner, for the re-read.
  - Under the owner's delegation `…5aaf7cec` item 1, **accepting this delta is the Orchestrator's to take or to route.** It adds no HIGH pair, so it does not go to the owner under item 3.
  - **Option on record:** `fixAvailable: true`. `@vitest/mocker` 4.1.12 fixes both vitest ids, and `vitest`'s `~4.1.11` range already admits it, so a lock-only bump would clear those two pairs. That would be its own ticket, with clause (a) and QE hops. ABC-190's page fences it out.

## Result
**PASS.** There is no required fix and no finding. ABC-190 adds no accepted risk.
- **Why not PASS_WITH_RISKS:** the only open risk item, AR-1's re-read, is pre-existing, already owned, and independent of this diff. I name it loudly here so that a clean result on ABC-190 is not read as a clean audit on `main`.

**Owed:**
- **The Orchestrator:**
  - move ABC-190 from `In Security/NFR` to `Ready for UAT`, or merge it under the UAT waiver (0 production lines, as QE read it);
  - close QE-172-a at the merge, under Ruling 2's proviso;
  - append the trace row;
  - take or route the AR-1 delta (Ruling 3).
- **The Release Manager:** the AR-1 re-read with the 10-pair set, when the Orchestrator routes it.
