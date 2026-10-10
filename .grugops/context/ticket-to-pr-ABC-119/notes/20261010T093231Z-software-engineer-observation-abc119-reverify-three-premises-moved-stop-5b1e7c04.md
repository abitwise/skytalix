---
id: 20261010T093231Z-software-engineer-observation-abc119-reverify-three-premises-moved-stop-5b1e7c04
kind: observation
by: software-engineer
at: 2026-10-10T09:32:31Z
verified_by:
confidence: high
refs:
  - ABC-119
  - G-06
  - A3
  - A5
  - N8-SPAWN
  - NFR-004
  - AR-NFR004-A
  - NFR-008
  - ADR-0019
  - ABC-045
  - ABC-046
  - plans/tickets/ABC-119-no-test-anywhere-runs-the-delivered-clis-real-engine.md
  - plans/nfr-catalog.md
  - src/cli.test.ts
  - .grugops/queue/claimed/ticket-to-pr-ABC-119/ticket-to-pr-ABC-119.md
supersedes:
---

# `ABC-119` re-verified at `a8d275b`: three criterion premises have moved. STOP before any code. BA/PM re-scores.

Hand-authored, no seal (degraded posture per `AGENTS.md`). The task file's first step is to
re-verify the page, which was cut 2026-08-21 at `main` @ `565c623`. Its rule is: "If a
criterion's premise moved, write an observation note and STOP". Three premises have moved, so
this hop stops. **No test file was written. No `src/` byte changed. No lane was measured, because
there is no lane.** The machine was heavily loaded the whole time (1-min load 23–26, with QE
`ABC-127` deep runs and the `ABC-128` build running in parallel). Every timing below is a reading
under that load, not a quiet-machine figure.

## Moved premises, which block the criteria as written

| # | page says | tree says at `a8d275b` | criterion hit |
|---|---|---|---|
| P1 | `sed -n '28,35p' plans/nfr-catalog.md \| shasum -a 256` = `63f66795…ca31`, on 8 rows | Lines 28–35 are no longer the rows. Their hash is `421ccf0e…e8b3` and they hold template comment lines. The rows now sit at lines **37–44**. Using `ADR-0019`'s defined byte range (`grep -E '^\| NFR-00[1-8] \|'`), they hash to **`7dfc86fa…97ec`**. That is neither `63f66795…` nor `ADR-0019`'s `eee4dfff…`, because `NFR-005` was edited after it (`d7165a5`, 2026-09-26) | **`A5`.** The literal check fails on the base for every possible build. It cannot be met |
| P2 | `N8-SPAWN` ceiling is `17 + 7 = 24`, 7 of 7 spent. A deep child inside `src/cli.test.ts` needs `expect(spawned).toBe(17 + 7)` both ways (`## Dependencies`, `:72`, `:193`) | `src/cli.test.ts:1832` `const N8_SPAWN = 17 + 7 + 1 + 2;` = **27**. It was raised at `ABC-045` (`b8afa30`) and `ABC-046` (`6cdde15`), both 2026-09-19 | **`A5`'s conditional clause and the item-5 named stop.** The literal the page quotes is stale, and so is the placement arithmetic behind the opt-in ruling. The ruling probably still holds (see below), but the page's numbers are not the tree's |
| P3 | `A3`(ii): the real reply "arrives within `NFR-004`'s ≤ 3 s at default difficulty, measured on the child", and "a criterion that would go red on a different machine … is not a criterion" | `DEFAULT_BUDGET_MS = 3_000` (`src/engine.ts:122`). The catalog already records clause A as **NOT MET, `AR-NFR004-A`**: it is missed by ≤ 31 ms on 27–29 of 30 calls at `budgetMs = 3000` (`plans/nfr-catalog.md:1263-1279`). Measured here as stdout timing from the first board to the reply board, two children: **3.007 s and 3.003 s**. Whole process: 3.17 / 3.20 / 3.21 s real | **`A3`(ii)** is red by construction on the real engine. Its pass or fail depends on abort granularity, so it fails the page's own machine-independence rule. The page's own 3.07 s whole-process reading was already over 3 s at the cut |

## Premises that HOLD (re-checked, for BA/PM's re-score)

- **The gap is real and unchanged.** There are still four `export const DEFAULT_BUDGET_MS = 0` substitutions in
  `src/cli.test.ts` (`:595`, `:617`, `:732`, `:750`). The textual wiring regex has moved
  from `:2447` to **`:2512`**, with the same pattern. `src/cli.ts:175` still composes
  `engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS })`. No test spawns the CLI on the real engine.
- **`A1`'s ≥ 1.0 s floor has wide margin.** Real child exit 0, 3.17–3.21 s wall (load ~23–26).
  `--colour black` with `</dev/null` still plays one engine ply, then prints `input ended`.
- **The precedent holds and has grown.** Ten `src/` files now read a `*_DEEP` variable (the page says four lanes).
  `src/engine.test.ts:73`/`:931` still uses the `if (RUN_DEEP) { describe(...) }` form.
  `vitest` is still `^3.0.0`. The two construction traps were **not** re-run, because no build was started.
- **The opt-in ruling itself is not weakened.** At ~3.2 s per real child, one default-lane child
  still breaches the per-child CPU clause by an order of magnitude, whatever the ceiling's value.
- **The `NFR-008` level moved** from 13 s to 15 s CPU (`ADR-0019`, owner, 2026-09-19). The page's
  "~16.5–17.3 s CPU against … 13 s" reading is stale. `N8-LANE`'s 650 ms is unmoved. This blocks
  nothing on its own, because the page claims no `N8-LANE` line.

## What BA/PM would need to rule (proposals only, not taken)

1. **`A5`:** replace the literal line-range hash with a check that cannot drift. Either
   `git diff --numstat main...HEAD -- plans/nfr-catalog.md` empty (already in `A5`), or the
   `ADR-0019` byte range with the hash re-read at the pull.
2. **`A5` / item 5:** re-state the ceiling as `const N8_SPAWN` byte-identical (currently `17 + 7 + 1 + 2`),
   not as the literal `17 + 7`. Or rule the lane OUT of `src/cli.test.ts`, which removes the
   conditional entirely.
3. **`A3`(ii):** choose one of these. (a) Bound the reply at `NFR-004`'s **5 s hard ceiling**. The measured ~3.0 s leaves
   ~2 s of headroom. `AR-NFR004-A`'s ~3 ms residual over 5 s applies only when a caller passes a
   budget above 5 s, and the CLI does not. (b) Bound it at 3 s plus `AR-NFR004-A`'s recorded 31 ms. (c) Drop (ii) and keep
   `A1`'s floor. **This hop does not pick one.** Choosing between them is a criterion decision, not an engineering one.

Gates were run on the stop commit (notes plus trace only, 0 `src/` lines). The receipts are in the hop's report and in the
trace row, not here.
