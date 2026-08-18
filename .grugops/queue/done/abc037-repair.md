---
task: repair-ABC-037-2026-08-19
subtask: abc037-repair
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-037-the-real-prompt-input-seam.md
ref: .grugops/context/repair-ABC-037-2026-08-19/
parent_ref: .grugops/context/quality-gate-ABC-037-qe-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-19T13:00:00Z
branch: grugops/abc037-repair
base: grugops/quality-gate-ABC-037-qe-2026-08-19 @ HEAD
---

# Subtask: `ABC-037` repair round 1 of 2 — QE found the guard you said could not exist

**QE's verdict is PASS.** Nothing here is blocking. What follows is worth doing anyway, and the
first item is the interesting one.

Branch off `grugops/quality-gate-ABC-037-qe-2026-08-19` at its tip — it carries your delivery and
QE's seven notes. Read `parent_ref:` first.

## 1. `G1` (MEDIUM) — you were right to delete the guard, wrong about why, and a working one exists

**Your conclusion was correct**: `heapUsed` is blind here, and shipping that guard green would have
been worse than shipping none. QE reproduced the blindness exactly.

**Your stated mechanism was wrong.** *"`heapUsed` does not account a cons-string's referents"* — QE
measured a **flattened** 16 MiB string reported by `heapUsed` as **16.00 MiB on the nose**. The
retained leaves are **external string data**, not unaccounted cons referents. A full field diff
isolates it to one field:

```
delivered : total_heap_size 4.00, rss 20.19                       (no external delta)
M6c       : total_heap_size 4.00, rss 36.08, external_memory 32.00, external 32.00
```

**So the guard exists**: `process.memoryUsage().external` after a forced `gc()`. QE ran it inside
vitest on four builds — delivered **0.00 MiB**, `M6b` 0.00, `M6` 2.00 (exactly one 1 MiB chunk),
**`M6c` 33,554,472 B = 32.00 MiB → RED at a 4 MiB threshold. 36 ms, 32:1 margin.**

It needs `NODE_OPTIONS=--expose-gc`; without a forced collection it does not separate (29.99 vs
33.99).

**Reproduce it yourself before you rely on it** — you have been burned once by a memory measurement
and QE's number deserves the same scepticism yours got. Then add it, behind the opt-in lane if the
`--expose-gc` requirement makes the default lane awkward. **The retained-bytes bound stops being a
construction argument and becomes a test.**

Note the module's own doc still asserts the mechanism QE disproved. Fix that sentence.

## 2. `G3` (LOW) — a real off-by-one your own row could not see

**The cap is applied BEFORE the CRLF strip.** `"z"×1024 + "\r\n"` is rejected `line too long`,
while the same 1024 characters + `"\n"` pass. **The effective cap is 1023 on a Windows pipe.**

Your `A2` row says *"the boundary is not off by one"* and is structurally blind to it, because it
never feeds CRLF. Fix the ordering, and make the row see it.

This is the same player `M12` was about — the CRLF strip you added mid-hop after a mutant survived.

## 3. `G4` (LOW) — `{ stream: true }` is unguarded

QE's `M-QE1` drops it and **survives 26/26** while corrupting split multibyte input to `U+FFFD`.
Add a guard with a decoder-boundary case.

## 4. `G5` (LOW) — and this one is about the gate, not the code

`M-QE2` (leaked `data` listener) and `M-QE3` (EOF outranking the queued surplus) are killed **only
under `INPUT_DEEP=1`, which is not in the blocking gate.** QE's words: *"the deep lane is
load-bearing, not breadth only."*

**Decide and state which is true**: either those kills belong in the default lane, or `INPUT_DEEP`
must be named as required for this module and that requirement recorded where a gate runner sees it.
Do not leave a load-bearing lane optional by accident.

## 5. `G7` (INFO) — two small record errors

Your trace header says *"eighteen"* mutants; the row says 19/16. And `MAX_LINE_LENGTH`'s doc says
*"characters"* while the code counts **UTF-16 units** — an astral-plane line caps at 512. Say what
it counts.

## Explicitly NOT yours

- **The `A6` obfuscated load-time escape.** It lands, and QE confirmed it crosses security bar 3 —
  but it is **malicious-edit only, not input-reachable**. QE recommends **not** widening the token
  scan (an arms race it would lose) and carrying it as a named precondition on `ABC-038`. **I
  accept that. Do not widen the scan.**
- **`AGENTS.md`.** Its trap paragraph is being corrected by the AGENTS.md Scribe in parallel — its
  measurement is right, its mechanism is wrong, and its conclusion ("the bound cannot be a test") is
  now false and would steer the next engineer away from the guard QE found. **Do not edit
  `AGENTS.md`; you will collide.**
- **`ABC-033`'s rejected-promise residual** (`src/move-input.ts:191`) — type-forbidden, merged,
  gated four times. Not re-opened.

## Fences

- **`A8` still binds**: `src/line-input.ts` and `src/line-input.test.ts` only. `src/turn-loop.ts`
  and `src/frame.ts` byte-identical.
- Do not weaken a guard to make it pass. Do not merge, do not deploy, do not move a board column.
- **`N8-LANE` is NOT grantable** — QE measured **13.91 s CPU without this ticket** against a 13 s
  clause, reproducing `ABC-108` from a third tree. Report your cost; do not claim the bar.

## Gate

Full blocking gate in a contained lane. Baseline: **1175 tests / 39 files**, skip 0, `PERFT_DEEP=1`
32/32, `INPUT_DEEP=1` 26. Re-run QE's `M6c`, `M-QE1`, `M-QE2`, `M-QE3` and show what now reds.
Record mutant **diffs**. Commit incrementally.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of `.grugops/queue/claimed/abc037-repair`.

Commit on `grugops/abc037-repair`, never on `main`.
