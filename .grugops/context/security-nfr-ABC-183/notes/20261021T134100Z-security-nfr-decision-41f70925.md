---
id: 20261021T134100Z-security-nfr-decision-41f70925
kind: decision
by: security-nfr
at: 2026-10-21T13:41:00Z
verified_by: 
confidence: high
refs:
  - ABC-183
  - AR-180-VALIDATED
  - AR-183-CWDARG
  - AR-162-FALLBACK
  - AR-095-CWD
  - QE-183-a
  - QE-183-b
  - V5.3.2
  - NFR-008
  - ADR-0036
  - ABC-162
  - ABC-168
  - grugops/ABC-183
  - 7bd2b54f
  - c4c6d36e
  - grugops/qe-ABC-183
  - 3ab055f4
  - 19abbdb1
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - plans/tickets/ABC-183-a7-pins-that-the-decoy-is-written-before-the-booked-spawn.md
  - 20261021T101000Z-qe-e2e-observation-5e544b3e
  - 20261021T101020Z-qe-e2e-observation-cbd50a13
  - 20261021T101040Z-qe-e2e-decision-be7c2c82
  - 20261021T092600Z-security-nfr-decision-1b032e3f
  - 20261021T093500Z-orchestrator-decision-73eb06c5
  - 20261021T094500Z-orchestrator-decision-8d0de2f4
supersedes: 
seal: sha256:76e97888a82d12425087341ae745695eb511ad9febcc0e5c7ee626fee4e8e77c
---

# Security/NFR `ABC-183` @ QE `3ab055f4`: **PASS_WITH_RISKS**. `AR-180-VALIDATED` CLOSED as written; QE-183-a opened as new `AR-183-CWDARG` (LOW, owner the Orchestrator; XS P3 cut now, non-blocking); QE-183-b accepted (INFO)

**Admission.** `human_admission` is off and there is no §14 stamp, so every ruling here is a `decision`, not a `finding`. ASVS L1 (5.0.0), `block_on: high`, no compliance regime. The readings are in the observation sealed with this note.

## 1. `AR-180-VALIDATED`: CLOSED, as written
- **Part (i)** was met at `ABC-163`'s merge (`…8d0de2f4`).
- **Part (ii)** was read by QE with the plant (`…5e544b3e`): TMO + P6f is base 11/11 green and head 10/11, red A7 at the new assertion, with `AR-162-FALLBACK` in the output. The P6f kill holds on both tests.
- No narrower residual is carried from it:
  - **G-1 (P6g)** was accepted by design inside this risk's close condition (`…1b032e3f` § 2 (i)). Its standing control is Ruling 2, which the instrument now applies mechanically, plus S3 item 2's by-hand read of the holder.
  - **QE-183-b** is INFO (§ 3).
  - **QE-183-a** is a different gap, named nowhere in this risk's condition (§ 2). Holding the risk open on it would move the goalpost.
- **The Orchestrator owns the risk and records the close.**

## 2. QE-183-a (TCWD): a NEW risk, `AR-183-CWDARG` (LOW; owner the Orchestrator)
- **Not an extension.**
  - `AR-095-CWD` and `AR-162-FALLBACK` closed when their written conditions were met, and they stay closed.
  - This gap dates from `ABC-162`, which passed `neutral` to `booked` but asserted only the variable. `RealChild` does not carry the child's working directory.
- **What it is.** Dropping one argument from `booked`'s spawn runs the child from the tree root, where the real book is. That disarms the whole `AR-095-CWD` / `AR-162-FALLBACK` detector: under P6f the lane is 11/11 green (QE's reading, and mine with the byte-identical plant).
- **Why LOW, and why it does not block.**
  - No ASVS requirement fails at the tip: `src/book-file.ts` is the constant module-URL read, so `V5.3.2` [L1] is met. This is a missing detective control in the test, not a failing control.
  - Exploiting it needs a test-file edit and a cwd-reading production edit together. Ruling 2 routes the production half here.
  - It predates this change. `ABC-183` neither creates it nor widens it, and it is outside the page's scope. **It does not block this merge.**
- **Fix shape, for BA/PM to cut now** (XS, P3, test-only, `src/cli.real-engine.test.ts`; 0 spawns, 0 tests, 0 `mkdtemp`):
  - `RealChild` gains `readonly cwd: string`, and `spawnNode` returns the `cwd` it spawned with;
  - in A7's `it`, add `expect(booked.cwd, <a message naming AR-183-CWDARG and the detector>).toBe(neutral)`.

  I measured this in scratch: FIX alone is 11/11; FIX + P6f reds the existing stderr detector; FIX + TCWD + P6f is 10/11, red at the new assertion.
- **Acceptance**, mirroring `ABC-183`'s A4 table:
  - TCWD + P6f: green on the base test, red on the head test at the new assertion;
  - TCWD alone: red on the head test;
  - the P6f and TMO kills still hold;
  - counts as in `ABC-183` A5, except for the new `expect`;
  - QE re-reads `ABC-183` A1's `grep -B1` at that hop, because the ticket edits A7.
- **Promotion trigger:** the same as `AR-180-VALIDATED`'s (`…73eb06c5`). That is a ticket that edits `src/book-file.ts`, or a packaging, `bin` or launch-path ticket. `ABC-168` fires it; `ABC-161` does not. **When it fires:**
  - raise the ticket to P2;
  - the fix is owed before that ticket merges;
  - Security/NFR's gate on that ticket reads every production read reachable from the new or changed launch path for a cwd-relative book read (S3 item 2).

  Any ticket that edits A7's `beforeAll` or `it`, `spawnReal`, `spawnNode` or `RealChild` first carries the fix instead.
- **Closes when** the fix lands and QE reads TCWD + P6f red at head with the plant.

## 3. QE-183-b (TMOC): ACCEPTED, INFO. No record and no cut
- It needs a three-line co-move, and one of those lines is a capture whose name and doc comment state the order. A runtime pin can only be relative to where the capture sits; that is the shape I specified.
- Pinning it absolutely would mean instrumenting `spawnNode`. That is gold-plating at L1.
- `ABC-183` A1's static `grep -B1` read caught it, and it stays owed as a QE read at any hop that edits A7's `beforeAll`.
- The Orchestrator owns the acceptance.

## 4. Security surface: test-only, and no new concern
- The only `src/` file is `src/cli.real-engine.test.ts` (+11/−0). The waiver form is empty, `src/book-file.ts` is unchanged, and Ruling 2 is silent.
- The change adds one read-only `existsSync`, on a path under the 0700 `mkdtemp` directory. It adds no write, spawn, import, environment read or logging change.
- **`NFR-008`:** 0/0/0; `CLI_DEEP` 11 tests and 6 children, equal to base (QE).

## Result
**PASS_WITH_RISKS.**
- **Required fixes before merge:** none.
- **Closed:** `AR-180-VALIDATED`.
- **Accepted:**
  - `AR-183-CWDARG` (LOW, the Orchestrator; new; BA/PM XS P3 cut now);
  - `AR-095-READ` (LOW, Security/NFR, unchanged);
  - `AR-163-DELONLY` and `AR-163-UNCOMMENT` (unchanged).
- **Owed by the Orchestrator:** record the `AR-180-VALIDATED` close; open `AR-183-CWDARG`; move the ticket `In Security/NFR` → `Ready for UAT`, or merge under the measured UAT waiver.
- **Owed by BA/PM:** the `AR-183-CWDARG` cut, pulled ahead of `ABC-168`.
