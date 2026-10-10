---
id: 20261010T141426Z-ba-pm-decision-five-followups-abc136-cut-abc072-ready-abc073-folds-qe059-no-ticket-abc087-a2-e6707fd9
kind: decision
by: ba-pm
at: 2026-10-10T14:14:26Z
verified_by:
confidence: high
refs:
  - ADR-0011
  - R5
  - R5b
  - QE-057-a
  - ABC-136
  - ABC-134
  - ABC-030
  - ABC-133
  - ABC-135
  - ADR-0036
  - ABC-072
  - ABC-073
  - ABC-055
  - ABC-053
  - ADR-0034
  - ABC-083
  - ABC-059
  - QE-059-a
  - QE-059-b
  - QE-059-c
  - QE-059-d
  - QE-059-e
  - ABC-087
  - RR-LEVEL1-REALCLOCK
  - NFR-004
  - EPIC-006
  - ABC-101
  - ABC-085
  - plans/tickets/ABC-136-licence-guard-operands-are-unpinned.md
  - plans/tickets/ABC-134-frame-path-probe-prose-claims-more-reach-than-it-has.md
  - plans/tickets/ABC-072-abc041-clause-b-is-a-state-predicate-with-a-one-limb-instrument.md
  - plans/tickets/ABC-073-clause-b-misreading-has-propagated-to-eight-ticket-pages.md
  - plans/tickets/ABC-083-evaluation-king-safety-and-mobility.md
  - .grugops/queue/pending/bapm-followups-2026-10-10.md
  - .grugops/context/design-owed-rulings-2026-10-10/notes/20261010T134751Z-architect-design-decision-six-owed-rulings-pointers-r5b-ticket-delta-95c73721.md
  - .grugops/context/qe-ABC-057/notes/20261010T133223Z-qe-e2e-observation-abc057-gap-register-a331f012.md
  - .grugops/context/qe-ABC-059/notes/20261010T134345Z-qe-e2e-observation-abc059-gap-register-80ff0753.md
  - .grugops/context/scribe-command-log-2026-10-10/notes/20261010T140110Z-agents-md-scribe-decision-agents-md-headroom-proposal-a023cfcd.md
  - grugops/ABC-087-difficulty-levels:.grugops/context/secnfr-ABC-087/notes/20261010T130030Z-security-nfr-decision-abc087-pass-with-risks-nfr004-ruled-per-move-played-ar-nfr004-a-reaccepted-clamp-pin-owed-3f1974f5.md
  - 20261010T141426Z-ba-pm-observation-followups-readings-at-71418879-e0e21bed
  - .grugops/context/bapm-followups-2026-10-10/probe/RUN.txt
supersedes:
---

# BA/PM follow-ups: `ABC-136` cut (`R5b`, sequenced before `ABC-134`); `ABC-072` re-scored 10/10; `ABC-073` folds into `ABC-072`'s hop; `ABC-083` pointer written; `QE-059-a/b/c` get no ticket; `ABC-087` `A2` should say "on the injected clock"

This note is hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- **Branch:** `grugops/bapm-followups-2026-10-10`, from wave tip `71418879`.
- **Readings:** the observation `…e0e21bed`, and `probe/RUN.txt`. Every premise was re-measured at
  the tip before it was used.
- **Not touched:** `src/`, `plans/board.md`, ADRs, `AGENTS.md`, and any existing ticket's `column:`.
  Also untouched: the pages of `ABC-087`, `ABC-133` and `ABC-135`.

## 1. `ADR-0011` `R5b` → **cut `ABC-136`** (XS, P3, DoR 10/10). **SEQUENCE with `ABC-134`: `ABC-136` first**

- **The premise holds at the tip.** `src/history-pane.nfr.test.ts` is byte-identical to QE's
  `00aad4da`. On QE's own planter:
  - `QSCAN-NARROW` and `QLHS-INTERSECT` are both **12/12 green**, with or without `WPERFT-STATIC`;
  - `WPERFT-STATIC` alone is red, and so are `M15`/`M15SUB`.
- **The page follows the Architect's spec in `…95c73721` § 3:** two framed pins, the kill ledger,
  the accepted over-pin, a one-path fence, and the promote trigger.
- **One choice was BA/PM's: the comment is NARROWED, not made true.** A text pin cannot make "a hop
  that widens the guard reds this test" true: QE's `QMOVE-COMMENTED-M15` survives the operator pin
  today. So `A4` requires the phrase to read 0 and the comment to state its reach.
