---
id: ABC-071
title: The `Dev / run` slot guard has no START anchor either — a second slot appended after the first is invisible, the same broken slot placed BEFORE the good one reds, and the guard's result depends on which copy comes first
status: backlog
column: Backlog
size: XS
priority: P2
epic: —
feature: —
---

# ABC-071 — `Q7`, the other end of `ABC-067`'s unanchored locator

> **Cut 2026-08-16 by BA/PM** (task `refinement-abc065-wording`, Workflow 07) from QE/E2E's **`Q7`**
> (`LOW`, owner BA/PM) at the `ABC-065` gate.
>
> **CUT SECOND, AND ONLY BECAUSE THE OTHER END CLOSED WITHOUT IT.** This hop first ruled `Q7`
> **folded** into the concurrent `refinement-Q8-slot-guard` lane — same function, same root cause —
> and wrote the criterion out for that lane to adopt. **That lane's ticket, `ABC-067`, is now on disk
> and its `## Out of scope` excludes `Q7` by name, expecting this hop to cut it; its queue entry has
> drained to `done/`.** Both hops reached the same reading independently and each expected the other
> to carry it. **Rather than leave `Q7` owned by two notes and no ticket, it gets this page — with
> `ABC-067`'s own recommendation reproduced as this ticket's first dependency: BUILD THE TWO IN ONE
> HOP, or fold them before either is pulled.** The fold decision and its reversal are both recorded
> in `.grugops/context/refinement-abc065-wording/notes/`.

## Problem

*User*: the next hop that trusts a green `ABC-065` guard to mean *"`AGENTS.md`'s `Dev / run` slot is
reachable and its option list is the accepted set."*

*Pain*: **the guard locates its subject with `agents.indexOf("- Dev / run:")` — the FIRST match — and
never checks that the label occurs once.** QE measured both directions at the gate:

| mutant | the change | result |
|---|---|---|
| `N3a` | a duplicate `- Dev / run:` slot, **no separator, no options**, appended **after** the repaired one | **GREEN 32/32** — the second slot is invisible |
| `N3b` | the same broken duplicate placed **before** the good one | **RED**, on both rows |

**The guard is direction-asymmetric: the same file content passes or fails depending on which copy
comes first.** That is `ABC-067`'s defect seen from the other end — *"one unanchored locator seen
from two ends"*, in that ticket's own words, and both repairs land in the same six lines of
`devRunSlot()`.

**The honest statement is narrower than "the guard misses duplicates", and QE said so:** *"it guards
the FIRST slot, and the file's convention is that there is one."* `AGENTS.md` has one `### Development`
section, and `ABC-042`'s merged `A1` row would be satisfied by either copy. **This is not a hole
`ABC-065` opened** — it is an assumption `ABC-065` inherited and did not write down.

*Value*: small, and it is the difference between a guard whose result is a property of the file and
one whose result is a property of the file's ordering. **Two of this session's `MEDIUM`s were
positional references that rotted; this is a third, inside an instrument.**

## Scope

- **`src/cli.test.ts`, `ABC-065`'s block, the slot locator only.**
- **Decide the uniqueness question and write the decision into a criterion of THIS ticket** — either
  the slot label must occur exactly once (assert it) or duplication is accepted (say so, in the
  block, with the reason). **A decision, not a tidy.**
- **If uniqueness is chosen, one assertion is the whole repair:**
  `expect(agents.split("- Dev / run:").length).toBe(2)` — one occurrence, expressed as the split's
  arity so the failure message names the count.

## Out of scope

- **`ABC-065`'s merged `A1`, `A3` and every other criterion of `ABC-065`, `ABC-066` and `ABC-042` —
  not one word.** `A1` says *"the `Dev / run` slot"*, **singular, and does not require uniqueness**.
  **That is exactly why this is a new ticket and not an edit**: requiring uniqueness is a NEW
  obligation, and adding it to a criterion its gate already scored would mean the gate ran against a
  page that no longer exists. **The obligation lives on this page.**
- **`AGENTS.md` — not edited.** `ABC-067`'s fence, adopted verbatim: *"the defect is in the reader,
  not the read"*, and repairing it by rewording the documentation makes the guard's correctness
  depend on prose again, **which is the defect**.
- **`Q8` / the window's missing UPPER bound — `ABC-067`'s**, and not repeated here. This ticket
  anchors the **start**; that one bounds the **end**.
