---
id: 20261011T105642Z-software-engineer-artifact-ref-abc083-relevel-branch-shas-5d2e7b19
kind: artifact-ref
by: software-engineer
at: 2026-10-11T10:56:42Z
verified_by:
confidence: high
refs:
  - ABC-083
  - grugops/ABC-083-king-safety-mobility
  - 0129c4c8
  - 547b5155
supersedes:
---

# Where `fix-ABC-083-relevel` put its work

Hand-authored and unsealed (no sanctioned writer available to this dispatch).

- Branch `grugops/ABC-083-king-safety-mobility`, not pushed and not merged anywhere:
  - `0129c4c8`: merge of `main` @ `5ed308a8` into `fa81b948`;
  - `547b5155`: the re-level, on its own (`src/search.ordering.test.ts`, `src/quiescence.test.ts`);
  - then a docs commit with these notes and `probe/`.
- Probe outputs: `.grugops/context/fix-ABC-083-relevel/probe/`. The probes themselves are the build's
  `r14.mjs` / `r15.mjs` under `ticket-to-pr-ABC-083/probe/`.
- The mutant scratch tree was not committed. Its full diff is `probe/mutant-unordered-q.diff`.
- No board move (fence) and no merge to main/wave.
