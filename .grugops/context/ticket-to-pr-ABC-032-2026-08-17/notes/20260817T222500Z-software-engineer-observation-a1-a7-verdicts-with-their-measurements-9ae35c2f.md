---
id: 20260817T222500Z-software-engineer-observation-a1-a7-verdicts-with-their-measurements-9ae35c2f
kind: observation
by: software-engineer
at: 2026-08-17T22:25:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A7
  - src/san.ts
  - src/san.parse.test.ts
supersedes:
---

# `A1`–`A7`, each with the number or verdict the criterion asks for

Every figure below was READ FROM A RUN on `grugops/abc032-parse-san` @ `c98b1e2`. Nothing here is
inferred from the code.

| # | verdict | the measurement it is scored on |
|---|---|---|
| `A1` | **MET** | `178` moves across the six perft positions, `178` returning `outcome: "move"` with `parsed.move === move` **by reference**, **0** exceptions. `178` = `20+48+14+6+44+46`, the perft table's own depth-1 counts, and each position asserts its own count before the loop. `toBe`, never `toEqual`. |
| `A2` | **MET** | All eight strings resolve into exactly one arm, no call throws: `Nf3` rejected, `Ng5` move, `O-O` move, `0-0` move, `Bxf7+` move, `Bxf7` move, `Qh5#` rejected, `Nbd2` rejected. Every `move` arm is `legal.includes(parsed.move) === true` (reference containment). `O-O`/`0-0` return the SAME move object; `Bxf7+`/`Bxf7` return the SAME move object. |
| `A3` | **MET** | File axis (`4k3/8/8/8/8/5N2/8/1N2K3 w - - 0 1`): `toSan` emits `Nbd2` / `Nfd2`; each resolves to its own knight by reference; bare `Nd2` → `ambiguous` with **exactly 2** candidates, both reference-elements of `legal`. Rank axis (`4k3/8/8/8/8/1N6/8/1N2K3 w - - 0 1`): `N1d2` / `N3d2`, same result, **exactly 2**. The expected strings come from `toSan`, not from the parser. |
| `A4` | **MET on the corrected FEN; the ticket's printed FEN is defective and is PINNED** | On `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1`: `e8=Q` → `move`, reference-identical to the queen promotion; bare `e8` → `ambiguous` with **exactly 4** candidates, all reference-elements of `legal`. On the FEN as printed (`…/4k3/4K3`) the kings are adjacent and `["Kxe2"]` is the whole legal move list — asserted as a row so the defect is measurable. Suffix tolerance: `Re1+` / `Re1` / `Re1#` all return the SAME move object by reference. |
| `A5` | **MET** | `null`, `undefined`, `42`, `{}`, `[]`, `""`, a 10,000-character string and `Zx9` each return `outcome: "rejected"` and `expect(...).not.toThrow()` passes for every one. The two codes do not collapse and are independently reachable: `Zx9` → `unreadable`, `Qh5#` in a queenless position → `no-such-move`. Also covered: `legal` omitted entirely (the list is generated internally) does not throw. |
| `A6` | **MET** | `git diff -U0 -- src/san.ts` is **one hunk, `@@ -148,0 +149,132 @@`** — a pure append, **zero** lines deleted or modified, so `toSan`'s body is byte-unchanged. `git diff --name-only -- src/san.nfr.test.ts src/san.qualifier.hardening.test.ts src/san.suffix.hardening.test.ts` is **empty**. `src/san.nfr.test.ts` runs **5 tests, 5 passed**. Full suite **957/957, 33 files**, skip count **0**. `PERFT_DEEP=1 npx vitest run src/perft.test.ts` → **32 passed (32)**, exact. |
| `A7` | **MET, asserted structurally** | `src/san.ts` read as text: each of `"N"`, `"B"`, `"R"`, `"Q"`, `"K"` occurs **exactly 1** time as a string literal; `"O-O"` **exactly 1**; `"O-O-O"` **exactly 1**. Both directions read the one table — the render half contains `PIECE_LETTERS[`, the parse half contains `PIECE_LETTERS[`, `PIECE_LETTERS[move.promotion]` occurs **exactly 2** times (once each side), and the letter class is `Object.values(PIECE_LETTERS).join("")`. The parse side declares no table of its own. |

## What `A6` reports that the criterion does not ask about, and a reviewer must still see

`src/san.test.ts` changed: `A20`'s expected module surface, plus four comment lines. It is NOT one
of the three files `A6` fences and it is not one of `toSan`'s 52 rows, but it IS a merged test file
this diff modified. The reasoning is its own `decision` note in this folder
(`…-two-existing-lines-this-ticket-could-not-leave-alone-…`).

## Coverage the criteria do not name

`A1`'s corpus includes kiwipete, so castling, en passant and promotion all pass through the
round-trip rather than only through the hand-written rows.
