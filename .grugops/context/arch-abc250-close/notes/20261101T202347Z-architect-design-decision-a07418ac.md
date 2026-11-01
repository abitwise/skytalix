---
id: 20261101T202347Z-architect-design-decision-a07418ac
kind: decision
by: architect-design
at: 2026-11-01T20:23:47Z
verified_by: 
confidence: high on value identity (bit-identical rewrites); low on the speed effect, gated by the profile-first stop rule
refs:
  - arch-abc250-close
  - ADR-0055
  - ADR-0055-D3-V2
  - ABC-250
  - ABC-251
  - ABC-252
  - ABC-253
  - ABC-254
  - EPIC-010
  - QE-250-a
  - qe-ABC-250
  - grugops/arch-abc250-close
  - 032def2a
  - 767a2e3e
  - src/engine.ts
  - src/position.ts
  - src/moves.ts
  - src/evaluate.ts
  - src/apply.ts
  - src/quiescence.ts
  - src/search.ts
  - src/zobrist.ts
  - bapm-abc250-close
  - QE-259-c
  - QE-260-a
  - G2
  - G3
  - G4
  - arch-ABC-235
supersedes: 
seal: sha256:fa2654578983985632460cc677aed0fb028aca558e6a9f8fee030370e812b00a
---

# ABC-251 design input, narrowed form (O1-c alone, on today's Move objects): value-identical by construction, no ADR; profile first and stop if the helpers are already inlined; inline isBlack/pieceType only at the hot sites the profile names (evaluate.ts only if named, which owes G2/G3); write Budget's six heuristic fields out in place of `...heuristics`; nothing else

Architect/Design, task `arch-abc250-close`. Design input for BA/PM's re-scope (`bapm-abc250-close`) and the Software Engineer. Read from `src/` at `main` `767a2e3e`; nothing run.

## Scope
`ABC-251`'s narrowed form (its page: items 1 and 3 struck; item 2, O1-c; size S; A3 bar ≥ 1.03× on two boards, ≥ 1.00× on the third). The page asks the Architect to confirm value-identity at design, as `arch-ABC-235` did. **A design input is needed and is this note.**

## Design
1. **Value identity: by construction. No ADR.** `pieceType = (piece) => piece & 7` and `isBlack = (piece) => (piece & BLACK) !== 0` (`src/position.ts:52`, `:55`). Writing their bodies at a call site changes no value. Budget's fields written out keep the same values. No order, key, score or node count can move. A1 (`G4` identity sweep) and A2 (the `ABC-240` oracle unchanged) still run, as the page says.
2. **Profile first; stop rule.** The helpers are one-line arrow functions that TurboFan normally inlines. The "~2 % not inlined" is from `se-ABC-227`, before `ABC-235`, `ABC-240` and `ABC-254`. Before editing, the Engineer takes one informal CPU profile under the host lock (`chooseMove` at 4 s on kiwipete and position-6, base `main`):
   - If `isBlack` / `pieceType` do not show as self-time frames, the helper half has nothing to cut: inline nothing, and say so in the build note.
   - If neither half shows a measurable frame, the Engineer reports it before any ALONE read is spent. The Orchestrator may then drop the ticket. A bar of 1.03 cannot be met by an edit that removes nothing.
3. **Helpers, where.** Inline only at hot-path sites the profile names. Candidates by count: `moves.ts` 13, `evaluate.ts` 7, `apply.ts` 3, `quiescence.ts` 2, `search.ts` 2, `zobrist.ts` 1. Keep both exports in `position.ts`, because shell modules use them. Touch `evaluate.ts` only if the profile names it there: that is what owes `G2` / `G3` (page A5). Match each file's existing style; no new helper module.
4. **Budget, constant shape** (`src/engine.ts` `deepen`, the literal at about `:705–720`). Replace `...heuristics` with the six fields written out in `Heuristics`' order (`pvs`, `reductions`, `nullMove`, `priorKeys`, `quiescenceEvasions`, `quietPromotions`). All six heuristics objects (`chooseMove` and its five doors, `:587–695`) already share one key order, so this is about field layout (literal slots, not spread-copied ones), not polymorphism. The spread runs once per `chooseMove`, not per node, so expect a small effect, likely under 1 %. `search.ts` has no spread. `visit`, `killers`, `keys` and `prior` stay as they are.
5. **Fence (no gold plate).** No other "monomorphisation": no `Move` / `KillerTable` / `UndoRecord` shape change, no packed moves, no `countNode` restructuring, no key work (`ABC-253`). C1–C4 are moot, since nothing touches order.
6. **The read.** A3 is a search read at 4 000 ms under ADR-0055 D3-V2 as written, with agreement-guard bars 1.03 and 1.00 (ADR-0055 § Addendum — 2026-11-01, second, item 2). No perft run is graded. Expected 1.00–1.04× (this task's observation note), so the bar sits inside the estimate. A miss is NOT MET, dropped (page rule).
7. **Order against `ABC-253`.** Both edit `src/engine.ts`'s `Budget` (`ABC-253` retypes `keys` / `prior`). Either order rebases in a few lines. The page's order (`ABC-251`, then `ABC-253`) stands, and the Orchestrator may swap them if `ABC-251` stops at item 2's rule.
8. **Review notes 6 and 7** (QE-259-c, QE-260-a) still apply if the diff touches the scanned search files.

## Risks
- The page's Problem, Value and Dependencies sections still describe the packed core. BA/PM's re-scope must strike those (concurrent hop).
- If the profile is taken off the lock or with foreign load, a frame can be mis-attributed. It is a go / stop signal for editing, not a grade.
