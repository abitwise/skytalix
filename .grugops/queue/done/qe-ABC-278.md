---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T15:38:41Z
subtask: qe-ABC-278
role: qe-e2e
ref: .grugops/context/qe-ABC-278/
branch: grugops/ABC-278 (c4a2bf97 + main merged) — worktree .claude/worktrees/se-ABC-278
width: wrap EVERY test/build run (every vitest / node --test too) in flock on the host lock (<scratch>/host-test.lock; real path in your dispatch message). One core. No games. Placeholders in committed files; scratch repos outside the real repo.
---
# QE verdict on ABC-278 (records path check hardened)
Read plans/tickets/ABC-278*.md (A1–A10), qe-ABC-277 gaps …7d149fbd, se notes (…5b424fec, …476142cf).
Independently re-check A1–A10 with your own synthetic fixtures: .gitattributes (-diff, binary, info/attributes) and NUL-byte bypass from both checkouts; .xz added/renamed/no-xz; the new foreign-argv shapes and the old exclusions; home before . - _; quoted names; HOME override and userInfo failure; runbook line; exit 0 on --base main / --head main; false-positive count at base (≤ 10 new); speed; 0 src lines; npm test; proof 41/41; lint/typecheck/build. Repeat a handful of ABC-277's break attempts to confirm no regression. Note: the Engineer committed once before reading a grep for real values (3 lines, reported as placeholders) — verify the commit holds no real value.
Verdict PASS / PASS_WITH_GAPS / FAIL (signs acceptance). Gaps with severity and owner.
Fences: test/records only. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-278, contextRoot = worktree's .grugops/context); queue moves inside your worktree; run the check before your final commit (exit 0); commit (Result text included); ## Result + trace row; brief + claim to done/.

## Result

**DONE: the QE verdict on ABC-278 is PASS_WITH_GAPS. QE's verdict signs acceptance (Test note 4: no UAT).** Branch `grugops/ABC-278` (code `d7c0b3ce`). Not pushed, not merged. Finished 2026-11-03T15:49:04Z.

- **Rows re-run** under the host lock with QE's own scratch repo, built at run time from the real homedir, userInfo and uid. The CLI was spawned with no seam. 81 rows; the 57 with an expectation are all OK; 0 value strings printed. On `main`'s check the same harness goes red on 42 rows.
  - **A1 MET:** `-diff`, `binary` and nested attributes, each run from 4 checkouts: exit 1/1/1/1 with equal sets. A NUL-byte record, `info/attributes`, `core.attributesFile` and a binary diff driver each exit 1.
  - **A2 MET:** exactly `x.xz (decompressed): line 3: home-path`; an R100 move exits 0; without `xz`, one UNKNOWN. M, moved-in, `.XZ`, multi-stream and a 300 MiB bomb also fail closed.
  - **A3 MET:** 11 shape variants are hit; 2 exclusions stay clean.
  - **A4 MET:** independent recount 77 → 80, 0 lost. Of the 3 new: 2 are process lines and 1 is not (bar ≤ 10).
  - **A5 MET**, **A6 MET** (4 names print clean; 9 `unquote` rows), **A7 MET** (the set is equal under 4 `HOME` overrides; a throwing `userInfo` exits 1), **A8 MET** (+1 line).
  - **A9 MET:** 4 runs exit 0, including main's checkout with `--head grugops/ABC-278`.
  - **A10 MET:**
    - lint, typecheck and build green;
    - `npm test` 66 files, 2566/2566; lane 66 = 66;
    - proof 41/41 (98.9 % lines, 87.6 % branches);
    - 0 lines under `src/ data/ vitest.config.ts`.
- **Regression:** the QE-277 harness was re-run, 50 rows. 39 are unchanged; 10 changed as intended fixes; the 11th is fp02 (`wc -l`), which now hits: QE-278-a.
- **SE commit value check:** 0 real values in the added lines of every branch commit.
- **Gaps:**
  - **QE-278-a LOW** (SE/BA-PM): shape d false positives are wider than the header names (`wc -l`, `du`).
  - **QE-278-b LOW** (SE): residual argv misses. A `ps` row with flags before the path is not named in the header.
  - **QE-278-c INFO** (accepted): a UTF-16 record, or gzip bytes under `.md`, passes. Not claimed by the ticket.
- **Notes:** `qe-ABC-278/20261103T154832Z-qe-e2e-decision-2e755100` (verdict), `…observation-f6a7c2a6` (runs), `…observation-6b9ddaa3` (gaps).
- **Board:** the move out of In Review is the Orchestrator's.
