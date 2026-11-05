---
id: 20261105T004230Z-architect-design-decision-2b3440cf
kind: decision
by: architect-design
at: 2026-11-05T00:42:30Z
verified_by: 
confidence: high on the records' reach, the source read and the merge-tree list; medium on the EPIC-011 consequences, which are judgement and wait on the owner's answer; lane cost and the state of TUNE_DEEP on main are UNKNOWN - verify
refs:
  - arch-ABC-301-miss
  - ABC-301
  - ABC-280
  - ABC-303
  - ABC-289
  - ABC-287
  - ABC-290
  - ABC-291
  - ABC-292
  - ABC-293
  - ABC-295
  - ABC-299
  - EPIC-011
  - ADR-0056
  - ADR-0067
  - ADR-0070
  - ADR-0074
  - QE-301-g
  - QE-301-h
  - QE-301-i
  - QE-271-g
  - QE-271-h
  - b297ab89
  - e763119c
  - dd88560f
  - arch-ABC-301-miss/20261105T004221Z-architect-design-decision-e5a5ac0c
  - qe-ABC-301-miss/20261105T003042Z-qe-e2e-observation-066fadea
supersedes: 
seal: sha256:0ec759f704c391034d658d7a6aaa1b17c951f115d137dfcbd3beadb70b86b719
---

# arch-ABC-301-miss items 3 and 4: the tool commits land on **wait** or **third** and not on **stop**, as a merge of `b297ab89` under a tools-only ticket, after the lane read. For `EPIC-011`, the miss clears `ABC-303`'s slot and changes the form of E3b to E6, not their order

Architect/Design, task `arch-ABC-301-miss`, records only, from `main` `701ef5bd`. No test, build or engine was run. One read-only `git merge-tree` was run for the conflict list. The options named are those of `…e5a5ac0c`.

## Item 3: the tool commits
**May they land: yes. The records do not bar it.** This settles QE's open point 1 (`…066fadea`). `ADR-0067` F6 and `ADR-0070` F5 speak of the tuned set. `ABC-301`'s "Any NOT MET → not merged" sits in a ticket whose candidate is the emission. `ABC-280` is the precedent: after the first pull's NOT MET, the tool landed alone on its own ticket, with no `src/` production line.

**Should they: it follows his answer.**
- **On wait or third: yes.** `main`'s `tools/tune` knows nothing of E4a. It has no `PASSED_KING_ENEMY`, `PASSED_KING_OWN`, `PASSED_FREE` or `PASSED_UNSTOPPABLE`, and writes "thirteen value exports" (read in the source). So by reading it cannot emit `main`'s own table. Whether `TUNE_DEEP` is red on `main` because of that is `UNKNOWN - verify`. The fix exists, QE read it as sound, and it would otherwise rot against a moving `main`. It also closes `QE-271-h` (MEDIUM, a live gap) and `QE-271-g`.
- **On stop: no.** 845 lines for a tool nobody will run, and one more row in a tight lane. `grugops/ABC-301` stays as a ref. `QE-271-h` then matters only while E4a's terms stay, and at value 0 a fault there cannot reach play.
- **Hold until his answer.** Nothing is waiting on it. Landing changes no production line and no value, so it stales no C2′ and can go at any time.

**`QE-301-h` is a condition, not a reason to refuse.** Take the N8-LANE read (H − B median wall, ≤ +0.10 s) before the landing. The tip adds one default-lane row, 2 684 → 2 685. s0's in-thread figure is about + 2.5 ms, but the graded read is `UNKNOWN - verify`. Over budget, the row goes deep, as `ABC-301`'s page says.

**The shape, for the Orchestrator** (`QE-301-g` stands):
- A merge of `b297ab89`, never of either tip, on a tools-only ticket from BA/PM. Its zero production lines waive UAT, as `ABC-280`'s did.
- **The conflict list has moved since QE's rehearsal.** At `701ef5bd`, `git merge-tree` names `src/evaluate.passer.test.ts` (content) and one queue rename, `se-ABC-301-fit-2.md`. `plans/traceability.md` now merges clean, because the records reached `main` by path. QE's rehearsal was at `48d78985`, so its 2 685 and 29 of 29 want one fresh read.
- Run the deep lane of any arriving test file (`…681c6363` 3). `src/evaluate.passer.test.ts` has one; `src/evaluate.king-mobility.test.ts` has none, by a grep for the flag.
- Check after the merge that `dd88560f` is not an ancestor of `main`.

