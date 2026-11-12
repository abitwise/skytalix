---
by: orchestrator (claude-opus-5-5, orch-2026-10-30a)
at: 2026-11-11T21:53:46Z
subtask: qe-ABC-320
role: qe-e2e
ref: .grugops/context/qe-ABC-320/
branch: new grugops/qe-ABC-320 from grugops/ABC-320 (5a8fbd8c), with main merged in
width: C1 check, then stage A only — pins, a smoke of at most 2 ungraded games, and the sealed PREREG with its session script. No graded games.
---
# ABC-320: QE — C1 check and stage A for level 5, night 1
Read the cut note `.grugops/context/orch-2026-10-30a/notes/20261111T214452Z-orchestrator-decision-972c91df.md` (C1–C4), the SE's Result in `.grugops/queue/done/se-ABC-320.md` on `grugops/ABC-320` and its notes under `.grugops/context/se-ABC-320/notes/`, and ABC-317's whole QE record `.grugops/queue/done/qe-ABC-317.md` with its scripts under `.grugops/context/qe-ABC-317/raw/scripts/`. Reuse them as the model.
1. **C1 check.** Read the diff `main...grugops/ABC-320` against C1. Re-run `node --test --test-concurrency=1 tools/rating/pair-check.ts` and lint under the lock. Confirm: L1–L4 and no-`--start` argv unchanged; `--start` and `rsum` refusals; the pooled formula. Report gaps by severity. A blocking gap stops stage A.
2. **Subject.** Read the build at tag `v1.1.0` (`cddd4df9`), the shipped release. State its `src/` tree and the `src/` diff from ABC-317's subject `b6366a79` (expected: L6 budget, version, comments only — so L5's engine is unchanged).
3. **Pins:** cutechess-cli, Stockfish 19, the openings, node, as ABC-317.
4. **Smoke (at most 2 games, ungraded):** `r cddd4df9 <out> --skill 5 --elo 2280 --rounds 1 --concurrency 1`. Check the control line, that Skill Level 5 and UCI_Elo 2280 reach both engines, `go movetime 4000`, and skytalix latency against 4 s (margin 50 ms). Also check `machine.txt`'s `start:` line with a `--start 1` run if the smoke uses it (the SE could not test it).
5. **Seal the PREREG before any graded game.** It covers:
   - E 2280 (cut note); level 5; both sides at st 4; the full reading is 200 games over openings 1–100, in nightly segments;
   - a night-1 session script: chunks of `--rounds 5` with `--start` 1, 6, 11, …; before each chunk it checks that the chunk cannot end past **8 h** from the session start at worst-case plies (state the figure and its source), else it stops; a hard runaway stop at 8 h; it deletes each chunk's build clones after the chunk; it writes the next start for night 2; E and the start are script arguments;
   - the pooled reading via `rsum` over the night's chunks, reported as an **interim** reading and a band probe (score clearly outside 25–75 % → report; a step needs the owner's word);
   - validity: faults, time losses, the depth guard, the record check, latency at 4 s;
   - FL and W as ABC-317, foreign load logged by class and count only;
   - a time estimate per chunk and for the night.
6. **STOP and report** with the exact launch line (placeholders). Graded games run only on a later brief line from me citing the owner's held host.
Every run goes as `flock <scratch>/host-test.lock <cmd>` (the real path is in your dispatch prompt only), one core, one at a time. Records carry placeholders only. Never kill foreign processes. No src/, README, CHANGELOG, ADR, EPIC or board edit. Publish sealed typed notes (`at` from `date -u` run just before each). Add a `## C1 check` and a `## Stage A` block to this brief. Run `node tools/grugops/records-path-check.js --base main` before each commit. No push, force, amend, rebase or merge into main. Commit messages end with "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>".

## C1 check
*QE/E2E (claude-opus-5-5, qe-ABC-320), 2026-11-11, on `grugops/qe-ABC-320` (from `grugops/ABC-320` `5a8fbd8c`, `main` `1240c137` merged by `abd26953`). Diff read: `main...grugops/ABC-320`. No game was played for C1.*

**Result: C1 PASS, no blocking gap. Stage A went ahead.**
- **Scope:** the diff touches `tools/rating/rating.ts`, `tools/rating/pair-check.ts` and the SE's queue records only. **The `src/` diff is empty.** `src/` stays `b668b153` on both sides; `tools/` moves from `a62695de` to `2ae53ab1`.
- **Gates,** each alone under `flock <scratch>/host-test.lock`, all exit 0:
  - `node --test --test-concurrency=1 tools/rating/pair-check.ts`: 66 / 66, 0 skipped. The ABC-320 group has 14 tests.
  - lint: 150 files.
  - typecheck.
