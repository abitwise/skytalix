---
id: 20261025T122908Z-security-nfr-observation-8127705e
kind: observation
by: security-nfr
at: 2026-10-25T12:29:08Z
verified_by: 
confidence: high: file reads and git grep at cc30eebe; local refs only for the public tip; legal readings UNKNOWN - verify
refs:
  - security-nfr-lic-pub-1
  - LIC-PUB-1
  - OQ-214-4
  - ABC-214
  - ABC-215
  - ADR-0048
  - ADR-0049
  - 5c91e2e4
  - 59f50717
  - 3497aad2
  - cc30eebe
  - NOTICE
  - src/evaluate.ts
  - README.md
  - qe-ABC-215/20261025T121200Z-qe-e2e-decision-c2c3540f
  - qe-ABC-215/20261025T121200Z-qe-e2e-observation-dc2c86cc
  - arch-design-ABC-215/20261025T045829Z-architect-design-observation-cbbb9a63
  - security-nfr-public-repo-redacted/20261024T110658Z-security-nfr-decision-04b04305
  - security-nfr-public-repo-redacted/20261024T105232Z-security-nfr-observation-0f41702b
supersedes: 
seal: sha256:16186af44a05fb37bcda848a636318a0b1ac4ca347ae45d3cadb401b52eb375c
---

# LIC-PUB-1 / OQ-214-4 evidence at `main` `cc30eebe`, after `ABC-215` merged at `5c91e2e4`: the CC BY-SA carve-out is gone from the tip. Two records disagree on whether LIC-PUB-1 was already closed

Security/NFR, task `security-nfr-lic-pub-1`. Read-only: file reads, `git grep`, `git log`/`reflog` on local refs. Nothing was run, built or timed. No network read; the remote was not touched.
*This is an engineering role's reading, not legal advice.* Every legal conclusion stays `UNKNOWN - verify`.

## What the tip holds (`main` `cc30eebe`; `5c91e2e4` is its ancestor)
- **`NOTICE`:** 10 lines. Apache-2.0 header (lines 1–5), then one section only: the four grugops kit files (MIT). The `Evaluation values (CC BY-SA 3.0)` section count is 0.
- **`src/evaluate.ts` header:** one line says `PIECE_VALUE` and the six tables are this project's own, each made by the rule written above it. No "See NOTICE" carve-out line, no third-party credit.
- **`README.md` § Licence:** "…[NOTICE](NOTICE) lists them: four grugops kit files (MIT)." No CC BY-SA mention.
- **`LICENSE`:** Apache License 2.0 text, sha256 `cfc7749b…bc523d30`. **`package.json`:** `"license": "Apache-2.0"`, `"private": true`.
- **Tracked-tree grep** (`BY-SA|Michniewski|Simplified Evaluation|creativecommons`, case-insensitive, outside `.grugops/`, `plans/`, `memory-bank/`): 1 hit, the CC0-1.0 link in `data/opening-book/ATTRIBUTION.md`. 0 CC BY-SA hits.
- **QE's verdict** (`qe-ABC-215` `…c2c3540f`, `…dc2c86cc`): `A2` MET (all seven arrays equal an independent rebuild of their stated rule; each differs from base); `A3` MET (0 `michniewski|by-sa|chessprogramming` in `src/evaluate.ts`, `NOTICE`, `README.md`; `NOTICE` byte-equal to `ABC-214` Scope 5's common part). Not re-derived here.

## Provenance residual (not a licence ruling)
- Cells that still equal the pre-`ABC-215` values, from the ruling's counts (`…cbbb9a63`, `…3c66f0d7`, QE `…dc2c86cc`): `PIECE_VALUE` 5/7, pawn 18/64, knight 0/64, bishop 46/64, rook 44/64, queen 37/64, king 14/64. **164 of 391 cells.**
- Each of those cells is the output of the rule written above its array (QE's rebuild equals every entry). Equal small integers from a stated formula are not a copy by construction; whether such coincident cells carry any protection is `UNKNOWN - verify` (legal). INFO.

## Public tip lags `main` (local refs only)
- The local remote-tracking ref was last updated by a push on 2026-10-24 (UTC 15:29) to `3497aad2`. It contains `ABC-214` (`59f50717`), not `ABC-215` (`5c91e2e4`). `main` is 111 commits ahead of it.
- So, as far as local refs show, **the public tip still carries the `ABC-214` carve-out.** Whether the owner pushed since is `UNKNOWN - verify` (needs the remote).

## The two records disagree on LIC-PUB-1's state
- **Recorded CLOSED, 2026-10-24:** Security/NFR `security-nfr-public-repo-redacted` `…0f41702b` and `…04b04305` ("ADR-0048 accepted + ABC-214 merge", met at `59f50717`), trace rows 1498–1499, and `ADR-0049` § Context ("closes when `ABC-214` merges").
- **Kept open for a remainder:** `ADR-0048` § Consequences ("the Adaptation reading stays `UNKNOWN - verify` (OQ-214-4) until the re-derivation merges"), `ABC-215` § Problem ("LIC-PUB-1 … is only closed at the tip once the values are ours"; "closes the last part of LIC-PUB-1 and OQ-214-4"), and Orchestrator `…ccf209d9` / `…26f4e001` ("owner-held … the owner closes it").
- Both readings agree on the facts. They differ only on whether the Adaptation question was part of LIC-PUB-1 or a separate residual. The decision note of this task reconciles them; neither sealed note is edited.