- **Fold or sequence: SEQUENCE.** Both pages say so.
  - `ABC-134`'s `A5` is comment-only by contract, and `ABC-136` adds executable pins proven by a
    mutant ledger. Folding them would break the first ticket's cleanest criterion to save one QE
    hop.
  - **Why `ABC-136` first.** `R5`'s trigger is "the next hop that opens the file", and the kill is
    worth more than the narration.
  - **The order serves the file; it is not a blocker.** If `ABC-134` is already pulled when
    `ABC-136` reaches `Ready`, `ABC-134` finishes first.
  - `ABC-134`'s DoR stays 10/10 (`ABC-083`/`ABC-131` precedent).
- **Parallel work.** `ABC-136` is disjoint from `ABC-133` (`src/cli.test.ts`) and `ABC-135`
  (`src/render-seam.test.ts`). No unmerged branch touches its file.

## 2. `ABC-072` → **DoR 10/10, MET → `Ready`**; `ABC-073` → **FOLD into `ABC-072`'s hop** (DoR 10/10 as a fold)

- **`ABC-072`.**
  - **Re-score.** `A1` is met by `ADR-0036`, so item 10 clears.
  - **`A3` gains three DELTA fixtures** with known answers: `dbaf972f` fires; `34c9c026` and
    `4c33b72b` do not.
  - **`A6` allows the fold's paths.**
  - **Size and priority are unchanged** (`S`, `P2`). `A3`'s commands are what make the
    Orchestrator's (b1)/(b2) routing reproducible. The pull goes to Architect/Design.
- **`ABC-073`: the live set is ONE page, `ABC-055`.** `ABC-053`, `054`, `057`, `058` and `059` are
  `Done`. This confirms the Architect's reading.
  - **`A4` is void:** `ABC-053` is merged.
  - **`A1` had a latent defect, repaired.** Its "unruled grep returns 0 pages" could never pass,
    because three `Done` pages carry that text permanently. It now counts non-`Done` pages.
  - **Fold, not discharge.** The page itself allows the fold. Discharging the ticket without a hop
    would be a drop, and this board drops only on the owner's word.
  - If `ABC-055` merges first, the set is 0 and the ticket closes on that measurement.

## 3. `ABC-083` pointer → **written**

- **What was added:** one appended line on the "One reading for Architect/Design" bullet (§
  Dependencies), "Answered: `ADR-0034` reading 2026-10-10", plus the QE instruction.
- **Unchanged:** DoR, size, priority and column.

## 4. `QE-059-a/b/c` → **no ticket, no fold.** `QE-059-e` → **note only**

`ABC-059` is `Done`, and its page is gated. None of the three fails a criterion. Each one is a limit
of the wording `A1` chose. Closing any of them changes a contract in `src/cli.test.ts`, the file
`ABC-133` is building in now.
- **`QE-059-a` (early terminators hide a claim).** **Disposed: no ticket.**
  - **Why.** It needs a false `Dev / run` claim written after an abbreviation, a question or a
    sentence break. Nothing in the tree is in that shape, and the only writer of that slot is the
    Scribe.
  - **Re-open trigger:** a Scribe or ticket edit that puts `e.g. ` / `i.e. ` / `vs. ` / `?` between
    `Dev / run` and a command claim. Owner: BA/PM.
- **`QE-059-b` (three pinned spellings).** **Disposed: no ticket.**
  - **Why.** The defect-class rule is the owner's, through the Factory Coach, and the Orchestrator
    has declined it. `ABC-059` § Out of scope excludes the class.
  - **Re-open trigger:** `AGENTS.md` adopts a variant spelling, such as `Dev/run` or an en-dash
    `UNKNOWN – verify`.
- **`QE-059-c` (a correct file can red).** **Disposed: no ticket.** It fails loud, which is the safe
  direction.
  - **(1) is not live.** The Scribe's headroom proposal (`…a023cfcd`) cuts nothing in or near the
    `Dev / run` slot.
  - **For the Scribe, at any edit of that slot comment:** keep a `. ` before the first list break,
    or the span runs into `npm run perft` and reds `ABC-059`, `ABC-065` `A1` and `ABC-065` `A3`.
  - **(2) waits for its own case.** It applies only if someone writes a contrastive sentence that
    names another script.
