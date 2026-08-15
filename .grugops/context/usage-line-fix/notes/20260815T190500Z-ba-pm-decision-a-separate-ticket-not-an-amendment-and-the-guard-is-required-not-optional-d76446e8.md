---
id: 20260815T190500Z-ba-pm-decision-a-separate-ticket-not-an-amendment-and-the-guard-is-required-not-optional-d76446e8
kind: decision
by: ba-pm
at: 2026-08-15T19:05:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - ABC-065
  - ABC-062
  - ABC-042
  - ABC-040
  - src/cli.ts
  - plans/tickets/ABC-066-usage-line-is-not-a-runnable-command.md
supersedes: 
---

# `ABC-066` is a separate ticket, not an amendment to `ABC-065` — and its guard test is required, not optional

Two rulings were owed at this hop and both are made here, with the reasoning, so the Orchestrator
relays a decision rather than a preference.

## Ruling 1 — a new ticket, `ABC-066`. `ABC-065` is NOT amended.

**The question was real.** This repository already carries `ABC-040` — a defect whose whole content
is *the same thing recorded twice* — and the previous cut hop explicitly deduped nineteen
recommendations down to seventeen to avoid producing that failure on purpose. A second ticket over
"the missing `--` separator" is exactly the shape that should be suspected.

**Three reasons it is nonetheless two tickets, in the order they decided it.**

1. **The diffs are disjoint, and neither ticket's criteria can be satisfied by the other's diff.**
   `ABC-065` delivers `AGENTS.md` + one block in `src/cli.test.ts`; `ABC-066` delivers one line of
   `src/cli.ts` + one block in `src/cli.test.ts`. **Close `ABC-065` and `npm run chess -- ` is still
   absent from the program's output (measured 0). Close `ABC-066` and the documented option list is
   still compared to nothing.** That is the operative test for a duplicate and it fails cleanly.
2. **Folding breaks `ABC-065`'s own measurable criterion.** Its `A6` reads *exactly `AGENTS.md` and
   `src/cli.test.ts` — two paths, zero production lines*. A production line cannot be added to that
   ticket without editing a criterion in order to fit the work into it, which is the inversion this
   project has ruled against repeatedly. It would also put a documentation fix and a `src/` change in
   one diff, and the gates treat those differently: `ABC-041`'s security clause (b) and the
   `ADR-0008` accounting both key on whether any production line moved.
3. **`ABC-065` is blocked and this is not.** `ABC-065` is DoR **9/10 NOT MET** behind a live queue
   claim on `AGENTS.md` (`.grugops/queue/claimed/agents-md-owner-grants/`, still present). **The
   owner asked for the usage-line fix by name**; folding it in parks it behind a claim it has no
   relationship to. Independence is the `I` in INVEST and it is not free here.

**Why this is not the `ABC-040` failure.** `ABC-040` is **two rows for ONE ticket inside one file** —
one record duplicated, where the second copy carries nothing the first does not and a reader taking
the last match gets stale data. `ABC-065` and `ABC-066` are two tickets over two files with disjoint
acceptance and no shared cell. The resemblance is in the subject line only.

**Rejected alternative — fold into `ABC-062` instead.** Tempting: `ABC-062` already reads the same
string out of the same stderr in the same test file. Rejected for reason 2 — `ABC-062` is a coverage
ticket with `A6` pinning **one path and zero production lines** — and because the two assert
different properties (see below). The overlap is instead **fenced in both directions** on the
`ABC-066` page: separately named blocks, neither edits the other's, and whichever merges second
reuses the first's stderr-to-usage-line helper rather than writing a second one.

**The three-ticket division, stated once so nobody re-derives it:**

| ticket | site | property it owns | production lines |
|---|---|---|---|
| `ABC-065` | `AGENTS.md` | the DOCUMENTED option list is reachable as written, and equals the accepted set | 0 |
| `ABC-062` | `src/cli.ts`'s line, read from stderr | a usage line is WRITTEN, and its VOCABULARY equals `ACCEPTED_ARGUMENTS` | 0 |
| `ABC-066` | `src/cli.ts:53` | the line's CONTENT is a command that RUNS | **1** |

`ABC-066`'s `A3` pins the vocabulary at **6 of 6 unchanged**, which is what keeps `ABC-062`'s `A4`
green whichever of the two merges first — the separator is not an `ACCEPTED_ARGUMENTS` token, so it
adds nothing to the set the other ticket compares.

## Ruling 2 — the acceptance criteria REQUIRE a guard test.

**Yes, and the reason is measured, not stylistic.**

- Nothing in the repository asserts the usage line at all: `usage` occurs in `src/cli.test.ts`
  **once, inside a comment**. QE proved the consequence — deleting `${USAGE}` from the rejection
  write ships **856/856 green**.
- The wrong content itself shipped past **two gates, a 30-file suite and a nineteen-scenario UAT
  pack**, and was caught only by a human who did what the program told him to do. A string fix with
  no guard restores exactly the conditions that produced it.
- The mutant is therefore free and unusually honest: **`main`'s current line IS the mutant.**
  Restore `src/cli.ts:53` byte-for-byte and the new block must go RED.

**What the guard may and may not cost.** Zero new child processes. `spawned` is pinned at **10** at
`src/cli.test.ts:780`, an eleventh is a defect by `ABC-062`'s fence, and `N8-SPAWN` was ratified by
the owner as an **attribution, not an allowance**. The guard reads the line off refusal children
already captured at module scope.

**What the guard therefore does NOT prove, stated in the ticket rather than hidden.** It proves the
invocation the line advertises **resolves** — it cannot prove npm forwards the tokens after `--`,
because that is the package runner's behaviour and no test in this lane can reasonably reach it.
That half is a UAT scenario, and `ABC-066` routes it there instead of buying a child for it.

## What this hop did not do

**No `src/` change, no test written or edited, no `AGENTS.md` edit** — the fix is CUT, not made.
**`ABC-042` does not move and its page is not edited**: it is accepted and `Done`, and `ABC-066` is a
**new requirement**, not a criterion it missed — `A6`(iii) requires a usage message *naming the
offending argument* and the delivered build does that on all ten measured refusals. **No
`plans/metrics.md`** — the `Escaped defects` row is the Factory Coach's and is deliberately left
owed. New work landed in `Backlog`; `Ready` stays empty at 0 of 8.
