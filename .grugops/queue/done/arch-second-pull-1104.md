---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-04T16:55:21Z
subtask: arch-second-pull-1104
role: architect-design
ref: .grugops/context/arch-second-pull-1104/
branch: new grugops/arch-second-pull-1104 from main — worktree .claude/worktrees/arch-second-pull-1104
width: records only; nothing run.
---
# Second-pull design lines (owner: d6 yes, B-T8 yes) and the bundling rule draft
Read the owner ruling …dda43b71 (and …264e420e for the QE-271 carries), ADR-0067 (d5, d6, F3, B-T8, the f3f4 dated block, the ADR-0070 lines), ADR-0070, ADR-0056 D2/D6, and EPIC-011 § The per-change rule. The ABC-283 records are the precedent for bundling: …4c4cb03d, …6c6fb0be, …2409cec9.
1. ADR-0067: write a dated line adopting the d6 amendment: the margin-aware form, every relation bounded at once from the first fit, no refit step. State exactly how F3 now reads, and what the second pull's step list changes. Write B-T8 as re-confirmed by the owner for the second pull (about 5 h, the 200 + 200 pair).
2. Restate QE-271-f: a dated line on ADR-0070 d3 restating the endgame cost (1.12× per call measured against "about 1.085×"), and the second pull's PREREG grading an endgame cost row or stating why not.
3. List the second pull's preconditions: QE-271-h's hot-path E4a row at live values, QE-271-g's guard row, QE-271-i (the tools/tune emitter writes the four new exports), and that endgame cost row. Give the second-pull ticket's scope and bars as owed lines for BA/PM; the next id is ABC-301.
4. The bundling rule: draft it as a dated, PROPOSED section in ADR-0056 (the per-change rule), with the guards in …dda43b71 item 3. Say when bundling is allowed (related parts, shared files or a shared mechanism, a parked or marginal part), what each part must still show alone, how credit and attribution are stated, and what happens on a miss. Name it as an owner question for acceptance. Recommend which backlog tickets are natural bundles (e.g. ABC-286 + ABC-288 over history), with a one-line why each.
Fences: memory-bank/50-decisions and your records only. No ticket, EPIC, board or src edits. No push, force, amend, rebase or merge into main. Leave nothing running.
Publish: sealed notes (task arch-second-pull-1104, contextRoot = the worktree's .grugops/context, `at` from `date -u`), including a decision note with the owed BA/PM lines; queue moves; commit; ## Result + trace row; brief + claim to done/. Before your last commit, run `node tools/grugops/records-path-check.js --base main`; it must exit 0.

## Result
by: architect-design (claude-opus-5-5), at: 2026-11-04T17:07:23Z. Records only; nothing was run, and nothing is left running. No `src/`, `tools/`, ticket, EPIC or board edit.
- **1. `ADR-0067`: the d6 amendment is ADOPTED** (owner `…dda43b71` item 1).
  - Every relation row of `src/evaluate*.test.ts` is bounded from the first fit, with ruling (b)'s margin. There is one fit and no refit.
  - **F3 now reads:** a red relation on the emitted set is a defect (as F1), fixed and re-run on the fixed tool. An infeasible bound set is a STOP to Architect/Design.
  - **The step list:** the bound set is listed in the PREREG before any fit → one fit → the relation rows run on the emission (a red is a defect) → infeasible means STOP → the gates, unchanged.
  - `zugzwang.001` is not bounded. R1 is added only by the PREREG, before any fit.
  - **B-T8 is re-confirmed** for the second pull (item 2): 200 + 200 at 0.5 s against Stockfish, about 5 h, before it merges.
  - A dated line under the bars table: B-T0–B-T8 are carried, plus the four preconditions and the endgame `G2` row.
- **2. `ADR-0070` d3 (`QE-271-f`):** the endgame cost is 1.12 × per call (1.1246 / 1.1169), against "about 1.085 ×", and 1.021 / 1.037 × per node.
  - The second pull grades an endgame `G2` row in B-T4, at ≤ 1.02 × against its base.
  - E4a's own cost is not graded again: it was accepted under K3, and B-T7 prices it on the clock.
- **3. `ADR-0070` d4 (`QE-271-g`, `-h`):** `pawnStructureForTest` is accepted, with a caller-guard row. The hot-path row's form is written (it kills E14–E16).
  - **Preconditions of the second pull:** -h, -g, -i (the emitter's 13 → 17 exports plus the tracer) and -f, each met before the fit.
- **4. `ADR-0056`: the bundle read, PROPOSED,** as a new dated section before D6.
  - B1 sets when a bundle is allowed. B2 sets what each part shows alone. B3 covers the safety rows: all on, then per part on a red. B4 is one sealed read, never re-played. B5 gives the credit to the bundle. B6 covers a miss. B7 says who names a bundle.
  - **Owner question `Q-3K-11`.** Reading (b) applies: while PROPOSED, the rule covers only bundles he names.
- **Recommended bundles:**
  - `ABC-286` + `ABC-288` (over history);
  - `ABC-290` + `ABC-293` (one attack map);
  - the pull after the second, over `ABC-290`–`ABC-293`;
  - later, `ABC-272` + `ABC-294`.
  - Kept apart: `ABC-284`, `285`, `287`, `289`, `296`, `297`, `298`, `282` and `301`.
- **Notes:** `…4917f0f7` (decision: the second pull and the owed `ABC-301` lines) and `…a5d74f70` (decision: the bundle read, `Q-3K-11`, the bundles). Commits: claim `903860c2`, records `b43cd158`.
- **Owed (BA/PM):**
  - **cut `ABC-301`**, the second pull (L, P2, GAIN), from `…4917f0f7` § 5: title, adr, preconditions as scope 0, scope 1–5, bars, out of scope, NFR lines (`NFR-008` flagged), dependencies;
  - **`EPIC-011`:** E2 row, owner questions (both answered; add `Q-3K-11`), tickets row, dependencies, and a per-change rule pointer to the PROPOSED bundle read.
- **Owed (Orchestrator):** the board; ask `Q-3K-11`, plus the optional bundle-1 naming.
