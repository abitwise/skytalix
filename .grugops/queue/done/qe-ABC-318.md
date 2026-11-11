---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-11T07:53:05Z
subtask: qe-ABC-318
role: qe-e2e
ref: .grugops/context/qe-ABC-318/
branch: grugops/qe-ABC-318 (integration; commit there)
width: verification, records only. No src/, README, ADR or catalog edit; report defects.
---
# ABC-318: QE check, level 6 to 10 s
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261111T073837Z-orchestrator-decision-f1dce7dd.md` (C1–C5) and the four hop records in `.grugops/queue/done/`: se-ABC-318, arch-ABC-318, secnfr-ABC-318 and se-ABC-318-fix, with their notes.
**What is on this branch:**
- SE db41eb4c and e6be34cb;
- Arch 7b403e0a;
- SecNFR 12258f18;
- the fix 9851683a;
- my one-word comment edit: `src/levels.ts` line 43, "NFR-005's reading on chooseMove at 3 s" → "4 s". It closes the contradiction the fix left with line 42. Verify it against NFR-004/NFR-005 since ABC-228.
**Check:**
1. **C3:** LEVELS[6] is 10 000 and the other levels are unchanged. Every test that pins L6 asserts the new values, and none is weakened (compare the assertions with main's). The rpair argv is unchanged. The production diff is `levels.ts` plus comments only.
2. **C4:** README and CHANGELOG match the cut note.
   - The L6 projection: 2144–2164 + 50–75 × log2 10, so ~2310–2410.
   - L7 reads ~2380–2540.
   - The three gaps from …6298d7f0 are closed.
   - The art cmp passes, and the README outside Levels is unchanged.
3. **C1 and C2:** the ADR and catalog amendments are dated additions only, consistent with the code, with no old text rewritten. SEC-318-a is resolved by SE's timeout change. SEC-212-a's catalog entry at about line 2620 still says "≈ 7 s at level 6": decide whether the dated note at about line 3150 suffices, or name it as a gap.
4. **C5 gates on the tip,** each alone under the lock, one worker:
   - lint, typecheck, unit, build;
   - pair-check;
   - the levels deep lane's level 6 row (`-t "level 6:"`, about 5 min).
   - Run the rest of the levels deep lane if it fits in about 15 min; else record which rows are UNKNOWN - verify, and why none of them reads L6.
5. **Verdict:** PASS, PASS_WITH_GAPS or FAIL. It signs UAT per the 2026-10-22 ruling: this ticket has production lines, so there is no waiver.
Every run goes as `flock <scratch>/host-test.lock <cmd>` (the real path is in your dispatch prompt only). Publish sealed notes (`at` from `date -u`). Add a `## Result` block to this brief. Run `records-path-check --base main`, then commit. No push, merge, amend, force or rebase. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## Result
- **Verdict: PASS_WITH_GAPS, no blocking gap.** C1–C5 are met on tip `fb6edbc8`. There are production lines, so there is no waiver: this verdict signs UAT (2026-10-22). Notes: observation `qe-ABC-318/20261111T081001Z-qe-e2e-observation-fbab40d6` (checks), decision `qe-ABC-318/20261111T081006Z-qe-e2e-decision-387f257c` (verdict).
- **C3:** `LEVELS[6]` 10 000, others unchanged. The production diff is one code line plus comments (`levels.ts`, `engine.ts`, `uci-session.ts`), and no `.snap` changed. Line 43 "4 s" is correct against `NFR-005`/`NFR-004` since `ABC-228`. The rpair argv is unchanged (pair-check 52 / 52). Test weakening: `expect(` and `it(` counts are equal to main's, and 7 assertion lines changed, each exact and each moved to the new value (the L6 A4 guard 300 000 -> 420 000).
- **C1 / C2:** the ADRs have 0 deleted lines. `NFR-004`'s row is insertions only ("~~7 s~~ 12 s"). `SEC-318-a` is resolved. The `SEC-212-a` entry at ~2620 sits in the dated 2026-10-24 section, kept as history; the dated `ABC-318` note at ~3150 suffices, so it is not a gap.
- **C4:** the README Levels figures and arithmetic match the cut note, and …6298d7f0's three gaps are closed. The art cmp is 0, and the README outside Levels is identical. CHANGELOG has the line.
- **C5:** each gate ran alone under the host lock with one worker:
  - lint 0; typecheck 0; unit 2740 / 2740; build 0;
  - pair-check 52 / 52; skip count 0, integrity `No findings.`;
  - the levels deep lane WHOLE, 58 / 58 in 727 s. L6 real clock: 30 / 30 at 10000–10002 ms, ceiling 12 000, row 300 012 ms. A2 L6: 10200 / 10000.
  - UCI session deep `A8′` 1 / 1.
  - The other 269 UCI session deep rows were not run (UNKNOWN - verify); none reads L6.
- **Gaps (non-blocking):**
  1. L6's top edge: 2413.1 outward is 2420, but the README and cut note say 2410. This is the Orchestrator's call.
  2. `src/levels.test.ts:395,404` still say "3 s" (pre-existing since `ABC-228`, text only).
  3. The SE note `…ca282d42` said no other levels row reads L6. `A2` and UCI `A8′` do; both were run here and pass.
- **Board:** `In Review → Ready for UAT` is left to the Orchestrator, as with prior QE hops. No `src/`, README, ADR or catalog edit. No push, merge, amend, force or rebase.
