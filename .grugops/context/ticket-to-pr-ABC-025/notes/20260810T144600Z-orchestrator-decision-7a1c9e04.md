---
id: 20260810T144600Z-orchestrator-decision-7a1c9e04
kind: decision
by: orchestrator
at: 2026-08-10T14:46:00Z
verified_by: 
confidence: high
refs:
  - ABC-025
  - ABC-013
  - RISK-ABC013-04
  - EPIC-002
  - src/san.ts
  - src/san.test.ts
  - plans/board.md
supersedes: 
---

# Opening decision — cut `ABC-025`, then implement it. Task `ticket-to-pr-ABC-025`, branch `grugops/ticket-to-pr-ABC-025`

The owner asked for two things in one sentence: **cut `ABC-025`, then implement it.** They are two
hops with a hard dependency, not one, and the cut is the one that decides whether the second is worth
anything. `ABC-013` closed with five *proven* holes in its acceptance net; a ticket that re-states
those holes loosely would reproduce them.

## Where `ABC-025` comes from — read the source, do not take my summary for it

`ABC-025` is owed by `RISK-ABC013-04`. The evidence lives in `ABC-013`'s task context and it is
specific and measured — read it before writing anything:

```
.grugops/context/ticket-to-pr-ABC-013/notes/
  20260810T132221Z-qe-e2e-observation-02011fcc.md   the 40-mutant sweep: 31 killed, 9 survived,
                                                    5 DIVERGENT + 4 controls, and the four extra
                                                    mutants that die ONLY on the injectivity property
  20260810T132222Z-qe-e2e-observation-d99902de.md   the second oracle, the minimal-unique-qualifier
                                                    SEARCH definition, and the corner list
  20260810T132220Z-qe-e2e-observation-76af618a.md   the external `chess.js` oracle run
  20260810T150000Z-orchestrator-decision-9e2b04d5.md the close, and what it says is owed
plans/tickets/ABC-013-san-rendering.md              the 22 criteria this ticket extends, A1-A22
plans/tickets/history/ABC-013-board-history.md      the per-hop record
```

`src/san.ts` is on `main`, md5 `cbcc3be37c21414d16e8e6b4d0c68959`, 148 lines, one export `toSan`.

## The shape of the gap, in one line, so the ticket is not mis-cut

**The delivered code is minimal everywhere — checked against two oracles over 649,556 and 323,694
strings. What is missing is the *criteria* that would catch a build that is not.** Five mutants
emitted over-qualified SAN (`Ra1b1` for `Rab1`) and passed all 22 criteria and all 652 tests, because
minimality is exercised on **white knights and white queens only**, **all 18 acceptance FENs are
white to move**, and **no criterion pins a qualified capture**.

This is a **HARDENING** ticket, the same species as `ABC-023` and `ABC-024`: it is expected to deliver
**zero production lines**. If BA/PM or the Engineer concludes otherwise, that conclusion is a finding
and must be recorded as one — not acted on silently.

## My scoping error on `ABC-013`, named so it is not repeated here

On `ABC-013` I wrote a QE subtask that fixed the delivered diff at three files. QE honored it as a bar
on adding rows, proved five gaps, and could not close them. **The five gaps are open because of that
instruction, not because QE missed anything.** For this task I set no file-count bar on any hop. The
bar is the acceptance criteria and the gates; where a row belongs is the writing role's call.

## Routing, in order

1. **BA/PM — cut `ABC-025` to Definition of Ready.** Product clarity is BA/PM's, and on this project
   BA/PM has found acceptance defects at the pull gate on every recent ticket (18 on `ABC-013`, 6 on
   `ABC-023`, 7 on `ABC-009`). The ticket must be cut by the role that does that, not by me.
2. **Orchestrator — DoR gate.** I check the cut ticket against
   `agent-factory/checklists/definition-of-ready.md` and pull it `Ready for Dev → In Development` only
   if it holds.
3. **Software Engineer — implement.**
4. **QE/E2E — mutation-scored gate.**
5. **Security/NFR — the risk gate**, if a trigger fires. `src/san.ts` is not being modified, so the
   trigger set may well come back empty; that is a verdict to be reached and recorded, not assumed
   here.

Hops 3-5 are enqueued only after the hop before them lands. I do not pre-write subtasks for work whose
inputs do not exist yet.

## Board and limits

Every working column is empty (`In Analysis` 0/2 ... `Ready to Release` 0/4), so nothing about this
request touches a WIP limit. `queue.wip_limit` is 3; this hop uses **width 1** because the chain is
strictly sequential — the implementation cannot start before the ticket exists.

`ABC-024` sits in `Backlog` with its blocker (`ABC-023` merges) now satisfied and its **DoR NOT met**
(8 of 10). It is not being pulled here. Naming it so the sweep does not lose it.

## Hard limits, unchanged

Never merge to a protected branch by my own hand — the owner's standing directive covers merging
gated-green work and nothing else, and the keystroke has been denied and returned to the owner four
times in this project. Never deploy. Gates bind (`quality.gate_enforcement: blocking`).
