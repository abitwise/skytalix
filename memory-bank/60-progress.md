# Progress
_Updated: 2026-08-06 by the Orchestrator (task `refinement-deploy-posture-2026-08-06`, Workflow 07) — **THE DEPLOYMENT POSTURE IS WRITTEN DOWN: THIS PROJECT DEPLOYS NOWHERE AND RUNS LOCALLY.** The owner: *"this project currently does not deploy anywhere, mark that as well, it will be used locally for now."* **"Currently" and "for now" are load-bearing and are honoured — present posture, explicitly revisitable, revisit trigger `EPIC-006`.** A standing-fact section below carries the quote, the reading, and the limits that did NOT move. **Unlike the branching model, the config COULD carry this and now does** — `default_stack.deploy` `kubernetes-ready` → `none-local-only`, `environments` `["dev","staging","prod"]` → `["local"]`, `nfr.availability` `99.9%` → not-applicable — three key contracts each verified in the kit's config reference BEFORE editing. **`production_requires_human_confirmation` stays `true`, every never-deploy limit stands, and no release machinery was deleted.** The absence was **measured, not assumed**: no Dockerfile, no YAML of any kind, no CI, no git remote, no `bin`/`main`/`exports`, no entry module, `plans/releases/` empty. **`ADR-0007` is new and `accepted`** (six clauses, five rejected alternatives, seven falsifiers) and **`memory-bank/70-runbook.md` is filled for the first time** — deliberately carrying NO command, because there is still no way to run the game. Security/NFR ruled the availability bar **retired rather than unmeasured** — it was never in `plans/nfr-catalog.md` at all, only an unadopted bootstrap default — parked with an owner and a named trigger, `PASS_WITH_RISKS`, no required fix. **Six untrue-default and two-documents-disagree items were FLAGGED, NOT FIXED, each with an owner** (see "Open questions nobody has ruled on"); the loudest is `EPIC-006` naming `npx` in four places while `ADR-0007` records distribution UNDECIDED. No ticket cut, no board column moved, no production code changed, nothing deployed. Previously the same day by the Orchestrator (task `ticket-to-pr-ABC-012`, Workflow 04) — **THE BRANCHING MODEL CHANGED AND `ABC-012` IS MERGED AND `Done`.** The owner made merge approval **standing** (*"everything merges to main in this project, set it as branching model and i approve your merges"*), retiring the per-merge-instruction rule recorded on every previous merge in this project. A new standing-directive section below carries the quote, its reading, and **three limits that did NOT move: deploy is not included, the gate still binds, and the authority remains the owner's and is revocable.** **The config was deliberately NOT edited and that is a finding: `autonomy` allows only `diff`/`branch`/`pr` and there is no value meaning "agents may merge"** — inventing one would be a dial nothing reads. `ABC-012` merged by fast-forward `39e260d` → `7355b51`, 8 commits, no merge commit; gates run on the tip and **again on `main`** — 226/226, skip 0, lint + typecheck + build exit 0. It is the **first merge under the new model**. Three gates PASS: QE killed 21 mutants of which **three survived the delivered suite** (all `resetTo` field-copy holes, all hidden because every acceptance test anchored at startpos and took back at **even** ply counts), and Security/NFR **re-measured all six NFR bars independently**, meeting every one at 0.09x–0.67x. Five accepted risks, each owned; no required fix. UAT deferred → `EPIC-006` — **now the only human checkpoint left before code lands, which is flagged for revisit when a runnable game exists.** **Nothing deployed; a human still holds deploy. No branch was deleted — that call is put back to the owner.** Previously 2026-08-04 by BA/PM (task `refinement-2026-08-04`, subtask `ba-pm-generator-defect-and-abc014-knot`, Workflow 07) — **both unowned items are closed and the pull order is fixed: `ABC-012` → `ABC-014` → `ABC-009` → `ABC-022` → `ABC-013`.** **`ABC-022` CUT** (`S`, `P1`, `EPIC-001`, straight to `Ready`) for the `generateMoves` en-passant precondition defect — **reproduced by this role before cutting**, not accepted from the three roles that described it and cut none, and the reproduction found three things none of them said: the shape is **piece-agnostic** (a rook reproduces it, not only the two knight FENs on record); the branch carries **two** defects, and the unrouted one makes **`legalMoves` permanently corrupt its argument**; and **the legality filter does NOT reject the over-offered move** — perft is silent because the trigger population is empty (**0 of 518,474 reachable nodes**), not because the filter absorbs it, which means **no perft depth or added position can ever reach this defect**. **`ABC-011`'s guard (a) is confirmed NOT deletable, and more strongly than QE put it:** deleting it makes the predicate answer `true` on **both** classes, because `hasLegalEnPassant` synthesises its probe and never consults the generator. **`ABC-022` is `P1`, not `P0`, so it does NOT precede `ABC-012`** — the open conditional, answered on this board's own P0 test. **The `ABC-015`/`ABC-014`/`RISK-005` knot is UNTIED and `ABC-014` is pullable:** `ABC-015`'s wording was the wrong one and the constraint binds at **`ABC-018`**, corrected in place in four files. `Ready` 4/8 → 5/8; no limit approached, no override taken. **Nothing merged, nothing deployed, no production code changed.** Previously 2026-08-04 by the Orchestrator (task `ticket-to-pr-ABC-011`, Workflow 04) — **ABC-011 is MERGED to `main` and `Done`.** Fast-forward `4a73cf3` → `d3efba6`, 16 commits, no merge commit; gates run before the merge on the tip and again **after it on `main`** — 214/214, skip count 0, lint + typecheck + build exit 0. Merge performed by an agent on **explicit human instruction**, which is **not standing authorization**; the branch was not deleted. UAT deferred → EPIC-006. The **"Next action"** section is rewritten: two unowned items go to BA/PM **before** the next pull, because one of them is a move-generation legality defect that may outrank `ABC-012` under the owner's standing directive. Previously 2026-08-03 by Architect/Design (task `ticket-to-pr-ABC-011`, subtask `architect-abc011-defect-definition-and-ratify`, Workflow 04) — **ABC-011's SECOND design hop is closed and the ticket is back in `Ready for Dev`.** Three things were owed and all three are ruled. **(1) The MEDIUM defect's definition question: purity is UNCONDITIONAL and is bought with a PRECONDITION on the probe move, not with a change to what the predicate means; the answer stays domain-restricted and is SPECIFIED (`false`, touching nothing) where the board contradicts the ep square, because the ruled oracle is demonstrably unsound there — `generateMoves` corrupts on two of QE's three FENs and offers a pawn capturing onto the mover's own knight on a third.** Two guards, not one: the captured-pawn guard buys purity and closes a **fourth** reproduction no prior role had; the empty-target guard buys oracle agreement and is needed only for two **pure** divergences constructed at this hop. Re-derived on a fourth independent script: 518,474 nodes / 81,397 ep-set, **0** answers changed, **0** keys changed, **0** guard firings on the reachable population; 193/193 green in a sandbox with no existing test edited. **(2) Castling is NOT the en-passant case** — `zobristKey` keeps hashing castling **rights**, ruled in **`ADR-0006`** from the retained FIDE text whose sha256 **and currency** were both re-verified that day. **(3) `ADR-0005` is `accepted` WITH AN AMENDMENT** (one of its statements was false as written) and **`ADR-0006` is new and `accepted`** — the first ADRs ratified under the owner's standing directive of 2026-08-03, both carrying per-clause falsifier tables. Board: `Ready for UAT` 1/4 → 0/4, `In Design` 0/2 → 1/2 → 0/2, `Ready for Dev` 0/6 → 1/6; no limit approached, no override taken. **No production code changed**, size stays `M`, and one item (`generateMoves` offering a capture onto the mover's own piece) is **routed to BA/PM rather than cut here**. Previously 2026-08-02 by Architect/Design (task `ticket-to-pr-ABC-011`, Workflow 04) — **ABC-011's first design hop is closed: "an en-passant capture is available" is ruled to mean a LEGAL one (strict FIDE 9.2.3), the predicate is homed in `src/legal.ts` with `src/zobrist.ts` importing it, the ticket is re-sized `S` → `M` and not split, and it sits in `Ready for Dev`.** `ADR-0002` is extended around and NOT amended (no human ruling owed, none taken); **`ADR-0005` is written and is `proposed` — no agent may accept it, and ABC-011 is not blocked on it.** Board: `Ready` 5/8 → 4/8, `In Design` 0/2 → 1/2 → 0/2, `Ready for Dev` 0/6 → 1/6; no limit approached, no override taken. No production code changed. Previously the same day by BA/PM (task `refinement-fide-9-6-1`, Workflow 07) — **open question 1 CLOSED: FIDE 9.6.1 does NOT say "consecutive" and `src/gameend.ts` conforms**, ruled against the Laws text retrieved by this role from `handbook.fide.com` and retained verbatim under the task's context folder. No ticket cut, no board move (`Ready` stays 5/8), no code change owed on `main`. The "Next action" section is re-pointed accordingly. Previously the same day by the Orchestrator (ABC-020 merged to `main` on explicit owner instruction; branch stack resolved, board closed). Earlier the same day: first fill of this file, which had been the shipped empty template while the project ran to 27 unmerged commits._

<!--
  The running plan-of-record. Read this FIRST on start, then `plans/board.md`. Keep it short and
  current; it is an orientation file, not a document dump. The detail lives in the files it points
  at — `plans/board.md` (WIP truth), `plans/traceability.md` (the trail), `.grugops/context/<task>/notes/`
  (verified context), `memory-bank/50-decisions/` (ADRs).
-->

## Standing directive — the branching model, and who turns the merge key. **This supersedes "a merge needs its own explicit instruction".**

**Project owner Olger Oeselg, 2026-08-06**, quoted verbatim:

