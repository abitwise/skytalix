# se-ABC-301-s0 observation: three lines the next hops owe. P1's written form needs a dated line; two ABC-271 rows go red at any fit and are not on the retire list; the fit's cost with E4a's rows is unread

Nothing here blocks scope 0, and none of it was edited: the ticket, the ADRs and the board are outside this hop's fence.

1. **Architect / BA-PM: P1's form.** `ADR-0070` d4's dated line, `ADR-0067`'s precondition and ticket P1 all spell `evaluateAtPhase(p, 0)` on 44 / 44, which reads 31 / 44 on the build. The row built is the own-phase form (decision note). If QE grades P1 as written it reads red. A dated line naming the form is owed, or a ruling against it. Bar level: unchanged, exact on 44 / 44.
2. **The fit hop, QE and the ticket's test note 4.** Two rows of `src/evaluate.passer.test.ts` pin the shipped E4a values at 0 and go red as soon as a fit frees KD and FP: "PASSED_KING_ENEMY, PASSED_KING_OWN, PASSED_FREE: by own rank in PASSED's shape, every half 0", and "at the shipped values (every half 0) every part is 0 on every fixture". Test note 4's retire list ("exactly those named") does not name them, and they are neither `ADR-0067`'s named rows nor plainly B-T4 pins. A ruling is owed before scope 4. The K1 (b) literals are pins by d6's line. The new P1 row is written to survive the fit and needs no change.
3. **The fit hop: cost.** `rows.jsonl` now reads 271 MB, with 492 759 rows carrying E4a pairs. The extract peak held at 1 527 MiB, inside the 3 000 MB flag. The fit's time and heap with E4a's terms freed are `UNKNOWN - verify`.

Also still open by the brief: `QE-271-f` is the PREREG's line, and scope 1's bound-set enumeration is not built.
