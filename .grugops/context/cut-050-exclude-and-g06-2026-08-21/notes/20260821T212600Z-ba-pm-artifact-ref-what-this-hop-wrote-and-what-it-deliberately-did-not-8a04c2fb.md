---
id: 20260821T212600Z-ba-pm-artifact-ref-what-this-hop-wrote-and-what-it-deliberately-did-not-8a04c2fb
kind: artifact-ref
by: ba-pm
role: ba-pm
task: cut-050-exclude-and-g06-2026-08-21
at: 2026-08-21T21:26:00Z
verified_by: ""
confidence: high
refs:
  - ABC-118
  - ABC-119
supersedes: ""
tree: grugops/cut-050-exclude-and-g06 off main @ 565c623
---

# Artifacts written, and the list of things deliberately NOT written

**Hand-authored `artifact-ref`; no stamp.**

## Written

- `plans/tickets/ABC-118-a-type-valid-exclude-glob-silently-changes-what-the-lane-collects.md` (266 lines)
- `plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md` (312 lines)
- `plans/board.md` — one header line, **two `Backlog` rows**, nothing else
- `plans/traceability.md` — **two rows appended**, nothing else
- these five notes

## NOT written, each deliberately

| file | why |
|---|---|
| anything under `src/` | fenced; zero production and zero test lines |
| `vitest.config.ts` | fenced; never opened for writing. Every probe ran from a **replacement config outside the repository** |
| `plans/nfr-catalog.md` | fenced. Eight rows re-hashed **`63f667958eeabcaa884d45b18b513c7bbe9855266c4959dfd16f87b0802eca31`**, unchanged. `NFR-008`'s wording debt is **named owed**, Architect/Design's, and is **pre-existing** |
| `AGENTS.md` | `ABC-109` byte cap. The fifth deep-lane `### Test` line `ABC-119` implies is **named owed**, `ABC-109`'s owner's |
| `.claude/worktrees/residual-gqe115-3` | **measured, not touched.** It is the Orchestrator's, and removing it would destroy the evidence `ABC-118` rests on |
| any board column, WIP limit, or existing DoR score | the Orchestrator's |
| `ABC-050`'s second residual (sequencer / cached-durations `--no-cache`) | **found, named, LEFT UNCUT** — not authorised. Named in `ABC-118`'s `## Out of scope` |
| `.grugops/test-skips.md` | human-owned; read only |
| a third ticket of any kind | the owner authorised **exactly two** |

## Refusals

- **No merge, no deploy, no commit on `main`.** Work is on `grugops/cut-050-exclude-and-g06` in its
  own `git worktree`.
- **No `finding` note.** `context.human_admission` is `off`; the sanctioned writer is absent. Every
  note here is `decision` / `observation` / `artifact-ref`, hand-authored, unstamped.
- **No transcript promoted to a criterion**, including my own hand run of the product.
- **No `N8-SPAWN` ceiling raise taken in advance** of the placement decision that would justify it.
