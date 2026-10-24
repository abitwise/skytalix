---
subtask: arch-design-ABC-205
role: architect-design
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/arch-design-ABC-205/
width: 2 (beside arch-design-ABC-212; disjoint files)
---

# Design ruling for ABC-205 (king safety with queens on, tapered king table) + the ADR-0031 addendum

## Do
- Answer the page's design questions; rule the evaluation shape (queen-on scaling of king exposure, tapered king table, no castled bonus without shelter), the A5 eval-cost bar (≤ 1 100 ns) plan, the relation-test set, and how the build proves S1 (D reading via ABC-204 once it is accepted).
- Write the ADR-0031 addendum as **PROPOSED** (the owner accepted the proposal `…7feb0553`; the addendum TEXT goes to him for acceptance). Keep it tight: what changes in the evaluation contract and why.
- Light probes on a scratch copy only (no `src/` edits); no long engine runs. A dated `## Design ruling` on the page; recommend the next move.

## Fences
- Worktree `../wt-arch-design-ABC-205` on `grugops/arch-design-ABC-205` from `main`. Only the ABC-205 page, ADR-0031 (addendum, proposed), your notes. No `src/`, tests, catalog, board/trace. ABC-212's page/ADR-0045 belong to the parallel hop. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/design205/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-design-ABC-205`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: records plus light probes. Branch `grugops/arch-design-ABC-205` @ `2ed3f252`** (from `main` `c487d89c`;
commits `2dbcd5d0` for the records and `2ed3f252` for the notes). Not pushed and not merged. Worktree
`../wt-arch-design-ABC-205`.

- **Files:**
  - `plans/tickets/ABC-205-…md` § Design ruling (dated 2026-10-24);
  - `memory-bank/50-decisions/ADR-0031-…md` § Addendum 2026-10-24, **PROPOSED**, with a one-line pointer under
    Status;
  - `.grugops/context/arch-design-ABC-205/notes/`.
- **Not touched:** `src/`, tests, the catalog, the board, the trace file and ABC-212's files.
- **Forms:**
  - **Queen scale:** exposure ×3 while the enemy has a queen, ×1 otherwise. Ceiling 315 cp, below a minor piece.
  - **Taper:** phase N1 B1 R2 Q4, clamped to 24. Per king `((mg·phase + eg·(24−phase)) / 24) | 0`. mg is the
    existing table. eg is **our own** `40 − 15·m`; Michniewski's endgame table is not used (Apache-2.0,
    `…28633db0`).
  - **Gate:** a positive mg value is paid only with intact shelter (the same shelter test as `kingExposure`).
  - **Contract** unchanged.
- **Tests:**
  - `A1`–`A4` rows with exact FENs, appended to `evaluate.king-mobility.test.ts`.
  - **New `A3b`** (queenless) isolates the gate. Probed: the gate mutant leaves `A3` green.
  - Each mutant reds its own row. Mirror: 0 of 228.
- **Moved lane rows: 11 in 5 files.**
  - Pins are re-pinned.
  - pvs-lmr `A4` and engine `ABC-170` `A1` are re-found (`ADR-0028` d2).
  - **The quiescence position-6 d1 cell reads 10.96x against 10x. That is a stop under `ADR-0028` d4, ruled not a
    defect.** Proposed: ⌊1.5 × the build's reading⌋ ≈ 16x. This is **`OD-205-1`, the owner's word, needed before
    merge.**
- **`G2` probe** (loaded host, not a reading): base 678–741 ns, candidate 781–798 ns. Over 1 100 ns → STOP.
- **`G6`:** position-6 needs +8.8 % nodes to depth 7, so "≥ base" is the likeliest stop. Read rule: ≥ 5
  interleaved rounds, median, any run below depth 6 is a FAIL.
- **`S1`:**
  - order: gates green, then `OD-205-1`, then a frozen head, then D, after `ABC-204` is Done;
  - recommended single re-tune: scale 3 → 2.
- **`G11` direction at depth 6:** the candidate plays Be2, Be2, Ng4 for 8.e5, 10.Ne4 and 13.d4. Kc1 stays.
- **STOP:** none on this hop. `OD-205-1` is an owner word owed before merge.
- **Next move (Orchestrator):**
  - report the addendum and `OD-205-1` to the owner;
  - merge this records branch;
  - move ABC-205 In Design → Ready for Dev → In Development (SE).
  - The build does not wait for the owner. The merge does.
- **Notes:** `20261023T215851Z-architect-design-decision-1fb6e1bc` and
  `20261023T215851Z-architect-design-observation-8232146f`. Sealed by grugops 2.1.0 `admitAndAppend` with the
  worktree's context root, read back as 2, index rendered.

### Trace row (10 cells, header order)

| ABC-205 (arch design) | Architect/Design: king safety design ruled. Exposure ×3 while the enemy queen is on; tapered king square (phase /24, own eg table 40−15m); castled bonus only with intact shelter; `A1`–`A4` + new `A3b` rows with exact FENs, mutants probed; 11 moved lane rows routed; `OD-205-1` (quiescence position-6 d1 10.96x vs 10x) to the owner; `ADR-0031` addendum PROPOSED | EPIC-008 | ADR-0031, ADR-0028, ADR-0024, ADR-0039, ABC-204, ABC-083, ABC-079 | NFR-005 (`G6` risk flagged; read rule set), NFR-008 (no new file), `G2` (probe 781–798 ns); no bound moved | `grugops/arch-design-ABC-205` @ `2ed3f252` (records only)<br>`plans/tickets/ABC-205-…md` § Design ruling, `ADR-0031` § Addendum 2026-10-24 (PROPOSED)<br>`.grugops/context/arch-design-ABC-205/notes/` (…1fb6e1bc, …8232146f) | records only; scratch-copy probes at c487d89c (default lane, relations, mutants, eval cost ×4, nodes to d6/d7, quiescence multipliers d1–3, 3 s depth ×16, `G11` d6/d7); no deep lane, no match | — | — | DONE; addendum + OD-205-1 to the owner; merge is the Orchestrator's |
