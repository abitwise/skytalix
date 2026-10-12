---
id: 20261012T073610Z-qe-e2e-observation-abc105-plants-a3-and-break-it-bf59d633
kind: observation
by: qe-e2e
at: 2026-10-12T07:36:10Z
verified_by:
confidence: high
refs:
  - ABC-105
  - A2
  - A3
  - A4
  - A5
  - A6
  - Test note 2
  - Test note 3
  - QE-105-p
  - QE-105-q
  - QE-105-r
  - 20261012T072546Z-software-engineer-artifact-ref-abc105-branch-files-tests-commands-d21b9cec
supersedes:
---

# QE `ABC-105` plants: the full refs-only rule turns `A3` red, but a refs-only `coverage()` alone leaves `A3` green and makes the sweep false-pass 9 ids

Hand-authored and unsealed (`AGENTS.md`). Every plant was a one-shot string edit to a copy of the tool in an
**out-of-repo** `git archive 60415a8a` tree in the session scratchpad. After each one, the copy was restored from
a pristine copy and checked with `cmp`. The final reading is 28/28 green and `cmp` equal. The QE worktree's
`git status --porcelain` stayed clean throughout. The instrument is `probe/plants.py`, and its raw output is
`probe/plants.out.txt` and `probe/plants2.out.txt`. The sweep column is the plant's own `--sweep` (Done / pre / qe
/ substitute / findings).

| plant | tests | red tests | sweep under plant |
|---|---|---|---|
| **`A3` refs-only, full**: drop condition 4 in `coverage()` **and** `main`'s `--ticket` folder filter | 24/28 | **4**: `A3` ABC-062 0→1; `A9` ABC-073; `A5` abc0066 negative; `A6` `--ticket` malformed domain | 132/38/83/5/6 |
| **`A3` refs-only, `coverage()` only** | 27/28 | **1**: `A5` abc0066 negative. **The `A3` tests stay green** | **132/38/83/5/6** |
| **`A3` exact-element refs** (`r === id`) | 25/28 | **3**: `A2` ABC-076 (both tests), `A5` positive (`abc031` in refs) | 132/38/76/2/16 |
| folder match as a substring (`abc006` in `qeabc0066x`) | 26/28 | 2: `A5` positive and negative | 132/38/77/2/15 |
| accept `kind: observation` | 27/28 | 1: `A5` non-decision case | 132/38/79/2/13 |
| accept T's own `ticket-to-pr-*` | 27/28 | 1: `A5` own-folder case | 132/38/80/2/12 |
| follow a symlinked **task folder** | 27/28 | 1: `A6` symlink refusal | unchanged |
| follow a symlinked **`notes/` dir** | **28/28** | **0** | unchanged |
| follow a symlinked **note file** | **28/28** | **0** | unchanged |
| naive Done parse, every `ABC-\d+` hit | 26/28 | 2: `A4` partition; `parseDone` shape | 1220/235/827/17/141 |
| naive Done parse, distinct hits | 27/28 | 1: `parseDone` shape | 137/38/77/2/20 |
| silent "## Done" on a missing board | 27/28 | 1: `A6` missing-file exits 2 | unchanged |
| silent empty snapshot on a missing file | 27/28 | 1: `A6` missing-file exits 2 | unchanged |
| `--force` accepted | 27/28 | 1: Test note 3 vector | unchanged |
| `--snapshot <x>` accepted | 27/28 | 1: Test note 3 vector | unchanged |
| any author counts as `qe-e2e` | 26/28 | 2: `A3` ABC-062; `A9` ABC-072 label | 132/38/86/0/8 |
| malformed notes ignored | 24/28 | 4: all `A6` malformed cases | unchanged |
| unreadable note skipped | 27/28 | 1: `A6` unreadable exits 2 | unchanged |
| `main`'s `--ticket` folder filter removed only | 27/28 | 1: `A6` `--ticket` malformed domain | unchanged (behaviour-neutral) |

## What this shows

- **`A3` earns its keep only against the full refs-only rule.** Condition 4 is enforced **twice**:
  `coverage()` checks it at line 193, and `main --ticket` filters it at line 269 by opening only folders that
  name T. `A3`'s real-note test goes through `main --ticket`, so the filter masks a `coverage()` that has lost
  condition 4.
- **That regression is real in the sweep.** With only line 193 removed, `--sweep` turns **9 of the 15 findings**
  into false covers: `ABC-038 044 073 074 085 108 111 112 113`. `ABC-073` becomes a false substitute pass through
  `secnfr-ABC-072`, which is exactly the `A9` trap.
- No test pins the sweep's counts or ids. The page set this out deliberately for `A4` ("not a pinned test"),
  and the `A4` test asserts only the partition and the 38.
- The plant **is** caught, by one test: `A5`'s synthetic `abc0066` negative. The suite therefore does go red.
  But the criterion that "earns the ticket" is not the one that sees it. Gap **`QE-105-p` (MEDIUM)**.
- **Exact-element refs** is caught as the page intends, by `A2`'s `ABC-076` pair.
- **The Engineer's mutation counts.** The Engineer recorded "5 red" for refs-only (`…d21b9cec`). QE reads **4**
  for the full rule and **1** for the `coverage()`-only rule. The Engineer's plant text is not recorded, so
  the shapes cannot be compared. QE's **3** for exact-refs matches the Engineer's 3.
- **Symlinks.** The tool's refusals at the `notes/` and note-file levels exist. QE hand-probed both
  (`probe/symprobe.mjs`): each exits **2** with "refusing to follow the symbolic link …" under `--sweep` and
  `--ticket`. But **no test covers either level**. Removing either check leaves 28/28 green. Gap **`QE-105-q`
  (LOW)**.
- **A symlinked `.grugops/context` root.** If the root itself is a symlink, the tool follows it: exit 0, reading
  the notes it points at. That is outside the page's literal "out of `.grugops/context/`". Gap **`QE-105-r`
  (LOW)**.
- **Test note 3** holds: `--force`, `--skip`, `--allow` and `--snapshot` each exit 2 with the usage line, and a
  plant accepting `--force` or `--snapshot` goes red.
