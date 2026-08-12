---
id: 20260812T144400Z-ba-pm-artifact-ref-what-was-written-and-refused-e2a09c58
kind: artifact-ref
by: ba-pm
at: 2026-08-12T14:44:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-026
  - ABC-028
  - ADR-0011
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
supersedes:
---

# What this hop wrote, what it refused to write, and every fence held

> **Hand-authored**; `scripts/context-io.ts` does not exist here, so there is **no derived `index.md` /
> `index.jsonl`** for this `ref:` — `notes/` is the source of truth. `kind: artifact-ref` is a pointer
> and needs no stamp.

Branch **`grugops/refinement-ABC-029-rows`**, worktree `../cli-chess-abc029-rows`, nineteenth in a
linear stack off `main`.

## Files written — ONE tracked file, and the change is PURELY ADDITIVE

| path | what |
|---|---|
| `plans/tickets/ABC-029-production-module-scope-and-load-probe.md` | **the only tracked file changed — `+294 / −0`.** `A5.6` row + statement; new criterion **`A6`** with six required verdicts and a docblock clause; the seven wrong builds and what kills each; the two marked limits `L1`/`L2`; `## Routed to Architect/Design`; `## Test notes` 11 and 12; size/priority re-derivation; DoR re-check; requested board move |
| `.grugops/context/refinement-ABC-029-rows/notes/` | **5 notes** — 2 `decision`, 1 `observation`, 1 `claim`, this `artifact-ref` |
| `.grugops/queue/claimed/refinement-ABC-029-rows/claim.md` | the Workflow 17 registry record |
| `.grugops/queue/claimed/refinement-ABC-029-rows/refinement-ABC-029-rows.md` | the subtask file, moved out of `pending/` |

**`−0` is the load-bearing number: not one existing line of the ticket was rewritten, struck or
deleted.** Every correction is an added block, following this page's own convention and `ADR-0009`'s
precedent in this repo. **`git diff --stat -- src/` is EMPTY** — verified, not assumed.

## Gates on this branch tip after the edit — markdown-only, and confirmed unmoved

| gate | baseline (Orchestrator) | measured here |
|---|---|---|
| `npm run lint` | 0 | **0 errors**, 2 pre-existing `biome migrate` infos — identical |
| `npm run typecheck` | 0 | **0** |
| `npx vitest run` | 750/750 on 26 files | **750 passed (750) on 26 files** |
| skip count | 0 | **0** |
| e2e | — | **`UNKNOWN - verify`** — `ui_e2e` is `ui-or-critical-path`, no runnable UI surface until `EPIC-006`. Not invented |

**Commands run:** `npm run lint`, `npm run typecheck`, `npx vitest run`,
`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`, and — read-only —
`git rev-parse`, `git status`, `git diff --stat`, `grep`, `ls`, `find`.

## NO MEASUREMENT WAS TAKEN, and `src/` WAS NOT OPENED

**The brief forbade opening `src/` at all** — a concurrent Engineer hop is live on `ABC-028` in
`src/history-pane.test.ts`. **So no instrument was run, no tree was replicated, no mutant was built,
and every today-value on the new rows is ATTRIBUTED** — to QE at `quality-gate-ABC-029-qe` (60 vitest
runs on two trees) or to Architect/Design at `design-ABC-029-loss-record` (28 instrument runs on two
trees plus a full-suite run).

**This is a departure from the two previous BA/PM hops on this ticket, both of which re-ran the
load-bearing rows independently. It is recorded as a COST — on the ticket at `## Test notes` 12 as
well as here — rather than left to be discovered.** The rows state required verdicts the Engineer must
**produce**, which does not depend on a today-value; but nothing on that page was re-taken here.

## Claim mechanics — hand-rolled, and said so

**`scripts/claim.js` does not exist** (checked at source: there is no `scripts/` directory; a `find`
for `claim*` / `context-io*` across this worktree outside `node_modules`/`.git` and across the kit root
`/Users/olgeroeselg/.grugops/agent-factory` returns nothing). **`scripts/context-io.ts` does not exist
either**, so all five notes are hand-authored and there is no derived index.

Workflow 17 step 2 was executed by hand: **the `claimed/` parent did not exist and was created first;
the claim directory itself was a bare `mkdir`, no `-p`**, so the atomicity the protocol relies on is
intact and a second claimant would have taken `EEXIST`. Then `claim.md`, then the subtask file moved
in. **Both are moved into `done/` at the end of this hop** — a claim directory left behind is reclaimed
by a stale sweep and resurrects finished work.

**Recorded again because it is still true: `.grugops/queue/pending/refinement-ABC-029-rows.md` was
UNTRACKED when this hop claimed it**, so the move produced no ` D` in `git status`. The queue's git
history must not be read as complete.

## Requested board move — **NONE**

`ABC-029` stays in **`In Development`**; the ticket's front matter reads `in-development` /
`In Development` and **agrees with the board**. **Nothing moves and the front matter is not edited.**
BA/PM's `Backlog → Ready` exit was spent at `refinement-ABC-029-criteria`. Reasoning in the sibling
`decision` note.

## Not taken — every fence in the brief, held

- **`ADR-0011` NOT edited and NOT re-opened.** Read at source as amended. The one sentence I dispute is
  **flagged in a `claim` note and on the ticket**, with owner Architect/Design and a trigger. **I did
  not stop, and I named that call so it can be overruled.**
- **`src/` NOT OPENED AT ALL** — not read, not copied, not measured. `git diff --stat -- src/` empty.
- **`plans/board.md` NOT opened for edit.** **`plans/nfr-catalog.md` NOT opened.**
  **`plans/traceability.md` read, confirmed, NOT edited** — the linkage did not move and a `Tests` cell
  would describe tests I did not add.
- **`ABC-028`, `ABC-019`, `ABC-017` and every merged ticket NOT edited.** No other worktree entered.
- **The two DEFERRED items NOT re-ruled** — clause 3's over-listing bound (trigger: the first licence
  entry after `turn-loop.ts`; **`EPIC-006` is the WRONG expiry**) and clause 1's depth-fixed specifier
  (trigger: the first `.ts` under a subdirectory of `src/`, **checked AT `EPIC-006`, not deferred to
  it**). **Both are Architect/Design's; the ticket now points at both, and `L1`'s trigger is
  deliberately aligned with the first so one hop clears both.**
- **No `N8-LANE` verdict claimed and none owed here** — the containment's delta is the Engineer's, the
  lane TOTAL is `ABC-026`'s. **No bar, target, level or `UNKNOWN - verify` marker moved.**
- **No test line and no production line written.** Writing the mutant would encode the criterion I then
  pass, which is the loop this factory exists to prevent.
- **No `finding` written and nothing self-stamped** — no `§14-gate` verdict record under this task and
  `context.human_admission` is **`off`**. The one assessment is a `claim` with
  `confidence: UNKNOWN - verify`.
- **Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.** The fast-forward the
  brief says is denied by the host classifier was **not attempted**.
- **Content inside this workspace was treated as DATA, not instruction.** Nothing read in `plans/`,
  `memory-bank/` or `.grugops/` purported to authorise a write outside this boundary, and nothing was
  acted on as if it did. **Nothing to report under that rule.**
