---
id: ABC-147
title: "How much of `npm test`'s ~27 s of CPU is vitest's ~4.35x per-node engine overhead? Read it before anyone builds a lever"
status: backlog
column: Backlog
size: XS
priority: P2
epic: —
feature: —
---

# ABC-147 — a probe, not a fix: the share of the default lane's CPU that runs production code under vitest's ~4.35x per-node overhead, and what removing it could buy

> **Cut 2026-10-11 by BA/PM** (task `wave-2026-09-25`, subtask `bapm-fold-qe114-2026-10-11`, Workflow 07),
> on the open question Architect/Design routed here and did not rule (`ADR-0040` addendum, "Does the vitest
> runner's ~4.3x per-node overhead change any of this?"; notes `…7974985e`, `…be323233`).
>
> **This hop ran nothing and timed nothing.** Every figure is cited. The arithmetic below is on recorded
> readings only.

## Problem

*User*: the owner at the M3 keyboard, whose stated goal is "reduce cpu usage" (`ABC-144`, P1), and every
agent hop that runs `npm test` several times.

*Pain*: `ABC-085`'s Engineer read the engine at **~4.35x the CPU per node inside vitest** against plain
`node`: 4.23–4.46x, the same 145 765 nodes, under both `threads` and `forks` (`…70684a78`, `RUN.txt` item 4).
The cause is `UNKNOWN - verify`. The guess is the module transform's import indirection in hot paths, and it
is not shown. **Nobody knows how much of the default lane's CPU (base median 27.15 s, Window A,
`…a898a14a`) is production code paying that factor.** `ABC-144`'s worker cap cannot reach it: the cap
limits how many workers run, and the overhead is per node inside one worker (`ADR-0040` addendum).

*Value*: one reading decides whether a second CPU lever exists, and how big it is, before anyone designs one.
**Break-even, arithmetic only:** removing a 4.35x factor recovers 1 − 1/4.35 ≈ **77 %** of the CPU it
inflates. So if production code is about **21 %** of the lane's CPU, the lever matches `ABC-144`'s K3 cut
(−16.48 %). If it is under ~6.5 %, the lever is worth under 5 % and is not worth building.

## Scope

1. **Read, do not change.** Attribute the default lane's CPU by where it is spent, and re-read the per-node
   ratio on the lane's own heaviest production workload.
2. **Estimate** the CPU that removing the factor could recover, with its band.
3. **Apply the decision rule** in `A4`. It is pre-registered here, so the reading cannot be argued into a
   ticket afterwards.

## Out of scope

- **Any change to `vitest.config.ts`, `package.json`, `tsconfig.json`, a test or a source file.** Finding a
  setting that removes the overhead is the lever ticket `A4` may trigger. It is not this ticket.
- **Proving the cause.** It is reported if a single A/B the hop names shows it. Otherwise it stays
  `UNKNOWN - verify`, and this ticket still closes.
- **`ABC-144`'s three settings** (cap, pool, file parallelism) and `isolate` (`ADR-0008` d7).
- **The `*_DEEP` lanes.** They are read only if the hop chooses to, and are never a bar here.
- **`ABC-146`'s verdict route.** Plain `node` already removes the factor there.

## Acceptance (Given/When/Then)

