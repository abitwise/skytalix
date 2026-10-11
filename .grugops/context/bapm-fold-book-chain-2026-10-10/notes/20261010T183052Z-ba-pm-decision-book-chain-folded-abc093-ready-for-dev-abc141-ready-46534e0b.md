---
id: 20261010T183052Z-ba-pm-decision-book-chain-folded-abc093-ready-for-dev-abc141-ready-46534e0b
kind: decision
by: ba-pm
at: 2026-10-10T18:30:52Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ABC-094
  - ABC-095
  - ABC-096
  - ABC-141
  - ABC-010
  - ABC-101
  - EPIC-005
  - G4
  - NFR-006
  - NFR-008
  - N-LOAD
  - ADR-0037
  - ADR-0036
  - ADR-0035
  - ADR-0012
  - ADR-0023
  - 20261010T182214Z-architect-design-decision-abc093-book-format-d1-d2-d3-adr0037-fold-list-d06f5ba8
  - 20261010T182214Z-architect-design-observation-abc093-probe-readings-on-the-real-source-21537f0b
  - 20261010T172705Z-ba-pm-decision-p1-backlog-two-in-design-two-backlog-0e4da324
  - .grugops/queue/pending/bapm-fold-book-chain-2026-10-10.md
supersedes:
---

# Book chain folded from `ADR-0037`: `ABC-093` 10/10 → `Ready for Dev`; `ABC-094` 9/10, `ABC-095` 8/10, `ABC-096` 9/10 stay `Backlog`; `ABC-141` 10/10 → `Ready`

**How this note was made.**
- Hand-authored and unsealed. No `finding` is admissible on this install (`AGENTS.md`).
- Task `wave-2026-09-25`, subtask `bapm-fold-book-chain-2026-10-10`, Workflow 07. Branch
  `grugops/bapm-fold-book-chain-2026-10-10` from wave tip `4768b3b0`.
- The fold list is the Architect's `…d06f5ba8`; this note cites it and `ADR-0037` and does not
  restate them. The pages' `## Scope` / `## Risks` are authoritative.

| ticket | DoR | size / pri | recommended column |
|---|---|---|---|
| `ABC-093` | **10/10** (was 9): item 5 ✅ | M / P1 | **`Ready for Dev`** |
| `ABC-094` | **9/10** (was 8): item 5 ✅; ⚠️10 (`ABC-093` unbuilt) | M / P1 | stays `Backlog`; re-score on `ABC-093`'s merge |
| `ABC-095` | **8/10** (was 7): item 5 ✅; ⚠️3, ⚠️10 (`ABC-093`/`ABC-094` unbuilt) | S / P1 | stays `Backlog`; re-score on `ABC-094`'s merge |
| `ABC-096` | **9/10** (was 8): item 5 ✅; ⚠️10 (ordering) | S / P3 | stays `Backlog`; re-score on `ABC-094`'s merge |
| `ABC-141` | **10/10** (was 9): item 3 ✅ | XS / P3 | **`Ready`**, pullable at once |

All twelve fold items on `ABC-093` and all items on the other three pages were applied as listed.

## Decisions on BA/PM's own authority (the Orchestrator may reverse any)

1. **`ABC-093` gains `A8`.** § Security bar (b) ("the compiler validates before emitting") had no
   count. `A8`: five fixture defects from `ADR-0037` D1(f), each compile fails and emits no
   artifact. D1(f)'s sixth refusal (one key, two FENs) cannot be built from real chess input, so QE
   reads it in code. Same test file; no new lane file.
2. **`ABC-093` `A3` reads `maxPly` from the file and asserts that the walk's deepest ply is ≤
   `maxPly`.** A recorded field checked only against itself is a spelling guard (test note 4's class).
3. **`ABC-095` `A7` permits a probe `const` above the `runTurnLoop` call.** `engine:` stays the only
   changed property inside the call.
4. **Stale `ADR-0035` "(proposed)" on `ABC-093`/`ABC-094` is now "(accepted 2026-10-10, owner option
   R-1)"** (`f2060b21`). The file-count pins are unchanged.

