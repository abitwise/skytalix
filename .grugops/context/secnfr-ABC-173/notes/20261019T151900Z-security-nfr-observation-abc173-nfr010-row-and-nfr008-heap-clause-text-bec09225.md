---
id: 20261019T151900Z-security-nfr-observation-abc173-nfr010-row-and-nfr008-heap-clause-text-bec09225
kind: observation
by: security-nfr
task: secnfr-ABC-173
at: 2026-10-19T15:19:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-173
  - NFR-010
  - NFR-008
  - ADR-0008
  - ADR-0035
  - RISK-ABC173-TEARDOWN
  - RISK-ABC173-STATE
  - 20261019T113000Z-orchestrator-decision-owner-word-vitest-cap-2-cores-2gb-c4a8e1f6
  - 20261019T124500Z-orchestrator-decision-owner-word-abc173-q1-q4-e7d2a915
  - 20261019T141500Z-orchestrator-decision-owner-word-adr0008-addendum-accepted-9f3b6e20
supersedes:
---

# `ABC-173`: the exact text of the proposed `NFR-010` row and of `NFR-008`'s heap clause. Not applied: the Orchestrator routes the edit

Hand-authored and unsealed. **`plans/nfr-catalog.md` is not edited by this hop.** The next free id is `NFR-010`:
`grep -c NFR-010 plans/nfr-catalog.md` reads 0, and the table ends at `NFR-009` (line 55). The column order is the
table's own: `| ID | Category | Target | Applies to | Verified by |`. Apply the row at `ABC-173`'s merge. Until then,
the "MET" in its last cell describes the branch tip only.

## A. The `NFR-010` row, verbatim (one table line)

```
| NFR-010 | Resource / memory | **Test-lane V8 heap ceiling: every vitest run keeps Σ `heap_size_limit` ≤ 2048 MiB over the Node isolates it has live at once, at its shape's peak concurrency.** Placed by Security/NFR (task `wave-2026-09-25`, subtask `secnfr-ABC-173`) from `ADR-0008` § ADDENDUM 2026-10-19 (Architect/Design; ACCEPTED by the owner 2026-10-19, `…9f3b6e20`), on the owner's word, verbatim: *"vitest needs to be capped to max 2 cpu cores and 2GB of memory"* (Olger Oeselg, 2026-10-19, `…c4a8e1f6`; Q1–Q4 `…e7d2a915`). **Two shapes, chosen by the run's resolved test-file count. SUITE (2 or more files):** flag `--max-old-space-size=128` → **224 MiB** per isolate × **9** live: the `run-bounded.js` wrapper (`npm test` only), the vitest main process, 2 workers running a file, **2 workers still terminating (an observed reserve; vitest 4.1.11 sets no bound)** and 3 Node children = **2016 MiB**. **ONE-FILE (exactly 1 file):** flag `--max-old-space-size=400` → **496 MiB** × **4** live (main, 1 worker, 2 Node children) = **1984 MiB**. **0 files: refused**, because the guard cannot look. **The value gated is `heap_size_limit` as read, not the flag** (on Node v26.11.1 the limit is the flag + 96 MiB). **Not counted (the owner's Q1):** the lane's own `npm`/`npx` client; non-Node children (`git`, `sh`, `head`); and **RSS, which is reported, not gated** (macOS has no cgroups). **Any isolate over its row, or Σ over 2048 MiB at a shape's peak = FAIL.** A lane that runs out of memory under its row goes to the owner. No row is raised without his word (Q4). **CPU is not this row's:** `maxWorkers: 2` (`ABC-144` `A7`; the addendum's Ruling 4). **Owners:** the level (2048 MiB) is Olger Oeselg's; the table (rows and counts) is Architect/Design's; this row is Security/NFR's. | Every vitest run in this repository: `npm test`, `npm run test:watch`, and every vitest command line in `AGENTS.md` (each `*_DEEP` lane, the single-file line, both coverage lines, the skip-count capture). The limit is set on the command as `NODE_OPTIONS=--max-old-space-size=<flag>`. `CLI_DEEP`'s empty-environment children get the lane's last `--max-old-space-size=<digits>` token in argv, before the entry point. **Not** `lint`, `typecheck`, `build`, `npm run chess` or `perft`, which keep Node's default. | **(a) Main process:** `tools/grugops/heap-guard.js`, the vitest `globalSetup`, reads `v8.getHeapStatistics().heap_size_limit` in the main process. Above the shape's row it throws, so the run exits 1 and no test runs. It hands the admitted row to the workers as `inject("heapRowMiB")`. **(b) Worker:** `src/cli.test.ts` `ABC-173` `A4` (`isMainThread` is false; limit ≤ row). **(c) Children:** `A6` `heapProbe` through `childOf`, the `A6 (static)` row, and the `CLI_DEEP` `A6` probe in `src/cli.real-engine.test.ts`. **(d) Commands and values:** `A3` checks that every `AGENTS.md` vitest line carries its shape's flag, equal to `FLAGS_MIB`. `ABC-042` `A10` pins `scripts.test` and `test:watch` byte for byte. The `A5` rows pin `ROWS_MIB`, `FLAGS_MIB`, both sums, the shape choice and the comparison (`9c97dd23`). **Each verifier was watched red:** QE `…3d7a91c4` (54 mutants) and the fix at `9c97dd23` (18/18 killed). **The live-isolate counts are an observation:** at most 4 live workers in 3 of 3 censuses (Architect 2, SE 1), which is the 2-worker reserve exactly (`RISK-ABC173-TEARDOWN`). The shape read rests on `vitest.state.getPaths()`, a public getter not documented as stable (`RISK-ABC173-STATE`; re-read at any vitest version change). **Status: MET at `ABC-173`'s tip `9c97dd23` on the counts and limits read, M3 reference, Node v26.11.1, vitest 4.1.11. `UNKNOWN - verify` on any other Node version (the flag-to-limit offset was read only on v26.11.1) and off macOS.** The row binds from `ABC-173`'s merge. |
```

