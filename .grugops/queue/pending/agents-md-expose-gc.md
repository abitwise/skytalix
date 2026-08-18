---
task: agents-md-expose-gc-2026-08-19
subtask: agents-md-expose-gc
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: —
ref: .grugops/context/agents-md-expose-gc-2026-08-19/
parent_ref: .grugops/context/repair-ABC-037-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T15:00:00Z
branch: grugops/agents-md-expose-gc
base: main @ HEAD
---

# Subtask: `AGENTS.md:94`'s command silently runs two guards short. Your own stated trigger has fired

**This is the edit you said you would make.** Your last hop wrote that the lane command *"gains
`NODE_OPTIONS=--expose-gc` on the hop that lands it"*, and deliberately did not record the flag
ahead of the test — citing `ABC-059`, correctly. **The hop landed. `ABC-037`'s repair merged to
`main` and the retention guard exists.**

## The measurement, taken by me first-hand on `main`

```
INPUT_DEEP=1 npx vitest run src/line-input.test.ts                        -> 142 passed
INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts -> 144 passed
```

**The command `AGENTS.md:94` records runs TWO tests fewer and exits 0.** It does not warn, it does
not skip-count them (skip stays 0), and one of the two it silently drops is the `external`-memory
retention guard that this whole thread of work exists to have.

**A recorded command that passes while running short is worse than a wrong one** — a wrong command
fails and gets fixed. The `ABC-037` engineer flagged this itself as *"the one way this repair could
quietly decay"*, and it could not fix it because you and it would have collided.

## The job

Update the `INPUT_DEEP` slot's command line to the spelling that runs the whole lane, and state the
counts so the next reader can tell at a glance whether their run was complete. **Run whatever you
record** — the file's own standing rule.

Keep it minimal: this is a command-line correction, not a rewrite of the slot you already reviewed
and deliberately kept.

## Read before you write

`parent_ref:` — the repair hop's four notes. The engineer reproduced your predecessor's disputed
measurement **to the byte from a different tree** (`33,554,472`), and added one refinement worth
carrying if you touch the trap paragraph at all: an **unflattened** rope *does* read ~0.02 MiB, so
the cons-string account was not invented — it is real V8 behaviour that is **not the mechanism in
this seam**. Its own words: *"a partially-true mechanism pointing at the wrong field terminated the
search — that is worse than being plainly wrong."* **That is a sharper lesson than the one currently
in the file, and it is yours to decide whether it earns the bytes.**

## The byte budget is the reason for that hesitation, and it is now measured

`AGENTS.md` is **~29,700 of the 32,768-byte cap**, and past it the file truncates **silently**,
tail-first — which is where `## When uncertain` and the DoR/DoD pointers live. **BA/PM is cutting a
ticket for that right now** (`cut-agents-md-cap-2026-08-19`), and it names you as owner.

**So: spend as few bytes as you can here.** If carrying the refinement means going net-positive,
prefer the shorter true sentence over the longer one. Do not start the compaction in this hop — that
is the other ticket, with its own mandate.

## Fences

- **`AGENTS.md` only**, plus your notes. Nothing under `src/`, nothing in `plans/`.
- Do not remove the slot or the warning. Do not restate the guard's implementation.
- Do not begin the compaction work.
- Do not merge, do not deploy, do not move a board column.

## Gate

No `src/` change. Contained lane, record unchanged: **1181 tests / 39 files, skip 0** on `main`.
An isolated agent worktree has no `.claude/worktrees/`, so the recorded commands work inside one.
**Report the byte size of `AGENTS.md` before and after your edit** — that number is now load-bearing.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/agents-md-expose-gc`.

Commit on `grugops/agents-md-expose-gc`, never on `main`.
