---
id: 20260813T071000Z-software-engineer-observation-i-rebuilt-the-mutant-on-this-tree-before-and-after-the-edit-8342e035
kind: observation
by: software-engineer
at: 2026-08-13T07:10:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - ABC-017-A9
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
supersedes:
---

# I rebuilt `WPOS` on THIS tree rather than transcribing anyone's number — twice, before and after the edit, with a null control and a pin that was proved to refuse

> **Hand-authored, no stamp.** Every cell below was RUN this hop on my own lane, built from scratch
> and pinned by md5. The lane lived entirely **out of tree**, under a **fresh uniquely-named
> scratchpad root** (`…/scratchpad/eng-t493-uniq-1/`) — the shared-scratchpad hazard three hops have
> now reported, and one of them came back carrying a file no command of its own put there.

## Why re-run a measurement two roles had already taken

`## Test notes` 4 says re-measure before writing a number and `## Test notes` 14 says name no
instrument you have not run. **The sentence I was about to write names `ABC-028` `A4` as a catcher.**
Naming it on somebody else's run would be the exact defect this ticket exists to stop, one level up.
So the mutant was rebuilt and run here.

I did **not** run QE's harness and I did **not** run BA/PM's `mk.mjs`. BA/PM's rig pins
`src/history-pane.test.ts` to `9533f050…` and would have **thrown** on my post-edit tree — correct
behaviour, and the reason a fresh rig was needed rather than a repaired one. Mine takes the two test
digests **on the command line**, so a lane can only be measured against a tree the caller named.

## The measurement — identical before and after the edit

```
BEFORE the edit   (pins 9533f050… / 16bf2f50…)
  NULL CONTROL (no mutant)   0 failed / 807 on 28 files    <- the lane is calibrated, not blind
  WPOS                       2 failed / 807 on 28 files
    FAIL  A9 — neither render touches the caller's position, its move count or its ANCHOR
    FAIL  A4 — no write reaches the caller's graph during a render, at all ten lengths

AFTER the edit    (pins 1b23df27… / 16bf2f50…)
  NULL CONTROL (no mutant)   0 failed / 807 on 28 files
  WPOS                       2 failed / 807 on 28 files
    FAIL  A9 — neither render touches the caller's position, its move count or its ANCHOR
    FAIL  A4 — no write reaches the caller's graph during a render, at all ten lengths
```

**`WPOS` still dies, and still dies TWICE — at `A9` and at `ABC-028`'s own `A4` — on the tree that
ships.** That is done-condition line 3, measured rather than pasted.

**The pin was proved to REFUSE rather than assumed to.** Re-running the rig against the post-edit
worktree with the *pre-edit* digest throws
`PIN MISMATCH src/history-pane.test.ts: 1b23df27… != 9533f050… — REFUSING to measure` and takes no
measurement. A rig that fails open is not a pin, and this one was shown failing closed **before** its
results were relied on.

**Why the totals did not move across the edit, stated rather than left to inference:** the change is
comment text, so it cannot alter behaviour; the run is there to prove that, not to discover it. The
null control is what makes the pair informative — `0 / 807` against `2 / 807` on the same lane means
the two failures are the mutant's, not the lane's.

## Three trees, the same two catchers

| tree | who | total | catchers |
|---|---|---|---|
| `6cd2507` (no `ABC-019` turn loop) | QE | 755 | `A9`, `A4` |
| `ca6c424` | BA/PM | 807 on 28 | `A9`, `A4` |
| `47fef3d`, before and after this edit | me | 807 on 28 | `A9`, `A4` |

**The same two kills now measured on three trees by three roles.** The deleted sentence was false
about the tree, not about a tip — which is exactly why refreshing its number would have been the
wrong repair.

## The rig, so the ruling is re-runnable

`.grugops/context/ticket-to-pr-ABC-028-t493/artifacts/lane.mjs` and `wpos.mjs`, copied **verbatim**
as run. **Caveat, and it is the hazard BA/PM flagged about QE's harness, so it is stated rather than
silently inherited: `lane.mjs` writes its `lanes/` beside itself.** As run, "beside itself" was the
scratch root. **Run the copy from a fresh scratch root, never from the context `artifacts/`
directory.** Exact invocation:

```
cwd  …/scratchpad/eng-t493-uniq-1/
     node wpos.mjs 9533f05038780def980bf5a86707cdbd 16bf2f50c93e2e896b5406cbfa772b8b   (before)
     node wpos.mjs 1b23df27a9a67ef0ed359dd33456ee1b 16bf2f50c93e2e896b5406cbfa772b8b   (after)
```

The mutant itself is byte-for-byte the build BA/PM defined — a module-scope `WeakSet` and a
once-per-object write of `9999` into `history.position.fullmoveNumber`, spliced in at the
`parseFen(history.initialFen)` line. **I reproduced their mutant deliberately rather than inventing
my own**: a different mutant would have measured a different thing and the comparison above would be
worthless.

## Machine

8 cores, node `v24.12.0`, vitest `3.2.7`. **NO TIMING MEASUREMENT WAS TAKEN** — instructed, the
machine is not quiet, and a comment-only edit's `N8-LANE` delta is zero by construction.
`UNKNOWN - verify` on anything else about the machine.
