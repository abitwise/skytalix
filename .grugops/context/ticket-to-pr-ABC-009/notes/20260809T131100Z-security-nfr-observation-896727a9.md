---
id: 20260809T131100Z-security-nfr-observation-896727a9
kind: observation
by: security-nfr
at: 2026-08-09T13:11:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - A8
  - A9
  - src/moves.ts
  - src/moves.castling.test.ts
  - src/moves.castling.hardening.test.ts
  - AGENTS.md
  - agent-factory/workflows/05-pr-quality-gate.md
supersedes: 
---

# Every gate re-run by this gate on the tip, with exit codes — nothing inherited

Every command below was run by this role on `cff45ee`, the branch tip of
`grugops/ticket-to-pr-ABC-009`. Nothing is quoted from another note and nothing is reported as
passing that did not run.

| gate | command (from `AGENTS.md`) | result |
|---|---|---|
| lint | `npm run lint` | **exit 0**, 33 files, **2 pre-existing `biome.json` infos** (schema + deprecation, `biome.json:12`) |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` | **exit 0** (`tsc --noEmit` — a typecheck in the build slot, as `AGENTS.md` says plainly) |
| unit | `npm test` | **356 passed (356) on 16 files** |
| skip count | `npx vitest run --reporter=json 2>/dev/null \| jq '...'` | **0** |
| deep perft (`A9`) | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **32/32 exact, 38.49 s** |
| e2e | — | `UNKNOWN - verify` |
| test-integrity checker | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **exit 2** |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | `UNKNOWN - verify` — absent in this install |

**The test-integrity exit 2 is recorded as an ERROR and NOT as a pass.** `.grugops/test-skips.md`
does not exist — checked with `ls`, not assumed. Workflow 05 step 3 defines exit 2 as *"the checker
could not run"*, explicitly distinct from the exit-1 human-only short-circuit. **No registry file was
created**: an agent may not author a justification to clear its own gate, and with a skip count of 0
nothing is owed one. Every prior subtask on this board recorded this identically.

**`A9` is now on its THIRD independent run and all three agree**: 36.93 s (Engineer), 38.35 s (QE),
**38.49 s (here)**, all **32/32 exact**. The six deep cells are position-3 perft(5) and perft(6),
position-4 perft(4) and perft(5), position-5 perft(4), position-6 perft(4).

**The two lint infos are pre-existing and unrelated** — `biome.json` schema and deprecation notices.
Flagged, not fixed (coding rules 9 and 12).

## The tree this gate measured is the tree QE and the Engineer measured

Checked at the source rather than taken from a note: `src/moves.ts` hashes
**`0e247853ab2c05887c76105ff83d8621`** — the digest the Engineer published and QE re-verified — and
`git diff 8f540cf -- src/moves.ts` is **empty**. `git status --short` shows no modification under
`src/` by this role at any point: the only working-tree entries are this subtask's own queue files.
**This gate changed no production code and no test.** Repairing an implementation to make this
gate's own verdict come out green is not this role's, and there was nothing to repair.

**A correctness cross-check fell out of the throughput work and is recorded because it is free:**
`npm run perft` counted **11,377,922** nodes on every one of this gate's three runs, and the
three-tree harness checksummed **409,605,192** nodes per sample across pre-fix, delivered and twin.
Identical to the Engineer's node count. Nothing was elided and no tree was silently mismatched.

## What this note does NOT establish

- **A terminal Workflow 05 verdict.** `READY_FOR_HUMAN_REVIEW` is the gate's to emit and there is no
  §14 gate in this install. The four mandatory gates passing is a fact about commands, not a verdict.
- **A coverage figure.** None was measured, deliberately — `## Problem` is explicit that a test which
  only raises coverage adds nothing here, `src/legal.ts` having been at 100% when the defect shipped.
  No `--coverage` run was made, so the tracked-`coverage/` hazard never arose.
- **`NFR-001`.** In its own companion notes; no throughput figure appears above.
