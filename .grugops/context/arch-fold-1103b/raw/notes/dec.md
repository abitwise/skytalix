# arch-fold-1103b decisions: `ADR-0067` gains F8, E2-pre's (`ABC-274`) falsifier and disposition, with the Orchestrator's ruling `…690d3b30` folded at d8 (S2 nps reported only; `G2` ≤ 1.05 × and `G6` "≥ base" graded against the pre-ticket head). `ADR-0064` F3's cut C1 is an incremental phase, not the packed score: `ABC-274`'s scope stays whole and the packed form stays recommended, on a stronger reason. `ADR-0056` row E2 → `ADR-0067`, Q-3K-7 split (a) / (b) / (c) pending, D6 Phase 4 order. `ADR-0064` d4 / d6 pointers. No bar loosened; owner items pending

Architect/Design, task `arch-fold-1103b`, records only, on `grugops/arch-fold-1103b` from `main` `239ac715` (`src/` tree `58fa3eb4`). Nothing run, built or timed. Inputs: `bapm-E2pre-cut` `…a193625d` / `…36f388c6`, `orch-2026-10-30a` `…690d3b30`, `arch-ABC-239` `…e4c34239` § 3–§ 5, `arch-ABC-269-F3` `…a0468a78` / PREREG `…e36ee7ca`, `se-ABC-269` `raw/out/g2-variants.txt`, and the `ABC-274` page (A1–A8).

## 1. `ADR-0067` (Status bullet, three Decision-log rows, a dated d8 block, row F8)
- **F8 (the disposition row, verbatim in the ADR):** clause 8, E2-pre is value-identical and cheap.
  - **Fires on:**
    - (a) `ABC-274` A1 / A2 / A4 / A7: a node, score or move mismatch against the pre-ticket head, an `Object.is` miss, or a test expectation that has to move;
    - (b) A5: `G2` above 1.05 × the pre-ticket head (the mean of two sessions, `ADR-0031` d3);
    - (c) A6: a `G6` board's median depth below the pre-ticket head's, or any run below depth 6.
  - **If it fires:**
    - (a) is a defect: fixed before any cost bar is read, never re-pinned.
    - (b) or (c) is a STOP to Architect/Design. One value-identical cut is allowed, then one re-read of the bar that missed, under a PREREG sealed before the re-read. The cut is the packed score if the build is not packed. If the build is already packed, the Architect names the cut. A second miss means not merged. No value is tuned to pass, and no bar moves. `ABC-239`'s A3 / A4 then cannot hold as written, and its re-plan needs a new dated decision in `ADR-0067`, plus the owner's word for any bar it changes.
    - S2 nps is reported, never graded.
- **The ruling, folded:**
  - `ABC-274` is exempt from S2 nps (reported only), as `ABC-265` was.
  - `Q-3K-4` (b) does not apply. `G6` "≥ base" is graded as each board's median ≥ the pre-ticket head's, with every run ≥ 6.
- **The `G2` base:** the pre-ticket head (`main` with `ABC-269` and C1), as the page defines it.
  - The instrument is PREREG `…e36ee7ca`'s shape: each build's shipped tapered entry, called `ev(position, phase)`, with a pre-ticket-head copy as the noise control.
  - The ratio against `58fa3eb4` is reported, not graded. It shows the cost E1 and E2-pre add together.
## 2. Does C1 change `ABC-274`'s recommended form? No. It strengthens it
- **Scope:** BA/PM's coupling clause ("if F3's cut is the packed score, part of scope 2 lands in `ABC-269`") does not fire, so `ABC-274`'s scope stays whole. d8's "That is the cost cut `ADR-0064` F3 names" is marked history: the packed score is E2-pre's own form.
- **Cost:** one per-piece operation added to the walk cost about 7 % on `ABC-269` (1.067–1.112 against v2's 1.0032).
  - An unpacked delta form adds that kind of operation for every piece, so it is forecast to miss A5.
  - A packed entry keeps `main`'s one read and one add per piece.
  - v8 / v9 (1.07) packed the phase into the mobility sum, not a table entry, so they are no reading of this form.
  - The packed form's cost is `UNKNOWN - verify`. A5 reads it.
- **C1 kept:** the phase stays an argument, no phase add returns to the walk, and C1's P5 stays green. The king's Δ may come from the packed sum (the Engineer's call, inside A1 / A2).
- **A condition on the packed form:** an int16 range row computed from `src/evaluate-params.ts`'s own maxima. It exists so that `ABC-239`'s emitted set turns red instead of overflowing silently. It moves no expectation.
## 3. `ADR-0056` (Status fold block, dated lines at D2, D6 and D7)
- **D2:** row E2 → `ADR-0067` (PROPOSED), with the prototype figures and `ABC-274` first. Row E3 gets the king-table signal as information. It is stated the right way round: E1's tables weight the king about 3 × too lightly (`…690d3b30` item 2).
- **D6 item 5, as worked:** `ABC-269` → `ABC-274` → `ABC-239` → `ABC-270` / `ABC-271` (with the stall clause), `ABC-272` any order after E1, `ABC-273` after E1.
- **D7:**
  - Q-3K-7 split into (a) Lichess CC0 for training, recommend yes; (b) a Stockfish-labelled set, recommend no; (c) games against Stockfish, recommend no. Each has a default, and each is pending.
  - `ADR-0067` acceptance and B-T8 (recommend yes) are added, both pending.
  - Still open: Q-3K-6, Q-3K-7 (a)–(c), Q-3K-8, Q-3K-9.
## 4. `ADR-0064`
- A d4 pointer: E2's method ADR is `ADR-0067`, which owns the provenance header.
- A d6 pointer: the two-accumulator form is cut as `ABC-274` under `ADR-0067` d8 / F8.
- The F3 block written by `arch-ABC-269-F3` is untouched. No bar text changed.
## Owed elsewhere
- **BA/PM:** fold lines on the `ABC-274` page.
  - DoR row 10's falsifier half is now met. Row 10 stays ❌ until `ABC-269` merges.
  - S2 is ruled (reported only).
  - The coupling clause is resolved: C1 is not the packed score.
  - The int16 range row is a condition on the packed form (scope 2 / A7).
  - The `G2` base wording (A5), PREREG `…e36ee7ca`'s instrument shape.
- **Orchestrator:** none new. Owner items (`ADR-0067` acceptance, Q-3K-7 (a) / (b) / (c), B-T8, Q-3K-9) stay pending.
