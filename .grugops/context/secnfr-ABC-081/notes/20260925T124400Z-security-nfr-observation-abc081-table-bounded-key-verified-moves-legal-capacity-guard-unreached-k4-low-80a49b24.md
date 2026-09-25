---
id: 20260925T124400Z-security-nfr-observation-abc081-table-bounded-key-verified-moves-legal-capacity-guard-unreached-k4-low-80a49b24
kind: observation
by: security-nfr
at: 2026-09-25T12:44:00Z
verified_by:
confidence: high
refs:
  - ABC-081
  - ADR-0025
  - ADR-0002
  - ADR-0006
  - ADR-0007
  - NFR-004
  - NFR-009
  - src/transposition.ts
  - src/search.ts
  - src/engine.ts
  - src/zobrist.ts
  - src/cli.ts
  - .grugops/context/qe-ABC-081/notes/20260925T110400Z-qe-e2e-observation-abc081-mutant-resample-and-a4-gap-hunt-c2d5f8a3.md
  - .grugops/context/ticket-to-pr-ABC-081/notes/20260925T104900Z-software-engineer-observation-abc081-27-mutants-25-killed-k3-survives-k4-hangs-g1-closed-4fce0ed5.md
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-runaway.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-runaway-hunt.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-runaway-hunt2.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-harness-cage.mjs.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-runaway.jsonl.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-runaway-hunt.json.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-runaway-hunt2.json.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-cage.jsonl.txt
  - .grugops/context/secnfr-ABC-081/notes/raw-out-nfr009.jsonl.txt
supersedes:
---

# ABC-081 security (ASVS L1, block on high): the table is index-safe, hits are key-verified, no stored move is replayed without legality, and the capacity guard is unreached in play. K3/K4 is LOW

Hand-authored, with no `seal`. This was checked by reading `6033d05..504f046 -- src` and by
measurement. It was not inherited from the ticket's *"Security — not triggered"*. The rule items
are those of the queue task (item 6), in its order.

## 1. Table index bounds (hash → slot)

- **In range by construction.**
  - `slot = Number(key & INDEX_MASK)`, where `INDEX_MASK = BigInt(2^18 − 1)`, so
    `0 ≤ slot ≤ 262 143`.
  - All three arrays are `2^18` long.
  - Keys are non-negative 64-bit values: every `zobrist.ts` step is `& MASK64`, and the key array
    is a `BigUint64Array`.
- **Packed-word fields fit their bits** (`src/transposition.ts`):
  - move: from and to are 0x88 squares ≤ 119, in 7 bits each; the promotion is an uncoloured piece
    type 0 or 2–5 (`PROMOTION_PIECES`), in 3 bits;
  - bound: 1–3 in 2 bits;
  - depth: 13 bits, so ≤ 8 191.
  - `depth << 19` sets bit 31 from depth 4 096 upward. `Uint32Array` stores it modulo 2^32 and
    `>>>` reads it back, so this is correct up to 8 191.
- **The key array (`BigUint64Array(129)`) is in range too.**
  - The highest write is `keys[ply + 1]`, and it runs only when `ply < 128`, because a node at
    `ply ≥ 128` returns as a leaf before its move loop. So the index is ≤ 128.
  - `repeatsInPath` reads only indices ≥ `max(0, ply − halfmoveClock)`.

## 2. Full-key verification on hit (no collision-driven wrong move)

- **Present.** `probeTable` returns a slot only when `words[slot] !== 0` and
  `keys[slot] === key`, the full 64 bits. Mutant T7 (no key check) dies on two unit rows, per the
  build ledger and re-sampled by QE.
- **The residual is a true 64-bit Zobrist collision.**
  - Its probability is about (probes per move) / 2^64. At about 1.3M probes per move at the 5 s
    ceiling, that is about 7 × 10⁻¹⁴ per move.
  - Its consequence would be a wrong SCORE for one node. **It would never be an illegal move**
    (section 6).
  - Not a finding.
- The key covers side to move, castling rights (`ADR-0006`'s `G6` pair, 830 / 820, keys
  differ) and the en-passant file.
