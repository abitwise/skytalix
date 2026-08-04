---
id: 20260804T161000Z-qe-e2e-observation-5bbcc35c
kind: observation
by: qe-e2e
at: 2026-08-04T16:10:00Z
verified_by: 
confidence: high
refs:
  - ticket-to-pr-ABC-012
  - ABC-012
  - coverage/
  - .gitignore
  - tools/grugops/test-skip-integrity.js
  - .grugops/test-skips.md
  - 20260804T140500Z-software-engineer-observation-f82d9b50
  - 20260804T143000Z-software-engineer-observation-a3758376
  - 20260724T115441Z-qe-e2e-observation-6479ea40
supersedes: 
---

# Two corrections of record to instrument claims this project would otherwise have carried

**Neither of these supersedes the Engineer's notes and neither should.** Those notes carry the NFR
figures and the DAG measurement, which stand; superseding them would delete good evidence to correct
a detail. The corrections are recorded beside them instead, which is what `supersedes` being empty
here means.

Both were treated as things to verify rather than to inherit, and both changed under verification.

## 1. The `grep -vxF -f` instrument is NOT unsound — the shell's `grep` is not `grep`

The Engineer recorded that its first line-presence instrument reported 13–81 "absent" lines per test
file and **failed its own null control by identity**, and that it is therefore *"unsound on this
input class"*. It claimed no number from it, which was the right call.

**The null control reproduces exactly**, which is the first thing worth saying — 13 on
`src/fen.test.ts` compared with itself, 73 on `src/gameend.test.ts`, 81 on `src/apply.test.ts`. The
Engineer's observation is real and was not overstated.

**The diagnosis is wrong, and the difference matters to the next role.** Those counts are the files'
**blank-line counts**, matching 1:1 across four files:

| file | blank lines | shimmed `grep` "absent vs itself" | `/usr/bin/grep` "absent vs itself" |
|---|---:|---:|---:|
| `src/fen.test.ts` | 13 | 13 | **0** |
| `src/gameend.test.ts` | 73 | 73 | **0** |
| `src/apply.test.ts` | 81 | 81 | **0** |
| `src/legal.test.ts` | 46 | 46 | **0** |

The cause is that **`grep` in the agent shell is a shell function**, not the binary: it re-executes
the CLI with `ARGV0=ugrep`, so every `grep` invocation is **ugrep 7.5.0**, which does not match an
empty `-F -x` pattern against an empty line. The `-vxF -f` idiom is sound — `/usr/bin/grep` returns
**0** on the identity control for all four files.

**Why this is worth a note rather than a footnote:** the recorded conclusion teaches the next role to
distrust a correct idiom, when what deserves distrust is the shimmed binary. **Every `grep`-based
instrument built in this environment is running ugrep**, and any role about to build one should
either call `/usr/bin/grep` explicitly or carry a null control — this project's own standing caution,
which is exactly what caught it both times.

This gate did not use the idiom at all; criterion 9 was verified with `git diff --numstat` per file,
with its own null control (see `…-observation-a0401665` §7).

## 2. `npx vitest run --coverage` does not delete 22 tracked files

**The premise holds and the hazard is real.** `coverage/` is **tracked** (22 files at `HEAD` and at
`3a44b3f`), is **not** in `.gitignore`, and a coverage run damages it — so a following `git add -A`
will stage that damage, exactly as the Engineer reported happening and caught.

**The figures do not hold as worded.** Measured here under a controlled restore, both commands run
against the working tree and `coverage/` restored and verified byte-identical afterwards
(`git diff --numstat 3a44b3f -- coverage` empty, `git status` clean):

| command | tracked deleted | tracked modified | new untracked |
|---|---:|---:|---:|
| `npx vitest run --coverage` (the command the note's heading names) | **0** | **15** | 1 |
| `npx vitest run --coverage --coverage.include='src/history.ts'` (the command the artifact-ref records as run) | **12** | 3 | 1 |

Neither is 22, and the plain command — the one the heading names and the one a future role is most
likely to type — **deletes nothing**. The two Engineer notes name different commands, which is the
likely source of the drift.

**The mitigation, verified rather than suggested:** run coverage with
`--coverage.reportsDirectory=<path outside the repository>`. Done that way, the coverage number for
`src/history.ts` was obtained (100 / 100 / 100 / 100) and `git status --porcelain -uall coverage` is
**empty** — no tracked file touched at all. Security/NFR runs coverage next and this is the command
to use.

**Flagged, not fixed** (`AGENTS.md` rules 9 and 12), agreeing with the Engineer: whether a generated
report belongs in git is a human's repository-hygiene call, not a QE cleanup on a game-history
ticket. The committed report is stale — it predates `src/history.ts`.

## 3. The test-integrity checker, re-run rather than inherited

Run exactly as Workflow 05 step 3 specifies:

```
$ node tools/grugops/test-skip-integrity.js .grugops/test-skips.md --skip-count 0
Error: cannot read the registry file: .grugops/test-skips.md
exit=2
```

**Exit 2 is "the checker could not run", which is an error distinct from a clean fail and must never
be read as a pass.** Recorded as exactly that, and the Engineer's three reasons why it is not a gate
failure are confirmed independently: exit 2 is not the exit-1 short-circuit; the suite's skip count
is **0** (measured here with the `AGENTS.md` command), so there is nothing for the registry to
justify; and the registry is human-owned — an agent may not self-author a justification to clear its
own gate, and none was created. The same conclusion QE recorded on 2026-07-24 for the same reason.

**The standing gap the Engineer named is confirmed and repeated here so it does not evaporate:** no
board entry or trace row in this project has ever mentioned this checker, only the raw skip count.
That is a reporting gap in how the gate is described here, not something this ticket introduced.
