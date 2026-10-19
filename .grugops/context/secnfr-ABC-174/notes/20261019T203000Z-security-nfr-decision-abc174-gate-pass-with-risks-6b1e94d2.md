---
id: 20261019T203000Z-security-nfr-decision-abc174-gate-pass-with-risks-6b1e94d2
kind: decision
by: security-nfr
task: secnfr-ABC-174
at: 2026-10-19T20:30:00Z
verified_by:
confidence: high
sealed: false
refs:
  - ABC-174
  - ADR-0045
  - ADR-0035
  - ADR-0008
  - NFR-004
  - NFR-005
  - NFR-008
  - NFR-010
  - N8-LANE
  - AR-NFR004-A
  - R-173-1
  - R-174-1
  - SEC-174-1
  - SEC-174-2
  - QE-174-a
  - QE-174-b
  - RISK-ABC144-FCAP
  - 20261019T202900Z-security-nfr-observation-abc174-nfr004-nfr005-from-data-catalog-lines-a4c7f025
  - 20261019T202000Z-qe-e2e-observation-abc174-n8-lane-met-nfr008-total-not-met-5d9a0f63
  - 20261019T202500Z-qe-e2e-decision-abc174-verdict-pass-with-gaps-e7b3c218
  - .grugops/context/design-ABC-144-fcap/notes/20261011T231917Z-architect-design-decision-abc144-fcap-floors-after-abc152-dd7a6ec9.md
supersedes:
---

# Security/NFR on `ABC-174` at `be6a5599`: **PASS_WITH_RISKS**. No required code fix. The `NFR-008` total is NOT MET (`R-174-1`). It is not this ticket's, and it goes to the owner

Hand-authored and unsealed: the sanctioned writer is absent. This is a `decision`, not a `finding`, because no
`§14-gate#` or `human:` stamp exists here. Nothing was timed: the rulings below need no new reading. Nothing was
committed, pushed or merged. I did not touch `src/`, `AGENTS.md`, `plans/board.md`, `plans/traceability.md`,
`../wt-ABC-174`, or any process I did not start.

## 1. `NFR-004` and `NFR-005` (detail in `…a4c7f025`)
- **Clause A holds under `AR-NFR004-A`, which is re-accepted with its number.** The default is `{ 3 000, 0 }`, the same
  call as before. `A5` reads max 3 007 ms at 3 000 ms, inside the ≤ 31 ms bound.
- **Clause B holds.** The highest budget falls from 4 500 to 3 000 ms, below 5 000. The clamp and `R1` are unedited.
- **`NFR-005`'s referent is unchanged** (`A2`, `A3` 30/30). **`NFR-010` is not affected.**
- **Security is not triggered.** No ASVS L1 requirement fails.

## 2. `QE-174-b`: the `NFR-008` total
**State: NOT MET.** I recomputed it from QE's raw `attempt2/nfr008-full.tsv`. The scored `H` walls are 9.85, 9.91,
9.97, 9.98, 10.04, 10.04, 10.05 and 10.28 s, so the median is **10.010 s**. The twin wall R is 0.280 s, and the twin
CPU median is +0.040 s with sign 4/8, so the run is admissible. load1 was 3.10–6.01, and CPU is reported at 27.73 s.
- Under `ADR-0035` D1 (R ≤ b, median > b) the state is NOT MET.
- Under the design record's stricter W reading (head median plus the window's twin R, 10.29 s) it is also NOT MET.
- **This is the first verdict on `NFR-008`'s R-1 clause.** The row reserved that verdict for "the next Security/NFR
  gate that reads the lane". The breach is 10 ms (0.1 %), inside the reading's own R. **The lane sits at the bar.**

**Attributable to `ABC-174`? No, by the instrument `ADR-0035` D2 assigns to per-ticket cost.**
- **The ticket's charge.** The narrow set holds every test file the ticket edits, plus `vitest related` over its
  four production files. It charges +0.115 s CPU (interval +0.020..+0.170) and +0.030 s wall (interval
  −0.050..+0.130, which includes 0). `N8-LANE` is MET.
