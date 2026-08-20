---
id: 20260820T161500Z-software-engineer-decision-abc050-the-a5-assertion-is-absolute-and-lands-in-no-new-it-block-because-a3-forbids-one-2b8fe641
kind: decision
by: software-engineer
at: 2026-08-20T16:15:00Z
verified_by: ""
confidence: high
refs:
  - ABC-050
  - src/glyph-mode.nfr.test.ts
  - src/glyph-mode.ts
  - vitest.config.ts
supersedes: ""
type: decision
task: ticket-to-pr-ABC-050-2026-08-20
role: software-engineer
ticket: ABC-050
created: 2026-08-20T16:15:00Z
tree: grugops/abc050-lane-runner-guard
---

# Four choices that constrain whoever opens this next, and the criterion collision I resolved rather than absorbed

## 1. `A3` and `A5` COLLIDE on the literal text, and I chose the reading that satisfies both

`A5` demands an assertion be added. `A3` demands the **test total be identical on both sides**. A
new `it()` block satisfies `A5` and **falsifies `A3` by one** (1207 -> 1208). They cannot both be
literally true if the assertion gets its own test.

**Resolution:** the assertion lands **inside the existing `runEverySelectionPath()` helper**, so
the test total stays `1207` and `A5`'s assertion still runs — twice per file, once under each of
the two `it()` blocks that call the helper. This is also the most faithful reading of the ticket's
own `## Scope` row, which names the missing thing as *"an assertion on the value the ambient path
returns"* at the site where that value was being discarded, not as a new test. **Flagged to the
Orchestrator rather than absorbed silently**, because it is a criterion-text defect a later hop
would otherwise rediscover.

## 2. The expectation is ABSOLUTE, and `ascii` is a MECHANISM rather than a sample

`A5`'s boxed warning forbids a baseline captured at module load. The assertion is therefore two
fixed values, neither derived from anything read at load time:

- `process.stdout.isTTY` is **falsy** — because a vitest worker's `process.stdout` is a pipe to
  the parent process and is never a terminal. Measured `undefined` in-worker; it is a property of
  `worker_threads`, not of this machine's terminal.
- the ambient answer is **`"ascii"`** — because a falsy `isTTY` makes **row 3** of
  `selectGlyphMode` decide (`src/glyph-mode.ts`), before any locale variable is consulted.

**I did not pick `ascii` by running it and writing down what came out.** The chain is
worker-thread stdout -> `isTTY` falsy -> row 3 -> `ascii`, and the run confirmed the chain rather
than supplying the constant.

## 3. THE BLIND SPOT IS WRITTEN INTO THE TEST FILE, not left to be discovered

While `isTTY` is falsy, **row 3 short-circuits**, so a leak that mutates only `LC_ALL` / `LC_CTYPE`
/ `LANG` **cannot change the selected mode** and this guard will not see it. That limit is real,
it is not closable without changing what the module does, and it is stated in the helper's own
doc comment. It is also why the `isTTY` signal is asserted **separately** from the mode rather
than folded into it — the `isTTY` half of the hazard is caught directly even when the mode half
would be blind.

Consequence, and it is worth knowing before quoting this guard: on this machine `LC_ALL` is
already `en_US.UTF-8`, so an `isTTY`-only leak flips the mode. On a machine with no UTF-8 locale
set, an `isTTY`-only leak flips the mode too (row 5, `unicode`). The `isTTY` row is the one that
does not depend on any of that.

## 4. `vitest.config.ts`'s OWN header sentence was made false BY MY EDIT, so I corrected it

The `NOTE FOR THE NEXT ENGINEER` block said *"NEITHER `npm run typecheck` NOR `npm run lint` reads
it"*. `A1` makes that false. Correcting it is **not** an unrequested tidy of adjacent code (rule
9) — it is a line my own change falsified, and leaving it would ship exactly the defect class
`A4` exists to remove: a sentence in this file pointing a reader at a fact that is not true. The
replacement records what IS true, keeps the historical statement in the past tense, and warns that
removing either config entry returns the file to being guarded by nothing.

**No runner option moved.** `pool`, `isolate`, `maxThreads` and the `exclude` array are
byte-identical to base — the only lines that changed in `vitest.config.ts` are comment lines.
