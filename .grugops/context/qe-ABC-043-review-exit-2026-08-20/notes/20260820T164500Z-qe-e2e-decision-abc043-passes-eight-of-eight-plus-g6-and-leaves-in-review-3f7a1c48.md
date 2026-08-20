---
id: 20260820T164500Z-qe-e2e-decision-abc043-passes-eight-of-eight-plus-g6-and-leaves-in-review-3f7a1c48
kind: decision
by: qe-e2e
role: qe-e2e
task: qe-ABC-043-review-exit-2026-08-20
at: 2026-08-20T16:45:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-042
  - ABC-044
  - ABC-113
  - ABC-019
  - ABC-037
  - ADR-0015
  - src/cli.ts
  - src/cli.test.ts
  - plans/board.md
supersedes:
---

# `ABC-043` PASSES 8/8 plus `G6` and leaves `In Review`. Every verdict below was taken by planting a wrong build and watching it go RED

## Why this is a hand-authored `decision` and not a stamped `finding`

Re-checked at this hop, not inherited: `scripts/context-io.ts`, `scripts/claim.js` and
`mcp__grugops__propose_note` are absent from this repository and from the kit, and
`context.human_admission` is `off`. **No `finding` is admissible; no `§14-gate#<id>` verdict can be
minted, and I did not invent one.** This is QE's recorded verdict for the `In Review` exit under this
project's QE validation authority. **It is not a UAT, it is not a signature, and no human has
accepted this work.**

## Where I measured

**`main` @ `d127ae3`, not a branch** — `ABC-043`'s code merged at `46457b8` (delivery) and `6091212`
(repair round 1), and every work branch is deleted. The delivered-diff criterion (`A8`) is measured
from git history at those commits; everything else is measured against the tree that exists now.

**I planted every decoy in an ISOLATED COPY of `main`, outside the repository** (`git archive
d127ae3 | tar -x` into a scratch directory, `node_modules` symlinked). **That was not fastidiousness:
mid-hop, a second agent (`ticket-to-pr-ABC-050-2026-08-20`) was writing into `src/` in the shared
working tree while I was measuring.** The baseline in my isolated copy reads identically to the
repository — 40 files / 1207 tests / 0 skipped, `tsc` clean — so the two are the same tree, and my
mutation results carry no other actor's edits. See the artifact-ref note.

## The verdict, criterion by criterion — the wrong build is the evidence, not the green row

