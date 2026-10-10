---
id: 20261010T164425Z-qe-e2e-decision-abc010-verdict-pass-with-gaps-40ccc992
kind: decision
by: qe-e2e
at: 2026-10-10T16:44:25Z
verified_by:
confidence: high
refs:
  - ABC-010
  - ADR-0033
  - ADR-0005
  - NFR-001
  - NFR-002
  - N8-LANE
  - QE-010-a
  - QE-010-b
  - QE-010-c
  - QE-010-d
  - src/fen.ts
  - src/fen.test.ts
  - 20261010T164425Z-qe-e2e-observation-abc010-readings-criteria-mutants-deep-lanes-nfr-d22743e3
  - 20261010T164425Z-qe-e2e-observation-abc010-gap-register-2c22980f
  - 20261010T164425Z-qe-e2e-artifact-ref-abc010-probe-and-test-rows-57554fd2
  - 20261010T161123Z-software-engineer-decision-abc010-two-entries-rule-order-fixtures-re-authored-5b986289
  - 20261010T161123Z-software-engineer-observation-abc010-gates-deep-lanes-9a-9f-nfr-cost-386fd214
supersedes:
---

# `ABC-010` QE: **PASS_WITH_GAPS**. Every acceptance row and 9(a)–(f) MET on QE's own harness. 6 of 30 mutants survived the suite; QE closed all six with 16 rejection rows + 6 accept controls. Three LOW gaps routed, none blocking

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).

- **Scope.** Subtask `qe-ABC-010`, Workflow 04 review exit. Branch `grugops/ABC-010-fen-semantic-validation`: reviewed
  tip `2344c015` (code `1304cc2c`, base `be37e222`). The authoritative scope and risks are the ticket's `## Scope` /
  `## Out of scope` and `ADR-0033`. Retrograde legality (piece counts, impossible checks of the side to move, clock
  plausibility) is declined there and is not counted as a gap.
- **Method.** QE wrote its own harness (`../probe/qe010-harness.mts`). It has its own FEN reader and its own attack
  test and imports nothing from `moves.ts`. Its five parts:
  - a 40-row reject / 25-row accept table;
  - 11 non-string inputs on both entries;
  - a 200 k differential fuzz against `ADR-0033`'s first-fault order, run with two seeds;
  - 300 random games (about 69 k positions reached by `makeMove`);
  - the production corpora.

  QE also used its own mutant runner (30 mutants of `src/fen.ts`, whole suite with the JSON reporter, plus the
  harness), its own `NFR-002` reader and its own deep-lane runner. The committed probe scripts ran with no refusal:
  9(d)'s `fen-scan.mjs` reproduced the SE's output byte for byte. The SE's notes were read as pointers only.
- **Verdict per criterion.** All MET; the evidence is in `…d22743e3`. Rows 1–8 (the four printed FENs, en passant,
  the clocks, the round trip, non-string), 9(a), 9(b), 9(c), 9(d), 9(e), 9(f), `PERFT_DEEP` 32/32, and the "messages
  teach" row.
- **What QE changed: test-only, on the ticket branch.** One new `describe` in `src/fen.test.ts`: 16 rejection rows and
  6 accept controls, each naming the mutant it kills, with 0 lines deleted. This closes `QE-010-a`: drop right `Q`,
  drop right `k`, a castling rook or king of either colour, an en-passant pushed pawn of either colour, and en-passant
  rules for white to move only. All six survived the whole suite at `2344c015` (red 0) and are now red 1–4 each. The
  16 rejection rows are red on base `be37e222`, and the 6 controls are green on both. No production line was touched,
  and no new file was added (`N8-LANE` 0).
- **Gaps.** All are in `…2c22980f`.
  - `QE-010-a`: MEDIUM, CLOSED by QE.
  - `QE-010-b`: LOW. A stale derive count, "six", in two comments now measures 7.
  - `QE-010-c`: LOW. `src/history-pane.ts:55` says `ABC-010` is the ticket that would bound the move number, and it
    does not.
  - `QE-010-d`: LOW. The guard's blind spots lie outside `ADR-0033`'s wording.
  - Plus INFO items.
- **Next.** The board move is the Orchestrator's. QE recommends `In Review` → `Ready for UAT`. There is no security
  trigger (the ticket rules it out), and `NFR-002` and `NFR-001` are MET on QE's readings. **UAT is owed, not
  waived:** `src/fen.ts` is a production file, so the owner's word is required at `In UAT`. Not merged, not pushed.
