---
id: 20260813T134000Z-ba-pm-artifact-ref-three-short-board-rows-three-trace-rows-verbatim-and-everything-this-hop-wrote-5e0b91c6
kind: artifact-ref
by: ba-pm
at: 2026-08-13T13:40:00Z
verified_by:
confidence: high
refs:
  - ABC-050
  - ABC-051
  - ABC-052
  - ABC-035
  - ABC-030
  - plans/board.md
  - plans/traceability.md
  - .gitignore
  - agents-md-process-rules
supersedes:
---

# Three SHORT board rows, three traceability rows verbatim, two routings that are not board moves, and the complete inventory

> **Hand-authored, no stamp.** **`plans/board.md` and `plans/traceability.md` were NOT opened for
> edit** — the board is the Orchestrator's and the trace has a concurrent lane appending to it.
> Everything in sections A–C is a **request**, placeable verbatim.

## A. `## Backlog` — THREE rows to APPEND, verbatim

**Written short on purpose.** Nothing in them is load-bearing except the id, size, priority and the
DoR score; **if they still read long, trim them.** All three are `Backlog` placements — **none is a
`Backlog → Ready` move**, so this hop exercises none of BA/PM's board exit.

```
- [ABC-050] The lane runner config has no guard — no static tool reads `vitest.config.ts`, and no assertion watches the containment it buys  (BA/PM, S, P2, epic: —, since: 2026-08-13, **DoR 10/10**; THREE gate gaps folded into ONE subject; promote to P1 the moment anyone opens `vitest.config.ts` for an option change)
- [ABC-051] ABC-021 left the turn loop's own records false in four places, and its per-ply bar blind to the derive the loop now makes  (BA/PM, S, P2, epic: EPIC-002, since: 2026-08-13, **DoR 10/10**; TWO of the six sites were reported by nobody; NOT a re-open — a gap found after a merge becomes a new ticket)
- [ABC-052] The traceability Status column goes stale on every merge — 12 of 27 Done tickets, and it grew by two this morning  (BA/PM, S, P2, epic: —, since: 2026-08-13, DoR 8/10 ⚠️x2 NOT MET — ordering on ABC-040, which merges the ABC-029 row pair this ticket would otherwise repair first; no criterion carries a literal count)
```

**None of them goes to `Ready`, and `ABC-050`/`ABC-051` being 10/10 is not a reason to promote
them** — `ABC-030`'s standing argument, adopted unchanged: stocking a thin `Ready` column with
control debt makes it look full.

## B. `plans/traceability.md` — THREE rows to APPEND, verbatim, 10 cells each

**Sequence these against the concurrent `EPIC-006` lane's appends.** No existing row is touched and
no row is deleted.

