---
id: 20260809T135500Z-ba-pm-decision-0dabbcb7
kind: decision
by: ba-pm
at: 2026-08-09T13:55:00Z
verified_by: 
confidence: high
refs:
  - ABC-009
  - ABC-010
  - ABC-011
  - ABC-015
  - ABC-022
  - A5
  - A6
  - A7
  - A11
  - A12
  - NFR-001
  - plans/tickets/ABC-009-legalmoves-position-mutation.md
  - plans/traceability.md
  - agent-factory/workflows/07-backlog-refinement.md
  - agent-factory/checklists/definition-of-ready.md
supersedes: 
---

# `ABC-009`'s criteria text, second hop: `A11` and `A12` added, `A7` kept and reclassified, three refusals recorded

Five items were routed here by QE (`20260809T123500Z-qe-e2e-decision-634cb408`) and Security/NFR
(`20260809T131400Z-security-nfr-decision-b67fabe0`), both of which left `## Acceptance` byte-identical
on purpose. Each is ruled on below with the alternative it rejected, in this board's house style. The
evidence is in the two companion `observation` notes and is not restated.

**No behaviour was asked for and none was changed. No file under `src/` was touched** — `git status
--short -- src/` is empty and `src/moves.ts` still hashes `0e247853ab2c05887c76105ff83d8621`. **No board
move:** `ABC-009` stays in `Ready for UAT` 1/4 and `plans/board.md` was not edited. **`ABC-022`,
`ABC-010`, `ABC-011` and `plans/nfr-catalog.md` were NOT edited.** **Nothing merged, nothing deployed.**
`## Implementation`, `## QE` and `## Security / NFR` are byte-identical — the seam those roles honoured
by not editing the criteria is honoured back by not editing their sections.

## 1. `G-1` — the impostor's piece type. AGREED, and the gap is WIDER than routed. `A11` added, and it is NOT MET.

`A5`/`A6` name a bishop and a knight; `## Test notes` 3 said *"at least two distinct piece types"*; the
rule in `## Scope` is *"the moving side's `KING` byte and no other"* — a claim about **every** other
byte. QE closed the **queen** in tests and routed the text here, and the narrow question I was handed
was *"what does the criteria text owe, given the coverage exists?"*

**Re-derivation changed the answer: the coverage closes the queen, not the dimension.** Three builds
admitting one further own piece type pass **33/33 acceptance, 19/19 hardening, 356/356 full suite at
skip 0**, and the worst of them also passes **`PERFT_DEEP=1` at 32/32** — reading the king's home square
as *"own KING or own **ROOK**"*, or as *"own KING or own **PAWN**"*, or the rook's square as *"own ROOK
or own **PAWN**"*. The first is the most plausible mis-implementation of the set (the two guards are
adjacent and compare against locals named `king` and `rook`) and it is the routed gap statement's own
example with `QUEEN` swapped for the byte one line below.

**Ruled:** `A11` states the rule **quantified over every one of the mover's own piece types** on both
home squares, with the exhaustive requirement written into the criterion so a future reader cannot
satisfy it with a spread of three, and with the two unreachable shapes excluded on measurement (own
`KING` on the rook's square is not constructible under `parseFen`'s one-king-each rule; enemy-colour
occupants are masked by the through-check test, measured three times now). The delivered code satisfies
every row — **so `A11` asks for no production change, only about nine test rows in an existing
table-driven file.**

**Stated plainly because it is the uncomfortable half: `A11` is NOT satisfied by the suite as it stands,
so this ticket is not closeable today.** **Rejected alternative:** scope `A11` to the three piece types
already covered and carry the rook/pawn hole as an accepted risk — which would let the ticket close this
hour. Rejected because it is this ticket's own defect performed on itself: a criterion that samples
where the rule quantifies, shipped green, with three live counter-examples already measured and in hand.
The ticket whose subject is *a documented invariant that was not an invariant* may not end by
documenting an invariant it does not have. **Second rejected alternative:** write the rows myself.
Not this role's — BA/PM writes no test, and that file is QE's.

