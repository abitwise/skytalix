---
id: 20260816T090000Z-uat-planner-artifact-ref-the-uat-pack-for-abc065-3c81f0d2
kind: artifact-ref
by: uat-planner
at: 2026-08-16T09:00:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - AGENTS.md
  - src/cli.test.ts
  - src/cli-options.ts
  - agent-factory/checklists/uat-checklist.md
supersedes: 
---

# The UAT pack for `ABC-065` — scenarios, data, pass/fail, limitations, signoff

This note is **the pack**. The **conducted result** is a separate `observation` note in this task; the
**verdict and what is owed to the owner** is a separate `decision` note. Nothing measured elsewhere is
restated here — the gate figures live in `.grugops/context/quality-gate-ABC-065-qe/notes/`, the build
narrative in `ticket-to-pr-ABC-065-{scribe,guard}/notes/`, the `A2` re-wording in
`refinement-abc065-wording/notes/`.

## UAT goal, in the user's words

**"If I read `AGENTS.md` to learn how to run this project, and I type what it tells me to type, does it
work — including the options?"**

`ABC-042` already answered that for the bare command. `ABC-065` exists because the answer for the
**options** was no: the page named three options and never showed the form that passes them, and
nothing in the suite compared the printed list to the list the program actually accepts. So this UAT
has two business questions, and both must be judged by a non-engineer reading a terminal:

1. **Can a reader run the options as printed?** (the thing a human meets today)
2. **Will anyone notice when the page and the program drift apart?** (the thing that decides whether
   question 1 stays answered)

## Entry criteria — all met before conducting