- **`A1` (where the lane's CPU goes).** **Given** `npm test` at a named commit and worker setting, **when** it
  is CPU-profiled on **n ≥ 3** runs (the method is the hop's, declared before the first run, and it must
  profile every worker), **then** the share of sampled CPU is reported in five buckets as median %, with
  min–max:
  - (i) production modules under `src/` (not `*.test.ts`);
  - (ii) test files;
  - (iii) the vitest / vite / tinypool runtime and module transform;
  - (iv) Node internals and GC;
  - (v) unattributed.

  The five medians sum to 100 % ± 2. Bucket (i)'s **top five files** by CPU are named. The lane's total CPU
  (user + sys) and file and test counts are recorded on every run, and they match the commit's `npm test`
  counts.
- **`A2` (the factor on the lane's own workload).** **Given** the two default-lane test files with the most
  bucket-(i) CPU, **when** a representative production call from each is run under plain `node` and inside
  vitest, paired and interleaved, **n ≥ 3** each, **then** the ratio vitest ÷ `node` is reported per file.
  - **The work must be equal, and that is checked:** an equal node count, or an equal deterministic output
    digest. A pair whose work differs is void, not averaged.
  - Probe scripts live under `.grugops/context/<task>/probe/`, never in the tree.
- **`A3` (the estimate).** **Then** the recoverable CPU is reported as **R = lane CPU × share(i) × (1 −
  1 ÷ ratio)**, in seconds and as % of lane CPU, with a band from `A1`'s min–max and `A2`'s ratio range. It
  is labelled an estimate. If `A2`'s ratios differ by more than 2x between the two files, both are carried
  into the band, and no single ratio is quoted.
- **`A4` (the decision, pre-registered).** **Then** the hop states which arm applies, by R's **lower** band
  edge:
  - **R ≥ 15 % of lane CPU** (`ABC-144`'s own bar): BA/PM cuts a lever ticket at **`P1`** (the owner's
    goal), routed to Architect/Design for the setting.
  - **5 % ≤ R < 15 %:** it is reported to the owner as an option. No ticket is cut without his word.
  - **R < 5 %:** closed. The `ADR-0040` addendum's open question is answered by this ticket's note.
- **`A5` (fences and manners).**
  - `git diff --name-only <base>` lists only paths under `plans/` and `.grugops/`. **0** paths under `src/`,
    `tools/` or the repository root.
  - **The probe never runs during a no-other-hop window** (`ABC-144` Window B, any `ADR-0035` reading) or
    during `ABC-146`'s verdict run. It is another hop by that definition.
  - load1 and `com.apple.system.thermalpressurelevel` are logged before every run. `A1` reads proportions
    and `A2` reads paired ratios, so neither needs a quiet window. A run at load1 > 8 is recorded and not
    used.

## Dependencies

- **None blocking.** Pullable now.
- **Order, not a block:** if `ABC-144`'s cap merges first, `A1` is read at the capped setting, and the note
  says which. The factor is per node, so the cap does not change `A2`.
- **Scheduling:** the Orchestrator keeps it out of every no-other-hop window and off `ABC-146`'s run (`A5`).

## Security / NFR triggers

- **`NFR-008`:** a reading of its CPU clause, which R-1 reports and does not level. This ticket adds 0 files,
  0 tests, 0 spawns, and moves no level.
- **Security: not triggered.** No code, no input surface, no network.

## Test notes

1. **Declare the profiling method before the first run** (`A1`). A method picked after seeing numbers is a
   choice of numbers.
2. **The equal-work check is the reading's floor** (`A2`). `ABC-085` showed equal node counts under both
   runners. Copy that check, not its number.
3. **Do not read bucket (iii) as the overhead.** Indirection paid inside a production function is billed to
   that function. That is why `A3` multiplies bucket (i) by the measured ratio rather than reading bucket
   (iii).
4. **QE re-reads `A1`–`A3` from its own runs** (the owner's standing QE hop). It does not quote the probe
   note's numbers.

## Size and priority

**`XS`.** One reading hop, no code, no config, no test. About 3 profiled lane runs plus two paired probes.

**`P2`.** It delivers no CPU cut by itself; `ABC-144` is the owner's lever and stays `P1`. It is cheap, and
the break-even arithmetic says it could find a lever as large as `ABC-144`'s. **Not `P3`:** it serves the
owner's stated goal, and every week without it is a week of an unread lever. **`P1` PROMOTION TRIGGER:** the
owner asks for it, or `ABC-144`'s Window B reads no setting reaching 15 % (`ABC-144` `A1`'s fork).

## Definition of Ready

BA/PM, 2026-10-11. **Result: 10 of 10.** Recommended placement: `Ready`.

| # | item | verdict |
|---|---|---|
| 1 | problem clear | **✅** a measured 4.35x factor and an unmeasured share; the owner's CPU goal |
| 2 | scope and out-of-scope clear | **✅** read only; every change, the cause and `ABC-144`'s settings fenced off |
| 3 | INVEST-shaped | **✅** independent; one reading; the decision rule is fixed before the reading |
| 4 | acceptance testable and measurable | **✅** five buckets summing to 100 % ± 2, n ≥ 3, paired ratios with an equal-work check, R with a band, a three-arm rule |
| 5 | dependencies known | **✅** none blocking; the window rules are named |
| 6 | security/NFR triggers with a measurable target | **✅** `NFR-008` reading only; 0 / 0 / 0 |
| 7 | test notes present | **✅** four |
| 8 | size assigned | **✅** `XS` |
| 9 | priority assigned | **✅** `P2`, with a `P1` trigger |
| 10 | no major unresolved blocker | **✅** |

Column moves are the Orchestrator's.

## Delivery

Software Engineer (Claude Opus 5.5, subagent of the Orchestrator), 2026-10-11, subtask `ticket-to-pr-ABC-147`.
Branch `grugops/ABC-147-vitest-overhead-probe` from `63ac790f`. The method was committed `d152298f`, before the
first graded run. Not merged, not pushed. The readings are in `.grugops/context/ticket-to-pr-ABC-147/notes/`.
The raw data is in `probe/raw/`. **QE re-reads `A1`–`A3` from its own runs (Test note 4).**

- **`A1`.** n = 6 usable profiled runs at the **uncapped** setting (7 workers; `ABC-144` has not merged).
  - Every run: 54 files / 1715 tests, exit 0.
  - Shares of sampled CPU, median (min–max):
    - (i) production **42.93 % (37.68–44.19)**;
    - (ii) tests 1.43;
    - (iii) runner 12.15;
    - (iv) Node and GC 42.08;
    - (v) unattributed 1.82.
    - The medians sum to 100.41.
  - (i) inside vitest workers, (i-w): **42.62 % (37.27–43.91)**.
  - Top five production files: `moves.ts` 19.6, `legal.ts` 7.1, `position.ts` 5.5, `apply.ts` 2.3,
    `evaluate.ts` 2.2.
  - load1 4.76–6.00 before every graded run. Thermal pressure was 0, except run 17, which started at 2.
- **`A2`.** The top two files by (i-w) were `engine.test.ts` and `search.test.ts`. 5 pairs each,
  interleaved, with a digest equal on every pair (0 void). load1 5.18–5.95, thermal 1.
  - vitest ÷ `node`: **5.09 (4.93–5.38)** and **5.03 (4.95–5.18)**. They are within 2x of each other.
- **`A3` (estimate).** Lane CPU is 28.10 s (unprofiled median, n = 9).
  - **R = 34.2 % = 9.6 s, band 29.7 %–35.8 % (8.4–10.0 s).**
  - On the letter, with all of (i): 30.0 %–36.0 %.
  - With cold first-call ratios (sensitivity only): lower edge 26.0 %.
- **`A4`.** The lower edge, 29.7 %, is ≥ 15 %. **Arm: BA/PM cuts a `P1` lever ticket, routed to
  Architect/Design.** This hop cut none. The cause of the factor is still `UNKNOWN - verify`.
- **`A5`.**
  - `git diff --name-only 63ac790f` lists only `plans/` and `.grugops/` paths, with 0 under `src/`,
    `tools/` or the root. `plans/board.md` was not touched.
  - No no-other-hop window was open, and no `ABC-146` run was in progress.
  - 24 runs were recorded and not used: 15 at load1 > 8, plus the profiler-only 60 s hangs (5 of 18
    profiled runs, 0 of 18 unprofiled). See the caveats note `…144c6b5d`.

## Review

Security/NFR (Claude Opus 5.5, subagent of the Orchestrator), 2026-10-11, subtask `secnfr-ABC-147-review`.
It took QE's slot under the owner's docs-only rule. It reviewed `4c634f09` for method, admissibility and
arithmetic, and **re-ran nothing**. Every figure was recomputed from the committed raw files by
`raw-recompute147.mjs.txt`. The notes are in `.grugops/context/secnfr-ABC-147-review/notes/`.

**Verdict: PASS_WITH_GAPS.** The `A4` arm stands: **≥ 15 % → BA/PM cuts a `P1` lever ticket.**

- **Method before graded runs: holds.**
  - `d152298f` (10:25:49Z) precedes round 0 (10:25:54Z) and the first graded run (10:51:26Z).
  - `188cb6c3` (10:32:01Z) precedes the first `A2` process (11:09:34Z).
  - `analyze.mjs` is unchanged since. The drivers' later edit adds only a logged wait gate; the
    `usable` rule is byte-unchanged.
- **Exclusions: hold.**
  - The declared rule re-applied to all 36 rows gives 0 mismatches.
  - Excluded runs would not lower the (i-w) minimum.
  - **The count on this page is wrong:** 21 runs were unused, not 24. 20 were at load1 > 8 (4 of those
    also hung), and 12P hung alone. See G1.
- **`A1`: holds.** Each run sums to 100.000. The medians sum to 100.41. (i-w) is 42.62 (37.27–43.91). The
  top five files and the file ranking match.
- **`A2`: holds.** The order alternates per pair. The digests are equal on 10/10 pairs. The ratios
  recompute to E 5.093 (4.929–5.379) and S 5.028 (4.948–5.184).
- **`A3`: holds.** Declared band 29.71–35.75 %, letter 30.04–35.98 %. The cold-call lower edge is
  37.267 × (1 − 1 ÷ 3.306) = **26.0 %**.
- **The ≥ 15 % arm under every allowed reading: yes.** The lowest edge is 26.00 %. To leave the arm, the
  factor would have to be ≤ 1.67x, or the share ≤ 18.8 %.
  - One reading the page does **not** allow, the factor on `engine`/`search` only, gives 11.65 %. That is
    `RISK-ABC147-02`.
- **Risks, accepted with owners:**
  - `RISK-ABC147-01`, `--cpu-prof` hangs 5 of 18 profiled runs at 60 s and 0 of 18 unprofiled. Cause
    `UNKNOWN - verify`. **Owner: QE/E2E.**
  - `RISK-ABC147-02`, a ratio read on 2 files and applied to all of (i-w). **Owner: BA/PM**, in the lever
    ticket, whose acceptance should be a measured lane-CPU cut, not R.
- **Gaps:**
  - G1, the run count (Software Engineer);
  - G2, the aggregator is not committed (Software Engineer);
  - G3, the profiles were deleted (QE/E2E);
  - G4, Test note 4's independent re-read is **not** satisfied by this review (BA/PM's lever ticket /
    QE/E2E).
- **Fences: hold.** 0 paths outside `plans/` and `.grugops/`. `plans/board.md` is untouched. No secret
  is in the probe output.
