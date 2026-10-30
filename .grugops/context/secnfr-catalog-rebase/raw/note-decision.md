# Security/NFR decision, secnfr-catalog-rebase: the reference machine is `oeselg-devl`, and the whole-second reading of "≤ 22 s" is confirmed

Records only, on branch `grugops/secnfr-catalog-rebase` from `main` `5bc22858`. The catalog commit is `b81bdd26`. Nothing was built, run or timed, because a QE held the host alone. The catalog's last section is authoritative, and this note points at it. **No level, bar, target or measured figure moved.**

## The owner's word
- Verbatim, 2026-10-30: *"Catalog reference machine - Ubuntu linux machine - oeselg-devl ; Whole-second reading of "≤ 22 s" - confirm"*.
- This is the Orchestrator's transcription in `orch-2026-10-30a/…f4673b9f`, and it is not a stamp.

## 1. Re-base (`SEC-228-a`, closed)
- **The reference machine is `oeselg-devl`.** That is the owner's label. The stack: AMD Ryzen AI 9 HX 370 w/ Radeon 890M, 24 logical CPUs, Ubuntu 26.04.1 LTS, Linux 7.0.0-42-generic x86_64, Node v26.12.1, vitest 4.1.12 (the lockfile).
- **Where each fact comes from.** The CPU, kernel and Node come from `qe-ABC-220` `raw/alone/A14b.txt` and `qe-ABC-228-ii` `raw/a6/r/machine.txt`. The CPU count, the OS release and the architecture were read at this hop. npm was not read: `UNKNOWN - verify`.
- **The M3 lines are history.** Apple M3 (Mac15,13), 8 logical cores, Darwin 25.5.0 arm64, and Node v26.11.0/v26.11.1 are now history. The rule is the same as the 2026-10-10 runtime re-base:
  - every figure keeps its label, and none is converted;
  - a row whose latest reading is from the M3 keeps it as the latest on record;
  - the row's next gate reads it on the reference;
  - off the reference, every figure is `UNKNOWN - verify`, with no measurement owed.
- **Where it was placed:**
  - a dated line in the `Verified by` cells of `NFR-004` and `NFR-005`;
  - a "Reference stack RE-DECLARED" sentence in `NFR-008`;
  - a dated scope line on `AR-NFR004-A`;
  - pointers in § `ABC-074`, in § `ADR-0035` item 3, and under `SEC-228-a`.

## 2. Which readings stand on the reference (since 2026-10-28) and which are M3 history
- **On `oeselg-devl`:**
  - `NFR-004`: level 5 at 4 000 ms, max 4 001 ms, and levels 6 and 7 at max 5 001 and 30 001 ms (`qe-ABC-228-ii` `G5`). `simple-tournament`: `A6` exact on the budget, and `A11` max 22 001.0 ms (`qe-ABC-220`).
  - `NFR-005`: `ABC-228`'s status (kiwipete 8, position-6 10 at 4 000 ms; `qe-ABC-228-ii` `G6`), and `qe-ABC-228` `G6` at 3 000 ms.
  - `NFR-008`: `ABC-228` `G8` (head 9.61 s, base 8.91 s); `ABC-220` `A12` 9.69 s; `ABC-220` `G8` (base 9.64 s, head 9.73 s).
  - `NFR-009`: the instrument green at 4 000 ms (`qe-ABC-228-ii`, transposition 26/26).
  - `NFR-010`: guard (a) did not throw in green `npm test` runs, for example `qe-ABC-220` `A12` (63 files, 2 297 tests passed). No counts or limits were recorded.
  - `AR-NFR004-A`: +1 ms at 4 000, 5 000 and 30 000 ms, and +1.0 ms at 22 000 ms.
  - `AR-UCI-BUSY`: ≈ 22 001.4 ms (`A11` + `A14b`).
- **M3 history only:**
  - every figure in `NFR-001`, `NFR-002`, `NFR-003` (the compute half), `NFR-007`, `NFR-011` and `NFR-012`;
  - `NFR-010`'s `ABC-173` MET;
  - `NFR-009`'s 30 s figures (`ABC-212`);
  - `NFR-004`'s 2026-10-24 table;
  - every `NFR-005` depth reading before 2026-10-28;
  - `AR-NFR004-A`'s 31 / 12 / 5 ms readings.
  - These rows are `UNKNOWN - verify` on the reference until their next gate. That is `SEC-REBASE-c`.
- **`NFR-006` is not a machine reading.** It is a byte count, and it is MET on any machine.

## 3. The whole-second reading is CONFIRMED
- **What it binds.** "≤ 22 s" in `simple-tournament` means < 22 500 ms. It binds `NFR-004`'s 22 s clause and `AR-UCI-BUSY`.
- **`NFR-004`.** The 22 s clause reads MET (`A11` max 22 001.0 ms). The strict-letter overshoot (≤ 1.0 ms over 22 000) is kept as a fact, and it is not a miss of the clause.
- **`AR-NFR004-A`** is unchanged at ≤ 31 ms.
- **`AR-UCI-BUSY`.** The decline trigger is struck and kept, and a dated bullet is added. The Architect's text and the owner are unchanged.
- **Not extended.** The word does not reach clause A (≤ 4 s), the per-level ceilings or `uci-clock-mode`'s ≤ 60 s.
- **Tickets.** `ABC-220`'s FOLDED confirmation and `ABC-222`'s PREREG `A5` are BA/PM's.

## 4. `SEC-228-b` and `SEC-220-c`
- **`NFR-009`.** "not built yet" is struck and kept. It now reads built at `ABC-081`; MET at 30 s (`ABC-212`, M3 history); and green at 4 000 ms on the reference.
- **`NFR-011`.** A dated line: on Linux, load1 comes from `os.loadavg()[0]` and the CPU from `os.cpus()[0].model`, not macOS `sysctl` (as in `qe-ABC-220`'s `A14b` probe). The first reading is M3 history, and there is no reading on the reference.

## Checks
- **Row hashes.** All 12 NFR rows were hashed (sha256) before and after. Only `NFR-004`, `NFR-005`, `NFR-008`, `NFR-009` and `NFR-011` moved, each by insertion or strike-and-keep. No old text was removed.
- **Paths.** A host-path scan of the added lines found 0 hits.
