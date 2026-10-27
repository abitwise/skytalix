---
id: 20261027T065341Z-software-engineer-decision-8c4e8b4b
kind: decision
by: software-engineer
at: 2026-10-27T06:53:41Z
verified_by: 
confidence: high: built to ADR-0051 and the page's ruling; pins exactly the ruled set; deterministic
refs:
  - ABC-210
  - EPIC-008
  - ADR-0051
  - ADR-0050
  - ADR-0026
  - ADR-0024
  - NFR-005
  - NFR-008
  - A1
  - A2
  - A3
  - plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
  - memory-bank/50-decisions/ADR-0051-a-check-extension-arrives-at-the-horizon-once-per-line-behind-a-test-only-off-door-pair.md
  - owner-word-2026-10-27/20261027T062043Z-orchestrator-decision-047d411f
  - orch-2026-10-27f/20261027T041414Z-orchestrator-decision-75af453c
  - arch-design-ABC-210/20261027T041209Z-architect-design-decision-c5d0e464
  - arch-design-ABC-210/20261027T041209Z-architect-design-observation-8e6a40c2
  - bapm-amend-ABC-210/20261027T041844Z-ba-pm-decision-ae96d6d3
  - bapm-amend-ABC-210/20261027T041844Z-ba-pm-observation-6f7cb75e
  - grugops/ABC-210
  - dc4edb32
  - P1
  - P2
supersedes: 
seal: sha256:0a64ee0da899eff275ec7abfc507142b2df634a07267861dd0264b031fe9921f
---

# SE: ABC-210 built to ADR-0051 and the page's Design ruling. Form (a) at the horizon, +1 ply once per line, doors searchWithoutCheckExtension / chooseMoveWithoutCheckExtension; exactly the ruled pins moved (P1, P2, 2 export lists, 2 door maps, 5 re-points); no STOP

Task `ticket-to-pr-ABC-210`, branch `grugops/ABC-210` from `main` `5dfd818c`, code `dc4edb32`. Not pushed, not merged.
ADR-0050 and ADR-0051 not touched (the Architect is accepting them beside this task).

## The build (production: `src/search.ts`, `src/engine.ts` only)
- `checkExtensionPlies(position, depth, extensions)` → 1 when depth ≤ 0, extensions < `CHECK_EXTENSION_MAX_PER_LINE` (1, not
  exported) and the side to move is in check; else 0. Check is derived inside.
- Switch `checkExtension`: true on `search()` and `chooseMove` only; false on all 9 older search doors and 3 older engine doors.
- Both recursions call it at node entry, after `repeatsInPath`, before the leaf test and `probeTable`, under the switch, and add
  its value to depth/remaining and to `extensions`. `extensions` is a parameter placed before `afterNull`. Every child (null child
  included) gets the node's count; the root passes 0. The engine imports the predicate (no copy).
- Doors: `searchWithoutCheckExtension(position, depth)` and `chooseMoveWithoutCheckExtension(position, options)`, the shipped
  path with the extension off and null move on. Header paragraphs added to both modules. `src/quiescence.ts` and
  `QUIESCENCE_MAX_PLY` untouched. Neither `lateMoveReduction` nor `nullMoveReduction` changed.
- Size: +192 / −21 in the two production files (comments and formatted door objects included).

## Pins moved: the ruled set and nothing else
- **P1** (Orchestrator `…75af453c`): `transposition.test.ts` ABC-081 A5 "the fixture bites" d3 −485 → d2 −502 (title "at depth 2").
  RE-PINNED comment. QE re-plants the fixture bug at d2 (owed to QE).
- **P2** (owner `…047d411f`): `search.null-move.test.ts` `zugzwang.005` depth 12 → 13. **Its consequence:** the same file's
  table-sanity row "seven rows … at depths 8 to 12" asserted depth ≤ 12, so it reads "8 to 13" and ≤ 13. That is the same pin
  (it encodes the row's depth), not a new bound. It is listed here so the reviewer sees it.
- Export lists: ABC-077 A6 + `checkExtensionPlies`, `searchWithoutCheckExtension`; ABC-078 A4 + `chooseMoveWithoutCheckExtension`
  (and its `.length` 2 in the same row, the ABC-208 precedent).
- QE-208-c door maps: + the two doors with `nullMove` "true"; describe and it titles name "the shipped path and the ABC-210 doors".
- Re-points (ADR-0051 d6): the ABC-208 d5 drift ×2, the mate floor and the two "changes the work" rows read the new doors on the
  shipped side. Titles name the door; one `ABC-210` comment per row.
- 0 levels, 0 relations, 0 NFR bounds, no ADR-0026 level. No other existing row changed.

## In-ruling choices (each reviewable)
1. New file `src/search.check-extension.test.ts` holds the ruled rows (the ABC-208 precedent of a per-ticket file).
2. Lanes per N8-LANE: default holds the predicate table (9 + fixtures), the source row ×2, the switch-literal row ×2 + door
   arity, A2's five rows ×2 recursions + fixture row, the instrument on the five rows at d1, the cap row and its fixture
   (33 rows). SEARCH_DEEP holds the instrument on four roots at d5, A3 d6 nodes ×2, drift ×2 + corpus size, and the mate floor (10).
3. A2 pins the door's exact move from ADR-0051 d8's table (stronger than "another move"). The fixture row checks that each recorded
   check gives check and each door move is legal. It does not claim the door move is quiet: Nd6 also checks.
4. The instrument is a running line length, kept by call-through spies on `apply.ts` (makeMove, unmakeMove, makeNullMove,
   unmakeNullMove) in their global invocation order, read at each qply-0 `quiesce` call. It asserts balance (0 after the run)
   and at least one leaf, so it cannot pass vacuously.
5. The source row pins the gated block verbatim in both modules, its position (after the repetition scan, before the leaf test
   and the probe), `extensions` before `afterNull` in the signature, and `extensions` as the second-to-last argument of every
   negamax call.
