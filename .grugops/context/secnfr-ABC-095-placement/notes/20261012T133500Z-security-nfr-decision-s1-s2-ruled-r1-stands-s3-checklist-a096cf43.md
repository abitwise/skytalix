---
id: 20261012T133500Z-security-nfr-decision-s1-s2-ruled-r1-stands-s3-checklist-a096cf43
kind: decision
by: security-nfr
task: secnfr-ABC-095-placement
at: 2026-10-12T13:35:00Z
verified_by:
confidence: high
refs:
  - ABC-095
  - ABC-042
  - ABC-041
  - ABC-043
  - ABC-094
  - ABC-119
  - ADR-0036
  - ADR-0037
  - F-095-1
  - AR-095-L1UNIT
  - AR-095-READ
  - V12.3.1
  - NFR-006
  - 20261012T132829Z-security-nfr-observation-placement-plants-bar4-scope-symlinked-copy-f0bf8b4a
  - 20261012T132000Z-architect-design-decision-wiring-rulings-r1-r3-and-amendments-a4fe3027
  - memory-bank/50-decisions/ADR-0036-abc041-clause-b-is-a-delta-test-on-the-production-capability-surface.md
supersedes:
---

# S1 and S2 are ruled and R1's placement stands; S3's checklist is written, so the SE can build to it

This note is hand-authored and unsealed. No `finding` is admissible on this install, so every item
below is a `decision`. The evidence is in `…f0bf8b4a`.

**The result for the placement design is PASS_WITH_RISKS.**
- **This is not `ABC-095`'s gate.** That gate is S3, after the wiring is built.
- **The risks:**
  - `F-095-1` (MEDIUM), which closes when the `ADR-0036` block merges;
  - `AR-095-L1UNIT` (LOW);
  - `AR-095-READ` (LOW).

## S1: (b2) gets no call-graph reach, and limb 1's (b1) unit becomes the holder file

The ruling text is `ADR-0036` § `### S1 — the fourth holder — 2026-10-12`. Cite that block; this note
does not restate it. In one line each:
- **(b2) stands as written.** The residual that a reach would close (P6) re-reads fixed bytes through
  a function with no parameter, and a new importer already fires (P5).
- **Limb 1 now fires on any `+` line in a file that holds limb 1.** P2b, which redirects the read to
  `/etc/passwd`, and P2c, which makes the path come from input, fired nothing under the instrument as
  it stood. A limb-1 use carries no token, and this is the first limb-1 holder.
- **§ Decision 3's trigger is re-armed.** It fires at the first holder whose export takes a
  caller-supplied value that reaches a capability, or at a fifth holder.

## S2: bar 4 is file-scoped, so no bar text changes

`ABC-042` bar 4 covers the own source of `src/cli.ts` and `src/cli-options.ts`. Its test reads those
files and nothing else. The evidence, in `…f0bf8b4a` § 2:
- **its origin,** "in the delivered diff";
- **the page's ruled scope,** "the entry point and the resolver";
- **the gate's MET reading,** which was those two modules' 7 specifiers;
- **`ADR-0037` D1,** an accepted runtime read that a process-wide reading would contradict.

**What follows.**
- `ABC-042`'s page is not edited, and the Architect's carve-out is not written.
- **R1's placement stands.** It is the stronger choice under bar 4's purpose: the module that sees
  argv imports no `node:fs`, and the module that reads takes no input.
- **The recheck's "no filesystem" premise still holds** for the residual it bounded (`…c5503490`, an
  undocumented flag in the resolver). No argv value can reach the read.

## S3: what `ABC-095`'s `In Security/NFR` gate will check (build to this; do not run it now)

1. **Clause (b) on the delivered pair** (merge-base..tip). Use
   `.grugops/context/design-F-072-1/probe/clause-b.mjs`, limbs 1–3, plus Ruling 2 by hand.
   - **Expected:**
     - limb 1 FIRES, with (b1) on `src/book-file.ts`'s import and (b2) on `cli.ts -> book-file.ts`;
     - limb 2 FIRES, with (b1) on the warn's `process.stderr` in `cli.ts`;
     - limb 3 does not fire.
   - **The two edges that must not fire:** `cli.ts -> book.ts` (no limb in its closure) and
     `cli.ts -> book-engine.ts` (the decorator holds no limb).
   - **The holder set at the tip is exactly 4:** `cli.ts`, `glyph-mode.ts` and `perft-bench.ts` hold
     limb 2, and `book-file.ts` holds limb 1.
   - **Any other line, edge or holder** is read on its merits, and a dispute fires.
2. **`src/book-file.ts`, read line by line against R1's contract:**
   - exactly one import, `{ readFileSync } from "node:fs"`;
   - one export, `readBookFile()`, with **zero** parameters;
   - one call, `readFileSync(new URL("../data/opening-book/book.json", import.meta.url))`;
   - no other `fs` API, no write, no other path, and no `process`;
   - no `catch`;
   - nothing that runs at import (`N-LOAD`).
3. **`src/cli.ts`.** The diff is limited to:
   - the new imports;
   - the one `const` that binds `read`, `warn` and `random`;
   - `engine: withBook(book, createEngine({ budgetMs: DEFAULT_BUDGET_MS }))`.

   **`warn`** writes `${line}\n` to `process.stderr` and never to stdout.
