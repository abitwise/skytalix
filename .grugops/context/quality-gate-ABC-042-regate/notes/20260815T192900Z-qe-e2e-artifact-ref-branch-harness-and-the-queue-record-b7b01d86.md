---
id: 20260815T192900Z-qe-e2e-artifact-ref-branch-harness-and-the-queue-record-b7b01d86
kind: artifact-ref
by: qe-e2e
at: 2026-08-15T19:29:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - grugops/quality-gate-ABC-042-regate
  - grugops/abc042-integrated
  - agent-factory/workflows/16-context-read-write.md
  - agent-factory/workflows/17-task-claim.md
supersedes: 
---

# Branch, base, method, and what was NOT written

## Branch and base

- **Branch:** `grugops/quality-gate-ABC-042-regate`
- **Base:** `grugops/abc042-integrated` = **`238a7f6`**, the Orchestrator's merge of
  `grugops/design-ABC-042-adr0011-clause3` (`ab4c5c9`) and `grugops/ticket-to-pr-ABC-042-b1` (`c7b200f`)
  over `59ea767`. **`main` is NOT an ancestor** — `git merge-base --is-ancestor main HEAD` is false, and
  the merge-base is `7df25b9`.
- **Worktree:** `/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-qe042b`, added with
  `git worktree add -b …`. **The main checkout stayed on `main` and was never touched**;
  `git checkout main` was never run.

## Files this hop wrote

**Seven context notes** under `.grugops/context/quality-gate-ABC-042-regate/notes/` and **one queue
record** at `.grugops/queue/claimed/quality-gate-ABC-042-regate/claim.md`. **That is the complete list.**
No file under `src/`, `plans/`, `memory-bank/` or the kit was written, and none was left modified:
`git status --porcelain src/` is empty and all five files at risk are md5-identical to their pre-work
capture.

## The queue claim — taken by hand, per Workflow 17 and `AGENTS.md`

```
mkdir -p .grugops/queue/claimed          # parent
mkdir    .grugops/queue/claimed/quality-gate-ABC-042-regate   # BARE mkdir — the atomic act
```

The bare `mkdir` returned success, so the **claim was WON, not lost**. `scripts/claim.js` is absent from
this repository and from the kit, so `claimTask` / `transition` were not called and were **not faked**.
The `pending → claimed → done` file transitions belong to the Orchestrator here: the subtask file is
tracked on `main`, which is not an ancestor of this branch, so it does not exist in this tree and cannot
be renamed from it.

## Note I/O — recorded honestly, under the kinds this install permits

Per `AGENTS.md` § Role / workflow files and `.grugops/factory.config.json` (`context.human_admission`
is `off`): `scripts/context-io.ts`, `scripts/claim.js` and `mcp__grugops__propose_note` are **absent**,
so **no `§14-gate#<id>` verdict is emittable**. Every note here is hand-authored per
`agent-factory/contracts/context-note.md` as `observation` / `decision` / `artifact-ref`. **There is no
`kind: finding` in this folder, no verdict note, and no invented stamp** — including on a
`READY_FOR_HUMAN_REVIEW` result, where Workflow 05 would normally have `emitVerdict` produce one.

## The harness — outside the repository, and guarded on both sides

`/private/tmp/claude-501/…/scratchpad/` holds `mutate.mjs` (32 mutant runs), `probe.mjs` (independent
criterion probes), `closure.mjs` (the runtime import closure behind the `PERFT_DEEP` ruling),
`lane.mjs` (the interleaved lane measurement) and `famcost.mjs`. **Nothing was written into the
repository by any of them** beyond the temporary mutations, each of which was reverted by byte copy and
verified.

`E4` — the false `SURVIVED` a previous census published — was caused by reverting mutants with
`git checkout -- src/`, which also reverted the uncommitted instrument. My harness therefore:

1. captures **pristine bytes + md5** of all five files at risk before the first mutant;
2. applies every mutant as an **anchored replacement that aborts unless the anchor occurs exactly once**,
   then proves the file changed on disk;
3. asserts the **instrument's md5 before AND after every run** against the variant that run is measuring
   — a drift throws rather than returning a result;
4. restores by **byte copy from the pristine capture, never `git checkout`**, then compares every md5 and
   asserts `git status --porcelain src/` is empty.

**The guard fired for real:** the first `MP10` run touched `src/history.ts`, which I had not listed as
protected. The harness refused to complete and then refused to start again on the dirty tree, rather than
silently measuring a modified module. I restored it, added it to the protected set, and re-ran.

## Explicitly NOT written, NOT opened, NOT done

- **`plans/board.md`** and **`plans/traceability.md`** — the Orchestrator's, reserved by the subtask.
- **`plans/tickets/ABC-042-…md`** — the ticket page. Read (the current, repaired text on this branch),
  never edited.
- **`plans/nfr-catalog.md`** and **`memory-bank/50-decisions/ADR-0008-…md`** — owner-ratified. Not opened
  for writing. **No target, bar, level or ratified figure moved.**
- **`.grugops/test-skips.md`** — human-owned. Read, and run against (`--skip-count 0`, exit 0). **No row
  written.**
- **`memory-bank/50-decisions/ADR-0011-…md`** — Architect/Design's. Read, cited, line-checked, not edited.
- **`src/`** — nothing. **Zero production bytes and zero test rows changed by this gate.**
- **The kit** at `/Users/olgeroeselg/.grugops/agent-factory` — read only.
- **Not merged. Not pushed. Not deployed. `main` never checked out.**
