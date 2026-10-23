---
id: 20261023T190604Z-architect-design-decision-a71ea004
kind: decision
by: architect-design
at: 2026-10-23T19:06:04Z
verified_by: 
confidence: high
refs:
  - arch-runbook-deploy-holder
  - memory-bank/70-runbook.md
  - memory-bank/60-progress.md
  - memory-bank/45-standing-rulings.md
  - ADR-0007
  - ad9655fc
  - eb5e4612
  - 9dd5b59e
  - 20261023T190206Z-architect-design-decision-b9dc8455
supersedes: 
seal: sha256:98fbc46829726e36dd675fe3915b8989956dd29017301be8b6f44d9e2c744ee5
---

# Architect/Design: `70-runbook.md` § Deploy and § On-call corrected to the owner's 2026-08-15 deploy directive (records only, no STOP)

**What was done.** This is on branch `grugops/arch-runbook-deploy-holder`, commit `eb5e4612`, one commit on `main` `ad9655fc`. It is records only. `memory-bank/70-runbook.md` changed +27/−0, and no line was deleted. There are three edits, each a dated addition placed under the old wording:
- **Header.** An `_Updated: 2026-10-23 … (task arch-runbook-deploy-holder)_` line sits under the two earlier ones.
- **§ Deploy.** A `[CORRECTED 2026-10-23 …]` bracket follows the "Two things stay true anyway" bullets. It covers three things:
  - "a human holds deploy" is no longer true. The agent may deploy, no deploy is needed, and nothing runs anywhere but locally.
  - "`production_requires_human_confirmation` is `true`" still holds. A human confirms anything production. Only the owner's explicit word moves the flag.
  - "DEPLOY IS NOT INCLUDED" is retired, per the directive's table. Merge approval is still not deploy approval, because they are two separate grants. That matches `ADR-0007` clause 4 as amended on 2026-08-15.
- **§ On-call.** A `[CORRECTED 2026-10-23 …]` bracket is indented under the owner bullet. "holds deploy" is to be read as: the owner holds the product decisions; the agent may deploy; no deploy is needed; nothing runs anywhere but locally. The flag stays `true`. The bracket points to the § Deploy bracket for the quoted ruling.

**Authority.** The Orchestrator's ruling in `9dd5b59e` (`orch-2026-10-23x`; brief `arch-runbook-deploy-holder` and its ref README) on my STOP `20261023T190206Z-architect-design-decision-b9dc8455`. The Orchestrator ruled the deploy-holder wording drift against a recorded owner directive, not a new governance call. The directive is `memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test and UAT are the agent's, per ticket. 2026-08-15." `memory-bank/45-standing-rulings.md` reads it at lines 142–148. This is not an ADR, and no decision changed.

**Quoted, not paraphrased.** Each string below was checked against `60-progress.md` with line wraps, `> ` and `**` normalised away, and each matched:
- *"I allow you to deploy, but this project does not need to be deployed, it is local for now until completed, mark that down."*
- *"What moved is who holds the deploy key, not where anything runs."*
- *"it is local for now until completed"*
- *"`production_requires_human_confirmation` is STILL `true`. THIS ENTRY DID NOT FLIP IT."*
- *"RETIRED by grant 1 — deploy is now allowed (and not needed)"*
- *"DEPLOY IS NOT INCLUDED"* (the 2026-08-06 limit, kept as the old wording)

**STOP check: did not fire.** The directive settles every point the runbook touched:
- It names who holds the deploy key.
- It says no deploy is needed and where things run.
- It says the flag was not flipped.
- It says the 2026-08-06 deploy limit is retired.

`ADR-0007` (amended 2026-08-15) already reads the same way: "Fact B — PERMISSION. An agent may deploy", with the flag untouched. "A human confirms anything production" is the meaning of the flag `production_requires_human_confirmation: true`, which `.grugops/factory.config.json` still holds (checked at this hop). It is not presented as a quotation.

**Left as written, on purpose.**
- The template's HTML FORMAT comment ("a human confirms a deploy or rollback; agents never deploy to production unattended") is the shipped scaffold text. It is consistent with the flag being `true`, and it is outside § Deploy and § On-call.
- The "Read this first" box, § Operate and § Roll back are untouched.

**Not touched.** `src/`, `package*.json`, `plans/`, ADRs, `AGENTS.md` and config are untouched. No board column moved. Nothing was pushed or merged. Nothing was deployed.
