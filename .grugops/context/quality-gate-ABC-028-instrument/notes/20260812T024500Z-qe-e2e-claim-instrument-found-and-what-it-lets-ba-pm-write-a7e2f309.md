---
id: 20260812T024500Z-qe-e2e-claim-instrument-found-and-what-it-lets-ba-pm-write-a7e2f309
kind: claim
by: qe-e2e
at: 2026-08-12T02:45:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-029
  - ABC-019
  - ABC-017
  - RISK-ABC017-01
  - RISK-ABC017-03
  - NFR-008
  - ADR-0008
supersedes:
---

# RESULT: an instrument exists, it is armed, and it clears the bar — with one measured limit that `A4`'s wording must respect

> **Hand-authored `claim`, deliberately NOT a `finding`.** `human_admission` is `off`, no §14 gate ran
> on this hop, and there is no sanctioned writer in this repo. The measurements this rests on are in
> the three sibling `observation` notes; **confidence `high` refers to the measurements, which are
> reproducible from `artifacts/`, not to any admission status.**

## The answer to the question this hop was given

**FOUND and PROVED**, against the four-part bar the brief set:

1. **Kills the named mutants.** `WFENMID`, `WPOSMID`, `WBOARDMID`, `WMOVESWAP` die at **all ten** of
   `A1`'s lengths; `WSPLICE` **stays dead**. Two builds I added — `WBOARDSET` (TypedArray method) and
   `WBOARDBUF` (`ArrayBuffer` alias) — also die. All were **built and run**, not reasoned about.
2. **Arming control that fires.** Eight per-slot hostiles each report; the null control reports
   nothing; the arming COUNTER is non-zero at every length (5 at 0 plies, 18,677 at 2,000).
3. **Fails zero pre-existing tests.** `laneD` = `748 passed (748)`, `tsc` 0, `biome` clean, 26 files,
   skip 0. On each wrong build, **exactly one** test fails and it is `A4`.
4. **Lane cost stated.** `−21.9 ms` median CPU, sign `3/8`, against a null control of `−71.0 ms` at
   `3/8` — **below `N8-LANE`'s own resolution**; `ADR-0008`'s `≤ 3 s` wall / `≤ 13 s` CPU both hold.
   **The first shape I built cost `+252.7 ms` at `8/8` and was rejected on the measurement.**

## The one limit, and it is not a caveat — it is a boundary the wording has to respect

**`WBOARDBLIND` survives.** It mutates `position.board` through an `ArrayBuffer` alias and reverts it
with no intervening access to the graph, so no sample falls inside the window.

**This is not fixable by a better proxy.** A synchronous call is observable only where it touches
instrumented state; `board.buffer` yields the real buffer and a view built on it passes no trap.
Options considered and rejected, with reasons:

- **Return a copied `ArrayBuffer` from the `buffer` getter** — makes the wrong build *invisible* while
  reporting green. A false negative is worse than a stated limit.
- **Flag any read of `.buffer` during a render** — over-strict; it fires on a legitimate build that
  reads the board, and the criterion would then constrain implementations rather than behaviour.
- **`vi.mock` `makeMove` / `toSan` to add sampling points inside the loop** — adds points, closes
  nothing (any two points have a gap), and moves the criterion into the other file, which
  `## Scope` forbids.

**So `A4` must not be written as an absolute** (*"no reachable slot differs at any point"*), because
no instrument can hold that for a synchronous callee. It CAN be written as the two properties that
were measured, which is strictly more than `A9` has today and covers every slot the ticket names.

## What this lets BA/PM write — the ingredients, not the criterion text

**The criterion text is BA/PM's and I have not written it.** These are the parts that are now
demonstrated and can be stated with a measured discriminator:

- **The instrument:** the pane is handed a recording view of the caller's graph; every write through
  it is recorded at the instant it happens, and the board's bytes are additionally re-checked at every
  access. Two detectors, each closing the other's hole.
- **The `Given`:** `ABC-017` `A1`'s ten lengths, from the **shared** fixtures — `A4` does not need
  `A9`'s freshly-built objects, and using them was measured at ~10 ms of the ~75 ms margin per rebuild.
- **The `Then`:** zero writes recorded, **and** the arming counter non-zero at every length.
- **The arming clause, per slot:** a control writes to `initialFen`, to `position`'s scalars, to a
  `board` element, to `board` through `.buffer`, to the `moves` slot, to the `moves` contents, and to
  a `Move`'s own field — and each must be reported. `A4`'s current text asks for *an* arming control;
  **the measurement says it has to be per slot**, because that is the only version that would have
  caught the pre-fix bug in my own instrument.
- **The discriminating builds, with verdicts:** `WFENMID`, `WPOSMID`, `WBOARDMID`, `WMOVESWAP` RED;
  `WSPLICE` RED (stays dead); the delivered pane GREEN — all at ten lengths, all measured.
- **The honest boundary:** the property is *"every write that reaches the supplied graph through the
  reference the pane is given is reported, and the board's contents are sampled at every access"* —
  not *"nothing can differ"*. `WBOARDBLIND` is the witness and it should be named, the way `A3` names
  which of its four clauses is the discriminator.
- **A stronger `A4` is available at no cost:** the same instrument covers `castling`, `epSquare`,
  `halfmoveClock` and `Move` fields. Stating the property over the whole graph is what
  `## Test notes` 1 asked for — and it is what stops the fifth per-slot repair.

**A worked implementation exists and is explicitly NOT mandated** — the mechanism is the Engineer's.
It is `artifacts/a4-instrument-and-criterion.ts.txt`, the exact text that produced every number here.

## What this does and does not unblock

**Does:** the technical reason item 4 of the Definition of Ready is `❌` — *"its instrument is
undemonstrated"* — no longer holds. The instrument is demonstrated, armed, costed, and its limit is
named.

**Does NOT:** re-score the Definition of Ready — **not mine, and I have not touched it**. `A4` still
has no criterion text, and that is BA/PM's next hop. **`ABC-028` stays in `Backlog` until it does.**

**The `⚠️` (INVEST *independent*) is untouched by this result.** It is about sharing
`src/history-pane.nfr.test.ts` with `ABC-029`; **this instrument lands entirely in
`src/history-pane.test.ts` and does not open that file**, so the sequencing constraint is neither
tightened nor relieved.

## Requested next move — and what is not mine

**Requested: enqueue a BA/PM refinement hop to write `A4` on these ingredients and re-score item 4.**
`ABC-028 Backlog → Ready` follows from that score, not from this note.

**`plans/board.md` was not opened for edit** — it is the Orchestrator's. No ticket file was edited;
`ABC-029` is `Ready` and was not touched. **`RISK-ABC017-01`'s trap at
`src/history-pane.nfr.test.ts:104-112` was READ and NOT EDITED** — md5 `e27a8387d589adf21ba5b5dd2244225e`
is unchanged, and the file count of roles that have declined it is now five. **No file under `src/`
was written in this worktree; `git status` is clean apart from this hop's own queue and context
files.** Nothing merged, nothing pushed, nothing deployed. `../cli-chess-ABC-019` was never entered.

**One instruction-shaped file was encountered and reported rather than acted on**, per the standing
rule: the `:106-112` comment says the fixtures *"may be rebuilt per test freely … measured"*. It
remains false today by `ABC-028`'s own analysis, and nothing in this hop's measurements changes that:
my `laneA` runs confirm `WCACHE`-class builds are `A2`'s subject, not `A4`'s, and I did not test them.
