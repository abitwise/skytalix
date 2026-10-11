---
id: 20261010T190800Z-agents-md-scribe-decision-book-regen-line-placed-verified-7d3e91c4
kind: decision
by: agents-md-scribe
at: 2026-10-10T19:08:00Z
verified_by:
confidence: high
refs:
  - ABC-093
  - ADR-0037
  - QE-093-a
  - QE-093-b
  - AGENTS.md
  - memory-bank/90-agents-md-command-log.md
  - 20261010T183947Z-software-engineer-claim-abc093-agents-md-regeneration-line-owed-a6cb510f
supersedes:
---

# Opening-book regeneration line placed in `AGENTS.md`, after a RUN; `QE-093-a` closed

Hand-authored, unsealed (`context-io.ts` absent; no `finding` admissible). Branch
`grugops/scribe-book-regen-2026-10-10` from wave tip `39d87491`. Not merged, not pushed.

## Size

`AGENTS.md` **23,216 B -> 23,609 B** (+393 B). Cap 24,576 B (`ABC-109`): headroom 1,360 -> **967 B**.

## The line (`## Commands` > `### Development`, after the Spike benchmark line)

`- Regenerate the opening book (ABC-093): \`node tools/opening-book/compile.ts <dir>\``, with a comment:
RUN 2026-10-10, exit 0, 0.4 s, rewrites `data/opening-book/book.json` in place, `cmp` 0 against the committed
file; `<dir>` = the five source files fetched outside the repo at the pinned CC0 commit (URLs and sha256 in
`data/opening-book/ATTRIBUTION.md`); no `<dir>`: usage, exit 1.

## Verification (my own readings)

- Fetched `a.tsv`..`e.tsv` from the raw URLs in `ATTRIBUTION.md` at `a6189a30...` into a private scratchpad
  directory: all five sha256 match the table.
- `node tools/opening-book/compile.ts <dir>` from the worktree root: exit 0, 0.4 s, twice. Result 356,526 B,
  sha256 `3802f52f3ced9d6911875c778c42246854893afbc4bcdae18b5b01454d4bb41d`; `cmp` against
  `git show HEAD:data/opening-book/book.json`: **exit 0**; `git status` clean afterwards.
- No argument: usage line, exit 1.
- **Deviation from the brief, named:** the brief said "run the command once into a scratch dir and `cmp`". The
  compiler takes the SOURCE directory as its argument and writes a fixed output path
  (`tools/opening-book/compile.ts` l. 145), so it cannot write to a scratch dir. It overwrote the worktree's
  `book.json` (own worktree; byte-identical, so no diff). The `cmp` was made against the git blob. The line
  says "IN PLACE" so no later agent expects an output argument.
- `npm test`: exit 0, 53 files, 1680 tests, 8.09 s (matches the brief's expectation).

## Not done, on purpose

`QE-093-b` (no source-hash check at compile time) is the compiler's, outside the fence; the line does not
restate it. The log entry names it as a trap.
