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