> *"everything merges to main in this project, set it as branching model and i approve your merges"*

**This is standing and it is a governance change, not a one-off.** Until this date, every merge in
this project's history was recorded with the same sentence — *performed by an agent on explicit human
instruction and NOT standing authorization* — on `ABC-001/002/003/008`, the `ABC-004..007` stack,
`ABC-020`, `ABC-011` and `grugops/refinement-2026-08-04`. **That rule is retired by the owner.** The
first merge under the new one is `ABC-012` (`39e260d` → `7355b51`, 2026-08-06).

**How this is read, stated explicitly so a later reader can check the reading rather than inherit
it.** Two separate things were granted in one sentence and they are recorded separately:

- **The branching model is trunk-based.** `main` is the single long-lived branch. Work happens on a
  short-lived `grugops/<task>` branch — *not* as a formality, but because the branch is the only
  place a gate can run **red** without `main` ever being red — and it merges to `main` as soon as it
  is green. **No `develop`, no release branches, no long-lived feature branches.** The full rule
  belongs in `AGENTS.md` and is the AGENTS.md Scribe's to write; this entry is the authority it
  cites, not the specification.
- **The merge keystroke is delegated, standing and revocable.** An agent may merge gated work to
  `main` without asking each time.

**THREE LIMITS ARE UNCHANGED. They are named here because a grant that is not bounded in writing
gets read wider than it was given.**

1. **DEPLOY IS NOT INCLUDED.** The owner wrote *merges*. `production_requires_human_confirmation`
   stays `true`, and merge approval is **not** rounded up to deploy approval. A human holds deploy.
2. **THE GATE STILL BINDS.** This is approval to merge work that has **passed**, never approval to
   skip, soften or self-certify a gate. `quality.gate_enforcement` is `blocking`, and the standing
   practice holds: **run the gates on the branch tip before the merge and again on `main` after it**,
   and record both. A red gate is still a stop, and the owner did not authorize otherwise.
3. **THE AUTHORITY IS STILL THE OWNER'S.** What was delegated is the keystroke, not the right. One
   sentence revokes it. An agent that merges is exercising the owner's standing decision, not its own.

**THE CONFIG WAS DELIBERATELY NOT EDITED, and that is a finding rather than an omission.** The
`autonomy` dial allows only `diff` / `branch` / `pr`, and the kit defines `pr` as *"branch + open a
PR (agents never merge)"*. **There is no value that expresses "agents may merge", and there is no
`branching_model` key.** Inventing either would place a control in the one file every role reads
first that **nothing reads and nothing enforces** — a fake dial, and exactly the
two-documents-disagree failure this project spent 2026-08-04 untying out of `ABC-015`. `autonomy`
stays `pr` because it still describes accurately how work is **produced** (branch, then gate); what
the owner changed is what happens **after** the gate is green, which `autonomy` does not describe.
**So this file is the authority, and any reader who finds `autonomy: "pr"` and concludes agents may
not merge should read this section — it is newer and it is the owner's.**

**ONE CONSEQUENCE THE OWNER SHOULD SEE, recorded rather than buried.** UAT has been deferred to
`EPIC-006` on every ticket this project has shipped, because no runnable game exists. With the merge
checkpoint delegated, **there is now no human checkpoint between an agent's work and `main`** — the
gates are agents too. That is a reasonable trade while the product has no user-facing surface, and it
is the owner's to make. **It should be revisited when `EPIC-006` produces something a human can
actually exercise**, which is the first moment a human look before merge would buy anything.

**ONE QUESTION WAS PUT BACK TO THE OWNER RATHER THAN DECIDED: are merged branches now deleted?**
Deleting them is ordinarily part of a trunk-based model, but *"everything merges to main"* is a
statement about **destination, not cleanup**, and the owner has twice held that call personally
(2026-08-02, when eight branches were deleted after per-branch validation, and on every merge since).
**Nothing has been deleted.** Three branches are fully contained in `main`:
`grugops/ticket-to-pr-ABC-011`, `grugops/refinement-2026-08-04`, `grugops/ticket-to-pr-ABC-012`.

## Standing fact — this project deploys nowhere and runs locally. **Present posture, revisitable at `EPIC-006`.**

**Project owner Olger Oeselg, 2026-08-06**, quoted verbatim:

> *"this project currently does not deploy anywhere, mark that as well, it will be used locally for
> now."*

**"as well"** points at the branching-model entry above, written the same day: a standing fact about
how this project works, recorded in the substrate rather than left in a chat window.

**How this is read, stated so a later reader can check the reading rather than inherit it.** Two
words are load-bearing and are honoured rather than rounded up:

- **"currently" / "for now"** — this is **present posture, explicitly revisitable**. It is NOT a
  ruling that the project may never be distributed. Nothing that exists to serve a future deploy was
  deleted on the strength of it; what was fixed is every place the substrate **claimed** a deploy
  target that does not exist.
- **"used locally"** — the delivery target is a machine a developer already sits at. There is no
  environment to promote to, so there is nothing to promote **between**.

**The revisit trigger is named rather than left to memory: `EPIC-006` (packaging)** — the first work
here that produces an artifact someone other than its author could run. That is the same parking spot
as the merge-checkpoint consequence recorded under the branching-model directive.

**THE ABSENCE WAS MEASURED, NOT ASSUMED**, by two roles on separate scans: no `Dockerfile`, no
`docker-compose`, no chart, no Terraform, **no YAML file of any kind**; no `.github/workflows/` and
therefore no CI; no git remote; `package.json` is `private: true` with no `bin`, `main`, `exports` or
`start`; `src/` has no entry module; `plans/releases/` holds only `.gitkeep`. Re-checked independently
at close: `git ls-files` matches zero deploy-shaped paths.

**THE CONFIG COULD CARRY THIS, AND THAT IS THE DIFFERENCE FROM THE BRANCHING-MODEL CASE.** Recorded
loudly, because a later reader could easily over-generalise the entry above into "grugops never edits
the config". The branching model had **no expressible dial** — `autonomy` allows only
`diff`/`branch`/`pr`, no value means "agents may merge", no `branching_model` key exists. **That
reasoning does not transfer here.** All three keys below are documented free-form in the kit's own
config reference, each contract verified there **before** editing:

| Key | Was | Now | Ruled by |
|---|---|---|---|
| `default_stack.deploy` | `kubernetes-ready` | `none-local-only` | Architect/Design |
| `environments` | `["dev","staging","prod"]` | `["local"]` | Architect/Design |
| `nfr.availability` | `99.9%` | not-applicable, local-only | Security/NFR |

**`["local"]` was chosen over `[]` deliberately**, and the reason generalises: the kit's
default-on-absent rule reads an absent key back as the three fictional environments, so an empty
array sits one step from an accidental "repair" that reinstates exactly the lie being removed.
**Security/NFR hit the identical trap on `availability` and made the identical call** — deleting the
key reads it straight back as `99.9%`.

**THE AVAILABILITY BAR IS RETIRED, NOT UNMEASURED — the distinction matters here.** `UNKNOWN -
verify` elsewhere in this project means *the quantity exists and nobody ran the instrument*. Here
there is no quantity and no instrument: nothing listens, nothing is up, and *99.9% of what, over what
window, missed by whom* has no answer. One fact settles it independently of the argument — **the bar
was never in `plans/nfr-catalog.md` at all**, only in the FORMAT comment's list of categories to
consider. It was an unadopted bootstrap default, not a commitment anyone made. Parked with owner
(Security/NFR) and a **named condition, not a milestone**: the first time this project ships
something that must be reachable while its user is away from the keyboard.

**THREE LIMITS DID NOT MOVE, named because a fact that is not bounded in writing gets read wider than
it was given.**

1. **`production_requires_human_confirmation` STAYS `true`.** Re-read after every edit. "We have no
   production" is a fact about today; the flag is a rail for the day that changes, and a rail that
   costs nothing while unused is not dead config.
2. **EVERY NEVER-DEPLOY LIMIT STANDS.** This instruction **confirms** the branching model's
   *"DEPLOY IS NOT INCLUDED"* limit rather than modifying it. A human still holds deploy.
3. **NO RELEASE MACHINERY WAS DELETED** — no board column, no workflow, nothing under
   `plans/releases/`. Scope was "stop claiming a deploy target that does not exist", never "remove
   the machinery for ever having one".

**"WE DEPLOY NOWHERE" MUST NEVER BE READ AS "ONLY THIS MACHINE MATTERS."** Security/NFR fenced this
explicitly and it is worth repeating: `RISK-002`'s non-M3 spike, `RISK-004`'s **redistribution**
licence obligation (a `git clone` is still redistribution), `RISK-005`'s terminal portability, and
every one-machine `UNKNOWN - verify` in `plans/nfr-catalog.md` all stand untouched.

**Where the authority lives.** `memory-bank/50-decisions/ADR-0007-deployment-posture-local-only.md`
(six clauses, five rejected alternatives, seven falsifiers, `accepted` under the owner's standing
delegation of 2026-08-03). `AGENTS.md` § "Deployment posture" points at it and does not restate it.
`memory-bank/70-runbook.md` was filled for the first time and **deliberately carries no command at
all** — there is still no way to run the game, `Dev / run` stays `UNKNOWN - verify`, and a fabricated
command in a runbook is worse than an admitted gap.

**No ticket was cut and no board column moved**, the same shape as the branching-model entry.

## Standing directive — deploy is ALLOWED and NOT NEEDED; merge, test and UAT are the agent's, per ticket. 2026-08-15.

**Project owner Olger Oeselg, 2026-08-15, in session, quoted verbatim:**

