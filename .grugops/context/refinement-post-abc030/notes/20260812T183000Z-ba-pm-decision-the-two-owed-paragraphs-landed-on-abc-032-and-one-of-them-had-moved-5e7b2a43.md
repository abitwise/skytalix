---
id: 20260812T183000Z-ba-pm-decision-the-two-owed-paragraphs-landed-on-abc-032-and-one-of-them-had-moved-5e7b2a43
kind: decision
by: ba-pm
at: 2026-08-12T18:30:00Z
verified_by:
confidence: high
refs:
  - ABC-032
  - ABC-037
  - ABC-025
  - ABC-026
  - ABC-019
  - EPIC-003
  - EPIC-006
  - NFR-008
  - N8-LANE
  - src/san.nfr.test.ts
  - plans/nfr-catalog.md
supersedes:
---

# The two owed paragraphs are on `ABC-032`. **One of them had moved a generation since it was written, and transcribing it would have carried a stale name into the ticket that inherits it.** A third was found and routed

> **Hand-authored, no stamp.** No `scripts/context-io.ts`, no `mcp__grugops__propose_note`,
> `human_admission` `off`, no `§14-gate` verdict under this task — **no `finding` on this hop**.

## Where they landed

**Both are on `plans/tickets/ABC-032-parse-san.md`, in a section called
`## The two paragraphs this ticket was owed`, placed at the HEAD of that page's NFR material rather
than in a footnote.** The placement is deliberate and it is the paragraphs' own logic: they were put
on `plans/board.md`'s `EPIC-003` row at `ABC-025`'s `N5` ruling hop **because a warning owned only by
a gate that runs after the work arrives too late**. Burying them at the bottom of a 300-line ticket
would reproduce that exact failure with a different file name.

## (a) The five `N1` rows — carried, and verified rather than repeated

**Verified at the source 2026-08-12:** `src/san.nfr.test.ts` holds **exactly 5 tests**, all inside one
`describe("N1 — toSan generates the legal moves only when it has to (call counts, spied)")`, and the
bar they pin is quoted in the file at `:4-5` — *"the mean `toSan(position, move, legal)` at `P60` is
≤ 1/5 of the mean `toSan(position, move)` over the same 42 moves"*. It is a **structural** guard: it
spies how often `toSan` generates, not how long it takes.

**Why `ABC-032` specifically must carry it, stated on the ticket:** `parseSan` is the **first caller
that will hold a `legal` list and call `toSan` in a loop over it** — `A1`'s round-trip property calls
it once per legal move of every perft position. **The cheapest-looking optimisation from inside that
ticket is to change how or how often `toSan` generates**, and the first thing that happens is five red
rows in a file the ticket did not touch. **The next engineer's cheapest move at that moment is to
delete the row**, and it is the wrong move: the row is the specification, the optimisation is the
regression, and `ABC-025` paid four gates to establish it. If the optimisation is genuinely wanted it
is a **new ticket against `N1`**, argued on its own page.

Made mechanical on the ticket: **`A6` forbids modifying any line of `src/san.nfr.test.ts`,
`src/san.qualifier.hardening.test.ts` or `src/san.suffix.hardening.test.ts`**, and
`## Security / NFR triggers` carries the measurable form — *5 tests, all green, none modified*.

## (b) The lane bar — and **it is `N8-LANE`, not `N5`.** This is the half that had moved

The board row instructs the ticket to inherit **`ABC-025`'s RE-DERIVED `N5` wording** — CPU, net of
the per-file floor, median of paired per-round deltas, n ≥ 7 interleaved, null control by identity —
and **not** the original wall-clock wording, *"which a no-op trips"*.

**Every clause of that instruction is correct, and its NAME is one generation stale.** `ABC-026` says
so itself, in `## What remains` item 1(a): *"`EPIC-003`'s `parseSan` ticket, whose `Backlog` row
currently instructs it to inherit `ABC-025`'s re-derived `N5`; **that instruction now resolves to
`N8-LANE`, same clauses, corrected denominator**"*. `N8-LANE` was seeded in `plans/nfr-catalog.md` at
the Architect/Design hop and is the standing per-ticket bar every ticket inherits from that row
forward.

**So the ticket carries the resolution, not the transcription:**

- **Instrument, statistic, controls and scope: `ABC-025`'s re-derived `N5`, unchanged and with
  attribution** — CPU (user + sys), not wall; median of paired per-round deltas over n ≥ 7 interleaved
  rounds with the sign test beside it; net of the per-file floor; admissible only with an identity null
  control; scope = every file the branch adds under `src/`.
- **Exactly one clause differs — the DENOMINATOR: 5% of `NFR-008`'s TOTAL (13 s CPU → 650 ms), not 5%
  of the lane as it stands.** *n* tickets at 5% of the current lane multiply it by `1.05ⁿ` — 2.65x at
  twenty — with every ticket green.
- **The wall-clock original stays refused, with its measured reason on the page**: its own null control
  by identity read **+0.3% / +3.2% / +0.7%** on a change that is literally nothing, and in one
  interleaved run **two EMPTY test files measured more expensive on the wall clock (+6.0%) than
  `ABC-025`'s entire 24 tests (+4.2%)**. A no-op trips it.

**Had I transcribed the row verbatim, `ABC-032` would have inherited a superseded bar name and the
next gate would have checked it against a wording the catalog no longer carries.** That is the whole
value of reading the ticket the row points at rather than the row.

## The board row's instruction is DISCHARGED

`plans/board.md`'s `EPIC-003` row may retire the two-paragraph clause when it is next written. **That
row is the Orchestrator's and I did not open it.** The discharge is also recorded in
`plans/epics/EPIC-003-move-input-and-controls.md`, so it survives independently of any board rewrite.

## A THIRD owed paragraph, found at this hop and routed rather than left

**`ABC-019` `[D31]` left one question open by name — *does a parser bug end the game?* — and handed it
to "`EPIC-003` and `EPIC-006`, not to a skeleton."** It was not in my brief and nothing on the board
carries it; I found it reading `ABC-019` for the `InputSeam` contract.

**`EPIC-003`'s half is RULED on `ABC-037`:** the prompt **catches nothing**. `ABC-019`'s merged
repair-then-rethrow (`A9b`) runs, the borrowed board is repaired, and the crash surfaces as a crash.
The two rejected alternatives are on the page with their reasons — catching it and returning `rejected`
teaches the player a false rule and hides a defect (the same class `A10` forbids for the engine), and
catching it and terminating quietly is what `[D31]` already called *"the one option that is definitely
wrong"*, because the outcome becomes byte-identical to `A8`'s clean end-of-input. **It costs nothing to
hold this line:** `ADR-0004` (2a) makes `parseSan` total and `ABC-031` `A4` requires the same of the
coordinate reader, **so any throw reaching the prompt is by construction a defect, never a user input.**
`ABC-037` `A5` asserts it — and asserts it **through `runTurnLoop`**, because the repair being asserted
is the loop's.

**`EPIC-006`'s half — what the top-level handler prints and what it exits with — is recorded in
`plans/epics/EPIC-006-game-session-and-packaging.md` against the entry-point ticket named there in
prose.** It is owed by that epic, it now has a written home, and it will not go missing a second time.
