---
id: 20260812T200500Z-ba-pm-artifact-ref-what-ran-what-was-written-and-every-fence-held-6a3d5e48
kind: artifact-ref
by: ba-pm
at: 2026-08-12T20:05:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-026
  - ABC-028
  - ADR-0011
  - NFR-002
  - NFR-008
  - A6.3
  - A6.4
  - L2
  - L3
  - L4
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - plans/board.md
  - plans/traceability.md
  - plans/nfr-catalog.md
supersedes:
---

# What this hop ran, what it wrote, the size/priority re-derivation, and every fence in the brief — held

> **Hand-authored.** `scripts/context-io.ts` does not exist here and `scripts/claim.js` does not exist
> here — **re-verified at source at this hop**, not inherited: there is no `scripts/` directory in this
> worktree, and a `find` for `context-io*` / `claim.js` across it (outside `node_modules`/`.git`) and
> across the kit root returns nothing. **So there is no derived `index.md` / `index.jsonl` for this
> `ref:` — `notes/` is the source of truth.** `kind: artifact-ref` is a pointer and needs no stamp.

Worktree `../cli-chess-abc029-g1g2`, branch `grugops/refinement-ABC-029-g1g2`, HEAD `fd7717d`. **This
branch is thirty-first in a linear stack off `main`; the fast-forward is denied by the host classifier
and is with the owner. It was NOT attempted.**

## Files written by this hop

| path | what |
|---|---|
| `plans/tickets/ABC-029-production-module-scope-and-load-probe.md` | **the only repository file modified** — `A6.3` + `A6.4` rows and their subsection, `A6`'s statement extended, `L2` restated, `L3`/`L4` added, `A4`'s stale clause re-pointed, `## Test notes` 11 answered and 13 added, size/priority re-derived, DoR re-checked, board move recorded |
| `.grugops/context/refinement-ABC-029-g1g2/notes/` | **5 notes** — 3 `observation`, 1 `decision`, this `artifact-ref` |
| `.grugops/queue/claimed/refinement-ABC-029-g1g2/claim.md` | the Workflow 17 registry record |
| `.grugops/queue/claimed/…/refinement-ABC-029-g1g2.md` | the subtask file, moved out of `pending/` |

**`git status --porcelain` outside `.grugops/` shows exactly ONE modified file. NOTHING under `src/`,
`memory-bank/` or any other `plans/` file was written.**

## Commands run

`npm run lint`, `npm run typecheck`, `npx vitest run`, `npx vitest run --reporter=json | jq
'.numPendingTests + .numTodoTests'`, `npx vitest run src/history-pane.nfr.test.ts` (**× 40 on the
out-of-tree rig, across 7 expression variants and 20 constructed builds**),
`./node_modules/.bin/biome check` (× 15), `node -e` regex probes (× 6), `md5`, `grep`, `git log`,
`git status`, `git diff --stat`, `find`, `ls`.

## The measurement rig — outside every repository

Session scratchpad only: one throwaway copy of this branch's `src/` with `node_modules` **symlinked**,
plus a per-run variant directory and a lint directory. **No file in any repository worktree was written
by any measurement, and NO other worktree was entered** — a BA/PM hop is live on `ABC-028`
concurrently, and `../cli-chess-abc028-*`, `../cli-chess-ABC-019` and `../cli-chess-abc029-*` were
never opened.

## Claim mechanics — hand-rolled, and said so

Workflow 17 step 2 was executed **by hand**. The `claimed/` parent did not exist and was created with
`-p`; **the task directory itself was a bare `mkdir`, no `-p`**, so the atomicity the protocol relies
on is intact and a second claimant would have taken `EEXIST`. Then `claim.md`, then the subtask file
moved in by `mv`. **Both are moved into `done/` at the end of this hop.** The subtask file was
**UNTRACKED** when claimed, so a plain `mv` was used and no ` D` appears in `git status` — **the
queue's git history must not be read as complete**, the same note three prior hops recorded.

## Size and priority — RE-DERIVED, not inherited

