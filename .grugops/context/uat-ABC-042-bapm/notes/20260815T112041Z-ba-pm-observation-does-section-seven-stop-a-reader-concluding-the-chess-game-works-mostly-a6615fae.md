---
id: 20260815T112041Z-ba-pm-observation-does-section-seven-stop-a-reader-concluding-the-chess-game-works-mostly-a6615fae
kind: observation
by: ba-pm
at: 2026-08-15T11:20:41Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - agent-factory/checklists/uat-checklist.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T110533Z-uat-planner-decision-the-abc042-uat-pack-seventeen-scenarios-a-non-engineer-can-run-and-judge-f43cd04c.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T111100Z-uat-planner-observation-six-facts-the-run-turned-up-that-no-criterion-asks-about-99da7613.md
supersedes: 
---

# The limitations (§ 7) and the signoff checklist (§ 9), judged as business artifacts

The ticket's own framing is the bar: *"**This is the honest version of "it runs", and compressing it
into "it works" is the failure this section prevents.**"* I judged § 7 and § 9 against that sentence,
not against whether they read well.

## § 7 — does it stop a reader concluding "the chess game works"?

**YES, and it is the strongest limitations section I have read in this repository.** Four things do
the work, and all four survive a hostile reading:

1. **The headline is the first line and it is unmissable** — *"IT PRINTS A BOARD. IT DOES NOT PLAY A
   GAME."* — followed by *"A signature on this pack is a signature on a picture of a chess board, not
   on a chess program."* That second sentence converts the limitation into a statement about **what
   the reader's own signature means**, which is the form a signer cannot skim past.
2. **It supplies its own one-sentence summary**, pre-empting the summariser: *"the board draws
   correctly; the game does not exist yet."* This matters more than it looks. The run note's headline
   is *"17 written · 17 run · 17 passed"* — the exact string that produces "it works" if it is relayed
   alone — and § 7 pre-loads the correct replacement.
3. **Group F makes three of the nine limitations executable**, so the owner does not take them on
   trust.
4. **Checklist items 8–11 put the limitations inside the signature itself**, and item 8 is flagged as
   the one that matters.

**Four weaknesses, and two of them are real:**