> *"I allow you to deploy, but this project does not need to be deployed, it is local for now until
> completed, mark that down. Mark also down that you can merge and test each ticket. If you have all
> the tools and you can re-validate test coverage. You can also conduct UAT-s, you have that
> ability."*

**FOUR things were granted in one message and they are recorded separately**, the same discipline the
2026-08-06 entry used, so that a later reader can check the reading rather than inherit it.

### 1. DEPLOY IS ALLOWED — AND IT IS DORMANT, BY THE SAME SENTENCE

**Both halves are the owner's and both are recorded.** The authority to deploy is granted; the need
is denied. **The grant has no surface to act on today**, and that is measured rather than assumed: no
CI, no git remote, no container, no manifest, no release ever cut, `environments: ["local"]`,
`default_stack.deploy: none-local-only`.

- **`ADR-0007`'s posture is CONFIRMED by this sentence, not overturned.** *"it is local for now until
  completed"* says the same thing the 2026-08-06 quote said. **What moved is who holds the deploy
  key, not where anything runs.**
- **"until completed" is NEW wording and is the owner's own bound.** It names a condition, not a
  date, and it sits alongside the trigger already on record: **`EPIC-006` decides distribution** —
  npm, a binary, a `git clone` — and that decision is still not made. Do not fill it in.
- **`production_requires_human_confirmation` is STILL `true`. THIS ENTRY DID NOT FLIP IT.**
  `ADR-0007` built a detection row — **D7** — for exactly that flag being found `false`, deleted, or
  argued obsolete. The owner did not name the flag; the flag has **zero present effect** because
  nothing deploys; and flipping a tripwire that someone deliberately built, on machinery `EPIC-006`
  has not designed yet, is a separate act with its own authority. **Named here, unasked, awaiting the
  owner's explicit word.** `ADR-0007`'s clause that *"a human holds deploy"* is now stale and is
  **Architect/Design's to amend under this directive** — the same shape as `N8-SPAWN`, where the
  owner authorized and the role that owns the document wrote it.
- **The kit still reads "never deploy" and cannot carry a project override.** On this project the
  owner's directive wins; everything else in those files stands unchanged. Same precedence shape as
  the branching model and the deployment posture.

### 2. MERGE AND TEST EACH TICKET — a re-affirmation, and one limit RETIRED

This widens the 2026-08-06 delegation of the merge keystroke and makes it explicit **per ticket**,
with testing named alongside it.

**Of the three limits the 2026-08-06 entry recorded as unchanged, ONE HAS NOW MOVED and TWO STAND:**

| 2026-08-06 limit | status after 2026-08-15 |
|---|---|
| 1. **Deploy is not included** | **RETIRED by grant 1** — deploy is now allowed (and not needed) |
| 2. **The gate still binds** | **STANDS.** `quality.gate_enforcement` is `blocking`. Approval to merge work that PASSED, never to skip, soften or self-certify. Gates run on the branch tip before and on `main` after, both recorded. A red gate is still a stop. |
| 3. **The authority is still the owner's** | **STANDS.** What is delegated is the keystroke, not the right. One sentence revokes it. |

### 3. UAT IS THE AGENT'S TO CONDUCT — and what that does and does not mean

**This answers the open question raised at task `g1-answered-2026-08-15`.** 28 `Done` tickets each
recorded *UAT deferred → `EPIC-006`, explicitly NOT passed*, because nothing was exercisable. **That
reason expired when `ABC-042` merged and `npm run chess` printed a board.** The owner has now said
the ability is the agent's.

**Recorded honestly, because "UAT passed" must not later be read as something it was not:**

- **An agent-run UAT is the execution of the business scenarios and the reporting of the result.** It
  is a real, useful thing: scenarios, test data, pass/fail criteria, and an actual run against an
  actual build.
- **It is NOT a named human's acceptance signature.** The kit's UAT Planner exists to make a pack *so
  a named human can accept the work*; `context.human_admission` is `off` on this install and **no
  `finding` is admissible**, so a UAT result is recorded as `decision` / `observation` like every
  other result and **cannot be stamped**.
- **The owner may define UAT in this project however he wishes** — this entry records the distinction
  rather than deciding it, so that the two readings never quietly merge.

### 4. COVERAGE — the tool was already installed, the bar had NEVER been measured, and it is measured now

**Measured 2026-08-15 by the Orchestrator on `main` @ `7313156`** (Apple M3, Darwin 25.5.0 arm64,
Node v24.12.0, vitest 3.2.7): **`@vitest/coverage-v8` is in `devDependencies` and NO script, and no
`vitest.config.ts` key, has ever invoked it.** `quality.coverage_threshold` is `0.8` and
`quality.mandatory_gates` is `["lint","typecheck","unit","build"]` — **so the coverage bar has a
number, an installed instrument, and nothing that runs it.** First run ever:

| denominator | % stmts | % branch | % funcs | vs `0.8` |
|---|---|---|---|---|
| **all files** (includes `tools/grugops/*.js`) | **79.15** | 99.14 | 97.64 | **NOT MET** |
| **`src/` only** | **97.29** | 99.48 | 100 | **MET, comfortably** |

**The whole question is the denominator, and that is the SAME SHAPE as `N8-LANE`'s** — the defect
`ABC-026` exists for. Two `tools/grugops/*.js` files (279 lines, 0%) decide whether this project is
above or below its own bar. **Not resolved here: choosing a denominator is a bar decision, and a bar
is not an Orchestrator's to set.**

**One finding worth more than the number:** **`src/cli.ts` reads 0% (lines 43–93) — the entry point
`ABC-042` merged today.** It is covered by 29 tests that **spawn it as a child process**, and v8
coverage does not cross a process boundary. **The module is thoroughly tested and completely
invisible to the instrument at the same time.** Consequence, recorded before anyone trips on it:
**any coverage gate adopted as written would go RED on the best-tested new module in the
repository** — and the same child-process strategy is what `N8-SPAWN` exists to account for. One
test strategy, three instruments blind to it.

### What this entry does NOT do

**No config value was changed. No ADR was edited. No gate was added, removed or softened. No ticket
was cut and no board column moved** — the same shape as the branching-model and deployment-posture
entries. `AGENTS.md` is the **AGENTS.md Scribe's** to update and `ADR-0007` is **Architect/Design's**;
this entry is the authority both of them cite, not the specification.

## Standing directive — the owner's word in session IS the `In UAT` signature. 2026-08-16.

**Project owner Olger Oeselg, 2026-08-16, in session, quoted verbatim and complete:**

> *"I accept both, my word is the signature"*

**He was asked a direct question and this is his answer to it.** The Orchestrator put three options to
him for what this project's `In UAT` exit signature is — his word in session, a file he writes
himself, or a redefinition of the exit — and told him explicitly that **a green agent report would
NOT be treated as his acceptance**. He chose the first.

**TWO SEPARABLE THINGS were done in one sentence, and they are recorded separately** — the same
discipline the 2026-08-06 and 2026-08-15 entries used, so a later reader can check the reading rather
than inherit it.

### 1. A per-ticket acceptance — `ABC-065` and `ABC-066`

*"both"* is **`ABC-065` and `ABC-066`**, the two tickets sitting in `In UAT`, conducted and unsigned.
Both are **ACCEPTED by the owner**. This half is spent on those two tickets and is not authority for
any third.

### 2. A standing ruling — what signs the `In UAT` exit here

**The owner's word in session IS this project's `In UAT` exit signature.** Standing, and revocable by
one sentence like every other authority he has delegated here.

**This RESOLVES gap `U1` (MEDIUM)**, raised by the UAT Planner hop at `uat-ABC-065-2026-08-16`, which
found the exit **unreachable by construction**: the kit requires a named human's signoff, and this
install has no channel that could record one. `U1` is closed by the owner naming a signature this
project can actually produce — a spoken word, transcribed into git.

**THE KIT IS NOT OVERRIDDEN HERE. This is a kit requirement SATISFIED.** `agent-factory/workflows/06-uat-pack.md`
and `agent-factory/roles/uat-planner.md` require a **NAMED HUMAN's** signoff and forbid an agent
self-signing. **The owner IS that named human and he gave it.** What was missing was never his
authority — only a **mechanism to record it**, and he has now named the mechanism. **Do not file this
alongside the branching model or the deployment posture as a place where this project overrides the
kit. It is not one.**

**THREE LIMITS, named because a grant that is not bounded in writing gets read wider than it was
given.**

1. **AN AGENT STILL MAY NOT SELF-SIGN.** The ruling says **the OWNER'S WORD signs**. It does not say a
   green agent report signs, and it does not license any agent to sign on his behalf. An agent-run UAT
   is still the **execution and reporting** of the scenarios — evidence offered to the signer, never
   the signature. **This is the exact misreading to expect**, and it is refused in advance: the owner
   was told a green report would not count as his acceptance *before* he answered, so his answer
   cannot be read as having granted it.
2. **THE FIDELITY OF THE RECORD IS AN AGENT'S TRANSCRIPTION, NOT A STAMP.**
   `context.human_admission` is **still `off` and the owner did NOT flip it**. No `finding` is
   admissible here and no `human:<name>` stamp exists or can be written. So the acceptance is carried
   as a **`decision` note in git, hand-authored by an agent from the owner's words in session** — a
   transcription, with the usual provenance of one. That is the honest evidence level and a future
   reader must be able to see it for what it is. **Flipping `human_admission` is the owner's word, not
   anyone's inference from this one, and is not proposed here.**
3. **THE SCOPE IS THE `In UAT` EXIT SIGNATURE ONLY.** Nothing else moved.
   `quality.gate_enforcement` is still `blocking`; `production_requires_human_confirmation` is still
   `true`; the merge and deploy posture is exactly as the 2026-08-06 and 2026-08-15 entries left it.
   No config value was changed, no ADR edited, no gate added, removed or softened.

