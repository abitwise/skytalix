---
id: 20260820T105000Z-software-engineer-observation-six-mutants-diffs-and-the-live-stdin-correction-d3e4f5a6
kind: observation
by: software-engineer
at: 2026-08-20T10:50:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# Six mutants, with their diffs. **All five of QE's survivors were reproduced GREEN first and are RED now.** And one correction to how the live-stdin measurement should be read.

Every mutant was applied to `src/cli.ts` in a contained lane, run, and reverted. `src/cli.ts` is
byte-identical to `main`'s at the end of this hop.

## The results, before and after, in one table

| mutant | before the repair | after the repair |
|---|---|---|
| `G02a` interpolated `${23}` | **GREEN** 50/50 | **RED** — `A8` |
| `G02b` `` `${INTERNAL_ERROR.padEnd(23)}\n` `` | **GREEN** 50/50 | **RED** — `A8` |
| `G04` hoisted options object with a real `as` cast | **GREEN** 50/50 | **RED** — `A1`, `G6` |
| `G05` the usage arm and the catch arm swapped | **GREEN** 50/50 | **RED** — `A3` |
| `G03` hoisted bag + `void options.input(…)` | 4 rows red, **`G6` GREEN** | **RED on 7 rows, `G6` among them** |
| `A3zero` the catch arm exits `0` (the control) | RED — `A3`, `A4` | **RED — `A3`, `A4`** (unchanged) |

`tsc --noEmit` was clean on every one of the six, which is what makes them mutants rather than typos.

## The diffs, recorded because a mutant nobody can re-apply is a story

### `G02a` — the bare interpolation

```diff
 const START_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
+const unused = `${23}`;
```

### `G02b` — the realistic one: a pad-to-a-row-count on the crash path

```diff
-    process.stderr.write(`${INTERNAL_ERROR}\n`);
+    process.stderr.write(`${INTERNAL_ERROR.padEnd(23)}\n`);
```

### `G04` — the hoisted options object with a real cast

```diff
   try {
-    const outcome = await runTurnLoop({
+    const options = ({
       history: newGame(START_FEN),
-      humanColour: colour,
+      humanColour: colour as "white" | "black",
       render: makeRenderSeam(mode, orientation),
-      // BUILT HERE, CALLED NOWHERE — `G6`'s single-caller precondition. See the module header.
       input: createLineInputSeam({ source: process.stdin, output: sink }),
       engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS }),
       sink,
     });
+    const outcome = await runTurnLoop(options);
```

### `G05` — the two non-zero exits swapped

```diff
-    process.exitCode = USAGE_EXIT_CODE;      // the usage arm
+    process.exitCode = INTERNAL_ERROR_EXIT_CODE;
     return;
@@
-    process.exitCode = INTERNAL_ERROR_EXIT_CODE;   // the catch arm
+    process.exitCode = USAGE_EXIT_CODE;
```

Confirmed at the shell, both ways: on the mutant `node src/cli.ts --colour purple </dev/null` exits
**70**; on the delivered build it exits **1**, and a clean session exits **0**.

### `G03` — the orphaning call through the hoisted bag

```diff
   try {
-    const outcome = await runTurnLoop({
+    const options = ({
       history: newGame(START_FEN),
-      humanColour: colour,
+      humanColour: colour as "white" | "black",
       render: makeRenderSeam(mode, orientation),
-      // BUILT HERE, CALLED NOWHERE — `G6`'s single-caller precondition. See the module header.
       input: createLineInputSeam({ source: process.stdin, output: sink }),
       engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS }),
       sink,
     });
+    void options.input(newGame(START_FEN));
+    const outcome = await runTurnLoop(options);
```

### `A3zero` — the control, which proves the rebuilt `A3` still bites

```diff
     process.stderr.write(`${INTERNAL_ERROR}\n`);
-    process.exitCode = INTERNAL_ERROR_EXIT_CODE;
+    process.exitCode = 0;
```

## The live-stdin measurement — reproduced, and then CORRECTED

I reproduced QE's number to the byte. A FIFO carrying `e2e4` and **held open** — a human at a
keyboard — against the `G03` build:

```
STILL RUNNING after 10s -> HUNG      1483 bytes written, no exit, killed -9
```

**Then I ran the same harness against the DELIVERED build, which QE did not, and it also sat there:
`1481` bytes, no exit, killed at 10 s.**

**That is the product working.** A stdin that never closes is a human who has not typed their next
move, and waiting at the prompt is the only correct thing to do. So *"hangs on a live stdin"* does
not discriminate the two builds, and a guard built on it would have been a guard that reds on the
delivered product. The 2-byte difference is the orphaning call's extra `> `.

**The discriminator is what the product DOES with the line, and it is unambiguous.** Same FIFO, one
move, held open four seconds, `--colour white --ascii`:

| build | boards | prompts | bytes |
|---|---|---|---|
| delivered | **2** | 2 | 1481 |
| `G03` orphaned | **1** | 3 | 1483 |

The delivered build **plays the move and renders the position after it**. The orphaned build
swallows it into the orphaned read and **never advances**. QE's severity call is right and the
defect is real; the *symptom* is "the human's move is silently eaten", and "hangs" is what that looks
like from outside if you do not have the delivered build beside it.

**I did not build a live-stdin child into the suite.** It would cost a spawn against `N8-SPAWN`'s
pin of 17, it needs a FIFO and a holder process inside a `spawnSync` suite that closes stdin by
design, and — since `windowOf` now reds `G6` on the mutant from the source — it would buy a second
witness for something already caught. Recorded as a deliberate refusal, not an oversight.
