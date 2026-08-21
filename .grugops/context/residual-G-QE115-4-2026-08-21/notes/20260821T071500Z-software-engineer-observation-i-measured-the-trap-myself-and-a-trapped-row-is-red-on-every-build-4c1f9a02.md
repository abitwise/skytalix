---
id: 20260821T071500Z-software-engineer-observation-i-measured-the-trap-myself-and-a-trapped-row-is-red-on-every-build-4c1f9a02
kind: observation
by: software-engineer
at: 2026-08-21T07:15:00Z
verified_by:
confidence: high
refs:
  - G-QE115-4
  - ABC-115
  - A10
  - src/cli.test.ts
  - src/cli.ts
supersedes:
---

# I RE-MEASURED THE TRAP AT MY OWN HAND BEFORE WRITING A WORD OF IT — A TRAPPED ROW IS RED ON EVERY BUILD, NOT GREEN

I took nothing on trust: not QE's table at `qe-ABC-115-repair-2026-08-21`, not the brief's statement
of the defect. Every cell below is a run of mine.

## The rig, and why it is not the repository

A full copy of the branch tree (`grugops/residual-gqe115-4` @ `e4a5c48`, `tar`-piped, `node_modules`
symlinked to the repo's) in `scratchpad/mutlab` — outside the repository, so no mutant can be
committed by accident. Two recorded dead ends were read and avoided by construction: a partial copy
(`src/` plus configs only) is **RED before any token is changed** — I hit it and measured it,
`5 failed | 56 passed (61)`, because rows in this file read `AGENTS.md` and `plans/` from the tree
root; and a copy without `node_modules` fails at startup in a way that resembles a red. **Baseline
in the full copy, established GREEN before a token was changed: `61 passed (61)` on
`npx vitest run src/cli.test.ts`.**

Two mutation points, one per axis:

- **Production axis.** `src/cli.ts:159`, the delivered narrowing clause
  `if ((error as NodeJS.ErrnoException).code !== "EPIPE") throw error;` replaced by a comment — the
  arm then swallows every stdout error unconditionally. That is QE's swallowing mutant, rebuilt from
  the delivered source rather than copied from its note.
- **Row axis.** `src/cli.test.ts:2902`, `const status = productStatusOf(child);` replaced by
  `const status = child.status as number;` — i.e. the row falling into the trap the docblock warns
  about.

## The measured table

| `A10` reads | production build | lane result | the failing assertion |
|---|---|---|---|
| `productStatusOf(child)` (delivered) | delivered | **GREEN — `61 passed (61)`** | — |
| `productStatusOf(child)` (delivered) | swallowing mutant | **RED — `1 failed of 61`** | `a failed write was absorbed: "NODE_EXIT=0\n": expected +0 not to be +0` |
| `child.status` (trapped) | swallowing mutant | **RED — `1 failed of 61`** | `a failed write was absorbed: "NODE_EXIT=0\n": expected +0 not to be +0` |
| `child.status` (trapped) | delivered | **RED — `1 failed of 61`** | `a failed write was absorbed: "NODE_EXIT=1\n": expected +0 not to be +0` |

**The premise of the docblock is TRUE and I confirmed it in the same runs.** Rows 3 and 4 fail with
`expected +0 not to be +0` while the captured stdout carries `NODE_EXIT=0` on the mutant and
`NODE_EXIT=1` on the delivered build: the wrapper's own status is a constant `0` across builds while
the product's status moves. The redirection binds `node` alone and the wrapper's status is the
trailing `echo`'s, exactly as written.

**Its stated consequence is FALSE for this row, and the direction is the opposite one.** `A10`
asserts `not.toBe(0)` against that constant `0`, so a trapped version of it is **RED on every
build** — green never happens, so a hop that fell in would not ship a silent pass; it would ship a
row that cannot go green and would be noticed at once.

## The shape the trap DOES catch, also measured, because I would not write it otherwise

Same rig, the row mutated on both points at once — `child.status` **and** `.not.toBe(0)` spelled
`.toBe(0)` on line 2907:

| spelling | production build | status assertion | lane result |
|---|---|---|---|
| `child.status` + `toBe(0)` | delivered | **PASSES** | GREEN — `61 passed (61)` |
| `child.status` + `toBe(0)` | swallowing mutant | **PASSES** | RED — `1 failed of 61`, and the failure is `a failed write was absorbed silently: expected '' not to be ''` |

**The status clause is green on both builds — that is the classic green-on-every-build trap, and it
is the `toBe(0)` spelling, not this row's.** Note the honest qualifier the second row forces: even
then the ROW is not green on every build, because `A10`'s third assertion (stderr non-empty) still
reds against the mutant, whose stderr is 0 bytes. The blindness belongs to the status CLAUSE, not to
the whole row, and any sentence that says otherwise would be the next false-sounding sentence.

## Restoration

Both mutation points restored from the pre-mutation snapshots and `cmp`-verified byte-identical;
the lab re-ran `61 passed (61)` after restoration. The repository tree and the branch worktree were
never mutated — the only file this hop opened for writing under `src/` is the docblock itself.
