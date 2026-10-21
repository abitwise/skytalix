---
subtask: arch-ABC-163-adr-text
role: architect-design
ticket: ABC-163
ref: .grugops/context/arch-ABC-163-adr/
branch: new branch grugops/arch-ABC-163-adr-text from the QE tip of grugops/qe-ABC-163 (read done/qe-ABC-163.md for the sha); worktree ../wt-arch-163
width: queued until qe-ABC-163 ends
---

# Architect: land the ADR-0036 § S1 replacement paragraph before ABC-163 merges

Your decision `…a7d9c818` owes four wording fixes to the `d8c073e2` line:
- "a file" becomes "a production file";
- name the deletion-only gap;
- note limb 1's extra line and the `341da4c1` copy for byte comparisons;
- note that the close needs the merge, and that AR-095-CWD's interim check moves to the instrument.

Apply the exact replacement text from `…a7d9c818` to ADR-0036 on the branch above, and commit there. If QE's result changes anything, say so first.

## Fences
- Change ADR-0036 only, plus notes written inside the worktree.
- Don't touch `clause-b.mjs`, `src/`, `AGENTS.md` or `plans/board.md`.
- Never push or merge.

## Publish
- Seal notes with the plugin writer (task `arch-ABC-163-adr-text`).
- Write `.grugops/queue/done/arch-ABC-163-adr-text.md` (brief + `## Result`: branch tip, diff summary, trace row) and `.claim.md`, uncommitted on main.
