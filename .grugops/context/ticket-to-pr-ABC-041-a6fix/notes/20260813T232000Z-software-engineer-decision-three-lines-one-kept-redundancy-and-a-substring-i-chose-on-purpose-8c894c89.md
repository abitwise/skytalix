---
id: 20260813T232000Z-software-engineer-decision-three-lines-one-kept-redundancy-and-a-substring-i-chose-on-purpose-8c894c89
kind: decision
by: software-engineer
at: 2026-08-13T23:20:00Z
verified_by: 
confidence: high
refs:
  - ABC-041
  - src/render-seam.test.ts
  - plans/tickets/ABC-041-render-seam-closure.md
  - 20260813T230500Z-qe-e2e-claim-the-a4-block-is-discharged-and-a-narrower-one-takes-its-place-22426ad6
  - 20260813T230500Z-qe-e2e-decision-the-gate-deletes-its-own-row-and-here-is-the-mutant-that-earned-it-7de3c9b3
supersedes: 
---

# Four instrument choices on a three-line diff: what I added, the redundancy I did NOT dispose of, and the one place I am deliberately stronger than the criterion.

The diff is `src/render-seam.test.ts` **+8/−1** and nothing else under `src/`. Three of the added
lines are assertions; five are the comment that replaced one comment line. Each choice below is here
because a reader of the row would otherwise have to guess at it.

## 1. The three lines went into the EXISTING `A6 / A7` row — no new test, no new file

```ts
expect(source).not.toContain("process.");     // was already there
expect(source).not.toContain("process");      // added
expect(source).not.toContain("globalThis");   // added
expect(source).not.toContain("import.meta");  // added
```

`src/` stays at **49 files**, the file stays at **11 tests**, the lane stays at **827/827 on 29**, and
`ADR-0008`'s allotment of one test file stays spent exactly once. A new `it(...)` would have bought
nothing: `source` is already in hand two lines above, and the criterion is one criterion.

## 2. I KEPT `not.toContain("process.")` although the bare-word line subsumes it

`not.toContain("process")` is true of strictly fewer strings than `not.toContain("process.")` fails on
— any source containing `process.` contains `process`. The old line is therefore dead weight in the
strict sense, and the gate disposed of a strictly-weaker **row** one hop ago for exactly that
property. I did not follow it here, for three reasons:

- **It is not this hop's to dispose of.** The gate disposed of its own row, on a mutant, with the
  disposal assigned to it by its subtask. Nothing assigns this line's disposal to me, and deleting an
  assertion on the hop whose job is to add assertions is the move that should always be looked at
  twice.
- **The harm the gate cited does not apply.** The deleted `A4 (width)` row was a *separate row* that
  read like independent coverage while being blind to a mutant the row above caught — it misled about
  what was guarded. Four adjacent lines in one row mislead nobody: the redundancy is visible in a
  single glance.
- **The row now reads one-for-one against the criterion's four spellings**, which is precisely the
  property this block was raised over.

**Flagged, not resolved** — if QE wants the line gone at the re-gate, deleting it loses no kill (`X8`
reds the bare-word line, and no mutant on this ticket reds `process.` without also containing
`process`).

## 3. `not.toContain("process")` is a SUBSTRING check, not a word boundary — deliberately stronger

The criterion says *"the bare word `process`"*. A word-boundary form (`not.toMatch(/\bprocess\b/)`)
would be the exact translation. I used the substring form the gate homed, and the consequence is
worth stating plainly: **the assertion also reds on `preprocess`, `processing` or `processed` anywhere
in the module, comments included.** That is stronger than `A6` requires.

I chose it knowingly because the error direction fails safe: the failure mode is a **false RED** on a
harmless comment, which stops a hop and gets read, not a false GREEN on an ambient read, which ships.
On a criterion whose entire purpose is that a grep loses to the next spelling, the wider grep is the
right side to err on. The reason is in the file comment so the next reader does not rediscover it.

## 4. What I did NOT touch, each named because each was available and each was wrong

- **`plans/tickets/ABC-041-render-seam-closure.md` was not opened.** The wording is right; shrinking a
  criterion to fit its instrument is the move the whole loop exists to stop.
- **QE's deleted `A4 (width)` row was not restored.** It was disposed of on a mutant (`X2b`) with the
  reason recorded in the file. That disposal is the gate's.
- **`src/render-seam.ts` was not opened for writing at all** — not in the worktree, and not even
  transiently: every mutant ran on an out-of-tree copy. Blob `51e50a381a5faccc01e11c5ab30727ed4c30e62a`,
  md5 `bc18d0830b84adaff123affce66561c5`, unmoved.
- **`plans/board.md` was not opened.** `ABC-041` stays `In Review`; a maintained block leaves it there
  and lifting it is the gate's, not mine.
- **`X5b` and `A8`'s import-statement blind spot were left alone** — homed to `ABC-053`/`ABC-054`,
  non-blocking, and explicitly not mine on this hop.

## The stop condition was tested and NOT tripped

The subtask said to stop if closing `A6` honestly needed more than assertions over the module's
source. It did not. The fix is three `expect(source).not.toContain(...)` lines over the string
`sourceOf("render-seam.ts")` already read at the top of the row — no change to the module, no new
file, no change to the criterion. The one thing that grew beyond the subtask's literal text is a
**second mutant** (`X8b`), built because `X8` contains no `import.meta` and cannot arm the third line.
A mutant is not scope: it is out-of-tree, it ships nothing, and shipping an assertion nothing reds
would have been the quiet failure the stop condition is guarding against.
