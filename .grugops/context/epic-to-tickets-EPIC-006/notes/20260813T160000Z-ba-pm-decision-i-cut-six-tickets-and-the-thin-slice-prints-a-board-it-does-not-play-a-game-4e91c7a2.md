---
id: 20260813T160000Z-ba-pm-decision-i-cut-six-tickets-and-the-thin-slice-prints-a-board-it-does-not-play-a-game-4e91c7a2
kind: decision
by: ba-pm
at: 2026-08-13T16:00:00Z
verified_by:
confidence: high
refs:
  - EPIC-006
  - EPIC-003
  - EPIC-004
  - ABC-041
  - ABC-042
  - ABC-043
  - ABC-044
  - ABC-045
  - ABC-046
  - ABC-019
  - ABC-037
  - ADR-0007
  - ADR-0009
  - ADR-0011
  - plans/epics/EPIC-006-game-session-and-packaging.md
supersedes:
---

# I decomposed `EPIC-006` into `ABC-041`…`ABC-046` — and the thin slice prints a BOARD, not a GAME

> **Hand-authored, no stamp.** `scripts/context-io.ts` exists in neither this repository nor the kit
> (checked at both roots this hop), `mcp__grugops__propose_note` is not in this session's tools, and
> `context.human_admission` is `off`. **No `§14-gate` verdict record exists under this task, so
> nothing on this hop is a `finding`** and no stamp was invented. There is no derived `index.md` /
> `index.jsonl`: the tool that renders them does not exist and none was hand-faked. `scripts/claim.js`
> does not exist either, so the Workflow 17 step 2 claim was a bare `mkdir` (no `-p`) of
> `.grugops/queue/claimed/epic-to-tickets-EPIC-006/` — which **is** the atomic act.
> `confidence: high` refers to the file-level measurements below; every one was run.

## The ruling

**`EPIC-006` is decomposed into six tickets, `ABC-041`…`ABC-046`, 13 points, all into `Backlog`.**
Three of them are the three the epic's page named in prose on 2026-08-12; two more
(`ABC-045`, `ABC-046`) came out of the session-commands scope line; the sixth is the split of the
entry point from the render seam. **`ABC-047`–`ABC-049` are unspent** — my range was nine and cutting
six is the answer, not a shortfall.

| ticket | size | pri | DoR | one line |
|---|---|---|---|---|
| `ABC-041` render-seam closure | `S` | `P0` | **10/10 MET** | the only ticket in this epic with nothing open |
| `ABC-042` entry point, argv, first frame | `M` | `P0` | 8/10 | **the thin slice** |
| `ABC-043` the live session + `[D31]` handler | `M` | `P0` | 7/10 | blocked on `ABC-037` **and** on an engine that does not exist |
| `ABC-044` result screen | `S` | `P1` | 8/10 | the count is settled at **eight** |
| `ABC-045` `resign` | `XS` | `P1` | 8/10 | ordering only |
| `ABC-046` `quit` + `new` | `S` | `P2` | 7/10 | blocked by a **ruling**, not an ordering |

## The thin slice is `ABC-042`, and I am going to be exact about what it delivers

**`ABC-042` is the single ticket after which `npm run <name>` puts a chess board on a human's screen
and exits 0.** That is what the owner is waiting for, it is buildable behind one ticket (`ABC-041`),
and it converts three things this factory cannot currently see: `AGENTS.md`'s
`Dev / run: UNKNOWN - verify` gets a real command, 25 `Done` tickets' deferred UAT gets a destination,
and `Escaped defects` gets a detector.

**It cannot make a move playable, and compressing that into "it runs" would be the dishonest version
of this hop's headline.** The loop needs two seams that do not exist in production:

- the `InputSeam` is `ABC-037` — cut, `P0`, `EPIC-003`'s, with two open dependencies of its own;
- the `EngineSeam` has **no implementation anywhere**, and `EPIC-004` is undecomposed with its first
  ticket owed to `RISK-002`'s spike.

