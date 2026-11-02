# qe-ABC-268-p2 gaps (part 2): QE-268-a/b/c CLOSED; QE-268-p2-a LOW (the host was not alone for games 24-64 of the read and 2-3 of the smoke); QE-268-p2-b/c/d/e INFO; QE-268-d/e/f/g INFO carried

QE/E2E, task `qe-ABC-268-p2`, PREREG `…e2d24e3d`.

## Closed
- **`QE-268-a`, `QE-268-b`, `QE-268-c`** (part 1 `…aa73c424`): closed by SE's rows (`se-ABC-268-fix` `…f4a8852b`); QE's own plants QP2-QP6 are each red on them and head is green (rows note).

## LOW
- **`QE-268-p2-a` (Orchestrator): the host was not alone for part of the read.** The harness's sampler (`pgrep -f /vitest`, logged in `raw/a6/host.log`, `raw/smoke/host.log`) counted 2-3 foreign vitest processes during 20:09:37-20:18:47Z (A6, after games 24-64; 24 of 126 samples) and 20:29:32-20:30:22Z (smoke, after games 2-3). They were not QE's and did not take the host lock. Before and after, the count was 0 (the long-running `fake-oidc` service does not match). The ticket asks for the host ALONE. Impact, bounded: load1 at most 3.61 on 24 cores; latency max 106 ms (A6) and 502 ms (smoke), 0 time losses; the candidate scored 21.5 / 40 inside the window and 36.5 / 60 outside it. It did not lift the result. QE does not void or re-play the read (`ADR-0061` F-rules; a re-play of a pass is a second look). To close: the dispatcher keeps every test run under the host lock while a timed read runs.

## INFO
- **`QE-268-p2-b` (harness, carried class of `QE-264-p2-b`):** `rating.ts d` prints `state: NEUTRAL` at 58.0. The per-change rule reads GAIN by the bar alone.
- **`QE-268-p2-c`:** the smoke's cutechess-cli Elo error prints `nan` at 8/2/0 (no draws). The smoke bar is the score, so nothing is read from it.
- **`QE-268-p2-d` (Orchestrator / Architect):** if ABC-268 merges, S′ pools to 26.0 / 30 = 86.7 % > 85 %, so the upward re-pin trigger fires. Reported, not acted on.
- **`QE-268-p2-e` (Orchestrator):** per the brief, the base is `ca6e8506`, the merge-base, not today's `main`. `main` carries `ABC-265` (`src/transposition.ts`, node-equal at `Threads 1`), and its tree merged with this branch is untested by QE: `UNKNOWN - verify`. Run `npm test` (and lint / typecheck) on the merged tree before the merge commit lands.
- Carried from part 1: `QE-268-d`, `QE-268-e`, `QE-268-f`, `QE-268-g` (INFO, unchanged).