| # | entry criterion | state at the start of this hop |
|---|---|---|
| E1 | The change is merged and reachable from `main` | `main` @ `722bd9d`; both delivered commits (`39122ec` documentation, `c5a5493` guard) reachable, merged at `460b9f5` |
| E2 | The gate is green on `main` | QE recorded `READY_FOR_HUMAN_REVIEW`; re-run by this hop, see the conducted-result note |
| E3 | Acceptance criteria are present, testable and unambiguous | `A1`–`A6` present; `A2` re-fenced by content 2026-08-16 (`refinement-abc065-wording`); **no stop condition fired** |
| E4 | The working tree is clean of un-merged product change | `git status --porcelain` shows only `plans/board.md` (another hop's) and untracked `.grugops/` context — **no `src/` or `AGENTS.md` modification** |
| E5 | The reviewer can run the project locally | `node v24.12.0`, `npm 11.7.0`, `node_modules` installed |

## Test users and roles

**One role, and it is not an engineer.** The user in `ABC-065` § Problem is *"any human or agent who
reads `AGENTS.md` to learn how to run this project"*. So the test persona is:

- **The New Reader.** Has the repository, has run `npm install`, has read nothing but `AGENTS.md`
  § Commands. Copies text out of the page and pastes it into a terminal **verbatim**. Does not know
  what a package runner is, does not know `--` is special, and will not read stderr unless something
  looks wrong. **No login, no fixture, no seeded database** — this project has no user accounts and no
  persistent state (`ADR-0007`: local-only, nothing is ever up).

A second, lighter persona is needed for the guard half:

- **The Future Editor.** A later hop that adds, renames or removes a command-line option, or edits the
  `Dev / run` slot. Does not read this ticket. **Must be caught by the suite, not by review.**

## Test data

There is no data fixture. The **test data is the option vocabulary itself**, and it is read from the
program rather than transcribed — this is `A5`'s rule applied to the UAT pack as well as to the guard:

- **Source of truth:** `ACCEPTED_ARGUMENTS` in `src/cli-options.ts` — `--ascii`, `--unicode`,
  `--colour`, `white`, `black`, `random` (6 elements; 3 of them `--`-prefixed options, 3 of them
  `--colour`'s value words).
- **The documented set:** the `--`-prefixed tokens inside the `Dev / run` slot in `AGENTS.md`.
- **The invocations under test** are the cross product a reader can actually form:
  `npm run chess`, `npm run chess -- --colour white|black|random`, `npm run chess -- --ascii`,
  `npm run chess -- --unicode`, plus the **negative** `npm run chess --ascii` (no separator) that the
  slot's own comment warns about.

## Business scenarios and pass/fail — judged from a terminal, no translator

Pass/fail is written so a non-engineer can score it: what you type, what you should see, and what
counts as a fail.

| # | scenario (business voice) | you type / you look at | PASS means | FAIL means |
|---|---|---|---|---|
| `S1` | **The page shows me how to pass an option.** | Open `AGENTS.md` § Commands, `Dev / run` slot. | A complete, copy-pasteable command containing `npm run chess -- ` and a real option is visible in the slot. | The slot names options but shows no invocation that passes one. *(This was the state at the cut: **0** occurrences.)* |
| `S2` | **What the page shows me actually runs.** | Copy that command verbatim, paste, run. | Exits `0`, prints a chess board, prints nothing alarming. | Non-zero exit, an error, or a board that ignores what I asked for. |
| `S3` | **Every option the page lists works when I use it as shown.** | Run each listed option through the separator form, one at a time. | Every one exits `0` **and visibly does what its name says** (colour flips the board's side; `--unicode` prints chess figurines; `--ascii` prints letters). | Any listed option errors, or is accepted but changes nothing. |
| `S4` | **The page does not hide an option from me.** | Compare the slot's option list to what the program accepts. | The two lists are the **same set, both directions**. | The program accepts something the page never mentions. |
| `S5` | **If I get it wrong the way the page warns about, the page's warning is true.** | Run `npm run chess --ascii` — no separator. | Behaviour matches the slot's written warning **exactly**: exit `0`, a default board, and npm's `Unknown cli config` warning on stderr. | The warning in the page describes something that does not happen — i.e. the page is wrong in a second place. |
| `S6` | **The plain command still works as it always did.** | `npm run chess`. | Exits `0`, prints the start position, **23 rows**, nothing on stderr. | Anything else — `ABC-042`'s accepted behaviour has regressed. |
| `S7` | **Somebody will notice if this page goes stale.** | Break the page four ways a real editor could break it; run the suite each time. | The suite goes **RED** each time, and the failure message **names the offending token**. | The suite stays green — the repair is unguarded and will rot. |
| `S8` | **Somebody will notice if the *program* changes and the page does not.** | Add an option to the program, document it nowhere; run the suite. | **RED**, naming the undocumented option. | Green — the drift that `EPIC-006` will actually cause ships silently. |
| `S9` | **Nothing else in the project broke.** | `npm test`, `npm run lint`, `npm run typecheck`, skip count. | All green, skip count `0`. | Any regression. |
| `S10` | **Nothing that was already accepted was disturbed.** | The `ABC-042` acceptance block in `src/cli.test.ts`; the changed file list. | The block is **byte-identical** to its state at `ABC-042`'s merge; the change touches **two** paths and **zero** production lines. | A merged, accepted criterion's instrument moved to make this ticket pass. |

**Traceability of scenarios to criteria:** `S1`,`S2` → `A1`; `S3`,`S4` → `A3`; `S7`,`S8` → `A4`;
`S5`,`S6` → the slot's own recorded claims (`AGENTS.md` § Commands' rule that nothing is recorded
un-run); `S9`,`S10` → `A2`, `A6`; `A5` (no second spelling) is **not** independently re-measured here —
it is a code-hygiene criterion with no user-visible surface, and QE measured it. That is stated as a
limitation below, not hidden.

## Known limitations — said BEFORE any signature, not after a dispute

1. **This ticket did not make `npm run chess --ascii` work.** It made the page **tell the truth about
   it**. A reader who omits `--` still gets a default board and exit `0`; the discarded flag is the
   package runner's behaviour and is out of scope by the ticket's own words. **The mitigation is a
   sentence in a document, and documents are not enforcement.**
2. **The guard reads the FIRST `Dev / run` slot only.** A second slot appended after it is invisible
   (QE `Q7`, ticketed as `ABC-071`).
3. **The guard's scored window has no upper bound.** An HTML comment left unterminated silently
   extends the region and the suite still passes (QE `Q8`, ticketed as `ABC-067`). **Re-confirmed
   independently at this hop** — see the falsification note.
4. **The guard is coupled to two rendering conventions of `AGENTS.md`** — the invocation must stay
   backticked, and no `--`-prefixed token may be *named* in the slot unless the program accepts it,
   even to say it does not exist. Both fail loudly and safely; neither is written where a Scribe would
   see it (QE `Q9`, ticketed as `ABC-069`).
5. **The pack does not exercise `npx`, a global install, or any distribution path.** Distribution is
   undecided (`ADR-0007` clause 5, `EPIC-006`). Everything here is `npm run` from a clone.
6. **No performance claim is made or re-measured.** `N8-LANE` stands at the ticket's own figure; this
   ticket added zero test files and zero child processes, so there is no new lane cost to attribute.
7. **`A5` is carried from QE, not re-measured here** (see above).
8. **`ABC-065` § Dependencies is still stale on its own page** — it says `AGENTS.md` "IS CLAIMED RIGHT
   NOW BY ANOTHER HOP" and forbids pulling a ticket that has already merged (`G12`, ticketed as
   `ABC-070`). A reader scoring this pack against that section will be misled by the ticket, not by
   the product.

## Rollback plan

**Revert `460b9f5` (the merge), or the two delivered commits `39122ec` and `c5a5493`.** Cost and blast
radius are as small as they get: **zero production lines**, one documentation slot and one added test
block, `85 0` pure append in `src/cli.test.ts`. Reverting restores the pre-`ABC-065` page and drops the
guard; **it breaks nothing a user runs** — `npm run chess` and every option behave identically either
way, because no product code changed. There is nothing deployed to roll back (`ADR-0007`: this project
deploys nowhere), no data migration, no released artifact.

**The honest asymmetry:** rolling back is cheap because the change is documentation plus a test. That
is also why a rollback buys nothing — it would simply reinstate the defect.

## Signoff checklist — the named human role that accepts

**The role that accepts is the PROJECT OWNER.** This is not a delegable engineering signature: the user
in this ticket is *the reader of `AGENTS.md`*, and the owner is the only named human in this project's
record who has ever met the product that way (his own hand found `ABC-066` at a terminal). No agent
signs this — see the `decision` note in this task, and `AGENTS.md` § Test and UAT authority.

| # | the owner ticks | scored by whom |
|---|---|---|
| `C1` | I opened `AGENTS.md` § Commands and the `Dev / run` slot showed me a complete command that passes an option. | owner, by reading |
| `C2` | I pasted that command and it ran — exit `0`, a board. | owner, at a terminal |
| `C3` | Every option the slot lists works when I run it the way the slot shows. | owner, at a terminal |
| `C4` | The slot's warning about leaving out `--` is true when I try it. | owner, at a terminal |
| `C5` | I accept the eight known limitations above, and specifically that `--ascii` without `--` is still silently discarded and that the fix for it is a sentence, not a mechanism. | owner, by judgement |
| `C6` | I accept the three guard weaknesses (`ABC-067`, `ABC-069`, `ABC-071`) as **ticketed follow-ups rather than blockers of this acceptance**. | owner, by judgement |
| `C7` | I am content that no previously accepted criterion of `ABC-042` moved to make this pass. | owner, on the evidence |
| `C8` | **`In UAT` exit:** I accept `ABC-065`, or I redefine what this project's `In UAT` exit signature is. | **owner only** |

**`C8` is the one that moves the board.** `C1`–`C7` are the evidence; the agent has conducted every one
of them and reported measurements (next note), and **that conduct is not a tick.**

## Exit criteria

- **Exit to `Ready to Release`:** every scenario `S1`–`S10` passes on `main`, **and** the owner has
  ticked `C8`. The first half is agent-conductable and is done; **the second half is not the agent's
  and has not happened.**
- **Exit back to development:** any of `S1`–`S6` fails, or `S10` fails (an accepted criterion was
  disturbed). None did.
- **Exit blocked / escalate:** acceptance criteria missing or ambiguous. Did not fire — `A1`–`A6` are
  present and `A2` was re-fenced by content before this hop began.

## `agent-factory/checklists/uat-checklist.md`, worked through

| checklist item | state |
|---|---|
| UAT goal clear | **yes** — two business questions above |
| entry criteria met | **yes** — `E1`–`E5`, all verified, not assumed |
| business scenarios listed | **yes** — `S1`–`S10`, in the reader's voice |
| test data ready | **yes** — the option vocabulary, read from `ACCEPTED_ARGUMENTS`, not transcribed |
| expected results clear | **yes** — PASS/FAIL columns judgeable from a terminal |
| known limitations listed | **yes** — eight, before signature |
| rollback known | **yes** — revert two commits; zero production lines; nothing deployed |
| signoff person/role known | **yes** — the **project owner**; `C8` is his alone |
| exit criteria clear | **yes** — and the exit is **held open** pending `C8` |
