---
id: 20261011T140910Z-security-nfr-observation-abc083-a9-a7-quiet-depth-and-nodes7-1643be6c
kind: observation
by: security-nfr
at: 2026-10-11T14:09:10Z
verified_by:
confidence: high
refs:
  - ABC-083
  - NFR-005
  - AR-NFR005-082
  - ADR-0031
  - ADR-0039
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/preregistered.txt
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/one.mjs
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/depth-window.sh
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/a9-depth.tsv
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/nodes7.out.txt
  - .grugops/context/secnfr-ABC-083-quiet-readings/probe/window-once.txt
  - .grugops/context/ticket-to-pr-ABC-083/probe/nodes7.mjs
  - .grugops/context/ticket-to-pr-ABC-083/notes/20261010T194248Z-software-engineer-observation-abc083-a7-a9-depth-and-nodes-to-depth-7-9d4c3a61.md
  - .grugops/context/secnfr-ABC-082/notes/20261009T172203Z-security-nfr-observation-abc082-nfr005-floor-met-depth7-warn-kiwipete-margin-1-05x-ff8ad962.md
supersedes:
---

# `A9`/`A7` in the quiet window: depth 7 on every run, base and branch, both positions (24 of 24). Kiwipete's margin is 1.126–1.130x (base 1.112–1.122x). Position-6's margin is **1.056–1.066x** (base 1.470–1.477x)

This note is hand-authored and unsealed. It is an observation, not a stamp. No `finding` is admissible on this install (`AGENTS.md`).

## Conditions

- **Machine:** Apple M3 (Mac15,13), 4 P + 4 E cores. Darwin 25.5.0, Node v26.11.0, `lowpowermode 0`, AC power, battery 100 % "charged".
- **Width 1.** Every other hop was held. `foreign_before` was 0 on all 24 runs.
- **Trees** (git worktrees in the session scratchpad):
  - base = `5ed308a8`, the branch's merge-base with main. Its engine files are byte-identical to the build's base `489c549e`. `489c549e..5ed308a8` touches only `src/book.ts`, `src/history-pane.ts` and `src/move-input.ts`, none of them on `chooseMove`'s path.
  - branch = `09b8c960`, the tip. Against base it differs in one non-test file, `src/evaluate.ts`.
- **Method, as `A9` writes it.** `chooseMove` at `DEFAULT_BUDGET_MS` (3000) on the real clock, plain `node`, one fresh process per run (`probe/one.mjs`, the build's `depth.mjs` shape).
  - Each round runs kiwipete, then position-6. Odd rounds run base first and even rounds branch first.
  - load1 and `com.apple.system.thermalpressurelevel` were read immediately before and after every run.
- **Grading was declared before the first run** (`probe/preregistered.txt`, 13:49:40Z). Rounds 1–3 are GRADED, as the page asks. Rounds 4–6 ran unconditionally afterwards and are DESCRIPTIVE only.
- **Window:** 13:49:49Z–13:51:03Z. load1 ranged 1.90–2.34. Thermal was 0 before and after all 24 runs. `elapsedMs` was 3000–3004.

## Real clock: completed depth (nodes in 3 s), per run

| round | order | kiwipete base | kiwipete branch | position-6 base | position-6 branch | load1 (before) | thermal |
|---|---|---|---|---|---|---|---|
| 1 | base first | 7 (682 578) | 7 (638 554) | 7 (680 366) | 7 (681 625) | 1.97 / 1.97 / 1.90 / 1.90 | 0 → 0 |
| 2 | branch first | 7 (678 482) | 7 (637 530) | 7 (682 414) | 7 (686 745) | 2.05 / 2.14 / 2.13 / 2.05 | 0 → 0 |
| 3 | base first | 7 (684 626) | 7 (639 578) | 7 (683 438) | 7 (680 601) | 2.20 / 2.20 / 2.34 / 2.31 | 0 → 0 |
| 4 *(descr.)* | branch first | 7 (683 602) | 7 (636 506) | 7 (681 390) | 7 (684 697) | 2.21 / 2.31 / 2.11 / 2.21 | 0 → 0 |
| 5 *(descr.)* | base first | 7 (683 602) | 7 (641 626) | 7 (682 414) | 7 (685 721) | 2.02 / 2.02 / 1.94 / 1.94 | 0 → 0 |
| 6 *(descr.)* | branch first | 7 (685 650) | 7 (635 482) | 7 (680 366) | 7 (687 769) | 2.03 / 1.94 / 2.03 / 2.03 | 0 → 0 |

The four load1 figures are listed in table column order. Per-run before and after values are in `probe/a9-depth.tsv`.

- **Node rate:** kiwipete runs at 212–214k n/s on branch against 226–228k on base, which is −6.5 %. Position-6 runs at 227–229k on both. This agrees with the build's reading ("kiwipete's rate fell ~5 %; position-6 equal").

## Clock-free: cumulative nodes to COMPLETE depth D

The build's own `nodes7.mjs` was run twice per tree, 13:51–14:00Z, at load1 2.3–3.2 and thermal 0. **Both passes are identical to the node.**

| position | D | base `5ed308a8` | branch `09b8c960` | change |
|---|---|---:|---:|---:|
| kiwipete | 7 | **610 179** | **566 233** | −7.20 % |
| kiwipete | 6 | 256 581 | 231 536 | −9.76 % |
| position-6 | 7 | 462 871 | **644 469** | **+39.23 %** |
| position-6 | 6 | 170 202 | 169 685 | −0.30 % |

- Base reproduces `ABC-082`'s branch figure (610 179) and the build's base column exactly. Branch reproduces the build's `79248602` column exactly. The re-level commit `547b5155` and the main merge did not move the tree. *The task brief's "532 363 → 610 179" is `ABC-082`'s own base → branch pair, one ticket earlier.*

## Margin = nodes in 3 s ÷ nodes to complete depth 7

| position | build | graded rounds 1–3 | all six rounds |
|---|---|---|---|
| kiwipete | base | 1.112–1.122x | 1.112–1.124x |
| kiwipete | branch | **1.126–1.130x** | 1.122–1.133x |
| position-6 | base | 1.470–1.477x | 1.470–1.477x |
| position-6 | branch | **1.056–1.066x** | 1.056–1.067x |

- **Kiwipete gained margin** because its tree shrank by 7.2 %, which more than covers the 6.5 % lower node rate. `AR-NFR005-082`'s position (kiwipete at 1.05–1.12x) is no worse on this build.
- **Position-6 lost almost all of its margin.** The tree grew by 39 %, and the node rate did not change. In this window a sustained slowdown of about 5.3–6.2 % takes position-6 from depth 7 to depth 6. That slowdown can come from contention, heat or a slower host. The build's one depth-6 run (load1 → 43.8) is that shape.

## What this note does not establish

- Whether `thermalpressurelevel` 1 alone (Window B: reached after about 2.5 min of back-to-back full lanes) cuts single-thread node rate by more than 5 % is **`UNKNOWN - verify`**. No run here was at level 1.
- King safety alone was not re-read in this window. The cut did not fire (decision `…8ff62fd0`). The build's reading stands: 467 730 nodes to depth 7 on position-6.
