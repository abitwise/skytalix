---
id: 20260817T194100Z-ba-pm-observation-abc076-the-minus-zero-credit-is-withdrawn-the-productionmodules-tax-and-what-would-have-caught-the-expired-premise-852d086
kind: observation
by: ba-pm
at: 2026-08-17T19:41:00Z
verified_by:
confidence: high
refs:
  - plans/tickets/ABC-076-evaluation-material-and-piece-square-tables.md
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
  - src/cli.test.ts
  - .grugops/context/quality-gate-ABC-076-qe-2026-08-17/notes/20260817T190712Z-qe-e2e-decision-abc076-the-header-comment-is-not-enough-make-the-non-fork-a-red-test-in-abc082-99a7fcf7.md
  - .grugops/context/quality-gate-ABC-076-qe-2026-08-17/notes/20260817T190711Z-qe-e2e-decision-abc076-qe-verdict-pass-six-of-six-criteria-met-two-gaps-found-at-qe-99a7fcf7.md
supersedes:
---

# Three corrections and one uncosted consequence: the `-0` credit is WITHDRAWN, `productionModules()` must not grow a test-support file, and the thing that actually failed was that no hop re-reads a criterion's PREMISE against the built tree.

## 1. The `-0` credit is withdrawn. **The widening did not pay for itself.**

The record said the 12 → 184 widening "paid for itself" by catching the `-0` defect. **It did not, and
nothing on record should repeat it.** The `-0` mutant (`0 - score` → `-score`) fails on the pair
labelled `startpos` — a **root** pair, present in the 12-corpus: startpos is colour-symmetric, its
mirror is startpos-with-black-to-move scoring `0`, and the buggy path returns `-0`, which
`Object.is(0, -0) === false` reds. **The 12-corpus catches `-0` too.** So both defect classes `A1`
genuinely detects — the side-to-move sign flip and the `-0` — are caught at 12. The corpus survives
on `ABC-082`/`ABC-083`'s account (see the companion `decision`), on nobody's account at `ABC-076`.

Stated plainly because a false credit is worse than no credit: **it would have made the widening
look self-justifying and closed the question QE reopened.**

## 2. The `productionModules()` consequence — how `A7` handles it, and the two options I rejected

`src/cli.test.ts:51`-`:54` counts every non-`.test.ts` `.ts` file directly in `src/` as a production
module, and `:733` pins the count as a hand-maintained integer whose stated purpose is `ADR-0011`'s
licence surface. A lifted `src/eval-corpus.ts` would be **test-support code counted as production
surface** — wrong on the merits, not merely inconvenient.

**Rejected — rename to `src/eval-corpus.test-support.ts`.** The filter excludes only `*.test.ts`, so
the rename changes nothing; the name would advertise a protection it does not have. QE's phrasing
("name it so the filter excludes it") is only reachable by *also* editing the filter, which is
`ABC-082` editing another ticket's test to make its own file invisible — the wrong direction.

**Rejected — fix `productionModules()` to derive the count, inside `ABC-082`.** Right fix, wrong
ticket: it is a change to a merged criterion's assertion, in a pawn-structure ticket, with no
criterion paying for it. **That is the same drive-by QE correctly objects to, one level up.**

**Chosen — `A7` states the OUTCOME and leaves the placement to the engineer/Architect**: the shared
module *is not counted by `productionModules()`*, and that row's integer moves only if `ABC-082`
adds a real production module. Mechanically red either way it is satisfied (a sibling directory
outside `src/`, or a filter the Architect rules on), and it does not let `ABC-082` quietly enlarge
`ADR-0011`'s licence surface with a file that ships to nobody. **Note the constraint is not free of
tension: `src/cli.test.ts:734`-`:737` also asserts `src/` has no nested `.ts`, so a `src/`
subdirectory is not available. That is deliberate — it pushes the answer out of `src/` entirely.**

**Recommended, NOT cut here** (`ABC-076` is a repair task, not a cutting task): a small ticket to
derive `productionModules()`'s count instead of hard-coding it. The engineer flagged it, QE seconded
it, and it has now taxed three consecutive tickets. **The Orchestrator owns whether that reaches
`Backlog`; naming it here is the routing, not the cut.**

## 3. What actually failed, so the same class of error is catchable next time

Not sloppiness, and not a wrong argument at the time it was written. **A criterion's parenthetical
carried an assumption about an implementation that did not exist yet, and no hop's job was to
re-read that assumption once it did.** Process rule 1 puts criteria review at the `Ready for Dev`
exit — *before* the code lands. There is no symmetric hop *after* it lands, so a criterion whose
premise the implementation choice invalidates stays green-looking until someone mutation-tests it,
which is exactly how QE found it and one ticket later than ideal.

**Not proposing a new process rule** — rule 1's own control is still being measured and a second
rule would contaminate it. Recording it as the standing observation instead: *when a criterion's
justification names an implementation shape ("mirrored for black", "one table per piece type"), the
justification is a hypothesis with an expiry date, and the ticket-to-PR hop that chooses a different
shape is the cheapest place to notice.* **`ABC-076` `A1` now states what it does and does not
detect, so the next reader inherits a measurement rather than a hypothesis.**

## 4. Housekeeping for the Orchestrator, not for me

- **QE's residual R3 is now sharper, not resolved.** The delivery branch
  `grugops/ticket-to-pr-ABC-076-2026-08-17` carries an OLDER `ABC-076` page (the dead `≥ 40`
  wording); `main` carries the 184 repair; **this branch carries the narrowed claim.** The merge
  must take this branch's version of the page. **I did not touch that branch — it carries delivered
  code and must not move.**
- **`ABC-083` needs the same `A7`-shaped clause at its refinement.** Named in the companion
  `decision`.
- **`plans/board.md` untouched; `ABC-031` untouched.**
