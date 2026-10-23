---
id: 20261023T195412Z-architect-design-observation-26a21f7c
kind: observation
by: architect-design
at: 2026-10-23T19:54:12Z
verified_by: 
confidence: high (each item read or measured at main 06fabb18; probe in scratchpad, copied under probe/)
refs:
  - arch-design-ABC-203
  - ABC-203
  - 06fabb18
  - 4a788b92
  - ADR-0036
  - ADR-0002
  - ADR-0029
  - ADR-0040
  - src/cli.ts
  - src/result-screen.ts
  - src/book-file.ts
  - src/cli.test.ts
  - src/cli.real-engine.test.ts
  - vitest.config.ts
  - bapm-cut-pgn-export/…0c2867c1
supersedes: 
seal: sha256:8e3af7fc19a4a7731154b473900bbf4e70139e84d1256c99fa3c98d6f5524fbe
---

# What Architect/Design read and measured for ABC-203 (main 06fabb18)

1. **clause (b) baseline** (canonical instrument, 06fabb18..06fabb18): limb 1 holders src/book-file.ts, src/uci.ts; limb 2 holders src/cli.ts, src/glyph-mode.ts, src/perft-bench.ts, src/uci.ts; limb 3 none. 5 distinct holders. src/pgn-file.ts would be the sixth. security-nfr-ABC-168 …75a45be0 § 1 re-armed ADR-0036 § Decision 3 at a sixth holder or a holder taking a caller value that reaches a capability: both fire.
2. **Node fs on this host** (Node 26.11.1, macOS, non-root; probe/fs-probe.out): games regular file -> mkdir recursive EEXIST, open wx ENOTDIR; games 0555 -> mkdir ok, open wx EACCES; dangling symlink at file name -> open wx EEXIST; games symlink to dir -> followed, file lands in target; games dangling symlink -> mkdir ENOENT.
3. **Local-time Date ctor** new Date(2026,9,23,14,5,9) reads back 2026 10 23 14 5 9 under TZ +14 and -10. No TZ setting is needed in tests.
4. **vitest.config.ts pool is threads**; process.chdir in a worker thread throws ERR_WORKER_UNSUPPORTED_OPERATION (probe/chdir-worker.out). The holder tests need one spawned child.
5. **cli.test.ts** has one spawnSync site (childOf) with cwd REPOSITORY; ENTRY_POINT is absolute and hooks are data: URLs, so a mkdtemp cwd changes nothing else. npmRun needs REPOSITORY and ends by EOF. N8_SPAWN = 17+7+1+2+1.
6. **cli.test.ts A9 process census** pins 3 process.stderr and 10 \bprocess\b; the PGN failure line adds a fourth. A14 as written licenses only outcome-child pins.
7. **Frame path root** is render-seam.ts (history-pane.nfr.test.ts COMPOSITION_ROOT); the new modules are off it. LICENSED_DRIVERS = turn-loop.ts, cli.ts (ADR-0002 cl. 4).
8. **Production clock precedent**: src/uci.ts binds Date.now at its root; engine.ts/levels.ts default to Date.now. cli.ts has no clock today.
