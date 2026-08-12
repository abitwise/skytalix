---
id: 20260812T192500Z-ba-pm-artifact-ref-what-was-written-what-was-refused-what-is-flagged-b3f75df4
kind: artifact-ref
by: ba-pm
at: 2026-08-12T19:25:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A5
  - RISK-ABC017-01
  - RISK-ABC028-02
  - RISK-ABC028-03
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/traceability.md
  - plans/board.md
supersedes:
---

# What was written, what was refused, and what is flagged rather than fixed

## Written

| path | change |
|---|---|
| `plans/tickets/ABC-028-history-pane-unreached-input-classes.md` | the hop's whole output — header amendment, **six** live line-map anchors corrected, `A5`'s comment half **DISCHARGED**, `RISK-ABC028-03` **RULED**, the **closure ledger** at `RISK-ABC028-02`, two further live false generalisations corrected, the `ABC-017` residual re-homed in `## Dependencies`, `## Test notes` **12**, `S`/`P1` re-derived, DoR items 3 and 4 re-checked, board move requested |
| `plans/traceability.md` | `ABC-028` row, **append-only** to its `Status` cell (+3,015 chars); one new `_Updated:` entry (58 → 59). **38 table rows before and after, 12 cells before and after, the 37 untouched rows byte-identical, and the pre-edit cell text asserted to still be a PREFIX of the new one** — proven by the script, not by eye |
| `.grugops/context/refinement-ABC-028-anchors/notes/` | 6 hand-authored notes, this one included |
| `.grugops/queue/claimed/refinement-ABC-028-anchors/` | claim dir, `claim.md`, and the subtask file moved in |

**Branch** `grugops/refinement-ABC-028-anchors`, worktree `../cli-chess-abc028-anch`. **No other
worktree was entered** — a QE hop is gating `src/history-pane.nfr.test.ts` concurrently. Nothing was
pushed, merged or deployed; there is no remote.

## The six anchors, and why one of them was NOT a `+3`

The block moved `:103-120` → **`:103-123`** and the fixtures `:121` → **`:124`**, read at source at
this hop. Corrected: `## Scope`; `A2`'s `Given`; `RISK-ABC028-02` ×2; `A5`'s comment table; the
standing obligation. **Dated, attributed blocks keep their original numbers on purpose.**

**`A5`'s comment table is ruled a DATED RECORD rather than shifted by three, and that is the one place
the brief's framing did not survive contact with the file.** Its three sentences were **replaced, not
moved**: `:118-120`'s *"would no longer lose a guard"* now reads *"STILL LOSES A GUARD"* at `:119-123`;
`:106-108`'s generalisation is now four enumerated keys at `:106-111`; `:112`'s `744/744`
counterfactual is **gone**, replaced by a live witness at `:113-118`. **A mechanical `+3` would have
pointed at real lines saying the opposite of what the table says they say** — a worse fence than the
stale one it replaced.

## Gate results, reported exactly as they ran on this branch

```
lint       npm run lint        PASS, exit 0 — 2 infos, both pre-existing biome.json (below)
typecheck  npm run typecheck   PASS, clean
unit       npm test            PASS, 752 / 752 on 26 files
skip       vitest --reporter=json | jq '.numPendingTests + .numTodoTests'   ->  0
digest     src/history-pane.ts c4653c4c263c4c417ea34969164ccd86 — UNMOVED, re-hashed after the hop
git        only plans/tickets/ABC-028-*.md and plans/traceability.md modified; src/ untouched
```

**`npm run build` NOT RUN — and that is stated rather than skipped quietly:** it is `tsc --noEmit`, the
same command as `typecheck`, and this hop changed no `.ts` file. **E2E: NOT RUN** — no runnable UI
surface until `EPIC-006`, and `quality.ui_e2e` is `ui-or-critical-path`.

## Flagged, NOT fixed

- **`ABC-017`'s merged text is still FALSE at two sites** — `:45` and `:941-942`, read at source.
  Out of this ticket's scope; re-homed with an owner in `## Dependencies`.
- **The 2 lint infos are `biome.json`'s, not mine** — `$schema` says `2.3.0` while the CLI is `2.5.5`,
  and `linter.rules.recommended` is deprecated in favour of `preset`. Pre-existing, unrelated, exit
  code 0. `AGENTS.md` rule 12.
- **`A5`'s `N8-LANE` delta is still `UNKNOWN - verify`** and falls due at the gate. This hop added no
  test, no file and no line, so its own delta is zero and `ADR-0008`'s protocol was not run.
- **`## Test notes` 11 stands: `ABC-028` was once gated on a tree two commits stale.** This branch is
  twenty-ninth in a linear stack. **Gate the tip, not a digest.**

## Refused, and each for a stated reason

- **Any write under `src/`.** Zero. `src/` was **read freely and re-measured out of tree** — that is
  what the corrected fence bought, and it is the reason every number in these notes was run rather
  than transcribed.
- **A row in `A5`'s table for `WCACHE-LAST3`** — cheap, on the table, not taken; priced in the sibling
  `decision`.
- **`RISK-ABC028-04`** — not minted; a risk id per rung is the per-witness defect wearing a number.
- **Renaming either `A5`** — measurement says the runner already disambiguates; a prose rule is set
  instead.
- **Editing another hop's context note** — not done; the correction is a new note carrying
  `supersedes:`, with the limit of that field stated honestly.
- **`plans/board.md`, every ADR, `plans/nfr-catalog.md`, `ABC-017`, `ABC-019`, `ABC-029`, every merged
  ticket** — not opened for edit. **The front matter was NOT moved** and was verified at source against
  the board (`## In Development (WIP 1/3)`, `:118`) rather than trusted from the brief.
- **Dated blocks rewritten to the new line map** — refused; that falsifies a dated measurement.

## Requested, not taken

**Board move `In Development → In Review`.** **All five criteria are MET at zero production lines** and
**nothing is owed to the Engineer** — this is the first hop on this ticket where that is true. The
record now matches the tree. **The `In Review` exit is QE/E2E's and this hop does not claim it**; the
scheduling call and the board are the Orchestrator's.

## Reproduction

Harnesses live in this session's scratchpad, not in the repo (nothing new anywhere under `src/`):
`mk.mjs` (the `TAIL`-parameterised cache generator **and** the configuration-(b) fixture-rebuild
transform, both pinned by md5 to this tip and refusing on a mismatch), `run.sh`, `rep/` (the
out-of-tree replica: a copy of `src/` with this worktree's own `node_modules` symlinked), and
`trace.mjs` (the append-only traceability edit with its row-count, cell-count and prefix assertions —
which **caught its own off-by-one and refused to write** before it was fixed). **Nothing in the
repository depends on them**, and every result is reproducible from these notes.
