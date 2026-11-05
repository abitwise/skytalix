---
id: 20261105T192123Z-qe-e2e-decision-da060cef
kind: decision
by: qe-e2e
at: 2026-11-05T19:21:23Z
verified_by: 
confidence: high: a pre-registration; arms rebuilt and compared, nothing run
refs:
  - qe-ABC-307
  - ABC-307
  - EPIC-011
  - ABC-154
  - AR-154-TWO-POINT-CONTROL
  - ADR-0046
  - ADR-0035
  - NFR-008
  - R-N8H-1
  - R-CEN-1
  - T-QEHOP-GROWTH
  - R-307-b
  - R-307-c
  - se-ABC-307/20261105T141420Z-software-engineer-decision-49e3755f
  - se-ABC-307/20261105T141420Z-software-engineer-observation-dba5335f
  - se-ABC-307/20261105T141420Z-software-engineer-observation-045800a8
  - arch-ABC-307-reads/20261105T134134Z-architect-design-decision-727e0d0c
  - arch-ABC-307-reads/20261105T134134Z-architect-design-observation-f8c13d49
  - arch-ABC-307-reads/20261105T130959Z-architect-design-decision-5c65a408
  - orch-2026-10-30a/20261105T134300Z-orchestrator-decision-db111535
  - orch-2026-10-30a/20261105T135350Z-orchestrator-decision-ad217a34
  - secnfr-census-1105/20261105T115526Z-security-nfr-decision-b9038a14
  - src/cli.test.ts
  - src/uci-session.test.ts
  - src/book.test.ts
  - tools/grugops/qe-hop-integrity.test.ts
  - grugops/ABC-307
  - grugops/qe-ABC-307
  - e01d39b1
  - 797bb1a5
  - 47556083
  - qe-ABC-307-a9
  - qe-ABC-307/20261105T142445Z-qe-e2e-decision-e4ce81fb
  - qe-ABC-307/20261105T152140Z-qe-e2e-observation-46d3b23c
  - qe-ABC-307/20261105T152735Z-qe-e2e-observation-43927eb6
  - orch-2026-10-30a/20261105T152827Z-orchestrator-decision-b17275dd
  - orch-2026-10-30a/20261105T191803Z-orchestrator-decision-5571c5a1
supersedes: 
seal: sha256:9f77804b64ae4871a853309f32c20db8217f423b0ae82ebaca9bad54fb0a3b85
---

# qe-ABC-307-a9 PREREG: A9 read again on `…b9038a14`'s void rule, after two voids. Sealed and committed before any slot poll or run

QE/E2E, task `qe-ABC-307`, brief `qe-ABC-307-a9`, under `…b17275dd` and `…5571c5a1`. **No test, build or engine run has happened in this hop, and no slot poll.** A1 to A5, A7 and A8 stand on `…19f6c80a` and `…d356030c` and are not re-run.

**One thing done before this seal, stated:** two plain `ps` looks while orienting, at about 19:18:46Z and 19:20:20Z, each showing the foreign `grugops` vitest `…5571c5a1` named. Those were looks, not the gate: no lock taken, no sample counted, and they decide nothing here. The brief said no poll before the seal, so they are recorded.

## The two voids this read follows
- **Read 1, `…46d3b23c`:** 15:17:00Z, rounds 2, 3 and 4 flagged, a foreign vitest seen. Void under every rule on record.
- **Read 2, `…43927eb6`:** 15:21:56Z, round 3 flagged, B's run on CPU alone, 9.70 s against 8.90 s, no foreign vitest in 84 samples, source `UNKNOWN - verify`. Void under the any-round line `…e4ce81fb` sealed. **It stays void (`…b17275dd`).**
- `n8-grade.py` was run on neither. No figure from either read is used here, as a baseline or otherwise. Raw stays at `raw/n8-r1/` and `raw/n8-r2/`.

