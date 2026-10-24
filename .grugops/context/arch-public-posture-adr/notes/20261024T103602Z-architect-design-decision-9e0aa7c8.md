---
id: 20261024T103602Z-architect-design-decision-9e0aa7c8
kind: decision
by: architect-design
at: 2026-10-24T10:36:02Z
verified_by: 
confidence: medium: the posture facts were measured read-only at fb0a7703; Security/NFR's counts are cited from the owner note …776bba9a, not re-run; the ADR is PROPOSED and the owner's to accept
refs:
  - ADR-0049
  - ADR-0007
  - ADR-0018
  - ADR-0044
  - ADR-0048
  - EPIC-007
  - ABC-169
  - ABC-214
  - SEC-PUB-1
  - SEC-PUB-2
  - SEC-PUB-3
  - SEC-PUB-4
  - LIC-PUB-1
  - owner-word-2026-10-23/20261023T204157Z-orchestrator-decision-59df15ce
  - owner-word-2026-10-24/20261024T091000Z-orchestrator-decision-776bba9a
  - security-nfr-public-repo
  - security-nfr-public-repo-redacted
  - memory-bank/50-decisions/ADR-0049-the-source-is-public-on-github-and-the-engine-still-deploys-nowhere-and-publishes-no-package.md
  - memory-bank/45-standing-rulings.md
  - memory-bank/70-runbook.md
  - memory-bank/30-architecture.md
  - plans/nfr-catalog.md
  - grugops/arch-accept-adr0048
  - fb0a7703
supersedes: 
seal: sha256:5a92d434919f0fdf3e3dec17e8364e99d6bd3fe1042cf709730b9caac4b9cf40
---

# ADR-0049 PROPOSED: the source is public on GitHub, the engine still deploys nowhere and publishes no package; 37 records listed with dispositions, edits on acceptance

`memory-bank/50-decisions/ADR-0049-the-source-is-public-on-github-and-the-engine-still-deploys-nowhere-and-publishes-no-package.md`, on branch `grugops/arch-accept-adr0048` (from `main` `fb0a7703`). It is **PROPOSED**. Acceptance is the owner's (new ADR, standing ruling 2026-10-22).

## Chosen design (decisions 1–7)
1. **Public:** every pushed ref with full history, every tracked file, and commit metadata. Which refs beyond `main` are public is `UNKNOWN - verify` (owner). Pushing stays the owner's. A held branch is never pushed.
2. **Local-only, unchanged:** nothing is deployed, `none-local-only`, `["local"]`, `"private": true`, no release, no CI. `production_requires_human_confirmation` stays `true`.
3. **Distribution:** `ADR-0018`'s channel, now reachable by anyone. `npx` from the git URL is not offered.
4. **`SEC-PUB-1`** is accepted on "no creds". There is no history rewrite and no force push. A found credential lapses the acceptance (HIGH, owner). From acceptance on, records name infrastructure by class and count only.
5. **Licence:** `ADR-0048` (Apache-2.0 at `ABC-214`'s merge). Until the owner pushes that merge, the public tip reads `UNLICENSED`.
6. **Host checks become real:** `host-protection.js` exit 2 is a real `UNKNOWN - verify`, and the "no git remote" qualifier is dropped.
7. **Publication cannot be rolled back.** Making the host repo private stops new clones and recalls nothing.

## Records: 37 rows, each with a disposition
- **Dated line or dated note on acceptance:** rows 2, 3, 4, 7, 8, 9, 10, 12, 15, 18, 30–33 (Architect/Design); 28, 29, 35 (the Scribe); 34 (Security/NFR).
- **Already answered by `ADR-0048`:** rows 13, 14, 16, 17 (applied today, task `arch-accept-adr0048`); rows 20–24 (BA/PM rows 11–13, task `bapm-epic007-licence-line`).
- **None:** rows 1, 5, 6, 11, 19, 25, 26, 27 (dated history, sealed note, Done ticket); rows 36 and 37 (still true).
- **Mapping:** Security/NFR's 28 items are rows 1–10, 12–16, 18–20, 26–34 and 36. Rows 11, 17, 21–25, 35 and 37 were added at this hop.

## Alternatives rejected
Go private again (the owner's option at any time; not recommended); purge history (rejected by the owner's condition); notes on ADR-0007/0018 only (the Orchestrator ruled a new ADR, `…59df15ce`); fold into ADR-0048 (the licence is a separate decision); offer `npx` (out of v1, ADR-0044 D8).

## NFR and migration impact
No NFR moves. `nfr.availability` stays not-applicable-local-only. No code, config or package change. The migration is dated lines only, on acceptance.

## Homelab fence
The held branch `grugops/security-nfr-public-repo` was read for structure only. Its posture note quotes record text and no infrastructure detail. A pattern scan of this branch's diff found 0 IPv4 addresses, 0 personal paths, and 0 realm, cluster or service names. The only domain is the public Michniewski page already cited in ADR-0048.

## Open for the owner
- Accept or reject ADR-0049.
- Owner-side `UNKNOWN - verify` items: branch protection on `main`, which refs are public, forks and clones, and GitHub secret scanning.
- The suggestion (not a gate): confirm the lab's admin consoles are not reachable from the internet.
- `SEC-PUB-2` to `SEC-PUB-4` (LOW, personal metadata) stay his and are not decided here.