## `ABC-093` and `In Security/NFR`: BA/PM recommends NO hop

- **`ADR-0036` (b) does not fire.** As placed in D1(g), the diff has 0 production files.
- **No player's process runs this code.** The compiler runs on demand on a pinned, manually fetched
  source. The runtime hostile-input surface is `ABC-094`'s, and the chain passes `In Security/NFR`
  there (b1) or at `ABC-095` (b2) anyway, with `ABC-094`'s re-validation and `wasGenerated` behind it.
- **The page's two structural bars are now QE-checkable counts.** Data-only is `A7` (JSON, not
  `.ts`/`.js`, no `dependencies` key). Validate-before-emit is `A8`. Provenance is `A1`'s
  full-source `cmp` RUN at the pinned SHA, plus `A6`.
- **The ASVS `V15` override stays recorded for `EPIC-006`**, as the page already says. This hop does
  not resolve it, and a Security/NFR read now would not either.
- **What would change this:** the compiler lands under `src/`, the artifact becomes executable, or a
  `dependencies` key appears. Each is already a red on the page (`A7`, `ADR-0037` D1(g)).
- **If the Orchestrator wants a read anyway**, scope it to one question: is a pinned SHA plus a
  reproducible `cmp` enough provenance for the project's first third-party content?

## Readings at `4768b3b0` (BA/PM's own, private scratchpad, nothing under `src/` written)

- **`ABC-141`.** On a `git archive 4768b3b0 src` copy with a global counter spliced into
  `legalMoves` (`src/legal.ts:42`, anchor x1), the counter was the `bapm-r5d-qe139a` hop's
  `derives.mjs`. Node v26.11.0, 2026-10-10T18:25:27Z. Result: **derives = 7**, `ambiguous`,
  `[Q1xd4#,Q2xd4#,Qaxd4#,Qhxd4#,Q6xd4#,Q8xd4#]`. `SIX_QUEENS_FEN` = `3Q4/8/1Q4Q1/4k3/Q2q3Q/8/1Q6/3Q1K2 w - - 0 1`.
  `parseFen` accepts fullmove `9999`, `10000` and `100000000000000000000`.
  `git diff f9d1ff4b 4768b3b0` on `src/move-input.ts`, `src/move-input.test.ts`, `src/history-pane.ts`
  and `src/legal.ts` is empty. The three greps each read 1.
- **Overlaps.** The branches `grugops/ABC-083-king-safety-mobility` and `grugops/design-ABC-085` have no
  commits past the wave tip. `ABC-083`'s page names none of `ABC-141`'s three files.
- **`AGENTS.md`** 23,633 B, so 943 B are left for `ABC-093`'s regeneration line.
- **Production `node:fs` importers under `src/`:** 0.

## Owner questions (Olger Oeselg), restated plainly

- **Q4.** The book ships free CC0 third-party data to every copy, and because no program code
  changes, the rules skip your sign-off. Do you want to sign it anyway? *(Not blocking.)*
- **Q5.** When the book has a move, the computer plays it instantly, even at a weak level that would
  otherwise blunder. Is that what you want? *(Not blocking until `ABC-095` and `ABC-101` are both
  built.)*
- **Weights veto.** The book picks moves in proportion to how often the source lists them: `1. e4`
  about half the time, `1. d4` about a third. Say so if you want every book move equally likely
  instead. *(One constant; not blocking.)*

## Pull order (the Orchestrator's call)

1. `ABC-093` → `Ready for Dev`; build any time (`In Development` 1/3). Check at pull that no hop is
   editing `tsconfig.json` or `biome.json`.
2. `ABC-141` → `Ready`, then build any time. It has no file overlap with `ABC-083` or `ABC-093`.
3. `ABC-094` after `ABC-093` merges; `A5` may be written first. `ABC-096` after `ABC-094`.
4. `ABC-095` last, sequenced against `ABC-101` on `src/cli.ts`.

Not done here (fences): no `src/`, `plans/board.md`, ADR or `AGENTS.md` edit, and no `column:` or
`status:` change. `ABC-083`'s page was not touched.