## Arms, harness, scripts
- **Arms as `…e4ce81fb`'s A9:** B = `e01d39b1`, H = `797bb1a5`, H2 = `cp -a` of H. **The old arms were gone from `<scratch>/qe307`, so I rebuilt them** by `git archive` in `<scratch>/qe307/arms`, `node_modules` borrowed by symlink from the repository's checkout (dated 10-28, before both reads). B holds 19 115 files and H 19 131, each its commit's count. `diff -r --no-dereference H H2` is clean, so H2 is byte-identical. All expect 71 files, 2 709 passed, 0 skipped, 0 failed.
- **Lane inputs:** `git diff --name-only e01d39b1 main` over `src tools package.json package-lock.json vitest.config.ts tsconfig.json AGENTS.md data biome.json` is empty at `main` `54cf8334`, and empty from `797bb1a5` to the branch. `…b17275dd` lets the read stand on the branch with H's lane inputs equal.
- **Harness unchanged:** `npm test` as spelled, one fresh process a run, rotated B H H2 / H H2 B / H2 B H, round 0 discarded, until 8 complete scored rounds or 12 rounds, stage clock 1 200 s, load1 ≤ 8 before each run, every output checked non-empty. One lock hold, alone.
- **sha256 prefixes, each `cmp`-equal in `<scratch>/qe307/scripts` and `raw/scripts/`:** `n8.sh` 322833c6, `stage.inc.sh` a5b44278, `fsample.sh` 705353d6, `flags.py` 96ee7bc0, `n8-grade.py` fcb2c2d0, `reread.sh` 24a3ae41, `a9-read.py` 06ae3ca0. All seven equal `…e4ce81fb`'s.
- **Script change: none to those seven. One addition, `a9-sens.py` 1c8897ec**, reads only. Reason: `flags.py`'s sensitivity gives arm medians, and the target is a paired figure, so with a flagged round kept the sensitivity needs H − B on the same rounds. It decides nothing.
- **New output directory:** `<scratch>/qe307/out/n8-r3`. The one re-read, if any: `<scratch>/qe307/out/n8-r4`.

## The void rule, fixed by `…b17275dd` before any new figure
This replaces `…e4ce81fb`'s any-round line, for this read on. Flagged is `flags.py`'s rule, and a round with a flagged run is a flagged round. **The read is VOID when:**
- **more than 2 of the 8 complete scored rounds are flagged:** not ALONE;
- the twin is inadmissible;
- fewer than 8 complete scored rounds finish.

**Up to 2 flagged rounds stay scored,** and the unflagged sensitivity is reported beside the grade. The count is over the complete scored rounds in the grade. A flag in round 0 or in an incomplete round counts for nothing and is recorded.

**One re-read on a void, in `n8-r4`. A second void stops the hop. A void is not a miss. A miss of the target is not re-played.** On a void `n8-grade.py`'s state line is not cited, and no figure from that read stands as graded. `flags.py` runs first, and the grade runs only if the flag count allows it. An inadmissible twin can only be seen from the grade, so in that one case the grade's figures are printed and still do not stand.

## The slot
`reread.sh`'s gate unchanged: it takes the lock and starts only after five samples 3 s apart name no foreign vitest; otherwise it releases, waits 60 s and tries again. **The 40-minute clock starts at this note's commit.** `reread.sh`'s last argument is 2 400 s less the seconds from that commit to launch. No slot in 40 minutes stops the hop with nothing read, and that spends no re-read. **A re-read runs on what is left of the same clock**, not a new 40 minutes: the owner's window is short. If it runs out before a re-read gets a slot, the hop stops with the void standing and the re-read unspent.

It runs as one background command. I run nothing else on the host from launch to its exit, no poller and no `tail`, so the wait adds no load to `foreign_cpu_s` and leaves nothing behind (`…43927eb6`).

## Reported, on a read that stands
H's median with its interval and max against 10 s, 9.6 s and 9.5 s; H − B wall and CPU; the twin's admissibility and R, from `n8-grade.py`; three-decimal figures from `a9-read.py`. **The target is H − B ≤ −0.215 s in paired median wall, graded with an admissible twin. It is not a bar.** `n8-grade.py`'s "BUDGET … bar ≤ +0.10 s" line is another ticket's and is not read. H's median goes through `…b9038a14`'s G-GO, G-WITH, G-HOLD as a figure for the Orchestrator's routing. `≥ 9.6 s` goes as `…ad217a34` 4 says: straight to the owner, no row move first. H > 10 s goes to the owner (`ADR-0035` D6). `R-N8H-1`'s state is Security/NFR's, and QE does not read it.

## Verdict, fixed before the figure
- **A read stands:** a `decision` note by qe-e2e. **PASS** with the target met. **PASS_WITH_GAPS** with the target missed: a gap the Orchestrator routes, as the page says, and `H ≥ 9.6 s` named for the owner. **FAIL** if the state is NOT MET, H over 10 s. An UNRESOLVED state goes to the Orchestrator as read, not as a pass.
- **UAT:** waived, the page's test note 3: A1's `grep` is empty, and QE's verdict signs.
- **No stands-read, no verdict:** an `observation` note, as `…43927eb6` was.
- Foreign load is recorded and never touched. Nothing is left running; checked with `ps`.
