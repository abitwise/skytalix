---
id: 20260812T102300Z-qe-e2e-observation-narrow-re-gate-every-row-re-measured-7a4c1e08
kind: observation
by: qe-e2e
at: 2026-08-12T10:23:00Z
verified_by:
confidence: high
refs:
  - ABC-029
  - ADR-0011
  - A6.1
  - A6.2
  - A5.6
  - src/history-pane.nfr.test.ts
  - plans/tickets/ABC-029-production-module-scope-and-load-probe.md
supersedes:
---

# The narrow re-gate: all 14 required verdicts REPRODUCE on the tree I gated, the mandatory gates are green, and the file I gated is md5 `d51b02be9351c8ee8ed5b3436873db68`

> **`kind: observation`, not `finding`, and that is forced.** There is no `§14-gate` verdict record
> under this task and `context.human_admission` is **`off`**, so no `finding` may be written and
> nothing is self-stamped. **`scripts/context-io.ts` and `scripts/claim.js` do not exist** —
> re-verified AT SOURCE at this hop rather than inherited: there is no `scripts/` directory in this
> worktree and a `find` for `context-io*` / `claim.js` across it (outside `node_modules`/`.git`) and
> across the kit root `/Users/olgeroeselg/.grugops/agent-factory` returns nothing. So these notes are
> hand-authored and there is **no derived `index.md` / `index.jsonl`** — `notes/` is the source of
> truth. The Workflow 17 claim was taken by hand with a bare `mkdir` on the task directory (`-p` only
> for the missing `claimed/` parent), so the atomicity the protocol relies on is intact.
>
> `confidence: high` because **every cell below was RUN at this hop**, on throwaway out-of-tree
> copies, under real vitest, against the real instrument. **No guard was re-implemented.**

## 0. The subject, identified before anything was measured

| | |
|---|---|
| worktree | `../cli-chess-abc029-qe2` |
| branch | `grugops/quality-gate-ABC-029-containment` |
| HEAD | `313ec7450c48fc143b0cf7673ca51c5d760369cc` |
| **the file I gated** | `src/history-pane.nfr.test.ts`, **md5 `d51b02be9351c8ee8ed5b3436873db68`**, 457 lines, blob `c230cd8f8c7a2ff50cc219e0db1a9484c101cf5f` |
| `src/history-pane.ts` | md5 `c4653c4c263c4c417ea34969164ccd86` — the Orchestrator's baseline, reproduced |
| production modules | **16** on this tree, **17** on `ABC-019`'s tip |

**The md5 was re-taken after the last run and is unchanged** — nothing this hop did wrote a
repository worktree.

## 1. The rig, and what was never opened

Two out-of-tree trees in the session scratchpad, each a throwaway copy with `node_modules`
symlinked:

- **`base16`** — this branch verbatim; instrument md5 `d51b02be…`, 16 production modules.
- **`base17`** — `base16` plus `src/turn-loop.ts` read from the **git object database**
  (`git show grugops/ABC-019-turn-loop-skeleton:src/turn-loop.ts`), md5
  **`bd793612476c9d0eac28b75e1e3297cc`** — `## Test notes` 8's stop condition **checked, not
  assumed; it did not fire.**

**NO other worktree was entered.** `../cli-chess-ABC-019`, `../cli-chess-abc029-build2` and
`../cli-chess-abc028-cmt` were never opened; every foreign file came from the object database.

**143 runs of the real instrument under real vitest** across the two trees, plus 2 full-suite runs
on the branch tip, 1 `tsc` run on a mutant tree, 7 `biome check` runs and 5 non-vitest regex probes.

## 2. `A6.1` — MET. Four verdicts, all RED, all reproduced with the recorded message verbatim

| # | build | tree | required | **measured** |
|---|---|---|---|---|
| `A6.1` | `WOFFFRAME-BARE` | 16 | regex RED | **RED** — `expected [ 'zobrist.ts' ] to deeply equal []` |
| `A6.1` | `WREEXPORT-STAR` | 16 | regex RED | **RED** — same message |
| `A6.1` | `WLAUNDER` | 16 | regex RED | **RED** — same message |
| `A6.1` | `WLAUNDER` | 17 | regex RED | **RED** — `expected [ 'turn-loop.ts', 'zobrist.ts' ] to deeply equal [ 'turn-loop.ts' ]` |

## 3. `A6.2` — MET, and I report it only as a PAIR with `A6.1`, for the reason the ticket states

| # | build | tree | required | **measured** |
|---|---|---|---|---|
| `A6.2` | `WTYPEREEXPORT` | 16 | regex GREEN | **green, 8/8** |
| `A6.2` | `WTYPEREEXPORT-PANEL` | 16 | regex GREEN | **green, 8/8** |
| `A6.2` | `WPERFT-DYN` | 16 | GREEN + suite passes | **green, 8/8; full suite 752/752 on 26 files** |
| `A6.2` | `WPERFT-DYN` | 17 | GREEN + suite passes | **green, 8/8** |

**`A6.2` alone is satisfied by doing nothing** — that is the ticket's own words and it reproduces.
What makes the pair meaningful is measured in the sibling `failed-attempt`.

## 4. `A5.6` — MET, and the honest form is "met by code this build did not touch"

| # | build | tree | required | **measured** |
|---|---|---|---|---|
| `A5.6` | `WSWAP` | 17 | regex RED | **RED** — `expected [ 'zobrist.ts' ] to deeply equal [ 'turn-loop.ts' ]` |

**Also measured, and it is the sentence that matters: `WSWAP` is RED under the DELIVERED expression
too** (same message). `A5.6` is a row about the ASSERTION; the containment changed only the
EXPRESSION; **so the Engineer's refusal to take credit for this row is correct, and I re-derived that
rather than accepting it.**

