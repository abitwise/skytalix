---
result: DONE
verdict: PASS_WITH_GAPS
branch: grugops/ABC-158-ar1-checks-widened
reviewed: cdf4255b
tip: a6b1577e
base: aa37f9cb
worktree: /Users/olgeroeselg/Projects/hacks/grugops-examples/wt-ABC-158
---

QE/E2E qe-ABC-158: PASS_WITH_GAPS. One commit, a6b1577e: five QE notes under
`.grugops/context/qe-ABC-158/notes/` (verdict `…d8f8e503`) plus the ticket page's "QE" section. Not touched:
plans/board.md, plans/traceability.md, src/, package.json, package-lock.json. Nothing installed. No push, no merge.
No timing reading.

A1 at cdf4255b (QE's own run, byte-equal to …901f43b6): 1 `found 0 vulnerabilities` exit 0; 2 `false`;
3 `[true,false,false,false,false]`; 4 exit 0, nothing written, no dist; 5a empty; 5b empty; 5c `node:fs`; 5d empty;
6 `node src/cli.ts`; 7 `0` and `0`. F = 40 files. Advisory pairs diff empty. md5s 076a03d7… / ed7a5b0c….
A2 6/6 and A3 6/6 on QE's own texts (…a1a81cb9), one plant per scratch copy outside the repo. The moved check
equals the record's in all 12: G1 5a, G2 5d, G3 5b, G4 5b, G5 6, G6b 7; P1 5a, P2 5a, P3 5b, P3b 5b+5c, P4 5c, P4b 5a.
A4 MET (clause (2) names checks 1-7; clause (1)'s test unchanged, not word-for-word: QE-158-e). A5 MET.
Gates at tip: lint 0 (113 files), typecheck 0, build 0, npm test 0 (58 files, 1824/1824), skip 0, integrity No findings.
UAT waiver reading: `git diff --name-only aa37f9cb...cdf4255b | grep -v '\.test\.ts$' | grep '^src/'` empty (also to a6b1577e).
Forms that move no check yet load nanoid: N1 `*.test.*`-named file, N2 src/ symlink, N3 multi-line import,
N8b typed computed process[…], N9 runtime .d.ts, N10 `*`-led line, N5 prechess, N6 .npmrc node-options,
N7 `node` bin shadow (simulated). N2 and N6 are caught by no instrumented route (N2 also passes ADR-0036 (b) quiet).
Gaps: QE-158-a/b/c/d LOW, QE-158-e/f INFO (…gap-register-c1de6771).
Left for the Orchestrator: `.grugops/queue/pending/qe-ABC-158.md` and the empty `claimed/qe-ABC-158/` (untouched).
Owed: trace row (text in the hop report); next column is the Orchestrator's call.
