---
id: 20260812T064700Z-ba-pm-observation-sequencing-evidence-a2-touches-the-shared-file-92744d68
kind: observation
by: ba-pm
at: 2026-08-12T06:47:00Z
verified_by:
confidence: high
refs:
  - ABC-028
  - ABC-029
  - ABC-019
  - RISK-ABC017-01
  - src/history-pane.nfr.test.ts
  - src/history-pane.test.ts
supersedes:
---

# SEQUENCING: the answer is YES, it does touch the shared file — one criterion, one region, and the region is the trap

> **Hand-authored, no stamp.** This note is **evidence for a decision that is NOT mine.** The
> Orchestrator asked for a measured *"it does touch it, here is where"* in preference to an optimistic
> no. **This is the measured yes. I did not act on it and I did not change the recorded order.**

## The question

The Orchestrator sequenced `ABC-028` before `ABC-029` believing their build hops shared
`src/history-pane.nfr.test.ts`. QE reported that the `A4` instrument lands entirely in
`src/history-pane.test.ts` and never opens the shared file. **If, with `A1`–`A4` all written,
`ABC-028`'s build hop does not touch the shared file at all, the two could run concurrently and a `P0`
unblocks sooner.**

## File by file, criterion by criterion

| criterion | file(s) its build hop opens | opens `src/history-pane.nfr.test.ts`? |
|---|---|---|
| `A1` | `src/history-pane.test.ts` — one fixture pair + assertions | **no** |
| `A2` | **`src/history-pane.nfr.test.ts`** + `src/history-pane.test.ts` | **YES** |
| `A3` | `src/history-pane.test.ts` — one fixture + assertions | **no** |
| `A4` | `src/history-pane.test.ts` — instrument + four `it`s | **no — measured** |

**`A1` / `A3`:** the ticket's own `## Scope` assigns them to `src/history-pane.test.ts` (*"three new
fixtures and their assertions (`A1`, `A3`, `A4`)"*).

**`A4` is measured clean, and that is the new fact this hop contributes.** QE built and ran the whole
criterion as an **append to `src/history-pane.test.ts`**: no new file, no new module, no new
dependency, **file count stays 26**, and the shared file was **never opened**. Its `Given` is
`LENGTH_CASES`, defined in the **same** file at `src/history-pane.test.ts:139-154` (I confirmed the
symbol and the line at source), so it does not even import from the shared file. **`A4` therefore does
not re-open what `A2` closes** — the check the brief asked for explicitly.

## `A2` touches it. Here is exactly where, read at source at this hop

Line map of `src/history-pane.nfr.test.ts`, read (not edited) at this hop:

- `:103-112` — the comment block. Its load-bearing false sentence is `:106-112`
  (*"THE SHARING HERE IS NO LONGER LOAD-BEARING … So these may be rebuilt per test freely"*).
- `:113-120` — the `AT_0` … `AT_2000` module-scope fixtures. **`A2`'s *"the fixtures at
  `src/history-pane.nfr.test.ts:113` and following"* is accurate to the line.**

Three findings about what `A2` actually obliges:

1. **The ticket's own `## Scope` puts the file in scope in so many words:** *"`src/history-pane.nfr.test.ts`
   — the `A2` demonstration, and whatever the `A2` result obliges the fixture-sharing comment at
   `:106-112` to say."*
2. **The fixture rebuild is NOT required.** `## Out of scope` says `A2` *"establishes that it may be
   done; it does not ask for it"*, and `A2`'s own **preferred** form measures the property by running
   `npx vitest run src/history-pane.test.ts` **alone with the shared file not loaded at all** — which
   opens zero lines of it.
3. **What remains is the comment, and it is an EDIT.** `A2`'s blockquote requires the comment *"left
   saying only what is true of it — **including that the property is now owned in
   `src/history-pane.test.ts`**"*. That sentence is **not in the comment today**, so discharging `A2`
   as written means writing to `:104-112`.

**`RISK-ABC017-01`'s trap is `src/history-pane.nfr.test.ts:104-112` and its trigger is the EDIT, not
the read.** So **`ABC-028`'s own `A2` is the first hop scheduled to edit the trap lines.** That is
intended — it is the mechanism by which the false sentence becomes true rather than being corrected —
but it means the shared-file touch is **real and not eliminable by re-reading the scope**.

## Two facts offered WITHOUT the conclusion drawn

1. **The two tickets' regions in that file are disjoint.** `ABC-028` `A2` at `:104-112` (a comment);
   `ABC-029`'s build at `A11`'s two structural guards, **~120 lines below**.
2. **The ordering rule is semantic, not merely mechanical.** With `A1` landed first the false sentence
   becomes true and no merged text needs correcting. With `ABC-029` first, the ticket's three-site
   conditional fires and the correction falls due at `ABC-017`'s amendment header, `ABC-017`'s `A14`
   block, and the comment — owner BA/PM.

**Disjoint regions do not by themselves make concurrent worktrees safe, and I do not claim they do.**
The ticket's *"they must not run concurrently in two worktrees"* is a stated constraint, not one I
derived, and **I did not change it.** The recorded order (`ABC-028` first) stands untouched in
`## Dependencies`. **Sequencing is the Orchestrator's.**

## Consequence for the DoR, stated so it is not hidden

This is the whole content of item 3's `⚠️` (INVEST *independent*). The `⚠️` is **not** relieved by this
hop and **not** tightened by it: `A4` is clean, `A2` was always the sharer. What changed is that the
sharing is now **located to a line range and a criterion** instead of being a general statement about
a file.
