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

**§ Addendum: BA/PM's word given (dated 2026-10-31, `arch-qe242a-ruling`, records only).** BA/PM gave R1–R4 its
word on `ABC-244`'s page, § BA/PM ruling, on 2026-10-30 (task `bapm-g8-headroom-cut`, merged `de02f8c2`). This is how
`ABC-177`'s page gave D2(b)'s word, and `ABC-177`'s three conditions carry over unchanged. R1–R4 bind from that cut.
No owner word was owed. Tranche 1 is `ABC-244`, merged at `24b22339` (`G8` head 9.25 s). Where the addendum still says
it "needs BA/PM's word", this line wins. The ruling on `QE-242-a` (how condition 2 reads a blunder) is the dated
section at the end of the addendum.

**Spelling 2026-10-31 (`arch-hostname-adrs`, records only).** The reference machine is spelled `oeselg-dev`, on the
owner's word *"hostname spelling: oeselg-dev"* (`orch-2026-10-30a` `…c2752305`). One place is corrected: the addendum's
§ Context bullet on how the lane grew back after `ABC-177`. It said `oeselg-devl`. The host is the same, and no
figure, rule or decision moves.

**§ Addendum 2026-10-31 (`arch-g8-tranche2`): tranche 2 is OPEN; the recommendation and W1 are PROPOSED.** Tranche
2 opened on `qe-ABC-245`'s `G8` head median of 9.82 s, which is above 9.6 s. The trigger is not waived. The
candidates are re-costed, and one test-only ticket is recommended for BA/PM's ruling. It loses no coverage by
construction. W1 is a confirmation read before the 9.7 s owner line routes; it needs BA/PM's word and moves no
level. No owner word is owed now. See the dated section at the end of this file.

**BA/PM ruling 2026-10-31 (`bapm-tranche2-ruling`, records only).** T2-R is **accepted with amendments** and cut as
`ABC-248` (S, P1, `EPIC-010`, ordered after `ABC-246`). W1 is **given BA/PM's word with clarifications**. No owner
word is owed. Where the addendum says T2-R or W1 is PROPOSED or needs BA/PM's word, this line wins. See § BA/PM ruling
2026-10-31 at the end of this file.

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
- **How the lane grew back after `ABC-177`** (head medians on `oeselg-dev`, from QE records):
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

### Ruling 2026-10-31 (`arch-qe242a-ruling`): condition 2 reads a blunder per level call (`QE-242-a`)

**Ruled by Architect/Design, records only. Nothing was run or timed.** `QE-242-a` (MEDIUM, `qe-ABC-242`
`…b9f3cd67`, census `…51079df4`) asks how `ABC-244`'s condition 2 reads a blunder row. The condition says a search with
≥ 2 clock-check intervals at the reference step must still have ≥ 2 at the chosen step, where intervals are
⌈budget ÷ step⌉. A blunder is one level call that slices one shared deadline across its child searches (`ADR-0032` d1).

- **The ruling.** For a blunder row, the search the condition counts is **the level call**: its one budget and its
  one deadline. Level 1's 100 ms at step 10 is 10 intervals, which is ≥ 2. **So `ABC-242`'s step 10 is admitted as
  built.** No merged row changes, and no ticket is owed.
- **Why the level call:**
  - **The condition's own precedent counts it that way.** In its first use (`ABC-177` § BA/PM ruling, U8), BA/PM wrote
    "level 1's 100 ms budget: 10 intervals at step 10". U8's gos take both paths, the blunder and the plain search.
    `ABC-244` carried the condition over unchanged. U8's steps, {10, 100}, are the ones the owner accepted with this
    ADR.
  - **It is the only reading that agrees with R4.** R4 and § Consequences planned `ABC-242`'s rows at
    +0.05 to +0.15 s, and they warned that a step-1 form "could add seconds". Read per child search, the condition
    admits only step 1, which is about +2.5 s of lane wall. On `G8` H 9.41 s that breaches `NFR-008`, and `NFR-008`'s
    level is the owner's. A reading under which no 5-move level-1 blunder row can meet R2 and `NFR-008` at once cannot
    be what the addendum meant.
  - **It counts the loop the row was written over.** That loop is the level call's shared deadline, and at step 10 it
    still makes 10 reads and runs every child. The code under test is `ABC-242`'s check, and it runs at the blunder's
    root, before any child, and reads no clock. Child depth is engine behaviour. `src/engine.ts` and `src/search.ts`
    were byte-identical in `ABC-242`.
  - **The evidence shows no loss.** QE's 20 plants kill the same sets at steps 1 and 10. The SE's M1–M8 kill the same
    sets at steps 1, 10, 100 and 1 000.
