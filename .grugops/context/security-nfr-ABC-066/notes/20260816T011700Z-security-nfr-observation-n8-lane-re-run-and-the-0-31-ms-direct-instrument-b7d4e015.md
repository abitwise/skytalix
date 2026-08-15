---
id: 20260816T011700Z-security-nfr-observation-n8-lane-re-run-and-the-0-31-ms-direct-instrument-b7d4e015
kind: observation
by: security-nfr
at: 2026-08-16T01:17:00Z
verified_by: 
confidence: high
refs:
  - ABC-066
  - N8-LANE
  - NFR-002
  - NFR-008
  - plans/nfr-catalog.md
  - src/cli.test.ts
supersedes: 
---

# `N8-LANE` — I re-ran it, my own null control was INADMISSIBLE, and a direct instrument settles it at **0.31 ms**

The subtask said: *"Rule on whether that figure is good enough to carry, or re-run it."* **I did
both.** The ruling is that it carries; the re-run is below; and a third instrument nobody had used
makes the paired instrument's verdict unarguable.

Machine: **Apple M3, Darwin 25.5.0, Node v24.12.0, npm 11.7.0**.

## Conditions, and the identity check the row requires

- **A** — control, detached worktree at `ab0864e~1` (= `4e9ed1d`).
- **B** — this branch's tree at `8fb6ff1`; `src/` verified **identical to the delivered commit
  `ab0864e`** (`git diff --stat ab0864e HEAD -- src/` → 0 lines), and differing from **A** in
  **exactly** `src/cli.ts` and `src/cli.test.ts` (`/usr/bin/diff -rq`).
- **N** — identity null control, a second detached worktree at `ab0864e~1`, **`cmp`-verified
  byte-identical to A across all 50 `.ts` files** and clean under `/usr/bin/diff -r` over `src/`.

All three trees carry **identical `node_modules` (94 entries each)**, installed separately.
Instrument: **CPU (user + sys) of `npm test`, `PERFT_DEEP` unset**, one fresh OS process per run,
via `/usr/bin/time -p`. Rotation over 9 rounds — `A B N`, `B N A`, `N A B`, `A N B`, `B A N`,
`N B A`, `A B N`, `B N A`, `N A B` — **round 0 discarded as warm-up, n = 8** paired rounds.

## My result — and it is INADMISSIBLE by the row's own words. Saying so rather than quoting it

| condition | median paired delta vs A | as % of A | sign |
|---|---|---|---|
| **B − A — this ticket** | **−150 ms** | **−1.35 %** | 2 / 8 positive |
| **N − A — identity null** | **−150 ms** | **−1.35 %** | **0 / 8 positive** |

Median lane CPU for A: **11,115 ms**. Per-round `B − A` (ms): `−250, +20, −240, −100, −80, −200,
+70, −330`.

**The row admits a measurement only with a null control "reading ≤ 1.5 % CPU **with its sign at
chance**". My null reads 1.35 % — inside the magnitude clause — but its sign is 0/8, which is not
chance, it is a systematic negative drift** (the machine warmed and later runs got cheaper; A was
scheduled first in more rounds than not). **So my run fails the second half of the admissibility
clause and I am not entitled to quote −150 ms as this ticket's lane cost.** I am recording it because
suppressing an inadmissible run and keeping only the admissible one is how a number gets laundered.

**What my run does legitimately establish**, because both conditions paid the same drift:

- **`B − A` median equals `N − A` median to the millisecond: −150 ms and −150 ms.** This ticket's
  tree is indistinguishable from a **byte-identical** tree on this instrument. That is the same
  conclusion the engineer reached in a different session with a different noise regime and the
  opposite drift sign (+70 ms against a +100 ms null). **Two independent sessions, two opposite
  drifts, one conclusion.**
- **The worst single positive excursion across 8 rounds is +70 ms = 0.108× the 650 ms bar.** Even
  reading the most pessimistic round as if it were the effect, the bar is not approached.

## The instrument that actually settles it: **0.31 ms**

