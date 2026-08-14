---
task: abc042-b1-2026-08-15
subtask: ticket-to-pr-ABC-042-b1
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ref: .grugops/context/ticket-to-pr-ABC-042-b1/
parent_ref: .grugops/context/refinement-ABC-042-a6-nearmiss/
ticket: plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
enqueued_by: orchestrator
enqueued_at: 2026-08-15T16:00:00Z
branch: grugops/ticket-to-pr-ABC-042-b1
base: grugops/refinement-ABC-042-a6-nearmiss @ 59ea767
---

# Subtask: land `B1` — the criterion moved and the instrument did not

**Branch from `grugops/refinement-ABC-042-a6-nearmiss` @ `59ea767`, NOT from `main`.** That tip
carries the build, the repaired criteria, and every note from four prior hops. **`main` is NOT an
ancestor — do not merge it in.** This subtask file is tracked on `main` and will not exist in your
tree; read it before you branch. Its queue transition is the Orchestrator's.

**Read `parent_ref:` FIRST — six notes.** BA/PM ruled `E1` and **measured the clause before ruling
it**, on scratchpad copies, never in `src/`. **The clause, the code shape, the collision trap and the
four mutants are all in those notes.** Nothing from them is restated here — go read them.

## What `B1` is

BA/PM changed `A6`(i)'s near-miss set and `A6`(ii)'s draw budget. **`src/cli.test.ts` still implements
the old ones.** Until you land the change:
- `endsWith` and `trim` weakenings still ship green — **`V2.2.1 [L1]`, HIGH while open**;
- **the ticket page currently over-states its own coverage**, which is the one state this ticket has
  worked hardest to never be in.

`Q4`'s repair lands in the same hop: the 250-per-shape control becomes 250 within a bounded draw
budget, so an over-dropping filter **reds in milliseconds instead of hanging for 180 s**.

## The trap BA/PM flagged for you, in its own words in the notes

**The near-miss family is 138 cases but 134 distinct** — deleting either `-` of `--`, or either `i` of
`ascii`, collides. **Pin one deliberately and say which you pinned and why.** A count that drifts is
how the row stops being a tripwire.

## Hard limits on this hop

- **ZERO production bytes.** `src/cli.ts` and `src/cli-options.ts` come out byte-identical — prove it
  by md5 or blob SHA, not by reading a diff, exactly as your previous hop did.
- **Watch each mutant red before you believe it.** BA/PM measured `endsWith` and `trim` going GREEN →
  RED and the delivered build accepting **0 of 138** (no false RED). **Reproduce both directions**:
  the mutants must red, and the correct build must stay green. A false RED here is worse than the gap.
- **Do not edit the ticket page** — BA/PM's, and it was just repaired.
- **Do not write `plans/board.md` or `plans/traceability.md`** — the Orchestrator's. *(Fourth time on
  this ticket. The resulting board move is mine, not a gap you must report.)*
- **Do not touch `src/history-pane.nfr.test.ts`** — `A12` bounds it and `Q3` is Architect/Design's,
  running concurrently on its own branch.
- **`N8-LANE` is breached at 2.00× and escalated to the project owner.** BA/PM measured its clause at
  **+0.049 ms with zero new spawns**. **Any implementation that adds a spawn is the wrong
  implementation** — stop and say so rather than making a live escalation worse. Report your lane delta.
- Run the mandatory gates plus the test-integrity step and record the numbers. `self_fix_attempts` **2**.
  Rule on `PERFT_DEEP` and state the ruling.
- **Do not merge, do not push, do not deploy.**

## Also yours if you can take them cleanly, and say so if you cannot
`S1` / `S2` / `S3` from Security/NFR (BAR 1b has no in-suite instrument; bar 3 asserts line 0 rather
than the echoed token; the only-argv-literal scan misses template literals) — all LOW, all yours, all
in `.grugops/context/security-nfr-ABC-042-gate/notes/`. **They are not blocking. Take them only if
they need no criterion change**; `S1` in particular may, and if it does, stop and route it.

## Stop conditions

- Landing the clause requires a **production** change → **stop.** The build is correct; BA/PM verified
  the delivered resolver accepts 0 of 138 near-misses.
- The clause as written cannot be implemented without adding a spawn → **stop and say so.**
- Implementing it requires editing a criterion → **stop.** Criteria are BA/PM's, and this ticket has
  deleted two rather than let an implementer re-word one.
- The distinct-count differs from BA/PM's 134 → **stop and report the discrepancy** rather than
  quietly pinning your own number.

## Recording

Typed notes into `ref:` per Workflow 16, **hand-authored**. **No `kind: finding`** — no
`§14-gate#<id>` stamp is emittable here; do not invent one. Claim per Workflow 17 by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of the task directory. Commit on your branch.

Report: the terminal result; every mutant rebuilt and whether it redded, in BOTH directions; the
distinct count you pinned and why; production byte-identity by hash; your lane delta; the
`PERFT_DEEP` ruling; which of `S1`–`S3` you took and which you routed; and every gap with severity
and owner.
