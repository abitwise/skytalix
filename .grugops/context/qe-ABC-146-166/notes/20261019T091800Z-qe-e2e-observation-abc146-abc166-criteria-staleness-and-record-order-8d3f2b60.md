---
id: 20261019T091800Z-qe-e2e-observation-abc146-abc166-criteria-staleness-and-record-order-8d3f2b60
kind: observation
by: qe-e2e
task: qe-ABC-146-166
at: 2026-10-19T09:18:00Z
verified_by:
confidence: high
refs:
  - ABC-146
  - ABC-166
  - ABC-085
  - ABC-170
  - ABC-169
  - ADR-0038
  - QE-166-a
  - QE-166-b
  - QE-166-c
  - QE-146-a
  - .grugops/context/secnfr-ABC-146-a0/probe/raw/a0.jsonl.txt
  - .grugops/context/qe-ABC-146-166/probe/cmp-short.out.txt
supersedes:
---

# ABC-146 and ABC-166, the remaining criteria: A0, A6 and A7 MET. ABC-166 A5's ordering clause is not met. The verdict is stale against main by rule, and a short-mode digest check shows the games did not move

Hand-authored and unsealed. Everything here was read from git or recomputed from recorded data. The only runs were
two `LADDER_DEEP=1` short-mode runs, which compare counts and digests only. No timing was taken, and nothing from
short mode is ever quoted as `A1` or `A2`.

## ABC-146 (route V, picked by A0)
- **A0: MET.** I recomputed it from `secnfr-ABC-146-a0/probe/raw/a0.jsonl.txt`.
  - 10 of 10 node counts are 29 717, and one result digest, `398995d95a12e6e6`, covers all 10.
  - The pair ratios (vitest `callWallMs` ÷ node `callWallMs`) are 0.9205, 0.9462, 1.0058, 1.0043 and 0.9539.
    The median `F` is 0.9539 and `F_hi` is 1.0058. 1.0058 ≤ 1.30, so the route is V.
  - These equal `…f1558f02` and ADR-0038 addendum 2.
