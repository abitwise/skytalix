---
id: 20260808T191500Z-orchestrator-decision-d35698a3
kind: decision
by: orchestrator
at: 2026-08-08T19:15:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - src/glyph-mode.ts
  - src/glyph-mode.test.ts
  - src/glyph-mode.nfr.test.ts
  - plans/board.md
  - EPIC-002
  - EPIC-006
  - NFR-007
  - RISK-005
  - 20260808T185400Z-orchestrator-observation-5342ab61
supersedes: 
---

# QE PASS verified, and BA/PM is scheduled BEFORE the Security/NFR gate — a reversal of the order this role published two hours ago

## QE's hand-off, checked rather than inherited

Gates re-run by this role on QE's tip `2168406`:

| Gate | Result |
|---|---|
| `npm test` | **277/277, 13 files** |
| skip count (`AGENTS.md` command) | **0** |
| `npm run lint` / `typecheck` / `build` | exit **0** / **0** / **0** |
| `git status --short` | clean |

**QE's central structural claim is confirmed independently:** `git diff 7024789 2168406 -- src/glyph-mode.ts`
is **empty** and the file's md5 is `9c1f4f4e957d4faf3c9cccc49a545185`, matching what QE reported.
**QE changed tests only** — 271 → 277 — and did not quietly repair the production module to make its
own verdict come out green. That is the property that makes a QE pass worth anything.

QE also re-checked this role's disproof of the Engineer's traceability flag, by a third method, and
it holds: 10 cells, same as the header.

## The order this role published earlier was wrong, and it is reversed here

The note `20260808T185400Z-orchestrator-observation-5342ab61` said BA/PM would be queued **behind**
QE so that QE's findings could join the Engineer's two spec items in one hop. **That much worked** —
QE found a third, and BA/PM now has one hop carrying three instead of two.

**But that note also implied BA/PM would follow the Security/NFR gate, and that is the wrong order.**
Corrected here rather than left standing:

**The Security/NFR gate certifies a change against its acceptance criteria.** Three roles — the
Engineer, QE, and this one — have now independently said those criteria are incomplete. Spending a
gate against criteria the factory already knows are incomplete, when settling them costs one small
hop, is exactly the shortcut this project's record is built on refusing. `ABC-011`'s second
Security/NFR run was refused and re-run rather than accepted on unbacked figures; the cheaper
version of that discipline is **not to spend the gate against unsettled criteria in the first
place**.

**One of the three items can change code.** The empty-locale ruling (`LANG=` counts as unset) is one
condition in `selectGlyphMode`. If BA/PM overturns it, a gate run before that ruling is void. The
Engineer ruled it at `confidence: medium` and QE concurs on the Engineer's own row-4 ground — so
ratification is the likely outcome, **but "likely" is not "settled", and a gate is not the place to
find out.**

## The three spec items going to BA/PM, none of which is a code defect

Every one is already covered by a test. Nothing in the delivered code is known-wrong.

1. **Criteria 10 and 11 are blind to a single-signal session.** Both move `isTTY` and the locale
   together, so a session forwarding only one passes all eleven. QE built two such sessions and both
   were real production defects.
2. **Criterion 6 is itself the one-at-a-time shape the ticket's own `## Test notes` forbid** — it
   sets `LC_CTYPE` alone, so the `LC_CTYPE` rung of the precedence was never pinned by any criterion.
   **QE found the ticket violating its own instruction.** New this pass.
3. **Empty locale variable counts as unset.** POSIX reading, ruled by the Engineer, concurred by QE,
   **specified by nobody.** The one that can change code.

## Board and WIP

`ABC-015` stays in **`In Security/NFR` (1/2)** while BA/PM rules. **This is deliberate and it is not
a column violation:** BA/PM is amending acceptance criteria, not taking a column exit. The ticket
does not move backwards for a documentation ruling, and the Security/NFR exit remains
Security/NFR's alone. Width **1 of 3**; `In Security/NFR` 1/2 is inside its limit.

Parallelising BA/PM with Security/NFR was considered and rejected again for the same reason as
before: **both would edit `plans/tickets/ABC-015-…md`**, and the queue claim protects a task, not a
file.

## One item for the Engineer, and this role does NOT adjudicate it

QE's single surviving mutant: dropping `Boolean()` around `process.stdout.isTTY` survives, and QE
calls the comment at `src/glyph-mode.ts:109-111` — *"the coercion is doing real work and is not
decoration"* — **false at runtime**. QE is right that it is not **behaviourally** load-bearing:
`!undefined` and `!false` are both `true`.

**It is not simply false, either, and the nuance is worth keeping.** `GlyphSignals.isTTY` is declared
`boolean`, while Node leaves `process.stdout.isTTY` **absent** on a pipe. `@types/node` types it
`boolean`, so removing the coercion typechecks and then feeds `undefined` into a field declared
`boolean` — the coercion is doing **type-honesty** work, keeping the runtime value and the declared
type in agreement, even though no behaviour depends on it.

So the comment is **overclaiming, not lying.** Whose sentence it is: the Engineer's. Not fixed by
QE (correctly — it is a production file and not QE's to edit), and **not fixed here**. It rides with
the BA/PM hop as an Engineer follow-up.

## Next action

BA/PM rules the three acceptance-criteria items on `ABC-015`. Then the Security/NFR gate.
