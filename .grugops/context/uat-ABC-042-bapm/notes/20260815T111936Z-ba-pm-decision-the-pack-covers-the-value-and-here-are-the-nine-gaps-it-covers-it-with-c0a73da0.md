---
id: 20260815T111936Z-ba-pm-decision-the-pack-covers-the-value-and-here-are-the-nine-gaps-it-covers-it-with-c0a73da0
kind: decision
by: ba-pm
at: 2026-08-15T11:19:36Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - EPIC-006
  - plans/tickets/ABC-042-entry-point-argv-and-the-first-frame.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
  - agent-factory/workflows/06-uat-pack.md
  - agent-factory/checklists/uat-checklist.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T110533Z-uat-planner-decision-the-abc042-uat-pack-seventeen-scenarios-a-non-engineer-can-run-and-judge-f43cd04c.md
  - .grugops/context/uat-ABC-042-pack/notes/20260815T110900Z-uat-planner-observation-the-run-seventeen-scenarios-executed-against-main-and-what-actually-came-back-8c6e3c04.md
  - .grugops/context/uat-ABC-042-2026-08-15/notes/20260815T105600Z-orchestrator-decision-uat-abc042-ordered-routing-and-the-row-that-does-not-move-97f07fc1.md
supersedes: 
---

# Business validation of the `ABC-042` UAT pack — it COVERS THE VALUE, WITH NINE NAMED GAPS

**VERDICT: covers the user value and the scope `ABC-042` was cut for, with nine named gaps.**
Not materially deficient. Not a rubber stamp — nine defects are named below and in the sibling
notes in this folder, four of them in the pack's own business-artifact quality and one of them a
recorded PASS I would not have scored as a PASS on its literal reading.

**This is a validation, NOT an acceptance.** No box in the pack's § 9 is ticked here, no signature is
recorded, and no `finding` kind and no `verified_by` stamp is used — `context.human_admission` is
`off` on this install. **The gaps below are recorded as gaps and returned to the Orchestrator; the
pack was not edited and no defect or follow-up ticket was cut on this hop.**

## 1. The value, and whether seventeen scenarios reach it

The ticket's `## Problem` states the value in one sentence: *"after this ticket a human types one
command and sees a chess board — `Dev / run` gets a real value, UAT gets a destination, and a quality
signal can come from outside this repo for the first time."* Four parts, traced:

| # | The value the ticket claims | Reached by | Verdict |
|---|---|---|---|
| V1 | a human types **one command** and **sees a chess board** | UAT-1 (it starts, exit `0`), UAT-2 (it is the right board) | **REACHED**, and by the two scenarios a signer runs first |
| V2 | `AGENTS.md`'s `Dev / run` gets a **real value** | UAT-14 | **REACHED FOR THE COMMAND, NOT FOR THE OPTIONS** — gap `B4` below |
| V3 | **UAT gets a destination** | the pack's existence; discharged by this hop and the pack hop | **REACHED** — not a scenario, correctly |
| V4 | a **quality signal from outside this repo** (`Escaped defects` becomes measurable) | not a scenario; the Orchestrator's metrics row at close | **REACHED**, correctly out of the pack |

**No scenario reaches nothing.** I checked all seventeen for the reverse failure — a scenario that
tests something the ticket never promised — and found none that is empty. Two are worth naming for
routing rather than as defects:

- **UAT-2 asserts content `ABC-042` did not author.** `White to move  1.` and `material: 0` come from
  the merged status panel (`ABC-016`) through `ABC-041`'s seam. `A1` asserts frame **height** and the
  eight ranks, not those strings. Exercising them through the new entry point is right — this is the
  first time any human could look at them — but **a UAT-2 failure on the status line is not an
  `ABC-042` defect** and must not be routed as one.
- **UAT-3 (the same command twice draws the same picture) has no criterion.** `A4` asserts
  byte-identity to `renderBoard`, not run-to-run stability. It tests slightly more than the ticket
  promised, which is a surplus, not a hole.

## 2. `A1`–`A12`, criterion by criterion — which scenario reaches it

| criterion | reached by | note |
|---|---|---|
| `A1` a human can run it, exit `0` | UAT-1, UAT-2, UAT-14 | fully reached |
| `A2` zero `export`s in the entry point | — | diff-read; **correctly absent** from a business pack |
| `A3` flat in `src/` | — | diff-read; **correctly absent** |
| `A4` `--colour`, `random` resolved before anything sees it | UAT-4, UAT-5, UAT-6 | reached; `1000` resolutions down-sampled to `10` — see gap `B3` |
| `A5` `--ascii --unicode` refused, naming both, no frame | UAT-9, UAT-11 | reached. `selectGlyphMode` called 0 times is internal and **correctly absent** |
| `A6` the allowlist's complement | UAT-10 (nine), UAT-11, UAT-16 (six) | reached **as a sample**. `A6`(i)'s 138-case near-miss family and (ii)'s 1000-token sweep are the automated tests' — **QE/E2E's subtask owns that half, not this one** |
| `A7` glyph mode through the merged rule | UAT-7 (the `--unicode` half) | **HALF REACHED** — see gap `B1` |
| `A8` no `\x1b[` on a pipe, one trailing `\n`, one frame session | UAT-12 (hostile path only) | not reached on the normal path; **correctly absent** from a business pack, recorded in the pack's own observation note § 5 |
| `A9` `process.stdout` here only, `process.argv` read exactly once | — | diff-read; **correctly absent** |
| `A10` the distribution decision measurably unmade | UAT-17 (its **consequence**) | the key-by-key half is diff-read; UAT-17 makes the consequence visible to a signer, which is the right business translation |
| `A11` median ≤ 1 s, recorded with its machine | UAT-13 | reached; the machine is in the pack's identity note. **Not executable by a non-engineer** — gap `B2` |
| `A12` merged tree honestly scoped, 18 modules byte-identical | — | diff-read; discharged by the pack's identity note (`src/` tree hash and `package.json` blob hash equal to `main`) |

