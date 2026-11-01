# ABC-250 closed not merged by routing (A4 not graded, never "missed"); ABC-252 dropped; ABC-251 narrowed to O1-c alone (S, P2, DoR 9/10, row 10 waits on `arch-abc250-close`); E 1 650 owner-confirmed on EPIC-010/011 with the upward raise rule

BA/PM, task `bapm-abc250-close`, records only, at `main` `767a2e3e`; nothing run, built or timed. Inputs:
- the Orchestrator's routing decision `orch-2026-10-30a/…d2571be5`;
- the owner's word `orch-2026-10-30a/…1f5e3b27`;
- `qe-ABC-250`: verdict `…4fe9c469`, A4 `…677d4d41`, identity and gates `…81a2c477`, A5 `…94b58687`, gaps `…f2befa65`;
- `se-ABC-250` `…ff7ffb6e` (informal speed readings).

1. **`ABC-250`: `status: dropped`, `column: Done`.** This follows the repository's not-delivered convention (`ABC-209`,
   `ABC-256`).
   - The close block says "closed not merged by routing; A4 not graded (UNRESOLVED)". It never says "missed". No
     `failed-attempt` note is owed, because neither HOLD nor NO-GO was read.
   - It lists what was green: A1, A2, A3/G4, A5 (1.003 / 0.994 / 1.005), G1, G5–G9, the gates, and 6/6 plants red.
   - The branch `grugops/ABC-250` (`2e04eee5`) is kept, and the close is reversible: a future ticket may revive it
     with an Architect-ruled read method.
   - The page's HOLD/NO-GO re-open triggers do not bind, because this close was not a graded HOLD or NO-GO.
   - QE-250-a goes to the Architect and QE-250-b to the Orchestrator. QE-250-d falls away.
2. **`ABC-252`: dropped, by the same convention**, as the consequence its own § Dependencies names. Nothing was
   built, so nothing was read or missed. Its test note 5 lapses; the "never drop the bar" rule binds any later
   reorder.
3. **`ABC-251`: re-scoped to O1-c alone**, the page's own "Narrowed form" branch, applied as written.
   - **Struck:** items 1 and 3, A4, and the full-form A3 bar and miss branch.
   - **Kept:** test notes 6 (QE-259-c) and 7 (QE-260-a), as written.
   - **Every dependency on packed generation is removed:** no `ABC-250` base and no `ABC-252`.
   - **New scope:** `pieceType` and `isBlack` (`src/position.ts:52`/`:55`) inlined by hand on the hot path, or made
     provably inlinable. `deepen`'s `Budget` keeps a constant shape, with no `...heuristics` spread
     (`src/engine.ts:719`). Both on today's `Move` objects, with every signature unchanged.
   - **Acceptance:** A1 `G4` byte-equal against `main` (with `ABC-254`, no packed path); A2 the `ABC-240` oracle with 0
     mismatches; A3 ≥ 1.03× on two boards and ≥ 1.00× on the third, under D3 + D3-V2 plus any forward-only
     `arch-abc250-close` rule; A5 the gates (G2/G3 if `src/evaluate.ts` changes); A6 S2 with no smoke.
   - **Miss:** dropped, with a `failed-attempt` note. **VOID** is not a result and goes back to QE.
   - **Size S, P2.** P2 is for the epic-close path, not the gain. The risk is stated: A3's bar sits near the top of
     `ADR-0055`'s 1.00–1.04× estimate, and the shares are pre-`ABC-254` (`UNKNOWN - verify`).
   - Test note 8 is added: `ABC-261`'s and `ABC-262`'s rows bind generation order. Inlining in `src/moves.ts` must
     keep it, and the row must never be re-boarded to pass.
   - **DoR 9/10, Backlog.** Row 10 is ⚠ because `arch-abc250-close` has not merged. Its item 4 (a design input for
     O1-c, or none) and its item 2 (QE-250-a's bearing on A3's read) are open.
   - If it says none (or adds only a forward-only read rule), DoR is 10/10 on its merge, and the Ready
     recommendation applies with no further BA/PM hop. If it changes scope or acceptance, BA/PM folds it first.
4. **`EPIC-010`.** A dated top block is added.
   - Tickets rows 25–27 are re-stated (250 Done dropped by routing, 251 narrowed S 9/10, 252 Done dropped).
   - The status cells of rows 24 and 29–32 are corrected to Done with their merge commits, per the board.
   - The § Milestone 1b rows for 250/251/252 are marked.
   - **Milestone 1b status:** delivered `ABC-254` plus the test-only `ABC-259`/`260`/`261` (and `ABC-249`); remaining
     `ABC-251` (narrowed) and `ABC-253` (Ready), one after the other on shared files. `ABC-262` is `EPIC-011` M0, with
     no change.
   - Exit readings re-costed to about 2 h ALONE (estimate). "The packed base" now reads "the base milestone 1b leaves".
5. **E 1 650, owner-confirmed, on `EPIC-010` and `EPIC-011`.** The "may revert to 1 910" lines are superseded.
   - **Raise rule:** a pooled S′ score above 85 % over ≥ 30 games re-pins E upward one band-rule step (E ≤ 2 600),
     with no owner ask.
   - The first reading cited is `qe-ABC-255` A5, 9/10, under 30 games.
   - **BA/PM's reading, not a ruling:** a downward re-pin is outside the owner's word and goes to him.

Not touched: the board, `memory-bank/`, `src/`, `tools/`, `data/`, `AGENTS.md`, and the ADRs (`arch-abc250-close`
holds `ADR-0055`/`ADR-0056`).
