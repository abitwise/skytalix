---
id: 20261021T120644Z-qe-e2e-observation-ccffd570
kind: observation
by: qe-e2e
at: 2026-10-21T12:06:44Z
verified_by: 
confidence: high
refs:
  - ABC-184
  - AR-183-CWDARG
  - grugops/ABC-184
  - c6f80c81
  - 442d1e57
  - 5277babd
  - grugops/qe-ABC-184
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
  - QE-184-a
  - QE-184-b
  - QE-183-b
  - src/book-file.ts
  - 20261021T134100Z-security-nfr-decision-41f70925
supersedes: 
seal: sha256:9a585c1d9606acc787f98869d83680e570074a80f540c5144d27ed4e452e68ca
---


# ABC-184: what `booked.cwd` pins, and what survives it. A one-line edit to `spawnSync`'s `cwd` option, aimed at the neutral child, survives under P6f. So does a forged record on the `booked` line. Neither undercuts the `AR-183-CWDARG` close

**What the assertion pins.** `RealChild.cwd` is `spawnNode`'s `cwd` parameter. That is the same identifier the `spawnSync` option uses (`:247` option, `:268` record, both shorthand `cwd`). Nothing reads it from the child.
- The field therefore catches any edit **upstream** of `spawnNode`: `booked`'s arguments, `spawnReal`'s default, or `spawnReal`'s pass-through. TCWD is one of these.
- It does not catch an edit **inside** `spawnNode` that splits the option from the record.
- The `[CLI_DEEP] (cwd …)` log line (`:259`) prints the same parameter, so it would not show a split either.

**Probes** (scratch, head test, the same method as `A3`, one cell at a time, private `TMPDIR`, 400 heap; P6f `afeab577…`):

| probe | the edit | sha256 (test) | P6f | delivered `book-file.ts` |
|---|---|---|---|---|
| **TSPWN** | in `spawnNode` only, the option line `cwd,` → `cwd: cwd.includes("abc162-neutral-cwd-") ? REPOSITORY : cwd,`. The record stays `cwd` | `01d60c77…9d87` | **11/11 green: SURVIVES** | 11/11 green |
| TSPWG | in `spawnNode` only, the option line `cwd,` → `cwd: REPOSITORY,` (every child) | `68743f77…4223` | **7/11: KILLED, but not by the new assertion.** Red: `ABC-119` A1 (the real-search floor, `… to be greater than or equal to 1000`); `ABC-119` A3(iv) and `ABC-101` A10 (`book-absent warnings: expected +0 to be 1`); `ABC-095` A5 stream half (`warnings on stderr: expected +0 to be 1`). A7 passes | not run (nothing reads cwd) |
| **TFORGE** | TCWD plus a forged record on the same line: `booked = { ...spawnReal(REPOSITORY, …, ["--colour", "white", "--ascii"]), cwd: neutral };` | `b54249a6…4f5d` | **11/11 green: SURVIVES** | not run |

- **TSPWN** is the page's named residual ("a plant that edits only `spawnSync`'s `cwd` option inside `spawnNode` survives"). Its cost is **one line, not two places**: the option and the record are separate shorthand occurrences, so the option alone can change.
  - The plant must aim at the neutral child. The untargeted form, TSPWG, moves the book-absent children too, and under P6f four other rows red.
  - It is a deliberate, path-conditional helper edit, the same class as QE-183-b. **INFO.**
  - Typecheck does not catch it: the record is still a `string`. Typecheck does catch a *missing* record. I ran a negative control in scratch with `cwd,` removed from the return: tsc rc 2, `TS2741: Property 'cwd' is missing … required in type 'RealChild'`.
- **TFORGE** overwrites the field on the `booked` line. Any assertion can be defeated this way by editing its input or the assertion itself. **INFO**, recorded only.
- **Closed by construction:** the environment route. `CHILD_ENV` is `{}` (`:104`), so a production read from `PWD` or `INIT_CWD` cannot see the parent's tree root. The child gets no such variable.
- **Neither survivor undercuts the close.** The close condition is the page's TCWD + P6f row, which reds at the new assertion (the A3 matrix note). The survivors are different plants. One is out of scope by the page's own terms (the child's real cwd). The other is the forged-input class.
