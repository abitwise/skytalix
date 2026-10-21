---
id: 20261021T092600Z-security-nfr-decision-1b032e3f
kind: decision
by: security-nfr
at: 2026-10-21T09:26:00Z
verified_by: 
confidence: high
refs:
  - ABC-180
  - AR-162-FALLBACK
  - AR-180-VALIDATED
  - AR-095-CWD
  - AR-095-L1UNIT
  - AR-095-READ
  - ABC-163
  - ABC-168
  - G-1
  - G-2
  - G-3
  - V5.3.2
  - ADR-0036
  - NFR-008
  - grugops/ABC-180
  - acb52edf
  - d9c3cca3
  - ccccc6bb
  - grugops/qe-ABC-180
  - c0a7225f
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - plans/tickets/ABC-180-a-decoy-book-in-a7s-neutral-cwd-reds-a-cwd-first-read-with-a-module-fallback.md
  - 20261021T091812Z-qe-e2e-observation-9caa5ead
  - 20261021T091813Z-qe-e2e-observation-91bdbc2a
  - 20261021T091814Z-qe-e2e-observation-b571ef5f
  - 20261021T091815Z-qe-e2e-decision-f88e0845
  - 20261021T082900Z-security-nfr-decision-06c147db
  - 20261021T084500Z-orchestrator-decision-6d15cdc3
  - 20261021T092500Z-security-nfr-observation-d9d72d63
supersedes: 
seal: sha256:4d0487dfbb121af2cdc920df0f7fdb74365f6ee5de4f2662a19713b2b149fb6c
---

# Security/NFR `ABC-180` @ `acb52edf`: **PASS_WITH_RISKS**. `AR-162-FALLBACK` is CLOSED as written; G-1 (P6g) and G-2 (decoy order) are carried as the narrower `AR-180-VALIDATED` (LOW, owner the Orchestrator); no BA/PM cut now

**Admission.** No `finding` is admissible here: there is no §14 gate stamp and no human grant (`human_admission: off`). So every ruling here is a `decision`.

**Basis.**
- QE's notes `…9caa5ead`, `…91bdbc2a`, `…b571ef5f` and `…f88e0845`.
- My readings in this task (the observation sealed with this note).
- My `ABC-162` ruling `…06c147db`, and the Orchestrator's trigger reading `…6d15cdc3`.
- ASVS L1 (pinned 5.0.0), `block_on: high`, no compliance regime. No timing was taken.

## 1. `AR-162-FALLBACK`: CLOSED, as written
- **The condition I set** (`…06c147db` § 1): a `CLI_DEEP` row green on the clean build and red on P6f, read by QE with the plant at base and head, with the P6b/P6c/P6e kills still holding.
- **QE read exactly that** (`…91bdbc2a`):
  - P6f: base 11/11 green, head 10/11 with the only red `A7` at the labelled stderr check `:534`;
  - P6b, P6c and P6e: red at head;
  - clean build: 11/11;
  - PD: red at the parse check `:497`.
- **Why close it as written.** Holding it open on P6g, a form its condition never named, would repeat the goalpost move I refused for `AR-095-CWD`. It would leave the risk with no condition that could ever close it, because QE showed that no fixed decoy closes the validate-then-fallback family.
- **Why not "kept open".** P6g is a different control problem, and it gets its own record (§ 2).
- **The Orchestrator owns the risk and records the close.**
- **Trigger reading.** I concur with the Orchestrator's reading `…6d15cdc3`:
  - "`EPIC-006` cut or pulled" means a ticket that packages the CLI or adds or changes a `bin` or launch path;
  - pulling `ABC-161` does not fire it;
  - pulling `ABC-168` does fire it.

  That reading carries over unchanged to § 2's residual. `ABC-180` landing before `ABC-168` merges discharges the `AR-162-FALLBACK` part of it.

## 2. New residual `AR-180-VALIDATED` (LOW; owner the Orchestrator). It holds G-1 and G-2
- **What it is.**
  - **(G-1)** A `readBookFile` that tries a cwd-relative path and uses the file only when it validates, and otherwise falls back silently to the module URL (P6g, at any validation depth), passes `CLI_DEEP`. No fixed decoy can close this family.
  - **(G-2)** `A7`'s P6f kill depends on `beforeAll` writing the decoy before the `booked` spawn. No assertion pins that order: TMO survives.
- **Severity: LOW at the tip.**
  - The delivered read is a constant path resolved from the module URL, so `V5.3.2` [L1] is met.
  - If P6g landed, it would FAIL `V5.3.2` [L1]. Its default severity is HIGH, and that blocks, exactly as with P6f.
  - This is a missing detective control, not a failing control.
