---
id: 20261027T041209Z-architect-design-decision-c5d0e464
kind: decision
by: architect-design
at: 2026-10-27T04:12:09Z
verified_by: 
confidence: high for the form, the doors, the moved set and the counts (deterministic, probed at f0c50046); ADR-0051 is PROPOSED and the owner's; G6 is UNKNOWN - verify until QE reads it; STOP: P1 and P2 are the Orchestrator's to route
refs:
  - ABC-210
  - EPIC-008
  - ADR-0051
  - ADR-0050
  - ADR-0026
  - ADR-0025
  - ADR-0024
  - ADR-0034
  - NFR-005
  - NFR-004
  - G1
  - G6
  - A1
  - A2
  - A3
  - plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
  - memory-bank/50-decisions/ADR-0051-a-check-extension-arrives-at-the-horizon-once-per-line-behind-a-test-only-off-door-pair.md
  - orch-2026-10-27d/20261027T033728Z-orchestrator-decision-828d5794
  - bapm-ready-ABC-210/20261027T033612Z-ba-pm-decision-133465f3
  - bapm-ready-ABC-210/20261027T033612Z-ba-pm-observation-3bbfaa07
  - arch-design-ABC-208/20261026T023232Z-architect-design-decision-012b1053
  - qe-ABC-208/20261026T122350Z-qe-e2e-observation-3d6a4c99
  - qe-ABC-209/20261027T032028Z-qe-e2e-observation-7c874c4e
  - grugops/arch-design-ABC-210
  - f0c50046
  - b5c67ab7
supersedes: 
seal: sha256:88089e906ec2aec2b6f942229399ee611ea1b0f27d2a8082af2d9120958cae47
---

# Architect/Design: ABC-210 designed. ADR-0051 PROPOSED (owner's): form (a) at the horizon only, +1 ply once per line; doors searchWithoutCheckExtension / chooseMoveWithoutCheckExtension; oracle d5 ≥ 90 % within 25 cp, max 174 cp, same-depth mate floor; A3 d6 1.054× / 1.007×; G6 predicted MET against "≥ base" (strike "≥ base − 1"); STOP: 2 shipped-path pins move under every form (P1, P2); M, no split

Task `arch-design-ABC-210`, records plus probes, at `main` `f0c50046` (code = `b5c67ab7`), branch
`grugops/arch-design-ABC-210`. Full text: `memory-bank/50-decisions/ADR-0051-…md` (PROPOSED) and
`plans/tickets/ABC-210-…md` § Design ruling. Probes: this task's observation note. Inputs: Orchestrator `…828d5794`
(routing, reading b, the "≥ base − 1" rule), BA/PM `…133465f3` / `…3bbfaa07`, model hop `arch-design-ABC-208`
`…012b1053` (`ADR-0050`), `ADR-0024` d1/d3/d4, `ADR-0025` d7, `ADR-0026` d1–d10, `ADR-0034` d2, `qe-ABC-208`
`…3d6a4c99` and `qe-ABC-209` `…7c874c4e` (base's 3 s node medians).

## The ruling
1. **Form (a), at the horizon only.** A full-width node with remaining depth ≤ 0 whose side to move is in check is
   searched one ply deeper, at most once per line (`CHECK_EXTENSION_MAX_PER_LINE = 1`). Form (b) is not built.
   `ADR-0024` d4 and `src/quiescence.ts:21-24` stand; `src/quiescence.ts` is untouched. Reasons: it fixes the
   stand-pat-in-check error at the leaf; it is the only form inside `A3`'s 1.5× (every-node reads 1.69× on position-6
   at d6); `G1` holds at 54/58; it reverses no accepted ADR. Form (b) reads `G1` 53/58, loses `zugzwang.005` through
   d13, and needs unpriced move generations in the leaf.
2. **Rule:** one exported pure predicate, `checkExtensionPlies(position, depth, extensions)` → 1 or 0. Both
   recursions call it at node entry (after the repetition scan, before the leaf test and the probe) and add its value
   to depth and count. `extensions` is an argument placed before `afterNull`.
