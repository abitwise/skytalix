---
subtask: bapm-cut-ABC-173
role: ba-pm
ticket: ABC-173
branch: grugops/bapm-cut-ABC-173 (from 6cfc1be9)
worktree: ../wt-bapm-cut-ABC-173
commit: 5e9a1214
---

# Done: ABC-173 cut (S, P1, Backlog, DoR 9/10)

- **Commit:** `5e9a1214` on `grugops/bapm-cut-ABC-173`. It is not pushed and not merged. Records only. Nothing in
  `src/`, `vitest.config.ts`, `package.json`, `plans/board.md` or `plans/traceability.md` was touched. No timing
  was read.
- **Page:** `plans/tickets/ABC-173-cap-vitest-at-two-cores-and-a-two-gb-heap-ceiling-that-every-lane-applies.md`
- **Notes** (hand-authored and unsealed, because `context-io.ts` is absent):
  - `.grugops/context/bapm-cut-ABC-173/notes/…7e3b19d4` (decision);
  - `…2c9d5a61` (claim, `UNKNOWN - verify`: the vitest 4.1.11 source reading and the Node heap probe).

## Criteria summary
- **Meanings adopted (Q1-Q3):**
  - "2 cores" = ≤ 2 busy executors (a worker, or the sync child it is blocked on). The main thread counts as
    overhead.
  - "2 GB" = Σ `heap_size_limit` ≤ 2048 MiB over the isolates live at once. RSS is reported, not gated.
  - The scope is all 10 `AGENTS.md` vitest lane commands.
- **CPU:**
  - `C1`: `ABC-144` `A7` and `ABC-152` `V3` stay byte-identical and green.
  - `C2`: a static row finds no async `child_process` form in `src/**/*.test.ts`, with ≥ 4 sync sites for
    non-vacuity. `CLI_DEEP` must keep its children serial.
- **Memory:**
  - `A1`: step 1 re-verifies the `resourceLimits` question, citing file:line.
  - `A2`: the budget table sums to ≤ 2048 MiB.
  - `A3`: every lane carries the limit, shown by armed reds on the default lane, `CLI_DEEP` and `INPUT_DEEP`.
  - `A4`, `A5`, `A6`: the limit is shown applied in a worker (`isMainThread` false), in the main process, and in
    each of the 4 Node spawn sites.
  - `A7`: every lane keeps its pass and skip counts with no out-of-memory error. Peak `heapUsed` is recorded.
  - `A8`: every pin touched is named.
  - `A9`: `NFR-008` wall ≤ 10 s at load1 ≤ 8. The 3 s in the brief is the struck level.
- **Step-1 evidence (claim):** the answer is likely **"none"**.
  - vitest 4.1.11 builds `new Worker(…, { env, execArgv, stdout, stderr })` (`cli-api.CnMVyzaz.js:3229`). It
    passes no `resourceLimits`; `dist/` has 0 hits for it.
  - The 4.x top-level `execArgv` key exists, but Node rejects a heap flag in worker `execArgv`
    (`ERR_WORKER_INVALID_EXEC_ARGV`).
  - `vmMemoryLimit` applies to vm pools only.
  - Fallback: with `NODE_OPTIONS=--max-old-space-size=N`, every isolate reads the same limit (600 → 696 MiB), so
    the main process and its workers cannot be split.
- **Pins named:**
  - `ABC-144` `A7`;
  - `ABC-152` `V3`;
  - `ABC-042` `A10` `SCRIPTS_AT_HEAD`, which goes red if `scripts.test` changes;
  - the `run-bounded.js` header;
  - `ABC-119` `CHILD_ENV` = `{}` and `CHILD_ARGS`;
  - `N8_SPAWN` = 27;
  - `ADR-0008` decision 7;
  - the `vitest.config.ts` header block;
  - the `AGENTS.md` lane lines (at their byte budget per `ABC-164`).
- **Staleness:** `ABC-146` `A0` fires, and that is accepted. `ABC-174` takes its readings after `ABC-173` merges.

## Architect-first recommendation
**Yes: write a short `ADR-0008` addendum before the SE.** It rules on:
- where the limit lives, so that the `npx vitest run` lane commands carry it as well as `npm test`;
- the budget table (arithmetic: uniform ≤ 341 MiB across 6 isolates);
- the `INPUT_DEEP` `NODE_OPTIONS=--expose-gc` collision;
- how the `CLI_DEEP` child gets its flag under the `CHILD_ENV` pin;
- whether a setup entry is allowed in `vitest.config.ts`;
- `N8-LANE` / `ADR-0035` admissibility, i.e. whether the merge needs a fresh baseline.

## Owner questions
- **Q1.** Is "2 GB" the summed V8 heap limit, with RSS not gated? *Recommend yes.*
- **Q2.** Does "2 cores" mean 2 busy executors, not a hard 2.0 cores (which would need `maxWorkers: 1`)?
  *Recommend yes.*
- **Q3.** Does the cap cover all 10 `AGENTS.md` lanes? *Recommend yes.*
- **Q4.** Which one gives way: a lane that runs out of memory, or `npm test` wall going past 10 s? *Recommend:
  neither moves without his word.*

## DoR
**9/10.** The one check not met is "no major unresolved blocker": the `ADR-0008` addendum and Q1/Q2 are still
open. The ticket stays in `Backlog`. Board placement is the Orchestrator's.

## Trace row (for the Orchestrator to append; columns: Ticket | Title | Epic | Feature | NFRs | Code | Tests | UAT | Release | Status)
| ABC-173 | Cap this repo's vitest at 2 busy executors and Σ `heap_size_limit` ≤ 2048 MiB, applied in every `AGENTS.md` lane (owner word `…c4a8e1f6`, 2026-10-19). Cut by BA/PM, subtask `bapm-cut-ABC-173` (`5e9a1214`) | — | — | `NFR-008` (wall ≤ 10 s, CPU reported), `N8-LANE` re-based (`ADR-0035`); memory 2048 MiB; CPU 2 executors | TBD by the `ADR-0008` addendum: `vitest.config.ts` and/or `package.json` / `AGENTS.md` lane lines, `src/cli.real-engine.test.ts` spawn argv; 0 production `src/` lines expected | `C1` (`A7`/`V3` unchanged), `C2` serial children, `A1` step-1 verify, `A3` armed reds ×3 lanes, `A4`/`A5`/`A6` heap probes, `A7` all lanes green | — | — | Backlog (DoR 9/10; awaits `ADR-0008` addendum + owner Q1-Q4) |
