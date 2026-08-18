---
id: 20260818T164000Z-qe-e2e-decision-what-i-repaired-and-what-i-left-alone-9c1b6d75
kind: decision
by: qe-e2e
at: 2026-08-18T16:40:00Z
verified_by: ""
confidence: high
refs:
  - ABC-106
  - ABC-032
  - ABC-034
  - src/san.parse.test.ts
supersedes: ""
---

# Three comment repairs, comment-only; and the four things I deliberately left

## Repaired — all three inside `src/san.parse.test.ts`, zero assertion lines touched

**1. `:364`'s title was FALSE, and the engineer's flag was correct.** It read *"surrounding
whitespace is trimmed — the tolerance the ticket's closed list does not name"*. I opened
`ABC-032` § Scope: **trim IS entry 3 of the closed list, `ACCEPTED`**, with its own bound spelled
out (*"`trim`, not 'ignore spaces': interior whitespace is still refused — `N g5` is
`unreadable`"*). The list names it. **I fixed it** — the title now reads "`ABC-032` § Scope entry
3, ACCEPTED" and a short comment records the ruling. **Leaving a known-false title in the one file
whose entire ticket was "make the comments true" is the worse outcome**, and this is the hop that
could fix it. It is strictly outside `A1`'s literal scope (`A1` covers the `:382` block and its
three rows) and I say so rather than quietly claiming it as `A1` coverage.

**2 and 3. The word "re-classification" in the two `e8=K` comments** now reads **"PLACEMENT"**, and
the row comment gains the one sentence that stops the misread: *"it requires only that `e8=K`
produce EXACTLY ONE OF THE SEVEN existing codes and that the set stay at seven, so `no-such-move`
standing satisfies it. `A8` decides which code; it does not mandate a change."* Reasoning in the
citation note.

**Forward-only prose, deliberately.** My new comments carry **no** past-tense "used to say"
clause. The engineer had to remove exactly such a clause in his second commit because it left the
file grep-flaggable; I did not reintroduce the shape. The stale-ruling sweep over `src/san*.test.ts`
returns **nothing** after my edits.

## Left alone, each with its reason

- **`ABC-106`'s own page (~line 28) still says "re-classification".** Same imprecision, but it is
  BA/PM's statement of the defect at cut time and it is the ticket, not the artifact under test.
  **Reported, not edited.**
- **The BA/PM ruling note's heading, which is the actual root of the wording.** Context notes are
  **append-only** by contract; rewriting an earlier note's text is not available to me and is not
  the right instrument. **Reported for BA/PM.**
- **No test row added.** `ABC-106` § Test notes says *"Do not add a test"* and `A2` exists to catch
  one added by accident. I found nothing worth pinning that an existing row does not already pin —
  and pinning prose is not something a vitest assertion can do. Adding a row here would have broken
  `A2` to buy nothing.
- **`biome.json` and anything under it.** Not touched; the stale-worktree artifact did not fire.

## Boundary I did not cross

**No production line, no assertion changed, weakened or deleted.** Mechanically checked, not
asserted: `git diff --name-only main...HEAD | grep -v '\.test\.ts$' | grep '^src/'` is **empty**,
and every changed line in `src/` across the whole branch — the engineer's and mine — is inside a
comment or an `it`/`describe` title (**0** exceptions). The three `A3` assertions (`Ne4g5`
rejected, `o-o` rejected, `e8=P` unreadable) are intact verbatim.
