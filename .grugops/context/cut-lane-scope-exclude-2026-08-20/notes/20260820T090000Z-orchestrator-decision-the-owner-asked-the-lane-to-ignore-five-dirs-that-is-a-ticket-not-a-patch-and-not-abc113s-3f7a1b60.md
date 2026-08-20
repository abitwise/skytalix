---
id: 20260820T090000Z-orchestrator-decision-the-owner-asked-the-lane-to-ignore-five-dirs-that-is-a-ticket-not-a-patch-and-not-abc113s-3f7a1b60
kind: decision
by: orchestrator
role: orchestrator
task: cut-lane-scope-exclude-2026-08-20
at: 2026-08-20T09:00:00Z
verified_by:
confidence: high
refs:
  - ABC-113
  - ABC-050
  - ABC-108
  - ABC-111
  - ABC-026
  - NFR-008
  - ADR-0008
  - vitest.config.ts
supersedes:
---

# The owner asked the lane to ignore `.claude .gemini .github .grugops .git`. That is a TICKET, not a patch — and it is NOT `ABC-113`'s

## The request, and the fact that it is ALREADY A KNOWN DEFECT rather than a new idea

The owner said in session, 2026-08-20: *"when running tests, it should ignore folders `.claude`
`.gemini` `.github` `.grugops` `.git`."*

**He is describing a defect this project already FOUND, MEASURED and DELIBERATELY DID NOT PATCH.**
`plans/board.md` carries it in those words: *"GATE INTEGRITY DEFECT FOUND AND NOT PATCHED:
`vitest.config.ts` declares NO `exclude`, so an in-repo agent worktree makes the default lane report
ANOTHER BRANCH's red as `main`'s — measured **245 files / 6993 tests** against a lane `NFR-008` sizes
for 999, and `npx vitest run src/` does NOT scope it."*

Confirmed at this hop: `vitest.config.ts` sets `pool: "threads"` and **nothing else** — no `include`,
no `exclude`. The request is correct and the defect is real.

## Why it is NOT folded into `ABC-113`, which is running right now

`ABC-113`'s own page says it in capitals: **"ZERO PRODUCTION LINES. If this ticket grows a non-test
file under `src/`, it is the wrong ticket."** `vitest.config.ts` is not under `src/`, so `A3` would
**not** catch this being slipped in — which makes the fence weaker here, not stronger, and is exactly
why the discipline has to come from routing instead of from an assertion.

Worse, it would **break `ABC-113`'s own instrument**: `A4` pins the lane at **40 files / 1207 tests /
skip 0, unchanged**. Changing what the lane collects is the one edit that makes that criterion
meaningless. **The ticket that exists to stop dead rows must not ship a dead row.**

## Why it needs a cut ticket rather than a one-line fix — three reasons, each checkable

1. **It changes the meaning of every gate figure this project has recorded.** Four hops have worked
   around this by hand with `--dir src` or an explicit `--exclude`. A real `exclude` in the config
   makes the default lane and the workaround lane the same number for the first time — and **that
   number must be measured and written down, not assumed to be 1207.**
2. **`NFR-008` is live and contested.** `ABC-108` is open (CPU clause **BREACHED**), `ABC-111` is open
   (the wall clause's measurement protocol **UNSETTLED**). Shrinking what the lane collects moves the
   very number those two tickets are arguing about. **Landing this quietly would hand both of them a
   changed baseline mid-argument.**
3. **`ABC-050` is open and is about THIS FILE having no guard.** Its finding: no static tool reads
   `vitest.config.ts` — `biome.json` and `tsconfig.json` both exclude it, and the file's own header
   says so. **A mistake here is caught only by the lane actually running.** BA/PM must decide whether
   this rides `ABC-050` or is its own ticket; that is a cut, and cuts are BA/PM's pen, not mine.

## Why it is QUEUED and not running in parallel — the honest reason, which is NOT the WIP limit

`queue.wip_limit` is **3** and only **1** agent is running, so the cap is not what is stopping this.
**The shared working tree is.** Both this cut and `ABC-113`'s engineer write `plans/board.md`, and two
concurrent writers on one checkout is a merge conflict I would be manufacturing on purpose. The
alternative — an isolated worktree — would plant a **33rd** in-repo agent worktree, which is the very
thing the owner just asked to be excluded. **So: sequential, one tree, and the reason is recorded
rather than dressed up as a limit.**

Queued at `.grugops/context/cut-lane-scope-exclude-2026-08-20/pending/cut-lane-scope-exclude.md`.
It runs the moment `ABC-113`'s engineer hands back.

## What is NOT decided here

- **The `exclude` globs themselves.** `.git` is already never collected by vitest, and `.claude` is
  where the 32 worktrees live — the two are not the same kind of entry, and pretending they are would
  ship a config whose author did not know what each line was for. BA/PM cuts it; the engineer measures it.
- **Whether `npm run lint`'s red is the same defect.** The `biome check .` red on the 32 gitignored
  worktrees was retired at `ABC-044` as environmental. It smells like a sibling of this, and it is
  **noted, not merged into it.**
