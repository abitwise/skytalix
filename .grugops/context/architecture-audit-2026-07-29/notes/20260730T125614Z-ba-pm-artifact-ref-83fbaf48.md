---
id: 20260730T125614Z-ba-pm-artifact-ref-83fbaf48
kind: artifact-ref
by: ba-pm
at: 2026-07-30T12:56:14Z
verified_by: 
confidence: high
refs:
  - architecture-audit-2026-07-29
  - ABC-011
  - ABC-009
  - ABC-010
  - EPIC-001
  - EPIC-004
  - EPIC-002
  - EPIC-006
  - ADR-0002
  - ADR-0003
  - NFR-005
  - NFR-001
  - RISK-002
  - plans/tickets/ABC-011-zobrist-en-passant-hashing.md
  - plans/epics/EPIC-004-engine-and-ai-opponent.md
  - plans/board.md
  - plans/traceability.md
  - src/zobrist.ts
  - 20260729T145433Z-architect-design-observation-43d9a3cc
  - 20260729T151049Z-ba-pm-artifact-ref-328eba81
  - 20260729T200039Z-architect-design-decision-bd553d62
  - 20260730T105400Z-architect-design-decision-309efdbe
  - 20260730T120521Z-architect-design-decision-ef4765f8
  - 20260730T121731Z-orchestrator-observation-6d1e04b7
supersedes: 
---

# Artifacts produced — ABC-011 cut, and EPIC-004 brought into line with the ratified NFR-005

Subtask `ba-pm-adr-leftovers` of task `architecture-audit-2026-07-29`. Two items that three prior
runs each flagged and each correctly declined to touch because they are BA/PM's files: the
en-passant hashing defect had no ticket, and `EPIC-004` still stated a retired NFR target. A human
asked for both. This note **points at artifacts**; the judgment that produced them lives inside
them.

## Provenance and admissibility (read first)

**This repo has no `scripts/context-io.ts`** — there is no `scripts/` directory at all — **no
`scripts/claim.js`**, and **no `.claude/hooks/` admission guard**. All three re-verified absent this
session. So this note was **hand-written directly against the SCTX-01 schema** in
`agent-factory/contracts/context-note.md` and against the shape of the twelve existing notes in
this folder. **No validator ran, no admission check ran, no atomic claim was taken**, and
`index.md` / `index.jsonl` were not regenerated — the task folder still contains `notes/` and
nothing else. I claim no enforcement I do not have.

`verified_by:` is deliberately **empty** and **no `finding` is admitted**. There is no live §14-gate
verdict under this task, so a `finding` would be inadmissible under SCTX-01 — including for the
reproduction I re-ran myself, which is recorded as a measurement inside an `artifact-ref` note. I
did not self-stamp. This is the posture all twelve prior notes took; with this one the folder holds
thirteen notes — **six `observation`, five `decision`, two `artifact-ref`, and not one `finding`**.

**Why `artifact-ref` and not `decision`** — stated because it is a real choice. The sizing and
priority call is mine and it constrains later work, which argues for `decision`; but it is recorded
*in the ticket*, and this note's job is to point at the files. `artifact-ref` also matches my own
precedent for this exact kind of work in this folder
(`20260729T151049Z-ba-pm-artifact-ref-328eba81`, the ABC-009/ABC-010 cut). Continuity won. The
role's own output contract permits `decision` / `observation` / `artifact-ref` for size and priority,
so nothing is hidden by the choice.

I read all twelve prior notes in this folder from disk before acting, plus `ADR-0002` (now
`accepted`), `ADR-0003`, `ADR-0001`, `plans/nfr-catalog.md`, `plans/board.md`,
`plans/traceability.md`, `plans/epics/EPIC-001` and `EPIC-004`, `plans/tickets/ABC-009` and
`ABC-010`, `AGENTS.md`, `.grugops/factory.config.json`, the BA/PM role, Workflow 16, the SCTX-01
contract, the Definition of Ready, and `src/zobrist.ts`, `src/zobrist.test.ts`, `src/gameend.ts`,
`src/gameend.test.ts`, `src/perft.ts`. **Nothing was relayed to me as fact by an agent — every FEN,
key, number and file:line I wrote came out of a file I read myself or a probe I ran myself.**

