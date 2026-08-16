---
id: 20260816T093000Z-uat-planner-observation-s3s-caveat-corrected-under-a-real-terminal-9d2c4f71
kind: observation
by: uat-planner
at: 2026-08-16T09:30:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - src/glyph-mode.ts
  - AGENTS.md
supersedes: 
---

# Correction to `S3`'s caveat — `--ascii` IS visibly distinguishable; my capture was not a terminal

**This note corrects one paragraph of `20260816T091000Z-…-the-pack-conducted-against-main-measured-…`
and nothing else.** It carries no `supersedes`, deliberately: the earlier note's other nine scenarios
stand as written and must not be folded out of the trail to fix one caveat.

**What I wrote there:** *"`--ascii` prints letters and is the current default rendering, so it is the
one option whose effect is not distinguishable from the default on this terminal — recorded honestly
rather than scored as a difference I did not see."*

**That was an artifact of my instrument, not a property of the product, and the second half of the
sentence was the wrong honest thing to say.** Every run in the conducted-result note captured stdout
through a pipe. `src/glyph-mode.ts` `selectGlyphMode` row 3 is explicit: `if (!signals.isTTY) return
"ascii"` — *"a sink that cannot be seen gets the portable form"*. **A pipe is not a TTY, so ascii was
the default in my capture by that rule, not because ascii is the product's default.**

Re-measured under a real pseudo-terminal (`script -q /dev/null`), locale `LC_ALL=en_US.UTF-8`:

```
default   rank 8:   8 .♜:♞.♝:♛.♚:♝.♞:♜      <- unicode figurines
--ascii   rank 8:   8 .r:n.b:q.k:b.n:r      <- letters
```

**So `S3` is a clean 5 of 5 with a visible effect on every option, in the environment the person
signing this will actually be sitting in.** The New Reader who types `npm run chess -- --ascii` at an
interactive prompt sees the board change. The corrected `S3` verdict is **PASS with no caveat**.

**Two things this changes elsewhere, stated so nobody has to re-derive them:**

1. **It removes the only caveat on the conducted pack.** Ten scenarios, ten PASS, and now no scenario
   carries a "could not see the difference" footnote.
2. **It does not touch any acceptance criterion.** `A1`–`A6` say nothing about glyph rendering; this
   is `S3`'s business-level question (*"does the option do what its name says"*) and the answer moved
   from "cannot tell for one of five" to "yes for five of five".

**The general lesson, cheap and worth carrying:** a UAT that captures stdout through a pipe is not
running the program the user runs. This project has a documented rule that branches on `isTTY`, so any
future UAT touching rendering must allocate a pty or say out loud that it did not.
