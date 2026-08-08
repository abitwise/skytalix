---
id: 20260808T200500Z-security-nfr-observation-89b14279
kind: observation
by: security-nfr
at: 2026-08-08T20:05:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-015
  - ABC-015
  - ABC-018
  - EPIC-006
  - NFR-007
  - RISK-005
  - src/glyph-mode.ts
  - src/glyph-mode.nfr.test.ts
  - plans/nfr-catalog.md
  - plans/tickets/ABC-015-glyph-mode-selection.md
  - 20260808T184400Z-software-engineer-observation-d51e83c7
  - 20260808T191100Z-qe-e2e-observation-4c8e50d6
supersedes: 
---

# `NFR-007`'s zero-I/O bar RE-DERIVED on this gate's own instruments — MET, and the delivered guard was never cited

The subtask was explicit: **do not cite the delivered guard.** QE found `src/glyph-mode.nfr.test.ts`
blind to `node:fs/promises` — a *different module specifier*, unspied — and widened it. A guard that
was wrong once is a thing to re-derive, so this gate did not read that file's assertions as evidence
for anything. Everything below is this gate's own measurement.

## The instruments, and why each one closes a hole the others leave open

**The delivered guard's failure mode is structural, not clerical: it spies NAMED EXPORTS of NAMED
SPECIFIERS.** Any specifier it does not name is invisible to it. So the primary instrument here is
deliberately **specifier-agnostic**.

| # | Instrument | What it can see that the others cannot |
|---|---|---|
| 1 | **Node's permission model** — `node --permission --allow-fs-read=<dir>` | Denies the filesystem read and the child-process spawn **at the binding level**, below every module mock. `require('fs')`, `import('node:fs/promises')`, `process.binding` and a native addon are all covered by one refusal. This is the exact class of blindness QE found |
| 2 | **The module alone in an empty directory** — a `cmp`-verified byte-identical copy of `src/glyph-mode.ts` with **no `render.ts` beside it** | If the `import type { GlyphMode }` line were not erased, the import would fail outright. It succeeds, which **proves the RUNTIME import closure is EMPTY** rather than arguing it from the source |
| 3 | **A module-load recorder** (`node:module` `registerHooks`) | Every specifier resolved during the region, including one a mock would never name |
| 4 | **165 functions patched** across `node:fs`, `node:fs/promises`, `node:child_process`, `node:os`, `node:tty` | Call counts on the surface the delivered guard covers, widened to `os` and `tty` |

**Instrument 1 was proved ARMED before any negative result was trusted** — four positive controls,
all refused:

| Control | Result |
|---|---|
| `fs.readFileSync("/etc/hosts")` | `ERR_ACCESS_DENIED` |
| `fs/promises.readFile("/etc/hosts")` | `ERR_ACCESS_DENIED` |
| `child_process.execSync("echo hi")` | `ERR_ACCESS_DENIED` |
| `fs.existsSync("/etc/locale.conf")` — the exact mutant QE built | `ERR_ACCESS_DENIED` |

## The result: MET

Under the permission model, both entry points, **11 selection paths** (the nine tuples' distinct
paths plus the empty-variable fall-through and a three-rung conflict) and **two sessions**:
**0 wrong answers, nothing thrown.** Under instruments 2–4, in three ambient shapes:

| Ambient shape | modules loaded | fs / fs-promises / child_process / os / tty calls | stdout+stderr writes | answer |
|---|---|---|---|---|
| `isTTY` **absent** (a pipe — what production actually presents) | **0** | **0** | **0** | `ascii` |
| `isTTY` **true** | **0** | **0** | **0** | `unicode` |
| `isTTY` **false** | **0** | **0** | **0** | `ascii` |

## ONE INSTRUMENT-LIMIT CORRECTION, and it would have produced a FALSE MISS

**The first run read THREE filesystem calls inside the region — `openSync`, `readSync`,
`closeSync` — and they were the ESM loader reading `glyph-mode.ts` off disk.** That is the module
**LOAD**, not the **SELECTION**, and the bar is on the selection reaching its answer.

The load was hoisted out of the region and the counters reset at the region boundary, after which
the count is **0**. This is **the eighth instrument-limit correction of this shape on this project's
record** — `plans/nfr-catalog.md` carries seven, most of them a parser or a generator left inside
the clock, and the seventh produced a **2.08x false miss** on `ABC-012`. It is recorded rather than
quietly fixed because the naive version of this measurement is the one a later reader will write.

## WHAT THE ONE PERMITTED AMBIENT READ ACTUALLY DOES — measured, because "zero I/O" is a bigger sentence than the bar

The bar permits reading `process.stdout.isTTY`. **`process.stdout` is a LAZY getter**: the first
touch constructs the stream for fd 1. Measured across four sink shapes, under the permission model
with the filesystem denied:

| stdout is | constructed as | `isTTY` reads as | throws? | session answer |
|---|---|---|---|---|
| a pipe | `Socket` | `undefined` | no | `ascii` |
| a regular file | `SyncWriteStream` | `undefined` | no | `ascii` |
| `/dev/null` | `SyncWriteStream` | `undefined` | no | `ascii` |
| **a real terminal** (pty) | `WriteStream` | **`true`** (a real boolean) | no | see below |