The paired lane instrument has a noise floor of order **150 ms**. The thing being measured is a
**single added `it` doing pure string work over already-captured stderr**. So I measured it
directly, per-test, from the runner:

```
npx vitest run src/cli.test.ts --reporter=json
  -> ABC-066 — the usage line is a command the user can actually run
     A1/A2/A3 — every refusal advertises the separator, and all it advertises resolves
     duration: 0.31 ms
  -> whole file: 30 tests, 12.5 ms total assertion duration
```

**0.31 ms against a 650 ms bar is 0.00048×.** The added test is roughly **500× smaller than the
paired instrument's own noise floor**, which is *why* both paired runs read "indistinguishable from
zero" — not because either measurement was poor, but because **the quantity is three orders of
magnitude below the instrument's resolution.** That reframes the engineer's honest
`confidence: medium` caveat: the point estimate is unknowable on that instrument and does not need
to be known.

**Nothing hides in module-scope setup**, which per-test duration would not attribute: the fence
`expect(spawned).toBe(10)` at `:836` passes and `CHILDREN` has exactly **10** entries, so **no new
capture and no new child** was added. The four helpers are pure function definitions at module scope.

## Neither subtraction was owed, and neither was taken

- **0 new test files** → the **160 ms per-file floor** is not subtracted (nothing to subtract).
- **0 new child processes** → **nothing is charged to `N8-SPAWN`**, whose four exclusions I read
  before concluding it does not apply here.

**The figures above are raw and undiscounted — the most conservative reading available.**

## Ruling on the lane figure

**The engineer's figure is GOOD ENOUGH TO CARRY, and I re-ran it anyway rather than rule on the
paperwork.** His instrument was the catalog's — 8 rounds, rotation, `cmp`-verified identity null,
round 0 discarded, sign test reported — and his null (+0.87 %) satisfied **both** halves of the
admissibility clause (≤ 1.5 %, sign 4/7 = chance), which **mine did not**. His honest caveat about a
contended session is a caveat about the *point estimate*, and the bar does not ask for a point
estimate; it asks whether the delta is ≤ 650 ms.

**`N8-LANE`: MET, at ≤ 0.11× the bar on the paired instrument's worst single round and at 0.0005× on
the direct one. The row does NOT move — and a gate is not permitted to move it, which I have not.**

## `NFR-008` — the total still holds

Five clean runs on the branch tip during this hop: median wall **2.4 s** (bar ≤ 3 s), median CPU
**10.7–11.1 s** (bar ≤ 13 s). My own full gate run reported `Duration 1.91s`, 857 tests. **Consistent
with the engineer (10.68 s → 10.77 s) and with QE (median 10.60 s). `NFR-008` HOLDS.**

## `NFR-002` — **NOT TRIGGERED. Confirmed, with an armed probe**

The ticket claims it is untriggered because a refusal writes no frame row and `src/cli.ts` exports
nothing. **Confirmed on all three limbs, measured:**

| limb | measurement |
|---|---|
| `src/cli.ts` exports nothing | `grep '^export' src/cli.ts` → **none**, at both `ab0864e~1` and `ab0864e`. So it is **no probe root** (`ADR-0011` clause 4). |
| a refusal writes no frame row | `node src/cli.ts --colour purple` → stdout **0** lines, stderr **2** lines, **0** frame rows on either channel. Same via `npm run chess -- --colour purple`: stdout 2 lines (npm banner), **0** frame rows. |
| the changed bytes are off the frame path | `USAGE` is read at exactly one site, `src/cli.ts:82`, inside the `if (!resolution.ok)` branch, which **`return`s before** `beginFrameSession` is ever reached. Read from the source, not inferred. |

**The probe is ARMED, not vacuous:** the success control `npm run chess -- --ascii` writes **24**
stdout lines with **9** frame-shaped rows. A probe reporting 0 on the refusal *and* 0 on the board
would have proved nothing. **`NFR-002` does not fire. The ticket is correct, and now it is measured
rather than asserted.**

No `ADR-0011` census figure moves: **0 new modules**, 0 new entry points, 0 new frame producers.