| criterion | verdict | the build I planted, and what it did |
|---|---|---|
| `A1` | **PASS** | `D2` — options object hoisted out of the call with a real `as` cast at `humanColour`, `tsc` clean → **RED on `A1` and `G6`**. `D14` — an adapter arrow wrapped round `createEngine` → **RED on `A1`**. The window that returned `""` for QE's 2026-08-19 mutant now **throws**; I re-planted that exact mutant and it dies. **Residual, declared: `D4` (below).** |
| `A2` | **PASS** | `D5` — the start position handed to the loop with **black** to move, `tsc` clean → **RED on 10 rows, `A2` among them**. `D13` — a named seam pre-read → **RED on `A2`**. `D8` — inverted `humanColour` → **RED on `A2`**. The frame-count formula is asserted as a formula and the mate is compared byte-for-byte against the merged renderer. |
| `A3` | **PASS** | `D10` — **the control**: the catch arm exits `0` → **RED on `A3` AND `A4`**, which is `## Test notes` 2 working. `D12` — the crash line reworded to say *"ended in a draw after an engine-failure"* → **RED on `A3`** (both word lists bite). `D1` — the two non-zero codes swapped → **RED on `A3`** (see the `G-05` note). **`G-01` is CLOSED:** `A3`'s child now substitutes `./line-input.ts`, the seam its own Given stipulates, one spawn, under `ADR-0015` (S)/(C) and BA/PM's (N1)–(N3). The `./command-input.ts` child QE refused in 2026-08-19 is gone from the file. |
| `A4` | **PASS** | `D11` — the CLEAN path also writes the internal-error line, so the two paths become identical by message → **RED on `A4`**. `D10` collapses them by code → **RED on `A4`**. Confirmed at the shell on the delivered build: one move on a closing pipe → 3 frames, `input ended` **once**, **exit 0**, 3.08 s. |
| `A5` | **PASS** | `D9` — the entry point turns `engine-threw`/`engine-failure` into exit `70`, `tsc` clean → **RED on `A5`** and on `ABC-044` `A3`. The discriminating requirement bites in the direction the ticket names. |
| `A6` | **PASS** | `D7b` — `void beginFrameSession(sink, START_FEN.length)` in the entry point: type-clean, **no numeric literal**, so it evades the row-count clause on purpose → **RED on `A6`** and on `ABC-042` `A8 / ABC-043 A6`. The row-count half is proved separately by `D6`. |
| `A7` | **PASS** | `D8` — `humanColour: colour === "white" ? "black" : "white"`, `tsc` clean, and it still satisfies `A1`'s `humanColour:\s*colour` row → **RED on `A7`**, both directions, plus 10 other rows. The positional (unconsumed-line) witness and the frame-by-frame content witness are both present. |
| `A8` | **PASS** | Measured from git, not read: `git diff --numstat 54cbb23 46457b8 -- src` = **exactly two files**, `src/cli.test.ts` (+704/−54) and `src/cli.ts` (+91/−17). `turn-loop.ts`, `frame.ts`, `render-seam.ts`, `line-input.ts`, `engine.ts`, `history.ts`, `cli-options.ts` — **all seven blob-identical** across the delivery, checked by `git rev-parse <rev>:<path>`. Suite green, skip **0**, `PERFT_DEEP=1` **32/32**. `D6` — a row count hidden inside a template interpolation on the crash path (`INTERNAL_ERROR.padEnd(23)`) → **RED on `A8`**, so `G-02`'s repair is real for the form that shipped green. |
| `G6` | **PASS** | `D3` — the options bag hoisted and the seam called **through the bag** (`void options.input(…)`), the shape that was GREEN on `G6`'s own row in 2026-08-19 → **RED on 7 rows, `G6` among them**. `D13` — the seam bound to a name and pre-read → **RED on `G6`**. `G6` now asserts the property instead of three proxies for it. |
| the exit-code rule | **PASS as a criterion, BREACHED on one path no criterion reaches** | `D1` → **RED on `A3`**. See the `G-05` note for the adjudication and the EPIPE note for the breach. |

**Result: PASS. `In Review` → `Ready for UAT`.** Not merged (there is nothing to merge — the code is
on `main`), **no UAT waiver applied and none measured** — that is the Orchestrator's at the
`Ready for UAT` exit, over `git diff --name-only main...HEAD -- src/`, never over `<tip>~1`, and I
name only the fact that `ABC-043` shipped `src/cli.ts` at **+91/−17**.

## What PASS does not mean

- **It is not acceptance.** QE is not UAT. No human has signed anything here.
- **It does not close `D4`, `G-06`, or the EPIPE regression.** Three open items travel with this
  ticket, each in its own note, none of them failing a criterion as written.
- **It does not re-open `ABC-044` or `ABC-113`.** Neither page was opened. The two false sentences
  `ABC-113`'s QE hop named are still on `main` and are still the Orchestrator's; I add a **third**,
  in `ABC-043`'s own repair comment, in the live-stdin note.

## `D4` — `ABC-113`'s declared open remainder, re-planted by me at `main` and still alive

```ts
const history = newGame(START_FEN);
const spare = { ...history };
for (const history of [spare]) { try { const outcome = await runTurnLoop({ history, … }); … } }
```

`tsc --noEmit` **clean**, `src/cli.test.ts` **55/55 GREEN**. The loop and the result screen are both
handed a copy, not the game the entry point built — the property `A1`'s comment claims. It survives
because a `for…of` binder introduces the name with **neither `:` nor `=`**, so the count row's
`/\bhistory\s*[:=]/g` sees nothing.

**It does NOT fail `A1`.** `A1`'s text is *"called exactly once with all six options and no cast and
no adapter"*, and this build satisfies every word of it. It is an **instrument gap on a property the
comment asserts and the criterion does not**, it was declared by `ABC-113`'s QE hop before merge, and
**I did not author its close** — the same conflict rule that produced `ABC-113` in the first place.
**Recommended to the Orchestrator, not fixed here.**
