---
id: 20260818T185000Z-software-engineer-artifact-ref-branch-commits-and-files-2f9ac48d
kind: artifact-ref
by: software-engineer
at: 2026-08-18T18:50:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - src/move-input.ts
  - src/move-input.test.ts
  - plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
supersedes:
---

# What this hop produced: one branch, two commits, two new files, two corrected anchors

- **Branch**: `grugops/abc033-one-prompt-both-formats`, based on `main` @ **`3054ee0`**.
  The brief named `16e9269`; `3054ee0` is the single commit `main` gained since — the Orchestrator's
  own wave enqueue, which created this brief and touched **no file under `src/`**
  (`git diff --stat 16e9269 3054ee0`: two context notes, three queue files, `plans/board.md`).
  Branching from the tip rather than from `16e9269` avoids a needless divergence and changes nothing
  the ticket is measured against.
- **Commit 1 — the delivery**, `a83b933`. `git diff --numstat`: `src/move-input.test.ts` **+374/-0**,
  `src/move-input.ts` **+182/-0**. Nothing else. This is the diff `A7` is measured against.
- **Commit 2 — the ticket page**, `e2bed3e`. `plans/tickets/ABC-033-…md` **+7/-2**: the `+N` marker
  anchor `src/frame.ts:182-188` → `:134-141` and the sanitizer anchor `:202` → `:123`, each carrying
  the correction's provenance (re-measured at `main` HEAD `16e9269` at the `Ready for Dev` exit).
  Deliberately separate so `A7`'s measurement is not diluted.
- **New public surface**: `resolveMoveInput`, `MoveInputOutcome`, `MoveInputDeps` in
  `src/move-input.ts`. No existing module was opened for edit; no dependency was added or changed.
- **NOT done here, by design**: the merge (the Orchestrator holds it), the QE hop, and the UAT.
  **The 2026-08-17 zero-production-lines UAT waiver does NOT apply** —
  `git diff --name-only a83b933~1 a83b933 | grep -v '\.test\.ts$' | grep '^src/'` returns
  `src/move-input.ts`, so this ticket carries production lines and needs the owner's word as before.
