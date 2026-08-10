---
id: 20260810T071300Z-software-engineer-observation-0d0c45a9
kind: observation
by: software-engineer
at: 2026-08-10T07:13:00Z
verified_by: 
confidence: high
refs:
  - ABC-023
  - ABC-009
  - A1
  - A2
  - A3
  - A4
  - A5
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/tickets/ABC-023-castling-precondition-net-hardening.md
  - 20260810T064012Z-ba-pm-observation-9cc20991
  - 20260810T064504Z-orchestrator-decision-c71b2e05
supersedes: 
---

# 17 rows, 19 tests, ZERO production lines — and the 34 mutants that say the rows are red on their mutant and green on the delivered tree

The pull decision assigned me the discriminating mutant for **each row I write**, because on a
test-only ticket that is what "red before green" can mean at all. **Every row below was run against
its own mutant, in both tree states.** Nothing here is inherited from the ticket or from BA/PM's
re-measurement; where a verdict of mine disagrees with what the ticket led me to expect, it is
reported as measured and flagged.

## What landed

```
src/moves.castling.hardening.test.ts   +375 / -0     ADDITIONS ONLY, 17 rows, 19 tests
every other file under src/            untouched     git diff --name-only -- src/ names ONE file
md5 -q src/moves.ts                    6335b452fc21ffe2d0f902ecab930840   (pinned by A4, unchanged)
```

`A4` verified at **line level**, not by inspection: `git diff -U0 -- src/` contains **zero** removed
lines, so no existing test row was modified or deleted in any file. `ABC-009`'s `A11`/`A13` tables
are **extended** exactly as `## Out of scope` says they would be — nine rows spread in — and not one
existing row, count or verdict is edited.

The 17 rows, against the estimate of 17 the board sized this at:

```
A1  4 rows   JOINT_OCCUPANT_PAIRS         both home squares wrong AT ONCE
A2  4 rows   DESTINATION_SQUARE_ATTACKED  the landing square attacked, origin and crossed not
A3  9 rows   A3_ADDED_* spread into the four impostor tables (3 + 2 + 2 + 2)
    2 tests  the two quantifiers: A1's both-axes-per-family, A3's both-axes-per-type
```

## The gate, exactly as it ran

