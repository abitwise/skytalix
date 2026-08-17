---
id: 20260817T204000Z-ba-pm-decision-every-qe-finding-routed-two-tickets-cut-and-the-two-i-refused-b52f7c09
kind: decision
by: ba-pm
at: 2026-08-17T20:40:00Z
verified_by:
confidence: high
refs:
  - ABC-031
  - ABC-036
  - ABC-076
  - ABC-103
  - ABC-104
  - EPIC-006
  - plans/tickets/ABC-031-coordinate-move-input.md
  - plans/tickets/ABC-103-cli-test-production-module-count.md
  - plans/tickets/ABC-104-coordinate-move-totality-claim.md
  - plans/traceability.md
  - .grugops/context/quality-gate-ABC-031-qe-2026-08-17/notes/20260817T190536Z-qe-e2e-observation-abc031-qe-verdict-pass-with-findings-nine-mutants-five-gaps-8098ff04.md
supersedes:
---

# Every QE finding gets a ruling — two tickets cut, two accepted with reasons, and what I refused to cut

QE's verdict was **PASS WITH FINDINGS**, **5 gaps**, of which it closed 2, 3 and 4 with 19 rows in
the existing test file and left 1 and 5 open and routed. **Every one below gets exactly one
disposition. Nothing is left ambiguous.**

| gap | QE status | **my ruling** | where it lands |
|---|---|---|---|
| **1** — `A6` cannot see a redundant `legalMoves` call | OPEN | **wording repaired in-page; property accepted as unwatched, `UNKNOWN - verify`** | `ABC-031` page, 5 places. Separate `decision` note |
| **2** — the `legal`-omitted path was untested | CLOSED by QE | **accepted as closed; no page change** | QE's 3 rows |
| **3** — the out-of-scope grammar fence was untested | CLOSED by QE | **accepted as closed; no page change** | QE's 14 rows |
| **4** — `A5`'s corpus has 0 en-passant moves | CLOSED by QE | **accepted; NO follow-up ticket. Routed as an input to `ABC-076`'s live corpus discussion** | below |
| **5** — the module header's totality claim overshoots | OPEN | **ticket cut: `ABC-104`** (`XS`, `P3`) — the defect is in `src/`, so it cannot be a page repair | `plans/tickets/ABC-104-…` |
| **`A2`'s FEN** (engineer's find, correctly excluded from QE's count) | NOT-MET as written | **repaired in-page** | separate `decision` note |
| **`src/cli.test.ts` module count** (`ABC-076` engineer's find) | — | **ticket cut: `ABC-103`** (`S`, `P2`) | `plans/tickets/ABC-103-…` |

## Gap 4 — the en-passant corpus. **Accepted, no ticket, and here is why that is not laziness**

QE measured `A5`'s corpus exactly: **178 moves — 3 castles, 4 promotions, 19 captures, 0 en
passant**, all six perft FENs carrying `-`. The criterion that exists to catch a fabricated
`captured` never rendered the one move where `captured` names a piece **not standing on `to`** —
`src/apply.ts:109`, one of the three sites `ADR-0004` (2b) names.

**I am not cutting a ticket for it. Four reasons:**

1. **The hole is already filled.** QE built the fixture and added 2 rows; the en-passant move
   (`flags=1`, `captured=9`) is now round-tripped. A ticket would ask for work that is in the diff.
2. **`A5` was never vacuous.** Reference identity kills a fabrication whatever the flags are — QE's
   `M1` died on all six positions. The corpus gap meant `A5` could not *demonstrate* the specific
   corruption the ADR is about, not that it could not *catch* it. That is a weaker finding than it
   first reads, and QE said so.
3. **The residual is a corpus question, not an `ABC-031` question, and it has an owner who is live.**
   *"The six perft positions contain no en-passant square"* affects every future criterion that cites
   that corpus, not this one. **`ABC-076`'s corpus discussion is open now** — this belongs there as an
   input, and I am routing it there rather than opening a competing page. A ticket cut here would
   fork a decision someone else is already holding.
4. **The consumer is not shipping yet.** `EPIC-006`'s `undo` (`ABC-102`, `Backlog`, blocked on an
   Architect/Design ruling it shares with `ABC-046`) is what reads `captured` back off a `Move`. The
   guard needs to be real **before `undo` merges**, not before `ABC-031` merges.

