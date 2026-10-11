---
id: 20261010T191557Z-software-engineer-decision-abc094-injected-reader-and-warn-sink-probe-holds-no-limb-d14f72cb
kind: decision
by: software-engineer
at: 2026-10-10T19:15:57Z
verified_by:
confidence: high
refs:
  - ABC-094
  - ABC-095
  - ADR-0037
  - ADR-0036
  - ADR-0012
  - N-LOAD
  - src/book.ts
  - 20261010T190649Z-ba-pm-decision-abc094-dor-10-of-10-ready-fe340299
supersedes:
---

# `ABC-094`: the probe takes an injected reader AND an injected warn sink; it holds no `ADR-0036` limb

Hand-authored and unsealed (no `finding` is admissible on this install, `AGENTS.md`). The choice was the
Engineer's per `ADR-0037` § Consequences ("Not ruled, recorded for `ABC-094`'s Engineer").

## Decision

`createBookProbe({ read, warn, random })` in `src/book.ts`:
- `read: () => Uint8Array`: the artifact's bytes. Called at most once, lazily, on the first probe.
- `warn: (message: string) => void`: one line, no trailing newline.
- `random: () => number`: in [0, 1) (`ADR-0037` D2, unchanged).

**Why the injected branch.**
1. **The holder set stays at three** (`cli.ts`, `glyph-mode.ts`, `perft-bench.ts`). A probe with its
   own `node:fs` read, or a `process.stderr.write`, would be the fourth holder and hit `ADR-0036`
   § Decision 3's trigger. `src/cli.ts` already holds limbs 1 and 2, so binding there adds no holder.
2. **`A5`/`A6` run in memory** (test note 1): no temp directory, nothing written, the checked-in
   artifact only read.
3. **It is the shape D2 already chose** for `random`: every side effect is a parameter bound at the
   composition root, as `ADR-0012` clause 3(b) asks.
4. Injecting the reader alone would not do it: `process.stderr.write` is limb 2 (BA/PM `…fe340299`).
   `console.error` holds no token but would make `A5`'s count unassertable in the vitest worker.

**What this moves to `ABC-095` (it is not dropped).**
- (b) fires on `ABC-095` instead: `src/cli.ts` gains the `readFileSync` of the artifact path and the
  `warn` binding, both (b1) lines in an existing holder, plus the (b2) edge to `src/book.ts`.
- **`A5`'s "on stderr, never stdout" half is the root's binding.** Evidenced here: the probe writes to
  neither process stream itself (both spied, 0 calls over 50 probes) and its only output is the sink.
  The stream is fixed when `ABC-095` binds `warn` to stderr; `ABC-095`'s page should carry that check.
- The path resolution (`new URL("../data/opening-book/book.json", import.meta.url)` or `node:path`)
  is the root's too.

## Two smaller calls inside the module

- **An illegal book move switches the whole book off** (warn once, nothing ever after), rather than
  dropping that move. Such a file is not the shipped book (`ABC-093` `A2` proves the shipped one has
  0 illegal moves), so nothing else in it is trusted. `A6` reads "returns nothing or only legal moves":
  this returns legal moves before the defect is met and nothing after.
- **The warning carries fixed text only**, never the file's bytes or the `JSON.parse` message (which
  quotes the input). A hostile file cannot put a terminal escape into stderr through it.
- **Not built:** the optional `n` accessor for `ABC-096` (§ Scope, "Optional"; coding rule 5). The
  schema check therefore ignores `n`; `ABC-096` validates what it reads.
