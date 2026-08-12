---
id: 20260812T130000Z-ba-pm-observation-the-briefed-baseline-was-stale-by-fifty-two-tests-7c41ab90
kind: observation
by: ba-pm
at: 2026-08-12T13:00:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-019
  - ABC-029
  - src/turn-loop.ts
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# The baseline I was briefed with was stale before I read it — by **fifty-two tests**, not three — and the thing that broke it also armed a bigger version of the range trap QE flagged

> **Hand-authored, no stamp.** `scripts/context-io.ts` does **not** exist in this repository — there
> is no `scripts/` directory at all, checked at source this hop — and `mcp__grugops__propose_note` is
> not in this session's tools. `context.human_admission` is `off` and **no `§14-gate` verdict record
> exists under this task**, so **nothing on this hop is a `finding`** and no stamp was invented.
> `confidence: high` refers to the measurements, every one of which was RUN. There is no derived
> `index.md` / `index.jsonl`: the tool that renders them does not exist and none was hand-faked.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made **by hand** —
> a bare `mkdir` (no `-p`) of `.grugops/queue/claimed/` for the missing parent, then a bare `mkdir`
> (no `-p`) of `.grugops/queue/claimed/refinement-ABC-028-shape/`, which **is** the atomic act.
> `pending → claimed` and `claimed → done` are plain `mv`; the queue files are untracked, so `git mv`
> refuses.

**Worktree `../cli-chess-abc028-shape`, branch `grugops/refinement-ABC-028-shape`, HEAD `ca6c424`.**
**No other worktree was entered** — a BA/PM hop is live on `ABC-019`. Machine: 8 cores, node
`v24.12.0`, vitest `3.2.7`. **No timing measurement was taken on this hop, by instruction.**

## The briefed number and the measured one

My brief and this ticket's own header both carry **`755 / 755` on 26 files**. QE measured that, on its
tip `6cd2507`, and it was exact there.

```
measured on ca6c424, this hop        total 807   passed 807   failed 0   pending 0   todo 0
                                     files 28
lint       npm run lint       exit 0    49 files, 2 infos — both PRE-EXISTING biome.json
typecheck  npm run typecheck  exit 0
skip       0                  npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'
git diff -- src/                     EMPTY
```

**The cause is `ABC-019`'s turn loop, which landed on this stack between QE's tip and mine:**

```
git diff --numstat 6cd2507..HEAD -- src
  144   0   src/turn-loop.nfr.test.ts     ( 4 tests)
  1582  0   src/turn-loop.test.ts         (48 tests)
  313   0   src/turn-loop.ts              (A NEW PRODUCTION MODULE)

755 + 52 = 807      26 + 2 = 28      exact, both
```

**`F2`'s whole argument was that an absolute goes stale on a neighbour's commit. It went stale again
while this ticket sat still — and this time by 52 rather than by 3, seventeen times faster.** The
number that rotted was in the Orchestrator's brief, in this page's header, and in two live `src/`
comments. **Nobody wrote anything untrue; a third ticket landed.**

## The consequence for `src/`, which is where it matters

Two live comments state the suite as an absolute, and both got worse rather than better:

```
site                                  claims           was stale by (QE tip)   is stale by (this tip)
src/history-pane.nfr.test.ts:115/:117 752, 752/752      3                       55
src/history-pane.test.ts:493          732/732, 26 files 23 + 0 files            75 + 2 files
```

**And the same comment shows which figures survived.** `:116`'s *"`src/history-pane.test.ts` ALONE
passes 26/26"* is **still exact** — I re-ran it. **The owned-lane figure survived a neighbouring
ticket's landing and the suite figure did not, inside one sentence.**

**That is a mechanical rule anybody can apply, and I have not seen it written down here:** a figure
scoped to the file you own is yours to keep true; a figure scoped to the whole suite is a stranger's
to break. **If a number must be written at all, scope it to the file.**

## The bigger range trap, now armed on this branch

QE recorded that `git diff 8de988d^..593ba70 -- src/` misattributes `ABC-029`'s one comment line to
this ticket. Measured here, the same mistake one level up:

```
ABC-028's own three commits, measured INDIVIDUALLY
  8de988d   src/history-pane.nfr.test.ts +15/-7   src/history-pane.test.ts +365/-0
  26e452f                                         src/history-pane.test.ts +131/-0
  593ba70   src/history-pane.nfr.test.ts +17/-14
  -> files under src/: TWO, both *.test.ts.  Production files: ZERO.  Production lines: ZERO.

branch vs merge-base, ALL tickets
  src/history-pane.ts   1/1     ABC-029's doc-comment line
  src/turn-loop.ts    313/0     ABC-019's — A NEW PRODUCTION MODULE
```

**`ABC-028`'s firing threshold is *"any production line at all, or any new file"*.** Measured against
its own commits it does **not** fire, unchanged. **Measured against the branch it fires 313 times on a
module this ticket never touched, and the reviewer would be reading a real production file, not a
comment line — so the mistake would look far more convincing than the one QE caught.**

**Security/NFR's look is still owed and still not waived.** What this hop adds is the scoping
instruction, written onto the ticket page rather than left in a reviewer's head: **measure `ABC-028`'s
own three commits, never the branch.** It is a measurement, not a waiver, and not mine to waive.

## What this note does NOT say

- **Not that anything is wrong with `ABC-019`.** It landed its own work on its own branch. The
  observation is about numbers that quantify over a shared tree, not about the ticket that grew it.
- **Not that the tree is unhealthy.** `807 / 807`, lint 0, typecheck 0, skip 0, `src/` diff empty.
- **Not a timing claim.** I took no timing measurement on this hop, by instruction, and `N8-LANE` is
  untouched — this hop adds no test, file or line, so its own delta is zero by construction.
