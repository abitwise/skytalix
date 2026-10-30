---
id: 20261030T230742Z-qe-e2e-decision-4fe9bfe1
kind: decision
by: qe-e2e
at: 2026-10-30T23:07:42Z
verified_by: 
confidence: high: A6, A7, A8, A9, A10 run in this hop as pre-registered; A3-A5 spot-checked
refs:
  - qe-ABC-244
  - ABC-244
  - ADR-0046
  - ADR-0035
  - NFR-008
  - N8-LANE
  - EPIC-010
  - ABC-230
  - ABC-241
  - R1
  - R2
  - R3
  - QE-229-a
  - se-ABC-244/20261030T224640Z-software-engineer-decision-f1e84d64
  - se-ABC-244/20261030T224640Z-software-engineer-observation-497faf89
  - se-ABC-244/20261030T224640Z-software-engineer-observation-1b63ff56
  - se-ABC-244/20261030T224640Z-software-engineer-observation-ee17f704
  - grugops/ABC-244
  - 25282ad4
  - d59e3194
  - grugops/qe-ABC-244
  - src/cli.test.ts
  - src/uci-session.test.ts
supersedes: 
seal: sha256:42736968872654109f1833ccbf6fff1a8b65b5e9175f8a330ca258b264a89eee
---

# QE on `ABC-244` at `25282ad4` (base `d59e3194`): **PASS.** A6, A7, A8, A9 MET; A10 green; A3–A5 spot-checked. `NFR-008` MET on H at 9.25 s, under the 9.4 s design target, so tranche 2 does not fire

Width ALONE for A8 and A9 (host clear at spawn; wait-clear by PID). Nothing pushed, merged or rebased. No `src/`, `tools/`,
`data/` or board edit. PREREG and the frozen list were committed (`5b4961e1`) before any head run.

| criterion | grade | reading |
|---|---|---|
| A6 kill-set parity | **MET** | 24 frozen mutants (sha256 `9cbf279f…2fdb`); the 4 U1 rows kill the same ids at H as at B (0 DIFF); controls 18/18 green at both |
| A7 node census | **MET** | every U1 row strictly fewer, every other row node-equal; sum 1 014 507 → 223 432 (**−791 075 nodes**) |
| A8 `N8-LANE` (two-file set) | **MET** | H−B CPU median **−1.145 s** [−1.220, −1.070]; twin admissible, R 0.250 s ≤ 0.650 |
| A9 `G8` | **MET; design target MET** | H median **9.25 s**, B 9.69 s, H−B **−0.44 s**; all 6 runs rc 0, load1 ≤ 1.94 |
| A10 gates | **green** | lint, typecheck, build exit 0; `npm test` 2 322/2 322 ×6, 0 skipped; skip-integrity "No findings." |
| A3 names/counts | MET (spot) | cli 108/108, uci 200/200 at B and H; sorted-name sha256 `b49a6b49…` / `72a34cea…` equal (match the SE's) |
| A4/A5 diff shape | MET (spot) | 2 step literals `100` → `1_000`, 4 comment lines; only the two files; no helper, `expect(`, `it(`, `describe(` line |

- **U2 at 100 is right.** QE probed U2 at 1 000 (scratch only): CLI A4 and A7 lose 2 and 5 mutants. SE-244-a is
  CONFIRMED and widened (`QE-244-a`, LOW, no action here).
- **Findings:** `QE-244-a` LOW; `QE-244-b`..`-f` INFO (findings observation). None blocks.
- **UAT:** `git diff --name-only 25282ad4~1 25282ad4 | grep -v '\.test\.ts$' | grep '^src/'` is empty, so the standing
  rule waives UAT; this verdict is the gate.
- **Next:** Security/NFR (the `NFR-008` state on H; the two-file set's first admissible `F`).
