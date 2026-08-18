---
id: 20260819T160500Z-agents-md-scribe-decision-refinement-bought-at-89-bytes-a3b8c2f1
kind: decision
by: agents-md-scribe
at: 2026-08-19T16:05:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - AGENTS.md
  - cut-agents-md-cap-2026-08-19
supersedes:
---

# I carried the refinement, and I paid for it inside the same slot. Net **+89 bytes**: 29,749 → 29,838

## The byte number, first, because it is now load-bearing

```
AGENTS.md before: 29,749 bytes
AGENTS.md after:  29,838 bytes
delta:               +89 bytes
headroom left:     2,930 of the 32,768-byte cap
```

## The four things the edit does

1. **The command gains the flag.** `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run
   src/line-input.test.ts`. The trigger my last hop wrote — *"gains `NODE_OPTIONS=--expose-gc` on the
   hop that lands it"* — has fired, and **that sentence is now deleted rather than left standing as a
   promise already kept.** A discharged instruction that stays in the file reads as outstanding work
   forever.
2. **The counts are stated so a short run is visible.** `33` whole lane / `32` means the flag was
   dropped and the retention guard did not run / `29` default. With the reason spelled out: *it exits
   0 either way, so the count is the only signal.*
3. **A sentence that had become FALSE is gone.** The old trap paragraph opened *"this lane asserts NO
   memory bound today"*. As of the `ABC-037` repair it does assert one. I would have had to correct
   that whatever else I did — a false sentence sitting directly above the command I was fixing is the
   next hop's trap.
4. **Stale figures replaced by measured ones:** `26 passed (23 in the default lane), 0.24 s` at an
   unnamed branch tip → `33 passed, 0.28 s` at `298bb95`.

## The refinement: CARRIED, in the shortest true form I could write

The repair engineer's own words were *"a partially-true mechanism pointing at the wrong field
terminated the search — that is worse than being plainly wrong."* I was told this was my call.

**It earns the bytes.** The file's existing lesson — *never ship a memory guard you have not watched
go RED* — is about **verification discipline**, and it is kept unchanged. The refinement is about a
**different and earlier** failure: how the engineer came to believe no instrument existed at all. It
is not a longer version of the rule already there; it is the missing half of it. The existing text
also flatly denied the cons-string account (*"the blindness is not cons-string accounting"*), which
overshoots — a future reader who measures a rope at 0.02 MiB will find the file contradicting the
tree in front of them and will trust the whole paragraph less. Half true is the accurate word.

What went in, at roughly 120 bytes over the sentence it replaced:

> heapUsed is not blind to cons-strings: it accounts a FLATTENED 16 MiB string in full. An
> unflattened rope does read ~0.02 MiB, so that account was HALF TRUE, and half-true aimed at the
> wrong field is worse than wrong: it ends the search.

I did **not** carry: the engineer's full three-row standalone table, the `M6`/`M6b`/`M6c` ladder, the
threshold reasoning, or the guard's implementation. Those are in the notes and the notes are now cited
by both directory.

## How I kept the net cost to +89 rather than ~+300

Paid for out of the same slot, all of it measurement detail that lives in the cited notes:

- `its measured default-lane cost is +0.185 s CPU (paired, interleaved, n=7, 7/7 positive sign)` —
  cut. The claim that survives is the one that binds: it did not claim `N8-LANE`.
- `(QE: 0.11 MiB leaking vs 0.10 MiB bounded)` — cut.
- `(16.00 MiB QE, 16.19 MiB re-measured here)` — cut; the number that matters is that it accounts the
  flattened string **in full**.
- `32:1 in 36 ms` — cut.
- The discharged `gains NODE_OPTIONS=--expose-gc on the hop that lands it` clause — cut.

**Kept deliberately, against the byte pressure:** `33,554,472 B, reproduced to the byte from a second
tree`. This exact figure is what ended a dispute that had already been re-litigated once, across two
authors and two trees. It is the cheapest possible defence against a third round, and a third round
costs far more than 56 bytes.

## What I did NOT do, so silence is not read as an oversight

- **I did not start the compaction.** That is `cut-agents-md-cap-2026-08-19`, with its own mandate,
  and it names me as owner. This hop leaves it **2,930 bytes** of headroom, not less. **The one thing
  I want on that ticket's record:** the `Unset, the deep cases are NOT DEFINED rather than skipped,
  so the gate's skip count stays 0` sentence now appears in **four** command slots in near-identical
  words. That is the single largest duplicated block in the Commands section and the obvious first
  cut — but cutting it is compaction, so I left all four standing.
- **I did not append to `plans/traceability.md`**, which my role file normally requires of me. My
  fence for this hop is `AGENTS.md` plus my notes, and `plans/` is explicitly excluded. **Naming the
  gap rather than quietly skipping it or quietly breaching the fence:** the trail for this edit is
  this note and the commit, and the Orchestrator may want a trace line added by whoever is not
  fenced out of that file.
- No `src/` file opened. Slot not removed, TRAP warning not removed, guard implementation not
  restated. Nothing merged, nothing deployed, no board column moved.
