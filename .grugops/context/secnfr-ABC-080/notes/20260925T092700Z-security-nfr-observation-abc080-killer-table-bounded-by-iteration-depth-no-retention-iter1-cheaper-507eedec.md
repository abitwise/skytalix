---
id: 20260925T092700Z-security-nfr-observation-abc080-killer-table-bounded-by-iteration-depth-no-retention-iter1-cheaper-507eedec
kind: observation
by: security-nfr
at: 2026-09-25T09:27:00Z
verified_by:
confidence: high
refs:
  - ABC-080
  - AR-QS-ITER1-079
  - NFR-009
  - src/search.ts
  - src/engine.ts
  - src/cli.ts
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-killers.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-drift.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-harness-iter1.mjs.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-killers.json.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-drift.jsonl.txt
  - .grugops/context/secnfr-ABC-080/notes/raw-out-iter1.jsonl.txt
supersedes:
---

# ABC-080 security (ASVS L1, resource bounds): killer table bounded by iteration depth, one per call, collected; no growth across calls; iteration 1 got 4–6x cheaper

Hand-authored, with no `seal`. This was checked by reading and by measurement, not inherited from
the ticket's *"Security — not triggered"*.

## 1. Killer-table bounds (ply index vs `MAX_PLY`)

**There is no `MAX_PLY` for the main tree, and none is needed.** `QUIESCENCE_MAX_PLY = 8` is the
only ply cap in `src/`, and it guards the capture search, which records no killers.

**Why the bound holds anyway.** Reading `KillerTable` (`src/search.ts`):
- It holds a `Move[][]` indexed by `ply`.
- `at(ply)` returns `slots[ply] ?? NO_KILLERS`. An out-of-range read is an empty list, never a throw.
- `record` writes at most 2 entries per ply: newest first, a duplicate skipped, captures and
  promotions rejected.

`ply` is an integer that starts at 0 or 1 and increments by 1 per recursion. `record` fires only
at a node with `remaining ≥ 1`, so **the highest recorded ply is below the deepest iteration
started**. Iteration depth is bounded by the 5 s `HARD_CEILING_MS` clamp, and each iteration's
cost grows with depth.

**Measured** (`raw-harness-killers`, `KillerTable.prototype` wrapped, the real `slots` read after
each call, `budgetMs` 5 000, i.e. the ceiling):

| position | depth reached | max ply recorded | `slots.length` | largest slot | tables per call |
|---|---|---|---|---|---|
| startpos | 7 | 7 | 8 | 2 | 1 |
| kiwipete | 6 | 6 | 7 | 2 | 1 |
| position-3 | 8 | 8 | 9 | 2 | 1 |
| position-6 | 6 | 6 | 7 | 2 | 1 |
| KPvK | 12 | 12 | 13 | 2 | 1 |
| **locked pawns, kings only** | **14** | **14** | **15** | 2 | 1 |
| KRvK | 9 | 9 | 10 | 2 | 1 |
| a mate-in-1 board | 8 | 7 | 8 | 2 | 1 |
| queens rig | 6 | 6 | 7 | 2 | 1 |

- **The worst case is 15 slots × 2 move references (30 references) per call**, at the 5 s ceiling
  on the lowest-branching board tried.
- Even a pathological ply in the hundreds would be a sparse JS array of that length. That is not
  an exhaustion vector.
- The recursion stack is the binding limit on depth, and it was measured at `ABC-079`'s gate: about
  21 frames at KPvK against a Node budget of about 10 387.

## 2. Allocation per node

**Yes, there is allocation at every ordered node.** `orderMoves` allocates:
- one `{move, key}` wrapper per legal move;
- one mapped array, sorted in place;
- one output array;
- one `findIndex` callback per quiet move while killers are present.

`KillerTable.record` allocates a 1–2 element array per new killer. Measured on kiwipete at d5, this
is **6 560 `orderMoves` calls against 157 042 nodes (4.2%)**, because leaf and quiescence nodes are
not ordered.

