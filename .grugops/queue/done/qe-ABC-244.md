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

## Result

**QE verdict: PASS** at `25282ad4` (base `d59e3194`). ALONE for A8/A9. PREREG + frozen list committed `5b4961e1` before any head run.
Notes (task `qe-ABC-244`): decision `…4fe9bfe1`; A6/A7 `…40805011`; A8/A9 `…3c2ac5a2`; findings `…98d5d2e4`; artifacts `…f3cb5ac7`.
- **A6 MET.** 24 frozen mutants (SE's 9 + SE-241 M2/M4/M5/M8 + 11 QE), sha256 `9cbf279f…2fdb`. The 4 U1 rows: 0 DIFF B vs H.
  The 4 U2 rows are unchanged (step 100) and SAME. Controls 18/18 at both. The SE's 9-mutant table is re-confirmed row for row.
- **A7 MET.** Every U1 row has fewer nodes; all other rows are node-equal. 1 014 507 → 223 432 (−791 075).
- **A8 `N8-LANE` MET.** H−B CPU −1.145 s [−1.220, −1.070]; twin R 0.250 s, admissible. H−B wall −0.725 s.
- **A9 `G8`.** H 9.25 s, B 9.69 s, H−B −0.44 s; 6/6 rc 0, load1 ≤ 1.94. `NFR-008` MET. Design target 9.4 s MET, so tranche 2 does not fire.
- **A10 green.** lint, typecheck and build exit 0. `npm test` 2 322/2 322 ×6, 0 skipped. skip-integrity "No findings."
  **A3–A5 (spot):** counts and name hashes are equal per file; the diff is 2 step literals + 4 comments in the 2 files.
- **SE-244-a: CONFIRMED and widened (`QE-244-a`, LOW, no action here).** With U2 at 1 000, CLI A4 loses {F230, QSEAMRAW}
  and A7 loses {F230, QSEAMRAW, QPRIOROFF, QMATCH3, QTRIM1}. U2 at 100 is right. This is carried for R4 tickets and tranche 2.
- **INFO:** QE-244-b (the cli ABC-230 A3 row kills none of 24); QE-244-c (9 survivors at both trees, other-file coverage
  `UNKNOWN - verify`); QE-244-d (9.25 s is 0.15 s under target, inside window drift); QE-244-e (twin near the 1.5 % edge);
  QE-244-f (the U1 comment stays true).
- **UAT:** the waiver measurement is empty, so the QE verdict signs.
- **Security/NFR owes:** the `NFR-008` state on H; the first admissible `F` for the two-file set (R 0.250 s).
- STOP: none.

### Trace row (10 cells, header order)

| ABC-244 | Time-blind ABC-230 virtual-clock rows take step 1 000 on both surfaces; ABC-241 rows keep 100 (they lose seam-fault kills at 1 000); no census unit | EPIC-010 | ADR-0046 § Addendum 2026-10-30 R1–R3 | NFR-008 G8 MET H 9.25 s (B 9.69 s, target 9.4 s MET); N8-LANE MET −1.145 s CPU; R1 census A1 recorded | grugops/ABC-244 @ 25282ad4: src/cli.test.ts, src/uci-session.test.ts (test-only) | npm test 63 files / 2 322 pass ×6, skips 0; QE parity 24 mutants, 0 U1 rows differ; nodes −791 075; names byte-identical per file | QE PASS (UAT waived: 0 production lines; the QE verdict signs) | — | In Review → In Security/NFR (branch, not merged) |
