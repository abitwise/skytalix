---
id: 20261018T211100Z-qe-e2e-observation-abc167-mutants-92d6d4e6
kind: observation
by: qe-e2e
task: qe2-ABC-167
at: 2026-10-18T21:11:00Z
verified_by:
confidence: high
refs:
  - ABC-167
  - 20261018T201100Z-qe-e2e-observation-abc167-mutants-8bb44ca0
  - .grugops/context/qe2-ABC-167/probe/mutants2.mjs
  - .grugops/context/qe2-ABC-167/probe/mutants2-file.log
  - .grugops/context/qe2-ABC-167/probe/mutants2-file-b.log
  - .grugops/context/qe2-ABC-167/probe/mutants2-lane.log
  - .grugops/context/qe2-ABC-167/probe/probe.ts
  - .grugops/context/qe2-ABC-167/probe/probe.out
supersedes:
---

# ABC-167 re-check mutants at `6922f772`: 44 run, 31 killed, 13 survived

Hand-authored and unsealed. The mutants ran on a `git archive` copy of the tip in the session scratchpad. Its `src/`
was `diff -r`-identical to the tip before and after each pass. Each mutant is one exact-string replacement in
`src/uci-session.ts`, asserted to match exactly once. Tests ran at `--testTimeout=120000` against
`src/uci-session.test.ts`, so every kill is an assertion failure, not a timeout. M40 and M42 were also run against
the whole lane (`--dir src`). The M-ids keep the first pass's patterns, from `qe-ABC-167/probe/mutants.mjs`.

## The brief's first-pass survivors: 17 of 17 killed
| mutant | killed by |
|---|---|
| M02 overhead 0 | A5-c1 |
| M03 increment dropped | A5-b1, A5-c1 |
| M04 increment not halved | A5-b1 |
| M05 `movestogo` ignored | A5-b3 |
| M06 the other side's increment | A5-b1, A5-b2 |
| M11 clock beats `movetime` | A5-b4, A5-b5 |
| M12 `ponder` does not hold | A6-d1 |
| M15 held line dropped on `go` | A6-e1 |
| M23 `searchmoves` to end of line | A7-h1 |
| M29 no C0 filter | A4-a1, A4-a2 |
| M43 `nps = nodes` | A3-h1 |
| M44 new session holds no position | A9-h1 |
| M47–M51 side-effect imports of the five fenced modules | A11-g1 (each) |

## First-pass survivors re-checked (6 still survive, as ruled)
- M09, M10 (the `max(1, …)` floor): survive. BA/PM accepted them as observationally equivalent.
- M38 (`'node:fs'`), M41 (bare `"fs"`): survive the tests. biome exits 1 on both, so the mandatory lint gate catches
  them. Accepted by the page.
- M40 (`globalThis["Math"]["random"]`), M42 (`globalThis["process"]`): survive the file and the whole lane. tsc 0,
  biome 0. The page routes these to the `In Security/NFR` hop.

## New mutants on the fix-hop code (N01–N21): 14 killed, 7 survived
- **Killed:**
  - N01 (no release on `position`) and N17 (`position` drops the held line): A6-e2.
  - N02 (no release on `ucinewgame`): A6-e3.
  - N03 (no release on `quit`): A6-e4.
  - N10 (release on every line), N11 (release on `isready`), N12 (release on ignored lines): A6-e5.
  - N04 (`valueAfter` returns the next token whatever it is), N05 (the depth/nodes/mate group reverted to
    `tokens[++index]`): A7-f1.
  - N16 (`movetime` dropped from `GO_KEYWORDS`): A7-f1 and A7-h1.
  - N18 (single-quoted `import './book-file.ts'`), N19 (`import("./line-input.ts")`): A11-g1.
  - N20 (`1e2` read as a number), N21 (`movestogo 0` accepted): A7-f3.
- **Survived:**
  - N06: the ms group (`movetime`/`wtime`/`btime`/`winc`/`binc`) reverted to `tokens[++index]`. `go movetime depth 3`
    then searches as a bare `go` at depth 5, 3 100 ms, where the tip searches depth 3 (`probe.out`).
  - N07: the `movestogo` group reverted. `movestogo depth 3` then swallows `depth`.
  - N13: `infinite` dropped from `GO_KEYWORDS`. `go depth infinite` and `go searchmoves e2e4 infinite` then write
    `bestmove` at once instead of holding it, and the later `stop` writes nothing. The tip holds in both.
  - N14 (`depth` dropped from the set) and N15 (`winc` dropped).
  - N08: the ms group does not advance the index after a value. **Equivalent:** the value is never a keyword, so
    re-reading it as a keyword hits the unknown-token branch, which is ignored silently.
  - N09: `position` releases after it parses, not before. On a refused position the order flips:
    `info string position refused…` comes first, then `bestmove`. The page says "writing it, then doing the
    command", so the tip's order is the one ruled. No row pins it.
- **What the survivors say:** A7-f1 pins "a keyword is never a value" for one group (depth/nodes/mate) and one
  following keyword (`movetime`). The rule is general, and the tip applies it generally. That is the new gap
  QE-167-i. N09 is the new INFO QE-167-j.
