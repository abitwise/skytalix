---
id: 20260809T213842Z-software-engineer-decision-d6c9aad8
kind: decision
by: software-engineer
at: 2026-08-09T21:38:42Z
verified_by: 
confidence: high
refs:
  - ABC-022
  - ADR-0005
  - src/legal.ts
  - src/legal.test.ts
  - plans/tickets/ABC-022-en-passant-generation-preconditions.md
supersedes: 
---

# How the four corrected paragraphs are worded, and the three sentences I refused to write

`A11` names what the corrected text must and must not say. This note records the wording decisions
that discharge it, because the trap BA/PM measured is a **wording** trap: the same class of defect
in the opposite direction.

## `src/legal.ts` — the paragraph is now 68-77 (was 68-72)

Three parts, treated separately exactly as `A11` requires:

1. **Deleted outright, not softened:** *"Outside it the oracle is unsound — `generateMoves` offers
   en-passant captures onto squares occupied by the mover's OWN piece —"*. Both the conclusion and
   its mechanism clause are gone. Nothing hedged, no "used to", no "was".
2. **Kept:** the answer off-domain is **SPECIFIED rather than derived**, `false`, "the truthful
   answer about a board on which the named capture cannot be performed". Only its stated reason was
   lost, not its content, so only the reason was replaced. The sentence had to be re-opened as
   *"Outside it the answer is…"* rather than *"so the answer there is…"* because the `so` was a
   consequence of the deleted premise; the content is preserved verbatim.
3. **The replacement reason:** the predicate **never consults `generateMoves`**, so it establishes
   its own preconditions and specifying the answer keeps the key **independent of the generator**.
   It points at the cost sentence already at 64-66 (~14x a bare key, `ADR-0005`) rather than
   restating it — that clause was already there and true, and repeating it would have been noise.

## The three sentences I refused to write

- **"The oracle is sound now, so we agree with it."** `A11` forbids it and the measurement is why:
  the agreement is **bought by guard (a)**. The paragraph says so explicitly and closes on the
  counterfactual — *delete (a) and this predicate answers `true` on boards where the generator
  offers nothing* — so a reader who reaches for "then the guard is redundant" is answered in the
  same breath.
- **"`generateMoves` used to be unsound here."** A comment describing shipped behaviour has no
  business carrying the branch's history; `src/moves.ts` 183-195 already carries the past tense
  where it belongs, and `A11` closed the citation set on *current-behaviour* claims.
- **Anything about `ADR-0005` clause 6.** The fix makes that clause exactly true, which is BA/PM's
  finding and the Architect's file. A comment does not amend an accepted ADR, and it does not
  announce that one now reads better either.

## The three `src/legal.test.ts` sites

- **Site 4 (now 267-272).** The trailing *"because `generateMoves` is itself unsound there and the
  oracle cannot be the authority on a class it gets wrong"* is replaced by the same true reason —
  the predicate never consults the generator, so it owns its preconditions — with the ABC-022
  agreement recorded in a parenthetical that ends *"agreement bought by the guards below, not a
  reason to drop them."* The design-hop ruling, the owner's refusal to merge and the
  `undoSpecial` mechanism above it are untouched: they were never about the generator.
- **Site 5 (now 370-375).** *"the one where `generateMoves` offers an en-passant capture onto the
  mover's OWN piece"* becomes *"the one with the mover's OWN piece standing on the ep target"* — the
  board shape is what identifies the row, and it is still true; only the generator's behaviour on it
  changed. *"the oracle agreeing with the relaxed guard is not a defence"* inverts to *"since
  ABC-022 the oracle says `false` there as well, so the relaxed guard is now alone in answering
  `true`"*. The row's job is unchanged and now has two reasons instead of one.
- **Site 6 (now 377-379).** *"The oracle answers `true` on all four … off-domain the oracle is
  unsound"* becomes the measured before/after pair and the conclusion that these rows **no longer
  turn on the oracle at all**. That is the honest shape: the ruling's point is that the answer is
  specified, and the rows kill their relaxations whatever the oracle says.

## What was not touched, deliberately

The four fenced-TRUE statements (`src/legal.ts` 113-114, `src/legal.test.ts` 282-283 and 289-292,
plus `src/zobrist.ts` and the ticket's own `## THE CORRECTION THIS TICKET CARRIES`) and the
out-of-remit `src/legal.test.ts` 202. Guard (a), guard (b) and `ADR-0005` are untouched; nothing
about the predicate's behaviour changes and `ADR-0005` is not reopened.