**So the shortest path to a playable game is `ABC-041` → `ABC-042` → (`ABC-033`, `ABC-035`,
`ABC-037`) → `ABC-043`, and three of those six are in another epic.**

## Why I did not take the Factory Coach's shape whole, and where I disagree with it

The Coach ruled: *"carve a thin 'it runs' slice out of `EPIC-006` and pull it next — an `S`, not an
epic … a single entry point that boots the existing turn loop against the existing renderer with the
input seam wired to stdin, **even if the opponent is a stub that plays the first legal move**."*

**I adopted the shape and rejected two of its details, both with reasons.**

1. **The size is `M`, not `S`.** The Coach's `S` was a scale judgement against *"promote the whole
   epic"* and it holds in spirit. Measured against this board's own calibration — `ABC-013` `M`,
   `ABC-018` `M`, `ABC-037` `M` — an entry point with a complete argv surface, three rejection paths,
   a `random` resolution, a glyph session, a writer, the repository's first child-process test and its
   first `process.argv` read is an `M`. **Shaving a size to match a recommendation is how a ticket
   arrives mid-build with unestimated work in it.**
2. **"even if the opponent is a stub" is not mine to grant, and it collides with a ratified ADR.**
   `ADR-0009` clause 9c and `src/turn-loop.ts:45-47` say a `src/` stub module is *"production code that
   is dead the day the real parser and engine land"*, which is exactly why both merged stubs live in
   `turn-loop.test.ts`. Whether a one-line default opponent **inside a non-exporting entry point** —
   which no module can import and which dies in one line the day `EPIC-004` lands — is the same thing
   clause 9c forbids is a **conformance question owned by Architect/Design**. **It is recorded as
   `ABC-043`'s named blocker with both consequences spelled out, and I did not rule it.** An accepted
   ADR outranks a `confidence: medium` coaching note, and the honest move is to route the conflict,
   not to resolve it in whichever direction unblocks me.

**One shape I considered and rejected on my own authority: a hot-seat two-human mode.** It would make
the game playable today with no engine. It loses on three counts: no epic asks for it (coding rule 5);
the merged loop has no shape for it — an adapter from `InputSeam` to `EngineSeam` must swallow six of
seven `PromptOutcome` arms and turn EOF into a throw, which the loop reports as `engine-threw`,
i.e. **end-of-input presented as an engine fault**, the inverse of `ABC-019` `A10`'s forbidden move;
and it is a product decision nobody asked me to make. **Recorded so the next hop does not re-derive
it.**

## The two tickets I split apart, and why the split is the useful part

- **`ABC-041` vs `ABC-042`.** The render seam is a pure function of injected values with **zero** open
  dependencies; the entry point is I/O, argv and ambient signals. Split, the first is buildable today
  and moves `render.ts`, `status-panel.ts` and `history-pane.ts` from a measured **0** production
  importers to ≥ 1 — the measurement this epic was raised on — without waiting for anything.
- **`ABC-045` (`resign`) vs `ABC-046` (`quit` + `new`).** `resign` is the only one of the three session
  commands whose effect the merged `PromptOutcome` has an arm for. Keeping the three together would
  have held a clean `XS` behind an open contract question. See the observation note on what the merged
  loop cannot express.

## Size correction, with the arithmetic shown

**`EPIC-006` `M` → `L`.** The indicative `M` (3 points) is wrong by ~4x: six tickets at **13 points**
(`S`+`M`+`M`+`S`+`XS`+`S`), and that is only the runnable half — packaging, difficulty and `undo` are
uncut. `EPIC-003` recorded the same correction (`M` → `XL`, 22 points) on 2026-08-12 and `EPIC-002`
before it (23 points). **It will likely reach `XL` once distribution is decided; I did not size
unwritten tickets.** **The no-`XL`-into-dev rule binds TICKETS: the largest here is `M`, so there is
no `SPLIT_REQUIRED`.**
