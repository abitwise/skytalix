---
id: 20261021T135341Z-software-engineer-decision-e3f11766
kind: decision
by: software-engineer
at: 2026-10-21T13:53:41Z
verified_by: 
confidence: high (diff read line by line; npm ci run on the result)
refs:
  - ABC-172
  - EPIC-007
  - grugops/ABC-172
  - 0bddbb43
  - 3e617b26
  - package-lock.json
supersedes: 
seal: sha256:9a21c73e8ec2eb2a3e21b108f7d54e2223f22432562b0631477fbc834ca5122c
---

# ABC-172: lock regenerated with --package-lock-only, then npm's back-filled license line removed to hold A2

Scope 2 says regenerate `package-lock.json` with `npm install --package-lock-only`, not by hand. With npm 11.20.0 /
node v26.11.1 that produced a THREE-line change: the two `name` fields plus a new `packages[""].license: "UNLICENSED"`
(npm back-fills it from `package.json`). A2 binds the lock diff to exactly the two `name` lines, and test note 2 says
the regeneration method exists to keep it at two. I kept the criterion: regenerated, then removed the one `license`
line. No resolved version, integrity or dependency moved. Result: `git diff --numstat` lock 2/2; `npm ci` exit 0 on a
copy of the two files in a scratch dir (lock byte-identical after ci). `npm ci` was NOT run in the worktree because
its `node_modules` is a symlink to the main checkout's, and ci deletes node_modules.

Consequence: the next `npm install` on any branch will add the license line again. That is harmless and can ship with
any later lock change (ABC-168 adds keys to `package.json`). Q14 kept: `npm run chess` unchanged.
