---
id: 20261021T093522Z-security-nfr-decision-3e4b4a08
kind: decision
by: security-nfr
at: 2026-10-21T09:35:22Z
verified_by: 
confidence: high
refs:
  - ABC-163
  - AR-095-L1UNIT
  - AR-163-DELONLY
  - AR-163-UNCOMMENT
  - AR-180-VALIDATED
  - AR-095-CWD
  - AR-095-READ
  - F-095-1
  - G-1
  - G-2
  - G-4
  - ADR-0036
  - V5.3.2
  - V5.2.1
  - NFR-008
  - grugops/ABC-163
  - dc4d4f15
  - 87d3897d
  - d8c073e2
  - ccccc6bb
  - 341da4c1
  - grugops/qe-ABC-163
  - 2270c8fa
  - f459353e
  - .grugops/context/design-F-072-1/probe/clause-b.mjs
  - src/book-file.ts
  - src/book.ts
  - 20261021T093010Z-qe-e2e-observation-7f56f339
  - 20261021T093040Z-qe-e2e-decision-8a60d7c8
  - 20261021T091929Z-architect-design-observation-a76b1b2e
  - 20261021T091930Z-architect-design-decision-c3568326
  - 20261021T091931Z-architect-design-decision-a7d9c818
  - 20261021T091932Z-architect-design-decision-c7df0411
  - 20261021T092600Z-security-nfr-decision-1b032e3f
  - 20261021T093500Z-orchestrator-decision-73eb06c5
  - 20261021T093522Z-security-nfr-observation-3b895278
  - 20261021T093000Z-qe-e2e-observation-5e2bf05e
supersedes: 
seal: sha256:e34d11eb923b7832bcabe12fc645c9d819849c00dfcdc96a6e443830171429e0
---

# Security/NFR on `ABC-163`: **PASS_WITH_RISKS**. `AR-095-L1UNIT` closes at the merge as written. G-1 accepted as `AR-163-DELONLY` (LOW, the Orchestrator); G-2 accepted as `AR-163-UNCOMMENT` (LOW, Architect/Design). No required security fixes. Three ADR wording precisions are owed before the merge

ASVS L1, `block_on: high`, `compliance_regime` empty. The readings are in the companion observation note.

## 1. `AR-095-L1UNIT`: CONFIRMED, it closes when `ABC-163` merges
- **The written condition** (`ADR-0036` § S1): `clause-b.mjs` fires on a `+` line in a limb-1 holder, with at least
  P2b and P2c firing. Security/NFR's `…b65b11b7` adds the empty-holder case, which must not fire. All three were read
  by QE with its own plants (`…5e2bf05e`, `…8a60d7c8`): `A1` 2 of 2 FIRE, `A2` FIRES, `A3` adds nothing and runs no
  pathspec diff. The Architect's `…c7df0411` asks for the same.
- **Close:** at the owner's merge of the branch that carries `87d3897d` to `main`. The Orchestrator records it.
  If `clause-b.mjs` changes again before the merge, QE re-reads `A1`–`A3` first.
- **G-1 neither holds nor re-opens it.** G-1 is outside the risk's words. Moving the condition now would be moving
  the goalposts (the same reasoning as `…1b032e3f` § 1).
- **Effect on `AR-180-VALIDATED`:**
  - its close part (i) is met at this merge, and its owed item (a) for a triggering ticket is satisfied;
  - part (ii), the G-2 pin with TMO red, is still owed. **`AR-180-VALIDATED` stays open.**

## 2. G-1: ACCEPTED as **`AR-163-DELONLY`**
- **Rating:** LOW, latent. **Owner:** the Orchestrator. **Fix by:** Architect/Design.
- **What it is:** an edit that only deletes lines in a limb-1 holder fires nothing. Ruling 2's unit is "a `+` line",
  while the retired by-hand `--name-only` listed the file.
- **Why LOW:** no L1 requirement fails at the tip. Today's holder takes no parameter and reads one fixed path on one
  line, so a deletion cannot widen it (measured).
- **Unfixed at the trigger:** MEDIUM, the `F-095-1` class (a form that passes silently). The regression it would
  hide, a dropped cap (`V5.2.1`) or path check (`V5.3.2`), is an L1 fail and HIGH.
