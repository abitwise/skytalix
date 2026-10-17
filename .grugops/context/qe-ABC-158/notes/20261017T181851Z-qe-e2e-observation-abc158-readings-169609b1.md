---
id: 20261017T181851Z-qe-e2e-observation-abc158-readings-169609b1
kind: observation
by: qe-e2e
at: 2026-10-17T18:18:51Z
verified_by:
confidence: high
refs:
  - ABC-158
  - AR-1
  - ADR-0036
  - 20261017T180500Z-release-manager-decision-ar1-restated-901f43b6
supersedes:
---

# QE `ABC-158`: checks 1–7 at tip `cdf4255b`, re-run by QE. Every reading equals the record byte for byte

Hand-authored and unsealed (`AGENTS.md`: no `finding` is admissible on this install). Worktree `wt-ABC-158`, branch
`grugops/ABC-158-ar1-checks-widened`, tip `cdf4255b`, base `aa37f9cb`. `node_modules` is a symlink to the main checkout's
tree. Node v26.11.1, npm 11.20.0, `/usr/bin/grep` = BSD grep 2.6.0-FreeBSD (this shell's `grep` and `diff` are
wrappers, so I called `/usr/bin/grep` and `/usr/bin/diff` by path). I took the commands from `…901f43b6`'s `A1` table,
with `\|` read as `|`, and ran them as one script (`…commands-f3551fc8`). Nothing was installed or fixed.

| # | QE reading at `cdf4255b` | record (`…901f43b6`) | same? |
|---|---|---|---|
| file set `F` | 40 files; identical to `ls src/*.ts \| grep -v '\.test\.ts$'` | 40, the same 40 | yes |
| 1 | `found 0 vulnerabilities`, exit 0 | same | yes |
| 2 | `false` | `false` | yes |
| 3 | `[true,false,false,false,false]` | same | yes |
| 4 | `npm run -s build` exit 0; the file list outside `node_modules`/`.git` is md5-identical before and after; no `dist/` | exit 0, emits nothing | yes |
| 5a | empty | empty | yes |
| 5b | empty | empty | yes |
| 5c | `node:fs` | `node:fs` | yes |
| 5d | empty | empty | yes |
| 6 | `node src/cli.ts` | same | yes |
| 7 | `0` and `0` | `0` and `0` | yes |

An unplanted scratch copy (`git archive cdf4255b`) reads byte-identical to the worktree (`/usr/bin/diff` exit 0).

**The note's side claims also hold:**
- 5b without the comment filter prints exactly one line, `src/book-file.ts:8: * path. Nothing runs at import (\`N-LOAD\`)…`.
- The only `../` in the set is `new URL("../data/opening-book/book.json", import.meta.url)` at `src/book-file.ts:16`,
  which is not a specifier, so 5d does not print it.
- The only files under subdirectories of `src/` are two `__snapshots__/*.snap` files, which are outside `F`.
- No `.npmrc` exists in the tree.

**Clause (1) re-read.** `npm audit --json | jq -r '…@tsv'` (2026-10-17, between 18:05Z and 18:19Z) gives `nanoid high GHSA-2v37-7h3g-55p8 <3.3.18`,
`postcss moderate GHSA-fxqj-rqcc-2cmp <=8.5.22`, `source-map-js high GHSA-68fv-2mgg-jv7q 1.0.0 - 1.2.1`. The
(package, id) pairs diff empty against the record's advisory table. Clause (1) is quiet.

**Manifests.** md5 `package.json` `076a03d7955198d9219e997a9d929291` and `package-lock.json`
`ed7a5b0c455a3cc59fd76a686192c7b8`, the same as the record. The reason block (`> **No package from the npm tree…`)
diffs empty against `…718112dd`'s.
