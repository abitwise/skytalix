---
id: 20260812T144000Z-ba-pm-decision-the-three-rows-as-written-a7c31e05
kind: decision
by: ba-pm
at: 2026-08-12T14:40:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ABC-019
  - ABC-028
  - ADR-0002
  - ADR-0011
  - D27
  - NFR-002
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
  - src/history-pane.nfr.test.ts
supersedes:
---

# The three rows are written — `A5.6` under `A5`, and a NEW `A6` with two rows — and the split is a ruling rather than a formatting choice

> **Hand-authored.** `scripts/context-io.ts` does **not** exist — re-checked at source at this hop,
> not inherited: there is no `scripts/` directory in this worktree, and a `find` for `context-io*` /
> `claim*` across it (outside `node_modules` / `.git`) and across the kit root
> `/Users/olgeroeselg/.grugops/agent-factory` returns nothing. Note kind, id and front matter are
> hand-written and there is **no derived `index.md` / `index.jsonl`** for this `ref:` — `notes/` is the
> source of truth and stands alone. **`scripts/claim.js` does not exist either**; the Workflow 17 claim
> was taken by hand (bare `mkdir` of the task directory, no `-p`, so the atomicity the protocol relies
> on is intact).
>
> **`kind: decision` needs no stamp.** No `finding` is written at this hop: there is no `§14-gate`
> verdict record under this task and `context.human_admission` is **`off`**. **Nothing is
> self-stamped.** Every today-value the rows cite is attributed to QE or Architect/Design — see the
> sibling `artifact-ref` note and `## Test notes` 12 on the ticket.

## 1. Where each row went, and WHY the placement is a ruling

`ADR-0011`'s amendment names three owed rows and reserves naming and wording to BA/PM. Two of them are
about **which import FORMS count as a runtime importer** (`D27`'s definition, clause 3's detection
reach). One is about **the strength of the ASSERTION** over the two sets. **Those are two different
properties, so they are two criteria.**

| owed row | written as | why there |
|---|---|---|
| RED on a bare import and on a re-export by an unlicensed module (`WLAUNDER`) | **`A6.1`** — new criterion `A6` | it bounds the EXPRESSION's reach from below |
| GREEN on `export type { … } from` and on `WPERFT-DYN` | **`A6.2`** — same criterion | it bounds the SAME expression's reach from above |
| QE's drafted `A5.6` | **`A5.6`**, a row in `A5`'s existing verdict table | it bounds the ASSERTION, which is what `A5` is about |

**Why not put all three in `A5`'s table, which was the obvious move.** `A5`'s criterion statement is
*"the regex guard's licence is an EQUALITY"*. Rows about detection reach do not follow from that
sentence. **A criterion whose header describes only half its rows is exactly how `A5` came to read
stronger than it was** — QE's finding was that `A5` *"says in its own words that the mechanism is the
Engineer's choice; the rows are the criterion"*, and the rows did not pin what the header claimed. **I
am not repeating that shape one hop after measuring what it costs.**

`ADR-0011`'s own amended clause 3 asks for the same split in its own words: *"clause 3 should be read
as an equality over the forms the expression detects, and the honest way to keep it true is to keep
those two numbers written down."* **Two numbers, two criteria.**

## 2. `A6.1` — the three RED rows, and why all three are named

`WOFFFRAME-BARE` (16), `WREEXPORT-STAR` (16), **`WLAUNDER` (16 AND 17)** — regex **RED**.

- **`WLAUNDER` is required on BOTH trees** because it is the row whose expected message differs between
  them (`expected [ 'zobrist.ts' ] to deeply equal []` on 16;
  `expected [ 'turn-loop.ts', 'zobrist.ts' ] to deeply equal [ 'turn-loop.ts' ]` on 17), and because it
  is the one lost build that is **not** a removed false positive. The other two are single-tree because
  their verdict does not depend on the licence's contents, and single-tree is what Architect/Design
  measured — **I did not require a verdict nobody has taken.**
- **`WREEXPORT-STAR` is not decoration.** Without it, an expression that handles
  `export { x } from` but not `export * from` passes the row.

## 3. `A6.2` — the three GREEN rows, and the CEILING written as a VERDICT

`WTYPEREEXPORT` (16), `WTYPEREEXPORT-PANEL` (16), **`WPERFT-DYN` (16 AND 17)** — regex **GREEN**.

**The two names are coined here.** Architect/Design measured them as *"`export type { … } from` in
`zobrist.ts`"* and *"in `status-panel.ts`"* and gave them no name; naming is what `ADR-0011` reserves
to this role.

**The ceiling is written as a required verdict — `WPERFT-DYN` GREEN — and NOT as a prohibition on
detecting the dynamic form.** That is a deliberate divergence from how `ADR-0011` states the same
bound, and the reason is in the sibling `claim` note. **It is not weaker:** every expression that
reaches the dynamic literal in a file the regex scans reds `WPERFT-DYN` and dies on this row. It is
safer, because it forbids the outcome `A3` protects rather than a technique.

## 4. `A5.6` — QE's draft, taken as drafted

Written on `WSWAP` on the 17-file tree, required **regex RED**, with the construction stated inline so
it is not re-derived. **`A5`'s header already said `EQUAL`; `A5.6` is what makes the word enforceable.**

## 5. One clause added that the ADR mandates and no owed row covered

**The docblock.** `ADR-0011` says the containment's second site — the block listing the regex's misses
as a completed set and silent on re-export — *"must be corrected with the code"*, because *"that
silence is what made `WLAUNDER` invisible"*. That is not one of the three owed rows and it would have
fallen through the gap between them, so it is written as a clause of `A6`, **verified by reading
exactly as `A4` is**, with `## Test notes` 11 recording that the record gives **two** candidate line
ranges for it (`:253-262` from `A4`, `:346-351` from QE) and that both must be true if they are two
blocks. **That is `A4`'s own lesson applied to `A4`'s successor.**

## 6. What I did NOT write

- **No ADR edit.** `ADR-0011` was read at source and not opened for edit.
- **No `src/` byte, and `src/` was not opened at all** — the brief forbade it and a concurrent Engineer
  hop is live on `ABC-028` in `src/history-pane.test.ts`.
- **No `plans/board.md`, no `plans/nfr-catalog.md`, no `ABC-028`, no `ABC-019`, no merged ticket.**
- **No `N8-LANE` verdict**, no bar, no target, no level.
- **No test line.** Writing the mutant would be encoding the criterion I then pass.
