---
id: 20260811T212400Z-software-engineer-observation-744a6ad5
kind: observation
by: software-engineer
at: 2026-08-11T21:24:00Z
verified_by:
confidence: high
refs:
  - ABC-019
  - ABC-017
  - ABC-027
  - ABC-029
  - ADR-0008
  - ADR-0009
  - ADR-0010
  - NFR-002
  - NFR-008
  - src/turn-loop.test.ts
  - src/status-panel.ts
  - src/history-pane.ts
supersedes:
---

# What I measured on this tip — `A20`, cl. 9f's real-panel run, and the lane

> **Hand-authored.** `scripts/context-io.ts` does not exist in this repository (there is no
> `scripts/` directory at all) and `mcp__grugops__propose_note` is unavailable, so the note kind, id
> and front matter were written by hand and there is no derived `index.md` / `index.jsonl` render for
> this `ref:`. Stated so the absence is not read as a dropped step.
>
> **`kind: observation`, NOT `finding`, and deliberately.** Workflow 16 admits a `finding` only
> against a live GREEN `§14-gate#<id>` verdict or a `human:<name>` grant. **The gate on this tip is
> RED** (2 failed, for `ABC-029`'s reason — section 5) so there is no verdict to stamp against, and
> `context.human_admission` is `off`. Every figure below is a command I ran in
> `../cli-chess-ABC-019` this hop; none is inherited from another role's report except where the word
> *inherited* appears.

## 1. The real geometry, read off the modules rather than restated

`STATUS_ROWS` = **3** (`src/status-panel.ts:71`) and `HISTORY_ROWS` = **8**
(`src/history-pane.ts:70`), both merged on this tip. The real seam
(`renderBoard` 9 + `renderStatusPanel` 3 + `renderHistory` 8 + `MESSAGE_ROWS` 2 + `PROMPT_ROWS` 1)
assembles to **`H` = 23**, which is `[D51]`'s figure reproduced rather than quoted, and 23 ≤ 24 so it
redraws **in place** on a 24-row TTY. The two stub shapes are unchanged and both still run: `A` 2/5 →
19 (in place), `B` 4/9 → 25 (**append**, and still the only run in this tree that takes that branch).

## 2. `A20`'s fixture — the narrowing, and where it comes from

Anchor `7k/8/8/8/8/8/P7/K5R1 w - - 100 60`, script `a2a3 h8h7 g1g7 h7g7`, real panels, sink
`isTTY` with **23** rows (the tightest viewport that still redraws in place).

| frame | `W` | what moved |
|---|---|---|
| 1 | **45** | the halfmove clock is at 100, so the status the LOOP evaluated carries `claimable` and the panel's third row spends 32 columns on `White may claim: fifty-move rule` |
| 2 | **22** | the pawn ply resets the clock — the claim cell goes. **NARROWING, 23 columns** |
| 3 | 23 | — |
| 4 | 27 | `Rg7+`, so the first status row gains `CHECK` |
| 5 | **24** | the king takes the rook — the check goes. **NARROWING, and it is not the first redraw** |

Five redraws, five frames, `H` = 23 throughout. The narrowing is a **panel** row in both cases and
the message region is asserted **empty in all five frames**, so the fixture cannot be narrowing via
`messages` — which `src/frame.ts:176-179` makes impossible anyway (`W` is the max over the panel rows
and the message region is bounded BY it), and which would have made `A20` pass vacuously.

Frame 1 is the widest of the five, so replaying at `W`(frame 1) = 45 is a screen the whole run fits
inside rather than one a later frame wraps on. **That is a fixture precondition and is asserted as
one; it is NOT a width criterion and `[D47]` is not touched** — `W` varies by design here, 45 / 22 /
23 / 27 / 24, which is the opposite of the constant-width claim that prohibition forbids.

## 3. The criterion asserts something — the wrong build, killed OUT OF TREE

`A20` is GREEN at both widths on this tip. To check that this is a property of the merged writer and
not of the assertion, I rebuilt the **pre-`ABC-027`** byte stream out of tree (the same run with the
writer's per-row `\x1b[K` stripped, which is `CURSOR_HOME + frame.join("\n") + ERASE_TO_END_OF_SCREEN`
byte for byte) and replayed it into the same screen model:

- **FOUR of the five redraws go RED**, at `W`(frame 1) = 45 **and** at 80 columns — first divergent
  row 11 on redraws 2-4 and row 9 on redraw 5, i.e. the status panel's stale columns.
- `ADR-0010`'s form `F2` (the **untrimmed** comparison) false-positives on **all five** frames at 80
  columns, which is the measurement that makes the right-trim part of the criterion rather than a
  convenience.

**The wrong build was not bought as a test in the suite**, on `A19` (c)'s recorded precedent: a test
of the pre-`ABC-027` writer asserts a failure of the CRITERION rather than of the loop, and it would
spend `N8-LANE` budget on it. It is recorded here instead, and in the test file's header.

## 4. `N8-LANE`, re-measured under `ADR-0008`'s protocol rather than quoted

Nine interleaved rounds, three arms per round (`base` = `HEAD`'s file, `head` = mine, `null` = a
byte-identical copy of `base`), **arm order rotated every round**, one fresh `npm test` process per
run, warm-up round discarded, CPU = user + sys from `/usr/bin/time -p`. Apple M3 / darwin-arm64 /
Node v24.12.0 / vitest 3.2.7; `UNKNOWN - verify` on any other machine.

| quantity | measured | bar |
|---|---|---|
| median paired CPU delta, mine − base | **+100 ms = +1.00%** | `N8-LANE` **≤ 650 ms** |
| identity null control | **0.30%**, sign 4/9 (at chance) | **≤ 1.5%** — the control PASSES, so the instrument is valid here |
| lane wall, median of 9 | **1.96 s** (1.83-2.09) | `ADR-0008` **≤ 3 s** — 65% |
| lane CPU, median of 9 | **10.01 s** (9.80-10.17) | `ADR-0008` **≤ 13 s** — 77% |
| new test FILES | **0** | the FLOOR account (~160 ms/file) does not move at all |

**The lane is INSIDE `ADR-0008` on both clauses with my additions, and `N8-LANE` is met with ~6.5x
headroom.** Two honest limits: the delta's magnitude is only ~3x the null control's and its sign is
5/9, so this instrument cannot cleanly separate +100 ms from zero — irrelevant at this distance from
650 ms, but it must not be quoted as a precise cost. And **`MET`/`MISS` is Security/NFR's at the
gate**, not mine; `ABC-019` has still never been through a Security/NFR gate.

**The parent hop's single reading is partly corrected by this.** It recorded 2.34 s wall / 9.95 s CPU
and flagged the wall figure as ~78% of its clause against the 52-59% the catalog records for `main`.
The CPU half reproduces (10.01 s, 77%); **the wall half does not — 2.34 s was a high single sample
and the median of nine is 1.96 s = 65%.** That hop said explicitly that its figure was a signal and
not a verdict, and it was right to.

## 5. Gates, after my edits

`npm run lint` **0** · `npm run typecheck` **0** · `npm run build` **0**.

`npx vitest run src/turn-loop.test.ts src/turn-loop.nfr.test.ts` — **52 passed / 52**, 0 failed,
0 skipped (48 + 4).

`npm test` — **RED, and the red is not mine**: **2 failed / 794 passed (796)**, **1 file failed / 27
passed (28)**, **skip count 0**.

- Baseline on this tip before I wrote a byte: **2 failed / 789 passed (791)** on the same 28 files.
- **794 − 789 = 5, which is exactly the five tests I added. The failure count is unchanged at 2 and
  I added no third.**
- Both failures are `ABC-017`'s `A11` in `src/history-pane.nfr.test.ts` — the tests declared at
  `:228` and `:275`, whose assertions fail at **`:247`** (`expected [ 'turn-loop.ts' ] to deeply
  equal []`) and **`:328`** (`history.ts was evaluated in a production closure`). The parent note and
  my brief cite `:228`/`:275`; those are the `it(...)` lines, not the assertion lines. Both anchors
  are recorded here so nobody has to re-derive which is which — **the file's md5 is
  `e27a8387d589adf21ba5b5dd2244225e`, unchanged, and I never opened it for edit.**

## 6. The date defect is a TIMEZONE artifact, and it now resolves cleanly

Two prior hops recorded the machine clock as ~a day behind records dated `2026-08-12`. Measured here:
the clock reads **`2026-08-11T21:24Z` UTC = `2026-08-12 00:24` local (EEST, UTC+03:00)**. The prior
notes stamped **UTC** and compared against records dated in **local** time; the gap is the offset
across local midnight, not a day. **Nobody's dates are ahead by about a day.** I use the true UTC
instant in note ids and `at:` fields and the local date `2026-08-12` in the record files, matching the
board and the ticket, and I edited nothing into agreement.
