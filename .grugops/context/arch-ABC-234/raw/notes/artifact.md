# arch-ABC-234 artifacts: `ADR-0065` (PROPOSED, premise not met on `main`) and the reproducible probe

- `memory-bank/50-decisions/ADR-0065-see-orders-losing-captures-after-the-killers-in-the-full-width-search-ordering-only-behind-a-test-only-off-door-pair-and-its-pay-premise-is-not-met-on-main.md`: design of record S1m, decisions 1–12, falsifiers F1–F8 (F4 fired 2026-11-03), alternatives, consequences, rollback.
- `.grugops/context/arch-ABC-234/raw/probe/`: `patch_post268.py` (unchanged), `patch_234.py`, `probe.ts`, `job.sh`, `batch1–3.sh` (pre-registered), `patch_diag_q1.py`, `job_diag.sh` and `batch4.sh` (DIAGNOSTIC), `out/` (42 jobs) and `out4/` (8 jobs), plus `README.md`. Apply both patches to `git archive <main> src package.json` to reproduce. Every count is deterministic.
- No `src/` change was committed. The scratch copies were deleted after the readings.
