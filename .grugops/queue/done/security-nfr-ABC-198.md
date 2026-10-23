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

## Result

**PASS.** There is no required fix, no finding, and no accepted risk added by ABC-198. The notes are in `.grugops/context/security-nfr-ABC-198/notes/`, sealed by `context-io.js` `admitAndAppend` and read back through `readContext`:
- the readings: `20261022T161113Z-security-nfr-observation-fbe0c143`;
- the result: `20261022T161122Z-security-nfr-decision-0f626230`.

Nothing is committed. npm ran only in fresh scratch clones under the session scratchpad (base `4952425a`, tip `ef1d5ebc`, and a regeneration clone at base), with a scratch npm cache.

### Clause (a): CONFIRMED, no finding
- The lock diff `4952425a..a42f4bbb` is numstat `53 53`, and `package.json` is byte-equal. There are 123 entries at both ends, 0 added and 0 removed, and exactly the 10 packages differ. The other 113 entries are deep-equal.
- Inside the 10, only `version`, `resolved`, `integrity` and the in-family `4.1.11` → `4.1.12` pins move. The one other change, `vitest`'s peer `@vitest/browser-webdriverio` → `^4.1.11`, is as published.
- Every `resolved` is on `registry.npmjs.org`. `hasInstallScript` is unchanged (`esbuild`, `fsevents` only), there is no new `bin`, and none of the 10 has a lifecycle script.
- **Integrity against the registry: 10 of 10 MATCH**, on both `dist.integrity` and `dist.tarball`. `npm audit signatures` verifies 66 of 66 at base and at tip.
- The regeneration from base is `cmp`-equal to the tip lock. `npm ci --ignore-scripts` exits 0 with a clean tree at both ends.
- Clause (c) does not fire: the one `src/` change is the test literal `CAPTURE_ARM_READ_ON_VITEST` `"4.1.11"` → `"4.1.12"`.

### Audit, pair by pair
- **Base** (total 7): 10 pairs and 3 via rows: `@vitest/mocker` GHSA-qxg6 and GHSA-xp26; `vite` GHSA-587h, GHSA-698v, GHSA-9jrq, GHSA-r825 and GHSA-rq7h; nanoid GHSA-2v37; postcss GHSA-fxqj; source-map-js GHSA-68fv; and `vitest via:@vitest/mocker`, `vitest via:@vitest/coverage-v8`, `@vitest/coverage-v8 via:vitest`.
- **Tip** (total 3, `{moderate 1, high 2}`): nanoid GHSA-2v37-7h3g-55p8, postcss GHSA-fxqj-rqcc-2cmp and source-map-js GHSA-68fv-2mgg-jv7q.
- Base minus tip is exactly the 7 pairs and 3 via rows. Tip minus base is empty. `--omit=dev` is 0 at both ends. All 3 tip pairs are in AR-1's approved set `…193e08fb`.

### Supply chain: normal upstream patch releases
- All 10 are published by GitHub Actions trusted publishing, with SLSA provenance and the same maintainers and publisher pattern as the versions they replace.
- `vite` 7.3.7 (2026-10-06) is a backport batch with 8.2.4 and 8.1.6. `vitest` 4.1.12 (2026-10-15) is a v4 backport released right after 5.0.5, and holds the `V4` tag. Each changelog names the advisories' fixes, and the fixes predate the advisories.
- **One difference, read and not raised:** `vite` 7.3.7 carries 2 registry signatures under npm's one current key, where 7.3.6 carries 1. Its batch siblings carry 2 as well, and the signatures verify.

### AR-1 after the merge
- `main`'s audit set becomes the 3 pairs above, all previously approved by the owner (`…193e08fb`). Nothing is new, and `vite` drops out.
- The set is a strict subset of `…193e08fb`'s, so trigger clause (1) owes a re-read. **The Release Manager re-states AR-1** with the 3-pair set, trigger (1) unchanged. Accepting that is the Orchestrator's under `…5aaf7cec` item 1, because it adds no HIGH.
- **The Orchestrator's interim accept `…e4ef897b` ends at the merge.** If ABC-198 stops unmerged, it stands.
- `…216ceb43`'s open point (no dev-server socket on a plain vitest run) is QE's `A7`, not yet in the context. A count above 0 routes to Security/NFR before merge. It does not revert the bump or change this result; it reopens the reachability premise in the re-statement.

### NFR
- `NFR-008`'s triggers are not hit (0 tests and 0 spawns added). Whether the bump moves the lane's wall time is **`UNKNOWN - verify`**, owed to the next quiet-host timing hop. I do not rule it.

### Owed
- **The Orchestrator:**
  - move `In Security/NFR` → `Ready for UAT`, or merge under the UAT waiver (0 production lines), once QE's verdict is in;
  - at merge, re-check that `git diff --numstat main...HEAD -- package-lock.json package.json` prints only `53	53	package-lock.json`;
  - append the trace row below;
  - order the merge relative to `ABC-178`'s B7/B8 timing hop.
- **The Release Manager:** re-state AR-1 on the 3-pair set after the merge.
- **QE:** `A7`.

### Fence
- **No breach.** I read only the repository and branches. I wrote only this task's two context notes and these two done records, in main's tree, uncommitted.
- The pending file and the claim directory were left as they were. No `src/`, `package*.json`, `plans/`, `AGENTS.md`, `memory-bank/`, branch, worktree or git config was touched. No other hop's files were touched.

| ABC-198 (security-nfr-ABC-198) | Security/NFR clause (a) hop (A8) on the in-range lock bump: lock diff read (53 53; 123 entries both ends, 0 added/removed, exactly 10 differ: vitest family 4.1.11 → 4.1.12, vite 7.3.6 → 7.3.7; only version/resolved/integrity + in-family pins; all resolved on registry.npmjs.org; no new hasInstallScript or bin); integrity vs registry 10/10; audit pair by pair; supply-chain read; clause (c) on the one test literal | EPIC-007 | — | clause (a) CONFIRMED, no finding; audit base 13 rows (total 7) → tip 3 pairs (total 3), minus exactly 7 pairs + 3 via rows, nothing added, --omit=dev 0; tip 3 pairs (nanoid GHSA-2v37, postcss GHSA-fxqj, source-map-js GHSA-68fv) all in AR-1 approved set …193e08fb; releases normal upstream patch backports (trusted publishing, SLSA provenance, same maintainers; vite 7.3.7 2 sigs like its batch siblings, verified); clause (c) not fired; V15.1.1, V15.2.1 [L1] met under AR-1; NFR-008 wall time UNKNOWN - verify (next quiet-host timing hop); notes fbe0c143, 0f626230 | grugops/ABC-198 @ ef1d5ebc (lock a42f4bbb; base 4952425a) read only; QE merge 24f32527 same lock<br>.grugops/context/security-nfr-ABC-198/ (2 notes), uncommitted | scratch clones base/tip/regen, scratch npm cache: npm ci --ignore-scripts rc 0 clean x2; .bin identical (11); regen cmp-equal (5d48a904…); npm view dist.integrity + dist.tarball MATCH 10/10; npm audit signatures 66/66 verified x2; npm audit pairs comm -23 = 7 + 3 via, comm -13 empty; no timing | UAT waiver expected (0 production lines; QE confirms) | — | Security/NFR PASS: no required fix; In Security/NFR → Ready for UAT (Orchestrator); AR-1 re-stated by Release Manager on 3-pair set after merge, interim accept …e4ef897b ends at merge; QE A7 non-zero routes back before merge |
