---
id: 20260811T200500Z-software-engineer-decision-3e91b7a4
kind: decision
by: software-engineer
at: 2026-08-11T20:05:00Z
verified_by:
confidence: high
refs:
  - ABC-016
  - A2
  - A5
  - A6
  - A7
  - A9
  - A13
  - ADR-0009
  - ADR-0010
supersedes:
---

# How the seven closes were written: BA/PM's two replacements taken as written, ZERO production lines

> **Hand-authored.** `scripts/context-io.ts` — the sanctioned writer Workflow 16 names — does not
> exist in this repo or in the kit, and `mcp__grugops__propose_note` is not among this session's
> tools. Same gap and same disclosure as the five hops before this one. **Nothing in this hop is a
> `finding`**: no verification stamp is issuable to me, and the §14 gate machinery
> `05-pr-quality-gate.md` names as the stamp issuer does not exist in this repo.

## The ruling was implemented, not re-litigated

Every criterion came from `plans/tickets/ABC-016-status-panel.md` at source. **I re-measured what I
wrote rather than trusting my own transcription** — the mutant table is in this hop's `observation`
note — but I ruled on nothing: BA/PM owns these criteria and QE owns the gap report.

## `A7` — the replacement clause, and the three things it deliberately does not say

Implemented as: for every `CASES` entry, render busy and idle from the **same** history and status,
map each busy row through `row.replaceAll(THINKING, " ".repeat(THINKING.length))`, and require the
result to equal the idle rows.

**No `thinking: true` in-check `CASES` entry was added.** QE proposed one; BA/PM measured it kills
1 of 5. The clause renders every case both ways itself, so the axis needs no new entry.

**No row index.** The blanking is a `map` over all rows, not an index into one. That is how the
clause meets `ADR-0010` cl. 5's *"row-3 content does not jump horizontally"* without pinning a
layout `## Acceptance` leaves to the engineer.

**No frame-level term and no width.** It compares two renders of one position; nothing named
`frameHeight`, `W`, `assembleFrame` or `HISTORY_ROWS` appears. **No constant-frame-width criterion
or assertion was added anywhere** — `ADR-0010` cl. 5 refuses one.

**The row-count and per-row-width halves are carried by byte-identity** and are not asserted
separately, exactly as the amended `A7` words it. The struck `widestOf` helper became unused *by my
edit* and was removed with it (the `AGENTS.md` corollary: remove only what your own edit orphaned).
Nothing else in the tree referenced it — grepped.

## `A6` — three single-removal rows, in the table that already existed

`+3` / `+3` / `+5`, appended to `A6`'s existing array so the test that already loops picks them up.
The `ROOK` row's castling field is `KQk` and not `KQkq`, because removing the a8 rook removes
Black's queenside right. **The single joint `+11` FEN was not written**: it survives a compensating
`KNIGHT=4, BISHOP=2`, which I reproduced rather than took on trust.

## `A13` — the depth, and the one place I derived instead of hard-coding

Both counting clauses moved to **≥ 2 plies**. The difference half reuses the 4-ply
`["e2e4","e7e5","g1f3","b8c6"]` already in the file, per the ticket's test note; its baseline is a
**3-ply replay** to the position the panel replays to, and `vi.clearAllMocks()` is called
**immediately before** the bare `toSan`, so the replay's own work never enters `sanAlone`.

The scan clause is stated ply-independently as **`64 + occupiedIn(history.initialFen)`**, with
`occupiedIn` deriving the anchor's piece count from the FEN rather than the test writing `67` and
`96` as literals. That is what makes the depth requirement meaningful rather than a second magic
number, and it is the ticket's own stated reason for the form.

`expect(sanAlone).toBeGreaterThan(0)` went into the **test** and **not** into any criterion, and is
commented as an executable guard on the comment above it — not as a protection of the panel.
`## Security / NFR triggers` gains no part 4.

## The comment repairs — three sites under `src/`, the fourth was BA/PM's

- `src/status-panel.nfr.test.ts` — the *"`A13` is unsatisfiable"* sentence is gone; the block now
  says the difference form **is** the criterion, states the depth requirement and why, records that
  the stale sentence measurably suppressed the probes that found `G4`, and cites **`src/san.ts:104`**
  for the `isInCheck` call. **The `:101` → `:104` correction was verified at source at this hop**:
  `:101` is `function suffix(...)`'s declaration, `:104` is `const check = isInCheck(position);`.
- `src/status-panel.ts` — the `THINKING` doc comment. **Comment only; the diff contains no
  non-comment line, mechanically checked.**
- `src/status-panel.test.ts` — the `A7` rationale that asserted the panel's widest row IS the
  frame's `W` and *"makes the whole frame breathe"* went out **with the assertion it justified**,
  and the replacement comment states what `ADR-0010` cl. 1 actually gives.

## Zero production lines, and what I would have done otherwise

`src/status-panel.ts`'s behaviour is untouched — no expression, no statement, no constant. **Had a
fixture needed a behaviour change I would have stopped and flagged it rather than absorbing it**;
none did, and the fifteen pre-existing snapshots are byte-identical, which is the mechanical
evidence.
