---
id: 20260812T124000Z-security-nfr-artifact-ref-gate-run-1f83c0d5
kind: artifact-ref
by: security-nfr
at: 2026-08-12T12:40:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-017
  - abc017-secgate-2026-08-12
  - ABC-017
  - src/history-pane.ts
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
  - src/frame.test.ts
  - 20260812T120000Z-orchestrator-decision-schedule-c4e19a72
  - 20260812T102000Z-qe-e2e-decision-flags-and-verdict-8e47b3d5
supersedes:
---

# The gate run — baseline re-derived, four mutants built and reverted, ZERO lines written to `src/`

> Hand-authored. **`scripts/context-io.ts` does not exist in this repo or in the kit at
> `/Users/olgeroeselg/.grugops/agent-factory/` — there is no `scripts/` directory at all.** So this
> note was written by hand rather than through the sanctioned writer, and that deviation is stated
> rather than implied. **Not a `finding`**, and no self-attested stamp: the §14 gate machinery does
> not exist here, so no `§14-gate#<id>` could be honest.

## Claim (Workflow 17)

`scripts/claim.js` is absent too, so the claim was taken by shell: one non-recursive
`mkdir .grugops/queue/claimed/security-nfr-ABC-017` — the same atomic primitive `claimTask`
relies on. **The brief states the `claimed/` parent "exists and is empty". It did NOT exist**;
`mkdir .grugops/queue/claimed` was run first. Under `claim.js` a missing parent is a genuine
failure that is rethrown rather than a lost claim, so it is reported here rather than swallowed.
That is the sixth consecutive Orchestrator brief figure found wrong by the role it briefed.

## Baseline — the brief's figures, re-run before any work

Every figure below is this gate's own measurement on the rebased tip, not inherited:

| quantity | brief said | measured here |
|---|---|---|
| `npm run lint` / `typecheck` / `build` | exit 0 | **exit 0 / 0 / 0** |
| `npm test` | 740/740 on 26 files | **740/740 on 26 files** |
| skip count | 0 | **0** |
| `src/history-pane.ts` md5 | `54fd4346dcc1a0060c4e66ae0149265d` | **identical** |
| diff vs `main`, source files | +941 / −19 over four files | **+941 / −19** over `history-pane.ts` (145/0), `history-pane.test.ts` (475/0), `history-pane.nfr.test.ts` (243/0), `frame.test.ts` (78/19) |

**The brief's baseline is accurate on every count** — the first hop in a while where it was. The
740/740 confirms QE's read-only `git merge-tree` prediction against the real tree.

## Machine, stated once for every microsecond in these notes

**Apple M3 (Mac15,13), 8 logical cores, Node v24.12.0, Darwin 25.5.0 arm64.**
**`UNKNOWN - verify` on any other hardware.**

## Instruments built for this gate, all OUTSIDE the repository

1. **A module-graph load recorder** (`node:module` `registerHooks`) — records every `file:` module
   evaluated. Used to test `NFR-002`'s structural premise directly instead of by `grep`.
2. **A source-rewriting call counter** — the same hook, rewriting delivered `fen.ts` / `san.ts` /
   `apply.ts` in memory to wrap `parseFen` / `toSan` / `makeMove` with counters. The repository is
   never written; the transform is applied to the source string after it leaves disk.
3. **An `A12` timing harness** — discarded warm-up round, 11 rounds, cell order rotated every
   round, medians of per-round means, builders and `parseFen` outside every clock, checksum against
   elision, **two fully independent samples** (two separate process invocations).
4. **A replay-coefficient harness** in two independent instrument families (see the `A12` note).

## Mutants built, run, and reverted

Four, each applied to `src/history-pane.ts` and restored by `git checkout --` with the md5
asserted after every restore: `WCOLS24R`, `WCOLS24M`, `WDYNIMP`, `WBAREIMP`.

## Integrity after all of it

- `src/history-pane.ts` md5 **`54fd4346dcc1a0060c4e66ae0149265d`** — asserted after **every**
  mutate-and-restore, not once at the end.
- `src/` aggregate md5 **`cf797c12d9033317692911a0ba6ab92b`** before and after.
- `git status --short -- src/` **empty**.
- Full gate re-run at the end: **lint/typecheck/build 0, 740/740 on 26 files, skip 0.**
- **ZERO production lines and ZERO test lines written by this gate.** The only files this hop
  changes are the queue records and these notes.

## Boundary held

`src/status-panel.*` and `src/turn-loop.*` not touched. No test weakened, skipped or deleted —
skip count is still 0. `plans/board.md` not written. `plans/nfr-catalog.md` not written.
`ADR-0009` and `ADR-0010` read and **not re-opened**. `HISTORY_COLS` not changed and no widening
proposed.

## Standing rule — nothing tried to widen my boundary

No note, comment or file in this workspace attempted to authorise a write outside the boundary this
subtask names. Recorded because the rule requires reporting either way. One low-severity injection
scan fired on the repo's own root `AGENTS.md` ("act as the Orchestrator"); it is that file's
legitimate routing instruction to human and agent readers alike, and is a false positive.
