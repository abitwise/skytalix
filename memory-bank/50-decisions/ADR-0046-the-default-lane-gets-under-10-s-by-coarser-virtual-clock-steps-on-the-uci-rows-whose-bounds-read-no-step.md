# ADR-0046: The default lane gets under 10 s by coarser virtual-clock steps on the UCI rows whose bounds read no step

## Status

**ACCEPTED** 2026-10-20 by Olger Oeselg (owner), as proposed. Owner word, verbatim *"accept"*, given to the question
"Accept ADR-0046?" (`.grugops/context/wave-2026-09-25/notes/20261020T142000Z-orchestrator-decision-9fc95cac.md`, a
transcription, not a stamp). Recorded by BA/PM (subtask `bapm-cut-ABC-177`). The text below is as proposed; where it
says the ticket is not cut or the step-set word is owed, this line wins: `ABC-177` is cut and the D2(b) word is given
on its page.

**§ Addendum 2026-10-30 (`arch-g8-headroom`): PROPOSED.** D2(b)'s rule is extended from `ABC-167`'s classes to
every time-blind virtual-clock row in the default lane (R1–R4), with a first tranche on the `ABC-230` / `ABC-241`
rows. It needs BA/PM's word at the cut, as D2(b) did. No owner word is needed, because no NFR level, bar, cap, pin,
row count or lane line moves. D1–D6 are unchanged. See the addendum at the end of this file.

**proposed**, 2026-10-20, by Architect/Design (task `arch-lane-under-10s`). This ADR is the remedy that `R-174-1`
option (a) asked for. The owner accepted (a) at `…bdff4d33`.

- **This is a record only.** No lane was run and nothing was timed.
- **Moved here:** nothing. No NFR level, bar, pin, cap, step, row or lane line moves.
- **Proposed change:** one test file, `src/uci-session.test.ts`, under ticket `ABC-177`. BA/PM has not cut that
  ticket yet.
- **Acceptance:** this ADR needs the owner's acceptance. The step-set extension in D2(b) also needs BA/PM's word,
  as `bapm-amend2-ABC-167` and `ABC-173` (`…a7c3d910`) did before.

## Context

