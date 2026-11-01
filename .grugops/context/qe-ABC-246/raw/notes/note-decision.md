# QE on `ABC-246` at `3c5e05fd` (base `832ff246`): **PASS.** A1–A5 MET. Over the whole default lane, HSCM reds A1 only and CLOCKWINSCM reds A2 only, and both plants survive the lane at base. `G8` H 9.51 s / B 9.38 s ≤ 10 s, so W1 does not trigger. UAT waived (0 production lines); this verdict is the QE sign-off

The PREREG was committed before any run: `raw/PREREG.txt`, commit `c95e6324` on `grugops/qe-ABC-246` (from the SE's tip `a1942ea0`).
Everything ran ALONE and in sequence. A records-only BA/PM hop (`bapm-page-closes`) ran beside it with no vitest. Nothing under
`src/`, `tools/`, `data/` or the board was edited.

| criterion | result | evidence |
|---|---|---|
| **A1** hard stop binds: `go wtime 3000 btime 3000 winc 500 binc 500 movestogo 1` → 1 900 | **MET** | Re-derived from ADR-0052 D2/D4: spread (3 000 − 1 000 − 100)/1 + 500 = 2 400, hard stop 3 000 − 1 100 = 1 900. The row asserts `[1_900]` on the stubbed `chooseMove`'s handed budget after `CLOCK_MODE`. Green in plant `none` and in all 3 `G8` head runs. HSCM reds it with `[2400]` |
| **A2** `movetime` read first: `go wtime 900000 btime 900000 movestogo 40 movetime 5000` → 5 000 | **MET** | min(5 000, 59 500) = 5 000. The clock's C = (900 000 − 1 000 − 4 000)/40 = 22 375. The row asserts `[5_000]`. Green in `none` and in the 3 head runs. CLOCKWINSCM reds it with `[22375]` |
| **A3** each plant alone turns its row red, and nothing else turns red | **MET** | Whole default lane, 63 files, 2 366 rows: `none` 0 red; HSCM reds {A1} exactly; CLOCKWINSCM reds {A2} exactly. At base (2 364 rows) both plants give 0 red, so the new rows are the lane's only killers |
| **A4** comment-only diff on `src/engine.test.ts`; no figure false at 60 000 | **MET** | −1/+4 lines, all inside one `/** */`. The comment-stripped code is equal at base and head. "about 60 000 clock readings" = 60 000 ms ÷ 1 ms. "after about 10" is QE's re-read of the block's own call: **9 readings** (6 893 nodes, depth 2) |
| **A5** gates, 0 skips, skip-integrity and lane inventory clean, net +2, ABC-220/221 rows unedited and green, `G8` ≤ 10 s | **MET** | lint, typecheck and build exit 0. `npm test` ×3: 2 366 passed, 0 failed, 0 skipped. Skip-integrity: `No findings.` Lane inventory: 63 = 63, `No findings.` Names: +2 / −0, and the sorted name hash is equal once the 2 added rows are removed. 55 ABC-220* + 29 ABC-221* rows are green at head. The diff removes 0 lines from `uci-session.test.ts`. `G8` H **9.51 s** is admissible |

- **`G8`:** H 9.51 s (9.51 / 9.58 / 9.43), B 9.38 s (9.44 / 9.35 / 9.38), delta +0.13 s. load1 1.08–1.79. Tctl median 55.5 °C,
  max 74.9. `NFR-008` MET. The two rows cost about 0.25 ms in-thread, so the delta is host noise.
  - **W1:** the brief applies it here. H 9.51 s ≤ 9.7 s, so no second window was owed. The ticket page says W1 starts at
    `ABC-248`'s gate. With 9.51 s that difference changes nothing.
  - H **9.51 s** is this ticket's head median and becomes part of `ABC-248`'s base.
- **Zero production lines:** the AGENTS.md unfiltered measurement on `832ff246..a1942ea0`, and on the delivered commit
  `3c5e05fd~1..3c5e05fd`, is empty. The UAT waiver holds.
- **Findings** (findings note): QE-246-a, -b, -c and -d, all INFO. SE-246-a is confirmed (INFO, carried). None blocks.
- **Verdict rule** (PREREG): PASS iff A1–A5 are MET and no finding is above LOW. Both hold, so the verdict is **PASS**.
- `main` moved to `407a676a` by records only: no `src/`, `tools/`, `data/` or `package*` change since `832ff246`.
  `grugops/ABC-246` merges cleanly (`git merge-tree`, no refs written). Merge routing is the Orchestrator's.