## Artifacts written

| Artifact | Path |
|---|---|
| Ticket ABC-011 (new) | `plans/tickets/ABC-011-zobrist-en-passant-hashing.md` |
| Board row, **Backlog only** | `plans/board.md` |
| Traceability row | `plans/traceability.md` |
| EPIC-004 — NFR-005 trigger, RISK-002 mitigation, dated provenance | `plans/epics/EPIC-004-engine-and-ai-opponent.md` |

Left **uncommitted in the working tree** by instruction — the Orchestrator commits this branch
once. Branch `grugops/architecture-audit-2026-07-29`, unchanged.

---

## (1) ABC-011 — the en-passant hashing defect ticket

| Id | Title | Size | Priority | Epic | Column |
|---|---|---|---|---|---|
| ABC-011 | Zobrist key hashes en passant when no capture is available | `S` (2) | `P2` | EPIC-001 | Backlog |

Front matter matches the board↔ticket contract and the shape of `ABC-009`/`ABC-010`
(`status: backlog` / `column: Backlog` / `size` / `priority` / `epic` / `feature`), and the section
order is theirs: Problem (user/pain/value) · Source · Reproduction · Scope · Out of scope ·
Acceptance (G/W/T) · Dependencies (+ an open design question, as `ABC-010` does) · Security/NFR
triggers · Test notes · Size and priority rationale · Definition of Ready.

### The reproduction: I ran it, I did not transcribe it

`ADR-0002`'s out-of-scope section is the source and its two FENs and two keys are quoted verbatim.
**I re-ran the repro myself** from the session scratchpad, read-only, importing merged `src/` by
absolute path (repo untouched, probes are not repo artifacts). Both keys reproduced byte-exact:

```
rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1  ->   4366836039462477420
rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq -  0 1  ->  18311490354223382796
legal ep captures available: 0   keys differ: YES   FIDE-identical: YES
```

Three facts the run adds that the ADR does not carry, each of which changed the ticket:

- **Pseudo-legal ep captures are also 0** in that position, so the cheap board-only availability
  test and the strict legality test agree on the ADR's case. They do **not** always agree — I found
  a position where they diverge: `7k/8/8/K1Pp3r/8/8/8/8 w - d6 0 1` has **1 pseudo-legal ep capture
  (c5d6) and 0 legal ones** (`cxd6` clears c5 and d5 and exposes the a5 king to the h5 rook). That
  divergence is why the ticket carries an **open design question** for the design hop rather than a
  prescribed mechanism: the strict reading needs attack detection, which would give `src/zobrist.ts`
  — today a level-1 leaf importing only `src/position.ts` — an edge to `moves`/`legal`, inside a
  function `EPIC-004`'s transposition table calls per node. Named, not answered.
- **The existing repo test does not have to change.** `src/zobrist.test.ts:33-37` ("depends on
  en-passant availability") uses `4k3/8/8/3pP3/8/8/8/4K3 w - d6 0 1`, which has **1 legal ep capture
  (e5d6)** — the real-capture case — so it still asserts a true inequality after the fix. "No
  existing test is modified" is therefore an acceptance criterion rather than a hope.
- **The existing threefold test cannot catch this defect**, and the ticket says so in as many words.
  `src/gameend.test.ts:27-58` repeats the start position with a knight cycle
  (`g1f3 g8f6 f3g1 f6g8`, twice), so `epSquare` is never set on any position it hashes. That is how
  the defect shipped under 100% coverage — the same lesson `ABC-009` carries.

The ADR describes its control case in prose but names no FEN, so I **constructed and ran one** and
labelled it as mine in the ticket: `rnbqkbnr/ppp1pppp/8/8/3pP3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1`
(1 legal ep capture, `d4e3`) → `8587513887981778220`, versus `13090168791698106956` with `-`. It is
the regression guard: the fix must not collapse positions that genuinely differ.

### Size and priority — my call, recorded, and it agrees with the ADR

`S` / `P2`, reached independently and matching `ADR-0002`'s recommendation of `EPIC-001`, `S`,
"no higher than `P2`". I checked both of its grounds against files rather than accepting them:

- **Latent, and further from live than either Backlog ticket.** No consumer of the key list exists:
  `gameStatus`'s `positionCounts` is optional with **no supplier anywhere in `src/`**
  (`src/gameend.ts:87-90`), and `ADR-0002` clause 4 assigns that supplier to a module that does not
  exist. Observability needs `EPIC-002` **and** `EPIC-006` — two unbuilt epics, against the one
  `ABC-010` waits on.
- **The error direction is the safe one** — a legitimate draw is missed, never a false draw
  declared. I recorded the same asymmetry for `EPIC-004`'s transposition table (a key that
  over-distinguishes costs a wasted probe, not a wrong entry) and marked it as reasoning about an
  unbuilt search, not a measurement.

