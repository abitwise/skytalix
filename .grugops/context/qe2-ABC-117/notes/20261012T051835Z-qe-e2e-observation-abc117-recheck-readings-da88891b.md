---
id: 20261012T051835Z-qe-e2e-observation-abc117-recheck-readings-da88891b
kind: observation
by: qe-e2e
task: qe2-ABC-117
at: 2026-10-12T05:18:35Z
verified_by:
confidence: high
refs:
  - ABC-117
  - ABC-115
  - A1
  - S10
  - S11
  - QE-117-a
  - QE-117-c
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# QE re-check `ABC-117`: readings taken at QE's own hand, before the Engineer's notes were read

Tip `86bf76b5`. Host Node v26.11.0. All readings were taken in my own worktree,
`grugops/qe2-ABC-117`, which is off that tip. `src/cli.ts` is byte-identical to base `3537fe48`.

## A1, re-taken

| run | exit | `^usage: ` | `Usage` | `internal error` | `CAUGHT:` | throw site |
|---|---|---|---|---|---|---|
| `node src/cli.ts 1</dev/null </dev/null` | **1** | **0** | 0 | **0** | n/a | `src/cli.ts:160`, `EBADF` |
| `/bin/sh -c 'node src/cli.ts --ascii 1</dev/null; echo NODE_EXIT=$?'` (A10's inner form) | wrapper **0**, `NODE_EXIT=1` | 0 | 0 | 0 | n/a | `src/cli.ts:160`, 1178 B stderr |
| QE's own repro (sync `try` around `stdout.write`, listener re-throws non-`EPIPE`), `1</dev/null` | **1** | – | – | – | **never printed**; the write returned normally inside the `try` | listener |
| same, stdout writable | 0 | – | – | – | – | – |
| `…d2c79dc9`'s script, re-typed from the note, `1</dev/null` | **1** | – | – | – | **0** | listener |
| same, writable | 0, 0 B stderr | – | – | – | – | – |
| QE's open-`try` repro (listener throws while `main`'s `try` is **suspended on a pending `await`**) | **1** | – | – | – | **never printed**; `TRY: await resolved` never printed | listener |
| control `node src/cli.ts --bogus </dev/null` | **1** | **1** | 0 | 0 | n/a | none |

The stack on the read-only run names `at main (src/cli.ts:170:27)`. The failing write is
synchronous from inside `main`'s `try`, and `'error'` is emitted later.

## The line citations, read against `src/cli.ts` at the tip

`:136-138` is the `stderr.write` carrying `${USAGE}`. `:141` is `process.exitCode =
USAGE_EXIT_CODE`, which is the only assignment (`grep` finds `:91` for the definition and `:141`
for the assignment). `:160` is the `if (… !== "EPIPE") throw error;` arm. `:169` is `try {`. `:196`
is `process.stderr.write(`${INTERNAL_ERROR}\n`)`. **All five citations are correct.**

## Judgement of S10 and S11 against these readings

- **S10** (`plans/traceability.md:1035`): every figure agrees with my readings, and so does every
  cited line and the `…d2c79dc9` reference. "The rest of the sentence stands as written" checks out
  against the original clause: the residual is still accepted, the checkout-path disclosure is still
  present (my stderr carries the absolute worktree path), and `ADR-0016` is not re-opened. **MET.**
- **S11** (`…3429abce`): the table agrees with mine. A10's exact inner form reads the same as the
  bare `1</dev/null` run that S11 uses as its proxy, so the proxy is sound. **MET.**
- **One wording imprecision, which is not a CLAIM-B clause (QE2-117-a, LOW).** S10, S11 and the
  earlier S6/S9, S7 and S8 corrections all say the re-throw "fires on a later tick than `main`'s
  `try`". Measured, `main`'s `try` is still open when the listener throws. It is suspended on
  `await runTurnLoop(…)` (shown by the stack and by the open-`try` repro), and the throw still
  escapes. The accurate mechanism is the one `…0081a95a` (ii) and the ticket's `## Problem` state:
  the throw comes from an emitter listener on a tick with **no `try` on the stack**, so it never
  reaches `main`'s promise. The operative conclusion stays TRUE and is strengthened: no `try`/`catch`
  in `main` can route it, and the outcome must be carried in the `:160` arm.
