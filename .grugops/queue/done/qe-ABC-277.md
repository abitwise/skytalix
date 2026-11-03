---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T15:10:24Z
subtask: qe-ABC-277
role: qe-e2e
ref: .grugops/context/qe-ABC-277/
branch: grugops/ABC-277 (c67e64f5 + main merged) — worktree .claude/worktrees/se-ABC-277
width: wrap EVERY test/build run (every vitest / node --test too) in flock on the host lock (<scratch>/host-test.lock; real path in your dispatch message). One core. No games. Placeholders in committed files — any example of a caught class must be written with placeholders (the check will flag it).
---
# QE verdict on ABC-277 (records path check + placeholder ruling)
Read plans/tickets/ABC-277*.md, sec-host-paths …72b4070b, se notes (…95af648e, …0bad1e32, …f71efacd).
Independently re-check A1–A6: plant your own synthetic hits of each class (text and .gz, file-path hit) on a scratch branch → exit 1, values never printed; clean cases (legacy-file clean line, pure renames incl. .gz, src/tools-only lines, placeholders) → exit 0; --head main exits 0 today; exit 2 cases; the widened foreign-argv pattern: try to break it (false negatives on realistic pgrep -af / ps lines; false positives on ordinary records), and judge the accepted false positives; speed; .gitignore symlink rule; runbook/contributing/standing-ruling text; 0 src lines; npm test; lint/typecheck/build. A7 not done (owner pending) — not a gap.
Verdict PASS / PASS_WITH_GAPS / FAIL (signs acceptance). Gaps with severity and owner.
Fences: test/records only. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-277, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.

## Result

**DONE: QE verdict on ABC-277 is PASS_WITH_GAPS. QE's verdict signs acceptance (Test note 4: no UAT).** Branch `grugops/ABC-277` at `0f188473` (code `861de9c5`). Not pushed, not merged. Finished 2026-11-03T15:20:33Z.

- **Rows re-run** under the host lock, with QE's own scratch repo built at run time from the real homedir, uid and user name. The CLI was spawned with no seam.
  - **A1 MET:** exit 1, 17 findings (5 classes × 3 paths, `.gz`, file path). 0 of 10 value strings printed, across all 52 runs.
  - **A2 MET:** 5/5 exit 0.
  - **A3 MET:** the branch exits 0, `--head main` exits 0, and 6 exit-2 cases each give a reason.
  - **A4 MET** and **A5 MET** (one entry, additions only, hostname exempt in words).
  - **A6 MET:**
    - lint (138 files), typecheck and build green;
    - `npm test` 66 files, 2566/2566, 0 skipped;
    - lane 66 = 66;
    - 0 lines under `src/ data/ vitest.config.ts`;
    - proof 18/18 (coverage 91.5 % lines, 83.5 % branches).
  - **A7 not done** (owner pending; not a gap).
- **NFRs:**
  - Speed: 61 ms at 200 files, 169 ms at 287 files of real history.
  - `NFR-008`: 0 lane rows.
  - `.gitignore` symlink rule: confirmed.
- **Break attempts:** 34. Caught: realistic pgrep/ps-eo/systemd lines, a symlink, concatenated and fake gzip, CRLF, diff-like lines, a quoted path. Misses and false positives are in the gaps.
  - The false-positive judgement: **accept.** They fail closed, and the class hits 77 lines in 7 files at main, 75 of which also carry a home, slug or scratch value.
- **Gaps:**
  - **QE-277-a MEDIUM** (Software Engineer via BA/PM): a branch-added `.gitattributes` `-diff`/`binary` hides record lines. The verdict depends on the checkout that runs the check. 0 exposure today.
  - **QE-277-b LOW** (BA/PM): `.xz` is not read; 5 such records exist.
  - **QE-277-c LOW** (Software Engineer): argv false negatives (bare command + flag + path, `ps -ef`).
  - **QE-277-d LOW** (Software Engineer): the home path followed by `.` is missed.
  - **QE-277-e LOW** (Software Engineer): a quoted path prints with a stray quote. Cosmetic.
  - **QE-277-f INFO** (Orchestrator): `HOME` override.
  - **QE-277-g INFO** (accepted).
  - **None blocks the merge.**
- **Notes**, sealed with `admitAndAppend` under the worktree context root, 0 findings: `20261103T151952Z-qe-e2e-decision-98c1d275` (verdict), `…-observation-16ba58c6` (runs), `…-observation-7d149fbd` (gaps).
- **Records check on this branch:** exit 0 at `1582f07f`, and again after this commit.
- **Other:** nothing left running; the scratch repo and the node_modules symlink were removed. The board move (In Review → next) is the Orchestrator's.
