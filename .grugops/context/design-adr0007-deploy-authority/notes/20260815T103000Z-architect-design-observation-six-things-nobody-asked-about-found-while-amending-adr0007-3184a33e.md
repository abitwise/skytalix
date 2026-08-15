---
id: 20260815T103000Z-architect-design-observation-six-things-nobody-asked-about-found-while-amending-adr0007-3184a33e
kind: observation
by: architect-design
at: 2026-08-15T10:30:00Z
verified_by: 
confidence: high
refs:
  - ADR-0007
  - memory-bank/70-runbook.md
  - memory-bank/30-architecture.md
  - .claude/agents/
  - production_requires_human_confirmation
  - ABC-042
  - EPIC-006
supersedes: 
---

# Six things nobody asked about, found while amending `ADR-0007` — each measured, each with an owner, none fixed here

> **Hand-authored `observation`.** Neutral facts noticed during the work. Nothing here is asserted as
> verified; no stamp is claimed and none is emittable on this install.

## 1. The same stale sentence lives in TWO more memory-bank files, and `ADR-0007` cites one of them

The amendment fixed `ADR-0007`. **The deployment-posture family is three documents, and the other two
still say a human holds deploy.**

| file:line | text | status after 2026-08-15 |
|---|---|---|
| `memory-bank/70-runbook.md:61` | *"`production_requires_human_confirmation` is `true`, **and a human holds deploy**."* | first half TRUE, **second half STALE** |
| `memory-bank/70-runbook.md:63-64` | *"**Merge approval is not deploy approval.** … *DEPLOY IS NOT INCLUDED*."* | scope statement still true; **the limit it quotes is RETIRED** |
| `memory-bank/70-runbook.md:89` | *"**The project owner (Olger Oeselg) holds deploy** and the product decisions."* | **STALE** — the keystroke is now the agent's; the authority is still the owner's |
| `memory-bank/30-architecture.md:146` | *"the never-deploy limit in every role stays"* | **overridden on this project** by the owner's directive; the kit files themselves are unchanged |

**This matters more than it looks.** `ADR-0007`'s `D6` mitigation cites
`memory-bank/70-runbook.md § Deploy` **by name** as one of the two places that stop a role reading
`["local"]` as a deploy target — so a stale runbook weakens a falsifier in the ADR I just amended.
And **the runbook is the first file a reader opens when the question is "may I deploy"**; the ADR is
the second.

**Not fixed here, and the reason is scope discipline rather than doubt.** My Definition of Done names
`ADR-0007`; a second agent was live in the same worktree; files outside a named scope are exactly
where two parallel hops collide. **Owner: Architect/Design, at a follow-up hop of one file each.**

## 2. Two of those files also still say the game cannot be run — stale since `ABC-042`, 2026-08-14

Found while checking the above, unrelated to deploy authority and older than it:

- `memory-bank/70-runbook.md:26` — *"**The game cannot be run.** There is no CLI entry point … `src/`
  has no entry module. `AGENTS.md` records `Dev / run: UNKNOWN - verify`"*
- `memory-bank/30-architecture.md:31-32` — *"There is still no barrel and **no entry module** …
  `AGENTS.md` records `Dev / run` as `UNKNOWN - verify` because nothing starts a game"*
- `memory-bank/30-architecture.md:138` — the same claim inside the deployment-posture section

**`AGENTS.md` has recorded `Dev / run: npm run chess` since 2026-08-14, verified by the Scribe, and
`src/cli.ts` exists.** Both files cite `AGENTS.md` as their evidence for a claim `AGENTS.md` itself
stopped making. **`30-architecture.md`'s bullets are honestly dated (*"RE-VERIFIED … 2026-08-12"*)
and `70-runbook.md` carries `_Updated: 2026-08-06_`, so neither is a fabrication — they are dated
measurements that expired two days later and read present-tense.**

**`package.json` still has no `start` script and no `bin`, so the "not publishable / nothing to
deploy" halves of those same paragraphs are still exactly right.** `AGENTS.md`'s own
*"Runnable is not deployable"* is the sentence both files are missing.