```
npm install                     ok
npm run lint                    exit 0   biome, 35 files, 2 infos (pre-existing config-migration)
npm run typecheck               exit 0   tsc --noEmit
npm test                        578 passed / 578 on 18 files   (559 before these rows)
npm run build                   exit 0   tsc --noEmit
skip count                      0        by the AGENTS.md `### Test integrity` command
PERFT_DEEP=1 vitest perft       32 passed / 32   EXACT, 37.73 s
test-integrity checker          exit 2   "cannot read the registry file: .grugops/test-skips.md"
E2E                             UNKNOWN - verify   no UI surface until EPIC-006
auto-UAT oracles                UNKNOWN - verify   scripts/check-uat-oracles.js is absent
tools/grugops/reference-check   No findings        on the four plans files this hop edited
```

The test-integrity **exit 2 is COULD-NOT-RUN, not a pass** and not the exit-1 human-only
short-circuit. **No registry file was created** — an agent may not self-author a justification that
clears its own gate. The skip count is independently **0**.

## The mutation campaign — 34 mutants, 0 broken builds, 0 harness errors, 0 verdict mismatches

Instrument, built against the traps this board has already paid for: every mutant applied to a copy
of `src/` held **outside** the repository with `node_modules` symlinked; each anchor asserted to
occur **exactly once** in the pristine source and the bytes asserted to have **actually changed**,
or `HARNESS-ERROR` and never `SURVIVED`; `npx tsc --noEmit` per mutant so a tree that does not build
is `BROKEN-BUILD` and never a survivor; **one OS process per tree state** — every `tsc` and every
`vitest` its own `spawnSync`; `src/moves.ts` restored and **re-hashed after every mutant**, and the
repository's own `src/` never written at any point (asserted at the end of every run:
`6335b452fc21ffe2d0f902ecab930840`).

**Every mutant was scored against BOTH tree states** — `@pre` is the tree with the pre-ticket test
file (what BA/PM measured), `@rows` is the delivered tree. `@pre SURVIVED` + `@rows KILLED` is the
red-before-green evidence; a row I could not show that for is called out below rather than counted.

**`A2` — the castle's DESTINATION square.** One mutant per option, each dropping only that option's
landing square from its `kingPath`:

```
mutant                              @pre      n/N       @rows    n/N       fails
WK kingPath drops g1 (DESTINATION)  SURVIVED  559/559   KILLED   577/578   its own row, only
WQ kingPath drops c1 (DESTINATION)  SURVIVED  559/559   KILLED   577/578   its own row, only
BK kingPath drops g8 (DESTINATION)  SURVIVED  559/559   KILLED   577/578   its own row, only
BQ kingPath drops c8 (DESTINATION)  SURVIVED  559/559   KILLED   577/578   its own row, only
```

Four survivors reproduced at 559/559 and four one-to-one kills. Each mutant fails **exactly one**
test and it is the row written for that option, so no row is covering for another.

**`A1` — the joint occupant PAIR.** Two named by the ticket, plus one single-axis variant per row,
because a pair mutant that kills two rows at once proves the class but not each row:

```
mutant                                       @pre      n/N       @rows    n/N       fails
BOTH squares hold an enemy KNIGHT            SURVIVED  559/559   KILLED   576/578   both enemy rows
BOTH squares hold an own QUEEN               SURVIVED  559/559   KILLED   576/578   both own rows
the enemy-KNIGHT pair, QUEENSIDE only        SURVIVED  559/559   KILLED   577/578   the b/queenside row
the enemy-KNIGHT pair, KINGSIDE only         SURVIVED  559/559   KILLED   577/578   the w/kingside row
the own-QUEEN pair, when BLACK only          SURVIVED  559/559   KILLED   577/578   the b/queenside row
the own-QUEEN pair, when WHITE only          SURVIVED  559/559   KILLED   577/578   the w/kingside row
```

The four single-axis variants are the point: each kills **exactly the one row that varies that
axis**, which is the measured proof that all four `A1` rows are load-bearing and that neither axis
is held constant inside a family. The ticket's third named mutant (side-conditional) is the
`QUEENSIDE only` line; I added the three mirror variants so every row has its own witness.

**`A3` — a single-type admission conditional on the axis that type's rows did not vary.** One per
gapped type/table pair, nine of them:

```
mutant                                        @pre      n/N       @rows    n/N       fails
king's sq admits own ROOK only QUEENSIDE      SURVIVED  559/559   KILLED   577/578   its own row
king's sq admits own BISHOP only QUEENSIDE    SURVIVED  559/559   KILLED   577/578   its own row
king's sq admits own KNIGHT only when BLACK   SURVIVED  559/559   KILLED   577/578   its own row
rook's sq admits own BISHOP only QUEENSIDE    KILLED    558/559   KILLED   576/578   see below
rook's sq admits own KNIGHT only when BLACK   SURVIVED  559/559   KILLED   577/578   its own row
king's sq admits enemy KNIGHT only QUEENSIDE  SURVIVED  559/559   KILLED   577/578   its own row
king's sq admits enemy PAWN only KINGSIDE     SURVIVED  559/559   KILLED   577/578   its own row
rook's sq admits enemy KNIGHT only QUEENSIDE  SURVIVED  559/559   KILLED   577/578   its own row
rook's sq admits enemy PAWN only KINGSIDE     SURVIVED  559/559   KILLED   577/578   its own row
```

The six the ticket named as measured survivors all reproduce at 559/559 and all now die.

**The one result that did not come out as the shape of the ticket predicts, reported as measured.**
`rook's sq admits own BISHOP only QUEENSIDE` was **ALREADY DEAD before my rows**, at 558/559. Its
killer is `ABC-009`'s existing `ONE_OF_TWO_RIGHTS_VALID` row `4k3/8/8/8/8/8/8/B3K2R w KQ - 0 1` — a
row in a **different table in the same file** that holds BOTH rights with an own bishop on a1, so
the mutant wrongly offers the queenside castle and that row's by-name assertion fails. Three
consequences, stated plainly:

