---
id: 20261010T131416Z-agents-md-scribe-observation-abc087-levels-lane-landed-headroom-recovered-3a7c91e5
kind: observation
by: agents-md-scribe
at: 2026-10-10T13:14:16Z
verified_by:
confidence: high
refs:
  - ABC-087
  - ABC-109
  - ABC-065
  - ABC-069
  - ABC-131
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - 20261010T115230Z-software-engineer-claim-abc087-agents-md-line-nfr004-wording-a4-bias-53ebd6d1
  - 20261010T130840Z-software-engineer-observation-abc087-r1-clamp-pin-qe087d-draw-pin-14ec8ea7
supersedes:
---

# `AGENTS.md`: `ABC-087`'s Levels deep lane landed; 143 B of headroom became 414 B by tightening receipts

Hand-authored, unsealed: `context-io.ts` is absent from this install, so no `finding` is admissible
(`AGENTS.md` § Role / workflow files). Worktree `.claude/worktrees/ABC-087-difficulty-levels`, branch
`grugops/ABC-087-difficulty-levels`, on top of `dacfe32f`. Only `AGENTS.md`, this note and one
trace row (end of `plans/traceability.md`) changed. `memory-bank/90-agents-md-command-log.md` was NOT
touched (outside the fence): it has no Levels section and its `Test (all)`, `Engine` rows are older
than what `AGENTS.md` now says. A Scribe pass with that file in scope owes it a matching section.

## Size

| | bytes | headroom to 24,576 |
|---|---:|---:|
| wave `grugops/wave-2026-09-25` (`0348224e`) and branch `dacfe32f`, before | 24,433 | 143 |
| branch, after | **24,162** | **414** |
| scratch merge (`git merge-tree --write-tree`) of branch with wave `0348224e` | 24,162 | 414 |

`AGENTS.md` on the wave is byte-identical to the branch's before-state, so the merged file is the
branch file. The merge has ONE conflict, `plans/traceability.md` (both sides append rows at the end;
the same conflict exists at `dacfe32f`, before this hop). Resolution is keep-both, the Orchestrator's.
`AGENTS.md` merges clean.

## The landed line (after `Engine deep lane`)

```
- Levels deep lane (ABC-087, `src/levels.test.ts`): `ENGINE_DEEP=1 npx vitest run src/levels.test.ts`
  <!-- RUN 2026-10-10: exit 0, 28 passed (22 default), 202 s (A5: 135 s).
  Holds A4's evidence (ENDGAMES 204 + perft/puzzles 246 moves), A2 on a virtual clock, A3 (35
  vs 58 of 62). Run after any src/levels.ts, src/engine.ts or src/virtual-clock.ts change. -->
```

Source: the Engineer's draft (claim `…53ebd6d1` § 1) with the `22 default` update, from observation
`…14ec8ea7`. The draft's "at load1 8.9 -> 8.4" and "(30 real moves at 4.5 s)" were cut for bytes;
they stay in `…14ec8ea7`. About 330 B against the draft's 370 B.

## Receipts tightened (before -> after), with what the cut dropped

