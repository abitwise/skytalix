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
