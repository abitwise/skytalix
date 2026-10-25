---
id: 20261025T030857Z-software-engineer-observation-1f08c91d
kind: observation
by: software-engineer
at: 2026-10-25T03:08:57Z
verified_by: 
confidence: high: each reading run at the tip; the GitHub render is QE's
refs:
  - ABC-216
  - EPIC-006
  - ADR-0048
  - ADR-0049
  - 476c9f63
  - 71b7facf
  - bapm-cut-readme/…baffa6f8
  - owner-word-2026-10-24/…619938c5
  - README.md
supersedes: 
seal: sha256:279ef2dbe86a8073b462260da7b03b5dde77d0b1faab2536377f30a7baa0c9ed
---

# ABC-216 readings at the build tip: A1-A10 and the gates

Run by the Software Engineer at `71b7facf` (README) on `grugops/ABC-216`. A QE hop re-reads these; this is not a verdict.

- **A1:** `git diff --name-only 476c9f63 <tip>` lists `README.md` plus records under `.grugops/` only. `git ls-files README.md` prints it.
- **A2:** 86 lines (bound 100), 8 `## ` headings (bound 9).
- **A3:** first fenced block, info string `text`, before the first `## ` (line 13). 7 lines (bound 12), widest line 64 columns (bound 80), `LC_ALL=C grep -cP '[^\x20-\x7E]'` on the block = 0; whole file non-ASCII = 0. Render check: read in a monospace terminal, aligned; the GitHub render is QE's reading (not pushed).
- **A4 (fresh clone, stdin `/dev/null`, exit / stderr bytes):** clone 0 / progress text; `cd` 0 / 0; `npm install` 0 / 381 B of `npm warn install-scripts` (esbuild, fsevents not in allowScripts; the criterion sets no stderr bound on install); `npm run chess` 0 / 0; `npm run chess -- --colour black --difficulty 3` 0 / 0; `npm run chess -- --ascii` 0 / 0; `npm run build` 0 / 0, `dist/uci.js` present; `npm test` 0 / 0 (2073 passed, Duration 7.31 s); `npm run lint` 0 / 0; `npm run typecheck` 0 / 0. Every `npm run` name is a `scripts` key (`jq has`): chess, build, lint, typecheck; `npm test` is `scripts.test`.
- **A5:** flags shown `--colour --difficulty --ascii --unicode` are all in `ACCEPTED_ARGUMENTS`, every example after `--`. Range 1-7 default 5 = `EASIEST_LEVEL`/`HARDEST_LEVEL`/`DEFAULT_LEVEL`. Times 0.1/0.2/0.3/1/3/5/30 s = budgets 100/180/330/1000/3000/5000/30000 ms rounded. Commands shown are `COMMAND_TABLE` tokens. PGN sentence: written only when `outcome.reason !== null` (`src/cli.ts`), under `games/`; no `games/` appeared after the end-of-input runs. UCI reply read live: `option name OwnBook type check default true`, `option name Skill Level type spin default 5 min 1 max 7`. Node `>=22` = `engines.node`.
- **A6:** 0. **A8:** paths 0, IPv4 0, e-mail 0; one absolute URL, the repository's own HTTPS clone URL. **A9:** `AGENTS.md`, `LICENSE`, `NOTICE` all tracked. **A7:** names Apache-2.0, links `LICENSE` and `NOTICE`, says `NOTICE` lists parts under other terms; no "every file" sentence.
- **A10 gates (worktree):** lint 0, typecheck 0, build 0, `npm test` 0: 62 files, 2073 passed, 0 failed, Duration 9.01 s; `last-run.json` 2073/2073, pending 0, todo 0; skip count 0; `test-skip-integrity.js` prints `No findings.`
