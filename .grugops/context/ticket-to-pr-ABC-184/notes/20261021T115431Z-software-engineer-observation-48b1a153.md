---
id: 20261021T115431Z-software-engineer-observation-48b1a153
kind: observation
by: software-engineer
at: 2026-10-21T11:54:31Z
verified_by: 
confidence: high
refs:
  - ABC-184
  - AR-183-CWDARG
  - grugops/ABC-184
  - 5277babd
  - 442d1e57
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
  - ABC-162
  - ABC-183
  - 20261021T082210Z-qe-e2e-observation-567002e7
  - 20261021T134000Z-security-nfr-observation-d5fd47e1
  - 20261021T101020Z-qe-e2e-observation-cbd50a13
supersedes: 
seal: sha256:d8e01f7071c883bcf4be302c0d324c1f193afdae42008461f3c94fb35612822d
---

# ABC-184 SE plant matrix (A3): all five rows read as the page predicts. TCWD + P6f goes 11/11 green on base to red at `AR-183-CWDARG` on head

**Method:** `git archive 442d1e57` plus a `node_modules` symlink, in session scratch outside the repo (`…/scratchpad/se184/cells/<cell>/tree`). The test file was swapped for base or head, plus the plants. Each cell had a private `TMPDIR` and ran one at a time with `CLI_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.real-engine.test.ts`. No timing was taken.

**Plants (sha256):**
- base test `8a84dfa3…` and head test `a4dbb308…`; delivered `book-file.ts` `890784c9…`.
- **P6f** `book-file.ts` `c9e8032d…`: `try { readFileSync("data/opening-book/book.json") } catch { readFileSync(new URL("../data/opening-book/book.json", import.meta.url)) }`. This is QE `…567002e7`'s body; the bytes are my own.
- **TCWD** drops `, neutral` from the `booked = spawnReal(` line: base `008c4e79…` (**byte-identical to QE's and Security/NFR's**), head `be86a15f…`.
- **TMO** moves the decoy's `mkdirSync` and `writeFileSync` to directly after the `booked = spawnReal(` line, and the capture line stays: base `c9ff8261…`, head `379a451f…`.

| plant | base test | head test |
|---|---|---|
| none | 11/11 green | 11/11 green |
| P6f | 10/11, red A7 at the stderr detector (`:545`) | 10/11, red A7 at the stderr detector (`:552`) |
| **TCWD + P6f** | **11/11 green** | **10/11, red A7 at `booked.cwd` (`:504`), message starts `AR-183-CWDARG: the booked child must spawn from neutral…`** |
| TCWD alone | **11/11 green** (was `UNKNOWN - verify` on the page; measured, as expected) | 10/11, red A7 at `booked.cwd` (`:504`) |
| TMO + P6f | 10/11, red A7 at `AR-162-FALLBACK` (`:503`) | 10/11, red A7 at `AR-162-FALLBACK` (`:510`) |

- The P6f reds read `expected 'opening book is not valid UTF-8 JSON;…' to be ''`.
- **Leftovers:** only `node-compile-cache` in each private `TMPDIR`. The worktree's `git status --porcelain` was empty after the runs.
