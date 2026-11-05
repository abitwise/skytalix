# qe-ABC-282 verdict: **PASS_WITH_GAPS with ONE BLOCKING GAP. It does NOT sign UAT.** Every bar that was read is MET, A6 at 56.5 / 100 included, but A4 is unread and needs the owner's word (QE-282-a). Do not merge on this note

QE/E2E, read at `04ebeb7e` (`src/` `d235214c`) against `22931005`, by PREREG `…416a183f`'s rule: "every read bar MET and A4 unread" is PASS_WITH_GAPS, not signing UAT. The 2026-10-22 ruling signs only on PASS, or PASS_WITH_GAPS with no blocking gap.

| bar | state | note |
|---|---|---|
| A6 | **MET**, 45 / 32 / 23 = 56.5, 100 / 100, 0 faults, 0 on time | a6 note |
| A0, A1, A2, A3, A5, D12, non-clock identity | **MET** | offline note |
| A4 (M1, M2 at 40/15) | **`UNKNOWN - verify`, not run** | QE-282-a |
| lane budget | **MET**, +0.020 s; NFR-008 9.48 s | nfr note |
| gates, skips, -t lines | **MET** | offline note |
| QE-300-a | closed, `ABC-300` A6 MET | a6 note |

- F1–F4, F6, F7 did not fire. F5 is unread.
- `ABC-221` A10 and D12's two readings are pins.
- **What turns this into a signing verdict:** the owner approves A4's run (about 3.5 h), it reads M1 and M2 MET, and QE records that. A4 MET gives PASS_WITH_GAPS with no blocking gap. A miss is F5, to Architect/Design. **A6 is not re-played either way.**
- Nothing was pushed or merged.
