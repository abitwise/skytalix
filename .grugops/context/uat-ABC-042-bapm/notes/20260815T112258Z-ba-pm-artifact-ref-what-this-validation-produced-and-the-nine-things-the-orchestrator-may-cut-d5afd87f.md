---
id: 20260815T112258Z-ba-pm-artifact-ref-what-this-validation-produced-and-the-nine-things-the-orchestrator-may-cut-d5afd87f
kind: artifact-ref
by: ba-pm
at: 2026-08-15T11:22:58Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - AGENTS.md
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - agent-factory/workflows/06-uat-pack.md
  - .grugops/context/uat-ABC-042-pack/notes/
  - 20260815T111936Z-ba-pm-decision-the-pack-covers-the-value-and-here-are-the-nine-gaps-it-covers-it-with-c0a73da0
  - 20260815T112041Z-ba-pm-observation-does-section-seven-stop-a-reader-concluding-the-chess-game-works-mostly-a6615fae
  - 20260815T112136Z-ba-pm-observation-the-corrected-uat6-scenario-ruled-sound-not-weakened-with-one-narrow-loss-fca3368c
  - 20260815T112213Z-ba-pm-observation-which-uncriterioned-behaviours-the-owner-must-see-before-signing-and-which-are-noise-30fd0a87
supersedes: 
---

# What this validation produced, what it deliberately did not, and what the Orchestrator may cut

## The notes

| note | kind | what it is |
|---|---|---|
| `…111936Z-…-c0a73da0` | `decision` | **The verdict.** Value traced `V1`–`V4`, criteria traced `A1`–`A12`, the `## Scope` argv table traced row by row, and the nine gaps `B1`–`B8` |
| `…112041Z-…-a6615fae` | `observation` | § 7 (limitations) and § 9 (signoff checklist) judged as business artifacts — including the point-by-point test of the pack's "made executable rather than prose" claim |
| `…112136Z-…-fca3368c` | `observation` | The ruling on the scenario corrected mid-run (UAT-6) |
| `…112213Z-…-30fd0a87` | `observation` | The uncriterioned behaviours split into four the owner must see and five that are record-only |

## The verdict in one line

**The pack covers the user value and the scope `ABC-042` was cut for, with nine named gaps. Not
materially deficient.** The gaps are in the pack as a business artifact and in two thin patches of
criterion coverage; none of them is a hole in the value.

## What this hop deliberately did NOT do

- **It did not sign off and recorded no human acceptance signature.** No box in the pack's § 9 is
  ticked by this hop. `ABC-042`'s UAT state after this note is *pack built, run by an agent, validated
  for business coverage, **NOT accepted***.
- **No `finding` kind and no `verified_by` stamp.** `context.human_admission` is `off`; the note kinds
  used are `decision` / `observation` / `artifact-ref`, hand-authored per
  `agent-factory/contracts/context-note.md`.
- **It did not edit the pack.** Nothing under `.grugops/context/uat-ABC-042-pack/` was touched. Every
  gap is recorded here and returned.
- **It did not cut a ticket.** The recommendations below are recommendations. **The Orchestrator
  cuts.**
- **No board row, no traceability row, no metrics row, no ticket page, no `AGENTS.md`, no
  `memory-bank/`, no `src/`.** This hop wrote only this notes folder and its own queue records, on
  `grugops/uat-ABC-042-bapm` in a private worktree, so the shared worktree's `HEAD` never moved.

## Recommended to the Orchestrator — nine, none cut here

**Group 1 — pack amendments (UAT Planner, one hop, no product change). These are the ones that should
land before the owner is asked to sign.**

1. **Add a scenario for the twelve blank move-list rows** (gap `B7`). Group F's missing fourth
   scenario, and the cheapest of the nine. The signer will see a third of the frame empty; nothing
   currently tells him that is correct.
2. **Add a seventeen-row outcome table to § 9** (gap `B8`). § 10's exit criterion 1 demands a recorded
   outcome for every scenario and § 9 provides nowhere to record one. Also gives UAT-12 and UAT-14
   their missing checklist rows.
3. **Fix § 7's lead-in sentence** (gap `B5`). *"each one is checkable by UAT-15 / UAT-16"* is true for
   three of nine points, and § 6 and the artifact-ref note already state the number correctly. One
   sentence.
4. **Add the "zero of four" sentence about `EPIC-006`** (gap `B6`). § 7 names criteria #1 and #4 as
   unmet and is silent that #2 (`undo`) and #3 (the result screen) are also unmet, from which a reader
   can infer they are met. **`ABC-042` meets zero of `EPIC-006`'s four acceptance criteria** and
   nothing on file says so.
5. **Give UAT-13 a method a non-engineer can execute, or reassign it** (gap `B2`). As written it
   demands a timed median with no instrument named, in a pack for a reader who *"will not be given a
   translator."* § 9's item 7 (*"appeared in well under a second"*) is better calibrated than the
   scenario; the scenario should move to the checklist's bar, or be marked *preparer-run,
   signer-witnessed*.
6. **Add the ten-more-runs clause to UAT-6** (gap `B3`) and **widen the corrected clause to the whole
   23-row frame** (the narrow loss ruled in this folder). Two phrases: the first removes a ~1-in-512
   false FAIL against correct software; the second restores the one frame region the mid-run correction
   over-narrowed away.

**Group 2 — a documentation defect, and it is not the pack's.**

7. **`AGENTS.md` § Commands, `Dev / run`, never shows the `--` separator** (gap `B4`, behaviour `M1`).
   The line prints `npm run chess` and names `--colour white|black|random`, `--ascii`, `--unicode`
   inside an HTML comment with no invocation form. A reader who combines them types
   `npm run chess --ascii` and gets **a board, exit `0`, and his option silently discarded** — measured
   by the pack's own run. **This lands on `V2`, the second half of the value `ABC-042` claims**, and it
   makes UAT-14's PASS generous. **I did not touch `AGENTS.md`** (out of this hop's fences and the file
   is under the owner's hand). Recommend a one-line documentation fix showing
   `npm run chess -- --colour black`.

**Group 3 — product follow-ups, neither a defect against `ABC-042`.**

8. **A real `--help` that exits `0`** (behaviour `M4`). Explicitly out of `ABC-042`'s scope, so not a
   defect — but a person's first instinct on an unfamiliar command is `--help` and what they get is a
   refusal that happens to contain the help they wanted. Candidate for `EPIC-006`; the Orchestrator's
   call whether it is cut now or folded into `ABC-043`.
9. **Record "repeated option, last one wins" as an open convention decision on `ABC-043`**, not as its
   own ticket (behaviour `R1`). It fell out of the resolver walking arguments in order rather than
   being chosen, and it should be a deliberate choice before a second ticket depends on it.

**Recorded against `EPIC-006` rather than ticketed:** Node 22 is untested (`R3`) and non-`Terminal`
terminals are untested (`R4`). Both are inert while the product runs on one machine and become real
when distribution is decided.

## What is still owed before `ABC-042` can be called accepted

1. **QE/E2E** (`uat-ABC-042-qe`, phase 2, parallel with this hop) — do the automated tests back the
   seventeen scenarios, and what gaps remain. **Not read by this hop; nothing was relayed either way.**
2. **Olger Oeselg** — execute or witness the scenarios and sign, **items 8 to 11 included**.
3. **The Orchestrator** — the board's UAT cell, `plans/traceability.md`, `plans/metrics.md`, and the
   disposition of the nine recommendations above.

**This validation discharges nothing for the other twenty-seven `Done` tickets**, which remain *UAT
deferred → `EPIC-006`, explicitly NOT passed*.
