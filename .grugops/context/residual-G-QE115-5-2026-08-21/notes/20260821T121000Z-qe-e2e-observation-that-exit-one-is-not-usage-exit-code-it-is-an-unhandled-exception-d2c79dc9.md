---
id: 20260821T121000Z-qe-e2e-observation-that-exit-one-is-not-usage-exit-code-it-is-an-unhandled-exception-d2c79dc9
kind: observation
by: qe-e2e
at: 2026-08-21T12:10:00Z
verified_by:
confidence: high
refs:
  - G-QE115-5
  - ABC-115
  - ADR-0016
  - A10
supersedes:
---

# THAT `1` IS NOT `USAGE_EXIT_CODE` BEING ASSIGNED — IT IS AN UNHANDLED EXCEPTION, AND THE RE-THROW CAN NEVER REACH THE ENTRY POINT'S `try`

**A correction of MECHANISM, not of the ruling.** I am not re-opening the accepted stdout-write
residual, not proposing a wider arm, and not grading `ABC-115` down. The acceptance stands. What
follows is a measured fact about *how* that `1` is produced, because my subtask brief and the
standing record both state it a way I could not reproduce.

**What both say.** The brief: *"the product inside exits `1` — `USAGE_EXIT_CODE`"*. The standing
acceptance note (`rule-ABC-115-residuals-2026-08-21`, `…8a4b2e69`): *"exit `1` … `1` is
`USAGE_EXIT_CODE`"*. Read as *the same `1`*, that says `src/cli.ts:140`'s assignment ran.

**It did not.** Delivered build, read-only fd as stdout, run by hand:

```
Error: EBADF: bad file descriptor, write
    at writeSync (node:fs:922:3)
    …
    at file:///…/src/cli.ts:159      <- the re-throw in the sink's error arm
Node.js v24.12.0
NODE_EXIT=1
```

That is **Node's uncaught-exception banner**. No `process.exitCode` assignment ran at all; `1` is
Node's **default status for an unhandled exception**, which merely *collides* with `USAGE_EXIT_CODE`.
The observable difference is the whole reason it matters: an assignment at `:140` would have printed
the usage line. This prints a stack and no usage line.

**WHY IT ESCAPES, AND THIS IS THE LOAD-BEARING PART.** `main`'s `try`/`catch` (`src/cli.ts:166-196`)
wraps `await runTurnLoop(…)`, and the failing write happens inside it — so it *looks* catchable, and
the stack even names `at main (src/cli.ts:169)`. It is not. Node's stream machinery emits `'error'`
on a **later tick** (`errorOrDestroy` → `process.nextTick(emitErrorNT)`); the stack on the Error is
its *creation* stack, captured back at `writeSync`. The listener at `:159` therefore throws from a
tick on which no `try` is on the stack.

**Reproduced in eleven lines, outside this product, to prove it is Node's shape and not the
product's:**

```js
const s = process.stdout;
s.on("error", (e) => { throw e; });
(async function main(){
  try { await (async () => { s.write("x\n"); })(); }
  catch (e) { process.stderr.write("CAUGHT: " + e.code + "\n"); process.exitCode = 70; }
})();
```
Run with `1</dev/null`: **`CAUGHT:` never prints**, the banner does, and the status is `1`.

**The consequence, recorded for whoever eventually closes the residual and for nobody to act on
today.** The standing acceptance note says *"A future ticket routing non-`EPIPE` to `70` leaves
`A10` green and needs no re-cut of this page."* `A10` does stay green — it asserts non-zero and
non-empty, exactly as designed. But **such a ticket cannot do the routing with a `try`/`catch`**: the
throw is out of reach of one. The arm at `:159` would have to carry the outcome itself. **That is a
sizing fact for a ticket that does not exist, not a reason to cut one**, and `ADR-0016` clause 3's
*"behaves exactly as it does today"* is untouched by it.
