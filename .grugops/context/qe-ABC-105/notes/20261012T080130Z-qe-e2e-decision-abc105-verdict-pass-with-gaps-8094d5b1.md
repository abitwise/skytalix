---
id: 20261012T080130Z-qe-e2e-decision-abc105-verdict-pass-with-gaps-8094d5b1
kind: decision
by: qe-e2e
at: 2026-10-12T08:01:30Z
verified_by:
confidence: high
refs:
  - ABC-105
  - plans/tickets/ABC-105-qe-hop-detector.md
  - N8-LANE
  - QE-105-p
  - QE-105-q
  - QE-105-r
  - QE-105-s
  - QE-105-t
  - QE-105-u
  - QE-105-v
  - QE-105-w
  - QE-105-x
  - 20261012T072546Z-software-engineer-artifact-ref-abc105-branch-files-tests-commands-d21b9cec
  - 20261012T072547Z-software-engineer-observation-abc105-sweep-at-build-tip-and-hand-count-agree-59fc8af7
  - 20261012T073610Z-qe-e2e-observation-abc105-readings-hand-count-snapshot-cli-0ff9feb3
  - 20261012T073610Z-qe-e2e-observation-abc105-plants-a3-and-break-it-bf59d633
  - 20261012T073610Z-qe-e2e-observation-abc105-security-config-blast-radius-uat-waiver-3740506e
  - 20261012T080100Z-qe-e2e-observation-abc105-n8-lane-narrow-set-met-7177253b
  - 20261012T080145Z-qe-e2e-artifact-ref-abc105-commands-and-probe-2b14a4e1
supersedes:
---

# QE `ABC-105` (post-build verdict): **PASS_WITH_GAPS**. `A1`–`A9` and Test notes 1–5 MET on QE's own readings; `N8-LANE` MET; one MEDIUM test-sensitivity gap on `A3`

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). **This is the post-build
QE verdict for `ABC-105`.** It is filed in `qe-ABC-105/`, a folder that names the ticket, as a `kind: decision`
`by: qe-e2e` note whose `refs:` names `ABC-105`, so the tool counts it.

| item | value |
|---|---|
| subtask | `qe-ABC-105` (workflow 05) |
| reviewed | `grugops/ABC-105-qe-hop-integrity`, tip `60415a8a`, code `ada10423`, base `aeeba067` |
| QE branch | `grugops/qe-ABC-105` off `60415a8a` (worktree `../wt-qe-ABC-105`); the Engineer's branch was not touched |
| agreement | every Engineer reading in `…59fc8af7` matches QE's own. The one divergence is the Engineer's "5 red" for the refs-only plant (`QE-105-t`) |

## Per criterion

- **`A1` MET.** CLI `--ticket ABC-061` exits 0, out-of-scope (pre-cutover). The seam test reads 1 with
  `ABC-061` removed and names it with "No QE verdict note was found".
- **`A2` MET.** `ABC-031` and `ABC-076` each exit 0 and name notes under their `quality-gate-…-qe-2026-08-17/`
  folders, never `ticket-to-pr-*`. The exact-element refs plant turns `A2`'s `ABC-076` pair red, as the page
  intends.
- **`A3` MET, with gap `QE-105-p`.**
  - On the committed snapshot `ABC-062` reads 0. Through the seam, with `ABC-062` removed, it reads 1, and the
    `quality-gate-ABC-066-qe` trap note does not cover it.
  - The full refs-only plant turns 4 tests red, `A3` among them.
  - **But a refs-only `coverage()` alone leaves `A3`'s tests green.** `main --ticket` opens only folders that
    name T, so it masks the missing condition. That plant makes `--sweep` false-pass 9 of the 15 findings,
    `ABC-073` included. Only `A5`'s synthetic negative goes red.
- **`A4` MET.**
  - `--sweep` at the tip reads **132 / 38 / 77 / 2 / 15**, exit 1, with each count on its own line and each
    finding by id.
  - QE's independent Python hand count agrees on **every count and every id**. QE disagrees on none.
  - The snapshot equals the 38 line-leading `## Done` ids of `git show 9998a544:plans/board.md` by QE's own
    parse, as a sequence.
  - The naive scan reads 1217 / 137 at `21980135` (matching the page) and 1220 / 137 at the base and the tip.
- **`A5` MET.** `abc031` matches `ABC-031`, and `abc0066` does not match `ABC-006`, in both the folder and refs.
  The substring plant goes red in 2 tests.
- **`A6` MET.**
  - Each of the three malformed shapes reaches the report. A missing board, a missing snapshot and an
    unreadable note each exit 2 with stderr, and plants for silent 0 or a skip go red.
  - Malformed notes at build: 0.
  - Symlink refusal is tested at the task-folder level only (`QE-105-q`).
