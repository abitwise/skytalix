---
id: 20261010T111050Z-software-engineer-decision-abc058-token-bytes-pin-strip-comment-wording-0963774f
kind: decision
by: software-engineer
at: 2026-10-10T11:10:50Z
verified_by:
confidence: high
refs:
  - ABC-058
  - ABC-042
  - ABC-059
  - ABC-114
  - V1.2.5
  - V1.3.3
  - N8-SPAWN
  - ADR-0035
  - src/cli.test.ts
  - 20261010T105420Z-ba-pm-decision-eight-august-pages-five-ready-one-drop-4fdfe525
supersedes:
---

# `ABC-058` build decisions: `BEL` is the added C0, the pin reads `executableCodeOf`, two comment sentences are corrected, and `M3f`/`M3g` are instantiated as one change and one deletion

Hand-authored and unsealed: no `finding` is admissible on this install (`AGENTS.md`). The page is
the contract, and these are the choices it left open.

1. **`S4`: the token is `"\u0007\u001b[2Jpurple\u007f"`.** The page asks for `\x7f` and one more C0
   in the same argv token.
   - `BEL` (`0x07`) was chosen because it is not whitespace under JS `\s`. A whitespace C0 (`\t`,
     `\n`, `\v`, `\f`, `\r`) would split the token in bar 3's `split(/\s+/)` locator. The bytes would
     then sit outside the located word, and the probe would be blind to them again.
   - `NUL` cannot go in an argv.
   - `[2Jpurple` is intact and contiguous. Checked: the token is 1 word under `split(/\s+/)`, and 1
     word contains `[2Jpurple`.
   - Bar 3's assertion at the old `:1741` (`code < 0x20 || code === 0x7f`) is unchanged, and no
     assertion in the file changed.
2. **`S5`: one identifier.** `sourceOf("cli.test.ts")` → `executableCodeOf("cli.test.ts")`.
   - Test note 2 was checked before the counts were trusted. Over the stripped text the import list
     is `["spawnSync"]`, and `/\bspawnSync\s*\(/` matches once: `const child = spawnSync(` in
     `childOf`.
   - `executableCodeOf`'s own block-comment regex holds no `/*` pair, so it cannot open a false
     block comment.
3. **The comments at the two sites.**
   - The pin's "an eleventh child" now reads "a child the counter never sees". The count is 27, and
     the sentence no longer carries a number that drifts.
   - "`N8-LANE` is breached and escalated" contradicted the same block's "no `N8-LANE` line is
     claimed". It now says the child count is the instrument the spawn account rests on and that no
     `N8-LANE` line is claimed in this file.
   - The new sentence deliberately carries no `NFR-008` clause state. `ADR-0035` is `proposed`, and
     a state written into a comment is `ABC-114`'s defect class.
   - The pin comment now says both counts run over executable code with comments stripped. The probe
     docblock says the token carries one member of each class bar 3 forbids.
4. **`M3f` / `M3g` were never written down as text.** Security/NFR recorded them only as "change or
   delete a number". The instances used are:
   - `M3f`: `code === 0x7f` → `code === 0x7e`;
   - `M3g`: ` || code === 0x7f` deleted.

   Both edit `src/cli.ts` `printableOf` in an out-of-tree copy only. `MS2` is the named import
   replaced by `import * as childProcess` plus `const { spawnSync } = childProcess;`. That keeps every
   child working and moves only the import. `MS1` is a module-scope
   `spawnSync(process.execPath, ["-e", ""])`.
5. **Timing: two sets, reported unpooled.**
   - Set 1 read head −0.610 s CPU. That is not a plausible effect of two argv bytes and one regex
     pass.
   - A second set was run with the same harness to check the direction. It did not resolve the
     bound.
   - Both sets are reported as they read. Neither was dropped, and the two were not pooled.
6. **Commit split.** The code commit touches `src/cli.test.ts` alone, so that `A8`'s
   `git diff --name-only <delivered>~1 <delivered>` is one path. Notes, trace and the ticket's
   § Delivery are in a second, docs-only commit.