4. **`ABC-042` `A9`.**
   - **The census.** The sorted `process.\w+` list gains a third `"process.stderr"`, and the
     `\bprocess\b` count moves from 9 to 10.
   - **The test** carries a reason line, as at `ABC-043` and `ABC-115`, and still has
     `not.toContain("globalThis")`.
   - **The rule holds**, because the acquisition is still at the entry point.
5. **`ABC-042` bars 1 and 4 stay green and unedited.** Their checks are **substring** checks over
   `cli.ts`, and **comments count.** The new text in `cli.ts` must not contain `eval`, `Function(`,
   `child_process`, `import(`, `fetch`, `WebSocket` or `XMLHttpRequest`. The specifier
   `./book-file.ts` does not match bar 4's grammar.
6. **The hostile-input surface is `ABC-094`'s.**
   - `git diff <base> <tip> -- src/book.ts` is empty; otherwise it is re-reviewed.
   - The warning still carries no byte of the file, and no `fs` error text. Today it reads "could not
     be read", with no path and no errno.
   - `AR-095-READ` (below) is accepted, not fixed.
7. **R2's `ABC-119` tree copy.**
   - **The copy is real, not linked.** Every entry under the copy's `src/` is a regular file
     (`lstat`, not a symbolic link): byte identity cannot see a link, and a linked `src/` reads the
     repository's book (`…f0bf8b4a` § 3).
   - **The leak detector.** `A3`(iv)'s book-absent warning line is asserted **present** on the
     child's stderr, not merely tolerated.
   - **Where it is written.** The copy is made under `mkdtemp(os.tmpdir() …)`.
   - **How it is removed.** Only the exact path that `mkdtemp` returned is passed to the recursive
     `rmSync`: never a joined or computed path, and never the repository.
8. **`ABC-041` clauses (a), (c) and (d) on the delivered diff:**
   - **(a).** `package.json` and `package-lock.json` are untouched.
   - **(c).** Filesystem writes only under the temp dir. Spawn call sites and children are counted
     against the pins (0 new in the default lane), and any new `CLI_DEEP` child is named. A dispute
     fires.
   - **(d).** Files are read against the § Scope that BA/PM amends. A file outside it fires.

## `ABC-041`'s clauses beyond (b), reached by the placement itself

- **(a) Runtime dependency: not reached.** `node:fs` is a builtin, and no manifest changes.
- **(c) Test-lane capability: reached by R2,** not by R1. The `ABC-119` tree copy is a filesystem
  write. Inside a temp dir it does not fire; outside one, it does. Item 7 is the bar.
- **(d) Blast radius: reached** until BA/PM's § Scope amendment names `src/book-file.ts`,
  `src/cli.test.ts` and `src/cli.real-engine.test.ts`. That is the Architect's list, items 3–4.
- **Path traversal: not reached.**
  - The path is a constant, resolved from the module's own URL, and it does not depend on the
    working directory.
  - No argv, environment or option value reaches it.
  - P2c shows the shape that would reach it. Ruling 2 now routes any such edit to this gate.
- **A symlinked `data/`: not a boundary.** `readFileSync` follows the link, but planting one needs
  write access to the checkout, and that principal can already edit `src/`. **The real symlink
  hazard is in the test lane** (item 7): a linked `src/` in R2's copy defeats "book absent".
- **A malformed `book.json`** is `ABC-094`'s merged path, and it is unchanged.
- **An oversized or non-regular `book.json` is `AR-095-READ`** (LOW; owner Security/NFR).
  - **The gap.** `NFR-006`'s 1 MB cap is checked after `readFileSync` returns. A huge file is read
    whole into memory before it is refused, and a FIFO blocks the first engine ply.
  - **Why it is accepted.** The same-principal argument above, on a local-only CLI (`ADR-0007`).
  - **Trigger to fix it.** It is fixed when `data/` could come from a location that another principal
    can write (`EPIC-006` packaging), or when the path ever stops being a constant. The fix: bound
    the read in `book-file.ts` with a regular-file check and a size check, both before the read.

## Owed

- **SE (`ABC-095` wiring hop):** build to S3 items 2–8.
  - The traps: comment substrings in `cli.ts` (item 5), and a linked `src/` in the copy (item 7).
- **BA/PM (`ABC-095`, `ABC-119` pages)**, on top of the Architect's list:
  1. **`ABC-119` `A1`'s Given and its default-lane row.** "byte-identical `src/`" also says "a real
     copy: no entry is a symbolic link".
  2. **`ABC-119` `A3`(iv).** The book-absent warning is asserted present: it is the leak detector.
  3. **`ABC-095`'s Security bullet** cites `ADR-0036` § S1, so that later edits to `book-file.ts`
     fire.
- **Architect/Design:** fold Ruling 2 into `clause-b.mjs`, with P2b and P2c as plants that fire
  (`AR-095-L1UNIT`).
- **Orchestrator:**
  - apply Ruling 2 by hand when routing, until the fold lands;
  - record `F-095-1` closed when the `ADR-0036` block merges.
