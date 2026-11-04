# arch-ABC-283-accept decision: R-283-LMR is carried in ADR-0063 and ADR-0060 (the lever is LMR, not history); QE-283-c is a dated line under ADR-0066 d9 (no committed row finds a mate at exactly iteration 5; d9 holds)

Architect/Design, task `arch-ABC-283-accept`, records only. Nothing was run. Sources: `orch-2026-10-30a` `…6c6fb0be` (R-283-LMR), `…c7609f51` 1 (re-pin 2), `…2409cec9` 4; `qe-ABC-283` gaps `…f8f8c2cc` (QE-283-b, QE-283-c) and offline note `…3f370426`; `arch-ABC-283-mate` `…05ef9fc9`; `se-ABC-283-k3` (re-pin 2's cause).

## R-283-LMR (QE-283-b, LOW), carried, not graded
- **The readings:** the d5 floor bar is met, 0 / 190 (`search()`) and 0 / 188 (`chooseMove`), against the all-off doors and base `main`; QE's fresh seeded KRK / KQK probe reads 0 / 16 and 0 / 16. At d6 (a report) `chooseMove` loses 2 / 209 on the 287, the same two rows base `main` loses, and 1 / 30 on the fresh probe (a KQK row).
- **The mechanism** (`…05ef9fc9`): a mating quiet move pushed late is reduced by LMR, the reduced search scores ≤ α, and there is no re-search. It predates history (the reversed-quiet-tier door loses 6 / 190; LMR off loses 0).
- **The rule written:** if a later change turns the d5 floor red again, the lever is LMR (`ADR-0060`), not history; the history key stays K3's max(0, h). A P1 re-open (`ABC-284`) reads d5 as the bar and d6 as a report, over the history table on `main`.
- **Where:** `ADR-0063` § Status (the acceptance block) and `ADR-0060` § Status (a dated line, newest first), which is where `ABC-284`'s `adr:` says a re-open is recorded. Owner: Architect/Design.

## QE-283-c (LOW), a dated line under ADR-0066 d9
- Under K3 the KRK mate row finds its mate at iteration 6, not 5 (re-pin 2, accepted as a pin). The bar "iteration 5 or later" holds; the FEN, c5c6, MATE − 5 and door equality are unchanged.
- No committed row now finds a mate at exactly iteration 5, so the iteration-5 fail-high path is not exercised for a mate. The non-mate row still fails high at 5.
- A mate-at-iteration-5 row is optional, for the Software Engineer on a later touch. It is not owed before the merge, and no bar moves.
