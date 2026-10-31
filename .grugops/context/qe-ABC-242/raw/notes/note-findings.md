# `ABC-242` QE findings: one MEDIUM (an R2 / condition-2 ruling is owed), one LOW, the rest INFO; none is a build fault

- **QE-242-a (MEDIUM, a records and rule gap; owner of the next step: BA/PM).** The lane form is step 10. On the budgets
  each child search is actually handed, step 10 does not meet `ABC-244` condition 2 as written.
  - **Readings:** at step 10 the children get 10, −10, −30, −50 and −70 ms, depth 1, and the blunder's elapsed time is 210
    virtual ms of 100. At step 1 they get 19 and 17 ms, depths 5–9.
  - **The SE's "2 reads per child"** is the nominal slice, and the census line should state the handed budgets.
  - **Only step 1** meets a per-child reading, and step 1 costs about +2.5 s of lane wall, which breaches `G8`.
  - **No effect on the product.** No loss of kill power was seen: QE's 20 plants give identical kill sets at steps 1 and
    10 on the `ABC-242` rows, and the SE's M1–M8 are identical at 1, 10, 100 and 1 000.
  - **Ask:** BA/PM rules whether condition 2 reads a blunder per call (which admits 10 as built) or per child search.
    Details are in the census note.
- **QE-242-b (LOW, a regression gap).** Lowering the 100-key cap survives the whole lane: Q6 (cap 8) and Q8 (cap 50).
  - Every `ABC-242` fixture has a 7-ply history, with its matches at −4 and −8.
  - A third occurrence whose oldest earlier occurrence lies more than 8 (or 50) plies back is game-reachable. Clocks up to
    149 are legal.
  - QE's synthetic X2 kills both plants, and so would a fixture with a long reversible history.
  - Q18 (the check spends a clock read) also survives. It is unpinned by the ticket's design (entries after the skip are
    `UNKNOWN - verify`): **INFO**.
- **QE-242-c (INFO).** The `LADDER_DEEP=1` short run was read as pass/fail only (18/18, exit 0, 25.5 s). The default
  reporter did not print the per-pair `LADDER` lines, and the run was not repeated because the brief says once. Levels 1–5
  ordered rests on the rows' own assertions. The pair scores are `UNKNOWN - verify` from this hop. The SE's run at
  `56058203`'s code printed 4/4, 3.5/4, 3/4, 3.5/4 and 10/10, digest `f61f457801fe67af`.
- **SE-242-a (answered, INFO).** QE-230's `blunder-probe.mjs`, run unchanged, reads base d8e8 at **−1013 at the `ABC-230`
  merge `24f3e322`**, and at **−1020 from the `ABC-228` merge `e42b637b` on**. In `ABC-228`, quiescence in check searches
  every evasion (`ADR-0053`). The reading is unchanged at `1f6abec4` (ABC-241), `5953c631` (ABC-229) and `4387d4e8` (base).
  The other entries moved with it (d8d7 −1020 → −1030, d8e7 −1010 → −1015). So a known merged ticket moved it, and nothing
  unexplained did (`raw/probe/se242a.txt`).
- **SE-242-c (judged).**
  - **M7 and M8 are equivalent: QE agrees** (Q11 and Q12 survive; reasons in the plants note). Q16a is equivalent too.
  - **Removing the cap is equivalent for every trimmed caller: QE agrees** (Q7).
  - **Lowering the cap is not equivalent**: QE-242-b.
- **SE-242-e (confirmed).** The SE's test-local `base()` equals base's real blunder on 42 of 42 checks (list, depth, nodes,
  elapsedMs, child searches). A1–A3 also hold against the real base tree.
- **SE-242-b (agree, INFO).** The sweep's runs on B showed base already scoring some repeat moves 0 from inside the child
  search. The A1 fixtures avoid this, as the SE describes.
- **SE-242-f (INFO, not this ticket's).** The `src/levels.test.ts` header row count was already stale at base.
- **The scope fence held.** `src/engine.ts`, `search.ts`, `level-seam.ts`, `uci-session.ts`, `cli.ts`, `history.ts`,
  `gameend.ts`, `zobrist.ts`, `quiescence.ts` and `transposition.ts` are byte-identical B → H. `levels.ts` gained no import
  and no export, and only the 4 named files changed.
