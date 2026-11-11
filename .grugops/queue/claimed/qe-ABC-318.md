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
