---
id: 20260815T124000Z-orchestrator-observation-abc-041s-security-review-is-stranded-on-an-unmerged-branch-6ad2f1b9
kind: observation
by: orchestrator
at: 2026-08-15T12:40:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - ABC-042
  - grugops/security-nfr-ABC-041
  - plans/board.md
supersedes: 
---

# Orchestrator Observation — `ABC-041` is `Done` and merged, and its ENTIRE Security/NFR review is stranded on an unmerged branch

## The finding

**Second instance of the class this hop caught by accident on `ABC-042`, and this one already
happened.**

`grugops/security-nfr-ABC-041` @ `34af5e5` is **one commit ahead of `main` and has never been
merged**. It contains five context notes and nothing else:

| note kind | subject |
|-----------|---------|
| `decision` | the trigger fired, and the engineer amended it rather than construed it |
| `claim` | the threshold cannot discriminate, and the wording that can |
| `observation` | the ASVS L1 review of `ABC-041` **and its result** |
| `observation` | `NFR-002` structural claim verified, and one route `A2`'s spies would not have caught |
| `artifact-ref` | review scope, commands, and what the hop deliberately did not touch |

**All five are absent from `main`** — checked path by path with `git cat-file -e`, not inferred from
the branch being unmerged.

## Why this matters more than a tidy-up

**`ABC-041` is in `Done`. It was merged to `main` on 2026-08-13.** Its board row records a passed
gate. **The written security review behind that record is reachable only from a branch that no
workflow reads and that nothing points at.** Anyone auditing `ABC-041` from `main` finds a `Done`
ticket whose ASVS L1 result, its one non-obvious `NFR-002` route, and its named limits do not exist.

This is the same shape as the `ABC-042` near-miss recorded at
`…-9be40d17.md`: **a role's output ends up on a branch that the integration path does not include,
while the queue's `done/` record — which is on `main` — says the subtask completed.** The queue
tells the truth about ownership and says nothing about reachability. On `ABC-042` it was caught
because the merge was assembled deliberately from three tips; on `ABC-041` nobody assembled anything,
and it was not caught.

**Two instances in two consecutive tickets is a pattern, not an accident.**

## What I did NOT do, and why

**I did not merge it.** The owner's instruction was *create a spawn account and merge* — about
`ABC-042`. `ABC-041` is a closed ticket, and merging content into `main` that changes what a `Done`
ticket's audit trail contains is a decision with an owner, taken deliberately, not folded into
someone else's merge because I happened to be holding the key. Coding rule 5, and the standing limit
that the delegated keystroke is not a delegated judgement.

**I did not delete the branch.** Branch deletion has been the owner's call personally, twice
(`memory-bank/60-progress.md`).

## The ask, priced

**One merge of a documentation-only branch — five notes, zero bytes under `src/`, no code, no
conflict** (`plans/traceability.md` is not touched by it). It restores the audit trail of a `Done`
ticket to `main`. It is the owner's to say yes to.

**And the durable question underneath it, which is bigger than one branch:** nothing in this factory
checks that a completed subtask's notes are reachable from `main`. `git branch --no-merged main` is
the whole check, it takes one second, and no workflow runs it. That is a Factory Coach item or a
`plans/` ticket, and `mode` is lean, so the Coach's trigger is the owner's — recorded here, not
turned into a process rule by me.
