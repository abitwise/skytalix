---
subtask: qe-ABC-242
role: qe-e2e
ticket: ABC-242
ref: .grugops/context/qe-ABC-242/
branch: new grugops/qe-ABC-242 from grugops/ABC-242 56058203 (worktree .claude/worktrees/qe-ABC-242); base 4387d4e8, head 6884d61a
width: ALONE: no other hop runs; timing reads with the host clear
---
# QE ABC-242 (S, P3, S2, no smoke): blunder-path third occurrence scores 0
## Read
The ticket page (A1–A8, NFR triggers R1–R4, Test notes), ADR-0054 § Proposed amendment 2026-10-30 (ACCEPTED), ADR-0032 d1/d2,
ADR-0046 § Addendum R1–R4, and se-ABC-242's sealed notes and raw/probe/ on the branch (.grugops/context/se-ABC-242/).
## Do
- PREREG first: commit your plants and harness before any head run.
- A1–A3 against the REAL base tree (4387d4e8, scratch worktree), not only the SE's test-local `base()` copy (SE-242-e). Confirm that copy matches base's `blunder`.
- Plants on scratch copies only: at least the two-match → one-match plant (A2 must go red), the clock bound dropped (A3 red), the skip turned into a search (A1 child count red), and a plant on the 100 cap. Report survivors; judge the SE's M7/M8 equivalence claims (SE-242-c).
- A4: rerun both rows; confirm one step across all three callers (R3).
- A5, A6 identity, A7 gates: lint, typecheck, build, `npm test` ×3 with skips 0 and skip-integrity, G9 bytes, ENGINE_DEEP levels lane and LADDER_DEEP short once each.
- R1 census: check the SE's lines and the step-10 choice (ABC-244 condition 2).
- G8, ALONE, order b h h b b h, wait-clear by `kill -0`: report the medians. Head > 9.6 s fires tranche 2 (report only). Head > 10 s: STOP.
- SE-242-a: a short reading of whether the probe's base d8e8 (−1020 now, −1013 recorded) moved with a known merged ticket. Time-box it to 15 min; UNKNOWN is fine.
- Verdict PASS / PASS_WITH_GAPS / FAIL. UAT is owed (production lines) and your verdict signs it.
## Fences
- No edits to src/, tools/, data/ or the board. No push, force, amend, rebase, or merge into main. Never bare npx or npm exec.
- Waiting: poll an output file or `kill -0 <pid>`; never `while pgrep -f …`. Never put vitest on the same command line as a wait (QE-243-a).
- Thermal stop: Tctl median > 85 °C.
- Scratch `qe-242/`.
## Publish
Sealed notes (task `qe-ABC-242`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
