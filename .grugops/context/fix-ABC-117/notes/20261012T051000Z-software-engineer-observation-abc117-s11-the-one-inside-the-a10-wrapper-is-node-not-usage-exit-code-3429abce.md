---
id: 20261012T051000Z-software-engineer-observation-abc117-s11-the-one-inside-the-a10-wrapper-is-node-not-usage-exit-code-3429abce
kind: observation
by: software-engineer
task: fix-ABC-117
at: 2026-10-12T05:10:00Z
verified_by:
confidence: high
refs:
  - ABC-117
  - ABC-115
  - QE-117-a
  - S11
  - 20260821T052500Z-qe-e2e-claim-nothing-was-weakened-and-the-one-thing-the-repair-changed-that-no-criterion-covers-0391186e
  - 20261012T045400Z-software-engineer-observation-abc117-s3-s5-the-one-in-three-hop-records-is-node-not-usage-exit-code-92514474
supersedes:
---

# S11: the `1` the product exits inside `A10`'s wrapper is Node's, not `USAGE_EXIT_CODE`

This note corrects the note on `refs` without superseding it, the same way `…92514474` corrects
S3–S5. `…0391186e` stays in replay. Its conclusion (`G-QE115-5`: `ABC-066`'s derived refusal guard
reads the wrapper's status, so it cannot see `A10`'s child) does not depend on the mechanism and
still stands. Only the cause it attaches to the inner `1` is wrong.

**The clause, `…0391186e` lines 69-70:** *"so its wrapper exits **0** while the product inside it
exits **1** — `USAGE_EXIT_CODE`, with a raw stack on stderr and **no usage line at all**"*.

**What is true, from readings taken at this hop.** Host Node v26.11.0, tip `8e679aed`, `src/cli.ts`
byte-identical to `main`.

| run | exit | `^usage: ` | `internal error` | `CAUGHT:` |
|---|---|---|---|---|
| `node src/cli.ts 1</dev/null </dev/null` | **1** | **0** | **0** | n/a (banner on `src/cli.ts:160`, `EBADF`) |
| `…d2c79dc9`'s out-of-product script, `1</dev/null` | **1** | 0 | 0 | **0, not printed** |
| same script, stdout writable (control) | 0 | 0 | 0 | 0 (0 bytes of stderr) |
| `node src/cli.ts --bogus </dev/null` (control) | **1** | **1** | 0 | n/a |

`USAGE_EXIT_CODE` is assigned only at `src/cli.ts:141`, after the usage line is written at
`:136-138`. The `EBADF` run writes no usage line, so that assignment did not run. `main`'s `catch`
writes `INTERNAL_ERROR` at `:196`, and no such line appears, so the `catch` did not run either. The
`1` is Node's default status for an unhandled exception. The re-throw in the sink's error arm
(`src/cli.ts:160`) fires on a later tick than `main`'s `try` (`:169`). It only shares
`USAGE_EXIT_CODE`'s value.

The note's own words *"no usage line at all"* are the evidence against its `USAGE_EXIT_CODE`
reading. Both the wrapper and the guard behave as the note says. This note does not re-open
`ABC-115`, its residual ruling or `G-QE115-5`'s ruling, and it proposes no product change.
