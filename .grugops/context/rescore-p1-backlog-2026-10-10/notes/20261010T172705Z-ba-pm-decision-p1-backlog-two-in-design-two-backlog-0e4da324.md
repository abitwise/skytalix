---
id: 20261010T172705Z-ba-pm-decision-p1-backlog-two-in-design-two-backlog-0e4da324
kind: decision
by: ba-pm
at: 2026-10-10T17:27:05Z
verified_by:
confidence: high
refs:
  - ABC-085
  - ABC-093
  - ABC-094
  - ABC-095
  - ABC-083
  - ABC-010
  - ABC-101
  - ABC-131
  - ABC-141
  - EPIC-004
  - EPIC-005
  - ADR-0012
  - ADR-0023
  - ADR-0027
  - ADR-0032
  - ADR-0035
  - ADR-0036
  - plans/traceability.md
  - .grugops/queue/pending/rescore-p1-backlog-2026-10-10.md
  - .grugops/context/rescore-p1-backlog-2026-10-10/probe/RUN.txt
supersedes:
---

P1 backlog re-score. Task `wave-2026-09-25`, subtask `rescore-p1-backlog-2026-10-10`, Workflow 07, at
wave tip `aaa88263`. Every premise was re-read on the tree. The unmerged `ABC-010` (`f9d1ff4b`) and
`ABC-131` (`677b8b09`) were read with `git diff` against their merge bases. One probe ran on BA/PM's
own harness (`../probe/`), importing merged `src/` read-only; nothing under `src/` was written. No QE
or engineer script was run or refused.

| ticket | premise at `aaa88263` | DoR | size / pri | recommended column |
|---|---|---|---|---|
| ABC-085 | all deps `Done`; the book fence is resolved by construction; **the 5 h was real-clock and `A5` is virtual, with an unnamed step** | **8/10** (was 7): ⚠️4 (new), ⚠️10 | M / P1 | **In Design** (D4) |
| ABC-093 | `ABC-092`/`ADR-0023` discharged; no format ADR | **9/10** (was 8): ⚠️5 | M / P1 | **In Design** (D1, and D2/D3 ride the same hop) |
| ABC-094 | "first production RNG" is **stale** (`seededRandom`, `src/levels.ts:61`); `G4` narrowed; first prod `node:fs` | **8/10** (same score, both ⚠️ narrowed): ⚠️5, ⚠️10 | M / P1 | **stays Backlog** |
| ABC-095 | `ABC-078` `Done`; the composition root exists (`src/cli.ts:176`); **wiring line drawn into scope** | **7/10** (was 8): ⚠️3, ⚠️5, ⚠️10 | S / P1 | **stays Backlog** |

## Decisions taken on BA/PM's own authority (the Orchestrator may reverse any)

