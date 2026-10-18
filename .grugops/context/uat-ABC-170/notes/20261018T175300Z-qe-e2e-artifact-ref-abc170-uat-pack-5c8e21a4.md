---
id: 20261018T175300Z-qe-e2e-artifact-ref-abc170-uat-pack-5c8e21a4
kind: artifact-ref
by: qe-e2e
task: uat-ABC-170
at: 2026-10-18T17:53:00Z
verified_by:
confidence: high
refs:
  - ABC-170
  - ABC-167
  - ADR-0044
  - EPIC-007
  - NFR-005
  - src/engine.ts
  - plans/tickets/ABC-170-the-engine-takes-two-optional-limits-maxdepth-and-maxnodes.md
  - 20261018T174100Z-orchestrator-decision-owner-word-abc170-a6-timing-ok-uat-by-qe-7f3a9c14
  - 20261018T132300Z-qe-e2e-decision-abc170-verdict-pass-with-gaps-09d90757
  - .grugops/context/uat-ABC-170/probe/
supersedes:
---

# UAT pack `ABC-170`: the engine's two optional limits, `maxDepth` and `maxNodes`, in a caller's words

This note is hand-authored and unsealed. `context-io.ts` is not on this install and `human_admission` is
`off` (`AGENTS.md` § Test and UAT authority), so no `finding` is admissible. It points at a throwaway
harness, not a UAT spec, so it carries no `sha`, `gate_run` or `content_hash`.

**Who wrote this pack.** QE/E2E wrote it, because the owner chose that role on 2026-10-18 (`…7f3a9c14`).
The UAT Planner and BA/PM hops of Workflow 06 were not run, by the owner's word. **Only the owner's own word
signs this UAT.** This pack does not sign it, and neither does a green run.

## Scope / Risks (cited from the ticket page, authoritative)

- Scope: `src/engine.ts` gains two optional `EngineOptions` fields, `maxDepth` and `maxNodes`, which can only
  shorten a search. `src/engine.test.ts` gets the `A4` amendment and new rows.
- Risk: "absent = today" can break silently (test note 1). `A2`'s identity check is what proves the aborted
  iteration is discarded (test note 2).

## UAT goal

Decide whether a caller of `src/engine.ts` gets what `ABC-170` promises:
- passing no limit gives today's engine, move for move;
- `maxDepth: N` stops at depth N;
- `maxNodes: K` stops near K nodes and plays the last depth it finished;
- the limits and the clock combine, and whichever comes first stops the search;
- the 5 s ceiling still holds whatever the limits say.

## What this ticket can and cannot show

`ABC-170` changes the engine's API only. **No CLI and no UCI command passes the limits yet.** `ABC-167` maps
`go depth` / `go nodes` / `go mate` onto them, so `npm run chess` cannot show the new limits. Each scenario
therefore calls the engine's public API (`chooseMove`, `createEngine`) and the game's own caller of it
(`createLevel`). Every call runs on a **virtual clock** (`ADR-0027`). A virtual millisecond is not a real
one: "t=51v" in the run output is a node-count figure, not a time. What only `ABC-167` can show is listed in
`…e4d07b39`, and none of it is graded here.

## Entry criteria

| criterion | state |
|---|---|
| Built and QE'd | QE `PASS_WITH_GAPS` at `64b07741` (`…09d90757`); the one gap QE asked to fix first (`QE-170-a`) was fixed at `52f504f6`, tip `36e3a753` |
| Waiver tested | `git diff --name-only main...grugops/ABC-170 \| grep -v '\.test\.ts$' \| grep '^src/'` → `src/engine.ts`. Production lines are present, so the UAT is conducted |
| Tree under test | `grugops/ABC-170` @ `36e3a753`, in a fresh worktree on `grugops/uat-ABC-170`. `src/engine.ts` md5 `3ce3a251…` before and after every run |
| Today's engine, for comparison | `main` @ `af3769e3`, `src/` extracted with `git archive` to a scratch directory. Its `src/engine.ts` is byte-identical to the `ABC-170` base `358810ac` (md5 `93ea8ad7…` both) |
| Gate at that tip | lint, typecheck, build exit 0; `npm test` exit 0, 58 files, 1844/1844, `last-run.json` `success: true`; integrity at skip 0 `No findings.` (`…a91f6c30`) |
| Security/NFR | No trigger fires (ticket § Security / NFR triggers). `A6` (`NFR-005`) is **OWNER-RULED, NOT MEASURED** (`…7f3a9c14`) |

