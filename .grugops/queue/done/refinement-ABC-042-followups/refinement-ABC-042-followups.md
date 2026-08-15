---
task: abc042-followups-2026-08-16
subtask: refinement-ABC-042-followups
role: ba-pm
workflow: agent-factory/workflows/07-backlog-refinement.md
ref: .grugops/context/refinement-ABC-042-followups/
parent_ref: .grugops/context/security-nfr-ABC-042-recheck2/
enqueued_by: orchestrator
enqueued_at: 2026-08-16T09:00:00Z
branch: grugops/refinement-ABC-042-followups
base: main
---

# Subtask: cut the follow-ups — and do NOT touch `ABC-042`'s page

**Branch from `main`.** This is deliberate and it is the opposite of every previous hop on this
ticket: your output is **new ticket files and new trace rows**, which belong on `main` and must not be
trapped behind a held ticket.

**The evidence lives on unmerged branches.** Read it with `git show <branch>:<path>` or by adding a
throwaway worktree — **never by merging.** Those branches carry `ABC-042`'s production commits, and
merging any of them lands a held ticket:

- `grugops/security-nfr-ABC-042-recheck2` — `.grugops/context/security-nfr-ABC-042-recheck2/notes/`
- `grugops/quality-gate-ABC-042-regate` — `.grugops/context/quality-gate-ABC-042-regate/notes/`
- `grugops/design-ABC-042-adr0011-clause3` — `.grugops/context/design-ABC-042-adr0011-clause3/notes/`
- `grugops/agents-md-ABC-042-dev-run` — `.grugops/context/agents-md-ABC-042-dev-run/notes/`

## THE HARD RULE OF THIS HOP

**Do not edit `plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md`. Not one line.**

Both gates have now PASSED against that page. Editing a criterion after gating means the gates were
run against a page that no longer exists, and this ticket has spent six hops establishing that a
moving page makes a gate meaningless. **The page is also already 28 lines over rule 2's budget
(`B2`), which you yourself measured and could not honestly close.**

Everything below therefore becomes a **new ticket**, not a repair. If you believe an item genuinely
cannot wait, say so and stop — do not edit the page and tell me afterwards.

## What to cut

**Group A — the merged-file guard (Architect/Design routed this explicitly, `XS`, two sites in one
file, cut them together):**
- `Q3` / `R5` — `LICENSED_DRIVERS`'s `toEqual` is weakenable to a subset and nothing asserts it was
  not. Architect priced the repair: one `toContain` over the comparator's literal text, ~4 lines, in
  the block at `src/history-pane.nfr.test.ts:437-443` that already reads the file.
- `D1` / `Q14` — the sentence Architect struck from `ADR-0011` clause 3 is still live **verbatim** at
  `src/history-pane.nfr.test.ts:196-199`, the docblock a hop adding a third licence entry reads first.

**Group B — the bar-1b and bar-3 instrument residuals (all Security/NFR's own findings about its own
bar text, all LOW, none blocking):**
- `S1` — bar 1b's `shell:` and no-concatenation clauses are asserted by nothing; `MS4` survives.
  **Security ruled the row IS writable and that the `B1` hop's premise was wrong** — read that ruling.
- `S4` — bar 3's probe token carries only `ESC`, so the bar's own `U+007F` clause **cannot fire**;
  `M3h` ships green while `U+007F` reaches the terminal. **The fix costs ZERO new spawns** (put the
  byte in the same argv token) — say so in the ticket, because `G1` is live.
- `S5` — the spawn-pin row counts over raw source, so a legal docblock sentence naming `spawnSync(`
  reds a correct file. Fix is `sourceOf` → `executableCodeOf`.
- `Q5` — bar 1b's regexes should say they apply to **executable code**. Security called this a
  clarification of an already-decided rule that never blocked anything.

**Group C — wording that outlived `ABC-042` and should not be lost:**
- `A12`'s "the delivered diff" does not say WHICH diff. The Orchestrator ruled it (`e140355`, six
  paths) and recorded the command; the **wording** is still ambiguous for the next ticket that copies
  it. `Q12`, owner BA/PM.
- `S6` — `A1`'s guard pins a **spelling**, not a fact, which is the mechanism that let `Q13` through a
  green gate. `Q8`, `Q11`, `B5`, `Q10` (cold-clone `A1`, UAT's) as you judge.

**Group D — do NOT cut, and say why in your notes:** `G1`/`Q9` and `B2` are with the **project
owner** and are not yours to ticket around. `E3` is **accepted** by Security on evidence with a named
trigger shared with Architect's `E2` — **one trigger, not two**; do not cut a ticket that re-opens it.

## Also worth your judgement, not instruction
**Four instances of one defect class are recorded** in
`.grugops/context/ticket-to-pr-ABC-042/notes/…-one-defect-class-four-times-…` (on `main`). The
Orchestrator declined to turn it into a process rule — that is the owner's call via the Factory
Coach. **You may reference it; do not adopt a rule from it.**

## Hard limits

- **ZERO code. ZERO edits to `ABC-042`'s page.**
- **Do not write `plans/board.md`** — the Orchestrator's. **You MAY append new rows to
  `plans/traceability.md`** for tickets you cut; append only, touch no existing row, and **re-split
  each new row after writing to assert 10 columns** (a raw `|` inside a cell breaks the table — it
  has happened here, escape it as `&#124;`).
- Size, priority and DoR each new ticket honestly. **`XS`/`S` is expected; do not inflate.**
- **Do not merge, do not push, do not deploy.**

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — none is
emittable here; do not invent one. Claim per Workflow 17 by hand: `mkdir -p .grugops/queue/claimed`,
then a **bare** `mkdir` of the task directory. Commit on your branch.

Report: each ticket cut with its id, size, priority and DoR; which items you grouped and why; which
you deliberately did NOT cut and why; the new trace rows appended; and any item you believe cannot
wait for a follow-up.
