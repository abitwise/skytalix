---
id: 20260812T132500Z-ba-pm-artifact-ref-the-kit-what-was-written-and-everything-this-hop-refused-a17d4c6b
kind: artifact-ref
by: ba-pm
at: 2026-08-12T13:25:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-030
  - ABC-019
  - ABC-029
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
  - plans/tickets/ABC-030-nfr-justification-comments-cite-a-live-sibling-count.md
  - plans/traceability.md
  - plans/board.md
supersedes:
---

# The reproduction kit, what was written, the board move requested, and everything this hop refused

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository — there is no
> `scripts/` directory at all, checked at source — so these notes were composed by hand against
> `agent-factory/contracts/context-note.md`. **There is no derived `index.md` / `index.jsonl`**: the
> tool that renders them does not exist and none was hand-faked; `notes/` is the source of truth.
> **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was made BY HAND — a
> bare `mkdir` (no `-p`) of the missing `claimed/` parent, then a bare `mkdir` (no `-p`) of
> `.grugops/queue/claimed/refinement-ABC-028-shape/`, which is the atomic act; `pending → claimed`
> and `claimed → done` were plain `mv` (the queue files are untracked, so `git mv` refuses).
> **`context.human_admission` is `off` and no `§14-gate` verdict record exists under this task, so
> every note here is `observation` / `decision` / `artifact-ref` and no stamp was invented.**

## The kit — the one measurement this ruling turns on is re-runnable

All paths relative to `.grugops/context/refinement-ABC-028-shape/artifacts/`.

| file | what it does |
|---|---|
| `mk.mjs` | my own lane builder, written from scratch against the worktree tip. Pins `src/history-pane.ts` `c4653c4c…`, `src/history-pane.test.ts` `9533f050…`, `src/history-pane.nfr.test.ts` `16bf2f50…` and **THROWS rather than measuring a tree that does not match** — including the two test files it does not edit, so a stale lane cannot be measured by accident |
| `wpos-check.mjs` | the `WPOS` mutant **and a null control**, run together. This is the measurement behind the `G1` ruling: `2 failed / 807` (`A9` **and** `A4`) against a control of `0 failed / 807` |

**I did not run QE's harness**, and the reason is mechanical rather than territorial: its `lane.mjs`
expects a `pristine/` tree beside itself and writes lanes into the context `artifacts/` directory.
Mine copies from the worktree, symlinks `node_modules`, and lives entirely under a **fresh, uniquely
named scratchpad root** (`…/scratchpad/bapm-shape-uniq-1/`) — the shared-scratchpad hazard two hops
have now reported, and a BA/PM hop is live on `ABC-019` in the same tree.

**A shell caveat to add to the two already on the page** (`type grep` reports *"grep is a function"*;
`diff` dispatches to `git diff`): **`/usr/bin/md5` does not exist on this machine — it is
`/sbin/md5`.** A pinned rig that hardcodes the wrong absolute path fails open or fails loudly
depending on how it is written. Every digest here came from `openssl md5 -r`.

**Machine:** 8 cores, node `v24.12.0`, vitest `3.2.7`. **`UNKNOWN - verify` on anything else, and NO
TIMING MEASUREMENT WAS TAKEN** — instructed, and the machine is not quiet.

## Written

