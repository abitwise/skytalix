---
id: 20260819T160000Z-agents-md-scribe-observation-input-deep-counts-measured-9c1d5e70
kind: observation
by: agents-md-scribe
at: 2026-08-19T16:00:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - AGENTS.md
  - src/line-input.test.ts
supersedes:
---

# The `INPUT_DEEP` lane's real counts on `main` @ `298bb95` — and the brief's `142`/`144` does NOT reproduce

I ran all three lanes myself before writing a number into `AGENTS.md`, because the file's own
standing rule is that a recorded command must have been run. Node v24.12.0, vitest 3.2.7, contained
agent worktree, `main` @ `298bb95`.

```
npx vitest run src/line-input.test.ts                                        -> 29 passed, exit 0
INPUT_DEEP=1 npx vitest run src/line-input.test.ts                           -> 32 passed, exit 0
INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts  -> 33 passed, exit 0
```

## The defect is REAL and I confirmed it; the SIZE of it in my brief is not

**Confirmed, and it is why this hop exists:** the command `AGENTS.md:94` recorded runs **short and
exits 0**. It does not warn, and the skip count stays `0`, so nothing anywhere reports the shortfall.
The row that goes missing is the `external`-memory retention guard — the one this whole thread of
work exists to have.

**Not confirmed, and I am correcting it rather than repeating it:** my brief stated `142 passed` vs
`144 passed`, i.e. a **two**-test shortfall. Neither figure reproduces on this tree at this commit.
The real figures are **32 vs 33** — a **one**-test shortfall, the single retention row.

I did not reconcile the `142`/`144` pair to any lane, file or flag combination I could run. I am
recording that it did not reproduce rather than guessing at its provenance. **The two figures I did
get agree exactly with the repair engineer's independently measured `29 → 32 → 33`** (its
`gate-fence-and-lane-cost` observation), which is two trees and two authors on the same numbers — so
I am confident the `32`/`33` pair is the tree's truth and that the `142`/`144` pair is an artefact of
whatever it was taken from.

**This is itself the reason the file now states counts at all.** A shortfall that is invisible in the
exit code was described to me one test larger than it is, by an agent that had measured it
first-hand. That is exactly the failure mode the new `COUNT YOUR RUN` line is aimed at.

## The command as now recorded, run verbatim after the edit

```
INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts
-> 33 passed, exit 0, 0.30 s
```

## Gate, re-run in full on the branch tip — record unchanged, as a no-`src/` hop requires

| step | expected | measured |
|---|---|---|
| `npm test` | 39 files / 1181 tests | **39 / 1181, 0 failed** (2.40 s) |
| skip count | 0 | **0** |
| `test-skip-integrity.js --skip-count 0` | `No findings.` | **`No findings.`, exit 0** |
| `npm run lint` | exit 0 | **exit 0, 70 files** |
| `npm run typecheck` | exit 0 | **exit 0** |
| `npm run build` | exit 0 | **exit 0** |

No file under `src/` was opened or changed this hop, so the record was expected to be identical and
is. `PERFT_DEEP` was not re-run: nothing this hop touches can reach it.