**Where this is written down.** `AGENTS.md` § "Test and UAT authority" is updated to record what IS —
that section previously called the signature question genuinely open and forbade resolving it by
inference, **which was correct until the question was put to the owner and he answered it**. That
section points here; **this entry is the authority.**

## Standing directive — a ticket whose delivered diff carries ZERO PRODUCTION LINES has its UAT WAIVED, standing. 2026-08-17.

**Project owner Olger Oeselg, 2026-08-17, in session, quoted verbatim and complete:**

> *"skip UAT for ABC-063, and yes make it a standing rule"*

**Eleven words, TWO CLAUSES OF DIFFERENT KINDS**, and the whole reason this entry exists is that the
distinction survives — the same discipline the 2026-08-06, 2026-08-15 and 2026-08-16 entries used, so
a later reader can check the reading rather than inherit it.

- **Clause 1, `"skip UAT for ABC-063"` — a NAMED WAIVER for ONE ticket.** The fifth in that exact
  form, after `ABC-068`, `ABC-061`, `ABC-062` and the first. Spent on `ABC-063`; authority for no
  other ticket.
- **Clause 2, `"and yes make it a standing rule"` — the ANSWER to a question asked SIX TIMES across
  six tickets** (`ABC-068`, `ABC-061`, `ABC-062`, `ABC-063`, `ABC-064` and the first) **and answered
  none of those times until now.** Each earlier asking got the ticket answered, never the rule. The
  record of "askings without an answer" closes here.

### 1. What the rule IS, stated no wider than the question he said yes to

The question he answered was, in the Orchestrator's words at the close of the sweep: *"should 'zero
production lines, test-only change' become a standing UAT waiver, so this stops consuming a
round-trip every time?"*

**THE RULE: a ticket whose DELIVERED DIFF contains ZERO PRODUCTION LINES — a test-only change — has
its UAT step WAIVED, standing. It moves `Ready for UAT` → `Done` with NO UAT conducted and WITHOUT
the owner being asked per ticket.**

### 2. THE CRITERION IS MEASURED FROM GIT, NEVER ASSERTED

At the `Ready for UAT` exit the delivery commit is measured first-hand:

```
git diff --name-only <delivered>~1 <delivered> | grep -v '\.test\.ts$' | grep '^src/'
```

**EMPTY OUTPUT, AND ONLY EMPTY OUTPUT, INVOKES THE RULE.** A ticket page, a PR body or a role's
summary claiming "zero production lines" is **not evidence**; the diff is. Both tickets in the
2026-08-17 sweep were measured that way *before* the rule was applied to either — `e6697f6`
**`63 0`** and `9957ddf` **`121 0`**, `src/cli.test.ts` only, no non-`.test.ts` file under `src/` in
either. Those measurements are the Orchestrator's, recorded in
`.grugops/context/sweep-ABC-063-064-2026-08-17/notes/`; they are not re-derived here.

### 3. THE LIMITS — named because a grant that is not bounded in writing gets read wider than it was given

1. **ANY PRODUCTION LINE AND THE RULE DOES NOT APPLY.** Not "mostly test". Not "one trivial line".
   Not "the production line is only a comment". **One production line and the ticket needs the
   owner's word exactly as before.** This is the rule most likely to drift by degrees, so the
   boundary is binary and it is measured: the command above returns empty, or the rule is not
   available.
2. **A WAIVER IS NOT A SIGNATURE.** A waived ticket has had **NO UAT conducted** and carries **NO
   human acceptance**. Nobody signed anything and no scenario was executed. **`Done` under this rule
   means MERGED AND GATED — never ACCEPTED BY A HUMAN.** If a later reader finds "UAT waived" on a
   ticket and reads it as someone having accepted the work, that reader is wrong and this sentence
   is the refusal written in advance.
3. **IT WAIVES UAT AND NOTHING ELSE.** `quality.gate_enforcement` is still `blocking`.
   `production_requires_human_confirmation` is still `true` — **he did not flip it and no inference
   may.** `context.human_admission` is still `off`, so there is no `human:<name>` stamp and **no
   `finding` is admissible**; this entry, like every acceptance record here, is a hand-authored
   transcription in git and that is the honest fidelity level. No config value changed, no ADR
   edited, no gate added, removed or softened.
4. **IT IS THE OWNER'S AND REVOCABLE**, on the same terms as every other standing directive in this
   file. One sentence ends it.

### 4. HOW THIS COMPOSES WITH THE 2026-08-16 DIRECTIVE — it does NOT supersede it

**The 2026-08-16 entry ("the owner's word in session IS the `In UAT` signature") STANDS, unamended.**
The two answer different questions and both are live:

| | question answered | applies to |
|---|---|---|
| **2026-08-16** | **WHO SIGNS** a UAT that is conducted | every ticket that goes through UAT |
| **2026-08-17** (this entry) | **WHICH TICKETS NEED NO SIGNING AT ALL** | only tickets measured at zero production lines |

A ticket carrying even one production line still goes through UAT, and the owner's word in session is
still its signature. This entry removes the step for a measured class of tickets; it changes nothing
about the step where it still runs. **Do not read this as having replaced the 2026-08-16 ruling.**

### 5. PRECEDENCE — this one IS a kit override, and that is a DIFFERENT verdict from 2026-08-16 on purpose

**Reasoned here rather than copied from the entry above, because the two cases are not the same.**

`agent-factory/workflows/06-uat-pack.md` and `agent-factory/roles/uat-planner.md` make the `In UAT`
exit **a named human's signoff** and forbid an agent self-signing. Checked at this hop: **the kit
contains no waiver, no "not applicable", and no class of ticket exempt from UAT.** Its UAT stage is
unconditional.

- **2026-08-16 SATISFIED that requirement.** A signature was required, and the owner — who IS the
  named human the kit asks for — gave one. Nothing in the kit was set aside; only a mechanism to
  record his word was supplied. That is why it is explicitly **not** listed among this project's kit
  overrides.
- **This directive DISPENSES WITH the requirement for a measured class of tickets.** No signature is
  produced, because no acceptance happens. The kit asks for a signoff the waived tickets will never
  have. Calling that "satisfied" would be false, so it is recorded honestly as what it is: **a
  project override of the kit's unconditional UAT stage, scoped to tickets whose delivered diff
  measures zero production lines, and to nothing else.** It joins the branching model and the
  deployment posture as the **third** place this project overrides the read-only kit; everywhere
  else — including the UAT stage for every ticket carrying production code — the kit stands
  unchanged.
- **The counter-reading, recorded so it is not lost:** one could argue the person whose signature is
  required may decline in advance to require his own, making this a use of the signing authority
  rather than an override. That reading is available and it is weaker — the 2026-08-16 case produces
  a per-ticket act by the named human, and this one produces none for tickets not yet written. **The
  stronger, more honest verdict is chosen: an override, named as an override.** The owner's word
  settles it either way; the classification is what a future reader gets to check.

### 6. THE 2026-08-17 CLOSE-OUT — two tickets, TWO DIFFERENT AUTHORITIES

Recorded because it is part of the honest record and because one half is a reading, not a quote.

- **`ABC-063` closed by his NAMED WORD** — clause 1, verbatim above.
- **`ABC-064` closed by THE STANDING RULE applied to a MEASUREMENT.** **He named `ABC-063` and did
  NOT name `ABC-064`**, though the question put to him named both. The Orchestrator took the reading
  that the rule reaches the ticket already sitting in the column, because stopping the per-ticket
  round-trip is the thing the owner had just granted, and `ABC-064` met the criterion on measurement
  rather than assertion. **That call is the Orchestrator's, not the owner's, and ONE LINE FROM THE
  OWNER REVERSES IT** — `ABC-064` reopens as a board move, nothing else; its merge and its gate were
  never in question.

### What this entry does NOT do

**No config value was changed** — `.grugops/factory.config.json` has no dial that can express this
rule and none was invented, the same call the branching-model entry made about `autonomy`. **No ADR
was edited, no gate added, removed or softened, no ticket cut and no board column moved by this
hop.** `AGENTS.md` § "Test and UAT authority" points here; **this entry is the authority.**

## Standing directive — EVERY ticket passes through QE's validation. QE dispatch resumes. 2026-08-17.

**Project owner Olger Oeselg, 2026-08-17, in session, quoted verbatim and complete:**

> *"QE should yes resume, each ticket needs to pass through QE-s validation"*

**THE RULE: every ticket gets a QE/E2E hop and QE's recorded verdict before it may leave `In Review`.
No ticket reaches `Done` without one.** Asked and answered after a two-step exchange in which the
owner first declined the retro half; both halves are recorded, and the boundary between them is the
point of this entry.

### 1. WHAT THIS REPAIRS — five consecutive tickets, and no decision behind any of them

`ABC-068`, `ABC-061`, `ABC-062`, `ABC-063` and `ABC-064` were all gated and merged with **no
`qe-e2e` hop**. Measured, not asserted: listing every QE-authored note across
`.grugops/context/*/notes/` and sorting by timestamp returns
`20260816T032000Z-qe-e2e-decision-qe-verdict-on-abc065-all-six-criteria-met-d9c47f01.md` as the
newest anywhere — `ABC-065`, 2026-08-16. **No note in this repository records a decision to stop
dispatching QE. It just stopped.** This directive ends that.

### 2. IT IS FORWARD-ONLY — the five closed tickets stay closed, and that is also the owner's call

