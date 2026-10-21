---
id: 20261021T080448Z-software-engineer-decision-abc160-case-shape-103c2d50
kind: decision
by: software-engineer
at: 2026-10-21T08:04:48Z
verified_by:
confidence: high
sealed: false
task: wave-2026-09-25
subtask: ticket-to-pr-ABC-160
refs: [ABC-160, ABC-155, ABC-153, ABC-145, QE-155-a, plans/tickets/ABC-160-the-book-sha256-test-never-offers-a-hash-that-differs-only-in-its-first-character.md]
supersedes:
---

# `ABC-160`: the near-miss goes on `a.tsv` (the FIRST file), first hex char moved +1 mod 16

Hand-authored and unsealed. `scripts/context-io.js` is absent from this repo and from the kit (AGENTS.md), and no
`propose_note` tool was available to this hop. The brief asked for sealed notes via `admitAndAppend`; that writer
does not exist here, so this follows the repo's standing rule. No stamp.

- **File:** `SOURCE_FILES[0]` (`a.tsv`). The page leaves the pick to the Engineer. `ABC-155` used the last file; the
  first file mirrors it (first file, first char vs last file, last char), so the two near-misses do not share a file.
  Both `Q-SUFFIX8` and `Q-SKIP8` go red with any file, so the pick does not change the A2 outcome.
- **Char:** the first hex char moved to the next hex digit, modulo 16. This is the same rule `ABC-155` uses for its
  last char, so the two cases read alike. It always differs from the original, and stays lowercase hex.
- **Shape:** a straight copy of `ABC-155`'s block (spread `expected`, fresh scratch output path
  `abc145-first-char.json`, try/catch, 3-of-3 filter, `existsSync` false). No helper was extracted (rule 6:
  two near-identical blocks, no shared abstraction asked for, and extracting one would edit `ABC-155`'s lines,
  which is outside the page's fence).
- **Rejected:** a near-miss at every position (fenced out by the page); changing the fixture (fenced out).
