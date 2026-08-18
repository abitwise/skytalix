---
id: 20260819T234500Z-architect-design-artifact-ref-what-this-hop-wrote-and-what-it-refused-d4f7b0e5
kind: artifact-ref
by: architect-design
at: 2026-08-19T23:45:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ADR-0014
  - ADR-0015
  - memory-bank/00-index.md
  - plans/traceability.md
supersedes:
---

# What this hop wrote, and what it deliberately did not

## Written

| file | what |
|---|---|
| `memory-bank/50-decisions/ADR-0015-a-substituted-module-must-be-a-seam-supplier.md` | **NEW, `accepted`.** The rule: a substituted module must be a seam supplier; clause 2 (a criterion needing an unconstructable fault is not a licence to widen); clause 3 (`A3`'s in-contract instrument) |
| `memory-bank/00-index.md` | count line **fourteen → fifteen**, `ADR-0001`–`ADR-0015`, next free **`ADR-0016`** — **in the SAME COMMIT as the ADR**, as that line's own rule requires |
| `.grugops/context/design-rig-licence-2026-08-19/notes/` | this hop's four notes |
| `.grugops/queue/claimed/design-rig-licence/claim.md` | the claim, taken by a bare `mkdir` first |
| `.grugops/queue/done/design-rig-licence.md` | the subtask file, moved from `pending/` |
| `plans/traceability.md` | **merge-conflict resolution ONLY** — both header stamps kept, newest first. **No table row added, edited or removed by me** |

## NOT written, and each for a stated reason

- **Nothing under `src/`.** Zero production lines and zero test lines. The `parserBug` child's removal
  is a real, required repair and it is **the engineer's**.
- **`plans/board.md`** — no column moved. `ABC-043` stays where QE left it.
- **`plans/nfr-catalog.md`** — no bar, floor or account moved. This ruling costs zero spawns and zero
  lane time; `N8-SPAWN`'s pin of 17 is untouched.
- **`plans/tickets/ABC-043-the-live-session.md`** — the ticket page is BA/PM's. `A3`'s disposition is
  published as a note for BA/PM to act on, not written onto the criterion.
- **`ADR-0009`, `ADR-0011`, `ADR-0013`, `ADR-0014`** — **not opened for writing.** No clause of any of
  them is narrowed, widened or re-opened. `ADR-0015` adds; it does not amend.
- **`AGENTS.md`** — untouched. `ADR-0015` is a conformance rule, not a command or a process rule.

## Branch and base

`grugops/design-rig-licence`, off `grugops/quality-gate-ABC-043-qe-2026-08-19` @ `afa68c2` (its tip),
with `main` merged in — **required**, because that base predates `ADR-0014` and would have made this
hop write a colliding `ADR-0014`. Committed incrementally: merge, claim, ADR + count line, notes,
queue move. **Not merged, not deployed, no board column moved.**

## Escalated

**One item, and it is BA/PM's, not the owner's:** does BA/PM's name-refusal of `./line-input.ts`
extend to `A3`, whose subject is the entry point's handler rather than the reader? Bounded to a yes/no,
with both branches and a no-answer default already dispositioned in this hop's disposition note.
**Nothing was escalated to the owner** — this ruling grants nothing, ships nothing and changes no
promise the product makes, so `ADR-0013` clause 4's *"a NO is mine to give"* shape applies.

## The one sentence to carry forward

**The three modules BA/PM named were not the fence, and `only` was not quite the fence either — the
fence is the composition, and it is readable off `src/cli.ts` in one grep.**