- **The rest of the lane.** The other 52 files run byte-identical code at base and head.
- **What is not known.** The full-lane base arm (`bd480c99`) was not read. Whether the lane was already over 10 s
  before this ticket is **`UNKNOWN - verify`**.
- **No reading can say this ticket tipped the lane.** Its wall charge is smaller than the full-lane twin R.
- **What sets the lane's level.** The cap (`ABC-173`) and `ABC-171`'s +533 test lines. They were first read together
  on this tree.

**Blocking? No.**
- Severity is **MEDIUM**, QE's grade, which I keep. `security.block_on` is `high`.
- The cause is not in this change.

**It is also not mine to accept alone.**
- `ADR-0035` D6, as the owner accepted it: "A reading over W goes back to him."
- `ADR-0008` Ruling 5 and `R-173-1`'s table: "A wall over 10 s goes to the owner (Q4). The cap does not give way."
- So I name it **`R-174-1`**, with owner-designate **Olger Oeselg**. **His word is owed.** I recommend it before
  `ABC-174` merges. It can travel with his UAT word, which already waits on `ABC-175` (Q3).

> **RISK `R-174-1` (PROPOSED, OWNER'S WORD OWED): `NFR-008` total NOT MET on the capped stack.** `npm test` at
> `be6a5599` reads a 10.010 s median wall against 10 s (n 8, k 2, twin wall R 0.280 s, admissible, load1 ≤ 6.01). CPU
> is 27.73 s, reported. The risk is lane-level and is not attributable to `ABC-174` (`N8-LANE` MET).
> **Severity MEDIUM.** It is non-blocking at this gate. **Owner: Olger Oeselg**, if he accepts.
> **Discharge:** the first admissible full-lane reading ≤ 10 s on the declared capped stack, or his own re-level of W.
> **Every later gate that reads the lane inherits this state until it is discharged.**

**Owner options for `R-174-1`:**
- **(a) Accept, and route a lane remedy (Recommended).** `ABC-174` proceeds. Architect/Design, as the floor-account
  owner, sizes a lane-level remedy to get `npm test` back under 10 s. The cost: the lane stays at the bar until that
  remedy lands.
- **(b) Hold `ABC-174`'s merge until the lane reads ≤ 10 s.** The ticket waits on a fix it did not cause. The lane stays
  over for every other ticket.
- **(c) Re-level W.** This needs his word (`ADR-0035` D6). I do not recommend it: it repeats the 13 → 15 s pattern.
- **(d) Take one more reading first.** This is a paired full-lane base arm, `bd480c99` against `be6a5599` with a twin,
  in a quiet window. It costs about 15 min, and a quiet window has been hard to find on this host today. It settles
  whether the lane was already over before `ABC-174`. It does not change (a)–(c).

## 3. Does QE's reading discharge `R-173-1`? **No.**
- **The arms are wrong.** `R-173-1`'s arms are fixed at `H` = `git archive 9c97dd23` (`ABC-173`'s tip, without
  `ABC-171`). QE read `be6a5599`, which combines `ABC-171`, `ABC-173` and `ABC-174`. The catalog says it plainly:
  "**Do not read either risk on the combined `ABC-171` + `ABC-173` tree.**"
- **The taker is wrong.** Its discharge names the Orchestrator's quiet-window reading.
- **`R-173-1` stays open, owed, LOW, and owned by Olger Oeselg.** QE's figure only tells us this: the combined capped
  tree is at the bar. What `A9` reads on its own arms is still `UNKNOWN - verify`. A reading of `A9` would now also
  split the cap's cost from `ABC-171`'s.

