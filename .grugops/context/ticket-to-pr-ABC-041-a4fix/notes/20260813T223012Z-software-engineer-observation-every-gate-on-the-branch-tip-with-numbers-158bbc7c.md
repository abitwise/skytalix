---
id: 20260813T223012Z-software-engineer-observation-every-gate-on-the-branch-tip-with-numbers-158bbc7c
kind: observation
by: software-engineer
at: 2026-08-13T22:30:12Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.ts
  - src/render-seam.test.ts
  - .grugops/test-skips.md
supersedes: 
---

# Every mandatory gate on the branch tip, with numbers, plus the byte-identity check `A10` asks for.

Run in `../cli-chess-dev041b` on `grugops/ticket-to-pr-ABC-041-a4fix`, after the mutant was reverted
and the module md5-verified. Reported exactly as they ran.

| step | command | result |
|---|---|---|
| lint | `npm run lint` | **exit 0**, 51 files, **2 infos** |
| typecheck | `npm run typecheck` | **exit 0** |
| build | `npm run build` (`tsc --noEmit`) | **exit 0** |
| unit | `npm test` | **29 files, 828/828 passed**, 1.32 s |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test-integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **`No findings.`, exit 0** |
| the ticket's own file | `npx vitest run src/render-seam.test.ts` | **12 passed (12)** |

**The baseline held exactly.** The subtask names 828/828 on 29 files, skip 0, and 12 passed on
`src/render-seam.test.ts`; every one of those is the reading after the change too. This hop changes
**no test count** — it changes what one assertion measures and what one row is called.

**The 2 lint infos are NOT mine and are pre-existing**: both are `biome.json` deserialize/deprecated
notices (`biome.json:2:14`, `biome.json:12:13`), identified by
`npx biome check --diagnostic-level=info .`. The same two were recorded at the first `ABC-041` hop
and at the `ABC-021` gate. **Lint was green on the FIRST run — `self_fix_attempts` 0 of 2 consumed.**

**`PERFT_DEEP` NOT RUN, and that is a ruling rather than an omission.** The branch diff is one
`*.test.ts` file. It cannot reach `moves` / `legal` / `apply` / `position`, so the deep perft suite
could not observe this change; running it would measure the tree, not the hop.

## `A10`'s byte-identity, checked and not assumed

```
git diff --numstat 8dbe2b4        ->  48  28  src/render-seam.test.ts     (and nothing else)
md5 -r src/render-seam.ts         ->  bc18d0830b84adaff123affce66561c5   (base value, unmoved)
```

`src/render-seam.ts` is **absent from the diff entirely**, which is stronger than "0 lines changed",
and so are `src/frame.ts`, `src/render.ts`, `src/status-panel.ts`, `src/history-pane.ts` and
`src/turn-loop.ts`. **Zero production lines were written at this hop, in any file.** The `A10` fence
that `A3` and `A6` rest on is intact: no second module was added, so no literal and no ambient read
could have been moved one file away.

## Security threshold, re-read against this diff — all four clauses quiet

Against the repaired four-clause form: **(a)** `package.json` / `package-lock.json` byte-untouched
and still no `dependencies` key; **(b)** no non-`.test.ts` file under `src/` changed at all;
**(c)** the test file's `node:fs` import is unchanged and is explicit precedent under the clause's own
words — no capability was added; **(d)** blast radius is one test file. **Security did not fire.**
