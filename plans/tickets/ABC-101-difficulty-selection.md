---
id: ABC-101
title: Difficulty — the user-facing selection only; the engine budget behind it is EPIC-004's
status: backlog
column: Backlog
size: M
priority: P2
epic: EPIC-006
feature: —
---

# ABC-101 — `--difficulty <level>`: the flag, the level set, the default, and what the human is told

> **Cut 2026-08-16 by BA/PM** (task `epic-to-tickets-EPIC-006-packaging`, Workflow 03).
>
> **THE SUBJECT BOUNDARY IS THE WHOLE POINT OF THIS TICKET.** What is here: the flag, the accepted
> level set, the default, how the level persists across a session, and what the human sees. What is
> **not** here and is `EPIC-004`'s: **search depth, time budget, blunder rate, evaluation strength**
> — `EPIC-004` § Scope already owns them in one line (*"Difficulty levels that map to a search budget
> plus a blunder rate"*). `EPIC-004` is being decomposed in parallel; **it is depended on BY NAME AND
> BY BEHAVIOUR below and by no ticket id**, because its ids do not exist yet and a guessed id is
> worse than an unresolved one.

## Problem

*User*: a beginner who wants to win sometimes, and the club player the engine is aimed at.

*Pain, measured against merged code:*

- **`--difficulty` is an unrecognised argument today.** `ACCEPTED_ARGUMENTS` in
  `src/cli-options.ts:46-53` is a closed six-element enumeration (`--ascii`, `--unicode`,
  `--colour`, `white`, `black`, `random`) and every token outside it hits the default branch
  (`:136-138`) and is rejected with a usage error. `ABC-042`'s scope table says so outright —
  *"anything else, including `--difficulty` | rejected with a usage message naming the offending
  argument, non-zero exit, no frame"* — and `src/cli.test.ts:383` spawns `--difficulty 3` as a
  **rejection** fixture.
- **So `EPIC-006`'s acceptance criterion 4 — *"Given `--colour black --difficulty 3`"* — is not met
  and cannot be met by any merged code.** That criterion is also where the level set's shape comes
  from: it names `3`, so levels are **ordinal integers**, not adjectives. That is read off the epic,
  not chosen here.

*Value*: the epic's own user-value sentence (*"choose colour and difficulty"*) and `EPIC-004`'s
(*"weaker difficulty levels selectable below it"*). **An engine with strength levels nobody can
select has no strength levels.**

## THE CONSTRAINT THIS TICKET MAY NOT CONTRADICT — `RISK-002`

`plans/nfr-catalog.md:536-541`: **`RISK-002` = GO WITH CONSTRAINT**, and `EPIC-004`'s per-move
budget **must be time-based (iterative deepening against a wall clock), not depth-based** — *"a fixed
depth would blow `NFR-004`'s 3-second ceiling on exactly the machines least able to absorb it …
Inherited by `EPIC-004` as non-negotiable."*

**Consequence for this ticket, stated as a rule an engineer can check:** a level here is an
**opaque ordinal**. This layer attaches **no depth, no millisecond count and no node count** to it —
it does not know what a level means, and that is deliberate rather than unfinished. **A level
defined as "depth 4" would contradict a surviving risk mitigation**, and `A7` below fails a build
that does it.

## The four product rulings this ticket makes, and the one it refuses to make

**BA/PM, 2026-08-16.** These are user-facing selection calls, which the subject boundary puts here.

1. **The levels are integers `1`…`5`, weakest to strongest.** `EPIC-006` criterion 4 names `3` as
   valid, so the set contains at least three and is numeric. Five gives a beginner rung, a club rung
   and three between. **Cheap to change** — the criteria below read the set off one exported
   constant, so moving to 3 or 8 edits one array and no test.
2. **The default, when the flag is absent, is `3` — the middle, NOT the strongest.** Read off
   `NFR-004` rather than preferred: it bars *"≤ 3 s at **default** difficulty; hard ceiling **5 s** at
   **any** difficulty"*. **Two different bars have content only if some level is slower than the
   default**, so the default cannot be the maximum. *(The counter-argument, recorded: `EPIC-004`'s
   user value calls club strength the product, which argues for defaulting to the top. It loses to a
   ratified NFR row, and it is the owner's to overturn.)*
3. **The level is fixed for the session.** Chosen once at startup, never changed mid-game; there is
   **no `difficulty` session command** and none is cut. *(A mid-session change would mean the engine's
   strength changes between two plies of one game, which no epic asks for — coding rule 5.)*
4. *(WITHDRAWN 2026-10-12 by BA/PM: on a TTY the line is overwritten by the first frame
   (`src/frame.ts:236-240`). This MVP shows the level nowhere. The player typed it, and a wrong value is
   refused by name. A panel cell stays a separate ticket against the frame contract, if the owner wants
   one.)* ~~**The human is told once, at startup, on the line above the first board — not in the status~~
   panel.** The panel is redrawn every ply and its shape is `ADR-0009`/`ABC-041`'s merged frame
   contract with `NFR-002` over it; a per-frame cell for a value that **cannot change** (ruling 3)
   buys nothing and re-opens a gated module. *(Counter-argument, recorded: most chess UIs show the
   level permanently. If the owner or `EPIC-004` wants it in the panel, that is a separate ticket
   against the frame contract, not a quiet widening of this one.)*

**The ruling this ticket REFUSES to make: what a level *does*.** The mapping from ordinal to search
budget and blunder rate is `EPIC-004`'s, it must be time-based per `RISK-002`, and **it is not
guessed here in any form.**

## Scope

- **`--difficulty <1|2|3|4|5>` added to the closed enumeration** in `src/cli-options.ts`, in the
  established `--colour` shape: the flag and its value words are members of `ACCEPTED_ARGUMENTS`, so
  the accepted set stays **closed** and the default branch keeps rejecting everything else.
- **`ResolvedOptions` carries the chosen level** — one ordinal field, defaulted per ruling 2.
- ~~**One startup line** naming the level, above the first frame (ruling 4).~~ *(Struck 2026-10-12, BA/PM
  re-score: on a TTY the first frame starts with cursor-home, so the line is overwritten. See § Re-score.)*
- *(Added 2026-10-12)* **The level reaches the engine.** The composition root's `engine:` is built from
  `LEVELS[level]` through `createLevel` (`ABC-087`, `src/levels.ts:110`). It is wrapped as an `EngineSeam` the
  way `createEngine` wraps `chooseMove` (`src/engine.ts:518-523`), with the seed taken from
  `Math.floor(Math.random() * 2 ** 32)` (`ADR-0037` D3).
- **The `USAGE` literal** in `src/cli.ts:57` gains the new option, keeping the `--` separator
  (`ABC-066`'s repair) and staying a runnable command.
- **The three merged guards this necessarily trips**, updated as part of this ticket rather than
  discovered by the gate — see `## The guards this ticket will red, named in advance`.
- **`AGENTS.md` § Commands, `Dev / run`**: the option list in that slot is compared against
  `ACCEPTED_ARGUMENTS` at run time by `ABC-065`'s guard. It must document `--difficulty` **and the
  form must be run before it is written** (that slot's standing rule).

## Out of scope

- **Anything the engine does with the level** — `EPIC-004`, by name and by behaviour. This ticket
  ships a value that reaches no engine, and says so.
- **A startup PROMPT for difficulty.** `EPIC-006` § Scope says *"via prompt or CLI flags"* and **no
  prompt exists for colour either** (`ABC-042` resolves `random` before the loop and prompts for
  nothing). Cutting a prompt for difficulty alone would be inconsistent scope. **Recorded as a gap,
  owner BA/PM at the next refinement**, not smuggled in here.
- **Changing `EngineSeam`** (`src/turn-loop.ts:138`) so the level can reach the engine — see
  Dependencies. **That is a contract change to a `Done`, gated module and it is Architect/Design's
  own ticket**, exactly as `ABC-046` fences shape (b).
- **A status-panel cell for the level** — ruling 4, and a separate ticket if ever wanted.
- **Any NFR-004 measurement.** Nothing here searches.

## Acceptance (Given/When/Then)

- **`A1` (the flag is accepted, both orders, and reaches the resolved options).** **Given**
  `--colour black --difficulty 3` **and** `--difficulty 3 --colour black`, **when** `resolveOptions`
  runs, **then** both return `ok: true` with the same `{ colour: "black", difficulty: 3 }`.
  *(`EPIC-006` acceptance criterion 4's exact command line, and the reversed order, because a
  positional implementation passes one and fails the other.)*
- **`A2` (the default is 3 and is asserted as a value, not as a spelling).** **Given** an empty
  argv, **then** the resolved difficulty equals the exported default constant **and** that constant
  equals the middle element of the exported level set. *(Ruling 2 made mechanical: a build that
  defaults to the maximum fails.)*
- **`A3` (the accepted set is closed — every level in, everything else out).** **Given** each member
  of the exported level set, **then** `ok: true`. **Given** `0`, `6`, `-1`, `3.5`, `three`, and a
  bare `--difficulty` at the end of the line, **then** each returns `ok: false` with the offending
  token named and **no** resolved options. *(`0` and `6` are the boundary pair; a
  `parseInt`-and-hope implementation accepts both.)*
- ~~**`A4` (one startup line, and exactly one).**~~ *(STRUCK 2026-10-12 with ruling 4. On a TTY tall
  enough for the frame, `beginFrameSession` writes `CURSOR_HOME` before every frame (`src/frame.ts:236-240`),
  so a line printed above the first frame is overwritten before the player can read it. A spawned child's
  stdout is not a TTY, so it takes the append path, where this criterion would have passed. That is a green
  test for something no interactive player sees. Text kept below for one re-score.)*
  ~~**Given** `npm run chess -- --difficulty 5`, **when**~~
  the process runs, **then** stdout's **first** line names the level, the frame follows it
  unchanged, and the total row count is **the previous count + 1** — asserted against
  `ABC-042`'s merged row-count assertion, updated by this ticket, not deleted by it.
- **`A5` (the usage line still runs).** **Then** `USAGE` contains the new option and the `--`
  separator, and the command it prints, typed verbatim, **exits 0** — `ABC-066`'s bar, re-asserted
  because this ticket edits that literal.
- **`A6` (the documented option list matches the code).** **Then** `npm test` is green with
  `AGENTS.md`'s `Dev / run` slot documenting the new option — the `ABC-065` guard reads
  `ACCEPTED_ARGUMENTS` at run time, so a code-only change reds it and a docs-only change reds it too.
- **`A7` (NO DEPTH, NO CLOCK, NO NODES — the `RISK-002` fence).** **Then** `grep -niE
  'depth|ply|millisecond|\bms\b|nodes?/sec|budget' src/cli-options.ts` returns **zero** matches
  outside comments that cite this ruling, and `ResolvedOptions`' difficulty field is a plain ordinal
  with no unit in its name or type. *(The instrument is a grep and it is deliberately crude; the
  criterion it guards is that this layer attaches no meaning to a level.)*
- **`A8′` (the level reaches the engine, and nothing in `EPIC-004` moves)** *(replaces `A8`, 2026-10-12)*.
  - **Given** each level `N` in `1`…`5`, a seed `s` and an injected clock, **when** the seam the root builds
    for `N` is asked for a move, **then** it returns the move `createLevel(LEVELS[N], { seed: s, now })`
    returns on the same position. This is asserted for every `N`, on at least one position where level `1`'s
    first draw blunders.
  - **Given** no `--difficulty`, the root builds level `DEFAULT_LEVEL` (3), and
    `LEVELS[DEFAULT_LEVEL]` equals `{ budgetMs: DEFAULT_BUDGET_MS, blunderRate: 0 }` by value. So a session
    started without the flag plays as it does today.
  - The table is read only with `Object.hasOwn(LEVELS, level)` (§ Security, forward note).
  - **`src/turn-loop.ts`, `src/engine.ts`, `src/levels.ts`, `src/search*.ts` and `src/evaluate*.ts` are
    byte-identical**, and `EngineSeam` is unchanged.
- *(Added 2026-10-12)* **`A10` (`EPIC-006` criterion 4, on a real child).** **Given**
  `node src/cli.ts --colour black --difficulty 1 --ascii`, **when** the child starts, **then** no prompt
  appears, the engine moves first as white with a legal move, and the child exits **0** on `quit`. This is a
  `CLI_DEEP` row in `src/cli.real-engine.test.ts`, never the default lane.
- *(Added 2026-10-12)* **`A3`, extended:** the accepted level words equal `Object.keys(LEVELS)`. A test reads
  both, so the flag and the table cannot drift apart.
- ~~**`A8` (the level reaches no engine, and that is asserted rather than assumed).**~~ *(STRUCK
  2026-10-12. `EPIC-004`'s mapping landed with `ABC-087` (`b696d8e8`), and a flag that changes nothing is no
  longer the slice.)* **Then**
  `src/turn-loop.ts` is **byte-identical**, `EngineSeam`'s signature is unchanged, and no module
  under `src/` reads the difficulty field except the entry point and its own tests.
  *(This ticket ships a selection with no effect. Making the effect real is `EPIC-004`'s and a seam
  change; asserting the seam did not move here is what keeps the two apart.)*
- *(`A9` amended 2026-10-12: the allowed set is `src/cli-options.ts`, `src/cli.ts`, `src/cli.test.ts`,
  `src/cli.real-engine.test.ts`, `AGENTS.md`, and **at most one new flat `src/` module** for the level
  adapter, if the Engineer does not put it in `src/cli.ts`. New test files: **0**, or 1 if declared before
  the reading.)*
- **`A9` (nothing else changed).** `git diff --numstat` shows `src/cli-options.ts`, `src/cli.ts`,
  their two test files and `AGENTS.md` — and nothing else. Suite green, skip **0**.

## The guards this ticket will red, named in advance

**Every one of these is a merged guard doing its job.** They are listed so the engineer updates them
deliberately instead of meeting them at the gate:

| guard | why it reds |
|---|---|
| `src/cli.test.ts:410-412` | set equality between `ACCEPTED_ARGUMENTS` and `TABLE`, the transcribed scope table. New tokens must be added to both |
| `src/cli.test.ts:884` | every accepted argument must be exercised by a spawned child — the new tokens need invocations |
| `src/cli.test.ts:931-956` (`devRunSlot`) | `AGENTS.md`'s documented option list is compared to `ACCEPTED_ARGUMENTS` at run time. **`ABC-065`'s own board row predicted this exact failure: *"the failure that arrives the day `EPIC-006` adds an option reds with `expected 3 to be greater than or equal to 4`"*** |
| `src/cli.test.ts:383` | `--difficulty 3` is currently a **rejection** fixture. It becomes an accepting one; the rejection fixture must be replaced with a token that is still unrecognised |
| `ABC-042` `A6`'s scope table | its `"anything else, including --difficulty"` row is superseded by this ticket and must be annotated on that merged page, not silently contradicted |

## Dependencies

- **`EPIC-004`, BY NAME AND BEHAVIOUR — NOT by ticket id.** Two things are owed by it and neither is
  guessed here: **(1)** the mapping from ordinal level to a **time-based** search budget plus blunder
  rate, and **(2)** whether five levels are distinguishable in play at all. *(Its ids are being
  minted in parallel with this hop. If its decomposition collapses the set to three rungs, ruling 1
  moves and this ticket's criteria follow it — one array.)*
- **A CONTRACT GAP, NOT AN ORDERING: `EngineSeam` cannot carry a difficulty.** It is
  `(history: GameHistory) => Promise<Move>` (`src/turn-loop.ts:138`) in a `Done`, gated,
  mutation-tested module. **Something must change for a level to reach an engine, and this ticket
  does not choose what** — a curried seam built at startup, an added parameter, or an options object.
  **Owner: Architect/Design, jointly with `EPIC-004`'s decomposition.** Recorded, not resolved.
- **`ABC-042` is MERGED** and supplies `ACCEPTED_ARGUMENTS`, the closed-enumeration shape, the
  rejection path and the row-count assertion this ticket extends.
- **`ABC-065` and `ABC-066` are MERGED** and supply the two documentation guards `A5`/`A6` answer to.
- **`ABC-043` is OPEN and is NOT a blocker.** This ticket needs no running game — it resolves a flag
  and prints a line. **That is why it can be built before the engine exists.**

## Security / NFR triggers

- **`NFR-004` — NOT MEASURED HERE, and named so nobody thinks it was.** *"≤ 3 s at default
  difficulty; hard ceiling 5 s at any difficulty"* is `EPIC-004`'s to meet. **This ticket's only
  obligation to it is ruling 2**, which is derived from it. Nothing here searches, so there is
  nothing to time.
- **`N8-LANE`, inherited by name** — ≤ **650 ms CPU**, same instrument and protocol.
- **`NFR-002` — not triggered.** No frame is composed and the status panel is untouched (ruling 4);
  `A8`'s byte-identical `turn-loop.ts` and the untouched `src/status-panel.ts` are the guards.
- **Security — TRIGGERED, and already fenced by merged work.** A new argument is new outside input.
  It is covered by `ABC-042`'s three bars: `resolveOptions` stays the **exclusive** validator (ASVS
  **V2.2.2 [L1]**), the accepted set stays **closed** (`A3`), and any echoed token stays filtered by
  `printableOf`. **Firing threshold: it fires if the level is parsed anywhere other than
  `resolveOptions`, or if the accepted set becomes open (a regex or a `parseInt` range instead of an
  enumeration).**
- **FORWARD NOTE (2026-10-10, BA/PM, `bapm-owed-batch-2026-10-10`; from Security/NFR's `ABC-087`
  ruling 7, `.grugops/context/secnfr-ABC-087/notes/…3f1974f5`, on `grugops/ABC-087-difficulty-levels`
  until it merges).** It binds whichever hop first indexes `ABC-087`'s `LEVELS` table with a user's
  choice. That may be this ticket, if `A8` is ever relaxed, or the `EPIC-006` wiring hop.
  - **Look up only by the validated own integer key** that `resolveOptions` returned, with
    `Object.hasOwn(LEVELS, level)`, and refuse anything else.
  - **Why:** `LEVELS["constructor"]` and `LEVELS["__proto__"]` return prototype members, and
    `createLevel` turns them into an always-blunder level without throwing. Re-measured here on a
    frozen object of the same shape: `hasOwn` is `false` for both, and `true` for `3`.
  - `A3`'s closed set already refuses those tokens at the flag. This rule covers any other route to
    the table.
  - **Also re-read `AR-NFR004-A`** (Security/NFR's) the first time a played move goes through a
    level.
  - **DoR not re-scored** by this note.

## Test notes

1. **`A3`'s boundary pair (`0` and `6`) is the criterion that catches the likely implementation.**
   A `Number(token)` with a range check passes everything else and accepts `3.0`, `+3` and `03`.
2. **`A1` must assert both argument orders.** `--colour` consumes its value by index; a difficulty
   arm written by copy-paste is easy to get right, and a positional shortcut is easy to get wrong.
3. **`A4` extends `ABC-042`'s spawn harness. Do not build another**, and update the row count rather
   than loosening the assertion to `toBeGreaterThan`.
4. **`A7` is a grep and will produce false positives on prose.** Keep the ruling's citation in a
   comment the grep tolerates, or the criterion becomes a nuisance and gets deleted — which is the
   failure mode it exists to prevent.
5. **Do not write a test that asserts what a level does.** There is nothing to assert; `A8` says so.
   *(Amended 2026-10-12: assert that the root's seam is EQUIVALENT to `createLevel` for each level (`A8′`),
   and never that a level is strong or weak. Strength is `ABC-085`/`ABC-146`'s.)*

## Lane cost — how many test FILES this ticket implies

**Zero new files.** `A1`–`A3` and `A7` extend `src/cli-options.test.ts`'s cases inside
`src/cli.test.ts`'s existing structure; `A4`–`A6`, `A8`, `A9` extend the entry-point file. No
`vi.mock`, so **no `*.nfr.test.ts`**. **Weight: nil** — it adds no file. Cost is a couple of dozen
cases at the published per-test figure (**0.35–0.43 ms per test**, `plans/nfr-catalog.md`) —
arithmetic over a published floor, **not a new measurement**.

## Size and priority rationale

**Size `M` (3).** Larger than it first reads: one enumeration extension and one field, **plus five
merged guards to update deliberately** (the table above), a documentation slot whose form must be
**run before it is written**, and four product rulings that have to be written down so `EPIC-004`
does not re-derive them. Calibrated against `ABC-042` (`M`), whose entry-point work it extends.

**Not `XL`. The split line if it moves:** **(a)** the flag, the level set and the default —
`A1`–`A3`, `A7`; **(b)** the startup line, `USAGE`, `AGENTS.md` and the guards — `A4`–`A6`, `A8`.
**(a) is `S` and (b) is `S`**, and (a) is the half with the product content.

**Priority `P2`.** The player can play at whatever strength the engine has; difficulty is a
refinement of an opponent **that does not exist yet**. `P2` on this board is the drop-first tier
(`ABC-017`, `ABC-021`), and this ticket belongs in it: shipping it before `EPIC-004` gives a human a
flag that changes nothing. **Promote to `P1` the day `EPIC-004`'s level mapping lands** — that is the
trigger, named so nobody has to feel it.

## Definition of Ready

Assessed against `agent-factory/checklists/definition-of-ready.md` by BA/PM at the cutting hop,
**2026-08-16**. **Result: 7 of 10 clean, 3 recorded ⚠️ — NOT MET; stays in `Backlog`.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** the flag is rejected today, read off `src/cli-options.ts:46-53` and `src/cli.test.ts:383`; epic criterion 4 is unmet and names the level shape |
| 2 | scope and out-of-scope clear | **✅** five scope items, five fences — including the prompt path recorded as a gap rather than smuggled in, and the `EngineSeam` change fenced as Architect/Design's own ticket |
| 3 | INVEST-shaped | **⚠️** valuable, negotiable, estimable, small, testable — **not independent**: its meaning is `EPIC-004`'s, though its build is genuinely unblocked |
| 4 | acceptance testable and measurable | **✅** nine criteria: two argument orders to one identical object, a default asserted as the set's middle element, a `0`/`6` boundary pair plus four malformed values, row count = previous + 1, a usage line that exits 0 when typed, a zero-match grep, `turn-loop.ts` byte-identical |
| 5 | dependencies known | **✅** `EPIC-004` depended on **by name and behaviour with no id guessed**, the `EngineSeam` gap named with its owner, three merged tickets named as suppliers, and `ABC-043` explicitly named as **not** a blocker |
| 6 | security/NFR triggers with a measurable target | **✅** `N8-LANE` ≤ **650 ms CPU**; `NFR-004` named as not measured here with the reason; `NFR-002` not triggered with a byte-identical guard; security triggered with ASVS **V2.2.2 [L1]** and a falsifiable firing threshold |
| 7 | test notes present | **✅** five |
| 8 | size assigned | **✅** `M` (3), calibrated against `ABC-042`, with the split line named |
| 9 | priority assigned | **✅** `P2`, with a named promotion trigger |
| 10 | no major unresolved blocker | **⚠️⚠️ TWO, and neither stops the build.** **(a) `EPIC-004` owes the level→budget mapping**, so this ships a selection with no effect (`A8` asserts it). **(b) `EngineSeam` cannot carry a level** — a contract question on a `Done` module, owner Architect/Design, **not resolved here** |

**Not inflated.** Items 1–9 are clean because the selection layer is fully specified and buildable
today. Item 10 is honest: **this ticket delivers a flag that does nothing until `EPIC-004` lands**,
and pretending otherwise would be smoothing.

## Re-score — 2026-10-12

BA/PM (task `wave-2026-09-25`, subtask `bapm-rescore-backlog-product`, Workflow 07), at `main` `1eb2edbc`.
This is the first re-score since the cut on 2026-08-16. **Result: 10 of 10. Recommended for `Ready`. `M`.
Priority `P2 → P1`, because the page's own promotion trigger has fired.** The front matter still reads `P2`. The
board row and front matter are the Orchestrator's to sync. Readings and commands:
`.grugops/context/bapm-rescore-backlog-product/notes/`. No timing was read.

**Item 10 (a), `EPIC-004` owes the level mapping: DISCHARGED.**
- `ABC-087` merged as `b696d8e8`. `src/levels.ts:42-52` exports `LEVELS` keyed **1–5** (budgets 100 / 500 /
  3,000 / 4,000 / 4,500 ms; blunder rates 0.4 / 0.2 / 0 / 0 / 0), with `DEFAULT_LEVEL = 3`,
  `EASIEST_LEVEL = 1` and `HARDEST_LEVEL = 5`. That matches rulings 1 and 2 exactly.
- The budgets are time-based, which is `RISK-002`'s constraint. The hardest level stays under
  `HARD_CEILING_MS` = 5,000 (`src/engine.ts:129`).
- **The promotion trigger ("the day `EPIC-004`'s level mapping lands") has fired: `P1`.**

**Item 10 (b), `EngineSeam` cannot carry a level: DISCHARGED, and no contract change is needed.**
- `createLevel(level, { seed, now })` returns a per-instance closure over a `Position` (`src/levels.ts:110`).
  That is the "curried seam built at startup" shape the page named first.
- Turning it into an `EngineSeam` (`src/turn-loop.ts:150`) takes a wrapper the size of `createEngine`, which is
  5 lines at `src/engine.ts:518-523`. `EngineSeam` does not move.
- The seed source is already ruled: `ADR-0037` D3, "when `ABC-101` wires a level", `Math.floor(Math.random() *
  2 ** 32)`.

**Item 3 (independence): ✅. The owner's 2026-10-10 word confirms the vocabulary.**
- "Levels 4 and 5 run as specified" chose option (a) on `ABC-085` `A2`. Option (b), re-cutting the levels above
  the default, was the one that would have changed this ticket's vocabulary. It was refused.
- A RED 3v4 or 4v5 in `ABC-146`'s verdict is `ABC-087`'s finding. Any later change to the level set moves one
  array, and the extended `A3` follows it. **This ticket does not wait for `ABC-146`.**
- **Owner question 5 is answered** (book over level, KEEP, `…b7c41e09` item 4). When both this ticket and
  `ABC-095` have landed, `engine:` is `ABC-095`'s decorator around this ticket's level seam.

**Scope changed, by BA/PM ruling:**
- **The flag now takes effect.** `A8` is replaced by `A8′`, and `A10` is added.
- **The startup line is cut.** Ruling 4 is withdrawn and `A4` is struck. The reason is measured: in-place
  redraw overwrites it on a TTY (`src/frame.ts:236-240`). One consequence: `ABC-042`'s row-count assertion is
  **no longer touched**.
- A selection that "reaches no engine" was the right slice only while there was no engine. Shipping it now
  would be a flag that changes nothing, which is not valuable (INVEST).
- **Negotiable:** if the owner wants the level visible during play, that is a separate ticket against the frame
  contract. This is not an owner question that blocks the ticket.

**Every guard line the page cites, re-located at `1eb2edbc`:**

| page said | today |
|---|---|
| `src/cli-options.ts:46-53` (6 tokens) | `:46-53`, the same 6 tokens |
| default branch `:136-138` | `:136-138` (`return reject(UNRECOGNISED, token)` at `:138`) |
| `src/cli.ts:57` `USAGE` | `src/cli.ts:88` |
| `src/cli.test.ts:383` rejection fixture | `CHILDREN.difficulty` at `:703`, used at `:1212` (`A6(iii)`) |
| `src/cli.test.ts:410-412` TABLE equality | `:1236-1241` |
| `src/cli.test.ts:884` every argument spawned | `:2087-2090` |
| `src/cli.test.ts:931-956` `devRunSlot` | `:2110-2141` |
| `src/turn-loop.ts:138` `EngineSeam` | `:150` |

**Size `M` holds.** Taking the startup line and the row-count churn out roughly pays for the adapter and one
`CLI_DEEP` row. The split line, if needed: **(a)** flag, set and default (`A1`–`A3`, `A7`); **(b)** wiring,
`USAGE`, `AGENTS.md` and guards (`A5`, `A6`, `A8′`, `A9`, `A10`). Each half is `S`.

**Triggers:**
- **Production lines (`src/cli.ts`, `src/cli-options.ts`), so the owner's UAT word is needed.**
- **`In Security/NFR`:** the forward note's `Object.hasOwn` rule now binds, and **`AR-NFR004-A` is re-read**
  the first time a played move goes through a level, which happens here.
- `CLI_DEEP` runs at QE, as it does after any `src/cli.ts` change.
- **`ABC-146` is not made stale.** `src/levels.ts`, `src/engine.ts` and the engine trigger list stay
  byte-identical (`A8′`).
- **File overlap with `ABC-095`** on the same `engine:` expression. Build them in sequence, not in parallel.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ the flag is still refused today (`CHILDREN.difficulty` is a rejection fixture) |
| 2 | scope and out-of-scope clear | ✅ re-drawn: wiring in, startup line out |
| 3 | INVEST-shaped | ✅ *(was ⚠️)* independent: the mapping is merged and the vocabulary is confirmed |
| 4 | acceptance testable and measurable | ✅ `A8′` equivalence on an injected clock and seed; `A10` on a real child |
| 5 | dependencies known | ✅ |
| 6 | security/NFR triggers with a measurable target | ✅ `N8-LANE`; `Object.hasOwn`; `AR-NFR004-A` re-read |
| 7 | test notes present | ✅ (note 5 now reads: assert equivalence to `createLevel`, never a strength) |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ **`P1`** (the trigger fired) |
| 10 | no major unresolved blocker | ✅ *(was ⚠️⚠️)* |
