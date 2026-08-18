---
id: 20260819T141000Z-qe-e2e-observation-abc037-a6-escape-lands-and-a5-attacked-e3c4d5f6
kind: observation
by: qe-e2e
at: 2026-08-19T14:10:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-033
  - ABC-035
  - src/line-input.ts
  - src/line-input.test.ts
supersedes:
---

# `G2` — the `A6` escape LANDS, and `A5` survives every attack I could build

## The `A6` escape — built, run, and it passes the whole gate

The engineer states layer 3 is lexical and would not see a deliberately obfuscated runtime
reconstruction of a global's name. **That admission is correct. Here is the escape.**

### Attempt 1 — obfuscated, bound at CALL time. CAUGHT.

```ts
const ctor = Object.getPrototypeOf(() => {}).constructor as (...a: string[]) => () => unknown;
const root = ctor("return this")() as Record<string, unknown>;
root["pro" + "ce" + "ss"].stdout.write(`${line.text}\n`);
```

No banned token — `Function`, `globalThis`, `process`, `eval`, `require`, `node:` all absent; no new
import, so layers 2 and 3 are both blind. **But layer 1 caught it: 1 red**, on the
`process.stdout.write` spy. Because the global is reached at call time, the `vi.spyOn` mock is
already installed and sees the write.

**That is worth recording on its own: the layer the engineer calls "not the load-bearing one" is the
only layer that caught the first escape.** It earns its keep.

### Attempt 2 — the same obfuscation, bound at LOAD time. **LANDS.**

Move the reconstruction to module top level and `.bind()` it, so the reference escapes before any
spy exists — `ABC-035` `G1`'s `Q2` channel, wearing `G2`'s obfuscation:

```ts
const q1bCtor = Object.getPrototypeOf(() => {}).constructor as (...a: string[]) => () => unknown;
const q1bRoot = q1bCtor("return this")() as Record<string, unknown>;
const q1bOut = (q1bRoot["pro" + "ce" + "ss"] as { stdout: { write(t: string): void } }).stdout;
const q1bWrite = q1bOut.write.bind(q1bOut);
// ... and in the seam, before the resolver:
q1bWrite(`${line.text}\n`);
```

**Full blocking gate against that build, every step run by me:**

| step | result |
|---|---|
| `INPUT_DEEP=1 npx vitest run src/line-input.test.ts` | **26/26 PASS** |
| `npm test` | **39 files / 1175 tests, 0 failed** |
| `npm run lint` | **exit 0**, 70 files (after one `biome format --write`) |
| `npm run typecheck` / `npm run build` | **exit 0** |

**Green. All three `A6` layers blind, and every typed line written verbatim to the real terminal.**

### It defeats security bar 3 too, and that is the part that matters

Measured with the hostile line the brief names, against the escape build, with a **late-bound** spy
watching `process.stdout.write` — the strongest runtime instrument available:

```
outcomeKind:                      "rejected"
injectedWritesSeenByALateSpy:      0        <- the spy sees NOTHING
escBytesReachingRealStdout:        (raw ESC bytes reached the terminal)
```

The probe's own terminal was cleared and homed by the `\x1b[2J\x1b[H` it emitted. So the escape does
not merely violate `A6`'s "the bytes this module writes are the prompt only" — it puts
**player-controlled ESC and BEL bytes on the terminal without passing `assembleFrame`'s sanitizer**,
which is security bar 3's whole claim.

### The `fs.writeSync` half, for completeness

- `Q2` — a **plain-spelled** load-time-bound `process.stdout.write`: **1 red**, and the red is the
  **token scan alone**. The `A6` runtime-spy row passed it. **This confirms the engineer's claim
  precisely: no runtime spy sees this channel and layer 3 is the only thing standing there.**
- `Q3` — `fs.writeSync` via an obfuscated dynamic import, but spelling `writeSync` plainly:
  **1 red**, on the token scan.
- `Q3b` — the same with `m["write" + "Sync"]`: **26/26 PASS. Lands.**

