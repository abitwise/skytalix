---
id: 20260815T132100Z-software-engineer-decision-what-i-armed-and-what-i-refused-52db30ff
kind: decision
by: software-engineer
at: 2026-08-15T13:21:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - Q1
  - Q2
  - Q3
  - Q6
  - Q7
  - E1
  - A6
  - A9
  - A12
  - N8-LANE
  - src/cli.test.ts
supersedes: 
---

# What I armed, what I refused to arm, and the line between them

**`src/cli.test.ts` only. Zero production bytes, 29 → 29 tests, 10 → 10 spawns, +24 lines / −0.**

## The line I used, stated first so the calls below can be checked against it

QE drew it and I keep it: **a criterion that states a property, with an assertion that implements
only one spelling of it, is a TEST defect — and tests are what this role is licensed to add.** A
criterion that does not state the property at all is a **CRITERION** gap, and criteria are BA/PM's.
This ticket has already deleted two criteria rather than let an implementer re-word one.

## Armed — `Q2` (`A9`), because the criterion is right and the assertion was short

`A9`(2) already says *"**no second read and no branch on argv after the resolver returns**: the
resolver is the exclusive validator"*. That is the property. The assertion implemented one spelling
of it; three more shipped 856/856 green (`MX9`, `MX10`, `MX12`). **Test defect → mine.** The row now
counts the identifier instead of listing spellings. Details in the spellings note.

## Armed — `Q6` (the spawn pin), and here is my reason, since the subtask left it to me

**Taken.** `expect(spawned).toBe(10)` counts only children made through `childOf`; `MX14` — a direct
`spawnSync` — added an **eleventh child** and shipped the whole suite green.

Three things decided it:

1. **`N8-LANE` is breached at 2.00x and escalated to the project owner right now.** The pin is the
   instrument the owner's decision rests on. A budget guard that a one-line edit walks past, on a
   budget under live escalation, is not a `LOW` in practice whatever its severity label says.
2. **QE routed it to "BA/PM **or the next engineer to touch the file**". I am that engineer**, and I
   was already in the file for `Q2`. Leaving it for a later hop costs a whole hop to save two lines.
3. **It is closable at zero cost and without a criterion.** The pin is not a criterion — the test
   file wrote it for itself — so nothing here is BA/PM's. `spawnSync` is now proved to be the only
   name taken from `node:child_process` **and** to have exactly one call site: the count is closed at
   its source rather than at the wrapper that was being bypassed.

**Zero new spawns, and that is by construction, not by hope**: the change is one `readFileSync` of a
file the suite already reads and two regex scans. Measured anyway — see the lane note.

## Confirmed, not re-armed — `Q7` (`A2`)

**Already armed by QE and it works.** `MX13` — a binding hung on `globalThis` without the `export`
keyword — reds `A2`'s row. I rebuilt the mutant and watched it rather than reading QE's claim.
Nothing further was needed and nothing was added.

## REFUSED — `Q1`'s residual, and this is the important one

**`Q1` as DIAGNOSED is discharged. `Q1` as a PROPERTY is not, and I am not licensed to finish it.**

`MX1`/`MX2` (`startsWith`, `toLowerCase`) are dead — QE's diagnosis was exact and its fix works. But
**two more `--colour` membership weakenings still ship 856/856 green** against the armed row:

- **`MX5` — `token.endsWith(COLOUR)`.** `node src/cli.ts "x--colour" black` prints a **23-row board
  on stdout, exit 0, stderr empty**. That is QE's own sentence about `M7`/`M19`, on the armed
  instrument.
- **`MX4` — `token.trim() === COLOUR`.** Accepts `"  --colour"`. Subsumed by `MX5`'s reading.

**Why I did not close it.** `A6`(i) enumerates exactly three derivations per spelling — *"upper-case
form, `+"x"` extension and one-character truncation"* — and the row implements **exactly those
three**, which is why `expect(derived).toHaveLength(18)` is 6 × 3. `endsWith` and `trim` are a
**fourth mutant class the criterion never names**. Closing them means either changing the 18 or
adding a row asserting near-miss forms no criterion states — and **either one changes which builds
`A6` reds, which is a criterion-level decision wearing a test's clothes.** The subtask's stop
condition says stop, and this ticket's whole history says the same.

**So it is raised, not absorbed, as `E1` — HIGH, owner BA/PM.** One clause on the criterion closes
it, and **I can implement the row within the hour the moment BA/PM says the word** — "stop" here
means "not unilaterally", not "hard".

## REFUSED — `Q3` (the licence comparator), untouched as instructed

`src/history-pane.nfr.test.ts` was **not opened for writing**. It is byte-identical to my base by
md5 **and** by git blob SHA. `A12` bounds that file and `Q3` is routed to Architect/Design; adding an
assertion there would breach `A12` in order to protect `A12`. I record that I agree with the routing
rather than merely obeying it.

## Also refused, so the list is honest

- **No criterion was edited. No criterion was ticked MET or NOT MET** — that is BA/PM's, and my
  evidence is evidence, not a verdict.
- **The ticket page, `plans/board.md`, `plans/traceability.md`, `plans/nfr-catalog.md`, `ADR-0008`
  and `.grugops/test-skips.md` were not written.** The board move `In Development → In Review` that
  Workflow 04 gives this role is reserved to the Orchestrator on this ticket for the third time; the
  subtask says so and says it is deliberate, so **it is not in my gaps list.**
- **`Q4` (`A6`(ii)'s tautological 250-check)** — not mine, not touched, BA/PM's per QE. I add
  nothing to it.
