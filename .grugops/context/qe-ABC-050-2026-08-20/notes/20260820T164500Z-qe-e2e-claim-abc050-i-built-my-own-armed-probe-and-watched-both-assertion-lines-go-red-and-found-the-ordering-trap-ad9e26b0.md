---
id: 20260820T164500Z-qe-e2e-claim-abc050-i-built-my-own-armed-probe-and-watched-both-assertion-lines-go-red-and-found-the-ordering-trap-ad9e26b0
kind: claim
by: qe-e2e
at: 2026-08-20T16:45:00Z
verified_by: ""
confidence: high
refs:
  - ABC-050
  - src/glyph-mode.nfr.test.ts
  - src/glyph-mode.ts
  - vitest.config.ts
supersedes: ""
type: claim
task: qe-ABC-050-2026-08-20
role: qe-e2e
ticket: ABC-050
created: 2026-08-20T16:45:00Z
tree: grugops/abc050-lane-runner-guard @ ca50b26
---

# `A5`: I built my OWN armed probe, watched it red twice, and found an ordering trap that can make the armed run come back GREEN for a reason that has nothing to do with the guard.

I accepted no transcript. The probe below is mine, written before I read the engineer's command
line, and run against a scratch copy of the tip tree (`git archive ca50b26`) so the live worktree
never held it.

## The probe

Authored **outside the repository**, in the agent scratchpad. Mutates both ambient signals at
**module load**, restores nothing, and is padded to 46 KB so it sorts ahead of the 7 KB
`src/glyph-mode.nfr.test.ts`:

```ts
process.stdout.isTTY = true;
process.env.LC_ALL = "en_US.UTF-8";
process.env.LC_CTYPE = "en_US.UTF-8";
process.env.LANG = "en_US.UTF-8";
```

## RUN 1 — RED, watched by me

```
npx vitest run --no-cache --no-isolate \
  --poolOptions.threads.maxThreads=1 --poolOptions.threads.minThreads=1 \
  src/qe-abc050-armed-probe.test.ts src/glyph-mode.nfr.test.ts
-> exit 1
 v src/qe-abc050-armed-probe.test.ts (1 test)
 x src/glyph-mode.nfr.test.ts (3 tests | 2 failed)
   AssertionError: ambient process.stdout.isTTY: expected true to be falsy   (x2)
 Test Files 1 failed | 1 passed (2)   Tests 2 failed | 2 passed (4)
```

**`src/glyph-mode.nfr.test.ts` reports 2 failures — `>= 1`, as `A5` requires.** The probe ran
FIRST, in the same worker, and the pollution was in place before the guard read it.

## RUN 2 — the SECOND assertion, armed independently, also RED

The engineer was right that Run 1 proves only the `isTTY` line: it fires first and short-circuits
the `it()`, so the mode line is never reached. Re-run against a copy of the test file with the
`isTTY` line stripped:

```
-> exit 1
   AssertionError: ambient glyph mode: expected 'unicode' to be 'ascii'   (x2)
```

**Both assertion lines are independently armed and I watched both go RED.** The engineer's second
arming run reproduces exactly.

## THE TRAP I HIT, and it is not in anyone's notes — record it before someone re-runs this

My first attempt at Run 2 came back **GREEN, exit 0, 4 passed** — and the guard was blameless.
Vitest's default sequencer sorts by **cached test DURATION** first and falls back to file size only
when there is no cache. The scratch trees symlink the repo's `node_modules`, so they share
`node_modules/.vite/vitest`, which my earlier full-suite runs had populated. The sequencer put
`src/glyph-mode.nfr.test.ts` **first** and the probe second, so the pollution landed **after** the
read and nothing could fail. The run output names the order and is the only way to see it.

**Padding the probe is NOT sufficient to order it first. Pass `--no-cache`, and read the file order
off the run output before believing a green.** An armed control that silently stops being armed is
precisely the defect class this ticket exists to close, and it is one flag away.

## Is the assertion genuinely ABSOLUTE? YES — checked at the source, not inferred

- `beginGlyphModeSession` reads `process.stdout.isTTY` and `process.env` **at call time**, inside
  the function (`src/glyph-mode.ts`), not at module load. Nothing is captured when the test file
  loads.
- The two expected values are **fixed literals** — `toBeFalsy()` and `"ascii"` — derived from the
  mechanism, not from anything read at load. `selectGlyphMode`'s row 3 (`if (!signals.isTTY) return
  "ascii"`) decides before any locale variable is consulted, and a vitest worker's `process.stdout`
  is a pipe.
- **The decisive evidence is Run 1 itself:** the probe polluted **before** the guard's file loaded,
  and the guard still went red. A load-time baseline would have recorded the pollution as pristine
  and stayed green. It did not. `A5`'s boxed warning is **satisfied**.

## The delivered configuration, second half of `A5`

Full suite at the tip under the delivered config: **exit 0, 40 files, 1207 passed, 0 skipped.**
`A5` **MET on both halves.**

## The armed control is NOT committed

It never entered the repository: it was placed only in a `git archive` copy of the tip under the
scratchpad and deleted after the runs. `git status --porcelain` in the repo carries **zero**
residue of it — see the residue note in this folder.
