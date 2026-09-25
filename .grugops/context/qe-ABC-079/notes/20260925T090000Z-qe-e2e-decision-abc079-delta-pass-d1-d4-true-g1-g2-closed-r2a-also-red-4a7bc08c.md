---
id: 20260925T090000Z-qe-e2e-decision-abc079-delta-pass-d1-d4-true-g1-g2-closed-r2a-also-red-4a7bc08c
kind: decision
by: qe-e2e
at: 2026-09-25T09:00:00Z
verified_by:
confidence: high
refs:
  - ABC-079
  - ABC-114
  - ADR-0024
  - NFR-008
  - src/search.ts
  - src/search.test.ts
  - src/quiescence.test.ts
  - plans/tickets/ABC-079-quiescence-search-on-captures.md
  - .grugops/context/qe-ABC-079/notes/20260924T215000Z-qe-e2e-decision-abc079-fail-four-false-search-ts-sentences-behaviour-meets-a1-a6-conjunction-gap-real-and-move-changing-a4-a7-lane-risk-2c7e91a4.md
  - .grugops/context/ruling-abc079-g1g2/notes/20260925T061500Z-architect-design-decision-g1-pin-oracle-checked-depth3-answers-in-a5-g2-split-deep-corpus-by-root-licence-8c3e5a72.md
  - .grugops/context/ticket-to-pr-ABC-079/notes/20260925T063000Z-software-engineer-decision-rehop3-d1-d4-prose-a5-depth3-oracle-pins-per-root-deep-slices-1a7d3e90.md
  - .grugops/context/ticket-to-pr-ABC-079/notes/20260925T063200Z-software-engineer-observation-rehop3-gates-deep-shares-a7-alone-r2b-r2c-red-comment-only-proof-2b8e4f01.md
supersedes:
---

# `ABC-079` delta re-QE verdict: **PASS**. D1–D4 are now TRUE by measurement, no new false sentence, `search.ts`'s diff is comment-only. G1 closed: the pins red R2a, R2b AND R2c — no survivor in the class. G2 closed: the coverage check bites, and every deep case (lane and alone) stays under 50%. All gates green.

**NOT A STAMP.** `context.human_admission` is `off`, so no `finding` is admissible on this
install. This is QE's hand-authored `decision`, the delta re-QE of `ABC-079` after re-hop 3
(subtask `qe-ABC-079-delta`, task `wave-2026-09-24`, Workflow 05 step). It checks the DELTA
against the prior `qe-ABC-079` FAIL (`2026-09-24T21:50:00Z`) and the Architect/Design G1/G2
ruling — it does not re-run the whole ticket's prior QE pass.

Everything below was run in the worktree `.claude/worktrees/qe-ABC-079-delta`, branch
`grugops/qe-ABC-079-delta` created from `grugops/int-ABC-079` @ `c6b528d`, with the main
checkout's `node_modules` symlinked. Code commit under test: `9d2306c` (re-hop 3), whose parent
`9a7e549` is byte-identical to the licence base `9b4dd68` over `src/` (`git diff --stat` empty).
**QE added zero lines under `src/` in its diff** — every mutant applied for this delta was
reverted, and `git status --porcelain -- src` was asserted EMPTY after each one (four mutant
rounds: `R2a`, `R2b`, `R2c`, and one `broadSlice`-coverage probe on `src/search.test.ts`,
also reverted).

## 1. D1–D4: TRUE by measurement, no new false sentence, comment-only diff

`git diff -U0 9a7e549 9d2306c -- src/search.ts` is 29 changed lines; every one begins with `*`,
`/**` or `//`. Independently re-checked by TypeScript scanner token stream (with trivia
skipped): **808 tokens before, 808 after, byte-identical arrays**. Zero code tokens changed.

Each rewritten sentence was checked directly against the delivered code:
- **D1/D2** (both doors named): `searchWithoutQuiescence` (`prune: true, quiescence: false`)
  and `searchWithoutPruningOrQuiescence` (`prune: false, quiescence: false`) both exist and
  both reach the bare leaf — confirmed by reading `src/search.ts:236,250`. The header no longer
  says "the" door (singular).
- **D3/D4** (`searchWithoutPruning` is NOT brute force below the horizon): confirmed —
  `searchWithoutPruning` calls `searchRoot(position, depth, { prune: false, quiescence: true })`,
  so its leaves still run `quiesce`. The specific measurement the comment cites (position-3
  depth 1: 46 nodes shipped) was independently reproduced: `searchWithoutPruning(parseFen(pos3), 1)`
  returns exactly **46** nodes. The paired "63 with quiesce's cutoffs removed" figure is the
  original QE FAIL decision's own measurement (2026-09-24), carried forward by citation; it is
  not a code path this repair hop's licence permits re-deriving (no export exposes a
  cutoff-stripped `quiesce`), so it is accepted on the prior QE's own authority, not re-run here.
- No new false sentence found in the diff (`ABC-114` standard) — the `search.test.ts` header and
  `A1` banner rewrites (":37–43", ":352") were also read and are consistent with the ruling and
  with the pin now in place.

## 2. G1 (Architect/Design ruling, closed in-ticket): the pins bite on ALL THREE seeded slips

