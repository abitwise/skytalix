---
id: 20260818T000200Z-qe-e2e-observation-regression-risk-flake-risk-and-coverage-7ae40b93
kind: observation
by: qe-e2e
at: 2026-08-18T00:02:00Z
verified_by:
confidence: medium
refs:
  - ABC-032
  - ABC-033
  - ABC-034
  - ABC-035
  - N1
  - N8-LANE
  - NFR-008
supersedes:
---

# Regression risk, flake risk, and what I did and did not measure about coverage

## Regression risk: low, and the reason is structural

`src/san.ts` is a **pure append** — 132 added lines, zero deleted or modified — so no existing caller
of `toSan` can change behaviour unless module load itself changes, and the only load-time addition is
`Object.values(PIECE_LETTERS).join("")` plus two `RegExp` constructions. `src/san.nfr.test.ts` runs
**5 tests, 5 passed, unmodified**, so `N1`'s call-count guard is intact and the ticket's paragraph (a)
warning did not fire: nothing in this diff changed how or how often `toSan` generates.

The one behaviour that DID change outside the new function is the module's export surface, asserted
by `src/san.test.ts` `A20` and re-verified above. Every other consumer of `src/san.ts` (status panel,
history, frame) is green at 965/965.

## Flake risk: low, with one row worth naming

Nothing I added is time-, order- or environment-dependent; every row is deterministic over fixed
FENs, and the suite runs in ~2 s. **The two `A7` rows and my two additions read `src/san.ts` as
TEXT**, which is a deliberate structural assertion and not flake, but it does mean an unrelated
reformat of that file can turn them red — that is the assertion working, and the comments say which
mutant each row exists to kill so a future reader can tell a real regression from a rename.

`PERFT_DEEP=1` is ~40 s and opt-in; it is not in `npm test` and adds no per-commit flake surface.

## Coverage: NOT measured by this hop, and not claimed

`AGENTS.md` records that coverage is a measurement here, not a gate — it is absent from
`quality.mandatory_gates`, and which denominator decides `quality.coverage_threshold` (`0.8`) is an
open question parked in `.grugops/context/owner-grants-2026-08-15/notes/`. I did not run
`--coverage`, so I report **`UNKNOWN - verify`** rather than a number. What I can say is stronger for
this ticket than a percentage would be: every branch of `parseSan` was exercised by MUTATION, and
after my rows there is no mutation I could construct in it that the suite fails to catch, other than
the deliberately obfuscated second table recorded in the mutation note.

## `N8-LANE`: not re-measured, and the engineer's `claim` should be read as he wrote it

His table's identity null control is **+340 ms on a ~12 s lane (2.8%)** against an admissibility
clause of ≤ 1.5%, so his own +10 ms figure is not admissible evidence — he says so, and I agree
rather than "confirming" a bar nobody has cleared. **This hop adds no test file**, so it cannot move
the lane. Security/NFR owns the out-of-tree measurement at `P60`.

## What the next hops inherit from me

- `ABC-033` (case-folded retry, dispatch): the seam behaviours are now pinned — trim, mixed castle
  spellings, redundant qualifiers, and the two reject codes' reachability.
- `ABC-034` (reason vocabulary): TWO cases where a shape that is not readable SAN lands on
  `no-such-move` — the castle-without-castling case the engineer disclosed, and `e8=K`, which he did
  not. Same root cause; they should be worded together.
- `ABC-035` (`moves` listing) is unaffected by anything here.
