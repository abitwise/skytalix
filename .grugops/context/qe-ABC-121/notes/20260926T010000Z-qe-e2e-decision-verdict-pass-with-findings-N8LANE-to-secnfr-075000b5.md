---
id: 20260926T010000Z-qe-e2e-decision-verdict-pass-with-findings-N8LANE-to-secnfr-075000b5
kind: decision
by: qe-e2e
at: 2026-09-26T01:00:00Z
verified_by:
confidence: high
refs:
  - ABC-121
  - ADR-0026
  - N8-LANE
  - NFR-005
  - grugops/qe-ABC-121
supersedes:
---

# QE verdict on `ABC-121`: PASS WITH FINDINGS

Hand-authored, no `seal` — no sanctioned writer on this install (`AGENTS.md`); no
`§14-gate#<id>` exists to cite.

## Verdict: PASS WITH FINDINGS

All six acceptance criteria (`A1`–`A6`) independently reproduced at HEAD (`312a188` on
`grugops/ABC-121-pvs-lmr`, merged through the G6 ruling). No re-pointed row found moved. Five of
23 planted variants re-applied by hand and confirmed red; the rows not re-applied were already
independently ledgered by two separate hops (`…7f29f842`, `…17a0830d`) whose figures this QE
hop's spot checks corroborate wherever checked. The default gate (`npm test`, lint, typecheck,
skip-integrity) is green. Two items are findings, not blockers, both already named by the build
and handed up correctly:

1. **`N8-LANE` NOT MET** (+1 415 ms net against 650 ms after placement) — out of this ticket's
   fence per the queue subtask ("`N8-LANE`... is Security/NFR's to rate — report only"). Not
   re-measured by QE; the build's own two independent readings (`…24e3648a`, `…e4d6fcc8`) are
   taken as reported.
2. **The `A4` `chooseMove` saving** ruled safe but not applied (`…b2f12ced`) — an optional
   follow-up, not a defect.

No FAIL-level gap found. `NFR-005`'s WARN-level ruling and the `N8-LANE` residual are for
Security/NFR; this hop does not gate on either.

## Gaps (not FAIL, named honestly)

- **The G6 ruling and `pvsNoResearch`/mate-floor ADR erratum are PROPOSED text, not yet folded
  into `ADR-0026`.** QE confirmed the Engineer applied the ruling's required comment change
  verbatim; the ADR document itself is unamended pending the owner's acceptance — outside this
  hop's fence (no `plans/nfr-catalog.md`, no ADR edits).
- **18 of 23 planted variants were not re-applied by this QE hop**, relying on the build's own
  two ledgers (build-time and lane-re-hop-time) rather than a third independent run. The five
  re-applied (`tactical`, `r2`, `noLmrResearch`, `pvsNoResearch`, `noResearch`) are the ticket's
  named minimum and cover every review-named variant; the remaining 18 are wiring/clause
  variants whose ledger figures were internally consistent across both prior hops.
- **`A2`'s depth reading is one machine, one QE hop, at a lower load (3.2–3.4) than either build
  reading (4.2–5.7, 16–32).** The depth bar (7 vs 6) held at this load too; no cross-machine
  reading exists, same caveat the build itself names.
- **The queue claim is a bare `mkdir` in this worktree**, same caveat named by the build
  (`…82816ae6` item 9) — it does not exclude a claimant in another checkout.

## Fences held

Zero lines committed under `src/` by this hop — every planted-variant edit was reverted
byte-for-byte and `git status --short -- src` read empty after each revert and again at the end
of this hop's work. No edit to `plans/board.md`, `AGENTS.md`, `plans/nfr-catalog.md`, or any
ADR. Never merged, never pushed.
