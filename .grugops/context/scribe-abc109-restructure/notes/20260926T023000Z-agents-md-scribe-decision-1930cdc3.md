---
id: 20260926T023000Z-agents-md-scribe-decision-1930cdc3
kind: decision
by: agents-md-scribe
at: 2026-09-26T02:30:00Z
verified_by:
confidence: high
refs:
  - ABC-109
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
supersedes:
---

# ABC-109 — the restructure shape chosen, and why

Hand-authored per AGENTS.md's own header (`context-io.ts` / `claim.js` / `propose_note` all absent
from this repo and the kit; `context.human_admission` is `off`; no `finding` is admissible on this
install). Two moves, decided before editing:

1. **Extract the 16 `<!-- RUN … -->` per-command provenance comments** out of `AGENTS.md` §
   Commands into a new file, `memory-bank/90-agents-md-command-log.md` (indexed in
   `memory-bank/00-index.md`), full wording preserved. `AGENTS.md` keeps each command line plus its
   single most load-bearing fact (exit code / count / wall-clock) and a pointer. Chosen over
   deleting the receipts because the ticket forbids losing anything load-bearing, and over keeping
   them inline because that is exactly where the mass is (16.8% of the pre-restructure file).
2. **Condense the six directive-carrying sections in place** — `## Process rules (this project)`,
   `## Branching model`, `## Test and UAT authority`, `## QE validation authority`, `##
   Deployment posture` — rather than extracting them, because their full narrative ALREADY lives
   at the `memory-bank/60-progress.md` sections and `ADR-0007` that each one already named as "the
   authority; this is a pointer to them" before this hop touched the file. Condensing removed the
   restatement, not the only copy. Every dated ruling, every kit-override claim (still three,
   still named, still carrying the "reader who counts four is wrong" sentence), and every pointer
   was checked to still resolve by opening the destination (see the artifact-ref note for the
   grep proof).

**Not chosen: extracting the six directive sections to a new file.** They are read on the same hop
as the Commands section by the same readers (every role, at hop start) — extraction would have
added a second file every one of those roles now has to open, for content whose authoritative copy
was already elsewhere. Compressing in place kept `AGENTS.md` a single self-contained read for the
rules that must be read before work starts, while still shedding the duplicate prose.

**The `- Dev / run:` slot (`src/cli.test.ts` `ABC-065`/`ABC-067`/`ABC-071`) was trimmed IN PLACE,
not extracted.** `SEPARATOR_FORM` (`npm run chess -- `), all three `--` options (`--colour`,
`--ascii`, `--unicode`) and all three colour values (`white`, `black`, `random`) remain inside the
slot's own HTML comment, which still closes before the next top-level list item — verified by
`npm test` (47/47 files, 1446/1446 tests, exit 0, unchanged from the pre-restructure receipt).

**A5's constant, handed to the Engineer:** `24576` (bytes) — the ticket's own `A1` target
(`≤ 24,576 bytes`), which this restructure delivers 2,790 B under (21,786 B measured).
