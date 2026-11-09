---
id: 20261108T231008Z-software-engineer-observation-e57979e2
kind: observation
by: software-engineer
at: 2026-11-08T23:10:08Z
verified_by: 
confidence: high on every reading stated (deterministic, under the host lock, one core, one worker); G4 cmp- and sha256-equal to the frozen digest; the weakened-lane red read equal on main
refs:
  - se-ABC-298-repoint
  - se-ABC-298
  - ABC-298
  - ADR-0077
  - arch-ABC-298-stop/20261108T221135Z-architect-design-decision-251b60bb
  - qe-ABC-298-freeze/20261108T212842Z-qe-e2e-decision-44a6717d
  - b9b8eee9
  - 400c1b9e
supersedes: 
seal: sha256:ff36cc0e9b9b670accf6a3a40ee95920f920829018099922110509aae8eb17c2
---

# se-ABC-298-repoint readings: the re-point is in, and every row it owes is green. G4 equals the frozen digest byte for byte. Every other deep lane equals the freeze's counts; the one red row is `PUZZLE_DEEP=weakened`'s designed gate red, equal on `main`

Software Engineer, task `se-ABC-298-repoint`, on `grugops/ABC-298`.
- **Starting point:** `0123e893`, with `main` `2893bdde` merged in at `9324b2b3` (records only; `src/` tree still `bba42fb7` on `main`).
- **The re-point:** commit `400c1b9e`.
- **The head read:** `src/` tree `b8d055c9`.
- **How it ran:** every run was under the host lock (`flock <scratch>/<home>/<repo>/host-test.lock`) on one core (`taskset -c 0`), one process at a time, and vitest ran with one worker.
- **No timing figure was taken.** Holds are listed in `raw/repoint/out/holds.txt`.

## Item 2: the re-read, against the expected figures

| read | expected | head | |
|---|---|---|---|
| default lane, whole | 2 782 / 2 782 | 71 files, 2 782 / 2 782, 0 failed, 0 skipped | equal |
| `SEARCH_DEEP` `search.bundle` | 56 / 56; mate floors `search()` 0 of 191, `chooseMove` 0 of 189 (`ABC-303`), and 0 of 190 / 0 of 188 (`ABC-283`) | 56 / 56; 0 of 191, 0 of 189, 0 of 190, 0 of 188 | equal |
| `SEARCH_DEEP` `search.null-move` | the freeze's 46 collected, all green | 46 / 46; `ABC-208` A3 mate floor 0 of 189 | equal |
| `npm run typecheck` (`tsc --noEmit`) | exit 0 | exit 0 | |
| `npm run lint` (`biome check .`) | clean | 148 files, no fixes | |
| `npm run build` (`tsc -p tsconfig.build.json`, emitted to scratch and deleted) | exit 0 | exit 0 | |

R1, R2 and R3 read green in the default lane and in their deep lanes. The default lane's wall was 25.84 s. That is INFO only and not a timing read; `NFR-008` is QE's read.

## Item 3: `G4`, SG1 (b), against the frozen digest (`…44a6717d` § 2)

- **How it was read:** `qe-ABC-298-freeze`'s frozen `g4.mjs`, `run-g4.sh` and `join.sh`, run in place and unchanged. Their sha256 begin `4f492c54…`, `e65b34d4…` and `3cafea04…`, which equals the freeze's table.
- **The tree:** a `git archive` of `400c1b9e`.
- **Every part was run:** corpus, run as batch A runs it; lists; choose; search; doors; unpruned; sample; and ordering 0–15. Every part exited 0.
- **Results:**
  - `g4.jsonl`: 16 558 lines, sha256 `b65f747aa16b40d9f71c343520026796b2c64260e06af10fadb6269a2131af34`. It is `cmp`-equal to the frozen `g4.jsonl.gz`'s content.
  - `g4-sample.jsonl`: 264 lines, sha256 `2e1534f05adbc493b195a665fcf61f290ef4434f998e47856a1a1ae19ec0e744`. It is `cmp`-equal to the frozen `g4-sample.jsonl.gz`'s content.
  - `g4-digest.txt` is byte-equal to the frozen one: every part's lines and hash match, and 0 rows read `pure:false`.
