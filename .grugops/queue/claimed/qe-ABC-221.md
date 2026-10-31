---
subtask: qe-ABC-221
role: qe-e2e
ticket: ABC-221
ref: .grugops/context/qe-ABC-221/
branch: new grugops/qe-ABC-221 from grugops/ABC-221 fb3696fa (worktree .claude/worktrees/qe-ABC-221); base d58f2d77, head c48a6f83
width: ALONE for timing, the deep lanes and the probe; only a records-only Security/NFR hop runs beside you (no vitest)
---
# QE ABC-221 (M, P3, milestone 2): uci-clock-mode over UCI TimeMode; HARD_CEILING_MS 60 000
## Read
The ticket page (A1–A12, NFR triggers, Test notes 1–5), ADR-0052 (ACCEPTED; D3–D8), ADR-0045 § AMENDMENT A3, ADR-0044 D5,
ADR-0046 § Addendum R1–R4 and § Ruling 2026-10-31; se-ABC-221's notes and raw/ on the branch; qe-ABC-220's notes (A14a/A14b split; QM4).
## Do
- PREREG first: commit your plants and harness before any head run.
- A1–A12: grade each with its reading.
  - Plants on scratch copies: at least QM4 in both modes, the cap swapped between modes, the clamp left at 32 000 (A7's real row must go red), and no-token → 59 500 instead of T. Report survivors.
- Check that `simple-tournament` and `level` are identical to base: ABC-220's rows unchanged; the `level` budgets under a 60 000 clamp.
- Check the one removed row and the re-pins, which sit outside the ticket's files (SE-221-c/d).
- A7, gates: lint, typecheck, build, `npm test` ×3 with 0 skips and skip-integrity.
- Deep lanes, ALONE, once each: ENGINE_DEEP A10 (≤ 60 000 ms wall; ≤ 16 MiB, growth ≤ 1 MiB) and UCI_DEEP. Never during G8.
- A11 row 3 (A14b): QE's probe, run once in your ALONE window, never through vitest.
- R1 census: check the SE's lines.
- G8, ALONE, order b h h b b h, wait-clear by `kill -0`: report the medians. G8 was 9.41 s at ABC-242. Head > 9.6 s fires ABC-244 tranche 2 (report only). Head > 10 s: STOP.
- SE-221-a: confirm the A6 arithmetic (17 205 vs 117 735 ms) for BA/PM's fold.
- Verdict PASS / PASS_WITH_GAPS / FAIL. UAT is owed; your verdict signs it.
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait.
- Thermal stop: Tctl median > 85 °C.
- Scratch `qe-221/`. Keep it small; remove your scratch trees when done.
## Publish
Sealed notes (task `qe-ABC-221`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
