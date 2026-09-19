---
id: 20260919T193500Z-software-engineer-artifact-ref-abc120-branch-commit-two-files-and-what-was-not-touched-c9f4e1b3
kind: artifact-ref
by: software-engineer
at: 2026-09-19T19:35:00Z
verified_by:
confidence: high
refs:
  - ABC-120
  - ADR-0021
  - ABC-046
  - ABC-102
  - ABC-112
  - src/turn-loop.ts
  - src/turn-loop.test.ts
  - plans/tickets/ABC-120-the-turn-loop-gains-quit-and-take-back-arms.md
  - plans/traceability.md
supersedes:
---

# `ABC-120` — the branch, the commit, the two files

Branch **`grugops/ABC-120-turn-loop-arms`**, created from `grugops/wave-2026-09-19` @ `20ad7cb`
in an isolated worktree. **Unmerged**; there is no git remote, so nothing is pushed and no PR
exists (`AGENTS.md` § "Branching model").

| commit | paths | what |
| --- | --- | --- |
| `d8e7ccc` | `src/turn-loop.ts` (+86 / −40; 18 added non-comment lines), `src/turn-loop.test.ts` (+168 / −2) | the whole build: two arms, `QUIT_NOTICE`, transitions 17 and 18, three docblocks; six rows, three seam tokens, one title word |
| (next) | `.grugops/context/ticket-to-pr-ABC-120/notes/*`, `.grugops/queue/{pending→claimed→done}/ticket-to-pr-ABC-120*`, `plans/traceability.md` (one row appended), `plans/tickets/ABC-120-*.md` § Delivery | the state this hop wrote, kept separate so the code commit is `A8`/`A9`'s measurement on its own |

`git diff --name-only 20ad7cb...d8e7ccc -- src/` → exactly the two files. Production lines > 0
(`src/turn-loop.ts`), so the zero-production-lines UAT waiver does not apply.

Commands run at `d8e7ccc` (numbers in the sibling `claim`): `npx biome check .`, `npx tsc
--noEmit` (twice — typecheck and the build slot), `npx vitest run --dir src`, `--reporter=json`
skip count, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`,
`npx vitest run src/turn-loop.test.ts`; the mutant round (sibling `observation`); the lane CPU
before/after and the in-file timing (sibling `observation`).

Not a UAT spec, so no `sha` / `gate_run` / `content_hash` triple is carried — the same shape as
every prior Software Engineer `artifact-ref` on this install.

**Byte-identical, measured with `git diff` at `d8e7ccc`:** `src/turn-loop.nfr.test.ts`,
`src/command-input.*`, `src/line-input.*`, `src/cli.ts`, `src/result-screen.ts`, `src/history.ts`,
`src/gameend.ts`, `src/search.ts`, `src/engine.ts`, `src/move-input.ts`, `src/rejection.ts`,
`plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`.

**Remaining work, not this role's:** the board move `In Development` → `In Review` (Orchestrator);
QE's `qe-e2e` hop; the owner's word at `In UAT`; `ABC-046` and `ABC-102` may now be pulled (their
`A8` reads `src/turn-loop.ts` byte-identical on their own diffs — true once this merges);
`ABC-112`'s cancel trigger fires when `ABC-046` is pulled (the board move is the Orchestrator's);
the `NFR-008` hand-up in the lane `observation`.
