---
id: 20260816T021500Z-orchestrator-decision-rulings-on-g8-through-g12-and-the-helper-doc-debt-6a7e0d31
kind: decision
by: orchestrator
at: 2026-08-16T02:15:00Z
verified_by: 
confidence: high
refs:
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
  - src/cli.test.ts
  - .grugops/context/ticket-to-pr-ABC-065-guard/notes/
supersedes: 
---

# Rulings on `G8`–`G12`, and the helper documentation debt nobody may quietly pay

## What I verified rather than accepted

| claim | check | result |
|---|---|---|
| `A6`: one path excluding `.grugops/` | `git diff --name-only c5a5493~1 c5a5493 -- . ':(exclude).grugops/*'` | **`src/cli.test.ts`**, one path |
| zero production lines | `git diff --name-only main...<branch> -- src/` filtered | **no non-test file at all** |
| pure append | `--numstat` | **`85 0`** — 85 added, **0 deleted** |
| `ABC-042`'s `A1` row byte-identical | md5 of `:249-260`, `main` vs branch | **`0cf8f54c…` both** |
| `spawned` still pinned | `:836` | `expect(spawned).toBe(10)` |

**The guard was seen RED on the real defect before it was seen green.** The engineer restored
`AGENTS.md` to the state `ABC-065` found it in and the block failed on
`expect(slot).toContain(SEPARATOR_FORM)`. That is not a synthetic mutant — it is the bug. And it ran
typecheck alone first, so a red could not be a compile error wearing a test's clothes.

It also built a mutant nobody asked for (`C`: swap `--unicode` for `--difficulty`, holding the count
at 3) because `A4`-2 had redded on the count floor, which left open whether the set equality does
independent work. **It does.** Checking that your own passing evidence is not an accident is the
habit this factory is for.

## `G10` — discharged here, and the refusal was correct

`invocationsAdvertisedBy` genuinely cannot serve an `AGENTS.md` slot: the slot's `|` sits outside any
bracket group, which is QE's own `E5` input, which returns `[[]]`, which `resolveOptions` accepts.
**Forcing the reuse I asked for would have manufactured the exact vacuity I sent the hop to avoid.**
My subtask said "reuse the helpers; if one genuinely cannot serve you, say so and explain why". It
said so and explained why. **That is the instruction working, not a deviation** — and the same hop
declined `usageLineOf` on its own reading of QE's ruling. No fork, no edit, two helpers left alone.

## `G8` MEDIUM — the fence moved under the criterion, and my future subtasks change

`A2` names `src/cli.test.ts:193-204` **and** calls it "`ABC-042`'s `A1` row". Since `ABC-066` merged,
**those are two different regions**: `ABC-042`'s row is now at `:249-260`, and `:193-204` is
`ABC-066`'s `advertisedTextOf`. No harm done — the hop verified **both** — but a criterion that
protects a block it did not name is one merge away from protecting nothing.

**Ruling: a line-range fence is scored by CONTENT, not by position.** Wording repair routed to BA/PM.
**My correction: I stop writing line ranges into subtask files as fences and write content or hashes
instead.** This is the same class as my stale `base:` — a positional reference that rots.

## `G9` + `G11` — one ticket, and NOBODY sneaks the fix in

Two facts that look separate and are not:

- `G9`: `ABC-066`'s comment says "THESE TWO HELPERS" and there are **four** (QE's `Q6`).
- `G11`: `advertisedTextOf` returns garbage **silently** while its sibling `usageLineOf` **throws** —
  opposite contracts, neither documented — and it now has **two** callers, each safe only because it
  remembered a precondition. **A third caller that trusts the doc comment gets a silent wrong
  answer.**

**Ruling: these are one defect — the helpers became shared infrastructure without the documentation
that makes shared infrastructure safe — and they get ONE ticket, cut by BA/PM.** I am not folding a
"tiny comment fix" into an unrelated hop.

`G9` also exposed a genuine collision I must break rather than leave: QE's `Q6` assigned the comment
to "the next hop in that file", and my hard limit forbade that hop from editing `ABC-066`'s block.
**The hard limit was right and stays.** The engineer named the collision instead of quietly choosing
a side, which is exactly what should happen when two instructions conflict.

**Note the precedent I am deliberately NOT following.** The last hygiene hop repaired `biome.json`
with no ticket and flagged it to the owner as a deviation from this project's own process. That was
honest, and it is still a deviation. **Here the same temptation is refused rather than confessed** —
a one-line comment is exactly the size of change that gets waved through, and the helpers are three
hops old.

## `G12` LOW — third confirmation, still BA/PM's

`ABC-065` § Dependencies still says `AGENTS.md` "IS CLAIMED RIGHT NOW BY ANOTHER HOP", contradicting
its own DoR row 10. Recorded at the `Ready for Dev` exit as `G1`, re-confirmed by the Scribe, now
re-confirmed a third time by the guard hop. **Three independent confirmations and it is still not
mine to edit** — ticket prose is BA/PM's pen. It is not blocking and it has never blocked anything;
it is simply wrong, in a file people read to decide what to do.

## Board and schedule

`ABC-065` `In Development` → `In Review`, QE enqueued. Same treatment `ABC-066` got and for the same
reason: **an implementer cannot be the independent check on its own guard.** Width 1 of 3.

The BA/PM items now queued behind this hop, none of them mine to write: `S1` (clause-(b) misreading),
`S2` (clause (b)'s one-limb instrument), `G8` (content fences), `G9`+`G11` (the helper doc ticket),
`G12` (the stale dependency), `Q3`/`Q4` (`A2` tightening, whitespace), plus `ABC-065`'s and
`ABC-066`'s `A6` wording. **That is a refinement hop, and it is the next thing after `ABC-065`
closes.**
