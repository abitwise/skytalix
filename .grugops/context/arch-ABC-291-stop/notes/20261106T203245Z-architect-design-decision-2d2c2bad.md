---
id: 20261106T203245Z-architect-design-decision-2d2c2bad
kind: decision
by: architect-design
at: 2026-11-06T20:32:45Z
verified_by: 
confidence: high on the rulings; K1 (h) is a reading of a bar's words, open to the Orchestrator and the owner
refs:
  - ABC-291
  - ABC-282
  - ABC-303
  - ADR-0075
  - ADR-0071
  - ADR-0072
  - ADR-0056
  - EPIC-011
  - se-ABC-291/20261106T201944Z-software-engineer-failed-attempt-a8daf408
  - se-ABC-291/20261106T201944Z-software-engineer-decision-d68ef14e
  - se-ABC-291/20261106T201944Z-software-engineer-observation-cb124720
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
supersedes: 
seal: sha256:2b722fffc354342188548091d003922c4589d762c1ebf72d595b12154f8ee009
---

# arch-ABC-291-stop ruling: A0-3 re-pins in U2's form; K1 (h)'s letter cannot be met beside d4, so it takes form (a) with one real read added; both SE calls confirmed; D6's line written

Architect/Design, records only, on `grugops/arch-ABC-291-stop` from `main` `48993089`. Read `grugops/ABC-291` at `63af973e`, read only. Nothing run. Text of record `b4c90040`. The tip stays do-not-merge until the list in § 5 lands.

No value, rule, definition, ratio, intent or level moved. **One bar's words do not hold as written: K1 (h), for one export.** § 2 says why I did not stop on it.

## 1. `ABC-282` A0-3: a dated re-pin, U2's form. No row retires
- **Why pins.** `ADR-0071` D8: "The rows bind; the numbers are the base's." `ADR-0075` d4: "A pinned value that moves is re-pinned". `…42c82347`'s never-list does not reach A0, because its "identity" is `ADR-0067` d5's tracer gate (`…681c6363` 1). `…69ee96e7` ruling 2 sends a deep re-pin here first, and this is that hop.
- **Not retired:** A0-3's sentence is still true.
- **Another form, not taken.** `src/uci-session.test.ts` spies on `chooseMove`, so a rig could route the session to `chooseMoveWithoutPawnShape` with every literal unchanged. That row would read a door, not what ships. `…0f8a4f82` calls A0-3 the session's lines "end to end", `ADR-0072` d7's dated line keeps it on the session, and under a leak the rig would hand a door `softMs` (D12 item 6).
- **The figures allowed, each literal exact:**

| constant | rows | old | new |
|---|---|---|---|
| `D8` | four | `info depth 8 score cp 45 nodes 196681 time 201 nps 978512 pv c3d5` | `info depth 8 score cp 74 nodes 196681 time 201 nps 978512 pv c3d5` |
| `D7` | one | `info depth 7 score cp 43 nodes 69705 time 76 nps 917171 pv c3d5` | `info depth 7 score cp 88 nodes 69705 time 76 nps 917171 pv c3d5` |
| `D6` | one, `go depth 6` | `info depth 6 score cp 87 nodes 10513 time 17 nps 618412 pv c3d5` | `info depth 6 score cp 99 nodes 10614 time 17 nps 624353 pv c3d5` |

- **F1 does not fire.** The evaluation moved the figures, and W1 did not act.

## 2. K1 (h) against d4: form (a), stated as not met to the letter, with a real read added
- **The conflict is real and no tree escapes it.** d4 says `evaluateAtPhaseWithoutPawnShape` is "the evaluation those doors call", in `ADR-0064` d7's form, where the switch picks at the recursions' three call sites. `evaluateWithoutTaper` stands there on `main`. Form (b) would meet K1 (h) and break d4's sentence. So no build meets both.
- **The ruling.** For this export, K1 (h) reads: its only callers outside test files are the three off branches, and no shipped search takes one. `pawnShapeForTest` keeps the letter.
- **Why I did not stop.** The brief says to stop if an item would move a bar, and d7 says none is loosened after Ready. A bar moves when an exact build that would have read red now reads green. No exact build could ever read this letter green, so the reading frees no build. What the row guards is that the off evaluation stays off the shipped path, and the added row reads that more closely than the letter did. This is the owner's rule for such a clause: say it openly and add a real read. **It is still a reading of a bar's words in an ADR he accepted.** The Orchestrator should tell him, and if either reads it as a loosening it comes back here.
- **Form (b), refused.** It drops d4's sentence, changes `evaluateAtPhase`'s signature on the hot path, and moves K2's group 6. It would also put a new form under K4, which has one read left. Since (b) is not taken, **K0 (c), K3 and K2 are not read again.**

