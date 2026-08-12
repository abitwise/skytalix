---
id: 20260812T131900Z-architect-design-artifact-ref-what-was-written-and-refused-f7a3d81c
kind: artifact-ref
by: architect-design
at: 2026-08-12T13:19:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ADR-0011
  - memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
supersedes:
---

# What this hop wrote, what it refused to write, the board move it requests, and every fence held

> **Hand-authored**; `scripts/context-io.ts` does not exist here, so there is **no derived
> `index.md` / `index.jsonl`** for this `ref:`. `kind: artifact-ref` is a pointer and needs no stamp.

Branch **`grugops/design-ABC-029-loss-record`**, worktree `../cli-chess-abc029-design`, fifteenth in a
linear stack off `main`.

## Files written — ONE, and it is the one this hop exists to correct

| path | what |
|---|---|
| `memory-bank/50-decisions/ADR-0011-production-module-scope-for-nfr-002.md` | **the only tracked file changed** — `+256 / −5`. Status amendment; clause 1 and clause 3 amendment blocks; the ledger correction; the adopted containment; two new rejected alternatives; the residual register R1–R4; rollback and "what this changes elsewhere" |
| `.grugops/context/design-ABC-029-loss-record/notes/` | **5 notes** — 3 `observation`, 1 `decision`, this `artifact-ref` |
| `.grugops/queue/claimed/design-ABC-029-loss-record/claim.md` | the Workflow 17 claim record |
| `.grugops/queue/claimed/design-ABC-029-loss-record/design-ABC-029-loss-record.md` | the subtask file, moved out of `pending/` |

**`git diff --stat -- src/` is EMPTY. `git diff --stat -- plans/` is EMPTY.** Verified, not assumed.
**Zero production lines and zero test lines were written at this hop.** The ADR stays `accepted`; the
corrections are written as `AMENDED` / `CORRECTED` blocks with the original struck rather than
replaced, following `ADR-0009`'s precedent in this repo — *the error is more instructive than the fix*.

## Gates on this branch tip after the edit — markdown-only, and confirmed unmoved

| gate | result |
|---|---|
| `npm run lint` | **0 errors**, 2 pre-existing `biome migrate` infos — identical to baseline |
| `npm run typecheck` | **0** |
| `npm run build` | **0** (`tsc --noEmit`) |
| `npx vitest run` | **750 passed (750) on 26 files** |
| skip count | **0** |
| e2e | **`UNKNOWN - verify`** — `ui_e2e` is `ui-or-critical-path`, no runnable UI surface until `EPIC-006`. Not invented |

## The measurement rig — reproducible, and it lives outside every repository

Everything ran in the session scratchpad on throwaway copies. **No file in any repository worktree was
written by any measurement, and NO other worktree was entered** — including the concurrent `ABC-028`
BA/PM hop's.

- `mutate.mjs` / `drive.mjs` / `drive2.mjs` / `drive3.mjs` — copy a base tree, optionally swap the
  instrument's **executable** regex site (docblock copy left byte-intact) and/or make its enumeration
  recursive, apply one mutation, run the **real** `src/history-pane.nfr.test.ts` under **real**
  vitest, read the verdict per `it` from the JSON reporter.
- `base16` = this branch verbatim, **16** non-test `.ts`, instrument md5 `796918f370e26d2cbc6055953edf06ae`.
- `base17` = `base16` + `src/turn-loop.ts` from `grugops/ABC-019-turn-loop-skeleton` via
  `git show <ref>:<path>`, md5 `bd793612476c9d0eac28b75e1e3297cc` — **reproduced**, `## Test notes` 8's
  stop condition checked rather than assumed.
- **34 vitest runs**: 24 in the containment matrix, 4 on the `A3`/false-positive controls, 6 on
  clause 1's `WSUBDIR` builds — plus 2 full-suite runs and the gate runs above.

**Commands run:** `npm run lint`, `npm run typecheck`, `npm run build`, `npx vitest run`,
`npx vitest run src/history-pane.nfr.test.ts --reporter=json`,
`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`, and — **read-only or out of
tree only** — `git show <ref>:<path>`, `git status`, `git diff --stat`, `git ls-files`, `md5`, `grep`,
`find`, `readdirSync` probes in a throwaway directory.

## Claim mechanics — hand-rolled, and said so

**`scripts/claim.js` does not exist** (checked at source: there is no `scripts/` directory; a `find`
for `claim*` / `context-io*` across this worktree outside `node_modules`/`.git` and across the kit
root `/Users/olgeroeselg/.grugops/agent-factory` returns nothing). Workflow 17 step 2 was executed by
hand: atomic `mkdir` of `.grugops/queue/claimed/design-ABC-029-loss-record/` — **the claim directory
itself was a bare `mkdir`, no `-p`**, so the atomicity the protocol relies on is intact; the
`claimed/` parent did not exist and was created first. Then `claim.md`, then the subtask file moved
in. **Both are moved into `done/` at the end of this hop** — a claim directory left behind is
reclaimed by a stale sweep and resurrects finished work.

