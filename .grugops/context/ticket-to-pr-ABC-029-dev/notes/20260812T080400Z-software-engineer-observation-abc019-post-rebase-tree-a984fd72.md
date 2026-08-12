---
id: 20260812T080400Z-software-engineer-observation-abc019-post-rebase-tree-a984fd72
kind: observation
by: software-engineer
at: 2026-08-12T08:04:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ADR-0011
  - NFR-002
  - src/history-pane.nfr.test.ts
  - src/turn-loop.ts
supersedes:
---

# The one honest question: do `ABC-019`'s two red instruments go GREEN? — and it turned out to be measurable, not just arguable

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` `off`.

**The brief asked me to answer from `A5`'s rows and to say plainly that it is reasoning rather than a
measurement. I can do better than that, and the upgrade is worth stating precisely, because the
difference between what I measured and what I did not is the whole value of the answer.**

## 1. What I could measure without entering that worktree

`ABC-019`'s branch differs from mine in exactly this, computed by md5 over every `src/*.ts` at both
refs (`git show <ref>:<path>` — **the worktree `../cli-chess-ABC-019` was never opened**):

- it **adds** three files: `turn-loop.ts`, `turn-loop.test.ts`, `turn-loop.nfr.test.ts`;
- its `history-pane.nfr.test.ts` and `history-pane.test.ts` are **older** — they predate `ABC-028`,
  whose build commit `8de988d` **is an ancestor of my `HEAD`** (verified with
  `git merge-base --is-ancestor`), so a rebase onto this branch replaces both with mine;
- **every other file is byte-identical.**

**So the post-rebase tree is fully reconstructible: my working tree plus those three files.** I built
exactly that out of tree and ran the whole gate on it.

| | result |
|---|---|
| `tsc --noEmit` | **0** |
| `biome check .` | **0 errors** (the same 2 pre-existing infos) |
| `vitest run` | **802 passed (802) on 28 test files** |
| skip count | **0** |
| the two named instruments | **BOTH GREEN** |

`turn-loop.ts` md5 in that tree is `bd793612476c9d0eac28b75e1e3297cc`, and the arithmetic closes:
**802 = 750 (this branch) + 52 (`turn-loop.test.ts` + `turn-loop.nfr.test.ts`), and nothing else moved.**

## 2. The same rig reproduces the RED it is supposed to fix

Run against `ABC-019`'s tip **unmodified**, the delivered instrument gives the two recorded failures
verbatim:

```
FAIL  src/history-pane.nfr.test.ts > … > leaves src/history.ts with ZERO runtime importers among the production modules
  → expected [ 'turn-loop.ts' ] to deeply equal []
FAIL  src/history-pane.nfr.test.ts > … > evaluates history.ts's module body in NO production closure
  → history.ts was evaluated in a production closure: expected [ 'apply.ts', 'moves.ts', …(14) ] to not include 'history.ts'
```

**So the answer is: YES — measured, on a byte-verified reconstruction, and the same rig shows the red
it removes.**

## 3. What that is NOT, stated so nobody over-reads it

- **It is not a run of `ABC-019`'s gate.** I never entered `../cli-chess-ABC-019`. It is a
  reconstruction from the object database, run with **this** branch's `package.json`, `tsconfig.json`
  and `node_modules`.
- **It is a snapshot of a moving ref.** If `grugops/ABC-019-turn-loop-skeleton` advances before the
  rebase, this must be re-taken. It is only a statement about that ref as it stands now.
- **It assumes the rebase is the one the board describes** — `ABC-019` onto this branch, taking my
  two `history-pane` files. If the rebase resolves differently, the result does not carry.
- **`ABC-019`'s own remaining obligations are untouched by it.** Its `A20` and `ADR-0009` cl. 9f's
  real-panel run are still owed, and `NFR-002`'s `MET`/`MISS` is still Security/NFR's. **Nothing here
  is a verdict on `ABC-019`.**

## 4. One number in the record that has moved, reported not reconciled

The ticket records `ABC-019`'s tip as **2 failed / 789 passed on 28 files (791)**. Measured today on
that ref: **2 failed / 794 passed on 28 files (796)**. **The two failures are identical** — same
tests, same messages. The 5-test difference is in the shared base, not in the loop: the tip carries
the pre-`ABC-028` base of 744, and 744 + 52 = 796, while the recorded 791 implies a base of 739 at
the time it was taken. **The figure was correct on the tree it was run against; the base moved under
it.** Recorded as an input; no ticket, board row or ADR was edited to match.
