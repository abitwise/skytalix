---
id: 20260804T141000Z-software-engineer-claim-4afa292e
kind: claim
by: software-engineer
at: 2026-08-04T14:10:00Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - ABC-011
  - ABC-013
  - ABC-019
  - ADR-0002
  - EPIC-004
  - EPIC-006
  - src/history.ts
  - src/history.test.ts
  - src/zobrist.ts
  - plans/nfr-catalog.md
supersedes: 
---

# Six things this pass could NOT settle, handed to QE and Security/NFR rather than absorbed

Every item here is a `claim` at `confidence: UNKNOWN - verify`. **No `finding` is written on this
install — there is no §14 gate to issue a stamp, and no role may self-stamp.** Nothing below is
load-bearing for the board move; each is a lead with its reason for being a lead rather than a
defect.

## 1. Criterion 2's own test does NOT pin the BOARD half of `takeBack`

Measured, not suspected. Mutant M3 — `takeBack` truncates the move list and never replays the
position — **survives the criterion-2 test**. The reason is structural: after the take-back,
`gameStatusOf`'s verdict comes from `repetitionCounts`, which re-derives from the (correctly
truncated) move list, and the stale board still reads `in-progress`; and `repetitionCounts(history)`
versus a fresh replay compares two quantities that are both derived from the list, so neither
notices a board that was never rewound.

**The module is covered** — M3 is killed by the criterion-5 and criterion-7 tests, which do assert
the FEN. But `EPIC-006`'s named test is widely quoted as *the* guard on undo, and on its own it is
not. Whether to strengthen it (one `toFen` assertion would do it) is QE's call; it was not taken
here because it is not in any acceptance criterion.

## 2. Two mutants are killed by exactly one assertion each

M4 (the zero clamp removed) and M7 (`keyHistory` off by one) each die to a single assertion.
One-assertion coverage of a real defect class is thin by construction — an unrelated edit to that
one test would silently remove the guard. Named for QE's adversarial pass, not fixed by padding.

## 3. The double-push repetition test is still unwritten

The Orchestrator's pull note named it for the QE gate and deliberately did not order it, and
`AGENTS.md` rules 5 and 9 keep an engineer from adding unrequested work — so it was not added.
What is worth carrying forward: since `ABC-011`, `src/zobrist.ts:85` hashes the ep file only when a
**legal** ep capture exists, so a repeated line containing a double push with no capture available
now hashes **equal**. Such a test would therefore now assert something it could not have asserted
before `ABC-011`, and every test in `src/history.test.ts` deliberately avoids that path.

## 4. `playMove` validates nothing, and nothing in the repository fails if a caller lies to it

SEAM 1 priced the defensive `legalMoves` check at ~2–5 µs and left it out to match the core's own
style. The consequence is real and unguarded: passing a move that came from a *different* position
produces a corrupt board with no error. The documented precondition is the whole defence. Recorded
because this module is a single point of failure for four epics and the next role may want to decide
whether that is still the right trade now that the module exists.

## 5. The `position` borrow is untypeable and untested

`readonly` stops reassignment; it does not stop `history.position.board[0] = 0`, and there is no
deep-readonly for a `Uint8Array`. SEAM 1 accepted this explicitly. One consequence this
implementation adds and which is worth knowing: **`takeBack` rebuilds the borrowed object IN PLACE**
rather than replacing it, so a caller holding `h.position` across a take-back keeps a valid
reference. That is a deliberate softening of the failure mode, not a guarantee anyone should build
on.

## 6. Every NFR figure is one machine and one Node version

**Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0 arm64, `UNKNOWN - verify` anywhere else.**
Two samples agree to within about 1%, and the margins are 1.5x–7x under the bars, so a 3x slower
machine would still clear every one of them — but that inference is arithmetic, not a measurement,
and no non-M3 machine has run this harness. Security/NFR owns these bars and re-gates them; the
`NFRs` cell of the trace row and `plans/nfr-catalog.md` were deliberately left untouched for that
reason.

Two further limits on those figures, both stated in the observation note and repeated here because
they are the kind of thing that gets quoted without its fence: the `takeBack` number is an **upper
bound** (its two restoring `playMove` calls are inside the timed region), and `gameStatusOf`'s
3.2–3.6 µs margin over `repetitionCounts` is the one `legalMoves` call inside `gameStatus`, which is
**position-dependent** in a way the two derives are not.

## Carried, not fixed

`ABC-009`, `ABC-010` and `ABC-022`, exactly as `ABC-011` carried them. The start FEN is now literal
in **five** files rather than four — `## Out of scope` forbids the shared constant, and every test
file in this suite already declares its own.
