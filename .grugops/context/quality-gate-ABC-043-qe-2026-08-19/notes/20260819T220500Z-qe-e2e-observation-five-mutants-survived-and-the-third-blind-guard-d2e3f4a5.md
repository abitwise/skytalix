---
id: 20260819T220500Z-qe-e2e-observation-five-mutants-survived-and-the-third-blind-guard-d2e3f4a5
kind: observation
by: qe-e2e
at: 2026-08-19T22:05:00Z
verified_by:
confidence: high
refs:
  - ABC-043
  - ABC-042
  - ABC-037
  - src/cli.ts
  - src/cli.test.ts
supersedes:
---

# Nine mutants applied at this hop. **Four died. FIVE SURVIVED — and one of them is the THIRD blind guard the brief sent me to find.**

Every mutant below was applied to the delivered tree at `46457b8`, run, and reverted. The tree was
re-run clean afterwards: **1189 passed / 39 files, 13.86 s CPU.** The engineer's ten mutants are not
repeated here; these are nine it did not run.

## The survivors, worst first

### `Q1` — **THE THIRD BLIND GUARD.** `A8`'s row-count transcription is STILL blind, to an interpolation

The `ABC-043` repair narrowed the template blanker from *"everything between two literals"* to
*"one literal"*, and that repair is real — I confirmed the control: a bare `const unused = 23;`
planted in `src/cli.ts` **REDS** `A8 — neither delivered module names a row count`.

**But `${…}` inside a template literal is EXECUTABLE CODE, and the blanker erases it with the
literal.** A row count placed inside an interpolation is invisible to the guard, exactly as before —
the hole moved, it did not close.

| mutant, as a diff | `A8` row |
|---|---|
| `+ const unused = 23;` (control — the engineer's own check) | **RED** ✅ |
| `+ const unused = ` + backtick + `${23}` + backtick + `;` | **GREEN** ❌ |
| ``process.stderr.write(`${INTERNAL_ERROR}\n`)`` → ``process.stderr.write(`${INTERNAL_ERROR.padEnd(23)}\n`)`` | **GREEN** ❌ |

The third form is the realistic one: a hard-coded pad-to-a-row-count, in delivered code, on the crash
path, shipping green. `src/cli.test.ts` **50 passed** and `src/history-pane.nfr.test.ts` **11 passed**
against it — and those are the only two suites in the tree that read `cli.ts` (measured by grep), so
**nothing in this repository sees it.**

**Severity: MEDIUM.** It is an instrument hole, not a product defect — the delivered `cli.ts` has no
such literal (its two template literals interpolate `resolution.problem` / `USAGE` and
`INTERNAL_ERROR`, no numbers). But `A6` says *"the delivered diff contains no numeric row-count
literal"* and this is the guard that decides it, on a ticket whose own header says a row-count literal
is `ADR-0009` clause 9a's business.

**Answering the brief's other half: NO other assertion shares the blanking helper.** The blanking is
three `.replace` calls **local to the `A8` `it` block** (`src/cli.test.ts:1145-1148`). Every other
structural row uses `executableCodeOf` **without** string blanking (`:606`, `:822`, `:1012`, `:1050`,
`:1073`, `:1806`, `:2013`), so they scan string contents as if they were code. That direction is
conservative — it produces false REDS, never a false green — so it is recorded and not raised.

### `E4` — **the two non-zero exit codes can be SWAPPED and the whole suite stays green**

```
-    process.exitCode = USAGE_EXIT_CODE;          // the usage path
+    process.exitCode = INTERNAL_ERROR_EXIT_CODE;
-    process.exitCode = INTERNAL_ERROR_EXIT_CODE; // the catch
+    process.exitCode = USAGE_EXIT_CODE;
```

**`src/cli.test.ts` 50 passed.** Confirmed at the shell: `node src/cli.ts --colour purple` exits **70**
on that build — a refused command line reporting `EX_SOFTWARE`, and a crashed session reporting the
usage code.

**Why nothing sees it.** `A3` asserts only `status !== 0` and `status !== CHILDREN.badColour.status`,
and a swap keeps the two DIFFERENT. **No row anywhere pins the usage exit code to `1`** — I grepped
the file for it; there is none. `A8`'s numbers transcription pins that `1` and `70` both *exist* in the
module, not which path uses which. So the ticket's own exit-code rule — *"`1` for a refused command
line, `70` for an exception that never became a `LoopOutcome`"* — is written down in three places and
asserted in none.

**Severity: MEDIUM.** The rule is this ticket's headline output (`## The ruling on a parser bug`
states it *"once for the whole product"*), and Decision 2 in the engineer's own note argues `70` over
`2` precisely so a shell can tell the two apart. The guard for that argument does not exist.

### `A1-vac` — **`A1`'s "no cast and no adapter" is VACUOUSLY SATISFIABLE**

```ts
const options = ({
    history: newGame(START_FEN),
    humanColour: colour as "white" | "black",   // <-- an explicit cast at the wiring
    render: makeRenderSeam(mode, orientation),
    input: createLineInputSeam({ source: process.stdin, output: sink }),
    engine: createEngine({ budgetMs: DEFAULT_BUDGET_MS }),
    sink,
  });

try {
  const outcome = await runTurnLoop(options);
```

