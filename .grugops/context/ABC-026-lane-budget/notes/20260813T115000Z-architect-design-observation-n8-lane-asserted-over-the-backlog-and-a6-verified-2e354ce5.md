---
id: 20260813T115000Z-architect-design-observation-n8-lane-asserted-over-the-backlog-and-a6-verified-2e354ce5
kind: observation
by: architect-design
at: 2026-08-13T11:50:00Z
verified_by:
confidence: high
refs:
  - ABC-026
  - ABC-026-A3
  - ABC-026-A6
  - N8-LANE
  - NFR-008
  - ABC-024
  - ABC-010
  - ABC-021
  - ABC-032
  - plans/nfr-catalog.md
supersedes:
---

# `A3` asserted **OVER** the backlog, and `A6` verified **mechanically**

## `A3` — `N8-LANE` is inherited BY NAME. **12 cite it, 1 states nothing, 0 state a looser bar.**

Scope: every ticket whose file says `column: Backlog` (13) plus the board's `Ready` column
(`ABC-021`, `ABC-026` — both already in that 13). **Union = 13 distinct tickets, each read.**

```
cite N8-LANE BY NAME, with its number (<= 650 ms CPU)    12
  ABC-010  ABC-021  ABC-026  ABC-030  ABC-031  ABC-032
  ABC-033  ABC-034  ABC-035  ABC-036  ABC-037  ABC-038

state NO lane bar at all                                  1     ABC-024
state a LOOSER bar                                        0
```

**`ABC-024` is correct rather than a gap.** Its `## Security / NFR triggers` reads *"NFR: none, and the
reason is structural rather than a judgement"* — zero production lines — and it adds rows to an
**existing** file (`src/moves.castling.hardening.test.ts`) rather than a new one. `N8-LANE`'s own
sentence, *"a ticket that states nothing has stated this one"*, makes that compliant without an edit.
**I did not edit it, and `A3` does not require one.**

**One text matched a lane-denominated 5% and it is NOT a violation:** `ABC-032` line 135 reads *"not 5%
of the lane as it stands"* inside its explanation of why the denominator changed. **That is the
corrected reading being taught, not a bar being stated.** Checked by reading the paragraph rather than
by trusting the grep.

**BA/PM's own check at 2026-08-12 said `ABC-010` and `ABC-021` *"predate the row and state nothing"*.
That is now STALE in the good direction:** both pages have since had an explicit inheritance note
added — `ABC-010` line 283 (*"`N8-LANE` inheritance, noted because this ticket predates the row"*) and
`ABC-021` line 287. **So `A3` is met more strongly than when it was written, and the census moved from
"11 cite + 2 silent" to "12 cite + 1 silent".** Recorded because a criterion that quietly got easier
should say so.

## `A6` — nothing under `src/` moved. Asserted at the end, not assumed.

```
1. src/ byte-identical         47 md5s, hashed BEFORE any work and AFTER everything
                               `cmp` of the two md5 manifests: IDENTICAL
2. git status --short -- src/  EMPTY
   git diff --numstat -- src/  EMPTY  (zero rows, so zero files added/changed/removed)
3. test FILE count             28 before, 28 after
   test count                  807 before, 807 after; skip count 0
4. NFR-001..NFR-008 rows       sha256 of the 8 matched row lines together:
                               63f667958eeabcaa...802eca31  BEFORE
                               63f667958eeabcaa...802eca31  AFTER      IDENTICAL
                               (and unchanged from the ABC-029 hop's recorded hash)
                               46 table lines before, 46 after; each row hashed individually too
5. the whole diff vs 06c5427   ADR-0008     +109 / -0
                               nfr-catalog  + 78 / -0
                               traceability +  1 / -1   (ONE line: the ABC-026 row, mine)
                               vitest.config.ts  new, untracked -> added
```

**Item 5 is the strongest form of "no target, bar or level moved" available: the two catalog/ADR edits
are PURE ADDITIONS with ZERO deletion lines.** Nothing could have been moved, because nothing was
removed or rewritten. `plans/traceability.md` changed **exactly one line** and it is `ABC-026`'s own
row; the table still holds 40 `ABC-`/`EPIC-` rows, the same as at `06c5427`.

**Not written, per the brief's boundaries:** `plans/board.md`, `plans/metrics.md`, any other ticket
file, and anything under `src/`. **`plans/tickets/ABC-026-*.md` itself was NOT edited** — its
`## Acceptance` criteria are BA/PM's and an architect marking his own criteria met inside the ticket is
the conflict Security/NFR refused at `ABC-025`'s gate. The verdicts live here, in the catalog, in the
ADR and in the trace row.

## The gates, and the one that was deliberately not run

```
npm run lint       exit 0    49 files, 2 pre-existing infos (a biome-migrate notice; unchanged)
npm run typecheck  exit 0
npm run build      exit 0
npm test           exit 0    807/807 on 28 files      skip count 0
```

**`PERFT_DEEP` was NOT run, and that is a RULING rather than an omission.** The deep lane is the
move-generation oracle; **this diff cannot reach the rules core because it contains zero `src/` bytes**
(item 2 above proves it, mechanically, rather than by inspection). Running a ~37 s opt-in suite to
re-confirm a tree that is byte-identical to the one `main`'s gate already passed would be theatre.
**Said explicitly because the brief required it to be said explicitly.**

One fact worth leaving for the next engineer: **`vitest.config.ts` is outside `tsconfig.json`'s
`include` (`src/**`, `spike/**`) and outside `biome.json`'s `files.includes`, so NEITHER `npm run
typecheck` NOR `npm run lint` reads it** — lint still reports 49 files, unchanged. A mistake in that
file is caught only by `npm test` actually running. **This is disclosed rather than fixed:** adding it
to either tool's scope is a repo-wide config change that this ticket did not ask for and that could
move lint results on files it does not own. The fact is written into the file's own header.
