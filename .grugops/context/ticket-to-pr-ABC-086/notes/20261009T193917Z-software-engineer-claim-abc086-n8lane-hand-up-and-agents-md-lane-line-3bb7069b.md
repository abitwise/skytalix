---
id: 20261009T193917Z-software-engineer-claim-abc086-n8lane-hand-up-and-agents-md-lane-line-3bb7069b
kind: claim
by: software-engineer
at: 2026-10-09T19:39:17Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-086
  - N8-LANE
  - NFR-008
  - ADR-0027
  - AGENTS.md
  - plans/nfr-catalog.md
supersedes: 
---

# `ABC-086` hand-up: `N8-LANE` over the bar (stop condition), and an `AGENTS.md` lane line owed

Hand-authored, no seal. This is a claim: it asks for decisions this role does not own. The
measurement behind it is observation `…542d743a`.

## 1. `N8-LANE`: +1 070 ms net against 650 ms — STOP CONDITION HIT, nothing trimmed

The brief says: *"`N8-LANE` over its line: measure and report, do not trim tests."* Measured,
reported, and nothing trimmed or moved. The ticket's own fallback ("`A6` moves to the deep lane")
was **not** applied. The brief forbids it, and on its own it does not reach the bar either: `A1`'s
slice alone is about 0.7–0.9 s.

The options, for whoever owns the ruling:

- **(a) Accept the breach** as an owned risk. That is the owner's word, as with `ABC-025`'s `N5`.
- **(b) Re-cut the default slice (BA/PM).**
  - Measured: 30 × 2 at budget 1 is 256–258 ms in vitest, but it is depth 1 everywhere.
  - Not measured: a smaller position count at budget 2, for example 10 × 2 at roughly a third of
    the cost.
  - With `A6` also moved to the deep lane, either would plausibly land under 650 ms. That is
    `UNKNOWN - verify` until measured.
- **(c) Move `A6` and the `A1` slice wholly to the deep lane.** The default lane would keep `A5`,
  `A7` and `A4`, which cost ≤ 3 ms.

The root cause is worth recording in its own right: **the engine runs about 3–4× slower inside
vitest than in plain `node`** (the same 30 × 2 slice reads about 190 ms in plain `node` and
713–903 ms in vitest). That is why a plain-`node` estimate at cut time (`rescore-abc086`)
under-predicted the lane charge. Any future cut that sizes a lane row with a plain-`node` probe
inherits the same error.

## 2. `AGENTS.md` `### Test` — the `ENGINE_DEEP` lane line needs a new entry (Scribe)

The current line, `exit 0, 23 passed (17 default), 98.7 s`, was already stale at the base (33 / 24).
At this branch the reading is:

> `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` — exit 0, 45 passed (33 default), 269.0 s
> (RUN 2026-10-09, M3, loaded host, load1 9–14). ABC-086 `A1` 300/300 is 106.5 s of it, and `A2`
> (10 × 3 s wall clock) is 30.1 s. Run after any src/engine.ts or src/virtual-clock.ts change.

The `npm test` comment (47 files / 1446) is also stale: 48 / 1494 here, and 48 / 1485 at the base.
The wording is the Scribe's. `AGENTS.md` is outside this subtask's fence.

## 3. Not verified here

- `A1`'s 300/300 holds at this tree. Whether it holds on the merged tree after `ABC-082` (the
  evaluation, built and unmerged) lands is `UNKNOWN - verify` until the merge. The brief names
  "`A1` not 300/300 on the merged tree" as a stop. The depth-floor row (≥ 15/30, 27/30 at the
  base) is there so that an evaluation change that moves the depths shows up as red rather than
  hiding.
- The `N8-LANE` figures are true of this machine under load and of nothing else.
