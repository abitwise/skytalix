---
id: 20260926T203503Z-security-nfr-decision-nfr005-depth7-status-refreshed-after-abc121-31b3bae1
kind: decision
by: security-nfr
at: 2026-09-26T20:35:03Z
verified_by:
confidence: high
refs:
  - NFR-005
  - ABC-121
  - ABC-081
  - plans/nfr-catalog.md
  - .grugops/context/secnfr-ABC-121/notes/20260926T193100Z-security-nfr-observation-abc121-nfr004-005-009-held-plain-node-doors-unreachable-76eb826c.md
  - .grugops/context/secnfr-ABC-121/notes/20260926T193200Z-security-nfr-decision-abc121-pass-with-risks-n8lane-ar-drafted-for-owner-no-security-finding-d25a224c.md
  - .grugops/context/uat-run-ABC-121/notes/20260926T220100Z-qe-e2e-observation-a2-depth-floor-plain-node-three-rounds-80a5e0a0.md
supersedes:
---

# `NFR-005` status refreshed after `ABC-121`: floor MET, depth 7 reached on M3, still PROVISIONAL. No threshold or level moved

Hand-authored and unsealed. This install has no sanctioned writer (`scripts/context-io.js` is
absent, and there is no `propose_note` tool in this session), and `human_admission` is `off`.
It is a `decision` (catalog-owner edit), not a `finding`.

Owner's word, 2026-09-26: *"run items 1-3"*. Item 3: the catalog's "Depth 7 not reached" is stale
now that `ABC-121` is merged (`5b5a0a3`, wave tip `652ed49`).

## The edit (`plans/nfr-catalog.md`, `NFR-005` Verified-by cell only)

- Before: `... depth 6 completes by 2.0 s. **Depth 7 not reached (WARN, still PROVISIONAL).** Vitest reads 5 / 5.`
- After: the `ABC-081` sentence is struck through as history (`~~Depth 7 not reached~~ (true at
  ABC-081; superseded 2026-09-26 ...)`). It is followed by the post-`ABC-121` status: FLOOR MET with one
  ply of margin, DEPTH 7 REACHED on the reference machine (WARN level cleared there), and the
  depth-7 level stays PROVISIONAL.
- There is one new `_Updated:` line at the head of the catalog.
- The depth 6 FAIL floor, the depth 7 WARN level and its PROVISIONAL marker, the 3 s budget and
  the 5 s ceiling are unchanged. `NFR-001`–`004` and `006`–`009` rows are byte-identical (sha256
  per row before and after; only `NFR-005` changed).

## Evidence: cited, not re-measured

- `…76eb826c` (Security/NFR, own probe, plain node, `chooseMove` at `DEFAULT_BUDGET_MS`): kiwipete
  7/7/7 and position-6 7/7/7 against the pre-`ABC-121` door's 6/6/6. 3 rounds, load1 6.8–15.1.
- `…d25a224c` (gate result, row 2): FLOOR MET, depth-7 WARN reached on M3, still PROVISIONAL. It
  names this catalog follow-up.
- `…80a5e0a0` (QE `uat-run-ABC-121` `A2`, own script, plain node): 7/7 build against 6/6 door.
  3 rounds, both positions, load1 8.0–8.7.
- Why no fresh run: `git diff --stat ada4093 652ed49 -- src` shows only `src/cli.test.ts`
  (+14), so the measured engine is the merged engine. The catalog's precedent
  (`place-nfr005-runner`) placed a status line from cited gate evidence with "No re-measurement
  at this hop". `place-nfr005-runner` placed the runner *rule* (plain `node` binds), not a script.
  There is no separate runner file to invoke.

## Caveats carried in the row

- One machine only: Apple M3 4P+4E, node v24.12.0. Depth-in-budget on any other hardware is
  `UNKNOWN - verify`, so PROVISIONAL does not lift.
- Both readings were taken on a loaded host (load1 6.8–15.1 and 8.0–8.7). Load biases against
  depth, not for it.
