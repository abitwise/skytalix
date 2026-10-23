---
subtask: arch-design-ABC-212
role: architect-design
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/arch-design-ABC-212/
width: 2 (beside arch-design-ABC-205; disjoint files)
---

# Design ruling for ABC-212 (levels 6–7) + the ADR-0045 amendment

## Do
- Write the ADR-0045 amendment exactly to the owner-accepted points (`…2c6fa3b1` item 2), Status "accepted by the owner (…2c6fa3b1), on the listed points". Any departure from a point → write that part as PROPOSED and STOP for the owner.
- Write the NFR-004 text the owner accepted (`…2c6fa3b1` item 1) into your ruling for Security/NFR to place in the catalog (do not edit the catalog).
- Rule: `HARD_CEILING_MS` shape (one clamp vs per-level), UCI bare-`go` budget, OQ-212-3 under ADR-0044 D5 (does the worker trigger force the UCI split?), the pins list (A13), and BA/PM's interactions 1–12. A dated `## Design ruling` on the page; recommend the next move.
- A NEW ADR, or a change to any other accepted ADR, is PROPOSED only and STOPs to the owner.

## Fences
- Worktree `../wt-arch-design-ABC-212` on `grugops/arch-design-ABC-212` from `main`. Only the ABC-212 page, ADR-0045 (and a proposed ADR if needed), your notes. No `src/`, tests, catalog, board/trace. ABC-205's page/ADR-0031 belong to the parallel hop. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design212/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-design-ABC-212`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
