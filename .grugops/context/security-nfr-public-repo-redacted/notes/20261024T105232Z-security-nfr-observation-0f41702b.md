---
id: 20261024T105232Z-security-nfr-observation-0f41702b
kind: observation
by: security-nfr
at: 2026-10-24T10:52:32Z
verified_by: 
confidence: medium (repo facts and closing state read at main 2e67a4b5; every legal conclusion UNKNOWN - verify, not legal advice)
refs:
  - security-nfr-public-repo-redacted
  - LIC-PUB-1
  - ADR-0044
  - ADR-0048
  - ABC-214
  - 59f50717
  - OQ-214-3
  - src/evaluate.ts
  - package.json
  - 20261024T091000Z-orchestrator-decision-776bba9a
  - 20261023T212123Z-security-nfr-observation-21dd2358
supersedes: 
seal: sha256:7794d041f0ed6621bf9399ec0efe171c327e1e4e5b40df8b2346cf29c75325e0
---

# Licence position of the public repo (LIC-PUB-1, MEDIUM): CLOSED by ADR-0048 (accepted) and the ABC-214 merge

**Why this note exists.** This note re-publishes the licence part of the 2026-10-23 review (held branch
`grugops/security-nfr-public-repo` @ `5fd5ee65`, never merged) on a branch that can merge, and records how the finding closed.
This is an engineering role's reading, not legal advice. Every legal conclusion stays `UNKNOWN - verify`.

## What the review found (at public tip `55a8f4ef`)

- **`package.json`:** `"private": true`, `"license": "UNLICENSED"`. No `LICENSE`, `NOTICE` or `COPYING` file was tracked.
  Public source under no licence means default copyright applies, plus the hosting provider's terms-of-service view-and-fork
  grant. That made the repo source-available, all rights reserved.
- **`src/evaluate.ts:16-19`:** `PIECE_VALUE` and the six piece-square tables are the CC BY-SA 3.0 "Simplified Evaluation Function"
  values. Public history holds **3 versions without attribution** (`f8b36aa2` … `b3fecb1b`, 2026-08-17 to 2026-10-18).
- **Opening book:** CC0-1.0 (ADR-0023). Nothing is owed. The PRNG constants are CC0 or public domain. The perft positions and
  counts are facts (`UNKNOWN - verify`, INFO). The puzzle corpus is self-built.
- **Kit files:** MIT, copyright held by the owner. That resolved ADR-0044 D13's `UNKNOWN` on the notice text.
- **LIC-PUB-1, MEDIUM (process and compliance, not an ASVS control). Owner: Olger Oeselg.** ADR-0044 D13's precondition was
  *"re-derive our own values first"* before any distribution, including *"a clone handed to someone else"*. Publication breached
  it. Under the Adaptation reading of BY-SA 3.0 § 4(b), an "all rights reserved" distribution of the tables is not permitted.
  Under the Collection reading, § 4(a) needs the credit and no restricting terms on the tables.

## How it closed

- **ADR-0048 ACCEPTED** 2026-10-24 by the owner (*"accept ADR-0048 ; keep grugops under MIT"*, note
  `20261024T091000Z-orchestrator-decision-776bba9a`). Accepted state recorded by Architect/Design in task `arch-accept-adr0048`.
  - The repository is licensed **Apache-2.0** (path A).
  - The CC BY-SA 3.0 tables are **carved out in `NOTICE`** and in the `src/evaluate.ts` header until our own values replace
    them.
  - It supersedes ADR-0044 D13's private reading. **OQ-214-3:** the four kit files stay MIT.
- **ABC-214 MERGED** to `main` at `59f50717` (Done at `2e67a4b5`). It ships the licence and the `NOTICE` carve-out.
- **LIC-PUB-1: CLOSED.** The condition the owner and the brief set ("ADR-0048 accepted + ABC-214 merge") is met on `main`.

**What closing does not change (residual, INFO, owner's):**
- The 3 unattributed historical versions stay in public history. No rewrite was ordered.
- Whether the tables are protected at all, and whether the BY-SA → GPL/Apache reasoning holds, remain `UNKNOWN - verify`
  (legal advice). ADR-0048 owns that reasoning.
- Re-deriving our own values is still the long-term exit named in ADR-0048.