**On the one thing ratification changed, answered plainly because the subtask asked.** `ADR-0002`
clause 2 is `accepted`, so the derived key list is the substrate for every repetition verdict and
four epics inherit the inaccuracy. That is a real escalation in **blast radius** — and blast radius
is not severity and not reachability, neither of which moved. Every inheritor is still unbuilt,
which means the window is wide open rather than closing. **So it does not argue for `P1`. It argues
for a sequencing constraint**, and that is where I put it: the ticket's escalation trigger raises it
to `P1` the moment any consumer is planned or built — (a) `ADR-0002` clause 2's history module
decomposed or implemented under `EPIC-002`, (b) a supplier wired for `positionCounts` (clause 4), or
(c) `EPIC-004` building its per-ply key array (clause 3) or its transposition table — and requires
it `Ready` before whichever lands first. The cost of leaving it is not a wrong answer in production;
it is a wrong definition of "same position" baked into the tests of four consumers built on top of
it. Same shape as `ABC-009`'s trigger, different hinge.

Not `XL`, so no split. One **re-sizing condition** named now instead of improvised later: if the
design hop takes the strict-FIDE reading, re-size at that hop — at most `M`, never split, because it
is one condition in one function either way.

### Dependency relationship to ABC-009 and ABC-010 — independent, with one asymmetry that is theirs inverted

Independent of both, and any of the three may ship first: different module (`src/zobrist.ts`),
different failure (a hash value, not a mutated position or an accepted invalid FEN). The asymmetry
worth recording: `ABC-009` and `ABC-010` both need a semantically **invalid** FEN to fire, and
`ABC-010` removes `ABC-009`'s only reachable trigger — which is exactly why `ABC-009` sits a rung
lower than `ABC-010`. **Nothing removes ABC-011's trigger.** It fires on a perfectly legal position
one ply out of the start position. That is why its escalation trigger is about consumers appearing
rather than about another ticket slipping, and why it does not escalate on anything that happens to
the other two.

### NFR trigger — NFR-005, not NFR-001, and I say why in the ticket

`ABC-009` binds on `NFR-001` because its fix lands in the search hot path. This one does not:
`src/perft.ts` imports `apply`, `legal`, `moves`, `position` and **never calls `zobristKey`**; the
hashing module's only production consumer is `src/gameend.ts`. So `npm run perft` and the deep perft
lane are **not** the oracle here and the ticket states that, so nobody spends 38 s believing it
proves something. The real bar is `NFR-005` as ratified — the key is on `EPIC-004`'s per-node
transposition-table path (`ADR-0002` clause 3) and per-node cost buys depth — expressed as
`zobristKey` staying within **1.5x** of the audit's measured 288-306 ns at kiwipete on the same
machine class, with the no-ep path (the overwhelming majority of nodes) not slower at all.

## (2) EPIC-004 — the retired target replaced, the spike re-pointed

Three edits, all in `plans/epics/EPIC-004-engine-and-ai-opponent.md`:

