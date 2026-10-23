---
id: 20261021T142929Z-qe-e2e-observation-b1a6b8ef
kind: observation
by: qe-e2e
at: 2026-10-21T14:29:29Z
verified_by: 
confidence: high (plants in a scratch extract, raw output committed)
refs:
  - ABC-168
  - EPIC-007
  - grugops/ABC-168
  - grugops/qe-ABC-168
  - b71f8902
  - 6d27dc9e
  - c98509b3
  - A1
  - A3
  - A4
  - A7
  - ABC-042 A10
  - ADR-0016
  - QE-168-b
  - QE-168-c
  - .grugops/context/qe-ABC-168/probe/mutants.sh
  - .grugops/context/qe-ABC-168/probe/mutants-output.txt
supersedes: 
seal: sha256:5a365317f144e23bc54573e2c9c7386a3d234f8ded75da4840e00a36a976aaaf
---

# ABC-168 mutation reads: (ii), (iii), (i-b) survive the suite and are caught only by hand criteria A1/A4/A3; (i-a) and (iv-b) survive every check but review

Plants only in a scratch extract (git archive of 6d27dc9e, git-initialised, node_modules symlinked), restored by git checkout after each. Script and raw output: .grugops/context/qe-ABC-168/probe/mutants.sh, mutants-output.txt. Each plant ran npm test plus the UCI_DEEP lane, then the criterion named. Base controls: npm test 1988/1988, UCI_DEEP 0, A1 rc 1, A3 0 0 0, cli.test.ts 88/88, npm link + skytalix rc 0.
- (i-a) EPIPE arm installed after the first line's writes: npm test green, lane green, A3 0 0 0 with clean stderr. SURVIVES everything but review (an EPIPE is emitted asynchronously, so a same-tick late arm still catches it). Review at the tip: the arm (src/uci.ts sink.on) comes before createBookProbe, createUciSession and lines.on, so nothing can be written before it. ADR-0016 clause 4 holds by review.
- (i-b) arm removed: npm test and lane green; A3 catches it (head side rc 1, 1 388 bytes, 13 stack lines on stderr, x3).
- (ii) argument accepted (argv > 3): npm test and lane green; A1 catches it (rc 0, not 1).
- (iii) exception path exits 0 (exitCode = 70 removed): npm test and lane green; with a planted handleLine fault the child exits 0, not 70. Caught only by A4's review (no test seam), which reads exitCode = 70 at the tip.
- (iv-a) bin -> dist/cli.js: cli.test.ts 88/88 green (ABC-042 A10 pins bin's presence, not its value); A7's npm link bullet catches it (skytalix not linked, rc 127).
- (iv-b) bin -> src/uci.ts: cli.test.ts 88/88 green; npm link links ../lib/node_modules/skytalix/src/uci.ts and skytalix answers uciok rc 0, because the link resolves to the clone's real path outside node_modules. SURVIVES the suite and A7; only reading package.json against Scope 2 catches it. An install under node_modules (D8's premise: no type stripping there) would break. -> QE-168-b.
