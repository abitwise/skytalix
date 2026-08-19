---
id: 20260820T171500Z-qe-e2e-artifact-ref-the-raw-per-run-tsvs-and-the-throwaway-harness-9c04b7d5
kind: artifact-ref
by: qe-e2e
task: ticket-to-pr-ABC-110-a1a4-2026-08-20
at: 2026-08-20T17:15:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-110/A1
  - NFR-008
  - N8-SPAWN
supersedes:
---

# The raw per-run TSVs and the throwaway harness, published beside the notes so every median above can be recomputed

**This is not a stamp.** Hand-authored `artifact-ref`; no `finding` is admissible on this install.
Same shape as `design-oq1-lane-budget-2026-08-19/`, which published its raw per-run TSVs alongside
its notes — **a median nobody can recompute is an assertion, not a measurement.**

## The artifacts

| file (beside this note) | what it is |
|---|---|
| `raw-phase1-null-control.tsv` | 20 runs. Conditions `A` and `N` (byte-identical `git archive` twins), rotated, 10 rounds. **The identity null control, taken before any treatment tree existed.** |
| `raw-phase2-per-file-treatments.tsv` | 90 runs. `A` plus eight single-file removals, rotated, 10 rounds. **`A1`'s per-file savings.** |
| `raw-phase3-joint-sets.tsv` | 40 runs. `A` plus three joint removal sets, rotated, 10 rounds. **`A2`'s additivity check.** |
| `raw-harness.sh.txt` | The harness itself, as text. **`.txt` on purpose so it is a record and not a runnable thing inside the repo.** |

**150 runs, 0 harness errors, 0 runs discarded for a count mismatch.**

## Columns, so nobody has to guess

`round` · `cond` · `files` · `tests` · `skip` · `user` · `sys` · `cpu` (= user + sys) · `wall` ·
`exit` · `load_pre` (1-min load average read immediately before the run).

**To reproduce any figure in the sibling notes:** drop `round == 0` (the discarded warm-up), keep
rounds 1–8 (**n = 8**), pair each treatment run to the `A` run of the **same round**, take the median
of the per-round `cpu` differences. That is the paired-median statistic `NFR-008`'s protocol names.

**Every row carries its own `files` / `tests` / `skip` / `exit`, so the tripwire is auditable per run
rather than asserted in prose.** Condition `A` is **39 / 1181 / 0 / 0** on all 30 of its rows across
the three phases.

## What is deliberately NOT here

**The harness ran entirely OUTSIDE the repository** — `git archive 54cbb23` copies in a scratchpad,
`node_modules` symlinked in (disclosed deviation). **It is not committed as runnable code**, which is
`NFR-008`'s own stated firing threshold, and **`N8-SPAWN` stays 0 ms**. The measured trees are
throwaway and are not preserved; they are exactly `git archive 54cbb23` with zero, one, two, three or
four named `src/*.test.ts` files deleted, and are reconstructible from the `cond` column and the
harness text in one command.

**No production file, no `package.json`, no `vitest.config.ts` and no `AGENTS.md` was read for
writing at this hop, and `plans/nfr-catalog.md` is byte-identical to `main`.**
