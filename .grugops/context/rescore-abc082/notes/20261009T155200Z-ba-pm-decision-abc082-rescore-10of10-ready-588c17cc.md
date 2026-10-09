---
id: 20261009T155200Z-ba-pm-decision-abc082-rescore-10of10-ready-588c17cc
kind: decision
by: ba-pm
at: 2026-10-09T15:52:00Z
verified_by:
confidence: high
refs:
  - ABC-082
  - ABC-076
  - ABC-077
  - ABC-078
  - ABC-079
  - ABC-080
  - ABC-081
  - ABC-121
  - ABC-122
  - ABC-086
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-009
  - ADR-0024
  - ADR-0026
  - plans/tickets/ABC-082-evaluation-pawn-structure.md
  - plans/traceability.md
  - .grugops/context/wave-2026-09-25/notes/20261009T155500Z-orchestrator-decision-3b8e51d0.md
  - .grugops/context/ruling-abc079-g1g2/notes/20260925T061500Z-architect-design-decision-g1-pin-oracle-checked-depth3-answers-in-a5-g2-split-deep-corpus-by-root-licence-8c3e5a72.md
  - .grugops/context/ruling-abc080-081/notes/20260925T080616Z-architect-design-decision-r1-abc080-a3-bar-releveled-to-4pct-a4-at-depth5-f7e66060.md
  - .grugops/context/qe-ABC-121/notes/20260926T005600Z-qe-e2e-observation-deep-rows-rerun-d5-drift-d7-companion-match-exactly-dc82fb03.md
  - .grugops/context/uat-run-ABC-121/notes/20260926T220100Z-qe-e2e-observation-a2-depth-floor-plain-node-three-rounds-80a5e0a0.md
  - .grugops/context/secnfr-ABC-121/notes/20260926T193100Z-security-nfr-observation-abc121-nfr004-005-009-held-plain-node-doors-unreachable-76eb826c.md
supersedes:
---

# `ABC-082` DoR re-score: **10/10, MET — page set to `Ready`.** Size `S` → `M`. 23 merged bars listed with who re-pins or rules each

Hand-authored and unsealed. This is the degraded posture described in `AGENTS.md`:
`context-io.ts`, `claim.js` and `propose_note` are absent, and `human_admission` is `off`, so this
is a `decision`, not a `finding`. Worked on `grugops/rescore-abc082` off `f952983`. NOT merged,
NOT pushed. `src/`, `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md` and every ADR are
untouched.

## What the re-score found

`ABC-082` was cut on 2026-08-16, before any search existed. It is the first change to the
**evaluator** since the engine gained exact pins. Every door and the shipped path call one
`evaluate` (`src/search.ts:302`, `src/quiescence.ts:100`). So:

- **Identity rows cannot redden.** Both sides of each row move together. This covers `ABC-077`
  `A1`, `ABC-078` `A3`, `ABC-079` `A2`/`A4` quiet rows, `ABC-080` `A1`, `ABC-081` `A1`, and the
  `ABC-121` PVS chain.
- **Pawnless fixtures cannot redden**: the mate corpus (0 pawns in 287, checked), `FORK`, the `G6`
  knight pair, and the depth-10 rook ending.
- **Every literal pin on a pawned board can move.** The page's § Merged bars lists 23 rows in
  three classes:
  - **P (exact pins)**: rows 1–8. Re-pinned by the Engineer from a measurement, then checked by
    QE.
  - **F (fixtures whose purpose the term can destroy)**: rows 3 and 8–13. The Engineer
    re-measures, and re-finds the fixture with the recorded probe if needed. QE confirms the
    named mutant still reds. If no fixture can be found, Architect/Design decides.
  - **R (levels)**: rows 14–23. Never re-levelled here. If one reddens, the build stops.
    Architect/Design rules on code bars. Security/NFR measures NFR levels, and only the owner's
    word moves one.

Rows most likely to go red: `ABC-121` `A4`'s `[95, "h5e5"]` (its `A4_FEN` has isolated pawns, so
the static term is non-zero at the root), the `ABC-079` `A5` oracle answers, `ABC-080` `A4`'s
position-6 node pins, `ABC-080` G1's 358, `ABC-081` `A1`'s 1 123 / 1 299, and `ABC-078` `A3`'s
tick-driven abort fixture.

## The one reading I made, not left open

**`ADR-0026` decision 10 does not reach an evaluation term.**

