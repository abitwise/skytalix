---
id: 20260819T143000Z-qe-e2e-artifact-ref-abc037-qe-branch-and-probes-c7a8b9d0
kind: artifact-ref
by: qe-e2e
at: 2026-08-19T14:30:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - src/line-input.ts
  - src/line-input.test.ts
supersedes:
---

# What this hop produced, and what it deliberately did not

## Branch

`grugops/quality-gate-ABC-037-qe-2026-08-19`, cut from **`grugops/abc037-the-real-prompt` @ `02e5c38`**
— the delivery branch tip, **not** `main`, as the brief requires. `main`'s tip (`1768cb6`) is not an
ancestor of the delivery branch, so branching off `main` would have measured a different tree; the
subtask brief file lives only on `main` and was carried across by hand rather than by merge.

## Commits, in order

| commit | what |
|---|---|
| `7fefd4e` | the verdict `decision` |
| `63d1423` | the `M6c` guard — the instrument, and the classification check |
| `88de0d5` | the `A6` escape and the `A5` attack results |
| `e21263f` | the three security bars, re-measured |
| `72609ff` | the QE mutant ledger and the edge probes |
| `fb683b4` | the gate, the anchors, the lane cost, the `AGENTS.md` judgement |

## Files changed by this hop

**Zero under `src/`. Zero under `plans/`.** Only `.grugops/context/quality-gate-ABC-037-qe-2026-08-19/notes/`
and the queue claim.

`src/line-input.ts` was mutated **fourteen times** during this hop and restored after every one;
its md5 is `2428f654f694b87a8e22ec199c01dcde` now and matches `git show HEAD:src/line-input.ts`
byte for byte. `git status --porcelain` is empty.

## Probes — written out of tree, run, and NOT delivered

All under the session scratchpad, none in the repository:

- `m6c-probe.mjs`, `m6c-probe2.mjs`, `m6c-probe3.mjs` — the retention measurement, escalating from
  `heapUsed` to a full `v8.getHeapStatistics()` + `process.memoryUsage()` field diff.
- `rope-micro.mjs`, `rope-micro2.mjs`, `rope-micro3.mjs` — the cons-vs-flat-vs-bytes micro that
  falsified the recorded mechanism.
- `a5-attack.mjs` — the seven `A5` swallow attacks.
- `a6-escape-impact.mjs` — the escape's effect on security bar 3, with a late-bound spy watching.
- `security-bars.mjs`, `frame-fit.mjs`, `edges.mjs` — the three bars and the edge probes.
- `mutate.py`, `mutate-q.py` — the mutant appliers.
- `lane.sh` — the paired, interleaved lane-cost measurement.

**One file was written into `src/` and then deleted**: `src/qe-m6c-probe.test.ts`, the working `M6c`
guard, created solely to prove it fires inside vitest rather than only in a bare Node process. Its
body is reproduced verbatim in the `M6c` note so the engineer can adopt it without rebuilding it. It
is not in any commit — the first `npm test` run after it existed is the only place it appears, and
that run's one failure was itself.

## Not done, deliberately

- **Nothing fixed.** No production line changed, no test added to the delivered suite, **no guard
  weakened** — I widened the token scan only inside my own probe, never in the delivered file.
- **`ABC-033`, `ABC-035`, `ABC-078` NOT re-opened.** Two observations touch `ABC-033`'s dispatcher
  (the floating rejection, the empty-line `unreadable`); both are recorded against this seam as
  observations and neither asks for anything from those tickets.
- **No NFR bar ruled.** `N8-LANE` is reported with its measurement and explicitly not granted.
- **Not merged, not deployed, `main` untouched, no board column moved.** The `In Review` exit is mine
  to recommend and the Orchestrator's to write. The ticket page and `plans/traceability.md` were READ
  and not edited — the trace row is the Orchestrator's to carry this verdict into.
