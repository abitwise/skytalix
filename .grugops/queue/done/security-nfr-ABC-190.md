---
subtask: security-nfr-ABC-190
role: security-nfr
tickets: [ABC-190]
branch: grugops/qe-ABC-190 (tip a0b42688; contains the SE tip d79f4684, lock commit 15766056; base 823a9885); read only
ref: .grugops/context/security-nfr-ABC-190/
width: 3 (beside ticket-to-pr-ABC-178b and qe-ABC-189)
---

# Security/NFR: the clause (a) hop owed on ABC-190, a `package-lock.json` edit (root `license` + `bin`, +4 −0). Records only

## Read first
- ABC-190's page (§ Security / NFR triggers; the `## QE` section on `grugops/qe-ABC-190`); your own `security-nfr-ABC-172` `…decision-216ceb43` (Ruling 2, the close condition for QE-172-a; Ruling 3, AR-1 is the Release Manager's) and `security-nfr-ABC-168` `…75a45be0` § 3; QE `qe-ABC-190` notes (verdict `…d21b9a3a`); SE `ticket-to-pr-ABC-190` notes.
- `AGENTS.md`, `memory-bank/45-standing-rulings.md`, `plans/nfr-catalog.md`; the owner delegation `…5aaf7cec` (LOW/MEDIUM acceptances are the Orchestrator's; a HIGH goes to the owner).

## Do
- Read the lock diff as clause (a) requires: `git diff 823a9885 15766056 -- package-lock.json`. Confirm it is root metadata only, with no dependency, version, `resolved` or `integrity` change and no new install-time surface. Does `bin` in the lock root change what `npm install`/`npm ci` does on a consumer's machine? This package is private and never published.
- Confirm `npm audit` is unchanged (7 at both ends) from QE's evidence, or by your own run in a scratch clone (never in main's checkout). AR-1 is not re-stated.
- Rule PASS / PASS_WITH_RISKS / BLOCKED, with any required fix or accepted risk. Say whether QE-172-a closes at this merge.