**Price:** the plain-node rate falls 17% on kiwipete and 7% on position-6 (the NFR observation
beside this one). It is bought back as +3 and +2 plies. All of it is short-lived garbage, bounded by
nodes visited inside the 5 s ceiling. **No security relevance.**
- `V2.4.1` (anti-automation / resource limits) is **L2**, out of scope at L1.
- The process is a local single-user CLI that deploys nowhere (`ADR-0007`), and only the player at
  the keyboard can steer it.
- A lever exists (key the moves into a reused buffer), but it is **not required**. It is named, not
  asked for, because adding it here would be gold-plating.

## 3. Unbounded growth across a `chooseMove` call

- **None.** `chooseMove` builds `new KillerTable()` per call, in its `budget`, and nothing else
  holds it. Wrapping showed exactly one table per call.
- 11 of 12 tables were finalized after forced gc; the 12th had not been finalized when the probe
  read.
- **Heap after gc across consecutive calls** (`raw-harness-drift`, kiwipete, 300 ms, 40 calls):
  - This build: 7.78 → 7.93 MiB (+0.15).
  - Base `4f74acc`, which has no killer table: 7.74 → 7.86 MiB (+0.12).
  - **The drift is the process's (JIT/code), not `ABC-080`'s.**
  - The 12-call run at 1 s read 8.56 → 8.62 MiB.
- `NFR-009` (search-held memory, being placed by `place-nfr009` right now) is `ABC-081`'s bar.
  This ticket's search-held state is the killer table above, at tens of references. This is
  reported, not graded against a row that is not placed yet.

## 4. The unabortable first iteration (`AR-QS-ITER1-079`'s revisit trigger: > 500 ms)

`raw-harness-iter1` ran with `budgetMs` 0, so only iteration 1 runs, 5 repetitions per arm:

| board | base `4f74acc` | this build |
|---|---|---|
| worst reachable (`secnfr-ABC-079`'s 20 096-position sweep) | 32 980 nodes, 92.8–110.4 ms | **5 574 nodes, 17.7–29.2 ms** |
| worst constructed (queens rig) | 87 231 nodes, 263.8–269.2 ms | **19 585 nodes, 65.3–66.6 ms** |

**Ordering the root made iteration 1 4–6x cheaper.** Captures are searched first, so alpha rises
early and the children's quiescence cuts sooner. The accepted risk got smaller, and none of its
revisit triggers fired. The 20 096-position sweep itself was not re-run, because the two boards
above are that sweep's worst cases.

## 5. The rest of ASVS L1 on the diff (`4f74acc..cb8ca55 -- src`)

| requirement | result | evidence |
|---|---|---|
| V1.3.2 [L1] dynamic code | pass | none of `eval`, `new Function`, `import(`, `require(` in the added production lines |
| V2.2.1 / V2.2.2 [L1] input validation | pass | no new input. `src/cli.ts` and `src/turn-loop.ts` are unchanged over the range. The start is the constant `START_FEN` (`src/cli.ts:79`), the budget is `DEFAULT_BUDGET_MS` (`:175`), user moves are resolved against `legalMoves` |
| V15.2.1 [L1] components | pass | `package.json` / `package-lock.json` unchanged over the range |
| I/O, secrets, logging, clock | pass | no `process.`, `console.`, `fs`, `child_process`, `net`, `Date.now` or `setTimeout` in the added production lines. The position is byte-identical on return and on abort (`finally` unmake, unchanged) |
| all other L1 chapters (HTTP, files, auth, sessions, tokens, OAuth, crypto, deployment) | n/a | no such surface in the change |

**Incidental, outside this change and not a finding against it:**
`/Users/olgeroeselg/Projects/hacks/grugops-examples/cli-chess-example/node_modules/node_modules`
is a symlink to its own parent, dated 2026-09-19 (an earlier hop's). It makes `diff -r` report a
directory loop. It is harmless to the runs here. This gate did not touch it, and it is left for
whoever owns the checkout.