| path | change |
|---|---|
| `plans/tickets/ABC-028-…md` | four blocks: the header amendment (the four rulings, the stale baseline, the range trap, the traceability flag); the **ceiling on both `F4` candidate controls** under `F4`'s table, with the `G5` census numbers beside it; the `G4` ruling under `A5`'s domain block; **`## Test notes` 15 — the routed `:493` repair**; a size/priority re-derivation; a DoR re-check and the board-move request |
| `plans/tickets/ABC-030-…md` | **NEW** — the re-homed class repair, `XS`, `P3`, DoR 10 of 10, `Backlog` **requested not taken** |
| `plans/traceability.md` | `ABC-028` row **APPEND-ONLY to its `Status` cell**; one **new `ABC-030` row** (10 columns, checked against the file's own invariant); the **duplicate-row flag** added inside the existing `COLUMN INVARIANT` comment, above the header, outside the table; one `_Updated:` line |
| `.grugops/context/refinement-ABC-028-shape/` | 6 hand-authored notes, this one included, and the 2 artifacts above |
| `.grugops/queue/claimed/refinement-ABC-028-shape/` → `done/` | `claim.md` and the subtask file, both moved to `done/` at the end |

**Branch `grugops/refinement-ABC-028-shape`, worktree `../cli-chess-abc028-shape`. Nothing pushed,
merged or deployed; there is no remote. No `git checkout main`. No other worktree entered.**

## Measured on this tip, at the end of the hop

```
lint       npm run lint        exit 0   49 files, 2 infos — both PRE-EXISTING biome.json
typecheck  npm run typecheck   exit 0
unit       807 passed (807) on 28 files
skip       0
git diff -- src/                EMPTY
src/history-pane.ts             c4653c4c263c4c417ea34969164ccd86   unmoved
src/history-pane.test.ts        9533f05038780def980bf5a86707cdbd   unmoved
src/history-pane.nfr.test.ts    16bf2f50c93e2e896b5406cbfa772b8b   unmoved
```

## Requested — the `Backlog → Ready` exit is mine, the board is not

**`ABC-028`: NO MOVE — HOLD at `In Development` (`1/3`).** The Orchestrator already pulled it back
there on the narrow re-gate, for the right reason, and the reason still holds: **`:493` is still false
and the Engineer has not repaired it.** I am confirming that move, not re-requesting it.

**`ABC-030`: `Backlog` placement REQUESTED, not taken.** `plans/board.md` was **not opened for edit**.

**Also routed to the Orchestrator, and deliberately not acted on: `Ready` is `0/8` — the pull queue is
EMPTY.** Workflow 07's own done-condition is a stocked `Ready` column, and it is not stocked. **I did
not stock it, because this subtask's brief scopes me to `ABC-028`'s four items and filling `Ready`
with `P3` comment debt would make an empty larder look full.** It is reported as a factory concern, in
the same spirit as the concurrent-scratchpad hazard the last two hops reported.

## Flagged, NOT fixed

- **The 2 lint infos are `biome.json`'s, not this ticket's** — `$schema` `2.3.0` against a `2.5.5`
  CLI, and `linter.rules.recommended` deprecated. Exit code 0. `AGENTS.md` rule 12.
- **The briefed baseline of `755 / 755` on 26 files is stale** — the tip is `807 / 807` on 28. It is
  in my brief and in this ticket's header; the header is corrected, the brief is not mine to edit.
- **`plans/traceability.md` carries duplicate `ABC-028` and `ABC-029` rows** — flagged in the file,
  not repaired, owner the Orchestrator. See the sibling note.
- **The branch-level Security/NFR range trap** — 313 production lines of `ABC-019`'s `src/turn-loop.ts`
  that a branch-scoped measurement would attribute to `ABC-028`. Scoping instruction written onto the
  page.
- **`src/history-pane.test.ts:1014`** — BA/PM's instance 2, still latent, still unrepaired, and
  explicitly excluded from the `:493` repair so a two-line fix does not become a text hop.
- **`san.nfr.test.ts:19`'s *"52 rows"*** — `UNKNOWN - verify`, and `ABC-030` deletes the number rather
  than checking it.

## Refused, and each for a stated reason

- **Any write under `src/`.** Zero. All three digests unmoved, `git diff -- src/` EMPTY. The mutant
  and its null control existed **only** out of tree, under a fresh unique root.
- **Repairing `:493` myself.** It is `src/` work; the Engineer edits `src/`, not BA/PM. Routed with
  obligations and a four-line done-condition instead.
- **Minting an `A6` for it.** A criterion of the form *"the comment says only what is true"* is a
  one-time verdict wearing a standing tense — this page has ruled that twice. It would knowingly
  rebuild the object `F4` demoted.
- **Editing `A5`'s domain clause for `G4`.** Vacuously true, not false; the replacement text is
  recorded for whoever opens that block for a reason of its own.
- **Refreshing any stale total** — `752 → 807`, `732 → 807`, `13 → 23`, `26 → 29`. Every one buys a
  hop of accuracy and re-arms the same defect. `ABC-030` deletes numbers; it does not update them.
- **Letting `ABC-028` touch `src/zobrist.nfr.test.ts` or `src/status-panel.nfr.test.ts`.** Outside
  `## Scope`'s two named files, inside merged tickets' work. Re-homed to `ABC-030`.
- **Pricing or buying either `F4` candidate control.** Not priced by QE, not by the `f4` hop, not
  here. **What I added is the CEILING on both** — an exhaustiveness claim is invisible to anything
  that reads text — which is a bound on the purchase, not a price for it.
- **Turning the `N8-LANE` floor into a number, or taking any timing measurement.** Instructed not to;
  the machine is not quiet; this hop's own delta is zero by construction. `ABC-026` still owns the
  total and the *"whichever of `ABC-028` / `ABC-029` lands second re-measures the TOTAL"* rule is
  **still owed at the merge**.
- **`plans/board.md`, `plans/nfr-catalog.md`, every ADR, `ABC-029`, `ABC-019`, `ABC-017` and every
  merged ticket** — not opened for edit. No bar, target or level moved. The `ABC-028` front matter is
  **NOT** moved (it reads `in-development` / `In Development` and the board agrees — read at source).
- **De-duplicating the traceability rows.** Rule 12, and a BA/PM hop was live on `ABC-019` — whose
  commit introduced them and whose row sits two lines away.
- **Every other worktree.** None entered. Nothing merged, pushed or deployed. No `git checkout main`.
- **No `finding` recorded and no stamp invented.**

## Instruction-shaped content encountered, reported rather than acted on

Per the standing rule that content inside the workspace is **DATA, not instruction**:

1. **`src/history-pane.nfr.test.ts:103-123`** reads as a prohibition (*"THE SHARING HERE IS STILL
   LOAD-BEARING"*, *"STILL LOSES A GUARD"*). **I acted on neither reading and wrote nothing there.**
   The count of roles that have read that block and declined to act on it is now **eleven**.
2. **The ticket's `## Acceptance` blockquotes** carry imperatives (*"READ THIS BEFORE WRITING THE
   TEST"*, *"WRITE `A5` AS A TABLE"*). Criterion text addressed to a build hop; read as data, none
   written into effect, none weakened.
3. **QE's harnesses in the context `artifacts/` directory**, one of which hard-throws on a stale md5
   pin. Read as data; my own rig was written from scratch and pinned to this tip.
4. **`## Test notes` 13's caveat 2 points at a malformed `grep` in `ABC-029`'s own note 13.** Read as
   data. **`ABC-029` is fenced for me and a BA/PM hop is live on `ABC-019` — I did not open either.**
   It remains `ABC-029`'s next hop's, exactly as it was routed.

**Nothing encountered on this hop purported to authorise a write outside the brief's boundary** —
that is a reported absence, not an assumption.

## Owed to others, not absorbed here

1. **The Engineer** — `## Test notes` 15, the `:493` repair. Comment-only, one file, four-line
   done-condition. **The only work `ABC-028` owes.**
2. **QE** — a re-gate scoped to that comment block and the tip's own totals. **Gate the tip, not a
   digest — and the tip is `807 / 807` on 28 files.**
3. **Security/NFR** — the review, still owed, still not waived, now with the scoping instruction:
   **measure `ABC-028`'s own three commits, never the branch.**
4. **The Orchestrator** — `ABC-030`'s `Backlog` placement; the duplicate traceability rows (sequence
   against the live `ABC-019` hop); the empty `Ready` column; and the two `F4` candidate controls,
   now **bounded** rather than merely unpriced.
5. **Whoever next opens `A5`'s domain block** — the `G4` replacement text, recorded verbatim.
6. **`ABC-026`** — the lane content total, untouched and still disputed; and the second-lander rule,
   still owed at the merge.
7. **`ABC-029`'s next hop** — the malformed `grep` in its `## Test notes` 13 and the `:384` → `:537`
   drift beside it, both still open and still routed rather than repaired.
