---
id: 20260812T010000Z-software-engineer-artifact-ref-3c81f0a2
kind: artifact-ref
by: software-engineer
at: 2026-08-12T01:00:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-017-dev
  - abc017-pull-2026-08-11
  - ABC-017
  - ABC-016
  - ABC-018
  - ABC-027
  - ADR-0009
  - ADR-0010
  - src/history-pane.ts
  - src/history-pane.test.ts
  - src/history-pane.nfr.test.ts
  - src/frame.test.ts
  - plans/tickets/ABC-017-bounded-move-history-pane.md
  - plans/traceability.md
  - 20260812T000000Z-orchestrator-decision-b6d29e15
supersedes: 
---

# What was built, what it touched, and every gate command with its exit code

> **HAND-AUTHORED.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. Workflow 16 names `context-io.ts` as
> the only sanctioned writer; it is absent, so this note is written by hand and says so.
> **Nothing here is a `finding`** — no `§14-gate#<id>` stamp exists for this hop.

Three new files and one edited test file on `grugops/ABC-017-history-pane`, a worktree cut from
`main` at `5c0f8f2`. Two commits: `0630d26` and `ebb9f36`. **Nothing merged, nothing pushed,
nothing deployed.**

## The files

- **`src/history-pane.ts`** — 141 lines, **41 of them code.** Three exports:
  - `HISTORY_ROWS = 8` — the pane's constant height, exported because the producer owns its count
    (`ADR-0009` cl. 1) and because `frameHeight` consumes it as a session constant.
  - `HISTORY_COLS = 21` — the pane's constant width. Composed, not written as a literal:
    `MOVE_NUMBER_DIGITS + 1 + (1 + SAN_WIDTH) * 2` = 4 + 1 + 16.
  - `renderHistory(history: GameHistory): string[]` — the whole pane. One `parseFen` of the anchor,
    a forward replay with the core's own `makeMove`, one `toSan` per visible ply, no legal list
    passed, no glyph mode taken, nothing written.
- **`src/history-pane.test.ts`** — 13 tests, `A1`–`A10`, one test each in the ticket's order plus a
  second `A2` for the width invariance and a third for the 0-vs-300 identity.
- **`src/history-pane.nfr.test.ts`** — 7 tests, `A11`'s spied call counts plus the structural
  importer assertion. Its own file for the module-registry reason `N8-LANE` records.
- **`src/frame.test.ts`** — edited, **test-only**, `A13` met in part. See the separate `decision`
  note; the diff is the shadow-constant block, the comment at the `= 23` tripwire, and one new
  `it` for the `<= 24` requirement.

## What was NOT touched, checked rather than asserted

`git diff --name-only main -- src/` names exactly four files, three of them new. **No merged
production module is edited**: `src/frame.ts`, `src/render.ts`, `src/history.ts`, `src/san.ts` and
`src/status-panel.*` are byte-identical to `main` — the last of these because it **does not exist**
on `main`, which is the whole of the `A13` story. `plans/board.md`, `plans/nfr-catalog.md`,
`memory-bank/50-decisions/` and every other ticket file are untouched. `plans/traceability.md`'s
`ABC-017` row is edited in place, **one line changed, pipe count 11 before and after, 36 table lines
before and after** — asserted mechanically before the write, not eyeballed.

`ABC-027`'s claimed line ranges in `src/frame.test.ts` (the screen model, `:374`, `:376`, `:419`,
`:735-771`) were **not** touched. The three regions this ticket edits are the shadow block near the
top, the `= 23` comment, and the end of the `assembleFrame` describe block.

## Every gate command, run on the branch tip, with its exit code

| command | exit | result |
|---|---|---|
| `npm run lint` (`biome check .`) | 0 | 43 files, **0 errors**, 2 pre-existing infos |
| `npm run typecheck` (`tsc --noEmit`) | 0 | clean |
| `npm run build` (`tsc --noEmit`) | 0 | same command as typecheck; `AGENTS.md` says so |
| `npm test` (`vitest run`) | 0 | **697 passed / 697, 24 files** |
| `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | 0 | **0** skipped |

**Baseline re-verified on this worktree BEFORE any code was written**: 676/676 on 22 files, lint 0,
typecheck 0, skip 0 — so every one of the 21 new tests is attributable to this hop and no red is
inherited.

## The claim/queue seam

Claimed per Workflow 17 by atomic `mkdir` of `.grugops/queue/claimed/ticket-to-pr-ABC-017-dev/`.
**The `claimed/` parent was absent and was created first**, as the brief warned it would be — that
is now the third recorded occurrence. `scripts/claim.js` does not exist here, so the `mkdir` and the
`pending → claimed` rename were run directly and the registry record was written by hand.
