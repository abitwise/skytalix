---
id: 20261021T072219Z-security-nfr-observation-34fec102
kind: observation
by: security-nfr
at: 2026-10-21T07:22:19Z
verified_by: 
confidence: medium (pattern scan only; full secret scan UNKNOWN - verify)
refs:
  - SEC-177-1
  - ABC-177
  - ASVS-V16.2.5
  - .grugops/context/qe-ABC-177/probe/window.mjs
  - .grugops/context/qe-ABC-177/probe/sampler174.mjs
  - .grugops/context/qe-ABC-177/probe/timing/batch2/window2.out
  - .grugops/context/qe-ABC-177/probe/timing/batch2/window4.out
  - .grugops/context/qe-ABC-177/probe/timing/batch2/window6.out
  - orchestrator
  - qe-e2e
supersedes: 
seal: sha256:f9e0c0dcc5786d385e1e96b22a97539f68bf851014ac8a5b5c69c45f4063d032
---

# `SEC-177-1` (outside `ABC-177`'s diff): QE's window and sampler instruments commit other projects' command lines into this repository's git history

**Not part of `ABC-177`'s verdict. Not a gate fail.** This is an observation for the Orchestrator and the owner.

**What was found.**
- `probe/window.mjs` writes every matching foreign process line into `window.out`: up to 160 characters per poll, and the last 400 characters
  of each distinct line in its summary.
  `sampler174.mjs` writes the same into `sampler.tsv`, up to 140 characters. The match pattern names, among others,
  `oeselg-labs/platform`.
- These files are **tracked**: 120 files under `.grugops/context/qe-ABC-177/probe/` are in git.
- The committed captures hold command lines from a private repository (`Projects/private/oeselg-labs/platform/…`):
  - a Keycloak admin CLI login against `http://keycloak-service.keycloak.svc:8080 --realm master --user "$username" --password "$password"`, followed by `get realms`;
  - a SigV4 `curl` naming `$S3_ACCESS_KEY_ID:$S3_SECRET_ACCESS_KEY`;
  - `--env-from-secret smoke-env`;
  - private file paths.
- **No literal credential value was found.** Every secret-like token seen is a `$VARIABLE` reference or a test-fixture
  string (`pw&SECRET` in a bats test). The scan was a pattern grep, not a full secret scan, so whether the captures hold
  no secret value at all is `UNKNOWN - verify`.

**Why it matters.**
- A process's argv is whatever another session typed. One `--password <value>` in a foreign command during a window would
  land in this repository's history.
- This repository has **no git remote** today, so nothing has left the machine. It is named `grugops-examples`, and
  the risk is realised the day it is pushed anywhere.

**ASVS mapping.** The nearest control is V16.2.5, "do not log credentials". It is L2, outside the active L1 set
(`security.asvs_level` L1), so it does not gate. Its default severity would be medium if L2 were active.

**Recommended:**
1. QE instruments log a foreign process as count, class (vitest / platform / hop) and pid, plus at most the executable
   name. Not its argv.
2. Before this repository is ever pushed, the owner decides whether the existing captures stay in history. `git
   filter-repo` or a squash is his call.

**Owner of the decision: Olger Oeselg**, via the Orchestrator. Owner of the forward instrument change: QE/E2E. It is
recorded open and is not accepted on anyone's behalf.
