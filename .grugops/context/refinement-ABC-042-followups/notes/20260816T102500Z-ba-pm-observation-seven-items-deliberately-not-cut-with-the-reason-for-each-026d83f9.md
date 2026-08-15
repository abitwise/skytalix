---
id: 20260816T102500Z-ba-pm-observation-seven-items-deliberately-not-cut-with-the-reason-for-each-026d83f9
kind: observation
by: ba-pm
at: 2026-08-16T10:25:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - G1
  - Q9
  - B2
  - E2
  - E3
  - Q8
  - Q10
  - Q11
  - B5
  - S6
  - AR-1
supersedes: 
---

# Seven items I did NOT cut, each with the reason — so the absence is a decision and not an oversight

## Not mine to ticket around — the project owner's

| # | item | why no ticket |
|---|---|---|
| **`G1` = `Q9`** | `N8-LANE` NOT MET, **1300 ms against 650 ms = 2.00×**, escalated and unanswered | **The project owner's.** It holds `ABC-042` at the merge. A ticket "around" it would either re-open a measurement two roles independently confirmed (Security/NFR 0.0033 ms added, QE 0.0062 ms, sign at chance) or pre-empt an answer that has not been given. **Every ticket cut this hop instead treats "zero new child processes" as a hard constraint** — `ABC-058` makes it criterion `A7` — so none of them can move the number while the owner holds it |
| **`B2`** | `ABC-042`'s page is **328 lines against rule 2's 300-line budget — 28 over**, re-measured this hop | **The project owner's**, and it is a *control* on an owner-adopted process rule, not a defect in a ticket. I measured it at an earlier hop and could not honestly close it then; nothing has changed, and the one thing that would make it worse is editing the page. **The rule's own control text says what to do if the budget cuts rigour instead of prose — revert it — and that is an owner decision** |

## Accepted, with a trigger already shared — re-opening it would create a second trigger

| # | item | why no ticket |
|---|---|---|
| **`E3`** | `A9`(2) is asserted textually and its scope is the two new production modules; `MP10` (a second `process.argv` read in the merged `src/history.ts`) survives 856/856 | **ACCEPTED by Security/NFR on evidence, not deference**, with `V2.2.2 [L1]` MET on the delivered artifact, and with the trigger adopted **verbatim from Architect/Design's `E2`** — *the first merged production module that acquires `process.argv`* — **so there is ONE trigger, not two.** A ticket here would necessarily restate the trigger in a third place and would re-open a reasoning I agree with: a wider **textual** net does not catch a **non-textual** fish, the only closing instrument is behavioural, and buying a `V2.2.2` regression guard with more child spawns would deepen `G1` to close a LOW |

## Owned elsewhere, or the note is already the right home

| # | item | why no ticket |
|---|---|---|
| **`Q8`** | `A8`'s stream ends with **two** newline bytes because the frame's 23rd row is the empty string — not a violation; the delivered assertion reads it correctly | **Checked before declining**: no sibling ticket copies that clause (`ABC-043`–`ABC-046` grepped — the only newline clause is `ABC-043`'s stdin one, unrelated). So the wording has **no live copy to repair** and `A8`'s own page is frozen. QE's note is the record, and the risk it names — a reviewer running `tail -c 2` and reopening a closed criterion — is a **hand-off sentence, not a ticket** |
| **`Q10`** | a genuinely cold `git clone && npm install && npm run chess` is still unperformed | **Owner is UAT and the destination already exists**: `ABC-042` is in `Ready for UAT`, and `EPIC-006` carries the deferred UAT columns. Cutting a ticket would duplicate work the next hop on this very ticket is positioned to do. QE strengthened the evidence in the right direction already (a real `npm install` in a `node_modules`-free worktree, exit 0, 1.5 s) |
| **`Q11`** | a legal prose change in the resolver (`MISSING_VALUE` naming `-h`) reds `A6`(i)'s only-argv-literal row | **QE measured it and recommended leaving it**, on the ground that *"by the criterion's letter this is correct"* — a message naming `-h` **does** write an argv literal for a flag the allowlist does not contain. It is **friction, one line, on a load-bearing row**. I agree; a ticket to exempt prose would weaken a row that kills real mutants to save one line of typing per decade |
| **`B5`** | the distance-≥2 residual is real and accepted, but the witness on record (mine and the `B1` hop's, `token.replace("xx","") === COLOUR`) is **KILLED**, not surviving; the surviving witness is QE's `OFFSET` shape | **Checked before declining**: the wrong witness appears in **no live artifact** — not on `ABC-042`'s page (grepped: zero hits for `distance`) and not in `src/cli.test.ts`. It exists only in context notes, and QE's note **already corrects it in the same substrate**. A ticket would have nothing to change. **One caveat worth flagging: QE's correcting note lives on `grugops/quality-gate-ABC-042-regate`, so the correction becomes durable only when that line merges** — which is held on `G1`. That is an observation for the Orchestrator, not a ticket |

## The defect class, referenced and not adopted

**Four instances of one class** — a criterion names a PROPERTY in prose while its instrument asserts
one SPELLING — are recorded by the Orchestrator at `ticket-to-pr-ABC-042`. **I referenced it once, in
`ABC-059`'s out-of-scope section, and adopted nothing from it.** The Orchestrator declined to raise a
process rule and named the owner (Factory Coach, on-demand, the project owner's call) and the reason
(`mode` is `lean`). **`ABC-059` repairs one guard and claims nothing about the class** — which is
also why it is `P3` and not higher: the class is interesting, the individual guard is cheap, and
conflating the two is how a four-line ticket becomes a policy.

**`AR-1` (C1/CSI outside bar 2's character class)** is likewise untouched: `L2`, outside the active
`L1` set, a standing accepted risk with BA/PM named as owner and a re-affirmation at the re-check.
Requiring it inside `ABC-058` would be gold-plating past a standing ruling, and `ABC-058` says so.
