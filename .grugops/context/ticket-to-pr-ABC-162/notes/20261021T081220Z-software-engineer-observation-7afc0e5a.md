---
id: 20261021T081220Z-software-engineer-observation-7afc0e5a
kind: observation
by: software-engineer
at: 2026-10-21T08:12:20Z
verified_by: 
confidence: high
refs:
  - ABC-162
  - ABC-095
  - AR-095-CWD
  - QE-095-a
  - grugops/ABC-162
  - 3d05e230
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-162-the-real-engine-book-child-runs-from-the-tree-root-so-a-cwd-relative-book-read-passes.md
  - P6b
  - 20261017T125103Z-ba-pm-observation-cut-followups-readings-85e8dfdd
  - 20261012T151200Z-qe-e2e-decision-abc095-verdict-pass-with-gaps-ee8775a2
supersedes: 
seal: sha256:9b896462ea30406d5bbdfef467fb85defbd683c31f7c804fdfdffa9efded7c1e
---

# `ABC-162` criteria at tip `3d05e230`: `A1`–`A4` MET on the SE's readings, and P6b goes green → red on `A7` alone

Plants went only into `git archive` copies in the session scratchpad, outside the repository, with `node_modules` symlinked. Both copies are removed. Each lane ran with `--silent=false --reporter=verbose` so the `[CLI_DEEP]` lines are visible.

| # | reading | result |
|---|---|---|
| `A1` | head `CLI_DEEP`: `A7`'s line reads `(cwd …/T/abc162-neutral-cwd-XXXXXX)`, not the tree root. `A7` asserts `join(neutral,"/") !== join(REPOSITORY,"/")`, that `existsSync(join(neutral,"data"))` is false, a book reply, stderr `""` and exit 0 | **MET**: 11/11 green on the uncommitted head and again at tip `3d05e230` |
| `A2` | P6b (`readFileSync("data/opening-book/book.json")` at `src/book-file.ts:16`), **base** test (`51503331`) | **green 11/11**: the gap, shown first |
| `A2` | P6b, **head** test (byte-identical to the tip's, `cmp`) | **red: 1 failed / 10 passed**. The only failing row is `A7`, at `:510` `expect(booked.stderr).toBe("")`, receiving `opening book could not be read; playing on without it` |
| `A3` | every `os.tmpdir()` path named on a `(cwd …)` line of the head green run, the P6b head run and the tip run, checked one by one | **0 exist** (6 of 6 gone: 3 `abc095-book-absent-*`, 3 `abc162-neutral-cwd-*`) |
| `A4` | `git diff --name-only 51503331 3d05e230` | exactly `src/cli.real-engine.test.ts`; the production-`src/` grep is empty |
| `A4` | `npm test` base vs tip | 59 / 1987 vs **59 / 1987**, skips 0 / **0** |
| `A4` | `CLI_DEEP` count base vs tip | 10 deep (+1 default) vs **10 deep (+1 default)** |
| `A4` | `CLI_DEEP` children base vs tip (count of `[CLI_DEEP]` lines) | 6 vs **6** |

**Census caveat:** one glob census after the P6b head run counted 1 `abc095-book-absent-*` entry. It was not this run's copy (`…hbHs7r` was already gone), and it was gone seconds later. It was a parallel agent's live copy. That is why `A3` is read by exact path, not by glob count.

**Owed to QE (page Test note 3):** the re-plant of P6b, which is `AR-095-CWD`'s close condition. The Orchestrator records the close.
