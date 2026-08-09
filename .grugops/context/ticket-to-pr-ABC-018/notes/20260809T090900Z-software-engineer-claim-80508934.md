---
id: 20260809T090900Z-software-engineer-claim-80508934
kind: claim
by: software-engineer
at: 2026-08-09T09:09:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ticket-to-pr-ABC-018
  - ABC-018
  - ABC-013
  - ABC-016
  - ABC-017
  - ABC-019
  - EPIC-003
  - EPIC-006
  - NFR-002
  - src/frame.ts
  - src/frame.test.ts
  - 20260809T084800Z-ba-pm-claim-d45d16a4
supersedes: 
---

# What this implementation does NOT establish — soft, non-load-bearing, explicitly unverified

`confidence: UNKNOWN - verify` on the whole note. Nothing here may be cited as settled; it exists so
QE and Security/NFR start from an honest edge rather than assuming a green suite is a closed
question. Four green gates and 20 passing tests are not a claim that the frame is right — they are a
claim that these tests pass.

1. **"The frame is correct on a real terminal" is NOT claimed.** No test in this suite attaches a
   TTY; every assertion is against a captured sink or an in-memory screen model, exactly as the
   ticket's `## Test notes` require. The model encodes four assumptions about terminal behaviour —
   `\n` implies a carriage return (ONLCR), the right-margin wrap is deferred, moving below the last
   row scrolls by one, and `ED(0)` does not move the cursor. They are stated in the file. If a real
   terminal disagrees with any of them, the redraw is wrong in production and no test here would
   notice. `EPIC-006` is the first place that is observable.

2. **Acceptance criterion 1 remains near-vacuous, exactly as BA/PM ruled, and this implementation did
   not change that.** It is honoured as strongly as stubs allow — a frame is assembled at **every**
   ply of a real 300-ply game and every row count must be identical — but a fixed-height stub makes
   any assembler pass. It is an integration obligation for `ABC-019` / `EPIC-006`, not evidence
   delivered here.

3. **`W = 18` is a stub fixture, not a promise about the shipped frame.** It falls out of the merged
   `renderBoard`, the widest real panel that exists. Whoever builds `ABC-016` and `ABC-017` sets the
   real `W`, and if either emits rows wider than 18 the message region's capacity — and therefore the
   `N` in every worked example in the ticket — changes. One test already pins that `W` follows the
   widest panel by handing in a 24-wide status stub.

4. **The `NFR-002` compute figure is a LOWER BOUND and is not a frame measurement.** Two of the three
   panels do not exist and `ABC-013`'s SAN derive is not in it. The sum will grow; whether it stays
   inside 16 ms once all three panels are real is `UNKNOWN - verify` and is `ABC-019`'s and
   `EPIC-006`'s to re-measure. Nothing in this ticket discharges `plans/nfr-catalog.md`'s row.

5. **The reserved prompt row's contract still has only ONE side written down.** This ticket reserves
   the row, renders nothing into it, and leaves the cursor at its start with no newline after the
   frame's last row. `EPIC-003` is expected to type into exactly that row and `ABC-019` to drive the
   loop around it, and neither has been told. That is the Orchestrator's recorded open item, it is
   not discharged here, and this implementation makes it concrete rather than hypothetical: there is
   now code whose correctness depends on a contract that exists in one ticket.

6. **The sanitizer is not a security architecture and is not claimed as one.** It strips C0, `U+007F`
   and — in ASCII mode — everything above `U+007F`, asserted on the emitted stream rather than on its
   own return value. It has not been fuzzed, and no claim is made about a terminal that interprets
   something outside that set. The disposition remains *strip on the way in* for a self-inflicted,
   single-user CLI, which is what the ticket's `## Security / NFR triggers` scopes it to.

7. **"No further defect remains" is NOT claimed.** 18 mutants died and **two survived the suite as
   first written**; the campaign is a sample, not a proof, and it was written by the same person who
   wrote the code — which is the exact reason QE runs next and re-derives rather than inherits. The
   last four review passes on this board each found something the Engineer's own campaign did not.
