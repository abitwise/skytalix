---
subtask: bapm-owner-adr-fold
role: ba-pm
ref: .grugops/context/bapm-owner-adr-fold/
branch: new grugops/bapm-owner-adr-fold from main, own worktree
---

# BA/PM: fold the owner's 2026-10-30 answers into the epics and tickets

Source of truth: the owner-decision note `orch-2026-10-29g/…3dd61448`. In parallel, an Architect hop
(`arch-adr-accept-0052-0053-0054`) is editing the ADR files. Don't touch them; cite them as ACCEPTED per the note.

## Do
- EPIC-009, ABC-220 and ABC-222: the simple-tournament time is 22 s with a 22 s ceiling (was T 22.0 s under a 22.5 s ceiling).
  Whole seconds. Fix titles, acceptance rows and arithmetic (ABC-222's "longest move ≤ 22.5 s" → ≤ 22 s; check the
  clock-use and margin rows still hold at 40 × 22 s = 880 s of 900 s). ABC-221/223 are unchanged.
- ABC-220: DoR → 10/10 once ADR-0052 is accepted, and say so.
- ABC-228/229: ADR-0053 accepted. Record OQ-228-1 (build fully; the owner's "3s to 4s" clause is pending clarification and
  applies only on a G6 miss after the re-forecast). Re-score DoR.
- ABC-230: ADR-0054 accepted → DoR 10/10.
- EPIC-010: Q1 Syzygy is **deferred** by the owner (out of EPIC-010). Q3 is still open.

## Fences
- plans/epics, plans/tickets and your context only. No ADR, src/, tools/, data/ or board edits.
- Never push, force, amend or rebase. Never merge into main. No host paths. Never bare `npx`.

## Publish
- Seal notes (task `bapm-owner-adr-fold`) with `at` from `date -u`. Commit on your branch. Write `## Result` plus a 10-cell
  trace row into this brief, then move it and its claim.md to done/.

## Result

*BA/PM, 2026-10-30, task `bapm-owner-adr-fold`. Records only, at `main` `a046e839`. Branch `grugops/bapm-owner-adr-fold` @ `2b58bdea`.*

- **EPIC-009, ABC-220, ABC-222:** `ADR-0052` is accepted with the owner's amendment. T = 22 s and the ceiling = 22 s, whole seconds. T did not move, so every margin and clock-use row keeps its value: 880 s of 900 s, 97.8 % (97.9 % at δ 31 ms), 18 760 ms left at move 40, M1 holding while δ ≤ 487 ms, and 83.1–83.2 % with 6 book moves.
  - `ABC-220`: the title, scope 1 (ceiling = T, constants per the amended D3), A6 (deadline ≤ start + 22 000 ms), A11, NFR, Dependencies and DoR changed. **10/10, Ready.**
  - `ABC-222`: A5 (≤ 22 s → < 22 500 ms wall), its NFR and DoR rows, and the wall estimate changed. 9/10, waits on `ABC-220`.
  - EPIC-009: the settings table, Scope, M4, the ceiling line, the ticket table, Q4/OQ-0052-1, Dependencies, RISK-02 and NFR changed. § The budget T is kept as history behind a dated preface. `ABC-221` and `ABC-223` pages are untouched.
- **The 22 s wall reading (BA/PM's, flagged).** A ceiling equal to T cannot hold on the wall to the millisecond, because each move overshoots by ≤ ~31 ms (`AR-NFR004-A`). This is the same reason D3 rejected T = ceiling at 22.5 s. So the ceiling is read exactly on the deadline the engine is handed, and **to the whole second on the wall** (≤ 22 s = < 22 500 ms), on the owner's "whole seconds". The code is the same under any reading. If the Architect's amended D3 reads it differently, it rules.
- **ABC-228:** `ADR-0053` is accepted. OQ-228-1 is recorded as "build it fully", meaning the full design. The "3s to 4s" clause is conditional on a forecast miss, and its reading is pending the owner. A5's `G6` is conditional. A7 is met. A8 is new: decision 9's forecast, with the SE stopping on a miss. **10/10, Ready.**
- **ABC-229:** the ADR wait is replaced by `ABC-228`'s merge. If 228 closes unmerged, 229 goes back to the Architect (d6's doors assume evasions on). 9/10, Backlog.
- **ABC-230:** `ADR-0054` is accepted. Scope and acceptance are unchanged. **10/10, Ready.**
- **EPIC-010:** Q1 (Syzygy) is **deferred** by the owner and is out of the epic. Q3 is open: he asked for more information. The ticket table is re-scored, and ADR-0052 is cited as accepted.
- **Owner questions:**
  1. Confirm that the 22 s ceiling is read to the whole second on the wall (< 22 500 ms). A strict 22 000 ms wall would need T < 22 s.
  2. Which 3 s does "increase 3s to 4s" mean: `G6`'s budget, or level 5's per-move time? A miss is borderline: it needs ≈ 1.36× nps, and ≈ 1.3–1.4× is in.
- **For the Orchestrator:** `ABC-221`'s page still lists OQ-0052-1 as its DoR gap, now met. Per the brief it was not re-scored. `ABC-220` and `ABC-230` share `src/uci-session.ts`.
- **Notes** (sealed with `admitAndAppend`; `propose_note` was not available): `20261030T042629Z-ba-pm-decision-37f1cb51` and `20261030T042636Z-ba-pm-observation-e188aa2b`.
- There were no ADR, src/, tools/, data/ or board edits. Nothing was pushed or merged.

### Trace row (10 cells, header order)

| ABC-220/222/228/229/230 (owner ADR fold) | Owner 2026-10-30: ADR-0052 accepted (T 22 s, ceiling 22 s, whole seconds), ADR-0053 accepted (OQ-228-1 build fully; 3s→4s pending), ADR-0054 accepted; Q1 Syzygy deferred; Q3 open | EPIC-009, EPIC-010 | — | NFR-004 (22 s; deadline exact, wall < 22 500 ms), AR-NFR004-A, NFR-005 (G6 via ABC-228 A8), owner note …3dd61448; notes …37f1cb51, …e188aa2b | grugops/bapm-owner-adr-fold @ 2b58bdea (records only): 2 epics + 5 tickets + .grugops/context/bapm-owner-adr-fold/notes/ (2) | none run (records only); ABC-220 A6/A11, ABC-222 A5 re-pinned; ABC-228 A8 added | — (UAT owed at each build; QE verdict signs) | — | ABC-220, ABC-228, ABC-230 Ready 10/10; ABC-222 9/10 (waits ABC-220); ABC-229 9/10 (waits ABC-228); owner: confirm 22 s whole-second wall, read "3s to 4s" |
