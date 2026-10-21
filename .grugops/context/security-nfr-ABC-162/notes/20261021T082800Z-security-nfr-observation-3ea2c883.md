---
id: 20261021T082800Z-security-nfr-observation-3ea2c883
kind: observation
by: security-nfr
at: 2026-10-21T08:28:00Z
verified_by: 
confidence: high
refs:
  - ABC-162
  - ABC-095
  - AR-095-CWD
  - AR-162-FALLBACK
  - AR-095-READ
  - AR-095-L1UNIT
  - QE-095-a
  - G-1
  - G-2
  - G-3
  - V5.3.2
  - V12.3.1
  - ADR-0036
  - EPIC-006
  - NFR-008
  - grugops/ABC-162
  - 3d05e230
  - 51503331
  - grugops/qe-ABC-162
  - 91f18689
  - src/cli.real-engine.test.ts
  - src/book-file.ts
  - plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
  - 20261021T082210Z-qe-e2e-observation-567002e7
  - 20261021T082220Z-qe-e2e-observation-df4fc9ed
  - 20261021T082240Z-qe-e2e-decision-68554c31
  - 20261012T153000Z-security-nfr-decision-s3-result-pass-with-risks-qe095a-qe095e-ruled-b65b11b7
supersedes: 
seal: sha256:ca4f1036fd63f86125091ec547c78465c981d383a782ec4bd46cfaee4370b61b
---

# `ABC-162` security surface at tip `3d05e230`: test-only, and the neutral-cwd temp directory raises no L1 concern. The AR-095 records cite an ASVS 4.0.3 id

This reading is Security/NFR's own. It was taken on `main` against the commits by `git show` and `git diff`, and in a scratch directory outside the repository. No worktree was edited. No timing was taken. ASVS L1, `block_on: high`, no compliance regime.

## 1. The change is test-only (confirmed)
- `git diff --name-only 51503331 3d05e230` lists exactly `src/cli.real-engine.test.ts`, with 36 lines added and 9 removed.
- `git diff --name-only 51503331...3d05e230 -- src | grep -vE '\.test\.ts$|__snapshots__'` prints nothing (grep rc 1).
- `src/book-file.ts` at the tip still reads one fixed path, resolved from its own module URL. Its diff against base is empty, and base `51503331` is an ancestor of `main`.
- QE's branch `91f18689` adds only notes and the page section over the tip.
- **So `ADR-0036` § S1 Ruling 2 does not fire.** No limb-1 holder changed at either end. No production capability moved, so the attack surface did not change.

## 2. The temp directory (`mkdtemp` under `os.tmpdir()`, removed by its exact path): no concern at L1
The code at the tip (`src/cli.real-engine.test.ts:449-456`):
- `neutral = mkdtempSync(join(tmpdir(), "abc162-neutral-cwd-"))` in `beforeAll`;
- the child is spawned with `cwd: neutral` and nothing else;
- `afterAll` runs `if (neutral !== undefined) removeCopy(neutral)`, where `removeCopy` is `rmSync(path, { recursive: true, force: true })` on exactly the path `mkdtemp` returned;
- the test never writes into `neutral`.

My own probe, in scratch on Node `v26.11.1` (macOS):
- `os.tmpdir()` is `/var/folders/…/T`, a per-user directory with mode `0700`, owned by uid 501, the running user.
- `mkdtempSync` creates the directory with mode **`0700`** and a random 6-character suffix. Two calls gave `DuVx1U` and `3CJatw`.
- **No symlink follow inside.** I planted a symlink to a victim directory inside a `mkdtemp` directory, with a decoy `data/opening-book/book.json` beside it, then ran `rmSync(recursive, force)`. The directory was gone and the victim's file **survived**.
- **No follow when the path itself is a link.** I replaced a `mkdtemp` path with a symlink to the victim and ran the same `rmSync`. The link was removed and the victim's file **survived**.

Why this holds:
- **Shared temp directory (Linux `/tmp`, mode 1777).** `mkdtemp(3)` creates the directory atomically and fails rather than reuse an existing name. Its suffix is unpredictable and its mode is `0700`. So another user cannot pre-plant the path or write inside it. The sticky bit stops them renaming or removing it, so they cannot swap it for a link between creation and removal.
- **Symlinks.** Removal does not follow links, so even a same-user plant cannot redirect deletion outside the directory.
- **Who can still interfere.** Only the same user, through `TMPDIR` or direct writes. That user already holds the user's full privileges, so this is outside the threat model. `TMPDIR` inside the tree is QE's `G-3` (INFO), and it bears on the detector, not on safety.
- **Failure paths.** If `mkdtemp` throws, `neutral` stays `undefined` and nothing is removed. If the spawn throws or hangs, `afterAll` still removes the directory. QE traced this with the hang plant (`…df4fc9ed`).
- **The checklist.** The pinned ASVS 5.0.0 checklist has no L1 temp-file requirement. The nearest L1 requirement, `V5.3.2` (file paths come from internally generated or trusted data), is met: the path comes from `mkdtemp`. The file is also test code that ships nowhere.

## 3. The ASVS id cited for `AR-095-CWD`'s class is the 4.0.3 id
- The S3 decision `…b65b11b7` and the `ABC-095`/`ABC-162` pages cite **`V12.3.1` [L1]** as "no file path from an untrusted source". That is ASVS **4.0.3** numbering.
- The kit's pinned checklist is ASVS **5.0.0**. There, `V12.3.1` is TLS for all connections [L2], and the matching requirement is **`V5.3.2` [L1]**.
- **The ruling does not change.** It is still an L1 file-path requirement, met at the tip.
- **The citation should read `V5.3.2` from now on.** Earlier notes are not edited. This note and the decision in this task carry the correction.
