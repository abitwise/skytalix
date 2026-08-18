---
id: 20260819T001500Z-qe-e2e-observation-seventeen-qe-mutants-and-the-four-that-survived-the-corridor-past-M13-d84b2e19
kind: observation
by: qe-e2e
at: 2026-08-19T00:15:00Z
verified_by:
confidence: high
refs:
  - ABC-035
  - ABC-033
  - ABC-036
  - ABC-045
  - ABC-046
  - EPIC-006
  - src/command-input.ts
  - src/command-input.test.ts
  - 20260818T233500Z-software-engineer-observation-thirteen-mutant-diffs-not-descriptions-and-the-one-that-survived-b52d0f81
supersedes:
---

# Seventeen QE mutants against `src/command-input.test.ts` — **thirteen killed, FOUR SURVIVED**, and all four are the same door the engineer's `M13` came through

The engineer found `M13` (a direct `process.stdout.write`), repaired it, and wrote: *"the class is
proven live in this module."* It is. **I walked the rest of the corridor and found three more open
doors on the same wall, plus one out-of-band channel that is not a stream at all.**

Every mutant below is given as its **unified diff against the delivered `src/command-input.ts`**, per
the standing lesson from `quality-gate-ABC-033-qe-2026-08-18`: *a mutation result is only
reproducible if the mutant diff is recorded, not just described.*

## Method

Each mutant is a literal text substitution on the delivered file, written by a scratch harness
(`mutants.py`, out-of-repo, **not committed**), run as
`npx vitest run src/command-input.test.ts --reporter=json --outputFile=…`, then restored from a
pristine copy taken before the first mutation with `git status --porcelain -- src/command-input.ts`
asserted **empty after every mutant** — the harness aborts rather than continuing on a dirty tree.
**Baseline before any mutation: 0 failed of 79.** Final state: `ALL RESTORED - VERIFIED CLEAN`.

**One method note that matters, learned the hard way:** the JSON reporter must write to a **file**,
not stdout. A mutant that writes to `process.stdout` corrupts a stdout-borne JSON report and the run
reads as a build error rather than as a survivor. My first pass mis-scored `R13` for exactly that
reason. Any hop repeating this must use `--outputFile`.

## The battery

| id | mutant | red | verdict |
|---|---|---|---|
| **`Q1`** | **`board` writes via `console.log`** | **0** | **SURVIVED** |
| **`Q2`** | **`board` writes via a `process.stdout.write` reference BOUND AT MODULE LOAD** | **0** | **SURVIVED** |
| **`Q3`** | **`board` writes via `fs.writeSync(1, …)` — fd 1 directly** | **0** | **SURVIVED** |
| **`Q7`** | **`board` sets a flag on `globalThis` — an out-of-band signal, not a stream** | **0** | **SURVIVED** |
| `Q16` | `board` writes via `console.error` | **0** | SURVIVED (same door as `Q1`) |
| `Q8a` | a stdout write on the module's FIRST call only | **0** | SURVIVED (timing, see below) |
| `Q6` | `board` writes to `process.stderr` only | **1** | killed |
| `Q8b` | a stdout write after the 50th call | **1** | killed (contingently — see below) |
| `Q4` | the passed `deps` object is MUTATED (`parseSan` nulled) | **15** | killed |
| `Q5` | the passed `history.initialFen` is overwritten | **1** | killed (thinly) |
| `Q7b` | a thrown value used as a `quit` signal | **12** | killed |
| `Q14` | prefix match in the OTHER direction (`token.startsWith(spec.token)`) | **6** | killed |
| `Q15` | first-letter alias (`spec.token[0] === token[0]`) | **12** | killed |
| `R13` | the engineer's `M13`, re-run against the repaired suite | **1** | killed — **repair CONFIRMED** |
| `R9` | the engineer's `M9`, one extra `gameStatusOf` | **14** | killed — reproduced exactly |
| `R1` | the engineer's `M1`, prefix match | **3** | killed — reproduced exactly |
| `R8` | the engineer's `M8`, normalised line downstream | **1** | killed — reproduced exactly |

