---
id: 20260815T102500Z-architect-design-decision-d7-survives-widened-and-what-would-legitimately-move-the-flag-1b769926
kind: decision
by: architect-design
at: 2026-08-15T10:25:00Z
verified_by: 
confidence: high
refs:
  - ADR-0007
  - D7
  - production_requires_human_confirmation
  - .grugops/factory.config.json
  - memory-bank/60-progress.md
  - EPIC-006
supersedes: 
---

# `D7` RULED — it SURVIVES, its check is unchanged, its trigger is widened by one clause, and what would legitimately move the flag is now written down

> **Hand-authored `decision`.** No `kind: finding` is admissible on this install; no stamp is claimed.

## The ruling, in one paragraph

> **`D7` survives as a row. Its CHECK (`grep` → must read `true`) and its VERDICT are unchanged and
> correct. Its TRIGGER named the only inference route that existed on 2026-08-06 and there are two
> now, so the trigger is widened to be SOURCE-AGNOSTIC: the row fires when the flag moves without the
> owner having named it, whatever document is cited. A discriminator is added so the row can tell an
> owner's word from an agent's inference. No `D8` is added. The flag is NOT flipped, and my
> recommendation to the owner is that it should not be.**

## `D7` was tested for the first time on the day the authority moved, and it held

This matters more than the wording change. On 2026-08-15 the owner granted deploy and **did not name
the flag**. The Orchestrator recorded the grant and **deliberately did not flip it, citing `D7` by
name** (`memory-bank/60-progress.md` § "Standing directive — deploy is ALLOWED and NOT NEEDED…",
grant 1, bullet 3). I re-checked at this hop:

```
grep production_requires_human_confirmation .grugops/factory.config.json
  "production_requires_human_confirmation": true,
```

**A tripwire nobody has ever seen fire is not yet known to work.** This one now is, and the record
says so.

## Why the trigger needed widening — the row had a reachable blind spot

The row read *"argued obsolete **on the strength of this ADR**"*. That names **one** route: read
`environments: ["local"]`, conclude the flag is obsolete.

**A second route opened on 2026-08-15:** *"the owner allowed deploy, so the human-confirmation rail
went with it."* That inference cites the **owner's grant**, not this ADR — so the row **as written
would not have caught it**. Same conclusion, different premise, same defect, and the premise is the
newer and more persuasive of the two. A detection row that names its evidence source can be walked
around by changing the source.

The widened trigger is stated by what is MISSING rather than by what is cited: **the flag moved and
the owner never named it.**

## What would LEGITIMATELY move the flag

**Exactly one thing: the owner naming it.** The words must name
`production_requires_human_confirmation` or the human-confirmation requirement **itself** — not
deploy, not merge, not test, not UAT, not *"you have all the tools"* — and be recorded **verbatim,
dated and attributed** in `memory-bank/`, which is how every owner directive in this project is
already recorded.

**Checkable by a third party who trusts nothing in the ADR:**

```
grep -rn production_requires_human_confirmation memory-bank/   # → an owner QUOTATION, not a paraphrase
git log -S'<that quotation>'                                   # → the commit that introduced it, dated
```

`context.audit_retention` is `git`, so the quotation's arrival is dateable and attributable.

**What does NOT move it — five live temptations, not hypotheticals:**

1. **The deploy grant of 2026-08-15.** It moves **who may act**; the flag governs **what is required
   at the moment of acting**. **Orthogonal.** A human can hand an agent the deploy key and still want
   to be asked before production, and nothing in the owner's sentence speaks to the moment of the
   act. Read together the two are **consistent, not contradictory**: the agent may deploy; a
   production deploy asks a human; there is no production environment, so the pair has no effect
   today. **This is the single point on which `D7`'s survival rests.**
2. **`environments: ["local"]` / "there is no production".** The original forbidden inference.
3. **"It has zero present effect."** True — an argument for leaving a **free** rail standing, never
   for removing it.
4. **An agent's judgement that the owner would say yes if asked.** Asking is cheap and the flag
   blocks no work in flight.
5. **A kit default, a bootstrap re-run or a config regeneration** restoring a default — the *deleted*
   route the row has always covered.

## The honest limit of the discriminator, stated rather than assumed away

`context.human_admission` is `off` and **no `human:<name>` stamp is emittable on this install**, so
**there is no mechanically un-forgeable owner signal here.** The verbatim-quote-in-`memory-bank`
convention is the whole of it. Its strength is that it is **auditable** — a quotation is a string,
and `git log -S` dates it and names the commit that added it — **not** that it cannot be forged. A
reader who needs more than an audit trail must ask the owner directly. **Writing a discriminator
without writing its ceiling would be the same class of error as the flag itself: a stated rule whose
enforcement nobody checked.**

## The recommendation: do NOT flip it — and this is a recommendation, not an edit

Four reasons, in order of weight:

1. **The owner did not name it.** He named four things in one message; this was not one of them.
2. **It guards a different object than the grant moved** — see temptation 1 above.
3. **It has zero present effect**, so flipping buys nothing today while **disarming a rail before
   `EPIC-006` has designed the machinery it guards**.
4. **The kit's own config reference calls it a must-stay flag.**

**If the owner wants it moved, one sentence naming the flag does it** — and that sentence is worth
asking for explicitly, because of the count in my other note: of the three things that would stop an
agent from a production deploy, **permission is retired and "nothing to deploy" is `EPIC-006`'s to
remove by design. This flag is the last of the three.**

**The counter-argument, recorded rather than suppressed.** A reader may say that leaving `true`
standing after the owner granted deploy is an agent overriding an owner. **It is not.** `true` is the
value the owner's own session left in place — the flag read `true` before, during and after his
sentence. **Preserving a state is not overriding one**, and nothing is blocked by it today. The
opposite move — an agent flipping a flag the owner did not mention, on the strength of an adjacent
grant — is the one that would need authority it does not have.

## Two decisions of restraint

**No `D8`.** The permission half of the new fact is **not falsifiable by measurement** — it is
granted and revoked by the owner's sentence — and the dormancy half is exactly `D1`–`D4`, which I
re-ran at this hop and all four hold. **Splitting the flag question across two rows would make it
possible to satisfy one tripwire and miss the other. One flag, one row.**

**The gap `D7` does NOT close, named in the ADR so nobody mistakes its reach.** It detects the flag
being **changed**; it does not detect the flag being **ignored**. Nothing on this install parses
`.grugops/factory.config.json`: no `scripts/` directory, `.claude/settings.json` enables a plugin and
registers **no hook** (`.claude/hooks/` does not exist), and no test asserts the value. The flag is
**prose honoured by roles, not an enforced control**; its observable trace if ignored would be a
release record (`D4`) or a deploy artifact (`D1`). **A rail with no instrument is exactly as strong as
its prose — which is the strongest argument in the file against weakening the prose.**
