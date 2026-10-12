---
id: 20261012T045400Z-software-engineer-observation-abc117-s3-s5-the-one-in-three-hop-records-is-node-not-usage-exit-code-92514474
kind: observation
by: software-engineer
task: ticket-to-pr-ABC-117
at: 2026-10-12T04:54:00Z
verified_by:
confidence: high
refs:
  - ABC-117
  - A3
  - ABC-115
  - 20260821T032000Z-ba-pm-decision-the-guard-is-owed-and-a10-asserts-the-discrimination-not-the-exit-code-9d3a7e52
  - 20260821T021000Z-qe-e2e-claim-the-re-thrown-branch-is-guarded-by-nothing-and-a-one-token-mutant-proves-it-8c04b19d
  - 20260821T040500Z-software-engineer-decision-a10-is-one-row-and-one-child-and-it-asserts-nothing-it-was-not-handed-6b1e4c72
supersedes:
---

# S3–S5: three closed hop records say the non-`EPIPE` `1` "is `USAGE_EXIT_CODE`" — the `1` is Node's

Correcting, not superseding: this note folds nothing out. The three notes on `refs` stay in replay and
their conclusions stand, because none of them depends on the mechanism — QE's verdict (`…8c04b19d`),
BA/PM's `A10` shape (`…9d3a7e52`) and the engineer's `A10` decision (`…6b1e4c72`) all rest on
*non-zero and non-empty*, which is what `A10` asserts and which holds under the true mechanism.

The clause each carries:

- **S3**, `…9d3a7e52` line 43: *"(`1` is `USAGE_EXIT_CODE`, the very collision the ticket was cut for)"*.
- **S4**, `…8c04b19d` line 66: *"On the `EBADF` path the delivered build exits **1**, which is
  `USAGE_EXIT_CODE`"*.
- **S5**, `…6b1e4c72` line 46: *"path is `1` = `USAGE_EXIT_CODE`"*.

**The true mechanism, once.** On a failed non-`EPIPE` stdout write the delivered build exits `1`
because the re-throw in the sink's error arm (`src/cli.ts:160` at `3537fe48`) fires on a later tick
than `main`'s `try`, so the exception is unhandled and Node exits with its default status for that,
`1`. Nothing assigns `USAGE_EXIT_CODE`; the value merely coincides. Measured at this hop: exit `1`,
**0** `usage:` lines, **0** `internal error` lines, Node's banner on stderr; the out-of-product
reproduction printed no `CAUGHT:` and exited `1`. Readings: this task's `…5d86529e`.

*"The collision"* those notes name is still a fact about what a shell sees — `1` on this path and `1`
on a refused command line are indistinguishable by status — and that observable collision is what the
accepted residual accepts. Only the implied cause is wrong.
