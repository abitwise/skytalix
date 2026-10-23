---
subtask: arch-adr0007-bin-note
role: architect-design
ticket: memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md
ref: .grugops/context/arch-adr0007-bin-note/
width: 2 (records only; disjoint files from bapm-close-EPIC-007-M2)
---

# Add the owner-approved dated note to ADR-0007 recording `bin` since ABC-168 (records only)

## Do
- The owner approved (`…d3681daa`) a dated note on ADR-0007 / §Deployment posture recording that `package.json` has carried a `bin` (`skytalix` → the built `dist/uci.js`) since ABC-168. Read the AR-1 re-statement records named in the ref README for the exact facts, and verify them against `main` (`package.json`, `git log` of the `bin` line).
- One dated, additive note. It records a fact; it does not reverse or amend the decision, and the local-only posture is unchanged. If you find the fact DOES change the posture (e.g. it implies publishing), STOP and report: that is a new ADR and the owner's.
- If `memory-bank/00-index.md` or the ADR index needs a pointer, keep it to one line.

## Fences
- Work on `grugops/arch-adr0007-bin-note` (worktree `../wt-arch-adr0007-bin-note` from `main`). Only ADR-0007 (+ an index line) and your notes. No `src/`, `package*.json`, `plans/`, `.grugops/factory.config.json`, `AGENTS.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/arch0007/`. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-adr0007-bin-note`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
