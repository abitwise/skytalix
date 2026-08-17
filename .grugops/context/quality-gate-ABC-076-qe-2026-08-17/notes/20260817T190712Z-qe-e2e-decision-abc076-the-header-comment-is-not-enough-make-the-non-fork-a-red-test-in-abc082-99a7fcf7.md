---
id: 20260817T190712Z-qe-e2e-decision-abc076-the-header-comment-is-not-enough-make-the-non-fork-a-red-test-in-abc082-99a7fcf7
kind: decision
by: qe-e2e
at: 2026-08-17T19:07:12Z
verified_by:
confidence: high
refs:
  - src/evaluate.test.ts
  - src/cli.test.ts
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
  - plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
  - .grugops/context/ticket-to-pr-ABC-076-2026-08-17/notes/20260817T185041Z-software-engineer-observation-npm-test-red-on-cli-test-ts-hardcoded-module-count-not-fixed-in-scope-f8b36aa.md
supersedes:
---

# The shared mirror helper: the header comment is **not** sufficient. It is a fork waiting to happen — and the cheap fix is a red test in `ABC-082`, not a better comment.

QE was asked to judge this as a design question. **The engineer's handling of it was correct and I
am not asking him to have done differently.** Biome's `lint/suspicious/noExportsInTest` really does
forbid the export (measured by him; the ticket's security firing threshold really does forbid a
third file). Given both, module-private plus a header comment was the only in-scope move.

## Why the comment is not enough

- **It is advice with no consequence.** Nothing reds if `ABC-082` retypes `mirrorPosition`. The one
  thing on this project that reliably stops a drift is a failing test; `src/cli.test.ts`'s
  hard-coded module count is the standing proof that even an *annoying* assertion gets obeyed, while
  a comment gets read once.
- **A fork here is silent and expensive.** Two copies of `mirrorPosition` do not conflict, do not
  fail to compile, and do not disagree until a mirroring rule changes — at which point `ABC-082`'s
  corpus and `ABC-083`'s corpus assert different things while both look green.
- **The comment asks for a refactor no criterion pays for.** `ABC-082`'s engineer arrives holding a
  pawn-structure ticket. Lifting three working functions out of another ticket's test file is, on
  this repo's own rules (coding rules 9–10, *don't refactor working code*), exactly the kind of
  drive-by he is told not to do. **The comment asks him to break a rule to obey a comment.**
- **The constraint that forced this expires, and nothing records that it expired.** The "no third
  file" fence is `ABC-076`'s security firing threshold. It does not bind `ABC-082`. So by the time
  the comment is read, its stated reason is void — and a reader who checks the reason will find it
  no longer applies and may conclude the whole instruction is stale.

## Recommendation, in priority order

1. **Make the non-fork an acceptance criterion of `ABC-082`, phrased so it is mechanically red.**
   Not *"reuse the helper"* — that is unfalsifiable. Something like: *`ABC-082`'s corpus is a strict
   superset of `ABC-076`'s — it contains all 184 of `ABC-076`'s positions by
   `board|blackToMove|castling|epSquare` key, and `src/evaluate.test.ts` and the new suite import
   the corpus from one module.* A forked corpus fails the first half the moment the two drift; a
   retyped helper fails the second by inspection of the import graph. **This is the whole
   recommendation; the rest is detail.** It is BA/PM's to cut.
2. **Do the lift in `ABC-082`, not in a separate refactor ticket.** A standalone "move three
   functions" ticket delivers zero user value and would sit in the backlog behind `ABC-077`. `ABC-082`
   is the first ticket with a real reason to touch them.
3. **Do NOT relax `noExportsInTest` and do not add an export to `src/evaluate.test.ts`.** The rule is
   right; the answer is a plain module, not an exception.

## One consequence of the lift that nobody has costed yet — flagging it now

`src/eval-corpus.ts` would be **test-support code living in `src/`**, and `src/cli.test.ts:733`
counts every non-test `.ts` in `src/` as a *production module*. The lift therefore bumps that count
again (21 → 22 with `ABC-031`, → 23 with the lift) **and puts a file that ships to nobody into a
list whose entire purpose — `ADR-0011`'s licence guard, per the row's own comment — is production
surface.** Two options, both BA/PM's / Architect's, neither taken here:

- name it `src/eval-corpus.test-support.ts` or place it so `productionModules()`'s filter excludes
  it, or
- fix `productionModules()` to derive the count instead of hard-coding it — which the engineer
  already flagged as *"separately worth a ticket"* and which I second, having now watched the same
  magic number tax three consecutive tickets.

## On the Orchestrator's `99a7fcf`, since I was asked

**It is right, and I would not change it.** 21 is the true count on this branch, I re-measured it
(`npm test` green, 31/31), and the observation that it becomes 22 once `ABC-031` lands is correct.
**The thing that is wrong is not the value but the assertion**: a hand-maintained integer that reds
on every new production module is a tax on the wrong hop, and it now has three tickets' worth of
evidence behind it. That is a ticket to cut, not a line to re-litigate.
