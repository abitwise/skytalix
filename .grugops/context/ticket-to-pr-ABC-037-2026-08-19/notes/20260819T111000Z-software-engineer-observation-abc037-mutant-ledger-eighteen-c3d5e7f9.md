---
id: 20260819T111000Z-software-engineer-observation-abc037-mutant-ledger-eighteen-c3d5e7f9
kind: observation
by: software-engineer
at: 2026-08-19T11:10:00Z
verified_by:
confidence: high
refs:
  - ABC-037
  - ABC-035
  - src/line-input.ts
  - src/line-input.test.ts
supersedes:
---

# Mutant ledger — 19 mutants, 16 killed, 3 survived. The survivors are recorded as survivors

Every mutant is a DIFF, applied to `src/line-input.ts`, run as `npx vitest run
src/line-input.test.ts` (deep rows under `INPUT_DEEP=1`), tree restored and re-verified after each.
Three mutants (`M12`, `M16`, and the whole `M6` family) were run TWICE — once against the first
version of the suite, once against the repaired one — and that is where this ticket's real findings
came from.

## Killed — 16

### `M1` — the `A5` discriminator. **2 red**
```diff
-    return resolvePromptLine(history, line.text, deps);
+    try {
+      return resolvePromptLine(history, line.text, deps);
+    } catch {
+      return { kind: "rejected", messages: ["unreadable"] };
+    }
```

### `M2` — drain the pipe. **1 red**
```diff
     source.off("data", onData);
-    source.pause();
     resolve(line);
```

### `M3` — submit the trailing partial line at EOF. **2 red**
```diff
-    pending = "";
+    if (pending.length > 0) {
+      completeLine();
+      if (waiting !== undefined) deliver(queued.shift() as SubmittedLine);
+      return;
+    }
     overlong = false;
     if (waiting !== undefined) deliver(null);
```

### `M4` — the cap off by one. **1 red**
```diff
-    if (pending.length > MAX_LINE_LENGTH) {
+    if (pending.length >= MAX_LINE_LENGTH) {
```

### `M5` — the cap removed. **1 red**
```diff
-    if (pending.length > MAX_LINE_LENGTH) {
-      overlong = true;
-      pending = "";
-    }
```

### `M7` — emit a CSI with the prompt. **4 red**
```diff
-    output.write(PROMPT);
+    output.write(`\x1b[K${PROMPT}`);
```

### `M8` — bypass the command table. **3 red**
```diff
-import { resolvePromptLine } from "./command-input.ts";
+import { resolveMoveInput } from "./move-input.ts";
...
-    return resolvePromptLine(history, line.text, deps);
+    return resolveMoveInput(history, line.text, deps);
```

### `M9` — channel 1, `console.log`. **2 red**
```diff
+    console.log(line.text);
     return resolvePromptLine(history, line.text, deps);
```

### `M10` — channel 3, `fs.writeSync`. **2 red**
```diff
+import { writeSync } from "node:fs";
 import { resolvePromptLine } from "./command-input.ts";
...
+    writeSync(1, line.text);
     return resolvePromptLine(history, line.text, deps);
```

### `M11` — per-keystroke work: complete a line on every chunk. **3 red**
```diff
       if (newline === -1) {
         absorb(text.slice(start));
+        if (pending.length > 0) completeLine();
         break;
       }
```

### `M12` — drop the CRLF strip. **1 red** — *AND IT SURVIVED THE FIRST SUITE*
```diff
-    const text = pending.endsWith("\r") ? pending.slice(0, -1) : pending;
+    const text = pending;
```
Survived the first version of the suite with 0 red: nothing covered a `\r\n` terminator, so a
Windows-pipe player would have had every line rejected as `unreadable`. A CRLF row was added and it
now reds 1.

### `M13` — throw the surplus away. **3 red**
```diff
-    if (queued.length > 0) deliver(queued.shift() as SubmittedLine);
+    if (queued.length > 0) {
+      deliver(queued.shift() as SubmittedLine);
+      queued.length = 0;
+    }
```

### `M14` — write the prompt AFTER the read. **1 red**
```diff
-    output.write(PROMPT);
     const line = await readLine();
+    output.write(PROMPT);
```
This one is why a row exists asserting the prompt is present while the read is still pending: without
it the mutant writes exactly one `PROMPT` per call and passes every other `A6` clause, while the
player stares at a blank row waiting for a prompt that arrives after they type.

### `M15` — channel 5, a `globalThis` flag. **1 red**
```diff
+    (globalThis as Record<string, unknown>).__lineInputSaw = line.text;
     return resolvePromptLine(history, line.text, deps);
```

### `M17` — a SIDE-EFFECT Node builtin import. **1 red**
```diff
+import "node:fs";
 import { resolvePromptLine } from "./command-input.ts";
```
Added after the guard note was written, to make a claim in it TRUE rather than plausible: a
side-effect import carries no `from`, so the import-set row cannot see it. A `/node:/` token was
added to the scan for exactly this, and this mutant is the proof it bites.

### `M16` — never set the `ended` flag. **1 red** — *AND IT SURVIVED THE FIRST SUITE*
```diff
   const onEnd = (): void => {
-    ended = true;
```
Survived with 0 red because every row used a `PassThrough`, whose `readableEnded` was answering for
the module's own flag — the flag was untested and, on a `LineSource` that does not have that optional
property, dead-or-alive was unknown. A row driving a hand-built minimal `LineSource` with no
`readableEnded` was added; it reds 1.

## Survived — 3, and they are ONE finding

### `M6` — drop the free
```diff
       overlong = true;
-      pending = "";
```
### `M6b` — drop `absorb`'s early return
```diff
-    if (overlong) return;
```
### `M6c` — drop BOTH
(the two diffs above, together)

`M6` and `M6b` are **equivalent mutants**: the two halves are mutually redundant, and either alone
caps retention at one chunk. `M6c` is a **real leak** — `pending` grows without bound.

**`M6c` survived, and the reason is that the instrument is incapable, not that the suite is lazy.**
The first version of the deep lane asserted `process.memoryUsage().heapUsed` growth under 8 MiB
across a 16 MiB unterminated flood. Measured out of tree, `node --expose-gc`, both builds side by
side:

```
BOUND retained MiB: -0.00  pending len: 0
LEAK  retained MiB:  0.01  pending len: 16777216
```

**`heapUsed` does not account a V8 cons-string's referents**, so it reports 0.01 MiB for a leak of
16,777,216 characters — with a forced collection, in or out of a worker thread. That row could never
have fired. **It was deleted rather than kept green**, and the deep lane now asserts what it can
honestly assert: the flood is survived, rejected, kept away from every resolver, and recovered from
on the very next line. The retention bound is recorded as a **construction argument** in `absorb`,
not as a test, and `AGENTS.md` carries the trap so nobody adds the dead assertion back.

**For QE:** this is the open corner. A working instrument for it would be a heap SNAPSHOT
(`v8.writeHeapSnapshot` / retained-size accounting) rather than `heapUsed`, and that is more machinery
than this ticket's lane can carry. `M6c` is the mutant to hand a QE hop.
