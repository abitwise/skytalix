---
id: 20260817T160900Z-orchestrator-observation-abc063-witness-reproduced-in-four-conditions-and-the-vacuous-a3-that-nearly-shipped-3f5a91c7
kind: observation
by: orchestrator
at: 2026-08-17T16:09:00Z
verified_by:
confidence: high
refs:
  - ABC-063
  - ABC-042
  - ABC-062
  - src/cli.test.ts
  - src/cli-options.ts
  - .grugops/context/sweep-ABC-063-064-2026-08-17/notes/20260817T155000Z-orchestrator-observation-criteria-review-at-ready-for-dev-exit-abc063-abc064-7c31d9e2.md
supersedes:
---

# `ABC-063`'s witness, reproduced by me in FOUR conditions — and the vacuous `A3` that nearly shipped

Everything below I ran. The engineer's report is not evidence for the merge; this is.

## The three conditions, plus the control his own report cannot supply

Throwaway git worktree at `grugops/abc063-uat16-six-verbs`, outside the repository.

| # | condition | result |
| --- | --- | --- |
| C3 | unmutated, WITH the new block | **38/38 green** in `src/cli.test.ts` (865/865 whole suite) |
| C2 | `"--resign"` appended to `ACCEPTED_ARGUMENTS`, WITH the block | **4 failed \| 34 passed** — reds at `:436` (the `:435` row), `:982` (`ABC-066`), `:1086` (`ABC-065`) and **`:1270` (the new block)** |
| C1 | same mutant, WITHOUT the block | **3 failed \| 34 passed** — `:436`, `:982`, `:1086` only. **`:1270`'s red is the new row's own.** |
| C0 | **the sharp one** — the mutant's effect on the RESOLVER | `resolveOptions(["--resign"])` → `{"ok":false,"problem":"unrecognised argument","offending":["--resign"]}` |

C0 is the one that matters and it is why `A3` is not vacuous only because the engineer noticed.

## The defect in `A3` as written, and why it is the fifth near-miss of its kind

`src/cli-options.ts:55` reads:

```ts
const [ASCII, UNICODE, COLOUR, WHITE, BLACK, RANDOM] = ACCEPTED_ARGUMENTS;
```

Membership is exact equality against those six **positionally destructured names**. A seventh
element appended to `ACCEPTED_ARGUMENTS` binds to nothing, so **the resolver's behaviour does not
change at all** — C0 proves it directly. `A3` says the suite must red *"here and at `:353`"*. The
`:435` half was always going to hold. **The "here" half — a loop that only asserts the six argvs are
REJECTED — would have stayed green under the very mutation it claims to catch.** A criterion that
cannot fail is a criterion that is not testing anything.

The engineer fixed it correctly, in the only way that costs nothing: the block also asserts the six
tokens' **absence from `ACCEPTED_ARGUMENTS`**. That is what reds at `:1270` in C2 and does not exist
in C1. No new case, no new file, no production line, no new child.

**He found this himself and disclosed it unprompted.** I did not catch it at the `Ready for Dev`
exit — my review confirmed the criteria were not *already satisfied* and stopped there. It never
asked whether a criterion, once written, could actually FAIL.

## Retro input, recorded as mine

This project's process rule 1 was adopted to catch criteria that no longer MATCH the tree. Its
recorded blind spot, twice, was criteria the tree ALREADY SATISFIES. **`ABC-063` names a third
class, and it is worse than both: a criterion that is neither stale nor satisfied, but
UNFALSIFIABLE against the mutation it names.** `ABC-061`'s `A4` (vacuous, disclosed by the engineer,
missed by me) and `ABC-062`'s `A3` (vacuous, found by BA/PM's measurement, and I got it wrong) are
the same family seen from different sides.

The pattern across all three: **the builder running the mutant found it; the reviewer reading the
page did not.** Rule 1 is a reading gate and these are running defects. If rule 1 is to catch this
class it needs a step that RUNS the named mutation at the `Ready for Dev` exit, not one that reads
the criterion and judges it well formed. That is a factory-level change and it is the Factory
Coach's or the owner's call, not mine to make unilaterally — recorded here as input, not enacted.

## What I verified besides the witness

- **`A4`**: `git diff --name-only e6697f6~1 e6697f6` → `src/cli.test.ts`, one path. `--numstat` over
  the whole branch: **`63 0`** — purely additive, so every fenced row (`:435`, `:525`, `:554`,
  `:630`, `:933`, `ABC-062`'s block at `:1172`) is byte-identical **by construction**, not by
  assertion.
- **`spawned`** still `10` at `:933`.
- **The `:401` resolution.** He claims `56c5cea` is the only tree holding `:353`/`:372`/`:477`/`:780`
  simultaneously and that `:401` is the near-miss family. I checked `56c5cea` myself: `:353`
  enumeration-equals-table, `:372` only-argv-literal, `:401` **near-miss family COMPLETE OVER
  POSITION**, `:477` 1000 generated tokens, `:780` `expect(spawned).toBe(10)`. **All five land.** The
  referent is `:554` today. He resolved by reading, as instructed, and did not guess.
- **A seventh stale anchor my own review table missed**: the `N8-LANE` bullet's `:247` → `:329`.

## Gate

Run by me on the branch tip BEFORE the merge and on `main` AFTER, both: **865/865 on 30 files, skip
0, `No findings.` (exit 0), lint exit 0, typecheck exit 0, build exit 0.** Merged `--no-ff` at
`6aedb7e`.

`In Security/NFR` skipped — lean mode, no trigger fires: 0 production lines, 0 new files, 0 new
spawns, blast radius one test path.

## What is NOT done

`ABC-063` is in **`Ready for UAT`**. **No UAT has been conducted, nothing has been waived, and
nothing has been signed. The owner has not been asked and has said nothing in this session.** He is
the named human whose word is this project's `In UAT` exit signature; a green agent report is not
his acceptance and I may not self-sign.
