---
id: 20261021T115430Z-software-engineer-decision-1027e5a6
kind: decision
by: software-engineer
at: 2026-10-21T11:54:30Z
verified_by: 
confidence: high
refs:
  - ABC-184
  - AR-183-CWDARG
  - grugops/ABC-184
  - 5277babd
  - 442d1e57
  - src/cli.real-engine.test.ts
  - plans/tickets/ABC-184-a7-asserts-the-booked-child-spawned-from-neutral.md
  - 20261021T134100Z-security-nfr-decision-41f70925
  - 20261021T102658Z-ba-pm-decision-f5fcdaf5
supersedes: 
seal: sha256:c90b4ef08a91cfff00cef545f7679dfe5a727e48f5d63c04c44faea0299ef276
---

# ABC-184 SE: Security/NFR's fix shape (`…41f70925` § 2), as written, in `src/cli.real-engine.test.ts` only

- **Field:** `interface RealChild` gains `readonly cwd: string` with a one-line doc comment (`:230-231`). It records the `cwd` argument handed to `spawnSync`, verbatim: not a `realpath`, and not read from the child.
- **Record:** `spawnNode` returns `cwd` (shorthand, `:268`), which is the same identifier it passes as `spawnSync`'s `cwd` option (`:247`). `spawnReal` is unchanged, so its `cwd = root` default flows through.
- **Assertion:** in A7's `it`, directly under the kept `:497`→`:500` `"A7's working directory"` line (`:501-504`): `expect(booked.cwd, "AR-183-CWDARG: the booked child must spawn from neutral, or the detector runs from the tree root and is disarmed").toBe(neutral)`. It sits above the decoy checks and the stderr detector (now `:549-552`).
- **Placement reason:** it is the first assertion that can tell TCWD apart, and it does not depend on the child's output. Under TCWD + P6f it fails before anything that reads stdout.
- **Not done (fenced):** no production edit, no new spawn, test, `mkdtemp` or removal, no assertion on the other children, and no `ABC-180`/`ABC-183` wording moved. The INFO residual stays as the page states (a plant that edits only the `spawnSync` option inside `spawnNode` survives).
- Diff +7/−0, one commit `442d1e57` on `grugops/ABC-184` from `main` `5277babd`. At base the test file is byte-identical to `69610c5b` (sha256 `8a84dfa3…`).
