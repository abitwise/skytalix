---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T14:33:16Z
subtask: sec-host-paths
role: security-nfr
ref: .grugops/context/sec-host-paths/
branch: grugops/sec-host-paths — worktree .claude/worktrees/sec-host-paths (from main)
width: read-only scans; any run under `flock /tmp/claude-1000/-home-olger-projects-public-skytalix/20e3c19a-6adf-40ba-b854-737faf426551/scratchpad/host-test.lock <cmd>`. No history rewriting.
---
# Review: host paths in committed records (QE-273-b, LOW)
The repo is public. qe-ABC-273 (gaps …334a1bf6 in .grugops/context/qe-ABC-273) found: tools/rating/rating.ts writes raw host paths into cmd.txt/machine.txt for r and d runs (rpair redacts); ~106 committed files under .grugops/context carry the home path (101 in raw/ dirs); briefs carry the scratch lock path.
Assess: what is exposed (user name, directory layout; any secrets/tokens/emails? scan for them too), severity, and the required fixes vs accepted risks. Do NOT rewrite git history (force-push is forbidden; history stays). Recommend: (a) a tools fix (redact in r/d like rpair), (b) a forward rule for records (redact before commit; a lint/check), (c) whether existing committed files get a redaction commit. Write a findings note; hand ticket text to BA/PM.
Fences: your records only. No src/tools edits. No push, force, amend, rebase, merge into main.
Publish: sealed notes (task sec-host-paths, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result; brief + claim to done/.

## Result
by: security-nfr (claude-opus-5-5), at: 2026-11-03T14:48:35Z. Read-only scans under the host lock; no src/tools edit; nothing pushed; history untouched.
- **Result: PASS_WITH_RISKS.** 0 credentials, 0 HIGH (`security.block_on` high, nothing blocks).
- **Credentials: 0** in the 1,497 commits since the last sweep (`2e67a4b5`; HEAD + 11 local remote-tracking refs, every commit message, 7,929 text blobs, 7,649 paths) and in all 192 `.gz` blobs decompressed. Positive control fired 27/27 rules, path rule 4/4. Emails at tip: AI co-author noreply, a bundled-licence maintainer, the SSH remote form and a `.invalid` fixture; the owner's address appears in 0 tip blobs (still on commit metadata, SEC-PUB-2). ADR-0049 D4's "no creds" condition still MET.
- **SEC-HP-1 LOW** (risk owner Olger Oeselg; L2 default MEDIUM overridden, reason: own public name + layout, no secret, same class as SEC-PUB-3): the home path in **816 tip files** in three forms: literal in 109 text files (106 context, 101 in `raw/`) **plus 15 `.gz` files `git grep` cannot see**; slug form in 322; scratch path in 739. 812 are already in `origin/main`. It reveals the account name (already public), the uid, the layout, 12 local session ids, no secret. Breaches ADR-0049 D4 "no personal path" (first occurrence `3ad6bc10`, 2026-10-29). Sources: `rating.ts` r/d (4 files), hand-written agent scripts with literal paths (most), captured tool output, briefs (lock path), `install.json`.
- **SEC-HP-2 LOW**: one foreign private-project process argv is public (`se-ABC-262/raw/gates/summary.txt` line 5, from `pgrep -af`): another private project's folder and repo name and its toolchain; no infra, no creds. Recurrence of the SEC-PUB-1 class.
- **SEC-HP-3 INFO**: the hostname as the reference-machine label, ruled by the owner (`…c2752305`); no action.
- **(a) REQUIRED:** `rating.ts` r/d redact all records like rpair before `SHA256SUMS`; the executed argv stays byte-equal. **(b) REQUIRED:** a placeholder rule (`<home>` `<repo>` `<scratch>` …, foreign processes as count/class only, briefs write `<scratch>/host-test.lock`) and a diff-scoped records path check (`.gz` included) in the gate. **(c)** No bulk redaction of existing files (ACCEPTED, owner Olger Oeselg: no recall, 812 already public, sealed notes, LOW). Targeted one-line SEC-HP-2 redaction RECOMMENDED (unsealed, no checksum); the owner may decline.
- **Ticket text for BA/PM:** T1 (r/d redact, AC1–AC4) and T2 (records path check + rule, AC1–AC4), in decision note `…72b4070b`.
- **UNKNOWN - verify (owner, needs remote):** remote refs = local copies; provider secret scanning; forks/clones.
- **Notes:** `sec-host-paths` `20261103T144802Z-security-nfr-observation-acbfc4d3` (scan), `20261103T144802Z-security-nfr-observation-45ef018a` (exposure), `20261103T144802Z-security-nfr-decision-72b4070b` (result, ticket text).
