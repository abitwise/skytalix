---
subtask: bapm-amend-ABC-212
role: ba-pm
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/bapm-amend-ABC-212/
width: 3 of 3 (records only)
---

# Amend ABC-212: license pins U1–U8 and fix the A12/A9 contradiction

## Do
- Read the SE's STOP (`…93ffdad9`) and the eight rows U1–U8 with their proposed edits. For each, rule: a direct, value-only consequence of the owner-accepted spec (levels 6–7 exist; refused boundary 0/6 → 0/8) → add to A13's licensed list with the exact edit; anything that is not → say why (STOP to Architect). U3 needs no test edit; it passes when the Scribe's A11 AGENTS.md line lands, so the merge must carry both.
- Re-word A12 vs A9 (clock-reading count): the SE measured 32–33 readings per search at A9's step; pick the wording that keeps A9's intent.
- A dated amendment block on the page (old text visible). No requirement or bound moves; if one would, STOP to the Orchestrator.

## Fences
- Worktree `../wt-bapm-amend-ABC-212` from `main`. Only the ABC-212 page and your notes. No `src/`, tests, ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm212a/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `bapm-amend-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
