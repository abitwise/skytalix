---
task: wave-2026-09-25
subtask: qe-ABC-095
role: qe-e2e
workflow: agent-factory/workflows/05-pr-quality-gate.md
ticket: plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md
ref: .grugops/context/qe-ABC-095/
enqueued_by: orchestrator
enqueued_at: 2026-10-12T00:00:00Z
branch: grugops/ABC-095-book-before-engine (tip 2307fc11; code 09740ea4 + 521a8513; main merged in at 75606020)
---

# Subtask: QE on `ABC-095` — the book in front of the engine. You are the ONLY grugops hop running (width 1).

Build notes: `.grugops/context/{ticket-to-pr-ABC-095,wire-ABC-095}/notes/` and `probe/` on the branch. Contract: the amended ticket page, ADR-0037 § Addendum 2026-10-12, ADR-0036 § S1, the S3 checklist (`secnfr-ABC-095-placement/notes/…a096cf43`).
1. **A1–A7 independently**, from your own readings, including `CLI_DEEP` (`CLI_DEEP=1 npx vitest run src/cli.real-engine.test.ts`; check no temp copy is left behind). **A7 caveat:** the A7 child row alone stays green on an unwired build (the real search's reply to 1. e4 is also a book move) — confirm which tests DO catch an unwired build (the SE names ABC-043 A1 pin, the re-targeted children, A5's stream half), and say whether that is enough or A7 needs a sharper Given (BA/PM's to amend, not yours).
2. **Break it, your own plants** (scratch copies outside the repo): wiring removed; decorator that always searches; decorator that searches AND returns the book move; warn to stdout; warn twice; `readBookFile` reading a different path; probe built per move instead of once; ABC-119 copy with `data/` present, with a linked `src/`, and the copy left behind on failure; ABC-119 A6's plant against the amended lane. Say which tests catch each.
3. **The re-targeted children** (`black`, `random`, `mate`, `engineThrows`, `engineForeign`, `colourBlack`, `colourWhite`, `resigns`, `quits`, `renews`): confirm each still exercises its criterion with the double at `./book-engine.ts`, and that `mate` is no longer book-dependent (the Architect measured a 40 %/run flake under the naive wiring) — run it ≥ 20 times.
4. **SE readings to rule on:** (a) the copy rule vs `src/__snapshots__/` (a directory) — is the SE's reading (no symlinks; every non-directory entry a regular file) the honest one? Name it as a gap for BA/PM/Security if the page wording needs fixing; (b) "both halves pinned" on ABC-043 A1.
5. **N8-LANE:** two costs are `UNKNOWN - verify` (the 10 children now load the real engine closure; ABC-119's default-lane row now builds the tree copy). Read them under ADR-0035 (decision 2 narrow sets, A1/B1 admissibility, pre-registered before the first window, one re-attempt, no pooling) for `src/cli.test.ts` and `src/cli.real-engine.test.ts` (default lane) against base `0974102f`; grade against each set's floor and the 650 ms per-ticket bar.
6. **Timing criteria owed before Done:** A2 (≤ 30 ms COLD, first call in a fresh process) and the R3 warm miss bar (one warm-up hit, 200 timed calls, max ≤ 5 ms, median/p99 recorded), via the SE's instrument (`node .grugops/context/wire-ABC-095/probe/time.ts "$PWD" cold-hit` and `warm-miss`) or your own. Gate: thermal 0, NO foreign vitest (`pgrep -fl vitest` — the `oeselg-labs/platform/repos/product-template` and grugops-kit suites from other sessions void a reading), AC power, load1 logged. Wait up to ~30 min total for windows; if none, record NOT READ — never estimate.
7. Measure the UAT-waiver reading (it will be non-empty: production lines; the owner's UAT word is owed).

## Fences
Do not touch `src/`, `tools/`, `data/`, `AGENTS.md`, ADRs, `plans/board.md`; revert every plant. Own worktree on `grugops/qe-ABC-095` off `2307fc11` (`node_modules` symlinked into the worktree root only). Never `update-ref` the Engineer's branch. No `--force`, `-D`, `--amend`, `reset --hard`. Never merge or push. `diff` is a git wrapper; use `/usr/bin/diff` or `cmp`. A `kind: decision` `by: qe-e2e` verdict note (refs ABC-095) PASS / PASS_WITH_GAPS / FAIL, observation notes + raw TSVs under `ref:`, a trace row at the END of `plans/traceability.md`, § QE on the ticket. Queue: `mkdir .grugops/queue/claimed/qe-ABC-095`, then FLAT `.grugops/queue/done/qe-ABC-095.md` and `.claim.md`, uncommitted; `rmdir` the claim dir. End commits with a `Co-Authored-By:` trailer naming the model you are. Report tip, verdict, each criterion with reading, plant table, children check, N8-LANE table, A2/R3 readings or NOT READ with window logs, gaps.
---
done_at: 2026-10-12T15:16:00Z
branch: grugops/qe-ABC-095 (worktree ../wt-qe-ABC-095, off 2307fc11)
tip: e1444f23 (pre-registration 386f8e6f + erratum 536e2d5e before the first window; notes, probe, windows, trace row, ticket § QE e1444f23; no code). Trial merge with main 54381495: clean.
result: PASS_WITH_GAPS. A1-A7 MET, each re-read by QE: A1 200 probes 0 searches; A2 cold hit max 8.300 ms <= 30 ms (10 fresh processes, clean window t-w1 14:37:16Z, no vitest, thermal 0, AC, load1 3.66); A3 4 misses 1 search 0 warnings + R3 warm miss max 0.0149 ms <= 5 ms (3 x 200); A4 real-child frames ply 2 = ply 4; A5 3-ply book-absent child 1 warning on stderr only; A6 0 lines; A7 call diff = engine: only, child x10 all book replies. CLI_DEEP 9/9, 0 copies left. Gates green (58/1780, skip 0). 18 plants: all caught but P6b (cwd-relative readBookFile) and P10a/P10b (copy leaks); ABC-119 A6 M1/M2 red CLI_DEEP A1 alone, default 1780 green. Children x20 green (naive wiring 4/10 red); default lane reads the book 0 times. N8-LANE NOT READ: 4 pre-registered windows VOID (foreign grugops-kit vitest on S1; idle orphan oeselg-labs/platform process on S2), no pooling. UAT waiver does not apply (3 production files in the pair); owner's UAT word owed. Gaps: QE-095-N8 MEDIUM; -a/-b/-c/-d/-e/-h LOW; -f/-g/-i INFO. Next: In Security/NFR (S3). Decision .grugops/context/qe-ABC-095/notes/…-ee8775a2.
