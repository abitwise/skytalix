---
id: 20260810T064504Z-orchestrator-decision-c71b2e05
kind: decision
by: orchestrator
at: 2026-08-10T06:45:04Z
verified_by: 
confidence: high
refs:
  - ABC-023
  - ABC-009
  - ABC-022
  - EPIC-001
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/board.md
  - plans/tickets/ABC-023-castling-precondition-net-hardening.md
supersedes: 20260810T061302Z-orchestrator-decision-3f8a91c4
---

# Definition of Ready re-run against the corrected `ABC-023` — **GREEN**. Pulled `Ready → In Development` (1/3). `In Analysis`, `In Design` and `Ready for Dev` skipped, with the reason.

## What I verified of BA/PM's hop, rather than accepting its report

The standing lesson on this board is *believing an instrument without checking the instrument* — the
Orchestrator made five such errors on `ABC-009` alone. So the hop's three load-bearing claims were
re-checked at the source:

```
md5 -q src/moves.ts                    6335b452fc21ffe2d0f902ecab930840   (unchanged)
git diff main --name-only -- src/      0 files                            (src/ untouched)
ticket frontmatter                     status: ready / column: Ready      (in sync with the board row)
board                                  Ready (WIP 2/8)                    (heading count matches the rows)
```

The hop reported "no production line, no test row" and the diff confirms it: 10 files changed, none
under `src/`. **`A4`'s premise — that this ticket's production diff is zero — is intact going into
development**, which matters because the engineer inherits it as a criterion.

## Definition of Ready — GREEN, all ten rows

Checked against `agent-factory/checklists/definition-of-ready.md` against the ticket **as corrected**,
not as cut. The row that held it in `Backlog` — the `ABC-009` ordering dependency — is discharged, and
the two criteria that were **unsatisfiable by construction** (`A4`'s stale hash; `A4`'s
"no existing test file is modified" against a `## Scope` that says the file gains rows) are repaired.

**The blocking check this board exists to run, and `ABC-023` passes it.** On `ABC-009` a fix
implementing one precondition alone passed all six criteria, the whole suite and deep perft. The
analog for a test-only ticket is *a partial set of rows passing the whole criteria set*, and `A5` is
the structure that forbids it: it is a **pincer**, not a checkbox. Its first half (each named
discriminating mutant must **die**) cannot be met without writing the rows; its second half (all
**fifteen** behaviour-equivalent controls must still **survive**, killed count zero) cannot be met by
writing rows that over-fit to implementation shape. Neither half can be satisfied by satisfying the
other. `A1`, `A2` and `A3` each name a **distinct** mutant, so no two of them can cover for a third.

## `In Analysis`, `In Design` and `Ready for Dev` are skipped — the reason, so it is not read as a shortcut

No behaviour is being mapped and no structure is being decided: this ticket adds **no new module, no
new export, no new dependency edge and no production line**, and it extends a table-driven file that
already exists with a helper that already exists. There is nothing for the System Analyst to map and
no tradeoff for the Architect to record — an ADR here would document a decision nobody is making.
`Ready for Dev` means *"handoffs complete, ticket sized"*; there are no handoffs to complete and the
size was re-derived at this hop's row count. This is the same path `ABC-022` took last night.

**If the engineer finds it needs a production line, that is not a small surprise — it is `A4`
failing, and `A4` failing means a defect ticket.** Stated here so the skip cannot later be blamed for
absorbing one.

## Security/NFR is NOT enqueued now, and the trigger is left live rather than waived

`## Security / NFR triggers` says none, with a structural reason: zero production lines means no
changed code path, no allocation and no branch in the search's inner loop, so `NFR-001`'s count-based
discharge on `ABC-009` is untouched by definition. I am **not** converting that into a waiver. The
gate decision is deferred to the point where the diff exists and can be read — if the delivered diff
touches `src/` at all, Security/NFR is enqueued. If it is additions-only to one test file, the
trigger genuinely has not fired and the board records that with its reason rather than an empty
column.

## Who runs `A5`'s mutants — assigned here so it is not dropped between hops

`A5` requires roughly twenty-one mutant runs and **the ticket does not say who runs them.** That
ambiguity is how a criterion ends up asserted by nobody. Split, on this board's own precedent:

- **The engineer** runs the discriminating mutant for each row it writes. That is not extra work — it
  *is* the red-before-green evidence for a test-only ticket, where "red first" can only mean "red on
  the mutant, green on the delivered tree". A row never seen red proves nothing.
- **QE** independently re-runs all of them, plus the fifteen equivalents, plus its own sweep for the
  gaps the criteria do not name. On the last four tickets QE found survivors that passed every
  criterion — every one a gap in the criteria, never a defect in the code. Expect that again.

## Board moves taken by this note

`ABC-023` `Ready → In Development`. `Ready` 2/8 → 1/8, `In Development` 0/3 → 1/3. Both inside their
limits; no WIP exception used and none needed. `ABC-013` stays in `Ready` and is not pulled — the
owner named one ticket.

## Routing

One subtask enqueued: `ticket-to-pr-ABC-023-dev` → Software Engineer (Workflow 04 step 3, gate per
Workflow 05). Width **1**, by dependency: QE cannot break rows that do not exist yet.
