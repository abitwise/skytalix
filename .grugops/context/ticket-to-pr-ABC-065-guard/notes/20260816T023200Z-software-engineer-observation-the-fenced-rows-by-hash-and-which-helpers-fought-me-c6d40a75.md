---
id: 20260816T023200Z-software-engineer-observation-the-fenced-rows-by-hash-and-which-helpers-fought-me-c6d40a75
kind: observation
by: software-engineer
at: 2026-08-16T02:32:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - ABC-042
  - ABC-066
  - src/cli.test.ts
supersedes: 
---

# The fenced rows, proved by hash — and the honest report on reusing `ABC-066`'s four helpers

## The fence moved, and that is the first thing a later reader needs

`ABC-065` `A2` and the subtask both fence **`src/cli.test.ts:193-204`** as byte-identical, and both
gloss it as *"`ABC-042`'s `A1` row"*. **Those two identifications stopped agreeing when `ABC-066`
merged.** `ABC-066` inserted its four module-scope helpers above `describe("ABC-042 …")`, so:

- **`ABC-042`'s `A1` row is now at `:249-260`**, not `:193-204`;
- **`:193-204` now holds `ABC-066`'s `advertisedTextOf` and the expander's doc comment.**

Both are things this hop must not touch, so **both were verified**, and so was everything else.

## The hashes, either side

`git hash-object` of the extracted line range; the file blob is `git rev-parse`.

| what | BEFORE (merge commit `9490740`) | AFTER (delivered) |
|---|---|---|
| **file blob `src/cli.test.ts`** | `11431bac60b03074c90bd18b43079aa9403515ef` | `bedf3574379f7ca8e8f0f2bd497129cee1704c71` |
| `ABC-042`'s `A1` row, at its NEW `:249-260` | `6effd96e368d77460751c3cbcc35ec52558de747` | **`6effd96e368d77460751c3cbcc35ec52558de747`** |
| `ABC-066`'s block, at the fenced `:193-204` | `03f89ce3000563d4098d2d4fe365605e51bde255` | **`03f89ce3000563d4098d2d4fe365605e51bde255`** |
| **lines 1–886, the whole file above my block** | `11431bac60b03074c90bd18b43079aa9403515ef` | **`11431bac60b03074c90bd18b43079aa9403515ef`** |

**The file blob differs — it must, this hop adds a guard to it — and every fenced region does not.**

Two further proofs that need no trust:

1. **`ABC-042`'s `A1` row also hashes `6effd96e…` at its OLD `:193-204` on the pre-`ABC-066` tip
   `717e51d`.** So the row is byte-identical across `ABC-066`'s merge AND across my edit; only its
   line number moved, and it moved before I arrived.
2. **The hash of lines 1–886 after my edit EQUALS the whole file's blob before it.** That is an
   append proved arithmetically rather than by inspection.

And the diff itself: **`git diff --numstat` = `85 0`, one hunk, `@@ -886,0 +887,85 @@`, and `0`
deleted content lines.** No merged row of any ticket was edited, re-worded or removed. **The
`ABC-065` stop condition on re-opening a merged instrument never fired.**

## Which helpers I reused, and whether any fought me

All four exist and **none was forked, copied or edited.**

| helper | reused? | did it fight? |
|---|---|---|
| **`SEPARATOR_FORM`** | **YES** — the `A1` precondition, and the input to `advertisedTextOf` | **No.** QE's ruling that this is the one permitted literal was inherited, not re-opened; it is still spelled **once** in the file. |
| **`advertisedTextOf`** | **YES** — extracts the invocation after the separator | **YES, twice — both exactly as `Q2` predicted.** See below. |
| **`usageLineOf`** | **NO — deliberately not called** | n/a. QE's Ruling 2 said `ABC-065` *"almost certainly should not call it at all"* and was right: it returns the **last non-empty line** of its input, which on a markdown file's contents is meaningless. Calling it would have been a genuine defect. **Declined on purpose, not overlooked.** |
| **`invocationsAdvertisedBy`** | **NO** | n/a, and this one is a genuine mismatch rather than a choice — see below. |

### Where `advertisedTextOf` fought, and how it was handled

1. **It fails silently, not loudly.** `slice(indexOf(…) + SEPARATOR_FORM.length)` with `indexOf`
   returning `-1` is a corrupted stem and no throw. **Handled by asserting `includes(SEPARATOR_FORM)`
   before calling it** — `Q2` consequence 1, implemented. Mutant `V` proves the handling works.
2. **The trailing markdown fence.** `AGENTS.md`'s invocation lives inside backticks and `ABC-066`'s
   stderr line does not, so `advertisedTextOf` returns `` --colour black` — RUN 2026-08-15 at … ``
   — everything to the end of the slot, fence included. **Handled by `.split("\`")[0]`** — `Q2`
   consequence 2, implemented. Copying `ABC-066`'s outside-group row verbatim would have given the
   **false RED** QE warned of, and it was not copied.

**Neither of these needed the helper changed**, which is why no fork was made and no second helper
written. They are caller-side preconditions, and the subtask asked for exactly that.

### Where `invocationsAdvertisedBy` genuinely does not fit — said plainly rather than forced

The expander exists to expand a **grammar** — `[--colour white|black|random]` into six invocations.
**`AGENTS.md`'s slot does not contain a grammar; it contains one concrete invocation plus a prose
option list.** Feeding the slot to the expander would hand it the option list's own backticked
`` `--colour white|black|random` `` — a `|` **outside** any bracketed group, which QE measured as
input **E5** and which returns the degenerate **`[[]]`**. That return is `ok: true` under
`resolveOptions`, i.e. **precisely the vacuous green this hop was told to avoid**.

**So it is not that the expander is bad — it is that `ABC-065`'s input is a different shape.** `A3`
asks for a **set equality over documented tokens**, which is a collector's job, not an expander's.
**Reported rather than forced**, per the subtask's instruction to say so if a helper cannot serve.
**No fork was made and the expander was not touched**: it is still used by `ABC-066`'s row alone.
