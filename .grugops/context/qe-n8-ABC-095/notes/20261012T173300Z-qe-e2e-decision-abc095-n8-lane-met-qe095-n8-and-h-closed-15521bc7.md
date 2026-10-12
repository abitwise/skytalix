---
id: 20261012T173300Z-qe-e2e-decision-abc095-n8-lane-met-qe095-n8-and-h-closed-15521bc7
kind: decision
by: qe-e2e
task: qe-n8-ABC-095
at: 2026-10-12T17:33:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - plans/tickets/ABC-095-short-circuit-the-engines-move-choice-with-the-book-and-fall-through-cleanly.md
  - NFR-008
  - N8-LANE
  - QE-095-N8
  - QE-095-h
  - QE-095-i
  - ADR-0035
  - 20261012T173100Z-qe-e2e-observation-abc095-n8-lane-reread-three-sets-195fc847
  - 20261012T173500Z-qe-e2e-artifact-ref-abc095-n8-reread-branch-probe-c2100dde
  - 20261012T151200Z-qe-e2e-decision-abc095-verdict-pass-with-gaps-ee8775a2
  - 20261012T151000Z-qe-e2e-observation-abc095-timing-a2-r3-n8-lane-3283096f
supersedes:
---

# QE `N8-LANE` re-read, `ABC-095` (`0974102f` → `2307fc11`): **MET on both named costs. `QE-095-N8` is closed. `QE-095-h` is closed with S3 MET.** qe-ABC-095's verdict otherwise stands: PASS_WITH_GAPS, LOW and INFO only

This note is hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). It rules only
the `N8-LANE` row of qe-ABC-095's verdict `…ee8775a2`. It does not supersede that note: every other row there
(`A1`–`A7`, `A2`/R3 timing, plants, gaps `-a` to `-g` and `-i`) stands as written. The readings are in `…195fc847`.

| set | what it carries | windows | state at 650 ms CPU | H − B median (x(2)..x(7)) | twin R | F |
|---|---|---|---|---|---|---|
| S1 `src/cli.test.ts` | named cost 1: the 10 re-targeted children load the real `./engine.ts` closure, `./book.ts` and `./book-file.ts` | `n8r-cli-w1`, clean, n = 8 | **MET** | **+0.225 s** (−0.100..+0.690) | 0.340 s | 0.100 s |
| S2 `src/cli.real-engine.test.ts`, default lane | named cost 2: `ABC-119`'s default row builds the book-absent tree copy | `n8r-real-w1`, clean, n = 8 | **MET** | **+0.025 s** (+0.020..+0.050) | 0.030 s | 0.105 s (16 %) |
| S3 `src/book-engine.test.ts` vs placeholder | `QE-095-h`: the added file's content cost | `n8r-be-w1`, clean, n = 8 | **MET** | **+0.115 s** (+0.100..+0.120) | 0.030 s | 0.091 s (16 %) |

- **Every window was admissible under A1, and each was read once.** No w2 ran, nothing was pooled, and nothing was
  estimated. The overall wait budget was 45 min and 13 min were used. The kit runner blocked the first gate for
  8 min 34 s, and QE did not touch it.
- **Ticket line, arithmetic and NOT A READING:** S1 + S2 medians sum to 0.250 s, and their x(7) ends sum to 0.740 s.
  With S3 the medians sum to 0.365 s and the x(7) ends to 0.860 s. The x(7) sums are over 650 ms, so they are
  reported as they are, not as "under the bar".
- **The count pins still hold** (qe-ABC-095): +1 file, `N8_SPAWN` 27, 0 default-lane book reads.

## Gaps (new; each is INFO, none blocks)

| id | sev | gap | owner |
|---|---|---|---|
| `QE-095-j` | INFO | **S1's interval reaches past the bar.** x(7) is +0.690 s > 650 ms, and the state is MET by decision 1's ladder (R ≤ b, median ≤ b). The window does not exclude a cost above 650 ms at its upper end | Orchestrator (read it, do not re-grade) |
| `QE-095-k` | INFO | **S2 and S3 are admissible only by A1's one-tick floor** (twin medians −1.527 % and +1.754 % of B). Under the pre-A1 1.5 % they would be inadmissible. A1's rollback test (a floor-only twin followed by a bound flip) is not met: both are far below 650 ms | Architect/Design (A1's rollback watch) |
| `QE-095-l` | INFO | **New 4.1 twin readings to fold:** S1 R 0.340 s CPU / 0.330 s wall (the second reading; "largest of fewer than three" would move `F` 0.100 → 0.340 s, on battery with load1 up to 9.83); S2 and S3 R 0.030 / 0.020 s each (first readings; candidates to replace the provisional 16 %). No state here moves under any of them | Architect/Design |

- **`QE-095-i` did not bear on this hop:** no `oeselg-labs/platform` process appeared, and the clause was carried
  unchanged. The protocol question stays with Architect/Design.
- **Power:** on battery for the whole hop. It was logged and is not a void clause (the brief, readout change R1).

## Next

`ABC-095` is in `Ready for UAT` (`d4abeb2e`). The owner's UAT word is owed, because the waiver does not apply (3
production files). The board move and the merge are the Orchestrator's and the owner's. QE did not merge, push, or
touch `plans/board.md`.
