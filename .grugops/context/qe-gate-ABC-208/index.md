<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: qe-gate-ABC-208

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-26T03:59:49Z | decision | qe-e2e | high for the static verdict, the A1 ruling and the findings (deterministic, run by QE at ddc307a9); the real-clock criteria are UNKNOWN - verify until qe-ABC-208; ADR-0050 is PROPOSED and the owner's |  | # QE/E2E static gate ABC-208: GATE PASS (static part) at `ddc307a9`. A1 MET (5 053/5 053 cross-build cells), A2 7/7 MET, A3 MET, G1 54/58 and G4 MET; the 14 moved rows are exactly the ruled set; 5/6 ruled (A1 met as written); 2 MEDIUM and 1 LOW test gaps owed before merge; the real-clock reading is qe-ABC-208's |
| 2026-10-26T03:59:49Z | observation | qe-e2e | high: deterministic cross-build and frozen-clock counts at ddc307a9 against main ef9711ec; no real-clock reading |  | # QE/E2E static gate ABC-208, the criteria evidence: A1 cross-build 4 795/4 795 + 258/258 with bite counts; frozen-clock pre-check (8 counts, base vs head); A2 7/7 with an independent KPK bitbase; A3 = ruling; a false-mate probe 0; G1 54/58. No real-clock timing |
| 2026-10-26T03:59:49Z | observation | qe-e2e | high: cross-runs and plants on scratch copies, each restored and cmp-verified; deterministic lanes only |  | # QE/E2E static gate ABC-208, the 14 moved rows cross-run both ways (exactly the ruled set; printed readings equal base's line for line), 30 default-lane plants (24 bite, 6 survive), the ADR's deep figures reproduced, and the survivors classed: two real gaps, three doors seen only out of tree, the named blind spots |
| 2026-10-26T03:59:49Z | observation | qe-e2e | high: gates as run at ddc307a9 on a shared host; durations are not readings |  | # QE/E2E static gate ABC-208, the gates at `ddc307a9`: lint, typecheck, build 0; npm test 63 files 2 123/2 123; skips 0, No findings.; lane inventory 63 = 63; SEARCH_DEEP (null-move lane included), ENGINE_DEEP deterministic rows and PUZZLE_DEEP all green; 10 real-clock rows filtered by name and not run |
