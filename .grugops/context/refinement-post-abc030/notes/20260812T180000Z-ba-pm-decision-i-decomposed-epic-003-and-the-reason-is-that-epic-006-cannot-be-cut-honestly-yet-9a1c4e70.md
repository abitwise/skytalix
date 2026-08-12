---
id: 20260812T180000Z-ba-pm-decision-i-decomposed-epic-003-and-the-reason-is-that-epic-006-cannot-be-cut-honestly-yet-9a1c4e70
kind: decision
by: ba-pm
at: 2026-08-12T18:00:00Z
verified_by:
confidence: high
refs:
  - EPIC-003
  - EPIC-004
  - EPIC-006
  - ABC-021
  - ABC-031
  - ABC-032
  - ABC-033
  - ABC-034
  - ABC-035
  - ABC-036
  - ABC-037
  - ABC-038
  - ADR-0004
  - ADR-0007
  - ADR-0009
  - plans/epics/EPIC-003-move-input-and-controls.md
  - plans/epics/EPIC-006-game-session-and-packaging.md
supersedes:
---

# I decomposed `EPIC-003` into `ABC-031`…`ABC-038` — and the argument on the other side is real enough that I raised `EPIC-006` to `P1` in the same hop rather than answer it with silence

> **Hand-authored, no stamp.** `scripts/context-io.ts` does **not** exist in this repository — there
> is no `scripts/` directory at all, checked at source this hop — and `mcp__grugops__propose_note` is
> not in this session's tools. `context.human_admission` is `off` and **no `§14-gate` verdict record
> exists under this task**, so **nothing on this hop is a `finding`** and no stamp was invented.
> `confidence: high` refers to the file-level measurements below, every one of which was run.
> There is no derived `index.md` / `index.jsonl`: the tool that renders them does not exist and none
> was hand-faked. **`scripts/claim.js` does not exist either**, so the Workflow 17 step 2 claim was
> made by hand — a bare `mkdir` (no `-p`) of `.grugops/queue/claimed/` for the missing parent, then a
> bare `mkdir` (no `-p`) of `.grugops/queue/claimed/refinement-post-abc030/`, which **is** the atomic
> act.

## The ruling

**`EPIC-003` (move input and controls, `P0`) is decomposed. Eight tickets, `ABC-031`…`ABC-038`, all
into `Backlog`, 19 points.** `ABC-010` was already under this epic and is not re-cut, so the epic now
stands at nine tickets and 22 points.

## First, a correction to the baseline I was given, because it changes the shape of the question

The Orchestrator's baseline says *"`EPIC-003` (P0, M), `EPIC-004` (P0, L), `EPIC-005` (P1, S),
`EPIC-006` (P2, M) are undecomposed — **zero tickets exist under any of them**."* **That is false for
`EPIC-003`.** `plans/tickets/ABC-010-fen-semantic-validation.md` has carried `epic: EPIC-003` in its
front matter since 2026-07-29, the board row says `epic: EPIC-003`, and the trace row agrees. So this
epic was never undecomposed — **it was one ticket in and eight short.** Everything else in the
baseline checked out (`main` at `43d5a9d`, tree clean, 17 production modules, 28 test files, `Ready`
0/8, `Blocked` empty, five standing `Backlog` tickets, `plans/features/` empty).

## Why `EPIC-003` and not the other two candidates

**Three reasons, in the order they bind.**

1. **It is the only candidate whose tickets can all be cut without inventing an answer somebody else
   owns.** Every dependency is merged and published: `ADR-0004` is `accepted` and clause 2 **as
   amended** specifies `parseSan`'s exact signature, its three closed outcomes and its move-identity
   rule (2b); `src/san.ts` ships `toSan`; `legalMoves` ships; and `ABC-019` published
   `InputSeam = (history: GameHistory) => Promise<PromptOutcome>` in merged code
   (`src/turn-loop.ts:127`) with the comment *"`EPIC-003` replaces it"*. The tickets write themselves
   against contracts that already exist, which is why two of the eight came out DoR-complete at the
   cut.
2. **`EPIC-006` cannot be cut honestly today**, and the blocker is a decision that epic is explicitly
   reserved to make. `AGENTS.md` § Deployment posture and `ADR-0007`: *"How the CLI will eventually be
   distributed — npm, a binary, a `git clone` — is undecided, and `EPIC-006` decides it. **Do not fill
   that in.**"* Its difficulty and `undo`-of-the-engine-reply criteria additionally need `EPIC-004`,
   which is undecomposed. Cutting those tickets now produces tickets that fail the DoR on *dependencies
   known* and *no major unresolved blocker* — smoothing, which this board refuses (`ABC-024`,
   `ABC-026`, `ABC-028` and `ABC-030` were each left honestly unmet instead).
3. **The two owed paragraphs are addressed to `EPIC-003`'s `parseSan` ticket by name.** Decomposing
   anything else leaves them owed a fourth time. This was the cheapest hop at which they stop being
   owed, and they are now on `ABC-032`.

**`ABC-021` was the third candidate and it is not a decomposition at all** — it is one already-cut
ticket, and the argument for it ("one ticket closes `EPIC-002`") is an argument about the **pull
order**, not about which epic to decompose. It is answered there: it is my **position 1**.