```
| ABC-050 | The lane runner config has no guard — `vitest.config.ts` is read by neither `npm run lint` nor `npm run typecheck`, its `:52` sentence names a failure mode that cannot occur, and no assertion in the suite watches the containment it buys | — | — | **`N8-LANE` ≤ 650 ms CPU, inherited by name** — ZERO new test FILES by construction (`A5`'s assertion lands in the existing `src/glyph-mode.nfr.test.ts`), so the 160 ms-per-file term is **+0**. **`NFR-008` (3 s wall / 13 s CPU, `ADR-0008`, owner-ratified) UNCHANGED and not re-measured** — firing threshold: any edit to a runner option in `vitest.config.ts`, which is a stop-and-report rather than a scope decision. Security assessed and NOT fired: config scope plus one test assertion, nothing evaluated, spawned or interpolated, no runtime dependency. | none yet — **ZERO production lines.** Four sites: `biome.json` `files.includes`, `tsconfig.json` `include`, `vitest.config.ts:52`, `src/glyph-mode.nfr.test.ts:96` | none yet — **no new test FILE.** `A2` requires a deliberately wrong `vitest.config.ts` that leaves the suite GREEN to be caught by lint or typecheck; `A5` requires an ARMED out-of-tree control (a probe that mutates `process.env` and does NOT restore, run under `--no-isolate --poolOptions.threads.maxThreads=1`) to turn `glyph-mode.nfr.test.ts` RED. Neither control is committed | | | **Backlog — DoR 10/10 MET, cut 2026-08-13 by BA/PM at `refinement-home-the-gaps` from `quality-gate-ABC-026` gaps 1, 2 and 3.** `10/10` is not a promotion argument and it stays in `Backlog`. Three gaps, one subject: the mechanism all 816 tests rely on is asserted by nothing |
| ABC-051 | `ABC-021` landed and left the turn loop's own records false in four places — and its per-ply bar cannot see the `keyHistory` derive the loop now makes on the refused-claim path | EPIC-002 | — | **`NFR-002` (`ABC-019`'s ≤ 100 µs per-ply bar) — NOT MOVED; this ticket restores the bar's ABILITY TO FAIL.** The measurable statement is `A1`: the mutant `keyHistory(history)` once per advancing ply — a second `O(plies)` replay priced at **46–50 µs at 120 plies** — currently passes **814/814** with `repetitionCounts` at 0 and `gameStatus` at `plies + 1`, and must be RED in the file that owns the bar. **`N8-LANE` ≤ 650 ms CPU, inherited by name** — ZERO new test files, assertions land in existing rows, so the per-file term is **+0**. Security firing threshold: any line changed in `src/turn-loop.ts` that is not inside a comment | none yet — **ZERO production lines.** Two files: `src/turn-loop.ts` (comment text only, `:105`, `:247`) and `src/turn-loop.nfr.test.ts` (`:23`, `:131`, `:136`, and the `vi.mock` factory at `:40-43`) | none yet — **no new test FILE and no new `it`.** `A1`/`A2` add a `keyHistory` call-through spy and assertions inside existing rows: **0** on an advancing run, **1** on a refused claim, **2** on two refusals. `A1` is met only by building the mutant on an md5-pinned tree and watching it go red | | | **Backlog — DoR 10/10 MET, cut 2026-08-13 by BA/PM at `refinement-home-the-gaps` from `quality-gate-ABC-021` gaps `G-1` and `G-3`.** NOT a re-open of `ABC-021`, which is `Done` and merged — this board's own rule: a gap found after a merge becomes a NEW ticket. **Two of the six sites (`:131`, `:136`) were reported by no role and were found by re-reading the file at this hop** |
| ABC-052 | The traceability `Status` column goes stale on every merge — 12 of the 27 `Done`-column tickets have a live `Status` cell with no occurrence of the word `Done`, and it grew by exactly two this morning | — | — | **NONE FIRE, and it is a MEASURED non-trigger rather than a waiver.** Firing threshold: any production line at all, or any new file under `src/` — measured **ZERO of both** (one markdown file plus one `tools/grugops/` probe). **`N8-LANE` delta ZERO BY CONSTRUCTION** — no test file added, changed or removed; `ADR-0008`'s paired protocol **must NOT be run for it**; `ABC-026` still owns the lane total. Security: the probe reads two tracked markdown files and writes nothing — firing threshold is any write by the probe to any path, or any dependency added to `package.json`. Checkable at the gate: `git diff --numstat -- src/` must be EMPTY | none yet — **ZERO production lines.** One probe under `tools/grugops/` (the pattern `reference-check.js` and `test-skip-integrity.js` already set) and append-only edits to `plans/traceability.md` `Status` cells | none yet — **no test is owed and none may be added**; there is no runnable surface. `A2` is the verification: removing one repaired cell's appended sentence must make the probe exit non-zero naming that id **and no other**, and restoring it must make it exit 0 | | | **Backlog — DoR 8/10, ⚠️x2, NOT MET and deliberately not smoothed.** Cut 2026-08-13 by BA/PM at `refinement-home-the-gaps`; the `refinement-cut-039-040` hop measured this, refused to fold it into `ABC-040` because it takes that ticket past `S`, and could allocate no id. **Both ⚠️ are one genuinely open ordering dependency on `ABC-040`**, which merges the `ABC-029` row pair this ticket would otherwise repair first. **The prior hop's `10 of 25` reproduces member-for-member; the two new members are `ABC-021` and `ABC-026`, which merged this morning** |
```

