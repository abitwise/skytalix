---
id: 20261024T080253Z-architect-design-decision-83df1e49
kind: decision
by: architect-design
at: 2026-10-24T08:02:53Z
verified_by: 
confidence: medium (repo facts high; every legal reading UNKNOWN - verify, not legal advice); ADR is PROPOSED, acceptance is the owner's
refs:
  - ADR-0048
  - ADR-0044
  - ABC-214
  - ABC-205
  - ABC-169
  - EPIC-007
  - LIC-PUB-1
  - OD-214-1
  - 20261023T220500Z-orchestrator-decision-28633db0
  - 20261024T105800Z-orchestrator-decision-fb0468ff
  - 20261023T212123Z-security-nfr-observation-21dd2358
  - 0c8f287b
  - ad8dfa13
supersedes: 
seal: sha256:9a30631d05dd83594c42eb575fb9def10d138f23c419780cae4d3e7c04afaed8
---

# ADR-0048 drafted, PROPOSED: Apache-2.0 for the repository, the CC BY-SA 3.0 tables carved out (path A); it would supersede ADR-0044 D13's private reading

**File:** `memory-bank/50-decisions/ADR-0048-the-repository-is-apache-2-0-and-the-cc-by-sa-evaluation-tables-are-carved-out-in-notice-until-re-derived.md`. It was written at commit `0c8f287b`. The `ADR-0044` § Status pointer followed at `ad8dfa13`, because the first commit's message named a pointer that had not landed. Branch `grugops/arch-licence-adr` is shared as `grugops/arch-accept-owner-words`, cut from `d4d49c5a`. 0048 is free on every local branch.

- **Status: PROPOSED.** It is a new ADR, so acceptance is the owner's. `ABC-214` builds on it now and merges only after he accepts.
- **The decisions:**
  - D1: Apache-2.0, SPDX `Apache-2.0`; `"private": true` stays.
  - D2: `Copyright 2026 Olger Oeselg` in `NOTICE`.
  - D3: path A. The carve-out goes in `NOTICE` and the `src/evaluate.ts` header, and ABC-214's default wording is adopted unchanged.
  - D4: exactly seven identifiers, with the ABC-205 source table (see the observation note).
  - D5: the four kit files stay MIT, with their notice now known. The other seven `tools/grugops/` files and the 10 tracked kit outputs fall under Apache-2.0.
  - D6: the CC0 and public-domain parts need nothing.
  - D7: the later EPIC-008 re-derivation replaces D13's "re-derive first" precondition, and removes the carve-out in the same change.
  - D8: public history is not rewritten.
  - D9: a bundle carries `NOTICE`. OQ-214-4 stays UNKNOWN - verify.
- **Records drift, all 14 rows of ABC-214's list:** a disposition table. The edits are made **on acceptance**: ADR-0044 pointers by Architect/Design, EPIC-007 dated lines by BA/PM. ABC-169 and ADR-0023 are kept as dated history. The only edit now is a "PROPOSED" pointer in ADR-0044 § Status: D13 stands until acceptance.
- **Licence facts** come only from the held branch's licence note `…21dd2358`, read by `git show` for that one file. No other note on that branch was read, and no homelab detail is copied.
- **The owner decides:** accept or reject ADR-0048, and OQ-214-3 (default: the four kit files stay MIT, not folded into Apache-2.0).

**Records only. Empty-diff check:**
```
$ git diff --stat d4d49c5a..HEAD -- src tools package.json
$ echo $?
0
```
(no output: 0 bytes; HEAD ad8dfa13 on grugops/arch-accept-owner-words)
