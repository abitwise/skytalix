---
id: 20260815T112136Z-ba-pm-observation-the-corrected-uat6-scenario-ruled-sound-not-weakened-with-one-narrow-loss-fca3368c
kind: observation
by: ba-pm
at: 2026-08-15T11:21:36Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T110900Z-uat-planner-observation-the-run-seventeen-scenarios-executed-against-main-and-what-actually-came-back-8c6e3c04.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T111100Z-uat-planner-observation-six-facts-the-run-turned-up-that-no-criterion-asks-about-99da7613.md
supersedes: 
---

# Ruling on the one scenario the planner corrected mid-run — SOUND, not weakened, with one narrow loss

**The scenario is UAT-6** (*"I can let it pick my side for me"*). The run note discloses the edit under
its own heading, *"The one wording defect this run found, and what was done about it"*. **This is the
one place in the pack where a self-serving edit could hide, so I ruled on it against the business
promise rather than against the wording.**

## What changed

| | text |
|---|---|
| **before** | the word `random` **never appears anywhere on the screen** |
| **after** | *"The word `random` never appears **on the board or in the status line**"*, plus an italic scope note in the scenario naming the package runner's echo of the typed command as the place it does appear |

The trigger: the runner prints `> node src/cli.ts --colour random` on line 3 of every run. Checked at
source by the planner — the **program's own output contains the word zero times**; only the runner's
echo carries it.

## The business promise the clause is there to protect

`## Scope`: *"`--colour random` — **resolved to `white` or `black` before anything else sees it**"*
(`ABC-019` `[D24]`). `A4`: *"**The string `random` reaches no renderer and no seam.**"*

**The business risk in one sentence:** the user asks for a random side and the product either treats
the literal word `random` as if it were a colour, or leaks an unresolved placeholder onto the display
where a person can see it.

## RULING: the corrected scenario still tests the promise. It was not weakened to fit the result.

Five reasons, in order of weight:

1. **The correction narrows WHERE to look, not WHAT must be true.** The assertion about the program's
   own output is unchanged. What was removed from the observation surface is bytes the program did not
   write. **A scenario that fails on output from a different process is measuring the wrong
   instrument, not holding a higher bar** — the original wording could never have passed on any build,
   correct or broken, because `npm` echoes the command line unconditionally. **It was un-passable, not
   strict.** A criterion that no correct build can satisfy is a defect in the criterion; the pack
   fixed a defect, it did not lower a bar.
2. **The measured statement got STRICTER, not looser.** The run records *"the word `random` appears
   **zero** times in the program's own output"* — a channel-discriminated zero. The original wording,
   applied to the whole screen, could only ever have produced a fail; it had no power to distinguish a
   product that leaks `random` from one that does not.
3. **The promise is carried by two more clauses the correction did not touch, and they are the heavy
   ones.** UAT-6 still requires that **every run shows one of exactly the two boards from UAT-4 and
   UAT-5**, and that **both appear over ten runs**. A build that failed to resolve `random` before the
   renderer saw it would produce a third board shape, a wrong orientation, or a crash — and would fail
   on those clauses **independently of the word-appearance clause**. The promise therefore survives
   even if the corrected clause were deleted entirely.
4. **The edit is consistent with a boundary the pack draws elsewhere, so it is not an ad-hoc carve-out
   for one failing clause.** § 5 already separates the runner from the program in detail (the `--`
   trap, both failure shapes) and § 3's entry criteria do the same. **The correction applies a rule the
   pack was already using; it did not invent one to escape a result.**
5. **It is disclosed with its cause, its check and its counterfactual.** The run note names the
   scenario, quotes the old wording, states where the word came from, records that it checked the
   program's own output separately, and states outright *"The result was not adjusted to fit the
   wording."* **A self-serving edit is not normally announced with its own heading.** Nothing was made
   unfalsifiable: a third party can run the command and look at the board.

## The one narrow loss, and it is real

**The corrected clause names two of the frame's three regions.** The frame is 23 rows — nine board
rows, two status rows and **twelve move-list rows** (the pack's own observation note, § 5). The
correction scopes the clause to *"the board or the status line"* and **omits the twelve move-list
rows**.

**Consequence:** a build that wrote the string `random` into the move-list pane would **pass UAT-6 as
corrected** and would have **failed it as originally worded**. That is a genuine, if narrow, coverage
loss introduced by the correction — the pack over-corrected by one region.

**It is a wording gap, not evidence of a self-serving edit**, for three reasons: the pane is empty on
every run and always will be in this version; nothing in the delivered code paths writes to it; and
the loss is invisible from the direction a self-interested editor would care about (it makes the
scenario weaker against a hypothetical build, not against the build under test).

**The fix is one phrase and it costs nothing:** scope the clause to *"anywhere in the 23-row frame the
program writes"* rather than *"the board or the status line"*. **Recommended to the Orchestrator as a
pack amendment; I did not edit the pack.**

## One readability point, recorded and not scored

The PASS/FAIL line still reads *"FAIL if … the word `random` reaches the board or status line"*, with
the runner's-echo explanation in an italic note **after** it. A tester who reads the FAIL line, looks
up, sees `random` on line 3 and stops reading will record a FAIL. Moving the scope note above the
PASS/FAIL line would close it. Minor; folded into the amendment above.
