---
id: 20261010T172850Z-architect-design-decision-qe140a-accepted-class-trigger-r5-pin-chain-stops-at-r5d-13d0531f
kind: decision
by: architect-design
at: 2026-10-10T17:28:50Z
verified_by:
confidence: high
refs:
  - QE-140-a
  - QE-140-b
  - QE-140-c
  - QE-136-a
  - QE-136-c
  - QE-137-b
  - R5
  - R5b
  - R5c
  - R5d
  - AR-053-COMPOSER
  - ABC-140
  - ADR-0011
  - ADR-0029
  - src/history-pane.nfr.test.ts
  - memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md
  - .grugops/context/design-qe140a-2026-10-10/probe/RUN.txt
  - 20261010T172850Z-architect-design-observation-qe140a-readings-option-b-prototype-moves-the-gap-bec044c1
  - 20261010T171908Z-qe-e2e-observation-abc140-gap-register-64112bc2
  - 20261010T171908Z-qe-e2e-decision-abc140-verdict-pass-with-gaps-1e1185ff
  - 20261010T152348Z-architect-design-decision-qe136-a-accepted-qe136-b-is-r5c-a-ticket-r5b-discharged-1708c558
  - 20261010T163938Z-architect-design-decision-qe137-a-is-r5d-a-ticket-qe137-b-accepted-docblock-rides-e86924d7
supersedes:
---

