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
- **Personal data:** the owner's email in commit authors; absolute `<home path>` paths in ~419 tracked files; anything else personal (hostnames, other people's data). Rate each; propose remedies, do not apply them. History rewrite needs a force push, which is forbidden to agents and the owner's call.
- **Licence position** (facts + options, the choice is the owner's): `"license": "UNLICENSED"`, `"private": true`, no LICENSE file, `src/evaluate.ts:16-19` CC BY-SA 3.0 values, the opening book's source/licence (ADR-0023), any other third-party content. What does publishing source under no licence mean, and what does CC BY-SA's ShareAlike imply for the options. Say plainly where it is `UNKNOWN - verify` / needs legal advice.
- **Posture:** what in ADR-0007, ADR-0018, ADR-0044 D8, EPIC-007 M10 / ABC-169, `45-standing-rulings.md` § Deployment posture and the runbook is now false. List them for the Architect's proposed ADR; do not edit them.
- Result: PASS / PASS_WITH_RISKS / FAIL, with severities. A HIGH risk goes to the owner.

## Fences
- Read-only. Work on `grugops/security-nfr-public-repo` (worktree `../wt-security-nfr-public-repo` from `main`) for notes and one report file under `.grugops/context/security-nfr-public-repo/`. No edits elsewhere. Never push, fetch with prune, force, amend or rebase; never merge into `main`; do not touch the remote. Temp files only in `<scratchpad>`. Seal notes with an explicit context root in your worktree.

## Publish
- Seal notes via the plugin writer (task `security-nfr-public-repo`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**PASS_WITH_RISKS. 0 real secrets, 0 HIGH, and 2 MEDIUM, both since disposed by the owner.** (Security/NFR, 2026-10-23.)

*This section was rewritten on 2026-10-24 by task `security-nfr-public-repo-redacted`. Each exposure is now described by class
and count only. The detailed notes are on `grugops/security-nfr-public-repo` @ `5fd5ee65`, which is held: local only and never
merged. The notes that can merge are in `.grugops/context/security-nfr-public-repo-redacted/`.*

- **Scope.** `git ls-remote origin` (read-only) shows 1 public ref, the default branch at `55a8f4ef`, with no tags. Every object
  reachable from it was swept: 3,056 commits and 13,619 blobs. The commit messages and the then-unpushed 30 commits were swept too.
- **Method.** No scanner is installed, and none was installed. The 2026-10-23 sweep used 22 strict credential rules, 2 loose
  rules, 5 personal-data rules and a secret-file path rule, with a positive-control canary first. It was re-run on 2026-10-24
  with 8 more strict rules and a corrected path rule (see the redacted task's scan note).
- **Secrets: 0 real.**
  - Strict rules: 0 credential values. Path rule: 0 files.
  - Every candidate is a false positive: loose code identifiers; 2 old regex strings in Security notes; 2 QE planted canaries;
    shell variable references; secret *names*; reserved example-domain fixtures.
- **SEC-PUB-1, MEDIUM. Owner: Olger Oeselg. ACCEPTED 2026-10-24 on condition "no creds"; the condition is met.**
  - The `SEC-177-1` redaction was tip-only, so 108 public history blobs still hold process captures from a different, private
    project. By class: 1 internet hostname naming 1 realm, 1 private LAN address with an API port, 1 cluster context,
    3 namespaces, 5 in-cluster service names and 2 secret names. There is no credential value.
  - No history rewrite and no force push. Owner-side suggestion, not a gate: confirm that the identity provider's admin console
    is not reachable from the internet.
- **LIC-PUB-1, MEDIUM. Owner: Olger Oeselg. CLOSED.**
  - ADR-0044 D13's "re-derive before any distribution" precondition was breached by publication.
  - It closed when ADR-0048 was ACCEPTED (Apache-2.0, with the CC BY-SA tables carved out in `NOTICE`) and ABC-214 merged at
    `59f50717`.
  - Residual, INFO: 3 unattributed historical versions stay in history. Legal effect: `UNKNOWN - verify`.
- **LOW:**
  - SEC-PUB-2: the owner's email address on all commits;
  - SEC-PUB-3: an absolute home-directory path in 419 tip files, naming 3 other local projects;
  - SEC-PUB-4: 2 machine hostnames, the hardware model and the time-zone offset.
- **INFO:**
  - no third-party personal data;
  - the kit is MIT under the owner's own copyright.
- **Posture.** 28 now-false statements went to Architect/Design. They are now in ADR-0049 (PROPOSED, the owner's). What fired:
  ADR-0007 `D3` and its § Pointers 2026-10-11 trigger (branch protection is now a real `UNKNOWN`); ADR-0018 Decision 3 and `D3`;
  ADR-0044 D8, D13 and the D13 precondition. Nothing is deployed, and `production_requires_human_confirmation` is untouched.
- **`UNKNOWN - verify` (all need the remote, so the owner checks):** branch protection on `main`; forks and clones; the hosting
  provider's secret-scanning result.
- **Notes (redacted, mergeable):** task `security-nfr-public-repo-redacted`: `20261024T110648Z-security-nfr-observation-97867420` (scan, the no-creds evidence); `…fa83895b` (personal data); `20261024T105232Z-security-nfr-observation-0f41702b` (licence); `…aa568d21` (posture); `20261024T110658Z-security-nfr-decision-04b04305` (result). All five were sealed by grugops 2.1.0 `admitAndAppend`, and all five read back through `readContext`.
- **Not touched:** `src/`, the ADRs, `plans/`, `memory-bank/` and `AGENTS.md`. Nothing was pushed, fetched or merged.

### Trace row (10 cells, header order)

| (owner action) public repo (security-nfr-public-repo) | Exposure review of the public tip `55a8f4ef` (3,056 commits, 13,619 blobs, full history): 0 real secrets; SEC-PUB-1 MEDIUM (homelab process captures in history, class/count only, no credential), ACCEPTED by the owner 2026-10-24 on "no creds", condition met; LIC-PUB-1 MEDIUM, CLOSED by ADR-0048 + ABC-214 `59f50717`; SEC-PUB-2/3/4 LOW; 28 posture statements now false, routed to ADR-0049 | EPIC-007 | — | ADR-0007 D3; ADR-0018 D3 / Decision 3; ADR-0044 D8/D13; ADR-0048; ADR-0049; ASVS V16.2.5 (L2) | redacted notes on `grugops/security-nfr-public-repo-redacted` @ `a921cf77` (supersede the held, never-merged `5fd5ee65`) | regex credential sweep with positive control, re-run 2026-10-24 (sweep-v3, 30 strict + 3 loose rules + path rule); ls-remote read-only | — | — | PASS_WITH_RISKS; SEC-PUB-1 ACCEPTED (owner), LIC-PUB-1 CLOSED; posture ADR-0049 is the owner's |
