---
id: 20260919T162300Z-software-engineer-artifact-ref-abc107-branch-commit-and-the-one-file-c2a7e5d4
kind: artifact-ref
by: software-engineer
at: 2026-09-19T16:23:00Z
verified_by:
confidence: high
refs:
  - ABC-107
  - ADR-0022
  - src/frame.overflow-bound.test.ts
  - plans/tickets/ABC-107-the-message-region-cannot-show-a-seven-candidate-ambiguity.md
  - plans/traceability.md
supersedes:
---

# `ABC-107` — the branch, the commit, and the one file

Branch **`grugops/ABC-107-overflow-bound`**, created from `grugops/wave-2026-09-19` @ `475d559`
in an isolated worktree. **Unmerged**; there is no git remote, so nothing is pushed and no PR
exists (`AGENTS.md` § "Branching model").

| commit | paths | what |
| --- | --- | --- |
| `a5a9178` | `src/frame.overflow-bound.test.ts` (+202 / −0) | the whole build: 25 rows, 4 fixtures, `A1'` / `A2` / `A3` / `A5` |
| (next) | `.grugops/context/ticket-to-pr-ABC-107/notes/*`, `.grugops/queue/{claimed→done}/ticket-to-pr-ABC-107*`, `plans/traceability.md`, `plans/tickets/ABC-107-*.md` § Delivery | the state this hop wrote, kept separate so the code commit is the zero-production-lines measurement on its own |

Commands run at `a5a9178` (all recorded with numbers in the sibling `claim`): `npm run lint`,
`npm run typecheck`, `npm run build`, `npx vitest run --dir src`, `--reporter=json` skip count,
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0`, and the
before/after lane CPU sample in the sibling `observation`.

Not a UAT spec, so no `sha` / `gate_run` / `content_hash` triple is carried — the same shape as
every prior Software Engineer `artifact-ref` on this install (e.g. `ABC-064`'s).

**Remaining work, not this role's:** the board move `In Development` → `In Review`
(Orchestrator); QE's `qe-e2e` hop; the UAT waiver measured from git by the Orchestrator; the
`NFR-008` hand-up in the `observation` note.
