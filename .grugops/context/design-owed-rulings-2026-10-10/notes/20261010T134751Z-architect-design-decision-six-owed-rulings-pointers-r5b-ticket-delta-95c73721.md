---
id: 20261010T134751Z-architect-design-decision-six-owed-rulings-pointers-r5b-ticket-delta-95c73721
kind: decision
by: architect-design
at: 2026-10-10T13:47:51Z
verified_by:
confidence: high
refs:
  - ADR-0011
  - ADR-0029
  - ADR-0030
  - ADR-0034
  - ADR-0035
  - ADR-0036
  - ABC-057
  - ABC-072
  - ABC-073
  - ABC-083
  - ABC-133
  - R4
  - R5
  - R5b
  - QE-057-a
  - QE-057-c
  - AR-053-COMPOSER
  - WGLYPH-DYN
  - N8-LANE
  - .grugops/queue/pending/design-owed-rulings-2026-10-10.md
  - 20261010T132239Z-orchestrator-observation-handoff-2-7d3e1b84
  - 20261010T133223Z-qe-e2e-observation-abc057-gap-register-a331f012
  - 20261010T131017Z-software-engineer-decision-abc057-equality-pinned-by-framed-literal-clause3-transcribed-composer-claim-narrowed-b4c2a298
  - 20261010T121614Z-security-nfr-decision-abc053-pass-with-risks-clause-d-resolved-composer-gap-low-to-abc054-order-info-accepted-8deff3d6
  - 20261010T121614Z-security-nfr-observation-abc053-child-runs-under-permission-model-composer-gap-full-lane-cost-031ms-91ac4dd3
  - 20261010T111342Z-ba-pm-decision-owner-adrs-folded-five-ready-abc131-cut-epic003-amended-41693c28
  - 20261010T134751Z-architect-design-observation-probe-readings-for-six-rulings-12a6a8a9
supersedes:
---

# Six owed rulings: ADR pointers written, `R5b` goes to a ticket, the turn loop's citation stands, ADR-0034 scope reads only loadable files, ADR-0035 `F` is keyed per set, and clause (b) is DELTA

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Branch:** `grugops/design-owed-rulings-2026-10-10`, from `37ca6ae2`.
- **Readings:** in `…12a6a8a9` and `probe/RUN.txt`.
- **Changed:** docs only, as `## Changed` lists.
- **Not touched:** `src/`, `plans/board.md`, `AGENTS.md`, every ticket status or column, and every
  DoR score.

## 1. `ADR-0011` `R4` pointer and `ADR-0029` pointer

**Ruling.**
- **`ADR-0011`.** A pointer block is added, `§ Pointers 2026-10-10`:
  - P1: clause 2 superseded in part;
  - P2: `R1` discharged;
  - P3: `R4` gains `WGLYPH-DYN` and the inline all-type sentence. The trigger has not fired: 0
    production `import(`.
- **`ADR-0029`, under decision 2.** The borrowed `ADR-0030` definition fails OPEN for this equality.
  Decision 2's "a second module that composes frames reds it" is read as *"by a static value import
  the tripwire reads"*.
  - **The definition is not widened now.** The reach is bounded by the pinned wiring line, there are
    0 such spellings, and `ABC-054` declined.
  - **Pre-ruled:** if `AR-053-COMPOSER`'s trigger fires, the fix is option 1 (count a re-export hop
    and `import("./frame.ts")`), with no new ADR.
- **`ADR-0030` `C2`.** One pointer line: "fails RED" holds only for an at-least-one claim.

**Recorded:**
- `ADR-0011` Status, the clause 2 heading, and `§ Pointers 2026-10-10`;
- `ADR-0029` Status, and the block under decision 2;
- `ADR-0030`, under its residual table.

**Follow-ups.** None owed. `AR-053-COMPOSER` keeps BA/PM as its owner, and its trigger is unchanged.

## 2. `QE-057-c`: what "receive one INJECTED" in `ADR-0011` clause 3 (i) means

**Ruling: it means the `GameHistory` VALUE, the data.**
- **What the sentence covers.** It names the two forms that make a runtime import unnecessary for a
  module that only READS a game. Neither form lets a module CALL `history.ts`.
- **QE's counterpoint, answered.** QE says the loop's operations could be injected the way
  `InputSeam`/`EngineSeam` are. They should not be:
  - In this repository a seam is a substitution point (`ADR-0015`).
  - The history operations are `ADR-0002` clause 4's single supplier.
  - An operations seam would create the place where a second supplier could be passed in. It moves
    an import edge and weakens the very property clause 3 holds.
  - `InputSeam`/`EngineSeam` have several suppliers by need. History has one, by rule.