- **Scope 1–4 and A1–A4: cancelled on route V** (the page's route table). `d93e247b` has no `tools/ladder/`.
- **A5: MET for its tree.**
  - The tree `d73c4d6c` contains `f00038ef` (ABC-083) and `7a920ca5` (ABC-152); both `merge-base --is-ancestor`
    checks exit 0.
  - The report states the commit, step 4, the seeds, the counts, the wall, load1, the runner and its versions, the
    1v5 score against ≥ 90 % (MET), and each adjacent pair against > 50 % with 3v4 and 4v5 first (RED, RED, MET, MET).
    It also states the claimed draws, and 180 of 180 from the 17/17 pass.
  - The REDs are real scores and belong to ABC-087. They are not delivery defects.
- **A6 (route V): MET.**
  - `git diff --name-only eb216351 d93e247b -- src/ tools/ vitest.config.ts package.json package-lock.json AGENTS.md`
    prints nothing.
  - The run was one serial vitest process, one file, rows in order.
  - Window: see QE-166-c.
- **A7: MET.**
  - `grep -nE '^#+ .*PROPOSED'` over ADR-0038 at `d93e247b` prints nothing (exit 1). The two headings now read
    ACCEPTED.
  - Addendum 2 (2026-10-17) states route V inside vitest and cites A0 (`…107ff1bf`, `…f1558f02`).
  - The `--reporter=verbose` line and the run 2 pointer are dated 2026-10-19 (`1524297a`).
- **The reading closes A0, A5, A6 and A7.** On ABC-146's own criteria nothing stays open. What follows the reading is
  outside its criteria: REDs → ABC-087, the AGENTS.md Scribe hop after the merge (`…6a2f9d03`), and QE-146-a below.

## ABC-166
- **A1: MET.**
  - **Re-checked from git at `d73c4d6c`:**
    - the staleness diff against `eb216351` is empty;
    - md5 `vitest.config.ts` = `2d2b6379dca047103493ab0bd9b10480`;
    - md5 `src/ladder.test.ts` = `bba67b75565b4f4a2e8d231e8bcd6b2e`;
    - `src/` is clean (no `+dirty-src` on any PAIR line).
  - **From the meta file:** the versions, and AC power with the lid open at start and at end.
  - **Attested only (QE-166-c):** the `-t "3v4"` probe and width 1.
- **A2, A3: MET**, with 0 figure mismatches (`…5e1c7a42`).
- **A4: not triggered.**
- **A5: PARTIAL.** Both decisions are recorded: the Architect's `…b7e2c915` in `1524297a`, and the Orchestrator's
  `…6a2f9d03` in `d93e247b`. The ordering clause is not met (QE-166-a).
- **A6: MET.** The fence diff is empty, and the production-`src/` grep is empty (`eb216351..d93e247b` and
  `d93e247b~1..d93e247b`).

## Gaps
- **QE-166-a LOW: A5's "recorded before any A3 number is quoted" is not met.**
  - The A3 numbers were quoted first, at 08:42:14Z (`e68a4327`: the commit subject, the page and the note) and at
    08:42:27Z (`bc195510` on main's board).
  - The decisions came after: `1524297a` at 08:49:31Z and `d93e247b` at 08:50:14Z.
  - It fails by note `at` as well: the reading is 08:45:00Z, then 08:48:31Z and 09:00:00Z.
  - **Impact:** both rulings are about the command line and AGENTS.md, and neither depends on a score. So no number is
    affected.
  - This cannot be repaired after the fact. The Orchestrator accepts it or takes it to the owner.
- **QE-166-b INFO: two note `at` stamps are later than the commits that carry them.**
  - `…4c1d8e27` has `at` 08:45:00Z, but its commit `e68a4327` is 08:42:14Z.
  - `…6a2f9d03` has `at` 09:00:00Z, but its commit `d93e247b` is 08:50:14Z.
  - `at` is the contract's replay sort key (`context-note.md`). Notes are append-only, so any fix is a superseding
    note by its author, never an edit.
- **QE-166-c INFO: A1's probe and width 1 are attested, not evidenced.**
  - The `-t "3v4"` probe output was not kept.
  - **Width 1:** in the window 21:20:13Z–08:40:36Z, git on all refs shows one commit, `558a00e4` at 05:43:59Z. It
    queues `ticket-to-pr-ABC-167-i`, marked "HELD". `secnfr-ABC-167` was stopped before the start (board `8636b0f0`).
  - `ticket-to-pr-ABC-167-i` was dispatched at 08:42:27Z and delivered `660a0d50` at 08:46:03Z. Git cannot show
    whether any of its work began before 08:40:36Z: `UNKNOWN - verify`.
  - The note's "other agent sessions ran during the night" refers to processes outside this factory (a foreign
    `public/grugops` vitest was also running during this hop).
  - The counts do not depend on load (ADR-0038 decision 4), so the verdict is unaffected.
- **QE-146-a LOW: the verdict is STALE against `main` by ABC-085's staleness rule.**
  - **The rule fires.** After the branch point `eb216351`, main merged two commits that touch `PUZZLE_DEEP`'s engine
    trigger list:
    - `e29f7951` (ABC-170, `src/engine.ts`: `maxDepth`/`maxNodes`, optional, absent = `Infinity`);
    - `b3fecb1b` (ABC-169, `src/evaluate.ts`: a comment only).
    Both reached main on 2026-10-18, before run 2 started. Run 2's tree `d73c4d6c` contains neither. ABC-166 A1's
    staleness check compares against the run tree's own HEAD, so by construction it could not see them.
  - **What the merge result carries.** The rule says "a verdict is STALE after any merge that touches…", and "It is not
    a gate on that merge". So it does not block ABC-146's merge, and re-taking the verdict is the Orchestrator's to
    schedule. After the merge, `main` carries a verdict read on `eb216351`'s engine, not on the engine `main` ships.
  - **Measured evidence (short mode, step 120; counts and digests only).** I ran
    `LADDER_DEEP=1 npx vitest run src/ladder.test.ts --reporter=verbose` twice:
    - at `d93e247b`, whose `src/` is byte-identical to `d73c4d6c`;
    - on the merge result, tree `4c97977c`, whose `src/` is main's.
    Both exit 0 with 18/18. The comparison, ignoring the wall, load and commit fields:
    - all **26 of 26** games have the same plies, result and reason;
    - all **5 of 5** PAIR lines are identical, with digests 3v4 `4746fe1a608cddeb`, 4v5 `203539233b1dd412`,
      2v3 `ec1321f31505a90a`, 1v2 `96f413b64bb8db34` and 1v5 `e37280a7cb840919`;
    - the A5 digest `96f413b64bb8db34` is the same on both.
    The comparator does go red: it reports `DIFFER` when one ply is changed in a copy of the output.
  - **The residual.** Short mode is evidence, not proof, that step 4 is also unchanged. By reading the diff, the
    engine change cannot move a game when the fields are absent: the clock is read first and as often as before, and
    `Infinity` never fires. The levels and the ladder pass neither field (ABC-170 § Value).
  - **Recommendation:** the Orchestrator either records that the verdict stands for main on this evidence, or
    schedules a re-take. The owner's word would be needed for a second night.