**Cost:** one hop of the engineer, the gates, the lane read and a QE read. Under an hour of host by estimate, `UNKNOWN - verify`.

## Item 4: the rest of `EPIC-011`

| item | what the miss changes | what it does not |
|---|---|---|
| **`ABC-303`** | The slot's `ABC-301` half is met: "recorded as failed". C2′ waits on `ABC-282` alone (and through it on A4, the owner's). § Open 4's moved-base worry falls away for this half: no fitted evaluation arrives, so R1, R2, P3, P4 and the +0.116 stay near what he was shown. K0 stands on `main`, re-pointed; nothing retires under the branch | Its bars, its order, and "a new C2′ after a candidate fault", which stays his |
| **`ABC-289`** | Its base stays the rule-made table, so `ADR-0074`'s figures keep their footing, and the page's "a fit that trips F1 is read then" does not arise | Still after `ABC-303`, alone, on its own read |
| **E4b (`ABC-291`), E5 (`ABC-292`), and E3b, E6 (`ABC-290`, `ABC-293`)** | Each page's trigger, "merges or closes", has fired, so the hold lifts and each ADR is owed. But "weights from a pull after the second" has no pull behind it. **Form (a), structure at 0, stops making sense:** it buys nothing until a pull exists, and it pays cost now, as E4a does. So on **wait** each owed ADR takes form (b), hand values on its own C2′, or a bundle read (`…a5d74f70` names `ABC-290` + `ABC-293`). E5's shared mobility weight stays at its rule value | Their order among themselves; the rule that each is read on play |
| **`ABC-287` (P6)** | Its trigger is "merges", not "or closes", so it has not fired and may never. The hold stands. The page needs a line: the trigger is a tuned table on `main`. On **stop** it is dropped or re-based | Its rejection on today's evaluation |
| **`ABC-272` (E7a)** | One collision gone on `src/evaluate.ts` and `src/evaluate-params.ts` | Order free, as before |
| **R2 (`ABC-295`)** | The second pull no longer holds Phase 4 open. Phase 4 now closes when `ABC-272` and `ABC-290`–`ABC-294` settle. R2 will read a rule-made evaluation, so its "the second pull is a tuned set" sentence goes, and it reads less of a jump than Phase 4 was planned for. Expect no E2 term in the reading | 200 games at 100 ms, the band rule, R1's shape, the base of R1 (1 806.5 ± 47.4) |
| **R3 (`ABC-299`)** | Nothing in its form. Its starting point is lower than planned by whatever E2 would have added, which is unknown | After Phase 5 |
| **`ADR-0056` A1** | "After Phase 4 (the tuned evaluation …)" loses its stated reason on **wait** or **stop**. Whether the pair is still worth its host time then is a question for that hop | Nothing now |
| **`G1`, 3 000** | `ADR-0056`'s central landing (2 550–2 800, 3 000 at the optimistic edge) assumed E2 and terms fitted by it. It stands lower now, by an amount nobody has read. The owner should hear that with his answer | The targets stay *[proposed]* and his |

**Owed lines, after his answer, not edited here:** BA/PM: the `ABC-301` page's close, `EPIC-011` row E2 and § Dependencies, `ABC-287`'s trigger, `ABC-290`–`ABC-293`'s titles and forms, `ABC-295`'s Problem, `ABC-303` § Open 4. Architect: `ADR-0056` row E2, D6 Phase 4 and A1, and `ADR-0067`'s line for his ruling. The `ABC-301` lane budget (≤ +0.10 s) passes to the landing, and `…5ec6c124`'s row census no longer has a "second of `ABC-282` / `ABC-301`" to gate; whether it still gates the landing is the Orchestrator's.
