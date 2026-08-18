---
id: 20260818T193000Z-qe-e2e-decision-abc033-verdict-pass-with-findings-3b7c41d9
kind: decision
by: qe-e2e
at: 2026-08-18T19:30:00Z
verified_by:
confidence: high
refs:
  - ABC-033
  - EPIC-003
  - EPIC-002
  - src/move-input.ts
  - src/move-input.test.ts
supersedes:
---

# QE verdict on `ABC-033`: **PASS WITH FINDINGS** — `A4` is BROKEN as written, and three guards do not bite

This is a `decision`, hand-authored. **No `finding` is admissible on this install**
(`AGENTS.md` § "Role / workflow files", `context.human_admission` is `off`), so this verdict carries
no `§14-gate#<id>` stamp. It is QE's recorded verdict under the owner's 2026-08-17 standing directive
(`AGENTS.md` § "QE validation authority"), and nothing here is a human acceptance.

## Verdict

**PASS WITH FINDINGS.** The blocking gate is green and I re-ran every step myself. The delivered
behaviour is correct on all seven criteria *as exercised*, and the engineer's central architectural
claim — the fold is a retry and a union, never a pick — holds under mutation. But **`A4` as written
is not met**: I produced a reachable `ambiguous` outcome whose candidate list does NOT fit the 2-row
message region, which the engineer searched for and did not find. That is the outcome the ticket
itself routes to `EPIC-002`'s frame owner and a new ticket.

I do **not** recommend blocking the merge on `G1`. The ticket's own `A4` prose pre-authorises exactly
this disposition — *"If any reachable ambiguity cannot fit, that is a finding for `EPIC-002`'s frame
owner and a new ticket — not a silent truncation and not a widening of the frame"*. The delivered
module is the correct side of that line: it truncates nothing and widens nothing. **What must not
happen is `A4` being recorded as "met".** It is not met, and the ticket page and
`plans/traceability.md` should say so.

## The gaps, by severity

| id | severity | gap | disposition |
|---|---|---|---|
| `G1` | **HIGH** | **`A4` is falsified.** 7+ knight candidates overflow the message region; the frame appends `(+2 more)` and the hidden count is **2**, not 0. `A4` demands 0 for *any* ambiguity this ticket can produce. | New ticket, `EPIC-002` frame owner. Do NOT mark `A4` met. |
| `G2` | **MEDIUM** | **SAN promotion is the one family case-folding cannot reach — in BOTH directions.** `E8=Q` (caps lock) and `e8=q` are both `rejected`/`unreadable` while `e8=Q` is a `move`. The engineer reported only `e8=q`. | Defect, narrow. New ticket or `ABC-032`. See the separate observation. |
| `G3` | **MEDIUM** | **`A5`'s guard is structurally blind.** The spy watches `deps.legalMoves` only; `toSan` imports `legalMoves` directly from `./legal.ts`, outside `MoveInputDeps`. Mutant M11 doubles-to-triples the real derive count on the prompt position and **0 tests red**. | Test gap. Back to the engineer. |
| `G4` | **MEDIUM** | **The reason-code precedence is asserted in ONE direction only.** Mutant M6 (`no-such-move` for every rejection, including `""` and `"hello"`) passes **all 40 tests**. `unreadable` is never pinned to any input — `A6`'s loop uses a permissive `stringMatching(/^(unreadable\|no-such-move)$/)`. | Test gap. Back to the engineer. |
| `G5` | **LOW** | **The "fixed and asserted" order of attempt is NOT asserted.** Mutant M12 swaps coordinate and SAN and **0 tests red**. `attemptsOn` calls both resolvers eagerly, so the "order" is a preference over two already-computed results, not an order of attempt. | Test gap / ticket-prose accuracy. Back to the engineer. |
| `G6` | **LOW** | **The whole fold-ambiguity path rests on one fixture.** M3 and M5 — two different builds that guess between two legal moves — each red exactly **2 of 40** tests, both driven by `BOTH_CAPTURES_FEN` + `"BXC4"`. "Never guess is structural" is true but thinly guarded. | Observation. Back to the engineer. |
| `G7` | **INFO** | The engineer did not run the `SEARCH_DEEP=1` lane, reasoning the branch touches no `src/search.ts`. `AGENTS.md` names **the QE hop itself** as a trigger for that lane, independently of what changed. **I ran it: 41/41 passed, 23.75 s.** Discharged here. | Closed by this hop. |

`G1` is the only one that contradicts a criterion. `G2` contradicts an epic scope line, not a
criterion. `G3`–`G6` are guards that do not guard; none of them means the delivered code is wrong
today, and all of them mean a future regression would ship green.

## What I confirmed rather than broke

- **`A7` re-measured from git, not quoted**: `git diff --numstat a83b933~1 a83b933` =
  `src/move-input.test.ts 374/0`, `src/move-input.ts 182/0`. Nothing else. Confirmed.
- **`A2`'s two-halves design works.** Mutant M9 — list the candidates, then `playMove` the first —
  reds **exactly one** test, and it is the second `it` block, the one the ticket's test note 1 exists
  for. The content assertion alone stayed green, exactly as predicted. This is the best-designed
  guard on the page.
- **`A1`'s reference identity bites.** Mutant M8 (`{ ...attempt.move }`, a structural clone that
  passes `toEqual`) reds 3 tests. Confirmed.
- **`A5`'s count bites for the failure mode it was written for.** Mutant M4 (a second
  `deps.legalMoves`) reds 12 tests. The guard is real — its blind spot (`G3`) is elsewhere.
- **The no-third-trim fence bites.** Mutant M13 reds the fence test. Confirmed.
- **Case folding works everywhere except promotion.** `E4`, `E2E4`, `E2-E4`, `NF3`, `nf3`, `O-0`,
  `o-o`, `0-0-0`, `E7E8Q`, `E7-E8Q` all resolve to `move`. Only the SAN `=` promotion family fails.

## Fences I held

I did not fix anything, did not weaken any guard, did not merge, did not deploy, and moved no board
column. Every mutation was applied to a scratch copy path with an `EXIT` trap that restored
`src/move-input.ts` (and, for the derive count, `src/legal.ts`), and both restores were verified by
`diff -q` at the end of each battery. **The delivered tree is byte-identical to `64b596c`** apart
from this hop's queue and context files.

**I deliberately did NOT commit a red regression test for `G1`.** A knowingly-failing test on a
branch that must gate green is not a report, it is a broken gate. The exact reproduction is in the
`G1` observation, ready to paste into the fix ticket.
