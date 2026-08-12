---
id: 20260812T125000Z-ba-pm-observation-a4-boundary-re-measured-with-a-calibration-control-d5cfb517
kind: observation
by: ba-pm
at: 2026-08-12T12:50:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-028-A4
  - RISK-ABC028-01
  - ABC-017-A9
  - src/history-pane.test.ts
  - src/history-pane.ts
supersedes:
---

# `A4`'s boundary re-measured on this tip with a calibration control — clause 1 is falsified, and the class is two classes

> **Hand-authored, no stamp.** Each build is the delivered `src/history-pane.ts` text plus **exactly
> one anchored edit**, both anchors asserted unique before substitution, the source md5 checked against
> **this tip's** `c4653c4c263c4c417ea34969164ccd86` first, and **output identity checked BEFORE any
> suite verdict was taken seriously.**

## The measurement

```
build       mechanism                                     render digest   suite (750)   buffer-level?  revert?
WPOSMID     position.fullmoveNumber through the HANDED     c9faa3ec…       1 failed/750  n/a            yes
            reference  [CONTROL — must die]                                ^ A4 kills it
WPOSRAW     the same slot, same badness, reached by        c9faa3ec…       750 passed    NO             NO
            getOwnPropertyDescriptor(history,"position").value
WBOARDSUB   board.subarray(0, 8) — a fresh view that       c9faa3ec…       750 passed    NO             yes
            never passed a trap
```

**`WPOSMID` dying in the same session is what makes the other two verdicts a measurement rather than an
assertion.** All three render `c9faa3ec869bc4d272ca9eff0403e078` — byte-identical to the delivered pane
— and restore the caller's graph.

## `G2` — clause 1's stated property is FALSE, and the mechanism is at source

`A4` clause 1 and `RISK-ABC028-01`'s closing *"honest statement"* both say:

> *"every write that reaches the supplied graph **through the reference the pane is given** is
> reported"*

**`WPOSRAW`'s write reaches the supplied graph, through the reference the pane was given, and is not
reported.** `WPOSMID` and `WPOSRAW` do the identical wrong thing to the identical slot; one dies, one
passes 750/750. **The claim is not merely narrow — it is falsified by measurement.**

**The mechanism, read at source at `src/history-pane.test.ts:741-744`:**

```ts
getOwnPropertyDescriptor(target, property) {
  sample(`descriptor ${path}.${String(property)}`);
  return Reflect.getOwnPropertyDescriptor(target, property);
},
```

It samples, then returns the descriptor **verbatim** — and a descriptor's `.value` is the **raw child
object**. **The `get` trap wraps children; the descriptor trap does not.** The trap added at the build
hop to **widen** coverage is the one that hands out the escape. That is this family's signature shape
and it is the third time it has appeared on this pane.

## `G3` — `RISK-ABC028-01` is still narrower than the class, after being widened once

*"any buffer-level write reverted before the next sampling point"* does not cover `WBOARDSUB`:
`subarray()` never touches `.buffer` at any point. **The wording names a level of the memory model
where the real class is a provenance of the reference.**

**And it describes two structurally different holes as one.** They defeat different detectors, need
different things to hide, and — decisively — **only one of them is unclosable:**

- **`01a`, the DIGEST escape (defeats D2):** `.buffer`, a `DataView` over it, `subarray()`, a cached
  bound TypedArray mutator. **Needs a revert to hide.** Genuinely not closable by a better proxy —
  sampling is defeatable by a short enough window. Stays **accepted**.
- **`01b`, the WRITE-TRAP escape (defeats D1):** any non-board slot reached through a raw reference the
  instrument itself hands out. **Needs NO revert — invisible whether or not it puts the value back**,
  which makes it strictly worse. **OPEN, and closable.**

## The honest negative, reported as prominently as the survivors

**`WMOVESRAW`** — the same descriptor escape reaching the `moves` **array contents** — **DIES**
(QE measured `1 failed / 750`; I did not re-run this cell). **Its killer is `ABC-017` `A9`'s freeze,
not `A4`.** That slot is covered **by the older, narrower, per-node instrument `A4` was written to
supersede.** Worth writing down: the whole-graph statement does not cover what the per-node freeze does.

## A fourth closure, named and explicitly NOT refused

Wrap the descriptor's `.value` in the same `wrap()` the `get` trap already uses. **Unlike the three
closures priced and refused in the ticket, it does not report GREEN on a wrong build, does not
constrain implementations, and does not move the criterion into another file.**

*Claimed: it is not obviously refusable, and it is the first of the four with a plausible cheap
implementation.* **NOT claimed: that it is cheap, correct, or free of lane cost — none of that was
measured and I did not measure it.** It is **not mandated** by `ABC-028`: the ticket is built and
green, `A4` says the mechanism is the Engineer's, and **growing a green instrument from a text hop is
the smoothing move wearing the opposite coat.** Recorded with an owner so a later hop takes it on the
merits.

## What I am NOT claiming

- **Not a code defect.** `src/history-pane.ts` carries zero bytes of change from this ticket.
- **Not that `A4` is UNMET.** All four clauses' obligations hold — zero reported writes, the 128-byte
  digest at every access, the sample counter `> 0`, the tripwire, eight arming slots, the positive
  control. **What was wrong is the property the criterion claimed to establish.**
- **Not that the instrument should change.** See above.
- **Not that this set is complete.** I ran three builds; QE ran fourteen. Neither set is certified.
