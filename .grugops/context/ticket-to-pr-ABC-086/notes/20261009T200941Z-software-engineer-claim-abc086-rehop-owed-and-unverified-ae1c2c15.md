---
id: 20261009T200941Z-software-engineer-claim-abc086-rehop-owed-and-unverified-ae1c2c15
kind: claim
by: software-engineer
at: 2026-10-09T20:09:41Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-086
  - N8-LANE
  - NFR-008
  - AGENTS.md
  - .grugops/context/ticket-to-pr-ABC-086/notes/20261009T200941Z-software-engineer-observation-abc086-rehop-merged-tree-gates-deep-lane-n8lane-under-457ba6b8.md
supersedes: 
---

# `ABC-086` re-hop: what is owed by others, and what this hop did not verify

Hand-authored, no seal. The readings are in observation `…457ba6b8`.

## Owed (not this role's to write)

- **`AGENTS.md` `### Test`, the `ENGINE_DEEP` line (Scribe).** At `a4d8633`:
  `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` — exit 0, **45 passed (32 default)**, 314.8 s
  (RUN 2026-10-09, M3, loaded host, load1 7–10). `ABC-086` `A1` 300/300 is 123.8 s of it, `A2`
  30.2 s. The line in the file still says 23 / 17 / 98.7 s.
- **The `npm test` comment (Scribe):** 49 files / 1530 at `a4d8633` (the file says 47 / 1446).
- **QE hop** and the board move (Orchestrator).

## Not verified here

- **`N8-LANE` at a quiet host.** The only admissible reading (+35 ms, sign 4/8) was taken at load1
  median 22.9; the second run was inadmissible (null −2.22 %). The in-vitest attribution of the new
  row (≈ 110 ms) agrees with "well under 450", but a quiet-host instrument run would tighten it.
  `UNKNOWN - verify` only as to precision, not as to which side of 450 it falls.
- **The slice's depth margin.** All 15 complete exactly depth 2 at budget 2 on the merged tree. An
  evaluation or ordering change that costs a few hundred nodes could take one to depth 1, and the
  floor row will go red. That is the floor working, not a flake; the fix then is a re-cut, not a
  looser floor.
- **Pre-existing, not mine:** the main checkout's `node_modules/node_modules` is a symlink back to
  `node_modules` (dated 2026-09-19), a directory loop that `diff -r` trips on. Flagged, not touched.
