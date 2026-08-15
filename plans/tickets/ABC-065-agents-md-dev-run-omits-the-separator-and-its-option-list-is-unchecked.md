---
id: ABC-065
title: `AGENTS.md`'s `Dev / run` slot lists three options and never shows the `--` separator — a reader who combines them gets a board, exit 0 and a silently discarded flag, and no test compares the documented list to the accepted set
status: ready
column: Ready
size: S
priority: P1
epic: —
feature: —
---

# ABC-065 — the documented command works; the documented OPTIONS do not, and nothing watches either half

> **Cut 2026-08-15 by BA/PM** (task `uat-ABC-042-followups-2026-08-15`, subtask `uat-ABC-042-cut`,
> Workflow 03). **This ticket is TWO recommendations folded into one, deliberately:** BA/PM's own
> gap `B4` / behaviour `M1` (`.grugops/context/uat-ABC-042-bapm/notes/`) and QE/E2E's **`R9`** are
> the same repair under two names, and QE's **`R6`** is the guard for it. They ship together because
> **the guard is RED until the documentation is fixed, and the fixed documentation is guarded by
> nothing without it** — split, one of them reds on merge. **`ABC-042` is merged, `Done`, and both
> gates passed against it: its page is NOT edited and no criterion of its is re-opened.**

## Problem

*User*: any human or agent who reads `AGENTS.md` to learn how to run this project — which is every
one of them, on the file's own instruction.

*Pain*: **`AGENTS.md` names three options and never shows the form that passes them.** The slot reads
`- Dev / run: \`npm run chess\`` followed by an HTML comment listing *"the complete set:
`--colour white|black|random`, `--ascii`, `--unicode`"*. **The string `npm run chess -- ` occurs zero
times in the whole file** (measured at the cut). A reader who combines the command with the listed
options types `npm run chess --ascii` — and the UAT run measured what happens: **a board, exit `0`,
and the option silently discarded. The user is never told.** It is the only measured path where a
person asks for something, is given something else, and gets no signal at all.

**And the second half is unguarded.** `src/cli.test.ts:193` pins the command line's text and
`scripts.chess`; **no test compares the documented option list to `ACCEPTED_ARGUMENTS`.** A
documented option that does not exist — or an accepted option nobody documented — ships **856/856
green**. That is UAT-14's second half (*"and run it with each option it lists"*), and it is why
UAT-14's PASS is generous on the literal reading.

*Value*: `ABC-042` claimed *"`Dev / run` gets a real value"* as half its stated value (`V2`).
**It is real for the command and not for the options.** This is the cheapest repair in the whole
follow-up set and the only one a human is meeting today.

## Scope

- **`AGENTS.md` § Commands, the `Dev / run` slot only**: add an invocation showing the separator —
  `npm run chess -- --colour black` — beside the option list, so the listed options are reachable as
  written.
- **One new `it` block in `src/cli.test.ts`** asserting the slot against `ACCEPTED_ARGUMENTS`: every
  option the documentation names exists, every accepted option is named, and the separator form is
  present.
- **A short comment at the site** recording why the separator matters (the package runner eats a
  flag written without it), so a later hop does not tidy the example away.

## Out of scope

- **`ABC-042`'s `A1` row at `src/cli.test.ts:193-204` — BYTE-IDENTICAL.** Its assertion is
  `toContain("- Dev / run: \`npm run chess\`")`, a **substring of the line, not the whole line**
  (read at the cut), so an example added inside the same slot leaves it green. **If a chosen wording
  would require that literal to move, stop: re-opening a merged criterion's instrument is the
  Orchestrator's ruling, not the implementing hop's.**
- **Every other claim in `AGENTS.md`.** Deployment posture, the four remaining `UNKNOWN - verify`
  slots, the process rules, § Stack: untouched. This is one slot.
- **The runnability guard `ABC-059` repairs.** Different claim (does an entry point exist), different
  mechanism (one spelling vs the fact). The two blocks sit next to each other; neither asserts the
  other's property.