In the same session the owner declined a retro QE hop over the five (*"the UAT was cancelled for
these 5 tickets so no other action is needed imho"*). **That decision stands and this directive does
not reopen it.** The reasoning, the correction put to him before he made it, and the residual
exposure it accepts — +435/−11 lines of assertions in `src/cli.test.ts` never reviewed by the role
that owns reviewing assertions — are in
`.grugops/context/qe-dispatch-resume-2026-08-17/notes/`. **Forward from the next ticket; backward,
never.**

### 3. THIS IS NOT A KIT OVERRIDE. Do NOT list it with the other three.

`agent-factory/workflows/04-ticket-to-pr.md` **step 5** already reads *"QE/E2E breaks the feature and
reports the result and gaps"*; `05-pr-quality-gate.md` already names QE/E2E a gate participant; the
Orchestrator routing matrix already maps `tests -> QE/E2E`. **The kit already required this hop and
five tickets skipped it anyway.** So this entry ADDS NOTHING to the kit and contradicts nothing in
it — it is a **re-affirmation of a rule that was already binding**, in the same shape as the
2026-08-16 UAT-signature ruling, which SATISFIED a kit requirement rather than overriding one. This
project's kit overrides remain **three**: the branching model, the deployment posture, and the
zero-production-lines UAT waiver. A later reader who finds this and counts four is wrong.

**The consequence worth naming: restating a rule is the weakest possible fix for a rule that was
already there and got dropped anyway.** If this drifts a second time, the answer is a detector — a
check that no ticket reaches `Done` without a `qe-e2e` note in its task folder — not a sixth
restatement. That was offered to the owner and he has not ruled on it; it is NOT cut and NOT assumed.

### 4. THE LIMITS

1. **QE IS NOT UAT AND THIS DIRECTIVE TOUCHES NEITHER THE WAIVER NOR THE SIGNATURE.** The
   zero-production-lines UAT waiver (2026-08-17, above) stands **completely unamended** — a test-only
   ticket still skips UAT, and now still gets QE. The 2026-08-16 signature ruling stands unamended.
   **The conflation of these two is precisely what let QE go missing for five tickets; do not
   re-make it.**
2. **NO CONFIG VALUE CHANGED.** `quality.mandatory_gates` is still `["lint", "typecheck", "unit",
   "build"]` — QE's hop is a workflow step, not a gate command, and no dial was invented to hold it.
   `gate_enforcement` is still `blocking`, `production_requires_human_confirmation` still `true`.
3. **A QE VERDICT IS NOT A STAMP.** `context.human_admission` is still `off` and no `finding` is
   admissible here, so QE records its verdict as hand-authored `decision` / `observation` notes like
   every other result on this install.
4. **IT IS THE OWNER'S AND REVOCABLE.** One sentence ends it.

### What this entry does NOT do

**No board column moved, no ticket was cut, no code changed and no gate was added, removed or
softened by this hop.** It does not re-open the five, it does not create the detector, and it does
not decide the alpha/beta UAT phasing the owner raised in the same session — that remains an
undecided proposal with an unresolved `Ready for UAT` WIP conflict (limit 4), recorded here so it is
not lost and **not** mistaken for something he ruled on.

## Standing directive — read before prioritising anything

**Project owner Olger Oeselg, 2026-07-31:** *"The most important thing is that chess moves are
legal according to game rules, everything else comes after that. Game has to be played according
to it's rules."*

This is standing, not a one-off. It re-sequenced the board on 2026-07-31 and it outranks the
latent/live test this project otherwise uses for priority. Rules-correctness beats features.

**READ 2026-08-13 by the Orchestrator, under a delegation quoted below — the directive is NOT
revoked and NOT weakened. Its PRECONDITION is now MET, which is a different thing.** The delivery
audit (`audit-delivery`, `3215004`) declined to assume this directive a thirteenth day without
asking, and the owner answered by delegating the call. The ruling: *rules-correctness beats
features* **still binds every feature** — no feature may ship a rules shortcut, and the generator
remains the source of truth for every parser, command and renderer (`ABC-031`, `ABC-034`, `ABC-036`
all resolve against `legalMoves` for exactly this reason). **What it no longer does is justify
deferring the entry point.** Its own precondition is discharged, measured not assumed: `EPIC-001` is
`Done`, deep perft is 32/32, 807/807 green on 28 files, and three real defects that escaped the
2026-07-24 merges were caught by the chain with nothing escaping since 2026-08-04. A directive that
says *legality first* is satisfied when legality is first and done; it does not also say *and
nothing may be run*. **`EPIC-006` at `P1` and a thin "it runs" slice are therefore CONSISTENT with
this directive, not an exception to it.** If the owner disagrees, this paragraph is the thing to
strike — the directive above it is untouched and stands as written.

## Standing rulings taken under delegation, 2026-08-13. **NOT precedent.**

**Project owner Olger Oeselg, 2026-08-13, in session, quoted verbatim:** *"commit and merge. Decide
on 2, 3 and 4 based on your best recommendations."* — where 2, 3 and 4 were the three items the
Orchestrator had escalated as needing a named human. Three limits did not move: the delegation is
**this hop's three items only**, it is the owner's and **revocable**, and — following `ADR-0004`'s
Status section, which records its own by-delegation ratification as explicitly not precedent —
**this delegation extends nothing and is not citable as authority for the next one.** An agent
holding a general "use your judgement" does not thereby hold every judgement.

1. **The legality-first directive** — ruled in the amendment immediately above.

2. **`H2`, the test-integrity registry — RULED: THE ORCHESTRATOR DECLINES TO CREATE IT, and the
   delegation does not reach it.** This was the one item where the recommendation reversed on
   verification. `.grugops/test-skips.md` is four lines of markdown and the Factory Coach proved the
   tool works (header-only registry outside the repo, `--skip-count 0` → `No findings.`, exit `0`),
   so writing it was trivial and tempting. **The kit forbids it in three separate places, verified at
   source, not taken on report:** `05-pr-quality-gate.md` step 3 (*"This step is always human-only (a
   human owns `.grugops/test-skips.md`): the agent may not self-author a justification to clear its
   own gate"*), step 4 (*"do not retry, do not edit the baseline, do not write into the skip
   registry"*), and `config/factory.config.md`'s `test_integrity` dial (*"never `off`"* — the TINT-03
   carve-out). An empty registry authorises no skip and would have been defensible on its own terms;
   creating the control surface that governs whether an agent may excuse its own failing tests, on a
   general delegation rather than an explicit instruction, is not. **Nothing is being hidden
   meanwhile:** the skip count is `0`, measured on every gate this week, and the workflow already
   records exit `2` honestly as *could not run*, never as a pass. **Owner: a named human. Action: create
   `.grugops/test-skips.md` containing the six-column header row (`Test ID | Reason | Owner |
   Ticket/REQ | Expiry | Category`) and nothing else, then wire
   `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` into the gate.
   Cost: minutes.** Recorded so the next hop does not re-derive it.

   **DISCHARGED 2026-08-13 — the owner created the file, and the step RAN.** `node
   tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` → **`No findings.`,
   exit 0**, with the count taken from the `AGENTS.md` slot command rather than assumed. **This is
   the first time Workflow 05's test-integrity step has executed in this project's history** — it
   had exited `2` on every prior gate. The registry ships with the header row and **zero entries**,
   so it authorises zero skips; the human-owned rule is unchanged, and an agent may read and run it
   but never write a row into it. `H2` is closed.

3. **`ABC-036`'s reduced user-facing promise — RULED: ACCEPT the amendment, REJECT the pager.**
   `EPIC-003` acceptance #4 promises every legal move is listed; the merged frame cannot deliver it
   (`MESSAGE_ROWS` is `2` at `src/frame.ts:45`, region bounded to ~21 chars, so ~9 of 20 show at the
   start position with `+11` hidden). The **count** clause is kept exactly and is the testable half —
   it must equal `EPIC-001`'s generator with zero tolerance. The **list** clause is amended to *a
   partial list plus the exact total and a `+N` marker*. A pager is refused as unrequested scope
   (coding rules 5 and 7) — it is new interaction surface bought to satisfy a sentence, before any
   human has ever run this program. **This is reversible and the reversal is named:** if play-testing
   under `EPIC-006` shows the truncation is a real barrier, the pager is the change to make, and
   `ABC-038`'s identical escalation trigger (*no play-testing has happened because there is nothing
   runnable to test*) fires at the same moment. **The DoR re-score stays BA/PM's** — the Orchestrator
   ruled the blocker, not the score; re-scoring another role's checklist is how a ⚠️ gets smoothed.

## Standing directive — who decides. **This supersedes "no agent may ratify an ADR".**

**Project owner Olger Oeselg, 2026-08-03**, quoted verbatim:

> *"regarding ADR-0005, any legal move, even the special ones still need to be checked. I can see
> ADR-0005 contains a lot of info that human in this project is unable to correctly verify. Thus in
> most cases send decision to correct role. If it is architecture question then to architect to make
> the decision."*

**This is standing and it is a governance change, not a one-off.** Until today the rule was *"no
agent may mark an ADR `accepted`; a human must"*, and `ADR-0004`'s ratification by the Orchestrator
under a named delegation was recorded as **explicitly not precedent**. That rule is now **retired by
the owner**, and `ADR-0004` stops being an exception — it becomes the ordinary case.

**How this is read, stated explicitly so a later reader can check the reading rather than inherit
it.** The owner's reason is *verifiability*: a decision goes to whoever can actually verify it, and
the owner declines to rubber-stamp technical content they cannot check. Therefore:

- **Architecture decisions — including ratifying an ADR — are Architect/Design's**, and that role
  may now move an ADR to `accepted`. It owns the decision, so it also owns being wrong: an ADR it
  ratifies must record what would falsify it.
- **Product, scope, sizing and priority** are BA/PM's. **Risk, security and NFR bars** are
  Security/NFR's. **Business acceptance** is the UAT Planner's. "Send the decision to the correct
  role" is general; the ADR clause is the specific case the owner named.
