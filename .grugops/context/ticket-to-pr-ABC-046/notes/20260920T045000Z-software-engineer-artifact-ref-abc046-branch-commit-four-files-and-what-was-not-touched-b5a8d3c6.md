---
id: 20260920T045000Z-software-engineer-artifact-ref-abc046-branch-commit-four-files-and-what-was-not-touched-b5a8d3c6
kind: artifact-ref
by: software-engineer
at: 2026-09-20T04:50:00Z
verified_by:
confidence: high
refs:
  - ABC-046
  - ABC-120
  - ABC-045
  - ABC-035
  - ABC-112
  - ABC-102
  - ADR-0021
  - src/command-input.ts
  - src/line-input.ts
  - src/command-input.test.ts
  - src/cli.test.ts
  - plans/tickets/ABC-046-quit-and-new.md
  - plans/traceability.md
supersedes:
---

# `ABC-046` — the branch, the commit, the four files

Branch **`grugops/ABC-046-quit-and-new`**, created from `grugops/wave-2026-09-19` @ `d1d431f` in an
isolated worktree. **Unmerged**; there is no git remote, so nothing is pushed and no PR exists
(`AGENTS.md` § "Branching model").

| commit | paths | what |
| --- | --- | --- |
| `6cdde15` | `src/command-input.ts` (+99 / −22; **29 added non-comment lines**), `src/line-input.ts` (+12 / −9; **3 added non-comment lines**), `src/command-input.test.ts` (+402 / −18), `src/cli.test.ts` (+108 / −5) | the whole build: the `new` row and its `take-back` branch, `QUIT_CONFIRMATION_MESSAGES`, the `quit` confirmation branch, `createPromptLineResolver` (the per-session flag), three type widenings, the docblocks re-worded so no sentence reads false; the reader binding the wrapper; 33 unit rows + the spelling / non-token / foreign-list / no-argument sweeps + `runLines` bound to the wrapper; two children, three screen rows, the spawn pin `17 + 7 + 1 + 2` |
| (next) | `.grugops/context/ticket-to-pr-ABC-046/notes/*`, `.grugops/queue/{pending→claimed→done}/ticket-to-pr-ABC-046*`, `plans/traceability.md` (one row appended + one `_Updated:` line), `plans/tickets/ABC-046-quit-and-new.md` § Delivery | the state this hop wrote, kept separate so the code commit is `A8`'s measurement on its own |

`git diff --name-only d1d431f...6cdde15 -- src/` → exactly the four files. Production lines > 0
(`src/command-input.ts`, `src/line-input.ts`), so the zero-production-lines UAT waiver does not
apply.

Commands run on the tree committed as `6cdde15` (numbers in the sibling `claim`): `npx biome check
.`, `npx tsc --noEmit` (twice — typecheck and the build slot), `npx vitest run --dir src`,
`--reporter=json` skip count, `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
--skip-count 0`, the three files alone; the mutant round (sibling `observation`); the lane CPU
before/after and the per-file timings (sibling `observation`). Harnesses and raw summaries sit
beside this note as `raw-*.txt`. The product was also driven by hand through a pipe
(`printf 'help\nquit\nquit\nd4\n' | node src/cli.ts --colour white` → confirmation frame, then
`> quit`, exit 0; `printf 'quit\nboard\nquit\n' | …` → two confirmation frames, then
`> input ended`).

Not a UAT spec, so no `sha` / `gate_run` / `content_hash` triple is carried — the same shape as
every prior Software Engineer `artifact-ref` on this install.

**Byte-identical, measured with `git diff --stat d1d431f 6cdde15 -- <paths>` (empty):**
`src/turn-loop.ts`, `src/turn-loop.test.ts`, `src/zobrist.ts`, `src/search.ts`,
`src/quiescence.ts`, `src/engine.ts`, `src/move-input.ts`, `src/rejection.ts`, `src/cli.ts`,
`src/result-screen.ts`, `src/gameend.ts`, `src/history.ts`, `src/line-input.test.ts`;
`plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` not opened.

**Remaining work, not this role's:** the board move `In Development` → `In Review` (Orchestrator;
`plans/board.md` fenced for this hop); `ABC-112`'s cancellation (its trigger has fired: `help`
lists `quit` and the build honours it — the Orchestrator's board move); QE's `qe-e2e` hop — with
three things to look at named in the sibling notes (the `src/line-input.ts` three-line reading of
`A8`'s "one call-site line"; the over-cap-line gap in the confirmation; `M9` guarded by one
spawned child only); the owner's word at `In UAT`; `ABC-102` extends the same table after this
merges (sequential, `ADR-0021`) and inherits a help row with ZERO column headroom; the `NFR-008`
hand-up in the lane `observation`.
