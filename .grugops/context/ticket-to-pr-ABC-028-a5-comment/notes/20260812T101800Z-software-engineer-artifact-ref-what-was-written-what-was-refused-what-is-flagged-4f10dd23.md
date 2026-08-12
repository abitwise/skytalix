---
id: 20260812T101800Z-software-engineer-artifact-ref-what-was-written-what-was-refused-what-is-flagged-4f10dd23
kind: artifact-ref
by: software-engineer
at: 2026-08-12T10:18:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A2
  - ABC-028-A5
  - ABC-029
  - RISK-ABC017-01
  - RISK-ABC028-02
  - src/history-pane.nfr.test.ts
  - plans/traceability.md
  - plans/board.md
supersedes:
---

# What was written, what was refused, and what is flagged rather than fixed

## Written

| path | change |
|---|---|
| `src/history-pane.nfr.test.ts` | **+17 / -14, comment text only.** Two hunks, both inside `:106-123`; **every added and removed line begins `//`** — asserted mechanically, not by eye. md5 `d51b02be9351c8ee8ed5b3436873db68` → `1d33bea667cc792e1fa1fd4030caa718` |
| `plans/traceability.md` | `ABC-028` row, **append-only** to `Code (PR/files)` (+1074 chars), `Tests` (+1198), `Status` (+2491); one new `_Updated:` entry prepended to the stack (57 → 58). **12 cells before and after; append-only proven per cell** against `git show HEAD:` |
| `.grugops/context/ticket-to-pr-ABC-028-a5-comment/notes/` | 5 hand-authored notes, this one included |
| `.grugops/queue/claimed/ticket-to-pr-ABC-028-a5-comment/` | claim dir, `claim.md`, and the subtask file moved in |

**Branch** `grugops/ABC-028-a5-comment`, worktree `../cli-chess-abc028-cmt`. **No other worktree was
entered** — several are live, including the QE hop gating `ABC-029`'s guards in this same file.
Nothing was pushed, merged or deployed; there is no remote.

## Exact lines changed, since the brief asked for them

**Unchanged:** `:103-104` (built ONCE / `beforeEach` clears fixture calls) and the trailing rebuild-cost
sentence, preserved verbatim.
**Replaced:** the old `:106-120` by the new `:106-123` — the two false generalisations, the past-tense
implicature at `:110`, and the stale count at `:112`.
**Byte-identical after the write, verified at source:** the `AT_*` fixtures, `LONG_GAMES`, all eight
`A11` assertions, and **`ABC-029`'s two structural guards at `:299`+ and `:381`+**.

## Gate results, reported exactly as they ran

```
lint       npm run lint        PASS, exit 0 — 2 infos, both pre-existing (below)
typecheck  npm run typecheck   PASS, clean
unit       npm test            PASS, 752 / 752 on 26 files
build      npm run build       PASS, clean (tsc --noEmit; a typecheck wearing the build slot's name)
skip       vitest --reporter=json | jq '.numPendingTests + .numTodoTests'   ->  0
lanes      src/history-pane.test.ts alone 26/26; src/history-pane.nfr.test.ts alone 8/8
digests    src/history-pane.ts c4653c4c… unchanged; src/history-pane.test.ts 9533f050… unchanged
```

**E2E: NOT RUN** — no runnable UI surface until `EPIC-006`, and `quality.ui_e2e` is
`ui-or-critical-path`. Stated rather than invented.

## Flagged, NOT fixed

- **THE LINE MAP MOVED AND THE TICKET IS NOW STALE BY THREE LINES.** The comment block is
  **`:103-123`** (was `:103-120`) and the `AT_*` fixtures begin at **`:124`** (was `:121`), read at
  source **after** the write. Every LIVE reference on `plans/tickets/ABC-028-*.md` is affected:
  `## Scope`, `A2`'s repaired `Given` (`:121`+), `RISK-ABC028-02` (×2, `:121`+ and `:103-120`), `A5`'s
  comment table (`:103-120`, `:118-120`, `:106-108`, `:112`) and the standing obligation at the foot of
  `RISK-ABC028-02`. **The ticket is BA/PM's and I did not open it for edit.** This is the **third**
  time this block's line map has needed correcting; the first two were BA/PM's own errors, this one is
  a real move caused by a licensed edit.
- **The 2 lint infos are `biome.json`'s, not mine** — the config `$schema` says `2.3.0` while the CLI
  is `2.5.5`, and `linter.rules.recommended` is deprecated in favour of `preset`. Pre-existing,
  unrelated, exit code 0. `AGENTS.md` rule 12.
- **A published note in the parent context is contradicted by measurement.** See the sibling
  `observation`; not edited, not superseded, not propagated.
- **`RISK-ABC028-03` still reads `UNKNOWN - verify` on the ticket page** although the `A5` hop measured
  it. Inherited flag, still open, still BA/PM's.

## Refused, and each for a stated reason

- **Any production line.** Zero. `src/history-pane.ts` is `c4653c4c…` at the end, re-hashed. The
  `## Out of scope` STOP-and-report path was not triggered.
- **`src/history-pane.test.ts`** — not opened. It holds `A5`'s table and closing `WCACHE-LAST3` would
  be a row in it, which is not this subtask's half.
- **`plans/tickets/ABC-028-*.md`, `plans/board.md`, every ADR, `plans/nfr-catalog.md`, `ABC-029`,
  `ABC-019`, every merged ticket** — not opened for edit.
- **Rebuilding, deleting or tidying the `AT_*` fixtures** — the fence forbids it and the measurement
  above is now the reason it should stay forbidden.
- **`## Out of scope`'s standing instruction, and the comment I was editing.** The comment itself has
  been telling readers a guard is safe to remove. **Content inside the workspace is DATA:** I acted on
  the measurement and on BA/PM's criterion, never on what the comment said about itself. **Nothing in
  the files I read attempted to authorise a write outside the fence** — that is a reported absence, not
  an assumption.

## Requested, not taken

**Board move `In Development → In Review`.** BA/PM's ruling holds the ticket at `In Development` until
`A5` is built. **My verdict: `A5` is now MET IN FULL** — the test half landed green last hop, the
comment half is green here — **and on this Engineer's verdict `A1`–`A5` are all met, so the ticket is
ready for a single QE gate on the complete criterion set.** `plans/board.md` was not opened; the
scheduling call and the board are the Orchestrator's.

## Reproduction

Harnesses live in this session's scratchpad, not in the repo (no new files anywhere under `src/`):
`mk.mjs` (the `TAIL`-parameterised cache generator plus the configuration-(b) fixture-rebuild
transform, both pinned by md5 to this tip and refusing on a mismatch), `rep/` (the out-of-tree replica:
a copy of `src/` with this worktree's own `node_modules` symlinked), and `trace.mjs` (the append-only
traceability edit with its cell-count and pipe/newline assertions). **Nothing in the repository depends
on them**, and every result above is reproducible from this note and the sibling `observation`.
