---
id: 20260816T164000Z-software-engineer-artifact-ref-abc068-delivered-commit-ad422dc3
kind: artifact-ref
by: software-engineer
at: 2026-08-16T16:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-068
  - src/cli.test.ts
  - plans/tickets/ABC-068-shared-test-helpers-have-no-written-contracts.md
supersedes: 
---

# The delivered commit for `ABC-068`

- **Branch:** `grugops/abc068-helper-contracts`, off `main` @ `f566304`.
- **Delivered commit:** `30ea8f3e21c34996feba2f315a0f3b114d2285b1`.
- **Not merged, not pushed** (this repo has no remote). The Orchestrator re-runs the gate and holds
  the merge.

`A7`, verified on the delivered commit itself:

```
$ git diff --name-only 30ea8f3~1 30ea8f3 | grep -v '^\.grugops/'
src/cli.test.ts
```

One path. `0` files under `src/` other than that test file. The other five paths in the raw
`--name-only` output are all under `.grugops/` — this hop's own process artifacts (the two notes it
wrote, the Orchestrator note it was given, the hand-taken queue claim, the queue item), which the
criterion excludes by name.

Sites changed, all inside comments: the block-header comment above the shared names,
`usageLineOf`'s doc comment, `advertisedTextOf`'s doc comment, and one added line at each of the two
`advertisedTextOf` call sites. Both call sites were located by searching for `advertisedTextOf(`,
never by the line numbers on the ticket page — one of which now points inside a merged guard's
comment.
