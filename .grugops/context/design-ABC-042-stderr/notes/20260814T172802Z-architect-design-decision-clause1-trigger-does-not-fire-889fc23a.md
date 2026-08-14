---
id: 20260814T172802Z-architect-design-decision-clause1-trigger-does-not-fire-889fc23a
kind: decision
by: architect-design
at: 2026-08-14T17:28:02Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A3
  - ADR-0011
  - R3
  - src/history-pane.nfr.test.ts
supersedes: 
---

# RULING 2 — `A3`'s argument HOLDS: `ADR-0011` clause 1's trigger does NOT fire, the fix is not owed here, and `R3` stays open unchanged

> **Hand-authored `decision`.** Verified against the ADR's actual text and by running the real
> instrument's logic out of tree. Nothing under `src/` was written.

## The reading, checked against what the ADR says rather than what `A3` says it says

`A3` asserts: *"`ADR-0011` clause 1's amendment names **this ticket** as the trigger for its deferred
fix."* **The ADR does not say that.** Its actual words:

> `ADR-0011` clause 1, amendment: *"**Owner: Architect/Design. Trigger: the first `.ts` file added
> under a subdirectory of `src/`** — which `EPIC-006`'s entry point may well be, so the trigger is
> checked THERE and is not deferred to it."*
>
> `R3`, residual register: *"trigger: the **first `.ts` file under a subdirectory of `src/`**"*

**The trigger is a FILE-PLACEMENT CONDITION, not a ticket.** This ticket is named as the place the
condition is **CHECKED** — *"checked THERE and is not deferred to it"* means the check may not be
postponed past `EPIC-006`, not that `EPIC-006` is itself the trigger.

**That distinction is not pedantry: it means the CHECK is owed here even though the FIX is not.**
`A3`'s parenthetical is that check, performed on the page. So the obligation is discharged — provided
the check is made against the **delivered** tree and not against the ticket's intention.

## The check, performed and measured

| measured at HEAD (`eefc217`) | result |
|---|---|
| subdirectories of `src/` | **one** — `src/__snapshots__` |
| `.ts` files in it | **zero** |
| `.ts` files under `src/` not directly in `src/` | **zero** |
| production modules (clause 1's expression) | **18**, all flat |

**The condition is FALSE today, and `A3` requires the delivered entry point to be directly in `src/`,
so it stays false after this ticket lands.**

> **RULED: the trigger does not fire, the deferred fix (recursive enumeration + a depth-fixed
> specifier) is NOT owed by `ABC-042`, and `A3`'s verdict is correct.** `R3` is **not discharged**
> and **not moved**: owner Architect/Design, trigger unchanged. Nobody closes it on this hop.

## `A3`'s own warning is CORRECT, and it is now measured rather than reasoned

`A3` warns: *"A build that places it at `src/cli/main.ts` passes every other criterion on this page
and silently drops the licence guard's reach."* Both of the amendment's two independent causes
reproduce, run out of tree on a copy of `src/`:

| cause | measured |
|---|---|
| **enumeration** — `readdirSync(directory)` (`src/history-pane.nfr.test.ts:163-164`) is non-recursive | with the entry point at `src/cli/main.ts`, `production` is **19**, not 20 — `main.ts` is never enumerated, so it can never appear in `runtimeImporters` |
| **specifier is depth-fixed** — the pattern requires `"./history.ts"` | `import { newGame } from "../history.ts";` → the widened expression returns **false**; `"./history.ts"` → **true** |

**So a subdirectory build is invisible to the licence guard on two independent counts, and making
only the enumeration recursive would not fix it** — the ADR's *"two changes, not one flag"* is
confirmed.

## The correction `A3`'s prose is owed — and it is NOT a criterion change

`A3`'s **requirement** (*"the delivered entry point is directly in `src/`"*) is right, its **verdict**
(*"the trigger does not fire"*) is right, and its **warning** is right. Only its parenthetical's
premise — *"names this ticket as the trigger"* — misdescribes the ADR, in a way that would let a
later reader think the check was optional here rather than owed. **No criterion row changes.** If
BA/PM wants the parenthetical to read *"names this ticket as the place the trigger is CHECKED"*, that
is a prose correction in their file and their call; I am not manufacturing a criterion change out of
it.

## The recommendation the audit made stands, and it now has a second reason

The architecture audit's condition 1 — *"the entry point lands FLAT in `src/` … flat costs nothing
and the trigger never fires"* — is re-affirmed. **It has acquired a second, sharper reason since it
was written, and that reason is a perverse incentive: on this tree the FLAT build reds the suite and
the SUBDIRECTORY build passes it.** See the measured-builds observation. `A3` is the only thing
standing between an engineer chasing green and the wrong placement, which makes `A3` load-bearing in
a way its `S`-sized wording does not advertise.
