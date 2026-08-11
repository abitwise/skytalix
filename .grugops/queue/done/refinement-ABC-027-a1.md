---
task: abc027-fail-2026-08-12
subtask: refinement-ABC-027-a1
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-027-a1/
parent_ref: .grugops/context/abc027-fail-2026-08-12/
enqueued_by: orchestrator
enqueued_at: 2026-08-12T02:15:00Z
branch: grugops/ABC-027-frame-clearing
worktree: ../cli-chess-ABC-027
---

# Subtask: re-derive `A1` so the required fix can be built — and do NOT relax it

**Security/NFR returned FAIL — the first in this project's history — and it is right.** It measured
on a real terminal that `ABC-027`'s emission **loses the last cell of every row at a window exactly
`W` wide**: the whole h-file of the board plus its label. Required fix `RF-1` moves the erase from
the margin to column 0.

**You are blocking that fix, and that is why this hop exists before the Engineer's.**

Read `parent_ref:` first, then Security/NFR's five notes in
`.grugops/context/security-nfr-ABC-027/notes/` — **especially its measurement of the primitive** —
then `A1` in `plans/tickets/ABC-027-frame-writer-clears-each-row.md`, then QE's four notes in
`.grugops/context/quality-gate-ABC-027-qe/notes/`.

## The contradiction

`A1` pins the emission byte for byte and it pins the **unsafe** one:

| | `A1` as written | the safe shape |
|---|---|---|
| `\x1b[K` count | **`H − 1`** (22) | **`H`** (23) |
| `\x1b` count | **`H + 1`** (24) | **`H + 2`** (25) |
| length delta | **`(H − 1) × 3`** = 66 | **`H × 3`** = 69 |

```
delivered : CURSOR_HOME + rows.join(EL + "\n")      + ED   <- EL fires AT the margin
required  : CURSOR_HOME + EL + rows.join("\n" + EL) + ED   <- EL fires at COLUMN 0
```

**The Engineer cannot build `RF-1` without going red on `A1`.** Re-derive it.

## The constraint that makes this hard, and it is the point

**Do NOT relax `A1`. QE measured it as where 9 of 14 mutants die.** Loosening it — dropping the exact
counts, or replacing them with a range or a `toContain` — would trade a three-character defect for
**the loss of the suite's single strongest killer**. `A2`, the criterion the ticket exists for, kills
only 2 of 14 and stayed green on 7.

Every number must stay **derived from `H`, never hardcoded** — the merged file's own rule and `A1`'s
own parenthetical. The new counts are `H`, `H + 2` and `H × 3`; the byte figure is **425 → 494**.

## Also in scope

- **The trailing-erase reasoning in `A1`'s note is now stale**: it argued no trailing erase because
  one is redundant under `\x1b[0J` and would break `:419`'s slice arithmetic. Under `RF-1` the erase
  is *leading*, so re-argue or strike it — do not leave a justification that describes a shape the
  ticket no longer has.
- **`A2`, `A3`, `A4`, `A5`, `A6` — check each against the new emission** and say which move. `A6`'s
  discharged characterization at `src/frame.test.ts:735-771` in particular.
- **The screen model's margin case is measurably wrong** and Security/NFR assigned its repair to the
  Engineer at the `RF-1` hop (`AR-1`). If you think that belongs in a criterion, say so.

## A warning from this ticket's own history

BA/PM has twice on `ABC-016` had a **repair** corrected by a later hop, and named the reason itself:
*a repair arrives with the authority of having just fixed something and gets read as a solution
rather than as a new claim.* **This is a repair. Treat your own new wording as an untested claim** —
the counts are cheap to verify against the two emissions before you write them down.

## Scope limits

- Re-derive size (`S`) and priority (`P1`); say if either moves. The fix is three characters, but
  say so rather than assuming.
- Do NOT edit `src/`. Do NOT edit `ABC-016`, `ABC-017` or `ABC-019` — agents are live on two.
- Do NOT write `plans/board.md` — the Orchestrator's.
- Do NOT re-open `ADR-0009` or `ADR-0010`; `RF-1` delivers cl. 1 and only changes where in the row
  the erase fires. Do NOT add a constant-frame-width criterion.
- `git commit` takes the INDEX, not the paths you just `git add`-ed (recorded defect `2cd84cd`).
- Never `git checkout main`, never merge, never deploy, never push.

## Working rules

Work in `../cli-chess-ABC-027` on branch `grugops/ABC-027-frame-clearing`, rebased onto current
`main` and re-gated green by the Orchestrator (**681/681 on 22 files**) — verify yourself. **Expect
`A1` to be GREEN right now: it describes the delivered, unsafe emission. That is the contradiction.**

## Recording

Typed notes into `ref:` per Workflow 16. `scripts/context-io.ts` does not exist here and
`mcp__grugops__propose_note` is unavailable — hand-author and say so. **No `finding`.** Claim per
Workflow 17 (atomic `mkdir`; create the `claimed/` parent if missing).

Report: the exact new `A1` wording with every number derived from `H`, which other criteria move,
your disposition of the stale trailing-erase note and the screen-model repair, size/priority, and
your requested board move.
