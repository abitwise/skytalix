---
task: repair-ABC-043-2026-08-20
subtask: abc043-repair
role: software-engineer
workflow: agent-factory/workflows/04-ticket-to-pr.md
ticket: plans/tickets/ABC-043-the-live-session.md
ref: .grugops/context/repair-ABC-043-2026-08-20/
parent_ref: .grugops/context/refine-abc043-a3-name-2026-08-19/
enqueued_by: orchestrator
enqueued_at: 2026-08-20T09:00:00Z
branch: grugops/abc043-repair
base: main @ 238f1aa
---

# Subtask: `ABC-043` repair round 1 of 2 — rebuild `A3`, and fix ONE recurring guard shape (not four bugs)

Both rulings you were waiting on have landed. Read `parent_ref:` (BA/PM's five notes, the `(N)`
limit), `memory-bank/50-decisions/ADR-0015-*.md`, and QE's five notes in
`.grugops/context/quality-gate-ABC-043-qe-2026-08-19/notes/`.

**Note the base: your code is already on `main`** — I stacked the ruling branch on the QE branch on
your delivery, so merging the ruling merged the delivery. **My error, recorded in my own words.**
Branch off `main`, not off your old branch.

## 1. `A3` — the rig you flagged is REFUSED. Rebuild it, and the rebuild is smaller than the rig

You flagged your own `parserBug` child as an **extension** rather than an application. **Both rulings
agree with you and both refuse it**, for two independent reasons:

- **`ADR-0015` (S):** a substituted module must be a **seam supplier** — imported by `src/cli.ts`
  *and* passed at an injection point. `./command-input.ts` is named nowhere in `cli.ts`; it is
  reached only by a static import at `src/line-input.ts:56`. **Same structural position as
  `./turn-loop.ts`, which BA/PM had already refused by name.**
- **BA/PM's `(N1)`:** the double must stand where the criterion's **Given stipulates a constructed
  component**. `A3`'s Given is *"an `InputSeam` that throws"* — the seam, not the parser.

**The rebuild:** substitute **`./line-input.ts`**, whose `createLineInputSeam` returns an `InputSeam`
that throws. It passes `(S)` and `(C)` — `input: createLineInputSeam({...})` sits at
**`src/cli.ts:155`**, directly beside `engine:` at `:156`, which is the seam you already double for
`A5`. **One spawn; the `N8-SPAWN` pin of 17 does not move.** It matches `A3`'s own Given more
literally than the rig that shipped.

**Delete the `parserBug` child that substitutes `"command-input.ts"`** (`src/cli.test.ts:369-372`)
and the now-false comment at `src/cli.test.ts:260`.

**Do not double anything else in that child** — `(N3)`: one criterion, one seam.

## 2. `G-02`–`G-05`: QE's diagnosis is that these are ONE shape, and I want you to fix the shape

> *"Five of seven are instruments, and four of those five are guards that pass by being unable to
> look — one shape recurring, which is the thing to fix rather than four things."*

**Read them as one defect before you write four patches:**

- **`G-02` — the row-count blanker is interpolation-blind.** Your repair was real but **moved the
  hole rather than closing it**: `const unused = 23;` reds ✅, but `` `${23}` `` and a genuine
  `` write(`${INTERNAL_ERROR.padEnd(23)}\n`) `` both pass **GREEN**. `${…}` is executable code the
  blanker erases along with the literal. (`src/cli.test.ts:1145-1148`.)
- **`G-04` — `A1`'s "no cast and no adapter" window is VACUOUS.** `entry.slice(indexOf("runTurnLoop("), indexOf("sink,")+5)`
  returns the **empty string** when the options object is hoisted, so both `.not.toMatch` calls pass
  over nothing. QE built a hoisted-object build with a real `as` cast: `tsc` clean, 50 passed.
  (`:1852-1860`.)
- **`G-05` — the exit-code rule is stated in three places and asserted in none.** Swapping the usage
  arm and the catch arm passes: `node src/cli.ts --colour purple` exits **70**. No row pins the usage
  code to `1`. (`:1908-1938`.)
- **`G-03` — a third orphaning shape.** Invoke the seam through the options object without binding
  it: **all three `G6` clauses report ✓ green**, and on a **live stdin** (a FIFO held open — a human
  at a keyboard) the product **HANGS: 1,483 bytes, no exit, killed at 10 s**. On `/dev/null` it exits
  0 at 501 bytes. Five other rows red it only **by accident** — an orphaning call writes an extra
  prompt and shifts frames. (`:1863-1876`.)

**The common shape: a guard that extracts a window, or blanks a region, and then asserts over what
survives — so anything the extractor cannot see is green by construction.** `G-03` is the same shape
in a different medium: it asserts over `/dev/null` output, where the failure cannot appear.

**Fix the shape.** If four patches is genuinely the honest answer, say so and defend it — but
QE's read is that it is one, and I want that tested before it is patched around.

## Fences

- **`A8` still binds**: `src/cli.ts` and `src/cli.test.ts` only. The seven merged modules stay
  byte-identical.
- **`src/cli.ts` exports 0 and must continue to** — `ADR-0011` clause 4.
- **Do not widen `ADR-0015`'s fence** and do not add a second double to any criterion.
- **Do not re-open `ABC-033`/`035`/`037`/`078`.**
- Do not merge, do not deploy, do not move a board column, do not edit the DoR table.

## Not yours, do not chase

- **`G-06`** — no criterion runs the real engine end to end. **Declared and recorded**, BA/PM's to cut
  as an opt-in lane. Do not build it here.
- **`ABC-019` `[D31]`'s parser-bug narrative now has no criterion at all** — BA/PM named it; it is a
  **new ticket**, not this repair.
- **`N8-LANE`/`NFR-008`** — `ADR-0014` rules the clause BREACHED. Report your cost; **do not grade**.

## Gate

Full blocking gate in a **contained lane** — the repo root is contaminated (`ABC-050`) and that has
cost me three bad measurements. Baseline on `main`: **1189 tests / 39 files, skip 0**. Report
`PERFT_DEEP=1` 32/32.

**Re-run QE's mutants and show what now reds**: the interpolated `${23}`, the hoisted-object cast,
the swapped exit arms, and the unbound-seam orphan **on a live stdin, not `/dev/null`**. Record the
mutant **diffs**.

## Publish

Typed notes per Workflow 16 into `ref:`. No `finding` is admissible on this install. Claim by hand:
`mkdir -p .grugops/queue/claimed`, then a **bare** `mkdir` of `.grugops/queue/claimed/abc043-repair`.
**Commit incrementally.**

Commit on `grugops/abc043-repair`, never on `main`.
