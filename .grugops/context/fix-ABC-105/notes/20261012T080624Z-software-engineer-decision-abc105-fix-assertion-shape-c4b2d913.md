---
id: 20261012T080624Z-software-engineer-decision-abc105-fix-assertion-shape-c4b2d913
kind: decision
by: software-engineer
task: fix-ABC-105
at: 2026-10-12T08:06:24Z
verified_by:
confidence: high
refs:
  - QE-105-p
  - QE-105-q
  - tools/grugops/qe-hop-integrity.test.ts
supersedes:
---

# `fix-ABC-105`: the shape of the four new tests

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`. It is not a QE verdict; `by: software-engineer`.

- **`QE-105-p`, in `A3`'s describe block.** One test reads `readNotes(<real .grugops/context>)` with **no folder
  filter**. It asserts that `coverage("ABC-062", all, minus("ABC-062")).status` is `"finding"`, and that
  `coverage("ABC-073", all, snapshotIds).status` is `"finding"`. It also asserts that `ABC-073` is not in the
  snapshot, so the second reading is not a pre-cutover pass by accident. I put both in one test because they guard
  one condition, condition 4 inside `coverage()`.
- **`QE-105-p`, the cheap `--sweep` assertion, in `A9`'s describe block.** `--sweep` exits 1, and stdout contains
  `"  ABC-073: no QE verdict note was found.\n"`. This pins one id, not the sweep's counts: `A4` still deliberately
  pins no count.
- **`QE-105-q`, in `A6`'s describe block.** One `it.each` with two cases, on the same synthetic tree as the existing
  task-folder test:
  - `qe-ABC-200/notes` is a symlink to an outside `notes/` directory;
  - `qe-ABC-200/notes/a.md` is a symlink to an outside note.

  Each case asserts exit 2, empty stdout, and stderr containing
  `refusing to follow the symbolic link .grugops/context/<link>\n`. The trailing `\n` stops the `notes` case from
  passing on the `notes/a.md` message.
- **Kept as they were.** The test file is the only code change, with 0 spawns. `tools/grugops/qe-hop-integrity.js`
  is `cmp` 0 to `60415a8a`.
- **Left open, as briefed.** `QE-105-r` (a symlinked root) is a behaviour change to the tool, so it is out of scope
  for a test-only fix.
