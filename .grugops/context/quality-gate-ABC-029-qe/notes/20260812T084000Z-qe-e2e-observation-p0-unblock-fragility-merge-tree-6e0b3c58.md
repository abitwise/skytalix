---
id: 20260812T084000Z-qe-e2e-observation-p0-unblock-fragility-merge-tree-6e0b3c58
kind: observation
by: qe-e2e
at: 2026-08-12T08:40:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ADR-0011
  - plans/traceability.md
supersedes:
---

# The `P0` unblock: re-measured, and its fragility tested with `git merge-tree` rather than argued

> **`kind: observation`, not `finding`** — no `§14-gate` verdict record under this task,
> `human_admission` `off`. **Nothing was merged, pushed or deployed; no `git checkout main`; no live
> worktree was entered.** `git merge-tree --write-tree` is read-only with respect to refs and the
> working tree — it computes a merge in the object database and prints a tree id.

The brief said not to re-derive the unblock and **to test whether it is fragile**. I did both halves:
the figure reproduces, and the fragility is smaller than the record feared in one place and larger in
another.

## 1. The figure reproduces, independently

Full gate on `base17` (this branch + `ABC-019`'s three added files):

| | Engineer recorded | **I measured** |
|---|---|---|
| `vitest run` | 802 passed on 28 files | **802 passed (802) on 28 files** |
| `tsc --noEmit` | 0 | **0** |
| the two named instruments | BOTH GREEN | **BOTH GREEN** |

## 2. The rebase assumption is NOT an assumption — git computes it, and it resolves in `src/` exactly as measured

The record hedges: *"It assumes the rebase is the one the board describes … If the rebase resolves
differently, the result does not carry."* **That hedge can be discharged.**

`git merge-tree --write-tree --name-only HEAD grugops/ABC-019-turn-loop-skeleton` → exit **1**, tree
**`c368117…`**, with **exactly three conflicts**:

```
CONFLICT (content): plans/tickets/ABC-028-history-pane-unreached-input-classes.md
CONFLICT (content): plans/tickets/ABC-029-production-module-scope-and-load-probe.md
CONFLICT (content): plans/traceability.md
```

**Not one conflict in `src/`.** The merged tree that git itself produces carries:

| file | md5 in git's merged tree | md5 here |
|---|---|---|
| `src/history-pane.nfr.test.ts` | `796918f370e26d2cbc6055953edf06ae` | **identical** |
| `src/history-pane.ts` | `c4653c4c263c4c417ea34969164ccd86` | **identical** |
| `src/turn-loop.ts` | `bd793612476c9d0eac28b75e1e3297cc` | **identical to the tip** |

**17 non-test `.ts`, 28 test files, zero conflict markers in any `src/` file.** So my `base17` rig
tree is not a reconstruction that *approximates* the rebase — in `src/` it **is** the merge git
computes. The 802/802 carries.

**What the three conflicts mean, stated so nobody reads them as a code problem:** all three are
`plans/` documents that both branches edited (two ticket pages and the trace table). They are
resolved by a role at rebase time, not by an engineer. **They are real work and they are named here
so the rebase hop budgets for them.**

## 3. The fragility that IS real — and one of the moving refs moved DURING this hop

- **`grugops/ABC-019-turn-loop-skeleton` is a moving ref** (`b1bf089` today). Everything above is a
  statement about that ref as it stands. If it advances, re-take — the rig is described precisely
  enough to rebuild in minutes.
- **A concurrent branch moved under this hop, which is the concrete demonstration.** At the start of
  this hop `git worktree list` showed `grugops/quality-gate-ABC-028-qe` at **`6b513bb`** — an
  ancestor of my `HEAD`. By the time I checked ancestry it was at **`fff4b92`** and **no longer an
  ancestor**: the concurrent `ABC-028` QE hop had committed
  (`test(qe): grug break ABC-028 fourteen ways…`). **This is exactly the "snapshot of a moving ref"
  risk, observed rather than hypothesised.**
- **That particular move is harmless, measured.** `git merge-tree --write-tree HEAD
  grugops/quality-gate-ABC-028-qe` → **exit 0, clean, no conflicts**, and its diff touches only
  `.grugops/context/`, `.grugops/queue/` and **one line** of `plans/traceability.md`. **Zero `src/`
  files.** So the shared instrument is untouched by the concurrent hop and none of my measurements
  moves.

## 4. What this is NOT — same fences the Engineer drew, re-drawn because they still hold

- **It is not a run of `ABC-019`'s gate.** `../cli-chess-ABC-019` was never opened.
- **It is not a verdict on `ABC-019`.** Its `A20` and `ADR-0009` cl. 9f's real-panel run are still
  owed, and `NFR-002`'s `MET`/`MISS` is still Security/NFR's.
- **It is not a merge.** Nothing was merged and I did not attempt the fast-forward the brief says is
  denied by the host classifier and returned to the owner.

## 5. One record-vs-measurement difference, reported not reconciled

The Engineer recorded `ABC-019`'s tip today as **2 failed / 794 passed (796)** against the ticket's
**2 failed / 789 passed (791)**, and attributed the 5-test gap to the shared base moving. **I did not
re-run the unmodified tip** — my `base17` is the post-rebase tree, which is the tree the `P0`
actually lands on, and re-running the pre-rebase tip would measure a state nobody ships. **Recorded
as not-re-checked rather than silently inherited: `UNKNOWN - verify` from me on that figure.**
