---
subtask: qe-ABC-230
role: qe-e2e
ticket: ABC-230
ref: .grugops/context/qe-ABC-230/
branch: grugops/ABC-230 @ dad753dc (code 2fbcb380; base c0698ddd, src-identical to main); QE commits on a new grugops/qe-ABC-230 from it
width: ALONE (games)
---

# QE ABC-230: verify independently, then read A7 (the smoke pair)

## Read
- The ticket, ADR-0054 (ACCEPTED), SE notes `se-ABC-230/…5cf9cecd`, `…a836f535`, `…f3c542f4`, `…4ee731d9`; EPIC-010 § The
  merge rule (S-1..S-4, extension to 20 below 3.0); how qe-ABC-235 / qe-ABC-225 ran (host checks, thermal stop).

## Do
- PREREG first, sealed and committed before any game.
- Re-run the identity (no keys / [] / clock 0 node-equal to base) and spot-check A1, A2, A3 and A8 yourself. Plant one fault and
  see it go red. Gates: lint, typecheck, `npm test`, build; G1, G5 (real clock), G8; rule on G9 (`createLevel` changed;
  the LEVELS / DEFAULT_LEVEL / HARD_CEILING_MS lines unchanged) against the ticket's wording.
- **A7, the smoke pair, ALONE:**
  - D: `d dad753dc c0698ddd <out> --budget-ms 1500 --rounds 5 --concurrency 1`.
  - R: `r dad753dc <out> --elo 1910 --rounds 5` at **`--concurrency 1`**. This is the Orchestrator's delivery call, a deviation
    from the epic's width 2: width 2 tripped the 85 °C stop in qe-ABC-225. Record it.
  - S-1..S-4 as the epic states, with the repetition-ending count (candidate vs base where available).
  - Host: `pgrep -x cutechess-cli` empty before start; no foreign vitest (`pgrep -f "[/]vitest"`) at start, otherwise wait-clear.
    If a foreign vitest appears mid-run, record it, and void and re-run only if the thermal stop fires. Thermal stop:
    Tctl median > 85 °C over a run → STOP and report.
  - Tool paths come from the env file named in your spawn prompt. Never record them.

## Fences
- No src/, tools/ or data/ edits. Never push, force, amend or rebase. Never merge into main. No board edits. Linters only
  via `npm run …`; **never a bare `npx`**. **No host paths in any commit**, intermediate ones included.

## Publish
- Seal notes (task `qe-ABC-230`) with `at` from `date -u`: PREREG, readings, verdict (PASS / PASS_WITH_GAPS / FAIL).
  Commit on your branch. Write `## Result` plus a 10-cell trace row into this brief, then move it and its claim.md to done/.

## Result

**2026-10-30, QE/E2E. Verdict: PASS_WITH_GAPS, with no blocking gap. Mergeable under `EPIC-010` § The merge rule. Under
Test note 3 and the 2026-10-22 ruling, this verdict signs UAT.**

- **Branch:** `grugops/qe-ABC-230`, from `dad753dc`. The records are at `20a6be0a`, and this brief is in the commit after it. QE merged nothing, pushed nothing, and made no `src`, `tools` or `data` edit.
- **Notes:**
  - PREREG `20261030T051104Z-qe-e2e-decision-a8dbb76d`, committed in `56f81918` before any check or game.
  - Checks `…-observation-af1628d2`.
  - A7 `…-observation-a715c1d8`.
  - Verdict `…-decision-ba5a249a`.
  - `readContext` reads back 4.
