---
id: 20260815T132400Z-software-engineer-observation-the-gate-and-the-zero-production-bytes-6903451d
kind: observation
by: software-engineer
at: 2026-08-15T13:24:00Z
verified_by: 
confidence: high
refs:
  - ABC-042
  - A12
  - src/cli.ts
  - src/cli-options.ts
  - src/history-pane.nfr.test.ts
  - .grugops/test-skips.md
supersedes: 
---

# The gate on my branch tip, and the production byte-identity proved by hash rather than by reading a diff

## The gate

Run on `grugops/ticket-to-pr-ABC-042-q1q2fix` at `ad67e67`, in the main working tree (no concurrent
hop was live in this repository during my run — I checked before taking the directory).

| gate | command | result |
|---|---|---|
| lint | `npm run lint` | **PASS** — 54 files, no fixes, **2 infos**, rc 0 |
| typecheck | `npm run typecheck` | **PASS** — `tsc --noEmit`, rc 0 |
| build | `npm run build` | **PASS** — `tsc --noEmit`, rc 0 |
| unit | `npm test` | **PASS — 856/856 on 30 files** |
| skip count | `npx vitest run --reporter=json \| jq '.numPendingTests + .numTodoTests'` | **0** |
| test integrity | `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0` | **PASS** — `No findings.`, exit **0** |
| deep perft | `PERFT_DEEP=1 npx vitest run src/perft.test.ts` | **PASS — 32/32**, 36.19 s |

**The 2 lint infos are not mine and I verified that rather than repeating it from a prior note:** both
are on **`biome.json`** — the schema-version notice (`2.3.0` vs CLI `2.5.5`) and the deprecated
`recommended` field. My diff touches `src/cli.test.ts` and nothing else, so neither can be from it.

`.grugops/test-skips.md` was **read and run against; no row was written into it** — it is human-owned
and an agent may not self-author a justification to clear its own gate.

**`self_fix_attempts` (2) was NOT consumed.** Nothing failed a gate at any point, so there was nothing
to self-fix. The instrument change was green on its first run and stayed green.

## Zero production bytes — by hash, both ways, as the subtask required

**md5, at my branch tip:**

```
a5aae52ab7db5240f4c41dc371f4ed11  src/cli.ts
012739b4fc03a2e661f4d127b8f7e1e4  src/cli-options.ts
e424e681f241ae819428b21993c59b62  src/history-pane.nfr.test.ts
```

Byte-for-byte the values I recorded **before** touching anything.

**git blob SHA — my tip vs my base vs the delivered code commit:**

| file | tip `ad67e67` | base `257d023` | delivered `e140355` |
|---|---|---|---|
| `src/cli.ts` | `4624457783…` | `4624457783…` | `4624457783…` |
| `src/cli-options.ts` | `c1487e2c36…` | `c1487e2c36…` | `c1487e2c36…` |
| `src/history-pane.nfr.test.ts` | `6e450595b8…` | `6e450595b8…` | `6e450595b8…` |

**Identical across all three commits.** Neither hash was read off a diff.

**And `A12`'s wider clause, re-checked at my own hand:** all **18** merged production modules compared
by git blob SHA, `main@8dbc3db` against my tip — **18 IDENTICAL, 0 differ.**

## What my branch changes, in full

```
git diff --stat 257d023 HEAD
 src/cli.test.ts | 24 ++++++++++++++++++++++++
 1 file changed, 24 insertions(+)
```

**One file. 24 insertions, zero deletions.** Twelve of the 24 lines are comment. No `import`
statement was added or removed — the only `import` text in the diff is inside a comment and inside a
regex literal, and I checked that specifically because an added import would change the module graph
and with it the `PERFT_DEEP` reachability argument.

`A12`'s file list is therefore **unaffected by this hop**: it is asserted against the delivered code
commit `e140355`, and I added no seventh path to it.
