# QE on `ABC-248` at `18bad5fb` (code `71700836`, base `main` `46365ed0`): **PASS_WITH_GAPS, no gap blocking.** Every lever meets its condition and A5–A11 are MET. `G8` H 9.09 s / B 9.37 s, so W1 is not triggered and the 9.4 s design target is met. The one MEDIUM gap is in the ruling's text, not the delivered code. UAT is waived (0 production lines), and this verdict closes the gate

The PREREG was committed before any run: `raw/PREREG.txt`, commit `af00650c` on `grugops/qe-ABC-248` (from `18bad5fb`).
- **Lists.** I reused the SE's frozen lists and did not re-freeze them. Their hashes match the SE's PREREG `7e9ab524`, which
  is an ancestor of the code commit, and the lists are unchanged between the two commits.
- **Independence.** I wrote my own runner (`qe-scripts/mut.mjs`) and ran fresh kill runs at base and at tip.
- **How it ran.** ALONE, all in sequence, with no other hop beside it. Nothing under `src/`, `tools/`, `data/` or the board
  was edited.

| criterion | result | evidence (QE's own runs) |
|---|---|---|
| **T2c-a** (ruling 4) | **MET** | S = the even readings 4–24 (Σ 154 < 322). `insideNull` 5 → **4** (≥ 3); `mutated` []. `engine-no-finally` reds `QE-208-a` at B and H; the row kills {engine-no-finally, min-depth-3, null-no-fullmove} at both |
| **T2c-b** (ruling 4) | **MET** | Root startpos (7 non-pawn pieces each side). `underNull` 44/44 → **19/19**; `stale` [] in both. `search-stale-null-key` reds the `search()` row and `engine-stale-null-key` reds the `chooseMove` row, at B and H. Per-row kill sets equal |
| **Plant parity, whole file** | **MET** | 26 plants that apply: 26 killed at B, 26 at H, none lost |
| **T2a narrow** (ruling 3) | **MET** | 137 mutants, `src/uci-session.test.ts` default lane: **120 → 120 killed**, none lost or gained, and the 17 survivors are identical. Each moved row's base kills are all killed at H by the default lane (9/9, 12/12, 10/10, 10/10). "white reads wtime" is the sole killer of WS-WHITE and "black reads btime" of WS-BLACK, and the two together are the only killers of `WRONGSIDE`, so both stay. Every staying A5 row has the same kill set at B and H |
| **T2d** (ruling 2) | **MET** | A4-a2 kills the same 8 ids at step 100 (B) and 1 000 (H). ⌈4 000 / 1 000⌉ = 4 ≥ 2. Census: 0 rows join. I re-read the SE's census. I also spot-checked the 20 heaviest default-lane rows of the two files at H (`census-H.tsv`). Each one reads time or depth (`expectWarnedSearch`, the level bound, the depth floor), sits on a fenced shared-helper step (`rig`), or is already listed. No further candidate turned up. This was a spot-check, not a full enumeration |
| **A3** counts and names | **MET** | `npm test` JSON, run 1 (B) against run 2 (H). `null-move` 38 = 38, differing only by the 3 ruling-5 retitles. `uci-session` 234 → 230, exactly the 4 moved names gone. Lane 2 366 → 2 362, 0 failed, 0 skipped. The other 61 files are name-equal |
| **A4** diff | **MET** | `--name-only` (excluding `.grugops/`) lists the two files. 0 `expect(` lines removed; the 6 added lines are the deep block's copies. The moved loop bodies are byte-identical at +2 indent. A4-a2 changes only `100` → `1_000`. The helpers are byte-identical (`virtualClock` is production and untouched). New comments cite `ABC-248` / `ADR-0046` |
| **A5 / A6** | **MET** | the T2a, T2d and T2c rows above |
| **A7** node census | **MET** | Each changed T2c/T2d row reads strictly fewer nodes: −138 356, −127 763, −50 069 and −33 792. The four moved rows leave −85 072. Two-file default-lane sum 1 689 340 → 1 254 288 (**−435 052**), equal to the SE's figure |
| **A8** `N8-LANE` (null-move + uci-session) | **MET** | n = 8 (round 0 discarded). Twin T−B CPU +0.020 s, admissible, R 0.080 s. **H−B CPU −0.635 s** [−0.720, −0.420] ≤ 650 ms. H−B wall −0.215 s [−0.270, −0.180] |
| **A9** `G8` (W1) | **MET** | b h h b b h, wait-clear before each run. **H 9.09 s** (9.11 / 9.09 / 9.01), **B 9.37 s**, H − B −0.28 s. load1 0.55–1.72. `NFR-008` MET. Design target ≤ 9.4 s MET. W1 is not triggered (≤ 9.7 s), and the > 10 s route does not fire |
| **A10** deep lane | **MET (escaped form)** | `-t "… \[deep, ENGINE_DEEP=1\]"` prints **"4 passed"** (237 skipped), rc 0. Unset: 230 collected, 0 carry the deep title. Ruling 6's literal (unescaped) form runs 0 tests with rc 0: QE-248-a |
| **A11** gates | **MET** | `npm run lint` / `typecheck` / `build`: rc 0. `npm test` ×3 head: 2 362/2 362, skips 0. Skip-integrity: `No findings.` Lane inventory: 63 = 63, `No findings.` |

- **Carried items.**
  - **QE-244-a:** not triggered. `src/cli.test.ts` is untouched (0 diff lines), the production diff is empty
    (`LEVELS[5].budgetMs` 4 000 and `NODES_PER_CLOCK_CHECK` 1 024 are unchanged), and no CLI ABC-241 A4/A7 step moved.
    The only step that moved is A4-a2's, whose kill set is equal. The carry stays open as written for a later ticket.
  - **QE-245-b:** the remedy has landed. H 9.09 s sits under the 9.4 s target and the 9.7 s line that fired at 9.82 s.
    **Closed** by this reading.
- **P-2** (QE-244-c, whole default lane at H): S241M5, QCLOCK and QPATHOFF are **killed**. **QPLY4 and QPARITY survive.**
  QPLY4 is a LOW pre-existing gap (QE-248-c). QPARITY is very likely an equivalent mutant (QE-248-d). Neither is a
  regression in `ABC-248`, and neither blocks.
- **Gaps (none blocking):** QE-248-a (MEDIUM, ruling-text trap; carrier BA/PM), QE-248-c (LOW, P-2 survivor QPLY4,
  pre-existing). The rest are INFO. See the findings note.
- **Zero production lines:** `git diff --name-only 71700836~1 71700836 | grep -v '\.test\.ts$' | grep '^src/'` prints
  nothing. UAT is waived, and this verdict is the sign-off.
