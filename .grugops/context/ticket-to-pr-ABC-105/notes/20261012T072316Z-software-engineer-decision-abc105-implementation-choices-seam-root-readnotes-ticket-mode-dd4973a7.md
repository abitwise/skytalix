---
id: 20261012T072316Z-software-engineer-decision-abc105-implementation-choices-seam-root-readnotes-ticket-mode-dd4973a7
kind: decision
by: software-engineer
task: ticket-to-pr-ABC-105
at: 2026-10-12T07:23:16Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A1
  - A2
  - A3
  - A4
  - A5
  - A6
  - A9
  - tools/grugops/qe-hop-integrity.js
  - tools/grugops/qe-hop-integrity.test.ts
  - .grugops/qe-cutover-2026-08-17.txt
supersedes:
---

# `ABC-105`: the choices I made where the page leaves room, and the two seam extensions

This is a hand-authored, unsealed note with no stamp, per `AGENTS.md`. The page's § Scope and § Acceptance are
the contract. This note records only where I had to choose.

**Snapshot path.** The page names `.grugops/qe-cutover-2026-08-17.txt` (§ Scope 3), so the file is there and
not under `tools/grugops/`, which the brief proposed "unless the page names a path". `vitest.config.ts`
excludes `.grugops/**`, but the file is `.txt` and nothing collects it. Its 4 header lines are `#`. It has 38
id lines in board order, as `parseDone` returned them.

**Seam (§ Scope 5): two additions beyond the three named exports.** Both are in-memory only, and neither can
be reached from the command line.
- `main(argv, { snapshotIds?, root? })`. `root` points `main` at a synthetic tree for `A6` (missing board,
  missing snapshot, unreadable note, the three malformed shapes) and at the symlink refusal. The test runs in
  a vitest `threads` worker, where `process.chdir` is unavailable, so a cwd-relative tree is not an option. The
  CLI always uses the repository root, resolved from the script's own location.
- `readNotes(contextDir, folderFilter?)` is exported. The test needs it to show, on real notes, that the
  `A3` trap exists (a `qe-e2e` decision under `quality-gate-ABC-066-qe` lists `ABC-062` in `refs:`) and that
  `ABC-076`'s covering notes hold no `ABC-076` element (`A2`'s exact-reading clause).
- `snapshotIds` does not bypass the file. `main` reads `.grugops/qe-cutover-2026-08-17.txt` on every run and
  exits 2 if it is missing, even when an in-memory set is passed. A test asserts this.

**`--ticket` reads only folders that name `T`.** Condition 4 means no other folder can cover `T`. `A6`'s
`--ticket` domain for malformed notes is also "folders that name `T`". So `--ticket` lists every folder but
opens only those. One consequence: under `--ticket`, an unreadable note in an unrelated folder is not opened
and does not cause exit 2, while `--sweep` opens every note. `--ticket` still reads the board, the snapshot
and the context directory, and fails closed on each. It reports whether `T` is already a `Done` row.

**Fail-closed choices beyond the page's three.**
- A board with no `## Done` heading exits 2, not "0 rows".
- A non-comment snapshot line that is not `ABC-\d+` exits 2.
- Any symbolic link at the folder, `notes/` or note level exits 2 and is never followed. There are 0 symlinks
  today.
- An unknown argument exits 2 with the usage line, and that covers `--force`, `--skip`, `--allow` and
  `--snapshot` (Test note 3). `--ticket` must be `ABC-` and at least 3 digits.

**Rules as implemented (the page's, not loosened).**
- Front matter is parsed with `String.split("\n")`.
- A key line is `^[A-Za-z_][A-Za-z0-9_-]*:` followed by end of line or a space and a value.
- An item is an indented `-` after a key.
- An inline `refs: [...]` is one element, as written. Quoted values are compared as written.
- The token rule `/(?<![a-z0-9])abc-?(\d+)(?!\d)/gi`, compared by number, decides both the folder condition
  and the refs condition (`A5`).
- A folder starting `ticket-to-pr-` that names `T` is rejected.
- `qe-e2e` outranks `security-nfr` when both cover a ticket.
- The off-convention five (`ABC-044`, `-070`, `-085`, `-110`, `-113`) stay findings.
