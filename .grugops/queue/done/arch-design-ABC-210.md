---
subtask: arch-design-ABC-210
role: architect-design
ticket: plans/tickets/ABC-210-checks-at-the-horizon-a-check-extension-or-checks-in-quiescence.md
ref: .grugops/context/arch-design-ABC-210/
branch: new grugops/arch-design-ABC-210 from main, worktree ../wt-arch-design-ABC-210
width: 1 of 3 — no real-clock timing (probes on scratch clones only; frozen-clock counts allowed)
---

# ABC-210 design: checks at the horizon (new ADR PROPOSED → owner)

## Do
- Read Orchestrator `orch-2026-10-27d` (this hop's routing note) and BA/PM `bapm-ready-ABC-210/…133465f3`, `…3bbfaa07`. Use the ABC-208 design hop (`arch-design-ABC-208/…012b1053`, ADR-0050) as the model.
- **Pick the form:** (a) a check extension or (b) checks in quiescence, and give the reasons.
  - Form (b) reverses accepted ADR-0024 decision 4 (`src/quiescence.ts:21-24`).
  - Form (a) is a new value-changing heuristic (ADR-0026 d10).
  - Either way, write a **new ADR as PROPOSED**, and state the reading (b) gate: the build may proceed; the ALONE reading and the merge wait on the owner's acceptance. No agent marks it accepted.
- **ADR-0026 door pair:** add an off door per ADR-0026 d10. Rule on which existing rows re-point to it.
- **Rule on:**
  - the extension limits (per-line cap, ply budget) or the quiescence check-generation limits;
  - the interplay with null move (ABC-208, in force): no null move when in check is already the rule; confirm it;
  - the bounded oracle for drift;
  - mate-floor safety.
- **Probes**, on scratch clones of main only:
  - Moved pins: name each one. Any value pin, level or NFR bound that moves → STOP to me.
  - Frozen-clock d7/d8 counts on kiwipete and position-6, base vs each candidate form.
  - Nodes at depth 6 against the page's ≤ 1.5 × base.
  - **Predict G6 against "≥ base" (rule A).** If the chosen form is predicted to meet "≥ base", say that the page's "≥ base − 1" clause can be struck. If no form can meet it, say so plainly with the numbers: that clause then goes to the owner with the ADR.
- **Size check:** as cut, or a split.
- Write the `## Design ruling` into the ticket page. Page amendments that BA/PM must make go in your Result as lines.

## Fences
- Work only in your worktree and `<scratchpad>/arch210/`. No `src/` commits.
- No real-clock search, no G2/G5/G6, and no D.
- Never push, force, amend or rebase. Never merge into main. No board edits.
- Records: class and count only (ADR-0049 d4).

## Publish
- Commit on your branch. Seal notes (task `arch-design-ABC-210`) with `at` taken from `date -u`.
- Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Architect/Design, 2026-10-27. Branch `grugops/arch-design-ABC-210` @ `6eeda283` (= `main` `f0c50046` + records; not
pushed, not merged). Worktree `../wt-arch-design-ABC-210`. Probes ran on scratch clones in `<scratchpad>/arch210/`
(`base`; `h`, both forms with probe-only switches; `hd`, the design hardcoded; five planted mutants). No `src/` edit was
committed. No real-clock timing; real-clock deep rows were filtered by name. No G2, G5, G6, game or D.

- **Form: (a), a check extension at the horizon only. `ADR-0051`, PROPOSED** (the owner's to accept). The build may
  proceed; the ALONE reading and the merge wait on his acceptance (reading b). It reverses nothing: `ADR-0024` d4 and
  `src/quiescence.ts:21-24` stand, and form (b) is not built.
  - Why (a): it fixes the stand-pat-in-check error at the leaf, and it is the only form inside `A3`'s 1.5×.
  - Why not (b): `G1` 53/58; `zugzwang.005` lost through d13; unpriced move generations in the shared leaf.
  - Why not every node in check: position-6 `search()` d6 reads 1.69×, and `G1` 53/58.
- **Rulings:**
  - **Limits:** +1 ply only where remaining depth ≤ 0 and the side to move is in check, **at most 1 per line**. A line
    is ≤ root depth + 1, inside `KEY_ARRAY_CAPACITY` 128. `QUIESCENCE_MAX_PLY` is unchanged, and no ply budget is
    needed.
  - **Rule:** the predicate `checkExtensionPlies(position, depth, extensions)` → 1/0, called at node entry in both
    recursions. `extensions` is an argument placed before `afterNull`.
  - **Null move:** confirmed, none in check (`src/search.ts:305`). An extended node has depth 1 < 2, and a null child is
    never in check. LMR is the same (depth 1 < 3). No predicate changes.
  - **Doors:** `searchWithoutCheckExtension` / `chooseMoveWithoutCheckExtension`. `A1`: 300/300 cells node-equal to base.
  - **ADR-0026 door pair:** `ADR-0050`'s door-comparing rows re-point to the new doors (d5 drift ×2, mate floor,
    "changes the work" ×2), so 37 cp stays null move's. `ADR-0026` d9's 118 cp is untouched. `QE-208-c`'s door maps
    grow by two.
  - **Oracle:** d5 on the 190, both recursions: ≥ 90 % within 25 cp, none beyond 174 cp (measured 93.58 % / 94.12 %,
    max 116). 95 % fails the correct build.
  - **Mate floor:** same depth, d5 on the 287: 0 of 189. An extended mate scores the same ply as `leafEndReason`.
  - **`A2`:** five horizon rows at depth 1, the line-length instrument (call-through spies) and a cross-check cap row.
  - **`A3`:** nodes at d6 read 1.054× (kiwipete) and 1.007× (position-6).
- **Moved pins: STOP.** Two shipped-path pins move under every form probed:
  - **P1:** `transposition.test.ts` `ABC-081` `A5` "the fixture bites: at depth 3" (`:513-517`), −485 → 0. Proposed
    route: re-pin per `ADR-0026` d7 to depth 2, −502.
  - **P2:** `search.null-move.test.ts` `ABC-208` `A2` `zugzwang.005` (`:572`, deep): Ne2 at d12, Nxd5 from d13.
    Proposed route: depth 12 → 13. That edits accepted `ADR-0050` d9, so it is the owner's, bundled with `ADR-0051`.
  - **Others:** 2 export lists, 2 `QE-208-c` door maps, 2 red + 3 green re-points.
  - **0 levels, 0 relations, 0 NFR bounds, no `ADR-0026` level.** `G1` 54/58 (= base, no NEWLY line).
- **Frozen-clock, base → design (`chooseMove`, `now: () => 0`):**
  - kiwipete d7 590 489 → 610 577; d8 1 259 463 → 1 302 377 (+3.4 %);
  - position-6 d7 180 941 → 181 191; d8 355 565 → 358 872 (+0.9 %); d9 940 109 → 993 871;
  - other forms in the page's table: every node d8 1 369 820 / 418 255; (b) d8 1 327 228 / 376 904.
- **`G6` against "≥ base", predicted MET** (`UNKNOWN - verify`):
  - kiwipete reaches 8 while cost per node rises < about 20 % (1.30 M needed against 1.57 M in 3 s);
  - position-6 reaches 9 while it rises < about 65 % (0.99 M against 1.65 M);
  - added work: one `isInCheck` at 14.6 % / 18.6 % of nodes, and 0.83 % / 0.97 % of nodes extended;
  - **the page's "≥ base − 1" clause can be struck.** It is stricter, so no owner word is needed (`…828d5794`).
- **Size: `M` holds; no split.** About 100–150 production lines in `src/search.ts` and `src/engine.ts`.
- **Owner (one question):** accept or decline `ADR-0051`, with P2's `ADR-0050` d9 depth change.
- **Orchestrator:** route the STOP (P1, P2) before the build starts; merge the records branch; report `ADR-0051`.
- **BA/PM page lines (no criterion loosened):**
  - `adr:` names `ADR-0051` (reverses nothing);
  - Scope 1: (a) at the horizon only; Scope 3: cap 1, `QUIESCENCE_MAX_PLY` untouched;
  - `A2`: `ADR-0051` d8's rows, (b)'s bullet struck;
  - `A3`: d6 reads `search(position, 6)` against the door; strike "≥ base − 1"; add the drift bars and the same-depth
    mate floor;
  - `A1` is cross-build (QE, out of tree);
  - test note 1: the instrument; test note 3: reads against "≥ base".
- **Notes** (`.grugops/context/arch-design-ABC-210/notes/`): decision `…c5d0e464`, observation `…8e6a40c2`.

**Trace row** (for the Orchestrator):

| ABC-210 (arch-design-ABC-210) | design ruled: form (a) at the horizon only (remaining depth ≤ 0, in check, +1 ply, cap 1 per line); predicate checkExtensionPlies; doors searchWithoutCheckExtension / chooseMoveWithoutCheckExtension; ADR-0050 door rows re-pointed (37 cp stays null move's, 118 cp untouched); oracle d5 ≥ 90 % ≤ 25 cp, max 174 cp, same-depth mate floor; STOP: P1 transposition A5 d3 −485 → 0, P2 zugzwang.005 d12 → d13 (ADR-0050 d9, owner); M, no split | EPIC-008 | low gain on the only evidence (game 1); fixes stand-pat in check at the leaf (5 depth-1 forks/skewers) | NFR-005 G6: frozen-clock kiwipete d8 +3.4 %, position-6 d9 +5.7 %, predicted MET against "≥ base" ("− 1" struck); A3 d6 1.054× / 1.007×; G1 54/58; NFR-004 unchanged | grugops/arch-design-ABC-210 @ 6eeda283 (f0c50046 + records)<br>ADR-0051 (PROPOSED)<br>.grugops/context/arch-design-ABC-210/notes/ (2) | default + deterministic deep lanes on scratch clones; 5 planted mutants; A1 300 cells; frozen-clock d6–d10; d5 drift, mate floor, A2 instrument; no timing | UAT owed at build (QE verdict signs) | Orchestrator routes the STOP (P1, P2); owner accepts/declines ADR-0051 + P2's ADR-0050 d9 change; BA/PM page lines | stays In Design until the STOP is routed; then → Ready for Dev (merge and ALONE reading wait on ADR-0051) |
