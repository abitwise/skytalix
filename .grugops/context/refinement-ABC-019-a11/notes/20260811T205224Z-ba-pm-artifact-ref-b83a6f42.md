---
id: 20260811T205224Z-ba-pm-artifact-ref-b83a6f42
kind: artifact-ref
by: ba-pm
at: 2026-08-11T20:52:24Z
confidence: high
refs:
  - ABC-019
  - ABC-028
  - ABC-029
  - EPIC-002
  - NFR-002
  - plans/traceability.md
supersedes:
---

# What this hop wrote, and what it deliberately did not

> **Hand-authored** — `scripts/context-io.ts` does not exist in this repository, so there is no
> derived `index.md` / `index.jsonl` render for this `ref:`. Stated so the absence is not read as a
> dropped step.

## Written

| file | change | boundary check |
|---|---|---|
| `plans/tickets/ABC-019-turn-loop-skeleton.md` | `[D52]` under the `NFR-002` trigger; a blocking `ABC-029` dependency with the three refusal reasons; the **sixth** `L`/`P0` + `SPLIT_REQUIRED` re-derivation; a sixth DoR re-check; flags 18–22 | **+175 / −0** — additions only, nothing deleted or renumbered. **27 criteria and 18 table rows UNCHANGED** |
| `plans/tickets/ABC-029-production-module-scope-and-load-probe.md` | front matter `P2` → `P1`; amendment header with the new falsifier; `## Scope` gains the `turn-loop.ts` item; `A1` gains a clause + the regex trap; `A3`'s internal contradiction flagged; the design question's refuted branch; `ABC-019` dependency + decided order; priority re-derived; DoR re-assessed | **+186 / −8** — every deletion is a **replacement**, and the superseded `P2` derivation is **struck through and kept as the record**, not removed |
| `plans/tickets/ABC-028-history-pane-unreached-input-classes.md` | the `ABC-029` ordering corrected from *"either order works"* to **this ticket first**; the trap's trigger recorded as fired-and-declined | **+18 / −2**, both replacements |
| `plans/traceability.md` | one new `_Updated:` header; **two rows** (`ABC-019`, `ABC-029`) appended to in the `Status` cell only | asserted mechanically, below |

**`plans/traceability.md` assertions — run in the writing script, not eyeballed:**

- table lines **39 before and 39 after**;
- the **37 untouched table rows byte-identical by md5** (`c0d6e47b9a4147aeea37ce3a96d2dad4` before and
  after);
- both edited rows **append-only** (the pre-edit prefix asserted to still be a prefix);
- naive pipe counts unchanged — `ABC-019` **12**, `ABC-029` **11**. `ABC-019`'s 12 is the escaped pipe
  inside `EndReason \| "resignation"` that six prior hops recorded — checked, not a defect;
- both appended strings asserted **pipe-free and newline-free BEFORE writing**;
- `_Updated:` headers **53 → 54**, none dropped;
- `Code (PR/files)`, `Tests`, `UAT` and `Release` cells **untouched** — this hop wrote zero `src/`
  lines.

## NOT written

- **`src/` — ZERO bytes.** `git diff --stat -- src/` is empty; `src/turn-loop.ts` md5
  `bd793612476c9d0eac28b75e1e3297cc` and `src/history-pane.nfr.test.ts` md5
  `e27a8387d589adf21ba5b5dd2244225e` both unchanged.
- **`plans/board.md`** — not opened for edit. The requested move (**stay in `In Development`, blocked**;
  or `Blocked` at the Orchestrator's discretion) and `ABC-029`'s row `P2` → `P1` are **requests**, not
  edits. Board text is the Orchestrator's.
- **`plans/nfr-catalog.md`** — read, not edited. No target, bar, level or `UNKNOWN - verify` marker
  moved anywhere.
- **Any ADR / `memory-bank/50-decisions/`** — none opened for edit, none re-opened.
- **`ABC-017`** — not re-opened, not moved, not edited. **`ABC-016`, `ABC-021`, `ABC-027`** — not
  opened.
- **The ticket front matter of `ABC-019`** — deliberately left at `in-review` / `In Review` although
  the live column is `In Development`. Recorded as flag 21 with owner **Orchestrator**: the move is
  committed on an unmerged branch, so editing one half of a two-file contract here would create a
  third state.

## Gates, before and after my edits — identical

`lint` **0** · `typecheck` **0** · `build` **0** · `npm test` **2 failed / 789 passed on 28 files**,
skip 0. The two failures are `src/history-pane.nfr.test.ts:228` and `:275` and are the subject of the
ruling, not a product of it.

## Queue

Claimed by atomic `mkdir` of `.grugops/queue/claimed/refinement-ABC-019-a11/` per Workflow 17 step 2
(`scripts/claim.js` does not exist here, so the atomic create and the `claim.md` registry record were
performed by hand); `claimed/` existed and was empty, so the parent did not need creating. The subtask
file was moved `pending/` → `claimed/<task>/` by `git mv`, and to `done/` on completion.
