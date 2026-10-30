---
subtask: qe-ABC-229-qset
role: qe-e2e
ticket: ABC-229
ref: .grugops/context/qe-ABC-229-qset/
branch: new grugops/qe-ABC-229-qset from main a649fbc4 (worktree .claude/worktrees/qe-ABC-229-qset)
width: shared, NO timed reads, no games (an SE runs npm test beside you)
---
# QE ABC-229: freeze the quiet-promotion Q-SET before the build
## Read
ABC-229 ticket (Test note 1 as corrected 2026-10-30; A1–A5), ADR-0053 d5–d9 (d9's row kinds), qe-ABC-228 PREREG
`…06163ef3` and checkpoint `…bcf2fd7c` (how the in-check freeze was done), src/quiescence.test.ts.
## Do
Freeze ≥ 6 rows of ADR-0053 d9's kinds for quiet queen promotions in quiescence: FEN, expected quiescence value /
best line under the NEW rule, the base value under the old rule, and which rows separate old from new (≥ 1 must, as
QE-C4 did). Derive expected values by hand-reasoning and fixed-depth/oracle reads only (no clock). Seal as a decision
note; this freezes the Q-SET the SE builds against.
## Fences
No src/, tools/, data/ edits. Never push/force/amend/rebase/merge into main. No board edits. Never bare `npx`/`npm exec`.
No timed reads, no games. No host paths. Scratch `qe-229-qset/`.
## Publish
Sealed notes (task `qe-ABC-229-qset`, contextRoot = worktree), commit, `## Result` here, brief + claim to done/.