## C. TWO routings that are NOT board moves and NOT tickets

1. **The `coverage/` landmine — a `.gitignore` change, to the Orchestrator, not the Scribe.**
   `printf 'coverage/\n' >> .gitignore` then `git rm -r --cached coverage/`. Evidence that the 22
   tracked files are a **stale rules-core-era artifact** (they cover 8 of today's 47 `src/` files and
   have not moved since `76ca714`) is in the landmine note, with the argument for why an `AGENTS.md`
   line is the **wrong** control. **Until it lands, any hop running coverage must
   `git checkout -- coverage/` before committing.**
2. **The substrate gap — escalate to the named human who owns the install, and give the Scribe ONE
   `AGENTS.md` paragraph.** Not an `ABC-` ticket; the reasoning and the suggested wording are in the
   substrate note. **The `AGENTS.md` paragraph is the only part of that gap that is cheap, in-repo and
   worth doing today** — it ends an eight-hop re-derivation tax.

## D. Complete inventory — 10 files, ZERO under `src/`, ZERO in `plans/board.md` or `plans/traceability.md`

```
NEW tickets (3)   plans/tickets/ABC-050-lane-runner-config-has-no-guard.md              203 lines
                  plans/tickets/ABC-051-turn-loop-records-false-and-per-ply-bar-blind.md 207 lines
                  plans/tickets/ABC-052-trace-status-currency.md                        203 lines
EDITED (2)        plans/tickets/ABC-035-in-game-commands.md      +131/-51   six statements repaired
                  plans/tickets/ABC-030-...-live-sibling-count.md +10/-0    one Out-of-scope fence
NOTES (5)         .grugops/context/refinement-home-the-gaps/notes/   (this file is the fifth)
QUEUE             .grugops/queue/claimed/refinement-home-the-gaps/  (claim.md + the subtask file),
                                                                     then -> done/
```

**Verified with `git status --porcelain` and `git diff --numstat`, not asserted:
`git diff --numstat -- src/` is EMPTY.** No `index.md` / `index.jsonl` exists for this task and
**none was hand-faked** — the tool that renders them does not exist on this install.

## E. The page-length measurement, because the last hop held itself to it and missed

The `refinement-cut-039-040` hop measured its own pages at **271 and 312 lines against `ABC-030`'s
248 for an `XS`**, and wrote: *"both are longer than the `XS` analogue — I did not beat the trend I
am criticising, I only slowed it."*

**Measured here: 203 / 207 / 203 for three `S` tickets.** Below the `XS` analogue and **~30% below
that hop's own `S` pages.** The method was the one it recommended: **keep the measurement tables,
cut the rationale prose.** Every site in all three tickets carries its `file:line` so the next hop
does not re-derive what I measured, and the arguments are one paragraph each instead of three.

**This is reported as a measurement, not a boast — the delivery audit's 142 ticket-lines per
production line is the number, and three pages at ~200 lines for gaps that would otherwise have been
six pages is the only contribution this hop makes to it.**

## F. What was NOT touched — the boundary list, re-checked at the end

**`plans/board.md`** (the Orchestrator's — not opened for edit), **`plans/traceability.md`** (the
concurrent lane's — rows given above verbatim instead), **every ADR** including `ADR-0008`
(owner-ratified), **`plans/metrics.md`**, **`plans/nfr-catalog.md`**, **`vitest.config.ts`**,
**everything under `src/`**, **every `Done` ticket page** including `ABC-021` and `ABC-026`,
**`EPIC-006` and every ticket in `ABC-041`–`ABC-049`** (the concurrent lane's), **`AGENTS.md`** (the
Scribe's), **`.gitignore`**, and **`.grugops/test-skips.md`** (not created — `H2`, a named human's).

**Nothing merged, nothing pushed, nothing deployed. `main` was never checked out from this
worktree.**
