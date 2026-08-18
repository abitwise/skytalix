---
task: agents-md-input-deep-2026-08-19
subtask: agents-md-input-deep
role: agents-md-scribe
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: —
ref: .grugops/context/agents-md-input-deep-2026-08-19/
parent_ref: .grugops/context/quality-gate-ABC-037-qe-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T13:00:00Z
branch: grugops/agents-md-input-deep
base: grugops/quality-gate-ABC-037-qe-2026-08-19 @ HEAD
---

# Subtask: `AGENTS.md` gained 12 lines from an engineer's pen. Take ownership, and one paragraph is now FALSE

Branch off `grugops/quality-gate-ABC-037-qe-2026-08-19` at its tip. Read `parent_ref:` (QE's seven
notes) first — QE ran every claim in the added text.

## What happened, stated plainly

The `ABC-037` engineer added an `INPUT_DEEP` command slot and a `heapUsed` trap paragraph to
`AGENTS.md`. **It flagged this itself as beyond its fences and did not hide it.** `AGENTS.md` is
your file; I am routing it to you now rather than letting an engineer's edit stand unreviewed in the
one document every role reads first.

## 1. The command slot — VERIFIED ACCURATE, keep it

QE ran every claim in it: the 26/23 counts, the 0.24 s figure, skip 0, and *"run after any change"*
is now backed by **two measured kills that occur only in that lane**. Keep it. Your job here is
ownership and voice, not correction.

## 2. The trap paragraph — measurement right, mechanism WRONG, conclusion FALSE

It currently says, in substance, that the retained-bytes bound **cannot be a test** because
`heapUsed` is blind.

- **Right:** `heapUsed` is blind to this leak. QE reproduced it (0.11 MiB leaking vs 0.10 bound).
- **Wrong mechanism:** it attributes the blindness to *"a cons-string's referents"*. QE measured a
  **flattened** 16 MiB string reported by `heapUsed` as **16.00 MiB on the nose**. The retained
  leaves are **external string data** — `external_memory` / `external`, not unaccounted referents.
- **False conclusion:** a guard **does** exist. `process.memoryUsage().external` after a forced
  `gc()` separates the builds cleanly — delivered **0.00 MiB** vs the leaking build **32.00 MiB**,
  a **32:1 margin in 36 ms**, needing `NODE_OPTIONS=--expose-gc`.

**This is the part that matters and the reason this is not cosmetic:** as written, the paragraph
**steers the next engineer away from the very guard that works.** A warning that closes off the
solution is worse than no warning.

**Amend it, keep its purpose.** The purpose is real and worth preserving: *do not trust `heapUsed`
to prove a retention bound, and do not ship a memory guard you have not watched fail.* That lesson
was learned the hard way — the engineer deleted its own false guard rather than ship it green — and
it should survive your edit. What must change is the mechanism and the "cannot be a test" claim.

## Fences

- **`AGENTS.md` only** (plus your notes). Nothing under `src/`, nothing in `plans/`.
- **Do not remove the slot or the warning.** Correct them.
- **Do not restate the guard's implementation** — the engineer is adding the actual test in a
  parallel repair hop off the same base. Point at the fact; do not write the code.
- Keep it short and high-signal, real commands only — the 12 coding rules are yours and the file's
  voice is yours.
- Do not merge, do not deploy, do not move a board column.

## Gate

No `src/` change, so the suite cannot move. Run the contained lane and record the numbers unchanged:
**1175 tests / 39 files, skip 0**. An isolated agent worktree has no `.claude/worktrees/`, so the
recorded commands work inside one. **If you add or change a command in `AGENTS.md`, RUN IT** — that
is the file's own standing rule and `ABC-059` exists because a guard pinned a spelling instead of a
fact.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of
`.grugops/queue/claimed/agents-md-input-deep`.

Commit on `grugops/agents-md-input-deep`, never on `main`.