- **`QE-059-d` (INFO):** none, as QE graded it.
- **`QE-059-e` (INFO), confirmed at the tip:**
  - `.grugops/context/ticket-to-pr-ABC-059/probe/x` is 0 bytes and is not indexed;
  - `RUN.txt:9` indexes `timing-set{1,2}.log`, which were never committed (the `.tsv` files are);
  - owner: the Software Engineer, at the next touch of that directory. **Not edited here:** it is
    another task's record, and this is a note-only item.

## 5. `RR-LEVEL1-REALCLOCK` → **yes: `A2` should say "on the injected clock"**, and on `ABC-087`'s branch, not on the wave

- **Why.** `A2`'s words are "the wall clock used matches that level's budget within ±20%". Test note
  3 binds that to the injected clock, and every gate measured it there:
  - the Engineer: 101.3 / 100;
  - QE;
  - Security/NFR ruling 8, which reads "`A2` MET as test note 3 defines it".
- **On the real clock the words are false at level 1.** Blunder moves: median 101 ms, p90 164, max
  498–589 ms. **17.9 %** exceed +20 %, because depth 1 is unabortable and the virtual clock does not
  charge it.
- **What the change is.** It changes no verdict and no measurement; it makes the criterion say what
  was gated. The "no level ever exceeds 5 s" clause stays a real-clock clause (`NFR-004`; `A5`
  measured it on the real clock).
- **Proposed text (the Orchestrator routes it):** "…**then** the elapsed time on the **injected
  clock** (`ABC-086`'s virtual-clock module) matches that level's budget within **±20%**, and no
  level ever exceeds 5 s on the real clock (`NFR-004`; `A5`)…".
  - **Where:** a one-line page commit on `grugops/ABC-087-difficulty-levels`, before the owner is
    asked.
  - **If the Orchestrator would rather not touch a gated branch:** the owner's question carries the
    same qualifier verbatim instead.
- **Does it change what the owner is asked to accept? The wording, yes. The decision, no.**
  - **The question as it would stand today:** "`A2` MET: level budgets within ±20%". An owner can
    fairly read that as a promise about real thinking time.
  - **The honest question:** "`A2` MET on the injected clock. On the real clock, level 1's blunder
    moves overshoot by up to ~5x (≤ 589 ms), and no NFR is touched."
  - **No live exposure.** No production file imports `levels.ts` (`src/cli.ts:175`), so no user can
    meet a level today.
  - **If the owner wants budget fidelity on the real clock,** that is a NEW criterion for the hop
    that wires levels to the user (`EPIC-006`/`ABC-101`). It is not a defect in `ABC-087`.
    Delivering it would need an abortable depth 1, which is an engine change that `ABC-087` `A8`
    forbids.
- **Forward note, unchanged:** `ABC-085` times its ladder on the real clock only with ruling 8 in
  view (Security/NFR's note).

## New tickets

| id | title (short) | size | priority | DoR | board |
|---|---|---|---|---|---|
| `ABC-136` | pin the licence guard's scanned set and importer set (`R5b`) | `XS` | `P3` (→ that ticket's priority if a ticket edits the guard's statements) | **10/10** | → `Ready` (the Orchestrator's move) |

## Board moves recommended (the Orchestrator's; `plans/board.md` NOT edited)

- `ABC-136` (new): → `Ready`. Ready goes from 5/8 to 6/8.
- `ABC-072`: `Backlog` → `Ready` (10/10). The pull goes to Architect/Design.
- `ABC-073`: rides `ABC-072`'s pull as a fold. It does not take its own `Ready` slot.
- `ABC-134`'s board row: replace "fold-in or sequence decided at pull" with "after `ABC-136`
  (sequence)".
- `ABC-083`'s row: "Architect reading question … (non-blocking)" is answered.

## Owner questions (Olger Oeselg)

1. **`ABC-087` `A2`.** Do you accept `A2` as "±20% on the injected clock", with level 1 overshooting
   by up to ~5x on the real clock (≤ 589 ms; no NFR touched)? Or do you want real-clock budget
   fidelity as a criterion when levels reach a user (`EPIC-006`/`ABC-101`)?
   - **Recommendation:** accept as worded on the injected clock. Real-clock fidelity at 100 ms needs
     an engine change, and no user can reach a level today.
2. **No new question on `ADR-0036`.** The Architect's veto question stands as asked in `…95c73721`.
   `ABC-072`'s readiness does not depend on the answer.