## Who and what

- **Signer:** the owner, Olger Oeselg, by his own word in session (`AGENTS.md`, 2026-08-16 ruling).
- **Conductor:** QE/E2E (agent). It runs the harness and reports the result. It never signs.
- **Test data (fixed before the first run, not changed afterwards):**
  - the six perft roots of `src/perft.test.ts:21-52`: `startpos`, `kiwipete`, `position-3` to `position-6`;
  - the six `ENDGAME_CORPUS` positions of `src/engine.test.ts:101-109`: `kq-corner`, `kr-corner`, `kqk-h8`,
    `kp-vs-k` (`8/8/8/4k3/8/8/4P3/4K3 w - - 0 1`), `krk-a-file`, `pawn-race`;
  - Kiwipete is `r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1`;
  - clocks: `tickingClock(1)` (1 virtual ms per read) for the engine rows; `virtualClock(100)` for the levels;
    RF-1's fused counting clock (2 500 per read, fuse 64) for the ceiling;
  - budgets: 5, 10, 20 and 50 virtual ms, the ceiling (5 000), and `Infinity`;
  - level seeds 1, 2 and 3, for each of the five levels.

## Scenarios, expected results and pass/fail

| # | in a caller's words | criterion | how it is exercised | passes when |
|---|---|---|---|---|
| S1 | **No limit given = today's engine, the same move.** | A3, A6 (behaviour only) | All 12 positions × budgets 5 and 50 × the three engine doors. Today's engine with no limit, against the tip four ways: no field, explicit `undefined`, `maxDepth 1000 / maxNodes MAX_SAFE_INTEGER`, and `Infinity / Infinity` | All five fields (move, score, depth, nodes, elapsed) equal today's, every time, and the position is unchanged |
| S2 | **The game's own callers behave as before.** | A3, A7 | `createLevel` for levels 1–5 × seeds 1–3, each answering startpos, Kiwipete and kp-vs-k in a row on one instance. The engine seam `createEngine` on four positions | Tip and today give the same choice: kind, move, depth, nodes, elapsed and the blunder scores. Legal move, position unchanged |
| S3 | **`maxDepth: N` never reports a depth above N, and the move is legal.** | A1 | The `A1` fixture literally: kp-vs-k at 10 v, unlimited (must reach ≥ 6), `maxDepth 3` and `maxDepth 1`. Then `maxDepth` 1–8 on startpos, Kiwipete, position-3 and kp-vs-k at 50 v | `A1`: depth 3 with `search(p, 3)`'s move and score; depth 1 with a legal move. Sweep: depth = min(N, unlimited depth), never above N, never more nodes than unlimited, legal, unchanged |
| S4 | **`maxNodes: K` stops near K, plays the last depth it finished, and leaves the board alone.** | A2 | The `A2` fixture literally: Kiwipete at the ceiling, `maxNodes 20000` and `maxNodes 1`. Then K = 5 000, 20 000, 60 000 on four positions | `A2`: 20 000 ≤ nodes ≤ 21 024; move and score equal `search(p, d)`'s and a `maxDepth d` run's; `maxNodes 1` gives depth 1, legal. Sweep: nodes ≤ max(K, depth-1 cost) + 1 024; move, score and depth equal a `maxDepth d` run's (the discard); legal, unchanged |
| S5 | **The limits combine with the clock: whichever comes first. The ceiling still holds.** | A5 | (a) clock first: 5 v plus generous limits; (b) depth first; (c) nodes first; (d) both limits, each tighter in turn; (e) `budgetMs: Infinity` plus a huge limit on the fused clock | (a) identical to unlimited; (b) depth 3, fewer nodes, less virtual time; (c) returns before the ceiling; (d) equals the tighter limit alone; (e) the same clock-read count and answer as without the limit |
| S6 | **The limits pass through the engine seam a session uses.** | A1, A2 | `createEngine({ …, maxDepth })` and `({ …, maxNodes })` | The seam's move equals `chooseMove`'s with the same options |