- **Trigger.** A diff that makes any limb-1 holder at `<head>` contain any one of:
  - (i) a guard on its read path: any conditional, throw, early return, validation or cap, with or without a
    parameter. One example is `AR-095-READ`'s regular-file or size check;
  - (ii) a parameter, or any caller-supplied value, reaching the read (§ Decision 3's re-armed trigger);
  - (iii) a read expression spanning more than one line;
  - (iv) a second limb-1 holder file.

  Each of these arrives as `+` lines in a holder, so the ticket routes itself to `In Security/NFR`. The gate on that
  ticket checks for the trigger.
- **When it fires, owed before that ticket merges:**
  - **The ruling widens.** Ruling 2's unit becomes any changed line, `+` or `−`, in a production file that holds
    limb 1 at `<base>` or `<head>`. The empty-holder case is kept. Security/NFR words the ruling at that gate.
  - **The instrument is fixed.** A file that appears in the zero-context diff with only `−` hunks fires. That means
    dropping the `!lines.size` skip and printing the `−` count, about 3 lines.
  - **QE reads the fix** with G-1b (a no-parameter guard drop), the import-line drop and the limb-1 uncomment plant,
    plus `A3`'s empty case.
  - **Recommended with the fix:** the committed Ruling 2 plant fixture from G-4.
  - **Until the fix lands,** the Orchestrator runs the by-hand `--name-only` check at every routing, with holders at
    `<base>` ∪ `<head>` and never with an empty pathspec.
- **Closes when** the instrument fires on a deletion-only edit to a limb-1 holder, read by QE with G-1b and the
  import-line drop.
- **Compensating controls today:**
  - the holder cannot be widened by deletion;
  - the instrument still lists the holder under `production files changed`;
  - the trigger routes itself;
  - QE reviews every ticket.
- **Not chosen:**
  - **Keeping the by-hand check beside the instrument now.** It brings back the manual step and the empty-pathspec
    trap that `ABC-163` retires, for a case that cannot widen today's holder.
  - **A cut now.** The fix buys no detection at today's holder. It is owed at a precise trigger that routes itself.
    At L1 a control the change does not yet need is gold-plating.

## 3. G-2: ACCEPTED as **`AR-163-UNCOMMENT`**
- **Rating:** LOW, pre-existing on every limb. **Owner:** Architect/Design, as with § Decision 3's residual.
- **What it is:** deleting only the `/*` and `*/` lines around limb code makes a live occurrence with no `+` line. It is
  a blind spot of the DELTA test since `ADR-0036` § Decision 2. `ABC-163` neither introduces nor widens it.
- **Why LOW:**
  - the tree has no such block today (measured: 0);
  - creating one is a separate, earlier step. If it adds commented code, the instrument lists it as a word hit on an
    added line. If it comments out existing code, the later uncomment restores a capability that was already
    reviewed.
- **Trigger:**
  - a gate's word-hit list shows limb code inside a block comment; or
  - limb code appears inside a `/* … */` block in production `src/` that would compile without its delimiters.
- **When it fires:** the gate treats that file as fired (the fail-safe sentence). Before that ticket merges, either
  the commented code is removed or the fix lands.
- **Fix shape:** (b1) also fires when a production file's AST occurrence count for the limb is higher at `<head>`
  than at `<base>`. For limb 1 alone, `AR-163-DELONLY`'s fix already catches it, because the uncommented file is a
  holder at `<head>`.
- **Closes when** the instrument fires on QE's uncomment plant on every limb.
- **No cut now.** The fix changes the clause on every limb to close a two-step shape whose first step is visible.

## 4. Security surface: CONFIRMED
- **0 `src/` lines.** The change touches the instrument, `ADR-0036`, the `ABC-163` page and notes.
- **The instrument's own surface is unchanged:**
  - `execFileSync("git", args)` takes an argument array and runs no shell;
  - Ruling 2 adds no subprocess call and no write.
- **NFR:** `NFR-008` is not triggered (0 tests). No timing was read. **Logging:** the instrument's output is the
  detective record. Ruling 2 adds one line to it, and in the G-1 case the holder still shows under
  `production files changed`.

## 5. Owed before the merge: ADR records, not a security block
The Orchestrator routes these to `arch-ABC-163-adr-text`. Security/NFR does not edit the ADR. `main` routes with its
own copy, so these should land before `ABC-163` merges.
- **(a) The trigger is too narrow.** "§ S1's re-armed § Decision 3 trigger re-opens this case" does not cover G-1b.
  Name `AR-163-DELONLY` and its trigger (i)–(iv) instead.
- **(b) The interim control names a closed risk.** "the instrument carries `AR-095-CWD`'s interim control":
  `AR-095-CWD` closed at `f459353e`. Drop the sentence, or re-point it to `AR-180-VALIDATED`'s compensating control.
- **(c) The retirement needs its limit.** "The by-hand Ruling 2 check is no longer needed" should add: until
  `AR-163-DELONLY`'s trigger fires without its fix.

## Accepted risks after this gate
- `AR-163-DELONLY` (LOW, the Orchestrator; new);
- `AR-163-UNCOMMENT` (LOW, Architect/Design; new);
- `AR-180-VALIDATED` (LOW, the Orchestrator; part (i) met at the merge);
- `AR-095-READ` (LOW, Security/NFR; unchanged).

`AR-095-L1UNIT` closes at the merge. **Required security fixes before merge:** none.

**Board:** `ABC-163` leaves `In Security/NFR` toward `Ready for UAT`. UAT is waived: QE measured the non-test `src/`
list as empty. The Orchestrator makes the move.
