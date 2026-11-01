# QE `qe-qehop-growth`: T-QEHOP-GROWTH grades **MET** (`ADR-0035` B3). Architect/Design writes the reading and sets the next threshold. Nothing goes to the owner

**Grade: MET.** Window 1 at `main` `37a93b76` (4 272 note files) is admissible under A1, and it reads H−B CPU +0.455 s (+0.440..+0.490), twin +0.010 s, R 0.030 s, n = 8, 0 rounds discarded. The reading itself is note `…reading`, in this task.

**B3, as written:**
- **MET:** write the reading, and Architect/Design sets the next threshold by the same arithmetic.
  - QE states the arithmetic in the threshold note of this task. QE does not write it into the ADR or the catalog.
- NOT MET would have gone to the owner. NOT READ would have kept the trigger armed. Neither applies.
- **The trigger at 4 000 is discharged by this reading.** Whether it re-arms, and where, is the Architect's call.

**What the grade rests on, stated rather than hidden:**
- **Pre-registration order (B1).**
  - `833192d7` (08:39:42Z) and addendum 1 `8dfbabf5` (08:40:13Z) both descend from `e7d8a09f`, and both were committed before the first run (the pre-flight at 08:40:29Z).
  - The file has to reach `main` with blob `8dfbabf5:…/probe/preregistration.txt`. That is the Orchestrator's merge, because QE never merges.
- **A1's one-tick floor.**
  - The CPU twin median is +0.010 s, which is 2.703 % of B (0.370 s). Under the pre-A1 1.5 % limit (5.55 ms) the window would be INADMISSIBLE.
  - **So, unlike `qe-ABC-154`, this state depends on A1.** A1 binds wherever B is below 0.667 s, and this host's B is 0.370 s.
  - A1's rollback clause watches exactly this case: "a twin that only the floor admits … followed by readings that flip sides of a bound". This reading is 0.195 s under 650 ms at the median and 0.160 s under at the upper end, so no tick-level effect can flip it.
  - Finding `QE-QHG-a`.
- **The host port.** `lane144b.mjs` and `gate.sh` cannot run on `oeselg-dev`, so the harness is a port with the same shape (finding `QE-QHG-c`). The readout derives from `readout-qe5.py`, and its self-test reproduces `qe-ABC-154` w1 line for line, apart from two labels.

**Not affected:** `NFR-008`'s level, `N8-LANE`'s 650 ms, every catalog row, and F (`QE-QHG-b` is reported, not ruled).
