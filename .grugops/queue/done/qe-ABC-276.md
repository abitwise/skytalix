---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-03T15:04:34Z
subtask: qe-ABC-276
role: qe-e2e
ref: .grugops/context/qe-ABC-276/
branch: grugops/ABC-276 (8aaa584a + main merged) — worktree .claude/worktrees/se-ABC-276
width: wrap EVERY test/build run (every vitest / node --test too) in flock on the host lock (<scratch>/host-test.lock; real path in your dispatch message). One core. No games unless you judge one short real `d` run necessary for A2 (then ask first if > 10 min). Placeholders in committed files.
---
# QE verdict on ABC-276 (r/d record redaction, tools only)
Read plans/tickets/ABC-276*.md, sec-host-paths …72b4070b, se notes (…2b4795b8, …4e2084bf, …7f3f2c37).
Independently re-check A1–A7: planted host values gone after sealing (incl. realpath and symlinked forms); SHA256SUMS verifies; executed cutechess argv byte-equal at every budget and all dry-run prints byte-equal (build main's tools/rating in scratch for the before side); usage text; 0 src lines; pair-check 40/40; npm test; lint/typecheck/build. Judge the inherited <<home>> double-placeholder risk.
A2 on a real run: if a dry-run cannot exercise sealRecords on real r/d records, record it as owed to the next QE r/d reading (do not play games just for it unless trivial).
Verdict PASS / PASS_WITH_GAPS / FAIL (signs acceptance; tools only). Gaps with severity and owner.
Fences: test/records only. No push, force, amend, rebase, merge into main. Leave nothing running.
Publish: sealed notes (task qe-ABC-276, contextRoot = worktree's .grugops/context); queue moves inside your worktree; commit (Result text included); ## Result + trace row; brief + claim to done/.

## Result

**DONE: QE verdict PASS_WITH_GAPS on ABC-276.** This verdict signs acceptance (tools only, no UAT). Branch `grugops/ABC-276` at `b4f962c5` (code `f4c52d62`), against the cut `5222a9b4`. Finished 2026-11-03T15:18:12Z. Not pushed and not merged.

- **A1** MET, on real `r` / `d` records. QE ran 20 real runs in a scratch clone (cut and branch at the same path), each with a real clone, `npm ci`, build and UCI handshake of skytalix. cutechess-cli and stockfish were fake, reached through symlinks; the out dir sat under a symlinked parent. The fake cutechess-cli planted all 11 A1 values into `*.out`, the PGN and the stderr files.
  - Branch: 0 of each value remains in every record and in stdout, in 10 of 10 runs.
  - Cut: 92 (r) and 96 (d) remain, so the probe is live.
  - Only the engine's UCI `id author` (the owner's public name) is left.
- **A2** MET: `sha256sum -c` is OK in 10 of 10 runs, and each file set equals the cut's.
- **A3** MET:
  - The argv handed to cutechess-cli (a NUL dump, compared with `cmp`) is byte-equal in 10 of 10 runs: r at 4000, 500 and 100; d at default, 3000, 2500, 2000, 1500, 1000 and 100.
  - 23 `cutechessArgs` vectors are JSON-equal.
  - 22 dry-run prints are byte-equal, and 10 refusals are message-equal (stack line numbers only differ).
  - With QE's own redaction applied to the cut's records, they equal the branch's.
- **A4** MET: the row is offline and passes. Mutants M1 and M3 are killed.
- **A5** MET: 5 usage cases exit 1 with empty stdout; only usage lines 1 and 5 differ from the cut. Mutant M5 is killed.
- **A6** MET: 0 lines under src/, data/ or vitest.config.ts.
- **A7** MET: pair-check 40/40 (0 skipped). lint, typecheck and build are green. npm test: 66 files, 2 566/2 566.
- **`<<home>>` risk** judged as **QE-276-b, LOW** (owner BA/PM, then SE). It is inherited from `pair.ts` `redact` and nothing leaks.
  - A user or host named like a placeholder word yields `<<user>>` / `<<host>>`, not `<<home>>`. It also rewrites labels (user `node` turns `node:` into `<user>:`).
  - Names shorter than 3 characters are not redacted.
  - None of this occurs on this host.
- **QE-276-a, LOW** (owner BA/PM, then SE): no row covers `main()`'s seal call or its stdout redaction. M2 and M7 survive pair-check. M2 is killed by QE's real run.
- **QE-276-c, INFO** (next QE r/d reading): real cutechess output still needs `sha256sum -c` and a grep before commit. Gzipping `r.out` breaks its sums line.
- **QE-276-d, INFO:** the dry-run print keeps the out path raw (by design), and the slug form survives the word pass. ABC-277's check is the net.
- **Notes** (context-io admitAndAppend, worktree context root, 0 findings, index rendered): `20261103T151750Z-qe-e2e-decision-a79db6c1` (verdict), `…-observation-1cbc2325` (gaps), `…-observation-e65e5624` (runs).
- **Board:** the move from In Review is the Orchestrator's. No board.md edit here.
- **Nothing left running.** The node_modules symlink and the scratch dir were removed.
