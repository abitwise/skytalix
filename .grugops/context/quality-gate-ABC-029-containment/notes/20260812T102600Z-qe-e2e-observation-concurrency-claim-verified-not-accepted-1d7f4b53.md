---
id: 20260812T102600Z-qe-e2e-observation-concurrency-claim-verified-not-accepted-1d7f4b53
kind: observation
by: qe-e2e
at: 2026-08-12T10:26:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-028
  - src/history-pane.nfr.test.ts
supersedes:
---

# The Orchestrator's disjointness claim is UPHELD — but the reason given is not the reason it holds, and the stronger reason is the one that should be recorded

> **`kind: observation`.** Read-only throughout. **No other worktree was entered** — every foreign
> fact came from `git rev-parse` / `git merge-tree` / `git show` against this worktree's object
> database.

## The claim

*"An Engineer hop is editing the COMMENT block near `:103-120` of `src/history-pane.nfr.test.ts` in
another worktree, concurrently. I claim it is disjoint from your subject (the guards at `:314`+) and
that a comment edit cannot move a verdict. Do not take that on trust."*

## What I measured

| ref | commit |
|---|---|
| **HEAD** (`grugops/quality-gate-ABC-029-containment`) | `313ec7450c48fc143b0cf7673ca51c5d760369cc` |
| `grugops/ABC-028-a5-comment` — the concurrent Engineer's branch | **`313ec7450c48fc143b0cf7673ca51c5d760369cc` — THE SAME COMMIT** |
| `grugops/orchestrate-abc028-2026-08-12` | `313ec745…` — also the same |
| `grugops/ABC-029-containment` (the build I am re-gating) | `f31e2e7f3c7ec92d16cc059ab5dfcae06707ac66` |

**`git merge-tree --write-tree HEAD grugops/ABC-028-a5-comment`** → exit `0`, tree
`dafdcec10d58df50fc605c28f3d17edd4622914a`, **no conflict lines**. The gated file's blob in that
prospective merged tree is **`c230cd8f8c7a2ff50cc219e0db1a9484c101cf5f`** — **byte-identical to the
blob at my HEAD.**

**md5 of the file I gated: `d51b02be9351c8ee8ed5b3436873db68`** — taken at claim, re-taken after the
last run, **unchanged**. **The tip did not move under me.**

## The claim is upheld, and here is the correction

**The disjointness does NOT rest on the line ranges.** It rests on two facts, and the second is much
stronger than the one offered:

1. **There is nothing committed to be disjoint FROM.** `grugops/ABC-028-a5-comment` sits on my exact
   commit. The edit is uncommitted working-tree state in `../cli-chess-abc028-cmt`, invisible to my
   gate and invisible to `merge-tree`. **So I have verified that no divergence exists — I have NOT
   verified anything about the edit itself, and saying otherwise would be the same shape of error the
   brief flagged.**
2. **The file I gated is never inside either guard's scanned set.** `productionModulesIn` is
   `readdirSync(dir).filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))`, and
   `src/history-pane.nfr.test.ts` is a `.test.ts`. **So no edit anywhere in that file — comment or
   code, `:103-120` or elsewhere — can enter either guard's input.** It could only move a verdict by
   changing EXECUTABLE text in the instrument, and `:103-120` is five `//` comment lines about
   fixture sharing. **This holds even if the edit accidentally introduced a column-0 `import`/`export`
   line, which is exactly the failure the widening made newly possible in a PRODUCTION module** (see
   the sibling `observation`). That is a materially stronger guarantee than "different line ranges",
   and it is the one worth carrying forward.

## What would invalidate this verdict, stated so it is checkable rather than trusted

**Everything I recorded is valid for tree `313ec745…` and file md5
`d51b02be9351c8ee8ed5b3436873db68`.** If `grugops/ABC-028-a5-comment` commits and the md5 moves, the
re-check needed is **narrow and I am naming it so nobody re-runs the whole gate**: confirm the
instrument still parses and still reports **8 tests**, and confirm the changed region contains no
executable statement. **The fourteen row verdicts cannot move**, by fact 2 above. **No digest from
this hop may be quoted forward against a different md5.**
