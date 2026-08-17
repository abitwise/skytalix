---
id: 20260817T230000Z-orchestrator-observation-two-defects-hit-their-second-ticket-in-two-days-a-bad-fen-and-an-unmeasurable-bar-4c81ae63
kind: observation
by: orchestrator
at: 2026-08-17T23:00:00Z
refs:
  - ABC-032
  - ABC-031
  - ABC-010
  - N8-LANE
  - plans/nfr-catalog.md
confidence: high
verified_by:
supersedes:
---

# Two defects just hit their SECOND ticket in two days. Neither is about the code delivered.

`ABC-032` came back `A1`-`A7` all MET. **Both items below are things it tripped over on the way, and
both have now happened twice.** One occurrence is an incident; two in two days is a pattern, and
recording it is the only way the second one is cheaper than the first.

## Pattern 1 — a ticket's acceptance criterion cites an ILLEGAL chess position

| ticket | criterion | the FEN | defect |
|---|---|---|---|
| `ABC-031` | `A2` | (repaired at its QE hop) | kings adjacent |
| `ABC-032` | `A4` | `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1` | **kings adjacent on e1/e2** |

`ABC-032`'s `A4` intends to test **promotion** — `e8=Q` resolving to the queen promotion, bare `e8`
giving **exactly 4** candidates. **In the printed position the legal move list is `["Kxe2"]` and no
promotion exists at all.** The criterion as written is unsatisfiable, and it is unsatisfiable in a
way that a careless hop would "fix" by weakening the criterion.

**The engineer did the right thing** — measured `A4` on a minimally corrected FEN
(`8/4P3/8/8/8/4k3/8/4K3 w - - 0 1`), **pinned the defect as a test row**, and escalated the page
repair rather than editing the ticket himself.

**The systemic point: FENs are being hand-written into acceptance criteria and never executed before
the ticket is cut.** This project HAS a FEN parser (`src/fen.ts`) and a legal-move generator on
`main`, so the check is a one-liner. **`ABC-010` (FEN *semantic* validation) sits in `Backlog` and
is about the PRODUCT, not about this** — do not conflate them; a validated product parser would not
have caught a bad FEN in a markdown file.

**Not cut as a ticket by me.** The remedy is a step in how BA/PM cuts tickets, which is a process
change, and this is the second data point — the threshold question (process rule vs. tooling vs.
nothing) is the owner's and Factory Coach's, not mine to pre-empt.

## Pattern 2 — `N8-LANE` is a bar that two consecutive tickets could not measure

`ABC-031` closed with `N8-LANE` **`UNKNOWN - verify`**. `ABC-032` now does the same, and the
engineer's reasoning is the useful part: 7 interleaved paired CPU rounds gave a median delta of
**+10 ms** against a **650 ms** bar — comfortably under — **but the identity null control read a
340 ms median on a ~12 s lane, i.e. 2.8%, against `N8-LANE`'s own ≤1.5% admissibility clause.**
**He refused to call it a pass and recorded a `claim` at `confidence: UNKNOWN - verify` instead.**

**That is exactly right and it should not be smoothed at the gate.** But note what it means: **the
bar's admissibility clause is stricter than this machine's measurement noise**, so the instrument
cannot clear its own precondition regardless of the diff. **A bar that cannot be measured is not
protecting anything** — it is producing `UNKNOWN` on every ticket while looking like a live control.

**Two tickets is enough to say the instrument, not the tickets, is the subject.** The P60
out-of-tree method is Security/NFR's, and whether the clause is re-cut is Architect/Design's.
**Neither is decided here, and I did not route it** — `ABC-032` has a QE hop in flight and its
verdict may add a third data point.

## Where this goes

Both feed the **escalation stream the board header already names as open** — the one with six
tickets of QE gap data against a control that cannot consume them. **These are two more inputs to
that same unresolved question, and the correct move is to name them, not to open a third parallel
process.** Carried, not actioned.
