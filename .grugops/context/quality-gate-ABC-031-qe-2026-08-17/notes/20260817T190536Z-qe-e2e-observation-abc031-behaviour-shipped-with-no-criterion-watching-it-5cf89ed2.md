---
id: 20260817T190536Z-qe-e2e-observation-abc031-behaviour-shipped-with-no-criterion-watching-it-5cf89ed2
kind: observation
by: qe-e2e
at: 2026-08-17T19:05:36Z
verified_by:
confidence: high
refs:
  - ABC-031
  - ABC-033
  - ABC-034
  - plans/tickets/ABC-031-coordinate-move-input.md
  - src/coordinate-move.ts
  - memory-bank/50-decisions/ADR-0004-san-ownership.md
supersedes:
---

# `ABC-031` — behaviour shipped with **no criterion watching it**

The QE brief asked for this explicitly. `A1`-`A7` are a good set — six of nine mutants died — but
they do not span the module. What follows is behaviour that is **in the delivered code and in the
ticket's own prose**, with no acceptance criterion above it. Each is stated with the mutant or the
measurement that demonstrates it, so none of this is an opinion about style.

## 1. The `## Out of scope` fence had no criterion at all (was gap 3, now closed)

The page spends a bullet forbidding tolerances — *"No `e2 e4`, no `e2,e4`, no `P-K4`, no SAN-ish
input"* — and cites **coding rules 5 and 7** and the sentence *"the epic named two tolerances and
this ticket ships two"*. **`A1`-`A7` test which forms are ACCEPTED and never which are REFUSED.**
`A3`'s five rejection strings are all malformed (`zz9q`, `e2e4e5`, `""`, `e9e4`) or off-board; none
of them is a *plausible widening*. Mutant **M8** widened the grammar to swallow `e2 e4`, `e2,e4`,
`e2.e4`, `e2\te4` and `e2--e4` and passed **895/895**.

**Structural lesson, not local to this ticket:** an out-of-scope list is a testable claim, and on
this ticket it was the only section of the page with no criterion pointing at it. A fence nobody
tests is a comment.

## 2. The optional-parameter contract path was dead code to the suite (was gap 2, now closed)

`## Scope` lists *"An optional `legal?: readonly Move[]` parameter"* as part of the delivered
contract, and the header promises a caller may omit it. **Every `A1`-`A6` row supplies it.** Mutant
**M7** replaced the `legal ?? legalMoves(position)` fallback with `legal ?? []` and passed
**895/895 and `tsc --noEmit` clean** — the `legalMoves` import in the production module was, at that
point, unreachable by any test.

**Why this one had teeth:** `ABC-033` is the ticket that dispatches a line of input to a grammar, and
the two-argument call is the natural way to write it. Under M7 that caller gets
`rejected`/`no-such-move` **for every legal move on the board**, silently, with a green suite behind
it. Half the shipped API surface was unexercised.

## 3. `A6` is weaker than the ticket says it is (gap 1 — **STILL OPEN**)

`## Security / NFR triggers` states: *"This module's own cost bar is `A6`: with `legal` supplied it
performs **zero** additional `legalMoves` calls."* **`A6` cannot enforce that.** It asserts reference
identity of the returned move, and a wasted `legalMoves(position)` call whose result is discarded
disturbs no reference. Mutant **M6** did exactly that and passed **895/895**.

**I did not close this one, on purpose.** The only way to observe a call count here is a spy, a spy
needs `vi.mock`, `vi.mock` is hoisted to file scope, and that forces a **second test file** — which
is precisely what `## Lane cost` refuses and prices at 160 ms CPU. **The ticket's reasoning for one
file is sound; its claim that `A6` covers the call count is not.** These are two different
statements and only the first survives. Routed to BA/PM / Architecture as a wording repair: `A6`
proves **provenance**, not **call count**, and `NFR-003`'s zero-call claim is currently unverified —
`UNKNOWN - verify`.

## 4. `A5`'s corpus does not contain the case `A5` exists for (was gap 4, now closed)

Measured over the six perft positions `A5` names:

**178 legal moves — 3 castles, 4 promotions, 19 captures, and 0 en-passant moves.**

All six FENs carry `-` as the en-passant square. `A5` is the criterion whose stated purpose is to
catch a fabricated `captured`/`flags`, and `ADR-0004` (2b) names `src/apply.ts:109` — the en-passant
arm, which materialises the captured pawn from `move.captured` on unmake — as one of its three
sites. **The en-passant move is the only move where `captured` names a piece that is not standing on
`to`**, and it was absent from the corpus. Measured on the fixture I added: that move carries
`flags=1`, `captured=9`.

`A5` was not *vacuous* here — reference identity kills a fabrication whatever the flags — but the
corpus could not have demonstrated the specific corruption the ADR is about.

## 5. The header's totality claim overshoots the behaviour (gap 5 — **STILL OPEN**, low severity)

`src/coordinate-move.ts:30` reads *"It is a TOTAL function and does not throw"*, unqualified.
Measured:

- `parseCoordinateMove(null, "e2e4")` → **throws** `TypeError: Cannot read properties of null`
- `parseCoordinateMove(position, "e2e4", 42)` → **throws** `TypeError: ... .filter is not a function`

`A4` scopes totality to `text` and `A4` **passes cleanly** — 0 of 34 hostile text inputs threw. The
header is qualified 4 lines earlier by the caller-obligation paragraph, so this is a precision
defect, not a defect. Named because `ADR-0004` (2a)'s divergence-from-`parseFen` paragraph is exactly
the kind of prose a third parser's author will copy by reflex, and the next reader should know the
guarantee is *"total over `text`"*, not *"total"*.

## 6. Smaller items — noted, not raised

- **`ambiguous` is only ever observed at one position.** `A5` renders each move's own coordinate
  *including* the promotion letter, so every one of its 178 round-trips resolves to exactly one move
  and the `ambiguous` arm is never reached over the corpus. All ambiguity coverage rests on `A2`'s
  single FEN — the one that was defective.
- **`ADR-0004` (2a)'s `N >= 2` closure rule is enforced only indirectly.** A one-element `ambiguous`
  is caught because `A1` asserts `outcome: "move"`, not by any row asserting the rule itself.
- **`A4` asserts `rejected` but never the reason code** for hostile input. Matches the criterion as
  written; measured, all 34 return `unreadable`, which is the right code.
- **`text.trim()` accepts `\r\t\v\f`, NBSP and a trailing `\n`** as surrounding whitespace, so
  `"e2e4\n"` → `move`. Almost certainly correct and desirable for a line read off stdin (`ABC-036`),
  but `## Scope` says only *"Surrounding whitespace is trimmed"* and no criterion pins which
  characters count.
- **One genuinely good thing, recorded so it is not lost in a refactor:** the module uses
  `toLowerCase()` and **not** `toLocaleLowerCase()`. Under a Turkish locale the latter maps `I` to
  `ı` and would break `E2E4` case-insensitivity. No criterion covers it and it is easy to "tidy"
  into a bug.

## Where this leaves the ticket

**Gaps 2, 3 and 4 are closed** by 19 rows added to the existing test file at this hop (no new file,
so `## Lane cost` is unchanged; nothing weakened, skipped or deleted). **Gaps 1 and 5 are open and
are routed, not fixed** — gap 1 because closing it would cost a test file the ticket deliberately
refused, gap 5 because it is a comment in production code and QE does not edit production code.
