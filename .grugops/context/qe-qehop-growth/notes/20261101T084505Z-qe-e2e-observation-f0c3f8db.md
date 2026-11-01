---
id: 20261101T084505Z-qe-e2e-observation-f0c3f8db
kind: observation
by: qe-e2e
at: 2026-11-01T08:45:05Z
verified_by: 
confidence: high on what was read; series and threshold questions are the Architect's; none blocking
refs:
  - qe-qehop-growth
  - T-QEHOP-GROWTH
  - N8-LANE
  - NFR-008
  - ADR-0035
  - ADR-0046
  - bapm-tranche2-ruling
  - tools/grugops/qe-hop-integrity.test.ts
  - qe-ABC-154
  - b9a5c957
  - 833192d7
  - 8dfbabf5
  - 37a93b76
  - qe-ABC-154/20261012T113700Z-qe-e2e-observation-abc154-n8-lane-met-4e153e76
  - QE-QHG-a
  - QE-QHG-b
  - QE-QHG-c
  - QE-QHG-d
  - QE-QHG-e
  - QE-QHG-f
  - grugops/qe-qehop-growth
supersedes: 
seal: sha256:8dd514a9986ba2ac0398c6d8f5cea150b6d86c841193525c04602e9a7bbb5bc6
---

# `qe-qehop-growth` findings: six, none blocking. The state is MET. The lift clause has not fired

- **`QE-QHG-a` (LOW, to Architect/Design): this MET depends on A1's one-tick floor.**
  - The CPU twin median is +0.010 s (2.703 % of B 0.370 s), and the wall twin is +0.005 s (2.128 % of 0.235 s). Both are admitted only by the floor. Under the pre-A1 1.5 % limit, w1 would be INADMISSIBLE.
  - On `oeselg-dev` B is 0.370 s, well under A1's 0.667 s, so every future read of this set will sit in the floor's regime.
  - A1's rollback watch applies, but nothing here is near a flip. The median is 0.195 s under 650 ms, and the upper end is 0.160 s under.
- **`QE-QHG-b` (INFO, to Architect/Design): this is the set's first admissible twin R on `oeselg-dev`: CPU 0.030 s, wall 0.020 s.**
  - F = 0.020 / 0.020 s was read on the M3.
  - **If the re-base continues the series**, the three most recent are QE3 w3, `qe-ABC-154` w1 and this window. Their medians are CPU (0.020, 0.030, 0.030) → **0.030 s** and wall (0.020, 0.030, 0.020) → 0.020 s.
  - **If the host change breaks the series** (`ADR-0042` ruling 6, `ADR-0040` decision 4), this is a single reading at 0.030 / 0.020 s.
  - Either way F stays far below 650 ms, and no cut moves. Which applies is the Architect's call.
- **`QE-QHG-c` (LOW, method, to Architect/Design): B3's method names a macOS harness that cannot run on the reference host.**
  - `qe-ABC-154`'s pre-registration names `lane144b.mjs` (`652b7793…`) and `gate.sh` (`5335905a…`) by sha256. Both call `sysctl vm.loadavg`, `pmset` and `notifyutil`, which `oeselg-dev` does not have. It also spells `npx`, which QE briefs fence.
  - This hop's port keeps the shape: `probe/lane-qeg.mjs`, `gate-qeg.mjs`, `sampler-qeg.mjs`, `host-qeg.mjs`, `window-qeg.sh` and `readout-qeg.py`.
  - The next T-QEHOP-GROWTH read could name it as the method, so it does not need a fresh port.
- **`QE-QHG-d` (LOW, to Architect/Design): the "same arithmetic" re-fires within a week.**
  - It gives ≈ 4 640–4 700 notes, 4–5 days out at 74–104 notes a day.
  - The projected crossing is ≈ 6 660 notes (≈ 6 230 from the upper end), about 19–32 days out.
  - The full arithmetic is in the threshold note of this task.
- **`QE-QHG-e` (INFO): `main` moved during the hop, records only.**
  - It went from `37a93b76` (4 272) to `f88873d4` (4 275): the `bapm-ABC-248-close` merge at 08:40:20Z, after the arms were built at 08:39:55Z.
  - The test and tool blobs are unchanged. At A3's slope, 3 notes are about 0.25 ms.
  - The read is at `37a93b76`, the tip the brief named.
- **`QE-QHG-f` (INFO): two clock slips in the pre-registration text.**
  - The header says "written 08:45Z" and addendum 1 says "08:41Z". Their commits are 08:39:42Z and 08:40:13Z.
  - Addendum 1 says the commit times are the authority. Both commits come before the first run (08:40:29Z). Nothing was amended.
- **Addendum 1 (recorded, not a finding):** a sampler path bug, found by reading before any run. A symlinked `wN/arms` would have made the lane's own vitest read as foreign. It was fixed with `realpath`, and no rule changed.
- **Lift clause (A3/B3): not fired.**
  - At `37a93b76` only `tools/grugops/qe-hop-integrity.test.ts` reads `.grugops/context`.
  - The eight `src/*.test.ts` hits are comments that name probe paths.
- **No gap is open on this read.** The reads-per-run count (2) is taken from the identical blob, not re-counted here.
