---
id: 20261012T100000Z-software-engineer-decision-abc105-fix2-notes-seam-9c628f28
kind: decision
by: software-engineer
task: fix2-ABC-105
at: 2026-10-12T10:00:00Z
verified_by:
confidence: high
refs:
  - ABC-105
  - N8-LANE
  - QE-105-x
  - A4
  - tools/grugops/qe-hop-integrity.js
  - tools/grugops/qe-hop-integrity.test.ts
  - 20261012T095452Z-qe-e2e-decision-abc105-qe3-n8-lane-not-met-15ca6e06
supersedes:
---

# `fix2-ABC-105`: one more in-memory seam option on `main`, `notes`, so the whole-tree reads drop from 5 to 2

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`. It was written before the tool was edited.

**Why the test alone cannot reach 2.** `A4` runs `main` three times over the whole tree: `--sweep --json`,
`--sweep`, and `--sweep` with every `Done` id as the snapshot. `main` calls the module-local `readNotes`, which
an ESM test cannot intercept. A test-only change can share the plain `--sweep` (between `A4` and `A9`) and one
unfiltered `readNotes` (for `A3`). The `--json` run and the all-`Done` run would still each read the tree. That
makes 4 reads, not 2.

**The option.** `main(argv, { notes })` takes an already-read `Note[]` and uses it in place of `main`'s own
`readNotes` call. It works like `root` and `snapshotIds`: it lives in memory only, no argv token reaches it, and
the CLI wrapper still calls `main(process.argv.slice(2))`. The change is two places in the tool:
- **The read line.** It becomes `notes = options.notes ?? readNotes(...)`. The `readNotes(...)` text is
  unchanged, so QE's `A3-refs-only-full` and `ticket-filter-removed-only` plant strings still match exactly once.
- **The JSDoc of `options`.** It gains `notes?: Note[]`. `tsconfig.json` type-checks the tool through the test's
  import (`allowJs`), so without it `{ notes }` is an excess-property error.

Every other byte of the tool stays the same.

**The caller owns the filter.** With `notes` given, `--ticket` does not apply its folder filter. The test passes
`notes` under `--sweep` only, where `main` itself applies no filter.

**What still runs the real path.** One plain `run(["--sweep"])` has nothing injected. It reads the board, the
snapshot and the whole tree through `main`'s own `readNotes` call. `A4`'s text checks and `A9`'s "lists ABC-073"
both assert on that one result. The `--json` run and the all-`Done` run get the one shared unfiltered
`readNotes(<real .grugops/context>)`, which `A3` also asserts on.