- **So the citation stands as written.** It is the docblock at `src/history-pane.nfr.test.ts:227-232`.
  The ADR's (i) is clarified by a pointer and not reworded. **Both entries still pass. `A4` stays
  MET.**
- **What would falsify it:** a second legitimate supplier of history operations, such as replay or a
  network game.

**Recorded:** `ADR-0011` § Pointers P5, plus a pointer line inside clause 3's 2026-08-15 block.

**Follow-ups.** None. The docblock needs no edit.

## 3. `QE-057-a`: the operand half of `R5`

**Ruling: a TICKET, not an accepted risk.** It is registered as `ADR-0011` `R5b` (LOW,
pre-existing), owner Architect/Design.
- **Why.**
  - `R5`'s own argument applies: "the equality is the kill this clause buys" is only honest if
    something notices when the equality stops being one. Narrowing an operand stops it being one,
    just as weakening the operator does.
  - The fix is `XS` and test-only, so the UAT waiver applies.
  - The tripwire's comment *"a hop that widens the guard reds this test"* currently claims more than
    the tripwire pins.

**Disagreement with QE, stated.** QE wrote: "Closing (2) means touching clause 1's site, which
`ABC-029` bars." That is not so.
- `QSCAN-NARROW` edits the guard's **call** `const production = productionModulesIn(directory);`
  (the guard at `src/history-pane.nfr.test.ts:361`). It does not edit clause 1's expression at
  `:163-164`.
- A text pin **reads** that line and changes no expression, the same way `ABC-057`'s comparator pin
  does.
- So both halves can be closed in the existing drift-tripwire `it`.