- **"In most cases" is the owner's own hedge and is honoured, not rounded up to "all".** A decision
  that changes what the product *promises a user*, or that spends money, or that trades away a
  stated commitment, still goes to the owner. When a role is unsure which side of that line it is
  on, it asks — that is cheaper than a wrong ratification.
- **NOT delegated, and deliberately unchanged: merge and deploy.** `autonomy=pr` still holds and
  the roles' hard limit is untouched — a human holds both, and an agent supplies the keystroke only
  on explicit instruction, which is never standing. The owner delegated *decisions they cannot
  verify*; a merge is a decision they **can** verify, and they have exercised it four times.

**The first sentence is also a technical ruling and is recorded as one**, not just as preamble:
*"any legal move, even the special ones still need to be checked."* It endorses `ADR-0005`'s
strict-FIDE reading — a special move is still a move, so en-passant availability is a **legality**
question.

**The follow-on it raised is now ANSWERED, and the answer is NO — castling is a different case.**
Ruled 2026-08-03 by Architect/Design in **`ADR-0006`**, from the retained FIDE text rather than from
memory, and with the retained bytes' sha256 **and their currency** both re-verified that day.
`zobristKey` keeps hashing castling **rights**. The short form, because this will be asked again:
9.2.3.1 is written in the **capability** mood (*"could have been captured"*) and 9.2.3.2 in the
**entitlement** mood (*"had castling rights"*, *"forfeited these"*), and 9.2.3.2 carries a sentence
with no counterpart in 9.2.3.1 — *"The castling rights are lost **only** after the king or rook is
moved"* — whose "only" excludes transient blockers. And the decisive one: **given the placement and
the side to move, castling availability is a pure function of the rights**, because
`addCastlingMoves` reads nothing else — so hashing the right and hashing the availability are the
same discriminator. That was never true of the en-passant square, which is an extra bit the
placement does not determine. **Same Laws sentence, opposite consequence, and it is the placement
that makes the difference — not a preference.**

## What works

- **ABC-011 is merged** — `zobristKey` now includes the en-passant component **only when a LEGAL
  en-passant capture exists**, so two positions FIDE calls the same finally hash the same and
  threefold repetition stops under-detecting. The fix is **four executable lines** in `src/legal.ts`
  behind a new `hasLegalEnPassant` export. **Suite 214/214, 0 skips**, `src/legal.ts` and
  `src/zobrist.ts` both 100%. Cost to the per-node hot path is below what any instrument here can
  resolve. Two ADRs landed with it — **ADR-0005** (the hash module asks the rules) and **ADR-0006**
  (castling rights stay rights).
- **ABC-020 is merged** — FIDE 9.2/9.3 draws are now claimable rather than automatic, and the 9.6
  fivefold / 75-move backstops landed with them. The bug it fixed took a won game from the player
  entitled to refuse the draw. **Suite 174/174, 0 skips, `src/gameend.ts` 100%.**
- **EPIC-001 — the chess rules core is complete and merged on `main`** (ABC-001..007 + the ABC-008
  spike). Nine flat modules in `src/`, no runtime dependencies. Perft **32/32 exact at depth**,
  which is exhaustive proof of move generation, the legality filter, castling, en passant,
  promotion and check detection. This is the best-proven code in the repo — do not re-audit it.
- **NFR-001 met** (~6.1M nodes/sec generation-with-free-leaves; read its denominator fence in
  `plans/nfr-catalog.md` before quoting it — it is **never** evidence for NFR-005).
- **Six ADRs ratified**: **0001** 0x88 board, **0002** game-history ownership, **0003** legality
  strategy, **0004** SAN ownership, **0005** en-passant availability and the hash layer, **0006**
  castling rights stay rights in the hash. **0005 and 0006 were ratified by Architect/Design on
  2026-08-03 under the owner's standing directive above** — the first ADRs accepted under it, and
  `ADR-0004` is no longer the exception. **`ADR-0005` was accepted WITH AN AMENDMENT, not rubber-
  stamped:** one of its statements was false as written (its Consequences promised a predicate that
  "plays a move and takes it back", which the shipped code does not do on a semantically
  inconsistent ep square), so it gained **Decision clause 6** — the probe move's precondition,
  decided but **not yet built**, `ABC-011` carries it — plus a scope bound and a per-clause
  falsifier table. **`ADR-0006` says castling is NOT the en-passant case:** `zobristKey` keeps
  hashing castling **rights** and must not be changed to hash availability. **Both ADRs record what
  would falsify them**, which is the condition the delegation carries.

## What's left

**Nothing is deployed and nothing is released.** `mode=lean`, `autonomy=pr`; Done means merged.

- **`plans/board.md` is the WIP truth** — read it, do not infer state from here. The per-ticket
  snapshot that used to sit in this bullet was **deleted 2026-08-16, not updated**: it was pinned to
  2026-08-03 and had been wrong for thirteen days. Two records of WIP is one record too many, and
  the board is the one that is maintained.
- **ALL SIX EPICS ARE DECOMPOSED as of 2026-08-16.** `EPIC-001`/`EPIC-002` are `Done`; `EPIC-003`
  → `ABC-031`…`038` + `ABC-010`; `EPIC-004` → `ABC-074`…`087`; `EPIC-005` → `ABC-092`…`096`;
  `EPIC-006` → `ABC-041`…`046` (runnable half) + `ABC-100`…`102` (second half).
  **No `epic-to-tickets` work remains.**
- **UAT is no longer deferrable and is the binding constraint.** Every ticket closed before
  `ABC-042` deferred UAT to `EPIC-006` because nothing was exercisable; `npm run chess` ended that
  reason on 2026-08-14. `ABC-065` and `ABC-066` have sat in `Ready for UAT` since 2026-08-16 and
  **block `ABC-067`/`ABC-071` behind them.**

### Known UNCUT work — recorded 2026-08-16, because it lived only in per-task notes

These five items were **deliberately left uncut** during the 2026-08-16 decompositions. They are
real work, they are not tickets, and before this entry they existed only in
`.grugops/context/epic-to-tickets-*/notes/` gap tables — **which Workflow 18 compacts.** Recorded
here so they survive a context clear. **Do not cut the three that are decision-blocked; cutting them
requires inventing the decision.**

| # | Uncut work | Why not cut | Unblocked by |
|---|---|---|---|
| 1 | **All packaging tickets** | the scope of packaging is a *function of* the distribution channel, and npm / standalone binary / `git clone` share almost no work. `EPIC-006` acceptance criterion 1 (`npx <package>`) is unmeetable by any ticket that exists | **the owner**, via `ABC-100` — then Architect/Design writes the superseding ADR per `ADR-0007` `D5` |
| 2 | **Save/resume to a local file, and PGN export** | `EPIC-006`'s explicitly **negotiable slice** — "worth building only if play-testing shows people abandon games mid-way; cut them first if this epic runs long". Correctly still uncut | play-test evidence, not a decision |
| 3 | **The interactive startup PROMPT** — for colour AND difficulty | `EPIC-006`'s scope says *"choose colour and difficulty, via prompt or CLI flags"*; `ABC-042` resolves `random` before the loop and **prompts for nothing**. Gap `G6` of `epic-to-tickets-EPIC-006-packaging` | **nothing — this one is cuttable TODAY.** BA/PM's pen, and it is the named first item of the next refinement pass |
| 4 | **The `EngineSeam` composition contract** | `EngineSeam` is `(history) => Promise<Move>`, merged at `src/turn-loop.ts:138`. A difficulty level cannot reach an engine through it (`G4`), and "book first, else search" has no composition point (`G10`). Straddles `EPIC-004`/`EPIC-005`/`EPIC-006`, so no single decomposition owned it | **Architect/Design** |
| 5 | **A turn-loop arm for state-changing, non-advancing commands** | it only exists if shape (b) is ruled. `undo`, `new` and `quit` all turn on it — `ABC-102` and `ABC-046` are blocked on the SAME ruling. Gap `G3` | **Architect/Design — rule it ONCE for both tickets** |

**Two related seams are ruled nowhere and will ship twice if nobody rules them:** a single
**seeded-RNG seam** is wanted by `EPIC-005`'s book picker and `EPIC-004`'s blunder rate, and `src/`
has no production RNG at all (`G4` of `epic-to-tickets-EPIC-005`). Architect/Design's.

## Known issues

### Open defects in merged, `Done`, 100%-covered code

| | What | Size/Pri | Reachable |
|---|---|---|---|
| **ABC-009** | `legalMoves` mutates the position it documents as unchanged | S / P1 | latent — needs a semantically invalid position |
| **ABC-010** | FEN semantic validation missing | M / P1 | live when EPIC-003 accepts a FEN from a user |
| **ABC-011** | Zobrist hashes en passant when no capture is available → threefold **under**-detects | ~~S~~ **M** / P1 | latent; error direction is safe (a draw is missed, never falsely declared). **SECOND design hop closed 2026-08-03 — back in `Ready for Dev` with a second, dated contract on the ticket** |
| **ABC-011a** | `zobristKey` **permanently** corrupts a position whose ep square the board contradicts (`4k3/8/8/4P3/8/8/8/4K3 w - d6 0 1` gains a phantom black pawn on d5) | folded into **ABC-011**, no new ticket | latent — invalid FEN only, **0 impure over 518,474 reachable nodes**. MEDIUM (Security/NFR). **The owner declined to merge carrying it**; the fix contract is ruled and the ticket is back in `Ready for Dev` |
| **ABC-022** | `generateMoves` offers en-passant captures its own stated preconditions forbid — **two defects in one branch**: (a) the ep target is not checked to be empty, so a capture is offered onto the **mover's own** piece and `legalMoves` **passes it through**; (b) the captured pawn's presence is not checked, so `legalMoves` **permanently corrupts** the position (`4k3/8/8/8/8/8/1P6/4K3 w - a3 0 1` gains a phantom black pawn on a2) | **S / P1** | latent — invalid FEN only, **0 of 518,474 reachable nodes**. **TICKETED 2026-08-04**, cut straight to `Ready` |