## Fences
- Records only: your notes (context root: this repository's `.grugops/context`) and done record. No `src/`, `package*.json`, `plans/`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing. npm only in scratch clones.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-ABC-190`). Every `at` from `date -u`. Include a `kind: decision`. Append-only; no `finding` (human_admission off).
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/security-nfr-ABC-190.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.

## Result

**PASS.** There is no required fix and no finding, and ABC-190 adds no accepted risk. The notes are in `.grugops/context/security-nfr-ABC-190/notes/`, sealed by `context-io.js` `admitAndAppend` and read back through `readContext`:
- the readings: `20261022T153729Z-security-nfr-observation-56bf0b02`;
- the result: `20261022T153804Z-security-nfr-decision-140008ff`.

Nothing is committed. npm ran only in scratch clones under the session scratchpad (base `823a9885`, lock `15766056`, tip `a0b42688`).

### Clause (a): CONFIRMED, no finding
- The lock diff is +4 −0 under `packages[""]`: the root `license` line and the `bin` block. It is structurally verified: 122 non-root entries are deep-equal, and no version, `resolved`, `integrity`, `engines` or dependency value moves.
- The regeneration from base is `cmp`-equal to the tip lock. `npm ci` exits 0 with a clean tree, both with `--ignore-scripts` and with scripts on.
- **The root `bin` in the lock has no install effect.** It is never linked into this project's own `node_modules/.bin` (0 entries, measured). A consumer never reads this lock: it is root-only, and the package is private and unpublished. A consumer's `bin` comes from `package.json`, which has carried it since ABC-168 (`AR-168-BINPIN`, unchanged). There are no lifecycle scripts.
- No NFR applies (`NFR-008` is not triggered).

### `npm audit`: 7 = 7 (JSON-equal at base, lock and tip; `--omit=dev` 0)
QE's figure reproduces. **But the 7 is not the set the owner approved for AR-1** (`…193e08fb`, 4 packages and 6 pairs), so AR-1 trigger clause (1) has fired again.
- **New pairs:**
  - vite GHSA-9jrq-w75r-8gcw (low) and GHSA-rq7h-c2jc-7f22 (moderate);
  - @vitest/mocker GHSA-qxg6-89mg-rqv8 and GHSA-xp26-3454-mjgp (both moderate);
  - vitest and @vitest/coverage-v8 as via-only rows.
- There is no new high pair, and none of the 4 ids was on record before.
- **Cause:** registry drift. It is live on `main`, ABC-190 did not cause it, and it does not block ABC-190.
- **Severity:** the npm default is moderate/low. It is low under AR-1's dev-only reason, and every new id needs a running Vite dev server, which this repository never starts in its source or config. `UNKNOWN - verify` (carried from `…216ceb43`): a plain vitest run opens no dev-server socket.
- **Owner:** the re-read belongs to the Release Manager. Accepting the delta is the Orchestrator's to take or route under `…5aaf7cec` item 1, because it adds no HIGH pair.
- **Option:** `@vitest/mocker` 4.1.12 is inside `vitest`'s `~4.1.11` range. A lock-only bump would clear the two vitest ids, as its own ticket. ABC-190 fences it out.
- I do not re-state AR-1.

### QE-172-a: closes at ABC-190's merge
`…216ceb43` Ruling 2's condition is met at `15766056` and `a0b42688`. The Orchestrator closes it on merge, provided `git diff --numstat main...HEAD -- package-lock.json` still prints `4 0`. Today `main` `180ed863` has the base lock, and no parallel branch touches `package*.json`. ABC-168's root-`bin` drift (`…75a45be0` § 3) closes with it.

### Owed
- **The Orchestrator:**
  - move `In Security/NFR` → `Ready for UAT`, or merge under the UAT waiver (0 production lines);
  - close QE-172-a at the merge;
  - append the trace row below;
  - take or route the AR-1 delta.
- **The Release Manager:** the AR-1 re-read, if it is routed there.

### Fence
- **No breach.** I read only the repository and branches. I wrote only this task's context notes and these two done records, in main's tree, uncommitted.
- The pending file and the claim directory were left as they were. No `src/`, `package*.json`, `plans/`, `AGENTS.md`, `memory-bank/`, branch, worktree or git config was touched. No other hop's files were touched.

| ABC-190 (security-nfr-ABC-190) | Security/NFR clause (a) hop on the lock regeneration: diff read (+4 −0, root license + bin only; 122 non-root entries deep-equal), regeneration cmp-equal from base, root bin has no install effect (not linked locally; lock never read by a consumer); audit 7 = 7 re-run | EPIC-007 | — | clause (a) CONFIRMED, no finding; QE-172-a closes at merge (…216ceb43 R2 met; proviso numstat 4 0 at merge); AR-1 trigger (1) FIRED again on main (registry drift, pre-existing: vite GHSA-9jrq/rq7h, @vitest/mocker GHSA-qxg6/xp26 new, no new high; low under AR-1 override; re-read owner Release Manager, delta acceptance Orchestrator per …5aaf7cec); V15.1.1, V15.2.1 [L1] met under AR-1; NFR-008 not triggered; notes 56bf0b02, 140008ff | grugops/qe-ABC-190 @ a0b42688 (lock 15766056; base 823a9885) read only<br>.grugops/context/security-nfr-ABC-190/ (2 notes), uncommitted | scratch clones base/lock/tip: npm ci --ignore-scripts rc 0 clean x3; npm ci scripts-on rc 0, 0 skytalix in .bin; regen 4 0, cmp-equal (6ffeccdf…); npm audit 7 (4 mod/3 high) JSON-equal x3; --omit=dev 0; no timing | UAT waiver holds (0 production lines, per QE) | — | Security/NFR PASS: no required fix; In Security/NFR → Ready for UAT (Orchestrator); QE-172-a closes on merge |
