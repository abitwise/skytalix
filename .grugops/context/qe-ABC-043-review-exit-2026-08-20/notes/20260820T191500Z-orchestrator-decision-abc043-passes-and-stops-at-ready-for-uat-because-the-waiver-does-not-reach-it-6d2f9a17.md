---
type: decision
task: qe-ABC-043-review-exit-2026-08-20
role: orchestrator
ticket: ABC-043
created: 2026-08-20T19:15:00Z
tree: main @ 201dc1b
---

# `ABC-043` passes 8/8 + `G6` and STOPS at `Ready for UAT`. The waiver does not reach it, and a new user-facing regression is open on `main`.

## 1. The waiver does NOT apply, and I measured it rather than assuming from the ticket size

```
git diff --name-only 54cbb23 6091212 | grep -v '\.test\.ts$' | grep '^src/'
  -> src/cli.ts          (exit 0, NOT empty)
git diff --numstat 54cbb23 6091212 -- src/cli.ts
  -> 91  17
```

**91 added, 17 removed production lines.** The 2026-08-17 zero-production-lines rule says *ANY*
production line and the rule does not apply — not "mostly test", not "one trivial line". So
`ABC-043` needs the **owner's word** to leave `In UAT`, exactly as before the waiver existed.

Contrast `ABC-050`, waived at the same hop on an EMPTY result. **The two tickets went to opposite
answers on the same rule, both measured from git.** That is the rule working.

## 2. QE settled `G-05` on a measurement, and the engineer was right

The prior QE hop said five survivors were "one recurring shape"; the engineer refused to reclassify
`G-05` to make the count come out at one. QE's `D1b` — the exit-code swap with **only** `A3`'s two
by-value rows deleted — came back **55/55 GREEN**, and `git show 46457b8:src/cli.test.ts` carries no
`toBe(70)`/`toBe(1)` on any child status. **There was no derivation to blind: the guard did not
exist.** The converse half also reproduced (`D2` and `D3` die on the same `windowOf` throw — one
repair, two mutants). Same rule, different mechanism, no difference split.

**Second time today an agent contested something handed down and was right on the measurement.**

## 3. The live-stdin defect DOES NOT REPRODUCE — and the instrument two hops read it off cannot terminate

Delivered build, FIFO, move at t=0/1/2 s: **3 boards, 2 prompts, 1481 B, move played, engine replied,
3/3.** The `G-03` mutant at the same timings: 3 boards, 3 prompts, 1483 B — the entire delta is one
stray `> ` before the first board. The repair note's own figures are self-contradicting (1483 B
cannot be one board when 1481 B is three). **The eaten move is a race belonging to the WRONG BUILD
only.** And the instrument itself is faulty: a FIFO stdin never delivers end-of-input in Node here,
proved with a four-line script that is not this product — so "hung" was the harness, not the game.

**Not a criterion failure and not an open product defect.** Struck.

## 4. NEW REGRESSION, open on `main`, NOT fixed here — and I reproduced it first-hand

```
node src/cli.ts --ascii </dev/null | head -2   ->  exit 1, unhandled 'error' event: write EPIPE
node src/cli.ts --ascii </dev/null             ->  exit 0
```

Clean at `54cbb23`, broken at `46457b8` and at `main` today. **It fails no `ABC-043` criterion** —
`A3`'s Given is an `InputSeam` that throws, and an async stream `error` event never reaches the one
`try`/`catch`. Two things make it worth a ticket rather than a footnote:

- **A user piping the game into `head`, `less` and quitting early, or any closed pipe, gets a Node
  stack trace instead of a board.**
- **Exit `1` MISLABELS it.** `AGENTS.md` reserves 1 for a refused command line and 70 for an
  internal error. This is an internal error wearing the refusal code, so the exit contract lies.

BA/PM's to cut, `P2`/`S`. **I did not fix it** — it is outside the ticket under verdict, and
repairing a defect inside the hop that adjudicates it is the conflict that produced `ABC-113`.

## 5. TWO INSTRUMENT FAILURES OF MY OWN THIS SESSION. Both recorded, because the pattern is the point

1. **`cmd | tail; echo $?` reported `tail`'s exit code as biome's** (`ABC-050`, corrected in that
   task's notes when the engineer contested it).
2. **`diff` in this shell resolves to `git diff`, not `/usr/bin/diff`.** So
   `diff <(cat old) new | grep -c '^[<>]'` returned **0 changed lines** for a file I had just
   edited — a silent false negative. `cmp` said DIFFERENT. The real answer, taken two independent
   ways (`git diff --stat` and a line-by-line compare in python): **exactly 2 lines changed**,
   546 lines both sides, every `ABC-*` row still 12 pipe-fields.
   **Use `/usr/bin/diff` by absolute path, or `git diff --no-index`.**

**Three green-but-blind instruments in one session** — mine twice, plus vitest's cached-duration
sequencer silently disarming QE's armed probe on `ABC-050`. This project's recurring defect is not
bad code; it is instruments that answer a question nobody asked.

## 6. AND I NEARLY DESTROYED QE'S WORK — recorded because a clean recovery is not a non-event

`git checkout plans/traceability.md` to undo a bad edit of mine **also discarded QE/E2E's
uncommitted `ABC-043` `Status` write**, which was in the tree only because a stash pop had restored
it. Recovered from the dropped stash commit `c851450` (`git stash pop` drops the ref, not the
object) and re-verified field-by-field rather than assumed. **The lesson: never `git checkout <file>`
in a tree carrying another hop's uncommitted work — revert your own edit by rewriting it.**

## 7. Still open, unowned, NOT absorbed

- **`G-06`** — no criterion runs the real engine end to end. Now handed forward by a **second** QE
  hop. `ENGINE_DEEP` is the home. BA/PM's.
- **`D4`** — `ABC-113`'s `for…of` shadow, re-planted and still GREEN. Not an `A1` failure.
- **THREE false sentences** now shipping in `EPIC-006` test-file comments: two merged with
  `ABC-113`, and a third found this hop in `ABC-043`'s own repair comment
  (`src/cli.test.ts:2122-2124`). **Each was NAMED by the QE hop that found it and deliberately NOT
  self-corrected** — the same conflict rule, held three times running.
