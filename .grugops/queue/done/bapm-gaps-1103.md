---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T15:22:09Z
subtask: bapm-gaps-1103
role: ba-pm
ref: .grugops/context/bapm-gaps-1103/
branch: grugops/bapm-gaps-1103 — worktree .claude/worktrees/bapm-gaps-1103 (from main)
width: records only. Placeholders in committed files; run `node tools/grugops/records-path-check.js --base main` before your final commit (must exit 0).
---
# Route the ABC-276 / ABC-277 QE gaps
From qe-ABC-276 (gaps …1cbc2325) and qe-ABC-277 (gaps …7d149fbd):
- Cut **ABC-278** (S, P2): the path check hardened — QE-277-a MEDIUM (.gitattributes can hide records: pass --text to the diff and/or treat any .gitattributes change as a finding), QE-277-c (foreign-argv misses), QE-277-d (home path followed by . - _), QE-277-e (quoted file-name cosmetic + unquote test), QE-277-b (.xz decompression) — each an acceptance row; must still exit 0 on main.
- QE-276-a (no offline row for main()'s seal call) and QE-276-b (placeholder-word / < 3-char names): record on the ABC-276 page as accepted LOW with a re-open note, or fold into ABC-278 if cheap — your call, state why.
- QE-277-f (run the check with the real HOME): note in the runbook text owed to ABC-278 (you don't edit memory-bank).
- ABC-276 and ABC-277 pages → Done (merged 3dd27cfc / 541ddf45; QE …a79db6c1 / …98c1d275).
Fences: plans/tickets, plans/epics/EPIC-011*, plans/traceability.md + your records. Not board.md, ADRs, src, tools, memory-bank. No push, force, amend, rebase, merge into main.
Publish: sealed notes (task bapm-gaps-1103, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result; brief + claim to done/. Return proposed board lines.

## Result
- **Cut: `ABC-278`**, "the records path check hardened". **S** (upper end), **P2**, `EPIC-011` (records hygiene), **DoR 10/10, Ready**. The column move is the Orchestrator's. Code paths: `tools/grugops/records-path-check*.js`, plus one line of `memory-bank/70-runbook.md`. One acceptance row per gap:
  - **QE-277-a MEDIUM → A1.** The diff reads records as text. Four runs exit 1 with equal finding sets (root `.gitattributes` `-diff` and `binary`, each from the branch and from main's checkout). A NUL-byte record and `info/attributes` are covered. *Declined:* flagging a `.gitattributes` change as a finding. It has no placeholder remedy, and with `--text` it is moot.
  - **-b → A2.** `.xz` is read via `xz -dc`. A missing `xz` gives an UNKNOWN finding and exit 1; an R100 move gives exit 0.
  - **-c → A3 + A4.** Five new shapes (flags before the path, `python3 -u`, a lone executable, `ps -ef`, `ps aux`), with the exclusions kept. **False-positive budget: ≤ 10** new non-process hits at base. This is the split point.
  - **-d → A5.** `<home>.`, `-` and `_` hit; `<home>2` stays clean. *Declined:* the JSON `\/` half (INFO; JS and Python do not escape `/`), with a re-open trigger.
  - **-e → A6.** Quoted names print clean, plus a direct `unquote` row.
  - **-f → A8 + A7.** A8 is the runbook line on the real `HOME`, which this role does not edit (memory-bank), so it is owed to ABC-278. A7 is BA/PM's addition: both homes are read, so an override cannot narrow the check.
  - **"Still exits 0 on main" → A9.** Its own branch exits 0 with `--base main`, and `--head main` exits 0. The PR also reports the result over ABC-277's merged branch.
- **QE-276-a / QE-276-b: accepted LOW on the `ABC-276` page, each with a re-open trigger. Not folded.**
  - Both sit in `tools/rating/`, another file set and another QE reading, which breaks INVEST.
  - -a's only row that sees the call site costs a clone, `npm ci` and a build per run (about 450 MB and 3 s), so it is not cheap.
  - -b is inherited from rpair's byte-equal net and cannot occur on this host.
  - Triggers: (-a) a diff to `main()`'s r/d path, or a failed QE r/d grep / `sha256sum -c`; (-b) r, d or rpair on a host whose user or host name is under 3 characters, a placeholder word, or `skytalix`.
  - QE-276-c goes to QE at the next r/d reading. QE-276-d has no owner (ABC-277's home-slug class is the net).
- **Pages:**
  - `ABC-276` → Done (merged `3dd27cfc`, QE `…a79db6c1`; A1–A7 MET).
  - `ABC-277` → Done (merged `541ddf45`, QE `…98c1d275`; A1–A6 MET; A7 owner pending).
  - `EPIC-011`: a top block, rows 28–29 → Done, new row 30, ids line.
  - `plans/traceability.md`: row appended.
- **Notes (sealed, contextRoot = this worktree, `at` from `date -u`):** decision `20261103T152910Z-ba-pm-decision-55eae2b6`, observation `20261103T152910Z-ba-pm-observation-a99b70be`.
- **Commits:** records and notes `4bf8aa86`. This Result and the move to done/ are in the closing commit. `records-path-check.js --base main` (real HOME, host lock) exits 0 before it.
- **Proposed board line:** `- [ABC-278] Ready 2026-11-03 (cut bapm-gaps-1103; S, P2, DoR 10/10) Records path check hardened: text diff whatever .gitattributes says (QE-277-a MEDIUM), .xz decompressed, wider foreign-argv (≤ 10 new non-process hits), home before . - _, quoted names clean, both homes + runbook real-HOME line (EPIC-011 hygiene; tools/grugops + 1 runbook line)`. Append to the ABC-276 card: "QE-276-a/b accepted LOW, re-open triggers on page". Append to the ABC-277 card: "QE-277-a…f → ABC-278".
- No board, ADR, `src/`, `tools/` or `memory-bank/` edit. Nothing pushed or merged.
