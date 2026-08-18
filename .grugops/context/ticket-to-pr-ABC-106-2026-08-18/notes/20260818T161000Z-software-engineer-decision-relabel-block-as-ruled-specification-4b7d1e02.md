---
id: 20260818T161000Z-software-engineer-decision-relabel-block-as-ruled-specification-4b7d1e02
kind: decision
by: software-engineer
at: 2026-08-18T16:10:00Z
verified_by:
confidence: high
refs:
  - ABC-106
  - ABC-032
  - ABC-033
  - ABC-034
  - A8
  - G5
  - G6
  - G7
  - refinement-abc032-tolerances-2026-08-18
  - src/san.parse.test.ts
supersedes:
---

# The block is re-labelled RULED SPECIFICATION and the two bounds are named as the boundary, not as observations

`ABC-106` `A1` asks for three things at once and each was decided separately.

**1. The label.** The docblock's opening words go from *"CHARACTERIZATION, not a demanded
tolerance"* to **`RULED SPECIFICATION`**, and the sentence that made the block false — *"whoever
rules on them — BA/PM owns the page — is ruling on behaviour that is written down"* — is gone. The
new block states that the ruling LANDED (2026-08-18, task
`refinement-abc032-tolerances-2026-08-18`) and that all three were ACCEPTED. The block was located
by its TEXT, never by line number.

**2. Where each of the three was ruled, named on the row itself.** `A1` demands each of the three
name its ruling site, so each `it` title now carries it rather than burying it in the block header:

- redundant qualifier → `` `ABC-032` § Scope entry 4 ``
- mixed castle spellings → `` `ABC-032` § Scope entry 5 ``
- `e8=K` coded `no-such-move` → `placed on `ABC-034` `A8``

The entry numbers were read out of `plans/tickets/ABC-032-*.md` § Scope, not assumed: entry 4 is the
redundant origin qualifier and entry 5 is `O`/`0` interchange inside the castle strings, and both
carry their bound in the ticket's own words.

**3. The two bounds are promoted from asides to the point of the block.** Previously `Ne4g5` was
introduced by *"A WRONG origin is still refused"* and `o-o` by *"Case is still meaning"* — both read
as incidental colour. Each is now labelled **THE BOUND** that its entry *was granted under*, with an
explicit "do not remove this row; it is the limit". This follows the ruling's own reasoning: every
ACCEPT was granted bounded, and an unbounded ACCEPT is a widening nobody can stop from creeping. The
`o-o` comment additionally records that the asymmetry against `O-0` is DELIBERATE and resolves in
`ABC-033`, so a later reader does not read it as an inconsistency to "fix".

**The `e8=K` row keeps its diagnosis and gains its placement.** The final sentence *"`ABC-034` owns
the wording"* is replaced by the ruling's actual disposition — ACCEPTED AS DELIVERED for `ABC-032`,
re-classification and player-facing wording placed on `ABC-034` `A8`, which owns both
ill-formed-SAN cases together and may not add an eighth reason code — plus the reason the fix does
not belong here (a private promotion-letter table is the second table `ADR-0004` clause 2 and `A7`
exist to prevent). It closes with "this row is the record of the code as ruled, not a defect
awaiting one", which is the specific misreading the ticket was cut to stop.

**One in-row comment was also false and was fixed.** Inside the redundant-qualifier row, *"the
question is only whether the string should have been read at all"* posed an open question the
ruling has since closed. It now states that the question is settled and why (a redundant qualifier
cannot change which move is named).

**What was deliberately NOT done.** No assertion, fixture or expected value was touched; no
production line; no test added (the ticket's `## Test notes` carries an explicit *do not add a
test*, and `A2` exists to catch one being added by accident); the ruling was not re-opened.