- **L1–L4 and no-`--start` argv unchanged.** I ran `r cddd4df9 <out> … --dry-run` with `main`'s harness and this branch's harness, and compared the outputs byte for byte. Eight vectors were checked:
  - `--skill 1`–`4`, each at `--rounds 100 --concurrency 1`;
  - `--skill 4 --rounds 1`;
  - `--budget-ms 100`, at R1/R2's shape;
  - the 4 s default;
  - `--budget-ms 500`.
  - All eight are byte-equal. Two refusals differ only in stack-trace paths, plus the intended text change `r takes only 1 to 7` for `--skill 0`.
  - The SE's tests pin L3 and L4 against qe-ABC-317's committed `cmd.txt`, and L1–L7 structurally against R2's vector.
- **L5 dry run** with `--start 1 --rounds 5 --concurrency 1`:
  - both sides at `st=4`;
  - skytalix at `timemargin=50` with `option.Skill Level=5`;
  - Stockfish at `timemargin=2000` with `UCI_Elo=2280`;
  - `order=sequential start=1 -repeat -games 2 -rounds 5`.
  - `--start 6` and `--start 96` are accepted.
- **Refusals** (exit 1, nothing written):
  - `--start` values `0`, `101` and `1x`;
  - `--start 97 --rounds 5` (`openings 97–101 run past 100`);
  - `--start 2` with the default 100 rounds;
  - `--skill 8`;
  - `d --start` and `rpair --start` (usage);
  - `rsum` with no dir, and `rsum` with a flag (usage).
  - The SE's tests cover `rsum`'s six key refusals and its overlap and gap refusals.
- **The pooled formula:** the SE's hand-checked case 31/16/53 gives `52.5 +/- 46.8`, cutechess-cli's own printed line.
  - Independently, `rsum` on ABC-317's full scratch outputs gives back cutechess-cli 1.5.1's own lines: L3 `19.1 +/- 47.9` (103/92/5) and L4 `54.3 +/- 47.9` (111/80/9).
  - Pooling those two dirs is refused: `segments differ in level: 3 … and 4 …`.
- **`machine.txt`'s `start:` line** (the SE could not test it): the smoke with `--start 1` wrote `start: 1 (openings 1–1)`.
- **Gaps, none blocking (reported, not fixed):**
  1. *Low.* `rsum` compares sha, level, E, `st`, pins and openings. It does not compare the harness tree, `timemargin`, `-maxmoves`, `Threads`, `Hash` or concurrency. `night.sh` gates every chunk on one `tools/` tree, which covers this for ABC-320.
  2. *Low.* `rsum` prints only the pooled state. A segment's depth-guard or fault line shows only as an `UNRESOLVED` cause. `night.sh` checks each chunk's `summary.txt`.
  3. *Low (process).* `rsum` reads the raw `r.out`, not a redacted record. Every clean chunk's out-dir must stay in `<scratch>` until the 200 games are pooled. This is stated in the PREREG.
  4. *Cosmetic.* `rsum` needs `CUTECHESS_CLI` and `STOCKFISH` set, although it runs no engine. It also prints "1 segments'".

## Stage A
*QE/E2E (claude-opus-5-5, qe-ABC-320), 2026-11-11, on `grugops/qe-ABC-320` (harness `tools/` `2ae53ab1`, worktree `src/` `b668b153`). Read sha `cddd4df9` (`v1.1.0`, `src/` `b668b153`).*

