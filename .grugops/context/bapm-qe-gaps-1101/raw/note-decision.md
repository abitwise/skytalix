# BA/PM routing of today's QE gaps: two test-only tickets cut into `EPIC-010` milestone 1b, not one bundle and not `EPIC-011` M0. `ABC-260` (QE-259-a/b; XS, P2, DoR 10/10) and `ABC-261` (QE-254-b/c; XS, P3, DoR 10/10 conditional on `ABC-254`'s merge). QE-249-a and QE-259-c carried as notes; QE-249-b not cut alone

Records only, at `main` `661828d5`; nothing run, built or timed. Records commit `62399736` on `grugops/bapm-qe-gaps-1101`.
Sources: `qe-ABC-249` `…66371344` (verdict `…17ce7d7c`), `qe-ABC-259` `…1aca1753` (verdict `…f47bc0aa`),
`qe-ABC-254` `…dede949b` (verdict `…1c801504`, read on branch `grugops/qe-ABC-254` at `15eadd7a`).

## Placement: `EPIC-010` milestone 1b, not `EPIC-011` M0
- M0 is `ABC-255`, a `tools/` instrument for strength reads. These are default-lane rows guarding files milestone 1b
  rewrites next: `ABC-250` packs `ABC-254`'s lazy filter; `ABC-251` rewrites the scanned search. Rows that land first
  read those rewrites.
- `ABC-259` (G-1) was placed in 1b for the same reason (`bapm-reconcile-adr0056`). The precedent holds.
- Cost to the close: none beyond each ticket's QE hop. Both are test-only, owe no C3″/S′ change, and are ordered
  before 1b tickets that come anyway.

## Two tickets, not the brief's one bundle (pushback, INVEST)
- One bundle would touch three or four test files across three modules. It would also make QE-259-a (MEDIUM,
  independent) wait on `ABC-254`, which is UNRESOLVED on A4 and dropped if A4 misses.
- **`ABC-260`** (QE-259-a + QE-259-b): `src/levels.test.ts` only. `process` matched as a whole word. Strings cannot
  hide code from the `ABC-259` block or `ABC-087` A8: the SE picks a guard row (a) or string blanking (b). Plants Q5,
  Q6, Q7 plus an A8 string plant turn red; comment controls stay green; ≤ 20 ms; `G8` ≤ 10 s. **P2:** MEDIUM, it
  guards the owner's condition. **No ADR change:** the term reads R-TC item 2 as written. QE also named the
  Architect as a carrier; BA/PM rules no Architect ruling is owed, and a reason found at build stops it.
- **`ABC-261`** (QE-254-b + QE-254-c): an early-exit row (spied `isSquareAttackedBy` count; PL3a red, gap ≥ 2 calls)
  and an in-check quiet-promotion row (lazy vs full list on two boards, illegal and blocking; PQ2 red); ≤ 30 ms.
  **P3:** both LOW. **Pulled only after `ABC-254` merges; dropped if `ABC-254` is dropped or declined** (on the full
  filters the rows compare a function with itself). Recommended before `ABC-250`.
- Exact plant spellings were taken from QE's `plant.py` / `plants/*.diff`, not paraphrased.

## Notes carried, no ticket
- **QE-249-a (LOW):** a dated test note on `ABC-233`, `ABC-236`, `ABC-237`, `ABC-238`. It says: on re-pinning
  `ABC-249`'s row, keep the with-keys move ≠ the withheld move, or add the relational assert. Equal figures mean the
  fixture is dead: re-run QPLY4 and rebuild it.
- **QE-249-b (INFO): not cut, not bundled.** A ply ≥ 4 root-0 fixture has unknown cost, and QE's surviving mutant is
  reasoning only (`UNKNOWN - verify`). So it is not cheap and fits neither ticket's file. One conditional line rides
  the QE-249-a note: a ticket that changes how such a draw is scored or stored adds the row. **Re-open trigger:** a
  QE plant (a draw ≠ 0 only at ply ≥ 4) run and surviving the default lane.
- **QE-259-c (LOW):** a dated review note on `ABC-251`: computed-key budget reads and thresholds on `deadline - start`
  are read by eye; the build note says so. An AST is out of scope.
- **Not this hop's:** QE-254-a (BLOCKING; the Orchestrator's `qe-ABC-254-a4`). Its D3 spread-rule question was not
  in this brief and is not ruled here. QE-259-d and QE-249-c (INFO) are recorded, with no action.
