<!-- GENERATED — do not hand-edit. Re-run: node scripts/context-io.js render <task> -->
# Context: security-nfr-ABC-202

## Current state

| at | kind | by | confidence | verified_by | note |
| --- | --- | --- | --- | --- | --- |
| 2026-10-23T14:00:53Z | decision | security-nfr | high (placement transcribes owner-accepted M1/M8(a) text; one reading on one host, other hosts UNKNOWN - verify) |  | # Security/NFR on `ABC-202`: **PASS.** `ADR-0044` candidate row (ii) is placed as **`NFR-012`**, its bounds M1's and M8(a)'s unchanged, with `raw/run.sh` as the instrument. `QE-202-a` is folded. I agree with QE's host ruling. The STOP did not fire |
| 2026-10-23T14:00:53Z | observation | security-nfr | high (direct reads of raw files on main a2d7dda7; SHA256SUMS 23/23; nothing run) |  | # Security/NFR on `ABC-202`: QE's raw files re-read and its counts reproduced (records only, nothing run) |
