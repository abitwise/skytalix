---
subtask: qe-ABC-248
role: qe-e2e
ticket: ABC-248
ref: .grugops/context/qe-ABC-248/
branch: grugops/ABC-248 @ 18bad5fb (code 71700836, PREREG 7e9ab524); your worktree .claude/worktrees/qe-ABC-248 on new branch grugops/qe-ABC-248 from it
width: ALONE (no other hop). Record load1 and foreign processes with every timing. Leave no process running.
---
# QE ABC-248 (S, P1, test-only): ADR-0046 tranche 2 gate
## Read
- The ticket page (acceptance, BA/PM ruling conditions 1–5, ruling 6). ADR-0046 § Addendum 2026-10-31 and § BA/PM ruling 2026-10-31 (W1).
- The SE hand-back .grugops/queue/done/se-ABC-248.md on the branch, PREREG.txt and frozen lists in .grugops/context/se-ABC-248/raw/, notes …237b57fb, …b9dc61b6, …64b1718e, …aedad93f.
## Do
- Re-read each lever's condition independently (you may reuse the SE's frozen lists; say whether you re-froze): T2c-a/b non-vacuity and plant parity (ADR-0050 plants first); T2a default-lane kill parity (120 = 120; WS-WHITE/WS-BLACK sole killers stay); T2d kill-set parity for A4-a2 at step 1 000; census 0 join.
- SE-248-a (MEDIUM): ruling 6's `-t` form. Run the moved describe with the regex-escaped title under ENGINE_DEEP=1 and confirm "4 passed"; record the unescaped form's 0-tests exit 0 as a finding against the ruling text (who fixes the text: name the carrier).
- SE-248-b (INFO): record A4-a2's depth 3 / 1 044 nodes at step 1 000 vs depth 6 at 100; judge whether ruling 2's interval count (budget ÷ step) is met as written; if you think the ruling's wording needs an Architect reading, say so — do not block on it if the ruling is met as written.
- P-2 (from bapm-page-closes): run S241M5, QPARITY, QCLOCK, QPLY4, QPATHOFF each alone against the whole default lane at the tip; record killed / survived. No timing needed. A survivor is a finding, not a FAIL of this ticket.
- Carried: QE-244-a (confirm no step, LEVELS[5].budgetMs or NODES_PER_CLOCK_CHECK moved; cli.test.ts untouched), QE-245-b (remedy).
- Gates via `npm run …`; npm test 0 skips (2 362); skip-integrity, lane inventory; G8 head vs base main 46365ed0 with W1 (> 9.7 s → second window of 3 head runs, median of all 6 decides; > 10 s → STOP). Thermal stop: Tctl median > 85 °C.
- Verdict PASS / PASS_WITH_GAPS / FAIL (UAT waived; verdict closes).
## Fences
- No edits under src/, tools/, data/; no board edits. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec. Waiting: `kill -0 <pid>` or poll a file; never `while pgrep -f`; never vitest on the same command line as a wait. Scratch `qe-248/`.
## Publish
Sealed notes (task `qe-ABC-248`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