## 5. Rows I did not own but could have been broken — all PRESERVED, re-measured

| row | build | tree | required | **measured** |
|---|---|---|---|---|
| `A5.1` | BASE | 16 | regex green, probe green | **green / green, 8/8** |
| `A5.2` | BASE | 17 | regex green, probe green | **green / green, 8/8** |
| `A5.3` | `WSTALELICENCE` | 17 | regex RED | **RED** — `expected [] to deeply equal [ 'turn-loop.ts' ]` |
| `A5.4` | `WPERFT-STATIC` | 16 | regex RED | **RED** — `expected [ 'perft-bench.ts' ] to deeply equal []` |
| `A5.4` | `WOFFFRAME-STAT` | 16 | regex RED | **RED** |
| `A3` / `R4` | `WOFFFRAME-DYN` | 16 | not recovered | **green — unchanged, by ruling** |
| `A1` | the count | 16 | **zero** filename exclusions in either scanned set | **ZERO** — `grep -c 'file !== '` is `0`; both guards call `productionModulesIn` (3 call sites) |
| `A6` reading clause | docblock | — | residual named, not a completed set | **MET** — `:351-358` names the two dynamic forms AND names re-export as the miss the silence hid |
| `A4` clause (prior hop) | docblock | — | still true after this change | **still true** — `:333-337` still carries "Neither is a weaker version of the other" with clause 3's reason |

## 6. The gate steps, run in Workflow 05's order from the `AGENTS.md` command slots

| step | command | result |
|---|---|---|
| lint | `npm run lint` | **PASS** — 0 errors, 2 pre-existing `biome migrate` **infos**; `quality.lint.strict` is `false` so infos do not fail |
| typecheck | `npm run typecheck` | **PASS** — 0 |
| unit | `npx vitest run` | **PASS** — **752 passed (752) on 26 files** |
| build | `npm run build` | **PASS** — 0 (`tsc --noEmit`) |
| e2e | — | **`UNKNOWN - verify`, non-blocking.** `quality.ui_e2e` is `ui-or-critical-path`, the `AGENTS.md` E2E slot is `UNKNOWN - verify`, and **there is no UI surface until `EPIC-006`. I did not invent one.** |
| test-integrity | skip count `0`; `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **exit `2` — the checker COULD NOT RUN**, `.grugops/test-skips.md` does not exist. Per Workflow 05 that is an error distinct from a clean fail and **is NOT read as a pass**. It is **exit 2, not exit 1**, so the human-only short-circuit does not fire. **PRE-EXISTING, verified: the registry has NEVER existed on any branch** (`git log --all -- .grugops/test-skips.md` is empty; absent on `main`). `quality.test_integrity` is `warn` |
| auto-UAT oracles | `node scripts/check-uat-oracles.js` | **`UNKNOWN - verify`, non-blocking** — the script is not present in this host repo, which the workflow provides for |
| auto-UAT live E2E | `npm run test:e2e` | **`UNKNOWN - verify`** — no such script in `package.json` |

**All four `mandatory_gates` pass.** Skip count is **0**, measured with the `AGENTS.md` slot command.

## 7. Instrument integrity — nothing weakened, narrowed or deleted

- **Instrument test count is 8**, counted independently on the tree I gated.
- **The containment diff is `+24 / −8` in one file, and NOT ONE changed line contains `it(`,
  `expect(` or `describe(`** — checked mechanically over
  `git diff grugops/ABC-029-containment~1 grugops/ABC-029-containment -- src/history-pane.nfr.test.ts`.
  The `toEqual` equality, the licence and frame-producer declarations, the `?arming` query, the fd-3
  channel and all three controls are byte-untouched.
- **No file added or removed under `src/`** — `git diff --name-status` shows `M` only. So the lane's
  file count cannot have moved by this build.
- **Determinism: 12 consecutive runs of the instrument on the branch tip, 12 × 8/8, 0 flaky.** No
  duration is compared to anything anywhere in the file.
- **All three controls re-proven FALSIFIABLE by standalone re-execution, not assumed:** with
  `roots = []` the probe fails its positive control — `the probe loaded the pane: expected [] to
  include 'history-pane.ts'`; with the arming import stripped it fails the arming control — `the
  probe is ARMED: expected [] to include 'history.ts'`.

## 8. `## Test notes` 8's stale number — the Engineer's correction REPRODUCES on my tree

The trees differ by **TWO** files, not one: `src/history-pane.ts` **M** and `src/turn-loop.ts` **A**.
`history-pane.ts` is `c4653c4c…` here and `54fd4346…` on `ABC-019`'s tip. **The whole delta is one
JSDoc continuation line** (`* IT IMPORTS \`GameHistory\` AS A TYPE ONLY, so …`) — it begins with
` * `, so it cannot match `^(?:import|export)` and **cannot move either guard's verdict.** Checked,
not assumed.

## 9. `N8-LANE` — NO number is claimed here and the floor is not converted into one

The Engineer reported `UNKNOWN - verify` with a floor of **±130 ms CPU (1.44% of lane CPU) at n = 8
paired rounds**. **I did not re-run the protocol and I do not turn that floor into a number.** What I
can say from this hop's own measurements: **this branch adds ZERO files under `src/`** and changes one
regex literal plus one comment block, so there is no mechanism by which the lane's file count or its
per-file cost could have moved. **The lane TOTAL is `ABC-026`'s and `NFR-002`/`NFR-008`
`MET`/`MISS` is Security/NFR's.** `plans/nfr-catalog.md` was not opened.
