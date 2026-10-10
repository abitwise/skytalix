---
id: 20261010T083120Z-software-engineer-claim-abc036-built-owed-qe-three-of-twenty-visible-83696dfe
kind: claim
by: software-engineer
at: 2026-10-10T08:31:20Z
verified_by: 
confidence: UNKNOWN - verify
refs:
  - ABC-036
  - ABC-035
  - ABC-038
  - EPIC-003
  - EPIC-006
  - src/command-input.ts
  - src/command-input.test.ts
supersedes: 
---

# `ABC-036`: built and owed QE. A player sees 3 of 20 at the start, and what this hop did not guard

Hand-authored, no seal. This is a soft claim, not load-bearing. QE re-runs it.

**Built.** Branch `grugops/ABC-036-moves-command`, code `6aad5c9`. Not merged, not pushed.
Still owed: the QE hop (`AGENTS.md` § QE validation authority), the `In Development → In Review`
move on `plans/board.md` (fenced from this hop, so the Orchestrator makes it), and the merge.
The diff carries production lines, so the zero-production-lines UAT waiver does **not** apply.

**For the Orchestrator and the owner, about the reduced promise.** At the start position the region
shows **3 of 20** moves: `legal moves: 20 Na3` / `Nc3 Nf3 (+17 more)`. The page's problem
section estimated "roughly 9 of 20". That figure assumed the region held SAN alone. The count item
(15 columns) takes most of row 1 at the 21-column width. This is within the amended criterion: the
exact count, the list partial, and `+N` stated. But it is a smaller list than the ruling's
arithmetic implied. A shorter count item would show a few more moves (for example `20 moves`,
8 columns; or `20:`, which is terse). That is wording, and the choice is the product's. The
named reversal (the pager) is unchanged. I did not act on any of this.

**Not guarded by a dedicated row in this hop:**
- The 0-legal-moves case (`legal moves: 0`, empty listing). It is reachable only by calling the
  pure function on a mate or stalemate position, because the loop ends the game before it
  prompts there.
- `moves` clearing an armed `quit`. It holds by construction: the wrapper disarms on any
  non-`quit` token. No row asserts it for `moves` specifically.
- Glyph mode: `A3` and the region render above are Unicode only. ASCII mode was not rendered for
  `moves`. The `ABC-035 A7` rows also run Unicode only.

**Inherited, not changed:** the `help` region is full (both rows 21/21). A ninth token hides
three (`ABC-036` § Dependencies). `ABC-038` must leave `src/command-input.ts` byte-identical,
so it merges after this branch onto a file that has changed.

**Environment observation, not touched:** the main checkout's `node_modules` contains a
self-referencing symlink `node_modules/node_modules -> <repo>/node_modules`, dated 2026-09-19.
It makes `diff -r` report a directory loop. It is harmless to vitest. Whoever created it should
decide whether to keep it.

**No `AGENTS.md` line drafted.** Nothing here is a new command. One shell trap: `diff` in this
host's profile resolves to `git diff`, so the lane harness's identity check needs
`/usr/bin/diff -rq`. That is host-specific, and the Scribe should decide whether it belongs.
