---
subtask: arch-rule-ABC-205-stop
role: architect-design
ticket: plans/tickets/ABC-205-king-safety-bites-while-queens-are-on-and-the-king-table-is-tapered.md
ref: .grugops/context/arch-rule-ABC-205-stop/
branch: grugops/ABC-205 (4f650a45)
width: 3 of 3 (records + light probes)
---

# Rule the SE's STOP on ABC-205 (S1–S3)

## Do
- **S1** (transposition A4 mate-reuse, SEARCH_DEEP): fixture property lost at 160 ticks (depth 9 vs pinned 10; 180 ticks reaches 10). Rule: re-budget to 180 ticks (probe that the table reuse still happens), re-find the fixture, or other. A value-only re-pin under ADR-0028 is yours.
- **S2/S3** (pvs-lmr A1 drift, depth 5, 79 cp vs ADR-0026's 75 cp level): rule whether moving that level is within ADR-0028's headroom rules (yours) or needs the owner (a level that has used its headroom, or an ADR change → owner, PROPOSED). Consider the taper's role.
- Light probes on a scratch copy of the branch only. Write a dated addendum to the ABC-205 Design ruling; list the exact edits the SE may make.

## Fences
- Worktree from `grugops/ABC-205` on `grugops/arch-rule-ABC-205-stop`. Only the ABC-205 page, ADR text if an owner-route is needed (PROPOSED), your notes. No `src/` or test edits. Temp files only in `/private/tmp/claude-501/-Users-olgeroeselg-Projects-hacks-grugops-examples-cli-chess-example/7311fff4-c502-4aa9-80bc-0bf8723c1183/scratchpad/rule205/`. Explicit context root. Never push, force, amend or rebase; never merge into `main`; don't touch the remote.

## Publish
- Seal notes (task `arch-rule-ABC-205-stop`), `at` from `date -u`, `kind: decision`. `## Result` + 10-cell trace row into this brief in main's queue, then move it and its `claim.md` to `done/`.

## Result

**DONE: records plus light probes. Branch `grugops/arch-rule-ABC-205-stop` @ `e9c31088`** (from `grugops/ABC-205`
`4f650a45`; commits `bfc94880` for the records and `e9c31088` for the notes). Not pushed and not merged. Worktree
`../wt-arch-rule-ABC-205-stop`.

- **Files:**
  - `plans/tickets/ABC-205-…md` § Addendum 2026-10-24 (under the Design ruling);
  - `ADR-0031` addendum: new `A7` (`OD-205-2`), a Status line and a Consequences line;
  - `ADR-0026`: § Proposed amendment 2026-10-24, **PROPOSED**, with one Status pointer. Decision 9 is untouched until
    the owner accepts it;
  - `.grugops/context/arch-rule-ABC-205-stop/` (README copied from `main`, plus notes and index).
- **Not touched:** `src/`, tests, the catalog, the board, the trace file, and the `ABC-206` and `ABC-212` files.
- **`S1` (this role's call): re-pin by `maxDepth: 10`, frozen clock, in place of the 160-tick budget.**
  - The ±ply mutant bite was already lost at `ABC-083` (`f00038ef`); bisected at 5 merges.
  - Cross-ply mate reads at 160 and 180 ticks: base 0, build 1, and no root score changes.
  - A re-find is not possible: the 287 × depth 6–10 scan finds 0 cells on base and 1 cell on the build only.
  - 180 ticks would work today (depth 10, −29 992), but it keeps the node-count dependence.
- **`S2`/`S3` (owner's): `OD-205-2`, PROPOSED, depth-5 drift maximum 75 → 118 cp (⌊1.5 × 79⌋), both recursions.**
  - The shelter gate drives it: gate alone 87 cp, blend alone 55, scale alone 107 (another position).
  - Not a defect (`ADR-0028` d1). The level carries 1.67x measured headroom, so d3 does not reach it, d4 stops it,
    and d5 gives it to the owner.
  - `early` stays red on the 95 % clause (93.05 / 91.44 %).
  - `ADR-0034`'s clean-lead bar follows, for later re-finds only.
- **Edits the SE may make:** see the page addendum, edits 1–4. Edit 1 (`S1`) can be made now. Edit 2 (`S2`/`S3`)
  waits for the owner's `OD-205-2`. `OD-205-1`'s cell is unchanged.
- **STOP:** none on this hop. `OD-205-1` and `OD-205-2` are owner words owed before merge.
- **Next move (Orchestrator):**
  - merge this records branch;
  - report `OD-205-1` and `OD-205-2` together with the `ADR-0031` addendum;
  - hand edit 1 to the SE now.
- **Notes:** `20261023T230351Z-architect-design-decision-3809d451` and
  `20261023T230351Z-architect-design-observation-4f0884fe`. Sealed by grugops 2.1.0 `admitAndAppend` with the
  worktree's context root, read back as 2, index rendered.

### Trace row (10 cells, header order)

| ABC-205 (arch rule STOP) | Architect/Design: the SE's STOP ruled. S1 transposition `A4` mate-reuse row re-pinned by `maxDepth: 10` (the ±ply search-level bite was lost at `ABC-083` `f00038ef`; no base+branch re-find exists); S2/S3 pvs-lmr `A1` depth-5 drift max 79 vs 75 cp, driven by the shelter gate, not a defect, level carries headroom → `OD-205-2` (75 → 118 cp) to the owner; `ADR-0026` amendment and `ADR-0031` addendum `A7` PROPOSED | EPIC-008 | ADR-0026, ADR-0028, ADR-0031, ADR-0034, ADR-0039, ABC-121, ABC-081, ABC-083 | no NFR bound moved; `ABC-121` `A1` drift max (owner-accepted criterion) → `OD-205-2` | `grugops/arch-rule-ABC-205-stop` @ `e9c31088` (records only)<br>`plans/tickets/ABC-205-…md` § Addendum 2026-10-24, `ADR-0031` § Addendum `A7`, `ADR-0026` § Proposed amendment 2026-10-24 (PROPOSED)<br>`.grugops/context/arch-rule-ABC-205-stop/notes/` (…3809d451, …4f0884fe) | records only; scratch-copy probes at 4f650a45 / f47b3429: S1 ticks 40–400, maxDepth 9/10, ±ply mutant at 5 historical merges, cross-ply read count, 287 × d6–10 re-find scan; S2/S3 d5 drift on the 190 in both recursions for base, build, 4 term variants and `early` on base and build | — | — | DONE; OD-205-1 + OD-205-2 to the owner; SE edit 1 now; merge is the Orchestrator's |