## 4. Does QE's full-lane twin R replace the pre-cap `F` (1.72 s CPU / 3.25 s wall)? **No.**
- **A full-lane twin needs its own install.** The design record that governs this move (`…dd7a6ec9` § "What the record
  now says" 2) says: "the twin must be a second tree of base **with its own `npm ci`**". `ADR-0035`'s 2026-10-12
  per-set paragraph confirms that condition is a full-lane one.
- **QE's arms did not have one.** `H` and `H2` shared one symlinked `node_modules` (`…5d9a0f63` § Instrument).
- **`R-173-1`'s table agrees.** It replaces `F` only "on MET", and this reading is NOT MET.
- **So QE's R is listed and not used**, as `ABC-152` `V9`'s R was. It is 0.390 s CPU / 0.280 s wall, capped, on
  vitest 4.1.11, at k 2.
- **`F` stays 1.72 / 3.25 s, labelled pre-cap, and `RISK-ABC144-FCAP` stays open.** Moving `F` is Architect/Design's
  job.
- **The verdict does not depend on `F`.** The W reading does not use `F` (`…dd7a6ec9`), and a stale `F` cannot yield
  a false MET (`ADR-0008` Ruling 5).
- **One condition to resolve.** The `NFR-008` row's heap clause says the first capped twin R replaces `F` "outright"
  and names no install condition. `R-173-1`'s table says "on MET". Architect/Design should make the two say the same
  thing when it next moves `F`.
- QE's narrow-set R (0.160 s CPU / 0.070 s wall) replacing that set's provisional 16 % is a per-set move. Per-set
  moves carry no install condition, and I do not contest it. Architect/Design records it.

## 5. QE's other gaps
- **`QE-174-a` (LOW): accepted.** No `NFR` rests on the `A3` row's blind band, because the data rows and the
  QE-087-a spy kill both mutants. It is not required. Owner if taken: Software Engineer, test-only.
- **`QE-174-c` and `QE-174-e` (INFO): accepted.** They have no `NFR` bearing. Owner: QE (record only).
- **`QE-174-d` (INFO)** goes to `ABC-175` / Architect/Design, as QE routed it.
- **`QE-174-f` (INFO)** goes to the Orchestrator.

## 6. New items from this gate
- **`SEC-174-1` (LOW, catalog wording, non-blocking).** `plans/nfr-catalog.md:1405` (`THE LEVEL LAYER`) still defines
  "at default difficulty" as `LEVELS[3]`, and it goes stale at `ABC-174`'s merge. The brief fenced this hop to the two
  named lines, so it is not edited.
  - **Fix:** add the same insertion-only dated note to `:1405`. Optionally do `:1364` too, though as a dated record it
    is still true as history.
  - **Owner:** the Orchestrator, to route to the next catalog-holding Security/NFR hop. That hop can be this one
    extended, on the Orchestrator's word. It is due at or before the merge.
  - **The same hop should also write `NFR-008`'s first R-1 verdict** (§ 2) into the catalog.
- **`SEC-174-2` (INFO).** Every scored QE run, base and full lane, ran on **Battery Power** (`power` column,
  `attempt2/*.tsv`). `speed_limit` read `none` on every run. The declared stack names no power source, and earlier
  readings on record are mixed (some AC, some battery). Whether AC would move a 10 ms breach is `UNKNOWN - verify`.
  - This does not soften § 2. The reading stands as taken.
  - Owner: Architect/Design, the protocol owner, if it wants the stack declaration to name power.

## Result
**PASS_WITH_RISKS.**
- **Required fixes:** none in code. The catalog follow-up `SEC-174-1` is LOW.
- **Accepted risks:**
  - `AR-NFR004-A`, re-accepted with its number. Owner: Security/NFR.
  - `QE-174-a`, `-c` and `-e`.
- **Proposed, with the owner's word owed:** `R-174-1` (MEDIUM, owner-designate Olger Oeselg).
- **Still open, not discharged:** `R-173-1` and `R-173-2`.
- **Next column:** recommended `In Security/NFR` → `Ready for UAT`. The move is the Orchestrator's. UAT itself waits on
  `ABC-175`'s verdict (owner Q3). The Scribe's `AGENTS.md:59` is still owed before merge.
