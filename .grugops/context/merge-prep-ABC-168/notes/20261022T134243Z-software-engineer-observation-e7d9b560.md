---
id: 20261022T134243Z-software-engineer-observation-e7d9b560
kind: observation
by: software-engineer
at: 2026-10-22T13:42:43Z
verified_by: 
confidence: high (runs as listed, on 243c2fdf; not a §14 verdict; no timing taken)
refs:
  - ABC-168
  - grugops/ABC-168
  - merge-prep-ABC-168
  - a7857e0b
  - a2c5f673
  - 243c2fdf
  - ABC-187
  - ABC-109
  - NFR-008
supersedes: 
seal: sha256:224f1955a6a4836f51c08e7198fcd02653d3a84de65dadd0b1fe05a2d2fd6d8c
---

# Gates and re-checks on the merged tip 243c2fdf

- lint 0, typecheck 0, build 0 (`rm -rf dist` first).
- `npm test` exit 0: **60 files / 1995 tests** passed. That is main's 59/1994 plus `src/uci.real-engine.test.ts`'s one default-lane test. `.test-results/last-run.json` reads success true, 1995/1995, 0 failed.
- Skip-count capture as spelled (heap 128, `--reporter=json | jq`): **0**. `test-skip-integrity.js .grugops/test-skips.md --skip-count 0`: "No findings.", exit 0.
- Lanes (heap 400, one file each): CLI_DEEP 11/11, UCI_DEEP 5/5 (1 default + 4 deep), PERFT_DEEP 32/32, each exit 0. Run beside the ABC-196 hop, so no timing is claimed.
- **AGENTS.md byte guard:** `wc -c AGENTS.md` = **16,305 B**, at most the 18,432 B constant (ABC-187). The ABC-109 row passes inside npm test. 16,305 = main's 15,821 + Scope 5's 484.
- **A7 (engineer's tree, not QE's fresh clone):** `dist/` holds 22 .js files, with no `*.test.js`, `cli.js` or `line-input.js`. `turn-loop.js`, `history.js`, `frame.js` and `render.js` are present as type-only emits. `grep -l 'import(' dist/*.js` prints nothing. The first line of `dist/uci.js` is `#!/usr/bin/env node`. `printf 'uci\nquit\n' | node dist/uci.js` gives id name skytalix … uciok, exit 0. `git check-ignore dist/uci.js` prints dist/uci.js. Away from the clone (cp -R to scratch, rm -f of the four emits) it gives one `info string` book warning and `bestmove g1f3`, exit 0. `npm link` was not re-run (a global side effect): UNKNOWN - verify at this tip.
- **A11:** the ADR-0044 D2 "no edit" list (13 files) shows no diff at c98509b3..tip, main..tip or c98509b3..main. On `git diff --numstat main tip -- 'src/cli*.test.ts'`, only `src/cli.test.ts` shows a diff, 5/3: Scope 6's 4/2 plus the QE-187-a comment's 1/1. The pin is still armed: with `bin` deleted from package.json, `src/cli.test.ts` gives 1 failed / 94 passed, and the only red is ABC-042 A10. package.json was restored (`git checkout`), leaving a clean tree.
- **Fence, main..tip (excluding .grugops):** AGENTS.md, memory-bank/90-agents-md-command-log.md, package.json, src/cli.test.ts, src/uci.real-engine.test.ts, src/uci.ts, tsconfig.build.json. package-lock.json is unchanged.
