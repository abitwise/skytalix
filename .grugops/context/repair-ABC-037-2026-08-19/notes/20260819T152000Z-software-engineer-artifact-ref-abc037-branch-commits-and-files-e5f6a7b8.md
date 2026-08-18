---
id: 20260819T152000Z-software-engineer-artifact-ref-abc037-branch-commits-and-files-e5f6a7b8
kind: artifact-ref
by: software-engineer
at: 2026-08-19T15:20:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - src/line-input.ts
  - src/line-input.test.ts
  - plans/traceability.md
supersedes:
---

# What this hop produced — branch, commits, files, and the handoffs

## Branch

`grugops/abc037-repair`, cut from `grugops/quality-gate-ABC-037-qe-2026-08-19` @ `daaf3b6` (its tip,
carrying the delivery and QE's seven notes). **Not merged. No remote; nothing pushed.**

## Commits, incremental as instructed

| commit | what |
|---|---|
| `09fb8a6` | `fix(line-input)` — the `G1` retention guard, the `G3` CRLF ordering fix, the `G4` decoder row, the `G5` two default-lane guards, the `G7` `MAX_LINE_LENGTH` doc, and the corrected mechanism comment |
| `3d1a62c` | `docs(trace)` — `plans/traceability.md`: the "eighteen" correction, the mutant ledger movement, the new lane figures |
| (this one) | `docs(context,queue)` — these notes and the subtask sweep |

## Files

- `src/line-input.ts` — **+16 / −3**, 232 → 245 lines. Two behaviour-bearing changes: `absorb` caps
  at `MAX_LINE_LENGTH + 1` (one unit of slack, the carriage return's) and `completeLine` gives the
  cap verdict on the line without its terminator. Everything else is doc.
- `src/line-input.test.ts` — **+195 / −30**, 771 → 936 lines. Six new default-lane rows, one new deep
  row, the disproved mechanism comment replaced.
- `plans/traceability.md` — **+2 / −2**, one row touched in place plus the header; 10 columns before
  and after, verified by re-splitting the row from disk (12 raw `|`-fields), no raw pipe in a cell.
  `Status` deliberately not touched.

## Commands, all run, all as recorded

```
npm test                                                       39 files / 1181 tests, 0 failed
npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'    0
node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0    No findings., exit 0
npm run lint                                                   exit 0, 70 files
npm run typecheck                                              exit 0
npm run build                                                  exit 0
PERFT_DEEP=1 npx vitest run src/perft.test.ts                  32/32, 39.74 s
npx vitest run src/line-input.test.ts                          29 passed
INPUT_DEEP=1 npx vitest run src/line-input.test.ts             32 passed
INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts    33 passed, 78 ms
```

The last one was run **three further times** for stability: 33/33 each, 290–327 ms wall.

## Handoffs — things I could not do from inside the fence

1. **`AGENTS.md:94`'s command slot is now incomplete.** It records
   `INPUT_DEEP=1 npx vitest run src/line-input.test.ts`; the full lane for this module is
   `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts`. The recorded
   command still **passes** (32 tests) — it just runs one guard short, silently. The Scribe is
   already in that file for the trap paragraph. **Routing, not reaching across.**
2. **`AGENTS.md`'s trap paragraph** says the retention bound "is a construction argument in
   `absorb()`, not a test". **That is now false** — it is a test. The Scribe holds it.
3. **`G2` / `A6`** — token scan NOT widened, by ruling; rides as a precondition on `ABC-038`.
4. **`G6`** — the single-caller precondition on `createLineInputSeam` is still written down nowhere.
   Not in my brief, not done, named so it is not lost before `EPIC-006` wires the factory.
5. **`N8-LANE`** — reported, not claimed. Security/NFR's bar, `ABC-108`'s ticket.

## Board and merge

**No board column moved. Nothing merged, nothing deployed.** `ABC-037` sits where the Orchestrator
left it; the column move is the Orchestrator's to write.
