---
id: 20261010T164425Z-qe-e2e-observation-abc010-gap-register-2c22980f
kind: observation
by: qe-e2e
at: 2026-10-10T16:44:25Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ABC-017
  - ABC-033
  - ADR-0033
  - QE-010-a
  - QE-010-b
  - QE-010-c
  - QE-010-d
  - src/fen.ts
  - src/fen.test.ts
  - src/move-input.ts
  - src/move-input.test.ts
  - src/history-pane.ts
  - 20261010T164425Z-qe-e2e-decision-abc010-verdict-pass-with-gaps-40ccc992
supersedes:
---

# `ABC-010` QE gap register: one MEDIUM closed by QE, three LOW routed, four INFO

Hand-authored and unsealed. Readings are in `…d22743e3` and `../probe/`. No gap blocks a criterion.

## `QE-010-a` — MEDIUM — CLOSED by QE (test-only, `src/fen.test.ts`)

**What survived.** Six mutants of shipped production rules left the whole suite green (red 0) at `2344c015`:
- drop right `Q` (M08);
- drop right `k` (M09);
- a castling rook of either colour (M11);
- a castling king of either colour (M12);
- an ep pushed pawn of either colour (M16);
- ep rules applied only when white is to move (M18).

The SE's table tested `K` (king and rook) and `q` (rook) only. Its colour cases all differ in kind as well as colour.
It has no en-passant row with black to move.

**Why MEDIUM.** The ticket's last criterion is "each rejection names the specific fault (which right, which square)".
Half the rights and the whole black-to-move en-passant branch could be deleted with no test going red.

**Closed by** one new `describe` holding 16 rejection rows and 6 accept controls, each naming its mutant. The six are
now red 3/3/1/1/1/4. The 16 are red on base `be37e222`. The 6 controls are green on both. +0 files, +22 `it` rows.

## `QE-010-b` — LOW — routed to the Orchestrator (a docs-only follow-up; one site is outside this fence)

**The stale number.** `SIX_QUEENS_FEN`'s re-authoring raised the derives per `Qxd4` prompt from **6 to 7**
(QE-measured, `../probe/six-queens-derives.out.txt`): the sixth candidate now mates, so `toSan` derives once more for
its suffix. Two comments still carry the old number:
- `src/move-input.test.ts:493`: "six queens on `d4` measured six" (in the fence);
- `src/move-input.ts:48`: "six queens on `d4` cost six of those, measured by QE" (**production, outside the fence**).

**Why it is LOW.** Nothing asserts either number, and `A5`'s one-derive-per-prompt still holds. The PR note's "no
asserted value changed" is true. **Options:**
- one comment-only follow-up for both sites (zero production lines of logic, but `move-input.ts` is a production file);
- or the SE amends the test comment on this branch and the production comment is ticketed.

QE did not edit either: one site is production, and fixing half would leave the two disagreeing.

## `QE-010-c` — LOW — routed to BA/PM (cross-ticket expectation)

**The pointer.** `src/history-pane.ts:53`–`:56` (`ABC-017`'s accepted limitation) says: "a loaded FEN whose
`fullmoveNumber` exceeds 9,999 renders a row wider than `HISTORY_COLS` … `parseFen` imposes no upper bound and
`ABC-010` is the ticket that would."

**The fact.** `ABC-010`'s scope has no upper bound, only the round trip. QE measured (`../probe/fullmove-bound.out.txt`)
that `parseFen` accepts fullmove `10000`, `999999` and `100000000000000000000` (1e20). It rejects a value only when
the value does not print back exactly: `9007199254740993`, twenty 9s, and `1e+21`. So the wide row the comment
describes stays reachable through `parseFen`, and the comment now names a ticket that does not deliver the bound.

**Not a defect of this build** (it is out of `ABC-010`'s scope as written). **Options (BA/PM):** cut a ticket for a
move-number bound (or the epic that first accepts a FEN does), or have the comment's owner re-point it. It is LOW
while no FEN input exists (the `P1` trigger in the ticket).

## `QE-010-d` — LOW — routed to Architect/Design (owner of `ADR-0033`)

**The blind spots.** The guard does exactly what `ADR-0033` decision 2 says ("every `src/*.ts` except `*.test.ts` and
`fen.ts`"). QE planted three shapes out of tree, and each stayed green:
- a production file in a subdirectory (`src/qeplant/x.ts`);
- a non-`.ts` source (`src/qeplant.mts`);
- a computed member (`ns["parseFen" + "GrammarOnly"]`).

None exists today: `src/` has no subdirectory with `.ts` and no `.mts`/`.js`. **Options:** accept as residuals (the
first two would show in a diff, the third is adversarial), or widen the guard's walk if a subdirectory is ever added.

## INFO (recorded, not gaps)

- **`QE-010-e`** — the SE's observation `…386fd214` and `RUN.txt` cite `deep-lanes.log`, which is not committed under
  `ticket-to-pr-ABC-010/probe/`. QE re-ran all five lanes itself (`../probe/deep-lanes.log`), so no claim rests on the
  missing file.
- **`QE-010-f`** — the clock rule accepts any integer whose `String(Number(f)) === f`. That includes halfmove `1e20`
  and values above `Number.MAX_SAFE_INTEGER` that happen to print exactly. This is within the scope's wording, and the
  round trip holds. Plausibility (halfmove against fullmove, fifty-move) is retrograde and declined.
- **`QE-010-g`** — the new clock message truncates the field at 24 characters. The pre-existing grammar messages
  (side, castling, ep) still echo an unbounded field. That predates this ticket and is outside its scope.
- **`QE-010-h`** — the `san.parse` `A4` rename is accurate and within 9(c) (see `…d22743e3`).