3. **Limits:** a line is at most root depth + 1 full-width plies, inside `KEY_ARRAY_CAPACITY` 128; `QUIESCENCE_MAX_PLY`
   8 unchanged. No ply budget beyond the cap.
4. **Null move:** confirmed, no null move in check (`src/search.ts:305`, `ADR-0050` d6). An extended node has depth 1
   < 2, and a null child is never in check. **LMR:** no reduction in check (`ADR-0026` d6); depth 1 < 3. Neither
   predicate changes. The table probes and stores at the extended depth.
5. **Doors:** `searchWithoutCheckExtension(position, depth)`, `chooseMoveWithoutCheckExtension(position, options)`,
   the pre-ticket shipped path with null move on. Every older door turns the extension off. `A1` 300/300 cells.
6. **Re-points:** `ADR-0050`'s d5 drift pair, its mate floor and the two "changes the work" rows re-point their shipped
   side to the new doors, so 37 cp keeps measuring null move alone. `ADR-0026` d9's rows (118 cp) are untouched.
   `QE-208-c`'s door maps grow by the two doors.
7. **Oracle (`A3`):** d5 on the 190, both recursions, ≥ 90 % within 25 cp, none beyond 174 cp (measured 93.58 % /
   94.12 %, max 116); same-depth d5 mate floor on the 287 (0 of 189). 95 % fails the correct build. A regression net.
8. **`A2`:** five horizon rows at depth 1 (FENs in `ADR-0051` d8), the line-length instrument (call-through spies,
   invocation order) and a cross-check cap row. `A3` nodes read `search(position, 6)` against the door: 1.054× /
   1.007×.

## STOP (to the Orchestrator): moved pins
- **P1** `transposition.test.ts` `ABC-081` `A5` "the fixture bites: at depth 3 …": −485 → 0. Proposed: re-pin per
  `ADR-0026` d7 to depth 2, −502.
- **P2** `search.null-move.test.ts` `ABC-208` `A2` `zugzwang.005` (deep): Ne2 at d12, Nxd5 from d13. Proposed: depth
  12 → 13, which edits accepted `ADR-0050` d9, so it is the owner's, bundled with `ADR-0051`.
- Both move under every form probed. Every other moved row: 2 export lists, 2 `QE-208-c` door maps, 2 red + 3 green
  re-points. **0 levels, 0 relations, 0 NFR bounds, no `ADR-0026` level.**

## Frozen-clock and G6
- base → design: kiwipete d7 590 489 → 610 577, d8 1 259 463 → 1 302 377 (+3.4 %); position-6 d7 180 941 → 181 191,
  d8 355 565 → 358 872 (+0.9 %); d9 2 907 475 → 2 830 006 and 940 109 → 993 871.
- **`G6` predicted MET against "≥ base"** (`UNKNOWN - verify`): kiwipete 8 while cost per node rises < about 20 %;
  position-6 9 while < about 65 %. Added work: one `isInCheck` at 14.6 % / 18.6 % of nodes, 0.83 % / 0.97 % of nodes
  extended. **The "≥ base − 1" clause can be struck** (stricter; no owner word, `…828d5794`).

## Size
**`M` holds; no split.** About 100–150 production lines in `src/search.ts` and `src/engine.ts`.

## Owed by others
- **Orchestrator:** route the STOP (P1, P2); the build should wait on it. Report `ADR-0051` + P2 to the owner as one
  question.
- **Owner:** accept or decline `ADR-0051` (with P2's `ADR-0050` d9 depth change).
- **BA/PM:** the page lines in § Design ruling → Owed by others (`adr:` line, Scope 1/3, `A2`, `A3` with "≥ base − 1"
  struck, `A1`, test notes 1 and 3).
- `plans/board.md`, `plans/traceability.md`, `EPIC-008`, `src/`: not touched.
