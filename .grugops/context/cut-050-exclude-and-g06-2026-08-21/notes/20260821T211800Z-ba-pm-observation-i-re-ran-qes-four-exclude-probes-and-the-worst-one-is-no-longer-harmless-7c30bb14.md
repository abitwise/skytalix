---
id: 20260821T211800Z-ba-pm-observation-i-re-ran-qes-four-exclude-probes-and-the-worst-one-is-no-longer-harmless-7c30bb14
kind: observation
by: ba-pm
role: ba-pm
task: cut-050-exclude-and-g06-2026-08-21
ticket: ABC-118
at: 2026-08-21T21:18:00Z
verified_by: ""
confidence: high
refs:
  - ABC-118
  - ABC-050
  - vitest.config.ts
  - NFR-008
supersedes: ""
tree: main @ 565c623 (probes run from replacement configs outside the repository; `vitest.config.ts` never edited)
---

# I re-measured the `exclude` residual at my own hand. **The mutant QE rated LEAST harmful is today the MOST harmful**, and the sentence that justified the rating has expired.

**Hand-authored `observation`. `context.human_admission` is `off`; no `finding` is admissible and
this carries no stamp.** Every number below is my own run on 2026-08-21, not a copy.

## What is actually in the tree, measured before anything else

| fact | measurement |
|---|---|
| default lane collects | **40** files (`npx vitest list --filesOnly`) |
| default lane runs | **40 passed / 1213 passed**, 3.95 s duration, real 4.55 s, user 14.88 s, sys 1.68 s |
| live in-repo worktree | **`.claude/worktrees/residual-gqe115-3` EXISTS** (`git worktree list`, branch `grugops/residual-gqe115-3` @ `281807f`) |
| its test files | **40 `*.test.ts`** — one for one with the real lane |
| its visibility | `git check-ignore -v` → `.gitignore:17:.claude/worktrees/` — **invisible to `git status` and to every gate except the `exclude` glob** |

## The four probes, re-run

| mutant (one type-valid `exclude` string) | collected | ran | verdict |
|---|---|---|---|
| baseline | 40 | 1213 | green |
| add a glob deleting one file | **39** | — | green |
| `".claude/**"` → `".cluade/**"` | **80** | **2426 passed** | **GREEN**, real 5.32 s, user 29.90 s, sys 3.45 s |
| exclude a not-yet-existing guard file | **40** | — | green, **completely silent** |

## THREE DISAGREEMENTS WITH THE RECORD, all three written onto `ABC-118`

**1. QE's probe 4 is recorded as "GREEN, counts IDENTICAL" and as "harmless only because the 37
agent worktrees were deleted". BOTH HALVES HAVE EXPIRED.** The counts are **not** identical today —
they double, 40 → 80 files and 1213 → 2426 tests — and it is **not** harmless, because a live
checkout is sitting in the repository right now. The recorded claim was true when written. **It was
a claim about the CONTENTS OF A DIRECTORY, and directories change; that is why it went stale in a
day.** This is why `ABC-118` `A2` requires the delivering hop to CREATE a throwaway checkout rather
than quote a number from any page, including this one.

**2. `ABC-050`'s `## Out of scope` does NOT fence the lane-inventory assertion "by name".** Both
QE's verdict and the Orchestrator's note say it does. Read at lines 60–74: **seven bullets, and none
names it.** The nearest is *"A CI job, a pre-commit hook, or any control over config drift beyond the
two tool scopes."* **The fence holds in SUBSTANCE and the scoping conclusion is unchanged — only the
claim about how it was written down is false.** Recorded because this factory cut `ABC-113` and
`ABC-114` over exactly this defect class.

**3. The lane is further over `NFR-008` than the last reading.** QE read ~15.6 s CPU / ~3.3 s wall on
2026-08-20. I read **~16.5–17.3 s CPU / ~4.1–4.3 s wall**. **This is a READING, not a
re-ratification** — 5 rounds on a scratch copy, not the ratified ≥ 7-interleaved protocol on the
reference machine — and it is reported to `ABC-108`, which owns the total. The lane has also grown:
1189 tests at `ABC-043`'s QE hop, 1207 at `ABC-050`'s, **1213 today**.

## A method trap I paid for, recorded so the next hop does not

**`npx vitest list --exclude <glob>` APPENDS to the config's array; it does not replace it.** My
first inflation probe therefore returned 40 and looked like a refutation. **A deletion probe works
from the flag; an inflation probe requires a replacement config file.** A config outside the
repository must also export a plain object — `import { defineConfig } from "vitest/config"` fails to
resolve from a directory outside the project (`MODULE_NOT_FOUND`).

## The thing I could not close, stated rather than smoothed

**Excluding a guard file that does not yet exist changes the collected count by nothing** — measured
above, 40 either way. So an inventory guard placed inside the lane it guards can be deleted by
exactly the defect it exists to catch, with all four gates green. **There is no mechanical closure
for this in this repository** and `ABC-118` `A4` requires the delivering hop to state the limit
rather than claim it closed. `ABC-118` is scored **⚠️ on DoR item 4** for precisely this reason.