- **`Q9`** (the slot's two unwritten rendering conventions) — `ABC-069`'s, and it is documentation,
  not code.
- **`Q10`/`G8`** — already repaired in `ABC-065`'s prose at the cutting hop; nothing left to do.
- **Any production file, any new test file, any new child process.**

## Acceptance (Given/When/Then)

- **`A1` (the appended duplicate no longer ships green).** **Given** `AGENTS.md` with a second
  `- Dev / run:` list item appended **after** the repaired slot — no separator, no options — **when**
  the `ABC-065` block runs, **then** it **FAILS**, and the recorded reason names the **count of
  slots**, not a missing option. *(Today: **GREEN 32/32**, QE's mutant `N3a`.)*
- **`A2` (the asymmetry is gone).** **Given** the same broken duplicate placed **before** the good
  slot (QE's `N3b`), **then** it **still** fails — and **both mutants fail for the same stated
  reason.** *(Today: `N3b` reds on the option rows, `N3a` is green: same content, opposite verdicts.)*
- **`A3` (the unmutated file is unaffected).** **Given** `AGENTS.md` as delivered on `main`, **then**
  the slot label occurs **exactly 1** time, the captured slot is unchanged, and `ABC-065`'s `A1` and
  `A3` rows, `ABC-042`'s `AGENTS.md` row and the whole suite are **green, skip 0**.
- **`A4` (the assumption is written down wherever it is not asserted).** **Given** the delivered
  block, **then** **0** assumptions about the slot's uniqueness are left unstated: either an assertion
  enforces it, or one comment sentence records that duplication is accepted and why. *(Today: 1
  unstated assumption.)*
- **`A5` (nothing else moved).** **Given** `git diff --name-only <delivered commit>~1 <delivered
  commit>` — excluding `.grugops/` — **then** exactly **`src/cli.test.ts`**, one path; **0**
  production lines; **0** new files; **0** new child processes (`spawned` still **10**).

## Dependencies

- **`ABC-067` REPAIRS THE SAME FUNCTION AND THIS IS THE FIRST THING TO READ.** `Q7` (no start anchor)
  and `Q8` (no end bound) are one unanchored locator, and both repairs land in the same six lines.
  **`ABC-067`'s recommendation is reproduced here as this ticket's own: build the two in ONE hop, or
  fold them before either is pulled.** Built separately, the second hop rewrites the first hop's
  function. **The Orchestrator decides; neither ticket widens its scope on its own authority.**
  *(`ABC-067` could not name this id — it was cut concurrently and could not read it. It can now.)*
- **`ABC-065` is merged @ `460b9f5` and sits in `Ready for UAT`.** This ticket changes the guard
  `ABC-065` delivered. **Building it before that UAT changes the UAT's subject underneath the UAT
  Planner** — identical to `ABC-067`'s first dependency, and the Orchestrator's call, not inferred
  here.
- **`ABC-069` touches the same slot from the documentation side** and is `XS` prose in `AGENTS.md`.
  Either order; no conflict — **different file**.
- **No blocker.** Both mutants are measured and published; the repair is one assertion.

## Security / NFR triggers

- **`N8-LANE` NOT triggered** — **0 new test files, 0 new files under `src/`, 0 new child
  processes.** The added work is one `split` on a string the block has already read; the file is
  read once, as today.
- **`NFR-002` not triggered.** No frame path, no production module.
- **Security: not triggered.** `ABC-041`'s four clauses: **(a)** no manifest touch; **(b)** the only
  file touched is a `.test.ts` — no production capability surface changes; **(c)** no network, no
  write, no spawn added — the block still only reads the repository's own markdown; **(d)** blast
  radius is one `it` block in one test file.

## Test notes

1. **Watch `N3a` red before it is fixed.** It is green today; a repair whose mutant was never seen
   green-then-red proves nothing. `N3b` is already red — **its red must not be counted as evidence
   for this repair**, which is exactly the asymmetry `A2` exists to remove.
2. **Revert every mutant and prove it.** QE applied 18 to `AGENTS.md` and `src/cli-options.ts` at the
   gate and reverted all 18. `AGENTS.md` is the file a human reads to run this project; leaving a
   mutant in it is worse than the defect.
3. **Do not fix this by rewording `AGENTS.md`.** See `## Out of scope` — it is `ABC-067`'s fence and
   it binds here for the same reason.
4. **The failure message is half the criterion.** `A1` and `A2` both score the *reason* the guard
   gave. `expect(...).toBe(2)` on a split arity says *"expected 3 to be 2"*, which is diagnosable;
   a boolean assertion on a regex is not.
5. **Read `ABC-067` before writing a line**, whichever is built first — and if both are in one hop,
   satisfy both tickets' criteria and say which commit satisfied which.

## Lane cost — how many test FILES this ticket implies

**Zero.** One assertion in an existing block; no new file and no child process.

## Size and priority rationale

**Size `XS` (1).** One assertion, one comment sentence, one file — with both mutants already measured
and published. **It is `XS` even including the decision, because the decision has one defensible
answer and the ticket names it.**

**Priority `P2`.** `LOW` severity as QE filed it — nothing is broken today and the file's convention
holds. It is `P2` rather than `P3` **only because of `ABC-067`**: the two repairs are in the same six
lines and the cheap moment is the hop that opens that function. **Promote to `P1`, or fold outright,
the moment `ABC-067` is pulled toward `Ready for Dev`** — after that, this ticket costs a second hop
in a function that was just rewritten.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 9 of 10 — one ⚠️, and it is sequencing, not scope.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the user, the locator quoted, both mutants and their opposite verdicts measured at a green gate, and QE's narrower honest statement kept rather than dramatised |
| 2 | scope and out-of-scope clear | **✅** one locator in one block; six fences, first of which is **no merged criterion edited** and second **`AGENTS.md` not edited** |
| 3 | INVEST-shaped | **✅** small, testable, and independently buildable — **though `## Dependencies` recommends it NOT be built alone** |
| 4 | acceptance testable and measurable | **✅** `N3a` GREEN→FAIL, both mutants failing for the **same** reason, slot label **exactly 1** on the unmutated file, **0** unstated assumptions, **1** path, `spawned` **10** |
| 5 | dependencies known | **✅** `ABC-067` (same six lines, fold recommended), `ABC-065`'s pending UAT, `ABC-069`'s different file |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` untriggered at **0** files / **0** spawns; four security clauses answered |
| 7 | test notes present | **✅** five, including "`N3b`'s existing red is not evidence for this repair" and "revert every mutant" |
| 8 | size assigned | **✅** `XS` (1) |
| 9 | priority assigned | **✅** `P2`, with the promotion/fold trigger tied to `ABC-067` |
| 10 | no major unresolved blocker | **⚠️ ONE, sequencing only, and it is the Orchestrator's.** `ABC-067` repairs the **same function** and `ABC-065`'s UAT has not run. **Neither holds this ticket in `Backlog`** — it is buildable at any moment — but both must be read before it is pulled, and **the one-hop-or-fold recommendation should be answered rather than discovered at the merge.** |