**`tsc --noEmit` clean, `src/cli.test.ts` 50 passed.** `A1` is the criterion whose text is *"exactly
once with all six options and **no cast and no adapter** on any of them."*

**The mechanism.** The window is

```ts
const call = entry.slice(entry.indexOf("runTurnLoop("), entry.indexOf("sink,") + "sink,".length);
```

Hoisting the object puts `sink,` **before** `runTurnLoop(`, so `slice(hi, lo)` returns **the empty
string** and both `.not.toMatch(/\bas\b/)` and `.not.toMatch(/=>/)` pass over nothing. A guard that
cannot look always passes — the same failure shape the `childOf` helper's own comment warns about at
`:217`.

**The shape is held today only by ACCIDENT, and by a different ticket's row.** `ABC-042`'s
`A8 / ABC-043 A6` row asserts `expect(code).toMatch(/sink,\s*\}\)/)` (`:613`), which an unparenthesised
hoist breaks. Wrapping the object in `(` `)` satisfies that row too, and then nothing is left. The
adapter half survives for the same accidental reason: `G6`'s `input:\s*createLineInputSeam\(\{\s*source:\s*process\.stdin,`
regex is what actually refuses a wrapper — I confirmed the `=>` variant reds on **`G6`**, not on `A1`.

**Severity: MEDIUM.** `A1` is the criterion the ticket calls the typecheck's companion — *"these rows
are what the typecheck cannot see"* — and the half it uniquely owns is the half that is blind.

### `G6-c` — **a THIRD orphaning shape, and `G6`'s own row is GREEN on it** (the brief asked for this)

`M4b` binds the seam to a name; the guard's third clause catches exactly that. This one never names it:

```ts
const options = { … input: createLineInputSeam({ source: process.stdin, output: sink }), … };
try {
  void options.input(newGame(START_FEN));      // the orphaning call, through the object
  const outcome = await runTurnLoop(options);
```

All three `G6` clauses pass: `createLineInputSeam(` occurs **once**; the
`input:\s*createLineInputSeam\(\{\s*source:\s*process\.stdin,` shape matches; and there is no
`const|let|var <name> = createLineInputSeam`. **`G6 — the input seam is built ONCE and called NOWHERE`
reported ✓ (0 ms) on this build**, `tsc` clean.

**And the failure mode is the real one.** Measured by me at the shell, on a REAL invocation with a
live stdin (a FIFO carrying `e2e4` then held open — a human at a keyboard):

```
STILL RUNNING after 10s -> HUNG      1483 bytes written, no exit, killed -9
```

With `< /dev/null` it exits 0 at 501 bytes (EOF settles the orphan), which is why the engineer's
`spawnSync` caveat is right and worth keeping: **the suite's children close stdin immediately, so the
hang does not reproduce inside the suite at all.**

**The mutant IS caught — but not by `G6`.** Five rows red (`ABC-042 A8/A6`, `ABC-042 A4`, `A2`, `A6`,
`A7`), all because the orphaning call writes an extra `> ` prompt and shifts every frame. That is a
real net and I am not calling it worthless. It is also an accident: it catches this shape because
`createLineInputSeam` happens to write the prompt when invoked, not because anything asserts the seam
is uninvoked.

**Severity: MEDIUM.** The property `G6` states — *built once, called nowhere* — is directly
expressible over the source and is currently asserted by three proxies for it, one of which (the
name-binding clause) is a style check standing in for a behaviour.

### `E5` — `process.exitCode = outcome.exitCode` → `= 0`

**50 passed.** Observationally identical today, because `LoopOutcome.exitCode` is typed `0` and only
`0`. **Severity: LOW, and recorded rather than raised** — the ticket asks for the value *verbatim* as
a contract statement, and the day `ABC-019`'s type widens this build stops honouring it silently. The
engineer's `M3` (`= 1`) reds, so the *behavioural* half is covered.

## The four that died — the criteria that genuinely bite

| mutant | result |
|---|---|
| `const unused = 23;` in `src/cli.ts` | **RED** on `A8` — the row-count repair is real for the bare form |
| the catch arm exits **0** (`A3`'s discriminating requirement) | **RED** on `A3` **and** `A4` — both, which is `## Test notes` 2 working |
| an adapter arrow at `input:` | **RED** on `A1`, `G6`, `A2`, `A6` |
| the orphaning pre-read (`G6-c`) | **RED** on 5 rows — see above; not on `G6` |

## The hung-child bound — confirmed, with one thing measured that the note did not claim

- **It IS on every spawn site.** There is exactly one, and that is asserted rather than assumed:
  `expect(self.match(/\bspawnSync\s*\(/g)).toHaveLength(1)` plus the import-list equality
  (`:1288-1291`). `timeout: 30_000` sits inside that one call. **Confirmed.**
- **It reaches the `npm` child's grandchild too**, which nothing had checked: a `spawnSync("npm", …)`
  at a 2 s bound returned `Error: spawnSync npm ETIMEDOUT` and the hung `node` grandchild was **gone**
  1.5 s later (`pgrep` empty). npm propagates the signal; there is no orphan pool.
- **Nothing guards the bound's continued presence.** Deleting `timeout: 30_000` is green. Recorded at
  **LOW** and deliberately not raised as a defect: it is insurance, not a criterion, and the
  engineer's comment says so in as many words. A guard for it would assert on a test file's own
  literal, which is worse.
