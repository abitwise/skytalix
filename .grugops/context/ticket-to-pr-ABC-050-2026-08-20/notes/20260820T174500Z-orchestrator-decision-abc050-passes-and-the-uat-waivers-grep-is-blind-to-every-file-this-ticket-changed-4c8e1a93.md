---
type: decision
task: ticket-to-pr-ABC-050-2026-08-20
role: orchestrator
ticket: ABC-050
created: 2026-08-20T17:45:00Z
tip: grugops/abc050-lane-runner-guard @ ca50b26
---

# `ABC-050` passes 5/5. The merge is HELD for a live hop, and the UAT waiver's own grep is BLIND TO EVERY FILE THIS TICKET CHANGED.

## 1. The merge is held, and the reason is mechanical, not a doubt about the work

QE returned **PASS 5/5** and recommends merge. I am not taking it yet. **A QE hop on `ABC-043` is
live in this shared working tree**, and merging requires `git checkout main` — moving HEAD under a
running hop would corrupt measurements it has already taken and silently invalidate its verdict.
The merge waits for that hop to finish. **This is sequencing, not hesitation.**

Same reason `plans/board.md` and `plans/traceability.md` are untouched: QE/E2E flagged that a blind
append to `traceability.md` while the `ABC-043` hop writes the same file is how two hops clobber
each other, and declined to write its own row. **That was the right call and I am honouring it** —
I hold both pens until the tree is mine alone.

## 2. The UAT waiver: the LETTER grants it, and I am recording WHY the letter is thin here

`AGENTS.md` § "Test and UAT authority" waives UAT standing for a ticket whose delivered diff carries
zero production lines, **measured from git, never asserted**. Measured at this tip:

```
git diff --name-only d127ae3 ca50b26 | grep -v '\.test\.ts$' | grep '^src/'
  -> EMPTY (exit 1)
```

**By the letter, waived.** But look at what the diff actually contains, and what that grep can see:

| changed file | seen by the waiver's grep? |
|---|---|
| `src/glyph-mode.nfr.test.ts` | seen, then excluded as a test file — correct |
| `biome.json` | **NO** |
| `tsconfig.json` | **NO** |
| `vitest.config.ts` | **NO** |

**Three of the four changed files are invisible to the criterion that decides whether a human ever
looks at this work**, because the rule anchors on `^src/` and this ticket's whole subject is a file
that lives outside `src/` and is read by nothing. The waiver measurement has **the same blind spot
as the defect the ticket exists to close.** That is not a coincidence worth glossing.

## 3. I am APPLYING the waiver anyway, and the argument is substantive, not procedural

I could stop at "the grep is empty". I will not, because that reasoning would waive a ticket that
rewrote `src/` if it happened to do it from a config file. The real question is what a UAT could
possibly accept, and the answer is measured: **the product is byte-identical.** No production line
under `src/` moved, the `defineConfig` body is byte-identical base to tip (QE verified), and the
suite is 40 files / 1207 tests / 0 skips on **both** sides. A business scenario driven through
`npm run chess` cannot distinguish these two commits. **There is nothing for a named human to
accept**, so a UAT here would be theatre, and the waiver's intent and its letter agree.

**What `Done` means for this ticket, stated so it cannot be misread later:** merged and gated. It
carries **NO** human acceptance and **NO** signature. `context.human_admission` is `off`; nothing
here is a stamp.

## 4. ESCALATION — the waiver rule defect is no longer theoretical, and this hop is the evidence

The rule defect flagged at `ABC-113` is **OPEN and UNRULED**, and it now has a second, sharper face.
Two independent problems, both for the owner, neither mine to rule:

1. **The anchor.** `^src/` cannot see root-level config. `ABC-050` changed three such files, one of
   which governs how all 1207 tests execute.
2. **The range.** `AGENTS.md` writes the measurement as `<delivered>~1 <delivered>`; `ABC-113`'s QE
   ruled it must be `main...HEAD`. **The two disagree and both are in force in writing.** I used the
   base-to-tip form (`d127ae3 ca50b26`), which is the `main...HEAD` reading, and say so plainly
   rather than letting the choice pass unnamed.

I am **not** amending the rule to fix either. It is the owner's, and a ticket applying a rule is the
worst possible place to quietly rewrite it.

## 5. What QE found that outranks its own verdict — TWO items, both handed on

- **An armed control that silently disarmed itself.** QE's first mode-only run came back **GREEN,
  exit 0**, with the guard blameless: vitest's sequencer prefers **cached durations** over file size,
  and scratch trees share the repo's `node_modules/.vite/vitest` cache, so the padded probe ran
  **second**. Padding is NOT sufficient — pass `--no-cache` and read the file order off the run
  output. **A green armed control is the exact defect this ticket exists to close, reproduced inside
  the hop that closed it.** This belongs in `AGENTS.md` beside the input-seam lane's
  "never ship a memory guard you have not watched go RED".
- **`A2`'s residual is real and worse than the engineer claimed.** The engineer said a type-valid
  defect is caught by neither static tool; QE both corrected and sharpened them. `isolate: false`
  IS caught (by `npm test` — the engineer under-claimed), but a single type-valid `exclude` entry
  **deletes this ticket's own guard from the lane with all four gates at exit 0** (39 files / 1204
  passed, green), and a typo'd glob is undetectable **even by the counts** (40 / 1207, identical).
  Closing it needs a lane-inventory assertion. **`ABC-050`'s `## Out of scope` fences it out by
  name**, so it is a new ticket and BA/PM's to cut — not scope creep into this one.

Neither is a failure of `ABC-050`. Both are named rather than absorbed.
