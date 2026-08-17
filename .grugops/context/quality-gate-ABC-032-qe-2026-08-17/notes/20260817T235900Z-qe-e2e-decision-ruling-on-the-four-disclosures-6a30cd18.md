---
id: 20260817T235900Z-qe-e2e-decision-ruling-on-the-four-disclosures-6a30cd18
kind: decision
by: qe-e2e
at: 2026-08-17T23:59:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - ABC-031
  - ABC-033
  - ABC-034
  - A4
  - A5
  - A6
  - A20
  - ADR-0004
  - src/san.test.ts
  - src/coordinate-move.ts
supersedes:
---

# The four things the engineer disclosed — three accepted, one accepted with a condition I imposed

Each was scrutinised against evidence I produced, not against his argument.

## 1. The `src/san.test.ts` `A20` change — **ACCEPTED**, and his argument verifies

His claim has two parts and both hold.

- **`src/san.test.ts` is not one of `A6`'s three fenced files.** `A6` names
  `src/san.nfr.test.ts`, `src/san.qualifier.hardening.test.ts` and `src/san.suffix.hardening.test.ts`
  by identity, and `git diff --name-only bf371d7 da69986` over those three is empty. `A20` is a
  module-surface row, not one of `toSan`'s 52 `(fen, move, expected)` triples, so the out-of-scope
  fence around "its 52 rows" is not crossed either.
- **The import-set assertion genuinely did not change — I checked the bytes, not the claim.** I read
  the pre-change row out of `bf371d7` and diffed it at `-U6`: the changed lines are the row title,
  the expected surface, and four comment lines. The `specifiers` extraction and the
  `["./apply.ts", "./legal.ts", "./moves.ts", "./position.ts"]` expectation are character-identical,
  and `src/san.ts`'s import block is inside the untouched first 148 lines, so what that assertion
  guards — the second direction dragging in no new dependency — is still asserted and still green.

The change was also unavoidable: adding the export this ticket exists to add necessarily turns
`toEqual(["toSan"])` red. The alternative — deleting the row — would have been the wrong move.

## 2. The defective `A4` FEN and the substitute — **ACCEPTED**, and the defect is CONFIRMED

Confirmed independently, not taken on his word. `8/4P3/8/8/8/8/4k3/4K3 w - - 0 1` puts the kings on
e1 and e2, adjacent; `isInCheck` is `true` for the side to move and the entire legal list is
`["Kxe2"]`. There is no promotion to select and no ambiguity to collect, so `A4` is **unreachable on
the FEN as printed**. The substitute `8/4P3/8/8/8/4k3/8/4K3 w - - 0 1` moves the black king e2→e3
and changes nothing else; it yields `Kf1, Kd1, e8=Q+, e8=R+, e8=B, e8=N`. **`A4`'s intent is
preserved in full** — four promotions, `e8=Q` by reference, bare `e8` ambiguous with exactly 4, no
other move reaching e8 — and the two checking promotions exercise the suffix tolerance rather than
weakening the row. Pinning the defect as a test row instead of silently correcting the ticket is the
right call and the same one `ABC-031` made.

**This is the SECOND ticket to trip on this exact string** (`ABC-031` `A2`, `src/coordinate-move.test.ts:17`
holds the identical constant with the identical comment). Two tickets have now paid to find and pin
one bad line. That is `G8`, and it is BA/PM's to fix at the source — a third ticket paying for it
would be a process failure, not a coincidence.

## 3. `text.trim()`, the undisclosed third tolerance — **ACCEPTED, on one condition I imposed and met**

I was entitled to refuse it and I do not, for a reason stronger than his: the seam is real and
already merged. `parseCoordinateMove` trims (`src/coordinate-move.ts`), `ABC-033` dispatches one line
of user input to both readers, and two readers disagreeing about a trailing space is a defect with a
user's name on it. It is also a narrow widening — interior whitespace is still refused (`N g5` →
`unreadable`), so it is `trim`, not "ignore spaces".

**The condition: it must be asserted.** As delivered it was not — removing `text.trim()` left the
entire suite green, so the one thing the tolerance exists for could be deleted by the next edit
without a single row turning red. A row now pins it, and pins the interior-whitespace refusal beside
it so the widening cannot creep. **Accepted as an engineering decision; the closed-list wording on
the page is still BA/PM's to reconcile**, and the same page now owes a ruling on two further
widenings the engineer did NOT disclose (`G5` redundant qualifiers, `G6` mixed castle spellings).

## 4. The `A7` design price, and the `A5` collapse claim — **ACCEPTED, and the collapse claim VERIFIED INDEPENDENTLY**

The price is real and reproduces: `parseSan(position, "O-O", legal)` in `4k3/8/8/8/8/8/8/K6R w - - 0 1`
returns `{ outcome: "rejected", reason: "unreadable" }`. It follows directly from the castle strings
being obtained from a castle candidate — no candidate, nothing to compare against.

**The collapse claim is the load-bearing half and I verified it without using his two strings.** I
reached `unreadable` from `Zx9`, `""`, `e8=P`, `e8Q`, `Ng5++`, `+Ng5`, `o-o` and `N g5`, and
`no-such-move` from `Bf7`, `Nxg5`, `Ne4g5`, a bare `d5` where only `exd5` is legal, and `Qh5#` in a
queenless position. Then I mutated `resolve` to return `unreadable` on the empty-candidate arm: the
suite goes red. **The two codes are independently reachable from many inputs, they never collapse,
and the guard against collapsing them can fail.** `ADR-0004` (2a)'s floor holds.

**One more instance of the same price, which he did NOT name** (`G7`): `e8=K` — promotion to a king,
not well-formed SAN — is coded `no-such-move`, because the promotion letter class is derived from the
one table and that table contains `K`. Same root cause, same arm, no criterion violated. `ABC-034`
writes the player-facing wording and inherits both cases; it should see them together.