**`EPIC-004` is `P0`/`L` and was not a candidate**, for a reason worth recording: its first ticket must
be `RISK-002`'s **timeboxed spike**, because `NFR-005`'s depth-7 level is `PROVISIONAL` pending
measurement on non-M3 hardware and that spike is the named verification that lifts the marker. Cutting
the rest of the epic before the spike reports is exactly what `ABC-008` was invented to prevent. Its
decomposition is therefore one ticket long today, which is a spike hop, not a decomposition hop.

## The argument on the other side is real, it is measurable, and I did not answer it with silence

**This project has 17 production modules, 807 tests, and nothing a human can run.** That is not
rhetoric; I measured what it actually consists of, by reading the import graph on `main` at `43d5a9d`:

```
src/status-panel.ts   production importers: 0   (only *.test.ts)
src/history-pane.ts   production importers: 0   (only *.test.ts)
src/render.ts         production importers: 2, BOTH `import type { GlyphMode }`
                      (src/frame.ts:42, src/glyph-mode.ts:42)  -> renderBoard has 0 runtime consumers
src/turn-loop.ts      production importers: 0   (only *.test.ts)
```

**Four of seventeen production modules are reachable only from test files, and they are the entire
user-visible surface of a `P0` `XL` epic that is otherwise nine-ninths delivered.** The wiring that
would reach them is the **render-seam closure**, and `ADR-0009` clause 9b plus `ABC-019` `[D30]` put
that closure in **`EPIC-006`**: *"`EPIC-006` binds the mode into the seam closure exactly as it binds
it into `renderBoard` and `assembleFrame`."*

**So a `P2` epic gates the visible outcome of two `P0` epics.** My ruling on that, taken in this hop
rather than deferred:

- **`EPIC-006` is raised `P2` → `P1`**, in `plans/epics/EPIC-006-game-session-and-packaging.md`, with
  the import-graph evidence on the page. **The tier argument is this board's own:** `P2` here means
  the drop-first tier — written into `ABC-017`'s row and stated outright in `ABC-021`'s priority
  rationale — and `EPIC-006` is the one epic that cannot be dropped without the product ceasing to
  exist. Not `P0`: nothing is broken and there is no user today.
- **The next decomposition hop should be `EPIC-006`'s thin half**, and I named the three cuttable
  tickets in prose on that epic's page **without allocating IDs** (the render-seam closure; the entry
  point and argv; the result screen, whose reason count is now a *read* against merged `ABC-020`
  rather than a decision). The render-seam closure is, in my judgement, **the single highest-value
  ticket on this board that nobody has cut.**

**What I did NOT claim, said plainly:** `EPIC-002` is honestly complete after `ABC-021`. Its own
`## Test notes` require the frame to be *"producible and assertable as a value, with no TTY attached"*
and that is exactly what shipped. The composition into a live session was always `EPIC-006`'s. Nothing
above re-opens a `Done` ticket and nothing above is a defect.

## Three rulings I had to make to cut the tickets at all, each because the epic's own scope lines needed one

1. **Case-insensitivity in SAN is a RETRY, not a fold, and a multi-match is `ambiguous`.** Three of
   this epic's scope lines cannot all hold for SAN: `bxc4` (pawn capture) and `Bxc4` (bishop capture)
   can **both be legal in the same position**, so a case-folding parser must guess between two legal
   moves — which the epic's own ambiguity line forbids. `ABC-032` stays case-exact; `ABC-033` owns the
   folded retry and routes a multi-match to the `ambiguous` arm that merged code already has.
2. **This epic owns the move PROMPT SURFACE**, not only the grammars — tab-completion is a completer on
   a line reader, so the reader is `ABC-037`. `EPIC-006` *extends* that prompt, which its own
   `## Dependencies` already says.
3. **`quit` and `claim` each appear in two epics' scope and do not conflict:** `EPIC-003` owns the
   **grammar** (token, tolerance, completion target, teaching rejection); the other epic owns the
   **effect** (`EPIC-006` for `quit`'s confirmation and exit, `ABC-021` for `claim`'s terminal
   transition). One rule applied twice rather than two special cases — and it is the rule the
   2026-07-31 `claim` amendment already made.

## One epic acceptance criterion is REDUCED, and it is flagged for a named human

`EPIC-003` criterion #4 promises `moves` lists **every** legal move in SAN. **The merged frame cannot
show that list.** `MESSAGE_ROWS` is 2 (`src/frame.ts:45`); the region is bounded by the panels' width
(widest merged snapshot row ~21 chars) and packs what fits, appending a `+N` marker
(`src/frame.ts:182-188`); the start position has 20 legal moves. **Roughly 9 shown, `+11` hidden.**
The amended promise is **an exact count plus a partial list**, ruled on `ABC-036` with the three
rejected alternatives and the one reversible choice (a pager) named. **It does not block cutting or
development** — the amended criterion is testable either way. Same posture `EPIC-002` `[A1]` took, and
for the same reason.

## Size correction, with the arithmetic shown

`EPIC-003` **`M` → `XL`**. The indicative `M` (3 points) is wrong by ~7x: eight new tickets at
**19 points** (`S`+`M`+`S`+`M`+`S`+`S`+`M`+`S`) plus `ABC-010` (`M`) = **22 points over nine tickets**.
`EPIC-002` recorded the identical correction at 23 points over nine tickets on 2026-07-30. **The
no-`XL`-into-dev rule applies to TICKETS, not epics** — the largest ticket here is `M`, so there is no
`SPLIT_REQUIRED`.
