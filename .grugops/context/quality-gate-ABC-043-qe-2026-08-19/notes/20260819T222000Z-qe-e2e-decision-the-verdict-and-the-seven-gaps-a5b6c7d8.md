---
id: 20260819T222000Z-qe-e2e-decision-the-verdict-and-the-seven-gaps-a5b6c7d8
kind: decision
by: qe-e2e
at: 2026-08-19T22:20:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-042
  - ABC-037
  - ABC-019
  - ADR-0011
  - ADR-0013
  - ADR-0014
  - ABC-108
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# QE verdict on `ABC-043`: **PASS WITH GAPS — and `A3` is HELD, not failed, pending an Architect/Design ruling on its instrument**

No `finding` is admissible on this install. This is a hand-authored `decision` carrying QE's recorded
verdict for the `In Review` exit, per this project's QE validation authority. **It is not a UAT, it is
not a signature, and no human has accepted this work.**

## The verdict, in three lines

- **The BUILD is sound.** Nine mutants of mine plus the engineer's ten; the product's behaviour is
  right on every path I could reach, and I played the game myself.
- **`A3`'s INSTRUMENT is unruled.** I decline to grant the rig extension — see the ruling note. `A3`
  is **HELD**, not failed: the build satisfies the criterion, the licence for the tool that proves it
  is Architect/Design's to extend or refuse.
- **Seven gaps, none in the product, five in the instruments.** Four of the five are guards that pass
  when they cannot see.

**This ticket does not exit `In Review` on my verdict alone.** `G-01` needs a ruling. `G-02`, `G-03`,
`G-04`, `G-05` are instrument repairs and are the engineer's, not mine — **I do not fix and I did not
weaken a guard.**

## Criterion by criterion, against the ticket's text and not against the build

| criterion | verdict | how I decided it |
|---|---|---|
| `A1` | **MET, guard weak** (`G-04`) | one `runTurnLoop(` call, six options each pinned to its supplier, `tsc` clean. **But the "no cast, no adapter" window is vacuously satisfiable** — a build with an explicit `as` at the wiring passes all 50 rows |
| `A2` | **MET** | `mate` child exits 0; 6 frames = `1 + 4 plies + 1 non-advancing-with-a-message`, asserted as the formula; last frame byte-compared against the merged seam over the replayed mate; `Qh4#` on the board; `input ended` absent |
| `A3` | **HELD** (`G-01`) | the BEHAVIOUR is right — I ran the child by hand: exit **70**, one fixed line, none of the ten `TerminalReason` values, none of the five result words, one frame, no result screen. The discriminating mutant (catch and exit 0) **REDS** on `A3` and `A4`. The instrument's licence is unruled |
| `A4` | **MET** | `INPUT_ENDED_NOTICE` once, exit 0, one frame, no crash marker; asserted against `A3` in both directions, both halves (message AND code) |
| `A5` | **MET** | both faulty seams exit 0, one frame each, no `EndReason` word, no crash line, no notice. `M9` (the foreign move made legal) is the non-vacuity proof and it is real |
| `A6` | **MET, guard weak** (`G-02`) | `beginFrameSession` **0** in the entry point, **1** in `src/turn-loop.ts`; 6 frames at the reference height; 0 CSI. **But "no numeric row-count literal" is still blind to an interpolation** |
| `A7` | **MET** | both directions, each frame-by-frame against the replayed game, plus the positional witness (2 frames before the first prompt on `black`, 1 on `white`). `M5` and `M4` both red it. **Neither direction alone would do, and both are present** |
| `A8` | **MET** | `git diff --numstat 54cbb23 46457b8 -- src` = `cli.test.ts` (+704/−54) and `cli.ts` (+91/−17), nothing else; **seven merged modules byte-identical**, measured by me; 1189/39, skip 0, `PERFT_DEEP` 32/32 |
| `G6` | **MET, guard incomplete** (`G-03`) | the delivered build is correct — the seam is built once and never invoked. **But a third orphaning shape passes `G6`'s own row**, and it hangs a real session forever |
| exit codes | **MET in behaviour, UNGUARDED** (`G-05`) | `0` verbatim, `1` refused, `70` internal — all three confirmed at the shell. **Swapping `1` and `70` is green across the whole suite** |

## The gap register