The first three are **carried, not owned** by ABC-020. Perft does not cover any of them, because
`src/perft.ts` never calls `gameStatus` or `zobristKey`. **All of them share one trigger class —
a semantically invalid FEN — which is `ABC-010`'s surface**, and the last two are both instances of
the same root shape: a `Move` handed to `makeMove` that `generateMoves` would not have produced
from that board, or produced when it should not have. `ABC-011`'s ruled fix makes the **hash**
immune to it; it does not clean the generator — **`ABC-022` is the ticket that does.**

**`ABC-022` was cut 2026-08-04 by BA/PM after reproducing it rather than accepting three roles'
descriptions of it, and the reproduction found three things none of them said.** Recorded here
because each changed what the ticket says:

1. **The shape is piece-agnostic.** Both FENs on record put a **knight** on the ep target; a
   **rook** reproduces identically (`4k3/8/8/8/3pP3/4r3/8/4K3 b - e3 0 1`), because
   `src/moves.ts:177` reads only the occupant's *colour*. An acceptance criterion naming the two
   recorded FENs would have been satisfiable by a knight-shaped fix.
2. **The branch carries two defects and the unrouted one is worse.** Only half (a) was routed. Half
   (b) makes `legalMoves` corrupt its argument — `ABC-009`'s symptom by the en-passant route rather
   than the castling one. Both are the same four lines, so they are one ticket.
3. **"Perft cannot clear this because the legality filter later rejects the extra move" is WRONG in
   its mechanism, and the correction strengthens the conclusion.** Measured: **the filter does not
   reject it** — `legalMoves` returns the over-offered move on both reproductions. Perft is silent
   because the **trigger population is empty**: 0 of 518,474 reachable nodes carry an occupied ep
   target. **Consequence: no perft depth and no additional perft position can EVER reach this
   defect**, so `ABC-022` forbids adding one and uses a constructed table instead. `32/32 exact`
   still does not clear the class, for a better reason than the one previously recorded.

**And the correction that must survive: `ABC-011`'s guard (a) is NOT a deletable workaround for
this.** QE corrected the Engineer on that at the second review; re-derived on 2026-08-04 by
**deleting** guard (a), the predicate answers `true` on **both** classes it covers — including the
own-piece one. `hasLegalEnPassant` **synthesises** its probe move and never consults
`generateMoves`, so guard (a) is a precondition of the *predicate*, not compensation for the
*generator*, and fixing `ABC-022` changes neither row. "Deletable once the generator is fixed" is
not over-stated — it is **false**. Anyone who deletes it reopens four assertions.

**Two gaps in other tickets were found and are NAMED rather than fixed**, because closing them was
not this task's scope:

- **`ABC-010` does not fully gate `ABC-022`.** Its scope rejects *"an en-passant square with no pawn
  that could have made the double push"*, which closes half (b)'s trigger — but **not half (a)'s**:
  on `4k3/8/8/8/3pP3/4n3/8/4K3 b - e3 0 1` the double-push pawn is present and `ABC-010` as written
  accepts the FEN. For `ABC-010`'s own refinement.
- **`ABC-009`'s `## Scope` promises more than any of its acceptance criteria tests.** Its scope
  bullet 1 says the position is byte-identical on return *"for every position it accepts"*, but
  every one of its criteria is a castling FEN — so building it to its acceptance leaves `ABC-022`'s
  half (b) live with a green gate. Recorded on `ABC-022` so the two do not silently overlap.

### Open questions nobody has ruled on

1. ~~**FIDE 9.6.1 says "five *consecutive* alternate moves"; ABC-020's code uses a plain 5-count.**~~
   **CLOSED 2026-08-02 by BA/PM (task `refinement-fide-9-6-1`) against the retrieved Laws text.
   THE CODE CONFORMS. No gap, no ticket, and `src/gameend.ts` does NOT change.** The current
   Article 9.6.1, quoted verbatim from `handbook.fide.com/chapter/E012023` (HTTP 200, retrieved and
   retained under `.grugops/context/refinement-fide-9-6-1/sources/` with its sha256), reads:

   > 9.6.1 the same position has appeared, as in 9.2.2 at least five times.

   **The word "consecutive" appears zero times in the entire 2023 Laws of Chess.** `>= 5` on a
   counts map is a term-for-term match for "at least five times", and 9.2's own parenthesis —
   "(not necessarily by a repetition of moves)" — confirms the repetition rules are counts with no
   ordering predicate. **QE's remembered sentence was real, verbatim, and two editions stale**: it
   is the 2014 text ("for at least five consecutive alternate moves by each player"), removed
   effective 1 July 2017 and absent from the 2017, 2018 and 2023 editions. QE's `UNKNOWN - verify`
   is **vindicated, not overturned** — right words, wrong edition, which is exactly what memory
   cannot detect. **The feared second change to `src/gameend.ts` on `main` is NOT owed**, and the
   conditional Architect/Design hop for a per-ply key list (`ADR-0002` clause 3) is **cancelled
   rather than deferred** — no ordering is needed, so `ADR-0002` needs no amendment. Ruling and
   evidence: `.grugops/context/refinement-fide-9-6-1/notes/20260802T210100Z-ba-pm-decision-968fe5b1.md`.
2. **`GameResult` is dead** — referenced by nothing in `src/` after ABC-020. Kept deliberately
   (coding rule 12). The trap: it is a flat union matching neither arm of `GameStatus`, so
   `render(r: GameResult)` compiles and silently drops the claim. One-line close
   (`GameStatus["result"]`), Architect/Design's seam.
3. **ABC-020's A5/A8 `Given` wording** is factually wrong about the locked pawn wall (it unfreezes
   after its first capture; the clock resets three times). The criteria's **substance holds** under
   ten drives and is pinned by tests. Documentation only.
4. **`EPIC-006` names `npx` in FOUR places while `ADR-0007` clause 5 records distribution as
   UNDECIDED — two documents disagree, and this is the `ABC-015` shape again.** Both were written
   2026-08-06; neither side was edited, because the fix is a ruling and not a wording tidy. Count
   re-verified independently at close: `grep -c npx` on the epic returns 4 (Scope, epic acceptance,
   NFR triggers, Test notes). **Owners: BA/PM (epic scope) and Architect/Design (`ADR-0007`), at
   `EPIC-006`'s decomposition** — that decomposition must not start until this is ruled, or it will
   inherit a distribution decision nobody made. Raised by Security/NFR,
   `refinement-deploy-posture-2026-08-06`.
