---
id: 20260813T232000Z-software-engineer-observation-every-gate-on-the-base-and-on-the-tip-with-numbers-8a6ba097
kind: observation
by: software-engineer
at: 2026-08-13T23:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - AGENTS.md
  - src/render-seam.test.ts
  - .grugops/test-skips.md
supersedes: 
---

# Every mandatory gate plus test-integrity, run twice: once on the base BEFORE the edit and once on the tip. The deltas are deltas, not assumptions.

Baseline was measured, not inherited from the subtask's text. Both columns are my own runs in
`../cli-chess-dev041c`.

| gate | command | base `c3384ea`, before the edit | tip, after the edit |
|---|---|---|---|
| lint | `npm run lint` | **exit 0**, 51 files, 2 infos | **exit 0**, 51 files, 2 infos |
| typecheck | `npm run typecheck` | **exit 0** | **exit 0** |
| build | `npm run build` | **exit 0** | **exit 0** |
| unit | `npm test` | **827 passed / 827, 29 files** | **827 passed / 827, 29 files** |
| skips | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** | **0** |
| test-integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** | **`No findings.`, exit 0** |

**Lint was green on the FIRST run** — no autofix pass was needed and none was used. The **2 infos** are
the pre-existing `biome.json` migration notices, present on the base and not mine.

`.grugops/test-skips.md` was **read and never written.** It is human-owned; the skip count handed to
the checker is the runner's own reported integer, taken from the `--reporter=json` run above and not
typed in from memory.

**`PERFT_DEEP` NOT RUN, and that is a ruling rather than an omission.** The diff is one `*.test.ts`
plus `plans/traceability.md`; it cannot reach `moves` / `legal` / `apply` / `position`, so the deep
perft suite has nothing to say about it. Recording this because "not run" and "not applicable" look
identical in a summary.

## The shape of the diff, measured

```
git diff --numstat c3384ea
 8    1    src/render-seam.test.ts
 2    1    plans/traceability.md
```

- **`src/render-seam.ts` is ABSENT from the diff.** Blob `51e50a381a5faccc01e11c5ab30727ed4c30e62a`,
  md5 `bc18d0830b84adaff123affce66561c5` — the same object it has been at `ac17fe2`, `8dbe2b4`,
  `78a3db8` and `c3384ea`. **Verified, and it was never opened for writing on this hop at all.**
- **`git ls-files src | wc -l` is 49**, unchanged.
- **`A10`'s fence holds**: `git diff --numstat main -- src/frame.ts src/render.ts src/status-panel.ts
  src/history-pane.ts src/turn-loop.ts` is **empty**.
- `git diff --numstat main -- src/` is `1 0 src/history-pane.nfr.test.ts`, `394 0
  src/render-seam.test.ts`, `62 0 src/render-seam.ts`.

## One number in the trace reconciled, so nobody reads a contradiction

The re-gate's note records `396 0 src/render-seam.test.ts` against `main`; mine reads `394`. Both are
right and the arithmetic closes exactly: **396** at `78a3db8`, **387** at `c3384ea` after the gate's
own `+10/−19` disposal, **394** here after this hop's `+8/−1`. I re-ran all three with
`git diff --numstat main <rev> -- src/render-seam.test.ts` rather than inferring it. The gate's `396`
was measured at the Engineer's tip, in a table that also carries post-disposal numbers.

## `plans/traceability.md`

**ONE row updated in place (`ABC-041`), TWO cells — `Tests` and `Status` — both APPEND-ONLY**, plus one
new `_Updated:_` header line. No row was appended, none was removed, and no other row was touched:
`git diff -U0 c3384ea -- plans/traceability.md` shows exactly one `-| ` / `+| ` pair. The row still
carries **10 columns**, asserted by re-splitting the row on `|` after the edit (12 fields, two of them
the leading and trailing empties) — counted, not eyeballed.
