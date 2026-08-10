---
id: 20260810T082408Z-orchestrator-decision-5e9c6b73
kind: decision
by: orchestrator
at: 2026-08-10T08:24:08Z
verified_by: 
confidence: high
refs:
  - ABC-023
  - ABC-009
  - ABC-024
  - src/moves.ts
  - src/moves.castling.hardening.test.ts
  - plans/board.md
supersedes: 20260810T071749Z-orchestrator-decision-8d40f2a1
---

# Security/NFR trigger DECIDED — it fires on the security half and NOT on the NFR half. Two subtasks scheduled in parallel (width 2 of 3).

## QE's hop verified at the source

```
md5 -q src/moves.ts                     6335b452fc21ffe2d0f902ecab930840   IDENTICAL to main
git diff main --stat -- src/            1 file changed, 749 insertions(+)
git diff -U0 main -- src/ | removed     0 lines
npm test                                625 passed / 625 on 18 files
npm run lint / typecheck                exit 0 / exit 0
board                                   In Review 0/3, In Security/NFR 1/2
ticket frontmatter                      status: in-security-nfr / column: In Security/NFR
```

**`A4` holds across all three hops.** The production tree is byte-identical to `main` after BA/PM,
the engineer and QE. No gate repaired the module to make its own verdict green — the record this
board's verdicts rest on.

**QE was right not to decide the trigger itself.** It moved the ticket into the column and left the
gate call to me, saying that ruling past the column would be deciding it in the convenient direction.
That is the correct read of who owns what.

## The trigger decision, split rather than answered with one word

I said at the pull that this would be decided on the diff once it existed. It exists: **+749 lines,
one test file, zero production lines.** The honest answer is not "yes" or "no" — it is different for
the two halves, and collapsing them would be the convenient answer either way.

**The NFR half has NOT fired, and running it would be a ritual.** `src/moves.ts` is byte-identical to
`main`, so there is no changed code path, no allocation and no branch in any inner loop. Every bar in
`plans/nfr-catalog.md` is a production-code bar. A throughput re-measurement here would be measuring
`main` against `main`: the result is **structurally predetermined**, and a gate whose verdict is
knowable before it runs teaches everyone to stop reading gates. `NFR-001`'s count-based discharge on
`ABC-009` is untouched by definition. **Do not re-measure it to fill a column.**

**The security half HAS fired, on a ground the ticket did not anticipate.** The ticket's
`## Security / NFR triggers` says "none", with a structural reason that is sound **for the reason it
gives** — zero production lines. But it was written when the expected diff was ~17 rows. The delivered
diff is **749 new lines written by two different agents**, and every review it has had asked one
question only: *do the right mutants die*. Nobody has read those lines for anything else. Test code is
still code: it can carry a secret, a destructive command, a network call, an unbounded loop or a
process spawn, and none of that shows up as a failing test.

My own scan for the obvious patterns came back empty, which is evidence and not a gate — I searched
for what I thought to look for, on a diff I had already decided was probably fine.

**This is me over-ruling the ticket's own "no trigger" line, and it is recorded as an over-rule rather
than slipped in.** The ticket is right about NFR and incomplete about security, because the premise it
reasoned from (a tiny diff) changed by 44x.

## Second subtask: QE's two leftovers get a ticket, not a context note

QE measured two further survivors it correctly did **not** fix: the castling **right** test and `BQ`'s
`empty` corridor each survive the default `npm test` at 625/625 and die only in the deep
`PERFT_DEEP=1` lane (31/32). Both sit in `ABC-009`'s dimensions, and reopening `ABC-009` is nobody's
job on this ticket — so QE reported them and stopped. Correct.

**A measured leftover that lives only in a context note is a leftover that is lost.** That sentence is
`ABC-023`'s own reason for existing: it was cut from `ABC-009` *"so that three measured items stop
living only in context notes."* Applying the board's own precedent to its own output, BA/PM cuts the
follow-up. Losing a finding because the owner's request did not name it would be the worse error.

## Scheduling

**Width 2** against `queue.wip_limit` 3 — the first genuine parallelism on this ticket, and it is real
rather than decorative: one subtask reads a diff for risk, the other writes a new `Backlog` ticket.
They share no file and neither needs the other's output.

- `ticket-to-pr-ABC-023-sec` → Security/NFR. Owns the `In Security/NFR` exit.
- `ticket-to-pr-ABC-023-bapm2` → BA/PM. Cuts the follow-up into `Backlog`. **Takes no move on
  `ABC-023`.**

`In Security/NFR` is 1/2 and `Backlog` is unlimited; no limit is approached and no written reason is
owed.
