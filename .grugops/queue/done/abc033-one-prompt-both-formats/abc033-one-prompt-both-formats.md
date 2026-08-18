---
task: ticket-to-pr-ABC-033-2026-08-18
subtask: abc033-one-prompt-both-formats
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-033-one-prompt-both-formats-and-the-ambiguity-outcome.md
ref: .grugops/context/ticket-to-pr-ABC-033-2026-08-18/
parent_ref: .grugops/context/wave-p0-chain-2026-08-18/
enqueued_by: orchestrator
enqueued_at: 2026-08-18T12:05:00Z
branch: grugops/abc033-one-prompt-both-formats
base: main @ 16e9269
---

# Subtask: `ABC-033` — one line, two grammars, three outcomes

Read `ticket:` for the work. Read **both** notes in `parent_ref:` before you open a file — they are
my `Ready for Dev` exit review and they carry **first-hand measurements at HEAD `16e9269`**.

This page is **DoR 10/10 with zero ⚠️** — the only such ticket in the requested chain. Nothing is
unresolved and nobody is waiting on a decision. Build it.

## TWO ANCHORS ON THE PAGE ARE STALE. Corrected, measured, do not follow the page

Both are in `src/frame.ts` and both sit in load-bearing places (`A4`, and the security section):

- **the `+N` marker, page says `:182-188`** → **`:134-141`**. `markerFor` at `:134`,
  `withMarker` at `:136`, its `if (hidden === 0) return rows;` no-op at `:137`, `packRegion` at
  `:149`.
- **the sanitizer, page says `:202`** → **`:123`**, `function sanitize(text, mode)`, and it is
  **module-private, not exported**. The security claim is unchanged in substance; only the number
  moved.

Everything else the page cites is **exact at HEAD**: `PromptOutcome` `src/turn-loop.ts:125`,
`parseCoordinateMove` `src/coordinate-move.ts:77`, `CoordinateParseResult` `:51`, `parseSan`
`src/san.ts:223`, `SanParseResult` `:190`, `MESSAGE_ROWS` `src/frame.ts:45`.

**Correct the two stale anchors on the ticket page in a SECOND, SEPARATE commit** — not folded into
the delivery commit, because `A7` is measured against the delivery diff.

## The three criteria that decide this ticket

1. **`A3`'s third row.** *Only the pawn capture is legal; `bxc4` is submitted; it resolves on the
   **exact** attempt and not the fold.* An implementation that folds case first passes rows one and
   two and fails only here. This row is the whole ruling.
2. **`A5`.** `legalMoves` called **exactly once** per submitted line, spied. Four attempts x one
   generation each is the easy wrong build and it is invisible to every content assertion.
3. **`A2`, in two separate assertions.** The candidate content *and*, separately, that
   `toFen(position)` is byte-identical and the ply did not advance. A build that lists the
   candidates and then plays one of them passes a single combined assertion.

## Fences

- **This ticket asks; it does not parse.** No grammar, no token table, no chess logic.
- **Do not trim, do not normalise the line.** Both resolvers already trim (`ABC-032`'s five-entry
  tolerance ruling, 2026-08-18, inherited not re-decided). Hand **one line, unmodified**, to both.
- **Never guess between two legal moves.** Named out of scope on the page precisely because it is
  the cheap implementation and it looks helpful.
- **Do not assert a frame width** (`A4` test note 4). Read the hidden count merged code computes.
  The width is the panels' and this module must not learn it.
- **`o-o` / `o-o-o` fold to `O-O` / `O-O-O` with exactly one candidate — assert it HERE.** Do not
  push it back into `ABC-032`; `parseSan` refuses lowercase deliberately and the 2026-08-18 ruling
  did not widen it.
- **Rejection wording is `ABC-034`'s.** You carry codes, not prose.
- **`A7`: no production change outside your module and its test file(s).**

## If `A4` cannot be met

If any reachable `ambiguous` outcome cannot fit the 2-row message region, that is **a finding for
`EPIC-002`'s frame owner and a new ticket** — not a silent truncation and **not a widening of the
frame**, which would break `EPIC-003` acceptance `4a`. Stop and report it.

## Fixtures

Test note 5: constructing a position where **both** `bxc4` and `Bxc4` are legal is the only fiddly
part. Do it once, name the FEN in the test row, and **round-trip it through `toFen` before
believing it**.

## Gate

`quality.gate_enforcement` is `blocking`. On the branch tip: `npm test`, `npm run lint`,
`npm run typecheck`, `npm run build`, and
`node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count <N>` with `<N>` from
the reporter. Record the real numbers. `PERFT_DEEP=1` **32/32**, skip **0**.
**Do not merge** — the Orchestrator holds the merge and re-runs the gate on `main` after.

## Publish

Typed notes per Workflow 16 into `ref:`. **No `finding` is admissible on this install** — see
`AGENTS.md` § "Role / workflow files". Use `claim` / `observation` / `decision` / `artifact-ref`,
hand-authored per `agent-factory/contracts/context-note.md`. Take the claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` (no `-p`) of
`.grugops/queue/claimed/abc033-one-prompt-both-formats`. Then move this file into it.

Commit on `grugops/abc033-one-prompt-both-formats`, never on `main`.