1. My row for that gap (`4k3/8/8/8/8/8/8/B3K3 w Q - 0 1`) **is** red on that mutant (it is one of
   the two failures at 576/578), so red-before-green holds for the ROW.
2. It is **not** the only thing standing between the suite and that mutant, so unlike the other
   eight it is not proved individually necessary by this experiment.
3. The gap it closes is still real and still required: `A3` is a statement about **the tables'
   doubling**, and `IMPOSTOR_ON_ROOK_SQUARE`'s BISHOP rows really were both kingside. The new
   quantifier test enforces that directly, and it goes red if the row is removed.

Nothing here contradicts the ticket — this mutant is **not** one of the six it measured, and the
"9 of 13 gapped" count is about the tables, which I re-derived mechanically inside the new test
(13 pairs, 9 gapped before these rows) rather than citing.

**`A5`'s second half — the fifteen behaviour-equivalent controls.** All fifteen, on the delivered
tree with my rows in place:

```
enemy KING / QUEEN / ROOK admitted on the king's square      SURVIVED  578/578  (3)
enemy KING / QUEEN / ROOK admitted on the rook's square      SURVIVED  578/578  (3)
colour-blind on the king's square                            SURVIVED  578/578
colour-blind on the rook's square                            SURVIVED  578/578
colour-blind on BOTH squares                                 SURVIVED  578/578
king guard continue -> break                                 SURVIVED  578/578
king guard continue -> return                                SURVIVED  578/578
both guards BELOW the empty test                             SURVIVED  578/578
both guards BELOW the through-check test                     SURVIVED  578/578
both guards ABOVE the right test                             SURVIVED  578/578
extra "rook square non-EMPTY" condition                      SURVIVED  578/578
```

**Killed count: ZERO.** All fifteen also survive 559/559 on the pre-rows tree in the same runs, so
the bar is met against a control measured in the same instrument rather than against an inherited
number. No row I wrote pins implementation shape.

## `A4` did not fail, and nothing was edited to make it pass

**No row proved the delivered code wrong.** Every one of the 17 rows passes on the delivered tree
untouched, so the stop condition in `## Scope` — "if a row proves the delivered code wrong, that is
a defect and gets its own ticket" — never fired and **no defect ticket is owed**. `src/moves.ts` was
never opened for edit; its hash is the same byte-for-byte value before and after.

## What this observation does NOT establish

- **That 34 mutants is a campaign.** It is not, and it is not meant to be. These attack the three
  classes this ticket names, one per row, plus the equivalence set that bounds them. **QE re-runs
  all of them independently plus its own sweep**, and on the last four tickets QE found survivors
  that passed every criterion — every one a gap in the criteria, never a defect in the code. Expect
  that again; my rows close the classes the criteria name and nothing wider.
- **That the fifteen controls are behaviour-equivalent in general.** They survive **this suite** over
  **these** positions, which is weaker than equivalence. I re-enumerated nothing.
- **That a pair admission conditional on BOTH axes at once would die.** It would not: `A1` is bounded
  to four rows and pins the class, and the ticket names the 169-combination enumeration as the trap
  that turns this into an `L`. A mutant keyed on, say, "enemy-knight pair, white queenside only"
  survives my four rows. That is the criterion's stated bound, not an oversight.
- **Any `NFR-001`, `npm run perft`, coverage or throughput figure.** None measured here. The diff has
  zero production lines, so the inner loop is unchanged by construction.
- **Anything about `ABC-009`'s `A1`–`A13`.** Not reopened, not re-measured, no verdict touched.
