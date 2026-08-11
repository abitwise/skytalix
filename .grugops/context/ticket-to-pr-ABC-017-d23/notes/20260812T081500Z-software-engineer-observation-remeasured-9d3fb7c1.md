---
id: 20260812T081500Z-software-engineer-observation-remeasured-9d3fb7c1
kind: observation
by: software-engineer
at: 2026-08-12T08:15:00Z
verified_by:
confidence: high
refs:
  - ticket-to-pr-ABC-017-d23
  - abc017-d23-2026-08-12
  - ABC-017
  - ABC-016
  - NFR-008
  - src/history-pane.test.ts
  - src/frame.test.ts
  - 20260812T041500Z-ba-pm-observation-a1-a12-sweep-8d3e07f5
  - 20260812T042000Z-ba-pm-decision-a13-regate-ratified-b71ca4d9
supersedes:
---

# Every inherited figure re-measured — three confirmed exactly, one CORRECTED

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit, and
> `mcp__grugops__propose_note` is not in this session's tools. **Not a `finding`.**
> Every mutant below was built and run **out of tree**, in a copy of `src/` in the session
> scratchpad with `node_modules` symlinked. **No file was added to the repo** and nothing under
> `src/` was patched in place.

## The baseline, re-run before any edit

`732/732 on 26 files`, skip 0, lint 0, typecheck 0, build 0. **The Orchestrator's figure, confirmed
by my own run**, so anything red afterwards is attributable to this hop.

## 1. The survivor, reproduced — CONFIRMED

`WPOS` — corrupts the caller's `history.position` once per object via a `WeakSet` guard, changes no
rendered byte because the pane re-parses `initialFen` and never reads that field.

| tree | verdict |
|---|---|
| delivered suite, post-rebase | **passes 732/732 on 26 files — ZERO catchers** |
| this hop's suite | **FAILS**, on exactly one test: `A9 — neither render touches the caller's position or its move count`, first message `0 plies position: expected '…' to be '…'` |

BA/PM measured it at 697/697 on 24 files against the old `main`. Post-rebase the number is
732/732 on 26 — **the survivor survived the rebase too**, which is the fact that mattered.

## 2. `W9ONCE`, the second wrong build — CONFIRMED

Drops one move from the caller's `moves` array once per object. `A9` as delivered **passes** it
(the six failures are `A2`, `A3`, `A4`, `A6`, `A7`, `A8`); with the fixed fixtures `A9` **fails**,
`1 plies move count: expected +0 to be 1`. BA/PM's table reproduced.

## 3. `A13`'s edit 2 is load-bearing — CONFIRMED EXACTLY

Mutant `M1`, the status panel self-consistently shipping 4 rows (`STATUS_ROWS = 4`), run against
`src/frame.test.ts` alone:

| | failures | the FIRST failure says |
|---|---|---|
| **both edits applied** | **4** | `expect(HEIGHT).toBe(23)` — *"expected 24 to be 23"* |
| **import only, `statusStub` left hardcoded** | **15** | `expect([...counts]).toEqual([HEIGHT])` — *"expected [23] to deeply equal [24]"*, then frame row counts, screen contents and the sanitizer |

**4 and 15, to the number.** Both edits landed together.

## 4. The 8.2 ms rebuild figure — CORRECTED, conclusion unchanged

`8.2 ms` is the **warm steady-state** cost of one `buildAllCases()`. My first bench reproduced it
(median 8.47 / 8.61 / 8.52 ms over 15 rounds after two warm-up calls, min 8.14) — but a test file
does not pay the warm cost. Measured with **no warm-up**, five runs:

| call | CPU (user + sys) |
|---|---|
| 1st (cold) | **57.99 / 60.27 / 63.39 / 68.45 / 65.67 ms** |
| 2nd | 24.42 / 23.61 / 24.02 / 24.96 / 24.81 ms |
| 3rd | 11.00 / 11.28 / 11.82 / 11.54 / 11.89 ms |
| asymptote | ~8.5 ms |

The module scope already paid the cold call before this hop. **This change adds the 2nd and 3rd
calls — about 35 ms CPU — plus 28 extra `renderHistory` calls**, against `N8-LANE`'s 650 ms content
allowance for this ticket's two files. **~6% of the allowance: `N8-LANE` does not move**, which is
BA/PM's conclusion, reached on a figure that is roughly 4x low for the calls a test actually pays.
No bar was re-derived.

**A caution for whoever measures this lane next.** I also ran the paired whole-lane form (9
interleaved rounds, delivered vs fixed vs an identity null control). It is **not usable at this
signal size**: the null control's own median came out at **+80 ms** against a ~9.5 s lane, with the
fixed-vs-delivered median at +230 ms. The direct `process.cpuUsage()` measurement above is the
trustworthy one; the lane-differencing noise is an order of magnitude larger than the effect.
Machine: Apple M3 (Mac15,13), Node v24.12.0, darwin/arm64 — **`UNKNOWN - verify` on any other
hardware.**
