---
id: 20260812T090000Z-orchestrator-decision-8e47c1b9
kind: decision
by: orchestrator
at: 2026-08-12T09:00:00Z
verified_by:
confidence: high
refs:
  - ABC-017
  - ABC-019
  - ABC-027
supersedes:
---

# `ABC-017` → `In Review` for its first QE pass; and the standing correction worked

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repo or the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Nothing here is a `finding`.**
> Written BEFORE the subtask that references it.

## The standing correction worked, and that is worth recording as much as the failures were

I have had four consecutive briefs with a wrong figure or locator. The correction I adopted was:
**attribute, or mark unverified, and never assert.**

This brief said: *"BA/PM measured the rebuild at 8.2 ms… **Confirm that yourself.**"*

The Engineer did, and **the attribution was to a warm-state measurement.** Cold cost is
**57.99 / 60.27 / 63.39 / 68.45 / 65.67 ms**; the 2nd call ~24 ms; the 3rd ~11 ms; the asymptote
~8.5 ms — which is where 8.2 came from. The change adds the 2nd and 3rd calls: **~35 ms CPU, ≈6% of
the 650 ms content allowance.**

**`N8-LANE` does not move — the conclusion is intact, the figure it rested on was not.** That is the
first time this round a wrong number in my brief was caught *because I marked it for checking rather
than despite my asserting it.* The correction is doing its job.

## Verified

Production files **untouched** (`git diff` over `src/` empty), **no test file added** so the
`N8-LANE` file count is unchanged, and after rebasing onto `main`: **734/734 on 26 files**, skip 0,
lint/typecheck 0. `HISTORY_COLS` still 21.

The two survivors are closed and re-measured by the Engineer rather than inherited: **`WPOS` passed
732/732 with zero catchers against the delivered suite and now fails on exactly one test naming the
position**; `W9ONCE` likewise. **`A13`'s edit-2 confirmation reproduced to the number** — both edits
give 4 failures led by `expect(HEIGHT).toBe(23)`, import alone gives **15** led by an assertion
naming the wrong subsystem. **`A13` moves from met-in-part to MET IN FULL.**

## It caught its own design error, and kept something it was told to consider deleting

Its first cut added a **third** rebuild at module scope for no benefit; it measured that and reverted
it. Separately it found the paired whole-lane form **unusable at this signal size** — its identity
null control's own median was +80 ms against a ~9.5 s lane. Both published.

And it **kept `A6`'s `not.toContain(1)` although `## Test notes` listed it for removal**, with a
measured reason: it is implied only on the **third** anchor, so it is live on the other two, and
deleting it loses coverage while narrowing it makes the test stop matching the criterion's *"in none
of the three"*. **Declining a suggestion with a measurement is the behaviour this round has rewarded
repeatedly** — QE did it to the Engineer, BA/PM did it to QE, and now the Engineer has done it to
BA/PM's own note.

Its `A9`-into-two-`it`s split is **flagged as its own judgment, not the ticket's** — two lines to
revert — because the masking it fixes was measured but deliberately left out of the criteria.

## Board — and a self-correction

`ABC-017`: `In Development` → `In Review`, for **its first QE pass**. It has never had one: it went
dev → BA/PM → dev.

**`ABC-027` also moves, and this is me fixing my own inconsistency:** I moved it to `In Review` last
hop and then dispatched Security/NFR on it. The gate runs on `In Security/NFR`, so the board said one
thing while the work did another. **`ABC-027`: `In Review` → `In Security/NFR`**, which is where its
live re-gate belongs.

Result: In Development **0/3**, In Review **2/3** (`ABC-017`, `ABC-019`), In Security/NFR **1/2**
(`ABC-027`).

## Scheduling

Width 2 of 3: Security/NFR re-gating `ABC-027`, QE on `ABC-017`. **The third slot stays held** for
the same reason as last hop — the queued items are either inside a file a live agent holds, or
waiting on `ABC-027`'s gate to know their shape. The Engineer added one more datum for whoever
eventually homes the `HISTORY_COLS` invariant: **`A2`'s width clauses are a self-comparison against
the pane's own export**, the same shape as `A11`'s `<= 2 × HISTORY_ROWS` already sitting in
`## Test notes`. That strengthens the case that it is an Architect question, and it still waits.