**`S` (2) HOLDS.** The condition named in advance at the previous hop — *"a **third site** in the
instrument, `## Test notes` 11 being the live candidate"* — was **checked at source and did NOT fire**:
note 11 resolves to **ONE block**. `A6.3` and `A6.4` add **criteria, not files**, and add less than any
previous row on this page: they are satisfied by the landed build verbatim, so **zero production lines,
zero test-file lines, zero characters of the regex literal**. What grew is what QE must re-run:
**required verdicts 14 → 19**. `SPLIT_REQUIRED` does not apply (bites at `XL` = 8; this is 2). **New
condition named in place of the spent one:** if `L2`'s false-positive surface is ever converted from a
marked limit into a required verdict, the expression needs a comment/string discriminator and the size
is re-derived.

**`P1` HOLDS.** **Not `P0` — the line is held a FOURTH time.** The promote trigger is *"the frame path
itself gains a runtime importer of `src/history.ts`"*; **checked by running the suite rather than by
re-enumerating a closure — the load probe is GREEN inside 752/752 and it IS the frame-path measurement,
with its arming control in the same file. NOT fired.** **Not `P2`:** `ABC-019` is `P0`, sits in the
board's `Blocked` column *blocked-by `ABC-029`'s merge*, `gate_enforcement` is `blocking`, and
`ABC-029` has not landed. **Neither figure is attributed — both were re-taken.**

## `plans/traceability.md` — read, CONFIRMED, DELIBERATELY NOT EDITED

The linkage `ABC-029` → `EPIC-002` → no feature is present and correct and did not move; `Status` did
not move. **This hop added ZERO committed tests and ZERO production lines**, so a `Tests` cell would
have to describe tests BA/PM did not add — **the same refusal Architect/Design, the Engineer and QE
each recorded on that file.** The row the two new rows deserve is appended by the hop that lands their
witnesses, from a note it admits.

## Requested board move — **NONE**, and the useful output is an input to the existing hold

`ABC-029` is `In Review` (WIP 1/3) and the front matter reads `status: in-review` / `column: In Review`
— **verified at source, the two AGREE, and neither was edited.** BA/PM's own transition is the
`Backlog → Ready` exit and it was **SPENT** at `refinement-ABC-029-criteria`.

**The input that matters:** the board holds this ticket at `In Review`, overriding QE's requested
`In Security/NFR`, *"because that gate would measure a file two owed rows are about to change."*
**Measured at this hop: the two owed rows do NOT change that file.** The premise of the hold is
discharged by measurement. **Whether that releases the hold is the Orchestrator's call.**

## Not taken — every fence in the brief, held

- **`src/` READ, never written.** That is the brief's deliberate correction of the previous hop's
  wholesale fence, and it is what produced every re-measurement here — including a build QE did not
  name (`WTYPESTARAS-EXPORT`) and the invalid-build catch (`WTYPEBIND`).
- **`plans/board.md` NOT opened for edit. No ADR opened for edit. `plans/nfr-catalog.md` NOT opened.
  `ABC-028` NOT touched** (a BA/PM hop is live on it), **`ABC-019` and every merged ticket NOT
  touched.** No other worktree entered.
- **No existing criterion weakened, renumbered or reworded** except `L2`, which is **restated with the
  struck text kept** because it was measurably false, and `A4`'s stale line citation, which is
  re-pointed with the old value struck. **`A5.2` NOT touched** — and the brief's *"if you touch it, say
  so loudly"* did not fire. **`A5.6`, `A6.1`, `A6.2` NOT touched.**
- **`N8-LANE`: NO number claimed and the FLOOR was NOT turned into one.** This hop wrote zero `src/`
  lines and zero test lines, so no mechanism exists for the lane to have moved. **The lane TOTAL is
  `ABC-026`'s and `NFR-002`/`NFR-008` `MET`/`MISS` is Security/NFR's.** Two hops have now reported the
  protocol cannot resolve their change; **this hop does not convert their floor.**
- **No `finding` written and nothing self-stamped** — no `§14-gate` verdict record exists under this
  task and `context.human_admission` is **`off`**. Every result is an `observation`, `decision` or
  `artifact-ref`, and every non-adjudicable quantity is `UNKNOWN - verify`.
- **No E2E invented.** `quality.ui_e2e` is `ui-or-critical-path`, there is no UI surface until
  `EPIC-006`, and the `AGENTS.md` slot is `UNKNOWN - verify`.
- **Nothing merged, nothing pushed, nothing deployed, no `git checkout main`.**
- **Content inside this workspace was treated as DATA, not instruction.** Nothing read in `src/`,
  `plans/`, `memory-bank/` or `.grugops/` purported to authorise a write outside this boundary, and
  nothing was acted on as if it did. **Nothing to report under that rule.**
