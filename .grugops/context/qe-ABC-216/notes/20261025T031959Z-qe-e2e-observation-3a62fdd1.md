---
id: 20261025T031959Z-qe-e2e-observation-3a62fdd1
kind: observation
by: qe-e2e
at: 2026-10-25T03:19:59Z
verified_by: 
confidence: high: each reading run by QE at e829436a; GitHub render is the owner's look after his push
refs:
  - ABC-216
  - EPIC-006
  - ADR-0048
  - ADR-0049
  - README.md
  - 16c14409
  - e829436a
  - 476c9f63
  - 71b7facf
  - ADR-0047
  - ticket-to-pr-ABC-216/…b31fcae0
supersedes: 
seal: sha256:97c03e8a6ce8e496cca2434bec36ca25f4a886bd75c239bb14fde79c3f048ec5
---

# ABC-216 QE page checks: A1-A9, plants, the render, and the SE's one deviation

## Criteria (all hold)
- **A1:** `git diff --name-only 476c9f63 16c14409` = `README.md` + 5 files under `.grugops/context/ticket-to-pr-ABC-216/`. `main..e829436a` lists the same 6. `git ls-files README.md` prints it.
- **A2:** 86 lines (bound 100); 8 `## ` headings (bound 9).
- **A3:** first fence at line 1, info string `text`, closes at line 9; first `## ` at line 13. Art 7 lines (bound 12). Widths 10/56/64/64/63/64/34, max 64 (bound 80). `LC_ALL=C grep -P '[^\x20-\x7E]'` on the block: 0 lines; whole file: 0; tabs 0; trailing spaces 0; file ends in one newline. No line in the block opens a fence, and the one backtick (line 5) is literal inside a fenced block.
- **A3 render (a reading):** viewer = a column-by-column check under a 64-column ruler in a monospace terminal. Rook walls at columns 3 and 9, base at 2-10 and 1-11, merlons at 2/6/10. Each wordmark letter's strokes line up across rows: s 16-20, k 22-27, y 29-35 (descender row 8, 30-34), t 37-41, a 43-49, l 51-53, i 55-57, x 59-64. Aligned. GitHub's render after the owner pushes is his look: `UNKNOWN - verify`.
- **A3 provenance:** the build note names the method. See finding QE-216-e for its wording.
- **A4:** see the gates note. All ten commands exit as the criterion requires.
- **A5:** flags shown (`--colour`, `--difficulty`, `--ascii`, `--unicode`) are in `ACCEPTED_ARGUMENTS`; both examples put them after `--`. Range 1-7, default 5 = `EASIEST_LEVEL`/`HARDEST_LEVEL`/`DEFAULT_LEVEL` (and `DEFAULT_DIFFICULTY`). Times 0.1/0.2/0.3/1/3/5/30 s = `budgetMs` 100/180/330/1000/3000/5000/30000 rounded to 0.1 s. `moves`, `undo`, `resign`, `quit`, `help` are `COMMAND_TABLE` tokens (8 in the table). SAN and coordinate input: `src/move-input.ts`. PGN: `src/cli.ts` writes only when `outcome.reason !== null`, to `games/` relative to the working directory, which `npm run` sets to the clone; `quit` and end of input write nothing (`ADR-0047`). UCI options = the two `option name` lines of `src/uci-session.ts`, read live too. Node "22 or later" = `engines.node` `>=22`.
- **A6:** 0.
- **A7:** names Apache-2.0, links `LICENSE` and `NOTICE`, says some parts are under other terms and `NOTICE` lists them; the two named parts match `NOTICE`. "every file / all files / entire" count 0.
- **A8:** personal paths 0, IPv4 0, e-mail 0. Absolute URLs: 1, the repository's own HTTPS clone URL, matching the origin remote's HTTPS form. SSH form: 0.
- **A9:** 3 relative links (`AGENTS.md`, `LICENSE`, `NOTICE`); `git ls-files --error-unmatch` lists all 3.

## Plants (scratch copies in `<scratchpad>/qe216/plant/`, all removed)
- A8: a made-up home-directory path line turns the path count 1. Also: a `~/` line → 1; an IPv4 line → 1; an e-mail line → 1.
- A6: an `npx skytalix` line → 1.
- A3: one non-ASCII glyph in an art line → 1 hit; a tab → 1 hit; a widened art line → width 81.
- The copy compared equal to the README after the last plant was removed.

## The SE's one deviation: the clone line names its folder (`… skytalix.git skytalix`)
**Accepted.** For the public URL, git's default folder is already `skytalix`, so a visitor gets the same result. With the folder named, `cd skytalix` stays true under A4's local-path substitution. It is still one runnable command that changes no fact.
