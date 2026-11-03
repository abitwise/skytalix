---
id: ABC-263
title: "SPIKE: can skytalix use the NPU, the iGPU and more CPU threads from Node.js on this host, and share search info between them? (records only; Architect; recommends, changes no rule)"
status: done
column: Done
closed: "2026-11-01, Done on the board (qe-ABC-263 PASS_WITH_GAPS …f9116735, records spike, UAT waived; merged 749a7fe3; the Orchestrator ff775417). It delivered ADR-0057 (ACCEPTED 2026-11-02, owner OQ-1..6 …81ae2db4). Front matter by bapm-epic011-cut 2026-11-03 (page drift since the close; the board already read Done). Was: backlog, DoR 10/10 (bapm-spike-accel)"
size: M
priority: P2
epic: EPIC-011
feature: —
owner: Architect/Design
---

# ABC-263: SPIKE, accelerators and threads for skytalix on this host (records only)

> **CLOSED 2026-11-01, DONE; page folded 2026-11-03 by BA/PM** (task `bapm-epic011-cut`, records only, at `main`
> `17725732`; nothing run). A front-matter fold only: the page still read `backlog` after the close (the Orchestrator's
> brief). No row, bar or scope line below moves.
> - **Done on the board 2026-11-01:** QE PASS_WITH_GAPS against A1–A8 (`qe-ABC-263` `…f9116735`; observations
>   `…a0f664f4`, `…89232ca8`, `…5e4c6533`), merged `749a7fe3`; a records spike, so UAT was waived. Its gaps went to
>   `arch-adr0057-fix` (G1 MEDIUM, G3–G8 LOW), since folded.
> - **What it delivered:** `ADR-0057` (threads before devices), **ACCEPTED** 2026-11-02 on the owner's OQ-1..6
>   (`…81ae2db4`). Threads were opened and cut (`ABC-265` Done, `ABC-266` parked, `ABC-267` folded); devices parked
>   (OQ-5 no); a net later (OQ-6). `ADR-0057` § D8 (2026-11-02, the owner's Gemini analysis) added no ticket.
> - `EPIC-011` § Tickets row 15 reads Done.

> **Cut 2026-11-01 by BA/PM** (task `bapm-spike-accel`, records only, at `main` `7c67d3ad`; nothing run, built or
> timed). **Source: the owner's word** (`orch-2026-10-30a` `…78c476bf`, verbatim there): *"yeah make spike ticket for
> Architect in Epic 011 to investigate if it is possible to utilize NPU and CPU, parallelize node.js on multiple threads
> and somehow use video memory to share search info between NPU/GpU runs so it would not go to waste."*
> **`EPIC-011` tickets row 15.** This ticket sits outside the classical phases 0–5. It may run at any time, because it
> only writes records. No phase ticket waits on it, and it waits on none. **DoR 10/10.** Column moves are the
> Orchestrator's.

## Problem

- **User:** the owner, who is the stakeholder for the 3 000 goal (`EPIC-011`).
- **Pain:** the engine searches on one thread. The host has a Ryzen AI 9 HX 370: an XDNA 2 NPU, a Radeon 890M iGPU and
  4 fast + 8 slow cores (per the brief; the Architect confirms the core and thread counts on the host,
  `UNKNOWN - verify`). Most of that hardware sits idle. 3 000 is already beyond the best public single-threaded
  TypeScript precedent (`RISK-EPIC011-01`, `ADR-0056` D3).
- **Value:** a recorded, evidence-backed answer to whether that hardware is a path worth opening, and at what cost and
  risk. The answer comes before any build is spent, and before the owner is asked to change scope.
  `EPIC-011` § Out of scope keeps threads and any neural or learned runtime component out today.

## Scope

The Architect answers four questions. Each answer carries a feasibility verdict, an effort, the expected Elo or speed
effect, and its risks (A2).

- **Q1. NPU and GPU from Node.js on this host (Linux).**
  - **Runtimes:** which ones actually work. At least these: WebGPU through Dawn or another Node binding; ONNX Runtime
    with the Vitis AI execution provider (XDNA 2); ROCm (HIP) or OpenCL on the 890M.
  - **What could be offloaded with a neural net:** an NNUE-style net on the CPU (no device) against an Lc0-style net on
    the GPU or NPU.
  - **What could be offloaded without one:** batched evaluation, offline Texel tuning (`ABC-239`'s method), and
    tablebase generation.
- **Q2. Multi-threaded search in Node.js.**
  - The mechanism: `worker_threads`, `SharedArrayBuffer` and `Atomics`.
  - Lazy SMP with a shared lockless transposition table.
  - Expected node-rate scaling and Elo per doubling of threads on 4 fast + 8 slow cores, at 100 ms and at 40/15.
- **Q3. Sharing search info between CPU threads and GPU/NPU work,** through shared or video memory, *"so it would not
  go to waste"*.
  - On an APU with unified memory: what latency, coherence and transfer costs apply from Node.js.
  - Whether a transposition table or history table shared between CPU workers and device kernels is feasible.
- **Q4. How it meets the owner's standing rules.** These are: tests on one core; the 100 / 400 reads at 100 ms; the
  classical path (`ADR-0056`); and the 40/15 claim against Stockfish at `Threads 1`.
  - For each rule: what would have to change, and what a fair comparison looks like.
  - **The spike recommends. It changes no rule.**
- **Deliverable:** one proposed ADR in `memory-bank/50-decisions/` (Status: proposed, spike `ABC-263`, records only), or
  one sealed analysis note in the hop's context. Either way it ends with a recommendation. The Architect chooses which
  form.

## Out of scope

- **Any production line or test.** No path under `src/`, `tools/` or `data/`, and no change to `package*.json`,
  `vitest.config.ts` or `tsconfig*` (A8).
- **Changing scope or a rule.** Lifting `EPIC-011`'s out-of-scope lines (threads, neural), `EPIC-004`'s neural
  non-goal, `ADR-0044` D5, Q-3K-3 or any NFR bound is the owner's word (`memory-bank/45-standing-rulings.md`, 2026-10-22).
  The spike may only recommend it.
- **Host changes.** No `sudo`, and no system package, driver, firmware or kernel-module install (XDNA driver, ROCm,
  Mesa or Vulkan stack). If a runtime needs one, the verdict is `works-after-host-change`, with the change named. It is
  then the owner's call.
- **Games or ratings of any build.** No Elo is read in this spike. Elo figures are estimates with a source.
- **Follow-up tickets.** They are cut by BA/PM after the owner answers the questions this spike raises.

## Acceptance criteria

The base is `main` at the commit the hop branches from. The delivered commit is the hop's last records commit.

- **`A1` (one deliverable).** **Given** the delivered commit, **then** exactly one deliverable exists, of one of two
  kinds:
  - a proposed ADR at `memory-bank/50-decisions/ADR-NNNN-<slug>.md` whose Status line names `ABC-263` and "proposed";
  - a sealed `decision` note under `.grugops/context/<task>/notes/` that names `ABC-263` among its refs.
  It reads back `sealed` from `readContext`.
- **`A2` (every answer has the same shape).** **Given** the deliverable, **then** each of Q1–Q4 has a row or section
  with five fields. **No field is empty.** An unknown is written `UNKNOWN - verify` with what would settle it. The
  five fields:
  - **verdict:** one of `works-on-this-host-now`, `works-after-host-change` (the change named), `not-feasible`, or
    `UNKNOWN - verify`;
  - **effort:** XS–XL, with an hours range;
  - **expected effect:** a speed factor range and/or an Elo range, each at a named control (100 ms, 4 s, 40/15). Each
    is labelled `measured` or `estimate`, and every estimate names its source;
  - **risks:** at least one, or "none found" stated;
  - **evidence class for each claim:** `measured` (command, host, UTC date, output path), `documented` (URL and read
    date), or `UNKNOWN - verify`.
- **`A3` (Q1 covers each runtime and each workload).**
  - **Runtimes:** the A2 verdict for at least four runtimes: WebGPU via a Node binding; ONNX Runtime + Vitis AI EP;
    ROCm/HIP; OpenCL.
  - **Workloads:** a row for each of five: (a) an NNUE-style net on the CPU; (b) an Lc0-style net on the GPU or NPU;
    (c) batched classical evaluation on a device; (d) offline Texel tuning on a device; (e) tablebase generation on a
    device. Each row says whether it needs a neural net (yes or no).
  - **Device rows (b)–(e):** one device dispatch's round-trip latency, in µs, set beside the search's per-node time.
    Today that is about 1.1–1.6 µs a node (0.63–0.90 M nodes/s, `ADR-0055` § Speed readings, `qe-ABC-240`).
- **`A4` (Q2 gives numbers).**
  - **Models:** names the threading model(s) weighed, Lazy SMP with a shared lockless TT at minimum.
  - **The table:** states how a TT entry is laid out and checked in a `SharedArrayBuffer`, and the race it accepts
    (torn writes).
  - **Scaling:** expected node-rate scaling at 1, 2, 4, 8 and 12 workers, with the fast/slow core split stated.
  - **Elo per doubling of threads:** at 100 ms and at 40/15, separately, each labelled `measured` or `estimate` with a
    source.
- **`A5` (Q3 answers each split).** For this APU and each runtime that passed A3, the deliverable states three things:
  - whether a `SharedArrayBuffer` used by CPU workers can be visible to the device without a copy, from Node.js (yes,
    no or `UNKNOWN - verify`);
  - one device dispatch's round trip in µs, set beside one search node;
  - an A2 verdict for each of two options: (i) a table shared by CPU workers only, and (ii) a TT or history table
    shared by CPU workers and device kernels.
- **`A6` (Q4 lists the rules and their owners).** At minimum these rules are listed:
  - Q-3K-3, *"Keep game on one core"* (`…f7a50e95`), under both readings: one game at a time, and a single-threaded
    engine;
  - the 100 / 400 reads at 100 ms (`ADR-0056` C2′, C3″);
  - the classical path (`ADR-0056`) and `EPIC-011` § Out of scope (threads; neural);
  - `EPIC-004`'s neural non-goal, and `ADR-0044` D5 (one thread, no worker);
  - the 40/15 claim and the smoke S′ against Stockfish `Threads 1`;
  - `G4`'s node-for-node door (`ADR-0026`) and determinism in the default lane;
  - `NFR-008` (≤ 10 s) and `NFR-009` (≤ 16 MiB).
  For each one it states what would have to change, whose decision that is (owner or Architect), and what a fair
  comparison would be. **Given** `git diff <base> <delivered> --name-only`, **then** no ADR other than the new proposed
  one, no NFR row and no epic or ticket page is changed.
- **`A7` (a recommendation and owner questions).** Each of the three strands (accelerator, threads, shared memory) gets
  one recommendation:
  - `pursue now`;
  - `pursue after EPIC-011 phase N`;
  - `park` with a measurable re-open trigger;
  - `drop`.
  Every scope or rule change it implies is written as an owner question that can be answered yes or no, or by a choice.
- **`A8` (fence, host and cost).** **Given** `git diff <base> <delivered> --name-only`, **then** it lists:
  - no path under `src/`, `tools/` or `data/`;
  - none of `package.json`, `package-lock.json`, `vitest.config.ts` or `tsconfig*`.
  Prototypes:
  - live only in scratch outside the repository and are removed at hop end. The note lists each one and the peak
    scratch size;
  - each runs **≤ 5 min wall**, under `flock host-test.lock`. Its start and end UTC are listed, and the summed host
    time is reported;
  - use no `sudo` and no system install.
  An experiment estimated **over 1 h** is asked of the owner (through the Orchestrator) and not run without his word.

## NFR triggers

- **Host time:** each prototype run ≤ 5 min wall (BA/PM's reading of the brief's "a few minutes"; the Orchestrator may
  correct it). Any experiment over 1 h is asked first (owner, `…aab3b5f4`).
- **Scratch disk:** peak ≤ 2 GB, removed at hop end. The scratch volume's quota is about 10 GB, and it hit EDQUOT
  before (QE-262-c).
- **Security (ASVS L1):** product not triggered, because no product line changes. Third-party native packages (an ONNX
  Runtime binding, a WebGPU binding) are installed only in scratch, from the npm registry, never into the repository's
  dependency tree. No secret is read.
- **`NFR-008`, `NFR-009`, `NFR-004`, `NFR-005`:** not triggered by the spike. A6 states how a follow-up would meet them.

## Test notes

1. **QE reads the deliverable against A1–A8** (a `qe-e2e` hop is owed on every ticket). A2's empty-field rule and A8's
   `git diff` are mechanical checks.
2. **No production line, so UAT is waived** if `git -c core.quotePath=false diff --name-only <delivered>~1 <delivered> |
   grep -v '\.test\.ts$' | grep '^src/'` is empty (`AGENTS.md`, 2026-08-17). QE's verdict is the gate.
3. **Prototype figures are informal.** They are labelled `measured (informal)`, never a grade or a reading.
4. **A multi-core prototype needs an ALONE window.** A scaling run on 12 cores beside another hop's timed read spoils
   both. The Orchestrator schedules it ALONE, under the lock.
   - **BA/PM's reading:** a ≤ 5 min scaling prototype is not a validation game, so Q-3K-3's "one core" does not bind
     it. The Orchestrator confirms this at pull, or rules the prototype out. If ruled out, A4's figures are
     `estimate`.
5. **Rollback:** revert the delivered commit (records only).

## Size and priority

- **Size: `M`.** Four questions; desk research on three runtime families; a few prototypes of ≤ 5 min each; a map of
  the rules. About one Architect hop (estimate). **Not `S`:** three distinct device stacks, plus a threads model and a
  rules map. **Not `L`:** no build, no reading, no games. **Split candidate**, if the Architect estimates above M:
  accelerators (Q1 + Q3) apart from threads (Q2 + Q4). It is not split now because Q3 needs both.
- **Priority: `P2`.** The owner asked for it by name. **Not `P1`:** nothing on the classical path waits on it, and
  the follow-ups need scope the owner has not opened. **Not `P3`:** it is the owner's own request, and it is cheap.

## Dependencies

- **None hard.** Inputs to read:
  - `ADR-0055`: the speed path, Elo per speed doubling, O2/O3 not pursued;
  - `ADR-0056`: D3, C1, C2′, C3″, S′;
  - `ADR-0044` D5;
  - `ADR-0025`: the TT structure;
  - `ADR-0026`: the door;
  - `EPIC-011` § Out of scope;
  - `ABC-253`, the 32-bit Zobrist halves. If it has merged by pull time, it gives the TT key layout to read;
    otherwise today's `main` does. `UNKNOWN - verify` at pull.
- **Parallel-safe:** this ticket only writes records. It may run beside an SE hop, provided it takes no timed host read
  inside that hop's ALONE windows (test note 4).
- **Owners:** Architect: A1–A8. QE: A1–A8 re-read. Owner: the questions A7 raises. None is asked before the spike.

## Definition of Ready

BA/PM, 2026-11-01, at `main` `7c67d3ad`. **Result: 10 of 10.**

| # | item | verdict |
|---|---|---|
| 1 | problem clear | ✅ owner's word; idle NPU, iGPU and cores; the 3 000 goal is beyond single-thread precedent |
| 2 | scope and out-of-scope clear | ✅ four questions, one deliverable; no code, no rule change, no host install, no games |
| 3 | INVEST-shaped | ✅ independent of every phase; M; testable by A1–A8; split line named |
| 4 | acceptance testable and measurable | ✅ fixed verdict set, no empty field, named runtimes, workloads and worker counts, µs beside the per-node time, ≤ 5 min a run, diff fence |
| 5 | dependencies known | ✅ none hard; inputs named; `ABC-253`'s layout `UNKNOWN - verify` at pull |
| 6 | security/NFR triggers with a measurable target | ✅ ≤ 5 min a run; > 1 h asked; scratch ≤ 2 GB; scratch-only native packages |
| 7 | test notes present | ✅ five |
| 8 | size assigned | ✅ `M` |
| 9 | priority assigned | ✅ `P2`, both directions argued |
| 10 | no major unresolved blocker | ✅ none; test note 4's reading is the Orchestrator's to confirm at pull, and either answer leaves A4 gradable |
