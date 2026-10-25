---
id: 20261025T032713Z-software-engineer-observation-f98e5d30
kind: observation
by: software-engineer
at: 2026-10-25T03:27:13Z
verified_by: 
confidence: high: every command run by the SE at 0a5862b5
refs:
  - ABC-216
  - QE-216-a
  - README.md
  - package.json
  - package-lock.json
  - 0a5862b5
  - 50b23aa4
supersedes: 
seal: sha256:83d663a8e0e8d751d886da3dd7859d5ef2fa80c5ebda3f1d93c428940a3ebbc0
---

# ABC-216 polish: gates and the fresh-clone A4 at 0a5862b5

## Worktree gates
- `npm ci --ignore-scripts`: exit 0, stderr 0 B.
- `npm run lint`, `npm run typecheck`, `npm run build`: each exit 0, stderr 0 B.
- `npm test`: exit 0, stderr 0 B, 62 files, 2073 passed of 2073. `.test-results/last-run.json`: success true, pending 0, todo 0.
- Skip-count capture (as spelled in AGENTS.md): `0`. `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: `No findings.`, exit 0.

## Page checks
- A2: 88 lines (bound 100), 8 `## ` headings (bound 9).
- A3: lines 1-9 match `50b23aa4`; widest art line 64; non-ASCII 0 in the whole file; tabs 0; trailing spaces 0.
- A6: 0. A8: personal paths 0, IPv4 0, e-mail 0; 1 absolute URL (the repo's own HTTPS clone URL). A9: `AGENTS.md`, `LICENSE`, `NOTICE` all in `git ls-files`.
- A5 Node: README "22.18 or later" = `engines.node` `>=22.18`.

## A4 on a fresh clone (`<scratchpad>/se216p/a4v/`), stdin `/dev/null`
The ten lines of the README's `sh` blocks, verbatim and in order. The one edit: the clone URL is replaced by the local branch path (the tip is not pushed). The clone checked out `0a5862b5` on `grugops/se-polish-ABC-216`.

| # | command | exit | stderr |
|---|---|---|---|
| 1 | `git clone <URL> skytalix` | 0 | 700 B (progress text) |
| 2 | `cd skytalix` | 0 | 0 B |
| 3 | `npm install` | 0 | 381 B (`npm warn install-scripts`: esbuild, fsevents) |
| 4 | `npm run chess` | 0 | 0 B |
| 5 | `npm run chess -- --colour black --difficulty 3` | 0 | 0 B |
| 6 | `npm run chess -- --ascii` | 0 | 0 B |
| 7 | `npm run build` | 0 | 0 B; `dist/uci.js` 3941 B |
| 8 | `npm test` | 0 | 0 B; 62 files, 2073/2073 |
| 9 | `npm run lint` | 0 | 0 B |
| 10 | `npm run typecheck` | 0 | 0 B |

- After `npm install`, `git status` in the clone is clean, so the lock agrees with the new `engines`.
- No `games/` folder after the three end-of-input runs. Every `npm run <name>` is a `scripts` key (`jq has`).
- UCI in the clone (`uci`, `isready`, `quit`): stderr 0 B, the `OwnBook` and `Skill Level` option lines as on the page.
- An earlier clone in `<scratchpad>/se216p/a4/` added `--branch` to the clone line. It is not counted as A4; its results were the same.
- **Node on the host: v26.11.1 only.** Nothing ran on Node 22.0-22.17 or 22.18. The 22.18 lower bound comes from ADR-0042 and ADR-0044, not from a run here: `UNKNOWN - verify`.
