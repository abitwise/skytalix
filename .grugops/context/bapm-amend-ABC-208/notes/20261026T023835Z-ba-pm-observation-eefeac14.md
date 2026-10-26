---
id: 20261026T023835Z-ba-pm-observation-eefeac14
kind: observation
by: ba-pm
at: 2026-10-26T02:38:35Z
verified_by: 
confidence: high on the re-reads; the three readings are named choices, each keeping the bar
refs:
  - ABC-208
  - EPIC-008
  - ADR-0050
  - ADR-0026
  - ADR-0034
  - A1
  - A2
  - A3
  - G1
  - G6
  - G7
  - plans/tickets/ABC-208-null-move-pruning-behind-a-test-only-off-door-with-a-zugzwang-guard.md
  - arch-design-ABC-208/20261026T023232Z-architect-design-decision-012b1053
  - arch-design-ABC-208/20261026T023232Z-architect-design-observation-bae20026
  - orch-2026-10-26e/20261026T023422Z-orchestrator-decision-749ff988
  - orch-2026-10-26c/20261026T010824Z-orchestrator-decision-d25ab770
  - bapm-ready-ABC-208/20261026T010656Z-ba-pm-decision-75bf6402
  - grugops/bapm-amend-ABC-208
  - 5a7866f0
  - ADR-0026 d9
  - ABC-121
  - ABC-215
supersedes: 
seal: sha256:4d79448d00924830366f62b886b8fec2ec7db041cd730547d2940d6efa6bad84
---

# BA/PM: ABC-208 amendment readings. Three interpretation choices were named and the bar-keeping reading taken. Two low flags. Re-read at main 5a7866f0

Task `bapm-amend-ABC-208`, records only. The sources were re-read at `main` `5a7866f0`: the page, `ADR-0050` (PROPOSED),
`ADR-0026` d9 (the 190 and the 287), Architect `…012b1053` / `…bae20026`, and Orchestrator `…749ff988` / `…d25ab770`.
No `src/` read was needed. No npm, vitest or timing was run.

## Readings taken (the page carries the outcome; this note keeps the alternatives)
1. **`A1`, out of tree.** Both of `A1`'s sentences cross builds: the new door against base's shipped search, and every
   older door against its pre-ticket self. The Architect named only the first. The page line covers both, because the
   probe's 222 cells covered both (`…bae20026` § Doors: head's doors against base's same doors, and the new pair
   against base's `search()` / `chooseMove`). Alternative not taken: an in-tree pin of base's node counts as literals.
   That would be a new test design, so it was left to QE and the Engineer.
2. **`A2`, "proven … with its source".** `ADR-0050` d9 says `zugzwang.005`'s label "is the suite's best move, not a
   proven unique win". The CPW `.001` and `.004` labels rest on the suite plus Stockfish 19 at depth 26, not on a
   proof. The four K+P rows are tablebase-unique.
   - Reading taken: Test note 1's "carry their source … not hand-labelled guesses" defines "proven" here.
   - The bar is unchanged either way. All 7 rows must be played. Without `.005`, the other six still meet "≥ 6", and
     under the strictest reading (tablebase only) the K+P four do not reach six. So the reading matters only to the
     count, and the count is met under the reading the page states.
   - **LOW, for the Orchestrator's `Ready for Dev` exit re-read:** if a strict "tablebase-proven" reading were ever
     wanted, `A2` would need more K+P or tablebase rows. That is not asked for, and it is not done.
3. **`A3`, which corpus the mate clause binds.** The page's clause names no corpus. The sentence before it reads "the
   identity corpus" (the 190, which holds 3 mates). Scope 4 asks for "the shape of `ADR-0026` decision 9", which has a
   mate floor on the 287 mate-rich corpus and a printed report of flips on the 190.
   - Reading taken: the `ADR-0026` d9 shape, which is `ADR-0050` d8: the floor on the 287 at d5 → d5, and flips on the
     190 printed. It is stricter in coverage (189 mates at d5 against the 190's 3). The probe measured 0 flips on the
     190 at d5 (`…bae20026`), so the reading changes no verdict today.
   - Alternative not taken: binding the 190's 3 mates as a bar too. That would add a bar `ADR-0026` d9 declined
     ("held for every wrong variant tried"), so it would add nothing the 287 does not hold.

## Facts re-read at `5a7866f0`
- `ADR-0050` status: PROPOSED (2026-10-26). It amends no accepted ADR, and no `ADR-0026` level or NFR bound moves.
- `…d25ab770` takes reading (b). The design and the build may proceed. The ALONE `G6` + D reading and the merge wait
  on the owner's acceptance.
- `A4` `G7`: "re-read only if the design adds a structure held between nodes". The ruling holds nothing between nodes
  (the null flag is an argument), so `G7` is not owed. That goes in DoR row 4. No page line was added.
- Page size after the amendment: 297 lines (budget ≤ 300, standing ruling 2).

## Flags (LOW; not blockers)
- The page frontmatter still reads `status: ready` / `column: Ready`, while the board has the ticket In Design. This
  hop left it alone: `ABC-215`'s page kept the same stale field after its amend hop, and the board is the state. The
  Orchestrator may sync it at the move.
- Already flagged elsewhere, and repeated only by id: `ADR-0026` d9 reads 118 cp while `main`'s `ABC-121` rows assert 75
  cp (`…749ff988`, the Architect's next hop). This page cites neither number as a bar.
