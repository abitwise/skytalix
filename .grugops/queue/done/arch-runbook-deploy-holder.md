---
subtask: arch-runbook-deploy-holder
role: architect-design
ticket: memory-bank/70-runbook.md
ref: .grugops/context/arch-runbook-deploy-holder/
width: 2 (records only; disjoint files from scribe-drift-2026-10-23)
---

# Align the runbook's "who holds deploy" wording with the 2026-08-15 owner directive (records only)

## Do
- Your STOP (`…b9dc8455`) is ruled by the Orchestrator: it is drift, not a new governance call. The owner decided deploy authority on 2026-08-15 (`memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED…"; read in `45-standing-rulings.md` lines 142–148). Correct § Deploy and § On-call with dated edits that state that ruling exactly as recorded: the agent may deploy, no deploy is needed, nothing runs anywhere but locally, and `production_requires_human_confirmation` stays `true` (a human confirms anything production). Keep the old wording visible.
- Quote, don't paraphrase, where the directive's words are the authority. If the recorded directive and the runbook genuinely conflict in a way the directive does not settle, STOP again and quote both.

## Fences
- Work on `grugops/arch-runbook-deploy-holder` (worktree `../wt-arch-runbook-deploy-holder` from `main`). Only `memory-bank/70-runbook.md` and your notes. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/runbook2/`. Seal notes with an explicit context root in your worktree. Never push, force, amend or rebase; never merge into `main`.

## Publish
- Seal notes via the plugin writer (task `arch-runbook-deploy-holder`), `at` from `date -u`, with a `kind: decision`. Write `## Result` plus a 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE, and no STOP fired** (Architect/Design, 2026-10-23). The branch is `grugops/arch-runbook-deploy-holder` @ `12fac86b`, two commits on `main` `ad9655fc`: `eb5e4612` (the runbook) and `12fac86b` (the note). Records only. The diff is +27/−0 on `memory-bank/70-runbook.md`, and no line was deleted. The old wording stays in place above each correction.

- **Header:** a dated `_Updated: 2026-10-23 … (task arch-runbook-deploy-holder)_` line was added.
- **§ Deploy:**
  - Old (kept): "`production_requires_human_confirmation` is `true`, and a human holds deploy." and "Merge approval is not deploy approval … *"DEPLOY IS NOT INCLUDED."*"
  - New: a `[CORRECTED 2026-10-23 …]` bracket under those bullets. It quotes the owner and the directive. Read "a human holds deploy" as: the agent may deploy, no deploy is needed, and nothing runs anywhere but locally. The flag still holds: a human confirms anything production, and only the owner's word moves it. "DEPLOY IS NOT INCLUDED" is retired per the directive's table. Merge approval is still not deploy approval (two separate grants), as `ADR-0007` clause 4 already reads.
- **§ On-call:**
  - Old (kept): "The project owner (Olger Oeselg) holds deploy and the product decisions."
  - New: an indented `[CORRECTED 2026-10-23 …]` bracket. The owner holds the product decisions; the agent may deploy; no deploy is needed; nothing runs anywhere but locally. `production_requires_human_confirmation` stays `true`, and a human confirms anything production. It points to the § Deploy bracket.
- **Quoted verbatim:** every quoted string was checked against `60-progress.md` with line wraps, `> ` and `**` normalised away, and every one matched.
  - *"I allow you to deploy, but this project does not need to be deployed, it is local for now until completed, mark that down."*
  - *"What moved is who holds the deploy key, not where anything runs."*
  - *"it is local for now until completed"*
  - *"`production_requires_human_confirmation` is STILL `true`. THIS ENTRY DID NOT FLIP IT."*
  - *"RETIRED by grant 1 — deploy is now allowed (and not needed)"*
- **STOP check:** it did not fire. The directive settles who holds the key, the need for a deploy, where things run, the flag, and the retired 2026-08-06 limit. `ADR-0007` (amended 2026-08-15) agrees. Config `production_requires_human_confirmation` is `true` (re-read).
- **Left as written:**
  - The template's FORMAT comment. It is consistent with the flag and outside both sections.
  - "Read this first", § Operate and § Roll back.
- **Note** (in `.grugops/context/arch-runbook-deploy-holder/notes/` on the branch): sealed by grugops 2.1.0 `admitAndAppend` with an explicit worktree context root, read back as 1 note, index rendered.
  - `20261023T190604Z-architect-design-decision-a71ea004`
- **Not touched:** `src/`, `package*.json`, `plans/`, ADRs, `AGENTS.md`, config. No column moved. Nothing was pushed, merged or deployed.

### Trace row (10 cells, header order)

| 70-runbook.md (arch housekeeping) | Architect/Design: runbook § Deploy and § On-call "who holds deploy" corrected with dated brackets (old wording kept) to the owner's 2026-08-15 directive, quoted verbatim: the agent may deploy, no deploy is needed, local only; production_requires_human_confirmation stays true; the 2026-08-06 "DEPLOY IS NOT INCLUDED" limit is marked retired. Closes the STOP …b9dc8455 per the Orchestrator's ruling 9dd5b59e | EPIC-006 | — | ADR-0007 | `grugops/arch-runbook-deploy-holder` @ `12fac86b` (records only)<br>`.grugops/context/arch-runbook-deploy-holder/notes/` (…a71ea004) | records only; quotes checked verbatim against 60-progress.md; config flag re-read true | — | — | DONE (no STOP); merge is the Orchestrator's |
