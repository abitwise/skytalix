---
id: 20260919T114500Z-architect-design-artifact-ref-adr-0019-the-catalog-section-the-raw-tsv-and-the-harness-as-text-c93e2d75
kind: artifact-ref
by: architect-design
at: 2026-09-19T11:45:00Z
verified_by:
confidence: high
refs:
  - ABC-110
  - ABC-111
  - NFR-008
  - N8-SPAWN
  - ADR-0014
  - ADR-0019
supersedes:
---

# The artifacts of `ruling-abc110-level-15s`, by reference, so every median in the sibling notes can be recomputed

**This is not a stamp.** Hand-authored `artifact-ref`; no `finding` is admissible on this install.
Not a UAT-spec reference, so it carries no `sha` / `gate_run` / `content_hash` (those keys are for
an `artifact-ref` that points at a committed `*.uat.spec.ts`).

| artifact | what it is |
|---|---|
| `memory-bank/50-decisions/ADR-0019-nfr-008-cpu-level-is-15-s-on-the-owners-word.md` | The ADR. `accepted`. Supersedes `ADR-0014` on the CPU level only. Quotes the owner verbatim; names three revisit triggers. |
| `memory-bank/50-decisions/ADR-0014-the-default-lane-cpu-budget-is-overdrawn.md` | Status line edited to `superseded by ADR-0019` (level only), as its own `## Rollback` prescribed. Nothing else in it touched. |
| `plans/nfr-catalog.md` — `NFR-008` row `Target` cell | The level: 15 s from 2026-09-19, dated, citing `ADR-0019`; 13 s retained as the historical level. Wall clause untouched. |
| `plans/nfr-catalog.md` — appended section *"`NFR-008`'s CPU LEVEL IS 15 s"* | The ruling, the re-measurement, the `N8-LANE` reading, the criteria disposition, the hash byte range and the new eight-row hash `eee4dfff…3e5f`. |
| `plans/tickets/ABC-110-…md` — blockquote after the cut header | `A5` satisfied, option named, `A1`–`A4` done (QE), `A6` CPU ruled / wall reported, `A7`/`A8` verified, `A9` N/A, close-with-residual recommendation. |
| `plans/traceability.md` — `ABC-110` row, `Status` cell (append-only) + `_Updated` header | The trace link ticket → `ADR-0019` → NFR ids touched. |
| `memory-bank/00-index.md` | ADR census re-measured in the same commit, per that file's own rule. |
| `raw-a6-interleaved-a-n.tsv` (beside this note) | 18 runs, conditions `A` / `N`, 9 rounds. Columns: `round` · `cond` · `wall` · `user` · `sys` · `cpu` (= user + sys) · `files` · `tests` · `load1_before` · `load1_after` · `counts` (`ok` / `HARNESS_ERROR`). Drop `round == 0`, keep rounds 1–8 (n = 8), pair `N` to `A` of the same round for the null control, take medians. |
| `raw-a6-loadavg.txt` (beside this note) | 1-min / 5-min / 15-min load averages at every round boundary. |
| `raw-harness.mjs.txt` (beside this note) | The throwaway harness as text. `.txt` on purpose — a record, not a runnable thing inside the repo. It invokes no git. |

**The harness ran under the scratchpad outside the repository; the copies it measured were deleted
with the session. `N8-SPAWN` 0 ms.** Nothing under `src/`, `vitest.config.ts`, `AGENTS.md`,
`package.json` or `plans/board.md` is among the artifacts.