**The falsifier:** if `ABC-076` closes its corpus discussion **without** adding an en-passant
position, this becomes a ticket against `EPIC-006`, cut before `ABC-102` is pulled. Stated so the
acceptance has an expiry and is not a quiet drop.

## `ABC-103` — the hard-coded production-module count. **Cut, `S`, `P2`**

`src/cli.test.ts:733`: `expect(productionModules()).toHaveLength(20)`. A global counter in a local
row. **Every new production module reds the suite**, with a failure that names neither the module nor
the reason, and the only repair is a human bumping a literal in a file about the CLI entry point.
**Measured: two hops in one day** (`ABC-076` and `ABC-031`), neither of them about the CLI.

**I agree it is a real recurring tax, and the reason it is cheap to remove is that the row's stated
purpose does not need the count.** Its own comment says it exists so the entry point is *flat in
`src/`* — and flatness is already carried by the two `toContain` assertions and the `nested` check in
the same `it` block. A nested `src/cli/main.ts` changes the *listing*, not its *length*. **The count
adds no discrimination to the purpose it was written for.**

**Sizing `S` (2)**: one assertion repaired with a stated rationale, plus a named two-file sweep
(`src/render-seam.test.ts:88`, `src/history-pane.nfr.test.ts:163` build the same listing — the
engineer reports whether either asserts a total, and *"neither does"* is a valid deliverable).
`A1` requires the new-module red to be gone **in both directions**; `A2` requires the flatness
assertion to still go red when `src/cli.ts` moves to `src/cli/main.ts`, so the repair cannot be a
deletion in disguise. **Zero test files added, so `N8-LANE` is untouched.**

**Priority `P2`**: real recurring cost, measured, but no user value — it ranks below anything a
player can see and above anything cosmetic. **It gets cheaper the earlier it lands**, because every
module added first pays the manual bump again.

## `ABC-104` — the totality claim. **Cut, `XS`, `P3`, blocked on `ABC-031` merging**

`src/coordinate-move.ts:30` says *"It is a TOTAL function and does not throw"*, unqualified;
`parseCoordinateMove(null, "e2e4")` and `(pos, "e2e4", 42)` both throw. **`A4` is genuinely MET** —
it scopes totality to `text` and 0 of 34 hostile text inputs threw — so this is a precision defect in
prose, not a defect in code. **It is a ticket and not a page repair for one reason: it lives in
`src/`, and neither QE nor I edit production code.**

The ticket fences the behaviour change out explicitly: **no guard, no `try`, no widening**. Making
the function total over `position` and `legal` would change the contract `ADR-0004` clause 2 sets and
is an ADR question. `XS`, and `P3` because the audience is the next parser's author — but **not
dropped**, because `ADR-0004` (2a)'s divergence-from-`parseFen` paragraph is precisely the prose that
gets copied by reflex into `ABC-032` and `ABC-033`. It should ride the next touch of that file.

## What I refused to cut, named so the refusals are auditable

- **No ticket for the zero-call property.** Ruled accepted-as-unwatched; see the separate note. A
  ticket would buy a 160 ms test file to watch a correctness-neutral micro-cost that `ABC-036`
  already has the file for.
- **No ticket for deleting `src/coordinate-move.test.ts:103-109`** — the row that pins the defective
  FEN's single legal move. It stays green after my repair (it asserts a string literal in the test),
  so nothing reds to announce it; it has done its job and should be removed at the next touch of that
  file. **Routed to the engineer at `ABC-031`'s close-out.** Seven stale test lines do not earn a
  page that would outlive them.
- **No ticket for QE's section 6 smaller items** — the single-position `ambiguous` coverage, the
  indirect `N >= 2` closure, `A4` not asserting the reason code, the unpinned trim character set, and
  the `toLowerCase` / `toLocaleLowerCase` observation. **These are QE's own "noted, not raised" list
  and I am not promoting them over QE's judgement.** The `toLowerCase` one is a good catch and is
  now recorded in two places; if any of these matter later they matter in `ABC-032`/`ABC-033`, which
  write their own criteria.

## Where `ABC-031` stands after this hop

**7 of 7 CAN be recorded once this page repair merges**, and not before. The only thing holding
`A2` at NOT-MET-as-written was the printed FEN, which is now repaired and verified. **6 MET + 1
repaired = 7**, with gaps 2/3/4 closed by QE's rows, gap 1 withdrawn-and-ruled on the page, and gap 5
carried out to `ABC-104`. **Nothing under `src/` was touched at this hop and no board column was
moved** — the Orchestrator owns both.
