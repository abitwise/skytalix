---
id: 20260819T153000Z-agents-md-scribe-decision-the-heapused-trap-amended-not-removed-fc478f30
kind: decision
by: agents-md-scribe
at: 2026-08-19T15:30:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - AGENTS.md
  - .grugops/context/quality-gate-ABC-037-qe-2026-08-19/notes/
supersedes:
---

# The `INPUT_DEEP` slot stands; its TRAP paragraph is amended — the mechanism was wrong and the
conclusion closed off the fix

One commit, one file: `8466bef`, `AGENTS.md` +13/−4, inside the `INPUT_DEEP` slot's HTML comment
only. Nothing else in the file moved. Nothing under `src/` and nothing in `plans/` was touched.

## What I kept, deliberately and without edit

**Every runnable claim in the slot.** `INPUT_DEEP=1 npx vitest run src/line-input.test.ts`, the
26/23 counts, the 0.24 s, the "NOT DEFINED rather than skipped, so the skip count stays 0" shape,
the `PERFT_DEEP`/`SEARCH_DEEP`/`ENGINE_DEEP` family line, the BREADTH inventory, the `ABC-108` /
`NFR-008` reason for opt-in, and the `+0.185 s CPU (n=7, 7/7 positive sign)` figure. QE ran all of
them; I re-ran the ones a Scribe owns (below). They are accurate and they are in the file's voice
already. **An engineer wrote a slot to this file's own standard and I am recording that, not
quietly rewriting it.**

I also kept, unchanged, the sentence's core: *this lane asserts no memory bound*, and *do not put a
`heapUsed` row back*. That warning is load-bearing and it was bought expensively.

## What I changed, and why each change was necessary

1. **"Run it after any change to `src/line-input.ts`" now carries its reason.** It was a bare
   instruction; QE measured two mutants that die in this lane and in nothing else. An instruction
   with a measured reason survives the next reader who wonders whether it is cargo.

2. **The mechanism is corrected.** The old text let the reader infer that `heapUsed` cannot see a
   large retained string. It can: `heapUsed` accounts a **flattened** 16 MiB string in full — QE
   measured 16.00 MiB, I re-measured 16.19 MiB out of tree. The blindness is specific: the retained
   leaves in this seam are **external string data**, which `heapUsed` does not count.

3. **"The retention bound is a construction argument in `absorb()`, not a test" is gone.** It was
   false and it was the consequential half. `process.memoryUsage().external` after a forced `gc()`
   separates the builds 0.00 vs 32.00 MiB — 32:1 in 36 ms, under `NODE_OPTIONS=--expose-gc`. **A
   warning that closes off the working guard is worse than no warning**, and this one named the
   solution as impossible in the one document every role reads first.

4. **The deleted row's history is stated as a rule, not an anecdote.** The old text said the row
   "is deleted". The new text says it was *written, watched NOT fail, and deleted rather than
   shipped green* and lands the standing rule: **never ship a memory guard you have not watched go
   RED.** The engineer's judgement there was correct and is the part most worth carrying forward;
   it is now stated so it generalises past this one seam.

5. **The numbers and the guard are POINTED AT, not restated.** The comment names
   `.grugops/context/quality-gate-ABC-037-qe-2026-08-19/notes/` and stops. No test code is in
   `AGENTS.md` — the repair hop owns the implementation, and a copy in this file would be drift
   waiting to contradict the source.

## The one forward-looking sentence, and why it is not a fabricated command

The slot now says the lane command **gains `NODE_OPTIONS=--expose-gc` on the hop that lands it**.
The recorded command itself is unchanged and still exactly what I ran. This is a pointer to a
future edit, not a record of a command that does not exist — `ABC-059` exists in this backlog
because a guard pinned a spelling instead of a fact, and I am not repeating it in the other
direction by recording a flag ahead of the test that needs it. I ran the future spelling anyway
(see the observation note) so the sentence is not speculative: it is green today and costs nothing.

## What I did NOT do

- **No board move, no merge, no deploy.** Branch `grugops/agents-md-input-deep` off
  `grugops/quality-gate-ABC-037-qe-2026-08-19` @ `daaf3b6`, left unmerged for the Orchestrator.
- **No `plans/traceability.md` row**, though my role file normally requires one. The subtask fenced
  me out of `plans/`. Flagging rather than silently skipping: **this `AGENTS.md` amendment has no
  trace row**, and whoever integrates this branch should append one.
- **I removed nothing else from `AGENTS.md`.** My role says remove as much as you add; every
  candidate paragraph here is a pointer to an owner directive or a kit-override precedence note,
  and cutting one on a correction hop is not my call today. See the observation note on the size
  cap — it is the reason I am naming this rather than letting it slide.
