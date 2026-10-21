---
id: 20261021T121248Z-security-nfr-decision-2fe79772
kind: decision
by: security-nfr
at: 2026-10-21T12:12:48Z
verified_by: 
confidence: high
refs:
  - ABC-184
  - AR-183-CWDARG
  - QE-184-a
  - QE-184-b
  - QE-184-c
  - grugops/ABC-184
  - grugops/qe-ABC-184
  - 2c65403b
  - c6f80c81
  - 442d1e57
  - 5277babd
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
  - V5.3.2
  - NFR-008
  - N8-LANE
  - ABC-168
  - ADR-0036
  - AR-095-READ
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - 20261021T120645Z-qe-e2e-decision-7b9ef6a7
  - 20261021T120645Z-qe-e2e-observation-83a92ac8
  - 20261021T134100Z-security-nfr-decision-41f70925
  - 20261021T102200Z-orchestrator-decision-bc2b06ce
supersedes: 
seal: sha256:3b297640247f62b6d6bd0912ebe9d89cfdae9c2a8445beb50140c1240b2b17d7
---

# Security/NFR `ABC-184` @ QE `2c65403b`: **PASS_WITH_RISKS**. `AR-183-CWDARG` CLOSED as written, effective at the merge; QE-184-a and QE-184-b accepted (INFO, owner the Orchestrator); QE-184-c routed to the Orchestrator (brief wording); test-only confirmed

**Admission.** `human_admission` is off and there is no §14 stamp, so every ruling here is a `decision`, not a `finding`. ASVS L1 (5.0.0), `block_on: high`, no compliance regime. My readings are in the observation sealed with this note.

## 1. `AR-183-CWDARG`: CLOSED, as written, when `ABC-184` merges
- **The close condition is met.** It reads "the fix lands, and QE reads `A3`'s TCWD + P6f row with the plant: green on the base test, red on the head test at the new assertion" (`…41f70925` § 2, `…bc2b06ce`).
  - QE read it (`…86f4cd19`): base 11/11, head 10/11, red A7 `:504`, `AR-183-CWDARG` in the output.
  - I re-read it with byte-identical plants and got the same result. TCWD alone also reds the head test (QE), so the new assertion does not depend on P6f.
  - "The fix lands" is the merge to `main`. The close takes effect there, the same way `AR-180-VALIDATED` closed at `ABC-183`'s merge.
- **No narrower named residual.**
  - TSPWN (QE-184-a) was named on the page as an INFO residual that is not routed, inside this close's design. Holding the risk open on it, or carrying it as a new AR, would move the goalpost. That is the same ruling as G-1 at `AR-180-VALIDATED`.
  - Exploiting what is left needs a deliberate edit inside the test helper that names the `mkdtemp` prefix, together with a cwd-reading production edit. Ruling 2 routes the production half to `In Security/NFR` mechanically (`ABC-163`).
- **The promotion trigger goes with the risk.** No P2 promotion is owed to `ABC-168` on this risk's account after the merge. `ADR-0036` Ruling 2 and S3 item 2 are standing controls and do not depend on this risk.
- **The Orchestrator owns the risk and records the close.**

## 2. QE-184-a (TSPWN) and QE-184-b (TFORGE): ACCEPTED, INFO, owner the Orchestrator. Neither undercuts the close
- **QE-184-a (TSPWN).** A one-line edit to the `spawnSync` `cwd` option inside `spawnNode`, aimed at the neutral child, survives P6f. I reproduced it (11/11).
  - **Why INFO.** To aim at `booked` the edit has to name the `abc162-neutral-cwd-` prefix. That is a deliberate, path-conditional helper edit, the same class as QE-183-b. The accidental form (TSPWG, `cwd: REPOSITORY`) is killed by four other rows. No ASVS requirement fails.
  - **Fix shape, not cut.** The only control that sees it is a child-side `process.cwd()` read, which needs a child print or a new spawn. The page fences that out, and at L1 it would be gold-plating.
  - **Standing QE read instead, no ticket.** At any hop that edits `spawnNode`, QE reads that the `spawnSync` `cwd` option and the returned `cwd` are the same unmodified parameter (`ABC-184` A1, bullet 2). If they differ, that hop re-binds them before merge. It works the same way as QE-183-b's standing `grep -B1` read.
  - **Erratum: yes.** The page's Out of scope calls this "a two-place helper edit". QE measured one line, and so did I. The class and the INFO ruling do not change. **This is a records erratum, not a re-cut.** The Orchestrator adds one dated line to the `ABC-184` page when it records the close: "one line (the `spawnSync` `cwd` option), not two places; QE-184-a, `security-nfr-ABC-184`". BA/PM is not needed.
- **QE-184-b (TFORGE).** A forged `cwd: neutral` on the `booked` line survives. Any assertion can be defeated by forging its own input, so this is a review matter, not a control gap. No record, no fix, no standing read.
- **Neither undercuts the close.** The close row is TCWD + P6f, and it reds. Both survivors are different plants, and both were anticipated by the cut's own scope.

## 3. QE-184-c (reporter-dependent child count): ROUTED to the Orchestrator, INFO. No ticket
- **The hazard is real, and it is a measurement-integrity one.** In an agent session the default reporter prints **0** `[CLI_DEEP]` lines at base and at head. A "children equal base" criterion read that way passes vacuously, 0 = 0. That would be a fake clean `N8-LANE` reading.
- **This ticket is not affected.** The SE and QE both named the reporter and read 6. I read 6 in each of my three cells with `--reporter=verbose`.
- **The route, owed by the Orchestrator in brief wording from now on:** any brief or acceptance that counts `CLI_DEEP` children:
  - names `--reporter=verbose` (or `--silent=false`);
  - states a non-vacuity floor: the count is ≥ 1, and today it is 6 at base.
- Whether `AGENTS.md`'s `CLI_DEEP` line also carries the reporter is a Scribe decision for the Orchestrator. `AGENTS.md` sits at its byte budget (`ABC-164`). It is not required.

## 4. Security surface: test-only confirmed, no new concern
- The only `src/` change is `src/cli.real-engine.test.ts`, +7/−0. The waiver form is empty, and `src/book-file.ts` is unchanged, so Ruling 2 is silent.
- The change adds one `readonly string` field, one property in a returned object and one equality `expect`. It adds no I/O, spawn, import, environment read, write, temp file or logging change.
- `V5.3.2` [L1] is met at the tip. `NFR-008` / `N8-LANE`: 0 new files, tests and spawns; `CLI_DEEP` 11 tests and 6 children. No timing was taken.

## Result
**PASS_WITH_RISKS.**
- **Required fixes before merge:** none.
- **Closed:** `AR-183-CWDARG`, effective at the `ABC-184` merge.
- **Accepted (INFO, owner the Orchestrator):** QE-184-a (with a standing QE read at `spawnNode` edits) and QE-184-b.
- **Routed:** QE-184-c, to the Orchestrator's brief wording.
- **Unchanged:** `AR-095-READ` (LOW, Security/NFR), `AR-163-DELONLY` (LOW, the Orchestrator) and `AR-163-UNCOMMENT` (LOW, Architect/Design).
- **Owed by the Orchestrator:**
  - record the `AR-183-CWDARG` close at the merge;
  - add the one-line erratum to the `ABC-184` page;
  - adopt the QE-184-c brief wording;
  - move `ABC-184` from `In Security/NFR` to `Ready for UAT`, or merge it under the measured UAT waiver.
