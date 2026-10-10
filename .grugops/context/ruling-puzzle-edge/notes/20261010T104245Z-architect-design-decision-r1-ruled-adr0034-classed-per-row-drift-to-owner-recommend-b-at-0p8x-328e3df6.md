---
id: 20261010T104245Z-architect-design-decision-r1-ruled-adr0034-classed-per-row-drift-to-owner-recommend-b-at-0p8x-328e3df6
kind: decision
by: architect-design
at: 2026-10-10T10:42:45Z
verified_by:
confidence: high
refs:
  - ABC-127
  - ABC-083
  - ABC-087
  - ABC-084
  - ABC-126
  - RISK-003
  - AR-PUZZLE-EDGE
  - ADR-0034
  - ADR-0028
  - ADR-0031
  - ADR-0032
  - ADR-0026
  - memory-bank/50-decisions/ADR-0034-a-puzzle-red-on-an-evaluation-ticket-is-classed-per-row-and-only-budget-drift-goes-to-the-owner.md
  - 20261010T104245Z-architect-design-observation-r1-depth-signatures-and-drop-arithmetic-w14-only-loss-dde9adf4
  - .grugops/context/secnfr-ABC-127/notes/20261010T102852Z-security-nfr-decision-abc127-pass-with-risks-a7-met-guards-hold-budget-edge-red-expected-at-abc083-2468e396.md
  - .grugops/context/qe-ABC-127/notes/20261010T094235Z-qe-e2e-decision-abc127-verdict-pass-with-gaps-affa3970.md
supersedes:
---

# Security/NFR `R1` on `ABC-127` ruled in `ADR-0034` (proposed). A red stays a QE FAIL and is classed per row: **D** drift goes to the owner, **L** label goes to `ADR-0028` d2, **B** behaviour goes to the Engineer. **Recommended to the owner: (b) at a 0.8x margin**, dropping four rows (58/62 → 54/58). (c) is rejected

This note is hand-authored. The ADR is the authority, and the evidence is `…dde9adf4`. This is the summary the next
hop reads first.

## Ruled (Architect/Design's; owner acceptance of the ADR owed)

- **No change to the rules.** The gate, the baseline, option B's trigger list and red = QE FAIL are all
  untouched.
- **Scope.** The rules apply only to evaluation-only diffs: every trigger-list file touched is
  `src/evaluate*.ts`. On any other diff every missed row is class B, because search weakenings read like drift.
- **How QE classes each `NEWLY-MISSED` row.** QE compares the per-row lines of base and branch. It then re-runs
  the gate row out of tree at **+5 / +10 / +25 % readings**, by changing `stepMs` in a copied baseline file.
  - **D (budget drift):** the row is solved at some rung up to +25 %, at depth ≥ base's. It goes **to the
    owner**, with the rung and, on `ABC-083`, `A9`'s nodes to depth 7.
  - **L (label margin):** a `win-material` or `do-not-hang` row still missed at +25 %, at depth ≥ base's. It goes
    to **`ADR-0028` decisions 1 and 2**: prove not-a-defect, then re-find the row in its own commit, with no
    baseline move and no owner word.
  - **B (behaviour):** anything else, or another deep row red. It goes **to the Engineer** under `ADR-0028`
    decision 1.
  - **Order:** B, then L, then D. Only the D rows that remain reach the owner.
- **A puzzle red never cuts a term, re-weights, or moves an `NFR` level.** It is not an `ADR-0031` cut trigger.

## Recommended (the owner's word)

**(b) at 0.8x.**
- **The rule:** a gating row must be solved at 0.8x the recorded readings.
- **Today:** drop seeds 1982, 1008, 1424 and 1075. The baseline goes 58/62 → **54/58**, in its own commit
  citing his word.
- **What it buys:** each retained row tolerates about 25 % tree growth. E1, E3 and E4 turn green, and E2/E5's
  remaining reds are on win-material rows.
- **What it costs:** **`W14` survives again**, so `A3` reads 14/17 red. `ABC-127`'s bars still hold.
- **Shape:** an `XS` follow-up cut by BA/PM after `ABC-127` merges, ordered against `ABC-126`.

**The other choices put to him:**
- **(b) at 0.9x:** drop three rows and keep 1075. The baseline is 55/59, `W14` stays red, and the margin is
  10–15 %.
- **Decline (b):** decisions 1–4 still hold. D reds reach him on each evaluation ticket, and `AR-PUZZLE-EDGE` is
  his to accept.

## Hand-offs (each with an owner; nothing edited here)

- **Orchestrator.** Put decision 5 and the ADR to Olger Oeselg before `ABC-083` is pulled into
  `In Development`.
- **BA/PM.**
  - If (b) is taken, cut the `XS` re-cut.
  - Fold the stale "40/40" text in `ABC-083` `A10` and `ABC-087` `A3`.
  - Fold `ADR-0034` into `ABC-083`'s Dependencies line on the puzzle trigger.
- **QE.** Apply decision 3's table at the first option-B run that goes red on an evaluation ticket, and on green
  runs with a `NEWLY-MISSED` line (QE-127-d).
- **Security/NFR.** Word the `RISK-003` catalog line (their proposal item 2) with the 0.8x figure, if the ADR
  is accepted.
- **AGENTS.md Scribe.** If (b) is taken, the `PUZZLE_DEEP` comment's `S/T` changes from 58/62 to 54/58.
- **`ABC-087` (`UNKNOWN - verify`).** The level module's filename decides whether option B runs at all. Under
  `ADR-0032` its search runs outside the runner's `chooseMove`.

## Fence kept

- Nothing was written under `src/`, nor to `plans/board.md`, the baseline file, any ticket page,
  `plans/nfr-catalog.md` or `AGENTS.md`.
- No deep or timing lane was run, since the `ABC-119` and `ABC-130` QE hops were measuring.
- Nothing was merged or pushed.
