---
kind: adr
id: ADR-0050
---
# ADR-0050: Null-move pruning arrives in both recursions at null-window nodes with R = 3, behind a test-only off-door pair. It is guarded below three non-pawn pieces and judged by a bounded oracle at depth 5

## Status

**2026-10-26: in force on `main` from merge `b5c67ab7`** (`ABC-208`, QE PASS `qe-ABC-208/…0477ac64` at `3a87f9d7`;
merge recorded by Orchestrator `orch-2026-10-26q/…836cb92d`). Checked read-only: `git diff 3a87f9d7 b5c67ab7 -- src` is
empty, so the code on `main` is the code QE measured. At `b5c67ab7` the null move is in `src/search.ts`, `src/engine.ts`,
`src/apply.ts` (`makeNullMove` / `unmakeNullMove`) and `src/zobrist.ts` (`zobristKeyAfterNullMove`), and
`grugops/ABC-208` `2e9eb9a7` is an ancestor of `main`. The "until then" sentence and the S1 NOT MET fallback below are
discharged; no "not in force" line is owed. Recorded by Architect/Design (task `arch-adr0050-in-force`, records only).
Nothing else in this ADR moves.

**ACCEPTED** 2026-10-26 by Olger Oeselg (owner), verbatim *"accept ADR-0050, O0 for ABC-211, close LIC-PUB-1"* (note
`.grugops/context/owner-word-2026-10-26/notes/20261026T055855Z-orchestrator-decision-58bcd17c.md`, item 1). This answers
the 2026-10-26 report below. Recorded by Architect/Design (task `arch-accept-adr0050`, records only, at `main`
`ba74b71d`).

- **ACCEPTED; in force on `main` at `ABC-208`'s merge.** Until then the null move is not on `main`. At `ba74b71d`,
  `src/search.ts`, `src/engine.ts` and `src/apply.ts` hold no null move, and `grugops/ABC-208` is not an ancestor of
  `main`. The QE verdict still decides that merge.
- **If `ABC-208` does not merge (S1 NOT MET),** a dated line here records "accepted, not in force on `main`", as
  `ADR-0026` decision 9 does.
- This ADR assigns no § Records or drift rows, so none are applied. Nothing else in this ADR moves.

**2026-10-26: still PROPOSED; reported to the owner.** On 2026-10-26 the Orchestrator reported this text to the owner as
a yes/no (`…749ff988`; carried in `…42479486`). No answer is recorded yet, so acceptance is still the owner's. Recorded by
Architect/Design (task `arch-records-ADR-0050`), on QE `…8c4f3e57` (`QE-208-e`). Nothing else in this ADR moves.

Previously **PROPOSED** 2026-10-26 by Architect/Design (task `arch-design-ABC-208`). **Acceptance is the owner's** (`…5aaf7cec` item
3: a new ADR is his). The Orchestrator reports this text to him (`…7feb0553` item 2) and routes the merge to wait on his
acceptance (`…d25ab770`, reading b). No agent marks it accepted.

- It follows `ADR-0026` decision 10 ("a switch, a pair of doors, off in every older door, a bounded oracle") and cites
  that ADR rather than re-deriving it. **It amends no accepted ADR. No `ADR-0026` level and no NFR bound moves.**
- It is built by `ABC-208`. The probes ran on scratch clones of `main` `93d79b2d`, never on `src/`. No real-clock search
  was run and no timing is quoted. Readings: `.grugops/context/arch-design-ABC-208/notes/` (the observation note),
  cited here, not restated. The ticket page's `## Design ruling` has the row-by-row routes.

## Context

- Null-move pruning lets the side to move "pass". If the opponent, given a free move, still cannot bring the score below
  beta, the node is cut without searching its moves. It changes the VALUE: the cut is a guess. It fails in zugzwang,
  where passing would be the best move and every real move is worse.
- The page (`ABC-208` Scope 2) fixes four guards: not in check, not at the root, not after a null move, and not when the
  side to move has no non-pawn material. It leaves R and any verification search to this ADR.
