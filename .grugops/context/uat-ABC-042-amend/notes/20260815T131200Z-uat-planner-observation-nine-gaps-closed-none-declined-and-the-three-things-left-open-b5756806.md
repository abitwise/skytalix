---
id: 20260815T131200Z-uat-planner-observation-nine-gaps-closed-none-declined-and-the-three-things-left-open-b5756806
kind: observation
by: uat-planner
at: 2026-08-15T13:12:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - AGENTS.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - .grugops/context/uat-ABC-042-bapm/notes/
  - .grugops/context/uat-ABC-042-qe/notes/
  - 20260815T131000Z-uat-planner-decision-the-amended-abc042-uat-pack-nineteen-scenarios-and-zero-of-epic006s-four-ad75b356
  - 20260815T130800Z-uat-planner-observation-the-amendment-run-two-new-scenarios-executed-and-four-facts-re-measured-a2c53294
supersedes: 
---

# Gap by gap — all nine CLOSED, none declined, and the three things I am leaving open for the Orchestrator

**I wrote the pack; BA/PM read it independently and returned nine gaps; QE returned a coverage map.
This note says what happened to each one, in one row, so the Orchestrator does not have to diff two
versions of a long document.** The repairs themselves are in the amended pack
(`20260815T131000Z-…-ad75b356`), which `supersedes` the original.

## 1. BA/PM's nine — all closed

