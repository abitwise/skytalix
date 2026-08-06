---
id: 20260806T222200Z-agents-md-scribe-observation-3da32e28
kind: observation
by: agents-md-scribe
at: 2026-08-06T22:22:00Z
verified_by: 
confidence: high
refs:
  - refinement-deploy-posture-2026-08-06
  - agents-md-deployment-section
  - 20260806T222000Z-agents-md-scribe-decision-dfe783f9
  - AGENTS.md
  - memory-bank/70-runbook.md
  - EPIC-006
supersedes: 
---

# The `## Commands` audit, slot by slot — nothing misleads about deploy, nothing was filled, nothing was run

The subtask asked whether any command slot currently implies a deploy target. Every slot was read and
judged. **Verdict: no slot changed.** Recorded slot-by-slot so a later reader can disagree with a
specific line rather than re-audit the table.

| Slot | Current value | Verdict |
|---|---|---|
| Install / bootstrap | `npm install` | real, deploy-neutral. **Keep** |
| Dev / run | `UNKNOWN - verify` <!-- no CLI entry point until EPIC-006 --> | **genuinely unknown and MUST STAY.** There is no `index.ts` / `main.ts` / `cli.ts`; the comment already names the reason and the trigger. Filling this would be the exact fabrication the file forbids |
| Perft harness / deep / spike | `npm run perft`, `PERFT_DEEP=1 npx vitest run src/perft.test.ts`, `npm run spike:perft` | real, local-only by nature. **Keep** |
| Test (all / single) | `npm test`, `npx vitest run <path>` | real. **Keep** |
| Acceptance / BDD | `UNKNOWN - verify` | genuinely unknown; unrelated to deploy. **Keep** |
| Skip-count capture | `npx vitest run --reporter=json … | jq …` | real, verified 2026-07-22. **Keep** |
| Lint / Format | `npm run lint`, `npx biome check --write`, `npx biome format --write` | real. **Keep** |
| Typecheck (single / project) | `UNKNOWN - verify` (no single-file mode) / `npm run typecheck` | honest already. **Keep** |
| **Build (use sparingly)** | `npm run build` <!-- currently `tsc --noEmit` … nothing is published until EPIC-006 packaging … a typecheck wearing the build slot's name --> | **the slot most likely to mislead, and it already does not.** The comment states the build emits nothing, says why, and names `EPIC-006` — the same revisit trigger the new posture section names. It claims no mechanism, so it does not pre-empt `EPIC-006`'s undecided distribution question. **Keep, unedited** |
| Docs build / Clean / reset | `UNKNOWN - verify` | genuinely unknown, deploy-neutral, and **outside this subtask**. Filling either would require running a command and would be scope creep. **Keep** |
| E2E | `UNKNOWN - verify` <!-- no runnable game until EPIC-006 … no UI surface yet --> | honest already. **Keep** |
| Stack | TypeScript on Node ≥ 22, ESM, Vitest, Biome; *"no bundler or transpile step in dev"* | already describes a run-from-source local program. Consistent with the posture; **no edit needed** |

**No command in this table mentions deploy, a container, a registry, a cluster or an environment.**
The three places the substrate did claim a deploy target were all config values (the Orchestrator's
list of three), not commands — so the honest finding here is that `## Commands` was already clean and
the fix belonged entirely in prose.

## Two consequences of the no-edit verdict, stated so they are not mistaken for omissions

1. **No `### Deploy` slot exists and none was created.** Reasoning is in the sibling `decision` note:
   `UNKNOWN - verify` means *"go find this command"*, and there is no deploy command to find. The new
   `## Deployment posture` section carries the known-absent fact instead.
2. **`memory-bank/70-runbook.md`'s pointer stays true.** The Architect filled that file at the
   previous hop with **no command of its own**, pointing at `AGENTS.md § Commands` as the single
   source. Because this hop added no command and changed none, that pointer does not go stale, and
   the two files cannot drift apart on a command that only one of them has.

**No command was executed at this hop.** Nothing in `## Commands` was verified or re-verified here, so
nothing was promoted out of `UNKNOWN - verify` — the table's own standing rule (a slot is filled only
after the command has actually been run) is intact.