- **What the probe found** (variants written into scratch clones; all counts deterministic):
  - **Node counts fall at every R.** At R = 3, position-6 needs 73.8 % fewer nodes than base to complete depth 8, and
    kiwipete 27.4 % fewer.
  - **The page's floor guard is not enough.** With null move allowed whenever the side to move has one non-pawn piece,
    `G1` falls from 54/58 to **50/58**: three mate-in-3 rows where the defender holds one knight, and one win-material
    row. The classic zugzwang rows `zugzwang.001`, `.004` and `.005` (base solves each at depths 9, 11 and 12) are lost
    at R = 2, at R = 3 and at an adaptive R, through depth 12.
  - **A two-piece guard is still not enough.** It keeps every mate, but `G1` reads 53/58. Seed 5464 (Black B+P against
    White B+N, key move Bd2) is lost: White, with two pieces, passes in reduced lines, and the c-pawn's threat falls
    below the horizon. Base finds it from depth 5; R = 3 under that guard needs depth 8.
  - **A three-piece guard costs nothing measured.** The kiwipete and position-6 counts at depths 6–8 are identical
    under guards of 1, 2, 3 and 4 pieces. `G1` reads 54/58 with base's four misses. Every zugzwang row base solves is
    solved at base's depth.
  - **Verification searches did not help.** A reduced re-search of the cut node, and a ply-window verification that
    turns null move off for the defending side, each recovered at most `zugzwang.001`, three plies late, and cost nodes.
  - **R = 3 beats R = 2 and an adaptive R** on both boards at depth 8, with the same `G1` and similar drift.

## Decision

1. **One switch, `nullMove`, in BOTH recursions** (`src/search.ts`, `src/engine.ts`), as `ADR-0026` decision 1.
   - It is on in `search()` and `chooseMove`.
   - Null move is tried only at a **null-window node** (`alpha + 1 === beta`), which is where PVS puts every move after a
     node's first. So it lives inside PVS's frame: `nullMove` implies `pvs`, as `reductions` does. A PV node never
     passes, and its beta may be infinite.
2. **Two TEST-ONLY doors, one per recursion: `searchWithoutNullMove(position, depth)` and
   `chooseMoveWithoutNullMove(position, options)`.** Each is the shipped path with null move off and everything else
   on: the pre-`ABC-208` `search()` and `chooseMove`, node for node (`A1`). The engine door takes no depth (`ABC-078`
   `A4`). The export lists of `ABC-077` `A6` and `ABC-078` `A4` grow by these names and by decision 6's predicate.
