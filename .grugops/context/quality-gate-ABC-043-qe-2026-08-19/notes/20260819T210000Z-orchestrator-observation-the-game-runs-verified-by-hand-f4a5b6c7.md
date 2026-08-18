---
id: 20260819T210000Z-orchestrator-observation-the-game-runs-verified-by-hand-f4a5b6c7
kind: observation
by: orchestrator
at: 2026-08-19T21:00:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-037
  - ABC-078
  - ABC-035
  - ABC-033
  - EPIC-006
supersedes:
---

# It plays chess. Run by the Orchestrator at the delivery tip, not read from a report

```
$ printf 'e2e4\n' | npm run chess --silent -- --colour white
...
   1. e4      Nc6
> input ended        exit 0
```

**White played `e4` because a human typed `e2e4`. The engine replied `Nc6`. The history pane
rendered `1. e4 Nc6`. EOF terminated the session cleanly with `input ended` and exit 0.**

That is the merged coordinate reader, the merged dispatcher, the merged command table, the real
`InputSeam`, the real `EngineSeam` searching against a wall clock, the merged frame writer, and the
merged turn loop — **all of them, in one process, driven by a pipe.**

## What this closes

`ABC-019` shipped a loop awaiting an `InputSeam` on 2026-08-11 and shipped no implementation. Its
header recorded why: *"a `src/` stub module would be production code that is dead the day the real
parser and engine land."* **Both landed.** The chain the owner asked for on 2026-08-18 —
`ABC-078 → ABC-037 → ABC-043` — turned out to be six merges long, and this is the last of them.

`ABC-043`'s own problem statement said `src/turn-loop.ts` had **0 production importers**, measured.
It has one now.

## What this does NOT close, stated in the same breath

- **`ABC-043` is not `Done` and not accepted.** It is delivered on a branch and has not passed QE.
- **No human has accepted any of it.** `ABC-033`, `ABC-035`, `ABC-078` and `ABC-037` all sit in
  `Ready for UAT`, which is **4/4, at its WIP limit**, because every one shipped production lines
  and the zero-production-lines waiver is therefore unavailable. **An agent running the game is not
  a signature.**
- **The engine is weak on purpose-for-now.** `NFR-005` measured depth 4 against a FAIL floor of 6;
  `ABC-079`/`ABC-080`/`ABC-081` are the tickets that buy plies and none is built. `Nc6` is a
  reasonable reply, not evidence of strength.
- **`NFR-008`'s CPU clause is BREACHED** (`ADR-0014`, 14.480 s against 13 s), and this ticket adds
  a measured **+0.86 s**. It did not cause the breach and it does not fix it.

## The one thing I want the next reader to take from this

Six tickets, and **not one of them shipped a criterion its author could not defend**. Along the way
the chain caught a false comment in production source, three guards that did not bite, two mutants
that survived a full suite and a deep lane, a `RISK-002` guard bypassable in two lines, an
off-by-one visible only on a Windows pipe, a stream channel no spy could see, and — at this hop — a
**merged guard that shipped GREEN with a planted violation in it**. Every one was found by an agent
mutating its own work or a sibling's, and every one was reported by the agent that found it rather
than quietly fixed.
