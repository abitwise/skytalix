---
id: 20261012T073610Z-qe-e2e-observation-abc105-readings-hand-count-snapshot-cli-0ff9feb3
kind: observation
by: qe-e2e
at: 2026-10-12T07:36:10Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A1
  - A2
  - A4
  - A6
  - A7
  - A8
  - A9
  - 20261012T072547Z-software-engineer-observation-abc105-sweep-at-build-tip-and-hand-count-agree-59fc8af7
supersedes:
---

# QE `ABC-105` readings: hand count agrees on every count and id, snapshot equals `9998a544`'s `## Done`, gates green

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). Tree: QE worktree
`../wt-qe-ABC-105` on `grugops/qe-ABC-105` at the Engineer's tip `60415a8a` (code `ada10423`, base `aeeba067`).
`node_modules` is a symlink to the main checkout's install, and it is gitignored.

## `A4`: the hand count, using code that shares nothing with the tool or the Engineer's script

The instrument is `probe/handcount.py`, written in Python. It reads `## Done` with string operations, and it finds
ids with a hand-written character scanner rather than a regex. Its front-matter reader is a
`split(":", 1)` reader. It runs at `60415a8a` (2624 notes):

| tree / board | `Done` | pre-cutover | `qe-e2e` | substitute | findings | sum |
|---|---|---|---|---|---|---|
| `60415a8a` (tip) | 132 | 38 | 77 | 2 (`ABC-072`, `ABC-147`) | 15 | 132 |
| `aeeba067` board (base) | 132 | 38 | 77 | 2 | 15 | 132 |
| `21980135` board | 131 | 38 | 76 | 2 | 15 | 131 |

- The 15 findings are `ABC-038 044 060 070 073 074 085 092 100 108 110 111 112 113 150`. They are the same
  ids the tool prints, and the 77 `qe-e2e` ids are also the same. **QE disagrees on no id.**
- The tool's `--sweep` at the tip reads `132 / 38 / 77 / 2 / 15`, malformed 0, **exit 1**. It prints every
  count line, lists each finding by id, and closes with the ceiling sentence.
- **Snapshot.** The committed `.grugops/qe-cutover-2026-08-17.txt` holds 38 id lines (304 B) and 4 `#` header
  lines. QE's own parse of the line-leading `## Done` rows of `git show 9998a544:plans/board.md` gives 38 ids.
  They are **equal as a sequence**, so they are equal as a set too.
- **The naive `ABC-<digits>` scan of the `## Done` section** reads 1217 hits / 137 distinct at `21980135`. That
  matches the page exactly. It reads **1220 / 137 at the base and the tip**, where the board has gained the
  `ABC-153` row. The brief's "1217" is the `21980135` figure.

## CLI readings (`node tools/grugops/qe-hop-integrity.js`, exit codes read from the shell)

| argv | exit | reading |
|---|---|---|
| `--ticket ABC-061` | 0 | out-of-scope (pre-cutover) (`A1` committed half) |
| `--ticket ABC-062` | 0 | out-of-scope (pre-cutover) |
| `--ticket ABC-031` | 0 | covered (qe-e2e), `quality-gate-ABC-031-qe-2026-08-17/…-dbbb1b96` (`A2`) |
| `--ticket ABC-076` | 0 | covered (qe-e2e), two notes under `quality-gate-ABC-076-qe-2026-08-17/` (`A2`) |
| `--ticket ABC-072` | 0 | security-nfr substitute, `secnfr-ABC-072/…-29849eeb` (`A9`) |
| `--ticket ABC-073` | 1 | finding (`A9`) |
| `--ticket ABC-147` | 0 | security-nfr substitute, `secnfr-ABC-147-review/…-ff01ca7a` |
| `--ticket ABC-153` | 0 | covered (qe-e2e), `qe-ABC-153/…-6b2eab82` |
| `--ticket ABC-105` | 0 | covered (qe-e2e), **only** `qe-recheck-ABC-105/…-72ae8565`, QE's pre-build note. This is the `A7` ceiling, before this hop's verdict was filed |

- The `A1`/`A3` "removed from the in-memory snapshot" halves can be reached only through the seam, not the CLI. By
  design, QE reads them through the tests (28/28) and the plants (`…bf59d633`).
- The ticket's wording does not anticipate one thing: `ABC-147`, a post-cutover row, is covered by the substitute
  label. `A4`'s table already counts it, so this is not a gap. The human at the `Done` exit judges "docs-only".
- **Engineer-shaped folders other than `ticket-to-pr-*`** (`fix-ABC-085`, `repair-ABC-033-…` and similar) name
  their ticket. The own-folder hardening does not reject them, and the page asks only for `ticket-to-pr-*`.
  Today **no** covered ticket rests only on such a folder: every covered id has a covering note under `qe*`,
  `quality-gate-*` or `secnfr-*`. This is INFO, recorded so that a later reader knows the hardening covers one
  folder shape.

## Gates at `60415a8a`, run by QE

- `npm run -s lint && npm run -s typecheck && npm run -s build && npm test` exits **0**. Biome reads "Checked 109
  files … No fixes applied." The suite has **57 files and 1771 tests, all passed**. `.test-results/last-run.json`
  has `success: true`, 0 failed, 0 pending, 0 todo.
- **Skip count:** `npx vitest run --reporter=json | jq '.numPendingTests + .numTodoTests'` reads **0**.
- **Integrity:** the `AGENTS.md` form `node tools/grugops/test-skip-integrity.js .grugops/test-skips.md
  --skip-count 0` prints `No findings.` and exits **0**. The brief's form `node tools/grugops/test-skip-integrity.js
  --skip-count 0` exits **2** with `cannot read the registry file: 0`. **The `AGENTS.md` form is the right
  one**, and the Engineer's deviation was correct.
- **`A7`:** `wc -c AGENTS.md` reads **24545** (≤ 24,576), and `AGENTS.md` is untouched by the branch. The header
  comment (lines 15–22) and the new `memory-bank/40-contributing.md` § Conventions paragraph both say
  "not proof that a QE hop ran" and "completeness check on the record", and both name `qe-recheck-ABC-105`. The
  paragraph also states the § Scope 1 convention. Neither claims to prevent self-authorship.
- **`A8`:** `git diff --numstat aeeba067 60415a8a` touches **0** files under `src/`.
