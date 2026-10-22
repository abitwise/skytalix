---
subtask: bapm-rule-QE-198
role: ba-pm
ref: .grugops/context/bapm-rule-QE-198/
inputs: QE …0b183705, …0751bfeb (flake), …1478c7fc (QE-198-b) in .grugops/context/qe-ABC-198/notes/; Orchestrator …2c4d34bd; ABC-173 (precedent: A3 lightened); NFR-008; ABC-197 (R2, Backlog)
width: 2 (beside rm-restate-AR-1)
---

# Rule QE-198-a (LOW) and QE-198-b (LOW/INFO): cut, fold or accept

## Do
- **QE-198-a:** `src/engine.test.ts` ABC-170 A2 (describe at line 1265) and ABC-167 A7 time out at vitest's 5 s default under coverage plus CPU pressure. They are pre-existing, on both base and head. Choose one: lighten the rows, as ABC-173 did for A3; give them an explicit per-test timeout; or accept the gap with a re-run rule. Weigh it against NFR-008 headroom, which is unmeasured on vitest 4.1.12 until ABC-178's B7/B8 hop.
- **QE-198-b:** the roughly 5 % coverage-mode cost from `@vitest/mocker`. Its cause is unknown. Rule INFO or route it to the Architect.
- If you cut, the ticket must be DoR 10/10 and sized XS or S, and must use the next free id, ABC-199. Do not cut anything that changes an NFR bound. An NFR bound or requirement change is an owner call: STOP and say so.
- Records only. Work on `grugops/bapm-rule-QE-198` (worktree `../wt-bapm-rule-QE-198` from `main`). Do not take timing readings; the host is shared. Scratch only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/bapm198/`.

## Fences
- No edits to `src/`, `tools/`, `package*.json` or `AGENTS.md`. `plans/board.md` changes are limited to one `_Updated` line and a new card if you cut. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `bapm-rule-QE-198`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a trace row into this brief, then move it to `done/`.
