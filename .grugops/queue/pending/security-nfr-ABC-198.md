---
subtask: security-nfr-ABC-198
role: security-nfr
tickets: [ABC-198]
branch: grugops/ABC-198 (tip ef1d5ebc; lock a42f4bbb; base 4952425a); read only
ref: .grugops/context/security-nfr-ABC-198/
width: 2 (beside qe-ABC-198)
---

# Security/NFR: A8 on ABC-198, clause (a) on the lock diff (10 packages: vitest family 4.1.11 → 4.1.12, vite 7.3.6 → 7.3.7). Records only

## Read first
- The ticket page `plans/tickets/ABC-198-four-new-dev-only-advisories-on-vitest-4-1-11-and-vite-7-3-6-and-an-in-range-lock-bump-clears-them.md` (A8, § Who re-states AR-1, § Security / NFR triggers); BA/PM `bapm-cut-AR-1-drift` notes; your own `security-nfr-ABC-190` (`…140008ff`, `…56bf0b02`) and `security-nfr-ABC-172` `…216ceb43`; Orchestrator `…e4ef897b`; SE notes on the branch (`…f4334765` A1–A3); `AGENTS.md` (`RISK-ABC143-01`); the owner delegation `…5aaf7cec`.

## Do
- Read the lock diff (`git diff 4952425a a42f4bbb -- package-lock.json`): only `version`/`resolved`/`integrity` and the in-family pins move; every `resolved` is on registry.npmjs.org; there is no new package, no new install script (`hasInstallScript`) and no new `bin`. Compare the integrity hashes against the registry (`npm view <pkg>@<ver> dist.integrity`) for all 10.
- Audit set pair by pair, base vs tip, on scratch clones: 7 pairs and 3 via rows removed, nothing added. The remaining 3 are all in AR-1's approved set.
- Supply-chain read: are the 4.1.12 / 7.3.7 releases normal upstream patch releases (publish date, maintainer, changelog)? Note anything unusual.
- Rule PASS / PASS_WITH_RISKS / BLOCKED. State the AR-1 position after the merge (3 pairs, all previously approved; the Orchestrator's interim accept `…e4ef897b` ends at the merge) and who re-states it. Whether this bump moves NFR-008's wall time is `UNKNOWN - verify`, owed to the next quiet-host timing hop. Say so, and don't rule it.

## Fences
- Records only: your notes (context root: this repository's `.grugops/context`) and done record. No `src/`, `package*.json`, `plans/`, `AGENTS.md`, `memory-bank/`, branches, worktrees, git config. Commit nothing. npm only in scratch clones in your scratch area.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-ABC-198`). Every `at` from `date -u`. Include a `kind: decision`. No `finding`.
- Trace row (10 cells, plain table line) in your done record `.grugops/queue/done/security-nfr-ABC-198.md` (this brief plus `## Result`) and `.claim.md`, main's tree, uncommitted. Leave this pending file and the claim directory alone.