5. **FIVE MORE bootstrap defaults in `.grugops/factory.config.json` describe a stack this project
   does not use, and one of them is the same class as the deploy key just fixed.** Found by two roles
   and **deliberately NOT fixed** — the owner asked about deployment, and quietly rewriting five
   unrelated dials would have been scope the instruction did not carry. Named here so the next reader
   sees them as known, not missed: **`default_stack.container: "docker"`** with no Dockerfile
   anywhere (the closest to in-scope, and arguably an oversight in this task's own framing);
   `nfr.perf_p95_ms: 300`, a p95 **API** latency on a project with no API; `nfr.a11y_target:
   "WCAG-2.2-AA"`, a **web** standard on a terminal program; and `default_stack.backend:
   "node-fastify"` / `frontend: "vue"` / `db: "postgresql"` / `e2e: "playwright"`, none of which
   exists here. **Owners: Architect/Design for `default_stack`, Security/NFR for the two `nfr` bars**
   (triggers `EPIC-002`/`EPIC-003`). One `refinement` closes the lot; none blocks anything today.
6. **No `plans/traceability.md` row was written for this task, and the same was true of the
   branching model.** Three roles reached that conclusion independently: the file's own rule is one
   row per ticket, and a governance/substrate change cuts no ticket. **The open question is whether
   this project wants a trace trail for substrate changes at all** — today they are traceable only
   through `memory-bank/60-progress.md` and the task's context folder. Nobody's call but the
   Orchestrator's or the owner's, and it is deliberately not taken here.

## The branch stack — RESOLVED 2026-08-02, everything is on `main`

**All nine branches are now contained in `main`** (`git branch --no-merged main` is empty), at
`cb62c9f`. The three formerly-open branches — `architecture-audit-2026-07-29`,
`epic-to-tickets-EPIC-002`, `ticket-to-pr-ABC-020` — were a single linear chain and landed in one
fast-forward (27 commits, no merge commit). Gate verified before the merge on the tip and again
after it on `main`: 174/174, 0 skips.

**Branch from `main` now.** It carries all four ADRs and every ticket. The earlier warning that
`main` lacked them is obsolete.

**All eight merged branches were DELETED on 2026-08-02 on explicit owner instruction — `main` is
now the only branch in the repo**, still at `4a73cf3`. Each was validated merged first
(`git merge-base --is-ancestor <branch> main` + `git rev-list --count main..<branch>` = contained / 0)
and deleted with `git branch -d`, the safe form that refuses an unmerged branch; `-D` was never
used. **No commit was lost** — every deleted tip is still reachable from `main`, and the eight SHAs
are recorded in `plans/board.md`'s Done comment so they survive a reflog expiry. This is **not
standing authorization**; the standing rule is unchanged — branch deletion is the owner's call.

There is still **no git remote on this repo at all**, so no PR exists or can be opened; that
absence is recorded, not an oversight.

**The load-bearing merge order was honoured**: ABC-020 landed before ABC-019 and ABC-016, whose
acceptance criteria were amended on 2026-07-31 to match it. That constraint is now **discharged**,
not pending.

**The merge was performed by an agent on explicit human instruction.** That is the one path that
crosses the "humans hold merge" line without breaking it — the human holds the decision, the agent
supplies the keystroke — and it is **not standing authorization**. No future merge happens without
the same explicit instruction.

## Governance facts that must survive a context clear

- **Open question 4's decomposition precondition was WAIVED by the owner, 2026-08-16, AFTER the
  fact — and the contradiction it guarded is STILL OPEN.** The Orchestrator started `EPIC-006`'s
  second-half decomposition while the `npx`-vs-`ADR-0007` contradiction was unruled, disclosed it,
  and the owner answered: ***"it was ok to decompose, we can deal with blocker items later, i wanted
  the information saved that we know we have these blocked items for later decomposition."***
  **Read this narrowly.** He waived the PRECONDITION and asked that blocked items be RECORDED. He
  did **not** rule the contradiction, did **not** choose a distribution channel, and did **not**
  authorise cutting the decision-blocked work. `EPIC-006` still asserts `npx` in four places
  (`:206`, `:222`, `:252`, `:257`) against `ADR-0007` clause 5's "undecided"; the repair is
  `ABC-100` `A7` and it reads *"say what the owner chose"*, so it cannot close until he chooses.
  **Do not cite this waiver as permission to fill in the channel.**
- **ADR-0004 was ratified by the Orchestrator under an explicit, quoted delegation from Olger
  Oeselg on 2026-07-31 — the first ADR here not ratified by a human directly.** It is recorded in
  the ADR as **NOT precedent**; the delegation was specific to ADR-0004 by name. The standing rule
  is unchanged: **no agent may mark an ADR `accepted`.**
- **This install has no `scripts/context-io.ts` and no `mcp__grugops__propose_note`.** Workflow 16's
  sanctioned writer does not exist here, so every note is hand-written into
  `.grugops/context/<task>/notes/` in the schema's exact shape. Consequence: **`finding` is not
  admissible on any task** — there is no §14 gate to issue a stamp. Use `decision` / `observation` /
  `claim` / `artifact-ref`, and never self-stamp. Every role so far has recorded this degradation
  rather than glossing it.
- **`gameStatus`'s `positionCounts` stays optional.** ADR-0002's recorded reason (a breaking change
  to covered code) does not survive one grep — QE measured 9 test call sites and 0 production ones.
  The decision is still right for a **stronger** reason: ADR-0002 clause 3 makes a bare-calling
  search leaf a legitimate caller shape, not a mistake. That argument is written on ABC-012 and
  ABC-020 because the ADR's clauses are not a ticket's to edit.

## Next action

**2026-08-16 — the next action is UAT on `ABC-065` and `ABC-066`.** They have sat in `Ready for UAT`
since 2026-08-16, they are the only work in any working column, and they block `ABC-067`/`ABC-071`.
After UAT, `ABC-076` is the natural first pull on `EPIC-004`'s P0 critical path — it is the one page
in that epic with `DoR 10/10` and no ⚠️. **An agent-run UAT reports a result; it is NOT a named
human's acceptance signature** (see `## Standing directive`, 2026-08-15).

> **DISCLOSURE — a recorded precondition was violated, by me, on 2026-08-16.** Open question 4 below
> says in its own words: ***"that decomposition must not start until this is ruled, or it will
> inherit a distribution decision nobody made."*** The `npx`-vs-`ADR-0007` contradiction was **not
> ruled**, and I started `EPIC-006`'s second-half decomposition anyway at task
> `decompose-epics-2026-08-16`. **Root cause: I did not read this file at hop start.** The
> Orchestrator role's `## Reads` requires `memory-bank/00-index.md` and the published notes; I read
> `AGENTS.md`, the config, the board and my own role file, and stopped there. This is the SECOND
> time in one session that a durable record I had not read would have changed my inputs — the first
> was `ADR-0003`'s re-pointing of `RISK-002`, which a subagent caught for me.
>
> **The harm the precondition names did NOT occur, and that was near-luck rather than care.** I
> wrote a hard stop into the subtask from `ADR-0007` clause 5 and `AGENTS.md` § Deployment posture,
> which carry the same content as this open question — so the decomposition cut the DECISION
> (`ABC-100`) and never the ANSWER. Measured at close: `npx` **assertion** sites in the epic still
> **4** and unchanged (`:206`, `:222`, `:252`, `:257` — the grep returns 6 only because the
> 2026-08-13 pass added two lines *warning* about this contradiction); `npx` in `ABC-101` and
> `ABC-102` is **0 and 0**; `package.json` still `private: true` with no `bin`, `exports` or
> `files`. **No distribution decision was inherited.**
>
> **The precondition is now spent and the contradiction is still OPEN.** It is carried by `ABC-100`
> `A7`, whose repair is "say what the owner chose" — so it cannot close until the owner speaks. Do
> not read this disclosure as the question being resolved.

The pull order written 2026-08-04 is fully spent and has been removed; the board is the pull order.

**`ABC-011` is merged and `Done`** (2026-08-04, fast-forward `4a73cf3` → `d3efba6`, 16 commits, no
merge commit; 214/214 and skip count 0 re-verified **on `main`** after the merge). Every column
between `Ready` and `Done` is empty. `Ready` holds four: ABC-009, ABC-012, ABC-013, ABC-014.

**Both unowned items are CLOSED (BA/PM, 2026-08-04, task `refinement-2026-08-04`). The pull order is
fixed and `Ready` holds five.** The Orchestrator's next move is the `Ready → In Development` pull,
in this order and for these reasons:

1. **`ABC-012`** (game history module, `M`, `P0`) — the ticket `ABC-011` was deliberately sequenced
   ahead of. Its blocker is gone: its repetition tests can now be written against a key that means
   what FIDE means, instead of being shaped to dodge a defect. It needs no design hop. **`ABC-022`
   does not displace it** — see below.
2. **`ABC-014`** (board frame renderer, `M`, `P0`) — **pullable for the first time.** The
   `ABC-015`/`RISK-005` knot that the Orchestrator twice declined to walk into is untied, and
   `ABC-014` **never blocked on `ABC-015`**: its own Dependencies clause was the correct half of the
   contradiction. No design hop.
3. **`ABC-009`** (`S`, `P1`) — first of the two rules-core defects, ahead of `ABC-022` on standing
   rank (in `Ready` since 2026-07-31) and on the marginally wider reachable surface: `gameStatus`
   calls `legalMoves` on its first line, every ply. **Deliberately not reordered against `ABC-022`.**
4. **`ABC-022`** (`S`, `P1`) — the newly cut generator defect, beside `ABC-009`: same class, same
   trigger (invalid FEN), same eventual gate (`ABC-010`). Different function (`addPawnMoves` vs
   `addCastlingMoves`), so the two do not conflict and either may ship first.
5. **`ABC-013`** (`M`, `P1`) — renderer work, below every `P0` and below the rules-core defects.
   Unchanged.

**`ABC-022` is `P1`, not `P0`, so it does NOT go ahead of `ABC-012`.** That was the open conditional
and the honest answer is "no". Applied on this board's own `P0` test, written 2026-07-31 under the
owner's legality-first directive and never overturned — *"`P0` means the directive applies **and**
the fault is reachable"*. The directive applies; the fault does not — 0 of 518,474 reachable nodes,
invalid-FEN only, and `EPIC-003` is undecomposed. `ABC-009` is the identical shape and was ruled
`P1` on this same test on the same day, so ranking `ABC-022` `P0` would put it **above** `ABC-009`,
which is not defensible. **The directive is honoured, not overridden: it re-ranks correctness against
features, and it did — both rules-core defects sit above the `P1` renderer ticket. What it does not
do is rank a latent defect above the tickets that make the game exist.**

**The `ABC-014` / `ABC-015` / `RISK-005` knot is untied.** `ABC-015`'s wording was the one written
wrong (*"with or before `ABC-014` reaches `Done`"* — a cycle, since it also needs `ABC-014` to
declare `GlyphMode`, and `Done` means merged here). `ABC-014`'s wording was already right
(*"first user-visible use"*). **The constraint binds at `ABC-018`**, the ticket that makes the frame
a display rather than a value and the first thing in `EPIC-002` a player can see — `ABC-014` returns
a frame as a value, writes nothing, and takes the glyph mode as a parameter it does not choose, so
merging it cannot produce the hardcoded-mode build `RISK-005` rules out. Corrected in place in four
files (`ABC-015`, `ABC-014`, `ABC-018`, `EPIC-002`'s `RISK-005` entry) so no two documents disagree.
Chain: `ABC-014` → `ABC-015` → `ABC-018`, acyclic. **`RISK-005`'s severity and mitigation strategy
are unchanged** — only the event the sequencing binds to moved; if that reads as changing the
mitigation, it is Security/NFR's call. **`ABC-015` is NOT promoted to `Ready`**: the build dependency
on `ABC-014` is real and unchanged.

**The 2026-07-31 re-sequencing was NOT re-opened.** `ABC-010`, `ABC-016`, `ABC-017`, `ABC-019`,
`ABC-021` and every epic priority were re-read and deliberately left.

**Nothing is owed to a human except merges.** `ADR-0005` and `ADR-0006` are both `accepted` under the
owner's standing delegation of 2026-08-03, so the long-standing "an ADR awaits a human" item is
closed and stays closed. **Merge and deploy were NOT delegated** — an agent supplies the keystroke
only on explicit instruction, never standing. The `grugops/ticket-to-pr-ABC-011` branch was **not
deleted**; that is the owner's call.

**Two open questions remain and neither touches behaviour:** the dead `GameResult` alias
(Architect/Design's seam, deliberately not ruled at either ABC-011 hop — that hop's scope was one
question on one ticket) and ABC-020's A5/A8 `Given` wording. `ABC-009` and `ABC-010` are still
carried, not fixed.