**Four survivors that matter (`Q1`/`Q16` are one finding), one contingent kill, one thin kill.**

## The diffs

```diff
### Q1 `board` writes via console.log — 0 RED of 79 — SURVIVED
     return resolveMoveInput(history, line, deps);
   }
+  if (spec.token === "board") console.log("BOARD");

### Q16 the same door, stderr side — 0 RED of 79 — SURVIVED
     return resolveMoveInput(history, line, deps);
   }
+  if (spec.token === "board") console.error("BOARD");

### Q2 a reference bound at MODULE LOAD — 0 RED of 79 — SURVIVED
 import type { GameHistory } from "./history.ts";
+const OUT = process.stdout.write.bind(process.stdout);
     return resolveMoveInput(history, line, deps);
   }
+  if (spec.token === "board") OUT("BOARD");

### Q3 fd 1 directly, below the stream object — 0 RED of 79 — SURVIVED
+import { writeSync } from "node:fs";
 import type { GameHistory } from "./history.ts";
     return resolveMoveInput(history, line, deps);
   }
+  if (spec.token === "board") writeSync(1, "BOARD");

### Q7 an out-of-band signal that is not a stream at all — 0 RED of 79 — SURVIVED
     return resolveMoveInput(history, line, deps);
   }
+  if (spec.token === "board") (globalThis as unknown as Record<string, unknown>).__boardRequested = true;

### Q8a a write on the FIRST call only — 0 RED of 79 — SURVIVED
 import type { GameHistory } from "./history.ts";
+let __calls = 0;
+  __calls += 1;
+  if (__calls === 1) process.stdout.write("EARLY");
   const spec = classifyCommand(line);

### Q8b a write after the 50th call — 1 RED of 79 — killed, but only by accident of ordering
 import type { GameHistory } from "./history.ts";
+let __calls2 = 0;
+  __calls2 += 1;
+  if (__calls2 > 50) process.stdout.write("LATE");
   const spec = classifyCommand(line);

### Q6 stderr only — 1 RED of 79 — killed
     return resolveMoveInput(history, line, deps);
   }
+  if (spec.token === "board") process.stderr.write("BOARD");

### Q4 the deps object mutated — 15 RED of 79 — killed
+  if (deps !== undefined) (deps as unknown as Record<string, unknown>).parseSan = undefined;
   const spec = classifyCommand(line);

### Q5 the passed history mutated in its one non-FEN field — 1 RED of 79 — killed thinly
+  (history as unknown as { initialFen: string }).initialFen = "MUTATED";
   const spec = classifyCommand(line);

### Q7b a thrown value used as a signal — 12 RED of 79 — killed
     return resolveMoveInput(history, line, deps);
   }
+  if (spec.token === "quit") throw new Error("QUIT_SIGNAL");

### Q14 prefix in the OTHER direction — 6 RED of 79 — killed
-  return COMMAND_TABLE.find((spec) => spec.token === token);
+  return COMMAND_TABLE.find((spec) => token !== "" && token.startsWith(spec.token));

### Q15 first-letter alias — 12 RED of 79 — killed
-  return COMMAND_TABLE.find((spec) => spec.token === token);
+  return COMMAND_TABLE.find((spec) => token !== "" && spec.token[0] === token[0]);
```

## Why `Q1`/`Q16` and `Q2` escape — the MECHANISM, constructed independently and measured

I did not infer this. I built a probe test (`src/zz-qe-probe.test.ts`, run and deleted) that installs
the *same* spy the delivered guard installs and then exercises each channel inside the same window:

| channel written inside the window | `process.stdout.write` spy reports |
|---|---|
| `console.log("probe-console")` | **0** |
| `process.stdout.write("probe-stream")` | **1** |
| a reference `.bind()`-captured before the spy was installed | **0** |

Two distinct mechanisms, both fatal to the guard as written:

1. **Vitest intercepts `console.*` by default** and routes it to its own reporter — it never reaches
   `process.stdout.write`, so a spy on that property cannot see it. The probe's output still appeared
   on the terminal, labelled `stdout | …` by the reporter, which is the tell: **the bytes reach the
   user, and the guard reports zero.**
