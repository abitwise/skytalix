---
id: 20260816T023300Z-software-engineer-observation-gaps-found-at-the-guard-hop-e1b5f3c9
kind: observation
by: software-engineer
at: 2026-08-16T02:33:00Z
verified_by: 
confidence: high
refs:
  - ABC-065
  - ABC-066
  - ABC-042
  - src/cli.test.ts
  - plans/tickets/ABC-065-agents-md-dev-run-omits-the-separator-and-its-option-list-is-unchecked.md
supersedes: 
---

# Gaps found at the `ABC-065` guard hop — each with severity and owner

Numbered from **`G8`** to stay clear of the Orchestrator's `G1`–`G3`, the Scribe's `G4`–`G7` and
QE's `Q1`–`Q6`, which are referenced and not restated. **None blocked the gate; the gate is GREEN.**
**None was repaired here** — each is another role's pen, or forbidden to this hop by a hard limit.

**Count for the `Ready for Dev` exit control (`AGENTS.md` § Process rules 1): 5 gaps at this
implementing hop, of which 0 are `HIGH`, 3 `MEDIUM`, 2 `LOW`. None is an acceptance-criterion
failure.**

---

## `G8` — `A2`'s fence `src/cli.test.ts:193-204` now points at the WRONG BLOCK. **MEDIUM.** Owner: **BA/PM** (the criterion's wording), **Orchestrator** (any future fence)

`ABC-065` `A2` fences *"`src/cli.test.ts:193-204` … byte-identical"* and identifies it as *"`ABC-042`'s
`A1` row"*. **Since `ABC-066` merged, those are two different regions.** `ABC-042`'s `A1` row is at
**`:249-260`**; **`:193-204` is now `ABC-066`'s `advertisedTextOf` and the expander doc comment.**

**No harm done here — I verified BOTH regions by hash and both are byte-identical** — but the
criterion as written now protects a block it did not mean to name, and does not name the block it
meant to protect. **A line-numbered fence in a criterion decays the moment anything is inserted above
it**, and this is the second time this session that a position in this file went stale (`ABC-042`'s
row also moved). **Recommendation: fence by content or by hash, never by line range.** Ticket prose
is BA/PM's pen; I did not edit it.

## `G9` — QE's `Q6` (`THESE TWO HELPERS` and there are FOUR) is STILL OPEN, and two instructions collide over it. **LOW.** Owner: **Orchestrator** to break the tie, then whoever holds `ABC-066`'s block

`src/cli.test.ts:165` still reads *"THESE TWO HELPERS ARE THE SHARED ONES"* above **four** names.
QE's `Q6` assigned the fix to *"`ABC-065`'s guard hop (fix in passing)"* — that is me.

**But my subtask's hard limits say "do not edit `ABC-066`'s block", and that comment is inside it.**
A hard limit from the Orchestrator outranks a `LOW` tidy-up suggestion from a prior hop, so **I left
it.** **The comment is now actively wrong for a second reader** — I am the hop it was written for,
and I can confirm it does not mislead about anything load-bearing, only about the count. **Flagged,
not fixed, with the collision named rather than silently resolved.**

## `G10` — `invocationsAdvertisedBy` cannot serve `ABC-065`, and the subtask assumed it might. **MEDIUM.** Owner: **Orchestrator** (already discharged — reported as instructed)

The subtask required reusing all four helpers and said to say so if one could not serve. **One
cannot.** The expander expands a bracketed *grammar*; `AGENTS.md`'s slot carries one concrete
invocation plus a prose list whose `|` sits **outside** any group — QE's measured input `E5`, which
returns the degenerate `[[]]`, which `resolveOptions` accepts. **Forcing it would have manufactured
the exact vacuity this hop was built to avoid.** Full reasoning in the helpers note. **No fork was
made; the expander was not touched.** Recorded as a gap in the *instruction*, not in the helper.

## `G11` — `advertisedTextOf`'s silent-garbage contract is now depended on by TWO callers and still undocumented. **MEDIUM.** Owner: **Orchestrator** (schedule a hop) / whoever next edits `ABC-066`'s block

QE raised this as `Q2` when it had one caller. **It now has two, and both are safe only because each
independently asserts `includes(SEPARATOR_FORM)` first.** Nothing in the helper's own doc comment
says that precondition exists — it reads *"What the usage line offers: everything after the separator
the criterion names"*, which sounds total. Its sibling `usageLineOf` **throws** on bad input and says
so. **A third caller that trusts the doc comment gets a silent wrong answer**, and by then the
pattern "everyone remembers the precondition" will look like a convention rather than a requirement.

**Recommendation: one line in `advertisedTextOf`'s doc comment naming the precondition — not a
behaviour change**, because making it throw would change `ABC-066`'s merged semantics. **Not done
here: the hard limit forbids editing that block, and QE's own `G4`-class lesson is not to harden a
helper under a hop that is mid-flight.**

## `G12` — `ABC-065` § Dependencies is still wrong, and now doubly so. **LOW** (carried from the Scribe's `G1`, re-confirmed unrepaired). Owner: **BA/PM**

The ticket still says *"`AGENTS.md` IS CLAIMED RIGHT NOW BY ANOTHER HOP — this is the one open
item"*, contradicting its own DoR row 10 which records that claim as drained on 2026-08-16. **Both
halves of the ticket are now written and the claim it names has been in `done/` for two hops.**
Re-confirmed rather than re-derived; ticket prose is BA/PM's pen. **Not a blocker and never was.**

---

## Not gaps — checked and closed so nobody re-opens them

- **The guard is not vacuous.** Mutant `V` restores the original defect and the guard is RED on it,
  on the `includes(SEPARATOR_FORM)` row, and it was seen red **before** it was seen green.
- **`A4` is red in both named directions**, and mutant `C` shows the set equality is live
  independently of the count floor rather than shadowed by it.
- **`A1`/`A3`'s contradiction is a reading, not a third contradiction.** The Orchestrator ruled it;
  I implemented the ruling and did not re-litigate it. **No stop condition fired on that ground, and
  no criterion was re-worded by me.**
- **`spawned` is 10 and this hop added no child.** The guard reads `AGENTS.md` with `readFileSync`.
- **`AGENTS.md` was not edited.** Four mutants were applied to it and **every one reverted**;
  `git status --porcelain AGENTS.md` is empty.
- **The tree hazard did not recur.** Linked worktree; `node_modules` symlinked, not reinstalled;
  every stage by **explicit pathspec**; no `git commit -a` and no bare `git add -A` at any point.
  The shared checkout still holds `main` @ `4e196a3` and its index was left clean.
