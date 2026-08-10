---
task: ticket-to-pr-ABC-023
subtask: ticket-to-pr-ABC-023-sec
role: security-nfr
workflow: agent-factory/workflows/05-pr-quality-gate.md
ref: .grugops/context/ticket-to-pr-ABC-023/
enqueued_by: orchestrator
enqueued_at: 2026-08-10T08:24:08Z
branch: grugops/ticket-to-pr-ABC-023
---

# Subtask: gate `ABC-023` — read 749 lines nobody has read for risk. **Do NOT re-measure the NFR bars.**

Read the shared verified context at `ref:` first (Workflow 16 step 1). **Nothing is inlined here.** The
Orchestrator's latest decision note carries the trigger ruling and its reasoning; the engineer's and
QE's notes carry the measurements. `ABC-023` is in `In Security/NFR` (1/2) and **you own that exit**.

## This gate is SPLIT, and the split is the whole instruction

The Orchestrator ruled the two halves differently. Read the reasoning in the decision note rather than
taking this summary as the argument.

### The NFR half has NOT fired. Re-measuring it would be a ritual — do not do it.

`src/moves.ts` is **byte-identical to `main`** (`6335b452fc21ffe2d0f902ecab930840`). Zero production
lines. No changed code path, no allocation, no branch in any inner loop. Every bar in
`plans/nfr-catalog.md` is a production-code bar, so a throughput re-measurement here measures `main`
against `main` and its result is **knowable before it runs**.

**Do not run `npm run perft`. Do not re-derive `NFR-001`.** Record the bars as untriggered **with the
structural reason**, not as measured, and not as an empty cell. `NFR-001`'s count-based discharge on
`ABC-009` stands untouched by definition.

If you disagree — if you think a bar genuinely could move here — **say so and measure it**, and say
why the byte-identity argument fails. A gate that cannot over-rule its brief is not a gate. But do not
measure to fill a column.

### The security half HAS fired, and it is the actual work

The ticket's own `## Security / NFR triggers` says "none". It is **right about NFR and incomplete
about security**, because it reasoned from an expected diff of ~17 rows and the delivered diff is
**749 new lines, written by two different agents, across three hops**.

Every review those lines have had asked exactly one question: *do the right mutants die*. **Nobody has
read them for anything else.** Test code is still code — it can carry a secret, a destructive command,
a network call, an unbounded loop, a process spawn, a path traversal, or a swallowed error, and none
of that shows up as a failing test.

The Orchestrator's own pattern scan came back empty. **Treat that as evidence, not as a gate**: it
searched for what it thought to look for, on a diff it had already decided was probably fine. Read the
lines.

## What to gate against

`security.asvs_level` is **L1**, `security.block_on` is **high**, `compliance_regime` is **`[]`** — so
**no Compliance Officer hand-off is owed**; record that rather than silently omitting it. Terminal
result is `PASS` / `PASS_WITH_RISKS` / `FAIL`. **Every accepted risk needs a severity and a NAMED
OWNER** — this board carried an unowned risk through three hops on `ABC-022` before it was caught, and
an accepted risk nobody owns is a risk nobody fixes.

## Boundaries

- **`src/moves.ts` must still hash `6335b452fc21ffe2d0f902ecab930840` when you finish.** You may not
  change production code, and you may not repair anything to make your own verdict green.
- **`A4` is a live criterion:** additions only to `src/moves.castling.hardening.test.ts`, no existing
  test row modified or deleted, no other file under `src/` touched. If a required fix would break
  `A4`, **stop and say so** — that is a conflict for the Orchestrator, not a judgement call for you.
- **Do not reopen `ABC-009`** and do not rule on QE's two deep-lane-only leftovers — a parallel BA/PM
  subtask owns those.
- **Do not enqueue anyone.** The Orchestrator owns decompose→enqueue, and **UAT and the merge are the
  Orchestrator's, not yours** — rule on your gate only.

## Numbers you owe from your own run

lint / typecheck / build exit codes, `npm test` count, skip count, and `PERFT_DEEP=1` **32/32** — the
deep lane is a standing bar under `A4` and is cheap; that is the one perft run that IS owed. The
test-integrity checker exits **2** here (`.grugops/test-skips.md` does not exist): a known, recorded
condition on this board — "could not run", **not a pass**, not the exit-`1` short-circuit. **Do not
create the registry file**; skip count is 0 so nothing is owed a justification.

Publish typed notes per Workflow 16 in the exact shape of `agent-factory/contracts/context-note.md`.
**`finding` is NOT admissible on this task** — there is no §14 gate here to issue a `§14-gate#<id>`
stamp and `context.human_admission` is `off`. Record results as `observation` / `decision` / `claim`.
Nothing self-stamped; no `index.md` / `index.jsonl` hand-faked.

Claim by hand: **`scripts/claim.js` does not exist in this install.** The claim is the atomic `mkdir`
of `.grugops/queue/claimed/<subtask>/` with a `claim.md` inside it, then `mv` the subtask file in, and
`mv` the whole directory to `done/` when finished.

Take your own `at` from `date -u`; **this machine is UTC+3**, so a local timestamp labelled `Z` is a
three-hour lie. Update your own row in `plans/traceability.md`. Take the `In Security/NFR` exit on
`plans/board.md` per your verdict, keeping the ticket frontmatter in sync in the same commit, and
**archive the outgoing `_Updated:` header verbatim to `plans/tickets/history/ABC-023-board-history.md`
BEFORE replacing it**. A parallel BA/PM subtask is editing `plans/board.md` too — **re-read the file
immediately before you write it** rather than trusting a copy you read earlier. Commit on the branch
named in the frontmatter; **never commit directly on `main`**. Never merge, never deploy.
