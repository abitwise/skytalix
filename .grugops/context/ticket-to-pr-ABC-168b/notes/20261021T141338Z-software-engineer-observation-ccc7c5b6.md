---
id: 20261021T141338Z-software-engineer-observation-ccc7c5b6
kind: observation
by: software-engineer
at: 2026-10-21T14:13:38Z
verified_by: 
confidence: high (gate runs as listed; not a §14 verdict)
refs:
  - ABC-168
  - ABC-172
  - grugops/ABC-168
  - 8b1e1c67
  - c98509b3
  - ADR-0044
supersedes: 
seal: sha256:b3c895789402b5e66cf68894cfd635fb154e2d9a7206397bc36c3c390f0799cb
---

# ABC-168 (hop b): main moved to c98509b3 (ABC-172, package name skytalix) during the hop; merged it in (8b1e1c67) and re-ran the gates

ABC-172 changed only package.json "name" and package-lock.json on main. Merged (not rebased) into grugops/ABC-168 as 8b1e1c67, no conflict. Re-run on 8b1e1c67: lint 0, typecheck 0, build 0 (dist/uci.js answers id name skytalix), npm test 0 with 60 files / 1988 tests (last-run.json success true, 0 failed, 0 pending), skip-integrity --skip-count 0 no findings, lane-inventory no findings, UCI_DEEP 5/5, CLI_DEEP 11/11 with 6 [CLI_DEEP] children (verbose). PERFT_DEEP (32/32) and the A7 fresh-clone readings were run at 6232cfa7, not re-run after this merge: the merge touches only package.json's name. Against the new base c98509b3: diff lists package.json (+5/-1), src/cli.test.ts (+4/-2), src/uci.real-engine.test.ts, src/uci.ts (+90), tsconfig.build.json, plus .grugops records; package-lock.json unchanged.