**The breach.** `npm test` at `be6a5599` reads a **10.010 s median wall** against `NFR-008`'s 10 s
(`qe-ABC-174` `…5d9a0f63`).
- Admissibility: n = 8, twin wall R = 0.280 s, load1 ≤ 6.01, on battery power.
- CPU is reported at 27.73 s. Security/NFR ruled it NOT MET and not attributable to `ABC-174` (`…6b1e94d2`, `R-174-1`).
- `ABC-174` has since merged, as `8522609d`.
- The caps that bound any remedy:
  - `maxWorkers: 2` (`ADR-0040` addendum 2, the owner's pick for heat).
  - Isolation stays on (`ADR-0040`).
  - The heap rows: SUITE 224 MiB × 9 isolates (`ADR-0008` § ADDENDUM 2026-10-19, `NFR-010`).
  - No asynchronous child forms (`ABC-173` `C2`).

**Where the time goes.**
- **Source:** the lane's own JSON report, `.test-results/last-run.json`, written 2026-10-20T13:45:02Z.
  - That run was on the `8522609d` merge code. `src/`, `tools/`, `package.json` and `vitest.config.ts` are byte-identical
    to `b6f2a48a`.
  - It was snapshotted to `.grugops/context/arch-lane-under-10s/probe/` (sha256 `164676cb…11e6`).
  - Its load, power and window are **`UNKNOWN - verify`**. It is **not an admissible reading**, so it is used for shape
    and ranking only.
  - Its in-vitest span is 9.78 s, which is consistent with QE's 10.01 s.
- **What the report measures:** per-file test-body time. Module-scope collect, imports and worker start are not in
  any file's span; they show only as gaps between files.

| rank | where | in-thread s | share of 10.34 s test time | note |
|---:|---|---:|---:|---|
| 1 | `src/uci-session.test.ts` | 6.27 | 60.7 % | 126 rows, all on an injected `virtualClock(step)`. Cost scales with the number of clock checks, budget ÷ step, at 1024 nodes per check. The ABC-167 A7 / A6 / A5 blocks hold 2.14 / 1.77 / 0.94 s |
| 2 | `src/cli.test.ts` collect | ~3.87 (gap) | — | `CHILDREN` spawns 28 children with `spawnSync` at module scope, serially, before the file's first test. Its rows run 0.26 s. The split between children and imports inside the gap is `UNKNOWN - verify` |
| 3 | per-file worker overhead × 57 files | ~5.2 (residual) | — | about 0.07–0.16 s between consecutive files. This is the price of isolation (`ADR-0040`) |
| 4 | `src/engine.test.ts` | 0.79 | 7.6 % | `ABC-170` A2/A3 rows, already lightened at `ABC-173` |
| 5 | `tools/grugops/qe-hop-integrity.test.ts` | 0.67 | 6.4 % | reads every note (2 981 today). It grows with the board, and `T-QEHOP-GROWTH` re-reads it at 4 000 |
| — | the other 54 files | 2.35 | 22.7 % | none over 0.21 s |

**The lane is throughput-bound, not critical-path-bound.** This is an observation from the one unscreened run.
- Both worker slots are busy from start to finish.
  - Slot A runs `uci-session` from 0.15 to 6.42 s.
  - Slot B runs `engine`, then `qe-hop-integrity`, then `cli.test.ts`'s collect gap and rows, ending at 6.15 s.
  - Both slots then share 50 small files, and both finish at 9.78 s.
- So **wall ≈ 0.35 s fixed + (Σ slot-seconds) ÷ 2**, with Σ ≈ 19.5 slot-seconds. A slot-second saved is about 0.5 s
  of wall.
- Reordering files saves nothing, because no slot is idle at the tail.

**Inside `src/uci-session.test.ts`.** Its expensive rows search to the level-5 capped ceiling: 3 000 virtual ms at
step 100 is 30 checks, about 25 600 nodes, about 150 ms. The rows fall into four classes, sorted by what their
assertions read (`probe/uci-rows.out`):

| class | rows | ms | the step is… |
|---|---|---:|---|
| **H** (hold and release; no `time` read) | A6 until-stop, A6 until-ponderhit (each runs **3 dialogues**, where the first two are exact prefixes of the third), A6-e1, e4, e5, j1, A7-i5, i6 | 1 814 | **free**: no assertion reads the step or `time` |
| **L** (lower bound only, `time ≥ 3 000`) | A7's six dropped-token rows (`go depth 0`, `nodes x`, `depth 2.5`, `mate 0`, `nodes -5`, `depth`) | 889 | free in the bound. The kill set may depend on it (a wrong `G` within 2s of 3 000) |
| **H′** (determinism; no `time` read) | ABC-171 A7 "two sessions on the same seededRandom(k)" (3 × `levelOneMoves`, each 3 × `go movetime 1000` at level 1, step 10) | 385 | free in the assertions. Its sibling precondition row ("seededRandom(2)'s three gos take both paths") must still hold: `UNKNOWN - verify` |
| **P** (pinned `G ≤ time ≤ G + 2s`) | all of A5, A6-d1, A7-f1/f2/f3/h1/i2/i3 | ~1 400 | **the pin.** Untouched |
| **C** (the step is a precondition) | A7 `go depth 3` (depth ≥ 5 at step 50), A7 `searchmoves` (free move at step 50) | 501 | untouched |

## Decision

**D1. The remedy is test-only and lives in one file, `src/uci-session.test.ts`.**
- No row leaves the default lane, and no assertion bound, row title or row count (126) changes.
- No file other than that one changes. In particular, none of `src/*.ts` production, `vitest.config.ts`,
  `package.json`, `AGENTS.md` or `tools/` changes.

**D2. Two levers, both under kill-set parity:**
- **(a) Fold the prefix dialogues.** The A6 until-stop and until-ponderhit rows run one dialogue,
  `[position, go infinite, release, release]`, and read `perLine`:
  - no `bestmove` in lines 0–1;
  - exactly one `bestmove`, last, by line 2;
  - `perLine[3]` empty.
  - These are the facts the three dialogues observe today, because `handleLine` is synchronous and the session is
    deterministic.
  - This lever needs no step change and no ruling.
- **(b) The coarsest kill-set-preserving step, for classes H, H′ and L only.** Each class-H, H′ and L row moves to
  the coarsest step in **{1, 10, 100, 1 000}** for which QE's kill set for that row is identical to today's. That is
  the `bapm-amend2-ABC-167` rule with one more decade.
  - Extending the set to 1 000 is **BA/PM's word**, per the precedent "a coarser step needs BA/PM's word"
    (`…a7c3d910`).
  - A row whose kill set changes at 1 000 keeps its current step.
  - Class P and class C rows are byte-identical.

**D3. Expected saving. Every figure here is an estimate, not a reading.**
- Lever (a): −0.60 s (908 → ~303 ms).
- Lever (b) on class H: −0.9 to −1.1 s (30 → 3–4 checks on the remaining ~1.2 s).
- Lever (b) on class L: between 0 and −0.80 s, depending on parity.
- Lever (b) on class H′: between 0 and −0.35 s, depending on parity and the precondition row.
- **Total: −1.5 to −2.8 s of in-thread time**, which is **−0.75 to −1.4 s of wall** under the 2-slot model.
  The predicted `npm test` median is **8.6–9.3 s**.

**D4. The headroom target is a design target, not an NFR level.**
- **H median wall ≤ 9.2 s**, which is 10 s − 3 × the full-lane twin wall R (0.28 s).
- `NFR-008` stays at 10 s, and only the owner moves it.
- Outcomes:
  - **≤ 10 s:** `NFR-008` MET, and `R-174-1` is discharged.
  - **> 9.2 s:** tranche 2 opens. Architect/Design re-opens with option O3 (below) for a BA/PM ruling.
  - **> 10 s:** it goes to the owner (`ADR-0035` D6).

**D5. Measurement plan. QE runs it at `ABC-177`'s gate.**
1. **Node census (not timing).** Instrument `deepen`'s return in scratch, as at `ABC-173` `…a7c3d910`, and count
   nodes per changed row at base and at head. This predicts the saving in nodes before any clock is read.
2. **Mutation parity.** For every changed row, the same mutants are killed at base and at head. The mutants are
   M01–M11, the named wrong builds, and hold/release mutants: a `bestmove` written on `go infinite`, a second
   release writing.
3. **`N8-LANE`** (`ADR-0035` D2, as amended).
   - Narrow set: `src/uci-session.test.ts`. No production file is edited, so `vitest related` adds none.
   - Shape: **ONE-FILE**, so the command is `NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts`.
   - Arms: B = `git archive` of the base, T = `cp -R B` (checked with `diff -r`), H = `git archive` of the
     `ABC-177` tip.
   - Run: `lane174.mjs` (byte copy), 9 rounds, round 0 discarded, rotated order, GAP 0, k = 2, CPU from
     `/usr/bin/time -p`.
   - Bound: 650 ms CPU. The charge is expected to be negative, and H−B with its interval *is* the measured saving.
   - This set's `F` is the provisional 16 % unless it has a reading: `UNKNOWN - verify`.
4. **Full-lane twin, in a quiet window.**
   - Command: `npm test` as spelled.
   - Arms: B with T, and H with H2. **Each second tree gets its own `npm ci`**, so the twin R can replace the
     pre-cap `F` under `…dd7a6ec9`.
   - Window: `window.mjs`, a 180 s foreground window with 1 s polls and 0 foreign polls.
   - Instruments: `sampler174.mjs` and `readout-nfr008-174.py`. load1 ≤ 8 on every scored run, and the
     **power source is recorded per run** (`SEC-174-2`).
   - Read three things:
     - (i) the `NFR-008` state on H, which is `R-174-1`'s discharge;
     - (ii) H−B wall and CPU medians with intervals, which is the remedy's measured saving;
     - (iii) H ≤ 9.2 s, which is D4.
   - **Do not read `R-173-1` or `R-173-2` on these arms.** The catalog fence on the combined tree still holds.

**D6. Owners.**
- Software Engineer: the change and the census.
- BA/PM: the {…, 1 000} step-set ruling, and the cut.
- QE: parity and D5.
- Security/NFR: the `NFR-008` state at the gate.
- Architect/Design: recording any `F` move and tranche 2.

## Alternatives

Ranked by expected wall saving against risk. Every saving here is an estimate.

| # | option | est. wall saving | risk | owner | size |
|---|---|---:|---|---|---|
| **O1** | **D2 (a) + (b) (chosen)** | −0.75..−1.4 s | LOW: test-only, parity per row, no bound or row moves | SE, BA/PM word, QE | **S** |
| O2 | D2 (a) alone | −0.3 s | very low, no ruling needed | SE, QE | XS |
| O3 | Move the class P/C bulk (A5 0.94 s, A7 `go depth 3` 0.33 s, A7 `searchmoves` 0.17 s) to a new `UCI_DEEP` lane | −0.5..−0.7 s | MEDIUM: the D4 time rule leaves the default lane, and it needs a new `AGENTS.md` line, its `A3` heap-flag pin and an "unset: NOT DEFINED" guard | BA/PM ruling, SE, Scribe | M |
| O4 | Move named `cli.test.ts` module-scope children to `CLI_DEEP`, with the 28 pin moved down | ~−0.035 s per child (from an older ~70 ms/child figure; `UNKNOWN - verify` per child) | MEDIUM-HIGH: delivered-command and security-bar coverage leave the default lane, and the `N8-SPAWN` account moves | BA/PM ruling, Architect (`N8-SPAWN`) | M |
| O5 | Merge small test files to cut per-file worker overhead | ~−0.045 s per file removed | HIGH: isolation-dependent `*.nfr` files, file-count pins, the narrow-set history | SE, QE | L |

O2 alone leaves about 9.7 s, roughly 1 twin R of headroom, which is not enough. O3 is tranche 2 if D4 misses.

**Rejected outright:** each would loosen a cap or a pin, or is the owner's alone.
- `maxWorkers: 3`: the owner's heat pick, his "max 2 cpu cores" word, and 2 more isolates that break 2 048 MiB at
  flag 128.
- `isolate: false`: `ADR-0040`. Three spy files go red.
- Asynchronous child spawns: the `ABC-173` `C2` pin.
- `NODES_PER_CLOCK_CHECK` or `HARD_CEILING_MS`: production code, and `NFR-004`.
- Sequencer or ordering changes: the lane is throughput-bound, with no idle tail.
- Re-levelling W: the owner's call, and not a remedy.

## Consequences

- **Search depth drops on the moved rows.**
  - Class H rows reach depth 2–3 instead of ~5. They assert protocol, not depth, so this does not matter.
  - A future row that needs depth on a hold must pick its own step, under the same rule.
- **The step set gains a decade, {1, 10, 100, 1 000}.** This is the third step move in this file, after `ABC-173`.
  The rule (coarsest step that keeps the kill set) is what keeps each move honest.
- **The lane grows back.** `ABC-174` added +0.03 s of wall. At that rate the ~0.8 s of headroom lasts about 25
  tickets of that size.
  - `qe-hop-integrity` grows with the board. `T-QEHOP-GROWTH` re-reads it at 4 000 notes.
- **Still open, not settled here:**
  - The catalog's `F` wording conflict: "outright" against "on MET" (`…6b1e94d2` § 4). D5.4's own-install twin
    gives the reading that settles it, and Architect/Design settles it at that hop.
  - Whether the declared stack names a power source (`SEC-174-2`) goes to the owner.

## Rollback

- Revert `ABC-177`'s one-file commit. No production code, config or lane line moves, so the revert is the whole
  rollback.
- A row that turns flaky or loses a mutant after the move goes back to its prior step alone.
- If D5.4 reads over 10 s, the owner decides. The cap does not give way (Q4).

## § Addendum 2026-10-30 (`arch-g8-headroom`): the rule reaches every time-blind virtual-clock row — PROPOSED

**Status.** PROPOSED 2026-10-30 by Architect/Design (task `arch-g8-headroom`). It needs BA/PM's word at the cut,
under the same precedent as D2(b): a coarser step needs BA/PM's word (`…a7c3d910`). No owner word is needed, because
no NFR level, bar, cap, pin, row count or lane line moves. D1–D6 above are unchanged. This is a record only: nothing
was run or timed at this hop.

### Context
- **The headroom is 0.10 s, and it is inside the spread.** `ABC-229`'s `G8` reads head 9.90 s and base 9.90 s
  (`qe-ABC-229` `…0b7fd4f6`, finding `QE-229-a`). One base run read 10.09 s, and base's three runs span 9.64–10.09 s.
  The same lane inputs (`fbab54ff` and `b92a3394`, with an empty `git diff` over `src tools package.json
  package-lock.json vitest.config.ts tsconfig.json`) read 9.73 s at `ABC-220`'s `G8` and 9.90 s about 90 minutes
  later. That is +0.17 s of drift between windows with no code change.
- **How the lane grew back after `ABC-177`** (head medians on `oeselg-devl`, from QE records):
  `ABC-228` (i) 9.37 s, `ABC-228` (ii) 9.61 s (+0.70 s on its base), `ABC-241` 9.63 s, `ABC-220` 9.73 s,
  `ABC-229` 9.90 s.
- **Why a virtual clock is not free** (`ADR-0027`; `src/engine.ts` `NODES_PER_CLOCK_CHECK` = 1 024). The engine
  reads the clock every 1 024 nodes, plus once per iteration and once at return. A search therefore costs about
  1 024 × (budget ÷ step) nodes. At the default level, 4 000 ÷ 100 is 40 reads, about 41 000 nodes. That is
  60–70 ms of in-thread time per search on this host: `uci-session.test.ts`'s "a bare go: go -> 4000 ms" row took
  64 ms in `QE`'s `G8` run 6.
- **A row that takes its budget from `LEVELS` inherits every level re-cut.** `ABC-228` (ii) moved level 5 from
  3 000 to 4 000 ms. Every such row then made 33 % more reads, without its file changing.
- **Where the time is** (`.grugops/context/arch-g8-headroom/raw/probe/`, which is QE's `G8` run 6 JSON report, used
  for shape and ranking only):
  - The lane is still throughput-bound on 2 slots, so wall ≈ 0.35 s + Σ slot-seconds ÷ 2, with Σ ≈ 19.1 s.
  - Per-file worker start and imports take about 7.8 s (about 0.12 s per file × 63 files), fenced by `ADR-0040`.
  - `src/cli.test.ts`'s 28 module-scope children take about 3.4 s, on the `N8-SPAWN` account, and stay synchronous
    under `ABC-173` `C2`.
  - Test bodies take 8.0 s:
    - `src/uci-session.test.ts` 2.0 s;
    - `src/search.null-move.test.ts` 1.44 s;
    - `src/cli.test.ts` 1.35 s;
    - `src/engine.test.ts` 0.52 s;
    - the other 59 files 2.7 s.
  - **Of `src/cli.test.ts`'s 1.35 s, 1.05 s is the `ABC-230` and `ABC-241` blocks.**
    - Their rows run the default level at step 100 (40 reads), on 3–4-piece endgames.
    - They read the move, the score (0, or not 0) and the keys handed. None reads `time`, the elapsed time or the
      depth.
    - The mirrored `src/uci-session.test.ts` blocks add 0.38 s.
    - The tranche-1 set below is 1.43 s of in-thread time in all.

### Decision
- **R1 (census).** Every default-lane row that searches on a virtual clock records its reads per search
  (budget ÷ step) in the SE's build note. BA/PM checks that the line exists at each cut, in the DoR NFR row.
- **R2 (the D2(b) rule, extended).** A row is **time-blind** when none of its assertions reads `time`, the elapsed
  time, a virtual-time bound or a depth reached on a budget.
  - A time-blind row takes the coarsest step in **{1, 10, 100, 1 000}** for which QE's kill set for that row is
    identical to base's. This is D2(b) word for word, applied beyond `ABC-167`'s classes.
  - A row that reads time (class P or C) keeps its step.
- **R3 (paired surfaces move together).** Rows that assert the CLI seam's move equals UCI's on "the same game and
  clock" move together, to one step on both surfaces:
  - `uci-session.test.ts` `ABC-230` A2 with `cli.test.ts` `ABC-230` A1;
  - `ABC-241` A5 with `ABC-241` A4.
- **R4 (new rows).** R1–R3 bind a new row at its own ticket. The ticket does not wait for a remedy hop.
  - A QE probe's set-up is not a lane form. An example is `ABC-242`'s "rate 1, 2 000 ms, `virtualClock(1)`", which
    is about 2 000 reads per scored list.
- **Tranche 1 (one test-only ticket, size S):**
  - R2 and R3 are applied to the `ABC-230` and `ABC-241` blocks of `src/cli.test.ts` and `src/uci-session.test.ts`.
  - The ticket also applies them to any other time-blind row that its R1 census finds in those two files and that
    was added after `ABC-177`.
  - **Expected: −0.3 to −0.65 s of wall** (1.43 s in-thread × ~90 % saved at step 1 000, halved for 2 slots; the
    low end if half the rows keep step 100). This is an estimate, not a reading.
- **Design target: `G8` head median ≤ 9.4 s at tranche 1's gate.** That is 10 s − 3 × 0.17 s of window drift,
  rounded down. It is a design target, not an NFR level. `NFR-008` stays at 10 s, and only the owner moves it.
- **Tranche 2 opens** if tranche 1's gate reads more than 9.4 s, or if any later `G8` head median reads more than
  9.6 s. Architect/Design then re-opens with the candidates below for a BA/PM ruling. If the lane is still over
  9.7 s after tranche 2, `NFR-008` goes to the owner (`ADR-0035` D6).

### Alternatives (ranked by estimated wall saving against risk)
| # | option | est. wall | risk | coverage the default lane loses |
|---|---|---:|---|---|
| **T1** | **R2/R3 on the `ABC-230`/`ABC-241` rows (chosen)** | −0.3..−0.65 s | LOW, test-only, parity per row | none |
| T2a | O3 above: UCI class P/C rows to `UCI_DEEP` (that lane exists since `ABC-168`) | −0.3..−0.45 s | MEDIUM | the D4 time-rule pins, which `ABC-221` is about to change |
| T2b | `search.null-move.test.ts`'s `QE-208-a` sweep and `QE-208-b` / A2 depth-6 rows to `SEARCH_DEEP` | ≈ −0.45 s | MEDIUM | `ADR-0050`'s abort-restores-root and key-under-null guards |
| T2c | sample `QE-208-a`'s readings 3–25 more sparsely, under parity | ≈ −0.1 s | MEDIUM: the "≥ 3 aborts inside a null subtree" guard | none, if parity holds |
| — | `cli.test.ts` children to `CLI_DEEP` (O4) | ~−0.05 s per child | MEDIUM-HIGH | delivered-command and security bars |
| — | `maxWorkers: 3`, or a lower heap flag | large | owner's word (heat, his "max 2 cpu cores", `NFR-010`'s rows) | none, but two owner levels move |
| — | raise W | — | owner's call | — |

### Consequences
- **The cost of a time-blind row stops depending on `LEVELS`.** At step 1 000 a level-5 search makes 4 reads, and a
  re-cut to 5 000 ms makes 5. At step 100 those are 40 and 50.
- **Depth drops on the moved rows** to about 3–4 plies on these endgames. They assert a 1-ply repetition and a
  material score, so the depth does not matter. Parity is the check.
- **The queue still spends the headroom.** Estimates, `UNKNOWN - verify`:
  - `ABC-243`: about +0.03 s, one 40-read time row plus one fixed-depth row;
  - `ABC-221`: about +0.1 s, if its period rows stay stubbed as `ABC-220`'s are;
  - `ABC-242`: +0.05 to +0.15 s under R4. It could add seconds if the probe's `virtualClock(1)` at 2 000 ms is
    copied into the lane.

### Rollback
- Revert the tranche-1 commit, which is the whole rollback.
- A row that turns flaky, or that loses a mutant after the move, goes back to its prior step alone.
- R1–R4 are text. Striking them restores D2(b)'s original scope.