- **Any product change.** `--ascii` written without the separator is the **package runner's**
  behaviour, not this program's; no test can reasonably catch it and no production line changes here.
  **Zero files under `src/` other than the one test file.**
- **Teaching the reader about `npx`.** Distribution is undecided (`ADR-0007` clause 5) and
  `EPIC-006`'s four `npx` mentions are already a live open question. The example uses the command
  that exists.

## Acceptance (Given/When/Then)

- **`A1` (the separator is shown).** **Given** `AGENTS.md` § Commands, **then** the `Dev / run` slot
  contains at least one complete invocation of the form `npm run chess -- <option>` where `<option>`
  is an element of `ACCEPTED_ARGUMENTS`. *(Today: `npm run chess -- ` occurs **0** times in the
  file — measured.)*
- **`A2` (`ABC-042`'s row stays green and unmoved).** **Given** the diff, **then**
  `src/cli.test.ts:193-204` is **byte-identical**, the substring `- Dev / run: \`npm run chess\`` is
  still present in `AGENTS.md`, and the suite is green.
- **`A3` (the documented list equals the accepted set).** **Given** the `Dev / run` slot's text,
  **when** its `--`-prefixed tokens are collected, **then** that set **equals** the `--`-prefixed
  elements of `ACCEPTED_ARGUMENTS`, both ways — **3 of 3** (`--colour`, `--ascii`, `--unicode`) —
  **and** each of `white`, `black`, `random` appears in the slot. *(Today: **0** tests compare
  them.)*
- **`A4` (both failure directions red).** **Given** `--difficulty` added to the slot's option list,
  **then** RED. **Given** `--unicode` deleted from the slot, **then** RED. *(Today: both ship green —
  this is the falsifying pair and it is the point of `A3`.)*
- **`A5` (read, never transcribed).** **Given** the new block, **then** its expectation is read from
  `ACCEPTED_ARGUMENTS` at run time and **no second spelling of any accepted argument is introduced
  into the test file**. A guard that hardcodes the vocabulary is the same defect one level down —
  `ABC-059`'s `A4`, applied here.
- **`A6` (nothing else moved).** `git diff --name-only <the delivered commit>~1 <the delivered
  commit>` shows **exactly** `AGENTS.md` and `src/cli.test.ts` — **two paths**, **zero production
  lines**, **zero new child processes** (`spawned` still `10`). Suite green, skip **0**.

## Dependencies

- **`AGENTS.md` IS CLAIMED RIGHT NOW BY ANOTHER HOP — this is the one open item.**
  `.grugops/queue/claimed/agents-md-owner-grants/claim.md` (`by: agents-md-scribe`, `at:
  2026-08-15T13:13:00Z`, branch `grugops/agents-md-owner-grants`) holds the file. **This ticket must
  not be pulled while that claim is live**, and whoever pulls it re-reads the slot from `main` first:
  the wording quoted above is the wording at the cut.
- **The `AGENTS.md` edit is the `AGENTS.md` Scribe's**, per this project's recorded practice
  (`agents-md-*` subtasks in `.grugops/queue/done/`). The test block is an engineer's. **One hop, one
  ticket** — because of the coupling in the header — but the pen on the markdown file is not this
  ticket's to reassign.
- **`ABC-059` is adjacent, not blocking.** Same file, same region, different claim; either order
  works, and both state "no merged row edited".
- **`ABC-042` is merged at `dbaf972`** — `src/cli.test.ts` exists on `main`, verified at the cut.

## Security / NFR triggers

- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**. **0 new test files, 0 new files under `src/`,
  0 new child processes.** The added work is one `readFileSync` of `AGENTS.md` — the neighbouring row
  at `:196` already makes it — plus a slice and a set comparison. **`N8-LANE` is `MET` at 0.23×
  (152.5 ms of 650 ms); this ticket must not move it.**
- **`NFR-002` not triggered.** No frame path; no production module opened.
- **Security: not triggered.** `ABC-041`'s four clauses: **(a)** no manifest touch — `package.json`
  is not read here at all, **(b)** no non-`.test.ts` file under `src/` touched, **(c)** no network,
  no write, **no spawn** — read-only `node:fs` over the repository's own markdown is explicit merged
  precedent, **(d)** blast radius is two paths, one of them documentation.

## Test notes

1. **Define the slot mechanically in the test, not by line number.** Line numbers move; take the text
   from the `- Dev / run:` list item to the end of its HTML comment. `ABC-059`'s blindness was a
   guard tied to one rendering — do not reproduce it by tying this one to one position.
2. **Write `A4`'s two mutants before the guard and watch both RED.** One direction (a documented
   option that does not exist) is the failure UAT-14 could not see; the other (an accepted option
   nobody documented) is the one that will actually happen, the day `EPIC-006` adds an argument.
