---
id: 20260802T205454Z-orchestrator-decision-14cf502d
kind: decision
by: orchestrator
at: 2026-08-02T20:54:54Z
verified_by: 
confidence: high
refs:
  - refinement-fide-9-6-1
  - ABC-020
  - ABC-011
  - ABC-012
  - ADR-0002
  - EPIC-001
  - EPIC-004
  - src/gameend.ts
  - memory-bank/60-progress.md
  - plans/board.md
  - ticket-to-pr-ABC-020
  - 20260801T195000Z-qe-e2e-claim-4ddc3f96
supersedes: 
---

# Routing: settle FIDE 9.6.1 — one subtask, BA/PM, against the actual Laws text

## The request

Project owner, 2026-08-02: *"Settle FIDE 9.6.1"*. This is open question 1 in
`memory-bank/60-progress.md` and the one open question recorded **against merged code** when
ABC-020 landed on `main` at `cb62c9f`.

## What is actually open

`src/gameend.ts:157` draws automatically on `occurrences >= 5` from a `positionCounts` map.
FIDE Article 9.6.1 is remembered by QE as *"five **consecutive** alternate moves"*. If that
wording is real and load-bearing, five NON-consecutive occurrences draw here where the Laws
would leave only the 9.2 claim — the same error direction as the G-1 defect ABC-020 fixed
(an automatic draw taken from the player having the move), at a rarer trigger.

QE recorded it `UNKNOWN - verify` and declined to assert a conformance gap from a remembered
sentence. **That was correct and it is the whole reason this task exists**: the question is not
"what does the code do" (settled, measured, 100% covered) but "what do the Laws say", and nobody
has read them.

## Classification and route

`refinement` → `agent-factory/workflows/07-backlog-refinement.md`. **One subtask, one role:
BA/PM.** The routing matrix sends product/rules clarity to BA/PM, QE's own recommendation names
BA/PM, and `60-progress.md` open question 1 says "needs a BA/PM ruling against the actual Laws
text". Nothing here is a structure question **yet**.

**Why not a wider fan-out.** Two roles were considered and deliberately not spawned:

- **Architect/Design.** The shape half — consecutiveness is not derivable from a counts map at
  all, so a real gap needs the per-ply key list `ADR-0002` clause 3 gives EPIC-004's search —
  is genuinely theirs. It is **conditional on the ruling** and spawning it now would be
  speculative work on a question that may close as "no gap". ABC-020 itself was cut with an
  open design question handed to a later design hop; same pattern applies.
- **Software Engineer.** No code changes on this task. Whether `src/gameend.ts` changes at all
  is the output of the ruling, not an input to it.

Width used: **1 of `queue.wip_limit` 3.** No limit approached, no override taken.

## The tool gap, and why it does not block

BA/PM carries no `WebFetch`/`WebSearch` in this install. It carries `Bash`, and network egress
is reachable from this sandbox (`handbook.fide.com` answered `200` on a HEAD-equivalent probe at
2026-08-02T20:54Z). So the authoritative text is retrievable by the owning role itself — no
other role fetches it and hands it over. **Nothing is relayed agent-to-agent**: the retrieved
text is saved under this task's context and every consumer reads it from there.

If the fetch fails, the honest move is to STOP and name the missing input (the Laws text, or a
human paste of it) — not to rule from memory. That is exactly the mistake ABC-020 was correcting.

## Board and WIP

**No board move by this decision.** This is a refinement of an open question against already-Done
code; no ticket is in flight and every column between `Ready` and `Done` is empty. If the ruling
cuts a ticket, `Ready` is 5/8 and `Backlog` is unlimited, so either destination is inside its
limit without an override.

## Stop conditions handed to the subtask

1. The Laws text cannot be retrieved → stop, name the missing input, rule nothing.
2. The retrieved text is ambiguous on the point → record a `claim` with
   `confidence: UNKNOWN - verify` and escalate to the named human. Do not pick a reading to
   close the task.
3. The ruling implies a `src/gameend.ts` change that is not derivable from `positionCounts` →
   cut the ticket with the shape question OPEN and routed to a design hop. Do not decide the
   shape in a refinement.
4. Scope stays on 9.6.1. Open questions 2 (`GameResult` dead alias) and 3 (A5/A8 `Given`
   wording) are NOT in this task — coding rule 5.

## Provenance

Written directly into `notes/`. This install has **no `scripts/context-io.ts`, no
`mcp__grugops__propose_note` and no `scripts/claim.js`** — Workflow 16's sanctioned writer and
Workflow 17's atomic claim primitive both absent, the degradation every role here has recorded
since 2026-07-31. Consequence, restated so it is not lost: **`finding` is not admissible on this
task** (no §14 gate to stamp one), and the queue claim is degenerate at width 1 (no contention is
possible, so no atomic primitive is being relied on). This note is a `decision` — a soft kind
needing no stamp — and nothing is self-stamped.
