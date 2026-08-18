---
id: 20260819T140500Z-qe-e2e-observation-abc037-m6c-has-a-working-guard-d2b3c4e5
kind: observation
by: qe-e2e
at: 2026-08-19T14:05:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - src/line-input.ts
  - src/line-input.test.ts
  - AGENTS.md
supersedes:
---

# `G1` — `M6c` IS killable. The instrument is `external`, not `heapUsed`, and the recorded mechanism is wrong

The engineer handed this over as the open corner and asked for a QE hop on it. Here is the hop.

## First: the engineer's measurement REPRODUCES exactly

Same shape as theirs — a 16 MiB unterminated flood through a real `PassThrough`, `node --expose-gc`,
forced collection either side, both builds side by side:

```
                     heapUsed delta
delivered (bounded)      0.10 MiB
M6c (drop both halves)   0.11 MiB     <- a 16,777,216-character leak, invisible
```

`heapUsed` cannot see this leak. **That half of the engineer's finding is correct and it stands.**
Deleting a green row that could never fire was the right call.

## Second: the stated MECHANISM is not what is happening, and that is what closed off the fix

The recorded reason — in the mutant-ledger note, the test-file header, and `AGENTS.md` — is
*"`heapUsed` does not account a V8 cons-string's referents"*. I tested that claim directly, out of
tree, `node --expose-gc`, 16 x 1 MiB chunks with distinct content so nothing can be shared:

```
mode                                     heapUsed delta   rss delta
cons  (16 MiB rope, left unflattened)          0.02 MiB     0.05 MiB
flat  (the SAME 16 MiB, flattened)            16.00 MiB    16.27 MiB
bytes (16 x 1 MiB Uint8Array)                  0.01 MiB    15.83 MiB
```

**`heapUsed` accounts a flattened 16 MiB string perfectly — 16.00 MiB on the nose.** So the blindness
is not a cons-string accounting rule. In the real seam the retained leaves are the decoder's output
and they live in **external string backing stores**, which `heapUsed` does not count and
`process.memoryUsage().external` does. A full `v8.getHeapStatistics()` + `process.memoryUsage()` diff
across the flood, delivered vs `M6c`, isolates it to exactly one field:

```
delivered   deltas >= 0.5 MiB: total_heap_size 4.00, rss 20.19            (no `external` delta)
M6c         deltas >= 0.5 MiB: total_heap_size 4.00, rss 36.08,
                               external_memory 32.00, external 32.00      <- the leak, exactly
```

32.00 MiB = 16,777,216 characters x 2 bytes. The instrument names the leak to the byte.

## Third: the guard, built and RUN inside vitest, on both builds

Written out of tree as `src/qe-m6c-probe.test.ts`, run, and **deleted** — no test was added to the
delivered tree and the delivered files are byte-identical to `HEAD`. Reproduced here so the engineer
can adopt it verbatim:

```ts
const gc = (globalThis as { gc?: () => void }).gc;
expect(typeof gc, "run with NODE_OPTIONS=--expose-gc").toBe("function");
const settle = (): number => { gc(); gc(); return process.memoryUsage().external; };

const source = new PassThrough();
const seam = createLineInputSeam({ source, output: { write() {} } });
const pending = seam(newGame(START_FEN));
await tick();
const before = settle();
for (let index = 0; index < 16; index++) {
  source.write(`${index}-${"z".repeat(1024 * 1024 - String(index).length - 1)}`);
  await tick();
}
const retained = settle() - before;
source.write("\ne4\n");
expect((await pending).kind).toBe("rejected");
expect(retained).toBeLessThan(4 * 1024 * 1024);   // one chunk's worth of slack
```

Results, `NODE_OPTIONS=--expose-gc npx vitest run`, `pool: "threads"` as configured:

| build | retained `external` | at a 4 MiB threshold |
|---|---|---|
| **delivered** | **0.00 MiB** | **PASS** |
| `M6b` (drop the early return) | 0.00 MiB | PASS — correctly, it is equivalent |
| `M6` (drop the free) | 2.00 MiB | PASS — one chunk, the construction argument's own bound |
| **`M6c`** (drop both) | **32.00 MiB** (`33,554,472` bytes) | **RED** |

Cost: **36 ms**. Margin: **32:1**. Stable across repeated runs; the delivered build's delta was below
the 0.5 MiB reporting floor on every run I made, with and without a forced collection at 16 MiB.

**Two conditions, both cheap and both honest.** It needs `--expose-gc`, so the recorded lane command
becomes `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts` — this lane is
opt-in already and the flag changes nothing about the default lane or the gate's skip count. Without
a forced collection the instrument does NOT separate (delivered 29.99 MiB vs `M6c` 33.99 MiB — the
flood's own uncollected garbage swamps it), so the `gc()` is load-bearing and the `expect(typeof gc)`
line above is what stops the guard silently degrading into a green row again.

## Fourth: `M6`/`M6b` — the classification CHECKED, and one refinement

The brief said not to inherit it. I did not.

- **Behaviour:** both survive at **26/26** under `INPUT_DEEP=1`. I also reasoned it through and it is
  sound: `overlong` is only ever cleared by `completeLine`/`onEnd`, so once the cap is crossed the
  outcome is `rejected` regardless of what `pending` holds, and `pending`'s content is never read on
  that path. `M6c` is likewise **behaviourally unobservable** through the seam's public surface — the
  16 MiB string is pushed into `queued`, shifted out, and discarded without being read. There is no
  functional guard for any of the three; memory is the only channel.
- **Retention:** `M6b` 0.00 MiB, `M6` **2.00 MiB**, delivered 0.00 MiB, `M6c` 32.00 MiB.

So the engineer's *"either alone caps retention at one chunk"* is **exactly right, and now measured**
rather than argued — `M6`'s 2.00 MiB is one 1 MiB chunk at two bytes per character. The refinement:
`M6` and `M6b` are equivalent **to each other and to the bound**, but they are not retention-identical
to the delivered build; the delivered build's two halves are redundant in the sense that removing
either keeps the bound, not in the sense that removing either is free. A guard at a one-chunk
threshold would kill `M6`. A guard at the 4 MiB threshold above kills `M6c` only, which is the
correct behaviour and what I recommend.

## What this costs the ticket

**Nothing, today.** The delivered build is correct: the cap holds, the flood is survived, rejected,
kept from every resolver and recovered from. `G1` is a MISSING GUARD, not a defect — the risk is that
a later edit removes both halves of `absorb`'s bound and ships, which is exactly the scenario the
deleted row was meant to cover and which nothing currently covers.

**`AGENTS.md` is where this bites hardest.** Its trap paragraph reads *"the retention bound is a
construction argument in absorb(), not a test"* and attributes the blindness to cons-strings. A
reader who believes it will not look for `external`. Recommend the trap be amended to: `heapUsed` is
blind because the retained leaves are external string data; **`process.memoryUsage().external` after
a forced collection sees it exactly**; do not add a `heapUsed` row back, add the `external` one.
Whose pen that is, is the Orchestrator's to route.
