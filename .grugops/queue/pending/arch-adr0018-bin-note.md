---
subtask: arch-adr0018-bin-note
role: architect-design
ticket: memory-bank/50-decisions/ADR-0018-distribution-channel-git-clone-npm-run-chess.md
ref: .grugops/context/arch-adr0018-bin-note/
width: 1 (records only)
---

# Owner-approved dated note on ADR-0018 (bin since ABC-168) + runbook § Deploy wording

## Do
- The owner approved (`…366ebd9e`) a dated, additive note on ADR-0018 recording that `package.json` has carried a `bin` (`skytalix` → built `dist/uci.js`) since ABC-168, the same fact as ADR-0007's note (`…0f003634`). Re-verify on current `main`. Context row 2 and Decision 1 stay as dated history; add a pointer in `## Status` and a closing `§ Note 2026-10-23` section, as you did on ADR-0007. Name how D2 (or ADR-0018's equivalent falsifier) reads from now on.
- If the fact changes the channel (`git clone` + `npm run chess`), STOP and report: that is a new ADR and the owner's.
- `memory-bank/70-runbook.md` § Deploy: correct "Nothing is published, built or deployed" with a dated edit (the UCI artifact is built locally by `npm run build`; still nothing published or deployed). Keep the old wording visible.

## Fences
- Work on `grugops/arch-adr0018-bin-note` (worktree `../wt-arch-adr0018-bin-note` from `main`). Only ADR-0018, `memory-bank/70-runbook.md` and your notes. No `src/`, `package*.json`, `plans/`, `.grugops/factory.config.json`, `AGENTS.md`. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/arch0018/`. Seal notes with an explicit context root in your worktree (not the plugin folder). Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-adr0018-bin-note`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.