- **Identity:** reproduced byte for byte on QE's own trees. `choose`, `[]` and `clock0` are each 2 408 rows, `8a50e586…`. The doors and levels are equal too. `nonvac` differs on 248 of 602 rows, and 0 rows are impure.
- **Spot checks** (QE's own Q/R fixtures, both colours): A1, A2, A3 and A8 pass 45/45 in v2.
  - v1 had 5 FAIL rows, all from 2 wrong QE predicates. They are kept, fixed and explained, and no product fault was involved.
  - **Planted fault** (`level-seam.ts` ignores `keyHistory`, in a scratch copy): red. `src/cli.test.ts` had 2 failed, and 4 spot rows failed.
- **Gates:**
  - lint, typecheck and build exit 0. `npm test` passed 2 178/2 178, the skip count is 0, and `No findings.`
  - G1 54/58. G5: level 5 30/30, max 3 001 ms. G6: 8 = 8 and 10 = 10. G7: growth 0 MiB. G8: 8.48 s.
  - **G9 MET (ruling).** The named `LEVELS` / `DEFAULT_LEVEL` / `HARD_CEILING_MS` lines are byte-identical. `createLevel` changed only by an optional parameter, and without it the level is base's node for node. G9 does not ask for an empty file diff.
- **A7, ALONE at width 1:**
  - D 4/3/3 = **5.5/10**, Tctl median 73.50 / max 75.8 °C, 37.6 min.
  - R 8/2/0 = **8.0/10**, Tctl 73.75 / 77.6 °C, 27.6 min.
  - 0 faults, 0 time losses, 0 foreign vitest and no frequency fall. **S-1..S-4 MET**, and no thermal stop.
- **Repetition endings:**
  - D: 1, played by the candidate at −2.05 (Bg8 at 0.00). Base, at +2.08, walked into it.
  - R: 0, against base's R(close) reference of 1 in its rounds 1–5 and 7 of 200 overall.
  - Ledger row: pooled R 8.0/10 = 80.0 %, with the flag not evaluable.
- **Gaps:**
  - **QE-230-a (MEDIUM, design; Architect / BA/PM).** On the blunder path (levels 1–4), the root move that makes the third occurrence is not scored 0, because no child search checks its own root. A1's hand-off wording is met.
  - QE-230-b (LOW): R at width 1, recorded.
  - QE-230-c (LOW): D wall over the epic's estimate.
  - QE-230-d (LOW): scan cost read only via S-2.
  - QE-230-e (LOW): QE's own v1 predicates.
  - QE-230-f (LOW): node ports, because the sandbox refuses `bash`/`source`.
- **Queue:** the guard refused writing into the main checkout's queue. The claim was the atomic `mkdir claimed/qe-ABC-230`, and the brief moved to `claimed/` there. This tracked `done/` copy and its claim.md are on the QE branch.
- **STOP:** none.

### Trace row (10 cells, header order)

| ABC-230 (qe-ABC-230) | QE PASS_WITH_GAPS at dad753dc: identity reproduced (2 408 rows ×3 = base; nonvac 248 differ); spot A1/A2/A3/A8 45/45 (QE fixtures); planted fault red (cli.test 2 failed); A7 D 4/3/3 5.5/10, R 8/2/0 8.0/10 at width 1, S-1..S-4 MET; repetition endings D 1 (candidate) / R 0; G9 MET on named lines; QE-230-a MEDIUM blunder-path root repetition (non-blocking) | EPIC-010 | game history into the search (CLI + UCI), ADR-0054 | NFR-004 G5 level 5 max 3 001 ms; NFR-005 G6 8 = 8, 10 = 10; NFR-008 G8 8.48 s; NFR-009 G7 growth 0 MiB; G1 54/58; heat: Tctl median D 73.5 / R 73.75 °C (width 1) | grugops/qe-ABC-230 @ 20a6be0a (+ this brief; on grugops/ABC-230 dad753dc; code 2fbcb380) | npm test 63 files 2 178/2 178, skips 0; deep lanes PUZZLE 18/18, levels 44/44, engine 77/77, transposition 26/26; .grugops/context/qe-ABC-230/notes/ (4) + raw/ | signed (QE verdict PASS_WITH_GAPS, no blocking gap) | — | In Review → ready for the Orchestrator's merge (smokes go stale if another value-changing merge moves main first) |