## 2. `G-2` — how many rights a side holds. AGREED. `A12` added, with an ordering clause the routed statement did not have — and the suite already satisfies it.

Confirmed at the source: every `A1`–`A10` FEN carries at most one right per side except the reproduction
FEN, where both castles are invalid and the answer is zero either way, so nothing separated *"this
option was rejected"* from *"the option loop was abandoned"*.

**What re-derivation added is load-bearing.** The harm is **order-dependent**: `continue` → `break` on
the rook guard deletes a legal castle only when the loop meets the **invalid** option **first**
(kingside precedes queenside in both tables). On the mirror row it is indistinguishable from correct,
and exactly **three of QE's six** rows go red. **A criterion phrased only as *"one right valid, one
bogus"* is half inert and could be satisfied entirely by rows that discriminate nothing** — the same
defect as `G-1`, one level down. `A12` therefore requires at least one row with the invalid option
earlier in generation order, and the surviving castle asserted **by name**, since a count alone cannot
distinguish *"the invalid one was rejected"* from *"the valid one was dropped and something else
appeared"*. **QE's rows meet all of it; no new coverage is owed for `G-2`.**

**Rejected alternative:** pin the king-guard `break` for symmetry. Measured behaviour-equivalent (both
options share `kingFrom`; it passes all 33 acceptance and all 19 hardening rows), so a criterion would
be unfalsifiable — the same call this board made for the wrong-colour rook and the colour-blind mutant.

## 3. `A7` — KEPT, RECLASSIFIED, and its justification RETIRED AS FALSE. The item carried loudest.

Three answers were available and the brief said leaving it unexamined was not one of them.

**Measured first:** 0 kills of QE's 62 mutants, 0 of this hop's 10, including the two guard deletions
that fail 16 and 5 assertions respectively. Inert **by construction**, not by accident — `A7`'s
population is legally reachable, and in a reachable position a held right implies both pieces are home,
so the two guards never fire there (Security/NFR's count: 198,175 executions each, 0 rejections).

**KEEP, not delete.** Deletion was taken seriously and is a defensible answer — a criterion measured
inert against every mutation of the fix it accompanies is exactly what a lean acceptance set should
shed. **Rejected** because the measurement says "inert against **this** class", not "inert": `A7` is the
suite's only purity walk over **legal** positions, it was **absent rather than failing** before this
ticket (so writing it was real work), it costs six assertions, and it guards a different class — a
future change in generation that mutates a legal position, which is `ABC-022`'s shape and whatever
`EPIC-004` does to the hot path. Deleting a green guard because it missed a defect it was never
positioned to see is the reasoning that removes the hallway smoke alarm because the fire was in the
garage.

**What is deleted is the CLAIM, not the criterion.** `## Test notes` 2 called `A7` *"the guard that
would have caught the defect originally"*. **That is false and was always false** — the original defect
also needed a semantically-invalid position, which `A7`'s population excludes, and the proof was already
on this board unread: the Engineer's red-before-green record shows **10 of 33 tests passing on the
UNFIXED tree, being the four controls plus the six `A7` rows**. `A7` was green on the broken code. The
sentence is struck, `A7` is retitled as a standing purity walk over legal positions and explicitly
marked *not a guard on this ticket's defect*, and the measured zero is written into the criterion so the
next reader inherits the measurement instead of the assumption.

**The lesson is recorded as a lesson, tied to its precedent.** This is the **second** time this project
shipped a criterion whose protective value was assumed rather than measured; the first is named in
`## Problem` — the 100% coverage number on `src/legal.ts` that this very defect shipped through. Same
error, different instrument: a green signal read as protection without anyone asking what it could fail
on. **Never cite `A7`'s green as evidence about this fix.**

## 4. The right-test lane — NO criterion, NO ticket. One `## Test notes` line instead.

The pre-existing castling-right test is not one of the two **board** preconditions this ticket owns, so
it gets no criterion here — the scope fence holds in both directions, the same discipline that kept
`ABC-022`'s half (b) out. **Rejected alternative:** promote it to a criterion because `A9`, a 40-second
opt-in lane, was otherwise its only guard. Rejected as scope creep onto a pre-existing guard; the
lane-strategy question is real and stays with `EPIC-004` / Architect where Security/NFR left it.

What did change is worth exactly one line, now in `## Test notes`: **QE's two no-right-held rows are
what guard that test in the default lane and must not be deleted as "not in the acceptance."** A row
that protects something no criterion names is the kind of thing a later tidy-up removes.

## 5. Guard ordering — NO criteria text, and it CANNOT have any.

Security/NFR converted this from hazard to property: the five guards are a conjunction of
side-effect-free predicates over an unmutated position, hence permutation-invariant, measured at 99
comparisons over 33 FENs with zero divergence and all six exact perft counts per variant. **A property
no test can ever fail on cannot be an acceptance criterion** — that is what unfalsifiable means, and it
is the third such refusal on this ticket. The cost half is ~0.003% of the sweep, below the instrument's
own floor, so there is no budget a bar could defend either. It belongs in the notes and the code
comment, which is where that gate put it. **Rejected alternative:** write the measured ~18x
cheaper-on-invalid-input figure into `## Security / NFR triggers` as a bar. Rejected twice over — it
would pin an implementation ordering the code is free to change, and nothing in CI measures it.

## 6. The traceability "defect" — WITHDRAWN, no ticket cut

Measured, not judged: every row of `plans/traceability.md` has **ten** cells counting unescaped pipes,
across all eight commits that ever touched the file; the `ABC-011` and `ABC-015` rows carry one
correctly **escaped** `\|`, and the row's own author documented it as *"TEN cells (12 raw pipes, one
escaped)"* on 2026-08-08. The 11-vs-10 report is an artefact of counting raw `|` characters. **No ticket
was cut and neither row was edited** — the offered fix would have edited two correct rows, and removing
that escape is the one change that would genuinely corrupt them. Full reasoning in the companion
`observation` note; the durable item is a counting rule, and whether `AGENTS.md` carries it is the
Orchestrator's call, not a defect. **Cutting a ticket for a defect that does not exist would have been
the bloat this role exists to refuse.**

