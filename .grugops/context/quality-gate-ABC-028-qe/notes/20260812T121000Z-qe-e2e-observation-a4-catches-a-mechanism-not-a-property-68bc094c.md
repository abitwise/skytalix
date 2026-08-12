---
id: 20260812T121000Z-qe-e2e-observation-a4-catches-a-mechanism-not-a-property-68bc094c
kind: observation
by: qe-e2e
at: 2026-08-12T12:10:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - RISK-ABC028-01
  - ABC-017-A9
  - src/history-pane.test.ts
  - plans/tickets/ABC-028-history-pane-unreached-input-classes.md
supersedes:
---

# `RISK-ABC028-01` is STILL narrower than the real class — and the hole is not in the digest, it is in the WRITE TRAP

> **Hand-authored, no stamp.** Every build below was constructed out of tree from the delivered pane
> plus exactly one anchored edit, `tsc --noEmit` **0**, and **output-identity checked FIRST** at
> twelve fixtures — all render digest `c9faa3ec869bc4d272ca9eff0403e078`, byte-identical to the
> delivered pane, and all restore the caller's graph before returning.

The risk was widened one hop ago, on its own standing obligation, from *"an `ArrayBuffer` alias"* to
***"any buffer-level write reverted before the next sampling point"***. **The re-run obligation fired
again here, and the answer is that the wording is still narrower than what the instrument misses.**

## Four new surviving builds, all `750 passed (750)` on the delivered suite

| build | mechanism | why `A4` is silent | buffer-level? |
|---|---|---|---|
| **`WPOSRAW`** | `Object.getOwnPropertyDescriptor(view, "position").value` yields the **RAW** node; write `position.fullmoveNumber` through it and restore | **the write trap never fires** — no `set` ever reaches a proxy | **NO** |
| **`WMOVEFIELDRAW`** | the same descriptor escape reaching a **`Move`'s own field** (`A4` arming slot 8), mutated and restored | same | **NO** |
| **`WBOARDSUB`** | `board.subarray(0, 8)` — a fresh view over the raw board that never passed a trap; mutate + revert through it | digest samples only at traps; **`.buffer` is never touched at any point** | **NO** |
| **`WBOARDCACHED`** | cache one bound TypedArray mutator (`board.set`), then mutate and revert with no trap in between | the instrument **binds TypedArray methods to the RAW node by design** (`## Test notes` 10) | **NO** |

**Calibration, so these verdicts are trustworthy rather than assertions.** On the same harness, in
the same session: `WPOSMID` **1 failed / 750 at `A4`**, `WBOARDSET` **1 failed / 750 at `A4`**,
`WSPLICE` **2 failed / 750 at `A9` + `A4`** (stays dead), `WBOARDBLIND` **750 passed** —
`RISK-ABC028-01` reproduced exactly as recorded. **The harness kills what the ticket says it kills.**

## The sharpest of the four: `A4` catches a MECHANISM, not a PROPERTY

**`WPOSRAW` and `WPOSMID` do the identical wrong thing to the identical slot.** One writes
`position.fullmoveNumber` *through the handed reference*; the other writes it through a raw
reference **obtained from that same handed reference by one line of standard reflection**. `WPOSMID`
dies at `A4`. **`WPOSRAW` passes 750/750.**

So `A4` clause 1 — and the *"honest statement of the property"* `RISK-ABC028-01` closes with —

> *"every write that reaches the supplied graph through the reference the pane is given is reported"*

**is FALSE as written.** `WPOSRAW`'s write reaches the supplied graph, through the reference the pane
was given, and is not reported. **The claim is not merely narrow; it is falsified by measurement.**

**The mechanism is the instrument's own `getOwnPropertyDescriptor` trap** — added at the build hop as
an extra *sampling point* — at `src/history-pane.test.ts:741-744`. It samples, then returns
`Reflect.getOwnPropertyDescriptor(target, property)` **verbatim**, and a descriptor's `.value` is the
**raw child object**. The `get` trap wraps children; the descriptor trap does not. **A trap added to
widen coverage is the one that hands out the escape.**

## The honest statement of the class, offered for BA/PM to word rather than adopted by me

The hole is **not** *"buffer-level writes reverted before the next sampling point"*. Measured, it is:

> **any write that reaches the supplied graph through a raw reference the instrument itself hands
> out** — via `getOwnPropertyDescriptor().value` (**every** node, **no** revert needed), via
> `board.buffer`, via `board.subarray(...)`, or via a cached bound TypedArray mutator —
> **plus** any board mutation reverted before the next sampling point.

**Two structurally different holes, currently described as one.** The `.buffer`/method/`subarray`
family defeats detector **D2** (the digest) and needs a revert-before-next-sample to hide. **The
descriptor escape defeats detector D1 (the write trap) outright and needs no revert at all** — it is
invisible whether or not it puts the value back. `RISK-ABC028-01`'s text describes only the first.

## The one slot where the escape is CLOSED, reported because it is the honest negative

**`WMOVESRAW`** — the descriptor escape reaching the `moves` **array contents** — **DIES**, at
`1 failed / 750`. Its killer is **`ABC-017` `A9`'s freeze**, not `A4`: a raw write to a frozen array
throws. So the `moves` contents are covered — **by the older, narrower, per-node instrument that
`A4` was written to supersede.** `A4`'s whole-graph statement does not cover it; `A9`'s freeze does.

## What I am NOT claiming

- **Not a code defect.** The delivered pane does none of this; md5 `54fd4346…` unchanged.
- **Not that the instrument should be changed.** The three closures the ticket priced still stand,
  including that copying the `ArrayBuffer` would report **GREEN on a wrong build**. `board.buffer` is
  handed back raw on purpose and I would keep it that way. **I am reporting that the RECORDED CLASS
  is wrong, not that the instrument is.**
- **Not that these builds are likely.** They are boundary probes, exactly as `WBOARDBLIND` was —
  built after everything the ticket asked for was already dead, to find where the wall is.
- **Not that this set is complete.** I stopped at four.

## Also flagged, not fixed — an EQUIVALENT mutant (`AGENTS.md` rule 12)

`WNOMAX` — deleting the inner `Math.max(0, …)` from `firstVisiblePly`
(`src/history-pane.ts:104`) — renders **byte-identically** and passes **750/750**. It is not an
untested branch: the outer `Math.max(0, …)` on the return makes the inner one **provably
unreachable as a corrective** for every input. **Dead code, mentioned and not removed** — no test can
kill it and none should be written for it.
