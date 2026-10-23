---
subtask: ticket-to-pr-ABC-212b
role: software-engineer
ticket: plans/tickets/ABC-212-two-stronger-levels-6-thinks-5-s-and-7-thinks-30-s-a-move-and-the-default-stays-5.md
ref: .grugops/context/ticket-to-pr-ABC-212b/
branch: grugops/ABC-212 (2dba7331), same worktree ../wt-ABC-212
width: 3 of 3
---

# ABC-212: apply the licensed pins U1, U2, U4–U8 (tests only)

## Do
- On `grugops/ABC-212` in `../wt-ABC-212`: apply exactly the edits in the page's § Amendment 2026-10-24 for U1, U2, U4, U5, U6, U7, U8 (tests and their comments only). U3 needs no edit; it goes green when the Scribe's A11 AGENTS.md line lands (next hop on this branch).
- Gates: lint, typecheck, build; `npm test` → expect U3 the only red; skips; `CLI_DEEP`, `UCI_DEEP`. Any other red → STOP to BA/PM.

## Fences
- Tests only. No `src/` production files, `AGENTS.md`, ADRs, board/trace. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/se212b/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `ticket-to-pr-ABC-212b`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
