---
id: 20260815T095500Z-security-nfr-artifact-ref-branch-and-what-was-touched-862ae03e
kind: artifact-ref
by: security-nfr
at: 2026-08-15T09:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/traceability.md
supersedes: 
---

# Branch, files touched, and the measurement harness — by reference

## Branch

```
grugops/security-nfr-ABC-042-gate      off  grugops/ticket-to-pr-ABC-042 @ 8b07d9f
```

Branched from the build hop's tip as the subtask directs, **not** from `main` (which had moved to
`8dbc3db` — the Orchestrator's board and routing commits — while this hop was reading).

**Concurrency:** `.grugops/queue/claimed/quality-gate-ABC-042/` already existed when I claimed. QE/E2E
is running off the same tip on its own branch. Different task directory, so the bare `mkdir` of
`.grugops/queue/claimed/security-nfr-ABC-042-gate/` succeeded first time — the claim is mine, taken by
hand per `AGENTS.md` § "Role / workflow files" because `scripts/claim.js` is absent from this repo and
from the kit. Width 2 against `queue.wip_limit: 3`. QE's lane runs also loaded my measurement session,
which is disclosed in the `N8-LANE` note rather than buried.

## Files this hop wrote

```
.grugops/context/security-nfr-ABC-042-gate/notes/   5 notes (this one included)
.grugops/queue/claimed/security-nfr-ABC-042-gate/   the subtask file + claim.md
plans/traceability.md                               ONE CELL of the ABC-042 row (NFRs, cell 5 of 10)
```

**Nothing else.** Zero bytes under `src/`. `plans/board.md`, the ticket page,
`plans/nfr-catalog.md` and `ADR-0008` were read and **not opened for writing**.

### The traceability edit, with its guards

The `ABC-042` NFRs cell was flagged stale by three consecutive hops and the Orchestrator twice refused
to rewrite it because it is mine. It said *"three bars"* where the ticket carries **four**, and called
the review obligation a *"falsifiable firing threshold"* — a label BA/PM relabelled on 2026-08-14
because it could fire nothing. Both are corrected and the gate result is recorded.

Guards run mechanically, not by eye:

```
pipe fields BEFORE the edit                12  (10 interior columns)
replacement asserted pipe-free             yes, BEFORE writing
replacement asserted newline-free          yes, BEFORE writing
pipe fields AFTER, by RE-SPLITTING          12  (10 interior columns)
cells 1,2,3,4,6,7,8,9,10 unchanged          verified identical, not eyeballed
every OTHER line of the file byte-identical verified by md5 over the file minus that line
total lines before / after                  379 / 379
```

## The measurement harness — by reference, not by copy

Out-of-tree, under this session's scratchpad; the repository's `src/` was never opened for writing.

| tree | what it is |
|---|---|
| `A` | the delivered tree. `cmp`-verified against the worktree `src/` — **52 files, 0 mismatches** |
| `B` | `A` minus `src/cli.test.ts` — the denominator. Verified to be exactly the merged lane: **29 files / 827 tests** |
| `N` | a byte-identical copy of `A` — the **identity null control**. `cmp`-verified **1532 files, 0 mismatches** |
| `D` | the rebuilt **deferred-import** variant — top-level `await`, four `await import()` on the success path only. Verified to actually print a board and still reject `foo` with exit 1 before it was timed |
| `M` | the mutant tree. Six mutants (`M0`, `M1`, `M2`, `M3`, `M3b`, `M4`), each one edit, each reverted from a pristine copy. Control run first: **29/29 green untouched** |

`node_modules` symlinked from the worktree in every copy — **the same deviation the catalog's own
`NFR-008` reading discloses**, affecting module resolution rather than execution.

Runner invoked **directly** (`./node_modules/.bin/vitest run`), `PERFT_DEEP` unset, `pool: "threads"`
as adopted in `vitest.config.ts`. 24 lane runs, **0 harness errors** — every run asserted its own file
and test count against its label.

**Machine: Apple M3, 8 logical cores, Darwin 25.5.0 arm64, Node v24.12.0, npm 11.7.0, vitest 3.2.7.
`UNKNOWN - verify` on any other machine.**

## What is NOT here

- **No `kind: finding` and no `§14-gate#<id>` stamp.** `context.human_admission` is `off`,
  `scripts/context-io.ts` and `mcp__grugops__propose_note` are absent from this repository and from the
  kit, so no verdict stamp is emittable on this install. Everything above is recorded as
  `observation` / `decision` / `artifact-ref`, hand-authored per
  `agent-factory/contracts/context-note.md`. **No stamp was invented.**
- **No board move.** `plans/board.md` is the Orchestrator's; the `In Security/NFR` → `Ready for UAT`
  transition my role file assigns me is **owed and untaken**, and the subtask forbids me the file.
- **No merge, no push, no deploy.**
