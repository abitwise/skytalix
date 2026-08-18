---
id: 20260818T151500Z-qe-e2e-artifact-ref-the-blocking-gate-re-run-and-the-lane-i-used-b3c4d5e6
kind: artifact-ref
by: qe-e2e
at: 2026-08-18T15:15:00Z
verified_by:
confidence: high
refs:
  - ABC-078
  - AGENTS.md
  - src/engine.ts
  - src/engine.test.ts
supersedes:
---

# The blocking gate, re-run by QE on the delivery tip — and the lane, which is NOT the engineer's substituted one

## Where this ran

Branch `grugops/quality-gate-ABC-078-qe-2026-08-18`, cut off
`grugops/abc078-iterative-deepening-engine-seam` @ **`4d4f818`** (the delivery tip), in an
**isolated agent worktree** at `.claude/worktrees/agent-a7c66e2f515960500`. Apple M3 (Mac15,13).

## THE LANE — and the one thing QE can say that the engineer could not

**I ran the RECORDED commands, unsubstituted.** `npm test` and `npm run lint` are clean here.

The reason is structural and it is worth writing down: **an isolated agent worktree is itself a
sub-checkout, so it does NOT contain `.claude/worktrees/`.** `ls -d .claude/worktrees` in this
working copy returns `No such file or directory`. Vitest therefore collects only this
repository's own files and biome finds only one root `biome.json`. There is no contamination to
exclude, so there is nothing to substitute.

This **CONFIRMS the engineer's `observation` note rather than contradicting it**
(`20260818T132500Z-…-f6a7b8c9`). Its diagnosis was that the sibling worktrees under
`.claude/worktrees/` — not this ticket, and not `vitest.config.ts` or `biome.json` — are what
break the two recorded commands in the SHARED checkout. Running the same two commands in a tree
that differs only by the absence of those sub-checkouts, and getting the recorded behaviour and
**the engineer's exact counts**, is an independent confirmation of that diagnosis by a second
route. The defect is a property of the working copy, not of the repository's configuration.

**It also means the substituted lane was faithful.** `npx vitest run --exclude '**/node_modules/**'
--exclude '.claude/**'` returned 36 files / 1 016 tests; `npm test` here returns **36 files /
1 016 tests**. The scoped biome invocation checked 61 files; `biome check .` here checks **64**
(the three extra are repo-root config/markdown files outside `src tools spike vitest.config.ts`),
and both are clean. Nothing was hidden by the substitution.

## Every gate step, run by QE, in workflow-05 order

| step | command | result |
|---|---|---|
| lint | `npm run lint` (**recorded**, `biome check .`) | **exit 0 — 64 files, no fixes applied**, 105 ms |
| typecheck | `npm run typecheck` | **exit 0** |
| unit | `npm test` (**recorded**, `vitest run`) | **exit 0 — 36 files, 1 016 tests passed, 0 failed, 0 skipped**, 2.18 s |
| build | `npm run build` | **exit 0** |
| e2e | — | `UNKNOWN - verify` per `AGENTS.md`; `quality.ui_e2e` is `ui-or-critical-path` and there is no UI surface |
| test-integrity (count) | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test-integrity (check) | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |

All four `quality.mandatory_gates` (`lint`, `typecheck`, `unit`, `build`) pass by their recorded
commands. Nothing was softened, and no self-fix attempt was consumed — nothing failed.

## The opt-in deep lanes, also re-run by QE

| lane | result |
|---|---|
| `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` | **exit 0 — 23 passed**, 98.41 s |
| `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **exit 0 — 32/32**, 36.01 s |
| `SEARCH_DEEP=1 npx vitest run src/search.test.ts` | **exit 0 — 41/41**, 22.47 s |

Every figure the engineer's `artifact-ref` note recorded is reproduced. **The engineer's gate
numbers are accurate.**

## The A1 figure re-measured — a different position, the same shape

The deep lane's own stdout, from MY run:

```
A1 worst case: position-5/b1c3 3030 ms at completed depth 4; over 3 s: 29/30
NFR-005 kiwipete: completed depth 4, 91184 nodes, 3021 ms
NFR-005 position-6: completed depth 3, 114734 nodes, 3025 ms
A2 real clock: 70 ms at completed depth 2
```

The engineer reported **3 027 ms on `position-4/f3d4`**; I measured **3 030 ms on
`position-5/b1c3`**. **The worst-case POSITION moved and the worst-case NUMBER did not** — 3 027
vs 3 030 ms, and 29/30 both times. That is the signature of a machine-wide granularity floor
rather than of one pathological position, and it is the first piece of evidence for the
attribution I test properly in the `decision` note on `A1`.

`NFR-005`'s numbers reproduce within noise (kiwipete depth 4, `position-6` depth 3 — both below
the row's depth-6 FAIL floor). **I do not rule `NFR-005`; it is Security/NFR's.** Recorded here
only because I ran the lane and the figures are mine.

Every number in this note is true of Apple M3 (Mac15,13) and of nothing else.