QE independently re-applied all three of the original FAIL decision's seeded window-slip
mutants against the delivered `9d2306c` tree, one at a time, each followed by
`SEARCH_DEEP=1 npx vitest run src/quiescence.test.ts -t A5` and a revert:

| mutant | file | result | rows red |
|---|---|---|---|
| `R2a` (ungated leaf slip, `ply>=3`) | `src/search.ts` | **RED** | kiwipete: expected 205 to be 50; position-6: expected 145 to be 30 |
| `R2b` (leaf slip, capture-dense, K=5) | `src/search.ts` | **RED** | kiwipete: expected 205 to be 50; position-6: expected 120 to be 30 |
| `R2c` (slip inside `quiesce`, K=5) | `src/quiescence.ts` | **RED** | kiwipete: expected 205 to be 50; position-6: expected 120 to be 30 |

`git status --porcelain -- src` was empty after each revert. **This closes the gap the ruling
opened: unlike the prior FAIL decision, where `R2b` and `R2c` survived every lane, all three
mutants in the class — including the ungated `R2a`, which the licence's own re-verification
step did not re-test — now go red on the `A5` depth-3 pins.** No remaining survivor in the
class was found.

## 3. G2 (Architect/Design ruling, closed in-ticket): the coverage check bites, and every deep case stays under 50%

- **Coverage check bites:** `broadSlice("startpos")` was mutated to drop its first position (one
  line, `src/search.test.ts`, reverted after). The `A4` deep "six slices are exactly the broad
  corpus" case reds: `expected 183 to be 184`. The size-sum and name-order assertion is a real
  guard, not a no-op.
- **Deep lane, re-run independently:** `SEARCH_DEEP=1` on both files — exit 0, **94/94 passed, 0
  failed**, wall 118.2 s (this machine is slower than the engineer's 109.2 s reading). Worst
  case: `A4`'s broad-d2 kiwipete slice at **51.4 s / 42.8%** of its 120 s timeout — under 50%,
  consistent with the engineer's 40.1% reading within machine-load variance.
  - `numPassedTests: 94, numFailedTests: 0` (vitest JSON reporter).
- **`A7` slices run alone, cold:** re-ran the worst case, `broad d2 — kiwipete's slice`, with
  `-t`. **45.3 s / 37.8%** of 120 s — matches the engineer's reading to the tenth of a percent.

## 4. Licence conformance

- `git diff --stat 9b4dd68 9a7e549 -- src` is empty (frozen base confirmed).
- `git diff --stat 9a7e549 9d2306c -- src/quiescence.ts src/engine.ts src/evaluate.ts
  src/search.qe.test.ts` is empty — every frozen file byte-identical.
- Every hunk in `src/search.ts` falls inside the licensed ranges (`:26-27`, `:63-69` including
  `:66,:68`, `:112-114/:120`, `:205/:215` through `:209`), matching `:24–27`, `:61–69`,
  `:112–114`, `:204–209`.
- `src/search.test.ts` and `src/quiescence.test.ts` diffs read at the header, the `A1` banner,
  the corpus helpers (`broadSlice`, `corpusRun`), and the `A4`/`A7` deep blocks — matching the
  licensed ranges by content (line numbers drift slightly with the growth already licensed, no
  new area touched).

## 5. Gates — re-run independently, all green

| gate | command | result |
|---|---|---|
| lint | `npm run lint` (`biome check .`) | exit 0, 78 files, no fixes |
| typecheck | `npm run typecheck` (`tsc --noEmit`) | exit 0 |
| build | `npm run build` (`tsc --noEmit`) | exit 0 |
| default lane | `npm test` (`vitest run`) | exit 0, **43 files, 1392 passed, 0 failed** |
| skip-integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | exit 0, `No findings.` |
| `SEARCH_DEEP=1` both files | `npx vitest run src/search.test.ts src/quiescence.test.ts` | exit 0, 94/94, 118.2 s |
| `ENGINE_DEEP=1` | `npx vitest run src/engine.test.ts` | exit 0, **33/33** |

## Not covered / fences held

- QE's diff has **zero lines under `src/`** — every mutant applied for this delta was reverted.
- No line under `AGENTS.md`, `plans/board.md` or the NFR bars was touched by this subtask.
- `NFR-008` is not remeasured here (fenced by the ruling: the split adds cases, not searches).
- The oracle itself (`searchWithoutPruning(p,3)` offline, ~160s/~28s) was not re-run by QE —
  the ruling already ran it and this delta trusts that record, per the subtask's scope (verify
  the delta, not re-derive the whole ticket).
- Production lines > 0 in this ticket, so the UAT waiver does not apply. Nothing merged, nothing
  deployed. The board move is the Orchestrator's.

## Verdict

**PASS.** The prior FAIL's cause (D1–D4 false sentences) is closed and no new false sentence was
introduced. Both routed gaps (G1, G2) are closed in-ticket by the Architect's licensed repair,
and QE's own re-derivation — including the one mutant (`R2a`) the repair hop's own
re-verification step did not re-test — confirms the closure holds. All gates, including both
deep lanes, are green.