**Every criterion in `A1`–`A12` that is observable from outside the code is reached by at least one
scenario.** The five that are not reached (`A2`, `A3`, `A9`, `A12`, and `A10`'s key-by-key half) are
engineering assertions read off a diff. **A business pack that tried to carry them would be a worse
pack, not a better one**, and each has a non-scenario evidence route already on file. I record them
as named-and-deliberate, not as gaps.

## 3. The scope table, and whether the pack fences it

`## Scope`'s argv table is the closed accepted set. Every row has a scenario:

| scope row | scenario |
|---|---|
| `--colour white` / `--colour black` | UAT-4, UAT-5 |
| `--colour random`, resolved before anything sees it | UAT-6 |
| `--ascii` / `--unicode` | UAT-8, UAT-7 |
| no arguments | UAT-1, UAT-2 |
| `--ascii --unicode` together → rejected | UAT-9 |
| anything else, including `--difficulty` → rejected | UAT-10 (nine tokens incl. `--difficulty`), UAT-16 (six more) |

**Six of six.** The pack also reaches the three `## Scope` items the ticket lists as modules — the
one-`scripts`-key fence is made visible by UAT-17, and the resolver's purity is not business-visible
and is correctly not attempted.

## 4. The nine gaps

Four are coverage; four are the pack as a business artifact (detailed in the sibling `observation`
note on § 7 and § 9); one is a recorded PASS I would grade differently.

**Coverage:**

- **`B1` — `A7`'s piped half has no scenario.** *"Given stdout is a pipe and no flags, the entire
  emitted stream carries zero code points above `U+007F`"* is a real acceptance criterion and no
  scenario has a PASS/FAIL line for it. Group C's preamble describes the behaviour in prose and
  UAT-8 tests the **explicit** `--ascii` request, which is a different thing. **Severity: low** — the
  signer is a human at a terminal — but the criterion is uncovered and the pack does not say so.
- **`B2` — UAT-13 cannot be executed by the reader it is written for.** *"`npm run chess`, ten times,
  timed. Expect: the middle time of the ten is one second or less."* No method for timing and no
  method for taking a median is given, in a pack whose stated audience *"does not read code and will
  not be given a translator."* UAT-3's *"the two boards are indistinguishable"* has the same shape
  (the agent used `cmp`; the human is given no method), but eyeballing two screens is a legitimate
  human test — timing ten runs and computing a median is not.
- **`B3` — UAT-6 will FAIL correct software about once in 512 runs.** The PASS line requires both
  sides to appear in ten runs of a fair coin: `2 × 0.5^10 ≈ 0.20%`. Under § 10 exit criterion 5 a
  recorded FAIL stops the ticket exiting UAT and routes a defect that does not exist. **The fix is one
  clause** — *"if only one side appears, run ten more before recording FAIL"* — and it costs the
  scenario nothing.
- **`B4` — UAT-14 passes on a generous reading of `AGENTS.md` and fails on the literal one.**
  `AGENTS.md` § Commands `Dev / run` prints `npm run chess` and names `--colour white|black|random`,
  `--ascii`, `--unicode` inside an HTML comment. **It never shows the `--` separator anywhere.** A
  reader who combines the command with the listed options types `npm run chess --ascii` — and the
  pack's own observation note measured that path: **exit `0`, a board printed, `--ascii` silently
  discarded, the user never told.** UAT-14's PASS line is *"the documentation and the product agree"*;
  on the form the documentation actually implies for its options, they do not. **This is a
  documentation defect in `AGENTS.md`, not a product defect**, and it lands on `V2`, the second half
  of the value this ticket claims. **I do not overturn the PASS** — the command itself works, which is
  what `A1`'s last clause required — but the options half of UAT-14 was scored against a form
  `AGENTS.md` does not print, and the Orchestrator should see that before anyone signs.

**Business artifact (four; the reasoning is in the sibling note):** `B5` § 7's lead-in overclaims
which limitations are executable; `B6` § 7 names two of `EPIC-006`'s four acceptance criteria as
unmet and is silent that the other two are also unmet; `B7` the most visible limitation — the twelve
blank move-list rows — has no scenario; `B8` § 9 provides no form in which § 10's exit criterion 1
("all seventeen have a recorded outcome") can be discharged.

## 5. What the pack got right, recorded because a validation that only lists faults is also useless

- **It is not a restatement of `A1`–`A12`.** It re-asks them as product questions. That is the whole
  job of Workflow 06 step 1 and most packs do not do it.
- **Group F is the strongest thing in the pack.** Turning *"it does not play a game"* into six
  commands a signer types and watches fail is the difference between a limitation the owner is told
  and a limitation the owner **verifies**. It is the reason my verdict is not "materially deficient".
- **The `--` trap is documented in § 5 with both failure shapes**, ahead of any scenario, so a
  missing separator is not recorded as a product failure. That is a pack anticipating its own reader.
- **The kit checklist is nine of nine and each item is discharged at a named section**, not asserted.
- **The one scenario the run corrected is disclosed with its cause** — ruled separately in this
  folder.
