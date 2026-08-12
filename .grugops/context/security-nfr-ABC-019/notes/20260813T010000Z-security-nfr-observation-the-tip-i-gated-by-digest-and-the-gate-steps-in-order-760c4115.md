---
id: 20260813T010000Z-security-nfr-observation-the-tip-i-gated-by-digest-and-the-gate-steps-in-order-760c4115
kind: observation
by: security-nfr
at: 2026-08-13T01:00:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-028
  - ABC-029
  - ADR-0009
  - ADR-0010
  - ADR-0011
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - src/turn-loop.nfr.test.ts
  - plans/tickets/ABC-019-turn-loop-skeleton.md
supersedes:
---

# The tip I gated, by digest — and the Workflow 05 steps run in order on it

> **`kind: observation`, not `finding`, and that is forced rather than chosen.** There is no
> `§14-gate` verdict record under this task and `context.human_admission` is **`off`**, so no
> `finding` may be written and nothing is self-stamped. **`scripts/context-io.ts` and
> `scripts/claim.js` do not exist here** — verified at source at this hop: there is no `scripts/`
> directory in this worktree at all. These notes are **hand-authored**, and there is no derived
> `index.md` / `index.jsonl` — `notes/` is the source of truth. The Workflow 17 claim was likewise
> taken **by hand**: `mkdir -p` for the missing `claimed/` parent, then a **bare `mkdir`** (no `-p`)
> on `claimed/security-nfr-ABC-019/` itself, so the atomicity the protocol rests on is preserved —
> an existing directory would have failed `EEXIST` = claim lost. It returned success = claim won.

## THE TIP IS NOT `ABC-019` ALONE, AND THAT IS THE FIRST THING TO RECORD

`HEAD` = `8acca814c0661512a289d431f82f0190e56c8b32` on `grugops/security-nfr-ABC-019`.

- `git log main..HEAD` = **58 commits**. `git log HEAD..main` = **0** — the branch is not behind.
- `git diff main --name-only -- src/` = **six** files, and only three of them are this ticket's:

| file | md5 | whose |
|---|---|---|
| `src/turn-loop.ts` | `bd793612476c9d0eac28b75e1e3297cc` | **`ABC-019`** — ADDED |
| `src/turn-loop.test.ts` | `de41212df773ea8b1dab458db3973e21` | **`ABC-019`** — ADDED |
| `src/turn-loop.nfr.test.ts` | `d48a0eb3a53a14e55972418614b8bdf2` | **`ABC-019`** — ADDED |
| `src/history-pane.ts` | `c4653c4c263c4c417ea34969164ccd86` | `ABC-028`/`ABC-029` — MODIFIED |
| `src/history-pane.test.ts` | `9533f05038780def980bf5a86707cdbd` | `ABC-028`/`ABC-029` — MODIFIED |
| `src/history-pane.nfr.test.ts` | `16bf2f50c93e2e896b5406cbfa772b8b` | `ABC-028`/`ABC-029` — MODIFIED |

`src/turn-loop.ts` md5 `bd793612…97cc` **matches the Orchestrator's record and the ticket's own
sixth- and seventh-hop records exactly** — the same hash it has carried since delivery, unchanged
across the rebase and unchanged under this gate.

Other inputs gated, by digest: `package.json` `57f06804…`, `biome.json` `8906099a…`,
`tsconfig.json` `5adfe6d4…`, `plans/nfr-catalog.md` `9d849abe…`, `.grugops/factory.config.json`
`23152bd4…`, `plans/tickets/ABC-019-turn-loop-skeleton.md` `60fa8cc7…`.

**A green gate on this tip attests to the COMPOSITE, not to `ABC-019` in isolation, and merging this
branch merges `ABC-028` and `ABC-029` with it.** That is recorded as risk `R-D` in the verdict note.
It is a merge-hygiene fact, not a defect, and it is not mine to resolve.

## Workflow 05 step 3 — the gate, in order, commands taken from `AGENTS.md` and never invented

| step | command | result |
|---|---|---|
| install | `npm install` | not re-run — `node_modules` is a symlink to the primary worktree's, unchanged by this branch (`package.json` / `package-lock.json` diff vs `main` = **0 lines**) |
| **lint** | `npm run lint` (`biome check .`) | **exit 0.** 49 files checked, 0 errors, **2 infos** — both the `biome migrate` schema notice on `biome.json`, pre-existing on `main` and unrelated to this change. `quality.lint.strict` is `false`, so infos are reported and only errors fail. **PASS** |
| **typecheck** | `npm run typecheck` (`tsc --noEmit`) | **exit 0. PASS** |
| **unit** | `npm test` (`vitest run`) | **exit 0 — 807/807 passed on 28 files**, 1.57 s wall. **PASS**, and identical to the Orchestrator's own measurement |
| **build** | `npm run build` (`tsc --noEmit`) | **exit 0. PASS** — honestly a typecheck wearing the build slot's name, as `AGENTS.md` says in its own words |
| e2e | `AGENTS.md` records `UNKNOWN - verify` | **not triggered.** `quality.ui_e2e` is `ui-or-critical-path` and this project has no UI surface and no CLI entry point. Recorded `UNKNOWN - verify`, non-blocking — never a faked pass |
| **skip count** | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **`0`** — a genuine, measured zero, not a silent one |
| **test-integrity** | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **exit `2`** — `cannot read the registry file`. Recorded as an ERROR distinct from a clean fail, **never read as a pass.** This is inherited risk **`S-2`**; see the verdict note |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **absent from this repo** (no `scripts/` directory). Recorded `UNKNOWN - verify`, non-blocking per Workflow 05 |
| auto-UAT live E2E | `npm run test:e2e` | **no such script** in `package.json`. Recorded `UNKNOWN - verify`, non-blocking |

**No self-fix attempt was consumed, because nothing was red.** The test-integrity result is exit `2`,
not exit `1`, so the human-only short-circuit in Workflow 05 step 4 does **not** fire.

## Coverage — deliberately NOT run, and the reason is on the record

`quality.coverage_threshold` is `0.8` and it is **not** in `mandatory_gates`. `coverage/` is **tracked
and not git-ignored** in this repo, so a coverage run dirties the worktree — a prior gate hit exactly
that and had to restore it. The coverage headline is already an owned item: **`N-2`**, recorded at
`ABC-029`'s gate (the report has no `include`/`exclude` and scoops in `tools/grugops/*.js`, so the
headline reads 78.6% while `src/` is 100%, and the first gate that enforces the threshold
mechanically would report a **false miss**). **Referenced, not re-derived**, per this subtask's own
instruction.

## Worktree state

`git status --porcelain` before my work: **clean**. After: only the queue and context files this hop
authored. **`src/` was not opened for edit — no required fix demanded it.** Every measurement in the
sibling notes ran **out of tree**, from a fresh scratchpad root created for this hop alone (the
cross-hop scratchpad hazard the brief named was taken seriously: a new root, nothing inherited).