| id | gap | severity | evidence | owner |
|---|---|---|---|---|
| **`G-01`** | **`A3` substitutes `./command-input.ts`, a merged production parser reached by a static import inside `./line-input.ts` — a module BA/PM named as never-substitutable. The rig is licensed for the ENGINE seam** | **HIGH — blocking the `In Review` exit** | the ruling note; `src/line-input.ts:56` is the only production importer; `src/cli.ts` exports 0 and the seven merged modules are byte-identical, both measured by me; the delivered reader is **total** — 71 pathological lines, exit 0, zero internal-error lines | **Architect/Design** |
| **`G-02`** | `A8`'s row-count transcription is blind to a literal inside a template interpolation. The `ABC-043` repair moved the hole, it did not close it | **MEDIUM** | ``INTERNAL_ERROR.padEnd(23)`` inside the crash line's template: `src/cli.test.ts` **50 passed**, `src/history-pane.nfr.test.ts` **11 passed**. Control (`const unused = 23;`) reds | Engineer (`ABC-043` or a follow-up) |
| **`G-03`** | `G6`'s three clauses miss a third orphaning shape — the seam invoked through the options object, never bound to a name | **MEDIUM** | `G6` row ✓ green on that build; the real invocation **HUNG**, 1,483 bytes, no exit. Caught only incidentally, by frame-shift rows | Engineer |
| **`G-04`** | `A1`'s "no cast and no adapter" window collapses to the empty string when the options object is hoisted; a guard that cannot look always passes | **MEDIUM** | a build carrying `colour as "white" \| "black"` at the wiring: `tsc` clean, **50 passed**. The shape is held today only by `ABC-042`'s unrelated `sink,\s*\}\)` row and by `G6`'s regex | Engineer |
| **`G-05`** | The ticket's exit-code rule is asserted nowhere. Swapping the usage code and the internal-error code is green | **MEDIUM** | `node src/cli.ts --colour purple` exits **70** on the mutant; **50 passed**. No row pins the usage code to `1`; `A3` asserts only `!= 0` and `!= badColour.status` | Engineer |
| **`G-06`** | **No child, in any lane, runs the delivered composition's real engine.** All seven `ABC-043` children plus `ABC-042`'s two carry doubles exporting `DEFAULT_BUDGET_MS = 0` | **MEDIUM — declared, not concealed** | `## Test notes` 8; the substitution note. The only end-to-end evidence is two humans-with-a-terminal runs recorded in context notes | BA/PM to cut; `ENGINE_DEEP` is the precedent |
| **`G-07`** | The `timeout: 30_000` bound is unguarded — deleting it is green | **LOW, recorded not raised** | grep: `timeout` appears once in a call and once in an unrelated comment. It is insurance, not a criterion; a guard would assert on a test file's own literal | none |

**Gaps found at QE: 7 (1 HIGH, 5 MEDIUM, 1 LOW).** Process rule 1's control asks for gaps below 3
per ticket across five consecutive tickets; this reading is above that and should be counted honestly
against the control rather than trimmed to fit it. **Five of the seven are instrument gaps, and four
of those five are guards that pass by being unable to look** — that is one shape, recurring, and it is
the thing to fix rather than seven separate things.

## What I explicitly did NOT do

- **Did not rule the rig extension.** `G-01` is Architect/Design's, and I stopped on it as instructed.
- **Did not rule an NFR bar.** `ADR-0014` has `NFR-008` BREACHED; this ticket's **+0.86 s** and my own
  **13.86 s** reading are reported in the gate note as measurements. **`N8-LANE` is a rate limit, not
  a grant**, and I claimed nothing against it. `ABC-108`'s `OQ-1` is Architect/Design's.
- **Did not re-open `ABC-033`, `ABC-035`, `ABC-037` or `ABC-078`.** `G-01` concerns whether a TEST may
  substitute `ABC-035`'s module; it questions nothing that ticket shipped.
- **Did not fix, did not weaken a guard.** Every mutant was applied, run and reverted;
  `git status --short` is empty and the tree re-ran **1189 passed / 39 files**.
- **Did not merge, did not deploy, did not move a board column**, and did not touch
  `plans/traceability.md`.

## The one sentence I want carried forward

**This is the first ticket in this repository whose product a human can play, and the first whose
strongest evidence is a person at a terminal rather than a row in a suite** — `G-06` is what makes
that true, and it should be closed by cutting an opt-in real-engine lane, not by trusting the
transcript.
