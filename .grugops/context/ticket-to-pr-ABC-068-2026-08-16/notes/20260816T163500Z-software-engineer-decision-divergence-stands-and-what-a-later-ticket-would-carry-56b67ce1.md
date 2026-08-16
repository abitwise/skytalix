---
id: 20260816T163500Z-software-engineer-decision-divergence-stands-and-what-a-later-ticket-would-carry-56b67ce1
kind: decision
by: software-engineer
at: 2026-08-16T16:35:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-068-shared-test-helpers-have-no-written-contracts.md
  - src/cli.test.ts
supersedes: 
---

# The two helpers keep opposite failure contracts, on purpose, and I did not "improve" one

## The decision, as the delivered comment states it

`advertisedTextOf` keeps returning a meaningless slice and never throwing. `usageLineOf` keeps
throwing. The divergence is deliberate; what forbids unifying it is that making `advertisedTextOf`
throw would change the semantics of `ABC-066`'s merged, gated block. This is written into the helper
block itself (`A3`), so the next reader does not have to find this note.

## Why I did not make it throw, though it is the obvious fix

The ticket's `## Out of scope` answers it — no, and not here — and the subtask repeats it as a hard
limit. Two prior hops reached the same refusal for the same reason. Reporting it rather than doing
it is the instruction, and this is the report.

**If a later hop wants that change it is a NEW ticket with its own gate, and it is not free.** What
it would have to carry, so nobody re-derives it:

- Making `advertisedTextOf` throw changes an executable line in a merged block whose criteria were
  gated on the current behaviour, so it needs its own criteria, not an inherited one.
- Both callers today assert `toContain(SEPARATOR_FORM)` on the value they pass, so a throw would be
  unreachable from either — the new ticket would be adding a guard for a case its own two callers
  make impossible. That is a real argument AGAINST it, not for it; the value would only appear when a
  third caller exists that does not assert first.
- The prose delivered here is the cheaper half of the same protection, and it lands before that third
  caller. `ABC-061` and `ABC-062` are the tickets that add one.

Nothing about this is escalated as blocked. Nothing waits on anybody.

## One thing I chose, that a reviewer should see rather than discover

Replacing "THESE TWO HELPERS ARE THE SHARED ONES" with a list of the four names left the later
sentence's "Neither ..." without its antecedent — the old wording was what made "neither" mean the
extraction pair. Rather than edit that merged sentence (which `A5` and `## Test notes` 4 forbid me
re-flowing or tidying), I named the antecedent in MY OWN added lines. The merged sentence is
byte-identical; the ambiguity my edit would otherwise have introduced is closed above it.
