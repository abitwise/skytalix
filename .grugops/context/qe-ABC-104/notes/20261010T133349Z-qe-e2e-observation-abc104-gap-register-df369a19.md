---
id: 20261010T133349Z-qe-e2e-observation-abc104-gap-register-df369a19
kind: observation
by: qe-e2e
at: 2026-10-10T13:33:49Z
verified_by:
confidence: high
refs:
  - ABC-104
  - ADR-0004
  - src/coordinate-move.ts
  - src/san.ts
  - 20261010T132825Z-software-engineer-decision-abc104-totality-scoped-to-text-30823a98
  - 20261010T133349Z-qe-e2e-observation-abc104-readings-probe-diff-gates-f3d29d14
  - 20261010T133349Z-qe-e2e-decision-abc104-verdict-pass-with-gaps-1ad3f484
supersedes:
---

# `ABC-104` gap register: three LOW (all prose in the same docblock), three INFO

This note is hand-authored and unsealed. **No gap fails a criterion.** `A1`–`A3` say nothing about
`:25`, about where the obligation comes from, or about the exact reach of "a wrong type throws". All
three LOW gaps share a pattern. The repaired paragraph is still not quite the width of the behaviour
or of the source it cites, and that defect class is the reason this ticket exists. Line numbers refer
to `src/coordinate-move.ts` at `76237852`.

| id | severity | gap | evidence | suggested owner |
|---|---|---|---|---|
| **QE-104-a** | LOW | **The "ONE CALLER OBLIGATION" heading at `:25` now disagrees with the count in its own docblock.** `:25-28` says there is ONE caller obligation, "not validated here", namely that `legal` is the supplied position's list. `:33-35` then adds that "`position` and `legal` are a caller obligation … a real `Position`, and … the legal move array of that position. Neither is validated here". A literal reader now finds at least two unvalidated obligations under a heading that says ONE. The Engineer argued (`…30823a98`) that "ONE" stays accurate because the new text describes "an obligation that is not validated rather than a second validated rule". **That argument fails**, because `:25` is itself "not validated here". Both obligations are unvalidated, so validation cannot tell them apart. The sibling module counts them the other way: `src/san.ts:18` says "TWO CALLER OBLIGATIONS, neither of them validated here". `:25` is inside the module header docblock, which is the ticket's § Scope, so the Engineer read the scope more narrowly than the page | Read `:25-37` together. The ticket's own `A1` forced the second obligation into the docblock, so the ticket created the conflict and the Engineer did not | **SE fix-forward on this branch before `In UAT`** (XS, comment-only). Fold the type obligation into the `:25` paragraph as "TWO CALLER OBLIGATIONS", in `src/san.ts:18`'s form, and keep `:30-32` for totality. The owner will sign this exact paragraph at `In UAT`, so it is cheapest to fix it now. If not fixed, it costs a maintainer one re-read; there is no behavioural effect |
| **QE-104-b** | LOW | **The attribution is wider than the source.** `:33-34` says "in the same terms `ADR-0004` clause 2 states for `toSan` and `parseSan`: a real `Position`, and, when supplied, the legal move array of that position". Clause 2 (`ADR-0004:201-204`) states only the second half. It has no "real `Position`" term and no type obligation | grep for `real Position`, `wrong type`, `TypeError`, `validated` in the ADR finds 0 hits (`…f3d29d14`). The source is the ticket's § Scope, which asks for "the same terms `ADR-0004` clause 2 uses". The ADR has no such terms for `position`, so the Engineer followed a page that over-promised | Same hop as QE-104-a: "the second half in `ADR-0004` clause 2's terms; the first is this module's". BA/PM may also note on the page that clause 2 has no type-obligation wording |
| **QE-104-c** | LOW | **"a wrong type throws" (`:35`) is unconditional, and the behaviour is not.** A wrong-typed `position` is read only when `text` parses **and** `legal` is not supplied. A wrong-typed `legal` is read only when `text` parses, and an array of junk can return without throwing. This is the mirror image of the defect being repaired: a sentence that promises a throw where the old one promised none. The two calls quoted after the colon are exact | 6 measured wrong-type calls that return **without** throwing: `(null,"hello")`, `(undefined,"")`, `(p,"hello",42)`, `(null,"e2e4",L)` → `move`, `(42,"e2e4",L)` → `move`, `(p,"e2e4",[42])` → `no-such-move` (`../probe/qe-probe.out.txt`, B1–B5, B10) | Same hop: "a wrong type **can** throw, for example". A reader who treats the throw as a guard (for example, "a null position is caught") would be wrong today |
| QE-104-d | INFO | `ADR-0004` (2a) `:206` says `parseSan` "is a total function: every input produces one of the three arms and none of them throws". That is the same unscoped width, in the ADR this docblock now cites. `src/san.ts:221` scopes it correctly to "whatever a loop actually hands over" as `text` | `ADR-0004:206-207` | Architect/Design, for awareness only. ADRs are fenced from QE. There is no runtime effect |
| QE-104-e | INFO | **No test pins the documented throws**, yet `:36-37` calls them "the contract, not a defect". If someone later adds a guard, the docblock goes stale with every lane green. The ticket's test note 1 forbids adding a test, so none is owed | QE searched the five test files that call `parseCoordinateMove` for `toThrow` or `TypeError` assertions. The only hit is `src/coordinate-move.test.ts:154`, `expect(call).not.toThrow()`, which pins the `text` domain. **No test asserts a throw** | none. Accept, per the page |
| QE-104-f | INFO (process) | **Two worktrees now hold one branch.** The ticket branch was already checked out in the Engineer's closed worktree `.claude/worktrees/ticket-to-pr-ABC-104`. QE used `git worktree add --force` to get its own worktree, as the brief asked. After QE's commit, the Engineer's worktree is still at `76237852` while the branch has moved on, so `git status` there shows QE's commit as a reverse diff | `git worktree list` | Orchestrator: do not commit from `ticket-to-pr-ABC-104`. Remove it with `git worktree remove` at cleanup |

**Not a gap, recorded so nobody re-derives it:**
- **"no value of `text` makes it throw" (`:30`) holds.** With a valid `position`, 0 of 38 hostile `text`
  calls threw, with and without `legal`. It is conditional on the caller obligation, and the paragraph
  says so in its next two sentences.
- **The function docblock's "totality against whatever a loop actually hands over" (`:79-80`)** is about
  `text`, as its next clause shows ("a non-string is `unreadable`"). It is outside the header, and the
  ticket did not touch it.