| gap | the defect, in BA/PM's words | CLOSED how | where in the amended pack |
|---|---|---|---|
| **`B1`** | *"`A7`'s piped half has no scenario"* — no PASS/FAIL line for *"stdout is a pipe and no flags → zero code points above `U+007F`"* | **New scenario UAT-19** — save the board to a file, open it, the pieces are plain letters and no chess figure appears. **Written and RUN** (exit `0`; 0 figures; 0 bytes above `U+007F`; all twelve piece letters present) | § 6 Group C |
| **`B2`** | *"UAT-13 cannot be executed by the reader it is written for"* — a timed median with no instrument named | **UAT-13 split.** The signer's test is by feel (*"back before you could finish saying 'one thousand'"*, which is § 9 item 7's own calibration); the timed median is marked **preparer-run, signer-witnessed**, its exact one-line command is printed, and that command **was executed** — ten readings, median **0.16 s** against a 1.00 s bar | § 6 Group E |
| **`B3`** | *"UAT-6 will FAIL correct software about once in 512 runs"* | **The ten-more-runs clause added, in BA/PM's own shape:** if all ten come up one side, run ten more; record FAIL only if twenty produce a single side | § 6 Group B |
| **`B4`** | *"UAT-14 passes on a generous reading of `AGENTS.md` and fails on the literal one"* — the file never shows the `--` separator | **UAT-14 rewritten.** The PASS is kept on the documented **command** (BA/PM did not overturn it and neither do I); the documented **options** now carry a named **DOCUMENTATION DEFECT** against `AGENTS.md`, marked *not a product fault, do not record a FAIL*, and § 10 says explicitly that it does not hold the ticket. **`AGENTS.md` was not edited** — it is outside this hop's fences and under the owner's hand | § 6 Group E, § 10 |
| **`B5`** | *"§ 7's lead-in overclaims which limitations are executable"* — *"each one is checkable by UAT-15 / UAT-16"* is true for three of nine | **The lead-in is replaced by a nine-row table**, each row saying whether you can check it and with which scenario. **BA/PM's grading is adopted unchanged**; the count is now **five of nine**, because `B7`'s new scenario makes point 4 checkable | § 7 |
| **`B6`** | *"§ 7 names two of `EPIC-006`'s four acceptance criteria as unmet and is silent that the other two are also unmet"* | **A four-row table naming all four criteria, all NOT met, each with the reason and the scenario that shows it**, under the heading **"`ABC-042` meets ZERO of `EPIC-006`'s FOUR acceptance criteria"** — plus a new signoff item 12 (*"I have seen that…"*). The section also records that criteria #2 and #3 are named on no ticket page | § 7, § 9 item 12 |
| **`B7`** | *"the most visible limitation in front of the signer has no scenario"* — the twelve blank move-list rows | **New scenario UAT-18**, placed in Group F as BA/PM said it should have been. **Written and RUN**: 23-row frame, **12 rows below the status lines, zero non-space characters in any of them**, identical on a pipe and under a real terminal | § 6 Group F, § 7 point 4 |
| **`B8`** | *"§ 9 provides no form in which § 10's exit criterion 1 can be discharged"* — **the floor** | **§ 9b added: a nineteen-row outcome table** with an outcome cell and an initial cell per scenario, and the instruction *"a blank row is not a pass"*. Exit criterion 1 now reads *"written into the § 9b table"* and says in terms that it is dischargeable by completing § 9. **UAT-12 and UAT-14, which had no checklist row at all, now have one, and so do UAT-18 and UAT-19** | § 9b, § 10 item 1 |
| **the UAT-6 frame-region loss** (BA/PM's ruling on my own correction) | *"the corrected clause names two of the frame's three regions"* — it omitted the twelve move-list rows | **The clause now reads *"never appears anywhere in the 23-row frame the program writes"*, spelled out as all three regions.** BA/PM's folded-in readability point is done too: the runner's-echo note is moved **above** the PASS/FAIL line. **Re-run against the wider clause:** ten runs, both sides appeared (7/3), **zero occurrences of `random` in any region and none on stderr** | § 6 Group B |

**Nine of nine closed. Nothing was declined, and I am recording no disagreement with any of BA/PM's
calls** — including the two that criticise my own judgement (`B4`'s scoring and the frame-region loss
introduced by my own mid-run correction). **The one place where I put a different fact on file is a
measurement, not a dispute**, and it is § 3 below.

## 2. QE's coverage map — every scenario's wording re-checked against it

QE mapped the seventeen: **4 fully backed, 10 partly backed, 3 backed by nothing but a run.** A
scenario a pack presents as solid that no test pins is a scenario whose wording overclaims, so **every
one of the nineteen now carries a line marked *What else backs this*, in the signer's language**, taken
from QE's map rather than from my opinion of my own pack. The ones where the wording, not just the
coverage, needed changing:

| scenario | what QE found | what the wording now says |
|---|---|---|
| **UAT-8** | **UNBACKED, and demonstrably blind** — a one-word change ships 856/856 green while `--ascii` stops working | **"nothing, and this is the weakest-covered scenario of the nineteen"**, plus the correction in § 3 below and an instruction to run it **at a terminal** and compare against UAT-1's screen |
| **UAT-3** | UNBACKED — no test runs any command twice | *"nothing. Your two screens are the only check."* |
| **UAT-13** | UNBACKED **by ticket design** (`A11` forbids a wall clock in the suite) | *"nothing, by deliberate design"*, with the reason |
| **UAT-10** | rows **d** and **f** have no deterministic coverage at any level; row f's branch crashes with a stack trace under QE's mutation | **row f named as "the single most valuable command in this table for you to type yourself"** |
| **UAT-16** | class coverage only — **none of the six words is named or run by any test**; the pack calls this its most important scenario | *"the pack's most important scenario with the least by-name backing"* |
| **UAT-9 / 10 / 12** | *"then the usage line"* is asserted by **no test in the repository** | each says the usage line is unchecked and to read it with your own eyes |
| **UAT-5, UAT-6** | the status-line clauses are asserted for no non-default run | both say so |
| **UAT-12, UAT-15, UAT-17** | the terminal half / the behaviour / the behaviour are unbacked; the backing is a pipe, a source reading and a `package.json` census | each says which half is yours to check |
| **UAT-4** | backed, but the tested run also carries `--unicode` | noted, with why it does not matter here |

**No scenario's PASS/FAIL line was weakened to fit its coverage.** The changes add what backs it; they
do not lower a bar.

## 3. Two corrections to my own first pack, disclosed rather than quietly fixed

**Neither is a disagreement with a gap call. Both are measurements that contradict something I wrote.**

1. **UAT-8's PASS was recorded on non-discriminating evidence.** Everything an agent runs is piped,
   and on a pipe `npm run chess` and `npm run chess -- --ascii` produce **byte-identical frames**
   (measured this hop). So the piped run that recorded UAT-8 PASS could not tell "the flag worked"
   from "the pipe rule worked". **The PASS is not withdrawn — it is re-evidenced under a real
   pseudo-terminal** (no flags → 32 figures; `--ascii` → 0 figures; `--unicode` → 32 figures), which is
   the surface the signer uses. **This is the same blindness QE proved in the automated suite, and I
   had it too.**
2. **"Silently discarded" was my word and it is wrong.** `npm run chess --ascii` prints
   `npm warn Unknown cli config "--ascii"` on stderr — on a pipe and, colourised, on a terminal —
   before drawing the board with exit `0`. What the runner does **not** say is that the chess program
   never saw the option, and **on a terminal the board you get is drawn in the default style, which is
   the opposite of what you asked for.** § 5 of the amended pack carries the measured version.
   **`B4` is unaffected**: the documentation still never shows the `--` form.

## 4. What I am leaving OPEN for the Orchestrator — three items, none of them a gap dispute

- **`O1` — "zero of four" is now written down in exactly one place, and it is a context note.**
  `plans/epics/EPIC-006-…md` states its four acceptance criteria and, at its decomposition, names
  **#1 and #4** as not met by this decomposition; `ABC-042`'s ticket page fences the same two.
  **Nothing in `plans/` says #2 (`undo`) and #3 (the result screen) are unmet as well**, and a reader
  of the plans tree alone can still make the inference BA/PM caught. **I am fenced out of `plans/**` on
  this hop** (a BA/PM agent is cutting tickets in parallel), so I did not touch it. **The Orchestrator's
  call:** route a one-line amendment to `EPIC-006`'s page, or fold it into the cut BA/PM is doing now.
- **`O2` — the wording of the `AGENTS.md` documentation ticket.** BA/PM's recommendation 7 and QE's
  `R9` are the same item and it should be cut once. **Whoever cuts it should carry the measured
  behaviour, not the first pack's word:** the runner **warns** (`npm warn Unknown cli config "--ascii"`)
  and then draws the **default** style — on a terminal, figures instead of the requested letters. A
  ticket that says *"silently discarded, the user is never told"* would be describing something the
  product does not do.
- **`O3` — a priority signal, not a new recommendation.** Of QE's ten repairs, **`R1`/`R2` (assert that
  `--ascii` reaches the renderer) is the one this pack now leans hardest on a single human run to
  cover**, because UAT-8 is unbacked, the suite is provably blind to it, and the agent's own evidence
  was non-discriminating. It costs **zero new child processes**. I recommend nothing about scheduling;
  I am recording which gap the pack is now carrying with a person instead of a test.

## 5. What this hop did NOT do

- **It did not sign anything and asked for no signature.** Every box in § 9 and every cell in § 9b is
  empty. `ABC-042`'s UAT state after this note is *pack built, run by an agent, validated for business
  coverage, coverage-mapped, **amended**, **NOT accepted***.
- **No `finding` kind and no `verified_by` stamp.** `context.human_admission` is `off`; the kinds used
  are `decision` / `observation` / `artifact-ref`, hand-authored per
  `agent-factory/contracts/context-note.md`.
- **It did not mutate the original pack note.** Notes are append-only; the amended pack is a new note
  carrying `supersedes: 20260815T110533Z-…-f43cd04c`, and the first version stays on file with its
  gaps intact as the audit trail.
- **It did not re-litigate BA/PM's ruling**, decline a gap, or argue one away inside the pack.
- **It changed no product file.** `src/` and `package.json` are byte-identical to `main` before and
  after. No test file was created or edited.
- **It wrote nothing outside `.grugops/context/uat-ABC-042-amend/notes/` and its own queue records.**
  `plans/**`, `AGENTS.md`, `memory-bank/**`, `src/**` and `.grugops/context/uat-ABC-042-cut/` were not
  touched, and the shared worktree's `HEAD` never moved.