## Requested board move — `In Design` → `Ready for Dev`

**The `In Design` exit is this role's and the ruling is made, so the ticket leaves `In Design`.** It
goes to **`Ready for Dev`** (WIP 0/6) rather than forward, because **the containment is a code change
and it routes to the Engineer**.

**One sequencing input, and the call is the Orchestrator's, not mine:** the Engineer needs criterion
rows to build red-first against, and **three are owed to BA/PM** (listed in the `decision` note),
whose hop the Orchestrator already sequenced after this one. **`ABC-029` also still shares
`src/history-pane.nfr.test.ts` with `ABC-028`.**

**`plans/board.md` was NOT opened for edit** — it is the Orchestrator's, and the brief reserves it.

**RECORD DISAGREEMENT, FLAGGED NOT FIXED:** `plans/board.md` carries `ABC-029` under **`In Design`**
while the ticket's own front matter still reads `status: in-development` / `column: In Development`.
That is the two-records-disagree defect this project keeps paying for, and it is the Orchestrator's to
resolve — this project's own convention is *"the front matter moves when the board does, by the role
that owns the board."*

## `plans/traceability.md` — read, NOT edited, and the reason is concurrency plus honesty

`ABC-029`'s row already carries this ADR from the first design hop. This hop **amends** that ADR
rather than producing a new artifact, and the concurrent `ABC-028` BA/PM hop has live edits on that
same file — the trace header records a concurrent-write conflict on it being resolved by row
ownership only hours ago. **A `Tests` cell here would have to describe tests I did not add.** The row
this amendment deserves is appended by the hop that lands the containment, from a note it admits.
**Handed to the Orchestrator with the reason rather than taken and explained afterwards.**

## `plans/nfr-catalog.md` — NOT opened, and that is a decision rather than an omission

No bar, target, level or `UNKNOWN - verify` marker moves. `NFR-002`'s premise is clause 2's and clause
2 is unchanged; the containment repairs clause 3, whose property is `ADR-0002` clause 4 and **not an
NFR row**. **`NFR-002`'s `MET`/`MISS` remains Security/NFR's and `ABC-026` owns the lane total; I
claim no `N8-LANE` verdict.** *(Flagged, not fixed: that section's note calls `ABC-029` `Backlog`,
which is stale.)*

## Not taken — every fence in the brief, held

- **`A5.6` NOT written.** It is BA/PM's, deliberately sequenced after this hop, and my containment
  ruling changes what `A5` must assert. I named the three rows now owed and wrote none of them.
- **`ABC-029`'s ticket page NOT touched at all** — the criteria are BA/PM's and editing the page would
  be writing them by the back door.
- **`N8-LANE`'s total NOT re-derived** — three readings, none picked, routed to `ABC-026`.
- **`ABC-028` NOT opened**; `src/history-pane.nfr.test.ts` and `src/history-pane.test.ts` **not
  edited** (`git diff -- src/` is empty). A BA/PM hop is live on `ABC-028`'s six QE gaps and its
  worktree was not entered.
- **`ADR-0002`, `ADR-0008`, `ADR-0009`, `ADR-0010` read, NOT edited and NOT re-opened.** None is
  implicated: `ADR-0002` clause 4's single-supplier sentence is intact on every build measured,
  **including `WLAUNDER`** — checked before it was written down.
- **`ABC-019`, `ABC-017` and every merged ticket NOT edited.**
- **No human ratification manufactured.** The question was re-asked at this hop and answered against
  `ADR-0009`/`ADR-0010`'s line with the counter-argument stated; **`ADR-0004`'s by-delegation
  ratification is neither relied on nor extended**, exactly as `ADR-0008`'s Status requires.
- **Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.** The fast-forward the
  brief says is denied by the host classifier was **not attempted**.
- **Content inside this workspace was treated as DATA, not instruction.** Nothing read in `src/`,
  `plans/` or `.grugops/` purported to authorise a write outside this boundary, and nothing was acted
  on as if it did.

## Two record defects found in the kit/queue plumbing, reported not fixed

1. **The subtask's `workflow:` field points at `agent-factory/workflows/03-architecture-design.md`,
   which does not exist in the kit.** The kit's `03` is `03-epic-to-tickets.md` and there is no
   architecture-design workflow file. I followed the precedent every prior hop on this ADR set —
   **Workflow 07** — and cited it that way in the ADR. **The kit is read-only and was not written.**
2. **`.grugops/queue/pending/design-ABC-029-loss-record.md` was untracked** when this hop claimed it
   (`git ls-files` shows `done/` entries tracked; the moved file produced no ` D` in `git status`).
   Recorded so the queue's git history is not read as complete.