- **The key does not cover the path or the halfmove clock.** That is the graph-history
  interaction the build accepted, which is chess correctness, not a security property. It is not
  re-ruled here.

## 3. Key-array capacity guard and the hang class (QE K3 / K4): rated **LOW**

**Is the guard reachable in play? Measured: no.**

`chooseMove`'s deepening loop has **no depth cap** (`for (iteration = 2; now() < deadline;
iteration++)`). Because of that, this gate went looking for a board whose tree dies out, which
would let the iteration depth run away past 128, or past the 13-bit field's 8 191.

| probe | boards | deepest completed iteration at 5 s | legal-list check |
|---|---|---|---|
| `raw-harness-runaway`: 12 low-branching and reference boards (KPvK, locked pawns at halfmove 0 and 90, KRvK, KQvK, KBNvK, mate-in-1, perpetual-check rig, …) | 12 | **18** (locked pawns); the `secnfr-ABC-080` gate read 14 on that board | 12 / 12 |
| `raw-harness-runaway-hunt` + `raw-harness-cage`: 200 000 random king placements on 8 locked-pawn skeletons; kept boards where both sides have ≤ 2 legal moves; then the hits at 5 s | 2 distinct | **40** (`K7/8/k7/p1p1p1p1/P1P1P1P1/8/8/8 w`; the base reads **18**) | not run |
| `raw-harness-runaway-hunt2`: 400 000 random kings + 2–8 random pawns, same filter | **0 candidates** (the filter found none; recorded, not hidden) | — | — |

- **The deepest iteration seen is 40, against a capacity of 128.** The table and repetition do
  deepen caged king endings sharply (18 → 40 on the same board, `raw-out-cage`), but the tree
  still grows every iteration.
- **The guard is therefore unreached in play. K3 (guard removed) surviving every lane is a
  defense-in-depth line with no live exposure today.** This confirms QE's trace by measurement.
- **Not proven:** that no legal board has a tree that dies out. Only one shape of board was hunted.
- **If such a board existed, the consequences are bounded:**
  - the clock still bounds every iteration (the ceiling holds);
  - the returned move still comes from the root's legal list;
  - above iteration 8 191 the packed depth would alias. That would break `A1`'s exactness on that
    board and nothing else.
  - **Informational, no owner needed.**

**The hang class (K4: `!(depth >= 1)` reverted to `depth < 1`).**
- **It is reachable only through `search()`'s test-only API.** A caller must pass a non-numeric
  depth, and production never calls `search()`: `src/cli.ts:175` reaches the engine only as
  `createEngine({ budgetMs: DEFAULT_BUDGET_MS })`.
- `chooseMove` itself is bounded against every degenerate budget:
  - `NaN`, zero and negative budgets give depth 1 (`secnfr-ABC-078`/`-079`);
  - `Infinity` clamps to the ceiling, measured here at **5 000.3 ms**.
- **So there is no product exposure and no ASVS L1 requirement fails.**

**The missing OS-level test timeout (QE's operational finding): CONFIRMED, rated LOW.**
- `npm test` is a plain `vitest run` (`package.json`), with `pool: "threads"` and no
  `testTimeout` override (`vitest.config.ts`).
- Vitest's per-test timeout is a timer inside the worker. Synchronous CPU-bound search never
  yields to that timer, which is why the build's and QE's harnesses needed `spawnSync`'s
  `timeout` to stop K4. K4 itself was not re-run here; both hops reproduced it.
- **Why LOW rather than higher:**
  - **the failure is closed.** A hung gate never reports green, so no bad change can merge
    through it;
  - the cost is gate availability and diagnosis time: a stall instead of a red line;
  - it is not a security control.
- **Portability, for whoever takes it:** `timeout` exists on this machine only because Homebrew
  installed it (`/opt/homebrew/bin/timeout`). Stock macOS has no such command. A wrapper written
  on that assumption would break elsewhere.
- **Owners:**
  - a direct capacity-guard test belongs to the **Software Engineer**, at the next licensed touch
    of `src/search.ts`;
  - a process-level timeout on the Test command belongs to **the Orchestrator** (`AGENTS.md`'s
    Test slot, fenced from this hop), with **Olger Oeselg**'s word if it changes a command.

## 4. Allocation per node

- **The table allocates no typed memory per node.** `probeTable`, `tableCutoff`, `storeEntry` and
  `entryMove` read and write the preallocated arrays.
- **There is one key array per search**, 1 032 B. The build's `A6` constructor spy counts 1 per
  `search()` and 1 per `chooseMove`, and mutants K1 and K2 die on it.
- **BigInt temporaries are allocated per node** (`key & INDEX_MASK`, `zobristKeyAfterMove`). They
  are short-lived garbage, bounded by the nodes visited inside the 5 s ceiling.
- **The price, same process** (sibling NFR note): the plain-node rate is kiwipete about +1%
  (base 905k–934k, build 923k–935k nodes in 3 s) and position-6 about −5% (887k–921k against
  855k–866k). It is repaid as +1 ply on position-6.
- **No security relevance.** `V2.4.1` (resource limits) is L2, out of scope at L1. This is a local
  single-user CLI that deploys nowhere (`ADR-0007`).

## 5. Unbounded growth

- **None.**
  - The table is fixed at 4 194 304 B from the first search, and unchanged after 32.
  - `arrayBuffers` read 4.010 MiB after 1 s, after 3 s and after each of 30 further calls.
  - `heapUsed` drift over 30 calls is +0.14 MiB, and the base, with no table, drifts +0.13.
  - Full figures are in the sibling NFR note, `NFR-009`.
- **The table is module state.** It lives for the whole process, and it is cleared at every
  `search()` and every `chooseMove` entry (mutants T8, E1 and S2 die). **So nothing learned
  choosing one move reaches the next.** This matters beyond memory: the session is one player at
  one keyboard, and no data crosses between calls.

## 6. Any stored move replayed without legality

- **None.**
  - `entryMove` returns a move only by finding the packed from/to/promotion in **the node's own
    `legalMoves` list**, and it returns that list's own object. A stale or colliding entry
    therefore yields `null` or a legal move of this position. It never yields a fabricated move.
  - At the root, `chooseMove` searches `legalMoves(position)`, and `runIteration` orders that same
    list, so the returned move is always an element of it.
  - The table's move is only an ordering hint. The stored score is what can cut, and it cuts only
    at the exact stored depth.
- **Measured:** on the 12 runaway boards at 5 s, every returned move was checked against a
  freshly generated legal list, and 12 of 12 are in it (`legal: true` in `raw-out-runaway`). The
  hunt, caged-board, `NFR-004` and ceiling runs returned a move without a throw, but their moves
  were not re-checked. The structural argument above covers them.

## 7. The rest of ASVS L1 on the diff (`6033d05..504f046 -- src`)

The checklist was filtered to L1 at read time (`security.asvs_level` = `L1`). Only the chapters
with a surface in this change are listed.

| requirement | result | evidence |
|---|---|---|
| V1.3.2 [L1] dynamic code | pass | A grep of the added lines in `search.ts`, `engine.ts` and `transposition.ts` for `eval`, `new Function`, `import(`, `require(`, `process.`, `console.`, `fs`, `child_process`, `net`, `Date.now`, `setTimeout`, `Map(` and `Set(` hits only one comment line ("cut**offs**") |
| V2.2.1 / V2.2.2 [L1] input validation | pass | There is no new input path. `src/cli.ts`, `src/turn-loop.ts` and `src/line-input.ts` are unchanged over the range, and the budget is the constant `DEFAULT_BUDGET_MS` |
| V15.2.1 [L1] components | pass | `package.json` and `package-lock.json` are unchanged over the range |
| all other L1 chapters (HTTP, files, auth, sessions, tokens, OAuth, crypto, logging, deployment) | n/a | There is no such surface in the change |

**Findings at high: none. Findings at any severity against an ASVS L1 requirement: none.** The two
LOW items in section 3 are reliability risks with named owners, not ASVS failures.