## 3. All 17 generated role adapters tell every agent that humans hold merge and deploy

`.claude/agents/*.md` — 17 files, each carrying:

> `Never merge to a protected branch. Never deploy to prod. Humans always hold merge and deploy.`

**That contradicts two standing owner directives** — merge since 2026-08-06, deploy since 2026-08-15
— and it is **the first thing every role reads on activation**, above `AGENTS.md`.

**It cannot be repaired where it is read.** The files carry
`<!-- GENERATED — do not hand-edit. Re-run: node scripts/generate-role-adapters.js -->`; hand-editing
them is wrong and regeneration restores the line. **The generator is not present**: there is no
`scripts/` directory in this repo and none at the kit root (`UNKNOWN - verify` for wherever the
plugin ships it). The kit text they are generated from is read-only and project-agnostic.

**So nothing is broken and nothing is fixable at this level** — the project's answer is the
precedence paragraph, which now exists for merge (`AGENTS.md`), for deploy (this ADR's clause 4
block) and in `60-progress.md`. **The residual risk is that the precedence paragraph is in the
document an agent reads SECOND.** It is the same shape as the merge contradiction this project has
lived with since 2026-08-06 — recorded so the deploy half is not mistaken for a new defect. **Owner:
the owner, at install level, or nobody.**

## 4. `production_requires_human_confirmation` has no instrument — the fifth instance of one pattern

Checked at this hop: **no `scripts/` directory**; `.claude/settings.json` enables a plugin and
registers **no hook**; `.claude/hooks/` does not exist; no test asserts the value. **Nothing on this
install reads `.grugops/factory.config.json` mechanically.** The flag is prose honoured by roles.

**That is the same class the Orchestrator recorded hours ago for the coverage bar** — a stated rule
with a number, an instrument, and nothing connecting them — and it is now the **fifth** instance on
record (`ABC-058`'s three security-bar instruments, `ABC-059`'s spelling guard, `ABC-050`'s lane
runner, the coverage bar, this flag). **Recorded in the ADR as an argument, not as a defect to fix:**
a rail with no instrument is exactly as strong as its prose, which is precisely why the prose must
not be weakened casually. **No ticket is proposed — building a hook for a flag guarding an act that
cannot happen would be gold-plating.**

## 5. The shared context's `at` values are not a usable replay key on this install

The note contract calls `at` *"the authoritative replay sort key"*. Measured on this machine while
claiming:

| source | value |
|---|---|
| `date -u` at the bare `mkdir` | **`2026-08-15T10:13:52Z`** |
| the parent task's own Orchestrator note | `2026-08-15T13:10:00Z` |
| this subtask's `enqueued_at` | `2026-08-15T13:20:00Z` |
| newest `at` anywhere in `.grugops/context/` | **`2026-08-16T10:35:00Z`** |
| the last commit's author date | `2026-08-15T13:09:40+03:00` (= `10:09:40Z`) |

**Three tasks on the same day span 26 hours of `at` values while the machine clock reads earliest of
all.** So sorting the whole context by `at` does not reconstruct what happened.

**I used the measured wall clock and did not adjust a timestamp forward to make the ordering look
right** — the consequence is that this hop's notes sort BEFORE the parent note that caused them.
**A false timestamp is a fabricated measurement; a true one with a recorded ordering caveat is not.**
Consistent with the local-time-vs-UTC drift three earlier hops already recorded. **Owner: nobody
today; it becomes real the day something replays the context mechanically, and `context-io.ts` — the
thing that would — is absent.**

## 6. `ADR-0007`'s Context table is the part that aged BEST, and it is worth copying

Every row in `## Context` is written as *"checked … method … result, **at this hop**"*. **Nine days
and two owner directives later, not one of those rows needed a correction** — I re-ran `D1`–`D4` and
all four still hold. The rows that went stale were the ones written in the present tense about
authority (*"a human holds deploy"*), not the ones written as **dated measurements**.

**The lesson is cheap and general: a measurement with a date on it never becomes a lie; a
present-tense statement about who may do what becomes one the moment an owner speaks.** Items 1 and 2
above are entirely instances of the second kind.