- **`A7` MET.** The header comment and the `40-contributing.md` paragraph state the ceiling and name
  `qe-recheck-ABC-105`. Neither claims to prevent self-authorship. `AGENTS.md` is untouched at 24,545 B.
- **`A8` MET.** 0 `src/` files. Lint, typecheck, build and `npm test` exit 0 with **57 files / 1771 tests**,
  skip count 0, and integrity `No findings.` (`AGENTS.md` form).
- **`A9` MET.** `ABC-072` reads 0 with the substitute label and its `secnfr-ABC-072/` note. `ABC-073` reads 1.
- **Test notes 1–5 MET.**
  - The `A2`, `A3` and `A9` tests run on real notes.
  - Every exit-1 criterion is shown going 0 → 1, or 1 → 0 for `A4`/`A9` by grandfathering.
  - No override flag exists: `--force` and `--snapshot` plants go red.
  - The sweep is reported even when red.
  - The snapshot is pinned at 38 ids, including `061`/`062` and excluding `031`/`076`.
- **`N8-LANE` MET.** The narrow-set H − B is **+0.475 s CPU** (+0.460..+0.520), with twin R 0.010 s, sign 3/8
  and median 0.00 %. The provisional `F` is 0.092 s, so 650 ms resolves. Load1 was 5.1–5.3, logged and not
  gated. 1 file, 0 spawns.
- **Security holds.** The tool executes nothing it reads, writes nothing, imports only `node:fs`/`path`/`url`
  and makes no network call. A symlink at any level under the context root exits 2. A symlinked root is
  `QE-105-r`.
- **Config: acceptable.** `tsc` gains exactly the tool and its test. `checkJs` is off and `noEmit` is set. A
  narrower option exists (a sibling `.d.ts`), named in `QE-105-u`.
- **The Engineer's integrity-form deviation was right.** The brief's form exits 2, and the `AGENTS.md` form is
  the correct one.

## Gap register

| id | sev | gap | remedy (not QE's to make) |
|---|---|---|---|
| `QE-105-p` | **MEDIUM** | `A3`'s real-note test is blind to a refs-only `coverage()` because the `--ticket` folder filter masks it. That regression false-passes 9 sweep findings and no `A3`/`A4` test sees it | one test-only assertion: `coverage("ABC-062", readNotes(<context>) /* unfiltered */, minus("ABC-062")).status === "finding"`, and the same for `ABC-073` |
| `QE-105-q` | LOW | symlink refusal at the `notes/` and note-file levels is untested; removing either check leaves 28/28 green. The behaviour itself is right (QE probed it) | extend the `A6` symlink test to both levels |
| `QE-105-r` | LOW | a symlinked `.grugops/context` root is followed (exit 0) | `lstat` the root; or accept and say so |
| `QE-105-s` | LOW (by design) | the one-line CLI wrapper is untested (0 spawns). QE read its exit codes by hand | none required |
| `QE-105-t` | INFO | the Engineer's "refs-only → 5 red" is not reproducible: the plant's text was not recorded. QE reads 4 for the full rule and 1 for `coverage()` only | record plant text with mutation counts |
| `QE-105-u` | LOW | project-wide `allowJs` removes the `TS7016` guard for any future `.ts` → `.js` import | acceptable; the narrower option is a sibling `qe-hop-integrity.d.ts` with `allowJs` off |
| `QE-105-v` | INFO | the UAT-waiver measurement is empty, but `ABC-122` (`tools/` changing gate behaviour) was **not** waived | Orchestrator states the application, or the owner's word is asked |
| `QE-105-w` | INFO | the own-folder hardening rejects only `ticket-to-pr-*`. `fix-ABC-…`/`repair-ABC-…` folders name T and are accepted (per page). No covered id relies on one today | none; noted for a later reader |
| `QE-105-x` | LOW | `N8-LANE` content is 73 % of 650 ms and grows with the notes tree, not the code | re-read when the file is next touched |

## The `A7` ceiling, observed on this very note

- Before this note was filed, `--ticket ABC-105` exited 0 on `qe-recheck-ABC-105/…-72ae8565`, the pre-build note.
- After filing, it lists **both** covering notes: the pre-build one and this one. The reading is in
  `…2b14a4e1`.
- The tool cannot tell which one is the post-build verdict. The human at the `Done` exit has to read the paths.
  This is the `QE-105-g` ceiling working as the page says.

## Board recommendation

`In Review` → onward. QE's verdict is recorded. `QE-105-p` is a test-only, one-assertion fix with no change to
the tool's behaviour. QE recommends folding it in before merge, but it does not block; that is the Orchestrator's
call. The UAT disposition (`QE-105-v`) is the Orchestrator's and the owner's. Board and merge are not QE's.
