---
subtask: arch-records-ADR-0050
role: architect-design
ref: .grugops/context/arch-records-ADR-0050/
adr: memory-bank/50-decisions/ADR-0050-null-move-pruning-arrives-at-null-window-nodes-with-r-3-behind-a-test-only-off-door-pair-guarded-below-three-non-pawn-pieces.md
branch: new grugops/arch-records-ADR-0050 from main, worktree ../wt-arch-records-ADR-0050
width: 2 of 2 (records only — no npm, vitest or timing; no src/)
---

# ADR-0050 / ADR-0026 records: three dated lines

## Do
- Per Orchestrator `orch-2026-10-26h` and QE `qe-gate-ABC-208/…8c4f3e57`:
  1. **QE-208-e:** a dated line on ADR-0050 recording that it was reported to the owner on 2026-10-26 (Orchestrator `orch-2026-10-26e/…749ff988`). Status stays **PROPOSED**.
  2. **QE-208-d:** a superseding note (`supersedes` your `…bae20026`) correcting "6/6 roots differ at d6" to **5/6**: position-3 is guarded out by the three-piece rule. No pin, value or bound depends on it.
  3. **ADR-0026 d9:** a dated "not in force on main" line. Its 118 cp rode ABC-205's unmerged branch, and main's ABC-121 drift rows assert ≤ 75 cp. Follow the form of the ADR-0031 "accepted, not shipped" line. No bound moves.

## Fences
- Only your worktree and `<scratchpad>/arch0050rec/`. No `src/`. No npm/vitest/timing. Never push, force, amend or rebase; never merge into main; no board edits. Records: class and count only.

## Publish
- Commit on your branch. Seal notes (task arch-records-ADR-0050). `## Result` + 10-cell trace row into this brief in main's queue, then move it and its claim.md to done/.

## Result

**Done, records only.** Branch `grugops/arch-records-ADR-0050` (worktree `../wt-arch-records-ADR-0050`), cut from `main` `42f33a7a`. Commits `998b0ffe` (records) and `b41f1b4b` (notes); tip `b41f1b4b`. Not pushed and not merged.

- **1. QE-208-e, `ADR-0050` § Status:** a dated line, "2026-10-26: still PROPOSED; reported to the owner". It records the report as a yes/no (`…749ff988`; carried in `…42479486`). No answer is recorded, because there is no owner-word note for 2026-10-26. The PROPOSED paragraph is unchanged and the status stays **PROPOSED**.
- **2. QE-208-d:** observation `…86d0f492` (`supersedes` `…bae20026`) corrects § Doors from "6/6" to **5/6** roots at d6, because position-3 is guarded out by the three-piece rule. The count is QE's measurement at `ddc307a9` and was not re-run. No pin, value, bound or criterion depends on it. The link crosses tasks, and the writer folds only within one task. So `arch-design-ABC-208`'s own read still shows `…bae20026`, and the note says to read § Doors through it.
- **3. `ADR-0026` decision 9:** a dated line, "2026-10-26: accepted, not in force on `main`", placed under the `OD-205-2` bullet in the form of `ADR-0031`'s line. Checked read-only at `42f33a7a`:
  - `src/search.pvs-lmr.test.ts` has one shared `toBeLessThanOrEqual(75)`, used by both d5 drift rows.
  - `grugops/ABC-205-final` (`b5d5cea5`, which carries 118) is not an ancestor of `main`.
  - No bound moves.
- **Open (LOW, Orchestrator to route):** `ADR-0034` addendum decision 1's 2026-10-24 pointer says its clean-lead bar "reads 118 cp". This is the same not-in-force reading. It is outside this brief, so it was not edited.
- **Empty diff:** `git diff --stat 42f33a7a..HEAD -- src tools package.json` printed nothing. Class scan over the added lines and the notes: 0 hits. No board edit. No npm, vitest or timing run: only git, grep, file reads, the claim script and the note writer.
- **Notes** (task `arch-records-ADR-0050`): `…observation-86d0f492` and `…decision-f9357ec6`. Both were sealed by grugops 2.1.0 `admitAndAppend` with an explicit `contextRoot`, read back with `readContext` (2 notes), and had their index rendered.
- **For the Orchestrator:** merge `grugops/arch-records-ADR-0050` when ready.

### Trace row (10 cells, header order)

| ABC-208 (arch-records-ADR-0050) | ADR-0050 reported-to-owner line (QE-208-e; stays PROPOSED); …bae20026 § Doors 6/6 → 5/6 superseded by …86d0f492 (QE-208-d); ADR-0026 d9 118 cp dated "accepted, not in force on main" | EPIC-008 | — | none moves (NFR-005 drift bar: text 118, main's rows 75; line records, moves nothing) | `grugops/arch-records-ADR-0050` @ `b41f1b4b` (on 42f33a7a)<br>ADR-0050, ADR-0026 + notes …86d0f492, …f9357ec6 | records only: `git diff --stat 42f33a7a..HEAD -- src tools package.json` empty; class scan 0 | — | — | records written; ADR-0050 PROPOSED (owner's); ADR-0034 pointer flagged LOW |