## Size and priority — re-checked at the source, both unmoved

**Size `S` (2), unmoved.** `A11` quantifies a rule `## Scope` has stated since the first correction and
`A12` names a case that rule already covers; neither adds a production requirement. Nine test rows in an
existing table-driven file do not move a size that already carried thirty-three. Still structurally
identical to `ABC-022`.

**Priority `P1`, unmoved**, on the owner's legality-first directive of 2026-07-31. **The escalation
trigger is still UNFIRED, on both clauses, read at the source rather than carried:**
`plans/tickets/ABC-010-*.md` reads `status: backlog` / `column: Backlog` / `size: M` / `priority: P1`
and `plans/board.md` carries it in `Backlog` — neither deferred nor descoped — and there is still no CLI
entry point (`AGENTS.md` *Dev / run* is `UNKNOWN - verify`), so no epic accepts a position from outside
the rules core.

## What this decision does NOT establish

- **That `A11` is met.** It is not, and nothing here may be read as though it were. Roughly nine test
  rows are owed, in QE's file, and the ticket is not closeable until they exist and pass. **The
  Orchestrator owns that routing;** this role does not enqueue and did not.
- **That the criteria set is now complete.** Ten mutants is not a campaign. `A11` is exhaustive over
  piece type and samples colour and side; a third constant dimension may exist, exactly as QE recorded
  for its own two.
- **That the Definition of Ready was re-adjudicated.** The *acceptance measurable* row stays ✅ and is
  stronger; "measurable" and "currently satisfied" are different claims and only the first is that
  block's subject. No tick was flipped and no board move was taken.
- **Anything about `NFR-001`.** No benchmark was run by this role and no throughput figure here is mine.
- **`finding` was not used and nothing is self-stamped.** None is admissible on this task — no §14 gate
  exists in this install to issue a `§14-gate#<id>` stamp and `context.human_admission` is `off`, so no
  `human:<name>` stamp exists either. No `index.md` / `index.jsonl` was hand-faked; the renderer is
  absent here.
