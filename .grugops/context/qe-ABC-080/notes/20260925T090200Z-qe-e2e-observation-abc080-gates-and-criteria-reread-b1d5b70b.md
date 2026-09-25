---
id: 20260925T090200Z-qe-e2e-observation-abc080-gates-and-criteria-reread-b1d5b70b
kind: observation
by: qe-e2e
at: 2026-09-25T09:02:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - ABC-079
  - NFR-005
  - N8-LANE
  - src/search.ts
  - src/engine.ts
  - src/search.ordering.test.ts
  - src/quiescence.test.ts
  - src/engine.test.ts
supersedes:
---

# ABC-080 QE gates reproduced at `cb8ca55`; criteria re-read against the ticket, not the build

Hand-authored per `agent-factory/contracts/context-note.md`, no `seal` (degraded posture
`AGENTS.md` records: `context-io.ts`/`claim.js`/`mcp__grugops__propose_note` absent from this
install, `context.human_admission` is `off`; no `finding` is admissible here). Worktree
`.claude/worktrees/qe-ABC-080` on branch `grugops/qe-ABC-080`, base `5f8c4ae` (which carries the
build at `cb8ca55`), `node_modules` symlinked from the main checkout. NOT merged, NOT pushed.

## Gates, reproduced independently

- `npm run lint` — Biome, 79 files, no fixes applied, exit 0.
- `npm run typecheck` / `npm run build` (same command, `tsc --noEmit`) — exit 0.
- `npm test` — **44 files / 1 418 passed / 0 skipped**, matches the build's own reading.
- Skip-count capture (`npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'`) — `0`.
- `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` — `No findings.`, exit 0.
- `SEARCH_DEEP=1 npx vitest run src/search.test.ts` (the `AGENTS.md` command slot) — 57/57, 39.5 s.
- `ENGINE_DEEP=1 npx vitest run src/engine.test.ts` — **33/33, 116.6 s**, matches the build's 33/33.
  This run's own printed readings: `A1` worst case 3 040 ms at completed depth 5, 27/30 over 3 s;
  `NFR-005` kiwipete completed depth 4 (155 402 nodes, 3 016 ms), position-6 completed depth 4
  (149 790 nodes, 3 024 ms) — in line with the build's own vitest reading (also depth 4/4), and
  neither reading is an `NFR-005` verdict (Security/NFR's).

## Criteria, read on my own against the ticket page, not against the build's claim

- **`A1`/`A2`/`A5`** — code inspection plus the default and deep lanes confirm the shape:
  `orderMoves` never adds or drops a move (it maps the input array 1:1 and sorts), the hash-move
  arm is `null` on every call site in both `src/search.ts` and `src/engine.ts` today. **MET.**
- **`A3`** — `src/search.ordering.test.ts`'s default-lane guard (position-6 depth 2) and deep-lane
  reading match the build's figures exactly on re-run. **MET.**
- **`A4`** — re-ran the exact default-lane pin (position-6 depth 2: none 9 804 / MVV-LVA 3 391 /
  +killers 2 467) unmodified — reproduces. The delete rule at depth 5 (killers −5.7% kiwipete,
  −20.5% position-6) is the deep-lane's own reading, reproduced above under `ENGINE_DEEP`/`SEARCH_DEEP`.
  Hash-move column correctly reported NOT YET MEASURABLE, per the ticket's own dependency clause
  (`ABC-081` is not a blocker). **MET as reported.**
- **`ABC-079` QE `G4`** — `search(PROMOTION_CAPTURE_FEN, 3).nodes === 275` reproduces in the
  default lane; dropping the promotion term in `mvvLvaKey` is the mutant that reds it (see the
  mutant note). **Closed, confirmed.**
- **`A6`** — the instrumented `search.ordering.test.ts` suite (wraps `makeMove`/`unmakeMove` to
  read the true ply, spies `KillerTable.prototype.at`/`record`) reproduces: every offer traced to
  a record at the same ply of the same table. Code inspection of `src/search.ts`'s `negamax`
  confirms `killers.record(ply, move)` fires only inside `if (alpha >= beta)`, and only for a
  quiet move (`move.captured === EMPTY && move.promotion === EMPTY`, checked first thing inside
  `KillerTable.record`). `src/engine.ts`'s `negamax` is byte-for-byte the same shape
  (`budget.killers.record(ply, move)` inside its own `if (alpha >= beta)`). **MET.**
- **`A7`** — not reproducible inside this tree (it compares two builds; the build's own
  `probe/a7.mjs` measured it against the git-archived pre-`ABC-080` tip). Re-ran the build's
  in-tree half only: `ENGINE_DEEP=1`'s `NFR-005` case above reads depth 4/4 under vitest, in line
  with the build's own vitest reading (also 4/4) and below its plain-node reading (6/5) for the
  same reason the build named — the runner costs about a ply, not investigated by either hop.
  Not re-verified against the pre-ordering tip; taking the build's `A7` claim on its own probe,
  not independently re-run. **UNKNOWN — verify (not independently reproduced across two builds).**

## Comments — spot-checked by the `ABC-114` standard (true, not merely plausible)

Re-derived, not trusted: `src/engine.test.ts`'s `A3` comment claims depth 1 = 38, depth 2 = 153,
depth 3 = 2 551 nodes on `A3_FEN` after ordering. Ran `search(parseFen(A3_FEN), d)` for `d` in
`[1,2,3]` directly (`.grugops/context/qe-ABC-080/probe/verify-a3.mjs`): **38 / 153 / 2 551 —
exact match.** `src/search.ordering.test.ts`'s pinned node counts (position-6 d2: 9 804 / 3 391 /
2 467; the 275-node promotion fixture) reproduce unmodified in the default lane run above. No
false comment found in the sample checked; a full sentence-by-sentence audit of every new
docblock was not performed (time-bounded).