1. **`ABC-095` owns the one wiring line at `src/cli.ts:176`.** `ADR-0012` clause 6 left this
   boundary to BA/PM. Without the line, no player's game consults the book, and the page's Problem
   says this is the only ticket a player perceives. New `A7`: the `engine:` value is the decorated
   `createEngine(...)`, plus one `CLI_DEEP` row (a real child's reply to `e2e4` is a book entry).
   **Cost:** item 5 goes ⚠️, because a per-session seed source does not exist in production
   (`createEngine` takes no seed, and `createLevel` takes a caller's). **To reverse:** the score
   returns to 8/10 and the line needs its own XS ticket.
2. **`ABC-085`'s book dependency is closed by construction, not deferred.** The book decorates
   `EngineSeam` (`(history) => Promise<Move>`) at the composition root. The ladder drives `createLevel`
   (`(position) => LevelChoice`, `src/levels.ts:110`), which no book wraps. An out-of-scope sentence
   now says that a ladder through the book is not this ticket.
3. **`ABC-085` item 4 is newly ⚠️.** "The default budget" in `A1`/`A6` has no reproducible meaning on
   a virtual clock with no named step, and the probe shows the step changes the answer (below).
4. **Stale page text is dated, not rewritten.** `NFR-008` 13 s → 15 s (`ADR-0019`); 650 ms per-ticket
   bars → under `ADR-0035` (proposed) refused at the cut below 1.72 s full-lane CPU, so counts are the
   pins; `N-LOAD`'s `npx` → `npm run chess` on a clone (`ADR-0018`); `package.json` has **no**
   `dependencies` key (`ABC-093` `A7` said `{}`); `EngineSeam` `:138` → `src/turn-loop.ts:150`.

## The probe (`ABC-085`'s levels 3/4/5 risk), and what it does and does not show

On a virtual clock an aborted iteration is discarded (`src/engine.ts` `runIteration` / `chooseMove`)
and the TT is cleared per search (`ADR-0025`). So two rate-0 levels that complete the same depth pick
the **same move**. 50 positions (`buildCorpus`, stride 4), one fresh `virtualClock(step)` per call,
the same step for all three levels. Count = positions where the chosen move differs:

| step | 3 vs 4 | 4 vs 5 | median depth (3/4/5) | real ms per reading | real ms per L3 / L5 move |
|---:|---:|---:|---|---:|---|
| 120 | 9 / 50 | 2 / 50 | 5 / 5 / 5 | 4.4 | 110 / 166 |
| 30 | 2 / 50 | 0 / 50 | 6 / 6 / 6 | 5.5 | 549 / 823 |
| 10 | 2 / 50 | 0 / 50 | 7 / 7 / 7 | 5.3 | 1 599 / 2 398 |
| 4 | 4 / 50 | 0 / 50 | 8 / 8 / 8 | 5.8 | 4 370 / 6 555 |

- **Shows:** below step 120, level 5 never picked a different move from level 4 (0/50 at steps 30, 10
  and 4, the last about real time here), and level 4 differed from level 3 on 2–4/50. The count is not
  monotone in the step (9, 2, 2, 4 for 3 vs 4). That is the August prediction with a mechanism and a count. A step-120 run repeated byte-identically
  (an earlier direct run read the same 9/50 and 2/50 at 3.6 ms per reading). The host was loaded
  (load1 5–11), so the wall figures are diagnostic only.
- **Does not show:** a game score. Two levels that agree on most positions can still separate over
  100 plies, and the ladder's seeded openings reach other positions. `A2` stays the verdict.
- **Cost:** the ladder's price is `budget ÷ step × ~5 ms` per move. The page's 5 hours assumed a 3 s
  real move. At step 120 the L5-vs-L1 `A1` run is an estimated tens of minutes (no game was run); near
  real time it is hours.

## Owed to Architect/Design: one `In Design` hop for the book chain, and one for `ABC-085`

- **D1 (`ABC-093`):** the format: key (Zobrist `bigint`, FEN, or truncated hash; this decides `A2`'s
  method), weight encoding (`ADR-0023` d5 allows uniform), where the name field lives (`ABC-096`), and
  where the artifact and the compiler live. Placement decides two gates: a non-test compiler in `src/`
  needs the owner's UAT word and, with a Node builtin import, fires `ADR-0036` (b1).
- **D2 (`ABC-094`, `G4`):** `ADR-0012` § Consequences keeps it Architect/Design's, "before `ABC-094`
  enters `In Development`". The question left is narrow: the probe takes an injected `() => number`
  built from `seededRandom`, or `seededRandom` first leaves `EPIC-004`'s `src/levels.ts`.
- **D3 (`ABC-095`):** where the per-session book seed comes from at the composition root.
- **D4 (`ABC-085`):** the virtual step (or steps) for `A1`/`A2`/`A6`, and what a virtual-clock verdict
  claims about the shipped real-clock levels (`ADR-0027`: "a virtual millisecond is not a real one").
  Also the opt-in lane name.

## Questions for the owner (Olger Oeselg)

1. **`ABC-085` `A2`, levels 4 and 5.** With the probe above, which do you choose? (a) Run as cut and
   accept a likely `A2` red at 3/4 and 4/5 as `ABC-087`'s finding. (b) Re-cut the levels above the
   default now; that changes `ABC-101`'s vocabulary. (c) Scope `A2` to pairs at or below the default.
   None is taken here. Not blocking `In Design`; it is blocking the build's meaning.
2. **`ABC-085`, cost against fidelity.** Will you accept a ladder verdict taken on a coarse virtual
   step (an estimated tens of minutes, a weaker proxy of the shipped levels) as discharging `EPIC-004`'s first criterion?
   Or must it run near real time (hours, and someone has to run it)? Architect/Design rules what each
   step means (D4); what the epic is worth in machine hours is yours.
3. **`ABC-085` priority, P1 or P0.** The page has always left this to you. It is now the only thing
   left that can prove `EPIC-004`'s first criterion. BA/PM keeps P1.
4. **`ABC-093`, signing third-party data.** If D1 puts the compiler and artifact outside `src/`, the
   zero-production-lines rule waives UAT by measurement, while CC0 data ships to every clone. Do you
   want to sign the first third-party content anyway? Not blocking.
5. **`ABC-095` × `ABC-101`, book versus level.** Under `ADR-0012` the decorator wraps whatever seam the
   root builds, so a book hit skips a weak level's blunders in the opening. Is that the product you
   want? Not blocking until both are built; the second to land composes onto the first.

## File overlaps (cannot build in parallel)

- **`src/cli.ts` `engine:` expression (`:176`):** `ABC-095` (wiring) × `ABC-101` (P2, Backlog; level
  wiring). `ABC-138` merged into `src/cli.test.ts` during this hop (`497d3b2f`); `ABC-095` does not need
  to edit that file.
- **`src/levels.test.ts`:** `ABC-010` (unmerged) edits the fixture at `:351`. `ABC-085` overlaps only
  if its harness lands in that file.
- **By value, not file:** `ABC-083` (king safety; Backlog, after `ABC-131`) changes the evaluation every
  level uses, so `ABC-085`'s verdict should be taken after it merges, or re-run then. If D1 keys on FEN,
  `ABC-093`'s compiler meets `ABC-010`'s stricter `parseFen`.
- **No overlap:** `ABC-131` (`src/puzzle-corpus.ts`, baseline, `src/puzzle-suite.test.ts`), `ABC-141`
  (`src/move-input*.ts`, `src/history-pane.ts`), `ABC-140` (`src/history-pane.nfr.test.ts`, merged `5610bdb1` during this hop) and the
  four tickets here.

## Recommended pull order (the Orchestrator's call)

1. **`ABC-093` → `In Design` now**, with D2 and D3 on the same Architect hop, so that one hop answers
   the book chain. BA/PM folds; then `Ready for Dev`. Pull it to build after `ABC-010` merges if D1 keys
   on FEN.
2. **`ABC-085` → `In Design` now** (D4). In Design goes to 2/2. Owner questions 1–2 are best answered
   before the build. Build anytime after D4. Take the verdict run after `ABC-083` merges, or re-run it.
3. **`ABC-094`** after `ABC-093` merges and D2 is folded (`A5` may be written earlier).
4. **`ABC-095`** last, after `ABC-094` merges and D3 is folded. Sequence it against `ABC-101` on
   `src/cli.ts`.

Production / UAT expectation: `ABC-094` and `ABC-095` need the owner's word (new `src/` modules; `ABC-095`
edits `src/cli.ts`) and expect `In Security/NFR` (`ADR-0036` (b1)/(b2)). `ABC-093` depends on D1's
placement. `ABC-085` is waived if its harness is test-file-only.

Not done here (fences): no `src/`, no `plans/board.md`, no ADR, no `AGENTS.md`, no column change; the
four pages and the trace rows only. No `finding` is admissible on this install (`AGENTS.md`); this note
is a hand-authored `decision` with no seal, like every note in this repository.

Addendum, same hop. The wave moved from `aaa88263` to `bb73aebb` while the probe ran: `ABC-138` and
`ABC-140` merged and are `Done`, and `design-qe140a` was enqueued. Every file this note cites is
byte-identical between the two tips (`src/cli.ts`, `src/levels*.ts`, `src/engine.ts`, `src/turn-loop.ts`,
`src/san.ts`, `src/virtual-clock.ts`, `src/evaluate.mirror-corpus.ts`, `src/frame.test.ts`, `AGENTS.md`,
`package.json`, `memory-bank/50-decisions/`, `plans/nfr-catalog.md`, the four pages). The branch is rebased
onto `bb73aebb`; the only conflict is the append at the end of `plans/traceability.md`, and both row sets
are kept, these four last.
