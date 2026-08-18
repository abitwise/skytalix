---
id: 20260819T151000Z-software-engineer-observation-abc037-mutant-diffs-and-results-c3d4e5f6
kind: observation
by: software-engineer
at: 2026-08-19T15:10:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - src/line-input.ts
  - src/line-input.test.ts
supersedes:
---

# Mutant ledger for repair round 1 — the DIFFS, and what reds now

Every mutant below is a diff applied to `src/line-input.ts`, run, then the tree restored. The
restore was verified each time; the delivered module is md5 `2428f654f694b87a8e22ec199c01dcde` at
the QE base and every measurement in the `G1` note was taken against a tree that returned to it.

**Lane key:** `default` = `npx vitest run src/line-input.test.ts` (29 rows, what the gate runs);
`deep+gc` = `INPUT_DEEP=1 NODE_OPTIONS=--expose-gc npx vitest run src/line-input.test.ts` (33 rows).

## The four the brief named

### `M6c` — drop BOTH halves of `absorb`'s bound → **now KILLED** (was: survives)

```diff
   const absorb = (text: string): void => {
-    if (overlong) return; // already over the cap: the rest of this line is not kept at all
     pending += text;
     if (pending.length > MAX_LINE_LENGTH + 1) {
       overlong = true;
-      pending = "";
     }
   };
```

`deep+gc`: **1 failed | 32 passed**, in 45 ms.
`→ expected 33554472 to be less than 4194304`. One row reds and it is the row aimed at it.

### `M-QE1` — drop `{ stream: true }` → **now KILLED, in the DEFAULT lane** (was: survives 26/26)

```diff
-    const text = typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true });
+    const text = typeof chunk === "string" ? chunk : decoder.decode(chunk);
```

`default`: **1 failed | 28 passed** — *"reassembles a UTF-8 character split across a chunk boundary,
rather than replacing it"*.

### `M-QE2` — never detach the `data` listener → **now KILLED, in the DEFAULT lane** (was: deep only)

```diff
   function deliver(line: SubmittedLine | null): void {
     const resolve = waiting;
     if (resolve === undefined) return;
     waiting = undefined;
-    source.off("data", onData);
     source.pause();
```

`default`: **1 failed | 28 passed** — *"leaves no `data` listener behind, over many reads"*.

### `M-QE3` — EOF outranks the queued surplus → **now KILLED, in the DEFAULT lane** (was: deep only)

```diff
   const readLine = (): Promise<SubmittedLine | null> => {
+    if (ended || source.readableEnded === true) return Promise.resolve(null);
     const carried = queued.shift();
     if (carried !== undefined) return Promise.resolve(carried);
-    if (ended || source.readableEnded === true) return Promise.resolve(null);
```

`default`: **1 failed | 28 passed** — *"serves lines already parsed out of a chunk AFTER the stream
has ended, and only then eof"*.

## The two I wrote against my own `G3` repair

A repair with no mutant against it is an assertion. Both halves of this one are held.

### `M-R1` — restore the pre-repair ordering (the shipped bug) → **KILLED**

```diff
-    if (pending.length > MAX_LINE_LENGTH + 1) {
+    if (pending.length > MAX_LINE_LENGTH) {
...
-    queued.push({ text, overlong: overlong || text.length > MAX_LINE_LENGTH });
+    queued.push({ text, overlong });
```

`default`: **1 failed | 28 passed** — *"passes a line of exactly 1024 units to the resolver on
**CRLF**"*. The LF half of the same `it.each` stays green, which is precisely the blindness QE
described, now visible.

### `M-R2` — keep the slack, drop `completeLine`'s verdict → **KILLED** (this is the dangerous one)

```diff
-    queued.push({ text, overlong: overlong || text.length > MAX_LINE_LENGTH });
+    queued.push({ text, overlong });
```

This half-repair would silently raise the real cap to **1025**. `default`: **2 failed | 27 passed** —
both 1025-unit rejection rows. The pre-existing 1025 row catches it too, so this one is
belt-and-braces rather than the only thread.

## The two survivors, and why they are not gaps

| mutant | diff | retained `external` | verdict |
|---|---|---|---|
| `M6` | drop `pending = ""` | **2,097,192 B** (2.00 MiB) | **SURVIVES 33/33 — correctly.** One chunk. The bound holds. |
| `M6b` | drop `if (overlong) return;` | **40 B** (0.00 MiB) | **SURVIVES 33/33 — correctly.** The bound holds. |

Both were re-run **with the new guard in place** rather than inherited from QE: 33 passed each. They
are equivalent mutants — each half of `absorb`'s bound alone caps retention at one chunk — and a
threshold tightened to kill them would assert which half of a redundant pair exists rather than that
the bound holds.

## Ledger movement

**19 named / 16 killed / 3 survived** → **24 named / 22 killed / 2 survived.** `M6c` moved from the
survivor column to the killed column by measurement; `M-QE1`/`M-QE2`/`M-QE3` were adopted from QE and
killed; `M-R1`/`M-R2` are new and killed. The two remaining survivors are deliberate.

**Out of scope of this ledger, and unrepaired by ruling:** QE's `Q1b` and `Q3b` (the obfuscated
load-time escapes, `G2`). The token scan was **not** widened — see the `decision` note.