- **`B5` — § 7's lead-in overclaims which limitations are executable, and the pack contradicts
  itself.** § 7 says *"Concretely, and each one is checkable by UAT-15 / UAT-16"* and then lists
  **nine** points. Checked one by one, that sentence is **true for three and false for six**:

  | § 7 point | executable? | by what |
  |---|---|---|
  | 1 you cannot make a move | **YES** | UAT-15 + UAT-16 |
  | 2 there is no opponent / no engine | **NO** | nothing in the pack demonstrates the absence of an engine; six refused words is not the same claim |
  | 3 the position never changes | **WEAKLY** | UAT-3 + UAT-15; vacuous anyway, since there is no session in which it could change |
  | 4 the move-list and status areas are empty placeholders | **NO** | and this is gap `B7` below |
  | 5 no `undo` / `resign` / `new` / `quit` | **YES** | UAT-16 tests exactly those four |
  | 6 no difficulty; `EPIC-006` #4 NOT met | **YES, but by UAT-10(a)**, not by UAT-15/16 as claimed |
  | 7 nothing installed or published; `EPIC-006` #1 NOT met | **YES, but by UAT-17**, not by UAT-15/16 |
  | 8 nothing is deployed | **NO**, and not executable in principle — correctly an assertion |
  | 9 this accepts `ABC-042` alone | **NO**, correctly — it is a scope statement |

  **The pack states the number correctly in two other places** (§ 6 Group F's header says *"These
  three scenarios"*; the artifact-ref note says *"turns three of them into commands"*), so this is a
  loose lead-in sentence rather than a dishonest claim. **It is still the one sentence in the pack a
  reader could quote to overstate the evidence, and it sits in the section whose entire job is
  preventing an overstatement.** One sentence fixes it.

- **`B6` — § 7 names two of `EPIC-006`'s four acceptance criteria as unmet and is silent that the
  other two are also unmet.** § 7 points 6 and 7 call out criterion #4 (`--difficulty 3`) and
  criterion #1 (`npx <package>`). The epic has **four** acceptance criteria, and `ABC-042` meets
  **zero** of them:

  | `EPIC-006` acceptance criterion | met by `ABC-042`? | named in § 7? |
  |---|---|---|
  | #1 `npx <package>` starts a playable game, no install step | **NO** | **yes**, point 7 |
  | #2 `undo` returns the position two plies back, one command | **NO** — no `undo`, no engine reply to take back | no — point 5 covers the behaviour, but not that it is an **epic criterion** |
  | #3 any of the eight terminal conditions names its reason, exits `0` | **NO** — no game end exists | no — point 3 brushes it |
  | #4 `--colour black --difficulty 3`, no prompts, engine opens as white | **NO** | **yes**, point 6 |

  **A reader who sees exactly two criteria flagged can reasonably infer the other two are met.** The
  pack faithfully mirrors the ticket — the ticket's `## Out of scope` also names only #1 and #4,
  because those are the ones it fences — so this is inherited, not invented. **But the sentence the
  owner needs before signing is "`ABC-042` meets zero of `EPIC-006`'s four acceptance criteria", and
  nothing on file says it.** This is the sharpest business gap I found, precisely because the section
  it sits in exists to prevent an over-read.

- **`B7` — the most visible limitation in front of the signer has no scenario.** § 7 point 4 is *"the
  move-list and status areas below the board are empty placeholders … they will stay blank forever in
  this version."* The pack's own observation note calls the twelve blank rows *"the most visible piece
  of evidence in front of a signer that something is meant to go there and does not yet."* **No
  scenario asks the tester to look at them.** UAT-1's Expect names the ranks, the file letters, the
  status line and the prompt returning; it does not name the twelve blank rows. The signer will stare
  at a third of the frame being empty with nothing in the pack telling him that is correct. **This
  should have been Group F's fourth scenario** and it is the cheapest of all nine gaps to close.

- **Ordering (named, not counted as a defect).** § 7 comes **after** the seventeen scenarios, so a
  reader going top to bottom meets seventeen PASSes before the limitations. The pack mitigates this
  with a bold instruction in its own preamble (*"Read § 'What this product does NOT do' before § 'The
  scenarios'"*) and § 2 points forward to it. **A mitigation by instruction is weaker than a
  mitigation by layout**, but the instruction is prominent and repeated, so I do not score this as a
  gap.

## § 9 — does it name the human, and can a non-engineer sign it?

**It names the human, unambiguously and un-delegated.** *"Olger Oeselg, project owner"* appears in
§ 4 with *"His is the only signature this pack recognises"* and again in § 9's heading. § 4 separately
records that the agent run is *"evidence offered to the signer, not the signature"*. **`signoff
person/role known` is discharged properly**, and § 9's own preface — *"No agent may tick these boxes,
and none has"* — is accurate: I checked all twelve, all are `☐`.

**Signable by a non-engineer? Yes for eleven of twelve rows, with three named frictions.**

The language passes: no row uses a code identifier, a file path, an exit code or a criterion id. Rows
8–11 are written as first-person comprehension statements, which is the right instrument for a
limitation — a signer can honestly refuse to tick *"I understand no move can be made"* in a way he
cannot honestly refuse to tick a technical box he does not follow.

- **`B8` — § 9 provides no form in which § 10's exit criterion 1 can be discharged.** Exit criterion 1
  requires *"all seventeen scenarios have a recorded outcome — pass, fail, or not run with a reason.
  No scenario is left blank."* § 9 is **twelve attestation rows with one `Initial / date` column and
  no per-scenario outcome column**. There is nowhere for the human to record seventeen outcomes. The
  agent's run note has a seventeen-row table, but that is the agent's run, offered as evidence — **it
  is explicitly not the signer's, so it cannot discharge the signer's exit criterion.** As written,
  § 10 item 1 cannot be satisfied by completing § 9. A seventeen-row outcome table appended to § 9
  closes it.
- **Two of seventeen scenarios have no checklist row at all** — UAT-12 (the hostile argument) and
  UAT-14 (the documentation matches the product). Item 1 (*"I ran … UAT-1 to UAT-17"*) covers them
  generically. Minor, and it folds into `B8`'s fix.
- **The friction that actually blocks a non-engineer is UAT-13, not § 9** — see gap `B2` in this
  folder's decision note. § 9 item 7 reads *"The board appeared in well under a second"*, which a
  human **can** judge by feel; the scenario behind it demands a timed median he has no method for.
  **The checklist row is better calibrated to the signer than the scenario it summarises.** If one of
  the two moves, move the scenario.
- **`echo $?` and the `$(printf 'CLEARME\033[2JEND')` argument are the only two pieces of shell
  literacy the pack demands.** Both are explained in § 5 in plain words, and both are
  copy-pasteable exactly as printed. **I judge this acceptable** — the alternative is a pack that
  cannot test exit codes or terminal safety at all.
