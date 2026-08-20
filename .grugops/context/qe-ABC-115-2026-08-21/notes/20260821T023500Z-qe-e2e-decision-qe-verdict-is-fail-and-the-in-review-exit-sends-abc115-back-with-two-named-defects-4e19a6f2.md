---
id: 20260821T023500Z-qe-e2e-decision-qe-verdict-is-fail-and-the-in-review-exit-sends-abc115-back-with-two-named-defects-4e19a6f2
kind: decision
by: qe-e2e
at: 2026-08-21T02:35:00Z
verified_by:
confidence: high
refs:
  - ABC-115
  - G-QE115-1
  - G-QE115-2
  - G-QE115-3
supersedes:
---

# QE VERDICT ON `ABC-115`: **FAIL** — `In Review` → back to `In Development`, on two named defects, neither of which is a criterion

**NOT A STAMP.** `context.human_admission` is `off` and no `finding` is admissible on this install,
so this verdict is a hand-authored `decision` in git. It is a QE result and it is **not** a UAT and
**not** a business acceptance — 13 production lines shipped, so the zero-production-lines waiver
does not apply and acceptance is the named owner's word.

## What PASSES, said first and in full, because the FAIL must not be read as a broken build

- **All nine criteria `A1`-`A9` pass as written**, re-checked at my own hand rather than accepted:
  `A6` from `git` (exactly two files; empty diff outside them; 13 ≤ 15 production lines), `A7` from a
  base/delivered pair I re-ran (1207 → 1212, 40 files, 0 skipped), `A8`'s first branch from the
  delivered build's own exit codes.
- **All four mandatory gates green**: lint, typecheck, build, unit. Test-integrity `No findings.`,
  skip count **0**.
- **No flake**: `src/cli.test.ts` 20/20, the full lane 12/12.
- **`A9` has real teeth** — it is the only row that kills a bare swallow, and it also kills a
  mutant that ends the session 3.5 s late. Eight adversarial arms were built at this hop; **seven of
  the eight die.**
- **The TTY `UNKNOWN - verify` from the design hop is CLOSED and the answer is good**:
  `process.stdin.destroy()` ends the session on a real pty stdin, 0.61 s, exit 0, 3/3.
- **`N8-SPAWN` as re-derived is MET on all three clauses**, independently re-measured
  (0.202 s CPU per added child against ≤ 0.30; +1.14 s wall against ≤ 2.0; +6 children at the
  ceiling). The budget ruling's arithmetic reproduces.

## Why it is still a FAIL — two defects, both inside the diff under review

1. **`G-QE115-1` — the re-thrown branch is guarded by nothing.** Delete the `code !== "EPIPE"` test
   and the entire lane stays green (60/60), while the product's behaviour on a real write failure
   flips from *exit 1 with a 1542-byte stack* to *silent exit 0*. The central discrimination of a
   13-line fix, and of `ADR-0016` clause 3, is asserted by inspection only.
2. **`G-QE115-2` — the delivered test file states that this ticket breaches a budget it meets.**
   `src/cli.test.ts` still carries the superseded `<= 0.5 s added CPU` clause and the sentence *"THE
   CPU CLAUSE IS BREACHED AND IT IS SAID HERE RATHER THAN SHIPPED QUIETLY"*. The 2026-08-21 budget
   ruling superseded that clause and the delivery meets its replacement. This is `ABC-114`'s defect
   class — a true-sounding sentence that is not true — in code, in this diff, in the same comment
   block that invokes `ABC-114` twice about other sentences.

`G-QE115-3` (the wall and CPU clauses of `N8-SPAWN` are asserted mechanically nowhere) is recorded
as a gap and is **not** part of the FAIL: making a lane-timing clause mechanical is a design
question, not a bench fix.

## The reasoning, stated so it can be overturned on the same terms

**Neither defect fails a criterion, and I am not pretending either does.** `A8` names `AGENTS.md`
and `src/cli.ts`'s docblock and both are true; `G-QE115-2` sits in a third file `A8` does not reach.
The re-throw is a design clause, not an acceptance row. **A reader who holds that the `In Review`
exit is governed only by `A1`-`A9` should PASS this ticket, and that reading is defensible.**

I am not taking it, for one reason: **this project cut `ABC-114` for exactly this — four sentences
that were true when written and were left standing after they stopped being true — and passing a
diff that ships a fifth would make that ticket a rule the factory applies to everything except
itself.** The remediation is small and belongs to the engineer: one comment block rewritten to the
clause in force, and one child that drives a non-`EPIPE` error into stdout. **The second raises the
`N8-SPAWN` pin 23 → 24, which is a ceiling raise and therefore BA/PM's word — so the return trip
may need a BA/PM hop before the bench, and the engineer should not take that decision at the bench.**

**A cheaper alternative the Orchestrator may prefer, named rather than hidden:** accept
`G-QE115-1` as a knowingly-open residual (the ticket already scoped non-`EPIPE` codes out) and send
back only `G-QE115-2`, which needs no new child and no ceiling raise. That would be a defensible
call. It is not mine — my exit is the verdict, and the routing is the Orchestrator's.

## The two board moves, kept distinct

1. **TRANSCRIBED, not decided by me: `In Development` → `In Review`.** The engineer withheld it for
   the `N8-SPAWN` breach and the 2026-08-21 budget ruling discharged that blocker in BA/PM's own
   words. Recording the move the ticket was owed is not a QE judgement and I claim no credit for it.
2. **MINE: the `In Review` exit — FAIL → back to `In Development`** with the two defects named
   above. The net column count is unchanged, and that is a consequence of the two moves, not a
   third move and not a decision to leave the ticket where it was.

**Not done here, so no silence reads as a pass:** nothing fixed (`git status` clean, mutants
restored, `src/` byte-identical to `6acc3fb`); `src/cli.ts`, `ADR-0016`, `AGENTS.md` and every other
ticket untouched; the exit-code ruling and the budget ruling **not** re-opened; nothing merged,
nothing deployed, **no UAT conducted and nothing signed**.
