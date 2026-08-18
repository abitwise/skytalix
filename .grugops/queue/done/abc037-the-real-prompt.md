---
task: ticket-to-pr-ABC-037-2026-08-19
subtask: abc037-the-real-prompt
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-037-the-real-prompt-input-seam.md
ref: .grugops/context/ticket-to-pr-ABC-037-2026-08-19/
parent_ref: .grugops/context/ticket-to-pr-ABC-035-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T09:05:00Z
branch: grugops/abc037-the-real-prompt
base: main @ 4c28f89
---

# Subtask: `ABC-037` — the production `InputSeam`. The hole `ABC-019` shipped, finally filled

**This is the ticket the whole chain was for.** `ABC-019` published `InputSeam` in merged code and
shipped no implementation; the only one that exists is a scripted stub inside
`src/turn-loop.test.ts`. You are writing the real one.

Read the ONE note in `ref:` before you open a file — it is my `Ready for Dev` exit review with
first-hand measurements at `main` `4c28f89`. Take them as given.

## Three anchors on your page are STALE. Corrected, measured — do not follow the page

- **`InputSeam`: page says `src/turn-loop.ts:127` → measured `:135`.**
- **`INPUT_ENDED_NOTICE`: page says `:168` → measured `:176`.**
- **the frame sanitizer: page says `src/frame.ts:202` → measured `:123`** (the same 79-line drift
  `ABC-033` carried; it is module-private, not exported).

The `turn-loop.ts` anchors drift by a consistent **+8**. `PromptOutcome` `:125` and `PROMPT_ROWS`
`src/frame.ts:53` are **exact**. The `eof` arm: **re-read the union at `:125`; do not cite `:123`.**

**Correct the stale anchors on the ticket page in a SECOND, SEPARATE commit** — `A8` is measured
against the delivery diff.

## What is now merged and yours to delegate to

- **`resolveMoveInput`** — `src/move-input.ts:149`. Gated four times.
- **`classifyCommand`** / **`helpMessages`** — `src/command-input.ts:104` / `:93`.

Your `## Scope` says the classification order is **delegated, not duplicated**: the line goes to the
command table, then to the dispatcher. **This module contains no grammar and no token table.**
`A4` is that, asserted by spy.

## The criterion that decides this ticket

**`A5` — the no-catch ruling, and it must be run THROUGH `runTurnLoop`.** A build that wraps the
resolver call in a `try`/`catch` returning `rejected` **passes every other criterion on the page and
fails only this one**. Assert the propagation, the byte-identical `toFen` after `ABC-019`'s `A9b`
repair, and that no `PromptOutcome` is produced.

Asserting it against the seam in isolation proves nothing — the repair it depends on is the loop's.

## THE INHERITED HAZARD — read this before you write `A6`'s guard

`ABC-035`'s QE proved **four stream channels escape a `vi.spyOn` stream guard**: `console.log`,
`console.error`, a `process.stdout.write` ref **bound at module load**, `fs.writeSync`, and a
`globalThis` flag. Vitest intercepts `console.*` before it reaches `process.stdout.write`, and
`vi.spyOn` replaces a property a load-time binding already escaped.

**`A6` asserts zero CSI bytes and zero `FrameSink` writes — and unlike `ABC-035`, your module
legitimately DOES write** (the prompt string). So the weak detector is live here in a way it was not
there. **Build a guard that survives those five channels, or state plainly which ones it cannot see
and why.** Do not ship a guard whose weakness is already documented one ticket back.

## Security — NOT waived, and this is the first module in the repo that reads outside input

Your page names three bars with a falsifiable firing threshold. **Two ordering blockers going away
does not pre-clear them.**
1. **The read line is data, never code.** No `eval`, no `Function`, no dynamic `import` of anything
   derived from input, no shell, no `child_process`. Assert **zero occurrences** in the delivered
   module.
2. **Unbounded input is bounded.** A line over a stated cap — **you pick the number and state it in
   the test rows** — is truncated or rejected, never passed to a resolver, never grows the frame.
   This bar is about memory, not parsing.
3. **Every byte to the terminal goes through the frame's sanitizer** (`src/frame.ts:123`).

**Firing threshold:** the security half fires if the diff touches any file under `src/` beyond your
module and its test file(s), adds a runtime dependency (`package.json` has **no `dependencies`
key** — verified today, absent not `{}`), or imports any Node builtin other than the line-reading
one.

## Fences

- **`src/turn-loop.ts` and `src/frame.ts` byte-identical** (`A8`).
- **Do not modify `src/move-input.ts` or `src/command-input.ts`** — merged and gated.
- **Do not re-decide `exitCode: 0`** on EOF. `ABC-019` ruled it and the type says so.
- **Do not catch the parser bug.** That is `A5` and it is the ticket's own ruling: `EPIC-003` owns
  it *by not catching it*. `EPIC-006`'s half — what the top-level handler prints — is `ABC-043`'s.
- **No tab-completion** (`ABC-038`), no raw mode, no arrow keys, no input-history recall.
- One test file, per the page's lane allotment.
- Do not merge, do not deploy, do not move a board column. **Do not edit the DoR table** — the page
  reads 9/10 ⚠️x2 and re-scoring is BA/PM's pen; I pulled on the measured discharge.

## Lane cost — the budget is under active question

**`ABC-108` (P1) records that the default lane sits at or over `NFR-008`'s 13 s CPU clause and did
so before `ABC-078` arrived.** Until Architect/Design rules it, **`N8-LANE`'s 650 ms cannot honestly
be granted to any ticket** — a 5% slice of a spent total is not a slice. **Keep the default lane
cheap, put breadth behind an opt-in flag, and report your cost — do not claim the bar met.**

## Gate

Full blocking gate in a **contained lane**. An isolated agent worktree has no `.claude/worktrees/`,
so the recorded `npm test` / `npm run lint` work correctly inside one — use them and say so. The
repo root is contaminated (`ABC-050`, routed; do not chase it). Baseline on `main`: **1152 tests /
38 files, skip 0**. Report `PERFT_DEEP=1` 32/32.

**Mutate every guard you write before you believe it, and record the mutant DIFF, not a
description.** That practice has caught a false comment, three dead guards, two immortal mutants and
one bypassable `RISK-002` guard across the last four tickets.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — use
`claim` / `observation` / `decision` / `artifact-ref`. Claim by hand: `mkdir -p
.grugops/queue/claimed`, then a **bare** `mkdir` of `.grugops/queue/claimed/abc037-the-real-prompt`.
**Commit incrementally** — an API outage cost two hops a save-at-the-end.

Commit on `grugops/abc037-the-real-prompt`, never on `main`.
