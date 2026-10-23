---
id: 20261023T215045Z-ba-pm-decision-efbbb9ee
kind: decision
by: ba-pm
at: 2026-10-23T21:50:45Z
verified_by: 
confidence: high on scope, criteria and sizing; the legal sufficiency of a NOTICE carve-out and the re-derive ticket's size are UNKNOWN - verify
refs:
  - ABC-214
  - LIC-PUB-1
  - OD-214-1
  - ADR-0044
  - ADR-0023
  - ADR-0036
  - ABC-041
  - ABC-042
  - ABC-169
  - ABC-205
  - ABC-207
  - ABC-211
  - EPIC-007
  - EPIC-008
  - c487d89c
  - plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md
  - owner-word-2026-10-23/20261023T220500Z-orchestrator-decision-28633db0
  - security-nfr-public-repo/20261023T212123Z-security-nfr-observation-21dd2358
  - 20261023T215025Z-ba-pm-observation-9475c6d2
supersedes: 
seal: sha256:b90fc9866314847c9603357da7bc136a36fd997823d7c6402d4c6816c8256f0a
---

# Apache-2.0 cut as ABC-214 (EPIC-007 post-close addition; XS, P1; DoR 9/10, stays in Backlog on OD-214-1). Paths A and B both written, neither picked

BA/PM, task `bapm-cut-licence`, 2026-10-24, at `main` `c487d89c`. Records only. Input: owner word `…28633db0`. Reads: this task's observation `…9475c6d2`. Page: `plans/tickets/ABC-214-the-repository-is-licensed-apache-2-0.md`. This is not legal advice. Every legal point is `UNKNOWN - verify`.

## Decided

- **One ticket, `ABC-214`.** Zero executable lines.
- **[both]** Five files:
  - `LICENSE`, byte-identical to apache.org: sha256 `cfc7749b…3d30`, 11 358 bytes;
  - `package.json` `"license": "Apache-2.0"`, numstat `1 1`; `"private": true` stays;
  - `package-lock.json`, the one root line, numstat `1 1`;
  - `NOTICE`: `skytalix` / `Copyright 2026 Olger Oeselg` / Apache-2.0 line / the four kit files as MIT;
  - one `expect(packaged.license…).toBe("Apache-2.0")` line in `ABC-042` `A10`, numstat `1 0`, armed.
- **No `cli.test.ts` key pin moves.** `AT_HEAD` already holds `"license"`. The one added line pins the value.
- **[A] Carve-out now.**
  - `NOTICE` gains a CC BY-SA 3.0 section naming `src/evaluate.ts` and the seven identifiers, saying they are "not licensed under the Apache License, Version 2.0".
  - The `src/evaluate.ts` header gains two comment lines.
  - Comment-only is proved by `ABC-169`'s transpile identity (`A6`).
  - The identifier list is checked against the build base.
  - The re-derive is a later ticket, cut on the owner's word. It removes both carve-outs.
- **[B] Re-derive first.**
  - The re-derive is a separate `EPIC-008` ticket, not cut here. It is value-changing, owes G1/G2/G3/G6/G9 and a width-1 D reading. Its ship rule is open: S1 GAIN does not fit a provenance change, and "not LOSS" fits.
  - `ABC-214` then builds with no carve-out. Its pull precondition is `grep -ciE 'michniewski|by-sa' src/evaluate.ts` = 0.
- **ABC-205 interaction.**
  - [A]: the edits touch different lines, and a comment-only merge leaves `ABC-205`'s D reading valid. If `ABC-205` lands first, the carve-out list is re-read.
  - **The `ABC-205` design should name the source of every new king value.** A Michniewski king endgame table would join the carve-out.
  - [B]: each value-changing merge makes the other's D reading stale. There are two orders, and each has costs. The choice is the owner's and the Orchestrator's.
- **Security/NFR:** `ABC-041` (a) fires, a short hop. `ADR-0036` (b1), (b2) and (c) do not fire. No NFR moves.
- **UAT:** WAIVED by measurement. [A] requires `A6` to hold. [B] has no production file under `src/`.
- **Size `XS`, priority `P1`.** DoR is **9/10**. Item 10 fails because OD-214-1 is open. → **stays in `Backlog`.**
  - On "A": a one-line amendment, 10/10, → `Ready`.
  - On "B": cut the re-derive ticket, then `ABC-214` is 10/10 and `Blocked` until it merges.

## For the Orchestrator

- **OD-214-1 to the owner**, text on the page, § Dependencies.
- **The licence ADR (Architect/Design)** must be accepted before `ABC-214` merges, not before it builds. Its drift list is on the page, § Records drift: 14 rows.
- Route the king-value-source point to the `ABC-205` design hop.
- `EPIC-007` needs one dated line for its post-close addition. This hop was fenced off the epic page.
- **Next free id: `ABC-215`.**