**Result: pins = pin; one 2-game smoke at `--skill 5 --elo 2280 --start 1`, NOT GRADED, clean; PREREG written; stopped before any graded game.** The notes are NOT admitted yet. This spawned role has no `propose_note`, and `tools/grugops/note.js` is absent. The bodies are `raw/notes/note-stage-a.md` (observation) and `raw/notes/note-prereg.md` (decision), with kinds and refs in `raw/spec-a.json`. **The PREREG must be admitted before any graded game.**
- **Subject:** `v1.1.0` `cddd4df9`, `src/` `b668b153` (= `main`'s).
  - Against L1–L4's `b6366a79` (`src/` `21f3b304`), `src/` changes only `LEVELS[6]` 5 000 → 10 000, comments and tests. The version is in `package.json` only.
  - L5's engine path is unchanged.
- **Pins:** `cutechess-cli` 1.5.1 `dc776901…` = pin; Stockfish 19 `c78c22a9…` = pin; openings `0d7f7a72…` = pin; `node` v26.12.1.
- **Smoke (NOT GRADED):** `r cddd4df9 <out> --skill 5 --elo 2280 --rounds 1 --start 1 --concurrency 1`, 2 games, exit 0, **22 min 25 s**.
  - Control line: `control: skytalix Skill Level=5 st=4 timemargin=50, stockfish st=4 timemargin=2000`. The start line: `start: 1 (openings 1–1)`.
  - `Skill Level 5` reached both skytalix processes and `UCI_Elo 2280` both Stockfish processes. Every `go` was `go movetime 4000` (172 skytalix, 171 Stockfish).
  - **skytalix latency median 4 001 ms, max 4 002 ms; 0 over 4 010, 0 at the 4 050 ms margin.**
  - Faults 0, time losses 0, depth guard 0 of 171 below depth 6.
  - 189 and 154 plies, 3.907 s a ply. The build clone (805 MB) was deleted.
  - Records: `raw/out/smoke-l5-not-graded/`.
- **PREREG:**
  - E 2 280; level 5; both sides at `st` 4. The full reading is 200 games over openings 1–100 in nightly segments.
  - **Night 1: `night.sh 2280 1`, chunks of `--rounds 5` with `--start` 1, 6, 11, ….**
    - **The 8 h guard:** a chunk launches only if elapsed + **8 400 s** ≤ 28 800 s, so the last launch is at 5 h 40 min. The 8 400 s is 2 000 plies × 4.05 s + 300 s.
    - The source of the 2 000 plies: the worst 10-game window in ABC-316/317's 1 000 graded games was 1 969 plies, and ABC-317's RUNAWAY basis is 200 plies a game.
    - **RUNAWAY is hard at 8 h** from the session start. It voids that chunk only; the void chunk's start becomes the next start.
    - Each chunk's clone is deleted. `next-start` is written for night 2.
    - `rsum` pools the night's clean chunks into an **interim** reading and band probe. The probe triggers when the 95 % score interval lies wholly outside 25–75 %. A step needs the owner's word.
  - Validity, FL and W as ABC-317, with foreign load by class and count only.
- **Time estimate:** a chunk is about 56–117 min (85–180 plies, central 120 ≈ 78 min). **Tonight: 30–70 games, central 50, ending about 6–7.5 h after launch.**
  - This is below the cut note's 60–70. The worst-case guard and the smoke's longer games cost one or two chunks. Openings 1–100 take about 4 nights.
- **To start stage B (night 1),** from this branch's worktree root, with `<scratch>/l5-e2280-n1` not yet existing:
  - `cd .grugops/context/qe-ABC-320/raw && sha256sum -c scripts/SHA256SUMS`, just before launch;
  - `CUTECHESS_CLI=<cutechess-cli> STOCKFISH=<stockfish> flock <scratch>/host-test.lock bash .grugops/context/qe-ABC-320/raw/scripts/night.sh 2280 1 <scratch>/l5-e2280-n1 <repo>`
  - The sums: `night.sh` `cadde58a…`, `hostcheck.sh` `7f2843dc…`, `read.mjs` `7c01ffca…`.
- **Fences held:** no graded game. No `src/`, README, CHANGELOG, ADR, EPIC or board edit. No push, force, amend, rebase or merge into main. No foreign process touched or recorded beyond class and count.

## Stage B — go (L5, night 1)
*by orchestrator (claude-opus-5-5, orch-2026-10-30a), at 2026-11-11T22:28:43Z (orch note …b35596d8).*
- **The owner's word (W):** 2026-11-11, "host is quiet, run level 5 night 1". He was told the night runs at most 8 h in chunks of 10 games and gives an interim reading only. It is one window, for this night only.
- **Run on PREREG `…1d9e9a62` exactly as sealed** (admitted by the orchestrator verbatim from QE's committed body, before any graded game; stage A observation `…b9e8898d`). The 8 400 s guard is accepted as written.
- Scripts checked against `raw/scripts/SHA256SUMS` just before launch: all OK.
- Launched by the orchestrator in its own session (a subagent cannot hold an 8 h wait), as the sealed line: `night.sh 2280 1 <scratch>/l5-e2280-n1 <repo>`, `<repo>` = this worktree, under `flock <scratch>/host-test.lock`. QE reads the result in a later hop (stage C) against the PREREG.

## Stage C — read night 1
*by orchestrator (claude-opus-5-5, orch-2026-10-30a), at 2026-11-12T04:50:28Z.*
- The session exited 0 at 2026-11-12T04:50:14Z (el 22 880 s): 6 clean chunks, 60 games, openings 1–30; the guard refused chunk 31; next start 31. Out-root `<scratch>/l5-e2280-n1`, console `<scratch>/l5-n1.console` (both unread by QE so far).
- Read it against PREREG `…1d9e9a62` exactly: every validity line, the interim reading (labelled interim, 60 games), the band probe, latency, FL (class and count only, SHARED label if it applies), and the estimate against the walls. Commit redacted records under `raw/out/l5-e2280-n1/` on the `redact.sh` model; keep the raw chunk out-dirs in scratch (rsum needs `r.out` for the full reading). Publish an observation and a verdict note (or their bodies if you have no note tool). No game, no re-run.

## Stage C
*QE/E2E (claude-opus-5-5, qe-ABC-320), 2026-11-12, on `grugops/qe-ABC-320` from `f456e625`. Read against PREREG `…1d9e9a62`. No game, no re-run, no engine start. Under `flock <scratch>/host-test.lock`, `rsum` and `read.mjs 5 2280 4000` were re-run over the six chunk dirs, and both came out byte-equal to the session's own.*

**Result: PASS. ABC-320 (C1 plus night 1) is fit to merge.** Night 1 is VALID: interim **39 / 20 / 1, 39.5 / 60 = 65.83 %, X = 2 393.9 ± 94.7 (interim, 60 games, not L5's figure)**. The band probe is not triggered; no step. Night 2 runs from opening 31 at E 2 280 on a new W.

The notes are NOT admitted: there is no `propose_note` in this session. The bodies are `raw/notes/note-c-night1.md` (observation) and `raw/notes/note-c-verdict.md` (decision), with kinds and refs in `raw/spec-c.json`. Records: `raw/out/l5-e2280-n1/`. The raw chunk dirs stay in `<scratch>/l5-e2280-n1`.

- **Validity, all MET:**
  1. 6 / 6 chunks clean, with no VOID; RUNAWAY and THERMAL did not fire.
  2. skytalix lost 0 games on time. Terminations: 59 mates and 1 fifty-move draw.
  3. `Skill Level 5` and `UCI_Elo 2280` reached 60 / 60 processes. Every `go` was `go movetime 4000`: skytalix 2 962, Stockfish 2 952.
  4. Depth guard 0 of 2 952 below 6. The record check passed and every state line reads `rating`; faults 0 in every chunk.
  5. `rsum` pooled 1–30 contiguously without a refusal.
  - Gates 1–3 passed at launch; the W-check was 0 / 0 / 0 / 0.
- **Interim:**
  - Colour split: White 17.5 / 30 (58.3 %), Black 22.0 / 30 (73.3 %).
  - Opening-cluster interval ± 89.8, against iid ± 92.6.
  - Pairs: 12 swept, 14 split, 1 at 1.5, 3 lost.
- **Band probe:** the 95 % score interval is 53.8–77.8 %, not wholly outside 25–75 %.
- **Latency:**
  - skytalix median 4 001, p95 4 002, p99 4 002, max 4 004 ms; 0 over 4 010, 0 at or over 4 050.
  - Stockfish max 4 002 ms.
- **FL:** 2 264 samples.
  - foreign vitest 0, cutechess-cli 0;
  - stockfish 1 sample (count 1, at a game boundary);
  - node 3 samples (count 1).
  - Not SHARED. Tctl max 74.8 °C.
- **Estimate against the walls:**
  - 60 games in 6 h 21 min (22 880 s), inside the estimated 30–70; the central estimate was 50.
  - Chunks ran 54.7–71.2 min, mean 63.5, against the estimated 56–117.
  - Plies a game: mean 98.6, median 87, max 214. Seconds a ply: 3.855.
  - The worst chunk was 1 109 plies / 4 274 s, against the guard's 2 000 / 8 400.
  - The guard left about 1.5 chunks unused.
- **Gaps:**
  - **None blocking.**
  - **Medium:** night 1's raw `r.out`, which the 200-game `rsum` needs, sits on tmpfs scratch. Ask the owner for a durable location before night 2.
  - **Low:** C1 gaps 1, 2 and 4 stand. Whether the 4 single foreign samples are the tool's own restarts is UNKNOWN - verify.
  - **Info:** the Stockfish time scale is UNKNOWN - verify. Openings 31–100 may take 2 nights, not 3 (an estimate).
- **C4:** the SE's lint, unit (2 740 / 2 740), build and pair-check, plus QE's lint, typecheck and pair-check, all ran on `tools/` `2ae53ab1` and `src/` `b668b153`, both unchanged since. The `src/` diff is empty, so the waiver applies.
- **Fences held:** no game, no edit of the sealed scripts, nothing in scratch deleted. No `src/`, README, CHANGELOG, ADR, EPIC or board edit. No push, force, amend, rebase or merge.
