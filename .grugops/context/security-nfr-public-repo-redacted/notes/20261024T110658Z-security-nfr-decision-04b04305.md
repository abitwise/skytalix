---
id: 20261024T110658Z-security-nfr-decision-04b04305
kind: decision
by: security-nfr
at: 2026-10-24T11:06:58Z
verified_by: 
confidence: high (result read from the four evidence notes of this task; legal items UNKNOWN - verify)
refs:
  - security-nfr-public-repo-redacted
  - SEC-PUB-1
  - SEC-PUB-2
  - SEC-PUB-3
  - SEC-PUB-4
  - SEC-PUB-5
  - LIC-PUB-1
  - ADR-0007
  - ADR-0018
  - ADR-0044
  - ADR-0048
  - ADR-0049
  - ABC-214
  - 59f50717
  - 55a8f4ef
  - 5fd5ee65
  - 20261024T091000Z-orchestrator-decision-776bba9a
  - 20261024T110648Z-security-nfr-observation-97867420
  - 20261024T110648Z-security-nfr-observation-fa83895b
  - 20261024T105232Z-security-nfr-observation-0f41702b
  - 20261024T105232Z-security-nfr-observation-aa568d21
  - 20261023T212131Z-security-nfr-decision-f1e970d6
supersedes: 
seal: sha256:3cecfb37dfc8897f3759eb52a2e5089bd4a990be362fe2b84cf44ef45fcf0944
---

# Security/NFR on the public repo, redacted record: PASS_WITH_RISKS. 0 credentials in public history, so the owner's "no creds" condition is met. SEC-PUB-1 is ACCEPTED (owner) and LIC-PUB-1 is CLOSED

This is a `decision`, not a `finding`. No gate can stamp an exposure review, and `context.human_admission` is `off`.

**This record supersedes, for merge purposes, the held branch** `grugops/security-nfr-public-repo` @ `5fd5ee65`. That branch is
local only and is never merged, because it restates the exposed details. Its notes are `…0123715b`, `…0f1e173a`, `…21dd2358`,
`…4d1d39b5` and `…f1e970d6`. Nothing on it was modified.

**Evidence notes in this task:**
- the scan, i.e. the "no creds" evidence;
- personal data (SEC-PUB-1..5);
- the licence (LIC-PUB-1);
- posture.

Every exposure is described by class and count only.

## Result: PASS_WITH_RISKS
- **Credentials: 0** in any public ref's history. The re-run sweep covered 1 public ref (`55a8f4ef`; no tags, no other branches), 3,056 commits, 13,619 blobs and 12,556 paths, plus every commit message. It used 30 strict rules, a path rule and a positive control that fired all 33 rules. Every strict rule but one gave 0. The 10 hits of the remaining rule are canaries, placeholders, a variable and prose. The path rule gave 0. The unpushed delta (169 commits) also gave 0.
- **0 HIGH.** `security.block_on` is `high`, so nothing blocks.
- **SEC-PUB-1 (MEDIUM, ASVS V16.2.5 L2 default): ACCEPTED risk. Named owner: Olger Oeselg.**
  - He accepted it on 2026-10-24, verbatim *"ok, if no creds"*, in note `20261024T091000Z-orchestrator-decision-776bba9a`.
  - **Condition: no credential** (password, key, token, private key or kubeconfig secret value) in public history.
    **Status: MET**, per the scan note.
  - No history rewrite and no force push.
  - **Owner-side suggestion, not a gate:** confirm that the identity provider's admin console is not reachable from the internet.
  - **Re-open trigger:** any future sweep or provider alert that finds a credential value in a public ref.
- **LIC-PUB-1 (MEDIUM): CLOSED.** ADR-0048 is ACCEPTED (Apache-2.0, with the CC BY-SA tables carved out in `NOTICE`), and ABC-214
  is merged at `59f50717`. Residual, INFO: 3 unattributed historical versions stay in history, and the legal reading is
  `UNKNOWN - verify`.
- **LOW:**
  - SEC-PUB-2: the owner's email (owner, forward setting);
  - SEC-PUB-3: absolute local paths (QE/E2E, forward fix);
  - SEC-PUB-4: host fingerprint (optional).
- **INFO:** SEC-PUB-5, no third-party personal data.
- **Posture:** 28 items, carried by ADR-0049 (PROPOSED, the owner's).

## Still `UNKNOWN - verify` (the owner's; each needs the remote, which this hop may not touch)
- branch protection on `main`;
- whether forks or clones exist;
- whether the hosting provider's own secret scanning ran or raised anything.

## Method correction, stated
The 2026-10-24 re-run found a blind spot in the 2026-10-23 path rule. `rev-list --objects` names each blob under one path only,
so a secret-named file whose content equals another blob's would be missed. v3 takes every path from per-commit diffs. The path
count is still 0. v3 also adds kubeconfig, base64-key and unquoted env/CLI secret rules. The credential count is still 0.