- **Verdict:** **SG1 (b) met. No F2.** Files: `raw/repoint/out/g4-cmp.txt` and `g4-digest-head.txt`.

## Item 4: the rest of the freeze's deep lanes (`…44a6717d` § 4, `raw/out/lanes.txt`)

Each lane ran through the freeze's own `deep.sh`, unchanged, in three holds.

**Collected counts, all equal to the freeze's list:**
- **`SEARCH_DEEP`, all green:**
  - `search` 57;
  - `search.pvs-lmr` 29;
  - `search.ordering` 43;
  - `search.futility` 61, which is the freeze's 53 plus SG2 (c)'s 8 new rows;
  - `quiescence` 116;
  - `transposition` 40;
  - `see` 52;
  - `evaluate.taper` 170;
  - `evaluate.passer` 29.
- **`ENGINE_DEEP`, all green:**
  - `engine.capacity` 2;
  - `transposition` 26;
  - `gameend` 58;
  - `book` 36;
  - `evaluate.pawns` 44;
  - `quiescence` 99;
  - `search.ordering` 30;
  - `search.pvs-lmr` 21;
  - `levels` 58.
- **The other lanes, all green:**
  - `ZOBRIST_DEEP` `zobrist` 34;
  - `INPUT_DEEP` `line-input` 34;
  - `CLI_DEEP` `cli.real-engine` 11;
  - `UCI_DEEP` `uci.real-engine` 13.
- **`PUZZLE_DEEP=weakened` `puzzle-suite`: 13 / 14, exit 1.** The one red row is "the gating run › the gate: solved >= the recorded baseline" (`expected 16 to be greater than or equal to 54`). A3, "the weakened engine solves FEWER than the baseline (so the gate row above is red)", is green.
  - **That red is the lane's design.** `memory-bank/90-agents-md-command-log.md` says it "EXITS 1 BY DESIGN … a red from it is the lane working". `ADR-0042` Ruling 8 also says so.
  - **The count is 16.** `ADR-0042` recorded 15 as the reach proof. The weakened reads since `ABC-269` and `ABC-270` (`se-ABC-269-cut`, `se-ABC-270`, `qe-ABC-270`) record 16.
  - **I read the same lane on `main`'s tree** (`git archive main`, `src/` `bba42fb7`), so the build is not the cause. It also reads 16 / 58 with the one gate red and A3 green, and its `PUZZLES` and `NEWLY-*` lines are identical to the head's (`raw/repoint/out/weakened-main-vs-head.txt`).
  - **My reading:** no difference from base, and not a build red. Nothing was re-pinned. Because the brief says "any red row comes back to the Architect", the Orchestrator should know this row reads red by design and has been confirmed equal on `main`.
- **Read before the re-point and not re-run.** Same `src/`, and test files unchanged since then; see se-ABC-298 `…0c57c9f0`:
  - `ENGINE_DEEP` `engine` 105, `uci-session` 270, `legal` 91 and `moves` 40;
  - `PUZZLE_DEEP=1` `puzzle-suite` 18 (`G1` 54 / 58);
  - `PERFT_DEEP` `perft` 32.
- **`LADDER_DEEP` is not run** (QE-298-e: it plays games).

**Lock:** 11 holds, 52 min 39 s in all before the records. The longest single hold was 24 min 38 s, G4's ordering shards 1–15. None was over 1 h.

Not checked: `NFR-008` and SG3, both QE's on a held host; `LADDER_DEEP`, which plays games. The weakened count of 15 in `ADR-0042` / AGENTS log is stale relative to 16 on both trees, and that record is not mine to change.