- **`NFR triggers` / `NFR-005`** restated to the ratified row, **transcribed from
  `plans/nfr-catalog.md` as it reads today** rather than paraphrased, because a decomposition will
  be planned against whatever it says: depth-in-budget on the named positions **`kiwipete` and
  `position-6`**; **≥ depth 6 within the 3 s budget and never past the 5 s ceiling — below depth 6 =
  FAIL**; **depth 7 within that same 3 s budget — below depth 7 = WARN**; the **depth-7 level
  PROVISIONAL** pending non-M3 measurement while the **depth-6 floor is not**; node rate demoted to
  a **diagnostic** that must always carry its node definition, position and machine. Target hardware
  is `UNKNOWN - verify`; the M3 figures (kiwipete depth 7 in 0.39-0.68 s, position-6 in 0.644 s) are
  quoted with their model caveat (EBF 6, leaves evaluated not generated → a lower bound). `NFR-004`
  was not touched.
- **`RISK-002`'s mitigation** re-pointed: the spike measures **depth-in-budget on non-M3 target
  hardware** on the two named positions against the FAIL floor and the WARN level, because the
  ratified row names that spike as the verification that **lifts the PROVISIONAL marker**. Its
  **timeboxed, before-the-full-build shape is preserved verbatim in structure**, and the bullet
  records that RISK-002's own ABC-008 answer — **GO WITH CONSTRAINT**, time-based iterative
  deepening, never fixed depth — is unchanged and non-negotiable.
- **Provenance**, the way this repo does it elsewhere: a dated blockquote under the title quoting
  the **old target verbatim** as history with why it was retired, plus an `_Updated:` line. **The
  `_Updated:` line was ADDED, not updated** — no file in `plans/epics/` carried one, so it follows
  the `plans/board.md` / `plans/nfr-catalog.md` style and says so in itself. The dated blockquote
  follows `EPIC-001`'s own convention (its `Size corrected L → XL on 2026-07-22` block).

### What else in EPIC-004 I checked, and found clean

Read every section against the retired rate. **Nothing else depends on it:**

- **Acceptance (epic level)** — all five criteria are strength/budget shaped (90% score over 100
  games, a legal move within the time budget, mate-in-2 found, no one-move blunder, reproducible
  under a fixed seed). No node rate, no depth. Clean, and already the shape the ratified target
  moved toward.
- **Scope** — the `Time control` bullet already states time-based iterative deepening returning the
  best move so far, which *is* RISK-002's GO WITH CONSTRAINT. No rate anywhere in the five bullets.
  Clean.
- **User value** (1400-1700 club level), **Out of scope**, **Dependencies** (`EPIC-001`),
  **`RISK-003`** (self-play ladder + puzzle suite — the catalog's "only real verdict on strength"),
  and **Test notes** (puzzle suite as the strength regression gate, Elo `UNKNOWN - verify`). All
  clean, none touched. There is no separate "success measures" section in this epic; acceptance and
  test notes are its equivalents and both are clean.

**One hazard found that is NOT a retired-rate dependency, so it was flagged rather than edited.**
The closing line of `NFR triggers` still reads *"Architect seeds both rows in
`plans/nfr-catalog.md` at design time."* Both rows now exist and `NFR-005` is **ratified**, so
executing that literally at design time would overwrite a human's ratified decision. I left the
sentence as written (it does not depend on the retired rate, and adjacent prose is not mine to
improve) and named the hazard inside the dated provenance block: at design time that step is a
**read, not a re-seed**. If a human prefers the sentence itself corrected, that is a one-line edit
and I am naming it rather than making it silently.

## Board and traceability

- **`plans/board.md`** — one row appended under `## Backlog (WIP unlimited)`, after `ABC-009`, in
  the existing row format, plus a provenance comment matching the `ABC-009`/`ABC-010` precedent.
  Backlog is **WIP-unlimited, so no limit is at issue**. **No ticket was moved and no column other
  than Backlog was touched** — `ABC-009` and `ABC-010` sit exactly where they were, and creating a
  ticket in Backlog is not a column transition. `_Updated:` now reads 2026-07-30 / BA/PM with the
  2026-07-29 provenance preserved.
- **`plans/traceability.md`** — one row appended in the file's fixed **10-column** shape (verified:
  10 cells), placed after `ABC-010` and before the `ADR-0002` decision row, keeping the ticket rows
  in id order and the concrete-id rows grouped ahead of the `pending` epic rows — the placement
  convention this file already uses. It **traces backwards** like `ABC-009`/`ABC-010`: the code it
  names (`src/zobrist.ts:71`, merged under `ABC-007`, `Done`) exists, and Code/Tests read "not
  started" because the fix has not been written. UAT and Release are empty — Backlog, nothing gated.
  **No evidence was invented.** A provenance paragraph was appended to the file's existing trailing
  HTML comment. `_Updated:` already read `2026-07-30` and my change is the same day, so it is left
  as-is in the file's own minimal style rather than churned.

