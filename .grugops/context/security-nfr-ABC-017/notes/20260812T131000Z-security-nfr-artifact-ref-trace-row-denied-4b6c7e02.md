---
id: 20260812T131000Z-security-nfr-artifact-ref-trace-row-denied-4b6c7e02
kind: artifact-ref
by: security-nfr
at: 2026-08-12T13:10:00Z
verified_by:
confidence: high
refs:
  - security-nfr-ABC-017
  - ABC-017
  - plans/traceability.md
  - 20260812T130500Z-security-nfr-decision-verdict-and-risks-9a4e28f1
  - 20260812T102500Z-qe-e2e-observation-trace-update-blocked-2b6f04c9
supersedes:
---

# The `plans/traceability.md` append this gate owed, DENIED by the host classifier — preserved verbatim so the Orchestrator can apply it

> Hand-authored; `scripts/context-io.ts` is absent here and in the kit. **Not a `finding`.**

## What happened

The Security/NFR role owes `plans/traceability.md` the NFR IDs reviewed and the gate result. I
attempted that write and **the host permission classifier denied it** — the same denial QE hit twice
one hop ago. Per the brief I **reported it and stopped**; I did not retry through a different tool,
and I did not route around it.

**Verified after the denial: the file is UNTOUCHED.** `git status --short` lists only my two queue
records, and the table still has 37 lines.

## The integrity protocol the attempt used, for whoever repeats it

Not a blind append — the script asserted, and would have refused on any failure:

1. exactly **37** table lines before, and 37 after;
2. exactly **one** row starting `| ABC-017 `;
3. the `ABC-017` row's **pipe count unchanged** (12 fields) — so no cell boundary moves;
4. the append string contains **no `|` and no newline** — checked before writing;
5. **all 36 other table lines byte-identical by md5**, hashed before and compared after.

Only the **`Status` cell** (the last field) is appended to. `Code (PR/files)`, `Tests`, `UAT` and
`Release` are not touched — this gate wrote zero code and zero tests, and UAT is deferred, not
passed.

## The append text, VERBATIM

Append the following to the end of the `ABC-017` row's `Status` cell, preserving the leading space:

