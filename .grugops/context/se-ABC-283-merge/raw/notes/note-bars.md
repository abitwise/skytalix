# se-ABC-283-merge re-reads on the merged tree (`62151993`, `src/` `af2b77dc`): **every deterministic count equals qe-ABC-283 `…3f370426` and `main`'s post-271 figures.** K0 7 / 7; P0 6 / 6; floor `search()` d5 0 / 190, `chooseMove` d5 0 / 188; zugzwang 7 / 7; G1 54 / 58, none newly missed; typecheck, lint, build 0; skip 0; R-281-a 4 / 1 / 1 / 1; `npm test` 2 687 / 2 687. Default-lane head median **9.77 s** (quiet read) ≤ 10 s and ≥ 9.5 s

Software Engineer, task `se-ABC-283-merge`, brief step 2 (QE-283-i, ruling `…2409cec9` 1). No game was played. Arms out of tree: B = `git archive main 715beb1c` (post-271), H = `git archive 62151993`. Driver: qe-ABC-283's `drv.ts` v2 copied, plus a K0 part. Every run under `flock <scratch>/host-test.lock`. Readout: `raw/out/offline/grade.out`.

| item | reading on the merge | against | state |
|---|---|---|---|
| **K0 (ABC-271), bundle off** | `chooseMoveWithoutBundle` kiwipete d8 / d9 766 275 / 1 725 150; position-6 d8 / d9 / d10 87 475 / 253 724 / 533 916; `searchWithoutBundle` d8 605 117 / 406 787; score, move, depth identical | `main` `715beb1c` shipped, computed fresh: 7 / 7 byte-equal; = qe-ABC-271 `…74da20bf`'s K0 figures | **holds** |
| **P0** all-off doors | 6 / 6 byte-equal (kiwipete, position-6; d6–d8; both recursions; nodes, score, move, depth) | `main` post-271, computed fresh | **MET** |
| **mate floor d5** | `search()` 0 / 190 and `chooseMove` 0 / 188, against the all-off doors and against `main`; futility / SEE-pruning / taper d5 / taper d4 → d5 rows 0 / 189, 0 / 190, 0 / 189, 0 / 163; the bundle lane prints "0 of 190" and "0 of 188" (21 / 21) | — | **0 lost** |
| report: `chooseMove` d6 | 2 / 209, the same two KRK rows (−29 994 → −652), against the doors and against `main` | = QE (R-283-LMR, QE-283-b) | information |
| **zugzwang** | 7 / 7 at the recorded depths: e1f1 d9, h3h4 d11, f4d5 d12, b6c6 c6d6 d6e6 e6f6 d8; nodes equal QE's | — | **7 / 7** |
| **G1** | 54 / 58; missed = the baseline file's `unsolved` = `main`'s own run; newly missed [], newly solved []; `PUZZLE_DEEP` lane 18 / 18 | — | **none newly missed** |
| d8 instrument row | `search()` 523 847 / 234 214, `chooseMove` 707 548 / 101 425; `main` 605 117 / 406 787, 766 275 / 87 475 | = QE, = the committed row | information |
| **gates** | typecheck 0, lint 0 (148 files), build 0 | — | **green** |
| **skip count** | 0; `test-skip-integrity.js` "No findings." | — | **0** |
| **R-281-a** | ABC-167 A5 **4** passed; QE-208-a **1**; ABC-230 A3 / A4 **1**; levels A9 **1** | — | **as expected** |
| lanes on the merged files | bundle 21, taper 170, transposition 40 (search) / 26 (engine), pawns 44 (engine), passer 21, puzzle 18: all exit 0, 0 failed | — | green |
| **`npm test`** | exit 0, 2 687 / 2 687 in 71 files | — | **green** |

## Every count that differs from QE's `…3f370426`, explained
- **None of the engine counts differs.** `p0-*`, `floor-*`, `zug`, `g1`, `g1-base` and the d8 rows are byte-identical to QE's outputs (P0 and d8 after QE-283-d's formatter: QE's p0 and ratio files were v1, printing `d5e60`; the moves and nodes are the same).
- **Why they agree:** `ABC-271` is node-identical by design (`ADR-0070` form (a), every E4a half 0; K0 MET in `…74da20bf`). `main`'s post-271 counts equal its pre-271 counts, so the bundle's P0 and floor read the same.
- **`npm test` 2 665 → 2 687 (+22), 70 → 71 files:** `ABC-271`'s 22 (`main` 2 650 → 2 672): `src/evaluate.passer.test.ts` 21 tests (a new file) and the K1 (d) bound row in `src/evaluate.taper.test.ts`.
- **Taper deep lane 169 → 170:** the same K1 (d) row.
- **Lint 147 → 148 files:** `src/evaluate.passer.test.ts`.
- **Memo size 448 → 576 KiB** (`src/evaluate.pawns.test.ts`, `src/transposition.test.ts` A7): `ABC-271` K2's two re-pins, both standing, both green.

## NFR-008 default lane (reported, not graded: no twin)
`npm test` as spelled, one fresh process per run, `/usr/bin/time` wall, interleaved pairs B / H (even pairs B first, odd pairs H first), pair 0 a warm-up not scored, one lock hold per read.

| read | head median [min, max] | `main` median | H − B median (per pair) | vs 10 s | vs 9.5 s |
|---|---|---|---|---|---|
| **read 2 (quiet start, load1 ≤ 1.5)** | **9.77 s** [9.68, 9.93] | 9.57 s | **+0.115 s** (4 / 6 positive) | **≤ 10 s, 0.23 s headroom** | above (+0.27 s) |
| read 1 (host loaded) | 10.21 s [10.07, 10.64] | 10.18 s | +0.215 s (4 / 6 positive) | above — and `main` itself is above | above |

- **Read 1 is a host effect.** It started at load1 2.53 while another project's vitest ran outside this lock, and `main` itself read 10.18 s, against its 9.17–9.45 s in qe-ABC-271 and qe-ABC-283. Read 2 was taken after the host fell to load1 ≤ 1.5 (the wait is in the command; I decided the re-read after seeing read 1, and both reads are recorded, `raw/out/npm-test-pairs.txt` and `npm-test-pairs-2.txt`).
- Read 2 has one `main` outlier (pair 4, 12.16 s); the medians are robust to it.
- **The expectation:** QE's graded head 9.60 s plus `ABC-271`'s ~0.17 s (9.17 → 9.34 s in `…74da20bf`) ≈ 9.77 s. Read 2 lands on it.
- **Against the triggers:** ≤ 10 s MET on read 2 with 0.23 s of headroom. ≥ 9.5 s (R-N8H-1) and ≥ 9.6 s (Q-N8H-1) both fire, as QE-283-a already says. The Security/NFR hop after the merge (`…c7609f51` 3) owns the graded read.
