---
kind: adr
id: ADR-0041
---
# ADR-0041: vitest's ~5x per-node factor is the module runner's cross-module interop. The one setting that removes it blinds the lane's mocks, so `ABC-150` builds no lever

## Status

**proposed** 2026-10-11 by Architect/Design (task `wave-2026-09-25`, subtask `design-ABC-150`, ticket `ABC-150` `D3`),
on branch `grugops/design-ABC-150` from the wave tip `304bbd9d`. **Owner acceptance owed.**

- This is the ticket's **pre-registered split rule** ("if no such setting exists, no lever is built here").
  On acceptance, `ABC-150` closes on `D1`–`D3`, and this ruling goes to BA/PM with the `D2` table. `L1`–`L5`
  are not run, because there is nothing to read.
- It amends nothing. `ADR-0008` decision 7, `ADR-0035` and `ADR-0040` (k = 3, accepted) stand as written.
- Every figure below is a paired ratio or a pass/fail count from this hop's probe,
  `.grugops/context/design-ABC-150/probe/` (method `METHOD.md`, committed `f24469bf` before the first graded
  run). **No `L1`–`L4` reading was taken, nothing was profiled, and no lane wall or CPU figure exists here.**
- Notes: `.grugops/context/design-ABC-150/notes/`.

## Context

**The factor, re-read (`D1`).** Wave tip `304bbd9d`, Apple M3, Node v26.11.0, vitest 3.2.7, vite 7.3.6, AC power.
The readings are paired and interleaved, with one warm-up call and the median of 5. Each cell has 5 of 5 pairs
usable and 0 void, and the digests are equal on every pair. load1 was 3.23–5.47 and `thermalpressurelevel`
was 1 or 2 before every process.

