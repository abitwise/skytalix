---
id: 20260818T163500Z-software-engineer-artifact-ref-final-diff-count-is-31-14-not-32-14-c5b2f9d1
kind: artifact-ref
by: software-engineer
at: 2026-08-18T16:35:00Z
verified_by:
confidence: high
refs:
  - ABC-106
  - A1
  - A2
  - src/san.parse.test.ts
supersedes: 20260818T161500Z-software-engineer-artifact-ref-branch-diff-and-gate-numbers-9e30c7a4
---

# The delivered diff is +31/−14, not the +32/−14 the earlier note recorded — a second commit removed one comment line

The earlier artifact-ref note was accurate when written. A **second commit** (`326a182`) then removed
one comment line, so the delivered figure moved. This note supersedes only that number; every other
figure in the superseded note still stands and was re-run after the second commit.

**Why the second commit exists.** `A1` forbids any comment saying the behaviour is *undisclosed*,
*unruled* or *pending a ruling*. The re-labelled block opened with *"These rows were once pinned as
characterization while the tolerances they measured were still unruled"* — **past tense, and true**,
but it puts the words `characterization` and `unruled` back into the file that the ticket exists to
clear of them. A grep-shaped reading of `A1` flags it, and QE is entitled to that reading. The
sentence was rewritten to carry the same provenance (the ruling's task id) without those words.

**Measured after the change:**

```
grep -niE 'undisclosed|unruled|pending a ruling|not a demanded tolerance|characteriz' src/san.parse.test.ts
```

returns **nothing**. `A1` is now clean under both a reading of the prose and a literal grep.

**Final delivered figures, `main..HEAD`:**

- `src/san.parse.test.ts` — **+31 / −14**, `git diff --numstat` (the only `src/` file).
- Changed assertion lines: **0** — `git diff main..HEAD -- src/ | grep -cE '^[+-].*expect\('` returns **0**.
- Production lines: **zero** — `git diff --name-only main..HEAD | grep -v '\.test\.ts$' | grep '^src/'` returns **empty**.
- Two commits at the time of writing: `7cc0d28` (the re-label) and `326a182` (this correction).
- Gates re-run on the final tip: lint **62 files, 0**, typecheck **0**, `npm test` **999/999 on 35
  files**, `src/san.parse.test.ts` **30/30**, skip **0**.

`plans/board.md` and `plans/traceability.md` were corrected from `+32/−14` to `+31/−14` in the same
sweep (one occurrence and two occurrences respectively), so no artefact in the trace carries the
stale number.