- **Compensating controls:**
  - `ADR-0036` Ruling 2 routes any edit to `src/book-file.ts`, so P6f, P6g and P6i, to `In Security/NFR`. It is applied by hand until `ABC-163` lands.
  - Clause (b) limb 1 fires on a new `from "node:` import in any production file. That covers an override placed outside the holder.
  - S3 item 2 reads the holder by hand at this gate.
  - `A7` kills P6b, P6c, P6e and P6f automatically.
- **Owner: the Orchestrator**, who already owns routing (`AR-095-L1UNIT`).
- **Promotion trigger:** the same as `AR-162-FALLBACK`'s, read as in § 1. That is a ticket that edits `src/book-file.ts`, or a ticket that packages the CLI or adds or changes a `bin` or launch path (`ABC-168` included). When it fires, these are **owed before that ticket merges**:
  - **(a)** either `AR-095-L1UNIT` is closed (`ABC-163` merged), or the Orchestrator applies Ruling 2 by hand. In both cases, Security/NFR's gate on that ticket reads every production read reachable from the new or changed launch path for a cwd-relative book read, including the validate-then-fallback form;
  - **(b)** the G-2 pin (fix shape below), as an XS test-only rider. BA/PM chooses whether to fold it into the triggering ticket or cut it separately.
- **Closes when both of these hold:**
  - **(i)** `AR-095-L1UNIT` closes. That means `ABC-163` merges and QE reads its `A1` (P2b, P2c) and `A2` (comment-only edit) **FIRE**, so that every edit to the holder routes here mechanically. After that, P6g is still seen by no test. **That is accepted as the designed control for this family, not called covered by a test.**
  - **(ii)** the G-2 pin lands, and QE reads TMO **red at head** with P6f planted.

## 3. G-1 and G-2 dispositions
- **G-1: ACCEPTED inside `AR-180-VALIDATED`. No BA/PM cut for QE's valid-book decoy (VD).**
  - VD buys one level of validation depth. It gives up:
    - the fixed, labelled stderr signal that `AR-162-FALLBACK`'s close rests on;
    - the PD guard;
    - independence from the delivered book's contents, since the kill rests on `b7b5` staying out of it.
  - An override that validates one step further skips VD in turn. So VD does not close the family.
  - It is the non-stderr discriminator shape I ruled gold-plating at L1 (`…06c147db` § 2).
  - The control that covers every depth is routing on the holder file (Ruling 2 / `ABC-163`), together with the gate's hand read.
- **G-2: ACCEPTED inside `AR-180-VALIDATED`. No standalone cut now.** The fix is owed on the first of these two events:
  - the promotion trigger fires (§ 2 (b));
  - any ticket edits `A7`'s `beforeAll` or its `it`. That ticket carries the pin.

  **Fix shape** (XS, test-only, 0 spawns, 0 tests):
  - in `A7`'s `beforeAll`, on the line directly before the `booked` spawn, capture `existsSync(join(neutral, BOOK_PATH))`;
  - assert that captured value is `true` in `A7`, with a message naming `AR-162-FALLBACK`;
  - add a comment on the decoy write saying it must precede the spawn.

  The acceptance is that QE reads TMO red at head with P6f planted.
- **G-3 (P6i, another cwd path): INFO, no action. I agree with QE.** It is an edit to the holder, so Ruling 2 routes it. It is in the § 2 family.

## 4. Security surface
- **Test-only.**
  - The only file is `src/cli.real-engine.test.ts`.
  - The waiver form is empty, with 0 production lines.
  - Ruling 2 does not fire.
- **The decoy write raises no new temp-file concern at L1.**
  - It lands inside the `mkdtemp` 0700 directory, which is assigned before the write.
  - The bytes are a fixed literal.
  - Cleanup is an exact-path recursive `rmSync`. It does not follow symlinks and still runs if the write throws.
  - I measured this in scratch; QE `A3` reads 0 leftovers.
- **`NFR-008`:** 0 / 0 / 0. `CLI_DEEP` 11 tests and 6 children, both equal to base.
- **Logging:** unchanged.

## Result
**PASS_WITH_RISKS.**
- **Required fixes before merge:** none.
- **Closed:** `AR-162-FALLBACK`.
- **Accepted risks:**
  - `AR-180-VALIDATED` (LOW, the Orchestrator; new; holds G-1 and G-2);
  - `AR-095-READ` (LOW, Security/NFR, unchanged);
  - `AR-095-L1UNIT` (LOW, the Orchestrator; closing through `ABC-163`).
- **Owed by the Orchestrator:**
  - record the `AR-162-FALLBACK` close and open `AR-180-VALIDATED` on the trace;
  - make the column move: `In Security/NFR` → `Ready for UAT`, or straight to merge under the measured UAT waiver.
- **Owed by BA/PM:** nothing now. The G-2 rider is owed only when § 2's trigger or § 3's edit condition fires.
