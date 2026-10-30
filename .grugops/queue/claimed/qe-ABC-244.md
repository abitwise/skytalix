---
subtask: qe-ABC-244
role: qe-e2e
ticket: ABC-244
ref: .grugops/context/qe-ABC-244/
branch: grugops/ABC-244 @ bcd64f1a (code 25282ad4; base d59e3194); QE commits on new grugops/qe-ABC-244 from bcd64f1a (worktree .claude/worktrees/qe-ABC-244)
width: ALONE (A8 N8-LANE, A9 G8)
---
# QE ABC-244: A6–A10 (kill sets, node census, N8-LANE, G8)
## Read
The ticket (A1–A10, the step-rule word, triggers), ADR-0046 § Addendum 2026-10-30, se-ABC-244 notes (`…f1e84d64`, `…ee17f704`,
`…1b63ff56`, `…497faf89` — the QE handoff, frozen mutants `raw/probe/frozen-mutants.json` sha256 a624b9f5…1c45).
## Do
- PREREG first (freeze the mutant list ≥ the SE's 9; add SE-241 M2/M4/M5/M8 if you can reconstruct them), sealed and committed before any head run.
- A6 kill-set parity base vs head on the 4 changed rows; list the 4 U2 rows unchanged. A7 node census (expect 40 → 4 reads per search).
- A10 gates via `npm run …`; A3–A5 byte rules spot-check.
- ALONE, wait-clear (poll `kill -0`, never `while pgrep -f`): A8 N8-LANE on the two files (`NODE_OPTIONS=--max-old-space-size=128`;
  the guard refuses 400), A9 G8 interleaved b h h b b h, base d59e3194, head 25282ad4. Design target ≤ 9.4 s (miss ≤ 10 s does not
  fail; > 9.4 s opens tranche 2 — report it); > 10 s → STOP and report (owner).
- Rule SE-244-a (U2 CLI rows' F230 kill depends on depth).
## Fences
No src/, tools/, data/ edits. Never push, force, amend, rebase, merge into main. No board edits. Never bare npx/npm exec. No host
paths. Scratch `qe-244/`.
## Publish
Sealed notes (task `qe-ABC-244`, contextRoot = worktree), commit, `## Result` + 10-cell trace row here, brief + claim to done/.
