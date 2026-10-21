---
subtask: security-nfr-ABC-172
role: security-nfr
ticket: plans/tickets/ABC-172-rename-the-package-and-every-in-repo-name-to-skytalix.md
ref: .grugops/context/qe-ABC-172/
branch: grugops/qe-ABC-172 @ 8af64abc (main merged at a0dc4135; SE code 0bddbb43); QE worktree ../wt-qe-ABC-172 (read only)
width: 3 (beside qe-ABC-187 and bapm-amend-ABC-168)
---

# Security/NFR: ABC-172's `ABC-041` clause (a) short hop (manifest + lock)

The page names this a short hop: `ABC-041` clause (a) fires on `package.json` and `package-lock.json`. QE passed with gaps (verdict in `.grugops/context/qe-ABC-172/notes/` on the branch):
- **QE-172-a (LOW):** the lock lacks `packages[""].license: "UNLICENSED"`, which `package.json` declares since ABC-169. Regenerating at base already adds it, so it is ABC-169's residue, not this rename's; QE says it should land on its own.
- QE-172-b, QE-172-c: INFO.

## Decide
1. **Clause (a):** the diff changes only the two `name` fields; no dependency, version, resolved URL, integrity hash, script or `bin` moves. Confirm by reading the diff, and confirm `npm ci` on the delivered lock (QE/SE ran it on scratch copies).
2. **QE-172-a:** accept as LOW, or name where the license line lands (with ABC-168's lock change, a one-line chore, or nowhere) and whether it is a supply-chain concern at all.
3. **Verdict:** PASS / PASS_WITH_RISKS / FAIL, with any required fix.

## Fences
- Records only, plus a dated Security/NFR addendum on the ABC-172 page if you record one. No `package*.json`, `src/`, `AGENTS.md`, board, `plans/traceability.md` or worktree edits. No timing. Never push or merge.

## Publish
- Seal notes with the plugin writer (`installPath` of `grugops@grugops` in `~/.claude/plugins/installed_plugins.json` → `scripts/context-io.js` `admitAndAppend`, task `security-nfr-ABC-172`). **Pass the main checkout as the context root explicitly.** Take every `at` from `date -u`.
- Write `.grugops/queue/done/security-nfr-ABC-172.md` (brief + `## Result`) and `.claim.md`, uncommitted on main.
- **Trace row: exactly 10 cells, in header order**:
  `| ABC-172 (Security/NFR) | {what this hop did, one line} | {EPIC-nnn or —} | {F-nnn or —} | {NFR, ADR, AR and finding ids, or —} | {branch @ sha<br>files touched, or —} | {gates and test counts, or —} | {UAT verdict or waiver, or —} | {release tag, or —} | {column move or verdict} |`

## Result

**PASS_WITH_RISKS.** There are no required fixes and no finding. The notes are in `.grugops/context/security-nfr-ABC-172/notes/`:
- the readings: `…5dbc8cae` (observation);
- the result: `…216ceb43` (decision). It supersedes `…fff3ec2a`, which routed QE-172-a into ABC-168 before I had read ABC-168's `A12` fence.

There is no ABC-172 page addendum. The page's `## QE` section sits on `grugops/qe-ABC-172`, and an addendum on main would conflict with it at merge. The notes are the record. Nothing is committed. No timing was taken.

### 1. Clause (a): CONFIRMED, no finding
- **The diff:** `3e617b26..0bddbb43` changes `package.json:2` and lock `:2`/`:8`, all `name` values from `cli-chess` to `skytalix`. Nothing else moves: no dependency, version, `resolved`, `integrity`, script or `bin`. Apart from the names, the lock is byte-identical to base. The merge `a0dc4135` changes no manifest.
- **`npm ci`:** I ran `npm ci --ignore-scripts` on the delivered `a0dc4135` lock in an empty scratch directory. It exits 0, and the lock is untouched.
- **AR-1 premise checks 1, 2, 3, 6, 7:** they read as recorded.
- **Dependency confusion:** `cli-chess` is a third-party package on npm (1.0.4). `skytalix` is unclaimed (404), and the package is `private: true`, so the rename lowers the exposure. Owner of the residual, INFO: the owner. The backend should take the package by clone path or git ref, never as a bare registry semver.

### 2. QE-172-a: ACCEPTED as LOW. It is not a supply-chain concern
- The root `license` line is metadata only, with no resolution, integrity or install effect.
- **It does not land with ABC-168.** ABC-168's `A12` (merged `fc0cefac`) fences `package-lock.json` as unchanged, and its build `ticket-to-pr-ABC-168b` is already claimed.
- I measured ABC-168's `bin` + `uci` added at `a0dc4135`:
  - `npm ci` on the old lock exits 0, so `A12` holds.
  - Regenerating adds 4 root lines: `license` plus a 3-line `bin`. ABC-168 therefore widens the same drift, at INFO.
- **It lands in one `XS`/`P3` lock-regeneration chore, cut after ABC-168 merges.** Acceptance: the diff is exactly those 4 added root lines, no version, `resolved` or `integrity` value moves, and `npm ci` exits 0.
- If ABC-168 is dropped, the chore lands the `license` line alone.
- Owner: the Orchestrator, who cuts the chore through BA/PM.

### 3. AR-1 trigger clause (1): FIRED. It does not block ABC-172
- **What fired:** `npm audit` on 2026-10-21 reports 4 vulnerabilities (1 moderate, 3 high). It adds three `vite` 7.3.6 pairs: GHSA-698v-4r3x-3vcv, GHSA-r825-w8mm-5pxw and GHSA-587h-7wmj-h5pm. They come from `launch-editor`, which `vite` bundles.
- **The cause:** registry drift. The lock is identical to base, so ABC-172 did not cause it.
- **Severity:** the npm default is high. I override it to low under AR-1's package-independent reason: the packages are dev-only, and nothing from npm loads at runtime. Two of the three advisories are Windows-only.
- **`UNKNOWN - verify`:** that vitest exposes no open-in-editor endpoint here.
- **Owner: the Release Manager.** Re-state AR-1 with the six pairs, or take the existing owner question: a non-`--force` `npm audit fix` is now offered for all four packages.
- `V15.1.1` and `V15.2.1` [L1] are met under AR-1's override, with the re-statement owed.

### Owed
- **The Orchestrator:**
  - move ABC-172 `In Security/NFR` → `Ready for UAT`, or merge under the measured UAT waiver (0 production lines);
  - cut the post-ABC-168 lock chore (QE-172-a);
  - route the AR-1 re-statement to the Release Manager;
  - append the trace row below (10 cells, counted).
- **Unchanged:** QE-172-b and QE-172-c (INFO, as QE ruled).

### Trace row
| ABC-172 (Security/NFR) | ABC-041 clause (a) short hop on the rename: diff read (3 name lines only; lock = base bar names), `npm ci` rc 0 on delivered lock, AR-1 checks 1/2/3/6/7 as recorded; security-nfr-ABC-172 …5dbc8cae / …216ceb43 (supersedes …fff3ec2a) | EPIC-007 | — | ABC-041 (a) CONFIRMED, no finding; QE-172-a LOW accepted (owner Orchestrator; lands in an XS/P3 lock chore after ABC-168 merges: +4 root lines license + bin, measured; not in ABC-168, A12 fences the lock); AR-1 trigger (1) FIRED (vite 7.3.6 GHSA-698v/r825/587h new; low under AR-1 override; re-statement owed, owner Release Manager); dependency-confusion residual INFO (owner: owner); QE-172-b/c INFO; V15.1.1, V15.2.1 [L1] met | grugops/qe-ABC-172 @ 8af64abc (merge a0dc4135; code 0bddbb43; base 3e617b26)<br>package.json, package-lock.json (name only); records: context notes only | npm ci rc 0 (scratch, delivered lock); npm audit --omit=dev 0; npm audit 4 (1 moderate, 3 high, dev-only); no timing | UAT waiver holds (0 production lines) | — | Security/NFR PASS_WITH_RISKS: no required fixes; In Security/NFR → Ready for UAT (Orchestrator) |
