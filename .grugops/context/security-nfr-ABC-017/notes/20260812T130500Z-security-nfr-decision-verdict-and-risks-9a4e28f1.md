---
id: 20260812T130500Z-security-nfr-decision-verdict-and-risks-9a4e28f1
kind: decision
by: security-nfr
at: 2026-08-12T13:05:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-017
  - abc017-secgate-2026-08-12
  - ABC-017
  - ABC-019
  - ABC-010
  - EPIC-006
  - NFR-002
  - NFR-008
  - plans/board.md
  - plans/traceability.md
  - 20260812T124500Z-security-nfr-observation-a12-and-replay-6b21d4f7
  - 20260812T125000Z-security-nfr-observation-importer-rule-and-count-8c40be92
  - 20260812T125500Z-security-nfr-observation-security-surface-3e70a1c4
  - 20260812T130000Z-security-nfr-observation-history-cols-re-derived-5d92f6b3
  - 20260812T102000Z-qe-e2e-decision-flags-and-verdict-8e47b3d5
supersedes:
---

# VERDICT: **PASS_WITH_RISKS**

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`**, and no
> self-attested stamp — the §14 gate machinery does not exist in this repo, so no `§14-gate#<id>`
> could be honest and I will not invent one.

## The verdict, and why not the other two

**PASS_WITH_RISKS.**

**Not `PASS`.** Two guard gaps sit on properties this role owns: `A11`'s structural guard is blind
in two of the five directions that can void `NFR-002`'s `O(window)` premise, and an
externally-supplied FEN can push pane compute to 1.80x the ticket's own 150 µs pane bar. Neither is
a defect in delivered code and neither blocks, but a clean `PASS` would hide both.

**Not `FAIL`/`BLOCKED`.** Every bar this gate owns is **MET on delivered code, re-derived on this
gate's own instruments**: `A12` parts 1, 2 and 3; `NFR-002`'s structural premise; the injection
surface. There are **zero code defects** — I found none and QE found none. Gates are green
(lint/typecheck/build 0, 740/740 on 26 files, skip 0) and `quality.mandatory_gates` are all
satisfied. **Nothing is `high` and reachable**, and `security.block_on` is `high`.

## Required fixes

Nothing blocks the merge. One required fix, non-blocking, with its severity reasoned rather than
defaulted:

**RF-1 — `A11`'s structural guard is blind in two directions. Severity `medium`.**
`WDYNIMP` (`void import("./history.ts")`) and `WBAREIMP` (bare `import "./history.ts";`) each
**survive 740/740** while genuinely pulling `src/history.ts` into the runtime graph; this gate's
module-graph load probe catches both. The guard implements "no static value import"; `A11`'s clause
says "zero runtime importers"; `NFR-002`'s `O(window)` claim depends on the clause, not the guard.
*Not `high`:* nothing is broken today — production runtime importers are **zero, measured by module
loading, not by `grep`** — so this is regression detection, not a violated bar, and it fails no ASVS
L1 requirement.
**Owner: the Software Engineer (the guard) with BA/PM (only if criterion text moves), at the
`G1`/`G2` fixture hop.** **Trigger: the next edit to `src/history-pane.nfr.test.ts`, or `ABC-019`'s
`ADR-0009` cl. 9f re-gate against real panels — whichever comes first.**
The fix is specified in the importer note and **deliberately not implemented here**: the brief
forbids this hop writing a fixture, and it wrote none.

## Accepted risks — each with a NAMED owner and a TRIGGER

**AR-1 — the supplied-FEN width and compute path.** `initialFen` is externally supplied
(`EPIC-006` owns startup); `parseFen` imposes no upper bound on `fullmoveNumber`. Measured: row
width exceeds `HISTORY_COLS` but is **bounded at +19 characters (40 total)**, because
`String(double)` is at most 23 characters — so this is **not** the unbounded-string class
`ABC-018`'s gate priced. Pane compute tracks FEN length and reads **270.45 µs at 2e5 digits, 1.80x
the 150 µs pane bar but 1.69% of `NFR-002`'s 16 ms frame budget.**
**L1's default `high` is OVERRIDDEN to accepted, with reason:** the gap is in `src/fen.ts` and
pre-exists this ticket, it is unreachable today (no entry point until `EPIC-006`), it is already
recorded as an accepted limitation in the delivered module's own docblock, and it is bounded.
**Owner: BA/PM at `ABC-010`** (the ticket the docblock already names for FEN bounds), with
**Architect/Design at `EPIC-006`** as the checkpoint if `ABC-010` has not landed.
**Trigger: the first time a FEN reaches the process from outside it** — a load, a resume, or a
`--fen` flag.

