---
id: 20261022T160319Z-software-engineer-observation-f4334765
kind: observation
by: software-engineer
at: 2026-10-22T16:03:19Z
verified_by: 
confidence: high (each command run by SE on 2026-10-22 in fresh scratch clones; outputs read)
refs:
  - ABC-198
  - AR-1
  - GHSA-qxg6-89mg-rqv8
  - GHSA-xp26-3454-mjgp
  - GHSA-9jrq-w75r-8gcw
  - GHSA-rq7h-c2jc-7f22
  - GHSA-587h-7wmj-h5pm
  - GHSA-698v-4r3x-3vcv
  - GHSA-r825-w8mm-5pxw
  - GHSA-2v37-7h3g-55p8
  - GHSA-fxqj-rqcc-2cmp
  - GHSA-68fv-2mgg-jv7q
  - 4952425a
  - a42f4bbb
  - d1a175f5
  - 20261022T154809Z-ba-pm-observation-63b88f5d
supersedes: 
seal: sha256:004346f5c5baa85636b2b22dd1b4b67e93a94e8b324656e5af9390c71f10a84e
---

# ABC-198 A1/A2/A3 readings: the lock moves exactly the 10 packages (numstat 53 53, package.json byte-equal). The audit drops 7 pairs and 3 via rows with nothing added (head: 3 pairs). `npm ci` is clean and the scope command is idempotent

Software Engineer, task `ticket-to-pr-ABC-198`, 2026-10-22. Base is `main` `4952425a`; head is `grugops/ABC-198` `d1a175f5` (lock at `a42f4bbb`). Node v26.11.1, npm 11.20.0. Fresh scratch clones were used for base and head; nothing ran in main's checkout. QE re-reads A1–A7 from its own runs. These are the builder's readings.

## A1 (the lock)
- The command was run exactly, in the worktree at `main`: `npm install --package-lock-only --ignore-scripts 'vitest@~4.1.11' '@vitest/coverage-v8@~4.1.11' 'vite@~7.3.6'`, rc 0.
- `git diff --numstat` prints `53	53	package-lock.json`, and nothing for `package.json` (`git diff --quiet` true).
- `git diff -U0 … | grep -cE '^[-+].*"version"'` prints 20. The lock's sha256 prefix is `5d48a90473834f4c`, equal to BA/PM's V5 reading (`…63b88f5d`).
- **Structural read** (node, `packages`): there are 123 entries at both ends, and exactly 10 differ.
  - These 9 moved 4.1.11 → 4.1.12: `vitest`, `@vitest/coverage-v8`, `expect`, `mocker`, `pretty-format`, `runner`, `snapshot`, `spy` and `utils`. `vite` moved 7.3.6 → 7.3.7.
  - Every other entry is deep-equal, including the root `""`.
  - Every `resolved` is on `registry.npmjs.org`, and `integrity` changed on those 10 only.
  - Inside the 10, the only other changes are `4.1.11` → `4.1.12` pins in `dependencies`/`peerDependencies`. The one exception is `vitest`'s peer `@vitest/browser-webdriverio` `4.1.11` → `^4.1.11`.
  - `vite`'s entry changes `version`, `resolved` and `integrity` only.

## A2 (the audit, pair by pair; both run the same day after `npm ci --ignore-scripts`)
- **Base** (`4952425a`), metadata `{low 0, moderate 4, high 3, critical 0, total 7}`:
  - `@vitest/coverage-v8 via:vitest`
  - `@vitest/mocker GHSA-qxg6-89mg-rqv8`
  - `@vitest/mocker GHSA-xp26-3454-mjgp`
  - `nanoid GHSA-2v37-7h3g-55p8`
  - `postcss GHSA-fxqj-rqcc-2cmp`
  - `source-map-js GHSA-68fv-2mgg-jv7q`
  - `vite GHSA-587h-7wmj-h5pm`
  - `vite GHSA-698v-4r3x-3vcv`
  - `vite GHSA-9jrq-w75r-8gcw`
  - `vite GHSA-r825-w8mm-5pxw`
  - `vite GHSA-rq7h-c2jc-7f22`
  - `vitest via:@vitest/coverage-v8`
  - `vitest via:@vitest/mocker`
- **Head** (`d1a175f5`), metadata `{low 0, moderate 1, high 2, critical 0, total 3}`:
  - `nanoid GHSA-2v37-7h3g-55p8`
  - `postcss GHSA-fxqj-rqcc-2cmp`
  - `source-map-js GHSA-68fv-2mgg-jv7q`
- **Base minus head (`comm -23`)** is exactly the 7 pairs (2 `@vitest/mocker`, 5 `vite`) and the 3 via rows the ticket names.
- **Head minus base (`comm -13`)** is empty. Nothing was added, and there is no registry drift on the day.
- `npm audit --omit=dev` at head totals 0.

## A3 (fresh clone of head)
- `npm ci --ignore-scripts` exits 0, and `git status --porcelain` is empty.
- `npm ls vitest @vitest/mocker @vitest/coverage-v8 vite --all` shows only `vitest@4.1.12`, `@vitest/mocker@4.1.12`, `@vitest/coverage-v8@4.1.12` and `vite@7.3.7`.
- Re-running the Scope 1 command adds no diff, and a plain `npm install --package-lock-only --ignore-scripts` after it adds no diff either.