3. **Do not assert the example's prose.** `A1` needs the FORM present, not one sentence around it;
   an assertion on the surrounding wording is the spelling trap again.
4. **The `--` example must be a real, runnable command.** Run it once by hand before recording it —
   `npm run chess -- --colour black` printed a black-bottom board at the UAT run, and a documented
   command that has never been run is what `AGENTS.md` § Commands forbids in its own words.

## Lane cost — how many test FILES this ticket implies

**Zero.** One block in an existing file; no child process.

## Size and priority rationale

**Size `S` (2).** One documentation line and one guard block — but the guard needs the slot located
mechanically and the set comparison derived from `ACCEPTED_ARGUMENTS`, and the ticket spans two files
and (in practice) two hands. `XS` would understate the coordination, not the code.

**Priority `P1`.** The only item in this follow-up set that a human is meeting **today**: the option
list as printed is unusable as printed, on the second half of the value `ABC-042` claimed. It is also
the cheapest repair of the five. **Not `P0`: the command itself works, `A1`'s last clause held, and
nothing is broken in the product.**

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-15**, and item 10 RE-SCORED by BA/PM **2026-08-16** (task
`abc065-066-claim-drained-2026-08-16`, Workflow 07). **Result: 10 of 10 — MET.** The claim that held
item 10 back has drained.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the slot quoted, `npm run chess -- ` measured at **0** occurrences, the discarded-flag path measured by the UAT run, and the unguarded half named with its scenario |
| 2 | scope and out-of-scope clear | **✅** one slot, one block; five fences, including "`:193-204` byte-identical, and if a wording would move it, stop" |
| 3 | INVEST-shaped | **✅** small and testable. **Negotiable-but-not-splittable, and the header says why**: split, the guard reds on merge |
| 4 | acceptance testable and measurable | **✅** `npm run chess -- ` from **0** to **≥1**, documented options **3 of 3** equal to the accepted set both ways, two named mutants RED, **2** paths, `spawned` **10** |
| 5 | dependencies known | **✅** the live `agents-md-owner-grants` claim, the Scribe's pen, `ABC-059`'s adjacency, `ABC-042` merged — all four named |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ 650 ms with **0** new files and **0** spawns against 152.5 ms; `NFR-002` untriggered; four security clauses answered |
| 7 | test notes present | **✅** four, including "locate the slot mechanically" and "run the documented command before documenting it" |
| 8 | size assigned | **✅** `S` (2) |
| 9 | priority assigned | **✅** `P1`, with the reason it is not `P0` stated |
| 10 | no major unresolved blocker | **✅** RE-SCORED 2026-08-16: the `agents-md-owner-grants` claim has drained — `.grugops/queue/done/agents-md-owner-grants.md` and `.claim.md` both sit under `done/`, verified independently (not cited on faith): `.grugops/queue/{pending,claimed}/` hold nothing named `agents-md-owner-grants`, and `AGENTS.md` on `main` carries no live-claim marker for itself |