**AR-2 — `G1`, the black-to-move anchor with a slid window, as an NFR concern.** QE owns the
criteria gap and BA/PM owns the fixture; **what is mine is the consequence for `NFR-002`.** That
row's write half carries *"a 23-row frame at `W = 18`, 418 characters serialized"* as its **measured
denominator**, and `ADR-0009` cl. 5's `= 23` tripwire exists to make any panel row-count change fail
loudly. **`WLEAD-A` returns nine rows and `A13` cannot see it**, because `A13` composes the exported
constant `HISTORY_ROWS` and never the pane's actual output — so the tripwire built to protect that
denominator has a hole exactly where `G1` lives, and the first detector would be `ABC-019`'s
clause-9 session-height assertion firing at runtime and naming the wrong subsystem. **Delivered code
is correct** (QE probed 15/16/17/30/31/40/41/100/101 plies; I did not re-probe and say so).
**Owner: BA/PM, for the one fixture and three assertions QE specified.**
**Trigger: before `ABC-019`'s cl. 9f re-gate runs against real panels** — that is the first moment a
nine-row pane would be paid for, and it is also the moment it would be misdiagnosed.

**AR-3 — `G2`, caller usability and pane freshness, as a reliability concern.** `WFREEZE` and
`WSPLICE` survive; `WCACHE` dies only by fixture sharing that the `D23` remedy points away from.
The live consumer is real: `playMove` mutates `GameHistory` in place, so `ABC-019`'s loop hands the
**same object** to `renderHistory` every frame. A frozen array leaves the loop unable to play a
move; a cached pane shows move 1 forever. **Owner: BA/PM** (criteria) **with the Software Engineer**
(fixtures). **Trigger: the same `G1`/`G2` fixture hop, or `ABC-019`'s rebase onto merged `ABC-017`.**

**AR-4 — `G5`, the `HISTORY_COLS` self-comparison, uncaught in the right-padding direction.**
Re-derived here: `WCOLS24R` **survives 740/740** — worse than QE could measure, because `ABC-027`
has now merged and does not close it; `WCOLS24M` is killed ×7, reproducing QE exactly.
**`HISTORY_COLS` HOLDS at 21. No widening, no criterion, no constant-FRAME-width criterion,
`ADR-0009`/`ADR-0010` not re-opened.** **This risk is deliberately left UNOWNED and it is the only
one that is** — it is an unhomed Architect/Design question and the brief rules that it stays unhomed
this hop. Recording a fake owner to satisfy the format would be worse than saying so.
**Trigger for homing it: whoever next opens frame-width ownership** — on current evidence that is
`ABC-019`'s `ADR-0010` narrowing criterion or `EPIC-006`.

## The figures this gate owed, in one place

- **`A12` part 1 — MET.** 38.97/39.33 µs @40, 67.12/67.56 @120, 72.93/74.05 @300 →
  **0.260/0.262x, 0.447/0.450x, 0.486/0.494x** of the 150 µs bar. Worst 74.12/74.90 µs @378
  (0.494/0.499x). **The Engineer's 0.257x/0.448x/0.480x is reproduced, not inherited.**
- **`A12` part 2 — MET.** Three within **1.871x / 1.883x** of the 3x bar.
- **`A12` part 3 — MET** on this gate's own counter: `parseFen` = 1 at every length including 0
  plies; `toSan` = rendered plies exactly (0/1/3/15/16/16/16/16), never above 16, arity always 2;
  8 rows everywhere. The six zero-count clauses are proven **structurally** — `history.ts` and
  `gameend.ts` are not in the pane's runtime closure, so those functions cannot be called.
