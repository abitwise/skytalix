---
id: 20260812T140000Z-software-engineer-artifact-ref-what-was-written-what-was-refused-what-is-flagged-dbc59bc2
kind: artifact-ref
by: software-engineer
at: 2026-08-12T14:00:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - ABC-029
  - RISK-ABC028-03
  - src/history-pane.test.ts
  - plans/traceability.md
  - plans/board.md
supersedes:
---

# What was written, what was refused, and what is flagged rather than fixed

## Written

| path | change |
|---|---|
| `src/history-pane.test.ts` | **+125 lines, 0 removed.** `A5`'s `EditShape` interface, the 2-row `A5_SHAPES` table, one `it.each`. Appended inside `describe("ABC-028 acceptance")` after `A4`'s tripwire; nothing above it was touched |
| `plans/traceability.md` | `ABC-028` row, **append-only** to `Code (PR/files)`, `Tests`, `Status`; one `_Updated:` header line. 12 cells before and after |
| `.grugops/context/ticket-to-pr-ABC-028-a5/notes/` | 6 hand-authored notes, this one included |
| `.grugops/queue/claimed/ticket-to-pr-ABC-028-a5/` | claim dir, `claim.md`, and the subtask file moved in |

**Branch** `grugops/ABC-028-a5`, worktree `../cli-chess-abc028-a5`. No other worktree was entered.
Nothing was pushed, merged or deployed; there is no remote.

## Gate results, reported exactly as they ran

```
lint       npm run lint        PASS, exit 0 — 2 infos, both pre-existing (below)
typecheck  npm run typecheck   PASS, clean
unit       npm test            PASS, 752 / 752 on 26 files
build      npm run build       PASS, clean (tsc --noEmit; a typecheck wearing the build slot's name)
skip       vitest --reporter=json | jq '.numPendingTests + .numTodoTests'   ->  0
```

## Flagged, NOT fixed

- **The 2 lint infos are `biome.json`'s, not mine:** the config `$schema` says `2.3.0` while the CLI
  is `2.5.5`, and `linter.rules.recommended` is deprecated in favour of `preset`. **Both reproduce at
  `HEAD` with my change stashed** — checked, not assumed. Pre-existing and unrelated; the 12 coding
  rules say flag, do not fix. Exit code is 0 and the gate is not blocked.
- **`.grugops/context/quality-gate-ABC-028-qe/artifacts/make-cachelast.mjs` no longer runs on this
  tree** — it hard-throws on the `54fd4346…` pane pin and points `node_modules` at another live
  worktree. Correct behaviour, and corroboration of the stale-tree finding. Not repaired.
- **`RISK-ABC028-03` still reads `UNKNOWN - verify` on the ticket page** although it was measured
  here. The ticket is BA/PM's and I did not edit it; the status change is requested, not taken.

## Refused, and each for a stated reason

- **`A5`'s COMMENT half** — `src/history-pane.nfr.test.ts:103-120`. **NOT BUILT and the file was
  never opened.** Blocked on `ABC-029`. Its stale `744/744` travels with that half as a **re-measure
  instruction, not a number**, and was not "fixed" to a number here.
- **Any production line.** Zero. `src/history-pane.ts` is `c4653c4c…` at the end, re-hashed. No
  criterion required one, so the brief's STOP-and-report path was not triggered.
- **`plans/board.md`** — not opened; the Orchestrator reserved it. Move **requested** below.
- **The ticket, any ADR, `plans/nfr-catalog.md`, `ABC-029`, `ABC-019`, every merged ticket** — not
  opened. No criterion renumbered or deleted. **No existing test weakened, narrowed or deleted** —
  the diff is `+125 / -0`.
- **Config (b)** (nfr fixtures rebuilt per test) — not run; config (a) is strictly stronger for the
  question and does not require opening the fenced file.
- **A new test file** — none. File count 26 → 26, so Security/NFR's *"any production line or any new
  file"* threshold fires **neither**.

## Requested, not taken

**Board move `In Development → In Review`.** BA/PM's ruling is that the ticket *"stays in
`In Development` until `A5`'s test half is built and green"* and *"advances on the Engineer's
verdict"*. **My verdict: the test half is built and green.** The caveat belongs with the request —
**`In Review` would be entered with `A5`'s comment half still open and blocked on `ABC-029`**, so
holding is defensible too. That is the Orchestrator's scheduling call and the evidence for it is
here, not the decision.

## Reproduction

Harnesses live in this session's scratchpad, not in the repo (no new files under `src/`):
`make-mutant.mjs` (the axis-parameterised mutant generator, pinned to `c4653c4c…`), `probe-a5.ts`
(both edit shapes through the public API), `n8-measure.sh` / `n8-single.sh` (the `ADR-0008` paired
protocol with its identity null control). They are reproducible from this note and the `decision`
sibling; **nothing in the repository depends on them.**
