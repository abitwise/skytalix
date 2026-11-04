# qe-ABC-301-s0 gaps: none blocks the fit. QE-301-b MEDIUM (the emitter's E4a columns are read only at 0), QE-301-a LOW (no behaviour row above phase 5), QE-301-c LOW (the guard's reach), three INFO lines, one QE slip owned

Each gap names its owner. None is a defect in the build, and none moves a bar.

- **`QE-301-a` (LOW, non-blocking; the fit hop): no behaviour row reads the hot path above phase 5.**
  - The 44 fixtures hold phases 0–5. H5 (E4a dropped at phases 6–23) and H6 (U fired at phase 6, hot path only) pass the P1 row. In the lane each is red on a source-text pin only.
  - The lane read covers 64 of 71 files: seven failed to load on the scratch copy, which has no `data/`. Those seven read the shipped values, where H5 and H6 add 0.
  - Neither form of P1 sees these. It is a limit of the fixture set, not of the Engineer's row.
  - **d5's second check closes this for the pull.** On 7 788 positions the identity gate at non-zero values reads H5 as 2 572–2 642 misses at all three value sets. H6 reads 86 misses at the two sets with a U, and 0 at the fit shape, where U is 0 and H6 adds nothing (`raw/gate-h5.txt`). So the gate on the emitted file sees H5, and H6 cannot matter while U is held.
  - **Asked:** the identity gate on the emitted file stays a hard step, and if a default-lane row is wanted, it runs K1's hot identity at a forced k of 6, 12 and 23 on the kd and free parts only, since the hot path fires no U at k > 0. That row needs a dated line, because a forced k is outside `evaluateAtPhase`'s contract.
- **`QE-301-b` (MEDIUM, non-blocking; the Engineer at scope 1, before the fit): nothing standing reads the emitter's four E4a columns at a non-zero value.**
  - At the base values all four are 0, so "equal value for value" cannot see a crossed column. Three emitter mutants stay green: M3 (`PASSED_KING_OWN` written from `T_KE`), M4 (the hash's `PASSED_KING_OWN` from `T_KE`), M5 (`PASSED_FREE` written from `T_KO`). The whole `TUNE_DEEP` lane reads 22 passed under each (`raw/emitlane.txt`).
  - The tool is right today: QE drove a table with distinct non-zero E4a halves through `emitSource` and back, 0 mismatches over 422 terms. That is a one-off read, not a row. M3 and M5 each read 6 mismatches on it. M4 does not, because it moves only the hash.
  - The gate on the emitted file does not close this: it reads `tableOf` and `evaluate` from the same emitted file, so a crossed column agrees with itself. (By reading, not run.)
  - The Engineer's "tool mutants 9 / 9" stands, but M2 was killed by a trailing 1, not by its crossed column.
  - **Asked:** a `TUNE_DEEP` row at scope 1 with distinct non-zero E4a halves, emitted and read back. At the fit, assert the emission's `tableOf` equals `fit.json`'s table. The ABC-239 emit row already does that on its small fit; whether it bites depends on scope 3's free set moving E4a there: `UNKNOWN - verify`.
- **`QE-301-c` (LOW, non-blocking; the Engineer at the next touch of the row): the guard's reach is narrower than P2's words.**
  - Green with a planted caller: `.mjs`, `.js` and `.mts` under `src/` (the row filters on `.ts`); a script at the repository root, `.sh` and `.mjs`; `.github/`; an alias in `src/evaluate.ts` with its caller elsewhere; a computed property name.
  - None exists today: `src/` holds only `.ts`, `.json` and `.snap` files, and no script sits at the root.
  - Two small widenings close most of it: read every source extension under `src/`, and count the bare name in `CODE`, not the call form. A computed name is beyond any text row.
- **`QE-301-d` (INFO; whoever gives U a value, `ADR-0070` d7): the P1 row reads D by a forced 0 at the shipped values, so it assumes shipped U = 0.** With fit-shaped shipped halves and U 0 it stays green, and E14–E16 stay red on it. With shipped U 50 and a correct build it goes red on 13 fixtures. The Engineer's "stays true after the fit" holds for this pull and not for that later attempt.
- **`QE-301-e` (INFO; the gate hop): the `NFR-008` budget of ≤ + 0.10 s is not read here.** That is the `N8-LANE` H − B read at the gate. QE's `npm test` ran at one worker for this hop's one-core width, 17.39 s, not comparable with the 10 s limit.
- **`QE-301-f` (INFO): closed from the Engineer's `UNKNOWN - verify`.** An emission with real extract counts has no trailing space: biome clean, typecheck 0, at the base and at a fit-shaped table. The fit's own time and heap stay `UNKNOWN - verify`.
- **QE's own slip (LOW, owned): `QE-271-h`'s written row, in `…d0f7af61`.** It cost a red and a ruling. A row proposed in a gap note was not run before it was written down. From here QE runs a proposed row on the build before publishing it.
- **Process, disclosed:** QE took one non-blocking `flock -n` probe of the lock, running `true`, before the first batch. Each batch ran as one script under one `flock` hold, not one hold per command, so the lock was held for each whole batch.