**So both channels `ABC-035` proved unobservable ARE closed by construction and not by a lucky spy —
in their plain spelling.** The delivered module holds no reference to any global stream, `process`
occurs zero times in code, the import set is exactly four relative project modules, and mutants `Q2`,
`Q3`, `M10` and `M17` all red on the lexical layers rather than on a runtime one. That is exactly what
the engineer claimed and it is true. The residual is the **obfuscated** spelling of the same two
channels, and neither layer 2 nor layer 3 nor any spy sees it.

### Does the residual matter for a module whose job is to write a prompt? My answer, in two halves

**It matters MORE here than anywhere else in this repository, and it is NOT reachable by input.**

- Why it matters more: every other module either holds no player bytes or writes nothing. This one
  does both. It is the only place where "holds untrusted text" and "legitimately writes to the
  terminal" meet, so it is the only place where a single added line converts untrusted input into
  terminal control. `ABC-038` is scheduled to add lines to this very module.
- Why it is not a security bar failure: **no input can trigger it.** It requires a deliberately
  malicious edit to `src/line-input.ts`. The three bars are about untrusted INPUT, and against
  untrusted input this module is closed — I re-measured all three and all three hold. This is a
  supply-chain / insider-edit exposure, and a guard against a deliberate attacker who is already
  editing production source is a guard with no end.
- **What I would NOT do is widen the token scan.** Chasing `constructor`, `atob`, `String.raw` and
  the rest is an arms race the test file loses, and `constructor` in particular has legitimate uses.
  I checked the delivered file for all of them anyway: **zero occurrences of every one**.

**`G2` is MEDIUM and it is a KNOWN-LIMIT gap, not a defect.** The engineer stated the limit precisely
and did not oversell it. What this hop adds is that the limit is **demonstrated** rather than
conceded, and that the demonstration also crosses security bar 3 — which the note did not say. Carry
it as a named precondition on `ABC-038`, the same shape `ABC-035` `G1` was carried on `ABC-045`/`046`.

## `A5` — attacked, not re-derived. It HOLDS.

I did not re-check "no `try`, no `catch`"; the Orchestrator verified that. I went after the swallow
paths the brief named. Seven attacks, run against the delivered build:

| attack | result |
|---|---|
| a resolver throws synchronously | **PROPAGATES** — same object, out of the seam |
| the prompt `output.write` throws | **PROPAGATES** |
| `source.resume()` throws inside the `new Promise` executor | **PROPAGATES** — the executor converts it to a rejection, which still reaches the loop |
| `.catch()` / `Promise.allSettled` / `Promise.any` / `.then()` / `finally` in the delivered file | **NONE PRESENT** |
| a default parameter that evaluates | **NONE PRESENT** — `deps?` is optional with no initializer |
| a floating promise anywhere in the file | **NONE** — every statement-position call in the file is synchronous (`queued.push`, `completeLine`, `source.off`, `resolve`, `source.on`) |
| the loop's own handling | `src/turn-loop.ts:291-303` — `takeBack(history, 0); throw error;`. **Repairs and rethrows**, as `A9b` requires |

**`A5` is met by construction and the construction survives attack.** Two residuals found, both
outside `A5`'s reach and both recorded rather than glossed:

1. **A resolver that returns a REJECTED PROMISE is not a throw and is not covered.** With a
   promise-returning `parseSan`, the seam resolves `{ kind: "rejected", messages: ["unreadable"] }` —
   *the exact shape mutant `M1` produces* — while the rejection floats and later kills the process as
   an unhandled rejection. The classification is `src/move-input.ts:191`'s, not this module's, and the
   `MoveInputDeps` type forbids an async resolver, so this is **not an `ABC-037` defect and I am not
   re-opening `ABC-033`**. It is recorded because `ABC-037` is the first module to make the path live
   in production, and because it is the one input that produces `A5`'s forbidden outcome without a
   `try` anywhere.
2. **A throw inside the `data` listener is not on the promise chain at all** — the read then **hangs
   forever** while the throw escapes to the emitter. Reproduced with a chunk that is neither `string`
   nor `Uint8Array`, which makes `decoder.decode` throw. This is the same class as the residual the
   module header already names ("any handling of an `error` event on the source" is `EPIC-006`'s, and
   a hanging read is the honest residual). **Already disclosed, now measured.**