## B. `NFR-008`'s heap clause, verbatim

**Where:** in the `NFR-008` row's Target cell, immediately after the sentence that ends
`… / Node v26.11.0 / vitest 3.2.7. v24.12.0 is no longer installed on this machine; figures taken on it are history.**`
(the "Reference stack RE-DECLARED 2026-10-10" sentence). Insert:

```
**Heap clause, from `ABC-173`'s merge (`ADR-0008` § ADDENDUM 2026-10-19 Ruling 5; `NFR-010`): the declared stack also fixes the V8 heap per isolate at 224 MiB (SUITE) / 496 MiB (ONE-FILE), set as `NODE_OPTIONS=--max-old-space-size=128` / `=400` on the lane command and refused at run start without it. `npm test` is the SUITE shape. Every `NFR-008` and `N8-LANE` arm runs its set's `AGENTS.md` form, prefix included. A reading taken before that merge is pre-cap: it is labelled pre-cap and not re-read (forward-only, the `ADR-0035` D4 shape). The full-lane `F` (1.72 s CPU / 3.25 s wall) stays, labelled pre-cap, until the first capped full-lane twin R replaces it outright. Each per-set `F` stays until that set's first capped reading replaces it.**
```

## C. Not part of either text, flagged for the router

The `NFR-008` declaration still names **Node v26.11.0 / vitest 3.2.7**. The stack every `ABC-173` hop read today is
**Node v26.11.1 / vitest 4.1.11** (vitest 4.1.11 merged with `ABC-152`, `7a920ca5`). Re-declaring the runtime is
outside the addendum's one clause and outside this brief, so I neither wrote nor drafted that change. Owner: the
`NFR-008` row's owner, Security/NFR, at the hop that takes the first capped `A9` reading, because that reading is
the first full-lane figure on 4.1.11.