# Ruling: option (a), widened. `QE-140-a` is ACCEPTED under one class trigger that covers both guards' whole `it` bodies. The `R5` text-pin chain STOPS at `R5d`. No ticket

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`). Subtask
`design-qe140a-2026-10-10`, Workflow 07. Every premise was re-measured at the wave tip `bb73aebb`. QE's committed
harness ran unrefused, and the Architect ran his own planter (`…bec044c1`). Recorded in `ADR-0011` § Pointers as
P8, with one Status line. The issuing scope and risks are `ABC-140`'s and QE's register `…64112bc2`. This note
cites them and does not restate them.

## 1. `QE-140-a`: ACCEPTED, LOW, owner Architect/Design. Option (b) is REJECTED

**What option (b) would buy, measured.** One contiguous literal would RED `Q-MUTATE-BETWEEN` and
`Q-RETURN-BETWEEN` for ≈ 0 code and no new `biome-ignore`. QE was right that `QE-136-a`'s "over-pins a comment"
reason does not carry over.

**Why it is still rejected.**
- **It moves the gap; it does not close it.** With the prototype in place, `A-RETURN-BEFORE` (one early `return`
  above the scan) stays green across the whole suite at 1608/1608 with a second composer planted. So does
  `Q-LOCAL-SHADOW` (`QE-140-b`).
- **Each further pin would do the same.** It would push the survivor up one more statement, until the pin is the
  whole `it` body.
- **The whole body is the pin P7 refused.** It would freeze `bindsAssembleFrame` (`AR-053-COMPOSER` option 1) and
  pin both comment blocks.
- **The cost is a full hop, not ≈ 0.** A BA/PM page, an Engineer build, a QE hop and a merge would buy 2 of the
  ≥ 4 measured spellings in this class.

## 2. The class trigger (replaces `QE-136-a`'s line-span trigger for both guards)

**Fires on** the first diff to `src/history-pane.nfr.test.ts` that does either of these:
- **Adds or edits an executable line** inside either guard's `it` body, other than text the drift tripwire
  already pins. The guards are identified by their `it` titles:
  - "licenses src/history.ts's runtime importers: the set EQUALS the declared licence" (`:359`–`:389` at
    `bb73aebb`);
  - "the composer tripwire: assembleFrame's value-importers EQUAL the one composition root" (`:588`–`:618`).
- **Renames either `it`.**

**It is anchored on the titles, not on line numbers.** `QE-136-a`'s `:366`–`:374` had already drifted to
`:373`–`:385` (`…bec044c1` O4).

**When it fires.** That hop's QE reads each such line as an `R5b` question (licence guard) or an `R5d` question
(composer tripwire). The question is whether the line narrows a scanned or compared set, rebinds a name the pinned
text calls, or leaves the `it` before its comparator.
- If it does, the defect is the line, and it leaves in that hop. The verdict is QE's.
- If it does not, QE records that and no pin is owed.
- **An edit to `bindsAssembleFrame` is read as `ADR-0029` `AR-053-COMPOSER`'s question (owner BA/PM), not `R5d`'s.**

**What it covers.**
- `QE-136-a` (`XSPLICE`) and `A-LIC-RETURN-BEFORE`, which is above `QE-136-a`'s old span.
- `QE-140-a`'s two spellings and `A-RETURN-BEFORE`.
- `QE-140-b` (`Q-LOCAL-SHADOW`), which had no trigger of its own.
- **It adds no module-scope coverage.** Members of the `QE-136-c` class that sit at module scope stay where
  `QE-136-c` and `QE-137-b` put them.

**Narrowing of P6, stated plainly.** P6 said that when `QE-136-a`'s trigger fires, "the contiguous pin is cut
then". That remedy is WITHDRAWN: a contiguous pin is exactly what § 1 measured as moving the gap. The rest of P6
stands. P6 and `…1708c558` stay as written (append-only); this note and P8 narrow them.

## 3. Where the chain stops: at `R5d`

**The rule** (for the `ADR-0011` guards and the drift tripwire that pins them): a new text pin is cut **only when
both** of these hold.
1. **Edit class.** The survivor rewrites bytes of a statement that IS the kill's operand or operator, or the
   definition they derive from. `R5` (operator), `R5b` (operands), `R5c` (definition) and `R5d` (the composer's
   operand and operator) all were.
2. **Finite closure.** One literal closes it without pinning `bindsAssembleFrame` or a comment block.

**Everything else is accepted under § 2's trigger and is never pinned:**
- **Insertion class:** a statement added while every pinned byte is kept (`XSPLICE`, the `-BETWEEN`/`-BEFORE`
  returns and splices, in-`it` shadows).
- **Rebinding class:** the name a pin calls is rebound (`QE-137-b`).

**Why the line is here.** Each edit-class pin closed its class, and QE's edit rows are all RED at head
(`…5400cc2b`). Each insertion-class pin only relocates the survivor (`…bec044c1` O3). The insertion class is
visible in `git diff` by construction, and QE reviews every ticket (`AGENTS.md` § QE validation authority). Review
is the control, and the trigger tells review where to look.

**Open edit-class survivors on these two guards: none on the record.** `Q-PREDICATE` is `AR-053-COMPOSER`'s and is
fenced. Anything beyond the measured rows is `UNKNOWN - verify` and is not claimed.

**When this stop rule is wrong (revisit trigger, owner Architect/Design).** The rule needs revisiting if an
insertion-class or rebinding-class weakening of either guard is ever found **merged**, meaning it passed a QE hop.
That would mean review failed as the control. The answer then is a behaviour witness that runs the guard against a
planted tree in the suite, not another text pin. That is a design question for that day.

## 4. Alternatives rejected
- **(b) alone.** See § 1.
- **(a) and (b) together.** The trigger is needed anyway for `A-RETURN-BEFORE` and `QE-140-b`, so (b) adds a hop for
  two spellings the trigger already covers.
- **A whole-`it` pin.** It freezes `AR-053-COMPOSER` option 1 and pins comments (P7).
- **A mutation-testing lane (e.g. Stryker) or an in-suite witness now.** That would be a new dependency or new
  machinery for a LOW residual with zero escapes on the record. It is gold plate today, and § 3's revisit trigger
  holds it.

## 5. `QE-140-c` (INFO): concur, no ticket
The fix rides the next hop that edits the clause 1 docblock. That hop's Engineer adds "for the spellings the
tripwire reads" to "makes that one root fail closed", and its QE checks it. This ruling takes no other action.

## 6. NFR and migration impact
- `NFR-002`: not triggered.
- `N8-LANE`: 0, since no test line changes.
- Catalog: not opened, because no target or row moves.
- `ADR-0029`: no edit. Its decision 2 and pointer are unchanged; the trigger only routes `bindsAssembleFrame` edits
  to its `AR-053-COMPOSER`.
- Zero `src/` lines.

## Follow-ups
- **QE (`qe-e2e`):** apply § 2's trigger on every hop that touches `src/history-pane.nfr.test.ts`. This is reading
  only.
- **Orchestrator:** close the `QE-140-a` hop as ruled. No ticket and no column move. **BA/PM:** nothing to cut.
- **Software Engineer, on the next hop that edits the clause 1 docblock:** `QE-140-c`'s wording (§ 5).
- **Architect/Design:** § 3's revisit trigger.