3. **Every door that exists before `ABC-208` turns null move off** (`ADR-0026` decision 3's ladder rule). Null move is
   the top rung, above LMR. So `searchWithoutReductions` stays PVS on, LMR off, null move off, as before.
4. **Rows.**
   - **`ADR-0026` decision 9's LMR rows re-point their shipped side to the new door of the same recursion:**
     - the d5 drift: `searchWithoutNullMove` against `searchWithoutReductions`, and `chooseMoveWithoutNullMove` against
       `chooseMoveWithoutReductions`;
     - the mate floor's depth-5 side: `searchWithoutNullMove`.

     Because the new door IS the pre-ticket shipped search, these rows read exactly their pre-ticket figures, and **the
     118 cp maximum keeps measuring LMR alone. No bound moves.** Unpointed, they would measure LMR plus null move.
   - **Every other `ABC-121` row whose shipped side is `search()` or `chooseMove` re-points the same way:** the door
     bite, `A4` in both recursions, `A5` and the `A2` clock-free companion. They are LMR's and PVS's criteria. It is
     a mechanical rename, with every value unchanged.
   - Rows elsewhere follow `ADR-0026` decisions 4 and 7 as amended: a row that compares a search with a door reads the
     door; a value or behaviour row on the shipped path stays there and is re-pinned only if it moves. The probe moved
     none.
5. **`ADR-0026` decision 5's drift detectors stay as they are.** `ABC-077` `A1` and `ABC-078` `A3` already read the
   `…WithoutReductions` doors, which turn null move off.
6. **The rule is ONE exported pure predicate in `src/search.ts`: `nullMoveReduction(position, depth, ply, afterNull)`.**
   Both recursions call it and subtract exactly what it returns. The null child is searched to `depth − 1 − R`.
   - **It returns R in plies, 3, or 0 for "no null move".** It returns 0 when any of these holds:
     - `ply` is 0 (the root);
     - `afterNull` is true (the parent move was a null move);
     - remaining `depth` is below 2;
     - the side to move is in check;
     - **the side to move has fewer than three non-pawn pieces** (knights, bishops, rooks and queens).
   - It derives check and material from the position. The caller passes only depth, ply and whether the parent move
     was a null move. This is `ADR-0026` decision 6's contract.
   - **Why three pieces:** see Context. It is the smallest guard that keeps `G1` and every zugzwang row base solves,
     and it is no costlier on the `G6` boards than a guard of one. It implies the page's floor: with no non-pawn
     material there is no null move. So `A2`'s second bullet holds.
7. **The null move itself.**
   - `makeNullMove(position)` and `unmakeNullMove(position, undo)` go in `src/apply.ts`, beside `makeMove`. The null
     move flips the side to move, clears the en-passant square, and **resets the halfmove clock to 0**, so the
     repetition scan never reaches across a pass. The fullmove number moves as `makeMove` moves it.
   - `zobristKeyAfterNullMove(keyBefore, undo)` goes in `src/zobrist.ts`: the side key, plus the en-passant file if
     one was set. This is `ADR-0020` decision 3's delta pattern, and it carries that module's invariant against
     `zobristKey`.
   - The null child is searched with the window `(−beta, −beta + 1)`. If it scores at least beta, **the node returns
     beta**. It never returns the null score itself, because a mate found after a pass is not a mate. It stores no
     table entry. Otherwise the node is searched as before.
   - **No verification search.** No state is held between nodes: the null flag is an argument. So `G7` is not owed.
     The clock is checked inside the null subtree as anywhere else (`NFR-004`).
8. **The bounded oracle (`A3`).** Its clauses:
   - **Centipawn drift at depth 5, in BOTH recursions, on `ABC-121`'s 190:** `search()` against `searchWithoutNullMove`
     at fixed depth 5, and `chooseMove` against `chooseMoveWithoutNullMove`, each iterated to depth 5. **At least 95 %
     of non-mate positions within 25 cp, none beyond 37 cp** (⌊1.5 × 25⌋, the measured maximum with `ADR-0024`
     decision 3's headroom). Measured: 100 % / 25 cp and 100 % / 8 cp.
   - **A same-depth mate floor on the 287 mate corpus:** for every position `searchWithoutNullMove` scores as a mate at
     depth 5, `search()` at depth 5 scores a mate of the same sign, no longer. Measured: 0 of 189. Unlike LMR's floor,
     no extra ply is needed.
   - Mate-status flips on the 190 are a report, not a bar.
   - **Scope, said plainly: this oracle is a regression net for gross faults, not a proof of the rule.** On the 190,
     R = 3, 4 and 5 give identical scores at depth 5 and at depth 6. Null move in check, a second null move in a row,
     a missing halfmove reset and a returned mate score all pass it too. Those are caught row by row (Consequences).
     Do not tighten 37 cp to chase them.
9. **`A2`'s zugzwang rows.** Each is searched with `chooseMove` on a frozen clock at its own fixed depth (≥ 8, the depth
   base solves it). Each must play the recorded move:

   | row | FEN | move | depth | source |
   |---|---|---|---|---|
   | `zugzwang.001` | `8/8/p1p5/1p5p/1P5p/8/PPP2K1p/4R1rk w - - 0 1` | Rf1 | 9 | CPW "Null Move Test-Positions" |
   | `zugzwang.004` | `8/6B1/p5p1/Pp4kp/1P5r/5P1Q/4q1PK/8 w - - 0 32` | Qxh4 | 11 | the same |
   | `zugzwang.005` | `8/8/1p1r1k2/p1pPN1p1/P3KnP1/1P6/8/3R4 b - - 0 1` | Nxd5 | 12 | the same |
   | `kpk-b6c6` | `2k5/8/1K6/2P5/8/8/8/8 w - - 0 1` | Kc6 | 8 | Lichess Syzygy tablebase: the only winning move |
   | `kpk-c6d6` | `3k4/8/2K5/3P4/8/8/8/8 w - - 0 1` | Kd6 | 8 | the same |
   | `kpk-d6e6` | `4k3/8/3K4/4P3/8/8/8/8 w - - 0 1` | Ke6 | 8 | the same |
   | `kpk-e6f6` | `5k2/8/4K3/5P2/8/8/8/8 w - - 0 1` | Kf6 | 8 | the same |

   - The three CPW rows keep non-pawn material, so they test the material guard. Under decision 6 they are decided by
     the guard, not by R: no classic zugzwang row has three pieces on the defending side. R is judged by `A3` and `G1`.
   - Stockfish 19 at depth 26, run on its own and forced to score the recorded move, corroborates each CPW move: Rf1
     +258 (also its root choice); Qxh4 +671 against 0.00 for its root choice; Nxd5 0.00 against −45. `zugzwang.005`'s
     label is the suite's best move, not a proven unique win.
   - Considered and not taken: CPW `zugzwang.002` (no variant misleads it, so it bites nothing) and `zugzwang.003`
     (base does not solve it by depth 12).
   - The second bullet's instrument is a call-through module mock of `src/apply.ts` (the `vi.mock(path, { spy: true })`
     pattern). It records, at every `makeNullMove`, whether the position is in check and how many non-pawn pieces its
     side has. No production counter or hook is added.

