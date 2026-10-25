---
subtask: arch-design-ABC-207
role: architect-design
ticket: plans/tickets/ABC-207-mobility-is-weighted-per-piece-and-an-early-queen-trip-costs.md
ref: .grugops/context/arch-design-ABC-207/
branch: new grugops/arch-design-ABC-207 from main (5c91e2e4), worktree ../wt-arch-design-ABC-207
width: 1 of 2 agents (same Architect as arch-adr0048-status; no real-clock timing, no G6, no games)
---

# Design ABC-207: per-piece mobility weights + early-queen term (ruling before build)

## Do
- Same pattern as `arch-design-ABC-215` (`…e04234f4`). On `main` `5c91e2e4` (ABC-215's rule-made values), rule:
  - the per-piece weights (queen lowest per square) and the early-queen term's form and size, inside ADR-0031 D2's attack-map form and the ±100 cp mobility cap (A1–A3). A form change → STOP: it is an ADR-0031 change for the owner.
  - G2 by construction (≤ 1 100 ns), stated `UNKNOWN - verify`.
  - Moved-pin probe: run head-as-designed against main's tests on a scratch clone. List every row that moves, with its route (re-pin / ADR-0028 d2 re-find / oracle rule). Any ADR-0026 level or NFR bound move → STOP.
  - The page's Test note 4 frozen-clock d7/d8 node counts (kiwipete, position-6; base and head). Predict G6 for the record only.
  - Size check (S; split if it grows).
- Write the ruling into the page's `## Design ruling` section.

## Fences
- Only your worktree, scratch clones and `<scratchpad>/arch207/`. No product code is committed. Default and deterministic deep lanes only; no real-clock rows. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-design-ABC-207). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

Architect/Design, 2026-10-25, branch `grugops/arch-design-ABC-207` @ `a5981552` (= `main` `0e2358ce` + records; not
pushed, not merged). `src/` at `0e2358ce` = `5c91e2e4`. Records plus probes on scratch clones in `<scratchpad>/arch207/`
(`base`, `h` = head as designed, `w` = weights alone, `q` = queen term alone). No `src/` edit, no real-clock timing
(real-clock deep rows filtered by name), no `G6`, no games, no D.

- **Ruling:**
  - weights by `pieceType` `[0, 0, 4, 4, 2, 1, 4]`: N 4, B 4, R 2, Q 1, with the king unchanged at 4 (flagged, out of
    scope). Rule: the minors keep 4, the rook gets ½ and the queen ¼;
  - early-queen term: **25 cp (¼ pawn)** per side, charged while that side has a queen off d1/d8 **and** ≥ 2 of its
    four minors are home. The condition is the cut-off; no phase counter;
  - both stay **inside `ADR-0031` decision 2's attack-map form and the ±100 cp clamp: no ADR change, no STOP.**
- **`A1`/`A2`/`A3` premises on head:**
  - `A2` term −25 / 0 / 0, and `evaluate` −7 on the minors-home pair;
  - a lone queen's mobility is 27 cp (clamp off);
  - mirror 12/12;
  - relations all green and unedited.
- **`G2` by construction:** base 642.6 / 641.2 ns. The additions are ≤ 16 array reads and multiplies, ≤ 16 compares
  and ≤ 2 four-square reads, so tens of ns. `UNKNOWN - verify`.
- **Moved-pin set: 12 rows in 4 files, 0 relations, 0 levels, 0 NFR bounds.** Default lane: 9 reds (`ordering`,
  `pvs-lmr`, `transposition`). Deep: 3 in `quiescence`. Routes:
  - re-pin: 10 rows;
  - `ADR-0028` d2 re-find: `pvs-lmr` `A4` `search()`, premise lost (10 against 2);
  - the oracle rule: kiwipete 8 → 20 / e2a6, position-6 85 → 78 / c3d5, re-run equal.

  `w` carries all 12, and `q` carries 0. Levels: multiplier cells all fall (position-6 d1 8.96 → 4.19x of 10); d5
  drift max 63 → 45 cp (≤ 75); `G1` 54/58.
- **Frozen-clock d7/d8, base → head:**
  - kiwipete d7 609 900 → 602 091; d8 1 735 339 → 1 700 946;
  - position-6 d7 586 333 → 469 639; d8 1 355 149 → **1 111 000 (−18.02 %)**.

  Base straddles no depth (`…a34270bf`: position-6 8 ×5 at 1.464–1.470 M nodes, kiwipete 7 ×5). **Predicted `G6`
  MET** (7 = 7; 8 ≥ 8) while head's throughput cost is under about 24 %. This is for the record, `UNKNOWN - verify`.
- **Size: `S` at its upper edge; no split.** About 25 production lines. A split would put all 12 rows in the weights
  half and add a second D. BA/PM may relabel it `M` if it chooses.
- **ADR / owner word: none.**
- **Notes** (`.grugops/context/arch-design-ABC-207/notes/`): decision `…a21b7cc9`, observation `…439d6f8c`.

**Trace row** (for the Orchestrator):

| ABC-207 (arch-design-ABC-207) | design ruled: weights N4 B4 R2 Q1 (K4), early-queen 25 cp while queen off home and ≥ 2 minors home; inside ADR-0031 D2 form and ±100 cp clamp; 12 pins move in 4 files by re-pin / ADR-0028 d2 re-find / oracle rule; no level, no bound; S, no split | EPIC-008 | fewer early queen trips and space grabs (4.Qa4, 8.e5) | NFR-005 G6: frozen-clock position-6 d8 −18.02 % (predicted MET); G1 54/58; d5 drift max 45 cp; multiplier cells under level; G2 by construction (UNKNOWN - verify) | grugops/arch-design-ABC-207 @ a5981552 (0e2358ce + records)<br>.grugops/context/arch-design-ABC-207/notes/ (2) | default + deterministic deep lanes on 4 scratch clones; frozen-clock d6–d8; oracle re-run; A1/A2 premises; mirror 12/12; no timing | UAT owed at build (QE verdict signs) | Orchestrator merges records, then In Design → Ready for Dev | In Design → Ready for Dev |