- **Replay coefficient — the two instrument families DISAGREE and I report the band, not a point
  estimate: 4.86/4.92 ns/ply** (total-render regression, intercept 43.95/43.96 µs, R² 0.99960/0.99933)
  against **6.93/6.98 ns/ply** (replay-loop isolation, intercept 1.93/1.83 µs, R² 0.99961/0.99963).
  Intercepts reproduce across roles; slopes do not, and **I cannot attribute it.** Conclusion holds
  on every figure: at 300 plies replay is 1.5–2.1 µs (~2–3% of the pane's ~73 µs), and replay alone
  would not reach 150 µs until ~21,600–30,900 plies.
- **Importer rule and count.** Rule stated before the number (five forms; `import type` excluded
  under `verbatimModuleSyntax`). **PRODUCTION runtime importers = ZERO, measured by module-graph
  closure with a positive control and an arming negative control** — stronger than the `grep` the
  ticket asked for. **TEST-file runtime importers = FOUR.** QE's correction confirmed independently;
  the ticket's bold **THREE** is wrong, and the count goes **two → four**, not one → three.
- **Machine: Apple M3 (Mac15,13), 8 logical cores, Node v24.12.0, Darwin 25.5.0 arm64.
  `UNKNOWN - verify` on any other hardware.**
- **`N8-LANE`: not re-derived and not moved.** The ticket forbids re-deriving it and this gate added
  **zero test files and zero test lines**, so the declaration stands at two files unchanged.

## UAT judgment: **DEFERRED → `EPIC-006`. EXPLICITLY NOT PASSED.**

`quality.ui_e2e` is `ui-or-critical-path`, and **there is no runnable surface to exercise.** Checked
at source rather than assumed: `AGENTS.md` records `Dev / run` and `E2E` as `UNKNOWN - verify` with
the reason *"no CLI entry point until `EPIC-006`"*; `package.json` is `private` with no `bin`, no
`main` and no `start`; and this pane **returns rows as a value and writes nothing** — `ABC-018` owns
writing, `ABC-019` owns the loop. A human cannot look at a move-history pane today.

**No E2E was invented and no UAT was passed.** This matches the disposition `ABC-027` carried into
`Done` one ticket ago (*"UAT DEFERRED → `EPIC-006`, EXPLICITLY NOT PASSED"*), and it is the honest
answer rather than a green tick.

## BOARD MOVE REQUESTED — NOT TAKEN

**`ABC-017`: `In Security/NFR` → `Ready for UAT`.** `plans/board.md` is the Orchestrator's and was
**not** written; the ticket's frontmatter `column` was not written either, for the same reason.

**Consequence, stated and not assumed** (read from the live board headings):

| column | before | after |
|---|---|---|
| `In Security/NFR` | 1/2 | **0/2** |
| `Ready for UAT` | 0/4 | **1/4** |
| `In Review` | 1/3 (`ABC-019`) | 1/3 — unchanged |

**Both inside their WIP limits.** `Ready for UAT` is a queue state, not UAT itself — moving there is
correct even though UAT is deferred, and the deferral is recorded rather than discharged.

**Note for the merge decision, which is the Orchestrator's and not mine:** the Security/NFR exit is
earned and **nothing here blocks merging third.** The five criteria gaps still route to BA/PM, and
whether to spend that hop before merging or to carry them is unchanged by this gate — except in one
respect worth stating: **`RF-1` and `AR-2` both name the `G1`/`G2` fixture hop as their owner**, so
if that hop runs, it is the natural place to take all three at once.

## `plans/traceability.md` — MY WRITE WAS DENIED BY THE HOST PERMISSION CLASSIFIER

I attempted the trace row append and **it was denied**, exactly as QE's was. Per the brief I
**stopped rather than routing around it**, and I did not retry by another mechanism.

- Attempt: an integrity-checked in-place append to the `ABC-017` row's **`Status` cell only**,
  asserting 37 table lines before and after, the row's pipe count unchanged, the append string
  pipe-free and newline-free, and **all 36 other table lines byte-identical by md5**.
- Result: `Permission for this action was denied by the Claude Code auto mode classifier.`
- **Verified afterwards: `plans/traceability.md` is UNTOUCHED** — `git status --short` shows only my
  two queue records, and the file still carries 37 table lines.

**The Orchestrator makes this write.** The full intended append text is preserved verbatim in the
`artifact-ref` note `20260812T131000Z-security-nfr-artifact-ref-trace-row-denied-4b6c7e02` in this
same directory, so it can be applied without re-deriving anything.

## Nothing merged, nothing deployed

No merge, no push, no deploy, no `git checkout main`. `production_requires_human_confirmation` is
`true` and a human holds both keys. `ZERO` production lines and `ZERO` test lines were written by
this gate; `src/` is byte-identical to where I found it
(`src/history-pane.ts` md5 `54fd4346dcc1a0060c4e66ae0149265d`, `src/` aggregate
`cf797c12d9033317692911a0ba6ab92b`).