- **What this ruling accepts, stated plainly:**
  - Step 10 does **not** meet a per-child reading. At step 10 the children are handed 10, −10, −30, −50 and −70 ms.
    They search depth 1, and the call takes 210 of its 100 virtual ms.
  - The build note's "2 reads per child" is a nominal slice, not a reading.
  - No default-lane `ABC-242` row exercises a level-1 blunder's children past depth 1, so a level-layer fault that
    shows only there would pass unseen. No `ABC-242` criterion asks for depth.
- **The limit, so the reading cannot be stretched.** In two cases the condition reads each child search on the budget
  it is handed, not the level call:
  - a row asserts a child search's depth;
  - a row's property under test is computed inside a child search, and is not compared with a reference run at the
    same step.
- **R1 for a sliced call.** The census line gives reads per level call and says so. A per-child figure in the line is
  the budget each child was actually handed, as read, never the nominal slice.
- **Older level-1 blunder rows on a virtual clock** (QE's `UNKNOWN - verify`) read the same way. One is U8 itself
  (`src/uci-session.test.ts`, "two sessions on the same seededRandom(k)…"), which asserts equality only. Whether the
  limit above catches any other is `UNKNOWN - verify`. This ruling owes no ticket for them.
- **No owner word is owed.** No owner-accepted decision changes. This ruling follows BA/PM's own U8 count, under the
  steps the owner accepted for U8. No NFR level, bar, cap, pin, row count or lane line moves. No ticket page is edited
  here. BA/PM's close hop may cite this section.

## § Addendum 2026-10-31 (`arch-g8-tranche2`): tranche 2 opens, and its candidates are re-costed — PROPOSED

**Status.** By Architect/Design (task `arch-g8-tranche2`). This is a record only: nothing was run or timed at this hop.
- **Tranche 2 is OPEN.** That is a fact, not a proposal. It opened on `qe-ABC-245`'s `G8` (`…af467c7b`), and the
  Orchestrator recorded it at `4cd261c1`. The trigger is not waived.
- **T2-R (the recommendation) is PROPOSED.** It needs BA/PM's ruling at the cut, as R1–R4 did.
- **W1 (how the owner line is read) is PROPOSED.** It needs BA/PM's word. It changes how one line is read, and it
  moves no level.
- **No owner word is owed now.** No NFR level, cap, pin, W, step set or lane command moves.

### Context: the reading
- **`G8` head medians on `main` since tranche 1** (`oeselg-dev`; admissible unless marked):
  - `ABC-244` 9.25 s;
  - `ABC-243` 9.28 s;
  - `ABC-242` 9.41 s;
  - `ABC-221` 9.84 s. This one is inadmissible as a trigger (the Orchestrator's ruling, `9c008db4`): `QE-221-c`'s
    orphan process held a core, and its base read 9.82 s too.
  - `ABC-245` 9.82 s, with base 9.44 s.
- **9.82 s is above 9.6 s, so § Addendum 2026-10-30's "any later `G8` head median > 9.6 s" fires.**
- **The firing is not growth (`QE-245-b`).**
  - The head adds one row of 1.67 ms.
  - The +0.38 s H − B delta sits in files that are byte-identical between the arms.
  - Head run 3 read 10.19 s and was slow in every file. Its summed spans were 7.93 s, against 7.08–7.42 s in the
    other five runs.
  - CPU tracks wall from run to run on identical trees, 29.65–33.11 s. What varied is the host's per-thread speed,
    not the work.
- **The lane's central value is about 9.5 s.** This is an estimate, not a reading. Two routes agree:
  - **Pooling `ABC-245`'s six runs** (the code delta is 1.67 ms): 9.08, 9.44, 9.44, 9.58, 9.82 and 10.19 s. The
    median is **9.51 s**.
  - **Adding up from `ABC-242`:** its H was 9.41 s. `ABC-221` adds 30 rows (39 ms in-thread, `se-ABC-221`
    `…af63269c`), and `uci-session.test.ts` grew +78 ms per file (`qe-ABC-221`). Add `ABC-245`'s row and the total
    is about 9.45–9.5 s.
- **How much `G8` moves at n = 3 with no code change:**
  - In quiet windows (`ABC-242`, `ABC-243`), each arm's three runs span 0.13–0.15 s.
  - In `ABC-245`'s window, the head's runs span 0.75 s, and all six runs span 1.11 s.
  - Between windows: +0.17 s at `ABC-229` with the same inputs, and about +0.4 s at `ABC-221`, from the orphan.

### The noise question (`QE-245-b`)
- **It does not change whether the trigger fired.** The text reads a raw, admissible head median, and 9.82 s is
  one. Reading it any other way would need a dated amendment, and this section makes none.
- **It does change what the firing tells us.**
  - It does not say the lane grew by 0.4 s.
  - It does say the lane sits close enough to 9.6 s that one noisy window reads over it. With a central value of
    9.5 s and one run at 10.19 s, the noise already reaches `NFR-008`.
  - Catching this is the line's job: § Addendum 2026-10-30 set the target at 10 s − 3 × 0.17 s of drift. So the
    noise strengthens the case for tranche 2 rather than weakening it.
- **It changes how large the remedy needs to be.**
  - Tranche 2 is sized against about 9.5 s, not 9.82 s.
  - About −0.3 s of wall puts the central value near D4's 9.2 s and under the 9.4 s design target.
- **It changes how the saving is read.**
  - The gate's n = 3 `G8` alone cannot resolve a −0.2..−0.3 s change in a window like `ABC-245`'s.
  - The saving is read on the narrow set (`N8-LANE`), which resolved −1.145 s CPU at `ABC-244` with R 0.250 s, and
    on the gate's H − B.
  - The 9.4 s design target is read on the head median, as before.
- **The 9.6 s line opens tranche 2 once, and it is now spent.**
  - No tranche 3 is defined, so a later head median above 9.6 s re-opens nothing.
  - `ABC-246`'s page expects its own `G8` to fire the trigger. BA/PM may fold that line.
  - After tranche 2's gate, two lines remain to watch: 9.7 s (the owner line, below) and 10 s (`NFR-008`,
    `ADR-0035` D6).

### The lane as it stands (census, used for shape and ranking only)
**Source.** `se-ABC-221`'s own `npm test` JSON report at `c48a6f83`, written 2026-10-31T05:38Z.
- Its `src/`, `tools/`, `data/`, `package*` and `vitest.config.ts` equal `qe-ABC-245`'s base `9c008db4`, so it is
  today's lane minus one 1.67 ms row.
- Snapshot: `.grugops/context/arch-g8-tranche2/raw/probe/`, sha256 `8e4e281c…f8dd`.
- Its load, power and window are `UNKNOWN - verify`. It is not an admissible reading.

**The lane is still throughput-bound on two slots.** The in-vitest span is 8.61 s over 63 files.
- Slot B runs `search.null-move` from 0.26 to 1.81 s. It then collects `cli.test.ts`, whose 28 module-scope
  children fill the gap from 1.81 to 5.18 s (≈ 3.37 s), and runs `cli.test.ts`'s rows from 5.18 to 5.80 s.
- Slot A runs `uci-session` from 0.22 to 1.93 s, then `engine`, `qe-hop-integrity` and the mid-sized files.
- Both slots share the tail until 8.61 s.
- So one slot-second saved is still about 0.5 s of wall.

| where | in-thread s | what is inside |
|---|---:|---|
| `src/uci-session.test.ts` | 1.71 | Class P/C rows (they read `time` or depth) ≈ 0.95: A5 0.33; A7's R2 depth 0, f2, f3, depth 3 and `searchmoves` 0.32; A6-d1 0.06; `ABC-174` A5, `ABC-171` A6, `ABC-212` A9 and the Hash row 0.23. `ABC-241` A5 0.09 kept step 100 at tranche 1 (U2) |
| `src/search.null-move.test.ts` | 1.55 | `QE-208-a` sweep 0.40; `QE-208-b` ×2, depth 6, 0.37; the A2 instrument 0.31; the doors 0.25; the zugzwang rows 0.15 |
| `src/cli.test.ts` | ≈ 3.37 collect + 0.62 | the 28 children (`N8-SPAWN`, `ABC-173` `C2`); `ABC-241` U2 rows 0.25 |
| `src/engine.test.ts` | 0.60 | `ABC-230` A4 0.25. It runs 5 ms at step 1, which is 5 intervals, so condition 2 keeps it there |
| `tools/grugops/qe-hop-integrity.test.ts` | 0.28 | It grows with the record |
| per-file start | ≈ 0.08–0.13 each × 63 | `ADR-0040` isolation |

**What the census finds beyond T2a–T2c:**
- **Two of A5's searched rows read nothing that another default-lane row does not already read.**
  - A5's "a bare go: go -> 4000 ms" reads the same G and the same window as four other rows: `ABC-174` A5's bare
    go, A7-f2, A7-f3 and `ABC-197` R2.
  - A5's "G = 3 500" sends the same `go` line, against the same bound, as `ABC-171` A6's level-5 row.
- **The D4 arithmetic is now pinned on the stub seam,** which reads the exact budget handed:
  - `ABC-220` A8: 7 levels × TimeMode unset/level × 40 goes, against the `ADR-0044` D4.1–D4.2 oracle;
  - `ABC-212` A12;
  - `ABC-221` A8 and A12.

  These pins are why T2a is stale. They did not exist when T2a was costed, and `ABC-221` (`c48a6f83`) landed the
  last of them.
- **Not every A5 row is covered by those pins.** `ABC-220` A8 replays one side to move with equal clocks. A5's
  "white reads wtime" and "black reads btime" may therefore be the only default-lane rows that kill a level-mode
  wrong-side build (`UNKNOWN - verify`; parity decides).
- **One time-blind row lies outside tranche 1's scope:** `ABC-167` A4-a2, `go depth \x1b[31m`. The token is
  dropped, so it runs a bare go: 40 reads at step 100, 77 ms.
  - `ABC-167` A3's two rows cannot move. They search 100 ms at step 10, and at step 100 that is 1 interval, which
    condition 2 forbids.
- **`ABC-241`'s U2 rows are not a candidate.** They kept step 100 on parity at tranche 1 (`se-ABC-244`), so at that
  step they are the only rows that kill F230, REP0 and S241M1.
- **`T-QEHOP-GROWTH` (`ADR-0035` B3) has fired.**
  - `main` holds 4 206 notes at `4cd261c1`. The count crossed 4 000 on 2026-10-30, between `33669cd8` (3 992) and
    `e7b22c11` (4 036).
  - No re-read is on record. It is routed to the Orchestrator: QE reads, and Architect/Design records.
  - It is not a tranche-2 lever.

### Candidates (re-costed). Every saving is an estimate, and wall is taken as in-thread ÷ 2
| # | option | in-thread s | est. wall | risk | coverage the default lane loses |
|---|---|---:|---:|---|---|
| **T2a (narrow)** | Move A5's six searched rows to the file's existing `ENGINE_DEEP` branch (`ABC-220` A11 / `ABC-221` A10), each only under **default-lane kill parity** (T2-R condition 2). The six: bare go, G = 3 500, white wtime, black btime, movetime 100, A5-b3. Likely: the two duplicates, and possibly movetime 100 and A5-b3 | 0.12..0.33 | −0.06..−0.16 s | LOW-MEDIUM | none by construction: a row that is the only default-lane killer of any mutant stays |
| T2a (wide) | every class P/C row ≥ 40 ms to `ENGINE_DEEP` | ≈ 0.95 | ≈ −0.47 s | MEDIUM | the D12 limits on a clock (depth 3, `searchmoves`); the dropped-token time reads (A7-f2/f3, `ABC-197` R2); the ponder hold at the ceiling (A6-d1); the level rows (`ABC-174` A5, `ABC-171` A6, `ABC-212` A9, Hash) |
| T2b | `QE-208-a`, both `QE-208-b` rows and A2's pawn-only depth-6 row move to `SEARCH_DEEP`. `AGENTS.md`'s "44 rows" becomes "48 rows" (four rows move), the same byte count | 0.77 | ≈ −0.39 s | MEDIUM | `ADR-0050`'s abort-restores-root and key-under-null guards. No other default-lane row aborts inside a null subtree (`ABC-078` A7 aborts in iteration 2, which tries no null move), and none checks the key at a probing null child |
| **T2c (widened)** | Sample `QE-208-a`'s readings more sparsely: its cost is Σ readings × 1 024 nodes whatever the root. Re-root `QE-208-b` on a cheaper position with ≥ 3 non-pawn pieces each side, where a null child still probes at depth 6. Both under kill parity and the non-vacuity guards | 0.1..0.5 | −0.05..−0.25 s | LOW-MEDIUM: it is a fixture choice, and parity is the check | none, if parity holds |
| **T2d (new)** | Apply R2 to A4-a2: step 100 → 1 000, 40 reads → 4. Also apply it to any other time-blind row the R1 census finds in the two files | ≈ 0.07 | ≈ −0.035 s | LOW | none |
| — | Move the U2 rows (`ABC-241` A4/A5/A7, both surfaces) to deep lanes | 0.34 | ≈ −0.17 s | MEDIUM | the ep-repetition guard (they are its only killers) |
| — | Move `cli.test.ts` children to `CLI_DEEP` (O4). The cost per child is from the census mean; the `npm run chess` child is likely dearer (`UNKNOWN - verify`) | ≈ 0.12 per child | ≈ −0.06 s per child | MEDIUM-HIGH | the delivered command, the security bars, `N8-SPAWN` |
| — | Merge files (O5) | — | — | HIGH | isolation (`ADR-0040`) |
| — | `maxWorkers: 3`, a lower heap flag, or W | large | — | the owner's | — |

**Rejected outright at this hop:**
- **A coarser step on a class P row.** It widens G + 2s, which changes the bound.
- **A non-uniform ("jump") clock on a pinned row.** A build with W < G − s reads time = G at the jump and passes,
  so kills are lost.

### Decision (PROPOSED)
- **T2-R. One test-only ticket, size S: T2c + T2a (narrow) + T2d.** It touches `src/search.null-move.test.ts` and
  `src/uci-session.test.ts` only.
  - **Expected saving: −0.15..−0.45 s of wall, central about −0.3 s.** This is an estimate.
  - **Coverage lost: none by construction.** A change that fails its condition is not made.
  - **Conditions:**
    1. **Per changed row:** `ABC-244`'s conditions 1–3 carry over unchanged. Kill-set parity decides the step or the
       fixture. Step 1 000 never turns a multi-check search into a one-check search. The mutant list is frozen
       before any head run.
    2. **Default-lane kill parity for a moved row (T2a).** A row leaves the default lane only if every named mutant
       it kills at base is still killed by the default lane at head.
       - The mutants: M01–M11 and the wrong builds A5's rows name (W ≠ G for each side, `movestogo` and
         `movetime`).
       - A row that is the only default-lane killer of any mutant stays.
    3. **Non-vacuity on the re-rooted and re-sampled rows (T2c).**
       - `QE-208-a`'s insideNull is ≥ 3.
       - `QE-208-b`'s underNull is > 0 in both recursions.
       - `ADR-0050`'s plants are killed as at base: the null move not unmade on abort, and the null child's key not
         written, in each recursion.
       - A re-root may re-title the row ("position-6"). That is BA/PM's word.
    4. **A moved row runs green once in its deep lane at the ticket's QE.** The command is `ENGINE_DEEP=1 … src/uci-session.test.ts -t
       "<moved describe>"`, the `-t` form that `AGENTS.md` line 102 already shows. Unset, the row is NOT DEFINED, on
       the file's existing pattern.
    5. **No `AGENTS.md` edit is owed**, because line 102's command does not change. If BA/PM wants the line to name
       the moved rows, it needs a trim first: the file has 11 B spare.
  - **Design target:** `G8` head median ≤ 9.4 s at its gate. That is the tranche-1 figure, and it is a design target,
    not an NFR level.
  - **Measurement:** D5's plan as `ABC-244` used it: the R1 census, parity, a two-file `N8-LANE` and `G8`.
  - **Owners:**
    - BA/PM: the ruling, the cut and condition 2's word;
    - SE: the change and the census;
    - QE: parity, the deep-lane run and D5;
    - Architect/Design: the records.
- **The ticket BA/PM should cut (it is not cut here):** *"The default lane sheds ~0.3 s and loses no coverage:
  `QE-208-a` sampled more sparsely and `QE-208-b` on a cheaper root, `ABC-167` A5's duplicated searches moved to the
  file's `ENGINE_DEEP` branch, and A4-a2 on R2 (test-only)."*
  - Size S, P1, `EPIC-010`, as `ABC-244` was.
  - It shares `src/uci-session.test.ts` with `ABC-246`. The order is the Orchestrator's. Taking `ABC-246` first
    (XS, Ready) puts its rows in tranche 2's base.
- **The alternative, if BA/PM prefers certainty to coverage:** T2b alone, about −0.39 s. It is not recommended.
  - It moves two `ADR-0050` guards that the default lane has no other row for.
  - The noise reading says −0.3 s is enough.
  - It stays the first agent-side lever the owner question below would weigh.
- **W1 (PROPOSED; a reading rule, BA/PM's word): the 9.7 s owner line is confirmed before it is routed.**
  - **Where it is read:** on tranche 2's gate `G8` head median, and on every admissible `G8` head median after it.
  - **The confirmation:** a reading above 9.7 s triggers a second read by QE, head only, n = 3, in a second window.
    That window starts ≥ 30 min after the first, after the usual wait-clear, with Tctl ≤ 60 °C.
  - **The routing:** the reading goes to the owner if the median of the six head runs is above 9.7 s.
  - **Until BA/PM gives W1 its word,** § Addendum 2026-10-30's text reads alone: one admissible head median above
    9.7 s after tranche 2 goes to the owner.
  - **The 10 s line is not touched.** A median above 10 s at a gate is `NFR-008` NOT MET and goes to `ADR-0035` D6,
    with no confirmation step.
  - **Why:** at `ABC-245` the six runs pooled read 9.51 s while the head median read 9.82 s. The 0.3 s between this
    line and the NFR is inside one window's noise. An owner question raised on a noisy window costs his time and
    settles nothing.
- **How a confirmed crossing would reach the owner:**
  - **What has not happened:** `NFR-008` is still MET at ≤ 10 s.
  - **What has:** two tranches have used up the test-only levers that keep coverage, so the agent-side headroom is
    gone.
  - **His options, in the order they would be put to him:**
    - (a) accept the band and watch: D6 fires only on a median above 10 s;
    - (b) accept coverage-losing lane moves as the price of the 10 s level, first T2b (−0.4 s, two `ADR-0050`
      guards to `SEARCH_DEEP`), then U2 and O4 one child at a time;
    - (c) one of his reserved levers: W, `maxWorkers: 3` (against his heat word and "max 2 cpu cores"), or the heap
      flag (`NFR-010`).

### Consequences
- **D1 ("no row leaves the default lane") was the scope of `ABC-177`'s remedy.** This addendum lets a row leave only
  under default-lane kill parity, and only on the tranche-2 ticket. The moved rows still run in `ENGINE_DEEP`.
- **The queue still spends headroom.** These are estimates:
  - `ABC-246`: about +0.01 s, from two stubbed rows;
  - `ABC-223`: no rows, because it is a smoke reading;
  - `ABC-247`: tools only, under `node --test`, so it is outside `npm test`.
- **The record keeps growing.** `qe-hop-integrity` grows with it, and `T-QEHOP-GROWTH`'s re-read is owed.

### Rollback
- Revert the tranche-2 commit; that is the whole rollback.
- A moved row goes back on its own. So does a re-rooted or re-sampled row.
- W1 is text. Striking it restores the addendum's reading.

### BA/PM ruling 2026-10-31 (`bapm-tranche2-ruling`): T2-R accepted with amendments and cut as `ABC-248`; W1 given its word with clarifications

**Ruled by BA/PM, records only, at `main` `209f4c5f`. Nothing was run or timed** (QE holds the host ALONE). The ticket
page is `plans/tickets/ABC-248-…md`, whose § BA/PM ruling carries the conditions in full. This section is the dated
record the addendum asked for.

**T2-R: accepted, one S test-only ticket, `ABC-248` (P1, `EPIC-010`), ordered after `ABC-246` (same file).**
- **Why accept.**
  - It is the only candidate set that sizes to the noise reading (central about −0.3 s against a lane centred near
    9.5 s) and loses no default-lane coverage by construction. A change that fails its parity or non-vacuity
    condition is not made.
  - It is cheap to undo: each lever reverts alone (§ Rollback).
  - One ticket, not three: splitting T2c, T2a (narrow) and T2d would buy three ALONE `G8` gates for one −0.3 s
    remedy, and each part alone is below what one gate's n = 3 can resolve.
- **Why no owner word is owed for moving rows out of the default lane.** D1 ("no row leaves the default lane") was the
  scope of `ABC-177`'s remedy. The text the owner accepted already names the next step: D4 says tranche 2 re-opens with
  O3 "for a BA/PM ruling", and § Alternatives says "O3 is tranche 2 if D4 misses". T2a (narrow) is a strict subset of
  O3: at most six rows, into the file's existing `ENGINE_DEEP` branch, with no new lane and no `AGENTS.md` line, and
  only under default-lane kill parity. No NFR level, cap, pin, W, step set or lane command moves.
- **Why not T2b.** It buys about 0.1 s more by moving `ADR-0050`'s abort-restores-root and key-under-null guards out of
  the default lane, where no other row holds them. Trading coverage for speed is option (b) of the owner framing, so
  it stays his lever, not this ticket's.
- **Amendments (binding on `ABC-248`):**
  1. **The T2a rows are named.** They are the six searched rows of `ABC-167` A5: "movetime 100", "white reads wtime",
     "black reads btime", "G = 3 500, under the default level 5's 4 000", "a bare go" and "A5-b3". No other row moves.
     A moved row keeps its `it` title byte-identical, inside a `describe` under `RUN_ENGINE_DEEP` whose title ends
     "[deep, ENGINE_DEEP=1]", which is the file's own pattern.
  2. **The frozen mutant list names the wrong-side build.** The census marked "white reads wtime" and "black reads
     btime" as possibly the only default-lane killers of a level-mode wrong-side build (`UNKNOWN - verify`). So the
     list must hold `WRONGSIDE`: the session hands white's search `btime`, and black's `wtime`. Condition 2 then
     decides by evidence, not by assumption.
  3. **Retitles (BA/PM's word, condition 3).** `QE-208-a`'s `it` title states the readings it samples, exactly.
     `QE-208-b`'s two `it` titles name the new root. Both `describe` titles stay, and no other title changes.
  4. **T2d's census is capped.** A4-a2 plus at most two more time-blind rows in the two files that `ABC-244`'s census
     did not list. If the census finds more, none of them joins, and the list goes to the build note for a follow-up.
     This keeps the ticket S.
  5. **The saving is graded on nodes, and the wall is reported.** Every changed row on T2c or T2d reads strictly fewer
     nodes at the tip (node census, as at `ABC-244` A7). `N8-LANE` on the two-file set is charge ≤ 650 ms CPU, with
     H − B reported. `G8` is `NFR-008` ≤ 10 s, the design target is ≤ 9.4 s, and a miss of 9.4 s with H ≤ 10 s does
     not fail the ticket. W1 (below) applies at this gate.
- **The Architect's conditions 1–5 bind as written,** with the amendments above. `AGENTS.md` is not edited (condition
  5).

**W1: given BA/PM's word, with four clarifications.** It is a reading rule, and no level moves.
- **Why.** At `ABC-245` the head median read 9.82 s, the six runs pooled read 9.51 s, and the head's three runs
  spanned 0.75 s. The 9.7 s line sits 0.3 s under `NFR-008`, inside one noisy window's spread. An owner question raised
  on one such window costs his time and settles nothing. With a second window, one bad window cannot decide alone.
  The rule filters only the route to the owner: the 10 s line and D6 are not filtered, so `NFR-008` carries no new
  risk.
- **Clarifications:**
  1. **Same tree.** The confirmation reads the byte-identical head tree (`src/`, `tools/`, `data/`, `package*`,
     `vitest.config.ts`). A read on any other tree is a new reading, not a confirmation.
  2. **The arithmetic.** The median of six is the mean of the 3rd and 4th sorted head walls. Above 9.7 s routes to the
     owner. Exactly 9.7 s does not.
  3. **Admissibility.** The second window is held to the first window's pre-registered rules (wait-clear, load1 and
     Tctl gates, no foreign vitest). If it is not admissible, it is re-run once. If the re-run is also not admissible,
     the addendum's text reads alone and the first reading routes. The rule fails toward the owner, not away from him.
  4. **Not a merge gate.** A ticket's bar stays `NFR-008` ≤ 10 s. The confirmation does not hold a verdict or a merge.
     QE runs it in the same hop when the window allows; otherwise the Orchestrator dispatches it in the next ALONE
     slot. A crossing that does not confirm is recorded with both medians, and the next admissible head median above
     9.7 s starts W1 again.

**`T-QEHOP-GROWTH` (`ADR-0035` B3), disposition.** A QE re-read hop is owed, and no ticket. B3 already says what the
trigger does: QE re-reads the set's `N8-LANE` at `main`'s tip on `qe-ABC-154`'s method; MET means Architect/Design
writes the reading and sets the next threshold, and NOT MET goes to the owner. Nothing is built, so there is nothing to
cut. The re-read is ALONE and LOW. It blocks no ticket, does not ride inside `ABC-248`'s gate (B3: "a changing ticket's
own reading resets nothing"), and is the Orchestrator's to dispatch. B3's projection puts the set at about 0.49–0.52 s
of a 650 ms bound at 4 000 notes. `main` held 4 209 notes at `209f4c5f`.

**No owner word is owed.** No NFR level, cap, pin, W, step set or lane command moves. This section is insertions
only.

**Dated 2026-11-01 (`bapm-ABC-248-close`, records only, at `main` `37a93b76`; nothing run or timed).** Three lines,
insertions only. No NFR level, cap, pin, W, step set or lane command moves, and no owner word is owed.

- **Tranche 2 is delivered.** `ABC-248` merged at `ef4cd095` (code `71700836`) with QE PASS_WITH_GAPS, no gap
  blocking (`qe-ABC-248` `…cf9bdabf`); UAT waived (0 production lines). Every lever met its condition: T2c-a and
  T2c-b kept (plants 26 → 26); T2a moved 4 rows and kept "white reads wtime" and "black reads btime" as the sole
  default-lane killers of `WRONGSIDE` (parity 120 → 120); T2d took A4-a2 to step 1 000 (8 = 8); the census added 0.
  **`G8` H 9.09 s, B 9.37 s**: `NFR-008` MET, the 9.4 s design target MET, W1 not triggered. `N8-LANE` H−B CPU
  −0.635 s. So no tranche 3 opens, and W1 stays in force on every later admissible `G8` head median. This ADR's
  § Status still reads "tranche 2 is OPEN"; a Status line saying it is delivered is the Architect's (owed, LOW).
- **Ruling 6 / A10's `-t` form is corrected (QE-248-a, MEDIUM).** Vitest reads `-t` as a regular expression, so a
  title ending "[deep, ENGINE_DEEP=1]" is a character class and `-t "<moved describe>"` runs **0 tests and exits 0**.
  The binding form escapes both brackets, on one line:
  `ENGINE_DEEP=1 NODE_OPTIONS=--max-old-space-size=400 npx vitest run src/uci-session.test.ts -t "ABC-167 A5 — the D4 time rule, read from the info line's time \[deep, ENGINE_DEEP=1\]"`.
  **The check is the passed count, not the exit code:** "4 passed", one per moved row. The same holds for any `-t`
  that names a `[deep, …]` title in any later ruling or brief: escape the brackets, or stop before them, and check the
  passed count equals the rows meant. `ABC-248`'s page carries the same fix (ruling 6 and A10). The Architect's
  condition 4 in § Addendum 2026-10-31 (Decision) spells the unescaped form; a matching co-edit there is **owed to the
  Architect**, LOW, not blocking, because this line binds the gate. `AGENTS.md` needs no edit: its `-t "ABC-221 A10"`
  stops before the bracket.
- **SE-248-b / QE-248-b: condition 2 is met as written, and one floor is added for depth-sensitive rows.** Condition 2
  (`ABC-244`'s, carried as ruling 2) counts intervals as ⌈budget ÷ step⌉. A4-a2 goes 40 → 4, which is ≥ 2, so it
  passes. At step 1 000 its search reached depth 3 on 1 044 nodes, against depth 6 on 34 836 at step 100: about one
  in-search node check. It stands, because the census classes it time-blind, it asserts no depth, and its kill set is
  equal (8 = 8). **No Architect reading of "interval" is owed before the next step move.** Kill-set parity decides
  first, and it already caught the depth-sensitive loss `QE-244-a` found on CLI `ABC-241` A4/A7. But parity covers only
  the frozen list, so this floor is added (BA/PM's word, binding on every later R4 step move from this date):
  - **A depth-sensitive row** is one that asserts the depth reached, or a move, score or PV that a shallower search
    could change. The build note's R1 census line classes each changed row as depth-sensitive or not.
  - For a depth-sensitive row, the build note also records the depth reached and the nodes at the current and the
    candidate step, and the in-search node checks at the candidate step (nodes ÷ `NODES_PER_CLOCK_CHECK`, rounded
    down).
  - **If that count is below 2, the row keeps its current step** until the Architect rules condition 2's unit (clock
    reads or node checks). The floor never makes a step coarser; it can only hold one.
  - So the Architect's reading falls due only when a move trips the floor. It is owed to no one now.