| Slot | Before | After | Dropped |
|---|---|---|---|
| Test (all) | `RUN 2026-10-09: exit 0, 50 files, 1539 tests, 6.66 s.` | `RUN 2026-10-10: exit 0, 52 files, 1603 tests, 5.9 s.` (measured on this tree twice: 52 / 1603, 5.89 s and 6.65 s) | "within the 60 s bound" -> "at the 60 s bound". Stale count refreshed, not just trimmed. The merged tree will read more files; `ABC-131` owns that edit. |
| Engine deep | `318.6 s wall at load1 10.0 -> 7.6 (QE/Security lanes in parallel); 291.9 s at load1 ~7-8 (ABC-086 receipt) — so ~5 min, not 100 s.` | `~5 min (292-319 s), not 100 s.` | the two load1 readings and the `ABC-086` receipt citation |
| Input-seam | `0.34 s`; `33 means NODE_OPTIONS was dropped and the external-memory retention guard did not run`; `it is blind to … the field that is NOT blind` | no `0.34 s`; `33 = NODE_OPTIONS dropped, retention guard did not run`; `blind to … which is NOT blind` | the timing; TRAP kept whole (`heapUsed` vs `external`, 0.00 vs 32.00 MiB) |
| Puzzle suite (before `TRIGGER` only) | `32-36 s (gating run 20-24 s) at load1 4-8` and `(58/62, budget 25, step 1; the 4 unsolved rows named, a run prints … per row that differs)` | `32-36 s` and `(58/62, budget 25, step 1; a run prints … per differing row)` | gating-run time, load1, "the 4 unsolved rows named" |
| PVS/LMR | `exit 0, 29 passed (20 default). RUN 2026-09-26 (default): 0.6 s. Deep 926.2 s wall — cited from UAT …, not re-run here (over 10 min).` | `exit 0, 29 passed (20 default; 0.6 s). Deep 926.2 s wall, cited from UAT …, not re-run (over 10 min).` | wording only |
| Real-engine CLI | `6.4 s at load1 4.4 (QE: 6.3-6.5 s at load1 15-18); … 3099-3147 ms each.` | `6.4 s; …` (command string kept on one line) | the QE reading, load1 figures, per-child ms |
| Coverage | `…as a child process … while thoroughly tested.` | `…as a child … while tested.` | wording only; count `856/856 on 30 files` NOT refreshed (not re-run here) |
| Build | `currently tsc --noEmit — type-checked, nothing published until EPIC-006. Honest naming: a typecheck wearing the build slot's name.` | `tsc --noEmit: a typecheck; nothing published until EPIC-006.` | the "honest naming" flourish |
| E2E | `no runnable game until EPIC-006; quality.ui_e2e is ui-or-critical-path and this project has no UI surface yet` | `no UI surface (quality.ui_e2e: ui-or-critical-path)` | "no runnable game until EPIC-006" was stale: the CLI has run since `ABC-042` |
| Command-slots comment | `every command was RUN before being recorded. A slot still UNKNOWN - verify is genuinely unknown — nothing was guessed.` | `each RUN first; UNKNOWN - verify = unknown.` | wording only |

One cut is NOT a RUN receipt: the "Drafted by BA/PM at task `home-the-gaps-2026-08-13`…" provenance
paragraph under the "No `finding` is admissible" callout lost about 70 B to wording ("before doing any
work", "task", "not what should be"). Every fact in it is still there (who drafted, why, the
`install.js --check` fix, escalated not ticketed). It was needed to reach 400 B; flagging so the
Orchestrator can veto.

## Fences held (checked mechanically against the before-file)

- `Dev / run` slot: byte-identical (`ABC-065` / `ABC-069` / `ABC-067` / `ABC-071`).
- `PUZZLE_DEEP` `TRIGGER` text, from `TRIGGER (owner` to `-->`: byte-identical.
- No backticked command or path dropped; the only backtick changes are the added Levels line.
- No rule, trigger or guarded string dropped. The skip-count "other runners" examples were left
  alone: a command, even as an example, is not mine to cut for bytes.

## Gates (in the worktree, on the AGENTS.md change)

- `npm run lint`: exit 0 (`Checked 100 files`, no fixes).
- `npm run typecheck`: exit 0. `npm run build` (`tsc --noEmit`): exit 0.
- `npm test`: exit 0, **52 files / 1603 passed**, 6.65 s. The `AGENTS.md` guards ran green:
  `ABC-065`, `ABC-069`, `ABC-109` (`-t` filter: 5 passed, 61 skipped).
- `node tools/grugops/lane-inventory.js`: `The lane collects 52 test files; git tracks 52.`,
  `No findings.`, exit 0.

## Not done

- `ENGINE_DEEP=1 npx vitest run src/levels.test.ts` was NOT re-run (202 s, cited from
  `…14ec8ea7`, run at `1160b063`; no `src/` byte has changed since).
- Coverage count `856/856 on 30 files` and the `E2E` / `Acceptance` slots were not re-verified.
- Headroom is 414 B, 14 B over the 400 B ask. `ABC-131`'s count edit and the next lane will spend it;
  the next big lever is the other prose provenance paragraphs, not the receipts (they are now thin).
