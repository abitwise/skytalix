---
id: 20261012T050042Z-qe-e2e-observation-abc145-readings-0d24876c
kind: observation
by: qe-e2e
at: 2026-10-12T05:00:42Z
verified_by:
confidence: high
refs:
  - ABC-145
  - ADR-0037
  - NFR-008
  - NFR-006
  - tools/opening-book/compile.ts
  - tools/opening-book/book.test.ts
  - data/opening-book/ATTRIBUTION.md
supersedes:
---

# QE `ABC-145`: QE's own reading of each criterion (taken before reading the SE's notes)

This note is hand-authored and unsealed. `AGENTS.md` says no `finding` is admissible on this install.

Base `3537fe48`, code `7be28bf9`, SE tip `62a5f8ea`. QE worked in its own worktree
(`../cli-chess-example-qe-ABC-145`, branch `grugops/qe-ABC-145` off the tip, its own `npm ci`). It also used two
detached scratch worktrees in the session scratchpad: one at the base (`node_modules` symlinked, since
`package.json`, `package-lock.json` and `vitest.config.ts` are unchanged base..tip) and one plant tree at the tip.
**No timing, wall or CPU reading was taken.**

- **`A1` MET.** This is QE's own plant, in process, through `checkThenWriteBook`:
  - five **distinct** well-formed files (5 distinct hashes), with the expected set taken as their own hashes;
  - one byte flipped in place inside a name, in `c.tsv` (`Game` → `Gamd`) and then separately in `e.tsv`.
    `cmp` shows 1 differing byte, and the length is unchanged;
  - result: refused, **3 of 3** substrings (file, expected, actual), and the scratch output **does not exist**.
  - **Red on a no-check variant.** The same plant through `writeBook` alone (the base command-line path) does
    not refuse, matches **0 of 3**, and the output exists. On the lane, mutant `M02` (the check loop runs over
    nothing) turns the `A1/A2` `it` red.
- **`A2` MET.** The unaltered control writes, and the output exists, both in QE's plant and in the lane's
  `it`.
- **`A3` MET.** **5 of 5** at head (the lane `it` is green). On QE's scratch plant tree these all turn the `A3`
  `it` red: one hex character in the `a.tsv` constant (`M10`); the last hex character of `d.tsv` uppercased
  (`M11`); the `a`/`b` values swapped (`M12`); one hex character in `ATTRIBUTION.md`'s `a.tsv` row (`M13`);
  and the key `e.tsv` renamed `f.tsv` (`M09`).
- **`A4` MET. QE re-ran it on 2026-10-12.**
  - All five files were fetched with `curl -fsSL` from the raw URLs at `a6189a30…` into a new, empty
    directory in the session scratchpad, outside any repository. Every `curl` exited 0.
  - All five `shasum -a 256` values equal the pins.
  - `node tools/opening-book/compile.ts <dir>` (on the plant tree at `62a5f8ea`) exits **0**. `cmp` against
    `git show main:data/opening-book/book.json` exits **0**.
  - Negative runs on copies. Each was followed by `cmp` 0 on `book.json`:
    - `x` appended to `b.tsv`: exit **1**, `Error: b.tsv: sha256 is 1a104c25…e951, expected 1d5ed134…f623`;
    - one byte flipped in place in `c.tsv` (offset 22586): exit **1**, naming `c.tsv` and both hashes;
    - `e.tsv` missing: exit **1** (`ENOENT`).
  - An extra `f.tsv` in the directory: exit 0 and `cmp` 0. It is ignored, which is correct, because only
    `SOURCE_FILES` are read.
  - **See `QE-145-e`:** the base compiler also exits 1 on the appended-byte copy, so only the hash text in the
    message tells the two apart.
- **`A5` MET.** Read on joined text: § Regenerating to the next heading, with newlines folded to spaces and
  `**` and backticks stripped. `SOURCE_SHA256` occurs **2** times at head and **0** at base. The five table
  rows, with their line numbers, `cmp` **0** base against head. Everything in `ATTRIBUTION.md` up to the
  `## Regenerating` heading also `cmp`s **0**.
- **`A6` MET, read on the code range `3537fe48..7be28bf9`** (Orchestrator ruling).
  - The range touches exactly the 3 permitted paths, with 0 under `src/` and 0 added files.
  - The tip commit `7be28bf9..62a5f8ea` adds only record paths: 4 SE notes under
    `.grugops/context/ticket-to-pr-ABC-145/notes/` (the only added files on the branch), 1 appended row in
    `plans/traceability.md`, and the ticket's § Delivery (0 lines removed). It touches 0 paths under `src/`,
    `tools/` or `data/`.
  - `book.json` `cmp`s 0 against both base and `main`.
  - `compileBook` (66 lines, awk window) `cmp`s 0. `writeBook`'s export line `cmp`s 0, and so does its whole
    body.
  - **Existing blocks:** the base file holds **10**: 9 `it(` plus 1 `it.each(defects)` over 8 rows, which is 17
    tests. All 230 lines from `vi.mock` to the end of the base file `cmp` **0** against head. The only header
    change is the imports. So **0 existing blocks changed.**
  - The no-argument run prints the usage line and exits **1**.
  - `npm test`: base **56 files / 1741 tests**, head **56 / 1743** (= base + 2), both exit 0.
  - Skip count **0**; integrity `No findings.`
  - `spawn|execFile|child_process` in `book.test.ts`: **0**.
- **Gates at head:** lint 0, typecheck 0, build 0, `npm test` 0.