- **Reading A** (rejected): a value-changing evaluator is a "value-changing heuristic", so it
  needs a switch and a pre-`ABC-082` door in both recursions, joined into every older door.
- **Reading B** (adopted): the ADR is about search heuristics, as its title and Context say. Its
  doors exist to keep identity rows valid while the shipped path's VALUE diverges from a door's.
  An evaluator change never creates that divergence, because every door moves with it. Three
  Architect/Design texts already describe evaluator change as handled without a door:
  - `ADR-0024` decision 3 and ruling `…f7e66060` R1: the 1.5x headroom "absorbs legitimate
    evaluator changes";
  - ruling `…8c3e5a72`: the oracle answers "WILL legitimately go red on an evaluator change",
    with a re-pin protocol;
  - ruling `ruling-abc079-multiplier` `…6e1c9b25` point 3: "the first legitimate evaluator change
    is the test of whether 1.5x was too tight". That change is this ticket.

Recorded on the page under Out of scope. Architect/Design can overrule it. If they do, Scope and
Size change and the DoR must be re-scored. I did not route this as a ⚠️: the reading follows from
the ADR's own logic and from three standing rulings.

## Page edits (all on `plans/tickets/ABC-082-evaluation-pawn-structure.md`)

1. Frontmatter: `status: ready`, `column: Ready`, `size: M`. A re-score blockquote is added.
2. **Scope** names the term's location and its two callers, and makes re-pinning in scope.
3. **Out of scope** gains two entries: the evaluator door (Reading B), and any re-levelling.
4. **`A6`** gains `NFR-005`'s depth read on plain node: depth below 6 is FAIL and stops the build;
   depth 7 not reached is WARN, reported to the owner. *Why:* `ABC-076` measured 133 ns. If the
   combined cost reached the 1,100 ns bar, it would likely use up kiwipete's depth-7 margin:
   532 363 cumulative nodes to depth 7 (`…dc82fb03`) against roughly 650k–790k nodes in 3 s
   (`…80a5e0a0`, `…76eb826c`), about 1.2–1.5x. So the bar no longer protects depth 7 on its own.
5. **`A7`'s third clause is replaced.** "Not counted by `productionModules()`" cannot be met:
   `ABC-103` deleted the hand-maintained count (`src/cli.test.ts:1498`), and `productionModules()`
   (`:169`) counts every non-test `.ts`. The new clause is "imported by no production module",
   following the `search.mate-corpus.ts` precedent. The lift's line numbers are named.
6. **`A8` is new**: a re-pin ledger that QE checks against the tree. It covers P/F rows only, with
   no R literal edited, and every engine opt-in lane must stay green.
7. **Dependencies**: `ABC-076` is `Done`, and the merged engine tickets are `Done`. `ABC-086` is a
   parallel lane; the Orchestrator decides merge order, and whichever merges second re-measures.
   `ABC-083` is downstream. `ABC-084` is unbuilt, so there is no strength oracle.
8. **NFR triggers**: `NFR-005` in two parts. `NFR-004` is assessed as not plausibly reddened (the
   overshoot is bounded by `NODES_PER_CLOCK_CHECK` 1 024 times the per-node time). `NFR-009` is not
   triggered. `N8-LANE` is ≤ 650 ms net. The `NFR-008` second-order delta (every existing search
   row runs a costlier `evaluate`) is reported as `UNKNOWN - verify`.
9. **Test notes 4–6**: re-pin from measurement, and where the probes are; the uncapped
   passed-pawn bonus against `QE-G3`'s `> 400`; a red pawnless fixture means a bug.
10. **Size `M`** with the reason. The original `S` rationale is kept, labelled.
11. **§ Merged bars this change can move** (23 rows) and **§ DoR re-score 2026-10-09**.

## DoR: 10/10

Item 3 flips ⚠️ → ✅ (`ABC-076` is `Done`). Items 4, 6 and 8 are re-written and still pass. The
rest are unchanged. No ⚠️ remains.

## Flagged, not changed

- `src/quiescence.test.ts:186`–`:221`'s `HANGING_CORPUS` hand-mirrors twelve rows because the
  helper was not exported. After `A7`'s lift a shared helper exists. Re-deriving those rows is not
  this ticket's scope (coding rule 12: flag, don't change).

## Not decided here

- **Merge order with `ABC-086`**: the Orchestrator's call.
- **The board move to `Ready`**: the Orchestrator's, because `plans/board.md` is fenced from this
  subtask.
- **Any NFR level**: only the owner's word moves one.