**What the ticket must pin (BA/PM writes the page; the spelling is the Engineer's).**
- **The property:** in the licence guard, any gate-clean edit between `productionModulesIn(directory)`
  and the comparator that changes the scanned set or the importer set reds the drift tripwire. Two
  places to pin:
  1. the guard's `const production = productionModulesIn(directory);` line, framed together with the
     line after it so that it is unique; line `:621` has a similar call;
  2. the whole `const runtimeImporters = production.filter(…);` statement through its closing `);`.

  Both are framed literals with the leading newline and indent, as `ABC-057` `D1` requires, so that
  they cannot match themselves.
- **Kill ledger:**
  - RED on head: `QLHS-INTERSECT+FMT+WPERFT-STATIC` and `QSCAN-NARROW+FMT+WPERFT-STATIC`, both from
    `.grugops/context/qe-ABC-057/probe/plantqe057.py`, plus `M15` and `M15-SUB`;
  - green: `BASE`;
  - the three `A2` witnesses (`WLAUNDER`, `WPERFT-STATIC`, `WSTALELICENCE`) give the same reds as
    today.
- **The over-pin is accepted, as `ABC-057` test note 2 accepts it.** The `runtimeImporters` pin
  contains the regex literal, so a regex change reds two pins. That is acceptable: the regex pin's
  message already says to re-run the witnesses.
- **The comment.** Either make the tripwire's comment true or narrow it.
- **Fences:** 1 path, `src/history-pane.nfr.test.ts`. 0 production lines and 0 new files.
  `N8-LANE` has nothing in scope. **Never in parallel with any other hop on that file.**
- **Size and priority (BA/PM's call):** `XS`, `P3`. **Promote** if any hop edits the licence guard's
  statements.

**Recorded:** `ADR-0011` § Pointers P4 (`R5` operator half CLOSED by `ABC-057`; `R5b` registered).

**Follow-ups:**
- **BA/PM:** cut the `R5b` ticket. If it is not cut, `R5`'s trigger applies: the next hop that opens
  the file folds it in.

## 4. `ADR-0034`: does the `src/search*.ts` glob include test files?

**Ruling: there are two readings, one for each use of the list.**
- **The RUN trigger** is the owner's option B and stays **literal**. Test files trigger a run, which
  fails safe at ≤ 60 s. **Unchanged.**
- **Decision 2's SCOPE test** counts only matched files **the shipped engine can load**: not a
  `.test.ts`, and imported by a non-`.test.ts` module. Test-only fixtures
  (`search.mate-corpus.ts`, `evaluate.mirror-corpus.ts`) are excluded.
- **Measured:**
  - `ABC-082`'s merge reads `src/evaluate.ts` only, so it is drift-eligible. Read literally, every
    row would have been B.
  - The search-changing merges `ABC-121` and `ABC-079` stay all-B.

**Recorded:** `ADR-0034`, a Status line and a reading block under decision 2. The instrument is
`probe/adr0034-scope.sh`.

**Follow-ups:**
- **BA/PM:** `ABC-083`'s bullet "One reading for Architect/Design, not blocking" now reads
  "answered: `ADR-0034` reading 2026-10-10". It is one line.
- **QE:** at `ABC-083`'s review, run the scope command to decide whether D/L apply.

## 5. `ADR-0035` (proposed): a floor for files that spawn many children

**Ruling (proposal text only; still PROPOSED).** Decision 3's `F` is keyed **per narrow set**, from
that set's own admissible readings.
- **A set with no reading of its own:** a provisional `F` of **16 % of its base CPU**. That is the
  largest R ÷ CPU on record.
- **Why not a "child-heavy" class.** The record shows spread follows the set's CPU, not its child
  count. The one-child `history-pane.nfr` reads 5.2 %, against 8.5 % for child-free files.
- **Floors today:**
  - `src/cli.test.ts`: `F` = 1.097 s. A 650 ms timing bound there is refused at the cut. The count
    (`N8_SPAWN`), or the content timed in process, is the pin. `ABC-058` `A7` and `ABC-133` `A4`
    already work that way.
  - `src/history-pane.nfr.test.ts`: 0.058 s.
  - The `history-pane.nfr` + `render-seam.test` set: 0.038 s.

**Recorded:** `ADR-0035`, a Status line and an amendment block under decision 3.

**Follow-ups:**
- **Security/NFR:** apply this only if the owner accepts `ADR-0035`.
- **BA/PM:** none until then.

## 6. `ABC-072`/`ABC-073`: STATE or DELTA

**Ruling: DELTA**, in **`ADR-0036`, accepted by Architect/Design**.
- **Why this role accepts it.** `ABC-072` `A1` names this role. The owner's 2026-08-03 directive
  delegates. No level, promise or cost moves.
- **When (b) fires:**
  - (b1) the diff's added side holds a capability line in production executable code, including a
    line that is moved or changed in place;
  - (b2) a production file gains a value or bare import of a module that holds one.
- **Does not fire:** 0 production files touched, or a word hit only in a comment.
- **Baseline:** the tree's 0 / 3 / 0 is recorded as a baseline, not a trigger.
- **Accepted residual (LOW, Architect/Design):** a new call into an existing capability over an
  existing edge does not fire. **Trigger:** a fourth production file holds a limb in code.
- **`A5` answered:** (b) did NOT fire on `ABC-065`. **Not re-opened.**

**Recorded:**
- `ADR-0036`;
- the design sections of the `ABC-072` and `ABC-073` pages (pointer only; DoR, size, priority and
  column untouched).

**Follow-ups:**
- **BA/PM:**
  - re-score `ABC-072` item 10, which `A1` now meets;
  - re-measure `ABC-073`'s live set (`ABC-055`, `ABC-059` at `37ca6ae2`). Consider folding it into
    `ABC-072`'s hop, as the page itself allows.
- **Architect/Design** (`ABC-072`'s hop, pulled by the Orchestrator): `A2`–`A5`.
- **Security/NFR, at `ABC-072`'s gate:** confirm the limb list (it is a security bar). An open
  question: should limb 2 be the bare identifier `process` (catching `const p = process`)?
- **Orchestrator:** route on (b1)/(b2) and cite `ADR-0036`.

## Owner questions (Olger Oeselg)

1. **`ADR-0036`: veto or let it stand?** Recommendation: **let it stand (DELTA).**
   - **STATE would mean:** every ticket goes through `In Security/NFR` for as long as `cli.ts`,
     `glyph-mode.ts` and `perft-bench.ts` read `process.`.
   - **DELTA means:** only diffs that add, change or newly reach a capability go there. This is how
     the board has routed since August.
2. **`ADR-0035`:** acceptance is still open, as before. The amendment does not change the question.
   It changes only how the floor that bounds per-ticket timing lines is read. The recommendation is
   unchanged.

## Changed (docs only)

- `memory-bank/50-decisions/ADR-0011-…md`: the Status paragraph, two pointer lines, and
  `§ Pointers 2026-10-10`.
- `memory-bank/50-decisions/ADR-0029-…md`: a Status paragraph and the pointer block under decision
  2.
- `memory-bank/50-decisions/ADR-0030-…md`: a pointer under `C2`.
- `memory-bank/50-decisions/ADR-0034-…md`: a Status line and the reading block under decision 2.
- `memory-bank/50-decisions/ADR-0035-…md`: a Status line and the amendment under decision 3.
  **Still proposed.**
- `memory-bank/50-decisions/ADR-0036-…md`: **new, accepted.**
- `plans/tickets/ABC-072-…md` and `ABC-073-…md`: a `## Design` section each.
- The notes and `probe/`; one trace row at the end of `plans/traceability.md`.
