---
task: uat-ABC-078-2026-08-20
subtask: uat-abc078
role: uat-planner
workflow: agent-factory/workflows/06-uat-pack.md
ticket: plans/tickets/ABC-078-iterative-deepening-and-the-engine-seam.md
ref: .grugops/context/uat-ABC-078-2026-08-20/
enqueued_by: orchestrator
enqueued_at: 2026-08-20T18:00:00Z
branch: grugops/uat-abc078
base: main @ HEAD
---

# Subtask: conduct UAT on `ABC-078` — iterative deepening and the `EngineSeam`

**The waiver was tested and does NOT apply.** Measured from git per `AGENTS.md` § *Test and UAT
authority*: `ABC-078` delivered `src/engine.ts` (`91d852e`, *"grug make the engine deepen against the
clock"*). Production lines present ⇒ **no waiver, UAT is conducted, and the owner's word signs.**

## Read first
- `AGENTS.md` § **Test and UAT authority** — in full, before you write a scenario.
- The `ABC-078` ticket page; `agent-factory/workflows/06-uat-pack.md`;
  `agent-factory/roles/uat-planner.md`.
- `.grugops/context/security-nfr-ABC-078-2026-08-18/notes/` — the gate that passed it, including
  what it recorded as NOT verified.

## What you may do, and the one thing you may NOT
**Conducting the UAT is yours** (owner, standing, 2026-08-15). Exercise it against a real build —
`npm run chess` is wired and live.

**YOU MAY NOT SIGN.** The owner's word in session is the `In UAT` signature (2026-08-16) and a green
agent report is explicitly NOT his acceptance. `context.human_admission` is `off`; no `finding` is
admissible; your result is an unstamped `decision` / `observation`. **Write it so "UAT passed" can
never later be read as a human having accepted this.**

## What this ticket makes hard, and I want it named rather than smoothed
This is an **engine strength / time-budget** ticket. Its user-visible behaviour is *"the machine
answers, and it answers in time"* — which is **not** a business scenario a non-engineer can grade by
looking at it. Two traps:

- **A move being legal is not the criterion.** `ABC-078` is about deepening against a clock. A
  scenario that only checks a legal reply passes on a random-move engine and proves nothing.
- **Do not smuggle QE in as UAT.** `AGENTS.md` says *"QE IS NOT UAT, and conflating them is the
  misreading to refuse in advance."* If the honest answer is that part of this ticket has **no
  business-observable acceptance** and can only be graded by measurement, **say so and grade only
  the part a human can observe.** That answer is more useful than an invented scenario.

## Fences
- **Do not touch `plans/board.md`** — column moves are mine and other branches are live in that file.
- **Do not touch `src/`, `AGENTS.md`, `plans/nfr-catalog.md`, `package.json` or `vitest.config.ts`.**
- **Do not fix any defect you find.** Report it. A failing UAT is a legitimate result.
- Do not merge, do not deploy, do not self-sign.
- Report your lane cost, **do not grade it** — `NFR-008` is ruled BREACHED and `ABC-110` is live.

## Publish
Typed notes per Workflow 16 into `ref:`, hand-authored per `agent-factory/contracts/context-note.md`,
plus the UAT pack and a signoff checklist the owner can answer with his word. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of `.grugops/queue/claimed/uat-abc078`.
**Work in your own `git worktree`, not the repository tree** — another agent runs in this wave.
Commit on `grugops/uat-abc078`, never on `main`.