## Not done, deliberately

- **ABC-011 was NOT promoted to `Ready`.** The ticket records the Definition of Ready as met in its
  own footer; the promotion is a separate BA/PM gate step and is not in this subtask — exactly as
  recorded for `ABC-009` and `ABC-010`.
- **No `src/**` change** (`git diff --stat -- src/` empty). The fix is a later `ticket-to-pr` run by
  a Software Engineer. The ticket deliberately does not prescribe the mechanism.
- **No `plans/nfr-catalog.md`** — ratified 2026-07-30, read and quoted, byte-unchanged. **No
  `memory-bank/**`** — all three ADRs are final; `ADR-0002`'s recommendation was executed, not
  re-worded. **No `plans/tickets/ABC-001..010`.** No other epic file. `agent-factory/**` read-only
  KIT.
- **No `git add`, no `git commit`** — everything is in the working tree for the Orchestrator's
  single commit. No branch change, no merge, no deploy.
- The design question inside `ABC-011` (board-only vs strict-FIDE "available") is **flagged and
  assigned to the design hop, not answered** — it is a structural call about a dependency edge and a
  per-node cost, which is Architect/Design's, not BA/PM's and not dev's.

## Verification of this change set

Planning documents only. `git diff --stat -- src/` is **empty**. After the edits: `npm test` →
**143 passed / 143, 7 files**; `npm run typecheck` (`tsc --noEmit`) → **exit 0, clean**. Both
unchanged and green, as a planning-only change must leave them. The reproduction probes ran
read-only **outside** the repo against merged `src/` and are not repo artifacts.

## Risks

- **The `S`/`P2` call is a judgment, not a measurement.** It agrees with an `accepted` ADR's
  recommendation, and the two grounds under it were checked against files — but "how bad is a missed
  draw in an unbuilt game" is not gate-adjudicable. The escalation trigger is the mitigation: it
  names the events that change the answer so the ordering is not left to later judgment.
- **The open design question could move the size.** If the strict-FIDE reading is chosen, the ticket
  gains a dependency edge and a per-node cost question; the re-sizing condition is stated in the
  ticket, but a design hop that skips it would find `S` optimistic.
- **My reproduction is one machine, one Node version** (darwin/arm64, Node v24.12.0). The keys are
  deterministic by construction (fixed seed) so they are machine-independent; the *timing* bar in the
  ticket's NFR section inherits the audit's M3 baseline and is `UNKNOWN - verify` elsewhere, and the
  ticket says so.
- **The EPIC-004 restatement is a transcription of a ratified decision, and its accuracy is
  load-bearing for a decomposition that has not happened yet.** Every clause came from the
  `NFR-005` row I read this session; if that row is ever corrected, this epic's trigger must be
  corrected with it. That is the standing cost of stating a target in two files, and it is the same
  cost `ADR-0002` took on by transcribing `ADR-0003`'s figures.
- **A reader could mistake ABC-011's `P2` for "not important".** It is the third defect found in
  merged, `Done`, 100%-covered code by one audit, and the second whose invisibility to the existing
  suite is itself part of the ticket. The priority prices *reachability*, not importance.
- **This note passed no validator** (see provenance). Nothing was regenerated; `index.md` /
  `index.jsonl` still do not exist for this task.
