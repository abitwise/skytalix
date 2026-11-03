---
id: 20261103T124150Z-agents-md-scribe-decision-6603cd44
kind: decision
by: agents-md-scribe
at: 2026-11-03T12:41:50Z
verified_by: 
confidence: high
refs:
  - AGENTS.md
  - ABC-269
  - src/evaluate.taper.test.ts
  - src/cli.test.ts
  - scribe-taper-lane
supersedes: 
seal: sha256:0eae198bf0e170f7ac51e2c7f0feb6c7019332aa286bab618d01bd388fbbeeb8
---

# Decision: the E1 taper deep lane is in AGENTS.md; two redundant clauses cut to make room

**No stamp is claimed.** Hand-authored `decision`; no `finding`, no `verified_by` invented.

## Added (one line, in the deep-lane list after the futility row)
`- Taper deep lane (ABC-269, 146 tests): SEARCH_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/evaluate.taper.test.ts`

The command was RUN before it was recorded (under the host-test lock, in the worktree): 1 file, 146 tests passed,
17.8 s. The 146 in the line is that measured count (B0 + B2 + phase-oracle deep rows).

## Trimmed (value-neutral; every fact still has one home)
1. `Test (all)` comment: dropped "`*_DEEP` lanes below run via `npx vitest run` directly, never through `npm test`."
   The next-but-one list item ("No `npm run` script runs a `*_DEEP` lane ... the npx lines below are the only
   verified spelling") says the same thing.
2. "No `npm run` script" item: dropped "`npm test` pins heap 128 and a 60 s bound; a deep lane needs 400 and longer."
   The heap fact lives in the `Heap flag (ABC-173)` item (128 for suite runs, 400 one file only, the guard refuses 400
   on a suite) and the 60 s bound in the `Test (all)` comment (exit 124 at the 60 s bound).
No test greps either removed clause (searched `src/` and `tools/`).

## Bytes
18,429 B before; 18,404 B after, against the 18,432 B budget pinned by `src/cli.test.ts` ABC-109 A5: headroom 3 B -> 28 B.
`src/cli.test.ts` (109), `status-panel` (29), `history` (17), `render` (30) green on the tip.
