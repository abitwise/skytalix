---
subtask: scribe-snapshot-rule
role: agents-md-scribe
ref: .grugops/context/scribe-snapshot-rule/
width: queued; dispatched when a slot frees
---

# AGENTS.md Scribe: add the owner's snapshot-waiver clause (QE-159-f)

**Owner grant** (`…d9aa42b9`, 2026-10-21): amend the **third kit-override paragraph**. The override count stays three.

## Do
- Add the clause from the owner's 2026-10-17 rule (`…be910aa8`): a snapshot-only `src/` change keeps the UAT waiver only if the Orchestrator reads every changed `.snap` and records that in the Done note. Find the exact owner text in `…be910aa8` and the BA/PM ruling `…99559726`.
- Make AGENTS.md's waiver measurement the stated reference, with no `__snapshots__` filter.
- **Budget:** 24,576 bytes (now 24,554). Trim stale prose to fit and say what you trimmed. Don't touch the 12 rules or the merge-authority text.
- **Where to work:** branch `grugops/scribe-snapshot-rule`, worktree `../wt-scribe-snapshot`. Write the notes inside the worktree. Run `src/cli.test.ts -t "AGENTS.md"` as a one-file run at 400.

## Fences
- `AGENTS.md` and notes only. Never push or merge.

## Publish
- Seal the notes with the plugin writer (task `scribe-snapshot-rule`).
- Write `.grugops/queue/done/scribe-snapshot-rule.md` (brief + `## Result` + trace row) and `.claim.md`, uncommitted on main.

## Result

**DONE.** Branch `grugops/scribe-snapshot-rule`, worktree `../wt-scribe-snapshot`, tip `6e64861c` (AGENTS.md edit `8187ee19`, notes `6e64861c`). Nothing pushed or merged. Base `7240156d`.
Notes (sealed via `admitAndAppend`, `findings: []`), in the worktree under `.grugops/context/scribe-snapshot-rule/notes/`:
`20261021T092243Z-agents-md-scribe-decision-42f5eecb` and `20261021T092243Z-agents-md-scribe-observation-310c268d`.

- **Change** (`## Test and UAT authority`, third kit-override paragraph only; count stays three):
  - The existing `git diff --name-only … | grep -v '\.test\.ts$' | grep '^src/'` is stated as the unfiltered reference measurement; no brief may add a `__snapshots__` filter.
  - Snapshot-only exception (owner 2026-10-17, `…be910aa8`): if it lists only `src/__snapshots__/*.snap`, the waiver holds only if the Orchestrator reads every changed `.snap` and records that in the Done note; any change the criteria do not explain voids it and UAT goes to the owner.
  - Authority line points at `…be910aa8` and the grant `…d9aa42b9`.
- **Bytes:** 24,554 -> 24,560 (budget 24,576, 16 B headroom).
- **Trimmed (stale prose):** the `Close-out: ABC-063 … ABC-064` sentence; `(ABC-065, ABC-066 accepted this way)`; the `human_admission … stamp` parenthetical in "Two misreadings"; the three quoted section titles in the Test/UAT Authority line (now "Standing directive" §§ of 2026-08-15/-16/-17); QE "Forward-only" reworded shorter; QE "completely unamended" dropped; Kit-vs-state "Clear voice — … not a joke." line.
- **Untouched:** the 12 rules, merge-authority text, the Dev / run slot.
- **Check:** `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "AGENTS.md"`, one file: 8 passed, 80 skipped by filter, exit 0. Full suite not run (not asked).
- **Claim note:** `claimed/scribe-snapshot-rule/` was an empty directory (no `claim.md`, brief still in `pending/`); this hop wrote `.claim.md` here and moved the brief to `done/`, removing the empty claim directory.
- **For the Orchestrator at merge:** `AGENTS.md` is the only file changed; ABC-163's and other in-flight branches do not touch it. `plans/traceability.md` not edited by this hop.

### Trace row (for the Orchestrator to append to `plans/traceability.md`)
| QE-159-f | AGENTS.md carries the owner's snapshot-only waiver clause (third kit override; unfiltered measurement is the reference) | EPIC-002 | — | — | AGENTS.md `## Test and UAT authority` (8187ee19, branch grugops/scribe-snapshot-rule) | `src/cli.test.ts -t "AGENTS.md"` 8/8 at 400; 24,560 B ≤ 24,576 | waiver applies (docs only, 0 src lines) | — | Branch ready for gate and merge |