2. **`vi.spyOn` replaces a PROPERTY, not a function.** A reference captured at module-load time —
   before any test body runs — still points at the original `write`, so the spy is bypassed entirely.
   The probe's `probe-bound` text appeared raw on the terminal, unlabelled by the reporter, proving
   the real stream received it.

`Q3` needs no mechanism note: `fs.writeSync(1, …)` addresses the file descriptor and never touches
the `process.stdout` object at all.

## Why this is the same finding as `M13` and not a new one

The ticket's own **security firing threshold** is *"any direct stream write"*
(`plans/tickets/ABC-035-in-game-commands.md` § Security / NFR triggers). The engineer's repair makes
**one spelling** of that threshold detectable. Four more spellings are not — and `console.log` is by
some distance the **most likely way a real engineer would actually write that line**. The delivered
code does none of them, so the threshold has **not fired** and the ticket is compliant; what is
missing is the *detector*, exactly as it was missing before `M13` was found.

`Q7` widens the class one step further and is worth naming separately: it is not a stream at all. The
module's own header says *"There is no state change here."* Nothing in the suite tests that. A
`board` or `quit` arm that parks a flag on `globalThis` (or in module scope) for `EPIC-006` to read
later ships green — and parking a flag for the effect owner is precisely the shape `ABC-045` and
`ABC-046` will be tempted into, since both add rows to **this module** and `ABC-046`'s whole open
problem is that `quit` has no representable outcome.

## `Q8a`/`Q8b` — the guard is a single-window guard, and that is structural

The stream guard observes only what happens inside its own `try` block: 13 token spellings plus one
move, in one test, late in the file. **`Q8a` — a write on the module's very first call — survives
0/79**, because that call happens in `A1`'s tests long before the spy is installed. `Q8b` (a write
after the 50th call) reds 1 only because the file happens to reach 50 calls before that test runs;
**re-order the file and `Q8b` survives too.** That kill is an accident of ordering, not a property.

This is the "a write during a later call than the one being spied" case the subtask named, in its
mirror-image form. Recorded rather than repaired — I do not fix.

## The kills worth reporting honestly

- **`Q4` (mutating `deps`) reds 15** — well guarded, and not by design: nulling `parseSan` breaks
  downstream resolution loudly. The *observable* channel is guarded; nothing asserts `deps` is
  returned unmutated, so a mutation the resolvers tolerate would still pass. Low risk, named.
- **`Q5` (mutating `history.initialFen`) reds 1**, and only through `A5`'s loop-driven refusal row.
  `history` is otherwise well covered: `Position` carries no cache field, so `A1`'s `toFen`
  byte-identity is a **complete** guard on the position, and `history.moves` is asserted directly.
  `initialFen` is the one field with a single witness. Thin, but real, and the mutant is exotic.
- **`Q7b` (throw as a signal) reds 12** — thrown values are a closed channel. Good.

## What `b4` actually guards — the engineer's conjecture, now MEASURED

The engineer wrote that `boards` and `b4` do not red under `M1` and therefore guard *"a different
wrong build … (a `startsWith` in the other direction, or an alias table)"`, and said only one was
measured. **Both are measured now, and the conjecture is correct:**

- `R1` (prefix, `spec.token.startsWith(token)`) reds **3** — and the three are exactly `"hel"`,
  `"h"`, `"cl"`. `boards` and `b4` are **not** among them. Engineer's claim **CONFIRMED**.
- `Q14` (the other direction, `token.startsWith(spec.token)`) reds **6**, and **`boards` IS among
  them** — but `b4` still is not.
- **`Q15` (first-letter alias, `spec.token[0] === token[0]`) reds 12, and `b4` IS among them.**

So `b4` **earns its keep**, and the wrong build it guards is now named rather than conjectured: it is
the **initial-letter alias** — the entirely plausible CLI convenience of accepting `b` for `board`,
`h` for `help`. `b4` is the row that stops `board` being reachable from a legal pawn move under that
build, which is precisely what the ticket's `A2` rationale and Test note 1 say it is for. **Do not
delete that row.**
