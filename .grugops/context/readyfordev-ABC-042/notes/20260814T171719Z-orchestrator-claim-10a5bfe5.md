---
id: 20260814T171719Z-orchestrator-claim-10a5bfe5
kind: claim
by: orchestrator
at: 2026-08-14T17:17:19Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - src/history-pane.nfr.test.ts
  - src/glyph-mode.nfr.test.ts
supersedes: 
---

# `ABC-042`'s security bar 1 and its `A1` cannot both be satisfied, as literally worded

**This is a `claim`, not a ruling. The ruling is Security/NFR's and is not the Orchestrator's to
make — nor the implementer's.** `ABC-041` established that the hard way: the implementer read a
trigger down to its rationale and Security ruled the trigger FIRED on the letter.

## The two clauses

`## Security / NFR triggers`, bar 1:

> *"Arguments are data, never code. **Zero occurrences of `eval`, `Function`, `child_process`,**
> dynamic `import(` of anything derived from argv, and no shell — **asserted over the delivered
> diff**."*

and the firing threshold below it:

> *"the security half fires … if the diff … **imports any Node builtin other than none**"*

against `## Acceptance`:

> *"`A1`, `A4`–`A9` run the delivered entry point **as a child process with stdout as a pipe** — …
> the only mode in which 'a human can run it' is actually proved"*

and `## Test notes` 1:

> *"The proof is a child process, not an import. … `src/history-pane.nfr.test.ts:566-590` is the
> **merged precedent for spawning here**."*

## Why they collide

The delivered diff must contain a test file. That test file must spawn a child process to satisfy
`A1` and five more criteria. On this stack a spawn comes from `node:child_process` — which is a
Node builtin and is the literal string bar 1 forbids anywhere in the delivered diff.

**As literally worded, every build that satisfies `A1` violates bar 1, and every build that
satisfies bar 1 fails `A1`.** This is the same defect class QE blocked `ABC-041` on: a criterion
whose literal reading rejects the delivered build.

## Measured, so the ruling has numbers

- Production files under `src/` importing any Node builtin at HEAD: **0 of 18**. The invariant is
  real and it holds.
- Test files already importing `node:child_process`: **2** — `src/history-pane.nfr.test.ts:23`
  (`import { spawnSync }`, the precedent `ABC-042` cites **by name**) and
  `src/glyph-mode.nfr.test.ts:65`.
- The board header records this invariant as **"0-of-47"**. 47 counts every `.ts` file under
  `src/`, tests included, and **2 of those 47 import a builtin today**. The 0 figure is true of
  the **18 production** files only. The stated denominator does not match the stated numerator.

## The shape of the question, not its answer

Bar 1's intent — argv never becomes code — is served by forbidding `child_process` in the
**entry point and resolver**. `A1`'s intent — prove a human can start it — requires
`child_process` in the **test file**. If the scope of "the delivered diff" is production modules,
both intents hold at once and the merged precedent stays legal. **Whether that is the correct
reading, and whether the firing threshold's "imports any Node builtin other than none" survives
it, is Security/NFR's call.**