**A4** is a source-text criterion (the `A4` describe's pins). Its caller-visible half is "no hidden depth
cap when no limit is given", which S1 (against today) and S3/S5a (`maxDepth` 7, 8 and 50 equal unlimited)
cover. The text pins themselves were re-read at entry and are green in the lane.
**A6** is OWNER-RULED, NOT MEASURED. No scenario reads or grades speed.
**A7** is a fence. Its caller-visible half is S2. The fence itself was re-measured at entry (`…a91f6c30`).

## Known limitations (said before signing, not after)

1. **No in-game or UCI evidence.** Nothing here plays `npm run chess` or sends `go depth`. The UCI mapping,
   including `go mate N → maxDepth 2N−1` (`ADR-0044` D12), is `ABC-167`'s (`…e4d07b39`).
2. **`A6` (`NFR-005`) is OWNER-RULED, NOT MEASURED.** The owner said *"timing seems ok"*. No timing reading was
   taken, and no depth or time is quoted or estimated for `A6` anywhere in this pack.
3. **A hidden `maxNodes` default is invisible to this UAT too.** A harness control with a 60 000-node default
   passed all six scenarios (`probe/controls.txt` C4), as it passed QE's lane (`QE-170-b`). Only `maxDepth`
   has a text pin against a default.
4. **No committed `uat/*.uat.spec.ts`.** This is a local CLI with no browser e2e lane. The harness is kept under
   `ref:` as an authoring aid. The suite's `ABC-170` rows in `src/engine.test.ts` are the re-runnable evidence,
   and they were green at the tip.
5. **Edge values are not graded.** `maxDepth 0`, negative, `NaN` or fractional values, and `maxNodes` below the
   depth-1 cost, behave safely (QE's probe B, `QE-170-g`) but the ticket does not specify them. `ABC-167` should
   validate `go depth 0` and small `go nodes N` itself.
6. **Not graded:** mutants and coverage (QE's), lane cost and timing.

## Rollback

Nothing ships. `ABC-170` is unmerged on `grugops/ABC-170`, and no caller passes either field. To roll back, do
not merge the branch, or revert `src/engine.ts` and `src/engine.test.ts` to the merge base. No other module
changes.

## Signoff checklist (the owner answers each with one word)

| # | question | the owner's word |
|---|---|---|
| 1 | Do S1–S6, as written above, describe what you want from the two limits on their own? | |
| 2 | Do you accept that the UCI half (`go depth` / `go nodes` / `go mate`, and `mate N → maxDepth 2N−1`) is proven on `ABC-167` and not here? | |
| 3 | Do you accept `A6` as recorded: OWNER-RULED, NOT MEASURED, on your word *"timing seems ok"*? | |
| 4 | Do you accept the run's result (`…b7a3f0d2`): 6 of 6 scenarios PASS, 401 of 401 checks? | |
| 5 | **Overall: do you accept `ABC-170`?** (accept / reject) | |

## Exit criteria

- **Accepted** when the owner gives his word in session to question 5 (or to the one-line question in
  `…d19e6c57`). The agent then transcribes that word; it is never a `human:<name>` stamp.
- **Not accepted** on a "no" or "reject" to any row. The reason goes back to the Orchestrator, who routes it.
- The board move out of `In UAT` is the Orchestrator's. This pack moves nothing.

## Where things are

| path | what |
|---|---|
| `probe/uat-harness.ts` | The harness. `node uat-harness.ts <tip tree> <today's tree>` runs S1–S6 and prints PASS/FAIL lines. It writes nothing |
| `probe/harness-RUN-1.txt` | The recorded run at `36e3a753`. A second run was byte-identical (sha256 `4ac8df2d…` both) |
| `probe/controls.txt` | Four negative controls run on scratch copies of the tip (C1–C4): what the harness catches and what it misses |