| workload | vitest ÷ node, median (min–max) |
|---|---|
| E (`engine.test.ts`, `ABC-147`'s) | **5.009 (4.903–5.454)** |
| S (`search.test.ts`, `ABC-147`'s) | **5.106 (4.872–5.395)** |
| P (`perft.test.ts` startpos perft(4), the third, `moves.ts`/`legal.ts`-heavy) | **4.328 (4.127–4.498)** |

- **The stop rule does not fire.** The lowest E or S pair is 4.872x, and the threshold is 1.67x.
- The factor reaches perft, which is pure move generation. This is the `RISK-ABC147-02` question, and it
  is not a stop rule.

**What the runner does to `src/` (read, nothing timed).**
- **The TypeScript transform is not the cause.** For all 37 production files, vite's esbuild output and
  Node's own `stripTypeScriptTypes` output are byte-identical once both are re-printed.
- **The SSR rewrite is the change.** It turns every imported binding into a property read on the runner's
  namespace object, for example `__vite_ssr_import_0__.EMPTY` and `(0,__vite_ssr_import_0__.isOnBoard)(to)`.
  It registers every export as a getter closure, `() => { try { return X } catch {} }`.
- **That namespace object is slow to read** (inspected under `--allow-natives-syntax`). It is
  `Object.create(null)` (`vite-node/dist/client.mjs`), and V8 holds it **without fast properties**
  (dictionary mode), with accessor exports.
- A native namespace has fast properties and data exports.
- So in the engine's inner loops, every constant such as `EMPTY` or `PAWN`, and every helper call such as
  `isOnBoard` or `isBlack`, crossing from one `src/` module into another is a dictionary lookup plus a
  getter call. Plain `node` does a module-binding load instead.

**The candidates (`D2`).** Each varies one thing on the vitest side. Share of the excess removed =
(r_base − r_cand) ÷ (r_base − 1).

| candidate | varied | E | S | P | explains? |
|---|---|---|---|---|---|
| C1 transform / source maps | `test.server.sourcemap: false` | 4.949, **1.5 %** | 5.049, **1.4 %** | 4.212, 3.5 % | no |
| C2 worker thread and flags | `pool: "forks"` (same runner, flags and env, in a process) | 5.133, **−3.1 %** | 5.128, **−0.5 %** | 4.228, 3.0 % | no |
| **C3 cross-module interop** | the same workload as ONE esbuild bundle, still through the runner, its transform, its source map and the worker thread | 0.802, **104.9 %** | 0.812, **104.6 %** | 0.858, 104.3 % | **yes** |
| **C4 runner off for `src/`** | `test.server.deps.external: [<repo>/src/*.ts, not *.test.ts]`: Node imports `src/` natively inside the same worker | 1.011, **99.7 %** | 1.005, **99.9 %** | 0.988, 100.4 % | **yes** |

- **The C3 control** (plain node, bundle ÷ `src/`, paired, n = 5): E 0.894, S 0.880, P 0.910.
  - The bundle itself runs ~10 % faster under plain node. That is why C3 reads above 100 %.
  - Against the bundle on both sides, C3's vitest ÷ node is about 0.90–0.94, so it still removes
    **≥ 100 %** of the excess. The caveat changes nothing.
- **Per the § Context above, the cause is C3, and C4 is the setting family that removes it.**

**Is C4 admissible? (correctness screen, no timing.)** The full default lane was run with C4 layered over the
unchanged `vitest.config.ts`, through a probe config, unprofiled.
- **The control** (same probe config, nothing layered): exit 0, **55 files, 1728 tests, 0 failed**.
- **C4:**
  - **12 files and 47 tests red.** Every one is a call-count or mock-routing assert, for example
    `expected "squareAt" to be called N times`, `"gameStatus"`, `"toSan"`, `"zobristKey"` and `"legalMoves"`.
    The files include `status-panel.nfr`, `history-pane.nfr`, `gameend.nfr`, `san.nfr`, `turn-loop.nfr`,
    `render-seam`, `command-input` and `turn-loop`.
  - **The lane never finished.** `engine.capacity`, `search.capacity`, `search.pvs-lmr` and `transposition`
    (plus `tools/opening-book/book.test.ts`) were still running when the run was killed. Those files mock
    `search.ts`, `zobrist.ts` or `transposition.ts` to stay small. With the mock blind, they run the real
    engine.
- **Why:** a natively imported module imports its dependencies natively. A `vi.mock` or `vi.spyOn(ns, …)` on
  any of them no longer sees its calls.
- **Narrowing C4 does not help.** `graph-check.mjs` collects the modules the lane mocks or spies on through a
  namespace. 17 modules qualify, including `position.ts`, `legal.ts`, `apply.ts`, `evaluate.ts`, `search.ts`
  and `zobrist.ts`. Only modules outside that set whose imports are all outside it can be externalized
  without blinding a guard.
  - That leaves **2 of 37: `puzzle-corpus.ts` and `search.mate-corpus.ts`**, which are data.
  - **Every hot module is mocked itself, or imports one that is.** `moves.ts` imports `position.ts`, which
    `status-panel.nfr.test.ts` mocks.

## Decision

1. **The cause, recorded:** the vitest module runner's **cross-module interop** (C3).
   - Each read of another `src/` module's export goes through a getter on a dictionary-mode,
     null-prototype namespace object.
   - It accounts for **≥ 100 % of the excess on E, S and P**.
   - Source maps (C1) and the worker thread (C2) account for ~0. The TS transform emits the same JavaScript
     plain `node` runs.
2. **The setting: none.**
   - **In vitest 3.2.7, the one config value that removes the factor is C4**, `test.server.deps.external`
     over production `src/`. It removes ~100 % of the excess.
   - **It is not admissible.** It blinds the lane's mock and spy guards: 47 red tests, and a lane that does
     not finish.
   - It disarms instruments, which is the same failure class `ADR-0008` decision 7 forbids for
     `isolate: false`.
   - The only narrowed form that keeps every guard armed covers two data files and none of the engine.
   - **Under the ticket's split rule, no lever is built in `ABC-150`.**
3. **Recorded so nobody rediscovers it.** Do not add a `server.deps.external` (or `deps.external`) entry that
   matches a production `src/` module.
   - A run where it looks fast is a run whose mocks did not apply.
   - The broad form fails loudly. A narrow form (for example, only `moves.ts`) can fail **silently**: a
     guard can read 0 calls where 0 is the expected count.
   - **No pin is built here.** This ticket adds no test. Whether this warning earns a value pin, as `isolate`
     has, is BA/PM's call (Consequences).
4. **The routes that remain are outside this ticket. Each is a new ticket and the owner's call.**
   - **(a) vitest ≥ 4.1 with `test.experimental.viteModuleRunner: false`.**
     - Native import, with `vi.mock` carried by Node loader hooks (vitest docs,
       <https://v4.vitest.dev/config/experimental>).
     - It needs a **major dependency bump**, so `ABC-149` merges first (`RISK-ABC143-01`), and Security/NFR
       reviews the lockfile.
     - It needs a **test-content change**. The docs say `vi.spyOn` on a module namespace does not work
       there, so `src/render-seam.test.ts` (7 namespaces) and `src/cli.test.ts` (`glyphMode`) move to
       `vi.mock(…, { spy: true })`. That is R-3, the owner's.
     - Whether its mocks then reach every importer, as vite-node's do, is `UNKNOWN - verify`. So is its effect.
       C4 is the nearest reading: ~100 % of the excess, inside the same worker.
   - **(b) a `src/` route** (restructure production modules for the runner). It is out of scope by the
     ticket. None is proposed.
5. **Composition.**
   - `ADR-0040` is unchanged: k = 3, its pin unchanged, `poolOptions` still forbidden.
   - `ADR-0035`'s recorded floors `F` carry over unchanged, because nothing in the lane moves.
   - `ADR-0008` decision 7 is unchanged.
   - The cap and the factor stay orthogonal. The cap limits workers, and the factor is per node inside one.

## Alternatives

- **C1, source maps off.** It removes 1.4–1.5 % of the excess. Rejected: it is not the cause.
- **C2, `pool: "forks"`.** It removes −3.1 to −0.5 %. Rejected: not the cause, and `ABC-085` had already
  ruled out the pool type.
- **C4 over all of `src/`.** It removes ~100 %. Rejected: it blinds mocks and spies (above).
- **C4 narrowed to the graph-safe set.** That set is two data files. Rejected: it reaches no hot code.
- **A vite plugin that bundles `src/` for the runner.** It is C3 as a lever. Rejected:
  - it breaks per-module `vi.mock` the same way C4 does;
  - it is code in the config, not a value.
- **vitest ≥ 4.1 without the module runner.** Not ruled here, because it needs a major bump and test
  content. It is route (a).
- **`isolate: false`, `pool: "vmThreads"` / `"vmForks"`.** Out of scope (`ADR-0008` decision 7). The vm pools
  also run the same transform.

## Consequences

- **The lane does not change.** `vitest.config.ts`, `package.json` and `src/` are untouched.
- **Expected effect on lane CPU from `ABC-150`: 0.** No lever is built.
  - The ~5x per-node factor stays, and so does the heat it makes. The owner's "choking" is still answered
    only by `ADR-0040`'s cap.
- **For any future route** (not an `L1`, and never quoted as one):
  - `D1` shows the factor reaches pure move generation (P 4.33x), not only E and S. That weighs against
    `RISK-ABC147-02`'s "only on the two files" reading (R 11.65 %).
  - `ABC-147`'s band (R 29.7–35.8 %, cold edge 26.0 %, at 7 workers) is still the only estimate. At 3
    workers it is `UNKNOWN - verify`.
  - A route's own `L1` settles it.
- **`NFR-008` is unchanged.** Wall ≤ 10 s stays the level, and CPU stays reported.
- **`ABC-146` is unaffected.** Its verdict runs under plain `node`, which pays no factor.
- **Open, for BA/PM:**
  - whether decision 3's warning gets a pin, which is test content and a new ticket;
  - whether route (a) is cut, on the owner's word.

## Rollback

This ruling changes no file outside `memory-bank/`, `plans/` and `.grugops/context/`. To roll back, mark this
ADR `superseded` or `deprecated`. If the owner rejects decision 2 (for example, to take a test-content
route), `ABC-150` returns to BA/PM with the `D2` table, and a new ticket carries that route.
