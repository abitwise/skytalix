# qe-ABC-303 Stage A, first hold: **P7 is VOID, 8 of 8 rounds flagged, so its one re-read follows. P6 is MET and stands. R5 is read, reported.** A void is not a miss. No game has started, and none may until P7 is met

QE/E2E, task `qe-ABC-303`, addendum `…79bd6622`. The slot cleared at 16:54:41Z on `reread.sh`'s five samples, after one try was released at 16:53:25Z with 1 foreign. One hold, 16:54:41Z to 17:07:05Z: P7, P6, R5, each exit 0. Every output file was non-empty before it was read. Raw: `raw/out/stage-a1/`.

**P7, `NFR-008`: VOID.** `flags.py`, read first: **8 of 8 complete scored rounds flagged**, against a line of more than 2. All 27 runs read their expected counts, and 8 complete scored rounds finished in 9. The first foreign row came about a second into the hold, after the five clear samples: 81 of 87 samples name a busy foreign vitest, one project, `marketing`, 3 processes at most; `foreign_cpu_s` median 15.40, largest load1 5.29. **The grade was not run and no figure from this read stands.** No process was touched.

**P6, `G6`: stands, MET.** 0 of 5 rounds flagged. 20 of 20 runs. The 30 foreign rows in its file all fall before its first run's window, while `host.mjs`'s wait-clear held on them; none falls in a run's window. kiwipete: base 9 in all five, head 9, 10, 9, 10, 10, median 10 ≥ 9. position-6: 12 in all ten, median 12 ≥ 12. Every run ≥ depth 6, no depth 7 WARN. `G11`, from these runs: head's move equals base's on both boards in all runs (Bxa6, Nd5).

**R5, `G2`, reported, gates nothing:** door / head 0.9874 / 1.0492, mean 1.0183, beside 0.9921 / 1.0537, mean 1.0229 on `0cc9afd1`. Flags: 0 of 4 samples name a foreign vitest. Stands as a reported row.

**The re-read.** This note is the new note § 6a asks for. P7 alone, by the addendum's gate: `reread.sh` unchanged, the same arms (`diff -r --no-dereference -x .test-results` of H and H2 empty), the same scripts, a clock of 15 minutes from this note's commit, out to `<scratch>/qe303/out/a2`. It is the one re-read. A second void means no game: stop and report.

**One correction to the addendum, no line moved.** Its § 6 says "all five" of six scripts copied from `qe-ABC-307`.