```
 **SECURITY/NFR GATE 2026-08-12 (task `abc017-secgate-2026-08-12`, subtask `security-nfr-ABC-017`, Workflow 05): PASS_WITH_RISKS. NFRs reviewed: NFR-002 (incl. its `O(window)` structural premise), NFR-008 `N8-LANE`; ASVS L1, `block_on` high, `compliance_regime` [] so no Compliance Officer hop.** `A12` RE-DERIVED ON DELIVERED CODE, not inherited — two independent samples, own out-of-tree harness, discarded warm-up, 11 rounds, cell order rotated, medians of per-round means, builders and `parseFen` outside every clock, checksum against elision: **38.97/39.33 µs @40, 67.12/67.56 @120, 72.93/74.05 @300 — 0.260/0.262x, 0.447/0.450x, 0.486/0.494x of the 150 µs bar, part 1 MET**; **three within 1.871x/1.883x of 3x, part 2 MET**; **part 3 (`A11` spied counts) MET on this gate's OWN instrument** (a `node:module` load hook wrapping delivered `parseFen`/`toSan`/`makeMove`): `parseFen` = 1 at every length incl. 0 plies, `toSan` = rendered plies exactly (0/1/3/15/16/16/16/16) and never > 16, `toSan` arity exactly 2, 8 rows at every length. Worst 74.12/74.90 µs @378 plies (0.494/0.499x). **Apple M3 (Mac15,13), 8 logical cores, Node v24.12.0, Darwin 25.5.0 arm64; `UNKNOWN - verify` on any other hardware.** **REPLAY COEFFICIENT: the two instrument FAMILIES DISAGREE and this gate reports the band rather than smoothing it — 4.86/4.92 ns/ply by total-render regression (intercept 43.95/43.96 µs, R² 0.99960/0.99933) against 6.93/6.98 ns/ply by replay-loop isolation (intercept 1.93/1.83 µs, R² 0.99961/0.99963). Each family's INTERCEPT reproduces across roles (BA/PM 1.56 µs, Engineer 46.45 µs); the SLOPES do not, and this gate CANNOT attribute it — the Engineer's 6.58 ns/ply is 26% above this gate's same-family 4.86, and BA/PM's 7.42 is 6.6% above this gate's same-family 6.93.** Conclusion UNCHANGED on every figure: at 300 plies the replay term is 1.5–2.1 µs, ~2–3% of the pane's ~73 µs, and the replay term ALONE would not reach 150 µs until ~21,600–30,900 plies. **`NFR-002`'s STRUCTURAL PREMISE RE-VERIFIED BY MODULE-GRAPH CLOSURE, NOT BY `grep`: PRODUCTION runtime importers of `src/history.ts` = ZERO** — a load recorder over all 14 non-test production roots loads 14 modules and `history.ts` is not one; the pane's own closure is exactly 7 (`apply`, `fen`, `history-pane`, `legal`, `moves`, `position`, `san`). Positive controls fired, and the instrument was ARMED against a module that does pull it. **TEST-file runtime importers = FOUR** (`history.test.ts`, `status-panel.nfr.test.ts` — `ABC-016`'s, already on `main` — `history-pane.test.ts`, `history-pane.nfr.test.ts`), confirming QE and correcting the ticket's bold THREE; rule stated before the count: an importer is any file whose evaluation evaluates `history.ts` (static value, bare side-effect, re-export, dynamic `import()`, or `vi.mock` + `importOriginal()`), and `import type` is NOT one under `verbatimModuleSyntax`. Zero re-exports and zero extensionless paths, checked. **REQUIRED FIX (medium, NOT merge-blocking): `A11`'s structural guard is BLIND in two of five directions.** `WDYNIMP` (`void import("./history.ts")`) and `WBAREIMP` (bare `import "./history.ts";`) each SURVIVE 740/740 while genuinely pulling the module — this gate's load probe catches BOTH. Owner **BA/PM (criterion wording) + the Engineer (guard), at the `G1`/`G2` fixture hop**; trigger: the next edit to `src/history-pane.nfr.test.ts`, or `ABC-019`'s cl. 9f re-gate, whichever first. **ACCEPTED RISK — the supplied-FEN width/compute path, and it is BOUNDED.** `initialFen` is the one externally-supplied input reaching this pane (`EPIC-006` owns startup); an out-of-range `fullmoveNumber` renders a row wider than `HISTORY_COLS` — measured, the excess is **bounded at +19 chars (40 total)** because `String(double)` is at most 23 chars, so it is NOT the unbounded-string class `ABC-018`'s gate priced; and pane compute tracks FEN LENGTH, reading 141.50 µs at 1e5 digits and **270.45 µs at 2e5 digits — 1.80x the 150 µs pane bar, yet 1.69% of `NFR-002`'s 16 ms frame budget**. `parseFen` accepts `Infinity`. Owner **BA/PM at `ABC-010`** (the ticket the module docblock already names for FEN bounds), with **Architect/Design at `EPIC-006`** as the checkpoint if `ABC-010` has not landed; trigger: the first time a FEN reaches the process from outside it. **L1 default severity high is OVERRIDDEN to accepted-risk with reason:** the gap is in `src/fen.ts`, pre-exists this ticket, is unreachable today (no entry point until `EPIC-006`), and is already recorded as an ACCEPTED LIMITATION in the delivered module docblock. **SECURITY: no injection surface — byte audit over a 300-ply pane reads 0 ESC (0x1B), 0 other C0, 0 DEL (0x7F), 0 above-ASCII, 8 rows, all exactly 21 chars.** The ticket's "no security trigger" is CONFIRMED by measurement rather than accepted. **`HISTORY_COLS` EXPOSURE RE-DERIVED AND STRENGTHENED: `WCOLS24R` (padded RIGHT) SURVIVES 740/740** — QE measured 734/734, so `ABC-027` merging did NOT close it — **and `WCOLS24M` (widened MIDDLE) is KILLED ×7**, reproducing QE exactly. `HISTORY_COLS` HELD at 21; nothing widened, no criterion proposed, `ADR-0009`/`ADR-0010` NOT re-opened; the unhomed Architect question stays unhomed. **Baseline re-run before any work and re-verified after: lint/typecheck/build 0, 740/740 on 26 files, skip 0, `src/history-pane.ts` md5 `54fd4346dcc1a0060c4e66ae0149265d` asserted after EVERY mutate-and-restore, `src/` aggregate md5 `cf797c12d9033317692911a0ba6ab92b` unchanged, `git status -- src/` empty.** Four mutants built and reverted; ZERO production lines and ZERO test lines written by this gate. **TWO INSTRUMENT ERRORS OF THIS GATE'S OWN, CORRECTED BEFORE REPORTING RATHER THAN HIDDEN:** a first `WCOLS24R` bound `.padEnd` to only the second template literal and emitted 30-char rows (a malformed mutant, discarded, rebuilt); and a first `A11` counter asserted a `makeMove` identity `A11` never claims (`legalMoves` calls `makeMove` internally), which would have reported a FALSE MISS. **UAT: DEFERRED → `EPIC-006`, EXPLICITLY NOT PASSED** — `quality.ui_e2e` is `ui-or-critical-path` and there is no runnable surface: no CLI entry point, `Dev / run` and `E2E` are `UNKNOWN - verify` in `AGENTS.md`, and this pane returns rows as a value and writes nothing. No E2E was invented. **Board move REQUESTED, NOT TAKEN — `In Security/NFR` → `Ready for UAT`; `plans/board.md` is the Orchestrator's.** Consequence stated not assumed: In Security/NFR 1/2 → 0/2, Ready for UAT 0/4 → 1/4, both inside their WIP limits. **NOTHING MERGED, NOTHING DEPLOYED — a human holds both.**
```

## One caution for whoever applies it

The block above is **one single line** in the file. It is reproduced inside a fenced block here only
so it survives as a note; do **not** introduce the line breaks your editor may show. It contains no
`|` character by construction — that was asserted before the write was attempted, and it is what
keeps the row's 12 fields intact.