## Alternatives

- **The page's floor guard alone (no non-pawn material).** Rejected by measurement: `G1` 50/58, and three zugzwang
  rows lost.
- **A two-piece guard.** Rejected by measurement: `G1` 53/58 (seed 5464).
- **A four-piece or stronger guard.** Not needed: no reading separates it from three, and it gives up more endgame
  pruning.
- **R = 2, or R = 2 rising to 3 at depth ≥ 7.** Same `G1` and A2, similar drift, more nodes: position-6 d8 needs
  505 644 nodes at R = 2 against 355 565 at R = 3.
- **A verification search** (re-search the cut node at reduced depth, or turn null move off for the defending side
  over a ply window). Rejected by measurement: neither recovers `zugzwang.004` or `.005`, and both cost nodes.
- **"Static eval ≥ beta" as a further condition.** It saves 3–8 % of nodes at depth 8, but it adds an evaluation per
  candidate node, which a frozen clock cannot price. Not needed for `G6`'s margin.
- **Null move at every node with a finite beta.** Measured identical on the 190; rejected as the larger rule.
- **Leave decision 9's LMR rows on `search()`.** Rejected: they would measure LMR plus null move. They read 63 cp
  today either way, but a later rise could not be attributed.

## Consequences

- **Rows the build adds, and what each one reds** (planted on a scratch clone):
  - the predicate's table: R exactly 3, the five zero cases. It reds R ≠ 3, a missing check, root, double-null or
    material guard, and a guard of the wrong size;
  - a source row that both recursions call the predicate, gate on `alpha + 1 === beta`, subtract its value and return
    beta (the null-everywhere and mate-score variants pass every other row);
  - null-move unit rows: make and unmake leave the position byte-identical, the halfmove clock is 0 after the null
    move, and `zobristKeyAfterNullMove(zobristKey(before), undo) === zobristKey(after)`;
  - `A2`'s seven rows: the no-guard variant scores 0/7, the floor guard 4/7 and the two-piece guard 5/7;
  - the d5 drift: a null move that cuts without searching reads 42.78 % / 790 cp, and a sign error 41.71 % / 644 cp;
  - the mate floor: the no-guard variant violates 60 of 189;
  - `G1`: the no-guard variant reads 49/58, the floor guard 50/58 and the two-piece guard 53/58.
- **Named blind spot:** returning the null score instead of beta passes every row except the source row. Its drift
  against the door stays inside the bars: at most 19 cp (`search()`) and 34 cp (`chooseMove`) at depth 6.
- **Gains are concentrated in the middlegame.** Endgames with fewer than three pieces a side search as before. That is
  deliberate: there, a pass is most often the best move.
- **The `G1` miss class stays B** for this diff (`ADR-0034` decision 2). `src/apply.ts` and `src/zobrist.ts` join the
  diff; neither changes that class.
- No dependency, data or format changes.

## Rollback

- Delete the switch, the predicate, the two doors and the null-move helpers. Point the re-pointed rows back at
  `search()` and `chooseMove`. They read the same values, because the doors were the pre-ticket search.
- No stored data, format or dependency depends on this ADR.
