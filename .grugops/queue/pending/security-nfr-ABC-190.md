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