**So the bar is MET and the stronger sentence is NOT claimed:** the permitted read is not a bare
property read below the JS line — it constructs a stream object — but it performs **no
permission-checked filesystem operation and no child process**, in any of the four shapes.

## THE TTY PATH WAS EXERCISED AGAINST A REAL TERMINAL — the first time on this ticket

Every earlier test of that path faked `isTTY` with `defineProperty`. This gate allocated a **real
pty** (`python3 pty.spawn`) and ran the module inside it, under the permission model:

- `LANG=en_US.UTF-8`, `LC_ALL`/`LC_CTYPE` unset → **`unicode`**
- `LANG=C` → **`ascii`**

Both directions correct on a real terminal device, with `process.stdout.isTTY` genuinely `true` and
genuinely a boolean. **This is one machine's terminal**; Windows conhost, Windows Terminal, iTerm2
and tmux remain `UNKNOWN - verify` and are `RISK-005`'s own open item, not this ticket's.

## THE ENVIRONMENT IS TOUCHED NARROWLY, and that was measured with a recording Proxy rather than read off the source

`process.env` was replaced with a `Proxy` recording every `get`, `has` and `ownKeys`:

| Question | Measured |
|---|---|
| environment keys read | **at most 3**, and only `LC_ALL`, `LC_CTYPE`, `LANG` |
| does it stop at the first set rung? | **yes** — with `LC_ALL` set, `LC_ALL` is the **only** key read |
| does it ENUMERATE the environment? | **NO — `ownKeys` never trapped, 0 enumerations** |
| environment reads on a **non-TTY** sink | **0** — row 3 short-circuits before the locale loop is entered |
| ambient reads across **8 accessor calls** after the session began | **0** |
| bytes written to stdout or stderr | **0** |

The zero-on-a-pipe result is worth naming: on the sink `EPIC-006`'s end-to-end test uses, this
module **reads no environment variable at all.**

## A DIAGNOSTIC, EXPLICITLY NOT A BAR — and no bar was invented

The ticket names **no** µs bar and says why (*"the function runs once per process; naming a µs bar
would be ceremony"*). This gate invents none. The figures below exist only to say where the module
sits inside `NFR-007`'s 2 s window, and they are recorded with their machine, as every figure in
`plans/nfr-catalog.md` is:

| | sample 1 | sample 2 |
|---|---|---|
| `selectGlyphMode`, first rung decides | **14.3 ns** | 14.1 ns |
| `selectGlyphMode`, all three locale rungs walked | **28.3 ns** | 30.3 ns |
| `beginGlyphModeSession` (the ambient reads + the rule + the closure) | **436.6 ns** | 442.7 ns |

11 rounds × 200,000 iterations per cell, a discarded warm-up round, medians of per-round means, two
fully independent process invocations, on **Apple M3 (Mac15,13) / Node v24.12.0 / Darwin 25.5.0
arm64** — `UNKNOWN - verify` on any other hardware. **Roughly 0.00002% of the 2 s window.**

**Attribution is partial and it is labelled as partial rather than smoothed:** the two ambient
property reads measured in isolation are 155.9 / 158.4 ns and the closure allocation plus one call
is 2.9 / 3.2 ns, which does **not** sum to the 433–445 ns figure. The residual is **not attributed**
and no claim is made about it — nothing depends on it, and a number this gate cannot explain is not
turned into a story.

**NO WALL-CLOCK ASSERTION WAS ADDED TO THE SUITE.** This project's standing rule, kept by
`ABC-011`, `ABC-012`, `ABC-014` and by the Engineer and QE on this ticket.

## ONE INSTRUMENT COULD NOT ANSWER ITS QUESTION, and no number is taken from it

**Does the session closure retain the environment object it was handed?** A `WeakRef` +
`--expose-gc` probe reported an injected 4 MB sentinel env still reachable after three collections.
**The null control — the same probe with NO session created — reported it reachable too**, so the
instrument cannot resolve the question. It is recorded as **`UNKNOWN - verify`** and nothing is
claimed from it, on the same standard `plans/nfr-catalog.md` applies to the whole-key benchmark on
`ABC-011`.

It is also **moot in production**, which is why no better instrument was built for it:
`process.env` is a process-lifetime global, so a reference to it retains nothing that was not
already retained. Structurally the accessor is `() => mode` over a string literal, and
`process.env` is never bound to a variable anywhere in the module.

## What is NOT discharged by any of this

- **`NFR-007`'s actual target — `npx` to first board in under 2 s — is untouched and remains
  `UNKNOWN - verify` in `plans/nfr-catalog.md`.** It is `EPIC-006`'s to measure. A zero-I/O
  component inside a window is not the window.
- **The two-documents-disagree item on that same row is untouched and still open** — `EPIC-006`
  states `npx` in four places while `ADR-0007` clause 5 records the distribution mechanism as
  UNDECIDED. Owners BA/PM and Architect/Design at `EPIC-006`'s decomposition, exactly as recorded on
  2026-08-06. This gate did not settle it and did not edit either side.
- **Every figure here is one machine and one Node version.** This project's standing marker.
