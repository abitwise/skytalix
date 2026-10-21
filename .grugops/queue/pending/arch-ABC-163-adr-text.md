---
subtask: arch-ABC-163-adr-text
role: architect-design
ticket: ABC-163
ref: .grugops/context/arch-ABC-163-adr/
branch: new branch grugops/arch-ABC-163-adr-text from grugops/qe-ABC-163 @ 2270c8fa; worktree ../wt-arch-163
width: 2 (beside security-nfr-ABC-163)
---

# Architect: land the ADR-0036 § S1 replacement paragraph before ABC-163 merges

Your decision `…a7d9c818` owes four wording fixes to the `d8c073e2` line:
- "a file" becomes "a production file";
- name the deletion-only gap;
- note limb 1's extra line and the `341da4c1` copy for byte comparisons;
- note that the close needs the merge, and that AR-095-CWD's interim check moves to the instrument.

Apply the exact replacement text from `…a7d9c818` to ADR-0036 on the branch above, and commit there. If QE's result changes anything, say so first.

## Also (QE `…8a60d7c8`)
- **G-1:** deletion-only holder edits fire nothing. QE re-planted three, and the by-hand check caught all three. Your replacement text names this gap; check it matches QE's plants. Security/NFR rules on the risk in parallel. If its ruling changes the text, the Orchestrator re-routes.
- **G-3:** probe scripts that grep `(b1)` now split limb-1 rows, and F5, F6 and S10 move from L3 to L1+L3. Rule whether those scripts need an edit or a note.
- **G-4:** Biome ignores `.grugops/`, and there is no committed Ruling 2 plant fixture. Rule whether to cut a ticket for one, and name its shape; BA/PM cuts.

## Fences
- Change ADR-0036 only, plus notes written inside the worktree.
- Don't touch `clause-b.mjs`, `src/`, `AGENTS.md` or `plans/board.md`.
- Never push or merge.

## Publish
- Seal notes with the plugin writer (task `arch-ABC-163-adr-text`).
- Write `.grugops/queue/done/arch-ABC-163-adr-text.md` (brief + `## Result`: branch tip, diff summary, trace row) and `.claim.md`, uncommitted on main.
