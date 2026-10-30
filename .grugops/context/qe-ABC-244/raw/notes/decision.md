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
