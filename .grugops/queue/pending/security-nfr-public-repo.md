---
subtask: security-nfr-public-repo
role: security-nfr
ticket: (owner action) public GitHub repo abitwise/skytalix
ref: .grugops/context/security-nfr-public-repo/
width: 3 of 3 (beside qe-ABC-203 and arch-design-ABC-204; read-only scans)
---

# Exposure review: the repository is now public

## Do
- **Secrets, full history of what is public** (`origin/main` and every ref on origin — `git ls-remote origin`): scan every commit reachable from those refs for credentials/tokens/private keys/`.env`-style files (use a scanner if one is installed, else a pattern sweep you name; do not install tools). Report hits with commit + path; classify real vs false positive (two known regex-string false positives are in old ABC-041 Security notes).
- **Personal data:** the owner's email in commit authors; absolute `/Users/olgeroeselg/...` paths in ~419 tracked files; anything else personal (hostnames, other people's data). Rate each; propose remedies, do not apply them. History rewrite needs a force push, which is forbidden to agents and the owner's call.
- **Licence position** (facts + options, the choice is the owner's): `"license": "UNLICENSED"`, `"private": true`, no LICENSE file, `src/evaluate.ts:16-19` CC BY-SA 3.0 values, the opening book's source/licence (ADR-0023), any other third-party content. What does publishing source under no licence mean, and what does CC BY-SA's ShareAlike imply for the options. Say plainly where it is `UNKNOWN - verify` / needs legal advice.
- **Posture:** what in ADR-0007, ADR-0018, ADR-0044 D8, EPIC-007 M10 / ABC-169, `45-standing-rulings.md` § Deployment posture and the runbook is now false. List them for the Architect's proposed ADR; do not edit them.
- Result: PASS / PASS_WITH_RISKS / FAIL, with severities. A HIGH risk goes to the owner.

## Fences
- Read-only. Work on `grugops/security-nfr-public-repo` (worktree `../wt-security-nfr-public-repo` from `main`) for notes and one report file under `.grugops/context/security-nfr-public-repo/`. No edits elsewhere. Never push, fetch with prune, force, amend or rebase; never merge into `main`; do not touch the remote. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/secpub/`. Seal notes with an explicit context root in your worktree.

## Publish
- Seal notes via the plugin writer (task `security-nfr-public-repo`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
