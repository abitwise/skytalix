---
id: 20261021T143852Z-qe-e2e-observation-b595ae1a
kind: observation
by: qe-e2e
at: 2026-10-21T14:38:52Z
verified_by: 
confidence: high (scratch exports, outside the repo)
refs:
  - ABC-187
  - grugops/ABC-187
  - grugops/qe-ABC-187
  - 9578481f
  - 494f7862
  - 65ee533d
  - 4890782a
  - 8918b07a
  - src/cli.test.ts
supersedes: 
seal: sha256:4df81d4441efe3640a08deaf5cb256f85f562a54ca2e75502c8f05d645d9cff5
---

# ABC-187 A2: the guard has teeth at the byte boundary; A3: the real file passes

Each run used `git archive <sha> | tar -x` into the session scratchpad, outside the repo, with a private `TMPDIR` and `node_modules` symlinked in. Padding was `0x20` at the end. Command: `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/cli.test.ts -t "ABC-109"`.
- base `8918b07a` @ 18,433 B: `1 passed | 87 skipped`. @ 18,432 B: 1 passed. Real file (15,606 B): 1 passed.
- head `4890782a` @ 18,433 B: `1 failed | 87 skipped`, with the message `AGENTS.md bytes against its 18432 B budget (ABC-109): expected 18433 to be less than or equal to 18432`, exactly as the page states. @ 18,432 B: 1 passed. Real file (15,606 B): 1 passed.
- Extra probe at head (bytes, not characters): the real file plus one `€` and 1,412 `é` = 18,433 B and 16,923 characters. Result: 1 failed with the same message. The guard counts bytes.
