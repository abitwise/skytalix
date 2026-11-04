---
id: 20261104T233924Z-architect-design-decision-aab9f064
kind: decision
by: architect-design
at: 2026-11-04T23:39:24Z
verified_by: 
confidence: high on the cause and the form: the records state each step and the run confirms the red; the fix's green is expected, not read; the K0-is-not-the-identity-gate reading is flagged to the Orchestrator
refs:
  - ABC-303
  - ABC-271
  - ABC-283
  - ABC-301
  - ADR-0070
  - ADR-0067
  - QE-283-i
  - orch-2026-10-30a/20261104T164838Z-orchestrator-decision-2409cec9
  - orch-2026-10-30a/20261103T221607Z-orchestrator-decision-42c82347
  - se-ABC-283-merge/20261104T170008Z-software-engineer-observation-f7f63e1d
supersedes: 
seal: sha256:e74133e9c4b5ccbfcb98dc13a1a500022f37abfa927cd699ef652daf4e90c06a
---

# arch-ABC-303-open item 2, the ruling: K0 is a stale row, not an engine defect. The fix is a re-point to `…WithoutBundle`, figures and frozen file untouched. It came in through a seam between two merges and one brief's fence. ABC-301's fit is untouched; its PR table gains seven retired rows

Lines of record: `ADR-0070` d5 and `ADR-0067`, dated 2026-11-04 (`arch-ABC-303-open`). The reading is this task's observation `…261ea757`.

**In plain words.** `ABC-271` proved that its new evaluation terms, at value 0, changed nothing, by pinning seven node counts on the shipped engine. An hour later `ABC-283` changed the shipped engine on purpose, so those counts moved. The rows are still asking the shipped engine a question only the engine without `ABC-283` can answer. No play, no search and no evaluation is wrong. A test that nobody ran is out of date.

**How `main` came to carry them.**
1. `ABC-271` froze K0 on `chooseMove` / `search`, and merged at `872e5ffc`, 16:24Z.
2. `ABC-283`'s branch forked before that, so its build and QE's whole read (`ab0a37b6`) never held `src/evaluate.passer.test.ts`. Its re-point pass could not see the file.
3. QE saw `main` move and raised `QE-283-i` (`…7e0c6526`). Its "what" list named "the deep lanes".
4. Ruling `…2409cec9` 1 listed P0, the floor, zugzwang, `G1`, the gates and `npm test`. The deep lanes are not in that list. The brief `se-ABC-283-merge` added "K0 of ABC-271, which must still hold with the bundle off", and fenced: "Move no other expectation".
5. So the hop did exactly what it was told. It read K0 through its own driver, on the doors: 7 / 7 (`…f7f63e1d`). It ran the file without `SEARCH_DEEP` (`raw/scripts/lanes.sh`; `exits.txt`: "passer exit 0 … 21 passed"), where the seven rows are not defined. The row was never pointed at the door the read had used.
6. `58e90d07` merged. The rows have been red on `main` since, 17:01Z.

**How a deep red got past QE.** It did not pass through a QE read. QE's verdict was on a tree without the file, and QE flagged the gap. The re-read on the merged tree was the engineer's, on a list without that lane. The gates on `main` after a merge are the default lane, which does not define the rows. No later record names the lane: `qe-ABC-300`, `qe-ABC-302` and `qe-ABC-282` do not, and neither `AGENTS.md` nor the command log lists it. `se-ABC-303` was the first to run it. So the hole is structural: nothing obliges a merge re-read to run the deep lane of a test file that arrived from the other side. Same family as R3 (`ADR-0046`) and A3 (a) (`…84f9bae1`): a row that was not in the re-pointer's view stays where it was.

**Who owns the fix.** Not `ABC-303`: outside its scope, and if its read misses, the fix would never land. Not `ABC-301`: its scope bars any `src/` change beyond the table and the B-T4 rows. BA/PM attaches it to one small test-only ticket, as with R3; the Software Engineer builds it; QE's hop follows. Zero production lines, so UAT is waived. **Not an owner question.**

**The fix: a re-point, not a re-pin.** The rows' `chooseMove` becomes `chooseMoveWithoutBundle`, and `search` becomes `searchWithoutBundle`. The seven figures stay, `src/evaluate.passer-fixtures.json` is not edited, and no re-freeze is owed. `…f7f63e1d` already read all seven on those doors, so green is expected; the hop's own deep run is what shows it. The row keeps its identity claim, no bar moves, and an older door turns bundle 1 off, so `ABC-303` does not stale it. Rejected: re-pinning to `ABC-283`'s head (`ADR-0070` F1 says never, the claim would be lost, and it would go red again at `ABC-303`); retiring it now (its claim still stands today).

**The same hop carries two more rows `ABC-283` left behind,** each in its own line of this task: A3 (a) to `…WithoutBundle` (`…84f9bae1`), and the history term in `NFR-009`'s sum (the items note). All three are test-only. The hop runs the passer and see deep lanes, and the default lane.

**`ABC-301`.**
- **The fit: untouched.** It reads the tracer and the data set. No part of it reads a node count, and the red is in a deep test block. Nothing already run is affected.
- **Its reads: untouched as bars.** K0 is no row of B-T1–B-T8. Its branch carries the same red (`8701a422`), so QE should expect it and not count it as new.
- **One thing does touch it.** A tuned table moves counts on every door (B-T4's own reason), so the re-point does not survive a fit. On an emission that moves any value, K0's seven rows go red on every door. Ruled in `ADR-0067`: they **retire** at scope 4, by name, under `…0edae6fd` 2's test, the test "every part is 0" met. `ABC-301`'s page and PR table owe that line (BA/PM). Its test note 4 names only two rows.
- **The identity rule is kept, and this is the point to check.** "Identity rows are never re-pinned": K0 is not re-pinned at either step. B-T4's "identity gate" is decision 5's tracer gate, B-T1. **If the Orchestrator reads K0 as that gate, the retirement falls, and scope 4 meets a STOP.** That is his to say, before scope 4 if he can.
- **Order does not matter.** If `ABC-301` merges first, the K0 part of the hop falls away.

**`ABC-303`:** no row of tables 1 or 2 names K0, so the red does not gate the seal or the read.

**Owed outside this hop's fence** (Orchestrator or Scribe): a lane line for this file in `AGENTS.md` and the command log; and a rule for merge re-reads: run the deep lane of every test file the other side brought in. Neither is written here.