## 3. The two SE calls
- **`ABC-303`'s depth-8 count rows: confirmed.** d4's first clause does not name them, and its "a pinned value that moves" would send them to a re-pin. The row's title calls the figures the bundle's and "information, not a bar". A re-pin would make that false. All four figures equal K0 (a)'s read (`raw/out/K0a.out`). `ABC-304`'s scope 1 is a true precedent, and `ADR-0072` d7 has the same form. The reach is narrow: only a row whose figures belong to a named earlier tree.
- **`QUIET_RULES`' `pawnShape: true`: confirmed.** K7 cannot read green without it. The record follows the evaluation, as its `taper: true` does. `ADR-0069` d6 and `ADR-0074` d6 keep pruning switches out so that no data set moves, and this switch changes what `evaluate` reads, so the merge moves the filter either way. Comparing the stand pat with the off evaluation would keep the old set, but it would name that export in `tools/`, against K1 (h), and leave the filter out of step with what ships. Not taken. d4's "only" speaks of the shipped recursions.

## 4. `ADR-0056` D6
The "reads queue" line is dated: the wait it names is met, the rule stands for the terms, and `ABC-289` is not closed.

## 5. The engineer's list, test-only, on `grugops/ABC-291`
Each edit carries one dated comment citing this note. The PR lists each row.
1. **`src/uci-session.test.ts`:** the three constants, § 1. The doc comment gains a dated `ABC-291` line and keeps `…aadd2d48` and `…0f8a4f82`. Its "`cp` moves on five" sentence still holds.
2. **`src/evaluate.pawns.test.ts`, the K1 (h) row's comment:** "NOT K1 (h)'s letter … Which reading holds is the Architect's" becomes a pointer to `ADR-0075` K1 (h)'s dated line. The row's assertions stay.
3. **`src/evaluate.pawns.test.ts`, one new row beside it, default lane, source only, no search:** `pawnShape: true` stands exactly twice in `src/search.ts` and twice in `src/engine.ts`, in `RULES_PAWN_SHAPE` and inside `search()`'s or `chooseMove`'s own body. It stands in no other non-test file under `src/`. Under `tools/`, only `QUIET_RULES` and `QUIET_RULES_NAME` carry it. At `63af973e` that reads search 176, 1226; engine 396, 888; `tools/tune/tune.ts` 118, 121.
4. **`src/engine.test.ts` A0-1, not in the STOP:** delete `expect(read(allOn, fenOf(name), { ...frozen, softMs: 1 })).toEqual(expected(on));`. It hands a door `softMs`, against `ADR-0071` D12 item 6 and D8's dated lines, and the comment above it says the door takes none. This is the standing text, not a new ruling. The relation on `chooseMove` below it stays.
5. **`src/engine.test.ts` A0-1 and A0-2, wording only:** `allOn` and the titles' "all on" now name the off door, which is not all on. Rename to the bundle's tree. No figure moves.

**Then:** typecheck, lint, `npm test`, `ENGINE_DEEP` `src/uci-session.test.ts` (270 / 270) and `ENGINE_DEEP` `src/engine.test.ts`, each by count, one at a time under the host lock. No production line moves, so K0, K3, K7 and the other deep lanes stand. `src/`'s tree id will change with these test files, so QE compares the five production files.

**STOP, nothing adjusted, if:** any literal in § 1 reads otherwise; D3's row goes red; the new row finds any other `pawnShape: true`; or a production line would have to move.

## 6. What this ruling depends on
`qe-ABC-291-k1` reads drift and K1's fixtures in parallel, and I did not wait. If it finds a defect whose fix moves a production line, § 1's lines are void. They come back here, and K0 (c) and K3 are read again.

## 7. Owed, none of it mine
- **BA/PM:** `ABC-291` K1 (h) and K2 pointers to these lines, the deep pins in test note or K list, the head banner; `ABC-282` A0-3 if its page carries the old figures.
- **Orchestrator:** the repair brief with § 5; telling the owner K1 (h)'s reading (§ 2).
