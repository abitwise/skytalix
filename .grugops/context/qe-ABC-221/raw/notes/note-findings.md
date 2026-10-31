# `ABC-221` QE findings and handoffs: QE-221-a LOW (two survivors in the mode, test-only), QE-221-b INFO (a stale `levels.ts` comment D8 fences), QE-221-c INFO (host: a foreign orphan process during the ALONE window); SE-221-a confirmed; none blocks

## Findings
- **QE-221-a (LOW, test strength; nothing to fix in the product): two `uci-clock-mode` behaviours no row pins.**
  - **HSCM survives the whole lane:** the hard stop `t − 1 100`, dropped in the mode only.
    - A5's given (`go wtime 3000 btime 3000 movestogo 1`) cannot tell the hard stop from the spread. With no increment
      and t ≥ 1 000 the spread never exceeds it, and at m = 1 the two are equal.
    - No row in the mode sends an increment near the clock edge.
    - The mutant hands 1 890 ms with 800 ms on the clock (`winc 2000`), which loses on time.
  - **CLOCKWINSCM survives:** a clock beats `movetime`, in the mode only. No row in the mode sends both.
  - **Why LOW:**
    - The head is right. QE's out-of-tree oracle is 0 FAIL on 4 914 records in the mode, and it catches both mutants
      (1 386 and 112 FAIL).
    - The shared code is pinned through `simple-tournament`'s rows (`ABC-220` "the hard stop on the clock left …";
      D3's movetime-first rule), so only a mode-specific regression would slip through.
    - Same class as `QE-220-a` (QM4), which became A12 here.
  - **Fix, test-only, two rows in `src/uci-session.test.ts`'s `ABC-221` block:**
    - `go wtime 3000 btime 3000 winc 500 binc 500 movestogo 1` → 1 900;
    - `go wtime 900000 btime 900000 movestogo 40 movetime 5000` → 5 000.
  - **Route:** BA/PM's call. It can be a dated line for the next ticket that touches the file, or a small test-only
    ticket.
- **QE-221-b (INFO, records): `src/levels.ts` lines 49–50 say "`HARD_CEILING_MS` is the largest of them" (the level
  ceilings).**
  - That is false at head: the clamp is 60 000 and the largest level ceiling is 32 000.
  - `ADR-0052` D8 fences `src/levels.ts` for this ticket, so the SE rightly did not edit it.
  - It sits beside `SE-221-g`'s stale `engine.test.ts` comment. For the next ticket that touches `levels.ts`, or for
    BA/PM's `ADR-0045` § AMENDMENT A3 fold line.
- **QE-221-c (INFO, process/host): a foreign orphan `python3 -I -` held one core at 100 % through QE's ALONE window.**
  - It has ppid 1 and its cwd is `.claude/worktrees/secnfr-ABC-221`. Its task output reads "exited with code 144", so
    the task was stopped and the child was left behind.
  - Effect: Tctl stayed at 71–73 °C, above `host.mjs`'s 60 °C clear. QE did not kill it, because it is not QE's.
  - The deep lanes, the probe and `G8` ran with the deviation recorded (timing note). The thermal stop (85 °C) was never
    near. vitest = 0 and cutechess = 0 throughout.
  - **The Orchestrator should reap it.** It is still running at QE's hand-off unless stated otherwise.

## The SE's findings, read by QE
- **SE-221-a: CONFIRMED** (oracle note). A6 as worded leaves 17 205 ms after move 80. alloc.txt's shape (+900 000 after
  move 40) gives a closest call of 117 735 ms after move 40. The bound (≥ 1 000 ms) holds on both.
  - **BA/PM, at the fold:** correct A6's "(≥ 117 s by arithmetic)" to 17 205 ms, or add "+900 000 after move 40" to A6.
  - D4's sentence ("80 moves leave ≥ 117 s") belongs to the Architect.
- **SE-221-b (INFO): QE agrees with the reading. The Architect owns D8.**
  - A10's `spawnSync` is defined only under `ENGINE_DEEP=1`. QE's `ENGINE_DEEP` run defined it, and the default lane did
    not: lane inventory 63 = 63, and `none` is 2 363 green with no child.
  - The child is `node --expose-gc -e`, not the delivered entry point.
- **SE-221-c / SE-221-d (INFO): the re-pins outside the ticket's files and the one removed row are sound.**
  - `engine.test.ts` RF-1 pins 60 000, and only comments change in the next two rows.
  - `levels.test.ts` clause B swaps the retired `ADR-0045` A3 equality (max level ceiling = clamp) for "clamp 60 000, max
    level ceiling 32 000, ≤ the clamp". That is D6 as worded, and CLAMP32/CLAMP45/CLAMP59500 turn it red.
  - The removed `ABC-220` A1 "not offered" row is false by design at this build and is replaced by `ABC-221` A1's
    positive pin.
  - `ABC-220` A10's refused value moved to `Uci-Clock-Mode`, so case-exactness stays covered.
  - The names diff is in the timing note.
- **SE-221-e, SE-221-f, SE-221-g (INFO): read; no QE action.** `G8` gives SE-221-f its formal reading.

## What Security/NFR needs
- **`NFR-004`:** A10's walls are 59 500.1, 59 500.8 and 59 499.4 ms (max 59 500.8 ≤ 60 000). The overshoot past 59 500
  is ≤ 0.8 ms, against `AR-NFR004-A`'s ≤ ~31 ms. Every budget handed in the mode is ≤ 59 500 (oracle).
- **`NFR-009`:** heapUsed grows +0.12 MiB at most, arrayBuffers grows 0, and arrayBuffers is 4.51 MiB (≤ 16 MiB).
- **`AR-UCI-BUSY`:** the A14b R1 drain is 0.41 ms. 59 500 + 31 + 100 = 59 631 < 60 000, so "≤ 60 s" holds exactly.
- **`NFR-008`:** see the timing note's `G8`.
